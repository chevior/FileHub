import os
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Annotated
from uuid import uuid4

import bcrypt
from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr, Field

from database import database, initialize_database

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = Path(os.getenv("FILEHUB_UPLOAD_DIR", BASE_DIR.parent / "uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
JWT_SECRET = os.getenv("JWT_SECRET", "filehub-local-development-secret-change-me")
MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", 100 * 1024 * 1024))

app = FastAPI(title="FileHub API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[value.strip() for value in os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
security = HTTPBearer(auto_error=False)

class RegisterPayload(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: str = Field(min_length=5, max_length=254)
    password: str = Field(min_length=8, max_length=128)

class LoginPayload(BaseModel):
    email: str
    password: str

class FolderPayload(BaseModel):
    name: str = Field(min_length=1, max_length=80)

def create_token(user_id: int):
    expires = datetime.now(timezone.utc) + timedelta(days=7)
    return jwt.encode({"sub": str(user_id), "exp": expires}, JWT_SECRET, algorithm="HS256")

def current_user(credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)]):
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        user_id = int(payload.get("sub", ""))
    except (JWTError, TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired token") from None
    with database() as connection:
        user = connection.execute(
            "SELECT id, name, email, created_at FROM users WHERE id = ?", (user_id,)
        ).fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="User no longer exists")
    return dict(user)

def serialize_file(row):
    item = dict(row)
    item["is_favorite"] = bool(item["is_favorite"])
    item["is_trashed"] = bool(item["is_trashed"])
    return item

def owned_file(connection, file_id: int, user_id: int):
    row = connection.execute(
        "SELECT * FROM files WHERE id = ? AND user_id = ?", (file_id, user_id)
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="File not found")
    return row

@app.on_event("startup")
def startup():
    initialize_database()

@app.get("/")
def home():
    return {"name": "FileHub API", "status": "online", "docs": "/docs"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}

@app.post("/api/auth/register", status_code=201)
def register(payload: RegisterPayload):
    name, email = payload.name.strip(), payload.email.lower().strip()
    if "@" not in email:
        raise HTTPException(status_code=422, detail="Enter a valid email address")
    password_hash = bcrypt.hashpw(payload.password.encode(), bcrypt.gensalt()).decode()
    try:
        with database() as connection:
            cursor = connection.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                (name, email, password_hash),
            )
            user_id = cursor.lastrowid
    except Exception as exc:
        if "UNIQUE" in str(exc).upper():
            raise HTTPException(status_code=409, detail="An account already uses this email") from None
        raise
    return {"token": create_token(user_id), "user": {"id": user_id, "name": name, "email": email}}

@app.post("/api/auth/login")
def login(payload: LoginPayload):
    with database() as connection:
        user = connection.execute(
            "SELECT * FROM users WHERE email = ? COLLATE NOCASE", (payload.email.strip(),)
        ).fetchone()
    if not user or not bcrypt.checkpw(payload.password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return {"token": create_token(user["id"]), "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}

@app.get("/api/auth/me")
def me(user=Depends(current_user)):
    return user

@app.get("/api/dashboard")
def dashboard(view: str = "files", search: str = "", folder_id: int | None = None, user=Depends(current_user)):
    filters, params = ["f.user_id = ?"], [user["id"]]
    if view == "trash":
        filters.append("f.is_trashed = 1")
    else:
        filters.append("f.is_trashed = 0")
        if view == "favorites":
            filters.append("f.is_favorite = 1")
    if folder_id is not None:
        filters.append("f.folder_id = ?")
        params.append(folder_id)
    if search.strip():
        filters.append("LOWER(f.name) LIKE ?")
        params.append(f"%{search.strip().lower()}%")
    with database() as connection:
        files = connection.execute(f"""
            SELECT f.*, folders.name AS folder_name FROM files f
            LEFT JOIN folders ON folders.id = f.folder_id
            WHERE {' AND '.join(filters)} ORDER BY f.updated_at DESC, f.id DESC
        """, params).fetchall()
        folders = connection.execute(
            "SELECT id, name, created_at FROM folders WHERE user_id = ? ORDER BY name COLLATE NOCASE",
            (user["id"],),
        ).fetchall()
        metrics = connection.execute("""
            SELECT COUNT(*) AS file_count,
            COALESCE(SUM(CASE WHEN is_trashed = 0 THEN size ELSE 0 END), 0) AS used_bytes,
            SUM(CASE WHEN is_favorite = 1 AND is_trashed = 0 THEN 1 ELSE 0 END) AS favorite_count,
            SUM(CASE WHEN is_trashed = 1 THEN 1 ELSE 0 END) AS trash_count
            FROM files WHERE user_id = ?
        """, (user["id"],)).fetchone()
    return {"files": [serialize_file(row) for row in files], "folders": [dict(row) for row in folders], "metrics": dict(metrics)}

@app.post("/api/folders", status_code=201)
def create_folder(payload: FolderPayload, user=Depends(current_user)):
    name = payload.name.strip()
    try:
        with database() as connection:
            cursor = connection.execute("INSERT INTO folders (user_id, name) VALUES (?, ?)", (user["id"], name))
            folder_id = cursor.lastrowid
    except Exception as exc:
        if "UNIQUE" in str(exc).upper():
            raise HTTPException(status_code=409, detail="A folder with this name already exists") from None
        raise
    return {"id": folder_id, "name": name}

@app.post("/api/files/upload", status_code=201)
async def upload_file(upload: Annotated[UploadFile, File()], folder_id: Annotated[int | None, Form()] = None, user=Depends(current_user)):
    original_name = Path(upload.filename or "untitled").name[:255]
    stored_name = f"{uuid4().hex}{Path(original_name).suffix.lower()}"
    target, size = UPLOAD_DIR / stored_name, 0
    if folder_id is not None:
        with database() as connection:
            folder = connection.execute("SELECT id FROM folders WHERE id = ? AND user_id = ?", (folder_id, user["id"])).fetchone()
        if not folder:
            raise HTTPException(status_code=404, detail="Folder not found")
    try:
        with target.open("wb") as output:
            while chunk := await upload.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_UPLOAD_BYTES:
                    raise HTTPException(status_code=413, detail="File exceeds the 100 MB upload limit")
                output.write(chunk)
        with database() as connection:
            cursor = connection.execute("""
                INSERT INTO files (user_id, folder_id, name, stored_name, content_type, size)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (user["id"], folder_id, original_name, stored_name, upload.content_type or "application/octet-stream", size))
            file_id = cursor.lastrowid
    except Exception:
        target.unlink(missing_ok=True)
        raise
    return {"id": file_id, "name": original_name, "size": size}

@app.get("/api/files/{file_id}/download")
def download_file(file_id: int, user=Depends(current_user)):
    with database() as connection:
        row = owned_file(connection, file_id, user["id"])
    path = UPLOAD_DIR / row["stored_name"]
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Stored file is missing")
    return FileResponse(path, media_type=row["content_type"], filename=row["name"])

@app.patch("/api/files/{file_id}/favorite")
def toggle_favorite(file_id: int, user=Depends(current_user)):
    with database() as connection:
        row = owned_file(connection, file_id, user["id"])
        value = 0 if row["is_favorite"] else 1
        connection.execute("UPDATE files SET is_favorite = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (value, file_id))
    return {"is_favorite": bool(value)}

@app.patch("/api/files/{file_id}/{action}")
def update_file_state(file_id: int, action: str, user=Depends(current_user)):
    if action not in {"trash", "restore"}:
        raise HTTPException(status_code=404, detail="Unknown file action")
    with database() as connection:
        owned_file(connection, file_id, user["id"])
        value = 1 if action == "trash" else 0
        connection.execute("UPDATE files SET is_trashed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (value, file_id))
    return {"message": "File moved to trash" if value else "File restored"}

@app.delete("/api/files/{file_id}", status_code=204)
def delete_file(file_id: int, user=Depends(current_user)):
    with database() as connection:
        row = owned_file(connection, file_id, user["id"])
        if not row["is_trashed"]:
            raise HTTPException(status_code=409, detail="Move the file to trash before deleting it")
        connection.execute("DELETE FROM files WHERE id = ?", (file_id,))
    (UPLOAD_DIR / row["stored_name"]).unlink(missing_ok=True)

@app.post("/api/files/{file_id}/share")
def share_file(file_id: int, user=Depends(current_user)):
    with database() as connection:
        row = owned_file(connection, file_id, user["id"])
        if row["is_trashed"]:
            raise HTTPException(status_code=409, detail="Restore the file before sharing it")
        existing = connection.execute("SELECT token FROM shared_links WHERE file_id = ? AND user_id = ?", (file_id, user["id"])).fetchone()
        token = existing["token"] if existing else secrets.token_urlsafe(24)
        if not existing:
            connection.execute("INSERT INTO shared_links (file_id, user_id, token) VALUES (?, ?, ?)", (file_id, user["id"], token))
    return {"token": token, "path": f"/shared/{token}"}

@app.get("/api/shared/{token}")
def shared_file(token: str):
    with database() as connection:
        row = connection.execute("""
            SELECT files.name, files.size, files.content_type, users.name AS owner_name, shared_links.created_at
            FROM shared_links JOIN files ON files.id = shared_links.file_id
            JOIN users ON users.id = shared_links.user_id
            WHERE shared_links.token = ? AND files.is_trashed = 0
        """, (token,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Shared file not found")
    return dict(row)

@app.get("/api/shared/{token}/download")
def download_shared_file(token: str):
    with database() as connection:
        row = connection.execute("""
            SELECT files.* FROM shared_links JOIN files ON files.id = shared_links.file_id
            WHERE shared_links.token = ? AND files.is_trashed = 0
        """, (token,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Shared file not found")
    path = UPLOAD_DIR / row["stored_name"]
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Stored file is missing")
    return FileResponse(path, media_type=row["content_type"], filename=row["name"])

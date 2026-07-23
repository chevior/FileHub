# FileHub

FileHub is a personal cloud-storage application built with FastAPI, React,
TypeScript, and SQLite. It provides a focused workspace for uploading,
organizing, downloading, sharing, favoriting, recovering, and permanently
deleting files.

## Features

- Account registration and secure password hashing
- Seven-day JWT authentication
- Multi-file uploads with a configurable size limit
- Personal folders and filename search
- Favorites, trash, restore, and permanent deletion
- Authenticated downloads and public share links
- Storage usage and file-count metrics
- Responsive desktop and mobile interface
- SQLite persistence with ownership checks on every private file operation

## Project structure

```text
FileHub/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── html/
│   ├── css/
│   ├── js/
│   ├── assets/
│   ├── src/
│   └── package.json
└── uploads/
```

## Run locally

### Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000`. Interactive API documentation is
available at `http://127.0.0.1:8000/docs`.

### Frontend

You can run either the existing React/Vite app or preview the static HTML/CSS/JS front-end pages.

#### React/Vite frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

The React frontend runs at `http://localhost:5173`.

To use a different backend URL, create `frontend/.env.local`:

```text
VITE_API_URL=http://127.0.0.1:8000
```

#### Static HTML/CSS/JS frontend

The repository also includes a production-style static front-end in `frontend/html/`, with shared assets in `frontend/css/`, `frontend/js/`, and `frontend/assets/`.

Preview it locally with:

```powershell
cd frontend
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/html/login.html`.

## Verification

```powershell
cd frontend
npm run lint
npm run build

cd ..
python -m py_compile backend/main.py backend/database.py
```

## Production notes

- Replace `JWT_SECRET` with a strong secret.
- Restrict `CORS_ORIGINS` to the deployed frontend.
- Store uploads on durable private storage.
- Place the API behind HTTPS.
- PostgreSQL can replace SQLite later without changing the frontend contract.

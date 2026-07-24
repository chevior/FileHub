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
|-- backend/
|   |-- main.py
|   |-- database.py
|   |-- requirements.txt
|   `-- .env.example
|-- frontend/
|   |-- html/
|   |-- css/
|   |-- js/
|   |-- assets/
|   |-- src/
|   `-- package.json
|-- package.json
`-- uploads/
```

## Run locally

### Full app from Python

The simplest local run path is `backend/main.py`. It serves the API and, when
needed, builds the React frontend so `http://127.0.0.1:8000/` opens the app.

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python main.py
```

Open `http://127.0.0.1:8000/` for the app. Interactive API documentation is
available at `http://127.0.0.1:8000/docs`, and API routes stay under `/api`.

### Frontend development

For live React/Vite development, run npm from the repository root:

```powershell
npm install
npm run dev
```

The React frontend runs at `http://localhost:5173` and talks to the backend at
`http://127.0.0.1:8000/api`.

To use a different backend URL, create `frontend/.env.local`:

```text
VITE_API_URL=http://127.0.0.1:8000
```

Root npm scripts are provided for convenience:

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

### Login

There are no default credentials. Create an account from the Register page, then
sign in with that email and password. Passwords must be at least 8 characters.

### Static HTML/CSS/JS frontend

The repository also includes a production-style static front-end in
`frontend/html/`, with shared assets in `frontend/css/`, `frontend/js/`, and
`frontend/assets/`.

Preview it locally with:

```powershell
cd frontend
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/html/login.html`.

## Verification

```powershell
npm run lint
npm run build
python -m py_compile backend/main.py backend/database.py
```

If lint runs out of memory on Windows, retry with a larger Node heap:

```powershell
$env:NODE_OPTIONS='--max-old-space-size=4096'
npm run lint
```

## Production notes

- Replace `JWT_SECRET` with a strong secret.
- Restrict `CORS_ORIGINS` to the deployed frontend.
- Store uploads on durable private storage.
- Place the API behind HTTPS.
- PostgreSQL can replace SQLite later without changing the frontend contract.

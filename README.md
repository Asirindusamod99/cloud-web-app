# Notes CRUD App

A minimal full-stack CRUD application built with:

| Layer    | Technology                  |
|----------|-----------------------------|
| Backend  | Django 4.2 + Django REST Framework |
| Frontend | React 18 + Vite             |
| Database | PostgreSQL 15               |
| DevOps   | Docker + Docker Compose     |

## Features

- **Create** a note with title (required) and description
- **View** a live list of all notes, newest first
- **Edit** any note inline
- **Delete** any note (with confirmation)

## Model: `Note`

| Field        | Type      | Notes           |
|-------------|-----------|-----------------|
| id          | BigInt PK | auto-generated  |
| title       | CharField | required        |
| description | TextField | optional        |
| created_at  | DateTime  | auto-set        |

## API Endpoints

| Method | URL                  | Action       |
|--------|----------------------|--------------|
| GET    | `/api/notes/`        | List all     |
| POST   | `/api/notes/`        | Create       |
| GET    | `/api/notes/{id}/`   | Retrieve one |
| PUT    | `/api/notes/{id}/`   | Full update  |
| PATCH  | `/api/notes/{id}/`   | Partial update |
| DELETE | `/api/notes/{id}/`   | Delete       |

## Quick Start (Docker)

```bash
# 1. Clone / enter the project
cd apps

# 2. Start all services
docker compose up --build

# 3. Open the app
#    Frontend → http://localhost:5173
#    API      → http://localhost:8000/api/notes/
```

## Running Without Docker

### Backend
```bash
cd backend
python -m venv venv && venv\Scripts\activate   # Windows
pip install -r requirements.txt

# Set env vars (or export them)
$env:DATABASE_URL="postgresql://notesuser:notespassword@localhost:5432/notesdb"
$env:DJANGO_SECRET_KEY="dev-secret"

python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:5173
```

## Project Structure

```
apps/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── manage.py
│   ├── requirements.txt
│   ├── notes_project/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── notes/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       └── migrations/
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js
        └── index.css
```

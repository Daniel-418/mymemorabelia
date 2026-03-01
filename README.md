# MyMemorabelia

> A digital time capsule service — create multimedia memories today, receive them by email on a future date.

**Live at [mymemorabelia.com](https://mymemorabelia.com)** · Deployed on AWS EC2

![Django](https://img.shields.io/badge/Django-5-092E20?logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-REST_Framework-red)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-state-orange)
![Celery](https://img.shields.io/badge/Celery-37814A?logo=celery&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white)

---

## Overview

MyMemorabelia lets users compose capsules containing text, images, videos, audio clips, and music links. Each capsule has a scheduled delivery date — when that date arrives, Celery automatically sends the capsule contents to the user's email. The full-stack application is containerized with Docker and served behind Nginx on AWS EC2.

---

## Architecture

### System Diagram

```
Browser
  │
  └─► Nginx :80
        ├─ /api/*    → Django (Gunicorn :8000)
        ├─ /admin/*  → Django
        ├─ /static/  → filesystem
        └─ /*        → React SPA (nginx:alpine :80)
                           │
                    Vite proxy (/api → :8000) [dev only]

Django ──► PostgreSQL
       ──► Redis ──► Celery Worker (email delivery)
                └──► Celery Beat  (cron: every 1 min)
```

### Backend — Django Apps

**`capsule`** — core business logic
- Models: `CustomUser` (email as username), `Capsule`, `CapsuleItem`, `DeliveryLog`
- `services.py`: `MailDelivery.send_due_capsules()` — queries and delivers pending capsules
- `tasks.py`: Celery task wired to Celery Beat

**`capsule_api`** — REST API layer
- DRF views, serializers, and URL routing under `/api/`
- Auto-generated OpenAPI docs via `drf-spectacular`

### Frontend — React SPA

| Path | Responsibility |
|---|---|
| `src/api/client.ts` | Axios instance (`baseURL: '/api'`); reads `auth_token` from `localStorage`, attaches `Authorization: Token` header |
| `src/api/auth.ts` | `authApi.login()` / `authApi.register()` |
| `src/api/capsules.ts` | `listCapsules()`, `createCapsule()`, `listCapsuleItems()`, `createCapsuleItem()` (multipart) |
| `src/store/authStore.ts` | Zustand store; token persisted to `localStorage`, user held in memory |
| `src/pages/App.tsx` | React Router with `<ProtectedRoute>` — redirects to `/login` when unauthenticated |

Vite dev proxy forwards `/api` → `http://localhost:8000`, so the same `baseURL: '/api'` works in both dev and Docker.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Zustand, Axios |
| Backend | Django 5, Django REST Framework, drf-spectacular |
| Database | PostgreSQL (prod) / SQLite (dev) |
| Task Queue | Celery + Redis |
| Storage | AWS S3 (prod) / local filesystem (dev) |
| Infra | Docker Compose, Nginx, Gunicorn |
| Auth | DRF Token auth (`Authorization: Token <token>`) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register/` | Register a new user |
| `POST` | `/api/login/` | Log in and receive an auth token |
| `GET` | `/api/capsules/` | List all capsules for the authenticated user |
| `POST` | `/api/capsules/create/` | Create a new time capsule |
| `GET` | `/api/capsules/<id>/items/` | List all items in a capsule |
| `POST` | `/api/capsules/<id>/items/create/` | Add an item to a capsule (multipart) |

**Interactive docs:** `/api/schema/swagger-ui/` · `/api/schema/redoc/`

### Response Shapes

- **Login success:** `{ "token": "...", "user": { ... } }`
- **Auth errors:** `{ "details": "..." }` (note: `details`, not `detail`)
- **Registration errors:** DRF validation dict `{ "field": ["msg"] }` — flatten with `Object.values(errors).flat()[0]`

### Usage Examples

**Register:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "test@example.com",
  "password": "strongpassword123",
  "timezone": "UTC"
}' https://mymemorabelia.com/api/register/
```

**Login:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "test@example.com",
  "password": "strongpassword123"
}' https://mymemorabelia.com/api/login/
```

**Create a capsule:**
```bash
curl -X POST \
  -H "Authorization: Token YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Capsule", "deliver_on": "2028-02-10T10:00:00Z"}' \
  https://mymemorabelia.com/api/capsules/create/
```

**Add a file to a capsule:**
```bash
curl -X POST \
  -H "Authorization: Token YOUR_AUTH_TOKEN" \
  -F "kind=image" \
  -F "file=@/path/to/image.jpg" \
  https://mymemorabelia.com/api/capsules/1/items/create/
```

---

## Local Development

### Backend

```bash
cd backend
source .venv/bin/activate
python manage.py migrate
python manage.py runserver
# API available at http://127.0.0.1:8000
```

**`backend/.env`:**
```env
ENV="dev"
DJANGO_SECRET_KEY='your-super-secret-key-here'
DATABASE_URL=sqlite:///db.sqlite3
```

`ENV=dev` enables: DEBUG mode, SQLite, local file storage (`backend/files/`), console email backend.

### Frontend

```bash
cd frontend/mymemorabelia
npm install
npm run dev   # Vite dev server — proxies /api → localhost:8000
```

The React app is served at `http://localhost:5173`. The Vite proxy ensures API calls reach the Django dev server without CORS issues.

### Celery (optional for dev — required for capsule delivery)

In separate terminals with the virtual environment activated:

```bash
celery -A mymemorabelia worker --loglevel=info
celery -A mymemorabelia beat --loglevel=info
```

---

## Docker — Full Stack

```bash
docker-compose up --build -d
# Visit http://localhost
```

**Services:**

| Service | Description |
|---|---|
| `web` | Django + Gunicorn |
| `db` | PostgreSQL |
| `redis` | Message broker for Celery |
| `celery_worker` | Processes email delivery tasks |
| `celery_beat` | Schedules `send_due_capsules_task` every minute |
| `frontend` | React SPA built and served by nginx:alpine |
| `nginx` | Reverse proxy on port 80 |

**Nginx routing:**
- `/api/`, `/admin/` → Django (`web:8000`)
- `/static/`, `/files/` → filesystem aliases
- `/*` → React SPA with `try_files $uri /index.html` SPA fallback

```bash
docker-compose down        # Stop all services
docker-compose logs -f web # Tail Django logs
```

---

## Capsule Delivery Flow

```
Celery Beat (every 1 min)
  └─► send_due_capsules_task
        └─► MailDelivery.send_due_capsules()
              └─► Query: status=pending, deliver_on ≤ now
                    ├─► Send email with capsule contents
                    ├─► Update status → "sent" or "failed"
                    └─► Write DeliveryLog row
```

---

## Environment Variables

### Dev (minimal)

| Variable | Description |
|---|---|
| `ENV` | `"dev"` — activates SQLite, local storage, console email |
| `DJANGO_SECRET_KEY` | Django secret key |
| `DATABASE_URL` | `sqlite:///db.sqlite3` |

### Prod (additional)

| Variable | Description |
|---|---|
| `ENV` | `"prod"` — activates PostgreSQL, S3, SMTP, security headers |
| `DJANGO_SECRET_KEY` | Django secret key (strong, unique) |
| `DATABASE_URL` | PostgreSQL connection string |
| `AWS_ACCESS_KEY_ID` | AWS credentials for S3 |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials for S3 |
| `AWS_STORAGE_BUCKET_NAME` | S3 bucket for media/static files |
| `EMAIL_HOST` | SMTP server hostname |
| `EMAIL_HOST_USER` | SMTP username |
| `EMAIL_HOST_PASSWORD` | SMTP password |
| `EMAIL_PORT` | SMTP port (typically `587`) |

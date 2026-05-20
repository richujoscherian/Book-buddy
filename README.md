# Book Buddy

Book Buddy is a full-stack web application to manage a personal book library with AI-powered recommendations and AI-generated review drafts.

## What This Project Does

- User registration and login with JWT authentication.
- Add, edit, delete, and view books per user.
- Track reading status, progress, notes, and rating.
- Dashboard analytics with charts for reading status and genre distribution.
- AI recommendation endpoint based on the user's existing reading history.
- AI review endpoint to generate a short personal-style review from notes and rating.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Recharts
- Backend: FastAPI, SQLAlchemy, SQLite, Pydantic
- Auth: JWT (`python-jose`) + password hashing (`passlib` + bcrypt)
- AI: Google Gemini via `google-genai`

## Architecture (High Level)

1. React frontend sends requests to FastAPI backend.
2. Backend validates JWT from `Authorization: Bearer <token>`.
3. SQLAlchemy reads and writes user-specific data in SQLite.
4. AI routes build prompts from stored books and call Gemini API.
5. Backend returns JSON responses to the frontend for rendering.

Detailed architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Project Structure

```text
book buddy/
  backend/
    main.py
    database.py
    models.py
    auth.py
    routers/
      users.py
      books.py
      ai.py
    requirements.txt
    .env.example
  frontend/
    src/
      App.jsx
      components/Navbar.jsx
      pages/
        Login.jsx
        Register.jsx
        Dashboard.jsx
        Books.jsx
        AddBook.jsx
        Recommend.jsx
        AIReview.jsx
```

## Prerequisites

- Python 3.11+ (3.12 recommended)
- Node.js 18+ and npm
- Gemini API key (for AI features)

## Backend Setup

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Update `backend/.env`:

```env
GEMINI_API_KEY=your_real_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Run backend:

```powershell
uvicorn main:app --reload
```

Backend URL: `http://127.0.0.1:8000`

## Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Authentication Flow

1. User registers via `POST /auth/register`.
2. User logs in via `POST /auth/login`.
3. Backend returns JWT access token.
4. Frontend stores token in `localStorage`.
5. Protected requests include `Authorization: Bearer <token>`.
6. Backend verifies token on protected routes.

## Core Routes (Summary)

- Auth: `/auth/register`, `/auth/login`
- Books: `/books/`, `/books/{book_id}`, `/books/stats`
- AI: `/ai/recommend`, `/ai/review`

See full details in [docs/API_REFERENCE.md](docs/API_REFERENCE.md).

## Common Issues

See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

## Presentation Support

Use [docs/PRESENTATION_GUIDE.md](docs/PRESENTATION_GUIDE.md) for slide flow, short speaking script, and viva-style Q&A prep.

## Security Notes

- Do not commit real API keys.
- Keep `backend/.env` local and private.
- Rotate keys immediately if exposed publicly.

## Future Improvements

- Add refresh tokens and auto re-login handling.
- Add server-side pagination and search for books.
- Add unit and integration tests.
- Add Docker and deployment configs.
- Add role-based admin analytics.

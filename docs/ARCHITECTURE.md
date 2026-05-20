# Architecture

## Overview

Book Buddy uses a client-server architecture:

1. React frontend handles UI and user interactions.
2. FastAPI backend handles auth, business logic, persistence, and AI integration.
3. SQLite stores user and book data.
4. Gemini API is used for recommendation and review generation.

## Components

## Frontend

- Routing: `frontend/src/App.jsx`
- Navigation: `frontend/src/components/Navbar.jsx`
- Pages:
  - Auth: `Login`, `Register`
  - Books: `Books`, `AddBook`
  - Analytics: `Dashboard`
  - AI: `Recommend`, `AIReview`
- HTTP client: Axios
- Charts: Recharts

## Backend

- Entry point: `backend/main.py`
- Database layer:
  - config/session: `backend/database.py`
  - models: `backend/models.py`
- Auth utilities: `backend/auth.py`
- Routers:
  - `backend/routers/users.py`
  - `backend/routers/books.py`
  - `backend/routers/ai.py`

## Data Model

## `users` table

- `id` (PK)
- `username` (unique)
- `email` (unique)
- `hashed_password`

## `books` table

- `id` (PK)
- `title`
- `author`
- `genre`
- `status` (`Reading` / `Completed` / `Wishlist`)
- `total_pages`
- `current_page`
- `notes`
- `rating`
- `owner_id` (application-level link to user)

## Request Flow

1. User logs in from frontend.
2. Backend validates credentials and returns JWT.
3. Frontend stores token in `localStorage`.
4. Protected requests include `Authorization` header.
5. Backend extracts user ID from token and scopes DB query by `owner_id`.
6. Response is returned as JSON.

## AI Request Flow

1. Frontend calls `/ai/recommend` or `/ai/review`.
2. Backend verifies user token and fetches user books.
3. Backend creates prompt context from stored book data.
4. Backend calls Gemini model configured by `GEMINI_MODEL`.
5. Backend maps provider errors to user-readable HTTP errors.
6. Frontend displays AI response or mapped error detail.


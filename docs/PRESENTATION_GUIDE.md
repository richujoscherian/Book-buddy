# Presentation Guide

Use this guide for a short project presentation (4-6 minutes).

## Slide Plan

## 1) Title and Problem

Title: `Book Buddy - AI-Powered Personal Reading Tracker`

Talking points:

- People track books manually in scattered notes/apps.
- Hard to summarize progress or get personalized suggestions.
- Need one place for tracking + insights + AI assistance.

## 2) Solution Overview

Talking points:

- Full-stack web app with authentication.
- Users manage personal book collection.
- Dashboard analytics for reading behavior.
- AI recommendations and AI-generated reviews.

## 3) Features

- Register/Login with secure password hashing and JWT.
- Add/Edit/Delete books with status, pages, notes, rating.
- Status filters and reading progress display.
- Dashboard charts:
  - status distribution
  - genre distribution
- AI Recommendation (`/ai/recommend`)
- AI Review Generator (`/ai/review`)

## 4) Tech Stack and Architecture

- Frontend: React + Vite + Tailwind + Axios + Recharts
- Backend: FastAPI + SQLAlchemy + SQLite
- Auth: JWT (`python-jose`), `passlib` bcrypt hashing
- AI: Gemini API using `google-genai`

Architecture flow:

1. UI sends API requests.
2. JWT is verified for protected routes.
3. DB read/write happens per authenticated user.
4. AI endpoints build prompts from user data and call Gemini.

## 5) Live Demo Flow

1. Register or login.
2. Add 2-3 books with mixed statuses.
3. Open dashboard and show counters/charts.
4. Generate AI recommendations.
5. Select a completed book and generate AI review.

## 6) Challenges and Fixes

- Invalid token (expired JWT): solved by relogin and token handling.
- Large Git changes from generated folders: solved via proper `.gitignore`.
- AI quota and model issues: handled with improved backend error mapping.

## 7) Future Scope

- Refresh tokens and session management.
- Search/sort/pagination.
- Better prompt tuning and formatting output.
- Deployment via Docker + CI/CD.
- Tests and monitoring.

## Short Speaking Script (60-90 Seconds)

"Book Buddy is a full-stack application designed to help users track their reading and use AI to enhance their reading workflow.  
Users can register and log in securely, then add and manage books with details like genre, reading status, page progress, personal notes, and ratings.  
The dashboard provides visual insights such as reading status breakdown and genre distribution.  
On top of CRUD functionality, the app includes two AI features: personalized recommendations based on reading history, and automatic review generation based on notes and ratings for a selected book.  
The frontend is built with React and Tailwind, while the backend uses FastAPI, SQLite, and JWT authentication.  
Overall, the project combines personal productivity with AI-driven personalization in a simple and practical way."

## Possible Viva Questions and Quick Answers

Q: Why FastAPI?  
A: FastAPI gives fast development, strong typing with Pydantic, and automatic docs support.

Q: How is data isolation handled?  
A: Every protected route extracts user ID from JWT and filters queries by `owner_id`.

Q: Why SQLite?  
A: SQLite is lightweight and ideal for local development/prototype demos.

Q: What happens if AI quota is exceeded?  
A: API returns clear `429`/provider messages and frontend shows the detail.


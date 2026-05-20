# Frontend (React + Vite)

This is the frontend application for Book Buddy.

## Stack

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts

## Run Locally

```powershell
cd frontend
npm install
npm run dev
```

Default URL: `http://localhost:5173`

## Main Pages

- `/login`: user login
- `/register`: user registration
- `/dashboard`: charts and reading stats
- `/books`: list/filter books
- `/books/add`: create book
- `/books/edit/:bookId`: edit existing book
- `/recommend`: AI recommendations
- `/review`: AI review generator

## Backend Dependency

Frontend currently calls backend at:

- `http://127.0.0.1:8000`

Make sure backend is running before testing this UI.


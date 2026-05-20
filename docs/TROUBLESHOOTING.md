# Troubleshooting

This page covers common errors seen during development and demo runs.

## 1) `401 Invalid token` while adding/viewing books

Cause:

- JWT expired (token lifetime is 30 minutes), or
- token in `localStorage` is stale/corrupted.

Fix:

1. Logout from app.
2. Login again to get a fresh token.
3. Retry action.

If still failing:

1. Clear browser local storage for `token` and `username`.
2. Ensure backend is running from the same project and same auth secret.

## 2) `500 Internal Server Error` in AI routes

Cause:

- Upstream Gemini API issue, wrong model, invalid key, or missing env variables.

Fix:

1. Check `backend/.env` contains:
   - `GEMINI_API_KEY=...`
   - `GEMINI_MODEL=gemini-2.5-flash` (or another supported model)
2. Restart backend after `.env` changes.
3. Check API response detail message in UI or terminal logs.

## 3) `429 RESOURCE_EXHAUSTED` from Gemini

Cause:

- Gemini quota exceeded or free-tier limit exhausted.

Fix:

1. Check Google AI Studio / Google Cloud quota usage.
2. Wait for limit reset if it is per-minute.
3. Enable billing or use a project with available quota.

## 4) `Gemini model ... unavailable`

Cause:

- Selected model not enabled for your key/project/region.

Fix:

1. Change `GEMINI_MODEL` in `backend/.env`.
2. Restart backend.

## 5) VS Code warning: too many active changes

Cause:

- Untracked/tracked large generated folders like `backend/venv`, `frontend/node_modules`.

Fix:

1. Ensure ignore rules exist in root `.gitignore`.
2. If tracked previously, remove from Git index:
   - `git rm -r --cached backend/venv`
   - `git rm -r --cached frontend/node_modules`
3. Commit cleanup.

## 6) CORS error in browser

Cause:

- Frontend URL mismatch with backend CORS allowlist.

Fix:

1. Backend currently allows `http://localhost:5173`.
2. If frontend runs on different host/port, update `allow_origins` in `backend/main.py`.

## 7) `.env` terminal injection notification in VS Code

Cause:

- Python extension terminal env injection disabled.

Important:

- This does not directly cause Gemini quota errors.

Fix (optional convenience):

1. Enable `python.terminal.useEnvFile` in VS Code settings.
2. Set `python.envFile` to `${workspaceFolder}/backend/.env`.

## 8) Frontend cannot connect to backend

Cause:

- Backend not running, wrong API URL, or wrong port.

Fix:

1. Start backend: `uvicorn main:app --reload` in `backend/`.
2. Verify API root in browser: `http://127.0.0.1:8000/`.
3. Check frontend requests target `http://127.0.0.1:8000`.


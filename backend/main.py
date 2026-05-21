from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import os
import models
from routers import users, books, ai
from dotenv import load_dotenv

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

cors_origins_env = os.getenv("CORS_ORIGINS", "")
allow_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]

# Keep localhost origins for local development by default.
if not allow_origins:
    allow_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/auth", tags=["auth"])
app.include_router(books.router, prefix="/books", tags=["books"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])

@app.get("/")
def read_root():
    return {"message": "Book Buddy backend is running!"}

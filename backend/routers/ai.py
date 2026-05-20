from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from pathlib import Path
import logging
from database import get_db
from models import Book
from auth import verify_token
from google import genai
from google.genai import errors as genai_errors
import os
from dotenv import load_dotenv

# Load environment variables from backend/.env regardless of current working directory
BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")
logger = logging.getLogger(__name__)

# Configure Gemini API
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip() or "gemini-2.5-flash"

router = APIRouter()

# Helper to get current user
def get_current_user(authorization: str, db: Session):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return int(payload.get("sub"))


def generate_gemini_text(prompt: str) -> str:
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on the server")

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt
        )
        if not response.text:
            raise HTTPException(status_code=502, detail="AI provider returned an empty response")
        return response.text
    except genai_errors.APIError as err:
        status_code = getattr(err, "status_code", None)
        error_text = str(err)

        if status_code == 429:
            raise HTTPException(
                status_code=429,
                detail=f"Gemini quota exceeded for {GEMINI_MODEL}. Check plan/billing or wait and retry."
            )
        if status_code in (401, 403):
            raise HTTPException(
                status_code=502,
                detail="Gemini API key is invalid or does not have permission"
            )
        if status_code in (400, 404):
            raise HTTPException(
                status_code=502,
                detail=f"Gemini model '{GEMINI_MODEL}' is unavailable for this key/project. Try another model."
            )
        if status_code and status_code >= 500:
            raise HTTPException(
                status_code=502,
                detail="Gemini service is temporarily unavailable. Please try again."
            )

        logger.exception("Gemini API error")
        raise HTTPException(
            status_code=502,
            detail=f"Gemini provider error ({status_code or 'unknown'}): {error_text}"
        )
    except HTTPException:
        raise
    except Exception as err:
        logger.exception("Unexpected AI generation error")
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error while generating AI response: {type(err).__name__}"
        )

# --- AI Book Recommendation ---

@router.get("/recommend")
def get_recommendations(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    user_id = get_current_user(authorization, db)

    # Get user's books
    books = db.query(Book).filter(Book.owner_id == user_id).all()

    if len(books) == 0:
        return {"recommendation": "Add some books to your library first so I can recommend better books for you!"}

    # Build a summary of user's books
    book_summary = ""
    for book in books:
        book_summary += f"- {book.title} by {book.author} (Genre: {book.genre}, Status: {book.status})\n"

    # Ask Gemini for recommendations
    prompt = f"""
    Based on the following reading history, recommend 5 books this person would enjoy.
    For each book give the title, author, genre and a one sentence reason why they would enjoy it.
    Keep the response clean and easy to read.

    Reading history:
    {book_summary}
    """

    return {"recommendation": generate_gemini_text(prompt)}


# --- AI Review Generator ---

class ReviewRequest(BaseModel):
    book_id: int

@router.post("/review")
def generate_review(
    request: ReviewRequest,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    user_id = get_current_user(authorization, db)

    # Get the specific book
    book = db.query(Book).filter(
        Book.id == request.book_id,
        Book.owner_id == user_id
    ).first()

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if not book.notes and book.rating == 0:
        return {"review": "Please add some notes and a rating to this book first so I can generate a review!"}

    # Ask Gemini to generate a review
    prompt = f"""
    Generate a short, natural and personal book review based on these details:

    Book: {book.title}
    Author: {book.author}
    Genre: {book.genre}
    Rating: {book.rating} out of 5
    Personal notes: {book.notes}

    Write it as if the reader is personally reviewing the book.
    Keep it between 3 to 5 sentences.
    Make it sound natural and thoughtful.
    """

    return {"review": generate_gemini_text(prompt)}

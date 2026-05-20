from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import Book
from auth import verify_token

router = APIRouter()

# Helper function to get current logged in user
def get_current_user(token: str, db: Session):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return int(payload.get("sub"))

# What data we expect when adding or editing a book
class BookRequest(BaseModel):
    title: str
    author: str
    genre: str
    status: str
    total_pages: int
    current_page: int
    notes: Optional[str] = ""
    rating: Optional[float] = 0.0

# Get all books for logged in user
@router.get("/")
def get_books(authorization: str = None, db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    user_id = get_current_user(token, db)
    books = db.query(Book).filter(Book.owner_id == user_id).all()
    return books

# Add a new book
@router.post("/")
def add_book(
    request: BookRequest,
    authorization: str = None,
    db: Session = Depends(get_db)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    user_id = get_current_user(token, db)
    
    new_book = Book(
        title=request.title,
        author=request.author,
        genre=request.genre,
        status=request.status,
        total_pages=request.total_pages,
        current_page=request.current_page,
        notes=request.notes,
        rating=request.rating,
        owner_id=user_id
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

# Edit a book
@router.put("/{book_id}")
def edit_book(
    book_id: int,
    request: BookRequest,
    authorization: str = None,
    db: Session = Depends(get_db)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    user_id = get_current_user(token, db)
    
    book = db.query(Book).filter(
        Book.id == book_id,
        Book.owner_id == user_id
    ).first()
    
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    book.title = request.title
    book.author = request.author
    book.genre = request.genre
    book.status = request.status
    book.total_pages = request.total_pages
    book.current_page = request.current_page
    book.notes = request.notes
    book.rating = request.rating
    
    db.commit()
    db.refresh(book)
    return book

# Delete a book
@router.delete("/{book_id}")
def delete_book(
    book_id: int,
    authorization: str = None,
    db: Session = Depends(get_db)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    user_id = get_current_user(token, db)
    
    book = db.query(Book).filter(
        Book.id == book_id,
        Book.owner_id == user_id
    ).first()
    
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    db.delete(book)
    db.commit()
    return {"message": "Book deleted successfully"}

# Get stats for dashboard
@router.get("/stats")
def get_stats(authorization: str = None, db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    user_id = get_current_user(token, db)
    
    books = db.query(Book).filter(Book.owner_id == user_id).all()
    
    return {
        "total": len(books),
        "reading": len([b for b in books if b.status == "Reading"]),
        "completed": len([b for b in books if b.status == "Completed"]),
        "wishlist": len([b for b in books if b.status == "Wishlist"])
    }
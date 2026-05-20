from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User
from auth import hash_password, verify_password, create_access_token

router = APIRouter()

# What data we expect when registering
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

# What data we expect when logging in
class LoginRequest(BaseModel):
    email: str
    password: str

# Register route
@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = User(
        username=request.username,
        email=request.email,
        hashed_password=hash_password(request.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Account created successfully!"}

# Login route
@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Find user by email
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Check password
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Create and return token
    token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.username
    }
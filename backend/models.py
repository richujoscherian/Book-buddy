from sqlalchemy import Column, Integer, String, Float, Text
from database import Base

# This creates the "users" table in the database
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

# This creates the "books" table in the database
class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String)
    genre = Column(String)
    status = Column(String, default="Wishlist")  # Reading, Completed, Wishlist
    total_pages = Column(Integer, default=0)
    current_page = Column(Integer, default=0)
    notes = Column(Text, default="")
    rating = Column(Float, default=0.0)
    owner_id = Column(Integer)  # links book to a user
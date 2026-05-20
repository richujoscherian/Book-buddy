from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# This is the database file that will be created
SQLALCHEMY_DATABASE_URL = "sqlite:///./bookbuddy.db"

# Create the database engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

# Each request gets its own database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all our database tables
Base = declarative_base()

# This function gives us a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
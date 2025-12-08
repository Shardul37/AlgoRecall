from sqlalchemy import Column, Integer, String, Text, Boolean, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    link = Column(String)
    category = Column(String, index=True)
    flashcard_title = Column(String, nullable=True)
    flashcard_code = Column(Text, nullable=True) # Text allows for long code blocks
    
    # Metadata
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    revisions = relationship("Revision", back_populates="problem")

class Revision(Base):
    __tablename__ = "revisions"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"))
    
    revision_number = Column(Integer, default=1)
    scheduled_date = Column(Date, index=True) # When is it due?
    completed_date = Column(Date, nullable=True) # When did you actually do it?
    
    # Rating: 1 (Forgot), 2 (Struggle), 3 (Mastered)
    rating = Column(Integer, nullable=True) 
    
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    problem = relationship("Problem", back_populates="revisions")
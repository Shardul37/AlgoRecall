from pydantic import BaseModel, ConfigDict
from typing import Optional
from typing import Optional, List, Dict # <--- ADD List and Dict HERE
from datetime import date

# --- Problem Schemas ---
class ProblemBase(BaseModel):
    name: str
    link: str
    category: str
    question: Optional[str] = None
    flashcard_title: Optional[str] = None
    flashcard_code: Optional[str] = None

class ProblemCreate(ProblemBase):
    pass

class Problem(ProblemBase):
    id: int
    is_archived: bool
    # Optional because it's computed
    next_revision_date: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)

# --- Revision Schemas ---
class RevisionComplete(BaseModel):
    rating: int 

class Revision(BaseModel):
    id: int
    problem_id: int
    revision_number: int
    scheduled_date: date
    is_completed: bool

    # Dynamic fields
    is_overdue: bool = False
    days_overdue: int = 0
    problem_name: str
    category: str
    question: Optional[str] = None
    # --- NEW FIELDS ---
    flashcard_title: Optional[str] = None
    flashcard_code: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
    
class CalendarDay(BaseModel):
    date: date
    revisions: List[Revision] # Reusing your existing Revision schema
    
    # We will use this to color the cell
    total_due: int
    completed_count: int
    has_overdue: bool
    
class CategoryStat(BaseModel):
    category: str
    count: int

class AnalyticsResponse(BaseModel):
    total_problems: int
    total_revisions: int
    current_streak: int
    category_breakdown: List[CategoryStat]
    
class RevisionHistoryItem(BaseModel):
    revision_number: int
    completed_date: Optional[date]
    rating: Optional[int]
    
    model_config = ConfigDict(from_attributes=True)

class ProblemDetail(BaseModel):
    id: int
    name: str
    link: str
    category: str
    question: Optional[str] = None
    flashcard_title: Optional[str] = None
    flashcard_code: Optional[str] = None
    next_revision_date: Optional[date] = None
    
    # The new part: Full History
    revisions: List[RevisionHistoryItem]

    model_config = ConfigDict(from_attributes=True)
    

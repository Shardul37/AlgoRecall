from sqlalchemy.orm import Session
from datetime import date, timedelta
from . import models, schemas
from sqlalchemy import extract, func

# Fixed Spaced Repetition Intervals
INTERVALS = [0, 1, 3, 7, 14, 30, 90]

# ... inside crud.py

def get_analytics(db: Session):
    # 1. Basic Counts
    total_problems = db.query(models.Problem).filter(models.Problem.is_archived == False).count()
    total_revisions = db.query(models.Revision).filter(models.Revision.is_completed == True).count()
    
    # 2. Category Breakdown
    # SQL: SELECT category, COUNT(*) FROM problems GROUP BY category
    cat_stats = db.query(
        models.Problem.category, 
        func.count(models.Problem.id)
    ).filter(models.Problem.is_archived == False).group_by(models.Problem.category).all()
    
    # Convert to schema format
    breakdown = [{"category": cat, "count": count} for cat, count in cat_stats]
    
    # 3. Simple Streak Calculation
    # Fetch all unique completed dates, sorted desc
    completed_dates = db.query(models.Revision.completed_date).filter(
        models.Revision.is_completed == True
    ).distinct().order_by(models.Revision.completed_date.desc()).all()
    
    # Flatten list of tuples -> list of dates
    dates = [d[0] for d in completed_dates if d[0]]
    
    current_streak = 0
    if dates:
        today = date.today()
        # Check if we did something today or yesterday to keep streak alive
        if dates[0] == today or dates[0] == (today - timedelta(days=1)):
            current_streak = 1
            # Check backwards
            for i in range(len(dates) - 1):
                if dates[i] - dates[i+1] == timedelta(days=1):
                    current_streak += 1
                else:
                    break
        else:
            current_streak = 0 # Streak broken
            
    return {
        "total_problems": total_problems,
        "total_revisions": total_revisions,
        "current_streak": current_streak,
        "category_breakdown": breakdown
    }

def get_calendar_data(db: Session, month: int, year: int):
    # 1. Fetch data
    revisions = db.query(models.Revision).join(models.Problem).filter(
        extract('month', models.Revision.scheduled_date) == month,
        extract('year', models.Revision.scheduled_date) == year,
        models.Problem.is_archived == False
    ).all()
    
    # 2. Group by Date
    grouped = {}
    
    for rev in revisions:
        d_str = rev.scheduled_date.isoformat() # "2025-10-24"
        if d_str not in grouped:
            grouped[d_str] = []
        
        # Calculate dynamic fields
        today = date.today()
        is_overdue = (not rev.is_completed) and (rev.scheduled_date < today)
        days_late = (today - rev.scheduled_date).days if is_overdue else 0

        # --- KEY FIX: Convert to Pydantic Schema MANUALLY ---
        # This ensures the data is strictly valid JSON before leaving the function
        rev_data = schemas.Revision(
            id=rev.id,
            problem_id=rev.problem_id,
            revision_number=rev.revision_number,
            scheduled_date=rev.scheduled_date,
            is_completed=rev.is_completed,
            is_overdue=is_overdue,
            days_overdue=days_late,
            problem_name=rev.problem.name,
            category=rev.problem.category,
            flashcard_title=rev.problem.flashcard_title,
            flashcard_code=rev.problem.flashcard_code
        )
        
        grouped[d_str].append(rev_data)
        
    return grouped

def create_problem(db: Session, problem: schemas.ProblemCreate):
    # 1. Create the Problem
    db_problem = models.Problem(**problem.dict())
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)
    
    # 2. Schedule First Revision (Day 1 - Tomorrow)
    first_revision = models.Revision(
        problem_id=db_problem.id,
        revision_number=1,
        scheduled_date=date.today() + timedelta(days=1),
        is_completed=False
    )
    db.add(first_revision)
    db.commit()
    
    return db_problem

def get_due_revisions(db: Session):
    today = date.today()
    
    # Fetch all incomplete revisions scheduled for today or earlier
    revisions = db.query(models.Revision).join(models.Problem).filter(
        models.Revision.is_completed == False,
        models.Revision.scheduled_date <= today,
        models.Problem.is_archived == False
    ).all()
    
    # Add dynamic overdue calculation
    result = []
    for rev in revisions:
        days_late = (today - rev.scheduled_date).days
        
        # Create a schema object manually to include dynamic fields
        rev_schema = schemas.Revision(
            id=rev.id,
            problem_id=rev.problem_id,
            revision_number=rev.revision_number,
            scheduled_date=rev.scheduled_date,
            is_completed=rev.is_completed,
            is_overdue=(days_late > 0),
            days_overdue=days_late,
            problem_name=rev.problem.name,
            category=rev.problem.category,
            # --- ADD THESE TWO LINES ---
            flashcard_title=rev.problem.flashcard_title,
            flashcard_code=rev.problem.flashcard_code
        )
        result.append(rev_schema)
        
    return result

def complete_revision(db: Session, revision_id: int, rating: int):
    # 1. Mark current revision as done
    db_rev = db.query(models.Revision).filter(models.Revision.id == revision_id).first()
    if not db_rev:
        return None
    
    db_rev.is_completed = True
    db_rev.completed_date = date.today()
    db_rev.rating = rating
    db.commit()
    
    # 2. Calculate Next Interval
    current_rev_num = db_rev.revision_number
    next_interval = 1 # Default fallback
    
    if rating == 1:
        # Reset! Start over at Day 1
        next_interval = 1
        # Optionally, we could reset revision_number to 1, 
        # but let's keep counting to track total effort.
        
    elif rating == 2:
        # Stagnate/Struggle. 
        # Logic: Use the current interval again (don't move forward in the array)
        # We need to find what the current interval 'was' roughly
        if current_rev_num < len(INTERVALS):
            # If we were at index 3 (7 days), stay at index 3
            idx = max(1, current_rev_num - 1)
            next_interval = INTERVALS[idx]
        else:
            next_interval = 14 # Default struggle plateau
            
    elif rating == 3:
        # Success! Move to next interval
        if current_rev_num < len(INTERVALS):
            next_interval = INTERVALS[current_rev_num]
        else:
            next_interval = 90 # Max cap
            
    # 3. Create Next Revision
    next_date = date.today() + timedelta(days=next_interval)
    
    new_rev = models.Revision(
        problem_id=db_rev.problem_id,
        revision_number=current_rev_num + 1,
        scheduled_date=next_date,
        is_completed=False
    )
    db.add(new_rev)
    db.commit()
    
    return {"message": "Revision logged", "next_date": next_date, "interval": next_interval}
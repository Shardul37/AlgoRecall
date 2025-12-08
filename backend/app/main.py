from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Dict, List # <--- Ensure these are imported

from . import models, schemas, crud, database

# Create Tables (Simple migration)
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="AlgoRecall API")

# Allow React to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    return database.get_db()

@app.get("/")
def read_root():
    return {"status": "AlgoRecall Backend is Running"}

# --- PROBLEMS ---

@app.post("/api/problems", response_model=schemas.Problem)
def create_problem(problem: schemas.ProblemCreate, db: Session = Depends(database.get_db)):
    return crud.create_problem(db=db, problem=problem)

# --- REVISIONS ---

@app.get("/api/revisions/today", response_model=List[schemas.Revision])
def get_today_revisions(db: Session = Depends(database.get_db)):
    """
    Get everything due today + everything overdue.
    """
    return crud.get_due_revisions(db)

@app.post("/api/revisions/{revision_id}/complete")
def complete_revision(revision_id: int, submission: schemas.RevisionComplete, db: Session = Depends(database.get_db)):
    result = crud.complete_revision(db, revision_id, submission.rating)
    if not result:
        raise HTTPException(status_code=404, detail="Revision not found")
    return result

@app.get("/api/calendar", response_model=Dict[str, List[schemas.Revision]]) # <--- ADD response_model
def get_calendar(month: int, year: int, db: Session = Depends(database.get_db)):
    data = crud.get_calendar_data(db, month, year)
    return data

@app.get("/api/analytics", response_model=schemas.AnalyticsResponse)
def get_analytics(db: Session = Depends(database.get_db)):
    return crud.get_analytics(db)

@app.get("/api/problems/{problem_id}", response_model=schemas.ProblemDetail)
def get_problem_detail(problem_id: int, db: Session = Depends(database.get_db)):
    # Fetch problem with revisions
    problem = db.query(models.Problem).filter(models.Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Calculate next revision date (find the latest scheduled revision)
    latest_rev = db.query(models.Revision).filter(
        models.Revision.problem_id == problem_id
    ).order_by(models.Revision.scheduled_date.desc()).first()
    
    problem.next_revision_date = latest_rev.scheduled_date if latest_rev else None
    
    return problem
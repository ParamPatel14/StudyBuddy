from sqlalchemy import Column, Integer, String, Float, Date, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from datetime import datetime

# ============================================================================
# PLACEMENT PREP - COMPLETELY INDEPENDENT FROM EXAM PREP
# ============================================================================

class PlacementUser(Base):
    """Separate user table for placement prep"""
    __tablename__ = "placement_users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    profiles = relationship("PlacementProfile", back_populates="user", cascade="all, delete-orphan")

class PlacementProfile(Base):
    """Interview preparation profile"""
    __tablename__ = "placement_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("placement_users.id"))
    
    # Company & Role
    company_name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    
    # Schedule
    interview_date = Column(Date, nullable=False)
    hours_per_day = Column(Float, nullable=False)
    
    # Round Structure (JSON)
    # Example: [
    #   {"round_number": 1, "type": "aptitude", "duration": 60},
    #   {"round_number": 2, "type": "dsa_coding", "duration": 90}
    # ]
    round_structure = Column(JSON, nullable=False)
    
    # Status
    status = Column(String, default="active")  # active, completed, cancelled
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("PlacementUser", back_populates="profiles")
    preparation_plan = relationship("PlacementPlan", back_populates="profile", uselist=False)

class PlacementPlan(Base):
    __tablename__ = "placement_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("placement_profiles.id"), unique=True)
    
    plan_json = Column(JSON)
    total_days = Column(Integer)
    total_hours = Column(Float)
    total_tasks = Column(Integer, default=0)  # Add this
    
    completed_tasks = Column(Integer, default=0)
    total_topics = Column(Integer, default=0)
    progress_percentage = Column(Float, default=0.0)
    
    profile = relationship("PlacementProfile", back_populates="preparation_plan")
    created_at = Column(DateTime, default=datetime.utcnow)

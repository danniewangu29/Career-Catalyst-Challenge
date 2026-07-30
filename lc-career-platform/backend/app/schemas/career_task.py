from datetime import date, datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CareerTaskCategory(str, Enum):
    RESUME = "resume"
    COVER_LETTER = "cover_letter"
    LINKEDIN = "linkedin"
    INTERVIEW = "interview"
    NETWORKING = "networking"
    APPLICATION = "application"
    CAREER_ADVISING = "career_advising"
    PORTFOLIO = "portfolio"
    SKILL_DEVELOPMENT = "skill_development"
    OTHER = "other"


class CareerTaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class CareerTaskBase(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str | None = Field(default=None, max_length=3000)
    category: CareerTaskCategory = CareerTaskCategory.OTHER
    priority: CareerTaskPriority = CareerTaskPriority.MEDIUM
    due_date: date | None = None


class CareerTaskCreate(CareerTaskBase):
    pass


class CareerTaskUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=2,
        max_length=200,
    )
    description: str | None = Field(default=None, max_length=3000)
    category: CareerTaskCategory | None = None
    priority: CareerTaskPriority | None = None
    due_date: date | None = None
    completed: bool | None = None


class CareerTaskResponse(CareerTaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_id: UUID
    completed: bool
    completed_at: datetime | None
    created_at: datetime
    updated_at: datetime

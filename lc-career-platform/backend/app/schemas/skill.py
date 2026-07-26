from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProficiencyLevel(str, Enum):
    BEGINNER = "beginner"
    DEVELOPING = "developing"
    PROFICIENT = "proficient"
    ADVANCED = "advanced"


class SkillCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    proficiency_level: ProficiencyLevel
    development_goal: bool = False


class SkillResponse(SkillCreate):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_id: UUID
    created_at: datetime
    updated_at: datetime
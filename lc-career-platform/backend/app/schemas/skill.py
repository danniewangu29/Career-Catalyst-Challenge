from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProficiencyLevel(str, Enum):
    BEGINNER = "beginner"
    DEVELOPING = "developing"
    PROFICIENT = "proficient"
    ADVANCED = "advanced"


class SkillBase(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    proficiency_level: ProficiencyLevel = ProficiencyLevel.BEGINNER
    development_goal: bool = False
    notes: str | None = Field(default=None, max_length=2000)


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    proficiency_level: ProficiencyLevel | None = None
    development_goal: bool | None = None
    notes: str | None = Field(default=None, max_length=2000)


class SkillSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    proficiency_level: ProficiencyLevel
    development_goal: bool


class SkillResponse(SkillBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_id: UUID
    created_at: datetime
    updated_at: datetime
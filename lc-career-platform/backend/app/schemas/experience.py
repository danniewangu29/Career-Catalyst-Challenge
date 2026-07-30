from datetime import date, datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator
from app.schemas.skill import SkillSummary


class ExperienceType(str, Enum):
    EMPLOYMENT = "employment"
    INTERNSHIP = "internship"
    RESEARCH = "research"
    COURSE_PROJECT = "course_project"
    STUDY_ABROAD = "study_abroad"
    LEADERSHIP = "leadership"
    VOLUNTEER = "volunteer"
    CAMPUS_INVOLVEMENT = "campus_involvement"
    COMPETITION = "competition"
    CERTIFICATION = "certification"
    OTHER = "other"


class ExperienceBase(BaseModel):
    title: str = Field(min_length=2, max_length=150)
    organization: str | None = Field(default=None, max_length=150)
    experience_type: ExperienceType
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool = False
    description: str | None = Field(default=None, max_length=3000)
    accomplishments: str | None = Field(default=None, max_length=3000)
    reflection: str | None = Field(default=None, max_length=3000)

    @model_validator(mode="after")
    def validate_dates(self) -> "ExperienceBase":
        if (
            self.start_date is not None
            and self.end_date is not None
            and self.end_date < self.start_date
        ):
            raise ValueError("End date cannot be before start date.")

        if self.is_current and self.end_date is not None:
            raise ValueError(
                "A current experience should not have an end date."
            )

        return self


class ExperienceCreate(ExperienceBase):
    skill_ids: list[UUID] = Field(default_factory=list)


class ExperienceUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=150)
    organization: str | None = Field(default=None, max_length=150)
    experience_type: ExperienceType | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool | None = None
    description: str | None = Field(default=None, max_length=3000)
    accomplishments: str | None = Field(default=None, max_length=3000)
    reflection: str | None = Field(default=None, max_length=3000)
    skill_ids: list[UUID] | None = None


class ExperienceResponse(ExperienceBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_id: UUID
    created_at: datetime
    updated_at: datetime
    skills: list[SkillSummary] = Field(default_factory=list)
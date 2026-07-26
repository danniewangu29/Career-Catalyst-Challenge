import enum
import uuid
from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Enum, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ExperienceType(str, enum.Enum):
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


class Experience(Base):
    __tablename__ = "experiences"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    student_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    organization: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    experience_type: Mapped[ExperienceType] = mapped_column(
        Enum(
            ExperienceType,
            name="experience_type",
            values_callable=lambda enum_class: [
                member.value for member in enum_class
            ],
        ),
        nullable=False,
    )

    start_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    end_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    is_current: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    accomplishments: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    reflection: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

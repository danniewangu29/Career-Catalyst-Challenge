import enum
import uuid
from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Enum, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class CareerTaskCategory(str, enum.Enum):
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


class CareerTaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class CareerTask(Base):
    __tablename__ = "career_tasks"

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
        String(200),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    category: Mapped[CareerTaskCategory] = mapped_column(
        Enum(
            CareerTaskCategory,
            name="career_task_category",
            values_callable=lambda enum_class: [
                member.value for member in enum_class
            ],
        ),
        nullable=False,
        default=CareerTaskCategory.OTHER,
    )

    priority: Mapped[CareerTaskPriority] = mapped_column(
        Enum(
            CareerTaskPriority,
            name="career_task_priority",
            values_callable=lambda enum_class: [
                member.value for member in enum_class
            ],
        ),
        nullable=False,
        default=CareerTaskPriority.MEDIUM,
    )

    due_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    completed: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
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

from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base

experience_skills = Table(
    "experience_skills",
    Base.metadata,
    Column(
        "experience_id",
        UUID(as_uuid=True),
        ForeignKey("experiences.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "skill_id",
        UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)

from datetime import date, datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ConnectionStatus(str, Enum):
    NEW = "new"
    FOLLOW_UP_NEEDED = "follow_up_needed"
    ACTIVE = "active"
    MENTOR = "mentor"
    RECRUITER = "recruiter"
    ALUMNI = "alumni"
    INACTIVE = "inactive"


class NetworkConnectionBase(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    job_title: str | None = Field(default=None, max_length=150)
    organization: str | None = Field(default=None, max_length=150)
    email: EmailStr | None = None
    where_met: str | None = Field(default=None, max_length=200)
    date_met: date | None = None
    last_contact_date: date | None = None
    follow_up_date: date | None = None
    status: ConnectionStatus = ConnectionStatus.NEW
    notes: str | None = Field(default=None, max_length=3000)


class NetworkConnectionCreate(NetworkConnectionBase):
    pass


class NetworkConnectionUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=150)
    job_title: str | None = Field(default=None, max_length=150)
    organization: str | None = Field(default=None, max_length=150)
    email: EmailStr | None = None
    where_met: str | None = Field(default=None, max_length=200)
    date_met: date | None = None
    last_contact_date: date | None = None
    follow_up_date: date | None = None
    status: ConnectionStatus | None = None
    notes: str | None = Field(default=None, max_length=3000)


class NetworkConnectionResponse(NetworkConnectionBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_id: UUID
    created_at: datetime
    updated_at: datetime

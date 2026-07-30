from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class RegisterRequest(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    confirm_password: str = Field(min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def validate_lc_email(cls, value: EmailStr) -> str:
        normalized = str(value).strip().lower()

        if not normalized.endswith("@lclark.edu"):
            raise ValueError(
                "Use a Lewis & Clark email ending in @lclark.edu."
            )

        return normalized

    @field_validator("confirm_password")
    @classmethod
    def validate_password_match(
        cls,
        value: str,
        info,
    ) -> str:
        password = info.data.get("password")

        if password is not None and value != password:
            raise ValueError("Passwords do not match.")

        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    first_name: str
    last_name: str
    email: EmailStr
    is_active: bool
    created_at: datetime


class AuthResponse(BaseModel):
    user: UserResponse
    message: str

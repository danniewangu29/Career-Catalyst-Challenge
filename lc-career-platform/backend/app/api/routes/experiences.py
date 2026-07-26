from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.experience import Experience
from app.schemas.experience import (
    ExperienceCreate,
    ExperienceResponse,
    ExperienceUpdate,
)

router = APIRouter(prefix="/experiences", tags=["Experiences"])

DEMO_STUDENT_ID = UUID("11111111-1111-1111-1111-111111111111")


def get_owned_experience(
    db: Session,
    experience_id: UUID,
) -> Experience:
    statement = select(Experience).where(
        Experience.id == experience_id,
        Experience.student_id == DEMO_STUDENT_ID,
    )

    experience = db.scalar(statement)

    if experience is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found",
        )

    return experience


@router.get("", response_model=list[ExperienceResponse])
def list_experiences(
    db: Session = Depends(get_db),
) -> list[Experience]:
    statement = (
        select(Experience)
        .where(Experience.student_id == DEMO_STUDENT_ID)
        .order_by(Experience.created_at.desc())
    )

    return list(db.scalars(statement).all())


@router.post(
    "",
    response_model=ExperienceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_experience(
    payload: ExperienceCreate,
    db: Session = Depends(get_db),
) -> Experience:
    values = payload.model_dump(exclude={"skill_ids"})

    experience = Experience(
        student_id=DEMO_STUDENT_ID,
        **values,
    )

    db.add(experience)
    db.commit()
    db.refresh(experience)

    return experience


@router.get(
    "/{experience_id}",
    response_model=ExperienceResponse,
)
def get_experience(
    experience_id: UUID,
    db: Session = Depends(get_db),
) -> Experience:
    return get_owned_experience(db, experience_id)


@router.patch(
    "/{experience_id}",
    response_model=ExperienceResponse,
)
def update_experience(
    experience_id: UUID,
    payload: ExperienceUpdate,
    db: Session = Depends(get_db),
) -> Experience:
    experience = get_owned_experience(db, experience_id)

    updates = payload.model_dump(
        exclude_unset=True,
        exclude={"skill_ids"},
    )

    for field, value in updates.items():
        setattr(experience, field, value)

    if experience.is_current:
        experience.end_date = None

    if (
        experience.start_date is not None
        and experience.end_date is not None
        and experience.end_date < experience.start_date
    ):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="End date cannot be before start date.",
        )

    db.commit()
    db.refresh(experience)

    return experience


@router.delete(
    "/{experience_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_experience(
    experience_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    experience = get_owned_experience(db, experience_id)

    db.delete(experience)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
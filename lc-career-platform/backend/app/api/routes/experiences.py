from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.dependencies.auth import get_current_user
from app.core.database import get_db
from app.models.experience import Experience
from app.models.skill import Skill
from app.models.user import User
from app.schemas.experience import (
    ExperienceCreate,
    ExperienceResponse,
    ExperienceUpdate,
)

router = APIRouter(
    prefix="/experiences",
    tags=["Experiences"],
)


def get_owned_experience(
    db: Session,
    experience_id: UUID,
    student_id: UUID,
) -> Experience:
    statement = (
        select(Experience)
        .options(selectinload(Experience.skills))
        .where(
            Experience.id == experience_id,
            Experience.student_id == student_id,
        )
    )

    experience = db.scalar(statement)

    if experience is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found.",
        )

    return experience


def get_owned_skills(
    db: Session,
    skill_ids: list[UUID],
    student_id: UUID,
) -> list[Skill]:
    if not skill_ids:
        return []

    unique_ids = list(set(skill_ids))

    statement = select(Skill).where(
        Skill.id.in_(unique_ids),
        Skill.student_id == student_id,
    )

    skills = list(db.scalars(statement).all())

    if len(skills) != len(unique_ids):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                "One or more selected skills do not exist "
                "or are not accessible."
            ),
        )

    return skills


@router.get(
    "",
    response_model=list[ExperienceResponse],
)
def list_experiences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Experience]:
    statement = (
        select(Experience)
        .options(selectinload(Experience.skills))
        .where(Experience.student_id == current_user.id)
        .order_by(Experience.created_at.desc())
    )

    return list(db.scalars(statement).unique().all())


@router.post(
    "",
    response_model=ExperienceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_experience(
    payload: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Experience:
    selected_skills = get_owned_skills(
        db,
        payload.skill_ids,
        current_user.id,
    )

    experience_data = payload.model_dump(
        exclude={"skill_ids"},
    )

    experience = Experience(
        student_id=current_user.id,
        **experience_data,
    )

    experience.skills = selected_skills

    db.add(experience)
    db.commit()

    return get_owned_experience(
        db,
        experience.id,
        current_user.id,
    )


@router.get(
    "/{experience_id}",
    response_model=ExperienceResponse,
)
def get_experience(
    experience_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Experience:
    return get_owned_experience(
        db,
        experience_id,
        current_user.id,
    )


@router.patch(
    "/{experience_id}",
    response_model=ExperienceResponse,
)
def update_experience(
    experience_id: UUID,
    payload: ExperienceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Experience:
    experience = get_owned_experience(
        db,
        experience_id,
        current_user.id,
    )

    updates = payload.model_dump(exclude_unset=True)

    if "skill_ids" in updates:
        skill_ids = updates.pop("skill_ids")

        selected_skills = get_owned_skills(
            db,
            skill_ids,
            current_user.id,
        )

        experience.skills = selected_skills

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
            detail="The end date cannot be before the start date.",
        )

    db.commit()

    return get_owned_experience(
        db,
        experience.id,
        current_user.id,
    )


@router.delete(
    "/{experience_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_experience(
    experience_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    experience = get_owned_experience(
        db,
        experience_id,
        current_user.id,
    )

    db.delete(experience)
    db.commit()

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )
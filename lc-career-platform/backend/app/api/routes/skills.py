from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillResponse, SkillUpdate

from app.api.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/skills", tags=["Skills"])


def get_owned_skill(
    db: Session,
    skill_id: UUID,
    student_id: UUID,
) -> Skill:
    statement = select(Skill).where(
        Skill.id == skill_id,
        Skill.student_id == student_id,
    )

    skill = db.scalar(statement)

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )

    return skill


@router.get("", response_model=list[SkillResponse])
def list_skills(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Skill]:
    statement = (
        select(Skill)
        .where(Skill.student_id == current_user.id)
        .order_by(Skill.name.asc())
    )

    return list(db.scalars(statement).all())


@router.post(
    "",
    response_model=SkillResponse,
    status_code=status.HTTP_201_CREATED,
)
@router.post(
    "",
    response_model=SkillResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_skill(
    payload: SkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Skill:
    normalized_name = payload.name.strip()

    existing_skill = db.scalar(
        select(Skill).where(
            Skill.student_id == current_user.id,
            func.lower(Skill.name) == normalized_name.lower(),
        )
    )

    if existing_skill is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have a skill with this name.",
        )

    skill = Skill(
        student_id=current_user.id,
        name=normalized_name,
        proficiency_level=payload.proficiency_level,
        development_goal=payload.development_goal,
        notes=payload.notes,
    )

    db.add(skill)
    db.commit()
    db.refresh(skill)

    return skill


@router.get(
    "/{skill_id}",
    response_model=SkillResponse,
)
def get_skill(
    skill_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Skill:
    return get_owned_skill(
        db,
        skill_id,
        current_user.id,
    )


@router.patch(
    "/{skill_id}",
    response_model=SkillResponse,
)
def update_skill(
    skill_id: UUID,
    payload: SkillUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Skill:
    skill = get_owned_skill(
        db,
        skill_id,
        current_user.id,
    )

    updates = payload.model_dump(exclude_unset=True)

    if "name" in updates:
        normalized_name = updates["name"].strip()

        duplicate_skill = db.scalar(
            select(Skill).where(
                Skill.student_id == current_user.id,
                Skill.id != skill.id,
                func.lower(Skill.name) == normalized_name.lower(),
            )
        )

        if duplicate_skill is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You already have a skill with this name.",
            )

        updates["name"] = normalized_name

    for field, value in updates.items():
        setattr(skill, field, value)

    db.commit()
    db.refresh(skill)

    return skill


@router.delete(
    "/{skill_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_skill(
    skill_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    skill = get_owned_skill(
        db,
        skill_id,
        current_user.id,
    )

    db.delete(skill)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)

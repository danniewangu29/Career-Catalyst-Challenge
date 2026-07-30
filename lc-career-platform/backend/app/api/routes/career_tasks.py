from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.core.database import get_db
from app.models.career_task import CareerTask
from app.models.user import User
from app.schemas.career_task import (
    CareerTaskCreate,
    CareerTaskResponse,
    CareerTaskUpdate,
)

router = APIRouter(
    prefix="/career-tasks",
    tags=["Career Tasks"],
)


def get_owned_task(
    db: Session,
    task_id: UUID,
    student_id: UUID,
) -> CareerTask:
    statement = select(CareerTask).where(
        CareerTask.id == task_id,
        CareerTask.student_id == student_id,
    )

    task = db.scalar(statement)

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career task not found.",
        )

    return task


@router.get(
    "",
    response_model=list[CareerTaskResponse],
)
def list_career_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[CareerTask]:
    statement = (
        select(CareerTask)
        .where(CareerTask.student_id == current_user.id)
        .order_by(
            CareerTask.completed.asc(),
            CareerTask.due_date.asc(),
            CareerTask.created_at.desc(),
        )
    )

    return list(db.scalars(statement).all())


@router.post(
    "",
    response_model=CareerTaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_career_task(
    payload: CareerTaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CareerTask:
    task = CareerTask(
        student_id=current_user.id,
        **payload.model_dump(),
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@router.get(
    "/{task_id}",
    response_model=CareerTaskResponse,
)
def get_career_task(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CareerTask:
    return get_owned_task(
        db,
        task_id,
        current_user.id,
    )


@router.patch(
    "/{task_id}",
    response_model=CareerTaskResponse,
)
def update_career_task(
    task_id: UUID,
    payload: CareerTaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CareerTask:
    task = get_owned_task(
        db,
        task_id,
        current_user.id,
    )

    updates = payload.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return task


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_career_task(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    task = get_owned_task(
        db,
        task_id,
        current_user.id,
    )

    db.delete(task)
    db.commit()

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )
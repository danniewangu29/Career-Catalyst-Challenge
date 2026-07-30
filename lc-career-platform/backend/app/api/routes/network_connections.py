from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.core.database import get_db
from app.models.network_connection import NetworkConnection
from app.models.user import User
from app.schemas.network_connection import (
    NetworkConnectionCreate,
    NetworkConnectionResponse,
    NetworkConnectionUpdate,
)

router = APIRouter(
    prefix="/network-connections",
    tags=["Network Connections"],
)


def get_owned_connection(
    db: Session,
    connection_id: UUID,
    student_id: UUID,
) -> NetworkConnection:
    statement = select(NetworkConnection).where(
        NetworkConnection.id == connection_id,
        NetworkConnection.student_id == student_id,
    )

    connection = db.scalar(statement)

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Network connection not found.",
        )

    return connection


@router.get(
    "",
    response_model=list[NetworkConnectionResponse],
)
def list_network_connections(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[NetworkConnection]:
    statement = (
        select(NetworkConnection)
        .where(
            NetworkConnection.student_id == current_user.id,
        )
        .order_by(NetworkConnection.created_at.desc())
    )

    return list(db.scalars(statement).all())


@router.post(
    "",
    response_model=NetworkConnectionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_network_connection(
    payload: NetworkConnectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NetworkConnection:
    connection = NetworkConnection(
        student_id=current_user.id,
        **payload.model_dump(),
    )

    db.add(connection)
    db.commit()
    db.refresh(connection)

    return connection


@router.get(
    "/{connection_id}",
    response_model=NetworkConnectionResponse,
)
def get_network_connection(
    connection_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NetworkConnection:
    return get_owned_connection(
        db,
        connection_id,
        current_user.id,
    )


@router.patch(
    "/{connection_id}",
    response_model=NetworkConnectionResponse,
)
def update_network_connection(
    connection_id: UUID,
    payload: NetworkConnectionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NetworkConnection:
    connection = get_owned_connection(
        db,
        connection_id,
        current_user.id,
    )

    updates = payload.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(connection, field, value)

    db.commit()
    db.refresh(connection)

    return connection


@router.delete(
    "/{connection_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_network_connection(
    connection_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    connection = get_owned_connection(
        db,
        connection_id,
        current_user.id,
    )

    db.delete(connection)
    db.commit()

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )
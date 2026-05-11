from __future__ import annotations

from collections.abc import Callable
from typing import TypeVar

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.errors import APIError, conflict

T = TypeVar("T")


def commit_or_409(
    db: Session,
    resource_name: str,
    field_name: str,
    refresh: T | None = None,
) -> T | None:
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise conflict(resource_name, field_name) from exc

    if refresh is not None:
        db.refresh(refresh)
    return refresh


def apply_updates(instance: object, data: dict) -> None:
    for key, value in data.items():
        setattr(instance, key, value)

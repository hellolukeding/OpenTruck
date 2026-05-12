from __future__ import annotations

from collections.abc import Callable
from math import ceil
from typing import TypeVar

from sqlalchemy import Select, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import ColumnElement
from sqlalchemy.sql.selectable import Subquery

from app.core.errors import APIError, bad_request, conflict, internal_error
from app.schemas.pagination import PaginatedResponse, PaginationMeta

T = TypeVar("T")

UNIQUE_VIOLATION = "23505"
FOREIGN_KEY_VIOLATION = "23503"
NOT_NULL_VIOLATION = "23502"
CHECK_VIOLATION = "23514"


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
        sqlstate = getattr(exc.orig, "sqlstate", None) or getattr(exc.orig, "pgcode", None)
        if sqlstate == UNIQUE_VIOLATION:
            raise conflict(resource_name, field_name) from exc
        if sqlstate == FOREIGN_KEY_VIOLATION:
            raise bad_request("invalid_reference", f"{resource_name} references a missing related resource") from exc
        if sqlstate == NOT_NULL_VIOLATION:
            raise bad_request("missing_required_field", f"{resource_name} is missing a required field") from exc
        if sqlstate == CHECK_VIOLATION:
            raise bad_request("constraint_violation", f"{resource_name} violates a database constraint") from exc
        raise internal_error() from exc

    if refresh is not None:
        db.refresh(refresh)
    return refresh


def apply_updates(instance: object, data: dict) -> None:
    for key, value in data.items():
        setattr(instance, key, value)


def build_search_filter(search: str | None, *columns: ColumnElement[str]) -> ColumnElement[bool] | None:
    if not search:
        return None

    term = f"%{search.strip()}%"
    searchable_columns = [column for column in columns if column is not None]
    if not searchable_columns:
        return None
    return or_(*(column.ilike(term) for column in searchable_columns))


def resolve_sort(
    sort_by: str,
    sort_order: str,
    allowed: dict[str, ColumnElement[object]],
    *,
    default_sort_by: str = "created_at",
) -> ColumnElement[object]:
    column = allowed.get(sort_by)
    if sort_by == "":
        column = allowed.get(default_sort_by)
    if column is None:
        raise bad_request("invalid_sort_by", f"Unsupported sort field: {sort_by}")

    return column.asc() if sort_order == "asc" else column.desc()


def paginate(
    db: Session,
    statement: Select[tuple[T]],
    *,
    page: int,
    page_size: int,
) -> PaginatedResponse[T]:
    count_subquery: Subquery = statement.order_by(None).subquery()
    total = db.scalar(select(func.count()).select_from(count_subquery)) or 0
    offset = (page - 1) * page_size
    items = list(db.scalars(statement.limit(page_size).offset(offset)).all())
    total_pages = ceil(total / page_size) if total else 0

    return PaginatedResponse[T](
        items=items,
        pagination=PaginationMeta(
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        ),
    )

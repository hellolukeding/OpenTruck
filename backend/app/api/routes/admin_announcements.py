from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.utils import apply_updates, build_search_filter, commit_or_409, paginate, resolve_sort
from app.core.errors import not_found
from app.models.announcement import Announcement
from app.schemas.announcement import AnnouncementCreate, AnnouncementRead, AnnouncementUpdate
from app.schemas.common import SortOrder
from app.schemas.error import ErrorResponse
from app.schemas.pagination import PaginatedResponse


router = APIRouter(prefix="/announcements", tags=["admin-announcements"])


@router.get("", response_model=PaginatedResponse[AnnouncementRead])
def list_announcements(
    status: str | None = Query(default=None),
    severity: str | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="sort_order"),
    sort_order: SortOrder = Query(default="asc"),
    db: Session = Depends(get_db),
) -> PaginatedResponse[AnnouncementRead]:
    statement = select(Announcement)
    if status:
        statement = statement.where(Announcement.status == status)
    if severity:
        statement = statement.where(Announcement.severity == severity)

    search_filter = build_search_filter(search, Announcement.title, Announcement.body)
    if search_filter is not None:
        statement = statement.where(search_filter)

    statement = statement.order_by(
        resolve_sort(
            sort_by,
            sort_order,
            {
                "title": Announcement.title,
                "status": Announcement.status,
                "severity": Announcement.severity,
                "sort_order": Announcement.sort_order,
                "created_at": Announcement.created_at,
                "updated_at": Announcement.updated_at,
            },
        )
    )
    return paginate(db, statement, page=page, page_size=page_size)


@router.post("", response_model=AnnouncementRead, status_code=status.HTTP_201_CREATED)
def create_announcement(payload: AnnouncementCreate, db: Session = Depends(get_db)) -> Announcement:
    announcement = Announcement(**payload.model_dump())
    db.add(announcement)
    return commit_or_409(db, "Announcement", "title", announcement)


@router.patch("/{announcement_id}", response_model=AnnouncementRead, responses={404: {"model": ErrorResponse}})
def update_announcement(
    announcement_id: str,
    payload: AnnouncementUpdate,
    db: Session = Depends(get_db),
) -> Announcement:
    announcement = db.get(Announcement, announcement_id)
    if announcement is None:
        raise not_found("Announcement")

    apply_updates(announcement, payload.model_dump(exclude_unset=True))
    return commit_or_409(db, "Announcement", "title", announcement)


@router.delete("/{announcement_id}", status_code=status.HTTP_204_NO_CONTENT, responses={404: {"model": ErrorResponse}})
def delete_announcement(announcement_id: str, db: Session = Depends(get_db)) -> Response:
    announcement = db.get(Announcement, announcement_id)
    if announcement is None:
        raise not_found("Announcement")

    db.delete(announcement)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

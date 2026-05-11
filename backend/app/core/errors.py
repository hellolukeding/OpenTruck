from __future__ import annotations

from fastapi import HTTPException, status


class APIError(HTTPException):
    def __init__(self, status_code: int, code: str, message: str):
        super().__init__(status_code=status_code, detail={"code": code, "message": message})


def not_found(resource: str) -> APIError:
    return APIError(
        status_code=status.HTTP_404_NOT_FOUND,
        code=f"{resource.lower().replace(' ', '_')}_not_found",
        message=f"{resource} not found",
    )


def conflict(resource: str, field: str) -> APIError:
    return APIError(
        status_code=status.HTTP_409_CONFLICT,
        code=f"{resource.lower().replace(' ', '_')}_conflict",
        message=f"{resource} with this {field} already exists",
    )

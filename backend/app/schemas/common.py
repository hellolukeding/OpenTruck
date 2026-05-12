from __future__ import annotations

from decimal import Decimal
from typing import Annotated, Literal

from pydantic import StringConstraints


ResourceStatus = Literal["active", "disabled"]
NodeHealthStatus = Literal["unknown", "ok", "degraded", "down", "error"]
NodeAuthType = Literal["bearer", "basic", "api_key", "custom", "none"]
SortOrder = Literal["asc", "desc"]

ShortName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=128)]
LongUrl = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=512)]
RegionName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=64)]
ModelName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=128)]
ApiKeySecret = Annotated[str, StringConstraints(strip_whitespace=True, min_length=8, max_length=512)]
TagName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=64)]

NonNegativeDecimal = Annotated[Decimal, ...]

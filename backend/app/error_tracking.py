from __future__ import annotations

from collections import deque
from datetime import datetime, timezone


RECENT_API_ERRORS: deque[dict[str, str | int]] = deque(maxlen=50)


def record_api_error(method: str, path: str, status_code: int) -> None:
    RECENT_API_ERRORS.appendleft(
        {
            "time": datetime.now(timezone.utc).isoformat(),
            "method": method,
            "path": path,
            "status_code": status_code,
        }
    )


def recent_api_errors(limit: int = 20) -> list[dict[str, str | int]]:
    return list(RECENT_API_ERRORS)[:limit]

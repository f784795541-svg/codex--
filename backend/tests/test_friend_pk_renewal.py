from datetime import date
from types import SimpleNamespace
from unittest.mock import patch

import pytest
from fastapi import HTTPException

from app.routers.friend_pk import challenge_end, change_challenge


class FakeSession:
    def __init__(self, challenge):
        self.challenge = challenge

    def get(self, model, ident):
        return self.challenge if ident == self.challenge.id else None

    def commit(self):
        pass


def test_calendar_stages_handle_month_end():
    start = date(2024, 1, 31)
    assert [challenge_end(start, stage) for stage in range(5)] == [
        date(2024, 2, 6), date(2024, 2, 28), date(2024, 4, 29),
        date(2024, 7, 30), date(2025, 1, 30),
    ]


def test_renewal_requires_other_participant_and_preserves_expired_challenge():
    challenge = SimpleNamespace(id=1, sender_id=1, recipient_id=2, status="active", start_date=date(2024, 1, 1), stage=0, renewal_requested_by=None)
    db = FakeSession(challenge)
    with patch("app.routers.friend_pk.services.local_today", return_value=date(2024, 1, 5)):
        change_challenge(1, "renew", db, SimpleNamespace(id=1))
        with pytest.raises(HTTPException):
            change_challenge(1, "renew-accept", db, SimpleNamespace(id=1))
        change_challenge(1, "renew-accept", db, SimpleNamespace(id=2))
    assert challenge.stage == 1
    assert challenge.renewal_requested_by is None

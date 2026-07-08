from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import time

import bcrypt


TOKEN_TTL_SECONDS = int(os.getenv("ACCESS_TOKEN_TTL_SECONDS", "2592000"))
_DEFAULT_SECRET = "CHANGE_ME_DEV_ONLY_HEALTH_MANAGER_SECRET"


def _signing_secret() -> bytes:
    return os.getenv("APP_SECRET_KEY", _DEFAULT_SECRET).encode("utf-8")


def _b64encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def _b64decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode((value + padding).encode("ascii"))


def legacy_sha256_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def is_legacy_sha256_hash(password_hash: str | None) -> bool:
    if not password_hash:
        return False
    return len(password_hash) == 64 and all(char in "0123456789abcdef" for char in password_hash.lower())


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("ascii")


def verify_password(password: str, password_hash: str | None) -> bool:
    if not password_hash:
        return False
    if is_legacy_sha256_hash(password_hash):
        return hmac.compare_digest(legacy_sha256_password(password), password_hash)
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("ascii"))
    except ValueError:
        return False


def needs_password_rehash(password_hash: str | None) -> bool:
    return is_legacy_sha256_hash(password_hash)


def create_access_token(user_id: int, expires_in: int = TOKEN_TTL_SECONDS) -> str:
    payload = {
        "sub": int(user_id),
        "exp": int(time.time()) + int(expires_in),
    }
    payload_part = _b64encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = hmac.new(_signing_secret(), payload_part.encode("ascii"), hashlib.sha256).digest()
    return f"{payload_part}.{_b64encode(signature)}"


def decode_access_token(token: str) -> int:
    try:
        payload_part, signature_part = token.split(".", 1)
        expected = hmac.new(_signing_secret(), payload_part.encode("ascii"), hashlib.sha256).digest()
        actual = _b64decode(signature_part)
        if not hmac.compare_digest(expected, actual):
            raise ValueError("invalid signature")
        payload = json.loads(_b64decode(payload_part))
        if int(payload.get("exp", 0)) < int(time.time()):
            raise ValueError("expired token")
        user_id = int(payload["sub"])
    except Exception as exc:
        raise ValueError("invalid token") from exc
    if user_id <= 0:
        raise ValueError("invalid token subject")
    return user_id

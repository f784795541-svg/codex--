from __future__ import annotations

import os
import smtplib
import ssl
from email.message import EmailMessage

from .models import User, UserFeedback


def send_feedback_notification(user: User, feedback: UserFeedback) -> str:
    host = os.getenv("FEEDBACK_SMTP_HOST", "").strip()
    recipient = os.getenv("FEEDBACK_SMTP_TO", "").strip()
    sender = os.getenv("FEEDBACK_SMTP_FROM", "").strip()
    if not host or not recipient or not sender:
        return "stored"

    message = EmailMessage()
    message["Subject"] = f"[Health Manager] New feedback #{feedback.id}"
    message["From"] = sender
    message["To"] = recipient
    message.set_content(
        "A new user feedback item was received.\n\n"
        f"Feedback ID: {feedback.id}\n"
        f"User ID: {user.id}\n"
        f"Client: {feedback.client_platform}\n"
        f"Version: {feedback.app_version or 'unknown'}\n\n"
        f"Content:\n{feedback.content}\n"
    )

    try:
        port = int(os.getenv("FEEDBACK_SMTP_PORT", "587"))
        username = os.getenv("FEEDBACK_SMTP_USERNAME", "").strip()
        password = os.getenv("FEEDBACK_SMTP_PASSWORD", "")
        with smtplib.SMTP(host, port, timeout=8) as client:
            if os.getenv("FEEDBACK_SMTP_USE_TLS", "true").strip().lower() != "false":
                client.starttls(context=ssl.create_default_context())
            if username:
                client.login(username, password)
            client.send_message(message)
        return "email_sent"
    except (OSError, smtplib.SMTPException, ValueError):
        return "email_failed"

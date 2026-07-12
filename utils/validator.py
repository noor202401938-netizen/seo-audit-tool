"""
utils/validator.py
Validates emails/phones/URLs and filters out obvious false positives.
"""

import re

from email_validator import validate_email, EmailNotValidError
import config
from utils.normalizer import normalize_email, get_domain


def is_valid_email(email: str) -> bool:
    if not email:
        return False
    email = normalize_email(email)

    try:
        valid = validate_email(email, check_deliverability=False)
        email = valid.normalized
    except EmailNotValidError:
        return False

    domain = email.split("@")[-1]
    if domain in config.EMAIL_EXCLUDE_DOMAINS:
        return False

    for ext in config.EMAIL_EXCLUDE_EXTENSIONS:
        if email.endswith(ext):
            return False

    # reject emails that are clearly image/font filenames caught by a loose regex
    if re.search(r"\.(png|jpe?g|gif|svg|webp|css|js)@", email):
        return False

    return True


def is_valid_phone(phone: str) -> bool:
    if not phone:
        return False
    digits = re.sub(r"\D", "", phone)
    # Most real phone numbers are 7-15 digits (E.164 max is 15)
    return 7 <= len(digits) <= 15


def is_valid_url(url: str) -> bool:
    if not url:
        return False
    return bool(get_domain(url))

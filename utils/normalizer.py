"""
utils/normalizer.py
Canonicalizes URLs and emails so duplicates collapse to one record.
"""

import re
from urllib.parse import urlsplit, urlunsplit, urljoin


def normalize_url(url: str, base: str = None) -> str:
    """
    Turn http://ABC.com, https://abc.com, https://www.abc.com/  -> https://abc.com
    - lowercases scheme+host
    - strips default ports, fragments, trailing slash, 'www.'
    - resolves relative URLs against `base` if given
    """
    if not url:
        return ""

    url = url.strip()
    if base:
        url = urljoin(base, url)

    parts = urlsplit(url)

    scheme = "https"  # normalize scheme; site availability is checked elsewhere
    netloc = parts.netloc.lower()
    if netloc.startswith("www."):
        netloc = netloc[4:]
    # strip default ports
    netloc = re.sub(r":80$|:443$", "", netloc)

    path = parts.path or "/"
    if path != "/" and path.endswith("/"):
        path = path[:-1]

    # drop tracking/query noise but keep meaningful query strings (e.g. ?id=123 on listing pages)
    query = parts.query

    normalized = urlunsplit((scheme, netloc, path, query, ""))
    return normalized


def get_domain(url: str) -> str:
    parts = urlsplit(normalize_url(url))
    return parts.netloc


def normalize_email(email: str) -> str:
    if not email:
        return ""
    email = email.strip().lower()
    email = email.replace("mailto:", "")
    # strip trailing punctuation often glued on during scraping
    email = email.strip(".,;:()<>\"'")
    return email


def normalize_phone(phone: str) -> str:
    if not phone:
        return ""
    # Keep leading + , strip everything else non-digit
    has_plus = phone.strip().startswith("+")
    digits = re.sub(r"\D", "", phone)
    if not digits:
        return ""
    return ("+" if has_plus else "") + digits

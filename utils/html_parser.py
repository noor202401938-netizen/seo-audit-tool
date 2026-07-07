"""
utils/html_parser.py
Shared BeautifulSoup constructor with a safe parser fallback.
"""

import os

from bs4 import BeautifulSoup, FeatureNotFound

PREFERRED_HTML_PARSER = os.environ.get("HTML_PARSER", "").strip() or None
HTML_PARSER_CANDIDATES = ["lxml", "html5lib", "html.parser"]


def _select_html_parser() -> str:
    candidates = []
    if PREFERRED_HTML_PARSER:
        candidates.append(PREFERRED_HTML_PARSER)
    candidates.extend(parser for parser in HTML_PARSER_CANDIDATES if parser not in candidates)

    for parser_name in candidates:
        try:
            BeautifulSoup("<html></html>", parser_name)
            return parser_name
        except FeatureNotFound:
            continue

    return "html.parser"


DEFAULT_HTML_PARSER = _select_html_parser()


def make_soup(html: str):
    return BeautifulSoup(html, DEFAULT_HTML_PARSER)
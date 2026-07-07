from bs4 import BeautifulSoup
from typing import Dict, Any, List
import urllib.parse
import re

try:
    import textstat
except ImportError:
    textstat = None

STOP_WORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by", "about", 
    "against", "between", "into", "through", "during", "before", "after", "above", "below", "of", 
    "up", "down", "off", "over", "under", "again", "further", "then", "once", "here", "there", 
    "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", 
    "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "can", 
    "will", "just", "should", "now", "is", "was", "are", "were", "be", "been", "being", "have", 
    "has", "had", "having", "do", "does", "did", "doing", "we", "you", "he", "she", "it", "they", "i"
}

def extract_onpage_seo(html: str, soup: BeautifulSoup, url: str = None) -> Dict[str, Any]:
    """
    Extracts On-Page SEO elements from the given HTML.
    """
    seo_data = {
        "url": url,
        "url_length": len(url) if url else 0,
        "url_has_underscores": False,
        "url_has_uppercase": False,
        "title": None,
        "title_length": 0,
        "meta_description": None,
        "meta_description_length": 0,
        "h1_tags": [],
        "h1_count": 0,
        "h2_count": 0,
        "h3_count": 0,
        "headings_structure": [], # List of {"tag": "h1"/"h2"/"h3", "text": "..."}
        "heading_nesting_error": False,
        "word_count": 0,
        "readability_score": 0.0,
        "images_missing_alt": 0,
        "total_images": 0,
        "canonical": None,
        "robots": None,
        "inferred_keywords": [],
        "keyword_densities": {} # map of keyword -> float percentage
    }
    
    # URL Checks
    if url:
        parsed = urllib.parse.urlsplit(url)
        path = parsed.path
        if "_" in path:
            seo_data["url_has_underscores"] = True
        if any(c.isupper() for c in path):
            seo_data["url_has_uppercase"] = True

    # Title Tag
    title_tag = soup.find('title')
    if title_tag and title_tag.string:
        seo_data["title"] = title_tag.string.strip()
        seo_data["title_length"] = len(seo_data["title"])
        
    # Meta Description
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    if meta_desc and meta_desc.get('content'):
        seo_data["meta_description"] = meta_desc['content'].strip()
        seo_data["meta_description_length"] = len(seo_data["meta_description"])
        
    # Headings (H1, H2, H3)
    headings = soup.find_all(['h1', 'h2', 'h3'])
    headings_list = []
    h1_count = 0
    h2_count = 0
    h3_count = 0
    for h in headings:
        tag_name = h.name.lower()
        text = h.get_text(strip=True)
        headings_list.append({"tag": tag_name, "text": text})
        if tag_name == "h1":
            h1_count += 1
        elif tag_name == "h2":
            h2_count += 1
        elif tag_name == "h3":
            h3_count += 1

    seo_data["h1_tags"] = [h["text"] for h in headings_list if h["tag"] == "h1"]
    seo_data["h1_count"] = h1_count
    seo_data["h2_count"] = h2_count
    seo_data["h3_count"] = h3_count
    seo_data["headings_structure"] = headings_list

    # Check for heading nesting errors (no skipped levels, e.g., H1 followed directly by H3 without H2, or H3 before H2)
    # A simple way to verify: we shouldn't see H3 if we haven't seen H2, etc. Or sequential transition: level[i] - level[i-1] <= 1.
    seen_levels = set()
    prev_level = 0
    nesting_error = False
    for h in headings_list:
        curr_level = int(h["tag"][1])
        seen_levels.add(curr_level)
        if curr_level > 1:
            # Need to have seen curr_level - 1 before
            if (curr_level - 1) not in seen_levels:
                nesting_error = True
        prev_level = curr_level
    seo_data["heading_nesting_error"] = nesting_error

    # Text extraction for word count and readability
    # Clone the soup so we don't destroy the original
    text_soup = BeautifulSoup(html, "html.parser")
    for script in text_soup(["script", "style", "noscript", "iframe", "header", "footer"]):
        script.decompose()
    
    page_text = text_soup.get_text(separator=" ")
    words = [w.lower() for w in re.findall(r'\b\w+\b', page_text)]
    seo_data["word_count"] = len(words)

    # Readability Score
    if textstat and seo_data["word_count"] > 0:
        try:
            # textstat requires a raw string
            raw_text = text_soup.get_text()
            seo_data["readability_score"] = textstat.flesch_reading_ease(raw_text)
        except Exception:
            seo_data["readability_score"] = 60.0 # fallback default (standard)
    else:
        seo_data["readability_score"] = 60.0

    # Auto-Keyword Inference
    filtered_words = [w for w in words if w not in STOP_WORDS and len(w) >= 3]
    word_counts = {}
    for w in filtered_words:
        word_counts[w] = word_counts.get(w, 0) + 1
    
    sorted_words = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)
    inferred = [pair[0] for pair in sorted_words[:3]]
    seo_data["inferred_keywords"] = inferred

    # Keyword density checks for inferred keywords
    total_words = len(words)
    if total_words > 0:
        for kw in inferred:
            count = word_counts.get(kw, 0)
            seo_data["keyword_densities"][kw] = round((count / total_words) * 100, 2)
            
    # Images without Alt
    images = soup.find_all('img')
    seo_data["total_images"] = len(images)
    for img in images:
        if not img.get('alt'):
            seo_data["images_missing_alt"] += 1
            
    # Canonical Tag
    canonical = soup.find('link', rel='canonical')
    if canonical and canonical.get('href'):
        seo_data["canonical"] = canonical['href']
        
    # Robots Meta
    robots = soup.find('meta', attrs={'name': 'robots'})
    if robots and robots.get('content'):
        seo_data["robots"] = robots['content'].lower()
        
    return seo_data


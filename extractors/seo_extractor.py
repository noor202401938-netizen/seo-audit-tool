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

def extract_onpage_seo(html: str, soup: BeautifulSoup, url: str = None, headers: dict = None) -> Dict[str, Any]:
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
        "keyword_densities": {}, # map of keyword -> float percentage
        
        # New Tier 1, 2, 3 parameters
        "has_viewport": False,
        "viewport_content": None,
        "has_media_queries": False,
        "is_ssl": False,
        "mixed_content_assets": [],
        "internal_links_count": 0,
        "external_links_count": 0,
        "generic_anchor_links": [], # List of link text that are generic
        "external_links": [],
        "lazy_loaded_images": 0,
        "schema_markup_present": False,
        "schema_types": [],
        "schema_errors": [],
        "google_business_link": None,
        "local_schema_found": False,
        "has_nap": False,
        "forms_count": 0,
        "max_form_fields": 0,
        "has_cta": False,
        "has_popup": False,
        "og_tags": {},
        "twitter_tags": {},
        "is_gzip": False,
        "has_cache_headers": False
    }
    
    # SSL check
    if url:
        seo_data["is_ssl"] = url.lower().startswith("https://")
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

    # Viewport check
    viewport_meta = soup.find('meta', attrs={'name': 'viewport'})
    if viewport_meta and viewport_meta.get('content'):
        seo_data["has_viewport"] = True
        seo_data["viewport_content"] = viewport_meta['content']

    # Media queries in styles
    style_tags = soup.find_all('style')
    for style in style_tags:
        if style.string and "@media" in style.string:
            seo_data["has_media_queries"] = True
            break

    # Mixed content & image checks
    images = soup.find_all('img')
    seo_data["total_images"] = len(images)
    for img in images:
        src = img.get('src', '')
        if seo_data["is_ssl"] and src.startswith("http://"):
            seo_data["mixed_content_assets"].append(src)
        if not img.get('alt'):
            seo_data["images_missing_alt"] += 1
        if img.get('loading') == 'lazy':
            seo_data["lazy_loaded_images"] += 1

    # Mixed content check in scripts & links
    for script in soup.find_all('script', src=True):
        src = script.get('src', '')
        if seo_data["is_ssl"] and src.startswith("http://"):
            seo_data["mixed_content_assets"].append(src)
    for link in soup.find_all('link', href=True):
        href = link.get('href', '')
        if seo_data["is_ssl"] and href.startswith("http://"):
            seo_data["mixed_content_assets"].append(href)

    # Links: Internal / External / Anchor Text
    domain = urllib.parse.urlsplit(url).netloc if url else ""
    for a in soup.find_all('a', href=True):
        href = a['href']
        text = a.get_text(strip=True).lower()
        if href.startswith(('mailto:', 'tel:', 'javascript:', '#')):
            continue
        
        # Anchor Text checks
        generic_words = {"click here", "read more", "learn more", "here", "link", "website", "more", "go", "view", "details"}
        if text in generic_words:
            seo_data["generic_anchor_links"].append({"text": a.get_text(strip=True), "href": href})

        # CTA Detection (heuristics)
        cta_words = {"buy", "shop", "checkout", "order", "subscribe", "register", "join", "sign up", "get started", "download", "contact us"}
        if any(w in text for w in cta_words):
            seo_data["has_cta"] = True

        full_url = urllib.parse.urljoin(url or "", href)
        parsed_full = urllib.parse.urlsplit(full_url)
        if parsed_full.netloc == domain or not parsed_full.netloc:
            seo_data["internal_links_count"] += 1
        else:
            seo_data["external_links_count"] += 1
            seo_data["external_links"].append(full_url)
            # Local SEO: Google Business Profile detection
            if "google.com/maps" in full_url or "maps.google.com" in full_url or "g.page" in full_url:
                seo_data["google_business_link"] = full_url

    # Structured Data (Schema.org JSON-LD)
    schema_scripts = soup.find_all('script', type='application/ld+json')
    if schema_scripts:
        seo_data["schema_markup_present"] = True
        for script in schema_scripts:
            try:
                schema_json = json.loads(script.string or '{}')
                if isinstance(schema_json, dict):
                    types = [schema_json.get('@type')]
                    # check for @graph
                    if '@graph' in schema_json:
                        for item in schema_json['@graph']:
                            if isinstance(item, dict) and '@type' in item:
                                types.append(item['@type'])
                    
                    for t in types:
                        if t:
                            if isinstance(t, list):
                                seo_data["schema_types"].extend(t)
                            else:
                                seo_data["schema_types"].append(t)
                            
                            if "LocalBusiness" in t or "Organization" in t or "PostalAddress" in t:
                                seo_data["local_schema_found"] = True
                elif isinstance(schema_json, list):
                    for item in schema_json:
                        if isinstance(item, dict) and '@type' in item:
                            seo_data["schema_types"].append(item['@type'])
            except Exception as e:
                seo_data["schema_errors"].append(str(e))

    # Forms & UX
    forms = soup.find_all('form')
    seo_data["forms_count"] = len(forms)
    for f in forms:
        fields = len(f.find_all(['input', 'select', 'textarea']))
        if fields > seo_data["max_form_fields"]:
            seo_data["max_form_fields"] = fields

    # Basic Intrusive Popups detection
    popups = soup.find_all(lambda tag: tag.name in ['div', 'section'] and any(k in str(tag.get('class', '')).lower() or k in str(tag.get('id', '')).lower() for k in ['popup', 'modal', 'overlay', 'interstitial']))
    if popups:
        seo_data["has_popup"] = True

    # Social Meta Tags (Open Graph & Twitter)
    for meta in soup.find_all('meta'):
        prop = meta.get('property', '')
        name = meta.get('name', '')
        content = meta.get('content', '')
        if prop.startswith('og:'):
            seo_data["og_tags"][prop] = content
        elif name.startswith('twitter:'):
            seo_data["twitter_tags"][name] = content

    # Headers for GZIP and Cache detection
    if headers:
        content_encoding = headers.get("content-encoding", "").lower()
        if "gzip" in content_encoding or "br" in content_encoding or "deflate" in content_encoding:
            seo_data["is_gzip"] = True
        cache_control = headers.get("cache-control", "").lower()
        if cache_control and ("max-age" in cache_control or "public" in cache_control):
            seo_data["has_cache_headers"] = True

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
    seen_levels = set()
    nesting_error = False
    for h in headings_list:
        curr_level = int(h["tag"][1])
        seen_levels.add(curr_level)
        if curr_level > 1:
            if (curr_level - 1) not in seen_levels:
                nesting_error = True
    seo_data["heading_nesting_error"] = nesting_error

    # Text extraction for word count and readability
    text_soup = BeautifulSoup(html, "html.parser")
    for script in text_soup(["script", "style", "noscript", "iframe", "header", "footer"]):
        script.decompose()
    
    page_text = text_soup.get_text(separator=" ")
    words = [w.lower() for w in re.findall(r'\b\w+\b', page_text)]
    seo_data["word_count"] = len(words)

    # NAP detection (heuristics for Address/Phone presence in text)
    phone_pattern = re.compile(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b')
    if phone_pattern.search(page_text) and any(w in page_text.lower() for w in ["street", "road", "ave", "avenue", "suite", "postal", "zip", "city"]):
        seo_data["has_nap"] = True

    # Readability Score
    if textstat and seo_data["word_count"] > 0:
        try:
            raw_text = text_soup.get_text()
            seo_data["readability_score"] = textstat.flesch_reading_ease(raw_text)
        except Exception:
            seo_data["readability_score"] = 60.0 # fallback default
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
            
    # Canonical Tag
    canonical = soup.find('link', rel='canonical')
    if canonical and canonical.get('href'):
        seo_data["canonical"] = canonical['href']
        
    # Robots Meta
    robots = soup.find('meta', attrs={'name': 'robots'})
    if robots and robots.get('content'):
        seo_data["robots"] = robots['content'].lower()
        
    return seo_data


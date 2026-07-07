from typing import Dict, Any, List

def calculate_seo_score(seo_data: dict, target_keywords: List[str] = None) -> dict:
    """
    Calculates a weighted On-Page SEO score out of 100 based on 10 checks.
    Returns:
        {
            "score": int (0-100),
            "issues": list of {category, severity, issue, fixes, automatable}
        }
    """
    issues = []
    
    # 1. Title Tag (Weight: 15%)
    title_score = 15
    title = seo_data.get("title")
    title_length = seo_data.get("title_length", 0)
    if not title:
        title_score = 0
        issues.append({
            "category": "On-Page",
            "severity": "Error",
            "issue": "Missing Title Tag",
            "fixes": "Add a descriptive <title> tag between 50-60 characters.",
            "automatable": True
        })
    elif title_length < 50 or title_length > 60:
        title_score = 10
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": f"Non-optimal Title tag length ({title_length} chars)",
            "fixes": "Adjust title to be between 50-60 characters for optimal search engine display.",
            "automatable": True
        })
        
    # Check if target keyword is in title
    if title and target_keywords:
        keyword_found = any(kw.lower() in title.lower() for kw in target_keywords)
        if not keyword_found:
            title_score = max(0, title_score - 5)
            issues.append({
                "category": "On-Page",
                "severity": "Warning",
                "issue": "Target keywords missing from Title tag",
                "fixes": f"Include one of your target keywords ({', '.join(target_keywords)}) in the title tag.",
                "automatable": False
            })

    # 2. Meta Description (Weight: 10%)
    meta_score = 10
    meta_desc = seo_data.get("meta_description")
    meta_desc_len = seo_data.get("meta_description_length", 0)
    if not meta_desc:
        meta_score = 0
        issues.append({
            "category": "On-Page",
            "severity": "Error",
            "issue": "Missing Meta Description",
            "fixes": "Add a meta description tag between 150-160 characters.",
            "automatable": True
        })
    elif meta_desc_len < 150 or meta_desc_len > 160:
        meta_score = 7
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": f"Non-optimal Meta Description length ({meta_desc_len} chars)",
            "fixes": "Adjust meta description to be between 150-160 characters.",
            "automatable": True
        })

    # 3. Headings Structure (Weight: 15%)
    heading_score = 15
    h1_count = seo_data.get("h1_count", 0)
    if h1_count == 0:
        heading_score -= 5
        issues.append({
            "category": "On-Page",
            "severity": "Error",
            "issue": "Missing H1 Tag",
            "fixes": "Add exactly one main H1 heading to define the page content.",
            "automatable": False
        })
    elif h1_count > 1:
        heading_score -= 3
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": f"Multiple H1 tags found ({h1_count})",
            "fixes": "Ensure only one H1 tag is present. Demote other H1 tags to H2 or H3.",
            "automatable": False
        })
        
    if seo_data.get("heading_nesting_error", False):
        heading_score -= 10
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": "Incorrect Heading Nesting Structure",
            "fixes": "Ensure headings use sequential nesting (no skipping levels, e.g. H1 followed directly by H3).",
            "automatable": False
        })
    heading_score = max(0, heading_score)

    # 4. Content Length (Weight: 15%)
    content_len_score = 15
    word_count = seo_data.get("word_count", 0)
    if word_count < 300:
        content_len_score = 5
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": f"Thin Content ({word_count} words)",
            "fixes": "Expand page content to at least 300 words to improve SEO rankings and depth.",
            "automatable": False
        })

    # 5. Keyword Density (Weight: 10%)
    density_score = 10
    kws_to_check = target_keywords if target_keywords else seo_data.get("inferred_keywords", [])
    densities = seo_data.get("keyword_densities", {})
    
    if kws_to_check:
        optimal_density_found = False
        for kw in kws_to_check:
            dens = densities.get(kw, 0.0)
            if 0.5 <= dens <= 2.5:
                optimal_density_found = True
                break
        
        if not optimal_density_found:
            density_score = 5
            issues.append({
                "category": "On-Page",
                "severity": "Notice",
                "issue": "Sub-optimal keyword density",
                "fixes": f"Ensure your target/main keywords appear naturally. Target density is between 0.5% and 2.5%.",
                "automatable": False
            })
    else:
        density_score = 5

    # 6. Readability (Weight: 10%)
    readability_score_val = 10
    flesch_score = seo_data.get("readability_score", 60.0)
    if flesch_score < 30:
        readability_score_val = 3
        issues.append({
            "category": "On-Page",
            "severity": "Notice",
            "issue": f"Difficult reading level (Flesch: {flesch_score:.1f})",
            "fixes": "Simplify content sentences and vocabulary to improve content readability.",
            "automatable": False
        })
    elif flesch_score < 50:
        readability_score_val = 7
    elif flesch_score > 90:
        # highly readable
        readability_score_val = 10

    # 7. URL Structure (Weight: 5%)
    url_score = 5
    if seo_data.get("url_length", 0) > 75:
        url_score -= 2
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": f"URL length is long ({seo_data.get('url_length')} chars)",
            "fixes": "Optimize the page path to be under 75 characters.",
            "automatable": False
        })
    if seo_data.get("url_has_underscores", False):
        url_score -= 2
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": "URL path contains underscores",
            "fixes": "Use hyphens (-) instead of underscores (_) in URL paths.",
            "automatable": False
        })
    if seo_data.get("url_has_uppercase", False):
        url_score -= 1
        issues.append({
            "category": "On-Page",
            "severity": "Notice",
            "issue": "URL path contains uppercase letters",
            "fixes": "Use lowercase letters exclusively in URL paths.",
            "automatable": False
        })
    url_score = max(0, url_score)

    # 8. Internal Linking (Weight: 10%)
    internal_linking_score = 10
    # Calculated at the page level. If a page has no internal linking data, we assume nominal
    # or handle in main app. We keep 10 as default.

    # 9. Canonical Tag (Weight: 5%)
    canonical_score = 5
    if not seo_data.get("canonical"):
        canonical_score = 0
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": "Missing Canonical Tag",
            "fixes": "Add a self-referencing canonical URL link tag to avoid duplicate content penalties.",
            "automatable": True
        })

    # 10. Image Alt Attributes (Weight: 5%)
    img_score = 5
    total_imgs = seo_data.get("total_images", 0)
    missing_alts = seo_data.get("images_missing_alt", 0)
    if total_imgs > 0 and missing_alts > 0:
        ratio = missing_alts / total_imgs
        img_score = round(5 * (1 - ratio), 1)
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": f"Images missing alt text ({missing_alts} out of {total_imgs})",
            "fixes": "Add alt attributes to all <img> tags to describe images for search engines and accessibility.",
            "automatable": False
        })

    total_calculated = (
        title_score +
        meta_score +
        heading_score +
        content_len_score +
        density_score +
        readability_score_val +
        url_score +
        internal_linking_score +
        canonical_score +
        img_score
    )
    
    score = int(round(total_calculated))
    score = max(0, min(100, score))
    
    return {
        "score": score,
        "issues": issues
    }

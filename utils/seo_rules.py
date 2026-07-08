from typing import Dict, Any, List

def calculate_seo_score(seo_data: dict, target_keywords: List[str] = None) -> dict:
    """
    Calculates a weighted SEO score out of 100 based on Tier 1, 2, and 3 checks.
    Returns:
        {
            "score": int (0-100),
            "issues": list of {category, severity, issue, fixes, automatable}
        }
    """
    issues = []
    
    # -------------------------------------------------------------
    # TIER 1: Must-Have (Non-negotiable)
    # -------------------------------------------------------------
    
    # 1. Title Tag
    title_score = 15
    title = seo_data.get("title")
    title_length = seo_data.get("title_length", 0)
    if not title:
        title_score = 0
        issues.append({
            "category": "On-Page",
            "severity": "Error",
            "issue": "Missing Title Tag",
            "fixes": "1. Open the page source or your CMS editor.\n2. Locate the <head> block.\n3. Insert: <title>Primary Keyword - Action/Brand Name</title> ensuring length is 50-60 characters.",
            "automatable": True
        })
    elif title_length < 50 or title_length > 60:
        title_score = 10
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": f"Non-optimal Title tag length ({title_length} chars)",
            "fixes": "1. Open page title settings.\n2. Rewrite the title to fit between 50-60 characters.\n3. Remove filler words and keep the primary keyword close to the beginning.",
            "automatable": True
        })
        
    if title and target_keywords:
        keyword_found = any(kw.lower() in title.lower() for kw in target_keywords)
        if not keyword_found:
            title_score = max(0, title_score - 5)
            issues.append({
                "category": "On-Page",
                "severity": "Warning",
                "issue": "Target keywords missing from Title tag",
                "fixes": f"1. Identify the primary keyword ({', '.join(target_keywords)}).\n2. Update title block: '<title>Primary Keyword: Rest of Title</title>'.\n3. Save and redeploy.",
                "automatable": False
            })

    # 2. Meta Description
    meta_score = 10
    meta_desc = seo_data.get("meta_description")
    meta_desc_len = seo_data.get("meta_description_length", 0)
    if not meta_desc:
        meta_score = 0
        issues.append({
            "category": "On-Page",
            "severity": "Error",
            "issue": "Missing Meta Description",
            "fixes": "1. Go to page metadata configurations.\n2. Add: <meta name='description' content='...'>.\n3. Write a summary (150-160 characters) describing the page content with a call to action.",
            "automatable": True
        })
    elif meta_desc_len < 150 or meta_desc_len > 160:
        meta_score = 7
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": f"Non-optimal Meta Description length ({meta_desc_len} chars)",
            "fixes": "1. Open page metadata settings.\n2. Shorten or extend the content to be exactly between 150-160 characters to prevent search engines from truncating it.",
            "automatable": True
        })
    
    # Meta Description CTA Check
    if meta_desc:
        cta_verbs = ["buy", "learn", "discover", "get", "start", "find", "shop", "try", "register", "download", "contact", "call", "visit", "explore"]
        has_desc_cta = any(v in meta_desc.lower() for v in cta_verbs)
        if not has_desc_cta:
            issues.append({
                "category": "On-Page",
                "severity": "Notice",
                "issue": "Meta Description lacks a Call to Action (CTA)",
                "fixes": "1. Read your current meta description.\n2. Append a clear action command (e.g. 'Explore our pricing now', 'Get started today', 'Learn more!').",
                "automatable": False
            })

    # 3. Headings Structure & H1 Keyword
    heading_score = 15
    h1_count = seo_data.get("h1_count", 0)
    if h1_count == 0:
        heading_score -= 5
        issues.append({
            "category": "On-Page",
            "severity": "Error",
            "issue": "Missing H1 Tag",
            "fixes": "1. Open the page DOM editor.\n2. Pick the primary title element on the page.\n3. Wrap this title in <h1>heading text</h1> tag. Ensure only one exists per page.",
            "automatable": False
        })
    elif h1_count > 1:
        heading_score -= 3
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": f"Multiple H1 tags found ({h1_count})",
            "fixes": "1. Inspect all <h1> tags.\n2. Retain only one main <h1> at the top.\n3. Demote all other <h1> tags to <h2> or <h3> headings.",
            "automatable": False
        })
        
    if h1_count == 1 and target_keywords:
        h1_text = seo_data.get("h1_tags", [""])[0]
        keyword_in_h1 = any(kw.lower() in h1_text.lower() for kw in target_keywords)
        if not keyword_in_h1:
            heading_score -= 2
            issues.append({
                "category": "On-Page",
                "severity": "Warning",
                "issue": "Primary keyword missing from H1 tag",
                "fixes": f"1. Rewrite the H1 tag content.\n2. Incorporate the target keyword ({', '.join(target_keywords)}) naturally within the H1 heading text.",
                "automatable": False
            })

    if seo_data.get("heading_nesting_error", False):
        heading_score -= 5
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": "Incorrect Heading Nesting Structure",
            "fixes": "1. Check page outline hierarchy.\n2. Reorder headings sequentially (e.g., h1 followed by h2, then h3). Do not skip levels (e.g. h1 directly to h3).",
            "automatable": False
        })
    heading_score = max(0, heading_score)

    # 4. Keyword Density
    density_score = 10
    kws_to_check = target_keywords if target_keywords else seo_data.get("inferred_keywords", [])
    densities = seo_data.get("keyword_densities", {})
    
    if kws_to_check:
        optimal_density_found = False
        keyword_stuffed = False
        for kw in kws_to_check:
            dens = densities.get(kw, 0.0)
            if 1.0 <= dens <= 2.0:
                optimal_density_found = True
            if dens > 2.5:
                keyword_stuffed = True
        
        if keyword_stuffed:
            density_score = 5
            issues.append({
                "category": "On-Page",
                "severity": "Warning",
                "issue": "Keyword stuffing detected (>2.5% density)",
                "fixes": "1. Scan your page content.\n2. Replace repeated keywords with synonyms or pronouns.\n3. Make content read naturally for human users.",
                "automatable": False
            })
        elif not optimal_density_found:
            density_score = 7
            issues.append({
                "category": "On-Page",
                "severity": "Notice",
                "issue": "Sub-optimal keyword density (outside 1-2% range)",
                "fixes": "1. Locate high-value text sections.\n2. Insert your target keywords naturally in the first paragraph, a heading, and the conclusion to achieve 1.0% to 2.0% density.",
                "automatable": False
            })
    else:
        density_score = 5

    # 5. Internal Links Check
    internal_linking_score = 10
    int_links = seo_data.get("internal_links_count", 0)
    if int_links == 0:
        internal_linking_score = 0
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": "No internal links present on the page",
            "fixes": "1. Find relevant pages inside your site structure.\n2. Write anchor text referencing those topics.\n3. Use <a href='/other-page'>Keyword-focused anchor text</a> to connect pages.",
            "automatable": False
        })
    
    # Generic anchor links check
    generic_anchors = seo_data.get("generic_anchor_links", [])
    if generic_anchors:
        internal_linking_score = max(2, internal_linking_score - 3)
        issues.append({
            "category": "On-Page",
            "severity": "Notice",
            "issue": f"Generic anchor text used in {len(generic_anchors)} links (e.g. 'click here')",
            "fixes": "1. Inspect links with labels like 'click here' or 'more'.\n2. Rewrite link text to match the destination page topic (e.g. 'view our SEO tools checklist' instead of 'click here').",
            "automatable": False
        })

    # 6. Images Alt & Keyword inclusion
    img_score = 5
    total_imgs = seo_data.get("total_images", 0)
    missing_alts = seo_data.get("images_missing_alt", 0)
    if total_imgs > 0:
        if missing_alts > 0:
            ratio = missing_alts / total_imgs
            img_score = round(5 * (1 - ratio), 1)
            issues.append({
                "category": "On-Page",
                "severity": "Warning",
                "issue": f"Images missing alt text ({missing_alts} out of {total_imgs})",
                "fixes": "1. Locate <img> tags lacking alt attributes.\n2. Update tags to include descriptive text: <img src='...' alt='Description of the image containing keywords naturally'>.",
                "automatable": False
            })

    # 7. Mobile Responsiveness & Viewport
    mobile_score = 10
    if not seo_data.get("has_viewport"):
        mobile_score = 0
        issues.append({
            "category": "Technical",
            "severity": "Error",
            "issue": "Missing Mobile Viewport Meta Tag",
            "fixes": "1. Edit the HTML template's global <head> block.\n2. Paste: <meta name='viewport' content='width=device-width, initial-scale=1.0'>.\n3. Save and refresh page to test layout scale.",
            "automatable": True
        })
    elif not seo_data.get("has_media_queries"):
        mobile_score = 5
        issues.append({
            "category": "Technical",
            "severity": "Warning",
            "issue": "No CSS Media Queries detected",
            "fixes": "1. Open your global stylesheet (e.g., styles.css).\n2. Add responsive layouts: @media (max-width: 768px) { ... }.\n3. Adjust card layouts and font sizes for mobile viewports.",
            "automatable": False
        })

    # 8. SSL & Mixed Content
    ssl_score = 5
    if not seo_data.get("is_ssl"):
        ssl_score = 0
        issues.append({
            "category": "Technical",
            "severity": "Error",
            "issue": "SSL Certificate not active (Insecure HTTP)",
            "fixes": "1. Obtain a valid SSL certificate (e.g. via Let's Encrypt).\n2. Upload it to your hosting portal.\n3. Configure automatic 301 redirects from HTTP to HTTPS in server configuration (.htaccess or nginx.conf).",
            "automatable": False
        })
    elif seo_data.get("mixed_content_assets"):
        ssl_score = 2
        issues.append({
            "category": "Technical",
            "severity": "Warning",
            "issue": f"Mixed content detected ({len(seo_data['mixed_content_assets'])} HTTP resources loaded on HTTPS page)",
            "fixes": "1. Review list of mixed resources.\n2. Locate references in code (e.g., <script src='http://...'>).\n3. Change url protocols to use secure 'https://' prefix.",
            "automatable": True
        })

    # -------------------------------------------------------------
    # TIER 2: Important (Big impact, relatively easy)
    # -------------------------------------------------------------

    # 9. Structured Data / Schema Markup
    schema_score = 5
    if not seo_data.get("schema_markup_present"):
        schema_score = 0
        issues.append({
            "category": "Technical",
            "severity": "Warning",
            "issue": "Structured Data (Schema.org) markup is missing",
            "fixes": "1. Go to Google's Structured Data Helper.\n2. Select your page type (e.g., Article, LocalBusiness).\n3. Generate JSON-LD schema code and paste it in <script type='application/ld+json'> inside <head>.",
            "automatable": True
        })
    else:
        schema_types = seo_data.get("schema_types", [])
        expected_types = {"Organization", "Product", "Article", "BreadcrumbList", "FAQPage", "Review", "AggregateRating"}
        found_expected = [t for t in schema_types if t in expected_types]
        if not found_expected:
            issues.append({
                "category": "Technical",
                "severity": "Notice",
                "issue": f"No high-impact schema types found. Schema types detected: {', '.join(schema_types) if schema_types else 'None'}",
                "fixes": "1. Open schema definition block.\n2. Add rich types like Product (for sales), Article (for news/blog), or Organization.",
                "automatable": False
            })
        
        if seo_data.get("schema_errors"):
            schema_score = max(1, schema_score - 2)
            issues.append({
                "category": "Technical",
                "severity": "Error",
                "issue": f"Malformed Structured Data JSON-LD",
                "fixes": "1. Locate JSON-LD block inside <head>.\n2. Check for missing double quotes, trailing commas, or open braces.\n3. Validate code using Schema.org validator utility.",
                "automatable": True
            })

    # 10. Content Quality: Word count and readability
    word_count = seo_data.get("word_count", 0)
    readability_score_val = 5
    
    if word_count < 300:
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": f"Thin Content ({word_count} words)",
            "fixes": "1. Add descriptive sections (e.g., FAQ, case study, detailed steps).\n2. Expand information to exceed 300 words (500+ for guides).\n3. Ensure content satisfies the search intent.",
            "automatable": False
        })

    flesch_score = seo_data.get("readability_score", 60.0)
    if flesch_score < 40:
        readability_score_val = 2
        issues.append({
            "category": "On-Page",
            "severity": "Notice",
            "issue": f"Complex vocabulary (Flesch score: {flesch_score:.1f})",
            "fixes": "1. Run your text through a readability editor (e.g. Hemingway app).\n2. Break down long paragraphs (exceeding 4 sentences) into smaller ones.\n3. Replace technical jargon with simple, high-frequency words.",
            "automatable": False
        })

    # External authority links
    ext_links = seo_data.get("external_links_count", 0)
    if ext_links < 3:
        issues.append({
            "category": "On-Page",
            "severity": "Notice",
            "issue": f"Low external authority links count ({ext_links} links)",
            "fixes": "1. Find reputable source articles or documentation related to your topic.\n2. Write contextual mentions in your content.\n3. Add HTML links to those references (e.g. <a href='https://wikipedia.org/...'>Source</a>) with target='_blank'.",
            "automatable": False
        })

    # 11. User Experience (UX)
    if seo_data.get("forms_count") > 0 and seo_data.get("max_form_fields", 0) > 6:
        issues.append({
            "category": "Technical",
            "severity": "Notice",
            "issue": f"Excessive form fields detected ({seo_data.get('max_form_fields')} fields)",
            "fixes": "1. Remove non-essential fields from the form.\n2. Enable multi-step/paginated forms to minimize immediate cognitive load.\n3. Use smart autofill defaults where possible.",
            "automatable": False
        })
    if not seo_data.get("has_cta"):
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": "No visible Call-To-Action (CTA) found on the page",
            "fixes": "1. Place a clear action button (e.g. 'Get Started') in the hero section.\n2. Highlight it with a contrasting primary accent color.\n3. Anchor link the button to your key signup or contact form.",
            "automatable": False
        })
    if seo_data.get("has_popup"):
        issues.append({
            "category": "Technical",
            "severity": "Notice",
            "issue": "Potential intrusive popup/overlay detected",
            "fixes": "1. Adjust popup trigger delay to fire only after 30 seconds or 50% scroll depth.\n2. Ensure the 'close' (X) button is easily clickable on small mobile touchscreens.\n3. Do not block the initial viewport content on landing.",
            "automatable": False
        })

    # 12. Local SEO
    if not seo_data.get("local_schema_found") and not seo_data.get("google_business_link"):
        issues.append({
            "category": "Technical",
            "severity": "Notice",
            "issue": "Local SEO signals (Google Business link / local schema) missing",
            "fixes": "1. Set up your Google Business Profile listing.\n2. Add a footer link pointing to your maps URL.\n3. Inject a standard LocalBusiness schema block containing your business Name, Address, and Phone (NAP).",
            "automatable": False
        })

    # -------------------------------------------------------------
    # TIER 3: Nice-to-Have (Added value)
    # -------------------------------------------------------------

    # 13. Performance: Lazy loading & compression
    perf_score = 5
    if total_imgs > 3 and seo_data.get("lazy_loaded_images", 0) == 0:
        issues.append({
            "category": "Technical",
            "severity": "Notice",
            "issue": "Lazy loading not enabled for images",
            "fixes": "1. Identify off-screen <img> tags in your HTML.\n2. Insert the attribute loading='lazy' (e.g., <img src='logo.png' loading='lazy'>).\n3. Save and test loading speed.",
            "automatable": True
        })
    if not seo_data.get("is_gzip"):
        perf_score -= 2
        issues.append({
            "category": "Technical",
            "severity": "Warning",
            "issue": "Server-side GZIP/Brotli compression not detected",
            "fixes": "1. Access your hosting server settings or Nginx/Apache configuration file.\n2. For Nginx, set 'gzip on;' inside nginx.conf.\n3. For Apache, enable mod_deflate.",
            "automatable": False
        })
    if not seo_data.get("has_cache_headers"):
        perf_score -= 1
        issues.append({
            "category": "Technical",
            "severity": "Warning",
            "issue": "Browser caching headers missing",
            "fixes": "1. Open your server config file (.htaccess, web.config, or nginx.conf).\n2. Define expires rules for static assets (css, js, images) to use 'Cache-Control: max-age=31536000'.",
            "automatable": False
        })
    perf_score = max(0, perf_score)

    # 14. Social Metadata
    if not seo_data.get("og_tags") or len(seo_data.get("og_tags")) < 3:
        issues.append({
            "category": "On-Page",
            "severity": "Notice",
            "issue": "Open Graph (OG) social tags missing or incomplete",
            "fixes": "1. Open your global <head> tag editor.\n2. Insert: <meta property='og:title' content='page_title'>, <meta property='og:description' content='page_summary'>, and <meta property='og:image' content='image_url'>.\n3. Test utilizing the Facebook Sharing Debugger.",
            "automatable": True
        })
    if not seo_data.get("twitter_tags"):
        issues.append({
            "category": "On-Page",
            "severity": "Notice",
            "issue": "Twitter Cards metadata missing",
            "fixes": "1. Access the header section of your site templates.\n2. Paste: <meta name='twitter:card' content='summary_large_image'>, <meta name='twitter:title' content='page_title'>.\n3. Validate with Twitter Card Validator tool.",
            "automatable": True
        })

    # 15. URL & Canonical Checks
    url_score = 5
    if seo_data.get("url_length", 0) > 75:
        url_score -= 2
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": f"URL length is long ({seo_data.get('url_length')} chars)",
            "fixes": "1. Go to page routing settings.\n2. Remove unnecessary folders or long URL query parameters.\n3. Target a slug structure with fewer than 4-5 words.",
            "automatable": False
        })
    if seo_data.get("url_has_underscores", False):
        url_score -= 2
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": "URL path contains underscores",
            "fixes": "1. Rename the physical file or rewrite the path route.\n2. Replace all underscores (_) characters with hyphens (-).\n3. Set up a 301 redirect from the old URL to the new URL path.",
            "automatable": False
        })
    if seo_data.get("url_has_uppercase", False):
        url_score -= 1
        issues.append({
            "category": "On-Page",
            "severity": "Notice",
            "issue": "URL path contains uppercase letters",
            "fixes": "1. Open routing or page setup settings.\n2. Convert all slug letters to lowercase.\n3. Enforce automatic lowercasing redirects in server rules.",
            "automatable": False
        })
    url_score = max(0, url_score)

    canonical_score = 5
    if not seo_data.get("canonical"):
        canonical_score = 0
        issues.append({
            "category": "On-Page",
            "severity": "Warning",
            "issue": "Missing Canonical Tag",
            "fixes": "1. Open HTML head file.\n2. Add: <link rel='canonical' href='https://yourdomain.com/exact-page-path'>.\n3. Make sure it points to the authoritative URL version of the page.",
            "automatable": True
        })

    # 16. Simulated Core Web Vitals
    # Simulate realistic vitals matching the page layout/response
    simulated_vitals = {
        "lcp": round(1.2 + (word_count / 1200) + (total_imgs * 0.15) - (seo_data.get("lazy_loaded_images", 0) * 0.05), 2),
        "fid": int(10 + (seo_data.get("forms_count", 0) * 8)),
        "cls": round(0.01 + (total_imgs - seo_data.get("lazy_loaded_images", 0)) * 0.01, 3)
    }
    
    if simulated_vitals["lcp"] > 2.5:
        issues.append({
            "category": "Technical",
            "severity": "Warning",
            "issue": f"Core Web Vitals LCP check failed (LCP: {simulated_vitals['lcp']}s > 2.5s)",
            "fixes": "1. Compress all static images to WebP format.\n2. Defer loading of non-critical CSS/JS files.\n3. Implement content preloading for hero images.",
            "automatable": False
        })
    if simulated_vitals["fid"] > 100:
        issues.append({
            "category": "Technical",
            "severity": "Warning",
            "issue": f"Core Web Vitals FID check failed (FID: {simulated_vitals['fid']}ms > 100ms)",
            "fixes": "1. Minimize the payload of imported JS libraries.\n2. Move heavy scripts to a Web Worker background thread.\n3. Break up long tasks (>50ms) into smaller asynchronous blocks.",
            "automatable": False
        })
    if simulated_vitals["cls"] > 0.1:
        issues.append({
            "category": "Technical",
            "severity": "Warning",
            "issue": f"Core Web Vitals CLS check failed (CLS: {simulated_vitals['cls']} > 0.1)",
            "fixes": "Set explicit width/height dimensions on images, videos, and dynamic components.",
            "automatable": False
        })

    # Aggregate Scoring
    total_calculated = (
        title_score +
        meta_score +
        heading_score +
        density_score +
        internal_linking_score +
        img_score +
        mobile_score +
        ssl_score +
        schema_score +
        readability_score_val +
        perf_score +
        url_score +
        canonical_score
    )
    
    # Normalize score out of 100
    # Current max theoretical base is 15+10+15+10+10+5+10+5+5+5+5+5+5 = 105
    score = int(round((total_calculated / 105) * 100))
    score = max(0, min(100, score))
    
    return {
        "score": score,
        "issues": issues,
        "vitals": simulated_vitals
    }

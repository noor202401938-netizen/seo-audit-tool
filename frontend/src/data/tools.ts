export interface ToolItem {
    name: string;
    slug: string;
    desc: string;
    upcoming?: boolean;
    apiKeyRequired?: boolean;
    apiKeyOptional?: boolean;
    apiKeyName?: string;
    apiKeyLink?: string;
}

export interface ToolCategory {
    title: string;
    tools: ToolItem[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
    {
        title: "SEO Audit & Site Analysis Tools",
        tools: [
            { 
                name: "SEO Audit Tool",
                slug: "seo-audit-tool",
                desc: "Comprehensive analysis of your website's on-page and off-page elements, including meta tags, content structure, and technical SEO factors. Runs 100% locally with unlimited audits." 
            },
            { 
                name: "Core Web Vitals Checker", 
                slug: "core-web-vitals-checker",
                desc: "Measure your site's loading performance and identify speed optimization opportunities with zero external dependencies." 
            },
            { 
                name: "Mobile-Friendly Test Tool", 
                slug: "mobile-friendly-test-tool",
                desc: "Ensure your website performs perfectly on mobile devices. Fast local diagnostic." 
            }
        ]
    },
    {
        title: "Keyword Research & SERP Tools",
        tools: [
            { 
                name: "Keyword Research Tool", 
                slug: "keyword-research-tool",
                desc: "Discover search trends and keyword ideas. Optional: Connect Keywords Everywhere API for live search volumes and CPC.",
                apiKeyOptional: true,
                apiKeyName: "Keywords Everywhere API Key",
                apiKeyLink: "https://keywordseverywhere.com/api.html"
            },
            { 
                name: "Google SERP Rank Checker", 
                slug: "google-serp-rank-checker",
                desc: "Scrape and track your website's position in live Google search results for targeted keywords (No API key needed)." 
            },
            { 
                name: "Bing SERP Checker Tool", 
                slug: "bing-serp-checker-tool",
                desc: "Check your rankings on Microsoft Bing search engine and capture additional organic traffic (No API key needed)." 
            },
            { 
                name: "YouTube SERP Rank Checker", 
                slug: "youtube-serp-rank-checker",
                desc: "Optimize video content by tracking YouTube search rankings. Requires free YouTube Data API Key.",
                apiKeyRequired: true,
                apiKeyName: "YouTube Data API Key",
                apiKeyLink: "https://console.cloud.google.com/"
            },
            { 
                name: "Google AI Overview Keywords Checker", 
                slug: "google-ai-overview-keywords-checker",
                desc: "Check which of your keywords trigger Google AI Overviews and track your presence in AI-generated search results.", 
                upcoming: true 
            }
        ]
    },
    {
        title: "Technical SEO Analysis Tools",
        tools: [
            { 
                name: "Robots.txt Tester", 
                slug: "robots-txt-tester",
                desc: "Verify your robots.txt file to ensure search engines can properly crawl your website (No API key needed)." 
            },
            { 
                name: "Sitemap Checker Tool", 
                slug: "sitemap-checker-tool",
                desc: "Validate your XML sitemap and ensure all important pages are discoverable by search engines (No API key needed)." 
            },
            { 
                name: "Crawlability Test Tool", 
                slug: "crawlability-test-tool",
                desc: "Identify crawling issues that might prevent search engines from properly indexing your content (No API key needed)." 
            },
            { 
                name: "HTTPS Header Checker", 
                slug: "https-header-checker",
                desc: "Analyze HTTP security headers (HSTS, CSP, X-Frame-Options) for security compliance (No API key needed)." 
            },
            { 
                name: "LLMs.txt Generator", 
                slug: "llms-txt-generator",
                desc: "Generate an llms.txt file to guide how AI crawlers and language models access and cite your website's content (No API key needed)." 
            }
        ]
    },
    {
        title: "Content Optimization Tools",
        tools: [
            { 
                name: "Keyword Density Checker", 
                slug: "keyword-density-checker",
                desc: "Optimize content by analyzing keyword frequency and distribution without over-optimization (No API key needed)." 
            },
            { 
                name: "Meta Tags Checker", 
                slug: "meta-tags-checker",
                desc: "Extract and analyze meta titles, descriptions, and Open Graph tags crucial for search engine visibility (No API key needed)." 
            },
            { 
                name: "Internal Link Analysis Tool", 
                slug: "internal-link-analysis-tool",
                desc: "Examine internal linking structure to improve user navigation and distribute page authority effectively (No API key needed)." 
            }
        ]
    },
    {
        title: "Link Building & Authority Tools",
        tools: [
            { 
                name: "Backlink Checker Tool", 
                slug: "backlink-checker-tool",
                desc: "Discover your website's backlink profile and identify link-building opportunities.", 
                upcoming: true 
            },
            { 
                name: "Domain Authority Checker", 
                slug: "domain-authority-checker",
                desc: "Assess website authority based on backlink quality and quantity. Optional: Connect OpenPageRank for global PageRank data.",
                apiKeyOptional: true,
                apiKeyName: "OpenPageRank API Key",
                apiKeyLink: "https://www.domcop.com/openpagerank/auth/signup"
            },
            { 
                name: "Anchor Text Link Extractor", 
                slug: "anchor-text-link-extractor",
                desc: "Analyze anchor text distribution in your backlinks to ensure natural and diverse link profiles.", 
                upcoming: true 
            }
        ]
    },
    {
        title: "Advanced SEO Utilities",
        tools: [
            { 
                name: "URL Redirect Checker", 
                slug: "url-redirect-checker",
                desc: "Detect and trace 301, 302, and chained URL redirects to preserve link equity (No API key needed)." 
            },
            { 
                name: "Wayback Machine Archive Checker", 
                slug: "wayback-machine-archive-checker",
                desc: "Check historical snapshots captured by the Internet Archive Wayback Machine (No API key needed)." 
            },
            { 
                name: "Organic Traffic Checker", 
                slug: "organic-traffic-checker",
                desc: "Analyze website organic traffic volume and discover competitor traffic insights.", 
                upcoming: true 
            },
            { 
                name: "Website Technology Checker", 
                slug: "website-technology-checker",
                desc: "Identify the technology stack behind any website, including CMS, frameworks, and web servers (No API key needed)." 
            },
            { 
                name: "Email Verification Tool", 
                slug: "email-verification-tool",
                desc: "Validate email addresses with SMTP and DNS MX verification (No API key needed)." 
            }
        ]
    },
    {
        title: "Competitor Analysis Tools",
        tools: [
            { 
                name: "Competitor Keyword Research Tool", 
                slug: "competitor-keyword-research-tool",
                desc: "Uncover the keywords your competitors rank for and identify content gaps in your strategy.", 
                upcoming: true 
            },
            { 
                name: "Organic Traffic Analysis", 
                slug: "organic-traffic-analysis",
                desc: "Compare your organic traffic performance against competitors and industry benchmarks.", 
                upcoming: true 
            }
        ]
    },
    {
        title: "AI-Powered SEO Assistant",
        tools: [
            { 
                name: "AI SEO Assistant", 
                slug: "ai-seo-assistant",
                desc: "Get personalized SEO guidance and task recommendations powered by Google Gemini. Requires Gemini API Key in Settings.",
                apiKeyRequired: true,
                apiKeyName: "Google Gemini API Key",
                apiKeyLink: "https://aistudio.google.com/app/apikey"
            },
            { 
                name: "Google AI Mode Checker", 
                slug: "google-ai-mode-checker",
                desc: "See how your site appears in Google's AI Mode and monitor your visibility across AI-driven search experiences.", 
                upcoming: true 
            }
        ]
    }
];

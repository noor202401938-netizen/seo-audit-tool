import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { TOOL_CATEGORIES } from '../data/tools';
import { DynamicResultRenderer } from '../components/DynamicResultRenderer';

// Define the available tool mapping (Phase 1 & 2)
const AVAILABLE_TOOLS = [
    "robots-txt-tester",
    "sitemap-checker-tool",
    "https-header-checker",
    "meta-tags-checker",
    "website-technology-checker",
    "url-redirect-checker",
    "llms-txt-generator",
    "email-verification-tool",
    "keyword-density-checker",
    "internal-link-analysis-tool",
    "crawlability-test-tool",
    "mobile-friendly-test-tool",
    "ai-seo-assistant",
    "image-optimizer-tool",
    "schema-markup-validator",
    "canonical-tag-checker",
    "broken-link-checker",
    "core-web-vitals-checker",
    "website-speed-test-tool",
    "serp-rank-checker-tool",
    "backlink-checker-tool",
    "ssl-certificate-checker",
    "malware-security-scanner",
    "seo-competitor-analysis",
    "domain-authority-checker",
    "social-media-tags-checker",
    "keyword-research-tool",
    "company-logo-api",
    "wayback-machine-archive-checker",
    "youtube-serp-rank-checker",
    "google-serp-rank-checker",
    "bing-serp-checker-tool",
    "ai-seo-assistant"
];

export default function ToolRunner() {
    const { toolId } = useParams<{ toolId: string }>();
    const navigate = useNavigate();

    const { token } = useAuth();
    
    useEffect(() => {
        if (toolId === 'seo-audit-tool') {
            navigate('/app');
            return;
        }
        
        if (toolId && token) {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            fetch(`${apiUrl}/api/tools/track`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ tool_id: toolId })
            }).catch(e => console.error("Failed to track tool usage:", e));
        }
    }, [toolId, navigate, token]);
    
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    // Find the tool details from TOOL_CATEGORIES based on the route param
    const toolDetails = (() => {
        for (const cat of TOOL_CATEGORIES) {
            for (const t of cat.tools) {
                // Convert tool name to slug for matching
                const slug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                if (slug === toolId) return { ...t, slug };
            }
        }
        return null;
    })();

    // Check if the requested tool is a phase 1 or 2 implementation
    const isAvailableTool = toolDetails && AVAILABLE_TOOLS.includes(toolDetails.slug);
    const isEmailTool = toolDetails?.slug === 'email-verification-tool';
    const isKeywordTool = toolDetails?.slug === 'keyword-research-tool';
    const isSerpTool = ['youtube-serp-rank-checker', 'google-serp-rank-checker', 'bing-serp-checker-tool'].includes(toolDetails?.slug || '');
    const isAiTool = toolDetails?.slug === 'ai-seo-assistant';
    
    // For tools that need two inputs
    const [target, setTarget] = useState('');

    const handleRunTool = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            
            // Map the tool slug to the backend endpoint
            const endpointMap: Record<string, string> = {
                "robots-txt-tester": "/api/tools/robots-txt-tester",
                "sitemap-checker-tool": "/api/tools/sitemap-checker",
                "https-header-checker": "/api/tools/https-header-checker",
                "meta-tags-checker": "/api/tools/meta-tags-checker",
                "website-technology-checker": "/api/tools/website-technology-checker",
                "url-redirect-checker": "/api/tools/url-redirect-checker",
                "llms-txt-generator": "/api/tools/llms-txt-generator",
                "email-verification-tool": "/api/tools/email-verification",
                "keyword-density-checker": "/api/tools/keyword-density-checker",
                "internal-link-analysis-tool": "/api/tools/internal-link-analysis-tool",
                "crawlability-test-tool": "/api/tools/crawlability-test-tool",
                "mobile-friendly-test-tool": "/api/tools/mobile-friendly-test-tool",
                "ai-seo-assistant": "/api/tools/ai-seo-assistant",
                "image-optimizer-tool": "/api/tools/image-optimizer-tool",
                "schema-markup-validator": "/api/tools/schema-markup-validator",
                "canonical-tag-checker": "/api/tools/canonical-tag-checker",
                "broken-link-checker": "/api/tools/broken-link-checker",
                "core-web-vitals-checker": "/api/tools/core-web-vitals-checker",
                "website-speed-test-tool": "/api/tools/core-web-vitals-checker",
                "serp-rank-checker-tool": "/api/tools/serp-rank-checker-tool",
                "backlink-checker-tool": "/api/tools/backlink-checker-tool",
                "ssl-certificate-checker": "/api/tools/ssl-certificate-checker",
                "malware-security-scanner": "/api/tools/malware-security-scanner",
                "seo-competitor-analysis": "/api/tools/seo-competitor-analysis",
                "domain-authority-checker": "/api/tools/domain-authority-checker",
                "social-media-tags-checker": "/api/tools/social-media-tags-checker",
                "keyword-research-tool": "/api/tools/keyword-research-tool",
                "company-logo-api": "/api/tools/company-logo-api",
                "wayback-machine-archive-checker": "/api/tools/wayback-machine-archive-checker",
                "youtube-serp-rank-checker": "/api/tools/youtube-serp-rank-checker",
                "google-serp-rank-checker": "/api/tools/google-serp-rank-checker",
                "bing-serp-checker-tool": "/api/tools/bing-serp-checker-tool"
            };

            const endpoint = endpointMap[toolDetails?.slug || ""];
            if (!endpoint) throw new Error("Tool endpoint not mapped.");

            let payload: any;
            if (isEmailTool) {
                payload = { email: url };
            } else if (isKeywordTool) {
                payload = { keyword: url };
            } else if (isSerpTool) {
                payload = { keyword: url, target: target };
            } else if (isAiTool) {
                payload = { query: url };
            } else {
                payload = { url: url };
            }

            const response = await fetch(`${apiUrl}${endpoint}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to run tool. Please try again later.');
            }

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!toolDetails) {
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center h-[50vh]">
                <h1 className="text-3xl font-bold text-white mb-4">Tool Not Found</h1>
                <p className="text-slate-text mb-8">We couldn't find the requested tool.</p>
            </div>
        );
    }

    return (
        <div className="text-on-surface font-sans selection:bg-electric-indigo/30 px-4 lg:px-8 pt-8 pb-24">
            <div className="max-w-4xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
                        {toolDetails.name}
                    </h1>
                    <p className="text-lg text-slate-text">
                        {toolDetails.desc}
                    </p>
                </motion.div>

                {!isAvailableTool ? (
                    <div className="premium-card bg-slate-950/40 border border-white/10 rounded-2xl p-12 text-center">
                        <span className="material-symbols-outlined text-4xl text-cyan-flare mb-4">construction</span>
                        <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
                        <p className="text-slate-text">This dedicated tool is currently under development as part of an upcoming phase. For now, please use the main SEO Audit tool to evaluate this metric.</p>
                        <Button onClick={() => navigate('/app')} className="mt-8 bg-white/10 hover:bg-white/20 text-white border border-white/10">Run Full Audit Instead</Button>
                    </div>
                ) : (
                    <>
                        <form onSubmit={handleRunTool} className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-text" />
                                <Input
                                    type={isEmailTool ? "email" : "text"}
                                    placeholder={
                                        isAiTool ? "Enter a query, keyword, or URL (e.g., How to rank for SEO?)" :
                                        isSerpTool ? "Enter a keyword to search (e.g., SEO tutorial)" :
                                        isKeywordTool ? "Enter a keyword (e.g., SEO tips)" : 
                                        isEmailTool ? "you@example.com" : 
                                        "https://example.com"
                                    }
                                    className="pl-10 h-14 text-lg border-white/20 bg-slate-950/50 text-on-surface focus-visible:ring-electric-indigo rounded-xl placeholder:text-slate-text/50 glass-card w-full"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                />
                            </div>
                            
                            {isSerpTool && (
                                <div className="relative w-full sm:flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-text" />
                                    <Input
                                        type="text"
                                        placeholder="Target Domain, Channel, or Video ID (e.g., ahrefs.com)"
                                        className="pl-10 h-14 text-lg border-white/20 bg-slate-950/50 text-on-surface focus-visible:ring-electric-indigo rounded-xl placeholder:text-slate-text/50 glass-card w-full"
                                        value={target}
                                        onChange={(e) => setTarget(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                className="h-14 px-8 rounded-xl bg-electric-indigo hover:bg-electric-indigo/90 text-white font-headline-md text-lg transition-colors w-full sm:w-auto"
                                disabled={isLoading || !url.trim() || (isSerpTool && !target.trim())}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Running...
                                    </>
                                ) : (
                                    'Run Tool'
                                )}
                            </Button>
                        </form>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-8 p-4 bg-error/10 border border-error/20 rounded-xl text-error"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {result && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="premium-card bg-slate-950/40 border border-white/10 rounded-2xl p-8"
                                >
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-success">check_circle</span>
                                        Results
                                    </h3>
                                    {result.logo_url && (
                                        <div className="mb-6 bg-white/5 p-6 rounded-xl flex items-center justify-center border border-white/10">
                                            <img 
                                                src={result.logo_url} 
                                                alt={`${result.domain} logo`} 
                                                className="max-w-[200px] max-h-[100px] object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                    
                                    {toolId === 'keyword-research-tool' && result.keyword ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div className="glass-card p-6 rounded-xl border border-white/10 bg-slate-900/30">
                                                    <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-electric-indigo">trending_up</span>Search Volume
                                                    </h4>
                                                    <div className="text-slate-300">
                                                        {typeof result.search_volume_data === 'string' ? (
                                                            <p className="text-slate-400 italic mt-4 p-4 bg-slate-950/50 rounded-lg">{result.search_volume_data}</p>
                                                        ) : (
                                                            <div className="grid grid-cols-3 gap-4 mt-4">
                                                                <div className="bg-slate-950/50 p-4 rounded-lg text-center border border-white/5">
                                                                    <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Volume</span>
                                                                    <span className="text-xl font-bold text-white">{result.search_volume_data?.vol || 'N/A'}</span>
                                                                </div>
                                                                <div className="bg-slate-950/50 p-4 rounded-lg text-center border border-white/5">
                                                                    <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">CPC</span>
                                                                    <span className="text-xl font-bold text-white">{result.search_volume_data?.cpc ? `$${result.search_volume_data.cpc.currency} ${result.search_volume_data.cpc.value}` : 'N/A'}</span>
                                                                </div>
                                                                <div className="bg-slate-950/50 p-4 rounded-lg text-center border border-white/5">
                                                                    <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Competition</span>
                                                                    <span className="text-xl font-bold text-white">{result.search_volume_data?.competition || 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="glass-card p-6 rounded-xl border border-white/10 bg-slate-900/30">
                                                    <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-cyan-flare">timeline</span>5-Week Trend
                                                    </h4>
                                                    {result.trends_data_last_5_weeks ? (
                                                        <div className="flex items-end justify-between h-32 mt-4 gap-2 pt-8">
                                                            {Object.entries(result.trends_data_last_5_weeks).map(([date, val]: any) => (
                                                                <div key={date} className="flex flex-col items-center flex-1 group relative">
                                                                    <div className="w-full bg-cyan-flare/30 rounded-t-md transition-all duration-300 group-hover:bg-cyan-flare relative" style={{ height: `${Math.max(val, 5)}%` }}>
                                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-10 border border-white/10">
                                                                            {val}
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-[10px] text-slate-500 mt-2 truncate w-full text-center">{date.substring(5)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-slate-400 italic">No trend data available.</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="glass-card p-6 rounded-xl border border-white/10 bg-slate-900/30">
                                                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-purple-400">format_list_bulleted</span>Autocomplete Suggestions
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.autocomplete_suggestions?.map((s: string, i: number) => (
                                                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 hover:bg-electric-indigo/20 hover:text-white hover:border-electric-indigo/50 transition-all cursor-default">
                                                                {s}
                                                            </span>
                                                        ))}
                                                        {(!result.autocomplete_suggestions || result.autocomplete_suggestions.length === 0) && (
                                                            <span className="text-slate-500 italic">No suggestions found.</span>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="glass-card p-6 rounded-xl border border-white/10 bg-slate-900/30">
                                                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-orange-400">hub</span>Related Terms
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.related_terms?.map((t: string, i: number) => (
                                                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 hover:bg-orange-400/20 hover:text-white hover:border-orange-400/50 transition-all cursor-default">
                                                                {t}
                                                            </span>
                                                        ))}
                                                        {(!result.related_terms || result.related_terms.length === 0) && (
                                                            <span className="text-slate-500 italic">No related terms found.</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-4">
                                            <DynamicResultRenderer data={result} />
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div>
    );
}

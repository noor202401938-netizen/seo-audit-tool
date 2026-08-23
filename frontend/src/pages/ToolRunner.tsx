import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Loader2, KeyRound, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { TOOL_CATEGORIES } from '../data/tools';
import { DynamicResultRenderer } from '../components/DynamicResultRenderer';

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
    "bing-serp-checker-tool"
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
        
        if (toolId) {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            fetch(`${apiUrl}/api/tools/track`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ tool_id: toolId })
            }).catch(() => {});
        }
    }, [toolId, navigate, token]);
    
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [target, setTarget] = useState('');

    const toolDetails = (() => {
        const normalizedParam = (toolId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        for (const cat of TOOL_CATEGORIES) {
            for (const t of cat.tools) {
                const normalizedToolSlug = t.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (t.slug === toolId || normalizedToolSlug === normalizedParam) {
                    return t;
                }
            }
        }
        return null;
    })();

    const isAvailableTool = toolDetails && AVAILABLE_TOOLS.includes(toolDetails.slug);
    const isEmailTool = toolDetails?.slug === 'email-verification-tool';
    const isKeywordTool = toolDetails?.slug === 'keyword-research-tool';
    const isSerpTool = ['youtube-serp-rank-checker', 'google-serp-rank-checker', 'bing-serp-checker-tool'].includes(toolDetails?.slug || '');
    const isAiTool = toolDetails?.slug === 'ai-seo-assistant';

    const handleRunTool = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            
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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errText = 'Failed to run tool. Please ensure the backend is running.';
                try {
                    const errJson = await response.json();
                    errText = errJson.detail || errJson.message || errText;
                } catch (e) {}
                throw new Error(errText);
            }

            const data = await response.json();
            if (data && data.error && !data.results) {
                setError(data.error + (data.message ? `: ${data.message}` : ''));
            }
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!toolDetails) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-[60vh] bg-[#09090b] text-white">
                <h1 className="text-2xl font-bold text-white mb-2">Tool Not Found</h1>
                <p className="text-xs text-zinc-400 mb-6">We couldn't find the requested tool specification.</p>
                <Button onClick={() => navigate('/')} className="bg-white text-black font-bold text-xs px-5 py-2 rounded-lg">Return to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="bg-[#09090b] text-white min-h-full px-4 lg:px-8 pt-8 pb-20">
            <div className="max-w-4xl mx-auto space-y-6">

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-zinc-800 pb-6"
                >
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            UTILITY &bull; {toolDetails.slug.toUpperCase()}
                        </span>

                        {toolDetails.apiKeyRequired ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800 text-[11px] font-mono text-amber-300 font-semibold">
                                <KeyRound className="w-3 h-3" />
                                Requires API Key: {toolDetails.apiKeyName}
                            </span>
                        ) : toolDetails.apiKeyOptional ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800 text-[11px] font-mono text-sky-300">
                                <KeyRound className="w-3 h-3" />
                                Optional Key: {toolDetails.apiKeyName}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/80 text-[11px] font-mono text-emerald-300 font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                100% Free &bull; Zero API Keys Needed
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                        {toolDetails.name}
                    </h1>
                    <p className="text-sm text-zinc-300">
                        {toolDetails.desc}
                    </p>

                    {toolDetails.apiKeyRequired && (
                        <div className="mt-4 p-3.5 bg-amber-950/30 border border-amber-900/60 rounded-lg flex items-center justify-between text-xs text-amber-200">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>This tool requires a <strong>{toolDetails.apiKeyName}</strong> configured in your local environment.</span>
                            </div>
                            <Link to="/profile" className="inline-flex items-center gap-1 font-bold underline hover:text-white shrink-0 ml-4">
                                Configure in Settings <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    )}
                </motion.div>

                {!isAvailableTool ? (
                    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-10 text-center space-y-4 shadow-xl">
                        <span className="material-symbols-outlined text-4xl text-amber-400">construction</span>
                        <h2 className="text-xl font-bold text-white">Tool In Active Development</h2>
                        <p className="text-xs text-zinc-400 max-w-md mx-auto">This tool is scheduled for an upcoming release. In the meantime, run a full domain audit to check these signals.</p>
                        <Button onClick={() => navigate('/')} className="bg-white text-black font-bold text-xs px-6 py-2.5 rounded-lg border border-white">Run Full Audit Instead</Button>
                    </div>
                ) : (
                    <>
                        <form onSubmit={handleRunTool} className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-900 p-4 rounded-xl border border-zinc-700 shadow-xl">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <Input
                                    type={isEmailTool ? "email" : "text"}
                                    placeholder={
                                        isAiTool ? "Enter a query or target URL (e.g. how to improve meta tags)..." :
                                        isSerpTool ? "Enter keyword to track..." :
                                        isKeywordTool ? "Enter a keyword (e.g. SEO strategy)..." : 
                                        isEmailTool ? "you@example.com" : 
                                        "https://example.com"
                                    }
                                    className="pl-10 h-12 text-sm border-zinc-800 bg-zinc-950 text-white focus-visible:ring-1 focus-visible:ring-zinc-700 rounded-lg placeholder:text-zinc-500 w-full font-medium"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                />
                            </div>
                            
                            {isSerpTool && (
                                <div className="relative w-full sm:flex-1">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input
                                        type="text"
                                        placeholder="Target Domain or Channel (e.g. wikipedia.org)..."
                                        className="pl-10 h-12 text-sm border-zinc-800 bg-zinc-950 text-white focus-visible:ring-1 focus-visible:ring-zinc-700 rounded-lg placeholder:text-zinc-500 w-full font-medium"
                                        value={target}
                                        onChange={(e) => setTarget(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                disabled={isLoading || !url.trim()}
                                className="h-12 w-full sm:w-36 bg-white hover:bg-zinc-100 text-black font-bold text-xs rounded-lg transition-all border border-white shrink-0 shadow-md"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Running...</span>
                                    </div>
                                ) : (
                                    "Run Tool"
                                )}
                            </Button>
                        </form>

                        {error && (
                            <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 font-mono text-xs font-medium">
                                {error}
                            </div>
                        )}

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl"
                            >
                                <DynamicResultRenderer data={result} />
                            </motion.div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { useAuth } from '../contexts/AuthContext';
const TOOL_CATEGORIES = [
    {
        title: "SEO Audit & Site Analysis Tools",
        tools: [
            { name: "SEO Audit Tool", desc: "Comprehensive analysis of your website's on-page and off-page elements, including meta tags, content structure, and technical SEO factors. Get actionable insights to improve your search engine visibility." },
            { name: "Website Speed Test Tool", desc: "Measure your site's loading performance and identify speed optimization opportunities. Fast-loading websites rank better and provide superior user experience." },
            { name: "Mobile-Friendly Test Tool", desc: "Ensure your website performs perfectly on mobile devices. With mobile-first indexing, this tool is crucial for maintaining search rankings." }
        ]
    },
    {
        title: "Keyword Research & SERP Tools",
        tools: [
            { name: "Keyword Research Tool", desc: "Discover high-value keywords for your content strategy. Find search volumes, competition levels, and related terms to target the right audience." },
            { name: "Google SERP Rank Checker", desc: "Track your website's position in Google search results for targeted keywords. Monitor ranking changes and optimize accordingly." },
            { name: "Bing SERP Checker Tool", desc: "Don't overlook Bing! Check your rankings on Microsoft's search engine and capture additional organic traffic." },
            { name: "YouTube SERP Rank Checker", desc: "Optimize your video content by tracking YouTube search rankings. Perfect for content creators and businesses using video marketing." },
            { name: "Google AI Overview Keywords Checker", desc: "Check which of your keywords trigger Google AI Overviews and track your presence in AI-generated search results." }
        ]
    },
    {
        title: "Technical SEO Analysis Tools",
        tools: [
            { name: "Robots.txt Tester", desc: "Verify your robots.txt file to ensure search engines can properly crawl your website. Avoid blocking important pages accidentally." },
            { name: "Sitemap Checker Tool", desc: "Validate your XML sitemap and ensure all important pages are discoverable by search engines." },
            { name: "Crawlability Test Tool", desc: "Identify crawling issues that might prevent search engines from properly indexing your content." },
            { name: "HTTPS Header Checker", desc: "Analyze HTTP headers to ensure proper security implementation and technical SEO compliance." },
            { name: "LLMs.txt Generator", desc: "Generate an llms.txt file to guide how AI crawlers and language models access and cite your website's content." }
        ]
    },
    {
        title: "Content Optimization Tools",
        tools: [
            { name: "Keyword Density Checker", desc: "Optimize your content by analyzing keyword frequency and distribution. Avoid over-optimization while ensuring proper keyword usage." },
            { name: "Meta Tags Checker", desc: "Extract and analyze meta titles, descriptions, and other meta elements crucial for search engine visibility." },
            { name: "Internal Link Analysis Tool", desc: "Examine your internal linking structure to improve user navigation and distribute page authority effectively." }
        ]
    },
    {
        title: "Link Building & Authority Tools",
        tools: [
            { name: "Backlink Checker Tool", desc: "Discover your website's backlink profile and identify link-building opportunities. Quality backlinks remain a crucial ranking factor." },
            { name: "Domain Authority Checker", desc: "Assess your website's authority based on backlink quality and quantity. Compare your authority against competitors." },
            { name: "Anchor Text Link Extractor", desc: "Analyze anchor text distribution in your backlinks to ensure natural and diverse link profiles." }
        ]
    },
    {
        title: "Advanced SEO Utilities",
        tools: [
            { name: "URL Redirect Checker", desc: "Detect and analyze 301, 302, and other URL redirects to maintain link equity and user experience." },
            { name: "Google Cache Date Checker", desc: "Monitor when Google last cached your webpages to ensure timely indexing of new content." },
            { name: "Organic Traffic Checker", desc: "Analyze any website's organic traffic volume and discover competitor traffic insights." },
            { name: "Website Technology Checker", desc: "Identify the technology stack behind any website, including CMS, servers, and frameworks." },
            { name: "Email Verification Tool", desc: "Optimize email marketing campaigns by validating email addresses and improving deliverability." },
            { name: "Company Logo API", desc: "Fetch any company's logo programmatically by domain — a simple API for enriching directories, CRMs, and content." }
        ]
    },
    {
        title: "Competitor Analysis Tools",
        tools: [
            { name: "Competitor Keyword Research Tool", desc: "Uncover the keywords your competitors rank for and identify content gaps in your strategy." },
            { name: "Organic Traffic Analysis", desc: "Compare your organic traffic performance against competitors and industry benchmarks." }
        ]
    },
    {
        title: "AI-Powered SEO Assistant",
        tools: [
            { name: "AI SEO Assistant", desc: "Get personalized SEO guidance and task recommendations powered by artificial intelligence and industry expertise." },
            { name: "SEOmator GPT Integration", desc: "Access real-time search volume data, keyword analysis, and SERP insights through advanced AI capabilities." },
            { name: "Google AI Mode Checker", desc: "See how your site appears in Google's AI Mode and monitor your visibility across AI-driven search experiences." }
        ]
    }
];
export interface RuleResult {
  ruleId: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  score: number;
  details?: Record<string, any>;
}

export interface CategoryResult {
  categoryId: string;
  score: number;
  passCount: number;
  warnCount: number;
  failCount: number;
  results: RuleResult[];
}

export interface AuditResult {
  status: string;
  url: string;
  overallScore: number;
  crawledPages: number;
  categoryResults: CategoryResult[];
  ai_recommendation?: string;
  ai_tone?: string;
  timestamp?: string;
}

const POLLING_MESSAGES = [
  'Job queued — waiting for worker...',
  'Crawling website structure...',
  'Analyzing on-page SEO signals...',
  'Running off-page metrics check...',
  'Calculating domain authority...',
  'Generating AI recommendations...',
  'Compiling final report...',
];

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [crawl, setCrawl] = useState(false);
  const [maxPages, setMaxPages] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [pollingMessage, setPollingMessage] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<AuditResult | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messageIndexRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  const focusInput = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, 500);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    stopPolling();
    setIsLoading(true);
    setError('');
    setResult(null);
    setPollingMessage(POLLING_MESSAGES[0]);
    messageIndexRef.current = 0;

    // Normalize URL
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/audit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ url: targetUrl, crawl, max_pages: maxPages }),
      });

      if (!response.ok) {
        if (response.status === 403) throw new Error('Not enough audits remaining. Please upgrade your plan.');
        if (response.status === 401) throw new Error('Unauthorized. Please login again.');
        throw new Error('Failed to start audit. Please ensure the backend is running.');
      }

      const { job_id } = await response.json();

      if (!job_id) {
        throw new Error('Backend did not return a job ID.');
      }

      // Step 2: Poll for status every 3 seconds
      pollingIntervalRef.current = setInterval(async () => {
        // Cycle through informational messages
        messageIndexRef.current = (messageIndexRef.current + 1) % POLLING_MESSAGES.length;
        setPollingMessage(POLLING_MESSAGES[messageIndexRef.current]);

        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
          const statusRes = await fetch(`${apiUrl}/api/audit/status/${job_id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!statusRes.ok) {
            throw new Error('Error fetching job status.');
          }

          const statusData = await statusRes.json();

          if (statusData.status === 'success') {
            stopPolling();
            setResult(statusData as AuditResult);
            setIsLoading(false);
          } else if (statusData.status === 'failed') {
            stopPolling();
            setError(`Audit failed: ${statusData.error || 'Unknown worker error.'}`);
            setIsLoading(false);
          }
          // If status is 'processing' or 'queued', keep polling
        } catch (pollErr: any) {
          stopPolling();
          setError(pollErr.message || 'Lost connection to backend while polling.');
          setIsLoading(false);
        }
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen obsidian-gradient text-on-surface font-sans selection:bg-electric-indigo/30">
      <header className="relative py-12 px-6 flex flex-col items-center justify-center border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-indigo/5 to-transparent pointer-events-none"></div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full text-center space-y-4"
        >
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl drop-shadow-sm">
            Universal SEO Auditor
          </h1>
          <p className="text-lg text-slate-text">
            Instantly analyze any website's technical SEO, discover contact details, and get AI-driven growth recommendations.
          </p>

          <form onSubmit={handleAudit} className="mt-8 flex items-center max-w-2xl mx-auto space-x-2">
            <div className="flex-1 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-text" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="https://example.com"
                  className="pl-10 h-14 text-lg border-white/20 bg-slate-950/50 text-on-surface focus-visible:ring-electric-indigo rounded-xl placeholder:text-slate-text/50 glass-card"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center space-x-4 glass-card p-3 rounded-lg border border-white/10">
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-text cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-white/20 bg-slate-950 text-electric-indigo focus:ring focus:ring-electric-indigo/50 h-4 w-4"
                    checked={crawl}
                    onChange={(e) => setCrawl(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="text-on-surface">Enable deep crawling</span>
                </label>
                
                {crawl && (
                  <div className="flex items-center space-x-2 flex-1 ml-4 border-l border-white/20 pl-4">
                    <span className="text-sm text-slate-text whitespace-nowrap">Max pages: {maxPages}</span>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      className="w-full h-2 bg-slate-950/50 rounded-lg appearance-none cursor-pointer accent-electric-indigo"
                      value={maxPages}
                      onChange={(e) => setMaxPages(parseInt(e.target.value))}
                      disabled={isLoading}
                    />
                  </div>
                )}
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-14 self-start px-8 rounded-xl bg-electric-indigo hover:bg-electric-indigo/90 text-white font-headline-md text-lg transition-colors btn-shimmer-hover"
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Auditing...
                </>
              ) : (
                'Run Audit'
              )}
            </Button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 text-error text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-flare blur-xl opacity-20 rounded-full animate-pulse"></div>
                <Loader2 className="h-16 w-16 animate-spin text-cyan-flare relative z-10" />
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={pollingMessage}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="text-slate-text text-lg"
                >
                  {pollingMessage}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ResultsDashboard data={result} />
            </motion.div>
          )}
          
          {!isLoading && !result && !error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-12 text-slate-text"
            >
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20 text-cyan-flare" />
              <p>Enter a URL above to generate a comprehensive SEO report.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Free Tools Library Section */}
        <div className="mt-16 pt-16 border-t border-white/10">
            <div className="text-center mb-12">
                <h3 className="text-3xl font-display-lg text-white mb-4">SEO Tools Library</h3>
                <p className="text-slate-text max-w-2xl mx-auto">Access our complete suite of SEO utilities. Select any tool below to run a specialized audit using our central engine.</p>
            </div>
            
            <div className="space-y-16">
                {TOOL_CATEGORIES.map((category, idx) => (
                    <div key={idx}>
                        <h4 className="text-xl font-bold text-white border-b border-white/10 pb-3 mb-6">
                            {category.title}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {category.tools.map((tool, i) => (
                                <button 
                                    key={i}
                                    onClick={focusInput}
                                    className="group premium-card bg-slate-950/30 border border-white/5 rounded-xl p-5 hover:bg-white/5 hover:border-electric-indigo/40 transition-all text-left flex flex-col justify-between h-full"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="text-base font-bold text-white group-hover:text-electric-indigo transition-colors">{tool.name}</h5>
                                            <span className="material-symbols-outlined text-electric-indigo opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-sm">arrow_upward</span>
                                        </div>
                                        <p className="text-xs text-slate-text/80 leading-relaxed line-clamp-3">
                                            {tool.desc}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}

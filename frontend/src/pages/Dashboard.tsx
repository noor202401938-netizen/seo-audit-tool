import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Download, RefreshCw, ArrowRight, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { useAuth } from '../contexts/AuthContext';
import { TOOL_CATEGORIES } from '../data/tools';
import { Link } from 'react-router-dom';
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
  const { token, refreshUser } = useAuth();

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const [recentAudits, setRecentAudits] = useState<any[]>([]);
  const [recentTools, setRecentTools] = useState<string[]>([]);

  const fetchRecentAudits = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/audit/recent`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRecentAudits(data);
      }
    } catch (e) {
      console.error('Failed to fetch recent audits', e);
    }
  };

  const fetchRecentTools = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/tools/recent`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRecentTools(data);
      }
    } catch (e) {
      console.error('Failed to fetch recent tools', e);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRecentAudits();
      fetchRecentTools();
    }
  }, [token]);

  const loadRecentAudit = async (id: string) => {
    try {
      setIsLoading(true);
      setError('');
      setResult(null);
      setPollingMessage('Loading previous audit report...');
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/audit/history/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Failed to load past audit');
      const data = await res.json();
      setResult(data as AuditResult);
    } catch (e: any) {
      setError(e.message || 'Error loading audit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (e: React.MouseEvent, targetUrl: string) => {
    e.stopPropagation();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    window.open(`${apiUrl}/api/audit/pdf?url=${encodeURIComponent(targetUrl)}`, '_blank');
  };

  const executeAudit = async (targetUrl: string) => {
    stopPolling();
    setIsLoading(true);
    setError('');
    setResult(null);
    setPollingMessage(POLLING_MESSAGES[0]);
    messageIndexRef.current = 0;

    let normalizedUrl = targetUrl.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/audit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ url: normalizedUrl, crawl, max_pages: maxPages }),
      });

      if (!response.ok) {
        if (response.status === 403) throw new Error('Not enough audits remaining. Please upgrade your plan.');
        if (response.status === 401) throw new Error('Unauthorized. Please login again.');
        throw new Error('Failed to start audit. Please ensure the backend is running.');
      }

      const { job_id } = await response.json();
      refreshUser(); // update audit quota
      
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`${apiUrl}/api/audit/status/${job_id}`);
          const statusData = await statusRes.json();

          if (statusData.status === 'completed') {
            stopPolling();
            setResult(statusData.result);
            setIsLoading(false);
            fetchRecentAudits();
          } else if (statusData.status === 'failed') {
            stopPolling();
            setError(statusData.error || 'Audit failed');
            setIsLoading(false);
          } else {
            messageIndexRef.current = (messageIndexRef.current + 1) % POLLING_MESSAGES.length;
            setPollingMessage(POLLING_MESSAGES[messageIndexRef.current]);
          }
        } catch (e) {
          console.error('Polling error', e);
        }
      }, 2000);
    } catch (err: any) {
      stopPolling();
      setError(err.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleRerun = (e: React.MouseEvent, targetUrl: string) => {
    e.stopPropagation();
    setUrl(targetUrl);
    executeAudit(targetUrl);
  };

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    executeAudit(url);
  };


  return (
    <div className="w-full min-h-full text-on-surface font-sans selection:bg-electric-indigo/30">
      <header className="relative py-12 px-6 flex flex-col items-center justify-center border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-indigo/5 to-transparent pointer-events-none"></div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full text-center space-y-4 relative z-10"
        >
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl drop-shadow-sm">
            Universal SEO Auditor
          </h1>
          <p className="text-lg text-slate-text">
            Instantly analyze any website's technical SEO, discover contact details, and get AI-driven growth recommendations.
          </p>

          <form onSubmit={handleAudit} className="mt-8 flex flex-col items-center justify-center max-w-3xl mx-auto w-full space-y-4">
            <div className="flex w-full flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative group flex-1">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-electric-indigo to-cyan-flare rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-slate-950/80 rounded-xl leading-none shadow-xl border border-white/10">
                  <Search className="absolute left-4 h-5 w-5 text-slate-500" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="https://example.com"
                    className="pl-12 h-14 text-lg border-none bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl placeholder:text-slate-600 w-full"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 w-full sm:w-40 rounded-xl bg-gradient-to-r from-electric-indigo to-cyan-flare hover:brightness-110 text-white font-bold text-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] shrink-0"
                disabled={isLoading || !url.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Auditing
                  </div>
                ) : (
                  "Run Audit"
                )}
              </Button>
            </div>
            
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] shadow-inner">
              <label className="flex items-center space-x-3 text-sm font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-white/20 bg-slate-950 text-electric-indigo focus:ring-0 h-5 w-5 cursor-pointer"
                  checked={crawl}
                  onChange={(e) => setCrawl(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Enable deep crawling</span>
              </label>
              
              {crawl && (
                <div className="flex items-center space-x-4 w-full sm:w-64 mt-4 sm:mt-0 animate-in fade-in slide-in-from-left-4 duration-300">
                  <span className="text-sm font-medium text-electric-indigo whitespace-nowrap min-w-[80px]">Max: {maxPages}</span>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    className="w-full h-2 bg-slate-900/50 rounded-lg appearance-none cursor-pointer accent-electric-indigo"
                    value={maxPages}
                    onChange={(e) => setMaxPages(parseInt(e.target.value))}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
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
              className="text-center py-12 text-slate-text w-full max-w-5xl mx-auto"
            >
              <div className="mb-12">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-20 text-cyan-flare" />
                <p>Enter a URL above to generate a comprehensive SEO report.</p>
              </div>

              {recentAudits.length > 0 && (
                <div className="mt-8 text-left">
                  <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-cyan-flare" />
                    Recent Audits
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentAudits.map((audit) => (
                      <div 
                        key={audit.id} 
                        onClick={() => loadRecentAudit(audit.id)}
                        className="glass-card p-5 rounded-xl cursor-pointer hover:border-electric-indigo/50 transition-all flex flex-col justify-between group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="overflow-hidden flex-1 mr-4">
                            <div className="font-medium text-on-surface truncate group-hover:text-electric-indigo transition-colors" title={audit.url}>{audit.url}</div>
                            <div className="text-sm text-slate-text mt-1">
                              {new Date(audit.createdAt).toLocaleDateString()} at {new Date(audit.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                          <div className="flex-shrink-0 bg-slate-900 rounded-full h-12 w-12 flex items-center justify-center font-bold text-electric-indigo border border-white/10 group-hover:border-electric-indigo/30 transition-colors shadow-inner">
                            {audit.overallScore}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-transparent hover:bg-white/5 text-slate-300 border-white/10 text-xs h-8"
                            onClick={(e) => handleRerun(e, audit.url)}
                          >
                            <RefreshCw className="w-3 h-3 mr-1.5" />
                            Rerun Audit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-transparent hover:bg-white/5 text-slate-300 border-white/10 text-xs h-8"
                            onClick={(e) => handleDownload(e, audit.url)}
                          >
                            <Download className="w-3 h-3 mr-1.5" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recentTools.length > 0 && (
                <div className="mt-16 text-left">
                  <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center">
                    <Search className="w-5 h-5 mr-2 text-cyan-flare" />
                    Recently Used Tools
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {recentTools.map((toolId) => {
                      const category = TOOL_CATEGORIES.find(c => 
                        c.tools.some(t => t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === toolId)
                      );
                      const tool = category?.tools.find(t => 
                        t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === toolId
                      );
                      if (!tool) return null;
                      
                      return (
                        <Link to={`/app/tools/${toolId}`} key={toolId}>
                          <div className="glass-card p-4 rounded-xl cursor-pointer hover:border-cyan-flare/50 transition-all flex flex-col h-full group">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="p-2 bg-slate-900 rounded-lg text-cyan-flare group-hover:scale-110 transition-transform">
                                <Search className="w-5 h-5" />
                              </div>
                              <h3 className="font-medium text-sm text-on-surface line-clamp-1">{tool.name}</h3>
                            </div>
                            <div className="mt-auto flex items-center text-xs text-electric-indigo font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Open Tool <ArrowRight className="w-3 h-3 ml-1" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

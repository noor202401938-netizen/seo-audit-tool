import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Download, RefreshCw, ArrowRight, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { useAuth } from '../contexts/AuthContext';
import { TOOL_CATEGORIES } from '../data/tools';
import { Link } from 'react-router-dom';
import { openAuthedPdf } from '../lib/utils';

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
  record_id?: string;
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
  'Calculating domain health score...',
  'Evaluating 249 audit rules...',
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
    fetchRecentAudits();
    fetchRecentTools();
  }, []);

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

  const handleDownload = (e: React.MouseEvent, recordId: string) => {
    e.stopPropagation();
    openAuthedPdf(recordId);
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
        throw new Error('Failed to start audit. Please ensure the backend is running.');
      }

      const { job_id } = await response.json();
      refreshUser(); 
      
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`${apiUrl}/api/audit/status/${job_id}`);
          const statusData = await statusRes.json();
          const isComplete = statusData.status === 'completed' || statusData.status === 'success' || statusData.overallScore !== undefined || (statusData.result && statusData.result.overallScore !== undefined);
          if (isComplete) {
            stopPolling();
            setResult(statusData.result || statusData);
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
      }, 1000);
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
    <div className="w-full min-h-full text-zinc-100 font-sans selection:bg-zinc-800">
      <header className="relative py-12 px-6 flex flex-col items-center justify-center border-b border-zinc-800/80 bg-zinc-950/60">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl w-full text-center space-y-3 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            249-RULE AUDIT MATRIX
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
            Automated Website & SEO Audit
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Enter a domain to launch technical SEO verification, schema analysis, and public contact extraction.
          </p>

          <form onSubmit={handleAudit} className="mt-6 flex flex-col items-center justify-center max-w-2xl mx-auto w-full space-y-4">
            <div className="flex w-full flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative flex-1">
                <div className="relative flex items-center bg-zinc-900 rounded-lg shadow-inner border border-zinc-800 focus-within:border-zinc-700 transition-all">
                  <Search className="absolute left-4 h-4 w-4 text-zinc-400" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="https://example-domain.com"
                    className="pl-11 h-12 text-sm border-none bg-transparent text-zinc-100 focus-visible:ring-0 rounded-lg placeholder:text-zinc-500 w-full"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 w-full sm:w-36 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm transition-all border border-zinc-200 shrink-0"
                disabled={isLoading || !url.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Auditing</span>
                  </div>
                ) : (
                  "Run Audit"
                )}
              </Button>
            </div>
            
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40 text-xs">
              <label className="flex items-center space-x-2.5 font-medium text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-0 h-4 w-4 cursor-pointer"
                  checked={crawl}
                  onChange={(e) => setCrawl(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Enable multi-page crawl</span>
              </label>
              
              {crawl && (
                <div className="flex items-center space-x-3 w-full sm:w-60 mt-3 sm:mt-0 font-mono">
                  <span className="text-xs font-medium text-zinc-400 whitespace-nowrap min-w-[70px]">Max: {maxPages} pages</span>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
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
                className="mt-3 text-rose-400 text-xs font-mono font-medium p-2.5 rounded bg-rose-950/40 border border-rose-900/60"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-4"
            >
              <div className="w-12 h-12 rounded-full border-2 border-zinc-800 border-t-emerald-500 animate-spin"></div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={pollingMessage}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-zinc-400 font-mono text-sm"
                >
                  {pollingMessage}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ResultsDashboard data={result} />
            </motion.div>
          )}
          
          {!isLoading && !result && !error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-10 text-zinc-400 w-full max-w-4xl mx-auto"
            >
              <div className="mb-10">
                <Search className="h-10 w-10 mx-auto mb-3 text-zinc-600" />
                <p className="text-sm">Enter a target URL above to generate a comprehensive SEO & contact report.</p>
              </div>

              {recentAudits.length > 0 && (
                <div className="mt-8 text-left">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-zinc-400" />
                      Recent Audits
                    </h3>
                    <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-2.5 py-1 rounded-md">
                      📁 PDFs saved to: <code className="text-zinc-300">data/output/</code>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentAudits.map((audit) => (
                      <div 
                        key={audit.id} 
                        onClick={() => loadRecentAudit(audit.id)}
                        className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg cursor-pointer hover:border-zinc-700 transition-all flex flex-col justify-between group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="overflow-hidden flex-1 mr-3">
                            <div className="font-medium text-xs text-zinc-200 truncate group-hover:text-zinc-100 transition-colors" title={audit.url}>{audit.url}</div>
                            <div className="text-[11px] font-mono text-zinc-500 mt-1">
                              {new Date(audit.createdAt).toLocaleDateString()} at {new Date(audit.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                          <div className="flex-shrink-0 bg-zinc-950 rounded-md h-9 w-9 flex items-center justify-center font-mono font-bold text-xs text-emerald-400 border border-zinc-800">
                            {audit.overallScore}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 pt-3 border-t border-zinc-800/60 opacity-80 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border-zinc-800 text-[11px] h-7 px-2.5"
                            onClick={(e) => handleRerun(e, audit.url)}
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Rerun
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border-zinc-800 text-[11px] h-7 px-2.5"
                            onClick={(e) => handleDownload(e, audit.id)}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recentTools.length > 0 && (
                <div className="mt-12 text-left">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 mb-4 flex items-center">
                    <Search className="w-4 h-4 mr-2 text-zinc-400" />
                    Recently Used Tools
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
                          <div className="bg-zinc-900/40 border border-zinc-800 p-3.5 rounded-lg cursor-pointer hover:border-zinc-700 transition-all flex flex-col h-full group">
                            <div className="flex items-center space-x-2.5 mb-2">
                              <div className="p-1.5 bg-zinc-950 rounded text-zinc-300 border border-zinc-800">
                                <Search className="w-3.5 h-3.5" />
                              </div>
                              <h3 className="font-medium text-xs text-zinc-200 line-clamp-1">{tool.name}</h3>
                            </div>
                            <div className="mt-auto flex items-center text-[11px] text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
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

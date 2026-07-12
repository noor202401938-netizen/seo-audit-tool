import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { useAuth } from '../contexts/AuthContext';

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
  const { token } = useAuth();

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
              className="text-center py-24 text-slate-text"
            >
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20 text-cyan-flare" />
              <p>Enter a URL above to generate a comprehensive SEO report.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

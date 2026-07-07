import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Terminal, ShieldAlert, ShieldCheck, Activity, Target, Zap, Download, ExternalLink, RefreshCw } from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setReport(null);
    try {
      const response = await fetch('http://localhost:8000/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, target_keywords: keywords })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Audit failed');
      
      setReport({
        url: data.url,
        onpage_score: data.onpage_score,
        offpage_score: data.offpage_score,
        offpage_data: data.offpage_data,
        issues: data.issues,
        pages_crawled: data.metadata?.pages_crawled || 0
      });
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setReport({
        url: url,
        onpage_score: 0,
        offpage_score: 0,
        offpage_data: null,
        pages_crawled: 0,
        issues: [{ category: 'System', severity: 'Error', issue: err.message || 'Connection failed', fixes: 'Ensure backend server is running.' }]
      });
      setLoading(false);
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'error': return 'border-l-accent bg-accent/5';
      case 'warning': return 'border-l-yellow-500 bg-yellow-500/5';
      default: return 'border-l-primary bg-primary/5';
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge variant="outline" className="rounded-none border-primary text-primary uppercase">OPTIMAL</Badge>;
    if (score >= 50) return <Badge variant="outline" className="rounded-none border-yellow-500 text-yellow-500 uppercase">SUB-OPTIMAL</Badge>;
    return <Badge variant="outline" className="rounded-none border-accent text-accent uppercase">CRITICAL</Badge>;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-4 sm:p-8 relative overflow-hidden">
      {/* CRT Scanline overlay effect */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] z-50 mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }}></div>
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER SECTION */}
        <header className="border-b-2 border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-accent text-xs tracking-widest mb-2 flex items-center gap-2">
              <Terminal size={14} /> SYS.DIAGNOSTIC.SEO // REV 3.0
            </div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-primary leading-none">
              SEO Telemetry
            </h1>
          </div>
          <div className="text-xs text-muted-foreground uppercase text-right">
            <div>STATUS: <span className="text-primary">ONLINE</span></div>
            <div>UPLINK: <span className="text-primary">SECURE</span></div>
          </div>
        </header>

        {/* INPUT SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-border p-[1px]">
          <div className="col-span-1 md:col-span-2 bg-background p-6">
            <h2 className="text-xl font-bold uppercase mb-4 tracking-tight flex items-center gap-2">
              <Target size={18} /> Target Assignment
            </h2>
            <form onSubmit={handleAudit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-[10px] text-muted-foreground uppercase mb-1 block">Target URL</label>
                  <Input 
                    type="url" 
                    placeholder="https://example.com" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="font-mono bg-secondary/50 border-border h-12 rounded-none focus-visible:ring-accent uppercase placeholder:text-muted-foreground/50"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-muted-foreground uppercase mb-1 block">Target Keywords (Comma Separated)</label>
                  <Input 
                    type="text" 
                    placeholder="seo tool, crawler, test" 
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="font-mono bg-secondary/50 border-border h-12 rounded-none focus-visible:ring-accent placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full rounded-none h-12 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-none uppercase font-bold text-center">
                {loading ? 'Scanning...' : 'Execute Audit'}
              </Button>
            </form>
          </div>
          <div className="col-span-1 bg-background p-6 flex flex-col justify-center">
             <div className="text-xs text-muted-foreground mb-2">[ EXECUTION LOG ]</div>
             <div className="text-sm">
                {loading ? (
                  <span className="text-accent animate-pulse">
                    Establishing connection...<br/>
                    Crawling priority routes...<br/>
                    Analyzing DOM elements...<br/>
                    Evaluating On-Page factors...<br/>
                    Gathering Off-Page backlinks...
                  </span>
                ) : report ? (
                  <span className="text-primary">
                    Scan complete.<br/>
                    On-Page Score: {report.onpage_score}<br/>
                    Off-Page Score: {report.offpage_score}<br/>
                    Awaiting further commands.
                  </span>
                ) : (
                  <span>Awaiting target input.</span>
                )}
             </div>
          </div>
        </section>

        {/* RESULTS SECTION */}
        {report && (
          <div className="space-y-6">
            {/* SCORE OVERVIEW CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* ON-PAGE SECTION */}
              <div className="bg-background border border-border p-6 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase mb-1">[ MODULE: ON-PAGE SEO ]</div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold uppercase">On-Page Health</h3>
                    {getScoreBadge(report.onpage_score)}
                  </div>
                  <div className="flex items-center gap-6 mb-4">
                    <div className="text-5xl font-black text-primary">{report.onpage_score}<span className="text-xs text-muted-foreground">/100</span></div>
                    <div className="text-xs text-muted-foreground uppercase">
                      Pages Analyzed: {report.pages_crawled}<br/>
                      Word Heuristics: Nominal
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground bg-secondary/20 p-3 mt-4 border border-border">
                  Evaluates heading structure, titles, meta tags, readability, keyword placement, and canonical definitions.
                </div>
              </div>

              {/* OFF-PAGE SECTION */}
              <div className="bg-background border border-border p-6 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase mb-1">[ MODULE: OFF-PAGE SEO ]</div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold uppercase">Off-Page Authority</h3>
                    {getScoreBadge(report.offpage_score)}
                  </div>
                  {report.offpage_data ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground uppercase">Domain Authority</div>
                        <div className="text-2xl font-black text-primary">{report.offpage_data.domain_authority}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase">Page Authority</div>
                        <div className="text-2xl font-black text-primary">{report.offpage_data.page_authority}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase">Backlinks Count</div>
                        <div className="text-2xl font-black text-primary">{report.offpage_data.total_backlinks.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase">Spam Score</div>
                        <div className="text-2xl font-black text-accent">{report.offpage_data.spam_score}%</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-yellow-500 uppercase">Backlink lookup not available.</div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground bg-secondary/20 p-3 mt-4 border border-border flex justify-between items-center">
                  <span>Refreshed weekly. Cache TTL 7 Days.</span>
                  {report.url && (
                    <a 
                      href={`http://localhost:8000/api/audit/pdf?url=${encodeURIComponent(report.url)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-accent flex items-center gap-1 font-bold uppercase tracking-wider text-[10px]"
                    >
                      <Download size={12} /> PDF Report
                    </a>
                  )}
                </div>
              </div>

            </div>

            {/* DETAILED RECOMMENDATIONS TABLE */}
            <div className="grid grid-cols-1 gap-1 bg-border p-[1px]">
              <div className="bg-background flex flex-col">
                <div className="p-6 border-b border-border flex justify-between items-center">
                  <h3 className="text-lg font-bold uppercase flex items-center gap-2"><Activity size={18}/> Prioritized Action Recommendations</h3>
                  <span className="text-xs text-muted-foreground">TOTAL ISSUES: {report.issues.length}</span>
                </div>
                <div className="p-6 space-y-4">
                  {report.issues.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground uppercase">
                      No issues detected. Site score is optimal.
                    </div>
                  ) : (
                    report.issues.map((issue: any, i: number) => (
                      <Alert key={i} className={`rounded-none border-l-4 ${getSeverityColor(issue.severity)} border-t-0 border-r-0 border-b-0`}>
                        <div className="flex items-start gap-3">
                          {issue.severity.toLowerCase() === 'error' ? <ShieldAlert className="h-5 w-5 text-accent" /> : <ShieldCheck className="h-5 w-5 text-primary" />}
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <AlertTitle className="uppercase text-xs font-bold tracking-wider">
                                {issue.category} // {issue.severity}
                              </AlertTitle>
                              {issue.page_url && (
                                <span className="text-[10px] text-muted-foreground truncate max-w-md">
                                  PAGE: {issue.page_url}
                                </span>
                              )}
                            </div>
                            <AlertDescription className="text-sm space-y-2">
                              <div><strong>Issue:</strong> {issue.issue}</div>
                              {issue.fixes && (
                                <div className="text-xs text-muted-foreground border-t border-border/30 pt-2 mt-2">
                                  <strong>Resolution:</strong> {issue.fixes}
                                </div>
                              )}
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

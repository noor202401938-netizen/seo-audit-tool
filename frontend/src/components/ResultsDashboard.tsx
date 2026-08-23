import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle2, Info, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { AuditResult } from '../pages/Dashboard';
import { openAuthedPdf } from '../lib/utils';

export function ResultsDashboard({ data }: { data: AuditResult }) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'problems'>('overview');

  const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    'core-seo': 'Essential checks for meta tags, titles, headings, and indexing directives.',
    'performance': 'Measures page load speed and Core Web Vitals.',
    'links': 'Analyzes internal and external links, broken links, and link quality.',
    'images': 'Checks image sizes, alt text, formats, and optimization.',
    'security': 'Validates HTTPS, SSL, and basic security headers.',
    'technical-seo': 'Validates robots.txt, sitemaps, status codes, and server configurations.',
    'crawlability': 'Checks how easily search engines can discover and index your pages.',
    'structured-data': 'Validates Schema.org JSON-LD markup for rich search results.',
    'content': 'Analyzes text length, readability, headings, and duplicate content.',
    'javascript-rendering': 'Checks if content is accessible without JavaScript.',
    'accessibility': 'Ensures the site is usable for people with disabilities.',
    'social': 'Validates Open Graph tags and Twitter Cards for social sharing.',
    'e-e-a-t': 'Checks signals of Experience, Expertise, Authoritativeness, and Trustworthiness.',
    'url-structure': 'Validates that URLs are clean, readable, and keyword-friendly.',
    'redirects': 'Analyzes redirect chains, loops, and status codes.',
    'mobile': 'Ensures the site is responsive and optimized for mobile devices.',
    'internationalization': 'Checks language tags and hreflang for multi-language sites.',
    'html-validation': 'Checks for basic HTML markup errors and structure.',
    'aigeo-readiness': 'Checks if content is easily readable by AI search engines.',
    'legal-compliance': 'Basic checks for privacy policies and cookie consent banners.'
  };

  const formatRuleId = (ruleId: string) => {
    const parts = ruleId.split('-');
    if (parts.length > 1) {
      parts.shift();
    }
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  };

  const handleFeedback = async (reward: number) => {
    if (!data.ai_tone || feedbackGiven) return;
    try {
      setFeedbackGiven(true);
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ tone: data.ai_tone, reward })
      });
    } catch (e) {
      console.error("Failed to submit feedback");
      setFeedbackGiven(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fail': return <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />;
      case 'warn': return <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />;
      case 'pass': return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
      default: return <Info className="h-4 w-4 text-cyan-400 shrink-0" />;
    }
  };

  const allIssues = data.categoryResults.flatMap(cat => 
    cat.results
      .filter(r => r.status !== 'pass')
      .map(r => ({ ...r, categoryId: cat.categoryId }))
  ).sort((a, b) => {
    if (a.status === 'fail' && b.status !== 'fail') return -1;
    if (a.status !== 'fail' && b.status === 'fail') return 1;
    return 0;
  });

  return (
    <div className="space-y-8 pb-12 bg-[#09090b] text-white">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white">
            Audit Results: <span className="text-emerald-400 font-mono">{new URL(data.url).hostname}</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Crawled {data.crawledPages || 1} pages with 249-rule diagnostic matrix.</p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1">
          <Button
            onClick={() => data.record_id && openAuthedPdf(data.record_id)}
            disabled={!data.record_id}
            className="bg-white hover:bg-zinc-100 text-black font-bold text-xs px-5 py-2.5 rounded-lg border border-white shadow-md"
          >
            Download PDF Report
          </Button>
          {data.record_id && (
            <span className="text-[10px] font-mono text-zinc-400">
              📁 Saved to: <code className="text-zinc-300">data/output/{data.record_id}.pdf</code>
            </span>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 w-fit">
        <Button
          variant="ghost"
          onClick={() => setActiveTab('overview')}
          className={`rounded-lg text-xs font-bold transition-all px-6 h-9 ${
            activeTab === 'overview' 
              ? 'bg-zinc-100 text-black shadow-md' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          Overview
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab('recommendations')}
          className={`rounded-lg text-xs font-bold transition-all px-6 h-9 ${
            activeTab === 'recommendations' 
              ? 'bg-zinc-100 text-black shadow-md' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          AI Recommendations
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab('problems')}
          className={`rounded-lg text-xs font-bold transition-all px-6 h-9 ${
            activeTab === 'problems' 
              ? 'bg-zinc-100 text-black shadow-md' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          Problems ({allIssues.length})
        </Button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Hero Score Card */}
          <Card className="bg-zinc-900 border border-zinc-700 shadow-xl rounded-xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-4 border-zinc-800 bg-zinc-950">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-zinc-800"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={getScoreColor(data.overallScore)}
                        strokeWidth="3"
                        strokeDasharray={`${data.overallScore}, 100`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="text-center z-10 font-mono">
                      <span className="text-3xl font-extrabold text-white">{data.overallScore}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold tracking-tight text-white">Grade {getGrade(data.overallScore)}</h3>
                    <p className="text-xs text-zinc-400 font-mono">Overall Technical SEO Health</p>
                  </div>
                </div>
                
                <div className="flex gap-4 text-center">
                  <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 min-w-[90px]">
                    <div className="text-2xl font-bold font-mono text-emerald-400">
                      {data.categoryResults.reduce((acc, cat) => acc + cat.passCount, 0)}
                    </div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">Passed</div>
                  </div>
                  <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 min-w-[90px]">
                    <div className="text-2xl font-bold font-mono text-amber-400">
                      {data.categoryResults.reduce((acc, cat) => acc + cat.warnCount, 0)}
                    </div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">Warnings</div>
                  </div>
                  <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 min-w-[90px]">
                    <div className="text-2xl font-bold font-mono text-rose-400">
                      {data.categoryResults.reduce((acc, cat) => acc + cat.failCount, 0)}
                    </div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">Failed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Grid */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.categoryResults.map(cat => (
                <Card key={cat.categoryId} className="bg-zinc-900 border-zinc-700 hover:border-zinc-500 transition-colors cursor-pointer rounded-xl shadow-md" onClick={() => setExpandedCategory(cat.categoryId === expandedCategory ? null : cat.categoryId)}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold capitalize truncate pr-2 text-xs text-white" title={cat.categoryId}>{cat.categoryId.replace('-', ' ')}</h4>
                      <span className={`font-mono text-xs font-bold ${getScoreColor(cat.score)}`}>{cat.score}</span>
                    </div>
                    <Progress value={cat.score} className="h-1.5 bg-zinc-950" indicatorClassName={getScoreBg(cat.score)} />
                    <div className="flex justify-between text-[11px] font-mono font-medium">
                      <span className="text-emerald-400">{cat.passCount} pass</span>
                      <span className="text-amber-400">{cat.warnCount} warn</span>
                      <span className="text-rose-400">{cat.failCount} fail</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 pt-1 border-t border-zinc-800 font-normal">
                      {CATEGORY_DESCRIPTIONS[cat.categoryId] || 'Diagnostic rules for this metric.'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <Card className="bg-zinc-900 border-zinc-700 p-6 md:p-8 rounded-xl shadow-xl space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-xl font-bold text-white">AI Remediation Plan</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Automated priority fixes generated for this domain audit.</p>
          </div>
          <div className="prose prose-invert max-w-none text-xs leading-relaxed text-zinc-300">
            <ReactMarkdown>{data.ai_recommendation || "No specific AI recommendations generated for this crawl."}</ReactMarkdown>
          </div>
          
          {data.ai_tone && (
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Was this AI analysis helpful?</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleFeedback(1)} disabled={feedbackGiven} className="border-zinc-700 bg-zinc-950 text-emerald-400 hover:bg-emerald-950">
                  <ThumbsUp className="h-3.5 w-3.5 mr-1" /> Yes
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleFeedback(-1)} disabled={feedbackGiven} className="border-zinc-700 bg-zinc-950 text-rose-400 hover:bg-rose-950">
                  <ThumbsDown className="h-3.5 w-3.5 mr-1" /> No
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'problems' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Issues Requiring Attention ({allIssues.length})</h3>
          <div className="space-y-3">
            {allIssues.map((issue, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-700 p-4 rounded-xl flex items-start gap-3.5 shadow-md">
                {getStatusIcon(issue.status)}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{formatRuleId(issue.ruleId)}</span>
                    <span className="text-[10px] font-mono uppercase bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 text-zinc-400">
                      {issue.categoryId}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-normal">{issue.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

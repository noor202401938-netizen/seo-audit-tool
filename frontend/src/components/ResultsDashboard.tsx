import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle2, Info, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { AuditResult } from '../pages/Dashboard';

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
    // Remove the category prefix (e.g., 'core-title-present' -> 'title-present')
    // We do this by splitting by dash and removing the first part if it has 2+ parts
    const parts = ruleId.split('-');
    if (parts.length > 1) {
      parts.shift();
    }
    // Capitalize and join
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
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
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
      case 'fail': return <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />;
      case 'warn': return <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />;
      case 'pass': return <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />;
      default: return <Info className="h-5 w-5 text-blue-500 shrink-0" />;
    }
  };

  // Aggregate issues
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
    <div className="space-y-8 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Audit Results for <span className="text-electric-indigo">{new URL(data.url).hostname}</span></h2>
          <p className="text-slate-text">Crawled {data.crawledPages || 1} pages.</p>
        </div>
        <Button 
          onClick={() => {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            window.open(`${apiUrl}/api/audit/pdf?url=${encodeURIComponent(data.url)}`, '_blank');
          }}
          className="bg-electric-indigo hover:bg-electric-indigo/90 text-white"
        >
          Download PDF
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 mt-8 mb-6 p-2 rounded-2xl bg-slate-950/60 border border-white/10 shadow-inner w-fit mx-auto md:mx-0">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('overview')}
          size="lg"
          className={`rounded-xl text-base font-bold transition-all ${
            activeTab === 'overview' 
              ? 'bg-gradient-to-r from-electric-indigo to-cyan-flare text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:brightness-110 px-8' 
              : 'text-slate-text hover:text-white hover:bg-white/10 px-6'
          }`}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'recommendations' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('recommendations')}
          size="lg"
          className={`rounded-xl text-base font-bold transition-all ${
            activeTab === 'recommendations' 
              ? 'bg-gradient-to-r from-electric-indigo to-cyan-flare text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:brightness-110 px-8' 
              : 'text-slate-text hover:text-white hover:bg-white/10 px-6'
          }`}
        >
          AI Recommendations
        </Button>
        <Button
          variant={activeTab === 'problems' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('problems')}
          size="lg"
          className={`rounded-xl text-base font-bold transition-all ${
            activeTab === 'problems' 
              ? 'bg-gradient-to-r from-electric-indigo to-cyan-flare text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:brightness-110 px-8' 
              : 'text-slate-text hover:text-white hover:bg-white/10 px-6'
          }`}
        >
          Problems ({allIssues.length})
        </Button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 mt-6">
      {/* Hero Score */}
      <Card className="premium-card bg-slate-950/30 text-on-surface border border-white/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-electric-indigo/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        <CardContent className="pt-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-8 border-white/10 bg-slate-950/50">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/10"
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
                <div className="text-center z-10">
                  <span className="text-4xl font-black text-on-surface">{data.overallScore}</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold tracking-tight text-on-surface">Grade {getGrade(data.overallScore)}</h3>
                <p className="text-slate-text font-medium">Overall SEO Health</p>
              </div>
            </div>
            
            <div className="flex gap-6 text-center">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 glass-card">
                <div className="text-3xl font-bold text-green-400">
                  {data.categoryResults.reduce((acc, cat) => acc + cat.passCount, 0)}
                </div>
                <div className="text-sm font-bold text-slate-text uppercase tracking-wider mt-1">Passed</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 glass-card">
                <div className="text-3xl font-bold text-yellow-400">
                  {data.categoryResults.reduce((acc, cat) => acc + cat.warnCount, 0)}
                </div>
                <div className="text-sm font-bold text-slate-text uppercase tracking-wider mt-1">Warnings</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 glass-card">
                <div className="text-3xl font-bold text-error">
                  {data.categoryResults.reduce((acc, cat) => acc + cat.failCount, 0)}
                </div>
                <div className="text-sm font-bold text-slate-text uppercase tracking-wider mt-1">Failed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Grid */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-on-surface">Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.categoryResults.map(cat => (
            <Card key={cat.categoryId} className="premium-card bg-slate-950/30 border-white/10 hover:border-cyan-flare/40 transition-colors cursor-pointer" onClick={() => setExpandedCategory(cat.categoryId === expandedCategory ? null : cat.categoryId)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold capitalize truncate pr-2 text-on-surface" title={cat.categoryId}>{cat.categoryId.replace('-', ' ')}</h4>
                  <span className={`font-bold ${getScoreColor(cat.score)}`}>{cat.score}</span>
                </div>
                <Progress value={cat.score} className="h-1.5 mb-3 bg-white/10" indicatorClassName={getScoreBg(cat.score)} />
                <div className="flex justify-between text-xs font-medium mb-3">
                  <span className="text-green-400">{cat.passCount} pass</span>
                  <span className="text-yellow-400">{cat.warnCount} warn</span>
                  <span className="text-error">{cat.failCount} fail</span>
                </div>
                <p className="text-xs text-slate-text/70 line-clamp-2" title={CATEGORY_DESCRIPTIONS[cat.categoryId]}>
                  {CATEGORY_DESCRIPTIONS[cat.categoryId] || 'Checks and validations for this SEO category.'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Expanded Category Details */}
      {expandedCategory && (
        <Card className="premium-card bg-slate-950/50 border-cyan-flare/20 shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-flare/5 to-transparent pointer-events-none" />
          <CardHeader className="border-b border-white/10 flex flex-row items-center justify-between relative z-10 glass-card">
            <div>
              <CardTitle className="capitalize text-on-surface font-black tracking-tight">{expandedCategory.replace('-', ' ')} Breakdown</CardTitle>
              <CardDescription className="text-slate-text">
                {CATEGORY_DESCRIPTIONS[expandedCategory] || 'Detailed rule results for this category'}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-on-surface hover:bg-white/20" onClick={() => setExpandedCategory(null)}>Close</Button>
          </CardHeader>
          <CardContent className="pt-6 relative z-10">
            <div className="space-y-4">
              {data.categoryResults.find(c => c.categoryId === expandedCategory)?.results.map((rule, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/10">
                  <div className="mt-0.5">{getStatusIcon(rule.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-on-surface">{formatRuleId(rule.ruleId)}</span>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-white/20 text-slate-text">{rule.status}</Badge>
                      <span className="text-sm font-bold text-slate-text ml-auto bg-white/10 px-2 py-0.5 rounded-md">{rule.score}/100</span>
                    </div>
                    <p className="text-sm text-on-surface/80 font-medium">{rule.message}</p>
                    {rule.details && rule.details.pageUrl && (
                      <p className="text-xs text-slate-text mt-2 truncate max-w-2xl font-mono bg-white/5 inline-block px-2 py-1 rounded border border-white/10" title={rule.details.pageUrl}>
                        {rule.details.pageUrl}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="mt-6">
      {/* AI Recommendations */}
      {data.ai_recommendation && (
        <Card className="premium-card bg-slate-950/30 border-vibrant-violet/30 shadow-sm mt-8">
          <CardHeader className="bg-vibrant-violet/10 border-b border-vibrant-violet/20">
            <CardTitle className="text-vibrant-violet flex items-center">
              AI-Driven Growth Recommendations
            </CardTitle>
            <CardDescription className="text-slate-text">Customized strategy based on your site's data.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-invert max-w-none prose-p:text-on-surface/80 prose-headings:text-on-surface prose-strong:text-vibrant-violet prose-a:text-electric-indigo">
              <ReactMarkdown>{data.ai_recommendation}</ReactMarkdown>
            </div>
            
            {data.ai_tone && data.ai_tone !== 'Offline' && data.ai_tone !== 'Error' && (
              <div className="mt-6 pt-4 border-t border-vibrant-violet/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-text">
                  Was this generated strategy helpful? (Tone used: <span className="text-vibrant-violet font-semibold">{data.ai_tone}</span>)
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`border-vibrant-violet/30 hover:bg-vibrant-violet/20 text-on-surface ${feedbackGiven ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleFeedback(1)}
                    disabled={feedbackGiven}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2 text-green-400" /> Helpful
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`border-vibrant-violet/30 hover:bg-vibrant-violet/20 text-on-surface ${feedbackGiven ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleFeedback(0)}
                    disabled={feedbackGiven}
                  >
                    <ThumbsDown className="h-4 w-4 mr-2 text-red-400" /> Not Helpful
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
        </div>
      )}

      {activeTab === 'problems' && (
        <div className="mt-6">
      {/* Issues List */}
      <Card className="premium-card bg-slate-950/30 border-white/20">
        <CardHeader>
          <CardTitle className="text-on-surface">Actionable Issues ({allIssues.length})</CardTitle>
          <CardDescription className="text-slate-text">Rules that produced warnings or failures across all categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {allIssues.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3 opacity-50" />
                <p className="text-slate-text font-medium">No issues found. Your site is fully optimized!</p>
              </div>
            ) : (
              allIssues.map((issue, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/5">
                  <div className="mt-1">
                    {getStatusIcon(issue.status)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-on-surface">{formatRuleId(issue.ruleId)}</h4>
                      <Badge variant="outline" className="uppercase text-[10px] tracking-wider border-white/20 text-slate-text">
                        {issue.categoryId.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-on-surface/80 font-medium">
                      {issue.message}
                    </p>
                    {issue.details && issue.details.pageUrl && (
                      <p className="text-xs text-slate-text">
                        Affected URL: <a href={issue.details.pageUrl} target="_blank" rel="noreferrer" className="text-cyan-flare hover:underline">{issue.details.pageUrl}</a>
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
        </div>
      )}
    </div>
  );
}

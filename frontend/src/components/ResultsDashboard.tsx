import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { AuditResult } from '../App';

export function ResultsDashboard({ data }: { data: AuditResult }) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

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
          <h2 className="text-2xl font-bold">Audit Results for <span className="text-indigo-600">{new URL(data.url).hostname}</span></h2>
          <p className="text-slate-500">Crawled {data.crawledPages || 1} pages.</p>
        </div>
      </div>

      {/* Hero Score */}
      <Card className="bg-slate-900 text-white border-none shadow-xl">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-8 border-slate-800 bg-slate-900">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
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
                  <span className="text-4xl font-black">{data.overallScore}</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold tracking-tight">Grade {getGrade(data.overallScore)}</h3>
                <p className="text-slate-400 font-medium">Overall SEO Health</p>
              </div>
            </div>
            
            <div className="flex gap-6 text-center">
              <div className="bg-slate-800/50 p-4 rounded-xl">
                <div className="text-3xl font-bold text-green-400">
                  {data.categoryResults.reduce((acc, cat) => acc + cat.passCount, 0)}
                </div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mt-1">Passed</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl">
                <div className="text-3xl font-bold text-yellow-400">
                  {data.categoryResults.reduce((acc, cat) => acc + cat.warnCount, 0)}
                </div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mt-1">Warnings</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl">
                <div className="text-3xl font-bold text-red-400">
                  {data.categoryResults.reduce((acc, cat) => acc + cat.failCount, 0)}
                </div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mt-1">Failed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Grid */}
      <div>
        <h3 className="text-xl font-bold mb-4">Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.categoryResults.map(cat => (
            <Card key={cat.categoryId} className="hover:border-indigo-200 transition-colors cursor-pointer" onClick={() => setExpandedCategory(cat.categoryId === expandedCategory ? null : cat.categoryId)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold capitalize truncate pr-2" title={cat.categoryId}>{cat.categoryId.replace('-', ' ')}</h4>
                  <span className={`font-bold ${getScoreColor(cat.score)}`}>{cat.score}</span>
                </div>
                <Progress value={cat.score} className="h-1.5 mb-3" indicatorClassName={getScoreBg(cat.score)} />
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-green-600">{cat.passCount} pass</span>
                  <span className="text-yellow-600">{cat.warnCount} warn</span>
                  <span className="text-red-600">{cat.failCount} fail</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Expanded Category Details */}
      {expandedCategory && (
        <Card className="border-indigo-200 shadow-md">
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="capitalize text-indigo-900">{expandedCategory.replace('-', ' ')} Breakdown</CardTitle>
              <CardDescription>Detailed rule results for this category</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setExpandedCategory(null)}>Close</Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {data.categoryResults.find(c => c.categoryId === expandedCategory)?.results.map((rule, idx) => (
                <div key={idx} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="mt-0.5">{getStatusIcon(rule.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">{rule.ruleId}</span>
                      <Badge variant="outline" className="text-[10px] uppercase">{rule.status}</Badge>
                      <span className="text-sm font-medium text-slate-500 ml-auto">{rule.score}/100</span>
                    </div>
                    <p className="text-sm text-slate-600">{rule.message}</p>
                    {rule.details && rule.details.pageUrl && (
                      <p className="text-xs text-slate-400 mt-1 truncate max-w-2xl" title={rule.details.pageUrl}>URL: {rule.details.pageUrl}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle>Actionable Issues ({allIssues.length})</CardTitle>
          <CardDescription>Rules that produced warnings or failures across all categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {allIssues.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3 opacity-50" />
                <p className="text-slate-500 font-medium">No issues found. Your site is fully optimized!</p>
              </div>
            ) : (
              allIssues.map((issue, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1">
                    {getStatusIcon(issue.status)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900">{issue.ruleId}</h4>
                      <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                        {issue.categoryId}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700 font-medium">
                      {issue.message}
                    </p>
                    {issue.details && issue.details.pageUrl && (
                      <p className="text-xs text-slate-500">
                        Affected URL: <a href={issue.details.pageUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{issue.details.pageUrl}</a>
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
  );
}

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LiveExtractionFeed } from '../components/LiveExtractionFeed';
import { ThreeGraph } from '../components/ThreeGraph';
import { TOOL_CATEGORIES } from '../data/tools';

export default function LandingPage() {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.05,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
        
        return () => {
            revealObserver.disconnect();
        };
    }, []);

    return (
        <main className="relative bg-zinc-950 text-white min-h-screen">
            {/* Section 1: Hero */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 bg-zinc-950 text-white">
                <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"></div>
                <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6 reveal">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono font-semibold text-zinc-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            FREE & OPEN SOURCE • MIT LICENSED
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                            Open-Source Technical SEO & AI Search Suite
                        </h1>
                        
                        <p className="text-base md:text-lg text-zinc-300 max-w-xl leading-relaxed font-normal">
                            Self-host comprehensive on-page audits, Core Web Vitals checks, multi-page crawling, SERP position tracking, and AI remediation. Zero subscriptions.
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Link to="/app" className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 text-black px-6 py-3.5 rounded-lg font-bold text-sm transition-all border border-white shadow-xl">
                                <span>Launch Dashboard</span>
                                <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </Link>
                            <Link to="/features" className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3.5 rounded-lg font-semibold text-sm transition-all border border-zinc-700">
                                <span>Explore 20+ Free Tools</span>
                            </Link>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-zinc-800 text-xs text-zinc-300">
                            <div className="flex items-center gap-1.5 font-medium">
                                <span className="material-symbols-outlined text-emerald-400 text-sm">lock_open</span>
                                <span>100% Free & Self-Hosted</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-medium">
                                <span className="material-symbols-outlined text-cyan-400 text-sm">key</span>
                                <span>Bring Your Own API Keys</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-medium">
                                <span className="material-symbols-outlined text-zinc-400 text-sm">terminal</span>
                                <span>1-Command Docker Setup</span>
                            </div>
                        </div>
                    </div>

                    {/* Terminal Live Feed Preview */}
                    <div className="lg:col-span-5 reveal" style={{ animationDelay: '0.15s' }}>
                        <div className="bg-zinc-900 rounded-xl overflow-hidden border-2 border-zinc-700 shadow-2xl relative">
                            <div className="h-9 bg-zinc-950 flex items-center justify-between px-4 border-b border-zinc-800 text-xs font-mono text-zinc-300">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                    <span className="ml-2 text-[11px] text-zinc-300 font-semibold">seo-audit-engine.log</span>
                                </div>
                                <span className="text-[10px] text-emerald-400 bg-emerald-950 font-bold px-2 py-0.5 rounded border border-emerald-700">OPEN SOURCE</span>
                            </div>
                            <div className="h-[320px] relative bg-[#09090b]">
                                <LiveExtractionFeed />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Core Feature Bento Grid */}
            <section className="bg-zinc-100 text-zinc-950 border-y border-zinc-300 py-24 relative">
                <div className="absolute inset-0 bg-grid-pattern-light opacity-50 pointer-events-none"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="mb-14 reveal">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">Architecture & Features</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-950 mt-1 tracking-tight">Built for Depth, Speed, and Extensibility</h2>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-6">
                        {/* Feature 1: Deep Crawl 3D Network */}
                        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl p-8 border border-zinc-300 relative overflow-hidden group min-h-[420px] reveal flex flex-col justify-between shadow-md">
                            <div className="relative z-20 pointer-events-none max-w-md">
                                <span className="material-symbols-outlined text-emerald-600 mb-3 text-3xl">hub</span>
                                <h3 className="text-xl font-bold text-zinc-950 mb-2">Deep Crawling Engine & Headless Rendering</h3>
                                <p className="text-sm text-zinc-700 leading-relaxed font-normal">
                                    Simulates search engine spiders, executing client-side JavaScript via headless Playwright instances to uncover hidden rendering and indexing bottlenecks.
                                </p>
                            </div>
                            <div className="flex gap-2 relative z-20 pt-6 font-mono text-xs">
                                <span className="px-3 py-1 rounded bg-zinc-100 border border-zinc-300 text-zinc-800 font-bold">Playwright Chromium</span>
                                <span className="px-3 py-1 rounded bg-zinc-100 border border-zinc-300 text-zinc-800 font-bold">Robots.txt Adherence</span>
                            </div>
                            <ThreeGraph />
                        </div>

                        {/* Feature 2: 249-Rule Audit Matrix */}
                        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl p-8 border border-zinc-300 reveal flex flex-col justify-between shadow-md" style={{ animationDelay: '0.1s' }}>
                            <div>
                                <span className="material-symbols-outlined text-cyan-600 mb-3 text-3xl">fact_check</span>
                                <h3 className="text-xl font-bold text-zinc-950 mb-2">249-Rule Diagnostic Matrix</h3>
                                <p className="text-sm text-zinc-700 leading-relaxed font-normal">
                                    Validates crawled pages against technical, metadata, schema, and security heuristics with zero paid quotas.
                                </p>
                            </div>
                            <div className="mt-8 space-y-4 font-mono text-xs">
                                <div>
                                    <div className="flex justify-between text-zinc-900 font-bold mb-1">
                                        <span>Technical SEO</span>
                                        <span className="text-emerald-700">84 Checks</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden border border-zinc-300">
                                        <div className="h-full w-4/5 bg-emerald-600"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-zinc-900 font-bold mb-1">
                                        <span>Metadata & Schema</span>
                                        <span className="text-cyan-700">62 Checks</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden border border-zinc-300">
                                        <div className="h-full w-2/3 bg-cyan-600"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-zinc-900 font-bold mb-1">
                                        <span>Performance & Security</span>
                                        <span className="text-zinc-800">45 Checks</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden border border-zinc-300">
                                        <div className="h-full w-5/6 bg-zinc-800"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3: Actionable AI Fixes */}
                        <div className="col-span-12 lg:col-span-5 bg-white rounded-xl p-8 border border-zinc-300 reveal shadow-md" style={{ animationDelay: '0.2s' }}>
                            <span className="material-symbols-outlined text-emerald-600 mb-3 text-3xl">psychology</span>
                            <h3 className="text-xl font-bold text-zinc-950 mb-2">AI Remediation with Gemini</h3>
                            <p className="text-sm text-zinc-700 leading-relaxed font-normal mb-4">
                                Connect your free Gemini API key to turn issues into prioritized, step-by-step developer remediation plans with contextual code snippets.
                            </p>
                            <div className="p-4 rounded-lg bg-zinc-100 border border-zinc-300 font-mono text-xs text-zinc-900">
                                <div className="text-emerald-700 font-bold mb-1 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">build</span>
                                    <span>AI Suggested Fix</span>
                                </div>
                                <p className="text-zinc-800">Add missing canonical tags and robots meta instructions to avoid duplicate indexing.</p>
                            </div>
                        </div>

                        {/* Feature 4: Open Source Extensibility */}
                        <div className="col-span-12 lg:col-span-7 bg-white rounded-xl p-8 border border-zinc-300 reveal shadow-md" style={{ animationDelay: '0.3s' }}>
                            <span className="material-symbols-outlined text-cyan-600 mb-3 text-3xl">code</span>
                            <h3 className="text-xl font-bold text-zinc-950 mb-2">Modular & Community Extensible</h3>
                            <p className="text-sm text-zinc-700 leading-relaxed font-normal mb-4">
                                Add custom audit rules or standalone SEO tool runners in under 10 lines of Python. Full support for CSV, JSON, and PDF exports.
                            </p>
                            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                                <div className="p-3.5 rounded bg-zinc-100 border border-zinc-300 text-center">
                                    <div className="text-zinc-600 text-[10px] font-bold">STACK</div>
                                    <div className="text-emerald-700 font-extrabold text-xs mt-1">FastAPI + React</div>
                                </div>
                                <div className="p-3.5 rounded bg-zinc-100 border border-zinc-300 text-center">
                                    <div className="text-zinc-600 text-[10px] font-bold">DATABASE</div>
                                    <div className="text-cyan-700 font-extrabold text-xs mt-1">SQLite / Prisma</div>
                                </div>
                                <div className="p-3.5 rounded bg-zinc-100 border border-zinc-300 text-center">
                                    <div className="text-zinc-600 text-[10px] font-bold">LICENSE</div>
                                    <div className="text-zinc-950 font-extrabold text-xs mt-1">MIT Free</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Specialized Tool Suite */}
            <section className="bg-zinc-950 text-white py-24 border-b border-zinc-800 relative">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 reveal">
                        <div>
                            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">Included Utilities</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2 tracking-tight">20+ Standalone SEO Tools</h2>
                        </div>
                        <Link to="/features" className="text-xs font-mono font-bold text-zinc-300 hover:text-white flex items-center gap-1 mt-4 md:mt-0 transition-colors">
                            View All Tools <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 reveal">
                        {TOOL_CATEGORIES.flatMap(category => category.tools).slice(0, 8).map((tool, i) => (
                            <div key={i} className="bg-zinc-900 border border-zinc-700 rounded-lg p-5 hover:border-zinc-500 transition-all flex flex-col justify-between shadow-md">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-bold text-white">{tool.name}</h4>
                                        {tool.upcoming && (
                                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                                                Soon
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                                        {tool.desc}
                                    </p>
                                </div>
                                <Link to="/app" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 mt-4 inline-flex items-center gap-1">
                                    Launch Tool <span className="material-symbols-outlined text-xs">chevron_right</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4: Metrics */}
            <section className="bg-white text-zinc-950 py-20 border-b border-zinc-300">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 reveal">
                        <div className="p-6 rounded-lg bg-zinc-100 border border-zinc-300 shadow-sm">
                            <div className="text-3xl font-extrabold font-mono text-zinc-950 mb-1">249+</div>
                            <div className="text-xs text-zinc-700 font-bold">Automated Audit Rules</div>
                        </div>
                        <div className="p-6 rounded-lg bg-zinc-100 border border-zinc-300 shadow-sm">
                            <div className="text-3xl font-extrabold font-mono text-emerald-700 mb-1">100%</div>
                            <div className="text-xs text-zinc-700 font-bold">Open-Source & Free</div>
                        </div>
                        <div className="p-6 rounded-lg bg-zinc-100 border border-zinc-300 shadow-sm">
                            <div className="text-3xl font-extrabold font-mono text-cyan-700 mb-1">&lt; 15s</div>
                            <div className="text-xs text-zinc-700 font-bold">Average Single-Page Audit</div>
                        </div>
                        <div className="p-6 rounded-lg bg-zinc-100 border border-zinc-300 shadow-sm">
                            <div className="text-3xl font-extrabold font-mono text-zinc-950 mb-1">BYOK</div>
                            <div className="text-xs text-zinc-700 font-bold">Bring Your Own Keys</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 5: CTA Section */}
            <section className="bg-zinc-950 text-white py-20 pb-28">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="rounded-2xl p-10 md:p-16 text-center bg-zinc-900 border-2 border-zinc-700 reveal relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-600 text-xs font-mono text-emerald-400">
                                <span>Self-Host in Seconds</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                                Ready to Audit Your Sites Privately?
                            </h2>
                            <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal">
                                Run unlimited technical SEO audits, inspect Core Web Vitals, and generate AI action plans on your own infrastructure.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                                <Link to="/app" className="bg-white text-black hover:bg-zinc-100 px-8 py-3.5 rounded-lg font-bold text-sm transition-all border border-white shadow-xl">
                                    Launch Dashboard
                                </Link>
                                <Link to="/features" className="bg-zinc-950 hover:bg-zinc-800 text-white px-8 py-3.5 rounded-lg font-semibold text-sm transition-all border border-zinc-700">
                                    Explore Toolkit
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

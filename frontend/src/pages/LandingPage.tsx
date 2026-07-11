import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThreeGraph } from '../components/ThreeGraph';

export default function LandingPage() {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.05,
            rootMargin: '0px 0px -100px 0px'
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
        <main className="relative">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                <div className="relative z-10 max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-32 pb-24">
                    <div className="space-y-stack-md reveal">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-indigo/10 border border-electric-indigo/20 text-electric-indigo font-label-caps text-label-caps">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-flare opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-flare"></span>
                            </span>
                            AI-DRIVEN ENGINE v4.0 NOW LIVE
                        </div>
                        <h2 className="font-display-lg text-display-lg text-on-surface leading-tight drop-shadow-sm">
                            The Elite Command Center for <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-indigo via-cyan-flare to-vibrant-violet">Search Intelligence</span>
                        </h2>
                        <p className="font-body-lg text-body-lg text-slate-text max-w-xl">
                            Transcend traditional SEO audits. Leverage our neural crawling engine to decode search algorithms and execute high-performance growth strategies.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/signup">
                                <button className="bg-gradient-to-r from-electric-indigo to-vibrant-violet text-white px-8 py-4 rounded-xl font-headline-md text-headline-md active:scale-95 transition-transform shadow-lg shadow-electric-indigo/30 btn-shimmer-hover">
                                    Launch Free Audit
                                </button>
                            </Link>
                            <Link to="/features">
                                <button className="px-8 py-4 rounded-xl border border-white/10 glass-card text-on-surface font-headline-md text-headline-md hover:bg-white/5 transition-colors">
                                    View Demo
                                </button>
                            </Link>
                        </div>
                        <div className="flex items-center gap-6 pt-8 border-t border-white/10">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBvd99Cx3BJBYqOPGRdNSyr7Y-qAiDPflXyc15omvoNXQIkOxunx7pMEDGLKa6dt0NssXbk9lR_zm4IR-Nf05jYWfvSnvYWn6T260z1n0MPxlWcDriCBAjqJBHG-HVmd-YBJQ49RbxuFEiN6EXtREil5qHzXo6-IHT9VLVoy5d4HS1KX5fHrDw53_kezaZsj5aAxICLBPMB1N7bZkNCK-j-_iKfCH7rJb9rWZstwvMV5atusgFBGBmrUgLHrpkGcRA3SM5Qpky0Iwo')" }}></div>
                                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8OBaz45E-MIGwQ0BCB6RE59jw6TXgzr9dVnv_LT9_AjY1qAQjTpObmdF-PjS2HljdktEofgcs877iCMAnaWxBlY4CxeG3wl5DfL-AMFylqsQ4tJObY8XGIdbd9uBz5BaIYjcPUvC3Lff-OwkLYtOvDJiipe5KN6YwTHSqstPt50QxYu-iiYsj6HOl0sEKJkVgrDNcllFniV1sqEnUNm74Es5Lt3rbUVL2hTC_R2jpTp4qIslrvwGZ1yKKR7CMcN65qX3qXOfUCkg')" }}></div>
                                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJ4-rrUJgdk1hSZxhIx2BVY6WjyzQokoyoIM8axGDcUSTogi9iNbO3dWpRrF0l-zRfs-736GNjaSZK-0BZ1N6ZDYD-6cQlpYvGA_0SE1PLlVw1qxORs4YWqkNWs1flbP-sxVaLCSuJ3K8JGl4qCP0qQHKUDV7isyHQcBlaSLokMrZ3dLOfq3bZcWK1YPoeHc1OSsbmolUbdzE1rkRqaPbA-kg3-LfGFCngR13QL9DgGIGP6u_whONFk-uCJm612ieLFmMBWbPF3AY')" }}></div>
                            </div>
                            <p className="text-slate-text font-body-sm text-body-sm">Trusted by <span className="text-on-surface font-bold">2,500+</span> elite marketing teams worldwide</p>
                        </div>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="relative group reveal" style={{ animationDelay: '0.2s' }}>
                        <div className="absolute -inset-4 bg-gradient-to-r from-electric-indigo to-cyan-flare opacity-25 blur-3xl group-hover:opacity-40 transition-opacity"></div>
                        <div className="glass-card rounded-2xl overflow-hidden shadow-2xl relative border-white/20">
                            <div className="h-8 bg-surface-container-highest/60 flex items-center px-4 gap-2 border-b border-white/10">
                                <div className="w-3 h-3 rounded-full bg-error/40"></div>
                                <div className="w-3 h-3 rounded-full bg-primary/40"></div>
                                <div className="w-3 h-3 rounded-full bg-cyan-flare/40"></div>
                                <div className="ml-4 h-4 w-48 bg-white/5 rounded-full"></div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-slate-text font-label-caps text-label-caps mb-1">HEALTH SCORE</p>
                                        <p className="text-3xl font-bold text-cyan-flare">94%</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-slate-text font-label-caps text-label-caps mb-1">INDEXABILITY</p>
                                        <p className="text-3xl font-bold text-electric-indigo">1.2M</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-slate-text font-label-caps text-label-caps mb-1">AI INSIGHTS</p>
                                        <p className="text-3xl font-bold text-vibrant-violet">128</p>
                                    </div>
                                </div>
                                <div className="aspect-video w-full relative rounded-lg overflow-hidden bg-surface-container-lowest border border-white/5">
                                    <img alt="SEO Dashboard Interface" className="object-cover w-full h-full opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0S4hotRcrgTPY9wEkMITePwke2TpbzuflKU17u9_v6q-hXFUaA-KUUmbWMt9SAfQTsl-lI1poB1b908E8M8F4m6GN6yvp-7A9OVUN24R71GADgWXKOGEm25TIwwUoa-Npsu4M5sNv0Meln52LwuwnqeHwaQoPCw9Qi1PbMTS7Jb08G_FFEl8b8S0cczAUVtOye_K3bF165v2Y2juqyczEnp9Qz6z30xO8RDJsFuVaVcbdLAgrNtHk9rPa-OiAtL1XPnfpXihj5As" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Bento Grid */}
            <section className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
                <div className="text-center mb-16 reveal">
                    <h3 className="font-headline-lg text-headline-lg text-on-surface mb-4">Precision Engineering for Modern SEO</h3>
                    <p className="font-body-lg text-body-lg text-slate-text max-w-2xl mx-auto">Our toolkit is built for speed, depth, and actionable clarity, powered by proprietary AI models trained on trillions of search results.</p>
                </div>
                <div className="grid grid-cols-12 gap-gutter">
                    {/* Feature 1: Deep Crawling (3D Interactive Content) */}
                    <div className="col-span-12 lg:col-span-8 glass-card rounded-2xl p-8 relative overflow-hidden group min-h-[480px] reveal">
                        <div className="flex flex-col h-full justify-between relative z-20 pointer-events-none">
                            <div>
                                <span className="material-symbols-outlined text-cyan-flare mb-4" style={{ fontSize: '40px' }}>radar</span>
                                <h4 className="font-headline-md text-headline-md text-on-surface mb-2">Deep Crawling Neural Engine</h4>
                                <p className="font-body-md text-body-md text-slate-text max-w-md">Our spider architecture mimics modern search engine behavior, discovering hidden technical debt and indexing bottlenecks across millions of URLs in seconds.</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold backdrop-blur-md">Headless Browser Rendering</span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold backdrop-blur-md">JS Execution Analysis</span>
                            </div>
                        </div>
                        {/* 3D SEO Knowledge Graph Container */}
                        <ThreeGraph />
                    </div>

                    {/* Feature 2: 251-Rule Engine */}
                    <div className="col-span-12 lg:col-span-4 glass-card rounded-2xl p-8 border-l-4 border-l-electric-indigo reveal" style={{ animationDelay: '0.1s' }}>
                        <span className="material-symbols-outlined text-electric-indigo mb-4" style={{ fontSize: '40px' }}>rule</span>
                        <h4 className="font-headline-md text-headline-md text-on-surface mb-2">251-Rule Audit Engine</h4>
                        <p className="font-body-md text-body-md text-slate-text">Every crawl is validated against our proprietary 251-rule framework, covering technical, on-page, and authority signals that others miss.</p>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-4/5 bg-electric-indigo"></div>
                                </div>
                                <span className="text-xs font-bold">Tech</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-vibrant-violet"></div>
                                </div>
                                <span className="text-xs font-bold">Content</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-5/6 bg-cyan-flare"></div>
                                </div>
                                <span className="text-xs font-bold">Links</span>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3: AI Roadmaps */}
                    <div className="col-span-12 lg:col-span-5 glass-card rounded-2xl p-8 bg-gradient-to-br from-surface-container-high/50 to-transparent reveal" style={{ animationDelay: '0.2s' }}>
                        <div className="ai-shimmer absolute inset-0 opacity-30 pointer-events-none"></div>
                        <span className="material-symbols-outlined text-vibrant-violet mb-4" style={{ fontSize: '40px' }}>psychology</span>
                        <h4 className="font-headline-md text-headline-md text-on-surface mb-2">AI-Generated Roadmaps</h4>
                        <p className="font-body-md text-body-md text-slate-text">Don't just find problems. Get an prioritized execution plan generated by GPT-4 and trained on winning SEO case studies.</p>
                        <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-vibrant-violet/30 backdrop-blur-md relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-vibrant-violet text-sm">auto_awesome</span>
                                <span className="text-xs text-vibrant-violet font-bold uppercase tracking-widest">Next Best Action</span>
                            </div>
                            <p className="text-sm italic">"Consolidate 12 near-duplicate pages into a single authoritative pillar... Estimated traffic lift: +24%"</p>
                        </div>
                    </div>

                    {/* Feature 4: Competitor Intelligence */}
                    <div className="col-span-12 lg:col-span-7 glass-card rounded-2xl p-8 overflow-hidden relative group reveal" style={{ animationDelay: '0.3s' }}>
                        <div className="flex flex-col h-full justify-between relative z-10">
                            <div>
                                <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: '40px' }}>monitoring</span>
                                <h4 className="font-headline-md text-headline-md text-on-surface mb-2">Competitor Reverse Engineering</h4>
                                <p className="font-body-md text-body-md text-slate-text max-w-sm">Dismantle your competitors' strategy. See their backlink velocity, content gaps, and exact keyword spend in real-time.</p>
                            </div>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-64 h-64 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700 bg-gradient-to-tl from-primary/50 to-transparent rounded-full blur-3xl"></div>
                    </div>
                </div>
            </section>

            {/* Command Center Section */}
            <section className="max-w-container-max mx-auto px-margin-desktop py-stack-lg border-t border-white/10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="w-full lg:w-1/2 order-2 lg:order-1 reveal">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-2xl glass-card hover:border-electric-indigo/40">
                                <h5 className="text-3xl font-bold text-white mb-2">99.9%</h5>
                                <p className="text-slate-text text-sm">Uptime for Enterprise crawling tasks</p>
                            </div>
                            <div className="p-6 rounded-2xl glass-card hover:border-cyan-flare/40">
                                <h5 className="text-3xl font-bold text-white mb-2">12s</h5>
                                <p className="text-slate-text text-sm">Average time for initial landing audit</p>
                            </div>
                            <div className="p-6 rounded-2xl glass-card hover:border-vibrant-violet/40">
                                <h5 className="text-3xl font-bold text-white mb-2">50B+</h5>
                                <p className="text-slate-text text-sm">Backlinks indexed in our global database</p>
                            </div>
                            <div className="p-6 rounded-2xl glass-card hover:border-primary/40">
                                <h5 className="text-3xl font-bold text-white mb-2">4.9/5</h5>
                                <p className="text-slate-text text-sm">Satisfaction rating from Fortune 500s</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 order-1 lg:order-2 space-y-6 reveal" style={{ animationDelay: '0.1s' }}>
                        <h2 className="font-display-lg text-headline-lg text-on-surface">The Intelligence Layer for Your Marketing Stack</h2>
                        <p className="font-body-lg text-body-lg text-slate-text">
                            Integrate SEO Intelligence directly into your existing workflow. With robust API support and native integrations for Google Search Console, Slack, and JIRA, your team stays aligned and your rankings keep rising.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-electric-indigo">check_circle</span>
                                <span className="font-body-md text-body-md">White-labeled reporting for agencies</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-electric-indigo">check_circle</span>
                                <span className="font-body-md text-body-md">Real-time keyword position tracking</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-electric-indigo">check_circle</span>
                                <span className="font-body-md text-body-md">Advanced schema markup validation</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-container-max mx-auto px-margin-desktop py-stack-lg pb-32">
                <div className="relative rounded-3xl overflow-hidden p-12 lg:p-20 text-center glass-card reveal border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-electric-indigo/15 to-vibrant-violet/15"></div>
                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="font-display-lg text-display-lg text-on-surface">Ready to Command the SERPs?</h2>
                        <p className="font-body-lg text-body-lg text-slate-text">
                            Join the world's most sophisticated SEO teams and start turning data into dominance. No credit card required to start your first crawl.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/signup">
                                <button className="bg-white text-slate-950 px-10 py-5 rounded-xl font-headline-md text-headline-md active:scale-95 transition-transform hover:shadow-2xl hover:shadow-white/20 btn-shimmer-hover">
                                    Create Free Account
                                </button>
                            </Link>
                            <Link to="/contact">
                                <button className="bg-transparent border border-white/20 text-white px-10 py-5 rounded-xl font-headline-md text-headline-md hover:bg-white/10 transition-colors backdrop-blur-md">
                                    Book Enterprise Demo
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

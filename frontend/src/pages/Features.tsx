import { Link } from 'react-router-dom';
import { ThreeGraph } from '../components/ThreeGraph';

export default function Features() {
  return (
    <div className="pt-24 pb-20 px-8 md:px-12 max-w-container-max mx-auto relative z-10 flex flex-col gap-stack-lg">
      
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-12 mt-12">
        <div className="flex-1 space-y-6">
          <div className="inline-block bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
            <span className="text-primary font-label-caps uppercase tracking-wider text-sm">Universal Intelligence Framework</span>
          </div>
          <h1 className="text-display-lg font-display-lg tracking-tighter text-on-surface leading-tight">
            The Ultimate <span className="bg-gradient-to-r from-electric-indigo to-cyan-flare text-transparent bg-clip-text">Goal-Oriented AI Crawler</span>
          </h1>
          <p className="text-body-lg text-slate-text max-w-xl leading-relaxed">
            A major architectural upgrade transforms static scraping into a fully autonomous, Reinforcement Learning-powered AI Agent capable of adapting to any data extraction need.
          </p>
        </div>
        <div className="flex-1 w-full h-[400px] lg:h-[500px] relative rounded-[2rem] overflow-hidden glass-card border border-white/10 dark:border-white/10 p-2">
            <div className="absolute inset-0 bg-gradient-to-br from-electric-indigo/20 to-cyan-flare/20 rounded-[1.8rem] z-0"></div>
            <div className="relative z-10 w-full h-full rounded-[1.5rem] overflow-hidden">
                <ThreeGraph />
            </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="glass-card p-8 rounded-3xl border border-white/10 dark:border-white/10 hover:border-electric-indigo/50 transition-colors group">
          <div className="h-12 w-12 rounded-2xl bg-electric-indigo/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-electric-indigo text-3xl">psychology</span>
          </div>
          <h3 className="text-headline-md font-display-lg font-bold text-on-surface mb-3">Reinforcement Learning</h3>
          <p className="text-slate-text text-body-md">
            Powered by a Multi-Armed Bandit algorithm, the AI "learns" during the crawl, dynamically prioritizing high-value URL paths based on your specific extraction goals.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/10 dark:border-white/10 hover:border-cyan-flare/50 transition-colors group">
          <div className="h-12 w-12 rounded-2xl bg-cyan-flare/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-cyan-flare text-3xl">magic_button</span>
          </div>
          <h3 className="text-headline-md font-display-lg font-bold text-on-surface mb-3">Universal LLM Extraction</h3>
          <p className="text-slate-text text-body-md">
            Use natural language commands to extract completely custom targets. The Google Gemini API seamlessly parses webpage text to find exactly what you ask for.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/10 dark:border-white/10 hover:border-vibrant-violet/50 transition-colors group lg:row-span-2">
          <div className="h-12 w-12 rounded-2xl bg-vibrant-violet/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-vibrant-violet text-3xl">security</span>
          </div>
          <h3 className="text-headline-md font-display-lg font-bold text-on-surface mb-3">Smart-Fetch Anti-Bot Bypass</h3>
          <p className="text-slate-text text-body-md mb-6">
            Scraping modern high-value targets often results in 403 Forbidden errors. The framework integrates Playwright Stealth to intelligently evade these systems.
          </p>
          <ul className="space-y-3">
             <li className="flex items-center gap-3 text-slate-text text-sm"><span className="material-symbols-outlined text-electric-indigo text-sm">check_circle</span> Defeats Cloudflare & DDoS-Guard</li>
             <li className="flex items-center gap-3 text-slate-text text-sm"><span className="material-symbols-outlined text-electric-indigo text-sm">check_circle</span> Renders complex SPAs natively</li>
             <li className="flex items-center gap-3 text-slate-text text-sm"><span className="material-symbols-outlined text-electric-indigo text-sm">check_circle</span> Dynamic fallback triggers on 401/403/503</li>
          </ul>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/10 dark:border-white/10 hover:border-electric-indigo/50 transition-colors group md:col-span-2 lg:col-span-2">
          <div className="h-12 w-12 rounded-2xl bg-electric-indigo/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-electric-indigo text-3xl">database</span>
          </div>
          <h3 className="text-headline-md font-display-lg font-bold text-on-surface mb-3">Interactive CLI & Dynamic Targets</h3>
          <p className="text-slate-text text-body-md">
            Extraction targets are completely dynamic. Extract emails, phone numbers, images, articles, and products seamlessly. Our Schema.org JSON-LD parser intelligently targets nested e-commerce data before falling back to generic DOM traversal.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/10 dark:border-white/10 hover:border-cyan-flare/50 transition-colors group">
          <div className="h-12 w-12 rounded-2xl bg-cyan-flare/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-cyan-flare text-3xl">schema</span>
          </div>
          <h3 className="text-headline-md font-display-lg font-bold text-on-surface mb-3">Relational Data Exports</h3>
          <p className="text-slate-text text-body-md">
            Advanced Pandas processing automatically explodes arrays, ensuring every discovered contact gets a distinct, clean row for enterprise CRMs.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/10 dark:border-white/10 hover:border-vibrant-violet/50 transition-colors group">
          <div className="h-12 w-12 rounded-2xl bg-vibrant-violet/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-vibrant-violet text-3xl">save</span>
          </div>
          <h3 className="text-headline-md font-display-lg font-bold text-on-surface mb-3">Stateful Checkpointing</h3>
          <p className="text-slate-text text-body-md">
            Powered by SQLite and JSON state files. The crawler never loses progress—resume instantly exactly where you left off after any interruption.
          </p>
        </div>

      </section>
      
      {/* CTA Section */}
      <section className="my-12 text-center bg-slate-900/50 dark:bg-transparent glass-card rounded-[3rem] p-16 border border-white/10 dark:border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-indigo/10 to-transparent z-0"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl font-display-lg font-bold text-on-surface">Ready to extract intelligence?</h2>
            <p className="text-slate-text text-body-lg">
                Deploy the Universal AI Crawler today and generate flawless lead lists and contact datasets with zero manual configuration.
            </p>
            <div className="flex justify-center gap-4">
                <Link to="/signup">
                    <button className="bg-electric-indigo text-white font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-electric-indigo/90 transition-all btn-shimmer-hover">
                        Initialize Profile
                    </button>
                </Link>
            </div>
        </div>
      </section>

    </div>
  );
}

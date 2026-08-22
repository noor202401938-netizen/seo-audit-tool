import { ThreeGraph } from '../components/ThreeGraph';
import { TOOL_CATEGORIES } from '../data/tools';

export default function Features() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      
      {/* Hero Section (DARK BLOCK) */}
      <section className="pt-28 pb-16 px-6 max-w-6xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 mt-4">
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono font-semibold text-zinc-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              SEO & CRAWL ENGINE CAPABILITIES
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Automated Audit Rules & Headless Intelligence Engine
            </h1>
            <p className="text-base text-zinc-300 max-w-xl leading-relaxed">
              Our framework executes 249+ rules across client-side rendering, metadata integrity, Core Web Vitals, and public contact extraction.
            </p>
          </div>
          <div className="flex-1 w-full h-[360px] lg:h-[420px] relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700 p-2 shadow-2xl">
              <div className="relative z-10 w-full h-full rounded-lg overflow-hidden bg-[#09090b]">
                  <ThreeGraph />
              </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid (LIGHT BLOCK) */}
      <section className="bg-zinc-100 text-zinc-950 border-y border-zinc-300 py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">Architecture Matrix</span>
            <h2 className="text-3xl font-extrabold text-zinc-950 mt-1">Engineered for Scalable Auditing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-white p-7 rounded-xl border border-zinc-300 shadow-md">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 border border-zinc-300 flex items-center justify-center mb-5 text-emerald-700">
                <span className="material-symbols-outlined text-xl">psychology</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-950 mb-2">Goal-Oriented Crawling</h3>
              <p className="text-zinc-700 text-sm leading-relaxed">
                Prioritizes high-value URLs automatically based on selected audit categories, avoiding low-value duplicate paths.
              </p>
            </div>

            <div className="bg-white p-7 rounded-xl border border-zinc-300 shadow-md">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 border border-zinc-300 flex items-center justify-center mb-5 text-cyan-700">
                <span className="material-symbols-outlined text-xl">javascript</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-950 mb-2">Smart Playwright Fallback</h3>
              <p className="text-zinc-700 text-sm leading-relaxed">
                Detects client-side SPAs and Cloudflare edge challenges, automatically triggering headless browser rendering when needed.
              </p>
            </div>

            <div className="bg-white p-7 rounded-xl border border-zinc-300 shadow-md lg:row-span-2 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-zinc-100 border border-zinc-300 flex items-center justify-center mb-5 text-zinc-900">
                  <span className="material-symbols-outlined text-xl">security</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-950 mb-2">249 Diagnostic Rules</h3>
                <p className="text-zinc-700 text-sm leading-relaxed mb-6">
                  Validates pages against technical SEO, canonical consistency, OpenGraph attributes, JSON-LD schemas, and security headers.
                </p>
              </div>
              <ul className="space-y-3 font-mono text-xs border-t border-zinc-200 pt-5">
                 <li className="flex items-center gap-2.5 text-zinc-900 font-bold"><span className="material-symbols-outlined text-emerald-700 text-sm">check_circle</span> Technical & Canonical Audit</li>
                 <li className="flex items-center gap-2.5 text-zinc-900 font-bold"><span className="material-symbols-outlined text-emerald-700 text-sm">check_circle</span> OpenGraph & Twitter Cards</li>
                 <li className="flex items-center gap-2.5 text-zinc-900 font-bold"><span className="material-symbols-outlined text-emerald-700 text-sm">check_circle</span> Core Web Vitals & Speed</li>
              </ul>
            </div>

            <div className="bg-white p-7 rounded-xl border border-zinc-300 shadow-md md:col-span-2 lg:col-span-2">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 border border-zinc-300 flex items-center justify-center mb-5 text-emerald-700">
                <span className="material-symbols-outlined text-xl">contacts</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-950 mb-2">Public Contact Extraction</h3>
              <p className="text-zinc-700 text-sm leading-relaxed">
                Extracts verified public emails (`mailto:` and validated regex patterns), telephone numbers (`tel:`), contact forms, and official social media handles from internal site pages.
              </p>
            </div>

            <div className="bg-white p-7 rounded-xl border border-zinc-300 shadow-md">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 border border-zinc-300 flex items-center justify-center mb-5 text-cyan-700">
                <span className="material-symbols-outlined text-xl">table_chart</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-950 mb-2">Multi-Format Export</h3>
              <p className="text-zinc-700 text-sm leading-relaxed">
                Export audit data and discovered contact records directly to CSV, Excel (`.xlsx`), and structured SQLite databases.
              </p>
            </div>

            <div className="bg-white p-7 rounded-xl border border-zinc-300 shadow-md">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 border border-zinc-300 flex items-center justify-center mb-5 text-zinc-900">
                <span className="material-symbols-outlined text-xl">restore</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-950 mb-2">Stateful Checkpointing</h3>
              <p className="text-zinc-700 text-sm leading-relaxed">
                Resumes long-running domain crawls effortlessly from saved JSON checkpoints and SQLite queue tracking.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Complete Tool Directory (DARK BLOCK) */}
      <section className="bg-zinc-950 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">Audit Suite Directory</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">All 25+ Specialized Tools</h2>
          </div>

          <div className="space-y-12">
              {TOOL_CATEGORIES.map((category, idx) => (
                  <div key={idx} className="space-y-4">
                      <h4 className="text-lg font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-400 text-base">category</span>
                          {category.title}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {category.tools.map((tool, i) => (
                              <div key={i} className="bg-zinc-900 border border-zinc-700 rounded-lg p-5 shadow-sm">
                                  <h5 className="text-sm font-bold text-white mb-2 flex items-center justify-between">
                                      {tool.name}
                                      {tool.upcoming && (
                                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                                              Soon
                                          </span>
                                      )}
                                  </h5>
                                  <p className="text-xs text-zinc-300 leading-relaxed">
                                      {tool.desc}
                                  </p>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section (LIGHT BLOCK) */}
      <section className="bg-white text-zinc-950 py-16 px-6 border-t border-zinc-300">
        <div className="max-w-6xl mx-auto">
          <div className="bg-zinc-100 rounded-2xl p-10 md:p-14 text-center border border-zinc-300 shadow-xl max-w-2xl mx-auto space-y-5">
              <h2 className="text-3xl font-extrabold text-zinc-950">Ready to audit your web architecture?</h2>
              <p className="text-zinc-700 text-sm leading-relaxed font-normal">
                  Launch automated site audits and contact extractions in seconds with zero complex setup.
              </p>
              <div className="pt-2">
                  <a 
                      href="https://github.com/noor202401938-netizen/seo-audit-tool#readme" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-black text-white font-bold py-3.5 px-8 rounded-lg text-sm transition-all border border-zinc-900 shadow-xl"
                  >
                      <span>Read Local Setup Guide</span>
                      <span className="material-symbols-outlined text-base">arrow_outward</span>
                  </a>
              </div>
          </div>
        </div>
      </section>

    </div>
  );
}

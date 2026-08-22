import { ExternalLink, Code2, Shield, Heart, Terminal } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      
      {/* Hero Header Section */}
      <section className="pt-28 pb-16 px-6 max-w-6xl mx-auto flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono font-semibold text-zinc-200 w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          OPEN SOURCE COMMUNITY PROJECT
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          About SEO Intelligence
        </h1>
        <p className="text-base md:text-lg text-zinc-300 max-w-2xl leading-relaxed font-normal">
          An open-source, self-hosted technical SEO audit platform and headless crawler engine built for developers, agencies, and growth engineers.
        </p>
      </section>

      {/* Main Content Bento Grid */}
      <section className="bg-zinc-100 text-zinc-950 border-y border-zinc-300 py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: The Mission */}
            <div className="bg-white p-8 rounded-xl border border-zinc-300 shadow-md space-y-4">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 border border-zinc-300 flex items-center justify-center text-emerald-700">
                <Code2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-zinc-950">Our Mission</h2>
              <p className="text-sm text-zinc-700 leading-relaxed font-normal">
                SEO Intelligence was created to provide transparent, automated, enterprise-grade technical SEO auditing without proprietary paywalls or expensive monthly subscriptions. We empower developers and technical founders to inspect their site health and AI search readiness on their own private infrastructure.
              </p>
            </div>

            {/* Card 2: Privacy-First Architecture */}
            <div className="bg-white p-8 rounded-xl border border-zinc-300 shadow-md space-y-4">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 border border-zinc-300 flex items-center justify-center text-cyan-700">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-zinc-950">Self-Hosted &amp; Private</h2>
              <p className="text-sm text-zinc-700 leading-relaxed font-normal">
                All data, audit logs, crawl results, and API keys remain on your own server or local machine. Zero centralized tracking, zero third-party telemetry, and zero rate limits imposed on self-hosted instances.
              </p>
            </div>
          </div>

          {/* Technical Specs & Stack */}
          <div className="bg-white p-8 rounded-xl border border-zinc-300 shadow-md space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 border border-zinc-300 flex items-center justify-center text-zinc-900">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-950">Core Engine &amp; Architecture</h2>
                <p className="text-xs text-zinc-600 font-mono">FastAPI &bull; React &bull; Playwright &bull; Prisma &bull; SQLite</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs">
              <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="font-bold text-zinc-900">Headless Crawler</div>
                <p className="text-zinc-600 font-sans text-xs">Playwright Chromium rendering for single-page applications and dynamic JavaScript.</p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="font-bold text-zinc-900">249 Diagnostic Matrix</div>
                <p className="text-zinc-600 font-sans text-xs">Automated verification of canonicals, OpenGraph, JSON-LD schemas, and security headers.</p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="font-bold text-zinc-900">AI Remediation</div>
                <p className="text-zinc-600 font-sans text-xs">Direct Gemini API integration turning audit findings into actionable developer code fixes.</p>
              </div>
            </div>
          </div>

          {/* Acknowledgements & Credits */}
          <div className="bg-white p-8 rounded-xl border border-zinc-300 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-zinc-950 font-bold text-lg">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
              <h3>Acknowledgements &amp; Upstream Credits</h3>
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed font-normal">
              SEO Intelligence uses the SEOmator engine as its foundation, built upon the open-source rule framework from{' '}
              <a 
                href="https://github.com/seo-skills/seo-audit-skill" 
                target="_blank" 
                rel="noreferrer" 
                className="text-emerald-700 hover:underline font-mono font-bold inline-flex items-center gap-1"
              >
                seo-skills/seo-audit-skill <ExternalLink className="w-3.5 h-3.5" />
              </a>.
            </p>
            <div className="pt-2 border-t border-zinc-200 text-xs text-zinc-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span>Developed &amp; open-sourced by <a href="https://www.sixtyhours.tech/" target="_blank" rel="noreferrer" className="text-zinc-900 font-bold hover:underline">SixtyHours</a>.</span>
              <a href="https://github.com/noor202401938-netizen/seo-audit-tool" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline font-bold font-mono inline-flex items-center gap-1">
                GitHub Repository <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

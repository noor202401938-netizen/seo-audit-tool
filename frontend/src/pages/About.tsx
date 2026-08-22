export default function About() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen pt-28 pb-20 px-6 max-w-4xl mx-auto">
      <div className="bg-zinc-900/40 rounded-xl p-8 md:p-12 border border-zinc-800 space-y-8">
        <div className="border-b border-zinc-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ABOUT SEO INTELLIGENCE
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-100">About SEO Intelligence</h1>
        </div>
        
        <div className="space-y-8 text-zinc-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-zinc-100 mb-2">Our Mission</h2>
            <p>
              SEO Intelligence was created to provide transparent, automated, enterprise-grade technical SEO auditing and contact extraction tools. We empower growth engineers, technical founders, and SEO teams to diagnose site health issues instantly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mb-2">249-Rule Diagnostic Engine</h2>
            <p>
              Traditional SEO checkers rely on simple surface checks that miss JavaScript rendering and canonical conflicts. Our engine runs 249 technical, metadata, schema, and Core Web Vitals checks using Playwright-powered headless rendering to mirror how search engine crawlers index web content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mb-2">Engineering & Architecture</h2>
            <ul className="list-disc pl-5 space-y-2 text-zinc-300 font-mono text-xs">
              <li><strong>Headless DOM Rendering:</strong> Native Playwright Chromium execution for JavaScript SPAs.</li>
              <li><strong>249 Diagnostic Matrix:</strong> Automated evaluation of canonicals, OpenGraph, JSON-LD, and Core Web Vitals.</li>
              <li><strong>Public Contact Extraction:</strong> Pattern validation for public email addresses, telephone numbers, and social links.</li>
            </ul>
          </section>

          <section className="pt-4 border-t border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-100 mb-2">Acknowledgements & Credits</h2>
            <p>
              SEO Intelligence uses the SEOmator engine as its foundation, built upon the open-source rule framework from{' '}
              <a 
                href="https://github.com/seo-skills/seo-audit-skill" 
                target="_blank" 
                rel="noreferrer" 
                className="text-emerald-400 hover:underline font-mono"
              >
                seo-skills/seo-audit-skill
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

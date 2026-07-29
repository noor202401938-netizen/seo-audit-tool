import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      
      {/* Header Section (DARK BLOCK) */}
      <section className="pt-28 pb-12 px-6 max-w-6xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono font-bold text-zinc-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            TRANSPARENT PRICING
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Scale Your Technical Audits & Extraction
        </h1>
        <p className="text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Select the plan tailored for your team — from single-site diagnostics to enterprise crawling workflows.
        </p>
      </section>
      
      {/* Pricing Grid (LIGHT CONTAINER BLOCK) */}
      <section className="bg-zinc-100 text-zinc-950 border-y border-zinc-300 py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch w-full">
          
          {/* Starter Plan */}
          <div className="bg-white rounded-xl p-8 border border-zinc-300 flex flex-col justify-between shadow-md hover:border-zinc-400 transition-all">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-600 font-bold mb-1">Starter</div>
              <h2 className="text-2xl font-extrabold text-zinc-950 mb-2">Free Plan</h2>
              <p className="text-zinc-600 text-xs mb-6 font-medium">Ideal for quick single-page audits.</p>
              <div className="text-4xl font-extrabold font-mono text-zinc-950 mb-6">$0<span className="text-xs text-zinc-600 font-normal"> / month</span></div>
              <ul className="space-y-3.5 mb-8 text-xs text-zinc-800 font-medium">
                <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-emerald-700 text-base">check_circle</span> 5 Site Audits / month</li>
                <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-emerald-700 text-base">check_circle</span> Basic Technical SEO Checks</li>
                <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-emerald-700 text-base">check_circle</span> Up to 10 pages per crawl</li>
                <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-emerald-700 text-base">check_circle</span> Access to core audit tools</li>
              </ul>
            </div>
            <Link to="/signup" className="w-full">
              <button className="w-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-950 font-bold py-3 rounded-lg transition-all text-xs shadow-sm">
                Get Started Free
              </button>
            </Link>
          </div>

          {/* Business Plan (FEATURED DARK CARD) */}
          <div className="bg-zinc-950 text-white rounded-xl p-8 border-2 border-zinc-700 flex flex-col justify-between relative shadow-2xl z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-0.5 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider shadow-md">
              Most Popular
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1">Professional</div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Business</h2>
              <p className="text-zinc-400 text-xs mb-6 font-medium">For agencies, SEO specialists & marketing teams.</p>
              <div className="text-5xl font-extrabold font-mono text-white mb-6">$49<span className="text-xs text-zinc-400 font-normal"> / month</span></div>
              <ul className="space-y-3.5 mb-8 text-xs text-zinc-200 font-medium">
                <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span> 200 Site Audits / month</li>
                <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span> Complete 249-Rule Diagnostic Matrix</li>
                <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span> Up to 100 pages per crawl</li>
                <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span> Smart Playwright Anti-Bot Bypass</li>
                <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span> Public Contact Extraction (Emails/Phones)</li>
                <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span> Full suite of 25+ audit tools</li>
              </ul>
            </div>
            <Link to="/signup" className="w-full">
              <button className="w-full bg-white hover:bg-zinc-100 text-black font-extrabold py-3.5 rounded-lg transition-all text-xs shadow-xl">
                Upgrade to Business
              </button>
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-xl p-8 border border-zinc-300 flex flex-col justify-between shadow-md hover:border-zinc-400 transition-all">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-600 font-bold mb-1">Custom Scale</div>
              <h2 className="text-2xl font-extrabold text-zinc-950 mb-2">Enterprise</h2>
              <p className="text-zinc-600 text-xs mb-6 font-medium">For large organizations requiring bulk extraction.</p>
              <div className="text-4xl font-extrabold font-mono text-zinc-950 mb-6">Custom</div>
              <ul className="space-y-3.5 mb-8 text-xs text-zinc-800 font-medium">
                <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-emerald-700 text-base">check_circle</span> Unlimited Audits & Crawl Depth</li>
                <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-emerald-700 text-base">check_circle</span> Dedicated Proxy Pools & Custom Parsers</li>
                <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-emerald-700 text-base">check_circle</span> API Access & Webhook Integrations</li>
                <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-emerald-700 text-base">check_circle</span> Dedicated Engineering Support</li>
              </ul>
            </div>
            <Link to="/contact" className="w-full">
              <button className="w-full bg-zinc-950 hover:bg-black text-white font-bold py-3 rounded-lg transition-all text-xs shadow-md">
                Contact Engineering
              </button>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

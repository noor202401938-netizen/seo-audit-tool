import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div className="pt-24 pb-20 px-8 md:px-12 max-w-container-max mx-auto relative z-10 flex flex-col gap-stack-lg">
      
      {/* Header Section */}
      <div className="text-center space-y-6 mt-12 mb-12">
        <div className="inline-block bg-cyan-flare/10 border border-cyan-flare/20 px-4 py-1.5 rounded-full">
            <span className="text-cyan-flare font-label-caps uppercase tracking-wider text-sm">Transparent Pricing</span>
        </div>
        <h1 className="text-display-lg font-display-lg tracking-tighter text-on-surface leading-tight">
          Extract Data at <span className="bg-gradient-to-r from-electric-indigo to-vibrant-violet text-transparent bg-clip-text">Any Scale</span>
        </h1>
        <p className="text-body-lg text-slate-text max-w-2xl mx-auto leading-relaxed">
          Choose the plan that fits your intelligence needs, from single-site audits to enterprise-grade AI extraction.
        </p>
      </div>
      
      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
        
        {/* Free Plan */}
        <div className="glass-card rounded-[2.5rem] p-10 border border-white/10 dark:border-white/10 flex flex-col hover:border-slate-500/50 transition-colors">
          <h3 className="text-headline-md font-display-lg font-bold text-on-surface mb-2">Free</h3>
          <p className="text-slate-text text-body-md mb-8">Perfect for trying out the crawler.</p>
          <div className="text-5xl font-display-lg font-extrabold text-on-surface mb-8 tracking-tighter">$0<span className="text-xl text-slate-text font-normal tracking-normal">/mo</span></div>
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-center text-slate-text text-body-md gap-3"><span className="material-symbols-outlined text-electric-indigo text-lg">check_circle</span> 5 audits per month</li>
            <li className="flex items-center text-slate-text text-body-md gap-3"><span className="material-symbols-outlined text-electric-indigo text-lg">check_circle</span> Basic SEO rules</li>
            <li className="flex items-center text-slate-text text-body-md gap-3"><span className="material-symbols-outlined text-electric-indigo text-lg">check_circle</span> Up to 10 pages per audit</li>
            <li className="flex items-center text-slate-text text-body-md gap-3"><span className="material-symbols-outlined text-electric-indigo text-lg">check_circle</span> Access to 5 basic tools</li>
          </ul>
          <Link to="/signup" className="w-full">
            <button className="w-full bg-white/5 border border-white/10 text-on-surface font-bold py-4 rounded-full hover:bg-white/10 transition-all font-body-lg">
              Get Started
            </button>
          </Link>
        </div>

        {/* Business Plan */}
        <div className="glass-card rounded-[3rem] p-12 border border-electric-indigo/50 shadow-[0_0_40px_rgba(99,102,241,0.15)] flex flex-col relative transform md:scale-105 z-10 bg-slate-900/60 dark:bg-slate-900/60">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-electric-indigo to-cyan-flare text-white px-6 py-1.5 rounded-full text-sm font-label-caps uppercase tracking-widest shadow-lg">
            Most Popular
          </div>
          <h3 className="text-headline-md font-display-lg font-bold text-on-surface mb-2">Business</h3>
          <p className="text-slate-text text-body-md mb-8">For agencies and growing sites.</p>
          <div className="text-6xl font-display-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-electric-indigo to-cyan-flare mb-8 tracking-tighter">$49<span className="text-xl text-slate-text font-normal tracking-normal">/mo</span></div>
          <ul className="space-y-5 mb-10 flex-1">
            <li className="flex items-center text-on-surface font-semibold text-body-md gap-3"><span className="material-symbols-outlined text-cyan-flare text-xl">check_circle</span> 200 audits per month</li>
            <li className="flex items-center text-slate-text text-body-md gap-3"><span className="material-symbols-outlined text-cyan-flare text-xl">check_circle</span> All 251 SEO rules</li>
            <li className="flex items-center text-slate-text text-body-md gap-3"><span className="material-symbols-outlined text-cyan-flare text-xl">check_circle</span> Up to 100 pages per audit</li>
            <li className="flex items-center text-slate-text text-body-md gap-3"><span className="material-symbols-outlined text-cyan-flare text-xl">check_circle</span> AI Recommendations</li>
            <li className="flex items-center text-slate-text text-body-md gap-3"><span className="material-symbols-outlined text-cyan-flare text-xl">check_circle</span> Full suite of 25+ SEO tools</li>
          </ul>
          <Link to="/signup" className="w-full">
            <button className="w-full bg-gradient-to-r from-electric-indigo to-cyan-flare text-white font-bold py-4 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:brightness-110 transition-all btn-shimmer-hover font-body-lg">
              Upgrade Now
            </button>
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="glass-card rounded-[2.5rem] p-10 border border-white/10 dark:border-white/10 flex flex-col hover:border-vibrant-violet/50 transition-colors">
          <h3 className="text-headline-md font-display-lg font-bold text-on-surface mb-2">Enterprise</h3>
          <p className="text-slate-text text-body-md mb-8">For massive organizations.</p>
          <div className="text-5xl font-display-lg font-extrabold text-on-surface mb-8 tracking-tighter">Custom</div>
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-center text-slate-text text-body-md gap-3"><span className="material-symbols-outlined text-vibrant-violet text-lg">check_circle</span> Unlimited audits</li>
            <li className="flex items-center text-slate-text text-body-md gap-3"><span className="material-symbols-outlined text-vibrant-violet text-lg">check_circle</span> Unlimited pages</li>
            <li className="flex items-center text-slate-text text-body-md gap-3"><span className="material-symbols-outlined text-vibrant-violet text-lg">check_circle</span> Custom LLM Extraction</li>
            <li className="flex items-center text-slate-text text-body-md gap-3"><span className="material-symbols-outlined text-vibrant-violet text-lg">check_circle</span> Dedicated proxy pools</li>
          </ul>
          <Link to="/contact" className="w-full">
            <button className="w-full bg-white/5 border border-white/10 text-on-surface font-bold py-4 rounded-full hover:bg-white/10 transition-all font-body-lg">
              Book a Call
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}

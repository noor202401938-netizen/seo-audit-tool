import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-zinc-950/80 backdrop-blur-xl w-full py-16 border-t border-zinc-800/80 flex flex-col items-center px-6 mt-auto">
        <div className="max-w-6xl w-full flex flex-col lg:flex-row justify-between gap-12 items-start">
            <div className="space-y-4 max-w-xs">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-zinc-300 text-xs">tune</span>
                    </div>
                    <span className="font-bold text-sm tracking-tight text-zinc-100">SEOINTELLIGENCE</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                    Open-source technical SEO audit suite and crawler engine. Self-hosted and community-driven.
                </p>
                <div className="flex items-center gap-2 pt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-mono text-zinc-400">100% Free &amp; Open Source</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-xs">
                <div className="flex flex-col gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Open Source</span>
                    <a className="text-zinc-400 hover:text-zinc-100 transition-colors" href="https://github.com/noor202401938-netizen/seo-audit-tool#readme" target="_blank" rel="noreferrer">GitHub README</a>
                    <a className="text-zinc-400 hover:text-zinc-100 transition-colors" href="https://github.com/noor202401938-netizen/seo-audit-tool" target="_blank" rel="noreferrer">Source Code</a>
                    <Link className="text-zinc-400 hover:text-zinc-100 transition-colors" to="/features">Features &amp; Tools</Link>
                </div>
                <div className="flex flex-col gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Project</span>
                    <Link className="text-zinc-400 hover:text-zinc-100 transition-colors" to="/about">About &amp; Credits</Link>
                    <Link className="text-zinc-400 hover:text-zinc-100 transition-colors" to="/contact">Contact</Link>
                </div>
                <div className="flex flex-col gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Legal</span>
                    <Link className="text-zinc-400 hover:text-zinc-100 transition-colors" to="/privacy">Privacy Policy</Link>
                    <Link className="text-zinc-400 hover:text-zinc-100 transition-colors" to="/terms">Terms of Service</Link>
                    <Link className="text-zinc-400 hover:text-zinc-100 transition-colors" to="/cookies">Cookie Policy</Link>
                </div>
            </div>
        </div>
        
        <div className="max-w-6xl w-full mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-400">
            <p>&copy; {new Date().getFullYear()} SEO Intelligence. MIT Licensed.</p>
            <p className="text-zinc-400">
                Developed by{' '}
                <a 
                    href="https://www.sixtyhours.tech/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-zinc-200 hover:text-white font-semibold underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-300 transition-colors"
                >
                    SixtyHours
                </a>
            </p>
            <p className="font-mono text-zinc-500">249 Rules &bull; Smart Playwright Engine &bull; v4.0</p>
        </div>
    </footer>
  );
}

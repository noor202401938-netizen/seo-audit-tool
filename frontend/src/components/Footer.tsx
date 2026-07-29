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
                    Automated technical SEO audit suite and public contact extraction engine. Designed for modern engineering and growth teams.
                </p>
                <div className="flex items-center gap-2 pt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-mono text-zinc-400">All Systems Operational</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-xs">
                <div className="flex flex-col gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Product</span>
                    <Link className="text-zinc-400 hover:text-zinc-100 transition-colors" to="/features">Features</Link>
                    <Link className="text-zinc-400 hover:text-zinc-100 transition-colors" to="/pricing">Pricing</Link>
                    <Link className="text-zinc-400 hover:text-zinc-100 transition-colors" to="/app">Dashboard</Link>
                </div>
                <div className="flex flex-col gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Company</span>
                    <Link className="text-zinc-400 hover:text-zinc-100 transition-colors" to="/about">About Us</Link>
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
            <p>&copy; {new Date().getFullYear()} SEO Intelligence. All rights reserved.</p>
            <p className="font-mono text-zinc-400">249 Rules &bull; Smart Playwright Fallback &bull; v4.0</p>
        </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-slate-200/80 dark:bg-slate-950/90 backdrop-blur-xl w-full py-stack-lg border-t-2 border-slate-300 dark:border-white/20 flex flex-col items-center gap-stack-md px-margin-mobile mt-auto">
        <div className="max-w-container-max w-full px-margin-desktop flex flex-col lg:flex-row justify-between gap-12 items-start">
        <div className="space-y-6 max-w-xs">
            <h2 className="font-display-lg text-headline-md tracking-tighter text-on-surface">SEOINTELLIGENCE</h2>
            <p className="font-body-sm text-body-sm text-slate-text">Providing high-performance, AI-driven search intelligence for the world's most ambitious brands.</p>
            <div className="flex gap-4">
                <Link className="text-slate-text hover:text-white transition-colors" to="/"><span className="material-symbols-outlined">share</span></Link>
                <Link className="text-slate-text hover:text-white transition-colors" to="/"><span className="material-symbols-outlined">public</span></Link>
                <Link className="text-slate-text hover:text-white transition-colors" to="/contact"><span className="material-symbols-outlined">mail</span></Link>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
                <h4 className="font-label-caps text-label-caps text-on-surface">Resources</h4>
                <div className="flex items-center gap-2">
                    <span className="font-body-sm text-body-sm text-slate-text opacity-70 cursor-not-allowed">Blog</span>
                    <span className="text-[10px] uppercase tracking-wider bg-electric-indigo/20 text-electric-indigo px-2 py-0.5 rounded-full font-bold">Upcoming</span>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <h4 className="font-label-caps text-label-caps text-on-surface">Legal</h4>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-white transition-colors" to="/privacy">Privacy Policy</Link>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-white transition-colors" to="/terms">Terms of Service</Link>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-white transition-colors" to="/cookies">Cookie Policy</Link>
            </div>
            <div className="flex flex-col gap-4">
                <h4 className="font-label-caps text-label-caps text-on-surface">Support</h4>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-white transition-colors" to="/about">About Us</Link>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-white transition-colors" to="/contact">Contact Us</Link>
            </div>
        </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 w-full text-center">
            <p className="font-body-sm text-body-sm text-slate-text">&copy; {new Date().getFullYear()} SEO Intelligence Command. All rights reserved.</p>
        </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-slate-100/60 dark:bg-slate-950/60 backdrop-blur-xl w-full py-stack-lg border-t border-slate-200 dark:border-white/10 flex flex-col items-center gap-stack-md px-margin-mobile mt-auto">
        <div className="max-w-container-max w-full px-margin-desktop flex flex-col lg:flex-row justify-between gap-12 items-start">
        <div className="space-y-6 max-w-xs">
            <h2 className="font-display-lg text-headline-md tracking-tighter text-on-surface">SEOINTELLIGENCE</h2>
            <p className="font-body-sm text-body-sm text-slate-text">Providing high-performance, AI-driven search intelligence for the world's most ambitious brands.</p>
            <div className="flex gap-4">
                <a className="text-slate-text hover:text-cyan-flare transition-colors" href="#"><span className="material-symbols-outlined">share</span></a>
                <a className="text-slate-text hover:text-cyan-flare transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
                <a className="text-slate-text hover:text-cyan-flare transition-colors" href="#"><span className="material-symbols-outlined">mail</span></a>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="flex flex-col gap-4">
                <h4 className="font-label-caps text-label-caps text-on-surface">Product</h4>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-cyan-flare transition-colors" to="/features">Site Audit</Link>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-cyan-flare transition-colors" to="/features">Keyword Explorer</Link>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-cyan-flare transition-colors" to="/features">AI Insights</Link>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-cyan-flare transition-colors" to="/features">Link Building</Link>
            </div>
            <div className="flex flex-col gap-4">
                <h4 className="font-label-caps text-label-caps text-on-surface">Resources</h4>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-cyan-flare transition-colors" to="/about">API Docs</Link>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-cyan-flare transition-colors" to="/about">Case Studies</Link>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-cyan-flare transition-colors" to="/about">SEO Guides</Link>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-cyan-flare transition-colors" to="/about">Blog</Link>
            </div>
            <div className="flex flex-col gap-4">
                <h4 className="font-label-caps text-label-caps text-on-surface">Legal</h4>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-cyan-flare transition-colors" to="/privacy">Privacy Policy</Link>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-cyan-flare transition-colors" to="/privacy">Terms of Service</Link>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-cyan-flare transition-colors" to="/cookies">Cookie Policy</Link>
            </div>
            <div className="flex flex-col gap-4">
                <h4 className="font-label-caps text-label-caps text-on-surface">Support</h4>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-cyan-flare transition-colors" to="/contact">Help Center</Link>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-cyan-flare transition-colors" to="/contact">Contact Us</Link>
                <Link className="font-body-sm text-body-sm text-slate-text hover:text-cyan-flare transition-colors" to="/contact">Status</Link>
            </div>
        </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 w-full text-center">
            <p className="font-body-sm text-body-sm text-slate-text">&copy; {new Date().getFullYear()} SEO Intelligence Command. All rights reserved.</p>
        </div>
    </footer>
  );
}

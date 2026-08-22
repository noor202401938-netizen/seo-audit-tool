import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLinkClass = (path: string) => {
    const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
    return isActive
      ? "px-3.5 py-1.5 rounded-full text-white bg-zinc-800 font-semibold text-xs tracking-wide transition-all border border-zinc-600 shadow-sm"
      : "px-3.5 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/60 font-medium text-xs tracking-wide transition-all";
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? 'pt-3 px-4' : 'pt-5 px-4 md:px-8'}`}>
      <header className={`w-full max-w-6xl backdrop-blur-xl border border-zinc-700 shadow-2xl flex justify-between items-center transition-all duration-300 rounded-full ${scrolled ? 'bg-zinc-950/95 py-2.5 px-6' : 'bg-zinc-950/80 py-3.5 px-7'}`}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-600 flex items-center justify-center relative shadow-sm">
             <span className="material-symbols-outlined text-white text-xs">tune</span>
             <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <Link to="/" className="font-bold text-sm tracking-tight text-white hover:text-emerald-400 transition-colors">
            SEO<span className="text-zinc-400 font-normal">INTELLIGENCE</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center bg-zinc-900 border border-zinc-700 rounded-full px-1.5 py-1 gap-1">
          <Link to="/" className={getLinkClass('/')}>Home</Link>
          <Link to="/features" className={getLinkClass('/features')}>Features</Link>
          <Link to="/about" className={getLinkClass('/about')}>About</Link>
          <Link to="/contact" className={getLinkClass('/contact')}>Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/app" className="text-xs text-white hover:text-emerald-400 font-semibold transition-colors">Dashboard</Link>
              <span className="text-[11px] font-mono bg-zinc-900 text-emerald-400 px-2.5 py-1 rounded-full font-bold border border-zinc-700">
                Community Edition
              </span>
              <button onClick={logout} className="text-zinc-300 hover:text-white px-3 py-1.5 rounded-full font-semibold text-xs transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a 
                href="https://github.com/noor202401938-netizen/seo-audit-tool" 
                target="_blank" 
                rel="noreferrer"
                className="bg-white text-black hover:bg-zinc-100 px-4 py-1.5 rounded-full font-bold text-xs transition-all border border-white shadow-md flex items-center gap-1.5"
              >
                <span>GitHub Repository</span>
                <span className="material-symbols-outlined text-xs">arrow_outward</span>
              </a>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

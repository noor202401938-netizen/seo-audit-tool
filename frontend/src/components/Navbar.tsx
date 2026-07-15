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
      ? "px-4 py-1.5 rounded-full text-white bg-white/10 font-medium text-sm transition-all shadow-sm"
      : "px-4 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm transition-all";
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${scrolled ? 'pt-4 px-4' : 'pt-6 px-4 md:px-8'}`}>
      <header className={`w-full max-w-7xl backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex justify-between items-center transition-all duration-500 rounded-full ${scrolled ? 'bg-slate-950/80 py-2 px-6' : 'bg-slate-950/40 py-3 px-8'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-indigo to-cyan-flare flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
             <span className="material-symbols-outlined text-white text-sm">search_insights</span>
          </div>
          <Link to="/" className="font-display-lg text-lg tracking-wide text-white drop-shadow-md">
            SEOINTELLIGENCE
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center bg-white/5 border border-white/5 rounded-full px-2 py-1 gap-1">
          <Link to="/" className={getLinkClass('/')}>Home</Link>
          <Link to="/features" className={getLinkClass('/features')}>Features</Link>
          <Link to="/pricing" className={getLinkClass('/pricing')}>Pricing</Link>
          <Link to="/contact" className={getLinkClass('/contact')}>Contact Us</Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/app" className="text-white hover:text-cyan-flare font-medium text-sm transition-colors">Dashboard</Link>
              <span className="text-xs bg-cyan-flare/20 px-2 py-1 rounded-full text-cyan-flare font-semibold border border-cyan-flare/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                {user.subscription.auditsRemaining} Audits Left
              </span>
              <button onClick={logout} className="text-slate-300 hover:text-white px-3 py-1.5 rounded-full font-medium text-sm hover:bg-white/10 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-slate-300 hover:text-white px-4 py-2 font-medium text-sm transition-colors">Login</Link>
              <Link to="/signup" className="bg-white text-slate-950 hover:bg-slate-200 px-5 py-2 rounded-full font-bold text-sm transition-colors shadow-lg">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

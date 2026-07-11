import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 backdrop-blur-2xl border-b border-solid border-slate-200 dark:border-white/10 shadow-2xl flex justify-between items-center px-8 md:px-12 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-slate-900/90 py-1 h-14' : 'bg-transparent hover:bg-white/5 dark:hover:bg-slate-900/5 h-16'}`}>
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-electric-indigo" style={{ fontSize: '28px' }}>menu</span>
        <Link to="/" className="font-display-lg text-headline-md tracking-tighter text-electric-indigo dark:text-primary">SEOINTELLIGENCE</Link>
      </div>
      <nav className="hidden md:flex gap-8 items-center">
        <Link to="/" className="text-electric-indigo font-bold hover:text-cyan-flare transition-colors font-body-md text-body-md">Home</Link>
        <Link to="/features" className="text-slate-text hover:text-cyan-flare transition-colors font-body-md text-body-md">Features</Link>
        <Link to="/pricing" className="text-slate-text hover:text-cyan-flare transition-colors font-body-md text-body-md">Pricing</Link>
        <Link to="/contact" className="text-slate-text hover:text-cyan-flare transition-colors font-body-md text-body-md">Contact Us</Link>
      </nav>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/app" className="text-slate-text hover:text-cyan-flare font-bold transition-colors">Dashboard</Link>
            <span className="text-sm bg-primary/10 px-3 py-1 rounded-full text-primary font-bold">
              {user.subscription.auditsRemaining} Audits Left
            </span>
            <button onClick={logout} className="border border-solid border-slate-200 dark:border-white/10 premium-card text-on-surface px-4 py-1.5 rounded-full font-body-sm text-body-sm hover:bg-white/5 transition-colors">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-text hover:text-cyan-flare font-bold transition-colors">Login</Link>
            <Link to="/signup">
                <button className="bg-gradient-to-r from-electric-indigo to-vibrant-violet text-white px-6 py-2 rounded-full font-body-md text-body-md active:scale-95 transition-transform">
                    Get Started
                </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

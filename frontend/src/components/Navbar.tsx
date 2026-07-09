import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 h-20 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <Link to="/" className="text-2xl font-black text-primary tracking-tight">SEO Auditor</Link>
      <div className="flex items-center space-x-6">
        <Link to="/features" className="text-muted-foreground hover:text-foreground font-semibold transition-colors">Features</Link>
        <Link to="/pricing" className="text-muted-foreground hover:text-foreground font-semibold transition-colors">Pricing</Link>
        <Link to="/contact" className="text-muted-foreground hover:text-foreground font-semibold transition-colors">Contact Us</Link>
        <div className="h-6 w-px bg-border mx-2" />
        <ModeToggle />
        {user ? (
          <div className="flex items-center space-x-4 ml-4">
            <Link to="/app" className="text-foreground hover:text-primary font-bold transition-colors">Dashboard</Link>
            <span className="text-sm bg-primary/10 px-3 py-1 rounded-full text-primary font-bold">
              {user.subscription.auditsRemaining} Audits Left
            </span>
            <Button variant="outline" className="font-bold border-border" onClick={logout}>Logout</Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4 ml-4">
            <Link to="/login"><Button variant="ghost" className="font-bold">Login</Button></Link>
            <Link to="/signup"><Button className="font-bold">Sign up</Button></Link>
          </div>
        )}
      </div>
    </nav>
  );
}

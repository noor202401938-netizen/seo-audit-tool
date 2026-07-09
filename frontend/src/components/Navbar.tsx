import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between p-6 bg-white border-b border-slate-200">
      <Link to="/" className="text-xl font-bold text-indigo-600">SEO Auditor</Link>
      <div className="flex items-center space-x-6">
        <Link to="/features" className="text-slate-600 hover:text-indigo-600 font-medium">Features</Link>
        <Link to="/pricing" className="text-slate-600 hover:text-indigo-600 font-medium">Pricing</Link>
        <Link to="/contact" className="text-slate-600 hover:text-indigo-600 font-medium">Contact Us</Link>
        {user ? (
          <div className="flex items-center space-x-4">
            <Link to="/app" className="text-slate-600 hover:text-indigo-600 font-medium">Dashboard</Link>
            <span className="text-sm bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-medium">
              {user.subscription.auditsRemaining} Audits Left
            </span>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login"><Button variant="ghost">Login</Button></Link>
            <Link to="/signup"><Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Sign up</Button></Link>
          </div>
        )}
      </div>
    </nav>
  );
}

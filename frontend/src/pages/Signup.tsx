import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      if (!res.ok) throw new Error('Registration failed');
      const data = await res.json();
      login(data.access_token);
      navigate('/app');
    } catch (err) {
      setError('Failed to register. Email might be in use.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-32 glass-card p-10 rounded-2xl shadow-2xl relative z-10 border border-white/10 dark:border-white/10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display-lg tracking-tight font-bold text-on-surface mb-2">Initialize Profile</h2>
        <p className="text-slate-text">Join the future of SEO intelligence.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
           <label className="text-sm font-medium text-slate-text">Full Name</label>
           <Input className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-on-surface placeholder:text-slate-text/50 h-11" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
           <label className="text-sm font-medium text-slate-text">Email</label>
           <Input className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-on-surface placeholder:text-slate-text/50 h-11" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
           <label className="text-sm font-medium text-slate-text">Password</label>
           <Input className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-on-surface placeholder:text-slate-text/50 h-11" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-error text-sm">{error}</p>}
        <Button className="w-full h-12 bg-electric-indigo hover:bg-electric-indigo/90 text-white font-medium shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 btn-shimmer-hover" type="submit">Create Account</Button>
      </form>
      <p className="text-center mt-8 text-slate-text text-sm">Already initialized? <Link to="/login" className="text-electric-indigo hover:text-cyan-flare transition-colors font-medium">Access Command Center</Link></p>
    </div>
  );
}

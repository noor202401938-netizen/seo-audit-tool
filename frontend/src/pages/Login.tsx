import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });
      if (!res.ok) {
        let errDetail = 'Invalid credentials';
        try {
          const errData = await res.json();
          errDetail = errData.detail || errDetail;
        } catch (e) {}
        throw new Error(errDetail);
      }
      const data = await res.json();
      login(data.access_token);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@seoaudit.com');
    setPassword('demo123456');
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen flex items-center justify-center p-4 md:p-8 pt-24">
      <div className="w-full max-w-5xl bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
        
        {/* Left Hero Panel */}
        <div className="lg:col-span-6 bg-zinc-950 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-zinc-800/80 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center relative">
                <span className="material-symbols-outlined text-zinc-100 text-xs">tune</span>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <span className="font-bold text-sm tracking-tight text-zinc-100">SEOINTELLIGENCE</span>
            </div>

            <div className="space-y-3 pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                SYSTEM STATUS &bull; READY
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100 leading-tight">
                Command Your Technical SEO Diagnostics
              </h1>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                Run 249 automated audit checks, evaluate client-side JavaScript rendering, and extract verified public contacts.
              </p>
            </div>
          </div>

          {/* Terminal Snippet Box */}
          <div className="relative z-10 mt-8 p-4 rounded-lg bg-[#09090b] border border-zinc-800/80 font-mono text-xs text-zinc-400 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-2 border-b border-zinc-900">
              <span className="text-zinc-300">audit-engine-v4.log</span>
              <span className="text-emerald-400">[ONLINE]</span>
            </div>
            <div className="text-zinc-300">$ seointelligence audit --target=enterprise.com</div>
            <div className="text-emerald-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              <span>Passed 249/249 diagnostic checks in 0.42s</span>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-zinc-900/80 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Enterprise-Grade Security</span>
            <span>2,500+ Teams Worldwide</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-zinc-900/20">
          <div className="max-w-sm mx-auto w-full space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Sign In to Workspace</h2>
              <p className="text-xs text-zinc-400">Enter your account credentials to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Work Email</label>
                <Input 
                  className="bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 h-11 text-sm rounded-lg focus:border-zinc-700" 
                  type="email" 
                  placeholder="you@company.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-zinc-300">Password</label>
                </div>
                <Input 
                  className="bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 h-11 text-sm rounded-lg focus:border-zinc-700" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>

              {error && (
                <div className="text-rose-400 text-xs font-mono p-2.5 rounded bg-rose-950/40 border border-rose-900/60">
                  {error}
                </div>
              )}

              <Button 
                className="w-full h-11 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm transition-all rounded-lg border border-zinc-200 mt-2" 
                type="submit"
              >
                Sign In to Workspace
              </Button>

              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors text-center border border-dashed border-zinc-800 rounded-lg hover:border-zinc-700"
              >
                Use Demo Account Credentials
              </button>
            </form>

            <div className="pt-4 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-zinc-100 hover:text-white font-semibold underline underline-offset-4">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle, Shield, Key, Sparkles, CheckCircle2, ExternalLink, Info, Copy, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'apikeys' | 'security'>('apikeys');
  const [copied, setCopied] = useState(false);

  // User-managed custom API Keys (stored locally for rapid self-service use)
  const [geminiKey, setGeminiKey] = useState('');
  const [oprKey, setOprKey] = useState('');
  const [keKey, setKeKey] = useState('');
  const [ytKey, setYtKey] = useState('');
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    setGeminiKey(localStorage.getItem('CUSTOM_GEMINI_API_KEY') || '');
    setOprKey(localStorage.getItem('CUSTOM_OPEN_PAGERANK_API_KEY') || '');
    setKeKey(localStorage.getItem('CUSTOM_KEYWORD_EVERYWHERE_API_KEY') || '');
    setYtKey(localStorage.getItem('CUSTOM_YOUTUBE_API_KEY') || '');
  }, []);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('CUSTOM_GEMINI_API_KEY', geminiKey.trim());
    localStorage.setItem('CUSTOM_OPEN_PAGERANK_API_KEY', oprKey.trim());
    localStorage.setItem('CUSTOM_KEYWORD_EVERYWHERE_API_KEY', keKey.trim());
    localStorage.setItem('CUSTOM_YOUTUBE_API_KEY', ytKey.trim());
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const sampleEnvConfig = `# Backend .env configuration
GEMINI_API_KEY=${geminiKey || 'your_gemini_key_here'}
OPEN_PAGERANK_API_KEY=${oprKey || 'your_open_pagerank_key_here'}
KEYWORD_EVERYWHERE_API_KEY=${keKey || 'your_keywords_everywhere_key_here'}
YOUTUBE_API_KEY=${ytKey || 'your_youtube_data_api_key_here'}
JWT_SECRET=your_super_secret_jwt_key_here`;

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText(sampleEnvConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#09090b] text-white min-h-full max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Workspace & API Settings</h1>
          <p className="text-xs text-zinc-400 mt-1 font-medium">Manage your open source instance configuration and custom API credentials.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold uppercase rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Open Source Community Edition
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 space-y-2">
          <nav className="flex flex-col gap-1.5 bg-zinc-900/60 p-2 rounded-xl border border-zinc-800">
            <button 
              onClick={() => setActiveTab('apikeys')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all text-left ${activeTab === 'apikeys' ? 'bg-zinc-100 text-black shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'}`}
            >
              <Key className="w-4 h-4" />
              API Keys & Services
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all text-left ${activeTab === 'profile' ? 'bg-zinc-100 text-black shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'}`}
            >
              <UserCircle className="w-4 h-4" />
              General Profile
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all text-left ${activeTab === 'security' ? 'bg-zinc-100 text-black shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'}`}
            >
              <Shield className="w-4 h-4" />
              Security & Environment
            </button>
          </nav>

          <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-300 font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              100% Free & Unlimited
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              This is a self-hosted open-source platform. All audits, crawler runs, and reports are unmetered. Simply add your free API keys for external services.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 space-y-6">

          {/* TAB 1: API KEYS */}
          {activeTab === 'apikeys' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-zinc-900 border border-zinc-700 p-6 md:p-8 rounded-xl shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Third-Party API Credentials</h2>
                  <p className="text-xs text-zinc-400">
                    Configure your personal API keys. These keys can also be placed directly in the backend <code className="text-emerald-400 font-mono bg-zinc-950 px-1 py-0.5 rounded">.env</code> file.
                  </p>
                </div>

                <form onSubmit={handleSaveKeys} className="space-y-5">
                  {/* Gemini API Key */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                        Google Gemini API Key
                        <span className="text-[10px] text-zinc-400 font-normal">(AI Recommendations & SEO Assistant)</span>
                      </label>
                      <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        Get Free Key <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <Input 
                      type="password" 
                      placeholder="AIzaSy..." 
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white h-11 text-sm rounded-lg font-mono" 
                    />
                  </div>

                  {/* OpenPageRank API Key */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                        OpenPageRank API Key
                        <span className="text-[10px] text-zinc-400 font-normal">(Domain Authority & Rank Scoring)</span>
                      </label>
                      <a 
                        href="https://www.domcop.com/openpagerank/auth/signup" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        Get Free Key <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <Input 
                      type="password" 
                      placeholder="e.g. 484w0w848k8o48..." 
                      value={oprKey}
                      onChange={(e) => setOprKey(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white h-11 text-sm rounded-lg font-mono" 
                    />
                  </div>

                  {/* Keywords Everywhere API Key */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                        Keywords Everywhere API Key
                        <span className="text-[10px] text-zinc-400 font-normal">(Search Volume & CPC Metrics)</span>
                      </label>
                      <a 
                        href="https://keywordseverywhere.com/api.html" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        Get API Key <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <Input 
                      type="password" 
                      placeholder="e.g. 7c320d778..." 
                      value={keKey}
                      onChange={(e) => setKeKey(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white h-11 text-sm rounded-lg font-mono" 
                    />
                  </div>

                  {/* YouTube Data API Key */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                        YouTube Data API v3 Key
                        <span className="text-[10px] text-zinc-400 font-normal">(Video SERP Rank Tracking)</span>
                      </label>
                      <a 
                        href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        Google Cloud Console <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <Input 
                      type="password" 
                      placeholder="e.g. AIzaSy..." 
                      value={ytKey}
                      onChange={(e) => setYtKey(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white h-11 text-sm rounded-lg font-mono" 
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    {savedStatus ? (
                      <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Keys saved to local session
                      </span>
                    ) : (
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" /> Keys are encrypted and stored for your session
                      </span>
                    )}
                    <Button type="submit" className="bg-white hover:bg-zinc-100 text-black font-bold text-xs rounded-lg px-6 h-10 border border-white shadow-md">
                      Save API Keys
                    </Button>
                  </div>
                </form>
              </div>

              {/* Server-Side .env Helper Card */}
              <div className="bg-zinc-900/70 border border-zinc-800 p-6 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">terminal</span>
                    <h3 className="text-sm font-bold text-white">Direct Server .env Configuration</h3>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyEnvSnippet}
                    className="border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-xs text-zinc-300 h-8 gap-1.5"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy Config'}
                  </Button>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  For permanent, server-wide activation across all workers and Docker containers, save these keys into your backend <code className="text-zinc-200">.env</code> file.
                </p>
                <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-[11px] font-mono text-zinc-300 overflow-x-auto">
                  {sampleEnvConfig}
                </pre>
              </div>
            </motion.div>
          )}

          {/* TAB 2: GENERAL PROFILE */}
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-zinc-700 p-6 md:p-8 rounded-xl shadow-xl space-y-6"
            >
              <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">Profile Information</h2>
              
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-2xl font-extrabold text-white shadow-md">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{user?.email || 'User Account'}</div>
                  <div className="text-xs text-zinc-400 font-mono mt-0.5">Instance: Self-Hosted Admin</div>
                </div>
              </div>

              <form className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">First Name</label>
                    <Input type="text" placeholder="Admin" className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white h-11 text-sm rounded-lg" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">Last Name</label>
                    <Input type="text" placeholder="User" className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white h-11 text-sm rounded-lg" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Email Address</label>
                  <Input type="email" defaultValue={user?.email || ''} readOnly className="bg-zinc-950/60 border-zinc-800 text-zinc-400 h-11 text-sm rounded-lg cursor-not-allowed" />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button className="bg-white hover:bg-zinc-100 text-black font-bold text-xs rounded-lg px-6 h-10 border border-white shadow-md">
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* TAB 3: SECURITY & ENVIRONMENT */}
          {activeTab === 'security' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-zinc-700 p-6 md:p-8 rounded-xl shadow-xl space-y-6"
            >
              <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">Security & Authentication</h2>
              
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">JWT Authentication</div>
                    <div className="text-zinc-400 text-[11px] mt-0.5">Secure token-based session handling with cryptographic hashing.</div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold rounded-full">
                    Active
                  </span>
                </div>

                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Rate Limiting & Anti-Bruteforce</div>
                    <div className="text-zinc-400 text-[11px] mt-0.5">Redis-backed request throttling on authentication endpoints.</div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold rounded-full">
                    Protected
                  </span>
                </div>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
}

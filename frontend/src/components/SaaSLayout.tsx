import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  Search,
  Activity,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TOOL_CATEGORIES } from '../data/tools';

export const SaaSLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([TOOL_CATEGORIES[0].title]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const matchingTools = searchQuery.trim() === '' 
    ? [] 
    : TOOL_CATEGORIES.flatMap(cat => cat.tools)
        .filter(tool => tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || tool.desc.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5);

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800">
          <Link to="/app" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center relative">
              <Activity className="w-4 h-4 text-zinc-100" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <span className="font-bold text-base text-zinc-100 tracking-tight">SeoIntelligence</span>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-5 px-3.5 custom-scrollbar">
          <div className="space-y-4">
            {TOOL_CATEGORIES.map((category, idx) => {
              const isExpanded = expandedCategories.includes(category.title);
              
              return (
                <div key={idx} className="space-y-1">
                  <button 
                    onClick={() => toggleCategory(category.title)}
                    className={`flex items-center justify-between w-full px-3 py-2 mb-1 rounded-md text-[11px] font-mono font-semibold uppercase tracking-wider transition-all ${
                      isExpanded 
                        ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' 
                        : 'bg-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
                    }`}
                  >
                    <span className="truncate text-left">{category.title}</span>
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-1"
                      >
                        {category.tools.map((tool, tIdx) => {
                          const slug = generateSlug(tool.name);
                          const path = `/app/tools/${slug}`;
                          const isActive = location.pathname === path;
                          
                          return (
                            <Link 
                              key={tIdx} 
                              to={path}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`group flex items-center justify-between px-3.5 py-2 rounded-md text-xs transition-all ${
                                isActive 
                                  ? 'bg-zinc-800 text-white font-medium border border-zinc-700' 
                                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                              }`}
                            >
                              <span className="truncate pr-2">{tool.name}</span>
                              <div className="flex items-center gap-1 shrink-0">
                                {tool.apiKeyRequired && (
                                  <span className="text-[9px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/80">API</span>
                                )}
                                {tool.apiKeyOptional && (
                                  <span className="text-[9px] font-mono text-sky-400 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-800/60">BYOK</span>
                                )}
                                {tool.upcoming && (
                                  <span className="text-[9px] font-mono uppercase bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-800">Soon</span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3.5 border-t border-zinc-800">
          <Link 
            to="/profile"
            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-all"
          >
            <UserCircle className="w-4 h-4" />
            <span className="font-medium">Settings & API Keys</span>
          </Link>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative z-10">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-zinc-950/60 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-30">
          <div className="flex items-center gap-4 relative flex-1 max-w-xl">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex flex-col relative w-full z-40">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-lg focus-within:border-zinc-700 transition-all">
                <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search tools or audit rules..." 
                  className="bg-transparent border-none outline-none text-xs text-zinc-100 w-full placeholder:text-zinc-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                />
              </div>
              
              <AnimatePresence>
                {isSearchFocused && searchQuery.trim() !== '' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden"
                  >
                    {matchingTools.length > 0 ? (
                      <div className="py-1">
                        {matchingTools.map((tool, idx) => (
                          <Link
                            key={idx}
                            to={`/app/tools/${generateSlug(tool.name)}`}
                            className="block px-4 py-2.5 hover:bg-zinc-800/80 transition-colors"
                            onClick={() => setSearchQuery('')}
                          >
                            <div className="text-xs font-semibold text-zinc-100">{tool.name}</div>
                            <div className="text-[11px] text-zinc-400 truncate mt-0.5">{tool.desc}</div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-4 text-xs text-zinc-500 text-center">No tools found for "{searchQuery}"</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/profile" className="flex items-center gap-2.5 hover:bg-zinc-900 p-1.5 rounded-lg transition-colors cursor-pointer">
              <div className="text-right">
                <p className="text-xs font-medium text-zinc-200">Local Instance</p>
                <p className="text-[10px] font-mono text-emerald-400 font-bold">Unlimited Audits</p>
              </div>
              <UserCircle className="w-7 h-7 text-zinc-400" />
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

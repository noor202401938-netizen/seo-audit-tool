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
    <div className="flex h-screen bg-black overflow-hidden font-sans">
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

      {/* Sidebar (Dark Theme) */}
      <motion.aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <Link to="/app" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-8 h-8 rounded bg-gradient-to-br from-electric-indigo to-cyan-flare flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">SeoIntelligence<span className="text-electric-indigo">.</span></span>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">


          <div className="space-y-6">
            {TOOL_CATEGORIES.map((category, idx) => {
              const isExpanded = expandedCategories.includes(category.title);
              
              return (
                <div key={idx} className="space-y-1">
                  <button 
                    onClick={() => toggleCategory(category.title)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 mb-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      isExpanded 
                        ? 'bg-slate-900 text-electric-indigo border border-white/10 shadow-sm' 
                        : 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <span className="truncate text-left">{category.title}</span>
                    {isExpanded ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
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
                              className={`group flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all ${
                                isActive 
                                  ? 'bg-electric-indigo/20 text-white border border-electric-indigo/30' 
                                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <span className="truncate pr-2">{tool.name}</span>
                              {tool.upcoming && (
                                <span className="text-[9px] uppercase tracking-wider bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Soon</span>
                              )}
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

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-400 hover:text-error hover:bg-error/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0f] relative z-10">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-slate-950/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
          <div className="flex items-center gap-4 relative flex-1 max-w-xl">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg shrink-0"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex flex-col relative w-full z-40">
              <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-full focus-within:border-electric-indigo/50 focus-within:ring-1 focus-within:ring-electric-indigo/50 transition-all">
                <Search className="w-4 h-4 text-slate-500 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search tools, projects, or keywords..." 
                  className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                />
              </div>
              
              <AnimatePresence>
                {isSearchFocused && searchQuery.trim() !== '' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full mt-2 w-full bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden glass-card"
                  >
                    {matchingTools.length > 0 ? (
                      <div className="py-2">
                        {matchingTools.map((tool, idx) => (
                          <Link
                            key={idx}
                            to={`/app/tools/${generateSlug(tool.name)}`}
                            className="block px-4 py-3 hover:bg-white/5 transition-colors"
                            onClick={() => setSearchQuery('')}
                          >
                            <div className="text-sm font-semibold text-white">{tool.name}</div>
                            <div className="text-xs text-slate-400 truncate mt-0.5">{tool.desc}</div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-sm text-slate-500 text-center">No tools found for "{searchQuery}"</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/app/profile" className="hidden sm:flex items-center gap-3 hover:bg-white/5 p-2 rounded-xl transition-colors cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.email}</p>
                <p className="text-xs text-electric-indigo">Pro Plan</p>
              </div>
              <UserCircle className="w-8 h-8 text-slate-400 hover:text-white transition-colors" />
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

import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Settings, 
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
          <div className="mb-8">
            <Link 
              to="/app" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === '/app' 
                  ? 'bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard Overview</span>
            </Link>
          </div>

          <div className="space-y-6">
            {TOOL_CATEGORIES.map((category, idx) => {
              const isExpanded = expandedCategories.includes(category.title);
              
              return (
                <div key={idx} className="space-y-1">
                  <button 
                    onClick={() => toggleCategory(category.title)}
                    className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
                  >
                    {category.title}
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-full w-96 focus-within:border-electric-indigo/50 focus-within:ring-1 focus-within:ring-electric-indigo/50 transition-all">
              <Search className="w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search tools, projects, or keywords..." 
                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-600"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-white/10">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.email}</p>
                <p className="text-xs text-electric-indigo">Pro Plan</p>
              </div>
              <UserCircle className="w-8 h-8 text-slate-400" />
            </div>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

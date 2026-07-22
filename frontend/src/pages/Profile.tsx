import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle, Shield, CreditCard, Bell, Key } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Account Settings</h1>
        <p className="text-slate-400 mt-1">Manage your profile, billing, and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <nav className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20 font-medium">
              <UserCircle className="w-5 h-5" />
              General Profile
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors font-medium">
              <Shield className="w-5 h-5" />
              Security
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors font-medium">
              <CreditCard className="w-5 h-5" />
              Billing & Plan
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors font-medium">
              <Bell className="w-5 h-5" />
              Notifications
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors font-medium">
              <Key className="w-5 h-5" />
              API Keys
            </button>
          </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-slate-950/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-electric-indigo/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            
            <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-electric-indigo to-cyan-flare flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
                  Upload Avatar
                </button>
              </div>
            </div>

            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">First Name</label>
                  <Input type="text" placeholder="John" className="bg-black/50 border-white/10 focus-visible:ring-electric-indigo text-white h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Last Name</label>
                  <Input type="text" placeholder="Doe" className="bg-black/50 border-white/10 focus-visible:ring-electric-indigo text-white h-11" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <Input type="email" defaultValue={user?.email || ''} readOnly className="bg-black/50 border-white/10 text-slate-400 h-11 opacity-70" />
                <p className="text-xs text-slate-500">Your email address is managed by your authentication provider.</p>
              </div>

              <div className="pt-4 flex justify-end">
                <Button className="bg-electric-indigo hover:bg-electric-indigo/90 text-white font-medium btn-shimmer-hover rounded-xl px-6 h-11">
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-slate-950/50"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Current Plan</h2>
                <p className="text-slate-400 text-sm">You are currently on the <strong className="text-electric-indigo">Pro Plan</strong>.</p>
              </div>
              <div className="px-3 py-1 bg-electric-indigo/20 text-electric-indigo text-xs font-bold uppercase tracking-wider rounded-md border border-electric-indigo/30">
                Active
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-300">Audits remaining this month</div>
                <div className="text-2xl font-bold text-white mt-1">Unlimited</div>
              </div>
              <Button variant="outline" className="border-white/10 hover:bg-white/10 text-white rounded-lg">
                Manage Billing
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

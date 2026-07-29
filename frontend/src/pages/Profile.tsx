import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle, Shield, CreditCard, Bell, Key } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'billing' | 'notifications' | 'apikeys'>('profile');

  return (
    <div className="bg-[#09090b] text-white min-h-full max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      <div className="border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Account Settings</h1>
        <p className="text-xs text-zinc-400 mt-1 font-medium">Manage your workspace settings, subscription plans, and API credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 space-y-2">
          <nav className="flex flex-col gap-1.5 bg-zinc-900/60 p-2 rounded-xl border border-zinc-800">
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
              Security & Auth
            </button>
            <button 
              onClick={() => setActiveTab('billing')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all text-left ${activeTab === 'billing' ? 'bg-zinc-100 text-black shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'}`}
            >
              <CreditCard className="w-4 h-4" />
              Billing & Plan
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all text-left ${activeTab === 'notifications' ? 'bg-zinc-100 text-black shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'}`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button 
              onClick={() => setActiveTab('apikeys')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all text-left ${activeTab === 'apikeys' ? 'bg-zinc-100 text-black shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'}`}
            >
              <Key className="w-4 h-4" />
              API Keys
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 space-y-6">
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
                <div className="text-xs text-zinc-400 font-mono mt-0.5">Role: Workspace Administrator</div>
              </div>
            </div>

            <form className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">First Name</label>
                  <Input type="text" placeholder="John" className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white h-11 text-sm rounded-lg" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Last Name</label>
                  <Input type="text" placeholder="Doe" className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white h-11 text-sm rounded-lg" />
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
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900 border border-zinc-700 p-6 md:p-8 rounded-xl shadow-xl space-y-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Subscription Plan</h2>
                <p className="text-xs text-zinc-400">Manage your billing cycle and audit allowances.</p>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-700 text-xs font-mono font-bold uppercase rounded-full">
                {user?.subscription?.plan || 'PRO TIER'}
              </span>
            </div>
            
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between font-mono text-xs">
              <div>
                <div className="text-zinc-400">Audits Remaining This Month</div>
                <div className="text-xl font-extrabold text-white mt-1">
                  {user?.subscription?.auditsRemaining ?? 200} Audits
                </div>
              </div>
              <Button variant="outline" className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-lg px-4 h-9">
                Manage Subscription
              </Button>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

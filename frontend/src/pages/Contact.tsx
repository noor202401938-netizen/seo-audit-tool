import { Input } from '../components/ui/input';
import { useForm, ValidationError } from '@formspree/react';

export default function Contact() {
  const [state, handleSubmit] = useForm('mdarrwgd');
  return (
    <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto relative z-10 flex flex-col gap-stack-lg">
      
      <div className="text-center space-y-6 mt-12 mb-12">
        <div className="inline-block bg-vibrant-violet/10 border border-vibrant-violet/20 px-4 py-1.5 rounded-full">
            <span className="text-vibrant-violet font-label-caps uppercase tracking-wider text-sm">Dedicated Support</span>
        </div>
        <h2 className="text-display-lg font-display-lg tracking-tighter text-on-surface leading-tight">
          Initialize <span className="bg-gradient-to-r from-electric-indigo to-cyan-flare text-transparent bg-clip-text">Contact Protocol</span>
        </h2>
        <p className="text-body-lg text-slate-text max-w-2xl mx-auto leading-relaxed">
          Need a custom extraction script or dedicated proxy pool? Transmit a secure message to our engineering team.
        </p>
      </div>

      <div className="glass-card rounded-[2.5rem] p-10 md:p-14 border border-white/10 dark:border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.05)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-electric-indigo/5 to-cyan-flare/5 z-0"></div>
        <div className="relative z-10">
            {state.succeeded ? (
            <div className="text-center py-16">
                <div className="mx-auto w-20 h-20 bg-electric-indigo/20 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-electric-indigo text-4xl">check_circle</span>
                </div>
                <h3 className="text-headline-md font-display-lg font-bold text-on-surface mb-4">Transmission Received</h3>
                <p className="text-slate-text text-body-lg">
                Your message has been securely routed. Our engineers will respond shortly.
                </p>
            </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label htmlFor="name" className="text-sm font-label-caps uppercase tracking-widest text-slate-text">Operative Name</label>
                    <Input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required 
                        className="bg-slate-900/40 border-white/10 text-on-surface focus:border-electric-indigo focus:ring-electric-indigo/50 h-14 rounded-2xl" 
                    />
                    <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-sm" />
                </div>
                <div className="space-y-3">
                    <label htmlFor="email" className="text-sm font-label-caps uppercase tracking-widest text-slate-text">Secure Email</label>
                    <Input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        className="bg-slate-900/40 border-white/10 text-on-surface focus:border-cyan-flare focus:ring-cyan-flare/50 h-14 rounded-2xl"
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-sm" />
                </div>
            </div>
            <div className="space-y-3">
                <label htmlFor="subject" className="text-sm font-label-caps uppercase tracking-widest text-slate-text">Subject Directive</label>
                <Input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    required 
                    className="bg-slate-900/40 border-white/10 text-on-surface focus:border-vibrant-violet focus:ring-vibrant-violet/50 h-14 rounded-2xl"
                />
                <ValidationError prefix="Subject" field="subject" errors={state.errors} className="text-red-400 text-sm" />
            </div>
            <div className="space-y-3">
                <label htmlFor="message" className="text-sm font-label-caps uppercase tracking-widest text-slate-text">Message Payload</label>
                <textarea 
                id="message" 
                name="message" 
                required 
                rows={6}
                className="w-full rounded-2xl bg-slate-900/40 border border-white/10 text-on-surface p-5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-indigo/50 focus-visible:border-electric-indigo transition-all resize-none"
                ></textarea>
                <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-sm" />
            </div>
            <button 
                type="submit" 
                disabled={state.submitting} 
                className="w-full bg-gradient-to-r from-electric-indigo to-cyan-flare text-white font-bold py-5 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:brightness-110 transition-all btn-shimmer-hover font-body-lg uppercase tracking-widest mt-4"
            >
                {state.submitting ? 'Transmitting...' : 'Transmit Payload'}
            </button>
            </form>
            )}
        </div>
      </div>
    </div>
  );
}

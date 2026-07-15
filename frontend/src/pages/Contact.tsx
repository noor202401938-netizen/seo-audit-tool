import { Input } from '../components/ui/input';
import { useForm, ValidationError } from '@formspree/react';
import { Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';

export default function Contact() {
  const [state, handleSubmit] = useForm('mdarrwgd');

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto relative z-10">
      
      <div className="text-center space-y-6 mt-12 mb-16">
        <div className="inline-flex items-center gap-2 bg-vibrant-violet/10 border border-vibrant-violet/20 px-4 py-1.5 rounded-full">
            <MessageSquare className="w-4 h-4 text-vibrant-violet" />
            <span className="text-vibrant-violet font-label-caps uppercase tracking-wider text-sm">Get in Touch</span>
        </div>
        <h2 className="text-display-lg font-display-lg tracking-tighter text-on-surface leading-tight">
          Initialize <span className="bg-gradient-to-r from-electric-indigo to-cyan-flare text-transparent bg-clip-text">Contact Protocol</span>
        </h2>
        <p className="text-body-lg text-slate-text max-w-2xl mx-auto leading-relaxed">
          Need a custom extraction script or dedicated proxy pool? Transmit a secure message to our engineering team.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        {/* Contact Info Column */}
        <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.03)] h-full">
                <h3 className="text-2xl font-bold text-on-surface mb-6">Direct Channels</h3>
                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-electric-indigo/10 flex items-center justify-center shrink-0 border border-electric-indigo/20 text-electric-indigo">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-label-caps uppercase tracking-widest text-slate-text mb-1">Secure Comm</p>
                            <a href="mailto:support@seoaudit.com" className="text-lg text-on-surface hover:text-electric-indigo transition-colors font-medium">
                                support@seoaudit.com
                            </a>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-flare/10 flex items-center justify-center shrink-0 border border-cyan-flare/20 text-cyan-flare">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-label-caps uppercase tracking-widest text-slate-text mb-1">Encrypted Line</p>
                            <a href="tel:+18005550199" className="text-lg text-on-surface hover:text-cyan-flare transition-colors font-medium">
                                +1 (800) 555-0199
                            </a>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-vibrant-violet/10 flex items-center justify-center shrink-0 border border-vibrant-violet/20 text-vibrant-violet">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-label-caps uppercase tracking-widest text-slate-text mb-1">HQ Coordinates</p>
                            <p className="text-lg text-on-surface font-medium leading-relaxed">
                                404 Cybernetics Blvd<br/>
                                Sector 7, Neon City, 2049
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-3 glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.05)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-electric-indigo/5 to-cyan-flare/5 z-0 pointer-events-none"></div>
            <div className="relative z-10">
                {state.succeeded ? (
                <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                    <div className="mx-auto w-24 h-24 bg-electric-indigo/20 rounded-full flex items-center justify-center mb-8 border border-electric-indigo/30 relative">
                        <div className="absolute inset-0 rounded-full animate-ping bg-electric-indigo/20 opacity-75"></div>
                        <span className="material-symbols-outlined text-electric-indigo text-5xl">check_circle</span>
                    </div>
                    <h3 className="text-headline-md font-display-lg font-bold text-on-surface mb-4">Transmission Received</h3>
                    <p className="text-slate-text text-body-lg max-w-md mx-auto">
                    Your message has been securely routed. Our engineering team will decrypt and respond shortly.
                    </p>
                </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                            <label htmlFor="name" className="text-xs font-label-caps uppercase tracking-widest text-slate-text ml-1">Operative Name</label>
                            <Input 
                                type="text" 
                                id="name" 
                                name="name" 
                                required 
                                placeholder="John Doe"
                                className="bg-slate-900/40 border-white/10 text-on-surface focus:border-electric-indigo focus:ring-electric-indigo/50 h-14 rounded-2xl px-5 text-base" 
                            />
                            <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-sm" />
                        </div>
                        <div className="space-y-2.5">
                            <label htmlFor="email" className="text-xs font-label-caps uppercase tracking-widest text-slate-text ml-1">Secure Email</label>
                            <Input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required 
                                placeholder="john@example.com"
                                className="bg-slate-900/40 border-white/10 text-on-surface focus:border-cyan-flare focus:ring-cyan-flare/50 h-14 rounded-2xl px-5 text-base"
                            />
                            <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-sm" />
                        </div>
                    </div>
                    
                    <div className="space-y-2.5">
                        <label htmlFor="subject" className="text-xs font-label-caps uppercase tracking-widest text-slate-text ml-1">Subject Directive</label>
                        <Input 
                            type="text" 
                            id="subject" 
                            name="subject" 
                            required 
                            placeholder="How can we help you?"
                            className="bg-slate-900/40 border-white/10 text-on-surface focus:border-vibrant-violet focus:ring-vibrant-violet/50 h-14 rounded-2xl px-5 text-base"
                        />
                        <ValidationError prefix="Subject" field="subject" errors={state.errors} className="text-red-400 text-sm" />
                    </div>

                    <div className="space-y-2.5">
                        <label htmlFor="message" className="text-xs font-label-caps uppercase tracking-widest text-slate-text ml-1">Message Payload</label>
                        <textarea 
                            id="message" 
                            name="message" 
                            required 
                            rows={5}
                            placeholder="Type your message here..."
                            className="w-full rounded-2xl bg-slate-900/40 border border-white/10 text-on-surface p-5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-indigo/50 focus-visible:border-electric-indigo transition-all resize-none text-base"
                        ></textarea>
                        <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-sm" />
                    </div>

                    <button 
                        type="submit" 
                        disabled={state.submitting} 
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-electric-indigo to-cyan-flare text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:brightness-110 transition-all btn-shimmer-hover font-body-lg uppercase tracking-widest mt-6"
                    >
                        {state.submitting ? 'Transmitting...' : (
                            <>
                                Transmit Payload <Send className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </button>
                </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

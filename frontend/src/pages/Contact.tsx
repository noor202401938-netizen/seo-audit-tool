import { Input } from '../components/ui/input';
import { useForm, ValidationError } from '@formspree/react';
import { Mail, MapPin, MessageSquare, Globe, ExternalLink, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [state, handleSubmit] = useForm('xvkpyydv');

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      
      {/* Header Section (DARK BLOCK) */}
      <section className="pt-28 pb-12 px-6 max-w-6xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-zinc-200">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>DIRECT SUPPORT & INQUIRIES</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Contact Our Engineering Team
        </h1>
        <p className="text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Need a custom audit setup, enterprise proxy pool, or API integration? Send us a message below.
        </p>
      </section>

      {/* Main Section (LIGHT CONTAINER BLOCK) */}
      <section className="bg-zinc-100 text-zinc-950 border-t border-zinc-300 py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 items-start">
          
          {/* Contact Info Column */}
          <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl p-7 border border-zinc-300 shadow-md space-y-6">
                  <h3 className="text-lg font-bold text-zinc-950 border-b border-zinc-200 pb-3">Direct Channels</h3>
                  <div className="space-y-6 text-xs font-medium">
                      <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-300 flex items-center justify-center shrink-0 text-emerald-700">
                              <Mail className="w-4 h-4" />
                          </div>
                          <div>
                              <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold mb-0.5">Email Us</p>
                              <a href="mailto:sixtyhours14@gmail.com" className="text-sm text-zinc-900 hover:text-black transition-colors font-bold">
                                  sixtyhours14@gmail.com
                              </a>
                          </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-300 flex items-center justify-center shrink-0 text-cyan-700">
                              <Globe className="w-4 h-4" />
                          </div>
                          <div>
                              <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold mb-0.5">Portfolio &amp; Agency</p>
                              <a 
                                  href="https://www.sixtyhours.tech/" 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-sm text-zinc-900 hover:text-emerald-700 transition-colors font-bold flex items-center gap-1"
                              >
                                  <span>See more of our work</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                          </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-300 flex items-center justify-center shrink-0 text-zinc-900">
                              <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                              <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold mb-0.5">Location</p>
                              <p className="text-sm text-zinc-900 font-bold leading-relaxed">
                                  Faisalabad, Pakistan
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-3 bg-white rounded-xl p-8 border border-zinc-300 shadow-xl relative">
              {state.succeeded ? (
              <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 border border-emerald-300 text-emerald-700">
                      <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-950 mb-2">Message Delivered</h3>
                  <p className="text-zinc-700 text-sm max-w-sm mx-auto font-normal">
                      Thank you for reaching out. Our engineering team will review your inquiry and get back to you shortly.
                  </p>
              </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                          <label htmlFor="name" className="text-xs font-bold text-zinc-800">Full Name</label>
                          <Input 
                              type="text" 
                              id="name" 
                              name="name" 
                              required 
                              placeholder="John Doe"
                              className="bg-zinc-50 border-zinc-300 text-zinc-950 focus:border-zinc-900 h-11 rounded-lg px-3.5 text-sm font-medium" 
                          />
                          <ValidationError prefix="Name" field="name" errors={state.errors} className="text-rose-600 text-xs" />
                      </div>
                      <div className="space-y-2">
                          <label htmlFor="email" className="text-xs font-bold text-zinc-800">Work Email</label>
                          <Input 
                              type="email" 
                              id="email" 
                              name="email" 
                              required 
                              placeholder="john@company.com"
                              className="bg-zinc-50 border-zinc-300 text-zinc-950 focus:border-zinc-900 h-11 rounded-lg px-3.5 text-sm font-medium"
                          />
                          <ValidationError prefix="Email" field="email" errors={state.errors} className="text-rose-600 text-xs" />
                      </div>
                  </div>
                  
                  <div className="space-y-2">
                      <label htmlFor="subject" className="text-xs font-bold text-zinc-800">Subject</label>
                      <Input 
                          type="text" 
                          id="subject" 
                          name="subject" 
                          required 
                          placeholder="How can we help?"
                          className="bg-zinc-50 border-zinc-300 text-zinc-950 focus:border-zinc-900 h-11 rounded-lg px-3.5 text-sm font-medium"
                      />
                      <ValidationError prefix="Subject" field="subject" errors={state.errors} className="text-rose-600 text-xs" />
                  </div>

                  <div className="space-y-2">
                      <label htmlFor="message" className="text-xs font-bold text-zinc-800">Message</label>
                      <textarea 
                          id="message" 
                          name="message" 
                          required 
                          rows={4}
                          placeholder="Describe your inquiry or extraction requirements..."
                          className="w-full rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-950 p-3.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900 resize-none"
                      ></textarea>
                      <ValidationError prefix="Message" field="message" errors={state.errors} className="text-rose-600 text-xs" />
                  </div>

                  <button 
                      type="submit" 
                      disabled={state.submitting} 
                      className="w-full flex items-center justify-center gap-2 bg-zinc-950 hover:bg-black text-white font-bold py-3.5 rounded-lg border border-zinc-900 transition-all text-sm mt-4 shadow-xl"
                  >
                      {state.submitting ? 'Sending...' : (
                          <>
                              <span>Send Message</span> <Send className="w-4 h-4" />
                          </>
                      )}
                  </button>
              </form>
              )}
          </div>
        </div>
      </section>

    </div>
  );
}

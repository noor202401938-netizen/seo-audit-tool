import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useForm, ValidationError } from '@formspree/react';

export default function Contact() {
  const [state, handleSubmit] = useForm('mdarrwgd');
  return (
    <div className="py-24 px-6 max-w-3xl mx-auto">
      <div className="text-center space-y-6 mb-16">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">Get in Touch</h2>
        <p className="text-xl text-slate-600">Have questions about our Enterprise plan? Need support? We're here to help.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        {state.succeeded ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
            <p className="text-slate-600">Thanks for getting in touch. We'll get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">Name</label>
              <Input type="text" id="name" name="name" required />
              <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-sm" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
              <Input type="email" id="email" name="email" required />
              <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject</label>
            <Input type="text" id="subject" name="subject" required />
            <ValidationError prefix="Subject" field="subject" errors={state.errors} className="text-red-500 text-sm" />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
            <textarea 
              id="message" 
              name="message" 
              required 
              rows={5}
              className="w-full rounded-xl border border-slate-300 p-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            ></textarea>
            <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-sm" />
          </div>
          <Button type="submit" disabled={state.submitting} className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700">
            {state.submitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
        )}
      </div>
    </div>
  );
}

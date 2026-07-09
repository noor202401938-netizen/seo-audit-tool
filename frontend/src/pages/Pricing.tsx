import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function Pricing() {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center space-y-6 mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Simple, transparent pricing</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Choose the plan that fits your needs.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-2xl font-bold mb-2">Free</h3>
          <p className="text-slate-500 mb-6">Perfect for trying out the platform.</p>
          <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-slate-700">✓ 5 audits per month</li>
            <li className="flex items-center text-slate-700">✓ Basic SEO rules</li>
            <li className="flex items-center text-slate-700">✓ Up to 10 pages per audit</li>
          </ul>
          <Link to="/signup">
            <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 text-lg h-12">Get Started</Button>
          </Link>
        </div>

        {/* Business Plan */}
        <div className="bg-indigo-600 rounded-3xl p-8 border border-indigo-500 shadow-lg flex flex-col text-white transform scale-105 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase">Most Popular</div>
          <h3 className="text-2xl font-bold mb-2">Business</h3>
          <p className="text-indigo-100 mb-6">For agencies and growing sites.</p>
          <div className="text-4xl font-bold mb-6">$10<span className="text-indigo-200 text-lg font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1 text-indigo-50">
            <li className="flex items-center">✓ 200 audits per month</li>
            <li className="flex items-center">✓ All 251 SEO rules</li>
            <li className="flex items-center">✓ Up to 100 pages per audit</li>
            <li className="flex items-center">✓ AI Recommendations</li>
          </ul>
          <Link to="/signup">
            <Button className="w-full bg-white hover:bg-slate-50 text-indigo-600 text-lg h-12">Upgrade Now</Button>
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
          <p className="text-slate-500 mb-6">For large organizations.</p>
          <div className="text-4xl font-bold mb-6">Custom</div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-slate-700">✓ Unlimited audits</li>
            <li className="flex items-center text-slate-700">✓ Unlimited pages</li>
            <li className="flex items-center text-slate-700">✓ Dedicated support</li>
            <li className="flex items-center text-slate-700">✓ Custom integrations</li>
          </ul>
          <Link to="/contact">
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-lg h-12">Book a Call</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
          Audit Smarter, <span className="text-indigo-600">Rank Higher.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          The Universal SEO Auditor analyzes 251 technical rules across your entire site. Get actionable AI-driven strategies to dominate search results.
        </p>
        <Link to="/signup">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 text-lg rounded-xl">Start Free Trial</Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full pt-16">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-3">251-Rule Engine</h3>
          <p className="text-slate-600">Enterprise-grade scanning covering Core Web Vitals, Accessibility, and Technical SEO.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-3">AI Roadmaps</h3>
          <p className="text-slate-600">Don't just see what's broken. Get step-by-step Gemini-powered instructions on how to fix it.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-3">Deep Crawling</h3>
          <p className="text-slate-600">Spider through your entire architecture, not just the homepage, to catch hidden canonical and indexing issues.</p>
        </div>
      </div>
    </div>
  );
}

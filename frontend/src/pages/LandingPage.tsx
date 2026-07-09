import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ChevronRight, Zap, Target, LineChart } from 'lucide-react';

const springVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { 
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
      mass: 1
    } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col items-center">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] -z-10 pointer-events-none" />

      {/* Hero Section */}
      <div className="flex-1 w-full flex flex-col items-center justify-center pt-32 pb-24 px-6 text-center space-y-12 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={springVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wide">
              <Zap className="w-4 h-4" /> SEO Auditor Pro 2.0 is Live
            </span>
          </motion.div>
          
          <motion.h1 variants={springVariants} className="text-6xl lg:text-8xl font-black tracking-tighter text-foreground mb-8 leading-[1.1]">
            Dominate Search.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              Zero Guesswork.
            </span>
          </motion.h1>
          
          <motion.p variants={springVariants} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            The most advanced technical SEO engine. 251 real-time checks, deep architectural crawling, and AI-powered roadmaps to outrank your competitors.
          </motion.p>
          
          <motion.div variants={springVariants} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/signup">
              <Button size="lg" className="h-16 px-10 text-lg rounded-2xl shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                Start Free Trial <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-2xl bg-card border-border hover:bg-muted transition-colors">
                Explore Features
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Feature Cards (Offset Asymmetric Grid) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-24"
        >
          <motion.div variants={springVariants} className="bg-card/50 backdrop-blur-xl p-10 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="w-32 h-32 text-primary" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">251-Rule Engine</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Enterprise-grade scanning covering Core Web Vitals, Accessibility, and Technical SEO edge-cases that other tools miss.
            </p>
          </motion.div>

          <motion.div variants={springVariants} className="bg-card/50 backdrop-blur-xl p-10 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-colors lg:translate-y-12">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-32 h-32 text-primary" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">AI Roadmaps</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Don't just see what's broken. Get step-by-step Gemini-powered instructions on exactly how to fix your on-page semantics.
            </p>
          </motion.div>

          <motion.div variants={springVariants} className="bg-card/50 backdrop-blur-xl p-10 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-colors md:col-span-2 lg:col-span-1 lg:translate-y-6">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <LineChart className="w-32 h-32 text-primary" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <LineChart className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Deep Crawling</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Spider through your entire architecture recursively to catch hidden canonical faults and indexing blockages.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

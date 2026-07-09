import { motion } from 'framer-motion';
import { Search, Zap, ChevronRight, Activity, Globe, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Features() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-32"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 text-sm font-semibold tracking-tight">
            <Zap className="w-4 h-4" /> Powering next-level growth
          </motion.div>
          <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Everything you need to <span className="text-primary">dominate search.</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="text-xl text-muted-foreground leading-relaxed">
            From deep technical crawls to AI-driven content strategies, SEO Auditor Pro gives you the exact blueprint to outrank your competitors.
          </motion.p>
        </motion.div>

        {/* Feature 1: Deep Crawling (Asymmetric Left) */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-2 md:order-1 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl blur-3xl -z-10" />
            <div className="bg-card border shadow-2xl rounded-3xl p-8 overflow-hidden relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Crawler Status</h3>
                  <p className="text-sm text-muted-foreground">Scanning all internal links...</p>
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i}
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2, duration: 0.8 }}
                    className="h-2 bg-primary/20 rounded-full overflow-hidden"
                  >
                    <div className="h-full bg-primary w-2/3 rounded-full" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="order-1 md:order-2 space-y-6"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">Deep Architectural Crawling</motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground">
              Our engine doesn't just scratch the surface. We recursively navigate through your entire site architecture, uncovering hidden broken links, infinite redirects, and orphaned pages that are draining your crawl budget.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-3">
              {[
                { icon: Globe, text: "Full JavaScript rendering support" },
                { icon: Shield, text: "Robots.txt & Sitemap validation" },
                { icon: Activity, text: "Real-time performance metrics" }
              ].map((item, i) => (
                <motion.li key={i} variants={fadeIn} className="flex items-center gap-3 text-foreground font-medium">
                  <item.icon className="w-5 h-5 text-primary" />
                  {item.text}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        {/* Feature 2: AI Recommendations (Asymmetric Right) */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">AI-Driven Content Strategy</motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground">
              Stop guessing what Google wants. Our Gemini-powered AI analyzes your on-page semantics against the top-ranking competitors to give you exact instructions on how to rewrite your titles, headers, and body copy.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Button size="lg" className="mt-4 shadow-lg shadow-primary/20" asChild>
                <Link to="/signup">Try it for free <ChevronRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="bg-card border shadow-xl rounded-3xl p-8">
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <p className="text-sm font-mono text-primary mb-4">// AI Insight Generated</p>
                <p className="text-foreground leading-relaxed font-medium">
                  "Your H1 tag is missing the primary keyword 'Enterprise SEO'. Consider updating it to: <span className="text-primary font-bold bg-primary/10 px-1 rounded">Enterprise SEO: A Complete Guide for 2026</span>. Furthermore, your keyword density in the first paragraph is too low compared to top 10 competitors."
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature 3: SEO Metrics (Centered Grid) */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Comprehensive Metrics</h2>
          <p className="text-lg text-muted-foreground">Everything is tracked, scored, and visualized so you can prove your ROI to stakeholders.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Core Web Vitals", desc: "LCP, FID, and CLS tracking to ensure your site is blazing fast.", val: "100" },
            { title: "Accessibility Score", desc: "Ensure your site is usable by everyone, a key ranking factor.", val: "98" },
            { title: "Technical Health", desc: "A combined score of your meta tags, structured data, and headers.", val: "A+" }
          ].map((metric, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card border shadow-sm hover:shadow-md transition-all rounded-3xl p-8"
            >
              <div className="text-4xl font-black text-primary mb-4">{metric.val}</div>
              <h3 className="text-xl font-bold mb-2">{metric.title}</h3>
              <p className="text-muted-foreground text-sm">{metric.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default function About() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto relative z-10">
      <div className="glass-card rounded-[2.5rem] p-10 md:p-14 border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.05)]">
        <h1 className="text-display-lg font-display-lg font-bold text-on-surface mb-8">About SEO Intelligence Command</h1>
        
        <div className="prose prose-slate prose-invert max-w-none space-y-8 text-slate-text">
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">Our Mission</h2>
            <p className="leading-relaxed text-lg">
              We built SEO Intelligence Command because the digital landscape demands more than fragmented metrics and superficial audits. Our mission is to democratize high-performance technical SEO by providing enterprise-grade, AI-driven auditing capabilities to everyone—from independent consultants to multinational agencies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">The Next Evolution of Search Intelligence</h2>
            <p className="leading-relaxed">
              Traditional SEO tools rely on static rulesets that quickly become outdated in an era of algorithmic volatility. We take a different approach. Our proprietary 251-point analysis engine operates in real-time, executing deep programmatic crawls to uncover structural, performance, and content-related vulnerabilities that others miss.
            </p>
            <p className="leading-relaxed mt-4">
              By combining robust technical extraction with Gemini-powered AI models, we don't just report issues—we provide contextual, prioritized roadmaps designed to directly impact organic visibility and revenue generation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">Engineering Excellence</h2>
            <p className="leading-relaxed mb-4">
              Our platform is engineered for scale, speed, and precision. We leverage distributed architecture and secure processing pipelines to handle massive data sets efficiently. Key pillars of our technology include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Real-time DOM Analysis:</strong> Executing JavaScript to evaluate pages exactly as modern search engines render them.</li>
              <li><strong>Advanced NLP Integration:</strong> Utilizing large language models to assess content relevance, semantic density, and user intent alignment.</li>
              <li><strong>Predictive Intelligence:</strong> Identifying emerging technical risks before they impact your indexation status.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">Our Commitment</h2>
            <p className="leading-relaxed">
              We are obsessed with data accuracy and actionable insights. Our engineering team continuously refines our auditing algorithms based on the latest search engine patents, documentation updates, and observed ranking volatility. When you use SEO Intelligence Command, you are equipped with the most sophisticated diagnostic tools available in the industry.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

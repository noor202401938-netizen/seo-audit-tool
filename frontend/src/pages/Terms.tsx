export default function Terms() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto relative z-10">
      <div className="glass-card rounded-[2.5rem] p-10 md:p-14 border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.05)]">
        <h1 className="text-display-lg font-display-lg font-bold text-on-surface mb-4">Terms of Service</h1>
        <p className="text-sm font-label-caps uppercase tracking-widest text-slate-text mb-10">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-slate prose-invert max-w-none space-y-8 text-slate-text">
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing, browsing, or using the SEO Intelligence Command platform ("Service"), you signify your irrevocable acceptance of these Terms of Service. If you do not agree to these terms, you may not use the Service. These terms govern your use of the website, APIs, and any related software or services provided by SEO Intelligence Command.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">2. Description of Service</h2>
            <p className="leading-relaxed">
              SEO Intelligence Command provides AI-driven search engine optimization analytics, auditing, and reporting tools. The Service includes but is not limited to site audits, keyword exploration, backlink analysis, and AI-generated recommendations. We reserve the right to modify, suspend, or discontinue any part of the Service at our sole discretion, without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">3. User Accounts and Security</h2>
            <p className="leading-relaxed mb-3">
              To utilize certain features, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Maintain the security and confidentiality of your credentials.</li>
              <li>Accept full responsibility for all activities occurring under your account.</li>
              <li>Immediately notify us of any unauthorized access or security breaches.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">4. Acceptable Use Policy</h2>
            <p className="leading-relaxed mb-3">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable local, state, national, or international law or regulation.</li>
              <li>Perform denial-of-service (DoS) attacks, unauthorized penetration testing, or attempt to disrupt our infrastructure.</li>
              <li>Scrape, extract, or mine data from the Service using automated tools without express written permission.</li>
              <li>Reverse engineer, decompile, or disassemble any aspect of the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">5. Intellectual Property Rights</h2>
            <p className="leading-relaxed">
              All intellectual property rights in the Service, including software, algorithms, UI/UX designs, trademarks, and documentation, are the exclusive property of SEO Intelligence Command. Your use of the Service does not grant you any ownership rights. You retain ownership of the specific URLs and business data you input, but grant us a license to process it to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">6. Limitation of Liability</h2>
            <p className="leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SEO INTELLIGENCE COMMAND SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE. OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE SERVICE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">7. Indemnification</h2>
            <p className="leading-relaxed">
              You agree to defend, indemnify, and hold harmless SEO Intelligence Command, its officers, directors, employees, and agents from any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">8. Governing Law and Jurisdiction</h2>
            <p className="leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions. Any legal action or proceeding arising out of these Terms shall be brought exclusively in the federal or state courts located in Delaware.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

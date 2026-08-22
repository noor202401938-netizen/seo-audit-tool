export default function Privacy() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      
      {/* Header */}
      <section className="pt-28 pb-12 px-6 max-w-4xl mx-auto text-left space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono font-semibold text-zinc-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          OPEN SOURCE PRIVACY COMMITMENT
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
      </section>

      {/* Main Content */}
      <section className="bg-zinc-100 text-zinc-950 border-t border-zinc-300 py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl border border-zinc-300 shadow-md space-y-8 text-sm text-zinc-800 leading-relaxed font-normal">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">1. Self-Hosted &amp; Private by Design</h2>
            <p>
              SEO Intelligence is open-source, self-hosted software. When you run SEO Intelligence on your local computer or private server, all audit data, crawl records, scraped metadata, and configuration settings are stored solely in your local database (e.g. SQLite).
            </p>
            <p className="font-semibold text-zinc-900">
              We do not collect, transmit, monetize, or track your audits, website URLs, or personal data on any centralized server.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">2. Bring Your Own Key (BYOK) Data Flow</h2>
            <p>
              Optional third-party features (such as Google Gemini AI recommendations, OpenPageRank metrics, Keywords Everywhere search volumes, and YouTube data) require your personal API keys:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-700 font-medium">
              <li>API keys are stored strictly in your local environment file (`.env`) or browser `localStorage`.</li>
              <li>Requests to third-party services are sent directly from your server to those respective APIs.</li>
              <li>Your usage of third-party APIs is governed by the privacy policies of those individual service providers (e.g., Google Privacy Policy).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">3. Authentication &amp; Local Sessions</h2>
            <p>
              User authentication on your self-hosted instance utilizes JSON Web Tokens (JWT) stored in your browser's local storage. Passwords are cryptographically hashed using bcrypt on your backend before saving to your database.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">4. Third-Party Crawling &amp; Public Data</h2>
            <p>
              When running audits or contact extraction, the tool retrieves publicly accessible HTML, robots.txt, and sitemaps from target websites specified by the operator. Operators are responsible for complying with target domain crawler directives and applicable local regulations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">5. Open Source Inquiries</h2>
            <p>
              For questions regarding the open-source codebase or security disclosures, please open an issue or discussion on the{' '}
              <a 
                href="https://github.com/noor202401938-netizen/seo-audit-tool" 
                target="_blank" 
                rel="noreferrer" 
                className="text-emerald-700 font-bold hover:underline font-mono"
              >
                GitHub Repository
              </a>.
            </p>
          </section>

        </div>
      </section>

    </div>
  );
}

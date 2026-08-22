export default function Cookies() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      
      {/* Header */}
      <section className="pt-28 pb-12 px-6 max-w-4xl mx-auto text-left space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono font-semibold text-zinc-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          ZERO TRACKING COOKIES
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Cookie Policy
        </h1>
        <p className="text-xs font-mono text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
      </section>

      {/* Main Content */}
      <section className="bg-zinc-100 text-zinc-950 border-t border-zinc-300 py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl border border-zinc-300 shadow-md space-y-8 text-sm text-zinc-800 leading-relaxed font-normal">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">1. No Tracking or Advertising Cookies</h2>
            <p>
              SEO Intelligence is completely ad-free and tracking-free. We do not use third-party tracking pixels, marketing cookies, fingerprinting scripts, or cross-site behavioral cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">2. Local Storage &amp; Session Tokens</h2>
            <p>
              To maintain your authenticated session and persist your local preferences on your private instance, the frontend uses standard browser <strong>Local Storage (`localStorage`)</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-700 font-medium">
              <li><strong>`token`</strong>: Stores the encrypted JWT authentication bearer token required to authenticate requests to your local backend API.</li>
              <li><strong>Local Settings</strong>: Stores user-configured BYOK API keys strictly on your local browser.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">3. Clearing Stored Data</h2>
            <p>
              You can clear all stored session tokens and local preferences at any time by logging out from the dashboard or clearing your browser's site data / cookies for this domain.
            </p>
          </section>

        </div>
      </section>

    </div>
  );
}

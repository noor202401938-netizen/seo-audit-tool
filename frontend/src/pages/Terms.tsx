export default function Terms() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      
      {/* Header */}
      <section className="pt-28 pb-12 px-6 max-w-4xl mx-auto text-left space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono font-semibold text-zinc-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          OPEN SOURCE LICENSE &amp; TERMS
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
      </section>

      {/* Main Content */}
      <section className="bg-zinc-100 text-zinc-950 border-t border-zinc-300 py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl border border-zinc-300 shadow-md space-y-8 text-sm text-zinc-800 leading-relaxed font-normal">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">1. Open Source MIT License</h2>
            <p>
              SEO Intelligence is released under the standard <strong>MIT License</strong>. Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">2. Responsible Self-Hosted Usage</h2>
            <p>
              As a self-hosted operator, you are solely responsible for how you configure and execute audits and crawler tasks:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-700 font-medium">
              <li>Respect the target website's `robots.txt` directives and crawl rate recommendations.</li>
              <li>Do not use the tool to perform unauthorized penetration testing or denial-of-service against third-party servers.</li>
              <li>Comply with applicable privacy laws and communication standards (such as CAN-SPAM or GDPR) when interacting with publicly extracted contact records.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">3. Disclaimer of Warranties</h2>
            <p className="font-mono text-xs text-zinc-700 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">4. Community Contributions</h2>
            <p>
              Contributions, bug reports, and pull requests submitted to the project repository are subject to the project's Code of Conduct and MIT License guidelines.
            </p>
          </section>

        </div>
      </section>

    </div>
  );
}

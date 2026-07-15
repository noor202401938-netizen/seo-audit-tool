export default function Privacy() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto relative z-10">
      <div className="glass-card rounded-[2.5rem] p-10 md:p-14 border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.05)]">
        <h1 className="text-display-lg font-display-lg font-bold text-on-surface mb-4">Privacy Policy</h1>
        <p className="text-sm font-label-caps uppercase tracking-widest text-slate-text mb-10">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-slate prose-invert max-w-none space-y-8 text-slate-text">
          <p className="leading-relaxed">
            This Privacy Policy describes how SEO Intelligence Command ("we," "our," or "us") collects, uses, protects, and shares your personal information when you use our website, application, APIs, and related services (collectively, the "Service"). We are committed to safeguarding your privacy and ensuring compliance with applicable data protection laws, including the GDPR and CCPA.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">1. Information We Collect</h2>
            <p className="leading-relaxed mb-3">We collect several types of information from and about users of our Service, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Data:</strong> Information you provide when registering, such as your name, email address, billing information, and company details.</li>
              <li><strong>Usage Data:</strong> Information automatically collected regarding your interaction with our Service, including IP addresses, browser types, log data, and navigational behavior.</li>
              <li><strong>Customer Data:</strong> The URLs, domain names, target keywords, and analytics data you input into our system for auditing and analysis.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">2. How We Use Your Information</h2>
            <p className="leading-relaxed mb-3">Your data is utilized for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide, maintain, and improve the core functionality of the Service.</li>
              <li>To process transactions and send related billing information.</li>
              <li>To authenticate users and secure accounts against unauthorized access.</li>
              <li>To communicate important service updates, technical notices, and promotional offers (from which you can opt-out).</li>
              <li>To aggregate anonymized analytics data to improve our machine learning models and auditing engines.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">3. Data Sharing and Disclosure</h2>
            <p className="leading-relaxed">
              We do not sell, rent, or trade your personal information to third parties for their commercial purposes. We may share your data only in the following limited circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Service Providers:</strong> With trusted third-party vendors who assist us in operating our platform (e.g., cloud hosting, payment processors, email delivery services), bound by strict confidentiality agreements.</li>
              <li><strong>Legal Compliance:</strong> When required to do so by law, or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">4. Data Security and Retention</h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures, including encryption in transit and at rest, to protect your personal information. We retain your data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Once data is no longer needed, it is securely deleted or anonymized.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">5. Your Data Rights</h2>
            <p className="leading-relaxed">
              Depending on your jurisdiction, you may have the right to access, correct, update, or delete your personal information. You can manage your account information within the application settings. For further assistance or to exercise your rights under GDPR or CCPA, please contact our Data Protection Officer at privacy@seoaudit.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function Privacy() {
  return (
    <div className="py-24 px-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
        <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from Universal SEO Auditor.</p>
        
        <h2 className="text-2xl font-semibold text-slate-900">Personal Information We Collect</h2>
        <p>When you register for an account, we collect certain information from you, including your name, email address, and password (which is securely hashed). When you perform an audit, we store the URLs you scan to provide you with historical data.</p>
        
        <h2 className="text-2xl font-semibold text-slate-900">How We Use Your Information</h2>
        <p>We use your information to provide the Service, communicate with you, and improve our platform. We do not sell your personal information to third parties.</p>
        
        <h2 className="text-2xl font-semibold text-slate-900">Data Retention</h2>
        <p>We retain your account information and audit history for as long as your account is active. You can request deletion of your account at any time by contacting support.</p>
      </div>
    </div>
  );
}

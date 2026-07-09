export default function Cookies() {
  return (
    <div className="py-24 px-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-slate-900">Cookies Policy</h1>
      <p className="text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
        <p>Universal SEO Auditor uses cookies and similar technologies to provide, improve, protect, and promote our services.</p>
        
        <h2 className="text-2xl font-semibold text-slate-900">How We Use Cookies</h2>
        <p><strong>Authentication:</strong> We use local storage and cookies to verify your account and determine when you're logged in, so we can make it easier for you to access the platform.</p>
        <p><strong>Preferences:</strong> We use cookies to remember your settings and preferences.</p>
        <p><strong>Analytics:</strong> We use cookies to understand how you interact with our platform so we can improve it.</p>
        
        <h2 className="text-2xl font-semibold text-slate-900">Managing Cookies</h2>
        <p>You can set your browser to not accept cookies, but this may limit your ability to use the services.</p>
      </div>
    </div>
  );
}

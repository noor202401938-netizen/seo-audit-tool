export default function Cookies() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto relative z-10">
      <div className="glass-card rounded-[2.5rem] p-10 md:p-14 border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.05)]">
        <h1 className="text-display-lg font-display-lg font-bold text-on-surface mb-4">Cookie Policy</h1>
        <p className="text-sm font-label-caps uppercase tracking-widest text-slate-text mb-10">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-slate prose-invert max-w-none space-y-8 text-slate-text">
          <p className="leading-relaxed">
            This Cookie Policy explains how SEO Intelligence Command ("we," "our," or "us") uses cookies, web beacons, tracking pixels, and similar technologies to recognize you when you visit our platform. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
          
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">1. What are Cookies?</h2>
            <p className="leading-relaxed">
              Cookies are small data files placed on your computer or mobile device when you visit a website. Cookies are widely used by online service providers to facilitate and help make the interaction between users and websites faster and easier, as well as to provide reporting information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">2. Types of Cookies We Use</h2>
            <p className="leading-relaxed mb-3">We use the following types of cookies for various operational purposes:</p>
            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong>Strictly Necessary Cookies:</strong> These cookies are essential to provide you with services available through our platform and to use some of its features, such as access to secure areas. Without these cookies, services like secure login and billing cannot be provided.
              </li>
              <li>
                <strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our platform but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
              </li>
              <li>
                <strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our platform is being used or how effective our marketing campaigns are, or to help us customize our platform for you.
              </li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">3. Managing Cookies</h2>
            <p className="leading-relaxed">
              You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">4. Updates to this Policy</h2>
            <p className="leading-relaxed">
              We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#0A0A0A] text-[#F5F0E8] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="mb-12">
          <span className="text-[#C9A84C] text-sm tracking-[0.2em] uppercase mb-4 block">Legal</span>
          <h1 className="font-playfair text-4xl md:text-5xl text-white mb-6">Privacy Policy</h1>
          <p className="text-[#F5F0E8]/50 text-sm">Last Updated: July 19, 2026</p>
        </div>

        <div className="space-y-8 text-[#F5F0E8]/70 font-light leading-relaxed">
          <section>
            <h2 className="font-playfair text-2xl text-white mb-4">1. Introduction</h2>
            <p>
              Welcome to The Golden Fork. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl text-white mb-4">2. The Data We Collect About You</h2>
            <p className="mb-2">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Financial Data</strong> includes bank account and payment card details for reservation deposits.</li>
              <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-playfair text-2xl text-white mb-4">3. How We Use Your Personal Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., booking a table).</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-playfair text-2xl text-white mb-4">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </section>
          
          <section>
            <h2 className="font-playfair text-2xl text-white mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:hello@goldenfork.com" className="text-[#C9A84C] hover:underline">hello@goldenfork.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

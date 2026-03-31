import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-32">
        <h1 className="text-4xl font-bold font-display mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-12">Last updated: April 1, 2026</p>
        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
          {[
            { title: "1. Acceptance of Terms", body: "By accessing or using SloerStudio, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services." },
            { title: "2. Use of Services", body: "SloerStudio provides developer tooling including SloerSpace Dev, SloerSwarm, SloerCanvas, and SloerVoice. You agree to use these services only for lawful purposes and in accordance with these terms." },
            { title: "3. Account Responsibilities", body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use." },
            { title: "4. Subscription & Billing", body: "Paid plans are billed monthly or annually. Subscriptions automatically renew until cancelled. You may cancel at any time from Settings → Billing. Refunds are issued at our discretion." },
            { title: "5. Open Source License", body: "SloerSpace Dev is released under the MIT License. You are free to use, modify, and distribute the desktop application in accordance with the MIT License terms." },
            { title: "6. Intellectual Property", body: "SloerStudio and its associated branding, products, and platform services are the intellectual property of SloerStudio. The MIT license applies only to the SloerSpace Dev desktop application source code." },
            { title: "7. Limitation of Liability", body: "SloerStudio shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service." },
            { title: "8. Termination", body: "We reserve the right to terminate or suspend your account at any time for violations of these terms. You may delete your account at any time from Settings → Delete Account." },
            { title: "9. Changes to Terms", body: "We may modify these terms at any time. We will notify you of significant changes via email. Continued use of the service after changes constitutes acceptance of the new terms." },
            { title: "10. Contact", body: "For questions about these Terms of Service, contact us at legal@sloerstudio.com." },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-bold text-white font-display mb-3">{section.title}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

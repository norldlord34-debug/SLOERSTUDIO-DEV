import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-32">
        <h1 className="text-4xl font-bold font-display mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-12">Last updated: April 1, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 text-sm leading-relaxed">
          {[
            {
              title: "1. Information We Collect",
              body: "We collect information you provide directly to us, such as your name, email address, and password when you create an account. We also collect usage data and analytics to improve the platform.",
            },
            {
              title: "2. How We Use Your Information",
              body: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.",
            },
            {
              title: "3. Data Storage & Security",
              body: "Your data is stored on servers with industry-standard encryption. Passwords are hashed using bcrypt with 12 rounds. We use PostgreSQL with connection pooling and enforce TLS on all connections.",
            },
            {
              title: "4. On-Device Processing (SloerVoice)",
              body: "SloerVoice processes all audio entirely on your device using local Whisper AI models. No audio data is transmitted to our servers or any third party. This is by design — your voice never leaves your machine.",
            },
            {
              title: "5. Third-Party Services",
              body: "We use Stripe for payment processing, Resend for transactional email, and Upstash for caching. These services have their own privacy policies. We do not sell your personal data to any third party.",
            },
            {
              title: "6. Data Retention",
              body: "We retain your account data for as long as your account is active. You may request deletion of your account and all associated data at any time from Settings → Danger Zone → Delete Account.",
            },
            {
              title: "7. Your Rights",
              body: "You have the right to access, correct, or delete your personal data. You may export your data as JSON from Settings → Export Your Data. Contact privacy@sloerstudio.com for any data requests.",
            },
            {
              title: "8. Contact",
              body: "If you have questions about this Privacy Policy, please contact us at privacy@sloerstudio.com.",
            },
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

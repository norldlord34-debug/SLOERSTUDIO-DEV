import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageCircle, Briefcase } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display mb-4">Get in Touch</h1>
          <p className="text-gray-400 text-lg">Looking to scale your agentic organization? We&apos;d love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Mail, label: "Support", email: "support@sloerstudio.com", color: "#4f8cff" },
            { icon: MessageCircle, label: "General", email: "contact@sloerstudio.com", color: "#28e7c5" },
            { icon: Briefcase, label: "Partnerships", email: "partnerships@sloerstudio.com", color: "#ffbf62" },
          ].map((c) => (
            <div key={c.label} className="flex items-start gap-3 p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}15`, border: `1px solid ${c.color}25` }}>
                <c.icon size={16} style={{ color: c.color }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{c.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.email}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 rounded-2xl border border-white/8 bg-white/[0.02] mb-10">
          <h2 className="font-bold text-white mb-6 font-display">Send a Message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">NAME</label>
                <input type="text" placeholder="Your name" className="w-full px-3.5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">EMAIL</label>
                <input type="email" placeholder="you@example.com" className="w-full px-3.5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">MESSAGE</label>
              <textarea rows={5} placeholder="How can we help?" className="w-full px-3.5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50 resize-none" />
            </div>
            <button type="submit" className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-[#4f8cff] text-black hover:bg-[#6ba3ff] transition-colors">
              Send Message →
            </button>
          </form>
        </div>

        <div className="text-center p-8 rounded-2xl border border-white/8 bg-white/[0.01]">
          <p className="text-sm text-gray-400 mb-3">Join our community of builders on Discord</p>
          <a href="/community/discord" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#5865f2]/15 border border-[#5865f2]/30 text-[#5865f2] hover:bg-[#5865f2]/25 transition-colors">
            Join Discord →
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HelpCircle, Book, MessageCircle, ExternalLink, ChevronDown } from "lucide-react";

const FAQS = [
  { q: "How do I create a new project?", a: "Navigate to the Projects page and click '+ New Project'. Give it a name and start building with your AI teammates." },
  { q: "What is the difference between Agents, Skills, and Prompts?", a: "Agents are AI teammates specialized in a domain. Skills are methodologies that give agents capabilities. Prompts are pre-crafted instructions for common tasks." },
  { q: "How does SloerSwarm work?", a: "SloerSwarm is a multi-agent orchestration system. You configure a roster of agents, define a mission, set a working directory, and launch — each agent runs in its own persistent terminal session." },
  { q: "Is SloerVoice private?", a: "Yes. SloerVoice runs Whisper AI 100% locally on your device. No audio data ever leaves your machine. There is no cloud transcription option." },
  { q: "How do I upgrade my plan?", a: "Go to Settings → Billing, or visit the Pricing page to compare plans and start a 7-day free trial of Studio or Enterprise." },
];

export default async function HelpPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
          <HelpCircle size={16} className="text-gray-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display">Help & Resources</h1>
          <p className="text-gray-400 text-sm">Everything you need to build with SloerStudio.</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Book, label: "Documentation", desc: "Full guides and API reference", href: "/community/docs", color: "#4f8cff" },
          { icon: MessageCircle, label: "Discord Community", desc: "Chat with 7,300+ builders", href: "/community/discord", color: "#28e7c5" },
          { icon: ExternalLink, label: "GitHub", desc: "Open source code and issues", href: "https://github.com/norldlord34-debug/SLOERSPACE-DEV", color: "#ffbf62" },
        ].map((link) => (
          <a key={link.label} href={link.href} className="flex items-start gap-3 p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${link.color}15`, border: `1px solid ${link.color}25` }}>
              <link.icon size={16} style={{ color: link.color }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{link.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
            </div>
          </a>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="text-lg font-bold font-display mb-5">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {FAQS.map((faq) => (
          <details key={faq.q} className="group rounded-xl border border-white/8 bg-white/[0.02]">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
              <span className="text-sm font-medium text-white">{faq.q}</span>
              <ChevronDown size={14} className="text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
            </summary>
            <div className="px-5 pb-5">
              <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

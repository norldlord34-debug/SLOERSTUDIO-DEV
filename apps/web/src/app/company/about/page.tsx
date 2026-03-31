import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 mb-6">Company</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display mb-6">
            We&apos;re an Agentic<br />Organization.
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            SloerStudio builds the tools that let developers ship software at the speed of thought, alongside autonomous AI teammates.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/signup" className="px-6 py-3 rounded-full font-semibold text-sm bg-[#4f8cff] text-black hover:bg-[#6ba3ff] transition-colors">Get Started</Link>
            <Link href="/company/careers" className="px-6 py-3 rounded-full font-semibold text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">Join the Team</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {[
            { title: "That&apos;s Not Marketing Speak. It&apos;s Our Operating Model.", body: "We build every tool we ship. We use SloerSwarm to build SloerSpace. We use SloerVoice to write documentation. We eat our own dog food at every level of the stack.", icon: "⟐" },
            { title: "Autonomous Engineering", body: "AI agents aren&apos;t assistants in our world — they&apos;re teammates. SloerStudio is built from the ground up to let human and AI engineers collaborate with full context, shared state, and clear roles.", icon: "✦" },
          ].map((item) => (
            <div key={item.title} className="p-8 rounded-2xl border border-white/8 bg-white/[0.02]">
              <span className="text-2xl mb-4 block">{item.icon}</span>
              <h2 className="text-xl font-bold font-display mb-3" dangerouslySetInnerHTML={{ __html: item.title }} />
              <p className="text-gray-400 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item.body }} />
            </div>
          ))}
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-display mb-4">Our Mission</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            To give every developer on the planet access to an autonomous engineering team. We believe the next billion software projects will be built by small teams wielding AI agent swarms — and we&apos;re building the platform to make that possible.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-white/8 bg-white/[0.01] mb-16 text-center">
          <h2 className="text-2xl font-bold font-display mb-4">Our Vision</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
            A world where software is built in hours, not months. Where every developer has a team of specialized AI engineers working alongside them. Where &quot;shipping at the speed of thought&quot; is not a metaphor — it&apos;s the standard.
          </p>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold font-display text-center mb-10">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: "Open Core", desc: "SloerSpace Dev is MIT licensed and free forever. We believe in open source as the foundation of trust.", color: "#4f8cff" },
              { title: "On-Device First", desc: "SloerVoice runs locally. Your code never leaves your machine without your explicit consent.", color: "#28e7c5" },
              { title: "Developer DNA", desc: "Every feature is built by developers, for developers. We ship features we actually use every day.", color: "#ffbf62" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                <div className="w-2.5 h-2.5 rounded-full mb-4" style={{ background: item.color }} />
                <h3 className="font-bold text-white mb-2 font-display">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center p-12 rounded-2xl border border-white/8 bg-white/[0.01]">
          <h2 className="text-2xl font-bold font-display mb-3">Join the Team</h2>
          <p className="text-gray-400 mb-6">We&apos;re a small team building fast. If you want to help shape the future of agentic development, we want to hear from you.</p>
          <Link href="/company/careers" className="inline-flex px-6 py-3 rounded-full font-semibold text-sm bg-[#4f8cff] text-black hover:bg-[#6ba3ff] transition-colors">View Open Positions</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

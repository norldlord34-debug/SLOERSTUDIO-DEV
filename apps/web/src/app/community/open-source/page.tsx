import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Github, GitFork, Star } from "lucide-react";

export default function OpenSourcePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-32">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold mb-6 border border-white/10 bg-white/5 text-gray-400">
            Open Source
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display mb-4">We build in the open.</h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-2xl">
            Plugins, skills, and agents for the AI coding ecosystem — MIT licensed, community-maintained, and growing every week.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/norldlord34-debug/SLOERSPACE-DEV" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/8 border border-white/10 hover:bg-white/12 transition-colors">
              <Github size={15} /> View on GitHub
            </a>
            <a href="/community/discord" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-[#5865f2] bg-[#5865f2]/10 border border-[#5865f2]/20 hover:bg-[#5865f2]/20 transition-colors">
              Join Discord →
            </a>
          </div>
        </div>

        {/* Repos */}
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Repositories</h2>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
            {[
              { name: "SLOERSPACE-DEV", desc: "The main SloerSpace Dev IDE — Tauri 2 + Next.js 14 + Rust", stars: 0, forks: 0, lang: "Rust" },
            ].map((repo) => (
              <div key={repo.name} className="flex items-center justify-between p-5 border-b border-white/5 last:border-0">
                <div>
                  <a href="https://github.com/norldlord34-debug/SLOERSPACE-DEV" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#4f8cff] hover:underline text-sm">{repo.name}</a>
                  <p className="text-xs text-gray-500 mt-0.5">{repo.desc}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Star size={12} />{repo.stars}</span>
                  <span className="flex items-center gap-1"><GitFork size={12} />{repo.forks}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#e8956a]/10 text-[#e8956a] border border-[#e8956a]/20">{repo.lang}</span>
                </div>
              </div>
            ))}
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500 mb-3">More repositories launching soon</p>
              <p className="text-xs text-gray-600">SloerSwarm SDK · SloerVoice Rust Engine · Agent Plugin API</p>
            </div>
          </div>
        </div>

        {/* Contribute */}
        <h2 className="text-2xl font-bold font-display mb-6">Contribute</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Fork & Clone", desc: "Start by forking the repository and cloning it locally.", icon: "⑂" },
            { title: "Develop Locally", desc: "npm run tauri:dev for hot-reload desktop development.", icon: "💻" },
            { title: "Open a PR", desc: "Submit your changes via pull request. We review everything.", icon: "⬆" },
          ].map((s) => (
            <div key={s.title} className="p-5 rounded-2xl border border-white/8 bg-white/[0.02] text-center">
              <div className="text-2xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-white mb-2 text-sm font-display">{s.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

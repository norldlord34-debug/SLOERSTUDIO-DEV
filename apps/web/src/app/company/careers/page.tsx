import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";

const JOBS = [
  { title: "Vibe Coder", dept: "Engineering", type: "Full-time", location: "Remote" },
  { title: "Video Editor", dept: "Content", type: "Full-time", location: "Remote" },
  { title: "Content Clipper", dept: "Content", type: "Contract", location: "Remote" },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4f8cff]/10 border border-[#4f8cff]/20 text-xs font-medium text-[#4f8cff] mb-6">
            ✦ We&apos;re Hiring
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display mb-4">Join Our Team</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Help us build the future of AI-powered development tools. Check out our open positions below.</p>
        </div>

        <p className="text-sm text-gray-500 mb-6">{JOBS.length} open positions</p>

        <div className="space-y-3 mb-16">
          {JOBS.map((job) => (
            <div key={job.title} className="flex items-center justify-between p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#4f8cff]/10 border border-[#4f8cff]/20 flex items-center justify-center text-xs font-bold text-[#4f8cff]">
                  {job.title[0]}
                </div>
                <div>
                  <p className="font-semibold text-white">{job.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-500">📁 {job.dept}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">⏰ {job.type}</span>
                    <span className="flex items-center gap-1 text-xs text-[#28e7c5]">🌍 {job.location}</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500">
          Questions about our hiring process?{" "}
          <a href="/company/contact" className="text-[#4f8cff] hover:underline">Get in touch</a>
        </p>
      </div>
      <Footer />
    </div>
  );
}

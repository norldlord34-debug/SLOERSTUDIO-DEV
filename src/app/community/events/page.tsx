import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EVENTS = [
  {
    date: { day: "17", month: "APR" },
    tags: ["Project Sharing", "Upcoming"],
    title: "Weekly Project Sharing",
    desc: "Join us for our weekly Project Sharing session! Builders in the SloerStudio community showcase what they've been working on, share their progress, get feedback, and inspire each other.",
  },
  {
    date: { day: "24", month: "APR" },
    tags: ["Vibeathon", "Upcoming"],
    title: "Vibeathon Demo Day — Part 1",
    desc: "Vibeathon Demo Day! Builders who entered the SloerStudio Vibeathon will have the opportunity to demo their submissions live on stream to the community.",
  },
  {
    date: { day: "25", month: "APR" },
    tags: ["Vibeathon", "Upcoming"],
    title: "Vibeathon Demo Day — Part 2",
    desc: "More builders demo amazing projects built with SloerSpace, SloerSwarm, and SloerCanvas. Come watch and vote for your favorites.",
  },
  {
    date: { day: "26", month: "APR" },
    tags: ["Vibeathon", "Upcoming"],
    title: "Vibeathon Voting & Winners",
    desc: "The community comes together to cast their votes and crown the champions. Join us live as we announce the Vibeathon winners.",
  },
];

const TAG_COLORS: Record<string, string> = {
  "Project Sharing": "#4f8cff",
  "Vibeathon": "#28e7c5",
  "Upcoming": "#6b7280",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display mb-4">Events</h1>
          <p className="text-gray-400 text-lg">Join the SloerStudio community at our project sharing sessions, vibeathons, and builder meetups.</p>
        </div>

        <div className="space-y-4">
          {EVENTS.map((event) => (
            <div key={event.title} className="flex items-start gap-6 p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
              <div className="flex-shrink-0 w-14 text-center">
                <p className="text-2xl font-bold text-white font-display">{event.date.day}</p>
                <p className="text-xs text-gray-500 font-semibold">{event.date.month}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">8:00 PM</p>
              </div>
              <div className="w-px bg-white/8 self-stretch" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {event.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border" style={{ color: TAG_COLORS[tag] ?? "#6b7280", borderColor: `${TAG_COLORS[tag] ?? "#6b7280"}30`, background: `${TAG_COLORS[tag] ?? "#6b7280"}10` }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg font-bold text-white font-display mb-2">{event.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{event.desc}</p>
                <button className="text-xs text-[#4f8cff] hover:underline">View Details →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

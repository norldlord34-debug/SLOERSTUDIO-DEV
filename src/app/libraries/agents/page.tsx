import LibraryShowcase from "@/components/libraries/LibraryShowcase";

const COBALT = "#4f8cff";

const FREE_AGENTS = [
  { name: "SloerSecurity", desc: "Your security-first teammate. Audits code for vulnerabilities, hardens architecture, and surfaces risks before they ship.", color: "#ff6f96", icon: "🔒" },
  { name: "SloerShipper", desc: "Turns vibe-coded ideas into production-ready code. Scaffolds features, writes boilerplate, and keeps the codebase clean.", color: "#4f8cff", icon: "🚀" },
  { name: "SloerScout", desc: "Deep-dives into unfamiliar codebases, maps architecture, traces data flows, and produces structured intelligence reports.", color: "#28e7c5", icon: "🔭" },
];

const PRO_AGENTS = [
  { name: "SloerQA", desc: "Relentless testing specialist. Writes unit, integration, and E2E tests to a strict standard.", color: "#ffbf62", icon: "🧪" },
  { name: "SloerDesigner", desc: "Frontend UI/UX specialist. Transforms wireframes and ideas into pixel-perfect, responsive code.", color: "#a855f7", icon: "🎨" },
  { name: "SloerDevOps", desc: "Infrastructure and deployment expert. Manages CI/CD pipelines, Docker, Kubernetes, and cloud infrastructure.", color: "#84cc16", icon: "⚙️" },
];

export default function AgentsLibraryPage() {
  return (
    <>
      {/* Breadcrumb */}
      {/* Free agents */}
      {/* Pro agents */}
      {/* Unlock overlay */}
      <LibraryShowcase
        categoryLabel="Libraries // Agents"
        productName="Agents"
        accent={COBALT}
        description="Pre-configured AI teammates for agentic workflows. Each agent is shaped around a domain, an operating role, and a consistent behavioral profile that helps teams move faster with less randomness."
        ctaHref="/signup?plan=STUDIO"
        ctaLabel="Unlock Studio access"
        supportHref="/pricing"
        supportLabel="Compare plans"
        notice="Agent libraries become much more valuable when they are treated as reusable execution assets instead of ad-hoc prompts hidden across chats and tabs."
        metrics={[
          { label: "Free layer", value: `${FREE_AGENTS.length} agents` },
          { label: "Studio layer", value: `${PRO_AGENTS.length} more` },
          { label: "Use case", value: "Agentic delivery" },
          { label: "Direction", value: "Reusable operators" },
        ]}
        highlights={[
          { title: "Role clarity", desc: "Each agent exists to operate in a defined lane instead of behaving like a vague generalist.", color: COBALT },
          { title: "Operational leverage", desc: "Libraries help teams compose stronger missions faster by reusing the right specialists.", color: "#28e7c5" },
        ]}
        unlockedTitle="Free agents available now"
        unlockedItems={FREE_AGENTS}
        lockedTitle="Studio agents for deeper execution"
        lockedItems={PRO_AGENTS}
        lockedDescription="Unlock the full agent layer to access richer specialists for QA, UI execution, and infrastructure operations."
        finalTitle="Build your operator roster with intention."
        finalDescription="SloerStudio agents are meant to feel like reusable teammates inside a serious product system, not random one-off presets."
      />
    </>
  );
}

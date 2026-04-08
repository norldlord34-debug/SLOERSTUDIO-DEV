import LibraryShowcase from "@/components/libraries/LibraryShowcase";

const COBALT = "#4f8cff";

const SKILLS = [
  { name: "SloerGuard", desc: "Full-stack security audit methodology. Systematic vulnerability scanning and remediation pipeline.", color: "#ff6f96", icon: "🛡️" },
  { name: "SloerBlueprint", desc: "Turn a natural language feature description into a complete implementation plan with architecture decisions.", color: "#4f8cff", icon: "📐" },
  { name: "SloerRecon", desc: "Rapidly map and understand any codebase. Structured methodology to trace data flow and map dependencies.", color: "#28e7c5", icon: "🔭" },
  { name: "SloerAPI", desc: "RESTful API design standards and best practices for creating scalable, well-documented interfaces.", color: "#ffbf62", icon: "⚡" },
  { name: "SloerDB", desc: "Database optimization techniques, indexing strategies, query performance tuning, and schema design.", color: "#a855f7", icon: "🗄️" },
  { name: "SloerReact", desc: "React performance optimization, render cycle management, state management patterns, and component design.", color: "#84cc16", icon: "⚛️" },
];

export default function SkillsLibraryPage() {
  return (
    <LibraryShowcase
      categoryLabel="Libraries // Skills"
      productName="Skills"
      accent={COBALT}
      description="Give agents superpowers through curated methodologies injected into context. Skills encode domain knowledge, review standards, and execution frameworks beyond a base model response."
      ctaHref="/signup?plan=STUDIO"
      ctaLabel="Unlock Studio access"
      supportHref="/pricing"
      supportLabel="Compare plans"
      notice="Skills are one of the strongest leverage surfaces in the ecosystem because they turn good engineering methodology into reusable operating memory."
      metrics={[
        { label: "Methods", value: `${SKILLS.length} skills` },
        { label: "Surface", value: "Agent context" },
        { label: "Goal", value: "Domain leverage" },
        { label: "Direction", value: "Better decisions" },
      ]}
      highlights={[
        { title: "Methodology as product", desc: "A skill packages expert process into something teams can repeatedly apply, not just remember.", color: COBALT },
        { title: "Stronger agent behavior", desc: "Better context injection leads to clearer reasoning, better tradeoffs, and more consistent outcomes.", color: "#28e7c5" },
      ]}
      unlockedTitle="Curated skills available in the library"
      unlockedItems={SKILLS}
      finalTitle="Package expertise so your agents can actually use it."
      finalDescription="SloerStudio skills transform strong domain process into reusable capability that scales across teams, prompts, and missions."
    />
  );
}

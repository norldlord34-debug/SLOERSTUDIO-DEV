import LibraryShowcase from "@/components/libraries/LibraryShowcase";

const COBALT = "#4f8cff";

const PROMPTS = [
  { name: "SloerGuard Sweep", desc: "Run a targeted security audit on a file, endpoint, or module using the SloerGuard methodology.", color: "#ff6f96", icon: "🛡️" },
  { name: "Ship This Feature", desc: "Go from a natural language description to a fully implemented feature with tests and docs.", color: "#4f8cff", icon: "✦" },
  { name: "Recon This Codebase", desc: "Deep-dive into an unfamiliar codebase and produce a structured intelligence report.", color: "#28e7c5", icon: "🔭" },
  { name: "Refactor Component", desc: "Clean up, optimize, and modernize a messy component without breaking existing functionality.", color: "#ffbf62", icon: "⟐" },
  { name: "Generate Tests", desc: "Create a robust test suite for a given function, class, or component.", color: "#a855f7", icon: "🧪" },
  { name: "Perform Code Review", desc: "Act as a strict but helpful senior engineer reviewing a pull request.", color: "#84cc16", icon: "◈" },
];

export default function PromptsLibraryPage() {
  return (
    <LibraryShowcase
      categoryLabel="Libraries // Prompts"
      productName="Prompts"
      accent={COBALT}
      description="Curated prompt systems that standardize agent interactions across real engineering workflows. Each prompt is intended to compress setup time while increasing clarity, repeatability, and outcome quality."
      ctaHref="/signup?plan=STUDIO"
      ctaLabel="Unlock Studio access"
      supportHref="/pricing"
      supportLabel="Compare plans"
      notice="Prompt libraries matter because they turn good operator patterns into reusable infrastructure instead of fragile memory and copy-paste habits."
      metrics={[
        { label: "Templates", value: `${PROMPTS.length} prompt systems` },
        { label: "Usage", value: "Engineering flows" },
        { label: "Goal", value: "Repeatable quality" },
        { label: "Direction", value: "Structured execution" },
      ]}
      highlights={[
        { title: "Reusable systems", desc: "A strong prompt should work as an operating template, not just a one-time message.", color: COBALT },
        { title: "Less randomness", desc: "Prompt libraries reduce variation and make agent behavior easier to scale across teams.", color: "#28e7c5" },
      ]}
      unlockedTitle="Prompt systems available in the library"
      unlockedItems={PROMPTS}
      finalTitle="Turn prompting into product infrastructure."
      finalDescription="SloerStudio prompts are meant to make execution more repeatable, easier to onboard, and more consistent across the whole ecosystem."
    />
  );
}

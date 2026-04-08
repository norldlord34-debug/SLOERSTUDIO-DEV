export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_DURATION_IN_FRAMES = 900;

export type ProductVideoId =
  | "sloerspace"
  | "sloervoice"
  | "sloerswarm"
  | "sloercanvas"
  | "sloermcp"
  | "sloercode";

export type ProductVideoMode = "workspace" | "voice" | "swarm" | "canvas" | "orbit" | "cli";

export type ProductVideoStat = {
  label: string;
  value: string;
};

export type ProductVideoPillar = {
  title: string;
  desc: string;
};

export type ProductVideoStep = {
  title: string;
  desc: string;
};

export type ProductVideoConfig = {
  id: ProductVideoId;
  compositionId: string;
  name: string;
  tag: string;
  headline: string;
  summary: string;
  accent: string;
  secondaryAccent: string;
  tertiaryAccent: string;
  mode: ProductVideoMode;
  runtimeLabel: string;
  cta: string;
  webTitle: string;
  webDescription: string;
  webHighlights: string[];
  stats: ProductVideoStat[];
  pillars: ProductVideoPillar[];
  steps: ProductVideoStep[];
};

export const PRODUCT_VIDEO_IDS: ProductVideoId[] = [
  "sloerspace",
  "sloervoice",
  "sloerswarm",
  "sloercanvas",
  "sloermcp",
  "sloercode",
];

export const PRODUCT_VIDEO_CONFIGS: Record<ProductVideoId, ProductVideoConfig> = {
  sloerspace: {
    id: "sloerspace",
    compositionId: "SloerSpaceMarketingVideo",
    name: "SloerSpace",
    tag: "Flagship workspace",
    headline: "The flagship shell for serious builders.",
    summary:
      "Rust-backed PTY runtime, launch layouts up to 16 sessions, command palette depth, and integrated browser, notebook, preview, SSH, and system tooling in one shell.",
    accent: "#4f8cff",
    secondaryAccent: "#28e7c5",
    tertiaryAccent: "#ffbf62",
    mode: "workspace",
    runtimeLabel: "Command shell // Cross-platform",
    cta: "Launch the flagship shell.",
    webTitle: "SloerSpace — The AI-Native Agentic Workspace for Developers",
    webDescription:
      "Watch the cinematic AI-generated product video for SloerSpace — the flagship agentic workspace with Rust-backed PTY runtime, 1–16 session layouts, and controllable AI workflows. A Sora-era alternative built for developers who ship.",
    webHighlights: ["AI-native agentic workspace", "Rust PTY runtime · 16 sessions", "Controllable AI development workflows"],
    stats: [
      { label: "Runtime", value: "Rust + PTY" },
      { label: "Layouts", value: "1–16 sessions" },
      { label: "Utility depth", value: "Browser / notebook / SSH" },
    ],
    pillars: [
      {
        title: "Launchpad intelligence",
        desc: "Workspace wizard, presets, operator slots, and custom commands make every launch intentional.",
      },
      {
        title: "Persistent execution",
        desc: "Real PTY sessions stream in order, stay inspectable, and scale into a richer operating shell.",
      },
      {
        title: "Desktop depth",
        desc: "Preview, codebase, history, notebook, ports, and browser expand the shell beyond a terminal frame.",
      },
    ],
    steps: [
      { title: "Choose layout", desc: "Pick the working directory and the session shape that matches the mission." },
      { title: "Assign operators", desc: "Route Claude, Codex, Gemini, or custom CLIs into the right slots." },
      { title: "Run the shell", desc: "Operate with live PTY streaming, palette control, and utility jumps." },
    ],
  },
  sloervoice: {
    id: "sloervoice",
    compositionId: "SloerVoiceMarketingVideo",
    name: "SloerVoice",
    tag: "On-device dictation",
    headline: "Private voice power for builders.",
    summary:
      "On-device whisper.rs inference, global shortcuts, transcript vault, profile dictionaries, style controls, and vibe coding flows for VS Code, Cursor, and Windsurf.",
    accent: "#ff6f96",
    secondaryAccent: "#4f8cff",
    tertiaryAccent: "#28e7c5",
    mode: "voice",
    runtimeLabel: "Voice cockpit // Local-first",
    cta: "Talk instead of type.",
    webTitle: "SloerVoice — On-Device Voice-to-Code AI for Developers",
    webDescription:
      "Watch the AI-generated product video for SloerVoice — on-device voice coding powered by whisper.rs. Global hotkeys, transcript vault, and vibe coding workflows for VS Code, Cursor, and Windsurf. Zero cloud latency, total privacy.",
    webHighlights: ["On-device voice-to-code AI", "whisper.rs · zero cloud latency", "Vibe coding for VS Code & Cursor"],
    stats: [
      { label: "Inference", value: "Rust + Whisper" },
      { label: "Controls", value: "PTT + toggle" },
      { label: "Recovery", value: "Vault + undo" },
    ],
    pillars: [
      {
        title: "Privacy by architecture",
        desc: "Audio capture, transcription, and injection stay local instead of depending on cloud inference.",
      },
      {
        title: "Developer-native workflows",
        desc: "Voice pair programming, file tagging, terminal commands, and test-writing flows are already built in.",
      },
      {
        title: "Operational memory",
        desc: "Transcript history, CSV export, metrics, dictionaries, snippets, and style presets create a real voice system.",
      },
    ],
    steps: [
      { title: "Trigger globally", desc: "Start from anywhere with push-to-talk or toggle recording modes." },
      { title: "Transcribe locally", desc: "Run local Whisper models with waveform feedback and speaking telemetry." },
      { title: "Inject and recover", desc: "Paste instantly, then recover output through the vault and undo rails." },
    ],
  },
  sloerswarm: {
    id: "sloerswarm",
    compositionId: "SloerSwarmMarketingVideo",
    name: "SloerSwarm",
    tag: "Multi-agent orchestration",
    headline: "Coordinate AI teams like an operator.",
    summary:
      "Mission-driven orchestration for persistent PTY sessions, role-aware operators, shared directives, and visible handoffs inside the SloerStudio shell.",
    accent: "#28e7c5",
    secondaryAccent: "#4f8cff",
    tertiaryAccent: "#ffbf62",
    mode: "swarm",
    runtimeLabel: "Mission control // Multi-agent",
    cta: "Launch your first coordinated mission.",
    webTitle: "SloerSwarm — Multi-Agent AI Orchestration Platform",
    webDescription:
      "Watch the cinematic AI product video for SloerSwarm — multi-agent orchestration with role-aware operators, mission directives, and persistent PTY sessions. Coordinate AI teams like a director, not a prompt engineer.",
    webHighlights: ["Multi-agent AI orchestration", "Role-aware operator rosters", "Controllable mission workflows"],
    stats: [
      { label: "Mode", value: "Mission control" },
      { label: "Execution", value: "Persistent PTY" },
      { label: "Plan", value: "Studio + Enterprise" },
    ],
    pillars: [
      {
        title: "Role-aware execution",
        desc: "Builder, reviewer, scout, and coordinator roles turn concurrency into clear responsibilities.",
      },
      {
        title: "Mission-first structure",
        desc: "Directives, context, and scoped directories keep the swarm aligned instead of noisy.",
      },
      {
        title: "Visible handoffs",
        desc: "Live dashboard signals make progress, blockers, and coordination legible during execution.",
      },
    ],
    steps: [
      { title: "Choose roster", desc: "Pick the operator set and define what each agent exists to do." },
      { title: "Frame the mission", desc: "Set outcome, quality bar, and working context before launch." },
      { title: "Coordinate live", desc: "Watch the swarm execute with clearer handoffs and runtime visibility." },
    ],
  },
  sloercanvas: {
    id: "sloercanvas",
    compositionId: "SloerCanvasMarketingVideo",
    name: "SloerCanvas",
    tag: "Spatial runtime",
    headline: "The spatial surface for AI threads.",
    summary:
      "A zoomable operating field for persistent threads, visible topology, and visual clustering when stacked panes stop being enough.",
    accent: "#ffbf62",
    secondaryAccent: "#4f8cff",
    tertiaryAccent: "#28e7c5",
    mode: "canvas",
    runtimeLabel: "Canvas shell // Spatial thinking",
    cta: "See the un-scrolled terminal.",
    webTitle: "SloerCanvas — Spatial AI Workspace for Visual Orchestration",
    webDescription:
      "Watch the AI-generated product video for SloerCanvas — a spatial runtime for visual AI thread orchestration. Zoomable topology, 1–12 live views, and persistent runtimes that make complex AI workflows directable and visible.",
    webHighlights: ["Spatial AI orchestration", "Zoomable thread topology", "Directable visual workflows"],
    stats: [
      { label: "Surface", value: "Free-form canvas" },
      { label: "Thread count", value: "1–12 live views" },
      { label: "Stage", value: "Alpha" },
    ],
    pillars: [
      {
        title: "Spatial clustering",
        desc: "Group research, build, QA, and review into visible mission zones instead of hidden pane stacks.",
      },
      {
        title: "Mission topology",
        desc: "Zoom out for system state or zoom in on a single thread without losing the larger picture.",
      },
      {
        title: "Persistent runtimes",
        desc: "Every visual thread still maps to a real active runtime, not a decorative card on a board.",
      },
    ],
    steps: [
      { title: "Open the field", desc: "Launch a visual runtime instead of compressing work into one-dimensional tabs." },
      { title: "Position live threads", desc: "Place builders, scouts, and reviewers where the mission makes the most sense." },
      { title: "Read the whole system", desc: "Navigate the fleet as one visible topology instead of scattered windows." },
    ],
  },
  sloermcp: {
    id: "sloermcp",
    compositionId: "SloerMCPMarketingVideo",
    name: "SloerMCP",
    tag: "Shared context backbone",
    headline: "Shared context for serious toolchains.",
    summary:
      "The context layer that connects prompts, tools, docs, tasks, and agents into a coherent operating graph across the Sloer ecosystem.",
    accent: "#8b5cf6",
    secondaryAccent: "#4f8cff",
    tertiaryAccent: "#28e7c5",
    mode: "orbit",
    runtimeLabel: "Context graph // Shared memory",
    cta: "Connect the stack.",
    webTitle: "SloerMCP — Shared AI Context Graph for Developer Toolchains",
    webDescription:
      "Watch the AI product video for SloerMCP — the shared context backbone connecting prompts, tools, docs, and AI agents into one interoperable graph. The infrastructure layer for controllable AI development workflows.",
    webHighlights: ["AI context graph infrastructure", "Tool interoperability layer", "Controllable agent memory"],
    stats: [
      { label: "Function", value: "Shared memory" },
      { label: "Graph", value: "Tools + docs + agents" },
      { label: "Direction", value: "Ecosystem backbone" },
    ],
    pillars: [
      { title: "Connected context", desc: "Bring prompts, docs, tools, and tasks into one operating graph." },
      { title: "Interoperable systems", desc: "Let product surfaces read from the same context backbone." },
      { title: "Expansion infrastructure", desc: "Support the long-term scaling of the Sloer product family." },
    ],
    steps: [
      { title: "Ingest context", desc: "Bring in the documents, tasks, and tools that matter." },
      { title: "Hydrate agents", desc: "Pass shared memory across the operator stack." },
      { title: "Compound execution", desc: "Keep systems aligned as the ecosystem expands." },
    ],
  },
  sloercode: {
    id: "sloercode",
    compositionId: "SloerCodeMarketingVideo",
    name: "SloerCode",
    tag: "Terminal-first runtime",
    headline: "Direct execution for fast-moving builders.",
    summary:
      "A CLI-native coding runtime for direct command execution, automation flows, and programmable launch paths at serious speed.",
    accent: "#22c55e",
    secondaryAccent: "#4f8cff",
    tertiaryAccent: "#ffbf62",
    mode: "cli",
    runtimeLabel: "CLI runtime // Direct ship path",
    cta: "Ship through the command line.",
    webTitle: "SloerCode — Terminal-First AI Coding Runtime",
    webDescription:
      "Watch the AI-generated product video for SloerCode — a CLI-native coding runtime for direct execution, AI-assisted automation, and programmable launch paths. Ship at terminal speed with controllable AI workflows.",
    webHighlights: ["Terminal-first AI coding", "Direct execution runtime", "Programmable AI launch paths"],
    stats: [
      { label: "Surface", value: "CLI runtime" },
      { label: "Flow", value: "Direct execution" },
      { label: "Speed", value: "Terminal-first" },
    ],
    pillars: [
      { title: "Command-native control", desc: "Keep shipping velocity high through direct execution rather than nested UI friction." },
      { title: "Programmable launch paths", desc: "Compose repeatable delivery flows through scripts and runtime commands." },
      { title: "Serious speed", desc: "Treat the command line as the shortest path between intent and output." },
    ],
    steps: [
      { title: "Write command", desc: "Define the exact runtime path you want to execute." },
      { title: "Run directly", desc: "Move from intent to output without unnecessary UI indirection." },
      { title: "Automate scale", desc: "Turn successful flows into reusable programmable routines." },
    ],
  },
};

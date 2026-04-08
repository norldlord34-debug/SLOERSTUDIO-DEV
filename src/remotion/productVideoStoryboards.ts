import type { ProductVideoId } from "./productVideoConfigs";

export type ProductVideoStoryboard = {
  statementLines: string[];
  chip: string;
  demoCaption: string;
  claimTopLines: string[];
  claimBottomLines: string[];
  ghostWords: string[];
  outroPrimary: string;
  outroAccent: string;
  closeChip: string;
};

export const PRODUCT_VIDEO_STORYBOARDS: Record<ProductVideoId, ProductVideoStoryboard> = {
  sloerspace: {
    statementLines: ["THE AGENTIC WORKSPACE"],
    chip: "~/workspace/start",
    demoCaption: "WARP-SPEED PANE MANAGEMENT",
    claimTopLines: ["THE VIBE CODING"],
    claimBottomLines: ["TERMINAL"],
    ghostWords: ["VIBE CODING", "TERMINAL", "THOUGHT", "BUILD"],
    outroPrimary: "STOP TYPING.",
    outroAccent: "START SHIPPING.",
    closeChip: "sloerstudio / sloerspace",
  },
  sloervoice: {
    statementLines: ["THE NATIVE VOICE-TO-CODE", "ENGINE"],
    chip: "ctrl + space // whisper.rs",
    demoCaption: "LOCAL TRANSCRIPTION INJECTION",
    claimTopLines: ["VOICE TO CODE AT THE"],
    claimBottomLines: ["SPEED OF THOUGHT"],
    ghostWords: ["VIBE CODING", "VOICE TO CODE", "SPEED", "THOUGHT"],
    outroPrimary: "STOP TYPING.",
    outroAccent: "START SPEAKING.",
    closeChip: "sloerstudio / sloervoice",
  },
  sloerswarm: {
    statementLines: ["YOUR AI ENGINEERING TEAM"],
    chip: "mission.launch(team=4)",
    demoCaption: "STRUCTURED TASK BOARD",
    claimTopLines: ["THE MULTI-AGENT"],
    claimBottomLines: ["CODING ENGINE"],
    ghostWords: ["AGENT SWARM", "MULTI-AGENT", "CODING", "SHIP"],
    outroPrimary: "STOP MANAGING.",
    outroAccent: "START SHIPPING.",
    closeChip: "sloerstudio / sloerswarm",
  },
  sloercanvas: {
    statementLines: ["THE SPATIAL RUNTIME", "FOR AI THREADS"],
    chip: "canvas.open(topology=live)",
    demoCaption: "SPATIAL AGENT TOPOLOGY",
    claimTopLines: ["THE OPERATOR"],
    claimBottomLines: ["CANVAS"],
    ghostWords: ["SPATIAL", "THREADS", "TOPOLOGY", "ORBIT"],
    outroPrimary: "STOP STACKING.",
    outroAccent: "START ORCHESTRATING.",
    closeChip: "sloerstudio / sloercanvas",
  },
  sloermcp: {
    statementLines: ["AGENT-TO-AGENT", "INFRASTRUCTURE"],
    chip: "mcp.sloerstudio.ai",
    demoCaption: "SHARED CONTEXT LAYER",
    claimTopLines: ["THE ULTIMATE"],
    claimBottomLines: ["INFRASTRUCTURE"],
    ghostWords: ["KANBAN", "WORKFLOWS", "SHARED CONTEXT", "SYNC"],
    outroPrimary: "STOP FRAGMENTING.",
    outroAccent: "START SYNCING.",
    closeChip: "sloerstudio / sloermcp",
  },
  sloercode: {
    statementLines: ["THE AI NATIVE CODE ENGINE"],
    chip: "~/code/ship",
    demoCaption: "FULL CODEBASE AWARENESS",
    claimTopLines: ["THE AI NATIVE"],
    claimBottomLines: ["CODE ENGINE"],
    ghostWords: ["VIBE CODING", "SOFTWARE", "NEW ERA", "EXECUTION"],
    outroPrimary: "STOP TYPING.",
    outroAccent: "START SHIPPING.",
    closeChip: "sloerstudio / sloercode",
  },
};

import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are the SloerStudio AI assistant — a concise, knowledgeable product advisor embedded inside the SloerStudio web platform.

Your role:
- Explain the benefits and features of whichever SloerStudio product video the user is currently watching.
- Be enthusiastic but grounded — reference real capabilities, not hype.
- Keep answers short (2-4 sentences) unless the user asks for more detail.
- Use the product context provided to give specific, relevant answers.
- If the user asks about pricing, direct them to /pricing.
- You can suggest related products in the Sloer ecosystem when relevant.

Tone: Premium, direct, technically credible. Like a senior product engineer giving a private demo.`;

export async function POST(req: Request) {
  const { messages, productContext }: { messages: UIMessage[]; productContext?: Record<string, unknown> } = await req.json();

  const contextMessage = productContext
    ? `\n\nThe user is currently watching a product video for: ${productContext.name} (${productContext.tag}).\nProduct headline: ${productContext.headline}\nSummary: ${productContext.summary}\nKey highlights: ${(productContext.highlights as string[])?.join(", ") ?? "N/A"}\nRuntime label: ${(productContext.runtimeLabel as string) ?? "N/A"}`
    : "";

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: SYSTEM_PROMPT + contextMessage,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 512,
    temperature: 0.7,
  });

  return result.toUIMessageStreamResponse();
}

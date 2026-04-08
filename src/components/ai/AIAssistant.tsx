"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Sparkles, Loader2 } from "lucide-react";
import type { ProductVideoConfig } from "@/remotion/productVideoConfigs";

const ease = [0.22, 1, 0.36, 1] as const;

type AIAssistantProps = {
  productContext?: Pick<
    ProductVideoConfig,
    "name" | "tag" | "headline" | "summary" | "webHighlights" | "runtimeLabel"
  >;
};

export default function AIAssistant({ productContext }: AIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: productContext
        ? {
            productContext: {
              name: productContext.name,
              tag: productContext.tag,
              headline: productContext.headline,
              summary: productContext.summary,
              highlights: productContext.webHighlights,
              runtimeLabel: productContext.runtimeLabel,
            },
          }
        : undefined,
    }),
  });

  const isStreaming = status === "streaming";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <>
      {/* ── Floating trigger ──────────────────────────────────────────── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ duration: 0.35, ease }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-[110] flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[#0a0c14]/90 text-white shadow-[0_20px_60px_rgba(79,140,255,0.25),0_0_0_1px_rgba(79,140,255,0.12)] backdrop-blur-xl transition-shadow hover:shadow-[0_24px_80px_rgba(79,140,255,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f8cff]"
            aria-label="Open AI assistant"
          >
            <Sparkles size={22} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat panel ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.92, y: 30, filter: "blur(8px)" }}
            transition={{ duration: 0.4, ease }}
            className="fixed bottom-6 right-6 z-[110] flex w-[380px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0c14]/95 shadow-[0_40px_120px_rgba(0,0,0,0.5),0_0_0_1px_rgba(79,140,255,0.08)] backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="SloerStudio AI assistant"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#4f8cff]/25 bg-[#4f8cff]/10 text-[#4f8cff]">
                  <Bot size={18} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Sloer AI</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    {productContext ? productContext.name : "Product advisor"}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-400 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f8cff]"
                aria-label="Close assistant"
              >
                <X size={14} aria-hidden="true" />
              </motion.button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 py-4"
              style={{ maxHeight: 360, minHeight: 200 }}
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03]">
                    <Sparkles size={20} className="text-[#4f8cff]" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-white">
                    {productContext
                      ? `Ask me about ${productContext.name}`
                      : "Ask me about SloerStudio"}
                  </p>
                  <p className="max-w-[260px] text-[11px] leading-5 text-gray-500">
                    {productContext
                      ? `I can explain ${productContext.name}'s features, benefits, and how it fits into the Sloer ecosystem.`
                      : "I can explain any product in the SloerStudio ecosystem."}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease }}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-[18px] px-4 py-3 text-[13px] leading-6 ${
                          isUser
                            ? "rounded-br-lg bg-[#4f8cff]/15 text-white"
                            : "rounded-bl-lg border border-white/8 bg-white/[0.03] text-gray-200"
                        }`}
                      >
                        {msg.parts.map((part, i) =>
                          part.type === "text" ? (
                            <span key={i}>{part.text}</span>
                          ) : null,
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-[18px] rounded-bl-lg border border-white/8 bg-white/[0.03] px-4 py-3">
                      <Loader2 size={14} className="animate-spin text-[#4f8cff]" aria-hidden="true" />
                      <span className="text-[12px] text-gray-400">Thinking…</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-white/8 px-4 py-3"
            >
              <label htmlFor="ai-chat-input" className="sr-only">
                Message the AI assistant
              </label>
              <input
                id="ai-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isStreaming}
                placeholder={
                  productContext
                    ? `Ask about ${productContext.name}…`
                    : "Ask about SloerStudio…"
                }
                className="flex-1 rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-white placeholder-gray-500 outline-none transition-colors focus:border-[#4f8cff]/40 focus:bg-white/[0.05] disabled:opacity-50"
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isStreaming}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#4f8cff]/25 bg-[#4f8cff]/12 text-[#4f8cff] transition-colors hover:bg-[#4f8cff]/20 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f8cff]"
                aria-label="Send message"
              >
                <Send size={16} aria-hidden="true" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

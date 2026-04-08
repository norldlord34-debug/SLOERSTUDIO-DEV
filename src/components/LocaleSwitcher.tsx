"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
] as const;

export default function LocaleSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: string) {
    if (next === locale) return;
    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
      window.location.reload();
    });
  }

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Language selector">
      <Globe size={14} className="text-gray-500" aria-hidden="true" />
      {LOCALES.map(({ code, label }) => {
        const active = code === locale;
        return (
          <motion.button
            key={code}
            role="radio"
            aria-checked={active}
            aria-label={`Switch to ${label}`}
            onClick={() => switchLocale(code)}
            disabled={isPending}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f8cff] ${
              active
                ? "border border-white/15 bg-white/[0.08] text-white"
                : "text-gray-500 hover:text-gray-300"
            } ${isPending ? "opacity-50" : ""}`}
          >
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}

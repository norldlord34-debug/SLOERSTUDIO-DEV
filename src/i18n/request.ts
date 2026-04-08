import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

const SUPPORTED_LOCALES = ["en", "es"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
const DEFAULT_LOCALE: SupportedLocale = "en";

function parseAcceptLanguage(header: string): SupportedLocale {
  const segments = header.split(",").map((s) => {
    const [lang, q] = s.trim().split(";q=");
    return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
  });
  segments.sort((a, b) => b.q - a.q);

  for (const { lang } of segments) {
    const prefix = lang.split("-")[0] as SupportedLocale;
    if (SUPPORTED_LOCALES.includes(prefix)) return prefix;
  }
  return DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const hdrs = await headers();
  const cookieLocale = hdrs.get("cookie")
    ?.split(";")
    .find((c) => c.trim().startsWith("NEXT_LOCALE="))
    ?.split("=")[1]
    ?.trim() as SupportedLocale | undefined;

  const locale: SupportedLocale =
    cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)
      ? cookieLocale
      : parseAcceptLanguage(hdrs.get("accept-language") ?? "");

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

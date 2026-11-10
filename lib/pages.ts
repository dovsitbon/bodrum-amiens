import type { Locale } from "@/lib/locales";

// Pages secondaires et leurs adresses dans chaque langue (doivent correspondre à locales/*.json → pages.<id>.slug).
export const PAGE_IDS = ["carte", "kebab", "tacos", "legal"] as const;
export type PageId = (typeof PAGE_IDS)[number];

export const SLUGS: Record<PageId, Record<Locale, string>> = {
  carte: { fr: "carte", en: "menu" },
  kebab: { fr: "kebab-amiens", en: "kebab-amiens" },
  tacos: { fr: "tacos-amiens", en: "tacos-amiens" },
  legal: { fr: "mentions-legales", en: "legal" },
};

export const pagePath = (id: PageId, lang: Locale) => `/${lang}/${SLUGS[id][lang]}`;

export const pageOfSlug = (slug: string, lang: Locale) => PAGE_IDS.find((id) => SLUGS[id][lang] === slug) ?? null;

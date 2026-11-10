import site from "@/data/site.json";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { formatDay, formatTime, isoDay, price } from "@/lib/format";
import { isItem, ITEMS, SAUCES, unitPrice, type ItemId, type SauceId } from "@/lib/carte";
import { addDays, pickupTimes } from "@/lib/hours";

export const PREFS = ["noOnion", "noSalad", "spicy", "extraSauce"] as const;
export type Pref = (typeof PREFS)[number];
export const MODES = ["takeaway", "onsite"] as const;
export type Mode = (typeof MODES)[number];

export type OrderLine = { item: ItemId; qty: number; sauce: SauceId | "" };
export type Order = { lines: OrderLine[]; mode: Mode; day: string; time: string; prefs: Pref[]; name: string; phone: string; email: string; message: string };

export const emptyLine = (item: ItemId): OrderLine => ({ item, qty: 1, sauce: ITEMS[item].sauce ? SAUCES[0] : "" });

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Jours de retrait proposés : aujourd'hui et les jours suivants qui ont encore un créneau. */
export function pickupDays(now: Date) {
  const today = isoDay(now);
  return Array.from({ length: site.order.daysAhead + 1 }, (_, i) => addDays(today, i)).filter((day) => pickupTimes(day, now, site.order.stepMinutes, site.order.minutesAhead).length > 0);
}

export const pickupSlots = (day: string, now: Date) => pickupTimes(day, now, site.order.stepMinutes, site.order.minutesAhead);

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Nettoie une commande reçue côté serveur : null si elle est incomplète ou hors des heures d'ouverture. */
export function parseOrder(v: unknown, now = new Date()): Order | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const lines = (Array.isArray(o.lines) ? o.lines : []).slice(0, 30).flatMap((l): OrderLine[] => {
    if (!l || typeof l !== "object") return [];
    const x = l as Record<string, unknown>;
    if (!isItem(x.item)) return [];
    const qty = Math.min(Math.max(Math.round(Number(x.qty) || 1), 1), site.order.maxPerLine);
    const sauce = ITEMS[x.item].sauce && SAUCES.includes(x.sauce as SauceId) ? (x.sauce as SauceId) : "";
    return [{ item: x.item, qty, sauce }];
  });
  const day = ISO.test(str(o.day, 10)) ? str(o.day, 10) : "";
  const q: Order = {
    lines,
    mode: MODES.includes(o.mode as Mode) ? (o.mode as Mode) : "takeaway",
    day,
    time: str(o.time, 5),
    prefs: (Array.isArray(o.prefs) ? o.prefs : []).filter((p): p is Pref => PREFS.includes(p as Pref)),
    name: str(o.name, 120),
    phone: str(o.phone, 30),
    email: str(o.email, 160),
    message: str(o.message, 1000),
  };
  // Marge de 10 minutes : le client a pu choisir son heure juste avant qu'elle ne sorte de la liste
  const graceNow = new Date(now.getTime() - 10 * 60_000);
  if (!q.lines.length || !day || !pickupSlots(day, graceNow).includes(q.time) || !q.name || !isPhone(q.phone)) return null;
  if (q.email && !isEmail(q.email)) q.email = "";
  return q;
}

/** Total estimé ; « partial » si un des plats n'a pas encore de prix. */
export function orderTotal(lines: OrderLine[]) {
  let sum = 0;
  let partial = false;
  for (const l of lines) {
    const p = unitPrice(l.item);
    if (p === null) partial = true;
    else sum += p * l.qty;
  }
  return { sum, partial };
}

/** Une ligne en clair : « 2 × Kebab classique (Samouraï) ». */
export function lineLabel(l: OrderLine, d: Dict) {
  return `${l.qty} × ${d.products[l.item].name}${l.sauce ? ` (${d.carte.sauces[l.sauce]})` : ""}`;
}

/** Récapitulatif texte de la commande (e-mail, WhatsApp). */
export function orderText(q: Order, lang: Locale, d: Dict, withContact = true) {
  const m = d.order.mail;
  const c = lang === "fr" ? " :" : ":";
  const { sum, partial } = orderTotal(q.lines);
  const blocks = [
    [`${m.lines}${c}`, ...q.lines.map((l) => `– ${lineLabel(l, d)}`)].join("\n"),
    `${m.mode}${c} ${d.order.mode[q.mode]}\n${m.pickup}${c} ${formatDay(q.day, lang, { weekday: "long", day: "numeric", month: "long" })}, ${formatTime(q.time, lang)}`,
    q.prefs.length ? `${m.prefs}${c} ${q.prefs.map((p) => d.order.prefs[p]).join(", ")}` : "",
    `${m.total}${c} ${price(sum, lang)}${partial ? ` + ${d.carte.priceOnSite.toLowerCase()}` : ""}`,
    withContact ? [`${m.name}${c} ${q.name}`, `${m.phone}${c} ${q.phone}`, q.email ? `${m.email}${c} ${q.email}` : ""].filter(Boolean).join("\n") : "",
    q.message ? `${m.message}${c}\n${q.message}` : "",
  ];
  return blocks.filter(Boolean).join("\n\n");
}

/** Lien WhatsApp (vide tant que le restaurant n'a pas donné de portable : data/site.json → whatsapp). */
export const waLink = (text: string) => (site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : "");

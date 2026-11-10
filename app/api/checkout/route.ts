import site from "@/data/site.json";
import { parseOrder } from "@/lib/order";
import { ITEMS } from "@/lib/carte";
import { getDict, isLocale, type Locale } from "@/lib/i18n";

// Paiement en ligne (Stripe Checkout), PRÉVU MAIS DÉSACTIVÉ : data/site.json → payment.online = false.
// Pour l'activer : payment.online = true et la variable Vercel STRIPE_SECRET_KEY. Les plats sans prix bloquent le paiement en ligne.
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!site.payment.online || !key) return Response.json({ url: null, disabled: true });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const lang: Locale = typeof body.lang === "string" && isLocale(body.lang) ? body.lang : "fr";
  const q = parseOrder(body.order);
  if (!q || q.lines.some((l) => ITEMS[l.item].price === null)) return Response.json({ url: null }, { status: 400 });
  const d = getDict(lang);
  const form = new URLSearchParams({ mode: "payment", success_url: `${site.url}/${lang}?paiement=ok#commander`, cancel_url: `${site.url}/${lang}#commander`, locale: lang });
  q.lines.forEach((l, i) => {
    form.set(`line_items[${i}][quantity]`, String(l.qty));
    form.set(`line_items[${i}][price_data][currency]`, "eur");
    form.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round(ITEMS[l.item].price! * 100)));
    form.set(`line_items[${i}][price_data][product_data][name]`, d.products[l.item].name);
  });
  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/x-www-form-urlencoded" }, body: form });
  const j = (await r.json()) as { url?: string };
  return Response.json({ url: j.url ?? null });
}

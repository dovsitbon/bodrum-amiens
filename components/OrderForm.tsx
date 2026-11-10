"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import site from "@/data/site.json";
import { COUNT_EVENT, ORDER_EVENT, type OrderIntent } from "@/components/OrderLink";
import { CheckIcon, CloseIcon, MinusIcon, PhoneIcon, PlusIcon, WhatsAppIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { fill } from "@/lib/i18n";
import { formatDay, formatTime, isoDay, price } from "@/lib/format";
import { addDays } from "@/lib/hours";
import { categories, ITEMS, SAUCES, unitPrice, type ItemId, type SauceId } from "@/lib/carte";
import { emptyLine, isEmail, isPhone, MODES, orderText, orderTotal, pickupDays, pickupSlots, PREFS, waLink, type Mode, type Order, type OrderLine, type Pref } from "@/lib/order";

type Errors = Partial<Record<"lines" | "day" | "time" | "name" | "phone" | "email" | "send", string>>;
type Sent = { notified: boolean; confirmed: boolean; text: string; email: string };

export function OrderForm() {
  const { lang, d } = useLocale();
  const t = d.order;
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [mode, setMode] = useState<Mode>("takeaway");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [prefs, setPrefs] = useState<Pref[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Sent | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  // Heures recalculées chaque minute : seuls les créneaux encore possibles restent proposés
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const days = useMemo(() => (now ? pickupDays(now) : []), [now]);
  const times = useMemo(() => (now && day ? pickupSlots(day, now) : []), [now, day]);

  useEffect(() => {
    if (!days.length) return;
    if (!day || !days.includes(day)) setDay(days[0]);
  }, [days, day]);
  useEffect(() => {
    if (time && !times.includes(time)) setTime("");
  }, [times, time]);

  const add = (item: ItemId) =>
    setLines((ls) => {
      const same = ls.findIndex((l) => l.item === item);
      if (same >= 0) return ls.map((l, i) => (i === same ? { ...l, qty: Math.min(l.qty + 1, site.order.maxPerLine) } : l));
      return [...ls, emptyLine(item)];
    });

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(ORDER_EVENT);
      if (saved) {
        sessionStorage.removeItem(ORDER_EVENT);
        add((JSON.parse(saved) as OrderIntent).item);
      }
    } catch {}
    const onIntent = (e: Event) => add((e as CustomEvent<OrderIntent>).detail.item);
    window.addEventListener(ORDER_EVENT, onIntent);
    return () => window.removeEventListener(ORDER_EVENT, onIntent);
  }, []);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(COUNT_EVENT, { detail: count }));
  }, [count]);

  const update = (i: number, patch: Partial<OrderLine>) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const togglePref = (p: Pref) => setPrefs((ps) => (ps.includes(p) ? ps.filter((x) => x !== p) : [...ps, p]));

  const total = orderTotal(lines);

  function validate(): Errors {
    const e: Errors = {};
    if (!lines.length) e.lines = t.errors.lines;
    if (!day) e.day = t.errors.day;
    if (!time) e.time = t.errors.time;
    if (!name.trim()) e.name = t.errors.name;
    if (!isPhone(phone)) e.phone = t.errors.phone;
    if (email.trim() && !isEmail(email)) e.email = t.errors.email;
    return e;
  }

  async function submit(ev: FormEvent, pay = false) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.querySelector<HTMLElement>(`[data-err="${Object.keys(e)[0]}"]`)?.focus();
      return;
    }
    const order: Order = { lines, mode, day, time, prefs, name: name.trim(), phone: phone.trim(), email: email.trim(), message: message.trim() };
    setSending(true);
    try {
      // Paiement en ligne (désactivé par défaut : data/site.json → payment.online)
      if (pay) {
        const r = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lang, order }) });
        const j = (await r.json()) as { url?: string };
        if (j.url) {
          window.location.href = j.url;
          return;
        }
      }
      const res = await fetch("/api/order", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lang, order }) });
      const json = (await res.json()) as { ok: boolean; notified?: boolean; confirmed?: boolean };
      if (!res.ok || !json.ok) throw new Error("send");
      setSent({ notified: !!json.notified, confirmed: !!json.confirmed, text: orderText(order, lang, d), email: order.email });
      document.getElementById("commander")?.scrollIntoView({ block: "start" });
    } catch {
      setErrors({ send: t.errors.send });
    } finally {
      setSending(false);
    }
  }

  const call = (
    <a href={`tel:${site.phoneIntl}`} className="btn">
      <PhoneIcon className="h-5 w-5" />
      {t.callCta} · {site.phone}
    </a>
  );

  if (sent) {
    const wa = waLink(sent.text);
    return (
      <div className="fade-in card bg-white p-6 ring-1 ring-line md:p-10" role="status">
        <span className={`flex h-12 w-12 items-center justify-center rounded-full ${sent.notified ? "bg-sea text-white" : "bg-sand text-ink"}`}>{sent.notified ? <CheckIcon className="h-6 w-6" /> : <PhoneIcon className="h-6 w-6" />}</span>
        <h3 className="display mt-5 text-[2rem]">{sent.notified ? t.done.title : t.done.pendingTitle}</h3>
        <p className="lead mt-2">{sent.notified ? t.done.text : t.done.pendingText}</p>
        {sent.confirmed && <p className="mt-2 text-muted">{fill(t.done.mail, { email: sent.email })}</p>}
        <pre className="mt-6 rounded-2xl bg-chaux-deep p-5 font-[family-name:var(--font-body)] text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-ink">{sent.text}</pre>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {call}
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-line">
              <WhatsAppIcon className="h-5 w-5" />
              {t.whatsapp}
            </a>
          )}
          <button
            type="button"
            className="link-line ms-1 min-h-11 font-semibold text-muted"
            onClick={() => {
              setSent(null);
              setLines([]);
              setTime("");
              setPrefs([]);
              setMessage("");
            }}
          >
            {t.done.again}
          </button>
        </div>
      </div>
    );
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`err-${k}`} className="mt-2 text-sm font-semibold text-kebab">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Errors) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `err-${k}` : undefined, "data-err": k });
  const dayLabel = (x: string) => {
    if (!now) return x;
    const today = isoDay(now);
    return x === today ? t.today : x === addDays(today, 1) ? t.tomorrow : formatDay(x, lang, { weekday: "long", day: "numeric" });
  };
  const legend = (n: number, label: string) => (
    <legend className="display mb-4 flex items-center gap-3 text-[1.375rem]">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sea-soft font-[family-name:var(--font-body)] text-[0.875rem] font-semibold text-sea">{n}</span>
      {label}
    </legend>
  );

  return (
    <form onSubmit={(e) => submit(e)} noValidate className="card space-y-10 bg-white p-5 ring-1 ring-line md:p-8">
      {/* 1. Le panier */}
      <fieldset>
        {legend(1, t.cartTitle)}
        {lines.length ? (
          <ul className="divide-y divide-line">
            {lines.map((l, i) => {
              const unit = unitPrice(l.item);
              return (
                <li key={l.item} className="flex flex-wrap items-center gap-x-4 gap-y-3 py-3">
                  <div className="min-w-0 flex-1 basis-40">
                    <p className="font-semibold">{d.products[l.item].name}</p>
                    <p className="text-[0.875rem] text-muted tabular-nums">{unit !== null ? price(unit * l.qty, lang) : d.carte.priceOnSite}</p>
                  </div>
                  {ITEMS[l.item].sauce && (
                    <label className="block w-40">
                      <span className="sr-only">{t.sauce}</span>
                      <select className="field !min-h-10 !py-1.5 text-[0.9375rem]" value={l.sauce} onChange={(e) => update(i, { sauce: e.target.value as SauceId })} aria-label={`${t.sauce} · ${d.products[l.item].name}`}>
                        {SAUCES.map((s) => (
                          <option key={s} value={s}>
                            {d.carte.sauces[s]}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <div className="flex h-10 items-center rounded-full border-[1.5px] border-line" role="group" aria-label={`${t.quantity} · ${d.products[l.item].name}`}>
                    <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-chaux-deep" onClick={() => (l.qty <= 1 ? setLines((ls) => ls.filter((_, j) => j !== i)) : update(i, { qty: l.qty - 1 }))} aria-label={l.qty <= 1 ? t.removeLine : "−1"}>
                      {l.qty <= 1 ? <CloseIcon className="h-3.5 w-3.5" /> : <MinusIcon />}
                    </button>
                    <output className="w-7 text-center font-semibold tabular-nums" aria-live="polite">
                      {l.qty}
                    </output>
                    <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-chaux-deep disabled:opacity-30" onClick={() => update(i, { qty: Math.min(site.order.maxPerLine, l.qty + 1) })} disabled={l.qty >= site.order.maxPerLine} aria-label="+1">
                      <PlusIcon />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-2xl bg-chaux-deep p-4 text-[0.9375rem] text-muted">{t.cartEmpty}</p>
        )}
        <label className="mt-4 block">
          <span className="label">{t.dish}</span>
          <select
            className="field"
            value=""
            onChange={(e) => {
              if (e.target.value) add(e.target.value as ItemId);
            }}
            {...aria("lines")}
          >
            <option value="">{t.pick}</option>
            {categories().map((g) => (
              <optgroup key={g.id} label={d.carte.tabs[g.id]}>
                {g.items.map((id) => (
                  <option key={id} value={id}>
                    {d.products[id].name}
                    {ITEMS[id].price !== null ? ` · ${price(ITEMS[id].price!, lang)}` : ""}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        {err("lines")}
      </fieldset>

      {/* 2. Sur place ou à emporter, et l'heure : seulement aux heures d'ouverture */}
      <fieldset>
        {legend(2, mode === "onsite" ? t.pickupTitleOnsite : t.pickupTitle)}
        <div role="radiogroup" aria-label={t.modeTitle} className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <label key={m} className="chip">
              <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="sr-only" />
              {t.mode[m]}
            </label>
          ))}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <span className="label" id="day-label">
              {t.day}
            </span>
            <div role="radiogroup" aria-labelledby="day-label" aria-describedby={errors.day ? "err-day" : undefined} className="flex flex-wrap gap-2">
              {days.map((x, i) => (
                <label key={x} className="chip">
                  <input type="radio" name="day" value={x} checked={day === x} onChange={() => setDay(x)} className="sr-only" {...(i === 0 ? { "data-err": "day" } : {})} />
                  <span className="first-letter:uppercase">{dayLabel(x)}</span>
                </label>
              ))}
            </div>
            {err("day")}
          </div>
          <label className="block">
            <span className="label">{t.time}</span>
            <select className="field" value={time} onChange={(e) => setTime(e.target.value)} required {...aria("time")}>
              <option value="">—</option>
              {times.map((x) => (
                <option key={x} value={x}>
                  {formatTime(x, lang)}
                </option>
              ))}
            </select>
            {day && now && !times.length && <span className="mt-2 block text-sm text-muted">{t.noSlots}</span>}
            {err("time")}
          </label>
        </div>
      </fieldset>

      {/* 3. Remarques */}
      <fieldset>
        {legend(3, t.prefsTitle)}
        <div className="flex flex-wrap gap-2">
          {PREFS.map((p) => (
            <label key={p} className="chip">
              <input type="checkbox" checked={prefs.includes(p)} onChange={() => togglePref(p)} className="sr-only" />
              {prefs.includes(p) && <CheckIcon className="h-4 w-4" />}
              {t.prefs[p]}
            </label>
          ))}
        </div>
        <label className="mt-5 block">
          <span className="label">{t.message}</span>
          <textarea name="message" className="field min-h-20 resize-y" maxLength={1000} placeholder={t.messagePh} value={message} onChange={(e) => setMessage(e.target.value)} />
        </label>
      </fieldset>

      {/* 4. Coordonnées */}
      <fieldset>
        {legend(4, t.contactTitle)}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label">{t.name}</span>
            <input className="field" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required {...aria("name")} />
            {err("name")}
          </label>
          <label className="block">
            <span className="label">{t.phone}</span>
            <input className="field" name="tel" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required {...aria("phone")} />
            {err("phone")}
          </label>
          <label className="block sm:col-span-2">
            <span className="label">{t.email}</span>
            <input className="field" name="email" type="email" spellCheck={false} inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} {...aria("email")} />
            <span className="mt-1.5 block text-[0.875rem] text-muted">{t.emailHint}</span>
            {err("email")}
          </label>
        </div>
      </fieldset>

      <div className="rounded-2xl bg-sand-soft p-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-semibold">{t.total}</span>
          <span className="display text-[1.75rem] tabular-nums">{price(total.sum, lang)}</span>
        </div>
        {total.partial && <p className="mt-1 text-sm text-muted">{t.totalNote}</p>}
        <button type="submit" className="btn mt-5 w-full" disabled={sending}>
          {sending ? t.sending : t.submit}
        </button>
        {site.payment.online && (
          <button type="button" className="btn-line mt-3 w-full" disabled={sending} onClick={(e) => submit(e as unknown as FormEvent, true)}>
            {t.payOnline}
          </button>
        )}
        <p className="mt-3 text-center text-[0.875rem] text-muted">{t.payNote}</p>
        {errors.send && (
          <div className="mt-5 space-y-4" role="alert">
            <p className="font-semibold text-kebab">{errors.send}</p>
            {call}
          </div>
        )}
      </div>
    </form>
  );
}

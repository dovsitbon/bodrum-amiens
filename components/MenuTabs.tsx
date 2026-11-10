"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale } from "@/components/providers";
import { goToOrder, ORDER_EVENT } from "@/components/OrderLink";
import { Photo, type Tint } from "@/components/Photo";
import { CheckIcon, PlusIcon } from "@/components/icons";
import { categories, ITEMS, SAUCES, type CategoryId, type ItemId } from "@/lib/carte";
import { fill } from "@/lib/i18n";
import { price } from "@/lib/format";

export const TAB_EVENT = "bodrum:tab";

const TINT: Record<string, Tint> = { kebab: "sand", durum: "sand", tacos: "turq", plate: "sky", burger: "sand", menu: "turq", salad: "turq", fries: "sand", can: "sky", bottle: "sky" };

/** Ouvre un onglet de la carte depuis une tuile, puis descend jusqu'à la carte. */
export function openTab(id: CategoryId) {
  window.dispatchEvent(new CustomEvent<CategoryId>(TAB_EVENT, { detail: id }));
  const el = document.getElementById("carte");
  if (!el) return false;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth" });
  return true;
}

function Price({ id }: { id: ItemId }) {
  const { lang, d } = useLocale();
  const p = ITEMS[id].price;
  if (p === null) return <span className="text-[0.8125rem] font-medium text-muted">{d.carte.priceOnSite}</span>;
  return <span className="text-kebab">{price(p, lang)}</span>;
}

/** Bouton « Ajouter » : ajoute le plat à la commande sans quitter la carte (sur une autre page : renvoie à la commande). */
function AddButton({ id, compact = false }: { id: ItemId; compact?: boolean }) {
  const { lang, d } = useLocale();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1400);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <a
      href={`/${lang}#commander`}
      aria-label={fill(d.carte.addLabel, { name: d.products[id].name })}
      onClick={(e) => {
        if (document.getElementById("commander")) {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent(ORDER_EVENT, { detail: { item: id, stay: true } }));
          setDone(true);
        } else goToOrder({ item: id });
      }}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border-[1.5px] font-semibold transition-colors ${done ? "border-sea bg-sea text-white" : "border-ink text-ink hover:bg-ink hover:text-chaux"} ${compact ? "min-h-10 px-3.5 text-[0.875rem]" : "min-h-10 px-4 text-[0.9375rem]"}`}
    >
      {done ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
      <span aria-live="polite">{done ? d.carte.added : d.carte.add}</span>
    </a>
  );
}

/** Carte produit complète : photo (ou dessin), nom, description, prix, ajout direct à la commande. */
function Dish({ id }: { id: ItemId }) {
  const { d } = useLocale();
  const it = ITEMS[id];
  const p = d.products[id];
  return (
    <li className="group flex flex-col">
      <div className="relative">
        <Photo paths={it.photo} alt={p.name} illus={it.illus} tint={TINT[it.illus]} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw" className="arch aspect-[5/4]" illusClassName="h-[42%] w-[42%] transition-transform duration-500 group-hover:-translate-y-1" />
        {(it.star || it.tags.includes("veggie")) && (
          <ul className="absolute start-3 bottom-3 flex flex-wrap gap-1.5">
            {it.star && <li className="tag bg-chaux text-ink">{d.carte.star}</li>}
            {it.tags.includes("veggie") && <li className="tag bg-chaux text-sea-ink">{d.carte.veggie}</li>}
          </ul>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="display text-[1.375rem]">{p.name}</h3>
          <p className="shrink-0 text-[1.0625rem] font-semibold tabular-nums">
            <Price id={id} />
          </p>
        </div>
        <p className="mt-1.5 flex-1 text-[0.9375rem] leading-relaxed text-muted">{p.desc}</p>
        <div className="mt-4">
          <AddButton id={id} />
        </div>
      </div>
    </li>
  );
}

/** Ligne compacte (boissons). */
function Row({ id }: { id: ItemId }) {
  const { d } = useLocale();
  const it = ITEMS[id];
  return (
    <li className="flex items-center gap-4 border-b border-line py-3 last:border-0">
      <Photo paths={it.photo} alt="" illus={it.illus} tint={TINT[it.illus]} sizes="56px" className="h-14 w-14 shrink-0 rounded-full" illusClassName="h-9 w-9" strokeWidth={3.4} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{d.products[id].name}</p>
        <p className="text-[0.875rem] text-muted">{d.products[id].desc}</p>
      </div>
      <p className="font-semibold tabular-nums">
        <Price id={id} />
      </p>
      <AddButton id={id} compact />
    </li>
  );
}

/** La carte, sur une seule page avec onglets. */
export function MenuTabs({ initial = "kebab" }: { initial?: CategoryId }) {
  const { lang, d } = useLocale();
  const cats = categories();
  const [tab, setTab] = useState<CategoryId>(initial);
  const reduce = useReducedMotion();
  const uid = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const on = (e: Event) => setTab((e as CustomEvent<CategoryId>).detail);
    window.addEventListener(TAB_EVENT, on);
    return () => window.removeEventListener(TAB_EVENT, on);
  }, []);

  const current = cats.find((c) => c.id === tab) ?? cats[0];
  const withSauce = current.items.some((id) => ITEMS[id].sauce);

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!n) return;
    e.preventDefault();
    const j = (i + n + cats.length) % cats.length;
    setTab(cats[j].id);
    refs.current[j]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={d.carte.tabsLabel} className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
        {cats.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${c.id}`}
            aria-selected={tab === c.id}
            aria-controls={`${uid}-panel`}
            tabIndex={tab === c.id ? 0 : -1}
            onClick={() => setTab(c.id)}
            onKeyDown={(e) => onKey(e, i)}
            className="relative min-h-11 shrink-0 rounded-full px-4 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors aria-selected:text-white"
          >
            {tab === c.id && <motion.span layoutId={`${uid}-pill`} className="absolute inset-0 rounded-full bg-sea" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }} />}
            {tab !== c.id && <span className="absolute inset-0 rounded-full ring-[1.5px] ring-line ring-inset" aria-hidden="true" />}
            <span className="relative">{d.carte.tabs[c.id]}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${current.id}`} className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={current.id} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: 0.18 }}>
            {withSauce && (
              <p className="mb-8 text-[0.9375rem] text-muted">
                <span className="font-semibold text-ink">
                  {d.carte.sauceTitle}
                  {lang === "fr" ? " : " : ": "}
                </span>
                {SAUCES.map((s) => d.carte.sauces[s]).join(" · ")}
              </p>
            )}
            {current.id === "boissons" ? (
              <ul className="card bg-white px-4 ring-1 ring-line md:px-6">
                {current.items.map((id) => (
                  <Row key={id} id={id} />
                ))}
              </ul>
            ) : (
              <ul className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {current.items.map((id) => (
                  <Dish key={id} id={id} />
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-10 text-[0.875rem] text-muted">
        {d.carte.indicative} {d.carte.allergens}
      </p>
    </div>
  );
}

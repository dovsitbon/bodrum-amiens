import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import site from "@/data/site.json";
import { fill, getDict, isLocale, locales, type Dict, type Locale } from "@/lib/i18n";
import { formatDay } from "@/lib/format";
import { checked, type CategoryId } from "@/lib/carte";
import { PAGE_IDS, pageOfSlug, pagePath, SLUGS, type PageId } from "@/lib/pages";
import { pageJsonLd } from "@/lib/jsonld";
import { MenuTabs } from "@/components/MenuTabs";
import { OrderLink } from "@/components/OrderLink";
import { OpenStatus } from "@/components/OpenStatus";
import { HoursTable } from "@/components/HoursTable";
import { Photo } from "@/components/Photo";
import { Rating } from "@/components/Rating";
import { PhoneIcon, PinIcon } from "@/components/icons";

export function generateStaticParams() {
  return locales.flatMap((lang) => PAGE_IDS.map((id) => ({ lang, slug: SLUGS[id][lang] })));
}
export const dynamicParams = false;

function resolve(lang: string, slug: string): { lang: Locale; id: PageId } | null {
  if (!isLocale(lang)) return null;
  const id = pageOfSlug(slug, lang);
  return id ? { lang, id } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { lang: l, slug } = await params;
  const r = resolve(l, slug);
  if (!r) return {};
  const d = getDict(r.lang);
  const p = d.pages[r.id];
  const description = "metaDescription" in p ? p.metaDescription : d.meta.description;
  return {
    title: p.metaTitle,
    description,
    alternates: {
      canonical: pagePath(r.id, r.lang),
      languages: { ...Object.fromEntries(locales.map((x) => [x, pagePath(r.id, x)])), "x-default": pagePath(r.id, "fr") },
    },
    openGraph: { title: p.metaTitle, description, url: pagePath(r.id, r.lang), images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
    robots: r.id === "legal" ? { index: false, follow: true } : undefined,
  };
}

function OrderBand({ lang, d, title }: { lang: Locale; d: Dict; title: string }) {
  return (
    <div className="card mt-14 flex flex-col items-start gap-5 bg-sea p-6 text-chaux md:flex-row md:items-center md:justify-between md:p-8">
      <div>
        <p className="display text-[1.75rem]">{title}</p>
        <div className="mt-2 text-[0.9375rem] [&_a]:text-chaux">
          <Rating lang={lang} d={d} />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <OrderLink href={`/${lang}#commander`} className="btn-light">
          {d.nav.orderCta}
        </OrderLink>
        <a href={`tel:${site.phoneIntl}`} className="btn-light">
          <PhoneIcon className="h-5 w-5" />
          {d.order.callCta}
        </a>
      </div>
    </div>
  );
}

function Carte({ lang, d }: { lang: Locale; d: Dict }) {
  const p = d.pages.carte;
  return (
    <div className="px-4 pt-10 pb-20 md:px-8 md:pt-16 md:pb-28">
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-8 px-1 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow">{p.eyebrow}</p>
            <h1 className="display mt-3 text-[2.8rem] md:text-[4.2rem]">{p.title}</h1>
            <p className="lead mt-4 max-w-xl">{p.lead}</p>
          </div>
          <div className="card bg-chaux-deep p-5 md:p-6">
            <HoursTable lang={lang} d={d} compact />
            <div className="mt-3 font-semibold">
              <OpenStatus />
            </div>
          </div>
        </header>
        <div className="mt-10">
          <MenuTabs />
        </div>
        <p className="mt-3 text-sm text-muted">{fill(d.carte.checked, { date: formatDay(checked, lang, { day: "numeric", month: "long", year: "numeric" }) })}</p>
        <OrderBand lang={lang} d={d} title={d.order.title} />
      </div>
    </div>
  );
}

/** Pages « Kebab à Amiens » et « Tacos à Amiens » : texte local utile, la partie de la carte concernée, la commande. */
function Local({ lang, d, id }: { lang: Locale; d: Dict; id: "kebab" | "tacos" }) {
  const p = d.pages[id];
  const tab: CategoryId = id === "kebab" ? "kebab" : "tacos";
  return (
    <div className="px-4 pt-10 pb-20 md:px-8 md:pt-16 md:pb-28">
      <div className="mx-auto max-w-7xl">
        <header className="grid items-center gap-10 px-1 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">{p.eyebrow}</p>
            <h1 className="display mt-3 text-[2.8rem] md:text-[4.4rem]">{p.title}</h1>
            <p className="lead mt-5 max-w-xl">{p.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <OrderLink href={`/${lang}#commander`} className="btn">
                {p.cta}
              </OrderLink>
              <a href={site.mapsDir} target="_blank" rel="noopener noreferrer" className="btn-line">
                <PinIcon className="h-5 w-5" />
                {d.nav.route}
              </a>
            </div>
            <div className="mt-6 flex flex-col gap-2 text-[0.9375rem] sm:flex-row sm:gap-6">
              <Rating lang={lang} d={d} />
              <OpenStatus className="font-semibold" />
            </div>
          </div>
          <Photo paths={id === "kebab" ? ["/media/plats/broche.jpg", "/media/plats/berlin-classic.jpg"] : ["/media/plats/tacos-1.jpg"]} alt={id === "kebab" ? d.blocks.kebab.photoNote : p.title} illus={id === "kebab" ? "spit" : "tacos"} tint={id === "kebab" ? "sea" : "turq"} sizes="(min-width: 1024px) 40vw, 100vw" className="arch mx-auto aspect-[4/5] w-full max-w-sm" illusClassName={`h-1/2 w-1/2 max-h-none max-w-none ${id === "kebab" ? "text-chaux" : ""}`} strokeWidth={1.8} />
        </header>

        <div className="mt-16 grid gap-10 border-t border-line pt-12 md:grid-cols-3">
          {p.sections.map((s) => (
            <section key={s.h} className="px-1">
              <h2 className="display text-[1.6rem]">{s.h}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.p}</p>
            </section>
          ))}
        </div>

        <div className="mt-16">
          <MenuTabs initial={tab} />
        </div>
        <p className="mt-6 px-1">
          <Link href={pagePath("carte", lang)} className="link-line font-semibold">
            {d.carte.seeFull}
          </Link>
        </p>
        <OrderBand lang={lang} d={d} title={p.cta} />
      </div>
    </div>
  );
}

function Legal({ d }: { d: Dict }) {
  const p = d.pages.legal;
  const pending = <em className="text-muted">{p.toConfirm}</em>;
  const blocks: [string, React.ReactNode][] = [
    [p.editor, <>{site.legal.company || pending}, {site.address.street}, {site.address.postalCode} {site.address.city} · {site.phone}</>],
    [p.siret, site.legal.siret || pending],
    [p.director, site.legal.director || pending],
    [p.host, site.legal.host],
    [p.data, p.dataText],
    [p.photos, p.photosText],
  ];
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="display text-[2.8rem] md:text-[3.6rem]">{p.title}</h1>
      {blocks.map(([title, body]) => (
        <section key={title} className="mt-9">
          <h2 className="eyebrow">{title}</h2>
          <p className="mt-2 leading-relaxed">{body}</p>
        </section>
      ))}
    </div>
  );
}

export default async function Page({ params }: PageProps<"/[lang]/[slug]">) {
  const { lang: l, slug } = await params;
  const r = resolve(l, slug);
  if (!r) notFound();
  const d = getDict(r.lang);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd(r.lang, r.id)) }} />
      {r.id === "carte" && <Carte lang={r.lang} d={d} />}
      {(r.id === "kebab" || r.id === "tacos") && <Local lang={r.lang} d={d} id={r.id} />}
      {r.id === "legal" && <Legal d={d} />}
    </>
  );
}

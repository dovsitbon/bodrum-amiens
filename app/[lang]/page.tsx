import Link from "next/link";
import site from "@/data/site.json";
import { getDict, isLocale } from "@/lib/i18n";
import { firstImg } from "@/lib/media";
import { pagePath } from "@/lib/pages";
import { homeJsonLd } from "@/lib/jsonld";
import { Reveal } from "@/components/Reveal";
import { OpenStatus } from "@/components/OpenStatus";
import { OrderLink } from "@/components/OrderLink";
import { Tiles } from "@/components/Tiles";
import { MenuTabs } from "@/components/MenuTabs";
import { OrderForm } from "@/components/OrderForm";
import { HoursTable } from "@/components/HoursTable";
import { Photo } from "@/components/Photo";
import { Illus, type IllusName } from "@/components/Illus";
import { Mark } from "@/components/Logo";
import { PhoneIcon, PinIcon, PlusIcon } from "@/components/icons";
import { Rating } from "@/components/Rating";

// Le bandeau et le statut se recalculent côté navigateur ; la page est régénérée chaque heure.
export const revalidate = 3600;

function SectionHead({ eyebrow, title, intro, center = false }: { eyebrow: string; title: string; intro?: string; center?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display mt-3 text-[2.4rem] md:text-[3.4rem]">{title}</h2>
      {intro && <p className="lead mt-4">{intro}</p>}
    </Reveal>
  );
}

const SERVICES: IllusName[] = ["clock", "bag", "clean", "phone"];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;
  const d = getDict(lang);
  const order = `/${lang}#commander`;
  const facade = firstImg(["/media/facade/facade.jpg"]);

  const blocks = [
    { key: "kebab" as const, paths: ["/media/plats/broche.jpg", "/media/plats/berlin-classic.jpg"], illus: "spit" as const, tint: "sea" as const, action: <a href={`/${lang}#carte`} className="btn">{d.blocks.kebab.cta}</a> },
    {
      key: "clean" as const,
      paths: ["/media/salle/comptoir.jpg", "/media/salle/cuisine.jpg"],
      illus: "counter" as const,
      tint: "turq" as const,
      action: (
        <OrderLink href={order} className="btn">
          {d.blocks.clean.cta}
        </OrderLink>
      ),
    },
    {
      key: "visit" as const,
      paths: ["/media/facade/facade.jpg"],
      illus: "facade" as const,
      tint: "sand" as const,
      action: (
        <a href={site.mapsDir} target="_blank" rel="noopener noreferrer" className="btn">
          <PinIcon className="h-5 w-5" />
          {d.blocks.visit.cta}
        </a>
      ),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(lang)) }} />

      {/* 1. Hero plein écran : une grande arche (la photo du kebab, ou en attendant la broche au trait), un titre court, deux boutons */}
      <section className="relative px-4 pt-3 md:px-8 lg:flex lg:min-h-[calc(100svh-7rem)] lg:items-center lg:pt-0">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="order-2 px-1 pb-6 lg:order-1 lg:pb-0">
            <p className="eyebrow rise">{d.hero.eyebrow}</p>
            <h1 className="display rise mt-4 text-[3rem] md:text-[4.4rem] lg:text-[5.2rem]" style={{ animationDelay: "0.05s" }}>
              {d.hero.title}
            </h1>
            <p className="lead rise mt-5 max-w-md" style={{ animationDelay: "0.1s" }}>
              {d.hero.sub}
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.15s" }}>
              <OrderLink href={order} className="btn">
                {d.hero.ctaOrder}
              </OrderLink>
              <a href={`/${lang}#carte`} className="btn-line">
                {d.hero.ctaMenu}
              </a>
            </div>
            <div className="rise mt-6 flex flex-col gap-2 text-[0.9375rem] sm:flex-row sm:flex-wrap sm:gap-x-6" style={{ animationDelay: "0.2s" }}>
              <Rating lang={lang} d={d} />
              <OpenStatus className="font-semibold" />
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <Photo
              paths={["/media/hero/hero.jpg"]}
              alt={d.hero.photoNote}
              illus="spit"
              tint="sea"
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="arch mx-auto h-[38svh] max-h-[34rem] w-full max-w-xl lg:h-[min(72svh,46rem)] lg:max-h-none"
              illusClassName="h-[52%] w-[52%] max-h-none max-w-none text-chaux"
              strokeWidth={1.6}
            />
            <Mark className="absolute -bottom-5 start-1/2 h-10 w-12 -translate-x-1/2 rounded-full bg-chaux px-1.5 text-sea lg:start-6 lg:translate-x-0" strokeWidth={1.8} />
          </div>
        </div>
      </section>

      {/* 2. Tuiles de catégories, en capitales, juste après le hero */}
      <section aria-label={d.tiles.title} className="px-4 pt-14 md:px-8 md:pt-20">
        <h2 className="sr-only">{d.tiles.title}</h2>
        <div className="mx-auto max-w-7xl">
          <Tiles />
        </div>
      </section>

      {/* 3. Bande de services en 4 pictos */}
      <section aria-label={d.services.title} className="px-4 pt-14 md:px-8 md:pt-20">
        <h2 className="sr-only">{d.services.title}</h2>
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 border-y border-line py-8 md:grid-cols-4 md:py-10">
          {d.services.items.map((s, i) => (
            <li key={s.t} className="flex flex-col items-center px-2 text-center">
              <Illus name={SERVICES[i]} className="h-11 w-11 text-sea" strokeWidth={4.4} />
              <p className="mt-3 font-semibold">{s.t}</p>
              <p className="mt-1 text-[0.875rem] text-muted">{s.x}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. La carte, une seule page à onglets, prix en HTML, ajout direct */}
      <section id="carte" className="scroll-mt-20 px-4 pt-20 md:px-8 md:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-5 px-1 md:flex-row md:items-end">
            <SectionHead eyebrow={d.carte.eyebrow} title={d.carte.title} intro={d.carte.intro} />
            <Link href={pagePath("carte", lang)} className="link-line shrink-0 self-start font-semibold md:self-auto">
              {d.carte.seeFull}
            </Link>
          </div>
          <MenuTabs />
        </div>
      </section>

      {/* 5. Commande à emporter */}
      <section id="commander" className="scroll-mt-20 px-4 pt-20 md:px-8 md:pt-28">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-[28px] bg-sea-soft p-4 py-10 md:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:p-14">
          <div className="px-2 md:px-0 lg:sticky lg:top-24 lg:self-start">
            <SectionHead eyebrow={d.order.eyebrow} title={d.order.title} intro={d.order.intro} />
            <Reveal delay={0.05} className="card mt-8 bg-chaux p-6">
              <p className="display text-[1.5rem]">{d.order.callTitle}</p>
              <p className="mt-1 text-muted">{d.order.callText}</p>
              <a href={`tel:${site.phoneIntl}`} className="btn mt-5 w-full sm:w-auto">
                <PhoneIcon className="h-5 w-5" />
                {d.order.callCta} · {site.phone}
              </a>
              <div className="mt-4 flex flex-col gap-1.5 text-[0.9375rem]">
                <OpenStatus />
                <Rating lang={lang} d={d} />
              </div>
            </Reveal>
          </div>
          <OrderForm />
        </div>
      </section>

      {/* 6. Trois blocs alternés : photo + texte court + un seul bouton */}
      <section className="px-4 pt-20 md:px-8 md:pt-32">
        <div className="mx-auto max-w-6xl space-y-20 md:space-y-28">
          {blocks.map((b, i) => {
            const t = d.blocks[b.key];
            return (
              <div key={b.key} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
                <Reveal className={`mx-auto w-full max-w-md ${i % 2 ? "md:order-2" : ""}`}>
                  <Photo paths={b.paths} alt={t.photoNote} illus={b.illus} tint={b.tint} sizes="(min-width: 768px) 44vw, 100vw" className="arch aspect-[4/5]" illusClassName={`h-1/2 w-1/2 max-h-none max-w-none ${b.tint === "sea" ? "text-chaux" : ""}`} strokeWidth={1.8} />
                </Reveal>
                <Reveal delay={0.05} className="px-1">
                  <p className="eyebrow">{t.eyebrow}</p>
                  <h2 className="display mt-3 text-[2.2rem] md:text-[3rem]">{t.title}</h2>
                  <p className="lead mt-4 max-w-md">{t.text}</p>
                  <div className="mt-7">{b.action}</div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Avis : aucun avis inventé, emplacements prêts pour de vrais avis (avec l'accord des clients) */}
      <section id="avis" className="px-4 pt-20 md:px-8 md:pt-32">
        <div className="mx-auto max-w-7xl rounded-[28px] bg-sand-soft px-6 py-14 text-center md:px-10 md:py-20">
          <p className="eyebrow">{d.reviews.eyebrow}</p>
          <p className="display mt-4 text-[4.5rem] text-sea md:text-[6rem]">
            {new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", { minimumFractionDigits: 1 }).format(site.rating.value)}
            <span className="text-[0.4em] text-muted">/5</span>
          </p>
          <h2 className="display mt-2 text-[2rem] md:text-[2.6rem]">{d.reviews.title}</h2>
          <p className="lead mx-auto mt-3 max-w-xl">{d.reviews.intro}</p>
          <ul className="mt-7 flex flex-wrap justify-center gap-2">
            {d.reviews.themes.map((th) => (
              <li key={th} className="rounded-full bg-white px-4 py-2 text-[0.9375rem] font-semibold">
                {th}
              </li>
            ))}
          </ul>
          <div dangerouslySetInnerHTML={{ __html: "<!-- À REMPLIR avec de vrais avis clients (3 maximum, prénom + initiale, avec leur accord). Ne jamais en inventer. -->" }} />
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-line">
              {d.reviews.cta}
            </a>
            <Rating lang={lang} d={d} />
          </div>
        </div>
      </section>

      {/* 8. Infos pratiques */}
      <section id="infos" className="scroll-mt-20 px-4 pt-20 md:px-8 md:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 px-1">
            <SectionHead eyebrow={d.infos.eyebrow} title={d.infos.title} />
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
            <Reveal className="card space-y-7 bg-chaux-deep p-6 md:p-9">
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <p className="eyebrow mb-2">{d.infos.address}</p>
                  <address className="text-lg font-semibold not-italic">
                    {site.address.street}
                    <br />
                    {site.address.postalCode} {site.address.city}
                  </address>
                </div>
                <div>
                  <p className="eyebrow mb-2">{d.infos.phone}</p>
                  <a href={`tel:${site.phoneIntl}`} className="link-line text-lg font-semibold">
                    {site.phone}
                  </a>
                </div>
              </div>
              <div>
                <p className="eyebrow mb-2">{d.infos.hours}</p>
                <HoursTable lang={lang} d={d} />
                <div className="mt-3 font-semibold">
                  <OpenStatus />
                </div>
              </div>
              <div>
                <p className="eyebrow mb-2">{d.infos.access}</p>
                <p className="leading-relaxed text-muted">{d.infos.accessText}</p>
                {d.infos.parkingText && (
                  <>
                    <p className="eyebrow mt-5 mb-2">{d.infos.parking}</p>
                    <p className="leading-relaxed text-muted">{d.infos.parkingText}</p>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={site.mapsDir} target="_blank" rel="noopener noreferrer" className="btn">
                  <PinIcon className="h-5 w-5" />
                  {d.infos.route}
                </a>
                <a href={`tel:${site.phoneIntl}`} className="btn-line">
                  <PhoneIcon className="h-5 w-5" />
                  {d.nav.call}
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.05} className="card flex min-h-96 flex-col bg-chaux-deep">
              {facade && <Photo paths={[facade.src]} alt={d.blocks.visit.photoNote} illus="facade" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[16/9]" />}
              <iframe title={d.infos.mapTitle} src={site.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="min-h-96 w-full flex-1 border-0" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section id="faq" className="px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="px-1">
            <SectionHead eyebrow={d.faq.eyebrow} title={d.faq.title} />
          </div>
          <Reveal delay={0.05}>
            <div className="divide-y divide-line border-y border-line">
              {d.faq.items.map((f) => (
                <details key={f.q} className="group">
                  <summary className="flex min-h-16 items-center justify-between gap-6 py-4 font-[family-name:var(--font-display)] text-[1.25rem] font-medium [font-variation-settings:'SOFT'_100]">
                    {f.q}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sea-soft text-sea">
                      <PlusIcon className="faq-plus h-4 w-4" />
                    </span>
                  </summary>
                  <p className="pe-12 pb-6 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

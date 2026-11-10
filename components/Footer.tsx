import Link from "next/link";
import site from "@/data/site.json";
import { Logo } from "@/components/Logo";
import { HoursTable } from "@/components/HoursTable";
import { PhoneIcon, PinIcon } from "@/components/icons";
import { fill, type Dict, type Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/pages";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const links = [
    [pagePath("carte", lang), d.footer.menu],
    [pagePath("kebab", lang), d.footer.kebab],
    [pagePath("tacos", lang), d.footer.tacos],
    [pagePath("legal", lang), d.footer.legal],
  ];
  return (
    <footer className="bg-ink pb-24 text-chaux md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.1fr_1fr_1.2fr] md:px-10 md:py-20">
        <div>
          <Logo tone="text-chaux" markClassName="h-7 w-8 !text-turq" textClassName="text-[1.6rem]" />
          <p className="mt-5 max-w-xs leading-relaxed text-chaux/75">{d.footer.tagline}</p>
          <ul className="mt-6 space-y-1 text-chaux/80">
            {links.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-9 items-center hover:text-chaux hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="leading-relaxed">
          <p className="eyebrow mb-3 !text-turq">{d.infos.address}</p>
          <address className="text-lg not-italic">
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}
          </address>
          <a href={site.mapsDir} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 text-chaux/80 hover:text-chaux hover:underline">
            <PinIcon className="h-4 w-4" />
            {d.nav.route}
          </a>
          <br />
          <a href={`tel:${site.phoneIntl}`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-turq hover:underline">
            <PhoneIcon className="h-4 w-4" />
            {site.phone}
          </a>
        </div>
        <div className="[&_.text-muted]:text-chaux/60 [&_tr]:border-chaux/15">
          <p className="eyebrow mb-3 !text-turq">{d.infos.hours}</p>
          <HoursTable lang={lang} d={d} compact />
        </div>
      </div>
      <p className="border-t border-chaux/15 px-6 py-6 text-center text-sm text-chaux/70">{fill(d.footer.rights, { year: new Date().getFullYear() })}</p>
    </footer>
  );
}

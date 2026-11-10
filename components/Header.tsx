"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import { Logo } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { OrderLink, useCartCount } from "@/components/OrderLink";
import { CloseIcon, MenuIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";

export function Header() {
  const { lang, d } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const count = useCartCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (menu) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const home = `/${lang}`;
  const order = `${home}#commander`;
  const links = [
    { href: `${home}#carte`, label: d.nav.carte },
    { href: order, label: d.nav.order },
    { href: `${home}#infos`, label: d.nav.infos },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 bg-chaux/95 backdrop-blur-sm transition-shadow duration-300 ${scrolled ? "shadow-[0_1px_0_var(--color-line)]" : ""}`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-10 focus:rounded-full focus:bg-chaux focus:px-4 focus:py-2">
          {d.nav.skip}
        </a>
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 md:h-[4.5rem] md:px-6 xl:px-10">
          <div className="flex items-center">
            <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full lg:hidden" onClick={() => setMenu(true)} aria-label={d.nav.menu} aria-expanded={menu}>
              <MenuIcon className="h-6 w-6" />
            </button>
            <nav className="hidden items-center gap-1 lg:flex" aria-label={d.nav.menu}>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="rounded-full px-3 py-2 text-[0.9375rem] font-medium whitespace-nowrap transition-colors hover:bg-chaux-deep">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href={home} aria-label={d.nav.home} className="block py-1">
            <Logo markClassName="h-6 w-7 md:h-7 md:w-8" textClassName="text-[1.3rem] md:text-[1.5rem]" />
          </Link>

          <div className="flex items-center justify-end gap-1 lg:gap-3">
            <LangSwitch lang={lang} label={d.nav.lang} className="hidden lg:flex" />
            <a href={`tel:${site.phoneIntl}`} className="hidden items-center gap-2 rounded-full px-3 py-2 text-[0.9375rem] font-medium whitespace-nowrap transition-colors hover:bg-chaux-deep xl:inline-flex">
              <PhoneIcon className="h-4 w-4" />
              {site.phone}
            </a>
            <a href={`tel:${site.phoneIntl}`} className="flex h-11 w-11 items-center justify-center rounded-full md:hidden" aria-label={`${d.nav.call} ${site.phone}`}>
              <PhoneIcon className="h-5 w-5" />
            </a>
            <OrderLink href={order} className="btn ms-1 hidden !min-h-11 !px-5 !text-[0.9375rem] whitespace-nowrap md:inline-flex">
              {d.nav.orderCta}
              {count > 0 && <span className="rounded-full bg-chaux px-2 text-[0.8125rem] text-sea tabular-nums">{count}</span>}
            </OrderLink>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fade-in fixed inset-0 z-[60] flex flex-col overscroll-contain bg-chaux text-ink" role="dialog" aria-modal="true" aria-label={d.nav.menu}>
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-3 md:h-[4.5rem] md:px-6">
            <button type="button" className="flex h-11 w-11 items-center justify-center justify-self-start rounded-full" onClick={() => setMenu(false)} aria-label={d.nav.close}>
              <CloseIcon className="h-6 w-6" />
            </button>
            <Logo markClassName="h-6 w-7" textClassName="text-[1.3rem]" />
            <span />
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-2" aria-label={d.nav.menu}>
            {links.map((l, i) => (
              <div key={l.href} className="rise" style={{ animationDelay: `${0.04 * i}s` }}>
                <Link href={l.href} onClick={() => setMenu(false)} className="display block px-4 py-1 text-[2.5rem]">
                  {l.label}
                </Link>
              </div>
            ))}
          </nav>
          {/* Raccourcis : commander, appeler, itinéraire */}
          <div className="grid grid-cols-3 gap-2 px-4 pb-4">
            <OrderLink href={order} className="btn !px-2 !text-[0.9375rem]" onNavigate={() => setMenu(false)}>
              {d.nav.orderCta}
            </OrderLink>
            <a href={`tel:${site.phoneIntl}`} className="btn-line !px-2 !text-[0.9375rem]">
              <PhoneIcon className="h-4 w-4" />
              {d.nav.call}
            </a>
            <a href={site.mapsDir} target="_blank" rel="noopener noreferrer" className="btn-line !px-2 !text-[0.9375rem]">
              <PinIcon className="h-4 w-4" />
              {d.nav.route}
            </a>
          </div>
          <div className="flex items-center justify-center border-t border-line px-4 py-2">
            <LangSwitch lang={lang} label={d.nav.lang} />
          </div>
        </div>
      )}
    </>
  );
}

/** Barre fixée en bas de l'écran sur mobile : « Commander » toujours à portée de pouce, et l'appel. */
export function MobileOrderBar() {
  const { lang, d } = useLocale();
  const count = useCartCount();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-chaux/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden">
      <OrderLink href={`/${lang}#commander`} className="btn flex-1 !px-3 whitespace-nowrap">
        {d.nav.orderCta}
        {count > 0 && <span className="rounded-full bg-chaux px-2 text-[0.8125rem] text-sea tabular-nums">{count}</span>}
      </OrderLink>
      <a href={`tel:${site.phoneIntl}`} className="btn-line !px-4" aria-label={`${d.nav.call} ${site.phone}`}>
        <PhoneIcon className="h-5 w-5" />
        {d.nav.call}
      </a>
    </div>
  );
}

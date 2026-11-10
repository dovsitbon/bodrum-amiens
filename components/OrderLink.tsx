"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { ItemId } from "@/lib/carte";

export const ORDER_EVENT = "bodrum:order";
/** Nombre d'articles dans la commande (diffusé par OrderForm) : affiché sur les boutons « Commander ». */
export const COUNT_EVENT = "bodrum:count";

export function useCartCount() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const on = (e: Event) => setN((e as CustomEvent<number>).detail);
    window.addEventListener(COUNT_EVENT, on);
    return () => window.removeEventListener(COUNT_EVENT, on);
  }, []);
  return n;
}

export type OrderIntent = { item: ItemId };

/** Ajoute un plat au formulaire de commande puis y descend. Sans JavaScript, le lien suffit (#commander). */
export function goToOrder(intent?: OrderIntent) {
  if (intent) window.dispatchEvent(new CustomEvent<OrderIntent>(ORDER_EVENT, { detail: intent }));
  const el = document.getElementById("commander");
  if (!el) {
    // Autre page : le formulaire de l'accueil reprendra la demande à son chargement
    try {
      if (intent) sessionStorage.setItem(ORDER_EVENT, JSON.stringify(intent));
    } catch {}
    return false;
  }
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", "#commander");
  return true;
}

export function OrderLink({ href, intent, className = "", children, label, onNavigate }: { href: string; intent?: OrderIntent; className?: string; children: ReactNode; label?: string; onNavigate?: () => void }) {
  return (
    <a
      href={href}
      aria-label={label}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        if (goToOrder(intent)) e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}

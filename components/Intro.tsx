"use client";

import { useEffect, useState, type CSSProperties } from "react";

const KEY = "bodrum-intro";
const at = (d: number, t?: number) => ({ "--d": `${d}s`, ...(t ? { "--t": `${t}s` } : {}) }) as CSSProperties;

/**
 * Ouverture (1,2 s, une fois par session), tout en CSS (globals.css) : sur fond chaux, un soleil puis une vague
 * se dessinent au trait bleu, « BODRUM » apparaît, puis « KEBAB · TACOS · AMIENS », et fondu sur le hero.
 * Bouton « Passer » ; ignorée si l'utilisateur préfère réduire les animations.
 */
export function Intro({ skipLabel, tagline }: { skipLabel: string; tagline: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      document.documentElement.classList.add("intro-seen");
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  const p = { pathLength: 1, className: "intro-draw" };
  return (
    <div className="intro-curtain flex flex-col items-center justify-center text-sea">
      <svg viewBox="0 0 48 40" className="h-24 w-28 md:h-28 md:w-32" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path {...p} d="M17 24a7 7 0 0 1 14 0" style={at(0, 0.28)} />
        <path {...p} d="M24 9v4M13.5 13.5l2.8 2.8M34.5 13.5l-2.8 2.8M8 24h3M37 24h3" style={at(0.18, 0.2)} />
        <path {...p} d="M4 31c5-4.5 9-4.5 13.3 0s8.7 4.5 13.4 0 8.7-4.5 13.3 0" style={at(0.12, 0.42)} />
      </svg>
      <p className="intro-word mt-4 font-[family-name:var(--font-display)] text-[2.6rem] leading-none font-semibold tracking-[0.1em] text-ink [font-variation-settings:'SOFT'_100] md:text-[3.2rem]" style={at(0.5)} aria-hidden="true">
        BODRUM
      </p>
      <p className="intro-tag mt-3 text-[0.75rem] font-semibold tracking-[0.24em] text-sea" style={at(0.68)} aria-hidden="true">
        {tagline}
      </p>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          document.documentElement.classList.add("intro-seen");
          setGone(true);
        }}
        className="absolute end-4 bottom-4 min-h-11 rounded-full px-4 font-semibold text-muted transition-colors hover:text-ink"
      >
        {skipLabel}
      </button>
    </div>
  );
}

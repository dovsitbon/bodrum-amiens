// Logo typographique provisoire (aucun logo fourni) : « BODRUM » en capitales arrondies (Fraunces, axe SOFT),
// un soleil et une petite vague au trait. Version autonome : public/logo.svg ; favicon : app/icon.svg.
// Pour mettre le vrai logo : remplacez public/logo.svg et app/icon.svg, puis ce composant par une balise <img>.

/** Le soleil et la vague, seuls (favicon, ouverture, détails). */
export function Mark({ className = "h-7 w-8", strokeWidth = 2.4 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 48 40" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 24a7 7 0 0 1 14 0" />
      <path d="M24 9v4M13.5 13.5l2.8 2.8M34.5 13.5l-2.8 2.8M8 24h3M37 24h3" />
      <path d="M4 31c5-4.5 9-4.5 13.3 0s8.7 4.5 13.4 0 8.7-4.5 13.3 0" />
    </svg>
  );
}

export function Logo({ className = "", markClassName = "h-7 w-8", textClassName = "text-[1.45rem]", tone = "text-ink" }: { className?: string; markClassName?: string; textClassName?: string; tone?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} translate="no">
      <Mark className={`text-sea ${markClassName}`} />
      <span className={`font-[family-name:var(--font-display)] leading-none font-semibold tracking-[0.08em] [font-variation-settings:'SOFT'_100] ${tone} ${textClassName}`}>BODRUM</span>
    </span>
  );
}

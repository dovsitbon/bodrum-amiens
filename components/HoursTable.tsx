import { formatTime } from "@/lib/format";
import { weekHours } from "@/lib/hours";
import type { Dict, Locale } from "@/lib/i18n";

/** Horaires de la semaine (data/horaires.json), du lundi au dimanche ; une seule ligne si c'est tous les jours pareil. */
export function HoursTable({ lang, d, compact = false }: { lang: Locale; d: Dict; compact?: boolean }) {
  const week = weekHours();
  const fmt = (slots: [string, string][]) => (slots.length ? slots.map(([a, b]) => `${formatTime(a, lang)} – ${formatTime(b, lang)}`).join(" · ") : d.infos.closed);
  const same = week.every((w) => fmt(w) === fmt(week[0]));
  const rows: [string, string, boolean][] = same ? [[d.infos.everyDay, fmt(week[0]), week[0].length > 0]] : week.map((w, i) => [d.infos.days[i], fmt(w), w.length > 0]);
  return (
    <table className={`w-full ${compact ? "text-[0.9375rem]" : "text-base"}`}>
      <tbody>
        {rows.map(([day, hours, open]) => (
          <tr key={day} className="border-b border-line/70 last:border-0">
            <th scope="row" className="py-2 pe-4 text-start font-normal">
              {day}
            </th>
            <td className={`py-2 text-end font-semibold ${open ? "" : "text-muted"}`}>{hours}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

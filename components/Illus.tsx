import type { Illus as IllusKind } from "@/lib/carte";

// Dessins au trait pour Bodrum. Ils tiennent la place des photos tant que le restaurant n'en a pas fourni
// (voir assets/A-PHOTOGRAPHIER.md) : dès qu'une photo est déposée, elle les remplace. viewBox 0 0 120 120, trait = currentColor.

export type IllusName = IllusKind | "spit" | "counter" | "facade" | "team" | "sun" | "clean" | "clock" | "bag" | "phone";

const P: Record<IllusName, string[]> = {
  kebab: ["M16 78C16 50 36 32 60 32S104 50 104 78Z", "M26 62c5-6 10-6 14 0 4-6 10-6 14 0 4-6 10-6 14 0 4-6 10-6 14 0 4-6 8-6 12 0", "M22 78 30 100H90L98 78", "M44 48l6 4M64 44l4 6M80 50l-6 4"],
  durum: ["M18 82 74 26", "M38 102 94 46", "M74 26C82 18 102 38 94 46", "M80 32c4 2 8 6 9 10", "M18 82c-6 6 14 26 20 20", "M30 96 48 78M24 88 42 70"],
  tacos: ["M22 36h76a6 6 0 0 1 6 6v38a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V42a6 6 0 0 1 6-6Z", "M34 46 44 76M50 46 60 76M66 46 76 76M82 46 90 70", "M30 96H90"],
  plate: ["M22 60a38 38 0 1 0 76 0a38 38 0 1 0-76 0", "M32 60a28 28 0 1 0 56 0a28 28 0 1 0-56 0", "M44 46 50 70M52 44 56 66", "M64 52c8-2 14 4 14 12M62 62c6-2 10 2 10 8", "M48 76c6 4 18 4 24 0"],
  burger: ["M20 54C20 36 40 26 60 26S100 36 100 54Z", "M18 64c6 5 10 5 14 0s10 5 14 0 10 5 14 0 10 5 14 0 10 5 14 0 10 5 14 0", "M20 76H100", "M22 86H98C98 94 92 98 84 98H36C28 98 22 94 22 86Z", "M44 38l4-2M60 34l4 2M74 40l4-2"],
  menu: ["M26 42H94L88 104H32Z", "M44 42V34c0-10 32-10 32 0v8", "M46 74a14 14 0 0 1 28 0", "M40 82c7-5 13 5 20 0s13-5 20 0"],
  salad: ["M16 60H104C104 84 86 100 60 100S16 84 16 60Z", "M30 60c0-12 10-18 20-14M52 60c2-14 16-20 26-12M76 60c4-10 14-12 20-6", "M46 100 48 106H72L74 100", "M40 50a3 3 0 1 0 .1 0M66 46a3 3 0 1 0 .1 0"],
  fries: ["M34 54H86L80 104H40Z", "M42 54 38 22M51 54 49 16M60 54V20M69 54 71 16M78 54 82 24", "M37 70H83"],
  can: ["M38 28H82V98H38Z", "M42 20H78", "M38 36H82M38 90H82", "M38 62c8-6 14 6 22 0s14-6 22 0"],
  bottle: ["M50 12H70V24C70 32 82 36 82 48V100C82 104 78 106 74 106H46C42 106 38 104 38 100V48C38 36 50 32 50 24Z", "M38 60H82M38 84H82", "M48 72c4-3 8 3 12 0s8-3 12 0"],
  spit: ["M60 6V114", "M40 22H80L72 92H48Z", "M42 38H78M44 54H76M46 70H74", "M42 106H78", "M84 40c8 2 12 8 12 16M88 32c12 4 18 14 18 26"],
  counter: ["M10 70H110V104H10Z", "M10 78H110", "M24 70V44H44V70M76 70V50C76 42 96 42 96 50V70", "M30 22H90V36H30Z", "M38 29H82"],
  facade: ["M16 104V40H104V104", "M10 40H110", "M46 104V74C46 64 52 58 60 58S74 64 74 74V104", "M24 54H36V70H24ZM84 54H96V70H84Z", "M88 18a8 8 0 1 0 .1 0"],
  team: ["M40 46a12 12 0 1 0 .1 0M80 46a12 12 0 1 0 .1 0", "M18 104C18 80 28 64 40 64S62 80 62 104", "M58 104C58 80 68 64 80 64S102 80 102 104", "M32 82H48M72 82H88"],
  sun: ["M60 40a20 20 0 1 0 .1 0", "M60 10V22M60 98V110M10 60H22M98 60H110M25 25l8 8M87 87l8 8M25 95l8-8M87 33l8-8"],
  clean: ["M30 40h60l-6 64H36Z", "M44 40V28h32v12", "M52 60v28M68 60v28", "M92 18l4 8 8 4-8 4-4 8-4-8-8-4 8-4Z"],
  clock: ["M60 16a44 44 0 1 0 .1 0", "M60 34V62L78 72", "M60 22v4M60 94v4M22 60h4M94 60h4"],
  bag: ["M26 44H94L88 104H32Z", "M44 44V36c0-10 32-10 32 0v8", "M48 74l8 8 16-16"],
  phone: ["M38 14h44a6 6 0 0 1 6 6v80a6 6 0 0 1-6 6H38a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6Z", "M52 96h16", "M100 40c6 6 6 18 0 24M92 46c3 3 3 9 0 12"],
};

export function Illus({ name, className = "h-24 w-24", strokeWidth = 3 }: { name: IllusName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

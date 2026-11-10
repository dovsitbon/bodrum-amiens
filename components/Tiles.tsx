"use client";

import { useLocale } from "@/components/providers";
import { openTab } from "@/components/MenuTabs";
import { Photo, type Tint } from "@/components/Photo";
import type { IllusName } from "@/components/Illus";
import type { CategoryId } from "@/lib/carte";

type TileId = "kebab" | "tacos" | "assiettes" | "burgers" | "menus" | "boissons";
type Tile = { id: TileId; tab: CategoryId; paths: string[]; illus: IllusName; tint: Tint };

// Une tuile par catégorie, nom en capitales sur la photo (assets/plats/tuile-<catégorie>.jpg, ou la photo du plat phare).
const TILES: Tile[] = [
  { id: "kebab", tab: "kebab", paths: ["/media/plats/tuile-kebab.jpg", "/media/plats/berlin-classic.jpg"], illus: "kebab", tint: "sea" },
  { id: "tacos", tab: "tacos", paths: ["/media/plats/tuile-tacos.jpg", "/media/plats/tacos-1.jpg"], illus: "tacos", tint: "turq" },
  { id: "assiettes", tab: "assiettes", paths: ["/media/plats/tuile-assiettes.jpg", "/media/plats/assiette-classic.jpg"], illus: "plate", tint: "sand" },
  { id: "burgers", tab: "burgers", paths: ["/media/plats/tuile-burgers.jpg", "/media/plats/burger-classic.jpg"], illus: "burger", tint: "sky" },
  { id: "menus", tab: "menus", paths: ["/media/plats/tuile-menus.jpg", "/media/plats/menu-kebab.jpg"], illus: "menu", tint: "sand" },
  { id: "boissons", tab: "boissons", paths: ["/media/plats/tuile-boissons.jpg"], illus: "can", tint: "turq" },
];

export function Tiles() {
  const { lang, d } = useLocale();
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
      {TILES.map((t) => (
        <li key={t.id}>
          <a
            href={`/${lang}#carte`}
            onClick={(e) => {
              if (openTab(t.tab)) e.preventDefault();
            }}
            className="group arch relative block aspect-[3/4]"
          >
            <Photo paths={t.paths} alt="" illus={t.illus} tint={t.tint} sizes="(min-width: 1024px) 16vw, (min-width: 640px) 32vw, 50vw" className="absolute inset-0 h-full w-full" illusClassName="h-[44%] w-[44%] -translate-y-5 transition-transform duration-500 group-hover:-translate-y-7" />
            <span className="absolute inset-x-0 bottom-0 flex min-h-14 items-center justify-center px-2 pb-1 text-center text-[0.8125rem] font-semibold tracking-[0.2em] uppercase">
              <span className={`rounded-full px-3 py-1.5 ${t.tint === "sea" ? "bg-chaux text-ink" : "bg-white/90 text-ink"}`}>{d.tiles.items[t.id]}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

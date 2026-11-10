// Photos du site.
//   npm run media
//
// Prépare pour le web toutes les photos de assets/hero, plats, salle et facade dans public/media/<dossier>/
// (next/image sert ensuite AVIF/WebP à la bonne taille) et note leurs dimensions dans data/media-sizes.json.
// Une photo déposée sous le nom attendu (voir assets/A-PHOTOGRAPHIER.md) remplace d'elle-même le dessin au trait.
// Génère aussi l'image de partage public/og.jpg (1200 × 630) et app/apple-icon.png.
import { mkdir, readdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const CATS = ["hero", "plats", "salle", "facade"];
const exists = (f) => access(f).then(() => true, () => false);

const sizes = {};
for (const cat of CATS) {
  const dir = path.join(ROOT, "assets", cat);
  await mkdir(dir, { recursive: true });
  await mkdir(path.join(ROOT, "public/media", cat), { recursive: true });
  for (const f of (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
    const name = f.replace(/\.\w+$/, "").toLowerCase();
    const max = cat === "hero" ? 2400 : 1600;
    const info = await sharp(path.join(dir, f))
      .rotate()
      .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(path.join(ROOT, "public/media", cat, `${name}.jpg`));
    sizes[`/media/${cat}/${name}.jpg`] = [info.width, info.height];
  }
}
await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");

// Image de partage : à droite la photo du hero si elle existe, sinon une arche bleue avec le soleil et la vague
const MARK = `<path d="M17 24a7 7 0 0 1 14 0"/><path d="M24 9v4M13.5 13.5l2.8 2.8M34.5 13.5l-2.8 2.8M8 24h3M37 24h3"/><path d="M4 31c5-4.5 9-4.5 13.3 0s8.7 4.5 13.4 0 8.7-4.5 13.3 0"/>`;
const heroFile = path.join(ROOT, "assets/hero/hero.jpg");
const archMask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="440" height="560"><path d="M0 220A220 220 0 0 1 440 220V540a20 20 0 0 1-20 20H20a20 20 0 0 1-20-20Z" fill="#fff"/></svg>`);
let right;
if (await exists(heroFile)) {
  right = await sharp(heroFile).rotate().resize(440, 560, { fit: "cover" }).composite([{ input: archMask, blend: "dest-in" }]).png().toBuffer();
} else {
  right = await sharp(
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="440" height="560"><path d="M0 220A220 220 0 0 1 440 220V540a20 20 0 0 1-20 20H20a20 20 0 0 1-20-20Z" fill="#1F5E8C"/>
    <g transform="translate(100 190) scale(5)" fill="none" stroke="#FAF8F4" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round">${MARK}</g></svg>`),
  )
    .png()
    .toBuffer();
}
const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <g transform="translate(70 150) scale(1.6)" fill="none" stroke="#1F5E8C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${MARK}</g>
  <text x="70" y="290" font-family="Georgia, serif" font-size="92" font-weight="700" letter-spacing="8" fill="#13283A">BODRUM</text>
  <text x="72" y="345" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="5" fill="#1F5E8C">KEBAB · TACOS · AMIENS</text>
  <text x="72" y="430" font-family="Arial, sans-serif" font-size="26" fill="#13283A">Chaussée Jules Ferry, 80090 Amiens</text>
  <text x="72" y="470" font-family="Arial, sans-serif" font-size="26" fill="#13283A">Tous les jours, 11 h – minuit</text>
  <text x="72" y="510" font-family="Arial, sans-serif" font-size="26" fill="#4A5866">À emporter · 09 84 71 29 70</text>
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#FAF8F4" } })
  .composite([
    { input: right, left: 700, top: 35 },
    { input: text, left: 0, top: 0 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

await sharp(path.join(ROOT, "app/icon.svg"), { density: 600 }).resize(180, 180).png().toFile(path.join(ROOT, "app/apple-icon.png"));

console.log(`${Object.keys(sizes).length} photo(s) prête(s), og.jpg et apple-icon.png générés`);

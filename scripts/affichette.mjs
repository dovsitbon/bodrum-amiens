// Affichette A5 imprimable (PDF) avec QR code vers le site, pour le comptoir ou la vitrine.
//   npm run affichette   →   print/affichette-bodrum-a5.pdf
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const site = JSON.parse(await readFile(path.join(ROOT, "data/site.json"), "utf8"));
const url = `${site.url}/fr`;

const hex = (h) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const CHAUX = hex("#FAF8F4");
const INK = hex("#13283A");
const SEA = hex("#1F5E8C");
const SAND = hex("#E8D7B5");
const MUTED = hex("#4A5866");

const pdf = await PDFDocument.create();
pdf.setTitle("Bodrum, kebab et tacos à Amiens : affichette A5");
pdf.setAuthor("Bodrum");
const W = 419.53;
const H = 595.28;
const page = pdf.addPage([W, H]);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
const sans = await pdf.embedFont(StandardFonts.Helvetica);
const serif = await pdf.embedFont(StandardFonts.TimesRomanBold);

page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: CHAUX });

// Haut : arche bleue avec le soleil et la vague au trait (rasterisés depuis le SVG)
const MARK = `<path d="M17 24a7 7 0 0 1 14 0"/><path d="M24 9v4M13.5 13.5l2.8 2.8M34.5 13.5l-2.8 2.8M8 24h3M37 24h3"/><path d="M4 31c5-4.5 9-4.5 13.3 0s8.7 4.5 13.4 0 8.7-4.5 13.3 0"/>`;
const archW = 220;
const archH = 170;
const arch = await sharp(
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${archW * 3}" height="${archH * 3}" viewBox="0 0 ${archW} ${archH}">
  <path d="M0 110A110 110 0 0 1 220 110V170H0Z" fill="#1F5E8C"/>
  <g transform="translate(62 50) scale(2)" fill="none" stroke="#FAF8F4" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${MARK}</g></svg>`),
)
  .png()
  .toBuffer();
page.drawImage(await pdf.embedPng(arch), { x: (W - archW) / 2, y: H - 36 - archH, width: archW, height: archH });

const center = (text, font, size, y, color = INK) => page.drawText(text, { x: (W - font.widthOfTextAtSize(text, size)) / 2, y, size, font, color });

let y = H - 36 - archH - 46;
center("BODRUM", serif, 40, y);
y -= 22;
center("KEBAB  ·  TACOS  ·  AMIENS", bold, 10, y, SEA);
y -= 34;
center("Commandez à emporter", bold, 19, y);
y -= 17;
center("Scannez, choisissez, passez récupérer.", sans, 11, y, MUTED);

// QR code dans un cadre sable
const qrS = 112;
y -= 22 + qrS;
page.drawRectangle({ x: (W - qrS) / 2 - 12, y: y - 12, width: qrS + 24, height: qrS + 24, color: rgb(1, 1, 1), borderColor: SAND, borderWidth: 3 });
const qrPng = await QRCode.toBuffer(url, { margin: 0, width: 600, color: { dark: "#13283A", light: "#FFFFFF" }, errorCorrectionLevel: "M" });
page.drawImage(await pdf.embedPng(qrPng), { x: (W - qrS) / 2, y, width: qrS, height: qrS });
y -= 30;
center(url.replace(/^https?:\/\//, ""), bold, 9.5, y, SEA);

// Bandeau bleu : horaires et téléphone
y -= 28;
page.drawRectangle({ x: 28, y: y - 34, width: W - 56, height: 46, color: SEA });
center("Ouvert tous les jours, de 11 h à minuit", bold, 11, y - 6, CHAUX);
center(`Par téléphone : ${site.phone}`, sans, 10, y - 22, CHAUX);

y -= 58;
center(`Chaussée Jules Ferry, ${site.address.postalCode} ${site.address.city}  ·  Sur place ou à emporter`, sans, 8.5, y, MUTED);

await mkdir(path.join(ROOT, "print"), { recursive: true });
const file = path.join(ROOT, "print/affichette-bodrum-a5.pdf");
await writeFile(file, await pdf.save());
console.log("affichette prête :", file, url);

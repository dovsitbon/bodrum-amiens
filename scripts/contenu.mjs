// Génère CONTENU.md : tous les textes du site (FR et EN) et la carte avec les prix, pour validation par Bodrum.
//   npm run contenu
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const read = async (f) => JSON.parse(await readFile(path.join(ROOT, f), "utf8"));
const fr = await read("locales/fr.json");
const en = await read("locales/en.json");
const carte = await read("data/carte.json");
const site = await read("data/site.json");
const eur = (n) => (n === null ? "**À REMPLIR**" : `${n.toFixed(2).replace(".", ",")} €`);

const out = [];
const h = (s) => out.push("", s, "");
out.push(
  "# CONTENU du site Bodrum — à valider",
  "",
  `Généré le ${new Date().toISOString().slice(0, 10)} par \`npm run contenu\`. Corrigez directement ce document ou dites-nous les changements : on les reporte dans \`locales/fr.json\`, \`locales/en.json\` et \`data/*.json\`.`,
  "",
  "Tout ce qui est marqué **À REMPLIR** ou **À CONFIRMER** manque encore.",
);

h("## 1. Grand titre de l'accueil (3 propositions)");
out.push(
  `1. **${fr.hero.title}** (en ligne actuellement) — EN : ${en.hero.title}`,
  "2. **Généreux, frais, propre.** — EN : Generous, fresh, clean.",
  "3. **Bodrum, le soleil en plus.** — EN : Bodrum, with a little extra sun.",
  "",
  `Petite ligne : ${fr.hero.eyebrow}`,
  `Sous-titre : ${fr.hero.sub}`,
);

h("## 2. Coordonnées");
out.push(
  `- Adresse : ${site.address.street}, ${site.address.postalCode} ${site.address.city} — **numéro À CONFIRMER** (109 d'après Uber Eats ; la même fiche indique aussi 185)`,
  `- Téléphone : ${site.phone} (fixe : pas de WhatsApp tant qu'on n'a pas de portable)`,
  "- Horaires : tous les jours, 11 h – minuit (**À CONFIRMER**, fichier `data/horaires.json`)",
  `- Note Google : ${site.rating.value}/5 sur ${site.rating.count} avis (relevée le ${site.rating.checked})`,
  `- E-mail pour recevoir les commandes : ${site.email || "**À REMPLIR**"}`,
  "- Stationnement : **À REMPLIR**",
);

h("## 3. La carte et les prix");
out.push("Prix relevés le 10/11/2026 sur Uber Eats (« Grill Bodrum, 109 Chaussée Jules Ferry ») : **À CONFIRMER**. Les prix Uber Eats sont souvent plus élevés qu'au comptoir. Les tacos et les menus ne figurent pas sur Uber Eats : composition et prix **À REMPLIR**.", "");
for (const c of carte.categories) {
  out.push(`### ${fr.carte.tabs[c.id]} / ${en.carte.tabs[c.id]}`, "", "| Plat | Prix | Description (FR) | EN |", "|---|---|---|---|");
  for (const id of c.items) out.push(`| ${fr.products[id].name} | ${eur(carte.items[id].price)} | ${fr.products[id].desc} | ${en.products[id].name} — ${en.products[id].desc} |`);
  out.push("");
}
out.push(`Sauces proposées (**À CONFIRMER**) : ${carte.sauces.map((s) => fr.carte.sauces[s]).join(", ")}.`);

h("## 4. Textes de l'accueil");
out.push(`**Bandeau :** ${(await read("data/annonces.json")).default.fr}`, "");
out.push("**Bande de services :**", ...fr.services.items.map((s) => `- ${s.t} — ${s.x}`), "");
for (const k of ["kebab", "clean", "visit"]) {
  const b = fr.blocks[k];
  out.push(`**${b.eyebrow} — ${b.title}**`, b.text, `Bouton : ${b.cta}`, "");
}
out.push(`**Avis :** ${fr.reviews.title} ${fr.reviews.intro}`, "Aucun avis n'est inventé. Emplacement prévu pour 3 vrais avis Google, avec l'accord des clients : **À REMPLIR**.", "");
out.push(`**Commande :** ${fr.order.title} ${fr.order.intro}`);

h("## 5. FAQ (à valider)");
for (const f of fr.faq.items) out.push(`**${f.q}**`, f.a, "");

h("## 6. Pages référencement");
for (const id of ["kebab", "tacos"]) {
  const p = fr.pages[id];
  out.push(`### ${p.title} (/fr/${p.slug})`, "", `Titre Google : ${p.metaTitle}`, `Description : ${p.metaDescription}`, "", p.lead, "");
  for (const s of p.sections) out.push(`**${s.h}** — ${s.p}`, "");
}

h("## 7. Référencement de l'accueil");
out.push(`- FR : ${fr.meta.title}`, `  ${fr.meta.description}`, `- EN : ${en.meta.title}`, `  ${en.meta.description}`);

h("## 8. Mentions légales");
out.push(`Raison sociale : ${site.legal.company || "**À REMPLIR**"} · SIRET : ${site.legal.siret || "**À REMPLIR**"} · Directeur de la publication : ${site.legal.director || "**À REMPLIR**"}`);

await writeFile(path.join(ROOT, "CONTENU.md"), out.join("\n") + "\n");
console.log("CONTENU.md écrit");

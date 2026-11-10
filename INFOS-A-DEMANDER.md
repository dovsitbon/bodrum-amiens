# Infos à demander à Bodrum

À cocher au fur et à mesure. Chaque info remplace un « à remplir » du site (fichier indiqué).

- [ ] **Son prénom et son histoire** : depuis quand, pourquoi « Bodrum », d'où vient la recette du kebab → bloc « Le kebab maison » (`locales/*.json` → blocks.kebab)
- [ ] **La carte complète et les prix au comptoir** (photo de la carte affichée suffit) → `data/carte.json`
  - les prix actuels viennent d'Uber Eats (« Grill Bodrum, 109 Chaussée Jules Ferry ») : est-ce bien lui ? prix identiques au comptoir ?
  - tacos : tailles, nombre de viandes, viandes proposées, prix
  - menus : compositions et prix (kebab, tacos, enfant…)
  - sauces proposées
- [ ] **Les horaires exacts** (vraiment 11 h – minuit tous les jours ? fermetures dans l'année ?) → `data/horaires.json`, `data/annonces.json`
- [ ] **Le numéro exact sur la chaussée Jules Ferry** (109 ? 185 ?) → `data/site.json`
- [ ] **Un portable pour WhatsApp** → `data/site.json` → whatsapp
- [ ] **L'e-mail** qui recevra les commandes → variable Vercel `ORDER_NOTIFY_EMAIL` (+ `RESEND_API_KEY`)
- [ ] **Des photos** : plats, cuisine/comptoir, façade, équipe (voir `assets/A-PHOTOGRAPHIER.md`)
- [ ] **Le logo** (fichier ou photo nette de l'enseigne) → `public/logo.svg`, `app/icon.svg`
- [ ] **SIRET**, raison sociale, nom du responsable → `data/site.json` → legal
- [ ] Stationnement : où se garer ? → `locales/*.json` → infos.parkingText
- [ ] Moyens de paiement acceptés (carte, espèces, titres-restaurant ?) → FAQ
- [ ] Accord pour reprendre 3 vrais avis Google sur le site
- [ ] Paiement en ligne souhaité ? (prévu, désactivé)

# Photos à prendre sur place

Déposez chaque photo sous le nom indiqué, puis lancez `npm run media` : le dessin au trait est remplacé automatiquement.
Lumière du jour, sans visages de clients. Format libre (JPG), le script redimensionne.

| Fichier | Où elle apparaît |
|---|---|
| `assets/hero/hero.jpg` | Grande arche de l'accueil (+ image de partage) : un kebab en gros plan, vertical |
| `assets/plats/broche.jpg` | Bloc « Le kebab maison » et page Kebab à Amiens : la broche, tranchée |
| `assets/plats/<id>.jpg` | Chaque plat de la carte (ex. `berlin-classic.jpg`, `tacos-1.jpg`, `assiette-classic.jpg`, `burger-classic.jpg`) : identifiants dans `data/carte.json` |
| `assets/plats/tuile-<catégorie>.jpg` | Tuiles sous le hero : `tuile-kebab`, `tuile-tacos`, `tuile-assiettes`, `tuile-burgers`, `tuile-menus`, `tuile-boissons` |
| `assets/salle/comptoir.jpg` | Bloc « Propreté » : le comptoir, la cuisine propre |
| `assets/facade/facade.jpg` | Bloc « Venir chez nous » et Infos pratiques : la façade et l'enseigne |
| `assets/salle/equipe.jpg` | (prévu) l'équipe derrière le comptoir |

Les photos brutes (ex. Google Maps) vont dans `assets/raw/` (non versionné).

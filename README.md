# Réserve 1862 — landing page & plan de réservation interactif

Landing page statique (HTML / CSS / JS, sans build ni dépendance) pour le club
**Réserve 1862** à Strasbourg, avec un module de réservation de tables construit
sur le plan réel de l'établissement.

## Lancer le site

Aucune installation. Ouvrez `index.html`, ou servez le dossier :

```bash
npx http-server -p 8080
# puis http://localhost:8080
```

Un simple serveur statique suffit (Netlify, Vercel, GitHub Pages, nginx…).

## Structure

```
index.html               structure des sections + squelette SVG du plan (murs, bar, DJ, escalier)
assets/css/fonts.css     @font-face — Inter & Syne auto-hébergées (aucun appel à Google Fonts)
assets/css/styles.css    design system, plan, drawer, responsive
assets/js/data.js        ⇽ données éditables : zones/tables, soirées, packs bouteilles
assets/js/app.js         rendu du plan, statuts, drawer, agenda, compte à rebours
assets/fonts/            woff2 (sous-ensembles latin / latin-ext)
```

## Le module de réservation

- **Plan vectoriel** reprenant l'agencement : cabine DJ, carrés VIP 1 & 2 face au DJ,
  carrés VIP 3 & 4 le long du mur droit, ligne de banquettes VIP côté gauche,
  tables hautes autour du dancefloor, bar central bas, lounge 4 tables en bas à gauche,
  escalier / accès en bas à droite.
- **4 statuts** : libre (contour clair, survol doré), sélectionnée, demande envoyée
  (contour doré pointillé), complet (croix rouge + grisé). Les zones non réservables
  (bar, DJ, escalier) ne sont pas cliquables.
- **Sélecteur de soirée** : la disponibilité change par date (`EVENTS[].reserved`).
- **Drawer latéral** au clic : zone, capacité, minimum de consommation, pack recommandé,
  formulaire (nom, téléphone, convives, magnum / pack, précisions, conditions d'entrée),
  écran de confirmation avec référence. Une table complète propose une liste d'attente.
- **Vue Liste** (bouton Plan / Liste) : même modèle de données, plus confortable sur mobile.
- **Accessibilité** : tables focusables au clavier (Tab + Entrée/Espace), `aria-label` par
  table, focus piégé et restitué par le drawer, fermeture à Échap, `prefers-reduced-motion`
  respecté.

### Personnaliser

Tout se pilote depuis `assets/js/data.js` :

| Constante | Rôle |
|---|---|
| `ZONES`  | tables : `id`, `code`, `name`, `capacity`, `min`, `pack`, `desc` et `geo` (coordonnées dans le viewBox `0 0 1000 900` du plan) |
| `EVENTS` | soirées : libellé, date ISO (compte à rebours du hero), line-up, et `reserved` = liste des tables déjà complètes |
| `PACKS`  | carte bouteilles, réutilisée dans la section « Carte & Bouteilles » et dans le formulaire |

Ajouter une table = ajouter un objet à `ZONES` (le SVG et la vue Liste se régénèrent),
puis la ranger dans le bon groupe de `renderList()` (`app.js`).

## Démo vs production

Le formulaire **n'envoie rien à un serveur** : les demandes sont stockées dans le
`localStorage` du navigateur (clé `r1862.demo.bookings.v1`), ce qui permet de tester
tout le parcours. Le lien « Réinitialiser la démo » en pied de page efface ces données.

Pour passer en production, remplacer le bloc d'enregistrement de `bindDrawerForm()`
(`app.js`) par un `fetch()` vers votre API / CRM, et servir les disponibilités
depuis le back-office plutôt que depuis `EVENTS[].reserved`.

### Contenus à remplacer avant mise en ligne

Valeurs d'exemple utilisées pour la maquette : téléphone `+33 6 00 00 00 00`,
e-mail `reservations@reserve1862.fr`, adresse (volontairement non précisée),
horaires, minimums de consommation, prix des packs, line-ups et dates des soirées.

## Notes

- Polices **Inter** et **Syne** auto-hébergées (SIL Open Font License 1.1) : rendu
  identique hors ligne, aucune requête tierce, pas de bandeau cookies pour les fonts.
- Ambiances du hero générées en CSS (dégradés, faisceaux, bokeh, grain) — remplaçables
  par une vidéo ou des photos en éditant `.hero__stage` dans `index.html` / `styles.css`.
- Testé sous Chromium (desktop 1440px, mobile 390px) : aucune erreur console,
  aucun débordement horizontal.

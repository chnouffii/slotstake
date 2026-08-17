# RÉSERVE 1862 — private club · Strasbourg

Site et module de réservation de tables du club **Réserve 1862**.
Direction artistique brutaliste : obsidienne, infra-red, chrome liquide, grain
argentique, typographie display ultra-large et monospace d’ingénierie.

Pièce maîtresse : un **blueprint nocturne** de la salle. Chaque table est un bloc
de verre fumé aux arêtes nettes ; les tables libres respirent en rouge, les
tables prises portent un `[ TAKEN ]`. Au survol, la salle s’assombrit et le bloc
ciblé s’isole. Au clic, un **volet latéral asymétrique** glisse depuis la droite
pour valider l’accès VIP.

## Stack

React 19 · Vite 8 · Tailwind CSS 4 · Framer Motion · Lucide Icons.
Polices auto-hébergées (Archivo Expanded + JetBrains Mono, SIL OFL) : aucune
requête vers un tiers.

```bash
npm install
npm run dev       # développement — http://localhost:5173
npm run build     # production → dist/
npm run preview   # sert dist/ sur http://localhost:4173
```

`vite.config.js` utilise `base: './'` : le dossier `dist/` se déploie tel quel à
la racine d’un domaine, dans un sous-dossier, ou sur un hébergeur statique
(Netlify, Vercel, GitHub Pages, nginx). Le build est versionné dans `dist/` pour
pouvoir publier sans repasser par la chaîne d’outils.

## Arborescence

```
src/
  data/venue.js              ⇽ source unique : salle, tables, soirées, packs
  state/VenueContext.jsx     réservations, soirée active, survol, toast, flash
  state/CursorContext.jsx    libellé et variante du curseur contextuel
  hooks/                     useMagnetic · useCountdown · useFinePointer · useLockBody
  components/
    Hero.jsx                 titre display, marquee cinétique, compteur LED
    LedCountdown.jsx         afficheur à segments éteints + ligne de balayage
    CursorLayer.jsx          halo volumétrique + anneau + étiquette
    Grain.jsx / Flash.jsx    grain animé · flash au clic
    plan/Blueprint.jsx       plan SVG : murs, cotations, zones, piste
    plan/TableBlock.jsx      un bloc de table + états + réticule
    plan/PlanConsole.jsx     colonne technique : occupation, tables libres, légende
    plan/EventBar.jsx        sélecteur de soirée (surlignage animé `layoutId`)
    booking/BookingDrawer.jsx volet latéral, filigrane, specs, validation
    booking/BottleConsole.jsx sélecteur de bouteilles façon console audio
    ui/MagneticButton.jsx    bouton magnétique + balayage chromé
    ui/Marquee.jsx           bandeau cinétique en boucle continue
```

## Le module de réservation

- **États des tables** — `DISPONIBLE` (arête chrome + respiration rouge),
  `DEMANDE ENVOYÉE` (pointillé rouge), `COMPLET` (opacité réduite, `[ TAKEN ]`).
- **Survol** — zoom doux du bloc, réticule aux quatre angles, reste de la salle à
  14 % d’opacité, étiquette `VIP 02 — DISPONIBLE` accrochée au curseur.
- **Volet latéral** — numéro de table en filigrane géant, badge
  `[ DISPONIBILITÉ : VALIDÉE ]`, grille monospace (capacité, minimum, emplacement,
  niveau acoustique), sélecteur de bouteilles à témoins LED et bargraph, compteur
  de convives borné par la capacité, CTA pleine largeur à balayage chromé
  « VALIDER L’ACCÈS VIP », puis écran de confirmation avec référence.
  Table complète → bascule en liste d’attente.
- **Console latérale** — soirée active, barre d’occupation, accès direct aux
  tables libres (synchronisé avec le survol du plan), légende.
- **Micro-interactions** — flash lumineux bref et vibration courte au clic
  (`navigator.vibrate`), curseur magnétique sur les boutons, transitions de dates
  en `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Accessibilité** — blocs focusables (Tab), activables (Entrée / Espace), piège
  à focus et fermeture Échap dans le volet, libellés ARIA sur chaque table,
  curseur natif conservé au tactile, `prefers-reduced-motion` respecté.

### Personnaliser

Tout part de `src/data/venue.js` :

| Constante | Rôle |
|---|---|
| `ROOM`   | murs, raccords d’alcôves, piste, mobilier fixe (DJ, bar, escalier), cotations et repères de zones |
| `ZONES`  | tables : `code`, `name`, `capacity`, `min`, `packIds`, `includes`, `acoustics` et `plan` = `{x, y, w, h}` dans le viewBox du blueprint |
| `EVENTS` | soirées : date ISO (compte à rebours), line-up, `reserved` = tables complètes |
| `PACKS`  | carte bouteilles, réutilisée par la section Carte et par le volet |

Ajouter une table = ajouter un objet à `ZONES` : bloc, console et fiche se
génèrent seuls.

## Démo vs production

Le formulaire **n’envoie rien** : les demandes vivent dans le `localStorage`
(`r1862.access.v3`), ce qui permet de dérouler tout le parcours. « Réinitialiser
la démo », en pied de page, efface ces données. Pour passer en production,
remplacer l’appel `book()` de `BookingDrawer` par un `fetch()` vers votre API et
servir les disponibilités depuis le back-office plutôt que `EVENTS[].reserved`.

### À remplacer avant mise en ligne

Valeurs d’exemple : téléphone `+33 6 00 00 00 00`, e-mail
`reservations@reserve1862.fr`, adresse (volontairement non précisée), horaires,
minimums de consommation, niveaux acoustiques, prix des packs, line-ups et dates.

## Vérifications

31 contrôles fonctionnels au vert sous Chromium (1440 px et 390 px) : états et
survols du plan, synchronisation console ↔ blueprint, ouverture du volet,
sélecteur de bouteilles, bornes du compteur, validation et messages d’erreur,
persistance après rechargement, navigation clavier et Échap, liste d’attente,
changement de soirée, réinitialisation. Aucune erreur console, aucun débordement
horizontal.

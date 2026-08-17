# RÉSERVE 1862 — private club · Strasbourg

Site et module de réservation de tables du club **Réserve 1862**.
Direction artistique : noir carbone velouté (`#0A0A0C`), or champagne
(`#D4AF37`), crème chaude (`#FDFBF7`), halos ambrés très diffus et grain subtil.
Géométrie entièrement galbée — aucun angle droit : galets de verre fumé
(`rounded-[28px]`), capsules (`rounded-full`) et ovales.

Pièce maîtresse : une **cartographie de la salle en courbes**. Chaque table est
un galet ou un ovale de verre fumé ; les tables libres respirent en doré, les
tables prises s’effacent. Au survol, un halo ambré s’étend en dégradé radial
autour de la table et le reste de la salle s’assombrit. Au clic, une **sheet aux
angles généreux** s’ouvre — volet latéral sur desktop, feuille montante sur
mobile — pour valider l’accès VIP.

## Stack

React 19 · Vite 8 · Tailwind CSS 4 · Framer Motion · Lucide Icons.
Polices auto-hébergées (Archivo Expanded pour les titres, JetBrains Mono pour
les libellés techniques, SIL OFL) : aucune requête vers un tiers.

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
  lib/motion.js              ressorts partagés (spring physics)
  hooks/                     useMagnetic · useCountdown · useFinePointer · useLockBody · useMediaQuery
  components/
    Hero.jsx                 titre display, marquee cinétique, compteur LED
    LedCountdown.jsx         compteur en galets, segments éteints en fond
    CursorLayer.jsx          halo volumétrique + anneau + étiquette
    Grain.jsx / Flash.jsx    grain animé · flash au clic
    plan/Blueprint.jsx       plan SVG : enveloppe galbée, piste, mobilier
    plan/TableBlock.jsx      galet ou ovale + états + halo de survol
    plan/PlanConsole.jsx     colonne technique : occupation, tables libres, légende
    plan/EventBar.jsx        sélecteur de soirée (surlignage animé `layoutId`)
    booking/BookingDrawer.jsx sheet arrondie, filigrane, specs, validation
    booking/BottleConsole.jsx sélecteur de bouteilles en capsules
    ui/MagneticButton.jsx    capsule magnétique + reflet champagne
    ui/Marquee.jsx           bandeau cinétique en boucle continue
```

## Le module de réservation

- **États des tables** — disponible (contour doré + respiration lente),
  demande envoyée (pastille dorée), complet (galet estompé, mention « complet »).
- **Survol** — halo ambré en dégradé radial autour de la table, léger
  agrandissement, reste de la salle à 22 % d’opacité, étiquette
  `VIP 02 · DISPONIBLE` accrochée au curseur.
- **Sheet de réservation** — numéro de table en filigrane géant, badge capsule
  « Disponibilité : validée », spécifications en galets (capacité, minimum,
  emplacement, niveau acoustique), sélecteur de bouteilles en capsules à témoin
  doré, compteur de convives borné par la capacité, grand bouton pilule
  « Valider l’accès VIP », puis écran de confirmation avec référence.
  Table complète → bascule en liste d’attente.
- **Console latérale** — soirée active, barre d’occupation, accès direct aux
  tables libres (synchronisé avec le survol du plan), légende.
- **Micro-interactions** — flash chaud bref et vibration courte au clic
  (`navigator.vibrate`), capsules magnétiques qui suivent le curseur, et
  **ressorts partagés** (`src/lib/motion.js`, `damping: 25, stiffness: 200`) sur
  toutes les transitions : ouverture de la sheet, survols, changement de soirée.
- **Accessibilité** — blocs focusables (Tab), activables (Entrée / Espace), piège
  à focus et fermeture Échap dans le volet, libellés ARIA sur chaque table,
  curseur natif conservé au tactile, `prefers-reduced-motion` respecté.

### Personnaliser

Tout part de `src/data/venue.js` :

| Constante | Rôle |
|---|---|
| `ROOM`   | enveloppe galbée, piste, mobilier fixe (DJ, bar, escalier) et repères de zones |
| `ZONES`  | tables : `code`, `name`, `capacity`, `min`, `packIds`, `includes`, `acoustics` et `plan` = `{x, y, w, h, shape, r}` — `shape: 'blob'` (capsule galbée) ou `'oval'` |
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

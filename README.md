# Réserve 1862 — expérience web & réservation de tables

Site statique (HTML / CSS / JS, sans build ni dépendance) pour le club **Réserve 1862**
à Strasbourg. La pièce maîtresse est une **salle en volume, isométrique et interactive** :
on survole un carré VIP, la salle s’assombrit autour, on clique, une carte d’immersion
s’ouvre et la table se réserve en deux gestes.

## Lancer le site

Aucune installation :

```bash
npx http-server -p 8080     # puis http://localhost:8080
```

Un simple serveur statique suffit (Netlify, Vercel, GitHub Pages, nginx…). Le fichier
vidéo doit être servi en HTTP pour être lu — en `file://` la page bascule
automatiquement sur son fond CSS.

## Structure

```
index.html                 sections, SVG vide de la salle, dock, carte d'immersion
assets/css/fonts.css       @font-face — Playfair Display (italique) + Inter, auto-hébergées
assets/css/styles.css      design system, salle, dock, carte, responsive
assets/js/data.js          ⇽ données éditables : salle, tables, soirées, packs
assets/js/iso.js           moteur de projection isométrique (monde → écran)
assets/js/app.js           construction de la salle, survols, carte d'immersion, dock
assets/media/ambience.webm boucle d'ambiance 10 s du hero (480 Ko, VP8)
assets/fonts/              woff2 (sous-ensembles latin / latin-ext)
```

## La salle isométrique

`iso.js` projette des coordonnées monde `(x, y au sol, z vertical)` :

```
sx = (x − y) · 0.90        sy = (x + y) · 0.44 − z
```

Chaque table est un **volume de verre** : dessus translucide à arête dorée, deux flancs
sombres, halo au sol révélé au survol. `app.js` construit la scène puis trie les objets
par profondeur (`x + y`) — algorithme du peintre — pour que les recouvrements soient
justes. Un cercle au sol devient une ellipse à axes droits, ce qui donne le dancefloor
et les nappes de lumière.

Sont dessinés : cabine DJ, carrés VIP 1 & 2 face au DJ, carrés VIP 3 & 4 le long du mur
droit, ligne de quatre banquettes VIP, trois tables hautes autour de la piste, bar,
carré lounge de quatre tables, escalier et accès.

**Interactions**

- **Survol** : le volume s’illumine (halo doré diffus), le reste de la salle passe à 34 %
  d’opacité, un **badge suit le curseur** — `VIP 02 — DISPONIBLE` — et un halo volumétrique
  ambré accompagne la souris avec un léger retard. Le dock et la salle se répondent :
  survoler une pastille éclaire la table correspondante, et inversement.
- **Clic** : ouverture de la **carte d’immersion** — visuel d’ambiance propre à
  l’emplacement (rendu isométrique du volume seul, en lévitation, sur le dégradé de la
  zone), capacité, minimum, ce qui est inclus, choix du magnum / pack, sélecteur de
  convives, nom, téléphone, puis confirmation avec sceau animé et retour haptique
  (`navigator.vibrate`) sur mobile.
- **États** : disponible (arête dorée), sélectionnée, demande envoyée (pointillé doré),
  complet (croix rouge posée à plat sur le plateau, volume éteint) → la fiche propose
  alors une liste d’attente.
- **Dock flottant** : apparaît quand la salle entre dans le champ, disparaît sinon.
  Soirées à gauche, compteur de disponibilités, carrousel horizontal des quinze tables.
  Il remplace toute liste empilée : la sélection se fait sur la salle ou dans ce rail.
- **Clavier** : chaque volume est focusable (Tab), activable (Entrée / Espace), la carte
  piège le focus et se ferme à Échap.

### Personnaliser

Tout est dans `assets/js/data.js` :

| Constante | Rôle |
|---|---|
| `ROOM`   | enveloppe des murs, bordures, dancefloor, mobilier fixe (DJ, bar), escalier |
| `ZONES`  | tables : `code`, `name`, `capacity`, `min`, `packIds`, `includes`, `mood`, `amb` (dégradé d’ambiance) et `iso` = emprise au sol `{x, y, w, d}` + hauteur `h` |
| `EVENTS` | soirées : date ISO (compte à rebours), line-up, et `reserved` = tables complètes |
| `PACKS`  | carte bouteilles, réutilisée dans la section Carte et dans la fiche de réservation |

Ajouter une table = ajouter un objet à `ZONES` : le volume, la pastille du dock et la
fiche se génèrent seuls.

## Démo vs production

Le formulaire **n’envoie rien** : les demandes vivent dans le `localStorage`
(`r1862.bookings.v2`), ce qui permet de dérouler tout le parcours. « Réinitialiser la
démo » en pied de page efface ces données. Pour passer en production, remplacer le bloc
d’enregistrement de `bindCard()` par un `fetch()` vers votre API, et servir les
disponibilités depuis le back-office au lieu de `EVENTS[].reserved`.

### Contenus à remplacer avant mise en ligne

Valeurs d’exemple : téléphone `+33 6 00 00 00 00`, e-mail `reservations@reserve1862.fr`,
adresse (volontairement non précisée), horaires, minimums de consommation, prix des
packs, line-ups et dates.

## Notes techniques

- **Ambiance du hero** : boucle de 10 s générée en canvas puis encodée en VP8 (480 Ko),
  parfaitement bouclée, jouée en `autoplay muted loop playsinline`. Si la lecture est
  refusée ou le fichier absent, le fond CSS (dégradés, faisceaux, grain) prend le relais.
  Pour un vrai teaser tourné en club, remplacer `assets/media/ambience.webm`.
- **Polices auto-hébergées** (Playfair Display italique pour les titres, Inter pour le
  reste, SIL Open Font License 1.1) : aucune requête tierce, rendu identique hors ligne.
- **Grain** : overlay SVG plein écran en `mix-blend-mode: overlay`, animé par pas.
- **Accessibilité / confort** : `prefers-reduced-motion` désactive curseur personnalisé,
  parallaxe et animations ; le curseur natif reste actif sur écran tactile et au clavier.
- Testé sous Chromium (1440 px et 390 px) : 28 vérifications fonctionnelles au vert,
  aucune erreur console, aucun débordement horizontal.

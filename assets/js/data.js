/* ============================================================
   Réserve 1862 — modèle de données
   Source unique pour le plan interactif, la liste des tables,
   la programmation et la carte bouteilles.
   ============================================================ */

/* ---- Packs bouteilles ---------------------------------------------------- */
const PACKS = [
  {
    id: 'magnum-champagne',
    name: 'Magnum Champagne',
    detail: 'Moët Impérial 1,5 L — service au cierge, softs et verrerie pour la table.',
    price: 320,
    tag: 'Signature'
  },
  {
    id: 'ruinart',
    name: 'Ruinart Blanc de Blancs',
    detail: 'Bouteille 75 cl, seau individuel, service assis.',
    price: 190,
    tag: 'Champagne'
  },
  {
    id: 'pack-prestige',
    name: 'Pack Prestige',
    detail: '1 magnum de champagne + 1 vodka premium + softs à volonté.',
    price: 520,
    tag: 'Carré VIP'
  },
  {
    id: 'pack-spiritueux',
    name: 'Pack Spiritueux',
    detail: '2 bouteilles au choix — vodka, gin ou rhum — avec softs et glace.',
    price: 280,
    tag: 'Le plus pris'
  },
  {
    id: 'magnum-vodka',
    name: 'Magnum Vodka',
    detail: 'Grey Goose ou Belvedere 1,75 L, sortie de bouteille en salle.',
    price: 350,
    tag: 'Spiritueux'
  },
  {
    id: 'pack-softs',
    name: 'Pack Softs & Mocktails',
    detail: 'Sans alcool — 6 mocktails signature, softs premium et fruits frais.',
    price: 90,
    tag: 'Soirées +17'
  }
];

/* ---- Zones / tables ----------------------------------------------------- */
/* geo : coordonnées dans le viewBox 0 0 1000 900 du plan SVG.
   kind : carre | banquette | haute | lounge                                */
const ZONES = [
  {
    id: 'vip1', code: 'VIP 1', kind: 'carre',
    name: 'Carré DJ VIP 1',
    area: 'Face cabine DJ',
    capacity: [6, 8], min: 400, pack: 'pack-prestige',
    desc: 'Le carré collé à la cabine. Banquette d’angle, table basse, vue plongeante sur le dancefloor.',
    geo: { type: 'rect', x: 410, y: 100, w: 150, h: 80 }
  },
  {
    id: 'vip2', code: 'VIP 2', kind: 'carre',
    name: 'Carré DJ VIP 2',
    area: 'Face cabine DJ',
    capacity: [6, 8], min: 400, pack: 'pack-prestige',
    desc: 'Jumeau du carré 1, légèrement en retrait — le meilleur compromis son / conversation.',
    geo: { type: 'rect', x: 575, y: 100, w: 150, h: 80 }
  },
  {
    id: 'vip3', code: 'VIP 3', kind: 'carre',
    name: 'Carré VIP 3',
    area: 'Mur latéral droit',
    capacity: [8, 10], min: 550, pack: 'pack-prestige',
    desc: 'Grand carré fermé sur trois côtés, le plus intime des quatre. Accès direct par l’escalier.',
    geo: { type: 'rect', x: 770, y: 205, w: 120, h: 125 }
  },
  {
    id: 'vip4', code: 'VIP 4', kind: 'carre',
    name: 'Carré VIP 4',
    area: 'Mur latéral droit',
    capacity: [8, 10], min: 550, pack: 'magnum-champagne',
    desc: 'Carré surélevé côté mur, deux banquettes en vis-à-vis et table haute centrale.',
    geo: { type: 'rect', x: 770, y: 360, w: 120, h: 125 }
  },

  {
    id: 'b1', code: 'B1', kind: 'banquette',
    name: 'Banquette VIP 1',
    area: 'Ligne VIP — côté gauche',
    capacity: [4, 6], min: 250, pack: 'pack-spiritueux',
    desc: 'Première banquette de la ligne, dans l’axe de la cabine DJ.',
    geo: { type: 'rect', x: 98, y: 215, w: 90, h: 92 }
  },
  {
    id: 'b2', code: 'B2', kind: 'banquette',
    name: 'Banquette VIP 2',
    area: 'Ligne VIP — côté gauche',
    capacity: [4, 6], min: 250, pack: 'pack-spiritueux',
    desc: 'Banquette centrale, appui sur le rail mange-debout.',
    geo: { type: 'rect', x: 98, y: 323, w: 90, h: 92 }
  },
  {
    id: 'b3', code: 'B3', kind: 'banquette',
    name: 'Banquette VIP 3',
    area: 'Ligne VIP — côté gauche',
    capacity: [4, 6], min: 220, pack: 'magnum-vodka',
    desc: 'Au plus près du dancefloor, idéale pour les groupes debout.',
    geo: { type: 'rect', x: 98, y: 431, w: 90, h: 92 }
  },
  {
    id: 'b4', code: 'B4', kind: 'banquette',
    name: 'Banquette VIP 4',
    area: 'Ligne VIP — côté gauche',
    capacity: [4, 6], min: 220, pack: 'ruinart',
    desc: 'Dernière banquette avant le lounge, retrait acoustique appréciable.',
    geo: { type: 'rect', x: 98, y: 539, w: 90, h: 92 }
  },

  {
    id: 't1', code: 'T1', kind: 'haute',
    name: 'Table haute 1',
    area: 'Pourtour dancefloor',
    capacity: [2, 4], min: 120, pack: 'ruinart',
    desc: 'Mange-debout avec quatre tabourets, en bord de piste côté banquettes.',
    geo: { type: 'circle', cx: 300, cy: 592, r: 27 }
  },
  {
    id: 't2', code: 'T2', kind: 'haute',
    name: 'Table haute 2',
    area: 'Pourtour dancefloor',
    capacity: [2, 4], min: 120, pack: 'pack-spiritueux',
    desc: 'Table centrale entre la piste et le bar — le passage le plus animé.',
    geo: { type: 'circle', cx: 450, cy: 622, r: 27 }
  },
  {
    id: 't3', code: 'T3', kind: 'haute',
    name: 'Table haute 3',
    area: 'Pourtour dancefloor',
    capacity: [2, 4], min: 120, pack: 'magnum-vodka',
    desc: 'Côté bar, service immédiat, deux pas de la piste.',
    geo: { type: 'circle', cx: 610, cy: 592, r: 27 }
  },

  {
    id: 'l1', code: 'L1', kind: 'lounge',
    name: 'Lounge 1',
    area: 'Carré bas — lounge',
    capacity: [4, 4], min: 150, pack: 'ruinart',
    desc: 'Table basse et fauteuils, à l’écart du son : la zone conversation.',
    geo: { type: 'circle', cx: 155, cy: 727, r: 25 }
  },
  {
    id: 'l2', code: 'L2', kind: 'lounge',
    name: 'Lounge 2',
    area: 'Carré bas — lounge',
    capacity: [4, 4], min: 150, pack: 'pack-softs',
    desc: 'Deuxième table du carré bas, adossée au refend.',
    geo: { type: 'circle', cx: 258, cy: 727, r: 25 }
  },
  {
    id: 'l3', code: 'L3', kind: 'lounge',
    name: 'Lounge 3',
    area: 'Carré bas — lounge',
    capacity: [4, 4], min: 150, pack: 'pack-softs',
    desc: 'Table d’angle, la plus calme de l’établissement.',
    geo: { type: 'circle', cx: 155, cy: 812, r: 25 }
  },
  {
    id: 'l4', code: 'L4', kind: 'lounge',
    name: 'Lounge 4',
    area: 'Carré bas — lounge',
    capacity: [4, 4], min: 150, pack: 'pack-spiritueux',
    desc: 'Face à l’entrée du carré bas, réunissable avec la Lounge 3.',
    geo: { type: 'circle', cx: 258, cy: 812, r: 25 }
  }
];

/* ---- Soirées ------------------------------------------------------------ */
/* reserved : identifiants de zones déjà complètes pour la date              */
const EVENTS = [
  {
    id: 'mar-18-08',
    short: 'Mar. 18 août',
    day: 'Mardi',
    date: '18.08',
    when: '2026-08-18T23:30:00+02:00',
    title: 'Club Movida · +17 Party',
    line: 'Disco Lines — Tinashe — résidents Réserve',
    tag: '+17',
    note: 'Soirée +17 : contrôle d’identité à l’entrée, service sans alcool pour les mineurs.',
    reserved: ['vip1', 'vip2', 'vip3', 'vip4', 'b1', 'b2', 'b3', 't2']
  },
  {
    id: 'ven-21-08',
    short: 'Ven. 21 août',
    day: 'Vendredi',
    date: '21.08',
    when: '2026-08-21T23:30:00+02:00',
    title: 'Réserve Sessions · House & Hits',
    line: 'Mael Ski — Amine K — invité surprise 03h00',
    tag: '21+',
    note: '',
    reserved: ['vip1', 'vip3', 'b2', 'l1']
  },
  {
    id: 'sam-22-08',
    short: 'Sam. 22 août',
    day: 'Samedi',
    date: '22.08',
    when: '2026-08-22T23:30:00+02:00',
    title: 'Carte Noire · Open Format',
    line: 'Résidents Réserve — set 100 % vinyle à 01h00',
    tag: 'Dress code strict',
    note: '',
    reserved: ['vip2', 'b4', 't1']
  },
  {
    id: 'sam-29-08',
    short: 'Sam. 29 août',
    day: 'Samedi',
    date: '29.08',
    when: '2026-08-29T23:30:00+02:00',
    title: 'Anniversaire Réserve · 8 ans',
    line: 'Line-up annoncé une semaine avant — capacité réduite',
    tag: 'Sur invitation',
    note: '',
    reserved: ['vip1', 'vip2', 'vip3', 'vip4', 'b1', 'b2', 'b3', 'b4', 'l1', 'l2']
  }
];

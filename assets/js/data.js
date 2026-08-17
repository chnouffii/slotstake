/* ============================================================
   Réserve 1862 — modèle de données
   Géométrie en unités « monde » (plan au sol), projetée en
   isométrie par iso.js. Origine (0,0) = angle cabine DJ / mur gauche.
   ============================================================ */

/* ---- Packs bouteilles ---------------------------------------------------- */
const PACKS = [
  { id: 'magnum-champagne', name: 'Magnum Champagne', short: 'Magnum', price: 320,
    detail: 'Moët Impérial 1,5 L — sortie de cave au cierge, softs et verrerie pour la table.' },
  { id: 'ruinart', name: 'Ruinart Blanc de Blancs', short: 'Ruinart', price: 190,
    detail: 'Bouteille 75 cl, seau individuel, service assis.' },
  { id: 'pack-prestige', name: 'Pack Prestige', short: 'Prestige', price: 520,
    detail: '1 magnum de champagne + 1 vodka premium + softs à volonté.' },
  { id: 'pack-spiritueux', name: 'Pack Spiritueux', short: 'Spiritueux', price: 280,
    detail: '2 bouteilles au choix — vodka, gin ou rhum — avec softs et glace.' },
  { id: 'magnum-vodka', name: 'Magnum Vodka', short: 'Magnum Vodka', price: 350,
    detail: 'Grey Goose ou Belvedere 1,75 L, sortie de bouteille en salle.' },
  { id: 'pack-softs', name: 'Softs & Mocktails', short: 'Sans alcool', price: 90,
    detail: 'Sans alcool — 6 mocktails signature, softs premium et fruits frais.' }
];

/* ---- Décor fixe ---------------------------------------------------------- */
const ROOM = {
  floor: [[0, 0], [680, 0], [680, 420], [820, 420], [820, 680], [0, 680]],
  walls: [
    { from: [0, 0], to: [680, 0], h: 96 },
    { from: [0, 0], to: [0, 680], h: 96 }
  ],
  curbs: [
    { from: [680, 0], to: [680, 420], h: 9 },
    { from: [680, 420], to: [820, 420], h: 9 },
    { from: [820, 420], to: [820, 680], h: 9 },
    { from: [0, 680], to: [820, 680], h: 9 }
  ],
  dancefloor: { cx: 330, cy: 250, r: 150 },
  fixtures: [
    { id: 'dj', label: 'Cabine DJ', box: { x: 96, y: 8, w: 200, d: 62, h: 44 }, kind: 'booth' },
    { id: 'bar', label: 'Bar', box: { x: 250, y: 586, w: 270, d: 56, h: 50 }, kind: 'bar' }
  ],
  stairs: { x: 706, y: 452, w: 100, d: 24, steps: 9, rise: 13 }
};

/* ---- Tables & carrés ----------------------------------------------------- */
/* iso : emprise au sol {x, y, w, d} + hauteur h du volume            */
const ZONES = [
  {
    id: 'vip1', code: 'VIP 01', kind: 'carre',
    name: 'Carré DJ VIP 1', area: 'Face cabine DJ',
    capacity: [6, 8], min: 400, pack: 'pack-prestige',
    packIds: ['pack-prestige', 'magnum-champagne', 'magnum-vodka', 'ruinart'],
    desc: 'Le carré collé à la cabine. Banquette d’angle, table basse, vue plongeante sur la piste.',
    includes: ['Service bouteille dédié', 'Entrée coupe-file jusqu’à 8', 'Vestiaire offert'],
    mood: 'Plein son, plein regard',
    iso: { x: 330, y: 8, w: 142, d: 74, h: 26 },
    amb: ['#4a3208', '#0a0908']
  },
  {
    id: 'vip2', code: 'VIP 02', kind: 'carre',
    name: 'Carré DJ VIP 2', area: 'Face cabine DJ',
    capacity: [6, 8], min: 400, pack: 'pack-prestige',
    packIds: ['pack-prestige', 'magnum-champagne', 'pack-spiritueux', 'ruinart'],
    desc: 'Jumeau du carré 1, légèrement en retrait — le meilleur compromis son et conversation.',
    includes: ['Service bouteille dédié', 'Entrée coupe-file jusqu’à 8', 'Table basse modulable'],
    mood: 'À un pas du booth',
    iso: { x: 492, y: 8, w: 142, d: 74, h: 26 },
    amb: ['#43300c', '#0a0908']
  },
  {
    id: 'vip3', code: 'VIP 03', kind: 'carre',
    name: 'Carré VIP 3', area: 'Mur latéral droit',
    capacity: [8, 10], min: 550, pack: 'pack-prestige',
    packIds: ['pack-prestige', 'magnum-champagne', 'magnum-vodka', 'pack-spiritueux'],
    desc: 'Grand carré fermé sur trois côtés, le plus intime des quatre. Accès direct par l’escalier.',
    includes: ['Carré privatisé', 'Hôtesse dédiée', 'Entrée coupe-file jusqu’à 10'],
    mood: 'Loin des regards',
    iso: { x: 566, y: 138, w: 106, d: 114, h: 26 },
    amb: ['#3c2a10', '#09090a']
  },
  {
    id: 'vip4', code: 'VIP 04', kind: 'carre',
    name: 'Carré VIP 4', area: 'Mur latéral droit',
    capacity: [8, 10], min: 550, pack: 'magnum-champagne',
    packIds: ['magnum-champagne', 'pack-prestige', 'magnum-vodka', 'ruinart'],
    desc: 'Carré surélevé côté mur, deux banquettes en vis-à-vis et table haute centrale.',
    includes: ['Estrade privative', 'Hôtesse dédiée', 'Vestiaire offert'],
    mood: 'Vue d’ensemble sur la salle',
    iso: { x: 566, y: 286, w: 106, d: 114, h: 26 },
    amb: ['#3a2c14', '#09090a']
  },

  {
    id: 'b1', code: 'BQ 01', kind: 'banquette',
    name: 'Banquette VIP 1', area: 'Ligne VIP — mur gauche',
    capacity: [4, 6], min: 250, pack: 'pack-spiritueux',
    packIds: ['pack-spiritueux', 'magnum-vodka', 'ruinart', 'pack-softs'],
    desc: 'Première banquette de la ligne, dans l’axe exact de la cabine DJ.',
    includes: ['Banquette velours', 'Seau et verrerie', 'Rail mange-debout'],
    mood: 'Dans l’axe du DJ',
    iso: { x: 8, y: 92, w: 86, d: 78, h: 22 },
    amb: ['#33240e', '#09090a']
  },
  {
    id: 'b2', code: 'BQ 02', kind: 'banquette',
    name: 'Banquette VIP 2', area: 'Ligne VIP — mur gauche',
    capacity: [4, 6], min: 250, pack: 'pack-spiritueux',
    packIds: ['pack-spiritueux', 'magnum-vodka', 'ruinart', 'pack-softs'],
    desc: 'Banquette centrale, appui direct sur le rail mange-debout.',
    includes: ['Banquette velours', 'Seau et verrerie', 'Rail mange-debout'],
    mood: 'Le cœur de la ligne',
    iso: { x: 8, y: 190, w: 86, d: 78, h: 22 },
    amb: ['#31260f', '#09090a']
  },
  {
    id: 'b3', code: 'BQ 03', kind: 'banquette',
    name: 'Banquette VIP 3', area: 'Ligne VIP — mur gauche',
    capacity: [4, 6], min: 220, pack: 'magnum-vodka',
    packIds: ['magnum-vodka', 'pack-spiritueux', 'ruinart', 'pack-softs'],
    desc: 'Au plus près de la piste, idéale pour les groupes qui restent debout.',
    includes: ['Banquette velours', 'Seau et verrerie', 'Bord de piste'],
    mood: 'Bord de piste',
    iso: { x: 8, y: 288, w: 86, d: 78, h: 22 },
    amb: ['#2f240f', '#09090a']
  },
  {
    id: 'b4', code: 'BQ 04', kind: 'banquette',
    name: 'Banquette VIP 4', area: 'Ligne VIP — mur gauche',
    capacity: [4, 6], min: 220, pack: 'ruinart',
    packIds: ['ruinart', 'pack-spiritueux', 'magnum-vodka', 'pack-softs'],
    desc: 'Dernière banquette avant le lounge : le retrait acoustique se sent.',
    includes: ['Banquette velours', 'Seau et verrerie', 'Retrait acoustique'],
    mood: 'On s’y entend parler',
    iso: { x: 8, y: 386, w: 86, d: 78, h: 22 },
    amb: ['#2c230f', '#09090a']
  },

  {
    id: 't1', code: 'TH 01', kind: 'haute',
    name: 'Table haute 1', area: 'Pourtour dancefloor',
    capacity: [2, 4], min: 120, pack: 'ruinart',
    packIds: ['ruinart', 'pack-spiritueux', 'pack-softs'],
    desc: 'Mange-debout et quatre tabourets, en bord de piste côté banquettes.',
    includes: ['4 tabourets', 'Seau et verrerie', 'Bord de piste'],
    mood: 'Debout, au centre',
    iso: { x: 186, y: 452, w: 48, d: 48, h: 42 },
    amb: ['#2a2110', '#09090a']
  },
  {
    id: 't2', code: 'TH 02', kind: 'haute',
    name: 'Table haute 2', area: 'Pourtour dancefloor',
    capacity: [2, 4], min: 120, pack: 'pack-spiritueux',
    packIds: ['pack-spiritueux', 'magnum-vodka', 'pack-softs'],
    desc: 'Table centrale entre la piste et le bar — le passage le plus animé de la salle.',
    includes: ['4 tabourets', 'Seau et verrerie', 'Accès bar immédiat'],
    mood: 'Là où tout passe',
    iso: { x: 318, y: 496, w: 48, d: 48, h: 42 },
    amb: ['#2c2312', '#09090a']
  },
  {
    id: 't3', code: 'TH 03', kind: 'haute',
    name: 'Table haute 3', area: 'Pourtour dancefloor',
    capacity: [2, 4], min: 120, pack: 'magnum-vodka',
    packIds: ['magnum-vodka', 'pack-spiritueux', 'pack-softs'],
    desc: 'Côté bar, service immédiat, deux pas de la piste.',
    includes: ['4 tabourets', 'Seau et verrerie', 'Accès bar immédiat'],
    mood: 'Adossé au bar',
    iso: { x: 450, y: 452, w: 48, d: 48, h: 42 },
    amb: ['#2b2211', '#09090a']
  },

  {
    id: 'l1', code: 'LG 01', kind: 'lounge',
    name: 'Lounge 1', area: 'Carré bas — lounge',
    capacity: [4, 4], min: 150, pack: 'ruinart',
    packIds: ['ruinart', 'pack-softs', 'pack-spiritueux'],
    desc: 'Table basse et fauteuils, à l’écart du son : la zone conversation.',
    includes: ['Fauteuils bas', 'Seau et verrerie', 'À l’écart du son'],
    mood: 'Le calme du carré bas',
    iso: { x: 30, y: 540, w: 54, d: 54, h: 18 },
    amb: ['#241c0e', '#09090a']
  },
  {
    id: 'l2', code: 'LG 02', kind: 'lounge',
    name: 'Lounge 2', area: 'Carré bas — lounge',
    capacity: [4, 4], min: 150, pack: 'pack-softs',
    packIds: ['pack-softs', 'ruinart', 'pack-spiritueux'],
    desc: 'Deuxième table du carré bas, adossée au refend.',
    includes: ['Fauteuils bas', 'Seau et verrerie', 'Adossée au refend'],
    mood: 'Adossé, tranquille',
    iso: { x: 128, y: 540, w: 54, d: 54, h: 18 },
    amb: ['#251e10', '#09090a']
  },
  {
    id: 'l3', code: 'LG 03', kind: 'lounge',
    name: 'Lounge 3', area: 'Carré bas — lounge',
    capacity: [4, 4], min: 150, pack: 'pack-softs',
    packIds: ['pack-softs', 'ruinart', 'pack-spiritueux'],
    desc: 'Table d’angle, la plus calme de l’établissement.',
    includes: ['Fauteuils bas', 'Seau et verrerie', 'Angle protégé'],
    mood: 'L’angle le plus calme',
    iso: { x: 30, y: 620, w: 54, d: 54, h: 18 },
    amb: ['#231d10', '#09090a']
  },
  {
    id: 'l4', code: 'LG 04', kind: 'lounge',
    name: 'Lounge 4', area: 'Carré bas — lounge',
    capacity: [4, 4], min: 150, pack: 'pack-spiritueux',
    packIds: ['pack-spiritueux', 'pack-softs', 'ruinart'],
    desc: 'Face à l’entrée du carré bas, réunissable avec la Lounge 3.',
    includes: ['Fauteuils bas', 'Seau et verrerie', 'Réunissable'],
    mood: 'Pour les grandes tablées',
    iso: { x: 128, y: 620, w: 54, d: 54, h: 18 },
    amb: ['#262010', '#09090a']
  }
];

/* ---- Soirées ------------------------------------------------------------- */
const EVENTS = [
  {
    id: 'mar-18-08', short: 'Mar. 18 août', day: 'Mardi', date: '18.08',
    when: '2026-08-18T23:30:00+02:00',
    title: 'Club Movida · +17 Party', name: 'Club Movida',
    line: 'Disco Lines — Tinashe — résidents Réserve',
    tag: '+17',
    note: 'Soirée +17 : contrôle d’identité à l’entrée, service sans alcool pour les mineurs.',
    reserved: ['vip1', 'vip2', 'vip3', 'vip4', 'b1', 'b2', 'b3', 't2']
  },
  {
    id: 'ven-21-08', short: 'Ven. 21 août', day: 'Vendredi', date: '21.08',
    when: '2026-08-21T23:30:00+02:00',
    title: 'Réserve Sessions · House & Hits', name: 'Réserve Sessions',
    line: 'Mael Ski — Amine K — invité surprise à 03h00',
    tag: '21+', note: '',
    reserved: ['vip1', 'vip3', 'b2', 'l1']
  },
  {
    id: 'sam-22-08', short: 'Sam. 22 août', day: 'Samedi', date: '22.08',
    when: '2026-08-22T23:30:00+02:00',
    title: 'Carte Noire · Open Format', name: 'Carte Noire',
    line: 'Résidents Réserve — set 100 % vinyle à 01h00',
    tag: 'Dress code strict', note: '',
    reserved: ['vip2', 'b4', 't1']
  },
  {
    id: 'sam-29-08', short: 'Sam. 29 août', day: 'Samedi', date: '29.08',
    when: '2026-08-29T23:30:00+02:00',
    title: 'Anniversaire Réserve · 8 ans', name: 'Anniversaire',
    line: 'Line-up annoncé une semaine avant — capacité réduite',
    tag: 'Sur invitation', note: '',
    reserved: ['vip1', 'vip2', 'vip3', 'vip4', 'b1', 'b2', 'b3', 'b4', 'l1', 'l2']
  }
];

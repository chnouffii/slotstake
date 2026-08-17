/* ============================================================
   RÉSERVE 1862 — modèle de données
   Géométrie du plan en unités blueprint (viewBox 0 0 1200 900).
   ============================================================ */

/** Carte des bouteilles — partagée par la section Carte et le drawer. */
export const PACKS = [
  { id: 'magnum-champagne', name: 'MAGNUM CHAMPAGNE', short: 'MAGNUM CHAMP.', price: 320, vol: '1,5 L',
    detail: 'Moët Impérial — sortie de cave au cierge, softs et verrerie pour la table.' },
  { id: 'ruinart', name: 'RUINART BLANC DE BLANCS', short: 'RUINART BDB', price: 190, vol: '0,75 L',
    detail: 'Seau individuel, service assis, verrerie cristal.' },
  { id: 'prestige', name: 'PACK PRESTIGE', short: 'PRESTIGE', price: 520, vol: '2,25 L',
    detail: '1 magnum de champagne + 1 vodka premium + softs à volonté.' },
  { id: 'spiritueux', name: 'PACK SPIRITUEUX', short: 'SPIRITUEUX', price: 280, vol: '1,4 L',
    detail: '2 bouteilles au choix — vodka, gin ou rhum — avec softs et glace.' },
  { id: 'magnum-vodka', name: 'MAGNUM VODKA', short: 'MAGNUM VODKA', price: 350, vol: '1,75 L',
    detail: 'Grey Goose ou Belvedere, sortie de bouteille en salle.' },
  { id: 'softs', name: 'SOFTS & MOCKTAILS', short: 'SANS ALCOOL', price: 90, vol: '—',
    detail: '6 mocktails signature, softs premium et fruits frais.' }
];

/** Décor de la cartographie : contours galbés, aucune arête vive. */
export const ROOM = {
  /* enveloppe adoucie — tous les angles filetés */
  walls:
    'M212 150 H828 Q900 150 900 222 V448 Q900 520 972 520 H988 Q1060 520 1060 592 V748 Q1060 820 988 820 H212 Q140 820 140 748 V222 Q140 150 212 150 Z',
  dancefloor: { cx: 600, cy: 350, r: 152 },
  fixtures: [
    { id: 'dj', label: 'CABINE DJ', x: 250, y: 88, w: 220, h: 62, r: 31 },
    { id: 'bar', label: 'BAR', x: 400, y: 716, w: 300, h: 64, r: 32 },
    { id: 'stairs', label: 'ESCALIER', x: 906, y: 556, w: 140, h: 252, r: 60, steps: 7 }
  ],
  rail: { x: 272, y: 186, w: 12, h: 416, r: 6 },
  zonesTags: [
    { label: 'CARRÉS DJ', x: 500, y: 62 },
    { label: 'LIGNE VIP', x: 158, y: 168, anchor: 'start' },
    { label: 'LOUNGE', x: 168, y: 656, anchor: 'start' },
    { label: 'MUR VIP', x: 1034, y: 168, anchor: 'end' }
  ]
};

/** Les quinze tables réservables. */
export const ZONES = [
  {
    id: 'vip1', code: 'VIP 01', kind: 'CARRÉ',
    name: 'CARRÉ DJ VIP 01', area: 'FACE CABINE',
    acoustics: 'PLEIN AXE — 104 dB',
    capacity: [6, 8], min: 400,
    packIds: ['prestige', 'magnum-champagne', 'magnum-vodka', 'ruinart'],
    desc: 'Le carré collé à la cabine. Banquette d’angle, table basse, vue plongeante sur la piste.',
    includes: ['SERVICE BOUTEILLE DÉDIÉ', 'COUPE-FILE ×8', 'VESTIAIRE OFFERT'],
    plan: { x: 500, y: 78, w: 170, h: 72, shape: 'blob', r: 34 }
  },
  {
    id: 'vip2', code: 'VIP 02', kind: 'CARRÉ',
    name: 'CARRÉ DJ VIP 02', area: 'FACE CABINE',
    acoustics: 'AXE DÉPORTÉ — 99 dB',
    capacity: [6, 8], min: 400,
    packIds: ['prestige', 'magnum-champagne', 'spiritueux', 'ruinart'],
    desc: 'Jumeau du carré 01, légèrement en retrait — le meilleur compromis son / conversation.',
    includes: ['SERVICE BOUTEILLE DÉDIÉ', 'COUPE-FILE ×8', 'TABLE MODULABLE'],
    plan: { x: 690, y: 78, w: 170, h: 72, shape: 'blob', r: 34 }
  },
  {
    id: 'vip3', code: 'VIP 03', kind: 'CARRÉ',
    name: 'CARRÉ VIP 03', area: 'MUR LATÉRAL DROIT',
    acoustics: 'ALCÔVE FERMÉE — 92 dB',
    capacity: [8, 10], min: 550,
    packIds: ['prestige', 'magnum-champagne', 'magnum-vodka', 'spiritueux'],
    desc: 'Grand carré fermé sur trois côtés, le plus intime des quatre. Accès direct par l’escalier.',
    includes: ['CARRÉ PRIVATISÉ', 'HÔTESSE DÉDIÉE', 'COUPE-FILE ×10'],
    plan: { x: 902, y: 188, w: 132, h: 130, shape: 'blob', r: 52 }
  },
  {
    id: 'vip4', code: 'VIP 04', kind: 'CARRÉ',
    name: 'CARRÉ VIP 04', area: 'MUR LATÉRAL DROIT',
    acoustics: 'ALCÔVE HAUTE — 94 dB',
    capacity: [8, 10], min: 550,
    packIds: ['magnum-champagne', 'prestige', 'magnum-vodka', 'ruinart'],
    desc: 'Carré surélevé côté mur, deux banquettes en vis-à-vis et table haute centrale.',
    includes: ['ESTRADE PRIVATIVE', 'HÔTESSE DÉDIÉE', 'VESTIAIRE OFFERT'],
    plan: { x: 902, y: 346, w: 132, h: 130, shape: 'blob', r: 52 }
  },

  {
    id: 'b1', code: 'BQ 01', kind: 'BANQUETTE',
    name: 'BANQUETTE VIP 01', area: 'LIGNE VIP GAUCHE',
    acoustics: 'PLEIN AXE — 102 dB',
    capacity: [4, 6], min: 250,
    packIds: ['spiritueux', 'magnum-vodka', 'ruinart', 'softs'],
    desc: 'Première banquette de la ligne, dans l’axe exact de la cabine DJ.',
    includes: ['BANQUETTE VELOURS', 'SEAU + VERRERIE', 'RAIL MANGE-DEBOUT'],
    plan: { x: 158, y: 186, w: 98, h: 92, shape: 'blob', r: 42 }
  },
  {
    id: 'b2', code: 'BQ 02', kind: 'BANQUETTE',
    name: 'BANQUETTE VIP 02', area: 'LIGNE VIP GAUCHE',
    acoustics: 'AXE CENTRAL — 100 dB',
    capacity: [4, 6], min: 250,
    packIds: ['spiritueux', 'magnum-vodka', 'ruinart', 'softs'],
    desc: 'Banquette centrale, appui direct sur le rail mange-debout.',
    includes: ['BANQUETTE VELOURS', 'SEAU + VERRERIE', 'RAIL MANGE-DEBOUT'],
    plan: { x: 158, y: 294, w: 98, h: 92, shape: 'blob', r: 42 }
  },
  {
    id: 'b3', code: 'BQ 03', kind: 'BANQUETTE',
    name: 'BANQUETTE VIP 03', area: 'LIGNE VIP GAUCHE',
    acoustics: 'BORD DE PISTE — 103 dB',
    capacity: [4, 6], min: 220,
    packIds: ['magnum-vodka', 'spiritueux', 'ruinart', 'softs'],
    desc: 'Au plus près de la piste, idéale pour les groupes qui restent debout.',
    includes: ['BANQUETTE VELOURS', 'SEAU + VERRERIE', 'BORD DE PISTE'],
    plan: { x: 158, y: 402, w: 98, h: 92, shape: 'blob', r: 42 }
  },
  {
    id: 'b4', code: 'BQ 04', kind: 'BANQUETTE',
    name: 'BANQUETTE VIP 04', area: 'LIGNE VIP GAUCHE',
    acoustics: 'RETRAIT — 96 dB',
    capacity: [4, 6], min: 220,
    packIds: ['ruinart', 'spiritueux', 'magnum-vodka', 'softs'],
    desc: 'Dernière banquette avant le lounge : le retrait acoustique se sent.',
    includes: ['BANQUETTE VELOURS', 'SEAU + VERRERIE', 'RETRAIT ACOUSTIQUE'],
    plan: { x: 158, y: 510, w: 98, h: 92, shape: 'blob', r: 42 }
  },

  {
    id: 't1', code: 'TH 01', kind: 'TABLE HAUTE',
    name: 'TABLE HAUTE 01', area: 'POURTOUR PISTE',
    acoustics: 'BORD DE PISTE — 101 dB',
    capacity: [2, 4], min: 120,
    packIds: ['ruinart', 'spiritueux', 'softs'],
    desc: 'Mange-debout et quatre tabourets, en bord de piste côté banquettes.',
    includes: ['4 TABOURETS', 'SEAU + VERRERIE', 'BORD DE PISTE'],
    plan: { x: 330, y: 596, w: 64, h: 64, shape: 'oval' }
  },
  {
    id: 't2', code: 'TH 02', kind: 'TABLE HAUTE',
    name: 'TABLE HAUTE 02', area: 'AXE BAR / PISTE',
    acoustics: 'PASSAGE — 98 dB',
    capacity: [2, 4], min: 120,
    packIds: ['spiritueux', 'magnum-vodka', 'softs'],
    desc: 'Table centrale entre la piste et le bar — le passage le plus animé de la salle.',
    includes: ['4 TABOURETS', 'SEAU + VERRERIE', 'ACCÈS BAR IMMÉDIAT'],
    plan: { x: 492, y: 626, w: 64, h: 64, shape: 'oval' }
  },
  {
    id: 't3', code: 'TH 03', kind: 'TABLE HAUTE',
    name: 'TABLE HAUTE 03', area: 'CÔTÉ BAR',
    acoustics: 'PASSAGE — 97 dB',
    capacity: [2, 4], min: 120,
    packIds: ['magnum-vodka', 'spiritueux', 'softs'],
    desc: 'Côté bar, service immédiat, deux pas de la piste.',
    includes: ['4 TABOURETS', 'SEAU + VERRERIE', 'ACCÈS BAR IMMÉDIAT'],
    plan: { x: 654, y: 596, w: 64, h: 64, shape: 'oval' }
  },

  {
    id: 'l1', code: 'LG 01', kind: 'LOUNGE',
    name: 'LOUNGE 01', area: 'CARRÉ BAS',
    acoustics: 'ZONE CALME — 84 dB',
    capacity: [4, 4], min: 150,
    packIds: ['ruinart', 'softs', 'spiritueux'],
    desc: 'Table basse et fauteuils, à l’écart du son : la zone conversation.',
    includes: ['FAUTEUILS BAS', 'SEAU + VERRERIE', 'À L’ÉCART DU SON'],
    plan: { x: 168, y: 672, w: 74, h: 64, shape: 'oval' }
  },
  {
    id: 'l2', code: 'LG 02', kind: 'LOUNGE',
    name: 'LOUNGE 02', area: 'CARRÉ BAS',
    acoustics: 'ZONE CALME — 85 dB',
    capacity: [4, 4], min: 150,
    packIds: ['softs', 'ruinart', 'spiritueux'],
    desc: 'Deuxième table du carré bas, adossée au refend.',
    includes: ['FAUTEUILS BAS', 'SEAU + VERRERIE', 'ADOSSÉE AU REFEND'],
    plan: { x: 262, y: 672, w: 74, h: 64, shape: 'oval' }
  },
  {
    id: 'l3', code: 'LG 03', kind: 'LOUNGE',
    name: 'LOUNGE 03', area: 'CARRÉ BAS',
    acoustics: 'ZONE CALME — 82 dB',
    capacity: [4, 4], min: 150,
    packIds: ['softs', 'ruinart', 'spiritueux'],
    desc: 'Table d’angle, la plus calme de l’établissement.',
    includes: ['FAUTEUILS BAS', 'SEAU + VERRERIE', 'ANGLE PROTÉGÉ'],
    plan: { x: 168, y: 752, w: 74, h: 64, shape: 'oval' }
  },
  {
    id: 'l4', code: 'LG 04', kind: 'LOUNGE',
    name: 'LOUNGE 04', area: 'CARRÉ BAS',
    acoustics: 'ZONE CALME — 86 dB',
    capacity: [4, 4], min: 150,
    packIds: ['spiritueux', 'softs', 'ruinart'],
    desc: 'Face à l’entrée du carré bas, réunissable avec la Lounge 03.',
    includes: ['FAUTEUILS BAS', 'SEAU + VERRERIE', 'RÉUNISSABLE'],
    plan: { x: 262, y: 752, w: 74, h: 64, shape: 'oval' }
  }
];

/** Soirées — `reserved` liste les tables déjà complètes. */
export const EVENTS = [
  {
    id: 'mar-18-08', short: '18.08', day: 'MAR', date: '18.08.26',
    when: '2026-08-18T23:30:00+02:00',
    name: 'CLUB MOVIDA', sub: '+17 PARTY',
    line: 'DISCO LINES — TINASHE — RÉSIDENTS RÉSERVE',
    tag: '+17',
    note: 'SOIRÉE +17 — CONTRÔLE D’IDENTITÉ À L’ENTRÉE, SERVICE SANS ALCOOL POUR LES MINEURS.',
    reserved: ['vip1', 'vip2', 'vip3', 'vip4', 'b1', 'b2', 'b3', 't2']
  },
  {
    id: 'ven-21-08', short: '21.08', day: 'VEN', date: '21.08.26',
    when: '2026-08-21T23:30:00+02:00',
    name: 'RÉSERVE SESSIONS', sub: 'HOUSE & HITS',
    line: 'MAEL SKI — AMINE K — INVITÉ SURPRISE 03:00',
    tag: '21+', note: '',
    reserved: ['vip1', 'vip3', 'b2', 'l1']
  },
  {
    id: 'sam-22-08', short: '22.08', day: 'SAM', date: '22.08.26',
    when: '2026-08-22T23:30:00+02:00',
    name: 'CARTE NOIRE', sub: 'OPEN FORMAT',
    line: 'RÉSIDENTS RÉSERVE — SET 100 % VINYLE À 01:00',
    tag: 'DRESS CODE STRICT', note: '',
    reserved: ['vip2', 'b4', 't1']
  },
  {
    id: 'sam-29-08', short: '29.08', day: 'SAM', date: '29.08.26',
    when: '2026-08-29T23:30:00+02:00',
    name: 'ANNIVERSAIRE', sub: 'RÉSERVE — 8 ANS',
    line: 'LINE-UP ANNONCÉ UNE SEMAINE AVANT — CAPACITÉ RÉDUITE',
    tag: 'SUR INVITATION', note: '',
    reserved: ['vip1', 'vip2', 'vip3', 'vip4', 'b1', 'b2', 'b3', 'b4', 'l1', 'l2']
  }
];

export const zoneById = (id) => ZONES.find((z) => z.id === id);
export const packById = (id) => PACKS.find((p) => p.id === id);
export const eventById = (id) => EVENTS.find((e) => e.id === id);

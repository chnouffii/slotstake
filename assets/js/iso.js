/* ============================================================
   Réserve 1862 — projection isométrique
   Monde (x, y au sol, z vertical) → écran.
   sx = (x - y) · KX        sy = (x + y) · KY - z
   ============================================================ */
const Iso = (function () {
  'use strict';

  const KX = 0.90;
  const KY = 0.44;
  const SVGNS = 'http://www.w3.org/2000/svg';

  const project = (x, y, z) => [(x - y) * KX, (x + y) * KY - (z || 0)];
  const fmt = (p) => p[0].toFixed(1) + ',' + p[1].toFixed(1);
  const path = (pts) => 'M' + pts.map(fmt).join('L') + 'Z';

  /* Faces d'un volume : dessus + les deux flancs visibles (x max et y max). */
  function box(b) {
    const { x, y, w, d, h } = b;
    const x1 = x + w;
    const y1 = y + d;
    return {
      top: path([project(x, y, h), project(x1, y, h), project(x1, y1, h), project(x, y1, h)]),
      // flanc droit (plan x = x1)
      right: path([project(x1, y, h), project(x1, y1, h), project(x1, y1, 0), project(x1, y, 0)]),
      // flanc gauche (plan y = y1)
      left: path([project(x, y1, h), project(x1, y1, h), project(x1, y1, 0), project(x, y1, 0)]),
      center: project(x + w / 2, y + d / 2, h),
      ground: project(x + w / 2, y + d / 2, 0),
      depth: x + w / 2 + y + d / 2
    };
  }

  /* Un mur = un plan vertical entre deux points au sol. */
  function wall(from, to, h) {
    return path([
      project(from[0], from[1], h), project(to[0], to[1], h),
      project(to[0], to[1], 0), project(from[0], from[1], 0)
    ]);
  }

  /* Polygone au sol (dalle, emprise, inlay). */
  const slab = (pts, z) => path(pts.map((p) => project(p[0], p[1], z || 0)));

  /* Un cercle au sol devient une ellipse à axes horizontaux/verticaux. */
  function disc(cx, cy, r, z) {
    const c = project(cx, cy, z || 0);
    return { cx: c[0], cy: c[1], rx: r * KX * Math.SQRT2, ry: r * KY * Math.SQRT2 };
  }

  function el(name, attrs, parent) {
    const n = document.createElementNS(SVGNS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* Volume de verre : flancs sombres, plateau translucide, arêtes lumineuses. */
  function glassBox(parent, b, opts) {
    const o = opts || {};
    const g = box(b);
    const grp = el('g', { class: 'vol' + (o.class ? ' ' + o.class : '') }, parent);

    if (o.halo !== false) {
      const d = disc(b.x + b.w / 2, b.y + b.d / 2, Math.max(b.w, b.d) * 0.78);
      el('ellipse', { class: 'vol__halo', cx: d.cx, cy: d.cy, rx: d.rx, ry: d.ry }, grp);
    }
    el('path', { class: 'vol__face vol__face--left', d: g.left }, grp);
    el('path', { class: 'vol__face vol__face--right', d: g.right }, grp);
    el('path', { class: 'vol__top', d: g.top }, grp);

    // liseré du plateau
    const inset = Math.min(b.w, b.d) * 0.17;
    if (o.inset !== false && Math.min(b.w, b.d) > 30) {
      el('path', {
        class: 'vol__inlay',
        d: box({ x: b.x + inset, y: b.y + inset, w: b.w - inset * 2, d: b.d - inset * 2, h: b.h }).top
      }, grp);
    }
    return { g: grp, geo: g };
  }

  return { project, path, box, wall, slab, disc, el, glassBox, KX, KY };
})();

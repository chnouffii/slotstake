/* ============================================================
   Réserve 1862 — expérience
   Salle isométrique interactive, carte d'immersion, dock flottant.
   ============================================================ */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const STORE = 'r1862.bookings.v2';
  const euro = (n) => n.toLocaleString('fr-FR') + ' €';
  const zoneById = (id) => ZONES.find((z) => z.id === id);
  const packById = (id) => PACKS.find((p) => p.id === id);
  const eventById = (id) => EVENTS.find((e) => e.id === id);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const state = {
    eventId: EVENTS[0].id,
    selected: null,
    hovered: null,
    bookings: load(),
    trigger: null
  };

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state.bookings)); } catch (e) { /* privé */ }
  }
  const pending = (evId) => state.bookings[evId] || [];

  function statusOf(zoneId, evId) {
    const ev = eventById(evId || state.eventId);
    if (ev.reserved.indexOf(zoneId) > -1) return 'taken';
    if (pending(ev.id).indexOf(zoneId) > -1) return 'pending';
    return 'free';
  }
  const label = (st) => (st === 'free' ? 'Disponible' : st === 'pending' ? 'Demande envoyée' : 'Complet');
  const freeCount = (evId) => ZONES.filter((z) => statusOf(z.id, evId) === 'free').length;

  /* ==============================================================
     1. La salle
     ============================================================== */
  function buildRoom() {
    const svg = $('#iso');
    const struct = $('#iso-structure');
    const objects = $('#iso-objects');
    const front = $('#iso-front');

    // sol
    Iso.el('path', { class: 'floor', d: Iso.slab(ROOM.floor) }, struct);

    // murs du fond
    ROOM.walls.forEach((w) => {
      Iso.el('path', { class: 'wall', d: Iso.wall(w.from, w.to, w.h) }, struct);
    });

    // trames du sol (lignes de dalles, très discrètes)
    const grid = Iso.el('g', { class: 'grid' }, struct);
    for (let gx = 0; gx <= 680; gx += 68) {
      const a = Iso.project(gx, 0, 0), b = Iso.project(gx, 680, 0);
      Iso.el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, grid);
    }
    for (let gy = 0; gy <= 680; gy += 68) {
      const a = Iso.project(0, gy, 0), b = Iso.project(gy > 420 ? 680 : 820, gy, 0);
      Iso.el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, grid);
    }

    // piste : halo + cercles
    const d0 = Iso.disc(ROOM.dancefloor.cx, ROOM.dancefloor.cy, ROOM.dancefloor.r);
    Iso.el('ellipse', {
      class: 'dance-glow', cx: d0.cx, cy: d0.cy, rx: d0.rx * 1.35, ry: d0.ry * 1.35
    }, struct);
    [1, 0.72, 0.44].forEach((k, i) => {
      const d = Iso.disc(ROOM.dancefloor.cx, ROOM.dancefloor.cy, ROOM.dancefloor.r * k);
      Iso.el('ellipse', {
        class: 'dance-ring' + (i === 0 ? ' dance-ring--main' : ''),
        cx: d.cx, cy: d.cy, rx: d.rx, ry: d.ry
      }, struct);
    });
    // nappes de lumière au sol (DJ, bar, escalier)
    [[196, 40, 190], [385, 600, 210], [756, 560, 170]].forEach((p) => {
      const d = Iso.disc(p[0], p[1], p[2]);
      Iso.el('ellipse', { class: 'pool', cx: d.cx, cy: d.cy, rx: d.rx, ry: d.ry }, struct);
    });

    const dl = Iso.project(ROOM.dancefloor.cx, ROOM.dancefloor.cy, 0);
    Iso.el('text', { class: 'floor-tag', x: dl[0], y: dl[1] + 4 }, struct).textContent = 'DANCEFLOOR';

    /* objets triés en profondeur (peintre) */
    const items = [];

    ROOM.fixtures.forEach((f) => {
      items.push({
        depth: Iso.box(f.box).depth,
        draw: (layer) => {
          const { g, geo } = Iso.glassBox(layer, f.box, { class: 'fixture fixture--' + f.kind, halo: false });
          Iso.el('text', { class: 'vol__tag', x: geo.center[0], y: geo.center[1] + 4 }, g).textContent =
            f.label.toUpperCase();
        }
      });
    });

    // escalier
    const s = ROOM.stairs;
    for (let i = 0; i < s.steps; i++) {
      const b = { x: s.x, y: s.y + (s.steps - 1 - i) * s.d, w: s.w, d: s.d, h: s.rise * (i + 1) };
      items.push({
        depth: Iso.box(b).depth,
        draw: (layer) => Iso.glassBox(layer, b, { class: 'fixture fixture--step', halo: false, inset: false })
      });
    }
    const st = Iso.project(s.x + s.w / 2, s.y + s.steps * s.d + 26, 0);
    Iso.el('text', { class: 'floor-tag floor-tag--dim', x: st[0], y: st[1] }, struct).textContent = 'ESCALIER · ACCÈS';

    // tables
    ZONES.forEach((z) => {
      items.push({ depth: Iso.box(z.iso).depth, draw: (layer) => buildZone(layer, z) });
    });

    items.sort((a, b) => a.depth - b.depth).forEach((it) => it.draw(objects));

    // bordures basses (limites de salle côté spectateur)
    ROOM.curbs.forEach((c) => {
      Iso.el('path', { class: 'curb', d: Iso.wall(c.from, c.to, c.h) }, front);
    });

    return svg;
  }

  function buildZone(layer, z) {
    const { g, geo } = Iso.glassBox(layer, z.iso, { class: 'zone zone--' + z.kind });
    g.setAttribute('data-zone', z.id);
    g.setAttribute('role', 'button');
    g.setAttribute('tabindex', '0');

    Iso.el('text', { class: 'vol__code', x: geo.center[0], y: geo.center[1] + 4 }, g).textContent = z.code;

    // croix « complet », posée à plat sur le plateau
    const b = z.iso;
    const c = Iso.el('g', { class: 'vol__x' }, g);
    const k = 0.3;
    const p1 = Iso.project(b.x + b.w * k, b.y + b.d * k, b.h);
    const p2 = Iso.project(b.x + b.w * (1 - k), b.y + b.d * (1 - k), b.h);
    const p3 = Iso.project(b.x + b.w * (1 - k), b.y + b.d * k, b.h);
    const p4 = Iso.project(b.x + b.w * k, b.y + b.d * (1 - k), b.h);
    Iso.el('line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1] }, c);
    Iso.el('line', { x1: p3[0], y1: p3[1], x2: p4[0], y2: p4[1] }, c);
    return g;
  }

  /* ---- Mini rendu isométrique pour la carte d'immersion ---- */
  function miniIso(z) {
    const b = { x: 0, y: 0, w: z.iso.w, d: z.iso.d, h: z.iso.h };
    const pts = [];
    [0, b.h].forEach((h) => {
      [[0, 0], [b.w, 0], [b.w, b.d], [0, b.d]].forEach((p) => pts.push(Iso.project(p[0], p[1], h)));
    });
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const pad = Math.max(b.w, b.d) * 0.75;
    const svg = Iso.el('svg', {
      class: 'mini',
      viewBox: [Math.min.apply(null, xs) - pad, Math.min.apply(null, ys) - pad * 0.7,
        Math.max.apply(null, xs) - Math.min.apply(null, xs) + pad * 2,
        Math.max.apply(null, ys) - Math.min.apply(null, ys) + pad * 1.7].join(' '),
      'aria-hidden': 'true'
    });
    const g = Iso.el('g', { class: 'mini__scene' }, svg);
    Iso.glassBox(g, b, { class: 'zone zone--' + z.kind + ' is-mini' });
    return svg;
  }

  /* ==============================================================
     2. Statuts
     ============================================================== */
  function paint() {
    const ev = eventById(state.eventId);
    ZONES.forEach((z) => {
      const st = statusOf(z.id);
      const node = $('#iso [data-zone="' + z.id + '"]');
      if (node) {
        node.setAttribute('data-status', st);
        node.setAttribute('aria-label', z.name + ', ' + z.capacity[0] + ' à ' + z.capacity[1] + ' personnes, ' + label(st).toLowerCase());
        node.classList.toggle('is-active', state.selected === z.id);
      }
      const chip = $('#dock-rail [data-zone="' + z.id + '"]');
      if (chip) {
        chip.setAttribute('data-status', st);
        chip.classList.toggle('is-active', state.selected === z.id);
        $('.chip__state', chip).textContent = label(st);
      }
    });

    EVENTS.forEach((e) => {
      const n = $('[data-free-for="' + e.id + '"]');
      if (n) n.textContent = freeCount(e.id) + ' libres';
    });

    const n = freeCount(state.eventId);
    $('#avail').innerHTML = '<b>' + String(n).padStart(2, '0') + '</b> table' + (n > 1 ? 's' : '') +
      ' disponible' + (n > 1 ? 's' : '') + ' <i>/ ' + ZONES.length + '</i>';
    const note = $('#event-note');
    note.textContent = ev.note || '';
    note.hidden = !ev.note;
  }

  function selectEvent(id, quiet) {
    state.eventId = id;
    state.selected = null;
    $$('#dock-dates [data-event]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.event === id)));
    paint();
    closeCard(true);
    if (!quiet) toast('Soirée du ' + eventById(id).short.toLowerCase() + ' — ' + freeCount(id) + ' tables disponibles');
  }

  /* ==============================================================
     3. Dock flottant : soirées + carrousel de tables
     ============================================================== */
  function buildDock() {
    $('#dock-dates').innerHTML = EVENTS.map(
      (e) => `<button type="button" role="tab" data-event="${e.id}" aria-selected="false">
        <b>${e.date}</b><span>${e.day.slice(0, 3)}.</span>
      </button>`
    ).join('');

    $('#dock-rail').innerHTML = ZONES.map(
      (z) => `<button type="button" class="chip" data-zone="${z.id}">
        <span class="chip__code">${z.code}</span>
        <span class="chip__meta">${z.capacity[0]}–${z.capacity[1]} pers · ${euro(z.min)}</span>
        <span class="chip__state">—</span>
      </button>`
    ).join('');

    $('#dock-dates').addEventListener('click', (e) => {
      const b = e.target.closest('[data-event]');
      if (b) selectEvent(b.dataset.event);
    });

    const rail = $('#dock-rail');
    rail.addEventListener('click', (e) => {
      const b = e.target.closest('[data-zone]');
      if (b) openCard(b.dataset.zone, b);
    });
    rail.addEventListener('pointerover', (e) => {
      const b = e.target.closest('[data-zone]');
      if (b) hover(b.dataset.zone);
    });
    rail.addEventListener('pointerleave', () => hover(null));
    rail.addEventListener('focusin', (e) => {
      const b = e.target.closest('[data-zone]');
      if (b) hover(b.dataset.zone);
    });
    rail.addEventListener('focusout', () => hover(null));

    $$('.dock__arrow').forEach((btn) =>
      btn.addEventListener('click', () => {
        rail.scrollBy({ left: (btn.dataset.dir === 'next' ? 1 : -1) * 280, behavior: reduced() ? 'auto' : 'smooth' });
      })
    );

    // le dock n'apparaît que devant la salle
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (en) => en.forEach((x) => document.body.classList.toggle('dock-on', x.isIntersecting)),
        { rootMargin: '-12% 0px -22% 0px' }
      );
      io.observe($('#reservations'));
    } else {
      document.body.classList.add('dock-on');
    }
  }

  /* ==============================================================
     4. Survol : halo, assombrissement, badge curseur
     ============================================================== */
  function hover(zoneId) {
    if (state.hovered === zoneId) return;
    state.hovered = zoneId;
    const svg = $('#iso');
    svg.classList.toggle('is-focus', !!zoneId);
    $$('#iso .zone').forEach((n) => n.classList.toggle('is-hover', n.dataset.zone === zoneId));
    $$('#dock-rail .chip').forEach((n) => n.classList.toggle('is-hover', n.dataset.zone === zoneId));

    const badge = $('#cursor-badge');
    if (!zoneId) {
      badge.classList.remove('is-on');
      document.body.classList.remove('is-pointing');
      return;
    }
    const z = zoneById(zoneId);
    const st = statusOf(zoneId);
    badge.dataset.status = st;
    badge.innerHTML = '<b>' + z.code + '</b><i></i><span>' + label(st).toUpperCase() + '</span>';
    badge.classList.add('is-on');
    document.body.classList.add('is-pointing');
  }

  function initCursor() {
    if (!fine() || reduced()) return;
    document.body.classList.add('has-cursor');
    const glow = $('#cursor-glow');
    const badge = $('#cursor-badge');
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let gx = tx, gy = ty, bx = tx, by = ty;

    window.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
    }, { passive: true });

    (function loop() {
      gx += (tx - gx) * 0.085;
      gy += (ty - gy) * 0.085;
      bx += (tx - bx) * 0.24;
      by += (ty - by) * 0.24;
      glow.style.transform = 'translate3d(' + (gx - 260) + 'px,' + (gy - 260) + 'px,0)';
      badge.style.transform = 'translate3d(' + (bx + 20) + 'px,' + (by + 18) + 'px,0)';
      requestAnimationFrame(loop);
    })();
  }

  /* léger parallaxe de la salle au mouvement de la souris */
  function initParallax() {
    if (!fine() || reduced()) return;
    const scene = $('#iso-scene');
    const stage = $('#stage');
    let raf = 0;
    stage.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = stage.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        scene.style.transform = 'translate3d(' + (-dx * 26).toFixed(1) + 'px,' + (-dy * 18).toFixed(1) + 'px,0)';
      });
    }, { passive: true });
    stage.addEventListener('pointerleave', () => { scene.style.transform = ''; });
  }

  /* ==============================================================
     5. Carte d'immersion
     ============================================================== */
  const modal = $('#immersive');

  function openCard(zoneId, trigger) {
    const z = zoneById(zoneId);
    if (!z) return;
    const ev = eventById(state.eventId);
    const st = statusOf(zoneId);
    state.selected = zoneId;
    state.trigger = trigger || null;
    paint();

    const visual = $('#icard-visual');
    visual.style.setProperty('--amb-1', z.amb[0]);
    visual.style.setProperty('--amb-2', z.amb[1]);
    visual.innerHTML = '';
    visual.appendChild(miniIso(z));
    visual.insertAdjacentHTML('beforeend',
      '<div class="icard__vmeta"><span class="kicker">' + z.area + '</span>' +
      '<p class="icard__mood">' + z.mood + '</p></div>' +
      '<span class="icard__state" data-status="' + st + '">' + label(st) + '</span>');

    $('#icard-body').innerHTML = st === 'taken' ? tplTaken(z, ev) : st === 'pending' ? tplPending(z, ev) : tplForm(z, ev);

    modal.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(() => modal.classList.add('is-open'));
    bindCard(z, ev);
    const first = $('#icard-body input, #icard-body button');
    if (first) setTimeout(() => first.focus({ preventScroll: true }), 260);
  }

  function closeCard(silent) {
    if (modal.hidden) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(() => { modal.hidden = true; $('#icard-body').innerHTML = ''; }, 420);
    state.selected = null;
    paint();
    if (!silent && state.trigger && state.trigger.focus) state.trigger.focus({ preventScroll: true });
  }

  function specs(z) {
    return `<div class="specs">
      <div><span class="kicker">Capacité</span><b>${z.capacity[0] === z.capacity[1] ? z.capacity[0] : z.capacity[0] + '–' + z.capacity[1]} pers.</b></div>
      <div><span class="kicker">Minimum</span><b>${euro(z.min)}</b></div>
      <div><span class="kicker">Service</span><b>Dès 23h30</b></div>
    </div>`;
  }

  function tplForm(z, ev) {
    const packs = z.packIds.map(packById);
    const guests = [];
    for (let i = z.capacity[0]; i <= z.capacity[1]; i++) guests.push(i);

    return `
      <span class="kicker">${ev.short} · ${ev.name}</span>
      <h3 id="icard-title" class="display">${z.name}</h3>
      <p class="icard__desc">${z.desc}</p>
      ${specs(z)}

      <div class="incl">
        <span class="kicker">Inclus</span>
        <ul>${z.includes.map((i) => '<li>' + i + '</li>').join('')}</ul>
      </div>

      <form id="rform" novalidate>
        <fieldset class="fs">
          <legend class="kicker">Magnum / pack bouteilles</legend>
          <div class="packs">
            ${packs.map((p, i) => `
              <label class="pack">
                <input type="radio" name="pack" value="${p.id}" ${i === 0 ? 'checked' : ''} />
                <span><b>${p.short}</b><em>${euro(p.price)}</em></span>
              </label>`).join('')}
            <label class="pack">
              <input type="radio" name="pack" value="sur-place" />
              <span><b>Sur place</b><em>—</em></span>
            </label>
          </div>
        </fieldset>

        <fieldset class="fs">
          <legend class="kicker">Convives</legend>
          <div class="stepper" data-min="${z.capacity[0]}" data-max="${z.capacity[1]}">
            <button type="button" data-step="-1" aria-label="Retirer un convive">−</button>
            <output id="guests" name="guests">${z.capacity[0]}</output>
            <button type="button" data-step="1" aria-label="Ajouter un convive">+</button>
          </div>
        </fieldset>

        <div class="rows">
          <label class="in"><span class="kicker">Nom</span>
            <input name="name" type="text" autocomplete="name" placeholder="Camille Meyer" required /></label>
          <label class="in"><span class="kicker">Téléphone</span>
            <input name="tel" type="tel" autocomplete="tel" placeholder="06 12 34 56 78" required /></label>
        </div>
        <p class="err" id="rerr"></p>

        <button class="btn btn--gold btn--full" type="submit">
          <span>Confirmer la réservation</span>
        </button>
        <p class="fine">Rappel sous 2 h pour valider. ${ev.tag === '+17' ? 'Soirée +17 : contrôle d’identité à l’entrée. ' : ''}Démo : rien n’est envoyé, tout reste dans ce navigateur.</p>
      </form>`;
  }

  function tplTaken(z, ev) {
    return `
      <span class="kicker">${ev.short} · ${ev.name}</span>
      <h3 id="icard-title" class="display">${z.name}</h3>
      <p class="icard__desc">${z.desc}</p>
      ${specs(z)}
      <form id="rform" data-mode="waitlist" novalidate>
        <p class="taken-note">Cette table est complète pour cette soirée. Laissez vos coordonnées : nous appelons dès qu’une table équivalente se libère.</p>
        <div class="rows">
          <label class="in"><span class="kicker">Nom</span><input name="name" type="text" required placeholder="Camille Meyer" /></label>
          <label class="in"><span class="kicker">Téléphone</span><input name="tel" type="tel" required placeholder="06 12 34 56 78" /></label>
        </div>
        <p class="err" id="rerr"></p>
        <button class="btn btn--ghost btn--full" type="submit"><span>Me prévenir en cas de libération</span></button>
      </form>`;
  }

  function tplPending(z, ev) {
    return `
      <span class="kicker">${ev.short} · ${ev.name}</span>
      <h3 id="icard-title" class="display">${z.name}</h3>
      <p class="icard__desc">Votre demande est en attente de confirmation. Nous vous rappelons sous 2 h au numéro transmis.</p>
      ${specs(z)}
      <button class="btn btn--ghost btn--full" type="button" id="cancel-req"><span>Annuler ma demande</span></button>
      <p class="fine">Annulation sans frais jusqu’à 48 h avant la soirée.</p>`;
  }

  function bindCard(z, ev) {
    const cancel = $('#cancel-req');
    if (cancel) {
      cancel.addEventListener('click', () => {
        state.bookings[ev.id] = pending(ev.id).filter((id) => id !== z.id);
        save();
        toast(z.name + ' — demande annulée.');
        closeCard();
      });
    }

    const form = $('#rform');
    if (!form) return;

    const step = $('.stepper', form);
    if (step) {
      $$('button', step).forEach((b) =>
        b.addEventListener('click', () => {
          const out = $('output', step);
          const min = +step.dataset.min, max = +step.dataset.max;
          out.textContent = Math.min(max, Math.max(min, +out.textContent + +b.dataset.step));
        })
      );
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.elements.name.value.trim();
      const tel = form.elements.tel.value.trim();
      const err = $('#rerr');

      if (name.length < 2) return fail(err, 'Indiquez le nom de la réservation.', form.elements.name);
      if (tel.replace(/[^\d+]/g, '').length < 9) return fail(err, 'Numéro incomplet — nous devons pouvoir vous rappeler.', form.elements.tel);
      err.textContent = '';

      if (form.dataset.mode === 'waitlist') {
        toast('Vous êtes sur la liste d’attente pour ' + z.name + '.');
        closeCard();
        return;
      }

      const list = pending(ev.id);
      if (list.indexOf(z.id) === -1) list.push(z.id);
      state.bookings[ev.id] = list;
      save();
      paint();

      const packId = form.elements.pack.value;
      success(z, ev, {
        name: name,
        tel: tel,
        guests: $('#guests').textContent,
        pack: packId === 'sur-place' ? 'Choix sur place' : packById(packId).name
      });
    });
  }

  function fail(node, msg, input) {
    node.textContent = msg;
    node.classList.remove('is-shake');
    void node.offsetWidth;
    node.classList.add('is-shake');
    if (input) input.focus();
  }

  function success(z, ev, data) {
    const ref = 'R1862-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    if (navigator.vibrate && !reduced()) navigator.vibrate([16, 42, 26]);

    $('#icard-body').innerHTML = `
      <div class="done">
        <div class="done__seal" aria-hidden="true">
          <span class="ring"></span><span class="ring ring--2"></span>
          <svg viewBox="0 0 48 48"><path class="tick" d="M13 24.5l7.5 7.5L36 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <span class="kicker">Demande enregistrée</span>
        <h3 class="display">Votre table<br />vous attend</h3>
        <dl class="recap">
          <div><dt>Table</dt><dd>${z.name}</dd></div>
          <div><dt>Soirée</dt><dd>${ev.short} · ${ev.name}</dd></div>
          <div><dt>Convives</dt><dd>${data.guests} personnes</dd></div>
          <div><dt>Pack</dt><dd>${data.pack}</dd></div>
          <div><dt>Contact</dt><dd>${data.name} · ${data.tel}</dd></div>
          <div><dt>Référence</dt><dd class="ref">${ref}</dd></div>
        </dl>
        <button class="btn btn--ghost btn--full" type="button" data-close><span>Fermer</span></button>
      </div>`;
    $('#immersive').classList.add('is-done');
    setTimeout(() => $('#immersive').classList.remove('is-done'), 1400);
    const b = $('#icard-body [data-close]');
    if (b) b.focus({ preventScroll: true });
    toast(z.name + ' — demande envoyée, réf. ' + ref);
  }

  /* ==============================================================
     6. Toast
     ============================================================== */
  let tt;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(tt);
    tt = setTimeout(() => t.classList.remove('is-on'), 3800);
  }

  /* ==============================================================
     7. Hero, agenda, carte
     ============================================================== */
  function splitTitle() {
    $$('[data-split]').forEach((node) => {
      const lines = node.innerHTML.split('<br>').length > 1 ? node.innerHTML.split('<br>') : [node.innerHTML];
      node.innerHTML = lines
        .map((l) => '<span class="line"><span class="line__in">' + l.trim() + '</span></span>')
        .join('');
      $$('.line__in', node).forEach((n, i) => (n.style.transitionDelay = 0.12 + i * 0.13 + 's'));
    });
  }

  function nextEvent() {
    const now = Date.now();
    return EVENTS.find((e) => new Date(e.when).getTime() > now) || EVENTS[0];
  }

  function initCountdown() {
    const ev = nextEvent();
    $('#next-title').textContent = ev.title;
    $('#next-line').textContent = ev.line;
    const target = new Date(ev.when).getTime();
    const set = (u, v) => {
      const n = $('[data-unit="' + u + '"]');
      if (n) n.textContent = String(v).padStart(2, '0');
    };
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      set('d', Math.floor(diff / 864e5));
      set('h', Math.floor((diff % 864e5) / 36e5));
      set('m', Math.floor((diff % 36e5) / 6e4));
      set('s', Math.floor((diff % 6e4) / 1e3));
    };
    tick();
    setInterval(tick, 1000);
  }

  function initVideo() {
    const v = $('#teaser');
    if (!v) return;
    const on = () => v.classList.add('is-on');
    if (v.readyState >= 2) on();
    v.addEventListener('loadeddata', on);
    v.addEventListener('canplay', on);
    v.play().catch(() => { /* autoplay refusé : le fond CSS prend le relais */ });
  }

  function renderAgenda() {
    $('#agenda').innerHTML = EVENTS.map(
      (e) => `
      <article class="ev">
        <span class="ev__tag">${e.tag}</span>
        <p class="ev__date"><b>${e.date}</b><span>${e.day}</span></p>
        <h3 class="display">${e.name}</h3>
        <p class="ev__line">${e.line}</p>
        <p class="ev__free"><i></i><span data-free-for="${e.id}">—</span></p>
        <div class="ev__cta">
          <button type="button" class="link" data-goto="${e.id}">Choisir une table</button>
          <a class="link link--dim" href="mailto:reservations@reserve1862.fr?subject=Guestlist%20${encodeURIComponent(e.short)}">Guestlist</a>
        </div>
      </article>`
    ).join('');

    $('#agenda').addEventListener('click', (e) => {
      const b = e.target.closest('[data-goto]');
      if (!b) return;
      selectEvent(b.dataset.goto, true);
      $('#reservations').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
      toast('Soirée du ' + eventById(b.dataset.goto).short.toLowerCase() + ' — choisissez votre table');
    });
  }

  function renderPacks() {
    $('#bottles').innerHTML = PACKS.map(
      (p, i) => `
      <article class="bt">
        <span class="bt__idx">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="display">${p.name}</h3>
        <p>${p.detail}</p>
        <p class="bt__price">${euro(p.price)}</p>
      </article>`
    ).join('');
  }

  function initRails() {
    $$('[data-rail]').forEach((wrap) => {
      const rail = $('.rail', wrap);
      $$('[data-dir]', wrap).forEach((b) =>
        b.addEventListener('click', () =>
          rail.scrollBy({ left: (b.dataset.dir === 'next' ? 1 : -1) * Math.min(520, rail.clientWidth * 0.8), behavior: reduced() ? 'auto' : 'smooth' })
        )
      );
    });
  }

  /* ==============================================================
     8. Chrome
     ============================================================== */
  function initChrome() {
    const header = $('#header');
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const burger = $('#burger');
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('#nav a').forEach((a) =>
      a.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      })
    );

    if ('IntersectionObserver' in window && !reduced()) {
      const io = new IntersectionObserver(
        (en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } }),
        { rootMargin: '0px 0px -10% 0px', threshold: 0.06 }
      );
      $$('.reveal').forEach((n) => io.observe(n));
    } else {
      $$('.reveal').forEach((n) => n.classList.add('is-in'));
    }

    if ('IntersectionObserver' in window) {
      const links = $$('#nav a');
      const spy = new IntersectionObserver(
        (en) => en.forEach((x) => {
          if (!x.isIntersecting) return;
          links.forEach((l) => l.classList.toggle('is-current', l.getAttribute('href') === '#' + x.target.id));
        }),
        { rootMargin: '-45% 0px -50% 0px' }
      );
      ['reservations', 'programmation', 'carte', 'infos'].forEach((id) => {
        const n = document.getElementById(id);
        if (n) spy.observe(n);
      });
    }

    $('#year').textContent = new Date().getFullYear();
    $('#reset').addEventListener('click', () => {
      state.bookings = {};
      save();
      paint();
      toast('Réservations de démonstration effacées.');
    });
  }

  function initInteractions() {
    const svg = $('#iso');

    svg.addEventListener('pointerover', (e) => {
      const z = e.target.closest('.zone');
      hover(z ? z.dataset.zone : null);
    });
    svg.addEventListener('pointerleave', () => hover(null));
    svg.addEventListener('click', (e) => {
      const z = e.target.closest('.zone');
      if (z) openCard(z.dataset.zone, z);
    });
    svg.addEventListener('keydown', (e) => {
      const z = e.target.closest('.zone');
      if (!z) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        openCard(z.dataset.zone, z);
      }
    });
    svg.addEventListener('focusin', (e) => {
      const z = e.target.closest('.zone');
      if (z) hover(z.dataset.zone);
    });
    svg.addEventListener('focusout', () => hover(null));

    modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeCard(); });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!modal.hidden) closeCard();
        else if (document.body.classList.contains('nav-open')) $('#burger').click();
      }
      if (e.key === 'Tab' && !modal.hidden) {
        const f = $$('#immersive button, #immersive input, #immersive a[href]').filter((n) => n.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ==============================================================
     Démarrage
     ============================================================== */
  function init() {
    splitTitle();
    buildRoom();
    buildDock();
    renderAgenda();
    renderPacks();
    initRails();
    initInteractions();
    initCursor();
    initParallax();
    initCountdown();
    initVideo();
    initChrome();
    selectEvent(EVENTS[0].id, true);
    requestAnimationFrame(() => document.body.classList.add('is-ready'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

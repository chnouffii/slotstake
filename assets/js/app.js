/* ============================================================
   Réserve 1862 — interactions
   Plan interactif, drawer de réservation, agenda, hero.
   Aucune dépendance externe.
   ============================================================ */
(function () {
  'use strict';

  const SVGNS = 'http://www.w3.org/2000/svg';
  const STORE_KEY = 'r1862.demo.bookings.v1';
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const euro = (n) => n.toLocaleString('fr-FR') + ' €';
  const zoneById = (id) => ZONES.find((z) => z.id === id);
  const packById = (id) => PACKS.find((p) => p.id === id);
  const eventById = (id) => EVENTS.find((e) => e.id === id);

  /* ---------------------------------------------------------------
     État
     --------------------------------------------------------------- */
  const state = {
    eventId: EVENTS[0].id,
    selected: null,
    view: 'plan',
    bookings: readStore(),
    lastTrigger: null
  };

  function readStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }
  function writeStore() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state.bookings));
    } catch (e) {
      /* stockage indisponible : la démo reste fonctionnelle en mémoire */
    }
  }

  function pendingFor(eventId) {
    return state.bookings[eventId] || [];
  }
  function statusOf(zoneId, eventId) {
    const ev = eventById(eventId || state.eventId);
    if (ev.reserved.indexOf(zoneId) > -1) return 'taken';
    if (pendingFor(ev.id).indexOf(zoneId) > -1) return 'pending';
    return 'free';
  }
  function freeCount(eventId) {
    return ZONES.filter((z) => statusOf(z.id, eventId) === 'free').length;
  }

  /* ---------------------------------------------------------------
     Plan SVG — construction des tables
     --------------------------------------------------------------- */
  function el(name, attrs) {
    const node = document.createElementNS(SVGNS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function seatRing(cx, cy, r, count) {
    const g = el('g', { class: 'seats' });
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count - Math.PI / 2;
      g.appendChild(
        el('circle', {
          cx: (cx + Math.cos(a) * (r + 15)).toFixed(1),
          cy: (cy + Math.sin(a) * (r + 15)).toFixed(1),
          r: 6.5
        })
      );
    }
    return g;
  }

  function buildZone(zone) {
    const g = el('g', {
      class: 'zone zone--' + zone.kind,
      'data-zone': zone.id,
      role: 'button',
      tabindex: '0'
    });

    const geo = zone.geo;
    let cx, cy;

    if (geo.type === 'rect') {
      cx = geo.x + geo.w / 2;
      cy = geo.y + geo.h / 2;
      g.appendChild(el('rect', { class: 'zone__shape', x: geo.x, y: geo.y, width: geo.w, height: geo.h, rx: 3 }));
      // assises schématiques
      if (zone.kind === 'carre') {
        g.appendChild(el('line', { class: 'zone__seat', x1: geo.x + 8, y1: geo.y + 9, x2: geo.x + geo.w - 8, y2: geo.y + 9 }));
        g.appendChild(el('line', { class: 'zone__seat', x1: geo.x + 8, y1: geo.y + geo.h - 9, x2: geo.x + geo.w - 8, y2: geo.y + geo.h - 9 }));
        g.appendChild(el('circle', { class: 'zone__table', cx: cx, cy: cy + 4, r: 13 }));
      } else {
        g.appendChild(el('line', { class: 'zone__seat', x1: geo.x + 7, y1: geo.y + 10, x2: geo.x + 7, y2: geo.y + geo.h - 10 }));
        g.appendChild(el('circle', { class: 'zone__table', cx: geo.x + geo.w - 30, cy: cy, r: 12 }));
      }
      g.appendChild(
        el('text', { class: 'zone__code zone__code--corner', x: geo.x + 9, y: geo.y + 18 })
      ).textContent = zone.code;
    } else {
      cx = geo.cx;
      cy = geo.cy;
      g.appendChild(seatRing(geo.cx, geo.cy, geo.r, zone.kind === 'lounge' ? 4 : 3));
      g.appendChild(el('circle', { class: 'zone__shape zone__shape--round', cx: geo.cx, cy: geo.cy, r: geo.r }));
      g.appendChild(el('text', { class: 'zone__code', x: geo.cx, y: geo.cy + 5 })).textContent = zone.code;
    }

    // croix « complet »
    const cross = el('g', { class: 'zone__cross' });
    const s = geo.type === 'rect' ? 15 : geo.r * 0.55;
    cross.appendChild(el('line', { x1: cx - s, y1: cy - s, x2: cx + s, y2: cy + s }));
    cross.appendChild(el('line', { x1: cx + s, y1: cy - s, x2: cx - s, y2: cy + s }));
    g.appendChild(cross);

    // zone de clic généreuse
    if (geo.type === 'rect') {
      g.appendChild(el('rect', { class: 'zone__hit', x: geo.x - 4, y: geo.y - 4, width: geo.w + 8, height: geo.h + 8 }));
    } else {
      g.appendChild(el('circle', { class: 'zone__hit', cx: geo.cx, cy: geo.cy, r: geo.r + 22 }));
    }

    return g;
  }

  function renderPlan() {
    const layer = $('#fp-tables');
    layer.textContent = '';
    ZONES.forEach((z) => layer.appendChild(buildZone(z)));
  }

  /* ---------------------------------------------------------------
     Liste (repli mobile / navigation clavier)
     --------------------------------------------------------------- */
  function renderList() {
    const groups = [
      ['Carrés VIP', ['vip1', 'vip2', 'vip3', 'vip4']],
      ['Ligne VIP · banquettes', ['b1', 'b2', 'b3', 'b4']],
      ['Tables hautes · dancefloor', ['t1', 't2', 't3']],
      ['Lounge · carré bas', ['l1', 'l2', 'l3', 'l4']]
    ];
    const wrap = $('#tablelist');
    wrap.innerHTML = groups
      .map(
        ([title, ids]) => `
        <div class="tablelist__group">
          <p class="micro">${title}</p>
          <div class="tablelist__rows">
            ${ids
              .map((id) => {
                const z = zoneById(id);
                return `<button type="button" class="trow" data-zone="${z.id}">
                    <span class="trow__code">${z.code}</span>
                    <span class="trow__body">
                      <b>${z.name}</b>
                      <em>${z.capacity[0]}–${z.capacity[1]} pers. · min. ${euro(z.min)}</em>
                    </span>
                    <span class="trow__status"></span>
                  </button>`;
              })
              .join('')}
          </div>
        </div>`
      )
      .join('');
  }

  /* ---------------------------------------------------------------
     Application des statuts
     --------------------------------------------------------------- */
  function paintStatuses() {
    const ev = eventById(state.eventId);
    ZONES.forEach((z) => {
      const st = statusOf(z.id);
      const label =
        z.name + ' — ' + z.capacity[0] + ' à ' + z.capacity[1] + ' personnes — ' +
        (st === 'free' ? 'libre' : st === 'pending' ? 'demande envoyée' : 'complet');

      const node = $('#fp-tables [data-zone="' + z.id + '"]');
      if (node) {
        node.setAttribute('data-status', st);
        node.setAttribute('aria-label', label);
        node.classList.toggle('is-selected', state.selected === z.id);
      }
      const row = $('#tablelist [data-zone="' + z.id + '"]');
      if (row) {
        row.setAttribute('data-status', st);
        row.classList.toggle('is-selected', state.selected === z.id);
        $('.trow__status', row).textContent =
          st === 'free' ? 'Libre' : st === 'pending' ? 'Envoyée' : 'Complet';
      }
    });

    EVENTS.forEach((e) => {
      const cell = $('[data-free-for="' + e.id + '"]');
      if (cell) cell.textContent = freeCount(e.id) + ' tables libres';
    });

    const n = freeCount(state.eventId);
    $('#avail-count').innerHTML =
      '<b>' + n + '</b> table' + (n > 1 ? 's' : '') + ' disponible' + (n > 1 ? 's' : '') +
      ' <span>/ ' + ZONES.length + '</span> · ' + ev.short;
  }

  /* ---------------------------------------------------------------
     Onglets de dates
     --------------------------------------------------------------- */
  function renderDates() {
    const box = $('#date-tabs');
    box.innerHTML = EVENTS.map(
      (e) => `<button type="button" role="tab" data-event="${e.id}" aria-selected="false">
        <b>${e.short}</b><span>${e.title.split('·')[0].trim()}</span>
      </button>`
    ).join('');
    box.addEventListener('click', (evt) => {
      const btn = evt.target.closest('[data-event]');
      if (btn) selectEvent(btn.dataset.event);
    });
  }

  function selectEvent(id) {
    state.eventId = id;
    state.selected = null;
    $$('#date-tabs [data-event]').forEach((b) =>
      b.setAttribute('aria-selected', String(b.dataset.event === id))
    );
    const ev = eventById(id);
    const note = $('#event-note');
    if (note) {
      note.textContent = ev.note || '';
      note.hidden = !ev.note;
    }
    paintStatuses();
    closeDrawer(true);
  }

  /* ---------------------------------------------------------------
     Drawer de réservation
     --------------------------------------------------------------- */
  const root = $('#drawer-root');

  function openDrawer(zoneId, trigger) {
    const z = zoneById(zoneId);
    if (!z) return;
    state.selected = zoneId;
    state.lastTrigger = trigger || null;
    paintStatuses();

    const ev = eventById(state.eventId);
    const st = statusOf(zoneId);

    $('#drawer-kicker').textContent = z.area + ' · ' + ev.short;
    $('#drawer-title').textContent = z.name;
    $('#drawer-body').innerHTML =
      st === 'taken' ? tplTaken(z, ev) : st === 'pending' ? tplPending(z, ev) : tplForm(z, ev);

    root.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(() => root.classList.add('is-open'));

    const first = $('#drawer-body input, #drawer-body button');
    if (first) setTimeout(() => first.focus({ preventScroll: true }), 240);
    bindDrawerForm(z, ev);
  }

  function closeDrawer(silent) {
    if (root.hidden) return;
    root.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    window.setTimeout(() => {
      root.hidden = true;
      $('#drawer-body').innerHTML = '';
    }, 260);
    state.selected = null;
    paintStatuses();
    if (!silent && state.lastTrigger && state.lastTrigger.focus) {
      state.lastTrigger.focus({ preventScroll: true });
    }
  }

  function specRows(z) {
    return `
      <dl class="spec">
        <div><dt>Capacité</dt><dd>${z.capacity[0] === z.capacity[1] ? z.capacity[0] : z.capacity[0] + ' à ' + z.capacity[1]} personnes</dd></div>
        <div><dt>Minimum de consommation</dt><dd>${euro(z.min)}</dd></div>
        <div><dt>Emplacement</dt><dd>${z.area}</dd></div>
      </dl>`;
  }

  function tplForm(z, ev) {
    const reco = packById(z.pack);
    const guests = [];
    for (let i = z.capacity[0]; i <= z.capacity[1]; i++) guests.push(i);
    if (z.capacity[1] > z.capacity[0]) guests.push(z.capacity[1] + 1);

    return `
      <p class="drawer__desc">${z.desc}</p>
      ${specRows(z)}

      <div class="reco">
        <span class="micro">Pack recommandé</span>
        <b>${reco.name}</b>
        <span>${reco.detail}</span>
        <em>${euro(reco.price)}</em>
      </div>

      <form class="rform" id="rform" novalidate>
        <div class="field">
          <label for="f-name">Nom &amp; prénom</label>
          <input id="f-name" name="name" type="text" autocomplete="name" required placeholder="Ex. Camille Meyer" />
          <span class="err" data-for="name"></span>
        </div>
        <div class="field">
          <label for="f-tel">Téléphone</label>
          <input id="f-tel" name="tel" type="tel" inputmode="tel" autocomplete="tel" required placeholder="06 12 34 56 78" />
          <span class="err" data-for="tel"></span>
        </div>
        <div class="field">
          <label for="f-guests">Nombre de convives</label>
          <select id="f-guests" name="guests">
            ${guests
              .map((g) => `<option value="${g}">${g} personne${g > 1 ? 's' : ''}${g > z.capacity[1] ? ' (sur demande)' : ''}</option>`)
              .join('')}
          </select>
        </div>

        <fieldset class="field field--packs">
          <legend>Magnum / pack bouteilles</legend>
          <div class="packs-radio">
            ${PACKS.map(
              (p, i) => `
              <label class="pradio">
                <input type="radio" name="pack" value="${p.id}" ${p.id === z.pack ? 'checked' : ''} />
                <span class="pradio__box">
                  <b>${p.name}</b>
                  <em>${euro(p.price)}</em>
                </span>
              </label>`
            ).join('')}
            <label class="pradio">
              <input type="radio" name="pack" value="sur-place" />
              <span class="pradio__box"><b>Je choisis sur place</b><em>—</em></span>
            </label>
          </div>
        </fieldset>

        <div class="field">
          <label for="f-msg">Précisions <span class="opt">(optionnel)</span></label>
          <textarea id="f-msg" name="msg" rows="2" placeholder="Anniversaire, heure d'arrivée, allergies…"></textarea>
        </div>

        <label class="check">
          <input type="checkbox" name="dress" required />
          <span>J'ai pris connaissance du dress code et des conditions d'entrée${ev.tag === '+17' ? ' (soirée +17)' : ''}.</span>
        </label>
        <span class="err" data-for="dress"></span>

        <button class="btn btn--gold btn--full" type="submit">Envoyer la demande</button>
        <p class="fineprint">Réponse par téléphone sous 2 h. Démo : la demande est enregistrée dans ce navigateur uniquement.</p>
      </form>`;
  }

  function tplTaken(z, ev) {
    return `
      <p class="statusline statusline--taken"><span></span> Complet pour le ${ev.short.toLowerCase()}</p>
      <p class="drawer__desc">${z.desc}</p>
      ${specRows(z)}
      <form class="rform" id="rform" data-mode="waitlist" novalidate>
        <p class="micro">Liste d'attente</p>
        <div class="field">
          <label for="f-name">Nom &amp; prénom</label>
          <input id="f-name" name="name" type="text" required placeholder="Ex. Camille Meyer" />
          <span class="err" data-for="name"></span>
        </div>
        <div class="field">
          <label for="f-tel">Téléphone</label>
          <input id="f-tel" name="tel" type="tel" required placeholder="06 12 34 56 78" />
          <span class="err" data-for="tel"></span>
        </div>
        <button class="btn btn--ghost btn--full" type="submit">Me prévenir si libération</button>
        <p class="fineprint">Nous vous appelons dès qu'une table équivalente se libère.</p>
      </form>`;
  }

  function tplPending(z, ev) {
    return `
      <p class="statusline statusline--pending"><span></span> Demande envoyée pour le ${ev.short.toLowerCase()}</p>
      <p class="drawer__desc">Votre demande est en attente de confirmation. Nos équipes vous rappellent sous 2 h au numéro transmis.</p>
      ${specRows(z)}
      <button class="btn btn--ghost btn--full" type="button" id="cancel-req">Annuler ma demande</button>
      <p class="fineprint">Annulation sans frais jusqu'à 48 h avant la soirée.</p>`;
  }

  function tplSuccess(z, ev, data) {
    const pack = data.pack === 'sur-place' ? 'Choix sur place' : packById(data.pack).name;
    const ref = 'R1862-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    return `
      <div class="success">
        <span class="success__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        </span>
        <h4>Demande enregistrée</h4>
        <p>Nous vous rappelons sous 2 h pour confirmer. Référence <b>${ref}</b>.</p>
        <dl class="spec spec--recap">
          <div><dt>Table</dt><dd>${z.name}</dd></div>
          <div><dt>Soirée</dt><dd>${ev.short} · ${ev.title}</dd></div>
          <div><dt>Convives</dt><dd>${data.guests} personnes</dd></div>
          <div><dt>Pack</dt><dd>${pack}</dd></div>
          <div><dt>Contact</dt><dd>${data.name} · ${data.tel}</dd></div>
        </dl>
        <button class="btn btn--ghost btn--full" type="button" data-close>Fermer</button>
      </div>`;
  }

  function bindDrawerForm(z, ev) {
    const form = $('#rform');
    const cancel = $('#cancel-req');

    if (cancel) {
      cancel.addEventListener('click', () => {
        state.bookings[ev.id] = pendingFor(ev.id).filter((id) => id !== z.id);
        writeStore();
        toast('Demande annulée pour ' + z.name + '.');
        closeDrawer();
      });
    }
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {};
      $$('.err', form).forEach((n) => (n.textContent = ''));

      const name = form.elements.name.value.trim();
      const tel = form.elements.tel.value.trim();
      let ok = true;

      if (name.length < 2) {
        setErr(form, 'name', 'Indiquez le nom de la réservation.');
        ok = false;
      }
      if (tel.replace(/[^\d+]/g, '').length < 9) {
        setErr(form, 'tel', 'Numéro incomplet — nous devons pouvoir vous rappeler.');
        ok = false;
      }
      if (form.elements.dress && !form.elements.dress.checked) {
        setErr(form, 'dress', 'Merci de valider les conditions d’entrée.');
        ok = false;
      }
      if (!ok) {
        const bad = $('.err:not(:empty)', form);
        if (bad) {
          const input = $('[name="' + bad.dataset.for + '"]', form);
          if (input) input.focus();
        }
        return;
      }

      data.name = name;
      data.tel = tel;

      if (form.dataset.mode === 'waitlist') {
        toast('Vous êtes sur la liste d’attente pour ' + z.name + '.');
        closeDrawer();
        return;
      }

      data.guests = form.elements.guests.value;
      data.pack = form.elements.pack.value;

      const list = pendingFor(ev.id);
      if (list.indexOf(z.id) === -1) list.push(z.id);
      state.bookings[ev.id] = list;
      writeStore();
      paintStatuses();

      $('#drawer-body').innerHTML = tplSuccess(z, ev, data);
      const closeBtn = $('#drawer-body [data-close]');
      if (closeBtn) closeBtn.focus({ preventScroll: true });
      toast(z.name + ' — demande envoyée.');
    });
  }

  function setErr(form, field, msg) {
    const n = $('.err[data-for="' + field + '"]', form);
    if (n) n.textContent = msg;
  }

  /* ---------------------------------------------------------------
     Toast
     --------------------------------------------------------------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 3600);
  }

  /* ---------------------------------------------------------------
     Infobulle du plan
     --------------------------------------------------------------- */
  function initTooltip() {
    const tip = document.createElement('div');
    tip.className = 'fptip';
    tip.hidden = true;
    $('#planbox').appendChild(tip);

    const show = (zoneNode, x, y) => {
      const z = zoneById(zoneNode.dataset.zone);
      const st = statusOf(z.id);
      tip.innerHTML =
        '<b>' + z.name + '</b><span>' + z.capacity[0] + '–' + z.capacity[1] + ' pers. · min. ' + euro(z.min) +
        '</span><em data-status="' + st + '">' +
        (st === 'free' ? 'Libre — cliquez pour réserver' : st === 'pending' ? 'Demande envoyée' : 'Complet') +
        '</em>';
      const box = $('#planbox').getBoundingClientRect();
      tip.hidden = false;
      const w = tip.offsetWidth;
      const h = tip.offsetHeight;
      let left = x - box.left + 14;
      let top = y - box.top - h - 12;
      if (left + w > box.width - 8) left = box.width - w - 8;
      if (top < 8) top = y - box.top + 18;
      tip.style.transform = 'translate(' + Math.max(8, left) + 'px,' + top + 'px)';
    };

    const plan = $('#floorplan');
    plan.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const zoneNode = e.target.closest('.zone');
      if (zoneNode) show(zoneNode, e.clientX, e.clientY);
      else tip.hidden = true;
    });
    plan.addEventListener('pointerleave', () => (tip.hidden = true));
    plan.addEventListener('focusin', (e) => {
      const zoneNode = e.target.closest('.zone');
      if (!zoneNode) return;
      const r = zoneNode.getBoundingClientRect();
      show(zoneNode, r.left + r.width / 2, r.top);
    });
    plan.addEventListener('focusout', () => (tip.hidden = true));
    window.addEventListener('scroll', () => (tip.hidden = true), { passive: true });
  }

  /* ---------------------------------------------------------------
     Programmation & carte
     --------------------------------------------------------------- */
  function renderProg() {
    $('#prog-list').innerHTML = EVENTS.map(
      (e) => `
      <article class="pcard reveal">
        <div class="pcard__date">
          <b>${e.date}</b>
          <span>${e.day}</span>
        </div>
        <div class="pcard__main">
          <span class="tagline">${e.tag}</span>
          <h3>${e.title}</h3>
          <p>${e.line}</p>
        </div>
        <div class="pcard__meta">
          <span class="micro">23h30 — 05h00</span>
          <span class="micro micro--dim" data-free-for="${e.id}">${freeCount(e.id)} tables libres</span>
        </div>
        <div class="pcard__cta">
          <button type="button" class="btn btn--gold btn--sm" data-goto-event="${e.id}">Réserver une table</button>
          <a class="linkish" href="mailto:reservations@reserve1862.fr?subject=Guestlist%20${encodeURIComponent(e.short + ' — ' + e.title)}">Guestlist</a>
        </div>
      </article>`
    ).join('');
  }

  function bindProg() {
    $('#prog-list').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-goto-event]');
      if (!btn) return;
      selectEvent(btn.dataset.gotoEvent);
      document.getElementById('reservations').scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
      toast('Soirée sélectionnée : ' + eventById(btn.dataset.gotoEvent).short);
    });
  }

  function renderPacks() {
    $('#packs-list').innerHTML = PACKS.map(
      (p, i) => `
      <article class="bcard reveal">
        <span class="bcard__idx">${String(i + 1).padStart(2, '0')}</span>
        <span class="tagline">${p.tag}</span>
        <h3>${p.name}</h3>
        <p>${p.detail}</p>
        <div class="bcard__foot">
          <b>${euro(p.price)}</b>
          <a class="linkish" href="#reservations" data-scroll>Ajouter à une table</a>
        </div>
      </article>`
    ).join('');
  }

  /* ---------------------------------------------------------------
     Hero — compte à rebours + ambiances
     --------------------------------------------------------------- */
  function nextEvent() {
    const now = Date.now();
    return EVENTS.find((e) => new Date(e.when).getTime() > now) || EVENTS[0];
  }

  function initCountdown() {
    const ev = nextEvent();
    $('#next-title').textContent = ev.title;
    $('#next-meta').textContent = ev.day + ' ' + ev.date + ' · ouverture 23h30 · ' + ev.line;
    const target = new Date(ev.when).getTime();
    const box = $('#countdown');

    const tick = () => {
      let diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      const s = Math.floor((diff % 6e4) / 1e3);
      const set = (u, v) => {
        const n = $('[data-unit="' + u + '"]', box);
        if (n) n.textContent = String(v).padStart(2, '0');
      };
      set('d', d); set('h', h); set('m', m); set('s', s);
    };
    tick();
    setInterval(tick, 1000);
  }

  function initScenes() {
    const scenes = $$('.scene');
    const dots = $$('.hero__slider button');
    let i = 0;
    let timer;

    const go = (n) => {
      i = (n + scenes.length) % scenes.length;
      scenes.forEach((s, k) => s.classList.toggle('is-active', k === i));
      dots.forEach((d, k) => {
        d.classList.toggle('is-active', k === i);
        d.setAttribute('aria-selected', String(k === i));
      });
    };
    const play = () => {
      if (prefersReduced()) return;
      clearInterval(timer);
      timer = setInterval(() => go(i + 1), 6500);
    };
    dots.forEach((d, k) =>
      d.addEventListener('click', () => {
        go(k);
        play();
      })
    );
    play();
  }

  /* ---------------------------------------------------------------
     Chrome : header, menu, reveal, ancres
     --------------------------------------------------------------- */
  function prefersReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initChrome() {
    const header = $('#header');
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const burger = $('#burger');
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    $$('#nav a').forEach((a) =>
      a.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      })
    );

    // révélation au scroll
    if ('IntersectionObserver' in window && !prefersReduced()) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add('is-in');
              io.unobserve(en.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
      $$('.reveal').forEach((n) => io.observe(n));
    } else {
      $$('.reveal').forEach((n) => n.classList.add('is-in'));
    }

    // section active dans la nav
    if ('IntersectionObserver' in window) {
      const links = $$('#nav a');
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            links.forEach((l) => l.classList.toggle('is-current', l.getAttribute('href') === '#' + en.target.id));
          });
        },
        { rootMargin: '-45% 0px -50% 0px' }
      );
      ['reservations', 'programmation', 'carte', 'infos'].forEach((id) => {
        const n = document.getElementById(id);
        if (n) spy.observe(n);
      });
    }

    $('#year').textContent = new Date().getFullYear();

    $('#legal-link').addEventListener('click', () => {
      const d = $('#mentions');
      d.open = true;
    });

    $('#reset-demo').addEventListener('click', () => {
      state.bookings = {};
      writeStore();
      paintStatuses();
      renderProg();
      $$('.reveal', $('#prog-list')).forEach((n) => n.classList.add('is-in'));
      toast('Démo réinitialisée.');
    });
  }

  function initViewToggle() {
    $$('.viewtoggle button').forEach((b) =>
      b.addEventListener('click', () => {
        state.view = b.dataset.view;
        $$('.viewtoggle button').forEach((o) => o.classList.toggle('is-active', o === b));
        $('#planbox').hidden = state.view !== 'plan';
        $('#tablelist').hidden = state.view !== 'list';
      })
    );
  }

  /* ---------------------------------------------------------------
     Écouteurs globaux du plan / de la liste / du drawer
     --------------------------------------------------------------- */
  function initZoneEvents() {
    const activate = (node) => openDrawer(node.dataset.zone, node);

    $('#floorplan').addEventListener('click', (e) => {
      const node = e.target.closest('.zone');
      if (node) activate(node);
    });
    $('#floorplan').addEventListener('keydown', (e) => {
      const node = e.target.closest('.zone');
      if (!node) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        activate(node);
      }
    });
    $('#tablelist').addEventListener('click', (e) => {
      const node = e.target.closest('.trow');
      if (node) activate(node);
    });

    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) closeDrawer();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!root.hidden) closeDrawer();
        else if (document.body.classList.contains('nav-open')) $('#burger').click();
      }
      if (e.key === 'Tab' && !root.hidden) {
        const f = $$('#drawer button, #drawer input, #drawer select, #drawer textarea, #drawer a[href]').filter(
          (n) => !n.disabled && n.offsetParent !== null
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ---------------------------------------------------------------
     Démarrage
     --------------------------------------------------------------- */
  function init() {
    renderPlan();
    renderList();
    renderDates();
    renderProg();
    bindProg();
    renderPacks();
    initZoneEvents();
    initViewToggle();
    initTooltip();
    initCountdown();
    initScenes();
    initChrome();
    selectEvent(EVENTS[0].id);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

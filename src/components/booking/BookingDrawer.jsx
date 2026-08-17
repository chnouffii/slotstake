import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, Plus, X } from 'lucide-react';
import { packById, zoneById } from '../../data/venue';
import { useVenue, STATUS_LABEL } from '../../state/VenueContext';
import { useLockBody } from '../../hooks/useLockBody';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { euro, ref as makeRef } from '../../lib/format';
import { SPRING, SPRING_SOFT } from '../../lib/motion';
import BottleConsole from './BottleConsole';
import MagneticButton from '../ui/MagneticButton';

const BADGE = {
  free: 'Disponibilité : validée',
  pending: 'Demande : en attente',
  taken: 'Disponibilité : saturée'
};

function Spec({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
      <p className="tag">{label}</p>
      <p className="mt-2 font-mono text-[12px] uppercase leading-snug tracking-[0.08em] text-cream">{value}</p>
    </div>
  );
}

function Field({ label, name, type = 'text', placeholder, inputRef, ...rest }) {
  return (
    <label className="block">
      <span className="tag">{label}</span>
      <input
        ref={inputRef}
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-full border border-white/[0.1] bg-white/[0.03] px-5 py-3.5 font-mono text-[13px] tracking-[0.06em] text-cream outline-none transition-colors duration-500 placeholder:text-smoke/80 focus:border-[rgba(212,175,55,0.6)] focus:bg-white/[0.05]"
        {...rest}
      />
    </label>
  );
}

export default function BookingDrawer() {
  const { openId, closeTable, statusOf, event, book, cancel, setToast, pulse } = useVenue();
  const zone = openId ? zoneById(openId) : null;
  const status = zone ? statusOf(zone.id) : 'free';
  const isMobile = useMediaQuery('(max-width: 639px)');

  const [pack, setPack] = useState(null);
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);
  const panel = useRef(null);
  const firstField = useRef(null);

  useLockBody(Boolean(openId));

  useEffect(() => {
    if (!zone) return undefined;
    setPack(zone.packIds[0]);
    setGuests(zone.capacity[0]);
    setError('');
    setDone(null);
    const t = setTimeout(() => firstField.current?.focus({ preventScroll: true }), 460);
    return () => clearTimeout(t);
  }, [zone]);

  useEffect(() => {
    if (!openId) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeTable();
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll('button, input, a[href]');
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
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openId, closeTable]);

  const submit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.elements.name.value.trim();
    const tel = form.elements.tel.value.trim();

    if (name.length < 2) return setError('Nom requis — minimum 2 caractères');
    if (tel.replace(/[^\d+]/g, '').length < 9) return setError('Numéro incomplet — rappel impossible');
    setError('');

    if (status === 'taken') {
      pulse(`Liste d’attente enregistrée — ${zone.code}`);
      closeTable();
      return;
    }

    book(zone.id);
    pulse();
    setDone({
      ref: makeRef(),
      name,
      tel,
      guests,
      pack: pack === 'sur-place' ? 'Choix sur place' : packById(pack).name
    });
    setToast(`Accès validé — ${zone.code} · ${event.short}`);
  };

  const enter = isMobile ? { y: '100%' } : { x: '110%' };
  const rest = isMobile ? { y: 0 } : { x: 0 };

  return (
    <AnimatePresence>
      {zone && (
        <div className="fixed inset-0 z-[300]" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            onClick={closeTable}
            className="absolute inset-0 bg-[rgba(4,4,5,0.7)] backdrop-blur-xl"
          />

          <motion.aside
            ref={panel}
            initial={enter}
            animate={rest}
            exit={enter}
            transition={SPRING}
            className="absolute inset-x-0 bottom-0 flex max-h-[92svh] flex-col overflow-hidden rounded-t-[36px] border border-[rgba(212,175,55,0.22)] bg-[rgba(14,14,17,0.86)] backdrop-blur-2xl sm:inset-y-4 sm:right-4 sm:left-auto sm:max-h-none sm:w-[min(560px,calc(100vw-2rem))] sm:rounded-[32px]"
            style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.6), inset 0 1px 0 rgba(253,251,247,0.06)' }}
          >
            {/* halos ambrés diffus */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/25 blur-[120px]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-champagne/10 blur-[120px]"
            />
            {/* filigrane géant */}
            <span
              aria-hidden="true"
              className="display pointer-events-none absolute -right-4 top-16 select-none text-[26vw] leading-[0.75] text-white/[0.035] sm:text-[140px]"
            >
              {zone.code.replace(' ', '')}
            </span>

            {/* poignée (mobile) */}
            <span aria-hidden="true" className="mx-auto mt-3 h-1 w-12 shrink-0 rounded-full bg-white/15 sm:hidden" />

            <div className="relative flex items-start justify-between gap-4 px-6 pb-4 pt-6 sm:px-9 sm:pt-9">
              <div className="min-w-0">
                <p className="tag">
                  Table <span className="text-gold">//</span> {zone.code}
                </p>
                <h3 id="drawer-title" className="display mt-3 text-[30px] leading-[0.92] text-cream sm:text-[38px]">
                  {zone.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeTable}
                aria-label="Fermer"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 text-sand transition-colors duration-500 hover:border-[rgba(212,175,55,0.6)] hover:text-cream"
              >
                <X size={15} strokeWidth={1.5} />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-y-auto px-6 pb-10 sm:px-9">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
                    <div className="relative mb-7 grid h-20 w-20 place-items-center rounded-full border border-[rgba(212,175,55,0.6)] text-gold">
                      <Check size={28} strokeWidth={1.5} />
                      <motion.span
                        initial={{ scale: 0.7, opacity: 0.8 }}
                        animate={{ scale: 1.7, opacity: 0 }}
                        transition={{ duration: 1.4, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full border border-gold"
                      />
                    </div>
                    <p className="tag-gold">Accès VIP validé</p>
                    <h4 className="display mt-4 text-[28px] leading-[0.94] text-cream">
                      Votre table
                      <br />
                      est tenue
                    </h4>
                    <dl className="mt-7 grid gap-2">
                      {[
                        ['Référence', done.ref],
                        ['Soirée', `${event.name} · ${event.date}`],
                        ['Table', `${zone.code} — ${zone.area}`],
                        ['Convives', `${done.guests} PAX`],
                        ['Pack', done.pack],
                        ['Contact', `${done.name} · ${done.tel}`]
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="flex items-baseline justify-between gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                        >
                          <dt className="tag">{k}</dt>
                          <dd className={`text-right font-mono text-[12px] tracking-[0.08em] ${k === 'Référence' ? 'text-gold' : 'text-cream'}`}>
                            {v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-6 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-smoke">
                      Rappel sous 2 h pour confirmation. Table tenue jusqu’à 01:00. Démonstration : aucune donnée
                      n’est transmise à un serveur.
                    </p>
                    <div className="mt-8">
                      <MagneticButton variant="outline" size="lg" onClick={closeTable} cursorLabel="Fermer">
                        Retour au plan
                      </MagneticButton>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={SPRING_SOFT}>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`rounded-full border px-4 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.2em] ${
                          status === 'taken'
                            ? 'border-white/15 text-sand'
                            : status === 'pending'
                              ? 'border-white/15 text-cream'
                              : 'border-[rgba(212,175,55,0.55)] text-gold'
                        }`}
                        style={status === 'free' ? { boxShadow: '0 0 22px rgba(212,175,55,0.16)' } : undefined}
                      >
                        {BADGE[status]}
                      </span>
                      <span className="rounded-full border border-white/[0.08] px-4 py-1.5 tag">
                        {event.name} · {event.date}
                      </span>
                    </div>

                    <p className="mt-6 text-[13px] leading-relaxed text-sand">{zone.desc}</p>

                    <div className="mt-7 grid grid-cols-2 gap-2">
                      <Spec label="Capacité" value={`${zone.capacity[0]}–${zone.capacity[1]} PAX`} />
                      <Spec label="Conso. minimum" value={euro(zone.min)} />
                      <Spec label="Emplacement" value={zone.area} />
                      <Spec label="Acoustique" value={zone.acoustics} />
                    </div>

                    <ul className="mt-5 flex flex-wrap gap-2">
                      {zone.includes.map((i) => (
                        <li
                          key={i}
                          className="rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-sand"
                        >
                          {i}
                        </li>
                      ))}
                    </ul>

                    {status === 'pending' ? (
                      <div className="mt-9">
                        <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-sand">
                          Demande déjà envoyée pour cette soirée. Nous vous rappelons sous 2 h.
                        </p>
                        <div className="mt-6">
                          <MagneticButton
                            variant="outline"
                            size="lg"
                            cursorLabel="Annuler"
                            onClick={() => {
                              cancel(zone.id);
                              pulse(`Demande annulée — ${zone.code}`);
                              closeTable();
                            }}
                          >
                            Annuler la demande
                          </MagneticButton>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={submit} noValidate className="mt-9">
                        {status === 'free' && (
                          <>
                            <p className="tag mb-3">Magnum / pack bouteilles</p>
                            <BottleConsole packIds={zone.packIds} value={pack} onChange={setPack} />

                            <div className="mt-7 flex items-end justify-between gap-6">
                              <div>
                                <p className="tag">Convives</p>
                                <div className="mt-2 inline-flex items-center rounded-full border border-white/[0.1] bg-white/[0.02] p-1">
                                  <motion.button
                                    type="button"
                                    aria-label="Retirer un convive"
                                    whileTap={{ scale: 0.9 }}
                                    transition={SPRING}
                                    onClick={() => setGuests((g) => Math.max(zone.capacity[0], g - 1))}
                                    className="grid h-10 w-10 place-items-center rounded-full text-sand transition-colors duration-300 hover:bg-gold/10 hover:text-gold"
                                  >
                                    <Minus size={14} strokeWidth={1.5} />
                                  </motion.button>
                                  <output
                                    aria-live="polite"
                                    className="w-12 text-center font-mono text-[16px] tabular-nums text-cream"
                                  >
                                    {String(guests).padStart(2, '0')}
                                  </output>
                                  <motion.button
                                    type="button"
                                    aria-label="Ajouter un convive"
                                    whileTap={{ scale: 0.9 }}
                                    transition={SPRING}
                                    onClick={() => setGuests((g) => Math.min(zone.capacity[1], g + 1))}
                                    className="grid h-10 w-10 place-items-center rounded-full text-sand transition-colors duration-300 hover:bg-gold/10 hover:text-gold"
                                  >
                                    <Plus size={14} strokeWidth={1.5} />
                                  </motion.button>
                                </div>
                              </div>
                              <p className="pb-3 font-mono text-[9.5px] uppercase tracking-[0.2em] text-smoke">
                                max {zone.capacity[1]} pax
                              </p>
                            </div>
                          </>
                        )}

                        {status === 'taken' && (
                          <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-sand">
                            Table saturée pour cette date. Laissez vos coordonnées : nous appelons dès qu’une table
                            équivalente se libère.
                          </p>
                        )}

                        <div className="mt-7 grid gap-5 sm:grid-cols-2">
                          <Field label="Nom" name="name" placeholder="Camille Meyer" inputRef={firstField} autoComplete="name" />
                          <Field label="Téléphone" name="tel" type="tel" placeholder="06 12 34 56 78" autoComplete="tel" />
                        </div>

                        <AnimatePresence>
                          {error && (
                            <motion.p
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={SPRING}
                              className="mt-5 rounded-full border border-[rgba(212,175,55,0.35)] bg-gold/[0.07] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-gold"
                            >
                              {error}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        <div className="mt-8">
                          <MagneticButton
                            type="submit"
                            variant={status === 'taken' ? 'outline' : 'solid'}
                            size="lg"
                            cursorLabel={status === 'taken' ? 'Liste d’attente' : 'Valider'}
                          >
                            {status === 'taken' ? 'Rejoindre la liste d’attente' : 'Valider l’accès VIP'}
                          </MagneticButton>
                        </div>
                        <p className="mt-4 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.18em] text-smoke">
                          Statut : {STATUS_LABEL[status]} · démonstration — aucune donnée transmise.
                        </p>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

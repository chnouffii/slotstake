import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, Plus, X } from 'lucide-react';
import { packById, zoneById } from '../../data/venue';
import { useVenue, STATUS_LABEL } from '../../state/VenueContext';
import { useLockBody } from '../../hooks/useLockBody';
import { euro, ref as makeRef } from '../../lib/format';
import BottleConsole from './BottleConsole';
import MagneticButton from '../ui/MagneticButton';

const EASE = [0.16, 1, 0.3, 1];

const BADGE = {
  free: 'DISPONIBILITÉ : VALIDÉE',
  pending: 'DEMANDE : EN ATTENTE',
  taken: 'DISPONIBILITÉ : SATURÉE'
};

function SpecCell({ label, value }) {
  return (
    <div className="border-t border-white/10 py-3">
      <p className="tag">{label}</p>
      <p className="mt-2 font-mono text-[12.5px] uppercase tracking-[0.1em] text-chrome">{value}</p>
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
        className="mt-2 w-full border-b border-white/15 bg-transparent pb-2 font-mono text-[13px] tracking-[0.06em] text-chrome outline-none transition-colors placeholder:text-ash/70 focus:border-infra"
        {...rest}
      />
    </label>
  );
}

export default function BookingDrawer() {
  const { openId, closeTable, statusOf, event, book, cancel, setToast, pulse } = useVenue();
  const zone = openId ? zoneById(openId) : null;
  const status = zone ? statusOf(zone.id) : 'free';

  const [pack, setPack] = useState(null);
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);
  const panel = useRef(null);
  const firstField = useRef(null);

  useLockBody(Boolean(openId));

  /* réinitialisation à chaque ouverture */
  useEffect(() => {
    if (!zone) return;
    setPack(zone.packIds[0]);
    setGuests(zone.capacity[0]);
    setError('');
    setDone(null);
    const t = setTimeout(() => firstField.current?.focus({ preventScroll: true }), 420);
    return () => clearTimeout(t);
  }, [zone]);

  /* Échap + piège à focus */
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

    if (name.length < 2) return setError('NOM REQUIS — MINIMUM 2 CARACTÈRES');
    if (tel.replace(/[^\d+]/g, '').length < 9) return setError('NUMÉRO INCOMPLET — RAPPEL IMPOSSIBLE');
    setError('');

    if (status === 'taken') {
      pulse(`LISTE D’ATTENTE ENREGISTRÉE — ${zone.code}`);
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
      pack: pack === 'sur-place' ? 'CHOIX SUR PLACE' : packById(pack).name
    });
    setToast(`ACCÈS VALIDÉ — ${zone.code} · ${event.short}`);
  };

  return (
    <AnimatePresence>
      {zone && (
        <div className="fixed inset-0 z-[300]" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeTable}
            className="absolute inset-0 bg-[rgba(3,3,4,0.72)] backdrop-blur-[3px]"
          />

          <motion.aside
            ref={panel}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.72, ease: EASE }}
            className="absolute right-0 top-0 flex h-full w-full flex-col overflow-hidden border-l border-white/10 bg-[rgba(9,9,11,0.94)] backdrop-blur-2xl sm:w-[min(580px,100%)]"
            style={{ clipPath: 'polygon(0 88px, 88px 0, 100% 0, 100% 100%, 0 100%)' }}
          >
            {/* filigrane géant */}
            <span
              aria-hidden="true"
              className="display pointer-events-none absolute -right-6 top-32 select-none text-[26vw] leading-[0.75] text-white/[0.04] sm:text-[150px]"
            >
              {zone.code.replace(' ', '')}
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-8 left-4 origin-bottom-left -rotate-90 font-mono text-[9px] uppercase tracking-[0.5em] text-white/15"
            >
              RES-1862 / {zone.kind} / {event.date}
            </span>

            <div className="flex items-start justify-between gap-4 px-6 pb-5 pt-24 sm:px-10">
              <div className="min-w-0">
                <p className="tag">
                  TABLE <span className="text-infra">//</span> {zone.code}
                </p>
                <h3 id="drawer-title" className="display mt-3 text-[34px] leading-[0.9] text-chrome sm:text-[42px]">
                  {zone.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeTable}
                aria-label="Fermer"
                className="grid h-10 w-10 shrink-0 place-items-center border border-white/12 text-steel transition-colors hover:border-infra hover:text-chrome"
              >
                <X size={15} strokeWidth={1.5} />
              </button>
            </div>

            <div className="relative flex-1 overflow-y-auto px-6 pb-10 sm:px-10">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <div className="relative mb-7 grid h-16 w-16 place-items-center border border-infra text-infra">
                      <Check size={26} strokeWidth={1.5} />
                      <motion.span
                        initial={{ scale: 0.6, opacity: 0.9 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        transition={{ duration: 1.1, ease: EASE }}
                        className="absolute inset-0 border border-infra"
                      />
                    </div>
                    <p className="tag-red bracket">ACCÈS VIP VALIDÉ</p>
                    <h4 className="display mt-4 text-[30px] leading-[0.92] text-chrome">
                      VOTRE TABLE
                      <br />
                      EST TENUE
                    </h4>
                    <dl className="mt-8">
                      {[
                        ['Référence', done.ref],
                        ['Soirée', `${event.name} · ${event.date}`],
                        ['Table', `${zone.code} — ${zone.area}`],
                        ['Convives', `${done.guests} PAX`],
                        ['Pack', done.pack],
                        ['Contact', `${done.name} · ${done.tel}`]
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-baseline justify-between gap-6 border-t border-white/10 py-3">
                          <dt className="tag">{k}</dt>
                          <dd className={`text-right font-mono text-[12px] tracking-[0.08em] ${k === 'Référence' ? 'text-infra' : 'text-chrome'}`}>{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-6 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-ash">
                      Rappel sous 2 h pour confirmation. Table tenue jusqu’à 01:00. Démonstration : aucune donnée
                      n’est transmise à un serveur.
                    </p>
                    <div className="mt-8">
                      <MagneticButton variant="outline" size="lg" onClick={closeTable} cursorLabel="FERMER">
                        Retour au plan
                      </MagneticButton>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`bracket border px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.22em] ${
                          status === 'taken'
                            ? 'border-white/20 text-steel'
                            : status === 'pending'
                              ? 'border-white/20 text-chrome'
                              : 'border-infra/60 text-infra'
                        }`}
                        style={status === 'free' ? { boxShadow: '0 0 14px rgba(255,30,66,0.18)' } : undefined}
                      >
                        {BADGE[status]}
                      </span>
                      <span className="tag">{event.name} · {event.date}</span>
                    </div>

                    <p className="mt-6 text-[13px] leading-relaxed text-steel">{zone.desc}</p>

                    <div className="mt-8 grid grid-cols-2 gap-x-8">
                      <SpecCell label="Capacité" value={`${zone.capacity[0]}–${zone.capacity[1]} PAX`} />
                      <SpecCell label="Conso. minimum" value={euro(zone.min)} />
                      <SpecCell label="Emplacement" value={zone.area} />
                      <SpecCell label="Acoustique" value={zone.acoustics} />
                    </div>

                    <ul className="mt-6 grid gap-2 border-t border-white/10 pt-5">
                      {zone.includes.map((i) => (
                        <li key={i} className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-steel">
                          <span className="h-px w-4 bg-infra" />
                          {i}
                        </li>
                      ))}
                    </ul>

                    {status === 'pending' ? (
                      <div className="mt-9">
                        <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-steel">
                          Demande déjà envoyée pour cette soirée. Nous vous rappelons sous 2 h.
                        </p>
                        <div className="mt-6">
                          <MagneticButton
                            variant="outline"
                            size="lg"
                            cursorLabel="ANNULER"
                            onClick={() => {
                              cancel(zone.id);
                              pulse(`DEMANDE ANNULÉE — ${zone.code}`);
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
                                <div className="mt-2 inline-flex items-center border border-white/12">
                                  <button
                                    type="button"
                                    aria-label="Retirer un convive"
                                    onClick={() => setGuests((g) => Math.max(zone.capacity[0], g - 1))}
                                    className="grid h-11 w-11 place-items-center text-steel transition-colors hover:bg-infra/10 hover:text-infra"
                                  >
                                    <Minus size={14} strokeWidth={1.5} />
                                  </button>
                                  <span className="w-14 text-center font-mono text-[16px] tabular-nums text-chrome">
                                    {String(guests).padStart(2, '0')}
                                  </span>
                                  <button
                                    type="button"
                                    aria-label="Ajouter un convive"
                                    onClick={() => setGuests((g) => Math.min(zone.capacity[1], g + 1))}
                                    className="grid h-11 w-11 place-items-center text-steel transition-colors hover:bg-infra/10 hover:text-infra"
                                  >
                                    <Plus size={14} strokeWidth={1.5} />
                                  </button>
                                </div>
                              </div>
                              <p className="pb-3 font-mono text-[9.5px] uppercase tracking-[0.2em] text-ash">
                                MAX {zone.capacity[1]} PAX
                              </p>
                            </div>
                          </>
                        )}

                        {status === 'taken' && (
                          <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-steel">
                            Table saturée pour cette date. Laissez vos coordonnées : nous appelons dès qu’une table
                            équivalente se libère.
                          </p>
                        )}

                        <div className="mt-7 grid gap-6 sm:grid-cols-2">
                          <Field label="Nom" name="name" placeholder="CAMILLE MEYER" inputRef={firstField} autoComplete="name" />
                          <Field label="Téléphone" name="tel" type="tel" placeholder="06 12 34 56 78" autoComplete="tel" />
                        </div>

                        {error && (
                          <motion.p
                            initial={{ x: -6 }}
                            animate={{ x: [6, -5, 3, 0] }}
                            transition={{ duration: 0.35 }}
                            className="mt-5 border-l border-infra pl-3 font-mono text-[10px] uppercase tracking-[0.2em] text-infra"
                          >
                            {error}
                          </motion.p>
                        )}

                        <div className="mt-8">
                          <MagneticButton
                            type="submit"
                            variant={status === 'taken' ? 'outline' : 'solid'}
                            size="lg"
                            cursorLabel={status === 'taken' ? 'LISTE D’ATTENTE' : 'VALIDER'}
                          >
                            {status === 'taken' ? 'Rejoindre la liste d’attente' : "Valider l’accès VIP"}
                          </MagneticButton>
                        </div>
                        <p className="mt-4 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.18em] text-ash">
                          Statut actuel : {STATUS_LABEL[status]} · Démonstration — aucune donnée transmise.
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

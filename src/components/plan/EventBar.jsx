import { motion } from 'framer-motion';
import { EVENTS } from '../../data/venue';
import { useVenue } from '../../state/VenueContext';
import { useCursor } from '../../state/CursorContext';
import { SPRING } from '../../lib/motion';

/** Sélecteur de soirée — transition fluide du surlignage entre les dates. */
export default function EventBar() {
  const { eventId, selectEvent, freeCount, pulse } = useVenue();
  const { point, clear } = useCursor();

  return (
    <div
      role="tablist"
      aria-label="Choisir une soirée"
      className="grid grid-cols-2 gap-2 sm:grid-cols-4"
    >
      {EVENTS.map((ev) => {
        const on = ev.id === eventId;
        return (
          <button
            key={ev.id}
            role="tab"
            aria-selected={on}
            onClick={() => {
              if (!on) {
                pulse();
                selectEvent(ev.id);
              }
            }}
            onPointerEnter={() => point(`${ev.name} — ${freeCount(ev.id)} LIBRES`)}
            onPointerLeave={clear}
            className={`group relative overflow-hidden rounded-[28px] border px-5 py-4 text-left transition-colors duration-500 ${on ? 'border-[rgba(212,175,55,0.45)]' : 'border-white/[0.08] hover:border-[rgba(212,175,55,0.25)]'}`}
          >
            {on && (
              <motion.span
                layoutId="event-fill"
                transition={SPRING}
                className="absolute inset-0 rounded-[28px] bg-gold/[0.09]"
                style={{ boxShadow: 'inset 0 0 40px rgba(212,175,55,0.12)' }}
              />
            )}
            <span className="relative flex items-baseline gap-2">
              <span className={`display text-[20px] tracking-[0.04em] ${on ? 'text-cream' : 'text-sand'}`}>{ev.short}</span>
              <span className={`font-mono text-[9px] uppercase tracking-[0.25em] ${on ? 'text-gold' : 'text-smoke'}`}>{ev.day}</span>
            </span>
            <span className="relative mt-1.5 block truncate font-mono text-[9.5px] uppercase tracking-[0.18em] text-smoke">
              {ev.name}
            </span>
            <span className="relative mt-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-sand">
              <span className={on ? 'text-gold' : ''}>{String(freeCount(ev.id)).padStart(2, '0')}</span> libres
            </span>
          </button>
        );
      })}
    </div>
  );
}

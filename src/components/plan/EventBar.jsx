import { motion } from 'framer-motion';
import { EVENTS } from '../../data/venue';
import { useVenue } from '../../state/VenueContext';
import { useCursor } from '../../state/CursorContext';

/** Sélecteur de soirée — transition fluide du surlignage entre les dates. */
export default function EventBar() {
  const { eventId, selectEvent, freeCount, pulse } = useVenue();
  const { point, clear } = useCursor();

  return (
    <div
      role="tablist"
      aria-label="Choisir une soirée"
      className="grid grid-cols-2 border border-white/10 sm:grid-cols-4"
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
            className="group relative overflow-hidden border-white/10 px-4 py-4 text-left [&:not(:nth-child(2n))]:border-r sm:[&:not(:last-child)]:border-r sm:[&:nth-child(2n)]:border-r [&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-b-0"
          >
            {on && (
              <motion.span
                layoutId="event-fill"
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bg-infra/10"
              />
            )}
            {on && (
              <motion.span
                layoutId="event-edge"
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 bottom-0 h-px bg-infra"
                style={{ boxShadow: '0 0 10px rgba(255,30,66,0.7)' }}
              />
            )}
            <span className="relative flex items-baseline gap-2">
              <span className={`display text-[20px] tracking-[0.04em] ${on ? 'text-chrome' : 'text-steel'}`}>{ev.short}</span>
              <span className={`font-mono text-[9px] uppercase tracking-[0.25em] ${on ? 'text-infra' : 'text-ash'}`}>{ev.day}</span>
            </span>
            <span className="relative mt-1.5 block truncate font-mono text-[9.5px] uppercase tracking-[0.18em] text-ash">
              {ev.name}
            </span>
            <span className="relative mt-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-steel">
              <span className={on ? 'text-infra' : ''}>{String(freeCount(ev.id)).padStart(2, '0')}</span> libres
            </span>
          </button>
        );
      })}
    </div>
  );
}

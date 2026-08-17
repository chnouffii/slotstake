import { motion } from 'framer-motion';
import { ZONES } from '../../data/venue';
import { useVenue, STATUS_LABEL } from '../../state/VenueContext';
import { useCursor } from '../../state/CursorContext';

const LEGEND = [
  { label: 'Disponible', className: 'border-infra', glow: true },
  { label: 'Demande envoyée', className: 'border-infra border-dashed' },
  { label: 'Complet · [ TAKEN ]', className: 'border-white/25 opacity-40' }
];

/**
 * Colonne technique du plan : état de la soirée, légende et accès direct
 * aux tables encore libres. Synchronisée avec le survol du blueprint.
 */
export default function PlanConsole() {
  const { event, freeCount, statusOf, hoverId, setHoverId, openTable, pulse } = useVenue();
  const { point, clear } = useCursor();
  const free = ZONES.filter((z) => statusOf(z.id) === 'free');
  const pct = Math.round((free.length / ZONES.length) * 100);

  return (
    <aside className="flex flex-col gap-6 border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
      {/* état de la soirée */}
      <div>
        <p className="tag-red">Session active</p>
        <p className="display mt-3 text-[26px] leading-none text-chrome">{event.name}</p>
        <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-ash">
          {event.day} {event.date} · {event.sub}
        </p>

        <div className="mt-5 h-px w-full bg-white/10">
          <motion.div
            className="h-px bg-infra"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ boxShadow: '0 0 8px rgba(255,30,66,0.8)' }}
          />
        </div>
        <p className="mt-2 flex items-baseline justify-between font-mono text-[9.5px] uppercase tracking-[0.2em] text-ash">
          <span>Occupation</span>
          <span className="text-chrome">{100 - pct}%</span>
        </p>
      </div>

      {/* tables libres */}
      <div className="min-h-0 flex-1">
        <p className="tag">
          Libres <span className="text-infra">{String(free.length).padStart(2, '0')}</span>
        </p>
        <div className="mt-3 grid max-h-56 grid-cols-2 gap-1.5 overflow-y-auto pr-1 lg:max-h-[calc(56svh-320px)]">
          {free.length === 0 && (
            <p className="col-span-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">Salle complète</p>
          )}
          {free.map((z) => (
            <button
              key={z.id}
              type="button"
              onPointerEnter={() => {
                setHoverId(z.id);
                point(`${z.code} — ${STATUS_LABEL.free}`);
              }}
              onPointerLeave={() => {
                setHoverId(null);
                clear();
              }}
              onFocus={() => setHoverId(z.id)}
              onBlur={() => setHoverId(null)}
              onClick={() => {
                pulse();
                openTable(z.id);
              }}
              className={`border px-2.5 py-2 text-left transition-colors duration-300 ${
                hoverId === z.id ? 'border-infra bg-infra/10' : 'border-white/10 hover:border-infra/50'
              }`}
            >
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-chrome">{z.code}</span>
              <span className="mt-0.5 block font-mono text-[8.5px] uppercase tracking-[0.12em] text-ash">
                {z.capacity[0]}–{z.capacity[1]} PAX
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* légende */}
      <div className="border-t border-white/10 pt-5">
        <ul className="grid gap-2.5">
          {LEGEND.map((l) => (
            <li key={l.label} className="flex items-center gap-3">
              <span
                className={`h-3 w-5 shrink-0 border ${l.className}`}
                style={l.glow ? { boxShadow: '0 0 8px rgba(255,30,66,0.5)' } : undefined}
              />
              <span className="tag">{l.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-ash">
          Tab + Entrée : navigation clavier · Échap : fermer
        </p>
      </div>
    </aside>
  );
}

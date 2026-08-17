import { motion } from 'framer-motion';
import { ZONES } from '../../data/venue';
import { useVenue, STATUS_LABEL } from '../../state/VenueContext';
import { useCursor } from '../../state/CursorContext';
import { SPRING_SOFT } from '../../lib/motion';

const LEGEND = [
  { label: 'Disponible', className: 'border-gold', glow: true },
  { label: 'Demande envoyée', className: 'border-gold border-dashed' },
  { label: 'Complet', className: 'border-white/25 opacity-40' }
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
    <aside className="flex flex-col gap-6 rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-6">
      {/* état de la soirée */}
      <div>
        <p className="tag-gold">Session active</p>
        <p className="display mt-3 text-[26px] leading-none text-cream">{event.name}</p>
        <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-smoke">
          {event.day} {event.date} · {event.sub}
        </p>

        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-gold"
            animate={{ width: `${pct}%` }}
            transition={SPRING_SOFT}
            style={{ boxShadow: '0 0 8px rgba(212,175,55,0.8)' }}
          />
        </div>
        <p className="mt-2 flex items-baseline justify-between font-mono text-[9.5px] uppercase tracking-[0.2em] text-smoke">
          <span>Occupation</span>
          <span className="text-cream">{100 - pct}%</span>
        </p>
      </div>

      {/* tables libres */}
      <div className="min-h-0 flex-1">
        <p className="tag">
          Libres <span className="text-gold">{String(free.length).padStart(2, '0')}</span>
        </p>
        <div className="mt-3 grid max-h-56 grid-cols-2 gap-1.5 overflow-y-auto pr-1 lg:max-h-[calc(56svh-320px)]">
          {free.length === 0 && (
            <p className="col-span-2 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">Salle complète</p>
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
              className={`rounded-2xl border px-3.5 py-2.5 text-left transition-colors duration-500 ${
                hoverId === z.id ? 'border-[rgba(212,175,55,0.6)] bg-gold/[0.09]' : 'border-white/[0.08] hover:border-[rgba(212,175,55,0.35)]'
              }`}
            >
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-cream">{z.code}</span>
              <span className="mt-0.5 block font-mono text-[8.5px] uppercase tracking-[0.12em] text-smoke">
                {z.capacity[0]}–{z.capacity[1]} PAX
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* légende */}
      <div className="border-t border-white/[0.06] pt-5">
        <ul className="grid gap-2.5">
          {LEGEND.map((l) => (
            <li key={l.label} className="flex items-center gap-3">
              <span
                className={`h-4 w-7 shrink-0 rounded-full border ${l.className}`}
                style={l.glow ? { boxShadow: '0 0 8px rgba(212,175,55,0.5)' } : undefined}
              />
              <span className="tag">{l.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-smoke">
          Tab + Entrée : navigation clavier · Échap : fermer
        </p>
      </div>
    </aside>
  );
}

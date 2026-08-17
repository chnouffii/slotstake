import { motion } from 'framer-motion';
import { packById } from '../../data/venue';
import { euro, haptic } from '../../lib/format';
import { SPRING } from '../../lib/motion';

/**
 * Sélecteur de bouteilles : capsules horizontales, témoin doré et
 * micro-lueur à l'activation.
 */
export default function BottleConsole({ packIds, value, onChange }) {
  const options = [
    ...packIds.map(packById),
    { id: 'sur-place', name: 'CHOIX SUR PLACE', short: 'SUR PLACE', price: 0, vol: '—' }
  ];

  return (
    <div role="radiogroup" aria-label="Magnum et packs bouteilles" className="grid gap-2">
      {options.map((p) => {
        const on = value === p.id;
        return (
          <motion.button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => {
              haptic(8);
              onChange(p.id);
            }}
            whileTap={{ scale: 0.985 }}
            transition={SPRING}
            className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-colors duration-500 ${
              on
                ? 'border-[rgba(212,175,55,0.6)] bg-gold/[0.09]'
                : 'border-white/[0.08] bg-white/[0.02] hover:border-[rgba(212,175,55,0.3)]'
            }`}
            style={on ? { boxShadow: '0 0 26px rgba(212,175,55,0.16), inset 0 0 22px rgba(212,175,55,0.06)' } : undefined}
          >
            <motion.span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              animate={{
                backgroundColor: on ? 'rgb(212,175,55)' : 'rgba(253,251,247,0.16)',
                scale: on ? 1 : 0.75
              }}
              transition={SPRING}
              style={on ? { boxShadow: '0 0 12px rgba(212,175,55,0.9)' } : undefined}
            />

            <span className="min-w-0 flex-1">
              <span
                className={`block truncate font-mono text-[11px] uppercase tracking-[0.16em] ${
                  on ? 'text-cream' : 'text-sand'
                }`}
              >
                {p.short}
              </span>
              <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-smoke">{p.vol}</span>
            </span>

            <span
              className={`shrink-0 rounded-full px-3 py-1 font-mono text-[10.5px] tabular-nums ${
                on ? 'bg-gold/15 text-champagne' : 'text-smoke'
              }`}
            >
              {p.price ? euro(p.price) : '—'}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

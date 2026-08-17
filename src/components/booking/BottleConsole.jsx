import { motion } from 'framer-motion';
import { packById } from '../../data/venue';
import { euro } from '../../lib/format';
import { haptic } from '../../lib/format';

/**
 * Sélecteur de bouteilles façon tranche de console : témoin LED,
 * libellé, volume, prix et bargraph d'intensité.
 */
export default function BottleConsole({ packIds, value, onChange }) {
  const options = [...packIds.map(packById), { id: 'sur-place', name: 'CHOIX SUR PLACE', short: 'SUR PLACE', price: 0, vol: '—' }];

  return (
    <div role="radiogroup" aria-label="Magnum et packs bouteilles" className="border border-white/10">
      {options.map((p, i) => {
        const on = value === p.id;
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => {
              haptic(8);
              onChange(p.id);
            }}
            className={`group flex w-full items-center gap-4 px-4 py-3 text-left transition-colors duration-300 ${
              i > 0 ? 'border-t border-white/[0.07]' : ''
            } ${on ? 'bg-infra/[0.07]' : 'hover:bg-white/[0.03]'}`}
          >
            {/* LED */}
            <span className="relative grid h-3 w-3 shrink-0 place-items-center border border-white/20">
              <motion.span
                animate={{ opacity: on ? 1 : 0.12, scale: on ? 1 : 0.7 }}
                transition={{ duration: 0.25 }}
                className="h-1.5 w-1.5 bg-infra"
                style={{ boxShadow: on ? '0 0 8px rgba(255,30,66,0.9)' : 'none' }}
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className={`block truncate font-mono text-[11px] uppercase tracking-[0.16em] ${on ? 'text-chrome' : 'text-steel'}`}>
                {p.short}
              </span>
              <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ash">{p.vol}</span>
            </span>

            {/* bargraph */}
            <span className="hidden items-end gap-[2px] sm:flex" aria-hidden="true">
              {[6, 10, 14, 9, 12].map((hgt, k) => (
                <motion.span
                  key={k}
                  animate={{ opacity: on ? 0.35 + k * 0.14 : 0.12, height: hgt }}
                  transition={{ duration: 0.3, delay: k * 0.03 }}
                  className="w-[3px] bg-infra"
                />
              ))}
            </span>

            <span className={`w-20 shrink-0 text-right font-mono text-[11px] tabular-nums ${on ? 'text-infra' : 'text-ash'}`}>
              {p.price ? euro(p.price) : '—'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

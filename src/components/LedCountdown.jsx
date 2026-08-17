import { useCountdown } from '../hooks/useCountdown';
import { pad2 } from '../lib/format';

/** Une cellule d'afficheur : segments éteints en fond, chiffres allumés. */
function Cell({ value, unit }) {
  const shown = pad2(value);
  return (
    <div className="relative border border-white/10 bg-[rgba(10,10,13,0.85)] px-3 py-2.5 sm:px-4 sm:py-3">
      {/* segments éteints */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[26px] font-bold tabular-nums text-white/[0.05] sm:text-[34px]"
      >
        88
      </span>
      <span
        className="relative block text-center font-mono text-[26px] font-bold tabular-nums text-infra sm:text-[34px]"
        style={{ textShadow: '0 0 14px rgba(255,30,66,0.55), 0 0 42px rgba(255,30,66,0.25)' }}
      >
        {shown}
      </span>
      <span className="relative mt-1 block text-center font-mono text-[8px] uppercase tracking-[0.3em] text-ash">{unit}</span>
      {/* ligne de balayage */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-infra/25 animate-scan" />
    </div>
  );
}

export default function LedCountdown({ iso }) {
  const { d, h, m, s } = useCountdown(iso);
  return (
    <div className="flex gap-1.5" role="timer" aria-live="off">
      <Cell value={d} unit="Jours" />
      <Cell value={h} unit="Heur" />
      <Cell value={m} unit="Min" />
      <Cell value={s} unit="Sec" />
    </div>
  );
}

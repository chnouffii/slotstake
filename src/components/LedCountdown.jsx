import { useCountdown } from '../hooks/useCountdown';
import { pad2 } from '../lib/format';

/** Cellule d'afficheur : galet de verre, chiffres champagne, lueur douce. */
function Cell({ value, unit }) {
  return (
    <div className="relative rounded-3xl border border-[rgba(212,175,55,0.2)] bg-white/[0.04] px-4 py-3 backdrop-blur-2xl sm:px-5 sm:py-3.5">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center pb-4 font-mono text-[26px] font-bold tabular-nums text-white/[0.045] sm:text-[32px]"
      >
        88
      </span>
      <span
        className="relative block text-center font-mono text-[26px] font-bold tabular-nums text-champagne sm:text-[32px]"
        style={{ textShadow: '0 0 18px rgba(212,175,55,0.45), 0 0 46px rgba(212,175,55,0.2)' }}
      >
        {pad2(value)}
      </span>
      <span className="relative mt-1 block text-center font-mono text-[8px] uppercase tracking-[0.3em] text-smoke">
        {unit}
      </span>
    </div>
  );
}

export default function LedCountdown({ iso }) {
  const { d, h, m, s } = useCountdown(iso);
  return (
    <div className="flex gap-2" role="timer" aria-live="off">
      <Cell value={d} unit="Jours" />
      <Cell value={h} unit="Heur" />
      <Cell value={m} unit="Min" />
      <Cell value={s} unit="Sec" />
    </div>
  );
}

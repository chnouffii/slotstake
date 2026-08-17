import { useEffect, useState } from 'react';

/** Décompte jusqu'à une date ISO, rafraîchi chaque seconde. */
export function useCountdown(iso) {
  const target = new Date(iso).getTime();
  const compute = () => {
    const diff = Math.max(0, target - Date.now());
    return {
      d: Math.floor(diff / 864e5),
      h: Math.floor((diff % 864e5) / 36e5),
      m: Math.floor((diff % 36e5) / 6e4),
      s: Math.floor((diff % 6e4) / 1e3)
    };
  };
  const [left, setLeft] = useState(compute);
  useEffect(() => {
    const t = setInterval(() => setLeft(compute()), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iso]);
  return left;
}

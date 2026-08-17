import { useCallback, useRef } from 'react';
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Attraction magnétique : l'élément suit légèrement le curseur puis
 * revient à sa place avec une inertie ressort.
 * @param {number} strength part du décalage curseur reportée sur l'élément
 */
export function useMagnetic(strength = 0.28) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 220, damping: 18, mass: 0.35 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const onPointerMove = useCallback(
    (e) => {
      if (reduce || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      x.set((e.clientX - (r.left + r.width / 2)) * strength);
      y.set((e.clientY - (r.top + r.height / 2)) * strength);
    },
    [reduce, strength, x, y]
  );

  const onPointerLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, style: { x: sx, y: sy }, onPointerMove, onPointerLeave };
}

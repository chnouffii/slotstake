import { motion, useReducedMotion } from 'framer-motion';

/**
 * Bandeau cinétique. Le texte est dupliqué à l'identique et translaté de
 * -50 % : la boucle est continue, sans raccord visible.
 * @param {string} text contenu, séparateurs compris
 * @param {number} speed durée d'un cycle, en secondes
 * @param {number} direction 1 = défile vers la gauche, -1 = vers la droite
 */
export default function Marquee({ text, speed = 34, direction = 1, className = '', spanClassName = '' }) {
  const reduce = useReducedMotion();

  return (
    <div className={`relative flex w-full overflow-hidden ${className}`} aria-hidden="true">
      <motion.div
        className="flex shrink-0 will-change-transform"
        animate={reduce ? undefined : { x: direction > 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        <span className={`shrink-0 whitespace-nowrap pr-[0.35em] ${spanClassName}`}>{text}</span>
        <span className={`shrink-0 whitespace-nowrap pr-[0.35em] ${spanClassName}`}>{text}</span>
      </motion.div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useCursor } from '../../state/CursorContext';
import { SPRING_SNAP } from '../../lib/motion';

/**
 * Capsule magnétique : suit doucement le curseur, se pose avec un ressort,
 * et laisse passer un reflet champagne au survol.
 */
export default function MagneticButton({
  children,
  onClick,
  href,
  variant = 'solid', // solid | outline | ghost
  size = 'md', // sm | md | lg
  cursorLabel,
  className = '',
  type = 'button',
  ...rest
}) {
  const magnet = useMagnetic(size === 'lg' ? 0.2 : 0.28);
  const { point, clear } = useCursor();

  const base =
    'group relative inline-flex select-none items-center justify-center overflow-hidden rounded-full font-mono uppercase tracking-[0.22em] transition-colors duration-500';
  const sizes = {
    sm: 'px-6 py-2.5 text-[10px]',
    md: 'px-8 py-3.5 text-[11px]',
    lg: 'w-full px-8 py-5 text-[12px]'
  };
  const variants = {
    solid: 'bg-gold text-[#17140b] hover:bg-champagne',
    outline: 'border border-[rgba(212,175,55,0.28)] text-cream hover:border-[rgba(212,175,55,0.7)]',
    ghost: 'text-sand hover:text-cream'
  };

  const Tag = href ? motion.a : motion.button;

  return (
    <Tag
      ref={magnet.ref}
      href={href}
      type={href ? undefined : type}
      onClick={onClick}
      onPointerMove={magnet.onPointerMove}
      onPointerLeave={() => {
        magnet.onPointerLeave();
        clear();
      }}
      onPointerEnter={() => cursorLabel && point(cursorLabel)}
      style={magnet.style}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING_SNAP}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      <span className="relative z-10 flex items-center gap-3">{children}</span>
      {/* reflet champagne */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full rounded-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full"
        style={{
          background:
            'linear-gradient(100deg, transparent 14%, rgba(253,251,247,0.14) 38%, rgba(243,229,171,0.45) 50%, rgba(253,251,247,0.14) 62%, transparent 86%)'
        }}
      />
    </Tag>
  );
}

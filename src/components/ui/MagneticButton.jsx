import { motion } from 'framer-motion';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useCursor } from '../../state/CursorContext';

/**
 * Bouton à attraction magnétique, balayage chromé au survol et
 * enfoncement au clic. `as` permet de rendre un lien.
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
  const magnet = useMagnetic(size === 'lg' ? 0.22 : 0.3);
  const { point, clear } = useCursor();

  const base =
    'group relative inline-flex select-none items-center justify-center overflow-hidden font-mono uppercase tracking-[0.25em] transition-colors duration-300';
  const sizes = {
    sm: 'px-4 py-2.5 text-[10px]',
    md: 'px-6 py-3.5 text-[11px]',
    lg: 'w-full px-8 py-5 text-[12px]'
  };
  const variants = {
    solid: 'bg-infra text-white',
    outline: 'border border-white/15 text-chrome hover:border-infra',
    ghost: 'text-steel hover:text-chrome'
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
      whileTap={{ scale: 0.97 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      <span className="relative z-10 flex items-center gap-3">{children}</span>
      {/* balayage chromé */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full"
        style={{
          background:
            'linear-gradient(100deg, transparent 12%, rgba(229,231,235,0.16) 38%, rgba(229,231,235,0.55) 50%, rgba(229,231,235,0.16) 62%, transparent 88%)'
        }}
      />
    </Tag>
  );
}

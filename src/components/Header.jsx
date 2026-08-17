import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import MagneticButton from './ui/MagneticButton';
import { SPRING_SOFT } from '../lib/motion';

const LINKS = [
  { href: '#programmation', label: 'Programmation' },
  { href: '#plan', label: 'Plan & Réservation' },
  { href: '#carte', label: 'Carte' },
  { href: '#acces', label: 'Accès' }
];

export default function Header() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-500 ${
        stuck ? 'border-b border-[rgba(212,175,55,0.14)] bg-[rgba(10,10,12,0.7)] backdrop-blur-2xl' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center gap-8 px-5 py-4 md:px-10">
        <a href="#top" className="flex items-baseline gap-3" aria-label="Réserve 1862, accueil">
          <span className="display text-[15px] tracking-[0.2em] text-cream">RÉSERVE</span>
          <span className="font-mono text-[10px] tracking-[0.3em] text-gold">1862</span>
        </a>

        <nav className="ml-auto hidden gap-9 lg:flex" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-sand transition-colors duration-300 hover:text-cream"
            >
              {l.label}
              <span className="absolute inset-x-0 bottom-0 h-px w-0 bg-gold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <MagneticButton href="#plan" size="sm" variant="solid" className="hidden sm:inline-flex" cursorLabel="OUVRIR LE PLAN">
            Réserver
          </MagneticButton>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="grid h-11 w-11 place-items-center rounded-full border border-[rgba(212,175,55,0.25)] text-cream transition-colors duration-500 hover:border-gold lg:hidden"
          >
            {open ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING_SOFT}
            className="overflow-hidden border-t border-white/10 bg-[rgba(6,6,8,0.96)] backdrop-blur-2xl lg:hidden"
            aria-label="Navigation mobile"
          >
            <div className="flex flex-col px-5 py-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="display border-b border-white/[0.06] py-4 text-[22px] tracking-[0.04em] text-cream last:border-b-0"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

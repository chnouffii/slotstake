import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useVenue } from '../state/VenueContext';

/** Flash lumineux bref au clic : retour visuel « haptique ». */
export default function Flash() {
  const { flash } = useVenue();
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!flash) return undefined;
    setOn(true);
    const t = setTimeout(() => setOn(false), 120);
    return () => clearTimeout(t);
  }, [flash]);

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          key={flash}
          aria-hidden="true"
          initial={{ opacity: 0.42 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'linear' }}
          className="pointer-events-none fixed inset-0 z-[480] mix-blend-screen"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(243,229,171,0.35), rgba(212,175,55,0.12) 45%, transparent 72%)' }}
        />
      )}
    </AnimatePresence>
  );
}

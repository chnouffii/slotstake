import { AnimatePresence, motion } from 'framer-motion';
import { useVenue } from '../state/VenueContext';
import { SPRING } from '../lib/motion';

export default function Toast() {
  const { toast } = useVenue();
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[400] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 sm:left-8 sm:translate-x-0">
      <AnimatePresence>
        {toast && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={SPRING}
            className="flex items-center gap-3 rounded-full border border-[rgba(212,175,55,0.28)] bg-[rgba(14,14,17,0.9)] px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cream backdrop-blur-2xl"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" style={{ boxShadow: '0 0 10px var(--color-gold)' }} />
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

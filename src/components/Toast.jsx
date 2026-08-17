import { AnimatePresence, motion } from 'framer-motion';
import { useVenue } from '../state/VenueContext';

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
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pane flex items-center gap-3 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-chrome"
          >
            <span className="h-1.5 w-1.5 shrink-0 bg-infra" style={{ boxShadow: '0 0 10px var(--color-infra)' }} />
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

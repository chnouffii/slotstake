import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Blueprint from './Blueprint';
import EventBar from './EventBar';
import PlanConsole from './PlanConsole';
import { useVenue } from '../../state/VenueContext';
import { ZONES } from '../../data/venue';

export default function PlanSection() {
  const { event, freeCount } = useVenue();
  const free = freeCount();

  return (
    <section id="plan" className="relative scroll-mt-28 border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="tag-gold">02 — Plan &amp; Réservation</p>
            <h2 className="display mt-4 text-[11vw] leading-[0.84] text-cream sm:text-[8vw] lg:text-[5.6vw]">
              LA SALLE
              <br />
              <span className="text-gold">EN COURBES</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-[12.5px] leading-relaxed text-sand">
              Le plan réel de l’établissement, dessiné en courbes. Survolez une table pour l’isoler, cliquez pour
              ouvrir sa fiche et valider votre accès.
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-smoke">
              Disponibilité <span className="text-gold">{String(free).padStart(2, '0')}</span> / {ZONES.length}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <EventBar />
        </div>

        {event.note && (
          <motion.p
            key={event.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 flex items-start gap-3 border-l border-gold/60 pl-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-gold"
          >
            <AlertTriangle size={13} strokeWidth={1.5} className="mt-px shrink-0" />
            {event.note}
          </motion.p>
        )}

        <div className="pebble relative mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 p-3 sm:p-5 lg:grid-cols-[minmax(0,1fr)_290px] lg:gap-8 lg:p-6">
          {/* lueur d'ambiance derrière le plan */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/4 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/[0.14] blur-[120px]"
          />
          <div className="min-w-0">
            <div className="overflow-x-auto overflow-y-hidden">
              <div className="min-w-[620px]" style={{ height: 'clamp(320px, 56svh, 680px)' }}>
                <Blueprint />
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.24em] text-smoke lg:hidden">
              ← faites glisser le plan · ou choisissez ci-dessous →
            </p>
          </div>
          <PlanConsole />
        </div>

      </div>
    </section>
  );
}

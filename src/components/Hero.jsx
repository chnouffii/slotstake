import { motion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import Marquee from './ui/Marquee';
import LedCountdown from './LedCountdown';
import MagneticButton from './ui/MagneticButton';
import { EVENTS } from '../data/venue';
import { useVenue } from '../state/VenueContext';

const KINETIC = 'RÉSERVE 1862 • PRIVATE CLUB • STRASBOURG • ';

const nextEvent = () => EVENTS.find((e) => new Date(e.when).getTime() > Date.now()) || EVENTS[0];

const rise = {
  hidden: { y: '110%' },
  show: (i) => ({ y: '0%', transition: { duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.09 } })
};

export default function Hero() {
  const ev = nextEvent();
  const { freeCount } = useVenue();
  const lines = ['QUINZE', 'TABLES', 'UNE NUIT'];

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-32">
      {/* bandeaux cinétiques en arrière-plan */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-center gap-2 opacity-[0.16]">
        <Marquee
          text={KINETIC.repeat(4)}
          speed={44}
          spanClassName="display text-[12vw] leading-none text-transparent"
        />
        <Marquee
          text={KINETIC.repeat(4)}
          speed={58}
          direction={-1}
          spanClassName="display text-[12vw] leading-none text-chrome/[0.35]"
        />
      </div>
      {/* copie contournée du premier bandeau (texte évidé) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-center gap-2 opacity-[0.22]">
        <Marquee
          text={KINETIC.repeat(4)}
          speed={44}
          spanClassName="display text-[12vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(229,231,235,0.22)]"
        />
      </div>

      {/* nappe rouge diffuse */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(60% 45% at 18% 12%, rgba(255,30,66,0.16), transparent 62%), radial-gradient(50% 40% at 86% 78%, rgba(229,231,235,0.05), transparent 65%), linear-gradient(180deg, rgba(6,6,8,0.5), rgba(6,6,8,0.1) 40%, var(--color-obsidian) 96%)'
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 md:px-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-1.5 w-1.5 bg-infra" style={{ boxShadow: '0 0 12px var(--color-infra)' }} />
          <p className="tag">Club privé · Strasbourg · est. 1862</p>
        </div>

        <h1 className="display text-[16vw] leading-[0.82] text-chrome sm:text-[13vw] lg:text-[10.5vw]">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                custom={i}
                variants={rise}
                initial="hidden"
                animate="show"
                className={`block ${i === 2 ? 'text-infra' : ''}`}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-[1.1fr_auto] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
            className="max-w-xl"
          >
            <p className="text-[13px] leading-relaxed text-steel">
              Quatre carrés VIP face à la cabine, une ligne de banquettes le long du mur, un service au magnum.
              Le plan de la salle est ouvert : choisissez votre table, validez votre accès.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <MagneticButton href="#plan" variant="solid" cursorLabel="OUVRIR LE PLAN">
                Ouvrir le plan <ArrowDownRight size={14} strokeWidth={1.75} />
              </MagneticButton>
              <MagneticButton href="#programmation" variant="outline" cursorLabel="AGENDA">
                Programmation
              </MagneticButton>
              <p className="tag ml-1">
                <span className="text-infra">{freeCount()}</span> / 15 tables libres
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
            className="lg:justify-self-end"
          >
            <div className="mb-3 flex items-baseline gap-4">
              <p className="tag-red">Prochaine ouverture</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-steel">
                {ev.day} {ev.date} — 23:30
              </p>
            </div>
            <LedCountdown iso={ev.when} />
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
              {ev.name} <span className="text-infra">//</span> {ev.sub}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import Marquee from './ui/Marquee';
import LedCountdown from './LedCountdown';
import MagneticButton from './ui/MagneticButton';
import { EVENTS } from '../data/venue';
import { useVenue } from '../state/VenueContext';
import { SPRING_SOFT } from '../lib/motion';

const KINETIC = 'RÉSERVE 1862 • PRIVATE CLUB • STRASBOURG • ';

const nextEvent = () => EVENTS.find((e) => new Date(e.when).getTime() > Date.now()) || EVENTS[0];

const rise = {
  hidden: { y: '110%' },
  show: (i) => ({ y: '0%', transition: { ...SPRING_SOFT, delay: 0.12 + i * 0.1 } })
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
          spanClassName="display text-[12vw] leading-none text-cream/[0.28]"
        />
      </div>
      {/* copie contournée du premier bandeau (texte évidé) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-center gap-2 opacity-[0.22]">
        <Marquee
          text={KINETIC.repeat(4)}
          speed={44}
          spanClassName="display text-[12vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(212,175,55,0.28)]"
        />
      </div>

      {/* halos ambrés très diffus */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <span className="absolute -left-32 top-[6%] h-[520px] w-[520px] rounded-full bg-gold/20 blur-[120px] animate-drift" />
        <span className="absolute -right-24 bottom-[2%] h-[460px] w-[460px] rounded-full bg-champagne/10 blur-[120px]" />
        <span className="absolute left-1/2 top-1/3 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-gold/[0.12] blur-[120px]" />
      </div>

      {/* fondu vers le fond */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,12,0.55), rgba(10,10,12,0.08) 42%, var(--color-carbon) 96%)'
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 md:px-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" style={{ boxShadow: '0 0 14px var(--color-gold)' }} />
          <p className="tag">Club privé · Strasbourg · est. 1862</p>
        </div>

        <h1 className="display text-[16vw] leading-[0.82] text-cream sm:text-[13vw] lg:text-[10.5vw]">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                custom={i}
                variants={rise}
                initial="hidden"
                animate="show"
                className={`block ${i === 2 ? 'text-champagne' : ''}`}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-10 border-t border-[rgba(212,175,55,0.14)] pt-8 lg:grid-cols-[1.1fr_auto] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SOFT, delay: 0.5 }}
            className="max-w-xl"
          >
            <p className="text-[13px] leading-relaxed text-sand">
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
              <p className="tag ml-1 rounded-full border border-white/[0.08] px-5 py-2.5">
                <span className="text-gold">{freeCount()}</span> / 15 tables libres
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SOFT, delay: 0.66 }}
            className="lg:justify-self-end"
          >
            <div className="mb-3 flex items-baseline gap-4">
              <p className="tag-gold">Prochaine ouverture</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-sand">
                {ev.day} {ev.date} — 23:30
              </p>
            </div>
            <LedCountdown iso={ev.when} />
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">
              {ev.name} <span className="text-gold">//</span> {ev.sub}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

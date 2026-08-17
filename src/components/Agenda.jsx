import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Radio } from 'lucide-react';
import { EVENTS } from '../data/venue';
import { useVenue } from '../state/VenueContext';
import { useCursor } from '../state/CursorContext';
import { SPRING_SOFT } from '../lib/motion';

export default function Agenda() {
  const rail = useRef(null);
  const { freeCount, selectEvent, setToast } = useVenue();
  const { point, clear } = useCursor();

  const scroll = (dir) => rail.current?.scrollBy({ left: dir * Math.min(520, rail.current.clientWidth * 0.85), behavior: 'smooth' });

  const choose = (ev) => {
    selectEvent(ev.id);
    document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setToast(`SOIRÉE ${ev.date} — ${freeCount(ev.id)} TABLES DISPONIBLES`);
  };

  return (
    <section id="programmation" className="scroll-mt-28 border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="tag-gold">01 — Programmation</p>
            <h2 className="display mt-4 text-[11vw] leading-[0.84] text-cream sm:text-[8vw] lg:text-[5.6vw]">
              LES NUITS
              <br />
              <span className="text-gold">À VENIR</span>
            </h2>
          </div>
          <div className="flex items-end gap-6">
            <p className="max-w-xs text-[12.5px] leading-relaxed text-sand">
              Mardis Movida, weekends réservés. Guestlist ouverte jusqu’à 20:00 le jour même.
            </p>
            <div className="flex gap-1.5">
              {[[-1, ArrowLeft, 'Soirées précédentes'], [1, ArrowRight, 'Soirées suivantes']].map(([d, Icon, label]) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  onClick={() => scroll(d)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-[rgba(212,175,55,0.25)] text-sand transition-colors duration-500 hover:border-gold hover:text-gold"
                >
                  <Icon size={15} strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={rail}
        className="mt-12 flex snap-x snap-proximity gap-3 overflow-x-auto px-5 pb-4 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {EVENTS.map((ev, i) => (
          <motion.article
            key={ev.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ ...SPRING_SOFT, delay: i * 0.07 }}
            className="pebble group relative flex w-[min(420px,84vw)] shrink-0 snap-start flex-col p-8 transition-colors duration-500 hover:border-[rgba(212,175,55,0.45)]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-full border border-[rgba(212,175,55,0.3)] px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
                {ev.tag}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-smoke">23:30 — 05:00</span>
            </div>

            <p className="mt-8 flex items-baseline gap-3">
              <span className="display text-[54px] leading-none text-cream">{ev.short}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sand">{ev.day}</span>
            </p>

            <h3 className="display mt-5 text-[24px] leading-tight text-cream">{ev.name}</h3>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-gold">{ev.sub}</p>
            <p className="mt-4 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.12em] text-sand">{ev.line}</p>

            <p className="mt-auto flex items-center gap-2.5 pt-8 font-mono text-[9.5px] uppercase tracking-[0.24em] text-smoke">
              <Radio size={12} strokeWidth={1.5} className="text-gold" />
              <span className="text-gold">{String(freeCount(ev.id)).padStart(2, '0')}</span> tables disponibles
            </p>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-5">
              <button
                type="button"
                onClick={() => choose(ev)}
                onPointerEnter={() => point(`OUVRIR LE PLAN — ${ev.date}`)}
                onPointerLeave={clear}
                className="group/btn relative font-mono text-[10px] uppercase tracking-[0.24em] text-cream"
              >
                Choisir une table
                <span className="absolute -bottom-1 left-0 h-px w-full bg-white/15" />
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:w-full" />
              </button>
              <a
                href={`mailto:reservations@reserve1862.fr?subject=Guestlist%20${ev.date}`}
                className="font-mono text-[10px] uppercase tracking-[0.24em] text-smoke transition-colors hover:text-cream"
              >
                Guestlist
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { PACKS } from '../data/venue';
import { euro } from '../lib/format';
import { SPRING_SOFT } from '../lib/motion';

export default function Bottles() {
  return (
    <section id="carte" className="scroll-mt-28 border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="tag-gold">03 — Carte</p>
            <h2 className="display mt-4 text-[11vw] leading-[0.84] text-cream sm:text-[8vw] lg:text-[5.6vw]">
              SERVICE
              <br />
              <span className="text-gold">MAGNUM</span>
            </h2>
          </div>
          <p className="max-w-xs text-[12.5px] leading-relaxed text-sand">
            Sélection courte, sortie de bouteille au cierge, cocktails signature. Carte complète en salle.
          </p>
        </div>

        <div className="mt-12 grid gap-2">
          {PACKS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ ...SPRING_SOFT, delay: i * 0.05 }}
              className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-2 rounded-[28px] border border-white/[0.06] bg-white/[0.02] px-6 py-6 transition-colors duration-500 hover:border-[rgba(212,175,55,0.3)] sm:grid-cols-[auto_minmax(0,22ch)_1fr_auto] sm:gap-x-8 sm:px-8"
            >
              <span className="font-mono text-[10px] tabular-nums tracking-[0.2em] text-smoke">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="display text-[19px] leading-tight text-cream transition-colors duration-500 group-hover:text-gold sm:text-[22px]">
                {p.name}
              </h3>
              <p className="col-span-3 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.12em] text-sand sm:col-span-1 sm:col-start-3">
                {p.detail}
              </p>
              <p className="col-start-3 row-start-1 text-right font-mono text-[13px] tabular-nums text-gold sm:col-start-4">
                {euro(p.price)}
                <span className="ml-3 text-[9px] uppercase tracking-[0.2em] text-smoke">{p.vol}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

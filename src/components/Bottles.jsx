import { motion } from 'framer-motion';
import { PACKS } from '../data/venue';
import { euro } from '../lib/format';

export default function Bottles() {
  return (
    <section id="carte" className="scroll-mt-28 border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="tag-red">03 — Carte</p>
            <h2 className="display mt-4 text-[11vw] leading-[0.84] text-chrome sm:text-[8vw] lg:text-[5.6vw]">
              SERVICE
              <br />
              <span className="text-infra">MAGNUM</span>
            </h2>
          </div>
          <p className="max-w-xs text-[12.5px] leading-relaxed text-steel">
            Sélection courte, sortie de bouteille au cierge, cocktails signature. Carte complète en salle.
          </p>
        </div>

        <div className="mt-12 border-t border-white/10">
          {PACKS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
              className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-2 border-b border-white/10 py-6 transition-colors duration-500 hover:bg-white/[0.02] sm:grid-cols-[auto_minmax(0,22ch)_1fr_auto] sm:gap-x-8"
            >
              <span className="font-mono text-[10px] tabular-nums tracking-[0.2em] text-ash">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="display text-[19px] leading-tight text-chrome transition-colors duration-500 group-hover:text-infra sm:text-[22px]">
                {p.name}
              </h3>
              <p className="col-span-3 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.12em] text-steel sm:col-span-1 sm:col-start-3">
                {p.detail}
              </p>
              <p className="col-start-3 row-start-1 text-right font-mono text-[13px] tabular-nums text-infra sm:col-start-4">
                {euro(p.price)}
                <span className="ml-3 text-[9px] uppercase tracking-[0.2em] text-ash">{p.vol}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

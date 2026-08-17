import { AtSign, Clock, Mail, MapPin, Phone, Shirt } from 'lucide-react';

const BLOCKS = [
  {
    icon: Clock,
    title: 'Horaires',
    lines: ['MARDI 23:30 — 05:00', 'VEN. & SAM. 23:30 — 06:00', 'FERMÉ DIM. & LUNDI']
  },
  {
    icon: Shirt,
    title: 'Dress code',
    lines: ['CHIC, SOIGNÉ, SANS COMPROMIS', 'REFUSÉS : SURVÊTEMENT, SHORT,', 'CASQUETTE, CLAQUETTES']
  },
  {
    icon: MapPin,
    title: 'Accès',
    lines: ['STRASBOURG CENTRE', 'ADRESSE COMMUNIQUÉE', 'À LA CONFIRMATION']
  }
];

const CONTACTS = [
  { icon: Phone, label: '+33 6 00 00 00 00', href: 'tel:+33600000000' },
  { icon: Mail, label: 'reservations@reserve1862.fr', href: 'mailto:reservations@reserve1862.fr' },
  { icon: AtSign, label: '@reserve1862', href: 'https://instagram.com/reserve1862' }
];

export default function Access() {
  return (
    <section id="acces" className="scroll-mt-28 border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="tag-gold">04 — Accès</p>
        <h2 className="display mt-4 text-[11vw] leading-[0.84] text-cream sm:text-[8vw] lg:text-[5.6vw]">
          AVANT
          <br />
          <span className="text-gold">DE VENIR</span>
        </h2>

        <div className="mt-14 grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          {BLOCKS.map((b) => (
            <div key={b.title} className="rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-8">
              <b.icon size={16} strokeWidth={1.4} className="text-gold" />
              <p className="tag mt-5">{b.title}</p>
              <div className="mt-4 space-y-1.5">
                {b.lines.map((l) => (
                  <p key={l} className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-sand">
                    {l}
                  </p>
                ))}
              </div>
            </div>
          ))}
          <div className="rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-8">
            <p className="tag">Contact direct</p>
            <div className="mt-4 space-y-3">
              {CONTACTS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener"
                  className="group flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-sand transition-colors hover:text-cream"
                >
                  <c.icon size={13} strokeWidth={1.4} className="shrink-0 text-smoke transition-colors group-hover:text-gold" />
                  <span className="truncate">{c.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

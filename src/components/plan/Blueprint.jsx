import { AnimatePresence, motion } from 'framer-motion';
import { ROOM, ZONES } from '../../data/venue';
import TableBlock from './TableBlock';
import { useVenue } from '../../state/VenueContext';
import { SPRING_SOFT } from '../../lib/motion';

const LINE = 'rgba(212,175,55,0.26)';
const LINE_SOFT = 'rgba(253,251,247,0.12)';

/** Mobilier fixe : cabine, bar, escalier — capsules adoucies. */
function Fixture({ f }) {
  return (
    <g className="pointer-events-none">
      <rect
        x={f.x}
        y={f.y}
        width={f.w}
        height={f.h}
        rx={f.r}
        ry={f.r}
        fill="rgba(255,255,255,0.025)"
        stroke={LINE_SOFT}
        strokeWidth="1"
      />
      {f.steps &&
        Array.from({ length: f.steps }).map((_, i) => {
          const yy = f.y + ((i + 1) * f.h) / (f.steps + 1);
          return (
            <path
              key={i}
              d={`M${f.x + 16} ${yy} Q${f.x + f.w / 2} ${yy - 9} ${f.x + f.w - 16} ${yy}`}
              fill="none"
              stroke={LINE_SOFT}
              strokeWidth="0.9"
              strokeLinecap="round"
            />
          );
        })}
      <text
        x={f.x + f.w / 2}
        y={f.steps ? f.y - 14 : f.y + f.h / 2 + 3.5}
        textAnchor="middle"
        className="font-mono uppercase"
        style={{ fontSize: 9.5, letterSpacing: '0.3em', fill: 'rgba(163,154,136,0.85)' }}
      >
        {f.label}
      </text>
    </g>
  );
}

export default function Blueprint() {
  const { eventId, hoverId, event } = useVenue();

  return (
    <div className="relative h-full">
      <svg
        viewBox="118 16 1012 880"
        className="block h-full w-full select-none overflow-visible"
        role="group"
        aria-label="Plan du club — sélectionnez une table pour ouvrir sa fiche"
      >
        <defs>
          {/* trame organique : points diffus plutôt qu'une grille */}
          <pattern id="dots" width="46" height="46" patternUnits="userSpaceOnUse">
            <circle cx="23" cy="23" r="1" fill="rgba(253,251,247,0.055)" />
          </pattern>
          <radialGradient id="floorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212,175,55,0.10)" />
            <stop offset="55%" stopColor="rgba(243,229,171,0.035)" />
            <stop offset="100%" stopColor="rgba(212,175,55,0)" />
          </radialGradient>
          <radialGradient id="halo-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212,175,55,0.34)" />
            <stop offset="45%" stopColor="rgba(243,229,171,0.10)" />
            <stop offset="100%" stopColor="rgba(212,175,55,0)" />
          </radialGradient>
          <radialGradient id="halo-mute" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(253,251,247,0.10)" />
            <stop offset="100%" stopColor="rgba(253,251,247,0)" />
          </radialGradient>
        </defs>

        <rect x="100" y="0" width="1100" height="900" fill="url(#dots)" />

        {/* enveloppe galbée */}
        <path d={ROOM.walls} fill="rgba(255,255,255,0.022)" stroke={LINE} strokeWidth="1.4" />

        {/* piste : nappe lumineuse + anneaux souples */}
        <circle cx={ROOM.dancefloor.cx} cy={ROOM.dancefloor.cy} r={ROOM.dancefloor.r * 1.5} fill="url(#floorGlow)" />
        {[1, 0.64, 0.3].map((k) => (
          <circle
            key={k}
            cx={ROOM.dancefloor.cx}
            cy={ROOM.dancefloor.cy}
            r={ROOM.dancefloor.r * k}
            fill="none"
            stroke={k === 1 ? 'rgba(212,175,55,0.28)' : 'rgba(253,251,247,0.09)'}
            strokeWidth="0.9"
            strokeDasharray={k === 1 ? '1 14' : '1 18'}
            strokeLinecap="round"
          />
        ))}
        <text
          x={ROOM.dancefloor.cx}
          y={ROOM.dancefloor.cy + 4}
          textAnchor="middle"
          className="pointer-events-none font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: '0.45em', fill: 'rgba(163,154,136,0.7)' }}
        >
          Dancefloor
        </text>

        {/* rail mange-debout, en capsule */}
        <rect
          x={ROOM.rail.x}
          y={ROOM.rail.y}
          width={ROOM.rail.w}
          height={ROOM.rail.h}
          rx={ROOM.rail.r}
          fill="rgba(255,255,255,0.03)"
          stroke={LINE_SOFT}
          strokeWidth="0.8"
        />

        {ROOM.fixtures.map((f) => (
          <Fixture key={f.id} f={f} />
        ))}

        {ROOM.zonesTags.map((t) => (
          <text
            key={t.label}
            x={t.x}
            y={t.y}
            textAnchor={t.anchor || 'start'}
            className="pointer-events-none font-mono uppercase"
            style={{ fontSize: 8.5, letterSpacing: '0.32em', fill: 'rgba(212,175,55,0.5)' }}
          >
            {t.label}
          </text>
        ))}

        {ZONES.map((z, i) => (
          <TableBlock key={z.id} zone={z} index={i} />
        ))}
      </svg>

      {/* voile chaud lors d'un changement de soirée */}
      <AnimatePresence mode="wait">
        <motion.div
          key={eventId}
          initial={{ opacity: 0.55, scale: 0.94 }}
          animate={{ opacity: 0, scale: 1.04 }}
          transition={SPRING_SOFT}
          className="pointer-events-none absolute inset-0 rounded-[28px]"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.16), transparent 68%)' }}
        />
      </AnimatePresence>

      <p className="sr-only" aria-live="polite">
        {event.name} — {hoverId ? `table ${hoverId} survolée` : 'aucune table survolée'}
      </p>
    </div>
  );
}

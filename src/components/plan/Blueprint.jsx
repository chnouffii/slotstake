import { AnimatePresence, motion } from 'framer-motion';
import { ROOM, ZONES } from '../../data/venue';
import TableBlock from './TableBlock';
import { useVenue } from '../../state/VenueContext';

const LINE = 'rgba(229,231,235,0.30)';
const LINE_SOFT = 'rgba(229,231,235,0.16)';

/** Cotation : trait, embouts et valeur. */
function Dim({ from, to, label, vertical }) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const tick = 5;
  return (
    <g className="pointer-events-none" stroke={LINE_SOFT} fill="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      {vertical ? (
        <>
          <line x1={x1 - tick} y1={y1} x2={x1 + tick} y2={y1} />
          <line x1={x2 - tick} y1={y2} x2={x2 + tick} y2={y2} />
        </>
      ) : (
        <>
          <line x1={x1} y1={y1 - tick} x2={x1} y2={y1 + tick} />
          <line x1={x2} y1={y2 - tick} x2={x2} y2={y2 + tick} />
        </>
      )}
      <text
        x={vertical ? mx + 12 : mx}
        y={vertical ? my : my - 8}
        textAnchor={vertical ? 'start' : 'middle'}
        stroke="none"
        className="font-mono"
        style={{ fontSize: 8.5, letterSpacing: '0.18em', fill: 'rgba(131,133,141,0.75)' }}
        transform={vertical ? `rotate(90 ${mx + 12} ${my})` : undefined}
      >
        {label}
      </text>
    </g>
  );
}

/** Élément fixe : cabine DJ, bar, escalier. */
function Fixture({ f }) {
  return (
    <g className="pointer-events-none">
      <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="rgba(12,12,15,0.6)" stroke={LINE} strokeWidth="0.9" />
      {f.steps &&
        Array.from({ length: f.steps }).map((_, i) => (
          <line
            key={i}
            x1={f.x}
            y1={f.y + ((i + 1) * f.h) / (f.steps + 1)}
            x2={f.x + f.w}
            y2={f.y + ((i + 1) * f.h) / (f.steps + 1)}
            stroke={LINE_SOFT}
            strokeWidth="0.8"
          />
        ))}
      <text
        x={f.x + f.w / 2}
        y={f.steps ? f.y - 9 : f.y + f.h / 2 + 3.5}
        textAnchor="middle"
        className="font-mono uppercase"
        style={{ fontSize: 9.5, letterSpacing: '0.26em', fill: 'rgba(131,133,141,0.85)' }}
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
          <pattern id="bpGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="rgba(229,231,235,0.055)" strokeWidth="0.6" />
          </pattern>
          <radialGradient id="bpFloor" cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="rgba(255,30,66,0.055)" />
            <stop offset="70%" stopColor="rgba(255,30,66,0.012)" />
            <stop offset="100%" stopColor="rgba(255,30,66,0)" />
          </radialGradient>
        </defs>

        {/* trame */}
        <rect x="100" y="0" width="1100" height="900" fill="url(#bpGrid)" />

        {/* enveloppe */}
        <path d={ROOM.walls} fill="rgba(10,10,13,0.55)" stroke={LINE} strokeWidth="1.5" />
        <path d={ROOM.ties} stroke={LINE} strokeWidth="1.2" fill="none" />

        {/* piste */}
        <circle cx={ROOM.dancefloor.cx} cy={ROOM.dancefloor.cy} r={ROOM.dancefloor.r * 1.2} fill="url(#bpFloor)" />
        {[1, 0.66, 0.32].map((k) => (
          <circle
            key={k}
            cx={ROOM.dancefloor.cx}
            cy={ROOM.dancefloor.cy}
            r={ROOM.dancefloor.r * k}
            fill="none"
            stroke={k === 1 ? 'rgba(255,30,66,0.22)' : LINE_SOFT}
            strokeWidth="0.8"
            strokeDasharray={k === 1 ? '2 10' : '1 14'}
          />
        ))}
        <text
          x={ROOM.dancefloor.cx}
          y={ROOM.dancefloor.cy + 4}
          textAnchor="middle"
          className="pointer-events-none font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: '0.42em', fill: 'rgba(131,133,141,0.7)' }}
        >
          Dancefloor
        </text>

        {/* rail mange-debout */}
        <rect
          x={ROOM.rail.x}
          y={ROOM.rail.y}
          width={ROOM.rail.w}
          height={ROOM.rail.h}
          fill="rgba(15,15,18,0.7)"
          stroke={LINE_SOFT}
          strokeWidth="0.8"
        />

        {ROOM.fixtures.map((f) => (
          <Fixture key={f.id} f={f} />
        ))}

        {/* annotations */}
        {ROOM.dims.map((d) => (
          <Dim key={d.label} {...d} />
        ))}
        {ROOM.zonesTags.map((t) => (
          <text
            key={t.label}
            x={t.x}
            y={t.y}
            textAnchor={t.anchor || 'start'}
            className="pointer-events-none font-mono uppercase"
            style={{ fontSize: 8.5, letterSpacing: '0.24em', fill: 'rgba(255,30,66,0.5)' }}
          >
            {t.label}
          </text>
        ))}
        <text
          x="140"
          y="874"
          className="pointer-events-none font-mono uppercase"
          style={{ fontSize: 8.5, letterSpacing: '0.24em', fill: 'rgba(131,133,141,0.5)' }}
        >
          RES-1862 / PLAN-01 / REV.B — REZ-DE-CHAUSSÉE
        </text>
        <g className="pointer-events-none" stroke={LINE_SOFT} fill="none">
          <path d="M1040 858 v-26 M1030 842 l10 -10 l10 10" />
          <text
            x="1040"
            y="878"
            textAnchor="middle"
            stroke="none"
            className="font-mono"
            style={{ fontSize: 9, letterSpacing: '0.2em', fill: 'rgba(131,133,141,0.5)' }}
          >
            N
          </text>
        </g>

        {/* tables */}
        {ZONES.map((z, i) => (
          <TableBlock key={z.id} zone={z} index={i} />
        ))}
      </svg>

      {/* balayage lors d'un changement de soirée */}
      <AnimatePresence mode="wait">
        <motion.div
          key={eventId}
          initial={{ scaleX: 0, opacity: 0.9 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-y-0 left-0 w-full origin-left"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,30,66,0.10), transparent)' }}
        />
      </AnimatePresence>

      {/* lecture d'état, en direct, pour les lecteurs d'écran */}
      <p className="sr-only" aria-live="polite">
        {event.name} — {hoverId ? `table ${hoverId} survolée` : 'aucune table survolée'}
      </p>
    </div>
  );
}

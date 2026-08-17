import { motion } from 'framer-motion';
import { useVenue, STATUS_LABEL } from '../../state/VenueContext';
import { useCursor } from '../../state/CursorContext';
import { euro } from '../../lib/format';

const EASE = [0.16, 1, 0.3, 1];

/** Équerres de visée aux quatre angles, façon réticule technique. */
function Reticle({ x, y, w, h }) {
  const a = 9;
  const corners = [
    `M${x} ${y + a} V${y} H${x + a}`,
    `M${x + w - a} ${y} H${x + w} V${y + a}`,
    `M${x + w} ${y + h - a} V${y + h} H${x + w - a}`,
    `M${x + a} ${y + h} H${x} V${y + h - a}`
  ];
  return (
    <g className="pointer-events-none">
      {corners.map((d) => (
        <path key={d} d={d} fill="none" stroke="var(--color-infra)" strokeWidth="1.6" />
      ))}
    </g>
  );
}

export default function TableBlock({ zone, index }) {
  const { statusOf, hoverId, setHoverId, openTable, openId, pulse } = useVenue();
  const { point, clear } = useCursor();
  const { x, y, w, h } = zone.plan;

  const status = statusOf(zone.id);
  const taken = status === 'taken';
  const pending = status === 'pending';
  const hot = hoverId === zone.id;
  const active = openId === zone.id;
  const dim = Boolean(hoverId) && !hot;
  const small = Math.min(w, h) < 70;

  const enter = () => {
    setHoverId(zone.id);
    point(`${zone.code} — ${STATUS_LABEL[status]}`, taken ? 'taken' : 'default');
  };
  const leave = () => {
    setHoverId(null);
    clear();
  };
  const open = () => {
    pulse();
    openTable(zone.id);
  };

  const edge = taken ? 'rgba(229,231,235,0.4)' : active || hot ? 'var(--color-infra)' : 'rgba(229,231,235,0.72)';

  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-label={`${zone.name}, ${zone.capacity[0]} à ${zone.capacity[1]} personnes, ${STATUS_LABEL[status].toLowerCase()}`}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onFocus={enter}
      onBlur={leave}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      className="cursor-pointer focus:outline-none"
      animate={{ opacity: dim ? 0.14 : taken ? 0.3 : 1 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <motion.g
        animate={{ scale: hot || active ? 1.055 : 1 }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{ transformBox: 'view-box', transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}
      >
        {/* respiration lumineuse rouge — tables libres uniquement */}
        {!taken && (
          <motion.rect
            x={x - 3}
            y={y - 3}
            width={w + 6}
            height={h + 6}
            fill="none"
            stroke="var(--color-infra)"
            strokeWidth="1"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: hot || active ? 0.9 : [0.26, 0.78, 0.26] }}
            transition={
              hot || active
                ? { duration: 0.3 }
                : { duration: 3.1, repeat: Infinity, ease: 'easeInOut', delay: index * 0.14 }
            }
            style={{ filter: 'drop-shadow(0 0 7px rgba(255,30,66,0.55))' }}
          />
        )}

        {/* bloc de verre fumé */}
        <rect x={x} y={y} width={w} height={h} fill="rgba(15,15,18,0.82)" />
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={hot || active ? 'rgba(255,30,66,0.10)' : 'transparent'}
          stroke={edge}
          strokeWidth={hot || active ? 1.4 : 0.9}
          style={{ transition: 'fill .3s linear' }}
        />
        {/* reflet chrome sur l'arête haute */}
        <line x1={x} y1={y + 0.5} x2={x + w} y2={y + 0.5} stroke="rgba(229,231,235,0.5)" strokeWidth="0.7" />

        {(hot || active) && <Reticle x={x - 3} y={y - 3} w={w + 6} h={h + 6} />}
      </motion.g>

      <text
        x={x + 8}
        y={y + 17}
        className="pointer-events-none font-mono uppercase"
        style={{ fontSize: small ? 9 : 10.5, letterSpacing: '0.16em', fill: taken ? 'rgba(229,231,235,0.6)' : 'var(--color-chrome)' }}
      >
        {zone.code}
      </text>

      {taken ? (
        <text
          x={x + w / 2}
          y={y + h / 2 + 4}
          textAnchor="middle"
          className="pointer-events-none font-mono uppercase"
          style={{ fontSize: small ? 8 : 9.5, letterSpacing: '0.18em', fill: 'rgba(229,231,235,0.68)' }}
        >
          [ TAKEN ]
        </text>
      ) : (
        !small && (
          <text
            x={x + 8}
            y={y + h - 9}
            className="pointer-events-none font-mono"
            style={{ fontSize: 8.5, letterSpacing: '0.1em', fill: pending ? 'var(--color-infra)' : 'rgba(131,133,141,0.9)' }}
          >
            {pending ? 'DEMANDE ENVOYÉE' : `${zone.capacity[0]}–${zone.capacity[1]} PAX · ${euro(zone.min)}`}
          </text>
        )
      )}

      {pending && small && (
        <circle cx={x + w - 9} cy={y + 9} r="3" fill="var(--color-infra)" style={{ filter: 'drop-shadow(0 0 5px rgba(255,30,66,0.8))' }} />
      )}
    </motion.g>
  );
}

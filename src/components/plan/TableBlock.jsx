import { motion } from 'framer-motion';
import { useVenue, STATUS_LABEL } from '../../state/VenueContext';
import { useCursor } from '../../state/CursorContext';
import { euro } from '../../lib/format';
import { SPRING, SPRING_SOFT } from '../../lib/motion';

/** Silhouette d'une table : ovale ou capsule galbée. */
function Shape({ oval, x, y, w, h, r, cx, cy, inset = 0, ...rest }) {
  return oval ? (
    <ellipse cx={cx} cy={cy} rx={w / 2 + inset} ry={h / 2 + inset} {...rest} />
  ) : (
    <rect
      x={x - inset}
      y={y - inset}
      width={w + inset * 2}
      height={h + inset * 2}
      rx={r + inset}
      ry={r + inset}
      {...rest}
    />
  );
}

/**
 * Une table de la cartographie : capsule galbée (carrés, banquettes) ou
 * ovale (tables hautes, lounge). Aucune arête vive.
 */
export default function TableBlock({ zone, index }) {
  const { statusOf, hoverId, setHoverId, openTable, openId, pulse } = useVenue();
  const { point, clear } = useCursor();
  const { x, y, w, h, shape, r = 30 } = zone.plan;

  const status = statusOf(zone.id);
  const taken = status === 'taken';
  const pending = status === 'pending';
  const hot = hoverId === zone.id;
  const active = openId === zone.id;
  const dim = Boolean(hoverId) && !hot;
  const oval = shape === 'oval';
  const cx = x + w / 2;
  const cy = y + h / 2;
  const small = Math.min(w, h) < 70;

  const enter = () => {
    setHoverId(zone.id);
    point(`${zone.code} · ${STATUS_LABEL[status]}`, taken ? 'taken' : 'default');
  };
  const leave = () => {
    setHoverId(null);
    clear();
  };
  const open = () => {
    pulse();
    openTable(zone.id);
  };

  const edge = taken
    ? 'rgba(253,251,247,0.24)'
    : hot || active
      ? 'var(--color-gold)'
      : 'rgba(212,175,55,0.5)';

  const geo = { oval, x, y, w, h, r, cx, cy };

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
      animate={{ opacity: dim ? 0.22 : taken ? 0.34 : 1 }}
      transition={SPRING_SOFT}
    >
      {/* halo ambré qui s'étend au survol */}
      <motion.ellipse
        cx={cx}
        cy={cy}
        rx={Math.max(w, h) * 1.3}
        ry={Math.max(w, h) * 1.3}
        fill={`url(#halo-${taken ? 'mute' : 'gold'})`}
        className="pointer-events-none"
        initial={false}
        animate={{ opacity: hot || active ? 1 : 0, scale: hot || active ? 1 : 0.5 }}
        transition={SPRING_SOFT}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />

      <motion.g
        animate={{ scale: hot || active ? 1.06 : 1 }}
        transition={SPRING}
        style={{ transformBox: 'view-box', transformOrigin: `${cx}px ${cy}px` }}
      >
        {/* respiration dorée — tables libres */}
        {!taken && (
          <motion.g
            initial={false}
            animate={{ opacity: hot || active ? 0.9 : [0.2, 0.62, 0.2] }}
            transition={
              hot || active
                ? SPRING
                : { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.16 }
            }
          >
            <Shape
              {...geo}
              inset={5}
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth="1"
              style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.5))' }}
            />
          </motion.g>
        )}

        {/* galet de verre fumé */}
        <Shape {...geo} fill="rgba(20,18,14,0.72)" />
        <Shape
          {...geo}
          fill={hot || active ? 'rgba(212,175,55,0.12)' : 'transparent'}
          stroke={edge}
          strokeWidth={hot || active ? 1.5 : 1}
          style={{ transition: 'fill .35s ease' }}
        />
        {/* reflet chaud sur la courbe haute */}
        {!taken && (
          <path
            d={
              oval
                ? `M${cx - w / 2 + 6} ${cy - 4} Q${cx} ${cy - h / 2 - 3} ${cx + w / 2 - 6} ${cy - 4}`
                : `M${x + r * 0.55} ${y + 1.5} Q${cx} ${y - 2} ${x + w - r * 0.55} ${y + 1.5}`
            }
            fill="none"
            stroke="rgba(253,251,247,0.4)"
            strokeWidth="0.8"
            strokeLinecap="round"
            className="pointer-events-none"
          />
        )}
      </motion.g>

      <text
        x={cx}
        y={oval ? cy + 3.5 : y + (small ? h / 2 + 3.5 : 24)}
        textAnchor="middle"
        className="pointer-events-none font-mono uppercase"
        style={{
          fontSize: small ? 9 : 10.5,
          letterSpacing: '0.16em',
          fill: taken ? 'rgba(253,251,247,0.45)' : 'var(--color-cream)'
        }}
      >
        {zone.code}
      </text>

      {taken
        ? !oval && (
            <text
              x={cx}
              y={y + h - 22}
              textAnchor="middle"
              className="pointer-events-none font-mono uppercase"
              style={{ fontSize: 8.5, letterSpacing: '0.2em', fill: 'rgba(253,251,247,0.4)' }}
            >
              complet
            </text>
          )
        : !small &&
          !oval && (
            <text
              x={cx}
              y={y + h - 20}
              textAnchor="middle"
              className="pointer-events-none font-mono"
              style={{
                fontSize: 8.5,
                letterSpacing: '0.1em',
                fill: pending ? 'var(--color-gold)' : 'rgba(163,154,136,0.9)'
              }}
            >
              {pending ? 'DEMANDE ENVOYÉE' : `${zone.capacity[0]}–${zone.capacity[1]} PAX · ${euro(zone.min)}`}
            </text>
          )}

      {/* pastille d'état pour les formes compactes */}
      {(pending || (taken && oval)) && (
        <circle
          cx={cx + (oval ? w / 2 - 5 : w / 2 - 14)}
          cy={cy - (oval ? h / 2 - 5 : h / 2 - 14)}
          r="3.2"
          fill={pending ? 'var(--color-gold)' : 'rgba(253,251,247,0.35)'}
          style={pending ? { filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.85))' } : undefined}
        />
      )}
    </motion.g>
  );
}

import { useEffect, useRef } from 'react';
import { useCursor } from '../state/CursorContext';
import { useFinePointer } from '../hooks/useFinePointer';

/**
 * Halo volumétrique + anneau de curseur + étiquette contextuelle.
 * La position est appliquée directement au DOM (hors React) pour éviter
 * un rendu par mouvement de souris.
 */
export default function CursorLayer() {
  const { cursor } = useCursor();
  const fine = useFinePointer();
  const glow = useRef(null);
  const ring = useRef(null);
  const chip = useRef(null);

  useEffect(() => {
    if (!fine) return undefined;
    document.body.classList.add('has-cursor');

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let gx = tx, gy = ty, rx = tx, ry = ty;
    let raf = 0;

    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      gx += (tx - gx) * 0.06;
      gy += (ty - gy) * 0.06;
      rx += (tx - rx) * 0.22;
      ry += (ty - ry) * 0.22;
      if (glow.current) glow.current.style.transform = `translate3d(${gx - 340}px, ${gy - 340}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 16}px, ${ry - 16}px, 0)`;
      if (chip.current) chip.current.style.transform = `translate3d(${rx + 26}px, ${ry + 20}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-cursor');
    };
  }, [fine]);

  if (!fine) return null;

  const active = Boolean(cursor.label);
  const taken = cursor.variant === 'taken';

  return (
    <>
      <div
        ref={glow}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[5] h-[680px] w-[680px] rounded-full mix-blend-screen transition-opacity duration-700 will-change-transform"
        style={{
          opacity: active ? 1 : 0.78,
          background: taken
            ? 'radial-gradient(circle, rgba(150,150,160,0.13), rgba(120,120,130,0.04) 34%, transparent 66%)'
            : 'radial-gradient(circle, rgba(255,30,66,0.15), rgba(229,231,235,0.045) 32%, transparent 66%)'
        }}
      />
      <div
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[520] h-8 w-8 will-change-transform"
      >
        <div
          className="h-full w-full border transition-all duration-300"
          style={{
            borderColor: taken ? 'rgba(229,231,235,0.35)' : 'var(--color-infra)',
            transform: active ? 'scale(1.5) rotate(45deg)' : 'scale(0.42)',
            boxShadow: active && !taken ? '0 0 18px rgba(255,30,66,0.45)' : 'none'
          }}
        />
      </div>
      <div
        ref={chip}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[520] will-change-transform"
      >
        <div
          className="border border-white/15 bg-[rgba(8,8,10,0.92)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] whitespace-nowrap backdrop-blur-md transition-opacity duration-200"
          style={{ opacity: active ? 1 : 0, color: taken ? 'var(--color-steel)' : 'var(--color-infra)' }}
        >
          {cursor.label}
        </div>
      </div>
    </>
  );
}

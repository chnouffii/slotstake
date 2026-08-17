import { useEffect } from 'react';

/** Bloque le défilement de la page tant que la condition est vraie. */
export function useLockBody(locked) {
  useEffect(() => {
    document.body.classList.toggle('is-locked', locked);
    return () => document.body.classList.remove('is-locked');
  }, [locked]);
}

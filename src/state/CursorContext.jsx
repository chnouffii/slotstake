import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Curseur personnalisé : les composants déclarent ce que le curseur doit
 * afficher (libellé + variante) ; <CursorLayer> gère la position en dehors
 * du cycle de rendu React pour rester fluide.
 */
const CursorContext = createContext(null);

export function CursorProvider({ children }) {
  const [cursor, setCursor] = useState({ label: null, variant: 'default' });

  const point = useCallback((label, variant = 'default') => setCursor({ label, variant }), []);
  const clear = useCallback(() => setCursor({ label: null, variant: 'default' }), []);

  const value = useMemo(() => ({ cursor, point, clear }), [cursor, point, clear]);
  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error('useCursor doit être utilisé dans <CursorProvider>');
  return ctx;
}

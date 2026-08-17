import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EVENTS, ZONES, eventById } from '../data/venue';
import { haptic } from '../lib/format';

const STORE = 'r1862.access.v3';
const VenueContext = createContext(null);

const readStore = () => {
  try {
    return JSON.parse(localStorage.getItem(STORE)) || {};
  } catch {
    return {};
  }
};

export function VenueProvider({ children }) {
  const [eventId, setEventId] = useState(EVENTS[0].id);
  const [bookings, setBookings] = useState(readStore);
  const [openId, setOpenId] = useState(null); // table dont le drawer est ouvert
  const [hoverId, setHoverId] = useState(null); // table survolée dans le plan
  const [toast, setToast] = useState(null);
  const [flash, setFlash] = useState(0); // compteur → déclenche le flash lumineux

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(bookings));
    } catch {
      /* navigation privée : la démo reste en mémoire */
    }
  }, [bookings]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  const pendingFor = useCallback((id) => bookings[id] || [], [bookings]);

  const statusOf = useCallback(
    (zoneId, evId = eventId) => {
      const ev = eventById(evId);
      if (ev.reserved.includes(zoneId)) return 'taken';
      if ((bookings[evId] || []).includes(zoneId)) return 'pending';
      return 'free';
    },
    [bookings, eventId]
  );

  const freeCount = useCallback(
    (evId = eventId) => ZONES.filter((z) => statusOf(z.id, evId) === 'free').length,
    [statusOf, eventId]
  );

  const pulse = useCallback((message) => {
    setFlash((n) => n + 1);
    haptic([10, 30, 16]);
    if (message) setToast(message);
  }, []);

  const book = useCallback(
    (zoneId) => {
      setBookings((prev) => {
        const list = prev[eventId] || [];
        if (list.includes(zoneId)) return prev;
        return { ...prev, [eventId]: [...list, zoneId] };
      });
    },
    [eventId]
  );

  const cancel = useCallback(
    (zoneId) => {
      setBookings((prev) => ({ ...prev, [eventId]: (prev[eventId] || []).filter((id) => id !== zoneId) }));
    },
    [eventId]
  );

  const resetDemo = useCallback(() => {
    setBookings({});
    setToast('MÉMOIRE DE DÉMONSTRATION EFFACÉE');
  }, []);

  const selectEvent = useCallback((id) => {
    setEventId(id);
    setOpenId(null);
  }, []);

  const value = useMemo(
    () => ({
      eventId,
      event: eventById(eventId),
      selectEvent,
      bookings,
      pendingFor,
      statusOf,
      freeCount,
      openId,
      openTable: setOpenId,
      closeTable: () => setOpenId(null),
      hoverId,
      setHoverId,
      book,
      cancel,
      resetDemo,
      toast,
      setToast,
      pulse,
      flash
    }),
    [eventId, selectEvent, bookings, pendingFor, statusOf, freeCount, openId, hoverId, book, cancel, resetDemo, toast, pulse, flash]
  );

  return <VenueContext.Provider value={value}>{children}</VenueContext.Provider>;
}

export function useVenue() {
  const ctx = useContext(VenueContext);
  if (!ctx) throw new Error('useVenue doit être utilisé dans <VenueProvider>');
  return ctx;
}

export const STATUS_LABEL = {
  free: 'DISPONIBLE',
  pending: 'DEMANDE ENVOYÉE',
  taken: 'COMPLET'
};

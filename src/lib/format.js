export const euro = (n) => n.toLocaleString('fr-FR') + ' €';
export const pad2 = (n) => String(n).padStart(2, '0');
export const ref = () => 'R1862-' + Math.random().toString(36).slice(2, 6).toUpperCase();

/** Vibration courte : retour haptique sur mobile, ignoré ailleurs. */
export const haptic = (pattern = 12) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
};

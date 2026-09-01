// Alertes sonores via Web Audio API — aucun asset audio nécessaire.
// Le module garde un drapeau "muted" synchronisé par le Provider de préférences.

let audioCtx: AudioContext | null = null;
let muted = false;

export function setAudioMuted(m: boolean) {
  muted = m;
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined" || muted) return null;
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

/** Bip synthétisé. freq en Hz, dur en secondes. */
export function beep(freq = 880, dur = 0.12, type: OscillatorType = "square", gain = 0.15) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}

/** Tic de métronome RCP (110/min ≈ toutes les 545 ms côté appelant). */
export function metronomeTick() {
  beep(1200, 0.05, "square", 0.08);
}

/** Fin de cycle RCP : double sonnerie bien audible. */
export function cycleAlarm() {
  beep(880, 0.18, "square", 0.2);
  setTimeout(() => beep(1175, 0.3, "square", 0.2), 200);
}

/** Confirmation discrète (clic UI important, ex. favori). */
export function uiClick() {
  beep(700, 0.05, "sine", 0.06);
}

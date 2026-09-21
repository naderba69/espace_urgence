// v7.8 — mémoire de la boucle de réévaluation : chaque cycle horodaté (localStorage, hors-ligne).
// Sert à la tendance (↑→↓), à l'alarme de 2 aggravations consécutives et au SBAR de terrain.
export type Verdict = "improve" | "stall" | "worsen";

export interface RevalEntry {
  at: number;        // epoch ms
  verdict: Verdict;
  mews?: number;
  qsofa?: number;
}

const MAX = 20;
const key = (id: string) => `reval:log:${id}`;

export function loadLog(id: string): RevalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key(id));
    const l = raw ? (JSON.parse(raw) as RevalEntry[]) : [];
    return Array.isArray(l) ? l : [];
  } catch {
    return [];
  }
}

export function appendLog(id: string, e: RevalEntry): RevalEntry[] {
  const l = [...loadLog(id), e].slice(-MAX);
  try {
    window.localStorage.setItem(key(id), JSON.stringify(l));
  } catch {
    /* stockage plein/privé : la boucle continue en mémoire */
  }
  return l;
}

export function clearLog(id: string): void {
  try {
    window.localStorage.removeItem(key(id));
  } catch {
    /* noop */
  }
}

/** Tendance sur les 3 derniers verdicts : improve=+1, stall=0, worsen=-1. */
export function trend(log: RevalEntry[]): "up" | "flat" | "down" | null {
  const last = log.slice(-3);
  if (last.length < 2) return null;
  const s = last.reduce((n, e) => n + (e.verdict === "improve" ? 1 : e.verdict === "worsen" ? -1 : 0), 0);
  return s > 0 ? "up" : s < 0 ? "down" : "flat";
}

/** 2 aggravations consécutives ⇒ alarme transfert. */
export function doubleWorsen(log: RevalEntry[]): boolean {
  const last = log.slice(-2);
  return last.length === 2 && last.every((e) => e.verdict === "worsen");
}

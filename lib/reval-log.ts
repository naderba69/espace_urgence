import { readSessionJSON, writeSessionJSON, removeSessionKey } from "@/lib/storage";
// v7.8 — mémoire de la boucle de réévaluation : chaque cycle horodaté (sessionStorage, hors-ligne).
// Sert à la tendance (↑→↓), à l'alarme de 2 aggravations consécutives et au SBAR de terrain.
export type Verdict = "improve" | "stall" | "worsen";

export interface RevalEntry {
  at: number;        // epoch ms
  verdict: Verdict;
  /** Scores adultes saisis uniquement avec âge connu ≥18 ans. */
  adultScores?: boolean;
  mews?: number;
  qsofa?: number;
}

const MAX = 20;
const key = (id: string) => `reval:log:${id}`;

export function sanitizeRevalLog(value: unknown, now = Date.now()): RevalEntry[] {
  if (!Array.isArray(value)) return [];
  const safe: RevalEntry[] = [];
  for (const candidate of value) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) continue;
    const x = candidate as Record<string, unknown>;
    if (typeof x.at !== "number" || !Number.isFinite(x.at) || x.at <= 0 || x.at > now ||
        (x.verdict !== "improve" && x.verdict !== "stall" && x.verdict !== "worsen")) continue;
    const entry: RevalEntry = { at: x.at, verdict: x.verdict };
    if (typeof x.adultScores === "boolean") entry.adultScores = x.adultScores;
    if (typeof x.mews === "number" && Number.isInteger(x.mews) && x.mews >= 0 && x.mews <= 14) entry.mews = x.mews;
    if (typeof x.qsofa === "number" && Number.isInteger(x.qsofa) && x.qsofa >= 0 && x.qsofa <= 3) entry.qsofa = x.qsofa;
    safe.push(entry);
  }
  return safe.sort((a, b) => a.at - b.at).slice(-MAX);
}

export function loadLog(id: string): RevalEntry[] {
  if (typeof window === "undefined" || !/^[a-z0-9-]{1,80}$/i.test(id)) return [];
  return sanitizeRevalLog(readSessionJSON<unknown>(key(id), []));
}

export function appendLog(id: string, e: RevalEntry): RevalEntry[] {
  const l = sanitizeRevalLog([...loadLog(id), e]);
  if (/^[a-z0-9-]{1,80}$/i.test(id)) writeSessionJSON(key(id), l);
  return l;
}

export function clearLog(id: string): void {
  if (/^[a-z0-9-]{1,80}$/i.test(id)) removeSessionKey(key(id));
}

/** Tendance sur les 3 derniers verdicts : improve=+1, stall=0, worsen=-1. */
export function trend(log: RevalEntry[]): "up" | "flat" | "down" | null {
  const last = sanitizeRevalLog(log).slice(-3);
  if (last.length < 2) return null;
  const s = last.reduce((n, e) => n + (e.verdict === "improve" ? 1 : e.verdict === "worsen" ? -1 : 0), 0);
  return s > 0 ? "up" : s < 0 ? "down" : "flat";
}

/** 2 aggravations consécutives ⇒ alarme transfert. */
export function doubleWorsen(log: RevalEntry[]): boolean {
  const last = sanitizeRevalLog(log).slice(-2);
  return last.length === 2 && last.every((e) => e.verdict === "worsen");
}

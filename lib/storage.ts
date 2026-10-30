// Accès localStorage centralisé et sûr (SSR-friendly, jamais d'exception).
export const KEYS = {
  prefs: "eutn:prefs",
  favorites: "eutn:favorites",
  recent: "eutn:recent",
  searchHistory: "eutn:search-history",
  disclaimer: "eutn:disclaimer-v1",
  analyticsOptOut: "eutn:analytics-optout",
} as const;

/** Anciennes clés persistantes supprimées à l’hydratation pour purger les données patient historiques. */
export const LEGACY_PATIENT_KEYS = [
  "eutn:patient", "eutn:patient-log", "eutn:fiche-samu", "eutn:timeline",
  "eutn:timeline-log", "eutn:vitals-log", "eutn:problems",
] as const;
export const LEGACY_SESSION_PREFIXES = ["eutn:calc:", "eutn:pump:", "reval:log:"] as const;

export function purgeLegacyPersistentPatientData(storage: Storage): void {
  try {
    const storedKeys = Array.from({ length: storage.length }, (_, index) => storage.key(index)).filter((key): key is string => key !== null);
    for (const key of LEGACY_PATIENT_KEYS) storage.removeItem(key);
    for (const key of storedKeys) {
      if (LEGACY_SESSION_PREFIXES.some((prefix) => key.startsWith(prefix))) storage.removeItem(key);
    }
  } catch { /* stockage bloqué : ne pas bloquer l’application */ }
}

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota plein ou mode privé : on ignore silencieusement */
  }
}

/** Données patient temporaires : stockage par onglet, effacé avec la session du navigateur. */
export function readSessionJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeSessionJSON(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* stockage de session indisponible ou quota plein */
  }
}

export function removeSessionKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export type PersistedPrefs = {
  lang: "fr" | "ar";
  theme: "auto" | "dark" | "light" | "amoled";
  fontSize: 16 | 18 | 20;
  muted: boolean;
  printSize: "a4" | "a5";
};

/** JSON localStorage est une entrée non fiable : ne jamais confondre cast TS et validation. */
export function sanitizePrefs(value: unknown): PersistedPrefs {
  const x = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    // Interface française exclusive ; les préférences historiques AR sont migrées à FR.
    lang: "fr",
    theme: x.theme === "dark" || x.theme === "light" || x.theme === "amoled" ? x.theme : "auto",
    fontSize: x.fontSize === 18 || x.fontSize === 20 ? x.fontSize : 16,
    muted: x.muted === true,
    printSize: x.printSize === "a5" ? "a5" : "a4",
  };
}

export function sanitizeStringArray(value: unknown, limit = 50): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((x): x is string => typeof x === "string").map((x) => x.trim().slice(0, 200)).filter(Boolean))].slice(0, limit);
}

/** Compteurs analytiques locaux : clés bornées, nombres entiers finis et non négatifs uniquement. */
export function sanitizeCounterMap(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const safe: Record<string, number> = {};
  for (const [key, count] of Object.entries(value).slice(0, 500)) {
    if (!key || key.length > 120 || !Number.isFinite(count) || typeof count !== "number" || count < 0) continue;
    safe[key] = Math.min(Math.trunc(count), 2_147_483_647);
  }
  return safe;
}

export function sanitizeRecentKeys(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return sanitizeStringArray(value.flatMap((entry) =>
    entry && typeof entry === "object" && typeof (entry as { key?: unknown }).key === "string"
      ? [(entry as { key: string }).key]
      : []
  ), 10);
}

export type PersistedPatient = { w: string; age: string; scr: string; sexe: "m" | "f" };

/** Garde des champs numériques textuels compatibles avec les formulaires, rejette les formes corrompues. */
export function sanitizePatient(value: unknown): PersistedPatient {
  const x = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const numberText = (candidate: unknown): string => {
    if (typeof candidate !== "string" && typeof candidate !== "number") return "";
    const text = String(candidate).trim().slice(0, 24);
    if (!text || !/^\d+(?:[.,]\d+)?$/.test(text)) return "";
    const number = Number(text.replace(",", "."));
    return Number.isFinite(number) && number >= 0 ? text : "";
  };
  return {
    w: numberText(x.w),
    age: numberText(x.age),
    scr: numberText(x.scr),
    sexe: x.sexe === "f" ? "f" : "m",
  };
}

export type PersistedPatientLogEntry = { at: number; p: PersistedPatient };

/** Assainit l'archive patient locale sans prétendre appliquer une durée de conservation légale. */
export function sanitizePatientLog(value: unknown, now = Date.now(), limit = 5): PersistedPatientLogEntry[] {
  if (!Array.isArray(value)) return [];
  const safe: PersistedPatientLogEntry[] = [];
  for (const candidate of value) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) continue;
    const entry = candidate as Record<string, unknown>;
    const at = entry.at;
    if (typeof at !== "number" || !Number.isFinite(at) || at <= 0 || at > now) continue;
    const patient = sanitizePatient(entry.p);
    if (patient.w || patient.age || patient.scr) safe.push({ at, p: patient });
  }
  return safe.sort((a, b) => b.at - a.at).slice(0, Math.max(0, limit));
}

export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

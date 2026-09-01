// Accès localStorage centralisé et sûr (SSR-friendly, jamais d'exception).
export const KEYS = {
  prefs: "eutn:prefs",
  favorites: "eutn:favorites",
  recent: "eutn:recent",
  searchHistory: "eutn:search-history",
  disclaimer: "eutn:disclaimer-v1",
  analyticsOptOut: "eutn:analytics-optout",
} as const;

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

export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

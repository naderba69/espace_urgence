// Google Analytics 4 — ID temporaire à REMPLACER (voir README).
// Rien n'est chargé tant que l'ID reste le placeholder ou que l'utilisateur s'est désinscrit.
import { KEYS, readJSON } from "./storage";

export const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // ← remplacer par votre ID GA4

const enabled = () =>
  GA_MEASUREMENT_ID !== "G-XXXXXXXXXX" &&
  typeof window !== "undefined" &&
  !readJSON(KEYS.analyticsOptOut, false);

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Injecte gtag une seule fois (appelé par le Provider). */
export function initAnalytics() {
  if (!enabled() || window.gtag) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer!.push(args);
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
}

/** v3.3 — compteur local hors-ligne (aucun envoi réseau). */
const STATS_KEY = "eutn:stats-v1";

export function bumpLocal(key: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.parse(localStorage.getItem(STATS_KEY) ?? "{}") as Record<string, number>;
    raw[key] = (raw[key] ?? 0) + 1;
    localStorage.setItem(STATS_KEY, JSON.stringify(raw));
  } catch { /* stockage indisponible */ }
}

export function readLocalStats(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) ?? "{}") as Record<string, number>;
  } catch {
    return {};
  }
}

export function resetLocalStats() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STATS_KEY);
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && params?.id && typeof params.id === "string") bumpLocal(`${name}:${params.id}`);
  if (enabled() && window.gtag) window.gtag("event", name, params);
}

export function trackPageView(url: string) {
  if (enabled() && window.gtag) window.gtag("event", "page_view", { page_path: url });
}

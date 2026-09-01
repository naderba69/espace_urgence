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

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (enabled() && window.gtag) window.gtag("event", name, params);
}

export function trackPageView(url: string) {
  if (enabled() && window.gtag) window.gtag("event", "page_view", { page_path: url });
}

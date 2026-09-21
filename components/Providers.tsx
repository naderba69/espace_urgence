"use client";
// Fournit : langue (FR/AR + RTL), thème, taille de police, muet, favoris, récents,
// mode urgence, GA, enregistrement du service worker. Une seule source de vérité.
import {
  createContext,
  useCallback,
  useRef,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type Lang } from "@/lib/i18n";
import { KEYS, readJSON, writeJSON } from "@/lib/storage";
import { setAudioMuted } from "@/lib/audio";
import { initAnalytics, trackPageView } from "@/lib/analytics";
import { usePathname } from "next/navigation";

export type Theme = "auto" | "dark" | "light" | "amoled";
export interface Prefs {
  lang: Lang;
  theme: Theme;
  fontSize: 16 | 18 | 20;
  muted: boolean;
  printSize: "a4" | "a5";
}
const DEFAULT_PREFS: Prefs = { lang: "fr", theme: "auto", fontSize: 16, muted: false, printSize: "a4" };

/** Thème sombre effectif : « auto » suit prefers-color-scheme. */
export function isEffectiveDark(theme: Theme): boolean {
  if (theme === "dark" || theme === "amoled") return true;
  if (theme === "light") return false;
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)")?.matches === true;
}

interface RecentItem {
  key: string;
  at: number;
}

/** v13.3 — المريض النشط : بيانات تُدخل مرة واحدة وتتعبّأ بها المحركات (كتابة فوقية حرة). */
export interface ActivePatient { w: string; age: string; scr: string; sexe: "m" | "f"; }
export const EMPTY_PATIENT: ActivePatient = { w: "", age: "", scr: "", sexe: "m" };

interface AppCtx {
  prefs: Prefs;
  setPref: <K extends keyof Prefs>(k: K, v: Prefs[K]) => void;
  lang: Lang;
  t: (k: string) => string;
  hydrated: boolean;
  favorites: string[];
  isFav: (key: string) => boolean;
  toggleFav: (key: string) => void;
  reorderFavs: (next: string[]) => void;
  recent: string[];
  pushRecent: (key: string) => void;
  emergencyOpen: boolean;
  setEmergencyOpen: (b: boolean) => void;
  updateReady: boolean;
  dismissUpdate: () => void;
  patient: ActivePatient;
  setPatient: (p: ActivePatient) => void;
}

const Ctx = createContext<AppCtx | null>(null);

function applyPrefs(p: Prefs) {
  const el = document.documentElement;
  el.classList.toggle("dark", isEffectiveDark(p.theme));
  el.classList.toggle("amoled", p.theme === "amoled");
  el.lang = p.lang;
  el.dir = p.lang === "ar" ? "rtl" : "ltr";
  el.style.fontSize = `${p.fontSize}px`;
  setAudioMuted(p.muted);
}

export default function Providers({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const [patient, setPatientState] = useState<ActivePatient>(EMPTY_PATIENT);
  const [hydrated, setHydrated] = useState(false);
  const pathname = usePathname();

  // Intégration native (APK Capacitor) : barre d'état assortie au thème, splash masqué
  // sitôt React prêt. Ignoré en web (aucun objet Capacitor).
  useEffect(() => {
    const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
    if (!cap?.isNativePlatform?.()) return;
    import("@capacitor/status-bar").then((m) => {
      m.StatusBar.setBackgroundColor({ color: "#0b1220" }).catch(() => undefined);
      m.StatusBar.setStyle({ style: m.Style.Dark }).catch(() => undefined);
    }).catch(() => undefined);
    import("@capacitor/splash-screen").then((m) => m.SplashScreen.hide().catch(() => undefined)).catch(() => undefined);
  }, []);
  // Chargement initial depuis localStorage (préférences, favoris, récents, patient actif)
  useEffect(() => {
    const p = { ...DEFAULT_PREFS, ...readJSON<Partial<Prefs>>(KEYS.prefs, {}) };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- préférences lues après hydratation (le serveur rend les défauts ; INIT_SCRIPT évite le FOUC)
    setPrefs(p);
    applyPrefs(p);
    setFavorites(readJSON<string[]>(KEYS.favorites, []));
    setRecent(readJSON<RecentItem[]>(KEYS.recent, []).map((r) => r.key));
    setPatientState(readJSON<ActivePatient>(KEYS.patient, EMPTY_PATIENT));
    setHydrated(true);

    // Service worker (production uniquement) — chemin préfixé par le basePath de déploiement.
    // v2.1 : détection d'une nouvelle version installée → bandeau « recharger ».
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      const base = document.querySelector('meta[name="deploy-base"]')?.getAttribute("content") ?? "";
      navigator.serviceWorker
        .register(`${base}/sw.js`)
        .then((reg) => {
          const signal = () => window.dispatchEvent(new Event("eutn:sw-update"));
          reg.addEventListener("updatefound", () => {
            const nw = reg.installing;
            nw?.addEventListener("statechange", () => {
              if (nw.state === "installed" && navigator.serviceWorker.controller) signal();
            });
          });
          // vérification périodique + au retour d'arrière-plan
          const check = () => reg.update().catch(() => undefined);
          window.setInterval(check, 1800000); // v7.9 — delta de contenu vérifié toutes les 30 min
          window.addEventListener("focus", check);
        })
        .catch(() => {});
    }
    initAnalytics();
  }, []);

  // Changement de route : retour en haut du conteneur de scroll + re-suivi de page.
  // (le scroll vit dans <main id="contenu">, pas dans window — Next ne le gère pas seul)
  useEffect(() => {
    document.getElementById("contenu")?.scrollTo({ top: 0, behavior: "instant" });
    if (hydrated) trackPageView(pathname);
  }, [pathname, hydrated]);

  // v9.0 — thème « auto » : suit le système en direct (bascule clair/sombre de l'OS).
  useEffect(() => {
    if (prefs.theme !== "auto") return;
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = () => applyPrefs(prefs);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [prefs]);

  // v2.1 — bandeau de mise à jour piloté par l'événement du service worker
  useEffect(() => {
    const on = () => setUpdateReady(true);
    window.addEventListener("eutn:sw-update", on);
    return () => window.removeEventListener("eutn:sw-update", on);
  }, []);
  const dismissUpdate = useCallback(() => setUpdateReady(false), []);

  const setPref = useCallback(<K extends keyof Prefs>(k: K, v: Prefs[K]) => {
    setPrefs((prev) => {
      const next = { ...prev, [k]: v };
      applyPrefs(next);
      writeJSON(KEYS.prefs, next);
      return next;
    });
  }, []);

  const toggleFav = useCallback((key: string) => {
    setFavorites((prev) => {
      const next = prev.includes(key) ? prev.filter((x) => x !== key) : [key, ...prev];
      writeJSON(KEYS.favorites, next);
      return next;
    });
  }, []);

  const reorderFavs = useCallback((next: string[]) => {
    setFavorites(next);
    writeJSON(KEYS.favorites, next);
  }, []);

  const pushRecent = useCallback((key: string) => {
    setRecent((prev) => {
      const next = [key, ...prev.filter((x) => x !== key)].slice(0, 10);
      writeJSON(
        KEYS.recent,
        next.map((k, i) => ({ key: k, at: Date.now() - i }))
      );
      return next;
    });
  }, []);

  const setPatient = useCallback((np: ActivePatient) => {
    setPatientState(np);
    writeJSON(KEYS.patient, np);
  }, []);

  const value = useMemo<AppCtx>(
    () => ({
      prefs,
      setPref,
      lang: prefs.lang,
      t: (k: string) => dictionaries[prefs.lang][k] ?? dictionaries.fr[k] ?? k,
      hydrated,
      favorites,
      isFav: (key: string) => favorites.includes(key),
      toggleFav,
      reorderFavs,
      recent,
      pushRecent,
      emergencyOpen,
      setEmergencyOpen,
      updateReady,
      dismissUpdate,
      patient,
      setPatient,
    }),
    [prefs, hydrated, favorites, recent, emergencyOpen, setPref, toggleFav, reorderFavs, pushRecent, updateReady, dismissUpdate, patient, setPatient]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** v13.3 — تعبئة مرة واحدة عند الفتح من «المريض النشط» (بعد الهيدراسيون، بلا مزامنة قسرية لاحقة). */
export function usePrefillPatient(apply: (p: ActivePatient) => void) {
  const { patient, hydrated } = useApp();
  const done = useRef(false);
  useEffect(() => {
    if (done.current || !hydrated) return;
    done.current = true;
    apply(patient);
  }, [hydrated, apply, patient]);
}

export function useApp(): AppCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp doit être utilisé sous <Providers>");
  return ctx;
}

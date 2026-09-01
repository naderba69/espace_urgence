"use client";
// Fournit : langue (FR/AR + RTL), thème, taille de police, muet, favoris, récents,
// mode urgence, GA, enregistrement du service worker. Une seule source de vérité.
import {
  createContext,
  useCallback,
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

export type Theme = "dark" | "light";
export interface Prefs {
  lang: Lang;
  theme: Theme;
  fontSize: 16 | 18 | 20;
  muted: boolean;
}
const DEFAULT_PREFS: Prefs = { lang: "fr", theme: "dark", fontSize: 16, muted: false };

interface RecentItem {
  key: string;
  at: number;
}

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
}

const Ctx = createContext<AppCtx | null>(null);

function applyPrefs(p: Prefs) {
  const el = document.documentElement;
  el.classList.toggle("dark", p.theme === "dark");
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
  const [hydrated, setHydrated] = useState(false);
  const pathname = usePathname();

  // Chargement initial depuis localStorage
  useEffect(() => {
    const p = { ...DEFAULT_PREFS, ...readJSON<Partial<Prefs>>(KEYS.prefs, {}) };
    setPrefs(p);
    applyPrefs(p);
    setFavorites(readJSON<string[]>(KEYS.favorites, []));
    setRecent(readJSON<RecentItem[]>(KEYS.recent, []).map((r) => r.key));
    setHydrated(true);

    // Service worker (production uniquement)
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    initAnalytics();
  }, []);

  // Re-suivi de page sur changement de route
  useEffect(() => {
    if (hydrated) trackPageView(pathname);
  }, [pathname, hydrated]);

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
    }),
    [prefs, hydrated, favorites, recent, emergencyOpen, setPref, toggleFav, reorderFavs, pushRecent]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp doit être utilisé sous <Providers>");
  return ctx;
}

"use client";
// En-tête natif : logo, recherche, bascules, urgence — + tiroir latéral coulissant (type app).
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Activity, Menu, Moon, Sun, MonitorSmartphone, Volume2, VolumeX, Siren, X } from "lucide-react";
import { useApp } from "./Providers";
import Nav from "./Nav";
import InstallPwa from "./InstallPwa";

export default function Header() {
  const { t, prefs, setPref, setEmergencyOpen } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Échap ferme le tiroir + verrouille le scroll de l'app-shell pendant l'ouverture
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    document.documentElement.dataset.drawer = "open";
    return () => {
      document.removeEventListener("keydown", onKey);
      delete document.documentElement.dataset.drawer;
    };
  }, [menuOpen]);

  // Onglet « Plus » de la barre inférieure → ouvre le tiroir
  useEffect(() => {
    const open = () => setMenuOpen(true);
    window.addEventListener("eutn:drawer", open);
    return () => window.removeEventListener("eutn:drawer", open);
  }, []);

  return (
    <>
      <header style={{ paddingTop: "env(safe-area-inset-top)" }} className="eutn-header relative z-40 shrink-0 border-b border-line/70 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2">
          <button
            className="touch rounded-xl hover:bg-surface2"
            aria-label={t("nav.navigation")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-sky-600 text-white shadow-md shadow-blue-600/30">
              <Activity className="h-5 w-5" aria-hidden />
            </span>
            <span className="hidden bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent sm:inline">{t("app.name")}</span>
          </Link>

          {/* v10.0 — en-tête mini : la recherche vit dans le FAB (mobile) et le rail (bureau) */}
          <div className="mx-auto" />

          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => setPref("lang", prefs.lang === "fr" ? "ar" : "fr")}
              className="touch rounded-xl px-3 font-bold text-blue-500 hover:bg-surface2"
              aria-label={t("settings.language")}
            >
              {prefs.lang === "fr" ? "ع" : "FR"}
            </button>
            {/* v9.0 — cycle déterministe : auto → clair → sombre → auto (pas de lecture système au rendu = zéro mismatch) */}
            <button
              onClick={() => setPref("theme", prefs.theme === "auto" ? "light" : prefs.theme === "light" ? "dark" : "auto")}
              className="touch hidden rounded-xl hover:bg-surface2 sm:inline-flex"
              aria-label={t("settings.theme")}
              title={prefs.theme === "auto" ? t("settings.auto") : prefs.theme === "light" ? t("settings.light") : t("settings.dark")}
            >
              {prefs.theme === "auto" ? <MonitorSmartphone className="h-5 w-5" /> : prefs.theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setPref("muted", !prefs.muted)}
              className="touch hidden rounded-xl hover:bg-surface2 sm:inline-flex"
              aria-label={prefs.muted ? t("common.mute.on") : t("common.mute.off")}
            >
              {prefs.muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <InstallPwa variant="icon" />
            <button
              onClick={() => setEmergencyOpen(true)}
              className="sos-pulse touch shrink-0 whitespace-nowrap gap-1 rounded-xl bg-red-600 px-3 py-2 font-bold text-white shadow-lg shadow-red-600/30 hover:bg-red-500"
              aria-label={t("emergency.open")}
            >
              <Siren className="h-5 w-5" aria-hidden />
              <span className="hidden sm:inline">{t("emergency.open")}</span>
            </button>
          </div>
        </div>

        {/* v10.0 — en-tête mini : la recherche mobile descend dans le FAB (.m3-fab) */}
      </header>

      {/* ── Tiroir latéral natif : panneau fixe au-dessus de tout + backdrop ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t("nav.navigation")}>
          {/* backdrop — touche pour fermer */}
          <button
            aria-label={prefs.lang === "ar" ? "إغلاق القائمة" : "Fermer le menu"}
            onClick={() => setMenuOpen(false)}
            className="eutn-backdrop absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          />
          {/* panneau coulissant : bord de départ (RTL auto via start-0) */}
          <div
            ref={panelRef}
            className="eutn-drawer absolute inset-y-0 start-0 flex w-[82%] max-w-80 flex-col border-e border-line bg-surface shadow-2xl"
            style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* tête du tiroir : marque dégradée + fermer */}
            <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3">
              <span className="flex items-center gap-2.5 font-extrabold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-sky-600 text-white shadow-md shadow-blue-600/30">
                  <Activity className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <span className="bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">{t("app.name")}</span>
              </span>
              <button onClick={() => setMenuOpen(false)} aria-label="×" className="touch rounded-xl hover:bg-surface2">
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>
            {/* zone scrollable du tiroir — confinement total */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <Nav onNavigate={() => setMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

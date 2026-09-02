"use client";
// En-tête : logo, recherche (desktop), bascules langue/thème/son, mode urgence, menu mobile.
import Link from "next/link";
import { useState } from "react";
import { Activity, Menu, Moon, Sun, Volume2, VolumeX, Siren, X } from "lucide-react";
import { useApp } from "./Providers";
import SearchBar from "./SearchBar";
import Nav from "./Nav";
import InstallPwa from "./InstallPwa";

export default function Header() {
  const { t, prefs, setPref, setEmergencyOpen } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2">
        <button
          className="touch rounded-xl lg:hidden hover:bg-surface2"
          aria-label={t("nav.navigation")}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
          <Activity className="h-7 w-7 text-teal-500" aria-hidden />
          <span className="hidden sm:inline">{t("app.name")}</span>
        </Link>

        <div className="mx-auto hidden md:block w-full max-w-md">
          <SearchBar />
        </div>
        <div className="mx-auto md:hidden" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPref("lang", prefs.lang === "fr" ? "ar" : "fr")}
            className="touch rounded-xl px-3 font-bold text-teal-500 hover:bg-surface2"
            aria-label={t("settings.language")}
          >
            {prefs.lang === "fr" ? "ع" : "FR"}
          </button>
          <button
            onClick={() => setPref("theme", prefs.theme === "dark" ? "light" : "dark")}
            className="touch rounded-xl hover:bg-surface2"
            aria-label={t("settings.theme")}
          >
            {prefs.theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setPref("muted", !prefs.muted)}
            className="touch rounded-xl hover:bg-surface2"
            aria-label={prefs.muted ? t("common.mute.on") : t("common.mute.off")}
          >
            {prefs.muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <InstallPwa variant="icon" />
          <button
            onClick={() => setEmergencyOpen(true)}
            className="touch gap-1 rounded-xl bg-red-600 px-3 py-2 font-bold text-white hover:bg-red-500"
            aria-label={t("emergency.open")}
          >
            <Siren className="h-5 w-5" aria-hidden />
            <span className="hidden sm:inline">{t("emergency.open")}</span>
          </button>
        </div>
      </div>

      {/* Recherche mobile permanente — toujours visible sans ouvrir le menu */}
      <div className="border-t border-line bg-surface/95 px-3 py-2 md:hidden">
        <SearchBar />
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-surface lg:hidden">
          <Nav onNavigate={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}

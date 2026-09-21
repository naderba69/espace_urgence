"use client";
// v10.0 — FAB recherche (mobile) : charte = la recherche descend en bas,
// l'en-tête reste mini. Ouvre la palette de commandes (même moteur que Ctrl+K).
import { Search } from "lucide-react";
import { useApp } from "./Providers";

export default function SearchFab() {
  const { t } = useApp();
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("eutn:palette"))}
      className="m3-fab touch lg:hidden"
      aria-label={t("search.placeholder")}
    >
      <Search className="h-6 w-6" aria-hidden />
    </button>
  );
}

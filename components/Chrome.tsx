"use client";
// Petites actions réutilisables : impression, favoris — séparées pour rester légères.
import { Printer, Star } from "lucide-react";
import { useApp } from "./Providers";
import { trackEvent } from "@/lib/analytics";
import { uiClick } from "@/lib/audio";

export function PrintButton() {
  const { t } = useApp();
  return (
    <button
      onClick={() => {
        trackEvent("print");
        window.print();
      }}
      className="no-print touch gap-2 rounded-xl border border-line bg-surface px-4 py-2 font-semibold hover:bg-surface2"
    >
      <Printer className="h-5 w-5" aria-hidden />
      {t("common.print")}
    </button>
  );
}

export function FavoriteButton({ itemKey }: { itemKey: string }) {
  const { isFav, toggleFav, t } = useApp();
  const fav = isFav(itemKey);
  return (
    <button
      onClick={() => {
        toggleFav(itemKey);
        uiClick();
        trackEvent("favorite_toggle", { key: itemKey, on: !fav });
      }}
      aria-pressed={fav}
      aria-label={fav ? t("common.favorite.remove") : t("common.favorite.add")}
      className={`no-print touch rounded-xl border border-line hover:bg-surface2 ${fav ? "text-amber-400" : ""}`}
    >
      <Star className="h-6 w-6" fill={fav ? "currentColor" : "none"} aria-hidden />
    </button>
  );
}

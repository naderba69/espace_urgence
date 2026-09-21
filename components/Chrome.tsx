"use client";
// Petites actions réutilisables : favoris — séparées pour rester légères.
import { Star } from "lucide-react";
import { useApp } from "./Providers";
import { trackEvent } from "@/lib/analytics";
import { uiClick } from "@/lib/audio";

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
      className={`touch rounded-xl border border-line hover:bg-surface2 ${fav ? "text-amber-400" : ""}`}
    >
      <Star className="h-6 w-6" fill={fav ? "currentColor" : "none"} aria-hidden />
    </button>
  );
}

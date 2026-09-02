"use client";
// Accueil : recherche, actions rapides, favoris (glisser-déposer), récents, rappels vitaux.
import Link from "next/link";
import { useEffect, useState } from "react";
import { Siren, Timer, Syringe, Brain, AlertTriangle, Phone, GripVertical, Star } from "lucide-react";
import { useApp } from "@/components/Providers";
import SearchBar from "@/components/SearchBar";
import InstallPwa from "@/components/InstallPwa";
import { resolveRef } from "@/lib/search";
import { vitalSigns, emergencyNumbers } from "@/data/quickref";

const QUICK = [
  { href: "/calculateurs/chrono-rcp", Icon: Timer, fr: "Chronomètre RCP", ar: "مؤقّت الإنعاش", cls: "bg-red-600 text-white" },
  { href: "/calculateurs/dose-poids", Icon: Syringe, fr: "Dose selon poids", ar: "جرعة حسب الوزن", cls: "bg-teal-600 text-white" },
  { href: "/calculateurs/gcs", Icon: Brain, fr: "Glasgow", ar: "غلاسكو", cls: "bg-sky-700 text-white" },
  { href: "/protocoles/anaphylaxie", Icon: AlertTriangle, fr: "Anaphylaxie", ar: "الحساسية المفرطة", cls: "bg-orange-600 text-white" },
];

export default function HomePage() {
  const { t, lang, favorites, recent, reorderFavs, setEmergencyOpen } = useApp();
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // Raccourci PWA "?urgence=1" (icône d'écran d'accueil "Mode urgence")
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("urgence") === "1") {
      setEmergencyOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const favItems = favorites.map(resolveRef).filter(Boolean);
  const recentItems = recent.map(resolveRef).filter(Boolean).slice(0, 6);

  const onDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const next = [...favorites];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    reorderFavs(next);
    setDragIdx(null);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Recherche */}
      <section className="relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl border border-teal-600/20 bg-gradient-to-b from-teal-600/10 via-surface to-surface px-4 py-8 sm:py-12">
        {/* هالة مائية */}
        <div aria-hidden className="pointer-events-none absolute -top-24 h-64 w-64 rounded-full bg-teal-600/20 blur-3xl" />
        <h1 className="relative text-center text-3xl font-black tracking-tight sm:text-4xl">
          <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">{t("app.name")}</span>
        </h1>
        <p className="relative max-w-md text-center text-sm opacity-70 sm:text-base">{t("home.tag")}</p>
        <div className="relative w-full max-w-xl">
          <SearchBar big />
        </div>
        <button
          onClick={() => setEmergencyOpen(true)}
          className="touch relative mt-1 gap-3 rounded-2xl bg-red-600 px-8 py-4 text-lg font-black text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500 hover:shadow-red-500/40 active:scale-95"
        >
          <Siren className="h-7 w-7" aria-hidden />
          {t("emergency.open")}
        </button>
      </section>

      {/* Installation PWA */}
      <InstallPwa variant="banner" />

      {/* Actions rapides */}
      <section aria-labelledby="qa">
        <h2 id="qa" className="mb-3 flex items-center gap-2 text-lg font-bold">
          <span className="h-5 w-1 rounded-full bg-teal-500" aria-hidden />
          {t("home.quickActions")}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK.map(({ href, Icon, fr, ar, cls }) => (
            <Link key={href} href={href} className={`${cls} flex flex-col items-center justify-center gap-2 rounded-2xl p-4 min-h-[100px] font-bold text-center shadow-md transition hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]`}>
              <Icon className="h-8 w-8" aria-hidden />
              <span className="text-sm sm:text-base leading-tight">{lang === "ar" ? ar : fr}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Favoris (glisser pour réordonner) */}
      <section aria-labelledby="fav">
        <h2 id="fav" className="mb-3 flex items-center gap-2 text-lg font-bold">
          <Star className="h-5 w-5 text-amber-400" aria-hidden /> {t("home.favorites")}
        </h2>
        {favItems.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-4 text-sm opacity-70">{t("home.emptyFav")}</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {favItems.map((item, i) =>
              item ? (
                <li
                  key={item.key}
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(i)}
                  className="flex items-center gap-2 rounded-xl border border-line bg-surface"
                >
                  <span className="touch cursor-grab px-1 opacity-50" aria-hidden>
                    <GripVertical className="h-5 w-5" />
                  </span>
                  <Link href={item.href} className="flex-1 py-3 font-medium hover:text-teal-500">
                    {lang === "ar" ? item.title.ar : item.title.fr}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        )}
      </section>

      {/* Récents */}
      {recentItems.length > 0 && (
        <section aria-labelledby="rec">
          <h2 id="rec" className="mb-3 text-lg font-bold">{t("home.recent")}</h2>
          <ul className="flex flex-wrap gap-2">
            {recentItems.map((item) =>
              item ? (
                <li key={item.key}>
                  <Link href={item.href} className="rounded-full border border-line bg-surface px-4 py-2 text-sm hover:bg-surface2">
                    {lang === "ar" ? item.title.ar : item.title.fr}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Constantes */}
        <section aria-labelledby="vit" className="card rounded-2xl border border-line bg-surface p-4">
          <h2 id="vit" className="mb-3 text-lg font-bold">{t("home.vitals")}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-start opacity-70">
                  <th className="p-2 text-start"></th>
                  <th className="p-2 text-start">{t("common.adult")}</th>
                  <th className="p-2 text-start">{lang === "ar" ? "طفل" : "Enfant"}</th>
                  <th className="p-2 text-start">{lang === "ar" ? "رضيع" : "Nourrisson"}</th>
                  <th className="p-2 text-start">{lang === "ar" ? "حديث الولادة" : "Nouveau-né"}</th>
                </tr>
              </thead>
              <tbody>
                {vitalSigns.map((v) => (
                  <tr key={v.label.fr} className="border-b border-line/50 last:border-0">
                    <td className="p-2 font-medium">{lang === "ar" ? v.label.ar : v.label.fr}</td>
                    <td className="p-2 tabular-nums">{v.adult}</td>
                    <td className="p-2 tabular-nums">{v.child}</td>
                    <td className="p-2 tabular-nums">{v.infant}</td>
                    <td className="p-2 tabular-nums">{v.newborn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Numéros d'urgence Tunisie */}
        <section aria-labelledby="num" className="card rounded-2xl border border-line bg-surface p-4">
          <h2 id="num" className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Phone className="h-5 w-5 text-red-500" aria-hidden /> {t("home.numbers")}
          </h2>
          <ul className="grid gap-2">
            {emergencyNumbers.map((n) => (
              <li key={n.number}>
                <a
                  href={`tel:${n.number.replace(/\s/g, "")}`}
                  className="touch flex items-center justify-between rounded-xl bg-surface2 px-4 py-3 hover:bg-teal-600 hover:text-white"
                >
                  <span className="font-medium">
                    {lang === "ar" ? n.service.ar : n.service.fr}
                    {n.note && <span className="ms-2 text-xs opacity-60">({lang === "ar" ? n.note.ar : n.note.fr})</span>}
                  </span>
                  <span dir="ltr" className="text-xl font-black tabular-nums text-red-500">{n.number}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

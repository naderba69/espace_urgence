"use client";
// v15.0 — بنية A : الرئيسية مركزُ إطلاقٍ فقط. بطاقات الثيمات الخمسة + شبكة الأدوات
// + المريض النشط + البحث الشامل + زر الاستعجالي الأحمر الوحيد. لا شيء ثالث:
// المحتوى العلمي يسكن ثيماته، والأدوات تُستدعى من هنا أو سياقياً.
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Siren, HeartPulse, ScrollText, Pill, BookOpen, ListChecks,
  Calculator, Syringe, Timer, FileText, HeartCrack, Search, Settings, TentTree, Star, GripVertical, Phone, RefreshCcw, ClipboardList, FileOutput,
} from "lucide-react";
import { useApp } from "@/components/Providers";
import SearchBar from "@/components/SearchBar";
import InstallPwa from "@/components/InstallPwa";
import ActivePatient from "@/components/ActivePatient";
import { loadRefIndex, resolveRefs } from "@/lib/ref-index";
import { emergencyNumbers } from "@/data/quickref";
import { COUNTS } from "@/data/counts";
import { APP_VERSION } from "@/lib/version";
import ReviewAlert from "@/components/ReviewAlert";
import SectionTitle from "@/components/ui/SectionTitle";

// v15.0 — بطاقات الثيمات الخمسة (بنية A): كل ثيم = صف واحد بأيقونة وعدّاد.
const THEMES = [
  { href: "/rea", key: "tab.rea", sub: { fr: "Ce qui s'exécute à la minute", ar: "ما يُنفَّذ هذه الدقيقة" }, Icon: HeartPulse, count: 18 },
  { href: "/medicaments", key: "tab.meds", sub: { fr: "Fiches et posologies", ar: "البطاقة والجرعة" }, Icon: Pill, count: 0 },
  { href: "/protocoles", key: "tab.protocols", sub: { fr: "Le parcours complet de l'état", ar: "مسار الحالة كاملًا" }, Icon: ScrollText, count: 0 },
  { href: "/memo", key: "tab.memo", sub: { fr: "Lecture et révision", ar: "قراءة ومراجعة" }, Icon: BookOpen, count: 0 },
  { href: "/checklists", key: "tab.checklists", sub: { fr: "Étape par étape", ar: "خطوة بخطوة" }, Icon: ListChecks, count: 0 },
] as const;

// v15.0 — شبكة الأدوات (بلا تبويب): تُفتح من هنا أو تُستدعى سياقياً داخل الثيمات.
const TOOLS = [
  { href: "/calculateurs", Icon: Calculator, fr: "Calculateurs", ar: "الحاسبات" },
  { href: "/calculateurs/dose-check", Icon: Syringe, fr: "Dose check", ar: "تدقيق الجرعة" },
  { href: "/reevaluation", Icon: RefreshCcw, fr: "Réévaluation", ar: "إعادة تقييم" },
  { href: "/calculateurs/chronologie", Icon: Timer, fr: "Chronologie", ar: "خط الزمن" },
  { href: "/fiche-samu", Icon: FileText, fr: "Fiche SAMU", ar: "فيشة تدخّل" },
  { href: "/resume", Icon: FileOutput, fr: "Résumé de cas", ar: "ملخص الحالة" },
  { href: "/ecg", Icon: HeartCrack, fr: "ECG", ar: "تخطيط القلب" },
  { href: "/recherche", Icon: Search, fr: "Recherche", ar: "البحث" },
  { href: "/terrain", Icon: TentTree, fr: "Mode terrain", ar: "وضع الميدان" },
  { href: "/guidage", Icon: ClipboardList, fr: "Guidage", ar: "تدخل موجّه" },
  { href: "/parametres", Icon: Settings, fr: "Paramètres", ar: "الإعدادات" },
] as const;

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

  // v17.1 — favoris et récents n'ont besoin que du titre et du lien : ils sont résolus
  // par le fichier de références statique (14 Ko gzip) au lieu de l'index de recherche
  // complet (173 Ko). Chargé uniquement s'il y a effectivement quelque chose à résoudre.
  const [indexReady, setIndexReady] = useState(false);
  useEffect(() => {
    if (favorites.length === 0 && recent.length === 0) return; // rien à résoudre
    let alive = true;
    loadRefIndex()
      .then(() => alive && setIndexReady(true))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [favorites.length, recent.length]);

  const favItems = indexReady ? resolveRefs(favorites) : [];
  const recentItems = indexReady ? resolveRefs(recent).slice(0, 6) : [];

  // Compteurs statiques (data/counts.ts) — plus d'import des bases complètes ici.
  const counts: Record<string, number> = {
    "/medicaments": COUNTS.medications,
    "/protocoles": COUNTS.protocols,
    "/checklists": COUNTS.checklists,
  };

  const onDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const next = [...favorites];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    reorderFavs(next);
    setDragIdx(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <ReviewAlert />

      {/* ── Héros épuré : marque + recherche + CTA unique ── */}
      <section className="relative flex flex-col items-center gap-3 rounded-3xl border border-line bg-surface px-4 py-6 sm:py-8">
        <span
          className="rounded-full px-3 py-1 text-[11px] font-black tracking-wide"
          style={{ color: "var(--accent)", background: "var(--accent-soft)" }}
        >
          v{APP_VERSION} · {lang === "ar" ? "يعمل دون إنترنت" : "100 % hors-ligne"}
        </span>
        <h1 className="text-center text-3xl font-black tracking-tight sm:text-4xl">{t("app.name")}</h1>
        <p className="max-w-md text-center text-sm opacity-70 sm:text-base">{t("home.tag")}</p>
        <div className="w-full max-w-xl">
          <SearchBar big />
        </div>
        <button
          onClick={() => setEmergencyOpen(true)}
          className="sos-pulse touch mt-1 gap-3 rounded-2xl bg-red-600 px-8 py-4 text-lg font-black text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500 hover:shadow-red-500/40 active:scale-95"
        >
          <Siren className="h-7 w-7" aria-hidden />
          {t("emergency.open")}
        </button>
      </section>

      {/* ── v15.0 — المريض النشط: يظهر حيث يلزم ── */}
      <ActivePatient />

      {/* ── v15.0 — الثيمات الخمسة: الوجهة الوحيدة للمحتوى العلمي ── */}
      <section aria-labelledby="themes">
        <SectionTitle id="themes">{lang === "ar" ? "الثيمات" : "Thèmes"}</SectionTitle>
        <ul className="grid gap-3">
          {THEMES.map(({ href, key, sub, Icon, count }) => (
            <li key={href}>
              <Link
                href={href}
                className="card quick-tile flex min-h-[76px] items-center gap-3.5 rounded-2xl border border-line bg-surface p-4 font-bold hover:border-blue-600/50"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: "var(--accent-soft)", color: "var(--accent)" }} aria-hidden>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] leading-tight">{t(key)}</span>
                  <span className="mt-0.5 block text-xs opacity-60" dir={lang === "ar" ? "ltr" : "rtl"}>{lang === "ar" ? sub.ar : sub.fr}</span>
                </span>
                <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-black tabular-nums" style={{ background: "var(--accent-soft)", color: "var(--accent)" }} dir="ltr">
                  {counts[href] || count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── v15.0 — شبكة الأدوات: بلا تبويب، نقرة واحدة من الرئيسية ── */}
      <section aria-labelledby="outils">
        <SectionTitle id="outils">{lang === "ar" ? "الأدوات" : "Outils"}</SectionTitle>
        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-4">
          {TOOLS.map(({ href, Icon, fr, ar }) => (
            <Link
              key={href}
              href={href}
              className="card quick-tile flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-surface p-2.5 text-center font-bold hover:border-blue-600/50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--accent-soft)", color: "var(--accent)" }} aria-hidden>
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[11px] leading-tight">{lang === "ar" ? ar : fr}</span>
            </Link>
          ))}
        </div>
      </section>

      <InstallPwa variant="banner" />

      {/* ── Favoris (glisser pour réordonner) ── */}
      <section aria-labelledby="fav">
        <SectionTitle id="fav" icon={<Star className="h-5 w-5 text-amber-400" aria-hidden />}>
          {t("home.favorites")}
        </SectionTitle>
        {favItems.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-4 text-sm opacity-70">{t("home.emptyFav")}</p>
        ) : (
          <ul className="flex gap-2 overflow-x-auto pb-1">
            {favItems.map((item, i) =>
              item ? (
                <li
                  key={item.key}
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(i)}
                  className="flex shrink-0 items-center gap-2 rounded-xl border border-line bg-surface"
                >
                  <span className="touch cursor-grab px-1 opacity-50" aria-hidden>
                    <GripVertical className="h-5 w-5" />
                  </span>
                  <Link href={item.href} className="flex-1 py-3 font-medium hover:text-blue-500">
                    {lang === "ar" ? item.title.ar : item.title.fr}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        )}
      </section>

      {/* ── Récents ── */}
      {recentItems.length > 0 && (
        <section aria-labelledby="rec">
          <SectionTitle id="rec">{t("home.recent")}</SectionTitle>
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

      {/* ── Numéros d'urgence Tunisie (sécurité : reste sur l'Accueil) ── */}
      <section aria-labelledby="num" className="card rounded-2xl border border-line bg-surface p-4">
        <SectionTitle id="num" icon={<Phone className="h-5 w-5 text-red-500" aria-hidden />}>
          {t("home.numbers")}
        </SectionTitle>
        <ul className="grid gap-2">
          {emergencyNumbers.map((n) => (
            <li key={n.number}>
              <a
                href={`tel:${n.number.replace(/\s/g, "")}`}
                className="touch flex items-center justify-between rounded-xl bg-surface2 px-4 py-3 hover:bg-blue-600 hover:text-white"
              >
                <span className="font-medium">
                  {lang === "ar" ? n.service.ar : n.service.fr}
                  {n.note && <span className="ms-2 text-xs opacity-60">({lang === "ar" ? n.note.ar : n.note.fr})</span>}
                </span>
                <span dir="ltr" className="ms-3 shrink-0 whitespace-nowrap text-xl font-black tabular-nums text-red-500">{n.number}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

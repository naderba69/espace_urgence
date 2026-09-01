"use client";
// Brûlures : règle des 9 cliquable (adulte) + Parkland. Lund-Browder pédiatrique en repère.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";
import { parklandRates } from "@/lib/calc";
import { Info } from "lucide-react";

// Zones face/dos (règle de Wallace adulte) — ids stables pour l'état
const ZONES = [
  { id: "teteF", fr: "Tête (face)", ar: "الرأس (أمام)", pct: 4.5, side: "front" },
  { id: "thoraxF", fr: "Thorax-abdomen (face)", ar: "صدر-بطن (أمام)", pct: 18, side: "front" },
  { id: "brasGF", fr: "Bras gauche (face)", ar: "ذراع يسرى (أمام)", pct: 4.5, side: "front" },
  { id: "brasDF", fr: "Bras droit (face)", ar: "ذراع يمنى (أمام)", pct: 4.5, side: "front" },
  { id: "jambeGF", fr: "Jambe gauche (face)", ar: "ساق يسرى (أمام)", pct: 9, side: "front" },
  { id: "jambeDF", fr: "Jambe droite (face)", ar: "ساق يمنى (أمام)", pct: 9, side: "front" },
  { id: "perinee", fr: "Périnée", ar: "عجان", pct: 1, side: "front" },
  { id: "teteB", fr: "Tête (dos)", ar: "الرأس (خلف)", pct: 4.5, side: "back" },
  { id: "dosB", fr: "Dos (tronc postérieur)", ar: "ظهر (جذع خلفي)", pct: 18, side: "back" },
  { id: "brasGB", fr: "Bras gauche (dos)", ar: "ذراع يسرى (خلف)", pct: 4.5, side: "back" },
  { id: "brasDB", fr: "Bras droit (dos)", ar: "ذراع يمنى (خلف)", pct: 4.5, side: "back" },
  { id: "jambeGB", fr: "Jambe gauche (dos)", ar: "ساق يسرى (خلف)", pct: 9, side: "back" },
  { id: "jambeDB", fr: "Jambe droite (dos)", ar: "ساق يمنى (خلف)", pct: 9, side: "back" },
] as const;

export default function BruluresPage() {
  const { t, lang } = useApp();
  const [burnt, setBurnt] = useState<Set<string>>(new Set());
  const [weight, setWeight] = useState("70");
  const [sinceHours, setSinceHours] = useState("0");
  useRegisterRecent("calculateur:brulures");

  const toggle = (id: string) => {
    setBurnt((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    trackEvent("calculator_use", { id: "brulures" });
  };

  const tbsa = ZONES.filter((z) => burnt.has(z.id)).reduce((s, z) => s + z.pct, 0);
  const kg = Number(weight);
  const pr = parklandRates(kg, tbsa, Number(sinceHours) || 0);
  const park24 = pr.first8h + pr.next16h;
  const first8h = pr.first8h;
  const next16h = pr.next16h;
  const remaining8h = pr.remainingFirst;
  const firstRate = pr.firstRate;
  const secondRate = pr.secondRate;

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Brûlures — surface & Parkland" ar="الحروق — المساحة وباركلاند" /></h1>
        <PrintButton />
      </header>

      {/* Règle des 9 — listes cliquables face/dos (lisible et fiable sur mobile) */}
      <div className="card rounded-2xl border border-line bg-surface p-4">
        <p className="mb-3 font-bold text-teal-500"><T fr="Toucher les zones brûlées (adulte — règle des 9)" ar="المس المناطق المحروقة (كبير — قاعدة التسعات)" /></p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["front", "back"] as const).map((side) => (
            <div key={side}>
              <p className="mb-2 text-center text-sm font-bold uppercase tracking-wide opacity-60">
                {side === "front" ? (lang === "ar" ? "الأمام" : "Face") : (lang === "ar" ? "الخلف" : "Dos")}
              </p>
              <div className="grid gap-2">
                {ZONES.filter((z) => z.side === side).map((z) => {
                  const on = burnt.has(z.id);
                  return (
                    <button key={z.id} onClick={() => toggle(z.id)} aria-pressed={on}
                      className={`touch justify-between rounded-xl border px-3 py-3 text-start font-semibold ${on ? "border-orange-500 bg-orange-600 text-white" : "border-line hover:bg-surface2"}`}>
                      <span>{lang === "ar" ? z.ar : z.fr}</span>
                      <span className="tabular-nums">{z.pct}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-orange-600 p-4 text-center text-white">
          <p className="text-sm font-semibold opacity-90"><T fr="Surface brûlée estimée" ar="المساحة المحروقة المقدرة" /></p>
          <p className="text-4xl font-black tabular-nums">{tbsa}% SC</p>
        </div>
        <p className="mt-3 flex gap-2 rounded-xl bg-amber-500/10 p-3 text-sm text-amber-500">
          <Info className="h-5 w-5 shrink-0" aria-hidden />
          <T fr="Enfant : la tête est proportionnellement plus grande (Lund-Browder — ex. nourrisson tête ≈19 %, jambes réduites) — vérifier avec la table de référence pédiatrique."
             ar="الطفل: الرأس أكبر نسبياً (لند-براودر — رضيع: رأس ≈19%، ساقان أصغر) — تحقق بجدول المرجع." />
        </p>
      </div>

      {/* Parkland */}
      <div className="card rounded-2xl border border-line bg-surface p-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1 font-semibold sm:max-w-xs">
          {t("common.weight")}
          <input type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)}
            className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
        </label>
        <label className="flex flex-col gap-1 font-semibold sm:max-w-xs">
          {lang === "ar" ? "ساعات منذ الحرق" : "Heures écoulées depuis la brûlure"}
          <input type="number" min="0" inputMode="decimal" value={sinceHours} onChange={(e) => setSinceHours(e.target.value)}
            className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
        </label>

        {tbsa > 0 && kg > 0 && (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-sky-700 p-4 text-center text-white">
              <p className="text-xs font-semibold opacity-90">Parkland / 24 h</p>
              <p className="text-2xl font-black tabular-nums">{Math.round(park24)} mL</p>
              <p className="text-xs opacity-80">4 mL × {kg} kg × {tbsa}%</p>
            </div>
            <div className="rounded-2xl bg-teal-600 p-4 text-center text-white">
              <p className="text-xs font-semibold opacity-90"><T fr="1ères 8 h (la moitié)" ar="أول 8 س (النصف)" /></p>
              <p className="text-2xl font-black tabular-nums">{Math.round(first8h)} mL</p>
              <p className="text-xs opacity-80">≈ {Math.round(firstRate)} mL/h ({lang === "ar" ? "المتبقي" : "restant"} {remaining8h} h)</p>
            </div>
            <div className="rounded-2xl bg-surface2 p-4 text-center border border-line">
              <p className="text-xs font-semibold opacity-90"><T fr="16 h suivantes" ar="الـ16 س التالية" /></p>
              <p className="text-2xl font-black tabular-nums">{Math.round(next16h)} mL</p>
              <p className="text-xs opacity-80">≈ {Math.round(secondRate)} mL/h</p>
            </div>
          </div>
        )}
        <p className="text-xs opacity-60">
          <T fr="Parkland = point de départ ; adapter à la diurèse (cible 0,5–1 mL/kg/h adulte). Seuil habituel : >20 % adulte, >10–15 % enfant. Solution : Ringer lactate."
             ar="باركلاند نقطة انطلاق؛ كيّف مع البيلة (الهدف 0.5–1 مل/كغ/س). العتبة: >20% كبير، >10–15% طفل. المحلول: رينغر لاكتات." />
        </p>
      </div>
      <p className="text-xs opacity-60">{t("common.disclaimer")}</p>
    </div>
  );
}

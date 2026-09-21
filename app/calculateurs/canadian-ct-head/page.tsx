"use client";
// v7.9 — Canadian CT Head Rule : scanner ou pas après un traumatisme crânien léger ?
// (GCS 13-15 avec perte de connaissance/amnésie/confusion, < 24 h)
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";

const HIGH = [
  { id: "gcs", fr: "GCS < 15 à 2 h du trauma", ar: "GCS < 15 بعد ساعتين من الرض" },
  { id: "ouvert", fr: "Suspicion de fracture ouverte/déprimée", ar: "اشتباه كسر جمجمة مفتوح/منخسف" },
  { id: "base", fr: "Signe de fracture de la base (yeux de raton laveur, Battle, LCR)", ar: "علامات كسر القاعدة (عيون الراكون، Battle، سائل نخاعي)" },
  { id: "vomis", fr: "≥ 2 épisodes de vomissements", ar: "إقياءان أو أكثر" },
  { id: "age", fr: "Âge ≥ 65 ans", ar: "العمر ≥ 65" },
];

const MEDIUM = [
  { id: "amn", fr: "Amnésie rétrograde ≥ 30 min", ar: "فقد ذاكرة رجعي ≥ 30 د" },
  { id: "mecanisme", fr: "Mécanisme dangereux (piéton vs véhicule, éjection, chute > 1 m / 5 marches)", ar: "آلية خطرة (راجل ضد مركبة، قذف، سقوط > 1 م)" },
];

export default function CanadianCtHeadPage() {
  const { lang } = useApp();
  const [high, setHigh] = useState<Set<string>>(new Set());
  const [med, setMed] = useState<Set<string>>(new Set());
  useRegisterRecent("calculateur:canadian-ct-head");

  const toggle = (set: Set<string>, id: string, apply: (s: Set<string>) => void) => {
    const n = new Set(set);
    if (n.has(id)) { n.delete(id); } else { n.add(id); }
    apply(n);
    trackEvent("calculator_use", { id: "canadian-ct-head" });
  };

  const verdict = high.size > 0 || med.size > 0
    ? high.size > 0
      ? { cls: "bg-red-600", fr: "SCANNER CÉRÉBRAL INDIQUÉ (risque élevé)", ar: "ماسح دماغي مطلوب (خطر عالٍ)" }
      : { cls: "bg-amber-500", fr: "SCANNER CÉRÉBRAL INDIQUÉ (risque modéré)", ar: "ماسح دماغي مطلوب (خطر متوسط)" }
    : { cls: "bg-blue-600", fr: "PAS de scanner — observation clinique suffisante (risque < 1 %)", ar: "لا ماسح — مراقبة سريرية كافية (خطر < 1%)" };

  const rows = (list: typeof HIGH, set: Set<string>, apply: (s: Set<string>) => void, danger: boolean) =>
    list.map((r) => {
      const on = set.has(r.id);
      return (
        <button key={r.id} role="checkbox" aria-checked={on} onClick={() => toggle(set, r.id, apply)}
          className={`touch rounded-xl border px-4 py-3 text-start text-sm font-semibold ${on ? danger ? "border-red-600 bg-red-600/15 text-red-400" : "border-amber-500 bg-amber-500/15 text-amber-400" : "border-line hover:bg-surface2"}`}>
          <T fr={r.fr} ar={r.ar} />
        </button>
      );
    });

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <header>
        <h1 className="text-2xl font-extrabold"><T fr="Canadian CT Head — trauma crânien léger" ar="ماسح الرأس الكندي — رض خفيف" /></h1>
        <p className="mt-1 text-sm opacity-70">
          <T fr="GCS 13-15 + perte de connaissance/amnésie/confusion, dans les 24 h. Sensibilité ~100 % pour les lésions nécessitant une intervention." ar="GCS 13-15 + فقد وعي/ذاكرة/تخليط، خلال 24 س. حساسية ~100% للإصابات التي تتطلب تدخلاً." />
        </p>
      </header>

      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-black uppercase tracking-wide text-red-500"><T fr="Haut risque (un seul ⇒ scanner)" ar="خطر عالٍ (واحد ⇒ ماسح)" /></p>
          {rows(HIGH, high, setHigh, true)}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-black uppercase tracking-wide text-amber-500"><T fr="Risque modéré (un seul ⇒ scanner)" ar="خطر متوسط (واحد ⇒ ماسح)" /></p>
          {rows(MEDIUM, med, setMed, false)}
        </div>
        <div className={`rounded-2xl p-5 text-center text-lg font-black text-white ${verdict.cls}`}>
          {lang === "ar" ? verdict.ar : verdict.fr}
        </div>
        <p className="text-xs opacity-60">
          <T fr="Ne s'applique pas si: GCS ≤ 12, crise comitiale, déficit focal, trouble de coagulation/anticoagulants (⇒ scanner systématique)." ar="لا ينطبق إذا: GCS ≤ 12، نوبة، عجز بؤري، اضطراب تخثر/مميعات (⇒ ماسح منهجي)." />
        </p>
      </div>
    </div>
  );
}

"use client";
// HAS-BLED — risque hémorragique sous anticoagulation (FA).
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { hasBledHighRisk } from "@/lib/calc";
import { trackEvent } from "@/lib/analytics";
import { Info } from "lucide-react";
import type { Localized } from "@/data/types";

const ITEMS: { id: string; label: Localized }[] = [
  { id: "hta", label: { fr: "HTA (PAS >160 mmHg)", ar: "ارتفاع ضغط (انقباضي >160)" } },
  { id: "rein", label: { fr: "Rein anormal (dialyse, créat ≥200 µmol/L)", ar: "كلى غير طبيعية (غسيل، كرياتينين ≥200)" } },
  { id: "foie", label: { fr: "Foie anormal (cirrhose, bilirubine ×2…)", ar: "كبد غير طبيعي (تليف، بيليروبين ×2…)" } },
  { id: "avc", label: { fr: "Antécédent d'AVC", ar: "قصة جلطة دماغية" } },
  { id: "saign", label: { fr: "Antécédent de saignement majeur", ar: "قصة نزف كبير" } },
  { id: "inr", label: { fr: "INR labile", ar: "INR غير مستقر" } },
  { id: "age", label: { fr: "> 65 ans", ar: ">65 سنة" } },
  { id: "drogues", label: { fr: "Médicaments à risque (antiagré., AINS)", ar: "أدوية خطرة (مضاد صفيحات، مضاد التهاب)" } },
  { id: "alcool", label: { fr: "Alcool (≥8 verres/sem.)", ar: "كحول (≥8 كؤوس/أسبوع)" } },
];

export default function HasBledPage() {
  const { t, lang } = useApp();
  const [on, setOn] = useState<Set<string>>(new Set());
  useRegisterRecent("calculateur:has-bled");
  const score = on.size;
  const high = hasBledHighRisk(score);

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">HAS‑BLED</h1>
        <PrintButton />
      </header>

      <div className="card flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        {ITEMS.map((it) => {
          const isOn = on.has(it.id);
          return (
            <button key={it.id} role="checkbox" aria-checked={isOn}
              onClick={() => { setOn((p) => { const n = new Set(p); isOn ? n.delete(it.id) : n.add(it.id); return n; }); trackEvent("calculator_use", { id: "has-bled" }); }}
              className={`touch justify-between gap-3 rounded-xl border px-4 py-3 text-start font-semibold ${isOn ? "border-teal-600 bg-teal-600/15 text-teal-400" : "border-line hover:bg-surface2"}`}>
              <span><T fr={it.label.fr} ar={it.label.ar} /></span>
              <span className="tabular-nums font-black text-teal-500">+1</span>
            </button>
          );
        })}

        <div className={`mt-2 rounded-2xl p-5 text-center text-white ${high ? "bg-red-600" : "bg-teal-600"}`}>
          <p className="text-sm font-semibold opacity-90">{t("common.result")}</p>
          <p className="text-5xl font-black tabular-nums">{score}/9</p>
          <p className="mt-2 font-bold">
            {high
              ? (lang === "ar" ? "خطر نزف مرتفع (≥3) — عوامل قابلة للتصحيح + متابعة لصيقة" : "Risque hémorragique élevé (≥3) — corriger les facteurs modifiables + suivi rapproché")
              : (lang === "ar" ? "خطر نزف منخفض-متوسط (0–2)" : "Risque hémorragique faible-modéré (0–2)")}
          </p>
        </div>
        <p className="flex gap-2 rounded-xl bg-amber-500/10 p-3 text-sm text-amber-500">
          <Info className="h-5 w-5 shrink-0" aria-hidden />
          <T fr="HAS-BLED n'est PAS une contre-indication à l'anticoagulation : il cible les facteurs à corriger."
             ar="HAS-BLED ليس مانعاً للتسييل: يكشف العوامل القابلة للتصحيح." />
        </p>
        <button onClick={() => setOn(new Set())} className="touch self-start rounded-xl border border-line px-5 py-2 font-semibold hover:bg-surface2">{t("common.reset")}</button>
      </div>
      <p className="text-xs opacity-60">{t("common.disclaimer")}</p>
    </div>
  );
}

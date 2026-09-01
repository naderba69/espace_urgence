"use client";
// ACD (ADA) : 0,1 U/kg bolus (optionnel) + 0,1 U/kg/h ; insuline SEULEMENT si K ≥ 3,3.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { insulinDka, dkaPotassiumAction } from "@/lib/calc";
import { trackEvent } from "@/lib/analytics";

const PRESETS = [
  { label: "50 U / 50 mL (seringue)", labelAr: "50 وحدة / 50 مل (محقة)", perMl: 1 },
  { label: "100 U / 100 mL", labelAr: "100 وحدة / 100 مل", perMl: 1 },
];

export default function InsulinePage() {
  const { t } = useApp();
  const [weight, setWeight] = useState("70");
  const [k, setK] = useState("4.5");
  const [perMl, setPerMl] = useState(1);
  useRegisterRecent("calculateur:insuline");

  const kg = Number(weight);
  const kv = Number(k);
  const ins = kg > 0 ? insulinDka(kg, perMl) : null;
  const kAction = kv > 0 ? dkaPotassiumAction(kv) : null;

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="ACD — insuline IV" ar="الحماض الكيتوني — إنسولين وريدي" /></h1>
        <PrintButton />
      </header>

      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 font-semibold">
            {t("common.weight")}
            <input type="number" inputMode="decimal" value={weight}
              onChange={(e) => { setWeight(e.target.value); trackEvent("calculator_use", { id: "insuline" }); }}
              className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-2xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
          </label>
          <label className="flex flex-col gap-1 font-semibold">
            {t("common.k")} (mmol/L)
            <input type="number" inputMode="decimal" step="0.1" value={k} onChange={(e) => setK(e.target.value)}
              className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-2xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
          </label>
        </div>

        {kAction === "hold-insulin" && (
          <p className="rounded-xl border-2 border-red-600 bg-red-600/10 p-3 text-center font-extrabold text-red-500">
            <T fr="K < 3,3 → PAS d'insuline : corriger le potassium d'abord (risque d'arythmie/hypoK majeure)"
               ar="البوتاسيوم < 3.3 ← لا إنسولين: صحّح البوتاسيوم أولاً (خطر اضطراب النظم)" />
          </p>
        )}
        {kAction === "add-k" && (
          <p className="rounded-xl border border-amber-500 bg-amber-500/10 p-3 text-center font-bold text-amber-500">
            <T fr="K 3,3–5,2 → démarrer l'insuline MAIS ajouter 20–30 mmol K/L de soluté"
               ar="بوتاسيوم 3.3–5.2 ← ابدأ الإنسولين مع إضافة 20–30 ملي مول K/لتر" />
          </p>
        )}

        <div className="flex flex-wrap gap-2" role="group" aria-label="concentration">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => setPerMl(p.perMl)} aria-pressed={perMl === p.perMl}
              className={`touch flex-1 rounded-xl border px-4 py-3 font-bold ${perMl === p.perMl ? "border-teal-600 bg-teal-600 text-white" : "border-line hover:bg-surface2"}`}>
              <T fr={p.label} ar={p.labelAr} />
              <span className="block text-xs opacity-70">{p.perMl} U/mL</span>
            </button>
          ))}
        </div>

        {ins && ins.rateUh > 0 && kAction !== "hold-insulin" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-sky-700 p-4 text-center text-white">
              <p className="text-xs font-semibold opacity-90"><T fr="Bolus optionnel (0,1 U/kg)" ar="دفعة اختيارية (0.1 وحدة/كغ)" /></p>
              <p className="text-3xl font-black tabular-nums">{Math.round(ins.bolusU * 10) / 10} U</p>
              <p className="text-xs opacity-80">= {Math.round((ins.bolusU / perMl) * 10) / 10} mL</p>
            </div>
            <div className="rounded-2xl bg-teal-600 p-4 text-center text-white">
              <p className="text-xs font-semibold opacity-90"><T fr="Perfusion (0,1 U/kg/h)" ar="التسريب (0.1 وحدة/كغ/س)" /></p>
              <p className="text-3xl font-black tabular-nums">{Math.round(ins.rateUh * 10) / 10} U/h</p>
              <p className="text-xs opacity-80">= {Math.round(ins.rateMlH * 10) / 10} mL/h ({perMl} U/mL)</p>
            </div>
          </div>
        )}

        <ul className="list-disc space-y-1 ps-5 text-sm opacity-70">
          <li><T fr="Bas insulinémique cible : 2,75–3,9 mmol/L/h ; glycémie à 1 h puis 1/h." ar="الهدف: نزول السكر 2.75–3.9 ملي مول/ل/س؛ قياس كل ساعة." /></li>
          <li><T fr="Glycémie < 2 g/L → passer à G5 % + adapter l'insuline jusqu'à résolution de la cétose." ar="< 2 غ/ل ← G5% مع تكييف الإنسولين حتى زوال الأجسام الكيتونية." /></li>
          <li><T fr="Hydratation NaCl 0,9 % 15–20 mL/kg la 1ʳᵉ heure (protocole ACD complet)." ar="ترطيب NaCl 0.9% بـ15–20 مل/كغ في الساعة الأولى." /></li>
        </ul>
      </div>
      <p className="text-xs opacity-60">{t("common.disclaimer")}</p>
    </div>
  );
}

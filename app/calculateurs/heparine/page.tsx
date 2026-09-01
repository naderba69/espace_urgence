"use client";
// Héparine non fractionnée : bolus U/kg + débit initial (nomogramme classique) selon concentration réelle.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { heparin } from "@/lib/calc";
import { trackEvent } from "@/lib/analytics";

const PRESETS = [
  { label: "25 000 U / 500 mL", perMl: 50 },
  { label: "25 000 U / 250 mL", perMl: 100 },
];

export default function HeparinePage() {
  const { t, lang } = useApp();
  const [weight, setWeight] = useState("70");
  const [perMl, setPerMl] = useState(100);
  useRegisterRecent("calculateur:heparine");

  const kg = Number(weight);
  const h = kg > 0 ? heparin(kg, 80, 8000, 18, perMl) : null;

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Héparine IV — bolus & débit" ar="هيبارين وريدي — الدفعة والتدفق" /></h1>
        <PrintButton />
      </header>

      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        <label className="flex flex-col gap-1 font-semibold">
          {t("common.weight")}
          <input type="number" inputMode="decimal" value={weight}
            onChange={(e) => { setWeight(e.target.value); trackEvent("calculator_use", { id: "heparine" }); }}
            className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-2xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="concentration">
          {PRESETS.map((p) => (
            <button key={p.perMl} onClick={() => setPerMl(p.perMl)} aria-pressed={perMl === p.perMl}
              className={`touch flex-1 rounded-xl border px-4 py-3 font-bold ${perMl === p.perMl ? "border-teal-600 bg-teal-600 text-white" : "border-line hover:bg-surface2"}`}>
              {p.label}
              <span className="block text-xs opacity-70">{p.perMl} U/mL</span>
            </button>
          ))}
        </div>

        {h && h.bolusU > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-sky-700 p-4 text-center text-white">
              <p className="text-xs font-semibold opacity-90"><T fr="Bolus (80 U/kg, max 8000)" ar="الدفعة (80 وحدة/كغ، أقصى 8000)" /></p>
              <p className="text-3xl font-black tabular-nums">{Math.round(h.bolusU)} U</p>
              <p className="text-xs opacity-80">= {Math.round(h.bolusU / perMl * 10) / 10} mL</p>
            </div>
            <div className="rounded-2xl bg-teal-600 p-4 text-center text-white">
              <p className="text-xs font-semibold opacity-90"><T fr="Débit initial (18 U/kg/h)" ar="التدفق الابتدائي (18 وحدة/كغ/س)" /></p>
              <p className="text-3xl font-black tabular-nums">{Math.round(h.rateUh)} U/h</p>
              <p className="text-xs opacity-80">= {Math.round(h.rateMlH * 10) / 10} mL/h ({perMl} U/mL)</p>
            </div>
          </div>
        )}

        <p className="text-sm opacity-70">
          <T fr="Nomogramme classique : TCA à 6 h puis ajustement (cible 1,5–2,2× témoin ou anti-Xa 0,3–0,7). Inversion : sulfate de protamine."
             ar="المنحنى المعتاد: TCA بعد 6 س ثم معايرة (الهدف 1.5–2.2× المرجع). العكس: بروتامين." />
        </p>
      </div>
      <p className="text-xs opacity-60">{t("common.disclaimer")}</p>
    </div>
  );
}

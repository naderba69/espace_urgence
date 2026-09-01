"use client";
// Correction d'hyponatrémie : Adrogué-Madias + débit max sûr (≤0,5 mmol/L/h → ODS).
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { adrogueMadias, totalBodyWater, maxCorrectionRate } from "@/lib/calc";
import { trackEvent } from "@/lib/analytics";
import { AlertTriangle } from "lucide-react";

const FLUIDS = [
  { id: "ns", label: "NaCl 0,9 %", na: 154, k: 0 },
  { id: "hl", label: "Ringer lactate", na: 130, k: 4 },
  { id: "nacl3", label: "NaCl 3 % (hypertonique)", na: 513, k: 0 },
  { id: "nacl5", label: "NaCl 5 %", na: 855, k: 0 },
];

export default function SodiumPage() {
  const { t, lang } = useApp();
  const [na, setNa] = useState("120");
  const [weight, setWeight] = useState("70");
  const [factor, setFactor] = useState(0.6);
  const [fluid, setFluid] = useState(FLUIDS[2].id);
  useRegisterRecent("calculateur:sodium");

  const serumNa = Number(na);
  const kg = Number(weight);
  const f = FLUIDS.find((x) => x.id === fluid)!;
  const tbw = kg > 0 ? totalBodyWater(kg, factor) : 0;
  const deltaPerL = serumNa > 0 && tbw > 0 ? adrogueMadias(serumNa, f.na, f.k, tbw) : 0;
  const safeRate = maxCorrectionRate(deltaPerL, 0.5);

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Correction du sodium (Adrogué-Madias)" ar="تصحيح الصوديوم (أدروغيه-مادياس)" /></h1>
        <PrintButton />
      </header>

      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Na⁺ {lang === "ar" ? "السيرومي" : "sérique"} (mmol/L)
            <input type="number" inputMode="decimal" value={na} onChange={(e) => { setNa(e.target.value); trackEvent("calculator_use", { id: "sodium" }); }}
              className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            {t("common.weight")}
            <input type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)}
              className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
          </label>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="facteur TBW">
          {[
            { v: 0.6, fr: "Homme", ar: "ذكر" },
            { v: 0.5, fr: "Femme", ar: "أنثى" },
            { v: 0.5, fr: "Homme âgé", ar: "ذكر مسن" },
            { v: 0.45, fr: "Femme âgée", ar: "أنثى مسنة" },
          ].map((o) => (
            <button key={o.fr} onClick={() => setFactor(o.v)} aria-pressed={factor === o.v}
              className={`touch rounded-xl border px-3 py-2 text-sm font-bold ${factor === o.v ? "border-teal-600 bg-teal-600 text-white" : "border-line hover:bg-surface2"}`}>
              {lang === "ar" ? o.ar : o.fr}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="solute">
          {FLUIDS.map((fl) => (
            <button key={fl.id} onClick={() => setFluid(fl.id)} aria-pressed={fluid === fl.id}
              className={`touch rounded-xl border px-3 py-2 text-sm font-bold ${fluid === fl.id ? "border-teal-600 bg-teal-600 text-white" : "border-line hover:bg-surface2"}`}>
              {fl.label}
              <span className="ms-1 text-xs opacity-70">Na {fl.na}</span>
            </button>
          ))}
        </div>

        {deltaPerL > 0 && (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-surface2 border border-line p-4 text-center">
              <p className="text-xs font-semibold opacity-70"><T fr="Eau totale" ar="الماء الكلي" /></p>
              <p className="text-2xl font-black tabular-nums">{Math.round(tbw)} L</p>
            </div>
            <div className="rounded-2xl bg-sky-700 p-4 text-center text-white">
              <p className="text-xs font-semibold opacity-90">ΔNa⁺ <T fr="par litre" ar="لكل لتر" /></p>
              <p className="text-2xl font-black tabular-nums">+{deltaPerL.toFixed(1)} <span className="text-sm">mmol/L</span></p>
            </div>
            <div className="rounded-2xl bg-teal-600 p-4 text-center text-white">
              <p className="text-xs font-semibold opacity-90"><T fr="Débit max sûr" ar="أقصى تدفق آمن" /></p>
              <p className="text-2xl font-black tabular-nums">{Math.round(safeRate)} mL/h</p>
              <p className="text-xs opacity-80">= +0,5 mmol/L/h max</p>
            </div>
          </div>
        )}

        <p className="flex gap-2 rounded-xl bg-red-500/15 p-3 text-sm font-bold text-red-400">
          <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
          <T fr="JAMAIS plus de 8–10 mmol/L par 24 h : myélinolyse pontique (ODS). Contrôler Na⁺ toutes les 2–4 h. Si symptomes sévères (convulsions, coma) : projection rapide 3 % 100–150 mL/10 min ×2–3, cible +4–6 mmol/L, puis limitation."
             ar="لا تتجاوز أبداً 8–10 مليمول/ل في 24 ساعة: انحلال الميالين الجسري! قِس Na كل 2–4 س. عند أعراض شديدة (اختلاج/غيبوبة): 3% بـ100–150 مل /10 د ×2–3، الهدف +4–6، ثم الإبطاء." />
        </p>
      </div>
      <p className="text-xs opacity-60">{t("common.disclaimer")}</p>
    </div>
  );
}

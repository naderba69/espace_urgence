"use client";
// Palier de vitesse PSE : sélection d'une préparation standard → mL/h prêts à l'emploi.
import { useEffect, useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import { PrintButton } from "@/components/Chrome";
import T from "@/components/T";
import { PERFUSIONS, perfusionFlow, type PerfusionPreset } from "@/data/perfusions";
import { getMedication } from "@/data/medications";
import { trackEvent } from "@/lib/analytics";
import { readJSON, writeJSON } from "@/lib/storage";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

const STORE = "eutn:calc:perfusions";

export default function PerfusionsPage() {
  const { lang, hydrated } = useApp();
  const [idx, setIdx] = useState(0);
  const [weight, setWeight] = useState("70");
  const [dose, setDose] = useState(0);
  useRegisterRecent("calculateur:perfusions");

  useEffect(() => {
    if (!hydrated) return;
    const saved = readJSON<{ idx: number; weight: string; dose: number }>(STORE, null as never);
    if (saved) { setIdx(saved.idx ?? 0); setWeight(saved.weight ?? "70"); setDose(saved.dose || 0); }
  }, [hydrated]);
  useEffect(() => {
    if (hydrated) writeJSON(STORE, { idx, weight, dose });
  }, [idx, weight, dose, hydrated]);

  const p: PerfusionPreset = PERFUSIONS[idx];
  const w = Number(weight);
  const currentDose = dose > 0 ? dose : (p.doseStart ?? p.doseMin);
  const doseClamped = Math.min(Math.max(currentDose, p.doseMin), p.doseMax);
  const flow = p.weightBased ? perfusionFlow(p, doseClamped, w) : perfusionFlow(p, doseClamped, 1);
  const med = getMedication(p.drugId);

  const pick = (i: number) => {
    setIdx(i);
    setDose(0); // reset to preset start
    trackEvent("calculator_use", { id: "perfusions", preset: PERFUSIONS[i].drugId });
  };

  const fmtMlH = (x: number) => (x >= 100 ? Math.round(x).toString() : (Math.round(x * 10) / 10).toString());

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Vitesses PSE — paliers prêts" ar="سرعات المضخة — جاهزة" /></h1>
        <PrintButton />
      </header>

      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        {/* Choix de la préparation */}
        <label className="flex flex-col gap-1 font-semibold">
          <T fr="Préparation (poche/seringue standard)" ar="التحضير (جيب/محقنة قياسي)" />
          <select value={idx} onChange={(e) => pick(Number(e.target.value))}
            className="rounded-xl border border-line bg-surface2 px-3 py-3 text-base outline-none focus:ring-2 focus:ring-teal-600">
            {PERFUSIONS.map((x, i) => {
              const m = getMedication(x.drugId);
              return (
                <option key={i} value={i}>
                  {m ? (lang === "ar" ? m.name.ar : m.name.fr) : x.drugId} — {lang === "ar" ? x.prep.ar : x.prep.fr}
                </option>
              );
            })}
          </select>
        </label>

        {/* Poids si nécessaire */}
        {p.weightBased && (
          <label className="flex flex-col gap-1 font-semibold">
            <T fr="Poids (kg)" ar="الوزن (كغ)" />
            <input type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)}
              className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-2xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
          </label>
        )}

        {/* Tableau des paliers */}
        <div>
          <p className="mb-2 flex items-center justify-between font-semibold text-teal-500">
            <span>{lang === "ar" ? `الجرعة (${p.unit}) ← التدفق (مل/س)` : `Dose (${p.unit}) → débit (mL/h)`}</span>
            <span className="text-xs font-normal opacity-60">{lang === "ar" ? p.prep.ar : p.prep.fr}</span>
          </p>
          <div className="max-h-64 overflow-y-auto rounded-xl border border-line">
            <table className="w-full border-collapse text-center text-sm">
              <thead>
                <tr className="bg-surface2">
                  <th className="px-2 py-2 font-bold">{lang === "ar" ? `الجرعة (${p.unit})` : `Dose (${p.unit})`}</th>
                  <th className="px-2 py-2 font-bold">mL/h</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const rows: number[] = [];
                  const start = p.doseMin;
                  const step = p.doseStep;
                  // génère jusqu'à ~20 paliers lisibles
                  let val = start;
                  for (let i = 0; i < 24 && val <= p.doseMax + 1e-9; i++) {
                    rows.push(Math.round(val / step) * step);
                    val += step;
                  }
                  return rows.map((d) => {
                    const f = fmtMlH(perfusionFlow(p, d, p.weightBased ? w : 1));
                    return (
                      <tr key={d} className={Math.abs(d - doseClamped) < 1e-9 ? "bg-teal-600 text-white font-bold" : "odd:bg-surface2/50"}>
                        <td className="border-t border-line px-2 py-1.5 tabular-nums">{Math.round(d / step) * step}</td>
                        <td className="border-t border-line px-2 py-1.5 font-black tabular-nums">{f}</td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>

        {/* Saisie rapide d'une valeur intermédiaire */}
        <div className="flex items-end gap-2">
          <label className="flex flex-1 flex-col gap-1 text-sm font-semibold">
            {lang === "ar" ? `جرعة مخصصة (${p.unit})` : `Dose précise (${p.unit})`}
            <input type="number" inputMode="decimal" step={p.doseStep} value={dose || ""} placeholder={String(p.doseStart ?? "")}
              onChange={(e) => setDose(Number(e.target.value))}
              className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
          </label>
          <div className="rounded-xl bg-teal-600 px-5 py-3 text-center text-white">
            <p className="text-xs opacity-90">{lang === "ar" ? "تدفق" : "débit"}</p>
            <p className="text-xl font-black tabular-nums">{fmtMlH(flow)} mL/h</p>
          </div>
        </div>

        {p.note && (
          <p className="flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-sm text-amber-600 dark:text-amber-400">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{lang === "ar" ? p.note.ar : p.note.fr}</span>
          </p>
        )}

        {med && (
          <Link href={`/medicaments/${med.id}`} className="flex items-center gap-1 self-end text-sm font-semibold text-teal-600 hover:underline dark:text-teal-400">
            <T fr="Fiche complète de la molécule" ar="بطاقة الدواء الكاملة" />
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </Link>
        )}
      </div>
      <p className="text-xs opacity-60">{lang === "ar" ? "تحقق دائماً من التخفيف والمعايرة بالمنشأة." : "Vérifiez toujours la dilution et la titration localement."}</p>
    </div>
  );
}

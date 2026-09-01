"use client";
// Dose d'adrénaline IM dans l'anaphylaxie (RCUK/ERC) — bandes d'âge + mode poids.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";
import { AlertTriangle } from "lucide-react";

const BANDS = [
  { id: "lt6m", fr: "< 6 mois", ar: "< 6 أشهر", ug: 125, ml: "0,1–0,15", note: { fr: "100–150 µg (0,1–0,15 mL)", ar: "100–150 مكغ (0.1–0.15 مل)" } },
  { id: "6m6a", fr: "6 mois – 6 ans", ar: "6 أشهر – 6 سنوات", ug: 150, ml: "0,15", note: { fr: "150 µg (0,15 mL)", ar: "150 مكغ (0.15 مل)" } },
  { id: "6a12a", fr: "6 – 12 ans", ar: "6 – 12 سنة", ug: 300, ml: "0,3", note: { fr: "300 µg (0,3 mL)", ar: "300 مكغ (0.3 مل)" } },
  { id: "adulte", fr: "> 12 ans / adulte", ar: "> 12 سنة / كبير", ug: 500, ml: "0,5", note: { fr: "500 µg (0,5 mL)", ar: "500 مكغ (0.5 مل)" } },
];

export default function DoseAnaphylaxiePage() {
  const { t, lang } = useApp();
  const [band, setBand] = useState(BANDS[3].id);
  const [weight, setWeight] = useState("");
  useRegisterRecent("calculateur:dose-anaphylaxie");

  const sel = BANDS.find((b) => b.id === band)!;
  const w = Number(weight);
  const weightDose = w > 0 ? Math.min(w * 0.01, 0.5) : null;

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Adrénaline IM — anaphylaxie" ar="أدرنالين عضلياً — أنفيلاكسي" /></h1>
        <PrintButton />
      </header>

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <p className="mb-3 font-semibold text-teal-500">{lang === "ar" ? "حسب العمر (RCUK/ERC)" : "Selon l'âge (RCUK/ERC)"}</p>
        <div className="grid grid-cols-2 gap-2">
          {BANDS.map((b) => (
            <button key={b.id} onClick={() => { setBand(b.id); trackEvent("calculator_use", { id: "dose-anaphylaxie" }); }} aria-pressed={band === b.id}
              className={`touch rounded-xl border px-3 py-4 font-bold ${band === b.id ? "border-orange-500 bg-orange-600 text-white" : "border-line hover:bg-surface2"}`}>
              {lang === "ar" ? b.ar : b.fr}
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-orange-600 p-5 text-center text-white">
          <p className="text-3xl font-black tabular-nums">{lang === "ar" ? sel.note.ar : sel.note.fr}</p>
          <p className="mt-1 text-sm opacity-90">
            <T fr="solution 1 mg/mL (1/1 000) — face antéro-latérale de la cuisse" ar="محلول 1 ملغ/مل — الوجه الأمامي الوحشي للفخذ" />
          </p>
        </div>
        <p className="mt-3 text-sm flex gap-2 rounded-xl bg-amber-500/10 p-3 text-amber-500">
          <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
          <T fr="Répéter après 5 min si non amélioré. COUCHER le patient (jambes surélevées)." ar="تُعاد بعد 5 د عند عدم التحسن. استلقاء مع رفع الساقين." />
        </p>
      </div>

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <p className="mb-2 font-semibold text-teal-500">{lang === "ar" ? "أو بالوزن (0.01 ملغ/كغ)" : "Ou selon le poids (0,01 mg/kg)"}</p>
        <div className="flex items-center gap-3">
          <input type="number" min="0" step="0.1" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)}
            placeholder={t("common.weight")}
            className="w-32 rounded-xl border border-line bg-surface2 px-3 py-3 text-xl text-center tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
          {weightDose !== null && (
            <p className="rounded-xl bg-teal-600 px-4 py-2 font-black text-white tabular-nums">
              {Math.round(weightDose * 1000)} µg <span className="text-sm font-semibold">({Math.round(weightDose * 100) / 100} mL)</span>
            </p>
          )}
        </div>
        <p className="mt-2 text-xs opacity-60"><T fr="Maximum 500 µg par injection IM." ar="أقصى 500 مكغ للحقنة العضلية الواحدة." /></p>
      </div>
    </div>
  );
}

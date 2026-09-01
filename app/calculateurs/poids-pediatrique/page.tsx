"use client";
// Poids estimé + repères pédiatriques dérivés (tube, défibrillation, adrénaline ACR).
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";
import { pediatricWeight, pediatricTubeSize, pediatricDefibJ, clampDose } from "@/lib/calc";
import { Info } from "lucide-react";

export default function PoidsPediaPage() {
  const { t, lang } = useApp();
  const [age, setAge] = useState("4");
  useRegisterRecent("calculateur:poids-pediatrique");

  const a = Number(age);
  const ok = a >= 0 && a <= 15;
  const poids = ok ? pediatricWeight(a) : NaN;
  const tube = ok ? pediatricTubeSize(a) : NaN;
  const defib = ok ? pediatricDefibJ(poids) : NaN;
  const adr = ok ? clampDose(0.01, poids, 1) : NaN;  // mg (max 1 mg)

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Poids pédiatrique estimé" ar="الوزن التقديري للطفل" /></h1>
        <PrintButton />
      </header>

      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        <label className="flex flex-col gap-1 font-semibold">
          {lang === "ar" ? "العمر (سنوات)" : "Âge (années)"}
          <input type="number" min="0" max="15" step="0.5" inputMode="decimal" value={age}
            onChange={(e) => { setAge(e.target.value); trackEvent("calculator_use", { id: "poids-pedia" }); }}
            className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-2xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
        </label>

        {ok && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-teal-600 p-4 text-center text-white">
              <p className="text-xs font-semibold opacity-90"><T fr="Poids (âge×2)+8" ar="الوزن (عمر×2)+8" /></p>
              <p className="text-3xl font-black tabular-nums">{poids} kg</p>
            </div>
            <div className="rounded-2xl bg-sky-700 p-4 text-center text-white">
              <p className="text-xs font-semibold opacity-90"><T fr="Sonde trachéale (âge/4)+4" ar="أنبوب قصبي (عمر/4)+4" /></p>
              <p className="text-3xl font-black tabular-nums">{Math.round(tube * 10) / 10} mm</p>
            </div>
            <div className="rounded-2xl bg-red-600 p-4 text-center text-white">
              <p className="text-xs font-semibold opacity-90"><T fr="Défibrillation 4 J/kg" ar="صدمة 4 جول/كغ" /></p>
              <p className="text-3xl font-black tabular-nums">{Math.round(defib)} J</p>
            </div>
            <div className="rounded-2xl bg-orange-600 p-4 text-center text-white">
              <p className="text-xs font-semibold opacity-90"><T fr="Adrénaline ACR 0,01 mg/kg" ar="أدرنالين الإنعاش 0.01 ملغ/كغ" /></p>
              <p className="text-3xl font-black tabular-nums">{Math.round(adr * 100) / 100} mg</p>
            </div>
          </div>
        )}

        <p className="flex gap-2 rounded-xl bg-amber-500/10 p-3 text-sm text-amber-500">
          <Info className="h-5 w-5 shrink-0" aria-hidden />
          <T fr="Estimation de référence — toute mesure réelle (balance, ruban de longueur) prime sur le calcul."
             ar="تقدير إرشادي — أي قياس حقيقي (ميزان، شريط طول) له الأولوية على الحساب." />
        </p>
      </div>
      <p className="text-xs opacity-60">{t("common.disclaimer")}</p>
    </div>
  );
}

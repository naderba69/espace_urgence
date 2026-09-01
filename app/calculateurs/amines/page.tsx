"use client";
// Débit PSE (mL/h) : (dose µg/kg/min × poids × 60) / (concentration µg/mL).
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";
import { amineFlow, concUgPerMl } from "@/lib/calc";

const PRESETS = [
  { id: "nad4", fr: "Noradrénaline 4 mg/50 mL", ar: "نورأدرنالين 4 ملغ/50 مل", mg: 4, vol: 50 },
  { id: "nad8", fr: "Noradrénaline 8 mg/50 mL", ar: "نورأدرنالين 8 ملغ/50 مل", mg: 8, vol: 50 },
  { id: "adr3", fr: "Adrénaline 3 mg/50 mL", ar: "أدرنالين 3 ملغ/50 مل", mg: 3, vol: 50 },
  { id: "adr6", fr: "Adrénaline 6 mg/50 mL", ar: "أدرنالين 6 ملغ/50 مل", mg: 6, vol: 50 },
  { id: "dobu", fr: "Dobutamine 250 mg/50 mL", ar: "دوبوتامين 250 ملغ/50 مل", mg: 250, vol: 50 },
  { id: "custom", fr: "Personnalisé", ar: "مخصص", mg: 0, vol: 0 },
];

export default function AminesPage() {
  const { t, lang } = useApp();
  const [preset, setPreset] = useState("nad4");
  const [mg, setMg] = useState("4");
  const [vol, setVol] = useState("50");
  const [weight, setWeight] = useState("70");
  const [dose, setDose] = useState("0.1");
  useRegisterRecent("calculateur:amines");

  const pick = (id: string) => {
    setPreset(id);
    trackEvent("calculator_use", { id: "amines" });
    const p = PRESETS.find((x) => x.id === id);
    if (p && p.id !== "custom") { setMg(String(p.mg)); setVol(String(p.vol)); }
  };

  const concUgMl = concUgPerMl(Number(mg), Number(vol)); // µg/mL
  const flow = amineFlow(Number(dose), Number(weight), Number(mg), Number(vol));
  const ok = flow > 0 && Number(dose) > 0;

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Amines — débit PSE (µg/kg/min)" ar="الأمينات — تدفق المضخة (مكغ/كغ/د)" /></h1>
        <PrintButton />
      </header>

      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        <label className="flex flex-col gap-1 font-semibold">
          {lang === "ar" ? "التحضير" : "Préparation"}
          <select value={preset} onChange={(e) => pick(e.target.value)}
            className="rounded-xl border border-line bg-surface2 px-3 py-3 outline-none focus:ring-2 focus:ring-teal-600">
            {PRESETS.map((p) => <option key={p.id} value={p.id}>{lang === "ar" ? p.ar : p.fr}</option>)}
          </select>
        </label>

        {preset === "custom" && (
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm font-semibold">
              {lang === "ar" ? "الكمية (ملغ)" : "Quantité (mg)"}
              <input type="number" inputMode="decimal" value={mg} onChange={(e) => setMg(e.target.value)}
                className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              {lang === "ar" ? "الحجم (مل)" : "Volume (mL)"}
              <input type="number" inputMode="decimal" value={vol} onChange={(e) => setVol(e.target.value)}
                className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
            </label>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            {t("common.weight")}
            <input type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)}
              className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            µg/kg/min
            <input type="number" step="0.01" inputMode="decimal" value={dose} onChange={(e) => setDose(e.target.value)}
              className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
          </label>
        </div>

        {ok && (
          <div className="rounded-2xl bg-teal-600 p-5 text-center text-white">
            <p className="text-sm font-semibold opacity-90">{t("common.result")}</p>
            <p className="text-4xl font-black tabular-nums">{Math.round(flow * 100) / 100} <span className="text-xl">mL/h</span></p>
            <p className="mt-1 text-xs opacity-80">
              {lang === "ar"
                ? `التركيز: ${Math.round(concUgMl)} مكغ/مل`
                : `Concentration : ${Math.round(concUgMl)} µg/mL`}
            </p>
          </div>
        )}

        <p className="text-xs opacity-60">
          <T fr="Formule : (dose × poids × 60) ÷ concentration. Vérifier la concentration réelle de la seringue préparée."
             ar="الصيغة: (الجرعة × الوزن × 60) ÷ التركيز. تحقق من تركيز المحقنة الفعلي." />
        </p>
      </div>
      <p className="text-xs opacity-60">{t("common.disclaimer")}</p>
    </div>
  );
}

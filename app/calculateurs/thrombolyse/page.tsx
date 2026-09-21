"use client";
// v2.0 — التحلل بالوزن : TNK احتشاء، ألتيبلاز سكتة وصمة.
import { useState } from "react";
import { tenecteplaseMg, alteplaseStroke } from "@/lib/calc";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { NumField, Hero, WarnNote } from "@/components/tools/ui";

type Mode = "stemi" | "avc" | "ep";

export default function ThrombolysePage() {
  const [mode, setMode] = useState<Mode>("stemi");
  const [weight, setWeight] = useState("70");
  useRegisterRecent("calculateur:thrombolyse");
  const w = Number(weight);
  const tnk = tenecteplaseMg(w);
  const avc = alteplaseStroke(w);
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Thrombolyse par poids" ar="التحلل بالوزن" /></h1>
      </header>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {([["stemi", "STEMI — TNK"], ["avc", "AVC — Altéplase"], ["ep", "Embolie — Altéplase"]] as [Mode, string][]).map(([m, l]) => (
          <button key={m} role="radio" aria-checked={mode === m} onClick={() => setMode(m)}
            className={`touch rounded-full border px-4 py-2 text-sm font-black ${mode === m ? "border-blue-600 bg-blue-600 text-white" : "border-line opacity-70"}`}>
            <span dir="ltr">{l}</span>
          </button>
        ))}
      </div>
      <NumField label={<T fr="Poids (kg)" ar="الوزن (كغ)" />} value={weight} onChange={setWeight} />

      {mode === "stemi" && (
        <Hero value={String(tnk)} unit="mg" sub={<T fr="TNK bolus unique en 5 à 10 s" ar="TNK دفعة واحدة على 5 إلى 10 ثوان" />} />
      )}
      {mode === "avc" && (
        <div className="flex flex-col gap-3">
          <Hero value={avc.total.toFixed(1)} unit="mg" sub={<T fr="total 0,9 mg/kg (max 90)" ar="المجموع 0.9 ملغ/كغ (الحد 90)" />} />
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="card rounded-2xl border border-blue-600/40 bg-blue-600/10 p-4">
              <p className="text-xs font-bold text-blue-500"><T fr="Bolus 10 % en 1 min" ar="دفعة 10% على دقيقة" /></p>
              <p className="text-2xl font-black tabular-nums" dir="ltr">{avc.bolus.toFixed(1)} mg</p>
            </div>
            <div className="card rounded-2xl border border-line bg-surface p-4">
              <p className="text-xs font-bold opacity-70"><T fr="Puis 60 min" ar="ثم على 60 دقيقة" /></p>
              <p className="text-2xl font-black tabular-nums" dir="ltr">{avc.infusion.toFixed(1)} mg</p>
            </div>
          </div>
        </div>
      )}
      {mode === "ep" && (
        <Hero value="100" unit="mg" sub={<T fr="sur 2 h (ou 0,6 mg/kg sur 15 min si arreste imminente)" ar="على ساعتين (أو 0.6 ملغ/كغ على 15 دقيقة عند التوقف الوشيك)" />} />
      )}
      <WarnNote tone="red"><T fr="Vérifier la liste des contre-indications absolues avant toute lyse." ar="تحقق من موانع الاستعمال المطلقة قبل أي تحلل." /></WarnNote>
    </div>
  );
}

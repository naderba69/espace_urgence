"use client";
// v2.0 — كالسيوم مصحح + تقدير عجز البوتاسيوم وقواعد السرعة.
import { useState } from "react";
import { calciumCorrected, potassiumDeficit } from "@/lib/calc";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { NumField, Hero, WarnNote } from "@/components/tools/ui";

export default function ElectrolytesPage() {
  const [ca, setCa] = useState("8");
  const [alb, setAlb] = useState("3");
  const [k, setK] = useState("3");
  const [weight, setWeight] = useState("70");
  useRegisterRecent("calculateur:electrolytes");
  const cac = calciumCorrected(Number(ca), Number(alb));
  const deficit = potassiumDeficit(Number(k), Number(weight));
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Calcium & potassium" ar="الكالسيوم والبوتاسيوم" /></h1>
      </header>

      <section className="card flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="font-black text-blue-500"><T fr="Calcium corrigé (albumine)" ar="الكالسيوم المصحح بالألبومين" /></h2>
        <div className="grid grid-cols-2 gap-3">
          <NumField label="Ca (mg/dL)" value={ca} onChange={setCa} />
          <NumField label="Alb (g/dL)" value={alb} onChange={setAlb} />
        </div>
        <Hero value={cac.toFixed(1)} unit="mg/dL" tone={cac < 7.5 ? "red" : "teal"} sub={<T fr="cible 8,4 – 10,2" ar="الهدف 8.4 إلى 10.2" />} />
      </section>

      <section className="card flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="font-black text-blue-500"><T fr="Déficit potassique estimé" ar="تقدير عجز البوتاسيوم" /></h2>
        <div className="grid grid-cols-2 gap-3">
          <NumField label="K (mmol/L)" value={k} onChange={setK} />
          <NumField label={<T fr="Poids (kg)" ar="الوزن (كغ)" />} value={weight} onChange={setWeight} />
        </div>
        <Hero value={String(deficit)} unit="mEq" tone={Number(k) < 2.5 ? "red" : "amber"} sub={<T fr="à combler en 24 h, pas en une fois" ar="يُعوَّض على 24 ساعة لا دفعة واحدة" />} />
        <WarnNote tone="amber">
          <T fr="Voie périphérique: 10 mEq/h max. Voie centrale: 20 mEq/h avec monitorage."
            ar="طرفياً: 10 مEq/س كحد أقصى. مركزياً: 20 مع مراقبة القلب." />
        </WarnNote>
        {Number(k) < 2.5 && <WarnNote tone="red"><T fr="K < 2,5: urgences — ECG, rempla­cement IV + magnésium, recherche de cause." ar="أقل من 2.5: حالة طارئة — تخطيط، تعويض وريدي ومغنيزيوم، وبحث عن السبب." /></WarnNote>}
      </section>
    </div>
  );
}

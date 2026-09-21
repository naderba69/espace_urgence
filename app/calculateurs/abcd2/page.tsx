"use client";
// v2.2 — ABCD2 بعد النوبة الإقفارية العابرة.
import { useState } from "react";
import { abcd2, abcd2Band } from "@/lib/calc";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { Hero, WarnNote } from "@/components/tools/ui";

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={on}
      className={`touch flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold ${on ? "border-blue-600 bg-blue-600/20 text-blue-500" : "border-line opacity-70"}`}>
      {children}
      <span className="tabular-nums" dir="ltr">{on ? "✓" : "–"}</span>
    </button>
  );
}

export default function Abcd2Page() {
  const [age60, setAge60] = useState(false);
  const [bp, setBp] = useState(false);
  const [diabet, setDiabet] = useState(false);
  const [symptom, setSymptom] = useState<"faiblesse" | "parole" | "aucun">("aucun");
  const [duration, setDuration] = useState<"gt60" | "d10a59" | "lt10">("lt10");
  useRegisterRecent("calculateur:abcd2");
  const s = abcd2({ age60, bp, diabet, symptom, duration });
  const band = abcd2Band(s);
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold" dir="ltr">ABCD2</h1>
      </header>
      <div className="card flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        <Toggle on={age60} onClick={() => setAge60(!age60)}><T fr="Âge ≥ 60 ans" ar="العمر 60 فأكثر" /></Toggle>
        <Toggle on={bp} onClick={() => setBp(!bp)}><T fr="PA ≥ 140/90" ar="الضغط 140/90 فأكثر" /></Toggle>
        <Toggle on={diabet} onClick={() => setDiabet(!diabet)}><T fr="Diabète" ar="سكري" /></Toggle>
        <div className="mt-2 flex gap-2">
          {([["faiblesse", "Faiblesse unilatérale +2", "ضعف طرفي أحادي +2"], ["parole", "Trouble parole +1", "اضطراب كلام +1"], ["aucun", "Autre 0", "غيرها 0"]] as const).map(([id, fr, ar]) => (
            <button key={id} onClick={() => setSymptom(id)} aria-pressed={symptom === id}
              className={`touch flex-1 rounded-xl border px-2 py-2 text-xs font-bold ${symptom === id ? "border-blue-600 bg-blue-600 text-white" : "border-line opacity-70"}`}>
              <T fr={fr} ar={ar} />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {([["gt60", "≥ 60 min +2", "60 دقيقة فأكثر +2"], ["d10a59", "10-59 min +1", "10-59 دقيقة +1"], ["lt10", "< 10 min 0", "أقل من 10 دقائق 0"]] as const).map(([id, fr, ar]) => (
            <button key={id} onClick={() => setDuration(id)} aria-pressed={duration === id}
              className={`touch flex-1 rounded-xl border px-2 py-2 text-xs font-bold ${duration === id ? "border-blue-600 bg-blue-600 text-white" : "border-line opacity-70"}`}>
              <T fr={fr} ar={ar} />
            </button>
          ))}
        </div>
      </div>
      <Hero value={`${s}/7`} tone={band === 2 ? "red" : band === 1 ? "amber" : "teal"}
        sub={band === 2 ? <T fr="Risque élevé: hospitalisation sans délai" ar="خطورة عالية: إدخال فوري" /> : band === 1 ? <T fr="Risque modéré: avis neurologique rapproché" ar="خطورة متوسطة: تقييم عصبي قريب" /> : <T fr="Risque bas: consultation rapide" ar="خطورة منخفضة: مراجعة سريعة" />} />
      {band === 2 && <WarnNote tone="red"><T fr="Ne pas retarder: imagerie et antiagrégants selon protocole AVC." ar="لا تأخير: تصوير ومضادات صفيحات وفق بروتوكول السكتة." /></WarnNote>}
    </div>
  );
}

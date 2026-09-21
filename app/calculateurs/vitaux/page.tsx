"use client";
// v2.0 — العلامات الحيوية : مؤشر الصدمة + الضغط الوسطي + النبضي.
import { useState } from "react";
import { shockIndex, shockIndexBand, meanArterialPressure, pulsePressure } from "@/lib/calc";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { NumField, Hero, WarnNote } from "@/components/tools/ui";

const BANDS = [
  { fr: "IS < 0,7: pas de choc détecté", ar: "أقل من 0.7: لا صدمة" },
  { fr: "0,7 – 1: zone d'alerte, surveiller la perfusion", ar: "0.7 إلى 1: منطقة إنذار، راقب التروية" },
  { fr: "1 – 1,4: choc probable, agir maintenant", ar: "1 إلى 1.4: صدمة محتملة، تصرّف الآن" },
  { fr: "> 1,4: choc sévère, protocole massif + avis réa", ar: "أكثر من 1.4: صدمة شديدة، بروتوكول نقل واستشارة إنعاش" },
] as const;

export default function VitauxPage() {
  const [hr, setHr] = useState("100");
  const [sbp, setSbp] = useState("100");
  const [dbp, setDbp] = useState("60");
  useRegisterRecent("calculateur:vitaux");
  const si = shockIndex(Number(hr), Number(sbp));
  const band = shockIndexBand(si);
  const map = meanArterialPressure(Number(sbp), Number(dbp));
  const pp = pulsePressure(Number(sbp), Number(dbp));
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Choc en 30 secondes" ar="الصدمة في ثلاثين ثانية" /></h1>
      </header>
      <div className="card grid grid-cols-3 gap-3 rounded-2xl border border-line bg-surface p-4">
        <NumField label={<T fr="Pouls" ar="النبض" />} value={hr} onChange={setHr} suffix="/min" />
        <NumField label={<T fr="PAS" ar="الانقباضي" />} value={sbp} onChange={setSbp} />
        <NumField label={<T fr="PAD" ar="الانبساطي" />} value={dbp} onChange={setDbp} />
      </div>
      <Hero value={si.toFixed(2)} sub={<T fr="index de choc (pouls / PAS)" ar="مؤشر الصدمة (النبض ÷ الانقباضي)" />} tone={band >= 2 ? "red" : band === 1 ? "amber" : "teal"} />
      <WarnNote tone={band >= 2 ? "red" : "amber"}><T fr={BANDS[band].fr} ar={BANDS[band].ar} /></WarnNote>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="card rounded-2xl border border-line bg-surface p-4">
          <p className="text-xs font-bold opacity-70"><T fr="Pression moyenne (PAM)" ar="الضغط الوسطي" /></p>
          <p className="text-3xl font-black tabular-nums" dir="ltr">{Math.round(map)}</p>
          <p className="text-xs opacity-60"><T fr="cible ≥ 65 dans le choc" ar="الهدف 65 فأكثر في الصدمة" /></p>
        </div>
        <div className="card rounded-2xl border border-line bg-surface p-4">
          <p className="text-xs font-bold opacity-70"><T fr="Pression pincée" ar="الضغط النبضي" /></p>
          <p className="text-3xl font-black tabular-nums" dir="ltr">{Math.round(pp)}</p>
          <p className="text-xs opacity-60"><T fr="< 25: bas débit" ar="أقل من 25: ضخ منخفض" /></p>
        </div>
      </div>
    </div>
  );
}

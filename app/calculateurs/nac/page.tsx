"use client";
// v2.0 — NAC باراسيتامول : الأكياس الثلاثة بأحجامها وسرعاتها.
import { useState } from "react";
import { nacProtocol } from "@/lib/calc";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { NumField } from "@/components/tools/ui";

export default function NacPage() {
  const [weight, setWeight] = useState("70");
  useRegisterRecent("calculateur:nac");
  const bags = nacProtocol(Number(weight));
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="N-acétylcystéine (3 poches)" ar="أسيتيل سيستئين (ثلاثة أكياس)" /></h1>
      </header>
      <NumField label={<T fr="Poids (kg, plafonné à 110)" ar="الوزن (كغ، بحد 110)" />} value={weight} onChange={setWeight} />
      {bags && bags.map((b) => (
        <div key={b.bag} className="card rounded-2xl border border-blue-600/40 bg-blue-600/10 p-4">
          <div className="flex items-baseline justify-between">
            <p className="font-black text-blue-500"><T fr={`Poche ${b.bag}`} ar={`الكيس ${b.bag}`} /></p>
            <p className="text-xs font-bold opacity-70" dir="ltr">{b.hours} h</p>
          </div>
          <p className="text-3xl font-black tabular-nums" dir="ltr">{b.mg} mg</p>
          <p className="text-sm font-bold opacity-80" dir="ltr">
            {b.vol} mL → {b.rate} mL/h
          </p>
        </div>
      ))}
      <p className="text-sm font-semibold opacity-80">
        <T fr="Indication: taux au-dessus de la ligne de traitement à H4, ou ingestion > 200 mg/kg, ou doute." ar="الاستطباب: مستوى فوق خط العلاج عند الساعة الرابعة، أو ابتلاع أكثر من 200 ملغ/كغ، أو شك." />
      </p>
    </div>
  );
}

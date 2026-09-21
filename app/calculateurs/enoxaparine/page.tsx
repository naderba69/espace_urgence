"use client";
// v2.0 — إينوكسابارين بالوزن والكلية.
import { useState } from "react";
import { enoxaparin } from "@/lib/calc";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { NumField, Hero, WarnNote } from "@/components/tools/ui";

export default function EnoxaparinePage() {
  const [weight, setWeight] = useState("70");
  const [crcl, setCrcl] = useState("80");
  const [mode, setMode] = useState<"traitement" | "prophylaxie">("traitement");
  useRegisterRecent("calculateur:enoxaparine");
  const r = enoxaparin(Number(weight), Number(crcl), mode);
  const perShot = r.perKg > 0 ? Math.round(r.perKg * Number(weight)) : r.daily / (mode === "traitement" ? 1 : 1);
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Énoxaparine (HBPM)" ar="إينوكسابارين" /></h1>
      </header>
      <div className="card flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
        <div className="flex gap-2">
          {(["traitement", "prophylaxie"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m}
              className={`touch flex-1 rounded-xl border px-4 py-2 font-bold ${mode === m ? "border-blue-600 bg-blue-600 text-white" : "border-line hover:bg-[color:var(--surface-2)]"}`}>
              {m === "traitement" ? <T fr="Curatif" ar="علاجي" /> : <T fr="Préventif" ar="وقائي" />}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NumField label={<T fr="Poids (kg)" ar="الوزن (كغ)" />} value={weight} onChange={setWeight} />
          <NumField label="CrCl (mL/min)" value={crcl} onChange={setCrcl} />
        </div>
      </div>
      <Hero value={mode === "traitement" && r.perKg > 0 ? String(perShot) : String(r.daily)} unit="mg"
        sub={mode === "traitement" && r.perKg > 0 ? <span dir="ltr">{r.freq} · {perShot * 100} UI</span> : <span dir="ltr">{r.freq} · {r.daily * 100} UI</span>} />
      {Number(crcl) < 30 && <WarnNote tone="amber"><T fr="ClCr < 30: dose réduite — surveillance anti-Xa recommandée." ar="تصفية أقل من 30: جرعة مخفضة ويُستحسن قياس anti-Xa." /></WarnNote>}
      <p className="text-xs opacity-60"><T fr="Contre-indiqué si thrombopénie active ou hémorragie majeure." ar="يمنع عند نقص صفيحات فعال أو نزيف شديد." /></p>
    </div>
  );
}

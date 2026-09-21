"use client";
// v2.2 — ألفارادو (التهاب الزائدة).
import { useState } from "react";
import { alvaradoBand } from "@/lib/calc";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { Hero, WarnNote } from "@/components/tools/ui";

const ITEMS = [
  ["migration", "Douleur migratrice +1", "ألم مهاجر +1", 1],
  ["anorexie", "Anorexie +1", "فقد شهية +1", 1],
  ["nausees", "Nausées/vomissements +1", "غثيان أو إقياء +1", 1],
  ["fdr", "Douleur FID +2", "ألم بالحفرة الحرقفية اليمنى +2", 2],
  ["rebound", "Rebond +1", "ألم ارتدادي +1", 1],
  ["fievre", "Fièvre > 37,3 +1", "حرارة فوق 37.3 +1", 1],
  ["hyperleuco", "GB > 10 000 +2", "كريات بيض فوق 10 آلاف +2", 2],
  ["deviation", "Déviation gauche +1", "انزياح يسار +1", 1],
] as const;

export default function AlvaradoPage() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  useRegisterRecent("calculateur:alvarado");
  const s = ITEMS.reduce((acc, [id, , , w]) => acc + (on[id] ? w : 0), 0);
  const band = alvaradoBand(s);
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Alvarado (appendicite)" ar="ألفارادو (الزائدة)" /></h1>
      </header>
      <div className="card grid grid-cols-1 gap-2 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-2">
        {ITEMS.map(([id, fr, ar]) => (
          <button key={id} onClick={() => setOn((o) => ({ ...o, [id]: !o[id] }))} aria-pressed={!!on[id]}
            className={`touch flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-bold ${on[id] ? "border-blue-600 bg-blue-600/20 text-blue-500" : "border-line opacity-70"}`}>
            <T fr={fr} ar={ar} />
            <span dir="ltr">{on[id] ? "✓" : "–"}</span>
          </button>
        ))}
      </div>
      <Hero value={`${s}/10`} tone={band === 2 ? "red" : band === 1 ? "amber" : "teal"}
        sub={band === 2 ? <T fr="Probable: avis chirurgical" ar="محتملة بقوة: رأي جراحي" /> : band === 1 ? <T fr="Possible: observation + imagerie" ar="ممكنة: مراقبة وتصوير" /> : <T fr="Improbable: rechercher une autre cause" ar="مستبعدة: ابحث عن سبب آخر" />} />
      {band === 2 && <WarnNote tone="red"><T fr="Jeûne + analgésie + antibioprophylaxie selon protocole." ar="صيام وتسكين ومضاد وقائي وفق البروتوكول." /></WarnNote>}
    </div>
  );
}

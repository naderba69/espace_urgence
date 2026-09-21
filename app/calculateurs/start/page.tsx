"use client";
// v2.4 — فرز جماعي تفاعلي START / JumpSTART بوسم لوني وعدّاد.
import { useState } from "react";
import { startTriageStep, type TriageColor } from "@/lib/calc";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { Undo2 } from "lucide-react";

const COLORS: Record<TriageColor, { cls: string; fr: string; ar: string }> = {
  green: { cls: "bg-green-600", fr: "Vert — blessé léger", ar: "أخضر — إصابة خفيفة" },
  yellow: { cls: "bg-amber-400 text-black", fr: "Jaune — différé", ar: "أصفر — مؤجل" },
  red: { cls: "bg-red-600", fr: "Rouge — urgence absolue", ar: "أحمر — أولوية مطلقة" },
  black: { cls: "bg-zinc-800", fr: "Noir — expectatif", ar: "أسود — توقعي" },
};

interface Ans { walks?: boolean; breath?: boolean; rr?: number; pulse?: boolean; obeys?: boolean }

function Btn({ on, children }: { on: () => void; children: React.ReactNode }) {
  return (
    <button onClick={on} className="touch flex-1 rounded-xl border border-line px-4 py-4 text-lg font-black hover:bg-[color:var(--surface-2)] active:scale-[.98]">
      {children}
    </button>
  );
}

export default function StartPage() {
  const [ped, setPed] = useState(false);
  const [ans, setAns] = useState<Ans>({});
  const [rrInput, setRrInput] = useState("20");
  const [tags, setTags] = useState<TriageColor[]>([]);
  useRegisterRecent("calculateur:start");

  const color = startTriageStep(ped, ans);

  const reset = () => { setAns({}); setRrInput("20"); };

  const counts = (["red", "yellow", "green", "black"] as TriageColor[]).map((c) => ({ c, n: tags.filter((t) => t === c).length }));

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold" dir="ltr">START / JumpSTART</h1>
      </header>

      <div className="flex gap-2">
        {([false, true] as const).map((p) => (
          <button key={String(p)} onClick={() => { setPed(p); reset(); }} aria-pressed={ped === p}
            className={`touch flex-1 rounded-xl border px-4 py-2 font-bold ${ped === p ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            {p ? <T fr="Enfant (JumpSTART)" ar="طفل (JumpSTART)" /> : <T fr="Adulte (START)" ar="بالغ (START)" />}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {counts.map(({ c, n }) => (
          <div key={c} className={`flex-1 rounded-xl ${COLORS[c].cls} p-2 text-center`}>
            <p className="text-2xl font-black tabular-nums">{n}</p>
          </div>
        ))}
      </div>

      {color === null ? (
        <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
          {ans.walks === undefined && (
            <>
              <p className="text-lg font-black"><T fr="Peut-il marcher ?" ar="هل يستطيع المشي؟" /></p>
              <div className="flex gap-2">
                <Btn on={() => setAns({ walks: true })}><T fr="Oui" ar="نعم" /></Btn>
                <Btn on={() => setAns({ walks: false })}><T fr="Non" ar="لا" /></Btn>
              </div>
            </>
          )}
          {ans.walks === false && ans.breath === undefined && (
            <>
              <p className="text-lg font-black"><T fr="Respire-t-il après libération des voies aériennes ?" ar="هل يتنفس بعد تحرير مجرى الهواء؟" /></p>
              <div className="flex gap-2">
                <Btn on={() => setAns((a) => ({ ...a, breath: true }))}><T fr="Oui" ar="نعم" /></Btn>
                <Btn on={() => setAns((a) => ({ ...a, breath: false }))}><T fr="Non" ar="لا" /></Btn>
              </div>
            </>
          )}
          {ans.breath === true && ans.rr === undefined && (
            <>
              <p className="text-lg font-black"><T fr="Fréquence respiratoire par minute" ar="التردد التنفسي في الدقيقة" /></p>
              <div className="flex items-center gap-3">
                <input type="number" inputMode="numeric" value={rrInput} onChange={(e) => setRrInput(e.target.value)}
                  className="w-28 rounded-xl border border-line bg-[color:var(--surface-2)] px-3 py-3 text-center text-2xl font-black tabular-nums outline-none focus:ring-2 focus:ring-blue-600" />
                <Btn on={() => setAns((a) => ({ ...a, rr: Number(rrInput) }))}><T fr="Valider" ar="ثبّت" /></Btn>
              </div>
            </>
          )}
          {ans.rr !== undefined && ans.pulse === undefined && (
            <>
              <p className="text-lg font-black"><T fr="Pouls radial présent / recoloration < 2 s ?" ar="نبض كعبري موجود / امتلاء شعري أقل من ثانيتين؟" /></p>
              <div className="flex gap-2">
                <Btn on={() => setAns((a) => ({ ...a, pulse: true }))}><T fr="Oui" ar="نعم" /></Btn>
                <Btn on={() => setAns((a) => ({ ...a, pulse: false }))}><T fr="Non" ar="لا" /></Btn>
              </div>
            </>
          )}
          {ans.pulse === true && ans.obeys === undefined && (
            <>
              <p className="text-lg font-black">{ped ? <T fr="Se console / obéit ?" ar="يهدأ / يطيع؟" /> : <T fr="Obéit à un ordre simple ?" ar="يطيع أمراً بسيطاً؟" />}</p>
              <div className="flex gap-2">
                <Btn on={() => setAns((a) => ({ ...a, obeys: true }))}><T fr="Oui" ar="نعم" /></Btn>
                <Btn on={() => setAns((a) => ({ ...a, obeys: false }))}><T fr="Non" ar="لا" /></Btn>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className={`rounded-2xl p-8 text-center text-white shadow-xl ${COLORS[color].cls}`}>
          <p className="text-3xl font-black"><T fr={COLORS[color].fr} ar={COLORS[color].ar} /></p>
        </div>
      )}

      {color !== null && (
        <div className="flex gap-2">
          <button onClick={() => { setTags((t) => [...t, color]); reset(); }}
            className="touch flex-1 rounded-xl bg-blue-600 px-4 py-4 text-lg font-black text-white active:scale-[.98]">
            <T fr="Taguer et patient suivant" ar="سم التالي" />
          </button>
          <button onClick={reset} className="touch rounded-xl border border-line px-4 py-4 font-bold">
            <T fr="Recommencer" ar="أعد" />
          </button>
        </div>
      )}

      {tags.length > 0 && (
        <button onClick={() => setTags((t) => t.slice(0, -1))}
          className="touch mx-auto flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-bold opacity-70">
          <Undo2 className="h-4 w-4" aria-hidden /> <T fr="Annuler le dernier tag" ar="تراجع عن آخر وسم" />
        </button>
      )}
    </div>
  );
}

"use client";
// v2.0 — QTc بازيتا وفريديريا مع العتبات.
import { useState } from "react";
import { qtc, qtcBand } from "@/lib/calc";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { NumField, Hero, WarnNote } from "@/components/tools/ui";

export default function QtcPage() {
  const [qt, setQt] = useState("400");
  const [bpm, setBpm] = useState("75");
  const [female, setFemale] = useState(false);
  useRegisterRecent("calculateur:qtc");
  const r = qtc(Number(qt), Number(bpm));
  const band = qtcBand(r.bazett, female);
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">QTc</h1>
      </header>
      <div className="card grid grid-cols-2 gap-3 rounded-2xl border border-line bg-surface p-4">
        <NumField label="QT (ms)" value={qt} onChange={setQt} />
        <NumField label={<T fr="Fréquence" ar="التردد" />} value={bpm} onChange={setBpm} suffix="/min" />
        <div className="col-span-2 flex gap-2">
          {([false, true] as const).map((f) => (
            <button key={String(f)} onClick={() => setFemale(f)} aria-pressed={female === f}
              className={`touch flex-1 rounded-xl border px-4 py-2 font-bold ${female === f ? "border-blue-600 bg-blue-600 text-white" : "border-line hover:bg-[color:var(--surface-2)]"}`}>
              {f ? <T fr="Femme" ar="أنثى" /> : <T fr="Homme" ar="ذكر" />}
            </button>
          ))}
        </div>
      </div>
      <Hero value={String(Math.round(r.bazett))} unit="ms" sub={<>Bazett · Fridericia = <span dir="ltr" className="tabular-nums">{Math.round(r.fridericia)} ms</span></>}
        tone={band === 2 ? "red" : band === 1 ? "amber" : "teal"} />
      {band === 2 && <WarnNote tone="red"><T fr="QTc ≥ 500: risque torsades — stopper les allongeants, corriger K/Mg, avis cardio." ar="أكثر من 500: خطر التواء الأسلاف — أوقف المطيلات، صحح البوتاسيوم والمغنيزيوم، استشارة قلبية." /></WarnNote>}
      {band === 1 && <WarnNote tone="amber"><T fr="QTc allongé: prudence avec tout médicament allongeant." ar="QT طويل نسبياً: حذر مع أي دواء مطيل." /></WarnNote>}
      {band === 0 && <p className="text-sm font-bold opacity-70"><T fr="Dans les limites." ar="ضمن الحدود." /></p>}
    </div>
  );
}

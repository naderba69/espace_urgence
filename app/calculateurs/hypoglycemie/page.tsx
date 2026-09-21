"use client";
// v4.4 — مساعد نقص السكر الفردي: معالجة بالوزن/عمر + إعادة فحص مؤرّخة كل 15 د + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

type EvType = "trait" | "controle";

export default function HypoglycemiePage() {
  useRegisterRecent("calculateur:hypoglycemie");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [ped, setPed] = useState(true);
  const [w, setW] = useState("");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ type: EvType; at: number; fr: string; ar: string }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const weight = parseFloat(w);
  const okW = Number.isFinite(weight) && weight > 0;

  const d10 = ped && okW ? Math.round(weight * 5) : 0;
  const gluca = ped && okW ? (weight < 25 ? 0.5 : 1) : 1;

  const lastEvt = events.length ? events[0].at : null;
  const since = lastEvt === null ? null : now - lastEvt;
  const recheckLate = since !== null && since >= 900;

  const stamp = (type: EvType) => {
    const fr = type === "trait"
      ? (ped ? `D10 IV ${d10} mL (5 mL/kg) ou glucagon ${gluca} mg IM` : "Glucosé oral 15-20 g ou D50 50 mL IV ou glucagon 1 mg IM")
      : "Contrôle glycémie";
    const ar = type === "trait"
      ? (ped ? `غلوكوز 10٪ وريدياً ${d10} مل (5 مل/كغ) أو غلوكاغون ${gluca} ملغ عضلياً` : "غلوكوز فموياً 15-20 غ أو غلوكوز 50٪ 50 مل وريدياً أو غلوكاغون 1 ملغ عضلياً")
      : "فحص السكر";
    setEvents((e) => [{ type, at: now, fr, ar }, ...e]);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant hypoglycémie individuel" ar="مساعد نقص السكر الفردي" /></h1>

      <div className="card flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
        <p className="text-4xl font-black tabular-nums" dir="ltr">{fmtMMSS(now)}</p>
        <div className="flex gap-2">
          <button onClick={() => setChrono((c) => {
            if (c.start) { const acc = c.acc + (Date.now() - c.start) / 1000; setNow(acc); return { start: null, acc }; }
            return { start: Date.now(), acc: c.acc };
          })}
            className="touch rounded-xl bg-red-600 px-5 py-3 font-black text-white active:scale-[.98]">
            {chrono.start ? <T fr="Pause" ar="إيقاف" /> : <T fr="Démarrer" ar="ابدأ" />}
          </button>
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setEvents([]); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <div className="mb-2 flex gap-2">
          <button onClick={() => setPed(true)} aria-pressed={ped}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${ped ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Enfant" ar="طفل" />
          </button>
          <button onClick={() => setPed(false)} aria-pressed={!ped}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${!ped ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Adulte" ar="كبير" />
          </button>
        </div>
        {ped && (
          <>
            <label className="mb-1 block text-sm font-bold opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></label>
            <input value={w} onChange={(e) => setW(e.target.value)} inputMode="decimal" placeholder="15"
              className="w-28 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
          </>
        )}
        <ul className="mt-3 space-y-1 text-sm font-black text-blue-500" dir="ltr">
          {ped
            ? <li>{`D10 IV ${okW ? d10 : "—"} mL (5 mL/kg) · glucagon ${okW ? gluca : "—"} mg IM si pas de voie`}</li>
            : <li>{`Conscient : glucosé oral 15-20 g · sinon D50 50 mL IV ou glucagon 1 mg IM`}</li>}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => stamp("trait")} disabled={ped && !okW}
          className={`touch rounded-2xl border p-4 font-black ${ped && !okW ? "border-line opacity-40" : "border-line bg-surface"}`}>
          <T fr="Traitement administré" ar="أُعطيت المعالجة" />
        </button>
        <button onClick={() => stamp("controle")}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${recheckLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Contrôle glycémie" ar="فحص السكر" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{since === null ? "—" : fmtMMSS(since)}</span>
        </button>
      </div>

      {recheckLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 15 min: recontrôler la glycémie !" ar="≥ 15 د: أعد فحص السكر!" />
        </p>
      )}

      {events.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({events.length})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {events.map((e, i) => (
              <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                <span>{lang === "ar" ? e.ar : e.fr}</span>
                <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(e.at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {events.length > 0 && (
        <button onClick={() => {
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل نقص السكر" : "Journal hypoglycémie", [...events].reverse().map((e) => ({ label: lang === "ar" ? e.ar : e.fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Chercher la cause (insuline, sepsis, insuffisance surrénale…). Sources: ISPAD 2022, ADA 2023." ar="ابحث عن السبب (أنسولين، إنتان، قصور كظر…). المصادر: ISPAD 2022 وADA 2023." /></p>
    </div>
  );
}

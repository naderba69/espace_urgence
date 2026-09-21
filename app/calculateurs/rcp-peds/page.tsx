"use client";
// v4.1 — مساعد إنعاش الطفل الفردي: جرعات بالوزن الفعلي أو بالطول (Broselow)، أوامر مؤرّخة، سجل قابل للنسخ.
import { useEffect, useState } from "react";
import { useMetronome, useWakeLock } from "@/lib/hooks";
import { fmtMMSS, broselowZone, type BroselowZone } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

type EvType = "epi" | "choc" | "rythme";

export default function RcpPedsPage() {
  useRegisterRecent("calculateur:rcp-peds");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"kg" | "cm">("kg");
  const [val, setVal] = useState("");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ type: EvType; at: number; fr: string; ar: string }[]>([]);
  const metro = useMetronome(110);
  useWakeLock(chrono.start !== null);



  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const num = parseFloat(val);
  const z = mode === "cm" && Number.isFinite(num) ? broselowZone(num) : null;
  const zone: BroselowZone | null = z && z !== "neo" && z !== "adult" ? z : null;
  const kg = mode === "kg" ? num : zone ? zone.mid : NaN;
  const ok = Number.isFinite(kg) && kg > 0;

  const epiMg = ok ? (kg * 0.01).toFixed(2) : "—";
  const epiMl = ok ? (kg * 0.1).toFixed(1) : "—";
  const defib1 = ok ? Math.round(kg * 2) : 0;
  const defib2 = ok ? Math.round(kg * 4) : 0;
  const amio = ok ? Math.min(300, Math.round(kg * 5)) : 0;
  const bolus = ok ? Math.round(kg * 20) : 0;

  const nChocs = events.filter((e) => e.type === "choc").length;
  const nextJ = ok ? (nChocs === 0 ? defib1 : defib2) : 0;

  const stamp = (type: EvType) => {
    let fr = ""; let ar = "";
    if (type === "epi") {
      fr = `Adrénaline ${epiMg} mg (${epiMl} mL 1:10 000)`;
      ar = `أدرنالين ${epiMg} ملغ (${epiMl} مل من 1:10000)`;
    } else if (type === "choc") {
      fr = `Choc ${nextJ} J`;
      ar = `صدمة ${nextJ} جول`;
    } else {
      fr = "Analyse du rythme";
      ar = "تحليل الإيقاع";
    }
    setEvents((e) => [{ type, at: now, fr, ar }, ...e]);
  };

  const sinceR2 = now - ((events.find((e) => e.type === "rythme")?.at) ?? 0);
  const lastEpiAt = events.find((e) => e.type === "epi")?.at ?? null;
  const guideP = now < 1
    ? { fr: "5 insufflations puis massage 15:2", ar: "5 نفخات ثم تدليك 15:2" }
    : (lastEpiAt !== null ? now - lastEpiAt : now) >= 240
      ? { fr: "Adrénaline 0,01 mg/kg maintenant", ar: "أدرنالين 0,01 ملغ/كغ الآن" }
      : sinceR2 >= 120
        ? { fr: "Analyse du rythme maintenant", ar: "حلّل الإيقاع الآن" }
        : { fr: "Poursuivez le massage", ar: "واصل التدليك" };

  const lastOf = (type: EvType) => events.find((e) => e.type === type)?.at ?? null;

  const EV: { id: EvType; fr: string; ar: string; periodSec: number | null; sub: string; disabled: boolean }[] = [
    { id: "epi", fr: "Adrénaline", ar: "أدرنالين", periodSec: 240, sub: ok ? `${epiMl} mL` : "—", disabled: !ok },
    { id: "choc", fr: "Choc", ar: "صدمة", periodSec: null, sub: ok ? `${nextJ} J` : "—", disabled: !ok },
    { id: "rythme", fr: "Analyse du rythme", ar: "تحليل الإيقاع", periodSec: 120, sub: "", disabled: false },
  ];

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant RCP pédiatrique individuel" ar="مساعد إنعاش الطفل الفردي" /></h1>

      <p role="status" className="rounded-2xl border border-red-600 bg-red-600/15 p-4 text-lg font-black text-red-500">
        <T fr={`Maintenant : ${guideP.fr}`} ar={`الآن: ${guideP.ar}`} />
      </p>

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
          <button onClick={() => { setMode("kg"); setVal(""); }} aria-pressed={mode === "kg"}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${mode === "kg" ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Poids réel (kg)" ar="الوزن الفعلي (كغ)" />
          </button>
          <button onClick={() => { setMode("cm"); setVal(""); }} aria-pressed={mode === "cm"}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${mode === "cm" ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Longueur (cm)" ar="الطول (سم)" />
          </button>
        </div>
        <input value={val} onChange={(e) => setVal(e.target.value)} inputMode="decimal"
          placeholder={mode === "kg" ? "12" : "90"}
          className="w-28 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
        {mode === "cm" && zone && (
          <p className="mt-2 text-sm font-black text-blue-500">
            <T fr={`Zone ${zone.color} · ${zone.kgMin}-${zone.kgMax} kg · ETT ${zone.ettCuffed} (cuffé) · ${zone.blade}`}
              ar={`منطقة ${zone.color} · ${zone.kgMin}-${zone.kgMax} كغ · أنبوب ${zone.ettCuffed} (مبطّن) · ${zone.blade}`} />
          </p>
        )}
        {mode === "cm" && z === "neo" && (
          <p className="mt-2 text-sm font-black text-amber-500"><T fr="&lt; 46 cm: utilisez l'assistant minute d'or nouveau-né." ar="أقل من 46 سم: استخدم مساعد الدقيقة الذهبية للولدان." /></p>
        )}
        {mode === "cm" && z === "adult" && (
          <p className="mt-2 text-sm font-black text-amber-500"><T fr="&gt; 143 cm: utilisez l'assistant RCP individuel adulte." ar="أكثر من 143 سم: استخدم مساعد الإنعاش الفردي للكبير." /></p>
        )}
        {ok && (
          <ul className="mt-3 space-y-1 text-sm font-black text-blue-500" dir="ltr">
            <li>{`Adrénaline IV 0,01 mg/kg → ${epiMg} mg = ${epiMl} mL (1:10 000)`}</li>
            <li>{`Défibrillation ${defib1} J puis ${defib2} J`}</li>
            <li>{`Amiodarone ${amio} mg (max 300)`}</li>
            <li>{`Bolus NS 20 mL/kg → ${bolus} mL`}</li>
          </ul>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => { if (!metro.on && chrono.start === null) setChrono((c) => ({ ...c, start: Date.now() })); metro.toggle(); }} aria-pressed={metro.on}
          className={`touch rounded-xl border p-3 font-black ${metro.on ? "border-blue-500 bg-blue-600 text-white" : "border-line bg-surface"}`}>
          <T fr={metro.on ? "Métronome 110/min ✓" : "Métronome 110/min"} ar={metro.on ? "مترونوم 110/د ✓" : "مترونوم 110/د"} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {EV.map((ev) => {
          const last = lastOf(ev.id);
          const since = last === null ? null : now - last;
          const late = ev.periodSec !== null && since !== null && since >= ev.periodSec;
          return (
            <button key={ev.id} disabled={ev.disabled} onClick={() => stamp(ev.id)}
              className={`touch flex flex-col items-center gap-1 rounded-2xl border p-4 font-black ${ev.disabled ? "border-line opacity-40" : late ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
              <span><T fr={ev.fr} ar={ev.ar} /> {ev.sub && <span className="text-xs opacity-70 tabular-nums" dir="ltr">({ev.sub})</span>}</span>
              <span className="text-xs font-bold opacity-70 tabular-nums" dir="ltr">{since === null ? "—" : fmtMMSS(since)}</span>
            </button>
          );
        })}
      </div>

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
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل إنعاش الطفل" : "Journal RCP pédiatrique", [...events].reverse().map((e) => ({ label: lang === "ar" ? e.ar : e.fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Sources: PALS/AHA 2020, Broselow (clinical-database 2026). Poids réel prioritaire pour les doses; longueur pour l'équipement. Fiable < 18 kg." ar="المصادر: PALS/AHA 2020 وبروسِلو. الوزن الفعلي أولى للجرعات والطول للمعدات؛ موثوق دون 18 كغ." /></p>
    </div>
  );
}

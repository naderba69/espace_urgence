"use client";
// v4.7 — مساعد ذات الرئة المكتسبة الفردي: CURB-65 توجيهي + تذكير مضاد حيوي خلال الساعة + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS, curb65Outcome } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

const CRITERIA: { id: string; fr: string; ar: string }[] = [
  { id: "c", fr: "Confusion", ar: "تشوش" },
  { id: "u", fr: "Urée > 7 mmol/L", ar: "يوريا > 7 ممول/ل" },
  { id: "r", fr: "FR ≥ 30/min", ar: "تنفس ≥ 30/د" },
  { id: "b", fr: "PAS < 90 ou PAD ≤ 60", ar: "انقباضي < 90 أو انبساطي ≤ 60" },
  { id: "65", fr: "Âge ≥ 65 ans", ar: "عمر ≥ 65" },
];

export default function PacPage() {
  useRegisterRecent("calculateur:pac");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [marks, setMarks] = useState<Record<string, boolean>>({});
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [abxAt, setAbxAt] = useState<number | null>(null);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const score = CRITERIA.filter((c) => marks[c.id]).length;
  const out = curb65Outcome(score);
  const abxLate = abxAt === null && now >= 3600;

  const ORIENT = [
    { fr: "Score 0-1: ambulatoire possible.", ar: "نقاط 0-1: علاج خارجي ممكن." },
    { fr: "Score 2: hospitalisation.", ar: "نقطتان: إدخال مشفى." },
    { fr: "Score ≥ 3: hospitalisation ± soins intensifs.", ar: "≥ 3: إدخال ± عناية مركزة." },
  ][out];

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant pneumonie (PAC) individuel" ar="مساعد ذات الرئة الفردي" /></h1>

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
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setAbxAt(null); setMarks({}); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <div className="flex flex-wrap gap-2">
          {CRITERIA.map((c) => (
            <button key={c.id} onClick={() => setMarks((m) => ({ ...m, [c.id]: !m[c.id] }))} aria-pressed={!!marks[c.id]}
              className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${marks[c.id] ? "border-red-600 bg-red-600/15 text-red-500" : "border-line"}`}>
              {lang === "ar" ? c.ar : c.fr}
            </button>
          ))}
        </div>
        <p className="mt-3 text-4xl font-black tabular-nums text-blue-500">{score}/5</p>
        <p className={`mt-1 rounded-xl p-3 text-sm font-black ${out === 0 ? "bg-blue-600/15 text-blue-500" : "bg-amber-500/10 text-amber-500"}`}>
          {lang === "ar" ? ORIENT.ar : ORIENT.fr}
        </p>
      </div>

      <button onClick={() => setAbxAt(now)} disabled={abxAt !== null}
        className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${abxAt !== null ? "border-green-600 bg-green-600/10" : abxLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
        <span><T fr="Antibiothérapie administrée" ar="أُعطي المضاد الحيوي" /></span>
        <span className="tabular-nums text-sm" dir="ltr">{abxAt !== null ? fmtMMSS(abxAt) : fmtMMSS(now)}</span>
      </button>

      {abxLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 1 h sans antibiotique: administrer sans retard (heure-1)." ar="≥ 1 س دون مضاد: أعطِه دون تأخير (الساعة الأولى)." />
        </p>
      )}

      {abxAt !== null && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">(1)</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            <li className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
              <span><T fr={`Antibiotique à ${fmtMMSS(abxAt)} · CURB-65 ${score}/5`} ar={`مضاد حيوي عند ${fmtMMSS(abxAt)} · CURB-65 ${score}/5`} /></span>
              <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(abxAt)}</span>
            </li>
          </ul>
        </section>
      )}

      {abxAt !== null && (
        <button onClick={() => {
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل ذات الرئة" : "Journal PAC", [{ label: lang === "ar" ? `مضاد حيوي · CURB-65 ${score}/5` : `Antibiotique · CURB-65 ${score}/5`, at: abxAt }]));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="SpO2 + radio/échographie; choix de l'antibiotique selon protocoles locaux validés. Source: BTS 2019." ar="تشبع + تصوير؛ اختيار المضاد وفق بروتوكولات محلية معتمدة. المصدر: BTS 2019." /></p>
    </div>
  );
}

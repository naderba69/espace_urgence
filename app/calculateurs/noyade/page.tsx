"use client";
// v4.8 — مساعد الغرق الفردي: أكسجين مؤرّخ + مراقبة كل 30 د + أعلام إنذار + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

const FLAGS: { id: string; fr: string; ar: string }[] = [
  { id: "spo2", fr: "SpO2 < 94 %", ar: "تشبع < 94٪" },
  { id: "detresse", fr: "Détresse respiratoire", ar: "ضيق تنفسي" },
  { id: "consc", fr: "Troubles de conscience", ar: "اضطراب وعي" },
  { id: "immersion", fr: "Immersion > 5 min / eau souillée", ar: "غمر > 5 د / ماء ملوث" },
];

export default function NoyadePage() {
  useRegisterRecent("calculateur:noyade");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ at: number; fr: string; ar: string }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const nFlags = FLAGS.filter((f) => flags[f.id]).length;

  const lastObs = events.length ? events[0].at : null;
  const since = lastObs === null ? null : now - lastObs;
  const obsLate = since !== null && since >= 1800;

  const stamp = (fr: string, ar: string) => setEvents((e) => [{ at: now, fr, ar }, ...e]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant noyade individuel" ar="مساعد الغرق الفردي" /></h1>

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
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setEvents([]); setFlags({}); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FLAGS.map((f) => (
          <button key={f.id} onClick={() => setFlags((x) => ({ ...x, [f.id]: !x[f.id] }))} aria-pressed={!!flags[f.id]}
            className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${flags[f.id] ? "border-red-600 bg-red-600/15 text-red-500" : "border-line"}`}>
            {lang === "ar" ? f.ar : f.fr}
          </button>
        ))}
      </div>

      {nFlags > 0 ? (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr={`${nFlags} signe(s) d'alarme : hospitalisation + surveillance continue.`} ar={`${nFlags} علامة إنذار: إدخال + مراقبة مستمرة.`} />
        </p>
      ) : (
        <p className="rounded-xl bg-blue-600/15 p-3 font-black text-blue-500">
          <T fr="Asymptomatique: observation 4-6 h minimum avant sortie." ar="بلا أعراض: مراقبة 4-6 س على الأقل قبل الخروج." />
        </p>
      )}

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => stamp("O2 démarré", "بدأ الأكسجين")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="O2 démarré" ar="بدأ الأكسجين" />
        </button>
        <button onClick={() => stamp("Réévaluation clinique", "إعادة تقييم سريري")}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${obsLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Réévaluation clinique" ar="إعادة تقييم سريري" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{since === null ? "—" : fmtMMSS(since)}</span>
        </button>
      </div>

      {obsLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 30 min: réévaluation due (œdème pulmonaire retardé)." ar="≥ 30 د: إعادة التقييم مستحقة (وذمة رئة متأخرة)." />
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
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الغرق" : "Journal noyade", [...events].reverse().map((e) => ({ label: lang === "ar" ? e.ar : e.fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Pas d'antibiothérapie prophylactique; ECG + SpO2. Source: ERC 2021 noyade." ar="لا مضاد وقائياً؛ تخطيط + تشبع. المصدر: ERC 2021." /></p>
    </div>
  );
}

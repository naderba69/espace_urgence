"use client";
// v4.0 — مساعد التنبيب الفردي: موقّت لكل خطوة، محاولات لارنجوسكوب ≤ 30 ث، سجل مؤرّخ.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { getProcedure } from "@/data/procedures";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

const TIMES_FALLBACK: number[] = [];
const PROC = getProcedure("iot-rsi")!;
const TIMES = PROC.stepTimes ?? TIMES_FALLBACK;
const ATTEMPT_FR = "Tentative de laryngoscopie";
const ATTEMPT_AR = "محاولة لارنجوسكوب";

export default function IotRsiPage() {
  useRegisterRecent("calculateur:iot-rsi");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [done, setDone] = useState<Record<number, number>>({});
  const [attempts, setAttempts] = useState<number[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const current = PROC.steps.findIndex((_, i) => done[i] === undefined);
  const curStart = current <= 0 ? 0 : done[current - 1];
  const late = current >= 0 && now > 0 && now - curStart >= TIMES[current];
  const lastAttempt = attempts[0] ?? null;
  const attemptSince = lastAttempt === null ? null : now - lastAttempt;
  const attemptLate = attemptSince !== null && attemptSince >= 30;
  const nLogged = Object.keys(done).length + attempts.length;

  const copy = () => {
    const lines = [
      ...PROC.steps
        .map((s, i) => ({ i, at: done[i] as number | undefined }))
        .filter((x): x is { i: number; at: number } => x.at !== undefined)
        .map((x) => ({ label: lang === "ar" ? PROC.steps[x.i].ar : PROC.steps[x.i].fr, at: x.at })),
      ...attempts.map((at) => ({ label: lang === "ar" ? ATTEMPT_AR : ATTEMPT_FR, at })),
    ].sort((a, b) => a.at - b.at);
    navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل التنبيب" : "Journal intubation", lines));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant intubation individuel (RSI)" ar="مساعد التنبيب الفردي (تسلسل سريع)" /></h1>

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
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setDone({}); setAttempts([]); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      <button onClick={() => setAttempts((a) => [now, ...a])}
        className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${attemptLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
        <span><T fr={ATTEMPT_FR} ar={ATTEMPT_AR} /> <span className="text-xs font-bold opacity-70">(<T fr="max 30 s" ar="≤ 30 ث" />)</span></span>
        <span className="tabular-nums text-sm" dir="ltr">{attemptSince === null ? "—" : fmtMMSS(attemptSince)}</span>
      </button>

      <ol className="flex flex-col gap-2">
        {PROC.steps.map((s, i) => {
          const at = done[i];
          const isCur = i === current;
          const cls = at !== undefined
            ? "border-green-600 bg-green-600/10"
            : isCur && late
              ? "border-red-600 bg-red-600/15"
              : isCur
                ? "border-blue-600 bg-blue-600/10"
                : "border-line bg-surface opacity-60";
          return (
            <li key={i}>
              <button onClick={() => setDone((d) => (d[i] === undefined ? { ...d, [i]: now } : d))}
                className={`touch flex w-full items-center justify-between gap-2 rounded-2xl border p-3 text-start ${cls}`}>
                <span className="block text-sm font-bold">{i + 1}. {lang === "ar" ? s.ar : s.fr}</span>
                <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-black tabular-nums ${at !== undefined ? "bg-green-600/15 text-green-500" : isCur && late ? "bg-red-600/15 text-red-500" : "bg-surface2 opacity-70"}`} dir="ltr">
                  {at !== undefined ? fmtMMSS(at) : `≤ ${TIMES[i]} s`}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {nLogged > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({nLogged})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {[
              ...PROC.steps.map((s, i) => ({ label: lang === "ar" ? s.ar : s.fr, at: done[i] as number | undefined }))
                .filter((x): x is { label: string; at: number } => x.at !== undefined),
              ...attempts.map((at) => ({ label: lang === "ar" ? ATTEMPT_AR : ATTEMPT_FR, at })),
            ].sort((a, b) => a.at - b.at).map((x, k) => (
              <li key={k} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                <span className="min-w-0 break-words">{x.label}</span>
                <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(x.at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {nLogged > 0 && (
        <button onClick={copy}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Sources: SFAR RSI/DAS 2023, ERC airway 2021. Capnographie continue obligatoire après intubation." ar="المصادر: SFAR 2023، ERC 2021. الكابنوغرافيا المستمرة إلزامية بعد التنبيب." /></p>
    </div>
  );
}

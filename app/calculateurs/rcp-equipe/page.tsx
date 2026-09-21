"use client";
// v3.7 — وضع قيادة فريق الإنعاش: مؤقّت رئيسي + أوامر مسجّلة زمنياً + تذكيرات دورية.
import { useEffect, useState } from "react";
import { useMetronome, useWakeLock } from "@/lib/hooks";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

type EvType = "epi" | "choc" | "relais" | "rythme";

const EV: { id: EvType; fr: string; ar: string; periodSec: number | null }[] = [
  { id: "epi", fr: "Adrénaline 1 mg", ar: "أدرنالين 1 ملغ", periodSec: 240 },
  { id: "choc", fr: "Choc", ar: "صدمة", periodSec: null },
  { id: "rythme", fr: "Analyse du rythme", ar: "تحليل الإيقاع", periodSec: 120 },
];

export default function RcpEquipePage() {
  useRegisterRecent("calculateur:rcp-equipe");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ type: EvType; at: number }[]>([]);
  const metro = useMetronome(110);
  useWakeLock(chrono.start !== null);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const stamp = (type: EvType) => {
    setEvents((e) => [{ type, at: now }, ...e]);
    setNow((n) => n);
  };

  const lastOf = (type: EvType) => events.find((e) => e.type === type)?.at ?? null;

  const sinceR = now - (lastOf("rythme") ?? 0);
  const guide = now < 1
    ? { fr: "Commencez le massage maintenant — 100-120/min", ar: "ابدأ التدليك الآن — 100-120/د" }
    : (lastOf("epi") !== null ? now - lastOf("epi")! : now) >= 240
      ? { fr: "Adrénaline 1 mg maintenant", ar: "أدرنالين 1 ملغ الآن" }
      : sinceR >= 120
        ? { fr: "Analyse du rythme maintenant", ar: "حلّل الإيقاع الآن" }
        : { fr: "Poursuivez le massage", ar: "واصل التدليك" };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant RCP individuel" ar="مساعد الإنعاش الفردي" /></h1>

      <p role="status" className="rounded-2xl border border-red-600 bg-red-600/15 p-4 text-lg font-black text-red-500">
        <T fr={`Maintenant : ${guide.fr}`} ar={`الآن: ${guide.ar}`} />
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
            <button key={ev.id} onClick={() => stamp(ev.id)}
              className={`touch flex flex-col items-center gap-1 rounded-2xl border p-4 font-black ${late ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
              <span><T fr={ev.fr} ar={ev.ar} /></span>
              <span className="text-xs font-bold opacity-70 tabular-nums" dir="ltr">
                {since === null ? "—" : `${fmtMMSS(since)}`}
              </span>
            </button>
          );
        })}
      </div>

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({events.length})</span></h2>
        {events.length === 0 ? (
          <p className="text-sm opacity-60"><T fr="Chaque geste annoncé est horodaté automatiquement." ar="كل إجراء مُعلن يُؤرّخ تلقائياً." /></p>
        ) : (
          <ul className="space-y-1 text-sm font-bold">
            {events.map((e, i) => {
              const ev = EV.find((x) => x.id === e.type)!;
              return (
                <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                  <span><T fr={ev.fr} ar={ev.ar} /></span>
                  <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(e.at)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {events.length > 0 && (
        <button onClick={() => {
          const txt = fmtJournal(lang === "ar" ? "سجل الإنعاش" : "Journal RCP", [...events].reverse().map((e) => ({ label: lang === "ar" ? EV.find((x) => x.id === e.type)!.ar : EV.find((x) => x.id === e.type)!.fr, at: e.at })));
          navigator.clipboard?.writeText(txt);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Rappels: adrénaline 3-5 min, rythme toutes les 2 min." ar="تذكيرات: أدرنالين كل 3-5 د، إيقاع كل دقيقتين." /></p>
    </div>
  );
}

"use client";
// v4.3 — مساعد فرط الأفيون الفردي: نالوكسون بإعادات مؤرّخة كل 2-3 د + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

export default function OpioidesPage() {
  useRegisterRecent("calculateur:opioides");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [voie, setVoie] = useState<"im" | "in">("im");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<number[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const dose = voie === "im" ? "0,4 mg" : "4 mg";
  const last = events.length ? events[0] : null;
  const since = last === null ? null : now - last;
  const redose = since !== null && since >= 180;

  const stamp = () => setEvents((e) => [now, ...e]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant surdosage opioïde individuel" ar="مساعد فرط الأفيون الفردي" /></h1>

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
        <div className="flex gap-2">
          <button onClick={() => setVoie("im")} aria-pressed={voie === "im"}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${voie === "im" ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="IM/IV 0,4 mg" ar="عضلياً/وريدياً 0,4 ملغ" />
          </button>
          <button onClick={() => setVoie("in")} aria-pressed={voie === "in"}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${voie === "in" ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Intranasal 4 mg" ar="بداخل الأنف 4 ملغ" />
          </button>
        </div>
        <p className="mt-2 text-sm font-black text-blue-500" dir="ltr">{`Naloxone ${dose} · répéter q2-3 min jusqu'à ventilation efficace`}</p>
      </div>

      <button onClick={stamp}
        className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${redose ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
        <span><T fr="Naloxone administrée" ar="أُعطي النالوكسون" /> <span className="text-xs opacity-70 tabular-nums" dir="ltr">({dose})</span></span>
        <span className="tabular-nums text-sm" dir="ltr">{since === null ? "—" : fmtMMSS(since)}</span>
      </button>

      {redose && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 3 min sans reprise ventilatoire: répéter le naloxone." ar="≥ 3 د دون استئناف التنفس: كرر النالوكسون." />
        </p>
      )}

      <p className="rounded-xl bg-amber-500/10 p-3 text-sm font-bold text-amber-500">
        <T fr="Ventilation (bouche-à-bouche/BAVU) d'abord; demi-vie courte du naloxone → surveiller 2-4 h (récidive). Sources: OMS naloxone 2023, ERC 2021." ar="التهوية أولاً؛ عمر النالوكسون قصير → راقب 2-4 س (نكسة). المصادر: OMS 2023 وERC 2021." />
      </p>

      {events.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({events.length})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {events.map((at, i) => (
              <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                <span>{lang === "ar" ? `نالوكسون ${dose}` : `Naloxone ${dose}`}</span>
                <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {events.length > 0 && (
        <button onClick={() => {
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل النالوكسون" : "Journal naloxone", [...events].reverse().map((at) => ({ label: lang === "ar" ? `نالوكسون ${dose}` : `Naloxone ${dose}`, at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}
    </div>
  );
}

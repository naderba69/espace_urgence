"use client";
// v4.9 — مساعد انسحاب الكحول الفردي: علامات مبسطة + ديازيبام مؤرّخ بإعادات كل ساعة + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

const SIGNS: { id: string; fr: string; ar: string }[] = [
  { id: "tremble", fr: "Tremblements", ar: "رجفان" },
  { id: "sueurs", fr: "Sueurs", ar: "تعرق" },
  { id: "agitation", fr: "Agitation/anxiété", ar: "هياج/قلق" },
  { id: "nausee", fr: "Nausées/vomissements", ar: "غثيان/إقياء" },
  { id: "tachy", fr: "Pouls > 100", ar: "نبض > 100" },
];

export default function SevrageAlcoolPage() {
  useRegisterRecent("calculateur:sevrage-alcool");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [signs, setSigns] = useState<Record<string, boolean>>({});
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<number[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const n = SIGNS.filter((s) => signs[s.id]).length;
  const sev = n <= 1 ? 0 : n <= 3 ? 1 : 2;
  const REC = [
    { fr: "Léger: surveillance + thiamine PO.", ar: "خفيف: مراقبة + ثيامين فموياً." },
    { fr: "Modéré: diazépam 10 mg PO symptom-triggered.", ar: "متوسط: ديازيبام 10 ملغ فموياً حسب الأعراض." },
    { fr: "Sévère: diazépam IV titré + hospitalisation (delirium tremens ?).", ar: "شديد: ديازيبام وريدياً معايرةً + إدخال (هذيان ارتعاشي؟)." },
  ][sev];

  const lastDose = events.length ? events[0] : null;
  const since = lastDose === null ? null : now - lastDose;
  const revalLate = since !== null && since >= 3600;

  const stamp = () => setEvents((e) => [now, ...e]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant sevrage alcool individuel" ar="مساعد انسحاب الكحول الفردي" /></h1>

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
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setEvents([]); setSigns({}); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <div className="flex flex-wrap gap-2">
          {SIGNS.map((s) => (
            <button key={s.id} onClick={() => setSigns((x) => ({ ...x, [s.id]: !x[s.id] }))} aria-pressed={!!signs[s.id]}
              className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${signs[s.id] ? "border-amber-500 bg-amber-500/15 text-amber-500" : "border-line"}`}>
              {lang === "ar" ? s.ar : s.fr}
            </button>
          ))}
        </div>
        <p className={`mt-3 rounded-xl p-3 text-sm font-black ${sev === 2 ? "bg-red-600/15 text-red-500" : sev === 1 ? "bg-amber-500/10 text-amber-500" : "bg-blue-600/15 text-blue-500"}`}>
          {lang === "ar" ? REC.ar : REC.fr}
        </p>
      </div>

      <button onClick={stamp}
        className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${revalLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
        <span><T fr="Diazépam administré" ar="أُعطي الديازيبام" /></span>
        <span className="tabular-nums text-sm" dir="ltr">{since === null ? "—" : fmtMMSS(since)}</span>
      </button>

      {revalLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 1 h: réévaluer (symptom-triggered) et redoser si besoin." ar="≥ 1 س: أعد التقييم (حسب الأعراض) وأعد الجرعة عند الحاجة." />
        </p>
      )}

      {events.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({events.length})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {events.map((at, i) => (
              <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                <span><T fr="Diazépam" ar="ديازيبام" /></span>
                <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {events.length > 0 && (
        <button onClick={() => {
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الانسحاب" : "Journal sevrage alcool", [...events].reverse().map((at) => ({ label: lang === "ar" ? "ديازيبام" : "Diazépam", at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Thiamine avant tout glucosé; rechercher trauma/hématome sous-dural. Sources: ASAM 2020, CIWA-Ar." ar="ثيامين قبل أي غلوكوز؛ ابحث عن رضخ/ورم دموي تحت الجافية. المصادر: ASAM 2020 وCIWA-Ar." /></p>
    </div>
  );
}

"use client";
// v4.8 — مساعد انخفاض الحرارة الفردي: تصنيف سويسري + تدفئة مؤرّخة + إعادة قياس كل 30 د + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Timer } from "lucide-react";

type Stage = 1 | 2 | 3 | 4;

const STAGES: { id: Stage; fr: string; ar: string; temp: string; mgmtFr: string; mgmtAr: string }[] = [
  { id: 1, fr: "I: conscient, frissons", ar: "أ: واعٍ مع قشعريرة", temp: "32-35", mgmtFr: "Réchauffement passif + boissons chaudes, mouvement.", mgmtAr: "تدفئة سلبية + مشروبات دافئة وحركة." },
  { id: 2, fr: "II: conscient, sans frissons", ar: "ب: واعٍ دون قشعريرة", temp: "28-32", mgmtFr: "Réchauffement actif externe (couverture soufflante).", mgmtAr: "تدفئة نشطة خارجية (غطاء هوائي ساخن)." },
  { id: 3, fr: "III: inconscient", ar: "ج: فاقد الوعي", temp: "24-28", mgmtFr: "Voie aérienne + réchauffement actif interne (centre ECMO si instable).", mgmtAr: "مجرى هواء + تدفئة نشطة داخلية (مركز ECMO إن كان غير مستقر)." },
  { id: 4, fr: "IV: sans signes vitaux", ar: "د: بلا علامات حيوية", temp: "< 24", mgmtFr: "RCP + ECMO/CPC — « personne n'est mort avant d'être réchauffé ».", mgmtAr: "إنعاش + ECMO — «لا أحد ميتاً قبل أن يُدفّأ»." },
];

export default function HypothermiePage() {
  useRegisterRecent("calculateur:hypothermie");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [stage, setStage] = useState<Stage>(1);
  const [t, setT] = useState("");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ at: number; fr: string; ar: string }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const tempIn = parseFloat(t);
  const okT = Number.isFinite(tempIn) && tempIn >= 20 && tempIn <= 42;

  const lastRecheck = events.find((e) => e.ar.startsWith("إعادة قياس"))?.at ?? null;
  const since = lastRecheck === null ? null : now - lastRecheck;
  const recheckLate = since !== null && since >= 1800;

  const st = STAGES.find((s) => s.id === stage)!;

  const stamp = (fr: string, ar: string) => setEvents((e) => [{ at: now, fr, ar }, ...e]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Timer className="h-6 w-6" />}
        title={<T fr="Assistant hypothermie individuel" ar="مساعد انخفاض الحرارة الفردي" />}
        sub={<T fr="Stades, rechauffement et pieges de la reprise de perfusion." ar="المراحل، التدفئة ومصائد استئناف الإرواء." />}
      />
      <div className="card flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface p-3 text-sm font-bold">
        <span className="font-black opacity-70"><T fr="Rechauffement:" ar="التدفئة:" /></span>
        <span><T fr="couvertures chaudes + O2 rechauffe; perfusions a 40-42 C." ar="أغطية دافئة + أكسجين مدفأ؛ سوائل عند ٤٠-٤٢°." /></span>
        <Link href="/calculateurs/coup-chaleur" className="rounded-full border px-3 py-1 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
          <T fr="Vers: coup de chaleur" ar="إلى: ضربة الحر" />
        </Link>
      </div>

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
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <button key={s.id} onClick={() => setStage(s.id)} aria-pressed={stage === s.id}
              className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${stage === s.id ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
              {lang === "ar" ? s.ar : s.fr}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm font-black text-blue-500" dir="ltr">{`${st.temp} °C`}</p>
        <p className="mt-1 rounded-xl bg-blue-600/10 p-3 text-sm font-bold text-blue-500">{lang === "ar" ? st.mgmtAr : st.mgmtFr}</p>
      </div>

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <label className="mb-1 block text-sm font-bold opacity-70"><T fr="Température (°C)" ar="الحرارة (°م)" /></label>
        <input value={t} onChange={(e) => setT(e.target.value)} inputMode="decimal" placeholder="30"
          className="w-28 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => stamp("Réchauffement démarré", "بدأت التدفئة")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Réchauffement démarré" ar="بدأت التدفئة" />
        </button>
        <button onClick={() => { if (okT) stamp(`Recontrôle T° ${tempIn.toFixed(1)} °C`, `إعادة قياس ${tempIn.toFixed(1)}°`); }} disabled={!okT}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${!okT ? "border-line opacity-40" : recheckLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Recontrôle T°" ar="إعادة قياس الحرارة" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{since === null ? "—" : fmtMMSS(since)}</span>
        </button>
      </div>

      {recheckLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 30 min: recontrôler la température !" ar="≥ 30 د: أعد قياس الحرارة!" />
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
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الحرارة" : "Journal hypothermie", [...events].reverse().map((e) => ({ label: lang === "ar" ? e.ar : e.fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Manipulations douces (fibrillation); ECG continu; perfusions chaudes. Source: ERC 2021 hypothermie." ar="مناورات لطيفة (رجفان)؛ تخطيط مستمر؛ محاليل دافئة. المصدر: ERC 2021." /></p>
    </div>
  );
}

"use client";
// v5.0 — مساعد الشقيقة الحادة الفردي: ميتوكلوبراميد + كيتوبروفين مؤرّخان + إعادة تقييم 60 د + أعلام + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import NowBanner from "@/components/NowBanner";

type EvType = "mcp" | "ains" | "triptan";

const FLAGS: { id: string; fr: string; ar: string }[] = [
  { id: "tonnerre", fr: "Céphalée tonnerre", ar: "صداع رعدي" },
  { id: "fievre", fr: "Fièvre / raideur nucale", ar: "حمى / صلابة نقرة" },
  { id: "deficit", fr: "Déficit neurologique", ar: "عجز عصبي" },
];

export default function MigrainePage() {
  useRegisterRecent("calculateur:migraine");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ type: EvType; at: number }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const nFlags = FLAGS.filter((f) => flags[f.id]).length;

  const lastTrait = events.length ? events[0].at : null;
  const since = lastTrait === null ? null : now - lastTrait;
  const revalLate = since !== null && since >= 3600;

  const stamp = (type: EvType) => setEvents((e) => [{ type, at: now }, ...e]);

  const LABEL: Record<EvType, { fr: string; ar: string }> = {
    mcp: { fr: "Métoclopramide 10 mg IV", ar: "ميتوكلوبراميد 10 ملغ وريدياً" },
    ains: { fr: "Kétoprofène 100 mg IV", ar: "كيتوبروفين 100 ملغ وريدياً" },
    triptan: { fr: "Sumatriptan 6 mg SC", ar: "سوماتريبتان 6 ملغ تحت الجلد" },
  };

  const guide = lastTrait === null
    ? { fr: "MCP 10 mg IV + kétoprofène maintenant", ar: "MCP 10 ملغ وريدياً + كيتوبروفين الآن" }
    : now - lastTrait >= 3600
      ? { fr: "Réévaluation maintenant (60 min) ± triptan", ar: "إعادة تقييم الآن (60 د) ± تريبتان" }
      : { fr: "Poursuivez le traitement", ar: "واصل العلاج" };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant migraine aiguë individuel" ar="مساعد الشقيقة الحادة الفردي" /></h1>
      <NowBanner fr={guide.fr} ar={guide.ar} />

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

      {nFlags > 0 && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr={`${nFlags} drapeau(x) : imagerie ± PL avant traitement symptomatique.`} ar={`${nFlags} علم: تصوير ± بزل قطني قبل المعالجة العرضية.`} />
        </p>
      )}

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => stamp("mcp")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Métoclopramide 10 mg IV" ar="ميتوكلوبراميد 10 ملغ وريدياً" />
        </button>
        <button onClick={() => stamp("ains")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Kétoprofène 100 mg IV" ar="كيتوبروفين 100 ملغ وريدياً" />
        </button>
        <button onClick={() => stamp("triptan")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Sumatriptan 6 mg SC (si échec)" ar="سوماتريبتان 6 ملغ تحت الجلد (عند الفشل)" />
        </button>
      </div>

      {revalLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 60 min: réévaluer la douleur (EVA) et reconsidérer le diagnostic." ar="≥ 60 د: أعد تقييم الألم (سلم بصري) وأعد النظر في التشخيص." />
        </p>
      )}

      {events.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({events.length})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {events.map((e, i) => (
              <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                <span>{lang === "ar" ? LABEL[e.type].ar : LABEL[e.type].fr}</span>
                <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(e.at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {events.length > 0 && (
        <button onClick={() => {
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الشقيقة" : "Journal migraine", [...events].reverse().map((e) => ({ label: lang === "ar" ? LABEL[e.type].ar : LABEL[e.type].fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Pièce sombre + hydratation; éviter opioïdes. Sources: EFNS/AHS 2021." ar="غرفة مظلمة + إماهة؛ تجنّب الأفيونات. المصادر: EFNS/AHS 2021." /></p>
    </div>
  );
}

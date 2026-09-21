"use client";
// v4.9 — مساعد الهياج الحاد الفردي: تهدئة لفظية ثم أدوية مؤرّخة + إعادة تقييم حمراء + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import NowBanner from "@/components/NowBanner";

type EvType = "verbal" | "halo" | "mida" | "reval";

export default function AgitationPage() {
  useRegisterRecent("calculateur:agitation");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ type: EvType; at: number }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const lastAny = events.length ? events[0].at : null;
  const since = lastAny === null ? null : now - lastAny;
  const revalLate = since !== null && since >= 1800;

  const stamp = (type: EvType) => setEvents((e) => [{ type, at: now }, ...e]);

  const LABEL: Record<EvType, { fr: string; ar: string }> = {
    verbal: { fr: "Dé-escalade verbale tentée", ar: "محاولة تهدئة لفظية" },
    halo: { fr: "Halopéridol 5 mg IM", ar: "هالوبيريدول 5 ملغ عضلياً" },
    mida: { fr: "Midazolam 5 mg IM", ar: "ميدازولام 5 ملغ عضلياً" },
    reval: { fr: "Réévaluation (sédation, sécurité)", ar: "إعادة تقييم (تهدئة، سلامة)" },
  };

  const lastMed = events.find((e) => e.type === "halo" || e.type === "mida")?.at ?? null;
  const lastReval = events.find((e) => e.type === "reval")?.at ?? null;
  const guide = events.length === 0
    ? { fr: "Dé-escalade verbale maintenant", ar: "تهدئة لفظية الآن" }
    : lastMed !== null && (lastReval === null || lastReval < lastMed) && now - lastMed >= 1800
      ? { fr: "Réévaluation maintenant (30 min)", ar: "إعادة تقييم الآن (30 د)" }
      : { fr: "Surveillance rapprochée", ar: "مراقبة لصيقة" };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant agitation aiguë individuel" ar="مساعد الهياج الحاد الفردي" /></h1>
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
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setEvents([]); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => stamp("verbal")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Dé-escalade verbale (1ʳᵉ ligne)" ar="تهدئة لفظية (الخط الأول)" />
        </button>
        <button onClick={() => stamp("halo")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Halopéridol 5 mg IM" ar="هالوبيريدول 5 ملغ عضلياً" />
        </button>
        <button onClick={() => stamp("mida")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Midazolam 5 mg IM" ar="ميدازولام 5 ملغ عضلياً" />
        </button>
        <button onClick={() => stamp("reval")}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${revalLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Réévaluation (sédation, sécurité)" ar="إعادة تقييم (تهدئة، سلامة)" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{since === null ? "—" : fmtMMSS(since)}</span>
        </button>
      </div>

      {revalLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 30 min: réévaluer sédation et sécurité; contention = dernier recours." ar="≥ 30 د: أعد تقييم التهدئة والسلامة؛ التقييد = آخر خيار." />
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
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الهياج" : "Journal agitation", [...events].reverse().map((e) => ({ label: lang === "ar" ? LABEL[e.type].ar : LABEL[e.type].fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Éliminer hypoxie, hypoglycémie, intoxication; ECG si halopéridol (QT). Source: ACEP 2021 agitation." ar="استبعد نقص أكسجين، نقص سكر، تسمماً؛ تخطيط عند هالوبيريدول (QT). المصدر: ACEP 2021." /></p>
    </div>
  );
}

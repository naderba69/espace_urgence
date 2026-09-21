"use client";
// v4.7 — مساعد التمنّك الفردي: قرار حسب نوع الجرح وحالة التلقيح + إعطاء مؤرّخ + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

type Wound = "clean" | "prone";
type Hist = "recent" | "old" | "unknown";

export default function TetanosPage() {
  useRegisterRecent("calculateur:tetanos");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [wound, setWound] = useState<Wound>("clean");
  const [hist, setHist] = useState<Hist>("recent");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ at: number; fr: string; ar: string }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const rec =
    wound === "clean" && hist === "recent" ? { fr: "Rien à faire (rappel < 10 ans).", ar: "لا شيء مطلوب (مذكّر < 10 سنوات).", act: false }
    : wound === "clean" && hist === "old" ? { fr: "Rappel Td/Tdap seul.", ar: "مذكّر Td/Tdap فقط.", act: true }
    : wound === "clean" && hist === "unknown" ? { fr: "Débuter/compléter la primovaccination.", ar: "بدء/إكمال التلقيح الأولي.", act: true }
    : wound === "prone" && hist === "recent" ? { fr: "Rien à faire (rappel < 5 ans).", ar: "لا شيء مطلوب (مذكّر < 5 سنوات).", act: false }
    : wound === "prone" && hist === "old" ? { fr: "Rappel Td/Tdap seul.", ar: "مذكّر Td/Tdap فقط.", act: true }
    : { fr: "Rappel Td/Tdap + Ig antitétaniques 250 UI IM (autre site).", ar: "مذكّر Td/Tdap + غلوبولينات مناعية 250 وحدة عضلياً (موضع آخر).", act: true };

  const stamp = (labelFr: string, labelAr: string) => setEvents((e) => [{ at: now, fr: labelFr, ar: labelAr }, ...e]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant tétanos individuel" ar="مساعد الكزاز الفردي" /></h1>

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
        <div className="mb-2 flex flex-wrap gap-2">
          <button onClick={() => setWound("clean")} aria-pressed={wound === "clean"}
            className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${wound === "clean" ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Plaie propre/minime" ar="جرح نظيف/بسيط" />
          </button>
          <button onClick={() => setWound("prone")} aria-pressed={wound === "prone"}
            className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${wound === "prone" ? "border-red-600 bg-red-600/15 text-red-500" : "border-line"}`}>
            <T fr="Plaie à risque (souillée, écrasée, morsure…)" ar="جرح خطر (ملوث، سحق، عضّ…)" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setHist("recent")} aria-pressed={hist === "recent"}
            className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${hist === "recent" ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="≥ 3 doses, rappel récent" ar="≥ 3 جرعات ومذكّر حديث" />
          </button>
          <button onClick={() => setHist("old")} aria-pressed={hist === "old"}
            className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${hist === "old" ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="≥ 3 doses, rappel ancien" ar="≥ 3 جرعات ومذكّر قديم" />
          </button>
          <button onClick={() => setHist("unknown")} aria-pressed={hist === "unknown"}
            className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${hist === "unknown" ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="< 3 doses / inconnu" ar="< 3 جرعات / مجهول" />
          </button>
        </div>
        <p className={`mt-3 rounded-xl p-3 text-sm font-black ${rec.act ? "bg-amber-500/10 text-amber-500" : "bg-blue-600/15 text-blue-500"}`}>
          {lang === "ar" ? rec.ar : rec.fr}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => stamp("Rappel Td/Tdap administré", "أُعطي المذكّر Td/Tdap")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Rappel Td/Tdap administré" ar="أُعطي المذكّر Td/Tdap" />
        </button>
        <button onClick={() => stamp("Ig antitétaniques 250 UI IM", "غلوبولينات الكزاز 250 وحدة عضلياً")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Ig antitétaniques 250 UI IM" ar="غلوبولينات الكزاز 250 وحدة عضلياً" />
        </button>
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
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الكزاز" : "Journal tétanos", [...events].reverse().map((e) => ({ label: lang === "ar" ? e.ar : e.fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Nettoyage + parage priment; Ig à l'autre bras. Sources: CDC/ACIP 2020, Tintinalli 9e éd." ar="التنضير والتنظيف أولاً؛ الغلوبولينات بالذراع الأخرى. المصادر: CDC 2020 وTintinalli 9." /></p>
    </div>
  );
}

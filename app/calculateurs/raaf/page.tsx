"use client";
// v4.6 — مساعد الرعاف الفردي: ضغط أمامي مؤرّخ 10-15 د مع إعادة تقييم حمراء + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

type EvType = "compress" | "oxy" | "reval";

export default function RaafPage() {
  useRegisterRecent("calculateur:raaf");
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

  const lastCompress = events.find((e) => e.type === "compress")?.at ?? null;
  const lastRevalAfter = events.find((e) => e.type === "reval" && (lastCompress === null || e.at >= lastCompress))?.at ?? null;
  const sinceCompress = lastCompress === null ? null : now - lastCompress;
  const pressLate = lastCompress !== null && lastRevalAfter === null && sinceCompress !== null && sinceCompress >= 900;

  const stamp = (type: EvType) => setEvents((e) => [{ type, at: now }, ...e]);

  const LABEL: Record<EvType, { fr: string; ar: string }> = {
    compress: { fr: "Compression pincée des ailes (tête penchée en avant)", ar: "ضغط جانبيّ الأنف (رأس مائل للأمام)" },
    oxy: { fr: "Oxymétazoline locale", ar: "أوكسيميتازولين موضعي" },
    reval: { fr: "Réévaluation: saignement arrêté ?", ar: "إعادة تقييم: توقف النزف؟" },
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant épistaxis individuel" ar="مساعد الرعاف الفردي" /></h1>

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
        <button onClick={() => stamp("compress")}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${pressLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Compression démarrée (10-15 min)" ar="بدأ الضغط (10-15 د)" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{sinceCompress === null ? "—" : fmtMMSS(sinceCompress)}</span>
        </button>
        <button onClick={() => stamp("oxy")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Oxymétazoline locale" ar="أوكسيميتازولين موضعي" />
        </button>
        <button onClick={() => stamp("reval")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Réévaluation: arrêté ? sinon mèche/ORL" ar="إعادة تقييم: توقف؟ وإلا حشو/أنف-أذن-حنجرة" />
        </button>
      </div>

      {pressLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 15 min de compression: réévaluer — persistance = mèche antérieure / avis ORL." ar="≥ 15 د من الضغط: أعد التقييم — الاستمرار = حشو أمامي / رأي أنف-أذن-حنجرة." />
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
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الرعاف" : "Journal épistaxis", [...events].reverse().map((e) => ({ label: lang === "ar" ? LABEL[e.type].ar : LABEL[e.type].fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Tête penchée en avant (pas en arrière); INR/antiagrégants à vérifier. Source: AAO-HNS 2020." ar="الرأس للأمام (لا للخلف)؛ تحقق من INR/مضادات الصفيحات. المصدر: AAO-HNS 2020." /></p>
    </div>
  );
}

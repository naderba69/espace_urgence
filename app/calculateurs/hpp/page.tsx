"use client";
// v4.3 — مساعد نزف ما بعد الولادة الفردي: أوكسيتوسين/تمسيد/ترانكساميك مؤرّخون + نوافذ حمراء + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

type EvType = "oxy" | "massage" | "txa" | "txa2";

export default function HppPage() {
  useRegisterRecent("calculateur:hpp");
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

  const lastOf = (t: EvType) => events.find((e) => e.type === t)?.at ?? null;
  const sinceMassage = lastOf("massage") === null ? null : now - (lastOf("massage") as number);
  const massageLate = sinceMassage !== null && sinceMassage >= 900;
  const txaAt = lastOf("txa");
  const txaLate = txaAt === null && now >= 10800;
  const sinceTxa = txaAt === null ? null : now - txaAt;
  const txa2Due = sinceTxa !== null && sinceTxa >= 1800 && lastOf("txa2") === null;

  const stamp = (t: EvType) => setEvents((e) => [{ type: t, at: now }, ...e]);

  const LABEL: Record<EvType, { fr: string; ar: string }> = {
    oxy: { fr: "Ocytocine 10 UI IM/IV", ar: "أوكسيتوسين 10 وحدات عضلياً/وريدياً" },
    massage: { fr: "Massage utérin / réévaluation", ar: "تمسيد رحمي / إعادة تقييم" },
    txa: { fr: "Acide tranexamique 1 g IV (20 min)", ar: "حمض الترانكساميك 1 غ وريدياً (20 د)" },
    txa2: { fr: "2ᵉ dose ATX 1 g IV", ar: "جرعة ثانية ترانكساميك 1 غ وريدياً" },
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant HPP individuel" ar="مساعد نزف ما بعد الولادة الفردي" /></h1>

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

      {txaLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 3 h: l'ATX perd son bénéfice — administrer sans délai si saignement actif." ar="≥ 3 س: يفقد الترانكساميك فائدته — أعطِه فوراً إن كان النزف نشطاً." />
        </p>
      )}

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => stamp("oxy")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Ocytocine 10 UI" ar="أوكسيتوسين 10 وحدات" />
        </button>
        <button onClick={() => stamp("massage")}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${massageLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Massage utérin / réévaluation" ar="تمسيد رحمي / إعادة تقييم" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{sinceMassage === null ? "—" : fmtMMSS(sinceMassage)}</span>
        </button>
        <button onClick={() => stamp("txa")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Acide tranexamique 1 g IV" ar="حمض الترانكساميك 1 غ وريدياً" />
        </button>
        <button onClick={() => stamp("txa2")} disabled={!txa2Due}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${txa2Due ? "border-red-600 bg-red-600/15 text-red-500" : "border-line opacity-40"}`}>
          <span><T fr="2ᵉ dose ATX (saignement persistant ≥ 30 min)" ar="جرعة ثانية (نزف مستمر ≥ 30 د)" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{sinceTxa === null ? "—" : fmtMMSS(sinceTxa)}</span>
        </button>
      </div>

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
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل النزف" : "Journal HPP", [...events].reverse().map((e) => ({ label: lang === "ar" ? LABEL[e.type].ar : LABEL[e.type].fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Deux voies veineuses + bilan; recherche de cause (les 4 T). Sources: OMS HPP 2012, essai WOMAN (Lancet 2017), FIGO 2022." ar="طريقان وريديان + تحاليل؛ ابحث عن السبب (التياءات الأربع). المصادر: OMS 2012، دراسة WOMAN (لانسِت 2017)، FIGO 2022." /></p>
    </div>
  );
}

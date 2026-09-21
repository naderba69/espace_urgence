"use client";
// v4.9 — مساعد المغص الكلوي الفردي: مضاد التهاب مؤرّخ + إعادة تقييم 30 د + أعلام تدخل + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import NowBanner from "@/components/NowBanner";

const FLAGS: { id: string; fr: string; ar: string }[] = [
  { id: "fievre", fr: "Fièvre / sepsis", ar: "حمى / إنتان" },
  { id: "anurie", fr: "Anurie / rein unique", ar: "انقطاع بول / كلية وحيدة" },
  { id: "ira", fr: "Insuffisance rénale", ar: "قصور كلوي" },
  { id: "douleur", fr: "Douleur rebelle", ar: "ألم معاند" },
];

export default function ColiquePage() {
  useRegisterRecent("calculateur:colique");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ at: number; fr: string; ar: string }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const nFlags = FLAGS.filter((f) => flags[f.id]).length;

  const lastAins = events.find((e) => e.ar.includes("مضاد الالتهاب"))?.at ?? null;
  const since = lastAins === null ? null : now - lastAins;
  const revalLate = since !== null && since >= 1800;

  const stamp = (fr: string, ar: string) => setEvents((e) => [{ at: now, fr, ar }, ...e]);

  const guide = lastAins === null
    ? { fr: "AINS maintenant (1ʳ ligne)", ar: "مضاد التهاب الآن (الخط الأول)" }
    : now - lastAins >= 1800
      ? { fr: "Réévaluation maintenant (30 min)", ar: "إعادة تقييم الآن (30 د)" }
      : { fr: "Poursuivez l'antalgie", ar: "واصل التسكين" };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <NowBanner fr={guide.fr} ar={guide.ar} />

      <h1 className="text-2xl font-extrabold"><T fr="Assistant colique néphrétique individuel" ar="مساعد المغص الكلوي الفردي" /></h1>

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
          <T fr={`${nFlags} drapeau(x) : avis urologie + décompression à discuter (urgence).`} ar={`${nFlags} علم: رأي مسالك + نقاش تفخيخ (إسعافي).`} />
        </p>
      )}

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => stamp("Kétoprofène 100 mg IV (ou diclofénac 75 mg IM)", "مضاد التهاب: كيتوبروفين 100 ملغ وريدياً (أو ديكلوفيناك 75 عضلياً)")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="AINS administré (1ʳᵉ ligne)" ar="أُعطي مضاد الالتهاب (الخط الأول)" />
        </button>
        <button onClick={() => stamp("Réévaluation douleur", "إعادة تقييم الألم")}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${revalLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Réévaluation douleur" ar="إعادة تقييم الألم" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{since === null ? "—" : fmtMMSS(since)}</span>
        </button>
      </div>

      {revalLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 30 min: réévaluer la douleur (2ᵉ ligne opioïde si besoin)." ar="≥ 30 د: أعد تقييم الألم (أفيوني كخط ثانٍ عند الحاجة)." />
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
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل المغص الكلوي" : "Journal colique néphrétique", [...events].reverse().map((e) => ({ label: lang === "ar" ? e.ar : e.fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="ECBU + créatinine + imagerie; alpha-bloquants discutés (expulsion). Source: EAU 2023." ar="زرع بول + كرياتينين + تصوير؛ حاصرات ألفا لنفي الحصوة الصغيرة. المصدر: EAU 2023." /></p>
    </div>
  );
}

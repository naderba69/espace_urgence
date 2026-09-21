"use client";
// v4.3 — مساعد نوبة الربو الحادة الفردي: جرعات بالوزن + نبذات مؤرّخة كل 20 د + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import PageHeader from "@/components/ui/PageHeader";
import { Wind } from "lucide-react";

type EvType = "neb" | "cort" | "mg";

export default function AsthmePage() {
  useRegisterRecent("calculateur:asthme");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [w, setW] = useState("");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ type: EvType; at: number }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const weight = parseFloat(w);
  const ok = Number.isFinite(weight) && weight > 0;
  const salb = ok ? (weight < 20 ? 2.5 : 5) : 0;
  const ipra = ok ? (weight < 20 ? 250 : 500) : 0;
  const pred = ok ? Math.min(40, Math.round(weight * 2)) : 0;
  const mg = ok ? Math.min(2000, Math.round(weight * 50)) : 0;

  const lastNeb = events.find((e) => e.type === "neb")?.at ?? null;
  const sinceNeb = lastNeb === null ? null : now - lastNeb;
  const nebLate = sinceNeb !== null && sinceNeb >= 1200;

  const stamp = (type: EvType) => setEvents((e) => [{ type, at: now }, ...e]);

  const LABEL: Record<EvType, { fr: string; ar: string }> = {
    neb: { fr: `Nébulisation salbutamol ${salb} mg + ipratropium ${ipra} µg`, ar: `رذّة سالبوتامول ${salb} ملغ + إبراتروبيوم ${ipra} مكغ` },
    cort: { fr: `Corticoïde : prednisolone ${pred} mg PO`, ar: `كورتيكويد: بريدنيزولون ${pred} ملغ فموياً` },
    mg: { fr: `MgSO4 IV ${mg} mg sur 20 min`, ar: `كبريتات المغنيزيوم وريدياً ${mg} ملغ على 20 د` },
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Wind className="h-6 w-6" />}
        title={<T fr="Assistant crise d'asthme individuel" ar="مساعد نوبة الربو الفردي" />}
        sub={<T fr="Nébulisations, corticoïde, magnésium — escalade sûre." ar="إرذاذ، كورتيزون، مغنيزيوم — تصعيد آمن." />}
      />

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
        <label className="mb-1 block text-sm font-bold opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></label>
        <input value={w} onChange={(e) => setW(e.target.value)} inputMode="decimal" placeholder="18"
          className="w-28 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
        {ok && (
          <ul className="mt-3 space-y-1 text-sm font-black text-blue-500" dir="ltr">
            <li>{`Salbutamol néb. ${salb} mg (± ipratropium ${ipra} µg) q20 min ×3`}</li>
            <li>{`Prednisolone PO ${pred} mg (2 mg/kg, max 40)`}</li>
            <li>{`MgSO4 IV ${mg} mg (50 mg/kg, max 2 g) si grave`}</li>
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => stamp("neb")} disabled={!ok}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${!ok ? "border-line opacity-40" : nebLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Nébulisation" ar="رذّة" /> {ok && <span className="text-xs opacity-70 tabular-nums" dir="ltr">({salb} mg)</span>}</span>
          <span className="tabular-nums text-sm" dir="ltr">{sinceNeb === null ? "—" : fmtMMSS(sinceNeb)}</span>
        </button>
        <button onClick={() => stamp("cort")} disabled={!ok}
          className={`touch rounded-2xl border p-4 font-black ${!ok ? "border-line opacity-40" : "border-line bg-surface"}`}>
          <T fr="Corticoïde administré" ar="أُعطي الكورتيكويد" />
        </button>
        <button onClick={() => stamp("mg")} disabled={!ok}
          className={`touch rounded-2xl border p-4 font-black ${!ok ? "border-line opacity-40" : "border-line bg-surface"}`}>
          <T fr="MgSO4 administré (crise grave)" ar="أُعطي المغنيزيوم (نوبة شديدة)" />
        </button>
      </div>

      {nebLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 20 min: réévaluer et répéter la nébulisation si besoin." ar="≥ 20 د: أعد التقييم وكرر الرذّة عند الحاجة." />
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
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الربو" : "Journal asthme", [...events].reverse().map((e) => ({ label: lang === "ar" ? LABEL[e.type].ar : LABEL[e.type].fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="O2 si SpO2 < 94 %; réévaluation continue (silence auscultatoire = aggravation). Source: GINA 2023." ar="أكسجين إن تشبع < 94٪؛ إعادة تقييم مستمرة (صمت الإصغاء = تدهور). المصدر: GINA 2023." /></p>
    </div>
  );
}

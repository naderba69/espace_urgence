"use client";
// v4.5 — مساعد الاحتباس البولي الحاد الفردي: تأريخ التفريغ والحجم + مراقبة ما بعد التفريغ + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

export default function RauPage() {
  useRegisterRecent("calculateur:rau");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [v, setV] = useState("");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [vidanges, setVidanges] = useState<{ at: number; vol: number }[]>([]);
  const [reevals, setReevals] = useState<number[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const vol = parseFloat(v);
  const okV = Number.isFinite(vol) && vol > 0;
  const lastVid = vidanges[0] ?? null;
  const sinceVid = lastVid === null ? null : now - lastVid.at;
  const highVol = lastVid !== null && lastVid.vol >= 1000;
  const reevalLate = highVol && sinceVid !== null && sinceVid >= 3600 && reevals.length === 0;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant RAU individuel" ar="مساعد الاحتباس البولي الفردي" /></h1>

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
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setVidanges([]); setReevals([]); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <label className="mb-1 block text-sm font-bold opacity-70"><T fr="Volume vidé (mL)" ar="الحجم المفرّغ (مل)" /></label>
        <input value={v} onChange={(e) => setV(e.target.value)} inputMode="numeric" placeholder="900"
          className="w-28 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
      </div>

      <button onClick={() => { setVidanges((x) => [{ at: now, vol }, ...x]); setV(""); }} disabled={!okV}
        className={`touch rounded-2xl border p-4 font-black ${!okV ? "border-line opacity-40" : "border-line bg-surface"}`}>
        <T fr="Vidange effectuée (sondage)" ar="تم التفريغ (قَثطرة)" />
      </button>

      {highVol && (
        <p className="rounded-xl bg-amber-500/10 p-3 text-sm font-bold text-amber-500">
          <T fr={`≥ 1000 mL vidangés : surveiller diurèse post-obstructive + créatinin ; pas de clampage de routine.`} ar={`فُرّغ ≥ 1000 مل: راقب diurèse ما بعد الانسداد والكرياتينين؛ لا إغلاق اعتيادياً للقثطار.`} />
        </p>
      )}

      {highVol && (
        <button onClick={() => setReevals((r) => [now, ...r])}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${reevalLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Réévaluation (diurèse, créat, TA)" ar="إعادة تقييم (بول، كرياتينين، ضغط)" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{sinceVid === null ? "—" : fmtMMSS(sinceVid)}</span>
        </button>
      )}

      {reevalLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 1 h après vidange ≥ 1 L: réévaluation due !" ar="≥ 1 س بعد تفريغ ≥ 1 ل: إعادة التقييم مستحقة!" />
        </p>
      )}

      {vidanges.length + reevals.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({vidanges.length + reevals.length})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {[...vidanges.map((x) => ({ at: x.at, label: lang === "ar" ? `تفريغ ${x.vol} مل` : `Vidange ${x.vol} mL` })),
              ...reevals.map((at) => ({ at, label: lang === "ar" ? "إعادة تقييم" : "Réévaluation" }))]
              .sort((a, b) => b.at - a.at)
              .map((e, i) => (
                <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                  <span>{e.label}</span>
                  <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(e.at)}</span>
                </li>
              ))}
          </ul>
        </section>
      )}

      {vidanges.length + reevals.length > 0 && (
        <button onClick={() => {
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الاحتباس" : "Journal RAU", [...vidanges.map((x) => ({ at: x.at, label: lang === "ar" ? `تفريغ ${x.vol} مل` : `Vidange ${x.vol} mL` })), ...reevals.map((at) => ({ at, label: lang === "ar" ? "إعادة تقييم" : "Réévaluation" }))].sort((a, b) => a.at - b.at)));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="ECBU + créatinin systématiques; hématurie post-décompression fréquente et bénigne. Source: EAU 2023." ar="زرع بول + كرياتينين منهجياً؛ بيلة دموية بعد التفريغ شائعة وحميدة. المصدر: EAU 2023." /></p>
    </div>
  );
}

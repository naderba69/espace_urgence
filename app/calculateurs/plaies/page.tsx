"use client";
// v4.6 — مساعد الجروح والخياطة الفردي: ليدوكائين بالوزن + تاريخ فك الخيوط حسب المنطقة + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

type Region = "face" | "cuir" | "tronc" | "membres" | "artic";

const REGIONS: { id: Region; fr: string; ar: string; days: number }[] = [
  { id: "face", fr: "Visage 3-5 j", ar: "وجه 3-5 أيام", days: 4 },
  { id: "cuir", fr: "Cuir chevelu 7-10 j", ar: "فروة 7-10 أيام", days: 8 },
  { id: "tronc", fr: "Tronc 10-14 j", ar: "جذع 10-14 يوماً", days: 12 },
  { id: "membres", fr: "Membres 10-14 j", ar: "أطراف 10-14 يوماً", days: 12 },
  { id: "artic", fr: "Articulations 14 j", ar: "مفاصل 14 يوماً", days: 14 },
];

export default function PlaiesPage() {
  useRegisterRecent("calculateur:plaies");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [w, setW] = useState("");
  const [region, setRegion] = useState<Region>("face");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [sutures, setSutures] = useState<{ at: number; region: Region; removal: string }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const weight = parseFloat(w);
  const ok = Number.isFinite(weight) && weight > 0;
  const maxPlain = ok ? Math.min(300, Math.round(weight * 4.5)) : 0;
  const maxEpi = ok ? Math.min(500, Math.round(weight * 7)) : 0;
  const mlPlain = ok ? Math.round(maxPlain / 10) : 0;

  const reg = REGIONS.find((r) => r.id === region)!;

  const stamp = () => {
    const removal = new Date(Date.now() + reg.days * 86400000).toISOString().slice(0, 10);
    setSutures((s) => [{ at: now, region, removal }, ...s]);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant plaies & suture individuel" ar="مساعد الجروح والخياطة الفردي" /></h1>

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
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setSutures([]); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <label className="mb-1 block text-sm font-bold opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></label>
        <input value={w} onChange={(e) => setW(e.target.value)} inputMode="decimal" placeholder="60"
          className="w-28 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
        {ok && (
          <ul className="mt-3 space-y-1 text-sm font-black text-blue-500" dir="ltr">
            <li>{`Lidocaïne 1 % sans adrénaline : max ${maxPlain} mg = ${mlPlain} mL`}</li>
            <li>{`Avec adrénaline : max ${maxEpi} mg`}</li>
          </ul>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <button key={r.id} onClick={() => setRegion(r.id)} aria-pressed={region === r.id}
              className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${region === r.id ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
              {lang === "ar" ? r.ar : r.fr}
            </button>
          ))}
        </div>
      </div>

      <button onClick={stamp}
        className="touch rounded-2xl border border-line bg-surface p-4 font-black">
        <T fr="Suture effectuée" ar="تمت الخياطة" />
      </button>

      {sutures.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({sutures.length})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {sutures.map((s, i) => {
              const r = REGIONS.find((x) => x.id === s.region)!;
              return (
                <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                  <span>{lang === "ar" ? r.ar : r.fr} · <span className="tabular-nums" dir="ltr">{s.removal}</span></span>
                  <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(s.at)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {sutures.length > 0 && (
        <button onClick={() => {
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الخياطة" : "Journal sutures", [...sutures].reverse().map((s) => { const r = REGIONS.find((x) => x.id === s.region)!; return { label: `${lang === "ar" ? r.ar : r.fr} → ablation ${s.removal}`, at: s.at }; })));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Irrigation abondante + vérification tétanos; anesthésie: tamponner avant d'injecter. Source: Tintinalli 9e éd." ar="غسيل وفير + تحقق من الكزاز؛ التخدير: ارشّ قبل الحقن. المصدر: Tintinalli الطبعة 9." /></p>
    </div>
  );
}

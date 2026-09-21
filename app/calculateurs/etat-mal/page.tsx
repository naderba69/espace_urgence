"use client";
// v4.4 — مساعد الحالة الصرعية الفردي: خط أول/ثانٍ بجرعات الوزن مع نافذة 20 د حمراء + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import PageHeader from "@/components/ui/PageHeader";
import { Timer } from "lucide-react";

type L1 = "mida" | "lora" | "diaz";
type L2 = "leve" | "valp" | "fosp";

export default function EtatMalPage() {
  useRegisterRecent("calculateur:etat-mal");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [w, setW] = useState("");
  const [l1, setL1] = useState<L1>("mida");
  const [l2, setL2] = useState<L2>("leve");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [given, setGiven] = useState<{ l1?: number; l2?: number }>({});

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const weight = parseFloat(w);
  const ok = Number.isFinite(weight) && weight > 0;

  const L1_DOSE: Record<L1, { fr: string; ar: string; mg: number }> = {
    mida: { fr: `Midazolam IM ${ok ? Math.min(10, +(weight * 0.2).toFixed(1)) : "—"} mg (0,2 mg/kg)`, ar: `ميدازولام عضلياً ${ok ? Math.min(10, +(weight * 0.2).toFixed(1)) : "—"} ملغ (0,2 ملغ/كغ)`, mg: ok ? Math.min(10, +(weight * 0.2).toFixed(1)) : 0 },
    lora: { fr: `Lorazépam IV ${ok ? Math.min(4, +(weight * 0.1).toFixed(1)) : "—"} mg (0,1 mg/kg)`, ar: "لورازيبام وريدياً " + (ok ? Math.min(4, +(weight * 0.1).toFixed(1)) : "—") + " ملغ (0,1 ملغ/كغ)", mg: ok ? Math.min(4, +(weight * 0.1).toFixed(1)) : 0 },
    diaz: { fr: `Diazépam IV ${ok ? Math.min(10, +(weight * 0.3).toFixed(1)) : "—"} mg (0,15-0,3 mg/kg)`, ar: `ديازيبام وريدياً ${ok ? Math.min(10, +(weight * 0.3).toFixed(1)) : "—"} ملغ (0,15-0,3 ملغ/كغ)`, mg: ok ? Math.min(10, +(weight * 0.3).toFixed(1)) : 0 },
  };
  const L2_DOSE: Record<L2, { fr: string; ar: string; mg: number }> = {
    leve: { fr: `Lévétiracétam ${ok ? Math.min(4500, Math.round(weight * 60)) : "—"} mg (60 mg/kg)`, ar: `ليفيتيراسيتام ${ok ? Math.min(4500, Math.round(weight * 60)) : "—"} ملغ (60 ملغ/كغ)`, mg: ok ? Math.min(4500, Math.round(weight * 60)) : 0 },
    valp: { fr: `Valproate ${ok ? Math.min(3000, Math.round(weight * 40)) : "—"} mg (40 mg/kg)`, ar: `فالبروات ${ok ? Math.min(3000, Math.round(weight * 40)) : "—"} ملغ (40 ملغ/كغ)`, mg: ok ? Math.min(3000, Math.round(weight * 40)) : 0 },
    fosp: { fr: `Fosphénytoïne ${ok ? Math.min(1500, Math.round(weight * 20)) : "—"} mg EP (20 mg EP/kg)`, ar: `فوسفينيتوين ${ok ? Math.min(1500, Math.round(weight * 20)) : "—"} ملغ (20 ملغ/كغ)`, mg: ok ? Math.min(1500, Math.round(weight * 20)) : 0 },
  };

  const l2Late = given.l2 === undefined && now >= 1200;

  const copy = () => {
    const lines: { label: string; at: number }[] = [];
    if (given.l1 !== undefined) lines.push({ label: lang === "ar" ? L1_DOSE[l1].ar : L1_DOSE[l1].fr, at: given.l1 });
    if (given.l2 !== undefined) lines.push({ label: lang === "ar" ? L2_DOSE[l2].ar : L2_DOSE[l2].fr, at: given.l2 });
    navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الصرع" : "Journal état de mal", lines));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Timer className="h-6 w-6" />}
        title={<T fr="Assistant état de mal individuel" ar="مساعد الحالة الصرعية الفردي" />}
        sub={<T fr="Ligne 1 puis ligne 2 — chaque minute compte." ar="خط أول ثم خط ثان — كل دقيقة تُحسب." />}
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
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setGiven({}); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <label className="mb-1 block text-sm font-bold opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></label>
        <input value={w} onChange={(e) => setW(e.target.value)} inputMode="decimal" placeholder="20"
          className="w-28 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
        <div className="mt-2 flex flex-wrap gap-2">
          {(["mida", "lora", "diaz"] as L1[]).map((k) => (
            <button key={k} onClick={() => setL1(k)} aria-pressed={l1 === k}
              className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${l1 === k ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
              {k === "mida" ? <T fr="Midazolam IM" ar="ميدازولام عضلياً" /> : k === "lora" ? <T fr="Lorazépam IV" ar="لورازيبام وريدياً" /> : <T fr="Diazépam IV" ar="ديازيبام وريدياً" />}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["leve", "valp", "fosp"] as L2[]).map((k) => (
            <button key={k} onClick={() => setL2(k)} aria-pressed={l2 === k}
              className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${l2 === k ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
              {k === "leve" ? <T fr="Lévétiracétam" ar="ليفيتيراسيتام" /> : k === "valp" ? <T fr="Valproate" ar="فالبروات" /> : <T fr="Fosphénytoïne" ar="فوسفينيتوين" />}
            </button>
          ))}
        </div>
        {ok && (
          <ul className="mt-3 space-y-1 text-sm font-black text-blue-500" dir="ltr">
            <li>{`1ʳᵉ ligne : ${L1_DOSE[l1].fr}`}</li>
            <li>{`2ᵉ ligne : ${L2_DOSE[l2].fr}`}</li>
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => setGiven((g) => ({ ...g, l1: now }))} disabled={!ok}
          className={`touch rounded-2xl border p-4 font-black ${!ok ? "border-line opacity-40" : given.l1 !== undefined ? "border-green-600 bg-green-600/10" : "border-line bg-surface"}`}>
          {lang === "ar" ? L1_DOSE[l1].ar : L1_DOSE[l1].fr} {given.l1 !== undefined && <span className="text-xs tabular-nums opacity-70" dir="ltr">· {fmtMMSS(given.l1)}</span>}
        </button>
        <button onClick={() => setGiven((g) => ({ ...g, l2: now }))} disabled={!ok}
          className={`touch rounded-2xl border p-4 font-black ${!ok ? "border-line opacity-40" : given.l2 !== undefined ? "border-green-600 bg-green-600/10" : l2Late ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          {lang === "ar" ? L2_DOSE[l2].ar : L2_DOSE[l2].fr} {given.l2 !== undefined && <span className="text-xs tabular-nums opacity-70" dir="ltr">· {fmtMMSS(given.l2)}</span>}
        </button>
      </div>

      {l2Late && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 20 min: 2ᵉ ligne due si crise persistante !" ar="≥ 20 د: الخط الثاني مستحق إن استمرت النوبة!" />
        </p>
      )}

      {(given.l1 !== undefined || given.l2 !== undefined) && (
        <button onClick={copy}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Glycémie + O2 + protection décubitus; 3ᵉ ligne = anesthésie (USI). Source: AES 2016 (Glauser)." ar="سكر + أكسجين + حماية من الاضطجاع؛ الخط الثالث = تخدير (عناية). المصدر: AES 2016." /></p>
    </div>
  );
}

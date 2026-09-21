"use client";
// v4.2 — مساعد الساعة الأولى للغدروفة الفردي: قرارات بوتاسيوم/أنسولين/غلوكوز + عناصر مؤرّخة + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS, dkaBolusMl, dkaInsulinUh, dkaKDecision, dkaNeedsDextrose } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

type Item = "bolus" | "insuline" | "potassium" | "dextrose" | "glycemie";

const ITEMS: { id: Item; fr: string; ar: string }[] = [
  { id: "bolus", fr: "Bolus NS (choc uniquement)", ar: "بولوس ملح (صدمة فقط)" },
  { id: "potassium", fr: "Potassium ajouté au soluté", ar: "أُضيف البوتاسيوم إلى المحلول" },
  { id: "insuline", fr: "Insuline IV démarrée", ar: "بدأ الأنسولين الوريدي" },
  { id: "dextrose", fr: "Glucosé ajouté (glycémie basse)", ar: "أُضيف الغلوكوز (سكر منخفض)" },
  { id: "glycemie", fr: "Glycémie + K contrôlés", ar: "فُحص السكر والبوتاسيوم" },
];

export default function DkaH1Page() {
  useRegisterRecent("calculateur:dka-h1");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [w, setW] = useState("");
  const [k, setK] = useState("");
  const [gly, setGly] = useState("");
  const [ped, setPed] = useState(true);
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [done, setDone] = useState<Record<string, number>>({});

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const weight = parseFloat(w); const kv = parseFloat(k); const glyv = parseFloat(gly);
  const okW = Number.isFinite(weight) && weight > 0;
  const okK = Number.isFinite(kv);
  const okG = Number.isFinite(glyv);

  const kDec = okK ? dkaKDecision(kv) : null;
  const insulinReady = kDec === "go";
  const needsDex = okG ? dkaNeedsDextrose(glyv) : null;

  const goLate = insulinReady && done.insuline === undefined && now >= 3600;

  const copy = () => {
    const lines = ITEMS.filter((it) => done[it.id] !== undefined).map((it) => ({ label: lang === "ar" ? it.ar : it.fr, at: done[it.id] }));
    navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الغدروفة" : "Journal DKA", lines));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant heure-1 DKA individuel" ar="مساعد الساعة الأولى للغدروفة الفردي" /></h1>

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
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setDone({}); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <div className="mb-2 flex gap-2">
          <button onClick={() => setPed(true)} aria-pressed={ped}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${ped ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Enfant" ar="طفل" />
          </button>
          <button onClick={() => setPed(false)} aria-pressed={!ped}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${!ped ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Adulte" ar="كبير" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <div>
            <label className="mb-1 block text-xs font-bold opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></label>
            <input value={w} onChange={(e) => setW(e.target.value)} inputMode="decimal" placeholder="30"
              className="w-24 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold opacity-70"><T fr="K (mmol/L)" ar="بوتاسيوم (ممول/ل)" /></label>
            <input value={k} onChange={(e) => setK(e.target.value)} inputMode="decimal" placeholder="4,5"
              className="w-24 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold opacity-70"><T fr="Glycémie (g/L)" ar="السكر (غ/ل)" /></label>
            <input value={gly} onChange={(e) => setGly(e.target.value)} inputMode="decimal" placeholder="4,0"
              className="w-24 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
          </div>
        </div>
        <ul className="mt-3 space-y-1 text-sm font-black" dir="ltr">
          {okW && <li className="text-blue-500">{`Bolus NS 10 mL/kg → ${dkaBolusMl(weight, ped)} mL (choc uniquement)`}</li>}
          {okW && <li className="text-blue-500">{`Insuline 0,1 U/kg/h → ${dkaInsulinUh(weight).toFixed(2)} U/h`}</li>}
          {okK && <li className={kDec === "hold" ? "text-red-500" : "text-blue-500"}>{`K ${kv} → ${kDec === "hold" ? "HOLD insuline : corriger K d'abord" : "GO insuline (K ≥ 3,3)"}`}</li>}
          {okG && <li className={needsDex ? "text-amber-500" : "text-blue-500"}>{`Glycémie ${glyv} g/L → ${needsDex ? "ajouter glucosé" : "pas de glucosé pour l'instant"}`}</li>}
        </ul>
      </div>

      {goLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="K ≥ 3,3 et insuline non démarrée dans l'heure !" ar="البوتاسيوم ≥ 3,3 والأنسولين لم يبدأ خلال الساعة!" />
        </p>
      )}

      <div className="flex flex-col gap-2">
        {ITEMS.map((it) => {
          const at = done[it.id];
          return (
            <button key={it.id} onClick={() => setDone((d) => (d[it.id] === undefined ? { ...d, [it.id]: now } : d))}
              className={`touch flex items-center justify-between gap-2 rounded-2xl border p-3 text-start font-bold ${at !== undefined ? "border-green-600 bg-green-600/10" : "border-line bg-surface"}`}>
              <span className="text-sm">{lang === "ar" ? it.ar : it.fr}</span>
              <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-black tabular-nums ${at !== undefined ? "bg-green-600/15 text-green-500" : "bg-surface2 opacity-70"}`} dir="ltr">
                {at !== undefined ? fmtMMSS(at) : "—"}
              </span>
            </button>
          );
        })}
      </div>

      {Object.keys(done).length > 0 && (
        <button onClick={copy}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Jamais de bolus systématique ni de bicarbonates; surveillance horaire glycémie/K. Sources: ISPAD 2022, BSPED/SFP 2018." ar="لا بولوس منهجياً ولا بيكربونات؛ مراقبة السكر والبوتاسيوم كل ساعة. المصادر: ISPAD 2022 وBSPED 2018." /></p>
    </div>
  );
}

"use client";
// CURB-65 — gravité de la pneumonie communautaire (5 lettres).
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";
import { curb65Outcome } from "@/lib/calc";

const CRITERIA = [
  { id: "c", letter: "C", fr: "Confusion nouvelle", ar: "تشوش وعر جديد" },
  { id: "u", letter: "U", fr: "Urémie > 7 mmol/L (BUN > 19 mg/dL)", ar: "يوريا >7 مليمول/ل (BUN >19)" },
  { id: "r", letter: "R", fr: "FR ≥ 30 /min", ar: "تنفس ≥30/د" },
  { id: "b", letter: "B", fr: "TA : PAS < 90 ou PAD ≤ 60 mmHg", ar: "ضغط: انقباضي <90 أو انبساطي ≤60" },
  { id: "a", letter: "65", fr: "Âge ≥ 65 ans", ar: "العمر ≥65 سنة" },
] as const;

const CONDUITES = [
  { max: 1, fr: "0–1 : faible gravité — traitement ambulatoire possible (réévaluer)", ar: "0–1: شدة منخفضة — علاج خارجي ممكن (أعد التقييم)", cls: "bg-teal-600" },
  { max: 2, fr: "2 : gravité intermédiaire — hospitalisation courte / surveillance étroite", ar: "2: متوسطة — دخول قصير / مراقبة لصيقة", cls: "bg-amber-500 text-black" },
  { max: 5, fr: "3–5 : pneumonie sévère — hospitalisation, discuter réanimation", ar: "3–5: شديدة — دخول وناقش الإنعاش", cls: "bg-red-600" },
] as const;

export default function Curb65Page() {
  const { t, lang } = useApp();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  useRegisterRecent("calculateur:curb65");

  const score = checked.size;
  const outcome = CONDUITES[curb65Outcome(score)];

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">CURB-65</h1>
        <PrintButton />
      </header>

      <div className="card flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        {CRITERIA.map((c) => {
          const on = checked.has(c.id);
          return (
            <button key={c.id} role="checkbox" aria-checked={on}
              onClick={() => { setChecked((p) => { const n = new Set(p); on ? n.delete(c.id) : n.add(c.id); return n; }); trackEvent("calculator_use", { id: "curb65" }); }}
              className={`touch justify-start gap-3 rounded-xl border px-4 py-3 text-start font-semibold ${on ? "border-teal-600 bg-teal-600/15 text-teal-400" : "border-line hover:bg-surface2"}`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-black ${on ? "bg-teal-600 text-white" : "bg-surface2"}`}>{c.letter}</span>
              <span><T fr={c.fr} ar={c.ar} /></span>
            </button>
          );
        })}

        <div className={`mt-2 rounded-2xl p-5 text-center text-white ${outcome.cls}`}>
          <p className="text-sm font-semibold opacity-90">{t("common.result")}</p>
          <p className="text-5xl font-black tabular-nums">{score}/5</p>
          <p className="mt-2 font-bold">{lang === "ar" ? outcome.ar : outcome.fr}</p>
        </div>

        <button onClick={() => setChecked(new Set())}
          className="touch self-start rounded-xl border border-line px-5 py-2 font-semibold hover:bg-surface2">
          {t("common.reset")}
        </button>
      </div>
      <p className="text-xs opacity-60">{t("common.disclaimer")}</p>
    </div>
  );
}

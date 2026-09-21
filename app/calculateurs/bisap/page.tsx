"use client";
// v8.3 — Score BISAP (pancréatite aiguë) : mortalité prédite dans les 48 h.
// 0-1 faible (< 2 %) ; 2 modérée ; 3 élevée (~ 5-10 %) ; 4-5 très élevée (> 15 %) → réanimation.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";

type Crit = { id: string; fr: string; ar: string };

const CRITS: Crit[] = [
  { id: "bun", fr: "BUN > 25 mg/dL (urée > 8,9 mmol/L)", ar: "يوريا > 25 ملغ/دل (> 8.9 م مول/ل)" },
  { id: "gcs", fr: "GCS < 15 (troubles de conscience)", ar: "‏GCS < 15 (اضطراب وعي)" },
  { id: "sirs", fr: "SIRS (2 critères sur 4: T°, FC, FR, GB)", ar: "‏SIRS (معياران من 4: حرارة، نبض، تنفس، بيض)" },
  { id: "age", fr: "Âge > 60 ans", ar: "العمر > 60 سنة" },
  { id: "pleural", fr: "Épanchement pleural (radio/TDM)", ar: "انصباب جنبي (صورة/طبقي)" },
];

export default function BisapPage() {
  const { lang } = useApp();
  const [on, setOn] = useState<Record<string, boolean>>({});
  useRegisterRecent("calculateur:bisap");

  const score = CRITS.reduce((s, c) => s + (on[c.id] ? 1 : 0), 0);
  const band = score >= 4
    ? { cls: "bg-red-600", fr: "BISAP 4-5: mortalité > 15-20 % — réanimation, monitorage des défaillances d'organes (Atlanta: défaillance > 48 h = forme grave)", ar: "‏BISAP 4-5: وفيات > 15-20% — إنعاش، مراقبة فشل الأعضاء (أتلانتا: فشل > 48 س = شكل شديد)" }
    : score === 3
      ? { cls: "bg-red-500", fr: "BISAP 3: mortalité ~ 5-10 % — hospitalisation en unité surveillée, réévaluation à 48 h (CRP, créatinine, SpO₂)", ar: "‏BISAP 3: وفيات ~ 5-10% — إدخال بوحدة مراقبة، إعادة تقييم بـ 48 س (‏CRP، كرياتينين، إشباع)" }
      : score === 2
        ? { cls: "bg-amber-500", fr: "BISAP 2: risque intermédiaire — hospitalisation conventionnelle, hydratation agressive, réévaluation clinique rapprochée", ar: "‏BISAP 2: خطر متوسط — إدخال عادي، إماهة مكثفة، إعادة تقييم سريرية لصيقة" }
        : { cls: "bg-blue-600", fr: "BISAP 0-1: mortalité < 2 % — prise en charge conventionnelle, alimentation reprise précocement, enquête étiologique (biliaire ?)", ar: "‏BISAP 0-1: وفيات < 2% — تدبير عادي، استئناف تغذية مبكر، تحري السبب (صفراوي؟)" };

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header>
        <h1 className="text-2xl font-extrabold"><T fr="Score BISAP — pancréatite aiguë" ar="سكور BISAP — التهاب البنكرياس الحاد" /></h1>
      </header>
      <div className="card flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
        {CRITS.map((c) => (
          <button key={c.id} onClick={() => { setOn((p) => ({ ...p, [c.id]: !p[c.id] })); trackEvent("calculator_use", { id: "bisap" }); }}
            className={`touch flex items-center gap-3 rounded-xl border px-4 py-3 text-start text-sm font-bold ${on[c.id] ? "border-red-500 bg-red-500/10 text-red-400" : "border-line hover:bg-surface2"}`}>
            <span className={`grid size-5 shrink-0 place-items-center rounded-full border text-xs ${on[c.id] ? "border-red-500 bg-red-500" : "border-line"}`}>{on[c.id] ? "✓" : ""}</span>
            <T fr={c.fr} ar={c.ar} />
          </button>
        ))}
        <div className={`rounded-2xl p-5 text-center text-white ${band.cls}`}>
          <p className="text-5xl font-black tabular-nums">{score}</p>
          <p className="mt-2 font-bold">{lang === "ar" ? band.ar : band.fr}</p>
        </div>
        <button onClick={() => setOn({})}
          className="touch self-start rounded-xl border border-line px-5 py-2 font-semibold hover:bg-surface2">
          <T fr="Réinitialiser" ar="تصفير" />
        </button>
      </div>
    </div>
  );
}

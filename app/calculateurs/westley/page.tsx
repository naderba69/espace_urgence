"use client";
// v8.1 — Score de Westley (croup) : gravité de la laryngite et décision adrénaline nébulisée.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";

type Grp = { id: string; label: { fr: string; ar: string }; opts: { id: string; pts: number; fr: string; ar: string }[] };

const GROUPS: Grp[] = [
  { id: "conscience", label: { fr: "Conscience", ar: "الوعي" }, opts: [
    { id: "c0", pts: 0, fr: "Normale", ar: "طبيعي" },
    { id: "c1", pts: 5, fr: "Troublée (agitation marquée, léthargie)", ar: "مضطرب (هياج شديد، خمول)" },
  ]},
  { id: "cyanose", label: { fr: "Cyanose", ar: "الزرقة" }, opts: [
    { id: "cy0", pts: 0, fr: "Absente", ar: "غائبة" },
    { id: "cy1", pts: 4, fr: "À l'agitation", ar: "عند الانفعال" },
    { id: "cy2", pts: 5, fr: "Au repos", ar: "بالراحة" },
  ]},
  { id: "stridor", label: { fr: "Stridor", ar: "الصرير" }, opts: [
    { id: "s0", pts: 0, fr: "Absent", ar: "غائب" },
    { id: "s1", pts: 1, fr: "À l'agitation", ar: "عند الانفعال" },
    { id: "s2", pts: 2, fr: "Au repos", ar: "بالراحة" },
  ]},
  { id: "tirage", label: { fr: "Tirage", ar: "السحب" }, opts: [
    { id: "t0", pts: 0, fr: "Absent", ar: "غائب" },
    { id: "t1", pts: 1, fr: "Léger", ar: "خفيف" },
    { id: "t2", pts: 2, fr: "Modéré", ar: "متوسط" },
    { id: "t3", pts: 3, fr: "Sévère", ar: "شديد" },
  ]},
  { id: "entree", label: { fr: "Entrée d'air", ar: "دخول الهواء" }, opts: [
    { id: "e0", pts: 0, fr: "Normale", ar: "طبيعي" },
    { id: "e1", pts: 1, fr: "Diminuée", ar: "ناقص" },
    { id: "e2", pts: 2, fr: "Très diminuée", ar: "ناقص جداً" },
  ]},
];

export default function WestleyPage() {
  const { lang } = useApp();
  const [sel, setSel] = useState<Record<string, string>>({ conscience: "c0", cyanose: "cy0", stridor: "s0", tirage: "t0", entree: "e0" });
  useRegisterRecent("calculateur:westley");

  const score = GROUPS.reduce((s, g) => s + (g.opts.find((o) => o.id === sel[g.id])?.pts ?? 0), 0);
  const band = score >= 8
    ? { cls: "bg-red-600", fr: "CROUP SÉVÈRE (≥ 8): adrénaline nébulisée immédiate + dexaméthasone, hospitalisation en surveillance continue, préparer intubation", ar: "خناق شديد (≥ 8): أدرينالين رذاذي فوري + ديكساميثازون، إدخال بمراقبة مستمرة، جهّز التنبيب" }
    : score >= 3
      ? { cls: "bg-amber-500", fr: "CROUP MODÉRÉ (3-7): adrénaline nébulisée + dexaméthasone 0,6 mg/kg, observation 2-4 h (rebond !)", ar: "خناق متوسط (3-7): أدرينالين رذاذي + ديكساميثازون 0.6 ملغ/كغ، مراقبة 2-4 س (ارتداد!)" }
      : { cls: "bg-blue-600", fr: "CROUP LÉGER (≤ 2): dexaméthasone 0,6 mg/kg dose unique, retour à domicile avec consignes", ar: "خناق خفيف (≤ 2): ديكساميثازون 0.6 ملغ/كغ بجرعة وحيدة، خروج مع تعليمات" };

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header>
        <h1 className="text-2xl font-extrabold"><T fr="Score de Westley — croup" ar="سكور ويستلي — الخناق" /></h1>
      </header>
      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        {GROUPS.map((g) => (
          <fieldset key={g.id}>
            <legend className="mb-1.5 text-sm font-black text-blue-500"><T fr={g.label.fr} ar={g.label.ar} /></legend>
            <div className="flex flex-wrap gap-1.5">
              {g.opts.map((o) => {
                const on = sel[g.id] === o.id;
                return (
                  <button key={o.id} onClick={() => { setSel((p) => ({ ...p, [g.id]: o.id })); trackEvent("calculator_use", { id: "westley" }); }}
                    className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${on ? "border-blue-600 bg-blue-600/15 text-blue-400" : "border-line hover:bg-surface2"}`}>
                    <T fr={o.fr} ar={o.ar} />{o.pts > 0 && ` (+${o.pts})`}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
        <div className={`rounded-2xl p-5 text-center text-white ${band.cls}`}>
          <p className="text-5xl font-black tabular-nums">{score}</p>
          <p className="mt-2 font-bold">{lang === "ar" ? band.ar : band.fr}</p>
        </div>
        <button onClick={() => setSel({ conscience: "c0", cyanose: "cy0", stridor: "s0", tirage: "t0", entree: "e0" })}
          className="touch self-start rounded-xl border border-line px-5 py-2 font-semibold hover:bg-surface2">
          <T fr="Réinitialiser" ar="تصفير" />
        </button>
      </div>
    </div>
  );
}

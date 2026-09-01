"use client";
// Wells pour embolie pulmonaire — score à 2 niveaux.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";
import { wellsEpLikely } from "@/lib/calc";

const ITEMS = [
  { id: "tvp", pts: 3, fr: "Signes cliniques de TVP (douleur+œdème)", ar: "علامات خثار وريدي عميق (ألم+ورم)" },
  { id: "diag", pts: 3, fr: "L'EP est le diagnostic le plus probable", ar: "الصمة الرئوية هي التشخيص الأرجح" },
  { id: "fc", pts: 1.5, fr: "FC > 100 /min", ar: "نبض >100/د" },
  { id: "immo", pts: 1.5, fr: "Chirurgie récente (<4 sem.) ou immobilisation >3 j", ar: "جراحة حديثة (<4 أسابيع) أو تثبيت >3 أيام" },
  { id: "atcd", pts: 1.5, fr: "Antécédent de TVP/EP", ar: "قصة خثار/صمة سابقة" },
  { id: "hemop", pts: 1, fr: "Hémoptysie", ar: "نفث دم" },
  { id: "cancer", pts: 1, fr: "Cancer évolutif (<6 mois)", ar: "سرطان نشط (<6 أشهر)" },
] as const;

export default function WellsPage() {
  const { t, lang } = useApp();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  useRegisterRecent("calculateur:wells-ep");

  const score = ITEMS.filter((i) => checked.has(i.id)).reduce((s, i) => s + i.pts, 0);
  const likely = wellsEpLikely(score);
  const interp = likely
    ? { fr: "EP probable (>4) — D-dimères non indiqués : angio-TDM / avis médical", ar: "صمة مرجّحة (>4) — لا معنى لـD-dimer: تصوير مقطعي وعائي / رأي طبيب", cls: "bg-red-600" }
    : { fr: "EP improbable (≤4) — D-dimères : si négatifs, EP exclue (selon contexte)", ar: "صمة غير مرجّحة (≤4) — D-dimer: إن سلبي تُستبعد (حسب السياق)", cls: "bg-teal-600" };

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Wells — Embolie pulmonaire" ar="ويلز — الصمة الرئوية" /></h1>
        <PrintButton />
      </header>

      <div className="card flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        {ITEMS.map((i) => {
          const on = checked.has(i.id);
          return (
            <button key={i.id} role="checkbox" aria-checked={on}
              onClick={() => { setChecked((p) => { const n = new Set(p); on ? n.delete(i.id) : n.add(i.id); return n; }); trackEvent("calculator_use", { id: "wells" }); }}
              className={`touch justify-between gap-3 rounded-xl border px-4 py-3 text-start font-semibold ${on ? "border-teal-600 bg-teal-600/15 text-teal-400" : "border-line hover:bg-surface2"}`}>
              <span><T fr={i.fr} ar={i.ar} /></span>
              <span className="shrink-0 font-black tabular-nums text-teal-500">+{i.pts}</span>
            </button>
          );
        })}

        <div className={`mt-2 rounded-2xl p-5 text-center text-white ${interp.cls}`}>
          <p className="text-sm font-semibold opacity-90">{t("common.result")}</p>
          <p className="text-5xl font-black tabular-nums">{score}</p>
          <p className="mt-2 font-bold">{lang === "ar" ? interp.ar : interp.fr}</p>
        </div>

        <button onClick={() => setChecked(new Set())}
          className="touch self-start rounded-xl border border-line px-5 py-2 font-semibold hover:bg-surface2">
          {t("common.reset")}
        </button>
      </div>
      <p className="text-xs opacity-60">
        <T fr="Version à 2 niveaux. Enceinte ou anticoagulé : adapter. Le score n'exclut pas seul."
           ar="نسخة بمستويين. حامل أو مُسيَّلة: كيّف. السكور وحده لا يستبعد." />
      </p>
    </div>
  );
}

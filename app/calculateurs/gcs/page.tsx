"use client";
// Glasgow interactif — adulte & pédiatrique (pré-verbal). Dernière saisie persistée.
import { useEffect, useState } from "react";
import { gcsAdult, gcsPediatric } from "@/data/calculators";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";
import { readJSON, writeJSON } from "@/lib/storage";
import { Baby, User } from "lucide-react";

const STORE = "eutn:calc:gcs";
type Sel = { eyes: number; verbal: number; motor: number };

export default function GcsPage() {
  const { t, lang, hydrated } = useApp();
  const [peds, setPeds] = useState(false);
  const [sel, setSel] = useState<Sel>({ eyes: 4, verbal: 5, motor: 6 });
  useRegisterRecent("calculateur:gcs");

  useEffect(() => {
    if (!hydrated) return;
    const saved = readJSON<{ peds: boolean; sel: Sel }>(STORE, null as never);
    if (saved?.sel) { setSel(saved.sel); setPeds(!!saved.peds); }
  }, [hydrated]);

  useEffect(() => {
    if (hydrated) writeJSON(STORE, { peds, sel });
  }, [peds, sel, hydrated]);

  const sections = peds ? gcsPediatric : gcsAdult;
  const total = sel.eyes + sel.verbal + sel.motor;
  const interp =
    total <= 8 ? { fr: "GCS ≤ 8 : menace des voies aériennes — envisager intubation", ar: "≤8: مسلك هوائي مهدَّد — فكّر في التنبيب", cls: "bg-red-600" }
    : total <= 12 ? { fr: "Altération modérée — surveillance rapprochée, avis médical", ar: "متوسط — مراقبة لصيقة ورأي طبيب", cls: "bg-amber-500 text-black" }
    : { fr: "Trouble léger — réévaluer régulièrement", ar: "خفيف — أعد التقييم دورياً", cls: "bg-teal-600" };

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">{t("gcs.title")}</h1>
        <PrintButton />
      </header>

      <div className="flex gap-2" role="group" aria-label="adulte/pédiatrie">
        <button
          onClick={() => setPeds(false)}
          aria-pressed={!peds}
          className={`touch flex-1 gap-2 rounded-xl border px-4 py-3 font-bold ${!peds ? "border-teal-600 bg-teal-600 text-white" : "border-line bg-surface hover:bg-surface2"}`}
        >
          <User className="h-5 w-5" aria-hidden /> {t("common.adult")}
        </button>
        <button
          onClick={() => setPeds(true)}
          aria-pressed={peds}
          className={`touch flex-1 gap-2 rounded-xl border px-4 py-3 font-bold ${peds ? "border-teal-600 bg-teal-600 text-white" : "border-line bg-surface hover:bg-surface2"}`}
        >
          <Baby className="h-5 w-5" aria-hidden /> {t("common.pediatric")}
        </button>
      </div>

      {sections.map((sec) => (
        <fieldset key={sec.id + (peds ? "-p" : "-a")} className="card rounded-2xl border border-line bg-surface p-4">
          <legend className="px-2 font-bold text-teal-500">
            <T fr={sec.title.fr} ar={sec.title.ar} />
          </legend>
          <div className="grid gap-2">
            {sec.options.map((o) => {
              const k = sec.id as keyof Sel;
              const checked = sel[k] === o.value;
              return (
                <button
                  key={o.value}
                  role="radio"
                  aria-checked={checked}
                  onClick={() => { setSel((s) => ({ ...s, [k]: o.value })); trackEvent("calculator_use", { id: "gcs" }); }}
                  className={`touch justify-between rounded-xl border px-4 py-3 text-start font-medium ${
                    checked ? "border-teal-600 bg-teal-600/15 text-teal-400" : "border-line hover:bg-surface2"
                  }`}
                >
                  <span><T fr={o.label.fr} ar={o.label.ar} /></span>
                  <span className="text-lg font-black tabular-nums">{o.value}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className={`rounded-2xl p-5 text-center text-white ${interp.cls}`}>
        <p className="text-sm font-semibold opacity-90">{t("common.result")}</p>
        <p className="text-5xl font-black tabular-nums">
          {total}<span className="text-2xl opacity-70">/15</span>
        </p>
        <p className="mt-2 font-bold">
          E{sel.eyes} · V{sel.verbal} · M{sel.motor}
        </p>
        <p className="mt-2 text-sm font-semibold">{lang === "ar" ? interp.ar : interp.fr}</p>
      </div>

      <button
        onClick={() => setSel({ eyes: 4, verbal: 5, motor: 6 })}
        className="touch self-start rounded-xl border border-line px-5 py-2 font-semibold hover:bg-surface2"
      >
        {t("common.reset")}
      </button>
    </div>
  );
}

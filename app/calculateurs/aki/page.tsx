"use client";
// v10.0-A4 — قصور الكلى الحاد : تصنيف KDIGO + ضبط جرعات.
import { useMemo, useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Droplets } from "lucide-react";

function Num({ label, value, onChange, step = "1" }: { label: string; value: string; onChange: (v: string) => void; step?: string }) {
  return (
    <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
      <span className="text-xs font-black opacity-70">{label}</span>
      <input type="number" inputMode="decimal" step={step} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-lg font-black tabular-nums outline-none" dir="ltr" />
    </label>
  );
}

const ADJUST: { name: string; fr: string; ar: string }[] = [
  { name: "HBPM", fr: "DFG < 30: dose préventive ou anti-Xa; éviter curatif.", ar: "ترشيح < ٣٠: جرعة وقائية أو مضاد-Xa؛ تجنّب العلاجية." },
  { name: "Metformine", fr: "DFG < 30: stopper (risque acidose lactique).", ar: "ترشيح < ٣٠: أوقف (خطر حماض لبني)." },
  { name: "Aminosides", fr: "Dose unique + dosage; espacer si DFG bas.", ar: "جرعة وحيدة + معايرة؛ باعد إن ترشيح منخفض." },
  { name: "Vancomycine", fr: "Toujours adapter au dosage résiduel.", ar: "كيّف دائماً حسب المستوى المتبقي." },
  { name: "AINS", fr: "À éviter en AKI.", ar: "تجنّبها في القصور الحاد." },
  { name: "IEC / ARA2", fr: "Suspendre pendant l'épisode aigu.", ar: "علّقها خلال النوبة الحادة." },
];

export default function AkiPage() {
  useRegisterRecent("calculateur:aki");
  const { lang } = useApp();
  const [base, setBase] = useState("");
  const [cur, setCur] = useState("");
  const [uo, setUo] = useState("");
  const [uoH, setUoH] = useState("");

  const r = useMemo(() => {
    const B = parseFloat(base), C = parseFloat(cur), U = parseFloat(uo), H = parseFloat(uoH);
    let stage = 0;
    if (Number.isFinite(B) && B > 0 && Number.isFinite(C)) {
      const ratio = C / B, delta = C - B; // µmol/L
      if (ratio >= 3 || C >= 353 || delta >= 265) stage = 3;
      else if (ratio >= 2) stage = 2;
      else if (ratio >= 1.5 || delta >= 26.5) stage = 1;
    }
    if (Number.isFinite(U) && Number.isFinite(H)) {
      if (U < 0.3 && H >= 24) stage = Math.max(stage, 3);
      else if (U < 0.5 && H >= 12) stage = Math.max(stage, 2);
      else if (U < 0.5 && H >= 6) stage = Math.max(stage, 1);
    }
    return { stage, hasCr: Number.isFinite(B) && Number.isFinite(C) && B > 0, hasUo: Number.isFinite(U) && Number.isFinite(H) };
  }, [base, cur, uo, uoH]);

  const LABEL = ["", lang === "ar" ? "مرحلة ١" : "Stade 1", lang === "ar" ? "مرحلة ٢" : "Stade 2", lang === "ar" ? "مرحلة ٣" : "Stade 3"];

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Droplets className="h-6 w-6" />}
        title={lang === "ar" ? "قصور الكلى الحاد — KDIGO" : "AKI — KDIGO"}
        sub={lang === "ar" ? "تصنيف بالكرياتينين والبيلة + ضبط جرعات." : "Stadification créatinine/diurèse + adaptation des doses."}
      />
      <section className="grid grid-cols-2 gap-2">
        <Num label={lang === "ar" ? "كرياتينين الأساس µmol/L" : "Créat. base µmol/L"} value={base} onChange={setBase} />
        <Num label={lang === "ar" ? "الكرياتينين الآن µmol/L" : "Créat. actuelle µmol/L"} value={cur} onChange={setCur} />
        <Num label={lang === "ar" ? "البيلة mL/kg/h" : "Diurèse mL/kg/h"} value={uo} onChange={setUo} step="0.1" />
        <Num label={lang === "ar" ? "منذ كم ساعة" : "Depuis (heures)"} value={uoH} onChange={setUoH} />
      </section>
      {(r.hasCr || r.hasUo) ? (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.stage === 3 ? "sev-critical" : r.stage === 2 ? "sev-urgent" : r.stage === 1 ? "sev-standard" : ""}`}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-lg font-black">{r.stage > 0 ? (lang === "ar" ? `KDIGO ${LABEL[r.stage]}` : `KDIGO ${LABEL[r.stage]}`) : (lang === "ar" ? "لا معيار AKI" : "Pas de critère AKI")}</p>
            <Badge tone={r.stage === 3 ? "critical" : r.stage === 2 ? "urgent" : r.stage === 1 ? "standard" : "neutral"}>
              {r.stage > 0 ? LABEL[r.stage] : (lang === "ar" ? "سوي" : "Normal")}
            </Badge>
          </div>
          <p className="mt-1 text-sm opacity-70">
            {r.stage === 3
              ? <T fr="Stade 3: néphrologie, éviter néphrotoxiques, préparer épuration si indication." ar="مرحلة ٣: استشر الكلى، تجنّب السموم الكلوية، حضّر التنقية عند الاستطباب." />
              : r.stage === 2
                ? <T fr="Stade 2: réévaluation quotidienne, adapter les doses." ar="مرحلة ٢: إعادة تقييم يومي وكيّف الجرعات." />
                : r.stage === 1
                  ? <T fr="Stade 1: rechercher la cause (prérénal ?), réhydratation raisonnée." ar="مرحلة ١: ابحث عن السبب (قبل كلوي؟) وأروِ بتعقل." />
                  : <T fr="Valeurs saisies sans critère KDIGO — recontrôler." ar="قيم مدخلة بلا معيار KDIGO — أعد الفحص." />}
          </p>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Entrez créatinine (base + actuelle) et/ou diurèse." ar="أدخل الكرياتينين (أساس + حالي) و/أو البيلة." />
        </p>
      )}
      <section className="flex flex-col gap-2">
        <p className="text-base font-black"><T fr="Adaptations rapides" ar="تكييفات سريعة" /></p>
        {ADJUST.map((a) => (
          <div key={a.name} className="card rounded-2xl border border-line bg-surface p-3">
            <p className="text-sm font-black">{a.name}</p>
            <p className="text-sm opacity-70">{lang === "ar" ? a.ar : a.fr}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

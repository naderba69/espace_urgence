"use client";
// v12.1-C — جسر الصيدلة للفشل الكلوي : Cockcroft-Gault + جدول تكييف الجرعات.
import { useMemo, useState } from "react";
import Link from "next/link";
import NumStepper from "@/components/ui/NumStepper";
import { useApp, usePrefillPatient } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import CalculationExplainer from "@/components/ai/CalculationExplainer";
import RenalCourseSelector from "@/components/renal/RenalCourseSelector";
import { ibwKg } from "@/lib/calc";
import { akiKdigo, scrToMgDl, type AkiResult, type RenalCourse } from "@/lib/renal-clearance";
import { Gauge } from "lucide-react";

const AKI_LABEL: Record<AkiResult["criteria"][number], { fr: string; ar: string }> = {
  "scr-up-48h": { fr: "+0,3 mg/dL en 48 h", ar: "+٠٫٣ مغ/دل في ٤٨ سا" },
  "scr-ratio-48h": { fr: "×1,5 en 48 h", ar: "×١٫٥ في ٤٨ سا" },
  "scr-ratio-7d": { fr: "×1,5 en 7 j", ar: "×١٫٥ في ٧ أيام" },
  "scr-4mg": { fr: "créatinine ≥4 mg/dL avec hausse aiguë ≥0,5 mg/dL", ar: "كرياتينين ≥4 مغ/دل مع ارتفاع حاد ≥0.5 مغ/دل" },
  "urine-stage-1": { fr: "diurèse <0,5 mL/kg/h pendant 6 à <12 h", ar: "إدرار <0.5 مل/كغ/سا لمدة من 6 إلى أقل من 12 ساعة" },
  "urine-stage-2": { fr: "diurèse <0,5 mL/kg/h pendant ≥12 h", ar: "إدرار <0.5 مل/كغ/سا لمدة ≥12 ساعة" },
  "urine-stage-3": { fr: "diurèse <0,3 mL/kg/h pendant ≥24 h", ar: "إدرار <0.3 مل/كغ/سا لمدة ≥24 ساعة" },
  "anuria-stage-3": { fr: "anurie pendant ≥12 h", ar: "انقطاع البول لمدة ≥12 ساعة" },
  "renal-replacement": { fr: "initiation d'une épuration extrarénale (critère KDIGO 3)", ar: "بدء الإحلال الكلوي (معيار KDIGO 3)" },
};

type Band = { fr: string; ar: string; range?: { fr: string; ar: string } };
type Row = {
  fr: string;
  ar: string;
  /** A dose is enabled only when both the product-specific source and its reviewed bands exist. */
  bands?: Band[];
  /** Seuils ClCr propres au RCP du médicament, classés du plus élevé au plus bas. */
  thresholds?: number[];
  note?: { fr: string; ar: string };
  source?: { fr: string; ar: string; url: string };
};

// Antibiotic shortcuts are routed to the complete, PDF-derived source table instead.
const ANTIBIOTIC_SEARCH: Record<string, { query: string; fr: string; ar: string }[]> = {
  Vancomycine: [{ query: "Vancomycine", fr: "Vancomycine", ar: "فانكومايسين" }],
  "Gentamicine / Amikacine": [
    { query: "Gentamicine", fr: "Gentamicine", ar: "جنتاميسين" },
    { query: "Amikacine", fr: "Amikacine", ar: "أميكاسين" },
  ],
  Ceftriaxone: [{ query: "Ceftriaxone", fr: "Ceftriaxone", ar: "سيفترياكسون" }],
  Ciprofloxacine: [{ query: "Ciprofloxacine", fr: "Ciprofloxacine", ar: "سيبروفلوكساسين" }],
  Lévofloxacine: [{ query: "Lévofloxacine", fr: "Lévofloxacine", ar: "ليفوفلوكساسين" }],
  Amoxicilline: [{ query: "Amoxicilline", fr: "Amoxicilline", ar: "أموكسيسيلين" }],
  Imipénème: [{ query: "Imipénème", fr: "Imipénème", ar: "إيميبينيم" }],
  Nitrofurantoïne: [{ query: "Nitrofurantoïne", fr: "Nitrofurantoïne", ar: "نيتروفورانتوين" }],
};

function parseInput(value: string) {
  return Number.parseFloat(String(value).replace(",", "."));
}

/**
 * Rules without a current product-specific source are intentionally represented by name only.
 * They remain visible as coverage gaps, but no legacy dose text is shipped or rendered.
 */
const ROWS: Row[] = [
  { fr: "Metformine", ar: "ميتفورمين" },
  { fr: "Énoxaparine curative", ar: "إينوكسابارين علاجي" },
  { fr: "Héparine non fractionnée", ar: "هيبارين غير مجزأ" },
  { fr: "Vancomycine", ar: "فانكومايسين" },
  { fr: "Gentamicine / Amikacine", ar: "جنتاميسين / أميكاسين" },
  { fr: "Ceftriaxone", ar: "سيفترياكسون" },
  { fr: "Ciprofloxacine", ar: "سيبروفلوكساسين" },
  { fr: "Lévofloxacine", ar: "ليفوفلوكساسين" },
  { fr: "Amoxicilline", ar: "أموكسيسيلين" },
  { fr: "Imipénème", ar: "إيميبينيم" },
  { fr: "Nitrofurantoïne", ar: "نيتروفورانتوين" },
  { fr: "Acyclovir", ar: "أسيكلوفير" },
  {
    fr: "Gabapentine",
    ar: "غابابنتين",
    thresholds: [80, 50, 30, 15],
    bands: [
      { fr: "900–3 600 mg/j, répartis en 3 prises.", ar: "٩٠٠–٣٦٠٠ مغ/ي، مقسمة على ٣ جرعات.", range: { fr: "ClCr ≥ 80 mL/min", ar: "CrCl ≥ ٨٠ مل/د" } },
      { fr: "600–1 800 mg/j, répartis en 3 prises.", ar: "٦٠٠–١٨٠٠ مغ/ي، مقسمة على ٣ جرعات.", range: { fr: "ClCr 50–79 mL/min", ar: "CrCl ٥٠–٧٩ مل/د" } },
      { fr: "300–900 mg/j, répartis en 3 prises.", ar: "٣٠٠–٩٠٠ مغ/ي، مقسمة على ٣ جرعات.", range: { fr: "ClCr 30–49 mL/min", ar: "CrCl ٣٠–٤٩ مل/د" } },
      { fr: "150–600 mg/j, en 3 prises. Pour 150 mg/j : 300 mg un jour sur deux.", ar: "١٥٠–٦٠٠ مغ/ي، على ٣ جرعات. لجرعة ١٥٠ مغ/ي: ٣٠٠ مغ يوماً بعد يوم.", range: { fr: "ClCr 15–29 mL/min", ar: "CrCl ١٥–٢٩ مل/د" } },
      { fr: "150–300 mg/j dans la catégorie < 15 ; réduire proportionnellement selon la ClCr.", ar: "١٥٠–٣٠٠ مغ/ي في فئة أقل من ١٥؛ تُخفّض الجرعة تناسبياً حسب ClCr.", range: { fr: "ClCr < 15 mL/min", ar: "CrCl < ١٥ مل/د" } },
    ],
    note: {
      fr: "La dose quotidienne est normalement répartie en 3 prises. Sous 15 mL/min, l'ajustement proportionnel n'est pas calculé ici. L'hémodialyse demande un schéma distinct et une dose après séance ; vérifier le RCP. Des gélules de 100 mg peuvent être nécessaires.",
      ar: "تُقسّم الجرعة اليومية عادةً على ٣ جرعات. دون ١٥ مل/د، لا تحسب هذه الأداة التخفيض التناسبي. للغسيل الدموي نظام خاص وجرعة بعد الجلسة؛ راجع النشرة. قد تلزم كبسولات ١٠٠ مغ.",
    },
    source: {
      fr: "RCP ANSM — GABAPENTINE ZENTIVA 400 mg, gélule (mis à jour le 17/09/2026)",
      ar: "النشرة الرسمية الفرنسية ANSM — GABAPENTINE ZENTIVA 400 mg (مراجعة 17/09/2026)",
      url: "https://base-donnees-publique.medicaments.gouv.fr/medicament/67350239/extrait",
    },
  },
  {
    fr: "Prégabaline",
    ar: "بريغابالين",
    thresholds: [60, 30, 15],
    bands: [
      { fr: "Début : 150 mg/j ; maximum : 600 mg/j, en 2 ou 3 prises.", ar: "البداية: ١٥٠ مغ/ي؛ الحد الأقصى: ٦٠٠ مغ/ي، على جرعتين أو ٣.", range: { fr: "ClCr ≥ 60 mL/min", ar: "CrCl ≥ ٦٠ مل/د" } },
      { fr: "Début : 75 mg/j ; maximum : 300 mg/j, en 2 ou 3 prises.", ar: "البداية: ٧٥ مغ/ي؛ الحد الأقصى: ٣٠٠ مغ/ي، على جرعتين أو ٣.", range: { fr: "ClCr 30–<60 mL/min", ar: "CrCl ٣٠–<٦٠ مل/د" } },
      { fr: "Début : 25–50 mg/j ; maximum : 150 mg/j, 1 prise/j ou 2.", ar: "البداية: ٢٥–٥٠ مغ/ي؛ الحد الأقصى: ١٥٠ مغ/ي، مرة أو مرتين يومياً.", range: { fr: "ClCr 15–<30 mL/min", ar: "CrCl ١٥–<٣٠ مل/د" } },
      { fr: "Début : 25 mg/j ; maximum : 75 mg/j, en 1 prise/j.", ar: "البداية: ٢٥ مغ/ي؛ الحد الأقصى: ٧٥ مغ/ي، مرة يومياً.", range: { fr: "ClCr < 15 mL/min", ar: "CrCl < ١٥ مل/د" } },
    ],
    note: {
      fr: "La dose quotidienne totale doit être divisée selon le nombre de prises indiqué. En hémodialyse, le RCP prévoit une dose supplémentaire unique de 25–100 mg immédiatement après une séance de 4 h ; elle n'est pas calculée par cette grille.",
      ar: "تُقسّم الجرعة اليومية حسب عدد الجرعات المذكور. في الغسيل الدموي، تذكر النشرة جرعة إضافية واحدة ٢٥–١٠٠ مغ مباشرةً بعد جلسة ٤ ساعات؛ لا تحسبها هذه القائمة.",
    },
    source: {
      fr: "RCP ANSM — PREGABALINE HCS 75 mg, gélule (mis à jour le 29/03/2024)",
      ar: "النشرة الرسمية الفرنسية ANSM — PREGABALINE HCS 75 mg (مراجعة 29/03/2024)",
      url: "https://base-donnees-publique.medicaments.gouv.fr/medicament/63754960/extrait",
    },
  },
  { fr: "Morphine et opioïdes", ar: "مورفين وأفيونيات" },
  { fr: "AINS", ar: "مضادات الالتهاب غير الستيروئيدية" },
  { fr: "Colchicine", ar: "كولشيسين" },
];

export default function RenalDosePage() {
  useRegisterRecent("calculateur:renal-dose");
  const { lang } = useApp();
  const [age, setAge] = useState("");
  const [wt, setWt] = useState("");
  const [ht, setHt] = useState("");
  const [sexe, setSexe] = useState<"m" | "f">("m");
  const [unit, setUnit] = useState<"mg" | "umol">("mg");
  const [scr, setScr] = useState("");
  const [scr48h, setScr48h] = useState("");
  const [scr7d, setScr7d] = useState("");
  const [urineRate, setUrineRate] = useState("");
  const [urineHours, setUrineHours] = useState("");
  const [renalCourse, setRenalCourse] = useState<RenalCourse>("unknown");
  const [onDialysis, setOnDialysis] = useState(false);
  const [rrtInitiated, setRrtInitiated] = useState(false);
  const [confirmedSuspiciousUnit, setConfirmedSuspiciousUnit] = useState<string | null>(null);
  usePrefillPatient((p) => {
    if (!wt && p.w) setWt(p.w);
    if (!age && p.age) setAge(p.age);
    if (!scr && p.scr) setScr(p.scr);
    if (p.sexe === "f") setSexe("f");
  });
  const [useIbw, setUseIbw] = useState(false);

  const ageValue = parseInput(age);
  const heightValue = parseInput(ht);
  const ibwValue = Number.isFinite(heightValue) && heightValue > 0 ? ibwKg(heightValue, sexe) : null;
  const invalidIbw = useIbw && (ibwValue === null || ibwValue <= 0);
  const rawCreatinineValues = [scr, scr48h, scr7d];
  const confirmationKey = `${unit}:${scr}:${scr48h}:${scr7d}`;
  const suspiciousMgUnit = unit === "mg" && rawCreatinineValues.some((raw) => {
    const value = parseInput(raw);
    return Number.isFinite(value) && value > 20;
  });
  const unitConfirmed = !suspiciousMgUnit || confirmedSuspiciousUnit === confirmationKey;
  const creatinineInputIssue = rawCreatinineValues.some((raw) => {
    if (!raw.trim()) return false;
    const value = parseInput(raw);
    return !Number.isFinite(value) || value <= 0;
  });
  const toMgDl = (raw: string): number | null => {
    const value = parseInput(raw);
    const converted = scrToMgDl(value, unit);
    if (converted.mgDl !== null) return converted.mgDl;
    return converted.suspectUnit && unitConfirmed ? value : null;
  };
  const currentScrMgDl = toMgDl(scr);
  const scr48hMgDl = toMgDl(scr48h);
  const scr7dMgDl = toMgDl(scr7d);

  const akiAssessment = useMemo(() => akiKdigo({
    scrNow: currentScrMgDl ?? Number.NaN,
    scr48h: scr48hMgDl,
    scr7d: scr7dMgDl,
    urineMlKgH: parseInput(urineRate),
    urineHours: parseInput(urineHours),
    renalReplacementTherapyInitiated: rrtInitiated,
  }), [currentScrMgDl, scr48hMgDl, scr7dMgDl, urineRate, urineHours, rrtInitiated]);

  const r = useMemo(() => {
    const A = ageValue, W = parseInput(wt), H = heightValue, S = currentScrMgDl;
    if (!Number.isFinite(A) || A < 18 || A >= 140 || !Number.isFinite(W) || W <= 0 || S === null || S <= 0) return null;
    if (!unitConfirmed || creatinineInputIssue || invalidIbw) return null;
    const ibw = Number.isFinite(H) && H > 0 ? ibwKg(H, sexe) : null;
    const weightUsed = useIbw ? Math.min(W, ibw ?? W) : W;
    const crcl = ((140 - A) * weightUsed * (sexe === "f" ? 0.85 : 1)) / (72 * S);
    if (!Number.isFinite(crcl) || crcl < 0) return null;
    return { crcl, mg: S, ibw, weightUsed };
  }, [ageValue, wt, heightValue, sexe, currentScrMgDl, unitConfirmed, creatinineInputIssue, invalidIbw, useIbw]);

  const doseContextEligible = Boolean(
    r && renalCourse === "stable" && akiAssessment.stage === 0 && !onDialysis && !useIbw && !invalidIbw && unitConfirmed && !creatinineInputIssue,
  );

  const cell = "flex flex-col gap-1 rounded-xl border border-line bg-surface p-3";

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Gauge className="h-6 w-6" />}
        title={lang === "ar" ? "جسر الصيدلة للفشل الكلوي" : "Bridge rénal pharmacologique"}
        sub={lang === "ar" ? "حساب Cockcroft–Gault للبالغين، مع تحويل المضادات إلى جدول PDF الكامل." : "Cockcroft–Gault chez l’adulte ; pour les antibiotiques, accès direct au tableau PDF complet."}
      />

      <section className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4 text-sm leading-relaxed">
        <p className="font-black text-blue-500">
          <T
            fr="Antibiotiques : utilisez le tableau dédié issu du PDF fourni (93 lignes × 5 stades). Son DFG et ses garde-fous sont calculés dans l’outil source ; ne transposez pas directement le résultat Cockcroft–Gault affiché ici."
            ar="المضادات الحيوية: استخدم الجدول المخصّص المستند إلى PDF المقدّم (٩٣ سطراً × ٥ مراحل). يُحسب DFG وضوابطه داخل الأداة المصدرية؛ لا تنقل نتيجة Cockcroft–Gault الظاهرة هنا مباشرةً إلى مراحل ذلك الجدول."
          />
        </p>
        <Link href="/calculateurs/antibio-renal" className="mt-3 inline-flex rounded-full border border-blue-500 px-4 py-2 font-black text-blue-500">
          <T fr="Ouvrir l’adaptation antibiotique OMEDIT" ar="افتح تكييف المضادات OMEDIT" />
        </Link>
      </section>

      <section className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-relaxed">
        <p className="font-bold text-amber-600">
          <T
            fr="Le PDF fourni ne couvre que les antibiotiques. Seules les lignes Gabapentine et Prégabaline disposent ici d’un RCP français officiel lié (produit et date indiqués) ; cela ne vaut pas validation tunisienne. Les anciennes lignes des autres médicaments sont gardées comme repères de couverture, mais leurs anciennes posologies ont été retirées et aucun dosage n’est activé sans source produit/population relue."
            ar="ملف PDF المقدّم يخصّ المضادات فقط. لا نفعّل هنا إلا سطري غابابنتين وبريغابالين المرتبطين بنشرة فرنسية رسمية (اسم المنتج والتاريخ مذكوران)، وهذا لا يعني اعتماداً تونسياً. أبقينا أسماء الأدوية الأخرى لحصر التغطية، وحذفنا جرعاتها القديمة؛ لن تُفعّل جرعة قبل مراجعة مصدر خاص بالمنتج والفئة."
          />
        </p>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Âge (ans)" ar="العمر (سنة)" /></span>
          <NumStepper value={ age } onValue={ setAge } className="field" label="age" /></label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></span>
          <NumStepper value={ wt } onValue={ setWt } className="field" label="wt" /></label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Taille (cm, option)" ar="الطول (سم، اختياري)" /></span>
          <NumStepper value={ ht } onValue={ setHt } className="field" label="ht" /></label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Créatinine actuelle" ar="الكرياتينين الحالي" /></span>
          <div className="flex items-center gap-2">
            <NumStepper value={scr} onValue={(value) => { setScr(value); setConfirmedSuspiciousUnit(null); }} className="field" label="scr" />
            <button onClick={() => { setUnit((u) => (u === "mg" ? "umol" : "mg")); setConfirmedSuspiciousUnit(null); }}
              className="shrink-0 rounded-lg border border-line px-2 py-1 text-xs font-black" dir="ltr">{unit === "mg" ? "mg/dL" : "µmol/L"}</button>
          </div>
        </label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Créatinine il y a 48 h (option)" ar="كرياتينين قبل ٤٨ سا (اختياري)" /></span>
          <NumStepper value={scr48h} onValue={(value) => { setScr48h(value); setConfirmedSuspiciousUnit(null); }} className="field" label="scr48" />
        </label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Créatinine il y a 7 j (option)" ar="كرياتينين قبل ٧ أيام (اختياري)" /></span>
          <NumStepper value={scr7d} onValue={(value) => { setScr7d(value); setConfirmedSuspiciousUnit(null); }} className="field" label="scr7d" />
        </label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Diurèse (mL/kg/h, option)" ar="إدرار البول (مل/كغ/سا، اختياري)" /></span>
          <NumStepper value={urineRate} onValue={setUrineRate} step={0.1} className="field" label="urine" />
        </label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Durée observée (h)" ar="مدة المراقبة (سا)" /></span>
          <NumStepper value={urineHours} onValue={setUrineHours} className="field" label="urineH" />
        </label>
      </section>
      <p className="px-1 text-[11px] font-bold opacity-60">
        <T fr="L’unité choisie s’applique aux trois créatininémies ; la diurèse est saisie en mL/kg/h." ar="تُطبّق الوحدة المختارة على قيم الكرياتينين الثلاث؛ ويُدخل إدرار البول بوحدة مل/كغ/سا." />
      </p>
      <RenalCourseSelector value={renalCourse} onChange={setRenalCourse} />

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSexe("m")} aria-pressed={sexe === "m"}
          className={`touch rounded-full border px-4 py-2 text-xs font-black ${sexe === "m" ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
          style={sexe === "m" ? { background: "var(--accent)" } : undefined}><T fr="Homme" ar="رجل" /></button>
        <button onClick={() => setSexe("f")} aria-pressed={sexe === "f"}
          className={`touch rounded-full border px-4 py-2 text-xs font-black ${sexe === "f" ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
          style={sexe === "f" ? { background: "var(--accent)" } : undefined}><T fr="Femme (×0,85)" ar="امرأة (×٠٫٨٥)" /></button>
        <button onClick={() => setUseIbw((v) => !v)} aria-pressed={useIbw}
          className={`touch rounded-full border px-4 py-2 text-xs font-black ${useIbw ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
          style={useIbw ? { background: "var(--sev-urgent)" } : undefined}>
          <T fr="Poids idéal (obésité)" ar="الوزن المثالي (سمنة)" />
        </button>
      </div>
      <label className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/5 p-3 text-sm font-bold">
        <input
          type="checkbox"
          checked={onDialysis}
          onChange={(event) => {
            setOnDialysis(event.target.checked);
            if (!event.target.checked) setRrtInitiated(false);
          }}
          className="mt-0.5"
        />
        <T fr="Dialyse / épuration extrarénale en cours : les grilles stables ci-dessous ne s’appliquent pas ; aucune dose n’est calculée." ar="غسيل أو إحلال كلوي جارٍ: لا تنطبق جداول الوظيفة المستقرة أدناه؛ لا تُحسب جرعة." />
      </label>
      {onDialysis && (
        <label className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/5 p-3 text-sm font-bold">
          <input type="checkbox" checked={rrtInitiated} onChange={(event) => setRrtInitiated(event.target.checked)} className="mt-0.5" />
          <T fr="L’épuration a été initiée pendant cet épisode aigu (critère KDIGO de stade 3). Ne cochez pas pour une dialyse chronique déjà en cours." ar="بدأ الإحلال الكلوي خلال هذه النوبة الحادة (معيار KDIGO للمرحلة 3). لا تحدد هذا الخيار إذا كان الغسيل مزمناً وقائماً من قبل." />
        </label>
      )}
      {useIbw && (
        <p role="alert" className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 text-sm font-bold">
          <T fr="Le poids idéal modifie la ClCr estimée, mais aucune règle de poids propre à ces RCP n’est activée ici : estimation seule, pas de dose." ar="يغيّر الوزن المثالي تقدير ClCr، لكن لا توجد هنا قاعدة وزن خاصة بهذه النشرات؛ تقدير فقط بلا جرعة." />
        </p>
      )}

      {suspiciousMgUnit && !unitConfirmed && (
        <div role="alert" className="rounded-2xl border border-amber-500/50 bg-amber-500/10 p-3 text-sm font-bold">
          <p><T fr="Au moins une valeur de créatinine dépasse 20 mg/dL : unité inhabituelle. Aucun résultat ni conseil de dose n’est affiché avant vérification. Si le laboratoire confirme mg/dL pour toutes les valeurs saisies, confirmez ci-dessous ; sinon, changez l’unité en µmol/L." ar="تتجاوز قيمة كرياتينين واحدة على الأقل ٢٠ مغ/دل: وحدة غير معتادة. لن تظهر نتيجة أو إرشادات جرعة قبل التحقق. إذا أكد المختبر أن كل القيم المدخلة بوحدة mg/dL فأكّد أدناه؛ وإلا غيّر الوحدة إلى µmol/L." /></p>
          <button onClick={() => setConfirmedSuspiciousUnit(confirmationKey)} className="mt-2 rounded-lg border border-amber-600 px-3 py-2 font-black">
            <T fr="Confirmer que toutes les valeurs saisies sont bien en mg/dL" ar="أؤكد أن كل القيم المدخلة بوحدة mg/dL" />
          </button>
        </div>
      )}

      {creatinineInputIssue && (
        <p role="alert" className="rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-sm font-bold text-red-500">
          <T fr="Une valeur de créatinine saisie est invalide ou ≤0 ; corrigez-la ou effacez le champ concerné. Aucun calcul n’est affiché." ar="إحدى قيم الكرياتينين المدخلة غير صالحة أو ≤0؛ صححها أو امسح الحقل. لن يُعرض أي حساب." />
        </p>
      )}
      {!r && akiAssessment.stage >= 1 && (
        <div role="alert" className="rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-sm font-bold text-red-500">
          <p><T fr="Des critères KDIGO sont détectés malgré l’absence d’un résultat exploitable de Cockcroft–Gault. Repérage KDIGO " ar="رُصدت معايير KDIGO رغم عدم توفر نتيجة Cockcroft–Gault صالحة. تصنيف KDIGO " />{akiAssessment.stage}. <T fr="Aucune grille de fonction stable ni dose n’est proposée ; l’AKI doit être évaluée selon un protocole adapté." ar="لا يُعرض جدول وظيفة مستقرة أو جرعة؛ يجب تقييم القصور الحاد وفق بروتوكول مناسب." /></p>
          <p className="mt-2 text-xs"><T fr="Critères : " ar="المعايير: " />{akiAssessment.criteria.map((criterion) => lang === "ar" ? AKI_LABEL[criterion].ar : AKI_LABEL[criterion].fr).join(" · ")}</p>
        </div>
      )}

      {Number.isFinite(ageValue) && ageValue > 0 && ageValue < 18 && (
        <p role="alert" className="rounded-2xl border border-red-500/50 bg-red-500/10 p-3 text-sm font-black text-red-500">
          <T fr="Ce calculateur et les lignes médicamenteuses ci-dessous sont réservés à l’adulte ; aucun résultat adulte n’est affiché pour un patient pédiatrique." ar="هذه الحاسبة وأسطر الأدوية أدناه للبالغين؛ لا تُعرض نتيجة البالغين لمريض طفل." />{" "}
          <Link href="/calculateurs/antibiotiques" className="underline"><T fr="Ouvrir l’outil pédiatrique" ar="افتح أداة الأطفال" /></Link>
        </p>
      )}

      {invalidIbw && (
        <p role="alert" className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 text-sm font-bold">
          <T fr="Saisissez une taille valide en centimètres, ou désactivez l’option de poids idéal." ar="أدخل طولاً صحيحاً بالسنتيمتر أو ألغِ خيار الوزن المثالي." />
        </p>
      )}

      {r ? (
        <>
          {onDialysis ? (
            <div role="alert" className="rounded-2xl border border-red-500/50 bg-red-500/10 p-3 text-sm font-black text-red-500">
              <p><T fr="Dialyse/épuration extrarénale déclarée : l’estimation Cockcroft–Gault peut être affichée à titre informatif, mais aucune grille de dose n’est appliquée." ar="تم التصريح بالغسيل/الإحلال الكلوي: يمكن عرض تقدير Cockcroft–Gault للمعلومة، لكن لا يُطبّق أي جدول جرعات." /></p>
              {akiAssessment.criteria.includes("renal-replacement") && (
                <p className="mt-2 text-xs"><T fr="Épuration initiée pendant cet épisode : critère KDIGO de stade 3." ar="بدأ الإحلال خلال هذه النوبة: معيار KDIGO للمرحلة 3." /></p>
              )}
            </div>
          ) : akiAssessment.stage >= 1 ? (
            <div role="alert" className="rounded-2xl border border-red-500/50 bg-red-500/10 p-3 text-sm font-black text-red-500">
              <p><T fr="Critères KDIGO d’atteinte rénale aiguë détectés : aucune grille de fonction stable ni dose n’est appliquée. Utiliser une évaluation/protocole adapté à l’AKI." ar="رُصدت معايير KDIGO لقصور كلوي حاد: لا يُطبّق جدول الوظيفة المستقرة ولا تُعرض جرعة. يلزم تقييم/بروتوكول خاص بالقصور الحاد." /></p>
              <p className="mt-2 text-xs"><T fr="Critères : " ar="المعايير: " />{akiAssessment.criteria.map((criterion) => lang === "ar" ? AKI_LABEL[criterion].ar : AKI_LABEL[criterion].fr).join(" · ")} (KDIGO {akiAssessment.stage})</p>
            </div>
          ) : renalCourse === "acute" ? (
            <div role="alert" className="rounded-2xl border border-red-500/50 bg-red-500/10 p-3 text-sm font-black text-red-500">
              <T fr="Parcours aigu/variable déclaré : une absence de critère KDIGO dans les valeurs saisies ne prouve pas la stabilité. Aucune posologie de fonction rénale stable n’est affichée." ar="تم تحديد المسار على أنه حاد/متغير: عدم ظهور معيار KDIGO في القيم المدخلة لا يثبت الاستقرار. لا تُعرض جرعة من جدول الوظيفة المستقرة." />
            </div>
          ) : renalCourse === "unknown" ? (
            <div role="status" className="rounded-2xl border border-amber-500/50 bg-amber-500/10 p-3 text-sm font-bold">
              <T fr="Une créatinine isolée permet une estimation, pas de distinguer à elle seule AKI et fonction stable/chronique. Aucun palier ni dosage n’est donc sélectionné." ar="يسمح تحليل كرياتينين منفرد بتقدير الوظيفة، لكنه لا يميّز وحده بين القصور الحاد والوظيفة المستقرة/المزمنة؛ لذلك لا تُختار مرحلة أو جرعة." />
            </div>
          ) : null}

          <div className="card rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-2xl font-black tabular-nums" dir="ltr">{Math.round(r.crcl)} <span className="text-sm opacity-60">mL/min</span></p>
              <Badge tone={doseContextEligible ? "neutral" : "urgent"}>
                {doseContextEligible
                  ? <T fr="ClCr calculée — seuil propre au RCP" ar="ClCr محسوبة — العتبة حسب النشرة" />
                  : <T fr="Estimation seule — aucune dose" ar="تقدير فقط — بلا جرعة" />}
              </Badge>
            </div>
            <p className="mt-1 text-xs opacity-70">
              {lang === "ar"
                ? `Cockcroft–Gault · الوزن المستعمل ${Math.round(r.weightUsed)} كغ${r.ibw ? ` (المثالي ${Math.round(r.ibw)})` : ""} · كرياتينين ${r.mg.toFixed(2)} مغ/دل`
                : `Cockcroft–Gault · poids utilisé ${Math.round(r.weightUsed)} kg${r.ibw ? ` (idéal ${Math.round(r.ibw)})` : ""} · créatinine ${r.mg.toFixed(2)} mg/dL`}
            </p>
          </div>

          <ul className="flex flex-col gap-2">
            {ROWS.map((row) => {
              const antibiotics = ANTIBIOTIC_SEARCH[row.fr];
              const reviewedDoseRule = Boolean(row.source && row.bands?.length && row.thresholds?.length);
              const thresholdIndex = row.thresholds?.findIndex((threshold) => r.crcl >= threshold);
              const bandIndex = thresholdIndex === undefined ? null : thresholdIndex < 0 ? row.thresholds!.length : thresholdIndex;
              const doseBand = doseContextEligible && reviewedDoseRule && bandIndex !== null ? row.bands?.[bandIndex] : undefined;
              return (
                <li key={row.fr} className="card rounded-2xl border border-line bg-surface p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-black">{lang === "ar" ? row.ar : row.fr}</p>
                    {antibiotics ? (
                      <Badge tone="neutral"><T fr="Tableau PDF" ar="جدول PDF" /></Badge>
                    ) : reviewedDoseRule ? (
                      <Badge tone="neutral"><T fr="RCP individuel lié" ar="نشرة دواء محدد مرتبطة" /></Badge>
                    ) : (
                      <Badge tone="urgent"><T fr="En attente de source relue" ar="بانتظار مراجعة المصدر" /></Badge>
                    )}
                  </div>
                  {antibiotics ? (
                    <div className="mt-2">
                      <p className="text-sm font-bold opacity-80">
                        <T fr="Aucune ancienne dose n’est reprise ici ; les détails sont dans le tableau OMEDIT dédié, qui applique ses propres règles et exclusions." ar="لا نعرض الجرعات السابقة هنا؛ التفاصيل في جدول OMEDIT المخصّص الذي يطبّق قواعده واستثناءاته الخاصة." />
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {antibiotics.map((antibiotic) => (
                          <Link key={antibiotic.query} href={`/calculateurs/antibio-renal?q=${encodeURIComponent(antibiotic.query)}`} className="inline-flex rounded-full border border-blue-500 px-3 py-1.5 text-xs font-black text-blue-500">
                            {lang === "ar" ? antibiotic.ar : antibiotic.fr}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : !reviewedDoseRule ? (
                    <p className="mt-2 text-sm font-bold text-amber-600">
                      <T fr="Dose désactivée : règle actuelle spécifique au produit, à l’indication et à la population non encore sourcée/revue." ar="الجرعة معطّلة: لم تُوثّق أو تُراجع بعد قاعدة حديثة خاصة بالدواء والاستطباب والفئة." />
                    </p>
                  ) : (
                    <>
                      {doseBand ? (
                        <>
                          {doseBand.range && <p className="mt-2 text-xs font-black opacity-70">{lang === "ar" ? doseBand.range.ar : doseBand.range.fr}</p>}
                          <p className="mt-1 text-sm font-bold opacity-80">{lang === "ar" ? doseBand.ar : doseBand.fr}</p>
                          <CalculationExplainer
                            context={{
                              title: lang === "ar" ? `${row.ar} — مجال الجرعة حسب ClCr` : `${row.fr} — plage selon la ClCr`,
                              method: lang === "ar"
                                ? "تحسب هذه الصفحة ClCr بمعادلة Cockcroft–Gault، ثم تقارن القيمة غير المقرّبة بعتبات النشرة الخاصة بهذا الدواء فقط. لا تستخدم CKD-EPI لاختيار هذا المجال، ولا تحسب جرعة فردية."
                                : "Cette page estime la ClCr par Cockcroft–Gault, puis compare la valeur non arrondie aux seuils du RCP propre à ce médicament. Elle n’utilise pas CKD-EPI pour choisir cette plage et ne calcule pas une dose individuelle.",
                              inputs: [
                                {
                                  label: lang === "ar" ? "ClCr التي استعملها الاختيار (غير مقرّبة)" : "ClCr utilisée par la sélection (non arrondie)",
                                  value: `${r.crcl} mL/min`,
                                },
                                {
                                  label: lang === "ar" ? "عتبات ClCr في هذه النشرة، من الأعلى إلى الأدنى" : "Seuils ClCr de ce RCP, du plus élevé au plus bas",
                                  value: `${row.thresholds?.join(" · ") ?? "—"} mL/min`,
                                },
                              ],
                              result: `${doseBand.range ? (lang === "ar" ? doseBand.range.ar : doseBand.range.fr) : ""} — ${lang === "ar" ? doseBand.ar : doseBand.fr}`,
                              source: lang === "ar" ? row.source!.ar : row.source!.fr,
                              limitations: lang === "ar"
                                ? [
                                    "المعروض مجال من نشرة فرنسية، وليس جرعة فردية يختارها التطبيق أو الذكاء الاصطناعي.",
                                    "هذا المصدر لا يثبت اعتماداً أو توافراً في تونس؛ راجع نشرة المنتج المحلية ومختصاً.",
                                    "لا ينطبق هذا المجال على القصور الحاد أو الغسيل؛ لا تفسّر هذه الأداة الحالات المحجوبة.",
                                  ]
                                : [
                                    "La valeur affichée est une plage d’un RCP français, pas une dose individuelle choisie par l’application ou l’IA.",
                                    "Cette source ne prouve ni l’adoption ni la disponibilité en Tunisie ; vérifier le RCP local avec un professionnel.",
                                    "Cette plage ne couvre ni l’atteinte rénale aiguë ni la dialyse ; l’outil bloque ces contextes.",
                                  ],
                            }}
                          />
                        </>
                      ) : (
                        <p role="status" className="mt-2 text-sm font-bold text-amber-600">
                          <T fr="Aucune dose sélectionnée : contexte stable adulte non dialysé, absence de critère KDIGO et méthode de poids requise non réunis." ar="لم تُحدَّد جرعة: شروط البالغ المستقر غير الخاضع للغسيل، وغياب معيار KDIGO، وطريقة الوزن المطلوبة غير مكتملة." />
                        </p>
                      )}
                      {row.note && (
                        <p className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2 text-xs leading-relaxed">
                          <strong><T fr="Note RCP (pas un calcul) : " ar="ملاحظة النشرة (ليست حساباً): " /></strong>{lang === "ar" ? row.note.ar : row.note.fr}
                        </p>
                      )}
                      {row.source && (
                        <a href={row.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-xs font-black text-blue-500 underline underline-offset-2">
                          {lang === "ar" ? row.source.ar : row.source.fr}
                        </a>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap gap-2">
            <Link href="/calculateurs/aki" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="AKI / KDIGO" ar="قصور الكلى الحاد" /></Link>
            <Link href="/calculateurs/safe-dose" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Moteur de dose sûre" ar="محرّك الجرعة الآمنة" /></Link>
            <Link href="/calculateurs/antibiotiques" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Antibiotiques" ar="المضادات الحيوية" /></Link>
          </div>
        </>
      ) : !(suspiciousMgUnit && !unitConfirmed) && !creatinineInputIssue && !(Number.isFinite(ageValue) && ageValue > 0 && ageValue < 18) && !invalidIbw ? (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Saisissez un âge adulte (18–139 ans), un poids et une créatinine actuelle positifs. Les valeurs historiques et la diurèse sont facultatives ; la taille n’est requise que pour le poids idéal." ar="أدخل عمراً للبالغين (١٨–١٣٩ سنة) ووزناً وكرياتينين حالياً موجبة. القيم السابقة وإدرار البول اختيارية؛ ولا يُطلب الطول إلا للوزن المثالي." />
        </p>
      ) : null}
    </div>
  );
}

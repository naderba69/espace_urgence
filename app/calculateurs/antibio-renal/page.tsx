"use client";
// v18.x — تكييف المضادات الحيوية مع الوظيفة الكلوية: 93 تركيبة × 5 مراحل.
// Adaptation des antibiotiques (tableau OMEDIT V2.3) : DFG (CKD-EPI), AKI/KDIGO,
// refus pédiatrique/dialyse, ClCr Cockcroft-Gault séparée et cellules source annotées.
//
// ⚠️ للبالغين غير الخاضعين للغسيل فقط. الخلايا المدمجة والمراحل التي تتقاطع مع خلايا مختلفة
//    موثقة؛ لا تُختار جرعة مفردة لتلك المراحل. الواجهة والتنبيهات بالعربية والفرنسية.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NumStepper from "@/components/ui/NumStepper";
import { useApp, usePrefillPatient } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import CalculationExplainer from "@/components/ai/CalculationExplainer";
import AtbPlanPanel from "@/components/atb/AtbPlanPanel";
import RenalCourseSelector from "@/components/renal/RenalCourseSelector";
import { normalize } from "@/lib/text";
import { readJSON, writeJSON } from "@/lib/storage";
import { calculateWeightDose, isAmbiguousSourceCells, isContraindicated, isDiscouraged, isMergedSourceCell, isNoData, isUnassignedSourceContext, requiresSourceCheck } from "@/lib/atb-dose";
import { akiKdigo, chooseStage, scrToMgDl, type AkiResult, type RenalCourse, type StageInput } from "@/lib/renal-clearance";
import { addDecision, emptyPlan, parsePlan, PLAN_KEY, PREVIOUS_PLAN_KEY, LEGACY_PLAN_KEY, planReasonLabel, removeMolecule, resetPlan, currentDecisions, type PlanReason } from "@/lib/atb-plan";
import { ATB_RENAL_ROWS, ATB_RENAL_SECTIONS, ATB_RENAL_STAGES, ATB_RENAL_BY_ID, type AtbStageId } from "@/data/atb-renal";
import { Pill, Filter, Info, AlertTriangle } from "lucide-react";

const STAGE_IDS = ATB_RENAL_STAGES.map((s) => s.id);

/** مفاتيح معايير KDIGO بالعربية/الفرنسية للعرض. */
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

export default function AntibioRenalPage() {
  useRegisterRecent("calculateur:antibio-renal");
  const { lang } = useApp();
  const ar = lang === "ar";

  // ── المريض / Patient ────────────────────────────────────────────────────────────────
  const [age, setAge] = useState("");
  const [wt, setWt] = useState("");
  const [ht, setHt] = useState("");
  const [sexe, setSexe] = useState<"m" | "f">("m");
  const [unit, setUnit] = useState<"mg" | "umol">("mg");
  const [scr, setScr] = useState("");
  const [scr48, setScr48] = useState("");
  const [scr7d, setScr7d] = useState("");
  const [urine, setUrine] = useState("");
  const [urineH, setUrineH] = useState("");
  const [useIbw, setUseIbw] = useState(false);
  const [onRenalReplacementTherapy, setOnRenalReplacementTherapy] = useState(false);
  const [rrtInitiated, setRrtInitiated] = useState(false);
  const [renalCourse, setRenalCourse] = useState<RenalCourse>("unknown");
  const [manual, setManual] = useState<AtbStageId | null>(null);
  const [manualReviewFor, setManualReviewFor] = useState<string | null>(null);
  const [reviewAcknowledgedFor, setReviewAcknowledgedFor] = useState<string | null>(null);
  const clearManualStage = () => {
    setManual(null);
    setManualReviewFor(null);
    setReviewAcknowledgedFor(null);
  };
  const updateTextField = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    clearManualStage();
  };
  const updateRenalCourse = (course: RenalCourse) => {
    setRenalCourse(course);
    clearManualStage();
  };

  usePrefillPatient((p) => {
    if (!wt && p.w) setWt(p.w);
    if (!age && p.age) setAge(p.age);
    if (!scr && p.scr) setScr(p.scr);
    if (p.sexe === "f") setSexe("f");
  });

  const num = (s: string) => parseFloat(String(s).replace(",", "."));
  const pediatricAge = num(age) > 0 && num(age) < 18;
  const weight = num(wt);
  const heightCm = num(ht);
  const bmi = Number.isFinite(weight) && weight > 0 && Number.isFinite(heightCm) && heightCm > 0
    ? weight / ((heightCm / 100) ** 2)
    : null;
  const amikWeightDoseBlocked = bmi === null || bmi >= 30 || useIbw;
  const convertScr = (s: string) => scrToMgDl(num(s), unit);

  /** مدخلات صالحة فقط؛ لا نخمن الوحدة ولا نعرض جرعة قبل حسمها. */
  const renalInput = useMemo<StageInput | null>(() => {
    const current = convertScr(scr);
    const at48h = convertScr(scr48);
    const at7d = convertScr(scr7d);
    if (current.mgDl === null || current.suspectUnit || at48h.suspectUnit || at7d.suspectUnit) return null;
    return {
      ageYears: num(age),
      sexe,
      weightKg: num(wt),
      heightCm: num(ht),
      scrMgDl: current.mgDl,
      scr48h: at48h.mgDl,
      scr7d: at7d.mgDl,
      urineMlKgH: num(urine),
      urineHours: num(urineH),
      onRenalReplacementTherapy,
      renalReplacementTherapyInitiated: rrtInitiated,
      renalCourse,
      useIdealWeight: useIbw,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age, wt, ht, scr, scr48, scr7d, urine, urineH, sexe, unit, useIbw, onRenalReplacementTherapy, rrtInitiated, renalCourse]);
  const creatinineInputIssue = [scr, scr48, scr7d].some((value) => {
    if (!value.trim()) return false;
    const converted = convertScr(value);
    return converted.suspectUnit || converted.mgDl === null;
  });
  const akiAssessment = useMemo(() => {
    const current = convertScr(scr);
    const at48h = convertScr(scr48);
    const at7d = convertScr(scr7d);
    return akiKdigo({
      scrNow: current.mgDl ?? Number.NaN,
      scr48h: at48h.mgDl,
      scr7d: at7d.mgDl,
      urineMlKgH: num(urine),
      urineHours: num(urineH),
      renalReplacementTherapyInitiated: rrtInitiated,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scr, scr48, scr7d, urine, urineH, unit, rrtInitiated]);

  /** DFG (CKD-EPI) sélectionne le stade ; Cockcroft–Gault reste informatif et séparé. */
  const ren = useMemo(() => (renalInput ? chooseStage(renalInput) : null), [renalInput]);
  const pediatricRefusal = ren?.refusal === "pediatric";
  const dialysisRefusal = ren?.refusal === "dialysis";
  // Une AKI connue bloque toute utilisation de ce tableau, y compris un choix manuel.
  const akiBlocked = akiAssessment.stage >= 1;
  const renalCourseBlocksDose = renalCourse !== "stable";
  const requiresReview = ren?.refusal === "boundary" && !akiBlocked && renalCourse === "stable";
  const reviewKey = requiresReview
    ? JSON.stringify({ age, wt, ht, sexe, unit, scr, scr48, scr7d, urine, urineH, useIbw, onRenalReplacementTherapy, renalCourse })
    : null;
  const reviewAcknowledged = reviewKey !== null && reviewAcknowledgedFor === reviewKey;
  const manualStage = manualReviewFor === null
    ? manual
    : reviewAcknowledged && manualReviewFor === reviewKey ? manual : null;
  const stage: AtbStageId | null = renalCourseBlocksDose || pediatricAge || pediatricRefusal || onRenalReplacementTherapy || dialysisRefusal || akiBlocked || creatinineInputIssue
    ? null
    : requiresReview
      ? reviewAcknowledged && manualReviewFor === reviewKey ? manualStage : null
      : manualStage ?? (ren && !ren.refusal ? ren.stage : null);
  const stageIdx = stage ? STAGE_IDS.indexOf(stage) : -1;
  const stageMeta = stageIdx >= 0 ? ATB_RENAL_STAGES[stageIdx] : null;
  const estimatedStageMeta = ren?.baseStage ? ATB_RENAL_STAGES.find((item) => item.id === ren.baseStage) ?? null : null;
  const stageLabel = stageMeta
    ? `${ar ? stageMeta.ar : stageMeta.fr} · ${stageMeta.dgf}`
    : ar ? "مرحلة غير محددة" : "stade non déterminé";
  const stageForMolecule = () => {
    const result = renalInput ? chooseStage(renalInput) : null;
    const moleculeRequiresReview = result?.refusal === "boundary" && !akiBlocked;
    const value = renalCourseBlocksDose || pediatricAge || onRenalReplacementTherapy || dialysisRefusal || akiBlocked || creatinineInputIssue || result?.refusal === "pediatric"
      ? null
      : moleculeRequiresReview
        ? reviewAcknowledged && manualReviewFor === reviewKey ? manualStage : null
        : manualStage ?? (result && !result.refusal ? result.stage : null);
    const index = value ? STAGE_IDS.indexOf(value) : -1;
    const meta = index >= 0 ? ATB_RENAL_STAGES[index] : null;
    return {
      result,
      stage: value,
      label: meta ? `${ar ? meta.ar : meta.fr} · ${meta.dgf}` : ar ? "مرحلة غير محددة" : "stade non déterminé",
    };
  };
  // ── البحث والفلترة / Recherche ──────────────────────────────────────────────────────
  const [q, setQ] = useState("");
  const [section, setSection] = useState<string | null>(null);
  const [selectedMedicationIds, setSelectedMedicationIds] = useState<string[]>([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("q");
    if (requested) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- ouvre le filtre demandé depuis le pont rénal
      setQ(requested);
    }
  }, []);
  const rows = useMemo(() => {
    const nq = normalize(q.trim());
    return ATB_RENAL_ROWS.filter((r) => {
      if (section && r.section !== section) return false;
      if (!nq) return true;
      return normalize(`${r.fr} ${r.ar} ${ATB_RENAL_SECTIONS.find((s) => s.id === r.section)?.fr ?? ""}`).includes(nq);
    });
  }, [q, section]);
  const visibleRows = useMemo(
    () => showOnlySelected ? rows.filter((row) => selectedMedicationIds.includes(row.id)) : rows,
    [rows, showOnlySelected, selectedMedicationIds],
  );
  const toggleMedicationSelection = (id: string) => {
    setSelectedMedicationIds((current) => current.includes(id)
      ? current.filter((selectedId) => selectedId !== id)
      : [...current, id]);
  };

  // ── الخطّة (حلقة a → b) / Plan antibiotique ────────────────────────────────────────
  const [plan, setPlan] = useState(() => emptyPlan());
  const [previousPlanDetected, setPreviousPlanDetected] = useState(false);
  useEffect(() => {
    const hasEntries = (key: string) => {
      const oldPlan = readJSON<unknown>(key, null);
      const oldEntries = oldPlan && typeof oldPlan === "object"
        ? (oldPlan as { entries?: unknown }).entries
        : undefined;
      return Array.isArray(oldEntries) && oldEntries.length > 0;
    };
    // Les anciennes versions sont conservées sur l'appareil, mais leurs snapshots ne sont pas fiables après les corrections source.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydratation locale après mise à jour source
    setPreviousPlanDetected(hasEntries(PREVIOUS_PLAN_KEY) || hasEntries(LEGACY_PLAN_KEY));
    setPlan(parsePlan(readJSON<unknown>(PLAN_KEY, null)));
  }, []);
  const save = (p: typeof plan) => {
    setPlan(p);
    writeJSON(PLAN_KEY, p);
  };
  const decisions = useMemo(() => currentDecisions(plan), [plan]);
  const [openEditor, setOpenEditor] = useState<string | null>(null);
  const [reason, setReason] = useState<PlanReason>("fonction-renale");
  const [note, setNote] = useState("");
  const nameOf = (id: string) => {
    const r = ATB_RENAL_BY_ID[id];
    return r ? (ar ? r.ar : r.fr) : id;
  };
  const decide = (
    id: string,
    decision: "retenue" | "abandonnee",
    dose?: string,
    decisionStage: AtbStageId | null = stage,
    decisionStageLabel = stageLabel,
  ) => {
    if (!decisionStage) return;
    save(addDecision(plan, {
      id,
      decision,
      reason: decision === "abandonnee" ? reason : undefined,
      note: note || undefined,
      snapshot: {
        weightKg: Number.isFinite(weight) ? weight : undefined,
        stage: decisionStage,
        stageLabel: decisionStageLabel,
        dose,
      },
    }));
  };

  const cell = "flex flex-col gap-1 rounded-xl border border-line bg-surface p-3";
  const tone = stageIdx === 4 ? "critical" : stageIdx === 3 ? "urgent" : stageIdx === 2 ? "standard" : "neutral";
  const chip = (active: boolean) =>
    `touch rounded-full border px-3 py-1.5 text-xs font-black ${active ? "border-transparent text-white" : "border-line hover:bg-surface2"}`;
  const chipStyle = (active: boolean, accent?: string) => (active ? { background: accent ?? "var(--accent)" } : undefined);

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <PageHeader
        icon={<Pill className="h-6 w-6" />}
        title={<T fr="Antibiotiques & fonction rénale" ar="المضادات الحيوية والوظيفة الكلوية" />}
        sub={
          <T
            fr="Choisissez un ou plusieurs antibiotiques, puis consultez leurs doses selon la fonction rénale du patient."
            ar="اختر مضاداً حيوياً واحداً أو أكثر، ثم اعرض جرعاتها حسب وظيفة كلى المريض."
          />
        }
        count={ATB_RENAL_ROWS.length}
      />

      {/* المصدر والتنبيه / Source & garde-fous */}
      <section className="rounded-2xl border border-line bg-surface p-3 text-xs leading-relaxed">
        <p className="flex items-start gap-2 font-bold">
          <Info className="mt-0.5 h-4 w-4 shrink-0 opacity-70" aria-hidden />
          <span>
            <T
              fr="Source : OMEDIT Pays de la Loire — « Adaptation des antibiotiques à la fonction rénale », V2.3 (avril 2026) ; données RCP / GPR (SPILF–SFPT–CA-SFM, juin 2023) / ePOPI arrêtées au 10/01/2024."
              ar="المصدر: OMEDIT Pays de la Loire — «تكييف المضادات الحيوية مع الوظيفة الكلوية»، النسخة 2.3 (أفريل 2026)؛ معطيات RCP/GPR (SPILF–SFPT–CA-SFM جوان 2023) وePOPI إلى تاريخ 10/01/2024."
            />
          </span>
        </p>
        <p className="mt-2 font-bold" style={{ color: "var(--sev-urgent)" }}>
          <T
            fr="Adultes NON dialysés uniquement. Données issues du tableau source ; cellules fusionnées et tranches recoupant plusieurs cellules signalées sans choisir une dose unique, sans validation clinique indépendante. Vérifier le PDF avec un médecin/pharmacien tunisien avant toute utilisation clinique."
            ar="للبالغين غير الخاضعين للغسيل فقط. المعطيات مستمدة من الجدول المرجعي؛ الخلايا المدمجة والشرائح المتقاطعة مع خلايا مختلفة موثّقة دون اختيار جرعة واحدة، ومن دون اعتماد سريري مستقل. تحقّق من ملف PDF مع طبيب/صيدلي تونسي قبل أي استعمال سريري."
          />
        </p>
        <p className="mt-2 border-t border-line pt-2 text-xs leading-relaxed opacity-75">
          <T
            fr="Ce PDF est un tableau de synthèse citant les RCP, GPR et ePOPI ; il ne remplace pas le RCP individuel de la spécialité ni ses mises à jour."
            ar="هذا الـPDF جدول مُلخّص ينقل عن RCP وGPR وePOPI؛ لا يعوّض النشرة الرسمية الخاصة بكل دواء ولا تحديثاتها."
          />
        </p>
      </section>

      <section className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-3 text-xs leading-relaxed">
        <h2 className="mb-2 font-black text-blue-500"><T fr="Comment le calcul est fait" ar="كيف تُحسب الجرعة؟" /></h2>
        <ul className="list-inside list-disc space-y-1">
          <li><T fr="Seuls les segments mg/kg explicitement écrits sont multipliés par le poids saisi ; le texte source reste visible et le résultat est un calcul arithmétique, pas un ordre de prescription." ar="تُضرب المقاطع المكتوبة صراحةً بوحدة mg/kg فقط في الوزن المُدخل؛ يبقى نص المصدر ظاهرًا والنتيجة حساب رياضي لا أمر وصفة." /></li>
          <li><T fr="Les plafonds chiffrés du même texte sont appliqués lorsqu’unité et période sont explicites ; plafond illisible ou incompatible = calcul bloqué, jamais ignoré." ar="تُطبّق الحدود القصوى الرقمية في النص نفسه إذا كانت الوحدة والفترة واضحتين؛ إذا كان الحدّ ملتبسًا أو غير متوافق يُوقف الحساب ولا يُتجاهل." /></li>
          <li><T fr="La quantité par prise n’est divisée que si la source donne un total/24 h et un nombre fixe de prises ; une fourchette comme « 4 à 6 » n’est jamais choisie." ar="لا تُقسّم كمية الجرعة على عدد المرات إلا إذا ذكر المصدر مجموع ٢٤ ساعة وعددًا ثابتًا؛ لا يُختار رقم من مجال مثل «٤ إلى ٦»." /></li>
          <li><T fr="Les mentions de fréquence explicites (par ex. « 1 fois/24 h ») sont conservées ; « ou » et « puis » ne sont pas confondus." ar="تُحفظ وتيرة الإعطاء المكتوبة صراحةً (مثل «مرة واحدة/٢٤ ساعة»)؛ ولا يُخلط بين «أو» و«ثم»." /></li>
          <li><T fr="Le bouton « poids idéal » modifie l’estimation rénale, pas le poids de calcul mg/kg. Vérifier dans le RCP le poids à utiliser pour chaque produit." ar="زر «الوزن المثالي» يغيّر تقدير وظيفة الكلى لا الوزن المستعمل في mg/kg؛ تحقّق من النشرة لمعرفة الوزن المناسب لكل دواء." /></li>
          <li><T fr="Une dose fixe, une cellule ambiguë ou une consigne sans quantité ne sont ni recalculées ni remplacées par une colonne voisine." ar="لا تُحسب الجرعة الثابتة أو الخلية الملتبسة أو التعليمات بلا كمية، ولا تُستبدل بقيمة من مرحلة مجاورة." /></li>
        </ul>
      </section>

      {previousPlanDetected && (
        <p role="alert" className="rounded-2xl border border-line p-3 text-sm font-bold" style={{ color: "var(--sev-urgent)" }}>
          <T
            fr="Un plan local v1 ou v2 a été détecté, mais n'est pas importé après les corrections du tableau et des contextes (dont Ceftobiprole). L'ancien plan reste conservé sur cet appareil. Reconstituer et revérifier les décisions depuis le PDF/RCP ; ne pas réutiliser ses anciens snapshots de dose."
            ar="عُثر على خطة محلية من الإصدار ١ أو ٢، لكن لم تُستورد بعد تصحيحات الجدول والسياقات (ومنها سيفتوبيبرول). تبقى الخطة القديمة محفوظة على هذا الجهاز. أعد بناء القرارات وراجعها من PDF/RCP؛ لا تستخدم لقطات الجرعات القديمة."
          />
        </p>
      )}

      {/* حدود السن / Limite d'âge */}
      {pediatricAge && (
        <p className="rounded-2xl p-3 text-sm font-black" style={{ background: "var(--sev-critical-bg)", color: "var(--sev-critical)" }}>
          <T
            fr="⚠ Patient < 18 ans : le tableau ci-dessous est réservé aux ADULTES. Le DFG est ici estimé par CKID U25 (Schwartz) pour information, mais la posologie doit venir du calculateur pédiatrique — ne pas mélanger les deux sources."
            ar="⚠ المريض أقل من ١٨ سنة: الجدول أدناه مخصّص للبالغين. التصفية هنا تُقدَّر بـ CKID U25 (Schwartz) على سبيل الإعلام، أمّا الجرعة فتؤخذ من حاسبة الأطفال — لا تُخلط المصادر."
          />{" "}
          <Link href="/calculateurs/doses-ped" className="underline">
            <T fr="Ouvrir les doses pédiatriques" ar="افتح حاسبة جرعات الأطفال" />
          </Link>
        </p>
      )}

      {/* المريض / Patient */}
      <section className="grid grid-cols-2 gap-2">
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Âge (ans)" ar="العمر (سنة)" /></span>
          <NumStepper value={age} onValue={updateTextField(setAge)} className="field" label={ar ? "العمر" : "age"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></span>
          <NumStepper value={wt} onValue={updateTextField(setWt)} className="field" label={ar ? "الوزن" : "wt"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Taille (cm)" ar="الطول (سم)" /></span>
          <NumStepper value={ht} onValue={updateTextField(setHt)} className="field" label={ar ? "الطول" : "ht"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Créatinine (actuelle)" ar="الكرياتينين (الحالي)" /></span>
          <div className="flex items-center gap-2">
            <NumStepper value={scr} onValue={updateTextField(setScr)} className="field" label={ar ? "الكرياتينين" : "scr"} />
            <button
              onClick={() => { setUnit((u) => (u === "mg" ? "umol" : "mg")); clearManualStage(); }}
              className="shrink-0 rounded-lg border border-line px-2 py-1 text-xs font-black"
              dir="ltr"
            >
              {unit === "mg" ? "mg/dL" : "µmol/L"}
            </button>
          </div>
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Créatinine à 48 h (option)" ar="الكرياتينين قبل ٤٨ سا (اختياري)" /></span>
          <NumStepper value={scr48} onValue={updateTextField(setScr48)} className="field" label={ar ? "كرياتينين ٤٨ سا" : "scr48"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Créatinine à 7 j (option)" ar="الكرياتينين قبل ٧ أيام (اختياري)" /></span>
          <NumStepper value={scr7d} onValue={updateTextField(setScr7d)} className="field" label={ar ? "كرياتينين ٧ أيام" : "scr7d"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Diurèse (mL/kg/h)" ar="الدُّرْيَة (مل/كغ/سا)" /></span>
          <NumStepper value={urine} onValue={updateTextField(setUrine)} step={0.1} className="field" label={ar ? "الدُّرْيَة" : "urine"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Durée d'observation (h)" ar="مدّة المراقبة (سا)" /></span>
          <NumStepper value={urineH} onValue={updateTextField(setUrineH)} className="field" label={ar ? "مدّة المراقبة" : "urineH"} />
        </label>
      </section>
      <p className="px-1 text-[11px] font-bold opacity-60">
        <T fr="L'unité sélectionnée s'applique à la créatinine actuelle et aux deux valeurs historiques." ar="تُطبَّق الوحدة المختارة على الكرياتينين الحالي والقيمتين التاريخيتين." />
      </p>
      <RenalCourseSelector value={renalCourse} onChange={updateRenalCourse} />

      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setSexe("m"); clearManualStage(); }} aria-pressed={sexe === "m"} className={chip(sexe === "m")} style={chipStyle(sexe === "m")}>
          <T fr="Homme" ar="رجل" />
        </button>
        <button onClick={() => { setSexe("f"); clearManualStage(); }} aria-pressed={sexe === "f"} className={chip(sexe === "f")} style={chipStyle(sexe === "f")}>
          <T fr="Femme (×0,85)" ar="امرأة (×٠٫٨٥)" />
        </button>
        <button onClick={() => { setUseIbw((v) => !v); clearManualStage(); }} aria-pressed={useIbw} className={chip(useIbw)} style={chipStyle(useIbw, "var(--sev-urgent)")}>
          <T fr="Poids idéal (obésité)" ar="الوزن المثالي (سمنة)" />
        </button>
      </div>
      <label className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/5 p-3 text-sm font-bold">
        <input
          type="checkbox"
          checked={onRenalReplacementTherapy}
          onChange={(event) => {
            const checked = event.target.checked;
            setOnRenalReplacementTherapy(checked);
            if (!checked) setRrtInitiated(false);
            clearManualStage();
          }}
          className="mt-0.5"
        />
        <T fr="Dialyse / épuration extrarénale en cours : le tableau OMEDIT est hors périmètre ; bloquer toute sélection de stade et dose." ar="غسيل أو إحلال كلوي جارٍ: جدول OMEDIT خارج النطاق؛ يُحجب اختيار المرحلة والجرعة." />
      </label>
      {onRenalReplacementTherapy && (
        <label className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/5 p-3 text-sm font-bold">
          <input type="checkbox" checked={rrtInitiated} onChange={(event) => setRrtInitiated(event.target.checked)} className="mt-0.5" />
          <T fr="L’épuration a été initiée pendant l’épisode aigu actuel (critère KDIGO 3) ; ne cochez pas une dialyse chronique déjà en cours." ar="بدأ الإحلال الكلوي خلال النوبة الحادة الحالية (معيار KDIGO 3)؛ لا تحدد غسيلاً مزمناً كان قائماً من قبل." />
        </label>
      )}

      {/* التصفية والمرحلة / DFG & stade */}
      <section className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${stageIdx === 4 ? "sev-critical" : stageIdx === 3 ? "sev-urgent" : stageIdx === 2 ? "sev-standard" : ""}`}>
        {creatinineInputIssue && (
          <p className="mb-3 rounded-xl p-3 text-sm font-black" style={{ background: "var(--sev-critical-bg)", color: "var(--sev-critical)" }} role="alert">
            <T
              fr="Valeur de créatinine invalide ou suspecte (notamment >20 mg/dL) : vérifiez la valeur et l'unité sur le compte-rendu biologique. Aucun calcul rénal, choix de stade ni dosage n'est affiché."
              ar="قيمة الكرياتينين غير صالحة أو مثيرة للشك (خصوصاً إذا تجاوزت 20 مغ/دل): تحقّق من القيمة والوحدة في تقرير التحليل. أُوقف حساب الكلى واختيار المرحلة والجرعة."
            />
          </p>
        )}
        {onRenalReplacementTherapy || dialysisRefusal ? (
          <div className="rounded-xl p-3" style={{ background: "var(--sev-critical-bg)", color: "var(--sev-critical)" }} role="alert">
            <p className="text-sm font-black">⚠ <T fr="Dialyse / épuration extrarénale : hors périmètre du tableau OMEDIT. Aucun stade ni dosage n'est proposé ici ; vérifier le RCP et un protocole spécialisé." ar="غسيل/إحلال كلوي: خارج نطاق جدول OMEDIT. لا تُعرض هنا مرحلة أو جرعة؛ راجع نشرة المنتج وبروتوكولاً اختصاصياً." /></p>
            {akiAssessment.criteria.includes("renal-replacement") && (
              <p className="mt-2 text-xs font-bold">
                <T fr="L’initiation de l’épuration pendant cet épisode aigu est un critère KDIGO de stade 3 ; la dialyse chronique à elle seule ne classe pas une AKI." ar="بدء الإحلال خلال هذه النوبة الحادة معيار KDIGO للمرحلة 3؛ أما الغسيل المزمن وحده فلا يصنّف إصابة حادة." />
              </p>
            )}
          </div>
        ) : akiBlocked ? (
          <div className="rounded-xl p-3" style={{ background: "var(--sev-critical-bg)", color: "var(--sev-critical)" }} role="alert">
            <p className="text-sm font-black">
              ⚠ <T
                fr="Critères d'atteinte rénale aiguë KDIGO détectés. Ce tableau de fonction rénale stable ne permet pas de sélectionner une dose dans cette situation ; le calcul automatique et le choix manuel sont bloqués. Suivre un protocole adapté et demander un avis médical/pharmaceutique."
                ar="رُصدت معايير إصابة كلوية حادة وفق KDIGO. هذا الجدول المخصص لوظيفة كلوية مستقرة لا يتيح اختيار جرعة في هذه الحالة؛ أُوقف الحساب الآلي والاختيار اليدوي. اتبع بروتوكولاً مناسباً واطلب رأي طبيب أو صيدلي."
              />
            </p>
            <p className="mt-2 text-xs font-bold">
              <T fr="Critères KDIGO détectés : " ar="معايير KDIGO المكتشفة: " />
              <span dir={ar ? "rtl" : "ltr"}>{akiAssessment.criteria.map((c) => (ar ? AKI_LABEL[c].ar : AKI_LABEL[c].fr)).join(" · ")}</span> (KDIGO {akiAssessment.stage})
            </p>
            {ren && ren.egfrCkd !== null && (
              <p className="mt-2 text-xs font-bold" dir="ltr">
                CKD-EPI (DFG): {ren.egfrCkd.toFixed(0)} mL/min/1,73 m² · Cockcroft–Gault (ClCr séparée): {ren.crclCg?.toFixed(0) ?? "—"} mL/min
              </p>
            )}
          </div>
        ) : requiresReview ? (
          <div className="rounded-xl p-3" style={{ background: "var(--sev-critical-bg)", color: "var(--sev-critical)" }} role="alert">
            {ren?.warnings.map((warning, i) => (
              <p key={i} className="text-sm font-black">⚠ {ar ? warning.ar : warning.fr}</p>
            ))}
            {reviewAcknowledged ? (
              <>
                <p className="mt-2 text-xs font-bold">
                  <T
                    fr="La sélection automatique reste bloquée. Après validation professionnelle, choisissez explicitement une colonne ci-dessous."
                    ar="يبقى الاختيار الآلي متوقفاً. بعد المراجعة المهنية، اختر عموداً يدوياً أدناه."
                  />
                </p>
                {manual && (
                  <button onClick={clearManualStage} className="mt-2 text-xs font-black underline">
                    <T fr="Effacer le stade manuel" ar="امسح المرحلة اليدوية" />
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!reviewKey) return;
                  clearManualStage();
                  setReviewAcknowledgedFor(reviewKey);
                }}
                className="mt-3 rounded-full border border-current px-3 py-2 text-xs font-black"
              >
                <T
                  fr="J’ai vérifié le tableau original avec un médecin/pharmacien — activer le choix manuel"
                  ar="راجعت الجدول الأصلي مع طبيب أو صيدلي — فعّل الاختيار اليدوي"
                />
              </button>
            )}
          </div>
        ) : pediatricRefusal ? (
          <div className="rounded-xl p-3" style={{ background: "var(--sev-critical-bg)", color: "var(--sev-critical)" }} role="alert">
            <p className="text-sm font-black"><T fr="Patient pédiatrique : CKID U25 est une information séparée ; le tableau adulte ne fournit ici aucune colonne ni dose." ar="مريض طفل: CKID U25 معلومة منفصلة؛ جدول البالغين لا يوفّر هنا مرحلة ولا جرعة." /></p>
            {ren?.egfrCkid !== null && ren?.egfrCkid !== undefined && (
              <p className="mt-1 text-xs font-bold" dir="ltr">CKID U25 (DFG) : {ren.egfrCkid.toFixed(0)} mL/min/1,73 m²</p>
            )}
          </div>
        ) : renalCourse === "acute" ? (
          <div className="rounded-xl p-3" style={{ background: "var(--sev-critical-bg)", color: "var(--sev-critical)" }} role="alert">
            {ren?.warnings.length ? ren.warnings.map((warning, i) => (
              <p key={i} className="text-sm font-black">⚠ {ar ? warning.ar : warning.fr}</p>
            )) : (
              <p className="text-sm font-black"><T fr="Parcours aigu/variable déclaré : aucun stade ni dosage du tableau de fonction stable n'est proposé, même si les données actuelles ne démontrent pas un critère KDIGO." ar="تم تحديد المسار على أنه حاد/متغير: لا تُعرض مرحلة أو جرعة من جدول الوظيفة المستقرة، حتى إن لم تُظهر البيانات الحالية معيار KDIGO." /></p>
            )}
            {ren?.egfrCkd !== null && ren?.egfrCkd !== undefined && (
              <p className="mt-2 text-xs font-bold" dir="ltr">DFG CKD-EPI estimatif : {ren.egfrCkd.toFixed(0)} mL/min/1,73 m² · ClCr Cockcroft–Gault : {ren.crclCg?.toFixed(0) ?? "—"} mL/min (informatifs, non utilisés pour la dose)</p>
            )}
          </div>
        ) : renalCourse === "unknown" ? (
          <div className="rounded-xl p-3" style={{ background: "var(--sev-urgent-bg)", color: "var(--sev-urgent)" }} role="status">
            {ren?.warnings.length ? ren.warnings.map((warning, i) => (
              <p key={i} className="text-sm font-black">⚠ {ar ? warning.ar : warning.fr}</p>
            )) : (
              <p className="text-sm font-black"><T fr="Une mesure isolée ne permet pas de savoir si la fonction rénale est stable, chronique ou aiguë. Le DFG estimé reste informatif ; aucune dose n'est sélectionnée." ar="لا تكفي قراءة منفردة لمعرفة ما إذا كانت الوظيفة مستقرة أو مزمنة أو حادة. يبقى DFG المقدّر للمعلومة ولا تُختار جرعة." /></p>
            )}
            {ren?.egfrCkd !== null && ren?.egfrCkd !== undefined && (
              <p className="mt-2 text-xs font-bold" dir="ltr">
                CKD-EPI 2021 (DFG estimatif, pas un diagnostic de chronicité) : {ren.egfrCkd.toFixed(0)} mL/min/1,73 m²
                {estimatedStageMeta ? ` · catégorie estimée uniquement : ${ar ? estimatedStageMeta.ar : estimatedStageMeta.fr}` : ""}
                · Cockcroft–Gault (ClCr séparée) : {ren.crclCg?.toFixed(0) ?? "—"} mL/min
              </p>
            )}
            {ren?.egfrCkid !== null && ren?.egfrCkid !== undefined && (
              <p className="mt-2 text-xs font-bold" dir="ltr">CKID U25 (DFG informatif) : {ren.egfrCkid.toFixed(0)} mL/min/1,73 m²</p>
            )}
          </div>
        ) : ren && !ren.refusal ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <p className="text-2xl font-black tabular-nums" dir="ltr">
                {Math.round(ren.primary === "ckid" ? (ren.egfrCkid as number) : (ren.egfrCkd as number))}{" "}
                <span className="text-sm opacity-60">mL/min/1,73 m²</span>
              </p>
              <Badge tone={tone}>{stageLabel}</Badge>
            </div>
            <p className="mt-1 text-xs opacity-70" dir="ltr">
              CKD-EPI 2021 (DFG, stade du tableau) : {ren.egfrCkd?.toFixed(0) ?? "—"} mL/min/1,73 m²
              · Cockcroft–Gault (ClCr séparée) : {ren.crclCg?.toFixed(0) ?? "—"} mL/min
              {ren.cgWeight ? ` (poids ${ren.cgWeight.toFixed(0)} kg${ren.usedAbw ? ", ajusté" : ""})` : ""}
            </p>
            {ren.aki.criteria.length > 0 && (
              <p className="mt-2 rounded-xl p-2 text-xs font-black" style={{ background: "var(--sev-urgent-bg)", color: "var(--sev-urgent)" }}>
                <T fr="KDIGO (agression aiguë) — critères réunis : " ar="KDIGO (قصور حادّ) — المعايير المتحقّقة: " />
                <span dir={ar ? "rtl" : "ltr"}>
                  {ren.aki.criteria.map((c) => (ar ? AKI_LABEL[c].ar : AKI_LABEL[c].fr)).join(" · ")}
                </span>{" "}
                (KDIGO {ren.aki.stage})
              </p>
            )}
            {ren.warnings.map((w, i) => (
              <p key={i} className="mt-1.5 text-xs font-bold opacity-80">⚠ {ar ? w.ar : w.fr}</p>
            ))}
            {manual && (
              <button onClick={clearManualStage} className="mt-2 text-xs font-black underline" style={{ color: "var(--accent)" }}>
                <T fr="Revenir au stade calculé" ar="العودة إلى المرحلة المحسوبة" />
              </button>
            )}
          </>
        ) : (
          <p className="text-sm font-bold opacity-80">
            {ren?.refusal === "height" ? (
              <T
                fr="Enfant (< 18 ans) : la taille est indispensable au calcul CKID U25 — saisissez-la (ou le poids) avant toute posologie."
                ar="طفل (< ١٨ سنة): الطول ضروري لحساب CKID U25 — أدخله (أو الوزن) قبل أي جرعة."
              />
            ) : (
              <T
                fr="Âge, poids et créatinine sont nécessaires au DFG — sinon choisissez le stade ci-dessous."
                ar="العمر والوزن والكرياتينين ضرورية لحساب التصفية — وإلا اختر المرحلة أدناه."
              />
            )}
          </p>
        )}
        {/* اختيار يدوي للمرحلة / Choix manuel du stade */}
        <div className="mt-3 flex flex-wrap gap-2">
          {ATB_RENAL_STAGES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setManual(s.id);
                setManualReviewFor(requiresReview ? reviewKey : null);
              }}
              disabled={renalCourseBlocksDose || pediatricAge || onRenalReplacementTherapy || dialysisRefusal || akiBlocked || creatinineInputIssue || (requiresReview && !reviewAcknowledged)}
              aria-pressed={stage === s.id}
              className={`${chip(stage === s.id)} disabled:cursor-not-allowed disabled:opacity-40`}
              style={chipStyle(stage === s.id, i === 4 ? "var(--sev-critical)" : i === 3 ? "var(--sev-urgent)" : i === 2 ? "var(--sev-standard)" : "var(--accent)")}
            >
              {ar ? s.ar : s.fr} <span className="tabular-nums opacity-80" dir="ltr">{s.dgf}</span>
            </button>
          ))}
        </div>
      </section>

      {/* البحث والفلترة / Recherche & sections */}
      <div className="flex flex-col gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={ar ? "ابحث عن مضاد حيوي (بالعربية أو الفرنسية)…" : "Chercher un antibiotique (FR ou AR)…"}
          className="field"
          aria-label={ar ? "بحث" : "Recherche"}
        />
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={ar ? "اختيار الأدوية" : "Sélection des antibiotiques"}>
          <button
            type="button"
            onClick={() => setShowOnlySelected(false)}
            aria-pressed={!showOnlySelected}
            className={chip(!showOnlySelected)}
            style={chipStyle(!showOnlySelected)}
          >
            <T fr={`Choisir parmi les antibiotiques (${rows.length})`} ar={`اختيار من المضادات (${rows.length})`} />
          </button>
          <button
            type="button"
            onClick={() => setShowOnlySelected(true)}
            aria-pressed={showOnlySelected}
            className={chip(showOnlySelected)}
            style={chipStyle(showOnlySelected)}
          >
            <T fr={`Mes antibiotiques choisis (${selectedMedicationIds.length})`} ar={`مضاداتي المختارة (${selectedMedicationIds.length})`} />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-black opacity-60"><Filter className="h-3.5 w-3.5" aria-hidden /><T fr="Classe" ar="الفئة" /></span>
          <button onClick={() => setSection(null)} aria-pressed={section === null} className={chip(section === null)} style={chipStyle(section === null)}>
            <T fr="Toutes" ar="الكل" />
          </button>
          {ATB_RENAL_SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setSection(section === s.id ? null : s.id)} aria-pressed={section === s.id} className={chip(section === s.id)} style={chipStyle(section === s.id)}>
              {ar ? s.ar : s.fr}
            </button>
          ))}
        </div>
      </div>

      {/* النتائج / Résultats */}
      <p className="text-xs font-black opacity-60">
        {stageMeta
          ? ar
            ? `${visibleRows.length} سطرًا · المرحلة العامة: ${stageMeta.ar}`
            : `${visibleRows.length} lignes · stade général : ${stageMeta.fr}`
          : ar
            ? `${visibleRows.length} سطرًا · لم تُحدَّد المرحلة`
            : `${visibleRows.length} lignes · stade non déterminé`}
        {Number.isFinite(weight) && weight > 0 ? (ar ? ` · الوزن ${weight} كغ` : ` · poids ${weight} kg`) : ""}
      </p>

      {stage ? (
      <ul className="flex flex-col gap-2">
        {visibleRows.map((r) => {
          const secMeta = ATB_RENAL_SECTIONS.find((s) => s.id === r.section);
          const { stage: rowStage, label: rowStageLabel } = stageForMolecule();
          const rowStageIdx = rowStage ? STAGE_IDS.indexOf(rowStage) : -1;
          const hasLineContexts = r.lines.some((l) => Boolean(l.context));
          const value = rowStageIdx >= 0 ? r.lines.map((l) => l.d[rowStageIdx]) : [];
          const infoOnly = r.lines.every((l) => l.kind === "info");
          const bad = value.some((v) => isContraindicated(v));
          const warn = !bad && value.some((v) => isDiscouraged(v));
          const empty = value.every((v) => isNoData(v));
          const decision = decisions.get(r.id);
          // الخلية المدمجة أو الشريحة متعددة النصوص: لا جرعة مجاورة ولا اعتماد آلي.
          const mergedSourceCell = value.some((v) => isMergedSourceCell(v));
          const ambiguousSourceStage = value.some((v) => isAmbiguousSourceCells(v));
          // استعلام «المرحلة المجاورة» — بلا استبدال صامت عند أي التباس هندسي.
          const neighbour = mergedSourceCell || ambiguousSourceStage ? undefined : [rowStageIdx - 1, rowStageIdx + 1]
            .filter((j) => j >= 0 && j < 5)
            .map((j) => r.lines.map((l) => l.d[j]).find((v) => !isNoData(v) && !requiresSourceCheck(v)))
            .find((v) => v !== undefined);
          return (
            <li
              key={r.id}
              className={`card rounded-2xl border border-line bg-surface p-3 ${bad ? "sev-strip sev-critical" : warn ? "sev-strip sev-urgent" : ""}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-black">{ar ? r.ar : r.fr}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold opacity-50" dir="ltr">{r.fr} · p.{r.page}</span>
                  <button
                    type="button"
                    onClick={() => toggleMedicationSelection(r.id)}
                    aria-pressed={selectedMedicationIds.includes(r.id)}
                    className="touch rounded-full border px-3 py-1.5 text-xs font-black"
                    style={selectedMedicationIds.includes(r.id)
                      ? { borderColor: "var(--accent)", color: "var(--accent)" }
                      : { borderColor: "var(--line)", color: "var(--fg)" }}
                  >
                    {selectedMedicationIds.includes(r.id)
                      ? <T fr="Retirer de ma sélection" ar="إزالة من اختياري" />
                      : <T fr="Choisir ce médicament" ar="اختيار هذا الدواء" />}
                  </button>
                </div>
              </div>
              <p className="mt-0.5 text-[11px] font-bold opacity-60">{ar ? secMeta?.ar : secMeta?.fr}</p>
              <p className="mt-1 text-xs font-black" style={{ color: rowStageIdx === 4 ? "var(--sev-critical)" : rowStageIdx === 3 ? "var(--sev-urgent)" : "var(--accent)" }}>
                {ar ? "مرحلة هذا الدواء: " : "Stade pour cette molécule : "}{rowStageLabel}
              </p>
              {r.contextReviewRequired && (
                <p className="mt-2 rounded-xl border border-line bg-surface2 p-2 text-xs font-bold" style={{ color: "var(--sev-urgent)" }} role="note">
                  <T
                    fr="Le tableau présente des lignes, indications ou schémas alternatifs dont le choix requis n'est pas recueilli par cette interface. Les textes restent visibles, mais « Retenir » est bloqué."
                    ar="يعرض الجدول أسطرًا أو استطبابات أو أنظمة بديلة لا تجمع هذه الواجهة الاختيار المطلوب. تبقى النصوص ظاهرة، لكن خيار «اعتماد» معطّل."
                  />
                </p>
              )}

              <div className="mt-2 flex flex-wrap gap-1.5">
                {bad && <Badge tone="critical"><T fr="Contre-indiqué" ar="ممنوع" /></Badge>}
                {warn && <Badge tone="urgent"><T fr="Déconseillé" ar="غير مُستحسن" /></Badge>}
                {empty && <Badge tone="neutral"><T fr="Aucune donnée" ar="لا بيانات" /></Badge>}
                {decision && (
                  <Badge tone={decision.decision === "retenue" ? "standard" : "critical"}>
                    {decision.decision === "retenue" ? <T fr="Retenue" ar="مُعتمدة" /> : <T fr="Abandonnée" ar="متخلّى عنها" />} · #{decision.round}
                  </Badge>
                )}
              </div>

              {/* القيمة للمرحلة المعروضة + الحساب بالوزن */}
              <ul className="mt-2 flex flex-col gap-1.5">
                {r.lines.map((l, i) => {
                  const v = rowStageIdx >= 0 ? l.d[rowStageIdx] : "";
                  const amikDoseGuarded = r.id === "amikacine-iv" && l.kind === "dose" && v.includes("mg/kg") && Number.isFinite(weight) && weight > 0 && amikWeightDoseBlocked;
                  const doseCalculation = l.kind === "dose" && Number.isFinite(weight) && weight > 0 && !amikDoseGuarded
                    ? calculateWeightDose(v, weight, ar ? "ar" : "fr")
                    : null;
                  const calc = doseCalculation?.text ?? null;
                  const unsupportedWeightMaximum = doseCalculation?.refusal === "unsupported-maximum";
                  const check = l.kind === "dose" && requiresSourceCheck(v);
                  return (
                    <li key={i} className="rounded-xl border border-line bg-surface2 px-2.5 py-2">
                      {l.context && (
                        <span className="mb-1 block text-[11px] font-black opacity-70" dir={ar ? "rtl" : "ltr"}>
                          {ar && l.context.ar ? l.context.ar : l.context.fr}
                        </span>
                      )}
                      <span className="block text-sm font-bold" dir="ltr">{v}</span>
                      {calc && (
                        <>
                          <span className="mt-1 block text-sm font-black" style={{ color: "var(--accent)" }}>
                            {calc}
                          </span>
                          {!check && !unsupportedWeightMaximum && !bad && !warn && !r.contextReviewRequired && (
                            <CalculationExplainer
                              context={{
                                title: ar ? `${r.ar} — شرح الحساب الوزني` : `${r.fr} — explication du calcul pondéral`,
                                method: ar
                                  ? `${manualStage === rowStage
                                      ? "المرحلة المعروضة اختيرت يدوياً؛ الذكاء الاصطناعي لا يراجع هذا الاختيار."
                                      : "تستخدم الصفحة CKD-EPI 2021 لاختيار مرحلة DFG في الجدول؛ Cockcroft–Gault قيمة منفصلة ولا تختار هذه المرحلة."} تضرب الصفحة فقط مقطع mg/kg الصريح في نص المصدر في الوزن الفعلي المدخل، وتطبّق السقف فقط إن كان واضحاً في النص. هذا حساب رياضي لما تعرضه الصفحة، وليس وصفة.`
                                  : `${manualStage === rowStage
                                      ? "La colonne affichée a été choisie manuellement ; l’IA ne valide pas ce choix."
                                      : "La page utilise CKD-EPI 2021 pour choisir la catégorie DFG du tableau ; Cockcroft–Gault reste séparé et ne choisit pas cette colonne."} La page multiplie uniquement le segment mg/kg explicite de la source par le poids réel saisi et n’applique un plafond que s’il est explicite. C’est l’explication d’un calcul arithmétique affiché, pas une prescription.`,
                                inputs: [
                                  {
                                    label: ar ? "مرحلة DFG المعروضة لهذا الدواء" : "Catégorie DFG affichée pour cette molécule",
                                    value: rowStageLabel,
                                  },
                                  ...(ren?.egfrCkd !== null && ren?.egfrCkd !== undefined ? [{
                                    label: ar ? "قيمة CKD-EPI 2021 المحسوبة" : "DFG CKD-EPI 2021 calculé",
                                    value: `${ren.egfrCkd.toFixed(4)} mL/min/1,73 m²`,
                                  }] : []),
                                  {
                                    label: ar ? "الوزن الذي استعمله الحساب الوزني" : "Poids utilisé par le calcul pondéral",
                                    value: `${weight} kg`,
                                  },
                                  {
                                    label: ar ? "نص الجرعة الأصلي في الخلية" : "Texte posologique original de la cellule",
                                    value: v,
                                  },
                                  ...(l.context ? [{
                                    label: ar ? "سياق السطر في المصدر" : "Contexte de la ligne source",
                                    value: ar && l.context.ar ? l.context.ar : l.context.fr,
                                  }] : []),
                                ],
                                result: calc,
                                source: `OMEDIT V2.3, p.${r.page} — ${ar ? "النص المستخرج المعروض في التطبيق" : "texte extrait affiché par l’application"}`,
                                limitations: ar
                                  ? [
                                      "الذكاء الاصطناعي يشرح النص والنتيجة المعروضة فقط، ولا يعيد الحساب أو يقترح جرعة أو نظاماً علاجياً.",
                                      "المصدر مقتطف من جدول OMEDIT؛ لا يثبت صحة سريرية مستقلة أو اعتماداً محلياً في تونس.",
                                      "إذا كان السياق أو الخلية ملتبساً، لا يجوز استنتاج جرعة؛ راجع الأصل والنشرة المحلية مع مختص.",
                                    ]
                                  : [
                                      "L’IA explique uniquement le texte et le résultat affichés ; elle ne recalcule pas et ne propose ni dose ni schéma thérapeutique.",
                                      "La source est un extrait du tableau OMEDIT ; cela ne prouve ni validation clinique indépendante ni adoption locale en Tunisie.",
                                      "Si le contexte ou la cellule est ambigu, aucune dose ne doit être inférée ; vérifier l’original et le RCP local avec un professionnel.",
                                    ],
                              }}
                            />
                          )}
                        </>
                      )}
                      {amikDoseGuarded && (
                        <span className="mt-1 block text-xs font-black" style={{ color: "var(--sev-urgent)" }} role="note">
                          {bmi === null
                            ? <T fr="Dose absolue non calculée : renseigner la taille pour vérifier l'IMC." ar="لم تُحسب الجرعة المطلقة: أدخل الطول للتحقق من مؤشر كتلة الجسم." />
                            : <T fr="IMC ≥30 ou poids idéal sélectionné : pas de calcul sur le poids réel. Suivre le poids corrigé du RCP du produit ; cette interface ne l'estime pas." ar="IMC ≥30 أو اختير الوزن المثالي: لا حساب بالوزن الفعلي. اتبع الوزن المصحح في نشرة المنتج؛ هذه الواجهة لا تقدّره." />}
                        </span>
                      )}
                      {unsupportedWeightMaximum && (
                        <span className="mt-1 block text-xs font-black" style={{ color: "var(--sev-urgent)" }} role="note">
                          <T
                            fr="⚠ Calcul bloqué : le plafond chiffré du texte source ne peut pas être appliqué sans ambiguïté. Garder la posologie originale et vérifier la cellule PDF / le RCP."
                            ar="⚠ أُوقف الحساب: لا يمكن تطبيق الحدّ العددي في نص المصدر دون التباس. أبقِ الجرعة الأصلية وراجع خلية PDF أو النشرة الرسمية."
                          />
                        </span>
                      )}
                      {/* ⚠ لا رقم في المصدر: الجرعة تُنقل كما هي، ويلزم التحقق الورقي */}
                      {check && (
                        <span className="mt-1 block text-xs font-black" style={{ color: "var(--sev-urgent)" }}>
                          {isMergedSourceCell(v)
                            ? ar
                              ? "⚠ خلية مدمجة في المصدر: راجع الملاحظة المشتركة؛ لا توجد جرعة رقمية لهذه المرحلة."
                              : "⚠ Cellule fusionnée dans la source : voir la note commune ; aucune dose chiffrée pour ce stade."
                            : isAmbiguousSourceCells(v)
                              ? ar
                                ? "⚠ تتقاطع هذه الشريحة مع خلايا مصدر مختلفة؛ لم تُعتمد جرعة واحدة. راجع النصوص والمصدر الأصلي."
                                : "⚠ Plusieurs cellules source distinctes recouvrent ce stade : aucune dose unique retenue. Vérifier les textes et le PDF original."
                              : isUnassignedSourceContext(v)
                              ? ar
                                ? "⚠ لا تربط خلية المصدر هذه الجرعة بهذا السياق؛ لم تُحدَّد جرعة واحدة. راجع PDF وRCP."
                                : "⚠ La source ne rattache pas cette valeur à ce contexte : aucune dose unique n'est retenue. Vérifier le PDF et le RCP."
                              : isNoData(v)
                                ? ar
                                  ? "⚠ لا بيانات لهذه المرحلة — تحقّق من المصدر (PDF OMEDIT) ومن كون المريض غير خاضع للغسيل."
                                  : "⚠ Aucune donnée pour ce stade — vérifier la source (PDF OMEDIT) et le caractère non dialysé du patient."
                                : ar
                                ? "⚠ المصدر لا يُرقّم هذه الجرعة: انقلها كما هي وتحقّق من الجدول الأصلي."
                                : "⚠ La source ne chiffre pas cette conduite : reprise telle quelle, à vérifier dans le tableau original."}
                        </span>
                      )}
                      {isNoData(v) && neighbour && (
                        <span className="mt-1 block text-xs font-bold opacity-70">
                          <T fr="Indice : le stade voisin porte une valeur — à confirmer dans le tableau (cellule peut-être fusionnée)." ar="إشارة: المرحلة المجاورة تحمل قيمة — تُؤكَّد من الجدول (قد تكون الخليّة مدمجة)." />
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* حلقة a → b: قرار أو إعادة تقييم لحظية */}
              {!infoOnly && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => decide(r.id, "retenue", value[0], rowStage, rowStageLabel)}
                    disabled={!rowStage || mergedSourceCell || ambiguousSourceStage || r.contextReviewRequired}
                    className="rounded-full border px-3 py-1.5 text-xs font-black disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ borderColor: "var(--sev-standard)", color: "var(--sev-standard)" }}
                  >
                    <T fr="✓ Retenir" ar="✓ اعتماد" />
                  </button>
                  <button
                    onClick={() => { setOpenEditor(openEditor === r.id ? null : r.id); setNote(""); }}
                    disabled={!rowStage}
                    className="rounded-full border px-3 py-1.5 text-xs font-black disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ borderColor: "var(--sev-critical)", color: "var(--sev-critical)" }}
                  >
                    <T fr="✗ Abandonner" ar="✗ تخلّي" />
                  </button>
                  {decision && (
                    <span className="text-[11px] font-bold opacity-60">
                      <T fr={`tour ${decision.round}`} ar={`الجولة ${decision.round}`} />
                    </span>
                  )}
                </div>
              )}
              {openEditor === r.id && (
                <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface2 p-2">
                  <select value={reason} onChange={(e) => setReason(e.target.value as PlanReason)} className="field max-w-52 text-xs" aria-label={ar ? "سبب التخلّي" : "motif"}>
                    {(Object.keys(planReasonLabel) as PlanReason[]).map((k) => (
                      <option key={k} value={k}>{ar ? planReasonLabel[k].ar : planReasonLabel[k].fr}</option>
                    ))}
                  </select>
                  <input value={note} onChange={(e) => setNote(e.target.value.slice(0, 120))} placeholder={ar ? "ملاحظة (اختياري)" : "note (facultatif)"} className="field max-w-56 text-xs" aria-label={ar ? "ملاحظة" : "note"} />
                  <button
                    onClick={() => { decide(r.id, "abandonnee", value[0], rowStage, rowStageLabel); setOpenEditor(null); }}
                    disabled={!rowStage}
                    className="rounded-full px-3 py-1.5 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ background: "var(--sev-critical)" }}
                  >
                    <T fr="Confirmer l'abandon" ar="تأكيد التخلّي" />
                  </button>
                </div>
              )}

              {!infoOnly && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-black opacity-70">
                    <T fr="Voir les 5 stades" ar="عرض المراحل الخمس" />
                  </summary>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full min-w-[34rem] border-collapse text-xs">
                      <thead>
                        <tr>
                          {hasLineContexts && (
                            <th scope="col" className="border border-line p-1.5 text-start font-black">
                              <T fr="Contexte" ar="السياق" />
                            </th>
                          )}
                          {ATB_RENAL_STAGES.map((s) => (
                            <th key={s.id} scope="col" className={`border border-line p-1.5 text-start font-black ${s.id === rowStage ? "bg-surface2" : ""}`}>
                              {ar ? s.ar : s.fr}
                              <span className="ms-1 opacity-60 tabular-nums" dir="ltr">{s.dgf}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {r.lines.map((l, i) => (
                          <tr key={i}>
                            {hasLineContexts && (
                              <th scope="row" className="border border-line p-1.5 text-start font-black" dir={ar ? "rtl" : "ltr"}>
                                {l.context ? (ar && l.context.ar ? l.context.ar : l.context.fr) : ""}
                              </th>
                            )}
                            {l.d.map((v, j) => (
                              <td key={j} className={`border border-line p-1.5 align-top ${j === rowStageIdx ? "bg-surface2 font-bold" : ""} ${isContraindicated(v) ? "sev-critical" : ""}`} dir="ltr">
                                {v}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              )}

              {r.notes
                .filter((n) => !n.stages || (!!rowStage && n.stages.includes(rowStage)))
                .map((n, i) => (
                  <p key={i} className="mt-1.5 text-[11px] font-bold italic opacity-70" dir={ar && n.ar ? "rtl" : "ltr"}>
                    {ar && n.ar ? n.ar : n.fr}
                  </p>
                ))}
            </li>
          );
        })}
      </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-line p-4 text-sm font-bold" role="alert">
          <T
            fr="Aucune dose n'est affichée tant qu'un stade rénal valable n'est pas calculé ou choisi manuellement. Vérifiez les unités, l'âge, le poids et la créatinine."
            ar="لا تُعرض جرعات حتى يُحسب طور كلوي صالح أو يُختَر يدويًا. تحقّق من الوحدات والعمر والوزن والكرياتينين."
          />
        </p>
      )}

      {stage && !visibleRows.length && (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          {showOnlySelected && selectedMedicationIds.length === 0
            ? <T fr="Aucun antibiotique choisi pour ce patient. Revenez à la liste pour en ajouter." ar="لم تختر مضاداً لهذا المريض. عُد إلى القائمة لإضافة مضاد." />
            : <T fr="Aucun antibiotique ne correspond à cette recherche ou à votre sélection." ar="لا يوجد مضاد يطابق البحث أو الاختيار." />}
        </p>
      )}

      {/* الخطّة / Plan (étage 3) */}
      <AtbPlanPanel
        plan={plan}
        name={nameOf}
        stageLabel={stageLabel}
        onReevaluate={(id, decision) => {
          const current = stageForMolecule();
          save(addDecision(plan, {
            id,
            decision,
            snapshot: {
              weightKg: Number.isFinite(weight) ? weight : undefined,
              stage: current.stage ?? undefined,
              stageLabel: current.label,
            },
          }));
        }}
        onRemove={(id) => save(removeMolecule(plan, id))}
        onReset={() => save(resetPlan())}
      />

      {!plan.entries.length && (
        <p className="flex items-start gap-2 rounded-2xl border border-dashed border-line p-3 text-xs font-bold opacity-70">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <T
            fr="Astuce : « Retenir » / « Abandonner » sur chaque molécule construit votre plan (avec réévaluation a → b) puis l'exporte en texte pour le dossier du patient."
            ar="تلميح: «اعتماد» / «تخلّي» على كل تركيبة يبني خطّتك (مع إعادة تقييم a → b) ثم يُصدِّرها نصًّا لملف المريض."
          />
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/renal-dose" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
          <T fr="Bridge rénal (16 classes)" ar="الجسر الكلوي (١٦ صنفًا)" />
        </Link>
        <Link href="/calculateurs/antibiotiques" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
          <T fr="Statut de l’ancien calculateur suspendu" ar="حالة الحاسبة القديمة المتوقفة" />
        </Link>
        <Link href="/calculateurs/aki" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
          <T fr="AKI / KDIGO" ar="القصور الكلوي الحادّ KDIGO" />
        </Link>
      </div>
    </div>
  );
}

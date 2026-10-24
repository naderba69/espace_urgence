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
import AtbPlanPanel from "@/components/atb/AtbPlanPanel";
import { normalize } from "@/lib/text";
import { readJSON, writeJSON } from "@/lib/storage";
import { calculateWeightDose, isAmbiguousSourceCells, isContraindicated, isDiscouraged, isMergedSourceCell, isNoData, requiresSourceCheck } from "@/lib/atb-dose";
import { akiKdigo, chooseStage, scrToMgDl, type AkiResult, type StageInput } from "@/lib/renal-clearance";
import { addDecision, emptyPlan, parsePlan, PLAN_KEY, LEGACY_PLAN_KEY, planReasonLabel, removeMolecule, resetPlan, currentDecisions, type PlanReason } from "@/lib/atb-plan";
import { ATB_RENAL_ROWS, ATB_RENAL_SECTIONS, ATB_RENAL_STAGES, ATB_RENAL_BY_ID, type AtbStageId } from "@/data/atb-renal";
import { Pill, Filter, Info, AlertTriangle } from "lucide-react";

const STAGE_IDS = ATB_RENAL_STAGES.map((s) => s.id);

/** مفاتيح معايير KDIGO بالعربية/الفرنسية للعرض. */
const AKI_LABEL: Record<AkiResult["criteria"][number], { fr: string; ar: string }> = {
  "scr-up-48h": { fr: "+0,3 mg/dL en 48 h", ar: "+٠٫٣ مغ/دل في ٤٨ سا" },
  "scr-ratio-48h": { fr: "×1,5 en 48 h", ar: "×١٫٥ في ٤٨ سا" },
  "scr-ratio-7d": { fr: "×1,5 en 7 j", ar: "×١٫٥ في ٧ أيام" },
  "scr-4mg": { fr: "créatinine ≥4 mg/dL avec hausse documentée", ar: "كرياتينين ≥4 مغ/دل مع ارتفاع موثّق" },
  "urine-stage-1": { fr: "diurèse <0,5 mL/kg/h pendant 6 à <12 h", ar: "إدرار <0.5 مل/كغ/سا لمدة من 6 إلى أقل من 12 ساعة" },
  "urine-stage-2": { fr: "diurèse <0,5 mL/kg/h pendant ≥12 h", ar: "إدرار <0.5 مل/كغ/سا لمدة ≥12 ساعة" },
  "urine-stage-3": { fr: "diurèse <0,3 mL/kg/h pendant ≥24 h", ar: "إدرار <0.3 مل/كغ/سا لمدة ≥24 ساعة" },
  "anuria-stage-3": { fr: "anurie pendant ≥12 h", ar: "انقطاع البول لمدة ≥12 ساعة" },
  "renal-replacement": { fr: "épuration extrarénale (critère KDIGO 3)", ar: "الإحلال الكلوي (معيار KDIGO 3)" },
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
  const [manual, setManual] = useState<AtbStageId | null>(null);
  const [manualReviewFor, setManualReviewFor] = useState<string | null>(null);
  const [reviewAcknowledgedFor, setReviewAcknowledgedFor] = useState<string | null>(null);

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
      useIdealWeight: useIbw,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age, wt, ht, scr, scr48, scr7d, urine, urineH, sexe, unit, useIbw, onRenalReplacementTherapy]);
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
      renalReplacementTherapy: onRenalReplacementTherapy,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scr, scr48, scr7d, urine, urineH, unit, onRenalReplacementTherapy]);

  /** DFG (CKD-EPI) sélectionne le stade ; Cockcroft–Gault reste informatif et séparé. */
  const ren = useMemo(() => (renalInput ? chooseStage(renalInput) : null), [renalInput]);
  const pediatricRefusal = ren?.refusal === "pediatric";
  const dialysisRefusal = ren?.refusal === "dialysis";
  // Une AKI connue bloque toute utilisation de ce tableau, y compris un choix manuel.
  const akiBlocked = akiAssessment.stage >= 1;
  const requiresReview = ren?.refusal === "boundary" && !akiBlocked;
  const reviewKey = requiresReview
    ? JSON.stringify({ age, wt, ht, sexe, unit, scr, scr48, scr7d, urine, urineH, useIbw, onRenalReplacementTherapy })
    : null;
  const reviewAcknowledged = reviewKey !== null && reviewAcknowledgedFor === reviewKey;
  const manualStage = manualReviewFor === null
    ? manual
    : reviewAcknowledged && manualReviewFor === reviewKey ? manual : null;
  const stage: AtbStageId | null = pediatricAge || pediatricRefusal || onRenalReplacementTherapy || dialysisRefusal || akiBlocked || creatinineInputIssue
    ? null
    : requiresReview
      ? reviewAcknowledged && manualReviewFor === reviewKey ? manualStage : null
      : manualStage ?? (ren && !ren.refusal ? ren.stage : null);
  const stageIdx = stage ? STAGE_IDS.indexOf(stage) : -1;
  const stageMeta = stageIdx >= 0 ? ATB_RENAL_STAGES[stageIdx] : null;
  const stageLabel = stageMeta
    ? `${ar ? stageMeta.ar : stageMeta.fr} · ${stageMeta.dgf}`
    : ar ? "مرحلة غير محددة" : "stade non déterminé";
  const stageForMolecule = () => {
    const result = renalInput ? chooseStage(renalInput) : null;
    const moleculeRequiresReview = result?.refusal === "boundary" && !akiBlocked;
    const value = pediatricAge || onRenalReplacementTherapy || dialysisRefusal || akiBlocked || creatinineInputIssue || result?.refusal === "pediatric"
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

  // ── الخطّة (حلقة a → b) / Plan antibiotique ────────────────────────────────────────
  const [plan, setPlan] = useState(() => emptyPlan());
  const [legacyPlanDetected, setLegacyPlanDetected] = useState(false);
  useEffect(() => {
    const oldPlan = readJSON<unknown>(LEGACY_PLAN_KEY, null);
    const oldEntries = oldPlan && typeof oldPlan === "object"
      ? (oldPlan as { entries?: unknown }).entries
      : undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydratation locale après mise à jour source
    setLegacyPlanDetected(Array.isArray(oldEntries) && oldEntries.length > 0);
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
            fr="93 lignes du tableau de référence × 5 stades — DFG, dose absolue au poids et plan par patient."
            ar="٩٣ سطرًا من الجدول المرجعي × ٥ مراحل — التصفية، الجرعة المطلقة حسب الوزن، وخطّة لكل مريض."
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

      {legacyPlanDetected && (
        <p role="alert" className="rounded-2xl border border-line p-3 text-sm font-bold" style={{ color: "var(--sev-urgent)" }}>
          <T
            fr="Un plan local de la version précédente a été détecté mais n'a pas été importé après la correction du mappage des cellules source. Reconstituer les décisions depuis le PDF et les revalider ; ne pas réutiliser les anciens snapshots de dose."
            ar="تم العثور على خطة محلية من الإصدار السابق، لكن لم تُستورد بعد تصحيح مطابقة الخلايا المصدرية. أعد بناء القرارات من ملف PDF وراجعها؛ لا تستخدم لقطات الجرعات القديمة."
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
          <NumStepper value={age} onValue={setAge} className="field" label={ar ? "العمر" : "age"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></span>
          <NumStepper value={wt} onValue={setWt} className="field" label={ar ? "الوزن" : "wt"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Taille (cm)" ar="الطول (سم)" /></span>
          <NumStepper value={ht} onValue={setHt} className="field" label={ar ? "الطول" : "ht"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Créatinine (actuelle)" ar="الكرياتينين (الحالي)" /></span>
          <div className="flex items-center gap-2">
            <NumStepper value={scr} onValue={setScr} className="field" label={ar ? "الكرياتينين" : "scr"} />
            <button
              onClick={() => setUnit((u) => (u === "mg" ? "umol" : "mg"))}
              className="shrink-0 rounded-lg border border-line px-2 py-1 text-xs font-black"
              dir="ltr"
            >
              {unit === "mg" ? "mg/dL" : "µmol/L"}
            </button>
          </div>
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Créatinine à 48 h (option)" ar="الكرياتينين قبل ٤٨ سا (اختياري)" /></span>
          <NumStepper value={scr48} onValue={setScr48} className="field" label={ar ? "كرياتينين ٤٨ سا" : "scr48"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Créatinine à 7 j (option)" ar="الكرياتينين قبل ٧ أيام (اختياري)" /></span>
          <NumStepper value={scr7d} onValue={setScr7d} className="field" label={ar ? "كرياتينين ٧ أيام" : "scr7d"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Diurèse (mL/kg/h)" ar="الدُّرْيَة (مل/كغ/سا)" /></span>
          <NumStepper value={urine} onValue={setUrine} step={0.1} className="field" label={ar ? "الدُّرْيَة" : "urine"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Durée d'observation (h)" ar="مدّة المراقبة (سا)" /></span>
          <NumStepper value={urineH} onValue={setUrineH} className="field" label={ar ? "مدّة المراقبة" : "urineH"} />
        </label>
      </section>
      <p className="px-1 text-[11px] font-bold opacity-60">
        <T fr="L'unité sélectionnée s'applique à la créatinine actuelle et aux deux valeurs historiques." ar="تُطبَّق الوحدة المختارة على الكرياتينين الحالي والقيمتين التاريخيتين." />
      </p>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSexe("m")} aria-pressed={sexe === "m"} className={chip(sexe === "m")} style={chipStyle(sexe === "m")}>
          <T fr="Homme" ar="رجل" />
        </button>
        <button onClick={() => setSexe("f")} aria-pressed={sexe === "f"} className={chip(sexe === "f")} style={chipStyle(sexe === "f")}>
          <T fr="Femme (×0,85)" ar="امرأة (×٠٫٨٥)" />
        </button>
        <button onClick={() => setUseIbw((v) => !v)} aria-pressed={useIbw} className={chip(useIbw)} style={chipStyle(useIbw, "var(--sev-urgent)")}>
          <T fr="Poids idéal (obésité)" ar="الوزن المثالي (سمنة)" />
        </button>
      </div>
      <label className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/5 p-3 text-sm font-bold">
        <input
          type="checkbox"
          checked={onRenalReplacementTherapy}
          onChange={(event) => {
            setOnRenalReplacementTherapy(event.target.checked);
            setManual(null);
            setManualReviewFor(null);
            setReviewAcknowledgedFor(null);
          }}
          className="mt-0.5"
        />
        <T fr="Dialyse / épuration extrarénale en cours : le tableau OMEDIT est hors périmètre ; bloquer toute sélection de stade et dose." ar="غسيل أو إحلال كلوي جارٍ: جدول OMEDIT خارج النطاق؛ يُحجب اختيار المرحلة والجرعة." />
      </label>

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
                <T fr="L'épuration extrarénale est également un critère KDIGO de stade 3." ar="الإحلال الكلوي أيضاً معيار KDIGO للمرحلة 3." />
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
                  <button onClick={() => { setManual(null); setManualReviewFor(null); }} className="mt-2 text-xs font-black underline">
                    <T fr="Effacer le stade manuel" ar="امسح المرحلة اليدوية" />
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!reviewKey) return;
                  setManual(null);
                  setManualReviewFor(null);
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
              <button onClick={() => { setManual(null); setManualReviewFor(null); }} className="mt-2 text-xs font-black underline" style={{ color: "var(--accent)" }}>
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
              disabled={pediatricAge || onRenalReplacementTherapy || dialysisRefusal || akiBlocked || creatinineInputIssue || (requiresReview && !reviewAcknowledged)}
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
            ? `${rows.length} سطرًا · المرحلة العامة: ${stageMeta.ar}`
            : `${rows.length} lignes · stade général : ${stageMeta.fr}`
          : ar
            ? `${rows.length} سطرًا · لم تُحدَّد المرحلة`
            : `${rows.length} lignes · stade non déterminé`}
        {Number.isFinite(weight) && weight > 0 ? (ar ? ` · الوزن ${weight} كغ` : ` · poids ${weight} kg`) : ""}
      </p>

      {stage ? (
      <ul className="flex flex-col gap-2">
        {rows.map((r) => {
          const secMeta = ATB_RENAL_SECTIONS.find((s) => s.id === r.section);
          const { stage: rowStage, label: rowStageLabel } = stageForMolecule();
          const rowStageIdx = rowStage ? STAGE_IDS.indexOf(rowStage) : -1;
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
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                <p className="text-sm font-black">{ar ? r.ar : r.fr}</p>
                <span className="text-[11px] font-bold opacity-50" dir="ltr">{r.fr} · p.{r.page}</span>
              </div>
              <p className="mt-0.5 text-[11px] font-bold opacity-60">{ar ? secMeta?.ar : secMeta?.fr}</p>
              <p className="mt-1 text-xs font-black" style={{ color: rowStageIdx === 4 ? "var(--sev-critical)" : rowStageIdx === 3 ? "var(--sev-urgent)" : "var(--accent)" }}>
                {ar ? "مرحلة هذا الدواء: " : "Stade pour cette molécule : "}{rowStageLabel}
              </p>

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
                      <span className="block text-sm font-bold" dir="ltr">{v}</span>
                      {calc && (
                        <span className="mt-1 block text-sm font-black" style={{ color: "var(--accent)" }}>
                          {calc}
                        </span>
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
                    disabled={!rowStage || mergedSourceCell || ambiguousSourceStage}
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

      {stage && !rows.length && (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Aucun antibiotique ne correspond à cette recherche." ar="لا يوجد مضاد حيوي يطابق هذا البحث." />
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
          <T fr="Dose au poids (11 antibiotiques)" ar="الجرعة بالوزن (١١ مضادًا)" />
        </Link>
        <Link href="/calculateurs/aki" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
          <T fr="AKI / KDIGO" ar="القصور الكلوي الحادّ KDIGO" />
        </Link>
      </div>
    </div>
  );
}

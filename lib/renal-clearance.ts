// تقدير الوظيفة الكلوية: مزمن (CKD-EPI 2021) / حادّ (KDIGO) / أطفال (CKID U25).
// Estimation rénale : CKD-EPI 2021, repérage/stadification KDIGO, CKID U25 et calcul Cockcroft-Gault séparé.
// دوالّ نقية، بلا واجهة — مُختبَرة في __tests__/renal-clearance.test.ts.
import type { Localized } from "@/data/types";
import type { AtbStageId } from "@/data/atb-renal";
import { cockcroftGault, isAmbiguousAtbDfgBoundary, stageFromDfg, toMgDl } from "./atb-dose";

/** حدود استعمال CKD-EPI 2021 (معادلة البالغين، بلا معامل العِرق). */
export function ckdEpi2021(ageYears: number, scrMgDl: number, sexe: "m" | "f"): number | null {
  if (!Number.isFinite(ageYears) || !Number.isFinite(scrMgDl) || ageYears <= 0 || scrMgDl <= 0) return null;
  const female = sexe === "f";
  const k = female ? 0.7 : 0.9;
  const a = female ? -0.241 : -0.302;
  const ratio = scrMgDl / k;
  const egfr =
    142 *
    Math.pow(Math.min(ratio, 1), a) *
    Math.pow(Math.max(ratio, 1), -1.2) *
    Math.pow(0.9938, ageYears) *
    (female ? 1.012 : 1);
  return egfr;
}

/** CKID U25 (Schwartz السريري) — نتيجة بوحدة mL/min/1.73 m²، تُقرأ كمعادل تصفية. */
export function schwartzCkidU25(heightCm: number, scrMgDl: number): number | null {
  if (!Number.isFinite(heightCm) || !Number.isFinite(scrMgDl) || heightCm <= 0 || scrMgDl <= 0) return null;
  return 0.413 * (heightCm / scrMgDl);
}

export interface CgWeights {
  bmi: number | null;
  ibw: number | null;
  abw: number | null;
  /** الوزن المستعمل في Cockcroft-Gault : الوزن الفعلي إن BMI < 30، وإلا الوزن المعدّل. */
  cgWeight: number;
  usedAbw: boolean;
}

/** الوزن الصحيح لـ Cockcroft-Gault (قرار v17/v18 : BMI ≥ 30 ⇒ وزن معدّل). */
export function weightsForCg(weightKg: number, heightCm: number | null | undefined, sexe: "m" | "f"): CgWeights {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return { bmi: null, ibw: null, abw: null, cgWeight: weightKg, usedAbw: false };
  }
  if (!Number.isFinite(heightCm as number) || !heightCm || heightCm <= 0) {
    return { bmi: null, ibw: null, abw: null, cgWeight: weightKg, usedAbw: false };
  }
  const h = heightCm / 100;
  const bmi = weightKg / (h * h);
  // Devine : homme 50 + 0,91×(taille − 152,4) ; femme 45,5 + 0,91×(taille − 152,4)
  const ibw = (sexe === "f" ? 45.5 : 50) + 0.91 * (heightCm - 152.4);
  const abw = ibw > 0 ? ibw + 0.4 * (weightKg - ibw) : weightKg;
  const usedAbw = bmi >= 30 && abw > 0;
  return { bmi, ibw: ibw > 0 ? ibw : null, abw: abw > 0 ? abw : null, cgWeight: usedAbw ? abw : weightKg, usedAbw };
}

// المسار السريري لا يُستنتج من تحليل كرياتينين منفرد؛ يجب التصريح به قبل اختيار جرعة ثابتة.
export type RenalCourse = "stable" | "acute" | "unknown";

// ── KDIGO : كشف القصور الكلوي الحادّ ────────────────────────────────────────────────────────
export type AkiStage = 0 | 1 | 2 | 3;

export interface AkiInput {
  scrNow: number;
  /** creatinine à 48 h (mg/dL) — permet le critère +0,3 mg/dL/48 h et le ratio 48 h. */
  scr48h?: number | null;
  /** creatinine de référence à 7 jours (mg/dL). */
  scr7d?: number | null;
  /** diurèse horaire (mL/kg/h) et durée d'observation (h). */
  urineMlKgH?: number | null;
  urineHours?: number | null;
  /** Initiation de l'épuration pendant l'épisode aigu : critère KDIGO de stade 3. */
  renalReplacementTherapyInitiated?: boolean;
}

export interface AkiResult {
  stage: AkiStage;
  /** مفاتيح المعايير المتحقّقة (تُترجم في الواجهة). */
  criteria: (
    | "scr-up-48h"
    | "scr-ratio-48h"
    | "scr-ratio-7d"
    | "scr-4mg"
    | "urine-stage-1"
    | "urine-stage-2"
    | "urine-stage-3"
    | "anuria-stage-3"
    | "renal-replacement"
  )[];
  ratio48h: number | null;
  ratio7d: number | null;
}

/**
 * KDIGO AKI (ليس تشخيصاً): الكرياتينين + معايير الإدرار المرحلية؛ العلاج الإحلالي الكلوي Stage 3.
 * Acute kidney injury criteria from KDIGO 2012; urine-output durations determine stages 1–3.
 */
export function akiKdigo(input: AkiInput): AkiResult {
  const criteria: AkiResult["criteria"] = [];
  const now = input.scrNow;
  const r48 = input.scr48h != null && Number.isFinite(input.scr48h) && input.scr48h > 0 && Number.isFinite(now)
    ? now / input.scr48h
    : null;
  const r7 = input.scr7d != null && Number.isFinite(input.scr7d) && input.scr7d > 0 && Number.isFinite(now)
    ? now / input.scr7d
    : null;
  const acuteCreatinineRise = input.scr48h != null && Number.isFinite(input.scr48h) && input.scr48h > 0
    && Number.isFinite(now) && now - input.scr48h >= 0.3;
  const acuteRiseAtLeastHalfMgDl =
    (input.scr48h != null && Number.isFinite(input.scr48h) && input.scr48h > 0 && Number.isFinite(now) && now - input.scr48h >= 0.5)
    || (input.scr7d != null && Number.isFinite(input.scr7d) && input.scr7d > 0 && Number.isFinite(now) && now - input.scr7d >= 0.5);
  const scr4Criterion = Number.isFinite(now) && now >= 4 && acuteRiseAtLeastHalfMgDl;
  if (acuteCreatinineRise) criteria.push("scr-up-48h");
  if (r48 !== null && r48 >= 1.5) criteria.push("scr-ratio-48h");
  if (r7 !== null && r7 >= 1.5) criteria.push("scr-ratio-7d");
  if (scr4Criterion) criteria.push("scr-4mg");
  if (input.renalReplacementTherapyInitiated) criteria.push("renal-replacement");

  let urineStage: AkiStage = 0;
  const urineRate = input.urineMlKgH;
  const urineHours = input.urineHours;
  if (urineRate != null && Number.isFinite(urineRate) && urineRate >= 0
    && urineHours != null && Number.isFinite(urineHours) && urineHours >= 0) {
    if (urineRate === 0 && urineHours >= 12) {
      urineStage = 3;
      criteria.push("anuria-stage-3");
    } else if (urineRate < 0.3 && urineHours >= 24) {
      urineStage = 3;
      criteria.push("urine-stage-3");
    } else if (urineRate < 0.5 && urineHours >= 12) {
      urineStage = 2;
      criteria.push("urine-stage-2");
    } else if (urineRate < 0.5 && urineHours >= 6) {
      urineStage = 1;
      criteria.push("urine-stage-1");
    }
  }

  const ratioMax = Math.max(r48 ?? 0, r7 ?? 0);
  const creatinineStage: AkiStage = input.renalReplacementTherapyInitiated || ratioMax >= 3 || scr4Criterion
    ? 3
    : ratioMax >= 2
      ? 2
      : ratioMax >= 1.5 || acuteCreatinineRise
        ? 1
        : 0;
  const stage = Math.max(creatinineStage, urineStage) as AkiStage;
  return { stage, criteria, ratio48h: r48, ratio7d: r7 };
}

export interface StageInput {
  ageYears: number;
  sexe: "m" | "f";
  weightKg: number;
  heightCm?: number | null;
  /** creatinine en mg/dL (l'unité est convertie AVANT, via toMgDl). */
  scrMgDl: number;
  scr48h?: number | null;
  scr7d?: number | null;
  urineMlKgH?: number | null;
  urineHours?: number | null;
  /** Patient actuellement sous épuration extrarénale : hors périmètre du tableau, sans conclure à une AKI. */
  onRenalReplacementTherapy?: boolean;
  /** Épuration nouvellement initiée pendant l'épisode aigu : critère KDIGO 3 distinct de la dialyse chronique. */
  renalReplacementTherapyInitiated?: boolean;
  /** الحالة السريرية المصرّح بها؛ تحليل منفرد لا يكفي لاستنتاج الاستقرار. */
  renalCourse: RenalCourse;
  /** poids idéal coché : force l'usage du poids idéal dans Cockcroft-Gault. */
  useIdealWeight?: boolean;
}

export type StageRefusal = "inputs" | "height" | "boundary" | "aki" | "declared-acute" | "course-unknown" | "pediatric" | "dialysis";

export interface StageResult {
  /** المرحلة المعتمدة للعرض (بعد كل القواعد)، أو null إذا لم يمكن حسابها بأمان. */
  stage: AtbStageId | null;
  baseStage: AtbStageId | null;
  /** التقدير الأساسي المستعمل، أو null عند رفض المدخلات. */
  primary: "ckd-epi" | "ckid" | null;
  egfrCkd: number | null;
  egfrCkid: number | null;
  crclCg: number | null;
  cgWeight: number | null;
  usedAbw: boolean;
  aki: AkiResult;
  warningKey: "indexed-low-weight" | null;
  refusal?: StageRefusal;
  /** تنبيهات جاهزة للعرض (FR/AR) — تُبنى هنا حتى تبقى القواعد في مكان واحد. */
  warnings: Localized[];
}

const W = {
  indexed: {
    fr: "CKD-EPI donne un DFG indexé (mL/min/1,73 m²). En poids très bas, interpréter avec prudence et vérifier séparément la ClCr Cockcroft–Gault seulement si le RCP du produit l'utilise ; la ClCr ne choisit jamais une colonne du tableau DFG.",
    ar: "يعطي CKD-EPI قيمة DFG مفهرسة (مل/د/1.73 م²). عند انخفاض الوزن كثيراً، فسّرها بحذر وافحص ClCr بمعادلة Cockcroft–Gault بشكل منفصل فقط إذا كانت نشرة المنتج تعتمدها؛ لا تختار ClCr عموداً من جدول DFG.",
  },
  aki: {
    fr: "Critères KDIGO d'atteinte rénale aiguë présents : la créatinine n'est pas à l'état stable. Ni le DFG estimé ni la ClCr Cockcroft–Gault ne sélectionnent une colonne de ce tableau stable ; aucune dose n'est proposée. Revue clinique et protocole adapté à l'AKI requis.",
    ar: "معايير KDIGO للقصور الكلوي الحاد متحققة: الكرياتينين غير مستقر. لا يختار DFG المقدّر ولا ClCr بمعادلة Cockcroft–Gault عموداً من هذا الجدول المستقر؛ لا تُعرض جرعة. تلزم مراجعة سريرية وبروتوكول خاص بالقصور الحاد.",
  },
  declaredAcute: {
    fr: "Le parcours aigu/variable a été déclaré ou suspecté. L'absence de critère KDIGO dans les données saisies ne suffit pas à rendre la fonction stable ; aucun stade ni dosage du tableau stable n'est proposé.",
    ar: "تم تحديد المسار الكلوي على أنه حاد أو متغير/مشتبه به. عدم ظهور معيار KDIGO في البيانات المدخلة لا يثبت استقرار الوظيفة؛ لذلك لا تُعرض مرحلة أو جرعة من جدول الوظيفة المستقرة.",
  },
  courseUnknown: {
    fr: "Une créatinine isolée permet d'estimer le DFG, mais ne permet pas à elle seule de distinguer une fonction stable/chronique d'une atteinte aiguë. La stabilité n'étant pas connue, aucun stade ni dosage du tableau rénal stable n'est sélectionné.",
    ar: "تحليل كرياتينين واحد يسمح بتقدير DFG، لكنه لا يميّز وحده بين وظيفة مستقرة/مزمنة وقصور حاد. ما دامت استقرارية الوظيفة غير معروفة، لا تُختار مرحلة أو جرعة من جدول الوظيفة المستقرة.",
  },
  dialysis: {
    fr: "Patient sous dialyse/épuration extrarénale : hors du périmètre adulte non dialysé du tableau OMEDIT. Aucun stade ni dosage n'est proposé ici ; vérifier le protocole de dialyse, le RCP et un avis spécialisé.",
    ar: "المريض يخضع للغسيل/الإحلال الكلوي: خارج نطاق جدول OMEDIT المخصص للبالغين غير الخاضعين للغسيل. لا تُعرض هنا مرحلة أو جرعة؛ راجع بروتوكول الغسيل ونشرة المنتج واستشر اختصاصياً.",
  },
  boundary: {
    fr: "DFG = 30 : le tableau source place 30 dans les stades modéré et sévère. Aucun stade ni dose n'est choisi automatiquement. Vérifier le PDF original et faire valider le stade par un médecin/pharmacien.",
    ar: "التصفية = 30: يدرج المصدر 30 ضمن المرحلتين المتوسطة والشديدة. أُوقف الاختيار الآلي للمرحلة والجرعة؛ راجع ملف المصدر وحدّد المرحلة مع طبيب أو صيدلي.",
  },
  ckid: {
    fr: "Enfant (< 18 ans) : CKID U25 calculé à titre informatif ; le tableau de doses est réservé aux adultes. Aucun stade ni dosage adulte n'est sélectionné.",
    ar: "طفل (< 18 سنة): حُسب CKID U25 للمعلومة فقط؛ جدول الجرعات للبالغين. لم تُحدَّد مرحلة أو جرعة للبالغين.",
  },
};

/**
 * لا يختار الجدول المزمن إلا من DFG (CKD-EPI 2021 للبالغ) وبعد تصريح سريري بأن المسار مستقر.
 * تحليل منفرد بمسار مجهول يعطي تقديراً بلا جرعة؛ المسار الحاد وKDIGO-AKI والغسيل والأطفال محجوبة.
 * لا يُحوَّل Cockcroft–Gault إلى DFG ولا يحدد عموداً؛ الحالات الحدّية تطلب مراجعة يدوية.
 */
export function chooseStage(input: StageInput): StageResult {
  const aki = akiKdigo({
    scrNow: input.scrMgDl,
    scr48h: input.scr48h,
    scr7d: input.scr7d,
    urineMlKgH: input.urineMlKgH,
    urineHours: input.urineHours,
    renalReplacementTherapyInitiated: input.renalReplacementTherapyInitiated,
  });
  const warnings: Localized[] = [];
  const empty: StageResult = {
    stage: null,
    baseStage: null,
    primary: null,
    egfrCkd: null,
    egfrCkid: null,
    crclCg: null,
    cgWeight: null,
    usedAbw: false,
    aki,
    warningKey: null,
    warnings,
  };

  if (input.onRenalReplacementTherapy) {
    return { ...empty, refusal: "dialysis", warnings: [W.dialysis] };
  }

  const pediatric = input.ageYears > 0 && input.ageYears < 18;
  const essentials =
    Number.isFinite(input.ageYears) && input.ageYears > 0 &&
    Number.isFinite(input.weightKg) && input.weightKg > 0 &&
    Number.isFinite(input.scrMgDl) && input.scrMgDl > 0;
  if (!essentials) return { ...empty, refusal: "inputs", warnings };
  if (pediatric && !(Number.isFinite(input.heightCm as number) && (input.heightCm as number) > 0)) {
    return { ...empty, refusal: "height", warnings };
  }

  const w = weightsForCg(input.weightKg, input.heightCm, input.sexe);
  const cgWeight = input.useIdealWeight && w.ibw ? Math.min(w.cgWeight, w.ibw) : w.cgWeight;
  const crclCg = cockcroftGault(input.ageYears, cgWeight, input.scrMgDl, input.sexe);
  const egfrCkd = pediatric ? null : ckdEpi2021(input.ageYears, input.scrMgDl, input.sexe);
  const egfrCkid = pediatric ? schwartzCkidU25(input.heightCm as number, input.scrMgDl) : null;

  const primary: Exclude<StageResult["primary"], null> = pediatric ? "ckid" : "ckd-epi";
  const primaryDfg = pediatric ? egfrCkid : egfrCkd;

  // Le tableau est adulte/non dialysé. CKID U25 reste une information pédiatrique,
  // jamais un sélecteur de posologie adulte.
  if (pediatric) {
    return {
      ...empty,
      primary,
      egfrCkd,
      egfrCkid,
      crclCg,
      cgWeight,
      usedAbw: w.usedAbw,
      refusal: "pediatric",
      warnings: [W.ckid],
    };
  }

  // Les colonnes DFG sont sélectionnées uniquement depuis le DFG (CKD-EPI ici), jamais depuis ClCr.
  const ambiguousBoundary = isAmbiguousAtbDfgBoundary(primaryDfg);
  const baseStage = stageFromDfg(primaryDfg ?? NaN);

  // Une AKI détectée par KDIGO prime sur tout stade estimé ou déclaré.
  if (aki.stage >= 1) {
    return {
      ...empty,
      primary,
      egfrCkd,
      egfrCkid,
      crclCg,
      cgWeight,
      usedAbw: w.usedAbw,
      refusal: "aki",
      warnings: [W.aki, ...(ambiguousBoundary ? [W.boundary] : [])],
    };
  }

  // Une déclaration clinique de parcours aigu/variable bloque même si les mesures saisies
  // ne suffisent pas à déclencher un critère KDIGO.
  if (input.renalCourse === "acute") {
    return {
      ...empty,
      baseStage: ambiguousBoundary ? null : baseStage,
      primary,
      egfrCkd,
      egfrCkid,
      crclCg,
      cgWeight,
      usedAbw: w.usedAbw,
      refusal: "declared-acute",
      warnings: [W.declaredAcute, ...(ambiguousBoundary ? [W.boundary] : [])],
    };
  }

  // Une valeur isolée donne un DFG estimatif, pas la preuve d'une maladie stable/chronique.
  if (input.renalCourse === "unknown") {
    return {
      ...empty,
      baseStage: ambiguousBoundary ? null : baseStage,
      primary,
      egfrCkd,
      egfrCkid,
      crclCg,
      cgWeight,
      usedAbw: w.usedAbw,
      refusal: ambiguousBoundary ? "boundary" : "course-unknown",
      warnings: ambiguousBoundary ? [W.courseUnknown, W.boundary] : [W.courseUnknown],
    };
  }

  if (ambiguousBoundary) {
    return {
      ...empty,
      primary,
      egfrCkd,
      egfrCkid,
      crclCg,
      cgWeight,
      usedAbw: w.usedAbw,
      refusal: "boundary",
      warnings: [W.boundary],
    };
  }

  if (baseStage === null) return { ...empty, refusal: "inputs", warnings };

  // CKD-EPI est indexé : avertissement si le poids < 0,8 × le poids idéal.
  let warningKey: StageResult["warningKey"] = null;
  if (w.ibw && input.weightKg < 0.8 * w.ibw) {
    warningKey = "indexed-low-weight";
    warnings.push(W.indexed);
  }

  return {
    stage: baseStage,
    baseStage,
    primary,
    egfrCkd,
    egfrCkid,
    crclCg,
    cgWeight,
    usedAbw: w.usedAbw,
    aki,
    warningKey,
    warnings,
  };
}

/** تحويل وحدة الكرياتينين قبل الحساب (يُصدَّر للاستعمال في الواجهة). */
export function scrToMgDl(value: number, unit: "mg" | "umol"): { mgDl: number | null; suspectUnit: boolean } {
  return toMgDl(value, unit);
}

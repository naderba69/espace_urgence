// v18.1 — تقدير التصفية الكلوية: مزمن (CKD-EPI 2021) / حادّ (KDIGO) / أطفال (CKID U25).
// Estimation de la fonction rénale : chronique (CKD-EPI 2021), agression aiguë (KDIGO),
// enfant (CKID U25 — Schwartz) + règle d'escalade prudente (GPR) et poids de calcul.
// دوالّ نقية، بلا واجهة — مُختبَرة في __tests__/renal-clearance.test.ts.
import type { Localized } from "@/data/types";
import type { AtbStageId } from "@/data/atb-renal";
import { cockcroftGault, stageFromCrCl, toMgDl } from "./atb-dose";

/** المراحل مرتّبة من الأخفّ إلى الأشدّ. */
export const STAGE_ORDER: AtbStageId[] = ["normorenal", "legere", "moderee", "severe", "terminale"];

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
}

export interface AkiResult {
  stage: AkiStage;
  /** مفاتيح المعايير المتحقّقة (تُترجم في الواجهة). */
  criteria: ("scr-up-48h" | "scr-ratio-48h" | "scr-ratio-7d" | "urine-6h")[];
  ratio48h: number | null;
  ratio7d: number | null;
}

/**
 * معايير KDIGO (تذكير للمساعدة على القرار، ليس تشخيصًا): +0,3 مغ/دل/48 سا، أو ×1,5/48 سا،
 * أو ×1,5/7 أيام، أو دُرْيَة < 0,5 مل/كغ/سا لمدّة 6 ساعات. الشرط: استبعاد نقص الحجم أولاً.
 */
export function akiKdigo(input: AkiInput): AkiResult {
  const criteria: AkiResult["criteria"] = [];
  const now = input.scrNow;
  const r48 = input.scr48h && input.scr48h > 0 ? now / input.scr48h : null;
  const r7 = input.scr7d && input.scr7d > 0 ? now / input.scr7d : null;
  if (input.scr48h && input.scr48h > 0 && now - input.scr48h >= 0.3) criteria.push("scr-up-48h");
  if (r48 !== null && r48 >= 1.5) criteria.push("scr-ratio-48h");
  if (r7 !== null && r7 >= 1.5) criteria.push("scr-ratio-7d");
  if (
    input.urineMlKgH !== null &&
    input.urineMlKgH !== undefined &&
    input.urineMlKgH > 0 &&
    input.urineMlKgH < 0.5 &&
    (input.urineHours ?? 0) >= 6
  ) {
    criteria.push("urine-6h");
  }
  // شدّة (KDIGO 1/2/3) على أساس النسبة وليس على التشخيص
  const ratioMax = Math.max(r48 ?? 0, r7 ?? 0);
  let stage: AkiStage = 0;
  if (ratioMax >= 3 || now >= 4) stage = 3;
  else if (ratioMax >= 2) stage = 2;
  else if (criteria.length) stage = 1;
  if (stage === 0 && criteria.length) stage = 1;
  return { stage, criteria, ratio48h: r48, ratio7d: r7 };
}

/** أدوية لا يجوز فيها تصعيد المرحلة عند DFG < 30 (تجنّب نقص الجرعة في الإنتانات الخطيرة). */
export const LIFESAVING_IDS: string[] = [
  "ceftriaxone-im-iv",
  "cefotaxime-im-iv",
  "amikacine-iv",
  "gentamicine-im-iv",
  "vancomycine-iv",
  "piperacilline-tazobactam-iv",
  "metronidazole-iv",
  "metronidazole-po",
];

/** تصعيد المرحلة بعدد من الدرجات (قصوى: المرحلة الأخيرة). */
export function escalateStage(stage: AtbStageId, steps = 2): AtbStageId {
  const i = STAGE_ORDER.indexOf(stage);
  if (i < 0) return stage;
  return STAGE_ORDER[Math.min(STAGE_ORDER.length - 1, i + steps)];
}

const worse = (a: AtbStageId, b: AtbStageId): AtbStageId =>
  STAGE_ORDER.indexOf(a) >= STAGE_ORDER.indexOf(b) ? a : b;

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
  /** DFG 30–90 avec dégradation documentée (< 3 mois) : règle GPR d'escalade prudente. */
  degraded?: boolean;
  /** molécule affichée (sert à l'exception « médicaments vitaux »). */
  moleculeId?: string;
  /** poids idéal coché : force l'usage du poids idéal dans Cockcroft-Gault. */
  useIdealWeight?: boolean;
}

export type StageRefusal = "inputs" | "height";

export interface StageResult {
  /** المرحلة المعتمدة للعرض (بعد كل القواعد). */
  stage: AtbStageId;
  baseStage: AtbStageId;
  /** التقدير الأساسي المستعمل. */
  primary: "ckd-epi" | "ckid" | "cg";
  egfrCkd: number | null;
  egfrCkid: number | null;
  crclCg: number | null;
  cgWeight: number | null;
  usedAbw: boolean;
  aki: AkiResult;
  escalated: boolean;
  escalationExempt: boolean;
  warningKey: "indexed-low-weight" | null;
  refusal?: StageRefusal;
  /** تنبيهات جاهزة للعرض (FR/AR) — تُبنى هنا حتى تبقى القواعد في مكان واحد. */
  warnings: Localized[];
}

const W = {
  indexed: {
    fr: "CKD-EPI est indexé (mL/min/1,73 m²) — surestime la posologie si le poids est très bas : contrôle par Cockcroft-Gault.",
    ar: "قيمة CKD-EPI مُفهرَسة (mL/min/1,73 م²) — قد تبالغ في الجرعة إذا كان الوزن منخفضًا جدًّا: تحقّق بـ Cockcroft-Gault.",
  },
  aki: {
    fr: "Critères KDIGO d'agression aiguë réunis : le stade le plus prudent des deux estimations est retenu (à confirmer après correction volémique).",
    ar: "معايير KDIGO للقصور الحادّ متحقّقة: تُعتمد المرحلة الأكثر حذرًا من التقديرين (تُؤكَّد بعد تصحيح نقص الحجم).",
  },
  escalated: {
    fr: "Escalade prudente GPR : DFG 30–90 dégradé ⇒ traitement comme deux stades plus sévères (dose non changeante pour les molécules vitales si DFG < 30).",
    ar: "تصعيد حذر (GPR): تصفية 30–90 مع تدهور ⇒ التعامل كمرحلتين أشدّ (باستثناء الأدوية الحيوية إذا كانت التصفية < 30).",
  },
  exempt: {
    fr: "Escalade NON appliquée : molécule vitale avec DFG < 30 — éviter le sous-dosage de l'infection grave.",
    ar: "لم يُطبَّق التصعيد: دواء حيوي وتصفية < 30 — لتجنّب نقص الجرعة في الإنتان الخطير.",
  },
  ckid: {
    fr: "Enfant (< 18 ans) : CKID U25 (0,413 × taille/créatinine), lu comme équivalent de clairance — NE PAS mélanger avec le moteur pédiatrique d'antibiotiques.",
    ar: "طفل (< 18 سنة): CKID U25 (0,413 × الطول/الكرياتينين)، تُقرأ كمعادل تصفية — لا تُخلط مع محرّك جرعات الأطفال.",
  },
};

/**
 * المرحلة الكلوية المعتمدة: CKD-EPI للمزمن، CKID U25 للطفل، وCockcroft-Gault كتقدير ثانٍ
 * ومصدر «الأكثر حذرًا» عند القصور الحادّ. لا تُغيّر أي رقم جرعة — اختيار المرحلة فقط.
 */
export function chooseStage(input: StageInput): StageResult {
  const aki = akiKdigo({
    scrNow: input.scrMgDl,
    scr48h: input.scr48h,
    scr7d: input.scr7d,
    urineMlKgH: input.urineMlKgH,
    urineHours: input.urineHours,
  });
  const warnings: Localized[] = [];
  const empty: StageResult = {
    stage: "normorenal",
    baseStage: "normorenal",
    primary: "cg",
    egfrCkd: null,
    egfrCkid: null,
    crclCg: null,
    cgWeight: null,
    usedAbw: false,
    aki,
    escalated: false,
    escalationExempt: false,
    warningKey: null,
    warnings,
  };

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

  let primary: StageResult["primary"] = pediatric ? "ckid" : "ckd-epi";
  let baseStage: AtbStageId;
  if (pediatric) {
    baseStage = stageFromCrCl(egfrCkid as number);
  } else {
    baseStage = stageFromCrCl(egfrCkd as number);
    // القصور الحادّ: نأخذ الأكثر حذرًا بين CKD-EPI و Cockcroft-Gault
    if (aki.stage >= 1 && crclCg !== null) {
      const cgStage = stageFromCrCl(crclCg);
      const chosen = worse(baseStage, cgStage);
      if (chosen !== baseStage) primary = "cg";
      baseStage = chosen;
      warnings.push(W.aki);
    }
  }

  // CKD-EPI مُفهرَس: تنبيه إذا كان الوزن < 0,8 × المثالي
  let warningKey: StageResult["warningKey"] = null;
  if (!pediatric && w.ibw && input.weightKg < 0.8 * w.ibw) {
    warningKey = "indexed-low-weight";
    warnings.push(W.indexed);
  }

  // التصعيد الحذر (GPR) — للمراحل 30–90 فقط
  const inRange = STAGE_ORDER.indexOf(baseStage) === 1 || STAGE_ORDER.indexOf(baseStage) === 2;
  const lifesaving = input.moleculeId ? LIFESAVING_IDS.includes(input.moleculeId) : false;
  const minEstimate = Math.min(
    ...[egfrCkd, crclCg].filter((v): v is number => v !== null && Number.isFinite(v)),
  );
  const escalationExempt = lifesaving && Number.isFinite(minEstimate) && minEstimate < 30;
  let escalated = false;
  let stage = baseStage;
  if (input.degraded && inRange) {
    if (escalationExempt) {
      warnings.push(W.exempt);
    } else {
      stage = escalateStage(baseStage, 2);
      escalated = true;
      warnings.push(W.escalated);
    }
  }
  if (pediatric) warnings.push(W.ckid);

  return {
    stage,
    baseStage,
    primary,
    egfrCkd,
    egfrCkid,
    crclCg,
    cgWeight,
    usedAbw: w.usedAbw,
    aki,
    escalated,
    escalationExempt,
    warningKey,
    warnings,
  };
}

/** تحويل وحدة الكرياتينين قبل الحساب (يُصدَّر للاستعمال في الواجهة). */
export function scrToMgDl(value: number, unit: "mg" | "umol"): { mgDl: number; suspectUnit: boolean } {
  return toMgDl(value, unit);
}

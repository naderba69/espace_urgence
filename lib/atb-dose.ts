// ⚕️ محرّك حساب الجرعة المطلقة من نصّ الجرعة الوزنية — دوالّ نقية، بلا واجهة.
// Moteur de calcul : transforme une posologie « mg/kg » (texte du tableau de référence) en
// quantité absolue pour un poids donné. Fonctions pures, testées (__tests__/atb-renal.test.ts).
//
// ⚠️ Le texte source n'est JAMAIS modifié ni interprété au-delà de ce qu'il dit :
//    on ne calcule que ce qui est explicitement pondéral (`mg/kg`). Tout le reste (doses
//    fixes en mg/g/MUI, « DC », « Aucune donnée », « Déconseillé ») est laissé tel quel.
//    ⚠️ لا يُحسب إلا ما ورد وزنيًا في المصدر (mg/kg)؛ كل ما هو ثابت يُترك كما هو.

export interface WeightDose {
  /** المقطع الأصلي من النصّ الذي حُسب — fragment source (français). */
  source: string;
  /** المجال بالملّيغرام: الأدنى (والأعلى إن كان النصّ مجالاً). */
  lowMg: number;
  highMg: number;
  /** الفاصل الزمني بالساعات كما ورد (24, 12, 8, 48, 72) أو null إن كان «/j» أو مجهولاً. */
  intervalH: number | null;
  /** true إذا كان النصّ يعني «/24h» أو «/j» (جرعة يومية). */
  per24h: boolean;
  /** عدد الجرعات اليومية المستخرج من « en N injections/prises/perfusions » إن وُجد. */
  dosesPerDay: number | null;
}

/** الحدّ الأدنى للتحويل إلى غرام: 1000 مغ. */
const G_THRESHOLD = 1000;

// مجالات الجرعة كما ترد في الجدول: « 15 à 30 mg/kg/j », « 100 mg/kg/24h », « 6 à 8 mg/kg/12h »…
const WEIGHT_RE = /(\d+(?:[.,]\d+)?)\s*(?:à\s*(\d+(?:[.,]\d+)?)\s*)?mg\/kg(?:\s*\/\s*(\d+)\s*h|\s*\/\s*j(?:our)?)?/g;
const PER_DOSE_RE = /(\d+)\s*(?:injections?|prises?|perfusions?|administrations?)/;
/** عبارات تُبطل الحساب لأنّ الجرعة فيها ثابتة أو ممنوعة أو منقوصة الوصف. */
const NO_COMPUTE_RE = /(dose unique|Aucune donnée|Déconseillé|Contre-indiqué|Réduction de la posologie|½ dose|¼ dose)/i;

const num = (s: string): number => parseFloat(s.replace(",", "."));

/** يستخرج كل المقاطع الوزنية القابلة للحساب من نصّ جرعة واحد. */
export function parseWeightDoses(text: string): WeightDose[] {
  if (!text || NO_COMPUTE_RE.test(text)) return [];
  const out: WeightDose[] = [];
  for (const m of text.matchAll(WEIGHT_RE)) {
    const low = num(m[1]);
    const high = m[2] ? num(m[2]) : low;
    const rawInterval = m[3] ? parseInt(m[3], 10) : null;
    // « mg/kg/j » (sans nombre) vaut 24 h ; « mg/kg » seul = dose unitaire (intervalle inconnu)
    const per24h = /mg\/kg\s*\/\s*j/.test(m[0]) || rawInterval === 24;
    out.push({
      source: m[0],
      lowMg: low,
      highMg: high,
      intervalH: rawInterval,
      per24h,
      dosesPerDay: null,
    });
  }
  if (!out.length) return [];
  // « … en 4 injections » : le nombre de prises ne concerne que le DERNIER fragment
  // (c'est la forme rencontrée dans le tableau : « 100 mg/kg/24h en 4 injections »).
  const perDose = text.match(PER_DOSE_RE);
  if (perDose) out[out.length - 1].dosesPerDay = parseInt(perDose[1], 10);
  return out;
}

/** تنسيق كمية بالملّيغرام: غرام عندما ≥ 1000 مغ، مع تقليم الأصفار. */
export function fmtMass(mg: number, lang: "fr" | "ar"): string {
  const toAr = (s: string) => (lang === "ar" ? s.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]).replace(".", "٫") : s);
  if (mg >= G_THRESHOLD) {
    const g = Math.round((mg / G_THRESHOLD) * 100) / 100;
    return toAr(`${String(g).replace(".", ",")} g`);
  }
  return toAr(`${Math.round(mg * 10) / 10} mg`);
}

/**
 * يحوّل نصّ جرعة إلى جملة مقدار مطلق للوزن المعطى، أو null إذا لا شيء وزنيّ قابل للحساب.
 * Exemple : `100 mg/kg/24h en 4 injections` à 70 kg → « ≈ 7 g/24h · 1,75 g par prise (4 prises) ».
 */
export function weightDoseText(text: string, weightKg: number, lang: "fr" | "ar"): string | null {
  if (!Number.isFinite(weightKg) || weightKg <= 0) return null;
  const parts = parseWeightDoses(text);
  if (!parts.length) return null;
  const chunks = parts.map((p) => {
    const lo = p.lowMg * weightKg;
    const hi = p.highMg * weightKg;
    // كتلة الجرعة: رقم واحد أو مجال
    const mass = lo === hi
      ? fmtMass(lo, lang)
      : lang === "ar"
        ? `${fmtMass(lo, lang)} إلى ${fmtMass(hi, lang)}`
        : `${fmtMass(lo, lang)} à ${fmtMass(hi, lang)}`;
    // الفاصل: /24h أو /Xh أو جرعة وحيدة مجهولة الفاصل
    const per = p.per24h
      ? (lang === "ar" ? "/24 سا" : "/24h")
      : p.intervalH
        ? (lang === "ar" ? ` كل ${p.intervalH} سا` : ` toutes les ${p.intervalH} h`)
        : (lang === "ar" ? " للجرعة" : " par prise");
    // « en 4 injections » ⇒ كمية الجرعة الواحدة
    if (p.dosesPerDay && p.dosesPerDay > 1 && p.per24h) {
      const lo1 = lo / p.dosesPerDay;
      const hi1 = hi / p.dosesPerDay;
      const unit = lo1 === hi1
        ? fmtMass(lo1, lang)
        : lang === "ar"
          ? `${fmtMass(lo1, lang)} إلى ${fmtMass(hi1, lang)}`
          : `${fmtMass(lo1, lang)} à ${fmtMass(hi1, lang)}`;
      const n = lang === "ar" ? String(p.dosesPerDay) : `${p.dosesPerDay}`;
      const nTxt = lang === "ar" ? n.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]) : n;
      return lang === "ar"
        ? `${mass}${per} · ${unit} لكل جرعة (${nTxt} جرعات)`
        : `${mass}${per} · ${unit} par prise (${n} prises)`;
    }
    return `${mass}${per}`;
  });
  return [...new Set(chunks)].join(lang === "ar" ? " · ثم " : " · puis ");
}

/** هل يحتوي النصّ على قيمة تحتاج قراءة بشرية فقط (لا حساب)؟ يُستخدم في الواجهة للتوضيح. */
export function isNoData(text: string): boolean {
  return /Aucune donnée/i.test(text);
}

export function isDiscouraged(text: string): boolean {
  return /Déconseillé|Contre-indiqué/i.test(text);
}

export function isContraindicated(text: string): boolean {
  return /Contre-indiqué/i.test(text);
}

// ─────────────────────────────────────────────────────────────────────────────────────────
// DFG (Cockcroft-Gault) et stade rénal — adultes non dialysés uniquement.
// ⚠️ حدود المراحل هي نفسها المعتمدة في الجدول المرجعي (≥90 / 89→60 / 59→30 / 30→15 / <15).
// ─────────────────────────────────────────────────────────────────────────────────────────
import type { AtbStageId } from "@/data/atb-renal";

export const STAGE_ORDER: AtbStageId[] = ["normorenal", "legere", "moderee", "severe", "terminale"];

/** المرحلة الكلوية الموافقة لتصفية معيّنة / Stade correspondant à une clairance donnée. */
export function stageFromCrCl(crcl: number): AtbStageId {
  if (!Number.isFinite(crcl) || crcl < 0) return "normorenal";
  if (crcl >= 90) return "normorenal";
  if (crcl >= 60) return "legere";
  if (crcl >= 30) return "moderee";
  if (crcl >= 15) return "severe";
  return "terminale";
}

/** كل مغ/دل = 88,4 µmol/L. حماية من إدخال µmol/L في خانة mg/dL. */
export function toMgDl(value: number, unit: "mg" | "umol"): { mgDl: number; suspectUnit: boolean } {
  if (unit === "umol") return { mgDl: value / 88.4, suspectUnit: false };
  if (value > 20) return { mgDl: value / 88.4, suspectUnit: true }; // créatinine humaine max ≈ 20 mg/dL
  return { mgDl: value, suspectUnit: false };
}

/** Cockcroft-Gault : (140 − âge) × poids × 0,85 (femme) / (72 × créatinine mg/dL). */
export function cockcroftGault(
  age: number,
  weightKg: number,
  scrMgDl: number,
  sexe: "m" | "f",
): number | null {
  if (!Number.isFinite(age) || !Number.isFinite(weightKg) || !Number.isFinite(scrMgDl)) return null;
  if (age <= 0 || weightKg <= 0 || scrMgDl <= 0) return null;
  return ((140 - age) * weightKg * (sexe === "f" ? 0.85 : 1)) / (72 * scrMgDl);
}

/** هل الجرعة المطبوعة أوضح من أن تُحسب؟ (تُعرض كما هي فقط) / Valeur non calculable. */
export function isFixedOnly(text: string): boolean {
  return parseWeightDoses(text).length === 0;
}

/** يحتاج نصّ الجرعة مراجعة المصدر الأصلي (لا يُشتَقّ منه رقم) — راجع الجدول الورقي. */
// Marqueurs pour lesquels la source ne donne PAS de valeur chiffrée exploitable :
// « Aucune donnée », « Réduction de la posologie » (sans pourcentage), ½ / ¼ dose.
export function requiresSourceCheck(text: string): boolean {
  return isNoData(text) || /Réduction de la posologie|½\s*dose|¼\s*dose|1\/2 dose|1\/4 dose/i.test(text);
}

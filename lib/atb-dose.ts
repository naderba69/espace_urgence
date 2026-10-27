// ⚕️ محرّك حساب الجرعة المطلقة من نصّ الجرعة الوزنية — دوالّ نقية، بلا واجهة.
// Moteur de calcul : transforme une posologie « mg/kg » (texte du tableau de référence) en
// quantité absolue pour un poids donné. Fonctions pures, testées (__tests__/atb-renal.test.ts).
//
// ⚠️ Le texte source n'est JAMAIS modifié ni interprété au-delà de ce qu'il dit :
//    seules les quantités explicitement pondérales (`mg/kg`) sont converties. Les doses fixes
//    en mg/g/MUI et les valeurs non calculables restent inchangées. Une dose de charge `mg/kg`
//    est convertie en quantité, sans reconstruire le schéma complet ni inférer un nombre de prises.
//    ⚠️ تُحوَّل الكمية المذكورة صراحةً بوحدة mg/kg فقط، حتى في جرعة التحميل؛ ولا يُستنتج نظام
//    إعطاء غير مذكور. الجرعات الثابتة والنصوص غير القابلة للحساب تبقى كما هي.

export interface WeightDose {
  /** المقطع الأصلي من النصّ الذي حُسب — fragment source (français). */
  source: string;
  /** المجال العددي بوحدة mg/kg كما ورد في المصدر. */
  lowMg: number;
  highMg: number;
  /** الفاصل بالساعات كما ورد؛ «/j» و«1 fois/24h» يمثّلان 24 ساعة. */
  intervalH: number | null;
  /** true إذا كانت الكمية المذكورة مجموع جرعة 24 ساعة. */
  per24h: boolean;
  /** عدد الجرعات اليومي فقط إذا كان ثابتاً ومذكوراً صراحة. */
  dosesPerDay: number | null;
}

export type WeightDoseRefusal = "source-check" | "unsupported-maximum";

export interface WeightDoseCalculation {
  text: string | null;
  /** سبب حجب الحساب؛ لا يُستخدم لاختيار جرعة بديلة. */
  refusal: WeightDoseRefusal | null;
}

/** الحدّ الأدنى للتحويل إلى غرام: 1000 مغ. */
const G_THRESHOLD = 1000;

// مجالات الجرعة كما ترد في خلايا الجدول: «15 à 30 mg/kg/j»، «100 mg/kg/24h»…
const WEIGHT_RE = /(\d+(?:[.,]\d+)?)\s*(?:à\s*(\d+(?:[.,]\d+)?)\s*)?mg\s*\/\s*kg(?:\s*\/\s*(\d+)\s*h|\s*\/\s*j(?:our)?)?/g;
const PER_DOSE_RE = /\ben\s+(\d+)\s+(?:injections?|prises?|perfusions?|administrations?)\b/i;
const ONCE_PER_DAY_RE = /\b(?:1|une)\s*fois\s*(?:\/\s*(?:24\s*h|j)|par\s+jour)\b/i;
/** عبارات تُبطل الحساب لأنّ المصدر لا يقدّم جرعة رقمية وحيدة قابلة للحساب. */
const NO_COMPUTE_RE = /(dose unique|Aucune donnée|Déconseillé|Contre-indiqué|Réduction de la posologie|½\s*dose|¼\s*dose|1\s*\/\s*2\s*dose|1\s*\/\s*4\s*dose)/i;
const MAXIMUM_MARKER_RE = /(?:\bmax(?:imum|imale)?\b|sans\s+d[ée]passer|(?:dose|posologie)\s+max)/i;

interface WeightDoseCap {
  maxMg: number;
  /** الحدّ مكتوب mg/kg (لا mg أو g مطلقة). */
  perKg: boolean;
  /** «/24h» أو «/j» أو لكل جرعة؛ null تعني أن الوحدة الزمنية غير محددة. */
  period: "24h" | "dose" | null;
  source: string;
  start: number;
  end: number;
}

interface ParsedWeightDose {
  dose: WeightDose;
  start: number;
  end: number;
}

interface WeightDoseAnalysis {
  doses: ParsedWeightDose[];
  cap: WeightDoseCap | null;
  refusal: WeightDoseRefusal | null;
}

const num = (s: string): number => parseFloat(s.replace(",", "."));

function periodFromText(value: string | undefined): WeightDoseCap["period"] {
  if (!value) return null;
  if (/prise/i.test(value)) return "dose";
  if (/24|j/i.test(value)) return "24h";
  return null;
}

function capToMg(amount: string, unit: string): number {
  const value = num(amount);
  return unit.toLowerCase() === "g" ? value * 1000 : value;
}

/**
 * Extrait uniquement les plafonds explicitement chiffrés et munis de leur unité.
 * Les formes visées sont celles présentes dans le PDF : « sans dépasser 4 g/24h »,
 * « 300 mg/j maximum » et « 25 mg/kg/j maximum ». Toute autre forme reste bloquée.
 */
function parseWeightDoseCaps(text: string): WeightDoseCap[] {
  const caps: WeightDoseCap[] = [];
  const add = (
    match: RegExpMatchArray,
    amount: string,
    unit: string,
    perKg: boolean,
    periodText: string | undefined,
  ) => {
    const start = match.index ?? 0;
    caps.push({
      maxMg: capToMg(amount, unit),
      perKg,
      period: periodFromText(periodText),
      source: match[0],
      start,
      end: start + match[0].length,
    });
  };

  // « sans dépasser 4 g/24h », « maximum 300 mg/j », « max 25 mg/kg/j ».
  const prefix = /\b(?:sans\s+d[ée]passer|(?:dose|posologie)\s+max(?:imum|imale)?|max(?:imum|imale)?)\s*(?:(?:de|=|:)\s*)?(\d+(?:[.,]\d+)?)\s*(mg|g)\s*(?:\/\s*(kg)\s*(?:\/\s*(24\s*h|j(?:our)?|prise))?|\/\s*(24\s*h|j(?:our)?|prise))?/gi;
  for (const match of text.matchAll(prefix)) {
    add(match, match[1], match[2], Boolean(match[3]), match[4] ?? match[5]);
  }

  // Plafonds dont « maximum » est placé après la quantité dans la cellule PDF.
  const suffixPerKg = /(\d+(?:[.,]\d+)?)\s*mg\s*\/\s*kg\s*\/\s*(24\s*h|j(?:our)?)\s*(?:maximum|max(?:imale)?)\b/gi;
  for (const match of text.matchAll(suffixPerKg)) {
    add(match, match[1], "mg", true, match[2]);
  }
  const suffixAbsolute = /(\d+(?:[.,]\d+)?)\s*(mg|g)\s*\/\s*(24\s*h|j(?:our)?|prise)\s*(?:maximum|max(?:imale)?)\b/gi;
  for (const match of text.matchAll(suffixAbsolute)) {
    add(match, match[1], match[2], false, match[3]);
  }

  // Un plafond peut correspondre à la forme préfixe et suffixe simultanément (ex. « max … maximum »).
  // Dédupliquer seulement les mêmes limites qui se chevauchent, sans fusionner des limites différentes.
  const unique: WeightDoseCap[] = [];
  for (const cap of caps.sort((a, b) => a.start - b.start)) {
    const duplicate = unique.some((existing) =>
      existing.start < cap.end && cap.start < existing.end
      && existing.maxMg === cap.maxMg
      && existing.perKg === cap.perKg
      && existing.period === cap.period,
    );
    if (!duplicate) unique.push(cap);
  }
  return unique;
}

function analyzeWeightDoses(text: string): WeightDoseAnalysis {
  if (!text || NO_COMPUTE_RE.test(text)) {
    return {
      doses: [],
      cap: null,
      refusal: /mg\s*\/\s*kg/i.test(text) && NO_COMPUTE_RE.test(text) ? "source-check" : null,
    };
  }

  const caps = parseWeightDoseCaps(text);
  const maximumMentioned = MAXIMUM_MARKER_RE.test(text);
  const rawMatches = Array.from(text.matchAll(WEIGHT_RE));
  const matches = rawMatches.filter((match) => {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    // « 25 mg/kg/j maximum » est un plafond, pas une seconde posologie.
    return !caps.some((cap) => start < cap.end && cap.start < end);
  });

  const doses = matches.map((match, index): ParsedWeightDose => {
    const low = num(match[1]);
    const high = match[2] ? num(match[2]) : low;
    const rawInterval = match[3] ? parseInt(match[3], 10) : null;
    const start = (match.index ?? 0) + match[0].length;
    const end = matches[index + 1]?.index ?? text.length;
    // N'associer fréquence et dose que dans le fragment immédiatement concerné, avant « ou/puis ».
    // Une fourchette (« en 4 à 6 injections ») n'est jamais ramenée arbitrairement à un nombre.
    const localText = text.slice(start, end).split(/\b(?:ou|puis)\b/i, 1)[0];
    const perDose = localText.match(PER_DOSE_RE);
    const oncePerDay = ONCE_PER_DAY_RE.test(localText);
    const per24h = rawInterval === 24 || /\/\s*j(?:our)?\b/i.test(match[0]) || oncePerDay;

    return {
      dose: {
        source: match[0],
        lowMg: low,
        highMg: high,
        intervalH: rawInterval ?? (oncePerDay ? 24 : null),
        per24h,
        dosesPerDay: perDose ? parseInt(perDose[1], 10) : oncePerDay ? 1 : null,
      },
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length,
    };
  });

  // Une dose fixe n'appelle aucun calcul mg/kg, même si la cellule précise un maximum.
  if (doses.length === 0) return { doses, cap: null, refusal: null };
  if (maximumMentioned && caps.length === 0) {
    return { doses, cap: null, refusal: "unsupported-maximum" };
  }
  if (caps.length > 1 || (caps.length === 1 && doses.length !== 1)) {
    return { doses, cap: null, refusal: "unsupported-maximum" };
  }
  const cap = caps[0] ?? null;
  if (cap && cap.period === null) return { doses, cap: null, refusal: "unsupported-maximum" };
  return { doses, cap, refusal: null };
}

/** يستخرج المقاطع الوزنية القابلة للحساب؛ الحدود القصوى لا تعود كأنها جرعات مستقلة. */
export function parseWeightDoses(text: string): WeightDose[] {
  const analysis = analyzeWeightDoses(text);
  if (analysis.refusal) return [];
  return analysis.doses.map(({ dose }) => dose);
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

function formatMassRange(low: number, high: number, lang: "fr" | "ar"): string {
  if (low === high) return fmtMass(low, lang);
  return lang === "ar"
    ? `${fmtMass(low, lang)} إلى ${fmtMass(high, lang)}`
    : `${fmtMass(low, lang)} à ${fmtMass(high, lang)}`;
}

interface AbsoluteDoseRange {
  lowMg: number;
  highMg: number;
  capped: boolean;
}

/** يطبّق الحدّ الصريح فقط عندما تتطابق وحدته وفترته مع نصّ الجرعة. */
function applyExplicitMaximum(
  dose: WeightDose,
  weightKg: number,
  cap: WeightDoseCap | null,
): AbsoluteDoseRange | null {
  const rawLow = dose.lowMg * weightKg;
  const rawHigh = dose.highMg * weightKg;
  if (!cap) return { lowMg: rawLow, highMg: rawHigh, capped: false };

  if (cap.period === "24h") {
    if (!dose.per24h) return null;
    if (cap.perKg) {
      const lowRate = Math.min(dose.lowMg, cap.maxMg);
      const highRate = Math.min(dose.highMg, cap.maxMg);
      return {
        lowMg: lowRate * weightKg,
        highMg: highRate * weightKg,
        capped: highRate < dose.highMg,
      };
    }
    return {
      lowMg: Math.min(rawLow, cap.maxMg),
      highMg: Math.min(rawHigh, cap.maxMg),
      capped: rawHigh > cap.maxMg,
    };
  }

  // الحدّ لكل جرعة. إذا كان الأصل مجموعاً يومياً، يلزم عدد جرعات ثابت وصريح قبل تطبيقه.
  const dosesPerDay = dose.dosesPerDay;
  if (dose.per24h && (!dosesPerDay || dosesPerDay < 1)) return null;
  const divisor = dose.per24h ? dosesPerDay! : 1;
  if (cap.perKg) {
    const lowRate = Math.min(dose.lowMg / divisor, cap.maxMg);
    const highRate = Math.min(dose.highMg / divisor, cap.maxMg);
    return {
      lowMg: lowRate * weightKg * divisor,
      highMg: highRate * weightKg * divisor,
      capped: highRate < dose.highMg / divisor,
    };
  }
  const lowPerDose = Math.min(rawLow / divisor, cap.maxMg);
  const highPerDose = Math.min(rawHigh / divisor, cap.maxMg);
  return {
    lowMg: lowPerDose * divisor,
    highMg: highPerDose * divisor,
    capped: highPerDose < rawHigh / divisor,
  };
}

function localizedCount(value: number, lang: "fr" | "ar"): string {
  const text = String(value);
  return lang === "ar" ? text.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]) : text;
}

function renderWeightDose(
  dose: WeightDose,
  weightKg: number,
  cap: WeightDoseCap | null,
  lang: "fr" | "ar",
): { text: string; capped: boolean } | null {
  const range = applyExplicitMaximum(dose, weightKg, cap);
  if (!range) return null;
  const mass = formatMassRange(range.lowMg, range.highMg, lang);
  const per = dose.per24h
    ? (lang === "ar" ? "/24 سا" : "/24h")
    : dose.intervalH
      ? (lang === "ar" ? ` كل ${dose.intervalH} سا` : ` toutes les ${dose.intervalH} h`)
      : (lang === "ar" ? " للجرعة" : " par prise");

  let text = `${mass}${per}`;
  if (dose.dosesPerDay && dose.dosesPerDay > 1 && dose.per24h) {
    const count = dose.dosesPerDay;
    const perDose = formatMassRange(range.lowMg / count, range.highMg / count, lang);
    text += lang === "ar"
      ? ` · ${perDose} لكل جرعة (${localizedCount(count, lang)} جرعات)`
      : ` · ${perDose} par prise (${count} prises)`;
  }
  if (range.capped) {
    text += lang === "ar"
      ? " (طُبّق الحد الأقصى الصريح الوارد في المصدر)"
      : " (plafond explicite de la source appliqué)";
  }
  return { text, capped: range.capped };
}

function connectorBetween(text: string, leftEnd: number, rightStart: number, lang: "fr" | "ar"): string {
  const gap = text.slice(leftEnd, rightStart);
  // « ou » a الأولوية على « puis » عندما يذكر المصدر بديل تسريب بعد جرعة تحميل.
  if (/\bou\b/i.test(gap)) return lang === "ar" ? " أو " : " ou ";
  if (/\bpuis\b/i.test(gap)) return lang === "ar" ? " ثم " : " puis ";
  return lang === "ar" ? " · " : " · ";
}

/**
 * يحوّل فقط المقاطع الوزنية الصريحة، مع احترام سقف المصدر. السقف المبهم أو غير المتوافق
 * مع الوحدة/التوقيت يحجب الحساب بدلاً من تجاهله. يبقى النص الفرنسي الأصلي ظاهراً في الواجهة.
 */
export function calculateWeightDose(
  text: string,
  weightKg: number,
  lang: "fr" | "ar",
): WeightDoseCalculation {
  if (!Number.isFinite(weightKg) || weightKg <= 0) return { text: null, refusal: null };
  const analysis = analyzeWeightDoses(text);
  if (analysis.refusal) return { text: null, refusal: analysis.refusal };
  if (!analysis.doses.length) return { text: null, refusal: null };

  const rendered = analysis.doses.map(({ dose }) => renderWeightDose(dose, weightKg, analysis.cap, lang));
  if (rendered.some((part) => part === null)) return { text: null, refusal: "unsupported-maximum" };
  const parts = rendered as Array<{ text: string; capped: boolean }>;
  const chunks = parts.map((part, index) => {
    if (index === parts.length - 1) return part.text;
    const next = analysis.doses[index + 1];
    return `${part.text}${connectorBetween(text, analysis.doses[index].end, next.start, lang)}`;
  });
  return { text: chunks.join(""), refusal: null };
}

/** واجهة نصية مختصرة للعرض القديم؛ استخدم calculateWeightDose لمعرفة سبب الحجب. */
export function weightDoseText(text: string, weightKg: number, lang: "fr" | "ar"): string | null {
  return calculateWeightDose(text, weightKg, lang).text;
}

/** هل يحتوي النصّ على قيمة تحتاج قراءة بشرية فقط (لا حساب)؟ يُستخدم في الواجهة للتوضيح. */
export function isNoData(text: string): boolean {
  return /Aucune donnée/i.test(text);
}

/** خلية جدول مدمجة/غير رقمية؛ لا يجوز ملؤها من المرحلة المجاورة. */
export function isMergedSourceCell(text: string): boolean {
  return /Cellule fusionnée/i.test(text);
}

/** الشريحة الهندسية تتقاطع مع خلايا مصدرية مختلفة؛ لا تُختَر جرعة مفردة آليًا. */
export function isAmbiguousSourceCells(text: string): boolean {
  return /Cellules source multiples/i.test(text);
}

/** Contexte clinique présent dans la source mais non attribué explicitement à cette cellule. */
export function isUnassignedSourceContext(text: string): boolean {
  return /Contexte source non attribué/i.test(text);
}

export function isDiscouraged(text: string): boolean {
  return /Déconseillé|Contre-indiqué/i.test(text);
}

export function isContraindicated(text: string): boolean {
  return /Contre-indiqué/i.test(text);
}

// ─────────────────────────────────────────────────────────────────────────────────────────
// Stade du tableau DFG (mL/min/1,73 m²) — ne pas y introduire une valeur Cockcroft-Gault.
// ⚠️ المصدر يضع 30 في المرحلتين المتجاورتين؛ تُحجب المرحلة عند هذه القيمة حتى حسمها مهنياً.
// ─────────────────────────────────────────────────────────────────────────────────────────
import type { AtbStageId } from "@/data/atb-renal";

export const STAGE_ORDER: AtbStageId[] = ["normorenal", "legere", "moderee", "severe", "terminale"];

/** قيمة 30 متداخلة في الجدول؛ السماحية لمقاومة فروق الفاصلة العائمة فقط. */
export function isAmbiguousAtbDfgBoundary(value: number | null | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value) && Math.abs(value - 30) <= 1e-6;
}

/** يصنّف قيمة DFG إلى أعمدة جدول المضادات؛ لا تمرّر إليه ClCr Cockcroft–Gault. */
export function stageFromDfg(dfg: number): AtbStageId | null {
  // Une valeur absente, infinie, négative ou exactement au seuil ambigu ne donne pas de stade.
  // Refuser le stade évite de proposer silencieusement une dose à partir d'un choix arbitraire.
  if (!Number.isFinite(dfg) || dfg < 0 || isAmbiguousAtbDfgBoundary(dfg)) return null;
  if (dfg >= 90) return "normorenal";
  if (dfg >= 60) return "legere";
  if (dfg > 30) return "moderee";
  if (dfg >= 15) return "severe";
  return "terminale";
}

/** كل مغ/دل = 88,4 µmol/L. القيم غير المعقولة تُرفض ولا تُحوّل آليًا إلى وحدة أخرى. */
export function toMgDl(value: number, unit: "mg" | "umol"): { mgDl: number | null; suspectUnit: boolean } {
  if (!Number.isFinite(value) || value <= 0) return { mgDl: null, suspectUnit: false };
  if (unit === "umol") return { mgDl: value / 88.4, suspectUnit: false };
  if (value > 20) return { mgDl: null, suspectUnit: true };
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
// Marqueurs qui empêchent une sélection/calcul automatiques : absence de donnée,
// cellule fusionnée ou ambiguë, contexte source non attribué, réduction non chiffrée, ½ / ¼ dose.
export function requiresSourceCheck(text: string): boolean {
  return isNoData(text) || isMergedSourceCell(text) || isAmbiguousSourceCells(text) || isUnassignedSourceContext(text)
    || /Réduction de la posologie|½\s*dose|¼\s*dose|1\/2 dose|1\/4 dose/i.test(text);
}

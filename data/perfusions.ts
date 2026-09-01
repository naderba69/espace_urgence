// Perfusions usuelles en milieu d'urgence/SMUR — concentrations vérifiées ERC/SFAR/SSC.
// Structure : paliers de vitesse prêts à l'emploi (mL/h) selon la concentration choisie.
import type { Localized } from "@/data/types";

export interface PerfusionPreset {
  /** Identifiant (lié à data/medications — optionnel si non présent dans la pharmacopée) */
  drugId: string;
  label: Localized;               // nom affiché (fallback si drug non répertorié)
  prep: Localized;                // ex. "4 mg dans 50 mL NaCl"
  concUgPerMl: number;            // concentration en microgrammes/mL (pour calculs)
  unit: string;                   // "µg/kg/min" ou "mg/h" ou "UI/h"
  doseMin: number;                // dose usuelle min (dans l'unité)
  doseMax: number;                // dose usuelle max
  doseStep: number;               // pas de titration
  doseStart?: number;             // dose de départ recommandée
  weightBased: boolean;           // vrai si dose ∝ poids
  note?: Localized;
}

export const PERFUSIONS: PerfusionPreset[] = [
  // ─── Noradrénaline (choc septique, PAM cible 65) ───
  {
    drugId: "noradrenaline",
    label: { fr: "Noradrénaline", ar: "نورأدرينالين" },
    prep: { fr: "4 mg dans 50 mL G5 % (exclusif)", ar: "4 ملغ في 50 مل جلوكوز 5%" },
    concUgPerMl: (4 * 1000) / 50,          // 80 µg/mL
    unit: "µg/kg/min",
    doseMin: 0.05, doseMax: 0.5, doseStep: 0.02, doseStart: 0.1,
    weightBased: true,
    note: { fr: "Cible PAM 65 mmHg ; vérifier le point d'injection.", ar: "الهدف ضغط متوسط 65؛ تحقق من موضع الحقن." },
  },
  {
    drugId: "noradrenaline",
    label: { fr: "Noradrénaline", ar: "نورأدرينالين" },
    prep: { fr: "8 mg dans 50 mL G5 % (haute concentration)", ar: "8 ملغ في 50 مل (تركيز عالٍ)" },
    concUgPerMl: (8 * 1000) / 50,          // 160 µg/mL
    unit: "µg/kg/min",
    doseMin: 0.05, doseMax: 0.8, doseStep: 0.02,
    weightBased: true,
  },
  // ─── Adrénaline (anaphylaxie réfractaire, bradycardie) ───
  {
    drugId: "adrenaline",
    label: { fr: "Adrénaline", ar: "أدرينالين" },
    prep: { fr: "3 mg dans 50 mL NaCl 0,9 %", ar: "3 ملغ في 50 مل NaCl" },
    concUgPerMl: (3 * 1000) / 50,          // 60 µg/mL
    unit: "µg/kg/min",
    doseMin: 0.02, doseMax: 0.3, doseStep: 0.02, doseStart: 0.05,
    weightBased: true,
    note: { fr: "Anaphylaxie réfractaire / bradycardie résistante.", ar: "تأق مقاوم / بطء قلب مقاوم." },
  },
  {
    drugId: "adrenaline",
    label: { fr: "Adrénaline", ar: "أدرينالين" },
    prep: { fr: "1 mg dans 50 mL NaCl (précision control)", ar: "1 ملغ في 50 مل" },
    concUgPerMl: 1000 / 50,                // 20 µg/mL
    unit: "µg/min",
    doseMin: 1, doseMax: 20, doseStep: 1,
    weightBased: false,
  },
  // ─── Dobutamine (hypotension cardiogénique) ───
  {
    drugId: "dobutamine",
    label: { fr: "Dobutamine", ar: "دوبوتامين" },
    prep: { fr: "250 mg dans 50 mL G5 %", ar: "250 ملغ في 50 مل" },
    concUgPerMl: (250 * 1000) / 50,        // 5000 µg/mL
    unit: "µg/kg/min",
    doseMin: 2, doseMax: 20, doseStep: 0.5, doseStart: 5,
    weightBased: true,
  },
  // ─── Midazolam (sédation / état de mal réfractaire) ───
  {
    drugId: "midazolam",
    label: { fr: "Midazolam (Hypnovel®)", ar: "ميدازولام (هيبنوفيل)" },
    prep: { fr: "50 mg dans 50 mL NaCl 0,9 %", ar: "50 ملغ في 50 مل" },
    concUgPerMl: 1000,                      // 1 mg/mL = 1000 µg/mL
    unit: "mg/h",
    doseMin: 1, doseMax: 15, doseStep: 0.5, doseStart: 3,
    weightBased: false,
    note: { fr: "Titration échelle de Richmond ; surveiller SpO2 + FR.", ar: "معايرة بمقياس ريتشموند؛ راقب التشبع والتنفس." },
  },
  // ─── Héparine (nomogramme pondéral usuel) ───
  {
    drugId: "heparine",
    label: { fr: "Héparine HNF", ar: "هيبارين غير مجزأ" },
    prep: { fr: "25 000 UI dans 250 mL NaCl (100 UI/mL)", ar: "25 ألف وحدة في 250 مل (100 وحدة/مل)" },
    concUgPerMl: 100,                       // en "UI/mL" (pas µg)
    unit: "UI/kg/h",
    doseMin: 12, doseMax: 22, doseStep: 1, doseStart: 18,
    weightBased: true,
    note: { fr: "TCA à 6 h puis ajustement ; plafonner ≤ 22 U/kg/h.", ar: "TCA عند 6 س ثم معايرة؛ سقف 22." },
  },
  // ─── Insuline rapide (ACD, hyperK+ avec glucose) ───
  {
    drugId: "insuline-rapide",
    label: { fr: "Insuline rapide (Actrapid®)", ar: "إنسولين سريع (أكترابيد)" },
    prep: { fr: "50 UI dans 50 mL NaCl 0,9 % (1 UI/mL)", ar: "50 وحدة في 50 مل (1 وحدة/مل)" },
    concUgPerMl: 1,                         // UI/mL
    unit: "UI/kg/h",
    doseMin: 0.05, doseMax: 0.15, doseStep: 0.01, doseStart: 0.1,
    weightBased: true,
    note: { fr: "ACD : démarrer uniquement si K ≥ 3,3 mmol/L.", ar: "ACD: لا تبدأ إلا إذا K ≥ 3.3." },
  },
  // ─── Amiodarone (trouble du rythme / post-ACR) ───
  {
    drugId: "amiodarone",
    label: { fr: "Amiodarone (Cordarone®)", ar: "أميودارون (كوردارون)" },
    prep: { fr: "600 mg dans 50 mL G5 % (12 mg/mL)", ar: "600 ملغ في 50 مل G5%" },
    concUgPerMl: 12000,
    unit: "mg/min",
    doseMin: 0.5, doseMax: 1, doseStep: 0.1, doseStart: 1,
    weightBased: false,
    note: { fr: "Charge 150 mg/10 min puis entretien 1 mg/min × 6 h.", ar: "شحن 150 ملغ/10 د ثم 1 ملغ/د × 6 س." },
  },
  // ─── Nitroglycérine/trinitrine (OAP, HTA d'urgence) ───
  {
    drugId: "trinitrine",
    label: { fr: "Trinitrine (Natispray®)", ar: "ترينيترين (ناتيسبراي)" },
    prep: { fr: "25 mg dans 50 mL G5 % (0,5 mg/mL)", ar: "25 ملغ في 50 مل" },
    concUgPerMl: 500,
    unit: "µg/min",
    doseMin: 5, doseMax: 200, doseStep: 5, doseStart: 10,
    weightBased: false,
  },
  // ─── Esmolol (BAV/fréquence rapide sélectif B1) ───
  {
    drugId: "esmolol",
    label: { fr: "Esmolol", ar: "إسمو لول" },
    prep: { fr: "2,5 g dans 250 mL (10 mg/mL, flacon prêt)", ar: "2.5 غ في 250 مل (10 ملغ/مل)" },
    concUgPerMl: 10000,
    unit: "µg/kg/min",
    doseMin: 50, doseMax: 200, doseStep: 25, doseStart: 50,
    weightBased: true,
    note: { fr: "Bolus 0,5 mg/kg avant si fréquence très élevée.", ar: "دفعة 0.5 ملغ/كغ قبل إذا كان التسرع شديداً." },
  },
  // ─── MgSO4 (éclampsie, asthme grave) ───
  {
    drugId: "sulfate-magnesium",
    label: { fr: "Sulfate de magnésium", ar: "كبريتات المغنيزيوم" },
    prep: { fr: "4 g dans 50 mL (bolus 15–20 min)", ar: "4 غ في 50 مل (دفعة 15–20 د)" },
    concUgPerMl: 80000,
    unit: "g/h",
    doseMin: 1, doseMax: 2, doseStep: 0.5, doseStart: 1,
    weightBased: false,
    note: { fr: "Antidote : gluconate de calcium 1 g IV.", ar: "الترياق: غلوكونات الكالسيوم 1 غ وريدي." },
  },
  // ─── Phényléphrine (choc avec hypovolémie, hypotension per-ACR) ───
  {
    drugId: "phenylephrine",
    label: { fr: "Phényléphrine", ar: "فنيل إفرين" },
    prep: { fr: "10 mg dans 250 mL (40 µg/mL)", ar: "10 ملغ في 250 مل (40 مكغ/مل)" },
    concUgPerMl: 40,
    unit: "µg/min",
    doseMin: 20, doseMax: 200, doseStep: 10, doseStart: 50,
    weightBased: false,
    note: { fr: "Choc avec hypovolémie / vasoplégie péri-ACR (pas d'inotrope).", ar: "صدمة بنقص حجم أو وقت التوقف (بلا إينوتروب)." },
  },
  // ─── Propofol (sédation RSI/réanimation) — NE PAS oublier les lipides ───
  {
    drugId: "propofol",
    label: { fr: "Propofol (Diprivan®)", ar: "بروبوفول (ديبريفان)" },
    prep: { fr: "Flacon 1 % — 10 mg/mL (prêt, pas de dilution)", ar: "قارورة 1% — 10 ملغ/مل — جاهز بلا تخفيف" },
    concUgPerMl: 10000,
    unit: "mg/kg/h",
    doseMin: 1, doseMax: 5, doseStep: 0.5, doseStart: 3,
    weightBased: true,
    note: { fr: "⚠️ Bolus entraînant une hypokaliémie + arrêt cardiaque si sédation prolongée sans tramadol/kétamine associée.", ar: "⚠️ نقص K+ وخطر توقف إذا طال التسريب بلا تسكين مرافق." },
  },
  // ─── Kétamine (sédation dissociative — douleur/asthme sévère) ───
  {
    drugId: "ketamine",
    label: { fr: "Kétamine", ar: "كيتامين" },
    prep: { fr: "200 mg dans 50 mL (4 mg/mL)", ar: "200 ملغ في 50 مل (4 ملغ/مل)" },
    concUgPerMl: 4000,
    unit: "mg/h",
    doseMin: 5, doseMax: 40, doseStep: 5, doseStart: 10,
    weightBased: false,
    note: { fr: "Ne jamais en IVP pure rapide (dépression respiratoire) ; dilution lente 5 min.", ar: "لا IVP سريع (اكتئاب تنفسي)؛ خفّف وادفع على 5 د." },
  },
  // ─── Fentanyl (analgésie RSI/sédation) ───
  {
    drugId: "fentanyl",
    label: { fr: "Fentanyl", ar: "فنتانيل" },
    prep: { fr: "500 µg dans 50 mL (10 µg/mL)", ar: "500 مكغ في 50 مل (10 مكغ/مل)" },
    concUgPerMl: 10,
    unit: "µg/kg/h",
    doseMin: 0.5, doseMax: 3, doseStep: 0.25, doseStart: 1,
    weightBased: true,
    note: { fr: "Surveiller rigidité thoracique si > 1,5 µg/kg en bolus.", ar: "راقب تخشّب الصدر عند bolus > 1.5 مكغ/كغ." },
  },
  // ─── Nicardipine (HTA urgence — si disponible) ───
  {
    drugId: "nicardipine",
    label: { fr: "Nicardipine (Loxen®)", ar: "نيكارديبين (لوكسن)" },
    prep: { fr: "50 mg dans 250 mL (0,2 mg/mL)", ar: "50 ملغ في 250 مل (0.2 ملغ/مل)" },
    concUgPerMl: 200,
    unit: "mg/h",
    doseMin: 1, doseMax: 15, doseStep: 0.5, doseStart: 5,
    weightBased: false,
    note: { fr: "Ne pas croiser avec vérapamil IV (risque de bloc complet).", ar: "لا تجمعه مع فيراباميل وريدي (خطر حصر كامل)." },
  },
];

/** Calcule mL/h = (dose×poids×60)/(concentration), en tenant compte des unités. */
export function perfusionFlow(p: PerfusionPreset, dose: number, weightKg: number): number {
  if (!dose || dose <= 0) return 0;
  let doseUgPerMin = dose;
  if (p.weightBased) doseUgPerMin = dose * weightKg;
  // conversion selon l'unité
  switch (p.unit) {
    case "µg/kg/min": case "µg/min": return (doseUgPerMin * 60) / (p.concUgPerMl || 1);
    case "µg/kg/h": return (doseUgPerMin) / (p.concUgPerMl || 1);                  // déjà /h, conc en µg/mL
    case "mg/kg/h": case "mg/h": case "mg/min":
      return (doseUgPerMin * (p.unit === "mg/min" ? 60 : 1)) / (p.concUgPerMl / 1000);
    case "UI/kg/h": case "UI/h": return doseUgPerMin / (p.concUgPerMl || 1);       // UI/mL direct
    case "g/h":    return (doseUgPerMin) / (p.concUgPerMl / 1_000_000);
    default: return 0;
  }
}

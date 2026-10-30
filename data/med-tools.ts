// v1.9 — configuration des outils embarqués par page médicament.
// Ajouter un outil à un médicament = éditer ce fichier, jamais le composant.
import type { Localized } from "./types";
import type { PumpUnit } from "@/lib/calc";

export interface PumpCfg {
  unit: PumpUnit;
  doseMin: number;
  doseMax: number;
  doseStep: number;
  doseStart: number;
  /** préparation départementale par défaut */
  defAmpMg: number;   // mg (ou UI) par ampoule
  defAmpVol: number;  // volume d'une ampoule (mL)
  defCount: number;   // nb d'ampoules
  defTarget: number;  // volume cible de dilution (mL)
  warnAbove?: number; // garde-fou : alerte au-delà de cette dose
}
export interface WeightDoseCfg {
  mgPerKg: number;
  maxMg: number;
  decimals?: number;
  note: Localized;
}
export interface MedToolCfg {
  pump?: PumpCfg;
  weightDose?: WeightDoseCfg;
  links?: { href: string; label: Localized }[];
  protocols?: string[];
  badges?: { renal?: Localized; pregnancy?: Localized; qt?: Localized };
}

export const MED_TOOLS: Record<string, MedToolCfg> = {
  noradrenaline: {
    // Standard calcul : 8 mg base/50 mL = 160 µg/mL. 2 × 4 mg base-equivalent ampoules only when the local RCP confirms that equivalence.
    pump: { unit: "µg/kg/min", doseMin: 0.01, doseMax: 1, doseStep: 0.01, doseStart: 0.05, defAmpMg: 4, defAmpVol: 4, defCount: 2, defTarget: 50, warnAbove: 0.5 },
    protocols: ["choc-septique"],
  },
  dobutamine: {
    // Référence RCP Panpharma : 250 mg complétés au volume final de 250 mL (≈1 mg/mL).
    // Version de préparation à incrémenter si la concentration standard évolue.
    pump: { unit: "µg/kg/min", doseMin: 2.5, doseMax: 10, doseStep: 2.5, doseStart: 2.5, defAmpMg: 250, defAmpVol: 20, defCount: 1, defTarget: 250, warnAbove: 10 },
    protocols: ["oap"],
  },
  adrenaline: {
    pump: { unit: "µg/kg/min", doseMin: 0.01, doseMax: 1, doseStep: 0.01, doseStart: 0.1, defAmpMg: 1, defAmpVol: 1, defCount: 4, defTarget: 50 },
    weightDose: { mgPerKg: 0.01, maxMg: 0.5, decimals: 2, note: { fr: "Anaphylaxie : IM cuisse, répétable à 5 min", ar: "الأنافيلاكسي: عضلياً بالفخذ، تُكرر عند الحاجة بعد 5 دقائق" } },
    links: [{ href: "/calculateurs/dose-anaphylaxie", label: { fr: "Dose anaphylaxie par âge", ar: "جرعة الأنافيلاكسي بالعمر" } }],
    protocols: ["anaphylaxie", "acr-adulte", "acr-pediatrique", "asthme-aigu-grave"],
  },
  amiodarone: {
    pump: { unit: "mg/h", doseMin: 10, doseMax: 60, doseStep: 5, doseStart: 37, defAmpMg: 150, defAmpVol: 3, defCount: 6, defTarget: 50 },
    weightDose: { mgPerKg: 5, maxMg: 300, note: { fr: "ACR pédiatrique : 5 mg/kg (max 300)", ar: "توقف القلب للطفل: 5 ملغ/كغ (الحد 300)" } },
    protocols: ["tachycardie", "acr-adulte"],
    badges: { qt: { fr: "Allonge QT", ar: "يطيل QT" } },
  },
  amikacine: {
    links: [
      { href: "/calculateurs/antibio-renal?q=Amikacine", label: { fr: "Tableau ATB OMEDIT (DFG, référence séparée)", ar: "جدول OMEDIT للمضادات (DFG، مرجع منفصل)" } },
    ],
    badges: { renal: { fr: "Répétition guidée par la fonction rénale/TDM", ar: "تكرار الجرعة حسب الكلى وقياس مستويات الدواء" } },
  },
  enoxaparine: {
    links: [{ href: "/calculateurs/enoxaparine", label: { fr: "Dose par poids et clairance", ar: "الجرعة بالوزن والتصفية" } }],
    protocols: ["embolie-pulmonaire", "sca-stemi"],
  },
  heparine: {
    links: [{ href: "/calculateurs/heparine", label: { fr: "Protocole héparine IV + APTT", ar: "بروتوكول الهيبارين الوريدي" } }],
    protocols: ["embolie-pulmonaire", "sca-stemi"],
  },
  "insuline-rapide": {
    links: [{ href: "/calculateurs/insuline", label: { fr: "Protocole ACD horaire", ar: "بروتوكول الحماض الكيتوني ساعياً" } }],
    protocols: ["acidocetose-diabetique", "hyperkaliemie"],
  },
  paracetamol: {
    weightDose: { mgPerKg: 15, maxMg: 1000, note: { fr: "Toutes les 6 h — max 4 g/j (moins si hépatique)", ar: "كل 6 ساعات — الحد 4 غ/يوم (أقل عند الكبديين)" } },
    links: [{ href: "/calculateurs/nac", label: { fr: "Protocole NAC trois poches", ar: "بروتوكول المضاد بثلاثة أكياس" } }],
    badges: { renal: { fr: "Précaution hépatique surtout", ar: "الحذر الكبدي أولاً" } },
  },
  morphine: {
    weightDose: { mgPerKg: 0.1, maxMg: 10, decimals: 1, note: { fr: "Titrer IV par paliers, surveiller FR/SpO2", ar: "عاير وريدياً بدفعات وراقب التردد والتشبع" } },
    protocols: ["sca-stemi", "polytraumatisme"],
  },
  ketamine: {
    weightDose: { mgPerKg: 1.5, maxMg: 200, decimals: 0, note: { fr: "Sédation/RSI : 1–2 mg/kg IV", ar: "التخدير/التسلسل السريع: 1-2 ملغ/كغ وريدياً" } },
    protocols: ["agitation-aigue", "polytraumatisme", "asthme-aigu-grave"],
  },
  midazolam: {
    weightDose: { mgPerKg: 0.2, maxMg: 10, decimals: 1, note: { fr: "Convulsions : 0,2 mg/kg IM (max 10)", ar: "الاختلاجات: 0.2 ملغ/كغ عضلياً (الحد 10)" } },
    protocols: ["etat-mal-epileptique", "agitation-aigue"],
  },
  rocuronium: {
    weightDose: { mgPerKg: 1.2, maxMg: 100, decimals: 0, note: { fr: "RSI : 1,2 mg/kg IV", ar: "التسلسل السريع: 1.2 ملغ/كغ وريدياً" } },
  },
  propofol: {
    // 10 mg/mL, one 50 mL vial: 500 mg in 50 mL (no dilution); verify the exact product.
    pump: { unit: "mg/kg/h", doseMin: 0.5, doseMax: 4, doseStep: 0.5, doseStart: 1, defAmpMg: 500, defAmpVol: 50, defCount: 1, defTarget: 50, warnAbove: 4 },
    badges: { pregnancy: { fr: "Éviter en obstétrique", ar: "يُتجنب في التوليد" } },
  },
  "sulfate-magnesium": {
    weightDose: { mgPerKg: 50, maxMg: 2000, decimals: 0, note: { fr: "Asthme sévère/éclampsie : 2 g IV 20 min", ar: "الربو الشديد/الارتعاج: 2 غ وريدياً على 20 دقيقة" } },
    protocols: ["eclampsie", "asthme-aigu-grave", "tachycardie"],
  },
};

import { PERFUSIONS, type PerfusionPreset } from "./perfusions";

/** Build a pump only from a structured, arithmetically concordant preparation. */
export function pumpCfgFromPreset(p: PerfusionPreset): PumpCfg | undefined {
  const prep = p.pumpPreparation;
  if (!prep || prep.convention !== "total") return undefined;

  const isUI = p.unit.startsWith("UI");
  if (isUI !== (prep.amountUnit === "UI")) return undefined;
  const preparedVolume = prep.targetMl;
  if (preparedVolume <= 0) return undefined;

  const perContainer = prep.amountUnit === "g" ? prep.amount * 1000 : prep.amount;
  const computedConc = isUI
    ? (perContainer * prep.count) / preparedVolume
    : (perContainer * prep.count * 1000) / preparedVolume;
  if (!Number.isFinite(computedConc) || computedConc <= 0) return undefined;
  // Concentration source must match the structured preparation and remain within a plausibility range.
  if (Math.abs(computedConc - p.concUgPerMl) > Math.max(0.01, p.concUgPerMl * 0.01)) return undefined;
  if (!isUI && (computedConc / 1000 < 0.01 || computedConc / 1000 > 100)) return undefined;

  return {
    unit: p.unit as PumpUnit,
    doseMin: p.doseMin,
    doseMax: p.doseMax,
    doseStep: p.doseStep,
    doseStart: p.doseStart ?? p.doseMin,
    defAmpMg: perContainer,
    defAmpVol: prep.volumeMl,
    defCount: prep.count,
    defTarget: prep.targetMl,
  };
}

/** Generate only when exactly one preset exists and it carries a validated structured preparation. */
export function pumpCfgFromPerfusion(medId: string): PumpCfg | undefined {
  const matches = PERFUSIONS.filter((preset) => preset.drugId === medId);
  if (matches.length !== 1) return undefined;
  return pumpCfgFromPreset(matches[0]);
}

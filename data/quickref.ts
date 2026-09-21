import type { Localized } from "./types";

// Constantes repères (valeurs usuelles — adapter au contexte clinique)
export interface VitalRow {
  label: Localized;
  adult: string;
  child: string;      // 1–12 ans
  infant: string;     // 1–12 mois
  newborn: string;    // 0–1 mois
}

export const vitalSigns: VitalRow[] = [
  {
    label: { fr: "Fréquence cardiaque (/min)", ar: "النبض (/د)" },
    adult: "60–100",
    child: "80–120",
    infant: "100–160",
    newborn: "110–160",
  },
  {
    label: { fr: "Fréquence respiratoire (/min)", ar: "التنفس (/د)" },
    adult: "12–20",
    child: "20–30",
    infant: "30–50",
    newborn: "40–60",
  },
  {
    label: { fr: "TA systolique (mmHg)", ar: "الضغط الانقباضي" },
    adult: "110–140",
    child: "≈ 90 + (âge × 2)",
    infant: "70–90",
    newborn: "60–90",
  },
  {
    label: { fr: "SpO2 cible (%)", ar: "التشبع المستهدف %" },
    adult: "94–98",
    child: "94–98",
    infant: "94–98",
    newborn: "94–98",
  },
];

export const emergencyNumbers: { service: Localized; number: string; note?: Localized }[] = [
  { service: { fr: "SAMU (urgences médicales)", ar: "الإسعاف الطبي (SAMU)" }, number: "190" },
  { service: { fr: "Protection civile", ar: "الحماية المدنية" }, number: "198" },
  { service: { fr: "Police secours", ar: "شرطة النجدة" }, number: "197" },
  { service: { fr: "Garde nationale", ar: "الحرس الوطني" }, number: "193" },
  {
    service: { fr: "Centre antipoison (Tunis)", ar: "مركز السموم (تونس)" },
    number: "71 335 500",
    note: { fr: "À vérifier localement", ar: "يُتحقق منه محلياً" },
  },
];

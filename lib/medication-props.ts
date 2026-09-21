// v17.2 — تحضير خصائص بطاقة الدواء على الخادم (وقت البناء).
//
// البطاقة كانت تستورد ثلاث قواعد كاملة: الأدوية (73، لإيجاد بديلين)، البروتوكولات
// (~500 كيلوبايت، لربط أسماء)، والتمديدات (30 كيلوبايت، لسطر PSE واحد).
// الآن يصل الجاهز فقط — والقواعد تبقى على الخادم.
//
// Les données croisées d'une fiche médicament sont résolues côté serveur : alternatives,
// préparations PSE et protocoles liés. Le client ne reçoit que ce qui est affiché.
import type { Localized, Medication } from "@/data/types";
import { getMedication } from "@/data/medications";
import { PERFUSIONS } from "@/data/perfusions";
import { protocols } from "@/data/protocols";
import { MED_TOOLS } from "@/data/med-tools";

export interface MedicationDetailProps {
  medication: Medication;
  /** Alternatives thérapeutiques citées par la fiche. */
  alternatives: Medication[];
  /** Préparations PSE existantes pour cette molécule (libellés bilingues). */
  psePreps: Localized[];
  /** Protocoles liés (identifiant + titre bilingue uniquement). */
  linkedProtos: { id: string; title: Localized }[];
}

/** Résout tout ce que la fiche médicament affiche en dehors de sa propre monographie. */
export function medicationDetailProps(medication: Medication): MedicationDetailProps {
  const alternatives = medication.alternatives
    .map((id) => getMedication(id))
    .filter((m): m is Medication => Boolean(m));
  const psePreps = PERFUSIONS.filter((p) => p.drugId === medication.id).map((p) => p.prep);
  const linkedProtos = (MED_TOOLS[medication.id]?.protocols ?? [])
    .map((id) => protocols.find((p) => p.id === id))
    .filter((p): p is (typeof protocols)[number] => Boolean(p))
    .map((p) => ({ id: p.id, title: p.title }));
  return { medication, alternatives, psePreps, linkedProtos };
}

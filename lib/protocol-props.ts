// v17.2 — تحضير خصائص بطاقة البروتوكول على الخادم (وقت البناء).
//
// كانت البطاقة تستورد ثلاث قواعد كاملة قبل أول رسم: قاعدة الأدوية (73 دواءً، ~200 كيلوبايت)،
// الحاسبات (59 كيلوبايت)، وقالب البروتوكولات (~500 كيلوبايت) — فقط لتُرِي مَن أُشير إليه فعلاً
// (دواء أو حاسبتان أو اسم فئة). نُقل الحل إلى الخادم: المكوّن يستقبل الجاهز فقط.
//
// Les données croisées d'une fiche sont résolues CÔTÉ SERVEUR (au build, grâce à
// `output: "export"`) : le client reçoit uniquement les quelques objets cités par la fiche.
// Ce module ne doit jamais être importé par un composant marqué "use client".
import type { CalculatorMeta, Localized, Medication, Protocol } from "@/data/types";
import { protocolCategories } from "@/data/protocol-categories";
import { getMedication } from "@/data/medications";
import { calculators } from "@/data/calculators";

export interface ProtocolDetailProps {
  protocol: Protocol;
  /** Médicaments cités par la fiche (interactions croisées incluses). */
  meds: Medication[];
  /** Calculateurs liés. */
  calcs: CalculatorMeta[];
  /** Libellé de la catégorie de la fiche, résolu à l'avance. */
  categoryLabel: Localized | null;
}

/** Résout tout ce que la fiche affiche en dehors de son propre contenu. */
export function protocolDetailProps(protocol: Protocol): ProtocolDetailProps {
  const meds = protocol.medications
    .map((id) => getMedication(id))
    .filter((m): m is Medication => Boolean(m));
  const calcs = calculators.filter((c) => protocol.calculators.includes(c.id));
  const category = protocolCategories.find((c) => c.id === protocol.category);
  return { protocol, meds, calcs, categoryLabel: category?.label ?? null };
}

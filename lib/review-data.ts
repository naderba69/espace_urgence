// v17.0 — Chargeur paresseux des dates de revue éditoriale.
//
// ⚠️ Module lourd (importe protocoles + médicaments + calculateurs, ~900 Ko de JS brut).
// Il n'est JAMAIS importé statiquement : components/ReviewAlert.tsx le réclame via
// import() dynamique pendant un temps d'inactivité du navigateur. L'alerte « fiches à
// revoir » est un rappel de maintenance : elle n'a pas à peser sur le premier rendu.
//
// لا يُستورد هذا الملف إلا ديناميكيًا: تنبيه المراجعة تحسيني ولا يجب أن يثقل أول رسم.
import { protocols } from "@/data/protocols";
import { medications } from "@/data/medications";
import { calculators } from "@/data/calculators";
import { reviewDueCount } from "./calc";

/** Nombre de contenus dont la revue est due (≥ 11 mois) à la date courante. */
export function computeReviewDue(now = new Date()): number {
  return reviewDueCount(
    [
      ...protocols.map((p) => p.meta.lastReviewed),
      ...medications.map((m) => m.meta.lastReviewed),
      ...calculators.map((c) => c.meta?.lastReviewed ?? "1970-01"),
    ],
    now
  );
}

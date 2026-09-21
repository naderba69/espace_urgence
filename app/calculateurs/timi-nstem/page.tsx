"use client";
// v8.0 — Score TIMI pour SCA sans sus-décalage ST : risque d'événements à 14 jours.
import ScoreCalc from "@/components/tools/ScoreCalc";

export default function TimiNstemPage() {
  return (
    <ScoreCalc
      calcId="timi-nstem"
      title={{ fr: "TIMI NSTEMI — risque à 14 jours", ar: "TIMI NSTEMI — خطر 14 يوماً" }}
      items={[
        { id: "age", pts: 1, fr: "Âge ≥ 65 ans", ar: "العمر ≥ 65" },
        { id: "fdr", pts: 1, fr: "≥ 3 facteurs de risque coronariens", ar: "≥ 3 عوامل خطر تاجية" },
        { id: "coro", pts: 1, fr: "Sténose coronaire connue ≥ 50 %", ar: "تضيق تاجي معروف ≥ 50%" },
        { id: "aspirine", pts: 1, fr: "Aspirine dans les 7 derniers jours", ar: "أسبرين خلال 7 أيام" },
        { id: "angor", pts: 1, fr: "≥ 2 épisodes d'angor en 24 h", ar: "≥ 2 نوبة ذبحة خلال 24 س" },
        { id: "st", pts: 1, fr: "Décalage ST ≥ 0,5 mm", ar: "انزياح ST ≥ 0.5 مم" },
        { id: "troponine", pts: 1, fr: "Marqueurs cardiaques élevés", ar: "واسمات قلبية مرتفعة" },
      ]}
      bands={[
        { min: 0, cls: "bg-blue-600", fr: "Risque faible (0-2): ~5 % d'événements à 14 j — stratégie invasive différée possible", ar: "خطر منخفض (0-2): ~5% أحداث خلال 14 يوماً — يمكن إرجاء التداخل" },
        { min: 3, cls: "bg-amber-500", fr: "Risque intermédiaire (3-4): ~13-20 % — coronarographie précoce", ar: "خطر متوسط (3-4): ~13-20% — قسطرة مبكرة" },
        { min: 5, cls: "bg-red-600", fr: "Risque élevé (5-7): ~26-41 % — stratégie invasive précoce en centre de cardiologie interventionnelle", ar: "خطر عالٍ (5-7): ~26-41% — تداخل باكر بمركز قسطرة" },
      ]}
      note={{ fr: "Complète le protocole SCA NSTEMI — ne remplace pas le jugement clinique (instabilité = coronarographie en urgence quel que soit le score).", ar: "يكمل بروتوكول NSTEMI — لا يغني عن التقدير السريري (عدم الاستقرار = قسطرة طارئة مهما كان السكور)." }}
    />
  );
}

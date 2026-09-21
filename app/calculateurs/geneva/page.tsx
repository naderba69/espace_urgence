"use client";
// v7.9 — Score de Genève révisé (probabilité clinique d'EP, 100 % clinique).
import ScoreCalc from "@/components/tools/ScoreCalc";

export default function GenevaPage() {
  return (
    <ScoreCalc
      calcId="geneva"
      title={{ fr: "Genève révisé — probabilité d'EP", ar: "جنيف المعدّل — احتمال الصمة" }}
      items={[
        { id: "age", pts: 1, fr: "Âge > 65 ans", ar: "العمر > 65" },
        { id: "atcd", pts: 3, fr: "Antécédent de TVP ou EP", ar: "قصة خثار أو صمة" },
        { id: "chir", pts: 2, fr: "Chirurgie (AG) ou fracture du membre inférieur < 1 mois", ar: "جراحة (تخدير عام) أو كسر طرف سفلي < شهر" },
        { id: "cancer", pts: 2, fr: "Cancer actif", ar: "سرطان نشط" },
        { id: "douleurMI", pts: 3, fr: "Douleur unilatérale du membre inférieur", ar: "ألم وحيد الجانب بالطرف السفلي" },
        { id: "hemo", pts: 2, fr: "Hémoptysie", ar: "نفث دم" },
        { id: "fc1", pts: 3, fr: "FC 75-94 /min", ar: "نبض 75-94/د" },
        { id: "fc2", pts: 5, fr: "FC 95-110 /min", ar: "نبض 95-110/د" },
        { id: "fc3", pts: 10, fr: "FC ≥ 111 /min", ar: "نبض ≥ 111/د" },
        { id: "palp", pts: 4, fr: "Douleur à la palpation veineuse profonde + œdème unilatéral", ar: "ألم بجس الأوردة العميقة + وذمة وحيدة" },
      ]}
      bands={[
        { min: 0, cls: "bg-blue-600", fr: "Faible (0-3): risque EP ≈ 10 % — D-dimères pour exclure", ar: "منخفض (0-3): خطر ≈ 10% — D-dimer للاستبعاد" },
        { min: 4, cls: "bg-amber-500", fr: "Intermédiaire (4-10): risque ≈ 30 % — angio-TDM ou D-dimères très sensibles", ar: "متوسط (4-10): ≈ 30% — تصوير وعائي أو D-dimer فائق الحساسية" },
        { min: 11, cls: "bg-red-600", fr: "Élevé (≥ 11): risque ≈ 45 % — angio-TDM directe", ar: "عالٍ (≥ 11): ≈ 45% — تصوير وعائي مباشر" },
      ]}
      note={{ fr: "100 % clinique (pas de jugement subjectif, contrairement à Wells). Ne coche qu'une seule ligne de FC.", ar: "سريري 100% (بلا تقدير شخصي عكس ويلز). علّم خانة نبض واحدة فقط." }}
    />
  );
}

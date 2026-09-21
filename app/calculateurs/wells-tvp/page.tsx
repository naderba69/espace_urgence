"use client";
// v8.0 — Score de Wells TVP : probabilité clinique de thrombose veineuse profonde.
import ScoreCalc from "@/components/tools/ScoreCalc";

export default function WellsTvpPage() {
  return (
    <ScoreCalc
      calcId="wells-tvp"
      title={{ fr: "Wells TVP — probabilité de thrombose veineuse profonde", ar: "ويلز TVP — احتمال الخثار الوريدي العميق" }}
      items={[
        { id: "cancer", pts: 1, fr: "Cancer actif (traitement < 6 mois ou palliatif)", ar: "سرطان نشط (علاج < 6 أشهر أو تلطيفي)" },
        { id: "paralysie", pts: 1, fr: "Paralysie/immobilisation plâtrée du membre", ar: "شلل/تثبيت بالجبس للطرف" },
        { id: "alitement", pts: 1, fr: "Alitement > 3 j ou chirurgie majeure < 12 semaines", ar: "فراش > 3 أيام أو جراحة كبرى < 12 أسبوعاً" },
        { id: "douleur", pts: 1, fr: "Douleur sur le trajet veineux profond", ar: "ألم على مسار الوريد العميق" },
        { id: "oedeme", pts: 1, fr: "Œdème de tout le membre", ar: "وذمة كامل الطرف" },
        { id: "mollet", pts: 1, fr: "Œdème du mollet > 3 cm vs côté opposé", ar: "وذمة ساق > 3 سم مقابل الجهة الأخرى" },
        { id: "prise", pts: 1, fr: "Œdème prenant le godet", ar: "وذمة منطبعة (نقرة)" },
        { id: "collaterales", pts: 1, fr: "Circulation collatérale superficielle (non variqueuse)", ar: "دوران جانبي سطحي (غير دوالي)" },
        { id: "autre", pts: -2, fr: "Diagnostic alternatif au moins aussi probable", ar: "تشخيص بديل بنفس الاحتمال على الأقل" },
      ]}
      bands={[
        { min: -4, cls: "bg-blue-600", fr: "Probabilité faible (≤ 0): D-dimères — si négatifs, TVP exclue sans imagerie", ar: "احتمال منخفض (≤ 0): ‏D-dimer — إن سلبياً تُستبعد TVP دون تصوير" },
        { min: 1, cls: "bg-amber-500", fr: "Probabilité intermédiaire (1-2): D-dimères + écho-Doppler selon résultat", ar: "احتمال متوسط (1-2): ‏D-dimer + إيكو دوبلر حسب النتيجة" },
        { min: 3, cls: "bg-red-600", fr: "Probabilité élevée (≥ 3): écho-Doppler veineux d'emblée — anticoaguler si positif (ou forte suspicion + délai d'imagerie)", ar: "احتمال عالٍ (≥ 3): إيكو دوبلر وريدي مباشرة — مضاد تخثر إن إيجابي (أو اشتباه قوي مع تأخر تصوير)" },
      ]}
      note={{ fr: "Le critère « diagnostic alternatif » retire 2 points. En cas de doute, l'écho-Doppler tranche.", ar: "معيار «التشخيص البديل» يخصم نقطتين. عند الشك، الإيكو دوبلر يفصل." }}
    />
  );
}

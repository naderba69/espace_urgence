"use client";
// v7.9 — Règle PERC : exclure l'EP SANS D-dimères chez le patient à faible probabilité.
import ScoreCalc from "@/components/tools/ScoreCalc";

export default function PercPage() {
  return (
    <ScoreCalc
      calcId="perc"
      title={{ fr: "PERC — exclure l'embolie pulmonaire", ar: "PERC — استبعاد الصمة الرئوية" }}
      items={[
        { id: "age", pts: 1, fr: "Âge ≥ 50 ans", ar: "العمر ≥ 50" },
        { id: "fc", pts: 1, fr: "FC ≥ 100 /min", ar: "نبض ≥ 100/د" },
        { id: "spo2", pts: 1, fr: "SpO₂ < 95 %", ar: "SpO₂ < 95%" },
        { id: "hemo", pts: 1, fr: "Hémoptysie", ar: "نفث دم" },
        { id: "oestro", pts: 1, fr: "Œstrogènes (pilule/THS)", ar: "إستروجين (حبوب/هرمونات)" },
        { id: "atcd", pts: 1, fr: "Antécédent TVP/EP", ar: "قصة خثار/صمة" },
        { id: "oedeme", pts: 1, fr: "Œdème unilatéral du mollet", ar: "ورم ساق وحيد الجانب" },
        { id: "chir", pts: 1, fr: "Chirurgie/trauma avec hospitalisation < 4 semaines", ar: "جراحة/رض بإدخال < 4 أسابيع" },
      ]}
      bands={[
        { min: 0, cls: "bg-blue-600", fr: "PERC 0 (si probabilité pré-test faible): EP exclue SANS D-dimères", ar: "PERC صفر (مع احتمال قبلي منخفض): تُستبعد الصمة دون D-dimer" },
        { min: 1, cls: "bg-amber-500", fr: "PERC ≥ 1: D-dimères indiqués — si positifs, angio-TDM", ar: "PERC ≥ 1: D-dimer مطلوب — إن إيجابياً فالتصوير الوعائي" },
      ]}
      note={{ fr: "Valide uniquement si la probabilité pré-test est faible (clinique + Wells ≤ 4).", ar: "صالح فقط إذا كان الاحتمال القبلي منخفضاً (سريري + ويلز ≤ 4)." }}
    />
  );
}

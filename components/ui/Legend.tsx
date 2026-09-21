"use client";
// v14.1 — توضيح الاختصارات : قاموس قابل للطي أسفل كل الأقسام، ملفوف آمناً داخل الشاشة.
import { useApp } from "@/components/Providers";
import T from "@/components/T";

const LEGEND: { a: string; fr: string; ar: string }[] = [
  { a: "AVPU", fr: "Échelle de conscience : A = Alerte (éveillé) ; V = répond à la Voix ; P = répond à la Douleur ; U = Unresponsive (aucune réponse).", ar: "مقياس الوعي: A يقظ؛ V يستجيب للصوت؛ P يستجيب للألم؛ U لا يستجيب إطلاقاً." },
  { a: "GCS", fr: "Glasgow Coma Scale (3-15) : yeux + verbal + moteur ; ≤ 8 = intubation.", ar: "مقياس غلاسكو للغيبوبة (٣-١٥): عين + كلام + حركة؛ ≤ ٨ = تنبيب." },
  { a: "MEWS", fr: "Modified Early Warning Score : score d'alerte précoce (FC, PA, FR, T°, conscience).", ar: "مؤشر الإنذار المبكر: نبض، ضغط، تنفس، حرارة، وعي." },
  { a: "qSOFA", fr: "quick SOFA : FR ≥ 22, altération conscience, PAS ≤ 100 → suspicion d'infection grave.", ar: "كو-سوفا: تنفس ≥ ٢٢، وعي متأثر، انقباضي ≤ ١٠٠ ← اشتباه عدوى شديدة." },
  { a: "SpO2", fr: "Saturation pulsée en oxygène (%).", ar: "نسبة تشبع الأكسجين النبضي (٪)." },
  { a: "EtCO2", fr: "CO2 de fin d\u2019expiration (capnographie) ; < 10 mmHg = RCP inefficace.", ar: "ثاني أكسيد الكربون نهاية الزفير (الكابنوغرافيا)؛ < ١٠ ملم زئبق = إنعاش غير فعال." },
  { a: "LASA", fr: "Look-Alike / Sound-Alike : médicaments qui se ressemblent (erreur de confusion).", ar: "أدوية متشابهة في الشكل أو النطق (خطر الخلط)." },
  { a: "NOAC / DOAC", fr: "Anticoagulant oral direct (apixaban, rivaroxaban, dabigatran, edoxaban).", ar: "مضاد تخثر فموي مباشر (أبيكسابان، ريفاروكسابان، دابيغاتران، إيدوكسابان)." },
  { a: "AVK", fr: "Antivitamine K (warfarine, acénocoumarol).", ar: "مضاد فيتامين K (وارفارين، أسينوكومارول)." },
  { a: "HNF / HBPM", fr: "Héparine non fractionnée / héparine de bas poids moléculaire.", ar: "هيبارين غير مجزأ / هيبارين منخفض الوزن الجزيئي." },
  { a: "CrCl", fr: "Clairance de la créatinine (Cockcroft-Gault), en mL/min.", ar: "تصفية الكرياتينين (Cockcroft-Gault) بمل/د." },
  { a: "mg ÉP", fr: "Milligrammes équivalents phénytoïne (dosage du fos-phénytoïne).", ar: "مغ مكافئ فينيتوين (قياس الفوسفينيتوين)." },
  { a: "q12h / q24h", fr: "Toutes les 12 h / toutes les 24 h.", ar: "كل ١٢ ساعة / كل ٢٤ ساعة." },
  { a: "PAS / PAD / PAM", fr: "Pression artérielle systolique / diastolique / moyenne.", ar: "الضغط الانقباضي / الانبساطي / المتوسط." },
  { a: "FC / FR", fr: "Fréquence cardiaque / fréquence respiratoire.", ar: "تفتّف القلب / تفتّف التنفس." },
  { a: "TAS", fr: "Tension artérielle systolique (mmHg).", ar: "الضغط الشرياني الانقباضي (ملم زئبق)." },
  { a: "INR", fr: "International Normalized Ratio (surveillance des AVK).", ar: "نسبة مضطربة معيارية (مراقبة مضادات فيتامين K)." },
  { a: "TSH / FT4", fr: "Thyréostimuline / thyroxine libre.", ar: "الهرمون المنبه للدرقية / الثيروكسين الحر." },
  { a: "CPK", fr: "Créatine phosphokinase (rythmolyse, syndrome malin).", ar: "كرياتين فوسفوكيناز (تحلل العضلات، المتلازمة الخبيثة)." },
  { a: "P/F", fr: "Rapport PaO2/FiO2 (gravité du SDRA, Berlin).", ar: "نسبة PaO2/FiO2 (خطرامة الضائقة التنفسية، برلين)." },
  { a: "A-a", fr: "Gradient alvéolo-artériel en O2.", ar: "التدرج السنخي-الشرياني للأكسجين." },
  { a: "ROX", fr: "Index (SpO2/FiO2)/FC : succès de l'oxygène haut débit.", ar: "مؤشر نجاح الأكسجين عالي التدفق." },
  { a: "MUAC", fr: "Périmètre brachial (dénutrition de l'enfant).", ar: "محيط العضد (سوء تغذية الطفل)." },
  { a: "ECBU / DIP", fr: "Examen cyto-bactériologique des urines / bandelette urinaire.", ar: "فحص البول الخلوي البكتيري / شريط البول." },
  { a: "NFS", fr: "Numération formule sanguine.", ar: "تعداد الدم الكامل مع الصيغة." },
  { a: "ALAT / ASAT / PAL", fr: "Transaminases et phosphatases alcalines (foie).", ar: "ناقلات الأمين وفسفاتاز قلوي (الكبد)." },
  { a: "ISTH", fr: "Score de gravité de la coagulation intravasculaire disséminée.", ar: "معيار شدة التخثر المنتثر داخل الأوعية." },
  { a: "FAST / RUSH", fr: "Échographie de l'abdomen en urgence / protocole de choc échographique.", ar: "تصوير بالصدى للبطن في المستعجل / بروتوكول الصدمة بالصدى." },
  { a: "RSI / IOT", fr: "Séquence d'intubation rapide / intubation orotrachéale.", ar: "التسلسل السريع للتنبيب / التنبيب الفموي الرغامي." },
  { a: "DKA / OAP / BAV / MTEV", fr: "Cétose diabétique / œdème aigu du poumon / bloc atrio-ventriculaire / maladie thrombo-embolique.", ar: "الحماض الكيتوني السكري / وذمة رئة حادة / إحصار أذيني بطيني / خثار وريدي." },
  { a: "SCA / SNC / SDRA", fr: "Syndrome coronarien aigu / système nerveux central / syndrome de détresse respiratoire aiguë.", ar: "المتلازمة التاجية الحادة / الجهاز العصبي المركزي / متلازمة الضائقة التنفسية الحادة." },
  { a: "IM / IV / SC / SL", fr: "Voies intramusculaire, intraveineuse, sous-cutanée, sublinguale.", ar: "المسارات: عضلي، وريدي، تحت الجلد، تحت اللسان." },
  { a: "VVP", fr: "Voie veineuse périphérique.", ar: "المسار الوريدي المحيطي." },
  { a: "K+ / Na+ / Mg2+ / Ca2+", fr: "Ionogramme : potassium, sodium, magnésium, calcium.", ar: "الشوارد: البوتاسيوم، الصوديوم، المغنيزيوم، الكالسيوم." },
];

export default function Legend() {
  const { lang } = useApp();
  return (
    <details className="eutn-legend card rounded-2xl border border-line bg-surface text-sm">
      <summary className="cursor-pointer select-none p-4 text-sm font-black" style={{ color: "var(--accent)" }}>
        <T fr="Légende des abréviations" ar="توضيح الاختصارات" />
      </summary>
      <dl className="grid gap-x-4 gap-y-3 p-4 pt-0 sm:grid-cols-2">
        {LEGEND.filter((x) => x.fr).map((x) => (
          <div key={x.a} className="flex min-w-0 flex-col ps-2" style={{ borderInlineStart: "3px solid var(--accent-soft)" }}>
            <dt className="text-xs font-black" style={{ color: "var(--accent)" }} dir="ltr">{x.a}</dt>
            <dd className="break-words text-xs font-bold leading-5 opacity-80">{lang === "ar" ? x.ar : x.fr}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

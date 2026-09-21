import type { Medication } from "./types";

// v8.1 — Phase 8 : antibiothérapie de première ligne (amoxicilline, azithromycine).
// Sources : SPILF/ATS-IDSA pneumonie, ESCMID, livret antibiothérapie tunisien.
export const medicationsPhase8: Medication[] = [
  {
    id: "amoxicilline",
    name: { fr: "Amoxicilline", ar: "أموكسيسيلين" },
    brands: "Clamoxyl® 500 mg/1 g cp ; 1 g/5 mL inj ; sirop 125-250 mg/5 mL ; Amoxil®",
    synonyms: ["amoxicilline", "clamoxyl", "amoxil", "aminopénicilline", "أموكسيسيلين"],
    klass: { fr: "Antibiotique — aminopénicilline (bêta-lactamine)", ar: "مضاد حيوي — أمينوبنسلين (بيتا-لاكتام)" },
    highRisk: false,
    indications: {
      fr: "Pneumonie aiguë communautaire (1re intention), infections ORL (otite, sinusite, angine documentée), infections dentaires, morsures (avec acide clavulanique), prophylaxie endocardite.",
      ar: "التهاب رئة مكتسب (الخيار الأول)، إنتانات الأذن والجيوب والبلعوم الموثقة، إنتانات سنية، عضات (مع حمض الكلافولانيك)، وقاية شغاف.",
    },
    doseAdult: {
      fr: "PO : 1 g × 3/j (pneumonie). IV : 1-2 g/8 h (formes graves). Prophylaxie endocardite : 2 g PO 30-60 min avant le geste.",
      ar: "فموياً: 1 غ ×3/ي (التهاب رئة). وريدياً: 1-2 غ/8 س (الشديد). وقاية الشغاف: 2 غ فموياً 30-60 د قبل الإجراء.",
    },
    dosePediatric: {
      fr: "50-100 mg/kg/j en 3 prises (pneumonie/otite : viser 80-90 mg/kg/j) ; max 3 g/j.",
      ar: "‏50-100 ملغ/كغ/ي على 3 دفعات (رئة/أذن: نحو 80-90 ملغ/كغ/ي)؛ أقصى 3 غ/ي.",
    },
    dilution: {
      fr: "Forme IV : reconstituer puis injecter en 3-5 min ou perfusion 30 min dans NaCl 0,9 % (PAS de G5 % : dégradation). Stabilité courte après reconstitution.",
      ar: "الوريدي: حل ثم حقن 3-5 د أو تسريب 30 د بمحلول ملحي (لا غلوكوز: يتحلل). الثبات قصير بعد الحل.",
    },
    contraindications: {
      fr: "Allergie aux pénicillines (réaction immédiate), mononucléose infectieuse (rash), antécédent d'atteinte hépatique amoxicilline-clavulanate.",
      ar: "حساسية بنسلين (تفاعل فوري)، كثرة وحيدات إنتانية (طفح)، قصة إصابة كبدية من أموكسي-كلاف.",
    },
    sideEffects: {
      fr: "Diarrhée, rash (distinguer allergie vraie), candidose, exceptionnellement anaphylaxie, cytopenies (cures longues).",
      ar: "إسهال، طفح (ميّزه عن الحساسية الحقيقية)، кандиادا، نادراً تأق، نقص خلايا (العلاج الطويل).",
    },
    nursing: {
      fr: "Interroger systématiquement sur l'allergie aux pénicillines AVANT la 1re dose. Surveiller le rash des 48 premières heures.",
      ar: "اسأل منهجياً عن حساسية البنسلين قبل الجرعة الأولى. راقب الطفح بأول 48 ساعة.",
    },
    storage: { fr: "T° ambiante à l'abri de l'humidité ; suspension reconstituée au froid 7 j.", ar: "حرارة الغرفة بعيداً عن الرطوبة؛ المعلق المحلول بالثلاجة 7 أيام." },
    alternatives: ["azithromycine", "cefotaxime"],
    weightDose: { mgPerKg: 0, maxMg: 0, note: { fr: "Posologie par tranche — voir doses.", ar: "جرع مجزأة — انظر الجرع." } },
    meta: { sources: ["SPILF", "ATS-IDSA 2019", "Livret ATB Tunisie"], lastReviewed: "2026-09" },
  },
  {
    id: "azithromycine",
    name: { fr: "Azithromycine", ar: "أزيثروميسين" },
    brands: "Zithrolox® 500 mg cp / 200 mg poudre ; Azadose® ; Zitrolide®",
    synonyms: ["azithromycine", "zithrolox", "zithromax", "macrolide", "أزيثروميسين"],
    klass: { fr: "Antibiotique — macrolide (couverture des germes atypiques)", ar: "مضاد حيوي — ماكروليد (يغطي الجراثيم اللانمطية)" },
    highRisk: false,
    indications: {
      fr: "Pneumonie communautaire en association (couverture Mycoplasma/Chlamydia/Legionella) ou en monothérapie si allergie aux bêta-lactamines ; coqueluche ; infections ORL/bronchiques.",
      ar: "التهاب رئة مكتسب ضمن مشاركة (تغطية المفطورة/المتدثرة/الفيلقية) أو وحده عند حساسية بيتا-لاكتام؛ سعال ديكي؛ إنتانات أذن/قصبات.",
    },
    doseAdult: {
      fr: "500 mg/j en 1 prise × 3 jours (PO ou IV) — longue demi-vie, pas de relais prolongé nécessaire.",
      ar: "‏500 ملغ/ي بجرعة واحدة × 3 أيام (فموياً أو وريدياً) — نصف عمر طويل، لا حاجة لإطالة.",
    },
    dosePediatric: {
      fr: "10-20 mg/kg/j en 1 prise × 3 jours (max 500 mg/j).",
      ar: "‏10-20 ملغ/كغ/ي بجرعة واحدة × 3 أيام (أقصى 500 ملغ/ي).",
    },
    dilution: {
      fr: "IV : 500 mg dans 250-500 mL NaCl 0,9 % ou G5 % en 60 min minimum (jamais en bolus — phlébite). PO : à distance des repas.",
      ar: "وريدياً: 500 ملغ في 250-500 مل محلول/غلوكوز خلال 60 د على الأقل (أبداً دفعة — التهاب وريد). فموياً: بعيداً عن الوجبات.",
    },
    contraindications: {
      fr: "Allergie aux macrolides, QT long connu, association aux antiarythmiques (cisapride, quinidine) — prudence avec amiodarone/sotalol (risque torsades).",
      ar: "حساسية ماكروليد، QT طويل معروف، مشاركة مع مضادات نظم (سيسابريد، كينيدين) — حذر مع أميودارون/سوتالول (التواء ذروة).",
    },
    sideEffects: {
      fr: "Troubles digestifs fréquents, allongement du QT (torsades rares), hépatite cholestatique, ototoxicité (cures longues).",
      ar: "اضطرابات هضمية شائعة، إطالة QT (التواء نادر)، التهاب كبد ركودي، سمية أذنية (العلاج الطويل).",
    },
    nursing: {
      fr: "ECG (QT) avant traitement chez le cardiaque ou sous antiarythmique. Perfuser lentement. Interactions CYP : warfarine, digoxine.",
      ar: "تخطيط (QT) قبل العلاج لمريض قلب أو على مضاد نظم. سرّب ببطء. تداخلات: وارفارين، ديجوكسين.",
    },
    storage: { fr: "T° ambiante.", ar: "حرارة الغرفة." },
    alternatives: ["amoxicilline", "cefotaxime"],
    interactions: [
      { drug: "Amiodarone et sotalol", severity: "high", description: { fr: "Cumul d'allongement du QT — risque de torsades de pointe. ECG de contrôle, corriger K⁺/Mg²⁺.", ar: "تراكم إطالة QT — خطر التواء ذروة. تخطيط مراقب وصحح البوتاسيوم/المغنزيوم." } },
      { drug: "Warfarine (antivitamines K)", severity: "moderate", description: { fr: "Potentialisation de l'effet anticoagulant — surveiller l'INR.", ar: "تعزيز تأثير مضاد التخثر — راقب INR." } },
    ],
    meta: { sources: ["ATS-IDSA 2019", "Résumé des caractéristiques produit"], lastReviewed: "2026-09" },
  },
];

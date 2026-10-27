import type { Medication } from "./types";

// v8.1 — Phase 8 : antibiothérapie de première ligne (amoxicilline, azithromycine).
// Sources : SPILF/ATS-IDSA pneumonie, ESCMID, livret antibiothérapie tunisien.
export const medicationsPhase8: Medication[] = [
  {
    id: "amoxicilline",
    name: { fr: "Amoxicilline", ar: "أموكسيسيلين" },
    brands: "GALAMOX® (GALPHARMA) 250/500 mg/5 mL suspensions orales (fl. 60 mL), 500 mg gélules B/12, 500 mg comprimés dispersibles B/12 et B/24, 1 g comprimés dispersibles B/14 (AMM DPM 9223661/9223662/9223665/9223664/9223663/9223666) ; Clamoxyl® (ADWYA) 500 mg gélule, suspensions 125/250/500 mg (fl. 60 mL), cp dispersibles 500 mg/1 g ; SAIFOXYL® (SAIPH) formes orales 125/250/500 mg/5 mL suspensions, gélules 250/500 mg, comprimés 500 mg/1 g et comprimés dispersibles 500 mg/1 g (AMM DPM listées dans le rapport) ; Amoxil® IM/IV (UNIMED) 0,5/1 g ; AMOXAL® (MEDICEF) 250 mg susp. (fl. 100 mL), cp dispersibles 500 mg/1 g ; Amoxicilline Sanofi® 250/500 mg/5 mL susp., 500 mg gélule, 1 g dispersible ; NOVAMOX® (ADWYA) 250 mg/5 mL suspension FL/60 mL, 500 mg/5 mL suspension FL/60 mL, 500 mg gélule B/12, comprimés dispersibles 500 mg B/12 et B/24, 1 g comprimé dispersible B/12 (AMM DPM 9043971–9043976) ; PENAMOX® (MEDICEF) 250 mg poudre pour suspension orale FL/100 mL, 500 mg capsules B/24 et B/400, 1 g comprimé pelliculé sécable B/12, 500 mg granulés pour suspension FL/100 mL (AMM DPM 9183024/9183026/9183028/9183029/91830210H)",
    synonyms: ["amoxicilline", "clamoxyl", "amoxil", "novamox", "penamox", "aminopénicilline", "أموكسيسيلين"],
    searchExclusions: ["vaamox", "amoclan", "amoxi plus", "amoxi-clav", "amoxi clav", "amoxiclav", "augmentin", "ciblor", "clavumox", "mediclav", "novaclav", "clavulanique", "clavulanate", "biclavor", "clavepen", "clavor"],
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
      ar: "إسهال، طفح (ميّزه عن الحساسية الحقيقية)، داء المبيضات، نادراً تأق، نقص خلايا (العلاج الطويل).",
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
    brands: "Zithrolox® 500 mg cp / 200 mg poudre ; AZACINE® 500 mg cp sécable (B/3; DAR-ESSAYDALI) ; Azadose® ; Zitrolide® ; ZOMAX® (IBN AL BAYTAR) 250 mg gélule B/6, 500 mg cp B/3, suspensions 600 mg/15 mL, 900 mg/22.5 mL et 1500 mg/37.5 mL (AMM DPM 9073421–9073425) ; ZITROCIN® 500 mg cp B/3 et suspension 600 mg/15 mL (9253411/9253412) ; ZITHROMAX® 500 mg cp B/3 et poudre 1500 mg/37.5 mL (9243053/6043171) ; ZITHROMAX UNO® 500 mg cp B/2 (9243054) ; ZITROMAX 600 mg/15 mL et 900 mg/22.5 mL (8013021/8013022) ; ZITHROCARE® 500 mg cp B/3 (9343191) ; ZITRO® 500 mg cp B/3 (9234021) ; AZITHROCINE® (SIPHAT) 250 mg gélule B/6 (AMM 9003781) ; AZITRAL® (ACT PHARMA) 500 mg cp B/3 (9363071) ; AZITROMIN DUO® 500 mg cp B/2 (WEST PHARMA, 9293291) et AZITROMIN TRIO® 500 mg cp B/3 (9293292) ; AZIX® (PHARMAGHREB) cp 500 mg B/3 (9013601), suspensions 40 mg/mL : 15 mL (9013602), 22.5 mL (9013603), 30 mL (9013604), 37.5 mL (9013605) ; AZOMYCINE® (PIERRE FABRE) 500 mg cp B/3 (9323221) ; AZRO® (TERIAK) 500 mg cp B/3 (9253221) et suspensions 40 mg/mL : 15 mL (9253222), 22.5 mL (9253223), 37.5 mL (9253224)",
    synonyms: ["azithromycine", "zithrolox", "zithromax", "zitromax", "zomax", "zitrocin", "zithrocare", "zitro", "macrolide", "أزيثروميسين"],
    searchExclusions: ["azyter", "collyre", "ophtalmique"],
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

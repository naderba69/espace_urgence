import type { Medication } from "./types";

// v8.2 — Phase 9 : anti-infectieux de réanimation (pipé-tazo, vancomycine, clindamycine),
// neuro-vasculaire (nimodipine), ophtalmo/neuro (acétazolamide, mannitol).
export const medicationsPhase9: Medication[] = [
  {
    id: "piperacilline-tazobactam",
    name: { fr: "Pipéracilline-tazobactam", ar: "بيبيراسيلين-تازوباكتام" },
    brands: "Tazocilline® 4 g/0,5 g inj",
    synonyms: ["piperacilline", "tazobactam", "tazocilline", "pipé-tazo", "بيبيراسيلين"],
    klass: { fr: "Antibiotique — uréidopénicilline + inhibiteur de bêta-lactamase (large spectre dont Pseudomonas)", ar: "مضاد حيوي — يوريدوبنسلين + مثبط بيتا-لاكتاماز (واسع الطيف يشمل الزائفة)" },
    highRisk: false,
    indications: {
      fr: "Fièvre du neutropénique (1re ligne), infections nosocomiales, sepsis à point de départ digestif/urinaire/respiratoire, péritonites, infections du pied diabétique, fasciite nécrosante (avec clindamycine).",
      ar: "حمى ناقص المحببات (الخط الأول)، إنتانات المستشفيات، إنتان بهضمي/بولي/تنفسي، التهاب بريتوان، قدم سكري، التهاب لفافة ناخر (مع كليندامايسين).",
    },
    doseAdult: {
      fr: "4 g/0,5 g IV/6 h en perfusion prolongée (3 h) — optimise le temps au-dessus de la CMI. Sepsis grave : dose de charge 4 g.",
      ar: "‏4 غ/0.5 غ وريدي/6 س بتسريب ممدد (3 س) — يحسن الزمن فوق CMI. إنتان شديد: جرعة تحميل 4 غ.",
    },
    dosePediatric: {
      fr: "≥ 2 mois : 80-100 mg/kg/dose (composant pipéracilline)/6-8 h, max 4 g/dose ; fièvre neutropénique : 100 mg/kg/6 h.",
      ar: "‏≥ شهرين: 80-100 ملغ/كغ/جرعة (مكون البيبيراسيلين)/6-8 س، أقصى 4 غ/جرعة؛ حمى المحببات: 100 ملغ/كغ/6 س.",
    },
    dilution: {
      fr: "Reconstituer avec 10-20 mL de NaCl 0,9 % puis diluer dans 50-100 mL ; perfusion 30 min à 3 h. Incompatible au bicarbonate et au Ringer lactate.",
      ar: "حل بـ 10-20 مل محلول ملحي ثم تمديد بـ 50-100 مل؛ تسريب 30 د حتى 3 س. غير متوافق مع البيكربونات ورينغر لاكتات.",
    },
    contraindications: {
      fr: "Allergie aux pénicillines (réaction immédiate). Prudence : allergie céphalosporines sévère.",
      ar: "حساسية بنسلين (تفاعل فوري). حذر: حساسية سيفالوسبورين شديدة.",
    },
    sideEffects: {
      fr: "Diarrhée (C. difficile), rash, cytopenies (cures longues), hépatite, néphrotoxicité majorée avec vancomycine, hypokaliémie (charges sodées).",
      ar: "إسهال (مطثية عسيرة)، طفح، نقص خلايا (العلاج الطويل)، التهاب كبد، سمية كلوية تزداد مع فانكومايسين، نقص بوتاسيوم (أحمال صوديوم).",
    },
    nursing: {
      fr: "Perfusion prolongée via pompe — surveiller la diurèse et la créatinine si association à la vancomycine.",
      ar: "تسريب ممدد بمضخة — راقب الإدرار والكرياتينين عند المشاركة مع فانكومايسين.",
    },
    storage: { fr: "T° ambiante avant reconstitution ; solution reconstituée stable 24 h à T° ambiante.", ar: "حرارة الغرفة قبل الحل؛ المحلول مستقر 24 س بحرارة الغرفة." },
    alternatives: ["cefotaxime", "amikacine"],
    weightDose: { mgPerKg: 0, maxMg: 0, note: { fr: "Posologie par tranche — voir doses.", ar: "جرع مجزأة — انظر الجرع." } },
    meta: { sources: ["IDSA 2010", "SPILF", "Résumé des caractéristiques produit"], lastReviewed: "2026-09" },
  },
  {
    id: "vancomycine",
    name: { fr: "Vancomycine", ar: "فانكومايسين" },
    brands: "Vancocine® 500 mg inj",
    synonyms: ["vancomycine", "vancocine", "glycopeptide", "فانكومايسين"],
    klass: { fr: "Antibiotique — glycopeptide (Gram positif : SARM, streptocoques, entérocoques)", ar: "مضاد حيوي — غليكوببتيد (إيجابية الغرام: MRSA، عقديات، معويات)" },
    highRisk: true,
    indications: {
      fr: "SARM documenté ou suspecté (choc, cathéter, peau/tissus mous, pneumonie sévère), méningite à pneumocoque de sensibilité diminuée (avec céfotaxime), endocardite, allergie sévère aux bêta-lactamines.",
      ar: "‏MRSA موثقة أو مشتبهة (صدمة، قثطرة، جلد/نسج رخوة، التهاب رئة شديد)، سحايا بمكورات رئوية منخفضة الحساسية (مع سيفوتاكسيم)، التهاب شغاف، حساسية شديدة لبيتا-لاكتام.",
    },
    doseAdult: {
      fr: "Charge 25-30 mg/kg IV puis 15-20 mg/kg/8-12 h — ajuster sur concentrations résiduelles (15-20 mg/L pour les infections sévères).",
      ar: "تحميل 25-30 ملغ/كغ وريدي ثم 15-20 ملغ/كغ/8-12 س — كيّف حسب التراكيز القاعية (15-20 ملغ/ل للشديد).",
    },
    dosePediatric: {
      fr: "Nouveau-né : 10-15 mg/kg/12-24 h ; enfant : 15 mg/kg/6 h — toujours sur contrôle des taux.",
      ar: "حديث الولادة: 10-15 ملغ/كغ/12-24 س؛ الطفل: 15 ملغ/كغ/6 س — دائماً بمراقبة التراكيز.",
    },
    dilution: {
      fr: "Diluer dans ≥ 250 mL NaCl 0,9 % ou G5 % — perfusion ≥ 60 min (1 g/heure MAX). Trop rapide = « red man syndrome » (flush, hypotension).",
      ar: "خفف في ≥ 250 مل محلول/غلوكوز — تسريب ≥ 60 د (1 غ/ساعة كحد أقصى). الأسرع = «متلازمة الرجل الأحمر» (تورد، هبوط ضغط).",
    },
    contraindications: {
      fr: "Allergie aux glycopeptides. Prudence : insuffisance rénale (adapter), sujets âgés, association néphrotoxiques.",
      ar: "حساسية غليكوببتيد. حذر: قصور كلوي (كيّف)، المسنون، مشاركة أدوية سامة للكلية.",
    },
    sideEffects: {
      fr: "Néphrotoxicité (dose-dépendante), ototoxicité, red man syndrome (histaminique, pas allergique), phlébite, cytopenies.",
      ar: "سمية كلوية (مرتبطة بالجرعة)، سمية أذنية، متلازمة الرجل الأحمر (هستامينية لا تحسسية)، التهاب وريد، نقص خلايا.",
    },
    nursing: {
      fr: "Respecter la vitesse de perfusion (1 g/h max). Dosage résiduel avant la 4e dose. Surveiller créatinine et audition. Voie centrale préférée si prolongée.",
      ar: "احترم سرعة التسريب (1 غ/س كحد أقصى). قياس القاع قبل الجرعة 4. راقب الكرياتينين والسمع. يفضل وريد مركزي للإطالة.",
    },
    storage: { fr: "T° ambiante ; solution diluée stable 14 j au froid (usage courant : 24 h).", ar: "حرارة الغرفة؛ المحلول المخفف مستقر 14 يوماً بالثلاجة (العملي: 24 س)." },
    alternatives: ["clindamycine", "piperacilline-tazobactam"],
    weightDose: { mgPerKg: 15, maxMg: 2000, note: { fr: "Charge 25-30 mg/kg puis entretien — contrôle des taux obligatoire.", ar: "تحميل 25-30 ملغ/كغ ثم إدامة — قياس التراكيز إلزامي." } },
    meta: { sources: ["ASHP/IDSA vancomycine 2020"], lastReviewed: "2026-09" },
  },
  {
    id: "clindamycine",
    name: { fr: "Clindamycine", ar: "كليندامايسين" },
    brands: "Dalacine® 600 mg/4 mL inj ; gél. 300 mg",
    synonyms: ["clindamycine", "dalacine", "lincosamide", "كليندامايسين"],
    klass: { fr: "Antibiotique — lincosamide (anti-toxinique : bloque la synthèse des exotoxines strepto/staphylo)", ar: "مضاد حيوي — لينكوزاميد (مضاد للذيفان: يثبط تصنيع الذيفانات الخارجية للعقديات/العنقوديات)" },
    highRisk: false,
    indications: {
      fr: "Fasciite nécrosante et dermo-hypodermites graves (EN ASSOCIATION — effet antitoxine), choc toxique streptococcique/staphylococcique, infections ORL/dentaires sévères, aspiration pulmonaire.",
      ar: "التهاب اللفافة الناخر وإنتانات الجلد الشديدة (ضمن مشاركة — تأثير مضاد للذيفان)، صدمة سمية عقدية/عنقودية، إنتانات أذن/سنية شديدة، استنشاق رئوي.",
    },
    doseAdult: {
      fr: "600-900 mg IV/8 h (formes graves) ; relais PO 300-600 mg/6-8 h (biodisponibilité 90 %).",
      ar: "‏600-900 ملغ وريدي/8 س (الشديد)؛ تحويل فموي 300-600 ملغ/6-8 س (توافر حيوي 90%).",
    },
    dosePediatric: {
      fr: "25-40 mg/kg/j en 3-4 prises IV puis PO, max 2,7 g/j.",
      ar: "‏25-40 ملغ/كغ/ي على 3-4 دفعات وريدية ثم فموية، أقصى 2.7 غ/ي.",
    },
    dilution: {
      fr: "600 mg dans 50-100 mL NaCl 0,9 % ou G5 % — perfusion ≥ 30 min (jamais en bolus : arrêt cardiaque décrit).",
      ar: "‏600 ملغ في 50-100 مل محلول/غلوكوز — تسريب ≥ 30 د (أبداً دفعة: توقف قلب موصوف).",
    },
    contraindications: {
      fr: "Allergie aux lincosamides, colite antérieure, insuffisance hépatique sévère (adapter).",
      ar: "حساسية لينكوزاميد، التهاب قولون سابق، قصور كبدي شديد (كيّف).",
    },
    sideEffects: {
      fr: "Colite à C. difficile (risque élevé — diarrhée = arrêt et recherche toxines), goût métallique, hépatite, rash.",
      ar: "التهاب قولون بالمطثية العسيرة (خطر عالٍ — إسهال = إيقاف وبحث الذيفانات)، طعم معدني، التهاب كبد، طفح.",
    },
    nursing: {
      fr: "Ne jamais injecter en bolus IV. Surveiller le transit quotidiennement — toute diarrhée sous clindamycine fait chercher C. difficile.",
      ar: "لا تحقن دفعة وريدية أبداً. راقب العبور يومياً — كل إسهال تحت كليندامايسين يستدعي البحث عن المطثية العسيرة.",
    },
    storage: { fr: "T° ambiante ; ampoule diluée stable 24 h.", ar: "حرارة الغرفة؛ الأمبولة المخففة مستقرة 24 س." },
    alternatives: ["amoxicilline", "piperacilline-tazobactam"],
    weightDose: { mgPerKg: 0, maxMg: 0, note: { fr: "Posologie par tranche — voir doses.", ar: "جرع مجزأة — انظر الجرع." } },
    meta: { sources: ["SPILF DHB 2019", "IDSA SSTI 2014"], lastReviewed: "2026-09" },
  },
  {
    id: "nimodipine",
    name: { fr: "Nimodipine", ar: "نيموديبين" },
    brands: "Nimotop® 10 mg/50 mL inj ; cp 30 mg",
    synonyms: ["nimodipine", "nimotop", "نيموديبين"],
    klass: { fr: "Calcique cérébrosélectif — prévention du vasospasme post-HSA", ar: "حاصر كالسيوم انتقائي دماغي — وقاية من تشنج الأوعية بعد نزف تحت العنكبوتية" },
    highRisk: true,
    indications: {
      fr: "Prévention du déficit neurologique ischémique après hémorragie sous-arachnoïdienne anévrismale — SEULE indication. Début dans les 4 premiers jours, durée 21 jours.",
      ar: "وقاية العجز العصبي الإقفاري بعد نزف تحت العنكبوتية بأم دم — الاستطباب الوحيد. البدء خلال الأيام الأربعة الأولى، المدة 21 يوماً.",
    },
    doseAdult: {
      fr: "60 mg PO/4 h × 21 j (ou par SNG). Forme IV : 1 mg/h les 2 premières heures puis 2 mg/h si tolérance (poids < 70 kg : 0,5 mg/h puis 1 mg/h).",
      ar: "‏60 ملغ فموياً/4 س × 21 يوماً (أو أنبوب معدي). وريدياً: 1 ملغ/س أول ساعتين ثم 2 ملغ/س عند التحمل (وزن < 70 كغ: 0.5 ثم 1 ملغ/س).",
    },
    dosePediatric: {
      fr: "Non recommandé chez l'enfant — décision spécialisée.",
      ar: "غير موصى به عند الأطفال — قرار مختص.",
    },
    dilution: {
      fr: "IV : solution prête à l'emploi, voie centrale ou grosse veine en Y avec NaCl 0,9 % — ne pas utiliser de PVC (adsorption). JAMAIS en intrathécal/bolus (arrêts cardiaques rapportés).",
      ar: "وريدياً: محلول جاهز، وريد مركزي أو كبير على شكل Y مع محلول ملحي — لا تستخدم PVC (امتزاز). أبداً داخل القراب/دفعة (توقفات قلب مبلغة).",
    },
    contraindications: {
      fr: "Hypotension sévère, choc cardiogénique, sténose aortique serrée, association aux autres dihydropyridines.",
      ar: "هبوط ضغط شديد، صدمة قلبية المنشأ، تضيق أبهر شديد، مشاركة دي هيدروبيريدينات أخرى.",
    },
    sideEffects: {
      fr: "Hypotension (réduire la vitesse ou arrêt temporaire), flush, céphalées, bradycardie, élévation des transaminases.",
      ar: "هبوط ضغط (قلل السرعة أو إيقاف مؤقت)، تورد، صداع، بطء قلب، ارتفاع أنزيمات الكبد.",
    },
    nursing: {
      fr: "PA toutes les 15 min au début puis horaire. En cas de PAS < 90 : réduire de moitié ou suspendre. Ne JAMAIS confondre avec d'autres nicardipine/nifédipine — étiquetage « voie orale/enterale seulement » pour les gélules percées.",
      ar: "قياس الضغط كل 15 د بالبداية ثم بالساعة. عند انقباضي < 90: أنقص النصف أو أوقف. لا تخلطها مع نيكارديبين/نيفيدبين — وسم «فموي/معوي فقط» للكبسولات المثقوبة.",
    },
    storage: { fr: "Protéger de la lumière ; flacon IV : 24 h max.", ar: "احمِ من الضوء؛ القارورة الوريدية: 24 س كحد أقصى." },
    alternatives: [],
    weightDose: { mgPerKg: 0, maxMg: 0, note: { fr: "Posologie fixe — ajustement sur la PA.", ar: "جرعة ثابتة — تعديل حسب الضغط." } },
    meta: { sources: ["AHA/ASA HSA 2023"], lastReviewed: "2026-09" },
  },
  {
    id: "acetazolamide",
    name: { fr: "Acétazolamide", ar: "أسيتازولاميد" },
    brands: "Diamox® 500 mg inj ; cp 250 mg",
    synonyms: ["acetazolamide", "diamox", "أسيتازولاميد"],
    klass: { fr: "Inhibiteur de l'anhydrase carbonique — réduit la production d'humeur aqueuse et de LCR", ar: "مثبط الأنهيدراز الكربوني — يقلل إنتاج الخلط المائي والسائل الدماغي الشوكي" },
    highRisk: false,
    indications: {
      fr: "Glaucome aigu à angle fermé (urgence), crises de glaucome, œdème maculaire, hypertension intracrânienne bénigne (avec ponctions), mal aigu des montagnes.",
      ar: "زرق حاد مغلق الزاوية (طوارئ)، نوبات زرق، وذمة لاطخة، ارتفاع ضغط داخل القحف الحميد (مع البزل)، داء المرتفعات الحاد.",
    },
    doseAdult: {
      fr: "Glaucome aigu : 500 mg IV lent puis 250 mg PO/6 h. HTIC bénigne : 500-1000 mg/j PO.",
      ar: "زرق حاد: 500 ملغ وريدي بطيء ثم 250 ملغ فموياً/6 س. ارتفاع الضغط داخل القحف الحميد: 500-1000 ملغ/ي فموياً.",
    },
    dosePediatric: {
      fr: "5 mg/kg/dose IV ou PO, max 4 prises/j — usage spécialisé.",
      ar: "‏5 ملغ/كغ/جرعة وريدياً أو فموياً، 4 دفعات/ي كحد أقصى — استعمال مختص.",
    },
    dilution: {
      fr: "IV : reconstituer 500 mg avec 5 mL d'eau PPI, injecter en 3-5 min.",
      ar: "وريدياً: حل 500 ملغ بـ 5 مل ماء حقن، احقن 3-5 د.",
    },
    contraindications: {
      fr: "Allergie aux sulfamides, insuffisance rénale sévère, insuffisance hépatique sévère (encéphalopathie), hypokaliémie/hyponatrémie marquées, acidose hyperchlorémique, 1er trimestre grossesse.",
      ar: "حساسية سلفاميد، قصور كلوي شديد، قصور كبدي شديد (اعتلال دماغي)، نقص بوتاسيوم/صوديوم واضح، حماض كلوري، الثلث الأول من الحمل.",
    },
    sideEffects: {
      fr: "Paresthésies, polyurie, acidose métabolique, hypokaliémie, calculs rénaux, goût métallique, somnolence.",
      ar: "مذل، كثرة إدرار، حماض استقلابي، نقص بوتاسيوم، حصيات كلوية، طعم معدني، نعاس.",
    },
    nursing: {
      fr: "Vérifier K⁺ et fonction rénale avant traitement prolongé. Alcaliniser les urines si lithiase.",
      ar: "تحقق من البوتاسيوم والوظيفة الكلوية قبل العلاج المديد. قلون البول عند الحصيات.",
    },
    storage: { fr: "T° ambiante à l'abri de la lumière.", ar: "حرارة الغرفة بعيداً عن الضوء." },
    alternatives: ["mannitol"],
    weightDose: { mgPerKg: 5, maxMg: 500, note: { fr: "5 mg/kg/dose, max 500 mg par prise.", ar: "‏5 ملغ/كغ/جرعة، أقصى 500 ملغ بالجرعة." } },
    meta: { sources: ["AAO glaucome aigu"], lastReviewed: "2026-09" },
  },
  {
    id: "mannitol",
    name: { fr: "Mannitol 20 %", ar: "مانيتول 20%" },
    brands: "Mannitol 20 % — poche 250/500 mL",
    synonyms: ["mannitol", "مانيتول"],
    klass: { fr: "Diurétique osmotique — œdème cérébral, hypertension intracrânienne, glaucome aigu réfractaire", ar: "مدر بولي أسموزي — وذمة دماغية، ارتفاع ضغط داخل القحف، زرق حاد مقاوم" },
    highRisk: true,
    indications: {
      fr: "Hypertension intracrânienne avec signes d'engagement (avec hyperventilation transitoire et sédation), glaucome aigu non contrôlé, prévention de la nécrose tubulaire en rhabdomyolyse sévère (après remplissage).",
      ar: "ارتفاع ضغط داخل القحف مع علامات انفتاق (مع فرط تهوية مؤقت وتهدئة)، زرق حاد غير مضبوط، وقاية نخر أنبوبي بانسحاق شديد (بعد التعبئة).",
    },
    doseAdult: {
      fr: "PIC : 0,25-1 g/kg IV en 20-30 min (effet en 15-30 min, durée 4-6 h). Glaucome : 1-2 g/kg en 30-60 min. Rhabdomyolyse : 50-200 g/24 h après remplissage correct.",
      ar: "الضغط داخل القحف: 0.25-1 غ/كغ وريدي 20-30 د (مفعول 15-30 د، مدة 4-6 س). الزرق: 1-2 غ/كغ خلال 30-60 د. الانسحاق: 50-200 غ/24 س بعد تعبئة صحيحة.",
    },
    dosePediatric: {
      fr: "PIC : 0,25-1 g/kg IV/4-6 h — uniquement en réanimation sous surveillance osmolaire.",
      ar: "الضغط داخل القحف: 0.25-1 غ/كغ وريدي/4-6 س — في الإنعاش فقط بمراقبة الأسمولية.",
    },
    dilution: {
      fr: "Solution prête à 20 % — filtrer (cristallisation possible), voie veineuse de bon calibre (risque de nécrose en extravasation). Surveiller l'osmolalité (limite 320 mOsm/L) et la diurèse.",
      ar: "محلول جاهز 20% — رشّح (تبلور محتمل)، وريد جيد (خطر نخر بالتسرب). راقب الأسمولية (حد 320 م أسم/ل) والإدرار.",
    },
    contraindications: {
      fr: "Anurie, déshydratation sévère non corrigée, insuffisance cardiaque décompensée, hémorragie intracrânienne active en progression, osmolalité > 320 mOsm/L.",
      ar: "لانقطاع بول، تجفاف شديد غير مصحح، قصور قلبي غير معوض، نزف داخل القحف متطور، أسمولية > 320 م أسم/ل.",
    },
    sideEffects: {
      fr: "Effet rebond (PIC qui remonte après 4-6 h), hypovolémie, hypernatrémie, insuffisance rénale osmotique, hypokaliémie, œdème pulmonaire par expansion volémique initiale.",
      ar: "تأثير ارتدادي (عودة ارتفاع الضغط بعد 4-6 س)، نقص حجم، فرط صوديوم، قصور كلوي أسموزي، نقص بوتاسيوم، وذمة رئة من التوسع الحجمي البدئي.",
    },
    nursing: {
      fr: "Sonde urinaire indispensable pour suivre la diurèse heure par heure. Ionogramme et osmolalité 2×/j. Remplir AVANT de donner (le mannitol déshydrate d'abord).",
      ar: "مسبار بولي ضروري لمتابعة الإدرار ساعة بساعة. شوارد وأسمولية مرتين يومياً. عبّئ قبل الإعطاء (المانيتول يجفف أولاً).",
    },
    storage: { fr: "T° > 15 °C (cristallise au froid) ; réchauffer et filtrer si cristaux.", ar: "حرارة > 15° (يتبلور بالبرودة)؛ دفّئ ورشّح عند التبلور." },
    alternatives: ["acetazolamide"],
    weightDose: { mgPerKg: 500, maxMg: 80000, note: { fr: "0,5 g/kg par dose — limite osmolaire 320 mOsm/L.", ar: "‏0.5 غ/كغ بالجرعة — الحد الأسموزي 320 م أسم/ل." } },
    meta: { sources: ["Brain Trauma Foundation", "AAO glaucome"], lastReviewed: "2026-09" },
  },
];

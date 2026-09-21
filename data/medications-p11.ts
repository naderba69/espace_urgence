import type { Medication } from "./types";

// v8.4 — Phase 11 : urologie (kétoprofène, tamsulosine), infectiologie (ciprofloxacine,
// gentamicine), cardio (colchicine), réanimation métabolique (chlorure de potassium).
export const medicationsPhase11: Medication[] = [
  {
    id: "ketoprofene",
    name: { fr: "Kétoprofène", ar: "كيتوبروفين" },
    brands: "Profénid® 100 mg/2 mL inj ; cp 100 mg ; gel",
    synonyms: ["ketoprofene", "profenid", "AINS", "كيتوبروفين"],
    klass: { fr: "AINS — anti-inflammatoire non stéroïdien (colique néphrétique 1re ligne)", ar: "مضاد التهاب غير ستيرويدي — الخط الأول بالمغص الكلوي" },
    highRisk: false,
    indications: {
      fr: "Colique néphrétique (1re ligne — supérieur aux opioïdes), douleur inflammatoire aiguë, dysménorrhée, poussée rhumatismale, migraine (forme PO).",
      ar: "المغص الكلوي (الخط الأول — يتفوق على الأفيونيات)، ألم التهابي حاد، عسر طمث، نوبة رثوية، شقيقة (فموي).",
    },
    doseAdult: {
      fr: "100 mg IV lente (15 min) ou IM profonde, renouvelable ; max 200 mg/j en aigu. Relais PO 100 mg/12 h.",
      ar: "‏100 ملغ وريدي بطيء (15 د) أو عضلي عميق، قابل للتكرار؛ أقصى 200 ملغ/ي بالحاد. تحويل فموي 100 ملغ/12 س.",
    },
    dosePediatric: {
      fr: "> 15 ans seulement : posologie adulte. En dessous : préférer l'ibuprofène PO selon poids.",
      ar: "‏> 15 سنة فقط: جرع البالغ. دونها: فضل الإيبوبروفين فموياً حسب الوزن.",
    },
    dilution: {
      fr: "IV : diluer dans 50-100 mL NaCl 0,9 %, perfusion 15-30 min. IM : profonde, quadrant supéro-externe.",
      ar: "وريدياً: خفف في 50-100 مل محلول ملحي، تسريب 15-30 د. عضلياً: عميق بالربع العلوي الوحشي.",
    },
    contraindications: {
      fr: "Insuffisance rénale (DFG < 30), ulcère gastro-duodénal évolutif, allergie AINS/aspirine (asthme), grossesse ≥ 24 SA (CONTRE-INDICATION ABSOLUE — toxicité rénale et cardiopulmonaire fœtale), insuffisance cardiaque sévère, cirrhose décompensée.",
      ar: "قصور كلوي (‏DFG < 30)، قرحة معدية-عشرية نشطة، حساسية AINS/أسبرين (ربو)، الحمل ≥ 24 أسبوعاً (مضاد استطباب مطلق — سمية كلوية وقلبية-رئوية جنينية)، قصور قلبي شديد، تشمع معوض.",
    },
    sideEffects: {
      fr: "Douleur abdominale, ulcère/hémorragie digestive, néphropathie (surtout si déshydratation), rétention hydrosodée, hyperkaliémie, rash, bronchospasme chez l'asthmatique.",
      ar: "ألم بطني، قرحة/نزف هضمي، اعتلال كلوي (خصوصاً مع التجفاف)، احتباس ماء وصوديوم، فرط بوتاسيوم، طفح، تشنج قصبي عند الربوي.",
    },
    nursing: {
      fr: "Vérifier la fonction rénale et l'hydratation avant injection. Gastroprotection si facteur de risque. Ne JAMAIS associer deux AINS. Colique : ne pas surhydrater pendant la crise.",
      ar: "تحقق من الوظيفة الكلوية والإماهة قبل الحقن. حماية معدية عند عوامل الخطر. لا تجمع مضادين التهاب أبداً. المغص: لا تفرط بالإماهة أثناء النوبة.",
    },
    storage: { fr: "Protéger de la lumière.", ar: "احمِ من الضوء." },
    alternatives: ["morphine", "paracetamol"],
    weightDose: { mgPerKg: 0, maxMg: 0, note: { fr: "Posologie fixe adulte — max 200 mg/j.", ar: "جرعة ثابتة للبالغ — أقصى 200 ملغ/ي." } },
    meta: { sources: ["EAU urolithiasis 2023", "Résumé des caractéristiques produit"], lastReviewed: "2026-09" },
  },
  {
    id: "tamsulosine",
    name: { fr: "Tamsulosine", ar: "تامسولوسين" },
    brands: "Josir® LP 0,4 mg ; Omexel® LP 0,4 mg",
    synonyms: ["tamsulosine", "josir", "omexel", "alpha-bloquant", "تامسولوسين"],
    klass: { fr: "Alpha-1-bloquant urosélectif — traitement expulsif du calcul, RAU/HBP", ar: "حاصر ألفا-1 انتقائي مسالكياً — علاج طارد للحصاة، الاحتباس/تضخم البروستات" },
    highRisk: false,
    indications: {
      fr: "Traitement expulsif médical du calcul urétéral distal 5-10 mm (facilite l'expulsion de ~30 %), rétention aiguë d'urine sur HBP (avant épreuve de désondage), symptômes du bas appareil urinaire.",
      ar: "علاج طارد طبي لحصاة الحالب القاصية 5-10 مم (يسهل الخروج بـ ~30%)، الاحتباس البولي الحاد بتضخم البروستات (قبل اختبار النزع)، أعراض الجهاز البولي السفلي.",
    },
    doseAdult: {
      fr: "0,4 mg PO en 1 prise/j (le matin), pendant 2-4 semaines pour l'expulsion ; au long cours pour l'HBP.",
      ar: "‏0.4 ملغ فموياً بجرعة واحدة/ي (صباحاً)، 2-4 أسابيع للطرد؛ طويل الأمد لتضخم البروستات.",
    },
    dosePediatric: {
      fr: "Non recommandé chez l'enfant.",
      ar: "غير موصى به عند الأطفال.",
    },
    dilution: {
      fr: "Forme LP : avaler entière, sans croquer, à heure fixe.",
      ar: "مديد المفعول: ابتلعه كاملاً دون مضغ، بوقت ثابت.",
    },
    contraindications: {
      fr: "Hypotension orthostatique symptomatique, insuffisance hépatique sévère. Prudence : chirurgie de cataracte programmée (syndrome de l'iris flasque — prévenir l'ophtalmo).",
      ar: "هبوط ضغط انتصابي عرضي، قصور كبدي شديد. حذر: جراحة ماء بيضاء مجدولة (متلازمة القزحية الرخوة — أخبر طبيب العيون).",
    },
    sideEffects: {
      fr: "Vertiges/hypotension orthostatique (1re doses), éjaculation rétrograde, céphalées, rarement priapisme (urgence urologique).",
      ar: "دوار/هبوط انتصابي (الجرع الأولى)، قذف رجعي، صداع، نادراً انتعاظ مستمر (طوارئ مسالك).",
    },
    nursing: {
      fr: "Prendre la 1re dose le soir (vertiges). Éduquer sur l'hypotension au lever. En pré-op cataracte : signaler la prise au chirurgien.",
      ar: "خذ الجرعة الأولى مساءً (دوار). ثقف حول الهبوط عند النهوض. قبل جراحة الماء البيضاء: أخبر الجراح بالاستعمال.",
    },
    storage: { fr: "T° ambiante.", ar: "حرارة الغرفة." },
    alternatives: [],
    weightDose: { mgPerKg: 0, maxMg: 0, note: { fr: "Dose fixe 0,4 mg/j.", ar: "جرعة ثابتة 0.4 ملغ/ي." } },
    meta: { sources: ["EAU urolithiasis 2023"], lastReviewed: "2026-09" },
  },
  {
    id: "ciprofloxacine",
    name: { fr: "Ciprofloxacine", ar: "سيبروفلوكساسين" },
    brands: "Ciflox® 200 mg/100 mL inj ; cp 250-500 mg",
    synonyms: ["ciprofloxacine", "ciflox", "cipro", "fluoroquinolone", "سيبروفلوكساسين"],
    klass: { fr: "Antibiotique — fluoroquinolone (Gram négatifs dont Pseudomonas, diffusion prostatique)", ar: "مضاد حيوي — فلوروكينولون (سلبيات الغرام منها الزائفة، نفوذ بروستاتي)" },
    highRisk: false,
    indications: {
      fr: "Pyélonéphrite aiguë (si pas de fluoroquinolone dans les 6 mois), prostatite, infections urinaires masculines, diarrhée du voyageur sévère, fièvre typhoïde, prophylaxie du méningocoque chez les contacts.",
      ar: "التهاب الحويضة والكلية الحاد (إذا لم يستعمل فلوروكينولون بـ 6 أشهر)، التهاب بروستات، إنتانات بولية ذكورية، إسهال المسافر الشديد، حمى تيفية، وقاية مخالطي السحائية.",
    },
    doseAdult: {
      fr: "PO : 500 mg/12 h (pyélonéphrite 10-14 j). IV : 400 mg/12 h en 60 min. Prostatite : 500 mg/12 h × 4-6 semaines.",
      ar: "فموياً: 500 ملغ/12 س (التهاب الحويضة 10-14 يوماً). وريدياً: 400 ملغ/12 س خلال 60 د. البروستات: 500 ملغ/12 س × 4-6 أسابيع.",
    },
    dosePediatric: {
      fr: "Usage exceptionnel chez l'enfant (risque articulaire) — indications spécialisées uniquement (mucoviscidose, typhoïde) : 20-30 mg/kg/j en 2 prises.",
      ar: "استعمال استثنائي عند الأطفال (خطر مفصلي) — استطبابات مختصة فقط (تليف كيسي، تيفوئيد): 20-30 ملغ/كغ/ي على دفعتين.",
    },
    dilution: {
      fr: "IV : perfusion 60 min (400 mg) — jamais en bolus. PO : à distance des cations (Ca²⁺, fer, antiacides — chélation).",
      ar: "وريدياً: تسريب 60 د (400 ملغ) — أبداً دفعة. فموياً: بعيداً عن الكاتيونات (كالسيوم، حديد، مضادات حموضة — خلب).",
    },
    contraindications: {
      fr: "Allergie aux quinolones, grossesse/allaitement (relatif — peser bénéfice/risque), enfant hors indications spécialisées, QT long, myasthénie, tendinopathie aux quinolones.",
      ar: "حساسية كينولون، حمل/إرضاع (نسبي — وزن الفائدة/الخطر)، أطفال عدا الاستطبابات المختصة، ‏QT طويل، وهن عضلي، اعتلال أوتار بالكينولونات.",
    },
    sideEffects: {
      fr: "Tendinopathie/rupture du tendon d'Achille (arrêter au 1er signe !), QT long, troubles CNS (confusion du sujet âgé, convulsions), photosensibilité, diarrhée/C. difficile, neuropathie.",
      ar: "اعتلال أوتار/تمزق أخيل (أوقف عند أول علامة!)، إطالة QT، اضطرابات عصبية مركزية (تخليط المسن، اختلاجات)، حساسية ضوئية، إسهال/مطثية عسيرة، اعتلال أعصاب.",
    },
    nursing: {
      fr: "Écarter les cations de 2 h de chaque prise PO. Surveiller les tendons (Achille) et le QT. Espacer de 6 mois les cures si possible (pression de sélection BLSE).",
      ar: "افصل الكاتيونات ساعتين عن كل جرعة فموية. راقب الأوتار (أخيل) وQT. ابعد بين الجرع 6 أشهر إن أمكن (ضغط انتقاء BLSE).",
    },
    storage: { fr: "Protéger de la lumière ; flacon IV : usage unique.", ar: "احمِ من الضوء؛ القارورة الوريدية: استعمال وحيد." },
    alternatives: ["cefotaxime", "amoxicilline"],
    weightDose: { mgPerKg: 0, maxMg: 0, note: { fr: "Posologie fixe adulte.", ar: "جرعة ثابتة للبالغ." } },
    meta: { sources: ["SPILF PNA 2018", "Résumé des caractéristiques produit"], lastReviewed: "2026-09" },
  },
  {
    id: "gentamicine",
    name: { fr: "Gentamicine", ar: "جنتامايسين" },
    brands: "Gentalline® 80 mg/2 mL inj",
    synonyms: ["gentamicine", "gentalline", "aminoside", "جنتامايسين"],
    klass: { fr: "Antibiotique — aminoside (synergie endocardite, sepsis néonatal, couverture Gram négatif sévère)", ar: "مضاد حيوي — أمينوغليكوزيد (تآزر بالشغاف، إنتان حديثي الولادة، تغطية سلبيات الغرام الشديدة)" },
    highRisk: true,
    indications: {
      fr: "Endocardite infectieuse (synergie avec bêta-lactamine), sepsis néonatal précoce (avec ampicilline), renfort empirique du choc septique à Gram négatif, listériose (avec amoxicilline).",
      ar: "التهاب الشغاف الإنتاني (تآزر مع بيتا-لاكتام)، إنتان حديثي الولادة المبكر (مع أمبيسيلين)، تعزيز تجريبي لصدمة إنتانية بسلبيات الغرام، listeriose (مع أموكسيسيلين).",
    },
    doseAdult: {
      fr: "Sepsis/choc : 5-7 mg/kg en dose unique/j IV sur 30 min. Endocardite (synergie) : 3 mg/kg/j en 2-3 prises — durée courte (2 semaines max), contrôler les taux.",
      ar: "إنتان/صدمة: 5-7 ملغ/كغ بجرعة وحيدة/ي وريدي على 30 د. الشغاف (تآزر): 3 ملغ/كغ/ي على 2-3 دفعات — مدة قصيرة (أسبوعان كحد أقصى)، قس التراكيز.",
    },
    dosePediatric: {
      fr: "Nouveau-né < 7 j : 4-5 mg/kg/24-48 h ; > 7 j et nourrisson : 5-7,5 mg/kg/24 h — posologies selon terme et protocoles néonat.",
      ar: "حديث الولادة < 7 أيام: 4-5 ملغ/كغ/24-48 س؛ > 7 أيام والرضيع: 5-7.5 ملغ/كغ/24 س — الجرع حسب العمر البروتوكولي.",
    },
    dilution: {
      fr: "Diluer dans 50-100 mL NaCl 0,9 %, perfusion 30 min. Dose unique journalière = meilleure efficacité, moindre toxicité.",
      ar: "خفف في 50-100 مل محلول ملحي، تسريب 30 د. جرعة يومية وحيدة = فعالية أعلى وسمية أقل.",
    },
    contraindications: {
      fr: "Allergie aux aminosides, myasthénie. Prudence majeure : insuffisance rénale (adapter/espacer), association aux autres néphrotoxiques (vancomycine, AINS, produits de contraste), sujet âgé.",
      ar: "حساسية أمينوغليكوزيد، وهن عضلي. حذر شديد: قصور كلوي (كيّف/افصل)، مشاركة سموم كلوية أخرى (فانكومايسين، ‏AINS، مواد ظليلة)، المسن.",
    },
    sideEffects: {
      fr: "Néphrotoxicité (réversible si arrêt précoce), ototoxicité vestibulaire ET cochléaire (irréversible !), bloc neuromusculaire (rare).",
      ar: "سمية كلوية (عكوسة عند الإيقاف المبكر)، سمية أذنية دهليزية وقوقعية (لا عكوسة!)، حصار عصبي عضلي (نادر).",
    },
    nursing: {
      fr: "Contrôle des taux (pic et résiduel) en cure > 48 h ou si insuffisance rénale. Créer unique journalière. Surveiller créatinine et audition (surtout le sujet âgé).",
      ar: "قياس التراكيز (القمة والقاع) بعلاج > 48 س أو قصور كلوي. جرعة يومية وحيدة. راقب الكرياتينين والسمع (خصوصاً المسن).",
    },
    storage: { fr: "T° ambiante ; ampoule diluée stable 24 h.", ar: "حرارة الغرفة؛ الأمبولة المخففة مستقرة 24 س." },
    alternatives: ["amikacine"],
    weightDose: { mgPerKg: 5, maxMg: 480, note: { fr: "5-7 mg/kg en dose unique/j — contrôle des taux.", ar: "‏5-7 ملغ/كغ بجرعة وحيدة/ي — قياس التراكيز." } },
    meta: { sources: ["ESC endocarditis 2023", "SPILF"], lastReviewed: "2026-09" },
  },
  {
    id: "colchicine",
    name: { fr: "Colchicine", ar: "كولشيسين" },
    brands: "Colchicine Opocalcium® 1 mg cp",
    synonyms: ["colchicine", "colchimax", "كولشيسين"],
    klass: { fr: "Anti-inflammatoire antimitotique — péricardite (prévention des récidives), goutte aiguë", ar: "مضاد التهاب مضاد للانقسام — التهاب التامور (وقاية النكس)، نوبة النقرس" },
    highRisk: true,
    indications: {
      fr: "PÉRICARDITE AIGUË : associée à l'aspirine/AINS, divise par 2 les récidives (3 mois). Goutte aiguë (si AINS contre-indiqués), prophylaxie des crises de goutte, maladie périodique (fièvre méditerranéenne familiale — fréquente au Maghreb).",
      ar: "التهاب التامور الحاد: مع الأسبرين/AINS يخفض النكس للنصف (3 أشهر). نوبة النقرس (إذا موانع AINS)، وقاية نوبات النقرس، الحمى المتوسطية العائلية (شائعة بالمغرب الكبير).",
    },
    doseAdult: {
      fr: "Péricardite : 0,5 mg × 2/j pendant 3 mois (< 70 kg : 0,5 mg/j). Goutte aiguë : 1 mg puis 0,5 mg 1 h après, puis 0,5 mg × 2-3/j. Maladie périodique : 1-2 mg/j à vie.",
      ar: "التهاب التامور: 0.5 ملغ × 2/ي لمدة 3 أشهر (< 70 كغ: 0.5 ملغ/ي). نقرس حاد: 1 ملغ ثم 0.5 ملغ بعد ساعة، ثم 0.5 ملغ × 2-3/ي. الحمى المتوسطية: 1-2 ملغ/ي مدى الحياة.",
    },
    dosePediatric: {
      fr: "Maladie périodique : 0,5 mg/j < 5 ans, 1 mg/j 5-10 ans, 1,5 mg/j > 10 ans — à vie (prévient l'amylose).",
      ar: "الحمى المتوسطية: 0.5 ملغ/ي < 5 سنوات، 1 ملغ/ي ‏5-10، ‏1.5 ملغ/ي > 10 — مدى الحياة (يمنع النشواني).",
    },
    dilution: {
      fr: "Voie orale uniquement — JAMAIS d'injection IV (colchicine injectable retirée du marché : décès). Marge thérapeutique ÉTROITE.",
      ar: "الطريق الفموي فقط — أبداً حقن وريدي (الكولشيسين الوريدي سُحب من السوق: وفيات). هامش علاجي ضيق.",
    },
    contraindications: {
      fr: "Insuffisance rénale sévère (DFG < 30), insuffisance hépatique sévère, association aux macrolides (sauf spiramycine) et à la pristinamycine — interaction MORTELLE (rhabdomyolyse, pancytopénie), prudence cycline/antivitamine K.",
      ar: "قصور كلوي شديد (‏DFG < 30)، قصور كبدي شديد، مشاركة الماكروليدات (عدا سبيرامايسين) والبريستينامايسين — تداخل مميت (انسحاق عضلي، نقص خلايا شامل)، حذر تتراسيكلين/مضادات فيتامين K.",
    },
    sideEffects: {
      fr: "Diarrhée (premier signe de surdosage — réduire la dose), nausées, myopathie/rhabdomyolyse (surtout avec statine ou macrolide), pancytopénie (surdosage), alopécie.",
      ar: "إسهال (أول علامة فرط جرعة — أنقص الجرعة)، غثيان، اعتلال عضلي/انسحاق (خصوصاً مع ستاتين أو ماكروليد)، نقص خلايا شامل (فرط جرعة)، تساقط شعر.",
    },
    nursing: {
      fr: "La diarrhée = signal d'alerte : réduire ou suspendre. Vérifier TOUTE l'ordonnance (macrolides ++) avant de prescrire. Marge étroite : ne jamais doubler une dose oubliée.",
      ar: "الإسهال = إنذار: أنقص أو أوقف. راجع كل الوصفة (ماكروليدات خصوصاً) قبل الوصف. هامش ضيق: لا تضاعف جرعة منسية أبداً.",
    },
    storage: { fr: "T° ambiante.", ar: "حرارة الغرفة." },
    alternatives: [],
    weightDose: { mgPerKg: 0, maxMg: 0, note: { fr: "Posologie fixe — marge étroite.", ar: "جرعة ثابتة — هامش ضيق." } },
    meta: { sources: ["ESC pericardial 2015", "EULAR gout"], lastReviewed: "2026-09" },
  },
  {
    id: "chlorure-potassium",
    name: { fr: "Chlorure de potassium (KCl)", ar: "كلوريد البوتاسيوم" },
    brands: "KCl 10 % — ampoule 10 mL (1 g = 13,4 mmol)",
    synonyms: ["chlorure de potassium", "KCl", "potassium", "كلوريد البوتاسيوم"],
    klass: { fr: "Électrolyte — correction de l'hypokaliémie (toujours dilué, jamais en bolus)", ar: "شوارد — تصحيح نقص البوتاسيوم (مخفف دائماً، أبداً دفعة)" },
    highRisk: true,
    indications: {
      fr: "Hypokaliémie symptomatique ou < 3 mmol/L, prévention en réanimation (diurétiques, insuline dans l'ACD/HHS), pertes digestives (vomissements, diarrhée), digitalisés.",
      ar: "نقص بوتاسيوم عرضي أو < 3 م مول/ل، وقاية بالإنعاش (مدرات، أنسولين بالحماض الكيتوني/فرط الأسمولية)، فقد هضمي (تقيؤ، إسهال)، متناولو الديجيتال.",
    },
    doseAdult: {
      fr: "Hypokaliémie modérée (3-3,5) : 2-4 g/j PO. Sévère (< 3) : IV — max 1,5 g/h (20 mmol/h) sur voie centrale avec scope, 1 g/h (13 mmol/h) sur voie périphérique (veine de gros calibre). Déficit total estimé : 3-6 mmol/kg par 0,5 mmol/L sous 3,5.",
      ar: "نقص معتدل (3-3.5): 2-4 غ/ي فموياً. شديد (< 3): وريدي — أقصى 1.5 غ/س (20 م مول/س) عبر وريد مركزي بمراقبة، 1 غ/س (13 م مول/س) عبر محيطي (وريد عريض). العجز الكلي: 3-6 م مول/كغ لكل 0.5 م مول/ل تحت 3.5.",
    },
    dosePediatric: {
      fr: "0,5-1 mmol/kg/h IV max (scope obligatoire), surveillance ionogramme × 2/j — uniquement en réanimation pour les formes sévères.",
      ar: "‏0.5-1 م مول/كغ/س وريدي كحد أقصى (مراقبة إلزامية)، شوارد مرتين يومياً — بالإنعاش فقط للأشكال الشديدة.",
    },
    dilution: {
      fr: "JAMAIS DE BOLUS IV (arrêt cardiaque !) : toujours diluer (max 4 g/L en périphérique, 8 g/L en central), pompe à perfusion obligatoire en IV. Vérifier la diurèse avant toute supplémentation.",
      ar: "أبداً دفعة وريدية (توقف قلب!): خفف دائماً (أقصى 4 غ/ل محيطياً، 8 غ/ل مركزياً)، مضخة تسريب إلزامية وريدياً. تحقق من الإدرار قبل أي تعويض.",
    },
    contraindications: {
      fr: "Hyperkaliémie, insuffisance rénale sévère sans diurèse, bloc auriculo-ventriculaire non appareillé, addisonien non traité. Prudence : IEC/ARA II/spironolactone (hyperkaliémie cumulative).",
      ar: "فرط بوتاسيوم، قصور كلوي شديد بلا إدرار، حصار أذيني-بطيني دون ناظمة، داء أديسون غير معالج. حذر: حاصرات ACE/ARB/سبيرونولاكتون (فرط بوتاسيوم تراكمي).",
    },
    sideEffects: {
      fr: "Douleur veineuse (phlébite au KCl périphérique), hyperkaliémie iatrogène (arythmies, arrêt), troubles digestifs (formes PO).",
      ar: "ألم وريدي (التهاب وريد بالـ KCl المحيطي)، فرط بوتاسيوم علاجي (اضطرابات نظم، توقف)، اضطرابات هضمية (فموي).",
    },
    nursing: {
      fr: "Médicament à HAUT RISQUE : double contrôle de la dilution et du débit, étiquetage, pompe. Ionogramme de contrôle toutes les 4-6 h en correction IV. Le magnésium bas rend l'hypokaliémie réfractaire — corriger Mg²⁺ aussi.",
      ar: "دواء عالي الخطورة: تحقق مزدوج من التخفيف والسرعة، وسم، مضخة. شوارد مراقبة كل 4-6 س بالتصحيح الوريدي. المغنزيوم المنخفض يجعل النقص مقاوماً — صحح المغنزيوم أيضاً.",
    },
    storage: { fr: "T° ambiante ; ampoule à usage unique après dilution.", ar: "حرارة الغرفة؛ الأمبولة لاستعمال وحيد بعد التخفيف." },
    alternatives: [],
    weightDose: { mgPerKg: 0, maxMg: 0, note: { fr: "Correction guidée par l'ionogramme — max 20 mmol/h central.", ar: "تصحيح موجه بالشوارد — أقصى 20 م مول/س مركزياً." } },
    meta: { sources: ["Réanimation métabolique", "Société française de pharmacie clinique"], lastReviewed: "2026-09" },
  },
];

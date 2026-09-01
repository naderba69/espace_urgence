import type { Protocol, Localized } from "./types";
import { protocolsP2 } from "./protocols-p2";
import { protocolsP3 } from "./protocols-p3";
import { protocolsP4 } from "./protocols-p4";
import { protocolsP5 } from "./protocols-p5";
import { protocolsP6 } from "./protocols-p6";

export interface ProtocolCategory {
  id: string;
  label: Localized;
}

export const protocolCategories: ProtocolCategory[] = [
  { id: "reanimation", label: { fr: "Réanimation", ar: "الإنعاش" } },
  { id: "medecine", label: { fr: "Urgences médicales", ar: "استعجالات طبية" } },
  { id: "traumatologie", label: { fr: "Traumatologie", ar: "الإصابات والجروح" } },
  { id: "pediatrie", label: { fr: "Pédiatrie", ar: "طب الأطفال" } },
  { id: "obstetrique", label: { fr: "Obstétrique", ar: "التوليد" } },
  { id: "psychiatrie", label: { fr: "Urgences psychiatriques", ar: "الطب النفسي" } },
  { id: "toxicologie", label: { fr: "Toxicologie", ar: "السموم" } },
];

// ⚕️ Synthèses d'après AHA ACLS 2025 / ERC 2021 / RCUK / ATLS 10e / AHA PALS 2020.
// ⚠️ Contenu à faire valider par un médecin — toujours vérifier les doses.
const protocolsCore: Protocol[] = [
  {
    id: "acr-adulte",
    title: { fr: "Arrêt cardiaque de l'adulte (ACR)", ar: "توقف القلب لدى الكبير" },
    category: "reanimation",
    severity: "critical",
    summary: { fr: "Chaîne de survie complète d'un arrêt cardiaque de l'adulte : RCP de haute qualité, défibrillation et médicaments selon le rythme.", ar: "سلسلة النجاة الكاملة لتوقف القلب: إنعاش عالي الجودة، صعق وأدوية حسب الإيقاع." },
    steps: [
      { title: { fr: "Constater : absence de réponse, respiration absente ou gasps, pas de pouls carotidien <10 s", ar: "التأكد: لا استجابة، تنفس غائب أو لهاث، لا نبض سباتي خلال <10 ث" }, detail: { fr: "Alerter/Composer SAMU 190 — activer la chaîne de survie.", ar: "نادِ/اتصل بالإسعاف 190 — فعّل سلسلة الإنقاذ." } },
      { title: { fr: "RCP haute qualité : 100–120/min, profondeur 5–6 cm, relâchement complet, interruptions <10 s", ar: "إنعاش جيد: 100–120/د، عمق 5–6 سم، ارتداد كامل، توقفات <10 ث" } },
      { title: { fr: "Analyser le rythme dès que le défibrillateur est prêt", ar: "حلّل الإيقاع فور جاهزية الصادم" } },
      { title: { fr: "Rythme CHOQUABLE (FV/TVSP) : choc biphasique 120–200 J, RCP reprise immédiate", ar: "إيقاع قابل للصدم (رجفان/تسرع بلا نبض): صدمة ثنائية 120–200 جول، استأنف فوراً" }, detail: { fr: "Amiodarone 300 mg IV après le 3e choc, puis 150 mg après le 5e.", ar: "أميودارون 300 ملغ بعد الصدمة الثالثة ثم 150 ملغ بعد الخامسة." } },
      { title: { fr: "Rythme NON choquable (asystolie/AESP) : adrénaline 1 mg IV/IO dès que possible, puis toutes les 3–5 min", ar: "إيقاع غير قابل للصدم (انعدام تقلص/نشاط كهربائي بلا نبض): أدرنالين 1 ملغ فوراً ثم كل 3–5 د" } },
      { title: { fr: "Cycles de 2 min : réanalyser, changer de compresseur, chercher causes réversibles (5H & 5T)", ar: "دورات دقيقتين: أعد التحليل، بدّل الضاغط، ابحث عن أسباب عكوسة (5H و5T)" } },
      { title: { fr: "Voie aérienne avancée + capnographie (EtCO2). Cible : EtCO2 >10–20 mmHg", ar: "مجرى هوائي متقدم + كابنوغرافيا (الهدف EtCO2 >10–20)" } },
      { title: { fr: "ROSC : ABCDE, TA ≥ PAM 65, ECG 12 dérivations, capno, T° 32–36 °C si coma, bilan", ar: "استعادة الدوران: ABCDE، متوسط ضغط ≥65، تخطيط 12 اشتقاق، حرارة 32–36°م إن غيبوبة، فحوص" } },
    ],
    keyPoints: [
      { fr: "Adrénaline : 1 mg toutes les 3–5 min — précoce dans les rythmes non choquables.", ar: "أدرنالين 1 ملغ كل 3–5 د — مبكراً في الإيقاعات غير القابلة للصدم." },
      { fr: "5H/5T : Hypovolémie, Hypoxie, H+ (acidose), Hypo/HyperK+, Hypothermie ; Tamponnade, Toxiques, Thrombose (coronaire/pulmonaire), pneumothorax sous Tension.", ar: "5H/5T: نقص حجم، نقص أكسجين، حماض، خلل بوتاسيوم، نقص حرارة؛ دكاك قلبي، سموم، خثار تاجي/رئوي، استرواح ضاغط." },
      { fr: "Minimiser les pauses ; compression = 80 % du pronostic.", ar: "قلّل التوقفات؛ الضغطات = 80% من الإنذار." },
    ],
    trajectory: [
      {
        when: { fr: "Après ROSC — détérioration secondaire", ar: "بعد الاستعادة — تدهور ثانوي" },
        do: [
          { fr: "Si PAS < 90 ou SpO2 < 92 % : remplissage prudent + noradrénaline PSE (titré PAM 65).", ar: "إذا ضغط انقباضي < 90 أو تشبع < 92: تعويض حذر + نورأدرينالين معاير (متوسط 65)." },
          { fr: "ECG 12 dérivations immédiat ; si STEMI → régulation 190/QEEG-PCI.", ar: "ECG 12 فوراً؛ إذا STEMI ← تنظيم 190/قسطرة." },
        ],
      },
      {
        when: { fr: "Arrêt réfractaire > 20 min sans cause réversible trouvée", ar: "توقف مقاوم > 20 د دون سبب عكوس" },
        do: [
          { fr: "Avis médical régulateur 190 pour discussion poursuite/arrêt des soins (facteurs de mauvais pronostic : âge, comorbidités, temps sans RCP, EtCO2 < 10 après 20 min).", ar: "رأي الطبيب المنظم 190 لمناقشة المتابعة/الإيقاف (سوء الإنذار: العمر، الأمراض، مدة بلا إنعاش، EtCO2 < 10 بعد 20 د)." },
          { fr: "Ne pas arrêter sans accord médical et bilan des causes réversibles.", ar: "لا توقف دون اتفاق طبي وفحص الأسباب العكوسة." },
        ],
      },
      {
        when: { fr: "Complication péri-ACR : fracture costale, pneumothorax, hémothorax", ar: "تعقيد حول التوقف: كسر ضلعي، استرواح، دم صدري" },
        do: [
          { fr: "Si détresse respiratoire post-choc : auscultation, SpO2 — rechercher pneumothorax (drain si tension).", ar: "إذا ضائقة تنفسية بعد الصدمة: إصغاء، تشبع — اشك في استرواح (بزل إن ضاغط)." },
          { fr: "Surveiller saignement interne (hématome, TA) ; bilans d'imagerie à l'arrivée.", ar: "راقب النزف الداخلي؛ فحوص تصوير عند الوصول." },
        ],
      },
    ],
    medications: ["adrenaline", "amiodarone"],
    calculators: ["chrono-rcp"],
    meta: { sources: ["AHA ACLS Guidelines 2025", "ERC Guidelines 2021"], lastReviewed: "2026-08" },
  },
  {
    id: "anaphylaxie",
    title: { fr: "Anaphylaxie", ar: "الصدمة الأرجية (الحساسية المفرطة)" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Réaction allergique grave menaçante : adrénaline IM immédiate, puis mesures de choc.", ar: "تفاعل أرجي خطير: أدرينالين عضلي فوري ثم تدابير الصدمة." },
    steps: [
      { title: { fr: "Reconnaître : début brutal + atteinte cutanée/muqueuse ET (respiratoire OU circulatoire OU digestive sévère)", ar: "التعرّف: بداية فجائية + أعراض جلدية/مخاطية و(تنفسية أو وعائية أو هضمية شديدة)" } },
      { title: { fr: "Retirer l'allergène si possible — NE PAS mobiliser/debout le patient", ar: "أزل المؤرث إن أمكن — لا تقيّم المريض واقفاً" } },
      { title: { fr: "ADRÉNALINE IM immédiate : 1 mg/mL face antéro-latérale de cuisse", ar: "أدرنالين عضلياً فوراً: 1ملغ/مل في الفخذ الأمامي الوحشي" }, detail: { fr: ">12 ans/adulte : 500 µg (0,5 mL) — 6–12 ans : 300 µg — 6 mois–6 ans : 150 µg — <6 mois : 100–150 µg. Répéter après 5 min si non amélioré.", ar: ">12 سنة: 500 مكغ (0.5 مل) — 6–12 سنة: 300 — 6 أشهر–6 سنوات: 150 — <6 أشهر: 100–150. تُعاد بعد 5 دقائق عند عدم التحسن." } },
      { title: { fr: "Allonger, jambes surélevées ; si détresse respiratoire = position la plus confortable ; grossesse : décubitus latéral gauche", ar: "استلقاء مع رفع الساقين؛ ضيق نفسي: الوضعية الأراح؛ حامل: استلقاء جانبي أيسر" } },
      { title: { fr: "O2 haute concentration 15 L/min au masque + SpO2", ar: "أكسجين 15 ل/د بقناع + تشبع" } },
      { title: { fr: "Remplissage : NaCl 0,9 % rapide (adulte 500–1000 mL ; enfant 20 mL/kg)", ar: "توسيع حجمي: مصل ملحي سريع (كبير 500–1000 مل؛ طفل 20 مل/كغ)" } },
      { title: { fr: "Si réfractaire : 2e PSE adrénaline IV (milieu médicalisé) — SAMU 190 / réa", ar: "إذا مقاومة: مضخة أدرنالين وريدية (وسط طبّي) — اتصل 190" } },
      { title: { fr: "Adjuvants (JAMAIS seuls) : antihistaminique H1 + corticoïde IV", ar: "مكمّلان (ليسا بديلاً أبداً): مضاد هيستامين H1 + كورتيكويد وريدي" } },
      { title: { fr: "Surveillance 6–12 h (biphasique) + notification pharmacovigilance", ar: "مراقبة 6–12 ساعة (ثنائي الطور) + إبلاغ دوائي" } },
    ],
    keyPoints: [
      { fr: "Bronchospasme, angio-œdème laryngé, hypotension = adrénaline IM sans délai.", ar: "تشنج قصبي، وذمة حنجرة، انخفاض ضغط = أدرنالين عضلي فوراً." },
      { fr: "Antihistaminiques/corticoïdes : uniquement après adrénaline.", ar: "مضادات الهيستامين/الكورتيكويدات: فقط بعد الأدرنالين." },
    ],
    trajectory: [
      {
        when: { fr: "Pas d'amélioration 5 min après adrénaline IM", ar: "لا تحسن بعد 5 دون من الأدرنالين العضلي" },
        do: [
          { fr: "Répéter la dose IM (jusqu'à 3–4 doses) + préparer le matériel pour voie IV.", ar: "كرر الجرعة العضلية (حتى 3–4) + جهّز الوريدي." },
          { fr: "Envisager l'adrénaline IV titrée (0,05–0,3 µg/kg/min) en milieu de réanimation.", ar: "قيّم أدرنالين وريدي معايراً في العناية المركزة." },
        ],
      },
      {
        when: { fr: "Survenue d'une complication : choc anaphylactique fulgurant", ar: "حدوث مضاعفة: صدمة أرجية خاطفة" },
        do: [
          { fr: "ACR → protocole ACR (adrenaline 1 mg IV).", ar: "توقف القلب ← بروتوكول الإنعاش (أدرنالين 1 ملغ وريدي)." },
          { fr: "Remplissage massif (jusqu'à 3–4 L) + ventilation assistée.", ar: "توسيع حجمي غزير (3–4 ل) + تهوية مساعدة." },
        ],
      },
      {
        when: { fr: "Choc biphasique (rechute tardive 1–36 h)", ar: "صدمة ثنائية الطور (معاودة متأخرة 1–36 س)" },
        do: [
          { fr: "Surveillance STRICte 12–24 h même si amélioration nette.", ar: "مراقبة صارمة 12–24 س حتى لو تحسن واضح." },
          { fr: "Nouvelle dose d'adrénaline IM immédiate dès réapparition des signes.", ar: "أدرنالين عضلي فوري عند عودة العلامات." },
        ],
      },
    ],
    medications: ["adrenaline"],
    calculators: ["dose-poids"],
    meta: { sources: ["Resuscitation Council UK 2021", "ERC 2021", "EAACI"], lastReviewed: "2026-08" },
  },
  {
    id: "avc",
    title: { fr: "AVC phase aiguë", ar: "الجلطة الدماغية الحادة" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "Conduite d'un AVC en phase aiguë : dépistage FAST, imagerie, reperfusion si délai le permet.", ar: "تدبير الجلطة الحادة: كشف FAST، تصوير، إعادة إرواء ضمن المهلة." },
    steps: [
      { title: { fr: "Reconnaître avec FAST : Face asymétrique, Arm qui faiblit, Speech (parole), Time (heure de début)", ar: "التعرّف بـFAST: وجه مائل، ذراع ضعيفة، كلام مشوش — وسجّل ساعة البداية" } },
      { title: { fr: "Glycémie capillaire — corriger l'hypoglycémie (simulateur d'AVC)", ar: "سكر شعري — صحّح نقص السكر (يقلّد الجلطة)" } },
      { title: { fr: "NIHSS + signes vitaux ; voie veineuse gros calibre", ar: "NIHSS + علامات حيوية؛ خط وريدي عريض" } },
      { title: { fr: "Scanner cérébral SANS injection en urgence (<25 min idéalement)", ar: "سكانر دماغي بلا حقن مستعجلاً (<25 د مثالياً)" }, detail: { fr: "Hémorragie → avis neurochirurgical + contrôle TA. Ischémie → voir reperfusion.", ar: "نزف → رأي جراحة الأعصاب + ضبط الضغط. إقفار → انظر إعادة التروية." } },
      { title: { fr: "AVC ischémique <4,5 h : discuter thrombolyse (altéplase 0,9 mg/kg, max 90 mg, 10 % bolus) selon critères d'inclusion/exclusion", ar: "إقفارية <4.5 س: ناقش حلّ الخثرة (ألتيبلاز 0.9 ملغ/كغ أقصى 90، 10% دفعة) حسب المعايير" } },
      { title: { fr: "Occlusion gros vaisseau : thrombectomie mécanique <6 h (jusqu'à 24 h selon imagerie) — orientation centre référent", ar: "انسداد وعاء كبير: استئصال خثرة آلي <6 س (إلى 24 س حسب التصوير) — توجيه لمركز مرجعي" } },
      { title: { fr: "TA : ne traiter que si >220/120 (ou >185/110 si thrombolyse prévue)", ar: "الضغط: عالج فقط إذا >220/120 (أو >185/110 إذا حلّ خثرة مزمع)" } },
      { title: { fr: "NPO + test de déglutition ; O2 seulement si SpO2 <94 % ; prévenir aspiration", ar: "صيام + اختبار بلع؛ أكسجين فقط إذا تشبع <94%؛ وقاية من الاستنشاق" } },
    ],
    keyPoints: [
      { fr: "« Time is brain » : chaque minute ≈ 1,9 million de neurones.", ar: "«الوقت = دماغ»: كل دقيقة ≈ 1.9 مليون عصبون." },
      { fr: "Noter l'heure exacte du début (ou dernière fois vu normal).", ar: "دوّن ساعة البداية بدقة (أو آخر مرة شوهد طبيعياً)." },
    ],
    trajectory: [
      {
        when: { fr: "Après thrombolyse : aggravation neurologique (NIHSS +4) ou céphalée brutale", ar: "بعد حل الخثرة: تفاقم عصبي (NIHSS +4) أو صداع مفاجئ" },
        do: [
          { fr: "Arrêter l'altéplase immédiatement ; scanner cérébral SANS injection en urgence (transformation hémorragique).", ar: "أوقف الألتيبلاز فوراً؛ سكانر دماغ بلا حقن عاجل (تحول نزفي)." },
          { fr: "Bilan hémostase complet ; si hémorragie intracrânienne → avis neurochirurgical immédiat.", ar: "فحص تخثر كامل؛ إذا نزف داخل القحف ← جراحة أعصاب فوراً." },
        ],
      },
      {
        when: { fr: "Complication précoce : HTIC (œdème cérébral) ou hydrocephalus", ar: "تعقيد مبكر: ارتفاع ضغط داخل القحف (وذمة دماغية)" },
        do: [
          { fr: "Position à 30°, osmothérapie (mannitol 0,5 g/kg) si pupille mydriatique unilatérale.", ar: "رفع الرأس 30°، مانيتول 0.5 غ/كغ إذا حدقة متوسعة." },
          { fr: "Transfert neurochirurgie si décompression envisageable.", ar: "نقل لجراحة أعصاب إذا التخفيف ممكن." },
        ],
      },
      {
        when: { fr: "Fièvre ou dégradation respiratoire à J+2/J+3", ar: "حمى أو تدهور تنفسي يوم 2–3" },
        do: [
          { fr: "Suspicion de pneumopathie d'inhalation → antibiothérapie + kinésithérapie respiratoire.", ar: "اشتباه التهاب رئوي استنشاقي ← مضادات + علاج تنفسي." },
          { fr: "Rechercher thrombose veineuse profonde (cannelle assise) → écho-doppler.", ar: "ابحث عن خثار وريدي ← دوبلر." },
        ],
      },
    ],
    medications: [],
    calculators: [],
    meta: { sources: ["AHA/ASA 2019 (mise à jour 2023)", "ESO Guidelines"], lastReviewed: "2026-08" },
  },
  {
    id: "polytraumatisme",
    title: { fr: "Polytraumatisme — XABCDE", ar: "متعدد الإصابات — XABCDE" },
    category: "traumatologie",
    severity: "critical",
    summary: { fr: "Victime de trauma multiple : ABCDE séquencé, contrôle des hémorragies, orientation rapide.", ar: "المصاب بإصابات متعددة: ABCDE متسلسل، إيقاف النزيف، توجيه سريع." },
    steps: [
      { title: { fr: "X (Catastrophic bleeding) : comprimer/tourniquet toute hémorragie externe massive d'abord", ar: "X (نزف كارثي): اكبس/ضع عاصبة لأي نزف خارجي هائل أولاً" } },
      { title: { fr: "A (Airway) : libérer + stabilisation manuelle du rachis cervical", ar: "A: حرّر المجرى + تثبيت يدوي للرقبة" } },
      { title: { fr: "B (Breathing) : FR, SpO2, ausculter ; pneumothorax compressif → exsufflation immédiate ; pansement 3 côtés si plaie soufflante", ar: "B: تواتر وتشبع وإصغاء؛ استرواح ضاغط → تفريغ إبرة فوري؛ ضماد ثلاثي الأضلع للجرح النافخ" } },
      { title: { fr: "C (Circulation) : 2 VVP gros calibre, bilan artère/fémur/bassin, remplissage prudent (hypotension contrôlée hors THM), chaud", ar: "C: خطان وريديان عريضان، افحص الحوض والفخذين، توسيع حذر (ضغط منخفض مسيطر خارج الرض الدماغي)، دفّئ" }, detail: { fr: "Acide tranexamique 1 g IV si <3 h du traumatisme + hémorragie.", ar: "حمض ترانيكساميك 1غ وريد إذا <3س من الإصابة + نزف." } },
      { title: { fr: "D (Disability) : GCS, pupilles, glycémie", ar: "D: غلاسكو، حدقتان، سكر" } },
      { title: { fr: "E (Exposure) : déshabiller, examiner complètement, éviter l'hypothermie (couverture)", ar: "E: جرّد وأكمل الفحص وتجنّب نقص الحرارة" } },
      { title: { fr: "Immobilisation plan dur/collet si traumatisme à haute énergie ; transport SAMU/SMUR", ar: "تثبيت بلوح صلب/طوق إن كانت إصابة عالية الطاقة؛ نقل بإسعاف طبّي" } },
    ],
    keyPoints: [
      { fr: "Contrôler l'hémorragie externe AVANT la voie aérienne (XABCDE ≠ ABCDE).", ar: "أوقف النزف الخارجي قبل المجرى الهوائي." },
      { fr: "Hémopéritoine instable : cible = bloc opératoire, pas réanimation prolongée sur place.", ar: "بطن دموية غير مستقرة: الهدف غرفة العمليات لا إطالة الإنعاش ميدانياً." },
    ],
    medications: [],
    calculators: ["gcs"],
    meta: { sources: ["ATLS 10e édition (ACS)", "ERC Trauma 2021"], lastReviewed: "2026-08" },
  },
  {
    id: "acr-pediatrique",
    title: { fr: "ACR de l'enfant (PALS)", ar: "توقف القلب لدى الطفل (PALS)" },
    category: "pediatrie",
    severity: "critical",
    summary: { fr: "Prise en charge de l'arrêt cardiaque de l'enfant : ventilation précoce et doses pondérales.", ar: "عناية توقف قلب الطفل: تهوية مبكرة وجرعات حسب الوزن." },
    steps: [
      { title: { fr: "Constater + alerter ; enfant : 5 insufflations initiales si asphyxie suspectée (cause #1 pédiatrique)", ar: "التأكد + النداء؛ عند الطفل: 5 نفخات ابتدائية إذا اشتُبه اختناق (السبب الأول)" } },
      { title: { fr: "Compressions : 100–120/min ; nourrisson = 2 pouces/2 doigts, enfant = 1–2 mains ; 1/3 du diamètre antéro-postérieur", ar: "ضغطات 100–120/د؛ رضيع: إبهامان/إصبعان، طفل: يد أو يدان؛ ثلث العمق الصدري" } },
      { title: { fr: "Ratio C:V = 15:2 (2 secouristes) — 30:2 si seul", ar: "النسبة ضغط:تهوية = 15:2 (منقذان) — 30:2 إذا وحيد" } },
      { title: { fr: "Rythme choquable : 4 J/kg biphasique (max 200 J) ; réanalyser après 2 min", ar: "إيقاع قابل للصدم: 4 جول/كغ ثنائي (أقصى 200)؛ أعد التحليل بعد دقيقتين" } },
      { title: { fr: "Adrénaline 10 µg/kg IV/IO (0,1 mL/kg de 1/10 000) toutes les 3–5 min", ar: "أدرنالين 10 مكغ/كغ وريد/نخاع (0.1 مل/كغ من 1/10000) كل 3–5 د" } },
      { title: { fr: "Amiodarone 5 mg/kg (TV/FV réfractaire) — traiter les causes réversibles (hypoxie fréquente)", ar: "أميودارون 5 ملغ/كغ إن استمرت — عالج الأسباب العكوسة (نقص الأكسجين شائع)" } },
      { title: { fr: "ROSC : mesurer/limiter O2 (SpO2 94–99 %), TA adaptée à l'âge, glycémie, T°", ar: "بعد الإنقاذ: شرط الأكسجين (تشبع 94–99%)، ضغط مناسب للعمر، سكر، حرارة" } },
    ],
    keyPoints: [
      { fr: "Cause pédiatrique la plus fréquente : hypoxie (respiratoire) — la ventilation compte autant que les compressions.", ar: "السبب الأشيع لدى الطفل: نقص الأكسجين — التهوية بقدر أهمية الضغطات." },
      { fr: "Poids estimé : (âge en ans × 2) + 8 kg.", ar: "الوزن التقديري: (العمر × 2) + 8 كغ." },
    ],
    medications: ["adrenaline", "amiodarone"],
    calculators: ["dose-poids", "chrono-rcp"],
    meta: { sources: ["AHA PALS 2020", "ERC Paediatric Life Support 2021"], lastReviewed: "2026-08" },
  },
];

export const protocols: Protocol[] = [...protocolsCore, ...protocolsP2, ...protocolsP3, ...protocolsP4, ...protocolsP5, ...protocolsP6];

export function getProtocol(id: string): Protocol | undefined {
  return protocols.find((p) => p.id === id);
}

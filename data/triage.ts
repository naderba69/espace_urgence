// Triage d'accueil / préhospitalier déterministe — 3 niveaux référentiels français (SFU/FRMU)
// + délais cibles (inspirés CIMU 2013 — manchester triage). Chaque cas : critères, gestes, protocoles liés.
import type { Localized } from "@/data/types";

export type TriagePriority = "P1" | "P2" | "P3";

export interface TriageCase {
  id: string;
  system: "cardio" | "neuro" | "resp" | "trauma" | "infectieux" | "digestif" | "obstetrique" | "pediatrie" | "psy" | "metabolique";
  title: Localized;
  priority: TriagePriority;
  colorLabel: Localized;           // rouge/orange/vert avec délai cible
  triggers: Localized[];           // éléments qui classent à ce niveau (rouge vif)
  immediate: Localized[];          // premiers gestes auxiliaires médicaux
  downgrade?: Localized;           // quand déclasser / réévaluer
  protocolIds: string[];
  source: string;
}

export const TRIAGE_SYSTEMS: Record<TriageCase["system"], Localized> = {
  cardio: { fr: "Cardiovasculaire", ar: "قلبي وعائي" },
  neuro: { fr: "Neurologique", ar: "عصبي" },
  resp: { fr: "Respiratoire", ar: "تنفسي" },
  trauma: { fr: "Traumatologie", ar: "رضوض" },
  infectieux: { fr: "Infectieux / septique", ar: "عدوى / إنتان" },
  digestif: { fr: "Digestif", ar: "هضمي" },
  obstetrique: { fr: "Obstétrique", ar: "توليد" },
  pediatrie: { fr: "Pédiatrie", ar: "أطفال" },
  psy: { fr: "Psychiatrie", ar: "نفسي" },
  metabolique: { fr: "Métabolique / toxique", ar: "استقلابي / سمّي" },
};

export const TRIAGE_CASES: TriageCase[] = [
  {
    id: "douleur-thoracique",
    system: "cardio",
    title: { fr: "Douleur thoracique / suspicion SCA", ar: "ألم صدري / اشتباه متلازمة تاجية" },
    priority: "P1",
    colorLabel: { fr: "ROUGE — ECG < 10 min, reperfusion immédiate si ST+", ar: "أحمر — تخطيط خلال 10 دقائق، إعادة تروية فورية إذا ST+" },
    triggers: [
      { fr: "Douleur constrictive rétrosternale irradiant bras/machoire, sueurs, nausées, syncope", ar: "ألم ضاغط خلف القص يشع للذراع/الفك، تعرق، غثيان، إغماء" },
      { fr: "Signes de gravité : PAS < 90, marbrures, sueurs profuses, OAP associé", ar: "علامات خطورة: انقباضي <90، بقع، تعرق غزير، وذمة رئة" },
      { fr: "ECG : ST+ (sus-décalage seuils V2-V3 : ≥ 2,5 mm H<40 ans, ≥ 2 mm H≥40, ≥ 1,5 mm F ; 1 mm ailleurs) ou dépression V1-V3 (postérieur)", ar: "تخطيط: ‏ST+ (عتبات V2-V3: ‎≥2.5 مم رجال <40، ‎≥2 مم رجال ≥40، ‎≥1.5 مم نساء؛ 1 مم في الباقي) أو نقصان V1-V3 (خلفي)" },
      { fr: "aVR : sus-décalage aVR avec dépression diffuse → lésion du tronc commun ou proximale de l'IVA", ar: "ارتفاع aVR مع نقصان منتشر → إصابة الجذع المشترك" },
    ],
    immediate: [
      { fr: "Scope + SpO2 + PA (deux bras) + GTT ; voie veineuse ; ECG 18 dérivations si IDM inférieur (V3R, V4R, V7-V9)", ar: "scope + SpO2 + ضغط بالذراعين + سكر؛ خط وريد؛ تخطيط 18 استمباراً إذا سفلي" },
      { fr: "Aspirine 250–300 mg + clopidogrel/ticagrélor selon protocole, if PAS > 110 : sublingual TNG", ar: "أسبيرين 250–300 ملغ + بلافيكس حسب البروتوكول؛ تحت اللسان إذا ضغط >110" },
      { fr: "Analgésie titration morphinique si douleur persistante", ar: "معايرة مورفينية للألم المستمر" },
    ],
    downgrade: { fr: "Si ECG parfaitement normal + score HEART ≤ 3 + symptôme atypique > 1 h et PAS stable : ORANGE avec contrôle ECG à H1 et toutes les 3–4 h.", ar: "إذا تخطيط طبيعي + HEART‎ ≤3 + ألم غير نمطي ومستقر: برتقالي مع تخطيط عند ساعة ثم كل 3–4 س." },
    protocolIds: ["sca-stemi", "oap"],
    source: "ESC 2023 ACS ; ERC 2021 ; RE.NAU PEC SCA",
  },
  {
    id: "avf-suspect",
    system: "neuro",
    title: { fr: "Déficit neurologique brutal / suspicion AVC", ar: "عجز عصبي مفاجئ / اشتباه جلطة" },
    priority: "P1",
    colorLabel: { fr: "ROUGE — thrombolyse/thrombectomie, fenêtre étroite (< 4 h 30)", ar: "أحمر — تحليل جلطة/استئصال خثرة، نافذة ضيقة <4.5 س" },
    triggers: [
      { fr: "FAST+ : face, bras, parole + hémiplégie, aphasie, hémianopsie, négligence, troubles de la vigilance", ar: "FAST+: وجه، ذراع، كلام + شلل نصفي، حبسة، عمى نصفياً، إهمال" },
      { fr: "Heure d'installation précise : < 4 h 30 = thrombolyse (Actilyse 0,9 mg/kg : 10 % bolus, 90 %/1 h)", ar: "وقت البداية بدقة: <4.5 س = التحليل (ألتيبلاز 0.9 ملغ/كغ)" },
      { fr: "SIH : céphalée brutale + vomissements + GCS bas = hématome — scanner < 25 min", ar: "ألم رأس مفاجئ + قيء + غلاسكو منخفض = ورم دموي" },
    ],
    immediate: [
      { fr: "Glycémie capillaire (hypoglycémie mimique) ; scope ; PA, FC, SpO2", ar: "قياس سكر قشعي (نقص السكر محاكٍ)؛ scope" },
      { fr: "Position latérale de sécurité si GCS < 8 ; strict à jeun ; 2 VVP", ar: "وضع جانبي إذا غلاسكو <8؛ صيام تام؛ خطان وريديان" },
      { fr: "Si PAS > 185/110 et thrombolyse prévue : nicardipine (Loxen®) 1 mg/h départ", ar: "إن ضغط >185/110 مع تحليل مرسوم: لوكسن 1 ملغ/س" },
    ],
    downgrade: { fr: "AIT (< 24 h avec récupération totale) = ORANGE avec consultation neurovasculaire < 24 h et bilan étiologique.", ar: "‏TIA: برتقالي بمراجعة عصبية وعائية <24 س." },
    protocolIds: ["avc"],
    source: "ESO 2021 ; RE.NAU téléthrombolyse",
  },
  {
    id: "arret-cardio",
    system: "cardio",
    title: { fr: "Arrêt cardiaque vu / massé", ar: "توقف قلبي شوهد/يُدلَّك" },
    priority: "P1",
    colorLabel: { fr: "ROUGE — RCP immédiate, pas de transport avant ROSC sauf exception", ar: "أحمر — إنعاش فوري، لا نقل قبل ROSC إلا استثناءً" },
    triggers: [
      { fr: "Inconscient + respiration anormale/haleinement + absence de pouls dans l'inconscient professionnel", ar: "فاقد وعي + تنفس غير طبيعي + بلا نبض" },
      { fr: "Rythme choquable (FV/TV sans pouls) → choc 150–200 J biphasique dès l'arrivée", ar: "نظم قابل للصدمة → صدمة 150–200 جول فوراً" },
    ],
    immediate: [
      { fr: "RCP 30:2 ou continue si sonde/ETI ; défibrillation précoce ; adrénaline 1 mg IV/IO toutes les 4 min (asystolie : dès que possible)", ar: "إنعاش 30:2؛ صدمة مبكرة؛ أدرنالين 1 ملغ كل 4 د (انقطاع نظم: باكراً)" },
      { fr: "Recherche : 5H5T (hypoxie, hypovolémie, hyper/hypoK, hypo/hyperthermie, tamponnade, toxiques, thrombose, pneumothorax, hypoglycémie...)", ar: "ابحث: 5H/5T (نقص أكسجة، نقص حجم، كالسيوم/بوتاسيوم، حرارة، تامور، سموم، خثرة، صدر منضغط...)" },
    ],
    downgrade: { fr: "ROSC : consignes post-AC — scope, ECG 12D, TA cible, température 32–36 °C, transport vers UCI/urgence vitale.", ar: "‏ROSC: scope، تخطيط 12، حرارة 32–36°، نقل للإنعاش." },
    protocolIds: ["acr-adulte", "acr-pediatrique"],
    source: "ERC 2021 ; AHA 2025",
  },
  {
    id: "detresse-resp",
    system: "resp",
    title: { fr: "Détresse respiratoire aiguë", ar: "ضائقة تنفسية حادة" },
    priority: "P1",
    colorLabel: { fr: "ROUGE — ventilation d'urgence probable", ar: "أحمر — تهوية استعجالية محتملة" },
    triggers: [
      { fr: "SpO2 < 90 % sous O2, FR > 30 ou < 8, épuisement, tirage, silence auscultatoire, cyanose", ar: "‏SpO2 <90% تحت أكسجين، FR >30 أو <8، إنهاك، صمت إصغائي، زرقة" },
      { fr: "Trouble de conscience associé (GCS < 12), signes de lutte", ar: "اضطراب وعي مرافق (غلاسكو <12)، علامات مقاومة" },
      { fr: "Stridor inspiratoire (corps étranger, œdème de Quincke) = obstruction haute", ar: "صرير استنشاقي (جسم غريب، وذمة كوينكي) = انسداد علوي" },
    ],
    immediate: [
      { fr: "O2 haut débit (15 L/min masque haute concentration) ; position assise", ar: "أكسجين عالي التدفق 15 ل/د؛ وضع جالس" },
      { fr: "Selon cause : salbutamol nébulisé (asthme), adrénaline IM (anaphylaxie), furosémide + dérivés nitrés (OAP)", ar: "حسب السبب: سالبوتامول رذاذي (ربو)، أدرينالين عضلي (تأق)، فوروسيميد + نترات (وذمة)" },
      { fr: "Préparer ETI si épuisement : chronomètre, matériel RSI, capnographe", ar: "حضّر تنبيباً إذا إنهاك: مؤقّت، أدوات RSI، كابنوغراف" },
    ],
    protocolIds: ["asthme-aigu-grave", "oap", "anaphylaxie", ],
    source: "SFAR/SRLF 2017 ; ERC 2021",
  },
  {
    id: "anaphylaxie",
    system: "infectieux",
    title: { fr: "Anaphylaxie", ar: "تأق / صدمة أرجية" },
    priority: "P1",
    colorLabel: { fr: "ROUGE — adrénaline IMMÉDIATE (IM)", ar: "أحمر — أدرينالين فوراً (عضلياً)" },
    triggers: [
      { fr: "Urticaire généralisé + (dyspnée OU hypotension OU troubles digestifs) après exposition à un allergène", ar: "شرى معمّم + (ضيق نفس أو هبوط ضغط أو أعراض هضمية) بعد التعرض" },
      { fr: "Œdème de la langue/larynx, stridor ; collapsus isolé après piqûre/vaccin/médicament", ar: "وذمة لسان/حنجرة، صرير؛ انهيار معزول بعد لسعة/لقاح/دواء" },
    ],
    immediate: [
      { fr: "Adrénaline IM face antéro-latérale de cuisse 0,01 mg/kg (max 0,5 mg) — renouvelable à 5 min si échec", ar: "أدرينالين عضلي بالفخذ 0.01 ملغ/كغ (أقصى 0.5) — أعدها بعد 5 د إن فشلت" },
      { fr: "Remplissage NaCl 20–30 mL/kg si hypotension ; demi-assis si dyspnée, TT si collapsus", ar: "امتلاء 20–30 مل/كغ إن انخفض الضغط؛ نصف جالس للتنفس، مستلق للانهيار" },
      { fr: "Suppression de l'allergène ; corticoïdes + antihistaminique (pas de retard à l'adrénaline)", ar: "أزل المؤرج؛ كورتيكويدات ومضاد هيستامين بعد الأدرينالين" },
    ],
    protocolIds: ["anaphylaxie"],
    source: "ERC 2021 ; EAACI 2021 ; RE.NAU anaphylaxie",
  },
  {
    id: "choc-sepsis",
    system: "infectieux",
    title: { fr: "Sepsis suspecté / hypotension", ar: "اشتباه إنتان / هبوط ضغط" },
    priority: "P1",
    colorLabel: { fr: "ROUGE — bundle 1 heure", ar: "أحمر — حزمة الساعة الأولى" },
    triggers: [
      { fr: "qSOFA ≥ 2 : FR ≥ 22, PAS ≤ 100, GCS < 15 + foyer infectieux suspecté", ar: "‏qSOFA‎ ≥2: FR‎ ≥22، انقباضي ≤100، غلاسكو <15 + بؤرة مشتبهة" },
      { fr: "Marbrures, temps de recoloration > 3 s, oligoanurie, lactate > 2", ar: "بقع، إعادة تلوّن >3 ث، قلة بيلة، لاكتات >2" },
    ],
    immediate: [
      { fr: "Remplissage NaCl 30 mL/kg si PAS < 90 ou lactate ≥ 4 (par bolus 500 mL/15 min, réévaluer)", ar: "امتلاء 30 مل/كغ إن انقباضي <90 أو لاكتات ≥4 (دفعات 500 مل، أعد التقييم)" },
      { fr: "Antibiotiques dans l'heure ; hémocultures avant si pas de retard ; biologie lactate", ar: "مضادات خلال الساعة؛ زراعات قبلها؛ لاكتات" },
      { fr: "Noradrénaline PSE si PAS < 65 après remplissage (avoie centrale si possible)", ar: "نورأدرينالين إن متوسط <65 بعد الامتلاء (خط مركزي)" },
    ],
    protocolIds: ["choc-septique"],
    source: "SSC 2021 ; RE.NAU choc septique",
  },
  {
    id: "convulsion",
    system: "neuro",
    title: { fr: "Convulsion active / état de mal", ar: "نوبة صرع نشطة / حالة صرعية" },
    priority: "P1",
    colorLabel: { fr: "ROUGE — benzo dans les 5 min, EEG non nécessaire au lit", ar: "أحمر — بنزوديازيبين خلال 5 دقائق" },
    triggers: [
      { fr: "Crise généralisée > 5 min OU répétées sans reprise de conscience = état de mal", ar: "نوبة معممة >5 د أو متكررة دون استعادة وعي = حالة صرعية" },
      { fr: "Post-critique prolongé avec signe de gravité (fièvre, traumatisme, toxique, grossesse)", ar: "تعقيب مطوّل مع علامة خطورة (حمى، رضح، سموم، حمل)" },
    ],
    immediate: [
      { fr: "PLS, protection, ne RIEN mettre dans la bouche ; glycémie (corriger si < 0,8 g/L : G30 100 mL)", ar: "وضع جانبي، حماية، لا شيء بالفم؛ سكر (صحّح إن <0.8 غ/ل بـج30 100 مل)" },
      { fr: "1re ligne : midazolam IM 10 mg ou diazépam IV 0,3 mg/kg/2 min (lorazépam IV 4 mg si disponible)", ar: "خط أول: ميدازولام عضلي 10 ملغ أو ديازيبام وريدياً (لورازيبام 4 ملغ إن وجد)" },
      { fr: "2e ligne si > 5 min : phénytoïne 20 mg/kg (Dilantin) ou levetiracetam 60 mg/kg", ar: "خط ثان: فينيتوين 20 ملغ/كغ أو ليفيتيراسيتام 60" },
      { fr: "Grossesse 2e/3e tiers = éclampsie → magnésium 4 g IVL 30 min", ar: "حمل: تسمم حمل → مغنيزيوم 4 غ خلال 30 د" },
    ],
    protocolIds: ["etat-mal-epileptique", "eclampsie"],
    source: "SFN 2022 ; RE.NAU EME",
  },
  {
    id: "trouble-conscience",
    system: "neuro",
    title: { fr: "Trouble de la conscience (GCS < 15)", ar: "اضطراب الوعي (غلاسكو <15)" },
    priority: "P2",
    colorLabel: { fr: "ORANGE — devient ROUGE si GCS ≤ 8 ou signe de localisation", ar: "برتقالي — يصير أحمر إذا غلاسكو ≤8" },
    triggers: [
      { fr: "GCS ≤ 8 → protection des VAS (IOT si pas de réflexe toux/glôle) = ROUGE", ar: "غلاسكو ≤8 → حماية المسالك = أحمر" },
      { fr: "Anisocorie, hémiplégie, postures de décérébration, vomissements en jet = engagement → ROUGE immédiat", ar: "لا تساوي حدقتين، شلل نصفي، وضعيات منزعة الدماغ = احتشاء فجأة أحمر" },
      { fr: "Hypoglycémie, toxique, trauma crânien associé", ar: "نقص سكر، سموم، رضح قحفي" },
    ],
    immediate: [
      { fr: "Glycémie + scope + SpO2 + TA ; pupilles ; recherche traumatique (cou, scalp)", ar: "سكر + scope + SpO2 + ضغط؛ حدقتان؛ رضح خفي" },
      { fr: "PLS si GCS < 12 ; protéger la nuque ; garder la tête surélevée 30°", ar: "وضع جانبي إن <12؛ رأس مرفوع 30°" },
      { fr: "Glucagon IM / G30 IV si hypoglycémie ; naloxone si myosis + RFR < 10", ar: "غلوكاغون/جلوكوز لنقص السكر؛ ناركان إن حدقة دبوس +FR<10" },
    ],
    protocolIds: ["traumatisme-cranien", "hypoglycemie", "syncope"],
    source: "ATLS 10 ; SFAR",
  },
  {
    id: "hemorragie-externe",
    system: "trauma",
    title: { fr: "Hémorragie externe / membre sectionné", ar: "نزيف خارجي / قطع طرف" },
    priority: "P1",
    colorLabel: { fr: "ROUGE — compression puis garrot → choc hémorragique", ar: "أحمر — ضغط فعصار → صدمة نزفية" },
    triggers: [
      { fr: "Saignement pulsatile ou non contrôlé par le point de compression", ar: "نزيف نابض أو غير مضبوط بالضغط" },
      { fr: "Signes de choc : PAS < 90, FC > 110, sueurs froides, marbrures", ar: "علامات صدمة: انقباضي <90، نبض >110، تعرق بارد" },
    ],
    immediate: [
      { fr: "Compression manuelle 10 min puis pansement compressif ; garrot si échec (noter l'heure)", ar: "ضغط يدوي 10 د ثم ضماد ضاغط؛ عصار عند الفشل (دوّن الوقت)" },
      { fr: "2 VVP gros calibre ; Ringer/NaCl 500 mL / 15 min selon PAS (cible 80 si trauma crânien non associé ; 100–110 si TC)", ar: "خطان واسعان؛ أملاح حسب الضغط (هدف 80؛ أو 100–110 إن رضح قحفي)" },
      { fr: "Acide tranéxamique 1 g IVL dans les 3 h du trauma", ar: "ترانيكساميك 1 غ خلال 3 س من الرضح" },
    ],
    protocolIds: ["polytraumatisme"],
    source: "ATLS 10 ; RE.NAU Exacyl",
  },
  {
    id: "polytrauma",
    system: "trauma",
    title: { fr: "Polytraumatisme (vitesses, chutes > 3 m, éjection)", ar: "متعدد الإصابات (سرعة، سقوط >3م)" },
    priority: "P1",
    colorLabel: { fr: "ROUGE — mécanisme violent = CAT précoce s'il y a critère de gravité", ar: "أحمر — آليّة عنيفة تقرّر مبكراً" },
    triggers: [
      { fr: "Critères Vittel de gravité ou mécanisme : éjection, décès d'un occupant, enfoncement, vitesses > 60 km/h", ar: "معايير Vittel أو الآليّة: قذف، وفاة رفيق، ارتطام، سرعة >60" },
      { fr: "Critères anatomiques : thorax instable, bassin instable, amputation, GCS < 13, PAS < 90, FR < 10 ou > 29", ar: "معايير تشريحية: صدر غير مستقر، حوض منزعزع، بتر، غلاسكو <13، ضغط <90" },
    ],
    immediate: [
      { fr: "Immobilisation complète : plan dur, collier, immo du bassin si instable", ar: "تثبيت كامل: لوح صلب، طوق، تثبيت حوض" },
      { fr: "Libération déglutition + aspiration ; O2 ; exsufflation si pneumothorax suffocant (45°)", ar: "تحرير تناول + شفط؛ أكسجين؛ إنفاغ إذا صدر منضغّ (45°)" },
      { fr: "Remplissage raisonné + tranéxamique (voir hémorragie)", ar: "امتلاء مدروس + ترانيكساميك" },
    ],
    protocolIds: ["polytraumatisme", "traumatisme-cranien"],
    source: "ATLS 10 ; Vittel",
  },
  {
    id: "trauma-cranien",
    system: "trauma",
    title: { fr: "Traumatisme crânien (perte de connaissance)", ar: "رضح قحفي (فقدان وعي)" },
    priority: "P2",
    colorLabel: { fr: "ORANGE — ROUGE si GCS ≤ 12 hémodynamiquement... signe de localisation, vomissements en jet, anisocorie", ar: "برتقالي — أحمر إذا غلاسكو ≤12 أو علامات بؤرة أو قيء نافث" },
    triggers: [
      { fr: "Perte de connaissance + GCS 13–14 stable sans anticoagulant : ORANGE scanner < 4 h", ar: "فقدان وعي + غلاسكو 13–14 بدون مميعات: برتقالي ماسح <4 س" },
      { fr: "Anticoagulants/AOD + même petite perte = scanner quasi systématique (ORANGE haut)", ar: "مميعات + فقدان بسيط = ماسح شبه وجوبي" },
      { fr: "GCS ≤ 8, convulsion, anisocorie → ROUGE (scanner + IOT immédiate)", ar: "‏≤8، نوبات، لا تساوي → أحمر (ماسح + تنبيب)" },
    ],
    immediate: [
      { fr: "Surveillance GCS horaire/15 min ; glycémie ; TA cible mm ≥ 90 ; position tête surélevée 30°", ar: "راقب غلاسكو؛ سكر؛ ضغط انقباضي ≥90؛ رأس 30°" },
      { fr: "Antiémétique ; pas d'antalgie morphinique seule sans scope", ar: "مضاد قيء؛ لا مورفين منفرد بلا مراقبة" },
      { fr: "Si signes d'engagement : mannitol 4 mL/kg /15 min en attendant la dérivation neurochirurgicale", ar: "عند الاحتشاء: مانيتول 4 مل/كغ/15 د بانتظار تحويل" },
    ],
    protocolIds: ["traumatisme-cranien"],
    source: "ATLS 10 ; BTF 4th ed",
  },
  {
    id: "brulure-grave",
    system: "trauma",
    title: { fr: "Brûlure grave / carbonisation", ar: "حرق خطير / تفحّم" },
    priority: "P1",
    colorLabel: { fr: "ROUGE si : face/mains, circulaire, SCB > 10 %, inhalation, enfant, électrique", ar: "أحمر إذا: وجه/يدان، دائري، مساحة >10%، استنشاق، طفل، كهربائي" },
    triggers: [
      { fr: "Brûlure faciale + sui carboné, toux, brûlure oropharyngée → intubation PRÉCOCE (l'œdème gagne)", ar: "حرق وجهي + سعال فحمي → تنبيب مبكر قبل الوذمة" },
      { fr: "SCB > 10 %, circulaire d'un membre, électrique haute tension", ar: "مساحة >10%، حرق دائري، كهربائي عالي" },
    ],
    immediate: [
      { fr: "Refroidir 15 min eau (18–22 °C) si < 3 h de la brûlure — SANS hypothermie", ar: "برّد بماء 15 د في 3 س — بلا انخفاض حرارة" },
      { fr: "Parkland : 4 mL × kg × % SCB / 24 h (la moitié dans les 8 premières h)", ar: "باركلاند: 4 مل × كغ × %/24س (نصفها بأول 8 س)" },
      { fr: "Pansement stérile sec / film alimentaire ; morphine titrée ; scope", ar: "ضماد جاف معقم؛ مورفين معاير؛ scope" },
    ],
    protocolIds: ["brulure-grave"],
    source: "ABA 2023 ; Monash/SRLF",
  },
  {
    id: "oap",
    system: "cardio",
    title: { fr: "Dyspnée + crépitants = OAP", ar: "ضيق نفس + قعقعات = وذمة رئة" },
    priority: "P1",
    colorLabel: { fr: "ROUGE si SpO2 < 90 % ; sinon ORANGE avec traitement rapide", ar: "أحمر إذا SpO2 <90%؛ وإلا برتقالي بعلاج سريع" },
    triggers: [
      { fr: "Chuintements bilatéraux, orthopnée, sueurs, expectoration rosée, PCJ élevée", ar: "صفير ثنائي، تعذر اضطجاع، بلغم وردي" },
      { fr: "PAS > 140 → nitrés ; PAS < 90 → inotrope (dobutamine) ; trouble du rythme rapide", ar: "انقباضي >140 نترات؛ <90 دوبوتامين؛ تسرع نظم" },
    ],
    immediate: [
      { fr: "Demi-assis jambes pendantes ; O2 cible SpO2 92–96 % (88–92 % si BPCO)", ar: "نصف جالس بساقين مدلتين؛ أكسجين هدف 92–96% (88–92 للانسدادي)" },
      { fr: "Furosémide 40–80 mg IVL si PAS > 110 et oligurie; TNG/immeuble nitré si PAS > 140", ar: "لازيليكس 40–80 ملغ بطيء إن انق. >110 وقلة بيلة؛ ترينيترين إن >140" },
      { fr: "VNI précoce si respiratoire persistante s'il y a indication", ar: "تنفس غير غازي باكر إذا استمرت الضائقة" },
    ],
    protocolIds: ["oap"],
    source: "ESC 2021 ; RE.NAU OAP",
  },
  {
    id: "hpp-accouchement",
    system: "obstetrique",
    title: { fr: "Accouchement imprévu / hémorragie du post-partum", ar: "ولادة مفاجئة / نزيف ما بعدها" },
    priority: "P1",
    colorLabel: { fr: "ROUGE si saignement actif ou < 34 SA ou présentation haute", ar: "أحمر إذا نزيف نشط أو <34 أسبوع أو مقدمة علوية" },
    triggers: [
      { fr: "Saignement rouge vif > 500 mL ou choc à la délivrance", ar: "نزيف أحمر >500 مل أو صدمة بعد الانفصال" },
      { fr: "Fièvre > 38 + saignement fétide (chorioamnio)", ar: "حمى + نزيف كريه" },
      { fr: "Convulsion au 3e trimestre = éclampsie jusqu'à preuve du contraire", ar: "نوبة بالثلث الثالث = تسمم حمل حتى إثبات العكس" },
    ],
    immediate: [
      { fr: "Massage utérin + ocytocine 5–10 UI IVL / PSE + compresses imbibées", ar: "تدليك رحمي + سينتوسينون 5–10 وحدات بطيء/مضخة + فوط" },
      { fr: "2 VVP + remplissage 20 mL/kg ; tranéxamique 1 g IVL et renouveler ×1 à 30 min", ar: "خطان واسعان + امتلاء 20 مل/كغ؛ ترانيكساميك 1 غ + تكرار" },
      { fr: "Éclampsie : magnésium 4 g IVL 30 min puis 1 g/h 24 h", ar: "تسمم: مغنيزيوم 4 غ/30 د ثم 1 غ/س لمدة 24 س" },
    ],
    protocolIds: ["hemorragie-post-partum", "eclampsie"],
    source: "RE.NAU ; WHO PPH 2017",
  },
  {
    id: "douleur-abdo",
    system: "digestif",
    title: { fr: "Douleur abdominale sévère", ar: "ألم بطني شديد" },
    priority: "P2",
    colorLabel: { fr: "ORANGE — ROUGE si défense, collapsus ou sujet âgé avec anévrisme", ar: "برتقالي — أحمر إذا دفاع، انهيار، أو مسن مع تمدد أبهر" },
    triggers: [
      { fr: "Défense/contracture = péritonite → ROUGE chirurgical", ar: "دفاع/تيبّس = التهاب صفاق → أحمر جراحي" },
      { fr: "Douleur brutale + syncope → AAA rompu (aORTE) ; grossesse + douleur = GEU", ar: "ألم مفاجئ + إغماء = تمدد منفجر؛ حمل + ألم = حمل خارج الرحم" },
      { fr: "Vomissements de sang/méléna fiévreux = hémorragie digestive", ar: "قيء دموي/براز قطراني = نزيف هضمي" },
    ],
    immediate: [
      { fr: "Scope, TA, glycémie ; 2 VVP si hypotension ; strict à jeun", ar: "مراقبة، ضغط، سكر؛ خطان إن انخفض؛ صيام" },
      { fr: "Morphine par titration (pas de retard au diagnostic en PEC urgente)", ar: "مورفين معاير (لا يؤخر التشخيص)" },
      { fr: "AAA suspecté : PAS cible 80–100, NE PAS remplir agressivement, chirurgie vasculaire", ar: "تمدد مشتبه: هدف 80–100؛ لا امتلاء عنيف؛ جراحة وعائية" },
    ],
    protocolIds: ["hemorragie-digestive-haute"],
    source: "WSES guidelines ; SFAR",
  },
  {
    id: "intoxication",
    system: "metabolique",
    title: { fr: "Intoxication suspectée (CO, OP, médicaments)", ar: "تسمم مشتبه (أول أكسيد الكربون...)" },
    priority: "P2",
    colorLabel: { fr: "ORANGE — ROUGE si trouble de conscience, arythmie ou OP", ar: "برتقالي — أحمر إذا وعي، نظم، أو فوسفوريات عضوية" },
    triggers: [
      { fr: "CO : céphalées d'un foyer + coma nausée — ROUGE avec O2 haut débit + hospitalisation à visée hyperbare", ar: "‏CO: صداع جماعي بالمأوى + إغماء = أحمر بأكسجين عالي" },
      { fr: "OP/parathion : fasciculations, myosis, sueurs, diarrhée — ROUGE : atropine 1-5 mg IV puis ×2 toutes 2-5 min jusqu'à séchage bronchique", ar: "فوسفوريات عضوية: رعاش، حدقة دبوس، تعرق — أحمر: أتروبين مضاعَفة حتى جفاف القصبات" },
    ],
    immediate: [
      { fr: "Sources CO : arrêter le chauffage, aérer, O2 100 %, ECG", ar: "‏CO: أوقف المصدر، تهوية، أكسجين 100%، تخطيط" },
      { fr: "Glycémie ; protected airway si GCS < 8 ; décontamination cutanée si contact", ar: "سكر؛ حماية مسالك إن <8؛ تطهير جلدي" },
      { fr: "Antidote : pralidoxime (Contrathion®) si OP, naloxone si opioïdes, digibind si digitaliques", ar: "الترياق: براليدوكسيم إن فوسفوري، ناركان إن أفيوني" },
    ],
    protocolIds: ["intoxication-co", "intoxication-organophosphores", "intoxication-paracetamol"],
    source: "RE.NAU ; CDC/WHO tox",
  },
  {
    id: "enfant-febrile",
    system: "pediatrie",
    title: { fr: "Enfant fébrile / détresse pédiatrique", ar: "طفل مصاب بالحمى / ضائقة أطفال" },
    priority: "P2",
    colorLabel: { fr: "ORANGE — ROUGE si purpura, stridor, déshydratation sévère, ou < 3 mois avec T° > 38", ar: "برتقالي — أحمر إذا بقع أرجوانية أو صرير أو تجفاف شديد أو <3 أشهر بحمى" },
    triggers: [
      { fr: "Purpura quelconque = méningococcémie → ROUGE immédiat, antibiotique (ceftriaxone) + transport rapide", ar: "أي بقعة أرجوانية = مكورات سحائية دموية → أحمر فوري + سيفترياكسون" },
      { fr: "Stridor + dysphagie + fièvre = épiglottite → ROUGE, pas d'examen de bouche forcé", ar: "صرير + عسر بلع + حمى = التهاب لسان المزمار → أحمر، بلا فحص فموي قسري" },
      { fr: "Déshydratation : plis cutanés, fontanelle creusée, GE → ROUGE avec Ringer 20 mL/kg/15 min ×2", ar: "تجفاف: ثنيات جلدية، يافوخة غائرة → أحمر مع Ringer 20 مل/كغ" },
    ],
    immediate: [
      { fr: "Paracétamol si bien toléré ; O2 si SpO2 < 94 %; ne PAS baisser la T° à tout prix si n'épuise pas", ar: "باراسيتامول إن تُحمّل جيداً؛ أكسجين إن SpO2<94%؛ لا تخفض الحرارة بأي ثمن" },
      { fr: "Signes de gravité vitale : FR, FC, TRP, tonus, interaction", ar: "علامات: FR، نبض، إعادة تلوّن، توتر، تفاعل" },
    ],
    protocolIds: ["deshydratation-enfant", "convulsion-febrile", "acr-pediatrique"],
    source: "AAP/SFP ; RE.NAU péd.",
  },
  {
    id: "agitation-aigue",
    system: "psy",
    title: { fr: "Agitation violente / danger immédiat", ar: "هياج عنيف / خطر فوري" },
    priority: "P1",
    colorLabel: { fr: "ROUGE — contention puis sédation ; ROUGE vital si hyperthermie mimétique", ar: "أحمر — تقييد ثم تهدئة؛ أحمر حيوي إذا حرارة مموّهة" },
    triggers: [
      { fr: "Agitation + hyperthermie + délire = delirium tremens/stimulant → REFROIDISSEMENT + diazépam", ar: "هياج + حرارة + هذيان = هذيان رعاشي → تبريد + ديازيبام" },
    ],
    immediate: [
      { fr: "Sécurité équipe d'abord : 5 personnes, préparation en arrière-plan", ar: "سلامة الفريق أولاً: 5 أشخاص، تحضير خلفي" },
      { fr: "Kétamine IM 3–5 mg/kg ou midazolam IM 5–10 mg (rapide, contrôle)", ar: "كيتامين عضلي 3–5 ملغ/كغ أو ميدازولام 5–10 (سريع مضبوط)" },
      { fr: "Post-sédation : scope continu, FR, SpO2, glycémie, glande sous costal", ar: "بعد التهدئة: scope مستمر، FR، SpO2، سكر، حرارة" },
    ],
    protocolIds: ["agitation-aigue"],
    source: "SFAR ; ATS / ACEP",
  },
  {
    id: "hypoglycemie",
    system: "metabolique",
    title: { fr: "Hypoglycémie (sueurs + trouble de conscience)", ar: "نقص سكر (تعرق + اضطراب وعي)" },
    priority: "P1",
    colorLabel: { fr: "ROUGE — correction rapide et rechercher la cause", ar: "أحمر — تصحيح سريع مع البحث عن السبب" },
    triggers: [
      { fr: "Gluid < 0,8 g/L + sueurs, tremblements, confusion ou coma ; diabétique sous insuline ou EO", ar: "‏<0.8 غ/ل + تعرق، رعاش، ارتباك؛ مريض سكري بإنسولين" },
    ],
    immediate: [
      { fr: "Si veineux : G30 30–100 mL IVL lent ; sinon glucagon IM 1 mg", ar: "وريد: جلوكوز 30% 30–100 مل بطيء؛ وإلا غلوكاغون عضلي 1 ملغ" },
      { fr: "Contrôle capillaire à 15 min ; orange doux/sucré si reprise de conscience ; rechercher cause (surdose insuline, ins rénale, infection, sevrage alcool)", ar: "سكر قشعي بعد 15 د؛ سكريات فموية بعد استعادة الوعي؛ ابحث عن السبب" },
      { fr: "Si sous sulfamides à LP : ré-hospitaliser surveillance glycémie 24–48 h", ar: "إن كان بسلفاميدات: إعادة إيصال بمراقبة 24–48 س" },
    ],
    protocolIds: ["hypoglycemie"],
    source: "ADA / SFE ; SFAR",
  },
  {
    id: "electrocution",
    system: "trauma",
    title: { fr: "Électrisation / foudroiement", ar: "صدمة كهربائية / صعقة برق" },
    priority: "P2",
    colorLabel: { fr: "ORANGE — ROUGE si haute tension, brûlure, syncope, grossesse ou ECG anormal", ar: "برتقالي — أحمر إذا توتر عالٍ، حرق، إغماء، حمل، أو تخطيط غير طبيعي" },
    triggers: [
      { fr: "Trouble de conscience, brûlure d'entrée/sortie, ou haute tension (> 1000 V) → ROUGE avec ECG impératif", ar: "فقدان وعي، نقاط دخول/خروج، أو توتر >1000 فولت → أحمر بتخطيط واجب" },
      { fr: "Foudroiement : arrêt possible par asystolie — RCP prolongée acceptable", ar: "صعقة برق: توقف ممكن — إنعاش مديد مقبول" },
    ],
    immediate: [
      { fr: "Couper la source avant tout contact ; scope + ECG (rechercher rythme)", ar: "اقطع المصدر قبل اللمس؛ scope + تخطيط" },
      { fr: "Immobilisation cervicale ; surveillance tardive (2 h) si haute tension", ar: "تثبيت عنقي؛ مراقبة متأخرة ساعتان إن توتر عالٍ" },
    ],
    protocolIds: ["electrocution"],
    source: "ATLS ; ILCOR",
  },
  {
    id: "dvp-membre",
    system: "cardio",
    title: { fr: "Membre froid douloureux = ischémie aiguë", ar: "طرف بارد مؤلم = إقفار حاد" },
    priority: "P2",
    colorLabel: { fr: "ORANGE — ROUGE si pas de pouls distal ou paralysie", ar: "برتقالي — أحمر إذا غياب نبض قاصٍ أو شلل" },
    triggers: [
      { fr: "PAllor, puis douleur, puis abolition du pouls distal = ROUGE chirurgie vasculaire < 6 h", ar: "شحوب ثم ألم ثم غياب نبض قاصٍ = أحمر جراحي <6 س" },
    ],
    immediate: [
      { fr: "Anticoaguler selon protocole ; membre REPOS + couvert, analyser pulsé distal", ar: "مميع حسب البروتوكول؛ راحة، دوبلر قاصٍ" },
      { fr: "Pas de contusion ni de débridage au préhospitalier", ar: "لا ضغط ولا تنظيف ميدانياً" },
    ],
    protocolIds: [],
    source: "ESVS 2020",
  },
  {
    id: "fièvre-néoplasie",
    system: "infectieux",
    title: { fr: "Fièvre isolée du sujet à risque", ar: "حمى معزولة عند خطر" },
    priority: "P3",
    colorLabel: { fr: "VERT — ROUGE si immunosuppression, antibiothérapie récente ou immunodépression", ar: "أخضر — أحمر إذا كبت مناعي أو مضادات حديثة" },
    triggers: [
      { fr: "Fièvre > 38,3 + frissons chez immunodéprimé, chimiothérapie < 15 j, splénectomie", ar: "حمى >38.3 بمناعي، علاج كيميائي <15 يوماً، استئصال طحال" },
    ],
    immediate: [
      { fr: "Scope, hémocultures, examen complet ; antibiotique si suspicion d'infection", ar: "مراقبة، زراعات، فحص شامل؛ مضاد عند الاشتباه" },
      { fr: "Broncho-aspiration des poumons pieds nus (bas débit) si vascularités basales", ar: "شفط طبي إذا أصوات قاعدية" },
    ],
    protocolIds: [],
    source: "IDSA neutropénie 2010",
  },
];

/** Ordre et libellé des priorités (délai cible indicatif). */
export const PRIORITY_META: Record<TriagePriority, { cls: string; label: Localized; delay: Localized }> = {
  P1: {
    cls: "bg-red-600",
    label: { fr: "P1 — VITAL", ar: "‏P1 — حيوي" },
    delay: { fr: "prise en charge immédiate (< 15 min)", ar: "تدخل فوري (<15 د)" },
  },
  P2: {
    cls: "bg-orange-500",
    label: { fr: "P2 — URGENT", ar: "‏P2 — عاجل" },
    delay: { fr: "délai cible < 60 min, réévaluation horaire", ar: "مهلة <60 د، إعادة تقييم كل ساعة" },
  },
  P3: {
    cls: "bg-teal-600",
    label: { fr: "P3 — PEUT ATTENDRE", ar: "‏P3 — بإمكانه الانتظار" },
    delay: { fr: "délai cible < 4 h", ar: "مهلة <4 س" },
  },
};

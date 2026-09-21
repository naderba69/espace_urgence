// v10.0-A1 — محرك الشكوى الرئيسية : عَرَض → أسئلة نعم/لا → بروتوكولات مرتبة بالخطورة.
// وسيلة توجيه شخصيّة — لا تحل محل الحكم السريري.
export type MotifQ = { id: string; fr: string; ar: string };
export type MotifOut = {
  href: string; fr: string; ar: string; sev: 1 | 2 | 3;
  cond: Record<string, boolean>; hintFr: string; hintAr: string;
};
export type Motif = { id: string; fr: string; ar: string; questions: MotifQ[]; outcomes: MotifOut[] };

export const MOTIFS: Motif[] = [
  {
    id: "thorax", fr: "Douleur thoracique", ar: "ألم صدري",
    questions: [
      { id: "effort", fr: "Douleur d'effort, soulagée au repos", ar: "ألم بالجهد يرتاح بالاستراحة" },
      { id: "tearing", fr: "Douleur déchirante / migratrice", ar: "ألم مُمزِّق/منتقل" },
      { id: "dysp", fr: "Dyspnée associée", ar: "زلة مرافقة" },
      { id: "allerg", fr: "Urticaire / angio-œdème", ar: "شرى/وذمة وعائية" },
      { id: "instab", fr: "Hypotension / choc", ar: "هبوط ضغط/صدمة" },
    ],
    outcomes: [
      { href: "/protocoles/sca-stemi", fr: "SCA (STEMI/NSTEMI)", ar: "متلازمة تاجية حادة", sev: 1, cond: { effort: true }, hintFr: "ECG < 10 min + aspirine", hintAr: "تخطيط < ١٠ د + أسبرين" },
      { href: "/protocoles/hta-urgence", fr: "Dissection aortique", ar: "تسلخ أبهري", sev: 1, cond: { tearing: true }, hintFr: "Contrôle TA aux deux bras", hintAr: "قياس الضغط بالذراعين" },
      { href: "/protocoles/embolie-pulmonaire", fr: "Embolie pulmonaire", ar: "انصمام رئوي", sev: 1, cond: { dysp: true }, hintFr: "Score Wells + ECG", hintAr: "سكور Wells + تخطيط" },
      { href: "/protocoles/anaphylaxie", fr: "Anaphylaxie", ar: "تأق", sev: 1, cond: { allerg: true }, hintFr: "Adrénaline IM sans attendre", hintAr: "أدرينالين عضلي فوراً" },
      { href: "/protocoles/sca-stemi", fr: "SCA à haut risque (instable)", ar: "متلازمة تاجية غير مستقرة", sev: 1, cond: { instab: true }, hintFr: "Choc + douleur = cathéter", hintAr: "صدمة + ألم = قسطرة" },
    ],
  },
  {
    id: "dyspnee", fr: "Dyspnée", ar: "زلة تنفسية",
    questions: [
      { id: "siff", fr: "Sibilants / bronchospasme", ar: "أزيز/تشنج قصبي" },
      { id: "orth", fr: "Orthopnée, aggravation allongée", ar: "ضيق بالاستلقاء" },
      { id: "oedem", fr: "Œdème unilatéral du mollet", ar: "ورم ساق وحيد الجانب" },
      { id: "fiev", fr: "Fièvre + toux", ar: "حمى + سعال" },
      { id: "allerg", fr: "Signes cutanés d'allergie", ar: "علامات جلدية تحسسية" },
    ],
    outcomes: [
      { href: "/protocoles/asthme-aigu-grave", fr: "Asthme aigu grave / BPCO", ar: "ربو حاد/انسداد مزمن", sev: 1, cond: { siff: true }, hintFr: "Bronchodilatateurs + O2 ciblé", hintAr: "موسعات قصبات + أكسجين موجّه" },
      { href: "/protocoles/oap", fr: "OAP / détresse pulmonaire", ar: "وذمة رئة حادة", sev: 1, cond: { orth: true }, hintFr: "Assis + CPAP si disponible", hintAr: "جلوس + CPAP إن توفر" },
      { href: "/protocoles/embolie-pulmonaire", fr: "Embolie pulmonaire", ar: "انصمام رئوي", sev: 1, cond: { oedem: true }, hintFr: "Penser TVP", hintAr: "فكّر بخثار وريدي عميق" },
      { href: "/protocoles/choc-septique", fr: "Pneumonie / sepsis", ar: "ذات رئة/إنتان", sev: 2, cond: { fiev: true }, hintFr: "Antibiotiques < 1 h", hintAr: "مضادات خلال ساعة" },
      { href: "/protocoles/anaphylaxie", fr: "Anaphylaxie", ar: "تأق", sev: 1, cond: { allerg: true }, hintFr: "Adrénaline IM", hintAr: "أدرينالين عضلي" },
    ],
  },
  {
    id: "conscience", fr: "Trouble de conscience", ar: "اضطراب وعي",
    questions: [
      { id: "glu", fr: "Glycémie basse ou non mesurée", ar: "سكر منخفض أو غير مقاس" },
      { id: "opi", fr: "Myosis + FR < 12 (opioïdes)", ar: "بؤبؤ مضيق + تنفس < ١٢" },
      { id: "focal", fr: "Déficit neurologique focal", ar: "عجز عصبي بؤري" },
      { id: "nuque", fr: "Fièvre + raideur de nuque", ar: "حمى + تصلب رقبة" },
      { id: "conv", fr: "Convulsions précédentes", ar: "اختلاجات سابقة" },
      { id: "trauma", fr: "Traumatisme crânien", ar: "رض رأس" },
    ],
    outcomes: [
      { href: "/protocoles/hypoglycemie", fr: "Hypoglycémie", ar: "نقص سكر الدم", sev: 1, cond: { glu: true }, hintFr: "Mesurer puis corriger", hintAr: "قِس ثم صحّح" },
      { href: "/calculateurs/opioides", fr: "Intoxication opioïde", ar: "تسمم أفيوني", sev: 1, cond: { opi: true }, hintFr: "Naloxone + ventilation", hintAr: "نالوكسون + تهوية" },
      { href: "/protocoles/avc", fr: "AVC", ar: "سكتة دماغية", sev: 1, cond: { focal: true }, hintFr: "Heure de début = décision", hintAr: "زمن البدء هو القرار" },
      { href: "/protocoles/choc-septique", fr: "Méningite", ar: "التهاب سحايا", sev: 1, cond: { nuque: true }, hintFr: "Antibiotiques sans attendre", hintAr: "مضادات فوراً دون انتظار" },
      { href: "/protocoles/etat-mal-epileptique", fr: "Post-ictal / état de mal", ar: "بعد نوبة/حالة صرعية", sev: 2, cond: { conv: true }, hintFr: "Si > 5 min : traiter", hintAr: "إن > ٥ د: عالج" },
      { href: "/protocoles/traumatisme-cranien", fr: "Traumatisme crânien", ar: "رض رأس", sev: 1, cond: { trauma: true }, hintFr: "Canadian CT", hintAr: "قاعدة الكندية للتصوير" },
    ],
  },
  {
    id: "abdo", fr: "Douleur abdominale", ar: "ألم بطني",
    questions: [
      { id: "mel", fr: "Méléna / hématémèse", ar: "براز أسود/إقياء دموي" },
      { id: "syn", fr: "Syncope + hypotension", ar: "إغماء + هبوط ضغط" },
      { id: "vomi", fr: "Vomissements + soif intense", ar: "إقياء + عطش شديد" },
      { id: "fiev", fr: "Fièvre", ar: "حمى" },
      { id: "fem", fr: "Femme en âge de procréer", ar: "امرأة بسن الإنجاب" },
    ],
    outcomes: [
      { href: "/protocoles/hemorragie-digestive-haute", fr: "Hémorragie digestive", ar: "نزف هضمي", sev: 1, cond: { mel: true }, hintFr: "2 voies veineuses larges", hintAr: "وريدان واسعان" },
      { href: "/protocoles/hemorragie-digestive-haute", fr: "Hémorragie + choc", ar: "نزف مع صدمة", sev: 1, cond: { syn: true }, hintFr: "Remplissage + transfusion", hintAr: "تعويض + نقل دم" },
      { href: "/protocoles/acidocetose-diabetique", fr: "Acidocétose diabétique", ar: "حماض كيتوني سكري", sev: 2, cond: { vomi: true }, hintFr: "Glycémie + cétonurie", hintAr: "سكر + كيتون بولي" },
      { href: "/protocoles/choc-septique", fr: "Sepsis abdominal", ar: "إنتان بطني", sev: 2, cond: { fiev: true }, hintFr: "Source + antibiotiques", hintAr: "المصدر + مضادات" },
      { href: "/obstetrique", fr: "GEU / urgence gynéco", ar: "حمل منتبذ/طارئة نسائية", sev: 1, cond: { fem: true }, hintFr: "Test de grossesse systématique", hintAr: "اختبار حمل منهجي" },
    ],
  },
  {
    id: "fievre", fr: "Fièvre", ar: "حمى",
    questions: [
      { id: "nuque", fr: "Raideur de nuque / céphalée", ar: "تصلب رقبة/صداع" },
      { id: "purp", fr: "Purpura / marbrures", ar: "فرفرية/تبقع" },
      { id: "choc", fr: "Hypotension / marbrures", ar: "هبوط ضغط/تبقع" },
      { id: "toux", fr: "Toux + point de côté", ar: "سعال + ألم جنبی" },
    ],
    outcomes: [
      { href: "/protocoles/choc-septique", fr: "Méningite", ar: "التهاب سحايا", sev: 1, cond: { nuque: true }, hintFr: "Ceftriaxone 2 g IV", hintAr: "سيفترياكسون ٢ غ وريدي" },
      { href: "/protocoles/choc-septique", fr: "Meningococcémie / purpura fulminans", ar: "فرفرية صاعقة", sev: 1, cond: { purp: true }, hintFr: "Urgence absolue", hintAr: "طوارئ قصوى" },
      { href: "/protocoles/choc-septique", fr: "Choc septique", ar: "صدمة إنتانية", sev: 1, cond: { choc: true }, hintFr: "Bundle 1 h", hintAr: "حزمة الساعة الأولى" },
      { href: "/protocoles/choc-septique", fr: "Pneumonie", ar: "ذات رئة", sev: 2, cond: { toux: true }, hintFr: "CRB-65 pour orienter", hintAr: "سكور CRB-65 للتوجيه" },
    ],
  },
  {
    id: "convul", fr: "Convulsions", ar: "اختلاجات",
    questions: [
      { id: "active", fr: "Crise en cours > 5 min", ar: "نوبة مستمرة > ٥ د" },
      { id: "glu", fr: "Glycémie basse", ar: "سكر منخفض" },
      { id: "fiev", fr: "Fièvre + raideur de nuque", ar: "حمى + تصلب رقبة" },
      { id: "trauma", fr: "Traumatisme crânien", ar: "رض رأس" },
    ],
    outcomes: [
      { href: "/protocoles/etat-mal-epileptique", fr: "État de mal épileptique", ar: "حالة صرعية", sev: 1, cond: { active: true }, hintFr: "Benzo puis 2e ligne", hintAr: "بنزوديازيبين ثم خط ثان" },
      { href: "/protocoles/hypoglycemie", fr: "Hypoglycémie", ar: "نقص سكر", sev: 1, cond: { glu: true }, hintFr: "Corriger d'abord", hintAr: "صحّح أولاً" },
      { href: "/protocoles/choc-septique", fr: "Méningo-encéphalite", ar: "التهاب سحايا/دماغ", sev: 1, cond: { fiev: true }, hintFr: "Antibiotiques + avis", hintAr: "مضادات + استشارة" },
      { href: "/protocoles/traumatisme-cranien", fr: "Traumatisme crânien", ar: "رض رأس", sev: 1, cond: { trauma: true }, hintFr: "Imagerie selon Canadian", hintAr: "تصوير حسب الكندية" },
    ],
  },
];

import type { CalculatorMeta } from "./types";

// Registre des calculateurs (Phase 1) — les pages vivent sous /calculateurs/<id>
export const calculators: CalculatorMeta[] = [
  {
    id: "dose-poids",
    title: { fr: "Dose selon le poids", ar: "الجرعة حسب الوزن" },
    description: { fr: "Calcule les doses mg/kg et volumes à injecter (pédiatrie & adulte).", ar: "يحسب جرعات ملغ/كغ والأحجام المحقونة (أطفال وكبار)." },
    href: "/calculateurs/dose-poids",
    icon: "Syringe",
    meta: { sources: ["AHA PALS 2020","RE.NAU Livret du médicament 2018"], lastReviewed: "2026-09" },
  },
  {
    id: "gcs",
    title: { fr: "Glasgow (GCS)", ar: "سكور غلاسكو" },
    description: { fr: "Échelle de coma interactive adulte + pédiatrique.", ar: "سلّم الغيبوبة التفاعلي للكبار والأطفال." },
    href: "/calculateurs/gcs",
    icon: "Brain",
    meta: { sources: ["Teasdale & Jennett 1974 (GCS)","ATLS 10e éd."], lastReviewed: "2026-09" },
  },
  {
    id: "debit-perfusion",
    title: { fr: "Débit de perfusion", ar: "تدفّق الحقن الوريدي" },
    description: { fr: "gouttes/min et mL/h à partir du volume et de la durée.", ar: "قطرات/د و مل/س من الحجم والمدة." },
    href: "/calculateurs/debit-perfusion",
    icon: "Droplets",
    meta: { sources: ["RE.NAU Livret du médicament 2018"], lastReviewed: "2026-09" },
  },
  {
    id: "chrono-rcp",
    title: { fr: "Chronomètre RCP", ar: "مؤقّت الإنعاش" },
    description: { fr: "Cycles de 2 min, métronome 110/min, rappel adrénaline, alarme sonore.", ar: "دورات دقيقتين، ميترونوم 110/د، تذكير أدرنالين، منبه صوتي." },
    href: "/calculateurs/chrono-rcp",
    icon: "Timer",
    meta: { sources: ["AHA ACLS 2025","ERC 2021"], lastReviewed: "2026-09" },
  },
  {
    id: "brulures",
    title: { fr: "Brûlures (règle des 9 + Parkland)", ar: "الحروق (قاعدة 9 + باركلاند)" },
    description: { fr: "Surface brûlée SVG cliquable, volume de remplissage Parkland adulte/enfant.", ar: "مساحة الحرق برسم تفاعلي، حجم تعويض باركلاند للكبار والأطفال." },
    href: "/calculateurs/brulures",
    icon: "Flame",
    meta: { sources: ["Wallace (règle des 9) / Lund-Browder","EBA Practice Guidelines 2019"], lastReviewed: "2026-09" },
  },
  {
    id: "amines",
    title: { fr: "Amines (µg/kg/min)", ar: "الأمينات (مكغ/كغ/د)" },
    description: { fr: "Débit de seringue électrique (mL/h) selon poids, concentration, dose cible.", ar: "تدفق المضخة (مل/س) حسب الوزن والتركيز والجرعة المستهدفة." },
    href: "/calculateurs/amines",
    icon: "Gauge",
    meta: { sources: ["RE.NAU Livret du médicament 2018"], lastReviewed: "2026-09" },
  },
  {
    id: "dose-anaphylaxie",
    title: { fr: "Dose adrénaline anaphylaxie", ar: "جرعة أدرنالين الأنفيلاكسي" },
    description: { fr: "Dose IM par tranche d'âge (RCUK/ERC) — adulte et enfant.", ar: "الجرعة العضلية حسب العمر (RCUK/ERC) — كبار وأطفال." },
    href: "/calculateurs/dose-anaphylaxie",
    icon: "AlertTriangle",
    meta: { sources: ["RCUK Anaphylaxis 2021","AHA PALS 2020"], lastReviewed: "2026-09" },
  },
  {
    id: "poids-pediatrique",
    title: { fr: "Poids pédiatrique estimé", ar: "الوزن التقديري للطفل" },
    description: { fr: "Estimation selon l'âge (formule (âge×2)+8) + constantes associées.", ar: "تقدير حسب العمر (عمر×2 + 8) مع الثوابت المرتبطة." },
    href: "/calculateurs/poids-pediatrique",
    icon: "Baby",
    meta: { sources: ["Luscombe & Owens 2007 (formule APLS)","AHA PALS 2020"], lastReviewed: "2026-09" },
  },
  {
    id: "convertisseur",
    title: { fr: "Convertisseur d'unités", ar: "محوّل الوحدات" },
    description: { fr: "mg ↔ µg, kg ↔ lb, °C ↔ °F, mmHg ↔ kPa.", ar: "ملغ↔مكغ، كغ↔رطل، مئوية↔فهرنهايت، ملم زئبق↔كيلوباسكال." },
    href: "/calculateurs/convertisseur",
    icon: "Scale",
    meta: { sources: ["Système international d’unités"], lastReviewed: "2026-09" },
  },
  {
    id: "ventilateur",
    title: { fr: "Réglages ventilatoires", ar: "إعدادات التهوية" },
    description: { fr: "Volume courant 6–8 mL/kg (poids idéal) et fréquence indicative selon âge.", ar: "حجم تيار 6–8 مل/كغ (الوزن المثالي) وتواتر إرشادي حسب العمر." },
    href: "/calculateurs/ventilateur",
    icon: "Wind",
    meta: { sources: ["ARDSnet (Vt 6–8 mL/kg PIT)","SRLF 2021"], lastReviewed: "2026-09" },
  },
  {
    id: "curb65",
    title: { fr: "CURB-65 (pneumonie)", ar: "CURB-65 (التهاب رئوي)" },
    description: { fr: "Score de gravité de pneumonie communautaire : confusion, urée, FR, TA, âge.", ar: "سكور شدة الالتهاب الرئوي الجماعي." },
    href: "/calculateurs/curb65",
    icon: "Stethoscope",
    meta: { sources: ["Lim et al. 2003 (CURB-65)","BTS Community Pneumonia"], lastReviewed: "2026-09" },
  },
  {
    id: "wells-ep",
    title: { fr: "Wells (embolie pulmonaire)", ar: "ويلز (الصمة الرئوية)" },
    description: { fr: "Probabilité clinique d'EP : 7 critères, score à 2 niveaux.", ar: "احتمال سريري للصمة الرئوية: 7 معايير بمستويين." },
    href: "/calculateurs/wells-ep",
    icon: "Activity",
    meta: { sources: ["Wells et al. 2000","ESC EP 2019"], lastReviewed: "2026-09" },
  },
  {
    id: "nihss",
    title: { fr: "NIHSS (AVC)", ar: "NIHSS (الجلطة)" },
    description: { fr: "Échelle neurologique complète de l'AVC : 15 items, 0–42.", ar: "المقياس العصبي الكامل للجلطة: 15 بنداً، 0–42." },
    href: "/calculateurs/nihss",
    icon: "ClipboardList",
    meta: { sources: ["NINDS (NIHSS)","ESO/AHA AVC ischémique 2021"], lastReviewed: "2026-09" },
  },
  {
    id: "has-bled",
    title: { fr: "HAS-BLED", ar: "HAS-BLED" },
    description: { fr: "Risque hémorragique sous anticoagulation (FA) — 9 critères.", ar: "خطر النزف تحت مضادات التخثر — 9 معايير." },
    href: "/calculateurs/has-bled",
    icon: "Gauge",
    meta: { sources: ["Pisters et al. 2010 (HAS-BLED)","ESC FA 2020"], lastReviewed: "2026-09" },
  },
  {
    id: "heparine",
    title: { fr: "Héparine IV", ar: "هيبارين وريدي" },
    description: { fr: "Bolus U/kg + débit initial en mL/h selon la concentration.", ar: "دفعة وحدة/كغ + تدفق ابتدائي مل/س حسب التركيز." },
    href: "/calculateurs/heparine",
    icon: "Droplets",
    meta: { sources: ["RE.NAU Livret du médicament 2018","CHEST Antithrombotic 2012"], lastReviewed: "2026-09" },
  },
  {
    id: "sodium",
    title: { fr: "Correction du sodium", ar: "تصحيح الصوديوم" },
    description: { fr: "Adrogué-Madias : ΔNa du litre infusé + débit max sûr (ODS).", ar: "أدروغيه-مادياس: ΔNa للتر + أقصى تدفق آمن." },
    href: "/calculateurs/sodium",
    icon: "Droplets",
    meta: { sources: ["Adrogué-Madias (correction Na)","ERA/EAHyponatremia 2014"], lastReviewed: "2026-09" },
  },
  {
    id: "insuline",
    title: { fr: "ACD — insuline IV", ar: "ACD — إنسولين وريدي" },
    description: { fr: "0,1 U/kg/h avec conduite guidée par le potassium (blocage si K < 3,3).", ar: "0.1 وحدة/كغ/س مع توجيه بحسب البوتاسيوم (توقّف إذا K < 3.3)." },
    href: "/calculateurs/insuline",
    icon: "Syringe",
    meta: { sources: ["ADA Standards of Care 2025","RE.NAU Livret du médicament 2018"], lastReviewed: "2026-09" },
  },
  {
    id: "perfusions",
    title: { fr: "Vitesses PSE — paliers de débit", ar: "سرعات المضخة — تدفقات جاهزة" },
    description: { fr: "Tableau dose→mL/h pour les préparations standard (NA, adrénaline, héparine, insuline, trinitrine…).", ar: "جدول جرعة←مل/س للتحضيرات القياسية (نورأدرينالين، أدرينالين، هيبارين، إنسولين...) ." },
    href: "/calculateurs/perfusions",
    icon: "Droplets",
    meta: { sources: ["RE.NAU Livret du médicament 2018"], lastReviewed: "2026-09" },
  },
  {
    id: "stemi",
    title: { fr: "Localisation du ST+ (STEMI)", ar: "تحديد موضع ST+ (الاحتشاد)" },
    description: { fr: "Dérivations élevées → territoire, artère coupable, conduite (18 dérivations, reperfusion).", ar: "الاستمبارات المرتفعة ← الموضع، الشريان، المسلك (18 استمباراً، إعادة تروية)." },
    href: "/calculateurs/stemi",
    icon: "HeartPulse",
    meta: { sources: ["ESC STEMI 2023","AHA/ACC NSTE-ACS 2025"], lastReviewed: "2026-09" },
  },
];

// Registre GCS (adulte + pédiatrique pré-verbal) pour la page calculateur
export interface GcsOption { value: number; label: { fr: string; ar: string } }
export interface GcsSection { id: string; title: { fr: string; ar: string }; options: GcsOption[] }

export const gcsAdult: GcsSection[] = [
  {
    id: "eyes",
    title: { fr: "Ouverture des yeux", ar: "فتح العينين" },
    options: [
      { value: 4, label: { fr: "Spontanée", ar: "تلقائي" } },
      { value: 3, label: { fr: "À la demande verbale", ar: "للنداء" } },
      { value: 2, label: { fr: "À la douleur", ar: "للألم" } },
      { value: 1, label: { fr: "Aucune", ar: "لا شيء" } },
    ],
  },
  {
    id: "verbal",
    title: { fr: "Réponse verbale", ar: "الاستجابة اللفظية" },
    options: [
      { value: 5, label: { fr: "Orientée", ar: "موجَّه" } },
      { value: 4, label: { fr: "Confuse", ar: "مشوَّش" } },
      { value: 3, label: { fr: "Mots inappropriés", ar: "كلمات غير مناسبة" } },
      { value: 2, label: { fr: "Sons incompréhensibles", ar: "أصوات غير مفهومة" } },
      { value: 1, label: { fr: "Aucune", ar: "لا شيء" } },
    ],
  },
  {
    id: "motor",
    title: { fr: "Réponse motrice", ar: "الاستجابة الحركية" },
    options: [
      { value: 6, label: { fr: "Obéit aux ordres", ar: "يطيع الأوامر" } },
      { value: 5, label: { fr: "Localise la douleur", ar: "يحدد الألم" } },
      { value: 4, label: { fr: "Évitement", ar: "سحب/تجنّب" } },
      { value: 3, label: { fr: "Flexion anormale (décortication)", ar: "ثني غير طبيعي" } },
      { value: 2, label: { fr: "Extension (décérébration)", ar: "بسط (تجفية)" } },
      { value: 1, label: { fr: "Aucune", ar: "لا شيء" } },
    ],
  },
];

// Version pédiatrique (pré-verbale) — verbal & yeux identiques, moteur ≈ identique, verbal adapté
export const gcsPediatric: GcsSection[] = [
  gcsAdult[0],
  {
    id: "verbal",
    title: { fr: "Réponse verbale (pré-verbale)", ar: "الاستجابة اللفظية (ما قبل الكلام)" },
    options: [
      { value: 5, label: { fr: "Babille, suit, interactif", ar: "مناغاة وتفاعل" } },
      { value: 4, label: { fr: "Pleure consolable, irritabilité", ar: "بكاء قابل للتهدئة" } },
      { value: 3, label: { fr: "Cris à la douleur, inconsolable", ar: "صراخ للألم لا يُهدأ" } },
      { value: 2, label: { fr: "Gémissements", ar: "أنين" } },
      { value: 1, label: { fr: "Aucune", ar: "لا شيء" } },
    ],
  },
  gcsAdult[2],
];

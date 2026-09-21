// ⚕️ تكييف المضادات الحيوية مع الوظيفة الكلوية — بيانات مستخرجة حرفيًا من الجدول المرجعي.
// Antibiotiques et insuffisance rénale — données extraites à l'identique du tableau de référence :
//   « Adaptation des antibiotiques à la fonction rénale », OMEDIT Pays de la Loire, V2.3 (avril 2026),
//   données sources RCP / GPR (SPILF–SFPT–CA-SFM juin 2023) / ePOPI, arrêtées au 10/01/2024.
//
// ⚠️ Adultes NON dialysés, selon le DFG (mL/min/1,73 m²). Le contenu français est reproduit mot pour mot
//    (jamais paraphrasé : une dose se recopie, elle ne se traduit pas) ; l'interface est bilingue.
//    ⚠️ À faire valider par un médecin/pharmacien tunisien avant usage clinique.
//
// طريقة الاستخراج: قُرئت حدود الخلايا المتجهية من ملف PDF ثم رُتّبت القيم في أعمدة المراحل الخمس،
// ثم راجعنا الصفحات الاثنتي عشرة بصريًا سطرًا سطرًا. البنود التي كان فيها الجدول المصدر غير محاذٍ
// هندسيًا صُحّحت يدويًا (انظر tools/gen_atb_ts.py) ولا تحمل أي قيمة مُخمَّنة.

export type AtbStageId = "normorenal" | "legere" | "moderee" | "severe" | "terminale";

export interface AtbRenalStage {
  id: AtbStageId;
  fr: string;
  ar: string;
  dgf: string;        // borne de DFG affichée dans l'en-tête du tableau
}

/** المراحل الخمس — الترتيب هو نفسه ترتيب القيم في كل سطر (d[0] … d[4]). */
export const ATB_RENAL_STAGES: AtbRenalStage[] = [
  { id: "normorenal", fr: "Normorénal", ar: "وظيفة كلوية طبيعية", dgf: "≥ 90" },
  { id: "legere", fr: "IRC légère", ar: "قصور كلوي خفيف", dgf: "89 → 60" },
  { id: "moderee", fr: "IRC modérée", ar: "قصور كلوي متوسط", dgf: "59 → 30" },
  { id: "severe", fr: "IRC sévère", ar: "قصور كلوي شديد", dgf: "30 → 15" },
  { id: "terminale", fr: "IRC terminale", ar: "قصور كلوي نهائي", dgf: "< 15" },
];

export interface AtbRenalSection { id: string; fr: string; ar: string }

export const ATB_RENAL_SECTIONS: AtbRenalSection[] = [
  { id: "penicillines", fr: "Pénicillines +/- inhibiteurs de bêta-lactamases", ar: "البنسلينات ± مثبّطات البيتا-لاكتاماز" },
  { id: "monobactames", fr: "Monobactames", ar: "المونوباكتامات" },
  { id: "cephalosporines", fr: "Céphalosporines", ar: "السيفالوسبورينات" },
  { id: "carbapenemes", fr: "Carbapénèmes", ar: "الكاربابينيمات" },
  { id: "aminosides", fr: "Aminosides", ar: "الأمينوغليكوزيدات" },
  { id: "fluoroquinolones", fr: "Fluoroquinolones", ar: "الكينولونات الفلورية" },
  { id: "glycopeptides", fr: "Glycopeptides", ar: "الغليكوببتيدات" },
  { id: "imidazoles", fr: "Imidazolés", ar: "الإيميدازولات" },
  { id: "macrolides", fr: "Macrolides, lincosamides, streptogramines", ar: "الماكروليدات واللينكوزاميدات والستربتوغرامينات" },
  { id: "sulfamides", fr: "Sulfamides", ar: "السلفاميدات" },
  { id: "tetracyclines", fr: "Tétracyclines", ar: "التتراسيكلينات" },
  { id: "autres", fr: "Autres", ar: "أخرى" },
  { id: "antituberculeux", fr: "Antituberculeux", ar: "مضادات السل" },
];

export interface AtbRenalLine {
  /** "dose" = schéma posologique ; "info" = consigne/limite valable pour tous les stades. */
  kind: "dose" | "info";
  /** القيم بترتيب ATB_RENAL_STAGES — d[0] للمرحلة الطبيعية … d[4] للمرحلة النهائية. */
  d: [string, string, string, string, string];
}

export interface AtbRenalRow {
  id: string;
  fr: string;
  ar: string;
  section: string;
  /** رقم الصفحة في الملف المصدر (للتحقق اليدوي السريع). */
  page: number;
  lines: AtbRenalLine[];
  notes: { fr: string; ar: string }[];
}

/** 93 سطرًا: كل تركيبة (جزيئة × طريق إعطاء) كما في الجدول المصدر. */
export const ATB_RENAL_ROWS: AtbRenalRow[] = [
  {
    id: "amoxicilline-po",
    fr: "Amoxicilline PO",
    ar: "أموكسيسيلين فموي",
    section: "penicillines",
    page: 1,
    lines: [
      { kind: "dose", d: ["1 g/8h", "1 g/8h", "1 g/8h", "DC de 1 g puis 500 mg/8h", "DC de 1 g puis 750 mg/24h"] },
      { kind: "dose", d: ["1 g/12h", "1 g/12h", "1 g/12h", "DC de 1 g puis 500 mg/12h", "DC de 1 g puis 500 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "amoxicilline-iv",
    fr: "Amoxicilline IV",
    ar: "أموكسيسيلين وريدي",
    section: "penicillines",
    page: 1,
    lines: [
      { kind: "dose", d: ["100 mg/kg/24h en 4 injections", "100 mg/kg/24h en 4 injections", "100 mg/kg/24h en 4 injections", "50 mg/kg/24h", "25 mg/kg/24h"] },
      { kind: "dose", d: ["200 mg/kg/24h en 6 injections", "200 mg/kg/24h en 6 injections", "200 mg/kg/24h en 6 injections", "100 mg/kg/24h", "50 mg/kg/24h"] },
    ],
    notes: [],
  },
  {
    id: "amoxicilline-acide-clavulanique-po",
    fr: "Amoxicilline + acide clavulanique PO",
    ar: "أموكسيسيلين + حمض الكلافولانيك فموي",
    section: "penicillines",
    page: 1,
    lines: [
      { kind: "dose", d: ["1 g/8h", "1 g/8h", "1 g/8h", "DC de 1 g puis 500 mg/8h", "DC de 1 g puis 750 mg/24h"] },
    ],
    notes: [
      { fr: "Posologies exprimées en g d'amoxicilline", ar: "الجرعات معبَّر عنها بغرامات الأموكسيسيلين" },
    ],
  },
  {
    id: "amoxicilline-acide-clavulanique-iv",
    fr: "Amoxicilline + acide clavulanique IV",
    ar: "أموكسيسيلين + حمض الكلافولانيك وريدي",
    section: "penicillines",
    page: 1,
    lines: [
      { kind: "dose", d: ["1 g/8h", "1 g/8h", "1 g/8h", "DC de 1 g puis 500 mg/8h", "DC de 1 g puis 750 mg/24h"] },
      { kind: "dose", d: ["2 g/8h", "2 g/8h", "2 g/8h", "3 g/24h", "1,5 g/24h"] },
    ],
    notes: [
      { fr: "Posologies exprimées en g d'amoxicilline ; /!\\ acide clavulanique : dose max 200 mg/injection et 1200 mg/24h", ar: "الجرعات معبَّر عنها بغرامات الأموكسيسيلين؛ تنبيه: حدّ حمض الكلافولانيك 200 مغ/حقنة و1200 مغ/24 سا" },
    ],
  },
  {
    id: "ampicilline-sulbactam-iv",
    fr: "Ampicilline + Sulbactam IV",
    ar: "أمبيسيلين + سولباكتام وريدي",
    section: "penicillines",
    page: 2,
    lines: [
      { kind: "dose", d: ["Posologie usuelle : 1 à 2 g /6 à 12h", "Posologie usuelle : 1 à 2 g /6 à 12h", "Posologie usuelle : 1 à 2 g /6 à 12h", "DC de 1 g puis 500 mg/12h", "DC de 1 g puis 250 mg/12h"] },
      { kind: "dose", d: ["Infection à Acinetobacter spp : 3 g /6 à 8h", "Infection à Acinetobacter spp : 3 g /6 à 8h", "Infection à Acinetobacter spp : 3 g /6 à 8h", "3 g/12h", "3 g/24h"] },
    ],
    notes: [
      { fr: "Posologies exprimées en g d'ampicilline", ar: "الجرعات معبَّر عنها بغرامات الأمبيسيلين" },
    ],
  },
  {
    id: "ampicilline-sulbactam-im",
    fr: "Ampicilline + Sulbactam IM",
    ar: "أمبيسيلين + سولباكتام عضلي",
    section: "penicillines",
    page: 2,
    lines: [
      { kind: "dose", d: ["1 g/12h", "1 g/12h", "1 g/12h", "500 mg/12h", "250 mg/12h"] },
    ],
    notes: [
      { fr: "Posologies exprimées en g d'ampicilline", ar: "الجرعات معبَّر عنها بغرامات الأمبيسيلين" },
    ],
  },
  {
    id: "benzathine-benzylpenicilline-im",
    fr: "Benzathine benzylpenicilline IM",
    ar: "بنزاثين بنزيل بنسلين عضلي",
    section: "penicillines",
    page: 2,
    lines: [
      { kind: "dose", d: ["2,4 MUI tous les 8 jours", "2,4 MUI tous les 8 jours", "1,8 MUI tous les 8 jours", "1,8 MUI tous les 8 jours", "Aucune donnée"] },
      { kind: "dose", d: ["1,2 MUI toutes les 3 à 4 semaines", "1,2 MUI toutes les 3 à 4 semaines", "0,9 MUI toutes les 3 à 4 semaines", "0,9 MUI toutes les 3 à 4 semaines", "Aucune donnée"] },
    ],
    notes: [],
  },
  {
    id: "benzylpenicilline-sodique-im-ou-iv",
    fr: "Benzylpenicilline sodique IM ou IV",
    ar: "بنزيل بنسلين صودي عضلي أو وريدي",
    section: "penicillines",
    page: 2,
    lines: [
      { kind: "dose", d: ["12 à 24 MUI/j en 6 injections ou en perfusion continue", "3 MUI /4h", "2 MUI/4h", "1 MUI/4h", "0,5 MUI/6h"] },
    ],
    notes: [],
  },
  {
    id: "cloxacilline-po",
    fr: "Cloxacilline PO",
    ar: "كلوكساسيلين فموي",
    section: "penicillines",
    page: 2,
    lines: [
      { kind: "dose", d: ["50 mg/kg/24h en 3 prises (sans dépasser 4 g/24h)", "50 mg/kg/24h en 3 prises (sans dépasser 4 g/24h)", "50 mg/kg/24h en 3 prises (sans dépasser 4 g/24h)", "Aucune donnée", "Aucune donnée"] },
    ],
    notes: [],
  },
  {
    id: "cloxacilline-iv",
    fr: "Cloxacilline IV",
    ar: "كلوكساسيلين وريدي",
    section: "penicillines",
    page: 2,
    lines: [
      { kind: "dose", d: ["100 à 200 mg/kg/24h en 6 perfusions de 30 à 60 min OU DC de 2 g en perfusion de 60 min puis 100 à 200 mg/kg/24h en perfusion continue", "100 à 200 mg/kg/24h en 6 perfusions de 30 à 60 min OU DC de 2 g en perfusion de 60 min puis 100 à 200 mg/kg/24h en perfusion continue", "100 à 200 mg/kg/24h en 6 perfusions de 30 à 60 min OU DC de 2 g en perfusion de 60 min puis 100 à 200 mg/kg/24h en perfusion continue", "Aucune donnée", "Aucune donnée"] },
    ],
    notes: [],
  },
  {
    id: "oxacilline-iv",
    fr: "Oxacilline IV",
    ar: "أوكساسيلين وريدي",
    section: "penicillines",
    page: 2,
    lines: [
      { kind: "dose", d: ["100 à 200 mg/kg/24h en 6 perfusions de 30 à 60 min toutes les 4h OU DC de 2 g en perfusion de 60 min puis 100 à 200 mg/kg/24h en perfusion continue", "100 à 200 mg/kg/24h en 6 perfusions de 30 à 60 min toutes les 4h OU DC de 2 g en perfusion de 60 min puis 100 à 200 mg/kg/24h en perfusion continue", "100 à 200 mg/kg/24h en 6 perfusions de 30 à 60 min toutes les 4h OU DC de 2 g en perfusion de 60 min puis 100 à 200 mg/kg/24h en perfusion continue", "100 à 200 mg/kg/24h en 6 perfusions de 30 à 60 min toutes les 4h OU DC de 2 g en perfusion de 60 min puis 100 à 200 mg/kg/24h en perfusion continue", "100 à 200 mg/kg/24h en 6 perfusions de 30 à 60 min toutes les 4h OU DC de 2 g en perfusion de 60 min puis 100 à 200 mg/kg/24h en perfusion continue"] },
    ],
    notes: [],
  },
  {
    id: "phenoxymethyl-penicilline-po",
    fr: "Phénoxyméthyl- -pénicilline PO",
    ar: "فينوكسي ميثيل بنسلين فموي",
    section: "penicillines",
    page: 2,
    lines: [
      { kind: "dose", d: ["1 MUI/6 à 8h", "1 MUI/6 à 8h", "1 MUI/6 à 8h", "1 MUI/6 à 8h", "Aucune donnée"] },
    ],
    notes: [],
  },
  {
    id: "piperacilline-iv",
    fr: "Pipéracilline IV",
    ar: "بيبراسيلين وريدي",
    section: "penicillines",
    page: 2,
    lines: [
      { kind: "dose", d: ["4 g/6 à 8h", "4 g/6 à 8h", "4 g/6 à 8h", "4 g/ 8h", "4 g/12h"] },
    ],
    notes: [],
  },
  {
    id: "piperacilline-tazobactam-iv",
    fr: "Pipéracilline + tazobactam IV",
    ar: "بيبراسيلين + تازوباكتام وريدي",
    section: "penicillines",
    page: 3,
    lines: [
      { kind: "dose", d: ["4 g/6 à 8h", "4 g/6 à 8h", "4 g/6 à 8h", "4 g/ 8h", "4 g/12h"] },
    ],
    notes: [
      { fr: "Posologies exprimées en g de pipéracilline", ar: "الجرعات معبَّر عنها بغرامات البيبراسيلين" },
    ],
  },
  {
    id: "pivmecillinam-po",
    fr: "Pivmécillinam PO",
    ar: "بيفميسيلينام فموي",
    section: "penicillines",
    page: 3,
    lines: [
      { kind: "dose", d: ["400 mg/8 à 12h", "400 mg/8 à 12h", "400 mg/8 à 12h", "DC de 400 mg puis 200 mg/8 à 12h", "DC de 400 mg puis 200 mg /24h"] },
    ],
    notes: [],
  },
  {
    id: "temocilline-iv",
    fr: "Témocilline IV",
    ar: "تيموسيلين وريدي",
    section: "penicillines",
    page: 3,
    lines: [
      { kind: "dose", d: ["2 g/8 à 12h en perfusion de 30 min", "2 g/8 à 12h en perfusion de 30 min", "1 g/12h", "1 g/24h", "500 mg/24h"] },
      { kind: "dose", d: ["DC de 2 g en perfusion de 30 min puis 6 g/24h en perfusion continue", "DC de 2 g en perfusion de 30 min puis 6 g/24h en perfusion continue", "Aucune donnée", "Aucune donnée", "Aucune donnée"] },
    ],
    notes: [],
  },
  {
    id: "aztreonam-im",
    fr: "Aztréonam IM",
    ar: "أزتريونام عضلي",
    section: "monobactames",
    page: 3,
    lines: [
      { kind: "dose", d: ["Cystite aiguë ou infection gonococcique non compliquée : 1 g dose unique", "Cystite aiguë ou infection gonococcique non compliquée : 1 g dose unique", "Cystite aiguë ou infection gonococcique non compliquée : 1 g dose unique", "½ dose", "¼ dose"] },
      { kind: "dose", d: ["Infection urinaire haute et/ou compliquée : 1 g/12h", "Infection urinaire haute et/ou compliquée : 1 g/12h", "Infection urinaire haute et/ou compliquée : 1 g/12h", "½ dose", "¼ dose"] },
    ],
    notes: [],
  },
  {
    id: "aztreonam-iv",
    fr: "Aztréonam IV",
    ar: "أزتريونام وريدي",
    section: "monobactames",
    page: 3,
    lines: [
      { kind: "dose", d: ["Infection peu sévère : DC de 2 g puis 1 à 2 g/8h", "Infection peu sévère : DC de 2 g puis 1 à 2 g/8h", "Infection peu sévère : DC de 2 g puis 1 à 2 g/8h", "DC de 2 g puis 500 mg à 1 g/8h", "DC de 2 g puis 250 à 500 mg/8h"] },
      { kind: "dose", d: ["Infection sévère : 2 g/6h ou 8 g/24h en continue", "Infection sévère : 2 g/6h ou 8 g/24h en continue", "Infection sévère : 2 g/6h ou 8 g/24h en continue", "DC de 2 g puis 1 g/6h ou 4 g/24h en continue", "DC de 2 g puis 500 mg/6h ou 2 g/24h en continue"] },
    ],
    notes: [],
  },
  {
    id: "cefaclor-po",
    fr: "Céfaclor PO",
    ar: "سيفاكلور فموي",
    section: "cephalosporines",
    page: 3,
    lines: [
      { kind: "dose", d: ["250 à 500 mg/8h Posologie max : 1500 mg/24h", "250 à 500 mg/8h Posologie max : 1500 mg/24h", "250 à 500 mg/8h Posologie max : 1500 mg/24h", "250 à 500 mg/12h", "250 à 500 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "cefadroxil-po",
    fr: "Céfadroxil PO",
    ar: "سيفادروكسيل فموي",
    section: "cephalosporines",
    page: 3,
    lines: [
      { kind: "dose", d: ["1 g/12h", "1 g/12h", "1 g/12h", "500 mg/12h", "500 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "cefalexine-po",
    fr: "Céfalexine PO",
    ar: "سيفالكسين فموي",
    section: "cephalosporines",
    page: 3,
    lines: [
      { kind: "dose", d: ["1 g/12h", "1 g/12h", "500 mg/12h", "500 mg/24h", "250 mg/12 à 24h"] },
    ],
    notes: [],
  },
  {
    id: "cefazoline-im-iv",
    fr: "Céfazoline IM IV",
    ar: "سيفازولين عضلي/وريدي",
    section: "cephalosporines",
    page: 4,
    lines: [
      { kind: "dose", d: ["Infection peu sévère : 60 à 80 mg/kg/24h en 4 à 6 injections OU en continue avec DC = 1/4 ou 1/3 de la dose journalière", "Infection peu sévère : 60 à 80 mg/kg/24h en 4 à 6 injections OU en continue avec DC = 1/4 ou 1/3 de la dose journalière", "DC de 500 mg puis 125 à 250 mg/12h", "DC de 500 mg puis 125 à 250 mg/24h", "DC de 500 mg puis 125 à 250 mg/48h"] },
      { kind: "dose", d: ["Infection sévère : 80 à 100 mg/kg/24h en 3 perfusions de 60 min toutes les 8h OU en continue avec DC de 2 g en perfusion de 60 min puis 80 à 100 mg/kg/j en 2 perfusions de 12h", "Infection sévère : 80 à 100 mg/kg/24h en 3 perfusions de 60 min toutes les 8h OU en continue avec DC de 2 g en perfusion de 60 min puis 80 à 100 mg/kg/j en 2 perfusions de 12h", "DC de 500 mg puis 250 mg/6h ou 500 mg/12h", "DC de 500 mg puis 250 mg/12h ou 500 mg/24h", "DC de 500 mg puis 500 mg/48 à 72h"] },
    ],
    notes: [],
  },
  {
    id: "cefepime-iv-im-possible",
    fr: "Céfépime IV (*IM possible)",
    ar: "سيفيبيم وريدي",
    section: "cephalosporines",
    page: 4,
    lines: [
      { kind: "dose", d: ["Infection respiratoire communautaire, pyélonéphrite non compliquée : 1 g/12h *", "Infection respiratoire communautaire, pyélonéphrite non compliquée : 1 g/12h *", "1 g/24h", "0,5 g/24h", "0,25 g/24h"] },
      { kind: "dose", d: ["Infection sévère : 2 g/12h", "Infection sévère : 2 g/12h", "2 g/24h", "1 g/24h", "0,5 g/24h"] },
      { kind: "dose", d: ["Infection très sévère : 2 g/8h", "Infection très sévère : 2 g/8h", "1 g/8h", "1 g/12h", "1 g/24h"] },
    ],
    notes: [],
  },
  {
    id: "cefiderocol-iv",
    fr: "Céfidérocol IV",
    ar: "سيفيديروكول وريدي",
    section: "cephalosporines",
    page: 4,
    lines: [
      { kind: "dose", d: ["2 g/8h si fonction rénale ≥ 120 mL/min : 2 g/6h", "2 g/8h", "1,5 g/8h", "1 g/8h", "0,75 g/12h"] },
    ],
    notes: [],
  },
  {
    id: "cefixime-po",
    fr: "Céfixime PO",
    ar: "سيفيكسيم فموي",
    section: "cephalosporines",
    page: 4,
    lines: [
      { kind: "dose", d: ["200 mg/12h", "200 mg/12h", "200 mg/12h", "200 mg/12h", "200 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "cefotaxime-im-iv",
    fr: "Céfotaxime IM IV",
    ar: "سيفوتاكسيم عضلي/وريدي",
    section: "cephalosporines",
    page: 4,
    lines: [
      { kind: "dose", d: ["Posologie standard : 1 à 2 g/8h", "Posologie standard : 1 à 2 g/8h", "1 à 2 g/12h", "750 à 1500 mg/12h", "750 à 1500 mg/24h"] },
      { kind: "dose", d: ["Infection ostéo-articulaire : 100 à 150 mg/kg/24h en 4 à 6 injections ou en continue", "Infection ostéo-articulaire : 100 à 150 mg/kg/24h en 4 à 6 injections ou en continue", "75 à 112,5 mg/kg/24h", "50 à 75 mg/kg/24h", "25 à 37,5 mg/kg/24h"] },
      { kind: "dose", d: ["Infection méningée : 200 à 300 mg/kg/24h en 4 à 6 injections ou en continue", "Infection méningée : 200 à 300 mg/kg/24h en 4 à 6 injections ou en continue", "150 à 225 mg/kg/24h", "100 à 150 mg/kg/24h", "50 à 75 mg/kg/24h"] },
    ],
    notes: [],
  },
  {
    id: "cefoxitine-iv",
    fr: "Céfoxitine IV",
    ar: "سيفوكسيتين وريدي",
    section: "cephalosporines",
    page: 5,
    lines: [
      { kind: "dose", d: ["Infection peu grave : 1 à 2 g/8h", "Infection peu grave : 1 à 2 g/8h", "1 à 2 g/8 à 12h", "1 à 2 g/12 à 24h", "0,5 à 1g/24 à 48h"] },
      { kind: "dose", d: ["Infection grave et/ou à CMI>8mg/l : 8 g/24h en continue", "Infection grave et/ou à CMI>8mg/l : 8 g/24h en continue", "Aucune donnée", "Aucune donnée", "Aucune donnée"] },
    ],
    notes: [],
  },
  {
    id: "cefpodoxime-proxetil-po",
    fr: "Cefpodoxime (proxetil) PO",
    ar: "سيفبودوكسيم فموي",
    section: "cephalosporines",
    page: 5,
    lines: [
      { kind: "dose", d: ["100 à 200 mg/12h", "100 à 200 mg/12h", "100 à 200 mg/12 à 24h", "100 à 200 mg/24h", "100 à 200 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "ceftaroline-fosamil-iv",
    fr: "Ceftaroline (fosamil) IV",
    ar: "سيفتارولين وريدي",
    section: "cephalosporines",
    page: 5,
    lines: [
      { kind: "dose", d: ["600 mg/12h", "600 mg/12h", "400 mg/12h", "300 mg/12h", "200 mg/12h"] },
    ],
    notes: [],
  },
  {
    id: "ceftazidime-im-iv",
    fr: "Ceftazidime IM IV",
    ar: "سيفتازيديم عضلي/وريدي",
    section: "cephalosporines",
    page: 5,
    lines: [
      { kind: "dose", d: ["Administration discontinue : 2 g/8h", "Administration discontinue : 2 g/8h", "2 g/12h", "2 g/24h", "1 g/24h"] },
      { kind: "dose", d: ["Administration continue : DC de 2 g puis 6 g/24h", "Administration continue : DC de 2 g puis 6 g/24h", "DC de 2 g puis 3 g/24h", "DC de 2 g puis 1 g/24h", "Aucune donnée"] },
    ],
    notes: [],
  },
  {
    id: "ceftazidime-avibactam-iv",
    fr: "Ceftazidime + avibactam IV",
    ar: "سيفتازيديم + أفباكتام وريدي",
    section: "cephalosporines",
    page: 5,
    lines: [
      { kind: "dose", d: ["Administration discontinue : 2 g/8h en perfusion de 2h", "Administration discontinue : 2 g/8h en perfusion de 2h", "1 g/8h", "0,75 g/12h", "0,75 g/24h"] },
      { kind: "dose", d: ["Administration en continue : DC de 2 g puis 6 g/24h", "Administration en continue : DC de 2 g puis 6 g/24h", "Aucune donnée sur l'administration en continue", "Aucune donnée sur l'administration en continue", "Aucune donnée sur l'administration en continue"] },
    ],
    notes: [
      { fr: "Posologies exprimées en g de ceftazidime", ar: "الجرعات معبَّر عنها بغرامات السيفتازيديم" },
    ],
  },
  {
    id: "ceftobiprole-iv",
    fr: "Ceftobiprole IV",
    ar: "سيفتوبيبرول وريدي",
    section: "cephalosporines",
    page: 5,
    lines: [
      { kind: "dose", d: ["500 mg /8h en perfusion de 2h Si infection sévère : 1 g/8h en perfusion de 4h", "500 mg /8h en perfusion de 2h Si infection sévère : 1 g/8h en perfusion de 4h", "500 mg/12h", "250 mg/12h", "250 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "ceftolozane-tazobactam-iv",
    fr: "Ceftolozane + tazobactam IV",
    ar: "سيفتولوزان + تازوباكتام وريدي",
    section: "cephalosporines",
    page: 5,
    lines: [
      { kind: "dose", d: ["1 g/8h en perfusion de 60 min", "1 g/8h en perfusion de 60 min", "500 mg/8h", "250 mg /8h", "DC de 500 mg puis 8h plus tard 100 mg/8h"] },
      { kind: "dose", d: ["Si pneumonie nosocomiale : 2 g/8h en perfusion de 60 min", "Si pneumonie nosocomiale : 2 g/8h en perfusion de 60 min", "1 g/8h", "500 mg/8h", "DC 1500 mg puis 8h plus tard 300 mg/8h"] },
    ],
    notes: [
      { fr: "Posologies exprimées en g de ceftolozane", ar: "الجرعات معبَّر عنها بغرامات السيفتولوزان" },
    ],
  },
  {
    id: "ceftriaxone-im-iv",
    fr: "Ceftriaxone IM IV",
    ar: "سيفترياكسون عضلي/وريدي",
    section: "cephalosporines",
    page: 6,
    lines: [
      { kind: "info", d: ["Infection modérée : 1 à 2 g/24h — Infection sévère : 2 à 4 g/24h — Si infection neuroméningée : 75 à 100 mg/kg/24h ; « Aucune donnée chez l'insuffisant rénal »", "Infection modérée : 1 à 2 g/24h — Infection sévère : 2 à 4 g/24h — Si infection neuroméningée : 75 à 100 mg/kg/24h ; « Aucune donnée chez l'insuffisant rénal »", "Infection modérée : 1 à 2 g/24h — Infection sévère : 2 à 4 g/24h — Si infection neuroméningée : 75 à 100 mg/kg/24h ; « Aucune donnée chez l'insuffisant rénal »", "Infection modérée : 1 à 2 g/24h — Infection sévère : 2 à 4 g/24h — Si infection neuroméningée : 75 à 100 mg/kg/24h ; « Aucune donnée chez l'insuffisant rénal »", "Infection modérée : 1 à 2 g/24h — Infection sévère : 2 à 4 g/24h — Si infection neuroméningée : 75 à 100 mg/kg/24h ; « Aucune donnée chez l'insuffisant rénal »"] },
    ],
    notes: [],
  },
  {
    id: "cefuroxime-axetil-po",
    fr: "Cefuroxime (axétil) PO",
    ar: "سيفوروكسيم أكسيتيل فموي",
    section: "cephalosporines",
    page: 6,
    lines: [
      { kind: "dose", d: ["250 à 500 mg/12h", "250 à 500 mg/12h", "250 à 500 mg/12h", "250 à 500 mg/24h", "250 à 500 mg/48h"] },
    ],
    notes: [],
  },
  {
    id: "cefuroxime-iv",
    fr: "Cefuroxime IV",
    ar: "سيفوروكسيم وريدي",
    section: "cephalosporines",
    page: 6,
    lines: [
      { kind: "dose", d: ["2 à 6 g/24h", "2 g/24h", "2 g/24h", "1 g/24h", "1 g/24 à 48h"] },
    ],
    notes: [],
  },
  {
    id: "ertapenem-iv",
    fr: "Ertapénem IV",
    ar: "إرتابينيم وريدي",
    section: "carbapenemes",
    page: 6,
    lines: [
      { kind: "dose", d: ["1 g/ 24h", "1 g/ 24h", "1 g/ 24h", "500 mg/24h", "500 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "imipenem-cilastatine-iv",
    fr: "Imipénem + cilastatine IV",
    ar: "إيميبينيم + سيلاستاتين وريدي",
    section: "carbapenemes",
    page: 6,
    lines: [
      { kind: "dose", d: ["500 mg/6h en perfusion de 30 min", "500 mg/6h en perfusion de 30 min", "500 mg/8h", "250 mg/6h", "250 mg/12h"] },
      { kind: "dose", d: ["1000 mg/8h en perfusion de 30 min", "1000 mg/8h en perfusion de 30 min", "500 mg/6h", "500 mg/8h", "500 mg/12h"] },
      { kind: "dose", d: ["1000 mg/6h en perfusion de 30 min", "1000 mg/6h en perfusion de 30 min", "750 mg/8h", "500 mg/6h", "500 mg/12h"] },
    ],
    notes: [
      { fr: "Posologies exprimées en mg d'Imipénem", ar: "الجرعات معبَّر عنها بمغ الإيميبينيم" },
    ],
  },
  {
    id: "imipenem-cilastatine-relebactam-iv",
    fr: "Imipénem + cilastatine + relebactam IV",
    ar: "إيميبينيم + سيلاستاتين + ريليبكتام وريدي",
    section: "carbapenemes",
    page: 6,
    lines: [
      { kind: "dose", d: ["500 mg/6h en perfusion de 30 min", "400 mg/6h", "300 mg/6h", "200 mg/6h", "Aucune donnée"] },
    ],
    notes: [
      { fr: "Posologies exprimées en mg d'Imipénem", ar: "الجرعات معبَّر عنها بمغ الإيميبينيم" },
    ],
  },
  {
    id: "meropenem-iv",
    fr: "Méropénem IV",
    ar: "ميروبينيم وريدي",
    section: "carbapenemes",
    page: 6,
    lines: [
      { kind: "dose", d: ["1 à 2 g/8h", "1 à 2 g/8h", "1 à 2 g/12h", "0,5 à 1 g/12h", "0,5 à 1 g/12h"] },
    ],
    notes: [],
  },
  {
    id: "meropenem-vaborbactam-iv-atb-de-reserve",
    fr: "Méropénem + vaborbactam IV (ATB de réserve)",
    ar: "ميروبينيم + فابورباكتام وريدي",
    section: "carbapenemes",
    page: 6,
    lines: [
      { kind: "dose", d: ["2 g/8h en perfusion de 3h", "2 g/8h en perfusion de 3h", "2 g/8h en perfusion de 3h", "1g/8h", "0,5g/12h"] },
    ],
    notes: [
      { fr: "Posologies exprimées en g de meropenem", ar: "الجرعات معبَّر عنها بغرامات الميروبينيم" },
    ],
  },
  {
    id: "amikacine-iv",
    fr: "Amikacine IV",
    ar: "أميكاسين وريدي",
    section: "aminosides",
    page: 7,
    lines: [
      { kind: "dose", d: ["15 à 30 mg/kg/j", "15 à 30 mg/kg/j", "15 à 30 mg/kg/j", "15 à 30 mg/kg/j", "15 à 30 mg/kg/j"] },
    ],
    notes: [
      { fr: "En cas de situation clinique justifiant l'administration, la posologie unitaire ne doit pas être diminuée. Dans la majorité des cas, une injection unique suffit. Si plusieurs injections sont nécessaires, il est indispensable de réaliser des dosages du résiduel et d'espacer les doses.", ar: "إذا استدعى الوضع السريري الإعطاء فلا تُخفَّض الجرعة الواحدية. في معظم الحالات تكفي حقنة واحدة يوميًا؛ وإذا تكرّرت الحقن فلا بدّ من معايرة المستوى المتبقّي وتباعد الجرعات." },
    ],
  },
  {
    id: "gentamicine-im-iv",
    fr: "Gentamicine IM IV",
    ar: "جنتاميسين عضلي/وريدي",
    section: "aminosides",
    page: 7,
    lines: [
      { kind: "dose", d: ["3 à 8 mg/kg/j", "3 à 8 mg/kg/j", "3 à 8 mg/kg/j", "3 à 8 mg/kg/j", "3 à 8 mg/kg/j"] },
    ],
    notes: [
      { fr: "En cas de situation clinique justifiant l'administration, la posologie unitaire ne doit pas être diminuée. Dans la majorité des cas, une injection unique suffit. Si plusieurs injections sont nécessaires, il est indispensable de réaliser des dosages du résiduel et d'espacer les doses.", ar: "إذا استدعى الوضع السريري الإعطاء فلا تُخفَّض الجرعة الواحدية. في معظم الحالات تكفي حقنة واحدة يوميًا؛ وإذا تكرّرت الحقن فلا بدّ من معايرة المستوى المتبقّي وتباعد الجرعات." },
    ],
  },
  {
    id: "tobramycine-im-iv",
    fr: "Tobramycine IM IV",
    ar: "توبراميسين عضلي/وريدي",
    section: "aminosides",
    page: 7,
    lines: [
      { kind: "dose", d: ["3 à 8 mg/kg/j", "3 à 8 mg/kg/j", "3 à 8 mg/kg/j", "3 à 8 mg/kg/j", "3 à 8 mg/kg/j"] },
    ],
    notes: [
      { fr: "En cas de situation clinique justifiant l'administration, la posologie unitaire ne doit pas être diminuée. Dans la majorité des cas, une injection unique suffit. Si plusieurs injections sont nécessaires, il est indispensable de réaliser des dosages du résiduel et d'espacer les doses.", ar: "إذا استدعى الوضع السريري الإعطاء فلا تُخفَّض الجرعة الواحدية. في معظم الحالات تكفي حقنة واحدة يوميًا؛ وإذا تكرّرت الحقن فلا بدّ من معايرة المستوى المتبقّي وتباعد الجرعات." },
    ],
  },
  {
    id: "ciprofloxacine-po",
    fr: "Ciprofloxacine PO",
    ar: "سيبروفلوكساسين فموي",
    section: "fluoroquinolones",
    page: 7,
    lines: [
      { kind: "dose", d: ["500 à 750 mg/12h", "500 à 750 mg/12h", "250-500 mg/12h", "250-500 mg/24h", "250-500 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "ciprofloxacine-iv",
    fr: "Ciprofloxacine IV",
    ar: "سيبروفلوكساسين وريدي",
    section: "fluoroquinolones",
    page: 7,
    lines: [
      { kind: "dose", d: ["400 mg/8 à 12h", "400 mg/8 à 12h", "400 mg/12h", "400 mg/24h", "400 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "delafloxacine-po",
    fr: "Délafloxacine PO",
    ar: "ديلافلوكساسين فموي",
    section: "fluoroquinolones",
    page: 7,
    lines: [
      { kind: "dose", d: ["450 mg/12h", "450 mg/12h", "450 mg/12h", "450 mg/12h", "Déconseillé"] },
    ],
    notes: [],
  },
  {
    id: "delafloxacine-iv",
    fr: "Délafloxacine IV",
    ar: "ديلافلوكساسين وريدي",
    section: "fluoroquinolones",
    page: 7,
    lines: [
      { kind: "dose", d: ["300 mg/ 12 h en perfusion de 60 min", "300 mg/ 12 h en perfusion de 60 min", "300 mg/ 12 h en perfusion de 60 min", "200 mg/12 h", "Déconseillé"] },
    ],
    notes: [],
  },
  {
    id: "levofloxacine-iv-po",
    fr: "Lévofloxacine IV PO",
    ar: "ليفوفلوكساسين وريدي/فموي",
    section: "fluoroquinolones",
    page: 7,
    lines: [
      { kind: "dose", d: ["500 mg/12 à 24h", "500 mg/12 à 24h", "DC de 500 mg puis 250 mg/12 à 24h", "DC de 500 mg puis 250 mg/24 à 48h", "DC de 500 mg puis 125 à 250 mg/48h"] },
      { kind: "dose", d: ["Cystite non compliquée : 250 mg /24h", "Cystite non compliquée : 250 mg /24h", "DC de 250 mg puis 125 mg/24h", "DC de 250 mg puis 125 mg/24h", "DC de 250 mg puis 125 mg/48h"] },
    ],
    notes: [],
  },
  {
    id: "moxifloxacine-iv-po",
    fr: "Moxifloxacine IV PO",
    ar: "موكسيفلوكساسين وريدي/فموي",
    section: "fluoroquinolones",
    page: 7,
    lines: [
      { kind: "dose", d: ["400 mg/24h", "400 mg/24h", "400 mg/24h", "400 mg/24h", "400 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "norfloxacine-po",
    fr: "Norfloxacine PO",
    ar: "نورفلوكساسين فموي",
    section: "fluoroquinolones",
    page: 7,
    lines: [
      { kind: "dose", d: ["400 mg/12 à 24 h", "400 mg/12 à 24 h", "400 mg/12 à 24 h", "400 mg/24h", "400 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "ofloxacine-iv-po",
    fr: "Ofloxacine IV PO",
    ar: "أوفلوكساسين وريدي/فموي",
    section: "fluoroquinolones",
    page: 7,
    lines: [
      { kind: "dose", d: ["Dose usuelle : 200 mg/12h", "Dose usuelle : 200 mg/12h", "200 mg/24h", "200 mg/24h", "200 mg/48h"] },
      { kind: "dose", d: ["Infection sévère : 400 mg/12h", "Infection sévère : 400 mg/12h", "400 mg/24h", "400 mg/24h", "200 mg/24h OU 400 mg/48h"] },
    ],
    notes: [],
  },
  {
    id: "dalbavancine-iv",
    fr: "Dalbavancine IV",
    ar: "دالبافانسين وريدي",
    section: "glycopeptides",
    page: 8,
    lines: [
      { kind: "dose", d: ["1500 mg en une seule perfusion OU 1000 mg en perfusion de 30 min suivi de 500 mg 7 jours après", "1500 mg en une seule perfusion OU 1000 mg en perfusion de 30 min suivi de 500 mg 7 jours après", "1500 mg en une seule perfusion OU 1000 mg en perfusion de 30 min suivi de 500 mg 7 jours après", "1000 mg en une seule perfusion OU 750 mg suivi de 375 mg 7 jours après", "1000 mg en une seule perfusion OU 750 mg suivi de 375 mg 7 jours après"] },
    ],
    notes: [],
  },
  {
    id: "oritavancine-iv",
    fr: "Oritavancine IV",
    ar: "أوريتافانسين وريدي",
    section: "glycopeptides",
    page: 8,
    lines: [
      { kind: "dose", d: ["1200 mg (dose unique) en perfusion de 3h", "1200 mg (dose unique) en perfusion de 3h", "1200 mg (dose unique) en perfusion de 3h", "Aucune donnée", "Aucune donnée"] },
    ],
    notes: [],
  },
  {
    id: "teicoplanine-im-iv",
    fr: "Teicoplanine IM IV",
    ar: "تيكوبلانين عضلي/وريدي",
    section: "glycopeptides",
    page: 8,
    lines: [
      { kind: "dose", d: ["Infection peu sévère : DC de 6 mg/kg/12h les 3 premières injections puis 6 mg/kg/24h", "Infection peu sévère : DC de 6 mg/kg/12h les 3 premières injections puis 6 mg/kg/24h", "DC de 6 mg/kg/12h les 3 premières injections puis 3 mg/kg/24h ou 6 mg/kg/48h", "DC de 6 mg/kg/12h les 3 premières injections puis 2 mg/kg/24h ou 6 mg/kg/72h", "DC de 6 mg/kg/12h les 3 premières injections puis 2 mg/kg/24h ou 6 mg/kg/72h"] },
      { kind: "dose", d: ["Infection sévère : DC de 12 mg/kg/12h les 3 à 5 premières injections puis 12 mg/kg/24h", "Infection sévère : DC de 12 mg/kg/12h les 3 à 5 premières injections puis 12 mg/kg/24h", "DC de 12 mg/kg/12h les 3 à 5 premières injections puis 6 mg/kg/24h ou 12 mg/kg/48h", "DC de 12 mg/kg/12h les 3 à 5 premières injections puis 4 mg/kg/24h ou 12 mg/kg/72h", "DC de 12 mg/kg/12h les 3 à 5 premières injections puis 4 mg/kg/24h ou 12 mg/kg/72h"] },
    ],
    notes: [],
  },
  {
    id: "teicoplanine-po",
    fr: "Teicoplanine PO",
    ar: "تيكوبلانين فموي",
    section: "glycopeptides",
    page: 8,
    lines: [
      { kind: "dose", d: ["Diarrhée et colite associées à une infection à Clostridium difficile : 100 - 200 mg deux fois par jour pendant 7 à 14 jours.", "Diarrhée et colite associées à une infection à Clostridium difficile : 100 - 200 mg deux fois par jour pendant 7 à 14 jours.", "Diarrhée et colite associées à une infection à Clostridium difficile : 100 - 200 mg deux fois par jour pendant 7 à 14 jours.", "Diarrhée et colite associées à une infection à Clostridium difficile : 100 - 200 mg deux fois par jour pendant 7 à 14 jours.", "Diarrhée et colite associées à une infection à Clostridium difficile : 100 - 200 mg deux fois par jour pendant 7 à 14 jours."] },
    ],
    notes: [],
  },
  {
    id: "vancomycine-iv",
    fr: "Vancomycine IV",
    ar: "فانكومايسين وريدي",
    section: "glycopeptides",
    page: 8,
    lines: [
      { kind: "dose", d: ["DC 30 mg/kg en perfusion de 2h puis : 20 à 40 mg/kg/j", "DC, puis adapter en fonction de la concentration plasmatique à l'équilibre", "DC, puis adapter en fonction de la concentration plasmatique à l'équilibre", "DC, puis adapter en fonction de la concentration plasmatique à l'équilibre", "DC, puis adapter en fonction de la concentration plasmatique à l'équilibre"] },
    ],
    notes: [],
  },
  {
    id: "vancomycine-po",
    fr: "Vancomycine PO",
    ar: "فانكومايسين فموي",
    section: "glycopeptides",
    page: 8,
    lines: [
      { kind: "info", d: ["Traitement des infections à Clostridium difficile (ICD) : 125 mg/ 6h pendant 10 jours pour un 1er épisode d'ICD non sévère. Cette dose peut être augmentée à 500 mg/6h pendant 10 jours en cas d'ICD sévère ou compliquée. La dose maximale journalière ne devrait pas dépasser 2g.", "Traitement des infections à Clostridium difficile (ICD) : 125 mg/ 6h pendant 10 jours pour un 1er épisode d'ICD non sévère. Cette dose peut être augmentée à 500 mg/6h pendant 10 jours en cas d'ICD sévère ou compliquée. La dose maximale journalière ne devrait pas dépasser 2g.", "Traitement des infections à Clostridium difficile (ICD) : 125 mg/ 6h pendant 10 jours pour un 1er épisode d'ICD non sévère. Cette dose peut être augmentée à 500 mg/6h pendant 10 jours en cas d'ICD sévère ou compliquée. La dose maximale journalière ne devrait pas dépasser 2g.", "Traitement des infections à Clostridium difficile (ICD) : 125 mg/ 6h pendant 10 jours pour un 1er épisode d'ICD non sévère. Cette dose peut être augmentée à 500 mg/6h pendant 10 jours en cas d'ICD sévère ou compliquée. La dose maximale journalière ne devrait pas dépasser 2g.", "Traitement des infections à Clostridium difficile (ICD) : 125 mg/ 6h pendant 10 jours pour un 1er épisode d'ICD non sévère. Cette dose peut être augmentée à 500 mg/6h pendant 10 jours en cas d'ICD sévère ou compliquée. La dose maximale journalière ne devrait pas dépasser 2g."] },
    ],
    notes: [],
  },
  {
    id: "metronidazole-po",
    fr: "Métronidazole PO",
    ar: "ميترونيدازول فموي",
    section: "imidazoles",
    page: 8,
    lines: [
      { kind: "dose", d: ["250 mg/6h", "250 mg/6h", "250 mg/6h", "250 mg/6h", "250 mg/12h"] },
      { kind: "dose", d: ["500 mg/8h", "500 mg/8h", "500 mg/8h", "500 mg/8h", "250 mg/8h"] },
      { kind: "dose", d: ["500 mg/12h", "500 mg/12h", "500 mg/12h", "500 mg/12h", "500 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "metronidazole-iv",
    fr: "Métronidazole IV",
    ar: "ميترونيدازول وريدي",
    section: "imidazoles",
    page: 8,
    lines: [
      { kind: "dose", d: ["500 mg/8h", "500 mg/8h", "500 mg/8h", "500 mg/8h", "250 mg/8h"] },
      { kind: "dose", d: ["750 mg/8h", "750 mg/8h", "750 mg/8h", "750 mg/8h", "375 mg/8h"] },
    ],
    notes: [],
  },
  {
    id: "ornidazole-iv-po",
    fr: "Ornidazole IV PO",
    ar: "أورنيدازول وريدي/فموي",
    section: "imidazoles",
    page: 8,
    lines: [
      { kind: "dose", d: ["Infection à germes anaérobies : 1 à 1,5g /24h", "Infection à germes anaérobies : 1 à 1,5g /24h", "Infection à germes anaérobies : 1 à 1,5g /24h", "Infection à germes anaérobies : 1 à 1,5g /24h", "Infection à germes anaérobies : 1 à 1,5g /24h"] },
    ],
    notes: [],
  },
  {
    id: "azithromycine-po",
    fr: "Azithromycine PO",
    ar: "أزيثرومايسين فموي",
    section: "macrolides",
    page: 9,
    lines: [
      { kind: "info", d: ["Selon indication : 1 g en prise unique OU 500 mg de J1 à J3 OU 500 mg à J1 puis 250 mg de J2 à J5", "Selon indication : 1 g en prise unique OU 500 mg de J1 à J3 OU 500 mg à J1 puis 250 mg de J2 à J5", "Selon indication : 1 g en prise unique OU 500 mg de J1 à J3 OU 500 mg à J1 puis 250 mg de J2 à J5", "Selon indication : 1 g en prise unique OU 500 mg de J1 à J3 OU 500 mg à J1 puis 250 mg de J2 à J5", "Selon indication : 1 g en prise unique OU 500 mg de J1 à J3 OU 500 mg à J1 puis 250 mg de J2 à J5"] },
    ],
    notes: [],
  },
  {
    id: "clarithromycine-po",
    fr: "Clarithromycine PO",
    ar: "كلاريثرومايسين فموي",
    section: "macrolides",
    page: 9,
    lines: [
      { kind: "dose", d: ["250 mg/12h", "250 mg/12h", "250 mg/12h", "250 mg/24h", "250 mg/24h"] },
      { kind: "dose", d: ["500 mg/12h", "500 mg/12h", "500 mg/12h", "500 mg/24h", "500 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "clarithromycine-iv",
    fr: "Clarithromycine IV",
    ar: "كلاريثرومايسين وريدي",
    section: "macrolides",
    page: 9,
    lines: [
      { kind: "dose", d: ["500 mg/12h", "500 mg/12h", "500 mg/12h", "500 mg/24h", "500 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "clindamycine-iv-po",
    fr: "Clindamycine IV PO",
    ar: "كليندامايسين وريدي/فموي",
    section: "macrolides",
    page: 9,
    lines: [
      { kind: "dose", d: ["600 mg/6 à 8h", "600 mg/6 à 8h", "600 mg/6 à 8h", "600 mg/6 à 8h", "600 mg/6 à 8h"] },
    ],
    notes: [],
  },
  {
    id: "erythromycine-iv-po",
    fr: "Erythromycine IV PO",
    ar: "إريثرومايسين وريدي/فموي",
    section: "macrolides",
    page: 9,
    lines: [
      { kind: "dose", d: ["1 g/8 à 12h", "1 g/8 à 12h", "1 g/8 à 12h", "1 g/8 à 12h", "500 à 750 mg/8 à 12h"] },
    ],
    notes: [],
  },
  {
    id: "pristinamycine-po",
    fr: "Pristinamycine PO",
    ar: "بريستيناميسين فموي",
    section: "macrolides",
    page: 9,
    lines: [
      { kind: "dose", d: ["1 g/8 à 12h (posologie maximale = 4 g/24h)", "1 g/8 à 12h (posologie maximale = 4 g/24h)", "1 g/8 à 12h (posologie maximale = 4 g/24h)", "1 g/8 à 12h (posologie maximale = 4 g/24h)", "1 g/8 à 12h (posologie maximale = 4 g/24h)"] },
    ],
    notes: [],
  },
  {
    id: "roxithromycine-po",
    fr: "Roxithromycine PO",
    ar: "روكسيثروميسين فموي",
    section: "macrolides",
    page: 9,
    lines: [
      { kind: "dose", d: ["150 mg/12h", "150 mg/12h", "150 mg/12h", "150 mg/12h", "150 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "spiramycine-iv-po",
    fr: "Spiramycine IV PO",
    ar: "سبيرامايسين وريدي/فموي",
    section: "macrolides",
    page: 9,
    lines: [
      { kind: "dose", d: ["Per os : 3 MUI/8 à 12h", "Per os : 3 MUI/8 à 12h", "Per os : 3 MUI/8 à 12h", "Per os : 3 MUI/8 à 12h", "Per os : 3 MUI/8 à 12h"] },
      { kind: "dose", d: ["IV : 1,5 à 3 MUI/8h", "IV : 1,5 à 3 MUI/8h", "IV : 1,5 à 3 MUI/8h", "IV : 1,5 à 3 MUI/8h", "IV : 1,5 à 3 MUI/8h"] },
    ],
    notes: [],
  },
  {
    id: "spiramycine-metronidazole-po",
    fr: "Spiramycine + Métronidazole PO",
    ar: "سبيرامايسين + ميترونيدازول فموي",
    section: "macrolides",
    page: 9,
    lines: [
      { kind: "dose", d: ["1,5 MUI (spiramycine) + 250 mg (métronidazole) /8h", "1,5 MUI (spiramycine) + 250 mg (métronidazole) /8h", "1,5 MUI (spiramycine) + 250 mg (métronidazole) /8h", "1,5 MUI (spiramycine) + 250 mg (métronidazole) /8h", "1,5 MUI (spiramycine) + 125 mg (métronidazole) /8h"] },
    ],
    notes: [],
  },
  {
    id: "cotrimoxazole-iv-po",
    fr: "Cotrimoxazole IV PO",
    ar: "كوتريموكسازول وريدي/فموي",
    section: "sulfamides",
    page: 10,
    lines: [
      { kind: "dose", d: ["800 mg de sulfaméthoxazole + 160 mg de triméthoprime / 12h", "800 mg de sulfaméthoxazole + 160 mg de triméthoprime / 12h", "800 mg de sulfaméthoxazole + 160 mg de triméthoprime / 12h", "800 mg/160 mg/24h", "Contre-indiqué"] },
    ],
    notes: [],
  },
  {
    id: "sulfadiazine-po",
    fr: "Sulfadiazine PO",
    ar: "سلفاديازين فموي",
    section: "sulfamides",
    page: 10,
    lines: [
      { kind: "dose", d: ["Préventif : 2 g/j Curatif : 4 à 6 g/j en 4 à 6 prises", "Réduction de la posologie", "Réduction de la posologie", "Aucune donnée", "Aucune donnée"] },
    ],
    notes: [],
  },
  {
    id: "trimethoprime-po",
    fr: "Triméthoprime PO",
    ar: "تريميثوبريم فموي",
    section: "sulfamides",
    page: 10,
    lines: [
      { kind: "dose", d: ["Cystite aiguë non compliquée : 300 mg/j en 1 prise, pendant 3 jours", "Cystite aiguë non compliquée : 300 mg/j en 1 prise, pendant 3 jours", "Cystite aiguë non compliquée : 300 mg/j en 1 prise, pendant 3 jours", "Aucune donnée", "Aucune donnée"] },
    ],
    notes: [],
  },
  {
    id: "doxycycline-iv-po",
    fr: "Doxycycline IV PO",
    ar: "دوكسيسيكلين وريدي/فموي",
    section: "tetracyclines",
    page: 10,
    lines: [
      { kind: "dose", d: ["Patient > 60 kg : 200 mg/24h en 1 prise Patient < 60 kg : 200 mg le 1er jour puis 100 mg/24h les jours suivants Autres posologies dans des cas particuliers : gonococcie aiguë, syphilis, urétrite non compliquée, endocervicite, …", "Patient > 60 kg : 200 mg/24h en 1 prise Patient < 60 kg : 200 mg le 1er jour puis 100 mg/24h les jours suivants Autres posologies dans des cas particuliers : gonococcie aiguë, syphilis, urétrite non compliquée, endocervicite, …", "Patient > 60 kg : 200 mg/24h en 1 prise Patient < 60 kg : 200 mg le 1er jour puis 100 mg/24h les jours suivants Autres posologies dans des cas particuliers : gonococcie aiguë, syphilis, urétrite non compliquée, endocervicite, …", "Patient > 60 kg : 200 mg/24h en 1 prise Patient < 60 kg : 200 mg le 1er jour puis 100 mg/24h les jours suivants Autres posologies dans des cas particuliers : gonococcie aiguë, syphilis, urétrite non compliquée, endocervicite, …", "Patient > 60 kg : 200 mg/24h en 1 prise Patient < 60 kg : 200 mg le 1er jour puis 100 mg/24h les jours suivants Autres posologies dans des cas particuliers : gonococcie aiguë, syphilis, urétrite non compliquée, endocervicite, …"] },
    ],
    notes: [],
  },
  {
    id: "lymecycline-po",
    fr: "Lymecycline PO",
    ar: "لايميسيكلين فموي",
    section: "tetracyclines",
    page: 10,
    lines: [
      { kind: "dose", d: ["300 mg/12h", "Aucune donnée", "Aucune donnée", "Aucune donnée", "Aucune donnée"] },
      { kind: "dose", d: ["Acné : 300 mg/24h", "Aucune donnée", "Aucune donnée", "Aucune donnée", "Aucune donnée"] },
    ],
    notes: [],
  },
  {
    id: "minocycline-po",
    fr: "Minocycline PO",
    ar: "مينوسيكلين فموي",
    section: "tetracyclines",
    page: 10,
    lines: [
      { kind: "dose", d: ["200 mg/j en 2 prises", "200 mg/j en 2 prises", "200 mg/j en 2 prises", "200 mg/j en 2 prises", "200 mg/j en 2 prises"] },
    ],
    notes: [],
  },
  {
    id: "tigecycline-iv",
    fr: "Tigécycline IV",
    ar: "تيجيسيكلين وريدي",
    section: "tetracyclines",
    page: 10,
    lines: [
      { kind: "dose", d: ["Infection non sévère : DC de 100 mg puis 50 mg/12h", "Infection non sévère : DC de 100 mg puis 50 mg/12h", "Infection non sévère : DC de 100 mg puis 50 mg/12h", "Infection non sévère : DC de 100 mg puis 50 mg/12h", "Infection non sévère : DC de 100 mg puis 50 mg/12h"] },
      { kind: "dose", d: ["Infection sévère : DC de 200 mg puis 100 mg/12h", "Infection sévère : DC de 200 mg puis 100 mg/12h", "Infection sévère : DC de 200 mg puis 100 mg/12h", "Infection sévère : DC de 200 mg puis 100 mg/12h", "Infection sévère : DC de 200 mg puis 100 mg/12h"] },
    ],
    notes: [],
  },
  {
    id: "acide-fusidique-iv-po",
    fr: "Acide Fusidique IV PO",
    ar: "حمض الفوسيديك وريدي/فموي",
    section: "autres",
    page: 11,
    lines: [
      { kind: "dose", d: ["500 mg/8 à 12h", "500 mg/8 à 12h", "500 mg/8 à 12h", "500 mg/8 à 12h", "500 mg/8 à 12h"] },
    ],
    notes: [],
  },
  {
    id: "colistine-iv-colistimethate-sodique",
    fr: "Colistine IV (Colistiméthate sodique)",
    ar: "كوليستين وريدي (كوليستيميثات الصوديوم)",
    section: "autres",
    page: 11,
    lines: [
      { kind: "dose", d: ["DC de 9 MUI en perfusion de 30 min puis 9 MUI/24h en 2 ou 3 administrations", "DC de 9 MUI en perfusion de 30 min puis 9 MUI/24h en 2 ou 3 administrations", "DC de 9 MUI puis 5,5 à 7,5 MUI/24h en 2 perfusions", "DC de 9 MUI puis 4,5 à 5,5 MUI/24h en 2 perfusions", "DC de 9 MUI puis 3,5 MUI/24h en 2 perfusions"] },
    ],
    notes: [],
  },
  {
    id: "daptomycine-iv",
    fr: "Daptomycine IV",
    ar: "دابتوميسين وريدي",
    section: "autres",
    page: 11,
    lines: [
      { kind: "dose", d: ["Infection non sévère : 6 à 8 mg/kg en perfusion de 30 min, 1 fois/24h", "Infection non sévère : 6 à 8 mg/kg en perfusion de 30 min, 1 fois/24h", "Infection non sévère : 6 à 8 mg/kg en perfusion de 30 min, 1 fois/24h", "6 à 8 mg/kg/48h", "6 à 8 mg/kg/48h"] },
      { kind: "dose", d: ["Infection sévère : 10 à 12 mg/kg en perfusion de 30 min, 1 fois/24h", "Infection sévère : 10 à 12 mg/kg en perfusion de 30 min, 1 fois/24h", "Infection sévère : 10 à 12 mg/kg en perfusion de 30 min, 1 fois/24h", "Aucune donnée au-delà de 10 mg/kg/48h", "Aucune donnée au-delà de 10 mg/kg/48h"] },
    ],
    notes: [],
  },
  {
    id: "fidaxomicine-po",
    fr: "Fidaxomicine PO",
    ar: "فيداكسوميسين فموي",
    section: "autres",
    page: 11,
    lines: [
      { kind: "dose", d: ["200 mg/12h", "200 mg/12h", "200 mg/12h", "200 mg/12h", "200 mg/12h"] },
    ],
    notes: [],
  },
  {
    id: "fosfomycine-trometamol-po",
    fr: "Fosfomycine trométamol PO",
    ar: "فوسفوميسين ترويتمول فموي",
    section: "autres",
    page: 11,
    lines: [
      { kind: "dose", d: ["Cystite aiguë non compliquée de la femme et adolescente de + de 12 ans : 3 g en prise unique", "Cystite aiguë non compliquée de la femme et adolescente de + de 12 ans : 3 g en prise unique", "Cystite aiguë non compliquée de la femme et adolescente de + de 12 ans : 3 g en prise unique", "Cystite aiguë non compliquée de la femme et adolescente de + de 12 ans : 3 g en prise unique", "Cystite aiguë non compliquée de la femme et adolescente de + de 12 ans : 3 g en prise unique"] },
    ],
    notes: [],
  },
  {
    id: "fosfomycine-iv",
    fr: "Fosfomycine IV",
    ar: "فوسفوميسين وريدي",
    section: "autres",
    page: 11,
    lines: [
      { kind: "dose", d: ["8 à 16 g/24h, en perfusion de 4 g, sur 30 min à 4h, toutes les 6 à 12h (max 8 g/prise)", "8 à 16 g/24h, en perfusion de 4 g, sur 30 min à 4h, toutes les 6 à 12h (max 8 g/prise)", "4 g toutes les 12 à 24h", "4 g toutes les 36 à 48h", "2 g toutes les 48h"] },
    ],
    notes: [],
  },
  {
    id: "linezolide-iv-po",
    fr: "Linezolide IV PO",
    ar: "لينيزوليد وريدي/فموي",
    section: "autres",
    page: 11,
    lines: [
      { kind: "dose", d: ["600 mg/12h", "600 mg/12h", "600 mg/12h", "600 mg/24h", "600 mg/24h"] },
      { kind: "dose", d: ["Infections graves de réanimation : 600 mg/8h", "Infections graves de réanimation : 600 mg/8h", "Infections graves de réanimation : 600 mg/8h", "Aucune donnée", "Aucune donnée"] },
    ],
    notes: [],
  },
  {
    id: "nitrofurantoine-po",
    fr: "Nitrofurantoïne PO",
    ar: "نيتروفورانتوين فموي",
    section: "autres",
    page: 11,
    lines: [
      { kind: "dose", d: ["100 mg/8h", "100 mg/8h", "Déconseillé", "Contre-indiqué", "Contre-indiqué"] },
    ],
    notes: [],
  },
  {
    id: "tedizolide-po",
    fr: "Tédizolide PO",
    ar: "تيديزوليد فموي",
    section: "autres",
    page: 11,
    lines: [
      { kind: "dose", d: ["200 mg/24h", "200 mg/24h", "200 mg/24h", "200 mg/24h", "200 mg/24h"] },
    ],
    notes: [],
  },
  {
    id: "bedaquiline-po",
    fr: "Bédaquiline PO",
    ar: "بيداكويلين فموي",
    section: "antituberculeux",
    page: 12,
    lines: [
      { kind: "dose", d: ["Semaines 1 et 2 : 400 mg, 1 fois par jour Semaines 3 à 24 : 200 mg, 3 fois par semaine, avec un intervalle d'au moins 48 heures entre chaque prise", "Semaines 1 et 2 : 400 mg, 1 fois par jour Semaines 3 à 24 : 200 mg, 3 fois par semaine, avec un intervalle d'au moins 48 heures entre chaque prise", "Semaines 1 et 2 : 400 mg, 1 fois par jour Semaines 3 à 24 : 200 mg, 3 fois par semaine, avec un intervalle d'au moins 48 heures entre chaque prise", "Aucune donnée", "Aucune donnée"] },
    ],
    notes: [],
  },
  {
    id: "delamanide-po",
    fr: "Delamanide PO",
    ar: "ديلامانيد فموي",
    section: "antituberculeux",
    page: 12,
    lines: [
      { kind: "dose", d: ["100 mg deux fois par jour pendant 24 semaines", "100 mg deux fois par jour pendant 24 semaines", "100 mg deux fois par jour pendant 24 semaines", "Aucune donnée", "Aucune donnée"] },
    ],
    notes: [],
  },
  {
    id: "ethambutol-m-iv-po",
    fr: "Ethambutol M IV PO",
    ar: "إيثامبوتول فموي/وريدي/عضلي",
    section: "antituberculeux",
    page: 12,
    lines: [
      { kind: "dose", d: ["15 à 20 mg/kg/24h (25 mg/kg/j maximum)", "15 mg/kg/j", "10 mg/kg/j", "10 mg/kg/j", "10 mg/kg/j"] },
    ],
    notes: [],
  },
  {
    id: "isoniazide-im-iv-po",
    fr: "Isoniazide IM IV PO",
    ar: "إيزونيازيد فموي/وريدي/عضلي",
    section: "antituberculeux",
    page: 12,
    lines: [
      { kind: "dose", d: ["4 à 5 mg/kg/24h (300 mg/j maximum)", "3 à 5 mg/kg/24h", "3 à 5 mg/kg/24h", "3 à 5 mg/kg/24h (200 mg/j maximum)", "3 à 5 mg/kg/24h (200 mg/j maximum)"] },
    ],
    notes: [],
  },
  {
    id: "pyrazinamide-po",
    fr: "Pyrazinamide PO",
    ar: "بيرازيناميد فموي",
    section: "antituberculeux",
    page: 12,
    lines: [
      { kind: "dose", d: ["30 mg/kg/24h en 1 prise /j", "30 mg/kg/24h en 1 prise /j", "30 mg/kg/24h en 1 prise /j", "30 mg/kg/48h", "30 mg/kg/48h"] },
    ],
    notes: [],
  },
  {
    id: "rifabutine-po",
    fr: "Rifabutine PO",
    ar: "ريفابوتين فموي",
    section: "antituberculeux",
    page: 12,
    lines: [
      { kind: "dose", d: ["Traitement curatif des infections à Mycobacterium avium complexe chez les sujets VIH+ : poids > 50 kg : 600 mg/j poids < 50 kg : 450 mg/j Si association avec la Clarithromycine : 300 mg/j", "Traitement curatif des infections à Mycobacterium avium complexe chez les sujets VIH+ : poids > 50 kg : 600 mg/j poids < 50 kg : 450 mg/j Si association avec la Clarithromycine : 300 mg/j", "Traitement curatif des infections à Mycobacterium avium complexe chez les sujets VIH+ : poids > 50 kg : 600 mg/j poids < 50 kg : 450 mg/j Si association avec la Clarithromycine : 300 mg/j", "Poids > 50 kg : 300 mg/24h Poids < 50 kg : 450 mg/48h Si association avec la Clarithromycine : 150 mg/j", "Poids > 50 kg : 300 mg/24h Poids < 50 kg : 450 mg/48h Si association avec la Clarithromycine : 150 mg/j"] },
      { kind: "dose", d: ["Traitement préventif des infections à Mycobacterium avium complexe chez les sujets VIH+ : 300 mg/j en une prise Si association avec Indinavir ou Nelfinavir : 150 mg/j", "Traitement préventif des infections à Mycobacterium avium complexe chez les sujets VIH+ : 300 mg/j en une prise Si association avec Indinavir ou Nelfinavir : 150 mg/j", "Traitement préventif des infections à Mycobacterium avium complexe chez les sujets VIH+ : 300 mg/j en une prise Si association avec Indinavir ou Nelfinavir : 150 mg/j", "150 mg/24h Si association avec Indinavir ou Nelfinavir : 150 mg/48h", "150 mg/24h Si association avec Indinavir ou Nelfinavir : 150 mg/48h"] },
    ],
    notes: [],
  },
  {
    id: "rifampicine-iv-po",
    fr: "Rifampicine IV PO",
    ar: "ريفامبيسين وريدي/فموي",
    section: "antituberculeux",
    page: 12,
    lines: [
      { kind: "dose", d: ["Tuberculose : 8 à 12 mg/kg/24h", "Tuberculose : 8 à 12 mg/kg/24h", "Tuberculose : 8 à 12 mg/kg/24h", "Tuberculose : 8 à 12 mg/kg/24h", "Tuberculose : 8 à 12 mg/kg/24h"] },
      { kind: "dose", d: ["Infection à germes gram + ou - : 20 à 30 mg/kg/24h", "Infection à germes gram + ou - : 20 à 30 mg/kg/24h", "espacer les prises si besoin me selon rifampicémie du 2 ou me 3 jour du traitement", "espacement des prises indispensable", "espacement des prises indispensable"] },
    ],
    notes: [],
  },
];

/** فهرس سريع بالمعرّف — يخدم البحث والتنقّل دون مسح المصفوفة كاملة في كل مرة. */
export const ATB_RENAL_BY_ID: Record<string, AtbRenalRow> = Object.fromEntries(
  ATB_RENAL_ROWS.map((r) => [r.id, r]),
);

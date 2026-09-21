// v16.0 — محرّك رصد التدهور: قواعد إنذار مبنية على الثوابت المُدخلة بعد إعادة التقييم.
// الاشتباه ≠ تشخيص: كل قاعدة تعرض معايير تأكيد سريرية — والتأكيد قرار المهني وحده.
// المراجع المعتمدة: ESC 2021 (Insuffisance cardiaque aiguë) · SSC 2021 (Hour-1) · ERC 2021.
// استعمال شخصي بحت — لا يُغني عن الحكم السريري.

export interface Vitals {
  fc?: number;   // fréquence cardiaque /min
  pas?: number;  // pression artérielle systolique mmHg
  fr?: number;   // fréquence respiratoire /min
  spo2?: number; // %
  gcs?: number;  // Glasgow /15
  gly?: number;  // glycémie g/L
  k?: number;    // kaliémie mmol/L (si disponible — v16.1)
}

export interface Bi { fr: string; ar: string; }
export interface RuleLink { href: string; fr: string; ar: string; }

export interface DeterRule {
  id: string;
  sev: "critical" | "urgent";
  title: Bi;
  /** شروط الاشتباه — تُطلق فقط إذا كانت القيم المدخلة كافية */
  when: (v: Vitals) => boolean;
  /** سطر الملاحظة الرقمية الذي أطلق الاشتباه */
  observed: (v: Vitals) => string;
  /** معايير التأكيد السريري (يحققها المهني عند السرير) */
  criteria: Bi[];
  /** الـconduite à tenir بعد التأكيد — مبنية على المرجع المذكور */
  steps: Bi[];
  links: RuleLink[];
  ref: string;
}

const num = (x: number | undefined) => typeof x === "number" && Number.isFinite(x);

export const DETER_RULES: DeterRule[] = [
  {
    id: "oap",
    sev: "critical",
    title: { fr: "OAP — œdème aigu du poumon", ar: "وذمة رئوية حادة (OAP)" },
    when: (v) => (num(v.spo2) && v.spo2! < 90) || (num(v.fr) && v.fr! >= 25),
    observed: (v) =>
      [num(v.spo2) ? `SpO₂ ${v.spo2} %` : null, num(v.fr) ? `FR ${v.fr}/min` : null, num(v.pas) ? `PAS ${v.pas} mmHg` : null]
        .filter(Boolean).join(" · "),
    criteria: [
      { fr: "Crépitants aux deux bases", ar: "خخاخات في قاعدتي الرئة" },
      { fr: "Orthopnée / dyspnée de repos", ar: "اختناق استلقائي / ضيق نفس في الراحة" },
      { fr: "Expectoration mousseuse rosée", ar: "بلغم رغوي وردي" },
    ],
    steps: [
      { fr: "Position assise stricte, jambes pendantes", ar: "جلوس قائم تام مع إرخاء الساقين" },
      { fr: "O₂ si SpO₂ <90 % (cible ≥94 %) — CPAP 5–10 cmH₂O si détresse", ar: "أكسجين إذا التشبع <90٪ (الهدف ≥94٪) — CPAP 5–10 سم ماء عند الضيق التنفسي" },
      { fr: "Furosémide IV 20–40 mg (40 mg si diurétique oral déjà)", ar: "فوروزيميد وريدي 20–40 مغ (40 مغ إذا علاج فموي سابق)" },
      { fr: "Trinitrine SL 0,4–0,8 mg si PAS >90 mmHg, renouvelable", ar: "ترينيترين تحت اللسان 0,4–0,8 مغ إذا الانقباضي >90، قابل للتجديد" },
      { fr: "PAS <90 : ni nitrés ni bolus diurétique → choc cardiogénique ? noradrénaline + échographie", ar: "انقباضي <90: لا نترات ولا مدرّ وريدي ← صدمة قلبية منشأ؟ نورأدرينالين + تصوير بؤري" },
      { fr: "Morphine : non recommandée en routine (ESC 2021)", ar: "المورفين غير موصى به روتينيًا (ESC 2021)" },
      { fr: "Traiter la cause : reperfusion urgente si SCA", ar: "علاج السبب: إعادة ترويج مستعجلة إذا احتشاء حاد" },
    ],
    links: [
      { href: "/medicaments/furosemide", fr: "Furosémide", ar: "فوروزيميد" },
      { href: "/medicaments/noradrenaline", fr: "Noradrénaline", ar: "نورأدرينالين" },
      { href: "/calculateurs/perfusions", fr: "Vitesses PSE", ar: "سرعات المضخات" },
    ],
    ref: "ESC 2021 — Acute Heart Failure",
  },
  {
    id: "choc",
    sev: "critical",
    title: { fr: "Choc — hypoperfusion", ar: "صدمة — نقص ترويج أنسجة" },
    when: (v) => num(v.pas) && v.pas! < 90 && num(v.fc) && v.fc! > 100,
    observed: (v) => `PAS ${v.pas} mmHg · FC ${v.fc}/min`,
    criteria: [
      { fr: "Marbrures / extrémités froides", ar: "بقع جلدية / أطراف باردة" },
      { fr: "Temps de recoloration >3 s", ar: "زمن إعادة التلوين >3 ثوانٍ" },
      { fr: "Confusion ou agitation", ar: "توشّح أو هياج" },
      { fr: "Diurèse <0,5 ml/kg/h", ar: "إدرار بول <0,5 مل/كغ/ساعة" },
    ],
    steps: [
      { fr: "VVP ×2 + lactate + hémocultures", ar: "خطّان وريديان + لاكتات + دمويّات" },
      { fr: "NaCl 250–500 ml en 15–30 min (prudence si OAP)", ar: "محلول ملح 250–500 مل في 15–30 د (حذر إن وذمة رئوية)" },
      { fr: "Noradrénaline si hypotension persistante — cible PAM ≥65 mmHg", ar: "نورأدرينالين إذا استمر الانخفاض — هدف الضغط الوسطي ≥65" },
      { fr: "Chercher la cause : hémorragie, sepsis, IDM, embolie — POCUS", ar: "البحث عن السبب: نزف، إنتان، احتشاء، انصمام — تصوير بؤري" },
    ],
    links: [
      { href: "/medicaments/noradrenaline", fr: "Noradrénaline", ar: "نورأدرينالين" },
      { href: "/calculateurs/amines", fr: "Amines vasopressives", ar: "الأمينات المقبضة" },
      { href: "/calculateurs/pocus", fr: "POCUS", ar: "التصوير البؤري" },
    ],
    ref: "SSC 2021 · ESC 2021",
  },
  {
    id: "sepsis",
    sev: "urgent",
    title: { fr: "qSOFA ≥2 — risque d'infection sévère", ar: "qSOFA ≥2 — خطر إنتان شديد" },
    when: (v) => {
      let s = 0;
      if (num(v.fr) && v.fr! >= 22) s++;
      if (num(v.pas) && v.pas! <= 100) s++;
      if (num(v.gcs) && v.gcs! < 15) s++;
      return s >= 2;
    },
    observed: (v) =>
      [num(v.fr) ? `FR ${v.fr}/min` : null, num(v.pas) ? `PAS ${v.pas} mmHg` : null, num(v.gcs) ? `GCS ${v.gcs}/15` : null]
        .filter(Boolean).join(" · "),
    criteria: [
      { fr: "Fièvre >38 °C ou <36 °C / frissons", ar: "حرارة >38 أو <36 / قشعريرة" },
      { fr: "Foyer infectieux identifié ou probable", ar: "بؤرة إنتانية مؤكدة أو مرجّحة" },
      { fr: "Confusion récente", ar: "توشّح حديث" },
    ],
    steps: [
      { fr: "Mesurer le lactate (refaire si >2 mmol/L)", ar: "قياس اللاكتات (إعادة إذا >2)" },
      { fr: "Hémocultures ± ECBU avant antibiothérapie", ar: "دمويّات ± تحليل بول قبل المضاد الحيوي" },
      { fr: "Antibiothérapie à large spectre ≤1 h si infection probable", ar: "مضاد حيوي واسع الطيف ≤1 ساعة إذا اشتباه إنتاني" },
      { fr: "NaCl 30 ml/kg si hypotension ou lactate ≥4", ar: "ملح 30 مل/كغ إذا انخفاض الضغط أو لاكتات ≥4" },
      { fr: "Réévaluation continue — noradrénaline si persistance", ar: "إعادة تقييم مستمرة — نورأدرينالين عند الاستمرار" },
    ],
    links: [
      { href: "/calculateurs/sepsis-commandement", fr: "Sepsis — commandement", ar: "الإنتان — القيادة" },
      { href: "/calculateurs/lactate", fr: "Lactate", ar: "اللاكتات" },
      { href: "/medicaments/noradrenaline", fr: "Noradrénaline", ar: "نورأدرينالين" },
    ],
    ref: "SSC 2021 — Hour-1 bundle",
  },
  {
    id: "hypoglycemie",
    sev: "urgent",
    title: { fr: "Hypoglycémie", ar: "نقص سكر الدم" },
    when: (v) => num(v.gly) && v.gly! < 70,
    observed: (v) => `Glycémie ${v.gly} g/L`,
    criteria: [
      { fr: "Sueurs froides / tremblements", ar: "عرق بارد / رجفة" },
      { fr: "Troubles de conscience ou de concentration", ar: "اضطراب وعي أو تركيز" },
      { fr: "Amélioration rapide après resucrage", ar: "تحسن سريع بعد إعادة السكر" },
    ],
    steps: [
      { fr: "Conscient : 15–20 g de sucre per os, recontrôle à 15 min", ar: "واعٍ: 15–20 غ سكر فموياً — إعادة القياس بعد 15 دقيقة" },
      { fr: "Conscience altérée : G30 % IV — jamais per os", ar: "اضطراب وعي: غلوكوز 30٪ وريدياً — ممنوع فموياً" },
      { fr: "Rechercher la cause : insuline, sulfamides, alcool", ar: "البحث عن السبب: أنسولين، سلفاميد، كحول" },
      { fr: "Surveillance : recontrôles rapprochés + collation", ar: "مراقبة: قياسات متقاربة + وجبة خفيفة" },
    ],
    links: [{ href: "/medicaments/glucose30", fr: "Glucose 30 %", ar: "غلوكوز 30٪" }],
    ref: "Sociétés savantes diabète (SFD/ADA)",
  },
  {
    id: "gcs8",
    sev: "critical",
    title: { fr: "Coma (GCS ≤8) — voies aériennes", ar: "غيبوبة (غلاسكو ≤8) — الطريق الهوائي" },
    when: (v) => num(v.gcs) && v.gcs! <= 8,
    observed: (v) => `GCS ${v.gcs}/15`,
    criteria: [
      { fr: "Pas d'ouverture des yeux à la voix/douleur", ar: "لا فتح للعينين بالصوت/الألم" },
      { fr: "Réponses incompréhensibles ou aucune", ar: "أجوبة غير مفهومة أو لا أجوبة" },
      { fr: "Chercher : intoxication, hypoglycémie, AVC, traumatisme", ar: "البحث: تسمّم، نقص سكر، سكتة، رضّ" },
    ],
    steps: [
      { fr: "Libérer les voies aériennes — appel renfort", ar: "تحرير الطريق الهوائي — استدعاء الإسناد" },
      { fr: "Préoxygénation puis intubation (RSI)", ar: "أكسجة سابقة ثم تنبيب متسلسل" },
      { fr: "Glycémie capillaire — exclure l'hypoglycémie", ar: "سكر شعري — استبعاد نقص الغلوكوز" },
      { fr: "Scanner cérébral urgent", ar: "أشعة مقطعية دماغية مستعجلة" },
    ],
    links: [
      { href: "/calculateurs/rsi", fr: "RSI", ar: "التنبيب المتسلسل" },
      { href: "/calculateurs/coma", fr: "Bilan de coma", ar: "تدبير الغيبوبة" },
    ],
    ref: "ERC 2021 · recommandations RSI",
  },
  {
    id: "bradycardie",
    sev: "urgent",
    title: { fr: "Bradycardie — symptomatique ?", ar: "بطء قلب — عرضي؟" },
    when: (v) => num(v.fc) && v.fc! < 40,
    observed: (v) => `FC ${v.fc}/min`,
    criteria: [
      { fr: "Malaise / lipothymie / syncope", ar: "توعّك / شحوب / إغماء" },
      { fr: "Hypotension associée", ar: "انخفاض ضغط مصاحب" },
      { fr: "Douleur thoracique / insuffisance cardiaque aiguë", ar: "ألم صدري / وذمة رئوية حادة" },
    ],
    steps: [
      { fr: "Atropine 0,5 mg IV bolus, renouvelable jusqu'à 3 mg", ar: "أتروبين 0,5 مغ وريدياً، قابل للتجديد حتى 3 مغ" },
      { fr: "Entraînement transcutané si échec — sédation", ar: "تنبيه خارجي عبر الجلد عند الفشل — تهدئة" },
      { fr: "Rechercher la cause : hypoxie, médicaments, IDM inférieur", ar: "البحث عن السبب: نقص أكسجة، دوائي، احتشاء سفلي" },
    ],
    links: [{ href: "/medicaments/atropine", fr: "Atropine", ar: "أتروبين" }],
    ref: "ERC 2021 — Bradycardia",
  },
  {
    id: "ep",
    sev: "urgent",
    title: { fr: "EP — embolie pulmonaire : suspicion", ar: "انصمام رئوي — اشتباه" },
    when: (v) => num(v.fc) && v.fc! >= 100 && num(v.spo2) && v.spo2! < 92,
    observed: (v) => `FC ${v.fc}/min · SpO₂ ${v.spo2} %`,
    criteria: [
      { fr: "Dyspnée / douleur thoracique brutale", ar: "ضيق نفس أو ألم صدري مفاجئ" },
      { fr: "Signes de TVP : mollet douloureux unilatéral", ar: "علامات خثار وريدي عميق: ساق مؤلمة من جهة واحدة" },
      { fr: "Immobilisation / chirurgie <4 sem, cancer, hémoptysie", ar: "جمود أو جراحة <4 أسابيع، سرطان، نفث دم" },
      { fr: "Antécédent EP/TVT personnel ou familial", ar: "سابق انصمام/خثار شخصي أو عائلي" },
    ],
    steps: [
      { fr: "O₂ (cible SpO₂ ≥90 %) + scope + VVP", ar: "أكسجين (الهدف ≥90٪) + مراقبة + خط وريدي" },
      { fr: "ECG 12 dérivations : S1Q3T3, BBD, tachycardie — éliminer un SCA", ar: "تخطيط 12 مساراً: S1Q3T3، كتلة يمين، تسرّع — استبعاد الاحتشاء" },
      { fr: "Échodoppler veineux + POCUS : VD dilaté ?", ar: "دوبلر وريدي + تصوير بؤري: تمدد البطين الأيمن؟" },
      { fr: "Wells faible → D-dimères ; forte proba → angio-TDM direct", ar: "ويلز منخفض ← د-دايمر؛ احتمال قوي ← تصوير وعائي مباشر" },
      { fr: "Instable (PAS <90) : thrombolyse systémique en urgence", ar: "غير مستقر (انقباضي <90): إحلال فبريني مستعجل" },
      { fr: "Anticoagulation curative : énoxaparine 1 mg/kg ×2/j", ar: "مضاد تخثر علاجي: إينوكسابارين 1 مغ/كغ مرتين يومياً" },
    ],
    links: [
      { href: "/calculateurs/wells-ep", fr: "Score Wells EP", ar: "مقياس ويلز للانصمام" },
      { href: "/calculateurs/enoxaparine", fr: "Énoxaparine", ar: "إينوكسابارين" },
      { href: "/calculateurs/thrombolyse", fr: "Thrombolyse", ar: "الإحلال الفبريني" },
    ],
    ref: "ESC 2019 — Embolie pulmonaire",
  },
  {
    id: "hyperk",
    sev: "critical",
    title: { fr: "Hyperkaliémie — risque rythmique", ar: "فرط البوتاسيوم — خطر نظمي" },
    when: (v) => num(v.k) && v.k! >= 6,
    observed: (v) => [num(v.k) ? `K⁺ ${v.k} mmol/L` : null, num(v.fc) ? `FC ${v.fc}/min` : null].filter(Boolean).join(" · "),
    criteria: [
      { fr: "ECG : ondes T amples, QRS larges, bradycardie", ar: "التخطيط: موجات T ضخمة، QRS عريض، بطء قلب" },
      { fr: "Faiblesse musculaire / paresthésies", ar: "ضعف عضلي / تنميل" },
      { fr: "Insuffisance rénale / IEC-ARA2 / diurétiques épargneurs", ar: "قصور كلوي / مثبطات الإنجيوتنسين / مدرات موفرة للبوتاسيوم" },
    ],
    steps: [
      { fr: "ECG immédiat + monitorage continu", ar: "تخطيط فوري + مراقبة مستمرة" },
      { fr: "Cardioprotection : gluconate de calcium 10 % — 10–20 ml IV lent", ar: "حماية القلب: غلوكونات الكالسيوم 10٪ — 10–20 مل وريدياً ببطء" },
      { fr: "Transcellulaire : insuline rapide 10 UI + G30 % (± salbutamol nébulisé 10 mg)", ar: "نقل للداخل: أنسولين سريع 10 وحدات + غلوكوز 30٪ (± سالبوتامول بخار 10 مغ)" },
      { fr: "Bicarbonate 1,4 % si acidose associée", ar: "بيكاربونات 1,4٪ إذا حماض مصاحب" },
      { fr: "Élimination : furosémide IV si diurèse conservée — dialyse si réfractaire", ar: "الإطراح: فوروزيميد وريدي إذا كان الإدرار محفوظاً — غسيل إذا عنيد" },
      { fr: "Arrêter apports en K⁺ et médicaments épargneurs — recontrôle K⁺ à 2 h", ar: "إيقاف مدخلات البوتاسيوم والأدوية الموفرة — إعادة القياس بعد ساعتين" },
    ],
    links: [
      { href: "/calculateurs/hyperkalemie", fr: "Protocole HyperK", ar: "بروتوكول فرط البوتاسيوم" },
      { href: "/calculateurs/insuline", fr: "Insuline-G30", ar: "أنسولين-غلوكوز" },
      { href: "/medicaments/furosemide", fr: "Furosémide", ar: "فوروزيميد" },
    ],
    ref: "ESC/ERA 2024 — Hyperkaliémie",
  },
  {
    id: "addison",
    sev: "critical",
    title: { fr: "Crise surrénalienne (Addison)", ar: "أزمة ربعية (قصور الكظر الحاد)" },
    when: (v) => num(v.pas) && v.pas! < 90 && num(v.gly) && v.gly! < 80,
    observed: (v) => `PAS ${v.pas} mmHg · Glycémie ${v.gly} g/L`,
    criteria: [
      { fr: "Corticothérapie récente ou arrêtée brutalement", ar: "كورتيزون حديث أو إيقافه فجأة" },
      { fr: "Mélanodermie / plis sombres", ar: "تصبّغ جلدي / طيّات داكنة" },
      { fr: "Vomissements + douleurs abdominales", ar: "تقيؤ + ألم بطني" },
      { fr: "Hyponatrémie / hyperkaliémie au bilan", ar: "نصوديوم / فرط بوتاسيوم بالتحاليل" },
    ],
    steps: [
      { fr: "Prélever cortisol/ACTH si possible — sans attendre pour traiter", ar: "أخذ عينة كورتيزول/ACTH إن أمكن — دون انتظارها للعلاج" },
      { fr: "Hémisuccinate d'hydrocortisone 100 mg IV, puis 100 mg/6 h", ar: "هيميسكسينات هيدروكورتيزون 100 مغ وريدياً ثم 100 مغ كل 6 ساعات" },
      { fr: "NaCl 0,9 % — 1 000 ml la 1ʳᵉ heure (jamais G5 % seul)", ar: "محلول ملح 0,9٪ — 1000 مل في الساعة الأولى (ممنوع غلوكوز 5٪ وحده)" },
      { fr: "Corriger l'hypoglycémie (G30 %)", ar: "تصحيح نقص السكر (غلوكوز 30٪)" },
      { fr: "Rechercher le facteur déclenchant : infection, chirurgie, douleur", ar: "البحث عن المحرّض: إنتان، جراحة، ألم" },
      { fr: "Surveillance rapprochée — transfert réanimation si instabilité", ar: "مراقبة لصيقة — نقل للإنعاش عند عدم الاستقرار" },
    ],
    links: [
      { href: "/calculateurs/corticoids", fr: "Corticoïdes", ar: "الكورتيكويدات" },
      { href: "/calculateurs/fluides-sodium", fr: "Fluides & sodium", ar: "السوائل والصوديوم" },
      { href: "/calculateurs/sepsis-commandement", fr: "Sepsis — commandement", ar: "الإنتان — القيادة" },
    ],
    ref: "Endocrine Society — Adrenal crisis",
  },
];

export interface Alert {
  rule: DeterRule;
  observed: string;
}

/** يقيّم الثوابت المُدخلة — نقية وقابلة للاختبار (لا DOM ولا تخزين) */
export function evaluateVitals(v: Vitals): Alert[] {
  return DETER_RULES.filter((r) => r.when(v)).map((r) => ({ rule: r, observed: r.observed(v) }));
}

/* ── مشيخة المريض النشطة (المضاعفات المؤكدة) — تخزين محلي ── */
export const PROBLEMS_KEY = "eutn:problems";

export interface Problem {
  id: string;
  ruleId: string;
  at: number;
  title: Bi;
  vitals: string;
}

export function getProblems(): Problem[] {
  try {
    const arr = JSON.parse(localStorage.getItem(PROBLEMS_KEY) || "[]") as Problem[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveProblems(list: Problem[]): void {
  try { localStorage.setItem(PROBLEMS_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

export function addProblem(ruleId: string, vitals: string): Problem[] {
  const rule = DETER_RULES.find((r) => r.id === ruleId);
  if (!rule) return getProblems();
  const next = [{ id: `${ruleId}-${Date.now()}`, ruleId, at: Date.now(), title: rule.title, vitals }, ...getProblems()].slice(0, 12);
  saveProblems(next);
  return next;
}

export function removeProblem(id: string): Problem[] {
  const next = getProblems().filter((p) => p.id !== id);
  saveProblems(next);
  return next;
}

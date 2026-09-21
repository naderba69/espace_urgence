// v6.0 — محرك «تدخل موجّه» = بروتوكول تفاعلي: حيوية + فحوص تكميلية حية (قيم تُطلب، تصوير/تخطيط باحتمالات تُختار)
// والكوندويت يتكيف، والتعكر يسلسل نحو البروتوكول/الأداة المعنية.
export type GVal = number | boolean | string;
export interface GOption { id: string; fr: string; ar: string }
export interface GField {
  id: string; fr: string; ar: string;
  kind: "num" | "bool" | "choice";
  def: GVal; min?: number; max?: number; step?: number; unit?: string;
  options?: GOption[]; group?: "bio" | "img" | "ecg"; hosp?: boolean;
}
export interface GDef { fr: string; ar: string; when: (v: Record<string, GVal>) => boolean }
export interface GGo { href: string; fr: string; ar: string }
export interface GStep { fr: string; ar: string; when: (v: Record<string, GVal>) => boolean; detail?: (v: Record<string, GVal>) => string; go?: GGo; hospOnly?: boolean; preOnly?: boolean }
export interface GCase { id: string; sev: 1 | 2 | 3; fr: string; ar: string; href?: string; fields: GField[]; defs: GDef[]; steps: GStep[] }

const n = (v: Record<string, GVal>, k: string) => Number(v[k] ?? 0);
const b = (v: Record<string, GVal>, k: string) => Boolean(v[k]);
const c = (v: Record<string, GVal>, k: string) => String(v[k] ?? "");

export const GCASES: GCase[] = [
  {
    id: "choc", sev: 1, fr: "Choc / sepsis", ar: "صدمة / إنتان", href: "/calculateurs/sepsis-commandement",
    fields: [
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "fc", fr: "FC", ar: "النبض", kind: "num", def: 90, min: 20, max: 220, step: 5, unit: "/min" },
      { id: "fr", fr: "FR", ar: "التنفس", kind: "num", def: 16, min: 6, max: 60, step: 1, unit: "/min" },
      { id: "spo2", fr: "SpO2", ar: "تشبع", kind: "num", def: 98, min: 50, max: 100, step: 1, unit: "%" },
      { id: "t", fr: "T°", ar: "الحرارة", kind: "num", def: 37, min: 30, max: 42, step: 0.5, unit: "°C" },
      { id: "w", fr: "Poids", ar: "الوزن", kind: "num", def: 70, min: 2, max: 150, step: 5, unit: "kg" },
      { id: "lac", fr: "Lactates", ar: "لاكتات", kind: "num", def: 1, min: 0, max: 20, step: 0.5, unit: "mmol/L", group: "bio" },
    ],
    defs: [
      { fr: "Hypotension (choc ?)", ar: "هبوط ضغط (صدمة؟)", when: (v) => n(v, "pas") < 90 },
      { fr: "Hypoperfusion tissulaire (lactates > 2)", ar: "نقص تروية نسجي (لاكتات > 2)", when: (v) => n(v, "lac") > 2 },
      { fr: "Tachycardie", ar: "تسرع قلب", when: (v) => n(v, "fc") > 120 },
      { fr: "Tachypnée", ar: "تسرع تنفس", when: (v) => n(v, "fr") > 22 },
      { fr: "Hypoxémie", ar: "نقص أكسجة", when: (v) => n(v, "spo2") < 92 },
      { fr: "Température anormale (SIRS)", ar: "حرارة مضطربة (SIRS)", when: (v) => n(v, "t") >= 38.3 || n(v, "t") < 36 },
    ],
    steps: [
      { fr: "2 voies veineuses + lactates + cultures", ar: "طريقان وريديان + لاكتات + مزارع", when: () => true },
      { fr: "Oxygène cibler SpO2 ≥ 94 %", ar: "أكسجين لاستهداف تشبع ≥ 94%", when: (v) => n(v, "spo2") < 94 },
      { fr: "Remplissage cristalloïdes 30 mL/kg en 30 min", ar: "توسيع بلّوريات 30 مل/كغ خلال 30 د", when: (v) => n(v, "pas") < 90, detail: (v) => `${Math.round(n(v, "w") * 30)} mL` },
      { fr: "Noradrénaline si PAM < 65 après remplissage", ar: "نورأدرينالين إن بقي المتوسط < 65 بعد التوسيع", when: (v) => n(v, "pas") < 75, go: { href: "/calculateurs/amines", fr: "Amines", ar: "مقلدات الودي" } },
      { fr: "Antibiotiques IV < 1 h", ar: "مضادات وريدية خلال أقل من ساعة", when: () => true },
      { fr: "Réévaluation hémodynamique q15 min", ar: "إعادة تقييم دوراني كل 15 د", when: (v) => n(v, "pas") < 90 },
    ],
  },
  {
    id: "detresse-resp", sev: 1, fr: "Détresse respiratoire", ar: "ضيق تنفس حاد", href: "/calculateurs/asthme",
    fields: [
      { id: "spo2", fr: "SpO2", ar: "تشبع", kind: "num", def: 98, min: 50, max: 100, step: 1, unit: "%" },
      { id: "fr", fr: "FR", ar: "التنفس", kind: "num", def: 16, min: 6, max: 60, step: 1, unit: "/min" },
      { id: "sibilants", fr: "Sibilants", ar: "أزيز", kind: "bool", def: false },
      { id: "bpco", fr: "BPCO connu", ar: "قان مزمن معروف", kind: "bool", def: false },
      { id: "rx", hosp: true, fr: "Radio thorax", ar: "صورة صدر", kind: "choice", def: "none", group: "img", options: [
        { id: "none", fr: "Non faite", ar: "لم تُعمل" },
        { id: "normal", fr: "Normale", ar: "سليمة" },
        { id: "foyer", fr: "Foyer unilatéral (PAC)", ar: "بؤرة وحيدة (التهاب رئوي)" },
        { id: "oap", fr: "OAI bilatéral + cardiomégalie (OAP)", ar: "ارتشاح ثنائي + كبر قلب (وذمة رئة)" },
        { id: "pno", fr: "Pneumothorax", ar: "استرواح صدري" },
      ] },
    ],
    defs: [
      { fr: "Hypoxémie sévère", ar: "نقص أكسجة شديد", when: (v) => n(v, "spo2") < 92 },
      { fr: "Épuisement respiratoire (FR > 30)", ar: "إنهاك تنفسي (تردد > 30)", when: (v) => n(v, "fr") > 30 },
      { fr: "Bronchospasme", ar: "تشنج قصبي", when: (v) => b(v, "sibilants") },
      { fr: "Pneumonie (foyer)", ar: "التهاب رئوي (بؤرة)", when: (v) => c(v, "rx") === "foyer" },
      { fr: "OAP", ar: "وذمة رئة حادة", when: (v) => c(v, "rx") === "oap" },
      { fr: "Pneumothorax", ar: "استرواح صدري", when: (v) => c(v, "rx") === "pno" },
    ],
    steps: [
      { fr: "O2 titré — cible 88-92 % si BPCO, sinon ≥ 94 %", ar: "أكسجين معاير — هدف 88-92% إن قان، وإلا ≥ 94%", when: (v) => n(v, "spo2") < (b(v, "bpco") ? 92 : 94) },
      { fr: "Salbutamol 2,5-5 mg néb. q20 min ± ipratropium", ar: "سالبوتامول 2,5-5 ملغ رذّاً كل 20 د ± إبراتروبيوم", when: (v) => b(v, "sibilants") },
      { fr: "Antibiothérapie si foyer (PAC)", ar: "مضاد حيوي إن بؤرة (التهاب رئوي)", when: (v) => c(v, "rx") === "foyer" },
      { fr: "Furosémide 40 mg IV + CPAP si OAP", ar: "فوروسيميد 40 ملغ وريدياً + CPAP إن وذمة رئة", when: (v) => c(v, "rx") === "oap" },
      { fr: "Exsufflation/drainage si pneumothorax", ar: "سحب هواء/تصريف إن استرواح", when: (v) => c(v, "rx") === "pno" },
      { fr: "Préparer intubation si épuisement", ar: "تجهيز للتنبيب إن إنهاك تنفسي", when: (v) => n(v, "fr") > 30 },
      { fr: "Réévaluation FR/SpO2 q10 min", ar: "إعادة تقييم تردد/تشبع كل 10 د", when: () => true },
    ],
  },
  {
    id: "neuro", sev: 1, fr: "Trouble neurologique", ar: "اضطراب عصبي", href: "/calculateurs/gcs",
    fields: [
      { id: "gcs", fr: "Glasgow", ar: "غلاسكو", kind: "num", def: 15, min: 3, max: 15, step: 1 },
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "gly", fr: "Glycémie", ar: "السكر", kind: "num", def: 1, min: 0.2, max: 6, step: 0.1, unit: "g/L", group: "bio" },
      { id: "ct", hosp: true, fr: "Scanner cérébral", ar: "سكانر دماغ", kind: "choice", def: "none", group: "img", options: [
        { id: "none", fr: "Non fait", ar: "لم يُعمل" },
        { id: "normal", fr: "Normal", ar: "سليم" },
        { id: "hemo", fr: "Hémorragie", ar: "نزف" },
        { id: "syst", fr: "Infarctus sylvien", ar: "احتشاء شقّي" },
        { id: "gv", fr: "Occlusion gros vaisseau", ar: "انسداد وعاء كبير" },
      ] },
    ],
    defs: [
      { fr: "Coma (GCS < 9) : protéger la voie aérienne", ar: "غيبوبة (غلاسكو < 9): حماية المجرى", when: (v) => n(v, "gcs") < 9 },
      { fr: "Hypoglycémie traitable", ar: "نقص سكر قابل للعلاج", when: (v) => n(v, "gly") < 0.7 },
      { fr: "HTA sévère / hypotension", ar: "ضغط مضطرب شديد", when: (v) => n(v, "pas") > 180 || n(v, "pas") < 90 },
      { fr: "AVC hémorragique : pas de thrombolyse", ar: "سكتة نزفية: لا إذابة", when: (v) => c(v, "ct") === "hemo" },
      { fr: "Occlusion gros vaisseau : thrombectomie", ar: "انسداد وعاء كبير: استئصال خثرة", when: (v) => c(v, "ct") === "gv" },
    ],
    steps: [
      { fr: "Glycémie + ECG + monitorage immédiats", ar: "سكر + تخطيط + مراقبة فوراً", when: () => true },
      { fr: "D50 50 mL IV si hypoglycémie", ar: "D50 50 مل وريدياً إن نقص سكر", when: (v) => n(v, "gly") < 0.7 },
      { fr: "Protéger la voie aérienne si GCS < 9", ar: "حماية المجرى الهوائي إن غلاسكو < 9", when: (v) => n(v, "gcs") < 9 },
      { fr: "Scanner non injecté maintenant si déficit", hospOnly: true, ar: "سكانر بلا حقن الآن إن عجز", when: (v) => c(v, "ct") === "none" && n(v, "gcs") < 15 },
      { fr: "Thrombolyse si ischémique dans la fenêtre", hospOnly: true, ar: "إذابة إن إقفارية ضمن النافذة", when: (v) => c(v, "ct") === "normal" || c(v, "ct") === "syst", go: { href: "/protocoles/avc", fr: "Protocole AVC", ar: "بروتوكول السكتة" } },
      { fr: "Thrombectomie < 6-24 h si gros vaisseau", hospOnly: true, ar: "استئصال خثرة خلال 6-24 س إن وعاء كبير", when: (v) => c(v, "ct") === "gv", go: { href: "/protocoles/avc", fr: "Protocole AVC", ar: "بروتوكول السكتة" } },
      { fr: "Contrôle TA + avis neurochir si hémorragie", hospOnly: true, ar: "ضبط الضغط + رأي جراحة أعصاب إن نزف", when: (v) => c(v, "ct") === "hemo" },
      { fr: "Pré-hospitalier : transport direct + pré-alerte AVC", preOnly: true, ar: "ميدانياً: نقل مباشر + إعلان مسبق سكتة", when: () => true },
    ],
  },
  {
    id: "douleur-thor", sev: 1, fr: "Douleur thoracique / SCA", ar: "ألم صدري / متلازمة إكليلية",
    fields: [
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "spo2", fr: "SpO2", ar: "تشبع", kind: "num", def: 98, min: 50, max: 100, step: 1, unit: "%" },
      { id: "trop", hosp: true, fr: "Troponine", ar: "تروبونين", kind: "choice", def: "none", group: "bio", options: [
        { id: "none", fr: "Non faite", ar: "لم يُعمل" },
        { id: "plus", fr: "Élevée", ar: "مرتفع" },
        { id: "neg", fr: "Normale", ar: "سليم" },
      ] },
      { id: "ecg", fr: "ECG", ar: "تخطيط", kind: "choice", def: "normal", group: "ecg", options: [
        { id: "normal", fr: "Normal", ar: "سليم" },
        { id: "st", fr: "Sus-décalage ST", ar: "ارتفاع ST" },
        { id: "stminus", fr: "Sous-décalage / T-", ar: "انخفاض ST / سالب T" },
        { id: "fa", fr: "FA rapide", ar: "رجفان أذيني سريع" },
      ] },
    ],
    defs: [
      { fr: "STEMI (ST+) : reperfusion", ar: "احتشاء بارتفاع ST: إعادة إرواء", when: (v) => c(v, "ecg") === "st" },
      { fr: "NSTEMI / ischémie (troponine +)", ar: "احتشاء بلا ارتفاع ST (تروبونين +)", when: (v) => c(v, "ecg") === "stminus" && c(v, "trop") === "plus" },
      { fr: "Choc cardiogénique", ar: "صدمة قلبية", when: (v) => n(v, "pas") < 90 },
      { fr: "Hypoxémie", ar: "نقص أكسجة", when: (v) => n(v, "spo2") < 92 },
    ],
    steps: [
      { fr: "ECG < 10 min + aspirine 250 mg à croquer", ar: "تخطيط خلال 10 د + أسبرين 250 ملغ مضغاً", when: () => true },
      { fr: "Filière cathlab / thrombolyse < 120 min + P2Y12", hospOnly: true, ar: "مسار قثطرة/إذابة خلال 120 د + P2Y12", when: (v) => c(v, "ecg") === "st", go: { href: "/calculateurs/stemi", fr: "Localisation ST+", ar: "توطين ارتفاع ST" } },
      { fr: "Pré-hospitalier : aspirine 250 mg + transport direct cathlab", preOnly: true, ar: "ميدانياً: أسبرين 250 ملغ + نقل مباشر للقثطرة", when: (v) => c(v, "ecg") === "st" },
      { fr: "Dérivés nitrés si douleur et PAS > 90", ar: "نترات إن ألم والضغط > 90", when: (v) => c(v, "ecg") !== "st" && n(v, "pas") > 90 },
      { fr: "Pas de nitrés si choc — soutien circulatoire", ar: "لا نترات إن صدمة — دعم دوراني", when: (v) => n(v, "pas") < 90, go: { href: "/calculateurs/amines", fr: "Amines", ar: "مقلدات الودي" } },
      { fr: "O2 si SpO2 < 92 %", ar: "أكسجين إن تشبع < 92%", when: (v) => n(v, "spo2") < 92 },
      { fr: "Surveillance ECG/FC/PAS q10 min jusqu'à avis", ar: "مراقبة تخطيط/نبض/ضغط كل 10 د حتى الرأي", when: () => true },
    ],
  },
  {
    id: "anaphylaxie", sev: 1, fr: "Anaphylaxie", ar: "حساسية مفرطة", href: "/calculateurs/anaphylaxie",
    fields: [
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "spo2", fr: "SpO2", ar: "تشبع", kind: "num", def: 98, min: 50, max: 100, step: 1, unit: "%" },
      { id: "w", fr: "Poids", ar: "الوزن", kind: "num", def: 70, min: 2, max: 150, step: 5, unit: "kg" },
      { id: "stridor", fr: "Stridor/œdème gorge", ar: "صرير/وذمة حنجرة", kind: "bool", def: false },
      { id: "sibilants", fr: "Bronchospasme", ar: "تشنج قصبي", kind: "bool", def: false },
    ],
    defs: [
      { fr: "Choc anaphylactique", ar: "صدمة حساسية", when: (v) => n(v, "pas") < 90 },
      { fr: "Atteinte laryngée : voie aérienne menacée", ar: "إصابة حنجرية: المجرى مهدد", when: (v) => b(v, "stridor") },
      { fr: "Hypoxémie", ar: "نقص أكسجة", when: (v) => n(v, "spo2") < 92 },
    ],
    steps: [
      { fr: "Adrénaline IM cuisse maintenant", ar: "أدرنالين عضلياً بالفخذ الآن", when: () => true, detail: (v) => `${Math.min(0.5, +(n(v, "w") * 0.01).toFixed(2)).toFixed(2)} mL (1:1000)` },
      { fr: "O2 haut débit", ar: "أكسجين عالي التدفق", when: (v) => n(v, "spo2") < 94 },
      { fr: "Remplissage 20 mL/kg si choc", ar: "توسيع 20 مل/كغ إن صدمة", when: (v) => n(v, "pas") < 90, detail: (v) => `${Math.round(n(v, "w") * 20)} mL` },
      { fr: "Salbutamol néb. si bronchospasme", ar: "سالبوتامول رذّاً إن تشنج قصبي", when: (v) => b(v, "sibilants") },
      { fr: "Préparer intubation si stridor", ar: "تجهيز تنبيب إن صرير", when: (v) => b(v, "stridor") },
      { fr: "Surveillance q5 min (voie aérienne/PAS) — rebond biphasique 4-6 h", ar: "مراقبة كل 5 د (مجرى/ضغط) — طور ثانٍ 4-6 س", when: () => true },
    ],
  },
  {
    id: "trauma", sev: 1, fr: "Trauma — bilan primaire", ar: "رضح — المسح الأولي", href: "/calculateurs/trauma-membres",
    fields: [
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "fc", fr: "FC", ar: "النبض", kind: "num", def: 90, min: 20, max: 220, step: 5, unit: "/min" },
      { id: "gcs", fr: "Glasgow", ar: "غلاسكو", kind: "num", def: 15, min: 3, max: 15, step: 1 },
      { id: "fast", fr: "FAST", ar: "FAST", kind: "choice", def: "none", group: "img", options: [
        { id: "none", fr: "Non fait", ar: "لم يُعمل" },
        { id: "plus", fr: "Épanchement libre", ar: "انصباب حر" },
        { id: "neg", fr: "Négatif", ar: "سلبي" },
      ] },
      { id: "bassin", hosp: true, fr: "Radio bassin", ar: "صورة حوض", kind: "choice", def: "none", group: "img", options: [
        { id: "none", fr: "Non faite", ar: "لم تُعمل" },
        { id: "inst", fr: "Fracture instable", ar: "كسر غير مستقر" },
        { id: "neg", fr: "Normale", ar: "سليمة" },
      ] },
    ],
    defs: [
      { fr: "Choc hémorragique", ar: "صدمة نزفية", when: (v) => n(v, "pas") < 90 || n(v, "fc") > 120 },
      { fr: "Saignement interne (FAST +)", ar: "نزف داخلي (FAST موجب)", when: (v) => c(v, "fast") === "plus" },
      { fr: "Bassin instable : saignement rétro-péritonéal", ar: "حوض غير مستقر: نزف خلف الصفاق", when: (v) => c(v, "bassin") === "inst" },
      { fr: "Coma : voie aérienne + rachis", ar: "غيبوبة: مجرى + عمود فقري", when: (v) => n(v, "gcs") < 9 },
    ],
    steps: [
      { fr: "Contrôle du saignement + ATX 1 g IV (< 3 h)", ar: "ضبط النزف + ATX 1 غ وريدياً (قبل 3 س)", when: (v) => n(v, "pas") < 90 || n(v, "fc") > 120 },
      { fr: "Ceinture pelvienne + transfusion si bassin instable", ar: "حزام حوضي + نقل دم إن حوض غير مستقر", when: (v) => c(v, "bassin") === "inst", go: { href: "/calculateurs/transfusion", fr: "Transfusion", ar: "نقل الدم" } },
      { fr: "Chirurgie/embolisation si FAST +", hospOnly: true, ar: "جراحة/إصمام إن FAST موجب", when: (v) => c(v, "fast") === "plus", go: { href: "/calculateurs/transfusion", fr: "Transfusion", ar: "نقل الدم" } },
      { fr: "Voie aérienne + stabilisation en ligne si GCS < 9", ar: "مجرى هوائي + تثبيت بالخط إن غلاسكو < 9", when: (v) => n(v, "gcs") < 9 },
      { fr: "O2 si SpO2 < 94 %", ar: "أكسجين إن تشبع < 94%", when: () => false },
    ],
  },
  {
    id: "opio", sev: 1, fr: "Dépression respiratoire / opioïdes", ar: "كبح تنفس / أفيون", href: "/calculateurs/opioides",
    fields: [
      { id: "fr", fr: "FR", ar: "التنفس", kind: "num", def: 14, min: 4, max: 60, step: 1, unit: "/min" },
      { id: "gcs", fr: "Glasgow", ar: "غلاسكو", kind: "num", def: 15, min: 3, max: 15, step: 1 },
      { id: "myosis", fr: "Myosis serré", ar: "بؤبؤ منقبض", kind: "bool", def: false },
      { id: "gly", fr: "Glycémie", ar: "السكر", kind: "num", def: 1, min: 0.2, max: 6, step: 0.1, unit: "g/L", group: "bio" },
    ],
    defs: [
      { fr: "Dépression respiratoire (FR < 12)", ar: "كبح تنفس (تردد < 12)", when: (v) => n(v, "fr") < 12 },
      { fr: "Coma", ar: "غيبوبة", when: (v) => n(v, "gcs") < 9 },
      { fr: "Hypoglycémie associée à traiter", ar: "نقص سكر مرافق يُعالج", when: (v) => n(v, "gly") < 0.7 },
      { fr: "Toxidrome opioïde probable", ar: "متلازمة أفيونية مرجحة", when: (v) => b(v, "myosis") && n(v, "fr") < 12 },
    ],
    steps: [
      { fr: "Ventiler d'abord (BVM) + O2", ar: "التهوية أولاً (كيس) + أكسجين", when: (v) => n(v, "fr") < 12 },
      { fr: "Naloxone 0,4 mg IV/IM q2-3 min (ou 4 mg IN)", ar: "نالوكسون 0,4 ملغ وريدياً/عضلياً كل 2-3 د (أو 4 ملغ أنفياً)", when: (v) => n(v, "fr") < 12 || b(v, "myosis") },
      { fr: "D50 si hypoglycémie", ar: "D50 إن نقص سكر", when: (v) => n(v, "gly") < 0.7 },
      { fr: "Surveillance prolongée (récidive)", ar: "مراقبة مطولة (نكس)", when: () => true },
    ],
  },
  {
    id: "eclampsie", sev: 1, fr: "Éclampsie / prééclampsie sévère", ar: "ارتعاج / ما قبله الشديد", href: "/calculateurs/eclampsie",
    fields: [
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "conv", fr: "Convulsions", ar: "اختلاجات", kind: "bool", def: false },
      { id: "clonus", fr: "Clonus/SGT sévère", ar: "رمع/أعراض شديدة", kind: "bool", def: false },
      { id: "plt", hosp: true, fr: "Plaquettes", ar: "صفيحات", kind: "num", def: 200, min: 10, max: 600, step: 10, unit: "G/L", group: "bio" },
    ],
    defs: [
      { fr: "HTA sévère (≥ 160)", ar: "ارتفاع شديد (≥ 160)", when: (v) => n(v, "pas") >= 160 },
      { fr: "Éclampsie (convulsions)", ar: "ارتعاج (اختلاجات)", when: (v) => b(v, "conv") },
      { fr: "Imminence d'éclampsie", ar: "إنذار ارتعاج وشيك", when: (v) => b(v, "clonus") },
      { fr: "HELLP (plaquettes < 100)", ar: "HELLP (صفيحات < 100)", when: (v) => n(v, "plt") < 100 },
    ],
    steps: [
      { fr: "MgSO4 4 g IV en 20 min maintenant", ar: "MgSO4 4 غ وريدياً خلال 20 د الآن", when: (v) => b(v, "conv") || b(v, "clonus") },
      { fr: "Antihypertenseur IV (labétalol/nicardipine) si PAS ≥ 160", ar: "خافض ضغط وريدي إن انقباضي ≥ 160", when: (v) => n(v, "pas") >= 160 },
      { fr: "Préparer naissance + produits sanguins si HELLP", ar: "تجهيز ولادة + مشتقات دم إن HELLP", when: (v) => n(v, "plt") < 100, go: { href: "/calculateurs/transfusion", fr: "Transfusion", ar: "نقل الدم" } },
      { fr: "Entretien MgSO4 1 g/h — avis obstétrical", ar: "صيانة MgSO4 1 غ/س — رأي توليدي", when: (v) => b(v, "conv") || b(v, "clonus") },
      { fr: "Surveillance réflexes/FR/diurèse pendant MgSO4", ar: "مراقبة منعكسات/تنفس/بول أثناء المغنيزيوم", when: () => true },
    ],
  },
  {
    id: "etatmal", sev: 1, fr: "Crise convulsive / état de mal", ar: "نوبة صرعية / حالة صرعية", href: "/calculateurs/etat-mal",
    fields: [
      { id: "duree", fr: "Durée (min)", ar: "المدة (د)", kind: "num", def: 2, min: 0, max: 120, step: 1 },
      { id: "w", fr: "Poids", ar: "الوزن", kind: "num", def: 70, min: 2, max: 150, step: 5, unit: "kg" },
      { id: "gly", fr: "Glycémie", ar: "السكر", kind: "num", def: 1, min: 0.2, max: 6, step: 0.1, unit: "g/L", group: "bio" },
      { id: "ct", hosp: true, fr: "Scanner (1ʳᵉ crise/foyer)", ar: "سكانر (أولى نوبة/بؤرة)", kind: "choice", def: "none", group: "img", options: [
        { id: "none", fr: "Non fait", ar: "لم يُعمل" },
        { id: "normal", fr: "Normal", ar: "سليم" },
        { id: "lesion", fr: "Lésion aiguë", ar: "آفة حادة" },
      ] },
    ],
    defs: [
      { fr: "État de mal établi (> 5 min)", ar: "حالة صرعية قائمة (> 5 د)", when: (v) => n(v, "duree") > 5 },
      { fr: "État de mal réfractaire (> 30 min)", ar: "حالة صرعية معندة (> 30 د)", when: (v) => n(v, "duree") > 30 },
      { fr: "Hypoglycémie causale", ar: "نقص سكر مسبب", when: (v) => n(v, "gly") < 0.7 },
      { fr: "Lésion structurale : imagerie + avis", ar: "آفة بنيوية: تصوير + رأي", when: (v) => c(v, "ct") === "lesion" },
    ],
    steps: [
      { fr: "Protéger + O2 + glycémie maintenant", ar: "حماية + أكسجين + سكر الآن", when: () => true },
      { fr: "Midazolam IM 0,2 mg/kg (max 10 mg)", ar: "ميدازولام عضلياً 0,2 ملغ/كغ (حد 10 ملغ)", when: (v) => n(v, "duree") > 5, detail: (v) => `${Math.min(10, +(n(v, "w") * 0.2).toFixed(1)).toFixed(1)} mg` },
      { fr: "D50 si hypoglycémie", ar: "D50 إن نقص سكر", when: (v) => n(v, "gly") < 0.7 },
      { fr: "2ᵉ ligne IV : valproate/lévétiracetam si > 10 min", ar: "خط ثان وريدي: فالبروات/ليفيتيراسيتام إن > 10 د", when: (v) => n(v, "duree") > 10 },
      { fr: "> 30 min : intubation + USI", hospOnly: true, ar: "> 30 د: تنبيب + عناية مركزة", when: (v) => n(v, "duree") > 30 },
      { fr: "Surveillance respiration/conscience après benzodiazépines", ar: "مراقبة تنفس/وعي بعد البنزوديازيبين", when: () => true },
    ],
  },
  {
    id: "chaleur", sev: 1, fr: "Coup de chaleur", ar: "ضربة حر", href: "/calculateurs/coup-chaleur",
    fields: [
      { id: "t", fr: "T° centrale", ar: "الحرارة المركزية", kind: "num", def: 38, min: 34, max: 44, step: 0.5, unit: "°C" },
      { id: "gcs", fr: "Glasgow", ar: "غلاسكو", kind: "num", def: 15, min: 3, max: 15, step: 1 },
      { id: "cpk", hosp: true, fr: "CPK", ar: "CPK", kind: "num", def: 300, min: 0, max: 100000, step: 100, unit: "UI/L", group: "bio" },
    ],
    defs: [
      { fr: "Coup de chaleur (≥ 40 + neuro)", ar: "ضربة حر (≥ 40 + عصبي)", when: (v) => n(v, "t") >= 40 && n(v, "gcs") < 15 },
      { fr: "Hyperthermie extrême (≥ 41)", ar: "فرط حرارة شديد (≥ 41)", when: (v) => n(v, "t") >= 41 },
      { fr: "Rhabdomyolyse (CPK > 1000)", ar: "انحلال ربيدات (CPK > 1000)", when: (v) => n(v, "cpk") > 1000 },
    ],
    steps: [
      { fr: "Refroidissement immédiat (eau/immersion) maintenant", ar: "تبريد فوري (ماء/غمر) الآن", when: (v) => n(v, "t") >= 40 },
      { fr: "Stopper le refroidissement actif à 39 °C", ar: "أوقف التبريد الفعّال عند 39°", when: (v) => n(v, "t") >= 40 },
      { fr: "Hyperhydratation si rhabdomyolyse (rein)", ar: "إرواء وريدي وفير إن انحلال ربيدات (كلية)", when: (v) => n(v, "cpk") > 1000 },
      { fr: "Protéger la voie aérienne si GCS < 9", ar: "حماية المجرى إن غلاسكو < 9", when: (v) => n(v, "gcs") < 9 },
      { fr: "T° q10 min — stopper le refroidissement actif à 39 °C", ar: "حرارة كل 10 د — إيقاف التبريد الفعال عند 39", when: () => true },
    ],
  },
  {
    id: "avc", sev: 1, fr: "AVC — imagerie adaptative", ar: "سكتة دماغية — تصوير تفاعلي", href: "/protocoles/avc",
    fields: [
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 140, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "gly", fr: "Glycémie", ar: "السكر", kind: "num", def: 1, min: 0.2, max: 6, step: 0.1, unit: "g/L", group: "bio" },
      { id: "ct", hosp: true, fr: "Scanner cérébral", ar: "سكانر دماغ", kind: "choice", def: "none", group: "img", options: [
        { id: "none", fr: "Non fait", ar: "لم يُعمل" },
        { id: "normal", fr: "Normal / ischémie débutante", ar: "سليم / إقفارية باكراً" },
        { id: "hemo", fr: "Hémorragie", ar: "نزف" },
        { id: "gv", fr: "Occlusion gros vaisseau", ar: "انسداد وعاء كبير" },
      ] },
    ],
    defs: [
      { fr: "AVC hémorragique : thrombolyse CONTRE-INDIQUÉE", ar: "سكتة نزفية: الإذابة ممنوعة", when: (v) => c(v, "ct") === "hemo" },
      { fr: "Gros vaisseau : thrombectomie", ar: "وعاء كبير: استئصال خثرة", when: (v) => c(v, "ct") === "gv" },
      { fr: "HTA limitant la thrombolyse (≥ 185)", ar: "ضغط يحدّ من الإذابة (≥ 185)", when: (v) => n(v, "pas") >= 185 && c(v, "ct") !== "hemo" },
      { fr: "Hypoglycémie : faux AVC", ar: "نقص سكر: محاكي سكتة", when: (v) => n(v, "gly") < 0.7 },
    ],
    steps: [
      { fr: "Scanner non injecté immédiatement", hospOnly: true, ar: "سكانر بلا حقن فوراً", when: (v) => c(v, "ct") === "none" },
      { fr: "Thrombolyse < 4 h 30 si ischémique + PAS < 185", hospOnly: true, ar: "إذابة خلال 4 س 30 إن إقفارية + ضغط < 185", when: (v) => (c(v, "ct") === "normal") && n(v, "pas") < 185 && n(v, "gly") >= 0.7, go: { href: "/protocoles/avc", fr: "Protocole AVC", ar: "بروتوكول السكتة" } },
      { fr: "Thrombectomie < 6 h (jusqu'à 24 h selon imagerie)", hospOnly: true, ar: "استئصال خثرة < 6 س (إلى 24 س حسب التصوير)", when: (v) => c(v, "ct") === "gv", go: { href: "/protocoles/avc", fr: "Protocole AVC", ar: "بروتوكول السكتة" } },
      { fr: "Hémorragie : arrêt anticoagulants + neurochir + contrôle TA", hospOnly: true, ar: "نزف: إيقاف مميعات + جراحة أعصاب + ضبط ضغط", when: (v) => c(v, "ct") === "hemo" },
      { fr: "Aspirine si ischémique hors thrombolyse", ar: "أسبرين إن إقفارية خارج الإذابة", when: (v) => c(v, "ct") === "normal" && n(v, "pas") >= 185 },
      { fr: "Pré-hospitalier : transport direct + pré-alerte (imagerie/thrombectomie à la structure)", preOnly: true, ar: "ميدانياً: نقل مباشر + إعلان مسبق (تصوير/استئصال بالمرفق)", when: () => true },
      { fr: "Surveillance neurologique q15 min + glycémie", ar: "مراقبة عصبية كل 15 د + سكر", when: () => true },
    ],
  },
  {
    id: "dka", sev: 2, fr: "Acidocétose diabétique", ar: "حُماض كيتوني سكري", href: "/calculateurs/dka-h1",
    fields: [
      { id: "gly", fr: "Glycémie", ar: "السكر", kind: "num", def: 4, min: 0.5, max: 30, step: 0.5, unit: "g/L" },
      { id: "k", fr: "Kaliémie", ar: "البوتاسيوم", kind: "num", def: 4, min: 1.5, max: 9, step: 0.1, unit: "mmol/L" },
      { id: "w", fr: "Poids", ar: "الوزن", kind: "num", def: 70, min: 2, max: 150, step: 5, unit: "kg" },
      { id: "ph", fr: "pH / bicarb", ar: "pH / فحمات", kind: "choice", def: "none", group: "bio", options: [
        { id: "none", fr: "Non fait", ar: "لم يُعمل" },
        { id: "ok", fr: "pH > 7,1", ar: "pH > 7,1" },
        { id: "bas", fr: "pH 6,9-7,1", ar: "pH 6,9-7,1" },
        { id: "crit", fr: "pH < 6,9", ar: "pH < 6,9" },
      ] },
    ],
    defs: [
      { fr: "Hypokaliémie dangereuse (< 3,3) : insuline HOLD", ar: "نقص بوتاسيوم خطر (< 3,3): أوقف الأنسولين", when: (v) => n(v, "k") < 3.3 },
      { fr: "Hyperkaliémie", ar: "فرط بوتاسيوم", when: (v) => n(v, "k") > 5.5 },
      { fr: "Acidose sévère (pH < 6,9) : USI", ar: "حماض شديد (pH < 6,9): عناية مركزة", when: (v) => c(v, "ph") === "crit" },
    ],
    steps: [
      { fr: "NaCl 0,9 % : 10-15 mL/kg en 1 h", ar: "ملح 0,9%: 10-15 مل/كغ خلال ساعة", when: () => true, detail: (v) => `${Math.round(n(v, "w") * 10)}-${Math.round(n(v, "w") * 15)} mL` },
      { fr: "Corriger K+ AVANT insuline si K < 3,3", ar: "صحح البوتاسيوم قبل الأنسولين إن < 3,3", when: (v) => n(v, "k") < 3.3 },
      { fr: "Insuline rapide 0,1 UI/kg/h", ar: "أنسولين سريع 0,1 وحدة/كغ/س", when: (v) => n(v, "k") >= 3.3, detail: (v) => `${(n(v, "w") * 0.1).toFixed(1)} UI/h` },
      { fr: "Glucosé quand glycémie < 2,5 g/L (poursuivre insuline)", ar: "غلوكوز عند سكر < 2,5 غ/ل (مع مواصلة الأنسولين)", when: (v) => n(v, "gly") < 2.5 },
      { fr: "K+ et glycémie q1-2 h", ar: "بوتاسيوم وسكر كل 1-2 س", when: () => true },
      { fr: "Glycémie horaire + K+ q2 h + conscience", ar: "سكر كل ساعة + بوتاسيوم كل ساعتين + وعي", when: () => true },
    ],
  },
  {
    id: "hyperk", sev: 2, fr: "Hyperkaliémie", ar: "فرط بوتاسيوم", href: "/calculateurs/hyperkalemie",
    fields: [
      { id: "k", fr: "Kaliémie", ar: "البوتاسيوم", kind: "num", def: 4, min: 1.5, max: 9, step: 0.1, unit: "mmol/L" },
      { id: "w", fr: "Poids", ar: "الوزن", kind: "num", def: 70, min: 2, max: 150, step: 5, unit: "kg" },
      { id: "ecg", fr: "ECG", ar: "تخطيط", kind: "choice", def: "normal", group: "ecg", options: [
        { id: "normal", fr: "Normal", ar: "سليم" },
        { id: "t", fr: "T pointues / QRS large", ar: "T مدببة / QRS واسع" },
        { id: "sinus", fr: "Pré-sinusoidal (sinusoïde)", ar: "جريبي (شكل موجي)" },
      ] },
    ],
    defs: [
      { fr: "Hyperkaliémie sévère (≥ 6,5)", ar: "فرط شديد (≥ 6,5)", when: (v) => n(v, "k") >= 6.5 },
      { fr: "Danger cardiaque : ECG anormal", ar: "خطر قلبي: تخطيط مضطرب", when: (v) => c(v, "ecg") !== "normal" },
      { fr: "Arrêt imminent (sinusoïde)", ar: "توقف وشيك (شكل موجي)", when: (v) => c(v, "ecg") === "sinus" },
    ],
    steps: [
      { fr: "Gluconate Ca 10 % 10 mL IV (stabiliser le myocarde)", ar: "غلوكونات كالسيوم 10% 10 مل وريدياً (تثبيت القلب)", when: (v) => c(v, "ecg") !== "normal" || n(v, "k") >= 6.5, detail: (v) => (n(v, "w") < 30 ? `${Math.min(10, n(v, "w"))} mL (enfant)` : "10 mL") },
      { fr: "Insuline 10 UI + G50 250 mL (déplacement)", ar: "أنسولين 10 وحدات + G50 250 مل (إزاحة)", when: (v) => n(v, "k") >= 5.5 },
      { fr: "Salbutamol néb. haute dose", ar: "سالبوتامول رذّاً بجرعة عالية", when: (v) => n(v, "k") >= 5.5 },
      { fr: "Préparer RCP si sinusoïde", ar: "تجهيز إنعاش إن شكل موجي", when: (v) => c(v, "ecg") === "sinus", go: { href: "/calculateurs/rcp-equipe", fr: "Assistant RCP", ar: "مساعد الإنعاش" } },
      { fr: "Néphrologie si réfractaire (épuration)", hospOnly: true, ar: "كلوية إن معند (تنقية)", when: (v) => n(v, "k") >= 6.5 },
      { fr: "ECG + contrôle K+ après traitement", ar: "تخطيط + فحص بوتاسيوم بعد العلاج", when: () => true },
    ],
  },
  {
    id: "noyade", sev: 2, fr: "Noyade / hypothermie", ar: "غرق / انخفاض حرارة", href: "/calculateurs/noyade",
    fields: [
      { id: "t", fr: "T° centrale", ar: "الحرارة المركزية", kind: "num", def: 37, min: 20, max: 42, step: 0.5, unit: "°C" },
      { id: "spo2", fr: "SpO2", ar: "تشبع", kind: "num", def: 98, min: 50, max: 100, step: 1, unit: "%" },
      { id: "gcs", fr: "Glasgow", ar: "غلاسكو", kind: "num", def: 15, min: 3, max: 15, step: 1 },
      { id: "rx", hosp: true, fr: "Radio thorax", ar: "صورة صدر", kind: "choice", def: "none", group: "img", options: [
        { id: "none", fr: "Non faite", ar: "لم تُعمل" },
        { id: "normal", fr: "Normale", ar: "سليمة" },
        { id: "ards", fr: "Infiltrats bilatéraux (SDRA)", ar: "ارتشاح ثنائي (SDRA)" },
      ] },
    ],
    defs: [
      { fr: "Hypothermie modérée-sévère (< 32)", ar: "انخفاض متوسط-شديد (< 32)", when: (v) => n(v, "t") < 32 },
      { fr: "Risque d'arythmie (< 28)", ar: "خطر اضطراب نظم (< 28)", when: (v) => n(v, "t") < 28 },
      { fr: "SDRA / œdème pulmonaire lésionnel", ar: "SDRA / وذمة رئة أذئية", when: (v) => c(v, "rx") === "ards" },
    ],
    steps: [
      { fr: "O2 si SpO2 < 94 % — protéger la voie aérienne si GCS < 9", ar: "أكسجين إن تشبع < 94% — حماية المجرى إن غلاسكو < 9", when: (v) => n(v, "spo2") < 94 || n(v, "gcs") < 9 },
      { fr: "Ventilation protectrice si SDRA", hospOnly: true, ar: "تهوية واقية إن SDRA", when: (v) => c(v, "rx") === "ards" },
      { fr: "Réchauffement passif (≥ 32) / actif externe (28-32)", ar: "تدفئة سلبية (≥ 32) / خارجية فعالة (28-32)", when: (v) => n(v, "t") < 35 && n(v, "t") >= 28 },
      { fr: "Réchauffement interne + centre ECMO si < 28 instable", ar: "تدفئة داخلية + مركز ECMO إن < 28 غير مستقر", when: (v) => n(v, "t") < 28 },
      { fr: "Hospitaliser si SpO2 < 94, GCS < 15 ou immersion > 5 min", ar: "إدخال إن تشبع < 94 أو غلاسكو < 15 أو غمر > 5 د", when: (v) => n(v, "spo2") < 94 || n(v, "gcs") < 15 },
      { fr: "SpO2/FR q10 min — SDRA différé : surveiller 24 h", ar: "تشبع/تردد كل 10 د — ضائقة متأخرة: مراقبة 24 س", when: () => true },
    ],
  },
  {
    id: "hdo", sev: 2, fr: "Hémorragie digestive haute", ar: "نزف هضمي علوي", href: "/calculateurs/hemo-digestive",
    fields: [
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "fc", fr: "FC", ar: "النبض", kind: "num", def: 90, min: 20, max: 220, step: 5, unit: "/min" },
      { id: "melena", fr: "Méléna/hématémèse", ar: "قطران/قيء دموي", kind: "bool", def: false },
      { id: "cirrhose", fr: "Cirrhose/HTP", ar: "تشمع/فرط توتر بابي", kind: "bool", def: false },
      { id: "hb", hosp: true, fr: "Hémoglobine", ar: "خضاب", kind: "num", def: 12, min: 2, max: 20, step: 0.5, unit: "g/dL", group: "bio" },
    ],
    defs: [
      { fr: "Choc hypovolémique", ar: "صدمة نقص حجم", when: (v) => n(v, "pas") < 90 || n(v, "fc") > 120 },
      { fr: "Anémie sévère (Hb < 7) : transfuser", ar: "فقر شديد (خضاب < 7): نقل", when: (v) => n(v, "hb") < 7 },
      { fr: "Risque de saignement variqueux", ar: "خطر نزف دوالي", when: (v) => b(v, "cirrhose") },
    ],
    steps: [
      { fr: "2 voies veineuses + groupage + cross-match", ar: "طريقان وريديان + زمرة + توافق", when: () => true },
      { fr: "Remplissage + transfusion (Hb cible > 7)", ar: "توسيع + نقل دم (خضاب هدف > 7)", when: (v) => n(v, "pas") < 90 || n(v, "fc") > 120 || n(v, "hb") < 7, go: { href: "/calculateurs/transfusion", fr: "Transfusion", ar: "نقل الدم" } },
      { fr: "IPP : ésoméprazole 80 mg IV bolus", ar: "مثبط مضخة: إسوميبرازول 80 ملغ دفعاً وريدياً", when: () => true },
      { fr: "Octréotide + ceftriaxone si cirrhose", ar: "أوكتريوتيد + سيفترياكسون إن تشمع", when: (v) => b(v, "cirrhose") },
      { fr: "Endoscopie < 24 h", hospOnly: true, ar: "تنظير خلال 24 س", when: () => true },
      { fr: "Pré-hospitalier : 2 VVP + transport rapide", preOnly: true, ar: "ميدانياً: طريقان وريديان + نقل سريع", when: () => true },
      { fr: "PAS/FC q10 min + diurèse", ar: "ضغط/نبض كل 10 د + بول", when: () => true },
    ],
  },
  {
    id: "hypo", sev: 2, fr: "Hypoglycémie", ar: "نقص سكر", href: "/calculateurs/hypoglycemie",
    fields: [
      { id: "gly", fr: "Glycémie", ar: "السكر", kind: "num", def: 1, min: 0.2, max: 6, step: 0.1, unit: "g/L" },
      { id: "gcs", fr: "Glasgow", ar: "غلاسكو", kind: "num", def: 15, min: 3, max: 15, step: 1 },
      { id: "w", fr: "Poids", ar: "الوزن", kind: "num", def: 70, min: 2, max: 150, step: 5, unit: "kg" },
      { id: "ped", fr: "Enfant", ar: "طفل", kind: "bool", def: false },
    ],
    defs: [
      { fr: "Hypoglycémie sévère (< 0,5)", ar: "نقص سكر شديد (< 0,5)", when: (v) => n(v, "gly") < 0.5 },
      { fr: "Atteinte neurologique", ar: "تأثر عصبي", when: (v) => n(v, "gcs") < 12 },
    ],
    steps: [
      { fr: "Conscient : sucres rapides per os 15-30 g", ar: "واعٍ: سكريات سريعة فموياً 15-30 غ", when: (v) => n(v, "gcs") === 15 && n(v, "gly") < 0.7 },
      { fr: "IV : D10 5 mL/kg (enfant) ou D50 50 mL (adulte)", ar: "وريدي: D10 5 مل/كغ (طفل) أو D50 50 مل (كبير)", when: (v) => n(v, "gcs") < 15 && n(v, "gly") < 0.7, detail: (v) => (b(v, "ped") ? `${Math.round(n(v, "w") * 5)} mL de D10` : "50 mL de D50") },
      { fr: "Sans voie veineuse : glucagon 1 mg IM", ar: "بلا وريد: غلوكاغون 1 ملغ عضلياً", when: (v) => n(v, "gcs") < 15 && n(v, "gly") < 0.7 },
      { fr: "Recontrôle glycémie à 15 min", ar: "إعادة قياس السكر بعد 15 د", when: (v) => n(v, "gly") < 0.7 },
      { fr: "ECG + T° q10 min pendant le réchauffement + K+", ar: "تخطيط + حرارة كل 10 د أثناء التدفئة + بوتاسيوم", when: () => true },
    ],
  },
  {
    id: "hpp", sev: 1, fr: "Hémorragie du post-partum", ar: "نزف ما بعد الولادة", href: "/calculateurs/hpp",
    fields: [
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "fc", fr: "FC", ar: "النبض", kind: "num", def: 90, min: 20, max: 220, step: 5, unit: "/min" },
      { id: "atonie", fr: "Utonus mou (atonie)", ar: "رحم مرتخٍ (وهن)", kind: "bool", def: false },
      { id: "plaie", fr: "Saignement persistant malgré utérus ferme", ar: "نزف مستمر رغم رحم متقلص", kind: "bool", def: false },
    ],
    defs: [
      { fr: "Choc hémorragique", ar: "صدمة نزفية", when: (v) => n(v, "pas") < 90 || n(v, "fc") > 120 },
      { fr: "Atonie utérine (1ʳᵉ cause)", ar: "وهن رحم (السبب الأول)", when: (v) => b(v, "atonie") },
      { fr: "Plaie/rupture : chirurgie", ar: "جرح/تمزق: جراحة", when: (v) => b(v, "plaie") },
    ],
    steps: [
      { fr: "Massage utérin immédiat maintenant", ar: "تمسيد رحمي فوراً الآن", when: () => true },
      { fr: "Ocytocine 10 UI IV/IM maintenant", ar: "أوكسيتوسين 10 وحدات وريدياً/عضلياً الآن", when: () => true },
      { fr: "ATX 1 g IV (< 3 h)", ar: "ATX 1 غ وريدياً (قبل 3 س)", when: () => true },
      { fr: "Misoprostol 800 µg SL si atonie persistante", ar: "ميزوبروستول 800 مكغ تحت اللسان إن وهن مستمر", when: (v) => b(v, "atonie") },
      { fr: "Chirurgie/embolisation si plaie ou échec", hospOnly: true, ar: "جراحة/إصمام إن جرح أو فشل", when: (v) => b(v, "plaie") },
      { fr: "Transport rapide + pré-alerte maternité/chirurgie", preOnly: true, ar: "نقل سريع + إعلان مسبق لتوليد/جراحة", when: () => true, go: { href: "/calculateurs/transfusion", fr: "Transfusion", ar: "نقل الدم" } },
      { fr: "TA/FC q15 min + diurèse pendant le massage", ar: "ضغط/نبض كل 15 د + بول أثناء التمسيد", when: () => true },
    ],
  },
  {
    id: "neonat", sev: 1, fr: "Nouveau-né — minute d'or", ar: "وليد — الدقيقة الذهبية", href: "/calculateurs/neonat-ran",
    fields: [
      { id: "w", fr: "Poids", ar: "الوزن", kind: "num", def: 3, min: 0.5, max: 5, step: 0.5, unit: "kg" },
      { id: "fc", fr: "FC", ar: "النبض", kind: "num", def: 140, min: 0, max: 220, step: 5, unit: "/min" },
      { id: "resp", fr: "Respiration efficace", ar: "تنفس فعال", kind: "bool", def: true },
    ],
    defs: [
      { fr: "FC < 100 : VPP immédiate", ar: "نبض < 100: تهوية فورية", when: (v) => n(v, "fc") < 100 },
      { fr: "FC < 60 : massage + adrénaline", ar: "نبض < 60: تدليك + أدرنالين", when: (v) => n(v, "fc") < 60 },
    ],
    steps: [
      { fr: "Sécher + stimuler + position + chaleur maintenant", ar: "تجفيف + تحفيز + وضع + دفء الآن", when: () => true },
      { fr: "VPP dans les 60 s si apnée ou FC < 100", ar: "تهوية خلال 60 ث إن انقطاع نفس أو نبض < 100", when: (v) => !b(v, "resp") || n(v, "fc") < 100 },
      { fr: "Massage 3:1 + adrénaline 0,01-0,03 mg/kg si FC < 60", ar: "تدليك 3:1 + أدرنالين 0,01-0,03 ملغ/كغ إن نبض < 60", when: (v) => n(v, "fc") < 60, detail: (v) => `${(n(v, "w") * 0.1).toFixed(1)}-${(n(v, "w") * 0.3).toFixed(1)} mL (1:10 000)` },
      { fr: "O2 selon cibles pré/post-ductales", ar: "أكسجين حسب الأهداف القبلية/البعدية", when: () => true },
      { fr: "Réévaluation q30 s (FC/SpO2 préductale) pendant la minute d'or", ar: "إعادة تقييم كل 30 ث (نبض/تشبع) في الدقيقة الذهبية", when: () => true },
    ],
  },
  {
    id: "asthme", sev: 1, fr: "Asthme aigu sévère", ar: "ربو حاد شديد", href: "/calculateurs/asthme",
    fields: [
      { id: "spo2", fr: "SpO2", ar: "تشبع", kind: "num", def: 98, min: 50, max: 100, step: 1, unit: "%" },
      { id: "fr", fr: "FR", ar: "التنفس", kind: "num", def: 20, min: 6, max: 60, step: 1, unit: "/min" },
      { id: "w", fr: "Poids", ar: "الوزن", kind: "num", def: 70, min: 2, max: 150, step: 5, unit: "kg" },
      { id: "silence", fr: "Silence auscultatoire", ar: "صمت سماعي", kind: "bool", def: false },
    ],
    defs: [
      { fr: "Asthme sévère (SpO2 < 92)", ar: "ربو شديد (تشبع < 92)", when: (v) => n(v, "spo2") < 92 },
      { fr: "Épuisement / silence : arrêt imminent", ar: "إنهاك/صمت: توقف وشيك", when: (v) => b(v, "silence") || n(v, "fr") > 30 },
    ],
    steps: [
      { fr: "Salbutamol 2,5-5 mg néb. q20 min + ipratropium", ar: "سالبوتامول 2,5-5 ملغ رذّاً كل 20 د + إبراتروبيوم", when: () => true },
      { fr: "Corticoïde systémique maintenant (prednisolone PO / méthylprednisolone IV)", ar: "كورتيكويد جهازي الآن (بريدنيزولون فموي / ميثيلبريدنيزولون وريدي)", when: () => true },
      { fr: "Sulfate de Mg 2 g IV si sévère (enfant 25-50 mg/kg max 2 g)", ar: "كبريتات مغنازيوم 2 غ وريدياً إن شديد (طفل 25-50 ملغ/كغ حد 2 غ)", when: (v) => n(v, "spo2") < 92, detail: (v) => (n(v, "w") < 30 ? `${Math.min(2000, Math.round(n(v, "w") * 50))} mg` : "2 g") },
      { fr: "O2 cibler ≥ 94 %", ar: "أكسجين لاستهداف ≥ 94%", when: (v) => n(v, "spo2") < 94 },
      { fr: "Préparer intubation si silence/épuisement", ar: "تجهيز تنبيب إن صمت/إنهاك", when: (v) => b(v, "silence") || n(v, "fr") > 30 },
      { fr: "Réévaluation FR/SpO2/sibilants q20 min", ar: "إعادة تقييم تردد/تشبع/أزيز كل 20 د", when: () => true },
    ],
  },
  {
    id: "hypoT", sev: 2, fr: "Hypothermie (stades suisses)", ar: "انخفاض حرارة (المراحل السويسرية)", href: "/calculateurs/hypothermie",
    fields: [
      { id: "t", fr: "T° centrale", ar: "الحرارة المركزية", kind: "num", def: 36, min: 20, max: 42, step: 0.5, unit: "°C" },
      { id: "gcs", fr: "Glasgow", ar: "غلاسكو", kind: "num", def: 15, min: 3, max: 15, step: 1 },
      { id: "ecg", fr: "ECG", ar: "تخطيط", kind: "choice", def: "normal", group: "ecg", options: [
        { id: "normal", fr: "Normal", ar: "سليم" },
        { id: "osborn", fr: "Onde J / bradycardie", ar: "موجة J / بطء" },
        { id: "fv", fr: "FV / asystolie", ar: "رجفان بطيني/سكون" },
      ] },
    ],
    defs: [
      { fr: "Stade II (28-32) : réchauffement actif externe", ar: "مرحلة II (28-32): تدفئة خارجية فعالة", when: (v) => n(v, "t") < 32 && n(v, "t") >= 28 },
      { fr: "Stade III-IV (< 28) : arythmie/arrêt", ar: "مرحلة III-IV (< 28): اضطراب/توقف", when: (v) => n(v, "t") < 28 || c(v, "ecg") !== "normal" },
    ],
    steps: [
      { fr: "Déshabiller + manipulations douces (arythmies)", ar: "تعرية + حركات لطيفة (اضطرابات نظم)", when: () => true },
      { fr: "Réchauffement passif si ≥ 32, actif externe 28-32", ar: "تدفئة سلبية إن ≥ 32، خارجية فعالة 28-32", when: (v) => n(v, "t") < 35 && n(v, "t") >= 28 },
      { fr: "Réchauffement interne + ECMO si < 28 instable", hospOnly: true, ar: "تدفئة داخلية + ECMO إن < 28 غير مستقر", when: (v) => n(v, "t") < 28 },
      { fr: "Transport doux + pré-alerte centre ECMO si < 28", preOnly: true, ar: "نقل لطيف + إعلان مسبق لمركز ECMO إن < 28", when: (v) => n(v, "t") < 28 },
      { fr: "RCP prolongée si arrêt (le froid protège)", ar: "إنعاش مطول إن توقف (البرد يحمي)", when: (v) => c(v, "ecg") === "fv", go: { href: "/calculateurs/rcp-equipe", fr: "Assistant RCP", ar: "مساعد الإنعاش" } },
      { fr: "ECG + T° q10 min — arythmie possible au réchauffement", ar: "تخطيط + حرارة كل 10 د — نظم محتمل أثناء التدفئة", when: () => true },
    ],
  },
  {
    id: "agitation", sev: 2, fr: "Agitation aiguë", ar: "هياج حاد", href: "/calculateurs/agitation",
    fields: [
      { id: "spo2", fr: "SpO2", ar: "تشبع", kind: "num", def: 98, min: 50, max: 100, step: 1, unit: "%" },
      { id: "gly", fr: "Glycémie", ar: "السكر", kind: "num", def: 1, min: 0.2, max: 6, step: 0.1, unit: "g/L", group: "bio" },
      { id: "danger", fr: "Danger immédiat", ar: "خطر فوري", kind: "bool", def: false },
    ],
    defs: [
      { fr: "Agitation hypoxique : traiter la cause", ar: "هياج نقص أكسجة: عالج السبب", when: (v) => n(v, "spo2") < 92 },
      { fr: "Hypoglycémie : D50 avant tout", ar: "نقص سكر: D50 قبل كل شيء", when: (v) => n(v, "gly") < 0.7 },
      { fr: "Danger : sédation IM", ar: "خطر: تسكين عضلي", when: (v) => b(v, "danger") },
    ],
    steps: [
      { fr: "Dé-escalade verbale 1ʳ ligne maintenant", ar: "تهدئة لفظية خطاً أولاً الآن", when: () => true },
      { fr: "O2 / D50 si anomalie (causes traitables)", ar: "أكسجين / D50 إن شذوذ (أسباب قابلة للعلاج)", when: (v) => n(v, "spo2") < 92 || n(v, "gly") < 0.7 },
      { fr: "Halopéridol 5 mg IM ± midazolam 5 mg IM si danger", ar: "هالوبيريدول 5 ملغ عضلياً ± ميدازولام 5 ملغ عضلياً إن خطر", when: (v) => b(v, "danger") },
      { fr: "ECG si halopéridol (QT)", ar: "تخطيط إن هالوبيريدول (QT)", when: (v) => b(v, "danger") },
      { fr: "Contention physique en dernier recours", ar: "تثبيت فيزيائي ملاذاً أخيراً", when: (v) => b(v, "danger") },
      { fr: "Surveillance SpO2/sédation + ECG QT après halopéridol", ar: "مراقبة تشبع/تهدئة + تخطيط QT بعد هالوبيريدول", when: () => true },
    ],
  },
  {
    id: "tetanos", sev: 3, fr: "Plaie & tétanos", ar: "جرح وكزاز", href: "/calculateurs/tetanos",
    fields: [
      { id: "plaie", fr: "Plaie à risque", ar: "جرح خطر", kind: "bool", def: false },
      { id: "vax", fr: "Vaccination", ar: "التلقيح", kind: "choice", def: "ok", options: [
        { id: "ok", fr: "À jour", ar: "محدّث" },
        { id: "incomplet", fr: "Incomplète", ar: "غير كامل" },
        { id: "inconnu", fr: "Inconnue", ar: "مجهول" },
      ] },
    ],
    defs: [
      { fr: "Risque tétanos : rappel ± Ig", ar: "خطر كزاز: معزز ± غلوبولينات", when: (v) => b(v, "plaie") && c(v, "vax") !== "ok" },
    ],
    steps: [
      { fr: "Nettoyage + parage maintenant", ar: "تنظيف + تنضير الآن", when: () => true },
      { fr: "Rappel Td/Tdap si incomplète", ar: "معزز Td/Tdap إن غير كامل", when: (v) => c(v, "vax") === "incomplet" },
      { fr: "Ig antitétaniques 250 UI IM si plaie à risque + statut inconnu/incomplet", ar: "غلوبولينات كزاز 250 و عضلياً إن جرح خطر + وضع مجهول/غير كامل", when: (v) => b(v, "plaie") && c(v, "vax") !== "ok" },
      { fr: "Surveillance spasmes/voie aérienne", ar: "مراقبة تشنجات/مجرى هوائي", when: () => true },
    ],
  },
  {
    id: "ep", sev: 1, fr: "Embolie pulmonaire", ar: "انصمام رئوي", href: "/calculateurs/heparine",
    fields: [
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "fc", fr: "FC", ar: "النبض", kind: "num", def: 90, min: 20, max: 220, step: 5, unit: "/min" },
      { id: "spo2", fr: "SpO2", ar: "تشبع", kind: "num", def: 98, min: 50, max: 100, step: 1, unit: "%" },
      { id: "echo", fr: "Écho (VD)", ar: "إيكو (بطين أيمن)", kind: "choice", def: "none", hosp: true, group: "img", options: [
        { id: "none", fr: "Non faite", ar: "لم يُعمل" },
        { id: "dilat", fr: "VD dilaté", ar: "بطين أيمن متوسع" },
        { id: "normal", fr: "Normal", ar: "سليم" },
      ] },
    ],
    defs: [
      { fr: "EP haut risque (PAS < 90) : thrombolyse", ar: "انصمام عالي الخطورة (ضغط < 90): إذابة", when: (v) => n(v, "pas") < 90 },
      { fr: "Souffrance VD", ar: "معاناة بطين أيمن", when: (v) => c(v, "echo") === "dilat" },
      { fr: "Hypoxémie", ar: "نقص أكسجة", when: (v) => n(v, "spo2") < 92 },
    ],
    steps: [
      { fr: "O2 + 2 VVP + monitorage", ar: "أكسجين + طريقان وريديان + مراقبة", when: () => true },
      { fr: "Anticoagulation (HBPM/HNF) maintenant", ar: "مضاد تخثر (وزني/غير مجزأ) الآن", when: () => true, go: { href: "/calculateurs/heparine", fr: "Héparine", ar: "هيبارين" } },
      { fr: "Thrombolyse (altéplase) si PAS < 90", hospOnly: true, ar: "إذابة (ألتيبلاز) إن ضغط < 90", when: (v) => n(v, "pas") < 90 },
      { fr: "Pré-hospitalier : transport direct + O2 si PAS < 90", preOnly: true, ar: "ميدانياً: نقل مباشر + أكسجين إن ضغط < 90", when: (v) => n(v, "pas") < 90 },
    ],
  },
  {
    id: "meningite", sev: 1, fr: "Méningite / purpura", ar: "التهاب سحايا / فرفرية",
    fields: [
      { id: "t", fr: "T°", ar: "الحرارة", kind: "num", def: 38, min: 34, max: 42, step: 0.5, unit: "°C" },
      { id: "gcs", fr: "Glasgow", ar: "غلاسكو", kind: "num", def: 15, min: 3, max: 15, step: 1 },
      { id: "purpura", fr: "Purpura fulminans", ar: "فرفرية صاعقة", kind: "bool", def: false },
      { id: "raideur", fr: "Raideur de nuque", ar: "صلابة نقرية", kind: "bool", def: false },
      { id: "pl", fr: "Ponction lombaire", ar: "بزل قطني", kind: "choice", def: "none", hosp: true, group: "bio", options: [
        { id: "none", fr: "Non faite", ar: "لم يُعمل" },
        { id: "purulent", fr: "Purulente", ar: "قيحي" },
        { id: "normal", fr: "Normale", ar: "سليم" },
      ] },
    ],
    defs: [
      { fr: "Purpura fulminans : méningococcémie", ar: "فرفرية صاعقة: تجرثم سحائي", when: (v) => b(v, "purpura") },
      { fr: "Syndrome méningé fébrile", ar: "متلازمة سحائية حمّية", when: (v) => b(v, "raideur") && n(v, "t") >= 38 },
      { fr: "Coma", ar: "غيبوبة", when: (v) => n(v, "gcs") < 9 },
    ],
    steps: [
      { fr: "Ceftriaxone 2 g IV/IM IMMÉDIATEMENT si purpura (sans attendre)", ar: "سيفترياكسون 2 غ وريدياً/عضلياً فوراً إن فرفرية (دون انتظار)", when: (v) => b(v, "purpura") },
      { fr: "Antibiothérapie avant PL si suspicion forte", ar: "مضاد قبل البزل إن اشتباه قوي", when: (v) => b(v, "raideur") && n(v, "t") >= 38 },
      { fr: "PL si pas de contre-indication (après antibio possible)", hospOnly: true, ar: "بزل قطني إن لا مضاد استطباب (بعد المضاد ممكن)", when: (v) => c(v, "pl") === "none" && !b(v, "purpura") },
      { fr: "Isolement gouttelettes", ar: "عزل رذاذي", when: () => true },
      { fr: "Protéger la voie aérienne si GCS < 9", ar: "حماية المجرى إن غلاسكو < 9", when: (v) => n(v, "gcs") < 9 },
      { fr: "Surveillance GCS/extension du purpura q30 min", ar: "مراقبة غلاسكو/امتداد الفرفرية كل 30 د", when: () => true },
    ],
  },
  {
    id: "tv", sev: 1, fr: "Tachycardies / TV", ar: "تسرعات بطينية", href: "/calculateurs/amines",
    fields: [
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "fc", fr: "FC", ar: "النبض", kind: "num", def: 100, min: 20, max: 260, step: 5, unit: "/min" },
      { id: "ecg", fr: "ECG", ar: "تخطيط", kind: "choice", def: "tv", group: "ecg", options: [
        { id: "tv", fr: "TV avec pouls", ar: "تسرع بطيني بنبض" },
        { id: "tvsans", fr: "TV sans pouls", ar: "تسرع بطيني بلا نبض" },
        { id: "fa", fr: "FA rapide", ar: "رجفان أذيني سريع" },
        { id: "tsv", fr: "TSV régulière", ar: "تسرع فوق بطيني" },
      ] },
    ],
    defs: [
      { fr: "TV sans pouls : ACR — défibriller", ar: "تسرع بطيني بلا نبض: توقف — صدمة", when: (v) => c(v, "ecg") === "tvsans" },
      { fr: "Tachycardie instable (PAS < 90)", ar: "تسرع غير مستقر (ضغط < 90)", when: (v) => n(v, "pas") < 90 },
    ],
    steps: [
      { fr: "Choc + RCP si TV sans pouls", ar: "صدمة + إنعاش إن بلا نبض", when: (v) => c(v, "ecg") === "tvsans", go: { href: "/calculateurs/rcp-equipe", fr: "Assistant RCP", ar: "مساعد الإنعاش" } },
      { fr: "Cardioversion synchronisée si instable (PAS < 90)", ar: "تقويم نظم متزامن إن غير مستقر (ضغط < 90)", when: (v) => n(v, "pas") < 90 && c(v, "ecg") !== "tvsans" },
      { fr: "Amiodarone 300 mg IV 20-60 min si TV stable", ar: "أميودارون 300 ملغ وريدياً خلال 20-60 د إن مستقر", when: (v) => n(v, "pas") >= 90 && c(v, "ecg") === "tv" },
      { fr: "Manœuvres vagales ± adénosine si TSV", ar: "مناورات مبهمية ± أدينوزين إن فوق بطيني", when: (v) => c(v, "ecg") === "tsv" && n(v, "pas") >= 90 },
      { fr: "Contrôle fréquence (bêta-bloquant) si FA stable", ar: "ضبط التردد (حاصرات بيتا) إن رجفان مستقر", when: (v) => c(v, "ecg") === "fa" && n(v, "pas") >= 90 },
    ],
  },
  {
    id: "co", sev: 2, fr: "Intoxication au CO", ar: "تسمم بأول أكسيد الكربون", href: "/protocoles/intoxication-co",
    fields: [
      { id: "gcs", fr: "Glasgow", ar: "غلاسكو", kind: "num", def: 15, min: 3, max: 15, step: 1 },
      { id: "cohb", fr: "CO-Hb (co-oxymétrie)", ar: "CO-Hb (قياس مشترك)", kind: "choice", def: "none", hosp: true, group: "bio", options: [
        { id: "none", fr: "Non mesurée", ar: "لم يُقس" },
        { id: "bas", fr: "< 10 %", ar: "< 10%" },
        { id: "moy", fr: "10-20 %", ar: "10-20%" },
        { id: "haut", fr: "> 20 %", ar: "> 20%" },
      ] },
      { id: "preg", fr: "Grossesse", ar: "حمل", kind: "bool", def: false },
    ],
    defs: [
      { fr: "SpO2 standard FAUSSEMENT normale au CO", ar: "التشبع العادي طبيعي كاذباً مع CO", when: () => true },
      { fr: "Intoxication sévère (coma / CO-Hb > 20)", ar: "تسمم شديد (غيبوبة / CO-Hb > 20)", when: (v) => n(v, "gcs") < 15 || c(v, "cohb") === "haut" },
    ],
    steps: [
      { fr: "Soustraire à l'exposition maintenant", ar: "إبعاد عن التعرض الآن", when: () => true },
      { fr: "O2 100 % haut débit immédiatement", ar: "أكسجين 100% بتدفق عالٍ فوراً", when: () => true },
      { fr: "OHB si coma / CO-Hb > 20 / grossesse", hospOnly: true, ar: "أكسجين عالي الضغط إن غيبوبة / >20 / حمل", when: (v) => n(v, "gcs") < 15 || c(v, "cohb") === "haut" || b(v, "preg") },
      { fr: "Transport + pré-alerte (filière OHB) si sévère", preOnly: true, ar: "نقل + إعلان مسبق (مسار الضغط العالي) إن شديد", when: (v) => n(v, "gcs") < 15 || c(v, "cohb") === "haut" || b(v, "preg") },
      { fr: "Surveillance conscience/ECG — rebond possible", ar: "مراقبة وعي/تخطيط — نكس محتمل", when: () => true },
    ],
  },
  {
    id: "brady", sev: 1, fr: "Bradycardie sévère", ar: "بطء قلب شديد", href: "/calculateurs/amines",
    fields: [
      { id: "fc", fr: "FC", ar: "النبض", kind: "num", def: 70, min: 10, max: 200, step: 5, unit: "/min" },
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "ecg", fr: "ECG", ar: "تخطيط", kind: "choice", def: "sinus", group: "ecg", options: [
        { id: "sinus", fr: "Bradycardie sinusale", ar: "بطء جيبي" },
        { id: "bav", fr: "BAV haut degré", ar: "إحصار عالي الدرجة" },
      ] },
      { id: "signes", fr: "Signes (syncope/douleur/OAP)", ar: "علامات (إغماء/ألم/وذمة)", kind: "bool", def: false },
    ],
    defs: [
      { fr: "Bradycardie symptomatique", ar: "بطء عرضي", when: (v) => n(v, "fc") < 50 && (b(v, "signes") || n(v, "pas") < 90) },
      { fr: "BAV haut degré : risque d'asystolie", ar: "إحصار عالٍ: خطر سكون", when: (v) => c(v, "ecg") === "bav" },
    ],
    steps: [
      { fr: "Atropine 0,5-1 mg IV q3-5 min (max 3 mg)", ar: "أتروبين 0,5-1 ملغ وريدياً كل 3-5 د (حد 3 ملغ)", when: (v) => n(v, "fc") < 50 },
      { fr: "Stimulation transcutanée si atropine inefficace", ar: "ناظم عبر الجلد إن فشل الأتروبين", when: (v) => n(v, "fc") < 50 && (b(v, "signes") || n(v, "pas") < 90) },
      { fr: "Adrénaline/perfusion si échec (aminés)", ar: "أدرنالين/تسرّب إن فشل (مقلدات)", when: (v) => n(v, "fc") < 50 && n(v, "pas") < 90, go: { href: "/calculateurs/amines", fr: "Amines", ar: "مقلدات الودي" } },
      { fr: "Sonde d'entraînement si BAV réfractaire", hospOnly: true, ar: "مسبار ناظم إن إحصار معند", when: (v) => c(v, "ecg") === "bav" && n(v, "fc") < 50 },
      { fr: "Scope + PAS q5 min jusqu'à avis", ar: "مراقبة + ضغط كل 5 د حتى الرأي", when: () => true },
    ],
  },
  {
    id: "scorpion", sev: 2, fr: "Envenimation scorpionique", ar: "لسعة عقرب", href: "/protocoles/piqre-scorpion",
    fields: [
      { id: "sys", fr: "Signes systémiques (vomissements/agitation/sueurs/priapisme)", ar: "علامات جهازية (إقياء/هياج/تعرق/انتعاظ)", kind: "bool", def: false },
      { id: "sev", fr: "Gravité (OAP/choc/coma)", ar: "خطورة (وذمة رئة/صدمة/غيبوبة)", kind: "bool", def: false },
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "spo2", fr: "SpO2", ar: "تشبع", kind: "num", def: 98, min: 50, max: 100, step: 1, unit: "%" },
    ],
    defs: [
      { fr: "Grade II (signes systémiques)", ar: "درجة II (علامات جهازية)", when: (v) => b(v, "sys") },
      { fr: "Grade III (gravité vitale)", ar: "درجة III (خطورة حيوية)", when: (v) => b(v, "sev") || n(v, "pas") < 90 || n(v, "spo2") < 92 },
    ],
    steps: [
      { fr: "Antalgique (paracétamol IV) + laver le point de piqûre", ar: "مسكّن (باراسيتامول وريدي) + غسل موضع اللسعة", when: () => true },
      { fr: "Interdits : incision, aspiration, garrot, glace", ar: "ممنوع: شقّ، شفط، عاصبة، ثلج", when: () => true },
      { fr: "Transport + pré-alerte si grade ≥ II", preOnly: true, ar: "نقل + إعلان مسبق إن درجة ≥ II", when: (v) => b(v, "sys") || b(v, "sev") },
      { fr: "Antivenin selon protocole local + surveillance rapprochée si grade ≥ II", hospOnly: true, ar: "مصل مضاد للسم حسب البروتوكول + مراقبة لصيقة إن درجة ≥ II", when: (v) => b(v, "sys") || b(v, "sev") },
      { fr: "Réanimation + amines/ventilation si grade III", hospOnly: true, ar: "إنعاش + مقلدات/تهوية إن درجة III", when: (v) => b(v, "sev") || n(v, "pas") < 90 || n(v, "spo2") < 92 },
    ],
  },
  {
    id: "electro", sev: 2, fr: "Électrisation / électrocution", ar: "صعق كهربائي", href: "/protocoles/electrocution",
    fields: [
      { id: "hv", fr: "Haute tension (> 1000 V)", ar: "توتر عالٍ (> 1000 فولط)", kind: "bool", def: false },
      { id: "brul", fr: "Brûlures d'entrée/sortie", ar: "حروق دخول/خروج", kind: "bool", def: false },
      { id: "ac", fr: "Arrêt cardiaque", ar: "توقف قلب", kind: "bool", def: false },
      { id: "ecg", fr: "ECG / rythme", ar: "تخطيط / نظم", kind: "choice", def: "normal", group: "ecg", options: [
        { id: "normal", fr: "Normal", ar: "سليم" },
        { id: "troubles", fr: "Troubles rythme/repolarisation", ar: "اضطرابات نظم/إعادة استقطاب" },
      ] },
    ],
    defs: [
      { fr: "Haute tension/brûlures : risque rhabdomyolyse", ar: "توتر عالٍ/حروق: خطر انحلال ربيدات", when: (v) => b(v, "hv") || b(v, "brul") },
      { fr: "Troubles rythmiques", ar: "اضطرابات نظم", when: (v) => c(v, "ecg") === "troubles" },
    ],
    steps: [
      { fr: "Sécuriser la scène : couper le courant AVANT tout contact", ar: "تأمين المشهد: قطع التيار قبل أي لمس", when: () => true },
      { fr: "RCP + défibrillation si arrêt cardiaque", ar: "إنعاش قلبي رئوي + صدم إن توقف قلب", when: (v) => b(v, "ac") },
      { fr: "Transport + pré-alerte si haute tension", preOnly: true, ar: "نقل + إعلان مسبق إن توتر عالٍ", when: (v) => b(v, "hv") },
      { fr: "2 VVP + hydratation agressive (rhabdomyolyse)", hospOnly: true, ar: "وريدان + إرواء كثيف (انحلال ربيدات)", when: (v) => b(v, "hv") || b(v, "brul") },
      { fr: "CPK/créatinine/myoglobinurie + monitorage ECG 24 h", hospOnly: true, ar: "CPK/كرياتينين/ميوغلوبين بولي + مراقبة تخطيط 24 س", when: (v) => b(v, "hv") || b(v, "brul") || c(v, "ecg") === "troubles" },
      { fr: "Bilan traumatique (chute/projection)", ar: "كشف رضوض (سقوط/اندفاع)", when: (v) => b(v, "hv") },
    ],
  },
  {
    id: "acr-adulte", sev: 1, fr: "ACR adulte", ar: "توقف قلب — بالغ", href: "/protocoles/acr-adulte",
    fields: [
      { id: "rythme", fr: "Rythme", ar: "النظم", kind: "choice", def: "asp", group: "ecg", options: [
        { id: "asp", fr: "Asystolie/PEA", ar: "سكون/نشاط بلا نبض" },
        { id: "fv", fr: "FV/TV sans pouls (choquable)", ar: "رجفان/تسرع بلا نبض (قابل للصدم)" },
      ] },
    ],
    defs: [
      { fr: "Rythme choquable", ar: "نظم قابل للصدم", when: (v) => c(v, "rythme") === "fv" },
    ],
    steps: [
      { fr: "MCE 100-120/min + ventilation 30:2 — relais q2 min", ar: "تدليك 100-120/د + تهوية 30:2 — تناوب كل دقيقتين", when: () => true, go: { href: "/calculateurs/chrono-rcp", fr: "Chrono RCP", ar: "مؤقت الإنعاش" } },
      { fr: "Choc 150-200 J biphasique puis reprise immédiate du MCE", ar: "صدم 150-200 ج ثنائي الطور ثم استئناف فوري للتدليك", when: (v) => c(v, "rythme") === "fv" },
      { fr: "Adrénaline 1 mg IV q3-5 min (dès l'abord si non choquable)", ar: "أدرينالين 1 ملغ وريدياً كل 3-5 د (فوراً إن غير قابل للصدم)", when: () => true },
      { fr: "Amiodarone 300 mg IV après le 3e choc", ar: "أميودارون 300 ملغ وريدياً بعد الصدمة الثالثة", when: (v) => c(v, "rythme") === "fv" },
      { fr: "Traiter les causes réversibles (4H/4H)", ar: "عالج الأسباب القابلة للعكس (4H/4H)", when: () => true },
      { fr: "Post-ROSC : coronarographie + température ciblée", hospOnly: true, ar: "بعد العودة: قسطرة + ضبط حرارة موجّه", when: () => true },
      { fr: "Transport + pré-alerte si ROSC", preOnly: true, ar: "نقل + إعلان مسبق إن عودة الدوران", when: () => true },
      { fr: "Contrôle rythme/PAS entre chaque cycle de 2 min", ar: "فحص نظم/ضغط بين كل دورتي دقيقتين", when: () => true },
    ],
  },
  {
    id: "acr-ped", sev: 1, fr: "ACR pédiatrique", ar: "توقف قلب — طفل", href: "/protocoles/acr-pediatrique",
    fields: [
      { id: "w", fr: "Poids", ar: "الوزن", kind: "num", def: 10, min: 2, max: 40, step: 1, unit: "kg" },
      { id: "gly", fr: "Glycémie", ar: "السكر", kind: "num", def: 1, min: 0.2, max: 6, step: 0.1, unit: "g/L", group: "bio" },
      { id: "rythme", fr: "Rythme", ar: "النظم", kind: "choice", def: "asp", group: "ecg", options: [
        { id: "asp", fr: "Asystolie/PEA", ar: "سكون/نشاط بلا نبض" },
        { id: "fv", fr: "FV/TV sans pouls (choquable)", ar: "رجفان/تسرع بلا نبض (قابل للصدم)" },
      ] },
    ],
    defs: [
      { fr: "Hypoglycémie traitable", ar: "نقص سكر قابل للعلاج", when: (v) => n(v, "gly") < 0.7 },
      { fr: "Rythme choquable", ar: "نظم قابل للصدم", when: (v) => c(v, "rythme") === "fv" },
    ],
    steps: [
      { fr: "MCE 100-120/min + 15:2 (2 secouristes) — O2 dès disponible", ar: "تدليك 100-120/د + 15:2 (منقذان) — أكسجين فور توفره", when: () => true, go: { href: "/calculateurs/rcp-peds", fr: "RCP peds", ar: "إنعاش الأطفال" } },
      { fr: "Adrénaline 0,01 mg/kg IV q3-5 min", ar: "أدرينالين 0,01 ملغ/كغ وريدياً كل 3-5 د", when: () => true, detail: (v) => `${(0.01 * n(v, "w")).toFixed(2)} mg` },
      { fr: "Choc 2 J/kg puis 4 J/kg si choquable", ar: "صدم 2 ج/كغ ثم 4 ج/كغ إن قابل للصدم", when: (v) => c(v, "rythme") === "fv", detail: (v) => `${2 * n(v, "w")} J` },
      { fr: "Amiodarone 5 mg/kg si FV réfractaire", ar: "أميودارون 5 ملغ/كغ إن رجفان معند", when: (v) => c(v, "rythme") === "fv", detail: (v) => `${5 * n(v, "w")} mg` },
      { fr: "D10 5 mL/kg si hypoglycémie", ar: "D10 5 مل/كغ إن نقص سكر", when: (v) => n(v, "gly") < 0.7, detail: (v) => `${5 * n(v, "w")} mL` },
      { fr: "Post-ROSC : température ciblée + étiologie", hospOnly: true, ar: "بعد العودة: حرارة موجّهة + سبب", when: () => true },
      { fr: "Contrôle rythme entre chaque cycle de 2 min", ar: "فحص نظم بين كل دورتي دقيقتين", when: () => true },
    ],
  },
  {
    id: "intox-med", sev: 2, fr: "Intoxication médicamenteuse", ar: "تسمم دوائي", href: "/protocoles/intoxication-medicamenteuse",
    fields: [
      { id: "gcs", fr: "Glasgow", ar: "غلاسكو", kind: "num", def: 15, min: 3, max: 15, step: 1 },
      { id: "ecg", fr: "ECG", ar: "تخطيط", kind: "choice", def: "normal", group: "ecg", options: [
        { id: "normal", fr: "Normal", ar: "سليم" },
        { id: "qrs", fr: "QRS larges (bloqueurs sodiques)", ar: "مركّب واسع (حاصرات صوديوم)" },
        { id: "qt", fr: "QT long (risque torsades)", ar: "QT طويل (خطر التواءات)" },
      ] },
      { id: "para", hosp: true, fr: "Paracétamolémie (h4)", ar: "مستوى باراسيتامول (س4)", kind: "choice", def: "none", group: "bio", options: [
        { id: "none", fr: "Non faite", ar: "لم يُعمل" },
        { id: "infra", fr: "Sous la ligne (non toxique)", ar: "تحت الخط (غير سمي)" },
        { id: "supra", fr: "Au-dessus de la ligne (toxique)", ar: "فوق الخط (سمي)" },
      ] },
    ],
    defs: [
      { fr: "QRS larges : toxicité sodique", ar: "مركّب واسع: سمية صوديوم", when: (v) => c(v, "ecg") === "qrs" },
      { fr: "QT long : risque de torsades", ar: "QT طويل: خطر التواءات", when: (v) => c(v, "ecg") === "qt" },
      { fr: "Paracétamol toxique", ar: "باراسيتامول سمي", when: (v) => c(v, "para") === "supra" },
    ],
    steps: [
      { fr: "Charbon activé 50 g si < 1 h et conscience correcte", ar: "فحم منشّط 50 غ إن أقل من ساعة ووعي سليم", when: (v) => n(v, "gcs") >= 13 },
      { fr: "Bicarbonates 8,4 % : 1-2 mEq/kg IV si QRS larges", hospOnly: true, ar: "بيكربونات 8,4%: 1-2 مكغ/كغ وريدياً إن مركّب واسع", when: (v) => c(v, "ecg") === "qrs" },
      { fr: "Magnésium 2 g IV si QT long/torsades", ar: "مغنيزيوم 2 غ وريدياً إن QT طويل/التواءات", when: (v) => c(v, "ecg") === "qt" },
      { fr: "N-acétylcystéine si paracétamolémie au-dessus de la ligne", hospOnly: true, ar: "أسيتيل سيستئين إن المستوى فوق الخط", when: (v) => c(v, "para") === "supra", go: { href: "/calculateurs/nac", fr: "Protocole NAC", ar: "بروتوكول NAC" } },
      { fr: "Transport + pré-alerte (USI/toxicologie)", preOnly: true, ar: "نقل + إعلان مسبق (عناية/سموم)", when: () => true },
      { fr: "ECG + conscience q30 min (effet rebond)", ar: "تخطيط + وعي كل 30 د (نكس محتمل)", when: () => true },
    ],
  },
  {
    id: "syncope", sev: 2, fr: "Syncope", ar: "إغماء", href: "/calculateurs/syncope",
    fields: [
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "ecg", fr: "ECG", ar: "تخطيط", kind: "choice", def: "none", group: "ecg", options: [
        { id: "none", fr: "Non fait", ar: "لم يُعمل" },
        { id: "normal", fr: "Normal", ar: "سليم" },
        { id: "anormal", fr: "Anormal (BAV/QT/WPW/TV)", ar: "مضطرب (إحصار/QT/وولف/بطيني)" },
      ] },
      { id: "signes", fr: "Signes associés (douleur thoracique/dyspnée/palpitations)", ar: "علامات مرافقة (ألم صدر/ضيق/خفقان)", kind: "bool", def: false },
    ],
    defs: [
      { fr: "Syncope à haut risque", ar: "إغماء عالي الخطورة", when: (v) => c(v, "ecg") === "anormal" || b(v, "signes") || n(v, "pas") < 90 },
    ],
    steps: [
      { fr: "ECG + glycémie capillaire + orthostatiques maintenant", ar: "تخطيط + سكر شعيري + انتصابية الآن", when: () => true },
      { fr: "Scope + transport médicalisé si haut risque", preOnly: true, ar: "مراقبة + نقل طبي إن عالي الخطورة", when: (v) => c(v, "ecg") === "anormal" || b(v, "signes") || n(v, "pas") < 90 },
      { fr: "Hospitalisation + monitorage si haut risque", hospOnly: true, ar: "إدخال + مراقبة إن عالي الخطورة", when: (v) => c(v, "ecg") === "anormal" || b(v, "signes") || n(v, "pas") < 90 },
      { fr: "Bas risque : consultation différée + conseils", ar: "خطورة منخفضة: مراجعة مؤجلة + نصائح", when: (v) => !(c(v, "ecg") === "anormal" || b(v, "signes") || n(v, "pas") < 90) },
    ],
  },
  {
    id: "bpco", sev: 2, fr: "Exacerbation BPCO", ar: "نوبة قان", href: "/protocoles/exacerbation-bpco",
    fields: [
      { id: "spo2", fr: "SpO2", ar: "تشبع", kind: "num", def: 98, min: 50, max: 100, step: 1, unit: "%" },
      { id: "fr", fr: "FR", ar: "التنفس", kind: "num", def: 16, min: 6, max: 60, step: 1, unit: "/min" },
      { id: "ph", hosp: true, fr: "pH (gazométrie)", ar: "pH (غازات)", kind: "num", def: 7.4, min: 6.8, max: 7.6, step: 0.05, group: "bio" },
    ],
    defs: [
      { fr: "Hypoxémie (cible 88-92 %)", ar: "نقص أكسجة (هدف 88-92%)", when: (v) => n(v, "spo2") < 88 },
      { fr: "Acidose respiratoire (pH < 7,35)", ar: "حماض تنفسي (pH < 7,35)", when: (v) => n(v, "ph") < 7.35 },
      { fr: "Épuisement (FR > 30)", ar: "إنهاك (تردد > 30)", when: (v) => n(v, "fr") > 30 },
    ],
    steps: [
      { fr: "O2 titré cible 88-92 % (pas plus)", ar: "أكسجين معاير هدف 88-92% (لا أكثر)", when: (v) => n(v, "spo2") < 88 },
      { fr: "Salbutamol 2,5-5 mg + ipratropium néb. q20 min", ar: "سالبوتامول + إبراتروبيوم رذّاً كل 20 د", when: () => true },
      { fr: "Corticoïde PO/IV (prednisone 40 mg) + antibio si crachats purulents", ar: "كورتيزون + مضاد إن قشع قيحي", when: () => true },
      { fr: "VNI si pH < 7,35 ou épuisement", hospOnly: true, ar: "تهوية غير باضعة إن pH < 7,35 أو إنهاك", when: (v) => n(v, "ph") < 7.35 || n(v, "fr") > 30 },
      { fr: "Transport + pré-alerte (filière VNI)", preOnly: true, ar: "نقل + إعلان مسبق (مسار التهوية غير الباضعة)", when: (v) => n(v, "ph") < 7.35 || n(v, "fr") > 30 },
      { fr: "Réévaluation FR/conscience/SpO2 q15 min", ar: "إعادة تقييم تردد/وعي/تشبع كل 15 د", when: () => true },
    ],
  },
  {
    id: "hta-grav", sev: 2, fr: "HTA gravidique", ar: "فرط ضغط حملي", href: "/protocoles/hypertension-gravidique",
    fields: [
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 250, step: 5, unit: "mmHg" },
      { id: "signes", fr: "Signes sévérité (vision/épigastre/céphalée)", ar: "علامات شدة (بصر/شرسوف/صداع)", kind: "bool", def: false },
    ],
    defs: [
      { fr: "HTA sévère (PAS ≥ 160)", ar: "فرط ضغط شديد (≥ 160)", when: (v) => n(v, "pas") >= 160 },
      { fr: "Prééclampsie à signes de sévérité", ar: "ما قبل الارتعاج الشديد", when: (v) => b(v, "signes") },
    ],
    steps: [
      { fr: "Labétalol 20 mg IV ou nifédipine 10 mg PO si PAS ≥ 160", ar: "لابيتالول 20 ملغ وريدياً أو نيفيديبين 10 فموياً إن ≥ 160", when: (v) => n(v, "pas") >= 160 },
      { fr: "MgSO4 4 g IV (20 min) si signes de sévérité", ar: "سلفات مغنيزيوم 4 غ وريدياً إن علامات شدة", when: (v) => b(v, "signes"), go: { href: "/calculateurs/eclampsie", fr: "Éclampsie", ar: "ارتعاج" } },
      { fr: "Interdits : diazépam 1ʳ ligne, nifédipine SL à croquer", ar: "ممنوع: ديازيبام أولاً، نيفيديبين تحت لسان", when: () => true },
      { fr: "Hospitalisation + surveillance mère-fœtus + décision d'accouchement", hospOnly: true, ar: "إدخال + مراقبة أم-جنين + قرار ولادة", when: () => true },
      { fr: "Transport maternité + pré-alerte", preOnly: true, ar: "نقل للتوليد + إعلان مسبق", when: () => true },
      { fr: "PAS q15 min jusqu'à 140-150", ar: "قياس الضغط كل 15 د حتى 140-150", when: () => true },
    ],
  },
  {
    id: "conv-feb", sev: 2, fr: "Convulsion fébrile", ar: "نوبة حموية", href: "/protocoles/convulsion-febrile",
    fields: [
      { id: "age", fr: "Âge (mois)", ar: "العمر (شهراً)", kind: "num", def: 18, min: 1, max: 72, step: 1 },
      { id: "duree", fr: "Durée (min)", ar: "المدة (د)", kind: "num", def: 3, min: 0, max: 60, step: 1 },
      { id: "encours", fr: "Crise en cours", ar: "نوبة جارية", kind: "bool", def: false },
      { id: "focale", fr: "Focale / répétée", ar: "بؤرية / متكررة", kind: "bool", def: false },
    ],
    defs: [
      { fr: "Crise prolongée (> 5 min)", ar: "نوبة مطوّلة (> 5 د)", when: (v) => n(v, "duree") > 5 || b(v, "encours") },
      { fr: "Drapeaux rouges (focale, < 12 mois, > 15 min)", ar: "أعلام حمراء (بؤرية، < 12 شهراً، > 15 د)", when: (v) => b(v, "focale") || n(v, "age") < 12 || n(v, "duree") > 15 },
    ],
    steps: [
      { fr: "Simple résolue : rassurer + antipyrétique confort + éducation", ar: "بسيطة منقضية: طمأنة + خافض حرارة للراحة + تثقيف", when: (v) => !b(v, "encours") && n(v, "duree") <= 5 && !b(v, "focale") && n(v, "age") >= 12 },
      { fr: "Midazolam 0,2 mg/kg IM/buccal si > 5 min ou en cours", ar: "ميدازولام 0,2 ملغ/كغ عضلياً/بخّة إن > 5 د أو جارية", when: (v) => n(v, "duree") > 5 || b(v, "encours") },
      { fr: "Transport + évaluation hospitalière (PL selon protocole) si drapeaux", ar: "نقل + تقييم مستشفى (بزل حسب البروتوكول) إن أعلام", when: (v) => b(v, "focale") || n(v, "age") < 12 || n(v, "duree") > 15 },
      { fr: "Surveillance conscience/T°/récidive pendant 30 min", ar: "مراقبة وعي/حرارة/نكس خلال 30 د", when: () => true },
    ],
  },
  {
    id: "deshy-enf", sev: 2, fr: "Déshydratation enfant", ar: "جفاف طفل", href: "/protocoles/deshydratation-enfant",
    fields: [
      { id: "w", fr: "Poids", ar: "الوزن", kind: "num", def: 10, min: 2, max: 40, step: 1, unit: "kg" },
      { id: "deg", fr: "Degré", ar: "الدرجة", kind: "choice", def: "leger", options: [
        { id: "leger", fr: "Légère (< 5 %)", ar: "خفيف (< 5%)" },
        { id: "moyen", fr: "Modérée (5-9 %)", ar: "متوسط (5-9%)" },
        { id: "severe", fr: "Sévère (≥ 10 %)", ar: "شديد (≥ 10%)" },
      ] },
      { id: "choc", fr: "Choc (extrémités froides/conscience)", ar: "صدمة (أطراف باردة/وعي)", kind: "bool", def: false },
      { id: "gly", fr: "Glycémie", ar: "السكر", kind: "num", def: 1, min: 0.2, max: 6, step: 0.1, unit: "g/L", group: "bio" },
    ],
    defs: [
      { fr: "Déshydratation sévère/choc", ar: "جفاف شديد/صدمة", when: (v) => c(v, "deg") === "severe" || b(v, "choc") },
      { fr: "Hypoglycémie associée", ar: "نقص سكر مرافق", when: (v) => n(v, "gly") < 0.7 },
    ],
    steps: [
      { fr: "SRO 50-75 mL/kg sur 4 h si légère", ar: "إمهاء فموي 50-75 مل/كغ خلال 4 س إن خفيف", when: (v) => c(v, "deg") === "leger", detail: (v) => `${50 * n(v, "w")}-${75 * n(v, "w")} mL` },
      { fr: "Bolus NaCl 20 mL/kg en 20 min si sévère/choc (répétable)", ar: "دفقة ملح 20 مل/كغ خلال 20 د إن شديد/صدمة (تُكرر)", when: (v) => c(v, "deg") === "severe" || b(v, "choc"), detail: (v) => `${20 * n(v, "w")} mL` },
      { fr: "Glycémie capillaire maintenant + D10 si < 0,7", ar: "سكر شعيري الآن + D10 إن < 0,7", when: () => true },
      { fr: "Réévaluation q15-30 min (conscience, pli, diurèse)", ar: "إعادة تقييم كل 15-30 د (وعي، طية، التبول)", when: () => true },
      { fr: "Transport si échec SRO ou sévère", preOnly: true, ar: "نقل إن فشل فموي أو شديد", when: (v) => c(v, "deg") !== "leger" },
    ],
  },
  {
    id: "rhabdo", sev: 2, fr: "Rhabdomyolyse", ar: "انحلال ربيدات", href: "/protocoles/rhabdomyolyse",
    fields: [
      { id: "cpk", hosp: true, fr: "CPK", ar: "CPK", kind: "num", def: 1000, min: 100, max: 100000, step: 500, unit: "UI/L", group: "bio" },
      { id: "k", hosp: true, fr: "K+", ar: "بوتاسيوم", kind: "num", def: 4.5, min: 2, max: 9, step: 0.1, unit: "mmol/L", group: "bio" },
      { id: "anurie", fr: "Anurie/acidose sévère", ar: "انقطاع بول/حماض شديد", kind: "bool", def: false },
    ],
    defs: [
      { fr: "Rhabdomyolyse sévère (CPK > 5000)", ar: "انحلال شديد (CPK > 5000)", when: (v) => n(v, "cpk") > 5000 },
      { fr: "Hyperkaliémie", ar: "فرط بوتاسيوم", when: (v) => n(v, "k") > 5.5 },
    ],
    steps: [
      { fr: "Hydratation IV agressive 1-2 L/h (cible diurèse 200-300 mL/h)", ar: "إرواء وريدي كثيف 1-2 ل/س (هدف بول 200-300 مل/س)", when: () => true },
      { fr: "Traiter l'hyperkaliémie maintenant", ar: "عالج فرط البوتاسيوم الآن", when: (v) => n(v, "k") > 5.5, go: { href: "/calculateurs/hyperkalemie", fr: "Hyperkaliémie", ar: "فرط بوتاسيوم" } },
      { fr: "ECG + K+/calcium q4-6 h", hospOnly: true, ar: "تخطيط + بوتاسيوم/كالسيوم كل 4-6 س", when: (v) => n(v, "cpk") > 5000 },
      { fr: "Épuration si anurie/acidose réfractaire", hospOnly: true, ar: "تنقية إن انقطاع بول/حماض معند", when: (v) => b(v, "anurie") },
      { fr: "Surveillance diurèse horaire", ar: "مراقبة بول كل ساعة", when: () => true },
    ],
  },
  {
    id: "hta-urg", sev: 2, fr: "HTA urgence", ar: "فرط ضغط طارئ", href: "/protocoles/hta-urgence",
    fields: [
      { id: "pas", fr: "PAS", ar: "الانقباضي", kind: "num", def: 120, min: 40, max: 260, step: 5, unit: "mmHg" },
      { id: "atteinte", fr: "Atteinte d'organe", ar: "أذية عضو", kind: "choice", def: "none", options: [
        { id: "none", fr: "Aucune (asymptomatique)", ar: "لا شيء (بلا أعراض)" },
        { id: "neuro", fr: "Encéphalopathie/AVC", ar: "اعتلال دماغي/سكتة" },
        { id: "thorax", fr: "Douleur thoracique/OAP", ar: "ألم صدري/وذمة" },
        { id: "dissec", fr: "Dissection aortique", ar: "سلخ أبهري" },
      ] },
    ],
    defs: [
      { fr: "Urgence hypertensive (atteinte d'organe)", ar: "طارئ فرط ضغط (أذية عضو)", when: (v) => c(v, "atteinte") !== "none" },
      { fr: "Dissection : cible PAS < 120 en 20 min", ar: "سلخ: هدف < 120 خلال 20 د", when: (v) => c(v, "atteinte") === "dissec" },
    ],
    steps: [
      { fr: "Labétalol/nicardipine IV : −25 % max la 1ʳ heure si atteinte d'organe", ar: "لابيتالول/نيكارديبين وريدياً: −25% كأحدّ أقصى أول ساعة إن أذية", when: (v) => c(v, "atteinte") === "neuro" || c(v, "atteinte") === "thorax" },
      { fr: "Dissection : bêta-bloquant d'abord (esmolol), PAS < 120 en 20 min", ar: "سلخ: حاصر بيتا أولاً، هدف < 120 خلال 20 د", when: (v) => c(v, "atteinte") === "dissec" },
      { fr: "Asymptomatique ≥ 180 : traitement PO + suivi 24-48 h — pas de poussée IV urgente", ar: "بلا أعراض ≥ 180: علاج فموي + متابعة 24-48 س — لا دفع وريدي استعجالي", when: (v) => c(v, "atteinte") === "none" && n(v, "pas") >= 180 },
      { fr: "Interdit : nifédipine SL rapide", ar: "ممنوع: نيفيديبين تحت لسان سريع", when: () => true },
      { fr: "PAS q5-15 min pendant la titration IV", ar: "ضغط كل 5-15 د أثناء المعايرة الوريدية", when: (v) => c(v, "atteinte") !== "none" },
    ],
  },
  {
    id: "org-ph", sev: 1, fr: "Organophosphorés", ar: "فوسفور عضوية", href: "/protocoles/intoxication-organophosphores",
    fields: [
      { id: "secretions", fr: "Sécrétions (salivation/bronchorrhée/sueurs)", ar: "مفرزات (لعاب/قصبي/تعرق)", kind: "bool", def: false },
      { id: "miosis", fr: "Myosis", ar: "تحدق حدقي", kind: "bool", def: false },
      { id: "fc", fr: "FC", ar: "النبض", kind: "num", def: 90, min: 20, max: 220, step: 5, unit: "/min" },
      { id: "gcs", fr: "Glasgow", ar: "غلاسكو", kind: "num", def: 15, min: 3, max: 15, step: 1 },
    ],
    defs: [
      { fr: "Syndrome cholinergique", ar: "متلازمة كولينية", when: (v) => b(v, "secretions") || b(v, "miosis") },
    ],
    steps: [
      { fr: "Protection des secouristes + décontamination (déshabiller/laver)", ar: "حماية المسعفين + إزالة تلوث (خلع/غسل)", when: () => true },
      { fr: "Atropine 1-3 mg IV/IM q5 min en doublant jusqu'à sécheresse (sans plafond)", ar: "أتروبين 1-3 ملغ كل 5 د بمضاعفة حتى الجفاف (بلا سقف)", when: (v) => b(v, "secretions") },
      { fr: "Oximes (contrathion 25 mg/kg) si disponibles tôt", hospOnly: true, ar: "أوكسيمات 25 ملغ/كغ إن متوفرة باكراً", when: (v) => b(v, "secretions") || b(v, "miosis") },
      { fr: "Diazépam 5-10 mg IV si convulsions/agitation", ar: "ديازيبام 5-10 ملغ وريدياً إن اختلاج/هياج", when: (v) => n(v, "gcs") < 13 },
      { fr: "Ré-atropinisation q15 min + ECG", ar: "إعادة أتروبين كل 15 د + تخطيط", when: () => true },
      { fr: "Transport + pré-alerte", preOnly: true, ar: "نقل + إعلان مسبق", when: () => true },
    ],
  },
  {
    id: "brul", sev: 2, fr: "Brûlure grave", ar: "حرق شديد", href: "/protocoles/brulure-grave",
    fields: [
      { id: "w", fr: "Poids", ar: "الوزن", kind: "num", def: 70, min: 2, max: 150, step: 5, unit: "kg" },
      { id: "scq", fr: "%SCQ", ar: "%سطح", kind: "num", def: 10, min: 0, max: 100, step: 5, unit: "%" },
      { id: "va", fr: "Voie aérienne (face/stridor/suie)", ar: "مجرى هوائي (وجه/صرير/سخام)", kind: "bool", def: false },
    ],
    defs: [
      { fr: "Brûlure grave (≥ 20 %)", ar: "حرق شديد (≥ 20%)", when: (v) => n(v, "scq") >= 20 },
      { fr: "Atteinte voie aérienne", ar: "أذية مجرى هوائي", when: (v) => b(v, "va") },
    ],
    steps: [
      { fr: "Eau courante 20 min (si < 20 min de l'accident) — pas de glace", ar: "ماء جارٍ 20 د (إن أقل من 20 د من الحادث) — بلا ثلج", when: () => true },
      { fr: "Intuber tôt si face/stridor", ar: "تنبيب باكراً إن وجه/صرير", when: (v) => b(v, "va") },
      { fr: "Parkland 4 mL×kg×% si ≥ 20 % (moitié en 8 h)", ar: "باركلاند 4 مل×كغ×% إن ≥ 20% (نصفها في 8 س)", when: (v) => n(v, "scq") >= 20, detail: (v) => `${4 * n(v, "w") * n(v, "scq")} mL/24 h` },
      { fr: "Antalgie IV titrée (morphine)", ar: "تسكين وريدي معاير (مورفين)", when: (v) => n(v, "scq") >= 10 },
      { fr: "Transport centre brûlés + pré-alerte si grave", preOnly: true, ar: "نقل لمركز حروق + إعلان مسبق إن شديد", when: (v) => n(v, "scq") >= 20 || b(v, "va") },
      { fr: "Surveillance diurèse horaire (0,5-1 mL/kg/h)", ar: "مراقبة بول كل ساعة (0,5-1 مل/كغ/س)", when: (v) => n(v, "scq") >= 20 },
    ],
  },
];
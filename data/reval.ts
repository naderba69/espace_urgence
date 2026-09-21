// v7.7 — Réévaluation post-protocole : le « chef de terrain » qui tranche.
// Pour chaque protocole : cadence de réévaluation, critères objectifs,
// amélioration / stagnation / aggravation → conduite, et pivots diagnostiques
// (signe nouveau ⇒ autre hypothèse ⇒ protocole cible).
// Sources : ERC/AHA 2021-2025, GINA 2024, Surviving Sepsis 2021, directives OMS/FIGO,
// recommandations SFMU — revues 2026-09.
import type { Localized } from "./types";

export interface RevalAction {
  txt: Localized;
  go?: { href: string; fr: string; ar: string };
}
export interface RevalBranch {
  signs: Localized[];
  actions: RevalAction[];
}
export interface RevalPivot {
  sign: Localized;
  suspect: Localized;
  href: string;
  label: Localized;
}
export interface Reval {
  intervalMin: number;
  /** Post-ROSC : liste de contrôle affichée sur le verdict « amélioration » (protocoles d'arrêt). */
  roscChecklist?: Localized[];
  criteria: Localized[];   // quoi re-mesurer à chaque tour
  improve: RevalBranch;
  stall: RevalBranch;
  worsen: RevalBranch;
  pivots: RevalPivot[];
}

// ── Actions partagées (cohérence + concision) ─────────────────────────────
const SAMU: RevalAction = {
  txt: { fr: "Appeler le SAMU — transfert réa/USI en cours de réévaluation", ar: "اتصل بـ SAMU — تحويل للإنعاش مع مواصلة العلاج" },
  go: { href: "/fiche-samu", fr: "Fiche SAMU", ar: "استمارة SAMU" },
};
const MONITOR: RevalAction = {
  txt: { fr: "Monitorage continu : scope, SpO₂, PA toutes les 5 min", ar: "مراقبة مستمرة: سكوب، SpO₂، ضغط كل 5 د" },
};
const AIRWAY: RevalAction = {
  txt: { fr: "Voies aériennes : intubation si GCS ≤ 8 ou détresse respiratoire", ar: "المجرى الهوائي: تنبيب إذا GCS ≤ 8 أو ضائقة تنفسية" },
};

// ── Registre ───────────────────────────────────────────────────────────────
export const revals: Record<string, Reval> = {
  "acr-adulte": {
    intervalMin: 2,
    roscChecklist: [
      { fr: "SpO₂ 94-98 % — oxygénothérapie titrée", ar: "SpO₂ ‏94-98% — أكسجين معاير" },
      { fr: "ECG 12 dérivations (SCA ?)", ar: "تخطيط 12 مشتقاً (احتشاء؟)" },
      { fr: "PA ≥ 65 mmHg — remplissage ± vasopresseur", ar: "ضغط ≥ 65 — تعبئة ± مقويات أوعية" },
      { fr: "Glycémie capillaire corrigée", ar: "تصحيح السكر الشعيري" },
      { fr: "Température : éviter fièvre et hypothermie", ar: "حرارة: تجنب الحمى والبرودة" },
      { fr: "Transfert réa — discuter coronarographie et contrôle ciblé de la température", ar: "تحويل إنعاش — مناقشة القسطرة وضبط الحرارة" },
    ],

    criteria: [
      { fr: "Rythme au scope (choquable ?)", ar: "النظم على السكوب (قابل للصدمة؟)" },
      { fr: "Qualité du massage : profondeur 5-6 cm, 100-120/min", ar: "جودة التدليك: عمق 5-6 سم، 100-120/د" },
      { fr: "Causes réversibles (5H-5T) passées en revue", ar: "مراجعة الأسباب القابلة للعكس (5H-5T)" },
    ],
    improve: {
      signs: [
        { fr: "ROSC : pouls perçu, PETCO₂ > 10 mmHg qui remonte", ar: "عودة الدوران: نبس محسوس، PETCO₂ > 10 ويرتفع" },
      ],
      actions: [
        { txt: { fr: "Post-arrêt : SpO₂ 94-98 %, ECG 12 dérivations, PA ≥ 65 mmHg", ar: "بعد التوقف: SpO₂ 94-98%، تخطيط 12 مشتقاً، ضغط ≥ 65" } },
        SAMU,
      ],
    },
    stall: {
      signs: [{ fr: "Pas de ROSC après 20-30 min de RCP de qualité", ar: "لا عودة للدوران بعد 20-30 د تدليك جيد" }],
      actions: [
        { txt: { fr: "Repasser chaque 5H-5T : adré IV 1 mg/3-5 min, corriger l'hypoxie/hypovolémie", ar: "أعد فحص 5H-5T: أدرينالين وريدي 1 ملغ/3-5 د، صحح نقص الأكسجين/الحجم" } },
        { txt: { fr: "Envisager causes mécaniques : écho (tamponnade, pneumothorax)", ar: "فكر في أسباب ميكانيكية: إيكو (اندحاس، استرواح)" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Ré-arrêt après ROSC", ar: "توقف مجدد بعد العودة" }],
      actions: [
        { txt: { fr: "Reprendre RCP immédiatement — même séquence", ar: "استأنف الإنعاش فوراً — نفس التسلسل" } },
        MONITOR,
      ],
    },
    pivots: [
      { sign: { fr: "Tympanisme + déviation trachéale", ar: "طبلة صدرية + انحراف الرغامي" }, suspect: { fr: "Pneumothorax suffocant", ar: "استرواح صدر ضاغط" }, href: "/protocoles/pneumothorax-suffocant", label: { fr: "Décompression", ar: "تفريغ" } },
      { sign: { fr: "Corps froid + arrêt réfractaire", ar: "جسم بارد + توقف مستعصٍ" }, suspect: { fr: "Hypothermie", ar: "انخفاض الحرارة" }, href: "/protocoles/hypothermie", label: { fr: "Réchauffer d'abord", ar: "التدفئة أولاً" } },
      { sign: { fr: "Contexte toxique (médicaments)", ar: "سياق تسمم دوائي" }, suspect: { fr: "Intoxication médicamenteuse", ar: "تسمم دوائي" }, href: "/protocoles/intoxication-medicamenteuse", label: { fr: "Antidotes", ar: "الترياقات" } },
    ],
  },
  anaphylaxie: {
    intervalMin: 5,
    criteria: [
      { fr: "SpO₂, FR, sifflements/stridor", ar: "SpO₂، تنفس، أزيز/صرير" },
      { fr: "PA + signes cutanés (urticaire, œdème)", ar: "الضغط + علامات جلدية" },
      { fr: "État de conscience", ar: "الوعي" },
    ],
    improve: {
      signs: [
        { fr: "SpO₂ ↑, voix claire, PA qui remonte", ar: "SpO₂ يرتفع، صوت صافٍ، الضغط يتحسن" },
      ],
      actions: [
        { txt: { fr: "Surveillance 6-12 h minimum (réaction biphasique possible)", ar: "مراقبة 6-12 ساعة على الأقل (ردة فعل ثنائية الطور)" } },
        { txt: { fr: "Corticoïdes + antihistaminiques, prescription d'adrénaline auto-injectable", ar: "كورتيزون + مضاد هيستامين، وصف حقنة أدرينالين ذاتية" } },
      ],
    },
    stall: {
      signs: [{ fr: "Pas d'amélioration 5-7 min après adrénaline IM", ar: "لا تحسن بعد 5-7 د من الأدرينالين العضلية" }],
      actions: [
        { txt: { fr: "Répéter adrénaline IM 0,5 mg cuisse (0,3 mg enfant) toutes les 5-7 min", ar: "كرر الأدرينالين عضلياً 0.5 ملغ فخذ (0.3 طفل) كل 5-7 د" }, go: { href: "/medicaments/adrenaline", fr: "Adrénaline", ar: "أدرينالين" } },
        { txt: { fr: "Remplissage NaCl 0,9 % 500-1000 mL rapide", ar: "تعبئة حجمية NaCl 0.9% ‏500-1000 مل سريع" } },
      ],
    },
    worsen: {
      signs: [
        { fr: "Choc réfractaire ou arrêt", ar: "صدمة مستعصية أو توقف" },
        { fr: "Stridor majoré = œdème laryngé", ar: "صرير متزايد = وذمة حنجرية" },
      ],
      actions: [
        AIRWAY,
        { txt: { fr: "Adrénaline IVSE titrée en réa — appel immédiat", ar: "أدرينالين وريدي بمعايرة في الإنعاش — نداء فوري" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Sifflements sans choc ni urticaire", ar: "أزيز دون صدمة أو شرى" }, suspect: { fr: "Crise d'asthme", ar: "نوبة ربو" }, href: "/protocoles/asthme-aigu-grave", label: { fr: "Protocole asthme", ar: "بروتوكول الربو" } },
      { sign: { fr: "Fièvre + frissons + purpura", ar: "حمى + قشعريرة + فرفرية" }, suspect: { fr: "Choc septique", ar: "صدمة إنتانية" }, href: "/protocoles/choc-septique", label: { fr: "Sepsis", ar: "إنتان" } },
    ],
  },
  avc: {
    intervalMin: 15,
    criteria: [
      { fr: "NIHSS simplifié + pupilles", ar: "NIHSS مبسط + الحدقتان" },
      { fr: "Glycémie capillaire (déjà faite ?)", ar: "سكر شعيري (تم قياسه؟)" },
      { fr: "PA — ne pas baisser sauf > 220/120 ou thrombolyse", ar: "الضغط — لا تخفضه إلا إذا > 220/120 أو حل الخثرة" },
    ],
    improve: {
      signs: [{ fr: "Déficit qui régresse (TIA/AVC mineur)", ar: "العجز يتراجع (نوبة إقفارية عابرة)" }],
      actions: [
        { txt: { fr: "Transfert stroke-center quand même — risque de récidive précoce", ar: "التحويل لمركز السكتة رغم التحسن — خطر نكس مبكر" } },
        { txt: { fr: "À jeun jusqu'au test de déglutition", ar: "صيام حتى اختبار البلع" } },
      ],
    },
    stall: {
      signs: [{ fr: "Déficit stable hors fenêtre de thrombolyse", ar: "عجز ثابت خارج نافذة إذابة الخثرة" }],
      actions: [
        { txt: { fr: "Unité neuro-vasculaire, imagerie + bilan étiologique", ar: "وحدة الأوعية العصبية، تصوير + بحث السبب" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "Conscience qui baisse, pupille dilatée, céphalée brutale", ar: "وعي ينخفض، حدقة متسعة، صداع صاعق" },
        { fr: "Crise comitiale", ar: "اختلاج" },
      ],
      actions: [
        { txt: { fr: "Scanner en urgence (hémorragie / œdème) — tête surélevée 30°", ar: "ماسح عاجل (نزف/وذمة) — رفع الرأس 30°" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Glycémie < 0,7 g/L", ar: "سكر < 0.7 غ/ل" }, suspect: { fr: "Hypoglycémie (pseudo-AVC)", ar: "نقص سكر (شبيه بالسكتة)" }, href: "/protocoles/hypoglycemie", label: { fr: "Glucosé", ar: "غلوكوز" } },
      { sign: { fr: "Post-critique + confusion", ar: "بعد نوبة + تخليط" }, suspect: { fr: "État de mal", ar: "حالة صرعية" }, href: "/protocoles/etat-mal-epileptique", label: { fr: "Protocole EME", ar: "بروتوكول الحالة" } },
    ],
  },
  polytraumatisme: {
    intervalMin: 5,
    criteria: [
      { fr: "ABCDE complet répété à chaque tour", ar: "ABCDE كامل يُعاد كل دورة" },
      { fr: "PA, FC, SpO₂, conscience", ar: "ضغط، نبض، SpO₂، وعي" },
      { fr: "Recherche saignement caché : thorax, abdomen, bassin, fémurs", ar: "بحث عن نزف خفي: صدر، بطن، حوض، فخذان" },
    ],
    improve: {
      signs: [{ fr: "Constantes stables après remplissage", ar: "حيوية مستقرة بعد التعبئة" }],
      actions: [
        { txt: { fr: "Scanner corps entier si hémodynamique stable — sinon bloc direct", ar: "ماسح كامل إن استقر — وإلا غرفة العمليات مباشرة" } },
        SAMU,
      ],
    },
    stall: {
      signs: [{ fr: "Choc qui persiste malgré 1-2 L cristalloïdes", ar: "صدمة مستمرة رغم 1-2 لتر بلورات" }],
      actions: [
        { txt: { fr: "Sang ! Transfusion précoce (O- / O+), acide tranexamique 1 g", ar: "دم! نقل مبكر، حمض الترانيكساميك 1 غ" }, go: { href: "/medicaments/acide-tranexamique", fr: "Exacyl", ar: "إكزاسيل" } },
        { txt: { fr: "Contention pelvienne, réchauffement, chirurgie en urgence", ar: "تثبيت الحوض، تدفئة، جراحة عاجلة" } },
      ],
    },
    worsen: {
      signs: [
        { fr: "Désaturation brutale, tympanisme", ar: "هبوط أكسجة مفاجئ، طبلة صدرية" },
        { fr: "Abdomen qui se tend, FC ↑", ar: "بطن يتصلب، نبض يرتفع" },
      ],
      actions: [
        { txt: { fr: "Re-ABCDE immédiat : décompression thoracique si suspicion", ar: "أعد ABCDE فوراً: تفريغ صدري عند الشك" }, go: { href: "/protocoles/pneumothorax-suffocant", fr: "Pneumothorax", ar: "استرواح" } },
        { txt: { fr: "Hémorragie interne ⇒ échographie FAST + bloc", ar: "نزف داخلي ⇒ إيكو FAST + عمليات" } },
      ],
    },
    pivots: [
      { sign: { fr: "Tympanisme + trachée déviée", ar: "طبلة + انحراف الرغامي" }, suspect: { fr: "Pneumothorax suffocant", ar: "استرواح ضاغط" }, href: "/protocoles/pneumothorax-suffocant", label: { fr: "Décompression", ar: "تفريغ" } },
      { sign: { fr: "GCS qui chute sans lésion visible", ar: "GCS يهبط دون إصابة ظاهرة" }, suspect: { fr: "Traumatisme crânien", ar: "رض دماغي" }, href: "/protocoles/traumatisme-cranien", label: { fr: "TC", ar: "ر ض د" } },
    ],
  },
  "acr-pediatrique": {
    intervalMin: 2,
    roscChecklist: [
      { fr: "SpO₂ 94-98 % + ventilation contrôlée (normocapnie)", ar: "SpO₂ ‏94-98% + تهوية مضبوطة" },
      { fr: "Glycémie corrigée (risque majeur chez l'enfant)", ar: "تصحيح السكر (خطر كبير عند الطفل)" },
      { fr: "PA selon âge — remplissage prudent 10 mL/kg", ar: "ضغط حسب العمر — تعبئة حذرة 10 مل/كغ" },
      { fr: "ECG + ionogramme (K⁺, Ca²⁺)", ar: "تخطيط + شوارد (K⁺، Ca²⁺)" },
      { fr: "Température contrôlée — éviter l'hyperthermie", ar: "ضبط الحرارة — تجنب فرطها" },
      { fr: "Transfert réa pédiatrique", ar: "تحويل إنعاش الأطفال" },
    ],

    criteria: [
      { fr: "Qualité RCP : 1/3 du thorax, 100-120/min", ar: "جودة الإنعاش: ثلث الصدر، 100-120/د" },
      { fr: "Voies aériennes + ventilation efficace", ar: "المجرى الهوائي + تهوية فعالة" },
      { fr: "H&T pédiatriques : hypoxie, hypovolémie, hypoglycémie, K⁺, pneumothorax", ar: "أسباب الأطفال: نقص أكسجين، حجم، سكر، بوتاسيوم، استرواح" },
    ],
    improve: {
      signs: [{ fr: "ROSC : pouls + FC selon âge", ar: "عودة الدوران: نبض ونبض قلب حسب العمر" }],
      actions: [
        { txt: { fr: "Post-arrêt pédiatrique : SpO₂ 94-98 %, glycémie, température contrôlée", ar: "بعد التوقف: SpO₂ 94-98%، سكر، ضبط الحرارة" } },
        SAMU,
      ],
    },
    stall: {
      signs: [{ fr: "Pas de ROSC après 10-15 min", ar: "لا عودة بعد 10-15 د" }],
      actions: [
        { txt: { fr: "Adrénaline 10 µg/kg IV/IO toutes les 3-5 min — vérifier la voie !", ar: "أدرينالين 10 مكغ/كغ وريدي/عظمي كل 3-5 د — تحقق من الوريد!" } },
        { txt: { fr: "Rechercher pneumothorax (transillumination), tamponnade", ar: "ابحث عن استرواح (شفوفية)، اندحاس" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Désaturation malgré RCP — problème de voies aériennes", ar: "هبوط رغم الإنعاش — مشكلة مجرى هوائي" }],
      actions: [
        { txt: { fr: "Corps étranger ? Manœuvres de désobstruction adaptées à l'âge", ar: "جسم غريب؟ مناورات إخراج حسب العمر" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Nourrisson fébrile + purpura", ar: "رضيع محموم + فرفرية" }, suspect: { fr: "Sepsis/méningite", ar: "إنتان/التهاب سحايا" }, href: "/protocoles/choc-septique", label: { fr: "Sepsis", ar: "إنتان" } },
      { sign: { fr: "Déshydratation sévère avant l'arrêt", ar: "تجفاف شديد قبل التوقف" }, suspect: { fr: "Déshydratation", ar: "تجفاف" }, href: "/protocoles/deshydratation-enfant", label: { fr: "Remplissage", ar: "تعبئة" } },
    ],
  },
  "sca-stemi": {
    intervalMin: 10,
    criteria: [
      { fr: "Douleur (échelle 0-10)", ar: "الألم (0-10)" },
      { fr: "ECG répété : sus-décalage qui régresse ?", ar: "تخطيط متكرر: هل يتراجع ارتفاع ST؟" },
      { fr: "PA, FC, signes d'OAP", ar: "ضغط، نبض، علامات وذمة رئة" },
    ],
    improve: {
      signs: [
        { fr: "Douleur ↓ > 50 % + ST ↓ > 50 % = reperfusion", ar: "ألم ↓ > 50% + ST ↓ > 50% = إعادة إرواء" },
      ],
      actions: [
        { txt: { fr: "Poursuivre double antiagrégation + anticoagulation, transfert coronarographie", ar: "واصل مضادات الصفائح + المميع، تحويل للقسطرة" } },
        MONITOR,
      ],
    },
    stall: {
      signs: [{ fr: "Douleur persistante malgré traitement complet", ar: "ألم مستمر رغم العلاج الكامل" }],
      actions: [
        { txt: { fr: "Ischémie réfractaire ⇒ coronarographie en urgence absolue", ar: "إقفار مستعصٍ ⇒ قسطرة عاجلة قصوى" } },
        { txt: { fr: "Dérivés nitrés si PA le permet, morphine titrée", ar: "نترات إن سمح الضغط، مورفين بمعايرة" } },
      ],
    },
    worsen: {
      signs: [
        { fr: "OAP crépitants, désaturation", ar: "وذمة رئة، هبوط أكسجة" },
        { fr: "PA < 90 + extrémités froides = choc cardiogénique", ar: "ضغط < 90 + أطراف باردة = صدمة قلبية" },
        { fr: "TV/FV", ar: "تسرع/رجفان بطيني" },
      ],
      actions: [
        { txt: { fr: "OAP ⇒ VNI + nitrés ; choc ⇒ inotropes + ballonnement", ar: "وذمة ⇒ تهوية غير باضعة + نترات؛ صدمة ⇒ مقويات قلب" }, go: { href: "/protocoles/oap", fr: "OAP", ar: "وذمة رئة" } },
        { txt: { fr: "Trouble du rythme ⇒ défibrillation/cardioversion", ar: "اضطراب نظم ⇒ رجفان/تقويم كهربي" }, go: { href: "/protocoles/tachycardie", fr: "Tachycardie", ar: "تسرع" } },
      ],
    },
    pivots: [
      { sign: { fr: "Douleur déchirante migratoire + asymétrie de pouls", ar: "ألم ممزق متنقل + عدم تناظر النبض" }, suspect: { fr: "Dissection aortique", ar: "تسلخ أبهري" }, href: "/protocoles/hta-urgence", label: { fr: "Urgence hypertensive", ar: "طارئة ضغط" } },
      { sign: { fr: "Dyspnée isolée + facteur thromboembolique", ar: "زلة معزولة + عامل خثري" }, suspect: { fr: "Embolie pulmonaire", ar: "انصمام رئوي" }, href: "/protocoles/embolie-pulmonaire", label: { fr: "EP", ar: "انصمام" } },
    ],
  },
  oap: {
    intervalMin: 5,
    criteria: [
      { fr: "SpO₂, FR, orthopnée", ar: "SpO₂، تنفس، ضجعة" },
      { fr: "Auscultation : crépitants qui reculent ?", ar: "سمع: فقاعات تتراجع؟" },
      { fr: "PA (dérivés nitrés possibles ?)", ar: "الضغط (هل النترات ممكنة؟)" },
    ],
    improve: {
      signs: [{ fr: "SpO₂ ↑, patient qui se recouche, crépitants ↓", ar: "SpO₂ يرتفع، يستلقي، فقاعات تقل" }],
      actions: [
        { txt: { fr: "Poursuivre nitrés + diurétiques, recherche étiologie (SCA ? FA ?)", ar: "واصل النترات + المدرات، ابحث السبب (إكليلي؟ رجفان؟)" } },
        MONITOR,
      ],
    },
    stall: {
      signs: [{ fr: "Pas d'amélioration après 30 min de traitement maximal", ar: "لا تحسن بعد 30 د من العلاج الأقصى" }],
      actions: [
        { txt: { fr: "VNI (CPAP/BiPAP) immédiate si non faite", ar: "تهوية غير باضعة فوراً إن لم تُعمل" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [
        { fr: "Conscience qui baisse, marbrures, PA qui chute", ar: "وعي ينخفض، تبرقش، ضغط يهبط" },
      ],
      actions: [
        { txt: { fr: "PA basse = STOP nitrés ! Choc cardiogénique : inotropes + réa", ar: "ضغط منخفض = أوقف النترات! صدمة قلبية: مقويات + إنعاش" } },
        AIRWAY,
      ],
    },
    pivots: [
      { sign: { fr: "Sifflements expiratoires sans cardiomégalie", ar: "أزيز زفيري دون تضخم قلب" }, suspect: { fr: "Asthme/BPCO", ar: "ربو/انسداد مزمن" }, href: "/protocoles/asthme-aigu-grave", label: { fr: "Asthme", ar: "ربو" } },
      { sign: { fr: "Douleur pleurale + mollet douloureux", ar: "ألم جنبي + ساق مؤلمة" }, suspect: { fr: "Embolie pulmonaire", ar: "انصمام رئوي" }, href: "/protocoles/embolie-pulmonaire", label: { fr: "EP", ar: "انصمام" } },
    ],
  },
  "etat-mal-epileptique": {
    intervalMin: 5,
    criteria: [
      { fr: "Cris toujours présentes ? (durée cumulée)", ar: "هل النوب مستمرة؟ (المدة التراكمية)" },
      { fr: "Glycémie capillaire faite", ar: "تم قياس السكر" },
      { fr: "Respiration + SpO₂ (risque d'apnée post-BZD)", ar: "تنفس + SpO₂ (خطر انقطاع النفس بعد البنزوديازيبين)" },
    ],
    improve: {
      signs: [{ fr: "Arrêt des crises, reprise de conscience progressive", ar: "توقف النوب، وعي يعود تدريجياً" }],
      actions: [
        { txt: { fr: "Traitement d'entretien (valproate/lévétiracétam) + surveillance 24 h", ar: "علاج صيانة + مراقبة 24 ساعة" } },
        { txt: { fr: "Chercher la cause : sevrage, fièvre, lésion, toxique", ar: "ابحث السبب: انسحاب، حمى، آفة، سم" } },
      ],
    },
    stall: {
      signs: [{ fr: "Crises persistantes après 2 lignes de benzodiazépines", ar: "نوب مستمرة بعد خطي بنزوديازيبين" }],
      actions: [
        { txt: { fr: "3ᵉ ligne : valproate 40 mg/kg ou phénytoïne — appel réa", ar: "الخط 3: فالبروات 40 ملغ/كغ أو فينيتوين — نداء إنعاش" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "Apnée / hypoventilation post-benzodiazépines", ar: "انقطاع/نقص تنفس بعد البنزوديازيبين" },
        { fr: "Hyperthermie + acidose (souffrance musculaire)", ar: "فرط حرارة + حماض (معاناة عضلية)" },
      ],
      actions: [
        AIRWAY,
        { txt: { fr: "EME réfractaire ⇒ anesthésie générale en réa", ar: "حالة مستعصية ⇒ تخدير عام في الإنعاش" } },
      ],
    },
    pivots: [
      { sign: { fr: "Sueurs + pâleur + tachycardie inexpliquée", ar: "تعرق + شحوب + تسرع قلب غير مفسر" }, suspect: { fr: "Hypoglycémie", ar: "نقص سكر" }, href: "/protocoles/hypoglycemie", label: { fr: "Glycémie capillaire", ar: "سكر شعيري" } },
      { sign: { fr: "Femme enceinte + HTA", ar: "حامل + ارتفاع ضغط" }, suspect: { fr: "Éclampsie", ar: "ارتعاج" }, href: "/protocoles/eclampsie", label: { fr: "MgSO₄", ar: "كبريتات مغنزيوم" } },
      { sign: { fr: "Fièvre + raideur de nuque", ar: "حمى + تصلب رقبة" }, suspect: { fr: "Méningite/encéphalite", ar: "التهاب سحايا/دماغ" }, href: "/protocoles/choc-septique", label: { fr: "Sepsis", ar: "إنتان" } },
    ],
  },
  "asthme-aigu-grave": {
    intervalMin: 15,
    criteria: [
      { fr: "DEP (% de la théorique/du meilleur)", ar: "قمة الجريان (DEP)" },
      { fr: "Parole : phrases complètes ?", ar: "الكلام: جمل كاملة؟" },
      { fr: "FR, SpO₂, tirage, silence auscultatoire", ar: "تنفس، SpO₂، جهد، صمت سمعي" },
    ],
    improve: {
      signs: [{ fr: "DEP ↑, phrases complètes, tirage disparu", ar: "DEP يرتفع، جمل كاملة، جهد زال" }],
      actions: [
        { txt: { fr: "Poursuivre β₂ + corticoïdes, espacer les nébulisations", ar: "واصل β₂ + كورتيزون، باعد بين البخاخات" } },
        { txt: { fr: "Surveillance ≥ 4 h avant toute sortie", ar: "مراقبة ≥ 4 ساعات قبل الخروج" } },
      ],
    },
    stall: {
      signs: [{ fr: "DEP < 50 % après 1 h de traitement bien conduit", ar: "DEP < 50% بعد ساعة علاج جيد" }],
      actions: [
        { txt: { fr: "Sulfate de magnésium 2 g IVSE en 20 min", ar: "كبريتات مغنزيوم 2 غ وريدي ببطء 20 د" }, go: { href: "/medicaments/sulfate-magnesium", fr: "MgSO₄", ar: "MgSO₄" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [
        { fr: "Thorax silencieux, bradycardie, troubles de conscience", ar: "صدر صامت، بطء قلب، اضطراب وعي" },
        { fr: "Épuisement respiratoire", ar: "إعياء تنفسي" },
      ],
      actions: [
        { txt: { fr: "Intubation immédiate par le plus expérimenté (cétones ? kétamine)", ar: "تنبيب فوري بأيدي الخبير (كيتامين مفضل)" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Crépitants + orthopnée + cardiomégalie", ar: "فقاعات + ضجعة + تضخم قلب" }, suspect: { fr: "OAP (asthme cardiaque)", ar: "وذمة رئة (ربو قلبي)" }, href: "/protocoles/oap", label: { fr: "OAP", ar: "وذمة" } },
      { sign: { fr: "Stridor inspiratoire isolé", ar: "صرير شهيق معزول" }, suspect: { fr: "Obstruction haute / anaphylaxie", ar: "انسداد علوي/تأق" }, href: "/protocoles/anaphylaxie", label: { fr: "Adrénaline", ar: "أدرينالين" } },
    ],
  },
  "choc-septique": {
    intervalMin: 15,
    criteria: [
      { fr: "PAM ≥ 65 mmHg ?", ar: "PAM ≥ 65؟" },
      { fr: "Diurèse horaire", ar: "إدرار البول الساعي" },
      { fr: "Marbrures, lactate, température", ar: "تبرقش، لاكتات، حرارة" },
    ],
    improve: {
      signs: [{ fr: "PAM stable sans noradrénaline, diurèse reprise, marbrures ↓", ar: "PAM ثابت دون نورأدرينالين، إدرار عاد، تبرقش يقل" }],
      actions: [
        { txt: { fr: "Poursuivre antibiothérapie (faite < 1 h) + contrôle de la source", ar: "واصل المضاد (< 1 س) + السيطرة على المصدر" } },
        MONITOR,
      ],
    },
    stall: {
      signs: [{ fr: "Hypotension persistante après 30 mL/kg de cristalloïdes", ar: "هبوط مستمر بعد 30 مل/كغ بلورات" }],
      actions: [
        { txt: { fr: "Noradrénaline sans tarder — voie centrale si possible", ar: "نورأدرينالين دون تأخير — قسطرة مركزية إن أمكن" }, go: { href: "/medicaments/noradrenaline", fr: "Noradrénaline", ar: "نورأدرينالين" } },
        { txt: { fr: "Réévaluer le foyer : échographie, drain, chirurgie ?", ar: "أعد تقييم البؤرة: إيكو، تصريف، جراحة؟" } },
      ],
    },
    worsen: {
      signs: [
        { fr: "Choc réfractaire : doses croissantes de noradrénaline", ar: "صدمة مستعصية: جرعات نورأدرينالين تتصاعد" },
        { fr: "Purpura fulminans, CIVD", ar: "فرفرية صاعقة، تخثر منتشر" },
      ],
      actions: [
        { txt: { fr: "Hydrocortisone 200 mg/j + réanimation", ar: "هيدروكورتيزون 200 ملغ/ي + إنعاش" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Hémorragie extériorisée / Hb qui chute", ar: "نزف ظاهر / هبوط الخضاب" }, suspect: { fr: "Choc hypovolémique", ar: "صدمة نقص حجم" }, href: "/protocoles/hemorragie-digestive-haute", label: { fr: "Hémorragie", ar: "نزف" } },
      { sign: { fr: "Turgescence jugulaire + JVP haute", ar: "انتفاخ الأوردة الوداجية" }, suspect: { fr: "Choc cardiogénique / EP", ar: "صدمة قلبية/انصمام" }, href: "/protocoles/embolie-pulmonaire", label: { fr: "EP", ar: "انصمام" } },
    ],
  },
  "acidocetose-diabetique": {
    intervalMin: 30,
    criteria: [
      { fr: "Glycémie capillaire toutes les 30 min", ar: "سكر شعيري كل 30 د" },
      { fr: "Conscience (surtout enfant : œdème cérébral !)", ar: "الوعي (خاصة الأطفال: وذمة دماغية!)" },
      { fr: "K⁺ : risque de chute sous insuline", ar: "البوتاسيوم: خطر هبوط مع الإنسولين" },
    ],
    improve: {
      signs: [{ fr: "Glycémie ↓, cétonurie ↓, patient réveillé et calme", ar: "سكر ينزل، كيتونات تقل، واعٍ وهادئ" }],
      actions: [
        { txt: { fr: "Insuline 0,1 UI/kg/h + G5 % quand glycémie < 2,5 g/L — relais SC à la correction", ar: "إنسولين 0.1 و/كغ/س + G5% عند سكر < 2.5 — تحويل تحت الجلد عند التصحيح" } },
        { txt: { fr: "Chercher le facteur déclenchant : infection, infarctus, arrêt d'insuline", ar: "ابحث المحفز: إنتان، احتشاء، إيقاف الإنسولين" } },
      ],
    },
    stall: {
      signs: [{ fr: "Glycémie qui ne baisse pas (< 10 %/h)", ar: "سكر لا ينزل (< 10%/س)" }],
      actions: [
        { txt: { fr: "Vérifier la voie (insuline adsorbée ?), augmenter le débit, K⁺ avant tout", ar: "تحقق من الوريد (امتصاص الإنسولين؟)، زد المعدل، البوتاسيوم أولاً" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "Céphalées + bradycardie + conscience ↓ (enfant surtout) = œdème cérébral", ar: "صداع + بطء قلب + وعي ↓ (خصوصاً الأطفال) = وذمة دماغية" },
        { fr: "Hypokaliémie : ondes U, faiblesse", ar: "نقص بوتاسيوم: موجات U، وهن" },
      ],
      actions: [
        { txt: { fr: "Œdème cérébral ⇒ mannitol 0,5-1 g/kg + réa pédiatrique", ar: "وذمة دماغية ⇒ مانيتول 0.5-1 غ/كغ + إنعاش أطفال" } },
        { txt: { fr: "K⁺ < 3,3 ⇒ STOP insuline, potassium d'abord", ar: "K⁺ < 3.3 ⇒ أوقف الإنسولين، بوتاسيوم أولاً" } },
      ],
    },
    pivots: [
      { sign: { fr: "Fièvre + foyer", ar: "حمى + بؤرة" }, suspect: { fr: "Sepsis déclencheur", ar: "إنتان محفز" }, href: "/protocoles/choc-septique", label: { fr: "Sepsis", ar: "إنتان" } },
      { sign: { fr: "Douleur thoracique + sus-ST", ar: "ألم صدري + ارتفاع ST" }, suspect: { fr: "SCA déclencheur", ar: "متلازمة إكليلية محفزة" }, href: "/protocoles/sca-stemi", label: { fr: "STEMI", ar: "احتشاء" } },
    ],
  },
  hyperkaliemie: {
    intervalMin: 15,
    criteria: [
      { fr: "ECG toutes les 15-30 min (ondes T, QRS)", ar: "تخطيط كل 15-30 د (موجات T، QRS)" },
      { fr: "K⁺ contrôle à 1-2 h", ar: "بوتاسيوم مراقبة بعد 1-2 س" },
      { fr: "Diurèse / fonction rénale", ar: "إدرار/وظيفة الكلى" },
    ],
    improve: {
      signs: [{ fr: "ECG normalisé, K⁺ < 5,5", ar: "تخطيط طبيعي، K⁺ < 5.5" }],
      actions: [
        { txt: { fr: "Traiter la cause (arrêt IEC/AINS, réhydratation) + contrôle à distance", ar: "عالج السبب (أوقف IEC/مضادات التهاب) + مراقبة لاحقة" } },
      ],
    },
    stall: {
      signs: [{ fr: "Signes ECG persistants malgré traitement", ar: "علامات تخطيط مستمرة رغم العلاج" }],
      actions: [
        { txt: { fr: "Répéter calcium IV + insuline-glucose ; résines ; envisager dialyse", ar: "أعد الكالسيوم + إنسولين-غلوكوز؛ راتنجات؛ فكر في الديلزة" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [{ fr: "QRS élargi, bloc, TV/FV imminente", ar: "QRS عريض، حصار، رجفان بطيني وشيك" }],
      actions: [
        { txt: { fr: "Gluconate de calcium 1 g IV en 2-3 min — répétable", ar: "غلوكونات كالسيوم 1 غ وريدي 2-3 د — قابل للتكرار" }, go: { href: "/medicaments/gluconate-calcium", fr: "Calcium", ar: "كالسيوم" } },
        { txt: { fr: "Dialyse en urgence absolue", ar: "ديلزة عاجلة قصوى" } },
      ],
    },
    pivots: [
      { sign: { fr: "Urines foncées + douleurs musculaires", ar: "بول داكن + آلام عضلية" }, suspect: { fr: "Rhabdomyolyse", ar: "انحلال عضلي" }, href: "/protocoles/rhabdomyolyse", label: { fr: "Rhabdo", ar: "انحلال" } },
      { sign: { fr: "Oligurie + contexte néphrologique", ar: "قلة إدرار + سياق كلوي" }, suspect: { fr: "Insuffisance rénale aiguë", ar: "قصور كلوي حاد" }, href: "/protocoles/rhabdomyolyse", label: { fr: "Néphro", ar: "كلى" } },
    ],
  },
  eclampsie: {
    intervalMin: 15,
    criteria: [
      { fr: "Nouvelles crises ?", ar: "نوب جديدة؟" },
      { fr: "PA (objectif < 160/110)", ar: "الضغط (هدف < 160/110)" },
      { fr: "FR + réflexes rotuliens (toxicité du MgSO₄)", ar: "تنفس + منعكسات رضفية (سمية المغنزيوم)" },
    ],
    improve: {
      signs: [{ fr: "Crises arrêtées, PA contrôlée", ar: "نوب توقفت، ضغط منضبط" }],
      actions: [
        { txt: { fr: "Poursuivre MgSO₄ 1 g/h pendant 24 h post-partum", ar: "واصلي MgSO₄ ‏1 غ/س 24 ساعة بعد الولادة" } },
        { txt: { fr: "Accouchement : décision obstétricale sans délai", ar: "الولادة: قرار توليدي دون تأخير" } },
      ],
    },
    stall: {
      signs: [{ fr: "Nouvelle crise malgré MgSO₄ bien conduit", ar: "نوبة جديدة رغم MgSO₄ منظم" }],
      actions: [
        { txt: { fr: "Bolus MgSO₄ 2 g en 5 min — vérifier réflexes/FR avant", ar: "دفعة MgSO₄ ‏2 غ في 5 د — تحققي من المنعكسات/التنفس أولاً" }, go: { href: "/medicaments/sulfate-magnesium", fr: "MgSO₄", ar: "MgSO₄" } },
        SAMU,
      ],
    },
    worsen:
      { signs: [
        { fr: "FR < 12 / réflexes abolis = intoxication au Mg", ar: "تنفس < 12 / منعكسات غائبة = تسمم بالمغنزيوم" },
        { fr: "Œdème pulmonaire, oligurie (HELLP)", ar: "وذمة رئة، قلة إدرار (HELLP)" },
      ],
      actions: [
        { txt: { fr: "STOP MgSO₄ + gluconate de calcium 1 g IV antidote", ar: "أوقفي MgSO₄ + غلوكونات كالسيوم 1 غ ترياق" } },
        AIRWAY,
      ],
    },
    pivots: [
      { sign: { fr: "Pas d'HTA ni grossesse > 20 SA", ar: "لا ضغط مرتفع ولا حمل > 20 أسبوعاً" }, suspect: { fr: "Épilepsie / autre cause", ar: "صرع/سبب آخر" }, href: "/protocoles/etat-mal-epileptique", label: { fr: "EME", ar: "حالة صرعية" } },
      { sign: { fr: "Glycémie basse", ar: "سكر منخفض" }, suspect: { fr: "Hypoglycémie", ar: "نقص سكر" }, href: "/protocoles/hypoglycemie", label: { fr: "Glucosé", ar: "غلوكوز" } },
    ],
  },
  "hemorragie-post-partum": {
    intervalMin: 5,
    criteria: [
      { fr: "Abondance du saignement (quantifier !)", ar: "غزارة النزف (قِيّسيها!)" },
      { fr: "Tonus utérin (globe dur ?)", ar: "تقلص الرحم (كرة صلبة؟)" },
      { fr: "PA, FC, conscience", ar: "ضغط، نبض، وعي" },
    ],
    improve: {
      signs: [{ fr: "Saignement tari, utérus bien rétracté", ar: "نزف توقف، رحم متقلص جيداً" }],
      actions: [
        { txt: { fr: "Ocytocine d'entretien + surveillance 2 h (main sur le fond utérin)", ar: "أوكسيتوسين صيانة + مراقبة ساعتين (اليد على قاع الرحم)" } },
        { txt: { fr: "Corriger l'anémie : bilan + transfusion selon tolérance", ar: "صححي فقر الدم: تحاليل + نقل حسب التحمل" } },
      ],
    },
    stall: {
      signs: [{ fr: "Saignement persistant malgré ocytocine + massage", ar: "نزف مستمر رغم الأوكسيتوسين + التدليك" }],
      actions: [
        { txt: { fr: "Acide tranexamique 1 g IV + compression bimanuelle", ar: "حمض ترانيكساميك 1 غ وريدي + ضغط ثنائي" }, go: { href: "/medicaments/acide-tranexamique", fr: "Exacyl", ar: "إكزاسيل" } },
        { txt: { fr: "Vérifier placenta complet, reviser la filière génitale", ar: "تحققي من المشيمة كاملة، افحصي القناة التناسلية" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Choc hémorragique : PA ↓, FC ↑, conscience ↓", ar: "صدمة نزفية: ضغط ↓، نبض ↑، وعي ↓" }],
      actions: [
        { txt: { fr: "Transfusion massive + bloc opératoire (ballonnet, chirurgie)", ar: "نقل دموي كثيف + عمليات (بالون، جراحة)" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Douleur abdominale brutale + utérus mou", ar: "ألم بطني صاعق + رحم رخو" }, suspect: { fr: "Rupture utérine", ar: "تمزق رحمي" }, href: "/protocoles/hemorragie-post-partum", label: { fr: "Bloc", ar: "عمليات" } },
      { sign: { fr: "Saignements diffus aux points de ponction", ar: "نزف منتشر من مواضع الوخز" }, suspect: { fr: "CIVD", ar: "تخثر منتشر" }, href: "/protocoles/hemorragie-post-partum", label: { fr: "CIVD", ar: "DIC" } },
    ],
  },
  "agitation-aigue": {
    intervalMin: 10,
    criteria: [
      { fr: "Score d'agitation (RASS simplifié)", ar: "مقياس الهياج (RASS مبسط)" },
      { fr: "Constantes : SpO₂, glycémie, température", ar: "حيوية: SpO₂، سكر، حرارة" },
      { fr: "Sécurité de l'équipe maintenue", ar: "سلامة الفريق محفوظة" },
    ],
    improve: {
      signs: [{ fr: "Patient calme, dialogue possible", ar: "هادئ، حوار ممكن" }],
      actions: [
        { txt: { fr: "Chercher la cause AVANT tout : hypoxie, hypoglycémie, douleur, sevrage", ar: "ابحث السبب قبل كل شيء: نقص أكسجين، سكر، ألم، انسحاب" } },
        { txt: { fr: "Surveillance rapprochée, réévaluation médicale", ar: "مراقبة لصيقة وإعادة تقييم طبية" } },
      ],
    },
    stall: {
      signs: [{ fr: "Agitation persistante malgré première dose + désescalade", ar: "هياج مستمر رغم الجرعة الأولى + التهدئة" }],
      actions: [
        { txt: { fr: "2ᵉ dose selon protocole (halopéridol/midazolam) — jamais d'halopéridol seul si suspicion toxique", ar: "جرعة ثانية حسب البروتوكول — لا هالوبيريدول وحده عند شك تسممي" }, go: { href: "/calculateurs/agitation", fr: "Assistant agitation", ar: "مساعد الهياج" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "Hyperthermie + rigidité = syndrome malin", ar: "فرط حرارة + صلابة = متلازمة خبيثة" },
        { fr: "SpO₂ ↓ après sédation", ar: "SpO₂ ↓ بعد التهدئة" },
      ],
      actions: [
        { txt: { fr: "STOP neuroleptiques, refroidissement, réanimation", ar: "أوقف مضادات الذهان، تبريد، إنعاش" } },
        { txt: { fr: "Dépression respiratoire ⇒ soutenir les voies aériennes (pas de flumazénil systématique)", ar: "نقص تنفس ⇒ دعم المجرى (لا فلومازينيل روتينياً)" } },
      ],
    },
    pivots: [
      { sign: { fr: "Sueurs + pâleur + tachycardie inexpliquée", ar: "تعرق + شحوب + تسرع قلب غير مفسر" }, suspect: { fr: "Hypoglycémie", ar: "نقص سكر" }, href: "/protocoles/hypoglycemie", label: { fr: "Glycémie capillaire", ar: "سكر شعيري" } },
      { sign: { fr: "Désaturation inexpliquée", ar: "هبوط أكسجة غير مفسر" }, suspect: { fr: "Hypoxie = cause d'agitation", ar: "نقص أكسجة = سبب الهياج" }, href: "/protocoles/oap", label: { fr: "Respi", ar: "تنفسي" } },
      { sign: { fr: "Traumatisme crânien récent / alcoolisme", ar: "رض دماغي حديث/إدمان كحول" }, suspect: { fr: "Traumatisme crânien", ar: "رض دماغي" }, href: "/protocoles/traumatisme-cranien", label: { fr: "TC", ar: "ر ض د" } },
    ],
  },
  "intoxication-paracetamol": {
    intervalMin: 60,
    criteria: [
      { fr: "Heure exacte de la prise (nomogramme H4 !)", ar: "توقيت البلع بدقة (مخطط الساعة 4!)" },
      { fr: "Conscience, vomissements", ar: "وعي، إقياء" },
      { fr: "Paracétamolémie à H4 (ou dès l'arrivée si > 4 h)", ar: "مستوى الباراسيتامول في س4" },
    ],
    improve: {
      signs: [{ fr: "Asymptomatique + niveau sous la ligne du nomogramme", ar: "بلا أعراض + مستوى تحت خط المخطط" }],
      actions: [
        { txt: { fr: "Pas de NAC nécessaire — surveillance + bilan hépatique de principe", ar: "لا حاجة لـ NAC — مراقبة + تحاليل كبد احتياطاً" } },
        { txt: { fr: "Évaluation psychiatrique obligatoire si prise volontaire", ar: "تقييم نفسي إلزامي إن كانت طوعية" }, go: { href: "/psychiatrie", fr: "Psychiatrie", ar: "طب نفسي" } },
      ],
    },
    stall: {
      signs: [{ fr: "Niveau toxique ou heure incertaine / prise massive", ar: "مستوى سام أو توقيت مجهول/جرعة هائلة" }],
      actions: [
        { txt: { fr: "N-acétylcystéine sans attendre les résultats", ar: "أسيتيل سيستين دون انتظار النتائج" } },
        { txt: { fr: "Charbon activé 50 g si < 2 h et conscience intacte", ar: "فحم منشط 50 غ إذا < 2 س ووعي سليم" } },
      ],
    },
    worsen: {
      signs: [
        { fr: "J2-J3 : ictère, douleur hypocondre droit, INR ↑ = cytolyse", ar: "ي2-ي3: يرقان، ألم تحت الأضلاع، INR ↑ = انحلال كبدي" },
      ],
      actions: [
        { txt: { fr: "Transfert hépato-réa — discuter transplantation", ar: "تحويل إنعاش كبدي — مناقشة الزراعة" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Co-ingestion possible (boîte vide douteuse)", ar: "احتمال بلع مشترك" }, suspect: { fr: "Intoxication médicamenteuse", ar: "تسمم دوائي" }, href: "/protocoles/intoxication-medicamenteuse", label: { fr: "Polymédication", ar: "تعدد الأدوية" } },
      { sign: { fr: "Acouphènes + hyperventilation", ar: "طنين + فرط تنفس" }, suspect: { fr: "Salicylés", ar: "ساليسيلات" }, href: "/protocoles/intoxication-medicamenteuse", label: { fr: "Aspirine", ar: "أسبرين" } },
    ],
  },
  "intoxication-organophosphores": {
    intervalMin: 5,
    criteria: [
      { fr: "Sécrétions (bronchorrhée, sueurs, larmes)", ar: "الإفرازات (قصبات، عرق، دموع)" },
      { fr: "FC (bradycardie ?), pupilles (myosis)", ar: "نبض (بطء؟)، حدقات (تضيق)" },
      { fr: "Fasciculations, conscience", ar: "رفوفات، وعي" },
    ],
    improve: {
      signs: [{ fr: "Peau sèche, FC > 80, pupilles normales = atropinisation atteinte", ar: "جلد جاف، نبض > 80، حدقات طبيعية = إشباع أتروبين" }],
      actions: [
        { txt: { fr: "Entretenir l'atropinisation (moitié de la dose de charge/h)", ar: "حافظ على الإشباع (نصف جرعة التحميل/ساعة)" } },
        { txt: { fr: "Décontamination cutanée complète de l'équipe et du patient", ar: "إزالة تلوث كاملة للفريق والمريض" } },
      ],
    },
    stall: {
      signs: [{ fr: "Bronchorrhée persistante", ar: "إفرازات قصبية مستمرة" }],
      actions: [
        { txt: { fr: "Doubler la dose d'atropine toutes les 5 min jusqu'à sécheresse", ar: "ضاعف الأتروبين كل 5 د حتى الجفاف" }, go: { href: "/medicaments/atropine", fr: "Atropine", ar: "أتروبين" } },
        { txt: { fr: "Pralidoxime si disponible (dans les 48 h)", ar: "براليدوكسيم إن توفر (خلال 48 س)" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Détresse respiratoire, coma, convulsions", ar: "ضائقة تنفسية، غيبوبة، اختلاجات" }],
      actions: [
        AIRWAY,
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Faiblesse musculaire retardée (24-96 h)", ar: "وهن عضلي متأخر (24-96 س)" }, suspect: { fr: "Syndrome intermédiaire", ar: "متلازمة وسيطة" }, href: "/protocoles/intoxication-organophosphores", label: { fr: "Ventilation", ar: "تهوية" } },
    ],
  },
  "traumatisme-cranien": {
    intervalMin: 15,
    criteria: [
      { fr: "GCS toutes les 15 min", ar: "GCS كل 15 د" },
      { fr: "Pupilles (taille, symétrie, réactivité)", ar: "حدقات (حجم، تناظر، تفاعل)" },
      { fr: "PA — éviter l'hypotension à tout prix", ar: "ضغط — تجنب الهبوط بأي ثمن" },
    ],
    improve: {
      signs: [{ fr: "GCS stable ou en hausse, pupilles symétriques", ar: "GCS ثابت أو يتحسن، حدقات متناظرة" }],
      actions: [
        { txt: { fr: "Scanner cérébral programmé + neurochirurgie informée", ar: "ماسح دماغي مبرمج + إعلام جراحة الأعصاب" } },
        { txt: { fr: "Tête 30°, normothermie, glycémie normale", ar: "رأس 30°، حرارة طبيعية، سكر طبيعي" } },
      ],
    },
    stall: {
      signs: [{ fr: "GCS inchangé mais ≤ 8", ar: "GCS دون تغيير لكنه ≤ 8" }],
      actions: [
        { txt: { fr: "Intubation + sédation + scanner en urgence", ar: "تنبيب + تهدئة + ماسح عاجل" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [
        { fr: "GCS qui baisse ≥ 2 points, mydriase unilatérale", ar: "GCS يهبط ≥ 2، اتساع حدقة وحيد" },
        { fr: "HTA + bradycardie (Cushing)", ar: "ارتفاع ضغط + بطء قلب (كوشينغ)" },
      ],
      actions: [
        { txt: { fr: "Mannitol 0,5-1 g/kg ou SSH — scanner immédiat, bloc possible", ar: "مانيتول 0.5-1 غ/كغ أو محلول ملحي مفرط — ماسح فوري" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Sueurs + pâleur + tachycardie inexpliquée", ar: "تعرق + شحوب + تسرع قلب غير مفسر" }, suspect: { fr: "Hypoglycémie", ar: "نقص سكر" }, href: "/protocoles/hypoglycemie", label: { fr: "Glycémie capillaire", ar: "سكر شعيري" } },
      { sign: { fr: "Contexte toxique superposé", ar: "سياق تسمم متراكب" }, suspect: { fr: "Intoxication", ar: "تسمم" }, href: "/protocoles/intoxication-medicamenteuse", label: { fr: "Toxico", ar: "سموم" } },
      { sign: { fr: "Crise comitiale post-traumatique", ar: "نوبة بعد الرض" }, suspect: { fr: "État de mal", ar: "حالة صرعية" }, href: "/protocoles/etat-mal-epileptique", label: { fr: "EME", ar: "حالة صرعية" } },
    ],
  },
  "brulure-grave": {
    intervalMin: 15,
    criteria: [
      { fr: "Douleur (EVA) + efficacité analgésie", ar: "ألم + فعالية المسكن" },
      { fr: "Diurèse (0,5-1 mL/kg/h adulte)", ar: "إدرار (0.5-1 مل/كغ/س)" },
      { fr: "Constantes + extension réelle de la surface", ar: "حيوية + المساحة الحقيقية" },
    ],
    improve: {
      signs: [{ fr: "Douleur contrôlée, diurèse correcte", ar: "ألم منضبط، إدرار جيد" }],
      actions: [
        { txt: { fr: "Poursuivre remplissage selon formule (Parkland), pansements stériles", ar: "واصل التعبئة حسب الصيغة، ضمادات معقمة" } },
        { txt: { fr: "Transfert centre de brûlés", ar: "تحويل لمركز الحروق" }, go: { href: "/calculateurs/brulures", fr: "Calcul brûlures", ar: "حاسبة الحروق" } },
      ],
    },
    stall: {
      signs: [{ fr: "Diurèse < 0,5 mL/kg/h", ar: "إدرار < 0.5 مل/كغ/س" }],
      actions: [
        { txt: { fr: "Augmenter le remplissage 20-30 % — vérifier la sonde", ar: "زد التعبئة 20-30% — تحقق من المسبار" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "Voix rauque, stridor, suies dans les crachats = inhalation", ar: "بحة، صرير، سخام بالبلغم = استنشاق" },
        { fr: "Extrémité froide et tendue sous escarre circulaire", ar: "طرف بارد مشدود تحت حرق دائري" },
      ],
      actions: [
        { txt: { fr: "Inhalation ⇒ intubation PRÉCOCE avant l'œdème", ar: "استنشاق ⇒ تنبيب مبكر قبل الوذمة" } },
        { txt: { fr: "Brûlure circulaire ⇒ escarrotomie de décharge", ar: "حرق دائري ⇒ شق إسعافي" } },
      ],
    },
    pivots: [
      { sign: { fr: "Incendie en lieu clos + céphalées", ar: "حريق بمكان مغلق + صداع" }, suspect: { fr: "Intoxication CO", ar: "تسمم بأول أكسيد الكربون" }, href: "/protocoles/intoxication-co", label: { fr: "CO", ar: "CO" } },
    ],
  },
  "deshydratation-enfant": {
    intervalMin: 15,
    criteria: [
      { fr: "Conscience, cri, larmes, pli cutané", ar: "وعي، بكاء، دموع، مرونة جلد" },
      { fr: "FC + diurèse (couches !)", ar: "نبض + إدرار (الحفاضات!)" },
      { fr: "Tolérance du SRO", ar: "تحمل محلول الإمهاء الفموي" },
    ],
    improve: {
      signs: [{ fr: "Enfant éveillé, boit, urine", ar: "متيقظ، يشرب، يتبول" }],
      actions: [
        { txt: { fr: "Relais SRO exclusif + réalimentation précoce", ar: "إمهاء فموي حصري + تغذية مبكرة" } },
        { txt: { fr: "Éducation parentale : signes de retour immédiat", ar: "تثقيف الوالدين: علامات العودة الفورية" } },
      ],
    },
    stall: {
      signs: [{ fr: "Pas d'amélioration après 1er bolus", ar: "لا تحسن بعد الدفعة الأولى" }],
      actions: [
        { txt: { fr: "Répéter NaCl 0,9 % 20 mL/kg — réévaluer le choc", ar: "أعد NaCl 0.9% ‏20 مل/كغ — أعد تقييم الصدمة" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "Choc : marbrures, pouls filant, conscience ↓", ar: "صدمة: تبرقش، نبض خيطي، وعي ↓" },
        { fr: "Surcharge : hépatomégalie + crépitants (trop de perfusion !)", ar: "حمل زائد: كبد متضخم + فقاعات (إفراط سوائل!)" },
      ],
      actions: [
        { txt: { fr: "Choc ⇒ bolus 20 mL/kg répétable ×3 puis vasoactifs", ar: "صدمة ⇒ دفعة 20 مل/كغ ×3 ثم مقويات أوعية" } },
        { txt: { fr: "Surcharge ⇒ STOP remplissage, diurétique, réa pédiatrique", ar: "حمل زائد ⇒ أوقف السوائل، مدر، إنعاش أطفال" } },
      ],
    },
    pivots: [
      { sign: { fr: "Fièvre + léthargie + purpura", ar: "حمى + خمول + فرفرية" }, suspect: { fr: "Sepsis", ar: "إنتان" }, href: "/protocoles/choc-septique", label: { fr: "Sepsis", ar: "إنتان" } },
      { sign: { fr: "Polyurie + amaigrissement + soif", ar: "كثرة إدرار + نحول + عطش" }, suspect: { fr: "Acidocétose", ar: "حماض كيتوني" }, href: "/protocoles/acidocetose-diabetique", label: { fr: "ACD", ar: "ACD" } },
    ],
  },
  bradycardie: {
    intervalMin: 5,
    criteria: [
      { fr: "FC + tolérance (PA, conscience, douleur thoracique)", ar: "نبض + التحمل (ضغط، وعي، ألم صدري)" },
      { fr: "ECG : bloc de haut degré ?", ar: "تخطيط: حصار عالي الدرجة؟" },
      { fr: "Médicaments en cause (β-bloquants, digoxine…)", ar: "أدوية مسؤولة (حاصرات β، ديغوكسين…)" },
    ],
    improve: {
      signs: [{ fr: "FC > 50 et patient asymptomatique", ar: "نبض > 50 وبلا أعراض" }],
      actions: [
        { txt: { fr: "Monitorage + enquête étiologique (bilan, ECG, médicaments)", ar: "مراقبة + بحث السبب" } },
      ],
    },
    stall: {
      signs: [{ fr: "Bradycardie mal tolérée persistante", ar: "بطء ضعيف التحمل مستمر" }],
      actions: [
        { txt: { fr: "Atropine 1 mg IV (max 3 mg) — préparer l'entraînement électrosystolique", ar: "أتروبين 1 ملغ وريدي (حد 3) — حضّر الناظمة" }, go: { href: "/medicaments/atropine", fr: "Atropine", ar: "أتروبين" } },
        { txt: { fr: "Isoprénaline en attente si atropine inefficace", ar: "إيزوبرينالين احتياطاً إذا فشل الأتروبين" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Perte de connaissance, pré-arrêt", ar: "فقد وعي، قبل التوقف" }],
      actions: [
        { txt: { fr: "Entraînement transcutané immédiat + patches de défibrillation en place", ar: "ناظمة جلدية فورية + لصاقات صدمة جاهزة" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "QRS larges + ondes T pointues", ar: "QRS عريض + T مدببة" }, suspect: { fr: "Hyperkaliémie", ar: "فرط بوتاسيوم" }, href: "/protocoles/hyperkaliemie", label: { fr: "K⁺", ar: "بوتاسيوم" } },
      { sign: { fr: "Patient froid + température basse", ar: "مريض بارد + حرارة منخفضة" }, suspect: { fr: "Hypothermie", ar: "انخفاض حرارة" }, href: "/protocoles/hypothermie", label: { fr: "Réchauffer", ar: "تدفئة" } },
    ],
  },
  tachycardie: {
    intervalMin: 5,
    criteria: [
      { fr: "FC + tolérance hémodynamique (PA, conscience)", ar: "نبض + التحمل (ضغط، وعي)" },
      { fr: "QRS fins ou larges ? (décision thérapeutique)", ar: "QRS ضيق أم عريض؟" },
      { fr: "Cause : fièvre, douleur, hypovolémie, thyroïde", ar: "سبب: حمى، ألم، نقص حجم، درق" },
    ],
    improve: {
      signs: [{ fr: "Retour en sinusal, symptômes résolus", ar: "عودة للنظم الجيبي، أعراض زالت" }],
      actions: [
        { txt: { fr: "ECG 12 dérivations post-réduction + traiter la cause", ar: "تخطيط 12 مشتقاً بعد الإرجاع + علاج السبب" } },
        { txt: { fr: "Anticoagulation selon contexte FA", ar: "تمييع حسب سياق الرجفان الأذيني" } },
      ],
    },
    stall: {
      signs: [{ fr: "TSV persistante malgré manœuvres ± adénosine", ar: "تسرع فوق بطيني مستمر رغم المناورات ± أدينوزين" }],
      actions: [
        { txt: { fr: "Adénosine 6 → 12 → 12 mg IVSE rapide — cardioversion élective", ar: "أدينوزين 6 ← 12 ← 12 ملغ سريع — تقويم مبرمج" }, go: { href: "/medicaments/adenosine", fr: "Adénosine", ar: "أدينوزين" } },
        { txt: { fr: "Avis cardiologie", ar: "رأي أمراض القلب" } },
      ],
    },
    worsen: {
      signs: [{ fr: "PA < 90, conscience ↓, douleur thoracique, OAP", ar: "ضغط < 90، وعي ↓، ألم صدري، وذمة" }],
      actions: [
        { txt: { fr: "Cardioversion électrique synchronisée immédiate (sédation si le temps le permet)", ar: "تقويم كهربي متزامن فوري (تهدئة إن سمح الوقت)" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Dyspnée + contexte thromboembolique", ar: "زلة + سياق خثري" }, suspect: { fr: "Embolie pulmonaire", ar: "انصمام رئوي" }, href: "/protocoles/embolie-pulmonaire", label: { fr: "EP", ar: "انصمام" } },
      { sign: { fr: "Fièvre + souffle + AEG", ar: "حمى + نفخة + وهن عام" }, suspect: { fr: "Sepsis", ar: "إنتان" }, href: "/protocoles/choc-septique", label: { fr: "Sepsis", ar: "إنتان" } },
    ],
  },
  "embolie-pulmonaire": {
    intervalMin: 15,
    criteria: [
      { fr: "SpO₂, FR, douleur pleurale", ar: "SpO₂، تنفس، ألم جنبي" },
      { fr: "PA (EP à haut risque ?)", ar: "ضغط (انصمام عالي الخطورة؟)" },
      { fr: "Signes de TVP au mollet", ar: "علامات خثرة الساق" },
    ],
    improve: {
      signs: [{ fr: "SpO₂ ↑, douleur ↓, hémodynamique stable", ar: "SpO₂ يرتفع، ألم يقل، استقرار" }],
      actions: [
        { txt: { fr: "Anticoagulation efficace poursuivie (HBPM → relais)", ar: "واصل التمييع الفعال" }, go: { href: "/medicaments/enoxaparine", fr: "Énoxaparine", ar: "إينوكسابارين" } },
        { txt: { fr: "Oxygène pour SpO₂ ≥ 94 %, lever précoce prudent", ar: "أكسجين لـ SpO₂ ≥ 94%، نهوض مبكر حذر" } },
      ],
    },
    stall: {
      signs: [{ fr: "Hypoxémie persistante malgré O₂", ar: "نقص أكسجة مستمر رغم الأكسجين" }],
      actions: [
        { txt: { fr: "Échographie cardiaque (VD dilaté ?) — unité de surveillance continue", ar: "إيكو قلب (بطين أيمن متوسع؟) — مراقبة مستمرة" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "Choc : PA < 90 + signes d'insuffisance VD", ar: "صدمة: ضغط < 90 + قصور أيمن" }],
      actions: [
        { txt: { fr: "Thrombolyse (altéplase) si EP à haut risque confirmée", ar: "إذابة الخثرة إن تأكد انصمام عالي الخطورة" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Douleur thoracique constrictive irradiante", ar: "ألم صدري ضاغط منتشر" }, suspect: { fr: "SCA", ar: "متلازمة إكليلية" }, href: "/protocoles/sca-stemi", label: { fr: "STEMI", ar: "احتشاء" } },
      { sign: { fr: "Tympanisme unilatéral", ar: "طبلة صدرية وحيدة الجانب" }, suspect: { fr: "Pneumothorax", ar: "استرواح" }, href: "/protocoles/pneumothorax-suffocant", label: { fr: "Pneumo", ar: "استرواح" } },
    ],
  },
  hypoglycemie: {
    intervalMin: 15,
    criteria: [
      { fr: "Glycémie capillaire toutes les 15 min jusqu'à stabilité", ar: "سكر شعيري كل 15 د حتى الاستقرار" },
      { fr: "Conscience", ar: "وعي" },
      { fr: "Traitement en cause : insuline, sulfamide", ar: "العلاج المسؤول: إنسولين، سلفاميد" },
    ],
    improve: {
      signs: [{ fr: "Glycémie > 0,7 g/L stable + patient éveillé", ar: "سكر > 0.7 ثابت + واعٍ" }],
      actions: [
        { txt: { fr: "Resucrage per os + repas — jamais de sortie sans cause identifiée", ar: "سكر فموي + وجبة — لا خروج قبل معرفة السبب" } },
        { txt: { fr: "Si sulfamide : surveillance 24 h (récidives tardives)", ar: "سلفاميد: مراقبة 24 س (نكس متأخر)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Récidive sous surveillance", ar: "نكس أثناء المراقبة" }],
      actions: [
        { txt: { fr: "G10 % IVSE continu + adaptation des traitements", ar: "G10% وريدي مستمر + تعديل الأدوية" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [{ fr: "Coma hypoglycémique prolongé", ar: "غيبوبة سكر مطولة" }],
      actions: [
        { txt: { fr: "G30 % 50 mL IV puis G10 % — protéger les voies aériennes", ar: "G30% ‏50 مل وريدي ثم G10% — حماية المجرى" } },
        { txt: { fr: "Glucagon 1 mg IM si pas de voie veineuse", ar: "غلوكاغون 1 ملغ عضلي إذا لا وريد" } },
      ],
    },
    pivots: [
      { sign: { fr: "Coma qui persiste après normalisation glycémique", ar: "غيبوبة مستمرة بعد تصحيح السكر" }, suspect: { fr: "AVC / intoxication / post-critique", ar: "سكتة/تسمم/بعد نوبة" }, href: "/protocoles/avc", label: { fr: "Neuro", ar: "عصبي" } },
    ],
  },
  syncope: {
    intervalMin: 15,
    criteria: [
      { fr: "Conscience récupérée complètement ?", ar: "هل عاد الوعي كاملاً؟" },
      { fr: "ECG 12 dérivations (obligatoire)", ar: "تخطيط 12 مشتقاً (إلزامي)" },
      { fr: "PA couché/debout, glycémie", ar: "ضغط راقد/واقف، سكر" },
    ],
    improve: {
      signs: [{ fr: "Conscience claire, ECG normal, pas de signe de gravité", ar: "وعي صافٍ، تخطيط طبيعي، لا علامات خطورة" }],
      actions: [
        { txt: { fr: "Score de risque (San Francisco) — si bas : sortie avec consignes", ar: "مقياس الخطورة — إن كان منخفضاً: خروج مع تعليمات" } },
        { txt: { fr: "Réhydratation, éducation sur les prodromes", ar: "إماهة وتثقيف حول النذائر" } },
      ],
    },
    stall: {
      signs: [{ fr: "Récidive ou ECG anormal", ar: "نكس أو تخطيط غير طبيعي" }],
      actions: [
        { txt: { fr: "Monitorage cardiaque + bilan (troponine, écho, Holter)", ar: "مراقبة قلبية + تحاليل (تروبونين، إيكو، هولتر)" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "Syncope à l'effort, palpitations avant, ATCD familiaux de mort subite", ar: "إغماء بالجهد، خفقان سابق، تاريخ موت مفاجئ عائلي" },
        { fr: "Trouble du rythme documenté", ar: "اضطراب نظم موثق" },
      ],
      actions: [
        { txt: { fr: "Hospitalisation monitorée — syncope cardiaque jusqu'à preuve du contraire", ar: "إدخال بمراقبة — إغماء قلبي حتى يثبت العكس" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Sueurs + pâleur + tachycardie inexpliquée", ar: "تعرق + شحوب + تسرع قلب غير مفسر" }, suspect: { fr: "Hypoglycémie", ar: "نقص سكر" }, href: "/protocoles/hypoglycemie", label: { fr: "Glycémie capillaire", ar: "سكر شعيري" } },
      { sign: { fr: "Méléna / rectorragie", ar: "براز أسود/نزف شرجي" }, suspect: { fr: "Hémorragie digestive", ar: "نزف هضمي" }, href: "/protocoles/hemorragie-digestive-haute", label: { fr: "Hémorragie", ar: "نزف" } },
      { sign: { fr: "Douleur thoracique associée", ar: "ألم صدري مرافق" }, suspect: { fr: "SCA / EP", ar: "إكليلي/انصمام" }, href: "/protocoles/sca-stemi", label: { fr: "STEMI", ar: "احتشاء" } },
    ],
  },
  "coup-de-chaleur": {
    intervalMin: 10,
    criteria: [
      { fr: "Température rectale (objectif < 39 °C)", ar: "حرارة شرجية (هدف < 39°)" },
      { fr: "Conscience, convulsions", ar: "وعي، اختلاجات" },
      { fr: "Diurèse + couleur des urines", ar: "إدرار + لون البول" },
    ],
    improve: {
      signs: [{ fr: "T° < 39 °C, conscience qui s'améliore", ar: "حرارة < 39°، وعي يتحسن" }],
      actions: [
        { txt: { fr: "Arrêter le refroidissement actif (éviter l'hypothermie), réhydrater", ar: "أوقف التبريد النشط، إماهة" } },
        { txt: { fr: "Surveillance 24 h : complications retardées", ar: "مراقبة 24 س: مضاعفات متأخرة" } },
      ],
    },
    stall: {
      signs: [{ fr: "T° qui ne baisse pas < 0,2 °C/min", ar: "حرارة لا تنزل < 0.2°/د" }],
      actions: [
        { txt: { fr: "Intensifier : immersion eau glacée, ventilation + eau tiède + glace aux plis", ar: "كثّف: غطس بماء مثلج، تهوية + ماء فاتر + ثلج بالثنيات" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "Convulsions, CIVD (saignements diffus), urines myoglobinuriques", ar: "اختلاجات، تخثر منتشر، بول ميوغلوبيني" },
      ],
      actions: [
        { txt: { fr: "Réanimation : benzodiazépines, produits sanguins, réhydratation massive", ar: "إنعاش: بنزوديازيبين، مشتقات دم، إماهة كثيفة" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Fièvre sans exposition + foyer infectieux", ar: "حمى دون تعرض + بؤرة إنتانية" }, suspect: { fr: "Sepsis", ar: "إنتان" }, href: "/protocoles/choc-septique", label: { fr: "Sepsis", ar: "إنتان" } },
      { sign: { fr: "Neuroleptiques + rigidité", ar: "مضادات ذهان + صلابة" }, suspect: { fr: "Syndrome malin", ar: "متلازمة خبيثة" }, href: "/protocoles/agitation-aigue", label: { fr: "SNM", ar: "SNM" } },
    ],
  },
  "pneumothorax-suffocant": {
    intervalMin: 5,
    criteria: [
      { fr: "SpO₂ + FR après décompression", ar: "SpO₂ + تنفس بعد التفريغ" },
      { fr: "Murmure vésiculaire revenu ?", ar: "هل عاد الصوت التنفسي؟" },
      { fr: "Trachée recentrée ?", ar: "هل توسّطت الرغامي؟" },
    ],
    improve: {
      signs: [{ fr: "SpO₂ ↑ immédiate, murmure revenu", ar: "SpO₂ ارتفع فوراً، صوت عاد" }],
      actions: [
        { txt: { fr: "Drain thoracique + contrôle radiologique", ar: "أنبوبة صدرية + تصوير مراقبة" } },
        SAMU,
      ],
    },
    stall: {
      signs: [{ fr: "Hypoxémie persistante malgré exsufflation", ar: "نقص أكسجة مستمر رغم التنفيس" }],
      actions: [
        { txt: { fr: "Vérifier le point de ponction, drain bouché ? autre lésion ?", ar: "تحقق من موضع الوخز، أنبوبة مسدودة؟ إصابة أخرى؟" } },
        { txt: { fr: "Échographie thoracique au lit", ar: "إيكو صدري بالسرير" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Arrêt cardiaque (PEA)", ar: "توقف قلبي (PEA)" }],
      actions: [
        { txt: { fr: "Décompression bilatérale + RCP — cause à lever avant tout", ar: "تفريغ ثنائي + إنعاش — أزل السبب أولاً" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Matité à la percussion + choc", ar: "خفوت بالقرع + صدمة" }, suspect: { fr: "Hémothorax", ar: "دم صدري" }, href: "/protocoles/polytraumatisme", label: { fr: "Trauma", ar: "رضوض" } },
    ],
  },
  "piqre-scorpion": {
    intervalMin: 15,
    criteria: [
      { fr: "Classe de gravité : locale / systémique", ar: "درجة الخطورة: موضعية/جهازية" },
      { fr: "PA, FC, FR, sueurs, vomissements", ar: "ضغط، نبض، تنفس، تعرق، إقياء" },
      { fr: "Enfant = risque majeur (poids faible)", ar: "الطفل = خطر كبير (وزن منخفض)" },
    ],
    improve: {
      signs: [{ fr: "Douleur locale seule, constantes normales", ar: "ألم موضعي فقط، حيوية طبيعية" }],
      actions: [
        { txt: { fr: "Antalgiques + surveillance 4-6 h minimum (surtout enfant)", ar: "مسكنات + مراقبة 4-6 ساعات (خصوصاً الأطفال)" } },
        { txt: { fr: "Pas de garrot, pas d'incision — rassurer la famille", ar: "لا عاصبة ولا شق — طمئن العائلة" } },
      ],
    },
    stall: {
      signs: [{ fr: "Signes systémiques stables mais présents", ar: "علامات جهازية ثابتة لكن موجودة" }],
      actions: [
        { txt: { fr: "Hospitalisation en observation rapprochée", ar: "إدخال للمراقبة اللصيقة" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "OAP, choc, priapisme, sueurs profuses (enfant)", ar: "وذمة رئة، صدمة، انتصاب مستمر، تعرق غزير (طفل)" },
      ],
      actions: [
        { txt: { fr: "Réanimation : O₂, remplissage prudent, dobutamine si OAP cardiogénique", ar: "إنعاش: أكسجين، تعبئة حذرة، دوبوتامين للوذمة القلبية" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Réaction allergique généralisée", ar: "ردة فعل تحسسية معممة" }, suspect: { fr: "Anaphylaxie", ar: "تأق" }, href: "/protocoles/anaphylaxie", label: { fr: "Adrénaline", ar: "أدرينالين" } },
    ],
  },
  "intoxication-co": {
    intervalMin: 15,
    criteria: [
      { fr: "Conscience + signes neurologiques (SpO₂ trompeuse !)", ar: "وعي + علامات عصبية (SpO₂ مخادعة!)" },
      { fr: "Carboxyhémoglobine si disponible", ar: "COHb إن توفر" },
      { fr: "Contexte : autres victimes ? (gaz, brasero)", ar: "سياق: ضحايا آخرون؟ (غاز، كانون)" },
    ],
    improve: {
      signs: [{ fr: "Symptômes régressifs sous O₂ 100 %", ar: "أعراض تتراجع تحت أكسجين 100%" }],
      actions: [
        { txt: { fr: "O₂ 100 % au masque étanche 4-6 h (jusqu'à COHb < 5 %)", ar: "أكسجين 100% بقناع محكم 4-6 س (حتى COHb < 5%)" } },
        { txt: { fr: "Évacuer/ventiler le lieu — déclarer aux autorités sanitaires", ar: "إخلاء/تهوية المكان — إبلاغ السلطات" } },
      ],
    },
    stall: {
      signs: [{ fr: "Céphalées/nausées persistantes", ar: "صداع/غثيان مستمر" }],
      actions: [
        { txt: { fr: "Prolonger l'O₂ 100 %, recontrôler COHb", ar: "أطل الأكسجين، أعد قياس COHb" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "Conscience ↓, convulsions, signes cardiaques (ischémie)", ar: "وعي ↓، اختلاجات، علامات قلبية" },
        { fr: "Femme enceinte (risque fœtal majeur)", ar: "حامل (خطر جنيني كبير)" },
      ],
      actions: [
        { txt: { fr: "Indication d'oxygénothérapie hyperbare — transfert spécialisé", ar: "استطباب أكسجين عالي الضغط — تحويل مختص" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Fumées d'incendie (CO + cyanures)", ar: "دخان حريق (CO + سيانيد)" }, suspect: { fr: "Brûlure/inhalation", ar: "حرق/استنشاق" }, href: "/protocoles/brulure-grave", label: { fr: "Brûlés", ar: "حروق" } },
      { sign: { fr: "Traumatisme associé (chute/fuite)", ar: "رض مرافق (سقوط/هروب)" }, suspect: { fr: "Traumatisme crânien", ar: "رض دماغي" }, href: "/protocoles/traumatisme-cranien", label: { fr: "TC", ar: "ر ض د" } },
    ],
  },
  "hta-urgence": {
    intervalMin: 15,
    criteria: [
      { fr: "PA toutes les 15 min (objectif : -25 % max en 1ʳᵉ heure)", ar: "ضغط كل 15 د (هدف: -25% كحد أقصى أول ساعة)" },
      { fr: "Souffrance d'organe : neuro, cœur, rein, œil", ar: "معاناة عضو: أعصاب، قلب، كلى، عين" },
      { fr: "Vitesse de descente (trop rapide = ischémie !)", ar: "سرعة النزول (أسرع من اللازم = إقفار!)" },
    ],
    improve: {
      signs: [{ fr: "PA vers la cible, symptômes d'organe stables", ar: "ضغط نحو الهدف، أعراض العضو مستقرة" }],
      actions: [
        { txt: { fr: "Relais per os + surveillance 6 h — éducation observance", ar: "تحويل فموي + مراقبة 6 س — تثقيف الالتزام" } },
      ],
    },
    stall: {
      signs: [{ fr: "PA inchangée malgré nicardipine/urapidil titrés", ar: "ضغط ثابت رغم نيكارديبين/يورابيديل معاير" }],
      actions: [
        { txt: { fr: "Vérifier la douleur/anxiété/rétention urinaire — associer une 2ᵉ molécule", ar: "تحقق من ألم/قلق/احتباس بول — أضف جزيئاً ثانياً" }, go: { href: "/medicaments/nicardipine", fr: "Nicardipine", ar: "نيكارديبين" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "Signes neurologiques nouveaux, douleur thoracique, dyspnée", ar: "علامات عصبية جديدة، ألم صدري، زلة" },
        { fr: "PA qui chute trop vite (> 25 %/h) : vertiges, déficit", ar: "ضغط يهبط أسرع من 25%/س: دوار، عجز" },
      ],
      actions: [
        { txt: { fr: "Freiner la baisse + scanner/ECG selon organe", ar: "أبطئ النزول + ماسح/تخطيط حسب العضو" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Douleur déchirante + asymétrie tensionnelle", ar: "ألم ممزق + عدم تناظر ضغط" }, suspect: { fr: "Dissection aortique", ar: "تسلخ أبهري" }, href: "/protocoles/polytraumatisme", label: { fr: "Chirurgie", ar: "جراحة" } },
      { sign: { fr: "Grossesse > 20 SA", ar: "حمل > 20 أسبوعاً" }, suspect: { fr: "HTA gravidique", ar: "ضغط الحمل" }, href: "/protocoles/hypertension-gravidique", label: { fr: "Grossesse", ar: "حمل" } },
    ],
  },
  rhabdomyolyse: {
    intervalMin: 60,
    criteria: [
      { fr: "Diurèse horaire (objectif 200-300 mL/h)", ar: "إدرار ساعي (هدف 200-300 مل/س)" },
      { fr: "CPK, K⁺, créatinine", ar: "CPK، K⁺، كرياتينين" },
      { fr: "Couleur des urines", ar: "لون البول" },
    ],
    improve: {
      signs: [{ fr: "Diurèse abondante, CPK en baisse", ar: "إدرار غزير، CPK ينزل" }],
      actions: [
        { txt: { fr: "Poursuivre NaCl 0,9 % 1-2 L/h tant que CPK élevé", ar: "واصل NaCl 0.9% ‏1-2 ل/س ما دام CPK مرتفعاً" } },
        MONITOR,
      ],
    },
    stall: {
      signs: [{ fr: "Oligurie malgré remplissage adéquat", ar: "قلة إدرار رغم تعبئة كافية" }],
      actions: [
        { txt: { fr: "Avis néphrologie — discuter bicarbonates, dialyse", ar: "رأي كلى — مناقشة بيكربونات، ديلزة" } },
        { txt: { fr: "Surveiller K⁺ de très près", ar: "راقب البوتاسيوم بدقة شديدة" }, go: { href: "/protocoles/hyperkaliemie", fr: "Hyperkaliémie", ar: "فرط بوتاسيوم" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Hyperkaliémie menaçante / anurie", ar: "فرط بوتاسيوم مهدد/انقطاع إدرار" }],
      actions: [
        { txt: { fr: "Traitement hyperkaliémie + dialyse en urgence", ar: "علاج فرط البوتاسيوم + ديلزة عاجلة" }, go: { href: "/protocoles/hyperkaliemie", fr: "Hyperkaliémie", ar: "فرط بوتاسيوم" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Écrasement prolongé (séisme)", ar: "انحشار مطول (زلزال)" }, suspect: { fr: "Crush syndrome", ar: "متلازمة الانحشار" }, href: "/protocoles/polytraumatisme", label: { fr: "Trauma", ar: "رضوض" } },
      { sign: { fr: "Neuroleptiques + hyperthermie", ar: "مضادات ذهان + فرط حرارة" }, suspect: { fr: "Syndrome malin", ar: "متلازمة خبيثة" }, href: "/protocoles/agitation-aigue", label: { fr: "SNM", ar: "SNM" } },
    ],
  },
  noyade: {
    intervalMin: 15,
    criteria: [
      { fr: "SpO₂ + auscultation (OAP secondaire possible à H6)", ar: "SpO₂ + سمع (وذمة ثانوية ممكنة حتى س6)" },
      { fr: "Température + glycémie", ar: "حرارة + سكر" },
      { fr: "Conscience (stade de noyade)", ar: "وعي (مرحلة الغرق)" },
    ],
    improve: {
      signs: [{ fr: "SpO₂ > 94 % à l'air, asymptomatique", ar: "SpO₂ > 94% بالهواء، بلا أعراض" }],
      actions: [
        { txt: { fr: "Surveillance 6 h minimum — jamais de sortie immédiate", ar: "مراقبة 6 ساعات — لا خروج فورياً أبداً" } },
        { txt: { fr: "Réchauffement passif, bilan si apnée initiale", ar: "تدفئة سلبية، تحاليل إذا كان انقطاع نفس" } },
      ],
    },
    stall: {
      signs: [{ fr: "Toux/désaturation modérée persistante", ar: "سعال/هبوط أكسجة متوسط مستمر" }],
      actions: [
        { txt: { fr: "O₂, radiographie thoracique, hospitalisation", ar: "أكسجين، تصوير صدر، إدخال" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [{ fr: "OAP secondaire : mousse, crépitants, SpO₂ ↓", ar: "وذمة ثانوية: زبد، فقاعات، SpO₂ ↓" }],
      actions: [
        { txt: { fr: "VNI ou intubation — réanimation", ar: "تهوية غير باضعة أو تنبيب — إنعاش" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Plongeon + cervicalgies", ar: "غطس + آلام رقبية" }, suspect: { fr: "Traumatisme du rachis", ar: "رض فقري" }, href: "/protocoles/polytraumatisme", label: { fr: "Trauma", ar: "رضوض" } },
      { sign: { fr: "Eau froide prolongée", ar: "ماء بارد مطول" }, suspect: { fr: "Hypothermie", ar: "انخفاض حرارة" }, href: "/protocoles/hypothermie", label: { fr: "Réchauffer", ar: "تدفئة" } },
    ],
  },
  hypothermie: {
    intervalMin: 30,
    criteria: [
      { fr: "Température centrale (sonde basse lecture)", ar: "حرارة مركزية (مسبار منخفض القراءة)" },
      { fr: "Rythme (FV fréquente < 28 °C)", ar: "نظم (رجفان بطيني شائع < 28°)" },
      { fr: "Vitesse de réchauffement (1-2 °C/h)", ar: "سرعة التدفئة (1-2°/س)" },
    ],
    improve: {
      signs: [{ fr: "T° qui remonte, frissons de retour (bon signe)", ar: "حرارة ترتفع، قشعريرة عادت (علامة جيدة)" }],
      actions: [
        { txt: { fr: "Réchauffement actif externe couvertures + boissons chaudes si conscient", ar: "تدفئة خارجية نشطة + مشروبات ساخنة إن كان واعياً" } },
        MONITOR,
      ],
    },
    stall: {
      signs: [{ fr: "Plateau < 32 °C malgré mesures externes", ar: "ثبات < 32° رغم التدابير الخارجية" }],
      actions: [
        { txt: { fr: "Réchauffement interne : solutés 40-42 °C, O₂ chaud, transfert réa", ar: "تدفئة داخلية: سوائل 40-42°، أكسجين دافئ، إنعاش" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "FV ou asystolie", ar: "رجفان/توقف بطيني" }],
      actions: [
        { txt: { fr: "Max 3 chocs avant 30 °C, RCP continue — « pas mort tant que chaud et mort »", ar: "3 صدمات كحد أقصى قبل 30°، إنعاش مستمر — لا إعلان وفاة قبل التدفئة" } },
        { txt: { fr: "ECMO/CCR = traitement de choix si disponible", ar: "ECMO = العلاج الأمثل إن توفر" } },
      ],
    },
    pivots: [
      { sign: { fr: "Coma éthylique/toxique associé", ar: "غيبوبة كحولية/تسممية" }, suspect: { fr: "Intoxication", ar: "تسمم" }, href: "/protocoles/intoxication-medicamenteuse", label: { fr: "Toxico", ar: "سموم" } },
      { sign: { fr: "Chute/immobilité prolongée au sol", ar: "سقوط/بقاء مطول أرضاً" }, suspect: { fr: "Rhabdomyolyse", ar: "انحلال عضلي" }, href: "/protocoles/rhabdomyolyse", label: { fr: "Rhabdo", ar: "انحلال" } },
    ],
  },
  "intoxication-medicamenteuse": {
    intervalMin: 30,
    criteria: [
      { fr: "Conscience + FR + pupilles (triade toxidromique)", ar: "وعي + تنفس + حدقات (ثلاثية التسمم)" },
      { fr: "ECG : QRS, QT (antidépresseurs !)", ar: "تخطيط: QRS، QT (مضادات الاكتئاب!)" },
      { fr: "Inventaire des boîtes + heure de prise", ar: "جرد العلب + توقيت البلع" },
    ],
    improve: {
      signs: [{ fr: "Patient qui s'éveille, constantes stables", ar: "يستيقظ، حيوية مستقرة" }],
      actions: [
        { txt: { fr: "Surveillance 24 h (formes à libération prolongée : rechute possible)", ar: "مراقبة 24 س (الأشكال مديدة التحرير: نكس ممكن)" } },
        { txt: { fr: "Avis psychiatrique avant sortie", ar: "رأي نفسي قبل الخروج" }, go: { href: "/psychiatrie", fr: "Psychiatrie", ar: "طب نفسي" } },
      ],
    },
    stall: {
      signs: [{ fr: "Coma stable sans antidote fait", ar: "غيبوبة ثابتة دون ترياق" }],
      actions: [
        { txt: { fr: "Naloxone si opioïdes (myosis + FR basse), charbon si < 2 h", ar: "نالوكسون للأفيونات (تضيق حدقات + تنفس منخفض)، فحم إذا < 2 س" }, go: { href: "/medicaments/naloxone", fr: "Naloxone", ar: "نالوكسون" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "QRS > 120 ms (tricycliques)", ar: "QRS > 120 مللي ثانية (ثلاثية الحلقات)" },
        { fr: "Convulsions, décompensation respiratoire", ar: "اختلاجات، تدهور تنفسي" },
      ],
      actions: [
        { txt: { fr: "Bicarbonate de sodium 1-2 mEq/kg si QRS large", ar: "بيكربونات الصوديوم 1-2 مك/كغ إذا QRS عريض" } },
        AIRWAY,
      ],
    },
    pivots: [
      { sign: { fr: "Sueurs + pâleur + tachycardie inexpliquée", ar: "تعرق + شحوب + تسرع قلب غير مفسر" }, suspect: { fr: "Hypoglycémie", ar: "نقص سكر" }, href: "/protocoles/hypoglycemie", label: { fr: "Glycémie capillaire", ar: "سكر شعيري" } },
      { sign: { fr: "Traumatisme crânien lors de la découverte", ar: "رض دماغي عند الاكتشاف" }, suspect: { fr: "Traumatisme crânien", ar: "رض دماغي" }, href: "/protocoles/traumatisme-cranien", label: { fr: "TC", ar: "ر ض د" } },
    ],
  },
  "hemorragie-digestive-haute": {
    intervalMin: 15,
    criteria: [
      { fr: "PA, FC, conscience (score de choc)", ar: "ضغط، نبض، وعي (مقياس الصدمة)" },
      { fr: "Récidive : nouveau vomissement/méléna", ar: "نكس: إقياء/براز أسود جديد" },
      { fr: "Hb + groupe/rhésus en cours", ar: "خضاب + زمرة قيد التحضير" },
    ],
    improve: {
      signs: [{ fr: "Hémodynamique stable, saignement arrêté", ar: "استقرار، نزف توقف" }],
      actions: [
        { txt: { fr: "IPP IV forte dose + endoscopie < 24 h", ar: "مثبط مضخة بروتون وريدي + تنظير < 24 س" }, go: { href: "/medicaments", fr: "Les médicaments (IPP)", ar: "قائمة الأدوية (مثبطات المضخة)" } },
        { txt: { fr: "Transfusion ciblée (Hb < 7 ; < 9 si coronarien)", ar: "نقل موجه (خضاب < 7؛ < 9 للإكليليين)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Instabilité malgré 2 CGR", ar: "عدم استقرار رغم وحدتي دم" }],
      actions: [
        { txt: { fr: "Endoscopie en urgence + réanimation", ar: "تنظير عاجل + إنعاش" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "Choc hémorragique, hémorragie foudroyante", ar: "صدمة نزفية، نزف صاعق" }],
      actions: [
        { txt: { fr: "Transfusion massive + hémostase endoscopique/chirurgicale", ar: "نقل كثيف + إيقاف نزف تنظيري/جراحي" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Cirrhose connue / signes d'hypertension portale", ar: "تشمع معروف/علامات ارتفاع ضغط بابي" }, suspect: { fr: "Rupture de varices œsophagiennes", ar: "تمزق دوالي مريئية" }, href: "/protocoles/hemorragie-digestive-haute", label: { fr: "Terlipressine", ar: "تيرليبريسين" } },
    ],
  },
  "exacerbation-bpco": {
    intervalMin: 30,
    criteria: [
      { fr: "SpO₂ cible 88-92 % (jamais plus !)", ar: "SpO₂ هدف 88-92% (أبداً أكثر!)" },
      { fr: "FR + signes de lutte", ar: "تنفس + علامات جهد" },
      { fr: "Conscience (hypercapnie)", ar: "وعي (فرط CO₂)" },
    ],
    improve: {
      signs: [{ fr: "SpO₂ 88-92 stable, FR ↓", ar: "SpO₂ 88-92 ثابت، تنفس ينزل" }],
      actions: [
        { txt: { fr: "Bronchodilatateurs nébulisés + corticoïdes + ATB si purulence", ar: "موسعات قصبية + كورتيزون + مضاد حيوي للقيح" } },
        { txt: { fr: "Réévaluation à distance : sevrage tabac, vaccination", ar: "متابعة: إقلاع عن التدخين، تلقيح" } },
      ],
    },
    stall: {
      signs: [{ fr: "Acidose respiratoire persistante (pH < 7,35)", ar: "حماض تنفسي مستمر (pH < 7.35)" }],
      actions: [
        { txt: { fr: "VNI en première intention — unité de surveillance", ar: "تهوية غير باضعة خط أول — وحدة مراقبة" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "Somnolence, pH < 7,25, échec VNI", ar: "نعاس، pH < 7.25، فشل التهوية غير الباضعة" },
      ],
      actions: [
        { txt: { fr: "Intubation (réglages protecteurs : temps expiratoire long)", ar: "تنبيب (إعدادات وقائية: زفير طويل)" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Crépitants bilatéraux + orthopnée", ar: "فقاعات ثنائية + ضجعة" }, suspect: { fr: "OAP", ar: "وذمة رئة" }, href: "/protocoles/oap", label: { fr: "OAP", ar: "وذمة" } },
      { sign: { fr: "Douleur pleurale + asymétrie du murmure", ar: "ألم جنبي + عدم تناظر صوت" }, suspect: { fr: "Pneumothorax", ar: "استرواح" }, href: "/protocoles/pneumothorax-suffocant", label: { fr: "Pneumo", ar: "استرواح" } },
    ],
  },
  "convulsion-febrile": {
    intervalMin: 15,
    criteria: [
      { fr: "Température + durée de la crise", ar: "حرارة + مدة النوبة" },
      { fr: "Conscience post-critique (doit redevenir normale)", ar: "وعي بعد النوبة (يجب أن يعود طبيعياً)" },
      { fr: "Signes méningés chez le nourrisson", ar: "علامات سحائية عند الرضيع" },
    ],
    improve: {
      signs: [{ fr: "Crise < 5 min, conscience normale en < 15 min, simple", ar: "نوبة < 5 د، وعي طبيعي < 15 د، بسيطة" }],
      actions: [
        { txt: { fr: "Antipyrétiques + hydratation — rassurer (pronostic bénin)", ar: "خافضات حرارة + إماهة — طمئن (إنذار حميد)" } },
        { txt: { fr: "Consignes écrites de retour : crise > 5 min, récidive", ar: "تعليمات مكتوبة للعودة: نوبة > 5 د، نكس" } },
      ],
    },
    stall: {
      signs: [{ fr: "Fièvre persistante, enfant grognon", ar: "حمى مستمرة، طفل متذمر" }],
      actions: [
        { txt: { fr: "Chercher le foyer : ORL, pulmonaire, urinaire", ar: "ابحث البؤرة: أذن، رئة، بول" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "Crise > 5 min ou récidive = état de mal fébrile", ar: "نوبة > 5 د أو نكس = حالة صرعية حمية" },
        { fr: "Signes focaux, conscience qui ne revient pas", ar: "علامات بؤرية، وعي لا يعود" },
      ],
      actions: [
        { txt: { fr: "Diazépam rectal 0,5 mg/kg puis protocole état de mal", ar: "ديازيبام شرجي 0.5 ملغ/كغ ثم بروتوكول الحالة" }, go: { href: "/protocoles/etat-mal-epileptique", fr: "État de mal", ar: "حالة صرعية" } },
        { txt: { fr: "PL si doute de méningite (après stabilisation)", ar: "بزل قطني عند شك السحايا (بعد التثبيت)" } },
      ],
    },
    pivots: [
      { sign: { fr: "Raideur de nuque, purpura, bombement fontanelle", ar: "تصلب رقبة، فرفرية، انتفاخ يافوخ" }, suspect: { fr: "Méningite", ar: "التهاب سحايا" }, href: "/protocoles/choc-septique", label: { fr: "Sepsis", ar: "إنتان" } },
      { sign: { fr: "Sueurs + pâleur + tachycardie inexpliquée", ar: "تعرق + شحوب + تسرع قلب غير مفسر" }, suspect: { fr: "Hypoglycémie", ar: "نقص سكر" }, href: "/protocoles/hypoglycemie", label: { fr: "Glycémie capillaire", ar: "سكر شعيري" } },
    ],
  },
  electrocution: {
    intervalMin: 15,
    criteria: [
      { fr: "ECG + monitorage (arythmies retardées)", ar: "تخطيط + مراقبة (اضطرابات متأخرة)" },
      { fr: "Points d'entrée/sortie + atteinte profonde", ar: "نقطتا الدخول/الخروج + إصابة عميقة" },
      { fr: "Urines (myoglobinurie), traumatisme de chute", ar: "بول (ميوغلوبين)، رض السقوط" },
    ],
    improve: {
      signs: [{ fr: "Asymptomatique, ECG normal, basse tension", ar: "بلا أعراض، تخطيط طبيعي، توتر منخفض" }],
      actions: [
        { txt: { fr: "Monitorage 6 h puis sortie si ECG et examen normaux", ar: "مراقبة 6 س ثم خروج إذا طبيعياً" } },
        { txt: { fr: "Soins des brûlures + ATAT", ar: "عناية الحروق + كزاز" }, go: { href: "/protocoles/brulure-grave", fr: "Brûlures", ar: "حروق" } },
      ],
    },
    stall: {
      signs: [{ fr: "Extrasystoles / anomalies ECG isolées", ar: "خوارج/شذوذات تخطيط معزولة" }],
      actions: [
        { txt: { fr: "Prolonger le monitorage 12-24 h", ar: "أطل المراقبة 12-24 س" } },
        MONITOR,
      ],
    },
    worsen: {
      signs: [
        { fr: "Fibrillation, arrêt, compartment syndrome, anurie", ar: "رجفان، توقف، متلازمة حجرات، انقطاع إدرار" },
      ],
      actions: [
        { txt: { fr: "Défibrillation + RCP ; chirurgie de décharge ; réa", ar: "صدمة + إنعاش؛ جراحة تفريغ؛ إنعاش" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Projection à distance", ar: "قذف لمسافة" }, suspect: { fr: "Traumatisme associé", ar: "رض مرافق" }, href: "/protocoles/polytraumatisme", label: { fr: "Trauma", ar: "رضوض" } },
    ],
  },
  "hypertension-gravidique": {
    intervalMin: 15,
    criteria: [
      { fr: "PA (objectif < 160/110)", ar: "ضغط (هدف < 160/110)" },
      { fr: "Signes de gravité : céphalées, phosphènes, douleur épigastrique", ar: "علامات خطورة: صداع، ومضات، ألم شرسوفي" },
      { fr: "RCF (bien-être fœtal)", ar: "قلب الجنين" },
    ],
    improve: {
      signs: [{ fr: "PA < 160/110 sans signes de gravité", ar: "ضغط < 160/110 دون علامات خطورة" }],
      actions: [
        { txt: { fr: "Traitement per os (labétalol/nifédipine) + hospitalisation obstétricale", ar: "علاج فموي (لابيتالول/نيفيديبين) + إدخال توليدي" } },
        MONITOR,
      ],
    },
    stall: {
      signs: [{ fr: "PA persiste ≥ 160/110 malgré traitement", ar: "ضغط ≥ 160/110 رغم العلاج" }],
      actions: [
        { txt: { fr: "2ᵉ molécule IV + bilan pré-éclampsie (protéinurie, bilan hépatique, plaquettes)", ar: "جزيء ثانٍ وريدي + تحاليل ما قبل الارتعاج" }, go: { href: "/medicaments/labetalol", fr: "Labétalol", ar: "لابيتالول" } },
      ],
    },
    worsen: {
      signs: [
        { fr: "Imminence d'éclampsie : céphalées + phosphènes + épigastralgie", ar: "نذر الارتعاج: صداع + ومضات + ألم شرسوفي" },
        { fr: "RCF pathologique, HELLP", ar: "قلب جنين مرضي، HELLP" },
      ],
      actions: [
        { txt: { fr: "MgSO₄ préventif + extraction fœtale : décision immédiate", ar: "MgSO₄ وقائي + إنهاء الحمل: قرار فوري" }, go: { href: "/protocoles/eclampsie", fr: "Éclampsie", ar: "ارتعاج" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Crise convulsive", ar: "نوبة اختلاجية" }, suspect: { fr: "Éclampsie constituée", ar: "ارتعاج مكتمل" }, href: "/protocoles/eclampsie", label: { fr: "MgSO₄", ar: "MgSO₄" } },
      { sign: { fr: "Douleur abdominale + métrorragies", ar: "ألم بطني + نزف رحمي" }, suspect: { fr: "Hématome rétroplacentaire", ar: "ورم دموي خلف المشيمة" }, href: "/protocoles/hemorragie-post-partum", label: { fr: "Obstétrique", ar: "توليد" } },
    ],
  },

  "pelvis-instable": {
    intervalMin: 5,
    criteria: [
      { fr: "PA/FC après ceinture + chaque bolus", ar: "ضغط/نبض بعد الحزام وكل دفعة" },
      { fr: "Réponse au remplissage (transitoire ?)", ar: "الاستجابة للتعبئة (عابرة؟)" },
      { fr: "Diurèse + conscience", ar: "إدرار + وعي" },
    ],
    improve: {
      signs: [{ fr: "PA stable sans vasopresseur après ceinture + sang", ar: "ضغط ثابت دون مقويات بعد الحزام والدم" }],
      actions: [
        { txt: { fr: "Scanner bassin/abdomen puis orthopédie — ne pas retirer la ceinture", ar: "ماسح حوض/بطن ثم عظام — لا تنزع الحزام" } },
      ],
    },
    stall: {
      signs: [{ fr: "Choc transitoirement répondeur", ar: "صدمة تستجيب مؤقتاً" }],
      actions: [
        { txt: { fr: "Poursuivre transfusion + TXA ; préparer bloc/embolisation", ar: "واصل النقل + TXA؛ حضّر العمليات/الإصمام" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Non-répondeur malgré 2 CGR + ceinture", ar: "لا استجابة رغم وحدتي دم + الحزام" }],
      actions: [
        { txt: { fr: "Embolisation/packing IMMÉDIAT — source artérielle", ar: "إصمام/حشو فوري — مصدر شرياني" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Distension abdominale + matière au toucher", ar: "انتفاخ بطني + براز باللمس" }, suspect: { fr: "Plaie rectale/bassin ouvert", ar: "جرح مستقيم/حوض مفتوح" }, href: "/protocoles/polytraumatisme", label: { fr: "Polytrauma", ar: "رضوض متعددة" } },
    ],
  },
  "amputation-crush": {
    intervalMin: 15,
    criteria: [
      { fr: "Pouls distal + sensibilité du moignon", ar: "نبض بعيد + حساسية الجدعة" },
      { fr: "Diurèse + couleur des urines (crush)", ar: "إدرار + لون البول (انسحاق)" },
      { fr: "K⁺ (risque de reperfusion)", ar: "بوتاسيوم (خطر إعادة الإرواء)" },
    ],
    improve: {
      signs: [{ fr: "Hémostase acquise, urines claires", ar: "إرقاء achieved، بول صافٍ" }],
      actions: [
        { txt: { fr: "Poursuivre hydratation, membre au froid, transfert chirurgie de la main/membre", ar: "واصل الإماهة، الطرف بالبرودة، تحويل جراحة" } },
      ],
    },
    stall: {
      signs: [{ fr: "Urites « coca » sans insuffisance encore", ar: "بول بلون الكولا دون قصور بعد" }],
      actions: [
        { txt: { fr: "Hydratation massive (objectif 200-300 mL/h) + suivre K⁺/CPK", ar: "إماهة كثيفة (هدف 200-300 مل/س) + تابع الشوارد" }, go: { href: "/protocoles/rhabdomyolyse", fr: "Rhabdomyolyse", ar: "انحلال عضلي" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Oligurie + K⁺ qui monte + ECG anormal", ar: "قلة إدرار + بوتاسيوم صاعد + تخطيط شاذ" }],
      actions: [
        { txt: { fr: "Traitement hyperkaliémie + dialyse — néphrologie urgente", ar: "علاج فرط البوتاسيوم + ديلزة — كلى عاجل" }, go: { href: "/protocoles/hyperkaliemie", fr: "Hyperkaliémie", ar: "فرط بوتاسيوم" } },
      ],
    },
    pivots: [
      { sign: { fr: "Loge tendue, douleur à la passive", ar: "حجرة متوترة، ألم سلبي" }, suspect: { fr: "Syndrome des loges", ar: "متلازمة حجرات" }, href: "/protocoles/rhabdomyolyse", label: { fr: "Aponévrotomie", ar: "شق لفافي" } },
    ],
  },
  "thorax-penetrant": {
    intervalMin: 5,
    criteria: [
      { fr: "SpO₂ + FR + murmure vésiculaire bilatéral", ar: "SpO₂ + تنفس + صوت تنفسي بالجهتين" },
      { fr: "Débit du drain (hémothorax ?)", ar: "تدفق الأنبوبة (دم صدري؟)" },
      { fr: "TA + scope (tamponnade ?)", ar: "ضغط + مراقبة (اندحاس؟)" },
    ],
    improve: {
      signs: [{ fr: "SpO₂ stable, drain productif qui tarit", ar: "SpO₂ ثابت، أنبوبة يتناقص تدفقها" }],
      actions: [
        { txt: { fr: "Radio de contrôle, scanner si trajet douteux (abdomen !)", ar: "صورة مراقبة، ماسح إذا المسار مشكوك (البطن!)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Hypoxémie persistante malgré drain", ar: "نقص أكسجة مستمر رغم الأنبوبة" }],
      actions: [
        { txt: { fr: "Vérifier drain (bouché/mal positionné) ± 2ᵉ drain ; scanner", ar: "تحقق من الأنبوبة (انسداد/موضع) ± أنبوبة ثانية؛ ماسح" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Choc + turgescence jugulaire / drain > 1500 mL ou > 200 mL/h", ar: "صدمة + انتفاخ وداجي / أنبوبة > 1500 مل أو > 200 مل/س" }],
      actions: [
        { txt: { fr: "Thoracotomie de sauvetage / chirurgie — appel immédiat", ar: "فتح صدر إنقاذي/جراحة — نداء فوري" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Trajet sous-mamelon, douleur abdominale", ar: "مسار تحت الحلمة، ألم بطني" }, suspect: { fr: "Lésion abdominale associée", ar: "إصابة بطنية مرافقة" }, href: "/protocoles/fast-echo", label: { fr: "eFAST", ar: "eFAST" } },
    ],
  },
  "fracture-ouverte": {
    intervalMin: 30,
    criteria: [
      { fr: "Pouls distal + sensibilité (documentés à chaque tour)", ar: "نبض بعيد + حساسية (موثقة كل دورة)" },
      { fr: "Douleur contrôlée ?", ar: "الألم منضبط؟" },
      { fr: "Pansement propre, ATB faite < 1 h", ar: "ضمادة نظيفة، مضاد < 1 س" },
    ],
    improve: {
      signs: [{ fr: "Pouls présent, douleur contrôlée, attelle en place", ar: "نبض موجود، ألم منضبط، جبيرة موضوعة" }],
      actions: [
        { txt: { fr: "À jeun pour le bloc ; dossier transfusionnel prêt", ar: "صيام للعمليات؛ ملف النقل جاهز" } },
      ],
    },
    stall: {
      signs: [{ fr: "Douleur croissante malgré analgésiques", ar: "ألم متصاعد رغم المسكنات" }],
      actions: [
        { txt: { fr: "REDOUTER le syndrome des loges — réexamen rapproché, chirurgien prévenu", ar: "احذر متلازمة الحجرات — إعادة فحص لصيقة، أبلغ الجراح" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Pouls disparu, loge tendue, pâleur du segment", ar: "نبض غائب، حجرة متوترة، شحوب القطعة" }],
      actions: [
        { txt: { fr: "Chirurgie vasculaire + aponévrotomie en urgence absolue", ar: "جراحة أوعية + شق لفافي بطارئ مطلق" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Fièvre + écoulement purulent (48-72 h)", ar: "حمى + قيح (48-72 س)" }, suspect: { fr: "Infection du foyer", ar: "عدوى الموضع" }, href: "/protocoles/choc-septique", label: { fr: "Sepsis", ar: "إنتان" } },
    ],
  },
  "oeil-chimique": {
    intervalMin: 10,
    criteria: [
      { fr: "pH du cul-de-sac (bandelette) toutes les 10 min", ar: "pH الملتحمة كل 10 د" },
      { fr: "Clarté cornéenne à la fluorescéine", ar: "صفاء القرنية بالفلوريسين" },
      { fr: "Toutes les particules retirées ?", ar: "هل أُزيلت كل الجزيئات؟" },
    ],
    improve: {
      signs: [{ fr: "pH 7,0-7,2 stable sur 2 contrôles", ar: "pH ‏7.0-7.2 ثابت بقياسين" }],
      actions: [
        { txt: { fr: "Arrêter le lavage, atropine collyre, ophtalmo dans les heures", ar: "أوقف الغسل، قطرة أتروبين، طب عيون خلال ساعات" } },
      ],
    },
    stall: {
      signs: [{ fr: "pH qui remonte après arrêt du lavage", ar: "pH يرتفع بعد إيقاف الغسل" }],
      actions: [
        { txt: { fr: "Reprendre le lavage — particules résiduelles sous la paupière (re-éverser)", ar: "استأنف الغسل — جزيئات باقية تحت الجفن (اقلبه مجدداً)" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Opacité cornéenne, œil blanc ischémique", ar: "عتامة قرنية، عين بيضاء إقفارية" }],
      actions: [
        { txt: { fr: "Transfert ophtalmologique URGENT (greffe/AMT possible)", ar: "تحويل عاجل لطب العيون (ترقيع ممكن)" } },
      ],
    },
    pivots: [
      { sign: { fr: "Traumatisme contondant associé (hyphéma ?)", ar: "رض راض مرافق (دم بالعين؟)" }, suspect: { fr: "Traumatisme du globe", ar: "رض المقلة" }, href: "/protocoles/traumatisme-cranien", label: { fr: "Trauma face", ar: "رض الوجه" } },
    ],
  },
  "fast-echo": {
    intervalMin: 15,
    criteria: [
      { fr: "Constantes stables depuis l'examen ?", ar: "هل الحيوية مستقرة منذ الفحص؟" },
      { fr: "Suspicion clinique persistante malgré FAST négatif ?", ar: "شك سريري مستمر رغم FAST سلبي؟" },
    ],
    improve: {
      signs: [{ fr: "Patient stable, FAST négatif, examen rassurant", ar: "مستقر، FAST سلبي، فحص مطمئن" }],
      actions: [
        { txt: { fr: "Surveillance + répéter le FAST à 30 min si mécanisme à risque", ar: "مراقبة + أعد FAST بعد 30 د للآليات الخطرة" } },
      ],
    },
    stall: {
      signs: [{ fr: "Douleur abdominale persistante, Hb limite", ar: "ألم بطني مستمر، خضاب حدي" }],
      actions: [
        { txt: { fr: "Scanner injecté si stable — le FAST n'élimine pas les lésions d'organe plein", ar: "ماسح بالظليلة إن استقر — FAST لا يستبعد إصابات الأعضاء" } },
      ],
    },
    worsen: {
      signs: [{ fr: "FAST qui se positive / choc", ar: "FAST يصبح إيجابياً/صدمة" }],
      actions: [
        { txt: { fr: "Bloc opératoire direct — ne pas repasser par le scanner", ar: "عمليات مباشرة — لا تعد للماسح" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Liquide sans trauma chez la femme en âge de procréer", ar: "سائل بلا رض عند امرأة بعمر الإنجاب" }, suspect: { fr: "Grossesse extra-utérine rompue", ar: "حمل خارج الرحم متمزق" }, href: "/protocoles/hemorragie-post-partum", label: { fr: "Gynéco", ar: "نسائي" } },
    ],
  },
  "intoxication-phosphure-aluminium": {
    intervalMin: 15,
    criteria: [
      { fr: "PA (choc précoce et réfractaire)", ar: "ضغط (صدمة مبكرة مستعصية)" },
      { fr: "ECG continu (arythmies malignes)", ar: "تخطيط مستمر (اضطرابات خبيثة)" },
      { fr: "Gazos : acidose métabolique", ar: "غازات: حماض استقلابي" },
    ],
    improve: {
      signs: [{ fr: "Stabilité hémodynamique 24-48 h (bon signe, mais surveillance 72 h)", ar: "استقرار دوراني 24-48 س (علامة جيدة، مراقبة 72 س)" }],
      actions: [
        { txt: { fr: "Poursuivre monitorage réa + soutien psychiatrique", ar: "واصل مراقبة الإنعاش + دعم نفسي" } },
      ],
    },
    stall: {
      signs: [{ fr: "Acidose persistante malgré bicarbonates", ar: "حماض مستمر رغم البيكربونات" }],
      actions: [
        { txt: { fr: "Optimiser noradrénaline, envisager dialyse (support), réa spécialisée", ar: "حسّن النورأدرينالين، فكر في الديلزة (دعم)، إنعاش متخصص" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Arythmie maligne / arrêt", ar: "اضطراب خبيث/توقف" }],
      actions: [
        { txt: { fr: "RCP prolongée + défibrillation — survies possibles après RCP longue", ar: "إنعاش مطول + صدمة — النجاة ممكنة بعد إنعاش طويل" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Co-ingestion d'autres produits (boîtes multiples)", ar: "بلع مشترك (علب متعددة)" }, suspect: { fr: "Polymédication", ar: "تعدد الأدوية" }, href: "/protocoles/intoxication-medicamenteuse", label: { fr: "Toxico", ar: "سموم" } },
    ],
  },
  "sca-nstem": {
    intervalMin: 30,
    criteria: [
      { fr: "Douleur (échelle 0-10) + ECG répété", ar: "ألم (0-10) + تخطيط متكرر" },
      { fr: "Delta troponine H0/H1", ar: "دلتا التروبونين س0/س1" },
      { fr: "Signes électriques dynamiques", ar: "علامات كهربائية متحركة" },
    ],
    improve: {
      signs: [{ fr: "Douleur disparue, ECG stable, troponine plate", ar: "ألم زال، تخطيط ثابت، تروبونين مسطح" }],
      actions: [
        { txt: { fr: "Stratification HEART/GRACE : bas risque ⇒ test non invasif ; sinon coronarographie < 72 h", ar: "تصنيف HEART/GRACE: منخفض ⇒ اختبار غير باضع؛ وإلا قسطرة < 72 س" }, go: { href: "/calculateurs/scores", fr: "Score HEART", ar: "درجة HEART" } },
      ],
    },
    stall: {
      signs: [{ fr: "Douleur qui va-et-vient, ECG inchangé mais symptomatique", ar: "ألم متردد، تخطيط ثابت مع أعراض" }],
      actions: [
        { txt: { fr: "Répéter troponine + ECG ; optimiser anti-ischémiques ; coronarographie < 24 h", ar: "أعد التروبونين + التخطيط؛ حسّن مضادات الإقفار؛ قسطرة < 24 س" } },
      ],
    },
    worsen: {
      signs: [
        { fr: "Douleur réfractaire, sous-ST qui s'étend, TV, choc", ar: "ألم مقاوم، انخفاض ST يتمدد، تسرع بطيني، صدمة" },
      ],
      actions: [
        { txt: { fr: "Très haut risque ⇒ coronarographie < 2 h comme un STEMI", ar: "خطر عالٍ جداً ⇒ قسطرة < 2 س كالاحتشاء" }, go: { href: "/protocoles/sca-stemi", fr: "STEMI", ar: "احتشاء" } },
      ],
    },
    pivots: [
      { sign: { fr: "Douleur pleurale + dyspnée + facteurs thromboemboliques", ar: "ألم جنبي + زلة + عوامل خثرية" }, suspect: { fr: "Embolie pulmonaire", ar: "انصمام رئوي" }, href: "/protocoles/embolie-pulmonaire", label: { fr: "EP", ar: "انصمام" } },
      { sign: { fr: "Contexte viral + fièvre chez un sujet jeune", ar: "سياق فيروسي + حمى عند شاب" }, suspect: { fr: "Myocardite", ar: "التهاب عضلة القلب" }, href: "/protocoles/myocardite", label: { fr: "Myocardite", ar: "التهاب العضلة" } },
    ],
  },
  "fa-nouvelle": {
    intervalMin: 30,
    criteria: [
      { fr: "FC contrôlée (< 110/min au repos) ?", ar: "نبض منضبط (< 110/د بالراحة)؟" },
      { fr: "Tolérance : PA, conscience, OAP", ar: "التحمل: ضغط، وعي، وذمة" },
      { fr: "Anticoagulation décidée (CHA₂DS₂-VASc) ?", ar: "هل تقرر التمييع (CHA₂DS₂-VASc)؟" },
    ],
    improve: {
      signs: [{ fr: "FC < 110, patient asymptomatique", ar: "نبض < 110، بلا أعراض" }],
      actions: [
        { txt: { fr: "Relais per os + bilan (TSH, écho) + anticoagulation selon score", ar: "تحويل فموي + تحاليل (TSH، إيكو) + تمييع حسب النقاط" } },
      ],
    },
    stall: {
      signs: [{ fr: "FC > 110 malgré bêtabloquant titré", ar: "نبض > 110 رغم حاصر بيتا معاير" }],
      actions: [
        { txt: { fr: "Vérifier le déclencheur (sepsis ? EP ? thyroïde ?) — c'est souvent la vraie maladie", ar: "ابحث المحفز (إنتان؟ انصمام؟ درق؟) — غالباً هو المرض الحقيقي" } },
        { txt: { fr: "Associer digoxine si fonction VG altérée — avis cardiologie", ar: "أضف ديغوكسين إذا قصور بطين — رأي قلب" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Choc, OAP, angor — instabilité", ar: "صدمة، وذمة، ألم صدري — عدم استقرار" }],
      actions: [
        { txt: { fr: "Cardioversion électrique synchronisée immédiate (sédation)", ar: "تقويم كهربي متزامن فوري (بتهدئة)" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "QRS larges + FA (delta ?)", ar: "QRS عريض + رجفان (دلتا؟)" }, suspect: { fr: "WPW — CI digoxine/vérapamil", ar: "WPW — ممنوع ديغوكسين/فيراباميل" }, href: "/protocoles/tachycardie", label: { fr: "Tachycardie", ar: "تسرع" } },
      { sign: { fr: "Fièvre + frissons", ar: "حمى + قشعريرة" }, suspect: { fr: "Sepsis déclencheur", ar: "إنتان محفز" }, href: "/protocoles/choc-septique", label: { fr: "Sepsis", ar: "إنتان" } },
    ],
  },
  myocardite: {
    intervalMin: 30,
    criteria: [
      { fr: "Rythme au scope (arythmies malignes 48 h)", ar: "النظم على المراقبة (اضطرابات 48 س)" },
      { fr: "Tolérance hémodynamique (lactate, diurèse)", ar: "التحمل الدوراني (لاكتات، إدرار)" },
      { fr: "Troponine (cinétique)", ar: "تروبونين (الحركة)" },
    ],
    improve: {
      signs: [{ fr: "Stable 48 h, arythmies absentes", ar: "استقرار 48 س، دون اضطرابات" }],
      actions: [
        { txt: { fr: "IRM cardiaque programmée + repos sportif 3-6 mois", ar: "رنين قلبي مبرمج + راحة رياضية 3-6 أشهر" } },
      ],
    },
    stall: {
      signs: [{ fr: "Arythmies ventriculaires répétées", ar: "اضطرابات بطينية متكررة" }],
      actions: [
        { txt: { fr: "Amiodarone + correction K⁺/Mg²⁺ + réa avec défibrillateur au lit", ar: "أميودارون + تصحيح الشوارد + إنعاش بصدمات بجانب السرير" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Choc cardiogénique (lactate ↑, marbrures, oligurie)", ar: "صدمة قلبية (لاكتات ↑، تبرقش، قلة إدرار)" }],
      actions: [
        { txt: { fr: "Support circulatoire (dobutamine/noradrénaline ± ECMO) — centre spécialisé", ar: "دعم دوراني (دوبوتامين/نورأدرينالين ± ECMO) — مركز متخصص" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Facteurs de risque coronariens > 40 ans", ar: "عوامل خطر تاجية فوق 40" }, suspect: { fr: "SCA d'abord", ar: "متلازمة تاجية أولاً" }, href: "/protocoles/sca-stemi", label: { fr: "STEMI", ar: "احتشاء" } },
    ],
  },

  "intoxication-methanol": {
    intervalMin: 30,
    criteria: [
      { fr: "Conscience + vision (acuité, champ)", ar: "الوعي + البصر (حدة، مجال)" },
      { fr: "Gazométrie : pH et trou anionique", ar: "غازات: pH والفجوة الأنيونية" },
      { fr: "PA, diurèse, glycémie, K⁺ (sous éthanol/insuline)", ar: "ضغط، إدرار، سكر، بوتاسيوم" },
      { fr: "Délai et accès à l'hémodialyse", ar: "التوقيت والوصول إلى الديلزة" },
    ],
    improve: {
      signs: [{ fr: "pH qui remonte, trou anionique qui se ferme, vision stable", ar: "ارتفاع pH، انغلاق الفجوة، استقرار البصر" }],
      actions: [
        { txt: { fr: "Poursuivre l'antidote jusqu'à méthanolémie < 20 mg/dL et pH > 7,30", ar: "واصل الترياق حتى ميثانول < 20 ملغ/دل وpH > 7.30" } },
        { txt: { fr: "Contrôler la vue systématiquement avant sortie — cécité retardée possible", ar: "افحص البصر منهجياً قبل الخروج — عمى متأخر ممكن" } },
      ],
    },
    stall: {
      signs: [{ fr: "Acidose qui stagne malgré bicarbonate + antidote", ar: "حماض راكد رغم البيكربونات والترياق" }],
      actions: [
        { txt: { fr: "Recharger l'éthanol (dosage alcoolémie cible 1-1,5 g/L) et avancer l'hémodialyse", ar: "أعد تحميل الإيثانول (الهدف 1-1.5 غ/ل) وقدم الديلزة" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "Baisse d'acuité visuelle, coma, pH < 7,20", ar: "هبوط حدة البصر، غيبوبة، pH < 7.20" }],
      actions: [
        { txt: { fr: "HÉMODIALYSE en urgence absolue + réanimation", ar: "ديلزة طارئة مطلقة + إنعاش" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Coma sans acidose + haleine cétonique", ar: "غيبوبة بلا حماض + نفس كيتوني" }, suspect: { fr: "Acidocétose diabétique", ar: "حماض كيتوني سكري" }, href: "/protocoles/acidocetose-diabetique", label: { fr: "ACD", ar: "حماض سكري" } },
      { sign: { fr: "Co-ingestion de paracétamol", ar: "بلع مشترك لباراسيتامول" }, suspect: { fr: "Toxicité hépatique", ar: "سمية كبدية" }, href: "/protocoles/intoxication-paracetamol", label: { fr: "Paracétamol", ar: "باراسيتامول" } },
    ],
  },
  "intoxication-tricycliques": {
    intervalMin: 30,
    criteria: [
      { fr: "ECG : largeur QRS, rythme, QT", ar: "تخطيط: عرض QRS، نظم، QT" },
      { fr: "Conscience (GCS) — coma brutal possible", ar: "الوعي (GCS) — غيبوبة مباغتة ممكنة" },
      { fr: "PA, FC, température, pH (7,45-7,55 visé)", ar: "ضغط، نبض، حرارة، pH (الهدف 7.45-7.55)" },
    ],
    improve: {
      signs: [{ fr: "QRS < 100 ms, réveil, PA stable", ar: "QRS < 100، إفاقة، ضغط مستقر" }],
      actions: [
        { txt: { fr: "Surveillance ECG totale ≥ 6 h après la dernière prise (12-24 h si LP ou coma initial)", ar: "مراقبة تخطيط ≥ 6 س بعد آخر بلع (12-24 س للمديد أو غيبوبة أولية)" } },
        { txt: { fr: "Avis psychiatrique systématique avant sortie", ar: "رأي نفسي منهجي قبل الخروج" } },
      ],
    },
    stall: {
      signs: [{ fr: "QRS qui reste > 100 ms malgré bicarbonate", ar: "QRS يبقى > 100 رغم البيكربونات" }],
      actions: [
        { txt: { fr: "Vérifier pH (alcaliniser plus), K⁺ bas à corriger, discuter émulsion lipidique", ar: "تحقق من pH (زيد القلونة)، صحح نقص البوتاسيوم، ناقش المستحلب الدهني" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "Convulsions, TV, choc", ar: "اختلاجات، تسرع بطيني، صدمة" }],
      actions: [
        { txt: { fr: "Benzodiazépines (convulsions) + bicarbonate répété + noradrénaline — réanimation", ar: "بنزوديازيبين + بيكربونات متكررة + نورأدرينالين — إنعاش" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Co-ingestion de paracétamol (fréquente)", ar: "بلع مشترك لباراسيتامول (شائع)" }, suspect: { fr: "Hépatotoxicité à H4-H8", ar: "سمية كبدية س4-س8" }, href: "/protocoles/intoxication-paracetamol", label: { fr: "NAC", ar: "NAC" } },
      { sign: { fr: "Mydriase + tachycardie sans QRS large", ar: "توسع حدقة + تسرع دون QRS عريض" }, suspect: { fr: "Syndrome anticholinergique (autres molécules)", ar: "متلازمة مضادة للكولين (جزيئات أخرى)" }, href: "/protocoles/intoxication-medicamenteuse", label: { fr: "Tox médicamenteuse", ar: "تسمم دوائي" } },
    ],
  },
  "intoxication-bb-icc": {
    intervalMin: 15,
    criteria: [
      { fr: "PA, FC, diurèse, conscience", ar: "ضغط، نبض، إدرار، وعي" },
      { fr: "Glycémie q30 min sous insuline haute dose + K⁺", ar: "سكر كل 30 د أثناء الإنسولين العالي + بوتاسيوم" },
      { fr: "ECG : conduction, rythme", ar: "تخطيط: توصيل، نظم" },
    ],
    improve: {
      signs: [{ fr: "PA > 90 sans vasopresseur croissant, FC > 50, diurèse reprise", ar: "ضغط > 90 دون مقوٍ متصاعد، نبض > 50، عودة الإدرار" }],
      actions: [
        { txt: { fr: "Décroître l'insuline par paliers (jamais d'arrêt brutal), observation 24 h min. (48 h si LP)", ar: "أنقص الإنسولين تدريجياً (لا قطع مفاجئ)، ملاحظة 24 س على الأقل (48 للمديد)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Choc stable seulement sous fortes doses d'insuline + vasopresseurs", ar: "صدمة مستقرة فقط بجرع عالية من الإنسولين والمقويات" }],
      actions: [
        { txt: { fr: "Maintenir, discuter émulsion lipidique et pacing — surveillance réa", ar: "حافظ، ناقش المستحلب الدهني والناظم — مراقبة إنعاش" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "BAV 3, asystolie, choc qui se creuse", ar: "حصار 3، لا انقباض، صدمة تتعمق" }],
      actions: [
        { txt: { fr: "Pacing + adrénaline + lipides + discussion ECMO immédiate", ar: "ناظم + أدرينالين + دهون + مناقشة إكمو فورية" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Hypoglycémie + bradycardie sans contexte toxique", ar: "نقص سكر + بطء دون سياق تسمم" }, suspect: { fr: "Hypoglycémie sévère / crise surrénale", ar: "نقص سكر شديد / نوبة كظرية" }, href: "/protocoles/crise-surrenale", label: { fr: "Surrénale", ar: "كظر" } },
    ],
  },
  "morsure-serpent": {
    intervalMin: 30,
    criteria: [
      { fr: "Extension de l'œdème (marquage feutre + heure)", ar: "امتداد الوذمة (علامة القلم + الوقت)" },
      { fr: "TP/TCA/fibrinogène/plaquettes toutes les 4-6 h", ar: "تخثر كل 4-6 س" },
      { fr: "Signes systémiques : saignements, PA, rythme, diurèse", ar: "أعراض جهازية: نزوف، ضغط، نظم، إدرار" },
    ],
    improve: {
      signs: [{ fr: "Œdème stable, coagulation normale à 12-24 h", ar: "وذمة ثابتة، تخثر طبيعي 12-24 س" }],
      actions: [
        { txt: { fr: "Observation 24 h minimum, analgésie, sortie avec consignes (récidive d'œdème, saignements)", ar: "ملاحظة 24 س على الأقل، تسكين، خروج مع تعليمات (عودة وذمة، نزوف)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Œdème qui progresse lentement sans signe systémique", ar: "وذمة تتقدم ببطء دون عرض جهازي" }],
      actions: [
        { txt: { fr: "Surélever le membre, réévaluer la coagulation, discuter sérum avec le centre antipoison", ar: "ارفع الطرف، أعد التخثر، ناقش المصل مع مركز السموم" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Coagulopathie, hypotension, œdème envahissant le tronc", ar: "اعتلال تخثر، هبوط، وذمة تغزو الجذع" }],
      actions: [
        { txt: { fr: "Sérum antivenimeux IV (adrénaline prête) + réanimation", ar: "مصل مضاد وريدي (أدرينالين جاهزة) + إنعاش" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Ptosis, diplopie, paralysie descendante (cobra/élapidé selon région)", ar: "تهدل جفن، شفع، شلل نازل (كوبرا حسب المنطقة)" }, suspect: { fr: "Venin neurotoxique — ventilation", ar: "سم عصبي — تهوية" }, href: "/calculateurs/ventilateur", label: { fr: "Réglages ventilateur", ar: "إعدادات التنفس" } },
    ],
  },
  "prophylaxie-rage": {
    intervalMin: 1440,
    criteria: [
      { fr: "Aspect de la plaie : rougeur, œdème, écoulement", ar: "مظهر الجرح: احمرار، وذمة، إفراز" },
      { fr: "Réalisation effective de la 1re dose vaccinale au centre antirabique", ar: "إعطاء الجرعة الأولى فعلياً بمركز داء الكلب" },
      { fr: "Fièvre, lymphangite, douleur croissante", ar: "حمى، التهاب لمفي، ألم متزايد" },
    ],
    improve: {
      signs: [{ fr: "Plaie propre, schéma vaccinal démarré et compris du patient", ar: "جرح نظيف، بدء التلقيح وفهم المريض له" }],
      actions: [
        { txt: { fr: "Consignes écrites : dates J3/J7/J14/J28, signes d'infection, observation de l'animal", ar: "تعليمات مكتوبة: مواعيد J3/J7/J14/J28، علامات العدوى، مراقبة الحيوان" } },
      ],
    },
    stall: {
      signs: [{ fr: "Patient n'ayant pas pu joindre le centre dans les 24 h", ar: "مريض لم يستطع الوصول للمركز خلال 24 س" }],
      actions: [
        { txt: { fr: "Relance active (téléphone, contact direct du centre) — chaque jour de retard compte", ar: "متابعة حثيثة (هاتف، اتصال مباشر بالمركز) — كل يوم تأخير محسوب" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Plaie infectée (pus, lymphangite), fièvre", ar: "جرح ملتهب (قيح، التهاب لمفي)، حمى" }],
      actions: [
        { txt: { fr: "Amoxicilline-clavulanate + prélèvement + avis chirurgical si main/visage", ar: "أموكسي-كلافولانيك + زرع + رأي جراحي لليد/الوجه" } },
      ],
    },
    pivots: [
      { sign: { fr: "Morsure profonde avec délabrement", ar: "عضة عميقة بهتك" }, suspect: { fr: "Plaie complexe — chirurgie", ar: "جرح معقد — جراحة" }, href: "/protocoles/fracture-ouverte", label: { fr: "Plaie complexe", ar: "جرح معقد" } },
    ],
  },
  "hyponatremie-severe": {
    intervalMin: 120,
    criteria: [
      { fr: "Na⁺ toutes les 2-4 h pendant la correction active", ar: "صوديوم كل 2-4 س أثناء التصحيح النشط" },
      { fr: "Neurologie : conscience, convulsions", ar: "عصبياً: وعي، اختلاجات" },
      { fr: "ΔNa cumulé sur 24 h (plafond 10 mmol/L, 8 si haut risque)", ar: "مجموع التغير خلال 24 س (السقف 10، و8 عند الخطر العالي)" },
    ],
    improve: {
      signs: [{ fr: "Réveil, arrêt des convulsions, ΔNa ≥ +5 mmol/L", ar: "إفاقة، توقف الاختلاجات، ΔNa ≥ +5" }],
      actions: [
        { txt: { fr: "STOPPER la correction rapide — relais étiologique (restriction hydrique si SIADH, sel per os si déplétion)", ar: "أوقف التصحيح السريع — تحويل سببي (تحديد سوائل في SIADH، ملح فموي في النضوب)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Na⁺ qui ne monte pas malgré 3 % (SIADH sévère)", ar: "صوديوم لا يرتفع رغم 3% (SIADH شديد)" }],
      actions: [
        { txt: { fr: "Réévaluer la volémie, associer diurétique de l'anse, avis néphrologie", ar: "أعد تقييم الحجم، أضف مدر عروة، رأي كلى" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Convulsions récidivantes, coma, détresse respiratoire", ar: "اختلاجات ناكسة، غيبوبة، ضائقة تنفسية" }],
      actions: [
        { txt: { fr: "Nouveau bolus 3 % 150 mL/20 min + intubation si nécessaire + réanimation", ar: "دفعة جديدة 150 مل/20 د + تنبيب إن لزم + إنعاش" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "ΔNa > 10 mmol/L/24 h (sur-correction)", ar: "ΔNa > 10/24 س (تصحيح زائد)" }, suspect: { fr: "Myélinolyse — redescendre le Na⁺ (G5 % ± desmopressine)", ar: "انحلال نخاعين — أنزل الصوديوم (G5% ± ديزموبريسين)" }, href: "/protocoles/hyponatremie-severe", label: { fr: "Sur-correction", ar: "تصحيح زائد" } },
      { sign: { fr: "Hypovolémie + hyperkaliémie + hypoglycémie", ar: "نقص حجم + فرط بوتاسيوم + نقص سكر" }, suspect: { fr: "Crise surrénale", ar: "نوبة كظرية" }, href: "/protocoles/crise-surrenale", label: { fr: "Surrénale", ar: "كظر" } },
    ],
  },
  "crise-surrenale": {
    intervalMin: 60,
    criteria: [
      { fr: "PA (objectif PAS > 100), FC, diurèse", ar: "ضغط (هدف انقباضي > 100)، نبض، إدرار" },
      { fr: "Glycémie, Na⁺/K⁺", ar: "سكر، صوديوم/بوتاسيوم" },
      { fr: "Température et foyer infectieux (déclencheur)", ar: "حرارة وبؤرة إنتان (المحرض)" },
    ],
    improve: {
      signs: [{ fr: "Sevrage des vasopresseurs, PA stable, conscience claire", ar: "فطام من المقويات، ضغط مستقر، وعي صافٍ" }],
      actions: [
        { txt: { fr: "Hydrocortisone 50 mg/6 h puis décroissance progressive — ÉDUCATION : jamais d'arrêt brutal, carte d'insuffisant surrénalien", ar: "هيدروكورتيزون 50 ملغ/6 س ثم إنقاص تدريجي — توعية: لا قطع مفاجئ، بطاقة قصور كظري" } },
      ],
    },
    stall: {
      signs: [{ fr: "Choc persistant malgré hydrocortisone + remplissage correct", ar: "صدمة مستمرة رغم الهيدروكورتيزون والتعبئة الصحيحة" }],
      actions: [
        { txt: { fr: "Chercher le sepsis caché (hémocultures, ATB large spectre), évaluer la volémie (écho)", ar: "ابحث عن إنتان خفي (مزارع، مضادات واسعة)، قيّم الحجم (إيكو)" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "Choc réfractaire, troubles de conscience, hypoglycémie récidivante", ar: "صدمة مقاومة، اضطراب وعي، نقص سكر ناكس" }],
      actions: [
        { txt: { fr: "Réanimation : vasopresseurs, G10 % continu, réévaluation de la cause (hémorragie surrénale ?)", ar: "إنعاش: مقويات، G10% مستمر، إعادة تقييم السبب (نزف كظري؟)" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Choc + purpura extensif", ar: "صدمة + فرفرية واسعة" }, suspect: { fr: "Purpura fulminans (méningocoque)", ar: "فرفرية صاعقة (سحائية)" }, href: "/protocoles/choc-septique", label: { fr: "Choc septique", ar: "صدمة إنتانية" } },
    ],
  },
  "crise-thyrotoxique": {
    intervalMin: 60,
    criteria: [
      { fr: "FC (objectif < 90), température", ar: "نبض (الهدف < 90)، حرارة" },
      { fr: "État neurologique : agitation → calme", ar: "الحالة العصبية: هياج → هدوء" },
      { fr: "Tolérance : IC/FA sous contrôle", ar: "التحمل: قصور قلب/رجفان مضبوط" },
    ],
    improve: {
      signs: [{ fr: "Apyrexie, FC < 90, conscience claire à 24-48 h", ar: "انخفاض الحرارة، نبض < 90، وعي صافٍ خلال 24-48 س" }],
      actions: [
        { txt: { fr: "Poursuivre PTU + iode + bêta-bloquant décroissant, relais endocrinologie", ar: "واصل PTU + يود + حاصر بيتا متناقصاً، تحويل غدد صماء" } },
      ],
    },
    stall: {
      signs: [{ fr: "FC et fièvre qui ne cèdent pas à 48 h", ar: "نبض وحمى لا يستجيبان خلال 48 س" }],
      actions: [
        { txt: { fr: "Vérifier les doses/observance (SNG), le déclencheur infectieux, discuter plasmaphérèse avec la réa", ar: "تحقق من الجرع/الالتزام (أنبوب)، المحرض الإنتاني، ناقش فصادة البلازما مع الإنعاش" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "Coma, choc, IC décompensée", ar: "غيبوبة، صدمة، قصور قلب منفك" }],
      actions: [
        { txt: { fr: "Réanimation maximale + hydrocortisone dose crise — mortalité élevée, ne pas retarder la réa", ar: "إنعاش أقصى + هيدروكورتيزون بجرعة نوبة — وفيات عالية، لا تؤخر الإنعاش" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Fièvre + raideur de nuque", ar: "حمى + تصلب رقبة" }, suspect: { fr: "Méningite (déclencheur)", ar: "التهاب سحايا (محرض)" }, href: "/protocoles/choc-septique", label: { fr: "Sepsis", ar: "إنتان" } },
      { sign: { fr: "FA rapide avec IC", ar: "رجفان أذيني سريع مع قصور" }, suspect: { fr: "FA à contrôler", ar: "رجفان يحتاج ضبطاً" }, href: "/protocoles/fa-nouvelle", label: { fr: "FA", ar: "رجفان" } },
    ],
  },
  "torsade-testiculaire": {
    intervalMin: 30,
    criteria: [
      { fr: "Délai depuis le début de la douleur (fenêtre 6 h)", ar: "المدة منذ بدء الألم (نافذة 6 س)" },
      { fr: "Intensité de la douleur, aspect du scrotum", ar: "شدة الألم، مظهر الصفن" },
      { fr: "Chirurgien prévenu + bloc disponible", ar: "الجراح مُبلَّغ + غرفة عمليات جاهزة" },
    ],
    improve: {
      signs: [{ fr: "Détorsion (manuelle ou chirurgicale) : douleur cédant, flux restauré", ar: "فك الالتواء (يدوي أو جراحي): زوال الألم، عودة الجريان" }],
      actions: [
        { txt: { fr: "Orchidopexie controlatérale dans le même temps — surveillance du testicule fixé", ar: "تثبيت الجهة المقابلة بنفس الجلسة — مراقبة الخصية المثبتة" } },
      ],
    },
    stall: {
      signs: [{ fr: "En attente de chirurgien/Doppler — douleur persistante", ar: "بانتظار الجراح/الدوبلر — ألم مستمر" }],
      actions: [
        { txt: { fr: "Relancer, tenter la détorsion manuelle, NE JAMAIS dépasser la fenêtre des 6 h en « attendant »", ar: "أعد النداء، حاول الفك اليدوي، لا تتجاوز نافذة 6 س وأنت تنتظر أبداً" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Testicule qui noircit, douleur paradoxalement calmée (nécrose)", ar: "خصية تسود، ألم يهدأ مفارقاً (نخر)" }],
      actions: [
        { txt: { fr: "Exploration chirurgicale immédiate — la « sédation » de la douleur peut signer la nécrose", ar: "استكشاف جراحي فوري — «هدوء» الألم قد يعني النخر" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Fièvre + début progressif + flux augmenté", ar: "حمى + بدء تدريجي + جريان زائد" }, suspect: { fr: "Épididymo-orchite", ar: "التهاب بربخ وخصية" }, href: "/guidage", label: { fr: "Infection", ar: "إنتان" } },
    ],
  },

  "dissection-aortique": {
    intervalMin: 5,
    criteria: [
      { fr: "PAS et FC (cibles 100-120 / < 60) — brassard aux deux bras", ar: "انقباضي ونبض (الهدف 100-120 / < 60) — مانشيت بالذراعين" },
      { fr: "Douleur (toute reprise = propagation)", ar: "الألم (أي عودة = امتداد)" },
      { fr: "Pouls périphériques, signes neurologiques", ar: "نبض محيطي، علامات عصبية" },
    ],
    improve: {
      signs: [{ fr: "PA/FC aux cibles, douleur contrôlée, angio-TDM faite", ar: "ضغط/نبض بالهدف، ألم مضبوط، التصوير منجز" }],
      actions: [
        { txt: { fr: "Transfert immédiat : type A → chirurgie cardiaque ; type B compliquée → TEVAR ; type B simple → USI médicale", ar: "تحويل فوري: نوع A ⇒ جراحة قلب؛ B معقدة ⇒ TEVAR؛ B بسيطة ⇒ إنعاش طبي" } },
        SAMU,
      ],
    },
    stall: {
      signs: [{ fr: "PA non contrôlable, douleur récidivante malgré traitement maximal", ar: "ضغط غير قابل للضبط، ألم ناكس رغم العلاج الأقصى" }],
      actions: [
        { txt: { fr: "Signe de propagation : chirurgien/vasculaire en urgence absolue, envisager TEVAR/chirurgie sans attendre", ar: "علامة امتداد: الجراح/الأوعية بطوارئ مطلقة، وازن TEVAR/جراحة دون انتظار" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "Choc, tamponnade, AVC, ischémie de membre/viscère", ar: "صدمة، اندحاس، سكتة، نقص تروية طرف/حشاء" }],
      actions: [
        { txt: { fr: "Complication de dissection : bloc opératoire immédiat — chaque minute compte", ar: "اختلاط تسلخ: غرفة عمليات فورية — كل دقيقة محسوبة" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Sus-décalage ST inférieur", ar: "ارتفاع ST سفلي" }, suspect: { fr: "SCA (dissection de la coronaire droite ?) — NE PAS lyser avant angio-TDM", ar: "احتشاء (تسلخ الأيمن؟) — لا تذيب قبل التصوير" }, href: "/protocoles/sca-stemi", label: { fr: "STEMI", ar: "احتشاء" } },
      { sign: { fr: "Déficit neurologique brutal", ar: "عجز عصبي مفاجئ" }, suspect: { fr: "AVC (dissection carotidienne ?)", ar: "سكتة (تسلخ سباتي؟)" }, href: "/protocoles/avc", label: { fr: "AVC", ar: "سكتة" } },
    ],
  },
  "tamponnade": {
    intervalMin: 5,
    criteria: [
      { fr: "PA, FC, signe de Kussmaul, pouls paradoxal", ar: "ضغط، نبض، علامة كوسماول، نبض متناقض" },
      { fr: "Écho de contrôle (collapsus cavités droites)", ar: "إيكو مراقب (انخساف الأجواف اليمنى)" },
      { fr: "Conscience, diurèse", ar: "الوعي، الإدرار" },
    ],
    improve: {
      signs: [{ fr: "PA restaurée après drainage, épanchement résiduel minime", ar: "عودة الضغط بعد التصريف، انصباب باقي بسيط" }],
      actions: [
        { txt: { fr: "Étiologie : cytologie du liquide, bilan TB/néoplasique/urémique — drainage surveillé 24-48 h", ar: "السبب: خلايا السائل، تحري سل/ورم/يوريميا — تصريف مراقب 24-48 س" } },
      ],
    },
    stall: {
      signs: [{ fr: "Choc persistant malgré drainage", ar: "صدمة مستمرة رغم التصريف" }],
      actions: [
        { txt: { fr: "Chercher une constriction, un épannement loculé, une cause associée (EP, choc septique)", ar: "ابحث عن تقبض، انصباب محجوب، سبب مرافق (صمة، صدمة إنتانية)" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "Récidive rapide, arrêt imminent (bradycardie paradoxale)", ar: "نكس سريع، توقف وشيك (بطء مفارق)" }],
      actions: [
        { txt: { fr: "Re-drainage immédiat, fenêtre chirurgicale — réanimation au lit", ar: "إعادة تصريف فورية، نافذة جراحية — إنعاش بجانب السرير" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Plaie précordiale + tamponnade", ar: "جرح أمام القلب + اندحاس" }, suspect: { fr: "Tamponnade traumatique — thoracotomie", ar: "اندحاس رضّي — بضع صدر" }, href: "/protocoles/thorax-penetrant", label: { fr: "Thorax pénétrant", ar: "صدر نافذ" } },
    ],
  },
  "ischemie-mesenterique": {
    intervalMin: 15,
    criteria: [
      { fr: "Douleur abdominale vs examen (la péritonite signe la nécrose)", ar: "الألم مقابل الفحص (البريتوان يعني النخر)" },
      { fr: "Lactate, gazos (tendance, pas valeur isolée)", ar: "لاكتات، غازات (الاتجاه لا القيمة)" },
      { fr: "PA, diurèse, TCA sous héparine", ar: "ضغط، إدرار، TCA تحت الهيبارين" },
    ],
    improve: {
      signs: [{ fr: "Douleur cédant, lactate en baisse, revascularisation faite", ar: "زوال الألم، هبوط اللاكتات، تمت إعادة التروية" }],
      actions: [
        { txt: { fr: "Poursuivre l'anticoagulation, surveillance chirurgicale rapprochée (second look programmé)", ar: "واصل مضاد التخثر، مراقبة جراحية لصيقة (نظرة ثانية مجدولة)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Douleur persistante malgré héparine, angio-TDM en attente", ar: "ألم مستمر رغم الهيبارين، التصوير بالانتظار" }],
      actions: [
        { txt: { fr: "Accélérer l'imagerie et l'avis chirurgical — ne jamais « réévaluer dans 2 h »", ar: "سرّع التصوير والرأي الجراحي — لا «أعد التقييم بعد ساعتين» أبداً" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "Péritonite, lactate qui monte, choc", ar: "التهاب بريتوان، لاكتات يصعد، صدمة" }],
      actions: [
        { txt: { fr: "Laparotomie en urgence + réanimation septique", ar: "فتح بطن طارئ + إنعاش إنتاني" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Perforation d'ulcère connue, pneumopéritoine", ar: "انثقاب قرحة معروف، هواء بالبريتوان" }, suspect: { fr: "Péritonite par perforation", ar: "التهاب بريتوان بانثقاب" }, href: "/protocoles/hemorragie-digestive-haute", label: { fr: "Hémorragie digestive", ar: "نزف هضمي" } },
    ],
  },
  "ischemie-membre-aigu": {
    intervalMin: 15,
    criteria: [
      { fr: "Pouls distaux (Doppler), chaleur, couleur du membre", ar: "نبض قاصي (دوبلر)، حرارة، لون الطرف" },
      { fr: "Sensibilité et motricité (stade Rutherford)", ar: "الحس والحركة (مرحلة رذرفورد)" },
      { fr: "TCA sous héparine, douleur", ar: "TCA تحت الهيبارين، الألم" },
    ],
    improve: {
      signs: [{ fr: "Revascularisation réussie : pouls revenus, membre chaud et rose", ar: "إعادة تروية ناجحة: عودة النبض، طرف دافئ وردي" }],
      actions: [
        { txt: { fr: "SURVEILLER LA REPERFUSION : K⁺, CPK, urines, pressions de loge ×24 h — l'hyperkaliémie tue après la chirurgie", ar: "راقب إعادة التروية: بوتاسيوم، CPK، بول، ضغط الحجرات ×24 س — فرط البوتاسيوم يقتل بعد الجراحة" } },
        { txt: { fr: "Anticoagulation au long cours selon étiologie (FA → AVK/AOD)", ar: "مضاد تخثر طويل حسب السبب (رجفان ⇒ مضاد فيتامين K/AOD)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Pas d'amélioration malgré héparine, chirurgien en route", ar: "لا تحسن رغم الهيبارين، الجراح بالطريق" }],
      actions: [
        { txt: { fr: "Maintenir l'anticoagulation, membre à plat, antalgie — ne jamais surélever ni chauffer", ar: "حافظ على مضاد التخثر، الطرف مستوٍ، تسكين — لا ترفع ولا تدفئ أبداً" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "Paralysie + anesthésie installées (stade III), marbrures fixées", ar: "شلل + فقد حس قائم (المرحلة III)، تبرقش ثابت" }],
      actions: [
        { txt: { fr: "Membre mort : amputation — la reperfusion serait létale (K⁺, myoglobine, acidose)", ar: "طرف ميت: بتر — إعادة التروية ستكون قاتلة (بوتاسيوم، ميوغلوبين، حماض)" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Hyperkaliémie de reperfusion (ondes T pointues)", ar: "فرط بوتاسيوم إعادة التروية (T مدببة)" }, suspect: { fr: "Hyperkaliémie — protocole dédié", ar: "فرط بوتاسيوم — بروتوكول خاص" }, href: "/protocoles/hyperkaliemie", label: { fr: "Hyperkaliémie", ar: "فرط بوتاسيوم" } },
    ],
  },
  "meningite-bacterienne": {
    intervalMin: 60,
    criteria: [
      { fr: "Conscience (GCS), fièvre, raideur de nuque", ar: "الوعي (GCS)، حمى، تصلب رقبة" },
      { fr: "PA, signes de choc, extension du purpura", ar: "ضغط، علامات صدمة، امتداد الفرفرية" },
      { fr: "Convulsions, signes de localisation", ar: "اختلاجات، علامات بؤرية" },
    ],
    improve: {
      signs: [{ fr: "Apyrexie progressive, conscience claire à 48-72 h", ar: "انخفاض حرارة تدريجي، وعي صافٍ 48-72 س" }],
      actions: [
        { txt: { fr: "Adapter l'ATB à la culture, durée selon germe (méningocoque 7 j, pneumocoque 10-14 j), audiogramme de contrôle", ar: "كيّف المضاد حسب المزرعة، المدة حسب الجرثوم (سحائية 7 أيام، مكورات رئوية 10-14)، تخطيط سمع مراقب" } },
        { txt: { fr: "Signalement obligatoire + chimioprophylaxie des contacts (méningocoque)", ar: "تبليغ إجباري + وقاية كيميائية للمخالطين (سحائية)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Fièvre persistante à 48 h, conscience qui stagne", ar: "حمى مستمرة بـ 48 س، وعي راكد" }],
      actions: [
        { txt: { fr: "Imagerie de contrôle (empyème, abcès, hydrocéphalie), PL de contrôle si doute d'échec, réévaluer l'ATB (résistance ?)", ar: "تصوير مراقب (دبيلة، خراج، استسقاء)، بزل مراقب عند الشك بالفشل، أعد تقييم المضاد (مقاومة؟)" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Coma, convulsions répétées, choc septique", ar: "غيبوبة، اختلاجات متكررة، صدمة إنتانية" }],
      actions: [
        { txt: { fr: "Réanimation : intubation si GCS ≤ 8, contrôle des convulsions, vasopresseurs — pronostic sombre", ar: "إنعاش: تنبيب إذا GCS ≤ 8، ضبط الاختلاجات، مقويات أوعية — إنذار قاتم" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Choc + purpura extensif", ar: "صدمة + فرفرية واسعة" }, suspect: { fr: "Purpura fulminans", ar: "فرفرية صاعقة" }, href: "/protocoles/choc-septique", label: { fr: "Choc septique", ar: "صدمة إنتانية" } },
      { sign: { fr: "Crise convulsive prolongée", ar: "نوبة اختلاج مطولة" }, suspect: { fr: "État de mal épileptique", ar: "حالة صرعية" }, href: "/protocoles/etat-mal-epileptique", label: { fr: "État de mal", ar: "حالة صرعية" } },
    ],
  },
  "pneumonie-aigue": {
    intervalMin: 240,
    criteria: [
      { fr: "SpO₂, FR, FC, température, PA (CURB-65 dynamique)", ar: "‏SpO₂، تنفس، نبض، حرارة، ضغط (CURB-65 ديناميكي)" },
      { fr: "Tolérance clinique : conscience, hydratation", ar: "التحمل السريري: وعي، إماهة" },
      { fr: "Efficacité de l'antibiotique à 48-72 h", ar: "فعالية المضاد 48-72 س" },
    ],
    improve: {
      signs: [{ fr: "Apyrexie à 48-72 h, SpO₂ stable à l'air, FR < 24", ar: "انخفاض حرارة 48-72 س، ‏SpO₂ مستقر بالهواء، تنفس < 24" }],
      actions: [
        { txt: { fr: "Relais PO possible si apyrétique 48 h + stabilité hémodynamique ; vaccination antipneumococcique/grippale avant sortie", ar: "تحويل فموي إذا بلا حمى 48 س + استقرار دوراني؛ لقاح مكورات/كريب قبل الخروج" } },
      ],
    },
    stall: {
      signs: [{ fr: "Fièvre persistante à J3, SpO₂ qui ne remonte pas", ar: "حمى مستمرة باليوم 3، ‏SpO₂ لا يرتفع" }],
      actions: [
        { txt: { fr: "Radio/écho de contrôle : épanchement parapneumonique (pH < 7,2 = drainage), abcès, germe résistant, diagnostic alternatif (EP, cancer)", ar: "صورة/إيكو مراقب: انصباب مجاور (pH < 7.2 = تصريف)، خراج، جرثوم مقاوم، تشخيص بديل (صمة، سرطان)" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Détresse respiratoire, choc, confusion", ar: "ضائقة تنفسية، صدمة، تخليط" }],
      actions: [
        { txt: { fr: "Pneumonie grave → réanimation, VNI/intubation, élargir l'ATB, chercher l'empyème", ar: "التهاب رئة خطير ⇒ إنعاش، تهوية غير باضعة/تنبيب، وسّع المضاد، ابحث عن الدبيلة" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Choc septique installé", ar: "صدمة إنتانية قائمة" }, suspect: { fr: "Sepsis grave", ar: "إنتان شديد" }, href: "/protocoles/choc-septique", label: { fr: "Choc septique", ar: "صدمة إنتانية" } },
      { sign: { fr: "Début brutal + hémoptysie + douleur pleurale", ar: "بدء مفاجئ + نفث دم + ألم جنبي" }, suspect: { fr: "Embolie pulmonaire (mimique)", ar: "صمة رئوية (تقليد)" }, href: "/protocoles/embolie-pulmonaire", label: { fr: "EP", ar: "صمة" } },
    ],
  },
  "bronchiolite": {
    intervalMin: 120,
    criteria: [
      { fr: "SpO₂ (objectif > 92-94 %), FR, tirage", ar: "‏SpO₂ (الهدف > 92-94%)، تنفس، سحب" },
      { fr: "Prises alimentaires (% du biberon habituel), nombre de couches", ar: "الرضعات (% من المعتاد)، عدد الحفاظات" },
      { fr: "Apnées (surtout < 2 mois), épuisement", ar: "توقفات النفس (خصوصاً < شهرين)، إنهاك" },
    ],
    improve: {
      signs: [{ fr: "SpO₂ stable sans O₂, alimentation > 50 %, tirage cédant", ar: "‏SpO₂ مستقر بلا أكسجين، تغذية > 50%، تراجع السحب" }],
      actions: [
        { txt: { fr: "Sortie possible si : > 3 mois, parents fiables, suivi à 24-48 h garanti, consignes écrites (aggravation J3-J5 possible)", ar: "خروج ممكن إذا: > 3 أشهر، أهل موثوقون، متابعة 24-48 س مضمونة، تعليمات مكتوبة (تدهور ي3-ي5 ممكن)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Besoin d'O₂ persistant au-delà de 48-72 h", ar: "حاجة أكسجين مستمرة بعد 48-72 س" }],
      actions: [
        { txt: { fr: "Chercher la complication : atélectasie, surinfection, cardiopathie méconnue — radio + avis spécialisé", ar: "ابحث عن الاختلاط: انخماص، إنتان إضافي، مرض قلب خفي — صورة + رأي مختص" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Geignement, pauses, SpO₂ < 90 % malgré O₂, épuisement", ar: "أنين، توقفات، ‏SpO₂ < 90% رغم الأكسجين، إنهاك" }],
      actions: [
        { txt: { fr: "CPAP puis intubation — réanimation pédiatrique, transfert unité spécialisée", ar: "‏CPAP ثم تنبيب — إنعاش أطفال، تحويل وحدة مختصة" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Perte > 5 % du poids, fontanelle creusée", ar: "فقد > 5% من الوزن، يافوخ غائر" }, suspect: { fr: "Déshydratation", ar: "تجفاف" }, href: "/protocoles/deshydratation-enfant", label: { fr: "Déshydratation", ar: "تجفاف" } },
    ],
  },
  "laryngite-croup": {
    intervalMin: 60,
    criteria: [
      { fr: "Stridor : au repos ou seulement à l'agitation ?", ar: "الصرير: بالراحة أم عند الانفعال فقط؟" },
      { fr: "Tirage, SpO₂, score de Westley dynamique", ar: "السحب، ‏SpO₂، سكور ويستلي ديناميكي" },
      { fr: "Délai depuis l'adrénaline nébulisée (rebond à 2 h)", ar: "المدة منذ الأدرينالين الرذاذي (ارتداد بساعتين)" },
    ],
    improve: {
      signs: [{ fr: "Stridor disparu au repos, enfant calme, alimentation possible", ar: "زوال الصرير بالراحة، طفل هادئ، تغذية ممكنة" }],
      actions: [
        { txt: { fr: "Observation MINIMUM 2-4 h après adrénaline nébulisée avant tout retour à domicile", ar: "مراقبة 2-4 س على الأقل بعد الأدرينالين الرذاذي قبل أي خروج" } },
      ],
    },
    stall: {
      signs: [{ fr: "Stridor au repos persistant après 2 nébulisations", ar: "صرير راحة مستمر بعد رذاذين" }],
      actions: [
        { txt: { fr: "Hospitalisation en surveillance continue, rediscuter le diagnostic (épiglottite ? corps étranger ?)", ar: "إدخال بمراقبة مستمرة، أعد التشخيص (لسان المزمار؟ جسم غريب؟)" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Cyanose, épuisement, stridor qui DISPARAÎT avec silence respiratoire (pré-arrêt)", ar: "زرقة، إنهاك، صرير يختفي مع صمت تنفسي (قبل التوقف)" }],
      actions: [
        { txt: { fr: "URGENCE ABSOLUE : intubation par le plus expérimenté (sonde - ½ taille), adrénaline nébulisée en attendant", ar: "طوارئ مطلقة: تنبيب بيد الأكثر خبرة (أنبوب − ½ مقاس)، أدرينالين رذاذي ريثما" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Enfant toxique, bavant, position trépied, non vacciné Hib", ar: "طفل منهك، يسيل لعابه، وضعية الأثافي، غير ملقح Hib" }, suspect: { fr: "Épiglottite — ne pas examiner la gorge", ar: "التهاب لسان المزمار — لا تفحص الحلق" }, href: "/protocoles/acr-pediatrique", label: { fr: "Urgence aérienne", ar: "طارئ مجرى هوائي" } },
    ],
  },
  "corps-etranger-aerien": {
    intervalMin: 30,
    criteria: [
      { fr: "Efficacité de la toux et de la voix (obstruction partielle vs complète)", ar: "فعالية السعال والصوت (جزئي مقابل كامل)" },
      { fr: "SpO₂, couleur, conscience", ar: "‏SpO₂، اللون، الوعي" },
      { fr: "Après expulsion : respiration, auscultation (sifflement unilatéral ?)", ar: "بعد الخروج: التنفس، السماع (أزيز وحيد الجانب؟)" },
    ],
    improve: {
      signs: [{ fr: "CE expulsé, toux résiduelle simple, SpO₂ normale", ar: "خرج الجسم، سعال باقٍ بسيط، ‏SpO₂ طبيعي" }],
      actions: [
        { txt: { fr: "Examen médical + radio systématiques (fragment résiduel, lésion des manœuvres) — ne jamais renvoyer sans évaluation", ar: "فحص طبي + صورة منهجيان (شظية باقية، إصابة من المناورات) — لا إخراج دون تقييم" } },
      ],
    },
    stall: {
      signs: [{ fr: "Toux/sifflement unilatéral persistants après expulsion", ar: "سعال/أزيز وحيد الجانب مستمر بعد الخروج" }],
      actions: [
        { txt: { fr: "Deuxième CE ou fragment : avis ORL/pneumo-pédiatrie, bronchoscopie", ar: "جسم ثانٍ أو شظية: رأي أذن/صدر أطفال، تنظير قصبات" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Obstruction complète : plus de toux, cyanose, conscience qui baisse", ar: "انسداد كامل: لا سعال، زرقة، وعي يهبط" }],
      actions: [
        { txt: { fr: "5 claques + 5 compressions immédiatement ; inconscience → RCP en vérifiant la bouche avant chaque insufflation", ar: "‏5 ضربات + 5 ضغطات فوراً؛ فقد الوعي ⇒ إنعاش مع فحص الفم قبل كل نفخة" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Douleur abdominale après Heimlich", ar: "ألم بطن بعد هايمليك" }, suspect: { fr: "Lésion viscérale des manœuvres", ar: "إصابة حشوية من المناورات" }, href: "/protocoles/polytraumatisme", label: { fr: "Trauma abdominal", ar: "رض بطني" } },
    ],
  },
  "drepanocytose-crise": {
    intervalMin: 60,
    criteria: [
      { fr: "EVA douleur avant/après chaque bolus de morphine", ar: "مقياس الألم قبل/بعد كل دفعة مورفين" },
      { fr: "SpO₂, FR, auscultation (syndrome thoracique)", ar: "‏SpO₂، تنفس، سمع (متلازمة صدرية)" },
      { fr: "Hémoglobine vs taux de base, réticulocytes, diurèse", ar: "الخضاب مقابل الأساس، شبكيات، إدرار" },
    ],
    improve: {
      signs: [{ fr: "EVA ≤ 3 avec morphine espacée, hydratation reprise, apyrexie", ar: "ألم ≤ 3 مع مورفين متباعد، استئناف الإماهة، بلا حمى" }],
      actions: [
        { txt: { fr: "Relais antalgique PO, reprise alimentaire, éducation (éviter froid/déshydratation), vérifier la vaccination antipneumococcique", ar: "تحويل تسكيني فموي، استئناف التغذية، توعية (تجنب البرد/التجفاف)، تحقق من لقاح المكورات" } },
      ],
    },
    stall: {
      signs: [{ fr: "Douleur non contrôlée à 1-2 h de titration correcte", ar: "ألم غير مضبوط بعد 1-2 س من المعايرة الصحيحة" }],
      actions: [
        { txt: { fr: "PCA morphine + hospitalisation ; réévaluer : ostéomyélite, séquestration, cause chirurgicale", ar: "مضخة مورفين + إدخال؛ أعد التقييم: التهاب عظم، احتباس، سبب جراحي" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Fièvre + thorax + hypoxie (STA), pâleur brutale + rate grosse (séquestration), Hb qui chute > 2 g/dL", ar: "حمى + صدر + نقص أكسجة (المتلازمة الصدرية)، شحوب مفاجئ + طحال ضخم (احتباس)، هبوط الخضاب > 2 غ/دل" }],
      actions: [
        { txt: { fr: "Syndrome thoracique aigu : O₂ + ceftriaxone/macrolide + transfusion ± exsanguino-transfusion — première cause de mort, réanimation", ar: "متلازمة صدرية حادة: أكسجين + سيفترياكسون/ماكروليد + نقل ± استبدال دم — أول سبب وفاة، إنعاش" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Fièvre isolée chez un drépanocytaire asplénique", ar: "حمى معزولة عند منجلي معطل الطحال" }, suspect: { fr: "Sepsis à encapsulés — ATB dans l'heure", ar: "إنتان بمجرثومات مغلفة — مضاد خلال ساعة" }, href: "/protocoles/choc-septique", label: { fr: "Choc septique", ar: "صدمة إنتانية" } },
    ],
  },

  "ingestion-caustique": {
    intervalMin: 60,
    criteria: [
      { fr: "Voies aériennes : stridor, voix, dyspnée (l'œdème laryngé évolue en heures)", ar: "المجرى الهوائي: صرير، صوت، ضيق نفس (الوذمة الحنجرية تتطور بالساعات)" },
      { fr: "Capacité à avaler sa salive (sialorrhée = œsophage lésé)", ar: "القدرة على بلع اللعاب (السيلان = مريء مصاب)" },
      { fr: "Douleur thoracique/abdominale, vomissements, fièvre (perforation)", ar: "ألم صدر/بطن، تقيؤ، حمى (انثقاب)" },
    ],
    improve: {
      signs: [{ fr: "Apyrexie, alimentation tolérée, endoscopie grade I-IIa", ar: "بلا حمى، تغذية محتملة، تنظير درجة I-IIa" }],
      actions: [
        { txt: { fr: "Reprise alimentaire progressive, sortie avec consignes (dysphagie secondaire = reconsulter : sténose cicatricielle à distance)", ar: "استئناف تغذية تدريجي، خروج مع تعليمات (عسر بلع لاحق = إعادة استشارة: تضيق ندبي متأخر)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Sialorrhée persistante, refus alimentaire à 12-24 h", ar: "سيلان لعاب مستمر، رفض الطعام 12-24 س" }],
      actions: [
        { txt: { fr: "Endoscopie à 12-48 h (ni avant ni après la fenêtre), nutrition entérale par sonde posée sous contrôle endoscopique", ar: "تنظير 12-48 س (لا قبل ولا بعد النافذة)، تغذية معوية بأنبوب يوضع تحت رؤية تنظيرية" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Stridor, détresse respiratoire, douleur abdominale + défense, sepsis", ar: "صرير، ضائقة تنفسية، ألم بطن + دفاع، إنتان" }],
      actions: [
        { txt: { fr: "Intubation précoce si atteinte laryngée ; TDM + chirurgie si perforation — la nécrose transmurale tue en heures", ar: "تنبيب مبكر عند إصابة الحنجرة؛ طبقي + جراحة عند الانثقاب — النخر الكامل يقتل بالساعات" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Pneumomédiastin ou épanchement pleural unilatéral", ar: "هواء منصف أو انصباب جنبي وحيد الجانب" }, suspect: { fr: "Perforation œsophagienne", ar: "انثقاب مريئي" }, href: "/protocoles/thorax-penetrant", label: { fr: "Chirurgie thoracique", ar: "جراحة صدرية" } },
    ],
  },
  "pile-bouton": {
    intervalMin: 30,
    criteria: [
      { fr: "Localisation de la pile (radio) : œsophage = urgence absolue", ar: "موقع البطارية (صورة): المريء = طوارئ مطلقة" },
      { fr: "Salivation, douleur thoracique, refus alimentaire, vomissements", ar: "سيلان لعاب، ألم صدر، رفض طعام، تقيؤ" },
      { fr: "Après extraction : fièvre, saignement, dysphagie (fistule tardive)", ar: "بعد النزع: حمى، نزف، عسر بلع (ناسور متأخر)" },
    ],
    improve: {
      signs: [{ fr: "Pile extraite, asymptomatique, contrôle endoscopique rassurant", ar: "استخرجت البطارية، بلا أعراض، تنظير مراقب مطمئن" }],
      actions: [
        { txt: { fr: "Surveillance 24 h si extraction œsophagienne, sortie avec consignes de reconsultation jusqu'à J28 (fistule tardive)", ar: "مراقبة 24 س إذا النزع مريئي، خروج مع تعليمات إعادة الاستشارة حتى اليوم 28 (ناسور متأخر)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Pile gastrique non éliminée à 10-14 jours", ar: "بطارية معدية لم تخرج بـ 10-14 يوماً" }],
      actions: [
        { txt: { fr: "Radio de contrôle + retrait endoscopique si toujours présente", ar: "صورة مراقبة + نزع تنظيري إذا ما زالت موجودة" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Hématémèse, méléna, douleur thoracique majeure après extraction", ar: "تقيؤ دم، زفت، ألم صدر شديد بعد النزع" }],
      actions: [
        { txt: { fr: "Fistule aorto-œsophagienne : angio-TDM en urgence absolue + chirurgie vasculaire — ne jamais renvoyer à domicile", ar: "ناسور أبهر-مريئي: طبقي وعائي بطوارئ مطلقة + جراحة أوعية — لا إرسال للمنزل أبداً" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Ingestion inconnue chez nourrisson qui bave", ar: "ابتلاع مجهول عند رضيع يسيل لعابه" }, suspect: { fr: "Corps étranger digestif/œsophagien", ar: "جسم غريب هضمي/مريئي" }, href: "/protocoles/corps-etranger-aerien", label: { fr: "Corps étranger", ar: "جسم غريب" } },
    ],
  },
  "geu": {
    intervalMin: 15,
    criteria: [
      { fr: "Hémodynamique : PA, FC, pâleur, douleur abdominale (rupture imminente)", ar: "الدوران: ضغط، نبض، شحوب، ألم بطن (تمزق وشيك)" },
      { fr: "β-hCG dynamique à 48 h si doute diagnostique", ar: "هرمون الحمل الديناميكي بـ 48 س عند الشك" },
      { fr: "Sous méthotrexate : douleur, tolérance, β-hCG J4-J7", ar: "تحت ميثوتريكسات: الألم، التحمل، الهرمون باليوم 4-7" },
    ],
    improve: {
      signs: [{ fr: "Opérée : hémodynamique stable, Hb stable, reprise du transit", ar: "بعد الجراحة: دوران مستقر، خضاب ثابت، عودة العبور" }],
      actions: [
        { txt: { fr: "Anti-D si rhésus négatif, contraception conseillée 3 mois, β-hCG de négativation si traitement conservateur", ar: "مضاد D إذا الزمرة سالبة، منع حمل 3 أشهر، هرمون التصفير بعد العلاج المحافظ" } },
      ],
    },
    stall: {
      signs: [{ fr: "β-hCG en plateau, écho douteuse persistante", ar: "هرمون ثابت، إيكو مشكوكة مستمرة" }],
      actions: [
        { txt: { fr: "Grossesse de localisation indéterminée : suivi β-hCG/48 h + écho répétée — ni sortie définitive ni laparotomie prématurée", ar: "حمل مجهول الموقع: متابعة هرمون/48 س + إيكو معادة — لا خروج نهائي ولا فتح بطن متسرع" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Douleur brutale + choc : rupture tubaire", ar: "ألم مفاجئ + صدمة: تمزق البوق" }],
      actions: [
        { txt: { fr: "Bloc immédiat + transfusion massive — la GEU rompue tue en minutes si on attend", ar: "صالة عمليات فورية + نقل كثيف — الحمل المتمزق يقتل بالدقائق إذا انتظرنا" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "β-hCG positif + utérus vide + choc", ar: "هرمون إيجابي + رحم فارغ + صدمة" }, suspect: { fr: "GEU rompue — chirurgie", ar: "حمل خارجي متمزق — جراحة" }, href: "/protocoles/hemorragie-post-partum", label: { fr: "Choc hémorragique", ar: "صدمة نزفية" } },
    ],
  },
  "dystocie-epaules": {
    intervalMin: 1,
    criteria: [
      { fr: "TEMPS ÉCOULÉ depuis l'impact (paralysie cérébrale au-delà de 5 min)", ar: "الوقت المنقضي منذ الانحشار (شلل دماغي بعد 5 د)" },
      { fr: "Efficacité de chaque manœuvre (annoncer à voix haute)", ar: "فعالية كل مناورة (أعلن بصوت عالٍ)" },
      { fr: "État néonatal à la naissance : tonus, respiration, membres supérieurs", ar: "حالة المولود: المقوية، التنفس، الطرفان العلويان" },
    ],
    improve: {
      signs: [{ fr: "Épaules dégagées, nouveau-né criant et rose", ar: "تحررت الكتفان، مولود يصرخ وردي" }],
      actions: [
        { txt: { fr: "Examen des plexus brachiaux et clavicules, gazométrie au cordon, oxytocine (hémorragie du post-partum fréquente), consigner TOUTES les manœuvres et horaires", ar: "فحص الضفائر العضدية والترقوتين، غازات الحبل، أوكسيتوسين (نزف النفاس شائع)، دوّن كل المناورات والأوقات" } },
      ],
    },
    stall: {
      signs: [{ fr: "Échec de McRoberts + pression sus-pubienne à 2 min", ar: "فشل ماك روبرتس + الضغط بدقيقتين" }],
      actions: [
        { txt: { fr: "Manœuvres internes immédiatement : Rubin II → Wood → Jacquemier (bras postérieur) — jamais de traction céphalique", ar: "المناورات الداخلية فوراً: روبين II ← وود ← جاكمييه (الذراع الخلفية) — أبداً شد الرأس" } },
      ],
    },
    worsen: {
      signs: [{ fr: "5 minutes écoulées, rythme cardiaque fœtal qui se dégrade", ar: "مضت 5 دقائق، نبض الجنين يتدهور" }],
      actions: [
        { txt: { fr: "Gaskin (quatre pattes), Zavanelli en dernier recours avec césarienne immédiate — équipe néonat prête à réanimer", ar: "غاسكين (الأربع)، زافانيلي كحل أخير مع قيصرية فورية — فريق حديثي الولادة جاهز للإنعاش" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Nouveau-né en détresse à la naissance", ar: "مولود بضائقة عند الولادة" }, suspect: { fr: "Réanimation néonatale", ar: "إنعاش حديثي الولادة" }, href: "/protocoles/acr-pediatrique", label: { fr: "RAN", ar: "إنعاش المولود" } },
    ],
  },
  "fasciite-necrosante": {
    intervalMin: 30,
    criteria: [
      { fr: "Extension des lésions cutanées (marquer les limites au feutre)", ar: "امتداد الآفات الجلدية (حدد الحدود بقلم)" },
      { fr: "Douleur vs signes cutanés, crépitant, fièvre, PA", ar: "الألم مقابل الآفات، فرقعة، حمى، ضغط" },
      { fr: "Lactate, diurèse, conscience (réanimation)", ar: "لاكتات، إدرار، وعي (إنعاش)" },
    ],
    improve: {
      signs: [{ fr: "Post-débridage : apyrexie, lactate en baisse, limites stables", ar: "بعد التنضير: بلا حمى، هبوط اللاكتات، حدود ثابتة" }],
      actions: [
        { txt: { fr: "Antibiothérapie adaptée aux prélèvements per-op, second look chirurgical à 24-48 h OBLIGATOIRE, VAC si indiqué", ar: "مضادات مكيفة حسب عينات الجراحة، نظرة ثانية جراحية 24-48 س إلزامياً، علاج بالضغط السالب عند الاستطباب" } },
      ],
    },
    stall: {
      signs: [{ fr: "Fièvre/lactate persistants après débridage", ar: "حمى/لاكتات مستمران بعد التنضير" }],
      actions: [
        { txt: { fr: "Re-débridage — la source non contrôlée entretient le choc ; élargir l'antibiothérapie, contrôler le diabète", ar: "تنضير معاد — البؤرة غير المضبوطة تغذي الصدمة؛ وسّع المضادات، اضبط السكري" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "Choc réfractaire, extension rapide malgré débridage", ar: "صدمة مقاومة، امتداد سريع رغم التنضير" }],
      actions: [
        { txt: { fr: "Réanimation maximale + reprise chirurgicale immédiate ; discuter immunoglobulines IV (choc toxique streptococcique)", ar: "إنعاش أقصى + عودة جراحية فورية؛ ناقش الغلوبولينات المناعية الوريدية (صدمة سمية عقدية)" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Choc septique réfractaire au remplissage", ar: "صدمة إنتانية مقاومة للتعبئة" }, suspect: { fr: "Sepsis grave", ar: "إنتان شديد" }, href: "/protocoles/choc-septique", label: { fr: "Choc septique", ar: "صدمة إنتانية" } },
    ],
  },
  "hemorragie-sous-arachnoidienne": {
    intervalMin: 60,
    criteria: [
      { fr: "GCS, pupilles, déficit focal (re-rupture, hydrocéphalie)", ar: "‏GCS، حدقتان، عجز بؤري (إعادة تمزق، استسقاء)" },
      { fr: "PA contrôlée (PAS < 160 avant sécurisation de l'anévrisme)", ar: "ضغط مضبوط (انقباضي < 160 قبل تأمين أم الدم)" },
      { fr: "J4-J14 : tout changement = vasospasme jusqu'à preuve du contraire", ar: "ي4-ي14: أي تغير = تشنج أوعية حتى يثبت العكس" },
    ],
    improve: {
      signs: [{ fr: "Anévrisme sécurisé (clip/coil), neurologie stable, nimodipine tolérée", ar: "أم الدم مؤمّنة (قص/لف)، الأعصاب مستقرة، نيموديبين محتمل" }],
      actions: [
        { txt: { fr: "Poursuivre nimodipine 21 jours, euvolémie stricte, lever précoce, rééducation", ar: "واصل النيموديبين 21 يوماً، حجم طبيعي صارم، نهوض مبكر، إعادة تأهيل" } },
      ],
    },
    stall: {
      signs: [{ fr: "Confusion persistante, hydrocéphalie subaiguë", ar: "تخليط مستمر، استسقاء تحت حاد" }],
      actions: [
        { txt: { fr: "TDM de contrôle : dérivation ventriculaire externe si hydrocéphalie ; bilan de vasospasme (doppler transcrânien)", ar: "طبقي مراقب: تحويلة بطينية خارجية عند الاستسقاء؛ تقييم تشنج الأوعية (دوبلر عبر القحف)" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Chute brutale du GCS, mydriase, arrêt respiratoire (re-rupture)", ar: "هبوط مفاجئ للوعي، توسع حدقة، توقف تنفس (إعادة تمزق)" }],
      actions: [
        { txt: { fr: "Intubation + ventilation, dérivation en urgence, retour au bloc/angio — la re-rupture est mortelle dans 70 % des cas", ar: "تنبيب + تهوية، تحويلة عاجلة، عودة للصالة/القسطرة — إعادة التمزق مميتة في 70%" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "GCS < 8 ou signes d'engagement", ar: "‏GCS < 8 أو علامات انفتاق" }, suspect: { fr: "Coma — protection des voies aériennes", ar: "غيبوبة — حماية المجرى الهوائي" }, href: "/protocoles/traumatisme-cranien", label: { fr: "PIC élevée", ar: "ضغط قحفي مرتفع" } },
    ],
  },
  "fievre-neutropenique": {
    intervalMin: 60,
    criteria: [
      { fr: "Température, hémodynamique, conscience (évolution vers le choc)", ar: "الحرارة، الدوران، الوعي (التطور نحو الصدمة)" },
      { fr: "Nouveaux foyers : bouche, péri-anal, cathéter, peau", ar: "بؤر جديدة: الفم، حول الشرج، القثطرة، الجلد" },
      { fr: "PNN (remontée = tournant favorable), lactate", ar: "المحببات (الارتفاع = نقطة تحول إيجابية)، لاكتات" },
    ],
    improve: {
      signs: [{ fr: "Apyrexie 48 h + remontée des PNN > 500/mm³", ar: "بلا حمى 48 س + ارتفاع المحببات > 500" }],
      actions: [
        { txt: { fr: "Désescalade ATB selon cultures, sortie possible si PNN > 500 et MASCC ≥ 21, consignes de reconsultation immédiate à la prochaine fièvre", ar: "تضييق المضاد حسب المزارع، خروج ممكن إذا المحببات > 500 وMASCC ≥ 21، تعليمات استشارة فورية عند الحمى القادمة" } },
      ],
    },
    stall: {
      signs: [{ fr: "Fièvre persistante à J4-J7 malgré ATB correcte", ar: "حمى مستمرة باليوم 4-7 رغم مضاد صحيح" }],
      actions: [
        { txt: { fr: "TDM thoracique (aspergillose), antifongique empirique, recontrôle des foyers/cathéter, G-CSF à discuter", ar: "طبقي صدري (رشاشيات)، مضاد فطري تجريبي، إعادة فحص البؤر/القثطرة، ناقش عوامل النمو" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Choc septique, SDRA, confusion", ar: "صدمة إنتانية، ضائقة تنفسية، تخليط" }],
      actions: [
        { txt: { fr: "Réanimation septique maximale : double couverture Pseudomonas, noradrénaline, réanimation spécialisée", ar: "إنعاش إنتاني أقصى: تغطية مزدوجة للزائفة، نورأدرينالين، إنعاش مختص" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Hypotension + lactate élevé", ar: "هبوط ضغط + لاكتات مرتفع" }, suspect: { fr: "Choc septique", ar: "صدمة إنتانية" }, href: "/protocoles/choc-septique", label: { fr: "Choc septique", ar: "صدمة إنتانية" } },
    ],
  },
  "serotoninergique-snm": {
    intervalMin: 30,
    criteria: [
      { fr: "Température (objectif < 38,5 °C), rigidité, myoclonies", ar: "الحرارة (الهدف < 38.5)، التيبس، الرمع" },
      { fr: "Conscience, dysautonomie (PA, FC)", ar: "الوعي، الخلل الذاتي (ضغط، نبض)" },
      { fr: "CPK, créatinine, diurèse, K⁺ (rhabdomyolyse)", ar: "‏CPK، كرياتينين، إدرار، بوتاسيوم (انسحاق عضلي)" },
    ],
    improve: {
      signs: [{ fr: "Apyrexie, rigidité cédante, CPK en baisse, sevrage du médicament en cause effectif", ar: "بلا حمى، تراجع التيبس، هبوط CPK، إيقاف الدواء المسبب نافذ" }],
      actions: [
        { txt: { fr: "Contre-indication à vie documentée, déclaration de pharmacovigilance, plan de reprise psychotrope avec le psychiatre", ar: "مضاد استطباب مدى الحياة موثق، تبليغ دوائي، خطة استئناف الأدوية النفسية مع الطبيب النفسي" } },
      ],
    },
    stall: {
      signs: [{ fr: "Hyperthermie persistante malgré benzodiazépines et refroidissement", ar: "فرط حرارة مستمر رغم البنزوديازيبين والتبريد" }],
      actions: [
        { txt: { fr: "Dantrolène (SNM) ± bromocriptine ; vérifier qu'aucun agent en cause n'a été réintroduit (y compris tramadol en antalgie !)", ar: "دانترولين (الخبيثة) ± بروموكريبتين؛ تأكد أن أي مسبب لم يعد (بما فيه الترامادول للتسكين!)" } },
      ],
    },
    worsen: {
      signs: [{ fr: "T° > 41 °C, rigidité majeure, CPK explosive, insuffisance rénale", ar: "حرارة > 41، تيبس شديد، ‏CPK منفجرة، قصور كلوي" }],
      actions: [
        { txt: { fr: "Intubation + curarisation (supprime la thermogenèse), refroidissement immédiat, protection rénale — réanimation", ar: "تنبيب + شلل عضلي (يوقف إنتاج الحرارة)، تبريد فوري، حماية كلوية — إنعاش" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "CPK > 20 000 ou urines porto", ar: "‏CPK > 20000 أو بول بلون الميناء" }, suspect: { fr: "Rhabdomyolyse", ar: "انسحاق عضلي" }, href: "/protocoles/rhabdomyolyse", label: { fr: "Rhabdomyolyse", ar: "انسحاق عضلي" } },
    ],
  },
  "glaucome-aigu": {
    intervalMin: 30,
    criteria: [
      { fr: "PIO toutes les 30-60 min jusqu'à < 25-30 mmHg", ar: "ضغط العين كل 30-60 د حتى < 25-30 ملم ز" },
      { fr: "Douleur, nausées, acuité visuelle, état de la cornée", ar: "الألم، الغثيان، حدة البصر، حالة القرنية" },
      { fr: "Tolérance du traitement (hypoTA sous acétazolamide + mannitol)", ar: "تحمل العلاج (هبوط الضغط الجهازي تحت أسيتازولاميد + مانيتول)" },
    ],
    improve: {
      signs: [{ fr: "PIO < 30 mmHg, douleur cédante, cornée qui s'éclaircit", ar: "ضغط العين < 30، تراجع الألم، قرنية تصفو" }],
      actions: [
        { txt: { fr: "Iridotomie périphérique au laser programmée SANS délai + œil controlatéral (angle étroit dans la majorité des cas)", ar: "بضع قزحية محيطي بالليزر مجدول دون تأخير + العين الأخرى (الزاوية ضيقة في أغلب الحالات)" } },
      ],
    },
    stall: {
      signs: [{ fr: "PIO > 40 malgré acétazolamide + collyres à 2 h", ar: "ضغط العين > 40 رغم أسيتازولاميد + قطرات بساعتين" }],
      actions: [
        { txt: { fr: "Mannitol 20 % 1-2 g/kg IV ; avis ophtalmo pour paracentèse de chambre antérieure", ar: "مانيتول 20% ‏1-2 غ/كغ وريدي؛ رأي عيون لبزل الغرفة الأمامية" } },
      ],
    },
    worsen: {
      signs: [{ fr: "PIO incontrôlable, acuité qui chute, mydriase fixe", ar: "ضغط غير قابل للضبط، هبوط الحدة، توسع حدقة ثابت" }],
      actions: [
        { txt: { fr: "Ophtalmo en urgence absolue : chaque heure compte pour sauver le nerf optique — chirurgie filtrante si besoin", ar: "عيون بطوارئ مطلقة: كل ساعة حاسمة لإنقاذ العصب البصري — جراحة ترشيح إن لزم" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Œil rouge douloureux chez porteur de lentille", ar: "عين حمراء مؤلمة عند حامل عدسة" }, suspect: { fr: "Abcès de cornée (urgence différente)", ar: "خراج قرنية (طارئ مختلف)" }, href: "/protocoles/oeil-chimique", label: { fr: "Urgence oculaire", ar: "طارئ عيني" } },
    ],
  },
  "epistaxis": {
    intervalMin: 30,
    criteria: [
      { fr: "Saignement actif ou stoppé, hémodynamique (FC, PA)", ar: "نزف نشط أم متوقف، الدوران (نبض، ضغط)" },
      { fr: "Hb dynamique si saignement abondant ou répété", ar: "خضاب ديناميكي إذا النزف غزير أو متكرر" },
      { fr: "INR si AVK, reprise des anticoagulants documentée", ar: "‏INR لمضادات فيتامين K، استئناف مضادات التخثر موثق" },
    ],
    improve: {
      signs: [{ fr: "Saignement arrêté 2 cycles de compression, hémodynamique stable", ar: "توقف النزف بعد دورتي ضغط، دوران مستقر" }],
      actions: [
        { txt: { fr: "Consignes écrites : pas de mouchage 48 h, humidification nasale, éviter AINS/aspirine, reconsulter si récidive", ar: "تعليمات مكتوبة: لا تمخط 48 س، ترطيب الأنف، تجنب مضادات الالتهاب/الأسبرين، أعد الاستشارة عند النكس" } },
      ],
    },
    stall: {
      signs: [{ fr: "Récidive après mèche, saignement postérieur suspecté", ar: "نكس بعد الفتيلة، اشتباه رعاف خلفي" }],
      actions: [
        { txt: { fr: "Avis ORL : cautérisation au nitrate d'argent sur point visible, mèche postérieure, embolisation si rebelle", ar: "رأي أذن: كي بنترات الفضة على نقطة ظاهرة، فتيلة خلفية، إصمام عند العناد" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Choc, Hb < 7 g/dL, trouble de conscience", ar: "صدمة، خضاب < 7 غ/دل، اضطراب وعي" }],
      actions: [
        { txt: { fr: "Transfusion + bloc ORL (ligature artérielle) — ne jamais minimiser une épistaxis chez l'anticoagulé", ar: "نقل دم + صالة أذن (ربط شرياني) — لا تستهن أبداً بالرعاف عند من على مضاد تخثر" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Épistaxis + hématomes + saignement des gencives", ar: "رعاف + كدمات + نزف لثوي" }, suspect: { fr: "Trouble de l'hémostase (Willebrand, thrombopénie)", ar: "اضطراب تخثر (فون ويلبراند، نقص صفيحات)" }, href: "/protocoles/hemorragie-digestive-haute", label: { fr: "Conduite hémorragique", ar: "تدبير نزفي" } },
    ],
  },

  "intoxication-opioides": {
    intervalMin: 15,
    criteria: [
      { fr: "FR et SpO₂ (objectif FR ≥ 12, pas le réveil complet)", ar: "تنفس وإشباع (الهدف تنفس ≥ 12 لا الإفاقة الكاملة)" },
      { fr: "GCS, pupilles, besoin cumulé de naloxone", ar: "‏GCS، حدقتان، الحاجة المجمعة للنالوكسون" },
      { fr: "Délai depuis la dernière dose (demi-vie du produit en cause)", ar: "المدة منذ آخر جرعة (عمر المادة النصفي)" },
    ],
    improve: {
      signs: [{ fr: "Ventilation autonome stable 4-6 h (héroïne/morphine), pas de rebond", ar: "تهوية ذاتية مستقرة 4-6 س (هيروين/مورفين)، بلا ارتداد" }],
      actions: [
        { txt: { fr: "Sortie avec accompagnant fiable, naloxone à domicile, consignes écrites, rendez-vous addictologie", ar: "خروج مع مرافق موثوق، نالوكسون منزلي، تعليمات مكتوبة، موعد علاج إدمان" } },
      ],
    },
    stall: {
      signs: [{ fr: "Besoin de naloxone répétée sans stabilisation", ar: "حاجة لنالوكسون متكرر دون استقرار" },],
      actions: [
        { txt: { fr: "Perfusion continue de naloxone (2/3 de la dose efficace/h) en unité surveillée, chercher une co-ingestion", ar: "تسريب نالوكسون مستمر (ثلثا الجرعة الفعالة/س) بوحدة مراقبة، ابحث عن ابتلاع مشترك" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Re-sédation (méthadone/LP), désaturation, œdème pulmonaire", ar: "تخدير مجدداً (ميثادون/مديد)، نقص إشباع، وذمة رئة" }],
      actions: [
        { txt: { fr: "Ventilation au masque, naloxone titrée, hospitalisation 24 h minimum — ne JAMAIS sortir après un rebond", ar: "تهوية بالقناع، نالوكسون معاير، إدخال 24 س على الأقل — لا إخراج أبداً بعد الارتداد" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Pas de réponse à 10 mg de naloxone cumulée", ar: "لا استجابة بعد 10 ملغ نالوكسون" }, suspect: { fr: "Coma non opioïde : hypoglycémie, trauma, hypoxie-ischémique", ar: "غيبوبة غير أفيونية: نقص سكر، رض، نقص أكسجة" }, href: "/protocoles/hypoglycemie", label: { fr: "Coma", ar: "غيبوبة" } },
      { sign: { fr: "Convulsion (tramadol)", ar: "اختلاج (ترامادول)" }, suspect: { fr: "Crise induite — benzodiazépines", ar: "نوبة محرضة — بنزوديازيبين" }, href: "/protocoles/etat-mal-epileptique", label: { fr: "Convulsions", ar: "اختلاجات" } },
    ],
  },
  "sevrage-alcoolique": {
    intervalMin: 60,
    criteria: [
      { fr: "CIWA-Ar toutes les 1-2 h (puis 4 h si < 8 × 3 évaluations)", ar: "‏CIWA-Ar كل 1-2 س (ثم 4 س إذا < 8 بثلاث تقييمات)" },
      { fr: "Constantes : FC, PA, T°, sueurs (dysautonomie = DT imminent)", ar: "الحيوية: نبض، ضغط، حرارة، تعرق (خلل ذاتي = هذيان وشيك)" },
      { fr: "Conscience, hallucinations, K⁺/Mg²⁺", ar: "الوعي، هلاوس، بوتاسيوم/مغنزيوم" },
    ],
    improve: {
      signs: [{ fr: "CIWA-Ar < 8 à 24-48 h, constantes stables", ar: "‏CIWA-Ar < 8 بـ 24-48 س، حيوية مستقرة" }],
      actions: [
        { txt: { fr: "Décroissance progressive des benzos, thiamine PO, bilan addictologique, orientation de sevrage programmé", ar: "تخفيض تدريجي للبنزو، ثيامين فموي، تقييم إدمان، توجيه لفطام مجدول" } },
      ],
    },
    stall: {
      signs: [{ fr: "CIWA-Ar qui ne baisse pas malgré benzos bien conduits", ar: "‏CIWA-Ar لا ينخفض رغم بنزو جيد" },],
      actions: [
        { txt: { fr: "Vérifier les causes associées (infection, trauma, hypoglycémie, hémorragie digestive) ; foie cirrhotique : passer au lorazépam", ar: "تحقق من أسباب مرافقة (إنتان، رض، نقص سكر، نزف هضمي)؛ كبد متليف: انتقل للورازيبام" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Confusion fluctuante + hallucinations + fièvre/tachycardie (48-96 h) = DT", ar: "تخليط متقلب + هلاوس + حمى/تسرع (48-96 س) = هذيان" }],
      actions: [
        { txt: { fr: "DT : réanimation, diazépam 10-20 mg IV/15 min jusqu'au calme, réhydratation, refroidissement, décubitus latéral ; réfractaire : phénobarbital ± intubation", ar: "هذيان: إنعاش، ديازيبام 10-20 ملغ وريدي/15 د حتى الهدوء، إماهة، تبريد، وضعية جانبية؛ مقاوم: فينوباربيتال ± تنبيب" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Confusion sans amélioration sous benzos", ar: "تخليط دون تحسن تحت البنزو" }, suspect: { fr: "Wernicke — thiamine IV immédiate", ar: "فرنكه — ثيامين وريدي فوري" }, href: "/protocoles/agitation-aigue", label: { fr: "Confusion aiguë", ar: "تخليط حاد" } },
      { sign: { fr: "Convulsion généralisée", ar: "نوبة معممة" }, suspect: { fr: "Crise de sevrage — benzos (PAS de phénytoïne)", ar: "نوبة انسحاب — بنزو (لا فينيتوئين)" }, href: "/protocoles/etat-mal-epileptique", label: { fr: "État de mal", ar: "حالة صرعية" } },
    ],
  },
  "intoxication-digoxine": {
    intervalMin: 30,
    criteria: [
      { fr: "ECG continu (bradycardie, blocs, ESV/TV, tachycardie bidirectionnelle)", ar: "تخطيط مستمر (بطء، حصارات، لانقباضات/تسرع بطيني، ثنائي الاتجاه)" },
      { fr: "K⁺ (marqueur pronostique majeur dans l'aigu)", ar: "بوتاسيوم (مؤشر إنذاري رئيسي بالحاد)" },
      { fr: "Hémodynamique, conscience, diurèse", ar: "الدوران، الوعي، الإدرار" },
    ],
    improve: {
      signs: [{ fr: "Rythme stable 24 h, K⁺ normalisé, digoxinémie décroissante", ar: "نظم مستقر 24 س، بوتاسيوم طبيعي، مستوى ديجوكسين هابط" }],
      actions: [
        { txt: { fr: "Réévaluation de l'indication réelle de la digoxine, éducation interactions (diurétiques, amiodarone, macrolides), contrôle créatinine/K⁺ régulier", ar: "إعادة تقييم استطباب الديجوكسين، توعية بالتداخلات (مدرات، أميودارون، ماكروليد)، مراقبة كرياتينين/بوتاسيوم منتظمة" } },
      ],
    },
    stall: {
      signs: [{ fr: "Arythmies persistantes malgré correction du K⁺/Mg²⁺", ar: "اضطرابات نظم مستمرة رغم تصحيح البوتاسيوم/المغنزيوم" },],
      actions: [
        { txt: { fr: "Antidote Fab si disponible (appel Centre Anti Poison 71 335 335), lidocaïne/phenytoine pour arythmies ventriculaires, pacing si bloc", ar: "ترياق Fab إن توفر (اتصل بمركز السموم 71335335)، ليدوكائين/فينيتوئين لاضطرابات بطينية، ناظمة عند الحصار" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "Bloc AV complet, TV/FV, choc, K⁺ > 6", ar: "حصار AV كامل، تسرع/رجفان بطيني، صدمة، بوتاسيوم > 6" }],
      actions: [
        { txt: { fr: "Réanimation : antidote en urgence absolue, traitement de l'hyperkaliémie (insuline-glucose, salbutamol), pacing temporaire", ar: "إنعاش: الترياق بطوارئ مطلقة، علاج فرط البوتاسيوم (أنسولين-غلوكوز، سالبوتامول)، ناظمة مؤقتة" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "K⁺ > 6 mmol/L avec signes ECG", ar: "بوتاسيوم > 6 مع علامات تخطيط" }, suspect: { fr: "Hyperkaliémie menaçante", ar: "فرط بوتاسيوم مهدد" }, href: "/protocoles/hyperkaliemie", label: { fr: "Hyperkaliémie", ar: "فرط بوتاسيوم" } },
      { sign: { fr: "Bradycardie symptomatique réfractaire", ar: "بطء عرضي مقاوم" }, suspect: { fr: "Bloc digitalique — pacing", ar: "حصار ديجيتالي — ناظمة" }, href: "/protocoles/bradycardie", label: { fr: "Bradycardie", ar: "بطء القلب" } },
    ],
  },
  "intoxication-lithium": {
    intervalMin: 120,
    criteria: [
      { fr: "Neurologie : tremblements, ataxie, myoclonies, conscience (aggravation possible APRÈS l'arrêt)", ar: "الأعصاب: رعاش، ترنح، رمع، وعي (تدهور ممكن بعد الإيقاف)" },
      { fr: "Lithiémie toutes les 2-4 h jusqu'à < 1 mEq/L × 2 contrôles", ar: "مستوى الليثيوم كل 2-4 س حتى < 1 م مك/ل بقياسين" },
      { fr: "Diurèse, créatinine, Na⁺", ar: "الإدرار، كرياتينين، صوديوم" },
    ],
    improve: {
      signs: [{ fr: "Lithiémie < 1 mEq/L décroissante, neurologie normale", ar: "مستوى < 1 م مك/ل هابط، أعصاب طبيعية" }],
      actions: [
        { txt: { fr: "Reprise du lithium discutée avec le psychiatre après correction de la cause (déshydratation, AINS, diurétiques), éducation", ar: "استئناف الليثيوم يناقش مع النفسي بعد تصحيح السبب (تجفاف، مضادات التهاب، مدرات)، توعية" } },
      ],
    },
    stall: {
      signs: [{ fr: "Lithiémie en plateau, diurèse saline insuffisante", ar: "مستوى ثابت، إدرار ملحي غير كافٍ" },],
      actions: [
        { txt: { fr: "Optimiser le remplissage au NaCl 0,9 %, vérifier l'absence de diurétiques/AINS, envisager la dialyse selon critères", ar: "حسّن التعبئة بمحلول ملحي، تأكد من غياب مدرات/مضادات التهاب، وازن الديلزة حسب المعايير" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Convulsions, coma, myoclonies majeures, insuffisance rénale", ar: "اختلاجات، غيبوبة، رمع شديد، قصور كلوي" }],
      actions: [
        { txt: { fr: "Hémodialyse en urgence (critères : > 4 mEq/L, ou > 2,5 + signes graves) — prévoir une 2e séance (rebond à 6-12 h)", ar: "ديلزة عاجلة (المعايير: > 4 م مك/ل، أو > 2.5 + علامات شديدة) — توقع جلسة ثانية (ارتداد 6-12 س)" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Convulsions prolongées", ar: "اختلاجات مطولة" }, suspect: { fr: "État de mal épileptique", ar: "حالة صرعية" }, href: "/protocoles/etat-mal-epileptique", label: { fr: "État de mal", ar: "حالة صرعية" } },
    ],
  },
  "intoxication-salicyles": {
    intervalMin: 60,
    criteria: [
      { fr: "Salicylémie toutes les 2 h jusqu'à décroissance franche (absorption prolongée possible)", ar: "مستوى الساليسيلات كل 2 س حتى انخفاض واضح (امتصاص مديد ممكن)" },
      { fr: "Gazométrie répétée (l'acidose = danger cérébral)", ar: "غازات متكررة (الحماض = خطر دماغي)" },
      { fr: "pH urinaire (objectif 7,5-8), K⁺, conscience, SpO₂", ar: "‏pH بولي (الهدف 7.5-8)، بوتاسيوم، وعي، إشباع" },
    ],
    improve: {
      signs: [{ fr: "Salicylémie décroissante × 2, pH urinaire atteint, clinique normale", ar: "مستوى هابط بقياسين، ‏pH بولي محقق، سريرة طبيعية" }],
      actions: [
        { txt: { fr: "Arrêt du bicarbonate, évaluation psychiatrique (ingestion volontaire), sortie après observation 12-24 h", ar: "إيقاف البيكربونات، تقييم نفسي (ابتلاع عمد)، خروج بعد ملاحظة 12-24 س" } },
      ],
    },
    stall: {
      signs: [{ fr: "Salicylémie en plateau malgré alcalinisation correcte", ar: "مستوى ثابت رغم قلونة صحيحة" },],
      actions: [
        { txt: { fr: "Charbon multidose (bézoard ?), vérifier le K⁺ (sans K⁺ corrigé l'alcalinisation échoue), envisager lavage gastrique tardif si ingestion massive", ar: "فحم متعدد الدفعات (كرة معدية؟)، تحقق من البوتاسيوم (بدون تصحيحه تفشل القلونة)، وازن غسلاً معدياً متأخراً إذا ابتلاع ضخم" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Confusion, coma, œdème pulmonaire, pH < 7,2, convulsions", ar: "تخليط، غيبوبة، وذمة رئة، ‏pH < 7.2، اختلاجات" }],
      actions: [
        { txt: { fr: "Hémodialyse en urgence absolue — seul traitement qui sauve à ce stade ; intubation prudente en maintenant l'hyperventilation", ar: "ديلزة بطوارئ مطلقة — العلاج المنقذ الوحيد بهذه المرحلة؛ تنبيب حذر مع إبقاء فرط التهوية" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Trou anionique élevé + hyperventilation inexpliquée", ar: "فجوة أنيونية عالية + فرط تهوية غير مفسر" }, suspect: { fr: "Acidose métabolique — bilan étiologique", ar: "حماض استقلابي — تحري السبب" }, href: "/protocoles/acidocetose-diabetique", label: { fr: "Acidose", ar: "حماض" } },
    ],
  },
  "pancreatite-aigue": {
    intervalMin: 240,
    criteria: [
      { fr: "Douleur, tolérance alimentaire, transit", ar: "الألم، تحمل التغذية، العبور" },
      { fr: "Diurèse, créatinine, SpO₂ (défaillance d'organe = gravité)", ar: "الإدرار، كرياتينين، إشباع (فشل عضو = خطورة)" },
      { fr: "BISAP, CRP à 48 h, température", ar: "‏BISAP، ‏CRP بـ 48 س، الحرارة" },
    ],
    improve: {
      signs: [{ fr: "Douleur cédante à 48-72 h, alimentation reprise et tolérée, CRP en baisse", ar: "تراجع الألم 48-72 س، استئناف تغذية محتمل، ‏CRP هابط" }],
      actions: [
        { txt: { fr: "Sortie avec cholécystectomie programmée si origine biliaire (avant 4-6 semaines), sevrage alcoolique, régime pauvre en graisses", ar: "خروج مع استئصال مرارة مجدول إذا منشأ صفراوي (قبل 4-6 أسابيع)، فطام كحولي، حمية قليلة الدسم" } },
      ],
    },
    stall: {
      signs: [{ fr: "SIRS persistant à 48 h, créatinine qui monte, douleur rebelle", ar: "‏SIRS مستمر بـ 48 س، كرياتينين يصعد، ألم عنيد" },],
      actions: [
        { txt: { fr: "TDM injectée après 72 h (nécrose), optimiser l'hydratation, dépister les défaillances (Atlanta), avis réanimation", ar: "طبقي محقون بعد 72 س (نخر)، حسّن الإماهة، تحرَّ الفشل (أتلانتا)، رأي إنعاش" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Choc, défaillance d'organe persistante > 48 h, fièvre à J7-J10 (nécrose infectée)", ar: "صدمة، فشل عضو مستمر > 48 س، حمى باليوم 7-10 (نخر معنتن)" }],
      actions: [
        { txt: { fr: "Réanimation, antibiothérapie à pénétration pancréatique (pipé-tazo/carbapénème), drainage step-up en milieu spécialisé", ar: "إنعاش، مضادات بنفوذ بنكرياسي (بيبيراسيلين-تازو/كاربابينيم)، تصريف متدرج بوسط مختص" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Fièvre + ictère + dilatation des voies biliaires", ar: "حمى + يرقان + توسع أقنية" }, suspect: { fr: "Angiocholite biliare — CPRE urgente", ar: "التهاب أقنية صفراوي — CPRE عاجل" }, href: "/protocoles/angiocholite", label: { fr: "Angiocholite", ar: "التهاب أقنية" } },
    ],
  },
  "appendicite": {
    intervalMin: 360,
    criteria: [
      { fr: "Douleur FID, défense, transit, température", ar: "ألم الحفرة الحرقفية، دفاع، عبور، حرارة" },
      { fr: "Alvarado/CRP/NFS en tendance", ar: "ألفارادو/CRP/عد دم بالاتجاه" },
      { fr: "Signes de péritonite (généralisation, contracture)", ar: "علامات التهاب بريتوان (تعمم، تقلص)" },
    ],
    improve: {
      signs: [{ fr: "Post-op simple : reprise du transit, apyrexie, douleur contrôlée", ar: "بعد جراحة بسيطة: عودة العبور، بلا حمى، ألم مضبوط" }],
      actions: [
        { txt: { fr: "Sortie à 24-48 h (cœlioscopie), antibioprophylaxie arrêtée (pas de prolongation sur appendicite non compliquée)", ar: "خروج بـ 24-48 س (منظار)، إيقاف المضاد الوقائي (لا إطالة بالتهاب غير معقد)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Tableau douteux persistant à 6-12 h d'observation", ar: "لوحة مشكوكة مستمرة 6-12 س ملاحظة" },],
      actions: [
        { txt: { fr: "Réexamen chirurgical + CRP de contrôle + imagerie (TDM) — l'évolution fait le diagnostic ; ne jamais sortir sur un doute", ar: "إعادة فحص جراحية + ‏CRP مراقب + تصوير (طبقي) — التطور يصنع التشخيص؛ لا إخراج على شك" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Péritonite, sepsis, abcès (fièvre persistante post-op J3-J5)", ar: "التهاب بريتوان، إنتان، خراج (حمى مستمرة بعد الجراحة ي3-ي5)" }],
      actions: [
        { txt: { fr: "Bloc en urgence (péritonite) ou TDM + drainage (abcès) ; réanimation septique si choc", ar: "صالة عاجلة (بريتوان) أو طبقي + تصريف (خراج)؛ إنعاش إنتاني عند الصدمة" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "β-hCG positif + douleur pelvienne", ar: "هرمون حمل إيجابي + ألم حوضي" }, suspect: { fr: "GEU — urgence gynécologique", ar: "حمل خارج الرحم — طوارئ نسائية" }, href: "/protocoles/geu", label: { fr: "GEU", ar: "حمل خارج الرحم" } },
      { sign: { fr: "Douleur scrotale associée (enfant/ado)", ar: "ألم صفني مرافق (طفل/مراهق)" }, suspect: { fr: "Torsion testiculaire", ar: "التفاف خصية" }, href: "/protocoles/torsade-testiculaire", label: { fr: "Torsion", ar: "التفاف" } },
    ],
  },
  "angiocholite": {
    intervalMin: 60,
    criteria: [
      { fr: "Température/frissons, PA, conscience (pentade de Reynolds = gravité)", ar: "حرارة/قشعريرة، ضغط، وعي (خماسية رينولدز = خطورة)" },
      { fr: "Bilirubine, CRP, lactate en tendance", ar: "بيليروبين، ‏CRP، لاكتات بالاتجاه" },
      { fr: "Délai et qualité du drainage biliaire", ar: "توقيت ونوعية التصريف الصفراوي" },
    ],
    improve: {
      signs: [{ fr: "Apyrexie à 48-72 h post-drainage, bilirubine en baisse, hémodynamique stable", ar: "بلا حمى 48-72 س بعد التصريف، بيليروبين هابط، دوران مستقر" }],
      actions: [
        { txt: { fr: "Antibiothérapie adaptée aux cultures 7-10 j, cholécystectomie programmée dans les semaines suivantes (si lithiase)", ar: "مضادات مكيفة حسب المزارع 7-10 أيام، استئصال مرارة مجدول بالأسابيع التالية (إذا حصيات)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Fièvre persistante à 48-72 h après drainage", ar: "حمى مستمرة 48-72 س بعد التصريف" },],
      actions: [
        { txt: { fr: "Drainage incomplet, abcès hépatique, prothèse obstruée : imagerie de contrôle, re-CPRE ou drainage complémentaire", ar: "تصريف ناقص، خراج كبدي، دعامة مسدودة: تصوير مراقب، إعادة CPRE أو تصريف إضافي" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Choc septique, confusion, anurie (Reynolds)", ar: "صدمة إنتانية، تخليط، لانقطاع بول (رينولدز)" }],
      actions: [
        { txt: { fr: "Réanimation septique + drainage en urgence absolue < 12 h — ne jamais attendre l'amélioration sous antibiotiques seuls", ar: "إنعاش إنتاني + تصريف بطوارئ مطلقة < 12 س — لا تنتظر تحسناً بالمضادات وحدها" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Choc réfractaire au remplissage", ar: "صدمة مقاومة للتعبئة" }, suspect: { fr: "Sepsis grave — source control", ar: "إنتان شديد — ضبط البؤرة" }, href: "/protocoles/choc-septique", label: { fr: "Choc septique", ar: "صدمة إنتانية" } },
    ],
  },
  "occlusion-intestinale": {
    intervalMin: 240,
    criteria: [
      { fr: "Reprise du transit (gaz, selles), distension, débit de la SNG", ar: "عودة العبور (ريح، براز)، انتفاخ، ناتج الأنبوب المعدي" },
      { fr: "Douleur (continue = strangulation jusqu'à preuve du contraire)", ar: "الألم (مستمر = اختناق حتى يثبت العكس)" },
      { fr: "Température, FC, lactate, défense abdominale", ar: "حرارة، نبض، لاكتات، دفاع بطني" },
    ],
    improve: {
      signs: [{ fr: "Reprise des gaz/selles à 24-48 h, distension cédante, SNG tarie", ar: "عودة الريح/البراز 24-48 س، تراجع الانتفاخ، جفاف الأنبوب" }],
      actions: [
        { txt: { fr: "Ablation de la SNG, reprise alimentaire progressive, enquête étiologique (TDM coloscopie différée si > 50 ans ou sans cicatrice)", ar: "نزع الأنبوب، استئناف تغذية تدريجي، تحري السبب (طبقي، تنظير قولون مؤجل إذا > 50 س أو بلا ندبة)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Pas de reprise du transit à 48 h de traitement conservateur", ar: "لا عودة للعبور بـ 48 س من العلاج المحافظ" },],
      actions: [
        { txt: { fr: "Chirurgie — au-delà de 48 h le risque de strangulation croît chaque heure ; ne pas prolonger l'essai conservateur", ar: "جراحة — بعد 48 س يزداد خطر الاختناق كل ساعة؛ لا تمدد المحاولة المحافظة" } },
        SAMU,
      ],
    },
    worsen: {
      signs: [{ fr: "Douleur continue, défense, fièvre, lactate élevé, choc", ar: "ألم مستمر، دفاع، حمى، لاكتات عالٍ، صدمة" }],
      actions: [
        { txt: { fr: "Strangulation : bloc immédiat (résection selon vitalité), réanimation, antibiothérapie large", ar: "اختناق: صالة فورية (استئصال حسب الحيوية)، إنعاش، مضادات واسعة" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Hernie inguinale douloureuse irréductible", ar: "فتق إربي مؤلم غير مرجع" }, suspect: { fr: "Hernie étranglée — chirurgie", ar: "فتق مختنق — جراحة" }, href: "/protocoles/occlusion-intestinale", label: { fr: "Occlusion", ar: "انسداد" } },
    ],
  },
  "traumatisme-medullaire": {
    intervalMin: 60,
    criteria: [
      { fr: "Score ASIA (moteur/sensitif) — toute aggravation = urgence chirurgicale", ar: "سكور ASIA (حركي/حسي) — أي تدهور = طوارئ جراحية" },
      { fr: "PAM 85-90 mmHg (noradrénaline si besoin), diurèse", ar: "ضغط الإرواء 85-90 ملم ز (نورأدرينالين عند الحاجة)، إدرار" },
      { fr: "Respiration (capacité vitale, toux) — lésion haute : intuber avant l'aggravation", ar: "التنفس (سعة حيوية، سعال) — إصابة عالية: نبِّب قبل التدهور" },
    ],
    improve: {
      signs: [{ fr: "ASIA stable/amélioré, PAM maintenue, rachis fixé, sevrage ventilatoire possible", ar: "‏ASIA مستقر/متحسن، ضغط إرواء مضبوط، عمود مثبت، فطام تنفسي ممكن" }],
      actions: [
        { txt: { fr: "Transfert en centre spinal : rééducation précoce, prévention (thrombose, escarres, infections urinaires), soutien psychologique", ar: "تحويل لمركز العمود الفقري: تأهيل مبكر، وقاية (خثار، قرحات، إنتانات بولية)، دعم نفسي" } },
      ],
    },
    stall: {
      signs: [{ fr: "PAM instable, bradycardie persistante (choc neurogénique)", ar: "ضغط إرواء غير مستقر، بطء مستمر (صدمة نخاعية)" },],
      actions: [
        { txt: { fr: "Noradrénaline titrée, atropine/pacing si bradycardie symptomatique, éviter la surcharge (œdème médullaire)", ar: "نورأدرينالين معاير، أتروبين/ناظمة عند بطء عرضي، تجنب الحمل الزائد (وذمة نخاعية)" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Déficit qui s'aggrave, détresse respiratoire, hématome épidural", ar: "عجز يتدهور، ضائقة تنفسية، ورم دموي فوق الجافية" }],
      actions: [
        { txt: { fr: "IRM en urgence + neurochirurgie (décompression précoce = seule chance de récupération) ; intubation si CV qui chute", ar: "مرنان عاجل + جراحة أعصاب (التخفيف المبكر = فرصة الشفاء الوحيدة)؛ تنبيب إذا السعة تهبط" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Hypotension + bradycardie chez le traumatisé", ar: "هبوط + بطء عند المصاب" }, suspect: { fr: "Choc neurogénique (≠ hypovolémique)", ar: "صدمة نخاعية (≠ نقص حجم)" }, href: "/protocoles/polytraumatisme", label: { fr: "Polytraumatisme", ar: "متعدد الإصابات" } },
    ],
  },
  "colique-nephretique": {
    intervalMin: 30,
    criteria: [
      { fr: "Douleur EVA toutes les 30 min sous traitement", ar: "الألم EVA كل 30 د تحت العلاج" },
      { fr: "T° — fièvre = pyélonéphrite obstructive (urgence de drainage)", ar: "الحرارة — حمى = التهاب حويضة انسدادية (طوارئ تصريف)" },
      { fr: "Diurèse (rétention ? globe ?), vomissements, PA (AINS)", ar: "الإدرار (احتباس؟ مثانة؟)، تقيؤ، ضغط (مضادات الالتهاب)" },
    ],
    improve: {
      signs: [{ fr: "Douleur < 4/10, apyrétique, diurèse reprise", ar: "ألم < 4/10، بلا حمى، استئناف الإدرار" }],
      actions: [
        { txt: { fr: "Filtrer les urines (analyse du calcul), hydratation normale (PAS de surcharge), tamsulosine si calcul 5-10 mm, relais antalgique PO, contrôle imagerie à 2-4 semaines", ar: "صفِّ البول (تحليل الحصاة)، إماهة عادية (لا إفراط)، تامسولوسين إذا الحصاة 5-10 مم، تحويل مسكن فموي، مراقبة تصويرية بـ 2-4 أسابيع" } },
      ],
    },
    stall: {
      signs: [{ fr: "Douleur non contrôlée malgré kétoprofène + morphine titrée", ar: "ألم غير مسيطر رغم الكيتوبروفين + مورفين معيّر" }],
      actions: [
        { txt: { fr: "Remettre en cause le diagnostic (TDM sans injection) : dissection aortique, appendicite, GEU, ischémie mésentérique ; avis urologie pour drainage", ar: "أعد التشكيك بالتشخيص (طبقي بلا حقن): تسلخ الأبهر، زائدة، حمل خارج رحمي، نقص تروية مساريقية؛ رأي مسالك للتصريف" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Fièvre + frissons + douleur = PYÉLONÉPHRITE OBSTRUCTIVE", ar: "حمى + قشعريرة + ألم = التهاب حويضة انسدادية" }],
      actions: [
        { txt: { fr: "Sepsis urinaire sur obstacle : ATB < 1 h + hémocultures, décompression urgente (sonde JJ ou néphrostomie) — jamais de lithotritie en phase septique", ar: "إنتان بولي على انسداد: مضاد حيوي < 1 س + زرع دم، تفريغ عاجل (أنبوب JJ أو فغر كلوي) — أبداً تفتيت بالمرحلة الإنتانية" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Fièvre + frissons", ar: "حمى + قشعريرة" }, suspect: { fr: "PNA obstructive — drainage urgent", ar: "التهاب حويضة انسدادية — تصريف عاجل" }, href: "/protocoles/pyelonephrite-aigue", label: { fr: "PNA", ar: "التهاب حويضة" } },
      { sign: { fr: "Globe vésical + anurie", ar: "مثانة منتفخة + انقطاع إدرار" }, suspect: { fr: "Rétention aiguë — sondage", ar: "احتباس حاد — قثطرة" }, href: "/protocoles/retention-aigue-urine", label: { fr: "RAU", ar: "احتباس" } },
    ],
  },
  "pyelonephrite-aigue": {
    intervalMin: 60,
    criteria: [
      { fr: "Courbe T°, FC, PA (qSOFA) — efficacité antibiotique jugée à 48-72 h", ar: "منحنى الحرارة، نبض، ضغط (qSOFA) — فعالية المضاد تُقيَّم بـ 48-72 س" },
      { fr: "Douleur lombaire, diurèse, tolérance digestive de l'ATB", ar: "ألم قطني، إدرار، تحمل هضمي للمضاد" },
      { fr: "Résultats ECBU + hémocultures (réorientation à 48 h)", ar: "نتائج زرع البول + زرع الدم (إعادة توجيه بـ 48 س)" },
    ],
    improve: {
      signs: [{ fr: "Défervescence à 48-72 h, ECBU documenté", ar: "انخفاض الحرارة بـ 48-72 س، زرع بول موثق" }],
      actions: [
        { txt: { fr: "Relais PO guidé par l'antibiogramme (durée totale 7-14 j selon le terrain), ECBU de contrôle inutile si évolution favorable", ar: "تحويل فموي موجه بمضاد الحساسيات (المدة الكلية 7-14 يوماً حسب الحالة)، زرع بول مراقبة غير مفيد إذا تطور جيد" } },
      ],
    },
    stall: {
      signs: [{ fr: "Fièvre persistante > 72 h malgré ATB bien conduit", ar: "حمى مستمرة > 72 س رغم مضاد مناسب" }],
      actions: [
        { txt: { fr: "TDM abdomino-pelvienne avec injection : abcès rénal/périnéphrétique (drainage), obstacle (sonde JJ), souche BLSE (escalade carbapénème)", ar: "طبقي بطن-حوض مع حقن: خراج كلوي/حول كلوي (تصريف)، انسداد (أنبوب JJ)، سلالة BLSE (تصعيد كربابينيم)" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Hypotension + marbrures + confusion = choc septique d'origine urinaire", ar: "هبوط ضغط + تبرقش + تخليط = صدمة إنتانية بولية المنشأ" }],
      actions: [
        { txt: { fr: "Réanimation : remplissage, ATB large spectre < 1 h, noradrénaline, lever l'obstacle en urgence (JJ/néphrostomie)", ar: "إنعاش: تعبئة، مضاد واسع < 1 س، نورأدرينالين، رفع الانسداد عاجلاً (JJ/فغر كلوي)" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "PAS < 90 + marbrures", ar: "ضغط انقباضي < 90 + تبرقش" }, suspect: { fr: "Choc septique urinaire", ar: "صدمة إنتانية بولية" }, href: "/protocoles/choc-septique", label: { fr: "Choc septique", ar: "صدمة إنتانية" } },
      { sign: { fr: "Colique + fièvre", ar: "مغص + حمى" }, suspect: { fr: "Obstacle infecté — décompression", ar: "انسداد معدي — تفريغ" }, href: "/protocoles/colique-nephretique", label: { fr: "CN obstructive", ar: "مغص انسدادية" } },
    ],
  },
  "retention-aigue-urine": {
    intervalMin: 30,
    criteria: [
      { fr: "Volume évacué (décompression progressive si > 1 L), diurèse horaire", ar: "الحجم المُفرغ (تفريغ تدريجي إذا > 1 ل)، إدرار ساعي" },
      { fr: "PA, FC (malaise vagal de décompression), reprise du besoin d'uriner", ar: "ضغط، نبض (إغماء مبهمي عند التفريغ)، عودة الإحساس بالحاجة للتبول" },
      { fr: "Examen neurologique : tonus anal, sensibilité périnéale (queue de cheval !)", ar: "فحص عصبي: مقوية الشرج، حساسية العجان (ذيل الفرس!)" },
    ],
    improve: {
      signs: [{ fr: "Reprise de mictions spontanées complètes après épreuve de désondage", ar: "استئناف تبول عفوي كامل بعد اختبار نزع القثطرة" }],
      actions: [
        { txt: { fr: "Tamsulosine 0,4 mg/j pendant l'épreuve, recherche de cause (BPH, constipation, médicaments anticholinergiques), PSA à distance (pas en aigu)", ar: "تامسولوسين 0.4 ملغ/ي خلال الاختبار، بحث عن سبب (تضخم بروستات، إمساك، أدوية مضادة كولين)، ‏PSA بعد فترة (ليس بالحاد)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Échec du désondage (rétention récidivante)", ar: "فشل نزع القثطرة (احتباس ناكس)" }],
      actions: [
        { txt: { fr: "Tamsulosine 4-6 semaines puis nouvelle épreuve ; échec répété : auto-sondage ou chirurgie (RTUP) — avis urologie", ar: "تامسولوسين 4-6 أسابيع ثم اختبار جديد؛ فشل متكرر: قثطرة ذاتية أو جراحة (استئصال بروستات) — رأي مسالك" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Anesthésie en selle + déficit des membres inférieurs + incontinence anale", ar: "خدر سرجي + عجز أطراف سفلية + سلس شرجي" }],
      actions: [
        { txt: { fr: "SYNDROME DE LA QUEUE DE CHEVAL : IRM médullaire en urgence absolue (< 24-48 h pour sauver la fonction), dexaméthasone, avis neurochirurgie immédiat", ar: "متلازمة ذيل الفرس: رنين مغناطيسي للنخاع بطوارئ مطلقة (< 24-48 س لإنقاذ الوظيفة)، ديكساميثازون، رأي جراحة أعصاب فوري" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Déficit sensitivo-moteur des MI", ar: "عجز حسي-حركي بالطرفين السفليين" }, suspect: { fr: "Compression médullaire — IRM urgente", ar: "انضغاط نخاعي — رنين عاجل" }, href: "/protocoles/traumatisme-medullaire", label: { fr: "Queue de cheval", ar: "ذيل الفرس" } },
      { sign: { fr: "Polyurie > 200 mL/h prolongée", ar: "كثرة إدرار > 200 مل/س مطولة" }, suspect: { fr: "Levée d'obstacle — compensation volémique", ar: "زوال الانسداد — تعويض حجمي" }, href: "/protocoles/hhs-hyperosmolaire", label: { fr: "Polyurie", ar: "كثرة إدرار" } },
    ],
  },
  "pericardite-aigue": {
    intervalMin: 60,
    criteria: [
      { fr: "Douleur thoracique (position, inspiration), T°, FC", ar: "ألم صدري (وضعية، شهيق)، حرارة، نبض" },
      { fr: "ECG : évolution du sus-ST, QTc sous traitement", ar: "تخطيط: تطور ارتفاع ST، ‏QTc تحت العلاج" },
      { fr: "Signes de tamponnade : PA, turgescence jugulaire, pouls paradoxal > 10 mmHg", ar: "علامات دندة: ضغط، تورم وداجي، نبض متناقض > 10 مم زئبق" },
    ],
    improve: {
      signs: [{ fr: "Douleur cédant sous aspirine + colchicine, ECG qui se normalise", ar: "ألم يخف بالأسبرين + كولشيسين، تخطيط يتطبع" }],
      actions: [
        { txt: { fr: "Poursuivre aspirine 2-4 semaines avec décroissance + colchicine 3 mois (prévention des récidives), repos sportif 3 mois, échographie de contrôle", ar: "واصل الأسبرين 2-4 أسابيع بتناقص + كولشيسين 3 أشهر (وقاية النكس)، راحة رياضية 3 أشهر، إيكو مراقبة" } },
      ],
    },
    stall: {
      signs: [{ fr: "Douleur persistante > 7 jours ou fièvre prolongée", ar: "ألم مستمر > 7 أيام أو حمى مطولة" }],
      actions: [
        { txt: { fr: "Rechercher étiologie spécifique : tuberculose (Tunisie — épanchement abondant, exsudat lymphocytaire), auto-immune, néoplasique ; ponction péricardique diagnostique", ar: "ابحث عن سبب محدد: سل (تونس — انصباب غزير، رشاحة لمفاوية)، مناعي ذاتي، ورمي؛ بزل تاموري تشخيصي" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Hypotension + jugulaires turgescentes + bruits assourdis (triade de Beck)", ar: "هبوط ضغط + وداجيان منتفخان + أصوات مكتومة (ثلاثية بيك)" }],
      actions: [
        { txt: { fr: "TAMPONNADE : échographie en urgence, péricardiocentèse guidée (abord sous-xyphoïdien), remplissage prudent, PAS de diurétiques", ar: "دندة: إيكو عاجل، بزل تاموري موجه (مدخل تحت الخائية)، تعبئة حذرة، لا مدرات" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Triade de Beck + choc", ar: "ثلاثية بيك + صدمة" }, suspect: { fr: "Tamponnade — péricardiocentèse", ar: "دندة — بزل تاموري" }, href: "/protocoles/tamponnade", label: { fr: "Tamponnade", ar: "دندة" } },
      { sign: { fr: "Dyspnée + orthopnée + crépitants", ar: "زلة + ضجعة + فرقعات" }, suspect: { fr: "Myopéricardite avec insuffisance cardiaque", ar: "التهاب عضلة-تامور مع قصور قلبي" }, href: "/protocoles/oap", label: { fr: "OAP", ar: "وذمة رئة" } },
    ],
  },
  "endocardite-infectieuse": {
    intervalMin: 60,
    criteria: [
      { fr: "Courbe thermique (défervescence attendue à 7-10 jours), FC, PA", ar: "منحنى الحرارة (انخفاض متوقع بـ 7-10 أيام)، نبض، ضغط" },
      { fr: "Examen neurologique et cutané à chaque passage (emboles septiques)", ar: "فحص عصبي وجلدي كل مرور (صمات إنتانية)" },
      { fr: "3e hémoculture de contrôle, fonction rénale (aminoside), tolérance ATB", ar: "زرع دم ثالث مراقبة، وظيفة كلوية (أمينوغليكوزيد)، تحمل المضاد" },
    ],
    improve: {
      signs: [{ fr: "Apyrexie à J7-J10, hémocultures négativées, CRP en baisse", ar: "لا حمى بيوم 7-10، زروع سلبية، ‏CRP بانخفاض" }],
      actions: [
        { txt: { fr: "Poursuivre l'antibiothérapie IV 4-6 semaines selon germe et valve, ETO de contrôle, évaluation chirurgicale programmée si valvulopathie résiduelle", ar: "واصل المضاد الوريدي 4-6 أسابيع حسب الجرثومة والصمام، إيكو عبر مريء مراقبة، تقييم جراحي مجدول إذا اعتلال صمامي متبقٍ" } },
      ],
    },
    stall: {
      signs: [{ fr: "Fièvre persistante > 7-10 jours malgré ATB adaptée", ar: "حمى مستمرة > 7-10 أيام رغم مضاد مناسب" }],
      actions: [
        { txt: { fr: "Réévaluation ETO (abcès péri-annulaire, nouvelle végétation), hémocultures répétées, TDM corps entier (emboles), reconsidérer germe atypique ou fièvre Q", ar: "إعادة تقييم إيكو مريء (خراج حول الحلقة، نباتة جديدة)، زروع متكررة، طبقي كامل الجسم (صمات)، أعد النظر بجرثومة لا نمطية أو حمى Q" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Nouveau souffle, dyspnée/OAP, événement embolique (AVC, ischémie de membre)", ar: "نفخة جديدة، زلة/وذمة رئة، حدث صمي (سكتة، نقص تروية طرف)" }],
      actions: [
        { txt: { fr: "Indication de CHIRURGIE urgente : insuffisance cardiaque réfractaire, abcès, emboles répétés — avis cardiochirurgie immédiat, anticoagulation à réévaluer (risque hémorragique cérébral)", ar: "استطباب جراحة عاجلة: قصور قلبي مقاوم، خراج، صمات متكررة — رأي جراحة قلب فوري، إعادة تقييم مضاد التخثر (خطر نزف دماغي)" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "OAP + souffle nouveau", ar: "وذمة رئة + نفخة جديدة" }, suspect: { fr: "Rupture valvulaire — chirurgie", ar: "تمزق صمامي — جراحة" }, href: "/protocoles/oap", label: { fr: "OAP", ar: "وذمة رئة" } },
      { sign: { fr: "Déficit neurologique focal brutal", ar: "عجز عصبي بؤري مفاجئ" }, suspect: { fr: "Embole septique cérébral", ar: "صمة إنتانية دماغية" }, href: "/protocoles/avc", label: { fr: "AVC", ar: "سكتة" } },
    ],
  },
  "hhs-hyperosmolaire": {
    intervalMin: 30,
    criteria: [
      { fr: "Osmolarité calculée toutes les 2-4 h (baisse < 3 mOsm/kg/h — jamais plus vite)", ar: "الأسمولية المحسوبة كل 2-4 س (هبوط < 3 م أسم/كغ/س — أبداً أسرع)" },
      { fr: "Glycémie capillaire horaire, K⁺ toutes les 2-4 h, diurèse horaire", ar: "سكر شعري ساعي، بوتاسيوم كل 2-4 س، إدرار ساعي" },
      { fr: "Conscience (suit l'osmolarité), constantes, bilan entrées/sorties strict", ar: "الوعي (يتبع الأسمولية)، الحيوية، حصيلة دخول/خروج صارمة" },
    ],
    improve: {
      signs: [{ fr: "Osmolarité < 320 mOsm/kg, conscience normale, K⁺ stable", ar: "أسمولية < 320 م أسم/كغ، وعي طبيعي، بوتاسيوم مستقر" }],
      actions: [
        { txt: { fr: "Passage à l'insuline sous-cutanée basale AVANT l'arrêt de l'IV (chevauchement 1-2 h), chercher la cause déclenchante (infection ++), HBPM préventive, éducation diabétologique", ar: "التحول للأنسولين تحت الجلد القاعدي قبل إيقاف الوريدي (تراكب 1-2 س)، ابحث عن المحرض (إنتان خصوصاً)، هيبارين وقائي، تربية سكرية" } },
      ],
    },
    stall: {
      signs: [{ fr: "Conscience qui ne s'améliore pas malgré la correction de l'osmolarité", ar: "وعي لا يتحسن رغم تصحيح الأسمولية" }],
      actions: [
        { txt: { fr: "TDM cérébrale : autre cause de coma associée (AVC, hématome, infection, toxique) — le HHS n'explique pas tout", ar: "طبقي دماغ: سبب غيبوبة آخر مرافق (سكتة، ورم دموي، إنتان، سموم) — فرط الأسمولية لا يفسر كل شيء" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Céphalées + bradycardie + désaturation = œdème cérébral (réhydratation trop rapide)", ar: "صداع + بطء قلب + نقص تشبع = وذمة دماغية (إماهة سريعة جداً)" }],
      actions: [
        { txt: { fr: "Ralentir immédiatement la réhydratation, mannitol 0,5-1 g/kg IV, surélever la tête, intubation si coma, PIC en réanimation", ar: "أبطئ الإماهة فوراً، مانيتول 0.5-1 غ/كغ وريدي، ارفع الرأس، تنبيب إذا غيبوبة، ضغط قحف بالإنعاش" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Déficit focal + asymétrie pupillaire", ar: "عجز بؤري + عدم تناظر حدقي" }, suspect: { fr: "AVC/hématome associé", ar: "سكتة/ورم دموي مرافق" }, href: "/protocoles/avc", label: { fr: "AVC", ar: "سكتة" } },
      { sign: { fr: "Fièvre + collapsus", ar: "حمى + انهيار" }, suspect: { fr: "Sepsis déclencheur du HHS", ar: "إنتان محرض لفرط الأسمولية" }, href: "/protocoles/choc-septique", label: { fr: "Choc septique", ar: "صدمة إنتانية" } },
    ],
  },
  "invagination-intestinale": {
    intervalMin: 30,
    criteria: [
      { fr: "Accès douloureux intermittents (l'accalmie = réduction réussie), vomissements", ar: "نوبات ألم متقطعة (الهدأة = نجاح الرد)، تقيؤ" },
      { fr: "Abdomen : météorisme, défense, masse en saucisse, sang dans les couches", ar: "بطن: انتفاخ، دفاع، كتلة سجقية، دم بالحفاظ" },
      { fr: "Constantes + hydratation (jeûne, VVP), échographie de contrôle", ar: "الحيوية + إماهة (صيام، وريد)، إيكو مراقبة" },
    ],
    improve: {
      signs: [{ fr: "Accalmie complète > 6 h, enfant qui mange, selle normale", ar: "هدأة كاملة > 6 س، طفل يأكل، براز طبيعي" }],
      actions: [
        { txt: { fr: "Surveillance 24 h (récidive 5-10 % dans les 72 h), reprise alimentaire progressive, éducation des parents sur les signes de récidive", ar: "مراقبة 24 س (نكس 5-10% خلال 72 س)، استئناف تغذية تدريجي، تثقيف الأهل حول علامات النكس" } },
      ],
    },
    stall: {
      signs: [{ fr: "Échec du lavement réducteur (air ou eau) ou récidive précoce", ar: "فشل الحقنة الرادة (هواء أو ماء) أو نكس مبكر" }],
      actions: [
        { txt: { fr: "Chirurgie : réduction manuelle peropératoire, rechercher un point d'appel (diverticule de Meckel, polype, lymphome) surtout si > 3 ans", ar: "جراحة: رد يدوي أثناء العمل، ابحث عن نقطة انطلاق (رتج ميكل، سليلة، ورم لمفاوي) خصوصاً إذا > 3 سنوات" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Défense généralisée + choc + rectorragie abondante = nécrose intestinale", ar: "دفاع معمم + صدمة + نزف شرجي غزير = نخر معوي" }],
      actions: [
        { txt: { fr: "LAPAROTOMIE urgente : résection du segment nécrosé, remplissage, ATB large spectre, réanimation pédiatrique", ar: "فتح بطن عاجل: استئصال القطعة المنخورة، تعبئة، مضاد واسع، إنعاش أطفال" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Vomissements bilieux + arrêt des matières", ar: "تقيؤ صفراوي + توقف براز" }, suspect: { fr: "Occlusion intestinale", ar: "انسداد معوي" }, href: "/protocoles/occlusion-intestinale", label: { fr: "Occlusion", ar: "انسداد" } },
      { sign: { fr: "Purpura + douleurs abdominales", ar: "فرفرية + آلام بطنية" }, suspect: { fr: "Purpura rhumatoïde (Henoch-Schönlein)", ar: "فرفرية رثوية (هنوخ-شونلاين)" }, href: "/protocoles/hemorragie-digestive-basse", label: { fr: "Rectorragie HSP", ar: "نزف شرجي HSP" } },
    ],
  },
  "hemorragie-digestive-basse": {
    intervalMin: 30,
    criteria: [
      { fr: "FC, PA (hypotension orthostatique = perte > 15 %), marbrures", ar: "نبض، ضغط (هبوط انتصابي = فقد > 15%)، تبرقش" },
      { fr: "Fréquence et abondance des rectorragies, diurèse horaire", ar: "تكرار وغزارة النزف الشرجي، إدرار ساعي" },
      { fr: "Hb à H0 puis H6 (l'hémoconcentration initiale sous-estime la perte)", ar: "هيموغلوبين بـ H0 ثم H6 (التركز الدموي الأولي يقلل تقدير الفقد)" },
    ],
    improve: {
      signs: [{ fr: "Arrêt du saignement, constantes stables, Hb stable à H6", ar: "توقف النزف، حيوية مستقرة، هيموغلوبين ثابت بـ H6" }],
      actions: [
        { txt: { fr: "Préparation coloscopique et coloscopie à 24 h (diverticulose, angiodysplasie, néoplasie), > 40 ans : exploration complète obligatoire même si saignement arrêté", ar: "تحضير ومنظار قولون بـ 24 س (رتوج، خلل وعائي، أورام)، > 40 سنة: استقصاء كامل إلزامي حتى لو توقف النزف" } },
      ],
    },
    stall: {
      signs: [{ fr: "Saignement persistant sans stabilité hémodynamique", ar: "نزف مستمر بلا استقرار دموي" }],
      actions: [
        { txt: { fr: "Angio-TDM puis artériographie avec embolisation possible ; éliminer une origine HAUTE par fibroscopie (15 % des rectorragies massives)", ar: "طبقي وعائي ثم تصوير شرياني مع إمكانية إصمام؛ استبعد منشأً علوياً بالتنظير (15% من النزوف الشرجية الغزيرة)" } },
      ],
    },
    worsen: {
      signs: [{ fr: "PAS < 90 + FC > 110 + marbrures = choc hémorragique", ar: "ضغط انقباضي < 90 + نبض > 110 + تبرقش = صدمة نزفية" }],
      actions: [
        { txt: { fr: "Transfusion massive (culots + plasma), acide tranexamique 1 g IV, 2 VVP de gros calibre, chirurgie/embolisation en urgence", ar: "نقل دموي واسع (كريات + بلازما)، حمض الترانيكساميك 1 غ وريدي، وريدان عريضان، جراحة/إصمام عاجل" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "PAS < 90 + tachycardie", ar: "ضغط انقباضي < 90 + تسرع قلب" }, suspect: { fr: "Choc hémorragique — transfusion massive", ar: "صدمة نزفية — نقل واسع" }, href: "/calculateurs/transfusion", label: { fr: "Transfusion massive", ar: "نقل الدم الواسع" } },
      { sign: { fr: "Méléna associé ou lavage gastrique sanglant", ar: "زفت مرافق أو غسيل معدي دموي" }, suspect: { fr: "Origine haute (15 %) — fibroscopie", ar: "منشأ علوي (15%) — تنظير علوي" }, href: "/protocoles/hemorragie-digestive-haute", label: { fr: "HDH", ar: "نزف علوي" } },
    ],
  },
  "perforation-peritonite": {
    intervalMin: 15,
    criteria: [
      { fr: "Constantes toutes les 15 min : PAS, FC, SpO₂, T°, conscience (score qSOFA)", ar: "الحيوية كل 15 د: انقباضي، نبض، تشبع، حرارة، وعي (qSOFA)" },
      { fr: "Abdomen : défense/contracture, douleur à la décompression", ar: "بطن: دفاع/تقلص، ألم عند رفع الضغط" },
      { fr: "Lactate, diurèse, efficacité de l'analgésie", ar: "لاكتات، إدرار، فعالية التسكين" },
    ],
    improve: {
      signs: [{ fr: "Source controlée chirurgicalement, constantes en amélioration, lactate < 2", ar: "المصدر تمت السيطرة عليه جراحياً، الحيوية بتحسن، لاكتات < 2" }],
      actions: [
        { txt: { fr: "Poursuivre ATB 4-7 jours selon peropératoire, réalimentation progressive, recherche d'ulcère H. pylori (traitement éradicateur après la sortie)", ar: "واصل المضاد 4-7 أيام حسب ما أثناء الجراحة، تغذية تدريجية، بحث عن قرحة ملوية بوابية (علاج استئصالي بعد الخروج)" } },
      ],
    },
    stall: {
      signs: [{ fr: "Aggravation malgré ATB et remplissage (chirurgie non encore faite)", ar: "تدهور رغم المضاد والتعبئة (الجراحة لم تُجرَ بعد)" }],
      actions: [
        { txt: { fr: "La CHIRURGIE est le traitement — aucune antibiothérapie ne remplace le lavage et la suture ; transfert chirurgical immédiat même de nuit", ar: "الجراحة هي العلاج — لا مضاد يعوض الغسل والخياطة؛ نقل جراحي فوري حتى ليلاً" } },
      ],
    },
    worsen: {
      signs: [{ fr: "PAS < 90 + marbrures + oligurie = choc septique péritonéal", ar: "انقباضي < 90 + تبرقش + قلة إدرار = صدمة إنتانية صفاقية" }],
      actions: [
        { txt: { fr: "Réanimation agressive : noradrénaline, remplissage, ATB large spectre (pipéracilline-tazobactam), laparotomie < 6 h — la mortalité double par heure de retard au choc", ar: "إنعاش مكثف: نورأدرينالين، تعبئة، مضاد واسع (بيبراسيلين-تازوباكتام)، فتح بطن < 6 س — الوفيات تتضاعف بكل ساعة تأخير بالصدمة" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "PAS < 90 + marbrures", ar: "انقباضي < 90 + تبرقش" }, suspect: { fr: "Choc septique — réanimation + chirurgie", ar: "صدمة إنتانية — إنعاش + جراحة" }, href: "/protocoles/choc-septique", label: { fr: "Choc septique", ar: "صدمة إنتانية" } },
      { sign: { fr: "Vomissements + arrêt des matières sans pneumopéritoine", ar: "تقيؤ + توقف براز بلا هواء صفاقي" }, suspect: { fr: "Occlusion intestinale aiguë", ar: "انسداد معوي حاد" }, href: "/protocoles/occlusion-intestinale", label: { fr: "Occlusion", ar: "انسداد" } },
    ],
  },
  "intoxication-alcool-aigue": {
    intervalMin: 30,
    criteria: [
      { fr: "Glasgow horaire (la conscience suit l'élimination : amélioration progressive obligatoire)", ar: "غلاسكو ساعي (الوعي يتبع التخلص: تحسن تدريجي إلزامي)" },
      { fr: "Glycémie capillaire toutes les 2 h (hypoglycémie = cause de coma réversible)", ar: "سكر شعري كل 2 س (نقص السكر = سبب غيبوبة عكوس)" },
      { fr: "FR, SpO₂, T° (hypothermie fréquente), protection des voies aériennes", ar: "تنفس، تشبع، حرارة (انخفاض شائع)، حماية المجاري التنفسية" },
    ],
    improve: {
      signs: [{ fr: "Glasgow 15, glycémie normale, marche stable, hydratation reprise", ar: "غلاسكو 15، سكر طبيعي، مشي ثابت، استئناف الإماهة" }],
      actions: [
        { txt: { fr: "Sortie UNIQUEMENT accompagnée (jamais seul « cuver »), conseils d'hydratation, évaluation addictologique si binge répété, thiamine PO si dénutrition", ar: "خروج فقط بمرافقة (أبداً وحده «لينام سكره»)، نصائح إماهة، تقييم إدمان إذا نهم متكرر، ثيامين فموي إذا سوء تغذية" } },
      ],
    },
    stall: {
      signs: [{ fr: "Conscience qui ne s'améliore pas après 4-6 h ou alcoolémie en baisse sans réveil", ar: "وعي لا يتحسن بعد 4-6 س أو كحولية تنخفض بلا يقظة" }],
      actions: [
        { txt: { fr: "L'alcool est un diagnostic d'ÉLIMINATION : TDM cérébrale (hématome sous-dural du sujet ivre tombé), glycémie, ionogramme, gazométrie (méthanol/éthylène glycol), recherche de co-ingestion", ar: "الكحول تشخيص بالإقصاء: طبقي دماغ (ورم دموي تحت الجافية عند سكير سقط)، سكر، شوارد، غازات (ميثانول/إيثيلين غليكول)، بحث عن مشاركة سمية" } },
      ],
    },
    worsen: {
      signs: [{ fr: "Glasgow ≤ 8, FR < 8, vomissements avec coma = risque d'inhalation", ar: "غلاسكو ≤ 8، تنفس < 8، تقيؤ مع غيبوبة = خطر استنشاق" }],
      actions: [
        { txt: { fr: "PLS stricte ou intubation, naloxone 0,4 mg IV d'épreuve (co-ingestion d'opioïdes fréquente — tramadol ++), aspiration des voies aériennes, monitorage", ar: "وضعية جانبية صارمة أو تنبيب، نالوكسون 0.4 ملغ وريدي اختباري (مشاركة أفيونيات شائعة — ترامادول خصوصاً)، شفط المجاري، مراقبة" } },
        SAMU,
      ],
    },
    pivots: [
      { sign: { fr: "Traumatisme crânien / plaie du cuir chevelu", ar: "رض جمجمي / جرح فروة" }, suspect: { fr: "Hématome sous-dural — TDM obligatoire", ar: "ورم دموي تحت الجافية — طبقي إلزامي" }, href: "/protocoles/traumatisme-cranien", label: { fr: "TC", ar: "رض دماغي" } },
      { sign: { fr: "Sueurs + tremblements + agitation à distance", ar: "تعرق + رعاش + هياج بعد حين" }, suspect: { fr: "Sevrage alcoolique débutant — CIWA", ar: "انسحاب كحولي بادئ — CIWA" }, href: "/protocoles/sevrage-alcoolique", label: { fr: "Sevrage", ar: "انسحاب" } },
    ],
  },

};

export const getReval = (id: string): Reval | undefined => revals[id];

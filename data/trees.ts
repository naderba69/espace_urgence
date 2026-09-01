// Arbres décisionnels interactifs — données déclaratives (voir components/trees/TreeRunner).
import type { Localized } from "@/data/types";

export type TreeNode =
  | { kind: "decision"; id: string; question: Localized; note?: Localized; yes: string; no: string }
  | { kind: "action"; id: string; title: Localized; steps: Localized[]; timerSec?: number; timerLabel?: Localized; next: string }
  | { kind: "end"; id: string; title: Localized; steps?: Localized[]; tone?: "ok" | "warn" | "info" };

export interface DecisionTree {
  id: string;
  title: Localized;
  description: Localized;
  icon: string;
  severity: "vital";
  start: string;
  nodes: Record<string, TreeNode>;
  sources: { label: string; url: string }[];
  lastReviewed: string;
}

const L = (fr: string, ar: string): Localized => ({ fr, ar });

// ────────────────────────────────────────────────────────────────────────────
// ACR adulte — AHA 2025 / ERC 2021
// ────────────────────────────────────────────────────────────────────────────
const acr: DecisionTree = {
  id: "acr",
  title: L("Arrêt cardiaque (adulte)", "توقف القلب (كهل)"),
  description: L(
    "Algorithme ACR interactif : rythmes choquables / non choquables, minuterie de cycle de 2 min, doses en direct.",
    "خوارزمية تفاعلية لتوقف القلب: إيقاعات جائزة للصعق/غير جائزة، مؤقت دورة دقيقتين، والجرعات مباشرة."
  ),
  icon: "Activity",
  severity: "vital",
  start: "start",
  lastReviewed: "2026-09-01",
  sources: [
    { label: "AHA 2025 — Adult Cardiac Arrest Algorithm", url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines" },
    { label: "ERC Guidelines 2021 — Adult Advanced Life Support", url: "https://www.erc.edu" },
  ],
  nodes: {
    start: {
      kind: "decision", id: "start",
      question: L("La victime est-elle inconsciente ET ne respire pas normalement (ou gasps) ?", "هل المصاب فاقد للوعي ولا يتنفس بشكل طبيعي (أو شهقات)؟"),
      note: L("Appelez SAMU 190 / annoncez le code bleu, demandez le DAE sans retarder la RCP.", "اتصل بـSAMU 190 / نادِ بالكود الأزرق واطلب DAE دون تأخير الإنعاش."),
      yes: "prep", no: "breathing",
    },
    prep: {
      kind: "action", id: "prep",
      title: L("⚙️ Organisation express (pendant que la RCP démarre)", "⚙️ تنظيم سريع (بالتوازي مع بدء الإنعاش)"),
      steps: [
        L("Chrono lancé — notez l'heure d'appel et le début RCP (figure dans le journal).", "المؤقّت انطلق — دوّن ساعة النداء وبداية الإنعاش (تظهر في السجل)."),
        L("Répartissez les rôles à voix haute : 1 compresseur, 1 respirateur, 1 défibrillateur/drogues, 1 leader.", "وزّع الأدوار بصوت عالٍ: ضاغط، منفِّس، صادم/أدوية، قائد."),
        L("Matériel posé : DAE (pads collés sans arrêter les compressions), BAVU+O₂, scope, VVP 16–18 G ×2, adrénaline prête en seringue étiquetée.", "العتاد جاهز: لاصقات DAE موضوعة دون إيقاف الضغطات، بالون+O₂، مراقب، خطان 16–18، أدرينالين في محقنة موسومة."),
        L("Sécurisez l'espace (place pour le tour de lit) ; recueillez : heure du collapsus, témoins (rythme initial ?), traitements.", "أمّن المكان (تجويف حول السرير)؛ اجمع: ساعة الانهيار، الشهود (الإيقاع الابتدائي؟)، الأدوية."),
      ],
      next: "cpr-cycle",
    },
    breathing: {
      kind: "decision", id: "breathing",
      question: L("Pouls central palpable en < 10 s ?", "هل يوجد نبض مركزي محسوس في أقل من 10 ثوانٍ؟"),
      note: L("Technique : 2 doigts sur le carotidien ou fémoral, MAX 10 secondes. En cas de doute → on considère l'arrêt et on masse (le massage inutile est moins dangereux qu'un retard).", "التقنية: إصبعان على السباتي أو الفخذي، 10 ثوانٍ كحد أقصى. عند الشك ← اعتبره توقفاً واضغط (الضغط غير اللازم أقل خطورة من التأخير)."),
      yes: "end-no-arrest", no: "cpr-cycle",
    },
    "cpr-cycle": {
      kind: "action", id: "cpr-cycle",
      title: L("RCP — cycle de 2 minutes (posez les VVP/tracez)", "إنعاش قلبي رئوي — دورة دقيقتين (ضع الخطوط/وسّم)"),
      steps: [
        L("Compressions 100–120/min, 5–6 cm, recul complet ; jambes relevées si aide seule.", "ضغطات 100–120/د، 5–6 سم؛ استرجاع كامل؛ ارفع الساقين إذا كنت وحيداً."),
        L("Ratio 30:2 sans VAS ; si sonde/masque laryngé : compressions continues + 10 insufflations/min.", "نسبة 30:2 بلا مجرى متقدم؛ مع ماسك حنجري/أنبوب: ضغطات مستمرة + 10 زفرات/د."),
        L("Voies d'abord : 2 VVP 16–18 G plis des coudes OU IO (tibia) ; flush 20 mL après chaque injection.", "خطوط: خطان وريديان 16–18 بثنايا المرفق أو IO (ظنبوب)؛ دفق 20 مل بعد كل حقنة."),
        L("Vérifiez la QUALITÉ : main pas levée = recul perdu, fréquence, EtCO2 cible > 10.", "افحص الجودة: يد لا تُرفع (استرجاع ضائع)، المعدل، EtCO2 > 10."),
      ],
      timerSec: 120,
      timerLabel: L("Cycle RCP 2 min", "دورة 2 د"),
      next: "check-rhythm",
    },
    "check-rhythm": {
      kind: "decision", id: "check-rhythm",
      question: L("Rythme CHOQUABLE (FV ou TV sans pouls) ?", "هل الإيقاع جائز للصعق (رجفان بطيني أو تسرع بطيني بلا نبض)؟"),
      yes: "shock", no: "nonshockable",
    },
    shock: {
      kind: "action", id: "shock",
      title: L("⚡ CHOC — RCP 2 min", "⚡ صعق — إنعاش دقيقتين"),
      steps: [
        L("Choc biphasique 120–200 J (selon défibrillateur, sinon dose maximale). Reprendre les compressions immédiatement, sans reprendre le pouls.", "صعقة ثنائية الطور 120–200 جول (بحسب الجهاز، وإلا أقصى جرعة). استأنف الضغطات فوراً دون جس النبض."),
      ],
      timerSec: 120,
      timerLabel: L("RCP 2 min post-choc", "إنعاش دقيقتان بعد الصعق"),
      next: "post-shock",
    },
    "post-shock": {
      kind: "decision", id: "post-shock",
      question: L("Rythme encore choquable ?", "هل الإيقاع ما زال جائزاً للصعق؟"),
      yes: "shock-epi", no: "rosc-check",
    },
    "shock-epi": {
      kind: "action", id: "shock-epi",
      title: L("⚡ CHOC + adrénaline — RCP 2 min", "⚡ صعق + أدرينالين — إنعاش دقيقتين"),
      steps: [
        L("⚡ Choc (200 J ou max). Reprendre la RCP immédiatement.", "⚡ صعقة (200 جول أو الحد الأقصى). استأنف الإنعاش فوراً."),
        L("💉 Adrénaline 1 mg IV/IO (après le 3ᵉ choc en choquable).", "💉 أدرينالين 1 ملغ وريدي/عظمي (بعد الصعقة الثالثة)."),
      ],
      timerSec: 120,
      timerLabel: L("RCP 2 min", "إنعاش دقيقتان"),
      next: "post-shock2",
    },
    "post-shock2": {
      kind: "decision", id: "post-shock2",
      question: L("Rythme encore choquable ?", "هل الإيقاع ما زال جائزاً للصعق؟"),
      yes: "shock-amio", no: "rosc-check",
    },
    "shock-amio": {
      kind: "action", id: "shock-amio",
      title: L("⚡ CHOC + amiodarone — RCP 2 min", "⚡ صعق + أميودارون — إنعاش دقيقتين"),
      steps: [
        L("⚡ Choc (200 J ou max).", "⚡ صعقة (200 جول أو الحد الأقصى)."),
        L("💉 Adrénaline 1 mg IV/IO si ≥ 3 min depuis la dernière (puis toutes les 3–5 min).", "💉 أدرينالين 1 ملغ إذا مرت ≥ 3 دقائق على السابقة (ثم كل 3–5 دقائق)."),
        L("💉 Amiodarone 300 mg IV (1ʳᵉ dose : 3ᵉ choc ; 150 mg au 5ᵉ choc).", "💉 أميودارون 300 ملغ وريدي (بعد 3 صعقات)؛ 150 ملغ بعد الصعقة الخامسة."),
      ],
      timerSec: 120,
      timerLabel: L("RCP 2 min", "إنعاش دقيقتان"),
      next: "post-shock-loop",
    },
    "post-shock-loop": {
      kind: "decision", id: "post-shock-loop",
      question: L("Rythme encore choquable ?", "هل الإيقاع ما زال جائزاً للصعق؟"),
      yes: "shock-amio", no: "rosc-check",
    },
    nonshockable: {
      kind: "action", id: "nonshockable",
      title: L("RCP — adrénaline IMMÉDIATE", "إنعاش — أدرينالين فوري"),
      steps: [
        L("PAS d'électrochoc (AGPE/asystolie). Reprendre les compressions immédiatement.", "لا صعق (نشاط كهربائي بلا نبض/خمل). استأنف الضغطات فوراً."),
        L("💉 Adrénaline 1 mg IV/IO dès que possible, puis toutes les 3–5 min.", "💉 أدرينالين 1 ملغ وريدي/عظمي في أقرب وقت، ثم كل 3–5 دقائق."),
      ],
      timerSec: 120,
      timerLabel: L("RCP 2 min", "إنعاش دقيقتان"),
      next: "causes",
    },
    causes: {
      kind: "decision", id: "causes",
      question: L("Signes de ROSC (reprise activité circulatoire) sur ce cycle ?", "هل هناك علامات استعادة الدورة الدموية في هذه الدورة؟"),
      note: L("Signes : pouls spontané, EtCO2 > 40, sortie d'asystolie, mouvements volontaires, haleine.", "علامات: نبض تلقائي، EtCO2 > 40، خروج من الخمل، حركات إرادية، نهمة."),
      yes: "rosc", no: "reversibles",
    },
    reversibles: {
      kind: "action", id: "reversibles",
      title: L("🔍 Chasse systématique aux causes réversibles (4H/4T)", "🔍 بحث منهجي عن الأسباب العكوسة (4H/4T)"),
      steps: [
        L("HYPOXIE : vérifiez sonde/canal + O₂ 100 % + auscultation bilatérale.", "نقص الأكسجة: افحص أنبوب/قناع + O₂ 100% + إصغاء ثنائي."),
        L("HYPOVOLÉMIE : remplissage 2 L rapides (saignement externe, hémorragie digestive, rupture AA ?, grossesse ?).", "نقص الحجم: توسيع 2 ل سريعين (نزيف ظاهر، نزف هضمي، تمدد أبهر؟، حمل؟)."),
        L("Hypo/HyperKALIÉMIE : gazométrie rapide. HyperK → calcium gluconate 10 mL + insuline/glucose.", "خلل البوتاسيوم: غازات سريعة. فرط K ← كالسيوم 10 مل + إنسولين/جلوكوز."),
        L("HYPOTHERMIE : réchauffer ; ne pas arrêter RCP pour froid.", "نقص الحرارة: سخّف؛ لا توقف الإنعاش للبرودة."),
        L("TAMPONNADE : péricardocentèse à l'aiguille si suspicion (traumatisme thoracique, recent MI).", "الدكاك: بزل خارج القلب بالإبرة عند الشك (رض صدري، احتشاء حديث)."),
        L("TOXIQUES : opioïdes → naloxone 0,4 mg IV bolo (pas de gain massif) ; BZD (flumazénil) si suspicion.", "سموم: أفيونات ← نالوكسون 0.4 ملغ؛ BZD ← فلومازينيل عند الشك."),
        L("THROMBOSE coronaire : persévérer, tenir pour cath-lab (évoquer l'EP si présentation compatible).", "خثرة تاجية: ثابر؛ قسطرة إن أمكن (اشتبه الصمة إن السياق)."),
        L("pneumothorax sous TENSION : décompression (4ᵉEIC) sous scope sauf si déjà fait.", "استرواح ضاغط: بزل بالمسافة الرابعة إلا إن تم."),
      ],
      next: "check-rhythm",
    },
    "rosc-check": {
      kind: "decision", id: "rosc-check",
      question: L("ROSC (pouls organisé, ETCO₂ ≥ 40 mmHg, signes de vie) ?", "استعادة الدورة الدموية (نبض منظم، ETCO₂ ≥ 40، علامات حياة)؟"),
      yes: "rosc", no: "cpr-cycle",
    },
    rosc: {
      kind: "end", id: "rosc",
      title: L("✅ ROSC — conduite post-arrêt immédiate", "✅ استعادة الدورة — تدبير ما بعد التوقف الفوري"),
      tone: "ok",
      steps: [
        L("Cibles hémodynamiques : PAM 65–75 mmHg (PAS 100–110) ; noradrénaline PSE titrée ; pas de bolus de remplissage brutaux.", "أهداف الدورة: متوسط 65–75 (انقباضي 100–110)؛ نورأدرينالين معاير؛ بلا دفعات تعويض عنيفة."),
        L("Cibles respiratoires : SpO₂ 94–98 % (stopper l'HDF si SpO₂ = 100 %), EtCO2 30–35, FR contrôlée.", "أهداف التنفس: SpO₂ 94–98% (أوقف التدفق العالي إذا 100%)، EtCO2 30–35."),
        L("ECG 12 dérivations immédiat → PCI urgence si STEMI même sous sédation.", "ECG 12 فوراً ← قسطرة مستعجلة إذا STEMI ولو تحت التخدير."),
        L("Si comateux : TTM (température cible 32–37,5 °C maintenue 24 h), pas d'antiépileptiques systématiques, corticoïdes non indiqués.", "إذا مذنب: TTM 32–37.5° لمدة 24 س؛ بلا مضادات صرع وقائية ولا كورتيكويدات."),
        L("Glycémie : traiter si > 1,8 g/L (sans hypoglycémie) ; bilan complet ions/lactate/troponine.", "السكر: عالج إذا > 1.8 غ/ل (دون إنزال حاد)؛ فحص شوارد/لاكتات/تروبونين."),
        L("Ne pas débrancher le scope : risque de ré-ACR élevé dans les premières minutes ; CCP à préparer.", "لا تفصل المراقب: خطر إعادة التوقف عالٍ في الدقائق الأولى؛ جهّز ضاغطاً آلياً إن وجد."),
        L("Régulation 190 + rapport SBAR complet pour la réanimation ; journal de la séance ci-dessous = pièce du dossier.", "تنظيم 190 + تقرير SBAR كامل للعناية؛ سجل الجلسة أدناه = جزء من الملف."),
      ],
    },
    "end-no-arrest": {
      kind: "end", id: "end-no-arrest",
      title: L("Pas d'arrêt cardiaque confirmé", "لا يوجد توقف قلب مؤكد"),
      tone: "info",
      steps: [
        L("Si inconscient mais respire : PLS, liberté des VA, surveillance rapprochée.", "إذا فاقد للوعي لكنه يتنفس: وضعية الأمان الجانبية، تحرير المجاري الهوائية، مراقبة لصيقة."),
        L("Rechercher la cause : hypoglycémie, AVC, intoxication, traumatisme…", "ابحث عن السبب: نقص سكر الدم، جلطة، تسمم، رض..."),
      ],
    },
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Anaphylaxie — RCUK 2021
// ────────────────────────────────────────────────────────────────────────────
const anaphylaxie: DecisionTree = {
  id: "anaphylaxie",
  title: L("Anaphylaxie", "التأق"),
  description: L(
    "Adrénaline IM immédiate selon l'âge, réévaluation toutes les 5 min, choc réfractaire.",
    "أدرينالين عضلي فوري حسب العمر، إعادة تقييم كل 5 دقائق، والصدمة المقاومة."
  ),
  icon: "AlertTriangle",
  severity: "vital",
  start: "start",
  lastReviewed: "2026-09-01",
  sources: [
    { label: "RCUK — Emergency treatment of anaphylaxis 2021", url: "https://www.resus.org.uk" },
  ],
  nodes: {
    start: {
      kind: "decision", id: "start",
      question: L("Réaction allergique + atteinte sévère : voie aérienne, respiration OU circulation (chute TA, collapsus) ?", "تفاعل أرجي + إصابة شديدة: مجرى هوائي، تنفس أو دورة (هبوط الضغط، انهيار)؟"),
      yes: "adr-im", no: "mild",
    },
    mild: {
      kind: "end", id: "mild",
      title: L("Réaction légère–modérée", "تفاعل خفيف–متوسط"),
      tone: "info",
      steps: [
        L("Antihistaminique ± corticoïdes, surveillance 6 h.", "مضاد هيستامين ± كورتيكويدات، مراقبة 6 ساعات."),
        L("Si aggravation (dyspnée, stridor, hypotension) → adrénaline IM immédiate.", "عند التدهور (زلة تنفسية، صرير، هبوط ضغط) ← أدرينالين عضلي فوري."),
      ],
    },
    "adr-im": {
      kind: "action", id: "adr-im",
      title: L("💉 Adrénaline IM — 1/1000 — MAINTENANT (ne perdez pas de temps)", "💉 أدرينالين عضلي — 1/1000 — الآن (لا تضيّع الوقت)"),
      steps: [
        L("Adulte / > 12 ans : 500 µg (0,5 mL) — face antéro-latérale de cuisse, à travers le vêtement si nécessaire.", "كهل / >12 سنة: 500 مكغ (0.5 مل) — الوجه الأمامي الوحشي للفخذ، عبر الثوب إن لزم."),
        L("Seringue 1 mL (tuberculoïde) graduée : la dose exacte compte (500 µg ≠ 1 mg !).", "محقنة 1 مل معايرة: الجرعة الدقيقة مهمة (500 مكغ ≠ 1 ملغ!)."),
        L("6–12 ans : 300 µg · 6 mois–6 ans : 150 µg · < 6 mois : 100–150 µg.", "6–12 سنة: 300 مكغ · 6 أشهر–6 سنوات: 150 مكغ · <6 أشهر: 100–150 مكغ."),
        L("NB : c'est de l'IM, PAS de l'IV — l'IV est réservée à la réa (arrêt, choc profond).", "ملاحظة: عضلي وليس وريدي — الوريدي للعناية فقط."),
        L("Retirer l'allergène (patch, injection), position allongée jambes relevées, O₂ HDF.", "أزل المسبب (لصقة، حقنة)، استلقِ مع رفع الساقين، أكسجين عالي التدفق."),
      ],
      next: "support",
    },
    support: {
      kind: "action", id: "support",
      title: L("Mesures associées immédiates (pendant l'adrénaline)", "التدابير المرافقة الفورية (أثناء الأدرينالين)"),
      steps: [
        L("2 VVP 16–18 G → NaCl 0,9 % : adulte 10–20 mL/kg bolus, enfant 10–20 mL/kg, réévaluer.", "خطّان وريديان 16–18 ← NaCl 0.9%: كهل 10–20 مل/كغ دفعة، أعد التقييم."),
        L("Si dyspnée/stridor : aérosol adrénaline 5 mg nébulisée ; préparer intubation difficile (œdème laryngé prob) — ne pas forcer l'arytémie si possible.", "عند ضيق/صرير: رذاذ أدرينالين 5 ملغ؛ جهّز تنبيب صعب (وذمة حنجرية محتملة)."),
        L("Si choc majeur persistant : hémodilution ? transfusion ? avis réa dès maintenant.", "عند صدمة كبرى مستمرة: استشارة العناية الآن."),
        L("Stopper ABSOLUMENT l'administration du suspect (sérum, ATB, anesthésiant), étiqueter l'heure/dose donnée.", "أوقف المشتبه إطلاقاً، ووسّم الساعة والجرعة المُعطاة."),
      ],
      timerSec: 300,
      timerLabel: L("Réévaluation après adrénaline (5 min — effet maximal)", "إعادة التقييم بعد الأدرينالين (5 د — ذروة المفعول)"),
      next: "reassess",
    },
    reassess: {
      kind: "decision", id: "reassess",
      question: L("Amélioration après 5 min ?", "هل حصل تحسن بعد 5 دقائق؟"),
      yes: "monitor", no: "repeat-adr",
    },
    "repeat-adr": {
      kind: "decision", id: "repeat-adr",
      question: L("Choc persistant malgré une 2ᵉ dose IM ?", "هل الصدمة مستمرة رغم جرعة عضلية ثانية؟"),
      note: L("Répéter l'adrénaline IM 500 µg toutes les 5 min (2ᵉ dose = refaire adr-im).", "كرر الأدرينالين العضلي كل 5 دقائق."),
      yes: "refractory", no: "adr-im",
    },
    refractory: {
      kind: "action", id: "refractory",
      title: L("🚨 Anaphylaxie RÉFRACTAIRE (≥ 2 doses IM sans succès)", "🚨 تأق مقاوم (جرعتان عضليتان دون جدوى)"),
      steps: [
        L("Adrénaline IV : titration par aliquotes 20–50 µg (milieu médicalisé) OU PSE 0,05–0,3 µg/kg/min.", "أدرينالين وريدي: معايرة 20–50 مكغ (بمراقبة) أو مضخة 0.05–0.3 مكغ/كغ/د."),
        L("Héros critique : si le patient prend des bêta-bloquants → GLUCAGON 1–2 mg IV.", "مفتاح حاسم: إذا يتناول حاصرات بيتا ← غلوكاغون 1–2 ملغ وريدي."),
        L("Remplissage 20 mL/kg ; si enceinte : décubitus latéral gauche.", "تعويض 20 مل/كغ؛ الحامل: وضعية جانبية يسرى."),
        L("Bronchospasme persistant : salbutamol 5 mg nébulisé continu ; préparation intubation (risque œdème).", "تشمع مستمر: سالبوتامول 5 ملغ؛ تجهيز التنبيب."),
      ],
      next: "monitor",
    },
    monitor: {
      kind: "end", id: "monitor",
      title: L("Surveillance — ne pas lâcher trop tôt", "المراقبة — لا تُفرج مبكراً"),
      tone: "ok",
      steps: [
        L("Biphasic : garder 12–24 h (48 h si sévère) — rechute sans nouvel allergène possible.", "ثنائي الطور: احتفظ 12–24 س (48 إن شديد) — العودة دون مسبب جديد."),
        L("Prescrire stylo auto-injecteur + fiche d'allergie + consultation allergologique (lettre au médecin traitant).", "وصف قلم أدرينالين + بطاقة حساسية + استشارة أرجية."),
        L("Documentation : produit suspect, heure, dose, voie → pharmacovigilance.", "وثّق: المنتج المشتبه، الساعة، الجرعة، الطريق → التيقظ الدوائي."),
      ],
    },
  },
};

// ────────────────────────────────────────────────────────────────────────────
// État de mal épileptique
// ────────────────────────────────────────────────────────────────────────────
const etatMal: DecisionTree = {
  id: "etat-mal",
  title: L("État de mal épileptique", "الحالة الصرعية المستمرة"),
  description: L(
    "Minuterie stricte : 0–5 min stabilisation, 5–20 min benzodiazépine, >20 min LEV, >40 min sédation.",
    "مؤقت صارم: 0–5 د استقرار، 5–20 د بنزوديازيبين، >20 د ليفيتيراسيتام، >40 د تهدئة وتنبيب."
  ),
  icon: "Brain",
  severity: "vital",
  start: "start",
  lastReviewed: "2026-09-01",
  sources: [
    { label: "SFU / EAN guidelines — Status epilepticus", url: "https://www.sfmu.org" },
  ],
  nodes: {
    start: {
      kind: "decision", id: "start",
      question: L("Crise convulsive généralisée en cours ≥ 5 minutes ?", "هل هناك نوبة معممة مستمرة منذ 5 دقائق أو أكثر؟"),
      note: L("Chronométrez depuis le DÉBUT de la crise. 5 min = seuil de l'état de mal.", "احسب الوقت من بداية النوبة. 5 دقائق = عتبة الحالة الصرعية."),
      yes: "phase1", no: "watch",
    },
    watch: {
      kind: "end", id: "watch",
      title: L("Observer — à considérer", "المراقبة — النقاط"),
      tone: "info",
      steps: [
        L("Surveiller, libérer les VA, PLS, glycémie capillaire.", "راقب، حرر المجاري الهوائية، وضعية جانبية، قياس سكر الشعري."),
        L("Rechercher la cause (hypoglycémie, hyponatrémie, arrêt des TAE, alcool).", "ابحث عن السبب: نقص سكر الدم، نقص الصوديوم، إيقاف الأدوية، الكحول."),
      ],
    },
    phase1: {
      kind: "action", id: "phase1",
      title: L("Phase 1 (0–5 min) — Stabiliser en parallèle", "المرحلة 1 (0–5 د) — تثبيت بالتوازي"),
      steps: [
        L("Position latérale + désobstruction (aspiration si besoin) — NE RIEN mettre en bouche.", "وضعية جانبية + فتح المجرى (شفط) — لا شيء في الفم."),
        L("O₂ masque 15 L/min + SpO₂ cible 94–98 % ; scope + TA + glycémie capillaire IMMÉDIATE.", "أكسجين 15 ل/د + تشبع 94–98%؛ مراقب + ضغط + سكر شعري فوراً."),
        L("Si glycémie < 0,8 g/L → G30 1 ampoule IV (adulte), glycémie contrôle à 10 min.", "إذا السكر < 0.8 غ/ل ← G30 أمبولة، ثم ضبط بعد 10 د."),
        L("VVP 18–20G + bilan (ions, NFS, toxiques si possible) — notez l'heure de DÉBUT de la crise.", "خط وريدي + فحوص — دوّن ساعة بداية التشنج."),
      ],
      timerSec: 300,
      timerLabel: L("5 min — stabilisation", "5 د — التثبيت"),
      next: "bzd",
    },
    bzd: {
      kind: "action", id: "bzd",
      title: L("💉 Benzodiazépine (5–20 min) — ne pas différer", "💉 بنزوديازيبين (5–20 د) — بلا تأخير"),
      steps: [
        L("Midazolam 10 mg IM (adulte ≥ 40 kg) — face antéro-latérale cuisse, effet 5–10 min.", "ميدازولام 10 ملغ عضلي (≥40 كغ) — الفخذ الأمامي، مفعول 5–10 د."),
        L("OU diazépam 10 mg IV lent (2 min) si voie + étiquette !", "أو ديازيبام 10 ملغ وريدي بطيء (دقيقتان) إذا خط متاح."),
        L("Enfant : midazolam 0,2 mg/kg IM (max 10 mg) ou diazépam 0,5 mg/kg IR.", "طفل: ميدازولام 0.2 ملغ/كغ عضلي أو ديازيبام 0.5 ملغ/كغ شرجي."),
        L("⚠️ Respiration : surveiller FR/SpO₂ post-BZD (dépression possible).", "⚠️ راقب التنفس بعد الجرعة (اكتئاب تنفسي ممكن)."),
      ],
      next: "check20",
    },
    check20: {
      kind: "decision", id: "check20",
      question: L("Crise persistante 5 min après BZD ?", "هل النوبة مستمرة بعد 5 دقائق من البنزوديازيبين؟"),
      yes: "bzd2", no: "monitor",
    },
    bzd2: {
      kind: "action", id: "bzd2",
      title: L("2ᵉ dose BZD", "الجرعة الثانية من البنزوديازيبين"),
      steps: [
        L("Une seule répétition : Midazolam 10 mg IM ou diazépam 10 mg IV.", "تكرار واحد فقط: ميدازولام 10 ملغ عضلي أو ديازيبام 10 ملغ وريدي."),
      ],
      timerSec: 300,
      timerLabel: L("5 min post-répétition", "5 د بعد التكرار"),
      next: "check20b",
    },
    check20b: {
      kind: "decision", id: "check20b",
      question: L("Persistance (état de mal confirmé) ?", "هل استمرت النوبة (حالة صرعية مؤكدة)؟"),
      yes: "lev", no: "monitor",
    },
    lev: {
      kind: "action", id: "lev",
      title: L("💉 Antiépileptique de fond (20–40 min)", "💉 مضاد صرعي أساسي (20–40 د)"),
      steps: [
        L("Lévétiracétam 60 mg/kg IV sur 15 min (max 4,5 g).", "ليفيتيراسيتام 60 ملغ/كغ وريدي على 15 د (أقصى 4.5 غ)."),
        L("Alternative : valproate 40 mg/kg (max 3 g) ou phénytoïne 20 mg/kg (attention au rythme).", "بديل: فالبروات 40 ملغ/كغ (أقصى 3 غ) أو فينيتوين 20 ملغ/كغ (انتبه للإيقاع)."),
      ],
      timerSec: 900,
      timerLabel: L("Perfusion LEV 15 min", "تسريب ليفيتيراسيتام 15 د"),
      next: "check40",
    },
    check40: {
      kind: "decision", id: "check40",
      question: L("Crise persistante à la fin de la perfusion ?", "هل استمرت النوبة بنهاية التسريب؟"),
      yes: "sed", no: "monitor",
    },
    sed: {
      kind: "end", id: "sed",
      title: L("🚨 Sédation + intubation en urgence", "🚨 تهدئة + تنبيب إلحاحي"),
      tone: "warn",
      steps: [
        L("Sédation continue (midazolam 0,2 mg/kg bolus puis PSE, ou propofol) + intubation protégée.", "تهدئة مستمرة (ميدازولام bolus ثم مضخة، أو بروبوفول) + تنبيب محمي."),
        L("EEG en continu si possible, transfert réanimation sur priorité absolue (190).", "تخطيط EEG متواصل إن أمكن، نقل أولوية قصوى للعناية المركزة (190)."),
      ],
    },
    monitor: {
      kind: "end", id: "monitor",
      title: L("✅ Crise contrôlée — bilan", "✅ النوبة تحت السيطرة — تقييم"),
      tone: "ok",
      steps: [
        L("Rechercher et traiter la cause (glycémie, iono, scanner cérébral, ponction lombaire si infection).", "ابحث وعالج السبب (سكر، شوارد، مفراس، بزل قطني إذا عدوى)."),
        L("Hospitalisation + avis neurologique ; ne pas arrêter brutalement le traitement de fond.", "استشفاء + استشارة عصبية؛ لا توقف العلاج الأساسي فجأة."),
      ],
    },
  },
};

// ────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
// Choc septique — Surviving Sepsis Campaign (hour-1 bundle)
// ────────────────────────────────────────────────────────────────────────────
const sepsis: DecisionTree = {
  id: "choc-septique",
  title: L("Sepsis sévère / choc septique", "الإنتان الشديد / الصدمة الإنتانية"),
  description: L(
    "Bundle de la 1ʳᵉ heure chronométré : lactates, hémocultures, antibiothérapie < 1 h, remplissage 30 mL/kg, noradrénaline.",
    "حزمة الساعة الأولى الموقوتة: اللكتات، زراعة الدم، مضادات حيوية خلال ساعة، تعويض 30 مل/كغ، نورأدرينالين."
  ),
  icon: "Droplets",
  severity: "vital",
  start: "start",
  lastReviewed: "2026-09-01",
  sources: [
    { label: "Surviving Sepsis Campaign 2021 (SCCM/ESICM)", url: "https://sccm.org/survivingsepsiscampaign" },
  ],
  nodes: {
    start: {
      kind: "decision", id: "start",
      question: L("Infection suspectée + dysfonction d'organe (SOFA ≥ 2 : hypotension, confusion, tachypnée > 22, SpO₂ basse) ?", "عدوى مشتبهة + قصور عضوي (SOFA ≥ 2: هبوط ضغط، ارتباك، تسرع تنفس > 22)؟"),
      note: L("qSOFA (2/3) : FR ≥ 22, GCS < 15, PAS ≤ 100 → ALERTE sepsis.", "qSOFA (2/3): تسرع تنفس ≥ 22، غلاسكو < 15، ضغط انقباضي ≤ 100 ← إنذار إنتان."),
      yes: "hour1", no: "no-sepsis",
    },
    "no-sepsis": {
      kind: "end", id: "no-sepsis",
      title: L("Pas de critère de gravité immédiat", "لا توجد علامات خطورة فورية"),
      tone: "info",
      steps: [
        L("Surveiller et traiter la suspicion infectieuse selon le contexte. Réévaluer le qSOFA à la moindre dégradation.", "راقب وعالج الاشتباه العدوائي حسب السياق. أعد تقييم qSOFA عند أي تدهور."),
      ],
    },
    hour1: {
      kind: "action", id: "hour1",
      title: L("⏱ H0 — « Bundle de la 1ʳᵉ heure » (tout en parallèle)", "⏱ H0 — حزمة الساعة الأولى (كلها بالتوازي)"),
      steps: [
        L("Lactates artériels/capillaires IMMÉDIATS (repère H0 ; ≥ 2 mmol/L = dysfonction).", "لاكتات فوري (مرجع H0؛ ≥ 2 = قصور عضوي)."),
        L("Hémocultures ×2 AVANT antibiotiques (sans les retarder) + prélèvement du foyer suspect (ECBU, ponction...).", "زراعتا دم قبل المضادات (بلا تأخير) + مزرعة البؤرة."),
        L("💉 ANTIBIOTHÉRAPIE CIBLE < 1 H : selon suspicion (mémo kit : CTX 2 g + amikacine choc si point d'appel sévère).", "💉 مضادات خلال ساعة حسب البؤرة."),
        L("Si PAS < 90 (ou lactate ≥ 4 mmol/L) : NaCl 0,9 % 30 mL/kg RAPIDE en bolus de 500 mL, réévaluer après chaque bolus.", "إذا انقباضي < 90 أو لاكتات ≥ 4: NaCl 30 مل/كغ دفعات 500 مل مع إعادة تقييم."),
        L("O₂ : SpO₂ cible ≥ 94 % ; ECG en continu (ischémie possible).", "أكسجين: هدف ≥ 94%؛ ECG مستمر."),
        L("Sonde urinaire + horodatage de la diurèse (cible ≥ 0,5 mL/kg/h).", "قسطرة بولية + توقيت التحبور (هدف ≥ 0.5 مل/كغ/س)."),
      ],
      timerSec: 3600,
      timerLabel: L("Bundle < 60 min — chrono visible", "الحزمة < 60 د — العد ظاهر"),
      next: "map-check",
    },
    "map-check": {
      kind: "decision", id: "map-check",
      question: L("Après 30 mL/kg : PAM ≥ 65 mmHg ?", "بعد 30 مل/كغ: هل الضغط المتوسط ≥ 65؟"),
      note: L("PAM = PAS/3 + 2×PAD/3. Pas de ligne artérielle ? Prenez la tension en continu et checkez perfusion mentale (pas d'agitation, marbrures régressent).", "الضغط المتوسط = انقباضي/3 + انبساطي×2/3. بلا خط شرياني؟ راقب التروية العقلية والتبرقش."),
      yes: "stabilized", no: "check-echo",
    },
    "check-echo": {
      kind: "decision", id: "check-echo",
      question: L("Signes de surcharge (crépitants, OAP) ou de fuite persistante ?", "علامات فرط حجم (خراخر، وذمة) أو تسرب مستمر؟"),
      yes: "norad", no: "more-fluids",
    },
    "more-fluids": {
      kind: "action", id: "more-fluids",
      title: L("Encore du volume (max 40 mL/kg au total)", "مزيد من السوائل (أقصى 40 مل/كغ إجمالاً)"),
      steps: [
        L("Bolus supplémentaire 500 mL, minuté, réévaluez après chaque bolus (uriner + Pouls + respiration qui ne s'accélère pas).", "دفعة 500 مل إضافية بتوقيت، وأعد التقييم بعد كل دفعة."),
        L("⚠️ Au-delà : risque de surcharge hydrique → passer à la noradrénaline tôt.", "⚠️ فوق ذلك: خطر فرط الحجم ← ابدأ النورأدرينالين مبكراً."),
      ],
      timerSec: 600,
      timerLabel: L("Bolus 500 mL", "دفعة 500 مل"),
      next: "map-check",
    },
    norad: {
      kind: "action", id: "norad",
      title: L("💉 Noradrénaline — ne pas attendre le lit de réa", "💉 نورأدرينالين — لا تنتظر سرير العناية"),
      steps: [
        L("Démarrez à 0,05–0,1 µg/kg/min puis titrez à la PAM 65 (monter de 0,05 etp).", "ابدأ 0.05–0.1 مكغ/كغ/د ثم عايِر إلى متوسط 65."),
        L("Utilisez le calculateur amines pour la concentration/les paliers prêts à l'emploi.", "استعمل حاسبة الأمينات للتركيز والدرجات الجاهزة."),
        L("2 points de VVP sûrs/centraux idéalement ; surveillance TA continue toute 2–3 min.", "خطّان وريديان آمنان/مركزيان؛ ضغط كل 2–3 د."),
        L("50 μg de bolus possible (ex. PSE échec) : pruéper 20 µg/mL.", "دفعة 50 مكغ ممكنة: حضّر 20 مكغ/مل."),
      ],
      next: "stabilized-with-na",
    },
    "stabilized-with-na": {
      kind: "decision", id: "stabilized-with-na",
      question: L("PAM ≥ 65 sur noradrénaline ?", "هل الضغط المتوسط ≥ 65 تحت النورأدرينالين؟"),
      yes: "stabilized", no: "refractory",
    },
    stabilized: {
      kind: "end", id: "stabilized",
      title: L("✅ Stabilisé — poursuite", "✅ مستقر — المتابعة"),
      tone: "ok",
      steps: [
        L("Répéter LACTATES à H3–H4 (cible normalisation).", "أعد قياس اللكتات عند H3–H4 (الهدف التطبيع)."),
        L("Bilan étiologique (ECBU, Rx/thorax, etc.), adapters les antibiotiques aux hémocultures.", "تقييم سببي (ECBU، صورة صدر...)، تكييف المضادات مع الزراعات."),
        L("Hospitalisation USI réanimation urgente — signalement médecin (190).", "استشفاء عاجل في العناية المركزة — إبلاغ الطبيب (190)."),
      ],
    },
    refractory: {
      kind: "end", id: "refractory",
      title: L("🚨 Choc septique RÉFRACTAIRE", "🚨 صدمة إنتانية مقاومة"),
      tone: "warn",
      steps: [
        L("Surcritère : hydrocortisone 200 mg/j IV (SI ADRESSE > 90 min pour stabiliser).", "هرمون قشر كظر: هيدروكورتيزون 200 ملغ/يوم (إذا تطلب التثبيت > 90 دقيقة)."),
        L("Si ANC persistante : examen cardiocomprimé/discussion vasopressine, drainage du foyer infectieux URGENT.", "إذا استمرت: مناقشة فازوبريسين، وتصريف البؤرة العدوائية عاجلاً."),
        L("Centre régulateur 190 immédiat — transfert critique avec médicalisation.", "الاتصال بالمُنظّم 190 فوراً — نقل حرج بمرافقة طبية."),
      ],
    },
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Douleur thoracique — suspicion SCA (STEMI/NSTE-ACS orienté préhospitalier)
// ────────────────────────────────────────────────────────────────────────────
const douleurThorax: DecisionTree = {
  id: "douleur-thoracique",
  title: L("Douleur thoracique → SCA ?", "ألم صدري ← SCA؟"),
  description: L(
    "Orientation rapide d'une douleur thoracique suspecte : ECG < 10 min, STEMI → régulation 190 / PCI < 120 min.",
    "فرز سريع لألم صدري مشبوه: ECG خلال 10 دقائق، STEMI ← تنظيم 190 / قسطرة < 120 دقيقة."
  ),
  icon: "Activity",
  severity: "vital",
  start: "start",
  lastReviewed: "2026-09-01",
  sources: [
    { label: "ESC Guidelines 2023 — Acute Coronary Syndromes", url: "https://www.escardio.org" },
  ],
  nodes: {
    start: {
      kind: "decision", id: "start",
      question: L("Douleur thoracique suspecte + détresse IMMÉDIATE (choc, arythmie majeure, OAP, syncope) ?", "ألم صدري مشتبه + ضائقة فورية (صدمة، اضطراب نظم، وذمة رئوية، إغماء)؟"),
      yes: "distressed", no: "ecg10",
    },
    distressed: {
      kind: "action", id: "distressed",
      title: L("🚨 Stabiliser AVANT ECG", "🚨 ثبّت قبل ECG"),
      steps: [
        L("A-B-C-D-E ; si choc arythmie majeure : traitement spécifique immédiat (massage, cardioversion, atropine).", "تقييم ABCDE؛ إذا كان اضطراب نظم حرج: العلاج النوعي الفوري (تدليك، صدمة، أتروبين)."),
        L("Monitorage continu + VVP + O₂ seulement si SpO₂ < 94 %.", "مراقبة مستمرة + خط وريدي + أكسجين فقط إذا SpO₂ < 94%."),
      ],
      next: "ecg10",
    },
    ecg10: {
      kind: "action", id: "ecg10",
      title: L("📋 ECG 12 dérivations < 10 min", "📋 ECG 12 استنتاجاً خلال 10 دقائق"),
      steps: [
        L("ECG complet : non pas 6 mais 12 dérivations ; si territoire postérieur (+VD), ajouter V7–V9 + V3R–V4R.", "ECG كامل 12 استنتاجاً؛ إذا اشتباه خلفي أو بطين أيمن أضف V7–V9 وV3R–V4R."),
        L("Prélever dès maintenant (sans attendre le résultat) : troponine hs à H0/H3, NFS, iono, INR si AVK.", "اسحب فوراً دون انتظار: تروبونين H0/H3، NFS، شوارد، INR."),
        L("Aspirine 250–500 mg à CROQUER immédiatement sauf allergie vraie/HD active.", "أسبرين 250–500 ملغ تُمضغ فوراً إلا بحساسية صحيحة أو نزف نشط."),
        L("Pendant l'ECG : vérifier TA aux deux bras, pouls, auscultation pulmonaire (OAP = gravité).", "أثناء ECG: اجس النبض، اسمع الرئة (وذمة = خطورة)."),
      ],
      timerSec: 600,
      timerLabel: L("ECG < 10 min", "ECG خلال 10 دقائق"),
      next: "stemi",
    },
    stemi: {
      kind: "decision", id: "stemi",
      question: L("STEMI (sus-décalage ST ≥ 1 mm dans 2 contiguës, ou BBG nouveau avec clinique) ?", "STEMI (ارتفاع ST ≥ 1 مم في استنتاجين متجاورين، أو BBG جديد مع أعراض)؟"),
      yes: "stemi90", no: "nste",
    },
    stemi90: {
      kind: "action", id: "stemi90",
      title: L("❤️ STEMI → PCI < 120 min", "❤️ STEMI ← قسطرة أولية < 120 دقيقة"),
      steps: [
        L("RÉGULATION SAMU/CENTRE PCI (190) IMMÉDIATEMENT — temps-ECG → ballon < 120 min.", "الاتصال بالمنظم (190) فوراً — هدف ECG ← بالون < 120 دقيقة."),
        L("Préavis cardiologie : NE PAS perdre de temps en imagerie/ttt retardable.", "إخطار القلبية: لا تضيع الوقت في تصوير/علاج مؤجل."),
        L("Morphine 2–4 mg IV titration si douleur résistante ; Clopidogrel 300 mg OU ticagrélor si PCI programmé.", "مورفين 2–4 ملغ وريدي بالمعايرة إذا ألم مقاوم؛ كلوبيدوغريل 300 ملغ إذا القسطرة مبرمجة."),
      ],
      next: "transfer",
    },
    transfer: {
      kind: "end", id: "transfer",
      title: L("🚑 Transfert PCI médicalisé", "🚑 نقل مُرافق للقسطرة"),
      tone: "ok",
      steps: [
        L("Véhicule médicalisé direct centre PCI ; en route : monitorage, trinitrine si HTA.", "سيارة إسعاف طبية مباشرة لمركز القسطرة؛ في الطريق: مراقبة، ترينيترين إذا ارتفاع ضغط."),
        L("Si arrêt en route : poursuivre RCP + réorientation PCI (ACR sous infarctus).", "إذا توقف القلب في الطريق: استمر بالإنعاش + واصل القسطرة."),
      ],
    },
    nste: {
      kind: "decision", id: "nste",
      question: L("Critères de TRÈS haut risque (troponine positive, douleur réfractaire, ST électrique récurrent) ?", "معايير خطورة عالية جداً (تروبونين موجب، ألم مقاوم، ST متكرر)؟"),
      yes: "nste-urgent", no: "nste-standard",
    },
    "nste-urgent": {
      kind: "action", id: "nste-urgent",
      title: L("⏱ Invasif < 24 h", "⏱ قسطرة خلال 24 ساعة"),
      steps: [
        L("Hospitalisation cardiologie/USC prise en charge < 24 h.", "استشفاء في القلبية/وحدة الصدمات خلال 24 ساعة."),
        L("Antithrombotique selon protocole, MORPHINE seulement si échec des trinitrates.", "مضاد تخثر حسب البروتوكول، ومورفين فقط عند فشل النترات."),
      ],
      next: "transfer-usc",
    },
    "transfer-usc": {
      kind: "end", id: "transfer-usc",
      title: L("🚑 Transfert surveillance", "🚑 نقل تحت المراقبة"),
      tone: "ok",
      steps: [
        L("Unité de soins intensifs cardiologiques (USIC) ; monitorage continu transport.", "وحدة العناية القلبية المكثفة؛ مراقبة مستمرة أثناء النقل."),
      ],
    },
    "nste-standard": {
      kind: "end", id: "nste-standard",
      title: L("ℹ️ SCA sans ST+/GNR : admission conventionnelle", "ℹ️ SCA بلا ارتفاع ST: قبول عادي"),
      tone: "info",
      steps: [
        L("Admission cardiologie dans les 72 h (coronarographie selon score GRACE ≥ 140 → < 72 h).", "قبول في القلبية خلال 72 ساعة (تصوير الشرايين إذا GRACE ≥ 140 ← < 72 ساعة)."),
        L("Repos, anticoagulation conventionnelle, troponine contrôle.", "راحة، مضادات تخثر تقليدية، تروبونين مراقبة."),
      ],
    },
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Hémorragie du post-partum (HPP)
// ────────────────────────────────────────────────────────────────────────────
const hpp: DecisionTree = {
  id: "hemorragie-post-partum",
  title: L("Hémorragie du post-partum (HPP)", "نزيف ما بعد الولادة"),
  description: L(
    "Urgence obstétricale vitale : massage utérin + ocytocine immédiats, TXA < 3 h, escalade chimio-chirurgicale.",
    "طارئ توليدي حيوي: تدليك الرحم + أوكسيتوسين فوري، TXA خلال 3 ساعات، تصعيد دوائي-جراحي."
  ),
  icon: "HandHelping",
  severity: "vital",
  start: "start",
  lastReviewed: "2026-09-01",
  sources: [
    { label: "OMS / FIGO — recommandations HPP", url: "https://www.who.int" },
  ],
  nodes: {
    start: {
      kind: "decision", id: "start",
      question: L("Saignement vaginal important après l'accouchement (≥ 500 mL ou signe de choc) ?", "نزيف مهبلي غزير بعد الولادة (≥ 500 مل أو علامات صدمة)؟"),
      note: L("Toujours SOUS-ESTIMÉ. Penser les 4T : Tonus (atonie 70 %), Trauma (déchirures), Tissu (rétention placentaire), Thrombine (coagulopathie).", "التقدير دائماً ناقص. فكّر في الـ4T: التوتر (رهام 70%)، الأذية (تمزقات)، الأنسجة (احتباس مشيمي)، التخثر."),
      yes: "uterus", no: "observe",
    },
    observe: {
      kind: "end", id: "observe",
      title: L("Surveillance", "المراقبة"),
      tone: "info",
      steps: [
        L("Surveillance rapprochée : TA toutes les 5 min, globale, cholémocytopénèse à la moindre aggravation.", "مراقبة مشددة: ضغط كل 5 دقائق، حثالة، إعادة التقييم عند أي تدهور."),
      ],
    },
    uterus: {
      kind: "action", id: "uterus",
      title: L("⏱ Immédiat : utérus + ocytocine", "⏱ فوري: الرحم + أوكسيتوسين"),
      steps: [
        L("Massage utérin bimanuel (une main sur le fond, une sur le pubis) SANS s'arrêter — c'est le premier hémostatique.", "تدليك ثنائي باليدين بلا انقطاع (يد على القاع، يد على العانة) — هو أول موقف للنزف."),
        L("Ocytocine 10 UI IM lent OU 5 UI IV lent, puis 40 UI en G5 % (500 mL) à débit rapide.", "أوكسيتوسين: 10 وحدات عضلي أو 5 وريدي بطيء، ثم 40 في G5% تدفق سريع."),
        L("⚠️ TXA 1 g IV en 10 min MAXIMUM dans les 3 h du saignement (second rebrousse possible si persistance à 30 min).", "⚠️ TXA 1 غ خلال 3 ساعات القصوى من بدء النزيف (بلا تجاوز)."),
        L("Sonde urinaire (vessie pleine = obstacle à la rétraction) ; notez l'heure.", "قسطرة بولية (مثانة ممتلئة تعيق الانقباض)؛ وثّق الساعة."),
        L("Placer 2 VVP gros calibre + bilan NFS, hémostase, groupe + cross-match, prélèvement.", "خطّان وريديان كبيران + NFS + تخثر + فصيلة + توافق."),
        L("TXA (acide tranexamique) 1 g IV en 10 min, À INJECTER DANS LES 3 H ; puis 1 g si saignement persiste à 30 min.", "TXA 1 غ وريدي على 10 دقائق خلال 3 ساعات؛ ثم 1 غ إذا استمر النزيف بعد 30 د."),
      ],
      timerSec: 300,
      timerLabel: L("Délai massage — bilan 5 min", "5 د — التدليك والتقييم"),
      next: "check-etiology",
    },
    "check-etiology": {
      kind: "decision", id: "check-etiology",
      question: L("Le saignement persiste après massage + ocytocine ?", "هل استمر النزيف بعد التدليك والأوكسيتوسين؟"),
      yes: "misoprostol", no: "transfer",
    },
    misoprostol: {
      kind: "action", id: "misoprostol",
      title: L("Uterotoniques de 2ᵉ intention", "مقبضات الرحم من الصف الثاني"),
      steps: [
        L("Misoprostol 800 µg sublingual (si ocytocine inefficace ou indisponible en préhospitalier).", "ميزوبروستول 800 مكغ تحت اللسان (إذا فشل الأوكسيتوسين أو غيابه في الميدان)."),
        L("Remettre en cause l'étiologie : canal d'AJJ revisionné (déchirure cervicale/vaginale ou rétention) — chirurgie immédiate.", "أعد النظر في السبب: تمزق عنقي/مهبلي أو احتباس ← جراحة/تنقيب حجمي فوري."),
      ],
      next: "shock-check",
    },
    "shock-check": {
      kind: "decision", id: "shock-check",
      question: L("Signes de choc hémorragique (PAS < 90, pouls > 110, marbrures) ?", "علامات صدمة نزفية (ضغط < 90، نبض > 110، تبقع)؟"),
      yes: "shock-treatment", no: "transfer",
    },
    "shock-treatment": {
      kind: "action", id: "shock-treatment",
      title: L("🚨 Choc hémorragique — remplissage", "🚨 صدمة نزفية — تعويض"),
      steps: [
        L("NaCl 0,9 % ou Ringer bolus 20–30 mL/kg rapide, chauffé si possible.", "NaCl 0.9% أو رينغر دفعات 20–30 مل/كغ سريعة، مدفأة إذا أمكن."),
        L("Position Trendelenburg modérée, O₂ HDF, choc électrique/conduite urgente.", "وضعية ترندلنبورغ معتدلة، أكسجين، نقل عاجل مُزمّن."),
        L("NE PAS retarder le transfert vers bloc/maternité : la chirurgie (embolisation, ligature, hystérectomie) est le seul traitement définitif en cas d'échec médical.", "لا تؤخر النقل إلى المستشفى: الجراحة (تصوير تصلبي، ربط الشرايين، استئصال الرحم) هي العلاج النهائي عند فشل الدواء."),
      ],
      next: "transfer",
    },
    transfer: {
      kind: "end", id: "transfer",
      title: L("🚑 Transfert maternité URGENT", "🚑 نقل عاجل إلى التوليد"),
      tone: "warn",
      steps: [
        L("Véhicule médicalisé, prise en charge continue : massage + ocytocine + monitorage.", "سيارة إسعاف طبية، متابعة مستمرة: تدليك + أوكسيتوسين + مراقبة."),
        L("Appel préalable au centre de référence (maternité 190) — temps de trajet minimisé.", "إشعار مسبق بمركز التوليد (190) — تقليل فترة النقل."),
      ],
    },
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Hyperkaliémie sévère
// ────────────────────────────────────────────────────────────────────────────
const hyperkaliemie: DecisionTree = {
  id: "hyperkaliemie",
  title: L("Hyperkaliémie sévère", "فرط بوتاسيوم الدم الشديد"),
  description: L(
    "Cardioprotection immédiate au calcium, déplacement intracellulaire (insuline+G30, salbutamol, bicarbonate), élimination (diurétiques/épuratrice).",
    "حماية قلبية فورية بالكالسيوم، إدخال K داخل الخلايا (إنسولين+جلوكوز، سالبوتامول، بيكربونات)، وإخراجه (مدرات/تصفية)."
  ),
  icon: "Activity",
  severity: "vital",
  start: "start",
  lastReviewed: "2026-09-01",
  sources: [
    { label: "KDIGO / AHA 2020 — hyperkaliémie", url: "https://kdigo.org" },
  ],
  nodes: {
    start: {
      kind: "decision", id: "start",
      question: L("✚ Hyperkaliémie (K > 5,5 mmol/L) + ECG: onde T pointue, QRS élargi, bradycardie, troubles du rythme ?", "✚ فرط بوتاسيوم (> 5.5) + ECG: موجة T مدببة، QRS واسع، بطء قلب؟"),
      note: L("Ne JAMAIS attendre le dosage biologique si ECG typique — traiter immédiatement.", "لا تنتظر التحليل أبداً إذا كان ECG نمطياً — عالج فوراً."),
      yes: "calcium", no: "mild",
    },
    mild: {
      kind: "end", id: "mild",
      title: L("Hyperkaliémie asymptomatique (K 5–6)", "فرط بوتاسيوم لا عرضي (5–6)"),
      tone: "info",
      steps: [
        L("Arrêt des médicaments hyperkaliémiants, régime pauvre en K, surveillance ECG.", "إيقاف الأدوية الرافعة للبوتاسيوم، حمية فقيرة، مراقبة ECG."),
        L("Dosage sanguin sanguin + ionogramme à répéter (hémolyse fausse fréquente).", "أعد التحليل (الانحلال الكذب شائع)."),
      ],
    },
    calcium: {
      kind: "action", id: "calcium",
      title: L("💉 CARDIOPROTECTION : calcium", "💉 حماية القلب: الكالسيوم"),
      steps: [
        L("Gluconate de calcium 10 % : 10–30 mL IV en 2–5 min SURLENT (au scope, risque de bradycardie).", "غلوكونات الكالسيوم 10%: 10–30 مل على 2–5 د ببطء (بمراقبة، خطر بطء القلب)."),
        L("En cas de traitement par digitaliques : préférer le gluconate (moins arhythmogène).", "عند متعاطي الديجوكسين: يُفضَّل الغلوكونات (أقل إحداثاً للنظم)."),
        L("Effet immédiat mais fugace : re-déclencher après 5 min si le tracé reste anormal (max 3 doses).", "مفعول فوري لكن زائل: كرّر بعد 5 د إذا استمر الرسم (أقصى 3 جرعات)."),
        L("Ne PAS mettre dans la même tubulure que le bicarbonate (précipité !).", "لا تمزجه بنفس الأنبوب مع البيكربونات (يترسب!)."),
      ],
      next: "shift-in",
    },
    "shift-in": {
      kind: "action", id: "shift-in",
      title: L("Déplacement intracellulaire", "إدخال البوتاسيوم داخل الخلية"),
      steps: [
        L("Insuline rapide 10 UI IV + G30 1 ampoule (20 min après : glycémie capillaire — hypoglycémie possible).", "إنسولين سريع 10 وحدات وريدي + G30 أمبولة (راقب السكر بعد 20 د)."),
        L("Salbutamol 1 000 µg (2½ ampoules 0,5 mg/mL) en aérosol continu 10–15 min OU bicarbonate 4,2 % 250 mL (si acidose).", "سالبوتامول 1000 مكغ استنشاق متواصل 10–15 د، أو بيكربونات 4.2% 250 مل إذا كان هناك حماض."),
        L("Effet en 15–30 min, durant 2–6 h.", "المفعول خلال 15–30 دقيقة، يستمر 2–6 ساعات."),
      ],
      next: "shift-out",
    },
    "shift-out": {
      kind: "action", id: "shift-out",
      title: L("Élimination du potassium", "إخراج البوتاسيوم من الجسم"),
      steps: [
        L("Furosémide 40–80 mg IV (si fonction rénale conservée).", "فوروسيميد 40–80 ملغ وريدي (إذا كانت الوظيفة الكلوية محفوظة)."),
        L("Bicarbonate oral/résines échangeuses (Kayexalate) si l'insuffisance rénale l'exige.", "راتنجات الصرف (كاييكسالات) إذا لزم."),
      ],
      next: "dialysis",
    },
    dialysis: {
      kind: "decision", id: "dialysis",
      question: L("Insuffisance rénale sévère, diurétique inefficace ou K réfractaire ?", "قصور كلوي شديد، أو مدرات غير فعالة، أو K مقاوم؟"),
      yes: "epuration", no: "monitor",
    },
    epuration: {
      kind: "end", id: "epuration",
      title: L("🚨 ÉPURATION URGENTE", "🚨 تصفية عاجلة"),
      tone: "warn",
      steps: [
        L("Hémodialyse ou CVVHD en urgence absolue — Centre de néphrologie / USI immédiate.", "تصفية دم أو CVVHD عاجلة — قسم الكلى/العناية فوراً."),
        L("Continuer la cardioprotection calcium jusqu'à l'épuré.", "استمر بالكالسيوم حتى بدء التصفية."),
      ],
    },
    monitor: {
      kind: "end", id: "monitor",
      title: L("✅ Monitorage post-traitement", "✅ مراقبة ما بعد العلاج"),
      tone: "ok",
      steps: [
        L("ECG continu 6 h ; K+, glycémie, iono à 1 h, 2 h, 4 h, 6 h.", "ECG مستمر 6 س؛ فحص K والسكر والشوارد عند 1، 2، 4، 6 س."),
        L("Rechercher la cause (RCKA, médicaments, rhabdomyolyse, acidose) et la corriger.", "ابحث عن السبب (قصور كلوي حاد، أدوية، تحلل عضلي) وعالجه."),
      ],
    },
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Polytraumatisme (ATLS ABCDE fast)
// ────────────────────────────────────────────────────────────────────────────
const polytraumatisme: DecisionTree = {
  id: "polytraumatisme",
  title: L("Polytraumatisme — ABCDE", "الرضوض الجسيمة — ABCDE"),
  description: L(
    "Examen primaire ATLS rapide : A (airways) → B (breathing, pneumothorax) → C (circulation, garrot) → D (neuro) → E (exposition).",
    "الفحص الأولي السريع ATLS: الهوائية ← التنفس (استرواح) ← الدورة (ضغط جرح) ← العصب ← الكشف الكامل."
  ),
  icon: "Bone",
  severity: "vital",
  start: "start",
  lastReviewed: "2026-09-01",
  sources: [
    { label: "ATLS 10ᵉ édition, ACS-COT", url: "https://www.facs.org" },
  ],
  nodes: {
    start: {
      kind: "action", id: "start",
      title: L("A — Airways & colonne cervicale", "أ — المجرى الهوائي والعمود الرقبي"),
      steps: [
        L("Liberté du plafond (aspiration, luxation menton à angle ouvert, Guedel si GCS < 8).", "تحرير المجرى (شفط، رفع الذقن، غيديل إذا غلاسكو < 8)."),
        L("Collier cervical IMMÉDIAT si suspicion traumatismé ; pas de flexion de nuque.", "طوق عنقي فوري إذا اشتبه رض؛ بلا ثني العنق."),
      ],
      next: "breathing",
    },
    breathing: {
      kind: "action", id: "breathing",
      title: L("B — Breathing & ventilation", "ب — التنفس"),
      steps: [
        L("FR, SpO₂, auscultation bilatérale, thorax inspecté (lésions ouvertes, fléau, MPU).", "معدل التنفس، التشبع، سماع ثنائي، فحص الصدر (جروح مفتوحة، كتلة)."),
        L("Pertuis d'air plaide (seal thoracique), exsufflation si pneumothorax suffocant.", "سداد الجروح المفتوحة (بضماد ثلاثي)، بزل صدر إذا استرواح ضاغط."),
        L("O₂ HDF 15 L/min masque à haute concentration (valve).", "أكسجين عالي التدفق 15 ل/د بقناع عالي التركيز."),
      ],
      next: "circulation",
    },
    circulation: {
      kind: "action", id: "circulation",
      title: L("C — Circulation & hémorragies", "ج — الدورة والنزيف"),
      steps: [
        L("COMPRESSION EXTERNE immédiate de tout saignement (pansement compressif, garrot > 2–3 cm d'une artère).", "ضغط خارجي فوري على أي نزيف (ضماد ضاغط، عاصبة > 2–3 سم من الشريان)."),
        L("2 VVP gros calibre + bilan hémorragique (PAS, pouls, perfusion périphérique).", "خطّان وريديان كبيران + تقييم نزفي (ضغط، نبض، تروية محيطية)."),
        L("NaCl/RL bolus 500 mL si PAS < 90 ; TXA 1 g IV < 3 h si hémorragie majorée.", "NaCl دفعات 500 مل إذا ضغط < 90؛ TXA 1 غ خلال 3 ساعات إذا نزف كبير."),
      ],
      next: "disability",
    },
    disability: {
      kind: "action", id: "disability",
      title: L("D — Disability (neuro : GCS)", "د — الحالة العصبية (غلاسكو)"),
      steps: [
        L("GCS (E4+V5+M6 = 15/15) + pupilles isocories + déficit latéral.", "غلاسكو + حدقتان متساويتان + نقص جانبي."),
        L("GCS ≤ 8 → intubation oro-trachéale (comas + échec des VA basiques).", "غلاسكو ≤ 8 ← تنبيب فموي رغامي (لحماية المجرى)."),
        L("Hypoglycémie capillaire possible (choc, alcool).", "افحص سكر الدم الشعري (صدمة، كحول)."),
      ],
      next: "exposure",
    },
    exposure: {
      kind: "action", id: "exposure",
      title: L("E — Exposure & environment", "هـ — الكشف والمحيط"),
      steps: [
        L("Déshabiller COMPLÈTEMENT (log-roll) pour chercher lésions dorsales/masquées — mais COUVRIR immédiatement (hypothermie grave).", "عرّض كاملاً (تدوير جذعي) للبحث عن أذيات خلفية — لكن غطِّ فوراً (نقص حرارة خطير)."),
        L("Température rectale ; réchauffement si < 35 °C.", "قياس حرارة شرجي؛ تدفئة إذا < 35°."),
      ],
      next: "transport",
    },
    transport: {
      kind: "end", id: "transport",
      title: L("🚑 Transfert trauma centre", "🚑 نقل إلى مركز الإصابات"),
      tone: "warn",
      steps: [
        L("Time is life → transfert RAPIDE centre de référence traumatologique (si heure dorée).", "الوقت = الحياة ← نقل سريع لمركز الإصابات المرجعي."),
        L("Continuer les MEA en route ; ne pas rester sur place plus de nécessaire.", "واصل العناية في الطريق؛ لا تمكث في المكان أكثر من اللازم."),
        L("Régulation 190 si bloc opératoire / réa-trauma indiqués.", "تنظيم 190 إذا لزم غرفة عمليات/عناية إصابات."),
      ],
    },
  },
};

export const decisionTrees: DecisionTree[] = [acr, anaphylaxie, etatMal, sepsis, douleurThorax, hpp, hyperkaliemie, polytraumatisme];

export function getTree(id: string): DecisionTree | undefined {
  return decisionTrees.find((t) => t.id === id);
}

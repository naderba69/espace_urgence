import type { Localized, ReviewMeta } from "./types";

// Procédures d'urgence — étapes, matériel, checklist interactive (cases cochées côté client).
export interface Procedure {
  id: string;
  title: Localized;
  equipment: Localized[];   // matériel
  steps: Localized[];       // gestes
  nursing: Localized[];     // surveillance / soins infirmiers
  checklist?: { pre?: Localized[]; post?: Localized[] };
  meta: ReviewMeta;
}

export const procedures: Procedure[] = [
  {
    id: "iot-rsi",
    title: { fr: "Intubation orotrachéale (RSI)", ar: "التنبيب الفموي بالتسلسل السريع" },
    equipment: [
      { fr: "Laryngoscopes (2 jeux de lames), sondes adaptées +1-0.5, mandrin, guide", ar: "لارنجوسكوب (للثنين), أنابيب بمقاسات، مِدرّج، دليل" },
      { fr: "Aspiration (2), BAVU, capnographe (obligatoire), garrot", ar: "شافطة ×2، بالون-قناع، كابنوغراف (إلزامي)، عاصبة" },
      { fr: "Hypnotique + curare (kétamine 1–2 mg/kg + rocuronium 1,2 mg/kg)", ar: "منوّم + مرخٍ (كيتامين 1–2 ملغ/كغ + روكورونيوم 1.2 ملغ/كغ)" },
      { fr: "Alternatives de secours : masque laryngé, sonde de bougie, scope", ar: "بدائل إنقاذ: قناع حنجري، بوغي، مراقبة" },
    ],
    steps: [
      { fr: "Préparation : préoxygénation 3 min (SpO2 100 %) + RAS / voie aérienne prévue", ar: "تحضير: أكسجة 3 د (تشبع 100%)" },
      { fr: "Induction : hypnotique puis curare en délai ; pas de ventilation force si RCP", ar: "تحريض: منوّم ثم مرخٍ؛ بلا تهوية قسرية إن توقف" },
      { fr: "Intubation : laryngoscopie, vocalise ou non, 30 s max par tentative", ar: "تنبيب: رؤية الحبال، ≤30 ث للمحاولة" },
      { fr: "Vérifier : capnographie continue = OBLIGATOIRE + auscultation bilatérale + thorax symétrique", ar: "تحقق: كابنوغرافيا مستمرة إلزامية + إصغاء ثنائي" },
      { fr: "Fixer le tube, mesurer la profondeur, tubage brachial parfait ?", ar: "ثبّت الأنبوب، قِس العمق" },
      { fr: "Sédation-analgésie continue ensuite ; réglages initiaux (calculateur)", ar: "تهدئة-تسكين مستمران؛ إعدادات أولية (الحاسبة)" },
    ],
    nursing: [
      { fr: "Postion fixée : référence côté patient (marque cm) notée", ar: "وثّق علامة العمق المرجعية" },
      { fr: "EtCO2 continu ; perte du tracé = tube sorti/obstrué jusqu'à preuve du contraire", ar: "فقدان التسجيل = خروج/انسداد الأنبوب حتى إثبات العكس" },
    ],
    checklist: {
      pre: [
        { fr: "Deux opérateurs / plan B annoncé", ar: "معالجَان / خطة بديلة معلنة" },
        { fr: "Matériel d'aspiration allumé", ar: "الشافطة تعمل" },
        { fr: "Sonde contrôlée (ballonnet testé)", ar: "البالون مفحوص" },
        { fr: "Médicaments titrés et étiquetés (RSI)", ar: "الأدوية معايَرة وموسومة" },
        { fr: "Capnographe branché", ar: "الكابنوغراف موصول" },
      ],
      post: [
        { fr: "Courbe capno valide sur 6 cycles", ar: "منحنى كابنو سليم على 6 دورات" },
        { fr: "Auscultation bilatérale OK", ar: "إصغاء ثنائي سليم" },
        { fr: "Tube fixé à la marque notée", ar: "الأنبوب مثبت عند العلامة" },
        { fr: "Sédation/analgésie amorcée", ar: "التهدئة/التسكين انطلقت" },
        { fr: "TA/SpO2 stables documentées", ar: "ضغط/تشبع مستقران موثقان" },
      ],
    },
    meta: { sources: ["SFAR RSI/DAS 2023", "ERC airway 2021"], lastReviewed: "2026-08" },
  },
  {
    id: "defibrillation",
    title: { fr: "Défibrillation (choc externe)", ar: "الصدمة الكهربائية الخارجية" },
    equipment: [
      { fr: "Défibrillateur (DAE ou manuel) + électrodes adultes/enfant", ar: "صادم (شبه آلي أو يدوي) + لصاقات حجم مناسب" },
      { fr: "Gel/patchs, rasoir si thorax pileux, BCU en secours", ar: "جل/لصاقات، موس، بالون-قناع احتياطي" },
    ],
    steps: [
      { fr: "Confirmer l'indication : FV/TVSP (choc non synchronisé) ou instable avec pouls (synchronisé)", ar: "أكّد الاستطباب: رجفان/تسرع بلا نبض (غير متزامن) أو غير مستقر بنبض (متزامن)" },
      { fr: "Positionner les électrodes (sternum droit - apex gauche de coeur) avec adhérence ferme", ar: "ثبّت اللصاقات (قصي أيمن - قمة البطين الأيسر) بلصق محكم" },
      { fr: "Charger (biphasique 120–200 J adulte, 4 J/kg enfant pendant RCP)", ar: "اشحن (ثنائي 120–200 جول كبير؛ 4 جول/كغ أثناء الإنعاش)" },
      { fr: "« Écartez-vous ! » + vérifier visuellement que PERSONNE ne touche le patient", ar: "«ابتعدوا!» وتأكد بصرياً أن لا أحد يمسّ المريض" },
      { fr: "Délivrer en reprenant la RCP IMMÉDIATEMENT (sans vérifier le pouls)", ar: "أطلق واستأنف الإنعاش فوراً دون فحص النبض" },
    ],
    nursing: [
      { fr: "Marquer l'heure de chaque choc (traçabilité)", ar: "سجّل ساعة كل صدمة" },
      { fr: "Contrôler l'adhérence et la peau sèche", ar: "تحقق من التصاق وجفاف الجلد" },
    ],
    meta: { sources: ["AHA ACLS 2025", "ERC 2021"], lastReviewed: "2026-08" },
  },
  {
    id: "vvp",
    title: { fr: "Voie veineuse périphérique (VVP)", ar: "خط وريد محيطي" },
    equipment: [
      { fr: "Cathéter 18–22 G, garrot, alcool 70, colle/sparadrap, set de perfusion", ar: "قسطار 18–22، عاصبة، كحول 70، لصق، طقم محلول" },
    ],
    steps: [
      { fr: "Identifier + consentement ; hygiène des mains ; garrot 7–10 cm au-dessus du point", ar: "عرّف واطلب الموافقة؛ نظافة اليدين؛ عاصبة فوق النقطة 7–10 سم" },
      { fr: "Choisir une veine visible/palpable droite (avant-bras pli coude)", ar: "اختر وريداً ظاهراً أملساً (ساعد)" },
      { fr: "Désinfecter alcool 70 en mouvement rotatif, laisser sécher", ar: "طهّر دائرياً واترك الجفاف" },
      { fr: "Piquer à 15–30°, retour veineux, avancer la canule, retirer l'aiguille", ar: "ادخل بزاوية 15–30°؛ عند عودة الدم ادفع الكانيولا وانزع الإبرة" },
      { fr: "Fixer, rincer (NaCl 2–5 mL), étiqueter date/heure", ar: "ثبّت، اغسل بمصل ملحي، ووسّم بتاريخ وساعة" },
    ],
    nursing: [
      { fr: "Surveiller : rougeur, gonflement, douleur (phlébite, extravasation)", ar: "راقب: احمرار، تورم، ألم (التهاب وريد، تسرب)" },
      { fr: "Ne pas perfuser sur une voie douteuse", ar: "لا تحقن بخط مشكوك" },
    ],
    meta: { sources: ["SFMU / SF2H plan d'hygiène"], lastReviewed: "2026-08" },
  },
  {
    id: "intra-osseuse",
    title: { fr: "Voie intra-osseuse (VIO)", ar: "الطريق داخل العظم" },
    equipment: [
      { fr: "Système manuel/motorisé (EZ ou guêpière) — point tibial proximal ou huméral", ar: "نظام يدوي/محرك — نقطة الظنبوب القريبة أو العضدي" },
    ],
    steps: [
      { fr: "Indication : ACR ou accès veineux impossible <90 s — URGENT", ar: "استطباب: توقف قلب أو استحالة وريد خلال <90 ث — مستعجل" },
      { fr: "Repérer le point (tubérosité tibiale) ; repérage strict", ar: "حدّد النقطة (حديبة الظنبوب)" },
      { fr: "Insert perpendiculaire jusqu'à perte de résistance ; fixer", ar: "أدخل عمودياً حتى فقدان المقاومة؛ ثبّت" },
      { fr: "Aspiration moelle = confirmation ; rinçage obligatoire avant tout produit", ar: "شفط نقي العظام = تأكيد؛ الغسل إلزامي قبل أي حقن" },
      { fr: "Perfuser à contre-pression (pression) ; tout est permis en dose IV usuelle", ar: "انقع بضغط؛ كل أدوية الوريد ممكنة بجرعاتها" },
    ],
    nursing: [
      { fr: "Surveiller extravasation/extensibilité du membre", ar: "راقب التسرب/تمدد الطرف" },
      { fr: "Retirer <24 h (idéal <6 h) — infection.", ar: "أخرج خلال <24 س (المثلى <6 س) — عدوى." },
    ],
    meta: { sources: ["AHA ACLS accès IO", "SFAR"], lastReviewed: "2026-08" },
  },
  {
    id: "exsufflation",
    title: { fr: "Exsufflation d'un pneumothorax compressif", ar: "تفريغ استرواح ضاغط بالإبرة" },
    equipment: [
      { fr: "Cathéter 14–16 G long + seringue 10 mL ; O2 haute concentration avant", ar: "قسطار طويل 14–16 + محقنة؛ أكسجة مسبقة" },
    ],
    steps: [
      { fr: "Diagnostic : détresse + absence de souffle unilatéral + tympanisme + MV abolis (immédiat — pas de radio)", ar: "التشخيص سريري فوري: ضيق + إلغاء مسلويات جهة + طنين — دون تصوير" },
      { fr: "5e espace intercostal ligne axillaire antérieure (ou 2e ICM si indisponible)", ar: "الفراغ الوربي الخامس بالخط الإبطي الأمامي (أو الثاني بالترقوي)" },
      { fr: "Piquer au-dessus de la côte supérieure jusqu'à sifflement d'air", ar: "ادخل فوق الحرف العلوي للضلع حتى صفير الهواء" },
      { fr: "Laisser l'air sortir (libérer le piston), retirer l'aiguille garder la canule", ar: "دع الهواء يخرج، انزع الإبرة وأبقِ الكانيولا" },
      { fr: "Réévaluer respiration ; drainage thorasique définitif ensuite (équipe)", ar: "أعد تقييم التنفس؛ ثم تصريف صدري نهائي من الفريق" },
    ],
    nursing: [
      { fr: "Documenter taille du cathéter et le soulagement obtenu", ar: "وثّق المقاس والتحسن الحاصل" },
    ],
    meta: { sources: ["ATLS 10e", "ERC trauma"], lastReviewed: "2026-08" },
  },
  {
    id: "masque-larynge",
    title: { fr: "Masque laryngé (ML)", ar: "القناع الحنجري" },
    equipment: [{ fr: "ML adapté au poids (n°3–5), gel, seringue de gonflage", ar: "قناع بمقاس الوزن (3–5)، جل، محقنة نفخ" }],
    steps: [
      { fr: "Préoxygéner ; ouvrir la bouche, tête en légère extension", ar: "أكسج مسبقاً؛ افتح الفم برأس ممدود قليلاً" },
      { fr: "Insérer pointe contre le palais, glisser sans forcer jusqu'à résistance", ar: "أدخل الرأس ملتصقاً بالحنك دون قوة حتى المقاومة" },
      { fr: "Gonfler selon taille ; vérifier capnographie + mouvements thorax", ar: "انفخ حسب المقاس؛ تحقق كابنو + حركة الصدر" },
    ],
    nursing: [
      { fr: "Alternative rapide en cas d'échec d'intubation ; protège moins bien contre l'inhalation (risque de régurgitation).", ar: "حل بديل سريع لكن أقل حماية من الاستنشاق (خطر قلس)." },
    ],
    meta: { sources: ["ERC airway 2021"], lastReviewed: "2026-08" },
  },
  {
    id: "immobilisation-rachis",
    title: { fr: "Immobilisation du rachis (plan dur/collet)", ar: "تثبيت العمود الفقري" },
    equipment: [
      { fr: "Collet cervical adapté, plan dur / scoop, sangles ; coussin latéral enfant", ar: "طوق مناسب، لوح صلب، أحزمة" },
    ],
    steps: [
      { fr: "Maintien manuel de la tête en position neutre dès l'arrivée", ar: "أمسك الرأس يدوياً بوضع محايد من البداية" },
      { fr: "Collet mesuré au cou (hauteur, non universal)", ar: "طوق مقاس عند الرقبة" },
      { fr: "Relever en « dégagement continu » avec 3–4 personnes, commandée", ar: "ارفع بتدوير موحّد مؤمَّر بـ3–4 أشخاص" },
      { fr: "Fixer partie inférieure d'abord puis tête ; dégager les oreilles", ar: "ثبّت الأسفل ثم الرأس؛ حرّر الأذنين" },
    ],
    nursing: [
      { fr: "La contrainte prolongée = risque d'escarre/hypothermie ; lever le plan si transport prolongé et doute raisonnable", ar: "الإطالة على اللوح = قرحات/برد؛ ارفعه إذا طال النقل والشك معقول." },
    ],
    meta: { sources: ["ATLS spine", "PHTLS 9e"], lastReviewed: "2026-08" },
  },
  {
    id: "accouchement-inopine",
    title: { fr: "Accouchement inopiné (pré-hospitalier)", ar: "ولادة غير متوقعة (ما قبل المستشفى)" },
    equipment: [
      { fr: "Kit maternité : clamps + fil (ou lacets) ×2, compresses, couverture, aspiration nouveau-né", ar: "عدة ولادة: كلابس وخيوط ×2، ضمادات، بطانية، شافطة" },
    ],
    steps: [
      { fr: "Rester calme ; décubitus latéral gauche ; prévoir 2e naissance si jumeaux", ar: "اهدأ؛ استلقاء أيسر؛ توقع توأماً" },
      { fr: "Guidage mère : pousser avec contractions, RESPIRER entre", ar: "وجّه الأم: ادفعي مع الانقباضات وتنفسي بينها" },
      { fr: "Réception bébé ; ne jamais tirer ; clamp à 10 cm (2 serrations)", ar: "استلم الوليد بلا شد؛ اكبس على بُعد 10 سم بمشبكين" },
      { fr: "Sécher, réchauffer peau-à-peau ; suction nez/bouche si besoin ; crier/stimuler", ar: "جفّف ودفّئ ملامسة جلدية؛ حرّضه" },
      { fr: "2e pinceau/section après contrôle du pouls ombilical arrêté ; surveiller HPP (massage utérin mère)", ar: "قصّ بعد توقف نبض الحبل؛ راقب نزف الأم ودلك رحمها" },
    ],
    nursing: [
      { fr: "Chaleur du nouveau-né = priorité (souffle après naissance ; couvrir la tête)", ar: "دفء الوليد أولوية (غطّ رأسه)." },
    ],
    meta: { sources: ["OMS naissance", "SFMU périnatalité"], lastReviewed: "2026-08" },
  },
];

export function getProcedure(id: string) {
  return procedures.find((p) => p.id === id);
}

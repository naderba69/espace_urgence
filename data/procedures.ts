import type { Localized, ReviewMeta } from "./types";

// Procédures d'urgence — aide-mémoires de haut niveau, à appliquer avec le protocole local.
export interface Procedure {
  id: string;
  title: Localized;
  equipment: Localized[];
  steps: Localized[];
  nursing: Localized[];
  checklist?: { pre?: Localized[]; post?: Localized[] };
  timeTarget?: Localized;

  meta: ReviewMeta;
}

export const procedures: Procedure[] = [
  {
    id: "iot-rsi",
    title: { fr: "Intubation orotrachéale (RSI)", ar: "التنبيب الفموي بالتسلسل السريع" },
    equipment: [
      { fr: "Oxygène, BAVU et interfaces adaptés ; aspiration vérifiée ; monitorage ECG, SpO₂, TA et capnographe.", ar: "أكسجين وكيس-قناع وواجهات مناسبة؛ شفط مفحوص؛ مراقبة تخطيط القلب والتشبع والضغط والكابنوغراف." },
      { fr: "Laryngoscope direct ou vidéo, sondes choisies pour le patient, guide/bougie et dispositif supraglottique de secours selon le matériel disponible.", ar: "منظار حنجري مباشر أو فيديو، وأنابيب بحسب المريض، وموجّه/بوغي وجهاز فوق المزمار للإنقاذ بحسب التجهيز المتاح." },
      { fr: "Médicaments d'induction et de curarisation préparés et étiquetés ; choix et doses selon le patient et le protocole validé.", ar: "أدوية التحريض وإرخاء العضلات محضّرة وموسومة؛ يُختار الدواء والجرعة بحسب المريض والبروتوكول المعتمد." },
    ],
    steps: [
      { fr: "Préoxygéner systématiquement ; choisir la méthode selon le patient et le protocole, et préparer une stratégie de secours des voies aériennes.", ar: "أجرِ أكسجة مسبقة منهجية؛ اختر الطريقة بحسب المريض والبروتوكول، وجهّز خطة إنقاذ لمجرى الهواء." },
      { fr: "En arrêt cardiaque, suivre l'algorithme de réanimation et non une fiche RSI. Hors arrêt, administrer l'hypnotique puis le curare selon le protocole ; ne pas appliquer d'interdiction générale de ventilation au masque si elle est cliniquement indiquée.", ar: "عند توقف القلب، اتبع خوارزمية الإنعاش لا بطاقة RSI. خارج توقف القلب، أعطِ المنوّم ثم المرخي وفق البروتوكول؛ لا تمنع التهوية بالقناع منعاً عاماً إذا استدعتها الحالة السريرية." },
      { fr: "Réaliser la laryngoscopie par un opérateur formé ; en cas d'échec ou de désaturation, interrompre la tentative, réoxygéner et appliquer l'algorithme local d'intubation difficile.", ar: "ينفّذ التنظير ممارس مدرّب؛ عند فشل المحاولة أو هبوط التشبع أوقفها، وأعِد الأكسجة واتبع خوارزمية مجرى الهواء الصعب المعتمدة محلياً." },
      { fr: "Confirmer la position trachéale par une capnographie continue avec courbe ; l'auscultation et les mouvements thoraciques sont des éléments complémentaires.", ar: "أكّد موضع الأنبوب الرغامي بكابنوغرافيا مستمرة ذات موجة؛ الإصغاء وحركة الصدر علامتان مساعدتان." },
      { fr: "Fixer le tube, noter le repère en centimètres et recontrôler après tout déplacement ou transfert.", ar: "ثبّت الأنبوب، وسجّل علامة العمق بالسنتيمتر، وأعِد التحقق بعد أي تحريك أو نقل." },
      { fr: "Poursuivre analgésie-sédation et ventilation avec surveillance continue, selon le protocole et l'état du patient.", ar: "واصل التسكين والتهدئة والتهوية مع المراقبة المستمرة، وفق البروتوكول وحالة المريض." },
    ],
    nursing: [
      { fr: "Maintenir la surveillance ECG, SpO₂, TA et courbe EtCO₂ ; documenter les valeurs et toute intervention.", ar: "واصل مراقبة تخطيط القلب والتشبع والضغط وموجة EtCO₂؛ وثّق القيم وكل تدخل." },
      { fr: "Si la courbe EtCO₂ disparaît ou change, évaluer immédiatement le patient et vérifier le tube, le circuit, la ligne de prélèvement et la perfusion ; ne pas attribuer automatiquement la cause au tube seul.", ar: "إذا اختفت موجة EtCO₂ أو تغيّرت، قيّم المريض فوراً وافحص الأنبوب والدائرة وخط أخذ العينة والتروية؛ لا تفترض أن السبب من الأنبوب وحده." },
    ],
    checklist: {
      pre: [
        { fr: "Opérateur et aide identifiés ; plan de secours annoncé.", ar: "تحديد الممارس والمساعد؛ وإعلان خطة الإنقاذ." },
        { fr: "Oxygène, BAVU, aspiration, monitorage et capnographe prêts et fonctionnels.", ar: "الأكسجين وكيس-القناع والشفط والمراقبة والكابنوغراف جاهزة وتعمل." },
        { fr: "Tube, ballonnet et dispositif de secours vérifiés.", ar: "فحص الأنبوب والبالون وجهاز الإنقاذ." },
        { fr: "Médicaments préparés, étiquetés et doses vérifiées selon le protocole choisi.", ar: "تحضير الأدوية ووسمها والتحقق من الجرعات وفق البروتوكول المختار." },
      ],
      post: [
        { fr: "Courbe capnographique continue compatible avec une intubation trachéale.", ar: "موجة كابنوغرافيا مستمرة متوافقة مع التنبيب الرغامي." },
        { fr: "Repère du tube documenté et fixation contrôlée.", ar: "توثيق علامة عمق الأنبوب والتحقق من تثبيته." },
        { fr: "Analgésie-sédation instaurée selon le protocole.", ar: "بدء التسكين والتهدئة وفق البروتوكول." },
        { fr: "Valeurs réelles de TA, SpO₂ et EtCO₂ documentées ; toute anomalie prise en charge.", ar: "توثيق القيم الفعلية للضغط والتشبع وEtCO₂؛ والتعامل مع أي خلل." },
      ],
    },
    meta: {
      sources: [
        "SFAR/SFMU RFE 2025, DOI 10.1684/afmu.2025.0673 (R2.2.1, R3.1–R3.5, R5.1–R5.2)",
        "ERC Adult ALS 2025, DOI 10.1016/j.resuscitation.2025.110769",
      ],
      lastReviewed: "2026-10",
    },
  },
  {
    id: "defibrillation",
    title: { fr: "Défibrillation (arrêt cardiaque sans pouls)", ar: "إزالة الرجفان (توقف القلب دون نبض)" },
    equipment: [
      { fr: "Défibrillateur manuel ou DAE et électrodes adaptées à l'âge, à la morphologie et à l'appareil.", ar: "مزيل رجفان يدوي أو شبه آلي ولصاقات مناسبة للعمر وبنية الجسم والجهاز." },
      { fr: "Oxygène, BAVU et monitorage/réanimation selon l'algorithme d'arrêt cardiaque.", ar: "أكسجين وكيس-قناع ومعدات المراقبة والإنعاش وفق خوارزمية توقف القلب." },
    ],
    steps: [
      { fr: "Cette fiche concerne un arrêt cardiaque sans pouls avec FV/TV sans pouls : choc non synchronisé. Si le patient a un pouls et est instable, utiliser la fiche de cardioversion synchronisée.", ar: "هذه البطاقة لتوقف القلب دون نبض مع رجفان بطيني/تسرع بطيني دون نبض: صدمة غير متزامنة. إذا كان للمريض نبض وكان غير مستقر، استخدم بطاقة تقويم النظم المتزامن." },
      { fr: "Placer les électrodes en position antéro-latérale ou antéro-postérieure selon l'âge, la morphologie, l'appareil et sa notice.", ar: "ضع اللصاقات أمامية-جانبية أو أمامية-خلفية بحسب العمر وبنية الجسم والجهاز وتعليماته." },
      { fr: "Choisir l'énergie selon le fabricant et l'algorithme d'arrêt cardiaque adopté localement. Les recommandations pédiatriques AHA/AAP et ERC diffèrent pour l'énergie initiale : appliquer une seule filière locale, sans mélanger les valeurs.", ar: "اختر الطاقة وفق الشركة المصنّعة وخوارزمية توقف القلب المعتمدة محلياً. تختلف توصيات AHA/AAP وERC للأطفال في الطاقة الأولى؛ اتبع مساراً محلياً واحداً ولا تخلط القيم." },
      { fr: "Annoncer « écartez-vous », vérifier visuellement que personne ne touche le patient, puis délivrer le choc non synchronisé.", ar: "أعلن «ابتعدوا»، وتأكد بصرياً أن لا أحد يلمس المريض، ثم أعطِ الصدمة غير المتزامنة." },
      { fr: "Reprendre immédiatement la RCP après le choc, sans contrôle immédiat du pouls ; réévaluer au moment prévu par l'algorithme d'arrêt cardiaque.", ar: "استأنف الإنعاش فوراً بعد الصدمة دون فحص فوري للنبض؛ وأعِد التقييم في التوقيت المحدد بخوارزمية توقف القلب." },
    ],
    nursing: [
      { fr: "Tracer le rythme, l'énergie délivrée, l'heure, la position des électrodes et la réponse ; maintenir les compressions selon l'algorithme.", ar: "سجّل النظم والطاقة ووقت الصدمة وموضع اللصاقات والاستجابة؛ وواصل الضغطات وفق الخوارزمية." },
      { fr: "Cette fiche ne remplace pas le choix local du protocole pédiatrique ni les instructions du défibrillateur.", ar: "هذه البطاقة لا تحل محل اختيار بروتوكول الأطفال محلياً أو تعليمات مزيل الرجفان." },
    ],
    meta: {
      sources: [
        "AHA Adult ALS 2025, DOI 10.1161/CIR.0000000000001376; Adult Cardiac Arrest Algorithm 2025",
        "AHA/AAP PALS 2025, DOI 10.1161/CIR.0000000000001368; ERC PLS 2025, DOI 10.1016/j.resuscitation.2025.110767",
        "ERC Adult ALS 2025, DOI 10.1016/j.resuscitation.2025.110769",
      ],
      lastReviewed: "2026-10",
    },
  },
  {
    id: "synchronized-cardioversion",
    title: { fr: "Cardioversion synchronisée (tachyarythmie avec pouls)", ar: "تقويم النظم المتزامن (تسرع نظم مع وجود نبض)" },
    equipment: [
      { fr: "Défibrillateur avec mode SYNC, électrodes adaptées, monitorage ECG/SpO₂/TA et matériel de réanimation disponible.", ar: "مزيل رجفان بوضع SYNC، ولصاقات مناسبة ومراقبة تخطيط القلب والتشبع والضغط ومعدات إنعاش متاحة." },
    ],
    steps: [
      { fr: "Confirmer une tachyarythmie avec pouls et une instabilité clinique. En l'absence de pouls, basculer vers l'algorithme d'arrêt cardiaque et la défibrillation non synchronisée.", ar: "أكّد وجود تسرع نظم مع نبض وعدم استقرار سريري. عند غياب النبض، انتقل إلى خوارزمية توقف القلب وإزالة الرجفان غير المتزامنة." },
      { fr: "Installer le monitorage et les électrodes selon l'appareil ; préparer la sédation si elle est appropriée et ne retarde pas un choc urgent, selon le protocole.", ar: "ركّب المراقبة واللصاقات وفق الجهاز؛ وحضّر التهدئة إن كانت مناسبة ولا تؤخر الصدمة العاجلة، وفق البروتوكول." },
      { fr: "Activer SYNC et vérifier les marqueurs sur les complexes QRS. Régler l'énergie selon le rythme, l'appareil et l'algorithme local ; il n'existe pas ici de valeur unique pour tous les rythmes.", ar: "فعّل SYNC وتحقق من علامات التزامن على مركبات QRS. اضبط الطاقة بحسب النظم والجهاز والخوارزمية المحلية؛ لا توجد هنا قيمة واحدة لكل النظم." },
      { fr: "Annoncer « écartez-vous », vérifier l'absence de contact, puis délivrer le choc synchronisé. Avant chaque choc supplémentaire, vérifier/réactiver SYNC et régler l'énergie selon le protocole.", ar: "أعلن «ابتعدوا» وتأكد من عدم لمس المريض، ثم أعطِ الصدمة المتزامنة. قبل كل صدمة إضافية، تحقق من SYNC أو أعد تفعيله واضبط الطاقة وفق البروتوكول." },
      { fr: "Réévaluer immédiatement pouls, rythme et état clinique après chaque choc. Ne pas déclencher automatiquement la RCP si le pouls est présent ; si le pouls disparaît, suivre l'algorithme d'arrêt cardiaque.", ar: "أعِد فوراً تقييم النبض والنظم والحالة السريرية بعد كل صدمة. لا تبدأ الإنعاش تلقائياً إذا كان النبض موجوداً؛ وإذا غاب، اتبع خوارزمية توقف القلب." },
    ],
    nursing: [
      { fr: "Surveiller en continu ECG, TA, SpO₂ et état clinique ; tracer le rythme, l'énergie, l'activation SYNC, l'heure et la réponse.", ar: "راقب باستمرار تخطيط القلب والضغط والتشبع والحالة السريرية؛ وسجّل النظم والطاقة وتفعيل SYNC والوقت والاستجابة." },
    ],
    meta: {
      sources: [
        "AHA Electrical Cardioversion Algorithm 2025",
        "AHA Adult ALS 2025, DOI 10.1161/CIR.0000000000001376",
      ],
      lastReviewed: "2026-10",
    },
  },
  {
    id: "vvp",
    title: { fr: "Voie veineuse périphérique (VVP)", ar: "قثطرة وريدية محيطية" },
    equipment: [
      { fr: "Cathéter de calibre adapté à la thérapie et au patient, garrot, antiseptique cutané adapté, pansement et matériel de rinçage stérile compatible.", ar: "قثطار بمقياس مناسب للعلاج والمريض، وعاصبة ومطهر جلدي مناسب وضماد ومستلزمات غسل معقمة متوافقة." },
    ],
    steps: [
      { fr: "Hygiène des mains, expliquer le geste et rechercher l'accord du patient ; appliquer une technique aseptique sans contact.", ar: "نظّف اليدين واشرح الإجراء واطلب موافقة المريض؛ واستخدم تقنية معقمة دون لمس موضع الإدخال." },
      { fr: "Choisir, lorsque c'est approprié, une veine du membre supérieur distalement à la fosse antécubitale plutôt qu'au niveau ou au-dessus du pli du coude ; adapter le site au patient et à la thérapie.", ar: "اختر، متى كان ذلك مناسباً، وريداً في الجزء البعيد من الطرف العلوي بدلاً من الحفرة أمام المرفق أو أعلى منها؛ وكيّف الموضع بحسب المريض والعلاج." },
      { fr: "Désinfecter la peau avec l'antiseptique prévu par le protocole et sa notice ; laisser sécher complètement et ne plus toucher le site préparé.", ar: "طهّر الجلد بالمطهر المحدد في البروتوكول وتعليمات المنتج؛ واتركه يجف تماماً ولا تلمس موضع الإدخال بعد التطهير." },
      { fr: "Insérer le cathéter selon sa notice et la technique enseignée ; ne pas imposer une angulation ou une distance de garrot universelles.", ar: "أدخل القثطار وفق تعليماته والتقنية المدرّب عليها؛ ولا تفرض زاوية إدخال أو مسافة عاصبة موحدة." },
      { fr: "Fixer et étiqueter. Rincer uniquement avec une solution stérile compatible et le volume prévu pour le cathéter, le patient et le protocole ; arrêter en cas de douleur, gonflement ou résistance.", ar: "ثبّت القثطار وضع الملصق. اغسله فقط بمحلول معقم متوافق وبالحجم المحدد للقثطار والمريض والبروتوكول؛ وأوقف الغسل عند الألم أو التورم أو المقاومة." },
    ],
    nursing: [
      { fr: "Inspecter le site au moins quotidiennement et lors des soins ; arrêter l'utilisation et retirer le cathéter en cas de phlébite, infection ou dysfonctionnement, selon le protocole.", ar: "افحص الموضع مرة يومياً على الأقل وعند تقديم الرعاية؛ وأوقف الاستخدام وأزل القثطار عند التهاب الوريد أو العدوى أو الخلل، وفق البروتوكول." },
      { fr: "Ne pas perfuser par une voie douloureuse, gonflée, inflammatoire ou dont la perméabilité est incertaine.", ar: "لا تُعطِ محلولاً عبر خط مؤلم أو متورم أو ملتهب أو غير مؤكدة نفاذيته." },
    ],
    meta: {
      sources: [
        "WHO Peripheral Catheter Guidelines 2024, section 3 (ISBN 978-92-4-009382-9)",
        "CDC Intravascular Catheter Recommendations, sections 2.1, 3 and 5.1",
      ],
      lastReviewed: "2026-10",
    },
  },
  {
    id: "intra-osseuse",
    title: { fr: "Voie intra-osseuse (VIO)", ar: "الطريق داخل العظم" },
    equipment: [
      { fr: "Dispositif IO et aiguille de longueur adaptée au patient et au site selon la notice ; antisepsie, fixation et seringue de rinçage compatibles.", ar: "جهاز IO وإبرة بطول مناسب للمريض والموضع وفق تعليمات الجهاز؛ ومستلزمات تطهير وتثبيت ومحقنة غسل متوافقة." },
      { fr: "Utiliser uniquement un dispositif connu de l'opérateur et pour lequel il est formé ; ne pas transposer les instructions EZ-IO à un autre système.", ar: "استخدم جهازاً يعرفه الممارس وتلقى تدريباً عليه؛ ولا تطبق تعليمات EZ-IO على جهاز آخر." },
    ],
    steps: [
      { fr: "En urgence, envisager l'IO si l'accès IV n'est pas réalisable rapidement ; en arrêt cardiaque, l'AHA privilégie la tentative IV puis l'IO si l'IV échoue ou n'est pas faisable. Ne pas attendre un délai fixe.", ar: "في الطوارئ، يُنظر في IO إذا تعذر الحصول سريعاً على IV؛ وفي توقف القلب تفضّل AHA محاولة IV ثم IO إذا فشل الوريدي أو تعذر. لا تنتظر مدة ثابتة." },
      { fr: "Avant l'insertion, vérifier les contre-indications du dispositif. Pour EZ-IO : fracture de l'os visé, infection locale, tentative IO dans le même os au cours des 48 dernières heures, chirurgie orthopédique importante/prothèse pertinente ou repères anatomiques non identifiables ; choisir un autre site selon la notice.", ar: "قبل الإدخال، تحقق من موانع الجهاز. في EZ-IO: كسر العظم المستهدف، أو عدوى موضعية، أو محاولة IO في العظم نفسه خلال 48 ساعة الماضية، أو جراحة عظمية مهمة/طرف اصطناعي ذي صلة، أو تعذر تحديد المعالم التشريحية؛ واختر موضعاً آخر وفق التعليمات." },
      { fr: "Choisir le site et la longueur selon l'âge, l'anatomie, le dispositif et sa notice ; réaliser l'insertion par un opérateur formé, sans force excessive.", ar: "اختر الموضع وطول الإبرة بحسب العمر والتشريح والجهاز وتعليماته؛ وينفذ الإدخال ممارس مدرّب دون قوة مفرطة." },
      { fr: "L'aspiration de moelle peut aider mais son absence ne suffit pas à conclure à un échec. Rincer avec le volume recommandé pour le dispositif et l'âge ; confirmer stabilité, débit et absence de gonflement/extravasation.", ar: "قد يساعد شفط النقي، لكن عدم الحصول عليه لا يكفي للحكم بفشل الإدخال. اغسل بالحجم الموصى به للجهاز والعمر؛ وتحقق من الثبات والتدفق وغياب التورم أو التسرب." },
      { fr: "Administrer uniquement les médicaments indiqués par la filière de réanimation et compatibles avec la voie IO ; vérifier séparément dose, dilution et débit pour chaque médicament. Une perfusion sous pression peut être nécessaire selon le dispositif.", ar: "أعطِ فقط الأدوية المقررة في خوارزمية الإنعاش والملائمة لطريق IO؛ وتحقق لكل دواء من الجرعة والتخفيف والسرعة على حدة. قد يلزم الضغط للتسريب بحسب الجهاز." },
    ],
    nursing: [
      { fr: "Surveiller fréquemment le site, le membre, la douleur, le débit, la fixation et les signes d'extravasation ; pour EZ-IO, suivre la fréquence de surveillance de sa notice, au minimum toutes les heures pendant la perfusion.", ar: "راقب بشكل متكرر موضع الإدخال والطرف والألم والتدفق والتثبيت وعلامات التسرب؛ وبالنسبة إلى EZ-IO اتبع وتيرة المراقبة في تعليماته، مرة كل ساعة على الأقل أثناء التسريب." },
      { fr: "Passer à une voie IV dès qu'elle est disponible et retirer l'IO selon la notice. Pour EZ-IO : durée indiquée jusqu'à 24 h ; elle peut être prolongée jusqu'à 48 h chez les patients ≥12 ans seulement si aucun accès IV alternatif fiable n'est disponible. Il n'existe pas ici de règle générale imposant un retrait optimal avant 6 h.", ar: "انتقل إلى خط وريدي عند توفره وأزل IO وفق تعليمات الجهاز. في EZ-IO: مدة الاستخدام المحددة حتى 24 ساعة؛ ويمكن أن تمتد إلى 48 ساعة لمن عمره 12 سنة فأكثر فقط إذا لم يتوفر وصول وريدي بديل موثوق. لا توجد هنا قاعدة عامة بأن الإزالة المثلى خلال 6 ساعات." },
    ],
    meta: {
      sources: [
        "AHA Adult ALS 2025, DOI 10.1161/CIR.0000000000001376 (IV/IO in cardiac arrest)",
        "Teleflex Arrow EZ-IO IFU 8049, Rev. 01 (device-specific indications, sites, contraindications and dwell time)",
      ],
      lastReviewed: "2026-10",
    },
  },
  {
    id: "exsufflation",
    title: { fr: "Suspicion de pneumothorax sous tension — décompression urgente", ar: "اشتباه استرواح صدر ضاغط — إزالة ضغط عاجلة" },
    equipment: [
      { fr: "Dispositif de décompression choisi selon la morphologie, le protocole trauma local et sa notice ; oxygène et monitorage sans retarder la décompression indiquée.", ar: "جهاز إزالة ضغط يختار وفق بنية المريض وبروتوكول الرضوض المحلي وتعليمات الجهاز؛ وأكسجين ومراقبة دون تأخير إزالة الضغط عند استطبابها." },
    ],
    steps: [
      { fr: "Évoquer un pneumothorax sous tension devant une détresse respiratoire ou circulatoire aiguë avec contexte compatible et diminution/abolition unilatérale des bruits respiratoires. Le diagnostic est clinique ; ne pas attendre l'imagerie si l'état impose une décompression urgente.", ar: "اشتبه باسترواح ضاغط عند ضائقة تنفسية أو دورانية حادة في سياق ملائم مع نقص/غياب أصوات التنفس في جهة واحدة. التشخيص سريري؛ ولا تنتظر التصوير إذا كانت الحالة تستلزم إزالة ضغط عاجلة." },
      { fr: "Le site, le type de dispositif et sa longueur doivent provenir du protocole trauma local à jour et de la notice. Cette fiche ne fixe pas de longueur universelle : ne pas l'utiliser seule comme guide technique d'insertion.", ar: "يجب أن يحدد بروتوكول الرضوض المحلي المحدث وتعليمات الجهاز موضع الإدخال ونوع الجهاز وطوله. لا تحدد هذه البطاقة طولاً موحداً؛ فلا تستخدمها وحدها دليلاً تقنياً للإدخال." },
      { fr: "Si la décompression est indiquée, la faire sans délai par un opérateur formé, selon la technique du dispositif ; ne pas utiliser le seul bruit d'air comme preuve de succès.", ar: "إذا كانت إزالة الضغط مستطبة، ينفذها دون تأخير ممارس مدرّب وفق تقنية الجهاز؛ ولا تعتمد على صوت الهواء وحده دليلاً على النجاح." },
      { fr: "Réévaluer immédiatement respiration, circulation, SpO₂ et réponse clinique ; en cas de persistance ou d'aggravation, appliquer la filière locale de sauvetage et de drainage définitif.", ar: "أعِد فوراً تقييم التنفس والدورة الدموية والتشبع والاستجابة السريرية؛ وإذا استمرت الحالة أو ساءت، اتبع مسار الإنقاذ والتصريف النهائي المحلي." },
    ],
    nursing: [
      { fr: "Tracer l'indication, le côté, le site et le dispositif réellement utilisés, l'heure, les constantes et la réponse ; organiser la prise en charge définitive sans délai.", ar: "وثّق الاستطباب والجهة والموضع والجهاز المستخدم فعلياً والوقت والعلامات الحيوية والاستجابة؛ ونظّم الرعاية النهائية دون تأخير." },
    ],
    meta: {
      sources: [
        "Protocole trauma local à préciser avant utilisation comme guide technique",
        "Ahmad et al., WJES 2025, méta-analyse longueur/site, DOI 10.1186/s13017-025-00613-7",
      ],
      lastReviewed: "2026-10",
    },
  },
  {
    id: "masque-larynge",
    title: { fr: "Dispositif supraglottique (masque laryngé, i-gel…)", ar: "جهاز فوق المزمار (قناع حنجري، i-gel…)" },
    equipment: [
      { fr: "Dispositif supraglottique adapté au patient ; taille, lubrification et gestion du ballonnet uniquement selon la notice du modèle utilisé.", ar: "جهاز فوق المزمار مناسب للمريض؛ ويحدد المقاس والتزليق والتعامل مع البالون وفق تعليمات الطراز المستخدم فقط." },
      { fr: "Oxygène, BAVU, aspiration et capnographie avec courbe ; matériel de secours des voies aériennes disponible.", ar: "أكسجين وكيس-قناع وشفط وكابنوغراف ذو موجة؛ مع توافر معدات إنقاذ مجرى الهواء." },
    ],
    steps: [
      { fr: "Préoxygéner selon l'état clinique ; en cas de traumatisme cervical, maintenir les précautions rachidiennes et éviter toute extension non nécessaire.", ar: "أجرِ أكسجة مسبقة بحسب الحالة؛ وعند الاشتباه بإصابة الرقبة حافظ على احتياطات العمود الفقري وتجنب المد غير الضروري." },
      { fr: "Choisir le dispositif et sa taille selon le poids/l'âge et la notice ; insérer selon la technique propre au modèle, sans forcer.", ar: "اختر الجهاز ومقاسه بحسب الوزن/العمر وتعليمات الشركة؛ وأدخله بالطريقة الخاصة بالطراز دون قوة." },
      { fr: "Vérifier une ventilation efficace, l'étanchéité et la courbe capnographique continue ; si la ventilation est inefficace, appliquer l'algorithme local de correction/échec des voies aériennes.", ar: "تحقق من فعالية التهوية والإحكام وموجة كابنوغرافيا مستمرة؛ وإذا لم تكن التهوية فعالة فاتبع خوارزمية تصحيح/فشل مجرى الهواء المعتمدة محلياً." },
    ],
    nursing: [
      { fr: "Surveiller en continu EtCO₂, SpO₂, ventilation, fuites et déplacement du dispositif. Le niveau de protection contre l'aspiration dépend du modèle et ne doit pas être présumé.", ar: "راقب باستمرار EtCO₂ والتشبع والتهوية والتسرب وتحرك الجهاز. تختلف حماية الاستنشاق بحسب الطراز ولا يجوز افتراضها." },
    ],
    meta: {
      sources: [
        "ERC Adult ALS 2025, DOI 10.1016/j.resuscitation.2025.110769 (scope: adult ALS)",
        "AHA/AAP Neonatal Resuscitation 2025, DOI 10.1161/CIR.0000000000001367 (newborn-specific guidance)",
        "Use the instructions for the exact supraglottic device selected",
      ],
      lastReviewed: "2026-10",
    },
  },
  {
    id: "immobilisation-rachis",
    title: { fr: "Précautions rachidiennes / immobilisation sélective", ar: "احتياطات العمود الفقري والتثبيت الانتقائي" },
    equipment: [
      { fr: "Maintien manuel, collier cervical de taille adaptée si indiqué, scoop, maintien de tête et sangles ; matelas à dépression si disponible. Plan dur réservé à l'extraction.", ar: "تثبيت يدوي، وطوق رقبي مناسب إذا كان مستطباً، ومغرفة نقل ودعامات رأس وأحزمة؛ ويفضل فراش التفريغ إن توفر. اللوح الصلب للاستخراج فقط." },
    ],
    steps: [
      { fr: "Appliquer une protection manuelle et évaluer le risque rachidien selon des critères cliniques ; ne pas immobiliser systématiquement tout patient traumatisé.", ar: "وفّر حماية يدوية وقيّم خطر إصابة العمود بمعايير سريرية؛ ولا تثبّت روتينياً كل مصاب." },
      { fr: "Si un collier est indiqué, choisir la taille adaptée et ne pas le poser s'il compromet les voies aériennes ou en présence d'une déformation qui empêche son ajustement ; réévaluer les voies aériennes après la pose.", ar: "إذا كان الطوق مستطباً، اختر المقاس المناسب ولا تضعه إذا كان يهدد مجرى الهواء أو عند وجود تشوه يمنع ملاءمته؛ وأعِد تقييم مجرى الهواء بعد وضعه." },
      { fr: "Pour le transfert, utiliser un scoop et des supports de tête/sangles ; privilégier un matelas à dépression pour le transport si disponible. Adapter la manœuvre à la situation et à l'équipe formée.", ar: "استخدم مغرفة النقل ودعامات الرأس والأحزمة لنقل المريض؛ وفضّل فراش التفريغ أثناء النقل إن توفر. كيّف المناورة مع الحالة والفريق المدرّب." },
      { fr: "Le plan dur est un dispositif d'extraction, pas de transport : retirer le patient du plan dès que l'extraction est terminée et le transfert sûr organisé.", ar: "اللوح الصلب وسيلة للاستخراج لا للنقل؛ أزل المريض عنه بعد انتهاء الاستخراج وتنظيم نقل آمن." },
    ],
    nursing: [
      { fr: "Réévaluer voies aériennes, respiration, douleur, peau et température ; limiter le temps sur toute surface dure et documenter les changements neurologiques.", ar: "أعِد تقييم مجرى الهواء والتنفس والألم والجلد والحرارة؛ وقلّل الوقت على الأسطح الصلبة ووثّق أي تغير عصبي." },
    ],
    meta: {
      sources: [
        "NICE NG41, recommendations 1.1.2–1.1.4, 1.1.13–1.1.14 and 1.1.19",
      ],
      lastReviewed: "2026-10",
    },
  },
  {
    id: "accouchement-inopine",
    title: { fr: "Accouchement inopiné (pré-hospitalier)", ar: "ولادة غير متوقعة (ما قبل المستشفى)" },
    equipment: [
      { fr: "Kit de naissance propre, deux clamps, ciseaux stériles, linge sec et chaud ; aspiration néonatale disponible uniquement si obstruction suspectée.", ar: "عدة ولادة نظيفة، ومشبكان ومقص معقم وأقمشة جافة ودافئة؛ وشفاط للوليد عند الاشتباه بانسداد مجرى الهواء فقط." },
    ],
    steps: [
      { fr: "Aider la mère à adopter une position confortable et choisie, si la situation le permet ; anticiper l'évaluation d'un second jumeau.", ar: "ساعد الأم على اختيار وضعية مريحة إذا سمحت الحالة؛ واستعد لتقييم مولود توأم ثانٍ." },
      { fr: "Encourager la mère à suivre son envie spontanée de pousser ; éviter les consignes systématiques de poussée dirigée si elles ne sont pas nécessaires.", ar: "شجّع الأم على اتباع رغبتها الطبيعية في الدفع؛ وتجنب توجيه الدفع روتينياً إذا لم تكن هناك حاجة سريرية." },
      { fr: "Accueillir le nouveau-né sans traction. Si l'état du nouveau-né le permet, différer le clampage au moins 1 minute ; clampage plus précoce uniquement s'il est asphyxié et doit être déplacé immédiatement pour réanimation. Utiliser deux clamps et couper entre eux selon le matériel/protocole.", ar: "استقبل الوليد دون شد. إذا سمحت حالته، أخّر قطع الحبل دقيقة واحدة على الأقل؛ ولا يُقطع مبكراً إلا إذا كان مختنقاً ويلزم نقله فوراً للإنعاش. استخدم مشبكين واقطع بينهما وفق المعدات والبروتوكول." },
      { fr: "Sécher et réchauffer immédiatement ; peau-à-peau si le nouveau-né est stable. Ne pas aspirer systématiquement ; aspirer seulement si une obstruction est suspectée.", ar: "جفّف الوليد ودفّئه فوراً؛ واجعله جلداً لجلد إذا كانت حالته مستقرة. لا تجرِ الشفط روتينياً؛ ويُجرى فقط عند الاشتباه بانسداد." },
      { fr: "Évaluer respiration et état du nouveau-né ; si une réanimation est indiquée, suivre l'algorithme néonatal. Pour la mère, appliquer l'utérotonique prophylactique prévu par le protocole local, évaluer pertes sanguines et tonus utérin ; le massage utérin relève du traitement d'une hémorragie suspectée, pas d'une prévention systématique après oxytocine prophylactique.", ar: "قيّم تنفس الوليد وحالته؛ وإذا استدعى الأمر إنعاشاً فاتبع خوارزمية الوليد. للأم، أعطِ الدواء الوقائي المقبض للرحم الذي يحدده البروتوكول المحلي، وقيّم فقدان الدم وتوتر الرحم؛ ويُستخدم تدليك الرحم لعلاج النزف المشتبه به لا للوقاية الروتينية بعد إعطاء أوكسيتوسين وقائي." },
    ],
    nursing: [
      { fr: "Maintenir la chaleur du nouveau-né et de la mère, surveiller respiration/tonus du nouveau-né, saignement et tonus utérin ; organiser le transfert médical nécessaire.", ar: "حافظ على دفء الوليد والأم، وراقب تنفس الوليد وتوتره والنزف وتوتر الرحم؛ ونظّم النقل الطبي اللازم." },
    ],
    meta: {
      sources: [
        "WHO Intrapartum Care 2018, recommendations 34–36",
        "WHO Consolidated PPH Guidelines 2025, recommendations 19, 20, 23 and 26",
        "AHA/AAP Neonatal Resuscitation 2025, DOI 10.1161/CIR.0000000000001367",
      ],
      lastReviewed: "2026-10",
    },
  },
  {
    id: "neonat-ran",
    title: { fr: "Réanimation du nouveau-né (salle de naissance)", ar: "إنعاش الوليد في قاعة الولادة" },
    timeTarget: { fr: "Si une VPP est indiquée, la débuter dans les 60 s après la naissance.", ar: "إذا كانت التهوية بالضغط الإيجابي مستطبة، فابدأها خلال 60 ثانية من الولادة." },
    equipment: [
      { fr: "Source de chaleur, linge sec, thermomètre ; régler l'environnement selon l'âge gestationnel et surveiller la température du nouveau-né.", ar: "مصدر تدفئة وأقمشة جافة ومقياس حرارة؛ هيّئ البيئة بحسب عمر الحمل وراقب حرارة الوليد." },
      { fr: "Dispositif de ventilation (ballon ou T-piece) et masques adaptés au nouveau-né ; aspiration disponible, mais non systématique.", ar: "جهاز تهوية (بالون أو T-piece) وأقنعة مناسبة للوليد؛ وشفاط متاح دون استخدام روتيني." },
      { fr: "Oxymètre de pouls préductal et ECG si disponibles ; matériel de voie veineuse ombilicale et/ou IO selon l'algorithme et les compétences.", ar: "مقياس تأكسج نبضي قبل القناة الشريانية وتخطيط قلب إن توفرا؛ ومعدات وصول وريدي سري و/أو IO بحسب الخوارزمية والمهارات." },
      { fr: "Équipement d'intubation et médicaments préparés selon l'âge gestationnel, le poids et le protocole local ; vérifier le nom, la concentration et l'étiquetage.", ar: "معدات تنبيب وأدوية محضرة بحسب عمر الحمل والوزن والبروتوكول المحلي؛ تحقق من الاسم والتركيز والملصق." },
    ],
    steps: [
      { fr: "À la naissance : assurer chaleur, position adaptée des voies aériennes, séchage et stimulation selon le besoin. Ne pas aspirer systématiquement ; réserver l'aspiration à une obstruction suspectée.", ar: "عند الولادة: حافظ على الدفء ووضعية مناسبة لمجرى الهواء وجفّف وحفّز عند الحاجة. لا تجرِ الشفط روتينياً؛ واقصره على الاشتباه بانسداد." },
      { fr: "Après les étapes initiales, évaluer respiration et fréquence cardiaque. En cas d'apnée/gasping ou de FC <100/min persistante, commencer la VPP et viser son début dans les 60 s après la naissance.", ar: "بعد الخطوات الأولية، قيّم التنفس ومعدل القلب. عند انقطاع التنفس/اللهاث أو استمرار النبض دون 100/دقيقة، ابدأ التهوية بالضغط الإيجابي خلال أول 60 ثانية بعد الولادة." },
      { fr: "Ventiler à 30–60/min. Choisir la FiO₂ initiale selon l'âge gestationnel : ≥35 semaines, 21 % ; 32 à 34+6 semaines, 21–30 % ; <32 semaines, 30–100 %. Utiliser l'oxymétrie préductale et la réponse de la FC pour guider les ajustements.", ar: "هوِّ بمعدل 30–60/دقيقة. اختر FiO₂ الأولية بحسب عمر الحمل: 21% عند 35 أسبوعاً فأكثر؛ 21–30% من 32 إلى 34+6 أسبوعاً؛ و30–100% دون 32 أسبوعاً. استخدم مقياس التأكسج قبل القناة الشريانية واستجابة النبض لتوجيه التعديل." },
      { fr: "Si la FC reste <60/min après au moins 30 s de ventilation efficace malgré les mesures correctives, commencer les compressions coordonnées 3:1 avec ventilation ; utiliser 100 % d'oxygène pendant les compressions puis ajuster selon la SpO₂.", ar: "إذا بقي النبض دون 60/دقيقة بعد 30 ثانية على الأقل من التهوية الفعالة رغم إجراءات التصحيح، ابدأ ضغطات متزامنة مع التهوية بنسبة 3:1؛ واستخدم أكسجين 100% أثناء الضغطات ثم عدّل وفق التشبع." },
      { fr: "Si la FC reste <60/min après 60 s de compressions et ventilation adéquates, administrer l'adrénaline 0,01–0,03 mg/kg par voie intravasculaire, idéalement UVC ; l'IO peut être envisagée si l'accès veineux n'est pas faisable. Pour une solution à 0,1 mg/mL (1:10 000), cela correspond à 0,1–0,3 mL/kg ; suivre le protocole pour la répétition et le rinçage de 3 mL.", ar: "إذا بقي النبض دون 60/دقيقة بعد 60 ثانية من الضغطات والتهوية الكافيتين، أعطِ الأدرينالين 0.01–0.03 ملغ/كغ داخل الأوعية، ويفضل عبر الوريد السري؛ ويمكن التفكير في IO إذا تعذر الوريدي. لمحلول تركيزه 0.1 ملغ/مل (1:10,000)، يعادل ذلك 0.1–0.3 مل/كغ؛ واتبع البروتوكول لتكرار الجرعة وغسل 3 مل." },
      { fr: "Réévaluer FC, respiration, SpO₂ et température à intervalles rapprochés selon l'algorithme ; si FC ≥100/min et respiration efficace, poursuivre les soins de transition et la surveillance.", ar: "أعِد تقييم النبض والتنفس والتشبع والحرارة على فترات متقاربة وفق الخوارزمية؛ وإذا بلغ النبض 100/دقيقة مع تنفس فعال، واصل رعاية الانتقال والمراقبة." },
    ],
    nursing: [
      { fr: "Maintenir la température du nouveau-né entre 36,5 et 37,5 °C ; prévenir hypo- et hyperthermie et documenter les mesures.", ar: "حافظ على حرارة الوليد بين 36.5 و37.5°م؛ وامنع انخفاضها أو ارتفاعها ووثّق القياسات." },
      { fr: "Tracer les heures de naissance, début de VPP si indiquée, compressions, médicaments/voies et réponses ; appliquer les limites de dose du protocole néonatal.", ar: "وثّق وقت الولادة وبدء التهوية عند استطبابها والضغطات والأدوية والطرق والاستجابات؛ واتبع حدود الجرعة في بروتوكول الوليد." },
    ],
    checklist: {
      pre: [
        { fr: "Source de chaleur, ventilation, masques, oxymètre/ECG et aspiration fonctionnels.", ar: "مصدر التدفئة والتهوية والأقنعة ومقياس التأكسج/تخطيط القلب والشفط تعمل." },
        { fr: "Si adrénaline prévue : concentration clairement vérifiée/étiquetée (1:10 000 = 0,1 mg/mL) et calcul indépendant selon le poids.", ar: "إذا كانت الأدرينالين مطلوبة: تحقق من التركيز والملصق بوضوح (1:10,000 = 0.1 ملغ/مل) واحسب الجرعة بحسب الوزن مع تحقق مستقل." },
        { fr: "Rôles annoncés (ventilation, compressions, médicaments, chronométrage).", ar: "أدوار معلنة (التهوية والضغطات والأدوية والتوقيت)." },
      ],
    },
    meta: {
      sources: [
        "AHA/AAP Neonatal Resuscitation 2025, DOI 10.1161/CIR.0000000000001367 (sections ventilation, oxygen, compressions, vascular access, epinephrine)",
        "ERC Newborn Resuscitation 2025, DOI 10.1016/j.resuscitation.2025.110766",
        "Sankaran et al., Arch Dis Child Fetal Neonatal Ed 2021, DOI 10.1136/archdischild-2020-321034 (animal model; flush evidence)",
      ],
      lastReviewed: "2026-10",
    },
  },
];

export function getProcedure(id: string) {
  return procedures.find((p) => p.id === id);
}

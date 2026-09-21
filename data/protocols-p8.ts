// v8.0 — Phase 8 : toxico avancée (méthanol, tricycliques, bêta-bloquants/inhibiteurs calciques),
// urgences tunisiennes (serpent, rage), endocrino (hyponatrémie sévère, crise surrénale, crise thyréotoxique),
// urgence scrotale (torsade testiculaire).
import type { Protocol } from "./types";

export const protocolsPhase8: Protocol[] = [
  {
    id: "intoxication-methanol",
    title: { fr: "Intoxication au méthanol (alcool frelaté)", ar: "تسمم بالميثانول (كحول مغشوش)" },
    category: "toxicologie",
    severity: "critical",
    summary: { fr: "Tue par cécité et acidose. Antidote immédiat (éthanol à défaut de fomépizole), corriger l'acidose, hémodialyse sans discuter si signes visuels.", ar: "يقتل بالعمى والحماض. ترياق فوري (إيثانول عند غياب الفوميبازول)، تصحيح الحماض، وديلزة دون تردد عند الأعراض البصرية." },
    exams: {
      bio: [{ fr: "Gazométrie + trou anionique, osmolalité mesurée (trou osmolaire), glycémie, fonction rénale, lactate, méthanolémie si disponible", ar: "غازات + فجوة أنيونية، أسموزية مقاسة (فجوة أسموزية)، سكر، كلى، لاكتات، مستوى الميثانول إن توفر" }],
      img: [{ fr: "TDM cérébrale si coma (nécrose putaminale évocatrice)", ar: "ماسح دماغي عند الغيبوبة (نخر النواة العدسية موحٍ)" }],
    },
    steps: [
      { title: { fr: "Suspecter : ingestion d'alcool non commercial (qaraymi, alcool à brûler, eau de Cologne), troubles visuels (« tempête de neige »), acidose à trou anionique élevé", ar: "اشتهِ: شرب كحول غير تجاري (قرايمي، كحول حرق، كولونيا)، اضطراب بصري (عاصفة ثلج)، حماض بفجوة أنيونية عالية" }, detail: { fr: "Le méthanol pur est sans danger ; ce qui tue, c'est son métabolite (acide formique) — d'où l'urgence de bloquer l'ADH.", ar: "الميثانول نفسه غير سام؛ القاتل هو مستقلبه (حمض الفورميك) — لذا الاستعجال في حصر ADH." } },
      { title: { fr: "PAS de lavage gastrique, PAS de charbon actif (absorption trop rapide, inefficace)", ar: "لا غسل معدة، لا فحم منشط (امتصاص سريع جداً وغير مجدٍ)" } },
      { title: { fr: "ANTIDOTE sans attendre le dosage : fomépizole 15 mg/kg IV si disponible ; sinon ÉTHANOL per os/SNG : charge 0,6-0,8 g/kg puis 0,1-0,15 g/kg/h", ar: "الترياق دون انتظار التحليل: فوميبازول 15 ملغ/كغ وريدي إن توفر؛ وإلا إيثانول فموياً/أنبوب: تحميل 0.6-0.8 غ/كغ ثم 0.1-0.15 غ/كغ/س" }, detail: { fr: "Objectif alcoolémie 1-1,5 g/L. En hémodialyse, doubler le débit d'éthanol (0,25-0,35 g/kg/h).", ar: "الهدف كحولية 1-1.5 غ/ل. أثناء الديلزة ضاعف الإيثانول (0.25-0.35 غ/كغ/س)." } },
      { title: { fr: "Bicarbonate de sodium IV pour pH < 7,30 — répéter tant que l'acidose persiste", ar: "بيكربونات الصوديوم وريدياً إذا pH < 7.30 — أعد ما دام الحماض" } },
      { title: { fr: "Acide folinique/folique 1 mg/kg IV toutes 4-6 h (accélère l'élimination du formiate)", ar: "حمض الفولينيك/الفوليك 1 ملغ/كغ وريدي كل 4-6 س (يسرع إطراح الفورميات)" } },
      { title: { fr: "HÉMODIALYSE urgente si : troubles visuels, pH < 7,25 malgré bicarbonate, méthanol > 50 mg/dL, insuffisance rénale, ou aggravation", ar: "ديلزة عاجلة إذا: أعراض بصرية، pH < 7.25 رغم البيكربونات، ميثانول > 50 ملغ/دل، قصور كلوي، أو تدهور" } },
      { title: { fr: "Appel réa/néphrologie dès la suspicion — le délai décide de la vue", ar: "نداء إنعاش/كلى منذ الاشتباه — التأخير يقرر مصير البصر" } },
    ],
    keyPoints: [
      { fr: "Contexte tunisien : alcool de contrebande (qaraymi) et eau de Cologne ingérée — plusieurs cas groupés après fêtes/mariages. ≥ 2 personnes symptomatiques après la même boisson = penser méthanol pour TOUS.", ar: "سياق تونسي: الكحول المهرب (قرايمي) والكولونيا المشروبة — حالات جماعية بعد الأعراس. مصابان اثنان بعد نفس الشراب = اشتبه ميثانول للجميع." },
      { fr: "Trou osmolaire > 10 au début puis acidose à trou anionique quand il se referme : l'absence de trou osmolaire tardif n'exclut rien.", ar: "فجوة أسموزية > 10 أولاً ثم حماض بفجوة أنيونية حين تنغلق: غياب الفجوة الأسموزية المتأخر لا يستبعد شيئاً." },
      { fr: "L'éthanol est un antidote réel, validé et disponible partout : ne pas retarder le traitement en attendant le fomépizole.", ar: "الإيثانول ترياق حقيقي موثّق ومتوفر في كل مكان: لا تؤخر العلاج بانتظار الفوميبازول." },
    ],
    trajectory: [
      { when: { fr: "Troubles visuels (flou, scotomes, cécité)", ar: "أعراض بصرية (غباش، عتمات، عمى)" }, do: [
        { fr: "Hémodialyse IMMÉDIATE + éthanol/fomépizole — urgence absolue, la cécité devient définitive en heures.", ar: "ديلزة فورية + إيثانول/فوميبازول — طوارئ مطلقة، العمى يصبح دائماً خلال ساعات." },
      ]},
      { when: { fr: "Acidose qui se creuse malgré bicarbonate", ar: "حماض يتعمق رغم البيكربونات" }, do: [
        { fr: "Signe de production continue de formiate : antidote insuffisant (recharger l'éthanol) et dialyser.", ar: "علامة إنتاج مستمر للفورميات: الترياق غير كافٍ (أعد التحميل) وبدّل دموياً." },
      ]},
    ],
    medications: ["bicarbonate", "furosemide"],
    calculators: ["gap-metabolique", "sodium"],
    meta: { sources: ["EXTRIP methanol 2021", "UpToDate methanol poisoning", "Centre Anti Poison Tunis" ], lastReviewed: "2026-09" },
  },
  {
    id: "intoxication-tricycliques",
    title: { fr: "Intoxication aux antidépresseurs tricycliques", ar: "تسمم بمضادات الاكتئاب ثلاثية الحلقات" },
    category: "toxicologie",
    severity: "critical",
    summary: { fr: "Le tueur est cardiologique : QRS large ⇒ bicarbonate. Coma, convulsions, hypotension. Jamais de physostigmine.", ar: "القاتل قلبي: QRS عريض ⇒ بيكربونات. غيبوبة، اختلاجات، هبوط. ممنوع الفيزوستيغمين." },
    exams: {
      bio: [{ fr: "ECG immédiat puis continu, gazométrie, glycémie, ionogramme, paracétamolémie (co-ingestion)", ar: "تخطيط فوري ثم مستمر، غازات، سكر، شوارد، مستوى باراسيتامول (تسمم مشارك)" }],
      img: [],
    },
    steps: [
      { title: { fr: "ECG : QRS > 100 ms = risque convulsif ; QRS > 160 ms ou R en aVR > 3 mm = risque de tachycardie ventriculaire", ar: "التخطيط: QRS > 100 مللي ث = خطر اختلاج؛ QRS > 160 أو R في aVR > 3 مم = خطر تسرع بطيني" } },
      { title: { fr: "QRS > 100 ms : BICARBONATE de sodium 1-2 mEq/kg IV bolus, à répéter jusqu'à QRS < 100 ms, puis entretien (150 mEq/L) si nécessaire", ar: "QRS > 100: بيكربونات 1-2 ميللي مكافئ/كغ دفعات وريدية، تُعاد حتى QRS < 100، ثم صيانة (150 مكافئ/ل)" }, detail: { fr: "Objectifs : pH 7,45-7,55 (alcalinisation), surveiller K⁺ et surcharge sodée.", ar: "الأهداف: pH ‏7.45-7.55 (قلونة)، راقب البوتاسيوم والحمل الصوديومي." } },
      { title: { fr: "Convulsions : benzodiazépines (diazépam/midazolam) — JAMAIS de phénytoïne (aggrave le bloc sodique)", ar: "الاختلاجات: بنزوديازيبينات — أبداً فينيتوئين (يفاقم حصر الصوديوم)" } },
      { title: { fr: "Hypotension : remplissage prudent puis noradrénaline — éviter les amines à effet bêta pur", ar: "الهبوط: تعبئة حذرة ثم نورأدرنالين — تجنب الوديات بيتا الخالصة" } },
      { title: { fr: "Charbon actif 50 g si ingestion < 1-2 h ET voies aériennes protégées (risque de coma brutal)", ar: "فحم منشط 50 غ إذا البلع < 1-2 س والمجرى محمي (خطر غيبوبة مباغتة)" } },
      { title: { fr: "INTERDITS : physostigmine (asystolie), flumazénil, antiarythmiques classe Ia/Ic (procaïnamide, flécaïnide)", ar: "ممنوعات: فيزوستيغمين (لا انقباض)، فلومازينيل، مضادات نظم Ia/Ic" } },
      { title: { fr: "Surveillance ECG ≥ 6 h (formes LP : 24 h). Arrêt cardiaque réfractaire : RCP prolongée + émulsion lipidique", ar: "مراقبة تخطيط ≥ 6 س (مديدة المفعول: 24 س). توقف مقاوم: إنعاش مطول + مستحلب دهني" } },
    ],
    keyPoints: [
      { fr: "L'amitriptyline (Laroxyl®) reste prescrite et stockée dans les foyers tunisiens : première cause d'intoxication médicamenteuse grave du jeune adulte.", ar: "أميتريبتيلين (لاروكسيل) ما زال موصوفاً ومخزناً في البيوت التونسية: أول سبب تسمم دوائي خطير لدى الشباب." },
      { fr: "Le QRS est le meilleur marqueur de gravité — un ECG normal à H1 ne rassure pas : réévaluer à H6.", ar: "QRS هو أفضل مشعر خطورة — تخطيط طبيعي في س1 لا يطمئن: أعد التقييم في س6." },
    ],
    trajectory: [
      { when: { fr: "Tachycardie ventriculaire / torsades", ar: "تسرع بطيني / التواء ذروة" }, do: [
        { fr: "Bicarbonate en bolus répétés ; choc électrique si instabilité ; émulsion lipidique en rescue.", ar: "بيكربونات دفعات متكررة؛ صدمة كهربائية عند عدم الاستقرار؛ مستحلب دهني كإنقاذ." },
      ]},
      { when: { fr: "Coma profond avec hypoventilation", ar: "غيبوبة عميقة مع نقص تهوية" }, do: [
        { fr: "Intubation en séquence rapide — la suxaméthonium est acceptable ici ; alcaliniser AVANT d'intuber si possible.", ar: "تنبيب متسلسل سريع — السكسينيل كولين مقبول هنا؛ قلون قبل التنبيب إن أمكن." },
      ]},
    ],
    medications: ["bicarbonate", "diazepam", "midazolam", "noradrenaline", "emulsion-lipidique"],
    calculators: ["qtc", "gap-metabolique"],
    meta: { sources: ["Toxbase TCA", "AACT/EAPCCT position statement", "UpToDate"], lastReviewed: "2026-09" },
  },
  {
    id: "intoxication-bb-icc",
    title: { fr: "Intoxication aux bêta-bloquants et inhibiteurs calciques", ar: "تسمم بحاصرات بيتا ومثبطات الكالسيوم" },
    category: "toxicologie",
    severity: "critical",
    summary: { fr: "Choc + bradycardie réfractaires à l'atropine : insuline haute dose, glucagon, calcium (ICC), lipides, puis pacing. Mortalité élevée — agir tôt.", ar: "صدمة وبطء مقاومان للأتروبين: إنسولين بجرع عالية، غلوكاغون، كالسيوم (مثبطات)، دهون، ثم ناظم. وفيات عالية — تحرك مبكراً." },
    exams: {
      bio: [{ fr: "Glycémie (basse = BB, haute = ICC), K⁺, gazométrie, ECG, créatinine", ar: "السكر (منخفض = بيتا، مرتفع = كالسيوم)، بوتاسيوم، غازات، تخطيط، كرياتينين" }],
      img: [{ fr: "Radio abdomen si forme à libération prolongée (radio-opaque ?)", ar: "صورة بطن للشكل مديد المفعول (ظل شعاعي؟)" }],
    },
    steps: [
      { title: { fr: "Reconnaître : bradycardie + hypotension + (hypoglycémie ⇒ bêta-bloquant ; hyperglycémie ⇒ inhibiteur calcique)", ar: "تعرّف: بطء + هبوط + (نقص سكر ⇒ بيتا؛ فرط سكر ⇒ مثبط كالسيوم)" } },
      { title: { fr: "Atropine 1 mg IV (souvent inefficace — ne pas insister) + remplissage prudent 10-20 mL/kg", ar: "أتروبين 1 ملغ وريدي (غالباً غير مجدٍ — لا تلح) + تعبئة حذرة 10-20 مل/كغ" } },
      { title: { fr: "GLUCAGON : 5-10 mg IV en 5 min puis PSE 2-5 mg/h (antiémétique — vomissements fréquents)", ar: "غلوكاغون: 5-10 ملغ وريدي 5 د ثم مضخة 2-5 ملغ/س (مضاد إقياء — تقيؤ شائع)" } },
      { title: { fr: "INSULINE HAUTE DOSE (traitement pivot) : bolus 1 U/kg puis 0,5-1 U/kg/h (jusqu'à 10 U/kg/h en réa) + glucose pour euglycémie + K⁺", ar: "إنسولين عالي الجرعة (العلاج المحوري): دفعة 1 و/كغ ثم 0.5-1 و/كغ/س (حتى 10 و/كغ/س بالإنعاش) + غلوكوز لإبقاء السكر طبيعياً + بوتاسيوم" }, detail: { fr: "L'insuline est inotrope positif dans l'intoxication : elle restaure le métabolisme glucidique du myocarde. Surveiller K⁺ et glycémie q30 min.", ar: "الإنسولين مقوٍّ قلبي في هذا التسمم: يعيد استقلاب سكر العضلة القلبية. راقب البوتاسيوم والسكر كل 30 د." } },
      { title: { fr: "Inhibiteur calcique : calcium IV (chlorure 10 mL à 10 % ou gluconate 30 mL) — effet modeste mais réel", ar: "مثبطات الكالسيوم: كالسيوم وريدي (كلورور 10 مل 10% أو غلوكونات 30 مل) — أثر متواضع لكن حقيقي" } },
      { title: { fr: "Vasopresseur : noradrénaline (± adrénaline) en attendant l'effet de l'insuline (délai 30-60 min)", ar: "مقوٍّ وعائي: نورأدرنالين (± أدرنالين) بانتظار مفعول الإنسولين (30-60 د)" } },
      { title: { fr: "Émulsion lipidique 20 % en rescue : 1,5 mL/kg puis 0,25 mL/kg/min (molécules lipophiles : propranolol, vérapamil, diltiazem)", ar: "مستحلب دهني 20% كإنقاذ: 1.5 مل/كغ ثم 0.25 مل/كغ/د (جزيئات شحمية المحبة: بروبرانولول، فيراباميل، ديلتيازيم)" } },
      { title: { fr: "Pacing (BAV réfractaire), charbon si < 1-2 h, irrigation intestinale pour formes LP — appel réa + centre antipoison", ar: "ناظم خطى (حصار مقاوم)، فحم إذا < 1-2 س، غسل معوي للمديد — نداء إنعاش + مركز سموم" } },
    ],
    keyPoints: [
      { fr: "Un comprimé de vérapamil LP ou de propranolol chez l'enfant peut tuer : toute ingestion pédiatrique = observation hospitalière, même asymptomatique au départ (pic retardé des formes LP).", ar: "قرص واحد مديد من فيراباميل أو بروبرانولول قد يقتل الطفل: كل بلع أطفال = ملاحظة بالمستشفى ولو بلا أعراض (ذروة متأخرة)." },
      { fr: "La glycémie oriente le diagnostic : hypoglycémie ⇒ bêta-bloquant ; hyperglycémie ⇒ inhibiteur calcique (blocage de la sécrétion d'insuline).", ar: "السكر يوجه التشخيص: نقصه ⇒ بيتا؛ وفرطه ⇒ مثبط كالسيوم (حصر إفراز الإنسولين)." },
    ],
    trajectory: [
      { when: { fr: "Choc persistant malgré insuline + vasopresseurs", ar: "صدمة مستمرة رغم الإنسولين والمقويات" }, do: [
        { fr: "Émulsion lipidique, pacing, et discussion ECMO précoce avec la réa — ne pas attendre la défaillance multiviscérale.", ar: "مستحلب دهني، ناظم، ومناقشة إكمو مبكراً مع الإنعاش — لا تنتظر فشل الأعضاء." },
      ]},
      { when: { fr: "Hypoglycémie sous insuline haute dose", ar: "نقص سكر أثناء الإنسولين العالي" }, do: [
        { fr: "Ne pas arrêter l'insuline (c'est l'antidote) : augmenter le glucose IV et surveiller K⁺.", ar: "لا توقف الإنسولين (هو الترياق): زد الغلوكوز الوريدي وراقب البوتاسيوم." },
      ]},
    ],
    medications: ["glucagon", "insuline-rapide", "gluconate-calcium", "noradrenaline", "atropine", "emulsion-lipidique"],
    calculators: ["dose-poids", "debit-perfusion"],
    meta: { sources: ["ACMT/AACT expert consensus 2017", "UpToDate CCB/BB poisoning"], lastReviewed: "2026-09" },
  },
  {
    id: "morsure-serpent",
    title: { fr: "Morsure de serpent (vipères tunisiennes)", ar: "لسعة أفعى (أفاعي تونس)" },
    category: "toxicologie",
    severity: "urgent",
    summary: { fr: "Immobiliser, transporter, ne rien inciser ni sucer. Surveiller la coagulation (venin vipérin = coagulopathie). Sérum antivenimeux selon signes systémiques.", ar: "تثبيت ونقل، لا شق ولا مص. راقب التخثر (السم الأفعواني = اعتلال تخثر). المصل حسب الأعراض الجهازية." },
    exams: {
      bio: [{ fr: "TP/TCA, fibrinogène, plaquettes, NFS, CPK, créatinine, groupage", ar: "زمن البروثرومبين/TCA، فيبرينوجين، صفيحات، عد دم، CPK، كرياتينين، زمرة" }],
      img: [{ fr: "Échographie du membre si suspicion de collection/hématome profond", ar: "إيكو الطرف عند الشك بتجمع/ورم دموي عميق" }],
    },
    steps: [
      { title: { fr: "Calmer le patient, RETIRER bagues/bracelets/montres du membre mordu", ar: "طمئن المصاب، وانزع الخواتم والأساور من الطرف الملسوع" } },
      { title: { fr: "Immobiliser le membre (attelle) en dessous du niveau du cœur — transport allongé, le plus rapide possible", ar: "ثبّت الطرف (جبيرة) تحت مستوى القلب — نقل مستلقٍ بأسرع ما يمكن" } },
      { title: { fr: "INTERDITS absolus : garrot, incision, succion (buccale ou pompe), électrochoc, glace, alcool — aggravent tous la nécrose", ar: "ممنوعات مطلقة: عاصبة، شق، مص (فموي أو مضخة)، صعق، ثلج، كحول — كلها تفاقم النخر" } },
      { title: { fr: "Marquer au feutre la limite de l'œdème + heure — refaire toutes les 30 min (extension = gravité)", ar: "علّم بالقلم حد الوذمة + الوقت — أعد كل 30 د (الامتداد = خطورة)" } },
      { title: { fr: "Bilan de coagulation initial puis toutes 4-6 h : le venin de vipère consomme le fibrinogène (sang incoagulable = signe systémique)", ar: "تحاليل تخثر أولية ثم كل 4-6 س: سم الأفعى يستهلك الفيبرينوجين (دم غير متخثر = عرض جهازي)" } },
      { title: { fr: "Sérum antivenimeux (Institut Pasteur) si signes systémiques : hémorragies, hypotension, œdème extensif rapide, coagulopathie, troubles du rythme", ar: "المصل المضاد (معهد باستور) عند الأعراض الجهازية: نزوف، هبوط، وذمة سريعة الامتداد، اعتلال تخثر، اضطراب نظم" }, detail: { fr: "Voie IV lente en perfusion diluée — adrénaline prête à côté (réaction anaphylactique possible).", ar: "وريدي بطيء بمحلول مخفف — أدرنالين جاهز بجانبك (تفاعل أرجي ممكن)." } },
      { title: { fr: "Analgésie (paracétamol — PAS d'AINS ni d'aspirine à cause de la coagulopathie), prophylaxie tétanique, surveillance 24 h minimum", ar: "تسكين (باراسيتامول — لا مضادات التهاب ولا أسبرين بسبب التخثر)، وقاية كزاز، مراقبة 24 س على الأقل" } },
    ],
    keyPoints: [
      { fr: "Tunisie : Macrovipera lebetina au centre/sud et Cerastes cerastes au sud — pics juin-septembre, morsures nocturnes en zone rurale (dormir au sol).", ar: "تونس: المقرنة (Macrovipera) بالوسط والجنوب والطريشة (Cerastes) بالجنوب — الذروة جوان-سبتمبر، لسعات ليلية ريفية (النوم أرضاً)." },
      { fr: "Morsure « sèche » possible (pas d'inoculation) : absence d'œdème après 4-6 h + coagulation normale = observation sans sérum.", ar: "لسعة جافة ممكنة (دون سم): غياب وذمة بعد 4-6 س + تخثر طبيعي = مراقبة دون مصل." },
    ],
    trajectory: [
      { when: { fr: "Coagulopathie (TP allongé, fibrinogène effondré, saignements)", ar: "اعتلال تخثر (TP طويل، فيبرينوجين منهال، نزوف)" }, do: [
        { fr: "Sérum antivenimeux sans délai + transfusion de produits sanguins SEULEMENT après neutralisation du venin.", ar: "المصل فوراً + نقل منتجات الدم بعد معادلة السم فقط." },
      ]},
      { when: { fr: "Syndrome des loges : douleur intense, tension, déficit sensitif", ar: "متلازمة حجرات: ألم شديد، توتر، نقص حس" }, do: [
        { fr: "Sérum antivenimeux en priorité ; l'aponévrotomie est rarement indiquée et aggrave — avis chirurgical spécialisé.", ar: "المصل أولاً؛ شق اللفافة نادراً ما يُلجأ إليه ويزيد الضرر — رأي جراحي مختص." },
      ]},
    ],
    medications: ["paracetamol", "adrenaline", "hydrocortisone"],
    calculators: ["tetanos"],
    meta: { sources: ["OMS envenimations 2016", "Institut Pasteur de Tunis", "Médecine tropicale — vipères du Maghreb"], lastReviewed: "2026-09" },
  },
  {
    id: "prophylaxie-rage",
    title: { fr: "Morsure animale — prophylaxie antirabique", ar: "عضة حيوان — الوقاية من الكلب" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "Lavage 15 minutes IMMÉDIAT (geste qui sauve), classification OMS I/II/III, vaccination ± immunoglobulines au centre antirabique. La rage déclarée est mortelle à 100 %.", ar: "غسل 15 دقيقة فوراً (الإجراء المنقذ)، تصنيف OMS ‏I/II/III، تلقيح ± مصول بمركز داء الكلب. الكلب المعلن مميت 100%." },
    exams: {
      bio: [{ fr: "Statut vaccinal tétanique ; NFS/CRP si plaie infectée", ar: "وضع لقاح الكزاز؛ عد دم/CRP إذا الجرح ملتهب" }],
      img: [{ fr: "Radio si suspicion de corps étranger (dent) ou d'atteinte osseuse/articulaire", ar: "صورة عند الشك بجسم غريب (سن) أو إصابة عظم/مفصل" }],
    },
    steps: [
      { title: { fr: "LAVAGE immédiat : eau courante + savon pendant 15 MINUTES, puis antiseptique (bétadine ou alcool à 70°)", ar: "غسل فوري: ماء جارٍ + صابون 15 دقيقة، ثم مطهر (بيتادين أو كحول 70)" }, detail: { fr: "C'est LE geste qui réduit le plus le risque — même arrivé des heures après, laver avant tout autre soin.", ar: "هذا أهم إجراء لتقليل الخطر — حتى بعد ساعات، اغسل قبل أي علاج آخر." } },
      { title: { fr: "Ne PAS suturer d'emblée (fermer = piéger le virus). Si suture indispensable : lâche, APRÈS infiltration d'immunoglobulines", ar: "لا تخيط ابتداءً (الإغلاق يحبس الفيروس). إن لزم: خياطة رخوة بعد رش المصول" } },
      { title: { fr: "Classer l'exposition (OMS) : I = toucher/léchage peau saine ; II = griffures/éraflures sans saignement ; III = morsure transcutanée, léchage sur peau lésée/muqueuses, contact chauve-souris", ar: "صنّف التعرض (OMS): ‏I = لمس/لحس جلد سليم؛ II = خدوش دون نزف؛ III = عضة نافذة، لحس على جرح/أغشية، تماس خفاش" } },
      { title: { fr: "Catégorie I : lavage seul, pas de vaccination. Catégorie II : vaccin. Catégorie III : vaccin + immunoglobulines antirabiques infiltrées dans et autour de la plaie", ar: "فئة I: غسل فقط بلا لقاح. فئة II: لقاح. فئة III: لقاح + مصول كلبية ترش في الجرح وحوله" } },
      { title: { fr: "Vaccin IM dans le deltoïde (jamais la fesse) : schéma Essen J0, J3, J7, J14, J28 — adresser le JOUR MÊME au centre antirabique", ar: "اللقاح عضلياً بالدالية (أبداً بالألية): مخطط J0,3,7,14,28 — أحل في نفس اليوم إلى مركز داء الكلب" }, detail: { fr: "En Tunisie : centres antirabiques (Institut Pasteur de Tunis + centres régionaux). Sujet déjà vacciné : 2 doses J0-J3, pas d'immunoglobulines.", ar: "في تونس: مراكز داء الكلب (معهد باستور تونس + مراكز جهوية). من سبق تلقيحه: جرعتان J0-J3 دون مصول." } },
      { title: { fr: "Prophylaxie tétanique selon le statut + antibiothérapie (amoxicilline-clavulanate) pour morsures profondes/main/visage/immunodéprimés", ar: "وقاية كزاز حسب الوضع + مضاد حيوي (أموكسي-كلافولانيك) للعضات العميقة/اليد/الوجه/ناقصي المناعة" } },
      { title: { fr: "Déclarer la morsure ; observer l'animal 15 jours si possible (chien identifiable) — ne pas tuer l'animal sans avis vétérinaire", ar: "بلّغ عن العضة؛ راقب الحيوان 15 يوماً إن أمكن (كلب معروف) — لا تقتل الحيوان دون رأي بيطري" } },
    ],
    keyPoints: [
      { fr: "Tunisie : errance canine importante, majorité des expositions = morsures de chien chez l'enfant (main/visage). Toute morsure, même minime, même « chien connu et vacciné », passe par le centre antirabique — la décision finale ne se prend pas aux urgences.", ar: "تونس: كلاب سائبة كثيرة، وأكثر التعرضات عضات كلاب للأطفال (يد/وجه). كل عضة ولو بسيطة ومن كلب معروف وملقح تمر بمركز داء الكلب — القرار النهائي ليس للطوارئ." },
      { fr: "Immunoglobulines (catégorie III) : 20 UI/kg (humaines) ou 40 UI/kg (équines), le maximum infiltré dans la plaie, le reste IM à distance du vaccin.", ar: "المصول (فئة III): ‏20 و/كغ (بشرية) أو 40 و/كغ (خيول)، أكثرها في الجرح والباقي عضلياً بعيداً عن اللقاح." },
    ],
    trajectory: [
      { when: { fr: "Plaie infectée à 24-72 h (rougeur, pus, lymphangite)", ar: "جرح ملتهب خلال 24-72 س (احمرار، قيح، التهاب لمفي)" }, do: [
        { fr: "Amoxicilline-clavulanate (Pasteurella), prélèvement bactériologique, avis chirurgical si ténosynovite (morsure de main).", ar: "أموكسي-كلافولانيك (باستوريلا)، زرع جرثومي، رأي جراحي عند التهاب الأوتار (عضة اليد)." },
      ]},
      { when: { fr: "Départ du patient sans adresse de centre antirabique claire", ar: "خروج المريض دون عنوان واضح للمركز" }, do: [
        { fr: "Ne jamais laisser partir sans rendez-vous écrit au centre + rappel de la 1re dose de vaccin faite sur place si protocole local.", ar: "لا تدعه يغادر دون موعد مكتوب بالمركز + الجرعة الأولى موضعياً حسب البروتوكول المحلي." },
      ]},
    ],
    medications: ["cefotaxime"],
    calculators: ["tetanos"],
    meta: { sources: ["OMS rage 2018 (position paper)", "Ministère de la Santé Tunisie — programme antirabique", "Institut Pasteur de Tunis"], lastReviewed: "2026-09" },
  },
  {
    id: "hyponatremie-severe",
    title: { fr: "Hyponatrémie sévère symptomatique", ar: "نقص صوديوم شديد عرضي" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Convulsions/coma = NaCl 3 % en bolus de 150 mL. Corriger VITE pour sauver le cerveau, LENTEMENT ensuite (≤ 10 mmol/L/24 h) pour protéger le pont.", ar: "اختلاج/غيبوبة = NaCl ‏3% دفعات 150 مل. صحح سريعاً لإنقاذ الدماغ، ثم ببطء (≤ 10 ملي مول/24 س) لحماية الجسر." },
    exams: {
      bio: [{ fr: "Na⁺, K⁺, osmolalité plasmatique, osmolalité + Na⁺ urinaires, glycémie, TSH, cortisol (8 h), fonction rénale", ar: "صوديوم، بوتاسيوم، أسموزية البلازما، أسموزية وصوديوم البول، سكر، TSH، كورتيزول، كلى" }],
      img: [{ fr: "TDM cérébrale si doute diagnostique ou signe de focalisation", ar: "ماسح دماغي عند الشك التشخيصي أو علامة بؤرية" }],
    },
    steps: [
      { title: { fr: "Symptômes sévères (convulsions, coma, détresse respiratoire) : NaCl 3 % — 150 mL IV en 20 min, répéter ×2 jusqu'à amélioration ou ΔNa + 5 mmol/L", ar: "أعراض شديدة (اختلاج، غيبوبة، ضائقة تنفسية): ‏NaCl ‏3% — ‏150 مل وريدي 20 د، تُعاد مرتين حتى التحسن أو زيادة 5 ملي مول" }, detail: { fr: "Objectif initial : + 5 mmol/L en quelques heures — suffisant pour sortir de l'urgence œdémateuse.", ar: "الهدف الأولي: +5 ملي مول خلال ساعات — يكفي لإنهاء الوذمة الدماغية." } },
      { title: { fr: "Symptômes modérés (céphalées, nausées, confusion) : NaCl 3 % 150 mL en 20 min ou 2 mL/kg", ar: "أعراض متوسطة (صداع، غثيان، تشوش): ‏NaCl ‏3% ‏150 مل خلال 20 د أو 2 مل/كغ" } },
      { title: { fr: "PLAFOND de correction : ≤ 10 mmol/L sur 24 h (≤ 8 si haut risque de myélinolyse : Na < 105, hypokaliémie, alcoolisme, dénutrition, hépatopathie) puis ≤ 8 mmol/L/24 h suivantes", ar: "سقف التصحيح: ≤ 10 ملي مول/24 س (≤ 8 عند خطر انحلال النخاعين: صوديوم < 105، نقص بوتاسيوم، إدمان كحول، سوء تغذية، مرض كبدي) ثم ≤ 8/24 س التالية" } },
      { title: { fr: "Contrôler Na⁺ toutes les 2-4 h — voie veineuse centrale préférée pour le 3 %", ar: "افحص الصوديوم كل 2-4 س — يفضل وريد مركزي للمحلول 3%" } },
      { title: { fr: "Étiologie : osmolalité urinaire > 100 + Na urinaire > 30 chez un patient euvolémique = SIADH ; chercher la cause (médicaments, tumeur, SNC, poumon)", ar: "السبب: أسموزية بول > 100 + صوديوم بول > 30 مع حجم طبيعي = SIADH؛ ابحث عن السبب (أدوية، ورم، دماغ، رئة)" } },
      { title: { fr: "ASYMPTOMATIQUE découverte fortuite : restriction hydrique (SIADH), traitement de la cause — PAS de correction rapide", ar: "بلا أعراض (اكتشاف عارض): تحديد السوائل (SIADH) وعلاج السبب — لا تصحيح سريع" } },
    ],
    keyPoints: [
      { fr: "Le danger immédiat est l'œdème cérébral (Na < 120 + symptômes) ; le danger iatrogène est la myélinolyse centro-pontine par correction trop rapide — les deux tuent.", ar: "الخطر الفوري وذمة الدماغ (صوديوم < 120 + أعراض)؛ والخطر العلاجي انحلال نخاعين الجسر بالتصحيح السريع — كلاهما قاتل." },
      { fr: "Correction dépassée (ΔNa > 10 mmol/L/24 h) : STOPPER, redescendre avec G5 % 10 mL/kg en 1 h ± desmopressine — la sur-correction se rattrape.", ar: "تجاوز التصحيح (> 10 ملي مول/24 س): أوقف، أنزل بـ G5% ‏10 مل/كغ خلال س ± ديزموبريسين — التجاوز قابل للتدارك." },
      { fr: "Pseudo-hyponatrémie : hyperglycémie majeure (corriger : + 1,6 mmol/L de Na par 5,5 mmol/L de glucose), hypertriglycéridémie, protéines.", ar: "نقص صوديوم كاذب: فرط سكر شديد (صحح: +1.6 ملي مول صوديوم لكل 5.5 ملي مول غلوكوز)، فرط شحوم، بروتينات." },
    ],
    trajectory: [
      { when: { fr: "Convulsions qui persistent malgré 2 bolus de 3 %", ar: "اختلاجات مستمرة رغم دفعتين من 3%" }, do: [
        { fr: "3e bolus + midazolam + intubation si nécessaire + réanimation — ne pas dépasser le plafond horaire au-delà de l'urgence immédiate.", ar: "دفعة ثالثة + ميدازولام + تنبيب إن لزم + إنعاش — لا تتجاوز السقف بعد إسعاف اللحظة." },
      ]},
      { when: { fr: "Hypokaliémie associée", ar: "نقص بوتاسيوم مرافق" }, do: [
        { fr: "Corriger le K⁺ FAIT monter le Na⁺ — le compter dans le plafond de correction total.", ar: "تصحيح البوتاسيوم يرفع الصوديوم أيضاً — احسبه ضمن سقف التصحيح الكلي." },
      ]},
    ],
    medications: ["nacl-hypertonique", "furosemide"],
    calculators: ["sodium", "gap-metabolique"],
    meta: { sources: ["Guidelines européennes hyponatrémie 2014 (ESICM/ERA-EDTA)", "UpToDate"], lastReviewed: "2026-09" },
  },
  {
    id: "crise-surrenale",
    title: { fr: "Insuffisance surrénale aiguë (crise addisonienne)", ar: "قصور كظر حاد (نوبة أديسون)" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Choc réfractaire au remplissage ± corticothérapie au long cours interrompue = crise surrénale jusqu'à preuve du contraire. Hydrocortisone 100 mg IV IMMÉDIATE — ne pas attendre le dosage.", ar: "صدمة مقاومة للتعبئة ± كورتيزون طويل الأمد مقطوع = نوبة كظرية حتى يثبت العكس. هيدروكورتيزون 100 ملغ وريدي فوراً — لا تنتظر التحليل." },
    exams: {
      bio: [{ fr: "Cortisol 8 h + ACTH (prélever AVANT mais ne pas retarder l'injection), Na⁺/K⁺ (hyponatrémie + hyperkaliémie), glycémie (basse), gazos", ar: "كورتيزول 8 س + ACTH (اسحب قبل لكن لا تؤخر الحقن)، صوديوم/بوتاسيوم (نقص صوديوم + فرط بوتاسيوم)، سكر (منخفض)، غازات" }],
      img: [{ fr: "Scanner abdominal à distance si suspicion de cause surrénalienne (hémorragie, TB, métastases)", ar: "ماسح بطن لاحقاً عند الشك بسبب كظري (نزف، سل، نقائل)" }],
    },
    steps: [
      { title: { fr: "Suspecter devant : choc réfractaire au remplissage et aux vasopresseurs, asthénie extrême, vomissements, douleurs abdominales, fièvre", ar: "اشتهِ أمام: صدمة مقاومة للتعبئة والمقويات، وهن شديد، تقيؤ، ألم بطني، حمى" }, detail: { fr: "Terrain évocateur : corticothérapie prolongée arrêtée brutalement (asthme, polyarthrite, lupus), Addison connu, anticoagulants (hémorragie surrénale).", ar: "أرضية موحية: كورتيزون طويل مقطوع فجأة (ربو، رثية، ذئبة)، أديسون معروف، مضادات تخثر (نزف كظري)." } },
      { title: { fr: "HYDROCORTISONE 100 mg IV immédiate puis 200 mg/24 h (PSE continu ou 50 mg toutes les 6 h)", ar: "هيدروكورتيزون 100 ملغ وريدي فوراً ثم 200 ملغ/24 س (مضخة مستمرة أو 50 ملغ كل 6 س)" } },
      { title: { fr: "Remplissage : NaCl 0,9 % — 1 L dans la 1re heure (enfant : 20 mL/kg), puis selon PA/diurèse", ar: "تعبئة: ‏NaCl ‏0.9% — لتر في الساعة الأولى (طفل: 20 مل/كغ) ثم حسب الضغط والإدرار" } },
      { title: { fr: "Hypoglycémie : G30 % IV + entretien G5/G10 %", ar: "نقص السكر: ‏G30% وريدي + صيانة G5/G10%" } },
      { title: { fr: "Chercher et traiter le facteur déclenchant : infection (la plus fréquente), sepsis, chirurgie, arrêt des corticoïdes, gastro-entérite (malabsorption des comprimés)", ar: "ابحث عن المحرض وعالجه: إنتان (الأكثر شيوعاً)، إنتان دم، جراحة، إيقاف الكورتيزون، التهاب معدة-أمعاء (سوء امتصاص الأقراص)" } },
      { title: { fr: "Si hydrocortisone indisponible : dexaméthasone 4 mg IV (n'interfère pas avec le dosage ultérieur du cortisol)", ar: "إن غاب الهيدروكورتيزون: ديكساميثازون 4 ملغ وريدي (لا يتداخل مع قياس الكورتيزون لاحقاً)" } },
      { title: { fr: "Transfert réa — jamais d'arrêt brutal de la corticothérapie en sortie", ar: "تحويل إنعاش — لا إيقاف مفاجئ للكورتيزون عند الخروج أبداً" } },
    ],
    keyPoints: [
      { fr: "Le trio biologique évocateur : hyponatrémie + hyperkaliémie + hypoglycémie chez un patient en choc « inexpliqué ».", ar: "الثلاثي المخبري الموحِي: نقص صوديوم + فرط بوتاسيوم + نقص سكر لدى مريض بصدمة غير مفسرة." },
      { fr: "Tout patient sous corticoïdes depuis > 3 semaines qui consulte pour stress aigu (infection, trauma, chirurgie) a besoin d'une dose de stress — sinon crise.", ar: "كل مريض على كورتيزون منذ > 3 أسابيع مع شدة حادة (إنتان، رض، جراحة) يحتاج جرعة شدة — وإلا نوبة." },
    ],
    trajectory: [
      { when: { fr: "Choc qui ne remonte pas malgré hydrocortisone + remplissage adéquat", ar: "صدمة لا تتحسن رغم الهيدروكورتيزون والتعبئة الكافية" }, do: [
        { fr: "Chercher le sepsis sous-jacent (hémocultures, ATB large spectre) — la crise surrénale est rarement seule ; vasopresseur en attendant.", ar: "ابحث عن إنتان كامن (مزارع، مضادات واسعة) — النوبة نادراً ما تكون وحيدة؛ مقوٍّ وعائي ريثما." },
      ]},
      { when: { fr: "Douleur abdominale/lombaire + anticoagulants", ar: "ألم بطني/قطني + مضادات تخثر" }, do: [
        { fr: "Évoquer l'hémorragie surrénale bilatérale : scanner abdominal en urgence, corriger la coagulation.", ar: "اشتهِ نزفاً كظرياً ثنائياً: ماسح بطن عاجل وصحح التخثر." },
      ]},
    ],
    medications: ["hydrocortisone", "glucose30", "dexamethasone"],
    calculators: ["amines"],
    meta: { sources: ["Endocrine Society 2016", "SFMU — insuffisance surrénale aiguë"], lastReviewed: "2026-09" },
  },
  {
    id: "crise-thyrotoxique",
    title: { fr: "Crise thyréotoxique (tempête thyroïdienne)", ar: "نوبة تسمم درقي (عاصفة درقية)" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Hyperthermie + tachycardie + agitation chez un Basedow : PTU D'ABORD, iode UNE HEURE APRÈS, bêta-bloquant, corticoïdes, refroidir. Chercher le déclencheur (infection).", ar: "حرارة عالية + تسرع + هياج عند مريض غريفز: PTU أولاً، اليود بعد ساعة، حاصر بيتا، كورتيزون، تبريد. ابحث عن المحرض (إنتان)." },
    exams: {
      bio: [{ fr: "TSH effondrée + T4L/T3L très élevées (mais ne pas attendre pour traiter), NFS, bilan hépatique, ionogramme, hémocultures", ar: "TSH منهارة + T4L/T3L عالية جداً (لا تنتظرها للعلاج)، عد دم، كبد، شوارد، مزارع دم" }],
      img: [{ fr: "Radiographie thoracique, ECBU — traque du facteur déclenchant infectieux", ar: "صورة صدر، زرع بول — بحث عن المحرض الإنتاني" }],
    },
    steps: [
      { title: { fr: "Évoquer : fièvre > 38,5 °C + tachycardie > 140 + agitation/délire + IC/arythmie chez un dysthyroïdien connu ou une thyroïde volumineuse", ar: "اشتهِ: حمى > 38.5 + نبض > 140 + هياج/هذيان + قصور قلب/لانظم عند معروف بمرض درقي أو غدّة متضخمة" } },
      { title: { fr: "PTU (propylthiouracile) : charge 500-1000 mg PO/SNG puis 200-250 mg toutes les 4 h (bloque synthèse ET conversion T4→T3)", ar: "PTU: تحميل 500-1000 ملغ فموياً/أنبوب ثم 200-250 ملغ كل 4 س (يحصر التصنيع والتحويل)" }, detail: { fr: "À défaut : thiamazole (néomercazole) 20 mg toutes les 4-6 h (sans effet anti-conversion).", ar: "بديله: ثيامازول 20 ملغ كل 4-6 س (دون أثر مضاد للتحويل)." } },
      { title: { fr: "UNE HEURE APRÈS le PTU : iode (Lugol 10 gouttes ×3/j ou iodure de potassium) — bloque la libération hormonale. JAMAIS d'iode avant l'antithyroïdien", ar: "بعد ساعة من PTU: يود (لوغول 10 قطرات ×3/ي) — يحصر التحرير. أبداً يود قبل مضاد الدرق" } },
      { title: { fr: "Bêta-bloquant : propranolol 60-80 mg/6 h PO (ou esmolol IV si IC) — contrôle FC et conversion périphérique", ar: "حاصر بيتا: بروبرانولول 60-80 ملغ/6 س فموياً (أو إسمولول وريدي عند قصور القلب) — يضبط النبض والتحويل" } },
      { title: { fr: "Hydrocortisone 300 mg IV puis 100 mg/8 h — bloque la conversion et couvre l'insuffisance surrénale relative", ar: "هيدروكورتيزون 300 ملغ وريدي ثم 100 ملغ/8 س — يحصر التحويل ويغطي قصوراً كظرياً نسبياً" } },
      { title: { fr: "Refroidissement physique (glaçons, couverture) + PARACÉTAMOL — PAS d'aspirine (déplace les hormones des protéines)", ar: "تبريد فيزيائي (ثلج) + باراسيتامول — لا أسبرين (يزيح الهرمونات عن البروتينات)" } },
      { title: { fr: "Traquer et traiter le déclencheur : infection, chirurgie, arrêt de l'antithyroïdien, iode (scanner injecté), accouchement", ar: "ابحث عن المحرض وعالجه: إنتان، جراحة، إيقاف مضاد الدرق، يود (ماسح بالحقن)، ولادة" } },
      { title: { fr: "Réanimation : scope, traitement de l'IC/FA, cholestyramine 4 g/6 h en appoint — mortalité 10-30 % sans traitement", ar: "إنعاش: سكوب، علاج قصور القلب/الرجفان، كوليسترامين 4 غ/6 س إضافياً — وفيات 10-30% دون علاج" } },
    ],
    keyPoints: [
      { fr: "L'ordre des médicaments est vital : antithyroïdien D'ABORD, iode 1 h APRÈS — l'iode seul nourrit la crise (effet Jod-Basedow).", ar: "ترتيب الأدوية حيوي: مضاد الدرق أولاً واليود بعد ساعة — اليود وحده يغذي النوبة (Jod-Basedow)." },
      { fr: "Score de Burch-Wartofsky ≥ 45 = tempête thyroïdienne ; 25-44 = imminente — traiter dès l'imminence.", ar: "بورش-وارتوفسكي ≥ 45 = عاصفة؛ 25-44 = وشيكة — عالج منذ الوشيكة." },
    ],
    trajectory: [
      { when: { fr: "Aggravation neurologique (coma) ou choc", ar: "تدهور عصبي (غيبوبة) أو صدمة" }, do: [
        { fr: "Intubation, hydrocortisone à dose de crise, amines — et couverture d'insuffisance surrénale associée (syndrome polyglandulaire).", ar: "تنبيب، هيدروكورتيزون بجرعة نوبة، مقويات — وتغطية قصور كظري مرافق." },
      ]},
      { when: { fr: "Fièvre qui persiste à 48-72 h", ar: "حمى مستمرة 48-72 س" }, do: [
        { fr: "Réévaluation du déclencheur infectieux (scanner, hémocultures répétées) — la crise non contrôlée cache souvent un sepsis.", ar: "إعادة تقييم المحرض الإنتاني (ماسح، مزارع متكررة) — النوبة غير المنضبطة تخفي إنتاناً غالباً." },
      ]},
    ],
    medications: ["propylthiouracil", "propranolol", "hydrocortisone", "paracetamol", "esmolol"],
    calculators: ["burch-wartofsky", "qtc"],
    meta: { sources: ["ATA thyréotoxicose 2016", "Burch-Wartofsky 1993"], lastReviewed: "2026-09" },
  },
  {
    id: "torsade-testiculaire",
    title: { fr: "Torsade du cordon spermatique (torsion testiculaire)", ar: "التواء الحبل المنوي (التواء الخصية)" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Douleur scrotale aiguë du sujet jeune = torsade jusqu'à preuve du contraire. Fenêtre de 6 h. Le doute clinique impose l'exploration chirurgicale — le Doppler ne doit jamais retarder.", ar: "ألم صفني حاد عند شاب = التواء حتى يثبت العكس. نافذة 6 س. الشك السريري يفرض الاستكشاف الجراحي — الدوبلر لا يؤخر أبداً." },
    exams: {
      bio: [{ fr: "NFS/CRP (pour éliminer l'orchite), ECBU si fièvre", ar: "عد دم/CRP (لاستبعاد التهاب الخصية)، زرع بول عند الحمى" }],
      img: [{ fr: "Doppler scrotal si disponible SANS retarder la chirurgie : absence de flux = torsade ; un flux NORMAL n'exclut pas (torsion-détorsion)", ar: "دوبلر صفني إن توفر دون تأخير الجراحة: غياب الجريان = التواء؛ الجريان الطبيعي لا يستبعد (التواء-فك)" }],
    },
    steps: [
      { title: { fr: "Profil typique : garçon 12-18 ans, douleur brutale (même nocturne), nausées/vomissements, PAS de fièvre au début", ar: "النمط: فتى 12-18 سنة، ألم مفاجئ (ولو ليلياً)، غثيان/تقيؤ، بلا حمى بداية" } },
      { title: { fr: "Examen : testicule ascensionné, horizontalisé, dur ; réflexe crémastérien ABSENT ; signe de Prehn négatif (la surélévation n'améliore pas)", ar: "الفحص: خصية مرتفعة أفقية قاسية؛ منعكس المشمرة غائب؛ علامة برين سلبية (الرفع لا يحسن)" } },
      { title: { fr: "Ne PAS perdre de temps : chirurgien urologue appelé dès la suspicion — la viabilité chute après 6 h (100 % de sauvetage < 6 h, 20 % à 12 h, ~0 % à 24 h)", ar: "لا تهدر الوقت: ندِّ الجراح منذ الاشتباه — النجاة تتهاوى بعد 6 س (100% قبل 6 س، 20% عند 12 س، ~0% عند 24 س)" } },
      { title: { fr: "En attendant : à jeun, analgésie (AINS ou morphine), tentative de détorsion manuelle (rotation médiale→latérale, « ouvrir un livre ») — si soulagement immédiat, la chirurgie reste obligatoire", ar: "أثناء الانتظار: صيام، تسكين (مضاد التهاب أو مورفين)، محاولة فك يدوي (دوران من الأنسي للوحشي «كفتح كتاب») — إن ارتاح فوراً فالجراحة واجبة" } },
      { title: { fr: "Chirurgie : détorsion + fixation bilatérale (orchidopexie des DEUX côtés — l'anomalie d'ancrage est bilatérale)", ar: "الجراحة: فك + تثبيت ثنائي (تثبيت الخصيتين — العيب الترسيخي ثنائي)" } },
      { title: { fr: "Pièges : l'hydatide de Morgagni torsadée (signe du point bleu, douleur plus douce) et l'épididymite (fièvre, début progressif, flux augmenté au Doppler) ne sont pas chirurgicales", ar: "أفخاخ: التواء الزائدة المائية (علامة النقطة الزرقاء، ألم ألطف) والتهاب البربخ (حمى، بدء تدريجي، جريان زائد) لا يحتاجان جراحة" } },
    ],
    keyPoints: [
      { fr: "Règle d'or : toute douleur scrotale aiguë est une torsade jusqu'à preuve du contraire — le testicule perdu est celui qu'on a « observé ».", ar: "قاعدة ذهبية: كل ألم صفني حاد هو التواء حتى يثبت العكس — الخصية المفقودة هي التي «راقبناها»." },
      { fr: "Un Doppler normal n'élimine pas la torsade (torsion-détorsion intermittente) — la clinique prime, l'exploration tranche.", ar: "دوبلر طبيعي لا ينفي الالتواء (التواء-فك متقطع) — السريري أولاً والاستكشاف يفصل." },
    ],
    trajectory: [
      { when: { fr: "Délai > 12 h, testicule noir à l'exploration", ar: "تأخير > 12 س، خصية سوداء بالاستكشاف" }, do: [
        { fr: "Orchidectomie du côté nécrosé + fixation controlatérale systématique (protéger le testicule restant).", ar: "استئصال الجانب المتنخر + تثبيت الجهة المقابلة منهجياً (حماية الخصية الباقية)." },
      ]},
      { when: { fr: "Douleur récidivante cédant spontanément (torsion-détorsion)", ar: "ألم ناكس يزول تلقائياً (التواء-فك)" }, do: [
        { fr: "Orchidopexie bilatérale programmée rapidement — chaque épisode menace la viabilité.", ar: "تثبيت ثنائي مجدول سريعاً — كل نوبة تهدد النجاة." },
      ]},
    ],
    medications: ["morphine", "ketamine"],
    calculators: ["colique"],
    meta: { sources: ["EAU paediatric urology 2023", "AUA acute scrotum"], lastReviewed: "2026-09" },
  },
];

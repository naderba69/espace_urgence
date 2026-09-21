// v8.2 — Phase 10 : ingestions (caustiques/eau de Javel, pile bouton), urgences gynéco-obstétricales
// (GEU, dystocie des épaules), chirurgicale (fasciite nécrosante), neuro (HSA), onco (fièvre
// neutropénique), iatrogène (sérotoninergique/SNM), ophtalmo (glaucome aigu), ORL (épistaxis).
import type { Protocol } from "./types";

export const protocolsPhase10: Protocol[] = [
  {
    id: "ingestion-caustique",
    title: { fr: "Ingestion de caustique (eau de Javel, acide, soude)", ar: "ابتلاع مادة كاوية (جافيل، حمض، صودا)" },
    category: "toxicologie",
    severity: "critical",
    summary: { fr: "Ne JAMAIS faire vomir, ne JAMAIS neutraliser. Évaluer les signes de gravité, endoscopie à 12-48 h pour grader les lésions. Perforation = chirurgie.", ar: "لا تُقيّئ أبداً، لا تُعادِل أبداً. قيّم علامات الخطورة، تنظير 12-48 س لتصنيف الإصابة. انثقاب = جراحة." },
    exams: {
      bio: [{ fr: "Gazométrie (acidose = nécrose transmurale), NFS, ionogramme, créatinine, lactate, groupage", ar: "غازات (الحماض = نخر كامل الجدار)، عد دم، شوارد، كرياتينين، لاكتات، زمرة" }],
      img: [{ fr: "TDM thoraco-abdominal injecté si signes de gravité (perforation ?) — radio ASP peu sensible", ar: "طبقي صدر-بطن بالحقن عند علامات الخطورة (انثقاب؟) — الصورة البسيطة ضعيفة الحساسية" }],
    },
    steps: [
      { title: { fr: "Identifier le produit : nom, concentration, quantité, heure — rapporter l'emballage. Javel domestique diluée = souvent bénin ; soude/acide concentrés = gravité majeure", ar: "عرّف المادة: الاسم، التركيز، الكمية، الوقت — أحضر العبوة. الجافيل المنزلي المخفف = غالباً حميد؛ الصودا/الحمض المركز = خطورة كبرى" } },
      { title: { fr: "INTERDITS absolus : JAMAIS de vomissement provoqué, JAMAIS de neutralisation (acide contre base), JAMAIS de charbon actif (masque l'endoscopie), JAMAIS de lavage gastrique à l'aveugle", ar: "ممنوعات مطلقة: تقييء مستحث، معادلة (حمض ضد قلوي)، فحم منشط (يحجب التنظير)، غسل معدة أعمى" } },
      { title: { fr: "À jeun strict, 2 voies veineuses, remplissage si choc, antalgie IV (morphine)", ar: "صيام تام، وريدان، تعبئة عند الصدمة، تسكين وريدي (مورفين)" } },
      { title: { fr: "Signes de gravité immédiats : brûlures buccales étendues, dysphagie, sialorrhée, stridor, douleur thoracique/abdominale, vomissements, détresse respiratoire", ar: "علامات خطورة فورية: حروق فم واسعة، عسر بلع، سيلان لعاب، صرير، ألم صدر/بطن، تقيؤ، ضائقة تنفسية" } },
      { title: { fr: "Stridor/dyspnée = œdème laryngé : intubation PRÉCOCE par le plus expérimenté (larynx qui se ferme vite, matériel chirurgical prêt)", ar: "صرير/ضيق نفس = وذمة حنجرية: تنبيب مبكر بيد الأكثر خبرة (حنجرة تنغلق بسرعة، جهز العدة الجراحية)" } },
      { title: { fr: "Pas de signe de gravité + produit dilué : observation 6 h, reprise alimentaire progressive si tolérance", ar: "بلا علامات خطورة + مادة مخففة: ملاحظة 6 س، استئناف تغذية تدريجي عند التحمل" } },
      { title: { fr: "Signes de gravité OU produit concentré : hospitalisation + ENDOSCOPIE à 12-48 h (grade I-IIa : alimentation ; IIb-III : nutrition entérale/parentérale, risque de sténose)", ar: "علامات خطورة أو مادة مركزة: إدخال + تنظير 12-48 س (درجة I-IIa: تغذية؛ IIb-III: تغذية معوية/وريدية، خطر تضيق)" } },
      { title: { fr: "Perforation (pneumomédiastin, péritonite, sepsis) : chirurgie en urgence — œsophagectomie/gastrectomie selon nécrose", ar: "انثقاب (هواء منصف، التهاب بريتوان، إنتان): جراحة عاجلة — استئصال مريء/معدة حسب النخر" } },
    ],
    keyPoints: [
      { fr: "Tunisie : eau de Javel (jadvel) stockée dans des bouteilles de boisson = première cause chez l'enfant ; produits de débouchage de canalisations (soude) et acide chlorhydrique chez l'adulte, parfois geste suicidaire.", ar: "تونس: الجافيل المخزن بقوارير مشروبات = أول سبب عند الأطفال؛ مسلكات المجاري (صودا) وحمض الكلوريدريك عند البالغ، وأحياناً محاولة انتحار." },
      { fr: "L'absence de brûlure buccale n'exclut PAS une lésion œsophagienne grave (20-30 % des cas) — l'endoscopie tranche.", ar: "غياب حرق بالفم لا يستبعد إصابة مريئية خطيرة (20-30%) — التنظير هو الفيصل." },
      { fr: "L'endoscopie trop précoce (< 12 h) sous-estime les lésions ; trop tardive (> 48-72 h) risque la perforation iatrogène — la fenêtre est 12-48 h.", ar: "التنظير المبكر جداً (< 12 س) يقلل شأن الإصابة؛ والمتأخر (> 48-72 س) يخاطر بانثقاج علاجي — النافذة 12-48 س." },
    ],
    trajectory: [
      { when: { fr: "Dyspnée, stridor, voix rauque", ar: "ضيق نفس، صرير، بحة" }, do: [
        { fr: "Œdème laryngé imminent : intubation précoce en milieu équipé, trachéotomie de secours préparée.", ar: "وذمة حنجرية وشيكة: تنبيب مبكر بوسط مجهز، جهز شق حنجرة احتياطياً." },
      ]},
      { when: { fr: "Douleur abdominale + défense + acidose à 24-48 h", ar: "ألم بطن + دفاع + حماض 24-48 س" }, do: [
        { fr: "Nécrose gastrique/perforation : TDM + chirurgie en urgence absolue.", ar: "نخر معدي/انثقاب: طبقي + جراحة بطوارئ مطلقة." },
      ]},
    ],
    medications: ["morphine"],
    calculators: ["dose-poids", "poids-pediatrique"],
    meta: { sources: ["ESGE caustiques 2015", "Centre Anti Poison Tunis"], lastReviewed: "2026-09" },
  },
  {
    id: "pile-bouton",
    title: { fr: "Ingestion de pile bouton", ar: "ابتلاع بطارية زر" },
    category: "pediatrie",
    severity: "critical",
    summary: { fr: "Pile ≥ 20 mm dans l'œsophage = perforation en 2 H. Retrait endoscopique IMMÉDIAT — pas de jeûne qui retarde, pas d'attente. Dans l'estomac et asymptomatique : surveillance.", ar: "بطارية ≥ 20 مم بالمريء = انثقاب خلال ساعتين. نزع تنظيري فوري — لا صيام يؤخر، لا انتظار. بالمعدة وبلا أعراض: مراقبة." },
    exams: {
      bio: [{ fr: "Pas de bilan spécifique — l'imagerie prime", ar: "لا تحاليل نوعية — التصوير أولاً" }],
      img: [{ fr: "Radio cervico-thoraco-abdominale de face (localiser la pile : œsophage ? estomac ?) + profil si œsophagienne", ar: "صورة رقبية-صدرية-بطنية أمامية (حدد البطارية: مريء؟ معدة؟) + جانبية للمريئية" }],
    },
    steps: [
      { title: { fr: "Tout enfant avec ingestion suspectée/inconnue + salivation, refus alimentaire, vomissements, douleur thoracique = radio IMMÉDIATE", ar: "كل طفل بابتلاع مشتبه/مجهول + سيلان لعاب، رفض طعام، تقيؤ، ألم صدر = صورة فورية" } },
      { title: { fr: "Identifier le type : pile BOUTON (disque) = danger ; pile cylindrique classique = risque bien moindre. ≥ 20 mm (CR2032...) = risque maximal", ar: "عرّف النوع: بطارية زر (قرص) = خطر؛ الأسطوانية العادية = خطر أقل بكثير. ≥ 20 مم = أقصى خطر" } },
      { title: { fr: "PILE DANS L'ŒSOPHAGE : retrait endoscopique en URGENCE ABSOLUE (perforation, fistule trachéo/aorto-œsophagienne en 2 h)", ar: "البطارية في المريء: نزع تنظيري بطوارئ مطلقة (انثقاب، ناسور رغامي/أبهر-مريئي خلال ساعتين)" } },
      { title: { fr: "EN ATTENDANT l'endoscopie (si > 12 mois, ingestion < 12 h, asymptomatique) : MIEL 10 mL toutes les 10 min (max 6 doses) — réduit la nécrose alcaline", ar: "بانتظار التنظير (إذا > 12 شهراً، ابتلاع < 12 س، بلا أعراض): عسل 10 مل كل 10 د (6 دفعات كحد أقصى) — يقلل النخر القلوي" } },
      { title: { fr: "DANS L'ESTOMAC + asymptomatique + pile < 20 mm : retour à domicile, contrôle radio à 10-14 j (élimination naturelle)", ar: "في المعدة + بلا أعراض + بطارية < 20 مم: خروج، صورة مراقبة 10-14 يوماً (خروج طبيعي)" } },
      { title: { fr: "DANS L'ESTOMAC + symptomatique OU pile ≥ 20 mm OU enfant < 5 ans : retrait endoscopique programmé rapidement (24-48 h max)", ar: "في المعدة + أعراض أو بطارية ≥ 20 مم أو طفل < 5 سنوات: نزع تنظيري مجدول سريعاً (24-48 س كحد أقصى)" } },
      { title: { fr: "APRÈS retrait œsophagien : réévaluation œsophagienne à 2-4 semaines (sténose tardive), surveillance des fistules tardives (jusqu'à J28 — saignement sentinelle = urgence vitale)", ar: "بعد النزع المريئي: إعادة تقييم المريء 2-4 أسابيع (تضيق متأخر)، مراقبة الناسور المتأخر (حتى اليوم 28 — نزير نذير = طوارئ حيوية)" } },
      { title: { fr: "Ne PAS induire de vomissement, ne PAS nourrir en attendant si extraction imminente (sauf miel selon protocole)", ar: "لا تُقيّئ، لا تُطعم بانتظار النزع إذا كان وشيكاً (عدا العسل حسب البروتوكول)" } },
    ],
    keyPoints: [
      { fr: "Les piles des télécommandes, jouets et balances sont partout dans les foyers tunisiens — l'ingestion est souvent NON VUE : y penser devant tout enfant qui bave ou refuse de manger sans fièvre.", ar: "بطاريات أجهزة التحكم والألعاب والموازين في كل بيت تونسي — الابتلاع غالباً غير مُشاهد: اذكره أمام كل طفل يسيل لعابه أو يرفض الأكل بلا حمى." },
      { fr: "Le courant local + hydroxyde génèrent une nécrose alcaline en moins de 2 h — le délai d'extraction EST le pronostic.", ar: "التيار الموضعي + الهيدروكسيد يصنعان نخراً قلوياً خلال أقل من ساعتين — وقت النزع هو الإنذار." },
      { fr: "Fistule aorto-œsophagienne tardive : tout saignement digestif après extraction (même à J15) = angio-TDM en urgence absolue.", ar: "ناسور أبهر-مريئي متأخر: كل نزف هضمي بعد النزع (ولو باليوم 15) = طبقي وعائي بطوارئ مطلقة." },
    ],
    trajectory: [
      { when: { fr: "Hématémèse ou saignement après extraction (même tardif)", ar: "تقيؤ دم أو نزف بعد النزع (ولو متأخراً)" }, do: [
        { fr: "Fistule aorto-œsophagienne : angio-TDM immédiat, chirurgie vasculaire — mortalité majeure, ne jamais banaliser.", ar: "ناسور أبهر-مريئي: طبقي وعائي فوري، جراحة أوعية — وفيات كبرى، لا تستهن أبداً." },
      ]},
      { when: { fr: "Dysphagie à distance de l'extraction", ar: "عسر بلع بعد النزع بمدة" }, do: [
        { fr: "Sténose œsophagienne cicatricielle : dilatations endoscopiques itératives en milieu spécialisé.", ar: "تضيق مريئي ندبي: توسيعات تنظيرية متكررة بوسط مختص." },
      ]},
    ],
    medications: [],
    calculators: ["poids-pediatrique"],
    meta: { sources: ["NASPGHAN 2015", "Poison控制中心 button battery"], lastReviewed: "2026-09" },
  },
  {
    id: "geu",
    title: { fr: "Grossesse extra-utérine (GEU)", ar: "حمل خارج الرحم" },
    category: "obstetrique",
    severity: "critical",
    summary: { fr: "Toute femme en âge de procréer avec douleur pelvienne/saignement = β-hCG + écho. GEU rompue = choc hémorragique : chirurgie immédiate. La GEU tue encore — ne jamais l'oublier.", ar: "كل امرأة بعمر الإنجاب مع ألم حوضي/نزف = هرمون حمل + إيكو. حمل خارجي متمزق = صدمة نزفية: جراحة فورية. ما زال يقتل — لا تنسه أبداً." },
    exams: {
      bio: [{ fr: "β-hCG quantitatif (zone discriminatoire ~1500-2000 UI/L), NFS, groupage/rhésus, bilan pré-op", ar: "هرمون حمل كمي (المنطقة المميزة ~1500-2000 و/ل)، عد دم، زمرة، تحضير جراحي" }],
      img: [{ fr: "Échographie endovaginale : utérus vide + masse annexielle ± épanchement (sang) ; écho abdominale si choc", ar: "إيكو مهبلي: رحم فارغ + كتلة ملحقاتية ± انصباب (دم)؛ إيكو بطني عند الصدمة" }],
    },
    steps: [
      { title: { fr: "RÉFLEXE SYSTÉMATIQUE : β-hCG chez TOUTE femme en âge de procréer avec douleur pelvienne, saignement, malaise ou syncope — même avec contraception ou « règles » récentes", ar: "انعكاس منهجي: هرمون حمل لكل امرأة بعمر الإنجاب مع ألم حوض، نزف، دوار أو إغماء — ولو مع وسيلة حمل أو «دورة» حديثة" } },
      { title: { fr: "Triade classique (retard de règles, douleur, métrorragies) incomplète dans la moitié des cas — la syncope peut être le seul signe", ar: "الثلاثية الكلاسيكية (تأخر دورة، ألم، نزف رحمي) غير مكتملة في نصف الحالات — الإغماء قد يكون العلامة الوحيدة" } },
      { title: { fr: "GEU ROMPUE (choc, défense, épanchement abondant) : 2 voies VEINEUSES de gros calibre, remplissage, transfusion, CHIRURGIE immédiate (cœlioscopie ou laparotomie)", ar: "حمل خارجي متمزق (صدمة، دفاع، انصباب غزير): وريدان عريضان، تعبئة، نقل دم، جراحة فورية (منظار أو فتح بطن)" } },
      { title: { fr: "Anti-D systématique si rhésus négatif", ar: "مضاد D منهجي إذا الزمرة سالبة" } },
      { title: { fr: "GEU stable, non rompue : avis gynécologique — méthotrexate (critères stricts : β-hCG bas, masse < 4 cm, pas d'activité cardiaque, patiente compliant) ou chirurgie conservatrice", ar: "حمل خارجي مستقر غير متمزق: رأي نسائي — ميثوتريكسات (معايير صارمة: هرمون منخفض، كتلة < 4 سم، بلا نبض، مريضة ملتزمة) أو جراحة محافظة" } },
      { title: { fr: "Jamais de sortie sans diagnostic clair : β-hCG douteux + écho non concluante = contrôle β-hCG à 48 h OBLIGATOIRE (doublement normal intra-utérin, plateau/chute = GEU ou fausse couche)", ar: "لا خروج دون تشخيص واضح: هرمون مشكوك + إيكو غير حاسم = إعادة الهرمون بعد 48 س إلزامياً (التضاعف طبيعي لداخل الرحم، ثبات/هبوط = خارج رحم أو إجهاض)" } },
    ],
    keyPoints: [
      { fr: "Facteurs de risque : ATCD de GEU, chirurgie tubaire, salpingite/DST, tabac, stérilet, PMA — mais 30-50 % des GEU surviennent SANS facteur de risque.", ar: "عوامل الخطر: سوابق حمل خارجي، جراحة بوق، التهاب بوق/أمراض منتقلة، تدخين، لولب، تلقيح مساعد — لكن 30-50% تحدث دون عوامل." },
      { fr: "Un sac intra-utérin ne protège pas à 100 % (grossesse hétérotopique, surtout en PMA) ; un utérus vide avec β-hCG > zone discriminatoire = GEU jusqu'à preuve du contraire.", ar: "كيس داخل الرحم لا يحمي 100% (حمل متغاير المكان، خصوصاً بالتلقيح المساعد)؛ رحم فارغ مع هرمون فوق المنطقة المميزة = حمل خارجي حتى يثبت العكس." },
      { fr: "Douleur d'épaule (signe de Laffont) = irritation diaphragmatique par l'hémopéritoine — signe de rupture.", ar: "ألم كتف (علامة لافون) = تهيج حجابي بدم البريتوان — علامة تمزق." },
    ],
    trajectory: [
      { when: { fr: "Choc hémorragique installé (pâleur, tachycardie, hypotension)", ar: "صدمة نزفية قائمة (شحوب، تسرع، هبوط)" }, do: [
        { fr: "Transfusion massive + chirurgie immédiate — ne pas attendre l'écho de confirmation si le tableau est évident (épanchement + choc + β-hCG positif).", ar: "نقل كثيف + جراحة فورية — لا تنتظر إيكو التأكيد إذا اللوحة واضحة (انصباب + صدمة + هرمون إيجابي)." },
        { fr: "Protocole de choc hémorragique : transfusion massive, acide tranexamique, réanimation.", ar: "بروتوكول الصدمة النزفية: نقل كثيف، حمض الترانيكساميك، إنعاش." },
      ]},
      { when: { fr: "Sous méthotrexate : douleur croissante à J2-J3", ar: "تحت ميثوتريكسات: ألم متزايد باليوم 2-3" }, do: [
        { fr: "Douleur de rupture vs douleur de résolution : écho + β-hCG + avis gynéco — au moindre doute hémodynamique, chirurgie.", ar: "ألم تمزق مقابل ألم انحلال: إيكو + هرمون + رأي نسائي — عند أي شك دوراني، جراحة." },
      ]},
    ],
    medications: ["acide-tranexamique", "ketamine"],
    calculators: ["transfusion", "start"],
    meta: { sources: ["CNGOF GEU", "RCOG ectopic 2016"], lastReviewed: "2026-09" },
  },
  {
    id: "dystocie-epaules",
    title: { fr: "Dystocie des épaules", ar: "عسر ولادة الكتفين" },
    category: "obstetrique",
    severity: "critical",
    summary: { fr: "Après le dégagement de la tête, le menton se rétracte (signe de la tortue) : APPELER, MANŒUVRES dans l'ordre (McRoberts + pression sus-pubienne), JAMAIS de traction céphalique ni de pression fundique. Chronométrer.", ar: "بعد خروج الرأس ينسحب الذقن (علامة السلحفاة): نادِ، مناورات بالترتيب (ماك روبرتس + ضغط فوق العانة)، أبداً شد الرأس ولا ضغط قاع الرحم. سجّل الوقت." },
    exams: {
      bio: [{ fr: "Pas d'examen — urgence de manœuvre ; gazométrie au cordon après", ar: "لا فحوص — طوارئ مناورة؛ غازات الحبل بعدها" }],
      img: [],
    },
    steps: [
      { title: { fr: "RECONNAÎTRE : tête dégagée puis rétraction du menton contre le périnée (« turtle sign »), échec de la restitution, traction douce inefficace", ar: "تعرّف: خرج الرأس ثم انسحب الذقن للعجان («علامة السلحفاة»), فشل الارتداد، شد لطيف غير مجدٍ" } },
      { title: { fr: "APPELER à l'aide : obstétricien, pédiatre/néonatalogiste, anesthésiste, sage-femme supplémentaire — annoncer « dystocie des épaules »", ar: "نادِ المساعدة: توليد، أطفال/خديج، تخدير، قابلة إضافية — أعلن «عسر كتفين»" } },
      { title: { fr: "1) McROBERTS : hyperflexion des cuisses sur l'abdomen (2 aides) + 2) PRESSION SUS-PUBIENNE (pas fundique !) en appuyant latéralement derrière la symphyse", ar: "1) ماك روبرتس: ثني فخذين شديد على البطن (مساعدان) + 2) ضغط فوق العانة (لا قاعي!) جانبياً خلف الارتفاق" } },
      { title: { fr: "3) Manœuvres internes : RUBIN II (pousser l'épaule postérieure vers le thorax) puis WOOD (rotation en tire-bouchon) — épisiotomie large si nécessaire pour la place", ar: "3) مناورات داخلية: روبين II (دفع الكتف الخلفي نحو الصدر) ثم وود (دوران كالمثقاب) — شق عجان واسع إن لزم للمكان" } },
      { title: { fr: "4) Dégagement du bras postérieur (Jacquemier) : plier le coude, glisser la main le long du bras, sortir le bras devant le thorax", ar: "4) تحرير الذراع الخلفية (جاكمييه): اثنِ المرفق، مرر اليد على طول الذراع، أخرجها أمام الصدر" } },
      { title: { fr: "5) En dernier recours : position à quatre pattes (Gaskin), fracture claviculaire volontaire, Zavanelli (refoulement + césarienne) — décision obstétricale", ar: "5) آخر الحلول: وضعية الأربع (غاسكين)، كسر ترقوة مقصود، زافانيلي (إرجاع + قيصرية) — قرار توليدي" } },
      { title: { fr: "INTERDITS : traction céphalique axiale (arrachement plexus brachial), pression FUNDIQUE (impaction), manœuvre de Kristeller", ar: "ممنوعات: شد الرأس المحوري (قلع الضفيرة العضدية)، الضغط القاعي (انحشار)، مناورة كريستيلر" } },
      { title: { fr: "CHRONOMÉTRER à voix haute (risque de paralysie cérébrale au-delà de 5 min), consigner manœuvres et horaires, examen néonatal complet (plexus, clavicules)", ar: "سجّل الوقت بصوت عالٍ (خطر شلل دماغي بعد 5 د)، دوّن المناورات والأوقات، فحص مولود كامل (ضفيرة، ترقوتان)" } },
    ],
    keyPoints: [
      { fr: "Facteurs de risque (macrosomie, diabète, ATCD, travail long) absents dans > 50 % des cas — la moitié des dystocies sont imprévisibles.", ar: "عوامل الخطر (عملقة، سكري، سوابق، مخاض طويل) غائبة في أكثر من 50% — نصف الحالات غير متوقعة." },
      { fr: "Mémotechnique HELPERR : Help, Evaluate episiotomy, Legs (McRoberts), Pressure (sus-pubienne), Enter (manœuvres internes), Remove (bras postérieur), Roll (quatre pattes).", ar: "اختصار HELPERR: مساعدة، تقييم شق، أرجل (ماك روبرتس)، ضغط (فوق العانة)، دخول (داخليات)، تحرير الذراع، تدحرج (الأربع)." },
      { fr: "Toute la séquence doit être faite en moins de 5 minutes — l'équipe s'entraîne sur simulation pour ça.", ar: "كل التسلسل يجب أن يتم خلال أقل من 5 دقائق — الفريق يتدرب بالمحاكاة لأجل ذلك." },
    ],
    trajectory: [
      { when: { fr: "Échec après McRoberts + pression sus-pubienne (2 min)", ar: "فشل بعد ماك روبرتس + الضغط (دقيقتان)" }, do: [
        { fr: "Passer immédiatement aux manœuvres internes (Rubin II, Wood, Jacquemier) — ne pas répéter les tractions." , ar: "انتقل فوراً للمناورات الداخلية (روبن، وود، جاكمييه) — لا تكرر الشد." },
      ]},
      { when: { fr: "Nouveau-né extrait avec déficit du membre", ar: "مولود مستخرج مع عجز بالطرف" }, do: [
        { fr: "Paralysie du plexus brachial (Erb-Duchenne fréquente) : immobilisation douce, examen pédiatrique, kiné précoce, suivi à 3 mois.", ar: "شلل الضفيرة العضدية (إرب-دوشين شائع): تثبيت لطيف، فحص أطفال، علاج فيزيائي مبكر، متابعة 3 أشهر." },
      ]},
    ],
    medications: ["oxytocine"],
    calculators: ["neonat-ran"],
    meta: { sources: ["RCOG shoulder dystocia 2012", "HELPERR/ALSO"], lastReviewed: "2026-09" },
  },
  {
    id: "fasciite-necrosante",
    title: { fr: "Fasciite nécrosante (dermo-hypodermite bactérienne nécrosante)", ar: "التهاب اللفافة الناخر" },
    category: "traumatologie",
    severity: "critical",
    summary: { fr: "Douleur disproportionnée + peau qui vire au violet/crépitant + signes septiques = chirurgie DANS L'HEURE. L'antibiotique seul ne pénètre pas le tissu mort. Score LRINEC en aide, jamais en frein.", ar: "ألم غير متناسب + جلد يتحول بنفسجياً/مفرقع + علامات إنتانية = جراحة خلال ساعة. المضاد وحده لا ينفذ للنسج الميتة. سكور LRINEC عون لا كابح." },
    exams: {
      bio: [{ fr: "NFS, CRP, créatinine, CRP, Na⁺, glycémie, lactate, hémocultures, prélèvements per-op (bactério) — score LRINEC", ar: "عد دم، CRP، كرياتينين، صوديوم، سكر، لاكتات، مزارع دم، عينات أثناء الجراحة — سكور LRINEC" }],
      img: [{ fr: "PAS d'imagerie retardatrice : TDM/IRM seulement si doute diagnostique ET patient stable — le crépitant neigeux à la radio est tardif", ar: "لا تصوير مؤخر: طبقي/مرنان فقط عند الشك التشخيصي والمريض مستقر — الفرقعة الثلجية بالصورة متأخرة" }],
    },
    steps: [
      { title: { fr: "Signes d'alerte PRÉCOCES : douleur DISPROPORTIONNÉE aux signes cutanés, extension rapide en heures, fièvre/toxicité, placard érythémateux violacé, anesthésie cutanée en zone nécrosée", ar: "علامات إنذار مبكرة: ألم غير متناسب مع الآفة الجلدية، امتداد سريع بالساعات، حمى/سمية، لوحة حمامية بنفسجية، فقدان حس جلدي بمنطقة النخر" } },
      { title: { fr: "Signes tardifs (crépitant, phlyctènes hémorragiques, cyanèse, écoulement grisâtre) = diagnostic clinique évident mais déjà grave", ar: "علامات متأخرة (فرقعة، فقاعات نزفية، ازرقاق، إفراز رمادي) = تشخيص واضح لكنه متأخر" } },
      { title: { fr: "APPEL CHIRURGICAL IMMÉDIAT — le débridement dans l'heure est LE traitement ; mortalité + 7 % par heure de retard selon les séries", ar: "نداء جراحي فوري — التنضير خلال ساعة هو العلاج؛ الوفيات ترتفع ~7% بكل ساعة تأخير حسب السلاسل" } },
      { title: { fr: "Antibiothérapie TRIPLE IV immédiate (avant le bloc) : pipé-racilline/tazobactam (ou carbapénème) + CLINDAMYCINE (effet antitoxine) ± aminoside/anti-SARM selon contexte", ar: "مضادات ثلاثية وريدية فورية (قبل الصالة): بيبيراسيلين-تازوباكتام (أو كاربابينيم) + كليندامايسين (مضاد للذيفان) ± أمينوغليكوزيد/مضاد MRSA حسب السياق" } },
      { title: { fr: "Réanimation : remplissage large, noradrénaline précoce, contrôle glycémique strict, corriger la coagulation", ar: "إنعاش: تعبئة واسعة، نورأدرينالين مبكر، ضبط سكر صارم، تصحيح التخثر" } },
      { title: { fr: "Terrain à haut risque : diabète, obésité, immunodépression, alcoolisme, AINS récents (les AINS masquent et aggravent — les arrêter)", ar: "أرضيات عالية الخطر: سكري، بدانة، كبت مناعة، إدمان كحول، مضادات التهاب حديثة (تخفي وتفاقم — أوقفها)" } },
      { title: { fr: "Deuxième temps chirurgical programmé à 24-48 h (re-débridement systématique) ± VAC ; reconstruction à distance", ar: "وقت جراحي ثانٍ مجدول 24-48 س (تنضير معاد منهجي) ± علاج بالضغط السالب؛ ترميم لاحقاً" } },
    ],
    keyPoints: [
      { fr: "Le piège mortel : un « érysipèle » douloureux qui ne cadre pas (douleur extrême, toxicité, extension rapide) est une fasciite jusqu'au bloc — la frontière érysipèle/fasciite se tranche chirurgicalement.", ar: "الفخ القاتل: «حمرة» مؤلمة لا تنطبق (ألم شديد، سمية، امتداد سريع) هي التهاب لفافة حتى الصالة — الحدود بينهما تُحسم جراحياً." },
      { fr: "LRINEC ≥ 6 = probabilité élevée, MAIS un LRINEC bas n'exclut rien — le doute clinique impose l'exploration chirurgicale.", ar: "‏LRINEC ≥ 6 = احتمال عالٍ، لكن المنخفض لا يستبعد شيئاً — الشك السريري يفرض الاستكشاف الجراحي." },
      { fr: "Localisations traîtresses : périnée (Fournier — diabétique + douleur scrotale), post-chirurgie, varicelle de l'enfant (streptocoque A).", ar: "مواقع خادعة: العجان (فورنييه — سكري + ألم صفني)، بعد جراحة، حماق الطفل (عقديات A)." },
    ],
    trajectory: [
      { when: { fr: "Choc septique + crépitant + marbrures", ar: "صدمة إنتانية + فرقعة + تبرقش" }, do: [
        { fr: "Bloc immédiat sans attendre la réa « stabilisée » — le débridage EST la réanimation.", ar: "صالة عمليات فوراً دون انتظار «استقرار» الإنعاش — التنضير هو الإنعاش." },
        { fr: "Protocole choc septique en parallèle : remplissage, noradrénaline dès la 1re heure.", ar: "بروتوكول الصدمة الإنتانية بالتوازي: تعبئة، نورأدرينالين منذ الساعة الأولى." },
      ]},
      { when: { fr: "À 24-48 h : extension de la nécrose au 2e look", ar: "بـ 24-48 س: امتداد النخر بالنظرة الثانية" }, do: [
        { fr: "Re-débridement itératif programmé jusqu'à tissu sain — ne jamais clore sur un doute.", ar: "تنضير معاد متكرر حتى النسيج السليم — لا تغلق على شك." },
      ]},
    ],
    medications: ["clindamycine", "cefotaxime", "amikacine", "noradrenaline"],
    calculators: ["lrinec", "qsofa"],
    meta: { sources: ["SPILF DHB 2019", "LRINEC Wong 2004"], lastReviewed: "2026-09" },
  },
  {
    id: "hemorragie-sous-arachnoidienne",
    title: { fr: "Hémorragie sous-arachnoïdienne (rupture d'anévrisme)", ar: "نزف تحت العنكبوتية (تمزق أمهات الدم)" },
    category: "avc",
    severity: "critical",
    summary: { fr: "Céphalée « coup de tonnerre » maximale d'emblée = TDM SANS injection en urgence, puis PL si TDM normale à 6-12 h. Anévrisme confirmé = clip/coil < 72 h, nimodipine systématique.", ar: "صداع «صاعقة» أقصى منذ البدء = طبقي دون حقن طارئ، ثم بزل قطني إذا الطبقي طبيعي 6-12 س. أم دم مؤكدة = قص/لف < 72 س، نيموديبين منهجي." },
    exams: {
      bio: [{ fr: "PL si TDM normale (xanthochromie après 12 h), bilan pré-angio, groupage", ar: "بزل قطني إذا الطبقي طبيعي (اصفرار بعد 12 س)، تحضير للتصوير الوعائي، زمرة" }],
      img: [{ fr: "TDM cérébrale SANS injection (sensibilité ~100 % à 6 h) puis angio-TDM (anévrisme) ; angiographie conventionnelle = référence thérapeutique", ar: "طبقي دماغي دون حقن (حساسية ~100% عند 6 س) ثم تصوير وعائي (أم الدم)؛ القسطرة التقليدية = المرجع العلاجي" }],
    },
    steps: [
      { title: { fr: "Tableau : céphalée d'installation SECONDES, « la pire de ma vie », cervicales, vomissements, ± raideur de nuque, photophobie, syncope initiale", ar: "اللوحة: صداع خلال ثوانٍ، «أسوأ صداع بحياتي»، رقبية، تقيؤ، ± تصلب رقبة، رهاب ضوء، إغماء بدئي" } },
      { title: { fr: "TDM cérébrale SANS injection dans l'heure — l'hyperdensité des citernes signe le diagnostic", ar: "طبقي دماغي دون حقن خلال ساعة — فرط كثافة الصهاريج يؤكد التشخيص" } },
      { title: { fr: "TDM normale à 6-12 h du début : PONCTION LOMBAIRE (xanthochromie au spectrophotomètre) — ne pas écarter le diagnostic sur la TDM seule si délai > 6 h", ar: "طبقي طبيعي بعد 6-12 س من البدء: بزل قطني (اصفرار بالمطيافية) — لا تنفِ التشخيص بالطبقي وحده إذا التأخر > 6 س" } },
      { title: { fr: "Angio-TDM dès le diagnostic : localiser l'anévrisme — traitement par clipping ou coiling dans les 72 h (prévention de la récidive, mortelle dans 70 %)", ar: "تصوير وعائي منذ التشخيص: حدد أم الدم — علاج بالقص أو اللف خلال 72 س (منع النكس، مميت في 70%)" } },
      { title: { fr: "NIMODIPINE 60 mg/4 h PO (ou SNG) × 21 j — prévention du vasospasme (pic J4-J14), seule thérapie ayant prouvé un bénéfice", ar: "نيموديبين 60 ملغ/4 س فموياً (أو أنبوب) × 21 يوماً — وقاية من تشنج الأوعية (ذروة ي4-ي14)، العلاج الوحيد المثبت الفائدة" } },
      { title: { fr: "Mesures générales : repos strict, tête 30°, antalgiques (paracétamol ± morphine — PAS d'AINS/aspirine), antiémétiques, laxatifs, contrôle PA (PAS < 160 avant traitement de l'anévrisme), euvolémie", ar: "تدابير عامة: راحة تامة، رأس 30°، مسكنات (باراسيتامول ± مورفين — لا مضادات التهاب/أسبرين)، مضادات إقياء، ملينات، ضبط الضغط (انقباضي < 160 قبل علاج أم الدم)، حجم طبيعي" } },
      { title: { fr: "Transfert neurochirurgie/neuroradiologie interventionnelle — discuter hydrocéphalie (dérivation) si troubles de conscience", ar: "تحويل جراحة أعصاب/أشعة تداخلية — ناقش استسقاء (تحويلة) عند اضطراب الوعي" } },
    ],
    keyPoints: [
      { fr: "« Coup de tonnerre » = atteinte maximale en moins d'1 minute — une céphalée qui monte progressivement est moins évocatrice ; l'effort/coït déclencheurs classiques.", ar: "«الصاعقة» = بلوغ الأقصى خلال أقل من دقيقة — الصداع المتصاعد تدريجياً أقل إيحائية؛ الجهد/الجماع محرضات كلاسيكية." },
      { fr: "Fuite sentinelle : céphalée intense quelques jours AVANT la rupture — la repérer évite la rupture fatale.", ar: "تسريب نذير: صداع شديد قبل التمزق بأيام — تعرفه يجنب التمزق المميت." },
      { fr: "Vasospasme J4-J14 : toute aggravation secondaire = doppler/TDM de contrôle ; nimodipine + euvolémie ± induced hypertension en réa.", ar: "تشنج الأوعية ي4-ي14: كل تدهور ثانٍ = دوبلر/طبقي مراقب؛ نيموديبين + حجم طبيعي ± رفع ضغط مستحث بالإنعاش." },
    ],
    trajectory: [
      { when: { fr: "GCS qui chute, pupille dilatée, hydrocéphalie aiguë", ar: "هبوط GCS، حدقة متسعة، استسقاء حاد" }, do: [
        { fr: "Dérivation ventriculaire externe en urgence + réanimation neurochirurgicale.", ar: "تحويلة بطينية خارجية عاجلة + إنعاش جراحة أعصاب." },
        { fr: "Principes de contrôle de la PIC : tête 30°, sédation, osmothérapie — voir traumatisme crânien.", ar: "مبادئ ضبط الضغط داخل القحف: رأس 30°، تهدئة، علاج أسموزي — انظر رض الرأس." },
      ]},
      { when: { fr: "Déficit focal secondaire à J4-J14", ar: "عجز بؤري ثانوي باليوم 4-14" }, do: [
        { fr: "Vasospasme : imagerie + protocole d'hypertension induite/hémodilution en réa spécialisée.", ar: "تشنج أوعية: تصوير + بروتوكول رفع ضغط مستحث/تمديد دم بإنعاش مختص." },
      ]},
    ],
    medications: ["nimodipine", "morphine", "paracetamol"],
    calculators: ["gcs", "nihss"],
    meta: { sources: ["AHA/ASA HSA 2023", "EUSI"], lastReviewed: "2026-09" },
  },
  {
    id: "fievre-neutropenique",
    title: { fr: "Fièvre chez le neutropénique", ar: "حمى عند ناقص العدلات" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Chimio < 30 j + fièvre ≥ 38,3 °C (ou 38 °C/1 h) = hémocultures + antibiothérapie antipseudomonas DANS L'HEURE. Chaque heure de retard augmente la mortalité. Le choc peut survenir sans foyer.", ar: "كيماوي < 30 يوماً + حمى ≥ 38.3 (أو 38/ساعة) = مزارع دم + مضاد ضد الزائفة خلال ساعة. كل ساعة تأخير ترفع الوفيات. الصدمة قد تأتي دون بؤرة." },
    exams: {
      bio: [{ fr: "Hémocultures ×2 (une par site, dont chambre implantable), NFS (PNN < 500/mm³ ou < 1000 prévisible), CRP, lactate, ECBU, bilan complet", ar: "مزارع دم ×2 (من كل موقع، منها الغرفة المزروعة)، عد دم (محببات < 500 أو < 1000 متوقعة)، CRP، لاكتات، زرع بول، فحص شامل" }],
      img: [{ fr: "Radio thoracique ± TDM thoracique (foyers masqués par l'absence de PNN — peu d'infiltrat malgré la pneumonie)", ar: "صورة صدر ± طبقي صدري (بؤر تخفيها غياب المحببات — ارتشاح قليل رغم الالتهاب)" }],
    },
    steps: [
      { title: { fr: "Définition : patient sous chimiothérapie (ou hémopathie) + T° ≥ 38,3 °C une fois OU ≥ 38 °C pendant 1 h + PNN < 500/mm³ (ou < 1000 avec chute prévue)", ar: "التعريف: مريض تحت كيماوي (أو مرض دم) + حرارة ≥ 38.3 مرة أو ≥ 38 ساعة + محببات < 500 (أو < 1000 مع هبوط متوقع)" } },
      { title: { fr: "Hémocultures dans les 15 min — sans retarder l'antibiotique si accès difficile", ar: "مزارع دم خلال 15 د — دون تأخير المضاد إذا الوصول صعب" } },
      { title: { fr: "ANTIBIOTIQUE DANS L'HEURE : bêtalactamine antipseudomonas IV — pipé-tazo 4,5 g/6 h ou céfépime 2 g/8 h ou méropénème 1 g/8 h", ar: "مضاد خلال ساعة: بيتا-لاكتام مضاد للزائفة وريدي — بيبيراسيلين-تازو 4.5 غ/6 س أو سيفيبم 2 غ/8 س أو ميروبينيم 1 غ/8 س" } },
      { title: { fr: "Ajouter la vancomycine si : choc, cathéter suspecté, peau/tissus mous, pneumonie sévère, colonisation SARM connue", ar: "أضف فانكومايسين إذا: صدمة، اشتباه قثطرة، جلد/نسج رخوة، التهاب رئة شديد، استعمار MRSA معروف" } },
      { title: { fr: "Examiner PARTOUT : bouche (mucite), peau, pli péri-anal (abcès sans fluctuation chez le neutropénique !), cathéter, poumons, urines", ar: "افحص في كل مكان: الفم (التهاب مخاطية)، الجلد، محيط الشرج (خراج دون تموج عند ناقص المحببات!)، القثطرة، الرئتان، البول" } },
      { title: { fr: "Évaluation MASCC : score ≥ 21 + stabilité = possible traitement PO rapproché (amox-clav + cipro) en structure organisée ; sinon hospitalisation", ar: "تقييم MASCC: سكور ≥ 21 + استقرار = علاج فموي مراقب ممكن (أموكسي-كلاف + سيبرو) ببنية منظمة؛ وإلا إدخال" } },
      { title: { fr: "Surveillance : réévaluation à 48-72 h, antifongique empirique si fièvre persistante à J4-J7 (aspergillus ?), G-CSF selon contexte", ar: "مراقبة: إعادة تقييم 48-72 س، مضاد فطري تجريبي إذا حمى مستمرة باليوم 4-7 (رشاشيات؟)، عوامل نمو حسب السياق" } },
    ],
    keyPoints: [
      { fr: "Le neutropénique ne fait PAS de pus ni d'infiltrat franc — l'absence de foyer n'exclut rien et ne retarde rien.", ar: "ناقص المحببات لا يصنع قيحاً ولا ارتشاحاً صريحاً — غياب البؤرة لا يستبعد شيئاً ولا يؤخر شيئاً." },
      { fr: "Toute fièvre chez un cancéreux sous traitement = urgence absolue, y compris la nuit, y compris le week-end — le message doit être donné au patient AVANT la chimio.", ar: "كل حمى عند مريض سرطان تحت علاج = طوارئ مطلقة، ليلاً وعطلة — الرسالة تعطى للمريض قبل الكيماوي." },
      { fr: "La porte d'entrée digestive (mucite) domine : bacilles à Gram négatif dont Pseudomonas — c'est ce que l'antibiothérapie empirique DOIT couvrir.", ar: "المدخل الهضمي (التهاب المخاطية) يتصدر: عصيات سلبية الغرام منها الزائفة — وهذا ما يجب أن تغطيه المضادات التجريبية." },
    ],
    trajectory: [
      { when: { fr: "Choc septique (hypotension, lactate ↑)", ar: "صدمة إنتانية (هبوط، لاكتات ↑)" }, do: [
        { fr: "Réanimation septique maximale : remplissage 30 mL/kg, noradrénaline, élargissement ATB (double couverture Pseudomonas ± amikacine).", ar: "إنعاش إنتاني أقصى: تعبئة 30 مل/كغ، نورأدرينالين، توسيع المضاد (تغطية مزدوجة للزائفة ± أميكاسين)." },
        { fr: "Basculer sur le protocole choc septique : remplissage, vasopresseurs, source control.", ar: "انتقل إلى بروتوكول الصدمة الإنتانية: تعبئة، مقويات أوعية، ضبط البؤرة." },
      ]},
      { when: { fr: "Fièvre persistante à J4-J7 malgré ATB", ar: "حمى مستمرة باليوم 4-7 رغم المضاد" }, do: [
        { fr: "TDM thoracique (aspergillose ?), antifongique empirique, recontrôle des foyers et du cathéter.", ar: "طبقي صدري (رشاشيات؟)، مضاد فطري تجريبي، إعادة فحص البؤر والقثطرة." },
      ]},
    ],
    medications: ["piperacilline-tazobactam", "amikacine", "cefotaxime", "vancomycine"],
    calculators: ["qsofa", "curb65"],
    meta: { sources: ["IDSA neutropenic fever 2010", "ESMO 2016", "MASCC"], lastReviewed: "2026-09" },
  },
  {
    id: "serotoninergique-snm",
    title: { fr: "Syndrome sérotoninergique & syndrome malin des neuroleptiques", ar: "المتلازمة السيروتونية والمتلازمة الخبيثة لمضادات الذهان" },
    category: "psychiatrie",
    severity: "critical",
    summary: { fr: "Deux urgences iatrogènes hyperthermiques : sérotoninergique (rapide, myoclonies, réflexes vifs) = arrêt + benzos ; SNM (lent, rigidité plombée) = arrêt + dantrolène/bromocriptine. Les distinguer change le traitement.", ar: "طارئان علاجيان بفرط حرارة: سيروتونية (سريعة، رمع عضلي، منعكسات حية) = إيقاف + بنزوديازيبين؛ الخبيثة (بطيئة، تيبس رصاصي) = إيقاف + دانترولين/بروموكريبتين. التفريق يغير العلاج." },
    exams: {
      bio: [{ fr: "CPK (explosive dans le SNM), créatinine (rhabdo), ionogramme, NFS, gazos, bilan infectieux (diagnostic différentiel)", ar: "‏CPK (منفجرة بالخبيثة)، كرياتينين (انسحاق)، شوارد، عد دم، غازات، تحري إنتان (تشخيص تفريقي)" }],
      img: [],
    },
    steps: [
      { title: { fr: "SYNDROME SÉROTONINERGIQUE : heures après ajout/association (ISRS, IMAO, tramadol, fentanyl, linezolide, triptans) — agitation, MYOCLONIES, réflexes vifs, tremblements, diarrhée, sueurs, FC élevée", ar: "المتلازمة السيروتونية: ساعات بعد إضافة/مشاركة (SSRI، MAOI، ترامادول، فنتانيل، لينزوليد، تريبتان) — هياج، رمع عضلي، منعكسات حية، رعاش، إسهال، تعرق، نبض عالٍ" } },
      { title: { fr: "SYNDROME MALIN DES NEUROLEPTIQUES : jours après neuroleptique (halopéridol, phénothiazines) ou arrêt brutal de dopaminergique — rigidité PLOMBÉE, hyperthermie, confusion, dysautonomie, CPK × 10-100", ar: "الخبيثة لمضادات الذهان: أيام بعد مضاد ذهاني (هالوبيريدول، فينوثيازين) أو قطع مفاجئ لدوباميني — تيبس رصاصي، فرط حرارة، تخليط، خلل ذاتي، ‏CPK × 10-100" } },
      { title: { fr: "COMMUN AUX DEUX : ARRÊT immédiat du/des médicaments en cause — c'est le traitement principal ; réanimation de support", ar: "مشترك: إيقاف فوري للأدوية المسببة — هو العلاج الأساسي؛ إنعاش داعم" } },
      { title: { fr: "SÉROTONINERGIQUE : benzodiazépines IV (diazépam/midazolam) titrées, refroidissement, hydratation ; formes sévères : cyproheptadine, intubation + curarisation", ar: "السيروتونية: بنزوديازيبينات وريدية معايرة، تبريد، إماهة؛ الشديد: سيبروهيبتادين، تنبيب + شلل عضلي" } },
      { title: { fr: "SNM : benzodiazépines, DANTROLÈNE 1-2,5 mg/kg IV/8 h ± bromocriptine 2,5-10 mg/8 h (SNG), refroidissement actif, hydratation massive (protéger le rein de la rhabdo)", ar: "الخبيثة: بنزوديازيبين، دانترولين 1-2.5 ملغ/كغ وريدي/8 س ± بروموكريبتين 2.5-10 ملغ/8 س (أنبوب)، تبريد نشط، إماهة كثيفة (احمِ الكلى من الانسحاق)" } },
      { title: { fr: "Hyperthermie > 41 °C = urgence de refroidissement immédiat (glace, immersion) — la mortalité vient de la cascade thermique", ar: "حرارة > 41 = طوارئ تبريد فوري (ثلج، غمر) — الوفيات من الشلال الحراري" } },
      { title: { fr: "Écarter : sepsis/méningite (PL si doute), hyperthermie maligne (post-anesthésie), coup de chaleur, sevrage alcool/BDZ, thyrotoxicose", ar: "استبعد: إنتان/سحايا (بزل عند الشك)، فرط حرارة خبيث تخديري، ضربة حر، انقطاع كحول/بنزو، تسمم درقي" } },
      { title: { fr: "Déclaration de pharmacovigilance + contre-indication à vie documentée (sérotoninergiques ou neuroleptiques selon le cas) sur tous les documents du patient", ar: "تبليغ دوائي + مضاد استطباب موثق مدى الحياة (سيروتونيات أو مضادات ذهانية حسب الحالة) على كل وثائق المريض" } },
    ],
    keyPoints: [
      { fr: "Le duo qui tue aux urgences : TRAMADOL + ISRS (ou fentanyl + ISRS) — combinaison omniprésente et sous-estimée du syndrome sérotoninergique.", ar: "الثنائي القاتل بالطوارئ: ترامادول + SSRI (أو فنتانيل + SSRI) — مشاركة منتشرة ومستخف بها للسيروتونية." },
      { fr: "Réflexes vifs + myoclonies = sérotoninergique ; rigidité plombée + hyporéflexie = SNM — l'examen neurologique tranche.", ar: "منعكسات حية + رمع = سيروتونية؛ تيبس رصاصي + نقص منعكسات = الخبيثة — الفحص العصبي يفصل." },
      { fr: "Ne PAS utiliser de physostigmine ni d'anticholinergiques ; ne pas confondre avec un syndrome anticholinergique (peau sèche, mydriase, rétention).", ar: "لا تستخدم فيزوستيغمين ولا مضادات كولين؛ لا تخلطها مع المتلازمة المضادة للكولين (جلد جاف، توسع حدقة، احتباس)." },
    ],
    trajectory: [
      { when: { fr: "T° > 41 °C, rigidité majeure, CPK > 50 000", ar: "حرارة > 41، تيبس شديد، CPK > 50000" }, do: [
        { fr: "Réanimation : intubation + curarisation (supprime la thermogenèse), refroidissement immédiat, protection rénale (rhabdomyolyse), dialyse si besoin.", ar: "إنعاش: تنبيب + شلل عضلي (يوقف إنتاج الحرارة)، تبريد فوري، حماية كلوية (انسحاق)، ديلزة إن لزم." },
        { fr: "Protocole rhabdomyolyse en parallèle : hyperhydratation, surveillance rénale et potassique.", ar: "بروتوكول الانسحاق العضلي بالتوازي: إماهة كثيفة، مراقبة كلوية وبوتاسيوم." },
      ]},
      { when: { fr: "Confusion + fièvre chez un patient psychiatrique sans cause trouvée", ar: "تخليط + حمى عند مريض نفسي دون سبب" }, do: [
        { fr: "Reprendre TOUTE l'ordonnance (y compris OTC et tramadol) + chercher un sevrage — la liste des médicaments est le diagnostic.", ar: "راجع كل الوصفة (بما فيها OTC والترامادول) + ابحث عن انقطاع — قائمة الأدوية هي التشخيص." },
      ]},
    ],
    medications: ["diazepam", "midazolam", "paracetamol"],
    calculators: ["gcs"],
    meta: { sources: ["Hunter serotonin toxicity 2003", "Neuroleptic Malignant Syndrome — UpToDate"], lastReviewed: "2026-09" },
  },
  {
    id: "glaucome-aigu",
    title: { fr: "Glaucome aigu à angle fermé", ar: "زرق حاد مغلق الزاوية" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Œil rouge douloureux + halos + pupille semi-mydriatique aréactive + cornée trouble : baisser la PIO EN HEURES (acétazolamide IV + collyres) et avis ophtalmo pour iridotomie — la vue se joue sur le délai.", ar: "عين حمراء مؤلمة + هالات + حدقة متسعة جزئياً لا تتفاعل + قرنية معتمة: اخفض الضغط خلال ساعات (أسيتازولاميد وريدي + قطرات) ورأي عيون لبضع القزحية — البصر رهين الوقت." },
    exams: {
      bio: [{ fr: "Tonométrie (PIO > 40-50 mmHg), acuité visuelle, lampe à fente si disponible", ar: "قياس الضغط (> 40-50 ملم ز)، حدة بصر، مصباح شقي إن توفر" }],
      img: [{ fr: "Gonioscopie par l'ophtalmologiste (angle fermé)", ar: "تنظير الزاوية بيد طبيب العيون (زاوية مغلقة)" }],
    },
    steps: [
      { title: { fr: "Tableau : douleur oculaire et péri-orbitaire intense, nausées/vomissements, vision floue + HALOS colorés, œil rouge, pupille SEMI-MYDRIASIQUE fixe, cornée terne", ar: "اللوحة: ألم عيني وما حول الحجاج شديد، غثيان/تقيؤ، غباش + هالات ملونة، عين حمراء، حدقة متسعة جزئياً ثابتة، قرنية باهتة" } },
      { title: { fr: "Pièges diagnostiques : « gastro-entérite » (vomissements), « migraine », « conjonctivite » — l'examen de la pupille et la rougeur périkératique redressent", ar: "أفخاخ تشخيصية: «التهاب معدة-أمعاء» (تقيؤ)، «شقيقة»، «التهاب ملتحمة» — فحص الحدقة والاحمرار حول القرني يصحح" } },
      { title: { fr: "ACÉTAZOLAMIDE 500 mg IV lent puis 250 mg/6 h (ou 500 mg PO) — réduit la production d'humeur aqueuse", ar: "أسيتازولاميد 500 ملغ وريدي بطيء ثم 250 ملغ/6 س (أو 500 ملغ فموياً) — يقلل إنتاج الخلط المائي" } },
      { title: { fr: "Collyres associés : timolol 0,5 % × 2, apraclonidine, ± pilocarpine 2 % (après 1-2 h de baisse de pression — inefficace à PIO très haute)", ar: "قطرات مرافقة: تيمولول 0.5% × 2، أبراكلونيدين، ± بيلوكاربين 2% (بعد 1-2 س من انخفاض الضغط — غير فعال مع ضغط عالٍ جداً)" } },
      { title: { fr: "Mannitol 20 % 1-2 g/kg IV en 30-60 min si échec initial (prudence cardiaque/rénale)", ar: "مانيتول 20% ‏1-2 غ/كغ وريدي 30-60 د عند فشل البداية (حذر قلبي/كلوي)" } },
      { title: { fr: "Antalgie + antiémétique IV ; le patient reste à JEUN (iridotomie possible)", ar: "تسكين + مضاد إقياء وريدي؛ يبقى المريض صائماً (بضع قزحية ممكن)" } },
      { title: { fr: "AVIS OPHTALMO en urgence : iridotomie périphérique au laser = traitement définitif (et prophylaxie de l'œil controlatéral)", ar: "رأي عيون طارئ: بضع قزحية محيطي بالليزر = العلاج النهائي (ووقاية للعين الأخرى)" } },
      { title: { fr: "Contre-indiquer les mydriatiques et les atropiniques ; vérifier les médicaments pris (anticholinergiques, sympathomimétiques, topiramate)", ar: "امنع الموسعات ومضادات الكولين؛ راجع الأدوية المأخوذة (مضادات كولين، ودّيات، توبيرامات)" } },
    ],
    keyPoints: [
      { fr: "Terrain : femme > 50 ans, hypermétrope, antécédents familiaux, déclenchement en chambre sombre ou par atropiniques/antidépresseurs.", ar: "الأرضية: امرأة > 50، بعد نظر، سوابق عائلية، تحريض بغرفة مظلمة أو بمضادات كولين/مضادات اكتئاب." },
      { fr: "Chaque heure à PIO > 40-50 menace le nerf optique — c'est une urgence ophtalmologique au même titre qu'un STEMI pour l'œil.", ar: "كل ساعة بضغط > 40-50 تهدد العصب البصري — طوارئ عينية بمستوى احتشاء القلب للعين." },
      { fr: "L'œil controlatéral a un angle étroit dans la majorité des cas — iridotomie prophylactique systématique.", ar: "العين الأخرى زاويتها ضيقة في أغلب الحالات — بضع قزحية وقائي منهجي." },
    ],
    trajectory: [
      { when: { fr: "PIO qui ne baisse pas malgré traitement maximal", ar: "ضغط لا ينخفض رغم العلاج الأقصى" }, do: [
        { fr: "Ophtalmo en urgence absolue : paracentèse de chambre antérieure, iridotomie, chirurgie filtrante.", ar: "عيون بطوارئ مطلقة: بزل الغرفة الأمامية، بضع قزحية، جراحة ترشيح." },
      ]},
      { when: { fr: "Douleur oculaire chez un porteur de lentille ou post-traumatique", ar: "ألم عيني عند حامل عدسة أو بعد رض" }, do: [
        { fr: "Autres urgences : abcès de cornée (lentille), hyphéma, plaie du globe — examen à la fluorescéine et avis spécialisé.", ar: "طوارئ أخرى: خراج قرنية (عدسة)، نزف أمامي، جرح مقلة — فحص بالفلوريسئين ورأي مختص." },
      ]},
    ],
    medications: ["acetazolamide", "mannitol", "paracetamol"],
    calculators: ["dose-poids"],
    meta: { sources: ["AAO acute angle closure", "SFU ophtalmologie"], lastReviewed: "2026-09" },
  },
  {
    id: "epistaxis",
    title: { fr: "Épistaxis (saignement de nez)", ar: "الرعاف (نزف الأنف)" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "90 % antérieures : compression 15 min penché en AVANT + vasoconstricteur local. Mèches antérieures si échec. Postérieure (sang dans la gorge, âge/HTA) = avis ORL. Toujours chercher la cause (HTA, anticoagulants).", ar: "‏90% أمامية: ضغط 15 د مع انحناء للأمام + مقبض وعائي موضعي. فتائل أمامية عند الفشل. الخلفية (دم بالحلق، عمر/ضغط) = رأي أذن. ابحث دائماً عن السبب (ضغط، مضادات تخثر)." },
    exams: {
      bio: [{ fr: "NFS, bilan d'hémostase (TP/TCA), groupage si abondant, INR si AVK", ar: "عد دم، تخثر (TP/TCA)، زمرة إذا غزير، INR لمضادات فيتامين K" }],
      img: [],
    },
    steps: [
      { title: { fr: "POSITION : assis, penché en AVANT (jamais la tête en arrière — le sang avalé fait vomir et masque l'abondance), cracher le sang", ar: "الوضعية: جلوس مع انحناء للأمام (أبداً الرأس للخلف — الدم المبتلع يقيّئ ويخفي الغزارة)، ابصق الدم" } },
      { title: { fr: "COMPRESSION digitale des ailes du nez CONTRE la cloison, 15 MINUTES SANS RELÂCHER (chronomètre en main) — le geste qui arrête 80 % des épistaxis", ar: "ضغط الأصابع على جناحي الأنف ضد الحاجز 15 دقيقة دون إفلات (بالساعة) — الإجراء الذي يوقف 80% من الرعاف" } },
      { title: { fr: "Vasoconstricteur local (oxymétazoline/naphazoline) sur mèche avant compression — sauf contre-indication cardiaque sévère", ar: "مقبض وعائي موضعي (أوكسيميتازولين) على فتيلة قبل الضغط — إلا بموانع قلبية شديدة" } },
      { title: { fr: "Acide tranexamique topique (500 mg imbibés sur coton, 10 min) — réduit les récidives précoces", ar: "حمض الترانيكساميك موضعياً (500 ملغ على قطن، 10 د) — يقلل النكس المبكر" } },
      { title: { fr: "Échec après 2 cycles : MÈCHE ANTÉRIEURE (Merocel) trempée, laissée 48 h + antibio-prophylaxie (staphylocoque) ; réévaluation à 48-72 h", ar: "فشل بعد دورتين: فتيلة أمامية (ميروسيل) مبللة، تترك 48 س + وقاية مضادة (عنقوديات)؛ إعادة تقييم 48-72 س" } },
      { title: { fr: "ÉPISTAXIS POSTÉRIURE (sang qui coule dans la gorge malgré mèche antérieure, patient âgé/hypertendu/anticoagulé) : mèche postérieure ou sonde de Blackmore — GESTE ORL, risque vagal", ar: "رعاف خلفي (دم يجري بالحلق رغم الفتيلة الأمامية، مسن/ضغط/مضاد تخثر): فتيلة خلفية أو مسبار بلاك مور — إجراء أذني، خطر مبهمي" } },
      { title: { fr: "Causes : HTA à contrôler (sans la baisser brutalement — la poussée est souvent réactionnelle), reprise des anticoagulants à discuter (NE PAS arrêter seul un AVK/AOD pour épistaxis contrôlée)", ar: "الأسباب: ضغط يحتاج ضبطاً (دون خفض مفاجئ — الارتفاع غالباً تفاعلي)، استئناف مضادات التخثر يُناقش (لا توقف وحدك AVK/AOD لرعاف مضبوط)" } },
      { title: { fr: "Hospitaliser si : instabilité, Hb basse, troubles de l'hémostase, épistaxis postérieure, terrain fragile", ar: "أدخل إذا: عدم استقرار، خضاب منخفض، اضطراب تخثر، رعاف خلفي، أرضية هشة" } },
    ],
    keyPoints: [
      { fr: "Tache de Kisselbach (partie antérieure de la cloison) = source de 90 % des épistaxis — c'est là qu'on comprime, pas la racine du nez.", ar: "بقعة كيسلباخ (أمام الحاجز) = مصدر 90% من الرعاف — هناك نضغط، لا عند جذر الأنف." },
      { fr: "Épistaxis + hématomes spontanés chez un enfant/jeune = bilan d'hémostase obligatoire (Willebrand, thrombopénie).", ar: "رعاف + كدمات عفوية عند طفل/شاب = تحاليل تخثر إلزامية (فون ويلبراند، نقص صفيحات)." },
      { fr: "Chez l'hypertendu, l'épistaxis est souvent « soupape » : traiter la douleur et l'anxiété fait chuter la PA — l'urgence hypertensive vraie se juge sur les viscères, pas sur le saignement.", ar: "عند مريض الضغط، الرعاف غالباً «صمام»: علاج الألم والقلق يخفض الضغط — فرط الضغط الطارئ الحقيقي يُقاس بالأحشاء لا بالنزف." },
    ],
    trajectory: [
      { when: { fr: "Récidive après ablation de mèche", ar: "نكس بعد نزع الفتيلة" }, do: [
        { fr: "Nouvelle mèche + avis ORL pour cautérisation (nitrate d'argent sur point visible) ou embolisation artérielle si récidive rebelle.", ar: "فتيلة جديدة + رأي أذن للكي (نترات الفضة على نقطة ظاهرة) أو إصمام شرياني عند النكس العنيد." },
      ]},
      { when: { fr: "Choc ou Hb < 7 g/dL", ar: "صدمة أو خضاب < 7 غ/دل" }, do: [
        { fr: "Transfusion + bloc ORL (ligature artérielle) — l'épistaxis « banale » peut tuer l'anticoagulé.", ar: "نقل دم + صالة أذن (ربط شرياني) — الرعاف «البسيط» قد يقتل من على مضاد تخثر." },
        { fr: "Voir la conduite transfusionnelle (calculateur transfusion, seuils).", ar: "انظر تدبير نقل الدم (حاسبة النقل، العتبات)." },
      ]},
    ],
    medications: ["acide-tranexamique", "cefotaxime"],
    calculators: ["transfusion"],
    meta: { sources: ["ENT-UK epistaxis 2020", "Société française ORL"], lastReviewed: "2026-09" },
  },
];

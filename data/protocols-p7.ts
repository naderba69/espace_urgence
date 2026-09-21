// v7.9 — Phase 7 : traumatologie complète (6), toxico tunisienne (phosphure d'aluminium),
// cardio avancée (NSTEMI, FA nouvelle, myocardite).
import type { Protocol } from "./types";

export const protocolsPhase7: Protocol[] = [
  {
    id: "pelvis-instable",
    title: { fr: "Fracture du bassin instable", ar: "كسر حوض غير مستقر" },
    category: "traumatologie",
    severity: "critical",
    summary: { fr: "Hémorragie rétropéritonéale possible : ceinture pelvienne immédiate, TXA, sang, pas de mobilisations inutiles.", ar: "نزف خلف البريتوان ممكن: حزام الحوض فوراً، حمض الترانيكساميك، دم، وتقليل التحريك." },
    exams: {
      bio: [{ fr: "NFS, groupe/rhésus, lactate, bilan pré-transfusionnel", ar: "عد دم، زمرة، لاكتات، تحاليل ما قبل النقل" }],
      img: [{ fr: "Radio bassin de face (lit du patient) puis scanner si stable", ar: "صورة حوض أمامية (بالسرير) ثم ماسح إن استقر" }],
    },
    steps: [
      { title: { fr: "Suspecter : choc sans source évidente + douleur pelvienne/ecchymose périnéale", ar: "اشتهِ: صدمة بلا مصدر واضح + ألم حوض/كدمات العجان" } },
      { title: { fr: "Ceinture/drap pelvien AU NIVEAU DES TROCHANTERS — fermer le bassin une seule fois", ar: "حزام/ملاءة الحوض على مستوى المدورين — أغلق الحوض مرة واحدة" }, detail: { fr: "Ne pas retirer ni re-manipuler : chaque ouverture libère le caillot.", ar: "لا تنزعه ولا تعِد التلاعب: كل فتح يحرر الخثرة." } },
      { title: { fr: "Acide tranexamique 1 g IV en 10 min (< 3 h du trauma)", ar: "حمض الترانيكساميك 1 غ وريدي 10 د (< 3 س من الرض)" } },
      { title: { fr: "2 voies veineuses + remplissage limité (cristalloïdes tièdes) — objectif PAS 90 mmHg", ar: "وريدان + تعبئة محدودة (بلورات دافئة) — هدف انقباضي 90" } },
      { title: { fr: "Transfusion précoce : CGR O si disponible, protocole de transfusion massive si choc", ar: "نقل مبكر: كريات O إن توفرت، بروتوكول نقل كثيف عند الصدمة" } },
      { title: { fr: "Sonde urinaire AVANT si pas de sang au méat ; sinon urétrocystographie", ar: "قثطرة بولية إن لم يوجد دم بالصماخ؛ وإلا تصوير إحليل" } },
      { title: { fr: "Appel chirurgien/ radiologie interventionnelle : packing pré-péritonéal ou embolisation", ar: "نداء جراح/أشعة تداخلية: حشو قبل البريتوان أو إصمام" } },
    ],
    keyPoints: [
      { fr: "Le bassin instable saigne dans le rétropéritoine : jusqu'à 3-4 L cachés.", ar: "الحوض غير المستقر ينزف خلف البريتوان: حتى 3-4 لترات خفية." },
      { fr: "Choc qui persiste malgré ceinture + 2 CGR = source artérielle ⇒ embolisation urgente.", ar: "صدمة مستمرة رغم الحزام + وحدتي دم = مصدر شرياني ⇒ إصمام عاجل." },
    ],
    trajectory: [
      { when: { fr: "Choc réfractaire malgré ceinture et transfusion", ar: "صدمة مستعصية رغم الحزام والنقل" }, do: [
        { fr: "Embolisation artérielle ou packing chirurgical sans délai — décision immédiate.", ar: "إصمام شرياني أو حشو جراحي دون تأخير — قرار فوري." },
        { fr: "Écarter les autres sources : FAST, thorax, membres (fémur).", ar: "استبعد مصادر أخرى: FAST، صدر، أطراف (فخذ)." },
      ]},
      { when: { fr: "Sang au méat urétral / hématome scrotal", ar: "دم بالصماخ/ورم دموي صفني" }, do: [
        { fr: "NE PAS sonder — urétrocystographie rétrograde d'abord.", ar: "لا تقثطر — تصوير إحليل رجعي أولاً." },
      ]},
    ],
    medications: ["acide-tranexamique", "ketamine", "morphine"],
    calculators: ["start", "transfusion"],
    meta: { sources: ["ATLS 10e éd.", "Western Trauma Association 2023"], lastReviewed: "2026-09" },
  },
  {
    id: "amputation-crush",
    title: { fr: "Amputation traumatique & syndrome d'écrasement", ar: "بتر رضّي ومتلازمة الانسحاق" },
    category: "traumatologie",
    severity: "critical",
    summary: { fr: "Contrôle de l'hémorragie d'abord, conservation du membre amputé, puis prévenir la défaillance rénale du crush.", ar: "إيقاف النزف أولاً، حفظ الطرف المبتور، ثم منع القصور الكلوي للانسحاق." },
    exams: {
      bio: [{ fr: "K⁺, créatinine, CPK, myoglobine urinaire, gazos", ar: "بوتاسيوم، كرياتينين، CPK، ميوغلوبين البول، غازات" }],
      img: [{ fr: "Radio du membre — recherche corps étranger/fracture", ar: "صورة الطرف — بحث عن جسم غريب/كسر" } ],
    },
    steps: [
      { title: { fr: "Hémorragie : compression directe immédiate — garrot large 5-7 cm au-dessus si elle ne cède pas", ar: "النزف: ضغط مباشر فوري — عاصبة عريضة فوق الإصابة إن لم يتوقف" }, detail: { fr: "Noter l'HEURE de pose du garrot et ne plus le desserrer.", ar: "سجّل وقت وضع العاصبة ولا تفكها بعدها." } },
      { title: { fr: "Membre amputé : rincer au sérum, emballer dans une compresse humide, sac étanche, puis sur glace (JAMAIS au contact direct)", ar: "الطرف المبتور: اشطفه بمحلول ملحي، لفه بضمادة رطبة، كيس محكم، ثم على الثلج (دون تلامس مباشر)" } },
      { title: { fr: "Écrasement : NaCl 0,9 % 1-1,5 L/h dès le dégagement — AVANT si possible", ar: "الانسحاق: NaCl 0.9% ‏1-1.5 ل/س منذ التحرير — قبله إن أمكن" } },
      { title: { fr: "Surveiller K⁺ : hyperkaliémie de reperfusion = tueur du crush", ar: "راقب البوتاسيوم: فرط بوتاسيوم إعادة الإرواء = قاتل الانسحاق" } },
      { title: { fr: "Antalgie titrée (kétamine faible dose ou morphine) + ATAT + ATB (céfotaxime) si plaie souillée", ar: "تسكين معاير (كيتامين أو مورفين) + كزاز + مضاد (سيفوتاكسيم) للجروح الملوثة" } },
      { title: { fr: "Appel chirurgical + transfert avec le membre conservé au froid", ar: "نداء جراحي + تحويل مع الطرف المحفوظ بارداً" } },
    ],
    keyPoints: [
      { fr: "Ischémie chaude < 6 h (muscle) : la réimplantation se joue sur le délai et la conservation au froid.", ar: "الإقفار الدافئ < 6 س (عضل): إعادة الزرع رهينة الوقت والحفظ البارد." },
      { fr: "Crush : urines « coca » = myoglobinurie ⇒ hydratation massive, objectif diurèse 200-300 mL/h.", ar: "الانسحاق: بول بلون الكولا = ميوغلوبين ⇒ إماهة كثيفة، هدف إدرار 200-300 مل/س." },
    ],
    trajectory: [
      { when: { fr: "Hyperkaliémie (ondes T pointues, QRS large)", ar: "فرط بوتاسيوم (T مدببة، QRS عريض)" }, do: [
        { fr: "Gluconate de calcium 1 g IV + insuline-glucose — protocole hyperkaliémie.", ar: "غلوكونات كالسيوم 1 غ + إنسولين-غلوكوز — بروتوكول فرط البوتاسيوم." },
      ]},
      { when: { fr: "Syndrome des loges : douleur à la passive, loge tendue", ar: "متلازمة الحجرات: ألم بالحركة السلبية، حجرة متوترة" }, do: [
        { fr: "Aponévrotomie de décharge en urgence — ne pas attendre la mesure de pression.", ar: "شق اللفافة للتفريغ عاجلاً — لا تنتظر قياس الضغط." },
      ]},
    ],
    medications: ["ketamine", "morphine", "cefotaxime", "gluconate-calcium", "insuline-rapide"],
    calculators: ["trauma-membres", "tetanos"],
    meta: { sources: ["ATLS 10e éd.", "Guidelines crush disaster (ISN 2023)"], lastReviewed: "2026-09" },
  },
  {
    id: "thorax-penetrant",
    title: { fr: "Plaie thoracique pénétrante", ar: "جرح صدر نافذ" },
    category: "traumatologie",
    severity: "critical",
    summary: { fr: "Sceller la plaie, dépister pneumothorax et tamponnade, drain thoracique précoce — ne jamais sonder la plaie.", ar: "إغلاق الجرح، كشف الاسترواح والاندحاس، أنبوبة صدرية مبكرة — لا تستكشف الجرح أبداً." },
    exams: {
      bio: [{ fr: "Groupe/rhésus, lactate", ar: "زمرة، لاكتات" }],
      img: [{ fr: "eFAST (épanchement + pneumothorax), radio thorax", ar: "eFAST (انصباب + استرواح)، صورة صدر" }],
      ecg: [{ fr: "ECG + scope (trajet « boîte cardiaque » ?)", ar: "تخطيط + مراقبة (مسار «العلبة القلبية»؟)" }],
    },
    steps: [
      { title: { fr: "Pansement occlusif 3 côtés (ou valve commerciale) sur la plaie — effet clapet anti-stabilisant", ar: "ضمادة عاصلة من 3 جهات (أو صمام تجاري) — تعمل كصمام أمان" } },
      { title: { fr: "NE JAMAIS sonder la plaie ni retirer un objet empalé (le stabiliser)", ar: "لا تستكشف الجرح ولا تنزع جسماً مغروساً (ثبّته)" } },
      { title: { fr: "ABCDE + O₂ + 2 VVP + TXA 1 g si saignement significatif", ar: "ABCDE + أكسجين + وريدان + TXA ‏1 غ للنزف المهم" } },
      { title: { fr: "Zone « boîte cardiaque » (clavicules→xiphoïde, mamelons→mamelons) : eFAST péricarde obligatoire", ar: "منطقة «العلبة القلبية»: eFLASH للاندحاب إجباري" } },
      { title: { fr: "Pneumothorax/hémothorax ⇒ drain thoracique 28-32 Ch (4ᵉ-5ᵉ EIC, ligne médio-axillaire)", ar: "استرواح/دم صدري ⇒ أنبوبة صدرية 28-32 (الفضاء 4-5، الخط الإبطي الأوسط)" } },
      { title: { fr: "Tamponnade ⇒ péricardiocentèse de sauvetage + thoracotomie chirurgicale", ar: "اندحاس ⇒ بزل التأمور الإنقاذي + فتح صدر جراحي" } },
    ],
    keyPoints: [
      { fr: "Un pansement totalement occlusif des 4 côtés peut créer un pneumothorax suffocant — laisser un côté libre.", ar: "الضمادة العاصلة من 4 جهات قد تصنع استرواحاً ضاغطاً — اترك جهة حرة." },
      { fr: "Toute plaie sous le mamelon = lésion abdominale associée jusqu'à preuve du contraire (trajet diaphragmatique).", ar: "كل جرح تحت الحلمة = إصابة بطنية مرافقة حتى يثبت العكس." },
    ],
    trajectory: [
      { when: { fr: "Détresse brutale : tympanisme, déviation trachéale", ar: "ضائقة مفاجئة: طبلة، انحراف رغامي" }, do: [
        { fr: "Retirer le pansement + décompression à l'aiguille puis drain — pneumothorax suffocant.", ar: "انزع الضمادة + تنفيس بإبرة ثم أنبوبة — استرواح ضاغط." },
      ]},
      { when: { fr: "Choc + veines turgescentes + bruits cardiaques assourdis", ar: "صدمة + أوردة منتفخة + أصوات قلب مكتومة" }, do: [
        { fr: "Tamponnade : eFLASH, péricardiocentèse échoguidée, chirurgie immédiate.", ar: "اندحاس: eFAST، بزل تأمور بالإيكو، جراحة فورية." },
      ]},
    ],
    medications: ["acide-tranexamique", "ketamine", "morphine"],
    calculators: ["start"],
    meta: { sources: ["ATLS 10e éd.", "EAST guidelines 2022"], lastReviewed: "2026-09" },
  },
  {
    id: "fracture-ouverte",
    title: { fr: "Fracture ouverte", ar: "كسر مفتوح" },
    category: "traumatologie",
    severity: "urgent",
    summary: { fr: "Antibiotique dans l'heure, pansement stérile humide, immobilisation, prévention du tétanos — l'os ne se remet pas en place aux urgences sauf pouls absent.", ar: "مضاد خلال ساعة، ضمادة معقمة رطبة، تثبيت، وقاية كزاز — العظم لا يُردّ في الاستعجالي إلا بغياب النبض." },
    exams: {
      bio: [{ fr: "NFS, CRP de référence, groupe", ar: "عد دم، CRP مرجعي، زمرة" }],
      img: [{ fr: "Radio 2 incidences du segment (articulations sus et sous-jacentes)", ar: "صورة بواجهتين للقطعة (المفصلان فوق وتحت)" }],
    },
    steps: [
      { title: { fr: "Évaluer la vascularisation et la sensibilité AVANT/APRÈS tout geste (pouls distal !)", ar: "قيّم التروية والإحساس قبل/بعد أي إجراء (النبض البعيد!)" } },
      { title: { fr: "Antibiothérapie < 1 h : céfotaxime 2 g IV (± aminoside si Gustilo III)", ar: "مضاد < 1 س: سيفوتاكسيم 2 غ وريدي (± أمينوغليكوزيد لـ Gustilo III)" } },
      { title: { fr: "Rincer abondamment au sérum stérile, couvrir d'une compresse humide stérile — ne pas repousser l'os", ar: "اشطف بغزارة بمحلول معقم وغطِّ بضمادة رطبة — لا تدفع العظم للداخل" } },
      { title: { fr: "Immobilisation (attelle) + surélévation + glace indirecte", ar: "تثبيت (جبيرة) + رفع + ثلج غير مباشر" } },
      { title: { fr: "ATAT : vérifier la vaccination ; immunoglobulines si statut inconnu/ancien", ar: "الكزاز: تحقق من التلقيح؛ غلوبولين مناعي إن كانت الحالة مجهولة" } },
      { title: { fr: "Antalgie systématique (paracétamol IV + palier 2/3 titré)", ar: "تسكين منهجي (باراسيتامول وريدي + مستوى 2/3 معاير)" } },
      { title: { fr: "Chirurgie : parage au bloc dans les 6-24 h selon classification", ar: "الجراحة: تنظيف بالعمليات خلال 6-24 س حسب التصنيف" } },
    ],
    keyPoints: [
      { fr: "Le délai d'antibiothérapie est LE facteur modifiable d'infection — avant la radio si nécessaire.", ar: "توقيت المضاد هو العامل القابل للتعديل للعدوى — قبل الصورة إن لزم." },
      { fr: "Réduction d'urgence UNIQUEMENT si pouls absent ou peau menacée — puis recontrôler le pouls.", ar: "الرد العاجل فقط إذا غاب النبض أو هُدد الجلد — ثم أعد فحص النبض." },
    ],
    trajectory: [
      { when: { fr: "Pouls distal absent", ar: "نبض بعيد غائب" }, do: [
        { fr: "Réalignement doux immédiat + recontrôle ; si toujours absent : chirurgie vasculaire urgente.", ar: "محاذاة لطيفة فورية + إعادة فحص؛ إن استمر الغياب: جراحة أوعية عاجلة." },
      ]},
      { when: { fr: "Douleur disproportionnée + douleur à la passive (24-48 h)", ar: "ألم غير متناسب + ألم بالحركة السلبية (24-48 س)" }, do: [
        { fr: "Syndrome des loges ⇒ aponévrotomie — urgence absolue.", ar: "متلازمة حجرات ⇒ شق اللفافة — طارئ مطلق." },
      ]},
    ],
    medications: ["cefotaxime", "amikacine", "paracetamol", "morphine"],
    calculators: ["tetanos", "trauma-membres"],
    meta: { sources: ["BOA/BAPRAS guidelines 2020", "ATLS 10e éd."], lastReviewed: "2026-09" },
  },
  {
    id: "oeil-chimique",
    title: { fr: "Brûlure oculaire chimique", ar: "حرق عين كيميائي" },
    category: "traumatologie",
    severity: "urgent",
    summary: { fr: "Lavage immédiat AVANT tout examen — 30 minutes minimum, jusqu'à pH neutre. Les bases pénètrent plus vite que les acides.", ar: "الغسل الفوري قبل أي فحص — 30 دقيقة على الأقل حتى pH محايد. القلويات تنفذ أسرع من الأحماض." },
    exams: {
      bio: [{ fr: "pH du cul-de-sac conjonctival (bandelette) toutes les 10 min", ar: "pH الملتحمة (شريط) كل 10 د" }],
    },
    steps: [
      { title: { fr: "LAVAGE IMMÉDIAT : NaCl 0,9 % ou Ringer (mieux) — 30 min minimum, flacon/perfuseur tenu haut", ar: "غسل فوري: NaCl 0.9% أو رينغر (أفضل) — 30 د على الأقل" } },
      { title: { fr: "Anesthésie locale (une goutte) pour permettre le lavage et l'examen", ar: "تخدير موضعي (قطرة) لإتاحة الغسل والفحص" } },
      { title: { fr: "Éverser les paupières : retirer TOUTES les particules (écouvillon humide)", ar: "اقلب الجفون: أزل كل الجزيئات (مسحة رطبة)" } },
      { title: { fr: "Contrôler le pH toutes les 10 min — arrêter à 7,0-7,2 après 30 min", ar: "قِس pH كل 10 د — أوقف عند 7.0-7.2 مستقراً بعد 30 د" } },
      { title: { fr: "Atropine collyre (mydriatique antalgique) + paracétamol ; PAS de collyre anesthésiant à emporter", ar: "قطرة أتروبين (موسع مسكن) + باراسيتامول؛ لا تعطِ مخدراً موضعياً للمنزل" } },
      { title: { fr: "Avis ophtalmologique OBLIGATOIRE — surtout base (soude, chaux, ciment)", ar: "رأي طب العيون إلزامي — خصوصاً القلويات (صودا، جير، إسمنت)" } },
    ],
    keyPoints: [
      { fr: "Chaque minute sans lavage = une couche de cornée perdue. Le lavage prime sur l'interrogatoire.", ar: "كل دقيقة بلا غسل = طبقة قرنية مفقودة. الغسل يسبق الاستجواب." },
      { fr: "Les bases (soude, ammoniaque, chaux) liquéfient la cornée : pronostic pire que les acides — lavage prolongé 1-2 h.", ar: "القلويات تميّع القرنية: إنذارها أسوأ من الأحماض — غسل مطوّل 1-2 س." },
    ],
    trajectory: [
      { when: { fr: "Œil blanc et calme anormal + opacité cornéenne (ischémie limbique)", ar: "عين بيضاء هادئة بشكل مريب + عتامة قرنية" }, do: [
        { fr: "Grade élevé (Roper-Hall III-IV) : transfert ophtalmologique urgent — risque de perforation.", ar: "درجة عالية: تحويل عاجل لطب العيون — خطر انثقاب." },
      ]},
    ],
    medications: ["atropine", "paracetamol"],
    calculators: [],
    meta: { sources: ["Roper-Hall/Dua classification", "SFU ophtalmologie 2022"], lastReviewed: "2026-09" },
  },
  {
    id: "fast-echo",
    title: { fr: "eFAST — échographie d'urgence au lit", ar: "eFAST — إيكو الطوارئ بالسرير" },
    category: "traumatologie",
    severity: "urgent",
    summary: { fr: "4 fenêtres en 3 minutes : où chercher le liquide libre, le pneumothorax et la tamponnade chez le traumatisé.", ar: "4 نوافذ في 3 دقائق: أين تبحث عن السائل الحر والاسترواح والاندحاس عند المصاب." },
    exams: {
      img: [{ fr: "Sonde convexe 3,5 MHz (abdomen/péricarde) + linéaire haute fréquence (poumon)", ar: "محدب 3.5 ميغاهرتز (بطن/تأمور) + خطي عالي التردد (رئة)" }],
    },
    steps: [
      { title: { fr: "Fenêtre 1 — sous-costale droite (Morison) : rein/foie, recherche liquide + péricarde en même temps", ar: "النافذة 1 — تحت الضلوع يمنة (موريسون): كبد/كلية + التأمور معاً" } },
      { title: { fr: "Fenêtre 2 — sous-costale gauche : rate/rein, base pulmonaire (épanchement)", ar: "النافذة 2 — تحت الضلوع يسرة: طحال/كلية، قاعدة الرئة" } },
      { title: { fr: "Fenêtre 3 — sus-pubienne : vessie/cul-de-sac de Douglas", ar: "النافذة 3 — فوق العانة: المثانة/جيب دوغلاس" } },
      { title: { fr: "Fenêtre 4 — péricardique (sous-xyphoïdienne) : liquide autour du cœur = tamponnade si choc", ar: "النافذة 4 — التأمور (تحت الخنجري): سائل حول القلب = اندحاس مع الصدمة" } },
      { title: { fr: "eFAST étendu : glissement pleural aux 2 hémithorax — ABSENT = pneumothorax (point pouls confirmé)", ar: "الموسّع: انزلاق جنبي بالجهتين — غيابه = استرواح (نقطة النبض تؤكد)" } },
      { title: { fr: "Instable + FAST positif ⇒ bloc opératoire direct ; stable + positif ⇒ scanner", ar: "غير مستقر + FAST إيجابي ⇒ عمليات مباشرة؛ مستقر ⇒ ماسح" } },
    ],
    keyPoints: [
      { fr: "FAST négatif n'élimine PAS une lésion d'organe plein — répéter à 30 min si suspicion persiste.", ar: "FAST سلبي لا يستبعد إصابة عضو — أعِده بعد 30 د عند استمرار الشك." },
      { fr: "200 mL seulement suffisent à être vus dans Morison — c'est le test du patient instable.", ar: "200 مل تكفي للرؤية في موريسون — إنه اختبار المريض غير المستقر." },
    ],
    trajectory: [
      { when: { fr: "Choc + liquide au FAST", ar: "صدمة + سائل بالـ FAST" }, do: [
        { fr: "Laparotomie/thoracotomie selon fenêtre positive — ne pas attendre le scanner.", ar: "فتح بطن/صدر حسب النافذة الإيجابية — لا تنتظر الماسح." },
      ]},
      { when: { fr: "Absence de glissement pleural + point pouls", ar: "غياب الانزلاق + نقطة النبض" }, do: [
        { fr: "Pneumothorax confirmé : décompression si mal toléré, drain thoracique.", ar: "استرواح مؤكد: تفريغ إن ضعُف التحمل، أنبوبة صدرية." },
      ]},
    ],
    medications: [],
    calculators: ["start"],
    meta: { sources: ["ATLS 10e éd.", "WINFOCUS 2020"], lastReviewed: "2026-09" },
  },
  {
    id: "intoxication-phosphure-aluminium",
    title: { fr: "Intoxication au phosphure d'aluminium (« grain tablets »)", ar: "تسمم بفوسفيد الألومنيوم (حبوب الغلال)" },
    category: "toxicologie",
    severity: "critical",
    summary: { fr: "Urgence vitale fréquente en Tunisie rurale : mortalité élevée, pas d'antidote spécifique — réanimation agressive précoce et protection de l'équipe (gaz phosphine).", ar: "طارئة حيوية شائعة في الأرياف التونسية: وفيات عالية، لا ترياق نوعي — إنعاش مبكر مكثف وحماية الفريق (غاز الفوسفين)." },
    exams: {
      bio: [{ fr: "Gazos (acidose métabolique sévère), iono, lactate, ECG continu", ar: "غازات (حماض استقلابي شديد)، شوارد، لاكتات، تخطيط مستمر" }],
      ecg: [{ fr: "ECG : arythmies malignes fréquentes (TV/FV, blocs)", ar: "تخطيط: اضطرابات خبيثة شائعة (تسرع/رجفان بطيني، حصارات)" }],
    },
    steps: [
      { title: { fr: "PROTÉGER L'ÉQUIPE : gaz phosphine toxique — masque, gants, pièce ventilée, jamais de bouche-à-bouche", ar: "احمِ الفريق: غاز الفوسفين سام — قناع، قفازات، تهوية، ممنوع التنفس فم-لفم" } },
      { title: { fr: "NE PAS faire vomir, NE PAS donner d'eau (libère le gaz) — huile de coco/paraffine si < 1 h et conscience intacte", ar: "لا تُقيّئ ولا تعطِ ماء (يحرر الغاز) — زيت جوز/بارافين إذا < 1 س ووعي سليم" } },
      { title: { fr: "Intubation PRÉCOCE : détresse imminente fréquente — anticiper plutôt que subir", ar: "تنبيب مبكر: الضائقة وشيكة غالباً — استبق ولا تُفاجأ" } },
      { title: { fr: "Choc réfractaire : noradrénaline à fortes doses + remplissage prudent (myocardite toxique)", ar: "صدمة مستعصية: نورأدرينالين بجرعات عالية + تعبئة حذرة (التهاب عضلة قلبية سمي)" } },
      { title: { fr: "Bicarbonates si acidose sévère (pH < 7,1) ; magnésium IV (stabilisation membranaire — données limitées)", ar: "بيكربونات للحماض الشديد (pH < 7.1)؛ مغنزيوم وريدي (تثبيت الغشاء — بيانات محدودة)" } },
      { title: { fr: "Arythmies : amiodarone ; choc électrique si instabilité — monitorage 72 h minimum", ar: "الاضطرابات: أميودارون؛ صعق عند عدم الاستقرار — مراقبة 72 س على الأقل" } },
      { title: { fr: "Transfert immédiat en réanimation + soutien psychiatrique (tentatives de suicide fréquentes)", ar: "تحويل فوري للإنعاش + دعم نفسي (محاولات انتحار شائعة)" } },
    ],
    keyPoints: [
      { fr: "Odeur d'ail/poisson pourrie à l'haleine = signature de la phosphine.", ar: "رائحة ثوم/سمك متعفن بالنفس = بصمة الفوسفين." },
      { fr: "Aucun antidote prouvé : la survie dépend de la précocité de la réanimation et du soutien circulatoire.", ar: "لا ترياق مثبت: النجاة رهينة التبكير بالإنعاش ودعم الدوران." },
      { fr: "Prévenir le centre antipoison (CNPP Tunis : 80 102 550) — déclaration obligatoire.", ar: "أبلغ مركز مكافحة التسمم (تونس: 80 102 550) — التبليغ إجباري." },
    ],
    trajectory: [
      { when: { fr: "Arrêt cardiaque réfractaire", ar: "توقف قلبي مستعصٍ" }, do: [
        { fr: "RCP prolongée + ECMO si disponible — cas de survie rapportés après RCP longue.", ar: "إنعاش مطول + ECMO إن توفر — سجلت نجاة بعد إنعاش طويل." },
      ]},
      { when: { fr: "Membre du personnel exposé au gaz (céphalées, nausées)", ar: "أحد الفريق تعرض للغاز (صداع، غثيان)" }, do: [
        { fr: "Évacuation à l'air libre + O₂, évaluation médicale — revoir la décontamination.", ar: "إخراج للهواء الطلق + أكسجين، تقييم طبي — أعد مراجعة إزالة التلوث." },
      ]},
    ],
    medications: ["noradrenaline", "amiodarone", "bicarbonate", "sulfate-magnesium", "midazolam", "rocuronium"],
    calculators: [],
    meta: { sources: ["Proudfoot 2019 review", "CNPP Tunisie"], lastReviewed: "2026-09" },
  },
  {
    id: "sca-nstem",
    title: { fr: "SCA sans sus-décalage ST (NSTEMI / angor instable)", ar: "متلازمة تاجية دون ارتفاع ST" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Troponine itérative + score HEART : double antiagrégation, anticoagulation, et coronarographie selon le délai de risque. Jamais de fibrinolyse.", ar: "تروبونين متكرر + HEART: مضادا صفائح، تمييع، وقسطرة حسب أجل الخطورة. ممنوع إذابة الخثرة." },
    exams: {
      bio: [{ fr: "Troponine ultrasensible H0/H1 (ou H0/H3), créatinine, NFS", ar: "تروبونين فائق الحساسية س0/س1، كرياتينين، عد دم" }],
      ecg: [{ fr: "ECG < 10 min, répété à 15-30 min si douleur en cours (sous-ST, T inversées)", ar: "تخطيط < 10 د يُعاد كل 15-30 د مع الألم (انخفاض ST، T معكوسة)" }],
    },
    steps: [
      { title: { fr: "Score HEART + ECG + troponine : stratifier d'emblée", ar: "HEART + تخطيط + تروبونين: صنّف منذ البداية" } },
      { title: { fr: "Aspirine 250 mg IV (ou 150-300 mg per os à croquer)", ar: "أسبرين 250 ملغ وريدي (أو 150-300 ملغ مضغاً)" } },
      { title: { fr: "Ticagrélor 180 mg (ou clopidogrel 300-600 mg si CI/âge > 75/fibrinolyse possible)", ar: "تيكاغريلور 180 ملغ (أو كلوبيدوغريل 300-600 عند الموانع/فوق 75)" } },
      { title: { fr: "Anticoagulation : énoxaparine 1 mg/kg/12 h SC (ou HNF si coronarographie < 2 h)", ar: "تمييع: إينوكسابارين 1 ملغ/كغ/12 س تحت الجلد (أو هيبارين للقسطرة < 2 س)" } },
      { title: { fr: "Trinitrine SL si douleur et PAS > 100 ; morphine 2-4 mg si réfractaire", ar: "نترات تحت اللسان مع الألم وانقباضي > 100؛ مورفين 2-4 ملغ للمقاوم" } },
      { title: { fr: "Délais de coronarographie : < 2 h si très haut risque (choc, arythmies malignes, douleur réfractaire) ; < 24 h si haut risque (troponine ↑, sous-ST dynamique, GRACE > 140) ; < 72 h sinon", ar: "أجل القسطرة: < 2 س لعالٍ جداً (صدمة، اضطرابات خبيثة، ألم مقاوم)؛ < 24 س للعالٍ؛ < 72 س لما دونها" } },
      { title: { fr: "Bêtabloquant per os à distance si pas d'insuffisance cardiaque/de choc ; statine forte dose", ar: "حاصر بيتا فموياً لاحقاً إن لا قصور/صدمة؛ ستاتين بجرعة عالية" } },
    ],
    keyPoints: [
      { fr: "FIBRINOLYSE CONTRE-INDIQUÉE dans le NSTEMI — aggrave le pronostic.", ar: "إذابة الخثرة ممنوعة في NSTEMI — تسوّء الإنذار." },
      { fr: "Une troponine négative à H0 n'élimine rien : la cinétique (delta) fait le diagnostic.", ar: "تروبونين سلبي في س0 لا يستبعد شيئاً: الحركة (الدلتا) هي التشخيص." },
    ],
    trajectory: [
      { when: { fr: "Douleur réfractaire malgré traitement maximal", ar: "ألم مقاوم رغم العلاج الأقصى" }, do: [
        { fr: "C'est un « très haut risque » : coronarographie < 2 h comme un STEMI équivalent.", ar: "هذا «خطر عالٍ جداً»: قسطرة < 2 س كمكافئ لاحتشاء." },
      ]},
      { when: { fr: "Instabilité électrique (TV) ou hémodynamique", ar: "عدم استقرار كهربائي أو دوراني" }, do: [
        { fr: "Réanimation + coronarographie immédiate ; amiodarone pour les TV récidivantes.", ar: "إنعاش + قسطرة فورية؛ أميودارون للتسرعات المتكررة." },
      ]},
    ],
    medications: ["aspirine", "enoxaparine", "heparine", "trinitrine", "morphine", "amiodarone"],
    calculators: ["heart", "scores", "enoxaparine"],
    meta: { sources: ["ESC NSTE-ACS 2023"], lastReviewed: "2026-09" },
  },
  {
    id: "fa-nouvelle",
    title: { fr: "Fibrillation atriale de découverte récente", ar: "رجفان أذيني حديث الاكتشاف" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "D'abord la tolérance : instable ⇒ cardioversion. Stable ⇒ contrôler la fréquence, dater le début, décider l'anticoagulation.", ar: "أولاً التحمل: غير مستقر ⇒ تقويم كهربي. مستقر ⇒ ضبط المعدل، تأريخ البداية، قرار التمييع." },
    exams: {
      bio: [{ fr: "TSH, iono, créatinine, NFS, troponine (cause ischémique ?)", ar: "TSH، شوارد، كرياتينين، عد دم، تروبونين (سبب إقفاري؟)" }],
      ecg: [{ fr: "ECG 12 dérivations : RR irrégulier sans onde P ; chercher WPW (QRS large = danger)", ar: "تخطيط 12 مشتقاً: RR غير منتظم بلا P؛ ابحث WPW (QRS عريض = خطر)" }],
    },
    steps: [
      { title: { fr: "Évaluer la tolérance : choc, OAP, angor, syncope ⇒ cardioversion électrique synchronisée (sédation)", ar: "قيّم التحمل: صدمة، وذمة، ألم صدري، إغماء ⇒ تقويم متزامن (بتهدئة)" } },
      { title: { fr: "Dater le début : < 48 h = fenêtre de cardioversion pharmacologique possible ; > 48 h ou inconnu = anticoagulation 3 semaines avant (ou ETO)", ar: "أرّخ البداية: < 48 س = نافذة تقويم دوائي ممكنة؛ > 48 س = تمييع 3 أسابيع قبله (أو إيكو عبر المريء)" } },
      { title: { fr: "Contrôle de la fréquence : métoprolol/esmolol IV titré (ou diltiazem si fonction VG conservée)", ar: "ضبط المعدل: ميتوبرولول/إزمولول معاير (أو ديلتيازيم إذا وظيفة البطين محفوظة)" } },
      { title: { fr: "QRS LARGES + FA = WPW possible : JAMAIS de digoxine/vérapamil/ADP — amiodarone ou cardioversion", ar: "QRS عريض + رجفان = WPW ممكن: ممنوع ديغوكسين/فيراباميل — أميودارون أو تقويم" } },
      { title: { fr: "CHA₂DS₂-VASc : ≥ 2 (homme) / ≥ 3 (femme) ⇒ anticoagulation au long cours", ar: "CHA₂DS₂-VASc: ≥ 2 (رجل)/ ≥ 3 (امرأة) ⇒ تمييع طويل الأمد" } },
      { title: { fr: "Chercher et traiter le déclencheur : sepsis, hyperthyroïdie, EP, alcool, HTA", ar: "ابحث وعالج المحفز: إنتان، فرط درق، انصمام، كحول، ضغط" } },
      { title: { fr: "Échocardiographie pour évaluer VG/valves/oreillette", ar: "إيكو قلب لتقييم البطين/الصمامات/الأذين" } },
    ],
    keyPoints: [
      { fr: "L'objectif de fréquence est < 110/min au repos (lenient rate control) — pas la normalisation à tout prix.", ar: "هدف المعدل < 110/د بالراحة — لا التطبيع بأي ثمن." },
      { fr: "FA + fièvre + frissons = chercher le sepsis AVANT de multiplier les antiarythmiques.", ar: "رجفان + حمى = ابحث عن الإنتان قبل تكثير مضادات النظم." },
    ],
    trajectory: [
      { when: { fr: "Décompensation : PAS < 90 ou OAP", ar: "تدهور: انقباضي < 90 أو وذمة رئة" }, do: [
        { fr: "Cardioversion électrique sans délai — l'instabilité prime sur la datation.", ar: "تقويم كهربي دون تأخير — عدم الاستقرار يسبق التأريخ." },
      ]},
      { when: { fr: "Découverte d'EP ou de sepsis comme cause", ar: "اكتشاف انصمام أو إنتان كسبب" }, do: [
        { fr: "Traiter la cause d'abord : la FA est souvent le symptôme, pas la maladie.", ar: "عالج السبب أولاً: الرجفان عرض لا مرض غالباً." },
      ]},
    ],
    medications: ["esmolol", "amiodarone", "midazolam", "propofol", "enoxaparine"],
    calculators: ["qtc", "scores"],
    meta: { sources: ["ESC AF 2024"], lastReviewed: "2026-09" },
  },
  {
    id: "myocardite",
    title: { fr: "Myocardite aiguë", ar: "التهاب عضلة القلب الحاد" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "Contexte viral + douleur thoracique + troponine élevée chez un sujet jeune : éliminer le SCA, évaluer la fonction VG, dépister les arythmies malignes.", ar: "سياق فيروسي + ألم صدري + تروبونين مرتفع عند شاب: استبعد الإكليلي، قيّم وظيفة البطين، واكشف الاضطرابات الخبيثة." },
    exams: {
      bio: [{ fr: "Troponine, CRP, NFS, ± sérologies virales, BNP", ar: "تروبونين، CRP، عد دم، ± مصول فيروسية، BNP" }],
      img: [{ fr: "Échocardiographie (FEVG, épanchement) ; IRM cardiaque à distance = référence", ar: "إيكو (الكسر القذفي، انصباب)؛ الرنين القلبي لاحقاً = المرجع" }],
      ecg: [{ fr: "ECG : sus-ST diffus concaves, troubles du rythme — monitorage 24-48 h", ar: "تخطيط: ارتفاع ST منتشر مقعر، اضطرابات نظم — مراقبة 24-48 س" }],
    },
    steps: [
      { title: { fr: "Chez > 40 ans ou facteurs de risque : traiter comme un SCA jusqu'à coronarographie normale", ar: "فوق 40 أو عوامل خطورة: عالج كمتلازمة تاجية حتى قسطرة طبيعية" } },
      { title: { fr: "Monitorage continu : la mort subite par arythmie est le risque majeur des 48 premières heures", ar: "مراقبة مستمرة: الموت المفاجئ باضطراب النظم هو الخطر الأكبر في 48 س الأولى" } },
      { title: { fr: "Échocardiographie en urgence : FEVG abaissée ⇒ orientation fulminante", ar: "إيكو عاجل: كسر قذفي منخفض ⇒ اتجاه صاعق" } },
      { title: { fr: "Repos strict, éviter AINS à forte dose et sport (3-6 mois) — paracétamol pour la douleur", ar: "راحة تامة، تجنب مضادات الالتهاب بجرعات عالية والرياضة (3-6 أشهر) — باراسيتامول للألم" } },
      { title: { fr: "Choc cardiogénique : dobutamine/noradrénaline ± assistance mécanique — réanimation spécialisée", ar: "صدمة قلبية: دوبوتامين/نورأدرينالين ± دعم ميكانيكي — إنعاش متخصص" } },
      { title: { fr: "Hospitalisation en unité de surveillance continue — sortie seulement après 48 h stables", ar: "إدخال لوحدة مراقبة مستمرة — الخروج بعد 48 س مستقرة فقط" } },
    ],
    keyPoints: [
      { fr: "Myocardite fulminante = choc + FEVG effondrée chez un sujet jeune après un syndrome viral : pronostic BON si supporté à temps.", ar: "الالتهاب الصاعق = صدمة + كسر قذفي منهار عند شاب بعد فيروس: الإنذار جيد إذا دُعم بالوقت." },
      { fr: "Toute syncope ou TV dans un contexte de myocardite = hospitalisation en réa, risque de mort subite.", ar: "أي إغماء أو تسرع بطيني مع التهاب العضلة = إدخال إنعاش، خطر موت مفاجئ." },
    ],
    trajectory: [
      { when: { fr: "Choc cardiogénique (marbrures, lactate ↑, oligurie)", ar: "صدمة قلبية (تبرقش، لاكتات ↑، قلة إدرار)" }, do: [
        { fr: "Réanimation avec assistance circulatoire (ECMO/Impella) — transfert centre spécialisé.", ar: "إنعاش بدعم دوراني (ECMO) — تحويل لمركز متخصص." },
      ]},
      { when: { fr: "Arythmies ventriculaires répétées", ar: "اضطرابات بطينية متكررة" }, do: [
        { fr: "Amiodarone + correction du K⁺/Mg²⁺ ; défibrillateur externe en place.", ar: "أميودارون + تصحيح الشوارد؛ صدمات خارجية جاهزة." },
      ]},
    ],
    medications: ["dobutamine", "noradrenaline", "amiodarone", "paracetamol"],
    calculators: ["stemi", "qtc"],
    meta: { sources: ["ESC myocardite 2023", "AHA scientific statement"], lastReviewed: "2026-09" },
  },
];

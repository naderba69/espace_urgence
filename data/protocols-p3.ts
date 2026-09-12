import type { Protocol } from "./types";

// Phase 2 (2/2) — obstétrique, psychiatrie, toxicologie, traumatologie, pédiatrie.
export const protocolsP3: Protocol[] = [
  {
    id: "hemorragie-post-partum",
    title: { fr: "Hémorragie du post-partum (HPP)", ar: "نزف ما بعد الولادة" },
    category: "obstetrique",
    severity: "critical",
    summary: { fr: "Saignement génital après accouchement : massage utérin, ocytocine, TXA < 3 h, chirurgie si échec.", ar: "نزيف تناسلي بعد الولادة: تدليك رحمي، أوكسيتوسين، TXA <3 س." },
    steps: [
      { title: { fr: "Reconnaître AVANT 500 mL (ou toute perte avec signes) : saignement + atonie = urgence vitale", ar: "تعرّف قبل 500 مل (أو أي نزف بعلامات): نزف + انوثرة = خطر حيوي" } },
      { title: { fr: "Appel d'aide obstétricale/réanimation ; 2 VVP gros calibre ; bilan (NFS, hémostase, groupe)", ar: "نداء عاجل للتوليد/الإنعاش؛ خطّان غليظان؛ فحوص (صورة دم، تخثر، زمرة)" } },
      { title: { fr: "MASSAGE UTÉRIN immédiat + vidange vésicale", ar: "دلكة رحمية فورية + إفراغ المثانة" } },
      { title: { fr: "OCYTOCINE 5–10 UI IV lent ou PSE 20–40 UI titrée (pas de bolus rapide)", ar: "أوكسيتوسين 5–10 وحدات وريد ببطء أو مضخة 20–40 وحدة معايرة" } },
      { title: { fr: "ACIDE TRANEXAMIQUE 1 g IV sur 10 min <3 h (répétable ×1 à 30 min)", ar: "حمض ترانيكساميك 1 غ وريد على 10 د خلال <3س (تُعاد مرة بعد 30 د)" } },
      { title: { fr: "Réviser les 4T : Tonus (70 %), Traumatisme (déchirures), Tissu (rétention placentaire), Thrombine (hémostase)", ar: "ابحث 4T: توتّر (70%)، رضّ (تمزقات)، نسيج (مشيمة محتبسة)، ثرومبين (تخثر)" } },
      { title: { fr: "Remplissage prudent + réchauffement ; transfusion selon protocole ; utérotonique 2e ligne selon échec (sulprostone…)", ar: "توسيع حذر + تدفئة؛ نقل دم حسب البروتوكول؛ مقلِّص ثانٍ عند الفشل" } },
      { title: { fr: "Escalade : tamponnement (ballonnet), chirurgie (hémostase) — maternité/bloquet", ar: "تصعيد: سدادة بالون، جراحة إيقاف نزف — غرفة عمليات" } },
    ],
    keyPoints: [
      { fr: "Chaque minute de saignement majeur non traité augmente la mortalité maternelle.", ar: "كل دقيقة تأخير ترفع وفيات الأمهات." },
      { fr: "L'atonie utérine = 70 % des cas — le massage + ocytocine sauvent des vies immédiatement.", ar: "الانوثرة = 70% من الحالات — الدلكة والأوكسيتوسين فوران." },
    ],
    trajectory: [
      { when: { fr: "Saignement persistant malgré ocytocine", ar: "استمرار النزف رغم الأوكسيتوسين" }, do: [
        { fr: "Massage utérin ; sulprostone 500 µg IVSE/1 h (sauf contre-indication) ; sonde vésicale ; ballon de tamponnement si dispo ; bloc obstétrical.", ar: "مساج رحمي؛ سالبروستون 500 ميكروغ وريدي/س (ما لم يوجد مانع)؛ قسطرة بولية؛ بالون ضغط إن توفر؛ غرفة العمليات." },
      ]},
      { when: { fr: "Choc hémorragique", ar: "صدمة نزفية" }, do: [
        { fr: "2 VVP + NaCl ; acide tranexamique 1 g IV (< 3 h) ; transfusion CGR (4) + PFC ; noradrénaline si remplissage insuffisant.", ar: "خطان + ملح؛ حمض ترانيكساميك 1 غ وريدياً (< 3 س)؛ نقل كريات (4) + بلازما؛ نورأدرينالين إن كان التعويض غير كافٍ." },
      ]},
      { when: { fr: "Coagulopathie (fibrinogène < 2 g/L)", ar: "اضطراب تخثر (فيبرينوجين < 2 غ/ل)" }, do: [
        { fr: "Fibrinogène 4 g ou PFC ; réchauffement ; bilans itératifs (TP, fibrinogène, plaquettes).", ar: "فيبرينوجين 4 غ أو بلازما؛ تدفئة؛ تحاليل متكررة (TP، فيبرينوجين، صفيحات)." },
      ]},
      { when: { fr: "Arrêt du saignement", ar: "توقف النزف" }, do: [
        { fr: "Surveillance 2 h minimum (utérus contracté, saignement, diurèse) ; bilan à H24 ; anémie → fer ± transfusion.", ar: "مراقبة ساعتين على الأقل (رحم منقبض، نزف، تحبور)؛ تحاليل عند 24 س؛ فقر دم ← حديد ± نقل." },
      ]},
    ],
    medications: ["oxytocine", "acide-tranexamique"],
    calculators: [],
    meta: { sources: ["OMS HPP 2023", "WOMAN trial", "FIGO"], lastReviewed: "2026-08" },
  },
  {
    id: "agitation-aigue",
    title: { fr: "Agitation aiguë / hyperactivité psychomotrice", ar: "الهياج الحاد / فرط الحركة النفسي الحركي" },
    category: "psychiatrie",
    severity: "urgent",
    summary: { fr: "Agitation dangereuse : sécurité du personnel, contention douce pharmacologique ensuite.", ar: "هياج خطير: أمان الطاقم أولاً، تهدئة دوائية لاحقاً." },
    steps: [
      { title: { fr: "SÉCURITÉ d'abord : distance, issue libre, loin des objets dangereux, équipe renforcée ; ne jamais rester seul", ar: "السلامة أولاً: مسافة، مخرج حر، إبعاد الخطر، فريق إضافي؛ لا تبقَ وحيداً" } },
      { title: { fr: "Dé-escalade verbale : voix calme, phrases courtes, proposer (jamais ordonner), écouter", ar: "تهدئة كلامية: صوت هادئ، جمل قصيرة، اقتراح لا أمر، إصغاء" } },
      { title: { fr: "Éliminer une cause ORGANIQUE : glycémie, SpO2, TA, GCS, toxiques, sevrage, douleur, morsures ou infection", ar: "استبعد سبباً عضوياً: سكر، تشبع، ضغط، غلاسكو، سموم، سحب، ألم" } },
      { title: { fr: "Pharmacologique si échec et danger : proposer PO d'abord ; sinon IM avec contention protocolisée", ar: "دوائي عند الفشل والخطر: اعرض فموياً أولاً؛ وإلا عضلياً مع تثبيت منظّم" }, detail: { fr: "Options selon profil : midazolam IM 5 mg (durée courte), olanzapine IM, ou halopéridol ± prométhazine (surveillance allongement QT). Adapter âge, grossesse, BPCO.", ar: "خيارات حسب الملف: ميدازولام عضلي 5 ملغ، أو أولانزابين عضلي، أو هالوبيريدول (راقب QT). كيّف مع العمر والحمل والقصور." } },
      { title: { fr: "Après sédation : surveillance FR/SpO2/TA toutes les 15 min jusqu'à réveil", ar: "بعد التهدئة: مراقبة التنفس/التشبع/الضغط كل 15 د حتى اليقظة" } },
      { title: { fr: "Documenter et débriefer ; bilan somatique complet dès que le patient se calme", ar: "وثّق وناقش؛ فحص جسماني كامل بعد الهدوء" } },
    ],
    keyPoints: [
      { fr: "La parole et la négociation sont le traitement initial ; la contention provisoire = dernier recours, jamais punition.", ar: "الكلام هو العلاج الأول؛ التثبيت المؤقت ملاذ أخير لا عقوبة." },
      { fr: "Surveiller la sédation : les décès surviennent après la « victoire » (dépression respiratoire).", ar: "راقب التهدئة: الوفيات تحدث بعد نجاحها (تثبيط تنفسي)." },
    ],
    trajectory: [
      { when: { fr: "Pas d'apaisement après la 1ʳᵉ injection (15–20 min)", ar: "لا تهدئة بعد الحقنة الأولى (15–20 د)" }, do: [
        { fr: "2ᵉ injection (neuroleptique différent ou midazolam 5–10 mg IM) ; contention réglementaire si nécessaire (équipe, surveillance continue).", ar: "حقنة ثانية (مضاد ذهان مختلف أو ميدازولام 5–10 ملغ عضلياً)؛ تقييد قانوني عند الحاجة (فريق، مراقبة مستمرة)." },
      ]},
      { when: { fr: "Après sédation : FR < 10, SpO₂ < 94 %, hypotension", ar: "بعد التهدئة: تنفس < 10، تشبع < 94%، هبوط ضغط" }, do: [
        { fr: "Scope + O₂ ; naloxone/flumazénil si suspicion d'opiacés/benzodiazépines ; surveillance jusqu'à réveil complet.", ar: "مراقبة + أكسجين؛ نالوكسون/فلومازينيل إذا اشتباه أفيونيات/بنزوديازيبينات؛ مراقبة حتى اليقظة التامة." },
      ]},
      { when: { fr: "Complication : T° ≥ 40 °, rigidité, CPK ↑", ar: "مضاعفة: حرارة ≥ 40، تصلب، ارتفاع CPK" }, do: [
        { fr: "Suspicion syndrome malin/rhabdomyolyse : refroidissement + NaCl 1–1,5 L/h + arrêt du neuroleptique ; transfert.", ar: "اشتباه متلازمة خبيثة/تحلل عضلي: تبريد + ملح 1–1.5 ل/س + إيقاف مضاد الذهان؛ تحويل." },
      ]},
      { when: { fr: "Apaisement obtenu", ar: "تحققت التهدئة" }, do: [
        { fr: "Recherche étiologique (éthylémie, toxiques, hypoglycémie, neuro) ; entretien apaisé ; orientation psychiatrique si crise.", ar: "ابحث عن السبب (كحول، سموم، نقص سكر، عصبي)؛ حوار مهدّئ؛ توجيه نفسي إذا أزمة." },
      ]},
    ],
    medications: ["midazolam"],
    calculators: ["dose-poids"],
    meta: { sources: ["SFMU agitation / psychiatrie urgence", "BAP NICE"], lastReviewed: "2026-08" },
  },
  {
    id: "intoxication-paracetamol",
    title: { fr: "Intoxication au paracétamol", ar: "تسمم بالباراسيتامول" },
    category: "toxicologie",
    severity: "urgent",
    summary: { fr: "Surdose de paracétamol : dose estimée, NAC précoce si seuil atteint, surveillance hépatique.", ar: "جرعة باراسيتامول زائدة: تقدير، NAC مبكر عند بلوغ العتبة." },
    steps: [
      { title: { fr: "Évaluer : produit, dose (mg/kg), heure de l'INGESTION (± décalée), co-ingestions, contexte", ar: "قيّم: المنتج، الجرعة (ملغ/كغ)، ساعة الابتلاع (± متدرجة)، مشاركات، سياق" } },
      { title: { fr: "Ingestion unique >150 mg/kg (ou >200 quel que soit contexte de risque) : NAC sans attendre le taux", ar: "ابتلاع وحيد >150 ملغ/كغ: ابدأ الـNAC دون انتظار التحليل" } },
      { title: { fr: "Dosage para-aminophénolémie 4–16 h post-ingestion → nomogramme de Rumack-Matthew pour décider/continuer", ar: "قياس التركيز بين 4–16 س ← نوموغرام روماك-ماثيو للقرار" } },
      { title: { fr: "NAC 21 h : 150 mg/kg/1 h → 50 mg/kg/4 h → 100 mg/kg/16 h (G5 % uniquement)", ar: "NAC 21 س: 150 ملغ/كغ /س ← 50/4س ← 100/16س (غلوكوز 5% فقط)" } },
      { title: { fr: "Bilan : ASAT, ALAT, INR, créatinine, gazométrie, pH à l'admission puis à distance", ar: "فحوص: كبد، INR، كرياتينين، غازات عند الدخول ولاحقاً" } },
      { title: { fr: "Charbon activé si <1 h ingestion massive ET voies aériennes protégées (controversé, dosage élevé)", ar: "فحم منشط إن <ساعة وكتلة كبيرة ومجرى محمي (جدل قائم)" } },
      { title: { fr: "King's College criteria si insuffisance hépatique → discussion greffe cas échéant (urgence absolue)", ar: "معايير كينغز كوليدج عند قصور كبدي ← ناقش الزرع فوراً" } },
      { title: { fr: "Évaluation psychiatrique obligatoire après stabilisation (suicide/auto-agression)", ar: "تقييم نفسي إلزامي بعد الاستقرار (انتحار/إيذاء ذات)" } },
    ],
    keyPoints: [
      { fr: "Les signes cliniques = tardifs : le nomogramme et l'heure d'ingestion guident — ne pas attendre.", ar: "الأعراض متأخرة: اعتمد على النوموغرام والساعة — لا تنتظر." },
      { fr: "NAC = efficace surtout <8 h ; bénéfice possible au-delà. Ne jamais stopper pour une réaction anaphylactoïde légère.", ar: "NAC أمثل <8س وفعّال بعدها أيضاً. لا توقفه لتفاعل خفيف." },
    ],
    trajectory: [
      { when: { fr: "Réaction à la NAC (éruption, bronchospasme)", ar: "تفاعل مع أسيتيل سيستئين (طفح، تشنج قصبي)" }, do: [
        { fr: "Suspendre 30 min ; antihistaminique ± bronchodilatateur ; reprendre à débit réduit (NE PAS arrêter définitivement).", ar: "أوقف 30 د؛ مضاد هيستامين ± موسع قصبي؛ استأنف بجريان أقل (لا توقف نهائياً)." },
      ]},
      { when: { fr: "Vomissements persistants", ar: "قيء مستمر" }, do: [
        { fr: "Privilégier la voie IV ; métoclopramide 10 mg IV ; poursuivre l'antidote malgré les vomissements.", ar: "فضّل الطريق الوريدي؛ ميتوكلوبراميد 10 ملغ وريدياً؛ واصل الترياق رغم القيء." },
      ]},
      { when: { fr: "24–72 h : cytolyse (ASAT ↑), TP < 50 %, encéphalopathie", ar: "24–72 س: تحلل كبدي (ارتفاع ASAT)، TP < 50%، اعتلال دماغي" }, do: [
        { fr: "Hépatite fulminante : NAC prolongée + transfert hépatologie/réanimation (lactates, TP, pH de suivi).", ar: "التهاب كبدي خاطف: أسيتيل سيستئين ممتد + تحويل كبد/إنعاش (لاكتات، TP، pH للمراقبة)." },
      ]},
      { when: { fr: "Paracétamolémie sous le seuil de toxicité", ar: "تركيز الباراسيتامول تحت العتبة السامة" }, do: [
        { fr: "Sortie possible + entretien (psychiatrique si tentative de suicide) ; consignes : pas de paracétamol sans avis.", ar: "الخروج ممكن + حوار (نفسي إذا محاولة انتحار)؛ تعليمات: لا باراسيتامول دون استشارة." },
      ]},
    ],
    medications: ["acetylcysteine"],
    calculators: [],
    meta: { sources: ["CAP paracétamol", "Prescrire antidotes"], lastReviewed: "2026-08" },
  },
  {
    id: "intoxication-organophosphores",
    title: { fr: "Intoxication organophosphorée (pesticides)", ar: "تسمم بالمركبات الفوسفورية العضوية" },
    category: "toxicologie",
    severity: "critical",
    summary: { fr: "OP : décontamination, atropine à l'atropinisation, pralidoxime si précoce.", ar: "الفوسفور العضوي: إزالة تلوث، أتروبين حتى الأتروبنية، براليدوكسيم مبكر." },
    steps: [
      { title: { fr: "PROTECTION SOIGNANTS : gants/EPI, décontamination (hors exut et cheveux), retirer les vêtements souillés", ar: "حمي الطاقم: قفازات/وقاية، تطهير بالماء، انزع الثياب الملوثة" } },
      { title: { fr: "Reconnaître le syndrome cholinergique : myosis, hypersécrétions, sueurs, bradycardie, bronchospasme, fasciculations puis faiblesse", ar: "متلازمة كولينية: حدقة دبوسية، إفرازات، تعرق، بطء قلب، تشنج قصبي، رعاش ثم وهن" } },
      { title: { fr: "ATROPINE : 1–2 mg IV bullet, répéter en doublant jusqu'à atropinisation (sécheresse, cœur >80, pupilles)", ar: "أتروبين: 1–2 ملغ وريد دفعة، ضاعِف حتى الأتروبنة (جفاف، نبض>80، حدقة)" }, detail: { fr: "Des doses massives cumulées sont parfois nécessaires (dizaines de mg) — titrer à l'effet, pas à un total.", ar: "قد تلزم جرعات تراكمية ضخمة — عايِر على التأثير لا المجموع." } },
      { title: { fr: "Pralidoxime/Obidoxime (réactivateur d'acétylcholinestérase) le plus tôt possible — milieu spécialisé", ar: "براليدوكسيم/أوبيدوكسيم بأسرع وقت — وسط مختص" } },
      { title: { fr: "Diazépam si convulsions (rejeter les phénothiazines à faible seuil épileptogène)", ar: "ديازيبام عند الاختلاج (تجنّب الفينوثيازين)" } },
      { title: { fr: "Ventilation : syndrome intermédiaire (24–96 h) = paralysie respiratoire retardée — surveillance prolongée", ar: "متلازمة وسطية (24–96س) = شلل تنفسي مؤخر — مراقبة ممتدة" } },
    ],
    keyPoints: [
      { fr: "Atropine jusqu'au secrétaire sec, pas à une dose fixe ; c'est un titrage clinique.", ar: "أتروبين حتى الجفاف لا حتى جرعة ثابتة — معايرة سريرية." },
      { fr: "La protection du soignant n'est pas négociable (contamination secondaire décrite).", ar: "حماية الطاقم غير قابلة للمساومة (تلوث ثانوي موثق)." },
    ],
    trajectory: [
      { when: { fr: "Bronchorrhée / sécrétions persistantes", ar: "استمرار الإفرازات القصبية" }, do: [
        { fr: "Doubler l'atropine jusqu'au DESSÈCHEMENT complet (parfois plusieurs mg/h en PSE) ; surveiller la tachycardie.", ar: "ضاعف الأتروبين حتى الجفاف الكامل للأغشية (أحياناً عدة ملغ/س بمضخة)؛ راقب تسارع القلب." },
      ]},
      { when: { fr: "Défaillance respiratoire / convulsions", ar: "قصور تنفسي / تشنجات" }, do: [
        { fr: "Intubation-ventilation ; diazépam ; pralidoxime 30 mg/kg (entretien 24–48 h si dispo).", ar: "تنبيب وتهوية؛ ديازيبام؛ براليدوكسيم 30 ملغ/كغ (متابعة 24–48 س إن توفر)." },
      ]},
      { when: { fr: "Syndrome intermédiaire (24–96 h) : faiblesse cervicale, détresse", ar: "المتلازمة الوسيطة (24–96 س): ضعف عنقي، ضيق تنفس" }, do: [
        { fr: "Surveillance continue ; ventilation si faiblesse diaphragmatique ; ne pas sous-estimer (risque de décompensation).", ar: "مراقبة مستمرة؛ تهوية إذا ضعف الحجاب الحاجز؛ لا تستهن (خطر التدهور)." },
      ]},
      { when: { fr: "Amélioration", ar: "تحسّن" }, do: [
        { fr: "Surveillance ≥ 72 h (risque de rebond) ; décontamination complète (peau, vêtements) ; consignes d'éviction.", ar: "مراقبة ≥ 72 س (خطر الارتداد)؛ تنقية كاملة (جلد، ملابس)؛ تعليمات الإبعاد عن المصدر." },
      ]},
    ],
    medications: ["atropine", "diazepam"],
    calculators: [],
    meta: { sources: ["CAP/SRLF tox", "OMS pesticides"], lastReviewed: "2026-08" },
  },
  {
    id: "traumatisme-cranien",
    title: { fr: "Traumatisme crânien grave", ar: "رضّ الرأس الشديد" },
    category: "traumatologie",
    severity: "critical",
    summary: { fr: "Trauma crânien : GCS, pupilles, signes d'engagement → scanner et transport.", ar: "رض الرأس: غلاسكو، حدقات، علامات انحشار ← تصوير ونقل." },
    steps: [
      { title: { fr: "XABCDE + rachis cervical protégé ; GCS (noter E, V, M séparément) ; pupilles", ar: "XABCDE مع حماية الرقبة؛ غلاسكو مفصلاً؛ حدقتان" } },
      { title: { fr: "GCS ≤8 ou risque ventilatoire : IOT précoce (RSI) — NE PAS hyperventiler de routine", ar: "غلاسكو ≤8 أو خطر تنفسي: تنبيب مبكر (RSI) — بلا تهوية مفرطة روتينية" } },
      { title: { fr: "PAS cible ≥100–110 mmHg (âge-dépendant) ; SpO2 ≥94 % ; normoglycémie ; normothermie ; tête surélevée 30°", ar: "انقباضي ≥100–110 حسب العمر؛ تشبع ≥94%؛ سكر طبيعي؛ حرارة طبيعية؛ رأس مرفوع 30°" } },
      { title: { fr: "Signes de hernie/HTIC brutale : mannitol ou NaCl hypertonique (7,5 %) selon protocole — appel neurochir", ar: "علامات انحشار/ضغط قحفي: مانيتول أو مصل مفرط التوتر — نداء جراحة الأعصاب" } },
      { title: { fr: "TDM cérébrale en urgence ; scanner du reste si polytraumatisme", ar: "سكانر دماغ مستعجل ± الجسم إن تعدد الرضوض" } },
      { title: { fr: "Anticoagulants/antiagrégants : inversion selon molécule (PPSB, andexanet, protamine…) — protocole local", ar: "مضادات التخثر: عكس حسب الجزيء (مركّب عوامل، أنديكسانيت، بروتامين) — بروتوكول محلي" } },
      { title: { fr: "Anticonvulsivant prophylactique 7 j (certaines équipes : lévétiracétam/phénytoïne)", ar: "مضاد اختلاج وقائي 7 أيام حسب الفريق" } },
    ],
    keyPoints: [
      { fr: "Un seul épisode d'hypotension ou d'hypoxie double la mortalité — ce sont les cibles n°1.", ar: "نوبة انخفاض ضغط أو نقص أكسجين واحدة تضاعف الوفيات — هما الهدف الأول." },
      { fr: "Hyperventilation seulement en dernier recours de décompensation (ischémie aggravée).", ar: "التهوية المفرطة ملاذ أخير عند الانحشار (تفاقم إقفاري)." },
    ],
    trajectory: [
      { when: { fr: "Aggravation neurologique (GCS −2, mydriase unilatérale)", ar: "تدهور عصبي (غلاسكو −2، توسع حدقة أحادي)" }, do: [
        { fr: "Intubation (cible PaCO₂ ~35 mmHg) ; osmothérapie (mannitol 0,5 g/kg ou NaCl 3 %) ; TDM urgente + neurochirurgien.", ar: "تنبيب (هدف CO₂ ~35)؛ علاج أسموزي (مانيتول 0.5 غ/كغ أو ملح 3%)؛ صورة عاجلة + جراح أعصاب." },
      ]},
      { when: { fr: "Crise convulsive", ar: "نوبة تشنجية" }, do: [
        { fr: "Benzodiazépine IV ; prévention par phénytoïne/lévétiracétam si traumatisme sévère ; contrôle glycémie.", ar: "بنزوديازيبين وريدياً؛ وقاية بالفينيتوين/ليفيتيراسيتام إذا رضح شديد؛ رقابة السكر." },
      ]},
      { when: { fr: "Chez le stable : céphalées croissantes, vomissements répétés", ar: "في الحالة المستقرة: صداع متزايد، قيء متكرر" }, do: [
        { fr: "TDM cérébrale ; surveillance horaire 24 h (hématome tardif surtout sous anticoagulant).", ar: "صورة دماغ؛ مراقبة كل ساعة 24 س (ورم دموي متأخر خاصة تحت مضادات التخثر)." },
      ]},
      { when: { fr: "Critères de sortie", ar: "معايير الخروج" }, do: [
        { fr: "GCS 15 + TDM normale (ou pas d'indication TDM selon règles validées) ; consignes écrites de re-consultation (somnolence, vomissements, trouble visuel).", ar: "غلاسكو 15 + صورة سليمة (أو لا داعي للصورة حسب القواعد المعتمدة)؛ تعليمات مكتوبة للرجوع (نعاس، قيء، اضطراب بصري)." },
      ]},
    ],
    medications: ["midazolam"],
    calculators: ["gcs"],
    meta: { sources: ["Brain Trauma Foundation 4e", "ATLS 10e"], lastReviewed: "2026-08" },
  },
  {
    id: "brulure-grave",
    title: { fr: "Brûlure grave", ar: "الحرق الشديد" },
    category: "traumatologie",
    severity: "urgent",
    summary: { fr: "Brûlure étendue : refroidissement initial, estimation SBR/âge, remplissage Parkland, couverture stérile.", ar: "حريق ممتد: تبريد أولي، تقدير المساحة، تعويض باركلاند، تغطية معقمة." },
    steps: [
      { title: { fr: "Stopper le processus : éteindre, retirer vêtements brûlants/bijoux montre ; refroidir à l'eau du robinet 15–20 min (PAS de glace)", ar: "أوقف الحرق: أطفئ، انزع الثياب/المجوهرات، برّد بماء الصنبور 15–20 د (لا ثلج)" } },
      { title: { fr: "XABCDE ; voie aérienne : brûlures face/cou, suie, voix rauque → INtubation précoce (risque d'œdème)", ar: "XABCDE؛ مجرى هوائي: حروق وجه/رقبة، سخام، بحة ← تنبيب مبكر (خطر وذمة)" } },
      { title: { fr: "Évaluer la surface brûlée (règle des 9 adulte / Lund-Browder enfant) → calculateur", ar: "قدّر المساحة المحروقة (قاعدة التسعات/لند-براودر) ← الحاسبة" } },
      { title: { fr: "Analgésie morphiniques (O2 si besoin) — la douleur est intense", ar: "تسكين أفيوني — الألم شديد" } },
      { title: { fr: "Remplissage Parkland si >20 % adulte (>10–15 % enfant) : 4 mL × kg × % en 24 h, moitié en 8 h", ar: "توسيع باركلاند إن >20% كبير (10–15% طفل): 4 مل×كغ×% في 24 س، نصفها بأول 8 س" } },
      { title: { fr: "Couverture propre stérile / film alimentaire (support non adhérent) ; prévenir l'hypothermie", ar: "غطاء نظيف معقم/فيلم تغليف؛ امنع انخفاض الحرارة" } },
      { title: { fr: "Gare brûlures électriques (myoglobine) et chimiques (douche abondante prolongée, acide/base)", ar: "احذر الحرائق الكهربائية (ميوغلوبين) والكيميائية (دش مطوّل)" } },
      { title: { fr: "Critères de brûlure grave : face/mains/périnée, circulaire, inhalation, >5 % (enfant) ou >10 % adulte 2e degré → centre brûlés", ar: "حروق خطيرة: وجه/يدان/عجان، دائرية، استنشاق، >5% طفل أو >10% كبير درجة ثانية ← مركز حروق" } },
    ],
    keyPoints: [
      { fr: "Refroidir l'eau 20 min = moins de profondeur ; la glace aggrave.", ar: "20 د ماء جارٍ تقلّص العمق؛ الثلج يُفاقم." },
      { fr: "Parkland démarre au moment de la brûlure, pas de l'admission.", ar: "باركلاند يبدأ من ساعة الحرق لا من وصول المستشفى." },
    ],
    trajectory: [
      { when: { fr: "Brûlure visage / enclos fermé, voix rauque, suie", ar: "حروق وجه / مكان مغلق، صوت مبحوح، سخام" }, do: [
        { fr: "Intubation PROPHYLACTIQUE précoce (dans la 1ʳᵉ heure) avant l'œdème ; O₂ 100 % si suspicion d'inhalation.", ar: "تنبيه وقائي مبكر (خلال الساعة الأولى) قبل الوذمة؛ أكسجين 100% إذا اشتباه استنشاق." },
      ]},
      { when: { fr: "Oligurie malgré le remplissage (< 0,5 mL/kg/h)", ar: "قلة بول رغم التعويض (< 0.5 مل/كغ/س)" }, do: [
        { fr: "Augmenter le NaCl de 10–20 % ; vérifier la sonde ; escarrotomie si brûlure circulaire ; réévaluer la surface.", ar: "زد الملح 10–20%؛ تحقق من القسطرة؛ شق جلد إذا حرق دائري؛ أعد تقدير المساحة." },
      ]},
      { when: { fr: "Hypothermie < 35 °C", ar: "هبوط حرارة < 35" }, do: [
        { fr: "Réchauffement actif + liquides réchauffés ; limiter les surfaces exposées ; revoir la formule de remplissage (T° basse = pas de bolus massif froid).", ar: "تدفئة نشطة + سوائل دافئة؛ قلّل الأسطح المكشوفة؛ أعد حساب التعويض (لا دفعات باردة واسعة)." },
      ]},
      { when: { fr: "Douleur intense", ar: "ألم شديد" }, do: [
        { fr: "Titrage morphinique IV systématique ± MEOPA pour les transports ; soigner l'attitude (couverture, silence).", ar: "معايرة مورفينية وريدية منتظمة ± غاز الضحك للنقل؛ اعتنِ بالإحساس (تغطية، هدوء)." },
      ]},
    ],
    medications: ["morphine", "ketamine"],
    calculators: ["brulures"],
    meta: { sources: ["ABA / PHTLS brûlure", "ERC traumatologie"], lastReviewed: "2026-08" },
  },
  {
    id: "deshydratation-enfant",
    title: { fr: "Déshydratation aiguë de l'enfant (entérite)", ar: "تجفاف الطفل الحاد (التهاب معوي)" },
    category: "pediatrie",
    severity: "urgent",
    summary: { fr: "Déshydratation aiguë de l'enfant : plan OMS A/B/C selon les signes cliniques.", ar: "تجفاف الطفل الحاد: خطة OMS أ/ب/ج حسب العلامات." },
    steps: [
      { title: { fr: "Pesée (déshydratation %) ; signes cliniques OMS : pli, yeux, soif, état général", ar: "وزن؛ علامات OMS: طية جلد، عيون غائرة، عطش، حالة عامة" } },
      { title: { fr: "Plan A (pas de déshydratation) : SRO après chaque selle + poursuite alimentation", ar: "خطة A (لا تجفاف): محلول تعويض بعدد كل خروج + استمرار التغذية" } },
      { title: { fr: "Plan B (déshydratation 5–10 %) : SRO 50–100 mL/kg sur 4 h (pipette/seringue, petites gorgées)", ar: "خطة B (5–10%): ORS بـ50–100 مل/كغ على 4 س برشفات صغيرة" } },
      { title: { fr: "Plan C (choc/déshydratation sévère) : NaCl 0,9 % 20 mL/kg bolus IV, réévaluer, répéter si besoin", ar: "خطة C (صدمة/جفاف شديد): مصل ملحي 20 مل/كغ دفعة وريد، أعد التقييم وكرّر" } },
      { title: { fr: "Iono si sévère ou doute (Na+, K+, glycémie) ; antidiarrhéique interdit ; antibiotiques seulement si suspicion bactérienne", ar: "أيونوغرام بالشدة أو الشك؛ مضادات الإسهال ممنوعة؛ مضادات حيوية فقط عند اشتباه جرثومي" } },
      { title: { fr: "Réalimentation précoce (lait maternel non interrompu) ; zinc 10–20 mg ×10–14 j selon recommandations", ar: "إطعام مبكر (لا توقف الرضاعة)؛ زنك 10–20 ملغ ×10–14 يوم" } },
    ],
    keyPoints: [
      { fr: "Le SRO oral est le traitement de 1ère ligne même chez le déshydraté modéré.", ar: "محلول الإمهاء الفموي هو الخط الأول حتى مع الجفاف المتوسط." },
      { fr: "Lenteur du pli cutané + yeux enfoncés + pouls filant = choc → plan C immédiat.", ar: "بطء الطية + عيون غائرة + نبض خيطي = صدمة ← خطة C فوراً." },
    ],
    trajectory: [
      { when: { fr: "Amélioration à 2 h de réhydratation orale", ar: "تحسّن بعد ساعتين من المعالجة الفموية" }, do: [
        { fr: "Poursuivre les SRO sur 4 h ; réalimentation précoce ; pesée de contrôle ; éducation des parents.", ar: "واصل المحلول الفموي 4 س؛ إطعام مبكر؛ وزن مراقب؛ تثقيف الوالدين." },
      ]},
      { when: { fr: "Vomissements persistants sous SRO", ar: "قيء مستمر تحت المعالجة الفموية" }, do: [
        { fr: "Ondansétron (usage hors AMM à discuter) ou SRO en continu par sonde gastrique ; réévaluer à 1 h.", ar: "أوندانسيترون (خارج الترخيص يُناقش) أو محلول متواصل عبر أنبوب معدي؛ إعادة تقييم بعد ساعة." },
      ]},
      { when: { fr: "Aggravation / signes de choc", ar: "تدهور / علامات صدمة" }, do: [
        { fr: "NaCl 0,9 % 20 mL/kg IV (répéter ×2–3) ; rechercher une infection urinaire/une infection grave (ECBU, antibiothérapie si sepsis).", ar: "ملح 0.9% بجرعة 20 مل/كغ وريدياً (كرر ×2–3)؛ ابحث عن عدوى بولية/عدوى شديدة (مزرعة بول، مضاد حيوي إذا إنتان)." },
      ]},
      { when: { fr: "Convulsion sur hyponatrémie", ar: "تشنج على نقص صوديوم" }, do: [
        { fr: "NaCl hypertonique 3 % : 3 mL/kg IV ; hospitalisation ; contrôle natrémie (ne pas corriger > 8–10 mmol/L/24 h).", ar: "ملح مفرط التوتر 3%: 3 مل/كغ وريدياً؛ تنويم؛ رقابة الصوديوم (لا تصحيح > 8–10 ميلي مكافئ/24 س)." },
      ]},
    ],
    medications: [],
    calculators: ["debit-perfusion", "poids-pediatrique"],
    meta: { sources: ["OMS déshydratation", "ESPGHAN entérite aiguë"], lastReviewed: "2026-08" },
  },
];

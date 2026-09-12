import type { Protocol } from "./types";

// Phase 2 (1/2) — médecine & réanimation. Sources par fiche.
export const protocolsP2: Protocol[] = [
  {
    id: "sca-stemi",
    title: { fr: "Douleur thoracique / SCA (STEMI & NSTEMI)", ar: "ألم صدري / متلازمة تاجية حادة" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Douleur thoracique coronarienne : ECG < 10 min, aspirine, reperfusion PCI dans les délais.", ar: "ألم صدري تاجي: ECG خلال 10 دقائق، أسبرين، وقسطرة ضمن المهلة." },
    steps: [
      { title: { fr: "ECG 12 dérivations immédiat (<10 min) ; ± dérivations droites/postérieures si doute", ar: "تخطيط 12 اشتقاق فوراً (<10 د)؛ ± اشتقاقات يمنى/خلفية عند الشك" }, detail: { fr: "Sus-décalage ST ≥1 mm dans 2 dérivations contiguës = critère STEMI (adapter seuils âge/sexe).", ar: "ارتفاع ST ≥1 مم في اشتقاقين متجاورين = معيار الاحتشاء (عدّل حسب العمر/الجنس)." } },
      { title: { fr: "MOrPHINE? D'abord : ABCDE, TA aux 2 bras, SpO2, VVP, scope", ar: "أولاً: ABCDE، ضغط بالذراعين، تشبع، خط وريدي، مراقبة" } },
      { title: { fr: "Aspirine 150–300 mg (mâcher) + anti-P2Y12 selon orientation (ticagrélor/clopidogrel)", ar: "أسبرين 150–300 ملغ بالمضغ + مضاد P2Y12 حسب التوجيه (تيكاغريلور/كلوبيدوغريل)" } },
      { title: { fr: "Douleur persistante & PAS >100 : trinitrine SL 0,3–0,6 mg q5 min ×3", ar: "ألم مستمر وانقباضي >100: نترات تحت اللسان كل 5 د ×3" } },
      { title: { fr: "O2 UNIQUEMENT si SpO2 <90 % ; morphine si douleur réfractaire (2–4 mg titré)", ar: "أكسجين فقط إذا تشبع <90%؛ مورفين إن الألم مقاوم (2–4 ملغ معايرة)" } },
      { title: { fr: "STEMI : angioplastie primaire — objectif <120 min du diagnostic (appel cardiologie/SAMU immédiat)", ar: "احتشاء بارتفاع ST: قسطرة أولية — الهدف <120 د من التشخيص (اتصال فوري بالقسطرة)" }, detail: { fr: "Si délai PCI >120 min : thrombolyse <12 h des symptômes si pas de CI.", ar: "إن تجاوز أجل القسطرة 120 د: حلّ الخثرة خلال <12 س من الأعراض دون موانع." } },
      { title: { fr: "NSTEMI : stratification troponine/risque → coronarographie <24 h si haut risque", ar: "دون ST: تروبونين/خطر ← قسطرة <24 س إذا عالي الخطورة" } },
      { title: { fr: "Anticoagulation (HNF/énoxaparine) selon protocole ; consultation cardiologue", ar: "تسييل (هيبارين/إينوكسابارين) حسب البروتوكول + رأي مختص" } },
    ],
    keyPoints: [
      { fr: "Chaque minute de coronare fermée = myocarde perdu. « Door-to-balloon » <90 min idéal.", ar: "كل دقيقة إغلاق للتاجية = عضلة مفقودة." },
      { fr: "Jamais de trinitrine si PAS <90 mmHg ou suspicion d'IDM inférieur/droit.", ar: "لا نترات إذا انقباضي <90 أو اشتباه احتشاء سفلي/أيمن." },
    ],
    trajectory: [
      { when: { fr: "Complication : arrêt cardiaque (FV / TV sans pouls)", ar: "مضاعفة: توقف قلبي (رجفان بطيني / تسرع بطيني بلا نبض)" }, do: [
        { fr: "RCP + DSA immédiat ; adrénaline 1 mg IV toutes les 3–5 min après le 2ᵉ choc.", ar: "إنعاش + صعق فوري؛ أدرينالين 1 ملغ وريدياً كل 3–5 د بعد الصعقة الثانية." },
        { fr: "Corridor PCI maintenu : coronarographie dès la reprise d'une activité circulatoire (post-ROSC).", ar: "استمر في مسار القسطرة: تاجية مباشرة بعد عودة الدوران (ما بعد ROSC)." },
      ]},
      { when: { fr: "Évolution : choc cardiogénique (PAS < 90, marbrures)", ar: "تطوّر: صدمة قلبية (انقباضي < 90، بقع زرقاء)" }, do: [
        { fr: "Remplissage prudent 100–150 mL uniquement si pas de congestion ; noradrénaline en PSE.", ar: "تعويض حذر 100–150 مل فقط إن لم يوجد احتقان؛ نورأدرينالين بمضخة." },
        { fr: "Reperfusion urgente ; transfert vers un centre avec assistance (ECMO/ballon) si disponible.", ar: "إعادة تروية عاجلة؛ تحويل لمركز بدعم ميكانيكي (ECMO/بالون) إن توفر." },
      ]},
      { when: { fr: "Complication : OAP associé (orthopnée, crépitants, SpO₂ ↓)", ar: "مضاعفة: وذمة رئة مصاحبة (زلة في الاستلقاء، خراخر، هبوط التشبع)" }, do: [
        { fr: "Position assise, O₂, trinitrine SL si PAS > 110, furosémide 40 mg IV ; PAS de remplissage massif.", ar: "جلوس، أكسجين، نترات تحت اللسان إذا انقباضي > 110، فوروسيميد 40 ملغ وريدياً؛ لا تعويض واسع." },
      ]},
      { when: { fr: "Si pas d'amélioration à 30 min (douleur / récidive ECG)", ar: "إن لم يحدث تحسّن خلال 30 د (ألم / رجوع شذوذ التخطيط)" }, do: [
        { fr: "Refaire un ECG complet (± postérieures/droites) ; escalade vers coronarographie < 2 h.", ar: "أعد تخطيطاً كاملاً (± خلفية/يمنى)؛ تصعيد نحو قسطرة < 2 س." },
      ]},
    ],
    medications: ["aspirine", "enoxaparine", "trinitrine", "morphine"],
    calculators: [],
    meta: { sources: ["ESC NSTE-ACS 2023", "ACC/AHA STEMI 2023+"], lastReviewed: "2026-08" },
  },
  {
    id: "oap",
    title: { fr: "Œdème aigu du poumon (OAP)", ar: "وذمة الرئة الحادة" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Insuffisance cardiaque gauche aiguë : position, O₂, diurétiques et vasodilatateurs selon la TA.", ar: "قصور القلب الأيسر الحاد: جلوس، أكسجين، مدرات وموسعات حسب الضغط." },
    steps: [
      { title: { fr: "Position assise/jambes pendantes ; retirer ce qui comprime", ar: "اجلس المريض ورجلاه متدليتان" } },
      { title: { fr: "O2 haute concentration ; SPACER si BPCO ; objectif SpO2 94–98 %", ar: "أكسجين عالي التركيز؛ الهدف 94–98% (88–92% إن كان مريض انسداد مزمن)" } },
      { title: { fr: "CPAP dès que possible si détresse respiratoire avec signes de lutte (FR >30)", ar: "CPAP بأسرع وقت عند ضيق التنفس مع علامات الجهد (FR>30)" } },
      { title: { fr: "Trinitrine : 1–2 bouffées SL q5 min si PAS >100 mmHg ; PSE si milieu médicalisé", ar: "نترات تحت اللسان 1–2 بخة كل 5 د إن انقباضي >100" } },
      { title: { fr: "Furosémide 40–80 mg IV lent si surcharge volémique avérée (± adaptée au fond)", ar: "فوروسيميد 40–80 ملغ وريد بطيء عند فرط الحجم المؤكد" } },
      { title: { fr: "Morphine 2–4 mg IV titré si angoisse majeure/douleur (prudence : dépression)", ar: "مورفين 2–4 ملغ معايرة للقلق الشديد/الألم (حذر: تثبيط)" } },
      { title: { fr: "Réévaluer : OAP polaire vs cause (arythmie, valvulopathie, HTA maligne) → examiner, iono, troponine", ar: "أعد التقييم وابحث عن السبب (نظم، صمام، ضغط خبيث)" } },
      { title: { fr: "Échec/état de choc : intubation, amines, ECMO/réa", ar: "فشل/صدمة: تنبيب، أمين، إنعاش" } },
    ],
    keyPoints: [
      { fr: "Nitrates = 1ère ligne si TA élevée ; diurétiques si surcharge ; CPAP sauve des intubations.", ar: "النترات أولاً إذا الضغط مرتفع؛ المدرّ عند فرط الحجم؛ CPAP يجنّب التنبيب." },
      { fr: "Chez le BPCO chronique : objectif SpO2 88–92 %.", ar: "عند مريض الانسداد المزمن: الهدف 88–92%." },
    ],
    trajectory: [
      { when: { fr: "Réponse favorable à 30 min (SpO₂ ≥ 94 %, dyspnée ↓)", ar: "استجابة جيدة خلال 30 د (تشبع ≥ 94%، تحسّن الزلة)" }, do: [
        { fr: "Poursuivre le traitement ; diurèse horaire ; PAS de sortie avant réévaluation complète (± radiographie).", ar: "واصل العلاج؛ تحبور كل ساعة؛ لا خروج قبل إعادة تقييم كاملة (± صورة صدر)." },
      ]},
      { when: { fr: "Échec de la VNI à 15–30 min (épuisement, GCS ↓, SpO₂ < 90 %)", ar: "فشل VNI خلال 15–30 د (إنهاك، هبوط غلاسكو، تشبع < 90%)" }, do: [
        { fr: "Intubation + ventilation mécanique (séquence rapide, préoxygénation soignée).", ar: "تنبيب + تهوية ميكانيكية (تخدير سريع، أكسجة أولية جيدة)." },
      ]},
      { when: { fr: "Complication : hypotension / choc (PAS < 90)", ar: "مضاعفة: هبوط ضغط / صدمة (انقباضي < 90)" }, do: [
        { fr: "Arrêter les dérivés nitrés ; rechercher un SCA associé ; noradrénaline PSE ; cardiologue urgent.", ar: "أوقف النترات؛ ابحث عن متلازمة تاجية مصاحبة؛ نورأدرينالين بمضخة؛ استشارة قلبية عاجلة." },
      ]},
      { when: { fr: "Complication : bradycardie / troubles du rythme sous traitement", ar: "مضاعفة: بطء قلب / اضطراب نظم تحت العلاج" }, do: [
        { fr: "Vérifier K⁺ et Mg²⁺ (hypokaliémie → torsades) ; corriger ; atropine si bradycardie symptomatique.", ar: "تحقق من البوتاسيوم والمغنيزيوم (نقص ← تسارع مدفوع)؛ صحّح؛ أتروبين إذا بطء عرَضي." },
      ]},
    ],
    medications: ["trinitrine", "furosemide", "morphine"],
    calculators: [],
    meta: { sources: ["ESC insuffisance cardiaque aiguë 2021", "SFMU OAP"], lastReviewed: "2026-08" },
  },
  {
    id: "etat-mal-epileptique",
    title: { fr: "État de mal convulsif (tonico-clonique)", ar: "حالة الصرع المستمرة" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Convulsions prolongées : sécuriser, benzodiazépine précoce, antiépileptique de fond à 20–40 min.", ar: "تشنجات ممددة: أمّن، بنزوديازيبين مبكر، مضاد صرعي أساسي عند 20–40 د." },
    steps: [
      { title: { fr: "Protéger (décubitus latéral, dégagement), CHRONOMÉTRER la crise (>5 min = état de mal)", ar: "احمِ (استلقاء جانبي، إبعاد الأخطار) ووقّت النوبة (>5 د = حالة صرعية)" } },
      { title: { fr: "ABCDE + O2 ; glycémie capillaire (corriger hypoglycémie)", ar: "ABCDE + أكسجين + سكر شعري (صحّح النقص)" } },
      { title: { fr: "1ère ligne benzodiazépine : midazolam 10 mg IM (ou 0,2 mg/kg) / diazépam IV 5–10 mg lent / buccal", ar: "خط أول بنزوديازيبين: ميدازولام 10 ملغ عضلياً أو ديازيبام 5–10 ملغ وريد بطيء" }, detail: { fr: "Répéter UNE fois à 5–10 min si persistance.", ar: "تُعاد مرة واحدة بعد 5–10 د عند الاستمرار." } },
      { title: { fr: "2nde ligne (si persistance) : antiépileptique IV — milieu médicalisé. (Lévétiracétam 60 mg/kg ou valproate 40 mg/kg ou fosphénytoïne 20 mgPE/kg)", ar: "خط ثانٍ عند الاستمرار: مضاد صرع وريدي بوسط طبّي (ليفيتيراسيتام 60 ملغ/كغ أو فالبروات 40 أو فوسفينيتوين)" } },
      { title: { fr: "Toxique ? Éthylique ? Décompensation traitement ? Glycémie/iono/Hb/Tox ; TDM si 1ère crise", ar: "سموم؟ كحول؟ توقف علاج؟ فحوص؛ سكانر إن أول نوبة" } },
      { title: { fr: "Refractory : IOT + anesthésie (propofol/thiopental/midazolam PSE) + EEG", ar: "مقاومة: تنبيب + تخدير + تخطيط دماغ" } },
    ],
    keyPoints: [
      { fr: "Chaque minute compte : le but est d'arrêter la crise (excitotoxicité/neurones).", ar: "كل دقيقة مهمة: الهدف إيقاف النوبة (سمية تنبيهية للعصبونات)." },
      { fr: "Ne pas forcer l'introduction d'objet dans la bouche ; risque traumatique.", ar: "لا تُدخل أدوات في الفم — خطر رضّي." },
    ],
    trajectory: [
      { when: { fr: "Pas d'arrêt après 2 doses de benzodiazépine (< 15 min)", ar: "لا توقف النوبة بعد جرعتين من البنزوديازيبين (< 15 د)" }, do: [
        { fr: "2ᵉ ligne : fosphénytoïne 20 mg PE/kg (ou valproate 40 mg/kg ou lévétiracétam 60 mg/kg) IV lente + scope.", ar: "سطر ثانٍ: فوسفينيتوين 20 ملغ/كغ (أو فالبروات 40 ملغ/كغ أو ليفيتيراسيتام 60 ملغ/كغ) وريدياً ببطء + مراقبة." },
      ]},
      { when: { fr: "État de mal réfractaire (> 30 min)", ar: "حالة صرعية مقاومة (> 30 د)" }, do: [
        { fr: "Intubation + sédation profonde (thiopental/midazolam PSE) ; transfert réanimation ; EEG si possible.", ar: "تنبيب + تهدئة عميقة (ثيوبنتال/ميدازولام بمضخة)؛ تحويل للإنعاش؛ تخطيط دماغ إن أمكن." },
      ]},
      { when: { fr: "Complication : dépression respiratoire après benzos", ar: "مضاعفة: كبت تنفسي بعد البنزوديازيبينات" }, do: [
        { fr: "Ventilation au masque + O₂ ; préparer l'intubation ; antidotes NON systématiques (contexte uniquement).", ar: "تهوية بالقناع + أكسجين؛ جهّز التنبيب؛ الترياقات ليست تلقائية (فقط حسب السياق)." },
      ]},
      { when: { fr: "Complications : hyperthermie, rhabdomyolyse", ar: "مضاعفات: حرارة، تحلل عضلي" }, do: [
        { fr: "Refroidissement actif + NaCl 0,9 % 1–1,5 L/h (diurèse) ; contrôler CPK, créat, glycémie.", ar: "تبريد نشط + ملح 0.9% بمعدل 1–1.5 ل/س (تحبور)؛ راقب CPK والكرياتينين والسكر." },
      ]},
    ],
    medications: ["midazolam", "diazepam", "glucose30"],
    calculators: ["dose-poids"],
    meta: { sources: ["ILAE état de mal 2020", "SRLF convulsions aiguës"], lastReviewed: "2026-08" },
  },
  {
    id: "asthme-aigu-grave",
    title: { fr: "Crise d'asthme aigu grave", ar: "نوبة ربو حادة شديدة" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "Crise d'asthme menaçante : bronchodilatateurs répétés, corticoïdes précoces, signes d'épuisement.", ar: "نوبة ربو خطيرة: موسعات متكررة، كورتيكويد مبكر، علامات الإنهاك." },
    steps: [
      { title: { fr: "Évaluer la gravité : parole, FR, FC, SpO2, conscience, silencieux clinique ?", ar: "قيّم الشدة: الكلام، التنفس، النبض، التشبع، الوعي، صدر صامت؟" } },
      { title: { fr: "O2 pour SpO2 93–95 % ; postures (assis)", ar: "أكسجين لتشبع 93–95%؛ إجلاس" } },
      { title: { fr: "Salbutamol 5 mg nébuleux (ou MDI+chambre 4–8 bouffées) + ipratropium 0,5 mg q20 min ×3", ar: "سالبوتامول 5 ملغ رذاذ (أو بخاخ 4–8 بخات) + إبراتروبيوم 0.5 ملغ كل 20 د ×3" } },
      { title: { fr: "Corticothérapie précoce : prednisolone 40–50 mg PO ou hydrocortisone 200 mg IV", ar: "كورتيكويد مبكراً: بريدنيزولون 40–50 ملغ فموياً أو هيدروكورتيزون 200 ملغ وريد" } },
      { title: { fr: "Si très grave : MgSO4 2 g IV sur 20 min ; réévaluer à 1 h ; critères de gravité", ar: "إن شديدة جداً: كبريتات مغنيزيوم 2 غ على 20 د؛ أعد التقييم بعد ساعة" } },
      { title: { fr: "Signes de danger de mort : FR >25, FC >110, SpO2 <92, épuisement, confusion, paralysie respiratoire → réa/assistance ventilatoire", ar: "علامات خطر محدق: FR>25، FC>110، تشبع<92، إرهاق، تشوش، وهن تنفسي ← إنعاش" } },
    ],
    keyPoints: [
      { fr: "Ne PAS retarder la corticothérapie ; l'ipratropium se cumule au début.", ar: "لا تؤخر الكورتيكويد؛ إبراتروبيوم يُضاف باكراً." },
      { fr: "Silence auscultatoire = très mauvais signe (pas d'air ne passe).", ar: "الصمت الإصغائي علامة سيئة جداً (لا هواء يمرّ)." },
    ],
    trajectory: [
      { when: { fr: "Aggravation : épuisement, silence auscultatoire, SpO₂ < 90 %, bradycardie, GCS ↓", ar: "تدهور: إنهاك، صمت سمعي، تشبع < 90%، بطء قلب، هبوط غلاسكو" }, do: [
        { fr: "Intubation-ventilation en urgence (préoxygénation, kétamine) ; attention à l'expiration longue (barotraumatisme).", ar: "تنبيب وتهوية عاجلة (أكسجة أولية، كيتامين)؛ حذار الزفير الطويل (رضح ضغطي)." },
      ]},
      { when: { fr: "Réponse partielle à 20–30 min", ar: "استجابة جزئية خلال 20–30 د" }, do: [
        { fr: "Répéter salbutamol continu ± ipratropium ; MgSO₄ 2 g IV / 20 min si forme grave ; corticoïdes IV/PO.", ar: "كرر سالبوتامول متواصلاً ± إيبراتروبيوم؛ مغنيزيوم 2 غ وريدياً / 20 د في الشكل الشديد؛ كورتيكويدات وريدياً/فموية." },
      ]},
      { when: { fr: "Amélioration franche", ar: "تحسّن واضح" }, do: [
        { fr: "Poursuivre β2 horaire puis espacer ; corticoïdes oraux ; NE PAS sortir avant 1 h après la dernière dose.", ar: "واصل β2 كل ساعة ثم تباعد؛ كورتيكويدات فموية؛ لا خروج قبل ساعة من آخر جرعة." },
      ]},
      { when: { fr: "Complication : pneumothorax (déviation, douleur brutale, SpO₂ ↓)", ar: "مضاعفة: استرواح (انحراف، ألم مفاجئ، هبوط تشبع)" }, do: [
        { fr: "Exsufflation/drainage en urgence si suffocant ; réduire le débit de ventilation si ventilé.", ar: "شفط/تصريف عاجل إذا خانق؛ قلّل حجم التهوية إن كان على منفسة." },
      ]},
    ],
    medications: ["salbutamol", "hydrocortisone", "sulfate-magnesium"],
    calculators: [],
    meta: { sources: ["GINA 2024", "BTS/SIGN 2024"], lastReviewed: "2026-08" },
  },
  {
    id: "choc-septique",
    title: { fr: "Sepsis sévère / Choc septique", ar: "إنتان شديد / صدمة إنتانية" },
    category: "reanimation",
    severity: "critical",
    summary: { fr: "Sepsis avec défaillance d'organe : cultures, antibiotiques < 1 h, remplissage et noradrénaline.", ar: "إنتان مع قصور عضوي: مزارع، مضادات <ساعة، تعويض ونورأدرينالين." },
    steps: [
      { title: { fr: "Dépistage : infection suspectée + hypotension/tachycardie/hypoperfusion (marbrures, confusion, oligurie)", ar: "اشتباه عدوى + انخفاض ضغط/تسرع/نقص تروية (تبرقش، تشوش، قلة بول)" } },
      { title: { fr: "Lactate artériel/veineux capillaire + cultures AVANT antibiotiques (ne retardent pas)", ar: "لاكتات + مزارع قبل المضادات (دون تأخير)" } },
      { title: { fr: "ANTIBIOTHÉRAPIE LARGE <1 h (probabilité selon porte d'entrée locale)", ar: "مضاد حيوي واسع خلال <ساعة حسب البوابة" } },
      { title: { fr: "Remplissage : 30 mL/kg de cristalloïdes rapides (réévaluer de près, surtout cardiaque/IRC)", ar: "توسيع: 30 مل/كغ بلّوريات سريعة مع تقييم دقيق (خاصة القلبي/الكلوي)" } },
      { title: { fr: "Noradrénaline PSE si PAM <65 persistante (titrée à PAM 65)", ar: "نورأدرنالين مضخة إن بقي متوسط الضغط <65 (عايِر إلى 65)" } },
      { title: { fr: "Contrôle de la source (drainage, chirurgie) dès que possible ; O2/ventilation selon besoin", ar: "ضبط المصدر (تصريف/جراحة) مبكراً؛ أكسجين/تهوية حسب الحاجة" } },
      { title: { fr: "Hydrocortisone 200 mg/j si choc septique réfractaire aux amines", ar: "هيدروكورتيزون 200 ملغ/ي عند صدمة مقاومة للأمينات" } },
    ],
    keyPoints: [
      { fr: "Lactate ≥2 mmol/L + hypotension = alerte rouge (mortalité élevée).", ar: "لاكتات ≥2 + انخفاض ضغط = إنذار أحمر." },
      { fr: "La 1ère heure (« golden hour ») = antibiotiques + remplissage + source control.", ar: "الساعة الذهبية = مضاد حيوي + توسيع + ضبط مصدر." },
    ],
    trajectory: [
      { when: { fr: "PAS < 65 malgré noradrénaline ≥ 0,5–1 µg/kg/min", ar: "انقباضي < 65 رغم نورأدرينالين ≥ 0.5–1 ميكروغ/كغ/د" }, do: [
        { fr: "Réévaluer le remplissage (échographie) ; hydrocortisone 200 mg/24 h ; ajouter adrénaline/vasopressine ; réanimation.", ar: "أعد تقييم التعويض (تخطيط صدري)؛ هيدروكورتيزون 200 ملغ/24 س؛ أضف أدرينالين/فازوبريسين؛ إنعاش." },
      ]},
      { when: { fr: "Lactates non clairants / oligurie à H2–H4", ar: "لاكتات غير مرتدة / قلة بول بين الساعتين والرابعة" }, do: [
        { fr: "Optimiser (vol, débit, O₂) ; imagerie du foyer + drainage/chirurgie si collection ; contrôle lactates itératif.", ar: "حسّن (حجم، تدفق، أكسجين)؛ صور البؤرة + تصريف/جراحة إن وُجد تجمع؛ مراقبة اللاكتات المتكررة." },
      ]},
      { when: { fr: "Complication : OAP / SDRA après remplissage", ar: "مضاعفة: وذمة رئة / SDRA بعد التعويض" }, do: [
        { fr: "Arrêter les bolus ; VNI ou ventilation mécanique ; diurétique si rein fonctionnel ; positionnement.", ar: "أوقف الدفعات؛ VNI أو تهوية ميكانيكية؛ مدرّ إن الكلى عاملة؛ ضبط الوضعية." },
      ]},
      { when: { fr: "Drainage du foyer impossible sur place", ar: "تعذّر تصريف البؤرة في المكان" }, do: [
        { fr: "Transmission au régulateur : orienter vers un centre avec chirurgie/radiologie interventionnelle ; documenter l'antibiothérapie H0.", ar: "أبلغ المنظّم: وجّه نحو مركز فيه جراحة/رسم تداخلي؛ وثّق المضاد الحيوي عند الساعة صفر." },
      ]},
    ],
    medications: ["noradrenaline", "hydrocortisone"],
    calculators: [],
    meta: { sources: ["Surviving Sepsis Campaign 2021", "ERC 2021"], lastReviewed: "2026-08" },
  },
  {
    id: "acidocetose-diabetique",
    title: { fr: "Acidocétose diabétique (ACD)", ar: "الحماض الكيتوني السكري" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "ACD : remplissage massif, insuline IV progressive, potassium surveillé heure par heure.", ar: "الحماض الكيتوني: توسيع حجمي، إنسولين وريدي متدرج، بوتاسيوم مراقب." },
    steps: [
      { title: { fr: "Diagnostic : glycémie >2,5 g/L (ou diabétique connu) + pH <7,3 + cétones", ar: "تشخيص: سكر >2.5 غ/ل + pH<7.3 + كيتونات" } },
      { title: { fr: "Remplissage NaCl 0,9 % : 1 L 1ère heure (adapter âge/cardiaque)", ar: "توسيع بمصل ملحي: 1 لتر في الساعة الأولى (كيّف حسب العمر/القلب)" } },
      { title: { fr: "K+ AVANT insuline : si <3,3 mmol/L → corriger K d'abord ; sinon PSE insuline rapide 0,1 UI/kg/h (pédiatrie 0,05–0,1)", ar: "قِس K قبل الأنسولين: إن <3.3 صحّحه أولاً؛ وإلا مضخة 0.1 وحدة/كغ/س (أطفال 0.05–0.1)" } },
      { title: { fr: "Baisse glycémique cible 0,5–1 g/L/h (~3 mmol/L/h)", ar: "هدف هبوط السكر 0.5–1 غ/ل/س" } },
      { title: { fr: "Quand glycémie <2,5 g/L : ajouter G5 % pour poursuivre l'insuline jusqu'à fermeture du trou anionique", ar: "عند سكر <2.5: أضف G5% وواصل الأنسولين حتى تصحيح الحماض" } },
      { title: { fr: "Surveiller K+ toutes les 1–2 h ; bicarbonate seulement si pH très bas + menace (expert)", ar: "راقب K كل 1–2 س؛ بيكربونات فقط عند pH بالغ الانخفاض (خبير)" } },
      { title: { fr: "Chercher la cause : infection, oubli d'insuline, début, médicaments (corticoïdes...)", ar: "ابحث عن السبب: عدوى، نسيان أنسولين، بدء جديد، أدوية" } },
    ],
    keyPoints: [
      { fr: "L'insuline sans potassium peut précipiter un trouble du rythme — K d'abord.", ar: "أنسولين دون بوتاسيوم قد يسبب اضطراب نظم — البوتاسيوم أولاً." },
      { fr: "Éviter la baisse glycémique trop rapide chez l'enfant (risque d'œdème cérébral).", ar: "تجنّب هبوط السكر السريع عند الطفل (خطر وذمة دماغية)." },
    ],
    trajectory: [
      { when: { fr: "K⁺ < 3,3 mmol/L (à l'entrée ou sous insuline)", ar: "بوتاسيوم < 3.3 (عند الدخول أو تحت الأنسولين)" }, do: [
        { fr: "SUSPENDRE l'insuline ; KCl 20–40 mmol/h sous scope ECG ; reprendre l'insuline dès K⁺ ≥ 3,3.", ar: "أوقف الأنسولين؛ كلوريد البوتاسيوم 20–40 ميلي مكافئ/س تحت مراقبة؛ استأنف الأنسولين فور ≥ 3.3." },
      ]},
      { when: { fr: "Glycémie < 2,5 g/L (14 mmol/L) sous insuline", ar: "سكر < 2.5 غ/ل تحت الأنسولين" }, do: [
        { fr: "Basculer sur G5 % + POURSUIVRE l'insuline (les cétones comptent, pas la glycémie) ; reserrer la surveillance.", ar: "بدّل إلى غلوكوز 5% + واصل الأنسولين (الكيتونات هي المعيار لا السكر)؛ زد المراقبة." },
      ]},
      { when: { fr: "Aggravation neurologique (céphalées intenses, GCS ↓)", ar: "تدهور عصبي (صداع شديد، هبوط غلاسكو)" }, do: [
        { fr: "Suspecter un œdème cérébral : mannitol 0,5–1 g/kg ou NaCl hypertonique ; TDM urgente.", ar: "اشتبه بوذمة دماغ: مانيتول 0.5–1 غ/كغ أو ملح مفرط التوتر؛ صورة عاجلة." },
      ]},
      { when: { fr: "Résolution (pH > 7,3, HCO₃⁻ > 15, cétose −)", ar: "الشفاء (pH > 7.3، بيكاربونات > 15، لا كيتونات)" }, do: [
        { fr: "Relais sous-cutané AVANT l'arrêt de l'IV (chevauchement 1–2 h) ; realimentation ; recherche du facteur déclenchant.", ar: "التبديل تحت الجلد قبل إيقاف الوريد (تداخل 1–2 س)؛ إطعام؛ ابحث عن العامل المحرّض." },
      ]},
    ],
    medications: ["insuline-rapide"],
    calculators: [],
    meta: { sources: ["ADA/EASD consensus DKA 2024", "BSPED pédia"], lastReviewed: "2026-08" },
  },
  {
    id: "hyperkaliemie",
    title: { fr: "Hyperkaliémie sévère", ar: "فرط بوتاسيوم الدم الشديد" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "K+ élevé menaçant : calcium cardioprotecteur d'abord, puis déplacement et élimination.", ar: "بوتاسيوم خطير: كالسيوم واقٍ أولاً، ثم إدخال خلوي وإخراج." },
    steps: [
      { title: { fr: "ECG en urgence (signes : T pointues, QRS élargi, ondes P effacées, ralentissement…)", ar: "تخطيط مستعجل (T مبرقعة، QRS متسع، P محوّلة، تباطؤ)" } },
      { title: { fr: "CARDIOPROTECTION immédiate : gluconate de calcium 10 % 10–30 mL IV lent sur 2–5 min (scope ; répéter si persistance ECG)", ar: "حماية قلبية فورية: غلوكونات كالسيوم 10% 10–30 مل على 2–5 د مع مراقبة" } },
      { title: { fr: "Déplacement intracellulaire : insuline rapide 10 UI + 25 g glucose IV (glycémie horaire ×6)", ar: "إدخال K للخلية: أنسولين 10 وحدات + 25 غ غلوكوز وريد (سكر كل ساعة ×6)" } },
      { title: { fr: "± salbutamol 10–20 mg nébulisé ; NaHCO3 1–2 mmol/kg si acidose associée", ar: "± سالبوتامول 10–20 ملغ رذاذ؛ بيكربونات إن حماض مرافق" } },
      { title: { fr: "ÉLIMINER : furosémide si fonction rénale conservée ; antirésines/kayexalate ? ; DIALYSE si choc/IRC/RSV", ar: "أخرجه: فوروسيميد إن كلى سليمة؛ غسيل كلى عند الصدمة/القصور" } },
      { title: { fr: "Arrêter les facteurs (IEC/ARA2, épargneurs K, AINS) ; réévaluer iono 1–2 h", ar: "أوقف المسببات وحوّل؛ أعد الأيونوغرام خلال 1–2 س" } },
    ],
    keyPoints: [
      { fr: "Le calcium stabilise le cœur en minutes mais ne baisse PAS le potassium — toujours associer les mesures de déplacement intracellulaire.", ar: "الكالسيوم يثبّت القلب خلال دقائق لكنه لا يخفض البوتاسيوم — اجمعه دائماً بإجراءات الإدخال الخلوي." },
      { fr: "Insuline sans glucose = hypoglycémie sévère : toujours la mesurer.", ar: "أنسولين بلا غلوكوز = نقص سكر شديد: قِسه دائماً." },
    ],
    trajectory: [
      { when: { fr: "Anomalies ECG persistantes 15–30 min après le calcium", ar: "بقاء شذوذ التخطيط 15–30 د بعد الكالسيوم" }, do: [
        { fr: "Redoser/renforcer : 2ᵉ injection de calcium, insuline-glucose à débit majoré, bicarbonate si acidose.", ar: "أعد التقييم/عزّز: صعقة كالسيوم ثانية، أنسولين-غلوكوز بجريان أعلى، بيكاربونات إذا حماض." },
      ]},
      { when: { fr: "Bradycardie extrême / QRS massivement élargi", ar: "بطء قلب شديد / اتساع هائل لمركّب QRS" }, do: [
        { fr: "Préparer le DSA ; atropine ; entraînement électrosystolique transcutané si disponible.", ar: "جهّز مزيل الرجفان؛ أتروبين؛ تنظيم كهربائي عبر الجلد إن توفر." },
      ]},
      { when: { fr: "K⁺ > 6,5 avec insuffisance rénale / anurie", ar: "بوتاسيوم > 6.5 مع قصور كلوي / انقطاع بول" }, do: [
        { fr: "Dialyse en URGENCE : organiser le transfert (régulation 190) ; poursuivre les traitements de pontage en attendant.", ar: "غسيل عاجل: نظّم النقل (تنظيم 190)؛ واصل العلاجات الجسرية في الانتظار." },
      ]},
      { when: { fr: "Diurèse efficace", ar: "تحبور فعّال" }, do: [
        { fr: "Poursuivre diurétique + résines ; contrôle K⁺ à H2 puis H6 ; traiter la cause (AINS, IEC, acidose…).", ar: "واصل المدرّ + الراتنجات؛ رقابة البوتاسيوم عند الساعتين ثم السادسة؛ عالج السبب." },
      ]},
    ],
    medications: ["gluconate-calcium", "insuline-rapide", "salbutamol", "bicarbonate", "furosemide"],
    calculators: [],
    meta: { sources: ["AHA 2023", "KDIGO/US guidelines hyperK"], lastReviewed: "2026-08" },
  },
  {
    id: "eclampsie",
    title: { fr: "Éclampsie / Pré-éclampsie sévère", ar: "الارتعاج / ما قبل الارتعاج الشديد" },
    category: "obstetrique",
    severity: "critical",
    summary: { fr: "HTA gravidique sévère ± convulsions : magnésium sulfate, antihypertenseur, extraction non retardée.", ar: "ارتفاع ضغط حملي ± تشنجات: كبريتات مغنيزيوم، خافض ضغط، ولادة غير مؤجلة." },
    steps: [
      { title: { fr: "Sécuriser : décubitus latéral GAUCHE, rails, appel SAMU/maternité ; ABCDE + O2", ar: "أمّن: استلقاء جانبي أيسر، وسادات، نداء؛ ABCDE + أكسجين" } },
      { title: { fr: "SULFATE DE MAGNÉSIUM : 4 g IV sur 5–15 min puis 1 g/h PSE — 1ère ligne", ar: "كبريتات المغنيزيوم: 4 غ وريد على 5–15 د ثم 1 غ/س — الخط الأول" } },
      { title: { fr: "TA ≥160/110 persistante : labétalol, nicardipine ou urapidil IV selon protocole local", ar: "ضغط ≥160/110 مستمر: لابيتالول أو نيكارديبين أو أورابيديل وريد حسب البروتوكول المحلي" } },
      { title: { fr: "Bilan : plaquettes, hémolyse (LDH), hépatique, créatinine, protéinurie ; MONITO fœtal si possible", ar: "فحوص: صفيحات، انحلال، كبد، كرياتينين، بيلة بروتينية؛ مراقبة جنينية إن أمكن" } },
      { title: { fr: "Surveiller toxicité Mg : FR ≥16/min, réflexes présents, diurèse ≥25 mL/h ; antidote : gluconate de calcium 1 g IV", ar: "راقب سمية المغنيزيوم: تنفس ≥16/د، منعكسات، بيلة ≥25 مل/س؛ الترياق: كالسيوم" } },
      { title: { fr: "Évaluation pour l'accouchement (seul traitement radical) — décision médicale obstétricale", ar: "قيّم التوليد (العلاج الجذري الوحيد) — قرار طب التوليد" } },
      { title: { fr: "AVERTIR : récidive possible 24–48 h post-partum → poursuivre MgSO4 24 h", ar: "انتبه: يتكرر خلال 24–48 س بعد الولادة — واصل Mg 24 س" } },
    ],
    keyPoints: [
      { fr: "Le diazépam/midazolam calme la crise mais MgSO4 prévient et traite la récidive (evidence).", ar: "البنزوديازيبين يهدّئ النوبة لكن MgSO4 يمنع التكرار (دليل قوي)." },
      { fr: "Jamais de bolus Mg rapide — arrêt respiratoire. PSE précise impérative.", ar: "لا دفعة مغنيزيوم سريعة — خطر توقف تنفسي. مضخة دقيقة إلزاماً." },
    ],
    trajectory: [
      { when: { fr: "Récidive de convulsions malgré MgSO₄", ar: "رجوع التشنجات رغم المغنيزيوم" }, do: [
        { fr: "2ᵉ bolus de 2 g (max 4 g en plus) ou diazépam ; intubation si coma persistant ; réévaluer la voie d'abord.", ar: "دفعة ثانية 2 غ (الحد 4 غ إضافية) أو ديازيبام؛ تنبيب إذا غيبوبة مستمرة." },
      ]},
      { when: { fr: "PAS ≥ 160 malgré MgSO₄", ar: "انقباضي ≥ 160 رغم المغنيزيوم" }, do: [
        { fr: "Nicardipine PSE 5–15 mg/h (ou labétalol) ; NE JAMAIS faire chuter brutalement la PA (placenta).", ar: "نيكارديبين بمضخة 5–15 ملغ/س (أو لابيتالول)؛ لا تُهبط الضغط فجأة أبداً (المشيمة)." },
      ]},
      { when: { fr: "HELLP / hématome rétro-placentaire / bradycardie fœtale", ar: "HELLP / انفصال مشيمة / بطء قلب الجنين" }, do: [
        { fr: "Extraction en urgence (équipe obstétricale) ; bilan coagulation + groupe ; 2 VVP ; équipe pédiatrique prête.", ar: "استخراج عاجل (فريق توليد)؛ تحاليل تخثر + زمرة؛ خطان وريديان؛ فريق أطفال جاهز." },
      ]},
      { when: { fr: "Surveillance post-partum (< 48 h)", ar: "مراقبة ما بعد الولادة (< 48 س)" }, do: [
        { fr: "Poursuivre MgSO₄ 24 h : diurèse, réflexes rotuliens, FR ≥ 12/min ; gluconate de calcium prêt en antidote.", ar: "واصل المغنيزيوم 24 س: تحبور، منعكس الرضفة، تنفس ≥ 12/د؛ غلوكونات الكالسيوم جاهزة كترياق." },
      ]},
    ],
    medications: ["sulfate-magnesium", "gluconate-calcium"],
    calculators: [],
    meta: { sources: ["ISSHP pré-éclampsie 2021", "FIGO", "OMS"], lastReviewed: "2026-08" },
  },
];

// v8.3 — Phase 11 : compléments toxico (opioïdes, sevrage alcoolique/DT, digoxine, lithium,
// salicylés) + digestif chirurgical (pancréatite, appendicite, angiocholite, occlusion)
// + traumatisme médullaire. Sources : Goldfrank's, Tokyo Guidelines 2018, WSES, AANS/CNS.
import type { Protocol } from "./types";

export const protocolsPhase11: Protocol[] = [
  {
    id: "intoxication-opioides",
    title: { fr: "Intoxication aux opioïdes", ar: "تسمم بالمواد الأفيونية" },
    category: "toxicologie",
    severity: "critical",
    summary: { fr: "Triade coma + dépression respiratoire + myosis. VENTILER d'abord, naloxone TITRÉE jusqu'à FR ≥ 12 (pas le réveil complet). Méthadone/tramadol : risque de rebond, surveillance prolongée.", ar: "ثلاثية غيبوبة + كبت تنفسي + تقبض حدقة. أَوْجِه التنفس أولاً، نالوكسون معَايَر حتى تنفس ≥ 12 (لا إفاقة كاملة). ميثادون/ترامادول: خطر ارتداد، مراقبة مطولة." },
    exams: {
      bio: [{ fr: "GLYCÉMIE capillaire immédiate (éliminer l'hypoglycémie !), gazométrie, ionogramme, paracétamolémie systématique (co-ingestion), ECG (méthadone : QT)", ar: "سكر شعري فوري (استبعد نقص السكر!)، غازات، شوارد، مستوى باراسيتامول منهجي (ابتلاع مشترك)، تخطيط (ميثادون: QT)" }],
      img: [{ fr: "Radio thorax si désaturation (œdème lésionnel post-naloxone, pneumopathie d'inhalation)", ar: "صورة صدر عند نقص الإشباع (وذمة بعد النالوكسون، استنشاق)" }],
    },
    steps: [
      { title: { fr: "A-B-C : la VENTILATION au masque (BVM) est le traitement qui sauve — la naloxone ne remplace pas la ventilation si elle n'est pas disponible immédiatement", ar: "‏A-B-C: التهوية بالقناع هي العلاج المنقذ — النالوكسون لا يعوض التهوية إذا لم يتوفر فوراً" } },
      { title: { fr: "NALOXONE TITRÉE : 0,04-0,4 mg IV toutes les 2-3 min jusqu'à FR ≥ 12/min et ventilation efficace — objectif RESPIRATION, pas conscience (l'éveil brutal précipite un sevrage violent : agitation, vomissements, inhalation)", ar: "نالوكسون معاير: 0.04-0.4 ملغ وريدي كل 2-3 د حتى تنفس ≥ 12/د وتهوية فعالة — الهدف التنفس لا الوعي (الإفاقة المفاجئة تفجر انسحاباً عنيفاً: هياج، تقيؤ، استنشاق)" } },
      { title: { fr: "Pas de voie IV : IM/IN/SC 0,4-2 mg — délai d'action plus long", ar: "دون وريد: عضلي/أنفي/تحت الجلد 0.4-2 ملغ — بدء أبطأ" } },
      { title: { fr: "Piège du myosis : tramadol et péthidine peuvent donner des pupilles normales/mydriatiques ; l'absence de myosis n'exclut PAS le diagnostic", ar: "فخ التقبض: الترامادول والبيتيدين قد يعطيان حدقتين طبيعيتين/متسعتين؛ غياب التقبض لا يستبعد التشخيص" } },
      { title: { fr: "Effet tunnel : chercher TOUJOURS les co-intoxications (paracétamol !) et les autres causes de coma — hypoglycémie, trauma crânien (mydriase unilatérale ≠ opioïdes), hypothermie", ar: "النفق: ابحث دائماً عن تسممات مرافقة (باراسيتامول!) وأسباب غيبوبة أخرى — نقص سكر، رض رأس (توسع وحيد الجانب ≠ أفيون)، انخفاض حرارة" } },
      { title: { fr: "TRAMADOL (premier opioïde abusé en Tunisie) : risque CONVULSIF propre (abaisse le seuil épileptogène) — benzodiazépines si crise ; ne pas confondre convulsion et sevrage", ar: "الترامادول (أكثر أفيوني يُساء استعماله بتونس): خطر اختلاجي خاص (يخفض العتبة) — بنزوديازيبين عند النوبة؛ لا تخلط النوبة بالانسحاب" } },
      { title: { fr: "Durée de surveillance selon le produit : héroïne/morphine 4-6 h ; TRAMADOL 6-12 h ; MÉTHADONE 24 h minimum (demi-vie 24-36 h, rebond quasi certain) ; BUPRÉNOPHINE : forte résistance à la naloxone — ventilation prolongée plutôt que naloxone à hautes doses", ar: "مدة المراقبة حسب المادة: هيروين/مورفين 4-6 س؛ ترامادول 6-12 س؛ ميثادون 24 س على الأقل (عمر نصفي 24-36 س، ارتداد شبه مؤكد)؛ بيبرينورفين: مقاومة عالية للنالوكسون — تهوية مطولة بدل جرع عالية" } },
      { title: { fr: "Besoin de naloxone répétée = perfusion continue (2/3 de la dose de réveil efficace par heure) en unité surveillée", ar: "حاجة لنالوكسون متكرر = تسريب مستمر (ثلثا جرعة الإفاقة الفعالة كل ساعة) بوحدة مراقبة" } },
      { title: { fr: "Œdème pulmonaire post-naloxone : rare mais décrit après bolus massifs — SpO₂, radio, traitement symptomatique", ar: "وذمة رئة بعد النالوكسون: نادرة لكنها موصوفة بعد الدفعات الكبيرة — إشباع، صورة، علاج عرضي" } },
    ],
    keyPoints: [
      { fr: "La mort par opioïdes est une mort par HYPOXIE — celui qui ventile sauve, celui qui cherche la naloxone sans ventiler perd le patient.", ar: "الموت بالأفيون موت بنقص الأكسجة — من يهوّي ينقذ، ومن يبحث عن النالوكسون دون تهوية يخسر المريض." },
      { fr: "Toute intoxication volontaire = évaluation psychiatrique et risque suicidaire AVANT la sortie ; toute sortie d'un usager = discussion de naloxone à domicile (kit disponible) et orientation addictologie.", ar: "كل تسمم عمد = تقييم نفسي وخطر انتحار قبل الخروج؛ وكل خروج لمدمن = نقاش نالوكسون منزلي وتوجيه لعلاج الإدمان." },
      { fr: "Le patient en sevrage aigu précipité peut quitter le service contre avis médical — l'information claire sur le risque de rebond (surtout méthadone) est médico-légalement capitale.", ar: "المريض بانسحاب حاد مستحث قد يغادر ضد النصيحة — التوضيح حول خطر الارتداد (خصوصاً ميثادون) حاسم طبياً وقانونياً." },
    ],
    trajectory: [
      { when: { fr: "Réponse complète à la naloxone, surveillance 4-6 h sans rebond", ar: "استجابة كاملة للنالوكسون، مراقبة 4-6 س بلا ارتداد" }, do: [
        { fr: "Sortie possible avec accompagnant fiable, consignes écrites, naloxone à domicile, rendez-vous addictologie.", ar: "خروج ممكن مع مرافق موثوق، تعليمات مكتوبة، نالوكسون منزلي، موعد علاج إدمان." },
      ]},
      { when: { fr: "Re-sédation après réponse initiale (méthadone, formes LP)", ar: "تخدير مجدداً بعد استجابة أولية (ميثادون، مديد المفعول)" }, do: [
        { fr: "Perfusion de naloxone + hospitalisation 24 h minimum — ne JAMAIS faire sortir après un rebond.", ar: "تسريب نالوكسون + إدخال 24 س على الأقل — لا إخراج أبداً بعد الارتداد." },
      ]},
      { when: { fr: "Pas de réponse à 10 mg de naloxone cumulée", ar: "لا استجابة بعد 10 ملغ نالوكسون مجمعة" }, do: [
        { fr: "Le diagnostic n'est pas (que) opioïde : coma mixte, hypoxie-ischémique, lésion cérébrale — TDM, réévaluation complète.", ar: "التشخيص ليس (فقط) أفيونياً: غيبوبة مختلطة، نقص أكسجة-إقفار، إصابة دماغية — طبقي، إعادة تقييم شاملة." },
      ]},
    ],
    medications: ["naloxone", "midazolam", "diazepam"],
    calculators: ["opioides", "gcs", "qtc"],
    meta: { sources: ["Goldfrank's Toxicologic Emergencies", "SAMU"], lastReviewed: "2026-09" },
  },
  {
    id: "sevrage-alcoolique",
    title: { fr: "Sevrage alcoolique & delirium tremens", ar: "الانسحاب الكحولي والهذيان الارتعاشي" },
    category: "psychiatrie",
    severity: "critical",
    summary: { fr: "Chronologie : tremblements 6-12 h, crises 12-48 h, DT 48-96 h (mortalité 5-15 %). Benzodiazépines à la demande (CIWA-Ar), THIAMINE avant tout glucose, corriger K⁺/Mg²⁺. DT = réanimation.", ar: "التسلسل: رعاش 6-12 س، نوبات 12-48 س، هذيان ارتعاشي 48-96 س (وفيات 5-15%). بنزوديازيبين عند الطلب (CIWA-Ar)، ثيامين قبل أي غلوكوز، صحح البوتاسيوم/المغنزيوم. الهذيان = إنعاش." },
    exams: {
      bio: [{ fr: "Glycémie, ionogramme (K⁺, Mg²⁺, phosphore), NFS (VGM, thrombopénie), bilan hépatique, gazométrie, ECG (QT, hypokaliémie)", ar: "سكر، شوارد (بوتاسيوم، مغنزيوم، فوسفور)، عد دم (‏VGM، صفيحات)، وظائف كبد، غازات، تخطيط (QT، نقص بوتاسيوم)" }],
      img: [{ fr: "Selon contexte : TDM cérébrale si trauma/chute/premier épisode (hématome sous-dural fréquent chez l'alcoolique)", ar: "حسب السياق: طبقي دماغي عند رض/سقوط/أول نوبة (ورم دموي تحت الجافية شائع عند الكحولي)" }],
    },
    steps: [
      { title: { fr: "Évaluer avec le score CIWA-Ar (calculatrice) : < 8 traitement de support ; 8-15 pharmacothérapie ; ≥ 15 risque de DT — traitement agressif", ar: "قيّم بسكور CIWA-Ar (الحاسبة): < 8 دعم؛ 8-15 علاج دوائي؛ ≥ 15 خطر هذيان — علاج مكثف" } },
      { title: { fr: "BENZODIAZÉPINES en première ligne — diazépam 10 mg IV/PO toutes les 5-10 min jusqu'à sédation légère (symptom-triggered loading), puis à la demande selon CIWA ; foie cirrhotique : lorazépam ou oxazépam (métabolisme non hépatique)", ar: "بنزوديازيبين بالخط الأول — ديازيبام 10 ملغ وريدي/فموي كل 5-10 د حتى تهدئة خفيفة (تحميل حسب الأعراض)، ثم عند الطلب حسب CIWA؛ كبد متليف: لورازيبام أو أوكسازيبام (استقلاب غير كبدي)" } },
      { title: { fr: "THIAMINE (vitamine B1) 500 mg IV × 3/j pendant 2-3 jours PUIS 250 mg/j — AVANT ou avec tout apport de glucose ; le glucose seul peut précipiter un Wernicke chez le carencé", ar: "ثيامين (فيتامين B1) ‏500 ملغ وريدي × 3/ي لمدة 2-3 أيام ثم 250 ملغ/ي — قبل أو مع أي غلوكوز؛ الغلوكوز وحده قد يفجر فرنكه عند ناقص المخزون" } },
      { title: { fr: "Encéphalopathie de WERNICKE : triade confusion + troubles oculomoteurs + ataxie — complète dans 1/3 des cas seulement ! Tout alcoolisé confus = Wernicke jusqu'à preuve du contraire = thiamine IV immédiate", ar: "اعتلال فرنكه: ثلاثية تخليط + اضطراب حركة العين + ترنح — مكتملة بثلث الحالات فقط! كل كحولي متخليط = فرنكه حتى يثبت العكس = ثيامين وريدي فوري" } },
      { title: { fr: "Corriger K⁺, Mg²⁺ (l'hypomagnésémie rend toute correction réfractaire et favorise les crises), phosphore", ar: "صحح البوتاسيوم والمغنزيوم (نقص المغنزيوم يجعل كل تصحيح مقاوماً ويحرض النوبات) والفوسفور" } },
      { title: { fr: "CRISES de sevrage (12-48 h, généralisées, 1-2 épisodes) : benzodiazépines IV — la phénytoïne est INEFFICACE dans les crises de sevrage, ne pas l'utiliser", ar: "نوبات الانسحاب (12-48 س، معممة، 1-2): بنزوديازيبين وريدي — الفينيتوئين غير فعال بانسحاب الكحول، لا تستخدمه" } },
      { title: { fr: "DELIRIUM TREMENS (48-96 h) : confusion fluctuante + hallucinations + dysautonomie (fièvre, tachycardie, hypertension, sueurs) = RÉANIMATION : benzos à haute dose IV (diazépam 10-20 mg/15 min jusqu'à calme), réhydratation, refroidissement, contention douce en décubitus latéral (aspiration !)", ar: "الهذيان الارتعاشي (48-96 س): تخليط متقلب + هلاوس + خلل ذاتي (حمى، تسرع، ارتفاع ضغط، تعرق) = إنعاش: بنزو بجرع عالية وريدية (ديازيبام 10-20 ملغ/15 د حتى الهدوء)، إماهة، تبريد، تثبيت لطيف بوضعية جانبية (استنشاق!)" } },
      { title: { fr: "DT réfractaire aux benzos (> 50 mg diazépam/h) : phénobarbital 130-260 mg IV ou propofol en réanimation, intubation si nécessaire", ar: "هذيان مقاوم للبنزو (> 50 ملغ ديازيبام/س): فينوباربيتال 130-260 ملغ وريدي أو بروبوفول بالإنعاش، تنبيب عند الحاجة" } },
      { title: { fr: "HALOPÉRIDOL : uniquement en ADJOINT pour agitation/hallucinations sévères après benzos efficaces — abaisse le seuil épileptogène, jamais en monothérapie", ar: "هالوبيريدول: فقط كإضافة للهياج/الهلاوس الشديدة بعد بنزو فعال — يخفض عتبة الاختلاج، لا وحده أبداً" } },
      { title: { fr: "Éliminer TOUJOURS les causes associées : trauma crânien, infection (ponction si fièvre isolée inexpliquée), hypoglycémie, hémorragie digestive, sepsis — le DT est un diagnostic d'exclusion partielle", ar: "استبعد دائماً الأسباب المرافقة: رض رأس، إنتان (بزل عند حمى معزولة غير مفسرة)، نقص سكر، نزف هضمي، إنتان دموي — الهذيان تشخيص استبعاد جزئي" } },
    ],
    keyPoints: [
      { fr: "Le sevrage peut survenir même avec une alcoolémie encore positive (le cerveau s'est adapté à des taux élevés) — ne pas attendre « zéro » pour traiter.", ar: "الانسحاب قد يحدث مع كحولية دم ما تزال موجبة (الدماغ تأقلم على مستويات عالية) — لا تنتظر «الصفر» للعلاج." },
      { fr: "Antécédent de DT ou de crises de sevrage = prédicteur majeur de récidive grave : prophylaxie systématique par benzos dès l'admission pour toute hospitalisation ultérieure.", ar: "سوابق هذيان أو نوبات انسحاب = مؤشر قوي لنكس شديد: وقاية منهجية بالبنزو منذ الإدخال بأي تنويم لاحق." },
      { fr: "Décès du DT : hyperthermie incontrôlée, arythmies sur hypokaliémie, aspiration — la surveillance continue n'est pas un luxe.", ar: "وفيات الهذيان: فرط حرارة غير مضبوط، اضطرابات نظم بنقص بوتاسيوم، استنشاق — المراقبة المستمرة ليست ترفاً." },
    ],
    trajectory: [
      { when: { fr: "CIWA-Ar < 8 à 24-48 h, constantes stables", ar: "‏CIWA-Ar < 8 بـ 24-48 س، حيوية مستقرة" }, do: [
        { fr: "Décroissance progressive des benzos, thiamine PO, bilan addictologique et orientation de sevrage programmé.", ar: "تخفيض تدريجي للبنزو، ثيامين فموي، تقييم إدمان وتوجيه لفطام مجدول." },
      ]},
      { when: { fr: "Hallucinations sans confusion à 12-24 h (hallucinose)", ar: "هلاوس دون تخليط بـ 12-24 س (هلاوس كحولية)" }, do: [
        { fr: "Hallucinose alcoolique (pronostic meilleur que le DT) : benzos, environnement calme, surveillance du passage au DT à 48-96 h.", ar: "هلاوس كحولية (إنذارها أفضل من الهذيان): بنزو، بيئة هادئة، مراقبة التحول لهذيان 48-96 س." },
      ]},
      { when: { fr: "Fièvre + rigidité + confusion chez un patient aussi sous neuroleptiques", ar: "حمى + تيبس + تخليط عند مريض على مضادات ذهانية أيضاً" }, do: [
        { fr: "Chevauchement possible avec un syndrome malin des neuroleptiques : CPK, arrêt des neuroleptiques, voir protocole SNM.", ar: "تداخل ممكن مع المتلازمة الخبيثة لمضادات الذهان: ‏CPK، إيقاف مضادات الذهان، انظر بروتوكول الخبيثة." },
        { fr: "Protocole syndrome malin des neuroleptiques", ar: "بروتوكول المتلازمة الخبيثة لمضادات الذهان" },
      ]},
    ],
    medications: ["diazepam", "thiamine", "haloperidol", "phenobarbital"],
    calculators: ["ciwa-ar", "gcs"],
    meta: { sources: ["ASAM alcohol withdrawal 2020", "CIWA-Ar Sullivan 1989"], lastReviewed: "2026-09" },
  },
  {
    id: "intoxication-digoxine",
    title: { fr: "Intoxication à la digoxine", ar: "تسمم بالديجوكسين" },
    category: "toxicologie",
    severity: "critical",
    summary: { fr: "Toute arythmie chez un digitalisé = intoxication jusqu'à preuve du contraire. L'HYPERKALIÉMIE signe la gravité (aiguë) ; l'hypokaliémie la précipite (chronique). Fragment Fab = antidote. Dialyse inefficace.", ar: "كل اضطراب نظم عند من يتناول الديجوكسين = تسمم حتى يثبت العكس. فرط البوتاسيوم دليل الخطورة (الحاد)؛ ونقصه يحرضه (المزمن). الأجسام المضادة Fab هي الترياق. الديالزة غير مجدية." },
    exams: {
      bio: [{ fr: "Digoxinémie (≥ 6 h après la prise — avant c'est ininterprétable), K⁺ (pronostic !), Mg²⁺, créatinine, ECG", ar: "مستوى الديجوكسين (≥ 6 س بعد الجرعة — قبلها غير قابل للتفسير)، بوتاسيوم (إنذاري!)، مغنزيوم، كرياتينين، تخطيط" }],
      img: [{ fr: "ECG répété : bradycardie, blocs AV, extrasystoles, FA régularisée, tachycardie bidirectionnelle (pathognomonique)", ar: "تخطيط متكرر: بطء، حصارات AV، لانقباضات، رجفان أذيني منتظم، تسرع ثنائي الاتجاه (مرضي المظهر)" }],
    },
    steps: [
      { title: { fr: "Contextes : intoxication AIGUË (ingestion volontaire — hyperkaliémie grave) vs CHRONIQUE (sujet âgé, insuffisance rénale, diurétiques — hypokaliémie déclenchante, tableau digestif/confusionnel trompeur)", ar: "السياقان: حاد (ابتلاع عمد — فرط بوتاسيوم شديد) مقابل مزمن (مسن، قصور كلوي، مدرات — نقص بوتاسيوم محرض، لوحة هضمية/تخليطية خادعة)" } },
      { title: { fr: "Signes : digestifs (nausées, vomissements, anorexie), visuels (halos, vision jaune/verte), neurologiques (confusion), CARDIAQUES (toute arythmie — la bradycardie jonctionnelle et le bloc AV sont les plus fréquents)", ar: "العلامات: هضمية (غثيان، تقيؤ، فقد شهية)، بصرية (هالات، رؤية صفراء/خضراء)، عصبية (تخليط)، قلبية (كل اضطراب نظم — بطء وصلوي وحصار AV الأكثر)" } },
      { title: { fr: "K⁺ > 5,0-5,5 mmol/L dans l'intoxication AIGUË = marqueur de mortalité majeur → indication d'ANTIDOTE sans attendre le dosage", ar: "بوتاسيوم > 5.0-5.5 بالتسمم الحاد = مؤشر وفيات كبير ⇒ استطباب الترياق دون انتظار التحليل" } },
      { title: { fr: "FRAGMENTS Fab antidigoxine (DigiFab®) : indications = K⁺ > 5,5 aigu, arythmie menaçante, bloc AV haut degré, ingestion > 10 mg (adulte) — disponibilité limitée en Tunisie : appeler IMMÉDIATEMENT le Centre Anti Poison (71 335 335) et organiser le transfert", ar: "أجسام Fab المضادة (DigiFab): الاستطبابات = بوتاسيوم > 5.5 حاد، اضطراب نظم مهدد، حصار AV عالٍ، ابتلاع > 10 ملغ (بالغ) — توفره محدود بتونس: اتصل فوراً بمركز مكافحة السموم (71335335) ونظم التحويل" } },
      { title: { fr: "Hyperkaliémie : insuline-glucose + salbutamol nébulisé + résines ; le CALCIUM IV était contre-indiqué classiquement (« stone heart ») — données modernes rassurantes mais prudence : privilégier l'antidote", ar: "فرط البوتاسيوم: أنسولين-غلوكوز + سالبوتامول رذاذي + راتنجات؛ الكالسيوم الوريدي كان ممنوعاً كلاسيكياً («قلب حجري») — البيانات الحديثة مطمئنة لكن بحذر: قدم الترياق" } },
      { title: { fr: "Bradycardie/bloc symptomatique : atropine 0,5-1 mg IV ; électroentraînement temporaire si bloc haut degré réfractaire — éviter l'isoprénaline (arythmogène)", ar: "بطء/حصار عرضي: أتروبين 0.5-1 ملغ وريدي؛ ناظمة مؤقتة إذا حصار عالٍ مقاوم — تجنب الإيزوبرينالين (مولد اضطراب النظم)" } },
      { title: { fr: "Charbon activé multidose (cycle entéro-hépatique) si ingestion récente ou chronique ; corriger hypokaliémie/hypomagnésémie dans les formes chroniques", ar: "فحم منشط متعدد الدفعات (دورة معوية-كبدية) إذا ابتلاع حديث أو مزمن؛ صحح نقص البوتاسيوم/المغنزيوم بالشكل المزمن" } },
      { title: { fr: "L'hémodialyse n'épure PAS la digoxine (grand volume de distribution) — elle ne sert qu'à corriger le milieu (K⁺, rein)", ar: "الديالزة لا تزيل الديجوكسين (حجم توزيع كبير) — تنفع فقط لتصحيح الوسط (بوتاسيوم، كلى)" } },
    ],
    keyPoints: [
      { fr: "Une digoxinémie « normale » n'exclut pas l'intoxication chronique : la toxicité dépend du potassium, du magnésium et de la fonction rénale autant que du taux.", ar: "مستوى ديجوكسين «طبيعي» لا يستبعد التسمم المزمن: السمية تتعلق بالبوتاسيوم والمغنزيوم والوظيفة الكلوية بقدر تعلقها بالمستوى." },
      { fr: "Tout nouveau diurétique, toute déshydratation, tout IEC/ARA II chez un digitalisé = vérifier K⁺ et créatinine — l'intoxication chronique est iatrogène dans la majorité des cas.", ar: "كل مدر جديد، كل تجفاف، كل حاصر ACE/ARB عند من يتناول الديجوكسين = تحقق من البوتاسيوم والكرياتينين — التسمم المزمن علاجي المنشأ غالباً." },
      { fr: "Tachycardie ventriculaire bidirectionnelle = pathognomonique (avec l'intoxication à l'aconit) — ne pas la prendre pour une TV polymorphe banale.", ar: "التسرع البطيني ثنائي الاتجاه = مرضي المظهر (مع تسمم الأكوتينيت) — لا تعامله كتسرع بطيني متعدد الأشكال عادي." },
    ],
    trajectory: [
      { when: { fr: "Après antidote ou correction : rythme stable, K⁺ normalisé", ar: "بعد الترياق أو التصحيح: نظم مستقر، بوتاسيوم طبيعي" }, do: [
        { fr: "Surveillance ECG 24 h (redistribution), réévaluation de l'indication réelle de la digoxine, éducation sur les interactions.", ar: "مراقبة تخطيط 24 س (إعادة توزيع)، إعادة تقييم استطباب الديجوكسين الحقيقي، توعية حول التداخلات." },
      ]},
      { when: { fr: "Arythmie ventriculaire menaçante malgré correction", ar: "اضطراب نظم بطيني مهدد رغم التصحيح" }, do: [
        { fr: "Lidocaïne ou phenytoine (relativement sûres dans la toxicité digitalique), antidote en urgence absolue, réanimation.", ar: "ليدوكائين أو فينيتوئين (آمنان نسبياً بالسمية الديجيتالية)، الترياق بطوارئ مطلقة، إنعاش." },
        { fr: "Protocole tachycardie en parallèle", ar: "بروتوكول تسرع القلب بالتوازي" },
      ]},
      { when: { fr: "Bloc AV complet avec choc", ar: "حصار AV كامل مع صدمة" }, do: [
        { fr: "Électroentraînement temporaire + antidote — la stimulation transcutanée peut être arythmogène, l'utiliser en pont seulement.", ar: "ناظمة مؤقتة + الترياق — التحفيز عبر الجلد قد يولد اضطراب نظم، استخدمه كجسر فقط." },
        { fr: "Protocole bradycardie", ar: "بروتوكول بطء القلب" },
      ]},
    ],
    medications: ["atropine", "insuline-rapide", "salbutamol"],
    calculators: ["qtc", "gazometrie"],
    meta: { sources: ["Goldfrank's", "Antidote registry Tunisia"], lastReviewed: "2026-09" },
  },
  {
    id: "intoxication-lithium",
    title: { fr: "Intoxication au lithium", ar: "تسمم بالليثيوم" },
    category: "toxicologie",
    severity: "critical",
    summary: { fr: "Neurotoxicité progressive : tremblements → ataxie → myoclonies → coma. Remplissage au NaCl 0,9 % (jamais de diurétiques/AINS). Hémodialyse si > 4 mEq/L ou signes graves. Rebond à 6-12 h.", ar: "سمية عصبية متدرجة: رعاش ← ترنح ← رمع ← غيبوبة. تعبئة بمحلول ملحي (أبداً مدرات/مضادات التهاب). ديلزة إذا > 4 م مك/ل أو علامات شديدة. ارتداد 6-12 س." },
    exams: {
      bio: [{ fr: "Lithiémie (immédiate puis toutes les 2-4 h jusqu'à décroissance), créatinine, ionogramme, calcémie, TSH, ECG, osmolarité (diabète insipide néphrogénique)", ar: "مستوى الليثيوم (فوري ثم كل 2-4 س حتى الانخفاض)، كرياتينين، شوارد، كالسيوم، ‏TSH، تخطيط، أسمولية (سكري كاذب كلوي)" }],
      img: [],
    },
    steps: [
      { title: { fr: "Formes : AIGUË chez un non-traité (tableau digestif puis neuro retardé), AIGUË-SUR-CHRONIQUE (la plus grave), CHRONIQUE (sujet traité — neurologie dominante, taux parfois « peu élevés » mais toxiques)", ar: "الأشكال: حاد عند غير المعالج (هضمي ثم عصبي متأخر)، حاد على مزمن (الأخطر)، مزمن (مريض معالج — العصبي يطغى، والمستوى قد يكون «غير مرتفع» لكنه سام)" } },
      { title: { fr: "Clinique progressive : tremblements fins → tremblements grossiers, ataxie, dysarthrie → myoclonies, hyperréflexie → convulsions, coma — l'aggravation peut se poursuivre APRÈS l'arrêt (distribution tissulaire)", ar: "تدرج سريري: رعاش ناعم ← رعاش خشن، ترنح، عسر تلفظ ← رمع، فرط منعكسات ← اختلاجات، غيبوبة — التدهور قد يستمر بعد الإيقاف (توزع نسيجي)" } },
      { title: { fr: "Repères de lithiémie (chronique) : 1,5-2,5 léger ; 2,5-3,5 modéré ; > 3,5 grave — MAIS la clinique prime : un chronique symptomatique à 1,8 peut être plus grave qu'un aigu à 3,0", ar: "عتبات المستوى (المزمن): 1.5-2.5 خفيف؛ 2.5-3.5 متوسط؛ > 3.5 شديد — لكن السريرة أولاً: مزمن عرضي بـ 1.8 قد يكون أخطر من حاد بـ 3.0" } },
      { title: { fr: "REMPLISSAGE au NaCl 0,9 % pour restaurer une diurèse saline — le lithium est réabsorbé comme le sodium : toute hyponatrémie/hypovolémie aggrave la toxicité", ar: "تعبئة بمحلول ملحي 0.9% لاستعادة إدرار ملحي — الليثيوم يمتص كالصوديوم: كل نقص صوديوم/حجم يفاقم السمية" } },
      { title: { fr: "INTERDITS : diurétiques thiazidiques, AINS, IEC — ils diminuent l'élimination du lithium ; charbon activé INEFFICACE (le lithium ne s'y fixe pas)", ar: "ممنوعات: مدرات ثيازيدية، مضادات التهاب، حاصرات ACE — تقلل إطراح الليثيوم؛ الفحم المنشط غير فعال (لا يرتبط بالليثيوم)" } },
      { title: { fr: "HÉMODIALYSE : lithiémie > 4 mEq/L quelle que soit la clinique ; > 2,5 avec signes neurologiques graves ou insuffisance rénale ; toute aggravation neurologique malgré le traitement", ar: "الديالزة: مستوى > 4 م مك/ل مهما كانت السريرة؛ > 2.5 مع علامات عصبية شديدة أو قصور كلوي؛ أي تدهور عصبي رغم العلاج" } },
      { title: { fr: "REBOND : le lithium ressort des tissus 6-12 h après la dialyse — contrôle de lithiémie systématique et 2e séance fréquemment nécessaire", ar: "الارتداد: يخرج الليثيوم من الأنسجة 6-12 س بعد الديلزة — قياس مستوى منهجي وجلسة ثانية غالباً ضرورية" } },
      { title: { fr: "Syndrome SILENT (rare, formes chroniques graves) : séquelles cérébelleuses définitives malgré traitement correct — la précocité de la dialyse protège", ar: "متلازمة SILENT (نادرة، بالأشكال المزمنة الشديدة): عقابيل مخيخية دائمة رغم العلاج الصحيح — التبكير بالديلزة يحمي" } },
      { title: { fr: "Évaluation psychiatrique : arrêt/ajustement du lithium, alternative thymorégulatrice, prévention du risque suicidaire", ar: "تقييم نفسي: إيقاف/تعديل الليثيوم، بديل منظم للمزاج، وقاية من خطر الانتحار" } },
    ],
    keyPoints: [
      { fr: "Index thérapeutique le plus étroit de la pharmacopée psychiatrique : déshydratation estivale, gastro-entérite ou ajout d'un AINS suffisent à intoxiquer un patient stable depuis des années.", ar: "أضيق هامش علاجي في الأدوية النفسية: تجفاف صيفي، التهاب معدة-أمعاء، أو إضافة مضاد التهاب تكفي لتسميم مريض مستقر منذ سنين." },
      { fr: "L'hémodialyse est le traitement des formes graves — ne pas perdre de temps en « hydratation seule » devant une ataxie ou des myoclonies avec lithiémie > 2,5.", ar: "الديلزة علاج الأشكال الشديدة — لا تضيع الوقت بـ«الإماهة وحدها» أمام ترنح أو رمع مع مستوى > 2.5." },
      { fr: "Le diabète insipide néphrogénique (polyurie) est fréquent chez le traité au long cours : en cas de privation d'eau, il accélère l'intoxication.", ar: "السكري الكاذب الكلوي (كثرة إدرار) شائع بالعلاج المديد: عند الحرمان من الماء يسرع التسمم." },
    ],
    trajectory: [
      { when: { fr: "Lithiémie décroissante, neurologie normale", ar: "مستوى منحدر، أعصاب طبيعية" }, do: [
        { fr: "Reprise du lithium discutée avec le psychiatre après la cause de l'intoxication (observance, interactions, hydratation).", ar: "استئناف الليثيوم يُناقش مع النفسي بعد سبب التسمم (الالتزام، التداخلات، الإماهة)." },
      ]},
      { when: { fr: "Lithiémie qui remonte après la 1re dialyse (rebond)", ar: "ارتفاع المستوى بعد الديلزة الأولى (ارتداد)" }, do: [
        { fr: "Deuxième séance de dialyse — le rebond est la règle dans les intoxications chroniques et les formes LP.", ar: "جلسة ديلزة ثانية — الارتداد هو القاعدة بالتسمم المزمن والأشكال مديدة المفعول." },
      ]},
      { when: { fr: "Convulsions ou coma", ar: "اختلاجات أو غيبوبة" }, do: [
        { fr: "Réanimation : intubation, benzos, dialyse en urgence — éviter la phénytoïne (peu efficace), corriger le calcium.", ar: "إنعاش: تنبيب، بنزو، ديلزة عاجلة — تجنب الفينيتوئين (ضعيف الفعالية)، صحح الكالسيوم." },
        { fr: "Protocole état de mal épileptique si convulsions prolongées", ar: "بروتوكول الحالة الصرعية إذا اختلاجات مطولة" },
      ]},
    ],
    medications: ["diazepam"],
    calculators: ["gazometrie", "gcs"],
    meta: { sources: ["EXTRIP lithium 2015", "Goldfrank's"], lastReviewed: "2026-09" },
  },
  {
    id: "intoxication-salicyles",
    title: { fr: "Intoxication aux salicylés (aspirine)", ar: "تسمم بالساليسيلات (أسبرين)" },
    category: "toxicologie",
    severity: "critical",
    summary: { fr: "Acouphènes + hyperventilation (alcalose respiratoire puis acidose métabolique). Alcalinisation urinaire au bicarbonate (JAMAIS d'acétazolamide), K⁺ obligatoire. Dialyse si coma, œdème pulmonaire, pH < 7,2 ou taux > 100 mg/dL.", ar: "طنين + فرط تهوية (قلاء تنفسي ثم حماض استقلابي). قلونة بولية بالبيكربونات (أبداً أسيتازولاميد)، وبوتاسيوم إلزامي. ديلزة عند غيبوبة، وذمة رئة، ‏pH < 7.2 أو مستوى > 100 ملغ/دل." },
    exams: {
      bio: [{ fr: "Salicylémie à ≥ 2 h post-ingestion puis toutes les 2 h (formes gastrorésistantes : absorption erratique prolongée), gazométrie répétée, K⁺, calcémie, glycémie (hypo fréquente chez l'enfant)", ar: "مستوى الساليسيلات ≥ 2 س بعد الابتلاع ثم كل 2 س (المغلفة معوياً: امتصاص متقلب مديد)، غازات متكررة، بوتاسيوم، كالسيوم، سكر (نقصه شائع عند الأطفال)" }],
      img: [{ fr: "Radio thorax (œdème pulmonaire non cardiogénique — signe de gravité)", ar: "صورة صدر (وذمة رئة غير قلبية — علامة خطورة)" }],
    },
    steps: [
      { title: { fr: "Reconnaître : acouphènes, hypoacousie, hyperventilation (polypnée profonde SANS signe de lutte), nausées, sueurs, fièvre modérée — intoxication volontaire fréquente (aspirine en vente libre partout)", ar: "تعرّف: طنين، نقص سمع، فرط تهوية (تنفس عميق بلا علامات جهد)، غثيان، تعرق، حمى خفيفة — تسمم عمد شائع (الأسبرين متاح دون وصفة)" } },
      { title: { fr: "Troubles acido-basiques en 3 phases : alcalose respiratoire (hyperventilation centrale) → alcalose + acidose métabolique → acidose mixte (signe de gravité, surtout enfant et personne âgée)", ar: "اضطراب حمض-قاعدة بـ 3 مراحل: قلاء تنفسي (فرط تهوية مركزي) ← قلاء + حماض استقلابي ← حماض مختلط (علامة خطورة، خصوصاً الطفل والمسن)" } },
      { title: { fr: "Le danger central : l'ACIDOSE fait passer les salicylés dans le SNC (forme non ionisée) — chaque épisode d'apnée (intubation, épuisement) peut être mortel", ar: "الخطر المركزي: الحماض يمرر الساليسيلات للجهاز العصبي (الشكل غير المتأين) — كل انقطاع نفس (تنبيب، إنهاك) قد يكون مميتاً" } },
      { title: { fr: "DÉCONTAMINATION : charbon activé 1 g/kg si < 2 h (ou plus pour formes gastrorésistantes/ingestions massives) ; doses répétées possibles", ar: "إزالة التلوث: فحم منشط 1 غ/كغ إذا < 2 س (أو أكثر للمغلفة/الابتلاع الضخم)؛ دفعات متكررة ممكنة" } },
      { title: { fr: "ALCALINISATION URINAIRE : bicarbonate de Na 1-2 mEq/kg IV puis 150 mEq dans 1 L (3 mL/kg/h) — objectif pH urinaire 7,5-8,0 ; c'est LE traitement qui élimine", ar: "قلونة البول: بيكربونات صوديوم 1-2 م مك/كغ وريدي ثم 150 م مك في لتر (3 مل/كغ/س) — الهدف pH بولي 7.5-8.0؛ هذا هو العلاج المطرح" } },
      { title: { fr: "K⁺ systématique (20-40 mEq/L de perfusion) : sans correction de l'hypokaliémie, l'alcalinisation urinaire est IMPOSSIBLE (échange H⁺/K⁺ rénal)", ar: "بوتاسيوم منهجي (20-40 م مك/ل بالتسريب): دون تصحيح نقص البوتاسيوم تصبح قلونة البول مستحيلة (تبادل H+/K+ كلوي)" } },
      { title: { fr: "JAMAIS d'acétazolamide pour « alcaliniser les urines » : il acidifie le sang et aggrave la pénétration cérébrale", ar: "أبداً أسيتازولاميد «لقولونة البول»: يحمّض الدم ويزيد النفوذ الدماغي" } },
      { title: { fr: "INTUBATION à éviter au maximum (l'apnée per-induction acidose brutalement) : si inévitable, maintenir l'hyperventilation compensatrice au ventilateur (VM élevée)", ar: "تجنب التنبيب ما أمكن (انقطاع النفس بالتحريض يحمّض فجأة): إذا حتمياً، حافظ على فرط التهوية التعويضية بالمنفسة (حجم دقيق عالٍ)" } },
      { title: { fr: "HÉMODIALYSE : salicylémie > 100 mg/dL (aigu), > 60 (chronique), coma/convulsions, œdème pulmonaire, acidose réfractaire pH < 7,2, insuffisance rénale", ar: "الديالزة: مستوى > 100 ملغ/دل (حاد)، > 60 (مزمن)، غيبوبة/اختلاجات، وذمة رئة، حماض مقاوم pH < 7.2، قصور كلوي" } },
    ],
    keyPoints: [
      { fr: "Une gazométrie « alcalose respiratoire + trou anionique élevé » chez un adulte qui hyperventile = salicylés jusqu'à preuve du contraire — ne pas l'étiqueter crise d'angoisse.", ar: "غازات «قلاء تنفسي + فجوة أنيونية عالية» عند بالغ يفرط بالتنفس = ساليسيلات حتى يثبت العكس — لا تصنفها نوبة قلق." },
      { fr: "L'enfant passe directement à l'acidose métabolique (peu ou pas d'alcalose) — toute ingestion pédiatrique est potentiellement grave.", ar: "الطفل ينتقل مباشرة للحماض الاستقلابي (بلا قلاء تقريباً) — كل ابتلاع عند الأطفال خطير محتملاً." },
      { fr: "Les formes gastrorésistantes et les bézoards gastriques donnent des absorptions en plateau sur 24 h : répéter les salicylémies avant de conclure.", ar: "الأشكال المغلفة معوياً والكرات المعدية تعطي امتصاصاً هضبة على 24 س: كرر القياسات قبل الاستنتاج." },
    ],
    trajectory: [
      { when: { fr: "Salicylémie décroissante × 2 contrôles, pH urinaire 7,5-8, clinique normale", ar: "مستوى منحدر بقياسين، ‏pH بولي 7.5-8، سريرة طبيعية" }, do: [
        { fr: "Arrêt du bicarbonate, évaluation psychiatrique (ingestion volontaire), sortie après observation 12-24 h.", ar: "إيقاف البيكربونات، تقييم نفسي (ابتلاع عمد)، خروج بعد ملاحظة 12-24 س." },
      ]},
      { when: { fr: "Salicylémie en plateau malgré alcalinisation correcte", ar: "مستوى ثابت رغم قلونة صحيحة" }, do: [
        { fr: "Bézoard/absorption prolongée : charbon multidose, envisager lavage gastrique tardif si ingestion massive récente, endoscopie si suspicion de bézoard.", ar: "كرة معدية/امتصاص مديد: فحم متعدد الدفعات، وازن غسلاً معدياً متأخراً إذا ابتلاع ضخم حديث، تنظير عند اشتباه كرة." },
      ]},
      { when: { fr: "Confusion, coma, œdème pulmonaire, pH < 7,2", ar: "تخليط، غيبوبة، وذمة رئة، ‏pH < 7.2" }, do: [
        { fr: "Hémodialyse en urgence absolue — c'est le seul traitement qui sauve à ce stade ; réanimation en parallèle.", ar: "ديلزة بطوارئ مطلقة — هي العلاج المنقذ الوحيد بهذه المرحلة؛ إنعاش بالتوازي." },
        { fr: "Œdème pulmonaire : ventilation protectrice, éviter la surcharge", ar: "وذمة رئة: تهوية واقية، تجنب الحمل الزائد" },
      ]},
    ],
    medications: ["bicarbonate", "diazepam"],
    calculators: ["gap-metabolique", "gazometrie", "dose-poids"],
    meta: { sources: ["EXTRIP salicylates 2018", "Goldfrank's"], lastReviewed: "2026-09" },
  },
  {
    id: "pancreatite-aigue",
    title: { fr: "Pancréatite aiguë", ar: "التهاب البنكرياس الحاد" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Douleur épigastrique transfixiante + lipase > 3N. Hydratation précoce au Ringer lactate, alimentation reprise tôt, PAS d'antibiotique prophylactique. Origine biliaire : CPRE < 48 h si angiocholite, cholécystectomie avant la sortie.", ar: "ألم شرسوفي نافذ + ليباز > 3 أمثال الطبيعي. إماهة مبكرة برينغر لاكتات، استئناف تغذية مبكر، لا مضاد وقائي. منشأ صفراوي: ‏CPRE < 48 س عند التهاب الأقنية، استئصال مرارة قبل الخروج." },
    exams: {
      bio: [{ fr: "Lipase (> 3N = diagnostic, l'amylase est moins spécifique), ALT (×3 = origine biliaire à 95 %), triglycérides, calcémie, NFS, CRP (à 48 h pour la sévérité), créatinine, LDH", ar: "ليباز (> 3 أمثال الطبيعي = تشخيص، الأميلاز أقل نوعية)، ‏ALT (×3 = منشأ صفراوي 95%)، شحوم ثلاثية، كالسيوم، عد دم، ‏CRP (بـ 48 س للخطورة)، كرياتينين، ‏LDH" }],
      img: [{ fr: "Échographie abdominale SYSTÉMATIQUE (lithiase) ; TDM injectée SEULEMENT après 72 h si sévérité/doute diagnostique (la nécrose n'est visible que tard)", ar: "إيكو بطن منهجي (حصيات)؛ طبقي محقون فقط بعد 72 س عند الشدة/الشك التشخيصي (النخر لا يظهر إلا متأخراً)" }],
    },
    steps: [
      { title: { fr: "Diagnostic = 2 critères sur 3 : douleur typique (épigastre transfixiante, antéflexion antalgique), lipase > 3N, imagerie évocatrice — la lipase seule suffit souvent", ar: "التشخيص = معياران من 3: ألم نمطي (شرسوفي نافذ، انحناء مريح)، ليباز > 3 أمثال، تصوير موحي — الليباز وحده يكفي غالباً" } },
      { title: { fr: "HYDRATATION PRÉCOCE et agressive : Ringer lactate 5-10 mL/kg/h les 6-12 premières heures puis 3 mL/kg/h — c'est le traitement qui change le pronostic (hypoperfusion splanchnique) ; prudence > 70 ans et cardiopathes (risque de surcharge)", ar: "إماهة مبكرة مكثفة: رينغر لاكتات 5-10 مل/كغ/س أول 6-12 س ثم 3 مل/كغ/س — هذا العلاج يغير الإنذار (نقص إرواء حشوي)؛ حذر > 70 سنة ومرضى القلب (خطر حمل زائد)" } },
      { title: { fr: "ANTALGIE efficace : paracétamol ± AINS, morphine titrée si besoin — le « spasme du sphincter d'Oddi par la morphine » est un mythe clinique non pertinent", ar: "تسكين فعال: باراسيتامول ± مضادات التهاب، مورفين معاير عند الحاجة — «تشنج معصرة أودي بالمورفين» أسطورة سريرية غير ذات أثر" } },
      { title: { fr: "ALIMENTATION reprise précocement (dès 24-72 h si douleur cédante) : orale légère d'emblée — le jeûne prolongé « pour mettre le pancréas au repos » est OBSOLÈTE et délétère", ar: "استئناف التغذية مبكراً (منذ 24-72 س عند تراجع الألم): فموية خفيفة مباشرة — الصيام المطول «لإراحة البنكرياس» عفا عليه الزمن ومؤذٍ" } },
      { title: { fr: "PAS d'antibiotique prophylactique, même en cas de nécrose stérile — antibiotiques seulement si infection documentée (nécrose infectée à partir de J7-J10, sepsis, angiocholite associée)", ar: "لا مضاد حيوي وقائي، حتى مع نخر عقيم — مضادات فقط عند إنتان موثق (نخر معنتن من اليوم 7-10، إنتان دم، التهاب أقنية مرافق)" } },
      { title: { fr: "Origine BILIAIRE (ALT ×3, écho) : CPRE en urgence < 24-48 h SEULEMENT si angiocholite ou obstruction persistante ; sinon CPRE élective ; cholécystectomie AVANT la sortie (récidive 30 % à 6 semaines)", ar: "منشأ صفراوي (‏ALT ×3، إيكو): ‏CPRE عاجل < 24-48 س فقط عند التهاب أقنية أو انسداد مستمر؛ وإلا مجدول؛ استئصال مرارة قبل الخروج (نكس 30% بـ 6 أسابيع)" } },
      { title: { fr: "Sévérité (Atlanta révisée) : légère (pas de défaillance) ; modérée (défaillance transitoire < 48 h) ; GRAVE (défaillance d'organe persistante > 48 h — mortalité 30-50 %) — score BISAP dès l'admission, CRP > 150 à 48 h", ar: "الخطورة (أتلانتا المعدلة): خفيفة (بلا فشل)؛ متوسطة (فشل عابر < 48 س)؛ شديدة (فشل عضو مستمر > 48 س — وفيات 30-50%) — سكور BISAP منذ الإدخال، ‏CRP > 150 بـ 48 س" } },
      { title: { fr: "Hypertriglycéridémie (> 1000 mg/dL) : insuline IV ± plasmaphérèse ; autres causes : alcool, post-CPRE, médicaments (azathioprine, valproate), hypercalcémie, trauma, auto-immune", ar: "شحوم ثلاثية عالية (> 1000 ملغ/دل): أنسولين وريدي ± فصادة بلازما؛ أسباب أخرى: كحول، بعد CPRE، أدوية (أزاثيوبرين، فالبروات)، فرط كالسيوم، رض، مناعي" } },
      { title: { fr: "Nécrose infectée (aggravation secondaire à J7-J10) : TDM, antibiothérapie (pipé-tazo ou carbapénème — pénétration pancréatique), drainage « step-up » (percutané/endoscopique d'abord, nécrosectomie en dernier recours)", ar: "نخر معنتن (تدهور ثانوي باليوم 7-10): طبقي، مضادات (بيبيراسيلين-تازو أو كاربابينيم — نفوذ بنكرياسي)، تصريف متدرج (عبر الجلد/تنظيري أولاً، استئصال نخر كحل أخير)" } },
    ],
    keyPoints: [
      { fr: "Une lipase normale n'exclut pas une pancréatite tardive (> 5-7 jours : la lipase redescend) ni une pancréatite chronique en poussée — l'imagerie tranche.", ar: "ليباز طبيعي لا يستبعد التهاباً متأخراً (> 5-7 أيام: ينخفض الليباز) ولا نوبة على التهاب مزمن — التصوير يفصل." },
      { fr: "L'hyperhydratation est bénéfique MAIS pas à tout prix : surveiller diurèse, auscultation et SpO₂ — l'œdème pulmonaire iatrogène tue aussi.", ar: "الإماهة الكثيفة مفيدة لكن ليس بأي ثمن: راقب الإدرار والسمع والإشباع — الوذمة الرئوية العلاجية تقتل أيضاً." },
      { fr: "Toute pancréatite « idiopathique » chez le sujet jeune = chercher la microlithiase (écho endoscopique) et la cause génétique/métabolique avant de conclure à l'alcool par défaut.", ar: "كل التهاب «مجهول السبب» عند شاب = ابحث عن حصيات دقيقة (إيكو باطني) وسبب وراثي/استقلابي قبل نسبة السبب للكحول افتراضاً." },
    ],
    trajectory: [
      { when: { fr: "Douleur cédante à 48-72 h, alimentation tolérée, CRP en baisse", ar: "تراجع الألم 48-72 س، تغذية محتملة، ‏CRP هابط" }, do: [
        { fr: "Forme légère : sortie avec cholécystectomie programmée (si biliaire), sevrage alcoolique, régime.", ar: "شكل خفيف: خروج مع استئصال مرارة مجدول (إذا صفراوي)، فطام كحولي، حمية." },
      ]},
      { when: { fr: "SIRS persistant à 48 h, créatinine qui monte, SpO₂ qui baisse", ar: "‏SIRS مستمر بـ 48 س، كرياتينين يصعد، إشباع ينزل" }, do: [
        { fr: "Passage probable en forme sévère : réanimation, TDM à 72 h, dépistage des défaillances d'organes (Atlanta).", ar: "تحول محتمل لشكل شديد: إنعاش، طبقي بـ 72 س، تحري فشل الأعضاء (أتلانتا)." },
        { fr: "Principes de réanimation du SIRS persistant", ar: "مبادئ إنعاش SIRS المستمر" },
      ]},
      { when: { fr: "Aggravation brutale à J7-J10 (fièvre, choc)", ar: "تدهور مفاجئ باليوم 7-10 (حمى، صدمة)" }, do: [
        { fr: "Nécrose infectée : TDM, antibothérapie à pénétration pancréatique, drainage step-up en milieu spécialisé.", ar: "نخر معنتن: طبقي، مضادات بنفوذ بنكرياسي، تصريف متدرج بوسط مختص." },
      ]},
    ],
    medications: ["paracetamol", "morphine", "piperacilline-tazobactam"],
    calculators: ["bisap", "gazometrie", "qsofa"],
    meta: { sources: ["ACG pancreatitis 2024", "IAP/APA guidelines"], lastReviewed: "2026-09" },
  },
  {
    id: "appendicite",
    title: { fr: "Appendicite aiguë", ar: "التهاب الزائدة الدودية الحاد" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "Douleur migratrice fosse iliaque droite + défense au McBurney. β-hCG chez TOUTE femme en âge de procréer. Écho puis TDM si doute. A jeun, antibioprophylaxie, appendicectomie — la perforation est la complication qui fait la gravité.", ar: "ألم مهاجر بالحفرة الحرقفية اليمنى + دفاع بنقطة ماكبرني. هرمون حمل لكل امرأة بعمر الإنجاب. إيكو ثم طبقي عند الشك. صيام، مضاد وقائي، استئصال — الانثقاب هو الاختلاط الذي يصنع الخطورة." },
    exams: {
      bio: [{ fr: "NFS (hyperleucocytose à PNN — absente dans 10-20 % !), CRP, β-hCG OBLIGATOIRE chez toute femme en âge de procréer, bilan pré-op", ar: "عد دم (كثرة بيض بمحببات — غائبة بـ 10-20%!‏)، ‏CRP، هرمون حمل إلزامي لكل امرأة بعمر الإنجاب، تحضير جراحي" }],
      img: [{ fr: "Échographie en 1re intention (jeune, mince, femme enceinte) ; TDM abdominale injectée = référence chez l'adulte si doute (sensibilité > 95 %)", ar: "إيكو بالخط الأول (شاب، نحيل، حامل)؛ طبقي بطن محقون = المرجع عند البالغ عند الشك (حساسية > 95%)" }],
    },
    steps: [
      { title: { fr: "Clinique classique : douleur PÉRIMBILICALE puis migration en fosse iliaque droite (6-12 h), anorexie (signe constant !), nausées, défense au point de McBurney, Blumberg (décompression douloureuse), psoas, obturateur", ar: "السريرة الكلاسيكية: ألم حول السرة ثم هجرة للحفرة الحرقفية اليمنى (6-12 س)، فقد شهية (علامة ثابتة!)، غثيان، دفاع بنقطة ماكبرني، علامة بلومبرغ (ألم عند رفع الضغط)، علامات السوية والسادّ" } },
      { title: { fr: "β-hCG chez TOUTE femme en âge de procréer AVANT toute imagerie irradiante — la GEU mimique l'appendicite et tue", ar: "هرمون حمل لكل امرأة بعمر الإنجاب قبل أي تصوير شعاعي — الحمل خارج الرحم يقلد الزائدة ويقتل" } },
      { title: { fr: "Score d'Alvarado (calculatrice) : ≥ 7 chirurgie probable ; 5-6 imagerie + observation ; ≤ 4 diagnostic alternatif à chercher", ar: "سكور ألفارادو (الحاسبة): ≥ 7 جراحة محتملة؛ 5-6 تصوير + ملاحظة؛ ≤ 4 ابحث عن تشخيص بديل" } },
      { title: { fr: "Formes trompeuses : personne âgée (diagnostic tardif = perforations), femme enceinte (appendice refoulé en haut et à droite, IRM préférée à la TDM), enfant (perforation rapide), rétro-cæcale (douleur lombaire, pas de défense), pelvienne (signes urinaires/ténesme)", ar: "أشكال خادعة: المسن (تشخيص متأخر = انثقابات)، الحامل (الزائدة مدفوعة للأعلى واليمين، مرنان مفضل على الطبقي)، الطفل (انثقاب سريع)، خلف الأعور (ألم قطني بلا دفاع)، الحوضية (علامات بولية/زحير)" } },
      { title: { fr: "PRISE EN CHARGE : à jeun, voie veineuse, réhydratation, ANTALGIE (la priver d'antalgiques « pour ne pas masquer » est obsolète et cruelle), antiémétique", ar: "التدبير: صيام، وريد، إماهة، تسكين (منع المسكنات «كي لا تخفي» أمر عفا عليه الزمن وقاسٍ)، مضاد إقياء" } },
      { title: { fr: "Antibioprophylaxie pré-opératoire (amoxicilline-clavulanate ou céfotaxime + métronidazole) dès la décision chirurgicale", ar: "مضاد وقائي قبل الجراحة (أموكسيسيلين-كلاف أو سيفوتاكسيم + مترونيدازول) منذ القرار الجراحي" } },
      { title: { fr: "Appendicectomie cœlioscopique = standard ; le traitement antibiotique exclusif des formes NON compliquées est une option discutée (récidive ~30 % à 1 an) — décision conjointe avec le chirurgien et le patient", ar: "استئصال بالمنظار = المعيار؛ العلاج بالمضادات وحده للأشكال غير المعقدة خيار مطروح (نكس ~30% بسنة) — قرار مشترك مع الجراح والمريض" } },
      { title: { fr: "Péritonite appendiculaire (douleur généralisée, contracture, sepsis) : urgence chirurgicale absolue, réanimation septique, antibiothérapie large", ar: "التهاب بريتوان زائدي (ألم معمم، تقلص، إنتان): طوارئ جراحية مطلقة، إنعاش إنتاني، مضادات واسعة" } },
      { title: { fr: "Diagnostic différentiel femme jeune : GEU (β-hCG), torsion d'annexe (écho Doppler), salpingite ; homme : torsion testiculaire (examen scrotal !) ; enfant : adénite mésentérique, invagination", ar: "التشخيص التفريقي لشابة: حمل خارج الرحم (هرمون)، التفاف ملحق (إيكو دوبلر)، التهاب بوق؛ رجل: التفاف خصية (فحص الصفن!)؛ طفل: التهاب عقد مساريقية، انغماد" } },
    ],
    keyPoints: [
      { fr: "Une NFS et une CRP normales n'éliminent PAS une appendicite débutante (10-20 % des cas) — la clinique et l'imagerie priment ; ne jamais renvoyer sur la seule biologie.", ar: "عد دم وCRP طبيعيان لا يلغيان التهاباً باكراً (10-20%) — السريرة والتصوير أولاً؛ لا إخراج اعتماداً على التحاليل وحدها." },
      { fr: "L'anorexIE est le signe le plus constant : un patient qui a faim a peu de chances d'avoir une appendicite (règle de Cope).", ar: "فقد الشهية أثبت العلامات: مريض جائع احتمال الزائدة عنده ضعيف (قاعدة كوب)." },
      { fr: "L'appendice du sujet âgé se perfore silencieusement : seuil d'imagerie très bas après 60 ans, même devant un tableau « pauvre ».", ar: "زائدة المسن تنثقب بصمت: عتبة تصوير منخفضة جداً بعد 60 سنة، حتى أمام لوحة «فقيرة»." },
    ],
    trajectory: [
      { when: { fr: "Alvarado ≥ 7 + imagerie confirmative", ar: "ألفارادو ≥ 7 + تصوير مؤكد" }, do: [
        { fr: "Chirurgie programmée rapidement : à jeun, antibioprophylaxie, appendicectomie cœlioscopique.", ar: "جراحة مجدولة سريعاً: صيام، مضاد وقائي، استئصال بالمنظار." },
      ]},
      { when: { fr: "Alvarado 5-6, imagerie douteuse", ar: "ألفارادو 5-6، تصوير مشكوك" }, do: [
        { fr: "Observation active 6-12 h : réexamen chirurgical répété, CRP à 6-12 h, imagerie de contrôle — l'évolution fait le diagnostic.", ar: "ملاحظة نشطة 6-12 س: إعادة فحص جراحية متكررة، ‏CRP بـ 6-12 س، تصوير مراقب — التطور يصنع التشخيص." },
      ]},
      { when: { fr: "Péritonite ou sepsis installé", ar: "التهاب بريتوان أو إنتان قائم" }, do: [
        { fr: "Bloc immédiat + réanimation septique ; chez l'enfant et l'immunodéprimé, l'aggravation est fulgurante.", ar: "صالة عمليات فورية + إنعاش إنتاني؛ عند الطفل ومكبوت المناعة التدهور خاطف." },
        { fr: "Protocole choc septique en parallèle", ar: "بروتوكول الصدمة الإنتانية بالتوازي" },
      ]},
    ],
    medications: ["amoxicilline", "metronidazole", "ondansetron", "paracetamol"],
    calculators: ["alvarado", "dose-poids"],
    meta: { sources: ["WSES Jerusalem guidelines 2020"], lastReviewed: "2026-09" },
  },
  {
    id: "angiocholite",
    title: { fr: "Angiocholite aiguë (cholangite)", ar: "التهاب الأقنية الصفراوية الحاد" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Triade de Charcot (fièvre + ictère + douleur de l'hypochondre droit) ; pentade de Reynolds si choc + confusion. Antibiotique < 1 h + DRAINAGE BILIAIRE < 24 h (CPRE) — le drainage EST le traitement.", ar: "ثلاثية شاركو (حمى + يرقان + ألم المراق الأيمن)؛ خماسية رينولدز مع صدمة + تخليط. مضاد < 1 س + تصريف صفراوي < 24 س (‏CPRE) — التصريف هو العلاج." },
    exams: {
      bio: [{ fr: "Hémocultures ×2 AVANT l'antibiotique, NFS, CRP, bilirubine, PAL/GGT, transaminases, lipase (pancréatite biliaire associée ?), coagulation (TP bas → vitamine K), lactate", ar: "مزارع دم × 2 قبل المضاد، عد دم، ‏CRP، بيليروبين، ‏PAL/GGT، ناقلات أمين، ليباز (التهاب بنكرياس صفراوي مرافق؟)، تخثر (‏TP منخفض ← فيتامين K)، لاكتات" }],
      img: [{ fr: "Échographie (dilatation des voies biliaires, lithiase — mais normale dans 20-30 %) ; IRM biliaire (cholédoque) si disponible ; écho-endoscopie en cas de doute", ar: "إيكو (توسع أقنية، حصيات — لكنه طبيعي بـ 20-30%)؛ مرنان الأقنية (القناة الجامعة) إن توفر؛ إيكو باطني عند الشك" }],
    },
    steps: [
      { title: { fr: "Triade de CHARCOT : fièvre/frissons + ICTÈRE + douleur de l'hypochondre droit — complète dans ~60 % des cas ; pentade de REYNOLDS (+ hypotension + confusion) = angiocholite GRAVE", ar: "ثلاثية شاركو: حمى/قشعريرة + يرقان + ألم المراق الأيمن — مكتملة بـ 60% تقريباً؛ خماسية رينولدز (+ هبوط + تخليط) = التهاب أقنية شديد" } },
      { title: { fr: "Critères de Tokyo 2018 : A. inflammation systémique (fièvre/CRP/leucocytes) + B. cholestase (ictère/biologie) + C. imagerie (dilatation/étiologie) — A+B = suspectée, A+B+C = certaine", ar: "معايير طوكيو 2018: ‏A. التهاب جهازي (حمى/CRP/بيض) + B. ركود صفراوي (يرقان/تحاليل) + C. تصوير (توسع/سبب) — ‏A+B مشتبه، ‏A+B+C مؤكد" } },
      { title: { fr: "URGENCES simultanées : hémocultures puis ANTIBIOTIQUE IV < 1 h (pipéracilline-tazobactam 4,5 g, ou céfotaxime 2 g + métronidazole si pénicilline impossible), remplissage prudent, vitamine K si TP bas", ar: "عجالات متزامنة: مزارع ثم مضاد وريدي < 1 س (بيبيراسيلين-تازو 4.5 غ، أو سيفوتاكسيم 2 غ + مترونيدازول إذا تعذر البنسلين)، تعبئة حذرة، فيتامين K إذا TP منخفض" } },
      { title: { fr: "DRAINAGE BILIAIRE < 24 h (urgence absolue si choc/confusion = < 12 h) : CPRE avec sphinctérotomie = 1re intention ; drainage transhépatique percutané si CPRE impossible/échouée ; chirurgical en dernier recours", ar: "تصريف صفراوي < 24 س (طوارئ مطلقة عند صدمة/تخليط = < 12 س): ‏CPRE مع شق المعصرة = الخيار الأول؛ تصريف عبر الكبد عبر الجلد إذا تعذر CPRE/فشل؛ الجراحة كحل أخير" } },
      { title: { fr: "Sans drainage, la mortalité des formes graves dépasse 50 % — l'antibiotique seul ne traverse pas une voie biliaire obstruée sous pression (pus sous tension)", ar: "دون تصريف تتجاوز وفيات الأشكال الشديدة 50% — المضاد وحده لا ينفذ في أقنية مسدودة تحت الضغط (قيح مضغوط)" } },
      { title: { fr: "Étiologies : lithiase de la voie biliaire principale (majoritaire en Tunisie), sténose bénigne/maligne (ictère progressif SANS douleur = penser cancer/tête du pancréas), ascaridiose biliaire (contexte rural), prothèse biliaire obstruée", ar: "الأسباب: حصيات القناة الرئيسية (الغالب بتونس)، تضيق حميد/خبيث (يرقان متدرج بلا ألم = فكر بسرطان رأس البنكرياس)، إسكارس صفراوي (وسط ريفي)، دعامة صفراوية مسدودة" } },
      { title: { fr: "Différencier la CHOLÉCYSTITE (Murphy positif, PAS d'ictère franc, voie biliaire non dilatée — traitement : antibior + cholécystectomie) de l'angiocholite (ictère + dilatation — traitement : drainage)", ar: "ميّز التهاب المرارة (علامة مورفي موجبة، بلا يرقان صريح، أقنية غير متوسعة — العلاج: مضاد + استئصال مرارة) عن التهاب الأقنية (يرقان + توسع — العلاج: تصريف)" } },
      { title: { fr: "Après drainage : adapter l'antibiothèque aux hémocultures (7-10 j), cholécystectomie dans les semaines qui suivent (lithiase), enquête étiologique complète", ar: "بعد التصريف: كيّف المضاد حسب المزارع (7-10 أيام)، استئصال مرارة خلال الأسابيع التالية (حصيات)، تحري السبب كاملاً" } },
    ],
    keyPoints: [
      { fr: "La fièvre à frissons répétitifs (« fièvre biliaire ») avec ictère fluctuant = angiocholite jusqu'à drainage — chaque frisson est une bactériémie.", ar: "الحمى بقشعريرة متكررة («حمى صفراوية») مع يرقان متقلب = التهاب أقنية حتى التصريف — كل قشعريرة تجرثم دم." },
      { fr: "Le sujet âgé peut n'avoir NI fièvre NI douleur — confusion + ictère + rein qui flanche = angiocholite jusqu'à preuve du contraire.", ar: "المسن قد لا يملك لا حمى ولا ألماً — تخليط + يرقان + كلى تتدهور = التهاب أقنية حتى يثبت العكس." },
      { fr: "L'échographie normale n'exclut pas l'angiocholite (obstruction récente, calcul enclavé distal) — l'IRM biliaire ou l'écho-endoscopie tranchent.", ar: "إيكو طبيعي لا يستبعد التهاب الأقنية (انسداد حديث، حصاة منحشرة قاصية) — المرنان أو الإيكو الباطني يفصلان." },
    ],
    trajectory: [
      { when: { fr: "Après drainage : apyrexie à 48-72 h, bilirubine en baisse", ar: "بعد التصريف: بلا حمى 48-72 س، بيليروبين هابط" }, do: [
        { fr: "Antibiothérapie adaptée 7-10 jours, programmation de la cholécystectomie, sortie avec suivi.", ar: "مضادات مكيفة 7-10 أيام، جدولة استئصال المرارة، خروج مع متابعة." },
      ]},
      { when: { fr: "Fièvre persistante à 48-72 h après drainage", ar: "حمى مستمرة 48-72 س بعد التصريف" }, do: [
        { fr: "Drainage incomplet/abcès hépatique/prothèse obstruée : imagerie de contrôle, re-CPRE ou drainage complémentaire.", ar: "تصريف ناقص/خراج كبدي/دعامة مسدودة: تصوير مراقب، إعادة CPRE أو تصريف إضافي." },
      ]},
      { when: { fr: "Pentade de Reynolds (choc + confusion)", ar: "خماسية رينولدز (صدمة + تخليط)" }, do: [
        { fr: "Réanimation septique + drainage en urgence absolue (< 12 h) — ne jamais attendre « l'amélioration sous antibiotiques » pour drainer.", ar: "إنعاش إنتاني + تصريف بطوارئ مطلقة (< 12 س) — لا تنتظر أبداً «تحسناً بالمضادات» للتصريف." },
        { fr: "Protocole choc septique", ar: "بروتوكول الصدمة الإنتانية" },
      ]},
    ],
    medications: ["piperacilline-tazobactam", "cefotaxime", "metronidazole"],
    calculators: ["qsofa", "gazometrie"],
    meta: { sources: ["Tokyo Guidelines 2018", "EASL"], lastReviewed: "2026-09" },
  },
  {
    id: "occlusion-intestinale",
    title: { fr: "Occlusion intestinale aiguë", ar: "الانسداد المعوي الحاد" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "Douleur + vomissements + arrêt des matières et des gaz + distension. Chercher l'étranglement (urgence chirurgicale) et l'origine (bridage > hernie > tumeur). ASP/TDM, à jeun + SNG + réhydratation ; essai conservateur 24-48 h max.", ar: "ألم + تقيؤ + انقطاع البراز والريح + انتفاخ. ابحث عن الاختناق (طوارئ جراحية) والسبب (التصاقات > فتق > ورم). صورة/طبقي، صيام + أنبوب معدي + إماهة؛ محاولة محافظة 24-48 س كحد أقصى." },
    exams: {
      bio: [{ fr: "NFS, ionogramme (vomissements : alcalose hypokaliémique), créatinine, lactate (ischémie !), CRP, groupage", ar: "عد دم، شوارد (التقيؤ: قلاء بنقص بوتاسيوم)، كرياتينين، لاكتات (إقفار!)، ‏CRP، زمرة" }],
      img: [{ fr: "ASP debout (niveaux hydro-aériques, distension grêlique vs colique) ; TDM injectée = référence (siège, cause, signes de strangulation)", ar: "صورة بطن واقف (مستويات سائل-هواء، توسع دقيق مقابل قولوني)؛ طبقي محقون = المرجع (الموقع، السبب، علامات اختناق)" }],
    },
    steps: [
      { title: { fr: "Tableau : douleurs coliques + VOMISSEMENTS (précoces = grêle haut, fécaloïdes = tardif) + ARRÊT des matières ET des gaz + distension abdominale — l'émission de gaz seule possible au début (vidange d'aval)", ar: "اللوحة: آلام مغص + تقيؤ (مبكر = دقيق علوي، برازي = متأخر) + انقطاع البراز والريح + انتفاخ بطن — خروج الريح وحده ممكن بالبداية (تفريغ الأسفل)" } },
      { title: { fr: "EXAMEN des orifices herniaires OBLIGATOIRE (inguinal, crural, ombilical, cicatriciel) — la hernie étranglée se traite au lit du malade et se rate facilement chez l'obèse", ar: "فحص فتحات الفتوق إلزامي (إربي، فخذي، سري، ندبي) — الفتق المختنق يُعالج بجانب السرير ويُفوَّت بسهولة عند البدين" } },
      { title: { fr: "SIGNES D'ÉTRANGLEMENT = chirurgie sans délai : douleur CONTINUE (et non colique), défense/contracture, fièvre, tachycardie, leucocytose, lactate élevé — l'intestin étranglé nécrose en 6 h", ar: "علامات الاختناق = جراحة دون تأخير: ألم مستمر (لا مغصي)، دفاع/تقلص، حمى، تسرع قلب، كثرة بيض، لاكتات عالٍ — الأمعاء المختنقة تنتخر بـ 6 س" } },
      { title: { fr: "Étiologies : BRIDAGES (antécédent chirurgical — 60-75 %), hernies étranglées, tumeurs coliques (sujet âgé sans cicatrice — penser cancer !), volvulus du sigmoïde (sujet âgé institutionnalisé, « grain de café »), invagination (enfant)", ar: "الأسباب: التصاقات (سوابق جراحية — 60-75%)، فتوق مختنقة، أورام قولونية (مسن بلا ندبة — فكر بسرطان!)، انفتال السين (مسن مقيم بالمؤسسات، «حبة قهوة»)، انغماد (طفل)" } },
      { title: { fr: "Traitement initial systématique : À JEUN, sonde naso-gastrique en aspiration (soulage et diminue l'inhalation), réhydratation IV généreuse (3e secteur), correction ionique, antalgiques, antiémétiques, sonde urinaire si sévère", ar: "علاج بدئي منهجي: صيام، أنبوب معدي بالشفط (يريح ويقلل الاستنشاق)، إماهة وريدية سخية (قطاع ثالث)، تصحيح شوارد، مسكنات، مضادات إقياء، مسبار بولي عند الشدة" } },
      { title: { fr: "Pas d'antibiotique systématique (sauf strangulation/chirurgie) ; JAMAIS de laxatifs ni prokinétiques dans l'occlusion mécanique", ar: "لا مضاد منهجي (عدا الاختناق/الجراحة)؛ أبداً ملينات أو محركات بالانسداد الميكانيكي" } },
      { title: { fr: "ESSAI CONSERVATEUR (bridage simple, sans strangulation) : 24-48 h MAXIMUM sous surveillance (clinique, ASP) ; produit hydrosoluble (Gastrografine) diagnostique et thérapeutique — échec = chirurgie", ar: "محاولة محافظة (التصاق بسيط دون اختناق): 24-48 س كحد أقصى بمراقبة (سريرية، صورة)؛ مادة ظليلة مائية (غاستروغرافين) تشخيصية وعلاجية — فشل = جراحة" } },
      { title: { fr: "Hernie étranglée : tentative de taxis douce UNIQUEMENT si aucun signe de strangulation et < 6 h ; sinon chirurgie — ne jamais forcer", ar: "فتق مختنق: محاولة إرجاع لطيفة فقط إذا لا علامات اختناق و< 6 س؛ وإلا جراحة — لا تجبر أبداً" } },
      { title: { fr: "Pseudo-occlusion de Ogilvie (dilatation colique sans obstacle, post-op/métabolique) : correction des causes, néostigmine sous monitorage, décompression coloscopique — la perforation caecale (> 12 cm) est la menace", ar: "انسحاب أوغيلفي الكاذب (توسع قولوني بلا عائق، بعد جراحة/استقلابي): تصحيح الأسباب، نيوستيغمين بمراقبة، تخثير قولوني بالمنظار — انثقاب الأعور (> 12 سم) هو التهديد" } },
    ],
    keyPoints: [
      { fr: "Toute occlusion du grêle chez un patient SANS cicatrice abdominale = tumeur ou hernie jusqu'à preuve du contraire — le bridage n'existe que s'il y a eu chirurgie.", ar: "كل انسداد دقيق عند مريض بلا ندبة بطنية = ورم أو فتق حتى يثبت العكس — الالتصاق لا يوجد إلا بعد جراحة." },
      { fr: "Le lactate normal n'exclut pas un début de strangulation — la clinique (douleur continue, défense) déclenche le bloc avant la biologie.", ar: "لاكتات طبيعي لا يستبعد بداية اختناق — السريرة (ألم مستمر، دفاع) ترسل للصالة قبل التحاليل." },
      { fr: "Chez l'enfant : invagination aiguë (douleurs paroxystiques, « gelée de groseille ») = écho + lavement réduit ; chez l'adulte jeune sans cause : penser iléite/crohn.", ar: "عند الطفل: انغماد حاد (آلام نوبية، «هلام الكشمش») = إيكو + حقنة مرجعة؛ عند شاب بلا سبب: فكر بالتهاب لفائفي/كرون." },
    ],
    trajectory: [
      { when: { fr: "Reprise du transit à 24-48 h (gaz, selles), distension cédante", ar: "عودة العبور 24-48 س (ريح، براز)، تراجع الانتفاخ" }, do: [
        { fr: "Levée de l'occlusion : ablation de la SNG, reprise alimentaire progressive, enquête étiologique (tumeur ?).", ar: "انفراج الانسداد: نزع الأنبوب، استئناف تغذية تدريجي، تحري السبب (ورم؟)." },
      ]},
      { when: { fr: "Échec du traitement conservateur à 48 h", ar: "فشل العلاج المحافظ بـ 48 س" }, do: [
        { fr: "Chirurgie (adhésiolyse, résection selon vitalité intestinale) — au-delà de 48 h, le risque de strangulation croît chaque heure.", ar: "جراحة (فك التصاقات، استئصال حسب حيوية الأمعاء) — بعد 48 س يزداد خطر الاختناق كل ساعة." },
      ]},
      { when: { fr: "Signes de strangulation ou péritonite", ar: "علامات اختناق أو التهاب بريتوان" }, do: [
        { fr: "Bloc immédiat : résection de l'anse nécrosée, réanimation, antibiothérapie large — ne jamais temporiser.", ar: "صالة فورية: استئصال العروة المنتخرة، إنعاش، مضادات واسعة — لا تمهل أبداً." },
        { fr: "Réanimation si sepsis", ar: "إنعاش عند الإنتان" },
      ]},
    ],
    medications: ["ondansetron", "morphine", "cefotaxime", "metronidazole"],
    calculators: ["gazometrie", "qsofa"],
    meta: { sources: ["WSES ASBO 2017", "Bologna guidelines"], lastReviewed: "2026-09" },
  },
  {
    id: "traumatisme-medullaire",
    title: { fr: "Traumatisme médullaire", ar: "إصابة النخاع الشوكي" },
    category: "traumatologie",
    severity: "critical",
    summary: { fr: "Y penser devant tout traumatisé à haute énergie : douleur rachidienne, déficit, PRIAPISME, respiration abdominale. Immobilisation, PAM 85-90 mmHg, choc neurogénique (hypotension + BRADYCARDIE), PAS de corticoïdes, IRM en urgence.", ar: "اذكره أمام كل مصاب بطاقة عالية: ألم فقري، عجز، انتعاظ، تنفس بطني. تثبيت، ضغط إرواء 85-90، صدمة نخاعية (هبوط + بطء قلب)، لا كورتيزون، مرنان عاجل." },
    exams: {
      bio: [{ fr: "Groupe, NFS, bilan pré-op, gazométrie (lésion haute : hypoventilation)", ar: "زمرة، عد دم، تحضير جراحي، غازات (إصابة عالية: نقص تهوية)" }],
      img: [{ fr: "TDM de TOUT le rachis (lésions multiples fréquentes) ; IRM en URGENCE si déficit neurologique (compression, hématome, lésion ligamentaire)", ar: "طبقي لكامل العمود الفقري (إصابات متعددة شائعة)؛ مرنان عاجل عند عجز عصبي (انضغاط، ورم دموي، إصابة أربطة)" }],
    },
    steps: [
      { title: { fr: "Suspecter devant : mécanisme à haute énergie (AVP, chute, plongeon en eau peu profonde — classique en Tunisie l'été), douleur cervicale/dorsale, paresthésies, déficit moteur/sensitif, PRIAPISME (lésion médullaire jusqu'à preuve du contraire), respiration paradoxale/abdominale (lésion cervicale)", ar: "اشتبه أمام: آلية عالية الطاقة (حوادث سير، سقوط، غطس بماء ضحل — كلاسيكي صيفاً بتونس)، ألم رقبية/ظهري، مذل، عجز حركي/حسي، انتعاظ (إصابة نخاعية حتى يثبت العكس)، تنفس متناقض/بطني (إصابة رقبية)" } },
      { title: { fr: "IMMOBILISATION stricte : collier + plan dur, relevage en bloc (log-roll) — chez l'ankylosante et le sujet âgé ostéoporotique, tout rachis douloureux est fracturé jusqu'à preuve du contraire (fractures en « branche verte » très instables)", ar: "تثبيت صارم: طوق + لوح صلب، رفع بالكتلة (‏log-roll) — عند التيبس والمسن الهش، كل عمود فقري مؤلم مكسور حتى يثبت العكس (كسور «الغصن النضير» شديدة عدم الاستقرار)" } },
      { title: { fr: "CHOC NEUROGÉNIQUE (lésion ≥ T6) : hypotension + BRADYCARDIE (perte du tonus sympathique) — le distinguer du choc hypovolémique (tachycardie) ; remplissage prudent puis NORADRÉNALINE (la surcharge seule aggrave l'œdème médullaire), atropine/pacing si bradycardie symptomatique", ar: "الصدمة النخاعية (إصابة ≥ T6): هبوط + بطء قلب (فقد التوتر الودي) — ميّزها عن صدمة نقص الحجم (تسرع)؛ تعبئة حذرة ثم نورأدرينالين (الحمل الزائد وحده يفاقم الوذمة النخاعية)، أتروبين/ناظمة عند بطء عرضي" } },
      { title: { fr: "OBJECTIF PAM 85-90 mmHg pendant 5-7 jours (perfusion médullaire) — noradrénaline précoce en réanimation ; l'hypotension secondaire aggrave définitivement la lésion", ar: "الهدف ضغط إرواء متوسط 85-90 ملم ز لمدة 5-7 أيام (إرواء النخاع) — نورأدرينالين مبكر بالإنعاش؛ الهبوط الثانوي يفاقم الإصابة نهائياً" } },
      { title: { fr: "RESPIRATOIRE : lésion ≥ C3-C5 = paralysie diaphragmatique → intubation (fibroscopie si rachis instable) ; C5-T1 = toux inefficace → désencombrement, aide à la toux, monitorage de la capacité vitale ; intuber AVANT l'aggravation, pas pendant", ar: "التنفسي: إصابة ≥ C3-C5 = شلل حجابي ← تنبيب (بمنظار ليفي إذا عمود فقري غير مستقر)؛ ‏C5-T1 = سعال غير فعال ← تخليص مجرى، مساعدة سعال، مراقبة السعة الحيوية؛ نَبِّب قبل التدهور لا أثنائه" } },
      { title: { fr: "PAS de corticoïdes (méthylprednisolone) : les recommandations AANS/CNS ne soutiennent plus le protocole NASCIS — risques (infection, hyperglycémie) supérieurs au bénéfice", ar: "لا كورتيكويدات (ميثيل بريدنيزولون): توصيات AANS/CNS لم تعد تدعم بروتوكول NASCIS — المخاطر (إنتان، ارتفاع سكر) تفوق الفائدة" } },
      { title: { fr: "Transfert en neurochirurgie/centre spinal : décompression chirurgicale précoce (< 24 h) si compression avec déficit progressif ou instabilité — score ASIA documenté à l'admission ET dans les heures suivantes (valeur médico-légale et pronostique)", ar: "تحويل لجراحة الأعصاب/مركز العمود الفقري: تخفيف ضغط جراحي مبكر (< 24 س) عند انضغاط مع عجز متقدم أو عدم استقرار — سكور ASIA موثق عند الإدخال وبعده بساعات (قيمة قانونية وإنذارية)" } },
      { title: { fr: "Soins associés précoces : sondage vésical (rétention atonique), prévention thrombo-embolique (mécanique puis pharmacologique selon le délai), escarres (matelas, retournement), thermorégulation (poïkilothermie sous la lésion : ni chauffer ni refroidir excessivement)", ar: "عناية مرافقة مبكرة: قثطرة بولية (احتباس لا توتري)، وقاية خثرية (ميكانيكية ثم دوائية حسب الأجل)، قرحات ضغط (فرشة، تقليب)، تنظيم حرارة (تغير حرارة تحت الإصابة: لا تدفئة ولا تبريد مفرط)" } },
    ],
    keyPoints: [
      { fr: "Le priapisme chez un traumatisé = lésion médullaire — c'est parfois le SEUL signe chez un patient inconscient.", ar: "الانتعاظ عند مصاب = إصابة نخاعية — وأحياناً العلامة الوحيدة عند فاقد الوعي." },
      { fr: "L'absence de déficit n'exclut pas une lésion instable : le SCIWORA (lésion sans anomalie radiologique) existe chez l'enfant, et le blessé qui marche peut se paralyser au prochain mouvement si le rachis n'est pas immobilisé.", ar: "غياب العجز لا يستبعد إصابة غير مستقرة: ‏SCIWORA (إصابة بلا شذوذ شعاعي) موجود عند الأطفال، والمصاب الذي يمشي قد يصاب بالشلل بحركته التالية إذا لم يثبت عموده." },
      { fr: "Plongeon en eau peu profonde = première cause de lésion cervicale du jeune en Tunisie l'été : prévention + suspicion systématique devant tout noyé/cervicalgie après baignade.", ar: "الغطس بماء ضحل = أول سبب لإصابة رقبية عند الشباب بتونس صيفاً: وقاية + اشتباه منهجي أمام كل غريق/ألم رقبية بعد السباحة." },
    ],
    trajectory: [
      { when: { fr: "Déficit incomplet stabilisé, PAM maintenue, rachis fixé", ar: "عجز غير كامل مستقر، ضغط إرواء مضبوط، عمود مثبت" }, do: [
        { fr: "Rééducation précoce en centre spécialisé, prévention des complications (thrombose, escarres, infections urinaires), soutien psychologique — le pronostic dépend du niveau ASIA initial.", ar: "إعادة تأهيل مبكرة بمركز مختص، وقاية الاختلاطات (خثار، قرحات، إنتانات بولية)، دعم نفسي — الإنذار يتعلق بمستوى ASIA البدئي." },
      ]},
      { when: { fr: "Déficit qui s'aggrave sous observation", ar: "عجز يتدهور تحت الملاحظة" }, do: [
        { fr: "IRM en urgence + neurochirurgie : hématome épidural, aggravation de la compression — la décompression précoce est la seule chance de récupération.", ar: "مرنان عاجل + جراحة أعصاب: ورم دموي فوق الجافية، تفاقم الانضغاط — التخفيف المبكر فرصة الشفاء الوحيدة." },
      ]},
      { when: { fr: "Détresse respiratoire (lésion cervicale, capacité vitale qui chute)", ar: "ضائقة تنفسية (إصابة رقبية، سعة حيوية تهبط)" }, do: [
        { fr: "Intubation sans attendre l'arrêt (fibroscopie, rachis en position neutre) — voir protocole de réanimation.", ar: "تنبيب دون انتظار التوقف (بمنظار ليفي، العمود بوضع محايد) — انظر بروتوكول الإنعاش." },
        { fr: "Protocole polytraumatisme (voies aériennes difficiles)", ar: "بروتوكول متعدد الإصابات (مجرى هوائي صعب)" },
      ]},
    ],
    medications: ["noradrenaline", "atropine", "paracetamol"],
    calculators: ["gcs", "transfusion"],
    meta: { sources: ["AANS/CNS 2013", "ERSCI guidelines"], lastReviewed: "2026-09" },
  },
];

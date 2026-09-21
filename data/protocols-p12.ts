// v8.4 — Phase 12 : urologie courante (colique néphrétique, pyélonéphrite, RAU), cardio
// (péricardite, endocardite), métabolique (HHS), pédiatrie (invagination), digestif
// (hémorragie digestive basse, perforation/péritonite), toxico (alcool aigu).
import type { Protocol } from "./types";

export const protocolsPhase12: Protocol[] = [
  {
    id: "colique-nephretique",
    title: { fr: "Colique néphrétique", ar: "المغص الكلوي" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "Douleur lombaire unilatérale brutale irradiant vers la fosse iliaque/les organes génitaux, sans position antalgique. AINS en 1re ligne (kétoprofène), PAS d'hyperhydratation pendant la crise. TDM sans injection = référence. Signes de gravité = fièvre/anurie = urgence.", ar: "ألم قطني وحيد الجانب مفاجئ يشع للحفرة الحرقفية/الأعضاء التناسلية، بلا وضعية مريحة. مضادات الالتهاب بالخط الأول (كيتوبروفين)، لا إفراط بالإماهة أثناء النوبة. الطبقي دون حقن = المرجع. علامات الخطورة = حمى/لانقطاع بول = طوارئ." },
    exams: {
      bio: [{ fr: "Bandelette urinaire (hématurie présente dans ~85 %, son absence n'exclut pas), créatinine, NFS, CRP, ECBU si fièvre", ar: "شريط بولي (دم بولي ~85%، غيابه لا يستبعد)، كرياتينين، عد دم، ‏CRP، زرع بول عند الحمى" }],
      img: [{ fr: "Échographie rénale (dilatation, gros calcul) en 1re intention ; TDM abdominale SANS injection = référence (sensibilité > 95 %) si doute ou complications", ar: "إيكو كلوي (توسع، حصاة كبيرة) بالخط الأول؛ طبقي بطن دون حقن = المرجع (حساسية > 95%) عند الشك أو الاختلاطات" }],
    },
    steps: [
      { title: { fr: "Clinique : douleur lombaire FLANC unilatérale, brutale, irradiant vers la FID/les organes génitaux, agitation (le patient ne trouve AUCUNE position — contrairement à la péritonite), nausées/vomissements", ar: "السريرة: ألم قطني خاصرة وحيد الجانب، مفاجئ، يشع للحفرة الحرقفية/الأعضاء التناسلية، هياج (لا يجد أي وضعية مريحة — عكس البريتوان)، غثيان/تقيؤ" } },
      { title: { fr: "AINS EN PREMIÈRE LIGNE : kétoprofène 100 mg IV lente (ou IM) — supérieur aux opioïdes sur la douleur et les récidives ; contre-indications : insuffisance rénale, ulcère, grossesse (à partir du 6e mois : JAMAIS d'AINS)", ar: "مضادات الالتهاب بالخط الأول: كيتوبروفين 100 ملغ وريدي بطيء (أو عضلي) — يتفوق على الأفيونيات بالألم والنكس؛ الموانع: قصور كلوي، قرحة، الحمل (من الشهر 6: أبداً مضادات التهاب)" } },
      { title: { fr: "Échec/CI des AINS : morphine titrée 2-5 mg IV ; néfrolithiase + morphine = surveiller la rétention urinaire", ar: "فشل/موانع مضادات الالتهاب: مورفين معاير 2-5 ملغ وريدي؛ حصيات + مورفين = راقب احتباس البول" } },
      { title: { fr: "PAS d'hyperhydratation pendant la crise douloureuse (aggrave la douleur par distension) — hydratation normale à volonté, « boire 2-3 L/j » est pour APRÈS", ar: "لا إفراط بالإماهة أثناء نوبة الألم (يفاقم الألم بالتمدد) — إماهة طبيعية عند الرغبة، «اشرب 2-3 ل/ي» لما بعد النوبة" } },
      { title: { fr: "SIGNES DE GRAVITÉ = hospitalisation urgente : FIÈVRE (pyélonéphrite obstructive = urgence urologique absolue : drainage), rein unique, anurie/insuffisance rénale, douleur rebelle, femme enceinte", ar: "علامات الخطورة = إدخال عاجل: حمى (التهاب حويضة انسدادي = طوارئ مسالك مطلقة: تصريف)، كلية وحيدة، لانقطاع بول/قصور كلوي، ألم عنيد، حامل" } },
      { title: { fr: "Traitement expulsif médical (calcul urétéral distal 5-10 mm) : tamsulosine 0,4 mg/j × 2-4 semaines + antalgie à la demande — facilite l'expulsion de ~30 %", ar: "علاج طارد طبي (حصاة حالبية قاصية 5-10 مم): تامسولوسين 0.4 ملغ/ي × 2-4 أسابيع + تسكين عند الطلب — يسهل الخروج بـ ~30%" } },
      { title: { fr: "Filtrer les urines (analyse du calcul = prévention), consignes de retour (fièvre, anurie, douleur incontrôlable), suivi urologique selon taille/siège", ar: "صفِّ البول (تحليل الحصاة = وقاية)، تعليمات عودة (حمى، لانقطاع بول، ألم غير مضبوط)، متابعة مسالك حسب الحجم/الموقع" } },
    ],
    keyPoints: [
      { fr: "Tunisie : climat chaud + déshydratation estivale = incidence élevée de lithiase ; la récidive à 5 ans dépasse 50 % sans mesures hygiéno-diététiques (eau, sel, protéines animales).", ar: "تونس: مناخ حار + تجفاف صيفي = وقوع عالٍ للحصيات؛ النكس بـ 5 سنوات يتجاوز 50% دون تدابير حمية (ماء، ملح، بروتين حيواني)." },
      { fr: "Colique néphrétique + fièvre = PYÉLONÉPHRITE OBSTRUCTIVE jusqu'à preuve du contraire : le rein bloqué et infecté se détruit en heures — drainage (sonde JJ ou néphrostomie) sans attendre.", ar: "مغص كلوي + حمى = التهاب حويضة انسدادي حتى يثبت العكس: الكلية المسدودة المعنتنة تتدمر بالساعات — تصريف (مسبار JJ أو فغر كلوي) دون انتظار." },
      { fr: "Les diagnostics à ne pas manquer derrière une « colique » : anévrisme de l'aorte rompu (> 60 ans, douleur déchirante), GEU (femme en âge de procréer = β-hCG), torsion testiculaire/annexielle, infarctus rénal.", ar: "تشخيصات لا تُفوَّت خلف «مغص»: أم دم أبهرية متمزقة (> 60 سنة، ألم ممزق)، حمل خارج الرحم (امرأة بعمر الإنجاب = هرمون حمل)، التفاف خصية/ملحق، احتشاء كلوي." },
    ],
    trajectory: [
      { when: { fr: "Douleur cédante, calcul < 5 mm proximal ou expulsé", ar: "تراجع الألم، حصاة < 5 مم قريبة أو خرجت" }, do: [
        { fr: "Sortie avec tamsulosine, analgésie, hyperhydratation À DISTANCE, filtration des urines, contrôle écho à 2-4 semaines.", ar: "خروج مع تامسولوسين، تسكين، إفراط إماهة لاحقاً، تصفية البول، إيكو مراقب 2-4 أسابيع." },
      ]},
      { when: { fr: "Fièvre + frissons sur colique", ar: "حمى + قشعريرة مع المغص" }, do: [
        { fr: "Pyélonéphrite obstructive : hémocultures, antibiotique IV, DRAINAGE urologique en urgence — ne jamais temporiser.", ar: "التهاب حويضة انسدادي: مزارع دم، مضاد وريدي، تصريف مسالك عاجل — لا تمهل أبداً." },
        { fr: "Protocole pyélonéphrite aiguë", ar: "بروتوكول التهاب الحويضة والكلية الحاد" },
      ]},
      { when: { fr: "Anurie, créatinine qui monte, rein unique", ar: "لانقطاع بول، كرياتينين يصعد، كلية وحيدة" }, do: [
        { fr: "Obstruction bilatérale ou sur rein unique : néphrologue/urologue en urgence, drainage, surveillance du syndrome de levée d'obstacle (polyurie massive).", ar: "انسداد ثنائي أو بكلية وحيدة: كلى/مسالك عاجل، تصريف، مراقبة متلازمة رفع الانسداد (كثرة إدرار كثيفة)." },
      ]},
    ],
    medications: ["ketoprofene", "morphine", "tamsulosine", "ondansetron"],
    calculators: ["colique", "dose-poids"],
    meta: { sources: ["EAU urolithiasis 2023", "AFU"], lastReviewed: "2026-09" },
  },
  {
    id: "pyelonephrite-aigue",
    title: { fr: "Pyélonéphrite aiguë", ar: "التهاب الحويضة والكلية الحاد" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "Fièvre + frissons + douleur lombaire ± signes urinaires = ECBU AVANT l'antibiotique, puis antibiothérapie probabiliste immédiate (céfotaxime ou fluoroquinolone). Forme grave/urosepsis : réanimation + drainage si obstacle. Contexte tunisien : prévalence élevée de BMR.", ar: "حمى + قشعريرة + ألم قطني ± علامات بولية = زرع بول قبل المضاد، ثم مضاد تجريبي فوري (سيفوتاكسيم أو فلوروكينولون). الشكل الشديد/إنتان بولي: إنعاش + تصريف عند الانسداد. السياق التونسي: انتشار عالٍ للجراثيم المقاومة." },
    exams: {
      bio: [{ fr: "ECBU AVANT la 1re dose d'antibiotique (mais ne pas retarder l'ATB si grave), hémocultures si fièvre ≥ 38,5 ou frissons, NFS, CRP, créatinine, lactate si signes de sepsis", ar: "زرع بول قبل الجرعة الأولى (لكن لا تؤخر المضاد إذا شديد)، مزارع دم عند حمى ≥ 38.5 أو قشعريرة، عد دم، ‏CRP، كرياتينين، لاكتات عند علامات إنتان" }],
      img: [{ fr: "Échographie rénale systématique (obstacle ? abcès ?) ; TDM injectée si forme grave, doute diagnostique, ou absence d'amélioration à 72 h", ar: "إيكو كلوي منهجي (انسداد؟ خراج؟)؛ طبقي محقون عند الشكل الشديد أو الشك أو غياب التحسن بـ 72 س" }],
    },
    steps: [
      { title: { fr: "Tableau : fièvre élevée + FRISONS + douleur lombaire unilatérale (contact lombaire douloureux), signes urinaires INCONSTANTS (la cystite peut être absente) ; sujet âgé : tableau trompeur (confusion, chute, hypothermie)", ar: "اللوحة: حمى عالية + قشعريرة + ألم قطني وحيد الجانب (جس قطني مؤلم)، علامات بولية غير ثابتة (قد يغيب التهاب المثانة)؛ المسن: لوحة خادعة (تخليط، سقوط، انخفاض حرارة)" } },
      { title: { fr: "ECBU puis ANTIBIOTHÉRAPIE PROBABILISTE immédiate (dans l'heure si sepsis) : céfotaxime 1-2 g IV/8 h OU fluoroquinolone (ciprofloxacine 400 mg IV/12 h) si pas utilisée dans les 6 mois — adapter à l'antibiogramme dès 48-72 h", ar: "زرع بول ثم مضاد تجريبي فوري (خلال ساعة عند الإنتان): سيفوتاكسيم 1-2 غ وريدي/8 س أو فلوروكينولون (سيبروفلوكساسين 400 ملغ وريدي/12 س) إذا لم يستعمل بـ 6 أشهر — كيّف حسب المضاد الحيوي بـ 48-72 س" } },
      { title: { fr: "Contexte tunisien : forte prévalence de BLSE (E. coli producteurs de bêta-lactamases à spectre étendu) — en cas d'ATCD de BMR ou de séjour hospitalier récent, discuter un carbapénème d'emblée avec l'infectiologue", ar: "السياق التونسي: انتشار عالٍ لـ BLSE (إيشريشيا كوليا مفرزة لإنزيمات واسعة الطيف) — عند سوابق جراثيم مقاومة أو إقامة مستشفى حديثة، ناقش كاربابينيم منذ البدء مع مختص الأمراض الإنتانية" } },
      { title: { fr: "Forme GRAVE (sepsis, choc) : réanimation (remplissage, vasopresseurs), hémocultures ×2, ATB dans l'heure, ÉCHO en urgence à la recherche d'un OBSTACLE", ar: "الشكل الشديد (إنتان، صدمة): إنعاش (تعبئة، مقويات أوعية)، مزارع دم × 2، مضاد خلال ساعة، إيكو عاجل بحثاً عن انسداد" } },
      { title: { fr: "PYÉLONÉPHRITE OBSTRUCTIVE (calcul + infection) : urgence urologique ABSOLUE — drainage par sonde JJ ou néphrostomie + ATB ; l'antibiotique seul ne stérilise pas un pyélon sous tension", ar: "التهاب حويضة انسدادي (حصاة + إنتان): طوارئ مسالك مطلقة — تصريف بمسبار JJ أو فغر كلوي + مضاد؛ المضاد وحده لا يعقم حويضة مضغوطة" } },
      { title: { fr: "Hospitalisation : forme grave, femme enceinte, homme (prostatite associée fréquente), sujet âgé fragile, immunodéprimé, diabète déséquilibré, vomissements incoercibles ; sinon traitement ambulatoire possible avec suivi à 72 h", ar: "الإدخال: الشكل الشديد، حامل، رجل (التهاب بروستات مرافق شائع)، مسن هش، مكبوت مناعة، سكري غير مضبوط، تقيؤ مستمر؛ وإلا علاج خارجي ممكن بمتابعة 72 س" } },
      { title: { fr: "Durée totale 7-14 jours selon l'évolution et le germe ; contrôle ECBU inutile si évolution favorable (sauf grossesse et homme)", ar: "المدة الكلية 7-14 يوماً حسب التطور والجرثوم؛ زرع بول مراقب غير مجدٍ إذا تطور جيد (عدا الحامل والرجل)" } },
    ],
    keyPoints: [
      { fr: "Une pyélonéphrite sans fièvre existe (sujet âgé, immunodéprimé) — confusion isolée + BU positive chez une personne âgée = évoquer la PNA avant de conclure à un « simple » portage.", ar: "يوجد التهاب حويضة دون حمى (مسن، مكبوت مناعة) — تخليط معزول + شريط بولي إيجابي عند مسن = اذكر التهاب الحويضة قبل الاستنتاج «حمل جرثومي بسيط»." },
      { fr: "Chez l'HOMME, toute PNA est compliquée par définition (prostatite associée dans la majorité) : durée 14 jours minimum, fluoroquinolone ou cotrimoxazole préférés (diffusion prostatique).", ar: "عند الرجل، كل التهاب حويضة معقد بالتعريف (التهاب بروستات مرافق غالباً): المدة 14 يوماً على الأقل، فلوروكينولون أو كوتريموكسازول مفضل (نفوذ بروستاتي)." },
      { fr: "Absence d'amélioration à 72 h = abcès rénal, obstacle méconnu ou germe résistant — TDM injectée, ne pas « changer l'antibiotique à l'aveugle ».", ar: "غياب التحسن بـ 72 س = خراج كلوي، انسداد مجهول، أو جرثوم مقاوم — طبقي محقون، لا «تغير المضاد أعمى»." },
    ],
    trajectory: [
      { when: { fr: "Apyrexie à 48-72 h, douleur cédante, CRP en baisse", ar: "بلا حمى 48-72 س، تراجع الألم، ‏CRP هابط" }, do: [
        { fr: "Relais PO sur antibiogramme, durée totale 7-14 j, hydratation, ECBU de contrôle seulement si grossesse/homme/échec.", ar: "تحويل فموي حسب المضاد الحيوي، المدة الكلية 7-14 يوماً، إماهة، زرع بول مراقب فقط بحمل/رجل/فشل." },
      ]},
      { when: { fr: "Fièvre persistante à 72 h", ar: "حمى مستمرة بـ 72 س" }, do: [
        { fr: "TDM injectée : abcès (drainage), obstacle (sonde JJ), résistance (adapter ATB) — réévaluation urologique.", ar: "طبقي محقون: خراج (تصريف)، انسداد (مسبار JJ)، مقاومة (تكييف المضاد) — إعادة تقييم مسالك." },
      ]},
      { when: { fr: "Choc septique, marbrures, oligurie", ar: "صدمة إنتانية، تبرقش، قلة إدرار" }, do: [
        { fr: "Urosepsis : réanimation septique + drainage de l'obstacle en urgence — la source control prime sur tout.", ar: "إنتان بولي: إنعاش إنتاني + تصريف الانسداد عاجلاً — ضبط البؤرة قبل كل شيء." },
        { fr: "Protocole choc septique", ar: "بروتوكول الصدمة الإنتانية" },
      ]},
    ],
    medications: ["cefotaxime", "ciprofloxacine", "paracetamol"],
    calculators: ["qsofa", "gazometrie"],
    meta: { sources: ["SPILF PNA 2018", "EAU urological infections"], lastReviewed: "2026-09" },
  },
  {
    id: "retention-aigue-urine",
    title: { fr: "Rétention aiguë d'urine (RAU)", ar: "الاحتباس البولي الحاد" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "Globe vésical douloureux + impossibilité d'uriner = sondage sans délai (décompression PROGRESSIVE si > 1 L). Chercher la cause (HBP, médicament anticholinergique, fécalome, neurologique). Surveiller la polyurie post-obstructive.", ar: "مثانة منتفخة مؤلمة + استحالة تبول = قثطرة دون تأخير (تفريغ تدريجي إذا > 1 لتر). ابحث عن السبب (تضخم بروستات، دواء مضاد كولين، انحشار براز، عصبي). راقب كثرة الإدرار بعد رفع الانسداد." },
    exams: {
      bio: [{ fr: "Créatinine (retentissement rénal), ionogramme, ECBU, PSA À DISTANCE (jamais en aigu — faux élevés)", ar: "كرياتينين (تأثير كلوي)، شوارد، زرع بول، ‏PSA لاحقاً (أبداً بالحاد — ارتفاع كاذب)" }],
      img: [{ fr: "Échographie vésicale (volume pré-sondage) et rénale (dilatation du haut appareil = retention chronique décompensée)", ar: "إيكو مثانة (الحجم قبل القثطرة) وكلوي (توسع الجهاز العلوي = احتباس مزمن معوض)" }],
    },
    steps: [
      { title: { fr: "Diagnostic : impossibilité douloureuse d'uriner + GLOBE VÉSICAL (matité sus-pubienne, masse arrondie) ; l'échographie bladder-scan confirme (volume > 300-500 mL)", ar: "التشخيص: استحالة تبول مؤلمة + مثانة منتفخة (إصمام فوق العانة، كتلة دائرية)؛ الإيكو يؤكد (حجم > 300-500 مل)" } },
      { title: { fr: "SONDAGE VÉSICAL sans délai : sonde 14-16 Ch ; si échec (sténose, faux trajet, prostate volumineuse) : sonde de Couvelier/tiemann par l'urologue, puis cystostomie sus-pubienne si nécessaire — ne jamais forcer", ar: "قثطرة بولية دون تأخير: مسبار 14-16 ش؛ عند الفشل (تضيق، مجرى كاذب، بروستات ضخمة): مسبار كوفيلير/تيمن بيد جراح المسالك، ثم فغر فوق العانة عند الحاجة — لا تجبر أبداً" } },
      { title: { fr: "DÉCOMPRESSION PROGRESSIVE si volume > 1000 mL : clampage par tranches de 500 mL toutes les 5-10 min (l'hématurie ex-vacuo et le malaise vagal sont des risques de la vidange brutale)", ar: "تفريغ تدريجي إذا الحجم > 1000 مل: إقفال على دفعات 500 مل كل 5-10 د (البيلة الدموية بعد التفريغ والدوار المبهمي خطران للتفريغ المفاجئ)" } },
      { title: { fr: "Chercher la CAUSE : HBP (homme > 50 ans, gouttes retardataires), médicaments ANTICHOLINERGIQUES (antihistaminiques, antidépresseurs, neuroleptiques, antispasmodiques — les réviser !), fécalome, post-opératoire, neurologique (sclérose en plaques, queue de cheval)", ar: "ابحث عن السبب: تضخم بروستات (رجل > 50، تقطيع)، أدوية مضادة للكولين (مضادات هستامين، اكتئاب، ذهانية، مضادات تشنج — راجعها!)، انحشار براز، بعد جراحة، عصبي (تصلب لويحي، ذيل الفرس)" } },
      { title: { fr: "SIGNES D'ALERTE queue de cheval : RAU + anesthésie en selle + déficit des membres inférieurs + lombalgie = IRM médullaire EN URGENCE (compression chirurgicale)", ar: "علامات إنذار ذيل الفرس: احتباس + فقدان حس السرج + عجز بالطرفين السفليين + ألم قطني = مرنان نخاعي عاجل (انضغاط جراحي)" } },
      { title: { fr: "Laisser la sonde à demeure avec collecte, quantifier la diurèse horaire ; alpha-bloquant (tamsulosine) avant l'épreuve de désondage chez l'HBP (double les chances de succès)", ar: "اترك المسبار مع تجميع، قسّ الإدرار بالساعة؛ حاصر ألفا (تامسولوسين) قبل اختبار النزع بتضخم البروستات (يضاعف فرص النجاح)" } },
      { title: { fr: "POLYURIE POST-OBSTRUCTIVE (> 200-300 mL/h) : compensation hydrique adaptée (risque de déshydratation et de troubles ioniques), surveillance ionogramme/créatinine — fréquente après RAU chronique décompensée", ar: "كثرة الإدرار بعد رفع الانسداد (> 200-300 مل/س): تعويض مائي مكيف (خطر تجفاف واضطراب شوارد)، مراقبة شوارد/كرياتينين — شائعة بعد احتباس مزمن معوض" } },
    ],
    keyPoints: [
      { fr: "La RAU « simple » de l'homme âgé est souvent déclenchée par un médicament anticholinergique ajouté récemment ou un antihistaminique en automédication — la question « quel nouveau médicament ? » résout la moitié des cas.", ar: "الاحتباس «البسيط» عند المسن يحرضه غالباً دواء مضاد كولين مضاف حديثاً أو مضاد هستامين ذاتي — سؤال «أي دواء جديد؟» يحل نصف الحالات." },
      { fr: "Une RAU sans globe douloureux chez le diabétique/neurologique = rétention chronique décompensée : volumes énormes (> 1 L), risque rénal réel — la décompression progressive et la surveillance de la polyurie sont capitales.", ar: "احتباس دون مثانة مؤلمة عند السكري/العصبي = احتباس مزمن معوض: أحجام ضخمة (> 1 لتر)، خطر كلوي حقيقي — التفريغ التدريجي ومراقبة كثرة الإدرار حاسمان." },
      { fr: "Le PSA en phase aiguë est ininterprétable (faussement élevé) — le refaire à 4-6 semaines si indication.", ar: "‏PSA بالمرحلة الحادة غير قابل للتفسير (مرتفع كذباً) — أعد قياسه بعد 4-6 أسابيع إذا استطباب." },
    ],
    trajectory: [
      { when: { fr: "Sondage réussi, diurèse < 200 mL/h, cause réversible identifiée", ar: "قثطرة ناجحة، إدرار < 200 مل/س، سبب قابل للعكس" }, do: [
        { fr: "Épreuve de désondage à 24-72 h sous tamsulosine (HBP), arrêt des anticholinergiques, surveillance des résidus post-mictionnels.", ar: "اختبار نزع بـ 24-72 س تحت تامسولوسين (تضخم بروستات)، إيقاف مضادات الكولين، مراقبة البواقي بعد التبول." },
      ]},
      { when: { fr: "Polyurie > 300 mL/h persistante", ar: "كثرة إدرار > 300 مل/س مستمرة" }, do: [
        { fr: "Syndrome de levée d'obstacle : compensation IV à 70-80 % de la diurèse, ionogramme × 2/j, hospitalisation jusqu'à stabilisation.", ar: "متلازمة رفع الانسداد: تعويض وريدي بـ 70-80% من الإدرار، شوارد مرتين يومياً، إدخال حتى الاستقرار." },
      ]},
      { when: { fr: "RAU + déficit neurologique des membres inférieurs", ar: "احتباس + عجز عصبي بالطرفين السفليين" }, do: [
        { fr: "Syndrome de la queue de cheval : IRM en urgence absolue + neurochirurgie — chaque heure compte pour la récupération sphinctérienne.", ar: "متلازمة ذيل الفرس: مرنان بطوارئ مطلقة + جراحة أعصاب — كل ساعة محسوبة لاستعادة وظيفة المعصرة." },
        { fr: "Principes de prise en charge médullaire urgente", ar: "مبادئ تدبير طارئ نخاعي" },
      ]},
    ],
    medications: ["tamsulosine"],
    calculators: ["raaf", "dose-poids"],
    meta: { sources: ["AFU RAU", "EAU guidelines"], lastReviewed: "2026-09" },
  },
  {
    id: "pericardite-aigue",
    title: { fr: "Péricardite aiguë", ar: "التهاب التامور الحاد" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "Douleur thoracique positionnelle (soulagée en se penchant en avant) + frottement + sus-décalage ST diffus concave. Aspirine + COLCHICINE (prévient les récidives). Éliminer tamponnade, SCA, EP. Tunisie : penser à la tuberculose.", ar: "ألم صدري وضعي (يتحسن بالانحناء للأمام) + احتكاك + ارتفاع ST منتشر مقعر. أسبرين + كولشيسين (يمنع النكس). استبعد الاندحاس، الاحتشاء، الصمة. تونس: اذكر السل." },
    exams: {
      bio: [{ fr: "Troponine (élévation = myopéricardite), CRP, NFS, créatinine, TSH ; bilan étiologique orienté (IDR/Quantiferon si contexte TB, sérologies)", ar: "تروبونين (الارتفاع = التهاب تامور-عضلة)، ‏CRP، عد دم، كرياتينين، ‏TSH؛ تحري سببي موجه (تفاعل سليني/كوانتيفيرون عند سياق السل، مصليات)" }],
      img: [{ fr: "ECG (sus-ST diffus CONCAVE avec sous-décalage PR — le frottement est pathognomonique mais transitoire), échocardiographie SYSTÉMATIQUE (épanchement ? tamponnade ?)", ar: "تخطيط (ارتفاع ST منتشر مقعر مع انخفاض PR — الاحتكاك مرضي المظهر لكنه عابر)، إيكو قلب منهجي (انصباب؟ اندحاس؟)" }],
    },
    steps: [
      { title: { fr: "Douleur thoracique POSITIONNELLE : intense, rétrosternale, irradiant aux trapèzes, SOULAGÉE en se penchant en avant, majorée en décubitus/inspiration — le signe le plus évocateur", ar: "ألم صدري وضعي: شديد، خلف القص، يشع للعضلة شبه المنحرفة، يتحسن بالانحناء للأمام، يزداد بالاستلقاء/الشهيق — أكثر العلامات إيحائية" } },
      { title: { fr: "Diagnostic = 2 critères sur 4 : douleur typique, frottement péricardique, ECG évocateur (sus-ST diffus concave/sous-PR), épanchement péricardique à l'écho", ar: "التشخيص = معياران من 4: ألم نمطي، احتكاك تاموري، تخطيط موحي (ارتفاع ST منتشر مقعر/انخفاض PR)، انصباب تاموري بالإيكو" } },
      { title: { fr: "ÉLIMINER D'ABORD les urgences mimiques : SCA (troponine, ECG dynamique — le sus-ST de la péricardite est diffus et concave, sans miroir), embolie pulmonaire, dissection, tamponnade", ar: "استبعد أولاً الطوارئ المقلدة: احتشاء (تروبونين، تخطيط ديناميكي — ارتفاع التامور منتشر مقعر بلا مرآة)، صمة رئوية، تسلخ، اندحاس" } },
      { title: { fr: "TRAITEMENT : ASPIRINE 750 mg-1 g/8 h (décroissante sur 2-4 semaines) + COLCHICINE 0,5 mg × 2/j pendant 3 mois — la colchicine divise par 2 les récidives ; gastroprotection associée", ar: "العلاج: أسبرين 750 ملغ-1 غ/8 س (متناقص على 2-4 أسابيع) + كولشيسين 0.5 ملغ × 2/ي لمدة 3 أشهر — الكولشيسين يخفض النكس للنصف؛ حماية معدية مرافقة" } },
      { title: { fr: "Éviter les AINS non aspirine et SURTOUT les corticoïdes en 1re intention (favorisent les récidives) — corticoïdes réservés aux formes auto-immunes/réfractaires", ar: "تجنب مضادات الالتهاب غير الأسبرين وخصوصاً الكورتيزون بالخط الأول (يشجع النكس) — الكورتيزون للأشكال المناعية/المقاومة فقط" } },
      { title: { fr: "HOSPITALISER si signes de mauvais pronostic : fièvre > 38,5, épanchement abondant, tamponnade, immunodépression, trauma, anticoagulants, troponine élevée, échec du traitement à 7 j", ar: "أدخل عند علامات إنذار سيئ: حمى > 38.5، انصباب غزير، اندحاس، كبت مناعة، رض، مضادات تخثر، تروبونين مرتفع، فشل العلاج بـ 7 أيام" } },
      { title: { fr: "Étiologies : virale/idiopathique (majorité), TUBERCULEUSE (endémique en Tunisie — épanchement abondant, sueurs nocturnes, altération de l'état général : ponction/biopsie péricardique), post-SCA, auto-immune, urémique, néoplasique", ar: "الأسباب: فيروسية/مجهولة (الأغلب)، سلّية (متوطنة بتونس — انصباب غزير، تعرق ليلي، وهن: بزل/خزعة تامورية)، بعد احتشاء، مناعية، يوريميائية، ورمية" } },
    ],
    keyPoints: [
      { fr: "Péricardite + troponine élevée = MYOPÉRICARDITE : repos sportif strict 3 mois, IRM cardiaque de contrôle — le pronostic reste bon mais le risque rythmique impose la prudence.", ar: "التهاب تامور + تروبونين مرتفع = التهاب تامور-عضلة: راحة رياضية صارمة 3 أشهر، مرنان قلبي مراقب — الإنذار جيد لكن الخطر النظمي يفرض الحذر." },
      { fr: "Toute péricardite à épanchement abondant en Tunisie = discuter la TB avant de conclure au viral — le retard de traitement antituberculeux grève le pronostic (constriction).", ar: "كل التهاب تامور بانصباب غزير بتونس = ناقش السل قبل الاستنتاج الفيروسي — تأخير العلاج المضاد للسل يسيء الإنذار (تقبض)." },
      { fr: "La récidive (15-30 %) se prévient par la colchicine et la DÉCROISSANCE LENTE des AINS — l'arrêt brutal est la première cause de rechute.", ar: "النكس (15-30%) يُمنع بالكولشيسين والتخفيض البطيء لمضادات الالتهاب — الإيقاف المفاجئ أول سبب للانتكاس." },
    ],
    trajectory: [
      { when: { fr: "Douleur cédante à 48-72 h, CRP en baisse, pas de signe de gravité", ar: "تراجع الألم 48-72 س، ‏CRP هابط، بلا علامات خطورة" }, do: [
        { fr: "Poursuite ambulatoire : AINS décroissants + colchicine 3 mois, contrôle CRP à J7, consignes de retour (dyspnée, syncope).", ar: "متابعة خارجية: مضادات التهاب متناقصة + كولشيسين 3 أشهر، ‏CRP مراقب باليوم 7، تعليمات عودة (ضيق نفس، إغماء)." },
      ]},
      { when: { fr: "Épanchement qui augmente, signes de tamponnade naissante", ar: "انصباب يزداد، علامات اندحاس بادئة" }, do: [
        { fr: "Écho rapprochée, hospitalisation cardiologie, péricardiocentèse si tamponnade — ne jamais sortir sur un épanchement évolutif.", ar: "إيكو لصيق، إدخال قلبية، بزل تامور عند الاندحاس — لا إخراج مع انصباب متطور." },
        { fr: "Protocole tamponnade cardiaque", ar: "بروتوكول الاندحاس القلبي" },
      ]},
      { when: { fr: "Récidives multiples sous traitement bien conduit", ar: "نكسات متعددة رغم علاج صحيح" }, do: [
        { fr: "Péricardite récidivante : rechercher une cause (auto-immune, TB, néoplasique), discuter corticoïdes à faible dose/anakinra avec le cardiologue.", ar: "التهاب تامور ناكس: ابحث عن سبب (مناعي، سل، ورمي)، ناقش كورتيزون بجرع منخفضة/أناكينرا مع طبيب القلب." },
      ]},
    ],
    medications: ["aspirine", "colchicine", "paracetamol"],
    calculators: ["qtc", "gazometrie"],
    meta: { sources: ["ESC pericardial diseases 2015"], lastReviewed: "2026-09" },
  },
  {
    id: "endocardite-infectieuse",
    title: { fr: "Endocardite infectieuse", ar: "التهاب الشغاف الإنتاني" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Fièvre prolongée + souffle nouveau/valvulopathie = hémocultures ×3 AVANT tout antibiotique + échocardiographie. Critères de Duke. Antibiothérapie prolongée IV, chirurgie si insuffisance cardiaque/abcès/embolies. Tunisie : valvulopathies rhumatismales fréquentes.", ar: "حمى مطولة + نفخة جديدة/اعتلال صمامي = مزارع دم × 3 قبل أي مضاد + إيكو قلب. معايير دوك. مضادات مطولة وريدية، جراحة عند قصور قلبي/خراج/صمات. تونس: اعتلالات صمامية رثوية شائعة." },
    exams: {
      bio: [{ fr: "HÉMOCULTURES ×3 à 30 min d'intervalle AVANT tout antibiotique (la clé du pronostic), NFS, CRP, créatinine, ECBU, sérologies si hémocultures négatives (Coxiella — élevage, Bartonella)", ar: "مزارع دم × 3 بفواصل 30 د قبل أي مضاد (مفتاح الإنذار)، عد دم، ‏CRP، كرياتينين، زرع بول، مصليات عند سلبية المزارع (كوكسيلا — تربية حيوانية، بارتونيلا)" }],
      img: [{ fr: "ETT puis ETO (sensibilité supérieure) : végétation, abcès, désinsertion prothétique ; TDM cérébrale si signes neurologiques (emboles)", ar: "إيكو عبر الصدر ثم عبر المريء (حساسية أعلى): نباتات، خراج، انفكاك صمام اصطناعي؛ طبقي دماغي عند علامات عصبية (صمات)" }],
    },
    steps: [
      { title: { fr: "Y penser devant : fièvre prolongée inexpliquée + cardiopathie à risque (valvulopathie RHUMATISMALE — fréquente en Tunisie, prothèse, cardiopathie congénitale), ou fièvre + souffle nouveau, ou sepsis à germe typique (S. aureus, streptocoques, entérocoques)", ar: "اذكره أمام: حمى مطولة غير مفسرة + مرض قلب (اعتلال صمامي رثوي — شائع بتونس، صمام اصطناعي، تشوه خلقي)، أو حمى + نفخة جديدة، أو إنتان بجرثوم نمطي (عنقوديات ذهبية، عقديات، معويات)" } },
      { title: { fr: "HÉMOCULTURES ×3 (périphériques, à 30 min d'intervalle) AVANT tout antibiotique — sauf choc septique (ATB immédiate après les prélèvements) ; un antibiotique donné avant = hémocultures négativées et diagnostic perdu", ar: "مزارع دم × 3 (محيطية، بفواصل 30 د) قبل أي مضاد — عدا الصدمة الإنتانية (مضاد فوري بعد السحب)؛ مضاد معطى قبل = مزارع سلبية وتشخيص ضائع" } },
      { title: { fr: "ÉCHOCARDIOGRAPHIE : ETT d'abord, ETO systématique si prothèse ou ETT négative avec forte suspicion — végétation, abcès annulaire, nouvelle fuite", ar: "إيكو القلب: عبر الصدر أولاً، عبر المريء منهجي عند صمام اصطناعي أو سلبية الأول مع شك قوي — نباتات، خراج حول الحلقة، قلس جديد" } },
      { title: { fr: "CRITÈRES DE DUKE modifiés : 2 majeurs (hémocultures typiques + imagerie positive) = endocardite certaine ; l'examen des extrémités (faux panaris d'Osler, taches de Janeway, hémorragies en flammèche) et le fond d'œil complètent", ar: "معايير دوك المعدلة: معياران كبيران (مزارع نمطية + تصوير إيجابي) = التهاب شغاف مؤكد؛ فحص الأطراف (العقد الأوسلرية، بقع جانواي، نزوف لهيبية) وقاع العين يكملان" } },
      { title: { fr: "ANTIBIOTHÉRAPIE IV prolongée (4-6 semaines) adaptée au germe ; empirique si grave : céfotaxime/vancomycine ± gentamicine selon le contexte (prothèse, porte d'entrée) — décision infectiologue", ar: "مضادات وريدية مطولة (4-6 أسابيع) مكيفة حسب الجرثوم؛ تجريبية إذا شديد: سيفوتاكسيم/فانكومايسين ± جنتامايسين حسب السياق (صمام اصطناعي، مدخل) — قرار مختص إنتانات" } },
      { title: { fr: "CHIRURGIE (remplacement valvulaire) si : insuffisance cardiaque réfractaire (1re indication), infection non contrôlée (abcès, fièvre persistante), prévention embolique (végétations > 10 mm mobiles) — décision d'équipe (cardiologue/chirurgien/infectiologue)", ar: "الجراحة (تبديل صمام) عند: قصور قلبي مقاوم (الاستطباب الأول)، إنتان غير مضبوط (خراج، حمى مستمرة)، وقاية صمّية (نباتات > 10 مم متحركة) — قرار فريق (قلب/جراحة/إنتانات)" } },
      { title: { fr: "Chercher la PORTE D'ENTRÉE : dentaire (la plus fréquente), cutanée (S. aureus du toxicomane), digestive (entérocoque → coloscopie à distance), matériel intravasculaire", ar: "ابحث عن المدخل: سني (الأشيع)، جلدي (عنقوديات المدمن)، هضمي (معويات ← تنظير قولون لاحقاً)، معدات داخل وعائية" } },
      { title: { fr: "Surveiller les COMPLICATIONS emboliques : AVC (le plus fréquent), splénique, rénal, coronaire ; tout événement embolique renforce l'indication chirurgicale", ar: "راقب الاختلاطات الصمّية: سكتة (الأشيع)، طحالية، كلوية، إكليلية؛ كل حدث صمّي يقوي الاستطباب الجراحي" } },
    ],
    keyPoints: [
      { fr: "Une bactériémie à Staphylococcus aureus SANS porte d'entrée évidente = endocardite jusqu'à l'ETO — ne jamais banaliser un S. aureus dans le sang.", ar: "تجرثم دم بالعنقوديات الذهبية دون مدخل واضح = التهاب شغاف حتى إيكو عبر المريء — لا تستهن أبداً بعنقوديات ذهبية بالدم." },
      { fr: "Les valvulopathies rhumatismales restent fréquentes en Tunisie — toute fièvre prolongée chez un porteur connu impose le trio hémocultures/CRP/écho.", ar: "الاعتلالات الصمامية الرثوية ما تزال شائعة بتونس — كل حمى مطولة عند حامل معروف تفرض ثلاثية مزارع/CRP/إيكو." },
      { fr: "La prophylaxie antibiotique dentaire ne concerne QUE les patients à haut risque (prothèse, antécédent d'endocardite, cardiopathie congénitale cyanogène) — l'hygiène bucco-dentaire reste la meilleure prévention.", ar: "الوقاية المضادة قبل الأسنان تخص فقط عالي الخطورة (صمام اصطناعي، سابقة التهاب شغاف، تشوه قلبي مزرق — نظافة الفم تبقى أفضل وقاية." },
    ],
    trajectory: [
      { when: { fr: "Diagnostic confirmé, germe identifié, hémodynamique stable", ar: "تشخيص مؤكد، جرثوم معروف، دوران مستقر" }, do: [
        { fr: "Antibiothérapie IV à domicile ou hospitalière 4-6 semaines sous surveillance (créatinine, taux ATB), équipe mobile d'infectiologie.", ar: "مضادات وريدية منزلية أو بالمستشفى 4-6 أسابيع بمراقبة (كرياتينين، مستويات المضاد)، فريق إنتانات متنقل." },
      ]},
      { when: { fr: "Fièvre persistante à 7-10 jours d'antibiothérapie adaptée", ar: "حمى مستمرة بـ 7-10 أيام من مضاد مكيف" }, do: [
        { fr: "Infection non contrôlée : ETO de contrôle (abcès annulaire ?), TDM (foyers métastatiques), rediscuter la chirurgie — l'échec médical impose le bloc.", ar: "إنتان غير مضبوط: إيكو عبر المريء مراقب (خراج حلقي؟)، طبقي (بؤر منتقلة)، إعادة نقاش الجراحة — الفشل الطبي يفرض الصالة." },
      ]},
      { when: { fr: "Dyspnée aiguë, OAP, choc cardiogénique (rupture de cordage)", ar: "ضيق نفس حاد، وذمة رئة، صدمة قلبية (تمزق حبال)" }, do: [
        { fr: "Insuffisance cardiaque aiguë = chirurgie en urgence — stabilisation médicale brève puis bloc ; mortalité majeure sans chirurgie.", ar: "قصور قلبي حاد = جراحة عاجلة — استقرار طبي قصير ثم الصالة؛ وفيات كبرى دون جراحة." },
        { fr: "Gestion de l'OAP en attendant le bloc", ar: "تدبير الوذمة الرئوية بانتظار الصالة" },
      ]},
    ],
    medications: ["cefotaxime", "vancomycine", "gentamicine"],
    calculators: ["qsofa", "gcs"],
    meta: { sources: ["ESC endocarditis 2023", "Duke modifiés"], lastReviewed: "2026-09" },
  },
  {
    id: "hhs-hyperosmolaire",
    title: { fr: "État hyperosmolaire hyperglycémique (HHS)", ar: "الحالة فرطية الأسمولية والسكر" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Diabétique type 2 + déshydratation majeure + troubles de conscience : glycémie > 33 mmol/L, osmolarité > 320, cétose absente/minime. Réhydratation LENTE (moitié sur 12 h), insuline APRÈS, K⁺ avant insuline. Mortalité 10-20 % — supérieure à la cétoacidose.", ar: "سكري نوع 2 + تجفاف شديد + اضطراب وعي: سكر > 33 م مول/ل، أسمولية > 320، كيتونات غائبة/طفيفة. إماهة بطيئة (نصفها بـ 12 س)، أنسولين بعد، بوتاسيوم قبل الأنسولين. وفيات 10-20% — أعلى من الحماض الكيتوني." },
    exams: {
      bio: [{ fr: "Glycémie (souvent > 33 mmol/L / 6 g/L), osmolarité calculée > 320 mOsm/kg, gazométrie (pH > 7,3, bicarbonates > 18 — pas de cétoacidose franche), ionogramme, créatinine, cétonémie faible/absente, bandelette", ar: "سكر (غالباً > 33 م مول/ل / 6 غ/ل)، أسمولية محسوبة > 320 م أسم/كغ، غازات (‏pH > 7.3، بيكربونات > 18 — بلا حماض كيتوني صريح)، شوارد، كرياتينين، كيتونات ضعيفة/غائبة، شريط" }],
      img: [{ fr: "ECG (kaliémie), radio thorax / ECBU / bilan infectieux — l'infection est le premier facteur déclenchant", ar: "تخطيط (بوتاسيوم)، صورة صدر / زرع بول / تحري إنتان — الإنتان أول محرض" }],
    },
    steps: [
      { title: { fr: "Terrain : diabète type 2 (souvent méconnu !) âgé, facteur déclenchant : INFECTION (1re cause), AVC/IDM, médicaments (corticoïdes, diurétiques, SGLT2i), immobilisation, accès limité à l'eau (canicule, dépendance)", ar: "الأرضية: سكري نوع 2 (غالباً مجهول!) مسن، محرض: إنتان (السبب الأول)، سكتة/احتشاء، أدوية (كورتيزون، مدرات، ‏SGLT2i)، قلة حركة، وصول محدود للماء (موجة حر، تبعية)" } },
      { title: { fr: "Déficit hydrique MASSIF : 8-12 litres en moyenne (le double de la cétoacidose) — c'est lui qui tue par collapsus et thromboses", ar: "عجز مائي ضخم: 8-12 لتراً بالوسطي (ضعف الحماض الكيتوني) — هو ما يقتل بالانهيار والخثار" } },
      { title: { fr: "RÉHYDRATATION d'abord, LENTE : NaCl 0,9 % 15-20 mL/kg la 1re heure puis 500 mL/h ; corriger la moitié du déficit sur 12 h, le reste sur 24-48 h — une baisse trop rapide de l'osmolarité expose à l'œdème cérébral", ar: "الإماهة أولاً، بطيئة: محلول ملحي 15-20 مل/كغ أول ساعة ثم 500 مل/س؛ صحح نصف العجز بـ 12 س والباقي بـ 24-48 س — الهبوط السريع للأسمولية يعرض لوذمة دماغية" } },
      { title: { fr: "INSULINE APRÈS le début de la réhydratation (0,05-0,1 UI/kg/h) et seulement si K⁺ ≥ 3,3 mmol/L — l'insuline précoce aggrave le collapsus (l'eau rentre dans les cellules) ; la baisse de glycémie doit être ≤ 4-6 mmol/L/h", ar: "الأنسولين بعد بدء الإماهة (0.05-0.1 و/كغ/س) وفقط إذا بوتاسيوم ≥ 3.3 م مول/ل — الأنسولين المبكر يفاقم الانهيار (الماء يدخل الخلايا)؛ هبوط السكر يجب أن يكون ≤ 4-6 م مول/ل/س" } },
      { title: { fr: "POTASSIUM : corriger AVANT l'insuline si K⁺ < 3,3 ; supplémenter dès que K⁺ < 5,2 et diurèse présente (le déficit total est énorme malgré un K⁺ normal ou élevé)", ar: "البوتاسيوم: صححه قبل الأنسولين إذا < 3.3؛ عوّض متى < 5.2 مع وجود إدرار (العجز الكلي ضخم رغم بوتاسيوم طبيعي أو مرتفع)" } },
      { title: { fr: "PROPHYLAXIE THROMBOEMBOLIQUE systématique (HBPM à dose préventive sauf CI) — l'hyperviscosité du HHS thrombose (TVP, EP, AVC, thrombose mésentérique)", ar: "وقاية خثرية منهجية (هيبارين منخفض الوزن بجرعة وقائية دون مانع) — فرط لزوجة الحالة يخثر (خثار وريد، صمة، سكتة، خثار مساريقي)" } },
      { title: { fr: "Chercher et traiter le FACTEUR DÉCLENCHANT : infection (poumon, urines, pied diabétique), événement cardiovasculaire, accident médicamenteux — sans cela, la récidive est certaine", ar: "ابحث عن المحرض وعالجه: إنتان (رئة، بول، قدم سكري)، حدث قلبي وعائي، عرض دوائي — دونه النكس مؤكد" } },
      { title: { fr: "Réanimation pour : troubles de conscience marqués, choc, osmolarité > 350, insuffisance rénale — sonde urinaire, scope, contrôles glycémie/horaire puis 2-4 h", ar: "إنعاش عند: اضطراب وعي واضح، صدمة، أسمولية > 350، قصور كلوي — مسبار بولي، مراقبة، قياسات سكر بالساعة ثم 2-4 س" } },
    ],
    keyPoints: [
      { fr: "Le HHS tue 2 fois plus que la cétoacidose (10-20 % vs 1-5 %) — la gravité vient de la déshydratation et de l'âge, pas de l'acidose.", ar: "الحالة فرطية الأسمولية تقتل ضعفي الحماض الكيتوني (10-20% مقابل 1-5%) — الخطورة من التجفاف والعمر لا من الحماض." },
      { fr: "La confusion du HHS se corrige avec l'osmolarité, pas avec la glycémie : si la conscience ne s'améliore pas quand l'osmolarité est < 320, chercher AUTRE chose (AVC, méningite, post-critique).", ar: "تخليط الحالة يتحسن مع الأسمولية لا مع السكر: إذا لم يتحسن الوعي عندما الأسمولية < 320، ابحث عن سبب آخر (سكتة، سحايا، بعد نوبة)." },
      { fr: "Chez le sujet âgé dépendant, le HHS se prépare en jours (boissons sucrées « pour l'énergie », canicule, diurétiques) — la prévention par l'hydratation et l'éducation est capitale.", ar: "عند المسن التابع، تتحضر الحالة خلال أيام (مشروبات سكرية «للطاقة»، موجة حر، مدرات) — الوقاية بالإماهة والتوعية حاسمة." },
    ],
    trajectory: [
      { when: { fr: "Osmolarité < 320, conscience revenue, glycémie < 14 mmol/L", ar: "أسمولية < 320، وعي عاد، سكر < 14 م مول/ل" }, do: [
        { fr: "Transition vers l'insuline SC avant l'arrêt de l'IV (chevauchement 2 h), éducation diabétique, sortie avec suivi rapproché.", ar: "تحول للأنسولين تحت الجلد قبل إيقاف الوريدي (تراكب ساعتين)، توعية سكرية، خروج بمتابعة لصيقة." },
      ]},
      { when: { fr: "Conscience qui ne s'améliore pas malgré la correction de l'osmolarité", ar: "وعي لا يتحسن رغم تصحيح الأسمولية" }, do: [
        { fr: "TDM cérébrale ± PL : AVC, méningite, état post-critique — le HHS n'explique pas tout.", ar: "طبقي دماغي ± بزل: سكتة، سحايا، حالة بعد نوبة — الحالة فرطية الأسمولية لا تفسر كل شيء." },
        { fr: "Protocole AVC", ar: "بروتوكول السكتة الدماغية" },
      ]},
      { when: { fr: "Choc persistant malgré la réhydratation", ar: "صدمة مستمرة رغم الإماهة" }, do: [
        { fr: "Chercher le sepsis sous-jacent (1re cause de décès), vasopresseurs, réanimation — ne pas attribuer le choc au seul HHS.", ar: "ابحث عن إنتان كامن (أول سبب وفاة)، مقويات أوعية، إنعاش — لا تنسب الصدمة للحالة وحدها." },
        { fr: "Protocole choc septique", ar: "بروتوكول الصدمة الإنتانية" },
      ]},
    ],
    medications: ["insuline-rapide", "chlorure-potassium", "enoxaparine"],
    calculators: ["gazometrie", "dose-poids", "gcs"],
    meta: { sources: ["ADA/EASD consensus 2024", "JHES guidelines"], lastReviewed: "2026-09" },
  },
  {
    id: "invagination-intestinale",
    title: { fr: "Invagination intestinale aiguë (IIA)", ar: "الانغماد المعوي الحاد" },
    category: "pediatrie",
    severity: "critical",
    summary: { fr: "Nourrisson 3 mois-3 ans : douleurs paroxystiques avec cris + pâleur + vomissements, « selles gelée de groseille » tardives. Écho = cocarde. Réduction par lavement (air/eau) en urgence — contre-indiquée si péritonite. Sans traitement : nécrose et mort.", ar: "رضيع 3 أشهر-3 سنوات: آلام نوبية مع صراخ + شحوب + تقيؤ، «براز هلام الكشمش» متأخر. الإيكو = هدف. إرجاع بالحقنة (هواء/ماء) بطوارئ — ممنوع عند التهاب البريتوان. دون علاج: نخر ووفاة." },
    exams: {
      bio: [{ fr: "NFS, ionogramme, CRP, groupage (pré-op), gazométrie si signes de choc", ar: "عد دم، شوارد، ‏CRP، زمرة (تحضير جراحي)، غازات عند علامات صدمة" }],
      img: [{ fr: "Échographie abdominale = EXAMEN CLÉ : cocarde en coupe transversale, pseudorein en longitudinal, absence de vascularisation = nécrose ; ASP si doute de perforation", ar: "إيكو بطن = الفحص المفتاح: هدف بالمقطع المستعرض، كلية كاذبة بالطولاني، غياب تروية = نخر؛ صورة بطن عند شك انثقاب" }],
    },
    steps: [
      { title: { fr: "Terrain : 3 mois - 3 ans (pic 5-9 mois), garçon le plus souvent ; saisonnalité automno-hivernale (adénovirus) ; après 3 ans : chercher un POINT D'APPEL (diverticule de Meckel, polype, lymphome, purpura rhumatoïde)", ar: "الأرضية: 3 أشهر - 3 سنوات (ذروة 5-9 أشهر)، صبي غالباً؛ موسمية خريفية-شتوية (أدينوفيروس)؛ بعد 3 سنوات: ابحث عن نقطة انطلاق (رتج ميكل، بوليب، لمفوما، فرفرية رثوية)" } },
      { title: { fr: "Clinique : crises DOULOUREUSES PAROXYSTIQUES (cris + repliement des cuisses, puis accalmie trompeuse), vomissements, pâleur ; la triade complète (douleur + masse + rectorragies) est tardive — les « selles gelée de groseille » signent l'ischémie déjà installée", ar: "السريرة: نوبات ألم نوبية (صراخ + ثني فخذين، ثم هدوء خادع)، تقيؤ، شحوب؛ الثلاثية الكاملة (ألم + كتلة + نزف شرجي) متأخرة — «براز هلام الكشمش» يعني نقص تروية قائم" } },
      { title: { fr: "ÉCHOGRAPHIE en urgence (opérateur entraîné) : cocarde > 3 cm de diamètre, épaisseur > 3 mm — sensibilité > 95 % ; ne pas retarder pour un ASP ou un transit", ar: "إيكو عاجل (فاحص مدرب): هدف قطر > 3 سم، سماكة > 3 مم — حساسية > 95%؛ لا تؤخر من أجل صورة أو ظليلة" } },
      { title: { fr: "RÉDUCTION PAR LAVEMENT sous contrôle écho/radio : air (pression < 120 mmHg) ou eau/sérum tiède — EN URGENCE, en présence du chirurgien, avec perfusion posée ; succès 80-90 % si précoce", ar: "الإرجاع بالحقنة تحت مراقبة إيكو/أشعة: هواء (ضغط < 120 ملم ز) أو ماء/محلول دافئ — بطوارئ، بحضور الجراح، مع وريد موضوع؛ النجاح 80-90% إذا مبكر" } },
      { title: { fr: "CONTRE-INDICATIONS au lavement : PÉRITONITE, perforation (pneumopéritoine), choc non corrigé, ischémie majeure à l'écho (absence de flux) — chirurgie d'emblée", ar: "موانع الحقنة: التهاب بريتوان، انثقاب (هواء بالبريتوان)، صدمة غير مصححة، نقص تروية شديد بالإيكو (غياب جريان) — جراحة مباشرة" } },
      { title: { fr: "RÉCIDIVE : 5-10 % dans les 72 h — consignes claires aux parents (nouvelles crises = retour immédiat) ; observation hospitalière 24 h minimum après réduction", ar: "النكس: 5-10% خلال 72 س — تعليمات واضحة للأهل (نوبات جديدة = عودة فورية)؛ ملاحظة بالمستشفى 24 س على الأقل بعد الإرجاع" } },
      { title: { fr: "Échec de réduction ou contre-indication : CHIRURGIE (désinvagination manuelle ± résection si nécrose) — chaque heure compte, la nécrose s'installe en 24-48 h", ar: "فشل الإرجاع أو وجود مانع: جراحة (فك يدوي ± استئصال عند النخر) — كل ساعة محسوبة، النخر يتم بـ 24-48 س" } },
      { title: { fr: "Après réduction réussie : surveillance 24 h, reprise alimentaire progressive, échographie de contrôle si doute ; au-delà de 3 ans : exploration étiologique (Meckel, lymphome)", ar: "بعد إرجاع ناجح: مراقبة 24 س، استئناف تغذية تدريجي، إيكو مراقب عند الشك؛ بعد 3 سنوات: تحري السبب (ميكل، لمفوما)" } },
    ],
    keyPoints: [
      { fr: "L'IIA est la 1re cause d'occlusion du nourrisson — y penser devant TOUT nourrisson qui pleure par crises avec vomissements, même sans rectorragie (absente dans 50 % des cas précoces).", ar: "الانغماد أول سبب انسداد عند الرضيع — اذكره أمام كل رضيع يبكي بنوبات مع تقيؤ، ولو بلا نزف شرجي (غائب بـ 50% من الحالات المبكرة)." },
      { fr: "Le purpura rhumatoïde (Henoch-Schönlein) peut se compliquer d'IIA : purpura des membres inférieurs + douleurs abdominales = échographie systématique.", ar: "الفرفرية الرثوية (هينوخ-شونلاين) قد تتعقد بانغماد: فرفرية بالطرفين السفليين + آلام بطن = إيكو منهجي." },
      { fr: "L'accalmie entre les crises piège le diagnostic — un nourrisson « calme par moments » n'est pas rassurant ; c'est le rythme PAROXYSTIQUE qui fait le tableau.", ar: "الهدوء بين النوبات يخدع التشخيص — رضيع «هادئ أحياناً» ليس مطمئناً؛ الإيقاع النوبي هو ما يصنع اللوحة." },
    ],
    trajectory: [
      { when: { fr: "Réduction réussie, enfant calmé, pas de sang digestif", ar: "إرجاع ناجح، طفل هدأ، بلا دم هضمي" }, do: [
        { fr: "Observation 24 h, reprise alimentaire, consignes de récidive écrites, sortie avec contrôle.", ar: "ملاحظة 24 س، استئناف تغذية، تعليمات نكس مكتوبة، خروج مع مراقبة." },
      ]},
      { when: { fr: "Échec du lavement réducteur", ar: "فشل الحقنة المرجعة" }, do: [
        { fr: "Chirurgie immédiate : désinvagination, résection si nécrose — ne pas répéter les lavements au-delà de 2 tentatives.", ar: "جراحة فورية: فك الانغماد، استئصال عند النخر — لا تكرر الحقن أكثر من محاولتين." },
      ]},
      { when: { fr: "Péritonite, choc, pneumopéritoine", ar: "التهاب بريتوان، صدمة، هواء بالبريتوان" }, do: [
        { fr: "Réanimation + chirurgie en urgence absolue : résection intestinale, antibiothérapie large — la mortalité grimpe avec le délai.", ar: "إنعاش + جراحة بطوارئ مطلقة: استئصال معوي، مضادات واسعة — الوفيات ترتفع مع التأخير." },
        { fr: "Voir principes de prise en charge de l'occlusion", ar: "انظر مبادئ تدبير الانسداد" },
      ]},
    ],
    medications: ["ondansetron", "paracetamol"],
    calculators: ["poids-pediatrique", "fluids-enfant", "broselow"],
    meta: { sources: ["ESPR intussusception", "SFCP"], lastReviewed: "2026-09" },
  },
  {
    id: "hemorragie-digestive-basse",
    title: { fr: "Hémorragie digestive basse (HDB)", ar: "النزف الهضمي السفلي" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "Rectorragie (sang rouge) ± hématochézie. Éliminer d'abord une HDB par saignement haut massif (15 %). Réanimation + arrêt des anticoagulants à discuter. Coloscopie après préparation = clé diagnostique et thérapeutique. Diverticulose = 1re cause.", ar: "نزف شرجي (دم أحمر) ± خروج دم مع البراز. استبعد أولاً نزفاً علوياً غزيراً (15%). إنعاش + إيقاف مضادات التخثر يُناقش. تنظير قولون بعد تحضير = مفتاح تشخيصي وعلاجي. الرتوج = السبب الأول." },
    exams: {
      bio: [{ fr: "NFS (Hb initiale trompeuse — contrôler à 6 h), groupage ×2, INR/TP/TCA, créatinine, urée (rapport urée/créatinine élevé = origine haute ?)", ar: "عد دم (الخضاب البدئي خادع — أعد القياس بـ 6 س)، زمرة × 2، ‏INR/TP/TCA، كرياتينين، يوريا (نسبة يوريا/كرياتينين عالية = منشأ علوي؟)" }],
      img: [{ fr: "Angio-TDM si saignement actif abondant (localise > 0,3 mL/min) ; artériographie si échec (embolisation possible) ; coloscopie = référence à distance", ar: "طبقي وعائي إذا نزف نشط غزير (يحدد > 0.3 مل/د)؛ تصوير شرياني عند الفشل (إصمام ممكن)؛ تنظير قولون = المرجع لاحقاً" }],
    },
    steps: [
      { title: { fr: "Caractériser : RECTORRAGIE (sang rouge vif, isolé = anorectal ou colique droit), HÉMATOCHÉZIE (sang mélangé aux selles), MÉLÉNA (noir = plutôt origine haute ou grêle droit à transit lent)", ar: "وصف: نزف شرجي (دم أحمر قانٍ، معزول = شرجي أو قولون أيمن)، خروج دم مع البراز (مختلط)، زفت (أسود = منشأ علوي غالباً أو دقيق أيمن بعبور بطيء)" } },
      { title: { fr: "15 % des « HDB » massives sont des hémorragies DIGESTIVES HAUTES à transit rapide — si choc ou saignement abondant : toucher rectal + sonde nasogastrique ± endoscopie haute d'abord", ar: "‏15% من «النزوف السفلية» الغزيرة هي نزوف علوية بعبور سريع — عند صدمة أو نزف غزير: لمس شرجي + أنبوب معدي ± تنظير علوي أولاً" } },
      { title: { fr: "RÉANIMATION : 2 voies de gros calibre, remplissage cristalloïdes prudent, transfusion seuil Hb < 7 g/dL (< 8 si cardiopathie) — objectif PAS la normalisation, l'hémostase spontanée survient dans 80 %", ar: "إنعاش: وريدان عريضان، تعبئة بلورية حذرة، نقل عند خضاب < 7 غ/دل (< 8 إذا مرض قلبي) — الهدف ليس التطبيع، الإرقاء التلقائي يحدث بـ 80%" } },
      { title: { fr: "ANTICOAGULANTS/ANTIAGRÉGANTS : ne pas arrêter l'aspirine en prévention secondaire sans discussion ; AVK/AOD : discuter selon la gravité (antidote si saignement menaçant) — décision collégiale bénéfice/risque", ar: "مضادات التخثر/التصاق: لا توقف أسبرين الوقاية الثانوية دون نقاش؛ ‏AVK/AOD: ناقش حسب الخطورة (ترياق إذا نزف مهدد) — قرار جماعي فائدة/خطر" } },
      { title: { fr: "CAUSES selon l'âge : DIVERTICULOSE (1re cause, saignement brutal indolore qui s'arrête souvent seul), angiodysplasies (sujet âgé, récidivant), hémorroïdes (diagnostic d'élimination chez le > 40 ans !), colite (infectieuse, ischémique, MICI), cancer, post-polypectomie", ar: "الأسباب حسب العمر: الرتوج (السبب الأول، نزف مفاجئ غير مؤلم يتوقف غالباً وحده)، خلل تنسج وعائي (مسن، ناكس)، بواسير (تشخيص استبعاد عند > 40 سنة!)، التهاب قولون (إنتاني، إقفاري، معوي مزمن)، سرطان، بعد استئصال بوليب" } },
      { title: { fr: "COLOSCOPIE après préparation (dans les 24 h si saignement actif) = diagnostic ET traitement (clip, injection, électrocoagulation) ; en urgence sans préparation si instabilité persistante", ar: "تنظير قولون بعد تحضير (خلال 24 س إذا نزف نشط) = تشخيص وعلاج (مشبك، حقن، كي)؛ بطوارئ دون تحضير إذا عدم استقرار مستمر" } },
      { title: { fr: "Saignement massif non contrôlé : angio-TDM → artériographie + embolisation sélective ; chirurgie en dernier recours (colectomie segmentaire si cause localisée)", ar: "نزف غزير غير مضبوط: طبقي وعائي ← تصوير شرياني + إصماء انتقائي؛ جراحة كحل أخير (استئصال قولون قطاعي إذا سبب محدد)" } },
      { title: { fr: "TOUT saignement rectal chez le > 40 ans = exploration colique complète même si « hémorroïdes connues » — ne jamais attribuer sans voir", ar: "كل نزف شرجي عند > 40 سنة = استكشاف قولوني كامل ولو «بواسير معروفة» — لا تنسب دون رؤية" } },
    ],
    keyPoints: [
      { fr: "L'Hb initiale est faussement rassurante (l'hémodilution prend 6-12 h) — un patient « à 12 g/dL » peut être en train de saigner massivement : juger sur la clinique et répéter la NFS.", ar: "الخضاب البدئي مطمئن كذباً (التمدد الدموي يستغرق 6-12 س) — مريض «بـ 12 غ/دل» قد ينزف بغزارة: احكم بالسريرة وكرر العد." },
      { fr: "Le diverticule saigne brutalement, sans douleur, souvent la nuit, et s'arrête tout seul dans 80 % des cas — mais il récidive dans 25-40 % : la coloscopie à distance est obligatoire.", ar: "الرتج ينزف فجأة، دون ألم، غالباً ليلاً، ويتوقف وحده بـ 80% — لكنه ينكس بـ 25-40%: تنظير القولون لاحقاً إلزامي." },
      { fr: "La colite ischémique du sujet âgé (douleur abdominale + rectorragies après un épisode d'hypotension) est sous-diagnostiquée — TDM puis coloscopie prudente.", ar: "التهاب القولون الإقفاري عند المسن (ألم بطن + نزف شرجي بعد نوبة هبوط) غير مشخص كفاية — طبقي ثم تنظير حذر." },
    ],
    trajectory: [
      { when: { fr: "Saignement arrêté spontanément, hémodynamique stable, Hb stable à 24 h", ar: "توقف النزف تلقائياً، دوران مستقر، خضاب ثابت بـ 24 س" }, do: [
        { fr: "Coloscopie programmée après préparation (diagnostic étiologique), sortie avec consignes, reprise des anticoagulants discutée.", ar: "تنظير قولون مجدول بعد تحضير (تشخيص السبب)، خروج مع تعليمات، استئناف مضادات التخثر يُناقش." },
      ]},
      { when: { fr: "Récidive hémorragique pendant l'hospitalisation", ar: "نكس نزفي أثناء الإقامة" }, do: [
        { fr: "Angio-TDM ± artériographie-embolisation ; transfusion selon seuils ; chirurgie si échec et source localisée.", ar: "طبقي وعائي ± تصوير شرياني-إصماء؛ نقل حسب العتبات؛ جراحة عند الفشل مع مصدر محدد." },
      ]},
      { when: { fr: "Choc hémorragique persistant", ar: "صدمة نزفية مستمرة" }, do: [
        { fr: "Transfusion massive, éliminer l'origine haute (endoscopie haute), bloc/embolisation en urgence — mortalité élevée chez le sujet âgé anticoagulé.", ar: "نقل كثيف، استبعد المنشأ العلوي (تنظير علوي)، صالة/إصماء بطوارئ — وفيات عالية عند المسن على مضاد تخثر." },
        { fr: "Voir conduite transfusionnelle et seuils", ar: "انظر تدبير النقل والعتبات" },
      ]},
    ],
    medications: ["acide-tranexamique"],
    calculators: ["transfusion", "start"],
    meta: { sources: ["ACG lower GI bleeding 2016", "ESGE"], lastReviewed: "2026-09" },
  },
  {
    id: "perforation-peritonite",
    title: { fr: "Perforation d'organe creux & péritonite", ar: "انثقاب عضو أجوف والتهاب البريتوان" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Douleur abdominale BRUTALE « en coup de poignard » + contracture « ventre de bois » + pneumopéritoine à l'ASP = CHIRURGIE EN URGENCE. ATB large + réanimation en parallèle. Ulcère perforé = 1re cause (H. pylori, AINS).", ar: "ألم بطني مفاجئ «كطعنة خنجر» + تقلص «بطن خشبي» + هواء بالبريتوان بالصورة = جراحة عاجلة. مضادات واسعة + إنعاش بالتوازي. قرحة منثقبة = السبب الأول (ملوية بوابية، مضادات التهاب)." },
    exams: {
      bio: [{ fr: "NFS, CRP, lactate (ischémie), bilan hépatique, amylase/lipase, groupage, bilan pré-op, hémocultures", ar: "عد دم، ‏CRP، لاكتات (إقفار)، وظائف كبد، أميلاز/ليباز، زمرة، تحضير جراحي، مزارع دم" }],
      img: [{ fr: "ASP debout + cliché centré sur les coupoles (PNEUMOPÉRITOINE = croissant gazeux sous-diaphragmatique — absent dans 20-30 %) ; TDM abdominale injectée = référence si ASP douteux (site de la perforation, cause)", ar: "صورة بطن واقف + لقطة على القباب (هواء بالبريتوان = هلال غازي تحت الحجاب — غائب بـ 20-30%)؛ طبقي بطن محقون = المرجع عند شك الصورة (موقع الانثقاب، السبب)" }],
    },
    steps: [
      { title: { fr: "Douleur abdominale d'installation BRUTALE (« coup de poignard »), permanente, généralisée en heures ; CONTRACTURE abdominale (« ventre de bois ») = péritonite jusqu'à preuve du contraire", ar: "ألم بطني مفاجئ («طعنة خنجر»)، دائم، يعمم بالساعات؛ تقلص بطني («بطن خشبي») = التهاب بريتوان حتى يثبت العكس" } },
      { title: { fr: "Le sujet âgé/immunodéprimé sous corticoïdes peut avoir un examen PAUVRE malgré une péritonite constituée — la tachycardie et l'hypothermie sont des signes d'alarme suffisants", ar: "المسن/مكبوت المناعة تحت كورتيزون قد يملك فحصاً فقيراً رغم بريتوان قائم — التسرع وانخفاض الحرارة علامتا إنذار كافيتان" } },
      { title: { fr: "ASP debout en URGENCE (pneumopéritoine) ; si négatif et forte suspicion : TDM injectée — ne pas répéter les clichés « pour voir »", ar: "صورة بطن واقفة عاجلة (هواء بالبريتوان)؛ إذا سلبية مع شك قوي: طبقي محقون — لا تكرر الصور «لنرى»" } },
      { title: { fr: "CAUSES : ulcère gastroduodénal PERFORÉ (1re cause — H. pylori + AINS/aspirine), diverticule sigmoïdien perforé (sujet âgé), appendice perforé, ischémie mésentérique, cancer perforé, trauma, iatrogène (post-endoscopie)", ar: "الأسباب: قرحة معدية-عشرية منثقبة (السبب الأول — ملوية بوابية + مضادات التهاب/أسبرين)، رتج سين منثقب (مسن)، زائدة منثقبة، نقص تروية مساريقي، سرطان منثقب، رض، علاجي (بعد تنظير)" } },
      { title: { fr: "À JEUN, sonde nasogastrique en aspiration, 2 voies veineuses, réhydratation agressive (3e secteur massif), sonde urinaire, scope — la préparation ne doit PAS retarder le bloc", ar: "صيام، أنبوب معدي بالشفط، وريدان، إماهة مكثفة (قطاع ثالث ضخم)، مسبار بولي، مراقبة — التحضير لا يجب أن يؤخر الصالة" } },
      { title: { fr: "ANTIBIOTHÉRAPIE à large spectre IMMÉDIATE (dans l'heure) : pipéracilline-tazobactam ou céfotaxime + métronidazole — couvrir Gram négatifs ET anaérobies, adapter aux prélèvements per-op", ar: "مضادات واسعة فورية (خلال ساعة): بيبيراسيلين-تازوباكتام أو سيفوتاكسيم + مترونيدازول — تغطية سلبيات الغرام واللاهوائيات، كيّف حسب عينات الجراحة" } },
      { title: { fr: "CHIRURGIE EN URGENCE = le traitement : suture/closure de la perforation ± lavage péritonéal, stomie selon l'état local et général — la mortalité double toutes les 6 h de retard dans les séries", ar: "الجراحة العاجلة = العلاج: خياطة/إغلاق الانثقاب ± غسل بريتواني، فغر حسب الحالة الموضعية والعامة — الوفيات تتضاعف كل 6 س تأخير حسب السلاسل" } },
      { title: { fr: "Ulcère perforé suturé : traitement anti-H. pylori systématique à distance + arrêt des AINS — sinon récidive", ar: "قرحة منثقبة مخيطة: علاج الملوية البوابية منهجياً لاحقاً + إيقاف مضادات الالتهاب — وإلا النكس" } },
    ],
    keyPoints: [
      { fr: "Un pneumopéritoine SANS péritonite clinique (patiente stable, post-coloscopie récente) peut se traiter médicalement — mais la décision est CHIRURGICALE, jamais aux urgences seules.", ar: "هواء بالبريتوان دون بريتوان سريري (مريضة مستقرة، بعد تنظير قولون حديث) قد يعالج طبياً — لكن القرار جراحي، أبداً بالطوارئ وحدها." },
      { fr: "La typhoïde compliquée de perforation iléale reste une réalité dans certaines régions — fièvre prolongée + perforation = évoquer Salmonella (sérologie, hémocultures).", ar: "التيفوئيد المعقد بانثقاب لفائفي ما يزال واقعاً ببعض المناطق — حمى مطولة + انثقاب = اذكر السالمونيلا (مصليات، مزارع دم)." },
      { fr: "Les corticoïdes et les immunosuppresseurs « éteignent » la péritonite : un patient sous prednisone avec douleur abdominale même modérée = TDM sans hésiter.", ar: "الكورتيزون ومثبطات المناعة «تطفئ» البريتوان: مريض تحت بريدنيزون مع ألم بطن ولو معتدل = طبقي دون تردد." },
    ],
    trajectory: [
      { when: { fr: "Post-op simple : reprise du transit, apyrexie, sevrage de la SNG", ar: "بعد جراحة بسيطة: عودة العبور، بلا حمى، فطام من الأنبوب" }, do: [
        { fr: "Reprise alimentaire progressive, ATB 4-7 j selon les prélèvements, traitement étiologique (anti-H. pylori, arrêt AINS), prévention thromboembolique.", ar: "استئناف تغذية تدريجي، مضادات 4-7 أيام حسب العينات، علاج السبب (مضاد الملوية، إيقاف مضادات الالتهاب)، وقاية خثرية." },
      ]},
      { when: { fr: "Fièvre persistante à J3-J5 post-op, iléus prolongé", ar: "حمى مستمرة باليوم 3-5 بعد الجراحة، علص مديد" }, do: [
        { fr: "Abcès intra-péritonéal ou lâchage de suture : TDM injectée, drainage percutané ou reprise chirurgicale — ne pas « monter les antibiotiques » sans imagerie.", ar: "خراج داخل البريتوان أو انفكاك خياطة: طبقي محقون، تصريف عبر الجلد أو عودة جراحية — لا «تصعد المضادات» دون تصوير." },
      ]},
      { when: { fr: "Choc septique, défaillances d'organes", ar: "صدمة إنتانية، فشل أعضاء" }, do: [
        { fr: "Réanimation septique maximale : source control (reprise chirurgicale), vasopresseurs, ATB élargie — la survie dépend du contrôle de la source.", ar: "إنعاش إنتاني أقصى: ضبط البؤرة (عودة جراحية)، مقويات أوعية، مضادات موسعة — النجاة تتعلق بضبط البؤرة." },
        { fr: "Protocole choc septique", ar: "بروتوكول الصدمة الإنتانية" },
      ]},
    ],
    medications: ["piperacilline-tazobactam", "metronidazole", "cefotaxime", "morphine"],
    calculators: ["qsofa", "gazometrie"],
    meta: { sources: ["WSES perforated peptic ulcer 2020"], lastReviewed: "2026-09" },
  },
  {
    id: "intoxication-alcool-aigue",
    title: { fr: "Intoxication éthylique aiguë (ivresse)", ar: "التسمم الكحولي الحاد (السكر)" },
    category: "toxicologie",
    severity: "urgent",
    summary: { fr: "Tout coma éthylique est un diagnostic d'ÉLIMINATION : glycémie, trauma crânien, co-intoxications, hypothermie. THIAMINE avant glucose. Ne jamais « laisser cuver » seul en décubitus dorsal — position latérale de sécurité + surveillance. Alcoolémie et conscience ne corrèlent pas chez l'usager chronique.", ar: "كل غيبوبة كحولية تشخيص بالاستبعاد: سكر، رض رأس، تسممات مرافقة، انخفاض حرارة. ثيامين قبل الغلوكوز. لا «تتركه يصحو» وحده بالاستلقاء الظهري — وضعية جانبية + مراقبة. الكحولية والوعي لا يتطابقان عند المدمن المزمن." },
    exams: {
      bio: [{ fr: "GLYCÉMIE capillaire IMMÉDIATE (l'hypoglycémie de l'ivresse tue et mime le coma), alcoolémie (interprétation prudente), ionogramme, osmolarité (trou osmolaire), gazométrie, NFS, bilan hépatique, ECG", ar: "سكر شعري فوري (نقص السكر بالسكر يقتلد الغيبوبة)، كحولية الدم (تفسير حذر)، شوارد، أسمولية (فجوة أسمولية)، غازات، عد دم، وظائف كبد، تخطيط" }],
      img: [{ fr: "TDM cérébrale si : chute/trauma, anticoagulants, déficit focal, coma non expliqué par l'alcoolémie, absence d'amélioration — l'hématome sous-dural est LE piège", ar: "طبقي دماغي إذا: سقوط/رض، مضادات تخثر، عجز بؤري، غيبوبة لا تفسرها الكحولية، غياب التحسن — الورم الدموي تحت الجافية هو الفخ" }],
    },
    steps: [
      { title: { fr: "A-B-C d'abord : l'ivresse profonde déprime les voies aériennes (inhalation = 1re cause de mort), surveiller SpO₂ et le réflexe de toux", ar: "‏A-B-C أولاً: السكر العميق يكبت المجرى الهوائي (الاستنشاق = أول سبب وفاة)، راقب الإشباع ومنعكس السعال" } },
      { title: { fr: "GLYCÉMIE capillaire systématique : l'alcool bloque la néoglucogenèse — hypoglycémie fréquente (jeûne, dénutrition), corriger par glucose 30 % IV APRÈS thiamine", ar: "سكر شعري منهجي: الكحول يثبط استحداث السكر — نقص السكر شائع (صيام، سوء تغذية)، صححه بغلوكوز 30% وريدي بعد الثيامين" } },
      { title: { fr: "THIAMINE 250-500 mg IV avant tout apport glucosé (prévention de Wernicke chez le dénutri chronique)", ar: "ثيامين 250-500 ملغ وريدي قبل أي غلوكوز (وقاية فرنكه عند ناقص التغذية المزمن)" } },
      { title: { fr: "L'IVRESSE EST UN DIAGNOSTIC D'ÉLIMINATION : ne pas l'étiqueter sans avoir cherché trauma crânien (myosis unilatéral, hématome sous-dural du chroniqueur qui « tombe souvent »), méningite, hypothermie, co-intoxications (benzodiazépines, opioïdes — naloxone si myosis + dépression respiratoire)", ar: "السكر تشخيص بالاستبعاد: لا تصنفه دون البحث عن رض رأس (تقبض وحيد، ورم تحت الجافية عند المزمن الذي «يسقط كثيراً»)، سحايا، انخفاض حرارة، تسممات مرافقة (بنزو، أفيون — نالوكسون عند تقبض + كبت تنفسي)" } },
      { title: { fr: "L'alcoolémie NE PRÉDIT PAS la conscience : un usager chronique à 3 g/L peut être réveillé ; un buveur occasionnel à 2 g/L peut être comateux — c'est la CLINIQUE qui guide, jamais le chiffre seul", ar: "الكحولية لا تتنبأ بالوعي: مدمن مزمن بـ 3 غ/ل قد يكون صاحياً؛ شارب عرضي بـ 2 غ/ل قد يكون بغيبوبة — السريرة هي الدليل، أبداً الرقم وحده" } },
      { title: { fr: "JAMAIS « laisser cuver » seul sur le dos : POSITION LATÉRALE DE SÉCURITÉ, surveillance rapprochée (SpO₂, conscience), réévaluation régulière — l'aggravation secondaire signe une autre cause", ar: "أبداً «اتركه يصحو» وحده على ظهره: وضعية جانبية آمنة، مراقبة لصيقة (إشباع، وعي)، إعادة تقييم منتظمة — التدهور الثانوي يعني سبباً آخر" } },
      { title: { fr: "Agitation violente : contention verbale d'abord, environnement calme ; si danger : midazolam 2,5-5 mg (éviter les phénothiazines — hypotension et abaissement du seuil épileptogène)", ar: "هياج عنيف: احتواء لفظي أولاً، بيئة هادئة؛ عند الخطر: ميدازولام 2.5-5 ملغ (تجنب الفينوثيازينات — هبوط وخفض عتبة الاختلاج)" } },
      { title: { fr: "Corriger la déshydratation et les troubles ioniques (Mg²⁺, K⁺, phosphore), rechercher les carences associées ; prévenir le SEVRAGE à distance (6-48 h) si dépendance — anticiper les benzodiazépines", ar: "صحح التجفاف واضطراب الشوارد (مغنزيوم، بوتاسيوم، فوسفور)، ابحث عن العوز المرافق؛ توقّع الانسحاب لاحقاً (6-48 س) إذا إدمان — جهز البنزوديازيبين" } },
      { title: { fr: "Ne laisser sortir que si : réveil complet, marche stable, accompagnement fiable, glycémie normale — avec consignes de retour et orientation addictologique", ar: "لا خروج إلا إذا: إفاقة كاملة، مشي ثابت، مرافق موثوق، سكر طبيعي — مع تعليمات عودة وتوجيه لعلاج الإدمان" } },
    ],
    keyPoints: [
      { fr: "« Il a trop bu, il cuve » est le diagnostic le plus dangereux des urgences — derrière chaque ivresse : un sous-dural, une hypoglycémie, une méningite ou un opioid co-ingéré peuvent tuer en heures.", ar: "«لقد أفرط بالشرب، يصحو» أخطر تشخيص بالطوارئ — خلف كل سكر: ورم تحت الجافية، نقص سكر، سحايا، أو أفيون مشارك قد تقتل بالساعات." },
      { fr: "L'hypothermie de l'ivresse (vasodilatation + immobilité) est fréquente en hiver — température systématique, réchauffement passif ; l'hypothermie majore le coma.", ar: "انخفاض حرارة السكر (توسع وعائي + قلة حركة) شائع شتاء — حرارة منهجية، تدفئة سلبية؛ الانخفاض يفاقم الغيبوبة." },
      { fr: "Chez l'adolescent (binge drinking, défis alcoolisés) : glycémie encore plus fréquemment basse, surveillance rapprochée obligatoire, jamais de sortie sans accompagnant adulte.", ar: "عند المراهق (شرب نهم، تحديات كحولية): نقص السكر أشيع بعد، مراقبة لصيقة إلزامية، لا خروج دون مرافق بالغ." },
    ],
    trajectory: [
      { when: { fr: "Réveil complet, marche stable, glycémie normale, accompagnant fiable", ar: "إفاقة كاملة، مشي ثابت، سكر طبيعي، مرافق موثوق" }, do: [
        { fr: "Sortie avec consignes écrites (reconsultation si céphalées/vomissements — hématome ?), thiamine PO, orientation addictologique, prévention du sevrage.", ar: "خروج مع تعليمات مكتوبة (إعادة استشارة عند صداع/تقيؤ — ورم دموي؟)، ثيامين فموي، توجيه علاج إدمان، وقاية انسحاب." },
      ]},
      { when: { fr: "Agitation à 6-24 h, tremblements, sueurs (début de sevrage)", ar: "هياج بـ 6-24 س، رعاش، تعرق (بداية انسحاب)" }, do: [
        { fr: "Sevrage alcoolique : CIWA-Ar, benzodiazépines, thiamine IV — voir protocole sevrage.", ar: "انسحاب كحولي: ‏CIWA-Ar، بنزوديازيبين، ثيامين وريدي — انظر بروتوكول الانسحاب." },
        { fr: "Protocole sevrage alcoolique et delirium tremens", ar: "بروتوكول الانسحاب الكحولي والهذيان الارتعاشي" },
      ]},
      { when: { fr: "Coma qui s'aggrave ou déficit focal", ar: "غيبوبة تتدهور أو عجز بؤري" }, do: [
        { fr: "TDM cérébrale en urgence : hématome sous-dural/ extradural, contusion — neurochirurgie si indication.", ar: "طبقي دماغي عاجل: ورم دموي تحت الجافية/فوقها، رض — جراحة أعصاب عند الاستطباب." },
        { fr: "Protocole traumatisme crânien", ar: "بروتوكول رض الرأس" },
      ]},
    ],
    medications: ["thiamine", "glucose30", "naloxone", "midazolam"],
    calculators: ["gcs", "gazometrie"],
    meta: { sources: ["SAMU intoxications", "ACEP alcohol intoxication"], lastReviewed: "2026-09" },
  },
];

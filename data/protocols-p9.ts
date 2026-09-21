// v8.1 — Phase 9 : urgences vasculaires (dissection aortique, tamponnade, ischémie mésentérique,
// ischémie aiguë de membre), infectiologie (méningite bactérienne, pneumonie aiguë),
// pédiatrie d'hiver (bronchiolite, laryngite/croup, corps étranger des voies aériennes),
// drépanocytose (contexte tunisien — sud).
import type { Protocol } from "./types";

export const protocolsPhase9: Protocol[] = [
  {
    id: "dissection-aortique",
    title: { fr: "Dissection aortique (syndrome aortique aigu)", ar: "تسلخ الأبهر (متلازمة أبهر حادة)" },
    category: "reanimation",
    severity: "critical",
    summary: { fr: "Douleur déchirante thoracique/dorsale + asymétrie tensionnelle = dissection jusqu'à l'angio-TDM. Contrôle IMMÉDIAT de la PA et de la FC (anti-impulsionnel), type A = chirurgie.", ar: "ألم ممزق صدري/ظهري + عدم تناظر ضغط = تسلخ حتى التصوير الوعائي. ضبط فوري للضغط والنبض (مضاد نبضي)، النوع A = جراحة." },
    exams: {
      bio: [{ fr: "D-dimères (négatives rendent le diagnostic très improbable), troponine, groupe/rhésus, lactate, créatinine", ar: "D-dimer (السلبية تجعل التشخيص مستبعداً جداً)، تروبونين، زمرة، لاكتات، كرياتينين" }],
      img: [{ fr: "Angio-TDM aortique (référence) ; ÉTT/ETO si instable ; radiographie thoracique (élargissement médiastinal inconstant)", ar: "تصوير وعائي بالطبقي (المرجع)؛ إيكو عبر الصدر/المريء عند عدم الاستقرار؛ صورة صدر (توسع منصف غير ثابت)" }],
    },
    steps: [
      { title: { fr: "Suspecter : douleur déchirante/transfixiante d'emblée maximale, irradiation dorsale, asymétrie de PA > 20 mmHg entre les bras, déficit neurologique/pouls fluctuant", ar: "اشتهِ: ألم ممزق نافذ أقصى منذ البدء، إشعاع ظهري، فرق ضغط > 20 بين الذراعين، عجز عصبي/نبض متقلب" } },
      { title: { fr: "Cible anti-impulsionnelle EN 20 MINUTES : FC < 60/min puis PAS 100-120 mmHg", ar: "هدف مضاد النبض خلال 20 دقيقة: نبض < 60 ثم انقباضي 100-120" } },
      { title: { fr: "1) Bêta-bloquant IV D'ABORD : esmolol ou labétalol — bloquer le dP/dt avant de baisser la PA", ar: "1) حاصر بيتا وريدي أولاً: إسمولول أو لابيتالول — حصر dP/dt قبل خفض الضغط" }, detail: { fr: "Jamais de vasodilatateur seul (trinitrine, nicardipine) sans bêta-bloquant : la tachycardie réflexe propage la dissection.", ar: "أبداً موسع وحده (نيتريت، نيكارديبين) دون حاصر بيتا: التسرع الارتدادي ينشر التسلخ." } },
      { title: { fr: "2) Si PAS encore > 120 : ajouter urapidil ou nicardipine en PSE", ar: "2) إن بقي الانقباضي > 120: أضف أورابيديل أو نيكارديبين بمضخة" } },
      { title: { fr: "3) Antalgie IV titrée (morphine) — la douleur entretient la poussée catécholergique", ar: "3) تسكين وريدي معاير (مورفين) — الألم يغذي الدفع الكاتيكولاميني" } },
      { title: { fr: "Angio-TDM en urgence ABSOLUE (ne pas attendre la créatinine si suspicion forte) — classe Stanford A (ascendante) vs B", ar: "تصوير وعائي بصفة طارئة مطلقة (لا تنتظر الكرياتينين عند الاشتباه القوي) — تصنيف A (صاعدة) مقابل B" } },
      { title: { fr: "Type A : chirurgie cardiaque immédiate (mortalité 1-2 %/heure sans opération) ; type B compliquée : TEVAR ; type B non compliquée : médical strict", ar: "النوع A: جراحة قلبية فورية (وفيات 1-2%/ساعة دونها)؛ B المعقدة: TEVAR؛ B غير المعقدة: علاج طبي صارم" } },
      { title: { fr: "Deux voies veineuses PÉRIPHÉRIQUES (éviter les voies centrales qui retardent et risquent la fausse lumière)", ar: "وريدان طرفيان (تجنب المركزية التي تؤخر وتخاطر بالجيب الكاذب)" } },
    ],
    keyPoints: [
      { fr: "La dissection imite tout : SCA (coronaire droite ⇒ sus-décalage inférieur !), AVC, EP, abdomen aigu. Thrombolyser une dissection = catastrophe — toujours l'évoquer avant de lyser.", ar: "التسلخ يقلد كل شيء: احتشاء (الشريان الأيمن ⇒ ارتفاع ST سفلي!)، سكتة، صمة، بطن حاد. إذابة التسلخ = كارثة — اذكره دائماً قبل الإذابة." },
      { fr: "D-dimères < 500 ng/mL dans les 24 h rendent la dissection très improbable (VPN ~ 98 %) — utiles pour ÉCARTER, jamais pour affirmer.", ar: "‏D-dimer < 500 خلال 24 س يجعل التسلخ مستبعداً جداً (قيمة استبعادية ~98%) — مفيدة للنفي لا للإثبات." },
      { fr: "Insuffisance aortique aiguë (souffle diastolique + OAP) = type A probable jusqu'à preuve du contraire.", ar: "قصور أبهر حاد (نفخة انبساطية + وذمة رئة) = نوع A محتمل حتى يثبت العكس." },
    ],
    trajectory: [
      { when: { fr: "Sus-décalage ST inférieur + suspicion de dissection", ar: "ارتفاع ST سفلي + اشتباه تسلخ" }, do: [
        { fr: "NE PAS thrombolyser, NE PAS charger en antiagrégants — angio-TDM ou coronarographie avec aortographie ; le SCA peut être secondaire à la dissection.", ar: "لا تذيب، لا تحمّل مضادات صفيحات — تصوير وعائي أو قسطرة مع تصوير أبهر؛ الاحتشاء قد يكون ثانوياً للتسلخ." },
      ]},
      { when: { fr: "Tamponnade (voir FAST) ou choc", ar: "اندحاس (انظر FAST) أو صدمة" }, do: [
        { fr: "Type A compliquée : chirurgie en extrême urgence, remplissage prudent, éviter les inotropes qui augmentent le dP/dt.", ar: "نوع A معقد: جراحة فائقة الاستعجال، تعبئة حذرة، تجنب المقويات التي ترفع dP/dt." },
      ]},
    ],
    medications: ["esmolol", "labetalol", "urapidil", "nicardipine", "morphine"],
    calculators: ["stemi", "qtc"],
    meta: { sources: ["ESC aorte 2022", "AHA/ACC 2022"], lastReviewed: "2026-09" },
  },
  {
    id: "tamponnade",
    title: { fr: "Tamponnade cardiaque", ar: "اندحاس القلب (تامبوناد)" },
    category: "reanimation",
    severity: "critical",
    summary: { fr: "Choc + turgescence jugulaire + bruits assourdis (triade de Beck) + pouls paradoxal. Écho = diagnostic. Drainage en urgence — le remplissage est un pont, pas un traitement.", ar: "صدمة + انتفاخ وداجي + أصوات مكتومة (ثلاثية بيك) + نبض متناقض. الإيكو = التشخيص. تصريف عاجل — التعبئة جسر لا علاج." },
    exams: {
      bio: [{ fr: "Pas de biologique spécifique — ne pas retarder l'écho ; groupe/rhésus, bilan pré-op si drainage chirurgical", ar: "لا تحليل نوعي — لا تؤخر الإيكو؛ زمرة وتحضير جراحي للتصريف" }],
      img: [{ fr: "Écho transthoracique au lit (FAST cardiaque) : épanchement + collapsus OD/VD en inspiration = tamponnade", ar: "إيكو بالسرير (FAST قلبي): انصباب + انخساف أذين/بطين أيمن شهيقاً = اندحاس" }],
    },
    steps: [
      { title: { fr: "Triade de Beck (hypotension + bruits assourdis + TJJ) — présente dans < 1/3 des cas ; penser tamponnade devant tout choc sans cause évidente", ar: "ثلاثية بيك (هبوط + أصوات مكتومة + انتفاخ وداجي) — في أقل من ثلث الحالات؛ اذكر الاندحاس أمام كل صدمة بلا سبب" } },
      { title: { fr: "Pouls paradoxal > 10 mmHg (chute du PAS à l'inspiration) — signe clé au brassard", ar: "نبض متناقض > 10 ملم ز (هبوط الانقباضي شهيقاً) — علامة مفتاحية بالمانشيت" } },
      { title: { fr: "ECG : microvoltage, alternance électrique, tachycardie sinusale — aucune de ces anomalies n'est obligatoire", ar: "تخطيط: صغر جهود، تناوب كهربائي، تسرع جيبي — لا شيء منها إلزامي" } },
      { title: { fr: "ÉCHO au lit immédiate : c'est elle qui tranche — collapsus des cavités droites, VCI pléthorique", ar: "إيكو فورية بالسرير: هي الفيصل — انخساف الأجواف اليمنى، وريد أجوف محتقن" } },
      { title: { fr: "Remplissage prudent (250-500 mL) pour maintenir la précharge EN ATTENDANT le drainage — ni diurétiques ni vasodilatateurs (tuent la précharge)", ar: "تعبئة حذرة (250-500 مل) للحفاظ على الحمل القبلي بانتظار التصريف — لا مدرات ولا موسعات (تقتل الحمل القبلي)" } },
      { title: { fr: "DRAINAGE en urgence : péricardiocentèse écho-guidée (sous-xiphoïdienne) ou fenêtre chirurgicale selon contexte et disponibilité", ar: "تصريف عاجل: بزل تامور موجه بالإيكو (تحت الخنجري) أو نافذة جراحية حسب السياق والتوفر" } },
      { title: { fr: "Étiologies : néoplasique (la plus fréquente), péricardite, urémique, post-traumatique/post-chirurgicale, tuberculose (contexte tunisien à ne pas oublier)", ar: "الأسباب: ورمي (الأشيع)، التهاب تامور، يوريمي، بعد رض/جراحة، سل (سياق تونسي لا يُنسى)" } },
      { title: { fr: "Tamponnade traumatique (plaie précordiale) = thoracotomie de sauvetage en centre chirurgical — ne pas ponctionner si chirurgien disponible en minutes", ar: "اندحاس رضّي (جرح أمام القلب) = بضع صدر إنقاذي بمركز جراحي — لا تبزل إذا الجراح متاح خلال دقائق" } },
    ],
    keyPoints: [
      { fr: "La tamponnade est un diagnostic CLINIQUE + ÉCHO — un patient en choc avec épanchement modéré peut être plus grave qu'un gros épanchement chronique (la vitesse de constitution fait la pression).", ar: "الاندحاس تشخيص سريري + إيكو — مريض بصدمة مع انصباب متوسط قد يكون أخطر من انصباب كبير مزمن (سرعة التكون تصنع الضغط)." },
      { fr: "Tachycardie = mécanisme de survie : ne jamais la freiner (bêta-bloquants dangereux ici).", ar: "التسرع = آلية نجاة: لا تكبحه أبداً (حاصرات بيتا خطرة هنا)." },
    ],
    trajectory: [
      { when: { fr: "Arrêt cardiaque sur tamponnade (APEA)", ar: "توقف قلب على اندحاس (APEA)" }, do: [
        { fr: "RCP + péricardiocentèse de décompression immédiate même à l'aveugle si écho indisponible — thoracotomie si traumatique.", ar: "إنعاش + بزل تامور فوري ولو دون إيكو — بضع صدر إذا رضياً." },
      ]},
      { when: { fr: "Récidive après drainage (néoplasique)", ar: "نكس بعد التصريف (ورمي)" }, do: [
        { fr: "Fenêtre péricardique chirurgicale ou ballon péricardique — avis cardiologie/oncologie.", ar: "نافذة تامورية جراحية أو بالون — رأي قلب/أورام." },
      ]},
    ],
    medications: ["noradrenaline", "dobutamine"],
    calculators: ["amines"],
    meta: { sources: ["ESC péricarde 2015", "EACTS"], lastReviewed: "2026-09" },
  },
  {
    id: "ischemie-mesenterique",
    title: { fr: "Ischémie mésentérique aiguë", ar: "نقص تروية مساريقي حاد" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Douleur abdominale disproportionnée à l'examen chez un cardiaque/arythmique = ischémie mésentérique. Lactate tardif. Angio-TDM immédiate — chaque heure compte pour l'intestin.", ar: "ألم بطني غير متناسب مع الفحص عند مريض قلب/لانظم = نقص تروية مساريقي. اللاكتات متأخر. تصوير وعائي فوري — كل ساعة تهم للأمعاء." },
    exams: {
      bio: [{ fr: "Lactate (normal N'EXCLUT PAS — élevé = tardif), gazos (acidose métabolique), NFS, créatinine, lipase, D-dimères", ar: "لاكتات (الطبيعي لا يستبعد — المرتفع متأخر)، غازات (حماض استقلابي)، عد دم، كرياتينين، ليباز، ‏D-dimer" }],
      img: [{ fr: "Angio-TDM abdominale SANS délai — examen de référence (sensibilité > 95 %)", ar: "تصوير وعائي للبطن دون تأخير — الفحص المرجعي (حساسية > 95%)" }],
    },
    steps: [
      { title: { fr: "Triade évocatrice : douleur abdominale BRUTALE et INTENSE + abdomen SOUPLE (disproportion) + terrain (FA, cardiopathie, athérome, hypercoagulabilité)", ar: "ثلاثية موحية: ألم بطني مفاجئ شديد + بطن لين (عدم تناسب) + أرضية (رجفان، مرض قلب، تصلب شرايين، فرط تخثر)" } },
      { title: { fr: "À jeun, 2 voies veineuses, remplissage — l'intestin ischémique séquestre des litres", ar: "صيام، وريدان، تعبئة — الأمعاء المتقفرة تحبس لترات" } },
      { title: { fr: "Anticoagulation : héparine non fractionnée IV (bolus 80 UI/kg puis PSE) dès la suspicion si pas de contre-indication — après prélèvements", ar: "مضاد تخثر: هيبارين غير مجزأ وريدي (دفعة 80 و/كغ ثم مضخة) منذ الاشتباه إن لم يوجد مانع — بعد السحب" } },
      { title: { fr: "Angio-TDM artérioveineuse immédiate — ne PAS attendre le lactate ni « réévaluer dans 2 h »", ar: "تصوير وعائي شرياني وريدي فوري — لا تنتظر اللاكتات ولا «أعد التقييم بعد ساعتين»" } },
      { title: { fr: "Appel chirurgical/vasculaire dès la suspicion : embolectomie/revascularisation < 6 h, résection si nécrose", ar: "نداء جراح/أوعية منذ الاشتباه: استئصال خثرة/إعادة تروية < 6 س، استئصال عند النخر" } },
      { title: { fr: "Antibiothérapie large (céfotaxime + métronidazole) si signes de souffrance/translocation", ar: "مضادات واسعة (سيفوتاكسيم + مترونيدازول) عند علامات معاناة/انتقال جرثومي" } },
      { title: { fr: "Formes non occlusives (bas débit, noradrénaline forte) : optimiser le débit, lever les vasopresseurs si possible", ar: "الأشكال غير الانسدادية (نقص جريان، نورأدرينالين عالٍ): حسّن الجريان وارفع المقويات إن أمكن" } },
    ],
    keyPoints: [
      { fr: "Le piège mortel : examen abdominal rassurant au début — la péritonite signe la nécrose, c'est-à-dire le retard. La disproportion douleur/examen EST le signe.", ar: "الفخ القاتل: فحص بطن مطمئن بالبداية — التهاب البريتوان يعني النخر أي التأخر. عدم تناسب الألم/الفحص هو العلامة." },
      { fr: "FA + douleur abdominale = ischémie mésentérique jusqu'à l'angio-TDM. Anticoagulation insuffisante chez un FA = premier pourvoyeur d'embole mésentérique.", ar: "رجفان + ألم بطن = نقص تروية مساريقي حتى التصوير. مضاد تخثر غير كافٍ بالرجفان = أول مصدر لصمة مساريقية." },
      { fr: "Lactate normal au début : ne jamais s'y fier pour écarter — c'est un marqueur de nécrose constituée, pas d'ischémie.", ar: "لاكتات طبيعي بالبداية: لا تركن إليه للنفي — هو واسم نخر قائم لا تقفر." },
    ],
    trajectory: [
      { when: { fr: "Péritonite (défense, contracture), lactate qui monte", ar: "التهاب بريتوان (دفاع، تقلص)، لاكتات يصعد" }, do: [
        { fr: "Laparotomie en urgence — la résection du segment nécrosé prime sur la revascularisation.", ar: "فتح بطن طارئ — استئصال الجزء المتنخر أولى من إعادة التروية." },
      ]},
      { when: { fr: "Angio-TDM normale mais doute clinique persistant", ar: "تصوير طبيعي مع شك سريري مستمر" }, do: [
        { fr: "Réévaluation rapprochée, envisager les diagnostics alternatifs (perforation, pancréatite, colique) et répéter l'imagerie si la douleur reste disproportionnée.", ar: "إعادة تقييم لصيقة، وازن بدائل (انثقاب، بنكرياس، مغص) وأعد التصوير إن بقي الألم غير متناسب." },
      ]},
    ],
    medications: ["heparine", "cefotaxime", "morphine"],
    calculators: ["raaf", "has-bled"],
    meta: { sources: ["WSES 2017", "ESVM mésentérique"], lastReviewed: "2026-09" },
  },
  {
    id: "ischemie-membre-aigu",
    title: { fr: "Ischémie aiguë de membre", ar: "نقص تروية حاد بطرف" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Les 6 P (pain, pale, pulseless, paresthesia, paralysis, poikilothermia). Héparine immédiate, révascularisation < 6 h. Paralysie = stade avancé, pronostic sombre.", ar: "‏6 علامات P (ألم، شحوب، غياب نبض، تنمل، شلل، برودة). هيبارين فوري، إعادة تروية < 6 س. الشلل = مرحلة متقدمة وإنذار سيئ." },
    exams: {
      bio: [{ fr: "Groupe/rhésus, bilan pré-op, créatinine, CPK, K⁺ (rhabdomyolyse de reperfusion)", ar: "زمرة، تحضير جراحي، كرياتينين، CPK، بوتاسيوم (انسحاق إعادة التروية)" }],
      img: [{ fr: "Doppler artériel au lit (index de pression) ; angio-TDM/angio-IRM si le délai le permet SANS retarder la chirurgie", ar: "دوبلر شرياني بالسرير (مؤشر ضغط)؛ تصوير وعائي إذا سمح الوقت دون تأخير الجراحة" }],
    },
    steps: [
      { title: { fr: "Diagnostic clinique : douleur brutale + pâleur + abolition des pouls distaux + froideur ; comparer TOUJOURS avec le côté controlatéral", ar: "تشخيص سريري: ألم مفاجئ + شحوب + غياب نبض قاصي + برودة؛ قارن دائماً مع الجهة الأخرى" } },
      { title: { fr: "HÉPARINE non fractionnée IV immédiate (bolus 80 UI/kg puis PSE objectif TCA 2-3×) — empêche l'extension du thrombus", ar: "هيبارين غير مجزأ وريدي فوراً (دفعة 80 و/كغ ثم مضخة هدف TCA ‏2-3 أضعاف) — يمنع امتداد الخثرة" } },
      { title: { fr: "Membre à plat (pas surélevé), protégé, NON chauffé ; antalgie IV (morphine)", ar: "الطرف مستوٍ (لا مرفوع)، محمى، دون تدفئة؛ تسكين وريدي (مورفين)" } },
      { title: { fr: "Évaluation Rutherford : I (viable) — IIa (menacée marginale) — IIb (menacée immédiate : déficit sensitif ± moteur = urgence absolue) — III (irréversible)", ar: "تصنيف رذرفورد: ‏I (قابل للحياة) — IIa (مهدد هامشياً) — IIb (مهدد فوراً: نقص حس ± حركي = طوارئ مطلقة) — III (لا رجعة)" } },
      { title: { fr: "Appel chirurgical vasculaire IMMÉDIAT : embolectomie de Fogarty / thrombolyse in situ / pontage selon stade et étiologie", ar: "نداء جراح أوعية فوري: استئصال خثرة بفوغارتي / إذابة موضعية / تطعيم حسب المرحلة والسبب" } },
      { title: { fr: "Étiologies : embole (FA — 60-70 %), thrombose sur athérome, dissection, traumatisme ; chercher la source (ECG, écho)", ar: "الأسباب: صمة (رجفان — 60-70%)، خثار على تصلب، تسلخ، رض؛ ابحث عن المصدر (تخطيط، إيكو)" } },
      { title: { fr: "Anticiper le syndrome de reperfusion : hyperkaliémie, myoglobinurie (hydratation alcaline), syndrome des loges (aponévrotomie)", ar: "توقع متلازمة إعادة التروية: فرط بوتاسيوم، ميوغلوبين بالبول (إماهة قلوية)، متلازمة حجرات (شق لفافة)" } },
    ],
    keyPoints: [
      { fr: "Fenêtre < 6 h pour sauver le membre : la paralysie et l'anesthésie complète (stade III) = amputation quasi certaine — le délai est le pronostic.", ar: "نافذة < 6 س لإنقاذ الطرف: الشلل وفقدان الحس التام (المرحلة III) = بتر شبه مؤكد — التأخير هو الإنذار." },
      { fr: "Le Doppler ne doit JAMAIS retarder l'appel chirurgical — l'imagerie se discute avec le chirurgien, pas aux urgences.", ar: "الدوبلر لا يؤخر نداء الجراح أبداً — التصوير يناقَش مع الجراح لا في الطوارئ." },
      { fr: "Membre « froid + blanc » sans pouls chez un patient en FA = embole jusqu'à preuve du contraire.", ar: "طرف بارد أبيض بلا نبض عند مريض رجفان = صمة حتى يثبت العكس." },
    ],
    trajectory: [
      { when: { fr: "Après revascularisation : douleur de loge, K⁺ ↑, urines foncées", ar: "بعد إعادة التروية: ألم حجرة، بوتاسيوم ↑، بول داكن" }, do: [
        { fr: "Protocole hyperkaliémie + hydratation abondante (objectif diurèse 200-300 mL/h) + mesure des pressions de loge / aponévrotomie.", ar: "بروتوكول فرط البوتاسيوم + إماهة كثيفة (هدف إدرار 200-300 مل/س) + قياس ضغط الحجرات / شق اللفافة." },
      ]},
      { when: { fr: "Stade III (paralysie + anesthésie + rigidité musculaire)", ar: "المرحلة III (شلل + فقد حس + تيبس عضلي)" }, do: [
        { fr: "Amputation primaire — la revascularisation d'un muscle mort tue le patient (reperfusion toxique).", ar: "بتر أولي — إعادة تروية عضل ميت تقتل المريض (إعادة تروية سامة)." },
      ]},
    ],
    medications: ["heparine", "morphine"],
    calculators: ["raaf", "transfusion"],
    meta: { sources: ["ESVS périphérique 2017", "Rutherford classification"], lastReviewed: "2026-09" },
  },
  {
    id: "meningite-bacterienne",
    title: { fr: "Méningite bactérienne & purpura fulminans", ar: "التهاب سحايا جرثومي وفرفرية صاعقة" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Fièvre + céphalées + raideur de nuque ± troubles de conscience. Purpura extensif = céfotaxime/ceftriaxone IMMÉDIATE avant tout. PL en < 1 h si pas de contre-indication.", ar: "حمى + صداع + تصلب رقبة ± اضطراب وعي. فرفرية واسعة = سيفوتاكسيم/سيفترياكسون فوراً قبل كل شيء. بزل قطني < 1 س إن لم يوجد مانع." },
    exams: {
      bio: [{ fr: "PL : cytologie (PNN > 50 %), protéinorachie, glycorachie, Gram, culture, PCR multiplex — hémocultures ×2, NFS, CRP, coagulation", ar: "بزل قطني: خلايا (محببات > 50%)، بروتين، سكر السائل، غرام، مزرعة، PCR متعدد — مزارع دم ×2، عد دم، CRP، تخثر" }],
      img: [{ fr: "TDM cérébrale AVANT la PL si : trouble de conscience, signes de localisation, convulsions, immunodépression, papillœdème", ar: "ماسح دماغي قبل البزل إذا: اضطراب وعي، علامات بؤرية، اختلاجات، كبت مناعة، وذمة حليمة" }],
    },
    steps: [
      { title: { fr: "PURPURA extensif/ecchymotique ou choc : CÉFOTAXIME 2 g IV (ou ceftriaxone 2 g) IMMÉDIATEMENT — avant la PL, avant le scanner, avant tout", ar: "فرفرية واسعة/كدمية أو صدمة: سيفوتاكسيم 2 غ وريدي (أو سيفترياكسون 2 غ) فوراً — قبل البزل، قبل الماسح، قبل كل شيء" } },
      { title: { fr: "Sans purpura : hémocultures + ATB sans délai si la PL doit être retardée (scanner, transport) — le retard antibiotique augmente la mortalité", ar: "دون فرفرية: مزارع دم + مضاد دون تأخير إذا تأخر البزل (ماسح، نقل) — تأخير المضاد يرفع الوفيات" } },
      { title: { fr: "PL en moins d'1 heure si pas de contre-indication ; tube Gram/culture AVANT cytologie si volume limité", ar: "بزل قطني خلال أقل من ساعة إن لم يوجد مانع؛ أنبوب الغرام/المزرعة قبل الخلايا إذا الحجم محدود" } },
      { title: { fr: "Dexaméthasone 0,15 mg/kg IV 15-20 min AVANT ou avec la 1re dose d'ATB (pneumocoque adulte) — 4 jours", ar: "ديكساميثازون 0.15 ملغ/كغ وريدي 15-20 د قبل أو مع أول جرعة مضاد (مكورات رئوية بالغ) — 4 أيام" } },
      { title: { fr: "Schéma empirique adulte : céfotaxime 2 g/4 h ou ceftriaxone 2 g/12 h ; + ampicilline si > 50 ans/immunodéprimé (Listeria)", ar: "مخطط تجريبي للبالغ: سيفوتاكسيم 2 غ/4 س أو سيفترياكسون 2 غ/12 س؛ + أمبيسيلين إذا > 50/كبت مناعة (ليستيريا)" } },
      { title: { fr: "Mesures associées : décubitus latéral si trouble de conscience, contrôle glycémie/Na⁺ (SIADH), traitement du choc, isolement gouttelettes (méningocoque) + signalement", ar: "إجراءات مرافقة: اضجع جانبياً عند اضطراب الوعي، اضبط السكر/الصوديوم (SIADH)، عالج الصدمة، عزل رذاذي (سحائية) + تبليغ" } },
      { title: { fr: "Chimioprophylaxie des sujets contacts (méningocoque) : rifampicine — organisée par la médecine préventive", ar: "وقاية كيميائية للمخالطين (سحائية): ريفامبيسين — تنظمها الطب الوقائي" } },
    ],
    keyPoints: [
      { fr: "Tunisie : pic hiverno-printanier, méningocoque et pneumocoque en tête ; le purpura fulminans tue en heures — l'antibiotique passe avant toute investigation.", ar: "تونس: ذروة شتوية ربيعية، السحائية والمكورات الرئوية بالصدارة؛ الفرفرية الصاعقة تقتل خلال ساعات — المضاد قبل كل استقصاء." },
      { fr: "La triade classique (fièvre, raideur, trouble de conscience) est complète dans < 50 % des cas — l'absence de raideur n'exclut rien chez le vieillard ou l'immunodéprimé.", ar: "الثلاثية الكلاسيكية (حمى، تصلب، اضطراب وعي) مكتملة في أقل من 50% — غياب التصلب لا يستبعد شيئاً عند المسن أو ناقص المناعة." },
      { fr: "PL contre-indiquée temporairement (troubles majeurs de coagulation, menace d'engagement) : traiter D'ABORD, ponctionner ensuite.", ar: "البزل ممنوع مؤقتاً (اضطراب تخثر شديد، نذير انضغاط): عالج أولاً ثم ابعص." },
    ],
    trajectory: [
      { when: { fr: "Choc + purpura qui s'étend (purpura fulminans)", ar: "صدمة + فرفرية تمتد (صاعقة)" }, do: [
        { fr: "Réanimation septique maximale : remplissage, noradrénaline, hydrocortisone, correction de la CID — mortalité 30 %, agir en minutes.", ar: "إنعاش إنتاني أقصى: تعبئة، نورأدرينالين، هيدروكورتيزون، تصحيح التخثر المنتشر — وفيات 30%، تصرف بدقائق." },
        { fr: "Basculer sur le protocole choc septique (remplissage, noradrénaline, hydrocortisone).", ar: "انتقل إلى بروتوكول الصدمة الإنتانية (تعبئة، نورأدرينالين، هيدروكورتيزون)." },
      ]},
      { when: { fr: "Convulsions ou coma persistant après 48 h", ar: "اختلاجات أو غيبوبة مستمرة بعد 48 س" }, do: [
        { fr: "Contrôle EEG, imagerie de contrôle (empyème, hydrocéphalie, infarctus), réévaluation de l'ATB selon la culture.", ar: "تخطيط دماغ، تصوير مراقب (دبيلة، استسقاء، احتشاء)، إعادة تقييم المضاد حسب المزرعة." },
      ]},
    ],
    medications: ["cefotaxime", "dexamethasone", "noradrenaline", "hydrocortisone"],
    calculators: ["gcs", "curb65"],
    meta: { sources: ["ESCMID méningites 2016", "SPILF 2019"], lastReviewed: "2026-09" },
  },
  {
    id: "pneumonie-aigue",
    title: { fr: "Pneumonie aiguë communautaire", ar: "التهاب رئة مكتسب بالمجتمع" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "Fièvre + toux + foyer à l'auscultation/radio. Gravité par CURB-65. Antibiotique précoce (amoxicilline ou céfotaxime ± macrolide), oxygène ciblé 94-98 %.", ar: "حمى + سعال + بؤرة بالسماع/الصورة. الخطورة بـ CURB-65. مضاد مبكر (أموكسيسيلين أو سيفوتاكسيم ± ماكروليد)، أكسجين بهدف 94-98%." },
    exams: {
      bio: [{ fr: "NFS, CRP, urée/créatinine (CURB), hémocultures si grave, antigénuries pneumocoque/légionnelle si hospitalisé, gazos si SpO₂ < 92 %", ar: "عد دم، CRP، يوريا/كرياتينين (CURB)، مزارع دم إذا خطيرة، مستضدات بول (مكورات رئوية/فيلقية) للمُدخل، غازات إذا SpO₂ < 92%" }],
      img: [{ fr: "Radio thoracique face — foyer systématisé ; échographie pleuro-pulmonaire au lit si disponible (consolidation, épanchement)", ar: "صورة صدر أمامية — بؤرة منظومة؛ إيكو رئوي جنبي بالسرير إن توفر (تصلد، انصباب)" }],
    },
    steps: [
      { title: { fr: "Évaluer la gravité d'emblée : CURB-65 (confusion, urée > 7 mmol/L, FR ≥ 30, PA < 90/60, âge ≥ 65)", ar: "قيّم الخطورة منذ البدء: ‏CURB-65 (تخليط، يوريا > 7، تنفس ≥ 30، ضغط < 90/60، عمر ≥ 65)" } },
      { title: { fr: "Oxygène pour SpO₂ 94-98 % (88-92 % si BPCO)", ar: "أكسجين بهدف SpO₂ ‏94-98% (‏88-92% بالانسداد الرئوي)" } },
      { title: { fr: "Antibiotique dans les 4 premières heures : forme simple ambulatoire = amoxicilline 1 g × 3/j (ou macrolide si allergie/atypique)", ar: "مضاد خلال أول 4 ساعات: بسيطة خارجية = أموكسيسيلين 1 غ ×3/ي (أو ماكروليد عند الحساسية/لانمطي)" } },
      { title: { fr: "Hospitalisée non grave : amoxicilline IV ou céfotaxime 2 g × 3/j + azithromycine (couverture atypiques)", ar: "مدخلة غير خطيرة: أموكسيسيلين وريدي أو سيفوتاكسيم 2 غ ×3/ي + أزيثروميسين (تغطية اللانمطيات)" } },
      { title: { fr: "Grave (CURB ≥ 3, choc, PaO₂/FiO₂ bas) : céfotaxime + azithromycine IV + réanimation ; hémocultures et antigénuries avant l'ATB", ar: "خطيرة (CURB ≥ 3، صدمة، نسبة أكسجة منخفضة): سيفوتاكسيم + أزيثروميسين وريدي + إنعاش؛ مزارع ومستضدات قبل المضاد" } },
      { title: { fr: "Gestes associés : antipyrétiques, hydratation, kiné respiratoire, vaccination antigrippale/pneumocoque en sortie", ar: "إجراءات مرافقة: خافضات حرارة، إماهة، علاج تنفسي فيزيائي، لقاح كريب/مكورات عند الخروج" } },
      { title: { fr: "Réévaluation à 48-72 h : persistance de la fièvre = complication (épanchement, abcès, empyème) ou échec (résistance, diagnostic alternatif)", ar: "إعادة تقييم 48-72 س: بقاء الحمى = اختلاط (انصباب، خراج، دبيلة) أو فشل (مقاومة، تشخيص بديل)" } },
    ],
    keyPoints: [
      { fr: "Tunisie : le pneumocoque domine ; les macrolides seuls ne couvrent plus assez — réserver le macrolide à l'association ou à l'atypique documenté.", ar: "تونس: المكورات الرئوية تتصدر؛ الماكروليدات وحدها لم تعد كافية — اجعلها ضمن المشاركة أو للانمطي الموثق." },
      { fr: "Le sujet âgé fait des pneumonies SANS fièvre : confusion, chute, polypnée, désaturation = radio thoracique.", ar: "المسن يصاب بالتهاب رئة دون حمى: تخليط، سقوط، تسرع تنفس، نقص أكسجة = صورة صدر." },
      { fr: "Épanchement parapneumonique : pH < 7,2 ou pus = drainage — l'antibiotique seul ne stérilise pas un empyème.", ar: "انصباب جنب مجاور للالتهاب: ‏pH < 7.2 أو قيح = تصريف — المضاد وحده لا يعقم الدبيلة." },
    ],
    trajectory: [
      { when: { fr: "Désaturation malgré oxygène, FR > 30, signes de choc", ar: "نقص أكسجة رغم الأكسجين، تنفس > 30، علامات صدمة" }, do: [
        { fr: "Pneumonie grave → VNI ou intubation selon critères, réanimation, élargir l'ATB (Pseudomonas ? aspiration ?).", ar: "التهاب رئة خطير ⇒ تهوية غير باضعة أو تنبيب حسب المعايير، إنعاش، توسيع المضاد (زائفة؟ استنشاق؟)." },
        { fr: "Si choc septique : remplissage, vasopresseurs, réanimation — voir protocole choc septique.", ar: "عند الصدمة الإنتانية: تعبئة، مقويات أوعية، إنعاش — انظر بروتوكول الصدمة الإنتانية." },
      ]},
      { when: { fr: "Fièvre persistante à J3", ar: "حمى مستمرة باليوم 3" }, do: [
        { fr: "Imagerie de contrôle (épanchement/abcès), réévaluation du germe, chercher une fièvre médicamenteuse ou une TEPC nosocomiale.", ar: "تصوير مراقب (انصباب/خراج)، إعادة تقييم الجرثوم، وازن حمى دوائية أو صمة استشفائية." },
      ]},
    ],
    medications: ["amoxicilline", "azithromycine", "cefotaxime", "paracetamol"],
    calculators: ["curb65", "gazometrie"],
    meta: { sources: ["BTS CAP 2023", "SPILF/ATS-IDSA"], lastReviewed: "2026-09" },
  },
  {
    id: "bronchiolite",
    title: { fr: "Bronchiolite aiguë du nourrisson", ar: "التهاب قصيبات حاد عند الرضيع" },
    category: "pediatrie",
    severity: "urgent",
    summary: { fr: "Épidémie d'hiver : rhinite puis dyspnée sifflante + signes de lutte. Le traitement = oxygène + alimentation. Bronchodilatateurs non systématiques, kiné respiratoire abandonnée.", ar: "وباء الشتاء: زكام ثم ضيق تنفس مع أزيز + علامات جهد. العلاج = أكسجين + تغذية. موسعات القصبات ليست روتينية، والعلاج الفيزيائي الصدري متروك." },
    exams: {
      bio: [{ fr: "Aucun bilan systématique ; SpO₂ = le marqueur clé ; PCR VRS si épidémiologie utile", ar: "لا تحاليل روتينية؛ ‏SpO₂ هو المشعر الأساسي؛ PCR للفيروس المخلوي إن أفاد وبائياً" }],
      img: [{ fr: "Radio thoracique NON systématique (sauf doute : corps étranger, pneumonie, cardiopathie)", ar: "صورة الصدر ليست روتينية (إلا عند الشك: جسم غريب، التهاب رئة، مرض قلب)" }],
    },
    steps: [
      { title: { fr: "Évaluer la gravité : FR, tirage (intercostal/sous-costal/sternal), battement des ailes du nez, geignement, pauses, troubles de la prise alimentaire (< 50 % des biberons), SpO₂", ar: "قيّم الخطورة: تنفس، سحب (بين أضلاع/تحت ضلعي/قصي)، رفرفة أنف، أنين، توقفات، اضطراب التغذية (< 50% من الرضعات)، ‏SpO₂" } },
      { title: { fr: "Désobstruction rhinopharyngée (DRP) au sérum physiologique AVANT les repas — le nourrisson respire par le nez", ar: "تفريغ أنفي بلعومي بمحلول ملحي قبل الرضعات — الرضيع يتنفس من أنفه" } },
      { title: { fr: "Oxygène si SpO₂ < 92 % (objectif > 92-94 %) — premier traitement de la forme grave", ar: "أكسجين إذا SpO₂ < 92% (الهدف > 92-94%) — أول علاج للشكل الخطير" } },
      { title: { fr: "Épreuve de bronchodilatateur (salbutamol nébulisé/poudre) UNIQUEMENT si atopie/antécédent de sifflements — poursuivre seulement si réponse claire", ar: "تجربة موسع قصبات (سالبيتامول رذاذ) فقط عند التأتب/تاريخ أزيز — واصلها فقط عند استجابة واضحة" } },
      { title: { fr: "Alimentation fractionnée (petits volumes répétés) ; sonde nasogastrique ou IV si < 50 % des prises ou apnées", ar: "تغذية مجزأة (حجوم صغيرة متكررة)؛ أنبوب معدي أو وريدي إذا < 50% من الرضعات أو توقفات نفس" } },
      { title: { fr: "Hospitalisation si : < 3 mois, prématurité, SpO₂ < 92 %, troubles alimentaires, parents épuisés/doute sur la surveillance, comorbidités (cardiopathie, dysplasie)", ar: "إدخال إذا: < 3 أشهر، خداج، ‏SpO₂ < 92%، اضطراب تغذية، أهل منهكون/شك بالمراقبة، أمراض مرافقة (قلب، خلل تنسج)" } },
      { title: { fr: "Surveillance rapprochée des 48 premières heures (pic de gravité J3-J5) — consignes écrites de retour aux parents", ar: "مراقبة لصيقة لأول 48 ساعة (ذروة الخطورة ي3-ي5) — تعليمات مكتوبة للأهل للعودة" } },
    ],
    keyPoints: [
      { fr: "Tunisie : épidémies hivernales (novembre-mars) qui saturent les services de pédiatrie — le triage par SpO₂ + alimentation évite des hospitalisations inutiles.", ar: "تونس: أوبئة شتوية (نوفمبر-مارس) تشبع أقسام الأطفال — التفرز بـ SpO₂ + التغذية يجنب إدخالات لا لزوم لها." },
      { fr: "Corticoïdes et adrénaline nébulisée : PAS en routine ; kinésithérapie respiratoire : plus recommandée. Le socle = oxygène + nutrition + patience.", ar: "الكورتيزون والأدرينالين رذاذاً: ليسا روتيناً؛ العلاج الفيزيائي الصدري: لم يعد موصى به. الأساس = أكسجين + تغذية + صبر." },
      { fr: "Apnées chez le < 2 mois : signe de gravité majeur même sans détresse respiratoire marquée — hospitalisation systématique.", ar: "توقفات النفس عند < شهرين: علامة خطورة كبرى ولو دون ضائقة بارزة — إدخال منهجي." },
    ],
    trajectory: [
      { when: { fr: "Épuisement respiratoire : geignement, pauses, SpO₂ qui chute malgré O₂", ar: "إنهاك تنفسي: أنين، توقفات، هبوط SpO₂ رغم الأكسجين" }, do: [
        { fr: "Réanimation pédiatrique : VNI (CPAP) puis intubation — transfert en unité spécialisée.", ar: "إنعاش أطفال: تهوية غير باضعة (CPAP) ثم تنبيب — تحويل لوحدة مختصة." },
      ]},
      { when: { fr: "Déshydratation (perte > 5 %, pli cutané, fontanelle creusée)", ar: "تجفاف (فقد > 5%، ثنية جلد، يافوخ غائر)" }, do: [
        { fr: "Protocole de déshydratation : SNG ou IV selon degré.", ar: "بروتوكول التجفاف: أنبوب معدي أو وريدي حسب الدرجة." },
        { fr: "Basculer sur le protocole déshydratation de l'enfant (SNG ou IV selon degré).", ar: "انتقل إلى بروتوكول تجفاف الطفل (أنبوب معدي أو وريدي حسب الدرجة)." },
      ]},
    ],
    medications: ["salbutamol"],
    calculators: ["poids-pediatrique", "fluids-enfant"],
    meta: { sources: ["HAS bronchiolite 2019", "AAP 2014"], lastReviewed: "2026-09" },
  },
  {
    id: "laryngite-croup",
    title: { fr: "Laryngite aiguë (croup) de l'enfant", ar: "التهاب الحنجرة الحاد (خناق) عند الطفل" },
    category: "pediatrie",
    severity: "urgent",
    summary: { fr: "Toux aboyante + voix rauque + stridor inspiratoire nocturne. Dexaméthasone 0,6 mg/kg POUR TOUS. Adrénaline nébulisée si stridor au repos. Ne pas agiter l'enfant.", ar: "سعال نابح + بحة + صرير شهيق ليلي. ديكساميثازون 0.6 ملغ/كغ للجميع. أدرينالين رذاذي عند الصرير بالراحة. لا تهيج الطفل." },
    exams: {
      bio: [{ fr: "Aucun — diagnostic clinique ; SpO₂ si détresse", ar: "لا شيء — تشخيص سريري؛ ‏SpO₂ عند الضائقة" }],
      img: [{ fr: "Radio inutile en routine (signe du clocher seulement si doute épiglottite/ corps étranger)", ar: "صورة غير مفيدة روتيناً (علامة البرج فقط عند الشك بلهاة/جسم غريب)" }],
    },
    steps: [
      { title: { fr: "Tableau typique : 6 mois-3 ans, toux aboyante nocturne, voix rauque, stridor INSPIRATOIRE, tirage sus-sternal, fièvre modérée", ar: "اللوحة النمطية: 6 أشهر-3 سنوات، سعال نابح ليلي، بحة، صرير شهيق، سحب فوق قصي، حمى متوسطة" } },
      { title: { fr: "Garder l'enfant CALME dans les bras des parents — l'agitation majore l'obstruction ; pas d'examen de gorge forcé", ar: "أبق الطفل هادئاً بحضن أهله — الانفعال يزيد الانسداد؛ لا فحص حلق قسري" } },
      { title: { fr: "DEXAMÉTHASONE 0,6 mg/kg PO/IM/IV en dose UNIQUE — toutes les formes, même légères (effet dès 30 min, dure 72 h)", ar: "ديكساميثازون 0.6 ملغ/كغ فموياً/عضلياً/وريدياً بجرعة وحيدة — كل الأشكال ولو خفيفة (مفعول خلال 30 د يدوم 72 س)" } },
      { title: { fr: "Stridor AU REPOS (forme modérée/sévère) : adrénaline nébulisée 0,5 mg/kg (max 5 mg) — surveillance 2-4 h (effet rebond à 2 h)", ar: "صرير بالراحة (متوسط/شديد): أدرينالين رذاذي 0.5 ملغ/كغ (أقصى 5 ملغ) — مراقبة 2-4 س (ارتداد بعد ساعتين)" } },
      { title: { fr: "Éliminer les urgences : épiglottite (enfant toxique, bavant, penché en avant, vacciné ?), corps étranger (début brutal sans prodromes), angine de Vincent", ar: "استبعد الطوارئ: التهاب لسان المزمار (طفل منهك، يسيل لعابه، منحنٍ للأمام، ملقح؟)، جسم غريب (بدء مفاجئ دون بوادر)، خناق فنسنت" } },
      { title: { fr: "Hospitalisation si : stridor au repos persistant après adrénaline, tirage marqué, hypoxie, < 6 mois, terrain fragile, accès aux soins incertain", ar: "إدخال إذا: صرير راحة مستمر بعد الأدرينالين، سحب بارز، نقص أكسجة، < 6 أشهر، أرضية هشة، وصول صعب للرعاية" } },
    ],
    keyPoints: [
      { fr: "Score de Westley : stridor au repos + tirage = au moins modérée ⇒ adrénaline nébulisée + dexaméthasone, observation obligatoire 2-4 h.", ar: "سكور ويستلي: صرير بالراحة + سحب = متوسط على الأقل ⇒ أدرينالين رذاذي + ديكساميثازون، ومراقبة إلزامية 2-4 س." },
      { fr: "L'adrénaline nébulisée a un effet REBOND : ne jamais renvoyer un enfant dans les 2 h suivant une nébulisation.", ar: "للأدرينالين الرذاذي أثر ارتدادي: لا ترجع طفلاً أبداً خلال ساعتين من الرذاذ." },
      { fr: "Épiglottite (rare post-vaccin Hib) : ne JAMAIS examiner la gorge, position assise respectée, intubation en milieu spécialisé — c'est le diagnostic à ne pas manquer.", ar: "التهاب لسان المزمار (نادر بعد لقاح Hib): لا تفحص الحلق أبداً، احترم وضعية الجلوس، تنبيب بوسط مختص — التشخيص الذي لا يفوت." },
    ],
    trajectory: [
      { when: { fr: "Détresse respiratoire majeure, cyanose, épuisement", ar: "ضائقة تنفسية كبرى، زرقة، إنهاك" }, do: [
        { fr: "Adrénaline nébulisée répétée + intubation par le plus expérimenté (sonde plus petite d'1/2 taille) — préparer la trachéotomie de secours.", ar: "أدرينالين رذاذي متكرر + تنبيب بيد الأكثر خبرة (أنبوب أصغر بنصف مقاس) — جهز شق حنجرة احتياطياً." },
      ]},
      { when: { fr: "Récidive de stridor après amélioration (rebond à 2 h)", ar: "عودة الصرير بعد التحسن (ارتداد بساعتين)" }, do: [
        { fr: "Nouvelle nébulisation + observation prolongée ± hospitalisation — le rebond impose toujours la surveillance.", ar: "رذاذ جديد + مراقبة مطولة ± إدخال — الارتداد يفرض المراقبة دائماً." },
      ]},
    ],
    medications: ["dexamethasone", "adrenaline"],
    calculators: ["westley", "poids-pediatrique"],
    meta: { sources: ["Groupe croup Canada 2022", "NICE croup"], lastReviewed: "2026-09" },
  },
  {
    id: "corps-etranger-aerien",
    title: { fr: "Obstruction aiguë des voies aériennes par corps étranger", ar: "انسداد المجرى الهوائي الحاد بجسم غريب" },
    category: "pediatrie",
    severity: "critical",
    summary: { fr: "Obstruction complète (ne tousse pas, ne parle pas, cyanose) : 5 claques dorsales + 5 compressions alternées, sans relâche jusqu'à expulsion ou inconscience. Obstruction partielle (tousse efficace) : encourager à tousser, ne RIEN faire d'autre.", ar: "انسداد كامل (لا يسعل، لا يتكلم، زرقة): 5 ضربات ظهر + 5 ضغطات متناوبة دون توقف حتى الخروج أو فقد الوعي. جزئي (سعال فعال): شجعه على السعال ولا تفعل شيئاً آخر." },
    exams: {
      bio: [],
      img: [{ fr: "Après l'urgence : radio thoracique ± cervicale (corps étranger radio-opaque ? atélectasie ? emphysème unilatéral ?) — la radio normale n'exclut rien", ar: "بعد الطوارئ: صورة صدر ± رقبة (جسم ظل شعاعي؟ انخماص؟ انتفاخ وحيد الجانب؟) — الصورة الطبيعية لا تستبعد شيئاً" }],
    },
    steps: [
      { title: { fr: "Évaluer en 5 secondes : OBSTRUCTION COMPLÈTE (pas de toux, pas de voix, signe universel d'étouffement, cyanose) vs PARTIELLE (tousse vigoureuse, voix conservée)", ar: "قيّم خلال 5 ثوان: انسداد كامل (لا سعال، لا صوت، إشارة الاختناق العالمية، زرقة) مقابل جزئي (سعال قوي، صوت محفوظ)" } },
      { title: { fr: "PARTIELLE avec toux efficace : ENCOURAGER À TOUSSER, surveiller, ne pas taper dans le dos, ne pas faire de Heimlich — on aggrave en déplaçant le corps étranger", ar: "جزئي مع سعال فعال: شَجّع السعال، راقب، لا تضرب الظهر، لا heimlich — التدخل يزيح الجسم ويزيد الأمر" } },
      { title: { fr: "COMPLÈTE, nourrisson < 1 an : 5 CLAQUES DORSALES (tête plus basse que le thorax, talon de main entre les omoplates) puis 5 COMPRESSIONS THORACIQUES (2 doigts, sternum) — alterner sans s'arrêter", ar: "كامل، رضيع < سنة: 5 ضربات ظهر (الرأس أخفض من الصدر، كعب اليد بين الكتفين) ثم 5 ضغطات صدرية (إصبعان، قص) — تناوب دون توقف" } },
      { title: { fr: "COMPLÈTE, enfant > 1 an et adulte : 5 claques dorsales puis 5 COMPRESSIONS ABDOMINALES (Heimlich : poing sous-xiphoïdien, traction vers le haut et l'arrière) — alterner", ar: "كامل، طفل > سنة وبالغ: 5 ضربات ظهر ثم 5 ضغطات بطنية (هايمليك: قبضة تحت الخنجري، شد للأعلى والخلف) — تناوب" } },
      { title: { fr: "Perte de conscience : allonger, RCP immédiate — à chaque insufflation et avant chaque série de compressions, VÉRIFIER la bouche et retirer le CE si visible", ar: "فقد الوعي: أضجعه، إنعاش فوري — قبل كل نفخة وكل سلسلة ضغطات افحص الفم وانزع الجسم إن ظهر" } },
      { title: { fr: "JAMAIS de finger-sweep à l'aveugle (pousse le CE plus loin) ; jamais d'extraction sans le voir (sauf personnel entraîné à la laryngoscopie)", ar: "أبداً مسح إصبعي أعمى (يدفع الجسم أعمق)؛ لا نزع دون رؤيته (إلا بمدرب على الحنجرة)" } },
      { title: { fr: "APRÈS expulsion : examen médical systématique (lésions des manœuvres, fragment résiduel) + radio ; suspicion de CE inhalé passé inaperçu (toux chronique, sifflements unilatéraux, pneumopathies récidivantes) = bronchoscopie", ar: "بعد الخروج: فحص طبي منهجي (إصابات المناورات، شظية باقية) + صورة؛ اشتباه استنشاق خفي (سعال مزمن، أزيز وحيد الجانب، التهابات ناكسة) = تنظير قصبات" } },
      { title: { fr: "Prévention (à expliquer aux parents) : pas de cacahuètes/fruits à coce/raisins entiers/bonbons durs avant 5 ans ; couper les raisins/saucisses en long ; petits jouets hors de portée", ar: "وقاية (اشرحها للأهل): لا فول سوداني/مكسرات/عنب كامل/حلوى قاسية قبل 5 سنوات؛ قطع العنب/النقانق طولياً؛ الألعاب الصغيرة بعيداً" } },
    ],
    keyPoints: [
      { fr: "Pic 1-3 ans : arachides, graines, morceaux de fruits, jouets. Début BRUTAL chez un enfant qui allait bien = CE jusqu'à preuve du contraire.", ar: "الذروة 1-3 سنوات: فول سوداني، بذور، قطع فاكهة، ألعاب. بدء مفاجئ عند طفل كان بخير = جسم غريب حتى يثبت العكس." },
      { fr: "Le réflexe des proches (taper dans le dos d'un enfant qui tousse bien) transforme une obstruction partielle en obstruction complète — c'est LE message de prévention.", ar: "رد فعل الأهل (ضرب ظهر طفل يسعل جيداً) يحول الانسداد الجزئي إلى كامل — هذه رسالة الوقاية الأهم." },
      { fr: "Femme enceinte obèse ou enceinte : compressions THORACIQUES au lieu des abdominales.", ar: "امرأة حامل أو بدينة: ضغطات صدرية بدل البطنية." },
    ],
    trajectory: [
      { when: { fr: "CE expulsé mais toux/sifflement persistants", ar: "خرج الجسم مع بقاء سعال/أزيز" }, do: [
        { fr: "Évoquer un deuxième CE ou un fragment — radio + avis ORL/pneumo-pédiatrie (bronchoscopie si doute).", ar: "اشتهِ جسماً ثانياً أو شظية — صورة + رأي أذن/صدر أطفال (تنظير عند الشك)." },
      ]},
      { when: { fr: "Après manœuvres : douleur abdominale/thoracique", ar: "بعد المناورات: ألم بطن/صدر" }, do: [
        { fr: "Chercher la complication des manœuvres : lésion hépatique/splénique, fracture de côte — examen ± écho FAST.", ar: "ابحث عن اختلاط المناورات: إصابة كبد/طحال، كسر ضلع — فحص ± إيكو FAST." },
      ]},
    ],
    medications: [],
    calculators: ["rcp-peds", "broselow"],
    meta: { sources: ["ERC 2021 choking", "AHA BLS 2025"], lastReviewed: "2026-09" },
  },
  {
    id: "drepanocytose-crise",
    title: { fr: "Crise drépanocytaire (CVO & syndrome thoracique aigu)", ar: "نوبة الخلايا المنجلية (انسداد أوعية مؤلم ومتلازمة صدرية حادة)" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "La douleur EST l'urgence : morphine titrée dans les 30 min, hydratation, chaleur, oxygène seulement si désaturation. Fièvre = bilan infectieux complet. Syndrome thoracique aigu = urgence vitale.", ar: "الألم هو الطارئ: مورفين معاير خلال 30 دقيقة، إماهة، تدفئة، أكسجين فقط عند نقص الأكسجة. الحمى = استقصاء إنتاني كامل. المتلازمة الصدرية الحادة = طوارئ حيوية." },
    exams: {
      bio: [{ fr: "NFS + réticulocytes (comparer au taux de base !), CRP, bilan hémolyse (LDH, bilirubine, haptoglobine), groupe/phénotype étendu, ECG", ar: "عد دم + شبكيات (قارن بالأساس!)، CRP، تحلل دم (LDH، بيليروبين، هابتوغلوبين)، زمرة/نمط موسع، تخطيط" }],
      img: [{ fr: "Radio thoracique si fièvre/toux/douleur thoracique (syndrome thoracique aigu) ; échographie (vésicule, rate)", ar: "صورة صدر عند الحمى/السعال/ألم الصدر (متلازمة صدرية)؛ إيكو (مرارة، طحال)" }],
    },
    steps: [
      { title: { fr: "Évaluer la douleur (EVA/échelle adaptée) et CROIRE le patient — le retard analgésique est la faute la plus fréquente aux urgences", ar: "قيّم الألم (مقياس مناسب) وصدّق المريض — تأخير التسكين أكثر الأخطاء شيوعاً بالطوارئ" } },
      { title: { fr: "MORPHINE titrée dans les 30 minutes : bolus 2-4 mg IV renouvelables (ou PCA) — la crise vaso-occlusive n'attend pas", ar: "مورفين معاير خلال 30 دقيقة: دفعات 2-4 ملغ وريدية متكررة (أو مضخة مريض) — النوبة الانسدادية لا تنتظر" } },
      { title: { fr: "Paliers associés : paracétamol ± néfopam ; AINS possibles (kétoprofène) si fonction rénale normale et hydratation correcte", ar: "أدوية مرافقة: باراسيتامول ± نيفوبام؛ مضادات التهاب ممكنة (كيتوبروفين) إذا الكلى طبيعية والإماهة كافية" } },
      { title: { fr: "Hydratation : NaCl 0,9 % ou G5 % 1-1,5× l'entretien (ni surcharge ni restriction — l'hémoconcentration aggrave la falciformation)", ar: "إماهة: محلول أو غلوكوز 1-1.5 ضعف الصيانة (لا إفراط ولا تقتير — تركيز الدم يفاقم التم sickling)" } },
      { title: { fr: "Chaleur locale sur les zones douloureuses, éviter le froid ; oxygène UNIQUEMENT si SpO₂ < 94 % (l'hyperoxie n'aide pas)", ar: "تدفئة موضعية على المناطق المؤلمة، تجنب البرد؛ أكسجين فقط إذا SpO₂ < 94% (فرط الأكسجة لا يفيد)" } },
      { title: { fr: "FIÈVRE ≥ 38,5 °C = urgence infectieuse (asplénie fonctionnelle) : hémocultures + céfotaxime/ceftriaxone empirique dans l'heure", ar: "حمى ≥ 38.5 = طوارئ إنتانية (طحال معطل وظيفياً): مزارع دم + سيفوتاكسيم/سيفترياكسون تجريبي خلال ساعة" } },
      { title: { fr: "SYNDROME THORACIQUE AIGU (fièvre + douleur thoracique + infiltrat + hypoxie) : oxygène, ATB (ceftriaxone + macrolide), transfusion/exsanguino-transfusion selon gravité, spirométrie incitative, réanimation", ar: "متلازمة صدرية حادة (حمى + ألم صدر + ارتشاح + نقص أكسجة): أكسجين، مضادات (سيفترياكسون + ماكروليد)، نقل/استبدال دم حسب الخطورة، تحفيز تنفسي، إنعاش" } },
      { title: { fr: "Chercher le facteur déclenchant : infection, déshydratation, froid, altitude, arrêt d'hydroxyurée", ar: "ابحث عن المحرض: إنتان، تجفاف، برد، ارتفاع، إيقاف هيدروكسي يوريا" } },
    ],
    keyPoints: [
      { fr: "Tunisie : la drépanocytose est présente (notamment sud et chez les patients d'origine subsaharienne) — connaître le taux d'hémoglobine DE BASE du patient est capital : une chute > 2 g/dL = séquestration/aplasie.", ar: "تونس: الخلايا المنجلية موجودة (خصوصاً الجنوب وعند المرضى من أصول إفريقية جنوبية) — معرفة خضاب المريض الأساسي جوهرية: هبوط > 2 غ/دل = احتباس/لا تنسج." },
      { fr: "La crise douloureuse simple ne donne ni fièvre élevée ni infiltrat — fièvre + thorax = syndrome thoracique aigu, première cause de mort chez le drépanocytaire adulte.", ar: "النوبة المؤلمة البسيطة لا تعطي حمى عالية ولا ارتشاحاً — حمى + صدر = متلازمة صدرية حادة، أول سبب وفاة للبالغ المنجلي." },
      { fr: "Séquestration splénique (enfant : rate qui grossit + pâleur + choc) et aplasie érythroblastopénique (parvovirus B19 : réticulocytes effondrés) sont des urgences transfusionnelles.", ar: "احتباس طحالي (طفل: طحال يكبر + شحوب + صدمة) ولا تنسج أحمر (بارفو B19: شبكيات منهارة) طوارئ نقل دم." },
    ],
    trajectory: [
      { when: { fr: "Douleur non contrôlée malgré morphine titrée à 1-2 h", ar: "ألم غير مضبوط رغم مورفين معاير 1-2 س" }, do: [
        { fr: "PCA morphine + hospitalisation ; réévaluer le diagnostic (ostéomyélite, séquestration, complication abdominale chirurgicale).", ar: "مضخة مورفين + إدخال؛ أعد التشخيص (التهاب عظم، احتباس، مضاعفة بطنية جراحية)." },
      ]},
      { when: { fr: "Pâleur brutale + rate volumineuse + choc (enfant)", ar: "شحوب مفاجئ + طحال ضخم + صدمة (طفل)" }, do: [
        { fr: "Séquestration splénique : transfusion urgente + réanimation — urgence absolue.", ar: "احتباس طحالي: نقل دم عاجل + إنعاش — طوارئ مطلقة." },
        { fr: "Calculer le volume transfusionnel avec la calculatrice transfusion.", ar: "احسب حجم النقل بحاسبة نقل الدم." },
      ]},
    ],
    medications: ["morphine", "paracetamol", "cefotaxime", "azithromycine"],
    calculators: ["dose-poids", "transfusion"],
    meta: { sources: ["HAS drépanocytose 2010", "ASH sickle cell 2020"], lastReviewed: "2026-09" },
  },
];

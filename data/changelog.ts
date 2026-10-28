// سجل المستجدات المعروض داخل التطبيق (`/changelog`).
//
// v17.0 — كان هذا السجل متوقفًا عند الإصدار 2.1 بينما التطبيق في 16.2: أي أن
// «الجديد» الذي يراه المستخدم كان قديمًا بأربعة عشر إصدارًا. صار الآن مواكبًا.
// Enveloppe FR/AR : chaque note existe dans les deux langues (vérifié par les tests).
import type { Localized } from "./types";

export interface Release { v: string; date: string; notes: Localized[] }

export const CHANGELOG: Release[] = [
  {
    v: "18.2",
    date: "2026-10-28",
    notes: [
      {
        fr: "Réévaluation : les seuils de glycémie sont maintenant cohérents avec la saisie en g/L (hypoglycémie <0,7 g/L, équivalent de 70 mg/dL selon ADA 2026). Le seuil de 0,8 g/L de l'alerte surrénalienne reste une heuristique non diagnostique, à valider localement.",
        ar: "إعادة التقييم: أصبحت عتبات سكر الدم متوافقة مع الإدخال بوحدة غ/ل (نقص السكر <0.7 غ/ل، أي 70 مغ/دل وفق ADA 2026). وتبقى عتبة 0.8 غ/ل في تنبيه الكظر إشارة غير تشخيصية تحتاج إلى تحقق محلي.",
      },
      {
        fr: "Hypoglycémie adulte : suppression de l'équivalence erronée « 1 ampoule G30 = 10 g ». La dose générale de 10–15 g est sourcée par la synthèse HAS 2025 (reprise ADA 2024) ; la concentration de PROAMP est indiquée séparément (3 g par ampoule de 10 mL). Les notices tunisiennes SIPHAT/INFOMED et la conduite locale restent à valider.",
        ar: "نقص السكر لدى البالغ: أُزيلت المعادلة الخاطئة «أمبولة G30 واحدة = 10 غ». جرعة 10–15 غ موثقة في ملخص HAS لسنة 2025 (نقلاً عن ADA 2024)، وفُصل عنها تركيز PROAMP (3 غ في أمبولة 10 مل). ما زالت نشرات SIPHAT/INFOMED التونسية والتدبير المحلي بحاجة إلى تحقق.",
      },
      {
        fr: "Sufentanil pédiatrique : retrait de la dose ambiguë sans unité de temps ; seule l'induction IV chez l'enfant de plus d'un mois est reprise du RCP SUFENTA (bolus lent 0,2–0,5 µg/kg, avec un autre agent). Aucun schéma IV n'est recommandé par ce RCP chez le nouveau-né ; pas de perfusion continue pédiatrique extrapolée.",
        ar: "سوفنتانيل الأطفال: أُزيلت الجرعة الملتبسة بلا وحدة زمنية؛ وأُبقي فقط تحريض التخدير الوريدي لمن تجاوز شهراً، وفق نشرة SUFENTA (دفعة بطيئة 0.2–0.5 مكغ/كغ مع عامل آخر). لا توصي النشرة بجرعة وريدية لحديث الولادة؛ ولم تُستنتج جرعة تسريب مستمر للأطفال.",
      },
      {
        fr: "NaCl hypertonique : retrait de la recette qui donne 4,08 % au lieu du 3,7 % annoncé ; calcul théorique de 3 % relégué à une préparation pharmaceutique selon procédure locale validée. Les poches prêtes à l'emploi restent préférées.",
        ar: "محلول NaCl مفرط التوتر: أُزيلت الوصفة التي تعطي 4.08٪ بدلاً من 3.7٪ المعلنة؛ ووُضع حساب 3٪ النظري ضمن التحضير الصيدلي وفق إجراء محلي معتمد. تبقى الأكياس الجاهزة مفضلة.",
      },
      {
        fr: "Propofol : les règles pédiatriques et de durée d'utilisation sont maintenant propres à l'indication et à la présentation. Pour DIPRIVAN 10 mg/mL, l'anesthésie générale est autorisée après 1 mois, mais la sédation en soins intensifs est contre-indiquée avant 16 ans ; une solution diluée se prépare immédiatement et s'utilise sous 6 h, tandis que la perfusion non diluée peut aller jusqu'à 12 h selon le RCP. Les reliquats ne se conservent pas et ces règles ne sont pas généralisées aux produits locaux.",
        ar: "بروبوفول: أصبحت قيود الأطفال ومدة الاستخدام مرتبطة بالاستطباب والمستحضر. وفق نشرة DIPRIVAN 10 ملغ/مل، يمكن التخدير العام بعد عمر شهر، لكن تهدئة العناية المركزة ممنوعة قبل 16 سنة؛ ويُحضّر المحلول المخفف فوراً ويُستخدم خلال 6 ساعات، بينما يمكن أن يستمر التسريب غير المخفف حتى 12 ساعة وفق النشرة. لا تُحفظ البقايا ولا تُعمم هذه القواعد على المستحضرات المحلية.",
      },
      {
        fr: "Éclampsie : priorité à la stabilisation maternelle avant la naissance. Après stabilisation, l'équipe obstétricale décide du moment et de la voie selon l'état maternel et fœtal ainsi que les facteurs obstétricaux ; l'éclampsie seule n'impose pas une césarienne. Cette formulation suit l'ACOG Practice Bulletin No. 222 (2020), sans remplacer un protocole local.",
        ar: "الارتعاج: تُعطى الأولوية لتثبيت الأم قبل الولادة. بعد الاستقرار، يحدد فريق التوليد التوقيت والطريقة وفق حالتي الأم والجنين والعوامل التوليدية؛ والارتعاج وحده لا يفرض القيصرية. تستند الصياغة إلى نشرة ACOG رقم 222 لعام 2020، ولا تحل محل بروتوكول محلي.",
      },
      {
        fr: "Hémorragie digestive haute : retrait du furosémide hors indication. L'octréotide n'est référencé que pour la branche cirrhose/suspicion de varices ; l'acide tranexamique n'est pas ajouté, l'ESGE ne le recommandant pas dans l'hémorragie non variqueuse. Revue clinique locale requise.",
        ar: "النزف الهضمي العلوي: أُزيل الفوروسيميد لعدم ملاءمته. يرتبط الأوكتريوتيد فقط بفرع تشمع الكبد أو الاشتباه بالدوالي؛ ولم يُضف حمض الترانيكساميك لأن ESGE لا توصي به في النزف غير الدوالي. يلزم تقييم سريري محلي.",
      },
      {
        fr: "Centre antipoison : les coordonnées affichées dans les protocoles sont harmonisées provisoirement sur le 71 335 500, cité par l'ambassade des États-Unis en Tunisie en 2025. Aucune source officielle tunisienne actuelle confirmant le numéro n'a été trouvée ; confirmation locale indispensable avant usage.",
        ar: "مركز السموم: وُحّد رقم الاتصال المعروض في البروتوكولات مبدئياً إلى 71 335 500، وهو رقم أوردته سفارة الولايات المتحدة في تونس سنة 2025. لم يُعثر على مصدر تونسي رسمي حديث يؤكد الرقم؛ يلزم التحقق محلياً قبل استعماله.",
      },
      {
        fr: "Noradrénaline : concentration harmonisée à 8 mg de base/50 mL (160 µg/mL) dans la fiche, les abaques et la pompe. Le compte d'ampoules dépend de l'équivalence base/tartrate du RCP local ; ne pas la deviner à partir du dosage commercial. Le débit mg/h a été recalculé pour cette concentration.",
        ar: "نورأدرينالين: وُحّد التركيز إلى 8 ملغ قاعدة فعالة/50 مل (160 مكغ/مل) في البطاقة والجداول والمضخة. يعتمد عدد الأمبولات على مكافئ القاعدة/الطرطرات في نشرة المستحضر المحلي؛ لا تخمّنه من التركيز التجاري. أُعيد حساب معدل ملغ/ساعة وفق هذا التركيز.",
      },
      {
        fr: "Labétalol : suppression du bolus adulte non sourcé de 1 mg/kg ; la dose est maintenant fixe et la perfusion est exprimée en mg/min, conformément aux sources vérifiées. Le protocole obstétrical local doit être confirmé.",
        ar: "لابيتالول: أُزيلت دفعة البالغ غير المسندة بجرعة 1 ملغ/كغ؛ أصبحت الجرعة ثابتة والتسريب بوحدة ملغ/دقيقة وفق المصادر التي تمت مراجعتها. يجب تأكيد بروتوكول التوليد المحلي.",
      },
      {
        fr: "Naloxone : distinction entre dose pédiatrique de surdosage aigu (0,1 mg/kg, max 2 mg/dose) et titration adulte. La voie intranasale n'est pas extrapolée à partir de l'ampoule injectable ; aucun dispositif IN local n'est documenté.",
        ar: "نالوكسون: فُصلت جرعة تسمم الأطفال الحاد (0.1 ملغ/كغ، بحد أقصى 2 ملغ للجرعة) عن معايرة البالغين. لم تُستنتج الجرعة الأنفية من أمبولة الحقن؛ ولا يوجد جهاز أنفي محلي موثق في قاعدة البيانات.",
      },
      {
        fr: "Pompe automatique : suppression de l'analyse fragile du premier nombre du texte libre. Elle n'est créée que depuis une préparation structurée dont la concentration concorde avec la donnée numérique ; sinon, un avertissement remplace le calcul. Cas dobuta/propofol couverts par des tests.",
        ar: "المضخة التلقائية: أُزيل تحليل أول رقم في النص الحر لأنه غير موثوق. لا تُنشأ المضخة إلا من تحضير مهيكل يطابق تركيزه القيمة الرقمية؛ وإلا يظهر تنبيه بدل الحساب. تشمل الاختبارات حالتي الدوبوتامين والبروبوفول.",
      },
      {
        fr: "Transferts IA : confirmation locale avant envoi des textes, avec fournisseur, modèle et extrait de demande ; l’explication des calculateurs bloque l’envoi si la destination change après confirmation. Analyse ECG restreinte aux observations descriptives filtrées, avec consentement spécifique pour l'image et sans diagnostic, gravité ou recommandations IA. Les anciennes analyses ECG sont assainies à la lecture.",
        ar: "نقل بيانات الذكاء الاصطناعي: تأكيد محلي قبل إرسال النص مع بيان المزوّد والنموذج ومقتطف من الطلب؛ ويُحجب إرسال شرح الحاسبة إذا تغيّرت الوجهة بعد التأكيد. حُصر تحليل ECG في ملاحظات وصفية مُنقّاة مع موافقة خاصة على إرسال الصورة، دون تشخيص أو درجة خطورة أو توصيات آلية. تُنقّى التحليلات القديمة عند قراءتها.",
      },
      {
        fr: "Quiz IA : format strict des questions/réponses et refus des chiffres et unités afin d’empêcher l’affichage de doses numériques générées. Le thème source et ses références restent visibles ; le quiz est signalé comme non vérifié et un quiz fixe est accessible. Ces contrôles ne valident pas la justesse médicale des réponses.",
        ar: "اختبار الذكاء الاصطناعي: فُرض تنسيق محدد للأسئلة والأجوبة ورُفضت الأرقام والوحدات لمنع عرض جرعات رقمية مولّدة. يظهر البروتوكول المصدر ومراجعه، مع تنبيه بأن الاختبار غير مُدقّق وإتاحة اختبار ثابت. لا تثبت هذه الضوابط صحة الإجابات الطبية.",
      },
      {
        fr: "Compte rendu IA : avertissement avant saisie sur la suppression des noms/identifiants et les règles de l’établissement ; la sortie est marquée comme brouillon non vérifié à relire et corriger avant transmission.",
        ar: "التقرير بالذكاء الاصطناعي: تنبيه قبل الإدخال لحذف الأسماء والمعرّفات والتحقق من قواعد المؤسسة؛ وتُعرض النتيجة كمسودة غير مدققة يجب مراجعتها وتصحيحها قبل التسليم.",
      },
      {
        fr: "Recherche assistée : les sorties IA sont limitées à 1–3 mots-clés alphabétiques bornés, sans chiffres ni prose. Une réponse non conforme est ignorée plutôt que d’être injectée dans les résultats de recherche.",
        ar: "البحث المساعد: حُصرت مخرجات الذكاء الاصطناعي في كلمة إلى ثلاث كلمات بحث حرفية محدودة، بلا أرقام أو نص إنشائي. تُهمل الإجابة غير المطابقة بدلاً من إدخالها في نتائج البحث.",
      },
      {
        fr: "Clé IA : elle reste désormais en mémoire vive jusqu’au rechargement, n’est pas enregistrée sur l’appareil et les anciennes clés persistées sont supprimées à la lecture de la configuration. Elle doit être ressaisie après rechargement.",
        ar: "مفتاح الذكاء الاصطناعي: يبقى الآن في الذاكرة المؤقتة حتى إعادة التحميل، ولا يُحفظ على الجهاز؛ وتُحذف المفاتيح القديمة المحفوظة عند قراءة الإعدادات. يجب إدخاله مجدداً بعد إعادة التحميل.",
      },
      {
        fr: "Données locales patient : archive assainie et supprimable par entrée ou en totalité ; l'écran avertit qu'aucune expiration automatique n'est appliquée. La réinitialisation générale efface aussi IndexedDB ECG.",
        ar: "بيانات المريض المحلية: نُقّح الأرشيف ويمكن حذف كل حالة أو الكل؛ وتوضح الشاشة عدم وجود انتهاء تلقائي للبيانات. تمسح إعادة الضبط العامة أيضاً سجل ECG في IndexedDB.",
      },
      {
        fr: "Accessibilité des dialogues : confinement/restauration du focus et arrière-plan inerte ajoutés à l’avertissement médical, la palette, la fiche d’abréviation et l’aide PWA ; Échap ferme les aides non bloquantes.",
        ar: "إتاحة النوافذ: أُضيف حصر/استعادة التركيز وتعطيل الخلفية إلى التحذير الطبي ولوحة الأوامر وشرح الاختصارات ومساعدة التثبيت؛ ويغلق Escape المساعدات غير الإلزامية.",
      },
      {
        fr: "Service worker : correction du repli hors-ligne sous un sous-chemin (GitHub Pages), où la route pouvait être préfixée deux fois et la fiche déjà en cache ignorée. Tests exécutés sur la navigation hors-ligne à la racine et avec base path.",
        ar: "عامل الخدمة: إصلاح الرجوع دون اتصال عند النشر داخل مسار فرعي (GitHub Pages)، إذ كان المسار يُضاف مرتين وقد لا تُعثر البطاقة المخزنة. اختُبر التنقل دون اتصال عند الجذر ومع المسار الفرعي.",
      },
    ],
  },
  {
    v: "18.1",
    date: "2026-09-21",
    // v18.1 — الطابق 2 و3: تقدير كلوي مزمن/حادّ/أطفال + خطّة علاج بحلقة إعادة تقييم a → b.
    notes: [
      {
        fr: "Correction rénale : seul le DFG CKD-EPI 2021 sélectionne la colonne adulte ; CKID U25 reste informatif chez l'enfant, sans dose du tableau adulte. Cockcroft–Gault (ClCr) est affiché séparément et ne choisit jamais de colonne. En AKI, le tableau de fonction rénale stable et tout choix manuel sont bloqués ; suivre une conduite adaptée avec un avis professionnel.",
        ar: "تصحيح الحساب الكلوي: DFG بمعادلة CKD-EPI 2021 وحده يختار عمود البالغ؛ CKID U25 معلومة للطفل ولا يفتح جرعة جدول البالغين. تُعرض ClCr بمعادلة Cockcroft–Gault منفصلة ولا تختار أي عمود. في AKI يُحجب جدول الوظيفة المستقرة والاختيار اليدوي؛ اتبع تدبيراً مناسباً مع رأي مهني."
      },
      {
        fr: "Garde-fous : dialyse/épuration extrarénale hors tableau et bloquée ; critères urinaires KDIGO distingués par stade. La règle automatique GPR « +2 stades » et son exception « molécules vitales » ont été retirées, faute de référence vérifiable pour cette transformation précise.",
        ar: "حواجز أمان: الغسيل/الإحلال الكلوي خارج الجدول ومحجوب؛ ومعايير البول في KDIGO مفصولة حسب المرحلة. أُزيلت قاعدة GPR الآلية «مرحلتان أشد» واستثناء «الأدوية الحيوية» لعدم العثور على مرجع قابل للتحقق لهذه القاعدة المحددة.",
      },
      {
        fr: "Dose sûre — amikacine Panpharma : calcul affiché uniquement pour l'adulte avec ClCr ≥50 mL/min et IMC vérifiable <30. En obésité, le poids corrigé indiqué par le RCP n'est pas calculé automatiquement ; la dose au poids réel est bloquée.",
        ar: "الجرعة الآمنة — أميكاسين Panpharma: لا يظهر الحساب إلا للبالغ مع ClCr ≥50 مل/د وإمكانية التحقق من BMI <30. عند البدانة لا يحسب النظام الوزن المصحح المذكور في النشرة؛ حُجب حساب الوزن الفعلي.",
      },
      {
        fr: "Plan antibiotique par patient (boucle a → b) : retenir ou abandonner chaque molécule avec motif, réévaluer en tours successifs, puis copier/imprimer la conduite — conservé localement, rien ne sort de l'appareil.",
        ar: "خطّة علاج لكل مريض (حلقة a → b): اعتماد أو تخلّي عن كل دواء مع السبب، وإعادة تقييم في جولات متتالية، ثم نسخ/طباعة الخطّة — محفوظة محليًا ولا شيء يخرج من الجهاز.",
      },
    ],
  },
  {
    v: "18.0",
    date: "2026-09-21",
    // v18.0 — جدول OMEDIT (93 تركيبة × 5 مراحل)؛ DFG لا ClCr لاختيار العمود.
    // تصحيح توثيقي: Cockcroft–Gault يُعرض منفصلاً ولا يختار مرحلة DFG.
    notes: [
      {
        fr: "Calculateur « Antibiotiques & fonction rénale » : les 93 lignes du tableau OMEDIT V2.3 sur 5 stades DFG, textes source affichés et dose absolue calculée au poids lorsque la cellule est calculable. Le DFG CKD-EPI choisit le stade ; Cockcroft–Gault (ClCr) est distinct et ne choisit pas la colonne.",
        ar: "حاسبة «المضادات الحيوية والوظيفة الكلوية»: 93 سطراً من جدول OMEDIT النسخة 2.3 على 5 مراحل DFG، مع عرض نص المصدر وحساب الجرعة بالوزن حين تكون الخلية قابلة للحساب. يختار DFG بمعادلة CKD-EPI المرحلة؛ وتبقى ClCr بمعادلة Cockcroft–Gault منفصلة ولا تختار العمود.",
      },
      {
        fr: "Signalements automatiques : contre-indication, « déconseillé », « aucune donnée » (à vérifier dans la source) et mention explicite du caractère NON dialysé.",
        ar: "تنبيهات آلية: ممنوع، «غير مُستحسن»، «لا بيانات» (يجب التحقق من المصدر) وإشارة صريحة إلى أن المريض غير خاضع للغسيل.",
      },
      {
        fr: "Jeu de données versionné et testé (`data/atb-renal.ts`, 35 tests) : chaque valeur est recoupée avec le PDF d'origine ; le tableau complet des 5 stades reste consultable ligne par ligne.",
        ar: "قاعدة معطيات مُختبَرة ومُوثَّقة (`data/atb-renal.ts`، 35 اختبارًا): كل قيمة مُقابَلة مع ملف PDF الأصلي، والجدول الكامل للمراحل الخمس متاح لكل سطر.",
      },
    ],
  },
  {
    v: "17.4",
    date: "2026-09-21",
    // v17.4 — إغلاق عنصر خارطة الطريق (d): التوجيه وإعادة التقييم صارا ملفًّا لكل بروتوكول،
    // وتحصين العمل دون اتصال: النقر على أي بطاقة من القوائم المفتوحة سابقًا يفتح الفيشة كاملة.
    notes: [
      {
        fr: "Hors-ligne renforcé : depuis une liste déjà ouverte, toucher une carte de protocole, de médicament ou de calculateur ouvre désormais la fiche complète en avion — avant, la liste s'ouvrait mais la fiche tombait sur la page « hors-ligne ».",
        ar: "تقوية العمل دون اتصال: من أي قائمة سبق فتحها، النقر على بطاقة بروتوكول أو دواء أو حاسبة يفتح الفيشة الكاملة في وضع الطيران — قبل ذلك كانت القائمة تُفتح أمّا الفيشة فتسقط على صفحة «دون اتصال».",
      },
      {
        fr: "Fiche protocole allégée de 320 Ko : le guidage et la réévaluation (2 Ko gzip pour une fiche) se chargent après le premier affichage, par fichier dédié.",
        ar: "تخفيف الفيشة بـ320 ك.ب: التوجيه وإعادة التقييم (2 ك.ب مضغوطة للفيشة) يُحمَّلان بعد العرض الأول عبر ملف مخصّص.",
      },
      {
        fr: "Réévaluation disponible en avion pour les 98 protocoles, avec sa cadence de boucle et ses critères.",
        ar: "إعادة التقييم متاحة دون اتصال في البروتوكولات الـ98، مع إيقاع الحلقة ومعاييرها.",
      },
    ],
  },
  {
    v: "17.3",
    date: "2026-09-21",
    notes: [
      {
        fr: "Liste des protocoles deux fois plus rapide : filtres par catégorie et recherche par titre fonctionnent sans télécharger les 98 fiches.",
        ar: "قائمة البروتوكولات أسرع بالضعف: الفلترة بالفئة والبحث بالعنوان يعملان دون تنزيل البطاقات الـ98.",
      },
      {
        fr: "Quiz de révision : le menu des thèmes s'affiche immédiatement ; le contenu du protocole n'est chargé qu'au moment de générer les questions.",
        ar: "اختبار المراجعة: قائمة المواضيع تظهر فورًا، ونصّ البروتوكول لا يُحمَّل إلا عند توليد الأسئلة.",
      },
    ],
  },
  {
    v: "17.2",
    date: "2026-09-21",
    notes: [
      {
        fr: "Fiches protocole et médicament deux fois plus légères : elles ne téléchargent plus les bases de médicaments, de calculatrices et de protocoles pour n'afficher que quelques liens.",
        ar: "بطاقات البروتوكول والدواء صارت أخفّ بالضعف: لم تعد تُنزّل قواعد الأدوية والحاسبات والبروتوكولات كاملة لعرض بضعة روابط.",
      },
      {
        fr: "Pages de liens (revue éditoriale, triage, spécialités, ECG) allégées : un fichier de références de 14 Ko remplace les bases complètes.",
        ar: "صفحات الروابط (المراجعة التحريرية، الفرز، التخصصات، ECG) صارت أخفّ: فهرس مراجع بحجم 14 كيلوبايت بدل القواعد الكاملة.",
      },
    ],
  },
  {
    v: "17.1",
    date: "2026-09-21",
    notes: [
      {
        fr: "Fiche protocole affichée plus vite : la boucle de réévaluation et le guidage arrivent après le premier écran (509 → 428 Ko sur l'arrêt cardiaque).",
        ar: "بطاقة البروتوكول تُعرض أسرع: حلقة إعادة التقييم والتوجيه تصلان بعد الشاشة الأولى (509 ← 428 كيلوبايت في توقّف القلب).",
      },
      {
        fr: "Favoris et récents chargés instantanément : une fiche de références de 14 Ko remplace l'index de recherche complet (173 Ko).",
        ar: "المفضّلة والأخيرة تُحمَّلان فورًا: فهرس مراجع بحجم 14 كيلوبايت بدل فهرس البحث الكامل (173 كيلوبايت).",
      },
      {
        fr: "Favoris et récents restent disponibles hors-ligne (la fiche de références est précachée).",
        ar: "المفضّلة والأخيرة متاحتان دون اتصال (فهرس المراجع مخزَّن مسبقًا).",
      },
    ],
  },
  {
    v: "17.0",
    date: "2026-09-20",
    notes: [
      {
        fr: "Premier chargement deux fois plus rapide : la base médicale complète n'est plus téléchargée sur les pages qui n'en ont pas besoin (483 → 177 Ko sur l'accueil, −63 %).",
        ar: "تحميل أولي أسرع بالضعف: لم تعد قاعدة البيانات الطبية كاملة تُنزَّل على الصفحات التي لا تحتاجها (483 ← 177 كيلوبايت في الرئيسية، −63٪).",
      },
      {
        fr: "Recherche arabe corrigée : les mots commençant par un alif portant une hamza ou une madda se trouvent désormais (le diacritique bloquait la correspondance).",
        ar: "تصحيح البحث بالعربية: الكلمات التي تبدأ بـ أ / إ / آ / ٱ صارت تُوجد (الهمزة كانت تمنع المطابقة).",
      },
      {
        fr: "Ligatures françaises : « Œdème » et « œsophage » se cherchent maintenant avec « oe ».",
        ar: "الحروف المزدوجة الفرنسية: «Œdème» و«œsophage» يُبحث عنهما الآن بـ «oe».",
      },
      {
        fr: "Barre d'onglets lisible sur tous les écrans : plus aucun libellé ne débordait (y compris à 320 px).",
        ar: "شريط تبويبات مقروء على كل الشاشات: لم يعد أي عنوان يفيض (بما في ذلك عند 320 بكسل).",
      },
      {
        fr: "Une complication confirmée par erreur peut être retirée directement depuis l'accueil.",
        ar: "يمكن إزالة مضاعفة أُكِّدت بالخطأ مباشرةً من الصفحة الرئيسية.",
      },
    ],
  },
  {
    v: "16.2",
    date: "2026-09",
    notes: [
      {
        fr: "Résumé de cas : patient + constantes (avec tendance) + complications + chronologie, en un texte prêt à transmettre.",
        ar: "ملخص الحالة: المريض + الثوابت (مع الاتجاه) + المضاعفات + الخط الزمني في نص جاهز للإبلاغ.",
      },
      {
        fr: "Dépistage de la détérioration : 9 règles (OAP, choc, sepsis, bradycardie, hypoglycémie…) fondées sur ESC 2021 / SSC 2021 / ERC 2021, avec critères de confirmation clinique.",
        ar: "رصد التدهور: 9 قواعد (وذمة رئوية، صدمة، إنتان، تباطؤ، نقص سكر…) وفق ESC 2021 / SSC 2021 / ERC 2021 مع معايير تأكيد سريرية.",
      },
      {
        fr: "Boucle de réévaluation horodatée avec tendance ↑→↓ et alarme après deux aggravations consécutives.",
        ar: "حلقة إعادة تقييم موقوتة مع اتجاه ↑→↓ وإنذار بعد تدهورين متتاليين.",
      },
      { fr: "6 nouveaux protocoles et 5 molécules.", ar: "6 بروتوكولات جديدة و5 جزيئات." },
    ],
  },
  {
    v: "15.0",
    date: "2026-09",
    notes: [
      {
        fr: "Hors-ligne complet : 258 fichiers précachés — l'application entière fonctionne sans réseau après la première visite.",
        ar: "عمل دون اتصال كامل: 258 ملفًا مخزَّنًا مسبقًا — التطبيق كله يعمل بلا شبكة بعد أول زيارة.",
      },
      {
        fr: "Nouvelle navigation : 6 onglets directs (Accueil · Réa · Médicaments · Protocoles · Mémo · Check-lists) + grille d'outils sur l'accueil.",
        ar: "تنقّل جديد: 6 تبويبات مباشرة (الرئيسية · الإنعاش · أدوية · بروتوكولات · مذكّرة · قوائم) + شبكة أدوات في الرئيسية.",
      },
    ],
  },
  {
    v: "13.3",
    date: "2026-09",
    notes: [
      {
        fr: "Patient actif : poids, âge, créatinine et sexe saisis une fois, réinjectés dans tous les moteurs de calcul.",
        ar: "المريض النشط: الوزن والعمر والكرياتينين والجنس تُدخل مرة واحدة وتُعبَّأ بها كل المحرّكات.",
      },
      {
        fr: "Archive locale des cas clos (5 entrées) avec restauration.",
        ar: "أرشيف محلي للحالات المغلقة (5 مدخلات) مع إمكانية الاسترجاع.",
      },
    ],
  },
  {
    v: "10.0",
    date: "2026-09",
    notes: [
      {
        fr: "Palette de commandes Ctrl/Cmd+K : navigation, références et actions au clavier.",
        ar: "لوحة أوامر Ctrl/Cmd+K: تنقّل ومراجع وإجراءات عبر لوحة المفاتيح.",
      },
      {
        fr: "Charte Material 3 : rail permanent sur bureau, barre d'onglets en bas sur mobile, en-tête minimal.",
        ar: "هوية Material 3: شريط دائم على الحاسوب، تبويبات أسفل الشاشة على الهاتف، ترويسة مصغّرة.",
      },
    ],
  },
  {
    v: "7.8",
    date: "2026-09",
    notes: [
      {
        fr: "Arbres décisionnels interactifs : décisions OUI/NON tactiles, minuteries avec alarme sonore, journal horodaté imprimable.",
        ar: "أشجار قرار تفاعلية: قرارات نعم/لا باللمس، مؤقّتات مع إنذار صوتي، وسجل موقوت قابل للطباعة.",
      },
      {
        fr: "Abréviations interactives : taper TA, PAM, GCS, MgSO₄… ouvre une fiche explicative FR/AR.",
        ar: "اختصارات تفاعلية: لمس TA أو PAM أو GCS أو MgSO₄… يفتح بطاقة توضيحية بالفرنسية والعربية.",
      },
    ],
  },
  {
    v: "4.0",
    date: "2026-09",
    notes: [
      {
        fr: "130 calculateurs, dont NIHSS, HAS-BLED, CURB-65, Wells EP/TVP, Adrogué-Madias et insuline ACD avec garde-fou potassium.",
        ar: "130 حاسبة، منها NIHSS وHAS-BLED وCURB-65 وWells EP/TVP وAdrogué-Madias وإنسولين ACD مع حارس البوتاسيوم.",
      },
      {
        fr: "Chaque fiche protocole indique la conduite à tenir en cas d'aggravation, de non-réponse ou de complication.",
        ar: "كل بطاقة بروتوكول تُبيّن التصرّف عند التدهور أو غياب الاستجابة أو حدوث مضاعفة.",
      },
    ],
  },
  {
    v: "3.0",
    date: "2026-09",
    notes: [
      {
        fr: "IA optionnelle (clé utilisateur) : Flash IA — une phrase dictée → carte d'intervention chronométrée.",
        ar: "ذكاء اصطناعي اختياري (مفتاح المستخدم): Flash IA — جملة منطوقة ← بطاقة تدخل موقوتة.",
      },
      {
        fr: "Analyseur ECG par photo ou caméra, avec historique local des images.",
        ar: "محلّل تخطيط القلب بالصورة أو الكاميرا مع أرشيف محلي للصور.",
      },
      {
        fr: "Aide au triage, générateur de compte rendu, quiz de révision, recherche assistée.",
        ar: "مساعدة الفرز، مُولّد تقرير، اختبارات مراجعة، بحث مُعان.",
      },
    ],
  },
  {
    v: "2.1",
    date: "2026-09",
    notes: [
      { fr: "Bandeau de mise à jour hors-ligne + journal des nouveautés.", ar: "مؤشر التحديث دون إنترنت وسجل المستجدات." },
    ],
  },
  {
    v: "2.0",
    date: "2026-09",
    notes: [
      {
        fr: "Premiers calculateurs : choc, QTc, énoxaparine, thrombolyse, électrolytes, fluides enfant, VNI, RSI, NAC.",
        ar: "الحاسبات الأولى: الصدمة، QTc، إينوكسابارين، التحلل، الشوارد، سوائل الطفل، VNI، RSI، NAC.",
      },
      { fr: "Liens directs depuis les fiches médicaments.", ar: "روابط مباشرة من صفحات الأدوية." },
    ],
  },
  {
    v: "1.6",
    date: "2026-08",
    notes: [
      {
        fr: "Première palette de commandes Ctrl/Cmd+K.",
        ar: "أول لوحة أوامر بـ Ctrl/Cmd+K.",
      },
    ],
  },
];

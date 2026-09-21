// سجل المستجدات المعروض داخل التطبيق (`/changelog`).
//
// v17.0 — كان هذا السجل متوقفًا عند الإصدار 2.1 بينما التطبيق في 16.2: أي أن
// «الجديد» الذي يراه المستخدم كان قديمًا بأربعة عشر إصدارًا. صار الآن مواكبًا.
// Enveloppe FR/AR : chaque note existe dans les deux langues (vérifié par les tests).
import type { Localized } from "./types";

export interface Release { v: string; date: string; notes: Localized[] }

export const CHANGELOG: Release[] = [
  {
    v: "18.1",
    date: "2026-09-21",
    // v18.1 — الطابق 2 و3: تقدير كلوي مزمن/حادّ/أطفال + خطّة علاج بحلقة إعادة تقييم a → b.
    notes: [
      {
        fr: "Fonction rénale affinée : CKD-EPI 2021 (adulte), CKID U25 (enfant, taille obligatoire), poids ajusté si obésité, critères KDIGO d'agression aiguë — le stade le plus prudent est retenu et expliqué.",
        ar: "تقدير أدقّ للوظيفة الكلوية: CKD-EPI 2021 (البالغ)، CKID U25 (الطفل، الطول إلزامي)، وزن معدّل عند السمنة، ومعايير KDIGO للقصور الحادّ — تُعتمد المرحلة الأكثر حذرًا مع تفسيرها.",
      },
      {
        fr: "Escalade prudente (GPR) : DFG 30–90 dégradé ⇒ deux stades plus sévères, sauf molécules vitales quand le DFG est < 30 (badge explicite sur chaque carte).",
        ar: "تصعيد حذر (GPR): تصفية ٣٠–٩٠ مع تدهور ⇒ التعامل كمرحلتين أشدّ، باستثناء الأدوية الحيوية إذا كانت التصفية أقلّ من ٣٠ (شارة ظاهرة على كل بطاقة).",
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
    // v18.0 — حساب كامل لجدول «المضادات الحيوية والقصور الكلوي» (OMEDIT، 12 صفحة):
    // 93 تركيبة × 5 مراحل، نقل حرفي للنصّ الفرنسي + حساب الجرعة المطلقة حسب الوزن
    // وCockcroft-Gault لاختيار المرحلة. الصفحة: /calculateurs/antibio-renal
    notes: [
      {
        fr: "Nouveau calculateur « Antibiotiques & fonction rénale » : les 93 lignes du tableau OMEDIT V2.3 sur les 5 stades de DFG, posologies reprises mot pour mot + dose absolue calculée au poids (mg/kg) et DFG de Cockcroft-Gault.",
        ar: "حاسبة جديدة «المضادات الحيوية والوظيفة الكلوية»: 93 سطرًا من جدول OMEDIT النسخة 2.3 على 5 مراحل للتصفية، الجرعات منقولة حرفيًا + حساب الجرعة المطلقة حسب الوزن وCockcroft-Gault لاختيار المرحلة.",
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

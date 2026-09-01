import type { Protocol } from "./types";

// Phase 6 (2/2) — protocoles additionnels avec branches d'évolution, adaptés au terrain tunisien.
export const protocolsP5: Protocol[] = [
  {
    id: "piqre-scorpion",
    title: { fr: "Envenimation scorpionique", ar: "لدغة العقرب" },
    category: "toxicologie",
    severity: "urgent",
    summary: { fr: "Envenimation scorpionique : gradation I–III, analgésie, surveillance 6 h si local, réa si grade III.", ar: "لدغة عقرب: درجات I–III، تسكين، مراقبة 6 س، عناية إن درجة III." },
    steps: [
      { title: { fr: "Identifier : heure, aspect du scorpion, retirer l'aiguillon s'il est visible (NE PAS sucer)", ar: "حدّد: الساعة، شكل العقرب، أزل الشوكة إن ظهرت (لا تمتصّ)" } },
      { title: { fr: "Laver avec eau et savon ; refroidir la zone (10–15 min) ; NE PAS garrot ni incision", ar: "اغسل بماء وصابون؛ برّد المنطقة؛ لا عاصبة ولا شق" } },
      { title: { fr: "Évaluer la gravité : signes vitaux (HTA, arythmie, détresse respiratoire, sueurs, hyperthermie)", ar: "قيّم الشدة: علامات حيوية (ارتفاع ضغط، اضطراب نظم، ضائقة تنفسية)" } },
      { title: { fr: "Analgésie : paracétamol ± tramadol ; si douleur intense : morphine titrée", ar: "تسكين: باراسيتامول ± ترامادول؛ عند الشدة: مورفين معاير" } },
      { title: { fr: "Si GRAVITÉ (signes neuro/HTA poumonaire) : antivenin (F(ab')2 spécifique) + O2 + monitorage", ar: "إذا خطورة (علامات عصبية/وذمة رئوية): مصل mضاد + أكسجين + مراقبة" } },
    ],
    keyPoints: [
      { fr: "Grade I (local, douleur) → surveiller 6 h. Grade II (gueule de bois, sueurs, hyperthermie) → hospitaliser.", ar: "الدرجة I محلية ← راقب 6 س. الدرجة II جهازية ← استشفاء." },
      { fr: "Grade III (détresse respiratoire, HTA pulmonaire, coma) → réanimation immédiate.", ar: "الدرجة III ← عناية مركزة فوراً." },
    ],
    trajectory: [
      {
        when: { fr: "Passage grade I→II (gueule de bois, sueurs profuses, HTA)", ar: "الانتقال من الدرجة I إلى II (صداع كلوي، تعرق غزير، ارتفاع ضغط)" },
        do: [
          { fr: "Hospitalisation en surveillance rapprochée (FC, TA, SpO2) 24 h minimum.", ar: "استشفاء بمراقبة لصيقة (نبض، ضغط، تشبع) 24 س على الأقل." },
          { fr: "Prélever ECG + iono + bilan rénal (myolyse).", ar: "ECG + شوارد + وظيفة كلوية." },
        ],
      },
      {
        when: { fr: "Grade III : œdème pulmonaire, troubles du rythme, coma", ar: "الدرجة III: وذمة رئوية، اضطراب نظم، غيبوبة" },
        do: [
          { fr: "Antivenin spécifique (F(ab')2) si disponible, ou réanimation cardiorespiratoire.", ar: "مصل مضاد نوعي (F(ab')2) إذا توفر، أو إنعاش قلبي رئوي." },
          { fr: "Ventilation assistée + antihypertenseur (nicardipine/esmolol) si HTA pulmonaire.", ar: "تهوية مساعدة + خافض ضغط إذا ارتفاع رئوي." },
        ],
      },
      {
        when: { fr: "Rechute retardée (hyperthermie, sueurs, agitation) à J+2", ar: "معاودة متأخرة (حمى، تعرق، هياج) في اليوم الثاني" },
        do: [
          { fr: "Exclusion d'un myocardite toxique (ECG, écho, troponine) — attention à la simulation d'AVC.", ar: "استبعاد التهاب عضلة القلب السمي — انتبه لتقليد الجلطة." },
        ],
      },
    ],
    medications: ["paracetamol", "morphine"],
    calculators: [],
    meta: { sources: ["SFMU/SRLF recommandations envenimation", "Centre antipoison Tunis 71 335 500"], lastReviewed: "2026-09" },
  },
  {
    id: "intoxication-co",
    title: { fr: "Intoxication oxycarbonée (CO)", ar: "تسمم أول أكسيد الكربون" },
    category: "toxicologie",
    severity: "critical",
    summary: { fr: "Exposition CO : O₂ 100 % immédiat, COHB et ECG, discuter l'oxygénothérapie hyperbare.", ar: "تعرض لأول أكسيد الكربون: أكسجين 100% فوراً، COHb وECG، ناقش الضغط العالي." },
    steps: [
      { title: { fr: "Suspicion : céphalée + nausées + confusion brusque en hiver/gaz → CO", ar: "اشتباه: صداع + غثيان + تشوش مفاجئ في الشتاء/الغاز" } },
      { title: { fr: "Retirer immédiatement l'exposition (ne pas pénétrer le local si toxique) — sécurité d'abord", ar: "أزل التعرض فوراً (لا تدخل المكان إذا سامّاً) — السلامة أولاً" } },
      { title: { fr: "O2 à haute concentration 15 L/min (masque à haute concentration + réserve) — 100 % O2 jusqu'à normoxie capillaire", ar: "أكسجين 15 ل/د بقناع عالي التركيز + خزان — 100% حتى إشباع طبيعي" } },
      { title: { fr: "COHb mesurer (si possible) ; ECG (ischémie, arythmies), glycémie, lactate", ar: "قياس COHb؛ ECG، سكر، لاكتات" } },
      { title: { fr: "Si GCS ≤ 12, coma ou signes neurologiques → avis OXYBARIE (hyperbare) en discuter rapidement", ar: "إذا GCS ≤ 12 أو علامات عصبية ← استشر chamber hyperbare بسرعة" } },
    ],
    keyPoints: [
      { fr: "La SpO2 conventionnelle est souvent faussement rassurante (ne détecte pas COHb).", ar: "التشبع التقليدي يخدع (لا يقيس COHb)." },
      { fr: "Le CO perdure 4–6 h sous O2 100 % — ne pas arrêter prématurément.", ar: "الCO يستمر 4–6 س تحت الأكسجين — لا توقف مبكراً." },
    ],
    trajectory: [
      {
        when: { fr: "Retour à la conscience mais signes persistant (céphalée sévère, vertiges) à 4–6 h d'O2", ar: "استيقاظ لكن استمرار أعراض (صداع شديد، دوار) بعد 4–6 س O2" },
        do: [
          { fr: "Oxybarie à discuter à nouveau même si amélioration (risque de séquelle cognitive).", ar: "أعد مناقشة الضغط العالي حتى لو تحسّن (خطر تلف إدراكي)." },
          { fr: "Surveiller COHb en série (objectif < 5 %).", ar: "راقب COHb مسلسلاً (الهدف < 5%)." },
        ],
      },
      {
        when: { fr: "Complication : ischémie myocardique (ECG, troponine)", ar: "تعقيد: إقفار قلبي (ECG، تروبونين)" },
        do: [
          { fr: "Transfert USI cardiologie + anticoagulation selon protocole SCA.", ar: "نقل وعاء قلبي + مضاد تخثر حسب SCA." },
        ],
      },
      {
        when: { fr: "Récupération apparente puis dégradation neurologique à J+3–J+21", ar: "تحسن ظاهري ثم تدهور عصبي بين يوم 3–21" },
        do: [
          { fr: "Syndrome post-coma carbonique (démence, Parkinson) → avis neurologique urgent.", ar: "متلازمة ما بعد الغيبوبة الكربونية ← رأي عصبية عاجل." },
        ],
      },
    ],
    medications: [],
    calculators: [],
    meta: { sources: ["SRLF/SFMU — intoxication CO", "ERC 2021"], lastReviewed: "2026-09" },
  },
  {
    id: "hta-urgence",
    title: { fr: "Urgence hypertensive (avec atteinte d'organe)", ar: "ارتفاع ضغط إلحاحي مع قصور عضوي" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Urgence hypertensive = TA élevée + atteinte d'organe : baisser lentement (trinitrine/nicardipine).", ar: "ارتفاع ضغط إلحاحي + قصور عضوي: أنزل بطيئاً (نترات/nicardipine)." },
    steps: [
      { title: { fr: "Justifier : TA ≥ 180/120 ET atteinte d'organe cible (neuro, rétine, rein, cœur)", ar: "برّر: ضغط ≥ 180/120 وقصور عضوي (عصبي، شبكي، كلوي، قلبي)" } },
      { title: { fr: "Bilan complet : ECG, créat, iono, urines, scanner si neuro", ar: "فحص كامل: ECG، كرياتينين، شوارد، بول، سكانر إن عصبي" } },
      { title: { fr: "Baisse lente et contrôlée : viser −20 % PAM en 1ʳᵉ heure (trop rapide = ischémie !)", ar: "إنزال بطيء متحكم: −20% متوسط الضغط في الساعة الأولى (بسرعة = إقفار!)" } },
      { title: { fr: "Perfusion : trinitrine PSE 0,25–1 µg/kg/min OU nicardipine 5 mg/h titré (jamais bolus pur)", ar: "تسريب: trinitrine مضخة أو nicardipine معاير — بلا bolus" } },
      { title: { fr: "Si OAP/orIA (dyspnée) : trinitrine beaucoup + si impuissance bronchodilatateur", ar: "إذا وذمة رئوية: trinitrine بكثرة" } },
      { title: { fr: "Si AVC hémorragique : labétalol ou nicardipine (pas de bolus brutal)", ar: "إذا نزف وعائي: labétalol أو nicardipine (بلا bolus عنيف)" } },
    ],
    keyPoints: [
      { fr: "Ne JAMAIS abaisser rapidement la TA (> 25 % PAM) en présence d'ischémie cérébrale/coronarienne.", ar: "لا تخفض الضغط بسرعة (>25% متوسط) مع إقفار دماغي/تاجي." },
      { fr: "La trinitrine est OR de l'urgence préhospitalière — simple, titrable, efficace.", ar: "الترينيترين معيار الميدان — بسيط، معاير، فعال." },
    ],
    trajectory: [
      {
        when: { fr: "Pas de réponse ou aggravation sous trinitrine/nicardipine", ar: "لا استجابة أو تفاقم تحت النترات/nicardipine" },
        do: [
          { fr: "Changer de molécule (esmolol si libération adrénergique, DHP si vascularite).", ar: "غيّر الجزيء (esmolol إذا تأثير أدريناليني)." },
          { fr: "Hospitalisation USI monitorage strict.", ar: "استشفاء عناية مراقبة مشددة." },
        ],
      },
      {
        when: { fr: "Complication : œdème cérébral hypertensif", ar: "تعقيد: وذمة دماغية ارتفاعية" },
        do: [
          { fr: "Élévation tête 30°, trinitrine titrée en continu, EEG pour suspicion état de mal ?", ar: "رفع الرأس 30°، نترات معايرة، EEG عند شك صرع." },
        ],
      },
    ],
    medications: ["trinitrine", "noradrenaline"],
    calculators: ["amines"],
    meta: { sources: ["ESC/ESH hypertension guidelines", "AHA 2025"], lastReviewed: "2026-09" },
  },
  {
    id: "rhabdomyolyse",
    title: { fr: "Rhabdomyolyse (syndrome d'écrasement / effort)", ar: "تحلل العضلات (متلازمة السحق/الجهد)" },
    category: "traumatologie",
    severity: "urgent",
    summary: { fr: "Destruction musculaire : remplissage avant dégagement, protéger le rein, guetter l'hyperK.", ar: "تحلل عضلي: تعويض قبل التحرير، احمِ الكلية، راقب K." },
    steps: [
      { title: { fr: "Suspicion : douleur musculaire intense + faiblesse + urine foncée après effort/écrasement/coma prolongé", ar: "اشتباه: ألم عضلي شديد + ضعف + بول قاتم بعد جهد/سحق/غيبوبة طويلة" } },
      { title: { fr: "Libération de l'écrasement : remplissage PRÉCOCE avant d'enlever le poids (risque de choc de libération)", ar: "قبل رفع الثقل: تعويض حجمي مبكر (خطر صدمة التحرير)" } },
      { title: { fr: "NaCl 0,9 % abondant : 1–2 L bolus si majoration, diurèse cible ≥ 2–3 mL/kg/h", ar: "NaCl 0.9% غزير: 1–2 ل bolus؛ الهدف تحبور ≥ 2–3 مل/كغ/س" } },
      { title: { fr: "Mesurer K+, créat, CK au bas mot potassiumocytolyse ?", ar: "قِس K، كرياتينين، CK (خطر فرط بوتاسيوم)" } },
      { title: { fr: "Si urine foncée + K+ > 6 : traitement hyperkaliémie (voir protocole)", ar: "إذا بول قاتم + K > 6: بروتوكول فرط البوتاسيوم" } },
    ],
    keyPoints: [
      { fr: "Le remplissage précoce prévient l'IRC — le retard est le principal piège.", ar: "التعويض المبكر يقي من الفشل الكلوي — التأخير فخّ." },
      { fr: "L'hyperK peut mettre en jeu le pronostic vital en quelques minutes.", ar: "فرط البوتاسيوم يهدد الحياة في دقائق." },
    ],
    trajectory: [
      {
        when: { fr: "Insuffisance rénale aiguë malgré remplissage (oligurie < 0,5 mL/kg/h après 1–2 L)", ar: "قصور كلوي حاد رغم التعويض (قلة بول < 0.5 مل/كغ/س بعد 1–2 ل)" },
        do: [
          { fr: "Furosémide 40–80 mg si diurèse insuffisante ET PAS (pas d'IRC pré-établi).", ar: "فوروسيميد 40–80 ملغ إذا نقص تحبور وضغط مناسب." },
          { fr: "Bicarbonate oral/IV si acidose métabolique (urines alcalinisantes).", ar: "بيكربونات فموي/وريدي إذا حماض استقلابي." },
          { fr: "Hospitalisation néphrologie/réanimation.", ar: "استشفاء كلى/عناية." },
        ],
      },
      {
        when: { fr: "Crush syndrome prolongé (membre sous poids > 4 h)", ar: "سحق طويل (طرف محشور > 4 ساعات)" },
        do: [
          { fr: "Libération lente + compression distante du membre + héparine préventive ?", ar: "تحرير بطيء + ضغط بعيد للطرف." },
          { fr: "Amputation à discuter si membre non viable + risque de choc de libération mortel.", ar: "ناقش البتر إذا عضو ميت + خطر صدمة تحرير مميت." },
        ],
      },
    ],
    medications: [],
    calculators: ["hyperkaliemie"],
    meta: { sources: ["ATLS crush syndrome", "KDIGO AKI"], lastReviewed: "2026-09" },
  },
  {
    id: "noyade",
    title: { fr: "Noyade (submersion)", ar: "الغرق" },
    category: "traumatologie",
    severity: "critical",
    summary: { fr: "Submersion : ventilation efficace et O₂ HDF ; ne jamais vider l'estomac.", ar: "الغمر: تهوية فعالة وأكسجين عالي؛ لا تفرّغ المعدة أبداً." },
    steps: [
      { title: { fr: "Sortir l'eau en préservant colonne cervicale (si trauma/suspension)", ar: "أخرج من الماء مع حماية الرقبة (إذا رض/سقطة)" } },
      { title: { fr: "ABCDE ; si respiration absente ou inefficace : 5 insufflations initiales puis massage", ar: "ABCDE؛ إذا تنفس غائب: 5 نفخات أولى ثم ضغطات" } },
      { title: { fr: "Pas de vidage d'eaux usées — l'eau s'évacue seule en ventilé", ar: "لا تفرغ الماء بالضغط—يُخرج بالتهوية وحدها" } },
      { title: { fr: "O2 HDF dès disponible ; réchauffer activement (couvertures, chauffage — pas de bain chaud)", ar: "أكسجين؛ سخّف نشطاً (بطانيات، لا حمام ساخن)" } },
      { title: { fr: "Réanimation cardio-pulmonaire si arrêt ; souvent arrêt par hypothermie → protocole ACR", ar: "إنعاش إذا توقف؛ غالباً توقف بنقص حرارة ← ACR" } },
      { title: { fr: "Transfert centre avec réanimation respiratoire (VNI/intubation potentielle)", ar: "نقل لمركز تهوية (VNI/تنبيب محتمل)" } },
    ],
    keyPoints: [
      { fr: "L'hypothermie peut PROLONGer la survie sans séquelle — ne pas déclarer hors de l'eau avant réchauffement.", ar: "نقص الحرارة قد يطيل النجاة — لا تُعلن الوفاة قبل التسخين." },
      { fr: "5 insufflations initiales : prioritaires chez la victime d'eau (hypoxie majeure).", ar: "5 نفخات أولى: أولوية لدى الغريق (نقص أكسجين كبير)." },
    ],
    trajectory: [
      {
        when: { fr: "Respiration restaurée mais SpO2 bas ou toux persistante", ar: "استعادة تنفس لكن تشبع منخفض أو سعال مستمر" },
        do: [
          { fr: "VNI (CPAP/BiPAP) si disponible et toléré ; sinon masque à haute concentration.", ar: "تهوية لا اجتراحية إذا تحمّل؛ وإلا قناع عالي." },
          { fr: "Surveiller aggravation OAP secondaire 4–8 h (pneumopathie d'inhalation).", ar: "راقب وذمة رئوية ثانوية 4–8 س (التهاب استنشاقي)." },
        ],
      },
      {
        when: { fr: "Hypothermie associée (< 35 °C)", ar: "نقص حرارة مصاحب (< 35°)" },
        do: [
          { fr: "Réchauffement actif de grade : retirer vêtements mouillés, couverture chauffante, perfusion liquide 40 °C.", ar: "تسخين نشط: خلع الملابس المبللة، بطانية ساخنة، سوائل 40°." },
          { fr: "⚠️ JAMAIS arrêter la RCP pour « trop froid » — le réchauffement fait partie de la réanimation.", ar: "⚠️ لا توقف الإنعاش لـ«برودة» — التسخين جزء من الإنعاش." },
        ],
      },
    ],
    medications: [],
    calculators: [],
    meta: { sources: ["ERC 2021 Drowning", "SRLF"], lastReviewed: "2026-09" },
  },
  {
    id: "hypothermie",
    title: { fr: "Hypothermie accidentelle", ar: "نقص حرارة عرضي" },
    category: "traumatologie",
    severity: "urgent",
    summary: { fr: "Refroidissement accidentel : isolation, réchauffement progressif, monitoring du cœur.", ar: "برودة عرضية: عزل، تسخين متدرج، مراقبة قلبية." },
    steps: [
      { title: { fr: "Température rectale de grade I (35–32), II (32–28), III (< 28)", ar: "حرارة شرجية: خفيف 35–32، متوسط 32–28، شديد < 28" } },
      { title: { fr: "Retirer vêtements mouillés, isoler du sol, emmailloter (couverture de survie)", ar: "اخلع المبلل، اعزل من الأرض، لفّ (بطانية نجاة)" } },
      { title: { fr: "Si 35–32 : réchauffement externe + oral tiède sucré", ar: "إذا 35–32: تسخين خارجي + مشروب ساخن محلى" } },
      { title: { fr: "Si 32–28 : bain d'eau tiède (38–40 °C) TRÈS lent (1 °C/10 min) OU perfusion 40 °C + réchauffement externe", ar: "إذا 32–28: حمام دافئ 38–40° بطيء جداً أو سوائل 40°" } },
      { title: { fr: "Si < 28 ou ACR : réchauffement interne urgent (perfusion 40 °C, irrigation péritonéale si possible)", ar: "إذا <28 أو توقف: تسخين داخلي مستعجل (سوائل 40°)" } },
    ],
    keyPoints: [
      { fr: "Le froid protège le cerveau — ne PAS déclarer le décès avant réchauffement complet (35–36 °C).", ar: "البرد يحمي الدماغ — لا تُعلن الوفاة قبل التسخين الكامل." },
      { fr: "Réchauffement trop rapide = vasodilatation périphérique brutale → collapsus de réchauffement.", ar: "التسخين فائق السرعة = توسع وعائي محيطي ← صدمة تسخين." },
    ],
    trajectory: [
      {
        when: { fr: "ACR dans l'hypothermie (< 28 °C)", ar: "توقف القلب مع نقص حرارة (< 28°)" },
        do: [
          { fr: "Poursuivre la RCP + réchauffement actif : c'est une réanimation « protégée ».", ar: "واصل الإنعاش + تسخين نشط: إنعاش «محمي»." },
          { fr: "Adrénaline moins efficace — intervalles allongés (5–10 min entre injections).", ar: "الأدرينالين أقل فعالية — فواصل أطول (5–10 د)." },
        ],
      },
      {
        when: { fr: "Réchauffement en cours : chute de TA réfractaire", ar: "أثناء التسخين: هبوط ضغط مقاوم" },
        do: [
          { fr: "Suspicion de chute de réchauffement → remplissage prudent + ralentir le réchauffement.", ar: "اشتباه صدمة تسخين ← تعويض حذر + أبطئ التسخين." },
        ],
      },
    ],
    medications: [],
    calculators: [],
    meta: { sources: ["ERC 2021 Hypothermia", "AHA 2025"], lastReviewed: "2026-09" },
  },
  {
    id: "intoxication-medicamenteuse",
    title: { fr: "Intoxication médicamenteuse aiguë (paracétamol, BZD, opioïdes, cardiotoxiques)", ar: "تسمم دوائي حاد" },
    category: "toxicologie",
    severity: "urgent",
    summary: { fr: "Surdose médicamenteuse : identifier la molécule, appeler le centre antipoison, antidote selon toxidrome.", ar: "جرعة دوائية زائدة: حدّد الجزيء، اتصل بمركز السموم، الترياق حسب الصورة." },
    steps: [
      { title: { fr: "Identifier : molécule, dose, heure — emballage ou ordonnance si possible", ar: "حدّد: الجزيء، الجرعة، الساعة — علبة الدواء إن أمكن" } },
      { title: { fr: "Appeler CENTRE ANTIPOISON 71 335 500 avant tout traitement spécifique", ar: "اتصل بمركز السموم 71 335 500 قبل أي علاج نوعي" } },
      { title: { fr: "Charbon activé 50 g PO < 1 h si ingestion récente et conscience conservée (PAS si BZD/opioïdes → coma !)", ar: "فحم نشط 50 غ فموياً خلال ساعة إذا واعٍ (لا إذا مهدئات!)" } },
      { title: { fr: "Antidote selon toxidrome : naloxone (opioïdes), flumazénil (BZD) CONVENU avec prudence (sevrage), NaHCO3 (cardiotoxiques), hypno overdose (précautions hépatiques)", ar: "الترياق حسب السمية: نالوكسون (أفيونيات)، فلومازينيل بحذر (BZD)، بيكربونات (قلبية)، NAC (باراسيتامول)" } },
    ],
    keyPoints: [
      { fr: "Naloxone titrée en 0,2 mg IV toutes 2–3 min (pas 0,4 bolus — risque de sevrage sévère).", ar: "النالوكسن معاير 0.2 ملغ كل 2–3 د (بلا bolus 0.4)." },
      { fr: "Flumazénil est CONTRE-INDIQUÉ si suspicion BZD chez épileptique/alcoolique (risque convulsions).", ar: "الفلومازينيل مضاد استطباب عند الصرع/الكحولي." },
    ],
    trajectory: [
      {
        when: { fr: "Paracétamol : dose toxique ingérée mais asymptomatique à l'arrivée", ar: "باراسيتامول: جرعة سامة لكن بلا أعراض" },
        do: [
          { fr: "Dosage sanguin paracétamol à 4 h ; si > 150 µg/mL → NAC IV (3 perfusions : 150 puis 50 puis 100 mg/kg).", ar: "جرعة باراسيتامول 4 س؛ إذا > 150 ← N-acetylcysteine وريدي." },
          { fr: "Transfusé de foie possible si traitement retardé.", ar: "فشل كبدي محتمل إذا تأخر العلاج." },
        ],
      },
      {
        when: { fr: "Opioïdes : naloxone efficace mais rechute (deps prolongée, fentanyl transdermique)", ar: "أفيونيات: استجابة للنالوكسن لكن معاودة (ميثادون/فنتانيل لصقات)" },
        do: [
          { fr: "Perfusion continue naloxone (0,1–0,4 mg/h) ou intubation sécurisée (longue durée).", ar: "مضخة نالوكسن مستمرة أو تنبيب آمن." },
        ],
      },
      {
        when: { fr: "BZD + coma profond → peut évoluer en arrêt respiratoire", ar: "BZD + غيبوبة عميقة ← توقف تنفسي محتمل" },
        do: [
          { fr: "Préparer intubation ; si coma à 4 h persistante sans autre cause → antidote prudente (flumazénil) en milieu protégé.", ar: "جهّز تنبيب؛ إذا غيبوبة 4 س بلا سبب ← فلومازينيل بحذر شديد." },
        ],
      },
    ],
    medications: ["naloxone", "acetylcysteine", "flumazenil"],
    calculators: [],
    meta: { sources: ["Centre antipoison Tunis 71 335 500", "SRLF — intoxications médicamenteuses"], lastReviewed: "2026-09" },
  },
];

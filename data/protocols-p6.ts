import type { Protocol } from "./types";

// Phase 6 (3/N) — couverture complémentaire : sphère digestive, respiratoire chronique, pédiatrie courante.
export const protocolsP6: Protocol[] = [
  {
    id: "hemorragie-digestive-haute",
    title: { fr: "Hémorragie digestive haute", ar: "نزف هضمي علوي" },
    category: "medecine",
    severity: "critical",
    summary: { fr: "Hématémèse/méléna : remplissage, IPP, endoscopie rapide, Blakemore si varices inefficaces.", ar: "قيء دموي/براز أسود: تعويض، IPP، تنظير سريع، بليكيمور إن دوالٍ." },
    steps: [
      { title: { fr: "Reconnaître : hématémèse, méléna, collapsus ; rechercher antécédents (cirrhose, AINS, AVK)", ar: "تعرّف: قيء دموي، براز أسود، انهيار؛ اسأل عن تليف، AINS، مضادات تخثر" } },
      { title: { fr: "Position latérale sécurité si vomissements abondants ; NPO strict", ar: "الوضعية الجانبية إذا قيء غزير؛ صيام مطلق" } },
      { title: { fr: "2 VVP gros calibre (14–16 G) + bilan (NFS, hémostase, INR, cross-match, créat)", ar: "خطّان وريديان عريضان + فحوص (NFS، تخثر، INR، توافق)" } },
      { title: { fr: "Remplissage : cristalloïdes en bolus jusqu'à PAS ≥ 90–100 ; transfusion si Hb < 7 g/dL (8 si coronarien)", ar: "تعويض بلّوريات حتى ضغط ≥ 90–100؛ نقل دم إذا Hb < 7 (8 إذا تاجي)" } },
      { title: { fr: "IPP haute dose : pantoprazol bolus 80 mg IV puis 8 mg/h (si disponible)", ar: "IPP جرعة عالية: بانتوبرازول 80 ملغ دفعة ثم 8 ملغ/س" } },
      { title: { fr: "Si cirrhose/suspicion varices : ajouter vasoconstricteur (terlipressine/octreotide) + antibiothérapie préventive (CTX 1 g)", ar: "إذا تليف/اشتباه دوالي: أضف مقبض وعائي (تيرليبريسين/أوكتريوتيد) + مضاد وقائي" } },
      { title: { fr: "Endoscopie d'urgence (≤ 12–24 h, idéale 6 h si instable) — orienter vers un centre de soins intensifs", ar: "تنظير عاجل (≤ 12–24 س، 6 س إذا غير مستقر) — وجّه لمركز مناظير" } },
    ],
    keyPoints: [
      { fr: "Une Hb initiale normale n'exclut pas la gravité (hémoconcentration).", ar: "هيموغلوبين أولي طبيعي لا ينفي الخطورة (تركيز دموي)." },
      { fr: "Méléna = le saignement vient d'au-dessus de l'angle de Treitz jusqu'à preuve contraire.", ar: "البراز الأسود = نزف فوق زاوية تريتز حتى عكسه." },
    ],
    trajectory: [
      {
        when: { fr: "Non-stabilisation après remplissage + transfusion", ar: "لا استقرار بعد التعويض والنقل" },
        do: [
          { fr: "Endoscopie thérapeutique en urgence absolue (clips/adhésif/injection).", ar: "تنظير علاجي فوري (مشابك/لاصق/حقن)." },
          { fr: "Si varice incontrôlée : sonde de Blakemore temporaire (aviser hépato-gastro).", ar: "إذا دوالي جامحة: أنبوب بليكيمور مؤقت." },
        ],
      },
      {
        when: { fr: "Complication : hématémèse massive avec engagement des voies aériennes", ar: "تعقيد: قيء دموي هائل يهدد المجرى الهوائي" },
        do: [
          { fr: "Intubation précoce en décubitus latéral gauche ; aspiration immédiate.", ar: "تنبيب مبكر بالوضعية الجانبية اليسرى؛ شفط فوري." },
          { fr: "Réa équipée : aspiration naso-gastrique + lavage (controversé mais sécurise l'intubation).", ar: "شفط أنفي معدي في العناية." },
        ],
      },
      {
        when: { fr: "Re-saignement après traitement endoscopique (Hb chute, retour du méléna/actif)", ar: "معاودة نزف بعد التنظير (هبوط Hb، براز أسود مجدداً)" },
        do: [
          { fr: "Deuxième endoscopie ou chirurgie/embolisation selon la lésion.", ar: "تنظير ثانٍ أو جراحة/تصوير تصلبي حسب الآفة." },
        ],
      },
    ],
    medications: ["furosemide"],
    calculators: [],
    meta: { sources: ["ESGE 2021", "ACG upper GI bleeding"], lastReviewed: "2026-09" },
  },
  {
    id: "exacerbation-bpco",
    title: { fr: "Exacerbation de BPCO", ar: "تفاقم الانسداد الرئوي المزمن" },
    category: "medecine",
    severity: "urgent",
    summary: { fr: "Exacerbation BPCO : O₂ contrôlé 88–92 %, bronchodilatateurs + corticoïdes, VNI si hypercapnie.", ar: "تفاقم انسداد مزمن: أكسجين مضبوط 88–92%، موسعات + كورتيكويد، VNI عند فرط CO₂." },
    steps: [
      { title: { fr: "Mise en suspicion : dyspnée + augmentation expectoration/expectoration chez BPCO connu (ou fumeur chronique)", ar: "اشتباه: ضيق تنفس + زيادة بلغم عند مريض BPCO أو مدخن مزمن" } },
      { title: { fr: "O2 CONTRÔLÉ : cible SpO2 88–92 % (réservé CANULE — masque haute concentration si besoin impérieux)", ar: "أكسجين مضبوط: هدف تشبع 88–92% (قنية أولاً)" } },
      { title: { fr: "Bronchodilatateurs : salbutamol 2,5–5 mg nébuleux + ipratropium 0,5 mg, q 15–20 min ×3", ar: "موسعات قصبية: سالبوتامول 2.5–5 ملغ + إبراتروبيوم 0.5 ملغ، كل 15–20 د ×3" } },
      { title: { fr: "Corticothérapie systémique précoce : prednisolone 40 mg PO (ou hydrocortisone IV si incapable)", ar: "كورتيكويد جهازي مبكر: بريدنيزولون 40 ملغ فموياً" } },
      { title: { fr: "Antibiotique si expectoration purulente/augmentation volume (amoxicilline-ac.clavulanique ou mpicilline selon protocole local)", ar: "مضاد حيوي إذا بلغم قيحي (أموكس+كلاف)" } },
      { title: { fr: "Si insuffisance respiratoire : VNI (pression positive) en première intention si critères", ar: "إذا قصور تنفسي: تهوية غير غازية أولاً إذا توفرت الشروط" } },
    ],
    keyPoints: [
      { fr: "⚠️ O2 à haute dose peut induire CO2 narcosis chez le BPCO — toujours visé 88–92 %.", ar: "⚠️ الأكسجين بجرعة عالية قد يسبب تخدير CO₂ — استهدف 88–92% دائماً." },
      { fr: "Le CO2 (ETCO2) augmente : surveiller la lucidité, pas seulement le tracé.", ar: "ارتفاع CO₂: راقب الوعي لا الرسم فقط." },
    ],
    trajectory: [
      {
        when: { fr: "Aggravation : hypercapnie confusionnelle, FR > 30, SpO2 < 88 % malgré O2 titré", ar: "تفاقم: تشوش بفرط CO₂، FR>30، تشبع <88% رغم الأكسجين المعيّن" },
        do: [
          { fr: "VNI immédiate (BIPAP) si disponible — réduit mortalité et intubations.", ar: "تهوية ضغط إيجابي فورية — تخفض الوفيات والتنبيب." },
          { fr: "Transfert réanimation/USI respiratoire (intubation de secours en attente).", ar: "نقل عناية تنفسية مع استعداد للتنبيب." },
        ],
      },
      {
        when: { fr: "Complication : pneumothorax sur emphysème (bulles)", ar: "تعقيد: استرواح على نفاخ (فقاعات)" },
        do: [
          { fr: "Douleur + collapsus + asymétrie → décompression (sous précautions, bulle vs pneumo).", ar: "ألم + انهيار + تناظر ← بزل (بحذر تمييزي)." },
        ],
      },
      {
        when: { fr: "Pneumonie surajoutée (fièvre, point aigu)", ar: "التهاب رئوي مصاحب (حمى، بؤرة حادة)" },
        do: [
          { fr: "Antibiothérapie adaptée au foyer + radiographie thorax.", ar: "مضاد حيوي حسب البؤرة + صورة صدر." },
        ],
      },
    ],
    medications: ["salbutamol", "hydrocortisone"],
    calculators: [],
    meta: { sources: ["GOLD 2025", "BTS/SIGN", "SRLF VNI"], lastReviewed: "2026-09" },
  },
  {
    id: "convulsion-febrile",
    title: { fr: "Convulsion fébrile (enfant)", ar: "تشنج حمّي (طفل)" },
    category: "pediatrie",
    severity: "urgent",
    summary: { fr: "Crise convulsive chez l'enfant fébrile : rassurer, position latérale, BZD si > 5 min.", ar: "تشنج مع حمى عند الطفل: طمئن، وضعية جانبية، بنزوديازيبين إذا > 5 د." },
    steps: [
      { title: { fr: "Simple : < 15 min, généralisée, 6 mois–5 ans, récupération complète et rapide en 1 h — vs complexe", ar: "بسيط: < 15 د، معمم، 6 أشهر–5 سنوات، شفاء كامل خلال ساعة — مقابل مركّب" } },
      { title: { fr: "Voix rassurante aux parents ; ne rien mettre en bouche ; position latérale de sécurité", ar: "طمئن الوالدين؛ لا شيء بالفم؛ وضعية جانبية آمنة" } },
      { title: { fr: "Si > 5 min : benzodiazépine : midazolam buccal 0,5 mg/kg ou diazépam IR 0,5 mg/kg (max 10 mg)", ar: "إذا > 5 د: بنزوديازيبين: ميدازولام شدقي 0.5 ملغ/كغ أو ديازيبام شرجي 0.5 ملغ/كغ" } },
      { title: { fr: "Réchauffement température antipyrétique ; rechercher le foyer infectieux (SN, poumon, urines)", ar: "خافض حرارة؛ ابحث عن بؤرة العدوى (تنفسية، رئوية، بولية)" } },
      { title: { fr: "Si complexe ou premier épisode < 6 mois/> 5 ans/plusieurs hpériode → examen neurologique complet, EEG avis", ar: "إذا مركّب أو غير نمطي ← فحص عصبي كامل + EEG" } },
    ],
    keyPoints: [
      { fr: "La convulsion fébrile SIMPLE n'est pas un épilepsie ; elle est bénigne (1–3 % des enfants).", ar: "التشنج الحمي البسيط ليس صرعاً؛ حميد (1–3% من الأطفال)." },
      { fr: "Toujours éliminer méningite (raideur de nuque, lésions mauves, photophobie).", ar: "استبعد التهاب السحايا دائماً (تيبس الرقبة، طفح أرجواني)." },
    ],
    trajectory: [
      {
        when: { fr: "Convulsion prolongée > 15 min (complexe) ou récidive dans la journée", ar: "تشنج ممدد > 15 د (مركّب) أو تكرار باليوم" },
        do: [
          { fr: "Même geste benzodiazépine ; si récidive → 2ᵈᵐᵉ dose, puis consultation pédiatrique.", ar: "كرر البنزوديازيبين؛ إذا تكرر ← جرعة ثانية ثم استشارة طفلية." },
          { fr: "Éviter le statut : si 3ᵉ crise ou durée > 25 min → protocole état de mal pédiatrique.", ar: "إذا ثالثة أو > 25 د ← بروتوكول حالة الصرع للأطفال." },
        ],
      },
      {
        when: { fr: "Signes de méningite/méningo-encéphalite", ar: "علامات التهاب سحايا/سحايا ودماغ" },
        do: [
          { fr: "Ponction lombaire différée si fièvre centrale + dégradation → antibiotique III empírique AVANT PL si retard.", ar: "بزل قطني مؤجل؛ مضاد وريدي تجريبي قبل البزل إذا تأخر." },
          { fr: "Aciclovir si suspicion herpétique.", ar: "أسيكلوفير عند الاشتباه بالهربس." },
        ],
      },
    ],
    medications: ["midazolam", "diazepam", "paracetamol"],
    calculators: [],
    meta: { sources: ["AAP febrile seizures", "SFP/nice"], lastReviewed: "2026-09" },
  },
  {
    id: "electrocution",
    title: { fr: "Électrisation / électrocution", ar: "صعقة كهربائية" },
    category: "traumatologie",
    severity: "critical",
    summary: { fr: "Contact avec l'électricité : sécurité des sauveteurs, ECG incomplet — arythmie retardée possible.", ar: "تعرض كهربائي: سلامة المنقذ، ECG، اضطراب نظم متأخر محتمل." },
    steps: [
      { title: { fr: "SÉCURITÉ AVANT TOUT : couper le courant avant de toucher la victime (disjoncteur, perche sèche)", ar: "السلامة أولاً: اقطع التيار قبل لمس الضحية (قاطع، عصا جافة)" } },
      { title: { fr: "Evaluation ABCDE ; les brûlures cutanées sont trompeuses — l'atteinte interne est profonde", ar: "تقييم ABCDE؛ الحروق الجلدية خادعة — الإصابة الداخلية عميقة" } },
      { title: { fr: "ECG immédiat (risque arythmique immédiat et retardé 24 h) + monitorage continu", ar: "ECG فوري (خطر اضطراب نظم آني ومتأخر 24 س) + مراقبة مستمرة" } },
      { title: { fr: "VVP + bilan : CK, iono, créat, myoglobine (rhabdomyolyse) ; si tension élevée (> 1000 V) : bilan trauma complet", ar: "مصل + فحوص: CK، شوارد، كرياتينين، ميوغلوبين؛ إذا جهد عالٍ: تقييم إصابات شامل" } },
      { title: { fr: "Brûlures : évaluer étendue selon Wallace ; refroidir 20 min ; couvrir stérilement", ar: "حروق: قيّم الاتساع؛ برّد 20 د؛ غطِّ بعقيم," } },
      { title: { fr: "Observation hospitalière 24 h si haut voltage ou signe cardiaque/musculaire", ar: "استشفاء مراقبة 24 س إذا جهد عالٍ أو علامة قلبية/عضلية" } },
    ],
    keyPoints: [
      { fr: "La domesticité 220 V tue par FV immédiate — ECG et monitorage impératifs.", ar: "التيار المنزلي 220 ف يقتل برجفان بطيني آني — ECG ومراقبة إلزاميان." },
      { fr: "L'entrée et la sortie ne renseignent pas l'étendue interne (le courant suit les vaisseaux).", ar: "نقطتا الدخول/الخروج لا تقيس الإصابة الداخلية (التيار يسلك الأوعية)." },
    ],
    trajectory: [
      {
        when: { fr: "Arrêt cardiaque initial traité mais rechute arythmique", ar: "توقف ابتدائي عولج لكن عود توتر إيقاعي" },
        do: [
          { fr: "Monitorage ECG continu 24 h (irréversible).", ar: "مراقبة ECG مستمرة 24 س (إلزامية)." },
          { fr: "Si VF survient : cardioversion immédiate ; envisager l'amiodarone.", ar: "عند الرجفان: صدمة فورية؛ قيّم الأميودارون." },
        ],
      },
      {
        when: { fr: "Rhabdomyolyse associée (forte CK, urines foncées)", ar: "تحلل عضلي مصاحب (CK مرتفع، بول داكن)" },
        do: [
          { fr: "Protocole rhabdomyolyse : remplissage massif + contrôle K+ (hyperK soudaine risque).", ar: "بروتوكول تحلل العضلات + ضبط K مفاجئ." },
          { fr: "ECHO/IRM des membres si suspicion de compartiment syndromique chirurgical.", ar: "تصوير الأطراف إذا اشتباه متلازمة حيزية جراحية." },
        ],
      },
    ],
    medications: ["adrenaline", "amiodarone"],
    calculators: ["chrono-rcp"],
    meta: { sources: ["ATLS électrocution", "AHA arrhythmias électriques"], lastReviewed: "2026-09" },
  },
  {
    id: "hypertension-gravidique",
    title: { fr: "Pré-éclampsie sévère / éclampsie", ar: "ما قبل الارتعاج الشديد / ارتعاج" },
    category: "obstetrique",
    severity: "critical",
    summary: { fr: "Pré-éclampsie sévère : MgSO₄ anticonvulsivant + antihypertenseur, sans retarder l'extraction.", ar: "ما قبل الارتعاج: MgSO4 مضاد تشنج + خافض ضغط، بلا تأخير الولادة." },
    steps: [
      { title: { fr: "Suspicion : TA ≥ 160/110 chez femme enceinte ≥ 20 SA + céphalées/troubles visuels", ar: "اشتباه: ضغط ≥ 160/110 عند حامل ≥ 20 أسبوع + صداع/اضطراب بصري" } },
      { title: { fr: "Si convulsions : SURVEILLER NE PAS SE BATTRE — position latérale gauche, sécuriser la langue", ar: "إذا تشنجات: راقب لا تُقاتل — وضعية جانبية يسرى، أمّن اللسان" } },
      { title: { fr: "MgSO4 : 4 g IV en 15–20 min puis entretien 1 g/h (antidote : gluconate Ca 1 g IV si dépression respiratoire)", ar: "كبريتات مغنيزيوم: 4 غ على 15–20 د ثم 1 غ/س (الترياق: غلوكونات كالسيوم 1 غ إذا اكتئاب تنفسي)" } },
      { title: { fr: "Antihypertenseur : labétalol bolus 20 mg IV (ou nicardipine/hydralazine selon protocole) — cible TA < 160/110", ar: "خافض ضغط: لابيتالول 20 ملغ دفعة — هدف ضغط < 160/110" } },
      { title: { fr: "Ne PAS retarder l'accouchement pour stabiliser si présence d'éclampsie ou souffrance fœtale", ar: "لا تُأخّر الولادة لتثبيت إذا ارتعاج أو معاناة جنينية" } },
      { title: { fr: "Transport vers maternité de référence type III — monitoring fœtal continu", ar: "نقل لمستشفى ولادة نوع III — مراقبة جنينية مستمرة" } },
    ],
    keyPoints: [
      { fr: "L'éclampsie est une urgence vitale maternelle MAIS la vitalité fœtale prime.", ar: "الارتعاج طارئ أمومي لكن حيوية الجنين أولى." },
      { fr: "Le MgSO4 est UNIQUEMENT anticonvulsivant, PAS abaisser la TA → antihypertenseur nécessaire.", ar: "الكبريتات مضاد تشنج فقط، لا يخفض الضغط ← يلزم خافض ضغط." },
    ],
    trajectory: [
      {
        when: { fr: "Récidive de convulsions sous MgSO4", ar: "معاودة تشنجات تحت المغنيزيوم" },
        do: [
          { fr: "Vérifier la perfusion réellement comptée ; renouveler 2 g bolus lent.", ar: "تحقق من التسريب الفعلي؛ جدّد 2 غ بطيء." },
          { fr: "Intubation si coma tonic ou éclampsie persistante.", ar: "تنبيب إذا غيبوبة توترية أو استمرار." },
        ],
      },
      {
        when: { fr: "Complication : HELLP syndrome (hémolyse, élévation LDh, plaquettes basses)", ar: "تعقيد: متلازمة HELLP" },
        do: [
          { fr: "Bilan hépatique + hémostase + NFS urgents ; décision d'extraction immédiate.", ar: "فحوص كبدية وتخثر دموية عاجلة؛ قرار استخراج فوري." },
        ],
      },
      {
        when: { fr: "Souffrance fœtale aiguë (bradycardie fœtale prolongée)", ar: "معاناة جنينية حادة (بطء قلب جنيني ممدد)" },
        do: [
          { fr: "Position latérale G + O2 HDF + préparation césarienne d'urgence.", ar: "وضعية يسرى + أكسجين + تجهيز قيصرية عاجلة." },
        ],
      },
    ],
    medications: ["sulfate-magnesium"],
    calculators: [],
    meta: { sources: ["ACOG/ISSHP pré-éclampsie", "SFAR obstétrique"], lastReviewed: "2026-09" },
  },
];

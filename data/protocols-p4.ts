import type { Protocol } from "./types";

// Phase 6 (1/2) — extension « évolution & complications » : chaque protocole emporte ses branches
// d'évolution (aggravation, réponse au traitement, complications) avec la conduite adaptée.
export const protocolsP4: Protocol[] = [
  {
    id: "bradycardie",
    title: { fr: "Bradycardie symptomatique", ar: "بطء القلب العرضي" },
    category: "reanimation",
    severity: "critical",
    steps: [
      { title: { fr: "Confirmer : FC < 50 + signes (hypotension, altération conscience, douleur thoracique, OAP)", ar: "أكّد: نبض < 50 + علامات (هبوط ضغط، تغير وعي، ألم صدري، وذمة)" } },
      { title: { fr: "Scope 12 dérivations + voie veineuse + O2 si SpO2 < 94 %", ar: "ECG 12 + مصل وريدي + أكسجين إذا التشبع < 94%" } },
      { title: { fr: "Atropine 0,5–1 mg IV (jusqu'à 3 mg)", ar: "أتروبين 0.5–1 ملغ وريدياً (حتى 3 ملغ)" } },
      { title: { fr: "Si inefficace : adrénaline PSE 1–10 µg/min (paliers) OU dopamine PSE 5–20 µg/kg/min", ar: "إن فشل: أدرينالين مضخة 1–10 مكغ/د أو دوبامين 5–20 مكغ/كغ/د" } },
      { title: { fr: "Entraînement électrosystolique externe (pads collés, sédatif) en attente du stimulateur", ar: "تسريع خارجي (لاصقات، مسكّن) بانتظار المنظّم" } },
    ],
    keyPoints: [
      { fr: "Atropine : efficace sur bloc AV jonctionnel ; moins sur bloc infranodal/transplanté.", ar: "الأتروبين فعال مع الحصر الواصل؛ أقل مع الحصر تحت الوردي." },
      { fr: "Minimiser les interruptions avant le pacing pour éviter la chute de débit.", ar: "قلل التوقفات قبل التسريع لتجنب تدهور الديبي." },
    ],
    trajectory: [
      {
        when: { fr: "Si pas de réponse à l'atropine à 3 mg", ar: "إذا لم يستجب بعد 3 ملغ أتروبين" },
        do: [
          { fr: "Adrénaline PSE 1–10 µg/min titrée à la TA/FC cible.", ar: "أدرينالين مضخة 1–10 مكغ/د معايرة للضغط/النبض." },
          { fr: "Préparer la voie d'abord pour le stimulateur transcutané.", ar: "جهّز اللاصقات للتسريع الخارجي." },
        ],
      },
      {
        when: { fr: "Si choc persistant malgré pacing/adrénaline", ar: "إذا استمرت الصدمة مع التسريع/الأدرينالين" },
        do: [
          { fr: "Chercher une cause de tamponnade/embolie massive → USCO immédiat.", ar: "ابحث عن دكاك/صمة كبيرة ← عناية فورية." },
          { fr: "Transfert médiatisé urgent vers centre avec cardiologie interventionnelle.", ar: "نقل طبي عاجل لمركز قسطرة." },
        ],
      },
      {
        when: { fr: "Bloque AV 2ᵉ degré type II / 3ᵉ degré", ar: "حصر واصل ثانٍ نوع II / ثالث" },
        do: [
          { fr: "Risque d'évolution en pause/asystolie → anticipez le pacing (même si TA stable).", ar: "خطر التحول إلى توقف ← بكّر بالتسريع ولو كان الضغط سtable." },
        ],
      },
    ],
    medications: ["atropine", "adrenaline"],
    calculators: ["amines"],
    meta: { sources: ["AHA 2025 Bradycardia algorithm", "ERC 2021"], lastReviewed: "2026-09" },
  },
  {
    id: "tachycardie",
    title: { fr: "Tachycardie à QRS fins ou larges instable", ar: "تسرع قلبي غير مستقر" },
    category: "reanimation",
    severity: "critical",
    steps: [
      { title: { fr: "Gravité : hypotension, douleur, altération conscience, signes hypoperfusion ?", ar: "الشدة: هبوط ضغط، ألم، تغير وعي، نقص تروية؟" } },
      { title: { fr: "Scope + 12 dérivations + VVP ; si STABLE → manœuvres vagales avant médicament", ar: "ECG + مصل؛ إذا مستقر ← مناورات مهبلية أولاً" } },
      { title: { fr: "INSTABLE → cardioversion électrique synchronisée immédiate : 100 J (200 J si atr. fluttre/large)", ar: "غير مستقر ← كارديوفيرزيون متزامنة فورية: 100 جول" } },
      { title: { fr: "Sédation si état conscient permet (midazolam 1–2 mg IV titré) avant choc", ar: "تهدئة إن أمكن (ميدازولام 1–2 ملغ) قبل الصدمة" } },
      { title: { fr: "Stable RGF : adenosine 6 mg IV rapid→12 mg si récidive ; B-blocker/CCB si SVT", ar: "مستقر QRS ضيق: أدينوزين 6 ثم 12 ملغ؛ حاصر B/CCB إذا SVT" } },
      { title: { fr: "Stable QRS large : procainamide OU amiodarone 150 mg sur 10 min (éviter verapamil)", ar: "مستقر QRS واسع: بروكاييناميد أو أميودارون 150 ملغ" } },
    ],
    keyPoints: [
      { fr: "Rapidité du diagnostic évite la dégradation hémodynamique.", ar: "سرعة التشخيص تفادي التدهور." },
      { fr: "Toujours revoir le tracé APRÈS le choc (rythme soutenu, conduction).", ar: "أعد فحص الإيقاع بعد الصدمة دائماً." },
    ],
    trajectory: [
      {
        when: { fr: "Si adénosine inefficace (ainsi qu'une 2ᵉ dose)", ar: "إذا فشل الأدينوزين والجرعة الثانية" },
        do: [
          { fr: "Bêta-bloquant IV (esmolol/metoprolol) OU vérapamil 2,5–5 mg lent (si cœur sain).", ar: "حاصر بيتا وريدي أو فيراباميل بطيء (قلب سليم)." },
          { fr: "Éviter d'empiler 2 AV+ : une seule classe.", ar: "تجنب دمج حاصرين للوصل: صنف واحد." },
        ],
      },
      {
        when: { fr: "Si QRS large stable : suspicion de WPW ou BBR", ar: "إذا QRS واسع مستقر: شك WPW أو حصر حزمة" },
        do: [
          { fr: "⚠️ AINSI QUE l'adénosine : inefficace/dangereuse si WPW → procainamide de 1ʳᵉ intention.", ar: "⚠️ لا أدينوزين: خطير في WPW ← بروكاييناميد أولاً." },
        ],
      },
      {
        when: { fr: "Après choc : récidive immédiate", ar: "بعد الصدمة: معاودة فورية" },
        do: [
          { fr: "Amiodarone 150 mg IV sur 10 min puis 1 mg/min 6 h.", ar: "أميودارون 150 ملغ ثم 1 ملغ/د لـ6 س." },
          { fr: "Chercher cause : ischémie, iono, toxiques.", ar: "ابحث عن السبب: إقفار، شوارد، سموم." },
        ],
      },
    ],
    medications: ["adenosine", "amiodarone", "midazolam"],
    calculators: ["amines"],
    meta: { sources: ["AHA 2025 Tachycardia algorithm", "ERC 2021"], lastReviewed: "2026-09" },
  },
  {
    id: "embolie-pulmonaire",
    title: { fr: "Embolie pulmonaire (suspicion / haute probabilité)", ar: "الصمة الرئوية" },
    category: "medecine",
    severity: "urgent",
    steps: [
      { title: { fr: "Évaluer probabilité (Wells/Geneva) ; hémodynamique : choc → EP grave", ar: "قيّم الاحتمال (ويلز/جنيف)؛ هل صدمة = صمة وخيمة" } },
      { title: { fr: "ECG (S1Q3T3, BBD), D-dimères (souvent inutile si forte clinique), échographie des MV", ar: "ECG، D-دايمر، دوبلر الأوردة" } },
      { title: { fr: "Si choc/instable → thrombolyse immédiate (altéplase 100 mg / 2 h ou bolus puis réa) ; sinon angio-TDM", ar: "إذا صدمة ← تحليل خثرة فوري؛ وإلا تصوير مقطعي" } },
      { title: { fr: "Anticoagulation précoce dès doute raisonnable : HNF IV / HBPM 100 UI/kg ×2/j", ar: "مضاد تخثر مبكر: هيبارين غير مجزأ أو منخفض الجزيئات" } },
      { title: { fr: "O2, décubitus, analgésie, VVP", ar: "أكسجين، راحة، تسكين، مصل وريدي" } },
    ],
    keyPoints: [
      { fr: "Ne PAS attendre l'imagerie si patient instable — thrombolyse de sauvetage immédiate.", ar: "لا تنتظر التصوير إذا غير مستقر — تحليل الخثرة إنقاذي فوري." },
      { fr: "HBPM si TA stable et pas d'IRC — rapide, simple, efficace.", ar: "HBPM إذا ضغط مستقر ولا قصور كلوي — سريع وفعال." },
    ],
    trajectory: [
      {
        when: { fr: "Évolution après thrombolyse/anticoagulation", ar: "التطور بعد تحليل الخثرة/مضاد التخثر" },
        do: [
          { fr: "Surveiller hémorragie (points de ponction, hématomes) ; si saignement actif → arrêt de l'anticoagulant, antidote si HNF/BPM (protamine).", ar: "راقب النزف؛ إذا نزيف نشط ← إيقاف مضاد التخثر، بروتامين." },
          { fr: "Attendre 48–72 h de stabilité TVe avant de juger l'efficacité.", ar: "انتظر 48–72 س من الاستقرار." },
        ],
      },
      {
        when: { fr: "Complication tardive : HTAP / cœur pulmonaire chronique", ar: "تعقيد متأخر: ارتفاع ضغط شريان رئوي مزمن" },
        do: [
          { fr: "Échographie à distance ; consultation pneumologue/cardiologue spécialisée.", ar: "صدى قلب لاحق؛ استشارة مختص." },
        ],
      },
    ],
    medications: ["heparine", "enoxaparine", "alteplase"],
    calculators: ["wells-ep", "heparine"],
    meta: { sources: ["ESC 2019/2024 EP guidelines", "HAS"], lastReviewed: "2026-09" },
  },
  {
    id: "hypoglycemie",
    title: { fr: "Hypoglycémie sévère (< 0,5 g/L avec signes)", ar: "نقص سكر الدم الشديد" },
    category: "medecine",
    severity: "urgent",
    steps: [
      { title: { fr: "Glycémie capillaire immédiate (si non possible → traiter sur clinique : sueurs, tremblements, agitation puis confusion, coma)", ar: "قياس سكر شعري فوري (وإلا عالج على الأعراض)" } },
      { title: { fr: "Si conscience conservée : sucre rapide per os 15 g (3 sucres, jus). Réévaluer 15 min.", ar: "إذا واعٍ: سكر سريع فموياً 15 غ. أعد التقييم بعد 15 د." } },
      { title: { fr: "Si inconscient/comateux : G30 1 ampoule (10 g) IV ; pas de per os", ar: "إذا فاقد الوعي: G30 أمبولة وريدي؛ بلا فم" } },
      { title: { fr: "Si pas de voie IV : glucagon 1 mg IM/SC", ar: "إذا لا خط وريدي: غلوكاغون 1 ملغ عضلي" } },
      { title: { fr: "Réévaluer glycémie à 15 min (objectif ≥ 0,8 g/L) ; si besoin 2ᵉ dose G30", ar: "أعد القياس بعد 15 د؛ كرر G30 لدى الحاجة" } },
    ],
    keyPoints: [
      { fr: "Hypoglycémie = cause-de-coma-jusqu'à-preuve : toujours doser.", ar: "نقص السكر = سبب غيبوبة حتى ثبوت العكس." },
      { fr: "Après correction : manger (glucides lents) + ajuster traitement de fond.", ar: "بعد التصحيح: أكل نشويات بطيئة + عاير العلاج." },
    ],
    trajectory: [
      {
        when: { fr: "Si glycémie < 0,5 deux mesures de suite malgré le glucagon/G30", ar: "إذا السكر < 0.5 مرتين رغم الغلوكاغون/G30" },
        do: [
          { fr: "2ᵉ ampoule G30 + prudence (surdose possible en insulino-résistant ou antidiabétique prolongé).", ar: "أمبولة ثانية + حذر (جرعة زائدة ممكنة)." },
          { fr: "Évaluer une prise prolongée d'antidiabétique (sulfamide) → surveillera 24 h.", ar: "اشتباه مضاد سكري طويل المفعول ← راقب 24 س." },
        ],
      },
      {
        when: { fr: "Complication : hypoglycémie prolongée → atteinte neurologique", ar: "تعقيد: غيبوبة سكرية طويلة ← آفة عصبية" },
        do: [
          { fr: "Ne pas réveiller brutalement ; corréler le coma à la glycémie.", ar: "لا توقظ فجأة؛ اربط الغيبوبة بالسكر." },
          { fr: "Si coma > 1 h ou glycémie normale → chercher autre cause (AVC, sepsis, trauma).", ar: "إذا غيبوبة > ساعة أو سكر طبيعي ← ابحث عن سبب آخر." },
        ],
      },
    ],
    medications: ["glucose30"],
    calculators: [],
    meta: { sources: ["ADA 2026", "HAS — diabète"], lastReviewed: "2026-09" },
  },
  {
    id: "syncope",
    title: { fr: "Syncope / lipothymie", ar: "إغماء / خفة" },
    category: "medecine",
    severity: "standard",
    steps: [
      { title: { fr: "Contexte (position, effort, douleur, toux, miction) + témoins. Perte de tonus vs convulsive.", ar: "السياق + الشهود. فقدان توتر مقابل تشنج" } },
      { title: { fr: "Repos allongé, jambes surélevées ; pas de position assise prolongée", ar: "استلقاء مع رفع الساقين؛ بلا جلوس طويل" } },
      { title: { fr: "12 dérivations ECG + glycémie + iono (chercheur trouble rythme, BAV, hypoglycémie, hyperK)", ar: "ECG + سكر + شوارد" } },
      { title: { fr: "VVP + bilan : nausées, sueurs, prodromes courts vs absence (vertige vestibulaire ?)", ar: "مصل + تقييم البوادر مقابل الدوخة الدهليزية" } },
      { title: { fr: "Signe de danger : reprise lente, doute cardiaque, hémorragie (placenta enceinte) → avis", ar: "علامة خطر: استيقاظ بطيء، شك قلبي، نزيف ← رأي طبيب" } },
    ],
    keyPoints: [
      { fr: "Le plus souvent vaso-vagal / orthostatique, mais écarter la cause grave.", ar: "غالباً عصبي وعائي/انتصابي لكن استبعد الخطير." },
      { fr: "Chute traumatique associée : re-cueillir le traumatisme.", ar: "إذا سقوط مُرضّ: أعد تقييم الإصابة." },
    ],
    trajectory: [
      {
        when: { fr: "Si récidive / ECG suspect (bloc, QT long)", ar: "إذا تكرر أو اشتبه ECG (حصر، QT طويل)" },
        do: [
          { fr: "Avis cardiologique urgent / hospitalisation monitoring.", ar: "استشارة قلبية عاجلة / مراقبة بالمستشفى." },
          { fr: "Éviter le sport/risque avant bilan complet.", ar: "تجنب الرياضة قبل الفحص الكامل." },
        ],
      },
      {
        when: { fr: "Si syncope en position debout uniquement et immédiate", ar: "إذا إغماء وقوفاً فورياً" },
        do: [
          { fr: "Suspicion vasovagale simple: repos 10–20 min, contre-manœuvres, hydratation.", ar: "شك عصبي وعائي: راحة 10–20 د، مناورات مضادة، ترطيب." },
          { fr: "Consulter si récidive (risque de chute).", ar: "استشر إذا تكرر (خطر سقوط)." },
        ],
      },
    ],
    medications: [],
    calculators: [],
    meta: { sources: ["ESC syncope 2018", "CEM/SFMC"], lastReviewed: "2026-09" },
  },
  {
    id: "coup-de-chaleur",
    title: { fr: "Coup de chaleur (hyperthermie grave)", ar: "ضربة شمس / ارتفاع حرارة شديد" },
    category: "traumatologie",
    severity: "critical",
    steps: [
      { title: { fr: "Confirmer : T°core ≥ 40 °C + troubles neuro (confusion, agitation, coma) dans contexte chaud/effort", ar: "أكّد: حرارة مركزية ≥ 40° + علامات عصبية في سياق حر" } },
      { title: { fr: "Refroidissement externe IMMÉDIAT : déshabiller, essuyage + brumisation d'eau tiède, ventilation, glace aines/aisselles/cou", ar: "تبريد خارجي فوري: تعرية، رذاذ ماء فاتر، هواء، ثلج مغبن/إبط/عنق" } },
      { title: { fr: "Si très grave ou disponible : immersion en eau froide (10–15 °C) en remuant ; cible < 39 °C en 30 min", ar: "إذا شديد جداً: غمر بماء بارد 10–15°؛ هدف < 39° خلال 30 د" } },
      { title: { fr: "O2 HDF ; VVP ×2 ; remplissage REFROIDISSEMENT : cristalloïdes 4 °C 1–2 L (si pas d'OAP)", ar: "أكسجين؛ خطّان؛ سوائل باردة 1–2 ل إن أمكن" } },
      { title: { fr: "Pas de paracétamol/AINS (inefficaces, néphrotoxiques)", ar: "لا باراسيتامول/AINS (غير نافعة وسامة كلوياً)" } },
      { title: { fr: "Transfert réanimation ; surveiller K+ (hyper K possible à la lyse), iono, rhabdo", ar: "نقل عناية؛ راقب K والشوارد وتحلل العضلات" } },
    ],
    keyPoints: [
      { fr: "Le refroidissement ne peut pas attendre le bilan : commencer IMMÉDIATEMENT.", ar: "التبريد لا ينتظر الفحوص: ابدأ فوراً." },
      { fr: "Ne pas retarder le transfert si le refroidissement ne fonctionne pas (réfractaire).", ar: "لا تؤخر النقل إذا فشل التبريد." },
    ],
    trajectory: [
      {
        when: { fr: "Si T° ne baisse pas à 39 °C après 30 min de refroidissement", ar: "إذا لم تنزل الحرارة إلى 39° بعد 30 د تبريد" },
        do: [
          { fr: "Poursuivre l'immersion essuyage + ajouter perfusion intraveineuse de liquide froid.", ar: "واصل الغمر/المسح وأضف سوائل وريدية باردة." },
          { fr: "Vérifier comorbidité (MHD, dystonie neuroleptique, sérotoninergique) → traitement spécifique.", ar: "تحقق من متلازمات (خبيثة، ديستونيا، سيروتونين) ← علاج نوعي." },
        ],
      },
      {
        when: { fr: "Complications : rhabdomyolyse, insuffisance rénale aiguë, CID", ar: "تعقيدات: تحلل عضلي، قصور كلوي حاد، تخثر منتشر" },
        do: [
          { fr: "Remplissage abondant (si permis) + bicarbonate si acidose ; transfert dialyse/réanimation.", ar: "تعويض وفير + بيكربونات عند الحماض؛ نقل لعناية/تصفية." },
          { fr: "Surveiller hémostase (plaquettes, TP) si suspicion CID.", ar: "راقب التخثر عند شك CID." },
        ],
      },
    ],
    medications: [],
    calculators: [],
    meta: { sources: ["AHA Heat stroke", "Société française de médecine d'urgence"], lastReviewed: "2026-09" },
  },
  {
    id: "pneumothorax-suffocant",
    title: { fr: "Pneumothorax suffocant (tension)", ar: "استرواح صدر ضاغط" },
    category: "traumatologie",
    severity: "critical",
    steps: [
      { title: { fr: "Traumatisme thoracique + dyspnée brutale + MV abolies + hyperclarté ± hypotonie/détresse", ar: "رض صدري + ضيق تنفس حاد + كتم تهوية + نفخ مفرط" } },
      { title: { fr: "Pas de radio AVANT traitement — diagnostic clinique", ar: "لا تصوير قبل العلاج — التشخيص سريري" } },
      { title: { fr: "Décompression immédiate : aiguille 14–16 G 4ᵉespace intercostal, ligne axillaire antérieure (ou 2ᵉ EIC hémithorax, ligne médioclaviculaire)", ar: "بزل فوري: إبرة 14–16 في المسافة الرابعة بالخط الإبطي الأمامي" } },
      { title: { fr: "Passage en valve (gant troué ou valve de Heimlich) ou tube thoracique si disponible", ar: "صمام (قفاز مثقوب/هايمليخ) أو أنبوب صدري إن أمكن" } },
      { title: { fr: "Réévaluer auscultation, SpO2, TA ; transport médicalisé URGENT", ar: "أعد الإصغاء والتشبع والضغط؛ نقل طبي عاجل" } },
    ],
    keyPoints: [
      { fr: "Aiguille seule = traitement TEMPORAIRE — le thorax peut se refermer.", ar: "الإبرة علاج مؤقت — قد يُعاد الاسترواح." },
      { fr: "Le 4ᵉ EIC est préféré (plus sûr) ; le 2ᵉ possible mais risque vasculaire.", ar: "المسافة 4 أسلم؛ الثانية ممكنة لكن خطر وعائي." },
    ],
    trajectory: [
      {
        when: { fr: "Si la décompression n'améliore pas la SpO2/TA", ar: "إذا لم يُحسّن البزل التشبع/الضغط" },
        do: [
          { fr: "Re-décompresser à l'autre espace ou vérifier l'obstruction (pli de l'aiguille, caillot).", ar: "بزل مجدداً بمسافة أخرى أو افحص انسداد الإبرة." },
          { fr: "Préparer le drain thoracique (24–28 F) dès possible.", ar: "جهّز أنبوباً صدرياً (24–28) فوراً." },
        ],
      },
      {
        when: { fr: "Après drain, pendant le transport", ar: "بعد الأنبوب أثناء النقل" },
        do: [
          { fr: "Fixer, vidanger (water seal) ; ne jamais fermer (risque de tension).", ar: "ثبّت ولا تقفل الأنبوب (خطر ضغط)." },
          { fr: "En cas de détérioration : rechercher déplacement/obstruction du drain.", ar: "عند التدهور: افحص انزياح/انسداد الأنبوب." },
        ],
      },
    ],
    medications: [],
    calculators: [],
    meta: { sources: ["ATLS 10ᵉ édition", "BTS/ERC"], lastReviewed: "2026-09" },
  },
];

import type { Medication } from "./types";
import { medicationsPhase2 } from "./medications-p2";
import { medicationsPhase3 } from "./medications-p3";
import { medicationsPhase4 } from "./medications-p4";
import { medicationsPhase5 } from "./medications-p5";
import { medicationsPhase6 } from "./medications-p6";

// ⚕️ Contenu rédigé d'après ERC 2021 / AHA ACLS 2025 / RCUK anaphylaxie 2021 / SFAR.
// ⚠️ À faire valider par un médecin tunisien et à adapter aux spécialités locales avant usage.
const medicationsCore: Medication[] = [
  {
    id: "adrenaline",
    name: { fr: "Adrénaline (Épinéphrine)", ar: "أدرنالين (إبينفرين)" },
    brands: "Adrénaline Aguettant® 1 mg/1 mL ; Adrénaline Medis® 1 mg/1 mL",
    synonyms: ["adrenaline", "epinephrine", "épinéphrine", "adrénaline", "adrenalina", "أدرنالين"],
    klass: { fr: "Catécholamine — α et β-adrénomimétique", ar: "كاتيكولامين — منبّه ألفا وبيتا أدرينالي" },
    highRisk: true,
    indications: {
      fr: "Arrêt cardiaque (tous rythmes) ; anaphylaxie (1ère ligne, IM) ; choc anaphylactique réfractaire (PSE, milieu médicalisé).",
      ar: "توقف القلب (جميع الإيقاعات)؛ الصدمة الأرجية (الخط الأول، عضلياً)؛ صدمة أرجية مقاومة (مضخة وريدية في وسط طبّي).",
    },
    doseAdult: {
      fr: "ACR : 1 mg IV/IO toutes les 3–5 min. Anaphylaxie : 500 µg IM (0,5 mL à 1 mg/mL) face antéro-latérale de cuisse, répétable après 5 min.",
      ar: "توقف القلب: 1 ملغ وريد/نخاع كل 3–5 دقائق. الأنفيلاكسي: 500 مكغ عضلياً (0.5 مل من 1ملغ/مل) في الوجه الأمامي الوحشي للفخذ، تُعاد بعد 5 دقائق.",
    },
    dosePediatric: {
      fr: "ACR : 0,01 mg/kg IV/IO (0,1 mL/kg à 1/10 000), toutes les 3–5 min. Anaphylaxie IM (1 mg/mL) : >12 ans 500 µg ; 6–12 ans 300 µg ; 6 mois–6 ans 150 µg ; <6 mois 100–150 µg.",
      ar: "توقف القلب: 0.01 ملغ/كغ وريد/نخاع (0.1 مل/كغ من 1/10000) كل 3–5 دقائق. الأنفيلاكسي عضلياً: >12 سنة 500 مكغ؛ 6–12 سنة 300 مكغ؛ 6 أشهر–6 سنوات 150 مكغ؛ <6 أشهر 100–150 مكغ.",
    },
    dilution: {
      fr: "ACR : pure ou diluée à 10 mL (1/10 000). PSE : diluer dans NaCl 0,9 % ou G5 % — voie dédiée.",
      ar: "توقف القلب: نقية أو ممددة إلى 10 مل (1/10000). المضخة: تمدد في محلول ملحي 0.9% أو غلوكوز 5% — خط مخصص.",
    },
    contraindications: {
      fr: "Aucune absolue dans l'ACR et l'anaphylaxie. Prudence : coronaropathie, HTA non contrôlée, grossesse (bénéfice >> risque).",
      ar: "لا موانع مطلقة في توقف القلب والأنفيلاكسي. حذر: قصور إكليلي، ارتفاع ضغط غير مضبوط، حمل (الفائدة تفوق الخطر بكثير).",
    },
    sideEffects: {
      fr: "Tachycardie, HTA, arythmies, ischémie myocardique, tremblements, hyperglycémie. Doses excessives IV : FV, HTA majeure, OAP.",
      ar: "تسرع قلب، ارتفاع ضغط، اضطراب نظم، إقفار قلبي، رعاش، ارتفاع سكر. جرعات وريدية مفرطة: رجفان بطيني، ارتفاع ضغط شديد، وذمة رئة حادة.",
    },
    nursing: {
      fr: "Ne jamais injecter en sous-cutané en urgence vitale. Surveillance TA/FC/SpO2 continue. Voie IM = face antéro-latérale de la cuisse. Solution colorée ou trouble → jeter.",
      ar: "لا تحقن تحت الجلد في الخطر الحيوي. مراقبة مستمرة للضغط والنبض والتشبع. الحقن العضلي في الفخذ الأمامي الوحشي. محلول ملوّن أو عكر → تلف.",
    },
    storage: {
      fr: "À l'abri de la lumière, <25 °C (ampoules). Incompatible avec les alcalins (NaHCO3) — rincer la voie.",
      ar: "بعيداً عن الضوء، <25°م. غير متوافق مع القلويات (بيكربونات) — اغسل الخط.",
    },
    alternatives: ["noradrenaline"],
    interactions: [
      { drug: "Bêta-bloquants", severity: "high", description: { fr: "Effet antagoniste ; HTA paradoxale possible (α non opposé).", ar: "تأثير متضاد؛ احتمال ارتفاع ضغط متناقض." } },
      { drug: "NaHCO3", severity: "moderate", description: { fr: "Incompatibilité physico-chimique — ne pas co-perfuser sur la même voie.", ar: "عدم توافق فيزيائي كيميائي — لا تخلط على نفس الخط." } },
    ],
    weightDose: { mgPerKg: 0.01, maxMg: 1, note: { fr: "ACR pédiatrique : 0,01 mg/kg (max 1 mg). Anaphylaxie : max 500 µg (IM).", ar: "توقف قلب أطفال: 0.01 ملغ/كغ (بحد أقصى 1 ملغ). الأنفيلاكسي: أقصى 500 مكغ عضلياً." } },
    meta: { sources: ["AHA ACLS 2025", "ERC 2021", "RCUK Anaphylaxis 2021"], lastReviewed: "2026-08" },
  },
  {
    id: "amiodarone",
    name: { fr: "Amiodarone", ar: "أميودارون" },
    brands: "Cordarone® 150 mg/3 mL (IV) ; 200 mg cp",
    synonyms: ["amiodarone", "cordarone", "أميودارون", "كوردارون"],
    klass: { fr: "Antiarythmique classe III", ar: "مضاد اضطراب نظم من الصنف الثالث" },
    highRisk: true,
    indications: {
      fr: "FV/TV sans pouls réfractaire aux chocs ; tachycardies régulières stables (avis spécialisé) ; FA rapide instable (alternatives).",
      ar: "رجفان/تسرع بطيني بلا نبض مقاوم للصدمات؛ تسرعات منتظمة مستقرة (رأي مختص).",
    },
    doseAdult: {
      fr: "ACR : 300 mg IV/IO bolus puis 150 mg. TV stable : 150 mg sur 10 min, puis PSE 1 mg/min ×6 h (→ 0,5 mg/min).",
      ar: "توقف القلب: 300 ملغ وريد/نخاع دفعة ثم 150 ملغ. تسرع بطيني مستقر: 150 ملغ على 10 دقائق ثم مضخة 1 ملغ/د ×6 ساعات.",
    },
    dosePediatric: {
      fr: "ACR : 5 mg/kg IV/IO (max 300 mg), répétable ×2 jusqu'à 15 mg/kg/j. Trouble du rythme (avis spécialisé) : 5 mg/kg sur 20–60 min.",
      ar: "توقف القلب: 5 ملغ/كغ وريد/نخاع (أقصى 300 ملغ) تُعاد مرتين حتى 15 ملغ/كغ/يوم. اضطراب النظم: 5 ملغ/كغ على 20–60 دقيقة (برأي مختص).",
    },
    dilution: {
      fr: "Diluer dans G5 % UNIQUEMENT (incompatible NaCl). PSE : voie centrale préférée.",
      ar: "تمدد في غلوكوز 5% فقط (غير متوافقة مع المصل الملحي). المضخة: يفضَّل خط مركزي.",
    },
    contraindications: {
      fr: "Bloc AV haut degré non appareillé, bradycardie sinusale sévère, dysthyroïdie évolutive, QT long.",
      ar: "حصار أذيني بطيني عالي الدرجة بلا منظّم خطى، بطء قلب جيبي شديد، اعتلال درقي مترقٍّ، QT طويل.",
    },
    sideEffects: {
      fr: "Hypotension, bradycardie, allongement QT. Chronique : thyroïde, poumon, foie (hors urgence).",
      ar: "انخفاض ضغط، بطء قلب، إطالة QT. مزمناً: درقية، رئة، كبد (خارج الاستعجالي).",
    },
    nursing: {
      fr: "Injection rapide = posteriorrétention de l'hypotension (solvant) — bolus ACR acceptable. Rincer la voie après bolus. Surveiller TA et QT.",
      ar: "الحقن السريع يسبب انخفاض ضغط (الحلّال) — دفعة الإنعاش مقبولة. اغسل الخط. راقب الضغط وQT.",
    },
    storage: { fr: "Température ambiante, à l'abri de la lumière ; ampoule ouverte = usage immédiat.", ar: "حرارة الغرفة بعيداً عن الضوء؛ الأمبولة المفتوحة للاستعمال الفوري." },
    alternatives: ["lidocaine"],
    interactions: [
      { drug: "Bêta-bloquants / inhibiteurs calciques", severity: "high", description: { fr: "Bradycardie, bloc AV, hypotension — association déconseillée en urgence.", ar: "بطء قلب وحصار وانخفاض ضغط — تجنَّب الجمع في الاستعجالي." } },
    ],
    weightDose: { mgPerKg: 5, maxMg: 300, note: { fr: "ACR pédiatrique : 5 mg/kg (max 300 mg).", ar: "توقف قلب أطفال: 5 ملغ/كغ (أقصى 300 ملغ)." } },
    meta: { sources: ["AHA ACLS 2025", "AHA PALS 2020", "ERC 2021"], lastReviewed: "2026-08" },
  },
  {
    id: "atropine",
    name: { fr: "Atropine", ar: "أتروبين" },
    brands: "Atropine Aguettant® 1 mg/1 mL ; 0,5 mg/1 mL",
    synonyms: ["atropine", "أتروبين", "اتروبين"],
    klass: { fr: "Anticholinergique (antimuscarinique)", ar: "مضاد كوليني (مضاد موسكاريني)" },
    highRisk: false,
    indications: {
      fr: "Bradycardie symptomatique ; bloc AV sinus/atrial ; intoxication organophosphorée (en association).",
      ar: "بطء قلب عرضي؛ حصار جيبي/أذيني؛ تسمم بالمركبات الفوسفورية العضوية (بالاشتراك).",
    },
    doseAdult: {
      fr: "Bradycardie : 1 mg IV toutes les 3–5 min, max 3 mg. Organophosphorés : 1–2 mg IV puis titrage jusqu'à atropinisation.",
      ar: "بطء القلب: 1 ملغ وريد كل 3–5 دقائق، أقصى 3 ملغ. الفوسفوريات العضوية: 1–2 ملغ ثم معايرة حتى الأتروبنة.",
    },
    dosePediatric: {
      fr: "0,02 mg/kg IV/IO (min 0,1 mg ; max dose unique 0,5 mg enfant, 1 mg adolescent), répétable ×1.",
      ar: "0.02 ملغ/كغ وريد/نخاع (أدنى 0.1 ملغ؛ أقصى للجرعة الواحدة 0.5 ملغ طفل، 1 ملغ مراهق)، تُعاد مرة.",
    },
    dilution: { fr: "Pure, IV directe lente ; dilution possible dans 10 mL NaCl 0,9 %.", ar: "نقية، وريد مباشر بطيء؛ يمكن التمديد في 10 مل مصل ملحي." },
    contraindications: {
      fr: "Pyrale : glaucome à angle fermé, rétention urinaire aiguë — relatives en urgence vitale.",
      ar: "نظرياً: زرق مغلق الزاوية، احتباس بولي حاد — نسبية في الخطر الحيوي.",
    },
    sideEffects: { fr: "Sécheresse, mydriase, tachycardie, confusion (sujet âgé), hyperthermie.", ar: "جفاف فم، اتساع حدقة، تسرع قلب، تشوش (المسن)، فرط حرارة." },
    nursing: {
      fr: "Inefficace dans le bloc infranodalien documenté (transplanté cardiaque, BAV haut) — accélérateur/adrénaline. Vérifier les constantes avant/après.",
      ar: "غير فعالة في الحصار تحت العقدي الموثق — فكّر في المعجّل الخارجي/الأدرنالين. تحقق من العلامات قبل وبعد.",
    },
    storage: { fr: "Température ambiante, lumière.", ar: "حرارة الغرفة، بعيداً عن الضوء." },
    alternatives: [],
    weightDose: { mgPerKg: 0.02, maxMg: 0.5, note: { fr: "Min 0,1 mg (éviter bradycardie paradoxale). Max 0,5 mg enfant / 1 mg adolescent.", ar: "أدنى 0.1 ملغ (تجنّب بطء قلب متناقض). أقصى 0.5 ملغ طفل / 1 ملغ مراهق." } },
    meta: { sources: ["AHA ACLS 2025", "AHA PALS 2020"], lastReviewed: "2026-08" },
  },
  {
    id: "noradrenaline",
    name: { fr: "Noradrénaline", ar: "نورأدرنالين" },
    brands: "Noradrénaline (tartrate) Aguettant® 8 mg/4 mL (à diluer)",
    synonyms: ["noradrenaline", "norepinephrine", "norépinéphrine", "levantérénol", "نورأدرنالين"],
    klass: { fr: "Catécholamine — vasopresseur α prédominant", ar: "كاتيكولامين — قابض وعائي ألفا غالب" },
    highRisk: true,
    indications: {
      fr: "Choc septique, choc anaphylactique réfractaire (après adrénaline IM), choc cardiogénique avec vasoplégie (avis spécialisé).",
      ar: "الصدمة الإنتانية، صدمة أرجية مقاومة (بعد أدرنالين عضلي)، صدمة قلبية مع وهن وعائي (رأي مختص).",
    },
    doseAdult: {
      fr: "PSE : débuter à 0,05–0,1 µg/kg/min, titrer à la PAM (objectif ≥65 mmHg). Choc septique : dosage usuel 0,05–1 µg/kg/min.",
      ar: "مضخة: ابدأ 0.05–0.1 مكغ/كغ/د، عايِر على متوسط الضغط (≥65 مم زئبق). الصدمة الإنتانية: 0.05–1 مكغ/كغ/د عادة.",
    },
    dosePediatric: {
      fr: "0,05–0,3 µg/kg/min PSE (milieu de réanimation), titration attentive.",
      ar: "0.05–0.3 مكغ/كغ/د مضخة (وسط الإنعاش)، معايرة دقيقة.",
    },
    dilution: {
      fr: "G5 % exclusivement (oxydation dans le sérum salé) ; voie centrale fortement recommandée (risque de nécrose en périphérique). Schéma repère : 4 mg dans 50 mL.",
      ar: "غلوكوز 5% حصراً (تتأكسد في المصل الملحي)؛ يُستحسن بشدة خط مركزي (خطر نخر محيطي). مرجع: 4 ملغ في 50 مل.",
    },
    contraindications: {
      fr: "Hypovolémie non corrigée (à remplir d'abord) ; relatives : thrombose mésentérique/périphérique.",
      ar: "نقص حجم غير مصحح (املأ أولاً)؛ نسبية: خثار مساريقي/محيطي.",
    },
    sideEffects: {
      fr: "HTA, arythmies, ischémie (mésentérique, digitale, rénale), extravasation = nécrose (antidote : phentolamine locale).",
      ar: "ارتفاع ضغط، اضطراب نظم، إقفار محيطي/كلوي، تسرّب خارج الوريد = نخر (الترياق: فينتولامين موضعياً).",
    },
    nursing: {
      fr: "JAMAIS de bolus hors ACR. Surveiller PAM continue si possible, abords veineux, diurèse. Ne pas arrêter brutalement ; diminuer progressivement.",
      ar: "لا دفعات إطلاقاً خارج الإنعاش. راقب متوسط الضغط باستمرار إن أمكن، والخطوط والبيلة. لا توقف فجأة؛ خفّف تدريجياً.",
    },
    storage: { fr: "2–8 °C, lumière. Solution rosée/brunie → jeter.", ar: "2–8°م بعيداً عن الضوء. محلول وردي/بني → تلف." },
    alternatives: ["adrenaline"],
    interactions: [
      { drug: "IMAO / antidépresseurs tricycliques", severity: "high", description: { fr: "HTA majeure par potentialisation — réduire la dose initiale fortement.", ar: "ارتفاع ضغط شديد بالتفعيل — خفّض الجرعة الابتدائية كثيراً." } },
    ],
    meta: { sources: ["Surviving Sepsis Campaign 2021", "ERC 2021"], lastReviewed: "2026-08" },
  },
  {
    id: "midazolam",
    name: { fr: "Midazolam", ar: "ميدازولام" },
    brands: "Hypnovel® 5 mg/5 mL ; Midazolam Mylan® 5 mg/5 mL",
    synonyms: ["midazolam", "hypnovel", "ميدازولام", "هيبنوفيل"],
    klass: { fr: "Benzodiazépine — anticonvulsivant/sédatif", ar: "بنزوديازيبين — مضاد اختلاج/مهدئ" },
    highRisk: true,
    indications: {
      fr: "État de mal convulsif (1ère ligne si pas de voie veineuse : IM/buccal/nasal) ; sédation procédurale ; agitation sévère (déférer si possible).",
      ar: "حالة صرعية مستمرة (الخط الأول دون خط وريدي: عضلي/شدقي/أنفي)؛ تهدئة إجرائية؛ هياج شديد.",
    },
    doseAdult: {
      fr: "Convulsions : 10 mg IM (ou 0,1 mg/kg IV lent, max 10 mg), répétable ×1 après 5–10 min. Sédation : 1–2 mg IV titré.",
      ar: "الاختلاج: 10 ملغ عضلياً (أو 0.1 ملغ/كغ وريد ببطء، أقصى 10 ملغ)، تُعاد مرة بعد 5–10 د. التهدئة: 1–2 ملغ وريد بالمعايرة.",
    },
    dosePediatric: {
      fr: "Convulsions : IM 0,2 mg/kg (max 10 mg) ; buccal/intranasal 0,3 mg/kg (max 10 mg) ; IV 0,1 mg/kg. <6 mois : prudence (dépression respiratoire).",
      ar: "الاختلاج: عضلياً 0.2 ملغ/كغ (أقصى 10)؛ شدقياً/أنفياً 0.3 ملغ/كغ (أقصى 10)؛ وريد 0.1 ملغ/كغ. <6 أشهر: حذر (تثبيط تنفسي).",
    },
    dilution: { fr: "Pur IM/buccal/nasal ; IV lent diluable NaCl 0,9 % ou G5 %.", ar: "نقي عضلياً/شدقياً/أنفياً؛ وريد بطيء قابل للتمديد." },
    contraindications: {
      fr: "Dépression respiratoire non contrôlée, choc, myasthénie ; prudence majeure sujet âgé/IRC.",
      ar: "تثبيط تنفسي غير مضبوط، صدمة، وهن عضلي؛ حذر شديد عند المسن وقصور الكلى.",
    },
    sideEffects: { fr: "Dépression respiratoire dose-dépendante, hypotension, paradoxale agitation. Antidote : flumazénil (prudence : convulsions).", ar: "تثبيط تنفسي مرتبط بالجرعة، انخفاض ضغط، هياج متناقض. الترياق: فلومازينيل (حذر: اختلاج)." },
    nursing: {
      fr: "Préparer ventilation (BCU) avant injection. Monitorer SpO2/FR ≥15 min après. IM efficace en 5–10 min.",
      ar: "جهّز التهوية (بالون-قناع) قبل الحقن. راقب التشبع والتنفس ≥15 د بعدها. العضلي يفعّل خلال 5–10 د.",
    },
    storage: { fr: "Température ambiante.", ar: "حرارة الغرفة." },
    alternatives: ["diazepam"],
    weightDose: { mgPerKg: 0.2, maxMg: 10, note: { fr: "IM : 0,2 mg/kg (max 10 mg). Buccal/nasal : 0,3 mg/kg.", ar: "عضلياً: 0.2 ملغ/كغ (أقصى 10). شدقياً/أنفياً: 0.3 ملغ/كغ." } },
    meta: { sources: ["AES/ILAE status epilepticus", "SFAR"], lastReviewed: "2026-08" },
  },
  {
    id: "naloxone",
    name: { fr: "Naloxone", ar: "نالوكسون" },
    brands: "Naloxone Aguettant® 0,4 mg/1 mL",
    synonyms: ["naloxone", "narcan", "نالوكسون", "ناركان"],
    klass: { fr: "Antagoniste des opioïdes", ar: "مضاد للأفيونات" },
    highRisk: false,
    indications: {
      fr: "Sursdose d'opioïdes avec dépression respiratoire (FR <12, myosis, coma). Diagnostic + thérapeutique.",
      ar: "جرعة أفيونية زائدة مع تثبيط تنفسي (تواتر <12، حدقة دبوسية، غيبوبة). تشخيصي وعلاجي.",
    },
    doseAdult: {
      fr: "0,4 mg IV/IM/IN, répéter toutes les 2–3 min jusqu'à récupération respiratoire (objectif : respirer, pas réveiller complètement). Max initial ~10 mg avant de réviser le diagnostic. PSE si produit retard.",
      ar: "0.4 ملغ وريد/عضلي/أنفي، تُعاد كل 2–3 د حتى استعادة التنفس (الهدف: التنفس لا اليقظة الكاملة). ~10 ملغ قبل مراجعة التشخيص. مضخة إن كان منتجاً ممتد المفعول.",
    },
    dosePediatric: { fr: "0,01 mg/kg IV/IM (max 2 mg), titrer.", ar: "0.01 ملغ/كغ وريد/عضلي (أقصى 2 ملغ)، مع معايرة." },
    dilution: { fr: "Pur ; PSE : 2 mg dans 50 mL G5 %.", ar: "نقي؛ المضخة: 2 ملغ في 50 مل G5%." },
    contraindications: { fr: "Aucune absolue en urgence vitale.", ar: "لا موانع مطلقة في الخطر الحيوي." },
    sideEffects: {
      fr: "Syndrome de sevrage aigu (agitation, vomissements, douleurs), OAP rare en réveil brutal chez toxicomane chronique.",
      ar: "متلازمة سحب حادة (هياج، تقيؤ، ألم)، وذمة رئة نادرة عند الإفاقة الفجائية للمدمن المزمن.",
    },
    nursing: {
      fr: "Demi-vie 20–30 min < celle de la plupart des opioïdes → rechute de sédation : surveiller ≥2 h, répéter ou PSE. Sécuriser aggression potentielle au réveil.",
      ar: "عمر النصف 20–30 د أقصر من معظم الأفيونات → ارتداد التثبيط: راقب ≥2 ساعة، أعد أو مضخة. احذر عدوانية محتملة عند الإفاقة.",
    },
    storage: { fr: "Température ambiante, lumière.", ar: "حرارة الغرفة بعيداً عن الضوء." },
    alternatives: [],
    weightDose: { mgPerKg: 0.01, maxMg: 2, note: { fr: "Pédiatrie : 0,01 mg/kg (max 2 mg/dose).", ar: "أطفال: 0.01 ملغ/كغ (أقصى 2 ملغ/جرعة)." } },
    meta: { sources: ["AHA 2023 man. spéciales intoxications", "HAS tox urgence"], lastReviewed: "2026-08" },
  },
  {
    id: "glucose30",
    name: { fr: "Glucose 30 % (G30)", ar: "غلوكوز 30% (G30)" },
    brands: "Glucose 30 % Aguettant® (ampoules) ; G30®",
    synonyms: ["glucose", "g30", "dextrose", "sucre", "غلوكوز", "سكر"],
    klass: { fr: "Glucide hypertonique — antidote hypoglycémie", ar: "سكر مفرط التوتر — ترياق نقص السكر" },
    highRisk: false,
    indications: {
      fr: "Hypoglycémie symptomatique avec trouble de conscience (glycémie capillaire <0,8 g/L ou si indosable dans les délais).",
      ar: "نقص سكر عرضي مع اضطراب وعي (سكر شعري <0.8 غ/ل أو إن تعذّر قياسه بسرعة).",
    },
    doseAdult: {
      fr: "1–2 ampoules G30 % IV lente (40–80 mL), réévaluer glycémie à 10–15 min. Si alcoolisme/dénutrition : thiamine 250 mg avant (prévention Gayet-Wernicke).",
      ar: "1–2 أمبولة G30 وريد بطيء (40–80 مل)، أعد قياس السكر بعد 10–15 د. إن كان إدمان كحول/سوء تغذية: ثيامين 250 ملغ قبلها.",
    },
    dosePediatric: {
      fr: "G10 % : 5 mL/kg IV (préférable au G30 % hyperosmolaire). Nourrisson : G10 % 5 mL/kg relire 10–15 min.",
      ar: "غلوكوز 10%: 5 مل/كغ وريد (يفضَّل على 30% مفرط التوتر). أعد القياس بعد 10–15 د.",
    },
    dilution: { fr: "Pur IV lent (voir pédiatrie : préférer G10 %).", ar: "نقي وريد بطيء (للأطفال يفضَّل 10%)." },
    contraindications: { fr: "Œdème/désordre intracrânien aigu — relative.", ar: "وذمة/خلل دماغي حاد — نسبية." },
    sideEffects: { fr: "Phlébite, hyperglycémie rebond, hyponatrémie de dilution (sur-correction).", ar: "التهاب وريد، فرط سكر ارتدادي، نقص صوديوم تمددي." },
    nursing: {
      fr: "Contrôler glycémie AVANT et APRÈS (10–15 min). Voie périphérique OK (irritant léger). Patient conscient hypoglycémique : sucre oral d'abord.",
      ar: "قِس السكر قبل وبعد (10–15 د). خط محيطي مقبول. الواعي: سكر فموي أولاً.",
    },
    storage: { fr: "Température ambiante.", ar: "حرارة الغرفة." },
    alternatives: [],
    meta: { sources: ["HAS hypoglycémie urgence", "AHA FOAM tox"], lastReviewed: "2026-08" },
  },
  {
    id: "furosemide",
    name: { fr: "Furosémide", ar: "فوروسيميد" },
    brands: "Lasilix® 20 mg/2 mL (IV) ; 40 mg cp",
    synonyms: ["furosemide", "lasilix", "diurétique", "فوروسيميد", "لازيليكس"],
    klass: { fr: "Diurétique de l'anse", ar: "مدرّ عروي" },
    highRisk: false,
    indications: {
      fr: "Œdème aigu du poumon avec surcharge / IC décompensée congestive ; hypercalcémie (complément).",
      ar: "وذمة رئة حادة مع فرط حجم/قصور قلب احتقاني؛ فرط كالسيوم (تكميلي).",
    },
    doseAdult: {
      fr: "OAP : 40–80 mg IV directe lente ; si traitement de fond : ≈ 1–2,5× la dose orale habituelle en IV. Réévaluer à 30–60 min.",
      ar: "وذمة الرئة: 40–80 ملغ وريد بطيء؛ إذا يتعالج مزمناً: ~1–2.5 ضعف جرعته الفموية وريدياً. أعد التقييم بعد 30–60 د.",
    },
    dosePediatric: { fr: "1 mg/kg IV (max 20–40 mg), milieu pédiatrique.", ar: "1 ملغ/كغ وريد (أقصى 20–40 ملغ)." },
    dilution: { fr: "Pur IV lent (ou dilué NaCl 0,9 % pour PSE).", ar: "نقي وريد بطيء (أو ممدد للمضخة)." },
    contraindications: {
      fr: "Hypovolémie/choc, hypokaliémie sévère non corrigée, anurie.",
      ar: "نقص حجم/صدمة، نقص بوتاسيوم شديد غير مصحّح، انقطاع بول.",
    },
    sideEffects: { fr: "Hypotension, hypokaliémie, hyponatrémie, déshydratation ; ototoxicité si injection <4 mg/min dépassée (bolus rapide).", ar: "انخفاض ضغط، نقص بوتاسيوم/صوديوم، تجفاف؛ سمية أذنية إن حُقن أسرع من 4 ملغ/د." },
    nursing: {
      fr: "TA avant/après. Ionogramme dès que possible (K+, Na+). Injection lente ≥2 min. Sonde urinaire si OAP sévère.",
      ar: "اضغط قبل/بعد. أيونوغرام بأسرع وقت. حقن بطيء ≥2 د. قسطرة بولية في الوذمة الشديدة.",
    },
    storage: { fr: "Température ambiante, lumière.", ar: "حرارة الغرفة بعيداً عن الضوء." },
    alternatives: [],
    weightDose: { mgPerKg: 1, maxMg: 40, note: { fr: "Pédiatrie : 1 mg/kg.", ar: "أطفال: 1 ملغ/كغ." } },
    meta: { sources: ["ESC IC aiguë 2021", "HAS OAP"], lastReviewed: "2026-08" },
  },
];

// Registre complet : noyau + phases 2–5
export const medications: Medication[] = [
  ...medicationsCore,
  ...medicationsPhase2,
  ...medicationsPhase3,
  ...medicationsPhase4,
  ...medicationsPhase5,
  ...medicationsPhase6,
];

export function getMedication(id: string): Medication | undefined {
  return medications.find((m) => m.id === id);
}

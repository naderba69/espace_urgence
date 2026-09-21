import type { Medication } from "./types";

// v8.3 — Phase 10 : sevrage alcoolique (thiamine, halopéridol, phénobarbital),
// anaérobies (métronidazole), antiémétique de référence (ondansétron).
export const medicationsPhase10: Medication[] = [
  {
    id: "thiamine",
    name: { fr: "Thiamine (vitamine B1)", ar: "ثيامين (فيتامين B1)" },
    brands: "Bévitaline® 250 mg/2 mL inj ; Vitamine B1® cp 250 mg",
    synonyms: ["thiamine", "vitamine b1", "bévitaline", "thiaminum", "ثيامين"],
    klass: { fr: "Vitamine hydrosoluble — prévention/traitement de l'encéphalopathie de Wernicke", ar: "فيتامين ذواب بالماء — وقاية/علاج اعتلال فرنكه الدماغي" },
    highRisk: false,
    indications: {
      fr: "Prévention et traitement de l'encéphalopathie de Wernicke (tout patient alcoolisé, dénutri, vomissements incoercibles, post-chirurgie bariatrique), sevrage alcoolique, encéphalopathie carentielle.",
      ar: "وقاية وعلاج اعتلال فرنكه (كل مريض كحولي، ناقص تغذية، تقيؤ مستمر، بعد جراحة سمنة)، الانسحاب الكحولي، اعتلال دماغي بنقص غذائي.",
    },
    doseAdult: {
      fr: "Wernicke suspecté/traité : 500 mg IV dans 100 mL NaCl 0,9 % sur 30 min × 3/j pendant 2-3 jours, puis 250 mg/j × 5 j. Prophylaxie : 250 mg IV/j.",
      ar: "فرنكه مشتبه/معالج: 500 ملغ وريدي في 100 مل محلول ملحي على 30 د × 3/ي لمدة 2-3 أيام، ثم 250 ملغ/ي × 5 أيام. وقاية: 250 ملغ وريدي/ي.",
    },
    dosePediatric: {
      fr: "2-5 mg/kg/dose IV (max 300 mg) chez l'enfant carencé — usage spécialisé.",
      ar: "‏2-5 ملغ/كغ/جرعة وريدياً (أقصى 300 ملغ) للطفل ناقص المخزون — استعمال مختص.",
    },
    dilution: {
      fr: "Toujours diluer et perfuser en 30 min (jamais de bolus IV direct : réactions anaphylactoïdes décrites). Le glucose AVANT la thiamine peut précipiter le Wernicke : donner la thiamine AVANT ou en même temps.",
      ar: "خفف دائماً وسرّب على 30 د (أبداً دفعة وريدية مباشرة: تفاعلات تأقية موصوفة). الغلوكوز قبل الثيامين قد يفجر فرنكه: أعطِ الثيامين قبله أو معه.",
    },
    contraindications: {
      fr: "Allergie connue à la thiamine (rare). Aucune contre-indication absolue en urgence — le bénéfice dépasse toujours le risque.",
      ar: "حساسية معروفة للثيامين (نادرة). لا مضاد استطباب مطلق بالطوارئ — الفائدة تتجاوز الخطر دائماً.",
    },
    sideEffects: {
      fr: "Réactions d'hypersensibilité rares (bolus), douleur au point d'injection, flush. Excellente tolérance aux doses recommandées.",
      ar: "تفاعلات فرط حساسية نادرة (الدفعة)، ألم موضع الحقن، تورد. تحمل ممتاز بالجرع الموصى بها.",
    },
    nursing: {
      fr: "Chez tout alcoolisé admis : thiamine SYSTÉMATIQUE avant perfusion glucosée. Poursuivre la voie orale à la sortie (carence persistante).",
      ar: "عند كل كحولي مُدخل: ثيامين منهجي قبل أي تسريب سكري. واصل الطريق الفموي عند الخروج (العوز مستمر).",
    },
    storage: { fr: "Protéger de la lumière ; ampoule à usage unique.", ar: "احمِ من الضوء؛ الأمبولة لاستعمال وحيد." },
    alternatives: [],
    weightDose: { mgPerKg: 0, maxMg: 0, note: { fr: "Posologie fixe adulte — voir doses.", ar: "جرعة ثابتة للبالغ — انظر الجرع." } },
    meta: { sources: ["EFNS Wernicke 2010", "ASAM 2020"], lastReviewed: "2026-09" },
  },
  {
    id: "haloperidol",
    name: { fr: "Halopéridol", ar: "هالوبيريدول" },
    brands: "Haldol® 5 mg/mL inj ; sol. buvable 2 mg/mL ; cp 5 mg",
    synonyms: ["haloperidol", "haldol", "neuroleptique", "هالوبيريدول"],
    klass: { fr: "Neuroleptique butyrophénone — agitation sévère, hallucinations, vomissements réfractaires", ar: "مضاد ذهاني بيوتيريفينون — هياج شديد، هلاوس، تقيؤ مقاوم" },
    highRisk: true,
    indications: {
      fr: "Agitation/hallucinations sévères du delirium tremens (en ADJOINT des benzodiazépines, jamais seul), delirium en réanimation, vomissements réfractaires (soins palliatifs), psychose aiguë.",
      ar: "هياج/هلاوس شديدة بالهذيان الارتعاشي (كإضافة للبنزوديازيبين، لا وحده أبداً)، هذيان بالإنعاش، تقيؤ مقاوم (رعاية تلطيفية)، ذهان حاد.",
    },
    doseAdult: {
      fr: "Agitation : 2,5-5 mg IM/IV lente renouvelable (max 10-20 mg/24 h en surveillance ECG). Vomissements : 0,5-1 mg/8-12 h.",
      ar: "هياج: 2.5-5 ملغ عضلي/وريدي بطيء قابل للتكرار (أقصى 10-20 ملغ/24 س بمراقبة تخطيط). تقيؤ: 0.5-1 ملغ/8-12 س.",
    },
    dosePediatric: {
      fr: "Non recommandé en première intention chez l'enfant ; si indispensable (spécialiste) : 0,05 mg/kg/j en fractions.",
      ar: "غير موصى به خياراً أول عند الأطفال؛ إذا حتم (مختص): 0.05 ملغ/كغ/ي مجزأة.",
    },
    dilution: {
      fr: "IV lente sur 5 min minimum, sous monitorage ECG (allongement du QT dose-dépendant). Corriger K⁺ et Mg²⁺ avant/pendant.",
      ar: "وريدي بطيء على 5 د على الأقل، بمراقبة تخطيط (إطالة QT مرتبطة بالجرعة). صحح البوتاسيوم والمغنزيوم قبل/أثناء.",
    },
    contraindications: {
      fr: "QT long congénital, hypokaliémie non corrigée, parkinsonisme, coma, association à d'autres allongeant le QT (amiodarone, sotalol, macrolides...), phéochromocytome.",
      ar: "‏QT طويل خلقي، نقص بوتاسيوم غير مصحح، باركنسونية، غيبوبة، مشاركة أدوية تطيل QT (أميودارون، سوتالول، ماكروليد...)، ورم قواتم.",
    },
    sideEffects: {
      fr: "Allongement du QT / torsades, dystonies aiguës (oculogyres, torticolis — traiter par diazépam/biphéridine), akathisie, SNM (rare mais mortel), hypotension, sédation.",
      ar: "إطالة QT / التواء ذروة، خلل توتر حاد (أزمات عينية، صعر — عالج بديازيبام/بيفيريدن)، تعذر الجلوس، المتلازمة الخبيثة (نادرة مميتة)، هبوط، تهدئة.",
    },
    nursing: {
      fr: "ECG avant et après dose IV répétée. Abaisse le seuil épileptogène : dans le sevrage alcoolique, toujours APRÈS benzodiazépines efficaces. Surveiller rigidité + fièvre (SNM).",
      ar: "تخطيط قبل وبعد كل دفعة وريدية متكررة. يخفض عتبة الاختلاج: بالانسحاب الكحولي دائماً بعد بنزو فعال. راقب التيبس + الحمى (المتلازمة الخبيثة).",
    },
    storage: { fr: "Protéger de la lumière ; ampoule stable 24 h diluée.", ar: "احمِ من الضوء؛ الأمبولة مستقرة 24 س مخففة." },
    alternatives: ["midazolam", "diazepam"],
    weightDose: { mgPerKg: 0, maxMg: 0, note: { fr: "Posologie par paliers — voir doses.", ar: "جرع متدرجة — انظر الجرع." } },
    meta: { sources: ["SCCM PADIS 2018", "ASAM 2020"], lastReviewed: "2026-09" },
  },
  {
    id: "phenobarbital",
    name: { fr: "Phénobarbital", ar: "فينوباربيتال" },
    brands: "Gardénal® 200 mg/2 mL inj ; cp 100 mg",
    synonyms: ["phenobarbital", "gardénal", "barbiturique", "فينوباربيتال"],
    klass: { fr: "Barbiturique longue durée — état de mal épileptique, sevrage alcoolique réfractaire", ar: "باربيتوري طويل المفعول — الحالة الصرعية، الانسحاب الكحولي المقاوم" },
    highRisk: true,
    indications: {
      fr: "État de mal épileptique (3e ligne après benzos ± phénytoïne/valproate), sevrage alcoolique réfractaire aux benzodiazépines / delirium tremens sévère (protocoles de charge), sédation de réanimation en dernier recours.",
      ar: "الحالة الصرعية (الخط الثالث بعد البنزو ± فينيتوئين/فالبروات)، الانسحاب الكحولي المقاوم للبنزوديازيبين / الهذيان الارتعاشي الشديد (بروتوكولات تحميل)، تهدئة إنعاش كحل أخير.",
    },
    doseAdult: {
      fr: "État de mal : 10-20 mg/kg IV lent (max 100 mg/min — arrêt si hypotension/apnée). Sevrage réfractaire : 130-260 mg IV toutes les 15-30 min jusqu'au calme (en réanimation).",
      ar: "الحالة الصرعية: 10-20 ملغ/كغ وريدي بطيء (أقصى 100 ملغ/د — توقف عند هبوط/انقطاع نفس). انسحاب مقاوم: 130-260 ملغ وريدي كل 15-30 د حتى الهدوء (بالإنعاش).",
    },
    dosePediatric: {
      fr: "État de mal : 15-20 mg/kg IV à 1-2 mg/kg/min ; convulsion néonatale : 20 mg/kg.",
      ar: "الحالة الصرعية: 15-20 ملغ/كغ وريدي بـ 1-2 ملغ/كغ/د؛ اختلاج حديثي الولادة: 20 ملغ/كغ.",
    },
    dilution: {
      fr: "Injecter dans NaCl 0,9 % (précipite dans le glucose). Voie veineuse de bon calibre. Vitesse max 100 mg/min adulte — monitorage cardio-respiratoire OBLIGATOIRE, matériel d'intubation prêt.",
      ar: "احقن بمحلول ملحي (يترسب بالغلوكوز). وريد جيد. السرعة القصوى 100 ملغ/د للبالغ — مراقبة قلبية-تنفسية إلزامية، عدة التنبيب جاهزة.",
    },
    contraindications: {
      fr: "Porphyrie, insuffisance respiratoire sévère non intubée, choc, allergie aux barbituriques. Prudence : hépatopathie, association à d'autres dépresseurs (effet cumulatif avec benzos et alcool).",
      ar: "بورفيريا، قصور تنفسي شديد دون تنبيب، صدمة، حساسية باربيتورات. حذر: اعتلال كبدي، مشاركة كوابت أخرى (تأثير تراكمي مع بنزو وكحول).",
    },
    sideEffects: {
      fr: "Dépression respiratoire et hypotension dose-dépendantes, sédation prolongée (demi-vie 80-120 h), inducteur enzymatique puissant (interactions massives).",
      ar: "كبت تنفسي وهبوط مرتبطان بالجرعة، تهدئة مطولة (عمر نصفي 80-120 س)، محفز أنزيمي قوي (تداخلات واسعة).",
    },
    nursing: {
      fr: "Uniquement en milieu équipé (monitorage, intubation possible). Ne pas associer benzos + phénobarbital hors réanimation (apnée). Réveil très lent : ne pas confondre coma pharmacologique et coma lésionnel.",
      ar: "فقط بوسط مجهز (مراقبة، تنبيب ممكن). لا تجمع بنزو + فينوباربيتال خارج الإنعاش (انقطاع نفس). الإفاقة بطيئة جداً: لا تخلط الغيبوبة الدوائية بالإصابة البنيوية.",
    },
    storage: { fr: "T° ambiante ; ampoule à usage unique.", ar: "حرارة الغرفة؛ الأمبولة لاستعمال وحيد." },
    alternatives: ["diazepam", "midazolam"],
    weightDose: { mgPerKg: 15, maxMg: 1500, note: { fr: "15-20 mg/kg en charge lente — milieu équipé seulement.", ar: "‏15-20 ملغ/كغ تحميل بطيء — بوسط مجهز فقط." } },
    meta: { sources: ["AES status epilepticus 2016", "ASAM 2020"], lastReviewed: "2026-09" },
  },
  {
    id: "metronidazole",
    name: { fr: "Métronidazole", ar: "مترونيدازول" },
    brands: "Flagyl® 500 mg/100 mL inj ; cp 500 mg ; gel",
    synonyms: ["metronidazole", "flagyl", "imidazole", "مترونيدازول"],
    klass: { fr: "Antibiotique/antiparasitaire — anaérobies et protozoaires", ar: "مضاد حيوي/طفيليات — اللاهوائيات والأوليات" },
    highRisk: false,
    indications: {
      fr: "Couverture anaérobie (intra-abdominal, pelvien, cérébral, pleural), amibiase, giardiase, trichomonase, colite à C. difficile (formes non sévères), éradication H. pylori (associations), prophylaxie chirurgie digestive/gynéco.",
      ar: "تغطية اللاهوائيات (بطنية، حوضية، دماغية، جنبية)، زحار أميبي، جياردية، مشعرات، التهاب قولون بالمطثية العسيرة (غير الشديد)، استئصال الملوية (مشاركات)، وقاية جراحة هضمية/نسائية.",
    },
    doseAdult: {
      fr: "500 mg IV ou PO/8 h. Amibiase : 750 mg/8 h × 5-10 j. C. difficile non sévère : 500 mg PO/8 h (vancomycine PO préférée si disponible).",
      ar: "‏500 ملغ وريدي أو فموي/8 س. الزحار الأميبي: 750 ملغ/8 س × 5-10 أيام. المطثية العسيرة غير الشديد: 500 ملغ فموياً/8 س (فانكومايسين فموي مفضل إن توفر).",
    },
    dosePediatric: {
      fr: "30 mg/kg/j en 3 prises IV/PO (anaérobies) ; amibiase : 35-50 mg/kg/j × 7-10 j.",
      ar: "‏30 ملغ/كغ/ي على 3 دفعات وريدية/فموية (لاهوائيات)؛ الزحار: 35-50 ملغ/كغ/ي × 7-10 أيام.",
    },
    dilution: {
      fr: "Forme IV prête à l'emploi — perfusion sur 30-60 min (1 g sur 1 h). Biodisponibilité PO ~100 % : relais per os dès que possible.",
      ar: "الشكل الوريدي جاهز — تسريب 30-60 د (1 غ خلال ساعة). التوافر الفموي ~100%: تحويل فموي فور الإمكان.",
    },
    contraindications: {
      fr: "Allergie aux imidazolés, 1er trimestre grossesse (relatif — peser bénéfice/risque), allaitement (suspendre 12-24 h après dose unique). ALCOOL STRICTEMENT INTERDIT pendant et 48 h après (effet antabuse violent).",
      ar: "حساسية إيميدازول، الثلث الأول من الحمل (نسبي — وزن الفائدة/الخطر)، الإرضاع (أوقفه 12-24 س بعد جرعة وحيدة). الكحول ممنوع منعاً باتاً أثناء و48 س بعد (تفاعل أنتابيوس عنيف).",
    },
    sideEffects: {
      fr: "Goût métallique, nausées, neuropathie périphérique (cures longues), convulsions (doses élevées), urines foncées (bénin), effet antabuse avec l'alcool, potentialisation des AVK.",
      ar: "طعم معدني، غثيان، اعتلال أعصاب محيطي (العلاج الطويل)، اختلاجات (الجرع العالية)، بول داكن (حميد)، تفاعل أنتابيوس مع الكحول، تعزيز مضادات فيتامين K.",
    },
    nursing: {
      fr: "Prévenir le patient du danger de l'alcool (y compris sirops alcoolisés) — crucial en contexte de sevrage alcoolique. Surveiller l'INR sous warfarine.",
      ar: "حذّر المريض من خطر الكحول (بما فيها الأشربة الكحولية) — حاسم بسياق الانسحاب الكحولي. راقب INR تحت الوارفارين.",
    },
    storage: { fr: "Protéger de la lumière ; flacon entamé : usage immédiat.", ar: "احمِ من الضوء؛ القارورة المفتوحة: استعمال فوري." },
    alternatives: ["clindamycine", "amoxicilline"],
    weightDose: { mgPerKg: 0, maxMg: 0, note: { fr: "Posologie par tranche — voir doses.", ar: "جرع مجزأة — انظر الجرع." } },
    meta: { sources: ["SPILF", "Résumé des caractéristiques produit"], lastReviewed: "2026-09" },
  },
  {
    id: "ondansetron",
    name: { fr: "Ondansétron", ar: "أوندانسيترون" },
    brands: "Zophren® 4 mg/2 mL inj ; lyoc 4-8 mg",
    synonyms: ["ondansetron", "zophren", "setron", "أوندانسيترون"],
    klass: { fr: "Antiémétique — antagoniste 5-HT3", ar: "مضاد إقياء — مضاد 5-HT3" },
    highRisk: false,
    indications: {
      fr: "Nausées/vomissements aigus (gastro-entérite avec échec de la réhydratation orale, urgence, post-opératoire, chimiothérapie, vertige, migraine). Facilite la réhydratation orale de l'enfant.",
      ar: "غثيان/تقيؤ حاد (التهاب معدة-أمعاء مع فشل الإماهة الفموية، طوارئ، بعد جراحة، كيماوي، دوار، شقيقة). يسهل الإماهة الفموية للطفل.",
    },
    doseAdult: {
      fr: "4-8 mg IV lente (2-5 min) ou PO/8 h ; max 16 mg/j (risque QT).",
      ar: "‏4-8 ملغ وريدي بطيء (2-5 د) أو فموي/8 س؛ أقصى 16 ملغ/ي (خطر QT).",
    },
    dosePediatric: {
      fr: "0,1-0,15 mg/kg/dose (max 4 mg < 12 ans, 8 mg après) IV lente ou lyophilisat PO — gastro-entérite : dose unique avant SRO.",
      ar: "‏0.1-0.15 ملغ/كغ/جرعة (أقصى 4 ملغ < 12 سنة، 8 ملغ بعدها) وريدي بطيء أو قرص ذواب فموي — التهاب المعدة-الأمعاء: جرعة وحيدة قبل محلول الإماهة.",
    },
    dilution: {
      fr: "IV lente sur 2-5 min (jamais en bolus — QT). Lyophilisat : dissolution sublinguale sans eau.",
      ar: "وريدي بطيء 2-5 د (أبداً دفعة — ‏QT). القرص الذواب: انحلال تحت اللسان دون ماء.",
    },
    contraindications: {
      fr: "QT long connu, hypokaliémie/hypomagnésémie non corrigées, association à l'apomorphine, syndrome du QT long congénital. Prudence : cardiopathie, autres allongeant le QT.",
      ar: "‏QT طويل معروف، نقص بوتاسيوم/مغنزيوم غير مصحح، مشاركة أبومورفين، متلازمة QT طويل خلقية. حذر: مرض قلبي، أدوية أخرى تطيل QT.",
    },
    sideEffects: {
      fr: "Céphalées, constipation, flush, allongement du QT dose-dépendant (torsades rares), sédation légère.",
      ar: "صداع، إمساك، تورد، إطالة QT مرتبطة بالجرعة (التواء نادر)، تهدئة خفيفة.",
    },
    nursing: {
      fr: "Chez le cardiaque ou l'hypokaliémique : ECG et ionogramme avant. Une dose suffit souvent dans la gastro-entérite de l'enfant — pas de prescription systématique prolongée.",
      ar: "عند مريض القلب أو ناقص البوتاسيوم: تخطيط وشوارد قبله. جرعة واحدة تكفي غالباً بالتهاب المعدة-الأمعاء عند الطفل — لا وصفة مطولة منهجية.",
    },
    storage: { fr: "T° ambiante.", ar: "حرارة الغرفة." },
    alternatives: ["metoclopramide"],
    weightDose: { mgPerKg: 0.15, maxMg: 8, note: { fr: "0,15 mg/kg/dose, max 8 mg.", ar: "‏0.15 ملغ/كغ/جرعة، أقصى 8 ملغ." } },
    meta: { sources: ["AAP gastro-entérite 2014", "Résumé des caractéristiques produit"], lastReviewed: "2026-09" },
  },
];

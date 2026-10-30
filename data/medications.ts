import type { Medication } from "./types";
import { medicationsPhase2 } from "./medications-p2";
import { medicationsPhase3 } from "./medications-p3";
import { medicationsPhase4 } from "./medications-p4";
import { medicationsPhase5 } from "./medications-p5";
import { medicationsPhase6 } from "./medications-p6";
import { medicationsPhase7 } from "./medications-p7";
import { medicationsPhase8 } from "./medications-p8";
import { medicationsPhase9 } from "./medications-p9";
import { medicationsPhase10 } from "./medications-p10";
import { medicationsPhase11 } from "./medications-p11";

// ⚕️ Contenu rédigé d'après ERC 2021 / AHA ACLS 2025 / RCUK anaphylaxie 2021 / SFAR.
// ⚠️ À faire valider par un médecin tunisien et à adapter aux spécialités locales avant usage.
const medicationsCore: Medication[] = [
  {
    id: "adrenaline",
    name: { fr: "Adrénaline (Épinéphrine)", ar: "أدرنالين (إبينفرين)" },
    brands: "Adrénaline Aguettant® 1 mg/mL (amp. 5 mL, sans sulfites) ; MEDIS® sans conservateur 1 mg/1 mL et 5 mg/5 mL ; Renaudin® 1 mg/mL (amp. 1 mL) ; ADRENALINE SOPHARMA® 1 mg/mL (B/10 amp. 1 mL ; AMM 10793012H) ; ADRENOL 1® (DORCAS) 1 mg/mL sans sulfites (B/100 ; AMM 9313141H) et avec sulfite (B/100 ; AMM 9313142H)",
    synonyms: ["adrenaline", "epinephrine", "épinéphrine", "adrénaline", "adrenalina", "أدرنالين"],
    searchExclusions: ["anapen", "articaine", "articaine adrenaline", "primacaine", "primacaine adrenaline", "septanest", "ubistesin"],
    klass: { fr: "Catécholamine — α et β-adrénomimétique", ar: "كاتيكولامين — منبّه ألفا وبيتا أدرينالي" },
    highRisk: true,
    indications: {
      fr: "Arrêt cardiaque (tous rythmes) ; anaphylaxie (1ère ligne, IM) ; choc anaphylactique réfractaire (PSE, milieu médicalisé).",
      ar: "توقف القلب (جميع الإيقاعات)؛ الصدمة الأرجية (الخط الأول، عضلياً)؛ صدمة أرجية مقاومة (مضخة وريدية في وسط طبّي).",
    },
    doseAdult: {
      fr: "ACR : 1 mg IV/IO toutes les 3–5 min. Anaphylaxie : 500 µg IM (0,5 mL à 1 mg/mL) face antéro-latérale de cuisse, répétable après 5 min.",
      ar: "توقف القلب: 1 ملغ وريد/نخاع كل 3-5 دقائق. الأنفيلاكسي: 500 مكغ عضلياً (0.5 مل من 1ملغ/مل) في الوجه الأمامي الوحشي للفخذ، تُعاد بعد 5 دقائق.",
    },
    dosePediatric: {
      fr: "ACR : 0,01 mg/kg IV/IO (0,1 mL/kg à 1/10 000), toutes les 3–5 min. Anaphylaxie IM (1 mg/mL) : >12 ans 500 µg ; 6–12 ans 300 µg ; 6 mois–6 ans 150 µg ; <6 mois 100–150 µg.",
      ar: "توقف القلب: 0.01 ملغ/كغ وريد/نخاع (0.1 مل/كغ من 1/10000) كل 3-5 دقائق. الأنفيلاكسي عضلياً: أكثر من 12 سنة 500 مكغ؛ 6-12 سنة 300 مكغ؛ 6 أشهر إلى 6 سنوات 150 مكغ؛ أقل من 6 أشهر 100-150 مكغ.",
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
      ar: "بعيداً عن الضوء، أقل من 25°م. غير متوافق مع القلويات (بيكربونات) — اغسل الخط.",
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
    brands: "Cordarone® (SANOFI-AVENTIS FRANCE) 150 mg/3 mL inj. (AMM DPM 6260032) ; 200 mg cp B/20 (SANOFI TUNISIE, AMM DPM ST9263071) ; SEDACORON® (EBEWE) 150 mg/3 mL inj. (B/5 ; AMM DPM 6943012) ; 200 mg cp ; AMIOCARD® 200 mg cp (ADWYA) ; RICARDYL® 200 mg cp (IBN AL BAYTAR ; B/20 ; AMM DPM 9073471)",
    synonyms: ["amiodarone", "cordarone", "ricardyl", "أميودارون", "كوردارون"],
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
      ar: "توقف القلب: 5 ملغ/كغ وريد/نخاع (أقصى 300 ملغ) تُعاد مرتين حتى 15 ملغ/كغ/يوم. اضطراب النظم: 5 ملغ/كغ على 20-60 دقيقة (برأي مختص).",
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
    brands: "Présentations DPM (liste annoncée mise à jour le 07/10/2026 ; AMM ≠ disponibilité) : ATROPINE SAIPH® 0,25 mg/mL, solution injectable, B/10/1 mL (SAIPH ; AMM 9163801H) — la photo officielle de l’emballage SAIPH indique SC, IV lente ou IM; la page fabricant correspond à l’AMM et à la présentation DPM. ATROPINE SULFATE AGUETTANT® 0,250 mg/1 mL, solution injectable, B/10/1 mL (LABORATOIRE AGUETTANT ; AMM 7093062H) — le RCP ANSM du produit fabricant de même nom, concentration et volume indique IV, IM ou SC ; ATROPINUM SULFURICUM® 1 mg/mL, solution injectable, B/10/1 mL (SOPHARMA SA ; AMM 10793011H) — la notice fabricant Atropin Sopharma 1 mg/mL publiée par le régulateur serbe ALIMS indique SC, IM ou IV. Ces références établissent les voies des produits correspondants, pas les doses de cette fiche ni le stock tunisien. Pour ATROPINE SAIPH, la photo d’emballage ne valide pas les posologies génériques ci-dessous; vérifier la notice de l’ampoule réellement utilisée.",
    searchExclusions: ["atropine unimed", "unimed atropine", "collyre", "ophthalmic"],
    brandCaution: { fr: "ATROPINE SAIPH® (AMM 9163801H) : la photo officielle de l’emballage indique SC, IV lente ou IM et concorde avec la présentation DPM. Elle ne donne pas de posologie : les doses génériques de cette fiche ne sont pas validées spécifiquement pour cette marque. Vérifier la notice de l’ampoule avant administration.", ar: "ATROPINE SAIPH® (AMM 9163801H): صورة العبوة الرسمية تذكر تحت الجلد أو وريدياً ببطء أو عضلياً، وتطابق العرض المسجل لدى DPM. لكنها لا تعرض جرعات؛ الجرعات العامة في هذه البطاقة غير مثبتة خصيصاً لهذه العلامة. تحقّق من نشرة الأمبولة قبل الإعطاء." },
    synonyms: ["atropine", "أتروبين", "اتروبين"],
    klass: { fr: "Anticholinergique (antimuscarinique)", ar: "مضاد كوليني (مضاد موسكاريني)" },
    highRisk: false,
    indications: {
      fr: "Bradycardie symptomatique ; bloc AV sinus/atrial ; intoxication organophosphorée (en association).",
      ar: "بطء قلب عرضي؛ حصار جيبي/أذيني؛ تسمم بالمركبات الفوسفورية العضوية (بالاشتراك).",
    },
    doseAdult: {
      fr: "Bradycardie : 1 mg IV toutes les 3–5 min, max 3 mg. Organophosphorés : 1–2 mg IV puis titrage jusqu'à atropinisation.",
      ar: "بطء القلب: 1 ملغ وريد كل 3-5 دقائق، أقصى 3 ملغ. الفوسفوريات العضوية: 1-2 ملغ ثم معايرة حتى الأتروبنة.",
    },
    dosePediatric: {
      fr: "0,02 mg/kg IV/IO (min 0,1 mg ; max dose unique 0,5 mg enfant, 1 mg adolescent), répétable ×1.",
      ar: "0.02 ملغ/كغ وريد/نخاع (أدنى 0.1 ملغ؛ أقصى للجرعة الواحدة 0.5 ملغ طفل، 1 ملغ مراهق)، تُعاد مرة.",
    },
    dilution: { fr: "Pure, IV directe lente ; dilution possible dans 10 mL NaCl 0,9 %.", ar: "نقية، وريد مباشر بطيء؛ يمكن التمديد في 10 مل مصل ملحي." },
    contraindications: {
      fr: "Précautions : glaucome à angle fermé, rétention urinaire aiguë — contre-indications relatives en urgence vitale.",
      ar: "محاذير: زرق مغلق الزاوية واحتباس بولي حاد — موانع نسبية في سياق خطر حيوي."
    },
    sideEffects: { fr: "Sécheresse, mydriase, tachycardie, confusion (sujet âgé), hyperthermie.", ar: "جفاف فم، اتساع حدقة، تسرع قلب، تشوش (المسن)، فرط حرارة." },
    nursing: {
      fr: "Inefficace dans le bloc infranodalien documenté (transplanté cardiaque, BAV haut) — accélérateur/adrénaline. Vérifier les constantes avant/après.",
      ar: "غير فعالة في الحصار تحت العقدي الموثق — فكّر في المعجّل الخارجي/الأدرنالين. تحقق من العلامات قبل وبعد.",
    },
    storage: { fr: "Température ambiante, lumière.", ar: "حرارة الغرفة، بعيداً عن الضوء." },
    alternatives: [],
    weightDose: { mgPerKg: 0.02, maxMg: 0.5, note: { fr: "Min 0,1 mg (éviter bradycardie paradoxale). Max 0,5 mg enfant / 1 mg adolescent.", ar: "أدنى 0.1 ملغ (تجنّب بطء قلب متناقض). أقصى 0.5 ملغ طفل / 1 ملغ مراهق." } },
    meta: { sources: ["AHA ACLS 2025", "AHA PALS 2020", "DPM ATROPINE SAIPH AMM 9163801H — https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=10396", "Répertoire DPM des médicaments génériques, janvier 2024 — groupe atropine sulfate 0,025 mg/1 mL, solution injectable, entrée ATROPINE SAIPH (forme et identité, pas voie IV/IM) — https://dpm.tn/images/pdf/liste_groupes_generiques-09-07-2024.pdf", "Transcription d’étiquetage ATROPINE SAIPH fournie par l’utilisateur le 29/10/2026 : SC, IV lente ou IM, 10 ampoules de 1 mL (non vérifiée indépendamment)", "SAIPH ATROPINE SAIPH — fiche fabricant : AMM 9163801H, 0,25 mg/mL, 10 ampoules de 1 mL — https://saiph-labo.com/medicaments/gastro-enterologie/atropine-saiph/", "SAIPH — photo officielle de la boîte ATROPINE SAIPH : SC, IV lente ou IM — https://saiph-labo.com/wp-content/uploads/2023/07/Atropine_25.png"], lastReviewed: "2026-10" },
  },
  {
    id: "noradrenaline",
    name: { fr: "Noradrénaline", ar: "نورأدرنالين" },
    brands: "Noradrénaline (tartrate) Aguettant® 8 mg/4 mL (à diluer) ; DPM : NORADRENALINE MEDIS 2 mg/mL (B/10, AMM 9233851H), MYLAN 2 mg/mL (B/50, AMM 4923181H), RENAUDIN 2 mg/mL (B/10, AMM 7713081H), STERIPHARM 2 mg/mL (B/10, AMM 9443091H) ; NORALINE (UNIMED) 2 mg/mL (B/10, AMM 9093691H), NORENOL 8 (DORCAS) 8 mg/4 mL (B/10 ampoules, AMM 9313151H)",
    synonyms: ["noradrenaline", "norepinephrine", "norépinéphrine", "levantérénol", "noradrenaline medis", "noradrenaline mylan", "noradrenaline renaudin", "noradrenaline steripharm", "noraline", "norenol", "نورأدرنالين"],
    klass: { fr: "Catécholamine — vasopresseur α prédominant", ar: "كاتيكولامين — قابض وعائي ألفا غالب" },
    highRisk: true,
    indications: {
      fr: "Choc septique, choc anaphylactique réfractaire (après adrénaline IM), choc cardiogénique avec vasoplégie (avis spécialisé).",
      ar: "الصدمة الإنتانية، صدمة أرجية مقاومة (بعد أدرنالين عضلي)، صدمة قلبية مع وهن وعائي (رأي مختص).",
    },
    doseAdult: {
      fr: "Repère de dose du Livret RE.NAU 2018 : PSE à 0,05–0,1 µg/kg/min puis titration selon la PAM ; plage indiquée 0,05–1 µg/kg/min. SSC 2026 ne fixe pas la dose ni la durée de voie périphérique : vérifier les doses/concentrations dans le protocole local.",
      ar: "مرجع الجرعة في دليل RE.NAU 2018: مضخة 0.05–0.1 مكغ/كغ/د ثم معايرة حسب PAM؛ المجال المذكور 0.05–1 مكغ/كغ/د. لا تحدد SSC 2026 الجرعة أو مدة الطريق الطرفي؛ تحقق من الجرعات والتركيزات في البروتوكول المحلي.",
    },
    dosePediatric: {
      fr: "0,05–0,3 µg/kg/min PSE (milieu de réanimation), titration attentive.",
      ar: "0.05-0.3 مكغ/كغ/د مضخة (وسط الإنعاش)، معايرة دقيقة.",
    },
    dilution: {
      fr: "Repère unique de calcul dans l'application, selon le Livret RE.NAU 2018 : 8 mg de noradrénaline exprimés en base, complétés à 50 mL de G5 % = 160 µg/mL. Le nombre d'ampoules dépend de l'équivalence base/tartrate indiquée dans le RCP du produit local ; ne jamais déduire cette équivalence du seul nom ou dosage commercial. Vérifier le diluant compatible et le protocole local. En choc septique, SSC 2026 suggère de commencer par voie périphérique plutôt que retarder en attendant un abord central ; surveillance étroite du site et sécurité selon protocole local.",
      ar: "مرجع حساب موحد في التطبيق وفق دليل RE.NAU لعام 2018: 8 ملغ نورأدرينالين محسوبة كقاعدة فعالة، تُستكمل إلى 50 مل من غلوكوز 5% = 160 مكغ/مل. يعتمد عدد الأمبولات على مكافئ القاعدة/الطرطرات المذكور في نشرة المستحضر المحلي؛ لا تستنتج هذا المكافئ من الاسم أو التركيز التجاري وحدهما. تحقق من المذيب والبروتوكول المحلي. في الصدمة الإنتانية تقترح SSC 2026 البدء عبر وريد طرفي بدلاً من التأخير انتظاراً لخط مركزي؛ مع مراقبة لصيقة للموضع واتباع السلامة المحلية.",
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
    storage: { fr: "2-8 °C, lumière. Solution rosée/brunie → jeter.", ar: "2-8°م بعيداً عن الضوء. محلول وردي/بني → تلف." },
    alternatives: ["adrenaline"],
    interactions: [
      { drug: "IMAO / antidépresseurs tricycliques", severity: "high", description: { fr: "HTA majeure par potentialisation — réduire la dose initiale fortement.", ar: "ارتفاع ضغط شديد بالتفعيل — خفّض الجرعة الابتدائية كثيراً." } },
    ],
    meta: { sources: ["Livret RE.NAU 2018 (dose/preparation)", "RCP NORADRENALINE (TARTRATE) AGUETTANT — ANSM 2018 : 8 mg tartrate/4 mL = 4 mg base, présentation française uniquement", "Surviving Sepsis Campaign 2026 (MAP, first-line agent, peripheral start)", "ERC 2021"], lastReviewed: "2026-10" },
  },
  {
    id: "midazolam",
    name: { fr: "Midazolam", ar: "ميدازولام" },
    brands: "Hypnovel® 5 mg/5 mL ; Midazolam Mylan® 5 mg/5 mL ; HIKMA Midazolam® 5 mg/mL (amp. 1 mL) ; IPNODIS MEDIS® (MEDIS) 1 mg/mL (2 mg/2 mL, B/10) et 5 mg/mL (5 mg/1 mL, B/10 ; 25 mg/5 mL, B/5) ; IPNODIS® 50 mg/10 mL (B/6) ; ZOLAM 5® (DORCAS) 5 mg/mL (B/50 amp. 1 mL, AMM DPM 9313211H) et ZOLAM 25® 25 mg/5 mL (B/50 amp. 5 mL, 9313212H)",
    searchExclusions: ["midazolam aguettant", "midazolam steripharm"],
    synonyms: ["midazolam", "hypnovel", "ipnodis", "ميدازولام", "هيبنوفيل"],
    klass: { fr: "Benzodiazépine — anticonvulsivant/sédatif", ar: "بنزوديازيبين — مضاد اختلاج/مهدئ" },
    highRisk: true,
    indications: {
      fr: "État de mal convulsif (1ère ligne si pas de voie veineuse : IM/buccal/nasal) ; sédation procédurale ; agitation sévère (déférer si possible).",
      ar: "حالة صرعية مستمرة (الخط الأول دون خط وريدي: عضلي/شدقي/أنفي)؛ تهدئة إجرائية؛ هياج شديد.",
    },
    doseAdult: {
      fr: "Convulsions : 10 mg IM (ou 0,1 mg/kg IV lent, max 10 mg), répétable ×1 après 5–10 min. Sédation : 1–2 mg IV titré.",
      ar: "الاختلاج: 10 ملغ عضلياً (أو 0.1 ملغ/كغ وريد ببطء، أقصى 10 ملغ)، تُعاد مرة بعد 5-10 د. التهدئة: 1-2 ملغ وريد بالمعايرة.",
    },
    dosePediatric: {
      fr: "Convulsions : IM 0,2 mg/kg (max 10 mg) ; buccal/intranasal 0,3 mg/kg (max 10 mg) ; IV 0,1 mg/kg. <6 mois : prudence (dépression respiratoire).",
      ar: "الاختلاج: عضلياً 0.2 ملغ/كغ (أقصى 10)؛ شدقياً/أنفياً 0.3 ملغ/كغ (أقصى 10)؛ وريد 0.1 ملغ/كغ. أقل من 6 أشهر: حذر (تثبيط تنفسي).",
    },
    dilution: { fr: "Pur IM/buccal/nasal ; IV lent diluable NaCl 0,9 % ou G5 %.", ar: "نقي عضلياً/شدقياً/أنفياً؛ وريد بطيء قابل للتمديد." },
    contraindications: {
      fr: "Dépression respiratoire non contrôlée, choc, myasthénie ; prudence majeure sujet âgé/IRC.",
      ar: "تثبيط تنفسي غير مضبوط، صدمة، وهن عضلي؛ حذر شديد عند المسن وقصور الكلى.",
    },
    sideEffects: { fr: "Dépression respiratoire dose-dépendante, hypotension, paradoxale agitation. Antidote : flumazénil (prudence : convulsions).", ar: "تثبيط تنفسي مرتبط بالجرعة، انخفاض ضغط، هياج متناقض. الترياق: فلومازينيل (حذر: اختلاج)." },
    nursing: {
      fr: "Préparer ventilation (BCU) avant injection. Monitorer SpO2/FR ≥15 min après. IM efficace en 5–10 min.",
      ar: "جهّز التهوية (بالون-قناع) قبل الحقن. راقب التشبع والتنفس 15 أو أكثر د بعدها. العضلي يفعّل خلال 5-10 د.",
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
      ar: "جرعة أفيونية زائدة مع تثبيط تنفسي (تواتر أقل من 12، حدقة دبوسية، غيبوبة). تشخيصي وعلاجي.",
    },
    doseAdult: {
      fr: "Surdosage avec dépression respiratoire : 0,2–2 mg IV/IO/IM, répéter toutes les 2–3 min et titrer jusqu'au rétablissement d'une ventilation suffisante (objectif : respirer, pas réveiller complètement). En cas de dépendance aux opioïdes avec respiration conservée, titration IV prudente selon protocole pour limiter le sevrage ; ne pas retarder la ventilation au masque. Voie intranasale : uniquement avec un dispositif intranasal adapté, à la dose de sa notice (les dispositifs référencés par la FDA délivrent 2 ou 4 mg) ; ne pas convertir la solution injectable en dose IN. Réévaluer le diagnostic si absence de réponse après doses répétées ; perfusion si rebond/prolongation.",
      ar: "جرعة زائدة مع تثبيط التنفس: 0.2–2 ملغ وريدياً أو داخل العظم أو عضلياً، تُكرر كل 2–3 دقائق وتُعاير حتى كفاية التهوية (الهدف استعادة التنفس، لا الإفاقة الكاملة). عند الاعتماد على الأفيونات مع بقاء التنفس، عاير بحذر وريدياً وفق البروتوكول لتقليل أعراض السحب؛ لا تؤخر التهوية بالقناع. الأنف: فقط بجهاز أنفي مخصص وبجرعة نشرته (الأجهزة المذكورة في FDA تعطي 2 أو 4 ملغ)؛ لا تحوّل محلول الحقن إلى جرعة أنفية. أعد تقييم التشخيص إذا لم تحدث استجابة بعد جرعات متكررة؛ يُنظر في التسريب عند عودة التثبيط أو استمراره.",
    },
    dosePediatric: { fr: "Intoxication aiguë par opioïdes : 0,1 mg/kg IV/IO/IM, maximum 2 mg par dose (sans dépasser la dose adulte), répétable toutes les 2–3 min en poursuivant la ventilation. IN : uniquement si un dispositif adapté est disponible, selon sa notice ; ne pas utiliser cette posologie pour un simple surdosage iatrogène chez un patient dépendant sans protocole spécialisé.", ar: "تسمم أفيوني حاد: 0.1 ملغ/كغ وريدياً أو داخل العظم أو عضلياً، بحد أقصى 2 ملغ للجرعة (ولا تتجاوز جرعة البالغ)، وتُكرر كل 2–3 دقائق مع استمرار التهوية. الأنف: فقط عند توفر جهاز مخصص ووفق نشرته؛ لا تستخدم هذه الجرعة لزيادة علاجية بسيطة لدى مريض معتمد دون بروتوكول متخصص." },
    dilution: { fr: "Solution injectable listée : 0,4 mg/mL. PSE éventuelle selon protocole et dose de réveil. Aucun dispositif intranasal tunisien n'est documenté ici ; ne pas utiliser l'ampoule injectable par voie IN sans autorisation/protocole spécifique.", ar: "محلول الحقن المدرج: 0.4 ملغ/مل. التسريب المستمر وفق البروتوكول وجرعة الاستجابة. لم يُوثق هنا جهاز أنفي تونسي؛ لا تستخدم أمبولة الحقن أنفياً دون ترخيص أو بروتوكول خاص." },
    contraindications: { fr: "Aucune absolue en urgence vitale.", ar: "لا موانع مطلقة في الخطر الحيوي." },
    sideEffects: {
      fr: "Syndrome de sevrage aigu (agitation, vomissements, douleurs), OAP rare en réveil brutal chez toxicomane chronique.",
      ar: "متلازمة سحب حادة (هياج، تقيؤ، ألم)، وذمة رئة نادرة عند الإفاقة الفجائية للمدمن المزمن.",
    },
    nursing: {
      fr: "Demi-vie 20–30 min < celle de la plupart des opioïdes → rechute de sédation : surveiller ≥2 h, répéter ou PSE. Sécuriser aggression potentielle au réveil.",
      ar: "عمر النصف 20-30 د أقصر من معظم الأفيونات → ارتداد التثبيط: راقب 2 أو أكثر ساعة، أعد أو مضخة. احذر عدوانية محتملة عند الإفاقة.",
    },
    storage: { fr: "Température ambiante, lumière.", ar: "حرارة الغرفة بعيداً عن الضوء." },
    alternatives: [],
    weightDose: { mgPerKg: 0.1, maxMg: 2, note: { fr: "Enfant, surdosage aigu par opioïdes : 0,1 mg/kg IV/IO/IM, maximum 2 mg par dose ; titrer à la ventilation, avec BVM disponible.", ar: "طفل بتسمم أفيوني حاد: 0.1 ملغ/كغ وريدياً/داخل العظم/عضلياً، بحد أقصى 2 ملغ للجرعة؛ عاير وفق التنفس مع توفر التهوية بالقناع." } },
    meta: { sources: ["AHA 2023 Focused Update — poisoning, table 2 (adult 0.2–2 mg; child 0.1 mg/kg; titration; pediatric maximum not above adult dose)", "AHA 2025 CPR/ECC Guidelines — ventilation/CPR is not delayed for naloxone", "FDA NARCAN nasal spray labeling (2023/2026) — device-specific single spray; not equivalent to injectable ampoule"], lastReviewed: "2026-10" },
  },
  {
    id: "glucose30",
    name: { fr: "Glucose 30 % (G30)", ar: "غلوكوز 30% (G30)" },
    brands: "GLUCOSE A 30% (SIPHAT) — flacon 500 mL pour perfusion ; GLUCOSE A 30% INFOMED — poche 500 mL pour perfusion ; GLUCOSE 30% PROAMP® (Aguettant) — B/50 amp. 10 mL. Présentations distinctes ; ne pas confondre les poches de 500 mL avec les ampoules.",
    searchExclusions: ["glucose 5", "glucose 10", "5%", "5 %", "10%", "10 %", "glucosaline", "glukanion", "nakion", "solute isotonique glucose", "solution dpca", "dialyse peritoneale"],
    synonyms: ["glucose", "g30", "dextrose", "sucre", "غلوكوز", "سكر"],
    klass: { fr: "Glucide hypertonique — antidote hypoglycémie", ar: "سكر مفرط التوتر — ترياق نقص السكر" },
    highRisk: false,
    indications: {
      fr: "Hypoglycémie symptomatique avec trouble de conscience (glycémie capillaire <0,8 g/L ou si indosable dans les délais).",
      ar: "نقص سكر عرضي مع اضطراب وعي (سكر شعري أقل من 0.8 غ/ل أو إن تعذّر قياسه بسرعة).",
    },
    doseAdult: {
      fr: "Conscience altérée : chez l'adulte, glucose hypertonique IV 10–15 g selon le protocole de l'établissement (HAS, synthèse des recommandations sélectionnées, 2025, reprenant ADA 2024). En G30 % : ≈33–50 mL. PROAMP 10 mL contient 3 g ; 4–5 ampoules apportent 12–15 g. Recontrôler à 10–15 min ; répéter uniquement après réévaluation et selon le protocole applicable. La posologie des présentations locales doit être vérifiée sur leur propre RCP.",
      ar: "عند اضطراب الوعي: للبالغ، غلوكوز مفرط التوتر وريدياً بجرعة 10–15 غ وفق بروتوكول المؤسسة (ملخص توصيات HAS لسنة 2025، ناقل عن ADA 2024). بتركيز G30٪: نحو 33–50 مل. أمبولة PROAMP بحجم 10 مل تحتوي 3 غ؛ وتعطي 4–5 أمبولات 12–15 غ. أعد قياس السكر بعد 10–15 دقيقة؛ ولا تكرر العلاج إلا بعد إعادة التقييم ووفق البروتوكول المناسب. يجب التحقق من جرعة المستحضرات المحلية في نشراتها الخاصة.",
    },
    dosePediatric: {
      fr: "G10 % : 5 mL/kg IV (préférable au G30 % hyperosmolaire). Nourrisson : G10 % 5 mL/kg relire 10–15 min.",
      ar: "غلوكوز 10%: 5 مل/كغ وريد (يفضَّل على 30% مفرط التوتر). أعد القياس بعد 10-15 د.",
    },
    dilution: { fr: "Solution hypertonique : suivre le RCP de la présentation exacte. Pour GLUCOSE 30 % PROAMP uniquement : perfusion centrale ; en urgence d'hypoglycémie sévère sans voie centrale, voie périphérique possible selon le RCP avec rinçage immédiat au NaCl 0,9 %. Ne pas transposer ce RCP aux présentations SIPHAT/INFOMED sans vérification de leur notice.", ar: "محلول مفرط التوتر: اتبع نشرة المستحضر المحدد. بالنسبة إلى GLUCOSE 30٪ PROAMP فقط: تسريب مركزي؛ وفي طوارئ نقص السكر الشديد، يمكن استخدام خط طرفي عند غياب الخط المركزي وفق النشرة، مع غسل الخط فوراً بمحلول NaCl 0.9٪. لا تعمم هذه النشرة على مستحضرات SIPHAT/INFOMED دون التحقق من نشراتها." },
    contraindications: { fr: "Œdème/désordre intracrânien aigu — relative.", ar: "وذمة/خلل دماغي حاد — نسبية." },
    sideEffects: { fr: "Phlébite, hyperglycémie rebond, hyponatrémie de dilution (sur-correction).", ar: "التهاب وريد، فرط سكر ارتدادي، نقص صوديوم تمددي." },
    nursing: {
      fr: "Contrôler la glycémie avant puis 10–15 min après. Patient conscient et capable d'avaler : glucose oral. PROAMP 30 % : voie périphérique uniquement pour l'urgence d'hypoglycémie sévère sans accès central, rinçage immédiat au NaCl 0,9 % et surveillance du point de perfusion selon le RCP ; vérifier séparément les notices SIPHAT/INFOMED.",
      ar: "قِس السكر قبل العلاج ثم بعد 10–15 دقيقة. إذا كان المريض واعياً وقادراً على البلع: غلوكوز فموي. PROAMP 30٪: لا يُستخدم الخط الطرفي إلا في طوارئ نقص السكر الشديد عند غياب الخط المركزي، مع غسل فوري بـNaCl 0.9٪ ومراقبة موضع التسريب وفق النشرة؛ وتحقق من نشرات SIPHAT/INFOMED كلٌّ على حدة.",
    },
    storage: { fr: "Température ambiante.", ar: "حرارة الغرفة." },
    alternatives: [],
    meta: { sources: ["HAS — Synthèse des recommandations sélectionnées, 2025-07 (hypoglycémie adulte, reprise ADA 2024)", "RCP GLUCOSE 30 % PROAMP — Base de Données Publique des Médicaments/ANSM (composition et voie propres à PROAMP, source française hors Tunisie)"], lastReviewed: "2026-10" },
  },
  {
    id: "furosemide",
    name: { fr: "Furosémide", ar: "فوروسيميد" },
    brands: "Lasilix® 40 mg cp (SANOFI / WINTHROP) ; Lasilix Retard® 60 mg gél. LP ; Lasilix Special® 250 mg/25 mL inj. et 500 mg cp ; Lasicare® 40 mg cp (B/20, B/600) et 500 mg cp (B/50) ; Furosémide (SIPHAT) 40 mg cp (B/20, B/600) ; Furans 20® 20 mg/2 mL inj. (B/2, B/50) ; Furilan® 40 mg cp et 20 mg/2 mL inj. (B/5) ; Furolix® 20 mg/2 mL inj. (B/2, B/50) ; Furolix Special® 250 mg/25 mL inj. (B/5) ; Furoxem® 20 mg/2 mL inj. ; Furosemide Steripharm® 20 mg/2 mL inj. ; Furosemide Renaudin® 20 mg/2 mL inj. ; ANSEMID® (WEST PHARMA) 40 mg cp B/30, B/40, B/500 et 500 mg cp B/36 (AMM DPM 9293101/9293103/9293102H/9293191)",
    synonyms: ["furosemide", "lasilix", "diurétique", "فوروسيميد", "لازيليكس"],
    klass: { fr: "Diurétique de l'anse", ar: "مدرّ عروي" },
    highRisk: false,
    indications: {
      fr: "Œdème aigu du poumon avec surcharge / IC décompensée congestive ; hypercalcémie (complément).",
      ar: "وذمة رئة حادة مع فرط حجم/قصور قلب احتقاني؛ فرط كالسيوم (تكميلي).",
    },
    doseAdult: {
      fr: "OAP : 40–80 mg IV directe lente ; si traitement de fond : ≈ 1–2,5× la dose orale habituelle en IV. Réévaluer à 30–60 min.",
      ar: "وذمة الرئة: 40-80 ملغ وريد بطيء؛ إذا يتعالج مزمناً: ~1-2.5 ضعف جرعته الفموية وريدياً. أعد التقييم بعد 30-60 د.",
    },
    dosePediatric: { fr: "1 mg/kg IV (max 20-40 mg), milieu pédiatrique.", ar: "1 ملغ/كغ وريد (أقصى 20-40 ملغ)." },
    dilution: { fr: "Pur IV lent (ou dilué NaCl 0,9 % pour PSE).", ar: "نقي وريد بطيء (أو ممدد للمضخة)." },
    contraindications: {
      fr: "Hypovolémie/choc, hypokaliémie sévère non corrigée, anurie.",
      ar: "نقص حجم/صدمة، نقص بوتاسيوم شديد غير مصحّح، انقطاع بول.",
    },
    sideEffects: { fr: "Hypotension, hypokaliémie, hyponatrémie, déshydratation ; ototoxicité si injection < 4 mg/min dépassée (bolus rapide).", ar: "انخفاض ضغط، نقص بوتاسيوم/صوديوم، تجفاف؛ سمية أذنية إن حُقن أسرع من 4 ملغ/د." },
    nursing: {
      fr: "TA avant/après. Ionogramme dès que possible (K+, Na+). Injection lente ≥2 min. Sonde urinaire si OAP sévère.",
      ar: "اضغط قبل/بعد. أيونوغرام بأسرع وقت. حقن بطيء 2 أو أكثر د. قسطرة بولية في الوذمة الشديدة.",
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
  ...medicationsPhase7,
  ...medicationsPhase8,
  ...medicationsPhase9,
  ...medicationsPhase10, ...medicationsPhase11,
];

export function getMedication(id: string): Medication | undefined {
  return medications.find((m) => m.id === id);
}

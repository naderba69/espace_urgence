// Perfusions usuelles en milieu d'urgence/SMUR/SAU — alignées sur le Livret RE.NAU (2018),
// ERC/SFAR/SSC et pratiques SMUR. Champs pro : bolus, warnings (rouge), tips (vigilance).
import type { Localized } from "@/data/types";

export interface PerfusionPreset {
  drugId: string;
  label: Localized;
  prep: Localized;                // préparation standard (seringue/poche)
  concUgPerMl: number;            // concentration en µg/mL (UI/mL pour héparine/insuline/ocytocine)
  unit: string;                   // "µg/kg/min" | "µg/min" | "µg/kg/h" | "µg/h" | "mg/kg/h" | "mg/h" | "mg/min" | "UI/kg/h" | "UI/h" | "g/h"
  doseMin: number;
  doseMax: number;
  doseStep: number;
  doseStart?: number;
  weightBased: boolean;
  /** Plafond de débit initial en UI/h, utile pour les presets HNF (ex. SCA). */
  maxUnitsPerHour?: number;
  note?: Localized;               // conseil clinique court
  bolus?: Localized;              // bolus/dose de charge avant la seringue
  warnings?: Localized;           // alerte sécurité (affichée en rouge, mise en avant)
  tips?: Localized;               // pratiques pro (voie dédiée, relais, incompatibilités, surveillance)
  source?: string;                // référence
  /** Préparation initiale structurée pour l'outil de pompe ; sans ce champ, aucune génération automatique. */
  pumpPreparation?: {
    amount: number;
    amountUnit: "mg" | "g" | "UI";
    volumeMl: number;
    count: number;
    targetMl: number;
    convention: "total" | "added";
  };
}

const RE_NAU = "Livret RE.NAU 2018";

export const PERFUSIONS: PerfusionPreset[] = [
  // ══════════════ VASOPRESSEURS / INOTROPES ══════════════
  {
    drugId: "noradrenaline",
    label: { fr: "Noradrénaline — choc septique (µg/kg/min)", ar: "نورأدرينالين — صدمة إنتانية" },
    prep: { fr: "8 mg de noradrénaline-base complétés à 50 mL G5 % (160 µg/mL) ; vérifier l'équivalence base/tartrate selon le RCP local", ar: "8 ملغ من قاعدة النورأدرينالين تُستكمل إلى 50 مل غلوكوز 5% (160 مكغ/مل)؛ تحقق من مكافئ القاعدة/الطرطرات وفق النشرة المحلية" },
    concUgPerMl: (8 * 1000) / 50,
    unit: "µg/kg/min",
    doseMin: 0.05, doseMax: 1, doseStep: 0.05, doseStart: 0.1,
    weightBased: true,
    note: { fr: "Cible initiale PAM : environ 65 mmHg ; plage 60–65 mmHg à considérer si âge ≥65 ans (SSC 2026). Dose/plage de titration : protocole RE.NAU 2018, à vérifier localement.", ar: "هدف PAM الابتدائي نحو 65 مم زئبق؛ ويُنظر في نطاق 60–65 عند عمر 65 سنة فأكثر (SSC 2026). مجال الجرعة والمعايرة من بروتوكول RE.NAU 2018 ويُراجع محلياً." },
    warnings: { fr: "Extravasation = risque de lésion/nécrose. En choc septique, SSC 2026 suggère le début périphérique plutôt que retarder jusqu'à l'abord central ; surveillance du point d'injection et sécurité selon protocole local. Ne jamais arrêter brutalement.", ar: "التسرب خارج الوريد قد يسبب أذية/نخراً. في الصدمة الإنتانية تقترح SSC 2026 البدء طرفياً بدلاً من التأخير حتى الخط المركزي؛ راقب موضع الحقن واتبع بروتوكول السلامة المحلي. لا توقف فجأة." },
    tips: { fr: "G5 % de préférence selon RE.NAU (vérifier compatibilité/diluant du produit local) ; RE.NAU indique que NaCl peut être utilisé si la voie est centrale. Injection au plus près du patient ; prévoir relais de seringue ; scope + PA continue.", ar: "يفضل G5% وفق RE.NAU (تحقق من توافق/مذيب المستحضر المحلي)؛ ويذكر RE.NAU إمكان استخدام المصل الملحي إذا كان الخط مركزياً. الحقن قرب المريض؛ جهّز تبديل السرنجة؛ راقب القلب والضغط باستمرار." },
    source: RE_NAU + " (dose/préparation) ; Surviving Sepsis Campaign 2026 (first-line agent, MAP target, peripheral start)",
  },
  {
    drugId: "noradrenaline",
    label: { fr: "Noradrénaline-base (mg/h)", ar: "نورأدرينالين كقاعدة فعالة — ملغ/س" },
    prep: { fr: "8 mg de noradrénaline-base complétés à 50 mL G5 % (160 µg/mL) ; vérifier l'équivalence base/tartrate selon le RCP local", ar: "8 ملغ من قاعدة النورأدرينالين تُستكمل إلى 50 مل غلوكوز 5% (160 مكغ/مل)؛ تحقق من مكافئ القاعدة/الطرطرات وفق النشرة المحلية" },
    concUgPerMl: 160,
    unit: "mg/h",
    doseMin: 0.5, doseMax: 6, doseStep: 0.5, doseStart: 1,
    weightBased: false,
    note: { fr: "À 160 µg/mL : 1 mg/h = 6,25 mL/h. À 70 kg, 1 mg/h ≈ 0,24 µg/kg/min. Vérifier la concentration affichée et l'unité prescrite.", ar: "عند 160 مكغ/مل: 1 ملغ/س = 6.25 مل/س. وعند وزن 70 كغ، 1 ملغ/س ≈ 0.24 مكغ/كغ/د. تحقق من التركيز والوحدة الموصوفة." },
    warnings: { fr: "Dosage élevé en mg/h — vérifier l'unité avec le médecin prescripteur.", ar: "جرعة بالملغ/س — تحقق من الوحدة مع الطبيب." },
    tips: { fr: "Surveillance : scope, PA, diurèse, point de ponction. Relais progressif.", ar: "مراقبة: scope، ضغط، بيلة، موضع الحقن. تبديل تدريجي." },
    source: RE_NAU + " (repère posologique mg/h ; concentration harmonisée dans l'application à 160 µg/mL)",
  },
  {
    drugId: "adrenaline",
    label: { fr: "Adrénaline — choc anaphylactique réfractaire", ar: "أدرينالين — تأق مقاوم" },
    prep: { fr: "2 mg complétés à 40 mL NaCl 0,9 % (50 µg/mL)", ar: "2 ملغ إلى 40 مل مصل (50 مكغ/مل)" },
    concUgPerMl: 50,
    unit: "mg/h",
    doseMin: 0.1, doseMax: 1, doseStep: 0.05, doseStart: 0.1,
    weightBased: false,
    note: { fr: "Débuter vitesse 2 (0,1 mg/h), +1 palier/5 min jusqu'à PAM > 60 mmHg.", ar: "ابدأ بسرعة 2؛ زد درجة كل 5 دقائق حتى ضغط متوسط أكثر من 60." },
    bolus: { fr: "Avant PSE : IV D 50 µg (1 mL de la seringue) renouvelable ×2 à 1-2 min si collapsus (max 2 bolus — risque arythmogène). IM reste la voie de référence : 0,01 mg/kg max 0,5 mg.", ar: "قبل المضخة: وريد مباشر 50 مكغ قابلة للتكرار ×2؛ العضلي تبقى المرجع: 0.01 ملغ/كغ (أقصى 0.5)." },
    warnings: { fr: "Arrhythmies, ischémie myocardique, HTA sévère à forte dose. ECG continu obligatoire.", ar: "اضطراب نظم وإقفار قلبي وارتفاع ضغط بالجرعات الكبيرة. تخطيط مستمر إلزامي." },
    source: RE_NAU + " ; ERC 2021 anaphylaxie",
  },
  {
    drugId: "adrenaline",
    label: { fr: "Adrénaline — choc cardiogénique / post-AC (µg/kg/min)", ar: "أدرينالين — صدمة قلبية" },
    prep: { fr: "3 mg dans 50 mL NaCl 0,9 % (60 µg/mL)", ar: "3 ملغ في 50 مل (60 مكغ/مل)" },
    concUgPerMl: 60,
    unit: "µg/kg/min",
    doseMin: 0.02, doseMax: 0.3, doseStep: 0.02, doseStart: 0.05,
    weightBased: true,
    tips: { fr: "Voie dédiée. Après IVD : rincer 20 mL NaCl + surélever le membre 10-20 s.", ar: "خط مخصص. بعد الحقن الوريدي: اشطف بـ20 مل وارفع الطرف 10-20 ث." },
    source: RE_NAU + " ; ERC 2021",
  },
  {
    drugId: "adrenaline",
    label: { fr: "Adrénaline — bradycardie résistante à l'atropine", ar: "أدرينالين — بطء قلب مقاوم" },
    prep: { fr: "1 mg dans 50 mL NaCl (20 µg/mL) — titration fine", ar: "1 ملغ في 50 مل (20 مكغ/مل)" },
    concUgPerMl: 20,
    unit: "µg/min",
    doseMin: 2, doseMax: 10, doseStep: 1, doseStart: 2,
    weightBased: false,
    note: { fr: "2-10 µg/min IV en attendant l'entrainement électrosystolique.", ar: "2-10 مكغ/د بانتظار القاطب المؤقت." },
    source: "AHA ACLS 2020 ; ERC 2021",
  },
  {
    drugId: "dobutamine",
    label: { fr: "Dobutamine — inotrope (adulte)", ar: "دوبوتامين — منشّط قلبي (بالغ)" },
    prep: { fr: "250 mg (20 mL) + solvant compatible q.s. volume final 250 mL (≈ 1 mg/mL), G5 % ou NaCl 0,9 % — RCP Panpharma", ar: "250 ملغ (20 مل) مع مذيب متوافق حتى حجم نهائي 250 مل (نحو 1 ملغ/مل)، غلوكوز 5% أو NaCl 0.9% — وفق نشرة Panpharma" },
    concUgPerMl: 1000,
    unit: "µg/kg/min",
    doseMin: 2.5, doseMax: 10, doseStep: 2.5, doseStart: 2.5,
    weightBased: true,
    note: { fr: "RCP Panpharma adulte : dose usuelle 2,5–10 µg/kg/min, titrée à la réponse. Une tolérance peut apparaître après ≥72 h de perfusion continue ; des doses jusqu'à 40 ont été administrées. Au-delà du preset, suivre uniquement une décision spécialisée et un protocole vérifié. En sepsis adulte, SSC 2026 : seulement si hypoperfusion persistante avec dysfonction cardiaque malgré réanimation adéquate.", ar: "نشرة Panpharma للبالغين: الجرعة المعتادة 2.5–10 مكغ/كغ/د وتُعاير حسب الاستجابة. قد يظهر تحمل بعد تسريب مستمر ≥72 ساعة؛ وقد استُعملت جرعات حتى 40. تجاوز مجال الحاسبة لا يكون إلا بقرار اختصاصي وبروتوكول متحقق منه. في إنتان البالغين وفق SSC 2026: فقط عند استمرار نقص التروية مع خلل قلبي رغم الإنعاش الملائم." },
    warnings: { fr: "Corriger l'hypovolémie avant administration. Contre-indiquée en cas d'obstacle mécanique au remplissage/à l'éjection ou d'obstruction dynamique intraventriculaire. Ne pas traiter une hypotension isolée par dobutamine.", ar: "صحّح نقص الحجم قبل الإعطاء. تُمنع عند وجود عائق ميكانيكي للامتلاء/القذف أو انسداد ديناميكي داخل البطين. لا تعالج هبوط الضغط وحده بالدوبوتامين." },
    tips: { fr: "Perfusion IV continue par pompe. À l'hôpital : surveillance cardiovasculaire continue et diurèse ; hors hôpital en attente d'admission : médecin au chevet, PA/FC au moins toutes les 15 min (RCP). Ne pas mélanger au bicarbonate ni aux solutions fortement alcalines ; vérifier la compatibilité avant toute co-perfusion. Arrêter progressivement.", ar: "تسريب وريدي مستمر بمضخة. داخل المستشفى: مراقبة قلبية وعائية مستمرة والإدرار؛ وخارجه بانتظار القبول الطبي: يبقى الطبيب بجانب المريض ويُقاس الضغط والنبض كل 15 دقيقة على الأقل (النشرة). لا تخلطه بالبيكربونات أو المحاليل القلوية بشدة؛ تحقّق من التوافق قبل التسريب المشترك. أوقفه تدريجياً." },
    source: "ANSM (France) — RCP DOBUTAMINE PANPHARMA, mise à jour 18/03/2022, §§4.1–4.4 et 6.6 ; SSC 2026 (indication septique adulte)",
    pumpPreparation: { amount: 250, amountUnit: "mg", volumeMl: 20, count: 1, targetMl: 250, convention: "total" },
  },
  {
    drugId: "isoprenaline",
    label: { fr: "Isoprénaline (Isuprel®) — BAV / torsades sur QT non congénital", ar: "إيزوبرينالين — حصار أذيني-بطيني" },
    prep: { fr: "1 mg (5 ampoules de 0,2 mg) dans 50 mL G5 % (20 µg/mL) — changer/24 h", ar: "1 ملغ (5 أمبولات 0.2) في 50 مل غلوكوز (20 مكغ/مل) — بدّل كل 24 س" },
    concUgPerMl: 20,
    unit: "µg/min",
    doseMin: 1, doseMax: 10, doseStep: 0.5, doseStart: 1.7,
    weightBased: false,
    note: { fr: "Débuter vitesse 5 (≈ 0,1 mg/h) ; ±1 palier toutes les 5-15 min. Objectif FC 80-100/min.", ar: "ابدأ سرعة 5؛ عدّل ±1 كل 5-15 د. الهدف نبض 80-100." },
    warnings: { fr: "CI : torsades sur QT long congénital, tachycardie sinusale > 130, intoxication digitalique, coronaropathie aiguë (sauf BAV extrême).", ar: "ممنوع: التواء ذروة على QT طويل خِلقي، تسرّع جيبي أكثر من 130، تسمم رقمي، إقفار تاجي حاد." },
    tips: { fr: "Scope + PA + ECG continu. Douleur angineuse → réduire le débit.", ar: "مراقبة مستمرة. ألم ذبحي → قلّل السرعة." },
    source: RE_NAU,
  },
  // ══════════════ VASODILATATEURS / ANTIHYPERTENSEURS ══════════════
  {
    drugId: "nicardipine",
    label: { fr: "Nicardipine (Loxen®) — urgence hypertensive / SAA", ar: "نيكارديبين (لوكسن) — فرط ضغط استعجالي" },
    prep: { fr: "10 mg complétés à 50 mL G5 % (0,2 mg/mL)", ar: "10 ملغ إلى 50 مل غلوكوز (0.2 ملغ/مل)" },
    concUgPerMl: 200,
    unit: "mg/h",
    doseMin: 1, doseMax: 15, doseStep: 0.5, doseStart: 1,
    weightBased: false,
    note: { fr: "Débuter 1 mg/h (vit. 5). Si PAS > 160 : +0,5-1 mg/h ; si PAS < 140 : −1 mg/h. PA toutes les 15 min.", ar: "ابدأ 1 ملغ/س. إن كان الانقباضي أكثر من 160: ‎+0.5-1؛ إن كان أقل من 140: ‎−1. قياس كل 15 د." },
    bolus: { fr: "SAA : IVL pur 1 mg/min jusqu'à 10 mg max selon l'effet, puis relais PSE.", ar: "متلازمة أبهر حادة: 1 ملغ/د وريد بطيء صافي حتى 10 ملغ ثم مضخة." },
    warnings: { fr: "Baisse de PA ≤ 25 % du niveau initial dans l'heure (risque d'hypoperfusion cérébrale/coronaire). IPC : Ringer, bicarbonate, furosémide, diazépam.", ar: "لا تخفض الضغط أكثر من 25% من المبدأ خلال ساعة. عدم توافق: Ringer، بيكربونات، لازيليكس، فاليوم." },
    source: RE_NAU,
  },
  {
    drugId: "urapidil",
    label: { fr: "Urapidil (Eupressyl®) — SAA / urgence hypertensive", ar: "يورابيديل (أوبريسيل) — أبهر حاد" },
    prep: { fr: "100 mg complétés à 50 mL G5 % ou NaCl (2 mg/mL)", ar: "100 ملغ إلى 50 مل (2 ملغ/مل)" },
    concUgPerMl: 2000,
    unit: "mg/h",
    doseMin: 10, doseMax: 30, doseStep: 5, doseStart: 10,
    weightBased: false,
    bolus: { fr: "Dose de charge : 25 mg (5 mL) IVL en 20 s, renouvelable ×1 à 5 min.", ar: "جرعة تحميل: 25 ملغ وريد بطيء خلال 20 ث، قابلة للتكرار مرة بعد 5 د." },
    warnings: { fr: "CI : rétrécissement aortique serré, grossesse (déconseillé).", ar: "ممنوع: تضيق أبهري شديد، حمل (يكره)." },
    tips: { fr: "PA toutes les 5 min pendant les bolus, puis toutes les 15 min la 1re heure.", ar: "قياس كل 5 د أثناء الدفعات ثم كل 15 د الساعة الأولى." },
    source: RE_NAU,
  },
  {
    drugId: "labetalol",
    label: { fr: "Labétalol (Trandate®) — SAA / prééclampsie", ar: "لابيتالول (تراندات) — أبهر/ما قبل تسمم حمل" },
    prep: { fr: "100 mg complétés à 50 mL G5 % (2 mg/mL)", ar: "100 ملغ إلى 50 مل غلوكوز (2 ملغ/مل)" },
    concUgPerMl: 2000,
    unit: "mg/min",
    doseMin: 0.5, doseMax: 2, doseStep: 0.5, doseStart: 1,
    weightBased: false,
    bolus: { fr: "10–20 mg IV lente sur 2 min (schéma obstétrical : commencer à 20 mg) ; réévaluer la PA avant toute dose suivante. Suivre le protocole local.", ar: "10–20 ملغ ببطء وريدياً خلال دقيقتين (في بروتوكول التوليد: ابدأ بـ20 ملغ)؛ أعد قياس الضغط قبل أي جرعة تالية. اتبع البروتوكول المحلي." },
    warnings: { fr: "Réduire si FC < 50/min. CI : asthme, BPCO/bronchospasme, IC décompensée, BAV, choc. Doses IV en milieu surveillé.", ar: "خفّض الجرعة إن كان النبض أقل من 50. يُمنع عند الربو/التشنج القصبي، قصور القلب المنفك، حصار AV أو الصدمة. الجرعات الوريدية في بيئة مراقبة." },
    source: RE_NAU + " (préparation) ; ACOG Practice Bulletin No. 222 (2020) ; FDA Prescribing Information (2024), §2.2 (doses fixes et perfusion 2 mg/min)",
  },
  {
    drugId: "trinitrine",
    label: { fr: "Trinitrine IV — OAP / SCA", ar: "ترينيترين وريد — وذمة رئة" },
    prep: { fr: "25 mg dans 50 mL G5 % (0,5 mg/mL)", ar: "25 ملغ في 50 مل (0.5 ملغ/مل)" },
    concUgPerMl: 500,
    unit: "µg/min",
    doseMin: 5, doseMax: 200, doseStep: 5, doseStart: 10,
    weightBased: false,
    note: { fr: "OAP : 10-20 µg/min puis titration. Douleur/SCA si PAS > 110.", ar: "وذمة: 10-20 مكغ/د ثم معايرة حسب الضغط." },
    warnings: { fr: "Stop si PAS < 100 mmHg. CI : RAo serré, IDM inférieur avec atteinte du VD, HIC, inhibiteurs PDE5 < 24-48 h.", ar: "أوقف إن كان الانقباضي أقل من 100. ممنوع: تضيق أبهري، احتشاء سفلي مع بطين أيمن، ضغط قحفي مرتفع." },
    tips: { fr: "Equivalent RE.NAU : Risordan® (isosorbide dinitrate) — bolus 2-4 mg/5 min si TAS > 140, entretien 1 mg/h +1/5 min.", ar: "مكافئ RE.NAU: ريزوردان — دفعة 2-4 ملغ/5 د إن ضغط أكثر من 140، ثم 1 ملغ/س +1 كل 5 د." },
    source: RE_NAU + " ; ESC 2021 OAP",
  },
  {
    drugId: "esmolol",
    label: { fr: "Esmolol (Brevibloc®) — SAA / FA rapide / dissection", ar: "إسمولول — أبهر حاد / رجفان سريع" },
    prep: { fr: "Flacon 2,5 g/250 mL prêt (10 mg/mL)", ar: "قارورة 2.5 غ/250 مل جاهزة (10 ملغ/مل)" },
    concUgPerMl: 10000,
    unit: "µg/kg/min",
    doseMin: 50, doseMax: 200, doseStep: 25, doseStart: 50,
    weightBased: true,
    bolus: { fr: "Option : 0,5 mg/kg IVL sur 1 min avant la seringue (avis médical).", ar: "اختياري: 0.5 ملغ/كغ خلال دقيقة قبل المضخة." },
    warnings: { fr: "CI : choc, IC décompensée, bradycardie < 50, BAV. Demi-vie 9 min — arrêt = effet cesse en 20 min.", ar: "ممنوع: صدمة/قصور/بطء أقل من 50. نصف عمر 9 د — التوقف يلغي التأثير خلال 20 د." },
    source: RE_NAU + " ; ESC 2014 SAA",
  },
  // ══════════════ ANTIARYTHMIQUES ══════════════
  {
    drugId: "amiodarone",
    label: { fr: "Cordarone® — charge TdR (5 mg/kg sur 1 h)", ar: "كوردارون — جرعة تحميل خلال ساعة" },
    prep: { fr: "5 mg/kg (2-3 amp de 150 mg) complétés à 40 mL G5 % — débit = volume total sur 1 h", ar: "5 ملغ/كغ (2-3 أمبولات) إلى 40 مل غلوكوز — السرعة = الحجم الكلي خلال ساعة" },
    concUgPerMl: 11250, // 450 mg/40 mL
    unit: "mg/kg/h",
    doseMin: 5, doseMax: 5, doseStep: 5, doseStart: 5,
    weightBased: true,
    note: { fr: "FA < 48 h + cardiopathie + décoagulé ; TV mal tolérée (discuter CEE).", ar: "رجفان أقل من 48 س مع قلبية؛ تسرّع بطيني سيّئ التحمّل (ناقش الصدمة)." },
    warnings: { fr: "VEINOTOXIQUE +++ : VVP gros calibre dédiée, surveiller le point de ponction. IPC : héparine, digoxine, furosémide. CI : bradycardie, BAV sévère, hypotension sévère, dysthyroïdie.", ar: "سُمّيّة وريدية شديدة: خط واسع مخصص. عدم توافق: هيبارين، ديغوكسين، لازيليكس. ممنوع: بطء شديد، حصار، هبوط ضغط، خلل درقية." },
    tips: { fr: "G5 % exclusivement. Dilution toujours nécessaire pour la charge.", ar: "غلوكوز 5% حصراً. التمديد إلزامي للتحميل." },
    source: RE_NAU,
  },
  {
    drugId: "amiodarone",
    label: { fr: "Cordarone® — entretien (relais continu)", ar: "كوردارون — استمراري" },
    prep: { fr: "600 mg dans 50 mL G5 % (12 mg/mL)", ar: "600 ملغ في 50 مل غلوكوز" },
    concUgPerMl: 12000,
    unit: "mg/min",
    doseMin: 0.3, doseMax: 0.7, doseStep: 0.1, doseStart: 0.5,
    weightBased: false,
    note: { fr: "≈ 900-2 000 mg/24 h ? Non : ici ≈ 430-1 000 mg/24 h. Avis cardiologique pour le relais.", ar: "الرأي القلبي مطلوب للتبديل." },
    source: RE_NAU,
  },
  {
    drugId: "sulfate-magnesium",
    label: { fr: "Sulfate de magnésium — torsades / hypokaliémie", ar: "كبريتات مغنيزيوم — التواء ذروة" },
    prep: { fr: "4,5 g (3 amp de 1,5 g) pur en seringue 30-50 mL (150 mg/mL)", ar: "4.5 غ (3 أمبولات) صافياً (150 ملغ/مل)" },
    concUgPerMl: 150000,
    unit: "g/h",
    doseMin: 1, doseMax: 3, doseStep: 0.5, doseStart: 1.5,
    weightBased: false,
    bolus: { fr: "Torsades : 2 g IVL sur 15 min AVANT. Éclampsie : 4 g IVL 30 min puis entretien 1 g/h × 24 h post-accouchement.", ar: "التواء: 2 غ خلال 15 د قبل. تسمم حمل: 4 غ خلال 30 د ثم 1 غ/س لمدة 24 س بعد الولادة." },
    warnings: { fr: "CI : insuffisance rénale sévère, bradycardie, hypotension. Surveiller réflexes rotuliens : disparition = surdosage (antidote : gluconate de calcium).", ar: "ممنوع: قصور كلوي شديد، بطء، هبوط ضغط. راقب المنعكسات الرضية: اختفاؤها = جرعة زائدة (الترياق: غلوكونات كالسيوم)." },
    source: RE_NAU,
  },
  // ══════════════ SÉDATION / ANALGÉSIE ══════════════
  {
    drugId: "propofol",
    label: { fr: "Propofol (Diprivan®) — sédation entretenue", ar: "بروبوفول (ديبريفان) — تهدئة مستمرة" },
    prep: { fr: "PUR — flacon 1 % (10 mg/mL), pas de dilution", ar: "صافٍ — قارورة 1% (10 ملغ/مل) بلا تمديد" },
    concUgPerMl: 10000,
    unit: "mg/kg/h",
    doseMin: 1, doseMax: 15, doseStep: 0.5, doseStart: 4,
    weightBased: true,
    note: { fr: "Sédation réa : 1-4 mg/kg/h ; entretien anesthésie : 6-15 mg/kg/h.", ar: "تهدئة الإنعاش: 1-4 ملغ/كغ/س؛ استمرارية تخدير: 6-15." },
    warnings: { fr: "Émulsion lipidique sans conservateur → changer seringue/tubulure selon règles d'hygiène (risque bactérien). CI : allergie arachide/soja (œuf), hypovolémie non corrigée. Hypotension quasi constante à l'induction.", ar: "محلول دهني بلا حافظ → بدّل السرنجة حسب قواعد النظافة. ممنوع: حساسية فول/صويا، نقص حجم غير مصحح. هبوط ضغط شبه ثابت عند التحريض." },
    tips: { fr: "IPC : cisatracurium, chlorure de calcium, héparine, vancomycine, amikacine. Diurèse verte → avis médical.", ar: "عدم توافق: سيزاتراكوريوم، كلورور كالسيوم، هيبارين. بيلة خضراء → رأي طبي." },
    source: RE_NAU,
    pumpPreparation: { amount: 500, amountUnit: "mg", volumeMl: 50, count: 1, targetMl: 50, convention: "total" },
  },
  {
    drugId: "midazolam",
    label: { fr: "Midazolam (Hypnovel®) — sédation", ar: "ميدازولام (هيبنوفيل) — تهدئة" },
    prep: { fr: "50 mg dans 50 mL NaCl 0,9 % (1 mg/mL)", ar: "50 ملغ في 50 مل (1 ملغ/مل)" },
    concUgPerMl: 1000,
    unit: "mg/h",
    doseMin: 1, doseMax: 15, doseStep: 0.5, doseStart: 3,
    weightBased: false,
    note: { fr: "Titration à l'objectif de sédation. Sujet âgé/hypovolémique : débuter bas (0,5-1 mg/h).", ar: "معايرة على هدف التهدئة. المسن: ابدأ منخفضاً." },
    warnings: { fr: "Dépression respiratoire, apnée, hypotension — ANEXATE (flumazénil) à proximité immédiate.", ar: "تثبيط تنفسي، انقطاع نفس، هبوط ضغط — أنيكسات (فلومازينيل) في متناول اليد." },
    tips: { fr: "Mélange épileptique : IM si pas d'accès veineux. Score de sédation.", ar: "إن لم يوجد وريد: عضلي في الصرع. درجة تهدئة." },
    source: RE_NAU,
  },
  {
    drugId: "ketamine",
    label: { fr: "Kétamine (Kétalar®) — sédation prolongée", ar: "كيتامين (كيتالار) — تهدئة طويلة" },
    prep: { fr: "250 mg complétés à 50 mL (5 mg/mL)", ar: "250 ملغ إلى 50 مل (5 ملغ/مل)" },
    concUgPerMl: 5000,
    unit: "mg/kg/h",
    doseMin: 1, doseMax: 5, doseStep: 0.5, doseStart: 1,
    weightBased: true,
    bolus: { fr: "Induction : 2-3 mg/kg IVD. Analgésie geste court : 0,3-1 mg/kg IVD (sans midazolam systématique).", ar: "تحريض: 2-3 ملغ/كغ؛ تسكين إجراء قصير: 0.3-1 ملغ/كغ." },
    note: { fr: "Préserve l'hémodynamique — bronchodilatateur (asthme sévère intubé).", ar: "يحفظ الدورة ويوسّع القصبات (ربو شديد منبّب)." },
    tips: { fr: "Réveil dans le calme/penombre ; émergence hallucinatoire fréquente — parler doucement.", ar: "استيقاظ بمكان هادئ؛ هلوسات شائعة — تحدّث بهدوء." },
    source: RE_NAU,
  },
  {
    drugId: "fentanyl",
    label: { fr: "Fentanyl — sédation/analgésie", ar: "فنتانيل — تسكين" },
    prep: { fr: "500 µg dans 50 mL NaCl (10 µg/mL)", ar: "500 مكغ في 50 مل (10 مكغ/مل)" },
    concUgPerMl: 10,
    unit: "µg/kg/h",
    doseMin: 0.5, doseMax: 3, doseStep: 0.25, doseStart: 1,
    weightBased: true,
    bolus: { fr: "Bolus initial 1 µg/kg IVL, titration 25-50 µg.", ar: "دفعة 1 مكغ/كغ ثم معايرة 25-50 مكغ." },
    warnings: { fr: "Bolus rapide = rigidité thoracique. Antidote : Narcan (naloxone) traçabilité ++.", ar: "الدفعة السريعة = صلابة صدرية. الترياق: ناركان؛ تتبّع إلزامي." },
    source: RE_NAU + " ; SFAR",
  },
  {
    drugId: "sufentanil",
    label: { fr: "Sufentanil (Sufenta®) — sédation patient ventilé", ar: "سوفنتانيل — تهدئة المنبّب" },
    prep: { fr: "250 µg complétés à 50 mL (5 µg/mL)", ar: "250 مكغ إلى 50 مل (5 مكغ/مل)" },
    concUgPerMl: 5,
    unit: "µg/kg/h",
    doseMin: 0.15, doseMax: 1, doseStep: 0.05, doseStart: 0.15,
    weightBased: true,
    bolus: { fr: "Dose de charge post-ISR : 0,15-0,20 µg/kg IVD (≈ 10-20 µg) ou titration 5 µg par 5 µg chez l'instable.", ar: "جرعة تحميل بعد الإنعاش السريع: 0.15-0.20 مكغ/كغ (≈10-20 مكغ) أو معايرة 5 بـ5 لدى غير المستقر." },
    warnings: { fr: "Voie sous-cutanée NON recommandée. Antidote = Narcan. Traçabilité stupéfiant.", ar: "لا يُعطى تحت الجلد. الترياق ناركان. مخدّر يستلزم تتبعاً." },
    source: RE_NAU,
  },
  {
    drugId: "morphine",
    label: { fr: "Morphine — sédation/analgésie continue", ar: "مورفين — تسكين مستمر" },
    prep: { fr: "50 mg (5 amp de 10 mg) complétés à 50 mL (1 mg/mL)", ar: "50 ملغ (5 أمبولات 10) إلى 50 مل (1 ملغ/مل)" },
    concUgPerMl: 1000,
    unit: "mg/h",
    doseMin: 1, doseMax: 10, doseStep: 1, doseStart: 2,
    weightBased: false,
    bolus: { fr: "Titration IV : bolus 2 mg (< 60 kg) ou 3 mg (> 60 kg) toutes les 5 min tant que EVA/EN > 3, réévaluation médicale après 5 bolus (0,05 mg/kg si > 80 ans, < 50 kg, IR/IH/IRC). OAP : 0,05 mg/kg IVL pour l'adaptation à la VNI.", ar: "معايرة: 2 ملغ (أقل من 60 كغ) أو 3 ملغ (أكثر من 60) كل 5 د حتى ألم 3 أو أقل؛ تصحّح بعد 5 دفعات. وذمة رئة: 0.05 ملغ/كغ للتكيّف مع التنفس غير الغازي." },
    warnings: { fr: "Dépression respiratoire, nausées, rétention urinaire, hypotension. Score de sédation + FR + SpO2.", ar: "تثبيط تنفسي، غثيان، احتباس بولي، هبوط ضغط. درجة تهدئة + FR + SpO2." },
    source: RE_NAU,
  },
  // ══════════════ ANTICOAGULANTS ══════════════
  {
    drugId: "heparine",
    label: { fr: "Héparine HNF — SCA médical (départ 60/12 UI/kg/h)", ar: "هيبارين — علاج متلازمة تاجية دون قسطرة" },
    prep: { fr: "25 000 UI complétés à 50 mL NaCl 0,9 % (500 UI/mL)", ar: "25 ألف وحدة إلى 50 مل (500 وحدة/مل)" },
    concUgPerMl: 500,
    unit: "UI/kg/h",
    doseMin: 12, doseMax: 12, doseStep: 1, doseStart: 12,
    weightBased: true,
    maxUnitsPerHour: 1000,
    bolus: { fr: "SCA : bolus initial 60 UI/kg IV, maximum 4 000 UI, avant la seringue. Hors dose de PCI; en cas de fibrinolyse, suivre le protocole spécifique.", ar: "متلازمة تاجية: دفعة أولية 60 وحدة/كغ وريدياً، بحد أقصى 4000، قبل المضخة. ليست جرعة PCI؛ اتبع بروتوكول تحليل الخثرة عند إجرائه." },
    note: { fr: "Débit initial 12 UI/kg/h (maximum 1 000 UI/h). Ce preset ne calcule pas l'ajustement ultérieur au TCA.", ar: "التدفق الأولي 12 وحدة/كغ/س (الحد الأقصى 1000 وحدة/س). لا يحسب هذا الخيار التعديل اللاحق وفق TCA." },
    warnings: { fr: "Contrôles TCA et ajustement selon la cible ACS (60–80 s sans fibrinolyse; 50–70 s avec fibrinolyse) et le protocole cardiologique/local; ne pas employer un ratio TCA générique. Surveiller saignement et plaquettes. PCI : dose et ACT réglés en salle de cathétérisme.", ar: "افحص TCA وعدّل وفق هدف SCA (60–80 ثانية دون تحليل الخثرة؛ 50–70 معه) والبروتوكول المحلي؛ لا تستخدم نسبة عامة. راقب النزيف والصفائح. القسطرة: الجرعة وACT في القاعة." },
    source: "AHA/ACC ACS 2025, Table 10 + corrections 2025; RE.NAU 2018 (préparation, à vérifier localement)",
  },
  {
    drugId: "heparine",
    label: { fr: "Héparine HNF — TVP/EP si HNF retenue (exemple UW)", ar: "هيبارين — خثار وريدي/صمة عند اختيار غير المجزأ (مثال UW)" },
    prep: { fr: "25 000 UI complétés à 50 mL NaCl 0,9 % (500 UI/mL)", ar: "25 ألف وحدة إلى 50 مل (500 وحدة/مل)" },
    concUgPerMl: 500,
    unit: "UI/kg/h",
    doseMin: 18, doseMax: 18, doseStep: 1, doseStart: 18,
    weightBased: true,
    bolus: { fr: "Schéma UW Medicine : bolus 80 UI/kg IV (maximum 10 000 UI). Ne l'utiliser que si l'équipe a retenu l'HNF et après vérification du protocole local.", ar: "بروتوكول UW Medicine: دفعة 80 وحدة/كغ (حد أقصى 10000). لا تستخدمه إلا بعد اختيار الفريق والتحقق من البروتوكول المحلي." },
    note: { fr: "Débit initial 18 UI/kg/h. Premier anti-Xa à 6 h (cible usuelle UW 0,3–0,7 UI/mL); ajuster seulement avec un nomogramme local validé.", ar: "التدفق الأولي 18 وحدة/كغ/س. أول anti-Xa بعد 6 ساعات (هدف UW ‏0.3–0.7 وحدة/مل)؛ عدّل وفق مخطط محلي معتمد فقط." },
    warnings: { fr: "Pour l'EP, l'AHA/ACC 2026 préfère l'HBPM à l'HNF dans la plupart des anticoagulations parentérales initiales. La cible TCA dépend du réactif et du laboratoire. Thrombolyse/reperfusion : bolus, suspension et reprise exigent un protocole spécifique — ce preset ne les définit pas.", ar: "في الصمة، تفضل إرشادات AHA/ACC 2026 الهيبارين منخفض الوزن الجزيئي غالباً. هدف TCA يعتمد على الكاشف والمختبر. تحليل/إعادة تروية: الدفعة والإيقاف والاستئناف وفق بروتوكول خاص؛ لا يحددها هذا الخيار." },
    source: "UW Medicine Anticoagulation Services (schéma institutionnel HNF, consulté 2026) ; AHA/ACC EP 2026 (préférence HBPM)",
  },
  // ══════════════ ENDOCRINIENS / DIVERS ══════════════
  {
    drugId: "insuline-rapide",
    label: { fr: "Insuline rapide (Actrapid®) — ACD/HHS", ar: "إنسولين سريع — حماض كيتوني" },
    prep: { fr: "50 UI dans 50 mL NaCl 0,9 % (1 UI/mL)", ar: "50 وحدة في 50 مل (1 وحدة/مل)" },
    concUgPerMl: 1,
    unit: "UI/kg/h",
    doseMin: 0.05, doseMax: 0.15, doseStep: 0.01, doseStart: 0.1,
    weightBased: true,
    note: { fr: "Glycémie capillaire/h ; ajouter KCl quand K < 5 mmol/L (guideline SFAR/SFD).", ar: "قياس سكر كل ساعة؛ أضف KCl عند Kأقل من 5." },
    warnings: { fr: "Règle RE.NAU hors ACD : débit mL/h ≈ glycémie en g/L. Hyperkaliémie : 10 UI + 250 mL G10 % en 15-20 min (hors PSE continu).", ar: "خارج الحماض: مل/س ≈ السكر غ/ل. فرط بوتاسيوم: 10 وحدات + 250 مل G10 خلال 15-20 د." },
    source: RE_NAU + " ; SFD/SFE 2023",
  },
  {
    drugId: "octreotide",
    label: { fr: "Octréotide (Sandostatine®) — rupture varices œsophagiennes", ar: "أوكتريوتيد — نزيف دوالي مريء" },
    prep: { fr: "300 µg complétés à 48 mL NaCl (6,25 µg/mL) — 12 h", ar: "300 مكغ إلى 48 مل (6.25 مكغ/مل) — 12 س" },
    concUgPerMl: 6.25,
    unit: "µg/h",
    doseMin: 25, doseMax: 50, doseStep: 25, doseStart: 25,
    weightBased: false,
    note: { fr: "25 µg/h = 4 mL/h pendant 48 h (renouveler la seringue toutes les 12 h : 300 µg/48 mL, ou 600 µg/48 mL vit. 2 sur 24 h).", ar: "25 مكغ/س = 4 مل/س لمدة 48 س (جدّد السرنجة كل 12 س)." },
    warnings: { fr: "Ne pas interrompre brutalement : risque d'hémorragie rebond. Surveiller glycémie (hypoglycémie si insuline associée). CI : grossesse.", ar: "لا تقطع فجأة: نزيف ارتدادي. راقب السكر مع الإنسولين. ممنوع: حمل." },
    source: RE_NAU,
  },
  {
    drugId: "acide-tranexamique",
    label: { fr: "Acide tranéxamique (Exacyl®) — entretien post-charge", ar: "حمض ترانيكساميك — استمراري بعد التحميل" },
    prep: { fr: "1 g (2 amp de 0,5 g) complétés à 40 mL NaCl (25 mg/mL) sur 8 h", ar: "1 غ (أمبولتان 0.5) إلى 40 مل خلال 8 س" },
    concUgPerMl: 25000,
    unit: "mg/h",
    doseMin: 125, doseMax: 125, doseStep: 125, doseStart: 125,
    weightBased: false,
    bolus: { fr: "AVANT : 1 g IVL en 10-15 min (dans l'heure du trauma — inutile après H3). HPP : renouveler ×1 à 30 min si saignement persistant.", ar: "قبل: 1 غ خلال 10-15 د (خلال ساعة من الرضح؛ لا فائدة بعد 3 س). نزيف ما بعد الولادة: كرّر مرة بعد 30 د." },
    source: RE_NAU + " ; CRASH-2",
  },
  {
    drugId: "oxytocine",
    label: { fr: "Ocytocine (Syntocinon®) — hémorragie du post-partum", ar: "سينتوسينون — نزيف ما بعد الولادة" },
    prep: { fr: "5 UI dans 500 mL G5 % (10 mUI/mL) — perfusion rapide 2 h", ar: "5 وحدات في 500 مل غلوكوز — أداء سريع ساعتان" },
    concUgPerMl: 0.01,
    unit: "UI/h",
    doseMin: 5, doseMax: 10, doseStep: 5, doseStart: 5,
    weightBased: false,
    note: { fr: "5 UI/h ≈ 500 mL/h sur 2 h (macro-goutteur). IVDL 5-10 UI sur 1 min possible immédiatement après délivrance.", ar: "5 وحدات/س ≈ 500 مل/س لساعتين. وريد بطيء 5-10 وحدات خلال دقيقة ممكن بعد الانفصال مباشرة." },
    warnings: { fr: "Hypotension — allongement QT. Massage utérin associé.", ar: "هبوط ضغط — إطالة QT. تدليك رحمي مرافق." },
    source: RE_NAU,
  },
  {
    drugId: "phenylephrine",
    label: { fr: "Phényléphrine — hypotension peropératoire / rachianesthésie (adulte)", ar: "فينيل إفرين — هبوط الضغط أثناء الجراحة/التخدير النخاعي (بالغ)" },
    prep: { fr: "PHENYLEPHRINE RENAUDIN prête à l'emploi : 100 µg/mL (RCP ANSM, France). Vérifier la concentration de la spécialité disponible.", ar: "PHENYLEPHRINE RENAUDIN جاهز للاستعمال: 100 مكغ/مل (RCP ANSM الفرنسي). تحقّق من تركيز المنتج المتاح." },
    concUgPerMl: 100,
    unit: "µg/min",
    doseMin: 25, doseMax: 100, doseStep: 5, doseStart: 25,
    weightBased: false,
    bolus: { fr: "RCP : 50 µg IV, répétable selon l'effet ; ne pas dépasser 100 µg par bolus.", ar: "وفق RCP: ‏50 مكغ وريدياً، ويمكن التكرار حسب الأثر؛ لا تتجاوز 100 مكغ في الدفعة." },
    warnings: { fr: "RCP : indication périopératoire/anesthésique seulement, sous responsabilité anesthésique. Ne pas extrapoler au choc septique ; SSC 2026 recommande la noradrénaline en première ligne chez l'adulte. Peut diminuer le débit cardiaque ; prudence en cardiopathie, insuffisance cardiaque ou choc cardiogénique.", ar: "وفق RCP: للاستعمال حول الجراحة/التخدير فقط وتحت مسؤولية طبيب التخدير. لا تعممه على الصدمة الإنتانية؛ توصي SSC 2026 بالنورأدرينالين خطاً أول لدى البالغين. قد يخفض النتاج القلبي؛ الحذر في مرض القلب أو قصور القلب أو الصدمة القلبية." },
    source: "ANSM (France) — RCP PHENYLEPHRINE RENAUDIN 100 µg/mL, mise à jour 23/08/2024, §§4.1–4.4 ; SSC 2026 (noradrénaline 1re ligne en choc septique adulte)",
  },
];

/** Calcule mL/h à partir de la dose, du poids et de la concentration. */
export function perfusionFlow(p: PerfusionPreset, dose: number, weightKg: number): number {
  if (!dose || dose <= 0) return 0;
  let doseUgPerMin = dose;
  if (p.weightBased) doseUgPerMin = dose * weightKg;
  switch (p.unit) {
    case "µg/kg/min":
    case "µg/min":
      return (doseUgPerMin * 60) / (p.concUgPerMl || 1);
    case "µg/kg/h":
      return doseUgPerMin / (p.concUgPerMl || 1); // déjà /h, conc µg/mL
    case "µg/h":
      return doseUgPerMin / (p.concUgPerMl || 1); // idem, non pondéré
    case "mg/kg/h":
    case "mg/h":
    case "mg/min":
      return (doseUgPerMin * (p.unit === "mg/min" ? 60 : 1)) / (p.concUgPerMl / 1000);
    case "UI/kg/h":
    case "UI/h": {
      const effectiveUnitsPerHour = p.maxUnitsPerHour === undefined
        ? doseUgPerMin
        : Math.min(doseUgPerMin, p.maxUnitsPerHour);
      return effectiveUnitsPerHour / (p.concUgPerMl || 1); // UI/mL direct
    }
    case "g/h":
      return doseUgPerMin / (p.concUgPerMl / 1_000_000);
    default:
      return 0;
  }
}

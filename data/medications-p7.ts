import type { Medication } from "./types";

// v8.0 — Phase 7 : antidotes et urgences endocrino (émulsion lipidique, NaCl hypertonique 3 %,
// propylthiouracile, propranolol, dexaméthasone).
// Sources : EXTRIP 2021, ACMT lipid emulsion 2017, ATA 2016, Endocrine Society 2016, RE.NAU.
export const medicationsPhase7: Medication[] = [
  {
    id: "emulsion-lipidique",
    name: { fr: "Émulsion lipidique 20 % (Intralipide®)", ar: "مستحلب دهني 20% (إنتراليبيد)" },
    brands: "Intralipide® 20 % 100/250/500 mL",
    synonyms: ["intralipide", "émulsion lipidique", "lipides", "lipid rescue", "مستحلب دهني"],
    klass: { fr: "Antidote — « lipid sink » des toxiques lipophiles", ar: "ترياق — بالوعة شحمية للسموم شحمية المحبة" },
    highRisk: true,
    indications: {
      fr: "Toxicité systémique des anesthésiques locaux (bupivacaïne) ; rescue des intoxications lipophiles réfractaires : tricycliques, bêta-bloquants, inhibiteurs calciques, après les antidotes classiques et la réanimation optimale.",
      ar: "سمية أجهزة الجسم من المخدرات الموضعية (بوبيفاكائين)؛ إنقاذ التسممات شحمية المحبة المقاومة: ثلاثية الحلقات، حاصرات بيتا، مثبطات الكالسيوم، بعد الترياقات الكلاسيكية والإنعاش الأمثل.",
    },
    doseAdult: {
      fr: "Bolus 1,5 mL/kg IV en 1 min (max 100 mL) puis perfusion 0,25 mL/kg/min. Instabilité persistante : re-bolus ×2 + doubler la perfusion. Arrêt si PAS < 50 mmHg ou arrêt : RCP standard + lipides.",
      ar: "دفعة 1.5 مل/كغ وريدي خلال دقيقة (أقصى 100 مل) ثم تسريب 0.25 مل/كغ/د. عدم استقرار: أعد الدفعة مرتين وضاعف التسريب. إن هبط < 50 أو توقف: إنعاش قياسي + دهون.",
    },
    dosePediatric: { fr: "Mêmes doses mL/kg : bolus 1,5 mL/kg puis 0,25-0,5 mL/kg/min.", ar: "نفس الجرع مل/كغ: دفعة 1.5 مل/كغ ثم 0.25-0.5 مل/كغ/د." },
    dilution: { fr: "S'utilise pur (flacon 20 %). Ne pas mélanger avec d'autres solutés dans la même voie si possible.", ar: "يستعمل صافياً (قارورة 20%). لا يخلط مع محاليل أخرى بنفس الخط إن أمكن." },
    contraindications: {
      fr: "Allergie connue au soja/œuf (prudence, pas absolue en urgence vitale), troubles majeurs du métabolisme lipidique. Efficacité douteuse dans les intoxications hydrophiles (paracétamol, méthanol…).",
      ar: "حساسية صويا/بيض معلومة (حذر وليست مطلقة عند خطر الحياة)، اضطرابات استقلاب الشحوم. الفعالية مشكوك فيها بالتسممات مائية المحبة.",
    },
    sideEffects: { fr: "Hypertriglycéridémie, pancréatite, surcharge volémique, œdème pulmonaire, interférence avec les dosages sanguins (lipémie), syndrome de surcharge graisseuse (prolongé).", ar: "فرط شحوم الدم، التهاب بنكرياس، حمل حجمي، وذمة رئة، تداخل مع التحاليل (شحمية المصل)." },
    nursing: { fr: "Prélever les bilans toxico AVANT le bolus (la lipémie fausse les dosages). Surveiller triglycérides si perfusion > 1 h. Ligne veineuse dédiée.", ar: "اسحب العينات قبل الدفعة (الشحوم تفسد القياسات). راقب الشحوم إن تجاوز التسريب ساعة. خط وريدي مخصص." },
    storage: { fr: "T° ambiante, ne pas congeler, vérifier l'émulsion (pas de déphasage).", ar: "حرارة الغرفة، لا تجميد، تحقق من عدم انفصال المستحلب." },
    alternatives: [],
    meta: { sources: ["ACMT lipid emulsion 2017", "ASRA LAST 2020"], lastReviewed: "2026-09" },
  },
  {
    id: "nacl-hypertonique",
    name: { fr: "NaCl hypertonique 3 %", ar: "محلول ملحي مفرط التوتر 3%" },
    brands: "NaCl 3 % poche 250/500 mL ; à défaut : ampoules NaCl 20 % diluées par la pharmacie",
    synonyms: ["sérum salé hypertonique", "nacl 3%", "hypertonique", "ملح مفرط التوتر"],
    klass: { fr: "Soluté hypertonique — correction urgente de l'hyponatrémie symptomatique", ar: "محلول مفرط التوتر — تصحيح عاجل لنقص الصوديوم العرضي" },
    highRisk: true,
    indications: {
      fr: "Hyponatrémie sévère symptomatique (convulsions, coma, confusion) ; œdème cérébral traumatique (protocoles réa).",
      ar: "نقص صوديوم شديد عرضي (اختلاجات، غيبوبة، تشوش)؛ وذمة دماغية رضّية (بروتوكولات الإنعاش).",
    },
    doseAdult: {
      fr: "Hyponatrémie sévère : 150 mL IV en 20 min, répéter ×2 max selon Na⁺/clinique. Œdème cérébral : bolus 250 mL selon protocole réa.",
      ar: "نقص صوديوم شديد: 150 مل وريدي 20 د، تُعاد مرتين كحد أقصى حسب الصوديوم/السريري. وذمة دماغية: 250 مل حسب بروتوكول الإنعاش.",
    },
    dosePediatric: { fr: "2-3 mL/kg en bolus (max 100 mL) en 10-15 min sous surveillance rapprochée.", ar: "2-3 مل/كغ دفعة (أقصى 100 مل) خلال 10-15 د بمراقبة لصيقة." },
    dilution: {
      fr: "Poches prêtes à l'emploi préférées. À défaut : 100 mL de NaCl 0,9 % + 20 mL de NaCl 20 % ≈ 3,7 % (validation pharmacie). Voie centrale préférée ; voie périphérique possible en urgence (veine de bon calibre).",
      ar: "أكياس جاهزة أفضل. بديلها: 100 مل NaCl ‏0.9% + 20 مل NaCl ‏20% ≈ ‏3.7% (تصديق الصيدلية). يفضل الوريد المركزي؛ الطرفي جائز طارئاً (وريد عريض).",
    },
    contraindications: {
      fr: "Hyponatrémie asymptomatique (correction rapide inutile et dangereuse), hypernatrémie, surcharge hydrique sévère (OAP).",
      ar: "نقص صوديوم بلا أعراض (التصحيح السريع عبث وخطر)، فرط صوديوم، حمل مائي شديد (وذمة رئة).",
    },
    sideEffects: { fr: "Sur-correction ⇒ myélinolyse centro-pontine (paralysie, mutisme, coma), surcharge volémique, hyperchlorémie, phlébite.", ar: "تصحيح زائد ⇒ انحلال نخاعين الجسر (شلل، خرس، غيبوبة)، حمل حجمي، فرط كلور، التهاب وريد." },
    nursing: { fr: "Na⁺ toutes les 2-4 h pendant la correction. PLAFOND : ≤ 10 mmol/L/24 h (≤ 8 si haut risque). Tenir la fiche horaire de correction.", ar: "صوديوم كل 2-4 س أثناء التصحيح. السقف: ≤ 10 ملي مول/24 س (≤ 8 عند الخطر العالي). أمسك ورقة توقيت التصحيح." },
    storage: { fr: "T° ambiante.", ar: "حرارة الغرفة." },
    alternatives: ["furosemide"],
    meta: { sources: ["Guidelines européennes hyponatrémie 2014", "RE.NAU"], lastReviewed: "2026-09" },
  },
  {
    id: "propylthiouracil",
    name: { fr: "Propylthiouracile (PTU)", ar: "بروبيل ثيويوراسيل (PTU)" },
    brands: "PTU 50 mg comprimés (ou thiamazole/néomercazole 5-20 mg à défaut)",
    synonyms: ["ptu", "propylthiouracile", "propycile", "thiamazole", "néomercazole", "antithyroïdien", "بروبيل ثيويوراسيل"],
    klass: { fr: "Antithyroïdien de synthèse — bloque synthèse ET conversion périphérique T4→T3", ar: "مضاد درق صناعي — يحصر التصنيع والتحويل المحيطي T4→T3" },
    highRisk: true,
    indications: {
      fr: "Crise thyréotoxique (1er choix — effet anti-conversion) ; hyperthyroïdie sévère décompensée. 1er trimestre de grossesse préféré au thiamazole.",
      ar: "نوبة تسمم درقي (الخيار الأول — مضاد للتحويل)؛ فرط درق شديد منفك. الخيار الأول في الثلث الأول من الحمل.",
    },
    doseAdult: {
      fr: "Crise : charge 500-1000 mg PO/SNG puis 200-250 mg toutes les 4 h. Entretien hyperthyroïdie : 100-150 mg/j en 3 prises.",
      ar: "النوبة: تحميل 500-1000 ملغ فموياً/أنبوب ثم 200-250 ملغ كل 4 س. الصيانة: 100-150 ملغ/ي على 3 دفعات.",
    },
    dosePediatric: { fr: "Déconseillé chez l'enfant (hépatotoxicité) — thiamazole 0,5 mg/kg/j.", ar: "لا ينصح للأطفال (سمية كبدية) — ثيامازول 0.5 ملغ/كغ/ي." },
    dilution: {
      fr: "Comprimés écrasés en suspension (eau) pour la SNG. L'iode (Lugol) ne s'administre qu'UNE HEURE APRÈS la 1re dose.",
      ar: "أقراص مدقوقة بمعلق مائي للأنبوب. اليود (لوغول) يعطى بعد ساعة من الجرعة الأولى فقط.",
    },
    contraindications: {
      fr: "Agranulocytose connue, hépatopathie sévère, hypersensibilité. Grossesse 2e-3e trimestre : préférer thiamazole.",
      ar: "انعدام محببات معروف، مرض كبدي شديد، حساسية. حمل الثلثين 2-3: يفضل الثيامازول.",
    },
    sideEffects: { fr: "Agranulocytose (fièvre + angine = NFS urgente), hépatite (PTU > thiamazole), rash, arthralgies, hypothyroïdie iatrogène.", ar: "انعدام محببات (حمى + التهاب حلق = عد دم عاجل)، التهاب كبد، طفح، آلام مفصلية، قصور درق علاجي." },
    nursing: {
      fr: "NFS avant traitement puis à la moindre fièvre/angine. Bilan hépatique de base. En crise : voie entérale fiable (SNG si coma).",
      ar: "عد دم قبل العلاج وعند أي حمى/التهاب حلق. وظائف كبد أساسية. في النوبة: طريق معوي مضمون (أنبوب عند الغيبوبة).",
    },
    storage: { fr: "T° ambiante, à l'abri de l'humidité.", ar: "حرارة الغرفة بعيداً عن الرطوبة." },
    alternatives: ["propranolol"],
    meta: { sources: ["ATA thyréotoxicose 2016"], lastReviewed: "2026-09" },
  },
  {
    id: "propranolol",
    name: { fr: "Propranolol", ar: "بروبرانولول" },
    brands: "Hémipralon®/Avlocardyl® 40 mg cp ; Propranolol injectable 1 mg/mL",
    synonyms: ["propranolol", "avlocardyl", "hémipralon", "bêta-bloquant non sélectif", "بروبرانولول"],
    klass: { fr: "Bêta-bloquant non sélectif — antiarythmique, anti-ischémique, bloque la conversion T4→T3", ar: "حاصر بيتا غير انتقائي — مضاد لانظم ومضاد إقفاري ويحصر تحويل T4→T3" },
    highRisk: true,
    indications: {
      fr: "Crise thyréotoxique (contrôle FC + conversion périphérique) ; migraine avec aura avec triptans (prophylaxie) ; tachycardie sinusale symptomatique thyrotoxique.",
      ar: "نوبة تسمم درقي (ضبط النبض + التحويل المحيطي)؛ شقيقة مع هالة مع التريبتانات (وقاية)؛ تسرع جيبي عرضي درقي.",
    },
    doseAdult: {
      fr: "Crise thyréotoxique : 60-80 mg PO toutes les 6 h. IV (milieu monitoré) : 1 mg en 1 min, renouvelable toutes les 2-3 min jusqu'à 0,1 mg/kg (max 10 mg).",
      ar: "النوبة الدرقية: 60-80 ملغ فموياً كل 6 س. وريدياً (بمراقبة): 1 ملغ خلال دقيقة تُعاد كل 2-3 د حتى 0.1 ملغ/كغ (أقصى 10 ملغ).",
    },
    dosePediatric: { fr: "Avis spécialisé uniquement.", ar: "برأي مختص فقط." },
    dilution: {
      fr: "Forme IV : pur ou dilué dans NaCl 0,9 %, injection LENTE sous scope (bradycardie brutale possible).",
      ar: "الشكل الوريدي: صافٍ أو بمحلول ملحي، حقن بطيء تحت السكوب (بطء مباغت ممكن).",
    },
    contraindications: {
      fr: "Asthme/BPCO sévère, bradycardie < 50, BAV 2-3, choc, IC décompensée, phéochromocytome non alpha-bloqué. Prudence diabète (masque l'hypoglycémie).",
      ar: "ربو/انسداد رئوي شديد، بطء < 50، حصار 2-3، صدمة، قصور قلب منفك، ورم قواتم غير محصور ألفا. حذر بالسكري (يقنّع نقص السكر).",
    },
    sideEffects: { fr: "Bradycardie, hypotension, bronchospasme, asthénie, extrémités froides, cauchemars, hypoglycémies masquées.", ar: "بطء، هبوط، تشنج قصبي، وهن، برودة أطراف، كوابيس، نقص سكر مقنّع." },
    nursing: {
      fr: "FC + PA avant chaque dose (cible FC 80-90/min en crise thyréotoxique). Scope si IV. Ne jamais arrêter brutalement (rebond).",
      ar: "نبض وضغط قبل كل جرعة (الهدف 80-90 بالنوبة الدرقية). سكوب للوريدي. لا إيقاف مفاجئ (ارتداد).",
    },
    storage: { fr: "T° ambiante.", ar: "حرارة الغرفة." },
    alternatives: ["esmolol", "labetalol"],
    interactions: [
      { drug: "Vérapamil et diltiazem", severity: "high", description: { fr: "BAV et asystolie décrits en association IV — contre-indication fonctionnelle en urgence.", ar: "حصار أذيني بطيني ولا انقباض موصوفان معاً وريدياً — مضاد استطباب عملي في الطوارئ." } },
    ],
    meta: { sources: ["ATA 2016", "RE.NAU 2018"], lastReviewed: "2026-09" },
  },
  {
    id: "dexamethasone",
    name: { fr: "Dexaméthasone", ar: "ديكساميثازون" },
    brands: "Dectancyl® / Soludécadron® 4 mg/1 mL ; 20 mg/2 mL",
    synonyms: ["dexaméthasone", "dectancyl", "soludecadron", "corticoïde", "ديكساميثازون"],
    klass: { fr: "Corticoïde de synthèse longue durée — puissant anti-inflammatoire, sans interférence avec le dosage du cortisol", ar: "كورتيزون صناعي طويل الأمد — مضاد التهاب قوي دون تداخل مع قياس الكورتيزول" },
    highRisk: true,
    indications: {
      fr: "Crise surrénale si hydrocortisone indisponible (n'interfère pas avec le test au Synacthène) ; œdème cérébral tumoral ; œdème laryngé de l'enfant (laryngite) ; méningite bactérienne (avant la 1re ATB) ; antiémétique post-op.",
      ar: "نوبة كظرية عند غياب الهيدروكورتيزون (لا يتداخل مع اختبار السينكتن)؛ وذمة دماغية ورمية؛ وذمة حنجرية عند الطفل (خناق)؛ التهاب سحايا جرثومي (قبل أول مضاد)؛ مضاد إقياء بعد الجراحة.",
    },
    doseAdult: {
      fr: "Crise surrénale : 4 mg IV immédiate puis relais hydrocortisone. Œdème cérébral : 10 mg IV puis 4 mg/6 h. Laryngite enfant : 0,6 mg/kg PO/IM (max 16 mg). Méningite : 0,15 mg/kg/6 h × 4 j.",
      ar: "نوبة كظرية: 4 ملغ وريدي فوراً ثم تحويل لهيدروكورتيزون. وذمة دماغية: 10 ملغ ثم 4 ملغ/6 س. خناق الأطفال: 0.6 ملغ/كغ فموياً/عضلياً (أقصى 16). سحايا: 0.15 ملغ/كغ/6 س × 4 أيام.",
    },
    dosePediatric: { fr: "0,15-0,6 mg/kg selon indication (voir doses adulte détaillées).", ar: "0.15-0.6 ملغ/كغ حسب الاستطباب." },
    dilution: {
      fr: "IV directe lente ou dilution NaCl 0,9 %/G5 %. IM possible. Per os : comprimés ou solution buvable.",
      ar: "وريدي بطيء مباشر أو تخفيف بمحلول/غلوكوز. عضلي ممكن. فموياً أقراص أو شراب.",
    },
    contraindications: {
      fr: "Infection non contrôlée sans couverture (relative — la crise surrénale prime), hépatite virale aiguë, état psychotique aigu (prudence), vaccin vivant (hautes doses).",
      ar: "إنتان غير مضبوط دون تغطية (نسبي — النوبة الكظرية أولى)، التهاب كبد فيروسي حاد، ذهان حاد (حذر)، لقاح حي (جرع عالية).",
    },
    sideEffects: {
      fr: "Hyperglycémie, HTA, agitation/insomnie, hypokaliémie, ulcère gastrique (prolongé), immunosuppression, insuffisance surrénale au sevrage brutal.",
      ar: "فرط سكر، ارتفاع ضغط، هياج/أرق، نقص بوتاسيوم، قرحة (مطول)، كبت مناعة، قصور كظري عند القطع المفاجئ.",
    },
    nursing: {
      fr: "Glycémie capillaire régulière (surtout diabétiques). Couvrir l'estomac si cure prolongée. Ne pas arrêter brutalement après > 7 jours de fortes doses.",
      ar: "سكر شعيري منتظم (خصوصاً للسكريين). حماية معدة بالعلاج المطول. لا قطع مفاجئ بعد > 7 أيام بجرع عالية.",
    },
    storage: { fr: "T° ambiante, à l'abri de la lumière.", ar: "حرارة الغرفة بعيداً عن الضوء." },
    alternatives: ["hydrocortisone"],
    meta: { sources: ["Endocrine Society 2016", "RE.NAU 2018"], lastReviewed: "2026-09" },
  },
];

// Glossaire des abréviations médicales — cliquables dans tout le site (AbbrTooltip).
import type { Localized } from "@/data/types";

export interface AbbrEntry {
  abbr: string;
  full: Localized;      // développement
  detail: Localized;    // explication terrain
}

export const ABBREVIATIONS: AbbrEntry[] = [
  { abbr: "TA", full: { fr: "Tension artérielle", ar: "ضغط الدم الشرياني" }, detail: { fr: "Exprimée PAS/PAD en mmHg (ex. 120/80). Normale : 90–140 / 60–90.", ar: "يُعبَّر عنه بالانقباضي/الانبساطي ملم زئبق. الطبيعي: 90–140 / 60–90." } },
  { abbr: "PAS", full: { fr: "Pression artérielle systolique", ar: "الضغط الانقباضي" }, detail: { fr: "Le chiffre haut. < 90 = hypotension.", ar: "الرقم الأعلى. < 90 = انخفاض ضغط." } },
  { abbr: "PAD", full: { fr: "Pression artérielle diastolique", ar: "الضغط الانبساطي" }, detail: { fr: "Le chiffre bas.", ar: "الرقم الأدنى." } },
  { abbr: "PAM", full: { fr: "Pression artérielle moyenne", ar: "الضغط الشرياني المتوسط" }, detail: { fr: "PAM = (PAS + 2×PAD) / 3. Cible réanimation ≥ 65 mmHg.", ar: "= (انقباضي + 2×انبساطي)/3. هدف الإنعاش ≥ 65." } },
  { abbr: "FC", full: { fr: "Fréquence cardiaque", ar: "معدل ضربات القلب" }, detail: { fr: "Normale : 60–100/min.", ar: "الطبيعي: 60–100/دقيقة." } },
  { abbr: "FR", full: { fr: "Fréquence respiratoire", ar: "معدل التنفس" }, detail: { fr: "Normale : 12–20/min. > 22 = signe d'alerte.", ar: "الطبيعي: 12–20/د. > 22 = علامة إنذار." } },
  { abbr: "SpO2", full: { fr: "Saturation pulsée en oxygène", ar: "تشبع الأكسجين النبضي" }, detail: { fr: "Cible 94–98 % (88–92 % en BPCO). < 90 % = urgence.", ar: "الهدف 94–98% (88–92% في الانسداد المزمن). < 90% = طارئ." } },
  { abbr: "GCS", full: { fr: "Glasgow Coma Scale", ar: "مقياس غلاسكو للغيبوبة" }, detail: { fr: "Score de conscience 3–15 (yeux+verbal+moteur). ≤ 8 = intubation à discuter.", ar: "درجة الوعي 3–15. ≤ 8 = فكّر بالتنبيب." } },
  { abbr: "NIHSS", full: { fr: "National Institutes of Health Stroke Scale", ar: "مقياس NIH للجلطة" }, detail: { fr: "Score de sévérité d'AVC 0–42. Voir le calculateur.", ar: "درجة شدة الجلطة 0–42. انظر الحاسبة." } },
  { abbr: "ECG", full: { fr: "Électrocardiogramme", ar: "تخطيط القلب الكهربائي" }, detail: { fr: "12 dérivations < 10 min si douleur thoracique.", ar: "12 استنتاجاً خلال 10 د لألم الصدر." } },
  { abbr: "RCP", full: { fr: "Réanimation cardio-pulmonaire", ar: "الإنعاش القلبي الرئوي" }, detail: { fr: "Compressions 100–120/min, 5–6 cm.", ar: "ضغطات 100–120/د، عمق 5–6 سم." } },
  { abbr: "ACR", full: { fr: "Arrêt cardiaque", ar: "توقف القلب" }, detail: { fr: "Absence de pouls + respiration inefficace → RCP immédiate.", ar: "لا نبض + تنفس غير فعال ← إنعاش فوري." } },
  { abbr: "ROSC", full: { fr: "Retour d'activité circulatoire spontanée", ar: "استعادة الدوران التلقائي" }, detail: { fr: "Pouls présent après ACR. Repositionner la prise en charge.", ar: "نبض حاضر بعد التوقف." } },
  { abbr: "DAE / DEA", full: { fr: "Défibrillateur automatisé externe", ar: "مزيل الرجفان الآلي الخارجي" }, detail: { fr: "Analyse automatique ± conseil de choc.", ar: "تحليل آلي ± نصيحة الصعق." } },
  { abbr: "VVP", full: { fr: "Voie veineuse périphérique", ar: "خط وريدي محيطي" }, detail: { fr: "Cathéter gros calibre (14–16 G vert/gris) en urgence.", ar: "قسطرة عريضة (14–16) في الطوارئ." } },
  { abbr: "IV / IO", full: { fr: "Intraveineuse / intra-osseuse", ar: "وريدي / داخل النقي" }, detail: { fr: "IO (genou/humérus) si impossible par voie veineuse en ACR.", ar: "داخل النقي إذا استحال الوريدي في التوقف." } },
  { abbr: "IM / SC / PO", full: { fr: "Intramusculaire / sous-cutanée / per os", ar: "عضلي / تحت الجلد / فموي" }, detail: { fr: "Voies d'administration.", ar: "طرق إعطاء الدواء." } },
  { abbr: "PSE", full: { fr: "Pousse-seringue électrique", ar: "مضخة الحقن الكهربائية" }, detail: { fr: "Appareil de perfusion précise (amines, héparine).", ar: "جهاز تسريب دقيق (الأمينات، الهيبارين)." } },
  { abbr: "EtCO2", full: { fr: "Capnographie (CO₂ expiré)", ar: "قياس ثاني أكسيد الكربون الزفيري" }, detail: { fr: "Confirme l'intubation + qualité RCP (cible > 10–20).", ar: "يؤكد التنبيب + يقيس جودة الإنعاش." } },
  { abbr: "ABCDE", full: { fr: "Airway, Breathing, Circulation, Disability, Exposure", ar: "مجرى هوائي، تنفس، دوران، وعي، كشف" }, detail: { fr: "Examen primaire de tout patient grave.", ar: "الفحص الأولي لكل مريض خطير." } },
  { abbr: "PLS", full: { fr: "Position latérale de sécurité", ar: "وضعية الأمان الجانبية" }, detail: { fr: "Inconscient qui respire → side.", ar: "فاقد الوعي المتنفس ← على جنبه." } },
  { abbr: "AVC", full: { fr: "Accident vasculaire cérébral", ar: "جلطة دماغية" }, detail: { fr: "FAST : Face, Arm, Speech, Time.", ar: "FAST: وجه، ذراع، كلام، وقت." } },
  { abbr: "SCA", full: { fr: "Syndrome coronarien aigu", ar: "متلازمة الشريان التاجي الحادة" }, detail: { fr: "STEMI si sus-ST ; sinon NSTEMI/instable.", ar: "STEMI إذا ارتفاع ST؛ وإلا NSTEMI." } },
  { abbr: "STEMI", full: { fr: "SCA avec sus-décalage du ST", ar: "احتشاء بارتفاع مقطع ST" }, detail: { fr: "Occlusion artérielle → PCI < 120 min.", ar: "انسداد الشريان ← قسطرة < 120 د." } },
  { abbr: "NSTEMI", full: { fr: "SCA sans sus-décalage du ST", ar: "احتشاء بلا ارتفاع ST" }, detail: { fr: "Décision invasive selon troponine/GRACE.", ar: "قرار القسطرة حسب التروبونين/GRACE." } },
  { abbr: "OAP", full: { fr: "Œdème aigu du poumon", ar: "وذمة الرئة الحادة" }, detail: { fr: "Insuffisance cardiaque gauche aiguë.", ar: "قصور قلب أيسر حاد." } },
  { abbr: "EP", full: { fr: "Embolie pulmonaire", ar: "صمة رئوية" }, detail: { fr: "Dyspnée + douleur latéro-thoracique ± tachycardie.", ar: "ضيق تنفس + ألم جنبي ± تسرع قلب." } },
  { abbr: "TVP", full: { fr: "Thrombose veineuse profonde", ar: "خثار وريدي عميق" }, detail: { fr: "Mollet douloureux gonflé → source d'EP.", ar: "سمانة مؤلمة منتفخة ← مصدر الصمة." } },
  { abbr: "FAST", full: { fr: "Face, Arm, Speech, Time (dépistage AVC)", ar: "وجه، ذراع، كلام، زمن — كشف الجلطة" }, detail: { fr: "Un seul signe = appeler le 190 immédiatement.", ar: "علامة واحدة = اتصل بـ190 فوراً." } },
  { abbr: "VVO2 / O2", full: { fr: "Oxygénothérapie", ar: "الأكسجين" }, detail: { fr: "HDF = haut débit 15 L/min masque + réserve.", ar: "التدفق العالي = 15 ل/د بقناع + خزان." } },
  { abbr: "HDF", full: { fr: "Haut débit (O₂ 15 L/min)", ar: "تدفق عالٍ (أكسجين 15 ل/د)" }, detail: { fr: "Masque haute concentration + poche réserve.", ar: "قناع عالي التركيز مع خزان." } },
  { abbr: "VNI", full: { fr: "Ventilation non invasive", ar: "تهوية غير اجتراحية" }, detail: { fr: "Masque CPAP/BIPAP sans sonde. Réduit l'intubation en BPCO/OAP.", ar: "قناع ضغط بلا أنبوب. تقلل التنبيب في OAP/BPCO." } },
  { abbr: "CPAP", full: { fr: "Pression positive continue", ar: "ضغط إيجابي مستمر" }, detail: { fr: "Forme de VNI : un seul niveau de pression.", ar: "نمط VNI بمستوى ضغط واحد." } },
  { abbr: "BIPAP", full: { fr: "Ventilation à deux niveaux de pression", ar: "تهوية بمستويي ضغط" }, detail: { fr: "Aide inspiratoire + expiratoire (hypercapnie).", ar: "مساعدة شهيق + زفير (فرط CO₂)." } },
  { abbr: "HNF / HBPM", full: { fr: "Héparine non fractionnée / bas poids moléculaire", ar: "هيبارين غير مجزأ / منخفض الوزن الجزيئي" }, detail: { fr: "HNF = IV (PSE) ; HBPM = SC (Lovenox®) — plus simple.", ar: "غير المجزأ وريدي بالمضخة؛ المنخفض تحت الجلد أبسط." } },
  { abbr: "TCA", full: { fr: "Temps de céphaline activé", ar: "زمن السيفالين المفعل" }, detail: { fr: "Surveillance de l'héparine IV : cible 1,5–2,5× témoin.", ar: "مراقبة الهيبارين الوريدي: هدف 1.5–2.5× المرجع." } },
  { abbr: "INR", full: { fr: "International Normalized Ratio", ar: "نسبة التخثر المعيارية" }, detail: { fr: "Surveillance des AVK ; cible 2–3 (FA).", ar: "مراقبة مضادات فيتامين K؛ الهدف 2–3 في الرجفان." } },
  { abbr: "AVK", full: { fr: "Antivitamines K", ar: "مضادات فيتامين K" }, detail: { fr: "Sintrom®, Préviscan®...", ar: "سينتروم، بريفيسكان..." } },
  { abbr: "NSAID", full: { fr: "Anti-inflammatoires non stéroïdiens (AINS)", ar: "مضادات التهاب لا ستيرويدية" }, detail: { fr: "Ibuprofène, kétoprofène — attention rein/saignement.", ar: "إيبوبروفين، كيتوبروفين — انتبه للكلية والنزيف." } },
  { abbr: "AINS", full: { fr: "Anti-inflammatoires non stéroïdiens", ar: "مضادات الالتهاب اللاستيرويدية" }, detail: { fr: "Contre-indiqués : grossesse, IRC, ulcère, anticoagulation.", ar: "مضادة في: الحمل، القصور الكلوي، القرحة، مضادات التخثر." } },
  { abbr: "IRC", full: { fr: "Insuffisance rénale chronique", ar: "قصور كلوي مزمن" }, detail: { fr: "Adapter doses (AAG, héparine, aminos...).", ar: "عايِر الجرعات (مضادات حيوية، هيبارين...)." } },
  { abbr: "IRA", full: { fr: "Insuffisance rénale aiguë", ar: "قصور كلوي حاد" }, detail: { fr: "Arrêt fonctionnel brutal → surveillance K+, créat.", ar: "توقف وظيفي مفاجئ ← راقب K والكرياتينين." } },
  { abbr: "CK", full: { fr: "Créatine kinase", ar: "كرياتين كيناز" }, detail: { fr: "Enzyme musculaire — rhabdomyolyse si élevée.", ar: "إنزيم عضلي — تحلل العضلات إن مرتفع." } },
  { abbr: "ACD", full: { fr: "Acido-cétose diabétique", ar: "حماض كيتوني سكري" }, detail: { fr: "Glycémie élevée + pH < 7,3 + cétones.", ar: "سكر مرتفع + pH < 7.3 + كيتونات." } },
  { abbr: "Covid", full: { fr: "Infection à SARS-CoV-2", ar: "عدوى كوفيد" }, detail: { fr: "Protéger l'équipe++ : FFP2, lunettes.", ar: "احمِ الطاقم: FFP2 ونظارات." } },
  { abbr: "NFS", full: { fr: "Numération formule sanguine", ar: "تعداد الدم الكامل" }, detail: { fr: "Hb, plaquettes, globules blancs (infection/saignement).", ar: "هيموغلوبين، صفيحات، كريات بيض." } },
  { abbr: "CRP", full: { fr: "Protéine C réactive", ar: "بروتين سي التفاعلي" }, detail: { fr: "Marqueur inflammatoire/infectieux.", ar: "مؤشر التهابي/عدوائي." } },
];

export function getAbbr(key: string): AbbrEntry | undefined {
  return ABBREVIATIONS.find((a) => a.abbr.toLowerCase() === key.toLowerCase());
}

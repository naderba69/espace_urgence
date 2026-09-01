import type { Localized, ReviewMeta } from "./types";

// Référence ECG — tracés SVG générés (see components/ECGTrace.tsx), caractéristiques et conduite.
export type EcgKind =
  | "sinus" | "tachysinus" | "bradysinus" | "fa" | "flutter"
  | "tv" | "torsades" | "fv" | "bav3" | "stemi" | "asystolie";

export interface EcgRhythm {
  id: string;
  title: Localized;
  kind: EcgKind;
  caracteristiques: Localized;   // ce qu'on voit sur le tracé
  conduite: Localized;           // conduite en urgence
  meta: ReviewMeta;
}

export const ecgRhythms: EcgRhythm[] = [
  {
    id: "rythme-sinusal",
    title: { fr: "Rythme sinusal normal", ar: "إيقاع جيبي طبيعي" },
    kind: "sinus",
    caracteristiques: { fr: "FC 60–100/min, régulier ; onde P avant chaque QRS, PR 120–200 ms, QRS <120 ms.", ar: "نبض 60–100/د منتظم؛ موجة P قبل كل QRS، PR 120–200، QRS <120 مللي ث." },
    conduite: { fr: "Normal — corréler à la clinique.", ar: "طبيعي — قارن بالسريرية." },
    meta: { sources: ["AHA ECG basics"], lastReviewed: "2026-08" },
  },
  {
    id: "tachycardie-sinusale",
    title: { fr: "Tachycardie sinusale", ar: "تسرع جيبي" },
    kind: "tachysinus",
    caracteristiques: { fr: "FC >100/min, régulier, P avant QRS, P identiques au sinus.", ar: "نبض >100/د منتظم، P طبيعية قبل كل QRS." },
    conduite: { fr: "Traiter la cause (douleur, fièvre, hypovolémie, hyperthyroïdie…) ; pas d'antiarythmique en systole.", ar: "عالج السبب؛ لا مضاد نظم هنا." },
    meta: { sources: ["AHA 2025"], lastReviewed: "2026-08" },
  },
  {
    id: "bradycardie-sinusale",
    title: { fr: "Bradycardie sinusale", ar: "بطء جيبي" },
    kind: "bradysinus",
    caracteristiques: { fr: "FC <60/min régulier, P + PR constants.", ar: "نبض <60/د منتظم، P وPR ثابتان." },
    conduite: { fr: "Si symptomatique (malaise, hypoTA, sueurs) : atropine 1 mg IV, répétable max 3 mg ; adrénaline/dopamine PSE ou acélérateur si échec.", ar: "إن عرضي: أتروبين 1 ملغ وريد تُعاد (أقصى 3)؛ ثم أمين أو تسريع خارجي." },
    meta: { sources: ["AHA ACLS bradycardie 2025"], lastReviewed: "2026-08" },
  },
  {
    id: "fibrillation-auriculaire",
    title: { fr: "Fibrillation auriculaire (FA)", ar: "ارتعاش أذيني" },
    kind: "fa",
    caracteristiques: { fr: "Régulièrement irrégulier, pas de P, baseline ondulée (f), QRS fins.", ar: "عدم انتظام دائم، بلا موجة P، خط قاعدي متموج، QRS ضيّق." },
    conduite: { fr: "Stable : contrôle fréquence/anticoag. INSTABLE : cardioversion électrique synchronisée (sédation) — prioritaire.", ar: "مستقر: ضبط النبض+تسييل. غير مستقر: صدمة متزامنة مع تهدئة — أولوية." },
    meta: { sources: ["AHA/ACC AF 2023", "ERC 2021"], lastReviewed: "2026-08" },
  },
  {
    id: "flutter",
    title: { fr: "Flutter auriculaire", ar: "رفرفة أذينية" },
    kind: "flutter",
    caracteristiques: { fr: "Ondes F en « dents de scie » ~300/min ; conduite 2:1 fréquente (FC ~150).", ar: "أمواج F منشار ~300/د؛ توصيل 2:1 شائع (نبض ~150)." },
    conduite: { fr: "Comme la FA ; adénosine peut démasquer le flutter (diagnostique, ne l'arrête pas).", ar: "كالارتعاش؛ الأدينوزين يكشفه (تشخيصي ولا يوقفه)." },
    meta: { sources: ["ESC SVT 2019"], lastReviewed: "2026-08" },
  },
  {
    id: "tv-sans-pouls",
    title: { fr: "Tachycardie ventriculaire", ar: "تسرع بطيني" },
    kind: "tv",
    caracteristiques: { fr: "QRS larges >120 ms réguliers, FC 120–250 ; avec ou sans pouls.", ar: "QRS عريض >120 منتظم، نبض 120–250؛ بنبض أو بدونه." },
    conduite: { fr: "SANS POULS = algorithme ACR (choc 120–200 J + adrénaline/amiodarone). Avec pouls stable : amiodarone 150 mg/10 min ; instable : cardioversion synchronisée.", ar: "بلا نبض = بروتوكول الإنعاش. بنبض مستقر: أميودارون 150 ملغ/10 د؛ غير مستقر: صدمة متزامنة." },
    meta: { sources: ["AHA ACLS 2025"], lastReviewed: "2026-08" },
  },
  {
    id: "torsades",
    title: { fr: "Torsades de pointes", ar: "تورساد دو بوينت" },
    kind: "torsades",
    caracteristiques: { fr: "TV polymorphe en « tourbillon » d'amplitude variable, sur QT long.", ar: "تسرع متعدد الأشكال متموّج على QT طويل." },
    conduite: { fr: "MgSO4 1–2 g IV ; si sans pouls → défibrillation. Corriger K/Mg, stopper les allongeurs du QT.", ar: "كبريتات مغنيزيوم 1–2 غ؛ بلا نبض ← صدمة. صحّح K/Mg وأوقف مُطيلات QT." },
    meta: { sources: ["AHA 2025", "ERC 2021"], lastReviewed: "2026-08" },
  },
  {
    id: "fv",
    title: { fr: "Fibrillation ventriculaire", ar: "رجفان بطيني" },
    kind: "fv",
    caracteristiques: { fr: "Signaux chaotiques, pas de QRS identifiable, pas de pouls = ACR.", ar: "إشارات فوضوية بلا QRS وبلا نبض = توقف قلب." },
    conduite: { fr: "RCP immédiate + DÉFIBRILLATION la plus précoce possible (120–200 J biphasique) ; adrénaline après 3e choc.", ar: "إنعاش فوري + صدمة بأسرع وقت (120–200 جول)؛ أدرنالين بعد الثالثة." },
    meta: { sources: ["AHA ACLS 2025", "ERC 2021"], lastReviewed: "2026-08" },
  },
  {
    id: "bav3",
    title: { fr: "Bloc AV complet (3e degré)", ar: "حصار أذيني بطيني كامل" },
    kind: "bav3",
    caracteristiques: { fr: "P et QRS indépendants (dissociation AV) ; échappement 20–50/min.", ar: "P وQRS مستقلان (انفصام)؛ إيقاع هروب 20–50/د." },
    conduite: { fr: "Symptomatique : acélérateur externe en attendant transthoracique ; atropine souvent inefficace (bloc infra-hisien).", ar: "عرضي: تسريع خارجي؛ الأتروبين غالباً غير فعالة." },
    meta: { sources: ["AHA bradycardies", "ESC pacing"], lastReviewed: "2026-08" },
  },
  {
    id: "stemi",
    title: { fr: "SCA avec sus-décalage du ST (STEMI)", ar: "احتشاء بارتفاع ST" },
    kind: "stemi",
    caracteristiques: { fr: "Sus-ST ≥1 mm dans ≥2 dérivations contiguës (seuils âge/sexe), ± onde Q, T hyperaiguë.", ar: "ارتفاع ST ≥1 مم باشتقاقين متجاورين على الأقل ± موجة Q." },
    conduite: { fr: "Angioplastie primaire <120 min ; aspirine + P2Y12 + anticoagulant ; douleur : morphine titrée.", ar: "قسطرة أولية <120 د؛ أسبرين + P2Y12 + تسييل؛ مورفين معايَر للألم." },
    meta: { sources: ["ESC STEMI 2023"], lastReviewed: "2026-08" },
  },
  {
    id: "asystolie",
    title: { fr: "Asystolie", ar: "انعدام تقلص" },
    kind: "asystolie",
    caracteristiques: { fr: "Ligne quasi-plate (vérifier 2 dérivations, gain, connexions).", ar: "خط شبه مسطّح (تحقق باشتقاقين والتضخيم والتوصيل)." },
    conduite: { fr: "Non choquable : RCP + adrénaline 1 mg toutes les 3–5 min, causes réversibles (5H/5T).", ar: "غير قابلة للصدم: إنعاش + أدرنالين 1 ملغ كل 3–5 د + أسباب عكوسة." },
    meta: { sources: ["AHA ACLS 2025"], lastReviewed: "2026-08" },
  },
];

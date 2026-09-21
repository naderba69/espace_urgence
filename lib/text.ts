// وحدة نصية خفيفة بلا أي تبعية على البيانات الطبية.
// الغرض: استعمالها في صفحات القوائم (الأدوية/البروتوكولات) دون سحب فهرس البحث
// الكامل إلى الحزمة المشتركة. (تحسين أداء v17.0)
//
// Unité texte SANS dépendance aux données médicales : permet aux pages de listes
// de normaliser une requête sans embarquer l'index de recherche complet.

/**
 * Normalisation pour comparaison insensible aux accents (latin) et aux variantes
 * orthographiques arabes (alif, ta marbuta, tashkeel, alif maqsoura).
 * تطبيع النص: حذف الحركات والتشكيل وتوحيد أشكال الألف والتاء المربوطة.
 */
export function normalize(s: string): string {
  return (
    s
      .toLowerCase()
      // Ligatures françaises : NFD ne les décompose pas (Œdème, œsophage, æ).
      .replace(/\u0153/g, "oe")
      .replace(/\u00e6/g, "ae")
      .normalize("NFD")
      // v17.0 — accents latins ET diacritiques arabes dans la MÊME passe :
      // NFD décompose أ/إ/آ/ٱ en (ا + hamza/madda suscrite). Sans le retrait de
      // U+064B–U+065F, la hamza survit et « أدرينالين » ne matchait jamais
      // « ادرينالين » → la recherche arabe échouait sur ces mots. (corrigé en v17.0)
      .replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, "")
      // Filet de sécurité pour les formes précomposées non décomposées : ا آ أ إ ٱ
      .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
      .replace(/\u0629/g, "\u0647") // ة → ه
      .replace(/\u0649/g, "\u064a") // ى → ي
      .replace(/\u0640/g, "") // tatweel / التطويل
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Synonymes bidirectionnels courants (clés et valeurs déjà normalisées).
 * مرادفات ثنائية الاتجاه: تجاري ↔ علمي ↔ عربي (كل المفاتيح مطبَّعة).
 * القاعدة: لا نضيف رموزًا قصيرة (٢–٣ حروف) لأن المطابقة جزئية وتُحدث ضجيجًا.
 */
export const SYNONYMS: Record<string, string[]> = {
  // ── Adrénaline / épinéphrine (les deux dénominations internationales) ──
  adrenaline: ["epinephrine"],
  epinephrine: ["adrenaline"],
  // ── Réanimation cardio-pulmonaire ──
  rcp: ["cpr", "reanimation", "massage", "cardiaque", "انعاش"],
  cpr: ["rcp", "reanimation", "cardiaque"],
  // ── Scores et échelles ──
  glasgow: ["gcs", "coma", "غلاسكو"],
  gcs: ["glasgow", "coma"],
  // ── Neurologie ──
  avc: ["stroke", "cerebral", "جلطه"],
  stroke: ["avc", "cerebral"],
  // ── Noms commerciaux tunisiens fréquents ↔ DCI ──
  narcan: ["naloxone", "نالوكسون"],
  naloxone: ["narcan"],
  lasilix: ["furosemide", "فوروسيميد"],
  furosemide: ["lasilix"],
  hypnovel: ["midazolam", "ميدازولام"],
  midazolam: ["hypnovel"],
  // ── Vocabulaire de terrain / plaintes ──
  anaphylaxie: ["allergie", "choc", "انفيلاكسي", "تحسس"],
  allergie: ["anaphylaxie", "تحسس"],
  choc: ["shock", "صدمه", "انهيار"],
  perfusion: ["gouttes", "debit", "serum", "تدفق", "محلول"],
  debut: ["debit"], // faute de frappe courante pour « débit »
  iot: ["intubation", "entubation", "تنبيب"],
  intubation: ["iot", "entubation", "تنبيب"],
  // ── Cardiologie ──
  sca: ["stemi", "nstemi", "infarctus", "احتشاء"],
  stemi: ["sca", "infarctus", "احتشاء"],
  infarctus: ["sca", "stemi", "احتشاء"],
  fibrillation: ["arythmie", "fa", "رجفان"],
  tachycardie: ["arythmie", "تسرع"],
  bradycardie: ["arythmie", "تباطو"],
  // ── Obstétrique ──
  hpp: ["hemorragie", "postpartum", "نزف", "ولاده"],
  preeclampsie: ["eclampsie", "magnesium", "ماقنيزيوم", "تسمم الحمل"],
  eclampsie: ["preeclampsie", "magnesium", "تسمم الحمل"],
  // ── Pédiatrie ──
  pals: ["pediatrie", "enfant", "اطفال"],
  pediatrie: ["enfant", "nourrisson", "اطفال", "رضيع"],
  // ── Toxicologie ──
  opioides: ["morphine", "fentanyl", "افيونيات"],
  organophosphores: ["insecticide", "pesticide", "فوسفات"],
  // ── Divers ──
  hyperkaliemie: ["potassium", "kaliemie", "بوتاسيوم"],
  kaliemie: ["potassium", "بوتاسيوم"],
  deshydratation: ["rehydratation", "sro", "جفاف"],
  brulure: ["brule", "brulures", "حرق", "حروق"],
};

/** Étend un jeton normalisé avec ses synonymes. توسيع الكلمة بمرادفاتها. */
export function expand(token: string): string[] {
  return [token, ...(SYNONYMS[token] ?? [])];
}

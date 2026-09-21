// v17.0 — Compteurs de contenu, exposés à part pour que la page d'accueil n'ait pas
// à importer les bases complètes (12 fichiers de protocoles + 11 de médicaments,
// soit ~900 Ko de JS brut) uniquement pour afficher « 98 » et « 73 ».
//
// عدّادات المحتوى: منفصلة حتى لا تستورد الصفحة الرئيسية كل قواعد البيانات
// لعرض أرقام فقط. الحراسة: __tests__/data.test.ts يقارن هذه القيم بالطول الحقيقي.
//
// ⚠️ Toute addition de contenu doit être répercutée ici (le test garde-fou échoue sinon).
export const COUNTS = {
  protocols: 98,
  medications: 73,
  calculators: 131,
  checklists: 3,
  procedures: 9,
  ecg: 11,
  trees: 9,
  guidage: 41,
  triage: 22,
  perfusions: 28,
  quiz: 42,
} as const;

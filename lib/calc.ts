// Fonctions de calcul pures — TESTÉES (vitest). Toute logique de dose/débit/score vit ici.
// Ne jamais écrire d'arithmétique posologique directement dans un composant.

/** Dose par poids avec plafond. */
export function clampDose(mgPerKg: number, weightKg: number, maxMg: number): number {
  if (weightKg <= 0 || mgPerKg <= 0) return 0;
  return Math.min(mgPerKg * weightKg, maxMg);
}

/** Débit de perfusion : mL/h, gouttes/min et intervalle inter-goutte (s). */
export function dripRate(volumeMl: number, hours: number, dropsPerMl: 20 | 60) {
  if (volumeMl <= 0 || hours <= 0) return { mlh: 0, gttMin: 0, secPerDrop: NaN };
  const mlh = volumeMl / hours;
  const gttMin = (volumeMl * dropsPerMl) / (hours * 60);
  return { mlh, gttMin, secPerDrop: gttMin > 0 ? 60 / gttMin : NaN };
}

/** Parkland : 4 mL × kg × %SC sur 24 h — moitié sur les 8 premières heures (depuis la brûlure). */
export function parkland(weightKg: number, tbsaPct: number) {
  const total24 = 4 * weightKg * tbsaPct;
  return { total24, first8h: total24 / 2, next16h: total24 / 2 };
}

/** Débits Parkland selon le temps déjà écoulé depuis la brûlure. */
export function parklandRates(weightKg: number, tbsaPct: number, elapsedHours: number) {
  const { first8h, next16h } = parkland(weightKg, tbsaPct);
  const remainingFirst = Math.max(8 - Math.max(elapsedHours, 0), 0);
  return {
    first8h,
    next16h,
    remainingFirst,
    firstRate: remainingFirst > 0 ? first8h / remainingFirst : 0,
    secondRate: next16h / 16,
  };
}

/** Concentration d'une seringue (mg → µg/mL). */
export function concUgPerMl(mg: number, volumeMl: number): number {
  return volumeMl > 0 ? (mg * 1000) / volumeMl : 0;
}

/** Débit PSE (mL/h) à µg/kg/min : (dose × poids × 60) / concentration(µg/mL). */
export function amineFlow(doseUgKgMin: number, weightKg: number, mg: number, volumeMl: number): number {
  const c = concUgPerMl(mg, volumeMl);
  if (doseUgKgMin <= 0 || weightKg <= 0 || c <= 0) return 0;
  return (doseUgKgMin * weightKg * 60) / c;
}

/** Poids pédiatrique estimé (formule de APLS) : (âge × 2) + 8. Valable ~1–14 ans. */
export function pediatricWeight(ageYears: number): number {
  return ageYears * 2 + 8;
}

/** Taille de sonde trachéale non armée : âge/4 + 4. */
export function pediatricTubeSize(ageYears: number): number {
  return ageYears / 4 + 4;
}

/** Charge de défibrillation pédiatrique : 4 J/kg, plafond repère 200 J. */
export function pediatricDefibJ(weightKg: number): number {
  return Math.min(4 * weightKg, 200);
}

/** Poids idéal (formule de Devine) — la ventilation protectrice se cale sur IBW. */
export function ibwKg(heightCm: number, sex: "m" | "f"): number {
  const base = sex === "m" ? 50 : 45.5;
  return base + 0.91 * (heightCm - 152.4);
}

/** Fourchette de volume courant protecteur 6–8 mL/kg IBW. */
export function tidalVolumeRange(ibw: number): [number, number] {
  return [Math.round(ibw * 6), Math.round(ibw * 8)];
}

/** CURB-65 : 0–5, puis classe de conduite. */
export function curb65Outcome(score: number): 0 | 1 | 2 {
  if (score <= 1) return 0;
  if (score === 2) return 1;
  return 2;
}

/** Wells EP (2 niveaux) : >4 = probable. */
export function wellsEpLikely(score: number): boolean {
  return score > 4;
}

/** HAS-BLED : ≥3 = risque hémorragique élevé (PAS une contre-indication — resserrer le suivi). */
export function hasBledHighRisk(score: number): boolean {
  return score >= 3;
}

/** NIHSS : borne de sévérité. */
export function nihssBand(score: number): 0 | 1 | 2 | 3 | 4 {
  if (score === 0) return 0;       // pas de déficit mesuré
  if (score <= 4) return 1;        // mineur
  if (score <= 15) return 2;       // modéré
  if (score <= 20) return 3;       // modéré-sévère
  return 4;                        // sévère
}

/**
 * Hyponatrémie — Adrogué-Madias : variation attendue du Na sérique par litre d'infusat.
 * ΔNa = (Na_infusat + K_infusat − Na_sérique) / (EauTotale + 1)
 */
export function adrogueMadias(serumNa: number, infusateNa: number, infusateK: number, totalBodyWaterL: number): number {
  return (infusateNa + infusateK - serumNa) / (totalBodyWaterL + 1);
}

/** Eau corporelle totale : 60 % poids (H), 50 % (F) — −5 pts chez le sujet âgé. */
export function totalBodyWater(weightKg: number, factor: number): number {
  return weightKg * factor;
}

/** Débit max (mL/h) pour ne pas dépasser le taux de correction cible (ex. 0,5 mmol/L/h → ≤10/24 h). */
export function maxCorrectionRate(deltaNaPerLiter: number, targetPerHour = 0.5): number {
  if (deltaNaPerLiter <= 0) return 0;
  return (targetPerHour / deltaNaPerLiter) * 1000;
}

/** Héparine : bolus U/kg (plafonné) + débit initial U/kg/h → mL/h selon concentration. */
export function heparin(weightKg: number, bolusPerKg = 80, maxBolusU = 8000, infusionPerKgH = 18, unitsPerMl = 100) {
  const bolusU = Math.min(weightKg * bolusPerKg, maxBolusU);
  const rateUh = weightKg * infusionPerKgH;
  return { bolusU, rateUh, rateMlH: unitsPerMl > 0 ? rateUh / unitsPerMl : 0 };
}

/**
 * ACD (acido-cétose diabétique) — ADA :
 * - bolus IV optionnel 0,1 U/kg, puis perfusion 0,1 U/kg/h (max par sécurité plafonnable)
 * - l'insuline ne démarre QUE si K ≥ 3,3 mmol/L (hypokaliémie → corriger K d'abord, risque arythmie).
 */
export function insulinDka(weightKg: number, unitsPerMl = 1) {
  const bolusU = weightKg * 0.1;
  const rateUh = weightKg * 0.1;
  return { bolusU, rateUh, rateMlH: unitsPerMl > 0 ? rateUh / unitsPerMl : 0 };
}

/** Statut potassique dictant la conduite dans l'ACD (grades ADA). */
export function dkaPotassiumAction(k: number): "hold-insulin" | "add-k" | "standard" {
  if (k < 3.3) return "hold-insulin";   // insuline contre-indiquée, K d'abord
  if (k < 5.2) return "add-k";          // ajouter 20-30 mmol K/L de soluté
  return "standard";
}

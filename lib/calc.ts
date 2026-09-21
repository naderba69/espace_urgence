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

/** Panneau d'anticipation complet : l'ensemble des doses d'urgence dérivées du poids, en une fois. */
export interface WeightResusItem {
  key: string;
  labelFr: string;
  labelAr: string;
  dose: string;         // affichage final (déjà arrondi)
  unit?: string;
}
export function weightResusPanel(w: number): WeightResusItem[] {
  const r1 = (x: number) => (Math.round(x * 10) / 10).toString();
  const r0 = (x: number) => Math.round(x).toString();
  const rows: WeightResusItem[] = [
    { key: "deferill", labelFr: "⚡ Défibrillation (péd.)", labelAr: "صعق (طفل)", dose: `${r0(Math.min(w * 4, 200))} J`, unit: "4 J/kg (max 200 biphasique)" },
    { key: "adr-acr", labelFr: "Adrénaline ACR péd. 1 mg/10 mL", labelAr: "أدرينالين توقف الأطفال", dose: `${r1(Math.min(w * 0.01, 1))} mg`, unit: "0,01 mg/kg = 0,1 mL/kg" },
    { key: "amio-acr", labelFr: "Amiodarone ACR péd.", labelAr: "أميودارون توقف الأطفال", dose: `${r0(Math.min(w * 5, 300))} mg`, unit: "5 mg/kg (max 300)" },
    { key: "fluid", labelFr: "Bolus de remplissage", labelAr: "دفعة سوائل", dose: `${r0(w * 20)} mL`, unit: "20 mL/kg (choc)" },
    { key: "defib-adult-note", labelFr: "⚡ Défibrillation adulte", labelAr: "صعق الكهل", dose: "120–200 J", unit: "fixe, exponentiel" },
    { key: "epi-adult", labelFr: "Adrénaline ACR adulte", labelAr: "أدرينالين الكهل", dose: "1 mg", unit: "IV/IO toutes les 3–5 min" },
    { key: "su", labelFr: "Succinylcholine (IOT)", labelAr: "سكسينيل كولين", dose: `${r1(w * 1.5)} mg`, unit: "1,5 mg/kg IV" },
    { key: "roc", labelFr: "Rocuronium (IOT)", labelAr: "روكورونيوم", dose: `${r1(w * 1.2)} mg`, unit: "1,2 mg/kg IV (RSI)" },
    { key: "keta", labelFr: "Kétamine (sédation)", labelAr: "كيتامين", dose: `${r1(w * 1)} – ${r1(w * 2)} mg`, unit: "1–2 mg/kg IV" },
    { key: "fenta", labelFr: "Fentanyl (bolus)", labelAr: "فنتانيل", dose: `${r0(w)} µg`, unit: "1 µg/kg IV titré" },
    { key: "mid", labelFr: "Midazolam IM (convulsion)", labelAr: "ميدازولام", dose: `${r1(Math.min(w * 0.2, 10))} mg`, unit: "0,2 mg/kg (max 10)" },
    { key: "diazir", labelFr: "Diazépam IR (convulsion)", labelAr: "ديازيبام شرجي", dose: `${r1(Math.min(w * 0.5, 10))} mg`, unit: "0,5 mg/kg (max 10)" },
    { key: "lev", labelFr: "Lévétiracétam", labelAr: "ليفيتيراسيتام", dose: `${r0(w * 60)} mg`, unit: "60 mg/kg (max 4,5 g)" },
    { key: "nai-bolus", labelFr: "NaCl 0,9 % hypertonique? NON — NaCl 3 % hyper-T", labelAr: "NaCl 3% مفرط التوتر", dose: `${r0(w * 3)} mL`, unit: "3 mL/kg sur 20 min (HTIC)" },
  ];
  return rows;
}

/* ═══════════════ v1.9 — pompe avancée, gazométrie, ventilation ═══════════════ */

/** Volume total selon la convention de dilution : complété à X, ou ajouté sur X de solvant. */
export function prepVolume(ampCount: number, ampVolMl: number, targetMl: number, convention: "total" | "added"): number {
  if (ampCount <= 0 || targetMl <= 0) return 0;
  return convention === "total" ? targetMl : targetMl + ampCount * ampVolMl;
}

/** Dose (µg/kg/min) depuis un débit et une concentration — sens inverse de amineFlow. */
export function doseFromFlow(flowMlh: number, weightKg: number, concUgMl: number): number {
  if (flowMlh <= 0 || weightKg <= 0 || concUgMl <= 0) return 0;
  return (flowMlh * concUgMl) / (weightKg * 60);
}

/** Concentration inférée d'une seringue entrante (transfert) depuis débit + dose documentée. */
export function inferConcUgMl(flowMlh: number, doseUgKgMin: number, weightKg: number): number {
  if (flowMlh <= 0) return 0;
  return (doseUgKgMin * weightKg * 60) / flowMlh;
}

export interface AbgInput {
  ph: number; paco2: number; hco3: number;
  na?: number; cl?: number; alb?: number; pao2?: number; fio2?: number;
}
export interface AbgFinding { id: string; sev: "info" | "warn" | "danger"; nums?: string }

/** Interprétation systématique acide-base + oxygénation (codes traduits côté UI). */
export function interpretAbg(v: AbgInput): AbgFinding[] {
  const f: AbgFinding[] = [];
  const { ph, paco2, hco3 } = v;
  if (!(ph > 0) || !(paco2 > 0) || !(hco3 > 0)) return f;
  const acid = ph < 7.35, alk = ph > 7.45;
  const respAc = paco2 > 45, respAl = paco2 < 35, metAc = hco3 < 22, metAl = hco3 > 26;

  if (acid) f.push({ id: "acidemie", sev: ph < 7.2 ? "danger" : "warn" });
  else if (alk) f.push({ id: "alcalemie", sev: ph > 7.6 ? "danger" : "warn" });
  else f.push({ id: "ph-normal", sev: "info" });

  if (acid || alk) {
    if (acid && respAc) f.push({ id: "resp-acidose", sev: "warn" });
    if (acid && metAc) f.push({ id: "met-acidose", sev: "warn" });
    if (alk && respAl) f.push({ id: "resp-alcalose", sev: "warn" });
    if (alk && metAl) f.push({ id: "met-alcalose", sev: "warn" });
    if (acid && respAc && metAc) f.push({ id: "mixte-acidose", sev: "danger" });
    if (alk && respAl && metAl) f.push({ id: "mixte-alcalose", sev: "danger" });
  } else if (respAc || respAl || metAc || metAl) {
    f.push({ id: "compense", sev: "info" });
    if (metAc && respAl) f.push({ id: "mixte-comp-ac", sev: "warn" });
    if (metAl && respAc) f.push({ id: "mixte-comp-al", sev: "warn" });
  }

  // Compensations attendues
  if (metAc) {
    const winter = 1.5 * hco3 + 8;
    if (paco2 > winter + 2) f.push({ id: "winter-haut", sev: "warn", nums: `${winter - 2}-${winter + 2}` });
    else if (paco2 < winter - 2) f.push({ id: "winter-bas", sev: "warn", nums: `${winter - 2}-${winter + 2}` });
  }
  if (metAl) {
    const exp = 40 + 0.7 * (hco3 - 24);
    if (paco2 > exp + 2 || paco2 < exp - 2) f.push({ id: "comp-met-al-inad", sev: "info", nums: `${Math.round(exp - 2)}-${Math.round(exp + 2)}` });
  }
  if (respAc && !metAc && !metAl) {
    const aigu = 24 + 0.1 * (paco2 - 40), chron = 24 + 0.35 * (paco2 - 40);
    if (hco3 >= aigu - 1 && hco3 <= aigu + 1) f.push({ id: "resp-aigu", sev: "info" });
    else if (hco3 >= chron - 1.5) f.push({ id: "resp-chron", sev: "info" });
  }

  // Trou anionique + delta ratio
  if (v.na && v.cl) {
    const ag = v.na - v.cl - hco3;
    const agc = v.alb ? ag + 2.5 * (4.4 - v.alb) : ag;
    if (agc > 12) {
      f.push({ id: "ta-eleve", sev: "warn", nums: String(Math.round(agc)) });
      if (metAc && hco3 < 24) {
        const dr = (agc - 12) / (24 - hco3);
        if (dr > 2) f.push({ id: "delta-gt2", sev: "warn", nums: dr.toFixed(1) });
        else if (dr < 0.8) f.push({ id: "delta-lt08", sev: "warn", nums: dr.toFixed(1) });
      }
    }
  }

  // Oxygénation
  if (v.pao2 && v.fio2) {
    const pf = v.pao2 / (v.fio2 > 1 ? v.fio2 / 100 : v.fio2);
    if (pf < 100) f.push({ id: "ards-severe", sev: "danger", nums: String(Math.round(pf)) });
    else if (pf < 200) f.push({ id: "ards-mod", sev: "danger", nums: String(Math.round(pf)) });
    else if (pf < 300) f.push({ id: "ards-mild", sev: "warn", nums: String(Math.round(pf)) });
    if (v.pao2 < 55) f.push({ id: "hypoxemie", sev: "danger" });
  }
  return f;
}

/** PEEP cible pour une FiO2 donnée (table protectrice standard, valeurs médianes). */
export function peepForFio2(fio2Pct: number): number {
  const f = fio2Pct > 1 ? fio2Pct / 100 : fio2Pct;
  if (f <= 0.3) return 5;
  if (f <= 0.4) return 6;
  if (f <= 0.5) return 8;
  if (f <= 0.6) return 10;
  if (f <= 0.7) return 11;
  if (f <= 0.8) return 13;
  if (f <= 0.9) return 16;
  return 20;
}

export interface VentSettings { vt: number; rr: number; peep: number; fio2: number }
export interface VentChange { field: keyof VentSettings; value: number; reason: string }

/** Ajustements ventilatoires guidés par la gazométrie (codes raison traduits côté UI). */
export function ventSuggest(s: VentSettings, abg: { ph: number; paco2: number; pao2: number }, ibw: number) {
  const guards: string[] = [];
  const proposed: VentSettings = { ...s };
  const changes: VentChange[] = [];
  if (ibw > 20 && s.vt > 0) {
    const vkg = s.vt / ibw;
    if (vkg > 8) { proposed.vt = Math.round(ibw * 6); changes.push({ field: "vt", value: proposed.vt, reason: "protection" }); }
    else if (vkg < 4) { proposed.vt = Math.round(ibw * 4); changes.push({ field: "vt", value: proposed.vt, reason: "vt-bas" }); guards.push("vt-min"); }
  }
  if (abg.ph < 7.35 && abg.paco2 > 45) {
    const rr = Math.min(s.rr + 2, 35);
    if (rr !== s.rr) changes.push({ field: "rr", value: rr, reason: "hypercapnie-acide" });
    else guards.push("rr-max");
    proposed.rr = rr;
  } else if (abg.ph > 7.55 && abg.paco2 < 35) {
    const rr = Math.max(s.rr - 2, 10);
    if (rr !== s.rr) changes.push({ field: "rr", value: rr, reason: "alcalose-resp" });
    proposed.rr = rr;
  }
  if (abg.pao2 > 0) {
    if (abg.pao2 < 55) {
      const fio2 = Math.min(s.fio2 + 10, 100);
      const peep = peepForFio2(fio2);
      if (fio2 !== s.fio2) changes.push({ field: "fio2", value: fio2, reason: "hypoxemie" });
      if (peep !== s.peep) changes.push({ field: "peep", value: peep, reason: "hypoxemie" });
      proposed.fio2 = fio2; proposed.peep = peep;
      if (fio2 === 100 && abg.pao2 < 55) guards.push("fio2-max");
    } else if (abg.pao2 > 90 && s.fio2 > 30) {
      const fio2 = Math.max(s.fio2 - 10, 30);
      const peep = peepForFio2(fio2);
      if (fio2 !== s.fio2) changes.push({ field: "fio2", value: fio2, reason: "sevrage-o2" });
      if (peep !== s.peep) changes.push({ field: "peep", value: peep, reason: "sevrage-o2" });
      proposed.fio2 = fio2; proposed.peep = peep;
    }
  }
  if (abg.ph < 7.15) guards.push("acidemie-severe");
  return { proposed, changes, guards };
}

/** Unités supportées par le moteur pompe (v1.9 → v2.3 : toutes les unités RE.NAU). */
export type PumpUnit =
  | "µg/kg/min" | "µg/min" | "µg/h" | "µg/kg/h"
  | "mg/h" | "mg/kg/h" | "mg/min"
  | "UI/h" | "UI/kg/h" | "g/h";

/** Débit mL/h pour une dose selon l'unité (conc exprimée en µg/mL ou UI/mL selon le cas). */
export function flowForUnit(unit: PumpUnit, dose: number, weightKg: number, conc: number): number {
  if (conc <= 0 || dose < 0) return 0;
  switch (unit) {
    case "µg/kg/min": return (dose * weightKg * 60) / conc;
    case "µg/min": return (dose * 60) / conc;
    case "µg/h": return dose / conc;
    case "µg/kg/h": return (dose * weightKg) / conc;
    case "mg/h": return (dose * 1000) / conc;
    case "mg/kg/h": return (dose * weightKg * 1000) / conc;
    case "mg/min": return (dose * 1000 * 60) / conc;
    case "UI/h": return dose / conc;
    case "UI/kg/h": return (dose * weightKg) / conc;
    case "g/h": return (dose * 1000000) / conc;
  }
}

/** Table dose→débit pour affichage : pas « propre » (1/2/2,5/5×10^n), ≤ 11 lignes. */
export function doseLadder(min: number, max: number, step: number): number[] {
  if (!(max >= min)) return [];
  const raw = (max - min) / 10 || step || 1;
  const pow = 10 ** Math.floor(Math.log10(raw));
  let nice = pow * 10;
  for (const m of [1, 2, 2.5, 5, 10]) if (pow * m >= raw) { nice = pow * m; break; }
  const start = Math.ceil((min - 1e-9) / nice) * nice;
  const out: number[] = [];
  for (let v = start; v <= max + 1e-9; v += nice) out.push(Math.round(v * 1000) / 1000);
  return out;
}

/* ═══════════════ v2.0 — دفعة الحسابات العالية التكرار ═══════════════ */

/** مؤشر الصدمة = نبض / انقباضي. */
export function shockIndex(hr: number, sbp: number): number {
  if (sbp <= 0) return 0;
  return hr / sbp;
}
/** تصنيف مؤشر الصدمة : 0 sain, 1 alerte, 2 choc probable, 3 sévère. */
export function shockIndexBand(si: number): 0 | 1 | 2 | 3 {
  if (si <= 0) return 0;
  if (si < 0.7) return 0;
  if (si < 1) return 1;
  if (si < 1.4) return 2;
  return 3;
}
/** الضغط الشرياني الوسطي. */
export function meanArterialPressure(sbp: number, dbp: number): number {
  return (sbp + 2 * dbp) / 3;
}
/** الضغط النبضي. */
export function pulsePressure(sbp: number, dbp: number): number {
  return sbp - dbp;
}

/** QTc بازيتا وفريديريا (QT بالمللي ثانية، النبض بالدقيقة). */
export function qtc(qtMs: number, bpm: number): { bazett: number; fridericia: number } {
  if (qtMs <= 0 || bpm <= 0) return { bazett: 0, fridericia: 0 };
  const rr = 60 / bpm;
  return { bazett: qtMs / Math.sqrt(rr), fridericia: qtMs / Math.cbrt(rr) };
}
/** 0 normal, 1 allongé, 2 dangereux ≥ 500. */
export function qtcBand(v: number, female: boolean): 0 | 1 | 2 {
  const cut = female ? 460 : 450;
  if (v >= 500) return 2;
  if (v > cut) return 1;
  return 0;
}

/** إينوكسابارين : retour { doseMg?, doseUI, freq } selon poids + clairance. */
export function enoxaparin(weightKg: number, crcl: number, mode: "traitement" | "prophylaxie") {
  if (weightKg <= 0) return { perKg: 0, daily: 0, freq: "" };
  if (mode === "prophylaxie") {
    return crcl < 30 ? { perKg: 0, daily: 20, freq: "1/j" } : { perKg: 0, daily: 40, freq: "1/j" };
  }
  if (crcl < 30) return { perKg: 1, daily: Math.round(weightKg), freq: "1/j" };
  return { perKg: 1, daily: Math.round(weightKg * 2), freq: "2/j (1 mg/kg)" };
}

/** TNK ténectéplase (STEMI) : paliers de poids. */
export function tenecteplaseMg(weightKg: number): number {
  if (weightKg < 60) return 30;
  if (weightKg < 70) return 35;
  if (weightKg < 80) return 40;
  if (weightKg < 90) return 45;
  return 50;
}
/** Altéplase AVC ischémique : 0,9 mg/kg max 90 — 10 % bolus. */
export function alteplaseStroke(weightKg: number) {
  const total = Math.min(0.9 * weightKg, 90);
  return { total, bolus: total * 0.1, infusion: total * 0.9 };
}

/** كالسيوم مصحح بالألبومين (mg/dL, alb g/dL). */
export function calciumCorrected(ca: number, alb: number): number {
  return ca + 0.8 * (4 - alb);
}
/** تقدير عجز البوتاسيوم (mEq) — règle clinique usuelle. */
export function potassiumDeficit(k: number, weightKg: number): number {
  if (k >= 4.5 || weightKg <= 0) return 0;
  return Math.round((4.5 - k) * 0.4 * weightKg);
}

/** Holliday-Segar : besoins hydriques journaliers (mL/j). */
export function hollidaySegar(weightKg: number): number {
  if (weightKg <= 0) return 0;
  if (weightKg <= 10) return weightKg * 100;
  if (weightKg <= 20) return 1000 + (weightKg - 10) * 50;
  return 1500 + (weightKg - 20) * 20;
}
/** عجز التجفاف (mL) = % × poids × 10. */
export function dehydrationDeficit(pct: number, weightKg: number): number {
  return pct * weightKg * 10;
}

/** NAC paracétamol : 3 poches (mg + volumes adultes/péd adaptés). */
export function nacProtocol(weightKg: number) {
  if (weightKg <= 0) return null;
  const w = Math.min(weightKg, 110);
  return [
    { bag: 1 as const, mg: 150 * w, vol: w < 20 ? 100 : w < 40 ? 250 : 200, hours: 1 },
    { bag: 2 as const, mg: 50 * w, vol: w < 20 ? 250 : w < 40 ? 500 : 500, hours: 4 },
    { bag: 3 as const, mg: 100 * w, vol: w < 20 ? 500 : w < 40 ? 1000 : 1000, hours: 16 },
  ].map((b) => ({ ...b, rate: Math.round((b.vol / b.hours) * 10) / 10 }));
}

/** VNI : valeurs initiales selon le profil. */
export function nivStart(profile: "bpco" | "oap") {
  return profile === "bpco"
    ? { ipap: 12, epap: 5, fio2: 0, target: "SpO2 88-92" }
    : { ipap: 10, epap: 6, fio2: 0, target: "SpO2 > 92" };
}

/* ═══════════════ v2.2 — scores de triage & transfusion massive ═══════════════ */

export interface Abcd2Input {
  age60: boolean; bp: boolean;
  symptom: "faiblesse" | "parole" | "aucun";
  duration: "gt60" | "d10a59" | "lt10";
  diabet: boolean;
}
/** ABCD2 post-AIT : 0–7. */
export function abcd2(v: Abcd2Input): number {
  let s = 0;
  if (v.age60) s += 1;
  if (v.bp) s += 1;
  if (v.symptom === "faiblesse") s += 2;
  else if (v.symptom === "parole") s += 1;
  if (v.duration === "gt60") s += 2;
  else if (v.duration === "d10a59") s += 1;
  if (v.diabet) s += 1;
  return s;
}
/** 0 bas, 1 modéré, 2 haut. */
export function abcd2Band(s: number): 0 | 1 | 2 {
  if (s <= 3) return 0;
  if (s <= 5) return 1;
  return 2;
}

export interface AlvaradoInput {
  migration: boolean; anorexie: boolean; nausees: boolean;
  fdr: boolean; rebound: boolean; fievre: boolean;
  hyperleuco: boolean; deviation: boolean;
}
/** Score d'Alvarado (appendicite) : 0–10. */
export function alvarado(v: AlvaradoInput): number {
  let s = 0;
  if (v.migration) s += 1;
  if (v.anorexie) s += 1;
  if (v.nausees) s += 1;
  if (v.fdr) s += 2;
  if (v.rebound) s += 1;
  if (v.fievre) s += 1;
  if (v.hyperleuco) s += 2;
  if (v.deviation) s += 1;
  return s;
}
/** 0 improbable, 1 possible, 2 probable. */
export function alvaradoBand(s: number): 0 | 1 | 2 {
  if (s <= 3) return 0;
  if (s <= 6) return 1;
  return 2;
}

/** Transfusion massive : volumes cibles 1:1:1 selon le poids. */
export function massiveTransfusion(weightKg: number) {
  if (weightKg <= 0) return null;
  return {
    gr: Math.round(weightKg * 10),      // mL CGR
    pfc: Math.round(weightKg * 10),     // mL PFC
    plt: Math.round(weightKg * 5),      // mL pool plaquettes
    unitsGr: Math.max(1, Math.round((weightKg * 10) / 300)),
  };
}

/* ═══════════════ v2.4 — فرز جماعي START / JumpSTART ═══════════════ */

export type TriageColor = "green" | "yellow" | "red" | "black";

export interface StartInput {
  ped: boolean;
  walks: boolean;
  breath: boolean;      // après libération des voies aériennes
  rr: number;
  pulse: boolean;       // pouls radial / TRC < 2 s
  obeys: boolean;       // obéit / se console
}

/** START adulte et JumpSTART pédiatrique : couleur de tag. */
export function startTriage(v: StartInput): TriageColor {
  if (!v.breath) return "black";
  if (v.walks) return "green";
  const hi = v.ped ? 45 : 30;
  const lo = v.ped ? 15 : 0;
  if (v.rr > hi || (v.ped && v.rr < lo)) return "red";
  if (!v.pulse) return "red";
  if (!v.obeys) return "red";
  return "yellow";
}

/** Version pas-à-pas : court-circuite dès qu'une réponse impose une couleur. */
export function startTriageStep(ped: boolean, a: Partial<StartInput>): TriageColor | null {
  if (a.breath === false) return "black";
  if (a.walks === true) return "green";
  if (a.rr !== undefined && (a.rr > (ped ? 45 : 30) || (ped && a.rr < 15))) return "red";
  if (a.pulse === false) return "red";
  if (a.pulse === true && a.obeys !== undefined) return a.obeys ? "yellow" : "red";
  return null;
}

/* ═══════════════ v2.5 — فطام التهوية (sevrage) ═══════════════ */

/** Critères pré-SBT tous remplis ? */
export const weaningReady = (pre: boolean[]): boolean => pre.length > 0 && pre.every(Boolean);
/** SBT toléré 30-120 min ? */
export const sbtPassed = (sbt: boolean[]): boolean => sbt.length > 0 && sbt.every(Boolean);
/** Critères d'extubation remplis ? */
export const extubationOk = (ext: boolean[]): boolean => ext.length > 0 && ext.every(Boolean);

/* ═══════════════ v2.6 — Scores cliniques + MgSO4 ═══════════════ */

const round2 = (n: number): number => Math.round(n * 100) / 100;

/** qSOFA : 0-3, ≥ 2 évoque un pronostic péjoratif (sepsis). */
export const qsofa = (rr: number, sbp: number, altered: boolean): number =>
  (rr >= 22 ? 1 : 0) + (sbp <= 100 ? 1 : 0) + (altered ? 1 : 0);

/** sPESI : 0 = faible risque ; ≥ 1 = risque élevé (EP). */
export function spesi(v: { age80: boolean; cancer: boolean; hf: boolean; hr110: boolean; sbp100: boolean; spo290: boolean }): number {
  return [v.age80, v.cancer, v.hf, v.hr110, v.sbp100, v.spo290].filter(Boolean).length;
}

/** HEART : 0-10. */
export const heart = (h: number, e: number, a: number, r: number, t: number): number => h + e + a + r + t;
/** ≤3 faible, 4-6 modéré, ≥7 élevé. */
export const heartBand = (s: number): "low" | "mod" | "high" => (s <= 3 ? "low" : s <= 6 ? "mod" : "high");

/** MgSO4 : concentration g/mL d'une ampoule à pct % (p/v). */
export const mgso4GPerMl = (pct: number): number => pct / 100;
/** Volume à prélever pour `grams` grammes. */
export const mgso4DrawMl = (pct: number, grams: number): number => round2(grams / mgso4GPerMl(pct));
/** mL/h en PSE pour `gPerH` g/h. */
export const mgso4RateMlH = (pct: number, gPerH: number): number => round2(gPerH / mgso4GPerMl(pct));

/* ═══════════════ v2.7 — حماض كيتوني بالساعة ═══════════════ */

/** التوسيع الأولي مل: أطفال 10-20 مل/كغ (افتراضي 10)، كبار 1000 مل. */
export const dkaBolusMl = (w: number, ped: boolean, mlKg = 10): number => (ped ? Math.round(w * mlKg) : 1000);
/** إنسولين وريدي وحدة/س. */
export const dkaInsulinUh = (w: number, rate = 0.1): number => Math.round(w * rate * 100) / 100;
/** قرار البوتاسيوم: <3.3 أوقف/أجّل الإنسولين. */
export const dkaKDecision = (k: number): "hold" | "go" => (k < 3.3 ? "hold" : "go");
/** عند سكر < 2.5 غ/ل أضف غلوكوز. */
export const dkaNeedsDextrose = (glyGPerL: number): boolean => glyGPerL < 2.5;

/* ═══════════════ v2.8 — Broselow (longueur → zone) ═══════════════
   Zones : PALS/Broselow (clinical-database 2026 ; e3learn). */

export interface BroselowZone {
  color: string;
  lenMin: number; lenMax: number;
  kgMin: number; kgMax: number;
  mid: number;              // poids médian pour doses
  ettCuffed: string; ettUncuffed: string; blade: string;
}

export const BROSELOW: BroselowZone[] = [
  { color: "gray",   lenMin: 46,  lenMax: 53,  kgMin: 3,  kgMax: 4,  mid: 3.5,  ettCuffed: "3.0", ettUncuffed: "3.0-3.5", blade: "Miller 0" },
  { color: "pink",   lenMin: 54,  lenMax: 62,  kgMin: 5,  kgMax: 6,  mid: 5.5,  ettCuffed: "3.0", ettUncuffed: "3.5",     blade: "Miller 0-1" },
  { color: "red",    lenMin: 63,  lenMax: 74,  kgMin: 7,  kgMax: 8,  mid: 7.5,  ettCuffed: "3.5", ettUncuffed: "4.0",     blade: "Miller 1" },
  { color: "purple", lenMin: 75,  lenMax: 84,  kgMin: 9,  kgMax: 10, mid: 9.5,  ettCuffed: "3.5", ettUncuffed: "4.0-4.5", blade: "Miller 1-2" },
  { color: "yellow", lenMin: 85,  lenMax: 97,  kgMin: 11, kgMax: 13, mid: 12,   ettCuffed: "4.0", ettUncuffed: "4.5-5.0", blade: "Miller 2" },
  { color: "white",  lenMin: 98,  lenMax: 109, kgMin: 14, kgMax: 17, mid: 15.5, ettCuffed: "4.5", ettUncuffed: "5.0-5.5", blade: "Miller 2 / Mac 2" },
  { color: "blue",   lenMin: 110, lenMax: 118, kgMin: 18, kgMax: 22, mid: 20,   ettCuffed: "5.0", ettUncuffed: "5.5-6.0", blade: "Miller 2 / Mac 2" },
  { color: "orange", lenMin: 119, lenMax: 131, kgMin: 23, kgMax: 29, mid: 26,   ettCuffed: "5.5", ettUncuffed: "6.0-6.5", blade: "Mac 2" },
  { color: "green",  lenMin: 132, lenMax: 143, kgMin: 30, kgMax: 36, mid: 33,   ettCuffed: "6.0", ettUncuffed: "6.5",     blade: "Mac 2-3" },
];

/** Longueur (cm) → zone Broselow ; "neo" < 46 ; "adult" > 143. */
export function broselowZone(lenCm: number): BroselowZone | "neo" | "adult" {
  if (lenCm < 46) return "neo";
  if (lenCm > 143) return "adult";
  return BROSELOW.find((z) => lenCm >= z.lenMin && lenCm <= z.lenMax) ?? "adult";
}

/** Doses PALS calculées sur le poids médian de la zone. */
export const broselowDoses = (z: BroselowZone) => ({
  epiIvMg: round2(z.mid * 0.01),        // 0,01 mg/kg (1:10 000)
  epiIvMl: round2(z.mid * 0.1),         // mL de 1:10 000
  epiImMg: Math.min(0.5, round2(z.mid * 0.01)),
  amioMg: Math.round(z.mid * 5),
  adenoMg: round2(z.mid * 0.1),
  bolusMl: Math.round(z.mid * 20),
  defibJ: Math.round(z.mid * 2),
  d10Ml: Math.round(z.mid * 5),
});

/* ═══════════════ v3.0 — لوحة المراجعة الدورية ═══════════════ */

/** Mois écoulés depuis "AAAA-MM" jusqu'à `now`. */
export function monthsSince(ym: string, now: Date): number {
  const [y, m] = ym.split("-").map(Number);
  return (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
}

/* ═══════════════ v3.1 — موقّت الإجراءات ═══════════════ */

/** ثوانٍ → "MM:SS". */
export const fmtMMSS = (totalSec: number): string => {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/* ═══════════════ v3.2 — تنبيه استحقاق المراجعة ═══════════════ */

/** عدد عناصر بلغ عتبة الأشهر (افتراضي 11 = إنذار مبكر قبل 12). */
export const reviewDueCount = (yms: string[], now: Date, threshold = 11): number =>
  yms.filter((ym) => monthsSince(ym, now) >= threshold).length;

/** Jours écoulés depuis une date ISO "AAAA-MM-JJ" jusqu'à `now`. */
export function daysSince(iso: string, now: Date): number {
  return Math.floor((now.getTime() - Date.parse(iso)) / 86400000);
}


// v18.1 — اختبارات تقدير التصفية (مزمن/حادّ/أطفال) وخطّة العلاج (حلقة a → b).
// Tests du moteur rénal (CKD-EPI 2021, CKID U25, stadification KDIGO) et du plan a → b.
import { describe, expect, it } from "vitest";
import {
  akiKdigo,
  chooseStage,
  ckdEpi2021,
  schwartzCkidU25,
  weightsForCg,
} from "@/lib/renal-clearance";
import { addDecision, currentDecisions, emptyPlan, LEGACY_PLAN_KEY, nextRound, parsePlan, PLAN_KEY, planToText, removeMolecule } from "@/lib/atb-plan";

describe("CKD-EPI 2021 (adulte, sans ethnie)", () => {
  it("homme 70 ans, 1,2 mg/dL ≈ 65 mL/min/1,73 m²", () => {
    expect(ckdEpi2021(70, 1.2, "m")!).toBeCloseTo(65, 0);
  });

  it("femme 70 ans, 1,2 mg/dL ≈ 49", () => {
    expect(ckdEpi2021(70, 1.2, "f")!).toBeCloseTo(49, 0);
  });

  it("homme 40 ans, 1,0 mg/dL ≈ 97 (fonction normale)", () => {
    expect(ckdEpi2021(40, 1.0, "m")!).toBeGreaterThan(90);
    expect(ckdEpi2021(40, 1.0, "m")!).toBeLessThan(105);
  });

  it("refuse les entrées invalides", () => {
    expect(ckdEpi2021(0, 1, "m")).toBeNull();
    expect(ckdEpi2021(70, 0, "m")).toBeNull();
    expect(ckdEpi2021(70, NaN, "m")).toBeNull();
  });
});

describe("CKID U25 (Schwartz) — enfant", () => {
  it("120 cm / 0,5 mg/dL ≈ 99 mL/min/1,73 m²", () => {
    expect(schwartzCkidU25(120, 0.5)!).toBeCloseTo(99.1, 1);
  });

  it("refuse une taille absente", () => {
    expect(schwartzCkidU25(NaN, 0.5)).toBeNull();
    expect(schwartzCkidU25(0, 0.5)).toBeNull();
  });
});

describe("poids de calcul (Cockcroft-Gault)", () => {
  it("BMI < 30 : poids réel", () => {
    const w = weightsForCg(70, 175, "m");
    expect(w.bmi!).toBeCloseTo(22.9, 1);
    expect(w.usedAbw).toBe(false);
    expect(w.cgWeight).toBe(70);
  });

  it("BMI ≥ 30 : poids ajusté IBW + 0,4 × (réel − IBW)", () => {
    const w = weightsForCg(120, 170, "m");
    expect(w.bmi!).toBeGreaterThan(40);
    expect(w.usedAbw).toBe(true);
    expect(w.ibw!).toBeCloseTo(66, 0);              // 50 + 0,91×(170 − 152,4)
    expect(w.cgWeight).toBeCloseTo(w.abw!, 5);
    expect(w.cgWeight).toBeGreaterThan(w.ibw!);
    expect(w.cgWeight).toBeLessThan(120);
  });

  it("sans taille : poids réel, pas d'invention", () => {
    const w = weightsForCg(70, null, "f");
    expect(w.bmi).toBeNull();
    expect(w.cgWeight).toBe(70);
  });
});

describe("KDIGO — repérage de l'agression aiguë", () => {
  it("+0,3 mg/dL en 48 h → stade 1", () => {
    const r = akiKdigo({ scrNow: 1.3, scr48h: 1.0 });
    expect(r.criteria).toContain("scr-up-48h");
    expect(r.stage).toBe(1);
  });

  it("×1,5 sur 7 jours → stade 1", () => {
    const r = akiKdigo({ scrNow: 1.5, scr7d: 1.0 });
    expect(r.criteria).toContain("scr-ratio-7d");
    expect(r.stage).toBe(1);
  });

  it("×3 → stade 3", () => {
    expect(akiKdigo({ scrNow: 3.0, scr7d: 1.0 }).stage).toBe(3);
  });

  it("créatinine ≥4 mg/dL : exige une hausse documentée pour la classer AKI", () => {
    expect(akiKdigo({ scrNow: 4.2 }).stage).toBe(0);
    const raised = akiKdigo({ scrNow: 4.2, scr48h: 4.0 });
    expect(raised.stage).toBe(3);
    expect(raised.criteria).toContain("scr-4mg");
  });

  it("diurèse <0,5 mL/kg/h pendant 6 à <12 h → KDIGO 1", () => {
    const r = akiKdigo({ scrNow: 1.0, urineMlKgH: 0.4, urineHours: 6 });
    expect(r.criteria).toContain("urine-stage-1");
    expect(r.stage).toBe(1);
  });

  it("diurèse <0,5 mL/kg/h pendant ≥12 h → KDIGO 2", () => {
    const r = akiKdigo({ scrNow: 1.0, urineMlKgH: 0.4, urineHours: 12 });
    expect(r.criteria).toContain("urine-stage-2");
    expect(r.stage).toBe(2);
  });

  it("diurèse <0,3 mL/kg/h pendant ≥24 h → KDIGO 3", () => {
    const r = akiKdigo({ scrNow: 1.0, urineMlKgH: 0.2, urineHours: 24 });
    expect(r.criteria).toContain("urine-stage-3");
    expect(r.stage).toBe(3);
  });

  it("anurie ≥12 h (zéro) → KDIGO 3", () => {
    const r = akiKdigo({ scrNow: 1.0, urineMlKgH: 0, urineHours: 12 });
    expect(r.criteria).toContain("anuria-stage-3");
    expect(r.stage).toBe(3);
  });

  it("oligurie de moins de 6 h : pas de critère", () => {
    expect(akiKdigo({ scrNow: 1.0, urineMlKgH: 0.3, urineHours: 3 }).criteria).toHaveLength(0);
  });

  it("l'épuration extrarénale est un critère KDIGO 3", () => {
    const r = akiKdigo({ scrNow: 1.0, renalReplacementTherapy: true });
    expect(r.criteria).toContain("renal-replacement");
    expect(r.stage).toBe(3);
  });

  it("fonction stable : aucun critère", () => {
    const r = akiKdigo({ scrNow: 1.0, scr48h: 1.0, scr7d: 1.0, urineMlKgH: 1.2, urineHours: 8 });
    expect(r.criteria).toHaveLength(0);
    expect(r.stage).toBe(0);
  });
});

describe("stade DFG — CKD-EPI, Cockcroft séparé, enfant, AKI et dialyse", () => {
  it("adulte stable : CKD-EPI décide (homme 40 ans, 1,0 mg/dL → normorénal)", () => {
    const r = chooseStage({ ageYears: 40, sexe: "m", weightKg: 75, heightCm: 178, scrMgDl: 1.0 });
    expect(r.primary).toBe("ckd-epi");
    expect(r.stage).toBe("normorenal");
    expect(r.refusal).toBeUndefined();
    expect(r.crclCg).not.toBeNull();
  });

  it("agression aiguë : bloque l'auto-sélection et garde DFG/ClCr séparés", () => {
    const pt = { ageYears: 85, sexe: "f" as const, weightKg: 42, heightCm: 158 };
    const stable = chooseStage({ ...pt, scrMgDl: 1.4 });
    const aigu = chooseStage({ ...pt, scrMgDl: 1.4, scr48h: 1.0 });
    expect(stable.stage).toBe("moderee");
    expect(stable.primary).toBe("ckd-epi");
    expect(aigu.aki.stage).toBe(1);
    expect(aigu.primary).toBe("ckd-epi");
    expect(aigu.refusal).toBe("aki");
    expect(aigu.stage).toBeNull();
    expect(aigu.egfrCkd).not.toBeNull();
    expect(aigu.crclCg).not.toBeNull();
    expect(aigu.warnings.some((w) => w.fr.includes("KDIGO"))).toBe(true);
  });

  it("enfant : CKID U25 reste informatif et n'ouvre pas le tableau adulte ; refuse sans taille", () => {
    const ok = chooseStage({ ageYears: 8, sexe: "m", weightKg: 25, heightCm: 120, scrMgDl: 0.5 });
    expect(ok.primary).toBe("ckid");
    expect(ok.egfrCkid!).toBeCloseTo(99.1, 1);
    expect(ok.stage).toBeNull();
    expect(ok.refusal).toBe("pediatric");
    expect(ok.warnings.some((w) => w.fr.includes("réservé aux adultes"))).toBe(true);

    const refus = chooseStage({ ageYears: 8, sexe: "m", weightKg: 25, scrMgDl: 0.5 });
    expect(refus.refusal).toBe("height");
  });

  it("dialyse/épuration extrarénale : hors périmètre, aucun stade du tableau même sans bilans", () => {
    const r = chooseStage({
      ageYears: 70, sexe: "m", weightKg: 70, scrMgDl: 1.0, onRenalReplacementTherapy: true,
    });
    expect(r.refusal).toBe("dialysis");
    expect(r.stage).toBeNull();
    expect(r.aki.stage).toBe(3);
    expect(r.aki.criteria).toContain("renal-replacement");
    expect(r.warnings.some((warning) => warning.fr.includes("hors du périmètre"))).toBe(true);
  });

  it("entrées incomplètes ou non finies : refus explicite, aucun stade normal inventé", () => {
    expect(chooseStage({ ageYears: 0, sexe: "m", weightKg: 70, scrMgDl: 1 }).refusal).toBe("inputs");
    expect(chooseStage({ ageYears: 70, sexe: "m", weightKg: 70, scrMgDl: 0 }).refusal).toBe("inputs");
    const invalid = chooseStage({ ageYears: 70, sexe: "m", weightKg: 70, scrMgDl: Number.NaN });
    expect(invalid.refusal).toBe("inputs");
    expect(invalid.stage).toBeNull();
    expect(invalid.baseStage).toBeNull();
  });

  it("DFG exactement à 30 : aucun stade automatique à cause du chevauchement de la source", () => {
    const ageYears = 50;
    const scrMgDl = 0.9 * Math.pow((142 * Math.pow(0.9938, ageYears)) / 30, 1 / 1.2);
    expect(ckdEpi2021(ageYears, scrMgDl, "m")).toBeCloseTo(30, 8);

    const result = chooseStage({ ageYears, sexe: "m", weightKg: 70, scrMgDl });
    expect(result.refusal).toBe("boundary");
    expect(result.stage).toBeNull();
    expect(result.baseStage).toBeNull();
    expect(result.warnings.some((warning) => warning.fr.includes("DFG = 30"))).toBe(true);
  });

  it("la ClCr Cockcroft <30 reste séparée et ne change pas la classe DFG du tableau", () => {
    const result = chooseStage({ ageYears: 85, sexe: "m", weightKg: 50, heightCm: 165, scrMgDl: 1.5 });
    expect(result.baseStage).toBe("moderee");
    expect(result.stage).toBe("moderee");
    expect(result.egfrCkd).toBeGreaterThan(30);
    expect(result.crclCg!).toBeLessThan(30);
    expect(result.warnings.some((warning) => warning.fr.includes("GPR"))).toBe(false);
  });

  it("poids très bas : CKD-EPI est signalé comme indexé", () => {
    const r = chooseStage({ ageYears: 75, sexe: "f", weightKg: 38, heightCm: 165, scrMgDl: 1.1 });
    expect(r.warningKey).toBe("indexed-low-weight");
    expect(r.warnings.some((w) => w.ar.includes("مفهرسة"))).toBe(true);
  });

  it("poids idéal coché : Cockcroft-Gault plafonne au poids idéal", () => {
    const libre = chooseStage({ ageYears: 60, sexe: "m", weightKg: 110, heightCm: 175, scrMgDl: 1.2 });
    const ideal = chooseStage({ ageYears: 60, sexe: "m", weightKg: 110, heightCm: 175, scrMgDl: 1.2, useIdealWeight: true });
    expect(ideal.crclCg!).toBeLessThan(libre.crclCg!);
  });
});

describe("plan a → b (décisions itératives)", () => {
  const base = { id: "ceftriaxone-im-iv", snapshot: { weightKg: 70 as number | undefined } };
  it("première décision = tour 1, réévaluation = tour 2 (historique conservé)", () => {
    let plan = emptyPlan();
    expect(nextRound(plan, base.id)).toBe(1);
    plan = addDecision(plan, { ...base, decision: "retenue", at: "2026-09-21T10:00:00.000Z" });
    expect(plan.entries).toHaveLength(1);
    expect(plan.entries[0].round).toBe(1);
    plan = addDecision(plan, { ...base, decision: "abandonnee", reason: "fonction-renale", at: "2026-09-21T12:00:00.000Z" });
    expect(plan.entries).toHaveLength(2);
    expect(nextRound(plan, base.id)).toBe(3);
    const cur = currentDecisions(plan);
    expect(cur.get(base.id)!.decision).toBe("abandonnee");
    expect(cur.get(base.id)!.round).toBe(2);
  });

  it("retrait d'une molécule : tout son historique disparaît", () => {
    let plan = addDecision(emptyPlan(), { ...base, decision: "retenue" });
    plan = removeMolecule(plan, base.id);
    expect(plan.entries).toHaveLength(0);
  });

  it("invalide les anciens snapshots : nouveau format v2, plan vide plutôt qu'erreur", () => {
    const entry = { id: "a", round: 1, decision: "retenue" };
    expect(PLAN_KEY).toBe("eutn:atb-plan-v2");
    expect(LEGACY_PLAN_KEY).toBe("eutn:atb-plan-v1");
    expect(emptyPlan().version).toBe(2);
    expect(parsePlan({ version: 1, entries: [entry] }).entries).toHaveLength(0);
    expect(parsePlan({ version: 2, entries: [entry] }).entries).toHaveLength(1);
    expect(parsePlan("nope").entries).toHaveLength(0);
  });

  it("export texte : retenues, abandonnées avec motif, rappel de validation", () => {
    let plan = addDecision(emptyPlan(), { ...base, decision: "retenue", snapshot: { weightKg: 70, dose: "2 g/24h" }, at: "2026-09-21T10:00:00.000Z" });
    plan = addDecision(plan, { id: "tobramycine-im-iv", decision: "abandonnee", reason: "resistance", at: "2026-09-21T10:05:00.000Z" });
    const name = (id: string) => (id.startsWith("ceftriaxone") ? "Ceftriaxone" : "Tobramycine");
    const fr = planToText(plan, { lang: "fr", name, stageLabel: "IRC modérée 59 → 30" });
    expect(fr).toContain("RETENUES (1)");
    expect(fr).toContain("Ceftriaxone");
    expect(fr).toContain("ABANDONNÉES (1)");
    expect(fr).toContain("Résistance / spectre");
    expect(fr).toContain("OMEDIT");
    const ar = planToText(plan, { lang: "ar", name });
    expect(ar).toContain("مُعتمدة");
    expect(ar).toContain("متخلّى عنها");
  });
});

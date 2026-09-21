// v18.1 — اختبارات تقدير التصفية (مزمن/حادّ/أطفال) وخطّة العلاج (حلقة a → b).
// Tests du moteur rénal étage 2 (CKD-EPI 2021, CKID U25, KDIGO, escalade GPR) et du plan a → b.
import { describe, expect, it } from "vitest";
import {
  akiKdigo,
  chooseStage,
  ckdEpi2021,
  escalateStage,
  LIFESAVING_IDS,
  schwartzCkidU25,
  weightsForCg,
} from "@/lib/renal-clearance";
import { addDecision, currentDecisions, emptyPlan, nextRound, parsePlan, planToText, removeMolecule } from "@/lib/atb-plan";

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

  it("oligurie < 0,5 mL/kg/h pendant 6 h → critère retenu", () => {
    const r = akiKdigo({ scrNow: 1.0, urineMlKgH: 0.3, urineHours: 6 });
    expect(r.criteria).toContain("urine-6h");
    expect(r.stage).toBe(1);
  });

  it("oligurie de moins de 6 h : pas de critère", () => {
    expect(akiKdigo({ scrNow: 1.0, urineMlKgH: 0.3, urineHours: 3 }).criteria).toHaveLength(0);
  });

  it("fonction stable : aucun critère", () => {
    const r = akiKdigo({ scrNow: 1.0, scr48h: 1.0, scr7d: 1.0, urineMlKgH: 1.2, urineHours: 8 });
    expect(r.criteria).toHaveLength(0);
    expect(r.stage).toBe(0);
  });
});

describe("stade retenu — CKD-EPI, CG, enfant, escalade", () => {
  it("adulte stable : CKD-EPI décide (homme 40 ans, 1,0 mg/dL → normorénal)", () => {
    const r = chooseStage({ ageYears: 40, sexe: "m", weightKg: 75, heightCm: 178, scrMgDl: 1.0 });
    expect(r.primary).toBe("ckd-epi");
    expect(r.stage).toBe("normorenal");
    expect(r.refusal).toBeUndefined();
    expect(r.crclCg).not.toBeNull();
  });

  it("agression aiguë : le stade le plus prudent des deux estimations est retenu", () => {
    const pt = { ageYears: 85, sexe: "f" as const, weightKg: 42, heightCm: 158 };
    const stable = chooseStage({ ...pt, scrMgDl: 1.4 });                       // CKD-EPI ≈ 37 ⇒ modérée
    const aigu = chooseStage({ ...pt, scrMgDl: 1.4, scr48h: 1.0 });           // +0,4 mg/dL/48 h ⇒ KDIGO 1
    expect(stable.stage).toBe("moderee");
    expect(stable.primary).toBe("ckd-epi");
    expect(aigu.aki.stage).toBe(1);
    expect(aigu.primary).toBe("cg");                                           // Cockcroft-Gault ≈ 23 ⇒ sévère
    expect(aigu.stage).toBe("severe");
    expect(aigu.warnings.some((w) => w.fr.includes("KDIGO"))).toBe(true);
  });

  it("enfant : CKID U25 décide, et refuse sans taille", () => {
    const ok = chooseStage({ ageYears: 8, sexe: "m", weightKg: 25, heightCm: 120, scrMgDl: 0.5 });
    expect(ok.primary).toBe("ckid");
    expect(ok.egfrCkid!).toBeCloseTo(99.1, 1);
    expect(ok.stage).toBe("normorenal");
    expect(ok.warnings.some((w) => w.ar.includes("CKID"))).toBe(true);

    const refus = chooseStage({ ageYears: 8, sexe: "m", weightKg: 25, scrMgDl: 0.5 });
    expect(refus.refusal).toBe("height");
  });

  it("entrées incomplètes : refus explicite, pas de stade inventé", () => {
    expect(chooseStage({ ageYears: 0, sexe: "m", weightKg: 70, scrMgDl: 1 }).refusal).toBe("inputs");
    expect(chooseStage({ ageYears: 70, sexe: "m", weightKg: 70, scrMgDl: 0 }).refusal).toBe("inputs");
  });

  it("escalade prudente : DFG 30–90 dégradé ⇒ deux stades plus sévères", () => {
    const base = chooseStage({ ageYears: 78, sexe: "m", weightKg: 68, heightCm: 168, scrMgDl: 1.7 });
    const esc = chooseStage({ ageYears: 78, sexe: "m", weightKg: 68, heightCm: 168, scrMgDl: 1.7, degraded: true });
    expect(esc.escalated).toBe(true);
    expect(esc.baseStage).toBe(base.stage);
    expect(esc.stage).toBe(escalateStage(base.stage, 2));
    expect(esc.warnings.some((w) => w.fr.includes("GPR"))).toBe(true);
  });

  it("escalade refusée pour une molécule vitale avec DFG < 30", () => {
    const esc = chooseStage({
      ageYears: 85, sexe: "m", weightKg: 50, heightCm: 165, scrMgDl: 1.5, degraded: true,
      moleculeId: LIFESAVING_IDS[0],
    });
    expect(esc.baseStage).toBe("moderee");            // CKD-EPI ≈ 45 (dans la zone 30–90)
    expect(esc.crclCg!).toBeLessThan(30);             // Cockcroft-Gault ≈ 25
    expect(esc.escalationExempt).toBe(true);
    expect(esc.escalated).toBe(false);
    expect(esc.warnings.some((w) => w.fr.includes("NON appliquée"))).toBe(true);
  });

  it("poids très bas : CKD-EPI est signalé comme indexé", () => {
    const r = chooseStage({ ageYears: 75, sexe: "f", weightKg: 38, heightCm: 165, scrMgDl: 1.1 });
    expect(r.warningKey).toBe("indexed-low-weight");
    expect(r.warnings.some((w) => w.ar.includes("مُفهرَسة"))).toBe(true);
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

  it("JSON corrompu : plan vide plutôt qu'erreur", () => {
    expect(parsePlan({ version: 2, entries: [{ id: "x" }] }).entries).toHaveLength(0);
    expect(parsePlan("nope").entries).toHaveLength(0);
    expect(parsePlan({ version: 1, entries: [{ id: "a", round: 1, decision: "retenue" }] }).entries).toHaveLength(1);
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

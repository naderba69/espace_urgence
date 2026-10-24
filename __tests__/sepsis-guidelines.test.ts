import { describe, expect, it } from "vitest";
import { decisionTrees } from "../data/trees";
import { protocols } from "../data/protocols";
import { TRIAGE_CASES } from "../data/triage";
import { GCASES } from "../data/guidage";
import { PERFUSIONS } from "../data/perfusions";
import { DETER_RULES } from "../lib/deterioration";

const asText = (value: unknown) => JSON.stringify(value);

describe("SSC 2026 — corrections de contexte sepsis adulte", () => {
  it("ne transforme pas qSOFA seul en outil de dépistage ou d'exclusion", () => {
    const tree = decisionTrees.find((item) => item.id === "choc-septique");
    const triage = TRIAGE_CASES.find((item) => item.id === "choc-sepsis");
    expect(asText(tree)).toMatch(/NEWS\/NEWS2.*MEWS.*SIRS.*qSOFA seul/);
    expect(asText(tree)).toMatch(/ne confirme ni n'exclut le sepsis/);
    expect(asText(triage)).toMatch(/qSOFA.*unique outil/);
    const reeval = DETER_RULES.find((item) => item.id === "sepsis");
    expect(reeval?.title.fr).toMatch(/adulte, non diagnostique/);
    expect(reeval?.when({ age: 54, fr: 24, pas: 95, gcs: 15 })).toBe(true);
    expect(reeval?.when({ age: 17, fr: 24, pas: 95, gcs: 15 })).toBe(false);
    expect(reeval?.when({ fr: 24, pas: 95, gcs: 15 })).toBe(false);
    expect(asText(reeval)).toMatch(/qSOFA bas n'exclut pas le sepsis/);
    expect(asText(reeval)).toMatch(/≤1 h.*≤3 h/);
    expect(asText(reeval)).not.toMatch(/Hour-1 bundle|NaCl 30 ml\/kg si hypotension ou lactate/);
  });

  it("conditionne les fluides adultes, respecte les 3 h et ne réintroduit pas de plafond fixe", () => {
    const tree = decisionTrees.find((item) => item.id === "choc-septique");
    const protocol = protocols.find((item) => item.id === "choc-septique");
    const guide = GCASES.find((item) => item.id === "choc");
    expect(asText(tree)).toMatch(/hypoperfusion induite par le sepsis.*≥30 mL\/kg.*3 premières heures/);
    expect(asText(tree)).not.toMatch(/max 40 mL\/kg|30 mL\/kg RAPIDE|après 30 mL\/kg : PAM/i);
    expect(asText(protocol)).toMatch(/adulte.*≥30 mL\/kg.*3 premières heures/i);
    const fluidStep = guide?.steps.find((step) => step.fr.startsWith("Adulte avec hypoperfusion"));
    expect(fluidStep?.when({ adult: false, sepsisHypoperfusion: true, w: 70 })).toBe(false);
    expect(fluidStep?.when({ adult: true, sepsisHypoperfusion: false, w: 70 })).toBe(false);
    expect(fluidStep?.when({ adult: true, sepsisHypoperfusion: true, w: 70 })).toBe(true);
    expect(guide?.fields.find((field) => field.id === "adult")?.def).toBe(false);
    expect(guide?.fields.find((field) => field.id === "w")?.def).toBe("");
  });

  it("distingue antibiothérapie selon choc/probabilité et préfère le départ périphérique du vasopresseur", () => {
    const tree = decisionTrees.find((item) => item.id === "choc-septique");
    const protocol = protocols.find((item) => item.id === "choc-septique");
    const triage = TRIAGE_CASES.find((item) => item.id === "choc-sepsis");
    const norepi = PERFUSIONS.find((item) => item.drugId === "noradrenaline" && item.label.fr.includes("choc septique"));
    expect(asText(tree)).toMatch(/sepsis possible sans choc.*3 h/i);
    expect(asText(tree)).toMatch(/faible probabilité sans choc.*différer/i);
    expect(asText(protocol)).toMatch(/probable\/confirmé.*1 h.*possible sans choc.*3 h/i);
    expect(asText(tree)).toMatch(/voie périphérique.*plutôt que retarder/i);
    expect(asText(triage)).toMatch(/PAM initiale.*65 mmHg.*60–65/);
    expect(asText(triage)).not.toMatch(/PAS < 65/);
    expect(norepi?.warnings?.fr).toMatch(/début périphérique plutôt que retarder/i);
    expect(norepi?.source).toMatch(/RE\.NAU.*2026/);
  });
});

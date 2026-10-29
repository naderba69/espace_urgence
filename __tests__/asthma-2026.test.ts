import { describe, expect, it } from "vitest";
import { protocols } from "@/data/protocols";
import { getMedication } from "@/data/medications";
import { revals } from "@/data/reval";

describe("actualisation GINA 2026 — asthme aigu", () => {
  const protocol = protocols.find((item) => item.id === "asthme-aigu-grave");
  const protocolText = protocol ? JSON.stringify(protocol) : "";

  it("borne le schéma d'âge et reprend les critères GINA d'oxygène et de gravité", () => {
    expect(protocol).toBeDefined();
    expect(protocolText).toMatch(/GINA.*≥6 ans|adultes.*enfants ≥6 ans/i);
    expect(protocolText).toContain("SpO₂ <92 %");
    expect(protocolText).toContain("92–95 %");
    expect(protocolText).toContain("FR >30/min");
    expect(protocolText).toContain("PEF <50 %");
    expect(protocolText).toMatch(/adrénaline IM en premier/i);
  });

  it("reprend les doses adultes/enfants et les critères de sortie avec suivi", () => {
    expect(protocolText).toContain("6–10 bouffées");
    expect(protocolText).toContain("5 mg nébulisés");
    expect(protocolText).toContain("40–50 mg PO");
    expect(protocolText).toContain("1–2 mg/kg/j (max. 40 mg)");
    expect(protocolText).toMatch(/1–2 h après la dernière dose/);
    expect(protocolText).toContain("PEF >70 %");
    expect(protocolText).toContain("suivi dans la semaine");
  });

  it("relie le protocole aux fiches sourcées et ne présente pas les stocks comme vérifiés", () => {
    expect(protocol?.medications).toEqual(expect.arrayContaining(["salbutamol", "ipratropium", "prednisolone"]));
    expect(getMedication("salbutamol")?.meta.sources.join(" ")).toContain("GINA Strategy Report 2026");
    expect(getMedication("ipratropium")?.meta.sources.join(" ")).toContain("Sydney Children's Hospitals Network");
    expect(getMedication("prednisolone")?.dosePediatric.fr).toContain("1–2 mg/kg/j");
    expect(getMedication("prednisolone")?.brands).toBe("");
    expect(getMedication("hydrocortisone")?.doseAdult.fr).toContain("NHS GGC");
    expect(getMedication("hydrocortisone")?.meta.sources.join(" ")).toContain("Sydney Children's Hospitals Network");
    expect(getMedication("sulfate-magnesium")?.dosePediatric.fr).toContain("aucune dose MgSO₄ n'est calculée");
  });

  it("harmonise la réévaluation sans seuil obsolète de sortie ni MgSO₄ automatique", () => {
    const revaluation = revals["asthme-aigu-grave"];
    const revaluationText = JSON.stringify(revaluation);
    expect(revaluation.intervalMin).toBe(20);
    expect(revaluationText).toContain("stabilité 1–2 h depuis la dernière dose");
    expect(revaluationText).toContain("PEF >70 %");
    expect(revaluationText).not.toContain("Surveillance ≥ 4 h avant toute sortie");
    expect(revaluationText).toMatch(/MgSO₄ IV sélectif/);
    expect(revaluationText).not.toMatch(/Intubation immédiate/);
  });
});

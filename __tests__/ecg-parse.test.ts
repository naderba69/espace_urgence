import { describe, expect, it } from "vitest";
import { parseEcgResponse, sanitizeEcgAnalysis } from "@/lib/ecg-parse";

describe("assainissement de réponses IA ECG", () => {
  it("ne conserve que des observations descriptives bornées", () => {
    const parsed = parseEcgResponse(JSON.stringify({
      rhythm: "sinusal",
      heartRateBpm: 72,
      intervals: "PR estimé 160 ms",
      stSegment: "sans élévation clairement visible",
      summary: "ne doit pas être affiché",
      suspectedDiagnosis: "diagnostic libre interdit",
      severity: "critical",
      confidence: 1.7,
      immediateRecommendations: ["traiter immédiatement"],
      protocolIds: ["acr-adulte"],
    }));

    expect(parsed).toEqual({
      rhythm: "sinusal",
      heartRateBpm: 72,
      intervals: "PR estimé 160 ms",
      stSegment: "sans élévation clairement visible",
      tWave: undefined,
      hyperkalemiaSigns: undefined,
      avBlockSigns: undefined,
    });
    expect(parsed).not.toHaveProperty("summary");
    expect(parsed).not.toHaveProperty("suspectedDiagnosis");
    expect(parsed).not.toHaveProperty("immediateRecommendations");
    expect(parsed).not.toHaveProperty("protocolIds");
    expect(parsed).not.toHaveProperty("severity");
    expect(parsed).not.toHaveProperty("confidence");
  });

  it("retire les nombres hors plage sans les interpréter comme une décision clinique", () => {
    expect(parseEcgResponse(JSON.stringify({ heartRateBpm: 500, rhythm: "illisible" }))).toMatchObject({ rhythm: "illisible" });
    expect(parseEcgResponse(JSON.stringify({ heartRateBpm: "Infinity", rhythm: "illisible" }))).toMatchObject({ heartRateBpm: undefined });
    expect(parseEcgResponse(JSON.stringify({ heartRateBpm: 72 }))).toMatchObject({ heartRateBpm: 72 });
  });

  it("rejette les réponses malformées, surdimensionnées et sans observation affichable", () => {
    expect(parseEcgResponse("not JSON")).toBeNull();
    expect(parseEcgResponse("x".repeat(8_001))).toBeNull();
    expect(parseEcgResponse(JSON.stringify({ suspectedDiagnosis: "diagnostic seulement", immediateRecommendations: ["agir"] }))).toBeNull();
    expect(parseEcgResponse(JSON.stringify({ summary: "diagnostic ou conduite libre" }))).toBeNull();
    expect(parseEcgResponse(JSON.stringify({ rhythm: { untrusted: true } }))).toBeNull();
  });

  it("borne la longueur des champs et retire les contrôles de formatage bidi", () => {
    const parsed = parseEcgResponse(JSON.stringify({ rhythm: `  sinus\n${"x".repeat(400)}  ` }));
    expect(parsed?.rhythm).toHaveLength(240);
    expect(parsed?.rhythm).not.toContain("\n");

    const spoofed = parseEcgResponse(JSON.stringify({ rhythm: "Rythme \u202Etexte masqué\u2069" }));
    expect(spoofed?.rhythm).toBe("Rythme texte masqué");
    expect(spoofed?.rhythm).not.toMatch(/[\u061c\u200e\u200f\u202a-\u202e\u2066-\u206f]/);
  });

  it("nettoie aussi les anciens résultats persistés en IndexedDB", () => {
    const legacy = sanitizeEcgAnalysis({
      rhythm: "sinusal",
      heartRateBpm: 900,
      suspectedDiagnosis: "ancienne chaîne diagnostique",
      immediateRecommendations: ["ancienne consigne"],
      severity: "critical",
      confidence: 0.99,
      protocolIds: ["acr-adulte"],
      raw: "texte libre historique",
    });
    expect(legacy).toMatchObject({ rhythm: "sinusal", heartRateBpm: undefined });
    expect(legacy).not.toHaveProperty("suspectedDiagnosis");
    expect(legacy).not.toHaveProperty("immediateRecommendations");
    expect(legacy).not.toHaveProperty("severity");
  });
});

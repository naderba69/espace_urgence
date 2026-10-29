import { describe, expect, it } from "vitest";
import { parseAiSearchKeywords } from "@/lib/ai-search";

describe("parseAiSearchKeywords", () => {
  it("accepte de 1 à 3 mots médicaux nus en français ou en arabe", () => {
    expect(parseAiSearchKeywords("insuffisance rénale aiguë")).toBe("insuffisance rénale aiguë");
    expect(parseAiSearchKeywords("فشل كلوي حاد")).toBe("فشل كلوي حاد");
    expect(parseAiSearchKeywords("AVC")).toBe("AVC");
  });

  it("refuse chiffres, prose, ponctuation, sortie trop longue et mots surdimensionnés", () => {
    expect(parseAiSearchKeywords("Dose 2 mg")).toBeNull();
    expect(parseAiSearchKeywords("Voici les mots-clés : AVC" )).toBeNull();
    expect(parseAiSearchKeywords("AVC; urgence")).toBeNull();
    expect(parseAiSearchKeywords("un deux trois quatre")).toBeNull();
    expect(parseAiSearchKeywords("A".repeat(41))).toBeNull();
    expect(parseAiSearchKeywords("A".repeat(501))).toBeNull();
    expect(parseAiSearchKeywords("   ")).toBeNull();
  });
});

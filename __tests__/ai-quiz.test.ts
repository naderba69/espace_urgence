import { describe, expect, it } from "vitest";
import { AiQuizValidationError, parseGeneratedAiQuiz } from "@/lib/ai-quiz";

const validQuiz = Array.from({ length: 5 }, (_, i) => ({
  question: `Question pédagogique ${String.fromCharCode(65 + i)}`,
  options: ["Réponse correcte", "Autre proposition", "Troisième choix", "Quatrième choix"],
  correct: 0,
  explanation: "Comparer cette explication au protocole et à ses sources.",
}));

function json(items: unknown = validQuiz): string {
  return JSON.stringify(items);
}

describe("parseGeneratedAiQuiz", () => {
  it("accepte exactement cinq questions conformes, sans nombres ni unités", () => {
    expect(parseGeneratedAiQuiz(`Voici le quiz :\n\`\`\`json\n${json()}\n\`\`\``)).toHaveLength(5);
  });

  it("refuse un JSON invalide, un tableau incomplet et une structure malformée", () => {
    for (const raw of ["pas du JSON", json(validQuiz.slice(0, 4)), json([{ ...validQuiz[0], correct: 9 }])]) {
      expect(() => parseGeneratedAiQuiz(raw)).toThrow(AiQuizValidationError);
    }
  });

  it("refuse les nombres ASCII, chiffres arabes et unités de dose dans tout champ", () => {
    const cases = [
      { ...validQuiz[0], question: "Question 1" },
      { ...validQuiz[0], options: ["الإجابة ٢", ...validQuiz[0].options.slice(1)] },
      { ...validQuiz[0], explanation: "Dose à 5 mg/kg" },
      { ...validQuiz[0], options: ["Perfusion en mL", ...validQuiz[0].options.slice(1)] },
    ];
    for (const item of cases) {
      const quiz = [...validQuiz];
      quiz[0] = item;
      expect(() => parseGeneratedAiQuiz(json(quiz))).toThrow(AiQuizValidationError);
      try { parseGeneratedAiQuiz(json(quiz)); } catch (error) {
        expect(error).toMatchObject({ reason: "numeric-content" });
      }
    }
  });

  it("rejette les propriétés inattendues au lieu de les ignorer", () => {
    const quiz = [...validQuiz];
    quiz[0] = { ...quiz[0], protocolIds: ["acr-adulte"] } as typeof quiz[number];
    expect(() => parseGeneratedAiQuiz(json(quiz))).toThrow(AiQuizValidationError);
  });
});

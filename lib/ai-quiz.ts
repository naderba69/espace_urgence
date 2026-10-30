import { z } from "zod";

const QuizItemSchema = z.object({
  question: z.string().trim().min(1).max(300),
  options: z.array(z.string().trim().min(1).max(180)).length(4),
  correct: z.number().int().min(0).max(3),
  explanation: z.string().trim().min(1).max(500),
}).strict();

const QuizSchema = z.array(QuizItemSchema).length(5);

export type AiQuizItem = z.infer<typeof QuizItemSchema>;

export class AiQuizValidationError extends Error {
  constructor(readonly reason: "format" | "numeric-content") {
    super(reason);
    this.name = "AiQuizValidationError";
  }
}

/**
 * Valide strictement la forme d'un QCM généré. Ce contrôle ne valide pas sa vérité médicale.
 * Les chiffres et unités sont refusés pour empêcher la génération de doses/seuils actionnables.
 */
export function parseGeneratedAiQuiz(raw: string): AiQuizItem[] {
  const text = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start < 0 || end < start) throw new AiQuizValidationError("format");

  let unknown: unknown;
  try {
    unknown = JSON.parse(text.slice(start, end + 1));
  } catch {
    throw new AiQuizValidationError("format");
  }
  const result = QuizSchema.safeParse(unknown);
  if (!result.success) throw new AiQuizValidationError("format");

  const allText = result.data.flatMap((item) => [item.question, ...item.options, item.explanation]).join(" ");
  if (/[0-9\u0660-\u0669\u06f0-\u06f9]/u.test(allText)
    || /\b(?:mg|mcg|µg|μg|mL|ml|mmol|mmHg|UI|J\/kg|mg\/kg|unités?)\b/iu.test(allText)) {
    throw new AiQuizValidationError("numeric-content");
  }

  return result.data;
}

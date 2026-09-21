// v2.9 — schémas zod : validation structurelle des données cliniques au build/test.
import { z } from "zod";

export const LocalizedSchema = z.object({ fr: z.string().min(1), ar: z.string().min(1) });

export const PumpUnitSchema = z.enum([
  "µg/kg/min", "µg/min", "µg/h", "µg/kg/h",
  "mg/h", "mg/kg/h", "mg/min",
  "UI/h", "UI/kg/h", "g/h",
]);

export const PerfusionSchema = z.object({
  drugId: z.string().min(1),
  label: LocalizedSchema,
  prep: LocalizedSchema,
  concUgPerMl: z.number().positive(),
  unit: PumpUnitSchema,
  doseMin: z.number().min(0),
  doseMax: z.number().positive(),
  doseStep: z.number().positive(),
  doseStart: z.number().optional(),
  weightBased: z.boolean(),
  note: LocalizedSchema.optional(),
  bolus: LocalizedSchema.optional(),
  warnings: LocalizedSchema.optional(),
  tips: LocalizedSchema.optional(),
  source: z.string().optional(),
}).refine((p) => p.doseMax >= p.doseMin, { message: "doseMax doit être au moins doseMin (dose fixe admise)" });

export const CalculatorMetaSchema = z.object({
  id: z.string().min(1),
  title: LocalizedSchema,
  description: LocalizedSchema,
  href: z.string().startsWith("/"),
  icon: z.string().min(1),
  meta: z.object({ sources: z.array(z.string().min(1)).min(1), lastReviewed: z.string().regex(/^\d{4}-\d{2}$/) }),
});

export const QuizItemSchema = z.object({
  cat: z.enum(["med", "proc", "score", "triage"]),
  q: LocalizedSchema,
  options: z.array(LocalizedSchema).length(4),
  correct: z.number().int().min(0).max(3),
  why: LocalizedSchema,
});

export const ReviewMetaSchema = z.object({
  sources: z.array(z.string().min(1)).min(1),
  lastReviewed: z.string().regex(/^\d{4}-\d{2}$/),
});

export const ProtocolSchema = z.object({
  id: z.string().min(1),
  title: LocalizedSchema,
  steps: z.array(z.object({ title: LocalizedSchema })).min(1),
  meta: ReviewMetaSchema,
});

export const MedicationSchema = z.object({
  id: z.string().min(1),
  name: LocalizedSchema,
  meta: ReviewMetaSchema,
});

export const ProcedureSchema = z.object({
  id: z.string().min(1),
  title: LocalizedSchema,
  equipment: z.array(LocalizedSchema).min(1),
  steps: z.array(LocalizedSchema).min(1),
  nursing: z.array(LocalizedSchema).min(1),
  timeTarget: LocalizedSchema.optional(),
  stepTimes: z.array(z.number().positive()).optional(),
  meta: ReviewMetaSchema,
});

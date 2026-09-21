"use client";
// v9.2 — la page reste un coquillage : le corps (testable, minuteur paramétrable)
// vit dans components/QuizGame.tsx (Next 16 interdit props/exports custom sur la page).
import QuizGame from "@/components/QuizGame";

export default function QuizPage() {
  return <QuizGame />;
}

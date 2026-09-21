import { notFound } from "next/navigation";
import { medications } from "@/data/medications";
import MedicationDetail from "@/components/details/MedicationDetail";
import { medicationDetailProps } from "@/lib/medication-props";

export function generateStaticParams() {
  return medications.map((m) => ({ id: m.id }));
}

export default async function MedicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const medication = medications.find((m) => m.id === id);
  if (!medication) notFound();
  // v17.2 — alternatives, préparations PSE et protocoles liés résolus au build.
  return <MedicationDetail {...medicationDetailProps(medication)} />;
}

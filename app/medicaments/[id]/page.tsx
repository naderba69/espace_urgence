import { notFound } from "next/navigation";
import { medications } from "@/data/medications";
import MedicationDetail from "@/components/details/MedicationDetail";

export function generateStaticParams() {
  return medications.map((m) => ({ id: m.id }));
}

export default async function MedicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const medication = medications.find((m) => m.id === id);
  if (!medication) notFound();
  return <MedicationDetail medication={medication} />;
}

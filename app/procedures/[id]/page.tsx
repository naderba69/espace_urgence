import { notFound } from "next/navigation";
import { procedures } from "@/data/procedures";
import ProcedureDetail from "@/components/details/ProcedureDetail";

export function generateStaticParams() {
  return procedures.map((p) => ({ id: p.id }));
}

export default async function ProcedurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const procedure = procedures.find((p) => p.id === id);
  if (!procedure) notFound();
  return <ProcedureDetail procedure={procedure} />;
}

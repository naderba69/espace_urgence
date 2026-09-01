import { notFound } from "next/navigation";
import { protocols } from "@/data/protocols";
import ProtocolDetail from "@/components/details/ProtocolDetail";

export function generateStaticParams() {
  return protocols.map((p) => ({ id: p.id }));
}

export default async function ProtocolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const protocol = protocols.find((p) => p.id === id);
  if (!protocol) notFound();
  return <ProtocolDetail protocol={protocol} />;
}

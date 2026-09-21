import { notFound } from "next/navigation";
import { protocols } from "@/data/protocols";
import ProtocolDetail from "@/components/details/ProtocolDetail";
import { protocolDetailProps } from "@/lib/protocol-props";

export function generateStaticParams() {
  return protocols.map((p) => ({ id: p.id }));
}

export default async function ProtocolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const protocol = protocols.find((p) => p.id === id);
  if (!protocol) notFound();
  // v17.2 — enrichissement au build : la fiche cliente reste légère.
  return <ProtocolDetail {...protocolDetailProps(protocol)} />;
}

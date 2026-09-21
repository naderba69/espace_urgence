import { notFound } from "next/navigation";
import TreeRunner from "@/components/trees/TreeRunner";
import { decisionTrees, getTree } from "@/data/trees";

export function generateStaticParams() {
  return decisionTrees.map((t) => ({ id: t.id }));
}

export default async function TreePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tree = getTree(id);
  if (!tree) notFound();
  return <TreeRunner tree={tree} />;
}

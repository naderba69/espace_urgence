// Liste des procédures d'urgence.
import Link from "next/link";
import { procedures } from "@/data/procedures";
import T from "@/components/T";
import { ClipboardList } from "lucide-react";

export default function ProceduresPage() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {procedures.map((p) => (
        <li key={p.id}>
          <Link
            href={`/procedures/${p.id}`}
            className="card flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 font-bold hover:border-teal-600 transition"
          >
            <span className="rounded-xl bg-teal-600/15 p-3 text-teal-500"><ClipboardList className="h-6 w-6" /></span>
            <T fr={p.title.fr} ar={p.title.ar} />
            {p.checklist && (
              <span className="ms-auto rounded-lg bg-amber-500/15 px-2 py-1 text-xs font-black text-amber-500">
                checklist
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

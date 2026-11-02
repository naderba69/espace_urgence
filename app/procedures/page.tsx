// Liste des procédures d'urgence.
import Link from "next/link";
import { procedures } from "@/data/procedures";
import T from "@/components/T";
import PageHeader from "@/components/ui/PageHeader";
import { ClipboardList } from "lucide-react";

export default function ProceduresPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        icon={<ClipboardList className="h-6 w-6" />}
        title={<T fr="Procédures d’urgence" ar="إجراءات الاستعجالي" />}
        sub={<T fr="Gestes techniques et listes de contrôle des procédures." ar="الخطوات التقنية وقوائم التحقق من الإجراءات." />}
        count={procedures.length}
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {procedures.map((procedure) => (
          <li key={procedure.id}>
            <Link
              href={`/procedures/${procedure.id}`}
              className="card flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 font-bold transition hover:border-blue-600"
            >
              <span className="rounded-xl bg-blue-600/15 p-3 text-blue-500" aria-hidden>
                <ClipboardList className="h-6 w-6" />
              </span>
              <T fr={procedure.title.fr} ar={procedure.title.ar} />
              {procedure.checklist && (
                <span className="ms-auto rounded-lg bg-amber-500/15 px-2 py-1 text-xs font-black text-amber-500">
                  <T fr="Liste de contrôle" ar="قائمة تحقق" />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

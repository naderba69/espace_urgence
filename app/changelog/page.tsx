"use client";
// v2.1 — سجل المستجدات داخل التطبيق.
import { CHANGELOG } from "@/data/changelog";
import T from "@/components/T";
import { Sparkles } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function ChangelogPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <PageHeader icon={<Sparkles className="h-6 w-6" />} title={<T fr="Nouveautés" ar="سجل المستجدات" />} />
      {CHANGELOG.map((r) => (
        <section key={r.v} className="card rounded-2xl border border-line bg-surface p-4">
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-lg font-black text-blue-500" dir="ltr">v{r.v}</p>
            <p className="text-xs font-bold opacity-60 tabular-nums" dir="ltr">{r.date}</p>
          </div>
          <ul className="list-inside list-disc flex flex-col gap-1 text-sm font-semibold opacity-90">
            {r.notes.map((n, i) => (
              <li key={i}><T fr={n.fr} ar={n.ar} /></li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

"use client";
// Hub des arbres décisionnels interactifs.
import Link from "next/link";
import { decisionTrees } from "@/data/trees";
import T from "@/components/T";
import { useApp } from "@/components/Providers";
import { Activity, AlertTriangle, Bone, Brain, Droplets, GitBranch, HandHelping, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = { Activity, AlertTriangle, Bone, Brain, Droplets, GitBranch, HandHelping };

export default function TreesHub() {
  const { lang } = useApp();
  const pick = (l: { fr: string; ar: string }) => (lang === "ar" ? l.ar : l.fr);
  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-extrabold"><T fr="Arbres décisionnels" ar="أشجار القرار" /></h1>
        <p className="mt-1 text-sm opacity-70">
          <T fr="Protocoles vitaux guidés étape par étape — minuteries, doses en direct, journal horodaté imprimable."
             ar="بروتوكولات حيوية موجهة خطوة بخطوة — مؤقتات، جرعات مباشرة، سجل موقوت قابل للطباعة." />
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {decisionTrees.map((t) => {
          const Icon = ICONS[t.icon] ?? GitBranch;
          return (
            <li key={t.id}>
              <Link href={`/arbres/${t.id}`}
                className="card flex h-full items-start gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:border-red-600">
                <span className="rounded-xl bg-red-600/15 p-3 text-red-500">
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <span>
                  <span className="block font-bold">{pick(t.title)}</span>
                  <span className="mt-1 block text-sm opacity-70">{pick(t.description)}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

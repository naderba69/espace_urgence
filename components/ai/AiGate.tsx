"use client";
// Carte « IA à configurer » — affichée gracieusement quand aucune clé n'est fournie.
import Link from "next/link";
import { BrainCircuit, Settings2 } from "lucide-react";
import { useApp } from "@/components/Providers";
import { aiReady } from "@/lib/ai-config";
import { useEffect, useState, type ReactNode } from "react";

export default function AiGate({ children, title }: { children: ReactNode; title: string }) {
  const { t } = useApp();
  const [ready, setReady] = useState<boolean | null>(null);

  useEffect(() => setReady(aiReady()), []);

  if (ready === null) return null;
  if (!ready) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-dashed border-teal-600/50 bg-teal-600/5 p-8 text-center">
        <BrainCircuit className="h-12 w-12 text-teal-500" aria-hidden />
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="opacity-70">{t("ai.notConfigured")}</p>
        <Link href="/parametres" className="touch gap-2 rounded-xl bg-teal-600 px-5 py-3 font-bold text-white hover:bg-teal-500">
          <Settings2 className="h-5 w-5" aria-hidden /> {t("ai.configure")}
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}

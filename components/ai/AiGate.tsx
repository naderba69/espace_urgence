"use client";
// Carte « IA à configurer » — affichée gracieusement quand aucune clé n'est fournie.
import Link from "next/link";
import { BrainCircuit, Settings2 } from "lucide-react";
import { useApp } from "@/components/Providers";
import { aiReady, subscribeAiConfig } from "@/lib/ai-config";
import { useSyncExternalStore, type ReactNode } from "react";

export default function AiGate({ children, title }: { children: ReactNode; title: string }) {
  const { t } = useApp();
  // Snapshot serveur null (rend rien) → pas de mismatch d'hydratation ;
  // le client bascule sur aiReady() dès l'hydratation, puis suit writeAiConfig.
  const ready = useSyncExternalStore<boolean | null>(subscribeAiConfig, aiReady, () => null);

  if (ready === null) return null;
  if (!ready) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-dashed border-blue-600/50 bg-blue-600/5 p-8 text-center">
        <BrainCircuit className="h-12 w-12 text-blue-500" aria-hidden />
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="opacity-70">{t("ai.notConfigured")}</p>
        <Link href="/parametres" className="touch gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500">
          <Settings2 className="h-5 w-5" aria-hidden /> {t("ai.configure")}
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}

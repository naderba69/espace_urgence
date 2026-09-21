"use client";
// v2.1 — bandeau « mise à jour prête » : le SW est déjà installé, il faut recharger.
import { RefreshCw, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { useApp } from "./Providers";
import T from "./T";

export default function UpdateBanner() {
  const { updateReady, dismissUpdate } = useApp();
  if (!updateReady) return null;
  return (
    <div className="fixed inset-x-3 bottom-20 z-[90] sm:inset-x-auto sm:end-4 sm:bottom-4 sm:w-96" role="status">
      <div className="card flex items-center gap-3 rounded-2xl border border-blue-500/60 bg-[color:var(--surface)] p-3 shadow-2xl">
        <span className="rounded-xl bg-blue-600 p-2 text-white"><RefreshCw className="h-5 w-5" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black"><T fr="Mise à jour installée" ar="نُصّب تحديث جديد" /></p>
          <p className="break-words text-xs opacity-70"><T fr="Rechargez pour les derniers protocoles." ar="أعد التحميل للحصول على أحدث البروتوكولات." /></p>
        </div>
        <Link href="/changelog" className="rounded-xl border border-line p-2 hover:bg-[color:var(--surface-2)]" aria-label="changelog">
          <Sparkles className="h-4 w-4" aria-hidden />
        </Link>
        <button onClick={() => window.location.reload()}
          className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-black text-white active:scale-[.97]">
          <T fr="Recharger" ar="تحديث" />
        </button>
        <button onClick={dismissUpdate} className="rounded-xl border border-line p-2 hover:bg-[color:var(--surface-2)]" aria-label="fermer">
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

"use client";
// Carte de protocole (liste) : titre bilingue + badge de gravité + étoile favori.
import type { Protocol } from "@/data/types";
import { useApp } from "@/components/Providers";
import { FavoriteButton } from "@/components/Chrome";
import { Flame, AlertTriangle, Info } from "lucide-react";

const SEV = {
  critical: { Icon: Flame, cls: "bg-red-500/15 text-red-400 border-red-500/40" },
  urgent: { Icon: AlertTriangle, cls: "bg-amber-500/15 text-amber-400 border-amber-500/40" },
  standard: { Icon: Info, cls: "bg-sky-500/15 text-sky-400 border-sky-500/40" },
} as const;

export default function ProtocolCard({ protocol }: { protocol: Protocol }) {
  const { lang } = useApp();
  const sev = SEV[protocol.severity];
  return (
    <div className="card flex items-start justify-between gap-3 rounded-2xl border border-line bg-surface p-4 hover:border-teal-600 transition">
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 inline-flex rounded-lg border p-1.5 ${sev.cls}`}>
          <sev.Icon className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="font-bold leading-snug">{lang === "ar" ? protocol.title.ar : protocol.title.fr}</p>
          <p className="mt-1 text-xs opacity-60">
            {protocol.steps.length} {lang === "ar" ? "خطوات" : "étapes"} · {protocol.meta.lastReviewed}
          </p>
        </div>
      </div>
      <span onClick={(e) => e.preventDefault()}>
        <FavoriteButton itemKey={`protocole:${protocol.id}`} />
      </span>
    </div>
  );
}

"use client";
// v9.2 — Carte de médicament (liste) : neutre MDCalc, liseré rouge + badge
// « haut risque » unifiés quand le médicament l'exige.
import Link from "next/link";
import type { Medication } from "@/data/types";
import { useApp } from "@/components/Providers";
import { FavoriteButton } from "@/components/Chrome";
import Badge from "@/components/ui/Badge";
import { ShieldAlert } from "lucide-react";

export default function MedicationCard({ medication: m }: { medication: Medication }) {
  const { lang, t } = useApp();
  return (
    <div
      className={`card ${m.highRisk ? "sev-strip sev-critical" : ""} flex h-full items-start justify-between gap-2 rounded-2xl border border-line bg-surface p-4 transition hover:border-blue-600/50`}
    >
      <Link href={`/medicaments/${m.id}`} className="min-w-0 flex-1">
        {m.highRisk && (
          <div className="mb-1.5">
            <Badge tone="critical">
              <ShieldAlert className="h-3 w-3" aria-hidden /> {t("common.highRisk")}
            </Badge>
          </div>
        )}
        <p className="font-bold leading-snug">{lang === "ar" ? m.name.ar : m.name.fr}</p>
        <p className="mt-1 text-sm opacity-70">{lang === "ar" ? m.klass.ar : m.klass.fr}</p>
        {m.brands && <p className="mt-1 line-clamp-2 text-xs opacity-50">{m.brands}</p>}
      </Link>
      <span onClick={(e) => e.preventDefault()}>
        <FavoriteButton itemKey={`medicament:${m.id}`} />
      </span>
    </div>
  );
}

"use client";
// v9.1 — Carte de protocole (liste) : liseré de gravité + badge sémantique unifié
// (jetons .sev-* de globals.css), titre bilingue, méta compacte, étoile favori.
//
// v17.3 — la carte ne consomme plus qu'un RÉSUMÉ (`ProtocolCardData`) : la liste /protocoles
// n'a pas besoin des étapes, des points-clés ni des médicaments de chaque fiche. Une fiche
// complète (`Protocol`) satisfait cette forme, la carte reste donc utilisable partout.
import type { Localized } from "@/data/types";
import { useApp } from "@/components/Providers";
import { FavoriteButton } from "@/components/Chrome";
import Badge from "@/components/ui/Badge";

/** Le strict nécessaire affiché par la carte de liste. */
export interface ProtocolCardData {
  id: string;
  title: Localized;
  severity: "critical" | "urgent" | "standard";
  /** Nombre d'étapes (seul le compte est affiché). */
  stepsCount: number;
  /** Date de dernière revue éditoriale. */
  lastReviewed: string;
}

/** Convertit une fiche complète en résumé (utile hors de la liste). */
export function toCardData(p: {
  id: string;
  title: Localized;
  severity: "critical" | "urgent" | "standard";
  steps: readonly unknown[];
  meta: { lastReviewed: string };
}): ProtocolCardData {
  return {
    id: p.id,
    title: p.title,
    severity: p.severity,
    stepsCount: p.steps.length,
    lastReviewed: p.meta.lastReviewed,
  };
}

export default function ProtocolCard({ data }: { data: ProtocolCardData }) {
  const { lang, t } = useApp();
  return (
    <div
      className={`card sev-strip sev-${data.severity} flex items-start justify-between gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:border-blue-600/50`}
    >
      <div className="min-w-0">
        <div className="mb-1.5">
          <Badge tone={data.severity}>{t(`sev.${data.severity}`)}</Badge>
        </div>
        <p className="font-bold leading-snug">{lang === "ar" ? data.title.ar : data.title.fr}</p>
        <p className="mt-1 text-xs opacity-60 tabular-nums">
          {data.stepsCount} {lang === "ar" ? "خطوات" : "étapes"} · {data.lastReviewed}
        </p>
      </div>
      <span onClick={(e) => e.preventDefault()}>
        <FavoriteButton itemKey={`protocole:${data.id}`} />
      </span>
    </div>
  );
}

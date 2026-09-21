"use client";
// v10.0-b — Gabarit M3 d'en-tête de page : puce d'icône teintée + titre + sous-titre + compteur.
// Utilisé par toutes les pages-listes (charte : un seul gabarit d'en-tête).
import type { ReactNode } from "react";
import Badge from "./Badge";

export default function PageHeader({
  icon,
  title,
  sub,
  count,
}: {
  icon: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  count?: number;
}) {
  return (
    <header className="flex items-center gap-3">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0">
        <h1 className="flex flex-wrap items-center gap-2 text-2xl font-black tracking-tight">
          {title}
          {typeof count === "number" && <Badge tone="accent">{count}</Badge>}
        </h1>
        {sub && <p className="text-sm opacity-70">{sub}</p>}
      </div>
    </header>
  );
}

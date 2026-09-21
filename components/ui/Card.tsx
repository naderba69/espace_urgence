// v9.0 — Carte de base : surface + bordure + ombre token. Utiliser PARTOUT au lieu
// de réécrire « rounded-2xl border border-line bg-surface … » à chaque écran.
import type { ReactNode } from "react";
import Link from "next/link";

export default function Card({
  children,
  href,
  className = "",
  strip,
  as = "div",
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  /** Liseré latéral de gravité (jetons .sev-*) */
  strip?: "critical" | "urgent" | "standard";
  as?: "div" | "section" | "li";
}) {
  const cls = `card rounded-2xl border border-line bg-surface ${strip ? `sev-strip sev-${strip}` : ""} ${className}`;
  if (href) {
    return (
      <Link href={href} className={`${cls} block transition hover:border-blue-600/50`}>
        {children}
      </Link>
    );
  }
  const Tag = as;
  return <Tag className={cls}>{children}</Tag>;
}

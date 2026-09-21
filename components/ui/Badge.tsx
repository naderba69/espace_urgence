// v9.0 — Badge sémantique unifié (gravité + tons utilitaires).
// Les classes vivent dans globals.css (.sev-*) : une seule source de vérité.
import type { ReactNode } from "react";

export type BadgeTone = "critical" | "urgent" | "standard" | "accent" | "neutral";

const TONE_CLS: Record<BadgeTone, string> = {
  critical: "sev-badge sev-critical",
  urgent: "sev-badge sev-urgent",
  standard: "sev-badge sev-standard",
  accent: "sev-badge sev-accent",
  neutral: "sev-badge sev-neutral",
};

export default function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return <span className={`${TONE_CLS[tone]} ${className}`}>{children}</span>;
}

// v9.0 — Titre de section unifié : barre d'accent + icône optionnelle.
import type { ReactNode } from "react";

export default function SectionTitle({
  id,
  icon,
  children,
}: {
  id?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <h2 id={id} className="mb-3 flex items-center gap-2 text-lg font-bold">
      <span className="h-5 w-1 shrink-0 rounded-full" style={{ background: "var(--accent)" }} aria-hidden />
      {icon}
      {children}
    </h2>
  );
}

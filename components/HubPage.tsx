"use client";
// Page-hub d'une spécialité : protocoles + médicaments + contenu spécifique.
import Link from "next/link";
import type { ReactNode } from "react";
import { useApp } from "./Providers";
import { ScrollText, Pill, Stethoscope } from "lucide-react";
import PageHeader from "./ui/PageHeader";

export default function HubPage({
  title, intro, linkedProtos, linkedMeds, children, icon,
}: {
  title: { fr: string; ar: string };
  intro?: { fr: string; ar: string };
  /** Protocoles et médicaments déjà résolus (id + titre) par la page serveur. */
  linkedProtos: { id: string; title: { fr: string; ar: string } }[];
  linkedMeds?: { id: string; name: { fr: string; ar: string } }[];
  children?: ReactNode;
  icon?: ReactNode;
}) {
  const { lang } = useApp();
  // v17.2 — la page serveur fournit déjà les titres liés (voir app/pediatrie/page.tsx) :
  // les bases complètes ne sont plus téléchargées par les pages de spécialité.
  const protos = linkedProtos;
  const meds = linkedMeds ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* v10.0-c — en-tête M3 unifié pour toutes les spécialités */}
      <PageHeader
        icon={icon ?? <Stethoscope className="h-6 w-6" />}
        title={lang === "ar" ? title.ar : title.fr}
        sub={intro ? (lang === "ar" ? intro.ar : intro.fr) : undefined}
      />

      {protos.length > 0 && (
        <section>
          <h2 className="mb-2 flex items-center gap-2 font-bold text-blue-500"><ScrollText className="h-5 w-5" /> {lang === "ar" ? "البروتوكولات" : "Protocoles"}</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {protos.map((p) =>
              p ? (
                <li key={p.id}>
                  <Link href={`/protocoles/${p.id}`} className="card block rounded-2xl border border-line bg-surface p-4 font-semibold hover:border-blue-600">
                    {lang === "ar" ? p.title.ar : p.title.fr}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      )}

      {meds.length > 0 && (
        <section>
          <h2 className="mb-2 flex items-center gap-2 font-bold text-blue-500"><Pill className="h-5 w-5" /> {lang === "ar" ? "أدوية رئيسية" : "Médicaments clés"}</h2>
          <ul className="flex flex-wrap gap-2">
            {meds.map((m) =>
              m ? (
                <li key={m.id}>
                  <Link href={`/medicaments/${m.id}`} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface2">
                    {lang === "ar" ? m.name.ar : m.name.fr}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      )}

      {children}
    </div>
  );
}

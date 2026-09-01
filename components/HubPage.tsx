"use client";
// Page-hub d'une spécialité : protocoles + médicaments + contenu spécifique.
import Link from "next/link";
import type { ReactNode } from "react";
import { getProtocol } from "@/data/protocols";
import { getMedication } from "@/data/medications";
import { useApp } from "./Providers";
import { ScrollText, Pill } from "lucide-react";

export default function HubPage({
  title, intro, protocolIds, medicationIds, children,
}: {
  title: { fr: string; ar: string };
  intro?: { fr: string; ar: string };
  protocolIds: string[];
  medicationIds?: string[];
  children?: ReactNode;
}) {
  const { lang } = useApp();
  const protos = protocolIds.map(getProtocol).filter(Boolean);
  const meds = (medicationIds ?? []).map(getMedication).filter(Boolean);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-extrabold">{lang === "ar" ? title.ar : title.fr}</h1>
        {intro && <p className="mt-1 opacity-70">{lang === "ar" ? intro.ar : intro.fr}</p>}
      </header>

      {protos.length > 0 && (
        <section>
          <h2 className="mb-2 flex items-center gap-2 font-bold text-teal-500"><ScrollText className="h-5 w-5" /> {lang === "ar" ? "البروتوكولات" : "Protocoles"}</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {protos.map((p) =>
              p ? (
                <li key={p.id}>
                  <Link href={`/protocoles/${p.id}`} className="card block rounded-2xl border border-line bg-surface p-4 font-semibold hover:border-teal-600">
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
          <h2 className="mb-2 flex items-center gap-2 font-bold text-teal-500"><Pill className="h-5 w-5" /> {lang === "ar" ? "أدوية رئيسية" : "Médicaments clés"}</h2>
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

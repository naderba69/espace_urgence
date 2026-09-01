"use client";
// Détail d'un protocole : étapes numérotées, points-clés, médicaments, sources, impression.
import Link from "next/link";
import type { Protocol } from "@/data/types";
import { getMedication } from "@/data/medications";
import { calculators } from "@/data/calculators";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import { PrintButton, FavoriteButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import { AbbrText } from "@/components/AbbrTooltip";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { CheckSquare, Pill, Calculator, BookOpen, Info } from "lucide-react";

export default function ProtocolDetail({ protocol }: { protocol: Protocol }) {
  const { lang, t } = useApp();
  useRegisterRecent(`protocole:${protocol.id}`);
  useEffect(() => trackEvent("protocol_view", { id: protocol.id }), [protocol.id]);

  const meds = protocol.medications.map(getMedication).filter(Boolean);
  const calcs = calculators.filter((c) => protocol.calculators.includes(c.id));

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            <T fr={protocol.title.fr} ar={protocol.title.ar} />
          </h1>
          {protocol.summary && (
            <p className="mt-2 max-w-2xl text-base leading-relaxed opacity-80">
              <T fr={protocol.summary.fr} ar={protocol.summary.ar} />
            </p>
          )}
          <p className="mt-1 text-sm opacity-70">
            {t("common.lastReviewed")} : {protocol.meta.lastReviewed}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton itemKey={`protocole:${protocol.id}`} />
          <PrintButton />
        </div>
      </header>

      {/* Étapes */}
      <section aria-label="steps" className="flex flex-col gap-3">
        {protocol.steps.map((s, i) => (
          <div key={i} className="card flex gap-3 rounded-2xl border border-line bg-surface p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 font-black text-white tabular-nums">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold leading-snug"><AbbrText>{lang === "ar" ? s.title.ar : s.title.fr}</AbbrText></p>
              {s.detail && <p className="mt-1 text-sm leading-relaxed opacity-80"><AbbrText>{lang === "ar" ? s.detail.ar : s.detail.fr}</AbbrText></p>}
            </div>
          </div>
        ))}
      </section>

      {/* Évolution & complications */}
      {protocol.trajectory && protocol.trajectory.length > 0 && (
        <section aria-label="trajectory" className="rounded-2xl border-2 border-amber-500/50 bg-amber-500/5 p-4">
          <h2 className="mb-3 flex items-center gap-2 font-bold text-amber-500">
            <Info className="h-5 w-5" aria-hidden />
            {lang === "ar" ? "تطور الحالة وتعقيداتها — ماذا لو..؟" : "Évolution & complications — et si… ?"}
          </h2>
          <div className="flex flex-col gap-3">
            {protocol.trajectory.map((tr, i) => (
              <div key={i} className="rounded-xl border border-line bg-surface p-3">
                <p className="font-semibold text-amber-500"><AbbrText>{lang === "ar" ? tr.when.ar : tr.when.fr}</AbbrText></p>
                <ul className="mt-1 list-disc space-y-1 ps-5 text-sm">
                  {tr.do.map((d, j) => (
                    <li key={j}><AbbrText>{lang === "ar" ? d.ar : d.fr}</AbbrText></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Points-clés */}
      <section className="card rounded-2xl border border-teal-600/40 bg-teal-600/10 p-4">
        <h2 className="mb-2 flex items-center gap-2 font-bold text-teal-500">
          <CheckSquare className="h-5 w-5" aria-hidden />
          {lang === "ar" ? "نقاط أساسية" : "Points-clés"}
        </h2>
        <ul className="list-disc space-y-1 ps-5">
          {protocol.keyPoints.map((k, i) => (
            <li key={i}><AbbrText>{lang === "ar" ? k.ar : k.fr}</AbbrText></li>
          ))}
        </ul>
      </section>

      {/* Médicaments liés */}
      {meds.length > 0 && (
        <section>
          <h2 className="mb-2 flex items-center gap-2 font-bold">
            <Pill className="h-5 w-5 text-teal-500" aria-hidden />
            {t("nav.medications")}
          </h2>
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

      {/* Calculateurs liés */}
      {calcs.length > 0 && (
        <section>
          <h2 className="mb-2 flex items-center gap-2 font-bold">
            <Calculator className="h-5 w-5 text-teal-500" aria-hidden />
            {t("nav.calculators")}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {calcs.map((c) => (
              <li key={c.id}>
                <Link href={c.href} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface2">
                  {lang === "ar" ? c.title.ar : c.title.fr}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Sources + avertissement */}
      <section className="card rounded-2xl border border-line bg-surface p-4 text-sm">
        <h2 className="mb-1 flex items-center gap-2 font-bold">
          <BookOpen className="h-4 w-4" aria-hidden /> {t("common.sources")}
        </h2>
        <p className="opacity-80">{protocol.meta.sources.join(" · ")}</p>
        <p className="mt-3 flex gap-2 rounded-xl bg-amber-500/10 p-3 text-amber-500">
          <Info className="h-5 w-5 shrink-0" aria-hidden /> {t("common.disclaimer")}
        </p>
      </section>
    </article>
  );
}

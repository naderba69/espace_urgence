"use client";
// Fiche médicament complète : doses, dilution, interactions, mini-calculateur poids.
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Medication } from "@/data/types";
import { getMedication } from "@/data/medications";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import { PrintButton, FavoriteButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import { trackEvent } from "@/lib/analytics";
import { clampDose } from "@/lib/calc";
import { ShieldAlert, Syringe, BookOpen, Info, AlertOctagon, Warehouse } from "lucide-react";

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="card rounded-2xl border border-line bg-surface p-4">
      <h2 className="mb-2 font-bold text-teal-500">{title}</h2>
      <div className="leading-relaxed">{children}</div>
    </section>
  );
}

export default function MedicationDetail({ medication: m }: { medication: Medication }) {
  const { lang, t } = useApp();
  const [weight, setWeight] = useState<string>("");
  useRegisterRecent(`medicament:${m.id}`);
  useEffect(() => trackEvent("medication_view", { id: m.id }), [m.id]);

  const computed =
    m.weightDose && Number(weight) > 0
      ? clampDose(m.weightDose.mgPerKg, Number(weight), m.weightDose.maxMg)
      : null;

  const alternatives = m.alternatives.map(getMedication).filter(Boolean);

  return (
    <article className="flex flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
            <T fr={m.name.fr} ar={m.name.ar} />
            {m.highRisk && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-red-500/15 px-2 py-1 text-xs font-bold text-red-400">
                <ShieldAlert className="h-4 w-4" aria-hidden /> {t("common.highRisk")}
              </span>
            )}
          </h1>
          <p className="mt-1 opacity-70"><T fr={m.klass.fr} ar={m.klass.ar} /></p>
          {m.brands && <p className="text-sm opacity-50">{m.brands}</p>}
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton itemKey={`medicament:${m.id}`} />
          <PrintButton />
        </div>
      </header>

      <Section title={lang === "ar" ? "الاستطبابات" : "Indications"}>
        <T fr={m.indications.fr} ar={m.indications.ar} />
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title={`${t("common.adult")} — ${lang === "ar" ? "الجرعة" : "dose"}`}>
          <T fr={m.doseAdult.fr} ar={m.doseAdult.ar} />
        </Section>
        <Section title={`${t("common.pediatric")} — ${lang === "ar" ? "الجرعة" : "dose"}`}>
          <T fr={m.dosePediatric.fr} ar={m.dosePediatric.ar} />
        </Section>
      </div>

      {/* Mini-calculateur selon le poids */}
      {m.weightDose && (
        <section className="card rounded-2xl border border-teal-600/40 bg-teal-600/10 p-4">
          <h2 className="mb-2 flex items-center gap-2 font-bold text-teal-500">
            <Syringe className="h-5 w-5" aria-hidden /> {lang === "ar" ? "حساب بالوزن" : "Calcul selon le poids"}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 font-semibold">
              {t("common.weight")}
              <input
                type="number"
                min={0}
                step={0.1}
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-24 rounded-xl border border-line bg-surface px-3 py-2 text-center text-lg tabular-nums outline-none focus:ring-2 focus:ring-teal-600"
              />
            </label>
            {computed !== null && (
              <p className="rounded-xl bg-teal-600 px-4 py-2 text-lg font-black text-white tabular-nums">
                {Math.round(computed * 100) / 100} mg
              </p>
            )}
          </div>
          <p className="mt-2 text-sm opacity-80"><T fr={m.weightDose.note.fr} ar={m.weightDose.note.ar} /></p>
        </section>
      )}

      <Section title={lang === "ar" ? "التمديد" : "Dilution / administration"}>
        <T fr={m.dilution.fr} ar={m.dilution.ar} />
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title={lang === "ar" ? "موانع الاستعمال" : "Contre-indications"}>
          <T fr={m.contraindications.fr} ar={m.contraindications.ar} />
        </Section>
        <Section title={lang === "ar" ? "التأثيرات الجانبية" : "Effets indésirables"}>
          <T fr={m.sideEffects.fr} ar={m.sideEffects.ar} />
        </Section>
      </div>

      <Section title={lang === "ar" ? "ملاحظات تمريضية" : "Surveillance / soins infirmiers"}>
        <T fr={m.nursing.fr} ar={m.nursing.ar} />
      </Section>

      {m.interactions && m.interactions.length > 0 && (
        <section className="card rounded-2xl border border-orange-500/40 bg-orange-500/10 p-4">
          <h2 className="mb-2 flex items-center gap-2 font-bold text-orange-400">
            <AlertOctagon className="h-5 w-5" aria-hidden />
            {lang === "ar" ? "تداخلات دوائية" : "Interactions"}
          </h2>
          <ul className="space-y-2">
            {m.interactions.map((ix, i) => (
              <li key={i} className="rounded-xl border border-line bg-surface p-3">
                <span className={`me-2 inline-block rounded px-2 py-0.5 text-xs font-black ${ix.severity === "high" ? "bg-red-600 text-white" : "bg-amber-500 text-black"}`}>
                  {ix.drug}
                </span>
                <T fr={ix.description.fr} ar={ix.description.ar} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Section title={<span className="inline-flex items-center gap-2"><Warehouse className="h-4 w-4" />{lang === "ar" ? "التخزين" : "Conservation"}</span>}>
          <T fr={m.storage.fr} ar={m.storage.ar} />
        </Section>
        {alternatives.length > 0 && (
          <section className="card rounded-2xl border border-line bg-surface p-4">
            <h2 className="mb-2 font-bold text-teal-500">{lang === "ar" ? "بدائل" : "Alternatives"}</h2>
            <ul className="flex flex-wrap gap-2">
              {alternatives.map((a) =>
                a ? (
                  <li key={a.id}>
                    <Link href={`/medicaments/${a.id}`} className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:bg-surface2">
                      {lang === "ar" ? a.name.ar : a.name.fr}
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </section>
        )}
      </div>

      <section className="card rounded-2xl border border-line bg-surface p-4 text-sm">
        <h2 className="mb-1 flex items-center gap-2 font-bold">
          <BookOpen className="h-4 w-4" aria-hidden /> {t("common.sources")}
        </h2>
        <p className="opacity-80">{m.meta.sources.join(" · ")} · {t("common.lastReviewed")} : {m.meta.lastReviewed}</p>
        <p className="mt-3 flex gap-2 rounded-xl bg-amber-500/10 p-3 text-amber-500">
          <Info className="h-5 w-5 shrink-0" aria-hidden /> {t("common.disclaimer")}
        </p>
      </section>
    </article>
  );
}

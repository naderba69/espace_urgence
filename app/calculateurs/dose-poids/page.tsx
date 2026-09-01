"use client";
// Calculateur « dose selon le poids » — lit les weightDose structurés des fiches médicaments.
import { useEffect, useState } from "react";
import { medications } from "@/data/medications";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import { trackEvent } from "@/lib/analytics";
import { readJSON, writeJSON } from "@/lib/storage";
import { clampDose, weightResusPanel } from "@/lib/calc";
import T from "@/components/T";

const STORE = "eutn:calc:dose-poids";

export default function DosePoidsPage() {
  const { t, lang, hydrated } = useApp();
  const eligible = medications.filter((m) => m.weightDose);
  const [medId, setMedId] = useState(eligible[0]?.id ?? "");
  const [weight, setWeight] = useState("10");
  useRegisterRecent("calculateur:dose-poids");

  // Restaure la dernière saisie
  useEffect(() => {
    if (!hydrated) return;
    const saved = readJSON<{ medId: string; weight: string }>(STORE, null as never);
    if (saved?.medId && eligible.some((m) => m.id === saved.medId)) setMedId(saved.medId);
    if (saved?.weight) setWeight(saved.weight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    if (hydrated) writeJSON(STORE, { medId, weight });
  }, [medId, weight, hydrated]);

  const med = eligible.find((m) => m.id === medId);
  const w = Number(weight);
  const raw = med?.weightDose && w > 0 ? med.weightDose.mgPerKg * w : 0;
  const capped = med?.weightDose ? clampDose(med.weightDose.mgPerKg, w, med.weightDose.maxMg) : 0;
  const isCapped = raw > capped;

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Dose selon le poids" ar="الجرعة حسب الوزن" /></h1>
        <PrintButton />
      </header>

      <div className="card rounded-2xl border border-line bg-surface p-4 flex flex-col gap-4">
        <label className="flex flex-col gap-1 font-semibold">
          {t("nav.medications")}
          <select
            value={medId}
            onChange={(e) => { setMedId(e.target.value); trackEvent("calculator_use", { id: "dose-poids" }); }}
            className="rounded-xl border border-line bg-surface2 px-3 py-3 text-base outline-none focus:ring-2 focus:ring-teal-600"
          >
            {eligible.map((m) => (
              <option key={m.id} value={m.id}>{lang === "ar" ? m.name.ar : m.name.fr}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 font-semibold">
          {t("common.weight")}
          <input
            type="number" min="0" step="0.1" inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="rounded-xl border border-line bg-surface2 px-3 py-3 text-2xl text-center tabular-nums outline-none focus:ring-2 focus:ring-teal-600"
          />
        </label>

        {med?.weightDose && w > 0 && (
          <div className="rounded-2xl bg-teal-600 p-5 text-center text-white">
            <p className="text-sm font-semibold opacity-90">{t("common.result")}</p>
            <p className="text-4xl font-black tabular-nums">{Math.round(capped * 100) / 100} mg</p>
            {isCapped && (
              <p className="mt-1 rounded-lg bg-black/25 px-2 py-1 text-xs font-bold">
                {lang === "ar" ? `جرعة مُسقوفة عند ${med.weightDose.maxMg} ملغ (الحد الأقصى)` : `Dose plafonnée à ${med.weightDose.maxMg} mg (maximum)`}
              </p>
            )}
            <p className="mt-2 text-xs opacity-90"><T fr={med.weightDose.note.fr} ar={med.weightDose.note.ar} /></p>
          </div>
        )}

        {med && (
          <p className="text-sm opacity-70">
            {lang === "ar" ? med.dosePediatric.ar : med.dosePediatric.fr}
          </p>
        )}
      </div>

      {/* Panneau d'anticipation complet : toutes les doses clés d'un coup */}
      {w > 0 && (
        <section className="card rounded-2xl border border-amber-500/50 bg-amber-500/5 p-4">
          <h2 className="mb-1 font-extrabold text-amber-500">
            <T fr="Anticipation rapide — tout pour ce poids" ar="استباق سريع — كل جرعات هذا الوزن" />
          </h2>
          <p className="mb-3 text-xs opacity-70"><T fr="Mémorisez/imprimez avant l'arrivée du patient." ar="احفظ/اطبع قبل وصول المريض." /></p>
          <ul className="divide-y divide-line">
            {weightResusPanel(w).map((row) => (
              <li key={row.key} className="flex items-start justify-between gap-3 py-2 text-sm">
                <span className="font-semibold">{lang === "ar" ? row.labelAr : row.labelFr}
                  <span className="block text-xs font-normal opacity-60">{row.unit}</span>
                </span>
                <span className="shrink-0 rounded-lg bg-surface2 px-2.5 py-1 font-mono font-black tabular-nums text-teal-500">{row.dose}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs opacity-60">{t("common.disclaimer")}</p>
    </div>
  );
}

"use client";
// Référence ECG : simulateur (tracé animé) + fiches des rythmes + lien analyseur IA (phase 3).
import { useState } from "react";
import { ecgRhythms, type EcgRhythm } from "@/data/ecg";
import ECGTrace from "@/components/ECGTrace";
import T from "@/components/T";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import { Camera, Stethoscope, ClipboardCheck } from "lucide-react";
import Link from "next/link";

export default function EcgPage() {
  const { lang } = useApp();
  const [rhythm, setRhythm] = useState<EcgRhythm>(ecgRhythms[0]);
  useRegisterRecent("calculateur:ecg");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="ECG — rythmes essentiels" ar="تخطيط القلب — الإيقاعات الأساسية" /></h1>
        <PrintButton />
      </header>

      {/* Simulateur */}
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <div className="aspect-[640/140] w-full">
          <ECGTrace key={rhythm.id} kind={rhythm.kind} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="rythmes">
          {ecgRhythms.map((r) => (
            <button key={r.id} role="tab" aria-selected={rhythm.id === r.id}
              onClick={() => setRhythm(r)}
              className={`touch rounded-xl border px-3 py-2 text-sm font-semibold ${rhythm.id === r.id ? "border-teal-600 bg-teal-600 text-white" : "border-line hover:bg-surface2"}`}>
              {lang === "ar" ? r.title.ar : r.title.fr}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs opacity-60">
          <T fr="Tracés stylisés à visée pédagogique — les amplitudes/fréquences ne sont pas à l'échelle mesurable."
             ar="رسوم مدرّسة تقريبية — المقاييس ليست للقياس." />
        </p>
      </section>

      {/* Fiche du rythme sélectionné */}
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-3 text-xl font-extrabold text-teal-500"><T fr={rhythm.title.fr} ar={rhythm.title.ar} /></h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-surface2 p-3">
            <p className="mb-1 flex items-center gap-2 text-sm font-bold"><Stethoscope className="h-4 w-4" aria-hidden /><T fr="Caractéristiques" ar="الخصائص" /></p>
            <p className="text-sm leading-relaxed"><T fr={rhythm.caracteristiques.fr} ar={rhythm.caracteristiques.ar} /></p>
          </div>
          <div className="rounded-xl bg-teal-600/10 p-3 border border-teal-600/40">
            <p className="mb-1 flex items-center gap-2 text-sm font-bold text-teal-500"><ClipboardCheck className="h-4 w-4" aria-hidden /><T fr="Conduite" ar="التصرّف" /></p>
            <p className="text-sm leading-relaxed"><T fr={rhythm.conduite.fr} ar={rhythm.conduite.ar} /></p>
          </div>
        </div>
        <p className="mt-3 text-xs opacity-60">{rhythm.meta.sources.join(" · ")} · {rhythm.meta.lastReviewed}</p>
      </section>

      {/* Lien analyseur IA */}
      <section className="card flex items-start gap-4 rounded-2xl border border-teal-600/50 bg-teal-600/5 p-4">
        <Camera className="h-8 w-8 shrink-0 text-teal-500" aria-hidden />
        <div className="flex-1">
          <p className="font-bold"><T fr="Analyse ECG par IA (photo de votre rythme)" ar="تحليل التخطيط بالذكاء الاصطناعي (صورة)" /></p>
          <p className="mt-1 text-sm opacity-70">
            <T fr="Prenez le rythme en photo ou importez-le ; le modèle propose une lecture structurée (toujours indicatrice — validation cardiologique obligatoire)."
               ar="التقط صورة للتخطيط أو استوردها؛ يقترح النموذج قراءة منظمة (إرشادية دائماً — تأكيد طبيب القلب إلزامي)." />
          </p>
        </div>
        <Link href="/ecg-analyzer" className="touch self-center rounded-xl bg-teal-600 px-4 py-2 font-bold text-white">
          <T fr="Ouvrir" ar="افتح" />
        </Link>
      </section>
    </div>
  );
}

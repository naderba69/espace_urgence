"use client";
// /ecg-analyzer — analyse IA d'ECG par photo (phase 3). Protégé par la configuration IA.
import { useState } from "react";
import AiGate from "@/components/ai/AiGate";
import ECGAnalyzer from "@/components/ecg/ECGAnalyzer";
import ECGHistory from "@/components/ecg/ECGHistory";
import { useApp } from "@/components/Providers";
import { ShieldAlert } from "lucide-react";
import T from "@/components/T";

export default function EcgAnalyzerPage() {
  const { t } = useApp();
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-extrabold"><T fr="Analyseur ECG par IA" ar="محلّل التخطيط بالذكاء الاصطناعي" /></h1>
        <p className="mt-2 flex items-start gap-2 rounded-2xl bg-amber-500/10 p-4 text-sm font-semibold text-amber-500" role="note">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          {t("ai.ecg.disclaimer")}
        </p>
      </header>
      <AiGate title={t("ai.hub.title")}>
        <ECGAnalyzer onSaved={() => setRefresh((r) => r + 1)} />
        <ECGHistory refreshKey={refresh} />
      </AiGate>
    </div>
  );
}

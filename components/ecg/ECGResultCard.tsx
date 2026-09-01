"use client";
// Carte résultat structurée : sévérité colorée + actions (protocoles, copier, partager, écouter, imprimer).
import Link from "next/link";
import { useState } from "react";
import type { EcgAnalysis } from "@/lib/ecg-db";
import { getProtocol } from "@/data/protocols";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { speak, stopSpeaking } from "@/lib/ai";
import { trackEvent } from "@/lib/analytics";
import { AlertOctagon, AlertTriangle, CircleCheck, Copy, Share2, Volume2, SquareArrowOutUpRight } from "lucide-react";

const SEV_STYLE = {
  normal: { cls: "border-teal-600 bg-teal-600/10", text: "text-teal-500", Icon: CircleCheck, fr: "Aspect rassurant", ar: "مظهر مطمئن" },
  caution: { cls: "border-amber-500 bg-amber-500/10", text: "text-amber-500", Icon: AlertTriangle, fr: "Vigilance", ar: "حذر" },
  critical: { cls: "border-red-600 bg-red-600/10", text: "text-red-400", Icon: AlertOctagon, fr: "POTENTIELLEMENT CRITIQUE", ar: "حرج محتمل" },
} as const;

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5 rounded-xl bg-surface2 p-2.5">
      <span className="text-[11px] font-bold uppercase tracking-wide opacity-60">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

export default function ECGResultCard({ analysis, raw }: { analysis: EcgAnalysis; raw: string }) {
  const { t, lang } = useApp();
  const [copied, setCopied] = useState(false);
  const sev = SEV_STYLE[analysis.severity ?? "caution"];
  const protocols = (analysis.protocolIds ?? []).map(getProtocol).filter(Boolean);

  const plainText = [
    analysis.suspectedDiagnosis && `Diagnostic suspecté : ${analysis.suspectedDiagnosis}`,
    analysis.rhythm && `Rythme : ${analysis.rhythm}`,
    analysis.heartRateBpm != null && `FC : ~${analysis.heartRateBpm}/min`,
    analysis.summary,
    (analysis.immediateRecommendations ?? []).map((r) => `• ${r}`).join("\n"),
    "— Analyse IA indicative, à confirmer médicalement (Espace Urgence TN)",
  ].filter(Boolean).join("\n");

  const copy = async () => {
    try { await navigator.clipboard.writeText(plainText); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard refusé */ }
  };

  const share = async () => {
    trackEvent("ecg_share");
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try { await navigator.share({ title: "Analyse ECG (IA)", text: plainText }); } catch { /* annulé */ }
    } else await copy();
  };

  return (
    <div className={`card rounded-2xl border-2 p-4 ${sev.cls}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className={`flex items-center gap-2 text-lg font-black ${sev.text}`}>
          <sev.Icon className="h-6 w-6" aria-hidden />
          {lang === "ar" ? sev.ar : sev.fr}
          {analysis.confidence != null && (
            <span className="ms-2 rounded-lg bg-black/15 px-2 py-0.5 text-xs font-bold">
              {lang === "ar" ? "ثقة" : "confiance"} {Math.round(analysis.confidence * 100)}%
            </span>
          )}
        </h3>
        <div className="flex gap-1 no-print">
          <PrintButton />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Row label={lang === "ar" ? "التشخيص المشتبه" : "Diagnostic suspecté"} value={analysis.suspectedDiagnosis} />
        <Row label={lang === "ar" ? "الإيقاع" : "Rythme"} value={analysis.rhythm} />
        <Row label={lang === "ar" ? "نبض (~ /د)" : "FC (~ /min)"} value={analysis.heartRateBpm ?? undefined} />
        <Row label={lang === "ar" ? "المقاطع PR/QRS/QT" : "Intervalles (PR/QRS/QT)"} value={analysis.intervals} />
        <Row label="ST" value={analysis.stSegment} />
        <Row label={lang === "ar" ? "موجة T" : "Onde T"} value={analysis.tWave} />
        <Row label={lang === "ar" ? "علامات فرط K" : "Signes d'hyperK+"} value={analysis.hyperkalemiaSigns} />
        <Row label={lang === "ar" ? "علامات حصار AV" : "Signes de BAV"} value={analysis.avBlockSigns} />
      </div>

      {analysis.summary && <p className="mt-3 rounded-xl bg-surface2 p-3 text-sm italic">{analysis.summary}</p>}

      {analysis.immediateRecommendations && analysis.immediateRecommendations.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-sm font-bold">{lang === "ar" ? "توصيات فورية" : "Recommandations immédiates"}</p>
          <ul className="list-disc space-y-1 ps-5 text-sm">
            {analysis.immediateRecommendations.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      {protocols.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-sm font-bold">{t("ai.ecg.whatToDo")}</p>
          <ul className="flex flex-wrap gap-2">
            {protocols.map((p) => p && (
              <li key={p.id}>
                <Link href={`/protocoles/${p.id}`} className="touch gap-1 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white">
                  {lang === "ar" ? p.title.ar : p.title.fr} <SquareArrowOutUpRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 no-print border-t border-line/50 pt-3">
        <button onClick={copy} className="touch gap-2 rounded-xl border border-line px-4 py-2 font-semibold hover:bg-surface2">
          <Copy className="h-4 w-4" aria-hidden /> {copied ? t("ai.ecg.copied") : t("ai.ecg.copy")}
        </button>
        <button onClick={() => void share()} className="touch gap-2 rounded-xl border border-line px-4 py-2 font-semibold hover:bg-surface2">
          <Share2 className="h-4 w-4" aria-hidden /> {t("ai.ecg.share")}
        </button>
        <button onClick={() => speak(plainText, lang)} className="touch gap-2 rounded-xl border border-line px-4 py-2 font-semibold hover:bg-surface2">
          <Volume2 className="h-4 w-4" aria-hidden /> {t("ai.ecg.listen")}
        </button>
        <button onClick={stopSpeaking} className="touch rounded-xl border border-line px-3 py-2 text-sm opacity-70 hover:bg-surface2">■</button>
      </div>

      <p className="mt-3 rounded-xl bg-amber-500/15 p-3 text-xs font-semibold text-amber-500">{t("ai.ecg.disclaimer")}</p>
      {!analysis.suspectedDiagnosis && raw && (
        <details className="mt-2 text-xs opacity-70">
          <summary className="cursor-pointer">{lang === "ar" ? "النص الخام" : "Réponse brute"}</summary>
          <pre className="mt-1 whitespace-pre-wrap rounded-xl bg-surface2 p-3">{raw}</pre>
        </details>
      )}
    </div>
  );
}

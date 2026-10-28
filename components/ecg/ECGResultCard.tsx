"use client";
// Observations visuelles IA seulement : aucune gravité, conduite à tenir ou décision clinique n'est exposée.
import { useState } from "react";
import type { EcgAnalysis } from "@/lib/ecg-db";
import { useApp } from "@/components/Providers";
import { speak, stopSpeaking } from "@/lib/ai";
import { trackEvent } from "@/lib/analytics";
import { Copy, Share2, Volume2 } from "lucide-react";

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5 rounded-xl bg-surface2 p-2.5">
      <span className="text-[11px] font-bold uppercase tracking-wide opacity-60">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

export default function ECGResultCard({ analysis }: { analysis: EcgAnalysis }) {
  const { t, lang } = useApp();
  const [copied, setCopied] = useState(false);
  const plainText = [
    analysis.rhythm && `${lang === "ar" ? "الإيقاع" : "Rythme"} : ${analysis.rhythm}`,
    analysis.heartRateBpm != null && `${lang === "ar" ? "النبض المقدر" : "FC estimée"} : ${analysis.heartRateBpm}/min`,
    analysis.intervals && `${lang === "ar" ? "الفواصل المقدرة" : "Intervalles estimés"} : ${analysis.intervals}`,
    analysis.stSegment && `ST : ${analysis.stSegment}`,
    analysis.tWave && `${lang === "ar" ? "موجة T" : "Onde T"} : ${analysis.tWave}`,
    analysis.hyperkalemiaSigns && `${lang === "ar" ? "مظاهر بصرية محتملة لفرط البوتاسيوم" : "Signes visuels possibles d'hyperkaliémie"} : ${analysis.hyperkalemiaSigns}`,
    analysis.avBlockSigns && `${lang === "ar" ? "مظاهر بصرية محتملة لحصار أذيني بطيني" : "Signes visuels possibles de bloc AV"} : ${analysis.avBlockSigns}`,
    t("ai.ecg.disclaimer"),
  ].filter(Boolean).join("\n");

  const copy = async () => {
    try { await navigator.clipboard.writeText(plainText); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard refusé */ }
  };

  const share = async () => {
    trackEvent("ecg_share");
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try { await navigator.share({ title: "Observations ECG (IA)", text: plainText }); } catch { /* annulé */ }
    } else await copy();
  };

  return (
    <div className="card rounded-2xl border-2 border-amber-500 bg-amber-500/5 p-4">
      <h3 className="mb-3 text-lg font-black text-amber-500">
        {lang === "ar" ? "ملاحظات بصرية آلية — غير تشخيصية" : "Observations visuelles automatiques — non diagnostiques"}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2">
        <Row label={lang === "ar" ? "الإيقاع" : "Rythme"} value={analysis.rhythm} />
        <Row label={lang === "ar" ? "النبض المقدر/دقيقة" : "FC estimée/min"} value={analysis.heartRateBpm ?? undefined} />
        <Row label={lang === "ar" ? "المقاطع المقدرة PR/QRS/QT" : "Intervalles estimés (PR/QRS/QT)"} value={analysis.intervals} />
        <Row label="ST" value={analysis.stSegment} />
        <Row label={lang === "ar" ? "موجة T" : "Onde T"} value={analysis.tWave} />
        <Row label={lang === "ar" ? "علامات بصرية محتملة لفرط K+" : "Signes visuels possibles d'hyperK+"} value={analysis.hyperkalemiaSigns} />
        <Row label={lang === "ar" ? "علامات بصرية محتملة لحصار AV" : "Signes visuels possibles de BAV"} value={analysis.avBlockSigns} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-line/50 pt-3">
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
      <p className="mt-3 rounded-xl bg-amber-500/15 p-3 text-xs font-bold text-amber-500" role="note">{t("ai.ecg.disclaimer")}</p>
    </div>
  );
}

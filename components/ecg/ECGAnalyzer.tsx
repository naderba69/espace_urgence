"use client";
// Chef d'orchestre : capture/upload → compression → analyse IA → carte résultat + historique.
import { useRef, useState } from "react";
import { useApp } from "@/components/Providers";
import { analyzeImage, AiError } from "@/lib/ai";
import { prepareForAi, thumbnail, addEcgRecord, type EcgAnalysis } from "@/lib/ecg-db";
import { parseEcgResponse } from "@/lib/ecg-parse";
import CameraCapture from "./CameraCapture";
import ECGResultCard from "./ECGResultCard";
import { trackEvent } from "@/lib/analytics";
import { Camera, ImageUp, ScanSearch, RefreshCcw, Loader2 } from "lucide-react";
import Image from "next/image";

const PROTOCOL_IDS = "acr-adulte, acr-pediatrique, anaphylaxie, sca-stemi, avc, hyperkaliemie, oap, etat-mal-epileptique, polytraumatisme";

function analysisPrompt(lang: "fr" | "ar"): string {
  const base = `Tu es un assistant ECG de médecine d'urgence pour professionnels de santé. Analyse cette photo de rythme/ECG et réponds UNIQUEMENT avec un objet JSON compact (aucun texte autour), clés exactes :
{
 "rhythm": string,
 "heartRateBpm": number | null,
 "intervals": string (PR/QRS/QT estimés),
 "stSegment": string,
 "tWave": string,
 "hyperkalemiaSigns": string,
 "avBlockSigns": string,
 "suspectedDiagnosis": string,
 "severity": "normal" | "caution" | "critical",
 "confidence": number entre 0 et 1,
 "immediateRecommendations": [string, …] (max 4, courtes),
 "protocolIds": [parmi: ${PROTOCOL_IDS}] (ou []),
 "summary": string (1–2 phrases)
}
Les valeurs sont des ESTIMATIONS indicatives (photo, pas de calibration) — reste prudent, ne fabrique rien.`;
  return lang === "ar"
    ? base + "\nRéponds avec les valeurs textuelles en ARABE (clés inchangées)."
    : base + "\nRéponds en FRANÇAIS.";
}

export default function ECGAnalyzer({ onSaved }: { onSaved: () => void }) {
  const { t, lang } = useApp();
  const [mode, setMode] = useState<"shot" | "camera" | "preview" | "busy" | "result">("shot");
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ a: EcgAnalysis; raw: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const rd = new FileReader();
    rd.onload = () => { setPhoto(String(rd.result)); setMode("preview"); setError(null); };
    rd.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!photo) return;
    setMode("busy");
    setError(null);
    trackEvent("ecg_analysis");
    try {
      const { b64, mime } = await prepareForAi(photo);
      const raw = await analyzeImage(b64, analysisPrompt(lang), mime);
      const a = parseEcgResponse(raw) ?? { summary: raw.slice(0, 900) };
      setResult({ a, raw });
      await addEcgRecord({ ts: Date.now(), thumb: await thumbnail(photo), analysis: a, raw });
      onSaved();
      setMode("result");
    } catch (e) {
      setError(e instanceof AiError ? t(`ai.error.${e.code}`) : t("ai.error.provider"));
      setMode("preview");
    }
  };

  const reset = () => { setPhoto(null); setResult(null); setError(null); setMode("shot"); };

  return (
    <section className="flex flex-col gap-4">
      {/* Tableau d'instructions */}
      <p className="card rounded-2xl border border-teal-600/40 bg-teal-600/10 p-4 text-sm font-semibold text-teal-500">
        {t("ai.ecg.instructions")}
      </p>

      {mode === "shot" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <button onClick={() => setMode("camera")}
            className="touch flex-col gap-3 rounded-2xl border-2 border-teal-600 bg-teal-600/10 p-8 font-bold text-teal-500 hover:bg-teal-600/20">
            <Camera className="h-10 w-10" aria-hidden /> {t("ai.ecg.camera")}
          </button>
          <button onClick={() => fileRef.current?.click()}
            className="touch flex-col gap-3 rounded-2xl border-2 border-line bg-surface p-8 font-bold hover:bg-surface2">
            <ImageUp className="h-10 w-10" aria-hidden /> {t("ai.ecg.upload")}
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden
            onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
      )}

      {mode === "camera" && (
        <CameraCapture
          onCapture={(d) => { setPhoto(d); setMode("preview"); }}
          onFileInstead={() => fileRef.current?.click()}
        />
      )}

      {(mode === "preview" || mode === "busy") && photo && (
        <div className="card rounded-2xl border border-line bg-surface p-3">
          <div className="relative mx-auto aspect-[4/3] max-w-xl overflow-hidden rounded-xl bg-black">
            <Image src={photo} alt="ECG à analyser" fill className="object-contain" unoptimized />
            {mode === "busy" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white" role="status">
                <Loader2 className="h-10 w-10 animate-spin text-teal-400" aria-hidden />
                <p className="font-bold">{t("ai.ecg.analyzing")}</p>
              </div>
            )}
          </div>
          <div className="mt-3 flex justify-center gap-3">
            <button onClick={reset} className="touch gap-2 rounded-xl border border-line px-5 py-3 font-bold hover:bg-surface2">
              <RefreshCcw className="h-5 w-5" aria-hidden /> {t("ai.ecg.back")}
            </button>
            <button onClick={() => void analyze()} disabled={mode === "busy"}
              className="touch gap-2 rounded-xl bg-teal-600 px-8 py-3 text-lg font-black text-white hover:bg-teal-500 disabled:opacity-50">
              <ScanSearch className="h-6 w-6" aria-hidden /> {t("ai.ecg.analyze")}
            </button>
          </div>
          {error && <p className="mt-3 rounded-xl bg-red-500/15 p-3 text-center text-sm font-bold text-red-400" role="alert">{error}</p>}
        </div>
      )}

      {mode === "result" && result && (
        <>
          {photo && (
            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-xl border border-line bg-black">
              <Image src={photo} alt="ECG analysé" fill className="object-contain" unoptimized />
            </div>
          )}
          <ECGResultCard analysis={result.a} raw={result.raw} />
          <button onClick={reset} className="touch mx-auto gap-2 rounded-xl border border-line px-6 py-3 font-bold hover:bg-surface2">
            <RefreshCcw className="h-5 w-5" aria-hidden /> {t("ai.ecg.back")}
          </button>
        </>
      )}
    </section>
  );
}

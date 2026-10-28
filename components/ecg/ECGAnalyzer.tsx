"use client";
// Chef d'orchestre : capture/upload → compression → analyse IA → carte résultat + historique.
import { useRef, useState, useSyncExternalStore } from "react";
import { useApp } from "@/components/Providers";
import { analyzeImage, AiError } from "@/lib/ai";
import { DEFAULT_AI, readAiConfig, subscribeAiConfig } from "@/lib/ai-config";
import { prepareForAi, thumbnail, addEcgRecord, type EcgAnalysis } from "@/lib/ecg-db";
import { parseEcgResponse } from "@/lib/ecg-parse";
import CameraCapture from "./CameraCapture";
import ECGResultCard from "./ECGResultCard";
import { trackEvent } from "@/lib/analytics";
import { Camera, ImageUp, ScanSearch, RefreshCcw, Loader2 } from "lucide-react";
import Image from "next/image";
import T from "@/components/T";

function analysisPrompt(lang: "fr" | "ar"): string {
  const base = `Tu es un outil expérimental de description visuelle d'ECG, pas un médecin. Réponds UNIQUEMENT avec un objet JSON compact, avec ces clés exactes :
{
 "rhythm": string,
 "heartRateBpm": number | null,
 "intervals": string (estimations PR/QRS/QT uniquement si lisibles),
 "stSegment": string,
 "tWave": string,
 "hyperkalemiaSigns": string,
 "avBlockSigns": string
}
Ne donne aucun diagnostic, niveau de gravité, recommandation, conduite à tenir ni protocole. La photo peut être non calibrée ou illisible : indique l'incertitude plutôt que d'inventer. Ces valeurs restent des estimations non validées.`;
  return lang === "ar"
    ? base + "\nاكتب القيم الوصفية بالعربية مع إبقاء المفاتيح كما هي."
    : base + "\nRéponds en français.";
}

export default function ECGAnalyzer({ onSaved }: { onSaved: () => void }) {
  const { t, lang } = useApp();
  const aiConfig = useSyncExternalStore(subscribeAiConfig, readAiConfig, () => DEFAULT_AI);
  const providerName = aiConfig.provider === "gemini" ? "Google Gemini" : "OpenRouter";
  const [mode, setMode] = useState<"shot" | "camera" | "preview" | "busy" | "result">("shot");
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EcgAnalysis | null>(null);
  const [transferAccepted, setTransferAccepted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const rd = new FileReader();
    rd.onload = () => { setPhoto(String(rd.result)); setTransferAccepted(false); setMode("preview"); setError(null); };
    rd.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!photo || !transferAccepted) return;
    setMode("busy");
    setError(null);
    trackEvent("ecg_analysis");
    try {
      const { b64, mime } = await prepareForAi(photo);
      const raw = await analyzeImage(b64, analysisPrompt(lang), mime, { transferConfirmed: true, language: lang });
      const a = parseEcgResponse(raw);
      if (!a) throw new Error("invalid-ecg-response");
      // Ne pas exposer ni archiver le texte libre brut produit par le modèle.
      setResult(a);
      await addEcgRecord({ ts: Date.now(), thumb: await thumbnail(photo), analysis: a, raw: "" });
      onSaved();
      setMode("result");
    } catch (e) {
      setError(e instanceof Error && e.message === "invalid-ecg-response"
        ? (lang === "ar" ? "تعذر قراءة إجابة منظمة وآمنة. أعد المحاولة أو اقرأ التخطيط الأصلي مباشرة." : "Réponse structurée inexploitable. Réessayez ou interprétez directement l'ECG original.")
        : e instanceof AiError ? t(`ai.error.${e.code}`) : t("ai.error.provider"));
      setMode("preview");
    }
  };

  const reset = () => { setPhoto(null); setResult(null); setError(null); setTransferAccepted(false); setMode("shot"); };

  return (
    <section className="flex flex-col gap-4">
      {/* Tableau d'instructions */}
      <p className="card rounded-2xl border border-blue-600/40 bg-blue-600/10 p-4 text-sm font-semibold text-blue-500">
        {t("ai.ecg.instructions")}
      </p>

      {mode === "shot" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <button onClick={() => setMode("camera")}
            className="touch flex-col gap-3 rounded-2xl border-2 border-blue-600 bg-blue-600/10 p-8 font-bold text-blue-500 hover:bg-blue-600/20">
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
          onCapture={(d) => { setPhoto(d); setTransferAccepted(false); setMode("preview"); }}
          onFileInstead={() => fileRef.current?.click()}
        />
      )}

      {(mode === "preview" || mode === "busy") && photo && (
        <div className="card rounded-2xl border border-line bg-surface p-3">
          <div className="relative mx-auto aspect-[4/3] max-w-xl overflow-hidden rounded-xl bg-black">
            <Image src={photo} alt="ECG à analyser" fill className="object-contain" unoptimized />
            {mode === "busy" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white" role="status">
                <Loader2 className="h-10 w-10 animate-spin text-blue-400" aria-hidden />
                <p className="font-bold">{t("ai.ecg.analyzing")}</p>
              </div>
            )}
          </div>
          {mode === "preview" && (
            <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={transferAccepted}
                onChange={(event) => setTransferAccepted(event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-amber-500"
              />
              <span><T
                fr={`J’accepte l’envoi de cette image à ${providerName} (modèle ${aiConfig.visionModel}). Elle peut contenir des données de santé : anonymisez-la si possible et n’envoyez aucune image sans autorisation. Une miniature et les observations sont conservées localement (30 résultats maximum) jusqu’à suppression.`}
                ar={`أوافق على إرسال هذه الصورة إلى ${providerName} (النموذج ${aiConfig.visionModel}). قد تتضمن بيانات صحية: أزل ما يعرّف بالمريض إن أمكن، ولا ترسل الصورة دون إذن. تُحفظ صورة مصغّرة والملاحظات محلياً (حتى 30 نتيجة) إلى حين حذفها.`}
              /></span>
            </label>
          )}
          <div className="mt-3 flex justify-center gap-3">
            <button onClick={reset} className="touch gap-2 rounded-xl border border-line px-5 py-3 font-bold hover:bg-surface2">
              <RefreshCcw className="h-5 w-5" aria-hidden /> {t("ai.ecg.back")}
            </button>
            <button onClick={() => void analyze()} disabled={mode === "busy" || !transferAccepted}
              className="touch gap-2 rounded-xl bg-blue-600 px-8 py-3 text-lg font-black text-white hover:bg-blue-500 disabled:opacity-50">
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
          <ECGResultCard analysis={result} />
          <button onClick={reset} className="touch mx-auto gap-2 rounded-xl border border-line px-6 py-3 font-bold hover:bg-surface2">
            <RefreshCcw className="h-5 w-5" aria-hidden /> {t("ai.ecg.back")}
          </button>
        </>
      )}
    </section>
  );
}

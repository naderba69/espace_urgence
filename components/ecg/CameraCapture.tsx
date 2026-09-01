"use client";
// Capture photo via caméra avec repères d'alignement (grille) ; repli galerie si refusée/indisponible.
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/Providers";
import { Camera, RefreshCcw, ImageUp } from "lucide-react";

export default function CameraCapture({
  onCapture, onFileInstead,
}: {
  onCapture: (dataUrl: string) => void;
  onFileInstead: () => void;
}) {
  const { t, lang } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } } })
      .then((s) => {
        if (cancelled) { s.getTracks().forEach((tr) => tr.stop()); return; }
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setError("cam"));
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  const capture = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")?.drawImage(v, 0, 0);
    onCapture(c.toDataURL("image/jpeg", 0.92));
  };

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-6 text-center">
        <p className="font-bold text-amber-500">
          {lang === "ar" ? "تعذّر الوصول للكاميرا (صلاحية/HTTPS)" : "Caméra indisponible (autorisation/HTTPS)"}
        </p>
        <button onClick={onFileInstead} className="touch gap-2 rounded-xl bg-teal-600 px-5 py-3 font-bold text-white">
          <ImageUp className="h-5 w-5" aria-hidden /> {t("ai.ecg.upload")}
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-black">
      <video ref={videoRef} autoPlay playsInline muted className="block h-auto w-full" aria-label="caméra" />
      {/* Grille d'alignement : cadre + lignes directrices */}
      <svg viewBox="0 0 100 70" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <rect x="3" y="3" width="94" height="64" rx="3" fill="none" stroke="#0d9488" strokeWidth="0.6" strokeDasharray="2 1.5" opacity="0.9" />
        <line x1="33" y1="3" x2="33" y2="67" stroke="#0d9488" strokeWidth="0.3" opacity="0.5" />
        <line x1="66" y1="3" x2="66" y2="67" stroke="#0d9488" strokeWidth="0.3" opacity="0.5" />
        <line x1="3" y1="35" x2="97" y2="35" stroke="#0d9488" strokeWidth="0.3" opacity="0.5" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-gradient-to-t from-black/70 to-transparent p-4">
        <button onClick={capture}
          className="touch gap-2 rounded-2xl bg-teal-600 px-8 py-4 text-lg font-black text-white shadow-lg active:scale-95">
          <Camera className="h-7 w-7" aria-hidden /> {t("ai.ecg.capture")}
        </button>
        <button onClick={onFileInstead} className="touch gap-2 rounded-2xl bg-slate-700 px-4 py-4 font-bold text-white">
          <RefreshCcw className="h-5 w-5" aria-hidden />
          <span className="hidden sm:inline">{t("ai.ecg.upload")}</span>
        </button>
      </div>
    </div>
  );
}

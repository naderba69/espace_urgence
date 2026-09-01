"use client";
// Section « Intelligence artificielle » des Paramètres : fournisseur, modèles (champ libre), clé, test, on/off.
import { useEffect, useState } from "react";
import { useApp } from "@/components/Providers";
import { readAiConfig, writeAiConfig, DEFAULT_AI, PROVIDER_PRESETS, clearAiData, type AiProvider } from "@/lib/ai-config";
import { AiError, testConnection } from "@/lib/ai";
import { clearEcgRecords } from "@/lib/ecg-db";
import { BrainCircuit, CheckCircle2, Eye, EyeOff, Loader2, XCircle, Info } from "lucide-react";

function errKey(e: unknown): string {
  return e instanceof AiError ? `ai.error.${e.code}` : "ai.error.provider";
}

export default function AiSection() {
  const { t, lang } = useApp();
  const [cfg, setCfg] = useState(DEFAULT_AI);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"ok" | "ko" | null>(null);
  const [testMsg, setTestMsg] = useState("");

  useEffect(() => setCfg(readAiConfig()), []);

  const save = (patch: Partial<typeof cfg>) => {
    const next = { ...cfg, ...patch };
    setCfg(next);
    writeAiConfig(next);
    if (patch.enabled !== undefined || patch.provider || patch.apiKey !== undefined) setTestResult(null);
  };

  const runTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      await testConnection();
      setTestResult("ok");
      setTestMsg("");
    } catch (e) {
      setTestResult("ko");
      setTestMsg(t(errKey(e)));
    } finally {
      setTesting(false);
    }
  };

  const preset = PROVIDER_PRESETS[cfg.provider];

  return (
    <section className="card flex flex-col gap-4 rounded-2xl border border-teal-600/40 bg-surface p-4" aria-label="IA">
      <h2 className="flex items-center gap-2 font-bold text-teal-500">
        <BrainCircuit className="h-5 w-5" aria-hidden /> {t("settings.ai")}
      </h2>

      {/* interrupteur général */}
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold">{lang === "ar" ? "تفعيل الوظائف" : "Activer les fonctions IA"}</span>
        <button role="switch" aria-checked={cfg.enabled} onClick={() => save({ enabled: !cfg.enabled })}
          className={`touch w-16 rounded-full border-2 px-1 py-1 transition ${cfg.enabled ? "border-teal-600 bg-teal-600 justify-end" : "border-line bg-surface2 justify-start"} flex`}>
          <span className="h-6 w-6 rounded-full bg-white shadow" />
        </button>
      </div>

      {cfg.enabled && (
        <>
          {/* fournisseur */}
          <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="provider">
            {(Object.keys(PROVIDER_PRESETS) as AiProvider[]).map((p) => (
              <button key={p} onClick={() => {
                const pr = PROVIDER_PRESETS[p];
                save({ provider: p, textModel: pr.text, visionModel: pr.vision });
              }} aria-pressed={cfg.provider === p}
                className={`touch rounded-xl border px-4 py-3 font-bold ${cfg.provider === p ? "border-teal-600 bg-teal-600 text-white" : "border-line hover:bg-surface2"}`}>
                {p === "gemini" ? "Google Gemini" : "OpenRouter"}
              </button>
            ))}
          </div>
          <p className="text-xs opacity-60">{lang === "ar" ? preset.note.ar : preset.note.fr}</p>

          {/* clé API */}
          <label className="flex flex-col gap-1 font-semibold">
            API key
            <span className="flex items-center gap-2 rounded-xl border border-line bg-surface2 px-3">
              <input
                type={showKey ? "text" : "password"}
                value={cfg.apiKey}
                onChange={(e) => save({ apiKey: e.target.value.trim() })}
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-transparent py-3 font-mono text-sm outline-none"
                placeholder="••••••••••••••••"
              />
              <button onClick={() => setShowKey((s) => !s)} className="touch" aria-label={showKey ? "masquer" : "afficher"}>
                {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </span>
          </label>

          {/* modèles (champs libres) */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-semibold">
              {lang === "ar" ? "نموذج النص" : "Modèle texte"}
              <input value={cfg.textModel} onChange={(e) => save({ textModel: e.target.value.trim() })}
                className="rounded-xl border border-line bg-surface2 px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-teal-600" />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              {lang === "ar" ? "نموذج الرؤية" : "Modèle vision"}
              <input value={cfg.visionModel} onChange={(e) => save({ visionModel: e.target.value.trim() })}
                className="rounded-xl border border-line bg-surface2 px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-teal-600" />
            </label>
          </div>

          {/* test */}
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={runTest} disabled={testing || !cfg.apiKey.trim()}
              className="touch gap-2 rounded-xl bg-teal-600 px-5 py-2 font-bold text-white hover:bg-teal-500 disabled:opacity-40">
              {testing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
              {lang === "ar" ? "اختبر الاتصال" : "Tester la connexion"}
            </button>
            {testResult === "ok" && (
              <span className="flex items-center gap-1 font-bold text-teal-500"><CheckCircle2 className="h-5 w-5" /> OK ✓</span>
            )}
            {testResult === "ko" && (
              <span className="flex items-center gap-1 font-bold text-red-400"><XCircle className="h-5 w-5" /> {testMsg}</span>
            )}
          </div>

          {/* historiques */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { clearAiData(); }} className="touch rounded-xl border border-line px-4 py-2 text-sm font-semibold hover:bg-surface2">
              {lang === "ar" ? "مسح محادثة المساعد" : "Effacer l'historique du chat"}
            </button>
            <button onClick={() => { void clearEcgRecords(); }} className="touch rounded-xl border border-line px-4 py-2 text-sm font-semibold hover:bg-surface2">
              {lang === "ar" ? "مسح سجل تحاليل ECG" : "Effacer l'historique ECG"}
            </button>
          </div>

          <p className="flex gap-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-500">
            <Info className="h-4 w-4 shrink-0" aria-hidden />
            {lang === "ar"
              ? "بياناتك (نصوص/صور) تُرسل مباشرة من متصفحك إلى المزوّد المختار — تكاليف محتملة على حسابك. المفتاح محفوظ محلياً فقط؛ لا تدخله على جهاز مشترك."
              : "Vos données (textes/images) partent de votre navigateur vers le fournisseur choisi — coûts possibles sur votre compte. La clé n'est stockée que localement ; ne la saisissez pas sur un appareil partagé."}
          </p>
        </>
      )}
    </section>
  );
}

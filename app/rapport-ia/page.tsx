"use client";
// Générateur de transmission médicale structurée (copier / imprimer).
import { useRef, useState } from "react";
import AiGate from "@/components/ai/AiGate";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import { generateText, AiError } from "@/lib/ai";
import { trackEvent } from "@/lib/analytics";
import { Copy, FileText, Loader2 } from "lucide-react";
import { reveal } from "@/lib/reveal";

// Champ de formulaire statique, défini HORS du rendu (react-hooks/static-components).
function Field({ label, rows = 1, value, onChange }: {
  label: { fr: string; ar: string };
  rows?: number;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 font-semibold">
      <T fr={label.fr} ar={label.ar} />
      {rows > 1 ? (
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)}
          className="rounded-xl border border-line bg-surface2 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-600" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)}
          className="rounded-xl border border-line bg-surface2 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-600" />
      )}
    </label>
  );
}

export default function RapportPage() {
  const { t, lang } = useApp();
  const [f, setF] = useState({ age: "", sexe: "H", motif: "", histoire: "", constantes: "", gestes: "", traitements: "" });
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const outRef = useRef<HTMLDivElement>(null);

  const run = async () => {
    if (busy || !f.motif.trim()) return;
    setBusy(true);
    setErr("");
    setOut("");
    trackEvent("ai_query", { kind: "report" });
    const sys =
      lang === "ar"
        ? "حرّر ملاحظة تسليم طبية بالعربية بنمط SBAR (الوضع، الخلفية، التقييم، التوصية) — محترفة، موجزة، بلا حشو. لا تخترع معطيات غير معطاة؛ اكتب «غير مذكور» عند الغياب."
        : "Rédige une note de transmission médicale en français, format SBAR (Situation, Background, Assessment, Recommandation) — ton professionnel, concis, sans invention : note « non précisé » si l'information manque.";
    const prompt = `Âge : ${f.age || "?"} — Sexe : ${f.sexe}\nMotif : ${f.motif}\nHistoire/contexte : ${f.histoire || "—"}\nConstantes : ${f.constantes || "—"}\nGestes/interventions : ${f.gestes || "—"}\nTraitements : ${f.traitements || "—"}`;
    try {
      setOut(await generateText(prompt, sys));
      reveal(outRef.current);
    } catch (e) {
      setErr(e instanceof AiError ? t(`ai.error.${e.code}`) : t("ai.error.provider"));
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(out); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* refusé */ }
  };

  const bind = (k: keyof typeof f) => ({
    value: f[k],
    onChange: (v: string) => setF((p) => ({ ...p, [k]: v })),
  });

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold"><FileText className="h-7 w-7 text-blue-500" /> {t("ai.report.title")}</h1>
      </header>
      <AiGate title={t("ai.report.title")}>
        <div className="card flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1 text-sm font-semibold">
              <T fr="Âge" ar="العمر" />
              <input value={f.age} onChange={(e) => setF((p) => ({ ...p, age: e.target.value }))} inputMode="numeric"
                className="rounded-xl border border-line bg-surface2 px-3 py-2.5 tabular-nums outline-none focus:ring-2 focus:ring-blue-600" />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              <T fr="Sexe" ar="الجنس" />
              <select value={f.sexe} onChange={(e) => setF((p) => ({ ...p, sexe: e.target.value }))}
                className="rounded-xl border border-line bg-surface2 px-3 py-2.5 outline-none">
                <option value="H">{lang === "ar" ? "ذكر" : "Homme"}</option>
                <option value="F">{lang === "ar" ? "أنثى" : "Femme"}</option>
              </select>
            </label>
            <div />
          </div>
          <Field {...bind("motif")} label={{ fr: "Motif", ar: "الشكوى" }} />
          <Field {...bind("histoire")} rows={2} label={{ fr: "Histoire / contexte", ar: "القصة / السياق" }} />
          <Field {...bind("constantes")} label={{ fr: "Constantes (FC FR TA SpO2 GCS gly)", ar: "العلامات (نبض تنفس ضغط تشبع غلاسكو سكر)" }} />
          <Field {...bind("gestes")} rows={2} label={{ fr: "Gestes / examens réalisés", ar: "إجراءات / فحوص أُنجزت" }} />
          <Field {...bind("traitements")} rows={2} label={{ fr: "Traitements administrés", ar: "أدوية أُعطيت" }} />
          <button onClick={() => void run()} disabled={busy || !f.motif.trim()}
            className="touch gap-2 self-start rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-40">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
            <T fr="Générer la note" ar="ولّد الملاحظة" />
          </button>
          {err && <p role="alert" className="rounded-xl bg-red-500/15 p-3 text-sm font-bold text-red-400">{err}</p>}
        </div>

        <div ref={outRef} className="scroll-mt-16" aria-hidden />

        {out && (
          <div className="card rounded-2xl border border-line bg-surface p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-bold text-blue-500"><T fr="Note générée (SBAR)" ar="الملاحظة المولّدة (SBAR)" /></p>
              <button onClick={() => void copy()} className="touch gap-2 rounded-xl border border-line px-3 py-1.5 text-sm font-semibold hover:bg-surface2">
                <Copy className="h-4 w-4" aria-hidden /> {copied ? t("ai.ecg.copied") : t("ai.ecg.copy")}
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{out}</pre>
          </div>
        )}
      </AiGate>
    </div>
  );
}

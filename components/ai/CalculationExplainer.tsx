"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { BrainCircuit, Loader2, Settings2 } from "lucide-react";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import { AiError, generateText } from "@/lib/ai";
import { aiReady, readAiConfig } from "@/lib/ai-config";
import {
  buildCalculationExplanationRequest,
  type CalculationExplanationContext,
} from "@/lib/ai-calculation-explanation";

function errorKey(error: unknown): string {
  return error instanceof AiError ? `ai.error.${error.code}` : "ai.error.provider";
}

type TransferDestination = { provider: string; model: string };

function currentDestination(): TransferDestination {
  const config = readAiConfig();
  return {
    provider: config.provider === "openrouter" ? "OpenRouter" : "Google Gemini",
    model: config.textModel,
  };
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-t border-line/70 py-1.5 sm:grid-cols-[minmax(8rem,0.35fr)_1fr]">
      <dt className="text-xs font-bold opacity-70">{label}</dt>
      <dd className="text-xs" dir="auto">{value}</dd>
    </div>
  );
}

/** Explication optionnelle d’un résultat déjà calculé ; n’altère jamais le résultat affiché. */
export default function CalculationExplainer({ context }: { context: CalculationExplanationContext }) {
  const { lang, t } = useApp();
  const consentHeadingId = useId();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [destination, setDestination] = useState<TransferDestination | null>(null);
  const [destinationChanged, setDestinationChanged] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<{ signature: string; text: string } | null>(null);
  const [error, setError] = useState<{ signature: string; message: string } | null>(null);
  const signature = JSON.stringify({ context, lang });
  const visibleAnswer = answer?.signature === signature ? answer.text : null;
  const visibleError = error?.signature === signature ? error.message : null;

  const openExplanation = () => {
    setError(null);
    if (!aiReady()) {
      setConfigOpen(true);
      setConfirmOpen(false);
      return;
    }
    setConfigOpen(false);
    setDestination(currentDestination());
    setDestinationChanged(false);
    setConfirmOpen(true);
  };

  const sendForExplanation = async () => {
    if (!aiReady()) {
      setConfirmOpen(false);
      setConfigOpen(true);
      return;
    }

    const current = currentDestination();
    if (!destination || destination.provider !== current.provider || destination.model !== current.model) {
      setDestination(current);
      setDestinationChanged(true);
      setConfirmOpen(true);
      return;
    }

    const request = buildCalculationExplanationRequest(context, lang);
    const requestSignature = signature;
    setConfirmOpen(false);
    setConfigOpen(false);
    setAnswer(null);
    setError(null);
    setLoading(true);
    try {
      const text = await generateText(request.prompt, request.systemPrompt, { transferConfirmed: true, language: lang });
      setAnswer({ signature: requestSignature, text: text.slice(0, 5_000) });
    } catch (cause) {
      setError({ signature: requestSignature, message: t(errorKey(cause)) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={openExplanation}
        disabled={loading}
        aria-expanded={confirmOpen || configOpen}
        className="touch inline-flex min-h-11 items-center gap-2 rounded-xl border border-blue-600/50 px-3 py-2 text-xs font-black text-blue-600 hover:bg-blue-600/10 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <BrainCircuit className="h-4 w-4" aria-hidden />}
        <T fr="Expliquer ce résultat avec l’IA" ar="اشرح هذه النتيجة بالذكاء الاصطناعي" />
      </button>

      {configOpen && (
        <div className="mt-2 rounded-xl border border-blue-600/30 bg-blue-600/5 p-3" role="status">
          <p className="text-sm font-bold"><T fr="L’IA n’est pas configurée ou activée." ar="الذكاء الاصطناعي غير مُعدّ أو غير مفعّل." /></p>
          <Link href="/parametres" className="touch mt-2 inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-black text-white">
            <Settings2 className="h-4 w-4" aria-hidden />
            <T fr="Ouvrir les paramètres IA" ar="افتح إعدادات الذكاء الاصطناعي" />
          </Link>
        </div>
      )}

      {confirmOpen && (
        <section className="mt-2 rounded-xl border border-amber-600/40 bg-amber-500/5 p-3" aria-labelledby={consentHeadingId}>
          <h3 id={consentHeadingId} className="text-sm font-black">
            <T fr="Confirmer avant l’envoi" ar="تأكيد الإرسال أولاً" />
          </h3>
          {destinationChanged && (
            <p className="mt-1 rounded-lg bg-amber-500/10 p-2 text-xs font-bold" role="status">
              <T fr="La configuration IA a changé depuis l’ouverture. Vérifiez le fournisseur et le modèle ci-dessous avant tout envoi." ar="تغيّر إعداد الذكاء الاصطناعي منذ فتح هذه النافذة. تحقّق من المزوّد والنموذج أدناه قبل الإرسال." />
            </p>
          )}
          <p className="mt-1 text-xs leading-relaxed">
            <T
              fr="Après confirmation, le contexte affiché ci-dessous sera envoyé directement depuis ce navigateur au fournisseur IA que vous avez choisi. Les deux calculateurs concernés n’incluent ni nom ni identifiant patient, mais les valeurs restent des données de santé : continuez uniquement si les règles de votre établissement et celles du fournisseur l’autorisent. Des coûts liés à votre compte peuvent s’appliquer. Cette demande n’est pas ajoutée à l’historique local. L’IA explique le résultat fourni par l’application ; elle ne le recalcule pas et ne choisit pas de traitement."
              ar="بعد التأكيد، تُرسل المعلومات المعروضة أدناه مباشرةً من هذا المتصفح إلى مزوّد الذكاء الاصطناعي الذي اخترته. الحاسبتان المعنيتان لا تضيفان اسم المريض أو معرّفه، لكن القيم تظل معطيات صحية: تابع فقط إذا سمحت قواعد مؤسستك وسياسة المزوّد بذلك. قد تُحتسب كلفة على حسابك. لا يُضاف هذا الطلب إلى السجل المحلي. يشرح الذكاء الاصطناعي نتيجة التطبيق؛ ولا يعيد حسابها أو يختار علاجاً."
            />
          </p>

          <dl className="mt-2 rounded-lg bg-surface/80 px-2">
            <ContextRow label={lang === "ar" ? "المزوّد الخارجي" : "Fournisseur externe"} value={destination?.provider ?? "—"} />
            <ContextRow label={lang === "ar" ? "النموذج" : "Modèle"} value={destination?.model ?? "—"} />
            <ContextRow label={lang === "ar" ? "الحاسبة / النتيجة" : "Outil / résultat"} value={context.title} />
            <ContextRow label={lang === "ar" ? "الطريقة" : "Méthode"} value={context.method} />
            {context.inputs.map((item, index) => <ContextRow key={`${item.label}-${index}`} label={item.label} value={item.value} />)}
            <ContextRow label={lang === "ar" ? "المحصلة التي سيرسلها التطبيق" : "Résultat transmis"} value={context.result} />
            <ContextRow label={lang === "ar" ? "المصدر" : "Source"} value={context.source} />
            {context.limitations.map((item, index) => <ContextRow key={`limitation-${index}`} label={lang === "ar" ? "حدّ" : "Limite"} value={item} />)}
          </dl>

          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => void sendForExplanation()} className="touch min-h-10 rounded-lg bg-blue-600 px-3 py-2 text-xs font-black text-white">
              <T fr="Envoyer et expliquer" ar="أرسل واشرح" />
            </button>
            <button type="button" onClick={() => { setConfirmOpen(false); setDestinationChanged(false); }} className="touch min-h-10 rounded-lg border border-line px-3 py-2 text-xs font-bold">
              <T fr="Annuler" ar="إلغاء" />
            </button>
          </div>
        </section>
      )}

      {loading && (
        <p className="mt-2 flex items-center gap-2 text-xs font-bold" role="status" aria-live="polite">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          <T fr="L’IA prépare une explication du résultat affiché…" ar="يُعدّ الذكاء الاصطناعي شرحاً للنتيجة المعروضة…" />
        </p>
      )}

      {visibleError && <p className="mt-2 rounded-lg bg-red-500/10 p-2 text-xs font-bold text-red-600" role="alert">{visibleError}</p>}

      {visibleAnswer && (
        <div className="mt-2 rounded-xl border border-blue-600/30 bg-blue-600/5 p-3" aria-live="polite">
          <p className="text-xs font-black text-blue-600"><T fr="Explication IA (non vérifiée)" ar="شرح الذكاء الاصطناعي (غير مُدقّق)" /></p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed" dir="auto">{visibleAnswer}</p>
          <p className="mt-2 border-t border-blue-600/20 pt-2 text-[11px] leading-relaxed opacity-75">
            <T
              fr="L’IA peut se tromper. Cette explication ne valide pas la source, n’est pas une recommandation de dose et ne modifie pas le résultat original. Vérifiez le RCP/protocole applicable et demandez une revue professionnelle."
              ar="قد يخطئ الذكاء الاصطناعي. هذا الشرح لا يصادق على المصدر، وليس توصية بجرعة ولا يغيّر نتيجة التطبيق الأصلية. راجع النشرة أو البروتوكول المعمول به واطلب مراجعة مختص."
            />
          </p>
        </div>
      )}
    </div>
  );
}

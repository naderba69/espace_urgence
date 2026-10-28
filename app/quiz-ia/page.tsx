"use client";
// Quiz de révision IA : QCM générés depuis le contenu du site, correction immédiate.
import { useRef, useState } from "react";
import Link from "next/link";
import AiGate from "@/components/ai/AiGate";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import { generateText, AiError } from "@/lib/ai";
import { trackEvent } from "@/lib/analytics";
import { GraduationCap, Loader2, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { reveal } from "@/lib/reveal";
import { useRefIndexMap } from "@/lib/ref-index";
import { AiQuizValidationError, parseGeneratedAiQuiz, type AiQuizItem } from "@/lib/ai-quiz";

export default function QuizPage() {
  const { t, lang } = useApp();
  const [topic, setTopic] = useState("acr-adulte");
  const [qs, setQs] = useState<AiQuizItem[]>([]);
  const [quizSource, setQuizSource] = useState<{ title: string; sources: string[] } | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const quizRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  // v17.3 — le menu des thèmes vient du fichier de références (~15 Ko gzip) : la page ne
  // télécharge plus les 98 fiches. Le contenu complet n'est chargé qu'au moment de générer.
  const refMap = useRefIndexMap();
  const topics = [...(refMap?.values() ?? [])].filter((r) => r.type === "protocole");
  const finished = qs.length > 0 && idx >= qs.length;

  const run = async () => {
    if (busy) return;
    setBusy(true);
    setErr("");
    setQs([]);
    setQuizSource(null);
    setIdx(0);
    setScore(0);
    setPicked(null);
    trackEvent("ai_query", { kind: "quiz" });
    try {
      // Le contenu source n'est chargé qu'au clic explicite sur « Générer ».
      const { getProtocol } = await import("@/data/protocols");
      const protocol = getProtocol(topic);
      if (!protocol) throw new Error("protocol-not-found");

      const protocolContext = JSON.stringify({
        title: protocol.title,
        steps: protocol.steps.map((step) => step.title),
        keyPoints: protocol.keyPoints,
        references: protocol.meta.sources,
      });
      const systemPrompt = lang === "ar"
        ? `أنشئ خمسة أسئلة تعليمية لفهم بنية البروتوكول ومبادئ السلامة فقط. لا تسأل ولا تذكر جرعات أو أرقاماً أو عتبات أو مدد علاج أو توصيات علاجية جديدة. لا تضف معلومة غير موجودة في المصدر. إذا لم تكفِ المادة، أعد أسئلة أقل تنوعاً لكن أرسل خمسة وفق المخطط. أجب بمصفوفة JSON فقط، لكل عنصر question وoptions (أربعة نصوص) وcorrect (فهرس من صفر إلى ثلاثة) وexplanation. المصدر: ${protocolContext}`
        : `Crée cinq QCM pédagogiques sur la compréhension de la structure du protocole et ses principes de sécurité uniquement. N'interroge pas et ne mentionne aucune dose, aucun chiffre, seuil, délai thérapeutique ou nouvelle recommandation. N'ajoute rien qui ne figure dans la source. Réponds uniquement par un tableau JSON de cinq objets avec question, options (quatre textes), correct (index de zéro à trois) et explanation. Source : ${protocolContext}`;

      const raw = await generateText("Génère le quiz.", systemPrompt, { language: lang });
      const parsed = parseGeneratedAiQuiz(raw);
      setQs(parsed);
      setQuizSource({
        title: lang === "ar" ? protocol.title.ar : protocol.title.fr,
        sources: protocol.meta.sources,
      });
      reveal(quizRef.current);
    } catch (cause) {
      if (cause instanceof AiQuizValidationError) {
        setErr(cause.reason === "numeric-content"
          ? (lang === "ar"
            ? "رُفض الاختبار لأن الإجابة تضمنت أرقاماً أو وحدات. استخدم اختبار المراجعة الثابت أو راجع البروتوكول مباشرة."
            : "QCM refusé : la réponse contient des chiffres ou des unités, ou ne respecte pas le format attendu. Utilisez le quiz de révision fixe ou consultez directement le protocole.")
          : (lang === "ar"
            ? "تعذر إنشاء اختبار من هذا البروتوكول. استخدم اختبار المراجعة الثابت."
            : "Impossible de créer le QCM à partir de ce protocole. Utilisez le quiz de révision fixe."));
      } else if (cause instanceof Error && cause.message === "protocol-not-found") {
        setErr(lang === "ar" ? "لم يُعثر على البروتوكول المختار." : "Le protocole sélectionné est introuvable.");
      } else {
        setErr(cause instanceof AiError ? t(`ai.error.${cause.code}`) : t("ai.error.provider"));
      }
    } finally {
      setBusy(false);
    }
  };

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === qs[idx].correct) setScore((s) => s + 1);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <h1 className="flex items-center gap-2 text-2xl font-extrabold"><GraduationCap className="h-7 w-7 text-blue-500" /> {t("ai.quiz.title")}</h1>
      <p role="note" className="rounded-xl border border-amber-600/40 bg-amber-500/10 p-3 text-sm leading-relaxed">
        <T
          fr="Quiz généré par IA, non vérifié : une erreur reste possible. Il ne sert pas à prendre une décision clinique. Les chiffres, unités et formats non conformes sont refusés automatiquement, mais les autres réponses peuvent aussi être erronées et doivent être vérifiées dans le protocole et ses références."
          ar="اختبار مولّد بالذكاء الاصطناعي وغير مُدقّق؛ قد تبقى فيه أخطاء. لا يُستخدم لاتخاذ قرار سريري. تُرفض الأرقام المكتوبة بالأرقام والوحدات والتنسيقات غير المطابقة آلياً، لكن قد تبقى أخطاء في بقية الإجابات؛ تحقّق منها في البروتوكول ومراجعه."
        />
      </p>
      <p className="text-sm"><Link href="/quiz" className="font-bold text-blue-600 underline"><T fr="Ouvrir le quiz de révision fixe" ar="افتح اختبار المراجعة الثابت" /></Link></p>
      <AiGate title={t("ai.quiz.title")}>
        <div className="card flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-surface p-4">
          <label className="flex min-w-48 flex-1 flex-col gap-1 font-semibold">
            <T fr="Thème (protocole du site)" ar="الموضوع (بروتوكول من الموقع)" />
            <select value={topic} onChange={(e) => setTopic(e.target.value)}
              className="rounded-xl border border-line bg-surface2 px-3 py-3 outline-none">
              {topics.map((r) => (
                <option key={r.key} value={r.key.split(":")[1]}>
                  {lang === "ar" ? r.title.ar : r.title.fr}
                </option>
              ))}
            </select>
          </label>
          <button onClick={() => void run()} disabled={busy}
            className="touch gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-40">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            <T fr="Générer 5 questions" ar="ولّد 5 أسئلة" />
          </button>
        </div>
        {err && <p role="alert" className="rounded-xl bg-red-500/15 p-3 text-sm font-bold text-red-400">{err}</p>}

        {/* jeu */}
        <div ref={quizRef} className="scroll-mt-16" aria-hidden />

        {qs.length > 0 && !finished && (
          <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
            <p className="text-sm font-bold opacity-70">
              {idx + 1}/{qs.length} · <T fr="Score" ar="النتيجة" /> {score}
            </p>
            {quizSource && (
              <p className="rounded-lg bg-surface2 p-2 text-xs leading-relaxed" dir="auto">
                <T fr="Thème source (à vérifier)" ar="مصدر الموضوع (يجب التحقق منه)" /> : {quizSource.title}
                {quizSource.sources.length > 0 && <> — <T fr="Références" ar="المراجع" /> : {quizSource.sources.join(" · ")}</>}
              </p>
            )}
            <p className="text-lg font-bold">{qs[idx].question}</p>
            <div className="grid gap-2">
              {qs[idx].options.map((o, i) => {
                const isRight = picked !== null && i === qs[idx].correct;
                const isWrongPick = picked === i && i !== qs[idx].correct;
                return (
                  <button key={i} onClick={() => pick(i)}
                    className={`touch justify-start rounded-xl border px-4 py-3 text-start font-semibold ${
                      isRight ? "border-blue-600 bg-blue-600/15 text-blue-400" : isWrongPick ? "border-red-600 bg-red-600/15 text-red-400" : picked !== null ? "border-line opacity-60" : "border-line hover:bg-surface2"
                    }`}>
                    <span className="me-2 font-black">{String.fromCharCode(65 + i)}.</span> {o}
                    {isRight && <CheckCircle2 className="ms-1 inline h-4 w-4" aria-hidden />}
                    {isWrongPick && <XCircle className="ms-1 inline h-4 w-4" aria-hidden />}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="rounded-xl bg-surface2 p-3 text-sm">
                <p className="font-bold">{picked === qs[idx].correct ? "✅" : "❌"} {qs[idx].explanation}</p>
                <button onClick={() => { setIdx((i) => i + 1); setPicked(null); }}
                  className="touch mt-3 rounded-xl bg-blue-600 px-5 py-2 font-bold text-white">
                  <T fr="Suivant" ar="التالي" />
                </button>
              </div>
            )}
          </div>
        )}

        {finished && (
          <div className="card rounded-2xl border border-blue-600 bg-blue-600/10 p-6 text-center">
            <p className="text-4xl font-black tabular-nums">{score}/{qs.length}</p>
            <p className="mt-1 font-bold opacity-80">
              {score === qs.length ? "😎" : score >= 3 ? "👍" : "📚"}
            </p>
            <button onClick={() => void run()} className="touch mx-auto mt-3 gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white">
              <RotateCcw className="h-5 w-5" aria-hidden /> <T fr="Rejouer" ar="أعد اللعب" />
            </button>
          </div>
        )}
      </AiGate>
    </div>
  );
}

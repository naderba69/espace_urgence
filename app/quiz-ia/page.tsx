"use client";
// Quiz de révision IA : QCM générés depuis le contenu du site, correction immédiate.
import { useState } from "react";
import AiGate from "@/components/ai/AiGate";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import { generateText, AiError } from "@/lib/ai";
import { protocols } from "@/data/protocols";
import { trackEvent } from "@/lib/analytics";
import { GraduationCap, Loader2, RotateCcw, CheckCircle2, XCircle } from "lucide-react";

interface Qcm { question: string; options: string[]; correct: number; explanation: string }

export default function QuizPage() {
  const { t, lang } = useApp();
  const [topic, setTopic] = useState("acr-adulte");
  const [qs, setQs] = useState<Qcm[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const finished = qs.length > 0 && idx >= qs.length;

  const run = async () => {
    setBusy(true);
    setErr("");
    setQs([]);
    setIdx(0);
    setScore(0);
    setPicked(null);
    trackEvent("ai_query", { kind: "quiz" });
    const p = protocols.find((x) => x.id === topic);
    const sys =
      (lang === "ar"
        ? "أنشئ 5 أسئلة اختيار متعددة بالعربية لمهنيي الاستعجالي حول البروتوكول أدناه. أجب فقط بمصفوفة JSON: [{\"question\":\"...\",\"options\":[\"أ\",\"ب\",\"ج\",\"د\"],\"correct\":0,\"explanation\":\"قصيرة\"}]. كل الخيارات قصيرة ومحتملة؛ تجنّب «كل ما سبق». البروتوكول: "
        : "Génère 5 QCM en français pour professionnels des urgences sur le protocole ci-dessous. Réponds UNIQUEMENT par un tableau JSON : [{\"question\":\"...\",\"options\":[\"a\",\"b\",\"c\",\"d\"],\"correct\":0,\"explication_courte\":\"...\"} mappé sur la clé explanation]. Options courtes et plausibles ; pas de « toutes les réponses ». Protocole : ") +
      (p ? JSON.stringify({ titre: p.title, etapes: p.steps.map((s) => s.title), points: p.keyPoints }) : "");
    try {
      const raw = await generateText("Génère le quiz.", sys);
      const m = raw.match(/\[[\s\S]*\]/);
      const parsed = m ? (JSON.parse(m[0]) as Qcm[]) : null;
      if (!parsed || !Array.isArray(parsed) || !parsed[0]?.options) throw new Error("format");
      setQs(parsed.slice(0, 5));
    } catch (e) {
      setErr(e instanceof AiError ? t(`ai.error.${e.code}`) : t("ai.error.provider"));
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
      <h1 className="flex items-center gap-2 text-2xl font-extrabold"><GraduationCap className="h-7 w-7 text-teal-500" /> {t("ai.quiz.title")}</h1>
      <AiGate title={t("ai.quiz.title")}>
        <div className="card flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-surface p-4">
          <label className="flex min-w-48 flex-1 flex-col gap-1 font-semibold">
            <T fr="Thème (protocole du site)" ar="الموضوع (بروتوكول من الموقع)" />
            <select value={topic} onChange={(e) => setTopic(e.target.value)}
              className="rounded-xl border border-line bg-surface2 px-3 py-3 outline-none">
              {protocols.map((p) => (
                <option key={p.id} value={p.id}>{lang === "ar" ? p.title.ar : p.title.fr}</option>
              ))}
            </select>
          </label>
          <button onClick={() => void run()} disabled={busy}
            className="touch gap-2 rounded-xl bg-teal-600 px-6 py-3 font-bold text-white hover:bg-teal-500 disabled:opacity-40">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            <T fr="Générer 5 questions" ar="ولّد 5 أسئلة" />
          </button>
        </div>
        {err && <p role="alert" className="rounded-xl bg-red-500/15 p-3 text-sm font-bold text-red-400">{err}</p>}

        {/* jeu */}
        {qs.length > 0 && !finished && (
          <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
            <p className="text-sm font-bold opacity-70">
              {idx + 1}/{qs.length} · <T fr="Score" ar="النتيجة" /> {score}
            </p>
            <p className="text-lg font-bold">{qs[idx].question}</p>
            <div className="grid gap-2">
              {qs[idx].options.map((o, i) => {
                const isRight = picked !== null && i === qs[idx].correct;
                const isWrongPick = picked === i && i !== qs[idx].correct;
                return (
                  <button key={i} onClick={() => pick(i)}
                    className={`touch justify-start rounded-xl border px-4 py-3 text-start font-semibold ${
                      isRight ? "border-teal-600 bg-teal-600/15 text-teal-400" : isWrongPick ? "border-red-600 bg-red-600/15 text-red-400" : picked !== null ? "border-line opacity-60" : "border-line hover:bg-surface2"
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
                  className="touch mt-3 rounded-xl bg-teal-600 px-5 py-2 font-bold text-white">
                  <T fr="Suivant" ar="التالي" />
                </button>
              </div>
            )}
          </div>
        )}

        {finished && (
          <div className="card rounded-2xl border border-teal-600 bg-teal-600/10 p-6 text-center">
            <p className="text-4xl font-black tabular-nums">{score}/{qs.length}</p>
            <p className="mt-1 font-bold opacity-80">
              {score === qs.length ? "😎" : score >= 3 ? "👍" : "📚"}
            </p>
            <button onClick={() => void run()} className="touch mx-auto mt-3 gap-2 rounded-xl bg-teal-600 px-6 py-3 font-bold text-white">
              <RotateCcw className="h-5 w-5" aria-hidden /> <T fr="Rejouer" ar="أعد اللعب" />
            </button>
          </div>
        )}
      </AiGate>
    </div>
  );
}

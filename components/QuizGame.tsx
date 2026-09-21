"use client";
// v2.7 — وضع الاختبار الذاتي: أسئلة من محتوى المشروع مع التعليل.
import { useEffect, useState } from "react";
import { QUIZ, type QuizCat } from "@/data/quiz";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";

/** hachage FNV-1a : graine déterministe à partir du texte (SSR-safe). */
function hashStr(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/** permutation déterministe (même graine => même ordre, serveur et client). */
function seededOrder(n: number, seed: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  let s = seed >>> 0;
  for (let j = a.length - 1; j > 0; j--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const k = s % (j + 1);
    [a[j], a[k]] = [a[k], a[j]];
  }
  return a;
}

/** Fisher-Yates aléatoire (interactions client uniquement). */
function shuffled(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let j = a.length - 1; j > 0; j--) {
    const k = Math.floor(Math.random() * (j + 1));
    [a[j], a[k]] = [a[k], a[j]];
  }
  return a;
}

// v9.2 — Next 16 : la page (export default) n'accepte pas de props custom ;
// le corps vit dans QuizInner (testable avec un minuteur court).
export default function QuizInner({ seconds = 20 }: { seconds?: number }) {
  const { lang } = useApp();
  useRegisterRecent("quiz");
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [challenge, setChallenge] = useState(false);
  const [left, setLeft] = useState(seconds);
  const [cat, setCat] = useState<"all" | QuizCat>("all");
  const [order, setOrder] = useState<number[]>([]);

  const list = QUIZ.filter((x) => cat === "all" || x.cat === cat);
  const item = list[Math.min(idx, list.length - 1)];
  /** permutation courante ; repli déterministe (graine = question) pour le premier rendu SSR */
  const ord = order.length === item.options.length ? order : seededOrder(item.options.length, hashStr(item.q.fr));

  useEffect(() => {
    if (!challenge || picked !== null || finished || left <= 0) return;
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [challenge, left, picked, finished]);

  const shown = picked !== null ? picked : challenge && left <= 0 && !finished ? -1 : null;

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (ord[i] === item.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 >= list.length) { setFinished(true); return; }
    const nxt = list[idx + 1];
    setIdx(idx + 1); setPicked(null); setLeft(seconds);
    setOrder(shuffled(nxt.options.length));
  };

  const CATS: { id: "all" | QuizCat; fr: string; ar: string }[] = [
    { id: "all", fr: "Tout", ar: "الكل" },
    { id: "med", fr: "Médicaments", ar: "أدوية" },
    { id: "proc", fr: "Procédures", ar: "إجراءات" },
    { id: "score", fr: "Scores", ar: "درجات" },
    { id: "triage", fr: "Triage", ar: "فرز" },
  ];

  const restart = () => { setIdx(0); setPicked(null); setScore(0); setFinished(false); setOrder(shuffled(list[0].options.length)); };

  if (finished) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-10">
        <p className="text-5xl font-black tabular-nums text-blue-500">{score}/{list.length}</p>
        <p className="text-lg font-bold">{lang === "ar" ? "نتيجتك" : "Votre score"}</p>
        <button onClick={restart} className="touch rounded-xl bg-blue-600 px-6 py-3 font-black text-white active:scale-[.98]">
          {lang === "ar" ? "أعد المحاولة" : "Recommencer"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">{lang === "ar" ? "اختبار ذاتي" : "Quiz"}</h1>
        <div className="flex items-center gap-2">
          {challenge && shown === null && !finished && (
            <p className={`rounded-full px-3 py-1 font-black tabular-nums ${left <= 5 ? "bg-red-600/15 text-red-500" : "bg-amber-500/15 text-amber-500"}`} dir="ltr">{left}s</p>
          )}
          <button onClick={() => { const nc = !challenge; setChallenge(nc); setLeft(seconds); if (nc && picked === null) setOrder(shuffled(item.options.length)); }} aria-pressed={challenge}
            className={`touch rounded-xl border px-3 py-1 text-sm font-bold ${challenge ? "border-amber-500 bg-amber-500/15 text-amber-500" : "border-line"}`}>
            {lang === "ar" ? "تحدي 20 ث" : "Défi 20 s"}
          </button>
          <p className="font-black tabular-nums opacity-70">{idx + 1} / {list.length}</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c.id} onClick={() => { const nl = QUIZ.filter((x) => c.id === "all" || x.cat === c.id); setCat(c.id); setIdx(0); setPicked(null); setFinished(false); setLeft(seconds); setOrder(shuffled(nl[0].options.length)); }} aria-pressed={cat === c.id}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${cat === c.id ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            {lang === "ar" ? c.ar : c.fr}
          </button>
        ))}
      </div>

      <p className="rounded-2xl border border-line bg-surface p-4 text-lg font-black">{lang === "ar" ? item.q.ar : item.q.fr}</p>

      <div className="grid grid-cols-1 gap-2">
        {item.options.map((_, i) => {
          const real = ord[i];
          const o = item.options[real];
          const state = shown === null ? "" : real === item.correct ? "border-green-600 bg-green-600/15 text-green-500" : i === shown ? "border-red-600 bg-red-600/15 text-red-500" : "opacity-50";
          return (
            <button key={i} onClick={() => pick(i)} aria-pressed={picked === i}
              className={`touch rounded-xl border border-line bg-surface px-4 py-3 text-start font-bold ${state}`}>
              {lang === "ar" ? o.ar : o.fr}
            </button>
          );
        })}
      </div>

      {shown === -1 && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">{lang === "ar" ? "انتهى الوقت!" : "Temps écoulé !"}</p>
      )}

      {shown !== null && (
        <>
          <p className="rounded-xl bg-sky-600/10 p-3 text-sm font-bold text-sky-500">{lang === "ar" ? item.why.ar : item.why.fr}</p>
          <button onClick={next} className="touch rounded-xl bg-blue-600 px-6 py-3 font-black text-white active:scale-[.98]">
            {lang === "ar" ? "التالي" : "Suivant"}
          </button>
        </>
      )}
    </div>
  );
}

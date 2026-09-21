"use client";
// Moteur d'arbre décisionnel : rend le nœud courant, journal horodaté, minuteries avec alerte sonore.
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import { beep } from "@/lib/audio";
import type { DecisionTree, TreeNode } from "@/data/trees";
import { AbbrText } from "@/components/AbbrTooltip";
import BackLink from "@/components/BackLink";
import { CheckCircle2, AlertTriangle, Info, RotateCcw, Timer, ChevronRight } from "lucide-react";

interface LogEntry {
  at: number;          // timestamp ms
  elapsed: number;     // s depuis le début de la session
  label: string;       // texte rendu dans la langue active
}

function fmtElapsed(s: number) {
  const m = Math.floor(s / 60), r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function fmtClock(ts: number) {
  return new Date(ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/** Minuterie persistante par nœud — continue pendant l'affichage, alarme à 0. */
function useCountdown(key: string, seconds: number | undefined) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const alarmed = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- machine à états : reset synchrone quand le nœud (key/seconds) change
    setRemaining(seconds ?? null);
    setDone(false);
    alarmed.current = false;
  }, [key, seconds]);

  const active = remaining !== null && remaining > 0;
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r === null) return null;
        if (r <= 1) {
          setDone(true);
          if (!alarmed.current) {
            alarmed.current = true;
            // alarme marquée : 4 bips montants
            [0, 250, 500, 750].forEach((ms, i) => setTimeout(() => beep(660 + i * 180, 0.18, "square", 0.2), ms));
          }
          return 0;
        }
        if (r === 11) beep(880, 0.15); // avertissement à 10 s
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  return { remaining, done, reset: () => { setRemaining(seconds ?? null); setDone(false); alarmed.current = false; } };
}

export default function TreeRunner({ tree }: { tree: DecisionTree }) {
  const { lang } = useApp();
  const [nodeId, setNodeId] = useState(tree.start);
  const [log, setLog] = useState<LogEntry[]>([]);
  // Le départ de session est écrit dans un effet (jamais lu pendant le rendu :
  // l'affichage T+ dérive de log[0].at + ticker `now` — rendu pur).
  const startRef = useRef<number>(0);
  const [now, setNow] = useState(0);
  useEffect(() => {
    startRef.current = Date.now();
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const node: TreeNode | undefined = tree.nodes[nodeId];
  const seconds = node && node.kind === "action" ? node.timerSec : undefined;
  const timer = useCountdown(nodeId, seconds);

  const push = (label: string) => {
    const at = Date.now();
    setLog((l) => [...l, { at, elapsed: Math.round((at - startRef.current) / 1000), label }]);
  };

  const go = (next: string, label: string) => {
    push(label);
    setNodeId(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pick = (l: { fr: string; ar: string }) => (lang === "ar" ? l.ar : l.fr);
  const q = (l: { fr: string; ar: string }) => pick(l);

  const reset = () => {
    setLog([]);
    setNodeId(tree.start);
    startRef.current = Date.now();
  };

  if (!node) return <p className="p-4">Nœud introuvable : {nodeId}</p>;

  const toneStyle: Record<string, string> = {
    ok: "border-sky-600 bg-sky-600/10",
    warn: "border-amber-500 bg-amber-500/10",
    info: "border-sky-600 bg-sky-600/10",
  };

  return (
    <div className="flex flex-col gap-5">
      <BackLink href="/arbres" />
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold">{q(tree.title)}</h1>
          <p className="mt-1 text-sm opacity-70">{q(tree.description)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={reset} aria-label="reset" title={lang === "ar" ? "إعادة البدء" : "Recommencer"}
            className="rounded-xl border border-line p-3 hover:bg-surface2">
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </header>

      <h1 className="text-xl font-bold">{q(tree.title)}</h1>

      {/* Nœud courant */}
      <div className={`rounded-2xl border-2 p-4 ${node.kind === "end" ? toneStyle[node.tone ?? "info"] : "border-blue-600 bg-surface"}`}>
        {node.kind === "decision" && (
          <>
            <h2 className="text-xl font-extrabold leading-snug">{q(node.question)}</h2>
            {node.note && <p className="mt-2 text-sm opacity-80">{q(node.note)}</p>}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button onClick={() => go(node.yes, `${q(node.question)} → ${lang === "ar" ? "نعم" : "OUI"}`)}
                className="touch rounded-xl bg-red-600 px-6 py-5 text-xl font-black text-white shadow-lg transition hover:bg-red-700">
                {lang === "ar" ? "نعم" : "OUI"}
              </button>
              <button onClick={() => go(node.no, `${q(node.question)} → ${lang === "ar" ? "لا" : "NON"}`)}
                className="touch rounded-xl border-2 border-line px-6 py-5 text-xl font-black transition hover:bg-surface2">
                {lang === "ar" ? "لا" : "NON"}
              </button>
            </div>
          </>
        )}

        {node.kind === "action" && (
          <>
            <h2 className="text-xl font-extrabold leading-snug text-blue-500">{q(node.title)}</h2>
            <ul className="mt-3 space-y-2">
              {node.steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-lg leading-relaxed">
                  <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-blue-500 rtl:rotate-180" aria-hidden />
                  <span><AbbrText>{q(s)}</AbbrText></span>
                </li>
              ))}
            </ul>

            {typeof node.timerSec === "number" && timer.remaining !== null && (
              <div className={`mt-4 rounded-xl p-4 text-center ${timer.done ? "animate-pulse bg-red-600 text-white" : "bg-surface2"}`}>
                <p className="flex items-center justify-center gap-2 text-sm font-semibold opacity-80">
                  <Timer className="h-4 w-4" aria-hidden />
                  {node.timerLabel ? q(node.timerLabel) : "Timer"}
                </p>
                <p className="mt-1 font-mono text-5xl font-black tabular-nums" aria-live="polite">
                  {timer.done ? "0:00" : fmtElapsed(timer.remaining)}
                </p>
                <div className="mt-2 flex justify-center gap-2">
                  <button onClick={timer.reset} className="rounded-lg border border-line px-3 py-1 text-sm font-bold hover:bg-surface">
                    {lang === "ar" ? "إعادة المؤقت" : "Relancer"}
                  </button>
                </div>
              </div>
            )}

            <button onClick={() => go(node.next, `${q(node.title)} ${lang === "ar" ? "— تم" : "— fait"}`)}
              className="touch mt-4 w-full rounded-xl bg-blue-600 py-4 text-lg font-extrabold text-white transition hover:bg-blue-700">
              {lang === "ar" ? "تم — التالي" : timer.done ? "Continuer →" : "Fait / passé →"}
            </button>
          </>
        )}

        {node.kind === "end" && (
          <>
            <h2 className="flex items-center gap-2 text-xl font-extrabold">
              {node.tone === "warn" ? <AlertTriangle className="h-6 w-6 text-amber-500" aria-hidden />
                : node.tone === "ok" ? <CheckCircle2 className="h-6 w-6 text-sky-500" aria-hidden />
                : <Info className="h-6 w-6 text-sky-500" aria-hidden />}
              {q(node.title)}
            </h2>
            {node.steps && (
              <ul className="mt-3 space-y-2">
                {node.steps.map((s, i) => (
                  <li key={i} className="flex gap-2 text-lg leading-relaxed">
                    <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-blue-500 rtl:rotate-180" aria-hidden />
                    <span><AbbrText>{q(s)}</AbbrText></span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* Journal horodaté */}
      <section className="rounded-2xl border border-line bg-surface p-4">
        <h3 className="flex items-center justify-between font-bold">
          <T fr="Journal de la séance" ar="سجل الجلسة" />
          {log.length > 0 && (
            <span className="text-sm font-normal opacity-60 tabular-nums">
              T+{fmtElapsed(Math.max(0, Math.round((now - log[0].at) / 1000)))}
            </span>
          )}
        </h3>
        {log.length === 0 ? (
          <p className="mt-2 text-sm opacity-50">
            <T fr="Les décisions prises s'afficheront ici avec leur horodatage (imprimables)." ar="ستظهر القرارات هنا مع توقيتها (قابلة للطباعة)." />
          </p>
        ) : (
          <ol className="mt-2 space-y-1.5">
            {log.map((e, i) => (
              <li key={i} className="flex gap-3 border-b border-line pb-1.5 text-sm last:border-0">
                <span className="shrink-0 font-mono font-bold text-blue-500">T+{fmtElapsed(e.elapsed)}</span>
                <span className="shrink-0 opacity-50">{fmtClock(e.at)}</span>
                <span className="min-w-0">{e.label}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <footer className="text-xs opacity-60">
        <p>{lang === "ar" ? "المراجع:" : "Sources :"}{" "}
          {tree.sources.map((s, i) => (
            <span key={i}>{s.label} — {s.url}{i < tree.sources.length - 1 ? " · " : ""}</span>
          ))}
        </p>
        <p className="mt-1">{lang === "ar" ? "آخر مراجعة:" : "Dernière relecture :"} {tree.lastReviewed} — <T fr="Outil d'aide, ne remplace pas le jugement clinique." ar="أداة مساعدة، لا تُغني عن الحكم السريري." /></p>
      </footer>
    </div>
  );
}

"use client";
// Chronomètre RCP : cycles de 2 min, métronome 110/min, rappel adrénaline, alarme sonore.
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import { cycleAlarm, metronomeTick, unlockAudio } from "@/lib/audio";
import { useWakeLock } from "@/lib/hooks";
import { trackEvent } from "@/lib/analytics";
import { Play, Square, RotateCcw, Music2, Syringe } from "lucide-react";

const CYCLE_MS = 120_000; // 2 minutes
const TICK_MS = 60_000 / 110; // métronome 110/min
const nowMs = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CprTimerPage() {
  const { t } = useApp();
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [metronome, setMetronome] = useState(false);
  const startRef = useRef(0);
  const accRef = useRef(0);
  const completedCyclesRef = useRef(0);
  const runIdRef = useRef(0);
  useRegisterRecent("calculateur:chrono-rcp");
  useWakeLock(running);

  const publishElapsed = useCallback((totalMs: number) => {
    const completedCycles = Math.floor(totalMs / CYCLE_MS);
    if (completedCycles > completedCyclesRef.current) {
      // Si l'onglet a été suspendu plusieurs cycles, on signale le rattrapage une fois.
      completedCyclesRef.current = completedCycles;
      cycleAlarm();
    }
    setElapsedMs(totalMs);
  }, []);

  // Horloge monotone : les retards d'intervalle / changements d'heure système ne décalent pas le chrono.
  useEffect(() => {
    if (!running) return;
    const runId = runIdRef.current;
    const id = window.setInterval(() => {
      if (runId !== runIdRef.current) return; // ignore un tick déjà en file après pause/réinitialisation
      publishElapsed(accRef.current + Math.max(0, nowMs() - startRef.current));
    }, 200);
    return () => window.clearInterval(id);
  }, [running, publishElapsed]);

  // Métronome — l'horloge reste fondée sur le temps écoulé, pas sur le nombre de ticks.
  useEffect(() => {
    if (!running || !metronome) return;
    metronomeTick();
    const id = window.setInterval(metronomeTick, TICK_MS);
    return () => window.clearInterval(id);
  }, [running, metronome]);

  const sec = Math.floor(elapsedMs / 1000);
  const cycle = Math.floor(elapsedMs / CYCLE_MS) + 1;
  const inCycle = elapsedMs % CYCLE_MS;
  const remaining = Math.ceil((CYCLE_MS - inCycle) / 1000);
  const progress = (inCycle / CYCLE_MS) * 100;

  const start = () => {
    unlockAudio(); // déverrouille l'API audio dans le geste utilisateur, avant la première alarme
    startRef.current = nowMs();
    runIdRef.current += 1;
    setRunning(true);
    trackEvent("cpr_timer", { action: "start" });
  };

  const stop = () => {
    const total = accRef.current + Math.max(0, nowMs() - startRef.current);
    accRef.current = total;
    runIdRef.current += 1;
    publishElapsed(total);
    setRunning(false);
    trackEvent("cpr_timer", { action: "pause" });
  };

  const reset = () => {
    runIdRef.current += 1; // invalide tout tick qui aurait été planifié avant le clic
    accRef.current = 0;
    startRef.current = 0;
    completedCyclesRef.current = 0;
    setRunning(false);
    setElapsedMs(0);
    trackEvent("cpr_timer", { action: "reset" });
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-stretch gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">{t("rcp.title")}</h1>
      </header>

      {/* Affichage principal */}
      <div className="card rounded-3xl border border-line bg-surface p-6 text-center">
        <p role="timer" aria-live="off" aria-label={t("rcp.title")} className={`text-7xl font-black tabular-nums ${running ? "cpr-beat text-red-500" : ""}`}>{fmt(sec)}</p>
        <p className="mt-2 text-lg font-bold opacity-80" aria-live="off">
          {t("rcp.cycle")} <span className="tabular-nums">{cycle}</span> · {t("rcp.next")} <span className="tabular-nums text-blue-500">{remaining}s</span>
        </p>
        {/* Barre de progression du cycle */}
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-surface2" role="progressbar" aria-label={t("rcp.cycle")} aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-valuetext={`${remaining}s`}>
          <div className="h-full bg-blue-600 transition-[width] duration-200" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {!running ? (
            <button
              onClick={start}
              className="touch gap-2 rounded-2xl bg-red-600 py-4 text-xl font-black text-white hover:bg-red-500 active:scale-95"
            >
              <Play className="h-7 w-7" aria-hidden /> {t("rcp.start")}
            </button>
          ) : (
            <button
              onClick={stop}
              className="touch gap-2 rounded-2xl bg-slate-600 py-4 text-xl font-black text-white hover:bg-slate-500 active:scale-95"
            >
              <Square className="h-7 w-7" aria-hidden /> {t("rcp.stop")}
            </button>
          )}
          <button
            onClick={reset}
            className="touch gap-2 rounded-2xl border border-line py-4 text-xl font-bold hover:bg-surface2"
          >
            <RotateCcw className="h-6 w-6" aria-hidden /> {t("common.reset")}
          </button>
        </div>

        <button
          onClick={() => {
            if (!metronome) unlockAudio();
            setMetronome((m) => !m);
          }}
          aria-pressed={metronome}
          className={`touch mt-3 w-full gap-2 rounded-2xl border py-3 font-bold ${metronome ? "border-blue-600 bg-blue-600/15 text-blue-400" : "border-line hover:bg-surface2"}`}
        >
          <Music2 className="h-5 w-5" aria-hidden /> {t("rcp.metronome")}
        </button>
      </div>

      {/* Rappel adrénaline */}
      <div className="card flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 font-semibold text-red-400">
        <Syringe className="h-6 w-6 shrink-0" aria-hidden />
        {t("rcp.epi")}
      </div>
      <p className="text-center text-xs leading-relaxed opacity-65">{t("rcp.keepScreenOpen")}</p>
    </div>
  );
}

"use client";
// Chronomètre RCP : cycles de 2 min, métronome 110/min, rappel adrénaline, alarme sonore.
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import { cycleAlarm, metronomeTick } from "@/lib/audio";
import { trackEvent } from "@/lib/analytics";
import { Play, Square, RotateCcw, Music2, Syringe } from "lucide-react";

const CYCLE_MS = 120_000; // 2 minutes
const TICK_MS = 60_000 / 110; // métronome 110/min

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
  const lastCycleRef = useRef(1);
  useRegisterRecent("calculateur:chrono-rcp");

  // Horloge principale
  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    const id = setInterval(() => {
      const total = accRef.current + (Date.now() - startRef.current);
      setElapsedMs(total);
      const cycle = Math.floor(total / CYCLE_MS) + 1;
      if (cycle !== lastCycleRef.current) {
        lastCycleRef.current = cycle;
        cycleAlarm();
      }
    }, 200);
    return () => {
      clearInterval(id);
      accRef.current += Date.now() - startRef.current;
    };
  }, [running]);

  // Métronome
  useEffect(() => {
    if (!running || !metronome) return;
    const id = setInterval(metronomeTick, TICK_MS);
    return () => clearInterval(id);
  }, [running, metronome]);

  const sec = Math.floor(elapsedMs / 1000);
  const cycle = Math.floor(elapsedMs / CYCLE_MS) + 1;
  const inCycle = elapsedMs % CYCLE_MS;
  const remaining = Math.ceil((CYCLE_MS - inCycle) / 1000);
  const progress = (inCycle / CYCLE_MS) * 100;

  const reset = () => {
    setRunning(false);
    accRef.current = 0;
    setElapsedMs(0);
    lastCycleRef.current = 1;
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-stretch gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">{t("rcp.title")}</h1>
        <PrintButton />
      </header>

      {/* Affichage principal */}
      <div className="card rounded-3xl border border-line bg-surface p-6 text-center">
        <p className={`text-7xl font-black tabular-nums ${running ? "cpr-beat text-red-500" : ""}`}>{fmt(sec)}</p>
        <p className="mt-2 text-lg font-bold opacity-80">
          {t("rcp.cycle")} <span className="tabular-nums">{cycle}</span> · {t("rcp.next")} <span className="tabular-nums text-teal-500">{remaining}s</span>
        </p>
        {/* Barre de progression du cycle */}
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-surface2" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full bg-teal-600 transition-[width] duration-200" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {!running ? (
            <button
              onClick={() => { setRunning(true); trackEvent("cpr_timer", { action: "start" }); }}
              className="touch gap-2 rounded-2xl bg-red-600 py-4 text-xl font-black text-white hover:bg-red-500 active:scale-95"
            >
              <Play className="h-7 w-7" aria-hidden /> {t("rcp.start")}
            </button>
          ) : (
            <button
              onClick={() => setRunning(false)}
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
          onClick={() => setMetronome((m) => !m)}
          aria-pressed={metronome}
          className={`touch mt-3 w-full gap-2 rounded-2xl border py-3 font-bold ${metronome ? "border-teal-600 bg-teal-600/15 text-teal-400" : "border-line hover:bg-surface2"}`}
        >
          <Music2 className="h-5 w-5" aria-hidden /> {t("rcp.metronome")}
        </button>
      </div>

      {/* Rappel adrénaline */}
      <div className="card flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 font-semibold text-red-400">
        <Syringe className="h-6 w-6 shrink-0" aria-hidden />
        {t("rcp.epi")}
      </div>
    </div>
  );
}

"use client";
// Paramètres : langue, thème, taille, son, installation PWA, analytics, réinitialisation, IA (phase 3).
import { useEffect, useState } from "react";
import { useApp } from "@/components/Providers";
import { KEYS, readJSON, writeJSON } from "@/lib/storage";
import { DISCLAIMER_EVENT } from "@/components/DisclaimerGate";
import { languagesNice } from "@/lib/display";
import { Moon, Sun, Volume2, VolumeX, Download, Trash2 } from "lucide-react";
import AiSection from "@/components/ai/AiSection";

interface BIPEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function SettingsPage() {
  const { t, prefs, setPref } = useApp();
  const [installEvt, setInstallEvt] = useState<BIPEvent | null>(null);
  const [optOut, setOptOut] = useState(false);
  const [resetMsg, setResetMsg] = useState(false);

  useEffect(() => {
    setOptOut(readJSON(KEYS.analyticsOptOut, false));
    const onBip = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="card flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
      <span className="font-bold">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="mb-1 text-2xl font-extrabold">{t("settings.title")}</h1>

      <Row label={t("settings.language")}>
        {(Object.keys(languagesNice) as Array<keyof typeof languagesNice>).map((l) => (
          <button key={l} onClick={() => setPref("lang", l)} aria-pressed={prefs.lang === l}
            className={`touch rounded-xl border px-5 py-2 font-bold ${prefs.lang === l ? "border-teal-600 bg-teal-600 text-white" : "border-line hover:bg-surface2"}`}>
            {languagesNice[l]}
          </button>
        ))}
      </Row>

      <Row label={t("settings.theme")}>
        <button onClick={() => setPref("theme", "dark")} aria-pressed={prefs.theme === "dark"}
          className={`touch gap-2 rounded-xl border px-5 py-2 font-bold ${prefs.theme === "dark" ? "border-teal-600 bg-teal-600 text-white" : "border-line hover:bg-surface2"}`}>
          <Moon className="h-4 w-4" aria-hidden /> {t("settings.dark")}
        </button>
        <button onClick={() => setPref("theme", "light")} aria-pressed={prefs.theme === "light"}
          className={`touch gap-2 rounded-xl border px-5 py-2 font-bold ${prefs.theme === "light" ? "border-teal-600 bg-teal-600 text-white" : "border-line hover:bg-surface2"}`}>
          <Sun className="h-4 w-4" aria-hidden /> {t("settings.light")}
        </button>
      </Row>

      <Row label={t("settings.fontSize")}>
        {([16, 18, 20] as const).map((s) => (
          <button key={s} onClick={() => setPref("fontSize", s)} aria-pressed={prefs.fontSize === s}
            className={`touch rounded-xl border px-4 py-2 font-bold tabular-nums ${prefs.fontSize === s ? "border-teal-600 bg-teal-600 text-white" : "border-line hover:bg-surface2"}`}
            style={{ fontSize: s * 0.8 }}>
            A{s}
          </button>
        ))}
      </Row>

      <Row label={t("settings.mute")}>
        <button onClick={() => setPref("muted", !prefs.muted)} aria-pressed={!prefs.muted}
          className={`touch gap-2 rounded-xl border px-5 py-2 font-bold ${!prefs.muted ? "border-teal-600 bg-teal-600 text-white" : "border-line hover:bg-surface2"}`}>
          {prefs.muted ? <VolumeX className="h-5 w-5" aria-hidden /> : <Volume2 className="h-5 w-5" aria-hidden />}
          {prefs.muted ? t("common.mute.on") : t("common.mute.off")}
        </button>
      </Row>

      <Row label={t("settings.install")}>
        <button
          disabled={!installEvt}
          onClick={() => installEvt?.prompt()}
          className="touch gap-2 rounded-xl border border-line px-5 py-2 font-bold hover:bg-surface2 disabled:opacity-40"
        >
          <Download className="h-5 w-5" aria-hidden />
          {installEvt ? "Install" : "PWA"}
        </button>
      </Row>

      <Row label={t("settings.analytics")}>
        <button
          onClick={() => { const next = !optOut; setOptOut(next); writeJSON(KEYS.analyticsOptOut, next); }}
          aria-pressed={!optOut}
          className={`touch rounded-xl border px-5 py-2 font-bold ${!optOut ? "border-teal-600 bg-teal-600 text-white" : "border-line hover:bg-surface2"}`}
        >
          {!optOut ? "ON" : "OFF"}
        </button>
      </Row>

      <AiSection />

      <button
        onClick={() => window.dispatchEvent(new Event(DISCLAIMER_EVENT))}
        className="touch rounded-xl border border-amber-500/50 px-5 py-3 font-bold text-amber-500 hover:bg-amber-500/10"
      >
        {t("settings.disclaimer")}
      </button>

      <button
        onClick={() => {
          Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
          Object.keys(localStorage).filter((k) => k.startsWith("eutn:")).forEach((k) => localStorage.removeItem(k));
          setResetMsg(true);
          setTimeout(() => window.location.reload(), 800);
        }}
        className="touch gap-2 rounded-xl border border-red-500/50 px-5 py-3 font-bold text-red-400 hover:bg-red-500/10"
      >
        <Trash2 className="h-5 w-5" aria-hidden /> {resetMsg ? t("settings.reset.done") : t("settings.reset")}
      </button>

      <p className="text-sm opacity-60">{t("settings.shortcuts")}</p>
    </div>
  );
}

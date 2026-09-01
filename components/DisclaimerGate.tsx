"use client";
// Avertissement médical obligatoire au 1er accès (bloquant jusqu'à acceptation).
import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { useApp } from "./Providers";
import { KEYS, readJSON, writeJSON, removeKey } from "@/lib/storage";

export const DISCLAIMER_EVENT = "eutn:show-disclaimer"; // les paramètres peuvent le rouvrir

export default function DisclaimerGate() {
  const { t, hydrated } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    setVisible(!readJSON(KEYS.disclaimer, false));
    const reopen = () => {
      removeKey(KEYS.disclaimer);
      setVisible(true);
    };
    window.addEventListener(DISCLAIMER_EVENT, reopen);
    return () => window.removeEventListener(DISCLAIMER_EVENT, reopen);
  }, [hydrated]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4" role="alertdialog" aria-modal="true" aria-label={t("disclaimer.title")}>
      <div className="w-full max-w-lg rounded-2xl border border-amber-500/50 bg-surface p-6 shadow-2xl">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-amber-500">
          <ShieldAlert className="h-6 w-6" aria-hidden />
          {t("disclaimer.title")}
        </h2>
        <p className="leading-relaxed">{t("disclaimer.body")}</p>
        <button
          onClick={() => {
            writeJSON(KEYS.disclaimer, true);
            setVisible(false);
          }}
          className="mt-5 w-full rounded-xl bg-teal-600 px-4 py-3 text-lg font-bold text-white hover:bg-teal-500"
          autoFocus
        >
          {t("disclaimer.accept")}
        </button>
      </div>
    </div>
  );
}

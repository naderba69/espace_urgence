"use client";
// Mode urgence : superposition plein écran, gros boutons (usage stress/mouvement).
import Link from "next/link";
import { useApp } from "./Providers";
import { Timer, Syringe, Brain, HeartPulse, AlertTriangle, LogOut } from "lucide-react";

const ITEMS = [
  { href: "/calculateurs/chrono-rcp", fr: "Chronomètre RCP", ar: "مؤقّت الإنعاش", Icon: Timer, color: "bg-red-600" },
  { href: "/protocoles/acr-adulte", fr: "ACR adulte", ar: "توقف قلب الكبير", Icon: HeartPulse, color: "bg-red-700" },
  { href: "/protocoles/anaphylaxie", fr: "Anaphylaxie", ar: "الحساسية المفرطة", Icon: AlertTriangle, color: "bg-orange-600" },
  { href: "/calculateurs/dose-poids", fr: "Dose selon poids", ar: "جرعة حسب الوزن", Icon: Syringe, color: "bg-teal-600" },
  { href: "/calculateurs/gcs", fr: "Glasgow", ar: "غلاسكو", Icon: Brain, color: "bg-sky-700" },
  { href: "/protocoles/polytraumatisme", fr: "Polytraumatisme", ar: "متعدد الإصابات", Icon: AlertTriangle, color: "bg-amber-700" },
];

export default function EmergencyMode() {
  const { emergencyOpen, setEmergencyOpen, lang, t } = useApp();
  if (!emergencyOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("emergency.title")}
      className="fixed inset-0 z-50 w-full max-w-none bg-[#0b1220] p-4 sm:p-8 overflow-y-auto"
    >
      <div className="mx-auto max-w-3xl flex flex-col gap-6 min-h-full">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-red-400">
            {t("emergency.title")}
          </h2>
          <button
            onClick={() => setEmergencyOpen(false)}
            className="touch gap-2 rounded-xl bg-slate-700 px-5 py-3 text-lg font-bold text-white hover:bg-slate-600"
            autoFocus
          >
            <LogOut className="h-6 w-6" aria-hidden /> {t("emergency.exit")}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {ITEMS.map(({ href, fr, ar, Icon, color }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setEmergencyOpen(false)}
              className={`${color} flex items-center gap-4 rounded-2xl p-6 text-white shadow-lg active:scale-[0.98] transition min-h-[96px]`}
            >
              <Icon className="h-12 w-12 shrink-0" aria-hidden />
              <span className="text-xl sm:text-2xl font-bold leading-snug">
                {lang === "ar" ? ar : fr}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

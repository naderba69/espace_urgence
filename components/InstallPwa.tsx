"use client";
// Invite d'installation PWA : Android/Chrome (beforeinstallprompt) + instructions iOS Safari.
// 3 variantes : "banner" (carte en page d'accueil), "icon" (en-tête, desktop), "drawer" (menu ☰ — toujours visible sur mobile).
import { useEffect, useState } from "react";
import { useApp } from "./Providers";
import { readJSON, writeJSON } from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";
import { Download, Share, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

export default function InstallPwa({ variant }: { variant: "banner" | "icon" | "drawer" }) {
  const { lang } = useApp();
  const [promptEvt, setPromptEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(true); // caché par défaut (évite clignotement)
  const [dismissed, setDismissed] = useState(true);
  const [isIos, setIsIos] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  const isAr = lang === "ar";
  const title = isAr ? "ثبّت التطبيق" : "Installer l'application";

  useEffect(() => {
    const dismissed = readJSON<boolean>("eutn:pwa-dismissed", false);
    setDismissed(dismissed);
    const standalone = window.matchMedia?.("(display-mode: standalone)")?.matches
      || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) { setInstalled(true); return; }
    setInstalled(false);

    const ua = window.navigator.userAgent;
    setIsIos(/iPad|iPhone|iPod/.test(ua));

    const onPrompt = (e: BeforeInstallPromptEvent) => { e.preventDefault(); setPromptEvt(e); };
    const onInstalled = () => { setInstalled(true); writeJSON("eutn:pwa-dismissed", true); trackEvent("pwa_install"); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (promptEvt) {
      await promptEvt.prompt();
      const { outcome } = await promptEvt.userChoice;
      trackEvent("pwa_install_prompt", { outcome });
      if (outcome === "accepted") { setInstalled(true); return; }
      if (isIos) setShowIosHelp(true);
    } else {
      // iOS Safari ou navigateur sans invite native : guider pas à pas
      setShowIosHelp(true);
    }
  };

  const dismiss = () => {
    setDismissed(true);
    writeJSON("eutn:pwa-dismissed", true);
  };

  if (installed) return null;

  // ── Aide pas-à-pas (iOS / navigateurs sans beforeinstallprompt) ──────────
  const helpSheet = showIosHelp && (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center" role="alertdialog" aria-modal="true">
      <div className="card w-full max-w-sm rounded-2xl border border-line bg-surface p-5">
        <p className="mb-3 flex items-center gap-2 text-lg font-black">
          <Share className="h-5 w-5 text-teal-500" aria-hidden />
          {isIos
            ? (isAr ? "التثبيت على iPhone" : "Installation sur iPhone")
            : (isAr ? "التثبيت على هذا الجهاز" : "Installer sur cet appareil")}
        </p>
        {isIos ? (
          <ol className="ms-5 list-decimal space-y-2 text-sm leading-relaxed">
            <li>{isAr ? "افتح الموقع في متصفح Safari" : "Ouvrez le site dans Safari"}</li>
            <li>
              {isAr ? "اضغط زر " : "Touchez le bouton "}
              <b>{isAr ? "مشاركة" : "Partager"}</b> (<Share className="inline h-4 w-4 align-middle" aria-hidden />)
            </li>
            <li>{isAr ? "اختر « إضافة إلى الشاشة الرئيسية »" : "Choisissez « Sur l'écran d'accueil »"}</li>
            <li>{isAr ? "اضغط « إضافة » — ستظهر الأيقونة مباشرة" : "Touchez « Ajouter » — l'icône apparaît"}</li>
          </ol>
        ) : (
          <p className="text-sm leading-relaxed">
            {isAr
              ? "افتح قائمة المتصفح ⋮ ثم اختر « تثبيت التطبيق » أو « إضافة إلى الشاشة الرئيسية »."
              : "Ouvrez le menu du navigateur ⋮ puis « Installer l'application » ou « Ajouter à l'écran d'accueil »."}
          </p>
        )}
        <button
          onClick={() => setShowIosHelp(false)}
          className="touch mt-4 w-full rounded-xl bg-teal-600 py-2.5 font-bold text-white"
        >
          {isAr ? "فهمت" : "J'ai compris"}
        </button>
      </div>
    </div>
  );

  // ── Icône d'en-tête (tablette/desktop, quand l'invite native existe) ──────
  if (variant === "icon") {
    if (!promptEvt) return null;
    return (
      <button
        onClick={() => void install()}
        aria-label={title}
        title={title}
        className="touch hidden rounded-xl border border-line bg-surface2 p-2.5 hover:bg-surface sm:flex"
      >
        <Download className="h-5 w-5 text-teal-500" aria-hidden />
      </button>
    );
  }

  // ── Entrée du menu ☰ — toujours proposée sur non-installés (même si bannière ignorée)
  if (variant === "drawer") {
    // Toujours proposé dans le menu tant que l'app n'est pas installée :
    // si l'invite native est absente, le clic ouvre la feuille d'aide (menu ⋮ / iOS).
    return (
      <>
        <button
          onClick={() => void install()}
          className="touch gap-3 rounded-xl border border-teal-600/50 bg-teal-600/10 px-4 py-3 font-semibold text-teal-500 transition hover:bg-teal-600/20"
        >
          <Download className="h-5 w-5" aria-hidden />
          {title}
        </button>
        {helpSheet}
      </>
    );
  }

  // ── Bannière (page d'accueil) ────────────────────────────────────────────
  if (dismissed) return null;

  return (
    <>
      <div className="card relative flex items-center gap-3 rounded-2xl border border-teal-600/60 bg-gradient-to-r from-teal-600/15 to-transparent p-4">
        <Smartphone className="h-8 w-8 shrink-0 text-teal-500" aria-hidden />
        <div className="flex-1">
          <p className="font-extrabold">
            {isAr ? "ثبّت التطبيق على هاتفك" : "Installer sur votre téléphone"}
          </p>
          <p className="text-sm opacity-70">
            {isAr ? "يعمل بدون إنترنت — أيقونة على الشاشة الرئيسية، فتح فوري." : "Fonctionne hors-ligne — icône sur l'écran d'accueil, ouverture instantanée."}
          </p>
        </div>
        <button
          onClick={() => void install()}
          className="touch flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 font-black text-white shadow-lg hover:bg-teal-500"
        >
          <Download className="h-4 w-4" aria-hidden />
          {isAr ? "تثبيت" : "Installer"}
        </button>
        <button
          onClick={dismiss}
          aria-label={isAr ? "تجاهل" : "Ignorer"}
          className="touch absolute -top-2 end-2 rounded-full bg-surface2 p-1 opacity-60 hover:opacity-100"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {helpSheet}
    </>
  );
}

"use client";
import { useApp } from "./Providers";
import { AlertTriangle } from "lucide-react";

export default function Footer() {
  const { t } = useApp();
  return (
    <footer className="no-print mt-12 border-t border-line bg-surface2 px-4 py-6 text-center text-sm opacity-80">
      <p className="mx-auto flex max-w-xl items-center justify-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
        {t("footer.disclaimer")}
      </p>
    </footer>
  );
}

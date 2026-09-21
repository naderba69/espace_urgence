"use client";
// Fil d'Ariane « retour » : repère de navigation sur les pages de détail (pro, bilingue, RTL-safe).
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useApp } from "./Providers";

export default function BackLink({ href, label }: { href: string; label?: string }) {
  const { t } = useApp();
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-bold opacity-80 transition hover:border-blue-600/50 hover:bg-surface2 hover:text-blue-500 hover:opacity-100"
    >
      <ArrowLeft className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden />
      {label ?? t("common.back")}
    </Link>
  );
}

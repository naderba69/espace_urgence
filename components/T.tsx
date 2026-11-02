"use client";
// Affiche un contenu bilingue {fr, ar} selon la langue active.
import type { ReactNode } from "react";
import { useApp } from "./Providers";
import type { Localized } from "@/data/types";

export default function T({ fr, ar, langOverride }: Localized & { children?: ReactNode; langOverride?: "fr" | "ar" }): ReactNode {
  const { lang } = useApp();
  const activeLang = langOverride ?? lang;
  return <>{activeLang === "ar" ? ar : fr}</>;
}

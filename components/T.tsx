"use client";
// Affiche un contenu bilingue {fr, ar} selon la langue active.
import type { ReactNode } from "react";
import { useApp } from "./Providers";
import type { Localized } from "@/data/types";

export default function T({ fr, ar }: Localized & { children?: ReactNode }): ReactNode {
  const { lang } = useApp();
  return <>{lang === "ar" ? ar : fr}</>;
}

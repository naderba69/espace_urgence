"use client";
import Link from "next/link";
import { Syringe, Brain, Droplets, Timer, Flame, Gauge, AlertTriangle, Baby, Scale, Wind, Stethoscope, Activity, ClipboardList, Calculator, type LucideIcon } from "lucide-react";
import { useApp } from "@/components/Providers";
import { FavoriteButton } from "@/components/Chrome";
import type { Localized, ReviewMeta } from "@/data/types";

const ICONS = { Syringe, Brain, Droplets, Timer, Flame, Gauge, AlertTriangle, Baby, Scale, Wind, Stethoscope, Activity, ClipboardList } satisfies Record<string, LucideIcon>;
export type LucideName = keyof typeof ICONS;

export default function CalculatorCard({
  id, href, title, description, icon, meta,
}: { id: string; href: string; title: Localized; description: Localized; icon: LucideName; meta?: ReviewMeta }) {
  const { lang, t } = useApp();
  const Icon: LucideIcon = ICONS[icon] ?? Calculator;
  return (
    <div className="card flex h-full items-start justify-between gap-2 rounded-2xl border border-line bg-surface p-4 hover:border-teal-600 transition">
      <Link href={href} className="min-w-0 flex-1">
        <span className="mb-3 inline-flex rounded-xl bg-teal-600/15 p-3 text-teal-500">
          <Icon className="h-7 w-7" aria-hidden />
        </span>
        <p className="font-bold">{lang === "ar" ? title.ar : title.fr}</p>
        <p className="mt-1 text-sm opacity-70">{lang === "ar" ? description.ar : description.fr}</p>
        {meta && (
          <p className="mt-2 text-[11px] leading-snug opacity-50">
            {t("common.sources")} : {meta.sources.join(" · ")} — {t("common.lastReviewed")} {meta.lastReviewed}
          </p>
        )}
      </Link>
      <FavoriteButton itemKey={`calculateur:${id}`} />
    </div>
  );
}

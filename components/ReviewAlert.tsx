"use client";
// v3.2 — تنبيه مبكر عند اقتراب استحقاق المراجعة (≥ 11 شهراً) مع رابط للوحة.
//
// v17.0 — les dates de revue vivent dans lib/review-data.ts (chunk séparé, importé
// dynamiquement pendant l'inactivité du navigateur) : l'alerte n'alourdit plus le
// premier rendu de l'accueil (~173 Ko gzip de données médicales en moins).
import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { reviewDueCount } from "@/lib/calc";
import T from "@/components/T";

export default function ReviewAlert({ rows }: { rows?: string[] }) {
  const [lazyCount, setLazyCount] = useState<number | null>(null);

  useEffect(() => {
    if (rows) return; // comptage fourni : aucun chargement
    let alive = true;
    const load = () => {
      import("@/lib/review-data")
        .then((m) => alive && setLazyCount(m.computeReviewDue()))
        .catch(() => undefined);
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number; cancelIdleCallback?: (h: number) => void };
    if (typeof w.requestIdleCallback === "function") {
      const h = w.requestIdleCallback(load);
      return () => { alive = false; w.cancelIdleCallback?.(h); };
    }
    const t = window.setTimeout(load, 400);
    return () => { alive = false; window.clearTimeout(t); };
  }, [rows]);

  const n = rows ? reviewDueCount(rows, new Date()) : (lazyCount ?? 0);
  if (n === 0) return null;
  const msg = { fr: `${n} contenu(s) approchent de l'échéance de revue — voir le tableau.`, ar: `${n} محتوى يقترب من استحقاق المراجعة — راجع اللوحة.` };
  return (
    <Link href="/revision" className="flex items-center gap-2 rounded-xl bg-amber-500/15 p-3 font-bold text-amber-500 hover:bg-amber-500/25">
      <CalendarClock className="h-5 w-5 shrink-0" aria-hidden />
      <T fr={msg.fr} ar={msg.ar} />
    </Link>
  );
}

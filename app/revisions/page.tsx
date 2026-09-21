"use client";
// v4.0 — مراجعاتي الشخصية: تتبع محلي (على الجهاز فقط) لآخر مراجعة ذاتية لكل بطاقة، واقتراح المستحق.
import { useEffect, useState } from "react";
import Link from "next/link";
import { readJSON, writeJSON } from "@/lib/storage";
import { loadRefIndex } from "@/lib/ref-index";
import { daysSince } from "@/lib/calc";
import ScrollOnce from "@/components/ui/ScrollOnce";
import { useApp } from "@/components/Providers";
import PageHeader from "@/components/ui/PageHeader";
import { History } from "lucide-react";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";

const KEY = "eutn:reviews-v1";
const DUE_DAYS = 30;

interface Row { kind: "protocol" | "med" | "calc"; id: string; title: { fr: string; ar: string }; href: string }

// v17.2 — lignes construites depuis le fichier de références (chargé au montage) :
// plus de téléchargement des bases complètes pour lister des titres.
const KIND_OF: Record<string, "protocol" | "med" | "calc"> = {
  protocole: "protocol",
  medicament: "med",
  calculateur: "calc",
};

export default function RevisionsPage() {
  useRegisterRecent("revisions");
  const { lang } = useApp();
  const [reviews, setReviews] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setReviews(readJSON<Record<string, string>>(KEY, {})), 0);
    return () => clearTimeout(t);
  }, []);

  // v17.2 — les lignes viennent du fichier de références (14 Ko gzip) : la page ne
  // télécharge plus les trois bases complètes pour afficher des titres.
  useEffect(() => {
    let alive = true;
    loadRefIndex()
      .then((m) => {
        if (!alive) return;
        setRows(
          [...m.values()]
            .filter((r) => r.type in KIND_OF)
            .map((r) => ({
              kind: KIND_OF[r.type],
              id: r.key.split(":")[1] ?? r.key,
              title: r.title,
              href: r.href.split("#")[0],
            }))
        );
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const now = new Date();
  const due = rows
    .map((r) => {
      const last = reviews[`${r.kind}:${r.id}`];
      const days = last ? daysSince(last, now) : null;
      return { ...r, last, days };
    })
    .filter((r) => r.days === null || r.days >= DUE_DAYS)
    .sort((a, b) => (b.days ?? 99999) - (a.days ?? 99999));

  const mark = (r: Row) => {
    const next = { ...reviews, [`${r.kind}:${r.id}`]: new Date().toISOString().slice(0, 10) };
    setReviews(next);
    writeJSON(KEY, next);
  };

  const KIND = { protocol: <T fr="Protocole" ar="بروتوكول" />, med: <T fr="Médicament" ar="دواء" />, calc: <T fr="Calculateur" ar="حاسبة" /> } as const;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader icon={<History className="h-6 w-6" />} title={<T fr="Mes révisions personnelles" ar="مراجعاتي الشخصية" />} count={due.length} />

      <p className={`rounded-xl p-3 font-black ${due.length ? "bg-amber-500/15 text-amber-500" : "bg-blue-600/15 text-blue-500"}`}>
        {due.length
          ? <T fr={`${due.length} carte(s) à réviser (jamais revue ou ≥ ${DUE_DAYS} j).`} ar={`${due.length} بطاقة للمراجعة (لم تُراجع قط أو ≥ ${DUE_DAYS} يوماً).`} />
          : <T fr="Rien de dû aujourd'hui — bon rythme !" ar="لا شيء مستحق اليوم — وتيرة ممتازة!" />}
      </p>

      <ul className="space-y-2">
        {due.slice(0, 15).map((r) => (
          <li key={`${r.kind}:${r.id}`} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3 py-2">
            <span className="min-w-0">
              <ScrollOnce className="font-bold">{lang === "ar" ? r.title.ar : r.title.fr}</ScrollOnce>
              <span className="text-xs opacity-60">
                {KIND[r.kind]} · {r.last ? <T fr={`revue il y a ${r.days} j`} ar={`روجعت قبل ${r.days} يوم`} /> : <T fr="jamais revue" ar="لم تُراجع قط" />}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1">
              <Link href={r.href} className="rounded-lg border border-line px-2 py-1 text-xs font-black text-blue-500">
                <T fr="Ouvrir" ar="افتح" />
              </Link>
              <button onClick={() => mark(r)} className="touch rounded-lg bg-blue-600 px-2 py-1 text-xs font-black text-white active:scale-[.98]">
                <T fr="Révisée ✓" ar="راجعتها ✓" />
              </button>
            </span>
          </li>
        ))}
      </ul>

      {due.length > 15 && (
        <p className="text-center text-xs font-bold opacity-60"><T fr={`+ ${due.length - 15} autres — revenez demain.`} ar={`+ ${due.length - 15} أخرى — عُد غداً.`} /></p>
      )}

      <p className="text-xs opacity-60"><T fr={`Seuil : ${DUE_DAYS} jours. Le suivi est stocké uniquement sur cet appareil (hors ligne).`} ar={`العتبة: ${DUE_DAYS} يوماً. يُحفظ التتبع على هذا الجهاز فقط (دون اتصال).`} /></p>
    </div>
  );
}

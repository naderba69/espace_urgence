"use client";
// v3.0 — لوحة المراجعة السريرية الدورية: تواريخ آخر مراجعة لكل محتوى، واشارة تأخر > 12 شهراً.
import Link from "next/link";
import { monthsSince } from "@/lib/calc";
import { useEffect, useState } from "react";
import { loadRefIndex, type RefEntry } from "@/lib/ref-index";
import ScrollOnce from "@/components/ui/ScrollOnce";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";

interface Row { kind: "protocol" | "med" | "calc"; id: string; title: { fr: string; ar: string }; ym: string }

/** Libellés de type affichés dans le tableau. */
const KIND_OF: Record<string, "protocol" | "med" | "calc"> = {
  protocole: "protocol",
  medicament: "med",
  calculateur: "calc",
};

export default function RevisionPage() {
  const { lang } = useApp();
  useRegisterRecent("revision");
  const now = new Date();
  // v17.2 — les lignes viennent du fichier de références (14 Ko gzip) au lieu des trois
  // bases complètes (~780 Ko) : la page ne charge plus la totalité du contenu médical.
  const [refs, setRefs] = useState<RefEntry[]>([]);
  useEffect(() => {
    let alive = true;
    loadRefIndex()
      .then((m) => {
        if (alive) setRefs([...m.values()]);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const rows: Row[] = refs
    .filter((r) => r.type in KIND_OF)
    .map((r) => ({ kind: KIND_OF[r.type], id: r.key.split(":")[1] ?? r.key, title: r.title, ym: r.reviewed ?? "1970-01" }))
    .sort((a, b) => monthsSince(b.ym, now) - monthsSince(a.ym, now));

  const stale = rows.filter((r) => monthsSince(r.ym, now) >= 12);
  const KIND = { protocol: <T fr="Protocole" ar="بروتوكول" />, med: <T fr="Médicament" ar="دواء" />, calc: <T fr="Calculateur" ar="حاسبة" /> } as const;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Revue éditoriale" ar="المراجعة التحريرية" /></h1>

      <Link href="/revisions" className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-2 text-sm font-black text-blue-500">
        <T fr="Mes révisions personnelles" ar="مراجعاتي الشخصية" />
      </Link>

      <p className={`rounded-xl p-3 font-black ${stale.length ? "bg-red-600/15 text-red-500" : "bg-blue-600/15 text-blue-500"}`}>
        {stale.length
          ? <T fr={`${stale.length} élément(s) à revoir (plus de 12 mois).`} ar={`${stale.length} عنصر يحتاج مراجعة (أكثر من 12 شهراً).`} />
          : <T fr="Tout le contenu a été revu depuis moins de 12 mois." ar="كل المحتوى روجع خلال أقل من 12 شهراً." />}
      </p>

      <div className="flex gap-2 text-center text-sm font-black">
        <p className="flex-1 rounded-xl border border-line bg-surface p-2">{rows.filter((r) => r.kind === "protocol").length} <span className="opacity-60"><T fr="protocoles" ar="بروتوكول" /></span></p>
        <p className="flex-1 rounded-xl border border-line bg-surface p-2">{rows.filter((r) => r.kind === "med").length} <span className="opacity-60"><T fr="médicaments" ar="دواء" /></span></p>
        <p className="flex-1 rounded-xl border border-line bg-surface p-2">{rows.filter((r) => r.kind === "calc").length} <span className="opacity-60"><T fr="calculateurs" ar="حاسبة" /></span></p>
      </div>

      <ul className="space-y-1">
        {rows.map((r) => {
          const mo = monthsSince(r.ym, now);
          return (
            <li key={`${r.kind}:${r.id}`} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm">
              <span className="min-w-0">
                <ScrollOnce className="font-bold">{lang === "ar" ? r.title.ar : r.title.fr}</ScrollOnce>
                <span className="text-xs opacity-60">{KIND[r.kind]} · {r.ym}</span>
              </span>
              <span className={`shrink-0 rounded-full px-3 py-1 font-black tabular-nums ${mo >= 12 ? "bg-red-600/15 text-red-500" : "bg-blue-600/15 text-blue-500"}`}>
                {mo} <T fr="mois" ar="شهر" />
              </span>
            </li>
          );
        })}
      </ul>

      <p className="text-xs opacity-60"><T fr="Cycle de revue: 12 mois; toute mise à jour de recommandation déclenche une revue immédiate." ar="دورة المراجعة 12 شهراً؛ وأي تحديث توصيات يستدعي مراجعة فورية." /></p>
    </div>
  );
}

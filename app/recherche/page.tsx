"use client";
// Page de recherche plein écran : tous types, filtres, recherche assistée (mots-clés IA).
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import { loadSearchIndex, searchItems, type RefType } from "@/lib/search";
import { generateText } from "@/lib/ai";
import { aiReady } from "@/lib/ai-config";
import { trackEvent } from "@/lib/analytics";
import { useRegisterRecent } from "@/components/SearchBar";
import { ScrollText, Pill, Calculator, ClipboardList, Activity, GitBranch, Search, Sparkles, HeartPulse, Loader2, Wrench, Stethoscope } from "lucide-react";

const TYPE_META: Record<RefType, { fr: string; ar: string; Icon: typeof ScrollText }> = {
  protocole: { fr: "Protocoles", ar: "بروتوكولات", Icon: ScrollText },
  medicament: { fr: "Médicaments", ar: "أدوية", Icon: Pill },
  calculateur: { fr: "Calculateurs", ar: "حاسبات", Icon: Calculator },
  procedure: { fr: "Procédures", ar: "إجراءات", Icon: ClipboardList },
  ecg: { fr: "ECG", ar: "تخطيط", Icon: HeartPulse },
  arbre: { fr: "Arbres décisionnels", ar: "أشجار قرار", Icon: GitBranch },
  outil: { fr: "Outils", ar: "أدوات", Icon: Wrench },
  guidage: { fr: "Guidage", ar: "توجيه", Icon: Stethoscope },
};

export default function RecherchePage() {
  const { lang } = useApp();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<RefType | "all">("all");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiQ, setAiQ] = useState("");
  const [indexReady, setIndexReady] = useState(false);
  useRegisterRecent("outil:recherche");

  // v17.0 — index de recherche en chunk séparé : chargé ici (page dédiée à la recherche).
  useEffect(() => {
    let alive = true;
    loadSearchIndex()
      .then(() => alive && setIndexReady(true))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const results = useMemo(() => {
    const r = indexReady ? searchItems(q, 40) : [];
    return filter === "all" ? r : r.filter((i) => i.type === filter);
  }, [q, filter, indexReady]);

  const byType = useMemo(() => {
    const all = indexReady ? searchItems(q, 60) : [];
    const map = new Map<RefType, number>();
    all.forEach((i) => map.set(i.type, (map.get(i.type) ?? 0) + 1));
    return map;
  }, [q, indexReady]);

  const askAI = async () => {
    if (!aiReady() || !q.trim() || aiBusy) return;
    setAiBusy(true);
    try {
      trackEvent("ai_query", { kind: "search-assist" });
      const sys = lang === "ar"
        ? `أعط 1-3 كلمات مفتاحية طبية للبحث، بالعربية أو الفرنسية، مفصولة بمسافات فقط. لا شيء آخر.`
        : `Donne 1 à 3 mots-clés médicaux pour une recherche (français ou arabe), séparés par des espaces, rien d'autre.`;
      const raw = await generateText(`Recherche : ${q}`, sys);
      const kw = raw.replace(/["'.،]/g, " ").trim();
      setAiQ(kw);
      if (kw) setQ(kw);
    } catch {
      /* silencieux */
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <span className="rounded-xl bg-blue-600/15 p-2 text-blue-500"><Search className="h-6 w-6" aria-hidden /></span>
          <T fr="Recherche" ar="البحث" />
        </h1>
        <p className="mt-1 text-sm opacity-70"><T fr="Protocoles, médicaments, calculateurs, procédures, ECG, arbres — tout unifié." ar="بروتوكولات وأدوية وحاسبات وإجراءات وتخطيط وأشجار — كلها موحدة." /></p>
      </header>

      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={lang === "ar" ? "ابحث (مثال: أدرينالين، صدمة، ECG…)" : "Rechercher (adrénaline, choc, ECG…)"}
          autoFocus
          className="min-w-0 flex-1 rounded-2xl border-2 border-line bg-surface px-4 py-4 text-lg outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20"
          aria-label={lang === "ar" ? "بحث" : "Recherche"}
        />
        <button
          onClick={askAI}
          disabled={aiBusy || !q.trim()}
          title={lang === "ar" ? "استخراج كلمات بالذكاء الاصطناعي" : "Mots-clés par IA"}
          className="touch shrink-0 gap-1 rounded-2xl border border-blue-600/40 bg-blue-600/10 px-4 font-bold text-blue-600 hover:bg-blue-600/20 disabled:opacity-40"
        >
          {aiBusy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Sparkles className="h-5 w-5" aria-hidden />}
          <span className="hidden sm:inline">{lang === "ar" ? "AI" : "IA"}</span>
        </button>
      </div>
      {aiQ && <p className="text-xs opacity-60"><T fr={`Mots-clés extraits : ${aiQ}`} ar={`كلمات مستخرجة: ${aiQ}`} /></p>}

      {q.trim().length >= 2 && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="filtres">
          <button
            onClick={() => setFilter("all")}
            className={`touch rounded-xl px-4 py-2 text-sm font-bold ${filter === "all" ? "bg-blue-600 text-white" : "border border-line hover:bg-surface2"}`}
          >
            {lang === "ar" ? "الكل" : "Tout"} ({indexReady ? searchItems(q, 60).length : 0})
          </button>
          {(Object.keys(TYPE_META) as RefType[]).map((tp) => {
            const n = byType.get(tp) ?? 0;
            if (!n) return null;
            const meta = TYPE_META[tp];
            return (
              <button
                key={tp}
                onClick={() => setFilter(tp)}
                className={`touch flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold ${filter === tp ? "bg-blue-600 text-white" : "border border-line hover:bg-surface2"}`}
              >
                <meta.Icon className="h-4 w-4" aria-hidden />
                {lang === "ar" ? meta.ar : meta.fr} ({n})
              </button>
            );
          })}
        </div>
      )}

      <ul className="flex flex-col gap-2" aria-live="polite">
        {q.trim().length < 2 ? (
          <li className="rounded-2xl border border-dashed border-line p-6 text-center opacity-60">
            <Search className="mx-auto mb-2 h-8 w-8 opacity-40" aria-hidden />
            <T fr="Écrivez au moins 2 lettres — tous les contenus sont fouillés instantanément." ar="اكتب حرفين على الأقل — تُبحث كل المحتويات فوراً." />
          </li>
        ) : results.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-line p-6 text-center opacity-60">
            <T fr="Aucun résultat — essayez un synonyme ou moins de mots." ar="لا نتائج — جرّب مرادفاً أو كلمات أقل." />
          </li>
        ) : (
          results.map((r) => {
            const Icon = TYPE_META[r.type].Icon;
            return (
              <li key={r.key}>
                <Link href={r.href} className="card flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:border-blue-600">
                  <span className="rounded-xl bg-blue-600/15 p-2.5 text-blue-500"><Icon className="h-5 w-5" aria-hidden /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      {r.sev === "critical" && <span aria-hidden className="shrink-0 rounded-md bg-red-600 px-1.5 py-0.5 text-[10px] font-black text-white">!</span>}
                      <span className="line-clamp-2 font-bold">{lang === "ar" ? r.title.ar : r.title.fr}</span>
                    </span>
                    <span className="text-xs opacity-60">{lang === "ar" ? TYPE_META[r.type].ar : TYPE_META[r.type].fr}</span>
                  </span>
                  <Activity className="h-4 w-4 shrink-0 opacity-30" aria-hidden />
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

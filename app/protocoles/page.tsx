"use client";
// v7.5 — index protocoles : familles collantes + recherche instantanée, zéro scroll perdu.
//
// v17.3 — la page n'embarque plus les 98 fiches (≈ 173 Ko gzip). Elle s'appuie sur le
// fichier de références `/ref-index.json` (~15 Ko gzip, précaché) qui contient pour chaque
// protocole : identifiant, titres, catégorie, gravité, nombre d'étapes et date de revue.
// Le filtre de recherche ne portait déjà que sur les titres : le comportement est identique.
//
// فهرس البروتوكولات: لم تعد الصفحة تُنزّل 98 بطاقة كاملة، بل فهرس مراجع صغير يحتوي ما
// يُعرض فعلاً (العنوان، الفئة، الخطورة، عدد الخطوات، تاريخ المراجعة).
import { useMemo, useState } from "react";
import Link from "next/link";
import { protocolCategories } from "@/data/protocol-categories";
import ProtocolCard, { type ProtocolCardData } from "@/components/cards/ProtocolCard";
import { useApp } from "@/components/Providers";
import { normalize } from "@/lib/text"; // v17.0 — وحدة خفيفة: لا تسحب فهرس البحث
import { useRefIndexMap } from "@/lib/ref-index";
import { Search, ScrollText } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function ProtocolsPage() {
  const { lang, t } = useApp();
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const refMap = useRefIndexMap();

  /** Résumé affiché + catégorie (nécessaire au regroupement, absente de la carte). */
  type Row = ProtocolCardData & { category: string };

  const all = useMemo<Row[]>(() => {
    if (!refMap) return [];
    return [...refMap.values()]
      .filter((r) => r.type === "protocole")
      .map((r) => ({
        id: r.key.split(":")[1] ?? r.key,
        title: r.title,
        severity: r.severity ?? "standard",
        stepsCount: r.steps ?? 0,
        lastReviewed: r.reviewed ?? "—",
        category: r.category ?? "",
      }));
  }, [refMap]);

  const filtered = useMemo(() => {
    const nq = normalize(q);
    return all.filter(
      (p) =>
        (cat === "all" || p.category === cat) &&
        (!nq || normalize(`${p.title.fr} ${p.title.ar}`).includes(nq))
    );
  }, [all, cat, q]);

  const browsing = cat === "all" && !q.trim();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader icon={<ScrollText className="h-6 w-6" />} title={t("nav.protocols")} sub={t("page.protocols.sub")} count={all.length} />
      <label className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2">
        <Search className="h-4 w-4 opacity-60" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={lang === "ar" ? "ابحث في البروتوكولات…" : "Chercher un protocole…"}
          className="w-full bg-transparent text-sm font-semibold outline-none"
          aria-label={lang === "ar" ? "بحث في البروتوكولات" : "Recherche protocoles"}
        />
      </label>

      <nav aria-label={lang === "ar" ? "فئات" : "catégories"} className="eutn-secnav sticky top-1 z-30 -mx-1 flex gap-1.5 overflow-x-auto px-1 py-1">
        <button onClick={() => setCat("all")} className={`touch shrink-0 rounded-full border px-3 py-1.5 text-xs font-black ${cat === "all" ? "border-blue-600 bg-blue-600 text-white" : "border-line bg-surface/90 backdrop-blur"}`}>
          {lang === "ar" ? "الكل" : "Tout"} · {all.length}
        </button>
        {protocolCategories.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} className={`touch shrink-0 rounded-full border px-3 py-1.5 text-xs font-black ${cat === c.id ? "border-blue-600 bg-blue-600 text-white" : "border-line bg-surface/90 backdrop-blur"}`}>
            {lang === "ar" ? c.label.ar : c.label.fr}
          </button>
        ))}
      </nav>

      {/* Chargement du fichier de références : quelques dizaines de millisecondes, et la
          copie précachée répond instantanément hors-ligne. */}
      {!refMap && (
        <p aria-busy="true" className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          {lang === "ar" ? "جارٍ التحميل…" : "Chargement…"}
        </p>
      )}

      {refMap && (browsing ? (
        <div className="flex flex-col gap-6">
          {protocolCategories.map((c) => {
            const list = all.filter((p) => p.category === c.id);
            if (list.length === 0) return null;
            return (
              <section key={c.id} aria-label={c.label.fr}>
                <h2 className="mb-2 border-s-4 border-blue-600 ps-3 text-lg font-bold">
                  {lang === "ar" ? c.label.ar : c.label.fr}
                </h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {list.map((p) => (
                    <li key={p.id}>
                      <Link href={`/protocoles/${p.id}`} className="block rounded-2xl">
                        <ProtocolCard data={p} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <li key={p.id}>
              <Link href={`/protocoles/${p.id}`} className="block rounded-2xl">
                <ProtocolCard data={p} />
              </Link>
            </li>
          ))}
        </ul>
      ))}
      {refMap && filtered.length === 0 && (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          {lang === "ar" ? "لا نتيجة." : "Aucun résultat."}
        </p>
      )}

      {/* v15.0 — بنية A: التخصصات الخمسة تسكن داخل Protocoles (قرار مقفول) */}
      <section aria-label={lang === "ar" ? "التخصصات" : "Spécialités"}>
        <h2 className="mb-2 border-s-4 ps-3 text-lg font-bold" style={{ borderColor: "var(--accent)" }}>
          {lang === "ar" ? "التخصصات" : "Spécialités"}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {[
            { href: "/pediatrie", fr: "Pédiatrie", ar: "طب الأطفال" },
            { href: "/obstetrique", fr: "Obstétrique", ar: "التوليد" },
            { href: "/psychiatrie", fr: "Psychiatrie", ar: "الطب النفسي" },
            { href: "/traumatologie", fr: "Traumatologie", ar: "الإصابات والجروح" },
            { href: "/triage", fr: "Triage", ar: "الفرز" },
          ].map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="card flex min-h-[56px] items-center gap-3 rounded-2xl border border-line bg-surface p-4 font-semibold hover:border-blue-600">
                <span className="min-w-0 flex-1 break-words">{lang === "ar" ? s.ar : s.fr}</span>
                <span aria-hidden className="opacity-50">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* v15.0 — مساندة: شجرات القرار والتدخل الموجّه (إحالات لا نسخ) */}
      <section aria-label={lang === "ar" ? "مساندة" : "Assistants"}>
        <h2 className="mb-2 border-s-4 ps-3 text-lg font-bold" style={{ borderColor: "var(--accent)" }}>
          {lang === "ar" ? "مساندة" : "Assistants"}
        </h2>
        <ul className="flex flex-wrap gap-2">
          <li><Link href="/arbres" className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface2">{lang === "ar" ? "أشجار القرار" : "Arbres décisionnels"}</Link></li>
          <li><Link href="/guidage" className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface2">{lang === "ar" ? "تدخل موجّه" : "Intervention guidée"}</Link></li>
        </ul>
      </section>
    </div>
  );
}

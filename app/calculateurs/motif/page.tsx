"use client";
// v10.0-A1 — محرك الشكوى الرئيسية : عَرَض → أسئلة نعم/لا → بروتوكولات بالخطورة.
import { useMemo, useState } from "react";
import Link from "next/link";
import { MOTIFS } from "@/data/motifs";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import SectionTitle from "@/components/ui/SectionTitle";
import { Stethoscope } from "lucide-react";

export default function MotifPage() {
  useRegisterRecent("calculateur:motif");
  const { lang } = useApp();
  const [mid, setMid] = useState<string | null>(null);
  const [ans, setAns] = useState<Record<string, boolean | undefined>>({});

  const motif = MOTIFS.find((m) => m.id === mid) ?? null;

  const results = useMemo(() => {
    if (!motif) return [];
    return motif.outcomes
      .map((o) => ({
        ...o,
        score: Object.entries(o.cond).reduce(
          (n, [q, want]) => (ans[q] === want ? n + 1 : n), 0),
      }))
      .filter((o) => o.score > 0)
      .sort((a, b) => a.sev - b.sev || b.score - a.score);
  }, [motif, ans]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Stethoscope className="h-6 w-6" />}
        title={lang === "ar" ? "محرك الشكوى الرئيسية" : "Motif de recours"}
        sub={lang === "ar" ? "اختر العَرَض وأجب — البروتوكولات تُرتَّب بالخطورة." : "Choisissez le motif, répondez — protocoles classés par gravité."}
      />

      <nav aria-label={lang === "ar" ? "الشكاوى" : "motifs"} className="flex flex-wrap gap-2">
        {MOTIFS.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMid(m.id); setAns({}); }}
            aria-pressed={mid === m.id}
            className={`touch rounded-full border px-4 py-2 text-sm font-black ${mid === m.id ? "border-transparent text-white" : "border-line bg-surface hover:bg-surface2"}`}
            style={mid === m.id ? { background: "var(--accent)" } : undefined}
          >
            {lang === "ar" ? m.ar : m.fr}
          </button>
        ))}
      </nav>

      {motif && (
        <>
          <section className="card flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
            <SectionTitle>{lang === "ar" ? "أسئلة التوجيه" : "Questions d'orientation"}</SectionTitle>
            {motif.questions.map((q) => {
              const v = ans[q.id];
              return (
                <div key={q.id} className="flex items-center justify-between gap-2 rounded-xl border border-line p-3">
                  <p className="text-sm font-bold">{lang === "ar" ? q.ar : q.fr}</p>
                  <div className="flex gap-1" role="radiogroup" aria-label={q.fr}>
                    <button
                      onClick={() => setAns((p) => ({ ...p, [q.id]: true }))}
                      aria-pressed={v === true}
                      className={`touch rounded-full border px-4 py-1.5 text-sm font-black ${v === true ? "border-transparent text-white" : "border-line"}`}
                      style={v === true ? { background: "var(--sev-critical)" } : undefined}
                    >
                      {lang === "ar" ? "نعم" : "Oui"}
                    </button>
                    <button
                      onClick={() => setAns((p) => ({ ...p, [q.id]: false }))}
                      aria-pressed={v === false}
                      className={`touch rounded-full border px-4 py-1.5 text-sm font-black ${v === false ? "border-transparent text-white" : "border-line"}`}
                      style={v === false ? { background: "var(--sev-standard)" } : undefined}
                    >
                      {lang === "ar" ? "لا" : "Non"}
                    </button>
                  </div>
                </div>
              );
            })}
          </section>

          {results.length > 0 ? (
            <section className="flex flex-col gap-3">
              <SectionTitle>{lang === "ar" ? "الوجهات المرتبة بالخطورة" : "Destinations classées par gravité"}</SectionTitle>
              {results.map((o) => (
                <Link
                  key={o.href + o.fr}
                  href={o.href}
                  className={`card sev-strip block rounded-2xl border border-line bg-surface p-4 ${o.sev === 1 ? "sev-critical" : o.sev === 2 ? "sev-urgent" : "sev-standard"}`}
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="font-black">{lang === "ar" ? o.ar : o.fr}</p>
                    <Badge tone={o.sev === 1 ? "critical" : o.sev === 2 ? "urgent" : "standard"}>
                      {o.sev === 1 ? (lang === "ar" ? "حيوي" : "Vital") : o.sev === 2 ? (lang === "ar" ? "عاجل" : "Urgent") : (lang === "ar" ? "مهم" : "Important")}
                    </Badge>
                  </div>
                  <p className="text-sm opacity-70">{lang === "ar" ? o.hintAr : o.hintFr}</p>
                </Link>
              ))}
            </section>
          ) : (
            <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
              {lang === "ar" ? "أجب بنعم على علامة واحدة على الأقل لعرض الوجهات." : "Répondez « oui » à au moins un signe pour voir les destinations."}
            </p>
          )}
        </>
      )}
    </div>
  );
}

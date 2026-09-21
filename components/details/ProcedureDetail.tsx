"use client";
// Détail procédure : matériel, étapes, surveillance, checklist interactive (pré/post) imprimable.
import { useEffect, useState } from "react";
import type { Procedure } from "@/data/procedures";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import { FavoriteButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import BackLink from "@/components/BackLink";
import { trackEvent } from "@/lib/analytics";
import { Briefcase, ListOrdered, Eye, SquareCheckBig, BookOpen, Info, Timer } from "lucide-react";
import { fmtMMSS } from "@/lib/calc";

function Checklist({ items, prefix, title }: { items: Procedure["equipment"]; prefix: string; title: { fr: string; ar: string } }) {
  const { lang } = useApp();
  const [done, setDone] = useState<Set<string>>(new Set());
  const toggle = (k: string) =>
    setDone((p) => {
      const n = new Set(p);
      if (n.has(k)) { n.delete(k); } else { n.add(k); }
      return n;
    });
  return (
    <section className="card rounded-2xl border border-dashed border-blue-600/50 bg-blue-600/5 p-4">
      <h3 className="mb-2 flex items-center gap-2 font-bold text-blue-500">
        <SquareCheckBig className="h-5 w-5" aria-hidden /> <T fr={title.fr} ar={title.ar} />
        <span className="ms-auto text-xs opacity-60">{done.size}/{items.length}</span>
      </h3>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((it, i) => {
          const k = `${prefix}-${i}`;
          const isDone = done.has(k);
          return (
            <li key={k}>
              <button role="checkbox" aria-checked={isDone} onClick={() => toggle(k)}
                className={`touch w-full justify-start gap-2 rounded-xl border px-3 py-2 text-start ${isDone ? "border-blue-600 bg-blue-600/15 line-through opacity-60" : "border-line bg-surface hover:bg-surface2"}`}>
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${isDone ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
                  {isDone && "✓"}
                </span>
                <span className="align-middle">{lang === "ar" ? it.ar : it.fr}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function ProcedureDetail({ procedure: p }: { procedure: Procedure }) {
  const { lang, t } = useApp();
  useRegisterRecent(`procedure:${p.id}`);
  useEffect(() => trackEvent("procedure_view", { id: p.id }), [p.id]);

  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setElapsed(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);
  const chronoOn = chrono.start !== null || chrono.acc > 0;

  return (
    <article className="flex max-w-3xl flex-col gap-5">
      <BackLink href="/procedures" />
      <header className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-extrabold"><T fr={p.title.fr} ar={p.title.ar} /></h1>
        <div className="flex gap-2">
          <FavoriteButton itemKey={`procedure:${p.id}`} />
        </div>
      </header>


      {/* Chrono v3.1 */}
      <section className="card flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
        <div>
          <p className="flex items-center gap-2 font-bold text-blue-500"><Timer className="h-5 w-5" aria-hidden /> <T fr="Chronomètre" ar="موقّت" /></p>
          {p.timeTarget && <p className="mt-1 text-xs font-bold text-amber-500"><T fr={p.timeTarget.fr} ar={p.timeTarget.ar} /></p>}
        </div>
        <p className="whitespace-nowrap text-2xl font-black tabular-nums" dir="ltr">{fmtMMSS(elapsed)}</p>
        <div className="flex gap-2">
          <button onClick={() => setChrono((c) => {
              if (c.start) { const acc = c.acc + (Date.now() - c.start) / 1000; setElapsed(acc); return { start: null, acc }; }
              return { start: Date.now(), acc: c.acc };
            })}
            className="touch rounded-xl bg-blue-600 px-4 py-2 font-black text-white active:scale-[.98]">
            {chrono.start ? <T fr="Pause" ar="إيقاف" /> : <T fr="Démarrer" ar="ابدأ" />}
          </button>
          {chronoOn && (
            <button onClick={() => { setChrono({ start: null, acc: 0 }); setElapsed(0); }} className="touch rounded-xl border border-line px-4 py-2 font-bold">
              <T fr="Zéro" ar="تصفير" />
            </button>
          )}
        </div>
      </section>

      {/* Matériel */}
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 flex items-center gap-2 font-bold text-blue-500"><Briefcase className="h-5 w-5" /> {lang === "ar" ? "المعدّات" : "Matériel"}</h2>
        <ul className="list-disc space-y-1 ps-5">
          {p.equipment.map((e, i) => <li key={i}><T fr={e.fr} ar={e.ar} /></li>)}
        </ul>
      </section>

      {/* Étapes */}
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 flex items-center gap-2 font-bold text-blue-500"><ListOrdered className="h-5 w-5" /> {lang === "ar" ? "الخطوات" : "Gestes"}</h2>
        <ol className="space-y-2">
          {p.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white tabular-nums">{i + 1}</span>
              <span className="pt-0.5"><T fr={s.fr} ar={s.ar} /></span>
              {p.stepTimes?.[i] !== undefined && (
                <span className="ms-auto shrink-0 self-start rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-black tabular-nums text-amber-500" dir="ltr">≤ {fmtMMSS(p.stepTimes[i])}</span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Checklist interactive */}
      {p.checklist?.pre && (
        <Checklist items={p.checklist.pre} prefix="pre" title={{ fr: "Checklist AVANT", ar: "قائمة تحقق قبل" }} />
      )}
      {p.checklist?.post && (
        <Checklist items={p.checklist.post} prefix="post" title={{ fr: "Checklist APRÈS", ar: "قائمة تحقق بعد" }} />
      )}

      {/* Surveillance */}
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 flex items-center gap-2 font-bold text-blue-500"><Eye className="h-5 w-5" /> {lang === "ar" ? "المراقبة" : "Surveillance / points de vigilance"}</h2>
        <ul className="list-disc space-y-1 ps-5">
          {p.nursing.map((n, i) => <li key={i}><T fr={n.fr} ar={n.ar} /></li>)}
        </ul>
      </section>

      <section className="card rounded-2xl border border-line bg-surface p-4 text-sm">
        <h2 className="mb-1 flex items-center gap-2 font-bold"><BookOpen className="h-4 w-4" /> {t("common.sources")}</h2>
        <p className="opacity-80">{p.meta.sources.join(" · ")} · {t("common.lastReviewed")} : {p.meta.lastReviewed}</p>
        <p className="mt-3 flex gap-2 rounded-xl bg-amber-500/10 p-3 text-amber-500">
          <Info className="h-5 w-5 shrink-0" /> {t("common.disclaimer")}
        </p>
      </section>
    </article>
  );
}

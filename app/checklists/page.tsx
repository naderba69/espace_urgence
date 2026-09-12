"use client";
// Check-lists opérationnelles — cochage avec progression, sauvegarde locale, impression.
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import { CHECKLISTS } from "@/data/checklists";
import { CheckCircle2, Circle, Printer, RotateCcw } from "lucide-react";

const STORE_KEY = "eutn:checklists";

type Checks = Record<string, Record<string, boolean>>;

function loadChecks(): Checks {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}") as Checks;
  } catch {
    return {};
  }
}

export default function ChecklistsPage() {
  const { lang, t } = useApp();
  useRegisterRecent("page:checklists");
  const [checks, setChecks] = useState<Checks>({});

  useEffect(() => setChecks(loadChecks()), []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(STORE_KEY, JSON.stringify(checks));
  }, [checks]);

  const itemKey = (cid: string, gi: number, ii: number) => `${cid}:${gi}:${ii}`;

  const toggle = (cid: string, gi: number, ii: number) =>
    setChecks((prev) => {
      const cur = { ...(prev[cid] || {}) };
      cur[itemKey(cid, gi, ii)] = !cur[itemKey(cid, gi, ii)];
      return { ...prev, [cid]: cur };
    });

  const reset = (cid: string) =>
    setChecks((prev) => ({ ...prev, [cid]: {} }));

  const progress = (cid: string, total: number) => {
    const done = Object.values(checks[cid] || {}).filter(Boolean).length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  };

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">{t("checklists.title")}</h1>
          <p className="mt-1 text-sm opacity-70">{t("checklists.intro")}</p>
        </div>
      </header>

      <div className="rounded-2xl border border-amber-600/30 bg-amber-500/10 p-4 text-sm font-semibold text-amber-600 dark:text-amber-300">
        {t("checklists.warning")}
      </div>

      {CHECKLISTS.map((cl) => {
        const total = cl.groups.reduce((n, g) => n + g.items.length, 0);
        const p = progress(cl.id, total);
        return (
          <section
            key={cl.id}
            id={cl.id}
            className="card overflow-hidden rounded-2xl border border-line bg-surface print:break-inside-avoid"
          >
            <div className="flex items-start justify-between gap-3 border-b border-line p-4">
              <div>
                <h2 className="text-lg font-bold">{lang === "ar" ? cl.title.ar : cl.title.fr}</h2>
                <p className="mt-1 text-sm opacity-70">{lang === "ar" ? cl.description.ar : cl.description.fr}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => window.print()}
                  aria-label={lang === "ar" ? "طباعة" : "Imprimer"}
                  className="touch rounded-xl border border-line p-2 hover:bg-teal-600/10"
                >
                  <Printer className="h-4 w-4" aria-hidden />
                </button>
                <button
                  onClick={() => reset(cl.id)}
                  aria-label={lang === "ar" ? "تصفير" : "Réinitialiser"}
                  className="touch rounded-xl border border-line p-2 hover:bg-teal-600/10"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="flex items-center gap-3 px-4 pt-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={p.pct} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${p.pct}%` }} />
              </div>
              <span className="text-xs font-bold tabular-nums opacity-80">{p.done}/{p.total} ({p.pct} %)</span>
            </div>

            <div className="flex flex-col gap-4 p-4">
              {cl.groups.map((g, gi) => (
                <div key={gi}>
                  <h3 className="mb-2 text-sm font-black uppercase tracking-wide text-teal-600">
                    {lang === "ar" ? g.title.ar : g.title.fr}
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {g.items.map((it, ii) => {
                      const on = Boolean(checks[cl.id]?.[itemKey(cl.id, gi, ii)]);
                      return (
                        <li key={ii}>
                          <button
                            onClick={() => toggle(cl.id, gi, ii)}
                            className={`touch flex w-full items-start gap-3 rounded-xl border p-3 text-start text-sm leading-snug transition ${
                              on ? "border-teal-600/40 bg-teal-600/10 opacity-60" : "border-line hover:bg-teal-600/5"
                            }`}
                            aria-pressed={on}
                          >
                            {on ? (
                              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" aria-hidden />
                            ) : (
                              <Circle className="mt-0.5 h-5 w-5 shrink-0 opacity-40" aria-hidden />
                            )}
                            <span className={on ? "line-through" : ""}>{lang === "ar" ? it.ar : it.fr}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <footer className="border-t border-line bg-teal-600/5 px-4 py-2 text-xs opacity-70">
              📚 {cl.source} · {lang === "ar" ? "مراجعة" : "revue"} {cl.lastReviewed}
            </footer>
          </section>
        );
      })}
    </div>
  );
}

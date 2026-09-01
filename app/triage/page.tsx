"use client";
// Triage déterministe par situation — complète l'aide IA (/triage-ia), fonctionne hors-ligne et sans clé.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { TRIAGE_CASES, TRIAGE_SYSTEMS, PRIORITY_META, type TriageCase } from "@/data/triage";
import { getProtocol } from "@/data/protocols";
import { trackEvent } from "@/lib/analytics";
import { ListFilter, ChevronDown, Sparkles, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

const CHIP_ORDER: TriageCase["system"][] = [
  "cardio", "resp", "neuro", "trauma", "infectieux", "digestif", "obstetrique", "pediatrie", "psy", "metabolique",
];

export default function TriagePage() {
  const { lang } = useApp();
  useRegisterRecent("page:triage");
  const [system, setSystem] = useState<"" | TriageCase["system"]>("");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(
    () => TRIAGE_CASES.filter((c) => !system || c.system === system),
    [system]
  );

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <ListFilter className="h-7 w-7 text-teal-500" aria-hidden />
          <T fr="Triage — situation par situation" ar="الفرز — حالة بحالة" />
        </h1>
        <Link
          href="/triage-ia"
          className="touch flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-500"
          onClick={() => trackEvent("nav", { to: "triage-ia" })}
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          <T fr="Aide IA" ar="مساعد ذكي" />
        </Link>
      </header>

      <p className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 text-sm font-semibold text-amber-700 dark:text-amber-400">
        <T
          fr="⚠️ Aide-mémoire : la priorité indiquée vaut pour les critères listés. En cas de doute, classer à la catégorie la PLUS grave."
          ar="⚠️ تذكِرة: الأولوية المعروضة صالحة للمعايير المذكورة. عند الشك، صنّف في الفئة الأشد."
        />
      </p>

      {/* Filtres par système */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSystem("")}
          className={`touch rounded-full px-4 py-1.5 text-sm font-bold ${system === "" ? "bg-teal-600 text-white" : "bg-surface2 border border-line"}`}
        >
          <T fr="Tous" ar="الكل" />
        </button>
        {CHIP_ORDER.filter((s) => TRIAGE_CASES.some((c) => c.system === s)).map((s) => (
          <button
            key={s}
            onClick={() => setSystem(system === s ? "" : s)}
            className={`touch rounded-full px-4 py-1.5 text-sm font-bold ${system === s ? "bg-teal-600 text-white" : "bg-surface2 border border-line"}`}
          >
            {lang === "ar" ? TRIAGE_SYSTEMS[s].ar : TRIAGE_SYSTEMS[s].fr}
          </button>
        ))}
      </div>

      {/* Cas cliniques */}
      <ul className="flex flex-col gap-3">
        {list.map((c) => {
          const meta = PRIORITY_META[c.priority];
          const isOpen = open === c.id;
          const protos = c.protocolIds.map(getProtocol).filter(Boolean);
          return (
            <li key={c.id} className="card overflow-hidden rounded-2xl border border-line bg-surface">
              <button
                onClick={() => setOpen(isOpen ? null : c.id)}
                className="touch flex w-full items-start gap-3 p-4 text-start"
                aria-expanded={isOpen}
              >
                <span className={`mt-1 inline-flex shrink-0 items-center rounded-lg px-2.5 py-1 text-xs font-black text-white ${meta.cls}`}>
                  {lang === "ar" ? meta.label.ar : meta.label.fr}
                </span>
                <span className="flex-1">
                  <span className="block font-bold">{lang === "ar" ? c.title.ar : c.title.fr}</span>
                  <span className="mt-0.5 block text-xs opacity-70">
                    {lang === "ar" ? c.colorLabel.ar : c.colorLabel.fr}
                  </span>
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 opacity-60 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden />
              </button>
              {isOpen && (
                <div className="border-t border-line p-4 pt-3 text-sm">
                  <section className="mb-3">
                    <h3 className="mb-1 flex items-center gap-2 font-bold text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-4 w-4" aria-hidden />
                      {lang === "ar" ? "متى تُصنَّف هكذا" : "Critères de classement"}
                    </h3>
                    <ul className="ms-5 list-disc space-y-1 leading-relaxed">
                      {c.triggers.map((x, i) => <li key={i}>{lang === "ar" ? x.ar : x.fr}</li>)}
                    </ul>
                  </section>
                  <section className="mb-3">
                    <h3 className="mb-1 flex items-center gap-2 font-bold text-teal-600 dark:text-teal-400">
                      <CheckCircle2 className="h-4 w-4" aria-hidden />
                      {lang === "ar" ? "إجراءات فورية" : "Gestes immédiats"}
                    </h3>
                    <ul className="ms-5 list-disc space-y-1 leading-relaxed">
                      {c.immediate.map((x, i) => <li key={i}>{lang === "ar" ? x.ar : x.fr}</li>)}
                    </ul>
                  </section>
                  {c.downgrade && (
                    <p className="mb-3 rounded-xl bg-surface2 p-3 leading-relaxed">
                      <b>{lang === "ar" ? "متى نخفّض التصنيف: " : "Déclassement : "}</b>
                      {lang === "ar" ? c.downgrade.ar : c.downgrade.fr}
                    </p>
                  )}
                  {protos.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {protos.map((p) => (
                        <Link key={p!.id} href={`/protocoles/${p!.id}`}
                          className="touch inline-flex items-center gap-1 rounded-lg bg-teal-600/10 px-3 py-1.5 font-bold text-teal-700 hover:bg-teal-600/20 dark:text-teal-300">
                          {lang === "ar" ? p!.title.ar : p!.title.fr}
                          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
                        </Link>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-[11px] opacity-50">{lang === "ar" ? "المصدر: " : "Source : "}{c.source}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-xs opacity-60">
        {lang === "ar"
          ? "المصادر: SFU/FRMU، إرشيدات CIMU 2013، قواعد الجمعيات (ESC, ERC, ATLS 10, SFAR, ESVS, ABA) — التصنيف يبقى قراراً سريرياً."
          : "Références : SFU/FRMU, CIMU 2013 (délais cibles), sociétés savantes (ESC, ERC, ATLS 10, SFAR, ESVS, ABA) — le triage reste une décision clinique."}
      </p>
    </div>
  );
}

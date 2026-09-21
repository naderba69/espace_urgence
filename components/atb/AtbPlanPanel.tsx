"use client";
// v18.1 — خطّة العلاج المضادّ الحيوي: عرض القرارات، إعادة التقييم (حلقة a → b)، وتصدير النصّ.
// Plan antibiotique : décisions par molécule, réévaluation itérative et export texte imprimable.
import { useMemo, useState } from "react";
import { Check, Copy, Printer, RotateCcw, X } from "lucide-react";
import T from "@/components/T";
import { useApp } from "@/components/Providers";
import { currentDecisions, planReasonLabel, planToText, type PlanEntry, type PlanState } from "@/lib/atb-plan";

export default function AtbPlanPanel({
  plan,
  name,
  stageLabel,
  onReevaluate,
  onRemove,
  onReset,
}: {
  plan: PlanState;
  /** اسم التركيبة بلغة الواجهة. */
  name: (id: string) => string;
  stageLabel: string;
  onReevaluate: (id: string, decision: "retenue" | "abandonnee") => void;
  onRemove: (id: string) => void;
  onReset: () => void;
}) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const [copied, setCopied] = useState(false);
  const current = useMemo(() => [...currentDecisions(plan).values()], [plan]);
  const kept = current.filter((e) => e.decision === "retenue");
  const dropped = current.filter((e) => e.decision === "abandonnee");
  const text = useMemo(() => planToText(plan, { lang: ar ? "ar" : "fr", name, stageLabel }), [plan, name, stageLabel, ar]);

  if (!plan.entries.length) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible : le texte reste sélectionnable ci-dessous */
    }
  };

  const line = (e: PlanEntry, ok: boolean) => (
    <li key={e.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface2 px-2.5 py-2">
      {ok ? <Check className="h-4 w-4 shrink-0" style={{ color: "var(--sev-standard)" }} aria-hidden /> : <X className="h-4 w-4 shrink-0" style={{ color: "var(--sev-critical)" }} aria-hidden />}
      <span className="min-w-0 flex-1 text-sm font-black">{name(e.id)}</span>
      {!ok && e.reason && <span className="text-[11px] font-bold opacity-70">{planReasonLabel[e.reason][ar ? "ar" : "fr"]}</span>}
      <span className="text-[11px] font-bold tabular-nums opacity-60" dir="ltr">#{e.round}</span>
      <button
        onClick={() => onReevaluate(e.id, ok ? "abandonnee" : "retenue")}
        className="rounded-full border border-line px-2.5 py-1 text-[11px] font-black hover:bg-surface"
      >
        {ok ? <T fr="Réévaluer → abandon" ar="إعادة تقييم ← تخلّي" /> : <T fr="Réévaluer → retenir" ar="إعادة تقييم ← اعتماد" />}
      </button>
      <button onClick={() => onRemove(e.id)} className="rounded-full border border-line px-2.5 py-1 text-[11px] font-black opacity-70 hover:bg-surface">
        <T fr="Retirer" ar="إزالة" />
      </button>
    </li>
  );

  return (
    <section className="rounded-2xl border border-line bg-surface p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-black">
          <T fr="Plan antibiotique (boucle a → b)" ar="خطّة العلاج المضادّ (حلقة a → b)" />{" "}
          <span className="tabular-nums opacity-60" dir="ltr">
            {kept.length}✓ / {dropped.length}✗
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={copy} className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[11px] font-black hover:bg-surface2">
            <Copy className="h-3.5 w-3.5" aria-hidden />
            {copied ? <T fr="Copié ✓" ar="تم النسخ ✓" /> : <T fr="Copier" ar="نسخ" />}
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[11px] font-black hover:bg-surface2">
            <Printer className="h-3.5 w-3.5" aria-hidden />
            <T fr="Imprimer" ar="طباعة" />
          </button>
          <button onClick={onReset} className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[11px] font-black opacity-70 hover:bg-surface2">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            <T fr="Vider" ar="تفريغ" />
          </button>
        </div>
      </div>

      {kept.length > 0 && (
        <>
          <p className="mt-3 text-xs font-black opacity-70"><T fr="Retenues" ar="مُعتمدة" /></p>
          <ul className="mt-1 flex flex-col gap-1.5">{kept.map((e) => line(e, true))}</ul>
        </>
      )}
      {dropped.length > 0 && (
        <>
          <p className="mt-3 text-xs font-black opacity-70"><T fr="Abandonnées" ar="متخلّى عنها" /></p>
          <ul className="mt-1 flex flex-col gap-1.5">{dropped.map((e) => line(e, false))}</ul>
        </>
      )}

      {/* النصّ الجاهز للنسخ/الطباعة — يظهر دائمًا حتى لو تعذّر الوصول إلى الحافظة */}
      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-black opacity-70">
          <T fr="Texte à copier / imprimer" ar="النصّ الجاهز للنسخ/الطباعة" />
        </summary>
        <pre dir={ar ? "rtl" : "ltr"} className="mt-2 max-h-64 overflow-auto rounded-xl border border-line bg-surface2 p-2 text-[11px] leading-relaxed whitespace-pre-wrap">
          {text}
        </pre>
      </details>
    </section>
  );
}

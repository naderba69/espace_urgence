"use client";
// v8.2 — Score LRINEC (fasciite nécrosante) : probabilité de dermo-hypodermite bactérienne nécrosante.
// Un LRINEC bas n'exclut PAS — le doute clinique impose l'exploration chirurgicale.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";

type Row = {
  id: string;
  label: { fr: string; ar: string };
  hint: { fr: string; ar: string };
  opts: { id: string; pts: number; fr: string; ar: string }[];
};

const ROWS: Row[] = [
  { id: "crp", label: { fr: "CRP", ar: "‏CRP" }, hint: { fr: "mg/L", ar: "ملغ/ل" }, opts: [
    { id: "c0", pts: 0, fr: "< 150", ar: "< 150" },
    { id: "c1", pts: 4, fr: "≥ 150", ar: "≥ 150" },
  ]},
  { id: "gb", label: { fr: "Globules blancs", ar: "الكريات البيض" }, hint: { fr: "/mm³", ar: "/مم³" }, opts: [
    { id: "g0", pts: 0, fr: "< 15 000", ar: "< 15000" },
    { id: "g1", pts: 1, fr: "15-25 000", ar: "15-25 ألف" },
    { id: "g2", pts: 2, fr: "> 25 000", ar: "> 25 ألف" },
  ]},
  { id: "hb", label: { fr: "Hémoglobine", ar: "الخضاب" }, hint: { fr: "g/dL", ar: "غ/دل" }, opts: [
    { id: "h0", pts: 0, fr: "> 13,5", ar: "> 13.5" },
    { id: "h1", pts: 1, fr: "11-13,5", ar: "11-13.5" },
    { id: "h2", pts: 2, fr: "< 11", ar: "< 11" },
  ]},
  { id: "na", label: { fr: "Sodium", ar: "الصوديوم" }, hint: { fr: "mmol/L", ar: "م مول/ل" }, opts: [
    { id: "n0", pts: 0, fr: "≥ 135", ar: "≥ 135" },
    { id: "n1", pts: 2, fr: "< 135", ar: "< 135" },
  ]},
  { id: "creat", label: { fr: "Créatinine", ar: "الكرياتينين" }, hint: { fr: "mg/dL", ar: "ملغ/دل" }, opts: [
    { id: "k0", pts: 0, fr: "≤ 1,6", ar: "≤ 1.6" },
    { id: "k1", pts: 2, fr: "> 1,6", ar: "> 1.6" },
  ]},
  { id: "glu", label: { fr: "Glycémie", ar: "السكر" }, hint: { fr: "mg/dL", ar: "ملغ/دل" }, opts: [
    { id: "s0", pts: 0, fr: "≤ 180", ar: "≤ 180" },
    { id: "s1", pts: 1, fr: "> 180", ar: "> 180" },
  ]},
];

export default function LrinecPage() {
  const { lang } = useApp();
  const [sel, setSel] = useState<Record<string, string>>({ crp: "c0", gb: "g0", hb: "h0", na: "n0", creat: "k0", glu: "s0" });
  useRegisterRecent("calculateur:lrinec");

  const score = ROWS.reduce((s, r) => s + (r.opts.find((o) => o.id === sel[r.id])?.pts ?? 0), 0);
  const band = score >= 8
    ? { cls: "bg-red-600", fr: "RISQUE ÉLEVÉ (≥ 8): probabilité forte de fasciite nécrosante — appel chirurgical immédiat, antibiothérapie triple, bloc dans l'heure", ar: "خطر مرتفع (≥ 8): احتمال قوي لالتهاب لفافة ناخر — نداء جراحي فوري، مضادات ثلاثية، صالة خلال ساعة" }
    : score >= 6
      ? { cls: "bg-amber-500", fr: "RISQUE INTERMÉDIAIRE (6-7): forte suspicion — avis chirurgical SANS délai, surveillance rapprochée, ne jamais rassurer sur le score seul", ar: "خطر متوسط (6-7): شك قوي — رأي جراحي دون تأخير، مراقبة لصيقة، لا تطمئن للسكور وحده" }
      : { cls: "bg-blue-600", fr: "RISQUE FAIBLE (≤ 5): fasciite moins probable MAIS non exclue — si douleur disproportionnée ou extension rapide, exploration chirurgicale quand même", ar: "خطر منخفض (≤ 5): التهاب اللفافة أقل احتمالاً لكن غير مستبعد — عند ألم غير متناسب أو امتداد سريع، استكشاف جراحي رغم ذلك" };

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header>
        <h1 className="text-2xl font-extrabold"><T fr="Score LRINEC — fasciite nécrosante" ar="سكور LRINEC — التهاب اللفافة الناخر" /></h1>
      </header>
      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        {ROWS.map((r) => (
          <fieldset key={r.id}>
            <legend className="mb-1.5 text-sm font-black text-blue-500">
              <T fr={r.label.fr} ar={r.label.ar} /> <span className="font-semibold opacity-60">(<T fr={r.hint.fr} ar={r.hint.ar} />)</span>
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {r.opts.map((o) => {
                const on = sel[r.id] === o.id;
                return (
                  <button key={o.id} onClick={() => { setSel((p) => ({ ...p, [r.id]: o.id })); trackEvent("calculator_use", { id: "lrinec" }); }}
                    className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${on ? "border-blue-600 bg-blue-600/15 text-blue-400" : "border-line hover:bg-surface2"}`}>
                    <T fr={o.fr} ar={o.ar} />{o.pts > 0 && ` (+${o.pts})`}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
        <div className={`rounded-2xl p-5 text-center text-white ${band.cls}`}>
          <p className="text-5xl font-black tabular-nums">{score}</p>
          <p className="mt-2 font-bold">{lang === "ar" ? band.ar : band.fr}</p>
        </div>
        <button onClick={() => setSel({ crp: "c0", gb: "g0", hb: "h0", na: "n0", creat: "k0", glu: "s0" })}
          className="touch self-start rounded-xl border border-line px-5 py-2 font-semibold hover:bg-surface2">
          <T fr="Réinitialiser" ar="تصفير" />
        </button>
      </div>
    </div>
  );
}

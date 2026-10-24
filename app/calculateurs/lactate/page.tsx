"use client";
// Lactate : biomarqueur non spécifique, valeur + évolution ; SSC 2026, recommandations adultes.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Gauge } from "lucide-react";

function Num({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit?: string }) {
  return (
    <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
      <span className="text-xs font-black opacity-70">{label}{unit ? ` (${unit})` : ""}</span>
      <input type="number" inputMode="decimal" step="0.1" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-lg font-black tabular-nums outline-none" dir="ltr" />
    </label>
  );
}

export default function LactatePage() {
  useRegisterRecent("calculateur:lactate");
  const { lang } = useApp();
  const [l1, setL1] = useState("");
  const [l2, setL2] = useState("");

  const r = useMemo(() => {
    const A = parseFloat(l1), B = parseFloat(l2);
    const init = Number.isFinite(A) ? A : null;
    const band = init === null ? 0 : init < 2 ? 1 : init < 4 ? 2 : 3;
    const clearance = init !== null && init > 0 && Number.isFinite(B) ? Math.round(((init - B) / init) * 100) : null;
    return { init, band, clearance, any: init !== null };
  }, [l1, l2]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Gauge className="h-6 w-6" />}
        title={lang === "ar" ? "اللاكتات: القيمة والتطور" : "Lactate : valeur et évolution"}
        sub={lang === "ar" ? "مؤشر غير نوعي؛ لا يشخّص الإنتان ولا يحدد السوائل أو المضاد وحده." : "Marqueur non spécifique : ne diagnostique pas le sepsis et ne décide pas seul des fluides ou antibiotiques."}
      />

      <section className="grid grid-cols-2 gap-2">
        <Num label={lang === "ar" ? "اللاكتات الأول" : "Lactate initial"} unit="mmol/L" value={l1} onChange={setL1} />
        <Num label={lang === "ar" ? "لاكتات المتابعة" : "Lactate de contrôle"} unit="mmol/L" value={l2} onChange={setL2} />
      </section>

      {r.any ? (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.band === 3 ? "sev-critical" : r.band === 2 ? "sev-urgent" : "sev-standard"}`}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-base font-black">
              {r.band === 3 ? <T fr="Lactate très élevé — évaluation urgente" ar="لاكتات مرتفع جداً — تقييم عاجل" />
                : r.band === 2 ? <T fr="Lactate élevé" ar="لاكتات مرتفع" />
                  : <T fr="Lactate inférieur à 2 mmol/L" ar="لاكتات أقل من 2 ممول/ل" />}
            </p>
            <Badge tone={r.band === 3 ? "critical" : r.band === 2 ? "urgent" : "standard"}>
              <span dir="ltr">{r.init} mmol/L</span>
            </Badge>
          </div>
          <ul className="flex flex-col gap-2 text-sm font-bold">
            <li>
              {r.band === 1 ? <T fr="Une valeur <2 n'exclut ni sepsis ni hypoperfusion ; l'interpréter avec l'examen clinique." ar="قيمة أقل من 2 لا تنفي الإنتان ولا نقص التروية؛ فسّرها مع الفحص السريري." />
                : r.band === 2 ? <T fr="Entre 2 et 4 : rechercher les causes possibles (infection, hypoperfusion, convulsions, médicaments, atteinte hépatique) et réévaluer le patient ; ne pas décider des fluides sur ce chiffre seul." ar="بين 2 و4: ابحث عن الأسباب المحتملة (عدوى، نقص تروية، اختلاجات، أدوية، إصابة كبدية) وأعد تقييم المريض؛ لا تحدد السوائل من هذه القيمة وحدها." />
                  : <T fr="≥4 : résultat préoccupant mais non spécifique — évaluer immédiatement les causes et la perfusion. Si un adulte présente une hypoperfusion induite par le sepsis ou un choc septique, SSC 2026 suggère ≥30 mL/kg de cristalloïdes IV dans les 3 premières heures, avec poids adapté et réévaluations fréquentes ; ce chiffre de lactate seul ne déclenche ni fluides ni antibiotiques." ar="≥4: نتيجة مقلقة لكنها غير نوعية — قيّم الأسباب والتروية فوراً. إذا كان البالغ لديه نقص تروية ناجم عن الإنتان أو صدمة إنتانية، تقترح SSC 2026 ≥30 مل/كغ من البلّوريات وريدياً خلال أول 3 ساعات، مع اختيار الوزن المناسب وإعادة تقييم متكررة؛ ولا تؤدي قيمة اللاكتات وحدها إلى إعطاء السوائل أو المضادات." />}
            </li>
            {r.clearance !== null && (
              <li className="font-black text-blue-500">
                {lang === "ar"
                  ? `التغير النسبي/التصفية الحسابية منذ القياس الأول: ${r.clearance}% — وصف للاتجاه، وليس هدفاً علاجياً منفرداً.`
                  : `Variation relative / clairance calculée depuis la valeur initiale : ${r.clearance} % — décrit la tendance, sans constituer une cible thérapeutique isolée.`}
              </li>
            )}
            <li className="opacity-70">
              <T fr="Une variation ou une normalisation du lactate ne suffit pas, à elle seule, à guider la poursuite des fluides. Causes non septiques possibles : convulsions, metformine, insuffisance hépatique, hémopathies." ar="لا يكفي تغير اللاكتات أو عودته للطبيعي وحده لتوجيه استمرار السوائل. من الأسباب غير الإنتانية: الاختلاجات، الميتفورمين، قصور الكبد، وأمراض الدم." />
            </li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/calculateurs/sepsis-commandement" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Assistant sepsis" ar="مساعد الإنتان" /></Link>
            <Link href="/calculateurs/acide-base" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Acide-base" ar="حمضي-قاعدي" /></Link>
            <Link href="/calculateurs/transfusion" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Transfusion" ar="نقل الدم" /></Link>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Entrez le lactate initial." ar="أدخل اللاكتات الأولى." />
        </p>
      )}
      <p className="text-xs opacity-60">
        <T fr="Référence de sepsis : SSC 2026, recommandations adultes (SCCM)." ar="مرجع الإنتان: SSC 2026، توصيات البالغين (SCCM)." />
      </p>
    </div>
  );
}

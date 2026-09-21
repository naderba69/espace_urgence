"use client";
// v11.2-B — اللاكتات ومؤشر الإنتان المخبري : القيمة + معدل التصفية.
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
  const [pas, setPas] = useState("");

  const r = useMemo(() => {
    const A = parseFloat(l1), B = parseFloat(l2), P = parseFloat(pas);
    const init = Number.isFinite(A) ? A : null;
    const band = init === null ? 0 : init < 2 ? 1 : init < 4 ? 2 : 3;
    const clearance = init !== null && init > 0 && Number.isFinite(B) ? Math.round(((init - B) / init) * 100) : null;
    const hypoperfusion = init !== null && init >= 4;
    const shock = init !== null && init >= 4 && Number.isFinite(P) && P < 90;
    return { init, band, clearance, hypoperfusion, shock, any: init !== null };
  }, [l1, l2, pas]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Gauge className="h-6 w-6" />}
        title={lang === "ar" ? "اللاكتات والإنتان المخبري" : "Lactate et sepsis biologique"}
        sub={lang === "ar" ? "القيمة، الاتجاه، ومعدل التصفية بعد الإنعاش." : "Valeur, tendance et clairance après réanimation."}
      />

      <section className="grid grid-cols-2 gap-2">
        <Num label={lang === "ar" ? "اللاكتات الأول" : "Lactate initial"} unit="mmol/L" value={l1} onChange={setL1} />
        <Num label={lang === "ar" ? "اللاكتات المراقب (بعد الإنعاش)" : "Lactate de contrôle"} unit="mmol/L" value={l2} onChange={setL2} />
        <div className="col-span-2"><Num label={lang === "ar" ? "الضغط الانقباضي" : "PAS"} unit="mmHg" value={pas} onChange={setPas} /></div>
      </section>

      {r.any ? (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.shock || r.band === 3 ? "sev-critical" : r.band === 2 ? "sev-urgent" : "sev-standard"}`}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-base font-black">
              {r.shock ? <T fr="Choc avec hypoperfusion" ar="صدمة مع نقص إرواء" />
                : r.band === 3 ? <T fr="Hyperlactatémie sévère" ar="فرط لاكتات شديد" />
                  : r.band === 2 ? <T fr="Hyperlactatémie modérée" ar="فرط لاكتات متوسط" />
                    : <T fr="Lactate normal" ar="لاكتات طبيعي" />}
            </p>
            <Badge tone={r.shock || r.band === 3 ? "critical" : r.band === 2 ? "urgent" : "standard"}>
              <span dir="ltr">{r.init} mmol/L</span>
            </Badge>
          </div>
          <ul className="flex flex-col gap-1 text-sm font-bold">
            <li>
              {r.band === 1 ? <T fr="< 2: pas d'argument pour une hypoperfusion; ne pas répéter sans changement clinique." ar="< ٢: لا دليل على نقص إرواء؛ لا تكرر دون تغيّر سريري." />
                : r.band === 2 ? <T fr="2-4: rechercher l'origine (sepsis, hémorragie, médicaments); remplissage raisonné et réévaluation rapprochée." ar="٢-٤: ابحث عن السبب (إنتان، نزف، أدوية)؛ تعويض متعقل وإعادة تقييم قريبة." />
                  : <T fr="≥ 4: hypoperfusion — remplissage 30 mL/kg (sepsis), antibiothérapie dans l'heure, contrôle du saignement, réévaluation à 2 h." ar="≥ ٤: نقص إرواء — تعويض ٣٠ مل/كغ (إنتان)، مضاد حيوي خلال ساعة، ضبط النزف، إعادة تقييم بعد ساعتين." />}
            </li>
            {r.clearance !== null && (
              <li className="font-black" style={{ color: r.clearance >= 10 ? "var(--accent)" : "var(--sev-urgent)" }}>
                {lang === "ar"
                  ? `تصفية اللاكتات ${r.clearance}% (الهدف > ١٠-٢٠٪) — ${r.clearance >= 10 ? "استجابة مقبولة" : "استمرار نقص الإرواء: كرر التقوية"}.`
                  : `Clairance ${r.clearance} % (cible > 10-20 %) — ${r.clearance >= 10 ? "réponse acceptable" : "hypoperfusion persistante : renforcer le remplissage"}.`}
              </li>
            )}
            <li className="opacity-70">
              <T fr="Lactate normal n'exclut pas le sepsis; causes non septiques: convulsions, metformine, insuffisance hépatique, hémopathies." ar="اللاكتات الطبيعي لا ينفي الإنتان؛ أسباب غير إنتانية: اختلاج، ميتفورمين، فشل كبدي، أمراض دموية." />
            </li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/calculateurs/sepsis-commandement" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Bundle heure-1" ar="حزمة الساعة الأولى" /></Link>
            <Link href="/calculateurs/acide-base" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Acide-base" ar="حمضي-قاعدي" /></Link>
            <Link href="/calculateurs/transfusion" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Transfusion" ar="نقل الدم" /></Link>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Entrez le lactate initial." ar="أدخل اللاكتات الأولى." />
        </p>
      )}
    </div>
  );
}

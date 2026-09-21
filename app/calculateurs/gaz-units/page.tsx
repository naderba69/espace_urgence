"use client";
// v11.3-B — تحويل وحدات الغازات : mmHg ↔ kPa مع عتبات مرجعية.
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Scale, ArrowLeftRight } from "lucide-react";

const KPA = 0.1333; // 1 mmHg = 0.1333 kPa

const REFS: { label: string; mmhg: number }[] = [
  { label: "PaO2 hypoxémie limite", mmhg: 60 },
  { label: "PaO2 normale basse", mmhg: 80 },
  { label: "PaO2 normale", mmhg: 95 },
  { label: "PaCO2 normale basse", mmhg: 35 },
  { label: "PaCO2 normale", mmhg: 40 },
  { label: "PaCO2 hypercapnie", mmhg: 50 },
  { label: "PaCO2 narcose", mmhg: 70 },
  { label: "Pression partielle O2 air", mmhg: 100 },
];

export default function GazUnitsPage() {
  useRegisterRecent("calculateur:gaz-units");
  const { lang } = useApp();
  const [mmhg, setMmhg] = useState("");
  const [kpa, setKpa] = useState("");
  const [srcMmhg, setSrcMmhg] = useState(true);

  const setFromMmhg = (v: string) => {
    setMmhg(v); setSrcMmhg(true);
    const n = parseFloat(v);
    setKpa(Number.isFinite(n) ? (Math.round(n * KPA * 100) / 100).toString() : "");
  };
  const setFromKpa = (v: string) => {
    setKpa(v); setSrcMmhg(false);
    const n = parseFloat(v);
    setMmhg(Number.isFinite(n) ? (Math.round(n / KPA)).toString() : "");
  };

  const val = parseFloat(srcMmhg ? mmhg : String(parseFloat(kpa) / KPA));
  const band = Number.isFinite(val) ? (val < 40 ? 3 : val < 60 ? 2 : val < 80 ? 1 : 0) : null;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Scale className="h-6 w-6" />}
        title={lang === "ar" ? "تحويل وحدات الغازات" : "Conversion des unités gazeuses"}
        sub={lang === "ar" ? "mmHg ↔ kPa مع العتبات التي تقرأها المختبرات." : "mmHg ↔ kPa avec les seuils qu'utilisent les laboratoires."}
      />

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
          <span className="text-xs font-black opacity-70">mmHg (torr)</span>
          <input type="number" inputMode="decimal" step="1" value={mmhg} onChange={(e) => setFromMmhg(e.target.value)}
            className="w-full bg-transparent text-lg font-black tabular-nums outline-none" dir="ltr" />
        </label>
        <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
          <span className="text-xs font-black opacity-70">kPa</span>
          <input type="number" inputMode="decimal" step="0.1" value={kpa} onChange={(e) => setFromKpa(e.target.value)}
            className="w-full bg-transparent text-lg font-black tabular-nums outline-none" dir="ltr" />
        </label>
      </div>
      <p className="flex items-center gap-2 text-xs font-bold opacity-70"><ArrowLeftRight className="h-4 w-4" aria-hidden /> <T fr="Tapez dans l'une des deux cases: l'autre se met à jour." ar="اكتب في أحد الحقلين: يتحدّث الآخر تلقائياً." /></p>

      {band !== null && (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${band === 3 ? "sev-critical" : band === 2 ? "sev-urgent" : band === 1 ? "sev-standard" : ""}`}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-black">
              {band === 3 ? <T fr="Valeur très basse: hypoxémie sévère / hypercapnie dangereuse" ar="قيمة منخفضة جداً: نقص أكسجة شديد أو فرط كربون خطر" />
                : band === 2 ? <T fr="Valeur basse: hypoxémie" ar="قيمة منخفضة: نقص أكسجة" />
                  : band === 1 ? <T fr="Limite basse: à corréler avec l'âge et le contexte" ar="حدّ منخفض: قارن مع العمر والسياق" />
                    : <T fr="Zone habituelle pour un adulte en air" ar="نطاق معتاد لبالغ بالهواء" />}
            </p>
            <Badge tone={band === 3 ? "critical" : band === 2 ? "urgent" : "neutral"}>
              <span dir="ltr">{Math.round(val)} mmHg · {(val * KPA).toFixed(1)} kPa</span>
            </Badge>
          </div>
          {band >= 2 && (
            <p className="mt-1 text-sm font-bold opacity-80">
              <T fr="Corréler à la clinique: O2, ventilation, gaz répétés. Les seuils kV varient selon l'altitude et la température." ar="قارن مع الحالة: أكسجين، تهوية، إعادة الغازات. العتبات تتغيّر بالارتفاع والحرارة." />
            </p>
          )}
        </div>
      )}

      <section className="flex flex-col gap-2">
        <p className="text-base font-black"><T fr="Repères à connaître" ar="مراجع يجب حفظها" /></p>
        <ul className="flex flex-col gap-2">
          {REFS.map((r) => (
            <li key={r.label} className="card flex items-center justify-between gap-2 rounded-2xl border border-line bg-surface p-3">
              <span className="text-sm font-bold">{r.label}</span>
              <span className="flex gap-2 text-xs font-black tabular-nums">
                <Badge tone="neutral"><span dir="ltr">{r.mmhg} mmHg</span></Badge>
                <Badge tone="standard"><span dir="ltr">{(r.mmhg * KPA).toFixed(1)} kPa</span></Badge>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="rounded-xl border border-dashed border-line p-3 text-xs opacity-70">
        <T fr="Autres conversions usuelles: HCO3 1 mEq/L = 1 mmol/L; base excess en mmol/L; COHb et MetHb en %; lactate mg/dL / 9 = mmol/L." ar="تحويلات شائعة أخرى: HCO3 ١ مكافئ/ل = ١ ملّيمول/ل؛ الفائض القاعدي بالملّيمول/ل؛ COHb وMetHb بالنسبة المئوية؛ لاكتات mg/dL ÷ ٩ = mmol/L." />
      </p>

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/gaz-advanced" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Lecture avancée (A-a, P/F)" ar="القراءة المتقدمة (A-a، P/F)" /></Link>
        <Link href="/calculateurs/convertisseur" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Convertisseur général" ar="المحوّل العام" /></Link>
      </div>
    </div>
  );
}

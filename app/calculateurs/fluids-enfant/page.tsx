"use client";
// v2.0 — سوائل الطفل : هوليداي-سيغار + عجز التجفاف.
import { useState } from "react";
import { hollidaySegar, dehydrationDeficit } from "@/lib/calc";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import PageHeader from "@/components/ui/PageHeader";
import { Droplets } from "lucide-react";
import { NumField } from "@/components/tools/ui";

export default function FluidsEnfantPage() {
  const [weight, setWeight] = useState("12");
  const [pct, setPct] = useState("5");
  useRegisterRecent("calculateur:fluids-enfant");
  const daily = hollidaySegar(Number(weight));
  const deficit = dehydrationDeficit(Number(pct), Number(weight));
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <PageHeader
        icon={<Droplets className="h-6 w-6" />}
        title={<T fr="Hydratation de l'enfant" ar="سوائل الطفل" />}
        sub={<T fr="Entretien 4-2-1 + bolus de réanimation." ar="صيانة ٤-٢-١ + دفعات إنعاش." />}
      />
      <div className="card rounded-2xl border border-line bg-surface p-4 text-sm font-bold">
        <p className="mb-1 text-base font-black" style={{ color: "var(--accent)" }}><T fr="Bolus de réanimation" ar="دفعات الإنعاش" /></p>
        <p><T fr="Enfant: NaCl 0,9 % 20 mL/kg en 5-10 min, réévaluer." ar="طفل: ملح ٠٫٩٪ ٢٠ مل/كغ خلال ٥-١٠ د ثم أعد التقييم." /></p>
        <p><T fr="Adulte sepsis: 30 mL/kg de cristalloïdes dans la première heure." ar="بالغ (إنتان): ٣٠ مل/كغ بلورات خلال الساعة الأولى." /></p>
        <p><T fr="TRAUMA crânien: éviter surcharge; choc hémorragique = sang tôt." ar="رض رأس: تجنّب فرط الحمولة؛ صدمة نزفية = دم مبكراً." /></p>
      </div>
      </header>
      <div className="card grid grid-cols-2 gap-3 rounded-2xl border border-line bg-surface p-4">
        <NumField label={<T fr="Poids (kg)" ar="الوزن (كغ)" />} value={weight} onChange={setWeight} />
        <NumField label={<T fr="Déshydratation (%)" ar="التجفاف (%)" />} value={pct} onChange={setPct} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="card rounded-2xl border border-blue-600/40 bg-blue-600/10 p-4">
          <p className="text-xs font-bold text-blue-500"><T fr="Entretien (Holliday-Segar)" ar="الاستمرارية (هوليداي-سيغار)" /></p>
          <p className="text-3xl font-black tabular-nums" dir="ltr">{daily} mL/j</p>
          <p className="text-lg font-black tabular-nums opacity-80" dir="ltr">≈ {Math.round(daily / 24)} mL/h</p>
        </div>
        <div className="card rounded-2xl border border-line bg-surface p-4">
          <p className="text-xs font-bold opacity-70"><T fr="Déficit à remplacer" ar="العجز المطلوب تعويضه" /></p>
          <p className="text-3xl font-black tabular-nums" dir="ltr">{deficit} mL</p>
          <p className="text-xs opacity-60"><T fr="sur 24 h en plus de l'entretien" ar="على 24 ساعة زيادة على الاستمرارية" /></p>
        </div>
      </div>
      <p className="text-sm font-semibold opacity-80">
        <T fr="Choc: bolus 20 mL/kg isotonique, réévaluer après chaque bolus." ar="الصدمة: دفعات 20 مل/كغ من محلول متساوي التوتر مع إعادة التقييم بعد كل دفعة." />
      </p>
    </div>
  );
}

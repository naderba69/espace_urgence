"use client";
// v10.0-A5 — لوحة الجرعات الحرجة بالأطفال : وزن مكتوب → جرعات محسوبة بسقوفها.
import { useMemo, useState } from "react";
import Link from "next/link";
import NumStepper from "@/components/ui/NumStepper";
import { useApp, usePrefillPatient } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import T from "@/components/T";
import { Baby } from "lucide-react";

type Row = { fr: string; ar: string; ruleFr: string; ruleAr: string; per: number; cap: number; unit: string; min?: number; sev: 1 | 2 | 3 };

const ROWS: Row[] = [
  { fr: "Adrénaline RCP (IV/IO)", ar: "أدرينالين إنعاش (وريدي/داخلي)", ruleFr: "0,01 mg/kg — max 1 mg", ruleAr: "٠٫٠١ مغ/كغ — حد ١ مغ", per: 0.01, cap: 1, unit: "mg", sev: 1 },
  { fr: "Adrénaline anaphylaxie (IM)", ar: "أدرينالين تأق (عضلي)", ruleFr: "0,01 mg/kg — max 0,5 mg", ruleAr: "٠٫٠١ مغ/كغ — حد ٠٫٥ مغ", per: 0.01, cap: 0.5, unit: "mg", sev: 1 },
  { fr: "Amiodarone (FV/TV sans pouls)", ar: "أميودارون (رجفان/تسرع بلا نبض)", ruleFr: "5 mg/kg — max 300 mg", ruleAr: "٥ مغ/كغ — حد ٣٠٠ مغ", per: 5, cap: 300, unit: "mg", sev: 1 },
  { fr: "Atropine (bradycardie)", ar: "أتروبين (بطء القلب)", ruleFr: "0,02 mg/kg — min 0,1 / max 0,5 mg", ruleAr: "٠٫٠٢ مغ/كغ — حد أدنى ٠٫١ وأقصى ٠٫٥", per: 0.02, cap: 0.5, unit: "mg", min: 0.1, sev: 2 },
  { fr: "Adénosine (TSV)", ar: "أدينوزين (تسرع فوق بطيني)", ruleFr: "0,1 mg/kg 1re dose — max 6 mg (2e : 0,2 max 12)", ruleAr: "٠٫١ مغ/كغ الجرعة الأولى — حد ٦ مغ", per: 0.1, cap: 6, unit: "mg", sev: 2 },
  { fr: "Sulfate de magnésium (asthme grave)", ar: "كبريتات المغنيزيوم (ربو شديد)", ruleFr: "40 mg/kg — max 2 g", ruleAr: "٤٠ مغ/كغ — حد ٢ غ", per: 40, cap: 2000, unit: "mg", sev: 2 },
  { fr: "Midazolam (convulsion buccal)", ar: "ميدازولام (اختلاج فموي)", ruleFr: "0,3 mg/kg — max 10 mg", ruleAr: "٠٫٣ مغ/كغ — حد ١٠ مغ", per: 0.3, cap: 10, unit: "mg", sev: 1 },
  { fr: "Diazépam (IR)", ar: "ديازيبام (شرجي)", ruleFr: "0,5 mg/kg — max 20 mg", ruleAr: "٠٫٥ مغ/كغ — حد ٢٠ مغ", per: 0.5, cap: 20, unit: "mg", sev: 1 },
  { fr: "Kétamine (analgésie IV)", ar: "كيتامين (تسكين وريدي)", ruleFr: "0,5 mg/kg — max 50 mg", ruleAr: "٠٫٥ مغ/كغ — حد ٥٠ مغ", per: 0.5, cap: 50, unit: "mg", sev: 3 },
  { fr: "Morphine (titrée IV)", ar: "مورفين (معاير وريدي)", ruleFr: "0,05-0,1 mg/kg — max 5 mg", ruleAr: "٠٫٠٥-٠٫١ مغ/كغ — حد ٥ مغ", per: 0.1, cap: 5, unit: "mg", sev: 2 },
  { fr: "Sérum glucosé 10 % (hypoglycémie)", ar: "غلوكوز ١٠٪ (نقص سكر)", ruleFr: "2 mL/kg (= 0,2 g/kg)", ruleAr: "٢ مل/كغ (= ٠٫٢ غ/كغ)", per: 2, cap: 500, unit: "mL", sev: 1 },
  { fr: "NaCl 0,9 % (bolus)", ar: "ملح ٠٫٩٪ (دفعة)", ruleFr: "20 mL/kg — max 1000 mL", ruleAr: "٢٠ مل/كغ — حد ١٠٠٠ مل", per: 20, cap: 1000, unit: "mL", sev: 2 },
  { fr: "Naloxone", ar: "نالوكسون", ruleFr: "0,1 mg/kg — max 2 mg", ruleAr: "٠٫١ مغ/كغ — حد ٢ مغ", per: 0.1, cap: 2, unit: "mg", sev: 1 },
  { fr: "Ceftriaxone (sepsis)", ar: "سيفترياكسون (إنتان)", ruleFr: "50 mg/kg — max 2 g", ruleAr: "٥٠ مغ/كغ — حد ٢ غ", per: 50, cap: 2000, unit: "mg", sev: 2 },
  { fr: "Paracétamol (IV)", ar: "باراسيتامول (وريدي)", ruleFr: "15 mg/kg — max 1 g", ruleAr: "١٥ مغ/كغ — حد ١ غ", per: 15, cap: 1000, unit: "mg", sev: 3 },
  { fr: "Salbutamol nébulisé", ar: "سالبوتامول بالرذاذ", ruleFr: "0,15 mg/kg — min 2,5 / max 5 mg", ruleAr: "٠٫١٥ مغ/كغ — من ٢٫٥ إلى ٥ مغ", per: 0.15, cap: 5, unit: "mg", min: 2.5, sev: 2 },
];

const round = (v: number) => (v >= 100 ? Math.round(v) : v >= 10 ? Math.round(v * 10) / 10 : Math.round(v * 100) / 100);

export default function DosesPedPage() {
  useRegisterRecent("calculateur:doses-ped");
  const { lang } = useApp();
  const [w, setW] = useState("");
  usePrefillPatient((p) => {
    if (!w && p.w) setW(p.w);
  });
  const kg = parseFloat(w);
  const ok = Number.isFinite(kg) && kg > 0;
  const rows = useMemo(() => ROWS.map((r) => {
    if (!ok) return { ...r, val: null as number | null };
    let val = r.per * kg;
    if (r.min !== undefined) val = Math.max(val, r.min);
    val = Math.min(val, r.cap);
    return { ...r, val: round(val) };
  }), [ok, kg]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Baby className="h-6 w-6" />}
        title={lang === "ar" ? "لوحة الجرعات الحرجة بالأطفال" : "Doses critiques pédiatriques"}
        sub={lang === "ar" ? "اكتب الوزن — الجرعات تُحسب بسقوفها فوراً." : "Entrez le poids — doses calculées avec plafonds."}
      />

      <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
        <span className="text-xs font-black opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></span>
        <NumStepper value={ w } onValue={ setW } step={ 0.1 } className="w-full bg-transparent text-2xl font-black tabular-nums outline-none" label="w" />
      </label>

      {ok ? (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => (
            <li key={r.fr} className={`card sev-strip flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-3 ${r.sev === 1 ? "sev-critical" : r.sev === 2 ? "sev-urgent" : "sev-standard"}`}>
              <div>
                <p className="text-sm font-black">{lang === "ar" ? r.ar : r.fr}</p>
                <p className="text-xs opacity-70">{lang === "ar" ? r.ruleAr : r.ruleFr}</p>
              </div>
              <p className="shrink-0 text-lg font-black tabular-nums" dir="ltr">
                {r.val} <span className="text-xs opacity-70">{r.unit}</span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Entrez un poids pour calculer." ar="أدخل وزناً للحساب." />
        </p>
      )}

      <div className="card flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 text-sm font-bold">
        <p className="font-black" style={{ color: "var(--sev-critical)" }}><T fr="Perfusions continues" ar="التسريب المستمر" /></p>
        <p><T fr="Adrénaline: 0,05-0,3 µg/kg/min · Dopamine: 5-10 µg/kg/min · Table de débit →" ar="أدرينالين: ٠٫٠٥-٠٫٣ مكغ/كغ/د · دوبامين: ٥-١٠ مكغ/كغ/د · جدول السرعة →" /></p>
        <p><T fr="Vérifier max local; doubler le contrôle si < 10 kg; jamais > 10× la dose." ar="تحقق من السقوف المحلية؛ ضاعف المراقبة إن كان < ١٠ كغ؛ لا تتجاوز عشرة أضعاف الجرعة." /></p>
        <div className="flex flex-wrap gap-2">
          <Link href="/calculateurs/debit-perfusion" className="rounded-full border px-4 py-2 text-sm font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
            <T fr="Table de débit" ar="جدول السرعة" />
          </Link>
          <Link href="/calculateurs/broselow" className="rounded-full border px-4 py-2 text-sm font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
            <T fr="Broselow (bandes)" ar="بروسلو" />
          </Link>
        </div>
      </div>
    </div>
  );
}

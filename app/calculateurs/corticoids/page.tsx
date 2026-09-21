"use client";
// v12.2-A — Corticoïdes : équivalence glucocorticoïde, activité minéralocorticoïde, dose de stress.
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Flame } from "lucide-react";
import { useState } from "react";

const STEROIDS: { id: string; fr: string; ar: string; eq: number; min: string; dur: string }[] = [
  { id: "hydro", fr: "Hydrocortisone", ar: "هيدروكورتيزون", eq: 1, min: "+++", dur: "8-12 h" },
  { id: "pred", fr: "Prédnisone / Prédnisolone", ar: "بريدنيزون/بريدنيزولون", eq: 4, min: "+ (0,8)", dur: "18-36 h" },
  { id: "methyl", fr: "Méthylprednisolone", ar: "ميثيلبريدنيزولون", eq: 5, min: "0", dur: "18-36 h" },
  { id: "beta", fr: "Bétaméthasone", ar: "بيتاميثازون", eq: 25, min: "0", dur: "36-54 h" },
  { id: "dexa", fr: "Dexaméthasone", ar: "ديكساميثازون", eq: 25, min: "0", dur: "36-54 h" },
];

export default function CorticoidsPage() {
  useRegisterRecent("calculateur:corticoids");
  const { lang } = useApp();
  const [sel, setSel] = useState("pred");
  const [d, setD] = useState("");

  const st = STEROIDS.find((s) => s.id === sel) ?? STEROIDS[0];
  const D = parseFloat(d);
  const has = Number.isFinite(D) && D > 0;
  const eqOf = (s: { eq: number }) => {
    if (!has) return null;
    const v = (D / st.eq) * s.eq;
    return v >= 10 ? Math.round(v) : Math.round(v * 10) / 10;
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Flame className="h-6 w-6" />}
        title={lang === "ar" ? "مكافئات الكورتيزون" : "Équivalences des corticoïdes"}
        sub={lang === "ar" ? "التحويل بين الجزيئات، الفعالية المعدنية، وجرعة الإجهاد." : "Conversion entre molécules, activité minéralo et dose de stress."}
      />

      <section className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
          <span className="text-xs font-black opacity-70"><T fr="Molécule de départ" ar="الجزيء الأصلي" /></span>
          <select value={sel} onChange={(e) => setSel(e.target.value)} className="w-full bg-transparent text-sm font-black outline-none">
            {STEROIDS.map((s) => <option key={s.id} value={s.id} className="bg-surface">{lang === "ar" ? s.ar : s.fr}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
          <span className="text-xs font-black opacity-70"><T fr="Dose (mg/j)" ar="الجرعة (مغ/يوم)" /></span>
          <input type="number" inputMode="decimal" value={d} onChange={(e) => setD(e.target.value)} className="w-full bg-transparent text-lg font-black tabular-nums outline-none" dir="ltr" />
        </label>
      </section>

      {has && (
        <div className="card rounded-2xl border border-line bg-surface p-4">
          <p className="text-base font-black"><T fr="Équivalents glucocorticoïdes" ar="المكافئات الجلوكوكورتيكويدية" /></p>
          <ul className="mt-2 flex flex-col gap-2">
            {STEROIDS.map((s) => {
              const v = eqOf(s);
              return (
                <li key={s.id} className={`flex items-center justify-between gap-2 rounded-xl border p-2 text-sm font-black ${s.id === sel ? "border-line bg-surface2" : "border-transparent"}`}>
                  <span>{lang === "ar" ? s.ar : s.fr}</span>
                  <span className="flex items-center gap-2">
                    <Badge tone={s.min === "+++" ? "urgent" : "neutral"}>{lang === "ar" ? `فعالية معدنية ${s.min}` : `minéralo ${s.min}`}</Badge>
                    <span className="tabular-nums" dir="ltr">{v === null ? "—" : `${v} mg`}{s.id === sel ? " ✓" : ""}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs font-bold opacity-70">
            <T fr="Demi-vie biologique courte (hydrocortisone) → répartir les prises; longue (dexa/béta) → une prise le matin." ar="عمر قصير (هيدروكورتيزون) ← قسم الجرعات؛ طويل (ديكسا/بيتا) ← جرعة صباحية واحدة." />
          </p>
        </div>
      )}

      <section className="card sev-strip sev-critical rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center gap-2"><Badge tone="critical"><T fr="Insuffisance surrénale aiguë" ar="قصور سدادي حاد" /></Badge></div>
        <p className="mt-2 text-sm font-black" dir="ltr">Hydrocortisone 100 mg IV puis 200 mg/24 h</p>
        <p className="mt-1 text-sm font-bold opacity-80">
          <T fr="Jamais de dexaméthasone seule: couverture minéralocorticoïde nulle + NaCl 0,9 % si hypotension." ar="أبداً ديكساميثازون وحده: لا فعالية معدنية + ملح ٠٫٩٪ عند انخفاض الضغط." />
        </p>
      </section>

      <section className="card sev-strip sev-urgent rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center gap-2"><Badge tone="urgent"><T fr="Choc septique" ar="الصدمة الإنتانية" /></Badge></div>
        <p className="mt-2 text-sm font-black" dir="ltr">Hydrocortisone 200 mg/j</p>
        <p className="mt-1 text-sm font-bold opacity-80">
          <T fr="Si PAS < 65 malgré remplissage + noradrénaline suffisante." ar="إذا الضغط < ٦٥ رغم التعبئة والنورأدرينالين الكافي." />
        </p>
      </section>

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <p className="text-base font-black"><T fr="Effets à surveiller" ar="الأثار المراقبة" /></p>
        <ul className="mt-2 flex flex-col gap-1 text-sm font-bold">
          <li><T fr="Glycémie (surtout diabétique), TA, sommeil et humeur." ar="الغلوكوز (خاصة في السكري)، الضغط، النوم والمزاج." /></li>
          <li><T fr="IPP si facteur de risque digestif; infection atypique." ar="مثبط مضخة إذا خطر هضمي؛ عدوى غير نمطية." /></li>
          <li><T fr="Arrêt progressif si > 3 semaines (suppression surrénale)." ar="إيقاف تدريجي إذا > ٣ أسابيع (كبت سدادي)." /></li>
          <li><T fr="Préférence le matin si dose > 20 mg équivalent prednisone." ar="يفضّل صباحاً إذا الجرعة > ٢٠ مغ مكافئ بريدنيزون." /></li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/sepsis-commandement" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Sepsis" ar="الإنتان" /></Link>
        <Link href="/calculateurs/interactions" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Interactions (AINS)" ar="التفاعلات (الأدوية المضادة للالتهاب)" /></Link>
      </div>
    </div>
  );
}

"use client";
// v12.2-A — Fluides et sodium : besoins d'entretien, contenu ionique des solutés, stratégie par situation.
import Link from "next/link";
import NumStepper from "@/components/ui/NumStepper";
import { useApp, usePrefillPatient } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Droplets } from "lucide-react";
import { useState } from "react";

const FLUIDS: { fr: string; ar: string; na: number; k: number; cl: number; tone: "critical" | "urgent" | "standard" | "neutral" }[] = [
  { fr: "NaCl 0,9 %", ar: "ملح ٠٫٩٪", na: 154, k: 0, cl: 154, tone: "neutral" },
  { fr: "NaCl 0,45 %", ar: "ملح ٠٫٤٥٪", na: 77, k: 0, cl: 77, tone: "neutral" },
  { fr: "Ringer lactate", ar: "رينغر لاكتات", na: 130, k: 4, cl: 109, tone: "standard" },
  { fr: "Plasmalyte", ar: "بلازماليت", na: 140, k: 5, cl: 98, tone: "standard" },
  { fr: "Glucosé 5 %", ar: "غلوكوز ٥٪", na: 0, k: 0, cl: 0, tone: "neutral" },
  { fr: "Bicarbonate 1,4 %", ar: "بيكربونات ١٫٤٪", na: 167, k: 0, cl: 0, tone: "urgent" },
  { fr: "NaCl 3 % (hypertonique)", ar: "ملح ٣٪ مفرط التوتر", na: 513, k: 0, cl: 513, tone: "critical" },
  { fr: "NaCl 10 %", ar: "ملح ١٠٪", na: 1700, k: 0, cl: 1700, tone: "critical" },
  { fr: "Albumine 4 %", ar: "ألبيومين ٤٪", na: 140, k: 0, cl: 0, tone: "neutral" },
];

const SITUATIONS: { fr: string; ar: string; sev: string; txt: { fr: string; ar: string } }[] = [
  { fr: "Choc septique", ar: "الصدمة الإنتانية", sev: "sev-critical",
    txt: { fr: "Cristalloïde équilibré 30 mL/kg, puis noradrénaline précoce; éviter l'excès de NaCl 0,9 % (hyperchlorémie).", ar: "بلورات متوازنة ٣٠ مل/كغ ثم نورأدرينالين مبكراً؛ تجنّب إفراط الملح ٠٫٩٪ (فرط الكلور)." } },
  { fr: "Acido-cétose diabétique", ar: "الحماض الكيتوني السكري", sev: "sev-urgent",
    txt: { fr: "NaCl 0,9 % 15-20 mL/kg la 1re heure, puis selon sodium corrigé (0,45 % si Na élevé) + insuline et potassium.", ar: "ملح ٠٫٩٪ ١٥-٢٠ مل/كغ الساعة الأولى ثم حسب الصوديوم المصحح (٠٫٤٥٪ إذا مرتفع) + أنسولين وبوتاسيوم." } },
  { fr: "Hypertension intracrânienne / TCC", ar: "فرط الضغط داخل القحف/رأس الرضح", sev: "sev-critical",
    txt: { fr: "NaCl 3 % (bolus 250 mL) ou mannitol 20 %; isosmolaire chez le patient: pas de solutés hypotoniques.", ar: "ملح ٣٪ (بولوس ٢٥٠ مل) أو مانيتول ٢٠٪؛ متساوي التوتر للمريض: لا محلولات منخفضة التوتر." } },
  { fr: "Brûlures", ar: "الحروق", sev: "sev-urgent",
    txt: { fr: "Ringer lactate selon la formule de Parkland (voir page brûlures).", ar: "رينغر لاكتات حسب معادلة باركلاند (صفحة الحروق)." } },
  { fr: "Cirrhose: ponction > 5 L / hémorragie", ar: "تليّف: بزل > ٥ ل/نزف", sev: "sev-urgent",
    txt: { fr: "Albumine: 8 g par litre ponctionné; en cas d'hémorragie digestive avec spironolactone en cours, revoir le potassium.", ar: "ألبيومين ٨ غ لكل لتر مُبزَل؛ عند نزف هضمي مع سبيرونولاكتون راقب البوتاسيوم." } },
  { fr: "Hypovolémie avec hyponatrémie", ar: "نقص حجم مع نقص صوديوم", sev: "sev-urgent",
    txt: { fr: "NaCl 0,9 %; jamais d'hypotonique; correction lente (voir page sodium).", ar: "ملح ٠٫٩٪؛ أبداً محلول منخفض التوتر؛ تصحيح بطيء (صفحة الصوديوم)." } },
  { fr: "Insuffisance cardiaque / rénale", ar: "قصور قلبي/كلوي", sev: "sev-urgent",
    txt: { fr: "Bolus prudents, réévaluer après chaque 250-500 mL (risque de congestion).", ar: "بولوسات متحفظة، أعد التقييم بعد كل ٢٥٠-٥٠٠ مل (خطر الاحتقان)." } },
];

export default function FluidesSodiumPage() {
  useRegisterRecent("calculateur:fluides-sodium");
  const { lang } = useApp();
  const [w, setW] = useState("");
  usePrefillPatient((p) => {
    if (!w && p.w) setW(p.w);
  });
  const [sel, setSel] = useState("NaCl 0,9 %");
  const [vol, setVol] = useState("");

  const W = parseFloat(w);
  const hasW = Number.isFinite(W) && W > 0;
  const V = parseFloat(vol);
  const flu = FLUIDS.find((f) => f.fr === sel) ?? FLUIDS[0];
  const naTotal = Number.isFinite(V) && V > 0 ? (flu.na * V) : null;
  const kTotal = Number.isFinite(V) && V > 0 ? (flu.k * V) : null;
  const cell = "flex flex-col gap-1 rounded-xl border border-line bg-surface p-3";

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Droplets className="h-6 w-6" />}
        title={lang === "ar" ? "السوائل والصوديوم حسب الحالة" : "Fluides et sodium par situation"}
        sub={lang === "ar" ? "احتياجات الصيانة، محتوى المحاليل الأيوني، وأي سائل لأي وضع." : "Besoins d'entretien, contenu ionique des solutés et quel fluide pour quelle situation."}
      />

      <section className="grid grid-cols-2 gap-2">
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Poids (kg) — entretien" ar="الوزن — الصيانة" /></span>
          <NumStepper value={ w } onValue={ setW } className="w-full" label="w" /></label>
        <div className="rounded-xl border border-line bg-surface p-3 text-sm font-bold">
          {hasW ? (
            <ul className="flex flex-col gap-1" dir="ltr" style={{ textAlign: "start" }}>
              <li>Eau : {Math.round(W * 25)}-{Math.round(W * 30)} mL/j</li>
              <li>Na / K / Cl : {Math.round(W)} mmol/j chacun</li>
              <li>Glucose : 50-100 g/j</li>
            </ul>
          ) : <span className="opacity-70"><T fr="Poids → besoins 24 h." ar="الوزن ← احتياجات ٢٤ س." /></span>}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-sm font-black opacity-70"><T fr="Contenu ionique: volume (L) × soluté" ar="المحتوى الأيوني: الحجم (ل) × المحلول" /></p>
        <div className="grid grid-cols-2 gap-2">
          <label className={cell}>
            <span className="text-xs font-black opacity-70"><T fr="Soluté" ar="المحلول" /></span>
            <select value={sel} onChange={(e) => setSel(e.target.value)} className="w-full bg-transparent text-sm font-black outline-none">
              {FLUIDS.map((f) => <option key={f.fr} value={f.fr} className="bg-surface">{lang === "ar" ? f.ar : f.fr}</option>)}
            </select>
          </label>
          <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Volume (L)" ar="الحجم (ل)" /></span>
            <NumStepper value={ vol } onValue={ setVol } className="w-full" label="vol" /></label>
        </div>
        {naTotal !== null && (
          <div className="card sev-strip rounded-2xl border border-line bg-surface p-4 sev-standard">
            <div className="flex items-center justify-between gap-2">
              <p className="text-base font-black tabular-nums" dir="ltr">Na : {Math.round(naTotal)} mmol · K : {Math.round(kTotal ?? 0)} mmol</p>
              <Badge tone={flu.tone === "critical" ? "critical" : flu.tone === "urgent" ? "urgent" : flu.tone === "standard" ? "standard" : "neutral"}>
                {flu.tone === "critical" ? <T fr="Hypertonique" ar="مفرط التوتر" /> : <T fr="Par litre" ar="لكل لتر" />}
              </Badge>
            </div>
            <p className="mt-1 text-xs font-bold opacity-70" dir="ltr">{flu.fr} : Na {flu.na} · K {flu.k} · Cl {flu.cl} mmol/L</p>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-base font-black"><T fr="Situation → soluté" ar="الحالة ← المحلول" /></p>
        <ul className="flex flex-col gap-2">
          {SITUATIONS.map((s) => (
            <li key={s.fr} className={`card sev-strip rounded-2xl border border-line bg-surface p-3 ${s.sev}`}>
              <p className="text-sm font-black">{lang === "ar" ? s.ar : s.fr}</p>
              <p className="mt-1 text-sm font-bold opacity-85">{s.txt[lang === "ar" ? "ar" : "fr"]}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/sodium" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Troubles du sodium" ar="اضطرابات الصوديوم" /></Link>
        <Link href="/calculateurs/aki" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="AKI" ar="الفشل الكلوي" /></Link>
        <Link href="/calculateurs/sepsis-commandement" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Sepsis" ar="الإنتان" /></Link>
        <Link href="/calculateurs/brulures" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Brûlures" ar="الحروق" /></Link>
      </div>
    </div>
  );
}

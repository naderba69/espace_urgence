"use client";
// v12.2-A — Antiepileptiques en urgence : doses de charge, vitesse, pièges.
import NumStepper from "@/components/ui/NumStepper";
import { useApp, usePrefillPatient } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import T from "@/components/T";
import Link from "next/link";
import { Brain } from "lucide-react";
import { useState } from "react";

type Med = {
  id: string; fr: string; ar: string; perKg: number; max: number; unit: string;
  rate: { fr: string; ar: string }; warn: { fr: string; ar: string }[];
};

const MEDS: Med[] = [
  { id: "diazepam", fr: "Diazépam IV", ar: "ديازيبام وريدي", perKg: 0.2, max: 10, unit: "mg",
    rate: { fr: "≤ 5 mg/min", ar: "≤ ٥ مغ/د" },
    warn: [
      { fr: "Dépression respiratoire: monitorer, matériel d'intubation prêt.", ar: "اكتئاب تنفسي: راقب وجهّز التخديد." },
      { fr: "Répétable une fois; veine sûre (thrombophlébite).", ar: "يمكن تكراره مرة؛ وريد سليم (خثار)." },
    ] },
  { id: "midazolam", fr: "Midazolam IM / buccal", ar: "ميدازولام عضلي/تحت اللسان", perKg: 0.2, max: 10, unit: "mg",
    rate: { fr: "IM / buccal, hors voie IV", ar: "عضلي/بوكالي، خارج المسار الوريدي" },
    warn: [
      { fr: "Choix en préhospitalier et si accès veineux impossible.", ar: "الخيار قبل المستشفى أو إذا تعذّر الوريد." },
    ] },
  { id: "phenytoine", fr: "Phénytoïne IV", ar: "فينيتوين وريدي", perKg: 20, max: 1500, unit: "mg",
    rate: { fr: "≤ 50 mg/min (≤ 25 mg/min si > 60 ans ou cardiaque)", ar: "≤ ٥٠ مغ/د (≤ ٢٥ مغ/د إذا > ٦٠ س أو قلب)" },
    warn: [
      { fr: "Diluer UNIQUEMENT dans NaCl 0,9 % (cristaux dans le glucose) + filtre.", ar: "خفّف بملح ٠٫٩٪ فقط (بلورات في الغلوكوز) + فلتر." },
      { fr: "Surveiller rythme et TA; syndrome du gant violet si extravasation.", ar: "راقب النظم والضغط؛ متلازمة القفاز البنفسجي عند التسرّب." },
      { fr: "Nystagmus / ataxie = toxicité.", ar: "رأرأة/ترنّح = سمية." },
    ] },
  { id: "fosphenytoine", fr: "Fos-phénytoïne IV/IM", ar: "فوسفينيتوين", perKg: 20, max: 1500, unit: "mg ÉP",
    rate: { fr: "150 mg ÉP/min", ar: "١٥٠ مغ مكافئ/د" },
    warn: [
      { fr: "ÉP = équivalent phénytoïne; voie IM possible.", ar: "مكافئ فينيتوين؛ مسار عضلي ممكن." },
    ] },
  { id: "levetiracetam", fr: "Lévétiracétam IV", ar: "ليفيتيراسيتام", perKg: 60, max: 4500, unit: "mg",
    rate: { fr: "charge sur 5-15 min", ar: "التحميل على ٥-١٥ د" },
    warn: [
      { fr: "Adapter à la clairance rénale (voir bridge rénal).", ar: "كيّف مع التصفية الكلوية (انظر الجسر الكلوي)." },
      { fr: "Sédation possible.", ar: "تخدير ممكن." },
    ] },
  { id: "valproate", fr: "Acide valproïque IV", ar: "حمض الفالبروات", perKg: 40, max: 3000, unit: "mg",
    rate: { fr: "≤ 6 mg/kg/min", ar: "≤ ٦ مغ/كغ/د" },
    warn: [
      { fr: "JAMAIS chez la femme enceinte ou en âge de procréer sans impératif (voir page grossesse).", ar: "أبداً عند الحوامل أو النساء في سن الإنجاب إلا للضرورة القصوى (صفحة الحمل)." },
      { fr: "Contre-indiqué: maladie mitochondriale, trouble du cycle de l'urée, pancréatite.", ar: "ممنوع: مرض المتقدرات، اضطراب دورة اليوريا، التهاب البنكرياس." },
      { fr: "Hyperammonémie si somnolence inexpliquée.", ar: "فرط الأمونيوم إذا خمول غير مفهوم." },
    ] },
  { id: "phenobarbital", fr: "Phénobarbital IV", ar: "فينوباربيتال", perKg: 15, max: 1000, unit: "mg",
    rate: { fr: "≤ 75 mg/min", ar: "≤ ٧٥ مغ/د" },
    warn: [
      { fr: "Dépression respiratoire marquée: intubation fréquente.", ar: "اكتئاب تنفسي واضح: التخديد شائع." },
      { fr: "Sédation prolongée plusieurs heures.", ar: "خمول ممتد لساعات." },
    ] },
  { id: "lacosamide", fr: "Lacosamide IV", ar: "لاكوساميد", perKg: 0, max: 200, unit: "mg",
    rate: { fr: "bolus non dilué sur 3-5 min, répétable 200 mg", ar: "بولوس غير مخفّف على ٣-٥ د، يُكرّر ٢٠٠ مغ" },
    warn: [
      { fr: "Espace PR: surveiller l'ECG.", ar: "مسار PR: راقب تخطيط القلب." },
    ] },
];

export default function AntiepileptiquesPage() {
  useRegisterRecent("calculateur:antiepileptiques");
  const { lang } = useApp();
  const [sel, setSel] = useState("levetiracetam");
  const [w, setW] = useState("");
  usePrefillPatient((p) => {
    if (!w && p.w) setW(p.w);
  });

  const med = MEDS.find((m) => m.id === sel) ?? MEDS[0];
  const W = parseFloat(w);
  const dose = Number.isFinite(W) && W > 0 ? (med.perKg > 0 ? Math.min(med.perKg * W, med.max) : med.max) : null;
  const capped = med.perKg > 0 && Number.isFinite(W) && med.perKg * W > med.max;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Brain className="h-6 w-6" />}
        title={lang === "ar" ? "مضادات الصرع في المستعجل" : "Antiepileptiques en urgence"}
        sub={lang === "ar" ? "جرعة التحميل، سرعة الحقن، والفخاخ لكل دواء." : "Dose de charge, vitesse d'injection et pièges de chaque médicament."}
      />

      <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
        <span className="text-xs font-black opacity-70"><T fr="Médicament" ar="الدواء" /></span>
        <select value={sel} onChange={(e) => setSel(e.target.value)} className="w-full bg-transparent text-base font-black outline-none">
          {MEDS.map((m) => <option key={m.id} value={m.id} className="bg-surface">{lang === "ar" ? m.ar : m.fr}</option>)}
        </select>
      </label>

      <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
        <span className="text-xs font-black opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></span>
        <NumStepper value={ w } onValue={ setW } className="w-full bg-transparent text-lg font-black tabular-nums outline-none" label="w" />
      </label>

      {dose !== null && (
        <div className="card sev-strip rounded-2xl border border-line bg-surface p-4 sev-standard">
          <p className="text-lg font-black tabular-nums" dir="ltr">{Math.round(dose * 100) / 100} {med.unit}
            {capped && <span className="text-sm" style={{ color: "var(--sev-urgent)" }}> ({lang === "ar" ? `المقيّد ${med.max}` : `plafond ${med.max}`})</span>}
          </p>
          <p className="mt-1 text-sm font-black" style={{ color: "var(--accent)" }}>{med.rate[lang === "ar" ? "ar" : "fr"]}</p>
          <ul className="mt-2 flex flex-col gap-1 text-sm font-bold">
            {med.warn.map((wn) => <li key={wn.fr} className="opacity-90">{wn[lang === "ar" ? "ar" : "fr"]}</li>)}
          </ul>
        </div>
      )}

      <p className="card rounded-2xl border border-line bg-surface p-4 text-sm font-bold">
        <T fr="Ordre des lignes thérapeutiques (benzodiazépine → 2e ligne → 3e ligne): voir la page dédiée." ar="ترتيب الخطوط (بنزوديازيبين ← خط ٢ ← خط ٣): انظر الصفحة المخصصة." />
      </p>

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/etat-mal" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="État de mal épileptique" ar="الحالة الصرعية المستمرة" /></Link>
        <Link href="/calculateurs/epilepsie-grossesse" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Grossesse" ar="الحمل" /></Link>
        <Link href="/calculateurs/renal-dose" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Bridge rénal" ar="الجسر الكلوي" /></Link>
      </div>
    </div>
  );
}

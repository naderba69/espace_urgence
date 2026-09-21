"use client";
// v12.3-A — Sedation palliative : titration selon symptome refractaire, surveillance, entourage.
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import T from "@/components/T";
import { Timer } from "lucide-react";

type Proto = { id: string; fr: string; ar: string; sev: string; steps: { fr: string; ar: string }[] };

const PROTOS: Proto[] = [
  { id: "dyspnee", fr: "Dyspnée réfractaire", ar: "زلة عنيدة", sev: "sev-critical",
    steps: [
      { fr: "Morphine IV/SC 2,5-5 mg en bolus, puis 1-2 mg toutes les 5 min jusqu'au confort.", ar: "مورفين وريدي/تحت الجلد ٢٫٥-٥ مغ بولوس ثم ١-٢ مغ كل ٥ د حتى الراحة." },
      { fr: "Objectif: fréquence respiratoire < 22 et respiration détendue — PAS l'arrêt respiratoire.", ar: "الهدف: تفتّف < ٢٢ وتنفّس مريح — لا توقف التنفس." },
      { fr: "Puis 10-20 mg/24 h en continu (SC ou IV); demi-dose si insuffisant rénal.", ar: "ثم ١٠-٢٠ مغ/٢٤ س مستمر؛ نصف الجرعة إذا فشل كلوي." },
      { fr: "Ajouter un anxiolytique si angoisse (midazolam 2,5 mg).", ar: "أضف مهدئاً إذا قلق (ميدازولام ٢٫٥ مغ)." },
    ] },
  { id: "agitation", fr: "Agitation terminale", ar: "هياج نهاية الحياة", sev: "sev-urgent",
    steps: [
      { fr: "Midazolam 2,5-5 mg SC/IV en bolus, puis 10-60 mg/24 h en continu.", ar: "ميدازولام ٢٫٥-٥ مغ بولوس ثم ١٠-٦٠ مغ/٢٤ س مستمر." },
      { fr: "Alternative: lévomépromazine 12,5-25 mg (effet prolongé).", ar: "بديل: ليفوميبرومازين ١٢٫٥-٢٥ مغ (مفعول ممتد)." },
      { fr: "Traiter d'abord la cause: douleur, rétention, hypoxie, médicament.", ar: "عالج السبب أولاً: ألم، احتباس، نقص أكسجة، دواء." },
    ] },
  { id: "douleur", fr: "Douleur réfractaire", ar: "ألم عنيد", sev: "sev-urgent",
    steps: [
      { fr: "Titration morphine: augmenter de 30-50 % la dose de base en bolus.", ar: "معايرة المورفين: زد الجرعة الأساسية ٣٠-٥٠٪ ببولوس." },
      { fr: "Si > 100 mg/24 h ou douleur neuropathique: avis et co-analgésie (gabapentinoïde).", ar: "إذا > ١٠٠ مغ/٢٤ س أو ألم عصبي: استشارة وتسكين مساعد (غابابنتينويدي)." },
      { fr: "Prévenir la constipation systématiquement; antidote: naloxone titrée si détresse.", ar: "امنع الإمساك دوماً؛ الترياق: نالوكسون معايَر إذا اضطراب." },
    ] },
  { id: "nausees", fr: "Nausées / vomissements", ar: "غثيان وقيء", sev: "sev-standard",
    steps: [
      { fr: "Halopéridol 2,5-5 mg SC/24 h ou métoclopramide 10 mg ×3 (si occlusion exclue).", ar: "هالوبيريدول ٢٫٥-٥ مغ/٢٤ س أو ميتوكلوبراميد ١٠ مغ ×٣ (بعد استبعاد الانسداد)." },
      { fr: "Occlusion: scopolamine butylbromure 60-120 mg/24 h + réduire l'entretien.", ar: "الانسداد: سكوبولامين ٦٠-١٢٠ مغ/٢٤ س + تقليل السوائل." },
    ] },
];

export default function SedationPalliativePage() {
  useRegisterRecent("calculateur:sedation-palliative");
  const { lang } = useApp();
  const [sel, setSel] = useState("dyspnee");
  const pr = PROTOS.find((p) => p.id === sel) ?? PROTOS[0];

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Timer className="h-6 w-6" />}
        title={lang === "ar" ? "جرعات التسكين النهائي" : "Sédation palliative : doses"}
        sub={lang === "ar" ? "المعايرة حسب العَرَض العنيد، المراقبة، ومواجهة العائلة." : "Titration selon le symptôme réfractaire, surveillance et entourage."}
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {PROTOS.map((p) => (
          <button key={p.id} onClick={() => setSel(p.id)} aria-pressed={sel === p.id}
            className={`touch shrink-0 rounded-xl border px-4 py-2 text-sm font-black ${sel === p.id ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
            style={sel === p.id ? { background: "var(--accent)" } : undefined}>
            {lang === "ar" ? p.ar : p.fr}
          </button>
        ))}
      </div>

      <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${pr.sev}`}>
        <p className="text-base font-black">{lang === "ar" ? pr.ar : pr.fr}</p>
        <ol className="mt-2 flex list-decimal flex-col gap-2 ps-5 text-sm font-bold">
          {pr.steps.map((s, i) => <li key={i}>{s[lang === "ar" ? "ar" : "fr"]}</li>)}
        </ol>
      </div>

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <p className="text-base font-black"><T fr="Surveillance" ar="المراقبة" /></p>
        <ul className="mt-2 flex flex-col gap-1 text-sm font-bold">
          <li><T fr="Fréquence respiratoire, TA, Ramsay cible 3-4 (sommeil, réponse à l'ordre forte)." ar="تفتّف، ضغط، Ramsay هدف ٣-٤ (نوم، استجابة لأمر قوي)." /></li>
          <li><T fr="Douleur même chez le patient non communicant: BIS, grimace, tachycardie." ar="الألم حتى عند غير المتواصل: تعبير الوجه، تسرّع القلب." /></li>
          <li><T fr="Réévaluation toutes les 15-30 min pendant la titration, puis chaque 4-6 h." ar="إعادة تقييم كل ١٥-٣٠ د أثناء المعايرة ثم كل ٤-٦ س." /></li>
        </ul>
      </section>

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <p className="text-base font-black"><T fr="Principes non négociables" ar="مبادئ غير قابلة للتفاوض" /></p>
        <ul className="mt-2 flex flex-col gap-1 text-sm font-bold">
          <li><T fr="La sédation proportionnée ne hâte pas la mort; l'objectif est le confort, jamais l'abréviation de vie." ar="التسكين المتناسب لا يُسرّع الموت؛ الهدف الراحة لا تقصير الحياة." /></li>
          <li><T fr="Indication: symptôme réfractaire, consentement (ou mandat de confiance), traçabilité." ar="الدليل: عَرَض عنيد، موافقة أو تفويض، توثيق." /></li>
          <li><T fr="Expliquer à l'entourage AVANT: ce qui sera observé, et pourquoi." ar="اشرح للعائلة قبل: ما سيُرى ولماذا." /></li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/rsi" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Sédation post-intubation" ar="تخدير ما بعد التنبيب" /></Link>
        <Link href="/calculateurs/antipsychotiques" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Agitation (antipsychotiques)" ar="الهياج (مضادات الذهان)" /></Link>
        <Link href="/calculateurs/dilutions" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Préparation seringue" ar="تحضير الحقنة" /></Link>
      </div>
    </div>
  );
}

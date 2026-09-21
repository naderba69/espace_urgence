"use client";
// v12.2-A — Épilepsie et grossesse : valproate interdit, ajustements, folates, vitamine K, éclampsie.
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Baby } from "lucide-react";
import { useState } from "react";

const DRUGS: { fr: string; ar: string; tone: "critical" | "urgent" | "standard"; pt: { fr: string; ar: string }; txt: { fr: string; ar: string } }[] = [
  { fr: "Valproate / Valproate semi-sodium", ar: "الفالبروات", tone: "critical", pt: { fr: "INTERDIT", ar: "ممنوع" },
    txt: { fr: "Interdit chez la femme enceinte ou en âge de procréer sans programme de prévention (EMA 2018). Malformations ≈ 10 %, troubles du neurodéveloppement jusqu'à 30-40 %. Ne jamais arrêter brutalement: relais neurologique planifié.", ar: "ممنوع على الحوامل أو النساء في سن الإنجاب دون برنامج وقائي (EMA 2018). تشوّهات ≈ ١٠٪، اضطرابات نمو عصبي حتى ٣٠-٤٠٪. لا إيقاف فجائياً أبداً: تعاقب عصبي مخطط." } },
  { fr: "Lamotrigine", ar: "لاموتريجين", tone: "standard", pt: { fr: "Favorable", ar: "مفضّل" },
    txt: { fr: "Profil favorable; clairance ×2-3 pendant la grossesse → dose à augmenter et niveau à contrôler chaque mois.", ar: "بروفيل مفضّل؛ التصفية ×٢-٣ أثناء الحمل ← زيادة الجرعة ومراقبة المصل شهرياً." } },
  { fr: "Lévétiracétam", ar: "ليفيتيراسيتام", tone: "standard", pt: { fr: "Favorable", ar: "مفضّل" },
    txt: { fr: "Le plus rassurant; clairance augmentée → surveiller les crises.", ar: "الأكثر أماناً؛ تصفية مرتفعة ← راقب النوبات." } },
  { fr: "Carbamazépine", ar: "كاربامازيبين", tone: "urgent", pt: { fr: "Risque", ar: "خطر" },
    txt: { fr: "Spina bifida ≈ 1 %; inducteur enzymatique → vitamine K pour le nouveau-né. Préféré au valproate si traitement indispensable.", ar: "انشقاق عمود فقري ≈ ١٪؛ حاثّ إنزيمي ← فيتامين K للوليد. يُفضّل على الفالبروات إذا كان العلاج ضرورياً." } },
  { fr: "Phénytoïne / Phénobarbital", ar: "فينيتوين/فينوباربيتال", tone: "urgent", pt: { fr: "Risque", ar: "خطر" },
    txt: { fr: "Malformatif; inducteurs → vitamine K au dernier mois et au nouveau-né.", ar: "مسبّب تشوّهات؛ حاثّات ← فيتامين K الشهر الأخير وللوليد." } },
];

const PHASES: { id: string; fr: string; ar: string; txt: { fr: string; ar: string } }[] = [
  { id: "projet", fr: "Projet de grossesse", ar: "رغبة في الحمل",
    txt: { fr: "Acide folique 5 mg/j ≥ 1 mois AVANT la conception; revoir le schéma avec le neurologue AVANT; plan de sortie du valproate si présent.", ar: "حمض الفوليك ٥ مغ/يوم ≥ شهر قبل الحمل؛ مراجعة العلاج مع طبيب الأعصاب قبل الحمل؛ خطة ترك الفالبروات إن كان قائماً." } },
  { id: "t1", fr: "1er trimestre", ar: "الثلث الأول",
    txt: { fr: "Période la plus sensible (organogenèse); échographie morphologique; si crise tonico-clonique: urgence mère+bébé.", ar: "أكثر فترة حساسية (تكوين الأعضاء)؛ تصوير شكلي؛ إذا نوبة توبيكو-كلونيك: استعجال أم+جنين." } },
  { id: "t2", fr: "2e trimestre", ar: "الثلث الثاني",
    txt: { fr: "Lamotrigine / lévétiracétam: la dose doit souvent être augmentée; contrôle des niveaux; prévenir les vomissements = dose manquée.", ar: "لاموتريجين/ليفيتيراسيتام: غالباً يلزم زيادة الجرعة؛ مراقبة المصل؛ القيء = جرعة فائتة." } },
  { id: "t3", fr: "3e trimestre", ar: "الثلث الثالث",
    txt: { fr: "Vitamine K1 orale 20 mg/j pour la mère (inducteurs) en fin de grossesse; plan d'accouchement; MgSO4 si éclampsie; nouveau-né: vit K1 IM + examen.", ar: "فيتامين K1 فموي ٢٠ مغ/يوم للأم (الحاثّات) آخر الحمل؛ خطة الولادة؛ MgSO4 عند تسمم حمل؛ الوليد: فيتامين K1 عضلي وفحص." } },
];

export default function EpilepsieGrossessePage() {
  useRegisterRecent("calculateur:epilepsie-grossesse");
  const { lang } = useApp();
  const [phase, setPhase] = useState("projet");
  const ph = PHASES.find((p) => p.id === phase) ?? PHASES[0];

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Baby className="h-6 w-6" />}
        title={lang === "ar" ? "الصرع والحمل" : "Épilepsie et grossesse"}
        sub={lang === "ar" ? "الفالبروات ممنوع، التعديلات حسب الثلث، والفولات قبل الحمل." : "Valproate interdit, ajustements par trimestre et folates avant conception."}
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {PHASES.map((p) => (
          <button key={p.id} onClick={() => setPhase(p.id)} aria-pressed={phase === p.id}
            className={`touch shrink-0 rounded-xl border px-4 py-2 text-sm font-black ${phase === p.id ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
            style={phase === p.id ? { background: "var(--accent)" } : undefined}>
            {lang === "ar" ? p.ar : p.fr}
          </button>
        ))}
      </div>

      <div className="card sev-strip rounded-2xl border border-line bg-surface p-4 sev-standard">
        <p className="text-base font-black">{lang === "ar" ? ph.ar : ph.fr}</p>
        <p className="mt-1 text-sm font-bold">{ph.txt[lang === "ar" ? "ar" : "fr"]}</p>
      </div>

      <section className="flex flex-col gap-2">
        {DRUGS.map((dg) => (
          <div key={dg.fr} className={`card sev-strip rounded-2xl border border-line bg-surface p-3 ${dg.tone === "critical" ? "sev-critical" : dg.tone === "urgent" ? "sev-urgent" : "sev-standard"}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-black">{lang === "ar" ? dg.ar : dg.fr}</p>
              <Badge tone={dg.tone}>{dg.pt[lang === "ar" ? "ar" : "fr"]}</Badge>
            </div>
            <p className="mt-1 text-sm font-bold opacity-85">{dg.txt[lang === "ar" ? "ar" : "fr"]}</p>
          </div>
        ))}
      </section>

      <section className="card sev-strip sev-critical rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center gap-2"><Badge tone="critical"><T fr="État de mal chez la femme enceinte" ar="الحالة الصرعية عند الحامل" /></Badge></div>
        <ul className="mt-2 flex flex-col gap-1 text-sm font-bold">
          <li><T fr="Benzodiazépine comme d'habitude; décubitus latéral gauche, O2." ar="بنزوديازيبين كالمعتاد؛ الوضع الجانبي الأيسر، أكسجين." /></li>
          <li dir="ltr" style={{ textAlign: "start" }}><b>MgSO4 4 g IV</b> <T fr="sur 5-10 min si éclampsie (après 20-24 SA)" ar="على ٥-١٠ د عند تسمم الحمل (بعد ٢٠-٢٤ أسبوعاً)" /></li>
          <li><T fr="Ne jamais arrêter brutalement un antiépileptique pendant la grossesse." ar="لا توقف أي مضاد صرع فجائياً أثناء الحمل." /></li>
        </ul>
      </section>

      <p className="card rounded-2xl border border-line bg-surface p-4 text-sm font-bold">
        <T fr="Allaitement: autorisé pour la plupart; surveiller la somnolence du nourrisson (phénobarbital, lamotrigine)." ar="الإرضاع: مسموح معظم الأدوية؛ راقب خمول الرضيع (فينوباربيتال، لاموتريجين)." />
      </p>

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/antiepileptiques" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Doses de charge" ar="جرعات التحميل" /></Link>
        <Link href="/calculateurs/etat-mal" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="État de mal" ar="الحالة الصرعية" /></Link>
      </div>
    </div>
  );
}

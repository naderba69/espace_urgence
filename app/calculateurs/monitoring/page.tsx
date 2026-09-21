"use client";
// v12.3-A — Monitoring des medicaments : cibles, moment du prelevement, toxicite, dialysabilite.
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Gauge } from "lucide-react";

type Med = { id: string; fr: string; ar: string; target: string; timing: { fr: string; ar: string };
  toxic: string; action: { fr: string; ar: string }; dialyse: boolean };

const MEDS: Med[] = [
  { id: "vanco", fr: "Vancomycine", ar: "فانكومايسين", target: "résiduel 10-15 mg/L (15-20 si FA sévère)",
    timing: { fr: "Juste avant la 4e dose (état stationnaire).", ar: "قبل الجرعة الرابعة مباشرة (الاستقرار)." },
    toxic: "> 25-30 mg/L : néphrotoxicité, ototoxicité",
    action: { fr: "Augmenter l'intervalle, contrôler le résiduel à 48 h.", ar: "زد الفاصل، أعد القياس بعد ٤٨ س." }, dialyse: false },
  { id: "dig", fr: "Digoxine", ar: "ديجوكسين", target: "0,5-0,9 µg/L (FA) / 0,8-2 (insuffisance cardiaque)",
    timing: { fr: "≥ 6 h après la prise (12 h idéalement).", ar: "≥ ٦ س بعد الجرعة (١٢ س مثالياً)." },
    toxic: "> 2 µg/L + hypokaliémie/hypomagnésémie → troubles du rythme",
    action: { fr: "Fab (digoxin-Fab) si: arythmie grave, K+ > 5, ingestion > 10 mg; corriger K+ et Mg.", ar: "أضداد Fab إذا: اضطراب نظم شديد، K+ > ٥، بلع > ١٠ مغ؛ صحّح البوتاسيوم والمغنيزيوم." }, dialyse: false },
  { id: "lith", fr: "Lithium", ar: "الليثيوم", target: "0,6-1,0 mmol/L (traitement)",
    timing: { fr: "12 h après la dernière prise.", ar: "١٢ س بعد آخر جرعة." },
    toxic: "> 1,5 : intoxication ; > 2,5 grave ; > 4 ou symptômes sévères",
    action: { fr: "Hydratation + arrêt; hémodialyse si > 4 mmol/L ou conscience altérée/insuffisance rénale.", ar: "إرواء وإيقاف؛ غسيل إذا > ٤ أو اضطراب وعي أو فشل كلوي." }, dialyse: true },
  { id: "phen", fr: "Phénytoïne", ar: "فينيتوين", target: "total 10-20 mg/L / libre 1-2 mg/L",
    timing: { fr: "Résiduel (pré-dose); albumine si hypo-albuminémie.", ar: "قيعان قبل الجرعة؛ الألبيومين إذا منخفض." },
    toxic: "> 20 : nystagmus ; > 30 : ataxie, somnolence",
    action: { fr: "Ne pas injecter un bolus de rattrapage IV; réduire la dose, suivre l'albumine.", ar: "لا بولوس تعويضي وريدي؛ قلّل الجرعة واقرص الألبيومين." }, dialyse: false },
  { id: "theo", fr: "Théophylline", ar: "ثيوفيلين", target: "10-20 mg/L",
    timing: { fr: "4 h après la prise (libération prolongée: n'importe quand).", ar: "٤ س بعد الجرعة (ممتد: أي وقت)." },
    toxic: "> 35 : tachycardie, convulsions ; aigu > 80-100 : danger",
    action: { fr: "Charbon multi-dose systématique; hémodialyse si aigu > 80 ou chronique > 40 avec symptômes.", ar: "فحم متعدد الجرعات دوماً؛ غسيل إذا حاد > ٨٠ أو مزمن > ٤٠ بأعراض." }, dialyse: true },
  { id: "valp", fr: "Valproate", ar: "الفالبروات", target: "50-100 mg/L (pas de corrélation stricte avec l'efficacité)",
    timing: { fr: "Résiduel matinal.", ar: "قيعان صباحية." },
    toxic: "> 150 mg/L : somnolence ; intoxication massive : coma, hyperammonémie",
    action: { fr: "Carnitine IV; L-carnitine + charbon; hémodialyse si > 1300 mg/L ou hémodynamique instable.", ar: "كارنيتين وريدي + فحم؛ غسيل إذا > ١٣٠٠ أو عدم استقرار دوراني." }, dialyse: true },
  { id: "carb", fr: "Carbamazépine", ar: "كاربامازيبين", target: "4-12 mg/L",
    timing: { fr: "Résiduel; pic retard si libération prolongée.", ar: "قيعان؛ قمة متأخرة إذا ممتد." },
    toxic: "> 40 mg/L : coma, ataxie, blocs cardiaques",
    action: { fr: "Charbon multi-dose; hémodialyse/hémoperfusion si instable.", ar: "فحم متعدد الجرعات؛ غسيل إذا غير مستقر." }, dialyse: true },
  { id: "phb", fr: "Phénobarbital", ar: "فينوباربيتال", target: "15-40 mg/L",
    timing: { fr: "Résiduel; état stationnaire en 2-3 semaines.", ar: "قيعان؛ الاستقرار بعد ٢-٣ أسابيع." },
    toxic: "> 60 : coma ; > 100 : dépression respiratoire grave",
    action: { fr: "Alcalinisation des urines + dialyse si > 100 mg/L ou coma profond.", ar: "قلوالبول + غسيل إذا > ١٠٠ أو غيبوبة عميقة." }, dialyse: true },
];

export default function MonitoringPage() {
  useRegisterRecent("calculateur:monitoring");
  const { lang } = useApp();
  const [sel, setSel] = useState("vanco");
  const med = MEDS.find((m) => m.id === sel) ?? MEDS[0];

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Gauge className="h-6 w-6" />}
        title={lang === "ar" ? "مراقبة المستويات الدوائية" : "Monitoring des médicaments"}
        sub={lang === "ar" ? "الهدف، وقت السحب، عتبة السمية، والمسار عند التسمم." : "Cibles, moment du prélèvement, toxicité et conduite à tenir."}
      />

      <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
        <span className="text-xs font-black opacity-70"><T fr="Médicament" ar="الدواء" /></span>
        <select value={sel} onChange={(e) => setSel(e.target.value)} className="w-full bg-transparent text-base font-black outline-none">
          {MEDS.map((m) => <option key={m.id} value={m.id} className="bg-surface">{lang === "ar" ? m.ar : m.fr}</option>)}
        </select>
      </label>

      <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${med.dialyse ? "sev-urgent" : "sev-standard"}`}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-base font-black">{lang === "ar" ? med.ar : med.fr}</p>
          <Badge tone={med.dialyse ? "urgent" : "neutral"}>{med.dialyse ? <T fr="Dialysable" ar="قابل للغسيل" /> : <T fr="Non dialysable" ar="غير قابل" />}</Badge>
        </div>
        <ul className="mt-2 flex flex-col gap-2 text-sm font-bold">
          <li><span style={{ color: "var(--accent)" }}><T fr="Cible" ar="الهدف" /></span> · <span dir="auto">{med.target}</span></li>
          <li><span style={{ color: "var(--accent)" }}><T fr="Prélèvement" ar="السحب" /></span> · {med.timing[lang === "ar" ? "ar" : "fr"]}</li>
          <li className="font-black" style={{ color: "var(--sev-urgent)" }}><T fr="Toxicité" ar="السمية" /> · <span dir="auto">{med.toxic}</span></li>
          <li>{med.action[lang === "ar" ? "ar" : "fr"]}</li>
        </ul>
      </div>

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <p className="text-base font-black"><T fr="Règles générales" ar="قواعد عامة" /></p>
        <ul className="mt-2 flex flex-col gap-1 text-sm font-bold">
          <li><T fr="Prélever à l'état stationnaire (≈ 5 demi-vies après la 1re dose ou un changement)." ar="اسحب بعد الاستقرار (≈ ٥ أعمار نصية بعد البدء أو التغيير)." /></li>
          <li><T fr="Inscrire l'heure exacte de la dernière prise et du prélèvement." ar="سجّل توقيت آخر جرعة وتوقيت السحب بدقة." /></li>
          <li><T fr="Interpréter avec l'albumine, le pH, la fonction rénale et les interactions." ar="فسّر مع الألبيومين والـpH والكلى والتفاعلات." /></li>
          <li><T fr="Intoxication aiguë: voir la page antidotes avant tout." ar="التسمم الحاد: انظر صفحة الترياقات أولاً." /></li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/antidotes" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Antidotes" ar="الترياقات" /></Link>
        <Link href="/calculateurs/renal-dose" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Bridge rénal" ar="الجسر الكلوي" /></Link>
        <Link href="/calculateurs/interactions" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Interactions" ar="التفاعلات" /></Link>
      </div>
    </div>
  );
}

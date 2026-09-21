"use client";
// v12.3-A — Antipsychotiques/manias : agitation aiguë, doses adulte/âgé, pièges, syndrome malin.
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Brain } from "lucide-react";

type Med = { id: string; fr: string; ar: string; route: string; adult: string; old: string; max: string; trap: { fr: string; ar: string } };

const MEDS: Med[] = [
  { id: "halo", fr: "Halopéridol", ar: "هالوبيريدول", route: "IM", adult: "5 mg", old: "2,5 mg", max: "20 mg/24 h",
    trap: { fr: "Allongement du QT: ECG si voie IV ou forte dose; éviter l'association IV avec la méthadone.", ar: "إطالة QT: تخطيط قلب إذا المسار الوريدي أو الجرعة العالية." } },
  { id: "cyame", fr: "Cyamémazine", ar: "سياميمازين", route: "IM", adult: "25-100 mg", old: "25-50 mg", max: "200 mg/24 h",
    trap: { fr: "Sédation forte, hypotension; EPS faibles.", ar: "تخدير قوي وهبوط ضغط؛ أثار حركية قليلة." } },
  { id: "loxa", fr: "Loxapine", ar: "لوكسابين", route: "IM", adult: "50 mg", old: "25 mg", max: "150 mg/24 h",
    trap: { fr: "Surveiller la TA et la respiration; réévaluer à 30 min.", ar: "راقب الضغط والتنفس؛ أعد التقييم بعد ٣٠ د." } },
  { id: "olan", fr: "Olanzapine", ar: "أولانزابين", route: "IM ou orale", adult: "10 mg", old: "5 mg", max: "20 mg/24 h",
    trap: { fr: "JAMAIS la voie IM si benzodiazépine parentérale récente (hypotension, arrêt respiratoire).", ar: "أبداً المسار العضلي إذا بنزوديازيبين حديث (هبوط ضغط، توقف تنفس)." } },
  { id: "arip", fr: "Aripiprazole", ar: "أريبيبرازول", route: "IM", adult: "9,75 mg", old: "5,25 mg", max: "30 mg/24 h",
    trap: { fr: "Effet tardif; peu sédantif.", ar: "مفعول متأخر؛ تخدير قليل." } },
  { id: "risp", fr: "Rispéridone", ar: "ريسبيريدون", route: "orale", adult: "1-2 mg", old: "0,5 mg", max: "4 mg/24 h",
    trap: { fr: "Acceptation du traitement obligatoire; hypotension orthostatique.", ar: "يجب قبول الدواء؛ هبوط ضغط وضعي." } },
];

export default function AntipsychotiquesPage() {
  useRegisterRecent("calculateur:antipsychotiques");
  const { lang } = useApp();
  const [sel, setSel] = useState("halo");
  const [old, setOld] = useState(false);
  const med = MEDS.find((m) => m.id === sel) ?? MEDS[0];

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Brain className="h-6 w-6" />}
        title={lang === "ar" ? "مضادات الذهان والهوس" : "Antipsychotiques et manies"}
        sub={lang === "ar" ? "جرعات الهياج الحاد، الفخاخ، والمتلازمات الخطيرة." : "Doses d'agitation aiguë, pièges et syndromes dangereux."}
      />

      <div className="flex gap-2">
        <button onClick={() => setOld(false)} aria-pressed={!old} className={`touch flex-1 rounded-xl border p-3 text-sm font-black ${!old ? "border-transparent text-white" : "border-line hover:bg-surface2"}`} style={!old ? { background: "var(--accent)" } : undefined}><T fr="Adulte < 65 ans" ar="بالغ < ٦٥ س" /></button>
        <button onClick={() => setOld(true)} aria-pressed={old} className={`touch flex-1 rounded-xl border p-3 text-sm font-black ${old ? "border-transparent text-white" : "border-line hover:bg-surface2"}`} style={old ? { background: "var(--accent)" } : undefined}><T fr="Âgé ≥ 65 ans: ÷ 2" ar="مسنّ ≥ ٦٥ س: ÷ ٢" /></button>
      </div>

      <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
        <span className="text-xs font-black opacity-70"><T fr="Molécule" ar="الجزيء" /></span>
        <select value={sel} onChange={(e) => setSel(e.target.value)} className="w-full bg-transparent text-base font-black outline-none">
          {MEDS.map((m) => <option key={m.id} value={m.id} className="bg-surface">{lang === "ar" ? m.ar : m.fr}</option>)}
        </select>
      </label>

      <div className="card sev-strip rounded-2xl border border-line bg-surface p-4 sev-standard">
        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-black" dir="ltr">{old ? med.old : med.adult} <span className="text-sm opacity-70">· {med.route}</span></p>
          <span dir="ltr"><Badge tone="neutral">{med.max}</Badge></span>
        </div>
        <p className="mt-1 text-sm font-bold opacity-85">{med.trap[lang === "ar" ? "ar" : "fr"]}</p>
        <p className="mt-1 text-xs font-bold opacity-70">
          <T fr="Réévaluer à 30 min; répéter une fois si besoin; jamais en association à deux antipsychotiques IM." ar="أعد التقييم بعد ٣٠ د؛ كرر مرة عند الحاجة؛ لا تضع مضادين عضليين معاً." />
        </p>
      </div>

      <section className="card sev-strip sev-critical rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center gap-2"><Badge tone="critical"><T fr="Syndrome malin des neuroleptiques" ar="متلازمة الخبيثة" /></Badge></div>
        <ul className="mt-2 flex flex-col gap-1 text-sm font-bold">
          <li><T fr="Fièvre + rigidité + troubles de conscience + CPK élevée." ar="حمى + تصلب + اضطراب وعي + CPK مرتفعة." /></li>
          <li><T fr="Arrêt immédiat de l'antipsychotique, refroidissement, remplissage, transfert." ar="إيقاف فوري للمضاد، تبريد، تعبئة، نقل." /></li>
          <li dir="ltr" style={{ textAlign: "start" }}>Dantrolène 2,5 mg/kg IV ou bromocriptine 5 mg/8 h (avis spécialisé)</li>
        </ul>
      </section>

      <section className="card sev-strip sev-urgent rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center gap-2"><Badge tone="urgent"><T fr="Dystonie aiguë" ar="اختلاج حاد" /></Badge></div>
        <p className="mt-2 text-sm font-black" dir="ltr">Bipéridène 5 mg IM/IV</p>
        <p className="mt-1 text-sm font-bold opacity-80"><T fr="Réponse en minutes; penser aussi au trismus laryngé." ar="الاستجابة في دقائق؛ تذكّر اختلاج الحنجرة." /></p>
      </section>

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <p className="text-base font-black"><T fr="Crise maniaque" ar="الأزمة الهوسية" /></p>
        <ul className="mt-2 flex flex-col gap-1 text-sm font-bold">
          <li><T fr="Antipsychotique sédatif en 1re ligne (halopéridol, olanzapine) ± benzodiazépine." ar="مضاد ذهان مهدئ خط ١ (هالوبيريدول، أولانزابين) ± بنزوديازيبين." /></li>
          <li dir="ltr" style={{ textAlign: "start" }}>Valproate charge 20-30 mg/kg/j — <b>jamais</b> chez la femme en âge de procréer sans précaution</li>
          <li><T fr="Lithium: pas d'initiation en urgence (marge étroite, voir monitoring)." ar="الليثيوم: لا بدء في المستعجل (هامش ضيق، انظر المراقبة)." /></li>
          <li><T fr="Penser au sevrage alcoolique, à la thyroïde et à l'excited delirium." ar="فكّر في انسحاب الكحول والغدة الدرقية والهياج الهدائي." /></li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/corticoids" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Corticoïdes (agitation organique)" ar="الكورتيزون (هياج عضوي)" /></Link>
        <Link href="/calculateurs/antiepileptiques" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Valproate charge" ar="تحميل الفالبروات" /></Link>
        <Link href="/calculateurs/monitoring" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Monitoring (lithium)" ar="المراقبة (الليثيوم)" /></Link>
      </div>
    </div>
  );
}

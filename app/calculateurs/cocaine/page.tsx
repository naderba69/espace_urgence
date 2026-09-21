"use client";
// v10.0-A5 — ألم صدري تحت الكوكايين/المنبّهات : تدبير خاص.
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import T from "@/components/T";
import { Activity } from "lucide-react";

const STEPS: { n: string; fr: string; ar: string }[] = [
  { n: "1", fr: "ECG immédiat + troponine (répéter); monitorage et voie veineuse.", ar: "ECG فوري + تروبونين (معاد)؛ مراقبة ومسار وريدي." },
  { n: "2", fr: "Benzodiazépines d'abord (diazépam 5-10 mg IV): agitation, HTA, vasospasme — c'est le traitement de base.", ar: "بنزوديازيبين أولاً (ديازيبام ٥-١٠ مغ وريدي): الهياج وارتفاع الضغط وتشنّج الأوعية — العلاج الأساسي." },
  { n: "3", fr: "Dérivés nitrés (TNT sublinguale puis IV) pour la douleur/HTA; antalgie titrée.", ar: "نترات (تحت اللسان ثم وريدي) للألم/الضغط؛ تسكين معاير." },
  { n: "4", fr: "Bêtabloquant SEUL à éviter (spasme non opposé) — si indispensable: après benzodiazépine + vasodilatateur, en milieu surveillé.", ar: "لا تعطِ حاصرات بيتا وحدها (تشنّج غير معاكس)؛ إن لزم: بعد بنزوديازيبين + موسّع وعائي وبمراقبة." },
  { n: "5", fr: "HTA réfractaire: phentolamine (ou nicardipine).", ar: "ضغط مقاوم: فنتولامين (أو نيكارديبين)." },
  { n: "6", fr: "QRS large / toxidrome tricyclique: bicarbonates (voir antidotes).", ar: "QRS عريض/متلازمة ثلاثية الحلقات: بيكربونات (انظر الترياقات)." },
  { n: "7", fr: "Hyperthermie + rigidité: refroidissement + benzodiazépines (jamais d'antipyrétique seul).", ar: "فرط حرارة + تصلّب: تبريد + بنزوديازيبين (لا خافض حرارة وحده)." },
  { n: "8", fr: "Sonde vésicale si rhabdomyolyse suspectée (urines rouges, CPK) → hydratation.", ar: "قسطرة عند الاشتباه بحلّ العضل (بول غامق، CPK) → إرواء." },
];

export default function CocainePage() {
  useRegisterRecent("calculateur:cocaine");
  const { lang } = useApp();
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Activity className="h-6 w-6" />}
        title={lang === "ar" ? "ألم صدري — كوكايين/منبّهات" : "Douleur thoracique — cocaïne"}
        sub={lang === "ar" ? "التدبير الخاص: بنزوديازيبين أولاً، وحدود حاصرات بيتا." : "Conduite spécifique : benzo d'abord, pièges des bêtabloquants."}
      />
      <ol className="flex flex-col gap-2">
        {STEPS.map((s) => (
          <li key={s.n} className="card flex items-start gap-3 rounded-2xl border border-line bg-surface p-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-black text-white" style={{ background: "var(--accent)" }}>{s.n}</span>
            <p className="text-sm font-bold">{lang === "ar" ? s.ar : s.fr}</p>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/toxidromes" className="rounded-full border px-4 py-2 text-sm font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
          <T fr="Toxidromes" ar="المتلازمات السمية" />
        </Link>
        <Link href="/calculateurs/coup-chaleur" className="rounded-full border px-4 py-2 text-sm font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
          <T fr="Coup de chaleur" ar="ضربة الحر" />
        </Link>
        <Link href="/calculateurs/antidotes" className="rounded-full border px-4 py-2 text-sm font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
          <T fr="Antidotes" ar="الترياقات" />
        </Link>
      </div>
    </div>
  );
}

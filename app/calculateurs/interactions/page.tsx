"use client";
// v12.1-C — التفاعلات الدوائية الخطيرة : زوجان + قائمة مفصّلة.
import { useMemo, useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { AlertTriangle } from "lucide-react";

type Pair = { a: string; aAr: string; b: string; bAr: string; sev: 1 | 2 | 3; mechFr: string; mechAr: string; actFr: string; actAr: string };

const PAIRS: Pair[] = [
  { a: "AVK (warfarine)", aAr: "وارفارين", b: "AINS / aspirine", bAr: "مضادات الالتهاب/أسبرين", sev: 3,
    mechFr: "Addition des effets (plaquettes + muqueuse) et déplacement protéique.", mechAr: "تجميع التأثير (صفيحات + مخاطية) وإزاحة بروتينية.",
    actFr: "Éviter ; si indispensable, protéger l'estomac et contrôler l'INR.", actAr: "تجنّب؛ إن لزم: حماية المعدة ومراقبة INR." },
  { a: "AVK", aAr: "وارفارين", b: "Fluoroquinolones / macrolides / amiodarone", bAr: "كينولونات/ماكروليدات/أميودارون", sev: 3,
    mechFr: "Inhibition du CYP → INR qui monte en 3-5 jours.", mechAr: "تثبيط CYP → ارتفاع INR خلال ٣-٥ أيام.",
    actFr: "Contrôler l'INR à 48-72 h et ajuster la dose.", actAr: "راقب INR بعد ٤٨-٧٢ س وعدّل الجرعة." },
  { a: "IEC / ARA2", aAr: "مثبطات الأنجيوتنسين", b: "Spironolactone / AINS", bAr: "سبيرونولاكتون/مضادات الالتهاب", sev: 3,
    mechFr: "Triple atteinte de la régulation du potassium → hyperkaliémie.", mechAr: "ثلاثي يصيب تنظيم البوتاسيوم → فرط بوتاسيوم.",
    actFr: "Éviter la combinaison ; sinon kaliémie et créatinine à 1 semaine.", actAr: "تجنّب الجمع؛ وإلا راقب البوتاسيوم والكرياتينين بعد أسبوع." },
  { a: "ISRS", aAr: "مثبطات استرداد السيروتونين", b: "Tramadol / triptans", bAr: "ترامادول/تريبتان", sev: 3,
    mechFr: "Syndrome sérotoninergique (agitation, hyperréflexie, clonies).", mechAr: "متلازمة سيروتونين (هياج، فرط منعكسات، ارتجاجات).",
    actFr: "Préférer un autre antalgique ; sinon surveillance et information du patient.", actAr: "فضّل مسكّناً آخر؛ وإلا راقب وأخبر المريض." },
  { a: "Bêtabloquant", aAr: "حاصر بيتا", b: "Vérapamil / diltiazem", bAr: "فيراباميل/ديلتيازيم", sev: 3,
    mechFr: "Bradycardie et bloc auriculo-ventriculaire.", mechAr: "بطء القلب والانسداد الأذيني-البطيني.",
    actFr: "Éviter surtout en IV ; monitorer ECG si association.", actAr: "تجنّب خاصة وريدياً؛ راقب التخطيط إن جمعتا." },
  { a: "Statine", aAr: "ستاتين", b: "Macrolides / azolés (clarithromycine)", bAr: "ماكروليدات/إيميدازولات", sev: 2,
    mechFr: "Risque de rhabdomyolyse par inhibition métabolique.", mechAr: "خطر تحلّل عضلي بتثبيط الاستقلاب.",
    actFr: "Suspendre la statine pendant l'antibiothérapie courte.", actAr: "علّق الستاتين خلال المضاد الحيوي القصير." },
  { a: "Méthotrexate", aAr: "ميثوتركسات", b: "AINS / triméthoprime", bAr: "مضادات الالتهاب/تريميتوبريم", sev: 3,
    mechFr: "Diminution de l'élimination → toxicité médullaire.", mechAr: "تقليل الإطراح → سمية نقيّة.",
    actFr: "Éviter, contrôler NFS et fonction rénale.", actAr: "تجنّب وراقب الدم ووظيفة الكلى." },
  { a: "Digoxine", aAr: "ديجوكسين", b: "Amiodarone / vérapamil", bAr: "أميودارون/فيراباميل", sev: 3,
    mechFr: "Concentration de digoxine augmentée → troubles du rythme.", mechAr: "ارتفاع تركيز الديجوكسين → اضطرابات نظم.",
    actFr: "Réduire la digoxine de 50 % et doser.", actAr: "خفّض الديجوكسين ٥٠٪ وقس المستوى." },
  { a: "Lithium", aAr: "ليثيوم", b: "AINS / IEC / diurétiques", bAr: "مضادات الالتهاب/مثبطات/مدرّات", sev: 3,
    mechFr: "Réabsorption augmentée → lithémie toxique.", mechAr: "إعادة امتصاص زائدة → سمية الليثيوم.",
    actFr: "Contrôler la lithémie, éviter si possible.", actAr: "راقب مستوى الليثيوم وتجنّب قدر الإمكان." },
  { a: "Clopidogrel", aAr: "كلوبيدوغريل", b: "Oméprazole", bAr: "أوميبرازول", sev: 2,
    mechFr: "Moins d'activation du clopidogrel → perte d'efficacité.", mechAr: "تنشيط أقل للكلوبيدوغريل → فقدان الفعالية.",
    actFr: "Remplacer par le pantoprazole.", actAr: "استبدله بالبانتوبرازول." },
  { a: "Allopurinol", aAr: "ألوبيورينول", b: "Azathioprine", bAr: "آزاثيوبرين", sev: 3,
    mechFr: "Blocage du catabolisme des purines → aplasie médullaire.", mechAr: "حجب تقويض البيورينات → انعدام نقي.",
    actFr: "Association à éviter absolument ; réduire fortement la dose si inévitable.", actAr: "تجنّب الجمع تماماً؛ خفّض الجرعة بقوة إن كان لا بديل." },
  { a: "Opioïde", aAr: "أفيوني", b: "Benzodiazépine / gabapentinoïde", bAr: "بنزوديازيبين/غابابنتينوئيد", sev: 3,
    mechFr: "Dépression respiratoire synergique.", mechAr: "تثبيط تنفسي تآزري.",
    actFr: "Réduire les doses, surveiller la saturation et avoir la naloxone prête.", actAr: "خفّض الجرعات وراقب الإشباع وجهّز النالوكسون." },
  { a: "Fluoroquinolone", aAr: "فلوروكينولون", b: "Tizanidine / corticoïdes", bAr: "تيزانيدين/كورتيزون", sev: 2,
    mechFr: "Hypotension et sédation (tizanidine) ; tendinopathie (corticoïdes).", mechAr: "هبوط ضغط وتخدير (تيزانيدين)؛ اعتلال وترى (كورتيزون).",
    actFr: "Éviter la tizanidine ; prévenir du risque tendineux après 60 ans.", actAr: "تجنّب التيزانيدين؛ حذّر من خطر الأوتار بعد الستين." },
  { a: "Metformine", aAr: "ميتفورمين", b: "Produit de contraste iodé", bAr: "صبغة يودية", sev: 2,
    mechFr: "Insuffisance rénale aiguë induite → acidose lactique.", mechAr: "قصور كلوي حاد مُحدَث → حماض لبني.",
    actFr: "Arrêter 48 h et contrôler la créatinine avant de reprendre.", actAr: "أوقف ٤٨ س وراقب الكرياتينين قبل الاستئناف." },
  { a: "Carbamazépine / rifampicine", aAr: "كاربامازيبين/ريفامبيسين", b: "Contraceptifs / AVK", bAr: "حبوب منع الحمل/وارفارين", sev: 2,
    mechFr: "Induction enzymatique → perte d'efficacité.", mechAr: "تحفيز إنزيمي → فقدان الفعالية.",
    actFr: "Contraception non hormonale et INR répétés.", actAr: "وسيلة منع غير هرمونية ومتابعة INR." },
  { a: "Antiarythmique / ISRS / antidépresseur tricyclique", aAr: "مضادات النظم/مضادات الاكتئاب", b: "Autres allongeant le QT", bAr: "أدوية مُطيلة QT", sev: 2,
    mechFr: "Allongement du QT cumulé → torsades de pointes.", mechAr: "إطالة QT تراكمية → تورساد.",
    actFr: "Mesurer le QTc, corriger K+ et Mg2+ ; voir calculateur QTc.", actAr: "قس QTc وصحّح البوتاسيوم والمغنيزيوم." },
];

export default function InteractionsPage() {
  useRegisterRecent("calculateur:interactions");
  const { lang } = useApp();
  const [selA, setSelA] = useState("");
  const [selB, setSelB] = useState("");
  const [q, setQ] = useState("");

  const names = useMemo(() => Array.from(new Set(PAIRS.flatMap((p) => [p.a, p.b]))).sort(), []);
  const found = useMemo(() => PAIRS.filter((p) =>
    (p.a === selA && p.b === selB) || (p.a === selB && p.b === selA)), [selA, selB]);
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const base = needle
      ? PAIRS.filter((p) => [p.a, p.aAr, p.b, p.bAr].join(" ").toLowerCase().includes(needle))
      : PAIRS;
    return [...base].sort((x, y) => y.sev - x.sev);
  }, [q]);

  const sevBadge = (sev: number) => sev === 3
    ? <Badge tone="critical"><T fr="À éviter" ar="يُتجنّب" /></Badge>
    : <Badge tone="urgent"><T fr="Prudence" ar="حذر" /></Badge>;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<AlertTriangle className="h-6 w-6" />}
        title={lang === "ar" ? "التفاعلات الدوائية الخطيرة" : "Interactions médicamenteuses graves"}
        sub={lang === "ar" ? "تحقّق من زوجين، أو ابحث في ١٦ زوجاً مصنّفاً." : "Vérifiez deux médicaments, ou parcourez 16 paires classées."}
      />

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
          <span className="text-xs font-black opacity-70"><T fr="Médicament A" ar="الدواء أ" /></span>
          <select value={selA} onChange={(e) => setSelA(e.target.value)} className="w-full bg-transparent text-sm font-black outline-none">
            <option value="">—</option>
            {names.map((n) => <option key={n} value={n} className="bg-surface">{n}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
          <span className="text-xs font-black opacity-70"><T fr="Médicament B" ar="الدواء ب" /></span>
          <select value={selB} onChange={(e) => setSelB(e.target.value)} className="w-full bg-transparent text-sm font-black outline-none">
            <option value="">—</option>
            {names.map((n) => <option key={n} value={n} className="bg-surface">{n}</option>)}
          </select>
        </label>
      </div>

      {selA && selB && (
        found.length > 0 ? found.map((p) => (
          <div key={p.a + p.b} className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${p.sev === 3 ? "sev-critical" : "sev-urgent"}`}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-base font-black">{p.a} + {p.b}</p>
              {sevBadge(p.sev)}
            </div>
            <p className="text-sm font-bold">{p.aAr} + {p.bAr}</p>
            <p className="mt-1 text-sm opacity-80">{lang === "ar" ? p.mechAr : p.mechFr}</p>
            <p className="mt-1 text-sm font-black" style={{ color: p.sev === 3 ? "var(--sev-critical)" : "var(--sev-urgent)" }}>
              {lang === "ar" ? p.actAr : p.actFr}
            </p>
          </div>
        )) : (
          <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm font-bold">
            <T fr="Aucune interaction répertoriée dans cette liste — penser aux interactions hors liste (médicaments du patient, phytothérapie)." ar="لا تفاعل مدرج في هذه القائمة — فكّر بالتفاعلات خارجها (أدوية المريض والأعشاب)." />
          </p>
        )
      )}

      <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
        <span className="text-xs font-black opacity-70"><T fr="Filtrer la liste" ar="تصفية القائمة" /></span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === "ar" ? "مثال: وارفارين" : "ex. warfarine"}
          className="w-full bg-transparent text-sm font-bold outline-none" />
      </label>

      <ul className="flex flex-col gap-2">
        {list.map((p) => (
          <li key={p.a + p.b} className={`card sev-strip rounded-2xl border border-line bg-surface p-3 ${p.sev === 3 ? "sev-critical" : "sev-urgent"}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-black">{lang === "ar" ? `${p.aAr} + ${p.bAr}` : `${p.a} + ${p.b}`}</p>
              {sevBadge(p.sev)}
            </div>
            <p className="mt-1 text-xs opacity-80">{lang === "ar" ? p.mechAr : p.mechFr}</p>
            <p className="mt-1 text-xs font-bold">{lang === "ar" ? p.actAr : p.actFr}</p>
          </li>
        ))}
        {list.length === 0 && <li className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70"><T fr="Aucun résultat." ar="لا نتيجة." /></li>}
      </ul>

      <p className="rounded-xl border border-dashed border-line p-3 text-xs opacity-70">
        <T fr="Liste de vigilance, non exhaustive: le logiciel ne remplace pas le bilan médicamenteux complet ni l'avis pharmacologique." ar="قائمة يقظة غير شاملة: البرمجية لا تعوّض المراجعة الدوائية الكاملة." />
      </p>
    </div>
  );
}

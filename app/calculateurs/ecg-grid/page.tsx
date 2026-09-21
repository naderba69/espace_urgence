"use client";
// v11.1-B — شبكة قراءة ECG خطوة-خطوة : ١٠ خطوات + تنبيهات حرجة.
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Activity } from "lucide-react";

type Step = { fr: string; ar: string; items: string[]; arItems: string[] };

const STEPS: Step[] = [
  {
    fr: "1. Qualité et calibrage", ar: "١. الجودة والمعايرة",
    items: ["25 mm/s, 10 mm/mV ; vérifier le filtre", "Artéfacts : tremblement, câble, mouvement"],
    arItems: ["٢٥ مم/ث، ١٠ مم/مف؛ تحقق من المرشّح", "التشويشات: رجفان، سلك، حركة"],
  },
  {
    fr: "2. Fréquence (300 / grandes cases)", ar: "٢. التواتر (٣٠٠ ÷ المربعات الكبرى)",
    items: ["Bradycardie < 60 : chercher BAV, médicaments", "Tachycardie > 100 : QRS fin ou large ?"],
    arItems: ["بطء < ٦٠: ابحث عن انسداد، أدوية", "تسرع > ١٠٠: QRS ضيّق أم عريض؟"],
  },
  {
    fr: "3. Rythme (sinusal ?)", ar: "٣. النظم (جيبي؟)",
    items: ["Onde P avant chaque QRS, P positive en DII", "Irrégulier : FA, extrasystoles, BAV variable"],
    arItems: ["موجة P قبل كل QRS موجبة في DII", "غير منتظم: رجفان أذيني، ضربات إضافية"],
  },
  {
    fr: "4. Axe (D1 / aVF)", ar: "٤. المحور (D1 / aVF)",
    items: ["D1 et aVF positifs = axe normal", "Désaxation : bloc fasciculaire, HVG, embolie"],
    arItems: ["D1 و aVF موجبان = محور طبيعي", "انحراف: حصار حزمة، تضخم بطين، انصمام"],
  },
  {
    fr: "5. Onde P et hypertrophie auriculaire", ar: "٥. الموجة P وتضخم الأذين",
    items: ["P > 120 ms en DII ou P bifide : OG", "P > 2,5 mm : OD"],
    arItems: ["P > ١٢٠ مللي ثانية أو مشقوقة: أذين أيسر", "P > ٢٫٥ مم: أذين أيمن"],
  },
  {
    fr: "6. Intervalle PR", ar: "٦. المسافة PR",
    items: ["PR > 200 ms = BAV 1er degré", "PR court + onde delta = WPW"],
    arItems: ["PR > ٢٠٠ مللي = انسداد درجة ١", "PR قصير + موجة دلتا = WPW"],
  },
  {
    fr: "7. QRS (durée, morphologie)", ar: "٧. QRS (المدّة والشكل)",
    items: ["QRS > 120 ms = bloc de branche / rythme ventriculaire", "Q fines profondes + R haut : HVG (Sokolow)"],
    arItems: ["QRS > ١٢٠ مللي = حصار حزمة/نظم بطيني", "موجات Q عميقة + R عالٍ: تضخم بطين أيسر"],
  },
  {
    fr: "8. Segment ST (le plus urgent)", ar: "٨. القطعة ST (الأكثر إلحاحاً)",
    items: ["Sus-décalage ≥ 1 mm dans 2 dérivations contiguës = STEMI", "Sus-décalage en miroir ?", "Sous-décalage / T inversées = SCA ST-"],
    arItems: ["ارتفاع ≥ ١ مم في مسارين متجاورين = STEMI", "هل يوجد انخفاض مقابِل؟", "انخفاض ST/T مقلوبة = متلازمة دون ارتفاع"],
  },
  {
    fr: "9. Onde T, QT, électrolytes", ar: "٩. الموجة T و QT والكهارل",
    items: ["T amples et pointues : hyperkaliémie", "T plates / U visibles : hypokaliémie", "QT long : torsades, médicaments"],
    arItems: ["T عالية مدبّبة: فرط بوتاسيوم", "T مسطّحة / موجة U: نقص بوتاسيوم", "QT طويل: تورساد، أدوية"],
  },
  {
    fr: "10. Comparer à l'ECG antérieur", ar: "١٠. المقارنة مع تخطيط سابق",
    items: ["Toute modification nouvelle est significative", "Chez l'enfant : fréquences et axes différents"],
    arItems: ["أي تغيّر جديد ذو دلالة", "عند الطفل: تواتر ومحاور مختلفة"],
  },
];

const ALERTS: { fr: string; ar: string }[] = [
  { fr: "STEMI: activer la filière — le temps est du muscle.", ar: "STEMI: فعّل المسار — الوقت عضلة." },
  { fr: "QRS large + tachycardie + instabilité: cardioversion.", ar: "QRS عريض + تسرع + عدم استقرار: تقويم نظم كهربائي." },
  { fr: "Bradycardie < 40 ou pauses > 3 s: atropine / entraînement.", ar: "بطء < ٤٠ أو توقفات > ٣ ث: أتروبين/تحفيز." },
  { fr: "QT long + syncope: arrêter les médicaments allongeant le QT.", ar: "QT طويل + إغماء: أوقف الأدوية المُطيلة." },
];

export default function EcgGridPage() {
  useRegisterRecent("calculateur:ecg-grid");
  const { lang } = useApp();
  const [done, setDone] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setDone((p) => { const n = new Set(p); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  const pct = Math.round((done.size / STEPS.length) * 100);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Activity className="h-6 w-6" />}
        title={lang === "ar" ? "شبكة قراءة ECG" : "Grille de lecture ECG"}
        sub={lang === "ar" ? "١٠ خطوات مرتبة — لا تقفز، علّم كل خطوة." : "10 étapes ordonnées — ne pas sauter, cocher chaque étape."}
      />

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <div className="mb-2 flex items-center justify-between text-sm font-black">
          <span>{lang === "ar" ? "التقدّم" : "Progression"}</span>
          <Badge tone={pct === 100 ? "standard" : "neutral"}>{pct}%</Badge>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface2">
          <div className="h-full rounded-full transition-all" style={{ width: pct + "%", background: "var(--accent)" }} />
        </div>
      </div>

      <ol className="flex flex-col gap-2">
        {STEPS.map((s, i) => {
          const on = done.has(i);
          return (
            <li key={i} className={`card rounded-2xl border p-3 ${on ? "border-transparent bg-surface2" : "border-line bg-surface"}`}>
              <button onClick={() => toggle(i)} aria-pressed={on} className="flex w-full items-start gap-3 text-start">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
                  style={on ? { background: "var(--accent)", color: "#fff" } : { border: "2px solid var(--line)" }}>
                  {on ? "✓" : i + 1}
                </span>
                <span className="text-sm font-black">{lang === "ar" ? s.ar : s.fr}</span>
              </button>
              <ul className="mt-2 flex flex-col gap-1 ps-9 text-xs font-bold opacity-75">
                {(lang === "ar" ? s.arItems : s.items).map((it, j) => <li key={j}>• {it}</li>)}
              </ul>
            </li>
          );
        })}
      </ol>

      <section className="card sev-strip sev-critical rounded-2xl border border-line bg-surface p-4">
        <p className="mb-2 text-base font-black" style={{ color: "var(--sev-critical)" }}><T fr="Alertes qui changent la conduite" ar="تنبيهات تغيّر التدبير" /></p>
        <ul className="flex flex-col gap-1 text-sm font-bold">
          {ALERTS.map((a, i) => <li key={i}>• {lang === "ar" ? a.ar : a.fr}</li>)}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/calculateurs/qtc" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Calculateur QTc" ar="حاسبة QTc" /></Link>
          <Link href="/calculateurs/stemi" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="STEMI: thrombolyse" ar="STEMI: إحلال الخثرة" /></Link>
          <Link href="/calculateurs/electrolytes" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Kaliémie" ar="البوتاسيوم" /></Link>
        </div>
      </section>
    </div>
  );
}

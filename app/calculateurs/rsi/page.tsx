"use client";
// v12.3-A — التسلسل السريع بالوزن : جرعات + تسلسل + تخدير ما بعد التنبيب.
import { useState } from "react";
import Link from "next/link";
import NumStepper from "@/components/ui/NumStepper";
import { useApp, usePrefillPatient } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Wind } from "lucide-react";

const DRUGS = [
  { id: "fent", fr: "Fentanyl (pré-charge)", ar: "فينتانيل", perKg: 2, unit: "µg", alt: 1, note: { fr: "1 µg/kg si instable", ar: "١ مغ/كغ إذا غير مستقر" } },
  { id: "eto", fr: "Étomidate", ar: "إتوميدات", perKg: 0.3, unit: "mg", alt: 0.3, note: { fr: "Hémodynamiquement neutre", ar: "محايد دورانياً" } },
  { id: "keta", fr: "Kétamine", ar: "كيتامين", perKg: 1.5, unit: "mg", alt: 1, note: { fr: "1re intention en préhospitalier", ar: "أولوية قبل المستشفى" } },
  { id: "prop", fr: "Propofol", ar: "بروبوفول", perKg: 1.5, unit: "mg", alt: 1, note: { fr: "Éviter si hypotension", ar: "يُتجنب عند هبوط الضغط" } },
  { id: "suc", fr: "Succinylcholine", ar: "سكسينيل كولين", perKg: 1.5, unit: "mg", alt: 1.2, note: { fr: "Durée 6-10 min", ar: "المدة ٦-١٠ د" } },
  { id: "roc", fr: "Rocuronium", ar: "روكورونيوم", perKg: 1.2, unit: "mg", alt: 1.2, note: { fr: "Durée 45-60 min", ar: "المدة ٤٥-٦٠ د" } },
];

export default function RsiPage() {
  useRegisterRecent("calculateur:rsi");
  const { lang } = useApp();
  const [weight, setWeight] = useState("");
  usePrefillPatient((p) => {
    if (!weight && p.w) setWeight(p.w);
  });
  const [unstable, setUnstable] = useState(false);

  const W = parseFloat(weight);
  const ok = Number.isFinite(W) && W > 0;
  const cell = "flex flex-col gap-1 rounded-xl border border-line bg-surface p-3";

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Wind className="h-6 w-6" />}
        title={lang === "ar" ? "التسلسل السريع للتنبيب" : "Séquence rapide d'intubation"}
        sub={lang === "ar" ? "الجرعات بالوزن، تسلسل الدقائق، والتخدير بعد التنبيب." : "Doses par poids, chronologie et sédation après intubation."}
      />

      <div className="grid grid-cols-2 gap-2">
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></span>
          <NumStepper value={ weight } onValue={ setWeight } className="w-full bg-transparent text-lg font-black tabular-nums outline-none" label="weight" /></label>
        <button onClick={() => setUnstable(!unstable)} aria-pressed={unstable}
          className={`touch rounded-xl border p-3 text-sm font-black text-start ${unstable ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
          style={unstable ? { background: "var(--sev-urgent)" } : undefined}>
          {unstable ? <T fr="Hémodynamique instable" ar="دورانياً غير مستقر" /> : <T fr="Hémodynamique stable" ar="دورانياً مستقر" />}
        </button>
      </div>

      {ok && (
        <ul className="flex flex-col gap-2">
          {DRUGS.map((d) => {
            const per = unstable ? d.alt : d.perKg;
            const val = d.unit === "µg" ? Math.round(per * W) : Math.round(per * W * 10) / 10;
            return (
              <li key={d.id} className={`card flex items-center justify-between gap-2 rounded-2xl border border-line bg-surface p-3 ${unstable ? "sev-strip sev-urgent" : "sev-strip sev-standard"}`}>
                <div>
                  <p className="text-sm font-black">{lang === "ar" ? d.ar : d.fr}</p>
                  <p className="text-xs opacity-70" dir="ltr">{per} {d.unit}/kg · {d.note[lang === "ar" ? "ar" : "fr"]}</p>
                </div>
                <p className="text-lg font-black tabular-nums" dir="ltr">{val} {d.unit}</p>
              </li>
            );
          })}
        </ul>
      )}

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <p className="text-base font-black"><T fr="Chronologie (0-10 min)" ar="التسلسل (٠-١٠ دقائق)" /></p>
        <ol className="mt-2 flex list-decimal flex-col gap-1 ps-5 text-sm font-bold">
          <li><T fr="0-3 min: préoxygénation (O2 100 %, optimum) + contrôle du col + aspiration prête." ar="٠-٣ د: أكسجة مسبقة + ضبط العنق + شفط جاهز." /></li>
          <li><T fr="Injection: hypnotique puis curare sans délai; jamais de curare sans hypnotique." ar="الحقن: مخدّر ثم مرخٍ دون تأخير؛ لا مرخٍ بدون مخدّر." /></li>
          <li dir="ltr" style={{ textAlign: "start" }}>45-60 s : laryngoscopie + tube + <b>capnographie obligatoire</b></li>
          <li><T fr="Position bilatérale confirmée; fixer le tube, radiographie." ar="تأكيد الموقع ثنائياً؛ تثبيت وتصوير." /></li>
        </ol>
      </section>

      <section className="card sev-strip sev-critical rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center gap-2"><Badge tone="critical"><T fr="Succinylcholine: jamais si…" ar="السكسينيل: لا تعطِ إذا…" /></Badge></div>
        <p className="mt-2 text-sm font-bold">
          <T fr="Hyperkaliémie, brûlures > 48 h, écrasement musculaire, dénervation, myopathie, antécédents d'hyperthermie maligne → rocuronium." ar="فرط بوتاسيوم، حروق > ٤٨ س، انضغاط عضلي، انقطاع تعصيب، اعتلال عضلي، تاريخ فرط حرارة خبيث ← روكورونيوم." />
        </p>
      </section>

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <p className="text-base font-black"><T fr="Sédation post-intubation" ar="التخدير بعد التنبيب" /></p>
        <ul className="mt-2 flex flex-col gap-1 text-sm font-bold" dir="ltr" style={{ textAlign: "start" }}>
          <li>Midazolam 2-5 mg/h + Fentanyl 50-100 µg/h (ou Sufentanil 5-10 µg/h)</li>
          <li>Kétamine 0,5-1 mg/kg/h si besoin analgésique fort</li>
          <li>Curare : seulement si désadaptation (monitorer le Neuro-M)</li>
        </ul>
        <p className="mt-1 text-xs font-bold opacity-70"><T fr="Objectif Ramsay 3-4; mydriase bilatérale et tension: revoir la sédation." ar="الهدف Ramsay ٣-٤؛ اتساع حدقة ثنائي وتوتر: راجع التخدير." /></p>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/doses-ped" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Doses pédiatriques" ar="جرعات الأطفال" /></Link>
        <Link href="/calculateurs/safe-dose" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Moteur de dose sûre" ar="محرّك الجرعة الآمنة" /></Link>
        <Link href="/calculateurs/interactions" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Interactions" ar="التفاعلات" /></Link>
      </div>
    </div>
  );
}

"use client";
// v12.1-C — التخفيف والتسريب : C1V1=C2V2 + سرعة التسريب + تعارضات.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Droplets } from "lucide-react";

const INCOMPAT: { fr: string; ar: string; fr2: string; ar2: string }[] = [
  { fr: "Ceftriaxone + calcium IV (ou solution de Ringer)", ar: "سيفترياكسون + كالسيوم وريدي (أو رينغر)", fr2: "Précipitation : décès rapporté chez le nouveau-né.", ar2: "ترسّب: وفيات مسجّلة عند الوليد." },
  { fr: "Phénytoïne + glucose (G5 %)", ar: "فينيتوين + غلوكوز ٥٪", fr2: "Cristaux : diluer uniquement dans du NaCl 0,9 %.", ar2: "بلورات: خفّف فقط بملح ٠٫٩٪." },
  { fr: "Amiodarone + héparine / NaCl concentré", ar: "أميودارون + هيبارين", fr2: "Précipitation : voie dédiée ou rincer entre les passages.", ar2: "ترسّب: مسار مخصص أو اغسل بين الأدوية." },
  { fr: "Aciclovir + plusieurs solutés (faible pH)", ar: "أسيكلوفير مع محاليل متعددة", fr2: "Toujours vérifier la compatibilité avant le Y.", ar2: "تحقق دائماً قبل الجمع على مسار واحد." },
  { fr: "Bicarbonates + calcium / catécholamines", ar: "بيكربونات + كالسيوم/كاتيكولامينات", fr2: "Précipitation et inactivation : rincer la voie.", ar2: "ترسّب وتعطيل: اغسل المسار." },
  { fr: "Vancomycine + héparine (même ligne)", ar: "فانكومايسين + هيبارين", fr2: "Précipitation ; perfuser à distance.", ar2: "ترسّب؛ أعطِ بفاصل." },
];

const DILUTIONS: { fr: string; ar: string; from: string; to: string }[] = [
  { fr: "Noradrénaline", ar: "نورأدرينالين", from: "ampoule 1 mg/mL", to: "diluer dans G5 % (4 mg/50 mL = 80 µg/mL)" },
  { fr: "Adrénaline", ar: "أدرينالين", from: "ampoule 1 mg/mL", to: "0,1 mg/mL pour usage IV (diluer 10×)" },
  { fr: "Dobutamine", ar: "دوبوتامين", from: "250 mg/20 mL", to: "500 mg/250 mL = 2 mg/mL" },
  { fr: "Insuline", ar: "أنسولين", from: "100 UI/mL", to: "1 UI/mL (1 mL dans 99 mL de NaCl) ou 0,1 UI/mL pédiatrique" },
  { fr: "Héparine", ar: "هيبارين", from: "5000 UI/mL", to: "100 UI/mL (1 mL dans 49 mL) pour la seringue électrique" },
];

export default function DilutionsPage() {
  useRegisterRecent("calculateur:dilutions");
  const { lang } = useApp();
  const [c1, setC1] = useState("");
  const [c2, setC2] = useState("");
  const [v2, setV2] = useState("");
  const [dose, setDose] = useState("");
  const [mg, setMg] = useState("");
  const [vol, setVol] = useState("");
  const [hours, setHours] = useState("");

  const r = useMemo(() => {
    const C1 = parseFloat(c1), C2 = parseFloat(c2), V2 = parseFloat(v2);
    const D = parseFloat(dose), M = parseFloat(mg), V = parseFloat(vol), H = parseFloat(hours);
    const need = Number.isFinite(C1) && Number.isFinite(C2) && Number.isFinite(V2) && C1 > 0 && C2 > 0 && C2 < C1
      ? (C2 * V2) / C1 : null;
    const solvent = need !== null ? V2 - need : null;
    const rate = Number.isFinite(M) && Number.isFinite(V) && Number.isFinite(H) && H > 0
      ? V / H : null;
    const doseRate = Number.isFinite(D) && Number.isFinite(M) && Number.isFinite(V) && Number.isFinite(H) && H > 0 && M > 0
      ? (D / M) * V / H : null;
    return { need, solvent, rate, doseRate, invalid: Number.isFinite(C2) && Number.isFinite(C1) && C2 >= C1 && C2 > 0 };
  }, [c1, c2, v2, dose, mg, vol, hours]);

  const rd = (n: number) => Math.round(n * 100) / 100;
  const cell = "flex flex-col gap-1 rounded-xl border border-line bg-surface p-3";
  const inp = "w-full bg-transparent text-lg font-black tabular-nums outline-none";

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Droplets className="h-6 w-6" />}
        title={lang === "ar" ? "التخفيف والتسريب" : "Dilution et perfusion"}
        sub={lang === "ar" ? "C1V1=C2V2، سرعة التسريب، والتعارضات التي لا تُخلط." : "C1V1=C2V2, vitesse de perfusion et incompatibilités à ne pas mélanger."}
      />

      <section className="flex flex-col gap-2">
        <p className="text-sm font-black opacity-70"><T fr="Préparer une dilution (C1V1 = C2V2)" ar="تحضير تخفيف (C1V1 = C2V2)" /></p>
        <div className="grid grid-cols-3 gap-2">
          <label className={cell}><span className="text-xs font-black opacity-70"><T fr="C1 mg/mL" ar="C1 مغ/مل" /></span>
            <input type="number" inputMode="decimal" value={c1} onChange={(e) => setC1(e.target.value)} className={inp} dir="ltr" /></label>
          <label className={cell}><span className="text-xs font-black opacity-70"><T fr="C2 voulue" ar="C2 المطلوب" /></span>
            <input type="number" inputMode="decimal" value={c2} onChange={(e) => setC2(e.target.value)} className={inp} dir="ltr" /></label>
          <label className={cell}><span className="text-xs font-black opacity-70"><T fr="V2 total" ar="V2 الكلي" /></span>
            <input type="number" inputMode="decimal" value={v2} onChange={(e) => setV2(e.target.value)} className={inp} dir="ltr" /></label>
        </div>
        {r.invalid && (
          <p className="rounded-xl p-3 text-sm font-black" style={{ background: "var(--sev-urgent-bg)", color: "var(--sev-urgent)" }}>
            <T fr="C2 doit être inférieure à C1: on ne concentre pas une solution par simple mélange." ar="يجب أن يكون C2 أقل من C1: لا يُركّز محلول بالمزج وحده." />
          </p>
        )}
        {r.need !== null && (
          <div className="card sev-strip sev-standard rounded-2xl border border-line bg-surface p-4">
            <p className="text-base font-black">
              {lang === "ar" ? "التحضير" : "Préparation"} : <span dir="ltr" className="tabular-nums">{rd(r.need)} mL</span> {lang === "ar" ? "من المحلول الأصلي" : "de solution mère"} + <span dir="ltr" className="tabular-nums">{rd(r.solvent ?? 0)} mL</span> {lang === "ar" ? "من المذيب" : "de solvant"}
            </p>
            <p className="mt-1 text-sm font-bold opacity-80">
              <T fr="Vérifier la stabilité après dilution (durée, lumière, température) et étiqueter la préparation." ar="تحقق من ثبات المحلول بعد التخفيف (المدة، الضوء، الحرارة) وسمّ العبوة." />
            </p>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-sm font-black opacity-70"><T fr="Vitesse de perfusion" ar="سرعة التسريب" /></p>
        <div className="grid grid-cols-3 gap-2">
          <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Dose voulue /h" ar="الجرعة المطلوبة/س" /></span>
            <input type="number" inputMode="decimal" value={dose} onChange={(e) => setDose(e.target.value)} className={inp} dir="ltr" /></label>
          <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Quantité dans la poche" ar="الكمية في الكيس" /></span>
            <input type="number" inputMode="decimal" value={mg} onChange={(e) => setMg(e.target.value)} className={inp} dir="ltr" /></label>
          <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Volume de la poche (mL)" ar="حجم الكيس (مل)" /></span>
            <input type="number" inputMode="decimal" value={vol} onChange={(e) => setVol(e.target.value)} className={inp} dir="ltr" /></label>
        </div>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Durée (heures)" ar="المدة (ساعات)" /></span>
          <input type="number" inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} className={inp} dir="ltr" /></label>
        {r.rate !== null && (
          <div className="card rounded-2xl border border-line bg-surface p-4">
            <p className="text-base font-black"><span dir="ltr" className="tabular-nums">{rd(r.rate)} mL/h</span> {lang === "ar" ? "سرعة مضخة" : "vitesse pompe"}</p>
            {r.doseRate !== null && <p className="mt-1 text-sm font-black" style={{ color: "var(--accent)" }}>
              = <span dir="ltr" className="tabular-nums">{rd(r.doseRate)}</span> {lang === "ar" ? "وحدة/ساعة (نفس وحدة الكمية)" : "unités/h (même unité que la quantité)"}
            </p>}
            <p className="mt-1 text-xs opacity-70"><T fr="À confronter au débit maximum autorisé pour la voie et à la tolérance du patient." ar="قارن مع السرعة القصوى المسموحة للمسار وتحمّل المريض." /></p>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-base font-black"><T fr="Dilutions de référence" ar="تخفيفات مرجعية" /></p>
        <ul className="flex flex-col gap-2">
          {DILUTIONS.map((d) => (
            <li key={d.fr} className="card rounded-2xl border border-line bg-surface p-3">
              <p className="text-sm font-black">{lang === "ar" ? d.ar : d.fr}</p>
              <p className="text-xs opacity-70" dir="ltr" style={{ textAlign: "start" }}>{d.from} → {d.to}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2"><Badge tone="critical"><T fr="Ne pas mélanger" ar="لا تخلط" /></Badge></div>
        <ul className="flex flex-col gap-2">
          {INCOMPAT.map((i) => (
            <li key={i.fr} className="card sev-strip sev-critical rounded-2xl border border-line bg-surface p-3">
              <p className="text-sm font-black">{lang === "ar" ? i.ar : i.fr}</p>
              <p className="mt-1 text-xs font-bold opacity-80">{lang === "ar" ? i.ar2 : i.fr2}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/safe-dose" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Moteur de dose sûre" ar="محرّك الجرعة الآمنة" /></Link>
        <Link href="/calculateurs/debit-perfusion" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Débit / gouttes" ar="السرعة/القطرات" /></Link>
        <Link href="/calculateurs/perfusions" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Amines (µg/kg/min)" ar="الأمينات" /></Link>
      </div>
    </div>
  );
}

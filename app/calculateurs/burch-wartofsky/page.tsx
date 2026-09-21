"use client";
// v8.0 — Score de Burch-Wartofsky : tempête thyroïdienne avérée (≥ 45) ou imminente (25-44).
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";

type Grp = { id: string; label: { fr: string; ar: string }; opts: { id: string; pts: number; fr: string; ar: string }[] };

const GROUPS: Grp[] = [
  { id: "temp", label: { fr: "Température", ar: "الحرارة" }, opts: [
    { id: "t0", pts: 0, fr: "< 37,2 °C", ar: "< 37.2" },
    { id: "t1", pts: 5, fr: "37,2-37,7 °C", ar: "37.2-37.7" },
    { id: "t2", pts: 10, fr: "37,8-38,2 °C", ar: "37.8-38.2" },
    { id: "t3", pts: 15, fr: "38,3-38,8 °C", ar: "38.3-38.8" },
    { id: "t4", pts: 20, fr: "38,9-39,3 °C", ar: "38.9-39.3" },
    { id: "t5", pts: 25, fr: "39,4-39,9 °C", ar: "39.4-39.9" },
    { id: "t6", pts: 30, fr: "≥ 40 °C", ar: "≥ 40" },
  ]},
  { id: "neuro", label: { fr: "Système nerveux central", ar: "الجهاز العصبي" }, opts: [
    { id: "n0", pts: 0, fr: "Absent", ar: "غائب" },
    { id: "n1", pts: 10, fr: "Léger: agitation", ar: "خفيف: هياج" },
    { id: "n2", pts: 20, fr: "Modéré: délire, psychose, léthargie", ar: "متوسط: هذيان، ذهان، خمول" },
    { id: "n3", pts: 30, fr: "Sévère: convulsions, coma", ar: "شديد: اختلاجات، غيبوبة" },
  ]},
  { id: "digestif", label: { fr: "Digestif / hépatique", ar: "هضمي / كبدي" }, opts: [
    { id: "d0", pts: 0, fr: "Absent", ar: "غائب" },
    { id: "d1", pts: 10, fr: "Modéré: diarrhée, nausées, vomissements, douleur", ar: "متوسط: إسهال، غثيان، تقيؤ، ألم" },
    { id: "d2", pts: 20, fr: "Sévère: ictère, insuffisance hépatique", ar: "شديد: يرقان، قصور كبدي" },
  ]},
  { id: "fc", label: { fr: "Fréquence cardiaque", ar: "النبض" }, opts: [
    { id: "f0", pts: 0, fr: "< 90 /min", ar: "< 90" },
    { id: "f1", pts: 5, fr: "90-109", ar: "90-109" },
    { id: "f2", pts: 10, fr: "110-119", ar: "110-119" },
    { id: "f3", pts: 15, fr: "120-129", ar: "120-129" },
    { id: "f4", pts: 20, fr: "130-139", ar: "130-139" },
    { id: "f5", pts: 25, fr: "≥ 140", ar: "≥ 140" },
  ]},
  { id: "ic", label: { fr: "Insuffisance cardiaque", ar: "قصور القلب" }, opts: [
    { id: "i0", pts: 0, fr: "Absente", ar: "غائب" },
    { id: "i1", pts: 5, fr: "Légère: œdème des MI", ar: "خفيف: وذمة طرفين" },
    { id: "i2", pts: 10, fr: "Modérée: crépitants bibasaux", ar: "متوسط: فرقعات قاعدية" },
    { id: "i3", pts: 15, fr: "Sévère: OAP franc", ar: "شديد: وذمة رئة صريحة" },
  ]},
  { id: "fa", label: { fr: "Fibrillation atriale", ar: "رجفان أذيني" }, opts: [
    { id: "fa0", pts: 0, fr: "Absente", ar: "غائب" },
    { id: "fa1", pts: 10, fr: "Présente", ar: "موجود" },
  ]},
  { id: "facteur", label: { fr: "Facteur précipitant", ar: "عامل محرض" }, opts: [
    { id: "p0", pts: 0, fr: "Absent", ar: "غائب" },
    { id: "p1", pts: 10, fr: "Présent (infection, chirurgie, arrêt ATS, iode, accouchement)", ar: "موجود (إنتان، جراحة، إيقاف مضاد درق، يود، ولادة)" },
  ]},
];

export default function BurchWartofskyPage() {
  const { lang } = useApp();
  const [sel, setSel] = useState<Record<string, string>>({ temp: "t0", neuro: "n0", digestif: "d0", fc: "f0", ic: "i0", fa: "fa0", facteur: "p0" });
  useRegisterRecent("calculateur:burch-wartofsky");

  const score = GROUPS.reduce((s, g) => s + (g.opts.find((o) => o.id === sel[g.id])?.pts ?? 0), 0);
  const band = score >= 45
    ? { cls: "bg-red-600", fr: "TEMPÊTE THYROÏDIENNE (≥ 45) — traiter immédiatement: PTU puis iode à 1 h, bêta-bloquant, hydrocortisone, refroidir", ar: "عاصفة درقية (≥ 45) — عالج فوراً: PTU ثم يود بعد ساعة، حاصر بيتا، هيدروكورتيزون، تبريد" }
    : score >= 25
      ? { cls: "bg-amber-500", fr: "TEMPÊTE IMMINENTE (25-44) — traiter comme une tempête en milieu de réanimation", ar: "عاصفة وشيكة (25-44) — عالج كالعاصفة في وسط إنعاش" }
      : { cls: "bg-blue-600", fr: "Tempête thyroïdienne peu probable (< 25) — rechercher une autre cause aux symptômes", ar: "العاصفة مستبعدة (< 25) — ابحث عن سبب آخر للأعراض" };

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header>
        <h1 className="text-2xl font-extrabold"><T fr="Burch-Wartofsky — tempête thyroïdienne" ar="بورش-وارتوفسكي — العاصفة الدرقية" /></h1>
      </header>

      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        {GROUPS.map((g) => (
          <fieldset key={g.id}>
            <legend className="mb-1.5 text-sm font-black text-blue-500"><T fr={g.label.fr} ar={g.label.ar} /></legend>
            <div className="flex flex-wrap gap-1.5">
              {g.opts.map((o) => {
                const on = sel[g.id] === o.id;
                return (
                  <button key={o.id} onClick={() => { setSel((p) => ({ ...p, [g.id]: o.id })); trackEvent("calculator_use", { id: "burch-wartofsky" }); }}
                    className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${on ? "border-blue-600 bg-blue-600/15 text-blue-400" : "border-line hover:bg-surface2"}`}>
                    <T fr={o.fr} ar={o.ar} />{o.pts > 0 && ` (+${o.pts})`}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className={`rounded-2xl p-5 text-center text-white ${band.cls}`}>
          <p className="text-5xl font-black tabular-nums">{score}</p>
          <p className="mt-2 font-bold">{lang === "ar" ? band.ar : band.fr}</p>
        </div>

        <button onClick={() => setSel({ temp: "t0", neuro: "n0", digestif: "d0", fc: "f0", ic: "i0", fa: "fa0", facteur: "p0" })}
          className="touch self-start rounded-xl border border-line px-5 py-2 font-semibold hover:bg-surface2">
          <T fr="Réinitialiser" ar="تصفير" />
        </button>
      </div>
    </div>
  );
}

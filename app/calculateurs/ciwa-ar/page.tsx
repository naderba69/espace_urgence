"use client";
// v8.3 — CIWA-Ar simplifié (sevrage alcoolique) : 10 items, ancres 0/2/4/7.
// < 8 léger (support) ; 8-15 modéré (benzos) ; 16-19 sévère ; ≥ 20 risque de DT → réanimation.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";

type Item = { id: string; fr: string; ar: string };

const ITEMS: Item[] = [
  { id: "nausee", fr: "Nausées / vomissements", ar: "غثيان / تقيؤ" },
  { id: "tremblement", fr: "Tremblement", ar: "رعاش" },
  { id: "sueurs", fr: "Sueurs", ar: "تعرق" },
  { id: "anxiete", fr: "Anxiété", ar: "قلق" },
  { id: "agitation", fr: "Agitation", ar: "هياج" },
  { id: "tactile", fr: "Troubles tactiles (démangeaisons, fourmillements)", ar: "اضطرابات لمسية (حكة، تنميل)" },
  { id: "auditif", fr: "Troubles auditifs (bruits, voix)", ar: "اضطرابات سمعية (أصوات، كلام)" },
  { id: "visuel", fr: "Troubles visuels (flou, hallucinations)", ar: "اضطرابات بصرية (غباش، هلاوس)" },
  { id: "cephalee", fr: "Céphalée / plénitude céphalique", ar: "صداع / ثقل بالرأس" },
  { id: "orientation", fr: "Orientation / obnubilation", ar: "توجه / تغيم الوعي" },
];

const ANCHORS = [
  { pts: 0, fr: "Absente", ar: "غائب" },
  { pts: 2, fr: "Légère", ar: "خفيف" },
  { pts: 4, fr: "Modérée", ar: "متوسط" },
  { pts: 7, fr: "Sévère", ar: "شديد" },
];

export default function CiwaArPage() {
  const { lang } = useApp();
  const [sel, setSel] = useState<Record<string, number>>(Object.fromEntries(ITEMS.map((i) => [i.id, 0])));
  useRegisterRecent("calculateur:ciwa-ar");

  const score = ITEMS.reduce((s, i) => s + (sel[i.id] ?? 0), 0);
  const band = score >= 20
    ? { cls: "bg-red-600", fr: "SEVRAGE TRÈS SÉVÈRE (≥ 20): risque de delirium tremens — benzodiazépines IV à haute dose, réanimation, thiamine 500 mg IV", ar: "انسحاب شديد جداً (≥ 20): خطر هذيان ارتعاشي — بنزوديازيبين وريدي بجرع عالية، إنعاش، ثيامين 500 ملغ وريدي" }
    : score >= 16
      ? { cls: "bg-red-500", fr: "SEVRAGE SÉVÈRE (16-19): benzodiazépines IV répétées (diazépam 10 mg/5-10 min jusqu'à sédation légère), surveillance continue", ar: "انسحاب شديد (16-19): بنزوديازيبين وريدي متكرر (ديازيبام 10 ملغ/5-10 د حتى تهدئة خفيفة)، مراقبة مستمرة" }
      : score >= 8
        ? { cls: "bg-amber-500", fr: "SEVRAGE MODÉRÉ (8-15): pharmacothérapie — diazépam 10-20 mg PO/IV, réévaluation CIWA toutes les 1-2 h, thiamine", ar: "انسحاب متوسط (8-15): علاج دوائي — ديازيبام 10-20 ملغ فموي/وريدي، إعادة تقييم كل 1-2 س، ثيامين" }
        : { cls: "bg-blue-600", fr: "SEVRAGE LÉGER (< 8): traitement de support — hydratation, thiamine, environnement calme, réévaluation à 1-2 h", ar: "انسحاب خفيف (< 8): علاج داعم — إماهة، ثيامين، بيئة هادئة، إعادة تقييم بعد 1-2 س" };

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header>
        <h1 className="text-2xl font-extrabold"><T fr="CIWA-Ar — sevrage alcoolique" ar="‏CIWA-Ar — الانسحاب الكحولي" /></h1>
        <p className="mt-1 text-sm opacity-70"><T fr="Ancres simplifiées 0-2-4-7 par item (max 70). Thiamine AVANT tout glucose." ar="مراسٍ مبسطة 0-2-4-7 لكل بند (الأقصى 70). ثيامين قبل أي غلوكوز." /></p>
      </header>
      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        {ITEMS.map((it) => (
          <fieldset key={it.id}>
            <legend className="mb-1.5 text-sm font-black text-blue-500"><T fr={it.fr} ar={it.ar} /></legend>
            <div className="flex flex-wrap gap-1.5">
              {ANCHORS.map((a) => {
                const on = sel[it.id] === a.pts;
                return (
                  <button key={a.pts} onClick={() => { setSel((p) => ({ ...p, [it.id]: a.pts })); trackEvent("calculator_use", { id: "ciwa-ar" }); }}
                    className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${on ? "border-blue-600 bg-blue-600/15 text-blue-400" : "border-line hover:bg-surface2"}`}>
                    <T fr={a.fr} ar={a.ar} />{a.pts > 0 && ` (+${a.pts})`}
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
        <button onClick={() => setSel(Object.fromEntries(ITEMS.map((i) => [i.id, 0])))}
          className="touch self-start rounded-xl border border-line px-5 py-2 font-semibold hover:bg-surface2">
          <T fr="Réinitialiser" ar="تصفير" />
        </button>
      </div>
    </div>
  );
}

"use client";
// v8.0 — Trou anionique + trou osmolaire : le duo qui démasque méthanol/éthylène glycol
// et oriente toute acidose métabolique.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";

export default function GapMetaboliquePage() {
  const { lang } = useApp();
  const [na, setNa] = useState("");
  const [cl, setCl] = useState("");
  const [hco3, setHco3] = useState("");
  const [gly, setGly] = useState("");
  const [uree, setUree] = useState("");
  const [osm, setOsm] = useState("");
  useRegisterRecent("calculateur:gap-metabolique");

  const NA = parseFloat(na), CL = parseFloat(cl), HCO3 = parseFloat(hco3);
  const GLY = parseFloat(gly), UREE = parseFloat(uree), OSM = parseFloat(osm);
  const ready = NA > 0 && CL > 0 && HCO3 > 0;
  const gap = ready ? Math.round((NA - CL - HCO3) * 10) / 10 : null;
  const osmCalc = ready && GLY > 0 && UREE > 0 ? 2 * NA + GLY + UREE : null;
  const trouOsm = osmCalc !== null && OSM > 0 ? Math.round((OSM - osmCalc) * 10) / 10 : null;
  const onChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => { setter(e.target.value); trackEvent("calculator_use", { id: "gap-metabolique" }); };

  const verdict = gap === null ? null
    : gap > 12 && trouOsm !== null && trouOsm > 10
      ? { cls: "bg-red-600", fr: "Trou anionique ↑ + trou osmolaire ↑: ALCOOL TOXIQUE (méthanol, éthylène glycol) jusqu'à preuve du contraire — antidote + dialyse", ar: "فجوة أنيونية ↑ + أسموزية ↑: كحول سام (ميثانول، إيثيلين غليكول) حتى يثبت العكس — ترياق + ديلزة" }
    : gap > 12
      ? { cls: "bg-amber-500", fr: "Acidose à trou anionique élevé: MUDPILES (méthanol, urémie, DKA, paralaldéhyde, INH/fer, lactate, éthylène glycol, salicylés)", ar: "حماض بفجوة أنيونية عالية: MUDPILES (ميثانول، يوريميا، حماض سكري، INH/حديد، لاكتات، إيثيلين غليكول، ساليسيلات)" }
    : gap >= 8
      ? { cls: "bg-blue-600", fr: "Trou anionique normal (8-12): pas d'acidose à TA élevé", ar: "فجوة أنيونية طبيعية (8-12): لا حماض بفجوة عالية" }
      : { cls: "bg-blue-600", fr: "Trou anionique bas — vérifier l'hypoalbuminémie (corriger: + 2,5 × (4 − albumine))", ar: "فجوة منخفضة — تحقق من نقص الألبومين (صحح: +2.5 × (4 − ألبومين))" };

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header>
        <h1 className="text-2xl font-extrabold"><T fr="Trou anionique & trou osmolaire" ar="الفجوة الأنيونية والفجوة الأسموزية" /></h1>
        <p className="mt-1 text-sm opacity-70"><T fr="TA = Na⁺ − Cl⁻ − HCO₃⁻ (normal 8-12). Osmolalité calculée = 2×Na⁺ + glycémie + urée (mmol/L); trou osmolaire = mesurée − calculée (normal < 10)." ar="الفجوة = صوديوم − كلور − بيكربونات (طبيعي 8-12). الأسموزية المحسوبة = 2×صوديوم + سكر + يوريا (ملي مول/ل)؛ الفجوة الأسموزية = المقاسة − المحسوبة (طبيعي < 10)." /></p>
      </header>

      <div className="card flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: { fr: "Na⁺ (mmol/L)", ar: "صوديوم (ملي مول/ل)" }, v: na, set: setNa, req: true },
            { label: { fr: "Cl⁻ (mmol/L)", ar: "كلور (ملي مول/ل)" }, v: cl, set: setCl, req: true },
            { label: { fr: "HCO₃⁻ (mmol/L)", ar: "بيكربونات (ملي مول/ل)" }, v: hco3, set: setHco3, req: true },
            { label: { fr: "Glycémie (mmol/L)", ar: "سكر (ملي مول/ل)" }, v: gly, set: setGly, req: false },
            { label: { fr: "Urée (mmol/L)", ar: "يوريا (ملي مول/ل)" }, v: uree, set: setUree, req: false },
            { label: { fr: "Osmolalité mesurée", ar: "أسموزية مقاسة" }, v: osm, set: setOsm, req: false },
          ].map((f) => (
            <label key={f.label.fr} className="flex flex-col gap-1">
              <span className="text-xs font-black opacity-70">
                {lang === "ar" ? f.label.ar : f.label.fr}{f.req ? " *" : ""}
              </span>
              <input inputMode="decimal" value={f.v} onChange={onChange(f.set)}
                className="touch rounded-xl border border-line bg-surface2 px-3 py-2.5 font-bold tabular-nums outline-none focus:border-blue-600" />
            </label>
          ))}
        </div>

        {gap !== null && (
          <div className="mt-1 flex flex-wrap gap-3">
            <div className="rounded-2xl bg-surface2 px-5 py-3 text-center">
              <p className="text-xs font-black opacity-60"><T fr="Trou anionique" ar="الفجوة الأنيونية" /></p>
              <p className="text-3xl font-black tabular-nums text-blue-500">{gap}</p>
            </div>
            {trouOsm !== null && (
              <div className="rounded-2xl bg-surface2 px-5 py-3 text-center">
                <p className="text-xs font-black opacity-60"><T fr="Trou osmolaire" ar="الفجوة الأسموزية" /></p>
                <p className={`text-3xl font-black tabular-nums ${trouOsm > 10 ? "text-red-500" : "text-blue-500"}`}>{trouOsm}</p>
              </div>
            )}
          </div>
        )}

        {verdict && (
          <div className={`rounded-2xl p-5 text-center text-white ${verdict.cls}`}>
            <p className="font-bold">{lang === "ar" ? verdict.ar : verdict.fr}</p>
          </div>
        )}
        <p className="text-xs opacity-60"><T fr="* champs obligatoires. Glycémie/urée nécessaires pour le trou osmolaire. Un trou osmolaire normal tardif n'exclut PAS le méthanol (métabolisé en acide formique: le TA prend le relais)." ar="* حقول إلزامية. السكر/اليوريا لازمة للفجوة الأسموزية. فجوة أسموزية طبيعية متأخرة لا تستبعد الميثانول (استُقلب لحمض الفورميك: الفجوة الأنيونية تكمل)." /></p>
      </div>
    </div>
  );
}

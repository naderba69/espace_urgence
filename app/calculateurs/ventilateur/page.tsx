"use client";
// Réglages ventilatoires initiaux : Vt 6–8 mL/kg de poids idéal + FR indicative par âge.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { Info } from "lucide-react";
import { ibwKg, tidalVolumeRange } from "@/lib/calc";

export default function VentilateurPage() {
  const { t, lang } = useApp();
  const [sex, setSex] = useState<"m" | "f">("m");
  const [taille, setTaille] = useState("170");
  useRegisterRecent("calculateur:ventilateur");

  const h = Number(taille);
  const ibw = h > 100 ? ibwKg(h, sex) : NaN;
  const [vt6, vt8] = !Number.isNaN(ibw) ? tidalVolumeRange(ibw) : [NaN, NaN];

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Réglages ventilatoires initiaux" ar="إعدادات التهوية الابتدائية" /></h1>
        <PrintButton />
      </header>

      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        <div className="flex gap-2" role="group" aria-label="sexe">
          {(["m", "f"] as const).map((s) => (
            <button key={s} onClick={() => setSex(s)} aria-pressed={sex === s}
              className={`touch flex-1 rounded-xl border px-4 py-3 font-bold ${sex === s ? "border-teal-600 bg-teal-600 text-white" : "border-line hover:bg-surface2"}`}>
              {s === "m" ? (lang === "ar" ? "ذكر" : "Homme") : (lang === "ar" ? "أنثى" : "Femme")}
            </button>
          ))}
        </div>
        <label className="flex flex-col gap-1 font-semibold">
          {lang === "ar" ? "القامة (سم)" : "Taille (cm)"}
          <input type="number" inputMode="decimal" value={taille} onChange={(e) => setTaille(e.target.value)}
            className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-2xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
        </label>

        {!Number.isNaN(ibw) && (
          <>
            <div className="rounded-2xl bg-teal-600 p-5 text-center text-white">
              <p className="text-sm font-semibold opacity-90"><T fr="Poids idéal (IBW)" ar="الوزن المثالي" /></p>
              <p className="text-3xl font-black tabular-nums">{Math.round(ibw)} kg</p>
              <p className="mt-2 text-sm"><T fr="Volume courant protecteur (6–8 mL/kg IBW)" ar="الحجم التياري الحمائي (6–8 مل/كغ)" /></p>
              <p className="text-4xl font-black tabular-nums">{vt6} – {vt8} mL</p>
            </div>
            <div className="grid gap-2 rounded-2xl border border-line bg-surface2 p-4 text-sm">
              <p><b>FR</b> : 12–20/min <T fr="adulte (nourrisson 30–40, enfant 20–30)" ar="كبير (رضيع 30–40، طفل 20–30)" /></p>
              <p><b>PEEP</b> : 5 cmHgO <T fr="initiale ; SpO2 cible 94–98 % (88–92 % BPCO)" ar="ابتدائية؛ تشبع 94–98% (88–92% انسداد مزمن)" /></p>
              <p><b>FiO2</b> : 100 % <T fr="au début puis réduire au besoin" ar="ابتداءً ثم خفّض حسب الحاجة" /></p>
            </div>
          </>
        )}

        <p className="flex gap-2 rounded-xl bg-amber-500/10 p-3 text-sm text-amber-500">
          <Info className="h-5 w-5 shrink-0" aria-hidden />
          <T fr="Ventilation protectrice : le volume se calcule sur le POIDS IDÉAL, pas le poids réel."
             ar="التهوية الحمائية: الحجم يُحسب على الوزن المثالي لا الحقيقي." />
        </p>
      </div>
      <p className="text-xs opacity-60">{t("common.disclaimer")}</p>
    </div>
  );
}

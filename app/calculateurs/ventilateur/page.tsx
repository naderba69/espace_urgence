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
              <p><b>PEEP</b> : 5 cmH₂O <T fr="initiale ; SpO2 cible 94–98 % (88–92 % BPCO)" ar="ابتدائية؛ تشبع 94–98% (88–92% انسداد مزمن)" /></p>
              <p><b>FiO₂</b> : 100 % <T fr="au début puis réduire au besoin" ar="ابتداءً ثم خفّض حسب الحاجة" /></p>
            </div>

            {/* Réglages avancés — plateau, I/E, triggers */}
            <div className="rounded-2xl border border-sky-600/60 bg-sky-600/10 p-4 text-sm">
              <h3 className="mb-2 font-extrabold text-sky-500"><T fr="Réglages avancés (ventilateur de transport/réa)" ar="إعدادات متقدمة (جهاز النقل/العناية)" /></h3>
              <ul className="list-disc space-y-1 ps-5">
                <li><b>Pplat</b> : <T fr="≤ 30 cmH₂O (mesurez 0,5 s de pause inspiratoire après un cycle)" ar="≤ 30 سم ماء (قِس بتوقف شهيق 0.5 ث)" /></li>
                <li><b>I:E</b> : 1:2 <T fr="normal ; 1:1,5–1:1 si hypoxémie réfractaire" ar="طبيعي؛ 1:1.5–1:1 إذا نقص أكسجين مقاوم" /></li>
                <li><b>Déclencheur</b> : <T fr="flux 2 L/min (adulte) ; sensible en pédiatrie" ar="تدفق 2 ل/د كهل؛ أكثر حساسية بالأطفال" /></li>
                <li><b>Pente (slope)</b> : <T fr="0,1–0,2 s (fixe une inspirat pression rapide)" ar="0.1–0.2 ث" /></li>
                <li><b>Auto-PEEP</b> : <T fr="débrancher 3 s pour la détecter ; cible &lt; 5 cmH₂O" ar="افصل 3 ث للكشف؛ الهدف < 5" /></li>
              </ul>
            </div>

            {/* Conduites selon la pathologie */}
            <div className="rounded-2xl border border-line bg-surface p-4 text-sm">
              <h3 className="mb-2 font-extrabold"><T fr="Adapter selon la pathologie" ar="تكييف حسب الحالة" /></h3>
              <div className="space-y-2">
                {([
                  ["SDRA / poumon difficile", "SDRA/رئة صعبة", "Vt 4–6 mL/kg IBW, PEEP ≥ 10–15, Pplat ≤ 30, tolérer hypercapnie (pH > 7,25)", "Vt 4–6 مل/كغ، PEEP ≥ 10–15، Pplat ≤ 30، تسامح مع فرط CO₂ (pH>7.25)"],
                  ["BPCO obstructif", "انسداد مزمن", "FR 10–12, temps expiratoire long (I:E 1:3 à 1:4), PEEP extrinsèque ≤ 80 % de l'auto-PEEP, éviter hyperinflation", "FR 10–12، زفير طويل (1:3–1:4)، PEEP خارجية ≤ 80% من الداخلية، تجنب فرط النفخ"],
                  ["Asthme aigu grave ventilé", "ربو حاد منتبب", "FR 8–10, Vt 6–8 mL/kg, PEEP ≈ 0–5, expire long ; paralyser si dyssynchronie", "FR 8–10، Vt 6–8، PEEP ≈ 0–5، زفير طويل؛ شلل عند عدم التزامن"],
                  ["Œdème pulmonaire", "وذمة رئوية", "PEEP 10–12 rapidement, FiO2 titré à SpO2 94 %, diurétique + vasodilatateurs parallèles", "PEEP 10–12 بسرعة، FiO2 معاير 94%، مدرّات وموسعات موازية"],
                ] as const).map(([t, ta, d, da]) => (
                  <details key={t} className="rounded-xl border border-line bg-surface2 px-3 py-2">
                    <summary className="cursor-pointer font-bold text-teal-500">{lang === "ar" ? ta : t}</summary>
                    <p className="mt-1 opacity-80">{lang === "ar" ? da : d}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Vérifications à l'installation */}
            <div className="rounded-2xl border border-line bg-surface p-4 text-sm">
              <h3 className="mb-2 font-extrabold"><T fr="Après branchement — ne pas oublier" ar="بعد التوصيل — لا تنسَ" /></h3>
              <ul className="list-disc space-y-1 ps-5">
                <li><T fr="Auscultation bilatérale symétrique + soulèvement des deux hémichamps" ar="إصغاء ثنائي متناظر + انتفاخ الصدرين" /></li>
                <li><T fr="EtCO2 branché dès l'intubation (cible 30–35 post-choc) et trace continu" ar="EtCO2 منذ التنبيب (هدف 30–35) ومسار مستمر" /></li>
                <li><T fr="Position 30–45° (demi-assise) + sécurisation du ballonnet (pression 20–30 cmH₂O)" ar="وضعية 30–45° + ضغط الكفة 20–30 سم ماء" /></li>
                <li><T fr="Alarmes réglées : Pmax ≤ 40, Vt exp ± 20 %, déconnexion" ar="إنذارات: Pmax ≤ 40، انقطاع، Vt زفيري ±20%" /></li>
              </ul>
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

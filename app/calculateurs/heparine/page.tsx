"use client";
// HNF IV : calcul initial strictement conditionné par l'indication choisie.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { heparin } from "@/lib/calc";
import { trackEvent } from "@/lib/analytics";

const PRESETS = [
  { label: "25 000 UI / 500 mL", perMl: 50 },
  { label: "25 000 UI / 250 mL", perMl: 100 },
];

type Indication = "" | "acs" | "vte";

const REGIMENS = {
  acs: { bolusPerKg: 60, maxBolusU: 4000, infusionPerKgH: 12, maxInfusionUh: 1000 },
  // Exemple de protocole institutionnel UW Medicine (pas un standard universel).
  vte: { bolusPerKg: 80, maxBolusU: 10000, infusionPerKgH: 18, maxInfusionUh: null },
} as const;

export default function HeparinePage() {
  const { t } = useApp();
  const [weight, setWeight] = useState("70");
  const [perMl, setPerMl] = useState(100);
  const [indication, setIndication] = useState<Indication>("");
  const [fibrinolysis, setFibrinolysis] = useState(false);
  useRegisterRecent("calculateur:heparine");

  const kg = Number(weight);
  const regimen = indication ? REGIMENS[indication] : null;
  const h = regimen && Number.isFinite(kg) && kg > 0
    ? heparin(kg, regimen.bolusPerKg, regimen.maxBolusU, regimen.infusionPerKgH, regimen.maxInfusionUh, perMl)
    : null;

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Héparine HNF IV — dose initiale par indication" ar="هيبارين غير مجزأ وريدي — الجرعة حسب الاستطباب" /></h1>
      </header>

      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        <label className="flex flex-col gap-1 font-semibold">
          <T fr="Indication / protocole de départ" ar="الاستطباب / بروتوكول البداية" />
          <select aria-label="Indication de l’héparine" value={indication} onChange={(e) => {
            setIndication(e.target.value as Indication);
            trackEvent("calculator_use", { id: "heparine" });
          }} className="rounded-xl border border-line bg-surface2 px-3 py-3">
            <option value=""><T fr="Choisir avant tout calcul…" ar="اختر الاستطباب قبل الحساب…" /></option>
            <option value="acs"><T fr="SCA — anticoagulation initiale, hors bolus de PCI" ar="متلازمة تاجية — مضاد التخثر الأولي، دون دفعة القسطرة" /></option>
            <option value="vte"><T fr="TVP/EP — HNF retenue par l’équipe" ar="خثار وريدي/صمة رئوية — اختار الفريق الهيبارين غير المجزأ" /></option>
          </select>
        </label>

        <label className="flex flex-col gap-1 font-semibold">
          {t("common.weight")}
          <input type="number" min="1" max="350" step="0.1" inputMode="decimal" value={weight}
            onChange={(e) => { setWeight(e.target.value); trackEvent("calculator_use", { id: "heparine" }); }}
            className="rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-2xl tabular-nums outline-none focus:ring-2 focus:ring-blue-600" />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Concentration de la seringue">
          {PRESETS.map((p) => (
            <button key={p.perMl} onClick={() => setPerMl(p.perMl)} aria-pressed={perMl === p.perMl}
              className={`touch flex-1 rounded-xl border px-4 py-3 font-bold ${perMl === p.perMl ? "border-blue-600 bg-blue-600 text-white" : "border-line hover:bg-surface2"}`}>
              {p.label}
              <span className="block text-xs opacity-70">{p.perMl} UI/mL</span>
            </button>
          ))}
        </div>

        {indication === "acs" && (
          <>
            <label className="flex items-start gap-3 rounded-xl border border-line p-3">
              <input type="checkbox" checked={fibrinolysis} onChange={(e) => setFibrinolysis(e.target.checked)} className="mt-1 size-5" />
              <span><T fr="Fibrinolyse concomitante : appliquer la cible TCA spécifique" ar="تحليل الخثرة بالتزامن: استخدم هدف TCA الخاص" /></span>
            </label>
            <p className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 text-sm">
              <T fr="Ne pas utiliser ce schéma pour le bolus de salle de cathétérisme/PCI : le bolus de 70–100 UI/kg dépend de l’anticoagulation préalable et se règle sur l’ACT (cible 250–300 s selon le protocole)."
                ar="لا تستخدم هذا المخطط لدفعة القسطرة/PCI: الجرعة تعتمد على مضاد التخثر السابق وACT (الهدف 250–300 ث حسب البروتوكول)." />
            </p>
          </>
        )}

        {indication === "vte" && (
          <p className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 text-sm">
            <T fr="EP : la recommandation AHA/ACC 2026 préfère l’HBPM à l’HNF pour l’anticoagulation parentérale initiale dans la plupart des cas. Ce calcul n’est qu’un exemple de protocole HNF UW Medicine pour TVP/EP lorsque l’équipe a déjà choisi l’HNF; vérifier le protocole local et les particularités du patient."
              ar="الصمة الرئوية: توصي إرشادات AHA/ACC 2026 بالهيبارين منخفض الوزن الجزيئي غالباً بدلاً من غير المجزأ. هذا الحساب مثال من بروتوكول UW Medicine عند اختيار غير المجزأ؛ تحقق من البروتوكول المحلي وحالة المريض." />
          </p>
        )}

        {h && h.bolusU > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">
            <div className="rounded-2xl bg-sky-700 p-4 text-center text-white">
              <p className="text-xs font-semibold opacity-90">
                {indication === "acs"
                  ? <T fr="Bolus initial (60 UI/kg, max 4 000 UI)" ar="دفعة أولية (60 وحدة/كغ، أقصى 4000)" />
                  : <T fr="Bolus initial (80 UI/kg, max. 10 000 UI — protocole UW)" ar="دفعة أولية (80 وحدة/كغ، أقصى 10000 — بروتوكول UW)" />}
              </p>
              <p className="text-3xl font-black tabular-nums">{Math.round(h.bolusU)} UI</p>
              <p className="text-xs opacity-80">= {Math.round(h.bolusU / perMl * 10) / 10} mL</p>
            </div>
            <div className="rounded-2xl bg-blue-600 p-4 text-center text-white">
              <p className="text-xs font-semibold opacity-90">
                {indication === "acs"
                  ? <T fr="Débit initial (12 UI/kg/h, max 1 000 UI/h)" ar="التدفق الأولي (12 وحدة/كغ/س، أقصى 1000 وحدة/س)" />
                  : <T fr="Débit initial (18 UI/kg/h — protocole UW)" ar="التدفق الأولي (18 وحدة/كغ/س — بروتوكول UW)" />}
              </p>
              <p className="text-3xl font-black tabular-nums">{Math.round(h.rateUh)} UI/h</p>
              <p className="text-xs opacity-80">= {Math.round(h.rateMlH * 10) / 10} mL/h ({perMl} UI/mL)</p>
            </div>
          </div>
        ) : indication ? (
          <p role="alert" className="text-sm font-semibold text-red-700"><T fr="Poids non valide : saisir un poids adulte positif." ar="الوزن غير صالح: أدخل وزناً موجباً للبالغ." /></p>
        ) : (
          <p className="rounded-xl border border-line p-3 text-sm"><T fr="Aucune dose n’est affichée avant le choix explicite de l’indication. Les plafonds et objectifs de surveillance ne sont pas interchangeables."
            ar="لا تظهر جرعة قبل اختيار الاستطباب صراحةً. الحدود وأهداف المراقبة غير قابلة للتبادل." /></p>
        )}

        {indication === "acs" && (
          <p className="text-sm opacity-80">
            {fibrinolysis
              ? <T fr="Surveillance du TCA selon la cible thérapeutique 50–70 s avec fibrinolyse; premier ajustement et contrôles selon protocole cardiologique/local."
                  ar="راقب TCA بهدف 50–70 ثانية مع تحليل الخثرة؛ التعديل والفحوص وفق البروتوكول المحلي." />
              : <T fr="Surveillance du TCA : cible 60–80 s pour le SCA médical selon la recommandation; contrôler et ajuster selon le protocole cardiologique/local."
                  ar="راقب TCA: الهدف 60–80 ثانية في SCA وفق التوصية؛ افحص وعدّل حسب البروتوكول المحلي." />}
          </p>
        )}
        {indication === "vte" && (
          <p className="text-sm opacity-80"><T fr="Protocole UW Medicine : premier anti-Xa à 6 h, cible anti-Xa 0,3–0,7 UI/mL; si TCA utilisé, suivre la plage et l’algorithme validés par le laboratoire et l’établissement, sans ratio générique."
            ar="بروتوكول UW Medicine: أول anti-Xa بعد 6 ساعات، الهدف 0.3–0.7 وحدة/مل؛ إذا استُخدم TCA فاتبع مجال المختبر والبروتوكول المعتمد دون نسبة عامة." /></p>
        )}
      </div>

      <div className="text-xs opacity-70">
        <p><T fr="Sources consultées (liens externes) :" ar="المراجع التي تمت مراجعتها (روابط خارجية):" /></p>
        <ul className="list-inside list-disc">
          <li><a className="underline" href="https://www.ahajournals.org/doi/10.1161/CIR.0000000000001309" target="_blank" rel="noreferrer">AHA/ACC — SCA 2025, Table 10 et corrections 2025 (dose HNF/cibles TCA)</a></li>
          <li><a className="underline" href="https://www.ahajournals.org/doi/10.1161/CIR.0000000000001415" target="_blank" rel="noreferrer">AHA/ACC — EP 2026 (choix de l’anticoagulant)</a></li>
          <li><a className="underline" href="https://sites.uw.edu/anticoag/drugs/heparin/" target="_blank" rel="noreferrer">UW Medicine — schémas institutionnels HNF (TVP/EP)</a></li>
        </ul>
        <p className="mt-2">{t("common.disclaimer")}</p>
      </div>
    </div>
  );
}

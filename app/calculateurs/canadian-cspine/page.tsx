"use client";
// v7.9 — Règle canadienne du rachis cervical : qui imager après un trauma ?
// Logique en cascade : facteurs haut risque → imagerie ; sinon facteurs bas risque + rotation 45°.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";

const HIGH = [
  { id: "age", fr: "Âge ≥ 65 ans", ar: "العمر ≥ 65" },
  { id: "mecanisme", fr: "Mécanisme dangereux (chute > 1 m / 5 marches, charge axiale, AVP > 100 km/h, tonneaux, éjection, vélo/moto)", ar: "آلية خطرة (سقوط > 1 م/5 درجات، تحميل محوري، حادث > 100 كم/س، انقلاب، قذف، دراجة)" },
  { id: "parest", fr: "Paresthésies des extrémités", ar: "تنميل الأطراف" },
];

const LOW = [
  { id: "arriere", fr: "Collision arrière simple", ar: "اصطدام خلفي بسيط" },
  { id: "assis", fr: "Position assise possible aux urgences", ar: "إمكانية الجلوس في الاستعجالي" },
  { id: "marche", fr: "A pu marcher à un moment", ar: "استطاع المشي في أي لحظة" },
  { id: "retard", fr: "Apparition retardée des cervicalgies", ar: "ظهور متأخر لآلام الرقبة" },
  { id: "milieu", fr: "ABSENCE de douleur à la palpation de la ligne médiane", ar: "غياب ألم بجس الخط الأوسط" },
];

export default function CanadianCspinePage() {
  const { lang } = useApp();
  const [high, setHigh] = useState<Set<string>>(new Set());
  const [low, setLow] = useState<Set<string>>(new Set());
  const [rotate, setRotate] = useState<boolean | null>(null);
  useRegisterRecent("calculateur:canadian-cspine");

  const toggle = (set: Set<string>, id: string, apply: (s: Set<string>) => void) => {
    const n = new Set(set);
    if (n.has(id)) { n.delete(id); } else { n.add(id); }
    apply(n);
    trackEvent("calculator_use", { id: "canadian-cspine" });
  };

  const verdict = high.size > 0
    ? { cls: "bg-red-600", fr: "IMAGERIE OBLIGATOIRE (facteur de haut risque)", ar: "تصوير إلزامي (عامل خطر عالٍ)" }
    : low.size === 0
      ? { cls: "bg-surface2 text-fg", fr: "Coche au moins un facteur de bas risque pour poursuivre", ar: "علّم عامل خطر منخفضاً واحداً على الأقل للمتابعة" }
      : rotate === null
        ? { cls: "bg-amber-500", fr: "Teste la rotation active: 45° à gauche ET à droite ?", ar: "اختبر الدوران النشط: 45° يميناً ويساراً؟" }
        : rotate
          ? { cls: "bg-blue-600", fr: "PAS d'imagerie nécessaire — risque de lésion < 1 %", ar: "لا حاجة للتصوير — خطر الإصابة < 1%" }
          : { cls: "bg-red-600", fr: "IMAGERIE OBLIGATOIRE (rotation limitée)", ar: "تصوير إلزامي (دوران محدود)" };

  const section = (title: { fr: string; ar: string }, rows: typeof HIGH, set: Set<string>, apply: (s: Set<string>) => void, danger: boolean) => (
    <div className="flex flex-col gap-2">
      <p className={`text-xs font-black uppercase tracking-wide ${danger ? "text-red-500" : "text-blue-500"}`}><T fr={title.fr} ar={title.ar} /></p>
      {rows.map((r) => {
        const on = set.has(r.id);
        return (
          <button key={r.id} role="checkbox" aria-checked={on} onClick={() => toggle(set, r.id, apply)}
            className={`touch rounded-xl border px-4 py-3 text-start text-sm font-semibold ${on ? danger ? "border-red-600 bg-red-600/15 text-red-400" : "border-blue-600 bg-blue-600/15 text-blue-400" : "border-line hover:bg-surface2"}`}>
            <T fr={r.fr} ar={r.ar} />
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <header>
        <h1 className="text-2xl font-extrabold"><T fr="Règle canadienne — rachis cervical" ar="القاعدة الكندية — الرقبة" /></h1>
        <p className="mt-1 text-sm opacity-70"><T fr="Patient alerte et coopératif, trauma < 7 jours. Sensibilité ~100 %." ar="مريض يقظ متعاون، رض < 7 أيام. الحساسية ~100%." /></p>
      </header>

      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        {section({ fr: "1 · Facteurs de HAUT risque (un seul ⇒ imagerie)", ar: "1 · عوامل خطر عالية (واحد ⇒ تصوير)" }, HIGH, high, setHigh, true)}
        {high.size === 0 && section({ fr: "2 · Facteurs de BAS risque (permettent d'évaluer la mobilité)", ar: "2 · عوامل خطر منخفضة (تتيح تقييم الحركة)" }, LOW, low, setLow, false)}
        {high.size === 0 && low.size > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-black uppercase tracking-wide text-blue-500"><T fr="3 · Rotation active du cou" ar="3 · الدوران النشط للرقبة" /></p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setRotate(true); trackEvent("calculator_use", { id: "canadian-cspine" }); }} aria-pressed={rotate === true}
                className={`touch rounded-xl border py-3 font-black ${rotate === true ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
                <T fr="Oui (45° bilatéral)" ar="نعم (45° بالجهتين)" />
              </button>
              <button onClick={() => { setRotate(false); trackEvent("calculator_use", { id: "canadian-cspine" }); }} aria-pressed={rotate === false}
                className={`touch rounded-xl border py-3 font-black ${rotate === false ? "border-red-600 bg-red-600 text-white" : "border-line"}`}>
                <T fr="Non / impossible" ar="لا / غير ممكن" />
              </button>
            </div>
          </div>
        )}

        <div className={`rounded-2xl p-5 text-center text-lg font-black text-white ${verdict.cls}`}>
          {lang === "ar" ? verdict.ar : verdict.fr}
        </div>
      </div>
    </div>
  );
}

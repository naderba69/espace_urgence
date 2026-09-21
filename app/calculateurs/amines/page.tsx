"use client";
// v1.9 — pompe-seringue avancée : sélecteur de catécholamine + moteur 3 modes.
import { useState } from "react";
import { MED_TOOLS } from "@/data/med-tools";
import PumpTool from "@/components/tools/PumpTool";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";

const DRUGS = [
  { id: "noradrenaline", fr: "Noradrénaline", ar: "نورأدرينالين" },
  { id: "adrenaline", fr: "Adrénaline", ar: "أدرينالين" },
  { id: "dobutamine", fr: "Dobutamine", ar: "دوبوتامين" },
  { id: "amiodarone", fr: "Amiodarone", ar: "أميودارون" },
  { id: "propofol", fr: "Propofol", ar: "بروبوفول" },
] as const;

export default function AminesPage() {
  const [drug, setDrug] = useState<(typeof DRUGS)[number]["id"]>("noradrenaline");
  useRegisterRecent("calculateur:amines");
  const cfg = MED_TOOLS[drug]?.pump;
  const name = DRUGS.find((d) => d.id === drug)!;
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Amines — pompe avancée" ar="الأمينات — مضخة متقدمة" /></h1>
      </header>

      <div className="flex flex-wrap gap-2" role="radiogroup">
        {DRUGS.map((d) => (
          <button key={d.id} role="radio" aria-checked={drug === d.id} onClick={() => setDrug(d.id)}
            className={`touch rounded-full border px-4 py-2 text-sm font-black transition ${drug === d.id ? "border-blue-600 bg-blue-600 text-white" : "border-line opacity-70 hover:opacity-100"}`}>
            <T fr={d.fr} ar={d.ar} />
          </button>
        ))}
      </div>

      {cfg && <PumpTool cfg={cfg} storageKey={`eutn:pump:${drug}`} />}
      <p className="text-xs opacity-50">
        <T fr="Votre préparation départementale est mémorisée par médicament sur cet appareil."
          ar="يُحفظ تحضير قسمكم لكل دواء على هذا الجهاز." />
      </p>
      <span className="sr-only">{name.fr}</span>
    </div>
  );
}

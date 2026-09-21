"use client";
// v2.8 — Broselow : longueur → zone couleur, équipement et doses PALS.
import { useState } from "react";
import { broselowZone, broselowDoses, type BroselowZone } from "@/lib/calc";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";

const COLOR_CLS: Record<string, string> = {
  gray: "bg-zinc-500", pink: "bg-pink-500", red: "bg-red-600", purple: "bg-purple-600",
  yellow: "bg-yellow-400 text-black", white: "bg-zinc-100 text-black", blue: "bg-blue-600",
  orange: "bg-orange-500", green: "bg-green-600",
};

const COLOR_NAME: Record<string, { fr: string; ar: string }> = {
  gray: { fr: "Gris", ar: "رمادي" }, pink: { fr: "Rose", ar: "وردي" }, red: { fr: "Rouge", ar: "أحمر" },
  purple: { fr: "Violet", ar: "بنفسجي" }, yellow: { fr: "Jaune", ar: "أصفر" }, white: { fr: "Blanc", ar: "أبيض" },
  blue: { fr: "Bleu", ar: "أزرق" }, orange: { fr: "Orange", ar: "برتقالي" }, green: { fr: "Vert", ar: "أخضر" },
};

export default function BroselowPage() {
  useRegisterRecent("calculateur:broselow");
  const [len, setLen] = useState("80");
  const z = broselowZone(Number(len) || 0);

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <h1 className="text-2xl font-extrabold">Broselow</h1>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-bold opacity-70"><T fr="Longueur talon-tête (cm)" ar="الطول من الرأس إلى الكعب (سم)" /></span>
        <input type="number" inputMode="decimal" value={len} onChange={(e) => setLen(e.target.value)}
          className="rounded-xl border border-line bg-[color:var(--surface-2)] px-3 py-3 text-center text-2xl font-black tabular-nums outline-none focus:ring-2 focus:ring-blue-600" />
      </label>

      {z === "neo" && (
        <p className="rounded-xl bg-amber-500/15 p-4 font-black text-amber-500">
          <T fr="< 46 cm: nouveau-né — protocole néonatal (réanimation néonatale)." ar="أقل من 46 سم: حديث ولادة — بروتوكول إنعاش الولدان." />
        </p>
      )}
      {z === "adult" && (
        <p className="rounded-xl bg-amber-500/15 p-4 font-black text-amber-500">
          <T fr="> 143 cm: doses adultes (poids réel si connu)." ar="أكثر من 143 سم: جرعات الكبار (الوزن الحقيقي إن عُرف)." />
        </p>
      )}

      {typeof z === "object" && <ZoneCard z={z} />}

      <p className="text-xs opacity-60">
        <T fr="Estimation: utilisez le poids réel dès que possible; équipement selon la longueur même si surpoids."
           ar="تقدير: استعمل الوزن الحقيقي متى أمكن؛ والمعدات حسب الطول حتى مع السمنة." />
      </p>
    </div>
  );
}

function ZoneCard({ z }: { z: BroselowZone }) {
  const d = broselowDoses(z);
  const n = COLOR_NAME[z.color];
  return (
    <div className="flex flex-col gap-3">
      <div className={`rounded-2xl p-5 text-white shadow-xl ${COLOR_CLS[z.color]}`}>
        <p className="text-2xl font-black"><T fr={n.fr} ar={n.ar} /> — {z.kgMin}–{z.kgMax} kg</p>
        <p className="mt-1 text-sm font-bold opacity-90">
          <T fr="SONDE" ar="أنبوب" /> : {z.ettUncuffed} <T fr="sans ballonnet" ar="بدون كفة" /> / {z.ettCuffed} <T fr="avec ballonnet" ar="بكفة" /> · <T fr="lame" ar="شفرة" /> {z.blade}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm font-black">
        {([
          [<T key="1" fr="Adrénaline AC IV" ar="أدرنالين توقف وريدي" />, `${d.epiIvMg} mg = ${d.epiIvMl} mL (1:10 000)`],
          [<T key="2" fr="Adrénaline IM anaphylaxie" ar="أدرنالين عضلي للأرجية" />, `${d.epiImMg} mg (1:1000)`],
          [<T key="3" fr="Amiodarone" ar="أميودارون" />, `${d.amioMg} mg`],
          [<T key="4" fr="Adénosine 1ʳᵉ dose" ar="أدينوزين الأولى" />, `${d.adenoMg} mg`],
          [<T key="5" fr="Remplissage NS" ar="توسيع مصل ملحي" />, `${d.bolusMl} mL`],
          [<T key="6" fr="Choc (1ʳᵉ)" ar="صدمة أولى" />, `${d.defibJ} J`],
          [<T key="7" fr="D10 hypoglycémie" ar="D10 لنقص السكر" />, `${d.d10Ml} mL`],
        ] as [React.ReactNode, string][]).map(([lab, val], i) => (
          <p key={i} className="rounded-xl border border-line bg-surface p-3">
            <span className="block text-xs opacity-60">{lab}</span>
            <span className="tabular-nums" dir="ltr">{val}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

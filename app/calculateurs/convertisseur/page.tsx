"use client";
// Convertisseur d'unités usuelles — paires bidirectionnelles.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { ArrowLeftRight, Scale, ClipboardList } from "lucide-react";

const PAIRS = [
  { id: "mass", a: "mg", b: "µg", toB: (v: number) => v * 1000, toA: (v: number) => v / 1000 },
  { id: "weight", a: "kg", b: "lb", toB: (v: number) => v * 2.20462, toA: (v: number) => v / 2.20462 },
  { id: "temp", a: "°C", b: "°F", toB: (v: number) => v * 9 / 5 + 32, toA: (v: number) => (v - 32) * 5 / 9 },
  { id: "press", a: "mmHg", b: "kPa", toB: (v: number) => v / 7.50062, toA: (v: number) => v * 7.50062 },
  { id: "glucose", a: "mg/dL", b: "mmol/L", toB: (v: number) => v / 18, toA: (v: number) => v * 18 },
  { id: "creat", a: "mg/dL", b: "µmol/L", toB: (v: number) => v * 88.4, toA: (v: number) => v / 88.4 },
  { id: "bun", a: "BUN mg/dL", b: "urée mmol/L", toB: (v: number) => v * 0.357, toA: (v: number) => v / 0.357 },
  { id: "bili", a: "mg/dL", b: "µmol/L", toB: (v: number) => v * 17.1, toA: (v: number) => v / 17.1 },
  { id: "chol", a: "mg/dL", b: "mmol/L", toB: (v: number) => v * 0.0259, toA: (v: number) => v / 0.0259 },
  { id: "calc", a: "mg/dL", b: "mmol/L", toB: (v: number) => v * 0.25, toA: (v: number) => v / 0.25 },
  { id: "lactate", a: "mg/dL", b: "mmol/L", toB: (v: number) => v * 0.111, toA: (v: number) => v / 0.111 },
  { id: "hb", a: "g/dL", b: "g/L", toB: (v: number) => v * 10, toA: (v: number) => v / 10 },
  { id: "ethanol", a: "mg/dL", b: "mmol/L", toB: (v: number) => v * 0.217, toA: (v: number) => v / 0.217 },
];

// Valeurs critiques : ce qui doit réveiller immédiatement.
const CRIT: { fr: string; ar: string; low: string; high: string }[] = [
  { fr: "Glycémie", ar: "السكر", low: "< 2,8 mmol/L (50 mg/dL)", high: "> 25 mmol/L (450 mg/dL)" },
  { fr: "Kaliémie", ar: "البوتاسيوم", low: "< 2,5 mmol/L", high: "> 6,5 mmol/L" },
  { fr: "Natrémie", ar: "الصوديوم", low: "< 120 mmol/L", high: "> 155 mmol/L" },
  { fr: "Calcium total", ar: "الكالسيوم الكلي", low: "< 1,65 mmol/L", high: "> 3,5 mmol/L" },
  { fr: "Hémoglobine", ar: "الهيموغلوبين", low: "< 7 g/dL", high: "> 20 g/dL" },
  { fr: "Plaquettes", ar: "الصفائح", low: "< 50 ×10⁹/L", high: "> 1000 ×10⁹/L" },
  { fr: "Lactate", ar: "اللاكتات", low: "—", high: "> 4 mmol/L" },
  { fr: "INR", ar: "INR", low: "—", high: "> 5" },
  { fr: "pH artériel", ar: "pH شرياني", low: "< 7,20", high: "> 7,60" },
  { fr: "Bilirubine (nouveau-né)", ar: "البيليروبين (حديث)", low: "—", high: "> 340 µmol/L" },
];

function round6(n: number) {
  return Math.round(n * 1e6) / 1e6;
}

export default function ConvertisseurPage() {
  const { lang } = useApp();
  useRegisterRecent("calculateur:convertisseur");
  const [values, setValues] = useState<Record<string, { a: string; b: string }>>({});

  const setField = (id: string, side: "a" | "b", raw: string) => {
    const pair = PAIRS.find((p) => p.id === id)!;
    const num = Number(raw);
    const other =
      raw === "" || Number.isNaN(num) ? "" : String(round6(side === "a" ? pair.toB(num) : pair.toA(num)));
    setValues((prev) => ({ ...prev, [id]: side === "a" ? { a: raw, b: other } : { a: other, b: raw } }));
  };

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <PageHeader
        icon={<Scale className="h-6 w-6" />}
        title={<T fr="Convertisseur et valeurs critiques" ar="المحوّل والقيم الحرجة" />}
        sub={<T fr="Unités usuelles + conversions de laboratoire, et le seuil qui change la conduite." ar="وحدات شائعة + تحويلات مخبرية، والعتبة التي تغيّر التدبير." />}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {PAIRS.map((p) => {
          const v = values[p.id] ?? { a: "", b: "" };
          return (
            <div key={p.id} className="card rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-center gap-2">
                <input inputMode="decimal" aria-label={p.a} value={v.a} onChange={(e) => setField(p.id, "a", e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-xl tabular-nums outline-none focus:ring-2 focus:ring-blue-600" />
                <span className="shrink-0 text-sm font-bold">{p.a}</span>
              </div>
              <div className="my-2 flex justify-center text-blue-500"><ArrowLeftRight className="h-5 w-5" aria-hidden /></div>
              <div className="flex items-center gap-2">
                <input inputMode="decimal" aria-label={p.b} value={v.b} onChange={(e) => setField(p.id, "b", e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-xl tabular-nums outline-none focus:ring-2 focus:ring-blue-600" />
                <span className="shrink-0 text-sm font-bold">{p.b}</span>
              </div>
            </div>
          );
        })}
      </div>

      <section className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-base font-black"><ClipboardList className="h-5 w-5" aria-hidden /><T fr="Valeurs critiques à retenir" ar="قيم حرجة يجب حفظها" /></p>
        <ul className="flex flex-col gap-2">
          {CRIT.map((c) => (
            <li key={c.fr} className="card sev-strip sev-critical flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-surface p-3">
              <span className="text-sm font-black">{lang === "ar" ? c.ar : c.fr}</span>
              <span className="flex flex-wrap items-center gap-2 text-xs font-black">
                {c.low !== "—" && <Badge tone="urgent"><span dir="ltr">{c.low}</span></Badge>}
                <Badge tone="critical"><span dir="ltr">{c.high}</span></Badge>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

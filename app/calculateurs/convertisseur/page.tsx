"use client";
// Convertisseur d'unités usuelles — paires bidirectionnelles.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import { ArrowLeftRight } from "lucide-react";

const PAIRS = [
  { id: "mass", a: "mg", b: "µg", toB: (v: number) => v * 1000, toA: (v: number) => v / 1000 },
  { id: "weight", a: "kg", b: "lb", toB: (v: number) => v * 2.20462, toA: (v: number) => v / 2.20462 },
  { id: "temp", a: "°C", b: "°F", toB: (v: number) => v * 9 / 5 + 32, toA: (v: number) => (v - 32) * 5 / 9 },
  { id: "press", a: "mmHg", b: "kPa", toB: (v: number) => v / 7.50062, toA: (v: number) => v * 7.50062 },
];

function round6(n: number) {
  return Math.round(n * 1e6) / 1e6;
}

export default function ConvertisseurPage() {
  const { t } = useApp();
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
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">{t("nav.calculators")} — °C/kg/mg…</h1>
        <PrintButton />
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {PAIRS.map((p) => {
          const v = values[p.id] ?? { a: "", b: "" };
          return (
            <div key={p.id} className="card rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-center gap-2">
                <input inputMode="decimal" aria-label={p.a} value={v.a} onChange={(e) => setField(p.id, "a", e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
                <span className="shrink-0 text-sm font-bold">{p.a}</span>
              </div>
              <div className="my-2 flex justify-center text-teal-500"><ArrowLeftRight className="h-5 w-5" aria-hidden /></div>
              <div className="flex items-center gap-2">
                <input inputMode="decimal" aria-label={p.b} value={v.b} onChange={(e) => setField(p.id, "b", e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-line bg-surface2 px-3 py-3 text-center text-xl tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
                <span className="shrink-0 text-sm font-bold">{p.b}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

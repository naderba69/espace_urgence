"use client";
// v7.9 — générateur de score par cases à cocher : même UX que Wells, réutilisable.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";

export interface ScItem { id: string; pts: number; fr: string; ar: string }
export interface ScBand { min: number; fr: string; ar: string; cls: string }

export default function ScoreCalc({ calcId, title, items, bands, note }: {
  calcId: string;
  title: { fr: string; ar: string };
  items: ScItem[];
  bands: ScBand[];   // triées par min croissant — la dernière avec score ≥ min gagne
  note?: { fr: string; ar: string };
}) {
  const { lang } = useApp();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  useRegisterRecent(`calculateur:${calcId}`);

  const score = items.filter((i) => checked.has(i.id)).reduce((s, i) => s + i.pts, 0);
  const band = [...bands].reverse().find((b) => score >= b.min) ?? bands[0];

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header>
        <h1 className="text-2xl font-extrabold"><T fr={title.fr} ar={title.ar} /></h1>
      </header>

      <div className="card flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        {items.map((i) => {
          const on = checked.has(i.id);
          return (
            <button key={i.id} role="checkbox" aria-checked={on}
              onClick={() => { setChecked((p) => { const n = new Set(p); if (on) { n.delete(i.id); } else { n.add(i.id); } return n; }); trackEvent("calculator_use", { id: calcId }); }}
              className={`touch flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-start font-semibold ${on ? "border-blue-600 bg-blue-600/15 text-blue-400" : "border-line hover:bg-surface2"}`}>
              <span><T fr={i.fr} ar={i.ar} /></span>
              <span className="shrink-0 font-black tabular-nums text-blue-500">+{i.pts}</span>
            </button>
          );
        })}

        <div className={`mt-2 rounded-2xl p-5 text-center text-white ${band.cls}`}>
          <p className="text-5xl font-black tabular-nums">{score}</p>
          <p className="mt-2 font-bold">{lang === "ar" ? band.ar : band.fr}</p>
        </div>

        {note && <p className="text-xs opacity-60"><T fr={note.fr} ar={note.ar} /></p>}

        <button onClick={() => setChecked(new Set())}
          className="touch self-start rounded-xl border border-line px-5 py-2 font-semibold hover:bg-surface2">
          <T fr="Réinitialiser" ar="تصفير" />
        </button>
      </div>
    </div>
  );
}

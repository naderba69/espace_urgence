"use client";
// Débit de perfusion : mL/h et gouttes/min (kit 20 gouttes/mL ou microgouttes 60/mL).
import { useEffect, useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";
import { readJSON, writeJSON } from "@/lib/storage";
import { dripRate } from "@/lib/calc";

const STORE = "eutn:calc:debit";

export default function DebitPage() {
  const { t, lang, hydrated } = useApp();
  const [volume, setVolume] = useState("500");
  const [hours, setHours] = useState("8");
  const [dropsPerMl, setDropsPerMl] = useState<20 | 60>(20);
  useRegisterRecent("calculateur:debit-perfusion");

  useEffect(() => {
    if (!hydrated) return;
    const s = readJSON<{ volume: string; hours: string; dropsPerMl: 20 | 60 }>(STORE, null as never);
    if (s) { setVolume(s.volume); setHours(s.hours); setDropsPerMl(s.dropsPerMl); }
  }, [hydrated]);
  useEffect(() => {
    if (hydrated) writeJSON(STORE, { volume, hours, dropsPerMl });
  }, [volume, hours, dropsPerMl, hydrated]);

  const v = Number(volume);
  const h = Number(hours);
  const ok = v > 0 && h > 0;
  const { mlh, gttMin, secPerDrop } = dripRate(v, h, dropsPerMl);

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Débit de perfusion" ar="تدفّق الحقن الوريدي" /></h1>
        <PrintButton />
      </header>

      <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
        <label className="flex flex-col gap-1 font-semibold">
          {lang === "ar" ? "الحجم (مل)" : "Volume (mL)"}
          <input type="number" min="0" inputMode="decimal" value={volume} onChange={(e) => { setVolume(e.target.value); trackEvent("calculator_use", { id: "debit" }); }}
            className="rounded-xl border border-line bg-surface2 px-3 py-3 text-2xl text-center tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
        </label>
        <label className="flex flex-col gap-1 font-semibold">
          {lang === "ar" ? "المدة (ساعات)" : "Durée (heures)"}
          <input type="number" min="0" step="0.5" inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)}
            className="rounded-xl border border-line bg-surface2 px-3 py-3 text-2xl text-center tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
        </label>

        <div className="flex gap-2" role="group" aria-label="kit">
          {([20, 60] as const).map((d) => (
            <button key={d} onClick={() => setDropsPerMl(d)} aria-pressed={dropsPerMl === d}
              className={`touch flex-1 rounded-xl border px-4 py-3 font-bold ${dropsPerMl === d ? "border-teal-600 bg-teal-600 text-white" : "border-line bg-surface hover:bg-surface2"}`}>
              {d === 20
                ? (lang === "ar" ? "عادي — 20 قطرة/مل" : "Standard — 20 gouttes/mL")
                : (lang === "ar" ? "دقيق — 60 قطرة/مل" : "Microgouttes — 60/mL")}
            </button>
          ))}
        </div>

        {ok && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-teal-600 p-5 text-center text-white">
              <p className="text-sm font-semibold opacity-90">mL/h</p>
              <p className="text-3xl font-black tabular-nums">{Math.round(mlh * 10) / 10}</p>
            </div>
            <div className="rounded-2xl bg-sky-700 p-5 text-center text-white">
              <p className="text-sm font-semibold opacity-90">{lang === "ar" ? "قطرة/دقيقة" : "gouttes/min"}</p>
              <p className="text-3xl font-black tabular-nums">{Math.round(gttMin)}</p>
              <p className="text-xs opacity-80">{lang === "ar" ? `≈ قطرة كل ${Number.isFinite(secPerDrop) ? Math.round(secPerDrop * 10) / 10 : "—"} ث` : `≈ 1 goutte / ${Number.isFinite(secPerDrop) ? Math.round(secPerDrop * 10) / 10 : "—"} s`}</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs opacity-60">{t("common.disclaimer")}</p>
    </div>
  );
}

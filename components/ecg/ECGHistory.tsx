"use client";
// Historique des analyses (IndexedDB) : miniatures, suppression, comparaison 2 à 2.
import { useEffect, useState } from "react";
import { listEcgRecords, deleteEcgRecord, clearEcgRecords, type EcgRecord } from "@/lib/ecg-db";
import { useApp } from "@/components/Providers";
import ECGResultCard from "./ECGResultCard";
import { GitCompareArrows, Trash2 } from "lucide-react";
import Image from "next/image";

export default function ECGHistory({ refreshKey }: { refreshKey: number }) {
  const { t, lang } = useApp();
  const [records, setRecords] = useState<EcgRecord[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [compare, setCompare] = useState(false);

  const reload = async () => setRecords(await listEcgRecords());
  useEffect(() => { void reload(); }, [refreshKey]);

  if (records.length === 0) return null;

  const toggleSel = (id: number) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id].slice(-2)));
  const cmp = records.filter((r) => r.id !== undefined && selected.includes(r.id));

  const fmtDate = (ts: number) =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar-TN" : "fr-FR", { dateStyle: "short", timeStyle: "short" }).format(ts);

  return (
    <section className="card rounded-2xl border border-line bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold">{t("ai.ecg.resultsQueue")}</h2>
        <div className="flex gap-2 no-print">
          <button onClick={() => setCompare((c) => !c)} disabled={selected.length !== 2}
            className="touch gap-2 rounded-xl border border-line px-3 py-2 text-sm font-semibold hover:bg-surface2 disabled:opacity-40">
            <GitCompareArrows className="h-4 w-4" aria-hidden /> {t("ai.ecg.compare")}
          </button>
          <button onClick={() => { void clearEcgRecords().then(reload); setSelected([]); }}
            className="touch gap-2 rounded-xl border border-red-500/50 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10">
            <Trash2 className="h-4 w-4" aria-hidden /> {t("ai.ecg.clearAll")}
          </button>
        </div>
      </div>

      {compare && cmp.length === 2 && (
        <div className="mb-4 grid gap-4 md:grid-cols-2">
          {cmp.map((r) => (
            <div key={r.id} className="rounded-2xl border border-line p-2">
              <p className="mb-1 text-xs opacity-60">{fmtDate(r.ts)}</p>
              <div className="relative mb-2 aspect-[4/3] w-full overflow-hidden rounded-lg bg-black">
                <Image src={r.thumb} alt="ECG" fill className="object-contain" unoptimized />
              </div>
              <ECGResultCard analysis={r.analysis} raw={r.raw} />
            </div>
          ))}
        </div>
      )}

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {records.map((r) => {
          const on = r.id !== undefined && selected.includes(r.id);
          return (
            <li key={r.id} className={`card relative overflow-hidden rounded-xl border ${on ? "border-teal-600 ring-2 ring-teal-600" : "border-line"}`}>
              <button onClick={() => r.id !== undefined && toggleSel(r.id)} aria-pressed={on} className="block w-full">
                <div className="relative aspect-[4/3] w-full bg-black">
                  <Image src={r.thumb} alt="ECG" fill className="object-contain" unoptimized />
                </div>
                <div className="p-2 text-start">
                  <p className="truncate text-xs font-bold">{r.analysis.suspectedDiagnosis ?? "—"}</p>
                  <p className="text-[11px] opacity-60">{fmtDate(r.ts)}</p>
                </div>
              </button>
              <button
                onClick={() => { if (r.id !== undefined) void deleteEcgRecord(r.id).then(reload); }}
                aria-label={t("ai.ecg.delete")}
                className="touch absolute end-1 top-1 rounded-lg bg-black/60 text-white hover:bg-red-600">
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

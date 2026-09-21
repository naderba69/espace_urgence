"use client";
// v3.3 — إحصاءات استخدام محلية 100% (تُخزّن على الجهاز فقط، دون أي إرسال).
import { useEffect, useState } from "react";
import { readLocalStats, resetLocalStats } from "@/lib/analytics";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import { BarChart3 } from "lucide-react";
import T from "@/components/T";

const pretty = (k: string) =>
  k.replace(/^(procedure_view|medication_view|protocol_view|calculateur_view|view):/, "").replace(/:/g, " · ");

export default function StatsPage() {
  useRegisterRecent("stats");
  const [rows, setRows] = useState<[string, number][]>([]);
  const reload = () => setRows(Object.entries(readLocalStats()).sort((a, b) => b[1] - a[1]).slice(0, 20));
  useEffect(() => {
    const id = setTimeout(reload, 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <header className="flex items-center justify-between gap-2">
        <PageHeader icon={<BarChart3 className="h-6 w-6" />} title={<T fr="Statistiques locales" ar="إحصاءات محلية" />} />
        {rows.length > 0 && (
          <button onClick={() => { resetLocalStats(); reload(); }}
            className="touch rounded-xl border border-line px-4 py-2 text-sm font-bold">
            <T fr="Effacer" ar="امسح" />
          </button>
        )}
      </header>

      <p className="rounded-xl bg-blue-600/10 p-3 text-sm font-bold text-blue-500">
        <T fr="Compteurs stockés uniquement sur cet appareil — aucun envoi réseau."
           ar="عدادات محفوظة على هذا الجهاز فقط — دون أي إرسال شبكي." />
      </p>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center opacity-70">
          <T fr="Pas encore de données: naviguez dans l'app, les compteurs se rempliront."
             ar="لا بيانات بعد: تصفّح التطبيق وستمتلئ العدادات." />
        </p>
      ) : (
        <ul className="space-y-1">
          {rows.map(([k, n]) => (
            <li key={k} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm">
              <span className="break-words font-bold" dir="ltr">{pretty(k)}</span>
              <span className="shrink-0 rounded-full bg-blue-600/15 px-3 py-1 font-black tabular-nums text-blue-500">{n}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs opacity-60"><T fr="Utile pour repérer vos référentiels les plus consultés et orienter les formations." ar="مفيد لرصد أكثر المراجع استخداماً وتوجيه التدريب." /></p>
    </div>
  );
}

"use client";
// Liste des médicaments : filtre texte + par classe + drapeau haut risque.
import { useMemo, useState } from "react";
import Link from "next/link";
import { medications } from "@/data/medications";
import { normalize } from "@/lib/search";
import { useApp } from "@/components/Providers";
import { FavoriteButton } from "@/components/Chrome";
import { Pill, ShieldAlert, Search } from "lucide-react";

export default function MedicationsPage() {
  const { lang, t } = useApp();
  const [q, setQ] = useState("");
  const [klass, setKlass] = useState<string | null>(null);

  const klasses = useMemo(
    () => Array.from(new Set(medications.map((m) => m.klass.fr))),
    []
  );

  const list = useMemo(() => {
    const nq = normalize(q);
    return medications.filter((m) => {
      if (klass && m.klass.fr !== klass) return false;
      if (!nq) return true;
      const hay = normalize(`${m.name.fr} ${m.name.ar} ${m.synonyms.join(" ")} ${m.brands ?? ""}`);
      return nq.split(/\s+/).every((tok) => hay.includes(tok));
    });
  }, [q, klass]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-3">
          <Search className="h-5 w-5 opacity-60" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            aria-label={t("search.placeholder")}
            className="w-full bg-transparent py-3 outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2" role="listbox" aria-label="classes">
          <button
            onClick={() => setKlass(null)}
            aria-pressed={klass === null}
            className={`rounded-full px-4 py-2 text-sm font-semibold border ${klass === null ? "bg-teal-600 text-white border-teal-600" : "border-line bg-surface hover:bg-surface2"}`}
          >
            {lang === "ar" ? "الكل" : "Tous"}
          </button>
          {klasses.map((k) => (
            <button
              key={k}
              onClick={() => setKlass(k === klass ? null : k)}
              aria-pressed={klass === k}
              className={`rounded-full px-4 py-2 text-sm font-semibold border ${klass === k ? "bg-teal-600 text-white border-teal-600" : "border-line bg-surface hover:bg-surface2"}`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 && <p className="opacity-70">{t("search.noResults")}</p>}

      <ul className="grid gap-3 sm:grid-cols-2">
        {list.map((m) => (
          <li key={m.id}>
            <div className="card flex items-start justify-between gap-2 rounded-2xl border border-line bg-surface p-4 hover:border-teal-600 transition h-full">
              <Link href={`/medicaments/${m.id}`} className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-bold leading-snug">
                  <Pill className="h-4 w-4 shrink-0 text-teal-500" aria-hidden />
                  {lang === "ar" ? m.name.ar : m.name.fr}
                </p>
                <p className="mt-1 text-sm opacity-70">{lang === "ar" ? m.klass.ar : m.klass.fr}</p>
                {m.brands && <p className="mt-1 text-xs opacity-50">{m.brands}</p>}
                {m.highRisk && (
                  <p className="mt-2 inline-flex items-center gap-1 rounded-lg bg-red-500/15 px-2 py-1 text-xs font-bold text-red-400">
                    <ShieldAlert className="h-3.5 w-3.5" aria-hidden /> {t("common.highRisk")}
                  </p>
                )}
              </Link>
              <FavoriteButton itemKey={`medicament:${m.id}`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";
// Liste des médicaments : filtre texte + par classe + drapeau haut risque.
import { useMemo, useState } from "react";
import Link from "next/link";
import { medications } from "@/data/medications";
import { normalize } from "@/lib/text"; // v17.0 — وحدة خفيفة: لا تسحب فهرس البحث
import { useApp } from "@/components/Providers";
import MedicationCard from "@/components/cards/MedicationCard";
import { Search, Pill } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

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
      <PageHeader icon={<Pill className="h-6 w-6" />} title={t("nav.medications")} sub={t("page.meds.sub")} count={medications.length} />
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
        <div className="eutn-secnav sticky top-1 z-30 flex gap-1.5 overflow-x-auto py-1" role="listbox" aria-label="classes">
          <button
            onClick={() => setKlass(null)}
            aria-pressed={klass === null}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold border ${klass === null ? "bg-blue-600 text-white border-blue-600" : "border-line bg-surface hover:bg-surface2"}`}
          >
            {lang === "ar" ? "الكل" : "Tous"}
          </button>
          {klasses.map((k) => (
            <button
              key={k}
              onClick={() => setKlass(k === klass ? null : k)}
              aria-pressed={klass === k}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold border ${klass === k ? "bg-blue-600 text-white border-blue-600" : "border-line bg-surface hover:bg-surface2"}`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 && <p className="opacity-70">{t("search.noResults")}</p>}

      <ul className="grid gap-4 sm:grid-cols-2">
        {list.map((m) => (
          <li key={m.id}>
            <MedicationCard medication={m} />
          </li>
        ))}
      </ul>

      {/* v15.0 — بنية A: أدوات الفئة تُستدعى سياقياً من ثيم الأدوية */}
      <section aria-label={lang === "ar" ? "أدوات الدواء" : "Outils médicaments"}>
        <h2 className="mb-2 border-s-4 ps-3 text-lg font-bold" style={{ borderColor: "var(--accent)" }}>
          {lang === "ar" ? "أدوات الدواء" : "Outils médicaments"}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {[
            { href: "/calculateurs/dose-check", fr: "Dose check", ar: "تدقيق الجرعة" },
            { href: "/calculateurs/interactions", fr: "Interactions", ar: "التداخلات" },
            { href: "/calculateurs/antidotes", fr: "Antidotes", ar: "الترياقات" },
            { href: "/calculateurs/renal-dose", fr: "Adaptation rénale", ar: "التكيّف الكلوي" },
            { href: "/calculateurs/dilutions", fr: "Dilutions", ar: "التخفيفات" },
            { href: "/calculateurs/debit-perfusion", fr: "Débit de perfusion", ar: "سرعة التسريب" },
          ].map((o) => (
            <li key={o.href}>
              <Link href={o.href} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface2">
                {lang === "ar" ? o.ar : o.fr}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

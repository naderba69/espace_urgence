"use client";

import type { RenalCourse } from "@/lib/renal-clearance";
import T from "@/components/T";

interface RenalCourseSelectorProps {
  value: RenalCourse;
  onChange: (value: RenalCourse) => void;
}

const OPTIONS: {
  id: RenalCourse;
  fr: string;
  ar: string;
  detailFr: string;
  detailAr: string;
  color: string;
}[] = [
  {
    id: "unknown",
    fr: "Inconnue / mesure isolée",
    ar: "غير معروفة / تحليل واحد",
    detailFr: "Un DFG peut être estimé, mais une créatinine isolée ne prouve ni la stabilité ni le caractère chronique. Aucun dosage fondé sur une grille stable n'est activé.",
    detailAr: "يمكن تقدير DFG، لكن تحليل كرياتينين منفرداً لا يثبت الاستقرار أو المزمنة. لا تُفعّل جرعة مبنية على جدول الوظيفة المستقرة.",
    color: "var(--sev-urgent)",
  },
  {
    id: "stable",
    fr: "Stable / chronique connue",
    ar: "مستقرة / مزمنة معروفة",
    detailFr: "À sélectionner seulement après vérification du contexte clinique et des résultats disponibles. Les règles restent limitées aux médicaments, populations et sources explicitement couverts.",
    detailAr: "اختر هذا المسار بعد مراجعة السياق السريري والنتائج المتاحة فقط. تبقى القواعد محصورة في الأدوية والفئات والمراجع المغطاة صراحةً.",
    color: "var(--accent)",
  },
  {
    id: "acute",
    fr: "Aiguë / variable / suspectée",
    ar: "حادّة / متغيرة / مشتبه بها",
    detailFr: "Une atteinte aiguë ou une créatinine qui évolue n'est pas couverte par les grilles de fonction stable ; demander une évaluation et un protocole adaptés.",
    detailAr: "القصور الحاد أو الكرياتينين المتغير لا تغطيه جداول الوظيفة المستقرة؛ اطلب تقييماً وبروتوكولاً مناسباً.",
    color: "var(--sev-critical)",
  },
];

export default function RenalCourseSelector({ value, onChange }: RenalCourseSelectorProps) {
  const selected = OPTIONS.find((option) => option.id === value) ?? OPTIONS[0];

  return (
    <fieldset className="rounded-2xl border border-line bg-surface p-3">
      <legend className="px-1 text-xs font-black opacity-75">
        <T fr="Évolution de la fonction rénale" ar="مسار وظيفة الكلى" />
      </legend>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Évolution de la fonction rénale / مسار وظيفة الكلى">
        {OPTIONS.map((option) => {
          const active = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={`touch rounded-full border px-3 py-2 text-xs font-black ${active ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
              style={active ? { background: option.color } : undefined}
            >
              <T fr={option.fr} ar={option.ar} />
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs leading-relaxed font-bold opacity-80">
        <T fr={selected.detailFr} ar={selected.detailAr} />
      </p>
    </fieldset>
  );
}

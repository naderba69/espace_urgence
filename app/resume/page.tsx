"use client";
// v16.2 — ملخص الحالة: فيشة تسليم واحدة — المريض + الثوابت (اتجاهها) + المضاعفات المؤكدة
// + الخط الزمني الدوائي → نص منسق جاهز للنسخ/المشاركة/الطباعة عند الانتقالات.
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import { ClipboardList, Check, Printer, Share2, RefreshCcw } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { buildCaseSummary, getVitalsLog, vitalsLine, type TimelineEvent, type VitalsSnapshot } from "@/lib/casesummary";
import { getProblems, type Problem } from "@/lib/deterioration";

interface StoredData {
  problems: Problem[];
  timeline: TimelineEvent[];
  vitals: VitalsSnapshot[];
}
const EMPTY_DATA: StoredData = { problems: [], timeline: [], vitals: [] };

export default function ResumePage() {
  const { lang, patient } = useApp();
  useRegisterRecent("outil:resume");
  const [data, setData] = useState<StoredData>(EMPTY_DATA);
  const [copied, setCopied] = useState(false);
  const { problems, timeline, vitals } = data;

  // v17.0 — lecture du stockage local en un seul setState : évite les rendus en
  // cascade signalés par react-hooks/set-state-in-effect (une seule transition).
  useEffect(() => {
    let next: StoredData = EMPTY_DATA;
    try {
      const raw = localStorage.getItem("eutn:timeline");
      const evs = raw ? (JSON.parse(raw) as TimelineEvent[]) : [];
      next = {
        problems: getProblems(),
        vitals: getVitalsLog(),
        timeline: Array.isArray(evs) ? evs : [],
      };
    } catch { /* stockage indisponible : on garde l'état vide */ }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydratation depuis localStorage
    setData(next);
  }, []);

  const L = (fr: string, ar: string) => (lang === "ar" ? ar : fr);
  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  const text = useMemo(
    () => buildCaseSummary({ lang: lang === "ar" ? "ar" : "fr", patient, problems, timeline, vitals }),
    [lang, patient, problems, timeline, vitals]
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    try {
      if ("share" in navigator) await navigator.share({ title: L("Résumé de cas", "ملخص الحالة"), text });
    } catch { /* أُلغيت المشاركة */ }
  };

  const empty = problems.length === 0 && timeline.length === 0 && vitals.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        icon={<ClipboardList className="h-6 w-6" />}
        title={L("Résumé de cas — relève", "ملخص الحالة — تسليم")}
        sub={L("Patient + constantes + complications + chronologie, en un texte prêt à transmettre.", "المريض + الثوابت + المضاعفات + الخط الزمني، في نص واحد جاهز للإبلاغ.")}
      />

      {empty && (
        <p className="rounded-xl border border-dashed border-line p-4 text-sm font-bold opacity-75">
          {L("Rien encore : le résumé se remplit dès que vous évaluez des constantes ou confirmez une complication.", "لا شيء بعد: يُمتلئ الملخص فور إدخال ثوابت أو تأكيد مضاعفة من صفحة إعادة التقييم.")}
        </p>
      )}

      {/* الثوابت — الاتجاه الحي */}
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 font-black text-blue-600">{L("Constantes (tendance)", "الثوابت (الاتجاه)")}</h2>
        {vitals.length === 0 ? (
          <p className="text-sm opacity-60">—</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {vitals.map((s) => (
              <li key={s.at} className="rounded-xl border border-line px-3 py-2 text-sm font-bold tabular-nums" dir="ltr">
                {vitalsLine(s, lang === "ar" ? "ar" : "fr")}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* المضاعفات المؤكدة */}
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 font-black text-blue-600">{L("Complications confirmées", "المضاعفات المؤكدة")}</h2>
        {problems.length === 0 ? (
          <p className="text-sm opacity-60">—</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {problems.map((pr) => (
              <li key={pr.id} className="rounded-xl border px-3 py-2 text-sm font-black" style={{ borderColor: "var(--sev-urgent)" }}>
                {L(pr.title.fr, pr.title.ar)}
                <span className="ms-2 text-[10px] font-bold tabular-nums opacity-60" dir="ltr">{pr.vitals}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* الخط الزمني */}
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 font-black text-blue-600">{L("Chronologie des administrations", "الخط الزمني الدوائي")}</h2>
        {timeline.length === 0 ? (
          <p className="text-sm opacity-60">—</p>
        ) : (
          <ul className="flex flex-col gap-1 text-sm font-bold tabular-nums" dir="ltr">
            {[...timeline].sort((a, b) => a.t - b.t).map((e) => {
              const d = new Date(e.t);
              const hh = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
              return <li key={e.t}>{hh} — {lang === "ar" ? e.a : e.f}</li>;
            })}
          </ul>
        )}
      </section>

      {/* النص الجاهز */}
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 font-black text-blue-600">{L("Texte prêt à transmettre", "النص الجاهز للإبلاغ")}</h2>
        <pre className="max-h-[50dvh] overflow-auto whitespace-pre-wrap rounded-xl border border-line bg-surface2 p-3 text-[13px] font-bold leading-relaxed" dir={lang === "ar" ? "rtl" : "ltr"}>{text}</pre>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={copy} className="touch flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black text-white shadow active:scale-95" style={{ background: "var(--accent)" }}>
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <ClipboardList className="h-4 w-4" aria-hidden />}
            {copied ? L("Copié ✓", "تم النسخ ✓") : L("Copier", "نسخ")}
          </button>
          {canShare && (
            <button onClick={share} className="touch flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-bold active:scale-95">
              <Share2 className="h-4 w-4" aria-hidden />{L("Partager", "مشاركة")}
            </button>
          )}
          <button onClick={() => window.print()} className="touch flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-bold active:scale-95">
            <Printer className="h-4 w-4" aria-hidden />{L("Imprimer", "طباعة")}
          </button>
        </div>
      </section>

      <p className="rounded-xl border border-amber-500/40 p-3 text-xs font-bold text-amber-600 dark:text-amber-400">
        {L("Aucune donnée ne quitte l'appareil — usage personnel.", "لا بيانات تُغادر الجهاز — استعمال شخصي.")}
      </p>

      <a href="/reevaluation" className="touch flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-black hover:bg-surface2" style={{ color: "var(--accent)" }}>
        <RefreshCcw className="h-4 w-4" aria-hidden />{L("Aller à la réévaluation", "الذهاب إلى إعادة التقييم")}
      </a>
    </div>
  );
}

"use client";
// v16.0 — إعادة التقييم: إدخال الثوابت الحيوية عند كل مراجعة → محرّك رصد التدهور
// يرفع الاشتباه (مثال: SCA تدهورت → علامات OAP) → معايير تأكيد سريري → عند التأكيد
// تُضاف المضاعفة إلى مشيخة المريض النشطة مع الـconduite المرجعية والروابط.
// الاشتباه ≠ تشخيص — التأكيد قرار المهني (ESC 2021 · SSC 2021 · ERC 2021).
import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import { RefreshCcw, AlertTriangle, Check, X, Trash2, ExternalLink, BookMarked } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { evaluateVitals, getProblems, addProblem, removeProblem, type Alert, type Problem, type Vitals } from "@/lib/deterioration";
import { pushVitals } from "@/lib/casesummary";

type Fields = Record<"fc" | "pas" | "fr" | "spo2" | "gcs" | "gly" | "k", string>;
const EMPTY: Fields = { fc: "", pas: "", fr: "", spo2: "", gcs: "", gly: "", k: "" };

const PARSE: Array<{ k: keyof Fields; fr: string; ar: string }> = [
  { k: "fc", fr: "FC /min", ar: "النبض /د" },
  { k: "pas", fr: "PAS mmHg", ar: "الانقباضي" },
  { k: "fr", fr: "FR /min", ar: "التنفس /د" },
  { k: "spo2", fr: "SpO₂ %", ar: "التشبع %" },
  { k: "gcs", fr: "GCS /15", ar: "غلاسكو /15" },
  { k: "gly", fr: "Glycémie g/L", ar: "السكر غ/ل" },
  { k: "k", fr: "K⁺ mmol/L (si dispo)", ar: "البوتاسيوم (إن توفر)" },
];

export default function ReevaluationPage() {
  const { lang } = useApp();
  useRegisterRecent("outil:reevaluation");
  const [f, setF] = useState<Fields>(EMPTY);
  const [alerts, setAlerts] = useState<Alert[] | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- قراءة التخزين المحلي بعد الترطيب
    setProblems(getProblems());
  }, []);

  const L = (fr: string, ar: string) => (lang === "ar" ? ar : fr);
  const inputCls = "w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-blue-600";
  const num = (s: string) => (s.trim() === "" ? undefined : Number(s.replace(",", ".")));

  const run = () => {
    const v: Vitals = { fc: num(f.fc), pas: num(f.pas), fr: num(f.fr), spo2: num(f.spo2), gcs: num(f.gcs), gly: num(f.gly), k: num(f.k) };
    if (Object.values(v).some((x) => typeof x === "number" && Number.isFinite(x))) pushVitals(v); // v16.2 — لقطة لاتجاه الثوابت
    setAlerts(evaluateVitals(v).filter((a) => !dismissed.includes(a.rule.id)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirm = (a: Alert) => {
    if (!confirmed.includes(a.rule.id)) setConfirmed((p) => [...p, a.rule.id]);
    setProblems(addProblem(a.rule.id, a.observed));
  };

  const dismiss = (id: string) => {
    setDismissed((p) => [...p, id]);
    setAlerts((al) => (al ? al.filter((a) => a.rule.id !== id) : al));
  };

  const sevCls = (sev: "critical" | "urgent") =>
    sev === "critical" ? { borderColor: "var(--sev-critical)", background: "var(--sev-critical-bg, rgba(214,69,69,.08))" } : { borderColor: "var(--sev-urgent)", background: "var(--sev-urgent-bg, rgba(201,138,61,.08))" };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        icon={<RefreshCcw className="h-6 w-6" />}
        title={L("Réévaluation — dépistage de la détérioration", "إعادة التقييم — رصد التدهور")}
        sub={L("Saisir les constantes à chaque visite : le moteur alerte, vous confirmez, la complication rejoint la fiche du patient.", "أدخل الثوابت عند كل مراجعة: المحرّك ينبه، أنت تؤكد، فتنضم المضاعفة إلى فيشة المريض.")}
      />

      {/* الثوابت الحيوية */}
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-3 font-black text-blue-600">{L("Constantes vitales", "الثوابت الحيوية")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PARSE.map(({ k, fr, ar }) => (
            <label key={k} className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide opacity-70">{L(fr, ar)}</span>
              <input
                type="number"
                inputMode="decimal"
                dir="ltr"
                className={inputCls}
                value={f[k]}
                onChange={(e) => setF((p) => ({ ...p, [k]: e.target.value }))}
                aria-label={L(fr, ar)}
              />
            </label>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={run} className="touch flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black text-white shadow active:scale-95" style={{ background: "var(--accent)" }}>
            <RefreshCcw className="h-4 w-4" aria-hidden />{L("Évaluer", "تقييم")}
          </button>
          <button
            onClick={() => { setF(EMPTY); setAlerts(null); setConfirmed([]); }}
            className="touch rounded-xl border border-line px-4 py-2.5 text-sm font-bold active:scale-95"
          >
            {L("Effacer les constantes", "مسح الثوابت")}
          </button>
        </div>
      </section>

      {/* النتائج */}
      {alerts && (
        <section aria-live="polite" className="flex flex-col gap-3">
          {alerts.length === 0 && (
            <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm font-bold opacity-75">
              {L("Aucun signal de détérioration sur ces constantes. Réévaluer après le prochain tour.", "لا مؤشر تدهور على هذه الثوابت. أعيد التقييم بعد الجولة القادمة.")}
            </p>
          )}
          {alerts.map((a) => (
            <article key={a.rule.id} className="rounded-2xl border-2 p-4" style={sevCls(a.rule.sev)}>
              <header className="mb-2 flex flex-wrap items-center gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0" style={{ color: a.rule.sev === "critical" ? "var(--sev-critical)" : "var(--sev-urgent)" }} aria-hidden />
                <h3 className="min-w-0 flex-1 break-words font-black">{L(a.rule.title.fr, a.rule.title.ar)}</h3>
                <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-[10px] font-black tabular-nums opacity-80" dir="ltr">{a.observed}</span>
              </header>

              {!confirmed.includes(a.rule.id) ? (
                <>
                  <p className="mb-1.5 text-xs font-black opacity-70">{L("À confirmer au lit du patient :", "تُؤكَّد عند سرير المريض:")}</p>
                  <ul className="mb-3 flex flex-col gap-1">
                    {a.rule.criteria.map((c) => (
                      <li key={c.fr} className="flex items-start gap-2 text-sm font-semibold leading-snug">
                        <span aria-hidden className="mt-0.5">□</span>
                        <span className="min-w-0 break-words">{L(c.fr, c.ar)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => confirm(a)} className="touch flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-black text-white active:scale-95" style={{ background: "var(--accent)" }}>
                      <Check className="h-4 w-4" aria-hidden />{L("Confirmer et ajouter", "تأكيد وإضافة")}
                    </button>
                    <button onClick={() => dismiss(a.rule.id)} className="touch flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-bold active:scale-95">
                      <X className="h-4 w-4" aria-hidden />{L("Non retenu", "مستبعد")}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-1.5 flex items-center gap-1.5 text-sm font-black" style={{ color: "var(--accent)" }}>
                    <BookMarked className="h-4 w-4" aria-hidden />{L("Ajouté à la fiche du patient — conduite à tenir :", "أُضيفت إلى فيشة المريض — طريقة التدخل:")}
                  </p>
                  <ol className="mb-3 flex flex-col gap-1.5">
                    {a.rule.steps.map((s, i) => (
                      <li key={s.fr} className="flex items-start gap-2 text-sm font-semibold leading-snug">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>{i + 1}</span>
                        <span className="min-w-0 break-words">{L(s.fr, s.ar)}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {a.rule.links.map((l) => (
                      <Link key={l.href} href={l.href} className="touch flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-black hover:bg-surface2">
                        {L(l.fr, l.ar)}<ExternalLink className="h-3 w-3" aria-hidden />
                      </Link>
                    ))}
                  </div>
                  <p className="text-[11px] font-bold opacity-60">{L("Référence :", "المرجع:")} {a.rule.ref}</p>
                </>
              )}
            </article>
          ))}
        </section>
      )}

      {/* مشيخة المريض النشطة */}
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 flex items-center gap-2 font-black text-blue-600">
          {L("Problèmes actifs du patient", "المضاعفات النشطة للمريض")}
          <span className="rounded-full px-2 py-0.5 text-xs font-black tabular-nums" style={{ background: "var(--accent-soft)", color: "var(--accent)" }} dir="ltr">{problems.length}</span>
        </h2>
        {problems.length === 0 ? (
          <p className="text-sm opacity-60">{L("Aucune complication confirmée pour l'instant.", "لا مضاعفات مؤكدة حتى الآن.")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {problems.map((p) => {
              const d = new Date(p.at);
              const stamp = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
              return (
                <li key={p.id} className="flex items-center gap-2 rounded-xl border border-line p-2.5 text-sm font-bold">
                  <span className="min-w-0 flex-1 break-words">{L(p.title.fr, p.title.ar)}</span>
                  <span className="shrink-0 text-[10px] font-black tabular-nums opacity-60" dir="ltr">{stamp} · {p.vitals}</span>
                  <button
                    onClick={() => setProblems(removeProblem(p.id))}
                    className="touch shrink-0 rounded-full border border-line p-1.5 opacity-70 hover:opacity-100"
                    aria-label={L("Retirer", "إزالة")}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-2 text-[11px] font-bold opacity-60">
          {L("Ces problèmes s'affichent aussi dans le bandeau « Patient actif ».", "هذه المضاعفات تظهر أيضًا في شريط «المريض النشط».")}
        </p>
      </section>

      <p className="rounded-xl border border-amber-500/40 p-3 text-xs font-bold text-amber-600 dark:text-amber-400">
        أداة مساعدة للتنبيه لا تُغني عن الحكم السريري — الاستعمال شخصي بحت ولا تُرسل أي بيانات.
      </p>
    </div>
  );
}

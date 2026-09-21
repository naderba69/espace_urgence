"use client";
// v13.3 — شريط «المريض النشط» : بيانات تُكتب مرة واحدة، تتعبّأ بها المحركات،
// إغلاق الحالة بأرشيف محلي (٥) مع الاسترجاع. استعمال شخصي بحت.
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProblems, removeProblem, type Problem } from "@/lib/deterioration";
import { UserRound, Pencil, X, RotateCcw, ChevronDown } from "lucide-react";
import { useApp, EMPTY_PATIENT, type ActivePatient } from "@/components/Providers";
import T from "@/components/T";

type LogEntry = { at: number; p: ActivePatient };
const LOG_KEY = "eutn:patient-log";
const MAX_LOG = 5;

export default function ActivePatient() {
  const { lang, patient, setPatient, hydrated } = useApp();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ActivePatient>(EMPTY_PATIENT);
  const [confirm, setConfirm] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [showLog, setShowLog] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    if (!hydrated) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- مشيخة محلية تُقرأ بعد الهيدراسيون
    setProblems(getProblems());
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- أرشيف محلي يُقرأ بعد الهيدراسيون
      setLog(JSON.parse(localStorage.getItem(LOG_KEY) || "[]") as LogEntry[]);
    } catch { /* ignore */ }
  }, [hydrated]);

  const active = !!(patient.w || patient.age || patient.scr);

  const openPanel = () => {
    setDraft(active ? patient : EMPTY_PATIENT);
    setConfirm(false);
    setOpen(true);
  };
  const save = () => {
    setPatient({ w: draft.w.trim(), age: draft.age.trim(), scr: draft.scr.trim(), sexe: draft.sexe });
    setOpen(false);
    setConfirm(false);
  };
  const closeCase = () => {
    if (!confirm) { setConfirm(true); setTimeout(() => setConfirm(false), 4000); return; }
    if (active) {
      const next = [{ at: Date.now(), p: patient }, ...log].slice(0, MAX_LOG);
      setLog(next);
      try { localStorage.setItem(LOG_KEY, JSON.stringify(next)); } catch { /* ignore */ }
    }
    setPatient(EMPTY_PATIENT);
    setOpen(false);
    setConfirm(false);
  };
  const restore = (e: LogEntry) => {
    setPatient(e.p);
    const next = log.filter((x) => x.at !== e.at);
    setLog(next);
    try { localStorage.setItem(LOG_KEY, JSON.stringify(next)); } catch { /* ignore */ }
    setShowLog(false);
  };

  const cell = "flex flex-col gap-1 rounded-xl border border-line bg-surface p-3";
  const inp = "w-full bg-transparent text-lg font-black tabular-nums outline-none";

  if (!hydrated) return null;

  return (
    <div className={`card rounded-2xl border bg-surface p-3 ${active ? "sev-strip sev-standard" : "border-dashed border-line"}`}>
      {!open ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button onClick={openPanel} className="touch flex items-center gap-2 text-sm font-black" style={{ color: "var(--accent)" }}>
            <UserRound className="h-5 w-5" aria-hidden />
            {active ? (
              <span className="flex flex-wrap items-center gap-1.5">
                <span dir="ltr">{patient.w} kg</span>·<span dir="ltr">{patient.age} ans</span>·<span dir="ltr">{patient.scr} µmol/L</span>·{patient.sexe === "m" ? (lang === "ar" ? "ذكر" : "H") : (lang === "ar" ? "أنثى" : "F")}
              </span>
            ) : (
              <T fr="Patient actif: définir (le poids remplit tous les moteurs)" ar="المريض النشط: تعيين (الوزن يتعبّأ به كل المحركات)" />
            )}
          </button>
          <span className="flex items-center gap-2">
            {active && (
              <>
                <button onClick={openPanel} className="touch rounded-full border border-line p-2" aria-label={lang === "ar" ? "تعديل" : "Modifier"}>
                  <Pencil className="h-4 w-4" />
                </button>
                <Link href="/reevaluation" className="touch rounded-full border px-3 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
                  {lang === "ar" ? "إعادة تقييم" : "Réévaluer"}
                </Link>
                <Link href="/resume" className="touch rounded-full border px-3 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
                  {lang === "ar" ? "ملخص" : "Résumé"}
                </Link>
                <button onClick={closeCase}
                  className={`touch rounded-full border px-3 py-2 text-xs font-black ${confirm ? "text-white" : ""}`}
                  style={confirm ? { background: "var(--sev-critical)", borderColor: "var(--sev-critical)" } : { borderColor: "var(--sev-urgent)", color: "var(--sev-urgent)" }}>
                  {confirm ? (lang === "ar" ? "تأكيد الإغلاق" : "Confirmer") : (lang === "ar" ? "إغلاق الحالة" : "Clore le cas")}
                </button>
              </>
            )}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black"><T fr="Patient actif" ar="المريض النشط" /></p>
            <button onClick={() => setOpen(false)} className="touch rounded-full p-1 opacity-70" aria-label={lang === "ar" ? "إغلاق" : "Fermer"}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Poids (kg)" ar="الوزن" /></span>
              <input type="number" inputMode="decimal" value={draft.w} onChange={(e) => setDraft({ ...draft, w: e.target.value })} className={inp} dir="ltr" /></label>
            <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Âge" ar="العمر" /></span>
              <input type="number" inputMode="decimal" value={draft.age} onChange={(e) => setDraft({ ...draft, age: e.target.value })} className={inp} dir="ltr" /></label>
            <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Créat. µmol/L" ar="كرياتينين" /></span>
              <input type="number" inputMode="decimal" value={draft.scr} onChange={(e) => setDraft({ ...draft, scr: e.target.value })} className={inp} dir="ltr" /></label>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setDraft({ ...draft, sexe: "m" })} aria-pressed={draft.sexe === "m"}
              className={`touch flex-1 rounded-xl border p-2.5 text-sm font-black ${draft.sexe === "m" ? "border-transparent text-white" : "border-line"}`}
              style={draft.sexe === "m" ? { background: "var(--accent)" } : undefined}><T fr="Homme" ar="رجل" /></button>
            <button onClick={() => setDraft({ ...draft, sexe: "f" })} aria-pressed={draft.sexe === "f"}
              className={`touch flex-1 rounded-xl border p-2.5 text-sm font-black ${draft.sexe === "f" ? "border-transparent text-white" : "border-line"}`}
              style={draft.sexe === "f" ? { background: "var(--accent)" } : undefined}><T fr="Femme" ar="امرأة" /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={save} className="touch rounded-xl px-4 py-2.5 text-sm font-black text-white" style={{ background: "var(--accent)" }}>
              <T fr="Enregistrer" ar="حفظ" />
            </button>
            <button onClick={() => setOpen(false)} className="touch rounded-xl border border-line px-4 py-2.5 text-sm font-black">
              <T fr="Annuler" ar="إلغاء" />
            </button>
          </div>
        </div>
      )}

      {!open && problems.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-line pt-2">
          <span className="text-xs font-black opacity-60">{lang === "ar" ? "مضاعفات نشطة:" : "Problèmes actifs:"}</span>
          {problems.map((p) => (
            <span key={p.id} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-black" style={{ borderColor: "var(--sev-urgent)", color: "var(--sev-urgent)" }}>
              {lang === "ar" ? p.title.ar : p.title.fr}
              {/* v17.0 — fausse alerte / complication résolue : retrait direct depuis l'accueil
                  (removeProblem était importé mais aucune UI ne l'appelait → impasse). */}
              <button
                type="button"
                onClick={() => setProblems(removeProblem(p.id))}
                aria-label={`${lang === "ar" ? "إزالة" : "Retirer"} ${lang === "ar" ? p.title.ar : p.title.fr}`}
                className="ms-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X className="h-3 w-3" aria-hidden />
              </button>
            </span>
          ))}
        </div>
      )}

      {log.length > 0 && !open && (
        <div className="mt-2 border-t border-line pt-2">
          <button onClick={() => setShowLog(!showLog)} className="flex w-full items-center justify-between text-xs font-black opacity-80">
            <span className="flex items-center gap-1"><RotateCcw className="h-3.5 w-3.5" />{lang === "ar" ? `حالات مغلقة (${log.length})` : `Cas clos (${log.length})`}</span>
            <ChevronDown className={`h-4 w-4 ${showLog ? "rotate-180" : ""}`} />
          </button>
          {showLog && (
            <ul className="mt-2 flex flex-col gap-1">
              {log.map((e) => {
                const d = new Date(e.at);
                const stamp = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
                return (
                  <li key={e.at} className="flex items-center justify-between gap-2 rounded-lg border border-line p-1.5 text-xs font-bold">
                    <span dir="ltr">{stamp}</span>
                    <span dir="ltr" className="opacity-70">{e.p.w} kg · {e.p.age} a · {e.p.scr}</span>
                    <button onClick={() => restore(e)} className="touch rounded-full border border-line px-2 py-1 text-[10px] font-black" style={{ color: "var(--accent)" }}>
                      {lang === "ar" ? "استرجاع" : "Restaurer"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

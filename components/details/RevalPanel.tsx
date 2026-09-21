"use client";
// v7.8 — Réévaluation post-protocole : le chef de terrain, version complète.
// 1) SBAR de terrain déterministe (hors-ligne, sans IA)  2) mémoire de la boucle + tendance
// 3) alarme 2 aggravations consécutives  4) MEWS/qSOFA calculés en direct
// 5) checklist post-ROSC sur les protocoles d'arrêt.
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Reval } from "@/data/reval";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";
import { mews, qsofa } from "@/lib/ews";
import { appendLog, clearLog, doubleWorsen, loadLog, trend, type RevalEntry, type Verdict } from "@/lib/reval-log";
import { AlertTriangle, ArrowRight, CheckCircle2, Copy, MinusCircle, PhoneCall, RefreshCw, Siren, Timer, Zap } from "lucide-react";

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const hhmm = (ms: number) => {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const RISK_CLS: Record<string, string> = {
  low: "border-sky-600/50 bg-sky-600/10 text-sky-500",
  medium: "border-amber-500/50 bg-amber-500/10 text-amber-500",
  high: "border-red-600/60 bg-red-600/15 text-red-500",
};

function Stepper({ label, value, set, min, max, step = 1, dir = "ltr" }: {
  label: string; value: number; set: (n: number) => void; min: number; max: number; step?: number; dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-black opacity-70">{label}</p>
      <div className="flex items-center gap-1" dir={dir}>
        <button onClick={() => set(Math.max(min, +(value - step).toFixed(1)))} aria-label={`${label} -`}
          className="touch h-9 w-9 rounded-lg border border-line bg-surface2 text-base font-black">−</button>
        <p className="min-w-11 text-center text-base font-black tabular-nums text-purple-500">{value}</p>
        <button onClick={() => set(Math.min(max, +(value + step).toFixed(1)))} aria-label={`${label} +`}
          className="touch h-9 w-9 rounded-lg border border-line bg-surface2 text-base font-black">+</button>
      </div>
    </div>
  );
}

export default function RevalPanel({ reval, protocolId, protocolTitle }: { reval: Reval; protocolId: string; protocolTitle?: { fr: string; ar: string } }) {
  const { lang } = useApp();
  const [left, setLeft] = useState(reval.intervalMin * 60);
  const [running, setRunning] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [log, setLog] = useState<RevalEntry[]>(() => loadLog(protocolId));
  const [roscDone, setRoscDone] = useState<number[]>([]);
  const [sbar, setSbar] = useState("");
  const [copied, setCopied] = useState(false);
  // Vitales pour MEWS/qSOFA
  const [rr, setRr] = useState(16);
  const [hr, setHr] = useState(80);
  const [sbp, setSbp] = useState(120);
  const [temp, setTemp] = useState(37);
  const [avpu, setAvpu] = useState<0 | 1 | 2 | 3>(0);
  const verdictRef = useRef<HTMLDivElement>(null);
  const due = left <= 0;

  useEffect(() => {
    if (!running || left <= 0) return;
    const t = setInterval(() => setLeft((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, [running, left]);

  const m = useMemo(() => mews({ rr, hr, sbp, temp, avpu }), [rr, hr, sbp, temp, avpu]);
  const q = useMemo(() => qsofa({ rr, sbp, altered: avpu > 0 }), [rr, sbp, avpu]);
  const tr = trend(log);
  const alarm = doubleWorsen(log);

  const start = () => {
    setLeft(reval.intervalMin * 60);
    setRunning(true);
    setVerdict(null);
    setRoscDone([]);
    trackEvent("reval_start", { id: protocolId });
  };

  const pick = (v: Verdict) => {
    setRunning(false);
    setVerdict(v);
    setLog(appendLog(protocolId, { at: Date.now(), verdict: v, mews: m.score, qsofa: q.score }));
    trackEvent("reval_verdict", { id: protocolId, verdict: v });
    requestAnimationFrame(() => verdictRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const genSbar = () => {
    const title = protocolTitle ? (lang === "ar" ? protocolTitle.ar : protocolTitle.fr) : protocolId;
    const vWord = (v: Verdict) =>
      v === "improve" ? (lang === "ar" ? "تحسّن" : "amélioration") : v === "stall" ? (lang === "ar" ? "ركود" : "stagnation") : (lang === "ar" ? "تعكّر" : "aggravation");
    const hist = log.length
      ? log.map((e) => `${hhmm(e.at)} ${vWord(e.verdict)}${e.mews !== undefined ? ` (MEWS ${e.mews}/qSOFA ${e.qsofa})` : ""}`).join(" ← ")
      : lang === "ar" ? "أول دورة" : "premier cycle";
    const text =
      lang === "ar"
        ? `S — الوضع: ${title} — إعادة تقييم جارية (دورة كل ${reval.intervalMin} د).
B — الخلفية: FR ${rr} · TAS ${sbp} · FC ${hr} · T° ${temp} · conscience ${["A", "V", "P", "U"][avpu]} — MEWS ${m.score} · qSOFA ${q.score}.
A — التقييم: ${hist} — الاتجاه: ${tr === "up" ? "تحسّن ↑" : tr === "down" ? "تعكّر ↓" : "استقرار →"}.${alarm ? " تعكّران متتاليان !" : ""}
R — التوصية: ${verdict ? reval[verdict].actions.map((a) => a.txt.ar).join(" · ") : "أعد التقييم الآن واحسم."}${alarm ? " — تحويل عاجل (SAMU)." : ""}`
        : `S — Situation : ${title} — réévaluation en cours (cycle ${reval.intervalMin} min).
B — Background : FR ${rr} · PAS ${sbp} · FC ${hr} · T° ${temp} · conscience ${["A", "V", "P", "U"][avpu]} — MEWS ${m.score} · qSOFA ${q.score}.
A — Assessment : ${hist} — tendance : ${tr === "up" ? "amélioration ↑" : tr === "down" ? "aggravation ↓" : "stable →"}.${alarm ? " Deux aggravations consécutives !" : ""}
R — Recommendation : ${verdict ? reval[verdict].actions.map((a) => a.txt.fr).join(" · ") : "réévaluer maintenant et trancher."}${alarm ? " — transfert urgent (SAMU)." : ""}`;
    setSbar(text);
    trackEvent("reval_sbar", { id: protocolId });
  };

  const copySbar = async () => {
    try {
      await navigator.clipboard.writeText(sbar);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* presse-papiers refusé : le texte reste lisible */
    }
  };

  const branch = verdict ? reval[verdict] : null;
  const tone =
    verdict === "improve"
      ? { cls: "border-sky-600 bg-sky-600/10", txt: "text-sky-500" }
      : verdict === "worsen"
        ? { cls: "border-red-600 bg-red-600/10", txt: "text-red-500" }
        : { cls: "border-amber-500 bg-amber-500/10", txt: "text-amber-500" };

  return (
    <section id="reval" aria-label="revaluation" className="scroll-mt-14 rounded-2xl border-2 border-purple-500/40 bg-purple-500/5 p-3">
      <h2 className="mb-1 flex items-center gap-2 font-bold text-purple-500">
        <RefreshCw className="h-5 w-5" aria-hidden />
        <T fr="Réévaluation — chef de terrain" ar="إعادة التقييم — قائد الميدان" />
        {/* v9.1 — cadence de la boucle affichée d'emblée */}
        <span className="sev-badge sev-accent tabular-nums" dir="ltr">{reval.intervalMin} min</span>
      </h2>

      {/* 3) Alarme transfert */}
      {alarm && (
        <div role="alert" className="mb-2 flex items-center gap-2 rounded-xl border-2 border-red-600 bg-red-600 p-3 text-sm font-black text-white">
          <Siren className="h-5 w-5 shrink-0 animate-pulse" aria-hidden />
          <span className="flex-1"><T fr="Deux aggravations consécutives — penser au transfert maintenant" ar="تعكّران متتاليان — فكّر في التحويل الآن" /></span>
          <Link href="/fiche-samu" className="touch inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-black text-red-600">
            <PhoneCall className="h-4 w-4" aria-hidden /> SAMU
          </Link>
        </div>
      )}

      {/* Minuteur */}
      <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-3">
        <Timer className="h-6 w-6 shrink-0 text-purple-500" aria-hidden />
        <p className={`text-3xl font-black tabular-nums ${due ? "animate-pulse text-red-500" : "text-purple-500"}`} dir="ltr">
          {fmt(left)}
        </p>
        {due ? (
          <p className="text-sm font-black text-red-500">
            <T fr="RÉÉVALUER MAINTENANT" ar="أعد التقييم الآن" />
          </p>
        ) : null}
        <button onClick={start} className="touch ms-auto rounded-xl border border-purple-500 bg-purple-500/10 px-4 py-2 text-sm font-black text-purple-500">
          {running
            ? lang === "ar" ? "إعادة الضبط" : "Repartir de zéro"
            : lang === "ar" ? `بدء دورة ${reval.intervalMin} د` : `Lancer ${reval.intervalMin} min`}
        </button>
      </div>

      {/* 2) Mémoire de la boucle + tendance */}
      {log.length > 0 && (
        <div className="mb-3 rounded-xl border border-line bg-surface p-3">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <p className="text-xs font-black uppercase tracking-wide opacity-60">
              <T fr="Historique de la boucle" ar="سجل الدورات" />
              {tr && (
                <span className={`ms-2 text-sm ${tr === "up" ? "text-sky-500" : tr === "down" ? "text-red-500" : "text-amber-500"}`}>
                  {tr === "up" ? "↑" : tr === "down" ? "↓" : "→"} {tr === "up" ? <T fr="amélioration" ar="تحسّن" /> : tr === "down" ? <T fr="aggravation" ar="تعكّر" /> : <T fr="stable" ar="استقرار" />}
                </span>
              )}
            </p>
            <button onClick={() => { clearLog(protocolId); setLog([]); }} className="touch rounded-lg border border-line px-2 py-1 text-[10px] font-black opacity-70">
              <T fr="Effacer" ar="تصفير" />
            </button>
          </div>
          <ul className="flex flex-wrap gap-1.5" dir="ltr">
            {log.map((e, i) => (
              <li key={i}
                className={`rounded-lg border px-2 py-1 text-[11px] font-black ${e.verdict === "improve" ? "border-sky-600/50 bg-sky-600/10 text-sky-500" : e.verdict === "worsen" ? "border-red-600/50 bg-red-600/10 text-red-500" : "border-amber-500/50 bg-amber-500/10 text-amber-500"}`}>
                {hhmm(e.at)} {e.verdict === "improve" ? "✓" : e.verdict === "worsen" ? "⚠" : "•"} {e.mews !== undefined ? `M${e.mews}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4) Vitales → MEWS + qSOFA en direct */}
      <div className="mb-3 rounded-xl border border-line bg-surface p-3">
        <p className="mb-2 text-xs font-black uppercase tracking-wide opacity-60">
          <T fr="Constantes → scores d'alerte en direct" ar="الحيوية ⇒ مؤشرات الإنذار مباشرة" />
        </p>
        <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
          <Stepper label={lang === "ar" ? "تنفس/د" : "FR/min"} value={rr} set={setRr} min={4} max={60} />
          <Stepper label={lang === "ar" ? "نبض/د" : "FC/min"} value={hr} set={setHr} min={20} max={220} step={2} />
          <Stepper label={lang === "ar" ? "ضغط انقباضي" : "TAS mmHg"} value={sbp} set={setSbp} min={40} max={260} step={5} />
          <Stepper label="T° C" value={temp} set={setTemp} min={25} max={43} step={0.1} />
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black opacity-70"><T fr="Conscience" ar="الوعي" /></p>
            <div className="flex gap-1" role="group" aria-label="AVPU">
              {(["A", "V", "P", "U"] as const).map((l, i) => (
                <button key={l} onClick={() => setAvpu(i as 0 | 1 | 2 | 3)} aria-pressed={avpu === i}
                  className={`touch h-9 flex-1 rounded-lg border text-xs font-black ${avpu === i ? "border-purple-500 bg-purple-600 text-white" : "border-line bg-surface2"}`}>
                  {l}
                </button>
              ))}
            </div>
            <p className="mt-1 break-words text-[10px] font-bold leading-4 opacity-80">
              {([["Alerte : éveillé, réactif", "يقظ: يستجيب من تلقاء نفسه"], ["Répond à la voix", "يستجيب للصوت"], ["Répond à la douleur", "يستجيب للألم"], ["Unresponsive : aucune réponse", "لا يستجيب إطلاقاً"]] as const)[avpu][lang === "ar" ? 1 : 0]}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <p className={`rounded-lg border px-3 py-1.5 text-sm font-black ${RISK_CLS[m.risk]}`} aria-label="MEWS">
            MEWS {m.score} · {m.risk === "high" ? <T fr="risque élevé" ar="خطر عالٍ" /> : m.risk === "medium" ? <T fr="risque moyen" ar="خطر متوسط" /> : <T fr="risque bas" ar="خطر منخفض" />}
          </p>
          <p className={`rounded-lg border px-3 py-1.5 text-sm font-black ${RISK_CLS[q.risk]}`} aria-label="qSOFA">
            qSOFA {q.score}/3{q.risk === "high" ? ` · ${lang === "ar" ? "إنذار إنتان" : "alerte sepsis"}` : ""}
          </p>
        </div>
      </div>

      {/* Critères objectifs */}
      <div className="mb-3 rounded-xl border border-line bg-surface p-3">
        <p className="mb-1 text-xs font-black uppercase tracking-wide opacity-60">
          <T fr="À chaque tour, mesurer" ar="في كل دورة قِس" />
        </p>
        <ul className="flex flex-col gap-1 text-sm font-bold">
          {reval.criteria.map((c, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" aria-hidden />
              {lang === "ar" ? c.ar : c.fr}
            </li>
          ))}
        </ul>
      </div>

      {/* Verdict */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        <button onClick={() => pick("improve")} aria-pressed={verdict === "improve"}
          className={`touch flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-black ${verdict === "improve" ? "border-sky-600 bg-sky-600 text-white" : "border-sky-600/50 bg-sky-600/10 text-sky-500"}`}>
          <CheckCircle2 className="h-6 w-6" aria-hidden />
          <T fr="Amélioration" ar="تحسّن" />
        </button>
        <button onClick={() => pick("stall")} aria-pressed={verdict === "stall"}
          className={`touch flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-black ${verdict === "stall" ? "border-amber-500 bg-amber-500 text-white" : "border-amber-500/50 bg-amber-500/10 text-amber-500"}`}>
          <MinusCircle className="h-6 w-6" aria-hidden />
          <T fr="Stagnation" ar="ركود" />
        </button>
        <button onClick={() => pick("worsen")} aria-pressed={verdict === "worsen"}
          className={`touch flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-black ${verdict === "worsen" ? "border-red-600 bg-red-600 text-white" : "border-red-600/50 bg-red-600/10 text-red-500"}`}>
          <AlertTriangle className="h-6 w-6" aria-hidden />
          <T fr="Aggravation" ar="تعكّر" />
        </button>
      </div>

      {/* Conduite selon le verdict */}
      {branch && (
        <div ref={verdictRef} className={`mb-3 scroll-mt-16 rounded-xl border-2 p-3 ${tone.cls}`}>
          <p className={`mb-1 flex items-center gap-2 text-sm font-black uppercase tracking-wide ${tone.txt}`}>
            <Zap className="h-4 w-4" aria-hidden />
            {verdict === "improve"
              ? <T fr="Amélioration — constater" ar="تحسّن — العلامات" />
              : verdict === "stall"
                ? <T fr="Stagnation — escalate" ar="ركود — صعّد" />
                : <T fr="Aggravation — agir maintenant" ar="تعكّر — تصرّف الآن" />}
          </p>
          <ul className="mb-2 flex flex-wrap gap-1.5">
            {branch.signs.map((s, i) => (
              <li key={i} className="rounded-lg border border-line bg-surface px-2 py-1 text-xs font-bold">
                {lang === "ar" ? s.ar : s.fr}
              </li>
            ))}
          </ul>
          <p className="mb-1 text-xs font-black uppercase tracking-wide opacity-60">
            <T fr="Maintenant" ar="الآن" />
          </p>
          <ol className="flex flex-col gap-2">
            {branch.actions.map((a, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg border border-line bg-surface p-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-black text-white">{i + 1}</span>
                <span className="flex flex-col gap-1.5">
                  <span className="text-sm font-bold">{lang === "ar" ? a.txt.ar : a.txt.fr}</span>
                  {a.go && (
                    <Link href={a.go.href} className="touch inline-flex w-fit items-center gap-1 rounded-lg border border-amber-500 bg-amber-500/10 px-2.5 py-1 text-xs font-black text-amber-500">
                      <span dir="ltr">⇒</span> {lang === "ar" ? a.go.ar : a.go.fr}
                    </Link>
                  )}
                </span>
              </li>
            ))}
          </ol>

          {/* 5) Checklist post-ROSC */}
          {verdict === "improve" && reval.roscChecklist && (
            <div className="mt-3 rounded-xl border-2 border-sky-600/50 bg-surface p-3">
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-sky-500">
                <T fr="Post-arrêt (ROSC) — cocher chaque item" ar="بعد العودة (ROSC) — علّم كل بند" />
              </p>
              <ul className="flex flex-col gap-1.5">
                {reval.roscChecklist.map((c, i) => (
                  <li key={i}>
                    <button onClick={() => setRoscDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))}
                      aria-pressed={roscDone.includes(i)}
                      className={`touch flex w-full items-center gap-2 rounded-lg border p-2 text-start text-sm font-bold ${roscDone.includes(i) ? "border-sky-600 bg-sky-600/15 text-sky-500" : "border-line bg-surface2"}`}>
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${roscDone.includes(i) ? "border-sky-600 bg-sky-600 text-white" : "border-line"}`} aria-hidden>
                        {roscDone.includes(i) ? "✓" : ""}
                      </span>
                      {lang === "ar" ? c.ar : c.fr}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={start} className="touch mt-3 w-full rounded-xl border border-purple-500 bg-purple-500/10 py-2.5 text-sm font-black text-purple-500">
            <T fr="Nouveau cycle de réévaluation" ar="دورة إعادة تقييم جديدة" />
          </button>
        </div>
      )}

      {/* 1) SBAR de terrain */}
      <div className="mb-3 rounded-xl border border-line bg-surface p-3">
        <p className="mb-2 text-xs font-black uppercase tracking-wide opacity-60">
          <T fr="Transmission SBAR — générée hors-ligne" ar="نقل SBAR — يولَّد دون إنترنت" />
        </p>
        <div className="flex gap-2">
          <button onClick={genSbar} className="touch flex-1 rounded-xl border border-purple-500 bg-purple-500/10 py-2.5 text-sm font-black text-purple-500">
            <T fr="Générer le SBAR" ar="ولّد SBAR" />
          </button>
          {sbar && (
            <button onClick={() => void copySbar()} className="touch inline-flex items-center gap-1 rounded-xl border border-line px-3 py-2 text-sm font-black">
              <Copy className="h-4 w-4" aria-hidden /> {copied ? <T fr="Copié" ar="نُسخ" /> : <T fr="Copier" ar="نسخ" />}
            </button>
          )}
        </div>
        {sbar && (
          <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-surface2 p-3 font-sans text-xs font-semibold leading-relaxed">{sbar}</pre>
        )}
      </div>

      {/* Pivots diagnostiques */}
      <div className="rounded-xl border border-line bg-surface p-3">
        <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide opacity-70">
          <ArrowRight className="h-4 w-4 text-purple-500" aria-hidden />
          <T fr="Signes nouveaux ⇒ autre diagnostic ?" ar="أعراض جديدة ⇒ تشخيص آخر؟" />
        </p>
        <ul className="flex flex-col gap-2">
          {reval.pivots.map((p, i) => (
            <li key={i} className="rounded-lg border border-line bg-surface2 p-2.5 text-sm">
              <p className="font-bold">{lang === "ar" ? p.sign.ar : p.sign.fr}</p>
              <p className="mt-0.5 text-xs opacity-70">
                <T fr="Penser à:" ar="فكّر في: " />{lang === "ar" ? p.suspect.ar : p.suspect.fr}
              </p>
              <Link href={p.href} className="touch mt-1.5 inline-flex items-center gap-1 rounded-lg border border-purple-500 bg-purple-500/10 px-2.5 py-1 text-xs font-black text-purple-500">
                <span dir="ltr">⇒</span> {lang === "ar" ? p.label.ar : p.label.fr}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

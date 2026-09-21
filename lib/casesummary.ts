// v16.2 — مُركّب ملخص الحالة: يجمع (المريض + المضاعفات المؤكدة + اتجاه الثوابت + الخط الزمني الدوائي)
// في نص تسليم واحد منسق. نقية وقابلة للاختبار — لا DOM ولا تخزين.
// التخزين: eutn:vitals-log (آخر 6 قياسات) — تديره دوال هذا الملف.
import type { Vitals, Problem } from "@/lib/deterioration";

export const VITALS_LOG_KEY = "eutn:vitals-log";
export const MAX_VITALS_LOG = 6;

export interface VitalsSnapshot {
  at: number;
  v: Vitals;
}

export function getVitalsLog(): VitalsSnapshot[] {
  try {
    const arr = JSON.parse(localStorage.getItem(VITALS_LOG_KEY) || "[]") as VitalsSnapshot[];
    return Array.isArray(arr) ? arr.filter((x) => x && typeof x.at === "number" && x.v) : [];
  } catch {
    return [];
  }
}

export function pushVitals(v: Vitals): VitalsSnapshot[] {
  const next = [{ at: Date.now(), v }, ...getVitalsLog()].slice(0, MAX_VITALS_LOG);
  try { localStorage.setItem(VITALS_LOG_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  return next;
}

export function clearVitalsLog(): void {
  try { localStorage.removeItem(VITALS_LOG_KEY); } catch { /* ignore */ }
}

export interface PatientMini {
  w: string; age: string; scr: string; sexe: string;
}

export interface TimelineEvent {
  f: string; a: string; t: number; m: number;
}

export interface CaseInput {
  lang: "fr" | "ar";
  patient?: PatientMini;
  problems: Problem[];
  timeline: TimelineEvent[];
  vitals: VitalsSnapshot[];
  now?: number;
}

const hhmm = (t: number) => {
  const d = new Date(t);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
const ddmm = (t: number) => {
  const d = new Date(t);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const VITAL_LABEL: Record<keyof Vitals, { fr: string; ar: string }> = {
  fc: { fr: "FC", ar: "نبض" },
  pas: { fr: "PAS", ar: "انقباضي" },
  fr: { fr: "FR", ar: "تنفس" },
  spo2: { fr: "SpO₂", ar: "تشبع" },
  gcs: { fr: "GCS", ar: "غلاسكو" },
  gly: { fr: "Gly", ar: "سكر" },
  k: { fr: "K⁺", ar: "بوتاسيوم" },
};

/** سطر الثوابت: الحقول الموجودة فقط */
export function vitalsLine(s: VitalsSnapshot, lang: "fr" | "ar"): string {
  const parts = (Object.keys(VITAL_LABEL) as Array<keyof Vitals>)
    .filter((k) => typeof s.v[k] === "number" && Number.isFinite(s.v[k]))
    .map((k) => `${lang === "ar" ? VITAL_LABEL[k].ar : VITAL_LABEL[k].fr} ${s.v[k]}`);
  return parts.length ? `${hhmm(s.at)} · ${parts.join(" · ")}` : "";
}

/** النص الكامل لملخص الحالة — التنسيق نفسه بلغتين */
export function buildCaseSummary(x: CaseInput): string {
  const ar = x.lang === "ar";
  const L: string[] = [];
  L.push(ar ? "ملخص الحالة — تسليم / انتقال" : "RÉSUMÉ DE CAS — relève / transfert");
  L.push(ar ? "══════════════════════" : "════════════════════════");

  const p = x.patient;
  const hasPatient = !!(p && (p.w || p.age || p.scr || p.sexe));
  if (hasPatient && p) {
    const bits = [
      p.age && `${p.age} ${ar ? "سنة" : "ans"}`,
      p.sexe === "m" ? (ar ? "ذكر" : "H") : p.sexe === "f" ? (ar ? "أنثى" : "F") : null,
      p.w && `${p.w} kg`,
      p.scr && `${ar ? "كريات" : "créat"} ${p.scr} µmol/L`,
    ].filter(Boolean);
    L.push(`${ar ? "المريض" : "Patient"}: ${bits.join(" · ")}`);
  } else {
    L.push(`${ar ? "المريض" : "Patient"}: —`);
  }
  L.push(`${ar ? "التاريخ" : "Date"}: ${ddmm(x.now ?? Date.now())} ${hhmm(x.now ?? Date.now())}`);

  L.push("");
  L.push(ar ? "── الثوابت (الأحدث أولاً) ──" : "── Constantes (plus récentes d'abord) ──");
  const vlines = x.vitals.map((s) => vitalsLine(s, x.lang)).filter(Boolean);
  if (vlines.length) L.push(...vlines);
  else L.push("—");

  L.push("");
  L.push(ar ? "── المضاعفات المؤكدة ──" : "── Complications confirmées ──");
  if (x.problems.length) {
    for (const pr of x.problems) {
      L.push(`${ddmm(pr.at)} ${hhmm(pr.at)} — ${ar ? pr.title.ar : pr.title.fr} (${pr.vitals})`);
    }
  } else L.push("—");

  L.push("");
  L.push(ar ? "── الخط الزمني الدوائي ──" : "── Chronologie des administrations ──");
  if (x.timeline.length) {
    const lines = [...x.timeline].sort((a, b) => a.t - b.t)
      .map((e) => `${hhmm(e.t)} — ${ar ? e.a : e.f}`);
    L.push(...lines);
  } else L.push("—");

  const when = `${ddmm(x.now ?? Date.now())}`;
  L.push("");
  L.push(ar ? `حرر ${when} — التوقيع: ________` : `Rédigé le ${when} — signature : ________`);
  return L.join("\n");
}

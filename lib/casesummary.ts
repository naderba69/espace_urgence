// v16.2 — مُركّب ملخص الحالة: يجمع (المريض + المضاعفات المؤكدة + اتجاه الثوابت + الخط الزمني الدوائي)
// في نص تسليم واحد منسق. نقية وقابلة للاختبار — لا DOM ولا تخزين.
// التخزين: eutn:vitals-log (آخر 6 قياسات) — تديره دوال هذا الملف.
import type { Vitals, Problem } from "@/lib/deterioration";
import { readSessionJSON, writeSessionJSON, removeSessionKey } from "@/lib/storage";

export const VITALS_LOG_KEY = "eutn:vitals-log";
export const MAX_VITALS_LOG = 6;

export interface VitalsSnapshot {
  at: number;
  v: Vitals;
}

const VITAL_KEYS: (keyof Vitals)[] = ["age", "fc", "pas", "fr", "spo2", "gcs", "gly", "k"];

export function sanitizeVitalsLog(value: unknown, now = Date.now()): VitalsSnapshot[] {
  if (!Array.isArray(value)) return [];
  const safe: VitalsSnapshot[] = [];
  for (const candidate of value) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) continue;
    const x = candidate as Record<string, unknown>;
    if (typeof x.at !== "number" || !Number.isFinite(x.at) || x.at <= 0 || x.at > now ||
        !x.v || typeof x.v !== "object" || Array.isArray(x.v)) continue;
    const source = x.v as Record<string, unknown>;
    const v: Vitals = {};
    for (const field of VITAL_KEYS) if (typeof source[field] === "number" && Number.isFinite(source[field])) v[field] = source[field] as number;
    if (Object.keys(v).length) safe.push({ at: x.at, v });
  }
  return safe.sort((a, b) => b.at - a.at).slice(0, MAX_VITALS_LOG);
}

export function sanitizeTimelineEvents(value: unknown, now = Date.now()): TimelineEvent[] {
  if (!Array.isArray(value)) return [];
  const safe: TimelineEvent[] = [];
  for (const candidate of value) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) continue;
    const x = candidate as Record<string, unknown>;
    if (typeof x.f !== "string" || typeof x.a !== "string" || typeof x.t !== "number" || !Number.isFinite(x.t) ||
        x.t <= 0 || x.t > now || typeof x.m !== "number" || !Number.isFinite(x.m) || x.m < 1 || x.m > 1440 ||
        (x.id !== undefined && (typeof x.id !== "string" || x.id.length > 100))) continue;
    safe.push({ ...(typeof x.id === "string" ? { id: x.id } : {}), f: x.f.slice(0, 160), a: x.a.slice(0, 160), t: x.t, m: x.m });
  }
  return safe.slice(-500);
}

export function getVitalsLog(): VitalsSnapshot[] {
  return sanitizeVitalsLog(readSessionJSON<unknown>(VITALS_LOG_KEY, []));
}

export function pushVitals(v: Vitals): VitalsSnapshot[] {
  const [snapshot] = sanitizeVitalsLog([{ at: Date.now(), v }]);
  if (!snapshot) return getVitalsLog();
  const next = [snapshot, ...getVitalsLog()].slice(0, MAX_VITALS_LOG);
  writeSessionJSON(VITALS_LOG_KEY, next);
  return next;
}

export function clearVitalsLog(): void {
  removeSessionKey(VITALS_LOG_KEY);
}

export interface PatientMini {
  w: string; age: string; scr: string; sexe: string;
}

export interface TimelineEvent {
  id?: string; f: string; a: string; t: number; m: number;
}

export interface TimelineArchive { at: number; n: number; text: string }

export function sanitizeTimelineArchive(value: unknown, now = Date.now()): TimelineArchive[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((candidate) => {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return [];
    const x = candidate as Record<string, unknown>;
    if (typeof x.at !== "number" || !Number.isFinite(x.at) || x.at <= 0 || x.at > now ||
        typeof x.n !== "number" || !Number.isInteger(x.n) || x.n < 1 || x.n > 500 || typeof x.text !== "string") return [];
    return [{ at: x.at, n: x.n, text: x.text.slice(0, 20_000) }];
  }).sort((a, b) => b.at - a.at).slice(0, 5);
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
  age: { fr: "Âge", ar: "العمر" },
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

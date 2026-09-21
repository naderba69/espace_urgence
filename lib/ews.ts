// v7.8 — Scores d'alerte précoce calculés en direct dans la réévaluation.
// MEWS (Modified Early Warning Score) + qSOFA — référentiels standard (NEWS2 dérivé, Surviving Sepsis 2021).

export interface VitalInput {
  rr: number;      // FR /min
  hr: number;      // FC /min
  sbp: number;     // TA systolique mmHg
  temp: number;    // °C
  avpu: 0 | 1 | 2 | 3; // A=0 V=1 P=2 U=3
}

export interface ScoreResult {
  score: number;
  risk: "low" | "medium" | "high";
}

export function mewsParts(v: VitalInput) {
  const rr = v.rr <= 8 ? 2 : v.rr <= 14 ? 0 : v.rr <= 20 ? 1 : v.rr <= 29 ? 2 : 3;
  const hr = v.hr <= 40 ? 2 : v.hr <= 50 ? 1 : v.hr <= 100 ? 0 : v.hr <= 110 ? 1 : v.hr <= 129 ? 2 : 3;
  const sbp = v.sbp <= 70 ? 3 : v.sbp <= 80 ? 2 : v.sbp <= 100 ? 1 : v.sbp <= 199 ? 0 : 2;
  const temp = v.temp < 35 ? 2 : v.temp < 38.5 ? 0 : 2;
  return { rr, hr, sbp, temp, avpu: v.avpu };
}

export function mews(v: VitalInput): ScoreResult {
  const p = mewsParts(v);
  const score = p.rr + p.hr + p.sbp + p.temp + p.avpu;
  return { score, risk: score >= 5 ? "high" : score >= 3 ? "medium" : "low" };
}

export interface QsofaInput {
  rr: number;
  sbp: number;
  altered: boolean; // conscience altérée (V/P/U)
}

export function qsofa(q: QsofaInput): ScoreResult {
  const score = (q.rr >= 22 ? 1 : 0) + (q.sbp <= 100 ? 1 : 0) + (q.altered ? 1 : 0);
  return { score, risk: score >= 2 ? "high" : "low" };
}

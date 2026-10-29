const record = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;

function numericText(value: unknown, fallback: string): string {
  if (typeof value !== "string" && typeof value !== "number") return fallback;
  const text = String(value).trim().slice(0, 32);
  if (text === "") return "";
  if (!/^\d+(?:[.,]\d+)?$/.test(text)) return fallback;
  const n = Number(text.replace(",", "."));
  return Number.isFinite(n) && n >= 0 && n <= 1_000_000 ? text : fallback;
}

export interface PerfusionState { idx: number; weight: string; dose: number }
export function sanitizePerfusionState(value: unknown, presetCount: number): PerfusionState | null {
  const x = record(value);
  if (!x || !Number.isInteger(presetCount) || presetCount < 1) return null;
  const idx = typeof x.idx === "number" && Number.isInteger(x.idx) && x.idx >= 0 && x.idx < presetCount ? x.idx : 0;
  const weight = numericText(x.weight, "70");
  const dose = typeof x.dose === "number" && Number.isFinite(x.dose) && x.dose >= 0 && x.dose <= 1_000_000 ? x.dose : 0;
  return { idx, weight, dose };
}

export interface GcsState { peds: boolean; sel: { eyes: number; verbal: number; motor: number } }
export function sanitizeGcsState(value: unknown): GcsState | null {
  const x = record(value);
  const s = record(x?.sel);
  if (!x || !s) return null;
  const eyes = s.eyes;
  const verbal = s.verbal;
  const motor = s.motor;
  if (typeof eyes !== "number" || ![1, 2, 3, 4].includes(eyes) ||
      typeof verbal !== "number" || ![1, 2, 3, 4, 5].includes(verbal) ||
      typeof motor !== "number" || ![1, 2, 3, 4, 5, 6].includes(motor)) return null;
  return { peds: x.peds === true, sel: { eyes, verbal, motor } };
}

export interface DoseWeightState { medId: string; weight: string }
export function sanitizeDoseWeightState(value: unknown, eligibleIds: readonly string[]): DoseWeightState | null {
  const x = record(value);
  if (!x || typeof x.medId !== "string" || !eligibleIds.includes(x.medId)) return null;
  return { medId: x.medId, weight: numericText(x.weight, "10") };
}

export interface DripState { volume: string; hours: string; dropsPerMl: 20 | 60 }
export function sanitizeDripState(value: unknown): DripState | null {
  const x = record(value);
  if (!x) return null;
  return {
    volume: numericText(x.volume, "500"),
    hours: numericText(x.hours, "8"),
    dropsPerMl: x.dropsPerMl === 60 ? 60 : 20,
  };
}

export interface PumpPreparationState { ampMg: number; ampVol: number; count: number; target: number; convention: "total" | "added" }
export function sanitizePumpPreparation(value: unknown, fallback: PumpPreparationState): PumpPreparationState {
  const x = record(value);
  if (!x) return fallback;
  const positive = (candidate: unknown, defaultValue: number, max = 1_000_000) =>
    typeof candidate === "number" && Number.isFinite(candidate) && candidate > 0 && candidate <= max ? candidate : defaultValue;
  return {
    ampMg: positive(x.ampMg, fallback.ampMg),
    ampVol: positive(x.ampVol, fallback.ampVol),
    count: typeof x.count === "number" && Number.isInteger(x.count) && x.count > 0 && x.count <= 1000 ? x.count : fallback.count,
    target: positive(x.target, fallback.target),
    convention: x.convention === "added" ? "added" : "total",
  };
}

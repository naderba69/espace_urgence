// Parsing/assainissement des observations IA d'ECG. Ce parseur ne valide jamais une interprétation clinique.
import type { EcgAnalysis } from "./ecg-db";

const MAX_RESPONSE_LENGTH = 8_000;
const MAX_FIELD_LENGTH = 240;
const MAX_TOTAL_TEXT_LENGTH = 2_400;

/**
 * Accepte uniquement de courts champs descriptifs. Les diagnostics, niveaux de gravité,
 * recommandations et liens vers des protocoles générés ne sont volontairement pas exposés.
 */
export function parseEcgResponse(raw: string): EcgAnalysis | null {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > MAX_RESPONSE_LENGTH) return null;
  const cleaned = raw
    .replace(/```(?:json)?/gi, "")
    .replace(/^[^{]*({[\s\S]*})[^}]*$/, "$1");
  try {
    return sanitizeEcgAnalysis(JSON.parse(cleaned));
  } catch {
    return null;
  }
}

/** Sanitize legacy IndexedDB entries too; old versions stored diagnosis/actions/raw text. */
export function sanitizeEcgAnalysis(value: unknown): EcgAnalysis | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const a = value as Record<string, unknown>;
  const safe: EcgAnalysis = {
    rhythm: shortText(a.rhythm ?? a.rythme),
    heartRateBpm: boundedNumber(a.heartRateBpm ?? a.frequence ?? a.fc, 20, 300),
    intervals: shortText(a.intervals),
    stSegment: shortText(a.stSegment ?? a.st),
    tWave: shortText(a.tWave ?? a.t),
    hyperkalemiaSigns: shortText(a.hyperkalemiaSigns ?? a.hyperkaliemie),
    avBlockSigns: shortText(a.avBlockSigns ?? a.bav),
  };
  const textLength = Object.values(safe).reduce((sum, item) => sum + (typeof item === "string" ? item.length : 0), 0);
  if (textLength > MAX_TOTAL_TEXT_LENGTH || !Object.values(safe).some(Boolean)) return null;
  return safe;
}

function shortText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    // Neutralise Unicode bidi controls so model text cannot visually reorder labels/values.
    .replace(/[\u061c\u200e\u200f\u202a-\u202e\u2066-\u206f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_FIELD_LENGTH);
  return text || undefined;
}

function boundedNumber(value: unknown, min: number, max: number): number | undefined {
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : NaN;
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : undefined;
}

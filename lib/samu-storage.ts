export interface SamuFicheState {
  missionType: string;
  vehicule: string;
  equipe: string;
  hAppel: string;
  hDepart: string;
  hSurLieux: string;
  hDepartLieux: string;
  hHopital: string;
  age: string;
  sexe: string;
  atcd: string;
  motif: string;
  fc: string;
  ta: string;
  fr: string;
  spo2: string;
  gcs: string;
  glycemie: string;
  temp: string;
  gestes: string[];
  traitements: string;
  evolution: string;
  destination: string;
  transmissions: string;
}

export const SAMU_GESTES = [
  "VVP ×2", "O₂", "BAVU / VNI", "Intubation", "Aspiration", "PLS",
  "ECG / scope", "DSA / choc", "Immobilisation / collier", "PSE",
  "Sonde vésicale", "Pansement / hémostase",
] as const;

export function sanitizeSamuFiche(value: unknown, empty: SamuFicheState): SamuFicheState {
  const source = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const result = { ...empty };
  for (const key of Object.keys(empty) as Array<keyof SamuFicheState>) {
    if (key === "gestes") continue;
    const candidate = source[key];
    if (typeof candidate === "string") result[key] = candidate.slice(0, 4_000);
  }
  result.gestes = Array.isArray(source.gestes)
    ? [...new Set(source.gestes.filter((item): item is string => typeof item === "string" && (SAMU_GESTES as readonly string[]).includes(item)))]
    : [];
  return result;
}

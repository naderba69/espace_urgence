// Parsing robuste de la réponse IA d'ECG (JSON éventuellement entouré de texte/fences).
import type { EcgAnalysis } from "./ecg-db";

export function parseEcgResponse(raw: string): EcgAnalysis | null {
  if (!raw) return null;
  const cleaned = raw
    .replace(/```(?:json)?/gi, "")
    .replace(/^[^{]*({[\s\S]*})[^}]*$/, "$1"); // extrait le plus grand bloc {...}
  try {
    const obj = JSON.parse(cleaned);
    if (typeof obj !== "object" || obj === null) return null;
    const a = obj as Record<string, unknown>;
    const sev = typeof a.severity === "string" ? a.severity.toLowerCase() : "";
    return {
      rhythm: str(a.rhythm ?? a.rythme),
      heartRateBpm: num(a.heartRateBpm ?? a.frequence ?? a.fc),
      intervals: str(a.intervals),
      stSegment: str(a.stSegment ?? a.st),
      tWave: str(a.tWave ?? a.t),
      hyperkalemiaSigns: str(a.hyperkalemiaSigns ?? a.hyperkaliemie),
      avBlockSigns: str(a.avBlockSigns ?? a.bav),
      suspectedDiagnosis: str(a.suspectedDiagnosis ?? a.diagnostic),
      severity: sev.includes("crit") || sev.includes("critique") ? "critical" : sev.includes("caution") || sev.includes("vigil") || sev.includes("yellow") ? "caution" : sev.includes("normal") || sev.includes("green") ? "normal" : undefined,
      confidence: num(a.confidence ?? a.confiance),
      immediateRecommendations: arr(a.immediateRecommendations ?? a.recommandations),
      protocolIds: arr(a.protocolIds ?? a.protocoles),
      summary: str(a.summary ?? a.resume),
    };
  } catch {
    return null;
  }
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, 600) : undefined;
}
function num(v: unknown): number | undefined {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : undefined;
}
function arr(v: unknown): string[] | undefined {
  if (Array.isArray(v)) return v.map((x) => String(x).slice(0, 300)).slice(0, 6);
  return undefined;
}

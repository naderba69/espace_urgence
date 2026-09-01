// Configuration IA — stockée dans localStorage (appareil personnel de l'utilisateur).
import { readJSON, writeJSON } from "./storage";

export type AiProvider = "gemini" | "openrouter";

export interface AiConfig {
  enabled: boolean;          // interrupteur général
  provider: AiProvider;
  apiKey: string;            // masquée dans l'UI ; stockée localement
  textModel: string;         // champ libre (Google renomme souvent !)
  visionModel: string;
}

export const AI_KEY = "eutn:ai-config";

// ⚠️ Les modèles Gemini évoluent tous les ~6 mois : le champ reste librement éditable.
export const DEFAULT_AI: AiConfig = {
  enabled: false,
  provider: "gemini",
  apiKey: "",
  textModel: "gemini-2.5-flash",
  visionModel: "gemini-2.5-flash",
};

export const PROVIDER_PRESETS: Record<AiProvider, { text: string; vision: string; note: { fr: string; ar: string } }> = {
  gemini: {
    text: "gemini-2.5-flash",
    vision: "gemini-2.5-flash",
    note: { fr: "Clé gratuite : aistudio.google.com → « Get API key ».", ar: "مفتاح مجاني: aistudio.google.com ← Get API key" },
  },
  openrouter: {
    text: "google/gemini-2.5-flash",
    vision: "google/gemini-2.5-flash",
    note: { fr: "Clé : openrouter.ai/keys (accès à plusieurs modèles).", ar: "المفتاح: openrouter.ai/keys (عدة نماذج)" },
  },
};

export function readAiConfig(): AiConfig {
  return { ...DEFAULT_AI, ...readJSON<Partial<AiConfig>>(AI_KEY, {}) };
}

export function writeAiConfig(cfg: AiConfig): void {
  writeJSON(AI_KEY, cfg);
}

export function aiReady(): boolean {
  const c = readAiConfig();
  return c.enabled && c.apiKey.trim().length > 8;
}

export function clearAiData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("eutn:ai-chat");
}

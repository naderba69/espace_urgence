// Configuration IA : préférences persistées, clé API conservée uniquement en mémoire (jamais dans localStorage).
import { readJSON, writeJSON } from "./storage";

export type AiProvider = "gemini" | "openrouter";

export interface AiConfig {
  enabled: boolean;          // interrupteur général
  provider: AiProvider;
  apiKey: string;            // masquée dans l'UI ; mémoire vive seulement, perdue au rechargement
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

// ── Mini-store : cache module + abonnement léger, pour que `readAiConfig`
//    renvoie un objet stable (snapshot compatible useSyncExternalStore) et que
//    les écritures via writeAiConfig se propagent sans setState dans un effet.
let cache: AiConfig | null = null;
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
export function subscribeAiConfig(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function sanitizeAiConfig(value: unknown, keepKey: boolean): AiConfig {
  const x = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const safeModel = (v: unknown, fallback: string) =>
    typeof v === "string" && v.trim().length > 0 ? v.trim().slice(0, 160) : fallback;
  return {
    enabled: x.enabled === true,
    provider: x.provider === "openrouter" ? "openrouter" : "gemini",
    apiKey: keepKey && typeof x.apiKey === "string" ? x.apiKey.trim().slice(0, 500) : "",
    textModel: safeModel(x.textModel, DEFAULT_AI.textModel),
    visionModel: safeModel(x.visionModel, DEFAULT_AI.visionModel),
  };
}

export function readAiConfig(): AiConfig {
  if (!cache) {
    const stored = readJSON<unknown>(AI_KEY, {});
    // Les anciennes versions stockaient la clé en clair : l'effacer de localStorage
    // et ne conserver les nouvelles saisies qu'en mémoire jusqu'au rechargement.
    cache = sanitizeAiConfig(stored, false);
    writeJSON(AI_KEY, cache);
  }
  return cache;
}

export function writeAiConfig(cfg: AiConfig): void {
  cache = sanitizeAiConfig(cfg, true);
  writeJSON(AI_KEY, { ...cache, apiKey: "" });
  emit();
}

export function aiReady(): boolean {
  const c = readAiConfig();
  return c.enabled && c.apiKey.trim().length > 8;
}

export function clearAiData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("eutn:ai-chat");
}

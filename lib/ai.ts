// Service IA : appels navigateur directs à Gemini (generateContent) ou OpenRouter (OpenAI-compatible).
// Jamais de backend : la clé API reste sur l'appareil de l'utilisateur.
import { readAiConfig, type AiProvider } from "./ai-config";

export class AiError extends Error {
  code: "no-key" | "invalid-key" | "rate-limit" | "network" | "provider" | "disabled" | "consent";
  constructor(code: AiError["code"], extra?: string) {
    super(extra ?? code);
    this.code = code;
  }
}

const TIMEOUT_MS = 45_000;

async function postWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } catch {
    throw new AiError("network");
  } finally {
    clearTimeout(t);
  }
}

async function mapError(res: Response): Promise<never> {
  if (res.status === 401 || res.status === 403) throw new AiError("invalid-key");
  if (res.status === 429) throw new AiError("rate-limit");
  let hint = "";
  try {
    hint = (await res.text()).slice(0, 300);
  } catch { /* corps vide */ }
  throw new AiError("provider", hint);
}

interface ChatMessage { role: "user" | "assistant"; content: string }

export interface AiTextInput {
  system?: string;
  messages: ChatMessage[];   // user/assistant alternés
  temperature?: number;
  maxTokens?: number;
}

// ---------- Gemini ----------
async function geminiGenerate(cfg: ReturnType<typeof readAiConfig>, input: AiTextInput, image?: { b64: string; mime: string }): Promise<string> {
  const model = image ? cfg.visionModel : cfg.textModel;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const contents = input.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  if (image) contents.push({ role: "user", parts: [{ inline_data: { mime_type: image.mime, data: image.b64 } }] } as never);
  const res = await postWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": cfg.apiKey },
    body: JSON.stringify({
      ...(input.system ? { system_instruction: { parts: [{ text: input.system }] } } : {}),
      contents,
      generationConfig: { temperature: input.temperature ?? 0.3, maxOutputTokens: input.maxTokens ?? 2048 },
    }),
  });
  if (!res.ok) await mapError(res);
  const json = await res.json();
  const text: string | undefined = json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("");
  if (!text) throw new AiError("provider", "réponse vide");
  return text.trim();
}

// ---------- OpenRouter ----------
async function openrouterGenerate(cfg: ReturnType<typeof readAiConfig>, input: AiTextInput, image?: { b64: string; mime: string }): Promise<string> {
  const model = image ? cfg.visionModel : cfg.textModel;
  const messages = [
    ...(input.system ? [{ role: "system", content: input.system }] : []),
    ...input.messages.map((m) => ({ role: m.role, content: m.content })),
  ];
  if (image) {
    messages.push({
      role: "user",
      content: [
        { type: "image_url", image_url: { url: `data:${image.mime};base64,${image.b64}` } },
        { type: "text", text: "Analyse selon les consignes système." },
      ],
    } as never);
  }
  const res = await postWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
      "HTTP-Referer": "https://espace-urgence-tn.local",
      "X-Title": "Espace Urgence TN",
    },
    body: JSON.stringify({ model, messages, temperature: input.temperature ?? 0.3, max_tokens: input.maxTokens ?? 2048 }),
  });
  if (!res.ok) await mapError(res);
  const json = await res.json();
  const text: string | undefined = json?.choices?.[0]?.message?.content;
  if (!text) throw new AiError("provider", "réponse vide");
  return text.trim();
}

// ---------- API publique ----------
function route(cfgProvider: AiProvider, cfg: ReturnType<typeof readAiConfig>, input: AiTextInput, image?: { b64: string; mime: string }): Promise<string> {
  return cfgProvider === "openrouter" ? openrouterGenerate(cfg, input, image) : geminiGenerate(cfg, input, image);
}

export interface AiTransferOptions {
  /** Only set after the caller has just collected an explicit, task-specific consent. */
  transferConfirmed?: boolean;
  language?: "fr" | "ar";
}

function confirmExternalTransfer(
  cfg: ReturnType<typeof readAiConfig>,
  systemPrompt: string | undefined,
  messages: ChatMessage[],
  hasImage: boolean,
  options: AiTransferOptions,
): void {
  if (options.transferConfirmed) return;
  if (typeof window === "undefined" || typeof window.confirm !== "function") throw new AiError("consent");

  const provider = cfg.provider === "gemini" ? "Google Gemini" : "OpenRouter";
  const model = hasImage ? cfg.visionModel : cfg.textModel;
  const compact = (value: string) => value.replace(/\s+/g, " ").trim();
  const excerpt = (label: string, value: string) => {
    const text = compact(value);
    if (!text) return "";
    const characters = Array.from(text);
    const sample = characters.length > 240
      ? `${characters.slice(0, 120).join("")} … ${characters.slice(-120).join("")}`
      : text;
    return `\n${label} (${characters.length} ${options.language === "ar" ? "حرفاً" : "caractères"}) : ${sample}${characters.length > 240 ? " …" : ""}`;
  };
  const promptText = messages.map((message) => message.content).join("\n");
  const promptPreview = excerpt(options.language === "ar" ? "مقتطف من طلبك" : "Extrait de votre demande", promptText);
  const systemPreview = excerpt(options.language === "ar" ? "مقتطف من السياق/التعليمات" : "Extrait du contexte / des consignes", systemPrompt ?? "");
  const preview = promptPreview || systemPreview ? `\n\n${options.language === "ar" ? "المحتوى الذي سيُرسل" : "Contenu transmis"}:${promptPreview}${systemPreview}` : "";
  const message = options.language === "ar"
    ? `سيُرسل طلبك والسياق المُدخل${hasImage ? " والصورة الطبية" : ""} إلى خدمة خارجية: ${provider} (النموذج ${model}). قد تحتوي المعلومات على بيانات صحية. لا ترسل اسماً أو معرّفاً، وتحقق من سياسة مؤسستك والمزوّد؛ قد تُحتسب كلفة.${preview}`
    : `Votre demande et le contexte saisi${hasImage ? " ainsi que l’image médicale" : ""} seront transmis au service externe ${provider} (modèle ${model}). Ils peuvent contenir des données de santé. N’envoyez aucun nom ni identifiant ; vérifiez les règles de votre établissement et du fournisseur. Des coûts peuvent s’appliquer.${preview}`;
  if (!window.confirm(message)) throw new AiError("consent");
}

export async function generateText(prompt: string, systemPrompt?: string, options: AiTransferOptions = {}): Promise<string> {
  const cfg = readAiConfig();
  if (!cfg.enabled) throw new AiError("disabled");
  if (!cfg.apiKey.trim()) throw new AiError("no-key");
  const input = { system: systemPrompt, messages: [{ role: "user" as const, content: prompt }] };
  confirmExternalTransfer(cfg, systemPrompt, input.messages, false, options);
  return route(cfg.provider, cfg, input);
}

export async function chat(messages: ChatMessage[], systemPrompt: string, options: AiTransferOptions = {}): Promise<string> {
  const cfg = readAiConfig();
  if (!cfg.enabled) throw new AiError("disabled");
  if (!cfg.apiKey.trim()) throw new AiError("no-key");
  confirmExternalTransfer(cfg, systemPrompt, messages, false, options);
  return route(cfg.provider, cfg, { system: systemPrompt, messages });
}

export async function analyzeImage(
  imageBase64: string,
  prompt: string,
  mime = "image/jpeg",
  options: AiTransferOptions = {},
): Promise<string> {
  const cfg = readAiConfig();
  if (!cfg.enabled) throw new AiError("disabled");
  if (!cfg.apiKey.trim()) throw new AiError("no-key");
  const messages = [{ role: "user" as const, content: "Analyse cette image médicale." }];
  confirmExternalTransfer(cfg, prompt, messages, true, options);
  return route(cfg.provider, cfg, { system: prompt, messages }, { b64: imageBase64, mime });
}

/** TTS gratuit : Web Speech API (voix du système). Retourne false si non supporté. */
export function speak(text: string, lang: "fr" | "ar"): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === "ar" ? "ar-TN" : "fr-FR";
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
  return true;
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

/** Test de connexion — prompt trivial, utilisé par les Paramètres. */
export async function testConnection(options: AiTransferOptions = {}): Promise<void> {
  await generateText("Réponds par le mot : OK", undefined, options);
}

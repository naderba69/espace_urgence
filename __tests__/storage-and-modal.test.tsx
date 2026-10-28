// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useRef } from "react";
import { sanitizePatient, sanitizePatientLog, sanitizePrefs, sanitizeRecentKeys, sanitizeStringArray } from "@/lib/storage";
import { useModalFocusTrap } from "@/lib/modal-focus";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("validation du stockage local", () => {
  it("ramène les préférences inconnues vers des valeurs sûres", () => {
    expect(sanitizePrefs({ lang: "xx", theme: "inject", fontSize: 999, muted: "yes", printSize: "a3" })).toEqual({
      lang: "fr", theme: "auto", fontSize: 16, muted: false, printSize: "a4",
    });
    expect(sanitizePrefs({ lang: "ar", theme: "amoled", fontSize: 20, muted: true, printSize: "a5" })).toEqual({
      lang: "ar", theme: "amoled", fontSize: 20, muted: true, printSize: "a5",
    });
  });

  it("filtre et limite les favoris/récents malformés", () => {
    expect(sanitizeStringArray(["a", 3, "", " a ", "b"])).toEqual(["a", "b"]);
    expect(sanitizeRecentKeys([{ key: "x", at: 1 }, { key: 2 }, null, { key: "y" }])).toEqual(["x", "y"]);
  });

  it("n'accepte pour le patient que des nombres finis non négatifs", () => {
    expect(sanitizePatient({ w: "70,5", age: "41", scr: "1.2", sexe: "f" })).toEqual({
      w: "70,5", age: "41", scr: "1.2", sexe: "f",
    });
    expect(sanitizePatient({ w: "Infinity", age: "<script>", scr: -3, sexe: "x" })).toEqual({
      w: "", age: "", scr: "", sexe: "m",
    });
  });

  it("assainit l'archive patient tout en gardant une limite de 5 entrées", () => {
    const now = 10_000;
    const input = [
      { at: 8_000, p: { w: "80", age: "40", scr: "90", sexe: "m" } },
      { at: 9_000, p: { w: "70", age: "30", scr: "70", sexe: "f" } },
      { at: "bad", p: { w: "60" } },
      { at: 11_000, p: { w: "60" } },
      { at: 7_000, p: { w: "Infinity" } },
      { at: 6_000, p: { w: "55", age: "25", scr: "55", sexe: "m" } },
      { at: 5_000, p: { w: "50", age: "20", scr: "50", sexe: "m" } },
      { at: 4_000, p: { w: "45", age: "18", scr: "45", sexe: "m" } },
      { at: 3_000, p: { w: "40", age: "16", scr: "40", sexe: "m" } },
      { at: 2_000, p: { w: "35", age: "14", scr: "35", sexe: "m" } },
    ];
    const result = sanitizePatientLog(input, now);
    expect(result).toHaveLength(5);
    expect(result.map((entry) => entry.at)).toEqual([9_000, 8_000, 6_000, 5_000, 4_000]);
  });
});

describe("protection des clés IA et retrait des fonctions non sûres", () => {
  it("ne persiste pas la clé Gemini et purge les anciennes clés en clair", async () => {
    localStorage.clear();
    vi.resetModules();
    const config = await import("@/lib/ai-config");
    config.writeAiConfig({ ...config.DEFAULT_AI, enabled: true, apiKey: "secret-key-test" });
    expect(JSON.parse(localStorage.getItem(config.AI_KEY) ?? "{}").apiKey).toBe("");
    expect(config.readAiConfig().apiKey).toBe("secret-key-test");

    localStorage.setItem(config.AI_KEY, JSON.stringify({ enabled: true, apiKey: "legacy-secret" }));
    vi.resetModules();
    const migrated = await import("@/lib/ai-config");
    expect(migrated.readAiConfig().apiKey).toBe("");
    expect(JSON.parse(localStorage.getItem(migrated.AI_KEY) ?? "{}").apiKey).toBe("");
  });

  it("transmet les consignes image comme instructions système et n'expose pas la clé Gemini dans l'URL", async () => {
    vi.resetModules();
    const config = await import("@/lib/ai-config");
    config.writeAiConfig({ ...config.DEFAULT_AI, enabled: true, apiKey: "secret-key-test" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: "ok" }] } }] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const ai = await import("@/lib/ai");
    await ai.analyzeImage("aGVsbG8=", "Consignes cliniques de test", "image/jpeg", { transferConfirmed: true, language: "fr" });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).not.toContain("secret-key-test");
    expect(new Headers(init.headers).get("x-goog-api-key")).toBe("secret-key-test");
    const body = JSON.parse(String(init.body));
    expect(body.system_instruction.parts[0].text).toBe("Consignes cliniques de test");
    expect(body.contents[1].parts[0].inline_data.data).toBe("aGVsbG8=");
    vi.unstubAllGlobals();
  });

  it("exige un accord explicite avant tout transfert textuel externe", async () => {
    vi.resetModules();
    const config = await import("@/lib/ai-config");
    config.writeAiConfig({ ...config.DEFAULT_AI, enabled: true, apiKey: "secret-key-test" });
    const fetchMock = vi.fn();
    const confirmMock = vi.fn(() => false);
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("confirm", confirmMock);
    const ai = await import("@/lib/ai");

    await expect(ai.generateText("Motif médical sensible", "Instructions de test", { language: "fr" }))
      .rejects.toMatchObject({ code: "consent" });
    expect(confirmMock).toHaveBeenCalledWith(expect.stringContaining("service externe"));
    expect(confirmMock).toHaveBeenCalledWith(expect.stringContaining("Motif médical sensible"));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("n'exécute aucun générateur IA dans les outils de triage et de doses", async () => {
    const fs = await import("node:fs");
    const flash = fs.readFileSync("app/flash-ia/page.tsx", "utf8");
    const triage = fs.readFileSync("app/triage-ia/page.tsx", "utf8");
    expect(flash).not.toContain("generateText");
    expect(flash).not.toMatch(/doses\s*:/);
    expect(triage).not.toContain("generateText");
    expect(triage).not.toMatch(/category\s*:/);
    const ecgAnalyzer = fs.readFileSync("components/ecg/ECGAnalyzer.tsx", "utf8");
    const ecgResult = fs.readFileSync("components/ecg/ECGResultCard.tsx", "utf8");
    expect(ecgAnalyzer).toContain("!transferAccepted");
    expect(ecgAnalyzer).toContain("transferConfirmed: true");
    expect(ecgResult).not.toContain("analysis.suspectedDiagnosis");
    expect(ecgResult).not.toContain("analysis.immediateRecommendations");
    expect(ecgResult).not.toContain("analysis.severity");
    const sw = fs.readFileSync("public/sw.js", "utf8");
    expect(sw).not.toContain("norm || dir");
    expect(sw).toMatch(/return off \|\| new Response\(/);
  });
});

describe("focus du dialogue modal", () => {
  it("confine Tab et restaure le focus à la fermeture", () => {
    function Dialog({ active }: { active: boolean }) {
      const ref = useRef<HTMLDivElement>(null);
      useModalFocusTrap(ref, active);
      return active ? <div ref={ref} role="dialog"><button>Premier</button><button>Dernier</button></div> : null;
    }

    render(<button>Ouvrir</button>);
    const opener = screen.getByRole("button", { name: "Ouvrir" });
    opener.focus();
    const view = render(<Dialog active />);
    const first = screen.getByRole("button", { name: "Premier" });
    expect(opener.parentElement?.hasAttribute("inert")).toBe(true);
    const last = screen.getByRole("button", { name: "Dernier" });
    expect(document.activeElement).toBe(first);

    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);

    first.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);

    view.unmount();
    expect(opener.parentElement?.hasAttribute("inert")).toBe(false);
    expect(document.activeElement).toBe(opener);
  });
});

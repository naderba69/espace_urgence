// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  aiReady: vi.fn(() => true),
  readAiConfig: vi.fn(() => ({ enabled: true, provider: "gemini", textModel: "gemini-2.5-flash", visionModel: "gemini-2.5-flash", apiKey: "never-render-this-key" })),
  generateText: vi.fn(),
}));

vi.mock("@/components/Providers", () => ({
  useApp: () => ({ lang: "ar", t: (key: string) => key }),
}));

vi.mock("@/lib/ai-config", () => ({
  aiReady: mocks.aiReady,
  readAiConfig: mocks.readAiConfig,
}));

vi.mock("@/lib/ai", () => ({
  AiError: class AiError extends Error {
    code: string;
    constructor(code: string) { super(code); this.code = code; }
  },
  generateText: mocks.generateText,
}));

import CalculationExplainer from "@/components/ai/CalculationExplainer";
import type { CalculationExplanationContext } from "@/lib/ai-calculation-explanation";

afterEach(cleanup);

const CONTEXT: CalculationExplanationContext = {
  title: "Prégabaline — résultat rénal",
  method: "Seuils RCP appliqués à la ClCr déjà calculée.",
  inputs: [{ label: "ClCr calculée", value: "61.7 mL/min" }],
  result: "Plage RCP affichée — ne pas individualiser",
  source: "RCP ANSM lié à l’écran",
  limitations: ["Pas de dose individuelle calculée."],
};

beforeEach(() => {
  mocks.aiReady.mockReturnValue(true);
  mocks.generateText.mockReset().mockResolvedValue("هذا شرح للنتيجة الموجودة فقط.");
});

describe("CalculationExplainer — consentement et périmètre", () => {
  it("n’envoie aucune donnée avant confirmation, puis transmet uniquement le contexte présenté", async () => {
    render(<CalculationExplainer context={CONTEXT} />);

    fireEvent.click(screen.getByRole("button", { name: "اشرح هذه النتيجة بالذكاء الاصطناعي" }));
    expect(screen.getByText("تأكيد الإرسال أولاً")).toBeTruthy();
    expect(screen.getByText(/القيم تظل معطيات صحية/)).toBeTruthy();
    expect(screen.getByText("61.7 mL/min")).toBeTruthy();
    expect(screen.getByText("Google Gemini")).toBeTruthy();
    expect(screen.getByText("gemini-2.5-flash")).toBeTruthy();
    expect(screen.queryByText("never-render-this-key")).toBeNull();
    expect(mocks.generateText).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "أرسل واشرح" }));
    await waitFor(() => expect(mocks.generateText).toHaveBeenCalledTimes(1));
    const [prompt, systemPrompt] = mocks.generateText.mock.calls[0] as [string, string];
    expect(prompt).toContain("61.7 mL/min");
    expect(prompt).toContain("Plage RCP affichée — ne pas individualiser");
    expect(systemPrompt).toContain("Do not recalculate");
    expect(screen.getByText("هذا شرح للنتيجة الموجودة فقط.")).toBeTruthy();
    expect(screen.getByText(/هذا الشرح لا يصادق على المصدر/)).toBeTruthy();
  });

  it("actualise la confirmation et n’envoie pas si le fournisseur ou le modèle a changé", async () => {
    render(<CalculationExplainer context={CONTEXT} />);
    fireEvent.click(screen.getByRole("button", { name: "اشرح هذه النتيجة بالذكاء الاصطناعي" }));
    mocks.readAiConfig.mockReturnValue({ enabled: true, provider: "openrouter", textModel: "openai/gpt-4.1-mini", visionModel: "google/gemini-2.5-flash", apiKey: "never-render-this-key" });

    fireEvent.click(screen.getByRole("button", { name: "أرسل واشرح" }));
    expect(mocks.generateText).not.toHaveBeenCalled();
    expect(screen.getByText("OpenRouter")).toBeTruthy();
    expect(screen.getByText("openai/gpt-4.1-mini")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("تغيّر إعداد الذكاء الاصطناعي");

    fireEvent.click(screen.getByRole("button", { name: "أرسل واشرح" }));
    await waitFor(() => expect(mocks.generateText).toHaveBeenCalledTimes(1));
  });

  it("إلغاء التأكيد لا يرسل شيئاً إلى المزوّد", () => {
    render(<CalculationExplainer context={CONTEXT} />);
    fireEvent.click(screen.getByRole("button", { name: "اشرح هذه النتيجة بالذكاء الاصطناعي" }));
    fireEvent.click(screen.getByRole("button", { name: "إلغاء" }));
    expect(mocks.generateText).not.toHaveBeenCalled();
    expect(screen.queryByText("تأكيد الإرسال أولاً")).toBeNull();
  });

  it("يوجّه إلى الإعدادات إن لم تكن IA مفعّلة ولا يفتح طلب الإرسال", () => {
    mocks.aiReady.mockReturnValue(false);
    render(<CalculationExplainer context={CONTEXT} />);
    fireEvent.click(screen.getByRole("button", { name: "اشرح هذه النتيجة بالذكاء الاصطناعي" }));
    expect(screen.getByRole("link", { name: /Ouvrir les paramètres IA|افتح إعدادات الذكاء الاصطناعي/ }).getAttribute("href")).toBe("/parametres");
    expect(screen.queryByText("تأكيد الإرسال أولاً")).toBeNull();
    expect(mocks.generateText).not.toHaveBeenCalled();
  });

  it("لا يعرض شرح نتيجة قديمة بعد تغير سياق الحساب", async () => {
    const { rerender } = render(<CalculationExplainer context={CONTEXT} />);
    fireEvent.click(screen.getByRole("button", { name: "اشرح هذه النتيجة بالذكاء الاصطناعي" }));
    fireEvent.click(screen.getByRole("button", { name: "أرسل واشرح" }));
    await waitFor(() => expect(screen.getByText("هذا شرح للنتيجة الموجودة فقط.")).toBeTruthy());

    rerender(<CalculationExplainer context={{ ...CONTEXT, result: "نتيجة جديدة" }} />);
    expect(screen.queryByText("هذا شرح للنتيجة الموجودة فقط.")).toBeNull();
  });
});

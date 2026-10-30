// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { generateText } = vi.hoisted(() => ({ generateText: vi.fn() }));

vi.mock("@/components/Providers", () => ({
  useApp: () => ({ lang: "fr", t: (key: string) => key }),
}));
vi.mock("@/components/ai/AiGate", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/components/T", () => ({
  default: ({ fr }: { fr: string }) => <>{fr}</>,
}));
vi.mock("@/lib/ai", () => ({
  generateText,
  AiError: class AiError extends Error { code = "provider"; },
}));
vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));
vi.mock("@/lib/reveal", () => ({ reveal: vi.fn() }));

import RapportPage from "@/app/rapport-ia/page";

afterEach(cleanup);
beforeEach(() => {
  generateText.mockReset();
  generateText.mockResolvedValue("Situation : brouillon de test");
});

describe("Compte rendu généré par IA", () => {
  it("avertit avant saisie sur les identifiants et les règles de transfert", () => {
    render(<RapportPage />);
    expect(screen.getByRole("note").textContent).toContain("retirez tout nom ou identifiant");
    expect(screen.getByRole("note").textContent).toContain("règles de votre établissement");
  });

  it("marque le texte généré comme brouillon non vérifié à relire", async () => {
    render(<RapportPage />);
    fireEvent.change(screen.getByLabelText("Motif"), { target: { value: "Douleur thoracique" } });
    fireEvent.click(screen.getByRole("button", { name: "Générer la note" }));

    expect(await screen.findByText(/Brouillon IA non vérifié/)).toBeTruthy();
    expect(screen.getByText("Situation : brouillon de test")).toBeTruthy();
    expect(generateText).toHaveBeenCalledOnce();
  });
});

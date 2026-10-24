// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/Providers", () => ({ useApp: () => ({ lang: "fr", t: (key: string) => key }) }));
vi.mock("@/components/SearchBar", () => ({ useRegisterRecent: () => {} }));

import NeonatRanPage from "@/app/calculateurs/neonat-ran/page";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(0));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Aide-mémoire néonatal", () => {
  it("ne déclenche l'alerte de 60 s que si la VPP est indiquée, et la retire au démarrage de la VPP", () => {
    render(<NeonatRanPage />);
    fireEvent.click(screen.getByRole("button", { name: "Démarrer" }));
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.queryByRole("alert")).toBeNull();

    fireEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("alert")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /3\. Ventiler à 30–60\/min/ }));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("interprète correctement un poids saisi avec la virgule décimale", () => {
    render(<NeonatRanPage />);
    fireEvent.change(screen.getByLabelText("Poids (kg) pour le calcul indicatif de l'adrénaline"), { target: { value: "3,2" } });
    expect(screen.getByText(/0\.03–0\.10 mg/)).toBeTruthy();
    expect(screen.getByText(/0\.32–0\.96 mL/)).toBeTruthy();
  });
});

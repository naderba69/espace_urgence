// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/Providers", () => ({ useApp: () => ({ lang: "fr", t: (key: string) => key }) }));
vi.mock("@/components/SearchBar", () => ({ useRegisterRecent: () => {} }));
vi.mock("@/lib/analytics", () => ({ trackEvent: () => {} }));

import HeparinePage from "@/app/calculateurs/heparine/page";

afterEach(cleanup);

describe("calculateur HNF — séparation des indications", () => {
  it("n'affiche pas de dose avant le choix explicite d'un schéma", () => {
    const { container } = render(<HeparinePage />);
    expect(container.textContent).toContain("Aucune dose n’est affichée avant le choix explicite de l’indication.");
    expect(container.textContent).not.toContain("Bolus initial (80 UI/kg");
    expect(container.textContent).not.toContain("Bolus initial (60 UI/kg");
  });

  it("applique les plafonds SCA 60/4 000 et 12/1 000, et change la cible avec fibrinolyse", () => {
    const { container } = render(<HeparinePage />);
    fireEvent.change(screen.getByRole("spinbutton", { name: "common.weight" }), { target: { value: "120" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Indication de l’héparine" }), { target: { value: "acs" } });
    const outputs = () => Array.from(container.querySelectorAll("[aria-live='polite'] p.text-3xl"), (el) => el.textContent);
    expect(outputs()).toEqual(["4000 UI", "1000 UI/h"]);
    expect(container.textContent).toContain("= 10 mL/h (100 UI/mL)");
    expect(container.textContent).toContain("cible 60–80 s pour le SCA médical");

    fireEvent.click(screen.getByRole("checkbox"));
    expect(container.textContent).toContain("cible thérapeutique 50–70 s avec fibrinolyse");
    expect(container.textContent).toContain("Ne pas utiliser ce schéma pour le bolus de salle de cathétérisme");
  });

  it("n'applique le schéma VTE qu'après choix et avertit que l'HBPM est préférée dans la plupart des EP", () => {
    const { container } = render(<HeparinePage />);
    fireEvent.change(screen.getByRole("combobox", { name: "Indication de l’héparine" }), { target: { value: "vte" } });
    expect(Array.from(container.querySelectorAll("[aria-live='polite'] p.text-3xl"), (el) => el.textContent)).toEqual(["5600 UI", "1260 UI/h"]);
    expect(container.textContent).toMatch(/AHA\/ACC 2026 préfère l’HBPM à l’HNF/);
    expect(container.textContent).toMatch(/protocole HNF UW Medicine/);
    expect(container.textContent).toMatch(/premier anti-Xa à 6 h/);
  });

  it("recalcule seulement les mL quand la concentration change", () => {
    const { container } = render(<HeparinePage />);
    fireEvent.change(screen.getByRole("combobox", { name: "Indication de l’héparine" }), { target: { value: "acs" } });
    expect(container.textContent).toContain("= 8.4 mL/h (100 UI/mL)");
    fireEvent.click(screen.getByRole("button", { name: /25 000 UI \/ 500 mL/ }));
    expect(container.textContent).toContain("= 16.8 mL/h (50 UI/mL)");
    expect(Array.from(container.querySelectorAll("[aria-live='polite'] p.text-3xl"), (el) => el.textContent)).toEqual(["4000 UI", "840 UI/h"]);
  });
});

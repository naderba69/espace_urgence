// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/components/Providers", () => ({
  useApp: () => ({ t: (key: string) => key, lang: "fr", pushRecent: vi.fn() }),
}));
vi.mock("@/lib/search", () => ({
  loadSearchIndex: vi.fn(() => Promise.resolve([])),
  searchItems: (query: string) => query ? [{
    key: "protocole:test",
    href: "/protocoles/test",
    title: { fr: "Protocole de test", ar: "اختبار" },
    type: "protocole",
    sev: "standard",
  }] : [],
}));

import SearchBar from "@/components/SearchBar";
import { TabBar } from "@/components/tools/ui";

afterEach(() => {
  cleanup();
  localStorage.clear();
  push.mockClear();
});

describe("accessibilité de la recherche combobox", () => {
  it("relie le champ au listbox et expose des options navigables au clavier", async () => {
    render(<SearchBar />);
    const input = screen.getByRole("combobox");
    expect(input.getAttribute("aria-expanded")).toBe("false");

    fireEvent.change(input, { target: { value: "test" } });
    const option = await screen.findByRole("option", { name: /Protocole de test/ });
    const listbox = screen.getByRole("listbox");
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(input.getAttribute("aria-controls")).toBe(listbox.id);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBe(option.id);
    expect(option.getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(push).toHaveBeenCalledWith("/protocoles/test");
  });

  it("garde l'historique dans le listbox et permet sa sélection au clavier", async () => {
    localStorage.setItem("eutn:search-history", JSON.stringify(["Recherche précédente"]));
    render(<SearchBar />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);

    const option = await screen.findByRole("option", { name: "Recherche précédente" });
    const listbox = screen.getByRole("listbox");
    expect(input.getAttribute("aria-controls")).toBe(listbox.id);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBe(option.id);
    fireEvent.keyDown(input, { key: "Enter" });
    expect((input as HTMLInputElement).value).toBe("Recherche précédente");
  });

  it("expose les choix d'onglet stylisés comme des boutons à état, pas comme des onglets ARIA incomplets", () => {
    render(<TabBar
      tabs={[{ id: "dose", label: "Dose" }, { id: "pompe", label: "Pompe" }]}
      active="dose"
      onChange={vi.fn()}
      ariaLabel="Outils du médicament"
    />);
    const group = screen.getByRole("group", { name: "Outils du médicament" });
    expect(group.querySelectorAll('[role="tab"]').length).toBe(0);
    expect(screen.getByRole("button", { name: "Dose" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Pompe" }).getAttribute("aria-pressed")).toBe("false");
  });
});

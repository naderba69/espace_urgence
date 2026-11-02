import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("app/globals.css", "utf8");

function contraste(hexA: string, hexB: string): number {
  const luminance = (hex: string) => {
    const raw = hex.replace("#", "");
    const expanded = raw.length === 3 ? raw.split("").map((part) => part + part).join("") : raw;
    const channels = [0, 2, 4].map((offset) => parseInt(expanded.slice(offset, offset + 2), 16) / 255);
    const linear = channels.map((channel) => channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const [high, low] = [luminance(hexA), luminance(hexB)].sort((a, b) => b - a);
  return (high + 0.05) / (low + 0.05);
}

describe("audit UI du calculateur ATB-DFG", () => {
  it("maintient au moins 4,5:1 sur les commandes actives, en clair comme en sombre", () => {
    const onAccent = [...css.matchAll(/--on-accent:\s*(#[0-9a-fA-F]{3,6})/g)].map((match) => match[1]);
    expect(onAccent).toEqual(["#ffffff", "#0b1220"]);

    const fonds = [
      ["#1565c0", "#b71c1c", "#b93800", "#0b6b63"],
      ["#8ab4f8", "#ff6b6b", "#ffa94d", "#4db6ac"],
    ];
    for (const [index, foregrounds] of fonds.entries()) {
      for (const background of foregrounds) {
        expect(contraste(onAccent[index], background), `${onAccent[index]} sur ${background}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("vérifie les couleurs du nouveau thème ATB en clair et le texte des actions actives", () => {
    expect(contraste("#ffffff", "#0f766e")).toBeGreaterThanOrEqual(4.5);
    expect(contraste("#042f2e", "#2dd4bf")).toBeGreaterThanOrEqual(4.5);
    const lightPairs = [
      ["#047857", "#ecfdf5"], ["#4d7c0f", "#f7fee7"], ["#b45309", "#fffbeb"],
      ["#c2410c", "#fff7ed"], ["#b91c1c", "#fef2f2"], ["#115e59", "#f0fdfa"],
      ["#78350f", "#fffbeb"], ["#92400e", "#fffbeb"],
    ];
    for (const [foreground, background] of lightPairs) {
      expect(contraste(foreground, background), `${foreground} sur ${background}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("limite les règles d'impression au calculateur ATB-DFG et garde un plan lisible", () => {
    expect(css).toContain("@page atb-renal-a4");
    expect(css).toContain("page: atb-renal-a4");
    expect(css).toContain("body:has(.atb-renal-page)");
    expect(css).toContain(".atb-renal-page table");
    expect(css).toContain("font-size: max(15px, 1em)");
  });
});

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function luminance(hex: string): number {
  const rgb = hex.match(/[0-9a-f]{2}/gi)?.map((v) => Number.parseInt(v, 16) / 255);
  if (!rgb || rgb.length !== 3) throw new Error(`Couleur hexadécimale invalide : ${hex}`);
  const linear = rgb.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function readCssVar(css: string, name: string, occurrence: number): string {
  const values = [...css.matchAll(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, "gi"))].map((match) => match[1]);
  const value = values[occurrence];
  if (!value) throw new Error(`Variable CSS manquante : ${name} (${occurrence})`);
  return value;
}

describe("contraste des niveaux de gravité en thème clair", () => {
  it("maintient les libellés critiques, urgents et standards à 4,5:1 ou plus", () => {
    const css = readFileSync("app/globals.css", "utf8");
    const foregrounds = [...css.matchAll(/--sev-(?:critical|urgent|standard):\s*(#[0-9a-f]{6})/gi)]
      .map((match) => match[1]).slice(0, 3);
    const backgrounds = [...css.matchAll(/--sev-(?:critical|urgent|standard)-bg:\s*(#[0-9a-f]{6})/gi)]
      .map((match) => match[1]).slice(0, 3);

    expect(foregrounds).toHaveLength(3);
    expect(backgrounds).toHaveLength(3);
    for (let index = 0; index < 3; index += 1) {
      expect(contrastRatio(foregrounds[index], backgrounds[index]), `contraste gravité ${index + 1}`)
        .toBeGreaterThanOrEqual(4.5);
    }
  });

  it("maintient les couleurs de texte informatif au seuil AA sur fonds usuels des trois thèmes", () => {
    const css = readFileSync("app/globals.css", "utf8");
    const semantic = ["blue", "red", "amber", "green", "orange", "purple", "sky"] as const;
    const lightBackgrounds = ["#f8fafc", "#ffffff", "#f1f5f9"];
    const darkBackgrounds = ["#0f172a", "#1e293b", "#0b1220", "#000000", "#0a0f16", "#05080d"];

    for (const color of semantic) {
      const variable = `--contrast-${color}-text`;
      const lightForeground = readCssVar(css, variable, 0);
      const darkForeground = readCssVar(css, variable, 1);
      const selector = color === "blue" ? ".text-blue-500" : `.text-${color}-500`;
      expect(css, `règle de contraste appliquée à ${selector}`).toContain(selector);
      for (const background of lightBackgrounds) {
        expect(contrastRatio(lightForeground, background), `${color} clair sur ${background}`).toBeGreaterThanOrEqual(4.5);
      }
      for (const background of darkBackgrounds) {
        expect(contrastRatio(darkForeground, background), `${color} sombre/AMOLED sur ${background}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("n'utilise pas du texte blanc sur des fonds orange, ambre ou cyan insuffisamment contrastés", () => {
    const css = readFileSync("app/globals.css", "utf8");
    const files = [
      "app/calculateurs/dose-anaphylaxie/page.tsx",
      "app/calculateurs/poids-pediatrique/page.tsx",
      "components/details/MedicationDetail.tsx",
      "components/details/RevalPanel.tsx",
    ];
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/bg-(?:orange-600|amber-500|sky-600)[^"`]*text-white/);
    }
    expect(css).toContain("--contrast-amber-text: #92400e");
  });
});

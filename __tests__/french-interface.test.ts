import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("interface française exclusive", () => {
  it("force FR/LTR dès le premier affichage même avec une ancienne préférence arabe", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    const storage = readFileSync("lib/storage.ts", "utf8");
    expect(layout).toContain('el.lang="fr";el.dir="ltr";');
    expect(layout).not.toContain('p.lang==="ar"');
    expect(storage).toContain('lang: "fr",');
  });

  it("ne laisse plus de commande utilisateur pour basculer l'interface en arabe", () => {
    for (const file of ["components/Header.tsx", "components/CommandPaletteBody.tsx", "app/parametres/page.tsx"]) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/setPref\(["']lang["']/);
      expect(source, file).not.toContain("languagesNice");
    }
  });

  it("sert les pages de secours et le lien d'accès rapide en français", () => {
    const offline = readFileSync("app/offline/page.tsx", "utf8");
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(offline).not.toMatch(/[\u0600-\u06ff]/);
    expect(layout).toContain("Aller au contenu");
    expect(layout).not.toContain("إلى المحتوى");
  });
});

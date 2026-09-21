// v17.0 — حراس الأداء والمعمارية + اختبارات الوحدات الجديدة.
// الهدف: أن يبقى "الفهرس الثقيل خارج المسار الحرج" حقيقةً محروسة لا نيّة طيّبة.
//
// Garde-fous d'architecture : la base médicale complète ne doit JAMAIS revenir dans
// le bundle partagé par toutes les pages (c'était la cause des 483 Ko gzip sur l'accueil).
import { describe, it, expect, beforeEach } from "vitest";
import fs from "node:fs";
import { normalize, SYNONYMS, expand } from "../lib/text";

// ─────────────────────────────────────────────────────────────────────────────
// 1. وحدة التطبيع النصي الخفيفة (lib/text.ts)
// ─────────────────────────────────────────────────────────────────────────────
describe("v17.0 — normalisation texte (unité légère)", () => {
  it("supprime les accents latins et la casse", () => {
    expect(normalize("Adrénaline")).toBe("adrenaline");
    expect(normalize("Œdème AIGU du POUMON")).toBe("oedeme aigu du poumon");
    expect(normalize("  Hypoglycémie  ")).toBe("hypoglycemie");
  });

  it("unifie les variantes arabes (alif, ta marbuta, tashkeel, tatweel)", () => {
    expect(normalize("أدرينالين")).toBe(normalize("ادرينالين"));
    expect(normalize("إِنْعاش")).toBe(normalize("انعاش"));
    expect(normalize("حُمّى")).toBe(normalize("حمى"));
    expect(normalize("جلطة")).toBe(normalize("جلطه")); // ة → ه
    expect(normalize("مـذكــرة")).toContain("مذكره"); // tatweel retiré
  });

  it("est idempotente (normaliser deux fois = normaliser une fois)", () => {
    for (const s of ["Adrénaline", "أدرينالين", "Pré-éclampsie", "Check-lists"]) {
      expect(normalize(normalize(s))).toBe(normalize(s));
    }
  });

  it("aucune entrée de synonymes n'est vide, dupliquée ou auto-référente", () => {
    for (const [cle, vals] of Object.entries(SYNONYMS)) {
      expect(cle.length, `clé « ${cle} » trop courte`).toBeGreaterThanOrEqual(2);
      expect(new Set(vals).size, `doublon dans « ${cle} »`).toBe(vals.length);
      expect(vals, `« ${cle} » se cite lui-même`).not.toContain(cle);
      for (const v of vals) expect(v.length, `${cle} → « ${v} » trop court`).toBeGreaterThanOrEqual(2);
    }
  });

  it("les synonymes sont déjà normalisés (sinon ils ne matchent jamais)", () => {
    for (const [cle, vals] of Object.entries(SYNONYMS)) {
      expect(normalize(cle), `clé non normalisée : ${cle}`).toBe(cle);
      for (const v of vals) expect(normalize(v), `valeur non normalisée : ${v}`).toBe(v);
    }
  });

  it("expand ajoute les synonymes sans perdre le jeton d'origine", () => {
    expect(expand("adrenaline")).toContain("adrenaline");
    expect(expand("adrenaline")).toContain("epinephrine");
    expect(expand("inconnu-xyz")).toEqual(["inconnu-xyz"]);
  });

  it("les synonymes métier attendus sont présents", () => {
    for (const k of ["adrenaline", "epinephrine", "rcp", "cpr", "glasgow", "avc", "preeclampsie", "iot"]) {
      expect(SYNONYMS[k], `synonyme manquant : ${k}`).toBeDefined();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. الفهرس الكسول (lib/search.ts + lib/search-data.ts)
// ─────────────────────────────────────────────────────────────────────────────
describe("v17.0 — index de recherche paresseux", () => {
  beforeEach(async () => {
    const { loadSearchIndex } = await import("../lib/search");
    await loadSearchIndex(); // état partagé entre tests : on garantit l'index chargé
  });

  it("loadSearchIndex est idempotent et getSearchIndex renvoie une liste non vide", async () => {
    const m = await import("../lib/search");
    const a = await m.loadSearchIndex();
    const b = await m.loadSearchIndex();
    expect(a).toBe(b); // même référence : un seul build d'index
    expect(m.isSearchIndexReady()).toBe(true);
    expect(m.getSearchIndex().length).toBeGreaterThan(300);
  });

  it("searchItems exige au moins 2 caractères", async () => {
    const { searchItems } = await import("../lib/search");
    expect(searchItems("a")).toEqual([]);
    expect(searchItems("")).toEqual([]);
    expect(searchItems("   ")).toEqual([]);
  });

  it("trouve par nom commercial, par DCI, par synonyme et en arabe", async () => {
    const { searchItems } = await import("../lib/search");
    expect(searchItems("aguettant", 5).map((i) => i.key)).toContain("medicament:adrenaline");
    expect(searchItems("epinephrine", 5).map((i) => i.key)).toContain("medicament:adrenaline");
    // « أدرنالين » commence par un alif-hamza : sans la correction v17.0 du normaliseur,
    // ce test échouait (la hamza survivait à NFD et bloquait la correspondance).
    expect(searchItems("أدرنالين", 5).map((i) => i.key)).toContain("medicament:adrenaline");
    expect(searchItems("rcp", 10).length).toBeGreaterThan(0);
  });

  it("les protocoles critiques remontent avec leur gravité et leur ancre", async () => {
    const { getSearchIndex } = await import("../lib/search");
    const acr = getSearchIndex().find((i) => i.key === "protocole:acr-adulte");
    expect(acr?.sev).toBe("critical");
    expect(acr?.href).toBe("/protocoles/acr-adulte#steps");
  });

  it("searchItemsAsync et resolveRefsAsync donnent le même résultat que la voie synchrone", async () => {
    const { searchItems, searchItemsAsync, resolveRef, resolveRefsAsync } = await import("../lib/search");
    expect(await searchItemsAsync("choc", 5)).toEqual(searchItems("choc", 5));
    expect(await resolveRefsAsync(["outil:resume", "inexistant"])).toEqual(
      [resolveRef("outil:resume")].filter(Boolean)
    );
    expect(resolveRef("cle:absente")).toBeNull();
  });

  it("le noyau (search-core) est pur : aucun import de données médicales", () => {
    // Seul @/data/types (import de TYPE, effacé à la compilation) est toléré.
    for (const f of ["lib/search-core.ts", "lib/text.ts"]) {
      const bad = [...fs.readFileSync(f, "utf8").matchAll(/^import\s+(?!type\b)[^;]*from\s+"@\/data\/[^"]+"/gm)];
      expect(bad.map((m) => m[0]), `${f} importe des données`).toEqual([]);
    }
    expect(fs.readFileSync("lib/search-core.ts", "utf8")).toContain('import type { Localized } from "@/data/types"');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. حراس الحزمة : la base médicale ne doit pas revenir dans le bundle partagé
// ─────────────────────────────────────────────────────────────────────────────
describe("v17.0 — garde-fous de bundle", () => {
  const read = (p: string) => fs.readFileSync(p, "utf8");

  it("lib/search.ts ne charge les données que dynamiquement", () => {
    const s = read("lib/search.ts");
    expect(s).toContain('import("./search-data")');
    // aucun import statique d'un module de données
    expect(s).not.toMatch(/^import .* from "@\/data\//m);
  });

  it("CommandPalette (montée sur toutes les pages) reste légère", () => {
    const s = read("components/CommandPalette.tsx");
    expect(s).not.toContain("@/lib/search"); // le corps lourd vit ailleurs
    expect(s).toContain('import("./CommandPaletteBody")');
    expect(s).toContain('window.addEventListener("eutn:palette"'); // v10.0 — préservé
    expect(s.length).toBeLessThan(3000);
  });

  it("ReviewAlert charge les dates de revue en dynamique, pas au montage", () => {
    const s = read("components/ReviewAlert.tsx");
    expect(s).toContain('import("@/lib/review-data")');
    expect(s).not.toMatch(/^import .*from "@\/data\/(protocols|medications|calculators)"/m);
  });

  it("les pages de listes n'importent pas l'index de recherche complet", () => {
    for (const p of ["app/medicaments/page.tsx", "app/protocoles/page.tsx"]) {
      const s = read(p);
      expect(s, `${p} importe @/lib/search`).not.toMatch(/from "@\/lib\/search"/);
      expect(s, `${p} ne normalise plus`).toContain('from "@/lib/text"');
    }
  });

  it("lib/review-data.ts et lib/search-data.ts ne sont importés que dynamiquement", () => {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = `${dir}/${e.name}`;
        if (e.isDirectory()) {
          if (!/node_modules|\.next|out|\.git/.test(p)) walk(p);
        } else if (/\.tsx?$/.test(e.name)) files.push(p);
      }
    };
    walk("app");
    walk("components");
    walk("lib");
    for (const f of files) {
      const s = read(f);
      for (const heavy of ["@/lib/search-data", "@/lib/review-data"]) {
        const staticImport = new RegExp(`^import .*from "${heavy}"`, "m");
        expect(staticImport.test(s), `${f} importe statiquement ${heavy}`).toBe(false);
      }
    }
  });

  it("guidage et reval ne sont importés statiquement que là où c'est légitime", () => {
    // Allowlist explicite :
    //  - app/guidage/page.tsx : la page EST le guidage (l'affichage, pas un détail annexe)
    //  - lib/protocol-extras.ts : le chargeur, dont le corps fait les import() dynamiques
    //  - components/details/RevalPanel.tsx : import de TYPE seulement (effacé au build)
    const ALLOW = new Set([
      "app/guidage/page.tsx",
      "components/details/RevalPanel.tsx",
      "lib/search-data.ts", // le chunk paresseux : c'est LUI qui a le droit de charger
    ]);
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = `${dir}/${e.name}`;
        if (e.isDirectory()) {
          if (!/node_modules|\.next|out|\.git/.test(p)) walk(p);
        } else if (/\.tsx?$/.test(e.name)) files.push(p);
      }
    };
    walk("app");
    walk("components");
    walk("lib");
    const bad: string[] = [];
    for (const f of files) {
      if (ALLOW.has(f)) continue;
      // Les Route Handlers (app/**/route.ts) s'exécutent au BUILD uniquement :
      // leur code n'est jamais envoyé au navigateur (export statique).
      if (/\/route\.ts$/.test(f)) continue;
      const s = read(f);
      for (const mod of ["@/data/guidage", "@/data/reval"]) {
        // import de type = gratuit ; import de valeur = embarque les 320 Ko
        const runtime = new RegExp(`^import\\s+(?!type\\b)[^;]*from\\s+"${mod}"`, "m");
        if (runtime.test(s)) bad.push(`${f} ← ${mod}`);
      }
    }
    expect(bad, `import statique de données lourdes :\n  ${bad.join("\n  ")}`).toEqual([]);
  });

  it("ProtocolDetail ne charge plus guidage ni reval au premier rendu", () => {
    const s = read("components/details/ProtocolDetail.tsx");
    expect(s).toContain("@/lib/protocol-extras");
    // import statique des données lourdes = régression de performance
    expect(s).not.toMatch(/^import \{[^}]*\} from "@\/data\/(guidage|reval)"/m);
    // v17.4 — même les imports de TYPE ont disparu de la fiche : c'est `protocol-extras`
    // qui porte les types (les fonctions de guidage ne sont plus nécessaires côté client).
    expect(s).not.toContain('from "@/data/guidage"');
    expect(s).not.toContain('from "@/data/reval"');
    expect(s).toContain("@/lib/protocol-extras");
  });

  it("la boucle de réévaluation est un fichier statique, pas une base JS", () => {
    // Le chargeur ne fait plus que des fetch : aucun import de valeur des deux bases.
    const extras = read("lib/protocol-extras.ts");
    expect(extras).toContain("/reval/");
    expect(extras).toMatch(/^import type \{ Reval \} from "@\/data\/reval"/m);

    // La route produit un fichier par protocole, servie en force-static.
    const route = read("app/reval/[id]/route.ts");
    expect(route).toContain('dynamic = "force-static"');
    expect(route).toContain("generateStaticParams");
    expect(route).toContain("getReval");

    // Hors-ligne : sans ces deux points, la réévaluation disparaîtrait en mode avion.
    expect(read("public/sw.js")).toContain("`${BASE}/reval/`");
    expect(read("scripts/gen-precache.mjs")).toContain('out/reval');
  });

  it("les pages de liste ne rechargent pas les bases de protocoles", () => {
    // /protocoles et /quiz-ia s'appuient sur le fichier de références (v17.3).
    for (const f of ["app/protocoles/page.tsx", "app/quiz-ia/page.tsx"]) {
      const src = read(f);
      expect(src, f).not.toMatch(/^import \{[^}]*\} from "@\/data\/protocols"/m);
      expect(src, f).toContain("@/lib/ref-index");
    }
    // La carte de liste ne consomme qu'un résumé.
    const card = read("components/cards/ProtocolCard.tsx");
    expect(card).toContain("ProtocolCardData");
    expect(card).toContain("stepsCount");
  });

  it("data/counts.ts reste synchronisé avec les bases réelles", async () => {
    const { COUNTS } = await import("../data/counts");
    const [p, m, c, ck, pr, ecg, tr, g, q] = await Promise.all([
      import("../data/protocols"),
      import("../data/medications"),
      import("../data/calculators"),
      import("../data/checklists"),
      import("../data/procedures"),
      import("../data/ecg"),
      import("../data/trees"),
      import("../data/guidage"),
      import("../data/quiz"),
    ]);
    // Toute addition de contenu doit être répercutée dans data/counts.ts :
    expect(COUNTS.protocols).toBe(p.protocols.length);
    expect(COUNTS.medications).toBe(m.medications.length);
    expect(COUNTS.calculators).toBe(c.calculators.length);
    expect(COUNTS.checklists).toBe(ck.CHECKLISTS.length);
    expect(COUNTS.procedures).toBe(pr.procedures.length);
    expect(COUNTS.ecg).toBe(ecg.ecgRhythms.length);
    expect(COUNTS.trees).toBe(tr.decisionTrees.length);
    expect(COUNTS.guidage).toBe(g.GCASES.length);
    expect(COUNTS.quiz).toBe(q.QUIZ.length);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Barre d'onglets : lisibilité garantie sur écran étroit
// ─────────────────────────────────────────────────────────────────────────────
describe("v17.0 — barre d'onglets inférieure", () => {
  it("les libellés d'onglets tiennent dans une colonne de 53 px (320 px de large)", async () => {
    const { dictionaries } = await import("../lib/i18n");
    // 6 onglets, largeur minimale visée 320 px → 53 px par colonne ;
    // à 10 px en Inter Bold, ~5,3 px par caractère ⇒ 9 caractères maximum.
    for (const lang of ["fr", "ar"] as const) {
      for (const k of ["tab.home", "tab.rea", "tab.meds", "tab.protocols", "tab.memo", "tab.checklists"]) {
        const label = dictionaries[lang][k];
        expect(label, `${lang}/${k} manquant`).toBeTruthy();
        // Heuristique : 10 caractères à 9 px de police ≈ 53 px (colonne d'un écran de
        // 320 px). Le contrôle au pixel près est fait par scripts/audit-clips.mjs.
        expect(label.length, `${lang}/${k} = « ${label} » (${label.length} car.) trop long pour un onglet`)
          .toBeLessThanOrEqual(10);
      }
    }
  });

  it("la barre réduit la police sous 380 px et neutralise tout débordement", () => {
    const s = fs.readFileSync("components/BottomTabs.tsx", "utf8");
    expect(s).toContain("max-[380px]:text-[9px]");
    expect(s).toContain("truncate");
    expect(s).toContain("min-w-0");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Retrait d'une complication depuis le patient actif (removeProblem était mort)
// ─────────────────────────────────────────────────────────────────────────────
describe("v17.0 — retrait d'une complication depuis le patient actif", () => {
  it("ActivePatient appelle bien removeProblem (fonction auparavant importée sans usage)", () => {
    const s = fs.readFileSync("components/ActivePatient.tsx", "utf8");
    expect(s).toMatch(/setProblems\(removeProblem\(/);
    expect(s).toContain("aria-label=");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. الفهرس المرجعي الثابت (v17.1) — favoris et récents sans l'index complet
// ─────────────────────────────────────────────────────────────────────────────
describe("v17.1 — /ref-index.json (fichier de références statique)", () => {
  const read = (p: string) => fs.readFileSync(p, "utf8");

  it("la route est statique (export `force-static`) et couvre TOUTES les entités", async () => {
    const s = read("app/ref-index.json/route.ts");
    expect(s).toContain('export const dynamic = "force-static"');
    const [p, m, c, pr, ecg, tr, g] = await Promise.all([
      import("../data/protocols"),
      import("../data/medications"),
      import("../data/calculators"),
      import("../data/procedures"),
      import("../data/ecg"),
      import("../data/trees"),
      import("../data/guidage"),
    ]);
    // Chaque source de données doit être citée par la route, sinon des favoris
    // deviendraient irrésolubles après la bascule depuis l'index complet.
    for (const [mod, name] of [
      ["protocols", p.protocols.length],
      ["medications", m.medications.length],
      ["calculators", c.calculators.length],
      ["procedures", pr.procedures.length],
      ["ecgRhythms", ecg.ecgRhythms.length],
      ["decisionTrees", tr.decisionTrees.length],
      ["GCASES", g.GCASES.length],
    ] as const) {
      expect(s, `${mod} absent de ref-index.json/route.ts`).toContain(mod);
      expect(name).toBeGreaterThan(0);
    }
  });

  it("les clés produites correspondent à celles de l'index de recherche", async () => {
    // Les favoris stockent « type:id » ; le fichier de références DOIT utiliser
    // exactement la même convention, sinon résolution silencieusement vide.
    const route = read("app/ref-index.json/route.ts");
    for (const prefix of ["protocole:", "medicament:", "calculateur:", "procedure:", "ecg:", "arbre:", "guidage:"]) {
      expect(route, `préfixe ${prefix} absent`).toContain(`\`${prefix}$`);
    }
    const { getSearchIndex, loadSearchIndex } = await import("../lib/search");
    await loadSearchIndex();
    const idx = getSearchIndex();
    expect(idx.length).toBeGreaterThan(300);
  });

  it("la page d'accueil utilise le fichier de références, plus l'index complet", () => {
    const s = read("app/page.tsx");
    expect(s).toContain("@/lib/ref-index");
    expect(s).not.toContain("loadSearchIndex");
    expect(s).not.toContain("from \"@/lib/search\"");
  });

  it("ref-index.json est précaché ET servi hors-ligne par le service worker", () => {
    expect(read("scripts/gen-precache.mjs")).toContain('"/ref-index.json"');
    // Sans cette branche, la requête ne serait pas interceptée → favoris vides en avion.
    expect(read("public/sw.js")).toContain("=== `${BASE}/ref-index.json`");
  });

  it("le lecteur est robuste : réessai après échec, résolution synchrone sûre", () => {
    const s = read("lib/ref-index.ts");
    expect(s).toContain("LOADING = null"); // réessai possible
    expect(s).toContain("export function getRef");
    expect(s).toMatch(/MAP\?\.get|MAP!\.get/);
  });
});

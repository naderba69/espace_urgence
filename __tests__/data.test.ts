// v2.9 — garde-fous zod : chaque jeu de données clinique doit parser.
import { describe, it, expect } from "vitest";
import { monthsSince } from "../lib/calc";
import { PERFUSIONS } from "../data/perfusions";
import { calculators } from "../data/calculators";
import { protocols } from "../data/protocols";
import { PerfusionSchema, CalculatorMetaSchema, QuizItemSchema, ProtocolSchema, MedicationSchema, ProcedureSchema } from "../lib/validate";
import { procedures } from "../data/procedures";
import { medications } from "../data/medications";
import { GCASES } from "../data/guidage";

describe("zod — données cliniques", () => {
  it("PERFUSIONS conformes", () => {
    for (const p of PERFUSIONS) {
      const r = PerfusionSchema.safeParse(p);
      expect(r.success, `${p.drugId}: ${r.success ? "" : JSON.stringify(r.error.issues[0])}`).toBe(true);
    }
  });
  it("calculators conformes", () => {
    for (const c of calculators) {
      const r = CalculatorMetaSchema.safeParse(c);
      expect(r.success, `${c.id}: ${r.success ? "" : JSON.stringify(r.error.issues[0])}`).toBe(true);
    }
  });
  it("quiz conforme (4 options, bonne réponse dans la liste)", () => {
    for (const q of QUIZ) {
      const r = QuizItemSchema.safeParse(q);
      expect(r.success, q.q.fr).toBe(true);
    }
  });
  it("protocoles conformes (étapes + méta revue)", () => {
    for (const p of protocols) {
      const r = ProtocolSchema.safeParse(p);
      expect(r.success, p.id).toBe(true);
    }
  });
  it("médicaments conformes (nom bilingue + méta revue)", () => {
    const all = medications;
    for (const m of all) {
      const r = MedicationSchema.safeParse(m);
      expect(r.success, m.id).toBe(true);
    }
  });
});

  it("procédures conformes (matériel + étapes + surveillance)", () => {
    for (const p of procedures) {
      const r = ProcedureSchema.safeParse(p);
      expect(r.success, p.id).toBe(true);
    }
  });

// Limite de fraîcheur éditoriale : au-delà, une fiche doit être relue par un médecin
// (les référentiels bougent : ERC 2021 → ERC 2025, AHA 2020 → 2025…).
//
// في حال فشل هذا الحارس: المطلوب مراجعة طبية فعلية للمحتوى ثم تحديث `lastReviewed`
// وذكرها في CHANGELOG.md — لا تكفي إعادة التاريخ وحدها.
const FRESHNESS_LIMIT_MONTHS = 12;

describe("fraîcheur éditoriale", () => {
  it("aucun contenu de plus de 12 mois", () => {
    const now = new Date();
    const yms = [
      ...protocols.map((p) => p.meta.lastReviewed),
      ...medications.map((m) => m.meta.lastReviewed),
      ...calculators.map((c) => c.meta?.lastReviewed ?? "1970-01"),
    ];
    for (const ym of yms) expect(monthsSince(ym, now), ym).toBeLessThan(FRESHNESS_LIMIT_MONTHS);
  });

  it("chaque date de revue est au format AAAA-MM", () => {
    // Les pages /revision et /revisions comparent ces chaînes : un format libre
    // (ex. « septembre 2026 ») fausserait silencieusement le tri et l'alerte.
    const bad: string[] = [];
    for (const [kind, yms] of [
      ["protocole", protocols.map((p) => p.meta.lastReviewed)],
      ["medicament", medications.map((m) => m.meta.lastReviewed)],
      ["calculateur", calculators.map((c) => c.meta?.lastReviewed)],
    ] as const) {
      for (const ym of yms) {
        if (ym === undefined) continue; // calculateurs : méta optionnelle
        if (!/^\d{4}-\d{2}$/.test(ym)) bad.push(`${kind}: ${ym}`);
      }
    }
    expect(bad, `dates non normalisées : ${bad.join(", ")}`).toEqual([]);
  });
});

describe("v17.3 — cohérence du fichier de références", () => {
  // Les pages /protocoles, /revision, /triage… n'affichent plus les données : elles lisent
  // `ref-index.json`. Une dérive entre la projection et la source passerait donc inaperçue
  // à l'écran — d'où cette comparaison champ par champ, faite sur la vraie route.
  it("la projection reproduit fidèlement les données sources", async () => {
    const { GET } = await import("../app/ref-index.json/route");
    const rows = (await GET().json()) as {
      k: string; h: string; t: string; n: [string, string];
      r?: string; c?: string; s?: string; e?: number; g?: [string, string, string];
    }[];
    const byKey = new Map(rows.map((r) => [r.k, r]));
    expect(rows.length).toBeGreaterThan(350);

    for (const p of protocols) {
      const r = byKey.get(`protocole:${p.id}`);
      expect(r, `protocole manquant : ${p.id}`).toBeTruthy();
      expect(r!.n, p.id).toEqual([p.title.fr, p.title.ar]);
      expect(r!.r, p.id).toBe(p.meta.lastReviewed);
      expect(r!.c, p.id).toBe(p.category);
      expect(r!.s, p.id).toBe(p.severity);
      expect(r!.e, p.id).toBe(p.steps.length);
      expect(r!.h, p.id).toBe(`/protocoles/${p.id}#steps`);
      // v17.4 — situation de guidage : mêmes règles de rapprochement que la fiche
      const c = GCASES.find((x) => x.id === p.id || x.href === `/protocoles/${p.id}`);
      expect(r!.g, p.id).toEqual(c ? [c.id, c.fr, c.ar] : undefined);
    }
    for (const m of medications) {
      const r = byKey.get(`medicament:${m.id}`);
      expect(r, `médicament manquant : ${m.id}`).toBeTruthy();
      expect(r!.n, m.id).toEqual([m.name.fr, m.name.ar]);
      expect(r!.r, m.id).toBe(m.meta.lastReviewed);
    }
    for (const c of calculators) {
      const r = byKey.get(`calculateur:${c.id}`);
      expect(r, `calculateur manquant : ${c.id}`).toBeTruthy();
      expect(r!.h, c.id).toBe(c.href);
      expect(r!.r, c.id).toBe(c.meta?.lastReviewed);
    }
  });
});

describe("v17.4 — boucle de réévaluation servie par fichier", () => {
  // La fiche ne reçoit plus `data/reval.ts` (232 Ko) mais un fichier de ~1,7 Ko gzip.
  // Ce test vérifie que la route rend exactement l'objet attendu, pour chaque protocole,
  // et qu'un identifiant inconnu renvoie 404 (le client n'affiche alors aucun panneau).
  it("un fichier par protocole, contenu identique à getReval", async () => {
    const { GET, generateStaticParams } = await import("../app/reval/[id]/route");
    const { getReval } = await import("../data/reval");

    const ids = generateStaticParams().map((p) => p.id);
    expect(ids.length).toBe(protocols.length);

    for (const id of ids) {
      const res = await GET(new Request(`http://localhost/reval/${id}`), { params: Promise.resolve({ id }) });
      expect(res.status, id).toBe(200);
      expect(await res.json(), id).toEqual(getReval(id));
    }

    const missing = await GET(new Request("http://localhost/reval/inexistant"), { params: Promise.resolve({ id: "inexistant" }) });
    expect(missing.status).toBe(404);
  });
});

import { QUIZ } from "../data/quiz";
describe("quiz v7.0", () => {
  it("كل سؤال ثنائي اللغة وخياره الصحيح ضمن الخيارات", () => {
    expect(QUIZ.length).toBeGreaterThanOrEqual(22);
    for (const q of QUIZ) {
      expect(q.q.fr.length).toBeGreaterThan(3);
      expect(q.q.ar.length).toBeGreaterThan(3);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correct).toBeLessThan(q.options.length);
      expect(q.why.ar.length).toBeGreaterThan(3);
    }
  });
});

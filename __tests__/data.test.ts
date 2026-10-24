// v2.9 — garde-fous zod : chaque jeu de données clinique doit parser.
import { describe, it, expect } from "vitest";
import { monthsSince } from "../lib/calc";
import { PERFUSIONS } from "../data/perfusions";
import { calculators } from "../data/calculators";
import { protocols } from "../data/protocols";
import { PerfusionSchema, CalculatorMetaSchema, QuizItemSchema, ProtocolSchema, MedicationSchema, ProcedureSchema, LocalizedSchema } from "../lib/validate";
import { procedures } from "../data/procedures";
import { medications } from "../data/medications";
import { GCASES } from "../data/guidage";
import { protocolCategories } from "../data/protocol-categories";
import { decisionTrees } from "../data/trees";
import { MED_TOOLS } from "../data/med-tools";
import { TRIAGE_CASES, TRIAGE_SYSTEMS, PRIORITY_META } from "../data/triage";
import { CHECKLISTS } from "../data/checklists";
import { ecgRhythms } from "../data/ecg";
import { QUIZ } from "../data/quiz";
import { ABBREVIATIONS } from "../data/abbr";
import { MOTIFS } from "../data/motifs";
import { vitalSigns, emergencyNumbers } from "../data/quickref";
import { revals } from "../data/reval";
import { ATB_RENAL_ROWS, ATB_RENAL_SECTIONS, ATB_RENAL_STAGES } from "../data/atb-renal";
import { gcsAdult, gcsPediatric } from "../data/calculators";

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
  it("céfotaxime : posologies RCP Panpharma tracées, sans volume de dilution non sourcé", () => {
    const cefotaxime = medications.find((m) => m.id === "cefotaxime")!;
    expect(cefotaxime.meta.sources.join(" ")).toMatch(/ANSM.*Panpharma 1 g.*12\/04\/2024/);
    expect(cefotaxime.doseAdult.fr).toMatch(/3 g\/j en moyenne.*12 g\/j/);
    expect(cefotaxime.doseAdult.ar).toMatch(/3 غ\/يوم.*12 غ\/يوم/);
    expect(cefotaxime.dosePediatric.fr).toMatch(/50 mg\/kg\/j.*200 mg\/kg\/j/);
    expect(cefotaxime.dilution.fr).toMatch(/20–60 min/);
    expect(cefotaxime.dilution.fr).toMatch(/volume\/diluant.*n'est pas précisé/);
    expect(cefotaxime.dilution.fr).not.toMatch(/10 ?mL/);
    expect(cefotaxime.nursing.fr).toMatch(/SSC 2026.*adulte.*1 h.*3 h/);
    expect(cefotaxime.meta.sources.join(" ")).toMatch(/délai d'antibiothérapie adulte uniquement/);
  });
});

  it("procédures conformes (matériel + étapes + surveillance)", () => {
    for (const p of procedures) {
      const r = ProcedureSchema.safeParse(p);
      expect(r.success, p.id).toBe(true);
    }
  });

describe("cohérence FR/AR — couverture complète des données déclaratives", () => {
  it("les 21 jeux sont parcourus ; chaque objet localisé a deux textes non vides", () => {
    const datasets: Record<string, unknown> = {
      protocols, medications, calculators, procedures, trees: decisionTrees, guidage: GCASES,
      triage: [TRIAGE_CASES, TRIAGE_SYSTEMS, PRIORITY_META], checklists: CHECKLISTS,
      ecg: ecgRhythms, quiz: QUIZ, perfusions: PERFUSIONS, abbreviations: ABBREVIATIONS,
      motifs: MOTIFS, vitals: vitalSigns, emergencyNumbers, revaluation: revals,
      antibioticRenal: [ATB_RENAL_STAGES, ATB_RENAL_SECTIONS, ATB_RENAL_ROWS],
      medTools: MED_TOOLS, protocolCategories, gcsAdult, gcsPediatric,
    };
    const invalid: string[] = [];
    let localizedOccurrences = 0;
    function visit(value: unknown, path: string): void {
      if (!value || typeof value !== "object") return;
      if (Array.isArray(value)) {
        value.forEach((item, index) => visit(item, `${path}[${index}]`));
        return;
      }
      const record = value as Record<string, unknown>;
      if ("fr" in record || "ar" in record) {
        localizedOccurrences++;
        const parsed = LocalizedSchema.safeParse(record);
        if (!parsed.success || !String(record.fr ?? "").trim() || !String(record.ar ?? "").trim()) {
          invalid.push(path);
        }
      }
      for (const [key, child] of Object.entries(record)) visit(child, `${path}.${key}`);
    }
    for (const [dataset, value] of Object.entries(datasets)) visit(value, dataset);

    expect(Object.keys(datasets)).toHaveLength(21);
    expect(localizedOccurrences).toBeGreaterThan(6500);
    expect(invalid, `objets localisés absents/vides : ${invalid.join(", ")}`).toEqual([]);
  });
});

describe("unicité des identifiants de données", () => {
  it("aucun ID n'est réutilisé dans les registres qui alimentent les références croisées", () => {
    const idGroups: [string, { id: string }[]][] = [
      ["protocoles", protocols], ["médicaments", medications], ["calculateurs", calculators],
      ["procédures", procedures], ["arbres", decisionTrees], ["guidage", GCASES],
      ["triage", TRIAGE_CASES], ["checklists", CHECKLISTS], ["ECG", ecgRhythms],
      ["catégories", protocolCategories], ["antibiotiques", ATB_RENAL_ROWS],
      ["classes antibiotiques", ATB_RENAL_SECTIONS], ["stades antibiotiques", ATB_RENAL_STAGES],
    ];
    for (const [name, entries] of idGroups) {
      const ids = entries.map((entry) => entry.id);
      expect(new Set(ids).size, `${name}: IDs dupliqués`).toBe(ids.length);
    }
    expect(new Set(ABBREVIATIONS.map((entry) => entry.abbr)).size, "abréviation dupliquée").toBe(ABBREVIATIONS.length);
    expect(new Set(MOTIFS.map((entry) => entry.id)).size, "motif dupliqué").toBe(MOTIFS.length);
  });
});

describe("intégrité des références croisées", () => {
  it("protocoles, médicaments, perfusions et outils ne pointent que vers des IDs existants", () => {
    const medIds = new Set(medications.map((m) => m.id));
    const calculatorIds = new Set(calculators.map((c) => c.id));
    const protocolIds = new Set(protocols.map((p) => p.id));
    const categoryIds = new Set(protocolCategories.map((c) => c.id));

    for (const p of protocols) {
      expect(categoryIds.has(p.category), `${p.id}: catégorie ${p.category}`).toBe(true);
      for (const id of p.medications) expect(medIds.has(id), `${p.id}: médicament ${id}`).toBe(true);
      for (const id of p.calculators) expect(calculatorIds.has(id), `${p.id}: calculateur ${id}`).toBe(true);
    }
    for (const m of medications) {
      for (const id of m.alternatives) expect(medIds.has(id), `${m.id}: alternative ${id}`).toBe(true);
    }
    for (const p of PERFUSIONS) {
      expect(medIds.has(p.drugId), `perfusion: médicament ${p.drugId}`).toBe(true);
      expect(p.source?.trim(), `perfusion ${p.drugId}: source manquante`).toBeTruthy();
    }
    for (const triage of TRIAGE_CASES) {
      expect(triage.source.trim(), `triage ${triage.id}: source manquante`).toBeTruthy();
      for (const id of triage.protocolIds) expect(protocolIds.has(id), `${triage.id}: protocole ${id}`).toBe(true);
    }
    for (const tree of decisionTrees) {
      expect(tree.sources.length, `${tree.id}: source manquante`).toBeGreaterThan(0);
      for (const source of tree.sources) expect(source.url, `${tree.id}: URL source vide`).toMatch(/^https:\/\//);
    }
    for (const [medId, tool] of Object.entries(MED_TOOLS)) {
      expect(medIds.has(medId), `outil: médicament ${medId}`).toBe(true);
      for (const id of tool.protocols ?? []) expect(protocolIds.has(id), `${medId}: protocole ${id}`).toBe(true);
    }
  });

  it("chaque nœud d'arbre et chaque branche aboutit à une clé existante", () => {
    for (const tree of decisionTrees) {
      const keys = new Set(Object.keys(tree.nodes));
      expect(keys.has(tree.start), `${tree.id}: départ ${tree.start}`).toBe(true);
      for (const [key, node] of Object.entries(tree.nodes)) {
        expect(node.id, `${tree.id}: ID différent de la clé ${key}`).toBe(key);
        if (node.kind === "decision") {
          expect(keys.has(node.yes), `${tree.id}/${key}: oui → ${node.yes}`).toBe(true);
          expect(keys.has(node.no), `${tree.id}/${key}: non → ${node.no}`).toBe(true);
        }
        if (node.kind === "action") expect(keys.has(node.next), `${tree.id}/${key}: suite → ${node.next}`).toBe(true);
      }

      const reachable = new Set<string>();
      const pending = [tree.start];
      while (pending.length) {
        const key = pending.pop()!;
        if (reachable.has(key)) continue;
        reachable.add(key);
        const node = tree.nodes[key];
        if (node.kind === "decision") pending.push(node.yes, node.no);
        if (node.kind === "action") pending.push(node.next);
      }
      expect([...reachable].sort(), `${tree.id}: nœuds inatteignables`).toEqual([...keys].sort());

      const predecessors = new Map<string, string[]>();
      for (const [key, node] of Object.entries(tree.nodes)) {
        const next = node.kind === "decision" ? [node.yes, node.no] : node.kind === "action" ? [node.next] : [];
        for (const target of next) predecessors.set(target, [...(predecessors.get(target) ?? []), key]);
      }
      const canReachEnd = new Set(Object.entries(tree.nodes).filter(([, node]) => node.kind === "end").map(([key]) => key));
      const reversePending = [...canReachEnd];
      while (reversePending.length) {
        for (const previous of predecessors.get(reversePending.pop()!) ?? []) {
          if (!canReachEnd.has(previous)) {
            canReachEnd.add(previous);
            reversePending.push(previous);
          }
        }
      }
      expect([...canReachEnd].sort(), `${tree.id}: nœuds sans chemin vers une fin`).toEqual([...keys].sort());
    }
  });
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
      ...procedures.map((p) => p.meta.lastReviewed),
      ...CHECKLISTS.map((c) => c.lastReviewed),
      ...ecgRhythms.map((e) => e.meta.lastReviewed),
      ...decisionTrees.map((t) => t.lastReviewed), // ISO date : monthsSince lit année/mois
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
      ["procédure", procedures.map((p) => p.meta.lastReviewed)],
      ["checklist", CHECKLISTS.map((c) => c.lastReviewed)],
      ["ECG", ecgRhythms.map((e) => e.meta.lastReviewed)],
    ] as const) {
      for (const ym of yms) {
        if (ym === undefined) continue; // calculateurs : méta optionnelle
        if (!/^\d{4}-\d{2}$/.test(ym)) bad.push(`${kind}: ${ym}`);
      }
    }
    for (const tree of decisionTrees) {
      const date = tree.lastReviewed;
      const validIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T00:00:00Z`));
      if (!validIsoDate) bad.push(`arbre ${tree.id}: ${date}`);
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

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
  it("hypoglycémie adulte : dose de glucose exprimée en grammes, concentration PROAMP sourcée, sans confusion ampoule/10 g", () => {
    const glucose = medications.find((m) => m.id === "glucose30")!;
    const hypo = protocols.find((p) => p.id === "hypoglycemie")!;
    expect(glucose.doseAdult.fr).toContain("10–15 g");
    expect(glucose.doseAdult.fr).toContain("33–50 mL");
    expect(glucose.doseAdult.fr).toContain("3 g");
    expect(glucose.doseAdult.fr).toContain("4–5 ampoules");
    expect(glucose.doseAdult.fr).not.toMatch(/1–2 ampoules.*40–80 mL/);
    expect(glucose.dilution.fr).toContain("PROAMP uniquement");
    expect(glucose.nursing.fr).toContain("rinçage immédiat");
    expect(glucose.meta.sources.join(" ")).toContain("RCP GLUCOSE 30 % PROAMP");
    const adultStep = hypo.steps.find((s) => s.title.fr.includes("Adulte inconscient"))?.title.fr ?? "";
    expect(adultStep).toContain("10–15 g");
    expect(adultStep).toContain("3 g/ampoule");
    expect(adultStep).not.toContain("1 ampoule (10 g)");
    expect(hypo.meta.sources.join(" ")).toContain("RCP GLUCOSE 30 % PROAMP");
  });
  it("NaCl hypertonique : recette théorique de 3 % calculée, ancienne recette à 4,08 % signalée", () => {
    const nacl = medications.find((m) => m.id === "nacl-hypertonique")!;
    expect(nacl.dilution.fr).toContain("11 mL de NaCl 20 % (2,2 g) + 89 mL de NaCl 0,9 % (0,801 g)");
    expect(nacl.dilution.fr).toContain("3,001 g/100 mL ≈ 3 %");
    expect(nacl.dilution.fr).toContain("donne 4,08 %");
    expect(nacl.dilution.fr).toContain("ne pas préparer au lit du patient");
    expect(nacl.nursing.fr).toContain("Na⁺ toutes les 2-4 h");
  });
  it("sufentanil pédiatrique : conserve uniquement le schéma IV confirmé par le RCP SUFENTA", () => {
    const sufentanil = medications.find((m) => m.id === "sufentanil")!;
    expect(sufentanil.dosePediatric.fr).toContain("plus d'un mois");
    expect(sufentanil.dosePediatric.fr).toContain("0,2–0,5 µg/kg");
    expect(sufentanil.dosePediatric.fr).toContain("≥30 s");
    expect(sufentanil.dosePediatric.fr).toContain("Aucune posologie IV n'est recommandée dans ce RCP chez le nouveau-né");
    expect(sufentanil.dosePediatric.fr).not.toContain("0,005-0,01 µg/kg");
    expect(sufentanil.meta.sources.join(" ")).toContain("RCP SUFENTA 50 µg/10 mL");
  });
  it("propofol : distingue les limites de conservation du Diprivan et les restrictions pédiatriques par indication", () => {
    const propofol = medications.find((m) => m.id === "propofol")!;
    expect(propofol.storage.fr).toContain("DIPRIVAN 10 mg/mL uniquement");
    expect(propofol.storage.fr).toContain("non diluée au plus 12 h");
    expect(propofol.storage.fr).toContain("après dilution");
    expect(propofol.storage.fr).toContain("dans les 6 h");
    expect(propofol.storage.fr).toContain("ne pas conserver les reliquats");
    expect(propofol.dosePediatric.fr).toContain("plus d'un mois");
    expect(propofol.dosePediatric.fr).toContain("contre-indiquée avant 16 ans");
    expect(propofol.dosePediatric.fr).toContain("ne vaut pas autorisation pour les autres présentations");
    expect(propofol.meta.sources.join(" ")).toContain("RCP DIPRIVAN 10 mg/mL");
  });
  it("naloxone : dose pédiatrique aiguë distincte et voie nasale liée à son dispositif", () => {
    const card = medications.find((med) => med.id === "naloxone")!;
    expect(card.doseAdult.fr).toContain("0,2–2 mg IV/IO/IM");
    expect(card.doseAdult.fr).not.toContain("0,4 mg IV/IM/IN");
    expect(card.doseAdult.fr).toContain("ne pas convertir la solution injectable en dose IN");
    expect(card.dosePediatric?.fr).toContain("0,1 mg/kg IV/IO/IM, maximum 2 mg");
    expect(card.weightDose).toMatchObject({ mgPerKg: 0.1, maxMg: 2 });
    expect(card.dilution.fr).toContain("Aucun dispositif intranasal tunisien n'est documenté ici");
    expect(card.meta.sources.join(" ")).toContain("AHA 2023 Focused Update");
  });
  it("labétalol : les bolus IV sont fixes et la perfusion est exprimée en mg/min", () => {
    const card = medications.find((med) => med.id === "labetalol")!;
    const preset = PERFUSIONS.find((entry) => entry.drugId === "labetalol")!;
    expect(card.doseAdult.fr).toContain("10–20 mg IV lente sur 2 min");
    expect(card.doseAdult.fr).toContain("300 mg");
    expect(card.doseAdult.fr).not.toContain("mg/kg");
    expect(card.weightDose).toBeUndefined();
    expect(preset.unit).toBe("mg/min");
    expect(preset.doseMin).toBe(0.5);
    expect(preset.doseMax).toBe(2);
    expect(preset.bolus?.fr).toContain("10–20 mg IV lente sur 2 min");
    expect(preset.bolus?.fr).not.toContain("mg/kg");
    expect(preset.source).toContain("ACOG Practice Bulletin No. 222");
  });
  it("noradrénaline : préparation de référence synchronisée entre fiche, abaques et pompe", () => {
    const card = medications.find((med) => med.id === "noradrenaline")!;
    const presets = PERFUSIONS.filter((entry) => entry.drugId === "noradrenaline");
    const pump = MED_TOOLS.noradrenaline.pump!;
    const pumpBaseMg = pump.defAmpMg * pump.defCount;
    expect(card.dilution.fr).toContain("8 mg de noradrénaline exprimés en base, complétés à 50 mL");
    expect(presets).toHaveLength(2);
    for (const preset of presets) {
      expect(preset.concUgPerMl).toBe(160);
      expect(preset.prep.fr).toContain("160 µg/mL");
    }
    expect(pumpBaseMg / pump.defTarget * 1000).toBe(160);
    expect(card.dilution.fr).toContain("ne jamais déduire cette équivalence");
  });
  it("centre antipoison : un seul numéro candidat et avertissement de vérification locale", () => {
    const selectedProtocols = ["intoxication-medicamenteuse", "intoxication-phosphure-aluminium", "intoxication-digoxine"]
      .map((id) => protocols.find((p) => p.id === id));
    const scope = JSON.stringify({ emergencyNumbers, selectedProtocols, revals });
    expect(scope).toContain("71 335 500");
    expect(scope).not.toMatch(/80 102 550|71 335 335|71335335|80102550/);
    expect(scope).toContain("à confirmer localement");
    expect(emergencyNumbers.find((entry) => entry.service.fr.includes("antipoison"))?.note?.fr).toContain("confirmer localement");
  });
  it("hémorragie digestive haute : pas de furosémide ni de TXA routinier, octréotide limité aux varices suspectées", () => {
    const protocol = protocols.find((p) => p.id === "hemorragie-digestive-haute")!;
    expect(protocol.medications).not.toContain("furosemide");
    expect(protocol.medications).not.toContain("acide-tranexamique");
    expect(protocol.medications).toContain("octreotide");
    expect(protocol.steps.some((s) => s.title.fr.includes("Si cirrhose/suspicion varices") && s.title.fr.includes("octreotide"))).toBe(true);
    expect(protocol.meta.sources.join(" ")).toContain("ESGE Guideline Update 2021");
  });
  it("éclampsie : la stabilisation maternelle précède la décision obstétricale de naissance", () => {
    const eclampsia = protocols.find((p) => p.id === "hypertension-gravidique")!;
    const principle = eclampsia.keyPoints.find((p) => p.fr.includes("stabilisation maternelle est prioritaire"))?.fr ?? "";
    const delivery = eclampsia.steps.find((s) => s.title.fr.includes("Après la crise"))?.title.fr ?? "";
    expect(principle).toContain("protège aussi le fœtus");
    expect(principle).not.toContain("la vitalité fœtale prime");
    expect(delivery).toContain("stabiliser d'abord la mère");
    expect(delivery).toContain("l'éclampsie seule n'impose pas une césarienne");
    expect(eclampsia.meta.sources.join(" ")).toContain("ACOG Practice Bulletin No. 222");
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

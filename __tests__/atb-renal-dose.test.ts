// Vérifie la sélection d'une cellule source sans calculer une posologie clinique.
import { describe, expect, it } from "vitest";
import {
  cellulePourDFG,
  intervallePourSegmentDFG,
  validerRegimeAtb,
  validerSegmentsDFG,
  type AtbSegment,
  type ContenuCelluleAtb,
  type RegimeAtb,
} from "@/lib/atb-renal-dose";

const contenu = (type: ContenuCelluleAtb["type"], fr: string): ContenuCelluleAtb => ({
  type,
  fr,
  ar: `AR ${fr}`,
});

const reference: AtbSegment = {
  seuil: null,
  egaliteAuSeuil: null,
  contenu: contenu("dose-source", "référence"),
};
const sous50: AtbSegment = {
  seuil: 50,
  egaliteAuSeuil: "segment-superieur",
  contenu: contenu("dose-source", "segment sous 50"),
};
const sous30: AtbSegment = {
  seuil: 30,
  egaliteAuSeuil: "segment-superieur",
  contenu: contenu("dose-source", "segment sous 30"),
};
const sous10: AtbSegment = {
  seuil: 10,
  egaliteAuSeuil: "ce-segment",
  contenu: contenu("dose-source", "segment sous ou égal à 10"),
};

const source = {
  document: "fixture de test, pas une référence médicale",
  version: "test",
  page: 1,
  ligneSource: "fixture",
};

function regime(segments: readonly AtbSegment[], overrides: Partial<RegimeAtb> = {}): RegimeAtb {
  return {
    id: "demo-standard",
    indication: "Contexte standard de test",
    voie: "IV",
    source,
    regleRenale: { type: "segments", segments },
    ...overrides,
  };
}

function contenuSelectionne(regimeAtb: RegimeAtb, dfg: number): ContenuCelluleAtb["fr"] | undefined {
  const resultat = cellulePourDFG(regimeAtb, dfg);
  return resultat.status === "cellule-source" ? resultat.segment.contenu.fr : undefined;
}

describe("sélecteur de cellule source DFG", () => {
  it("utilise les seuils propres à la ligne et applique seulement l'égalité documentée", () => {
    const cible = regime([sous30, reference, sous10, sous50]);
    const cas = [
      [50, "référence"],
      [49.9, "segment sous 50"],
      [30, "segment sous 50"],
      [29.9, "segment sous 30"],
      [10, "segment sous ou égal à 10"],
      [9.9, "segment sous ou égal à 10"],
      [120, "référence"],
    ] as const;

    for (const [dfg, attendu] of cas) {
      expect(contenuSelectionne(cible, dfg), `DFG=${dfg}`).toBe(attendu);
    }
  });

  it("bloque une égalité dont l'interprétation n'est pas vérifiée", () => {
    const cible = regime([
      reference,
      { ...sous50, egaliteAuSeuil: "non-verifiee" },
      sous10,
    ]);

    expect(cellulePourDFG(cible, 50)).toMatchObject({
      status: "egalite-non-verifiee",
      seuil: 50,
      source,
    });
    expect(contenuSelectionne(cible, 49.9)).toBe("segment sous 50");
  });

  it("expose les bornes inclusives/exclusives exactes de chaque sélection", () => {
    const segments = [reference, sous50, sous30, sous10];
    const referenceChoisie = cellulePourDFG(regime(segments), 80);
    const cinquante = intervallePourSegmentDFG(segments, sous50);
    const trente = intervallePourSegmentDFG(segments, sous30);
    const dix = intervallePourSegmentDFG(segments, sous10);

    expect(referenceChoisie.status === "cellule-source" && referenceChoisie.intervalle).toEqual({
      borneBasse: { valeur: 50, incluse: true },
      borneHaute: { valeur: null, incluse: null },
    });
    expect(cinquante).toEqual({
      borneBasse: { valeur: 30, incluse: true },
      borneHaute: { valeur: 50, incluse: false },
    });
    expect(trente).toEqual({
      borneBasse: { valeur: 10, incluse: false },
      borneHaute: { valeur: 30, incluse: false },
    });
    expect(dix).toEqual({
      borneBasse: { valeur: null, incluse: null },
      borneHaute: { valeur: 10, incluse: true },
    });
  });

  it("préserve la nature d'une cellule — aucune donnée, déconseillé ou contre-indiqué", () => {
    const cible = regime([
      reference,
      {
        seuil: 60,
        egaliteAuSeuil: "segment-superieur",
        contenu: contenu("deconseille", "Déconseillé"),
      },
      {
        seuil: 15,
        egaliteAuSeuil: "segment-superieur",
        contenu: contenu("contre-indique", "Contre-indiqué"),
      },
      {
        seuil: 5,
        egaliteAuSeuil: "ce-segment",
        contenu: contenu("aucune-donnee", "Aucune donnée"),
      },
    ]);

    expect(cellulePourDFG(cible, 50)).toMatchObject({
      status: "cellule-source",
      segment: { contenu: { type: "deconseille", fr: "Déconseillé" } },
    });
    expect(cellulePourDFG(cible, 10)).toMatchObject({
      status: "cellule-source",
      segment: { contenu: { type: "contre-indique", fr: "Contre-indiqué" } },
    });
    expect(cellulePourDFG(cible, 4)).toMatchObject({
      status: "cellule-source",
      segment: { contenu: { type: "aucune-donnee", fr: "Aucune donnée" } },
    });
  });

  it("rend une règle bloquée comme note structurée, jamais comme dose", () => {
    const cible = regime([], {
      regleRenale: {
        type: "bloquee",
        raison: "surveillance-requise",
        contenu: contenu("surveillance-requise", "Dosage plasmatique requis"),
      },
    });

    expect(cellulePourDFG(cible, 20)).toMatchObject({
      status: "bloque",
      raison: "surveillance-requise",
      contenu: { type: "surveillance-requise", fr: "Dosage plasmatique requis" },
    });
  });

  it("garde séparés les contextes clinique standard et sévère", () => {
    const standard = regime([reference, sous30], {
      id: "demo-standard",
      indication: "Infection standard",
      source: { ...source, ligneSource: "ligne standard" },
    });
    const severe = regime([], {
      id: "demo-severe",
      indication: "Infection sévère — adaptation non documentée",
      source: { ...source, ligneSource: "ligne sévère" },
      regleRenale: {
        type: "bloquee",
        raison: "contexte-non-verifie",
        contenu: contenu("note", "Aucune adaptation rénale explicite pour ce contexte"),
      },
    });

    expect(cellulePourDFG(standard, 20)).toMatchObject({
      status: "cellule-source",
      regimeId: "demo-standard",
      indication: "Infection standard",
      source: { ligneSource: "ligne standard" },
    });
    expect(cellulePourDFG(severe, 20)).toMatchObject({
      status: "bloque",
      regimeId: "demo-severe",
      indication: "Infection sévère — adaptation non documentée",
      source: { ligneSource: "ligne sévère" },
    });
  });

  it("valide les métadonnées de contexte, de source et les règles rénales", () => {
    const valide = regime([reference, sous50]);
    expect(validerRegimeAtb(valide)).toEqual([]);
    expect(validerSegmentsDFG([reference, sous50])).toEqual([]);

    const sansContexteOuSource = regime([reference], {
      indication: "",
      source: { ...source, page: 0, document: "", version: "", ligneSource: "" },
    });
    expect(validerRegimeAtb(sansContexteOuSource)).toEqual(
      expect.arrayContaining(["indication-vide", "source-incomplete", "page-source-invalide"]),
    );
    expect(cellulePourDFG(sansContexteOuSource, 20)).toMatchObject({
      status: "invalide",
      raison: "regime",
    });

    const egaliteManquante = { ...sous50, egaliteAuSeuil: null };
    expect(validerSegmentsDFG([reference, egaliteManquante])).toContain("egalite-manquante");
    expect(
      validerSegmentsDFG([
        reference,
        sous50,
        { ...sous50, contenu: contenu("note", "autre segment au même seuil") },
      ]),
    ).toContain("seuil-duplique");
  });

  it("rejette les DFG non finis ou négatifs", () => {
    const cible = regime([reference, sous50]);
    for (const dfg of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, -0.1]) {
      expect(cellulePourDFG(cible, dfg)).toEqual({ status: "invalide", raison: "dfg" });
    }
  });
});

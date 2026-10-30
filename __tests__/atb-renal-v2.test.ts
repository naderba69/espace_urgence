import { describe, expect, it } from "vitest";
import { ATB_RENAL_ROWS } from "@/data/atb-renal";
import { ATB_RENAL_V2_BY_ID, ATB_RENAL_V2_ENABLED, ATB_RENAL_V2_PATCH, ATB_RENAL_V2_ROWS } from "@/data/atb-renal-v2";
import { cellulePourDFG, validerRegimeAtb } from "@/lib/atb-renal-dose";

function regimeParId(regimeId: string) {
  const regime = Object.values(ATB_RENAL_V2_BY_ID)
    .flatMap((row) => row.regimes)
    .find((candidate) => candidate.id === regimeId);
  if (!regime) throw new Error(`Régime introuvable : ${regimeId}`);
  return regime;
}

function contenu(regimeId: string, dfg: number) {
  return cellulePourDFG(regimeParId(regimeId), dfg);
}

function texte(regimeId: string, dfg: number) {
  const resultat = contenu(regimeId, dfg);
  return resultat.status === "cellule-source" ? resultat.segment.contenu.fr : resultat.status;
}

describe("base continue OMEDIT v2.3 — transcription à vérifier cliniquement", () => {
  it("conserve les 93 médicaments, les 126 lignes posologiques et une source par ligne", () => {
    expect(ATB_RENAL_V2_ENABLED).toBe(false);
    expect(ATB_RENAL_V2_ROWS).toHaveLength(93);
    expect(ATB_RENAL_V2_ROWS.map(({ id }) => id)).toEqual(ATB_RENAL_ROWS.map(({ id }) => id));
    expect(ATB_RENAL_V2_ROWS.reduce((total, row) => total + row.regimes.length, 0)).toBe(126);

    for (const row of ATB_RENAL_V2_ROWS) {
      for (const regime of row.regimes) {
        expect(validerRegimeAtb(regime), regime.id).toEqual([]);
        expect(regime.source.document).toContain("OMEDIT Pays de la Loire");
        expect(regime.source.version).toContain("V2.3");
        expect(regime.source.page).toBeGreaterThan(0);
        expect(regime.source.ligneSource).toBeTruthy();

        if (regime.regleRenale.type === "segments") {
          const segments = regime.regleRenale.segments;
          expect(segments.filter((segment) => segment.seuil === null), regime.id).toHaveLength(1);
          const seuils = segments.flatMap((segment) => segment.seuil === null ? [] : [segment.seuil]);
          expect(seuils, regime.id).toEqual([...seuils].sort((a, b) => b - a));
          expect(new Set(seuils).size, regime.id).toBe(seuils.length);
          expect(segments.every((segment) => segment.contenu.fr.trim().length > 0), regime.id).toBe(true);
          expect(segments.filter((segment) => segment.seuil !== null).every((segment) => segment.egaliteAuSeuil === "segment-superieur"), regime.id).toBe(true);
        }
      }
      expect(row.lastReviewed).toBe("2026-10-30");
      expect(row.traductionStatut).toBe("ar-provisoire");
    }
  });

  it("applique E1, E2 et E3 à l'ensemble des 199 seuils", () => {
    let count = 0;
    const regimes = ATB_RENAL_V2_ROWS.flatMap((row) => row.regimes);

    for (const regime of regimes) {
      if (regime.regleRenale.type !== "segments") continue;
      const segments = regime.regleRenale.segments;
      const reference = segments.find((segment) => segment.seuil === null);
      for (const segment of segments) {
        if (segment.seuil === null) continue;
        const seuil = segment.seuil;
        count += 1;

        const auSeuil = cellulePourDFG(regime, seuil);
        if (seuil === 30) {
          expect(auSeuil.status, `${regime.id} à 30`).toBe("boundary-30");
        } else {
          const superieur = segments
            .filter((candidate) => candidate.seuil !== null && candidate.seuil > seuil)
            .sort((a, b) => a.seuil! - b.seuil!)[0] ?? reference;
          expect(auSeuil.status === "cellule-source" && auSeuil.segment.contenu.fr, regime.id)
            .toBe(superieur?.contenu.fr);
        }

        const justeSous = cellulePourDFG(regime, seuil - 0.001);
        expect(justeSous.status === "cellule-source" && justeSous.segment.contenu.fr, regime.id)
          .toBe(segment.contenu.fr);

        const justeAuDessus = cellulePourDFG(regime, seuil + 0.001);
        const superieurImmediat = segments
          .filter((candidate) => candidate.seuil !== null && candidate.seuil > seuil + 0.001)
          .sort((a, b) => a.seuil! - b.seuil!)[0] ?? reference;
        expect(justeAuDessus.status === "cellule-source" && justeAuDessus.segment.contenu.fr, regime.id)
          .toBe(superieurImmediat?.contenu.fr);

        const arrondiSurSeuil = cellulePourDFG(regime, seuil - 0.1);
        expect(arrondiSurSeuil.status === "cellule-source" && arrondiSurSeuil.limiteExacte, regime.id)
          .toMatchObject({ seuil, dfgAffiche: seuil, segmentInferieur: { seuil } });
      }
    }

    expect(count).toBe(200); // 199 seuils de la grille + 1 garde-fou de contexte Ceftobiprole.
    for (const regime of regimes) {
      if (regime.regleRenale.type !== "segments" || !regime.regleRenale.segments.some((segment) => segment.seuil === 30)) continue;
      expect(cellulePourDFG(regime, 30 + 0.0000009).status, regime.id).toBe("boundary-30");
      expect(cellulePourDFG(regime, 30 - 0.0000009).status, regime.id).toBe("boundary-30");
      expect(cellulePourDFG(regime, 30 + 0.0000011).status, regime.id).not.toBe("boundary-30");
      expect(cellulePourDFG(regime, 30 - 0.0000011).status, regime.id).not.toBe("boundary-30");
    }
  });

  it("sélectionne la ligne de céfépime indiquée par le médecin et traite les seuils propres", () => {
    const scenarios = [
      ["cefepime-iv-im-possible-l2", 49.9, "2 g/24h"],
      ["cefepime-iv-im-possible-l2", 29.9, "1 g/24h"],
      ["cefepime-iv-im-possible-l2", 9.9, "0,5 g/24h"],
      ["cefepime-iv-im-possible-l2", 40, "2 g/24h"],
      ["cefepime-iv-im-possible-l3", 40, "1 g/8h"],
    ] as const;

    for (const [regimeId, dfg, attendu] of scenarios) {
      expect(texte(regimeId, dfg), `${regimeId}, DFG ${dfg}`).toBe(attendu);
    }
    expect(texte("cefepime-iv-im-possible-l2", 50)).toBe("2 g/12h");
    expect(contenu("cefepime-iv-im-possible-l2", 30).status).toBe("boundary-30");
    expect(texte("cefepime-iv-im-possible-l2", 10)).toBe("1 g/24h");
    expect(texte("cefepime-iv-im-possible-l2", 49.6)).toBe("2 g/24h");
    const limite = contenu("cefepime-iv-im-possible-l2", 49.6);
    expect(limite.status === "cellule-source" && limite.limiteExacte).toMatchObject({
      seuil: 50,
      dfgBrut: 49.6,
      dfgAffiche: 50,
      segmentInferieur: { seuil: 50, contenu: { fr: "2 g/24h" } },
    });
    expect(contenu("cefepime-iv-im-possible-l2", 30.0000005).status).toBe("boundary-30");
    expect(contenu("cefepime-iv-im-possible-l2", 30.0000015).status).not.toBe("boundary-30");
    expect(contenu("cefepime-iv-im-possible-l2", 29.9999995).status).toBe("boundary-30");
    expect(contenu("cefepime-iv-im-possible-l2", 29.9999985).status).not.toBe("boundary-30");
  });

  it("applique les seuils propres pipéracilline-tazobactam, imipénem et céfidérocol", () => {
    expect(texte("piperacilline-tazobactam-iv-l1", 40)).toBe("4 g/6 à 8h");
    expect(texte("piperacilline-tazobactam-iv-l1", 39.9)).toBe("4 g/8h");
    expect(texte("piperacilline-tazobactam-iv-l1", 20)).toBe("4 g/8h");
    expect(texte("piperacilline-tazobactam-iv-l1", 19.9)).toBe("4 g/12h");

    expect(texte("imipenem-cilastatine-iv-l3", 70)).toBe("1000 mg/6h en perfusion de 30 min");
    expect(texte("imipenem-cilastatine-iv-l3", 69.9)).toBe("750 mg/8h");
    expect(texte("imipenem-cilastatine-iv-l3", 40)).toBe("750 mg/8h");
    expect(texte("imipenem-cilastatine-iv-l3", 39.9)).toBe("500 mg/6h");
    expect(texte("imipenem-cilastatine-iv-l3", 20)).toBe("500 mg/6h");
    expect(texte("imipenem-cilastatine-iv-l3", 19.9)).toBe("500 mg/12h");

    expect(texte("cefiderocol-iv-l1", 90)).toBe("2 g/8h");
    expect(texte("cefiderocol-iv-l1", 89.9)).toBe("2 g/8h");
    expect(texte("cefiderocol-iv-l1", 60)).toBe("2 g/8h");
    expect(texte("cefiderocol-iv-l1", 59.9)).toBe("1,5 g/8h");
    expect(contenu("cefiderocol-iv-l1", 30).status).toBe("boundary-30");
    expect(texte("cefiderocol-iv-l1", 29.9)).toBe("1 g/8h");
    expect(texte("cefiderocol-iv-l1", 15)).toBe("1 g/8h");
    expect(texte("cefiderocol-iv-l1", 14.9)).toBe("0,75 g/12h");
  });

  it("préserve les statuts particuliers sans les convertir en dose", () => {
    expect(texte("cotrimoxazole-iv-po-l1", 14)).toBe("Contre-indiqué");
    expect(texte("nitrofurantoine-po-l1", 55)).toBe("Déconseillé");
    expect(texte("nitrofurantoine-po-l1", 25)).toBe("Contre-indiqué");
    expect(texte("sulfadiazine-po-l1", 25)).toBe("Aucune donnée");
  });

  it("garde la ceftriaxone inchangée et les aminosides sous surveillance", () => {
    expect(texte("ceftriaxone-im-iv-l1", 10)).toBe("1 à 2 g/24h");
    expect(ATB_RENAL_V2_BY_ID["amikacine-iv"].surveillance).toBe(true);
    expect(ATB_RENAL_V2_BY_ID["amikacine-iv"].sourceNotes).toHaveLength(2);
    expect(ATB_RENAL_V2_BY_ID["gentamicine-im-iv"].surveillance).toBe(true);
    expect(ATB_RENAL_V2_BY_ID["tobramycine-im-iv"].surveillance).toBe(true);
    expect(ATB_RENAL_V2_BY_ID["vancomycine-iv"].surveillance).toBe(true);
    expect(ATB_RENAL_V2_BY_ID["teicoplanine-im-iv"].surveillance).toBe(true);
    expect(ATB_RENAL_V2_BY_ID["colistine-iv-colistimethate-sodique"].surveillance).toBe(true);
  });

  it("cas 1 — céfidérocol : une seule ligne, note ≥120 conservée", () => {
    expect(ATB_RENAL_V2_BY_ID["cefiderocol-iv"].regimes).toHaveLength(1);
    expect(ATB_RENAL_V2_BY_ID["cefiderocol-iv"].sourceNotes[0].fr).toContain("≥ 120 mL/min");
  });

  it("cas 2 — ceftobiprole sévère : pas d'extrapolation sous 50", () => {
    expect(texte("ceftobiprole-iv-l2", 50)).toBe("1 g/8h en perfusion de 4h");
    expect(texte("ceftobiprole-iv-l2", 49.9)).toBe("Aucune donnée pour l'infection sévère sous DFG 50 (cellule source limitée)");
  });

  it("cas 3 — ceftolozane : garde deux contextes posologiques séparés", () => {
    expect(ATB_RENAL_V2_BY_ID["ceftolozane-tazobactam-iv"].regimes).toHaveLength(2);
    expect(texte("ceftolozane-tazobactam-iv-l1", 40)).toBe("500 mg/8h");
    expect(texte("ceftolozane-tazobactam-iv-l2", 40)).toBe("1 g/8h");
  });

  it("cas 4 — ceftriaxone : indications séparées et note méningée", () => {
    expect(ATB_RENAL_V2_BY_ID["ceftriaxone-im-iv"].regimes).toHaveLength(2);
    expect(texte("ceftriaxone-im-iv-l2", 10)).toBe("2 à 4 g/24h");
    expect(ATB_RENAL_V2_BY_ID["ceftriaxone-im-iv"].sourceNotes[0].fr).toContain("neuroméningée");
  });

  it("cas 5 — méropénem : note de monitorage conservée hors de la dose", () => {
    expect(ATB_RENAL_V2_BY_ID["meropenem-iv"].sourceNotes[0].fr).toContain("monitorage pharmacologique");
  });

  it("cas 6 — amikacine : note TDM et absence de réduction unitaire conservées", () => {
    expect(ATB_RENAL_V2_BY_ID["amikacine-iv"].surveillance).toBe(true);
    expect(ATB_RENAL_V2_BY_ID["amikacine-iv"].sourceNotes.map((note) => note.fr).join(" ")).toContain("ne doit pas être diminuée");
  });

  it("cas 7 — gentamicine : note TDM conservée", () => {
    expect(ATB_RENAL_V2_BY_ID["gentamicine-im-iv"].surveillance).toBe(true);
    expect(ATB_RENAL_V2_BY_ID["gentamicine-im-iv"].sourceNotes).toHaveLength(2);
  });

  it("cas 8 — tobramycine : note TDM conservée", () => {
    expect(ATB_RENAL_V2_BY_ID["tobramycine-im-iv"].surveillance).toBe(true);
    expect(ATB_RENAL_V2_BY_ID["tobramycine-im-iv"].sourceNotes).toHaveLength(2);
  });

  it("cas 9 — teicoplanine PO : notes sans ajout de posologie", () => {
    expect(ATB_RENAL_V2_BY_ID["teicoplanine-po"].regimes).toHaveLength(0);
    expect(ATB_RENAL_V2_BY_ID["teicoplanine-po"].sourceNotes).toHaveLength(1);
  });

  it("cas 10 — vancomycine IV : adaptation TDM, sans seuil rénal inventé", () => {
    expect(ATB_RENAL_V2_BY_ID["vancomycine-iv"].regimes[0].regleRenale.type).toBe("segments");
    expect(ATB_RENAL_V2_BY_ID["vancomycine-iv"].sourceNotes[0].fr).toContain("concentration plasmatique");
  });

  it("cas 11 — vancomycine PO : note seule", () => {
    expect(ATB_RENAL_V2_BY_ID["vancomycine-po"].regimes).toHaveLength(0);
    expect(ATB_RENAL_V2_BY_ID["vancomycine-po"].sourceNotes[0].fr).toContain("Clostridium difficile");
  });

  it("cas 12 — aztréonam IM : fractions source non converties", () => {
    expect(texte("aztreonam-im-l2", 20)).toBe("½ dose");
    expect(texte("aztreonam-im-l2", 10)).toBe("¼ dose");
  });

  it("cas 13 — doxycycline : note complémentaire conservée", () => {
    expect(ATB_RENAL_V2_BY_ID["doxycycline-iv-po"].sourceNotes[0].fr).toContain("gonococcie aiguë");
  });

  it("cas 14 — fosfomycine IV : verbatim source au singulier", () => {
    expect(texte("fosfomycine-iv-l1", 100)).toContain("en perfusion de 4 g");
  });

  it("cas 15 — rifampicine : exposition de l'artefact d'exposant nettoyé", () => {
    expect(texte("rifampicine-iv-po-l2", 45)).toContain("2e ou 3e jour");
  });

  it("cas 16 — lévofloxacine : seuils différents par indication", () => {
    expect(regimeParId("levofloxacine-iv-po-l1").regleRenale.type).toBe("segments");
    expect(texte("levofloxacine-iv-po-l1", 55)).toBe("DC de 500 mg puis 250 mg/12 à 24h");
    expect(texte("levofloxacine-iv-po-l2", 55)).toBe("250 mg/24h");
    expect(texte("levofloxacine-iv-po-l2", 45)).toBe("DC de 250 mg puis 125 mg/24h");
  });

  it("cas 17 — céfoxitine grave : aucune donnée sous 60", () => {
    expect(texte("cefoxitine-iv-l2", 60)).toBe("8 g/24h en continue");
    expect(texte("cefoxitine-iv-l2", 59.9)).toBe("Aucune donnée");
  });

  it("cas 18 — sulfadiazine : réduction non chiffrée puis aucune donnée", () => {
    expect(texte("sulfadiazine-po-l1", 85)).toBe("Réduction de la posologie");
    expect(texte("sulfadiazine-po-l1", 29.9)).toBe("Aucune donnée");
  });

  it("consigne dans PATCH les corrections éditoriales des cas 14, 15 et 18", () => {
    expect(ATB_RENAL_V2_PATCH.map(({ casV5 }) => casV5)).toEqual([14, 15, 18]);
    expect(ATB_RENAL_V2_PATCH.map(({ regimeId }) => regimeId)).toEqual([
      "fosfomycine-iv-l1",
      "rifampicine-iv-po-l2",
      "sulfadiazine-po-l1",
    ]);
  });
});

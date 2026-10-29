import { describe, expect, it } from "vitest";
import { ATB_RENAL_ROWS } from "@/data/atb-renal";
import { ATB_RENAL_V2_BY_ID, ATB_RENAL_V2_ROWS } from "@/data/atb-renal-v2";
import { STAGE_ORDER, stageFromDfg } from "@/lib/atb-dose";
import { cellulePourDFG } from "@/lib/atb-renal-dose";

// These are the documented representation differences between the old stage table and V2:
// merged source cells are resolved at their printed DFG boundaries, while context/format text
// has been separated or normalized according to V5 §3.2 and the source grid.
const LEGACY_RESOLUTION_IDS = new Set([
  "ampicilline-sulbactam-iv",
  "benzathine-benzylpenicilline-im",
  "benzylpenicilline-sodique-im-ou-iv",
  "piperacilline-iv",
  "piperacilline-tazobactam-iv",
  "cefadroxil-po",
  "cefepime-iv-im-possible",
  "cefixime-po",
  "cefoxitine-iv",
  "ceftaroline-fosamil-iv",
  "ceftazidime-avibactam-iv",
  "ceftobiprole-iv",
  "ceftolozane-tazobactam-iv",
  "imipenem-cilastatine-iv",
  "meropenem-iv",
  "meropenem-vaborbactam-iv-atb-de-reserve",
  "levofloxacine-iv-po",
  "ofloxacine-iv-po",
  "colistine-iv-colistimethate-sodique",
  "ethambutol-m-iv-po",
  "aztreonam-im",
  "aztreonam-iv",
  "cefazoline-im-iv",
  "cefiderocol-iv",
  "cefotaxime-im-iv",
  "ceftazidime-im-iv",
  "teicoplanine-im-iv",
  "spiramycine-iv-po",
  "trimethoprime-po",
  "lymecycline-po",
  "tigecycline-iv",
  "daptomycine-iv",
  "fosfomycine-trometamol-po",
  "linezolide-iv-po",
  "rifampicine-iv-po",
  "pivmecillinam-po",
  "cefaclor-po",
  "ertapenem-iv",
  "amikacine-iv",
  "gentamicine-im-iv",
  "tobramycine-im-iv",
  "delafloxacine-iv",
  "norfloxacine-po",
  "vancomycine-iv",
  "ornidazole-iv-po",
  "sulfadiazine-po",
  "doxycycline-iv-po",
  "bedaquiline-po",
  "pyrazinamide-po",
  "rifabutine-po",
]);

const EXPECTED_DIFFERENCE_IDS = [
  "amikacine-iv",
  "ampicilline-sulbactam-iv",
  "aztreonam-im",
  "aztreonam-iv",
  "bedaquiline-po",
  "benzathine-benzylpenicilline-im",
  "benzylpenicilline-sodique-im-ou-iv",
  "cefaclor-po",
  "cefadroxil-po",
  "cefazoline-im-iv",
  "cefepime-iv-im-possible",
  "cefiderocol-iv",
  "cefixime-po",
  "cefotaxime-im-iv",
  "cefoxitine-iv",
  "ceftaroline-fosamil-iv",
  "ceftazidime-avibactam-iv",
  "ceftazidime-im-iv",
  "ceftobiprole-iv",
  "ceftolozane-tazobactam-iv",
  "colistine-iv-colistimethate-sodique",
  "daptomycine-iv",
  "delafloxacine-iv",
  "doxycycline-iv-po",
  "ertapenem-iv",
  "ethambutol-m-iv-po",
  "fosfomycine-trometamol-po",
  "gentamicine-im-iv",
  "imipenem-cilastatine-iv",
  "levofloxacine-iv-po",
  "linezolide-iv-po",
  "lymecycline-po",
  "meropenem-iv",
  "meropenem-vaborbactam-iv-atb-de-reserve",
  "norfloxacine-po",
  "ofloxacine-iv-po",
  "ornidazole-iv-po",
  "piperacilline-iv",
  "piperacilline-tazobactam-iv",
  "pivmecillinam-po",
  "pyrazinamide-po",
  "rifabutine-po",
  "rifampicine-iv-po",
  "spiramycine-iv-po",
  "sulfadiazine-po",
  "teicoplanine-im-iv",
  "tigecycline-iv",
  "tobramycine-im-iv",
  "trimethoprime-po",
  "vancomycine-iv",
];

const LEGACY_ROW_SHAPE_EXCEPTIONS = new Set([
  "ceftriaxone-im-iv", // une cellule multi-contexte devient deux lignes explicites (V5 cas 4)
  "teicoplanine-po", // le texte thérapeutique PO reste une note, pas une adaptation rénale (cas 9)
  "azithromycine-po", // l'ancien texte informatif devient une ligne source consultable
]);

const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/\s+/g, " ").trim();

describe("parité de sélection historique ↔ brouillon continu", () => {
  it("parcourt chaque régime aux DFG 5–130 et autour de chaque seuil", () => {
    const dfgs = new Set<number>();
    for (let dfg = 5; dfg <= 130; dfg += 5) dfgs.add(dfg);
    for (const row of ATB_RENAL_V2_ROWS) {
      for (const regime of row.regimes) {
        if (regime.regleRenale.type !== "segments") continue;
        for (const segment of regime.regleRenale.segments) {
          if (segment.seuil === null) continue;
          for (const delta of [-0.001, 0, 0.001]) {
            const dfg = segment.seuil + delta;
            if (dfg >= 5 && dfg <= 130) dfgs.add(dfg);
          }
        }
      }
    }

    let compared = 0;
    const encounteredDifferences = new Set<string>();
    const encounteredShapeExceptions = new Set<string>();

    for (const legacyRow of ATB_RENAL_ROWS) {
      const current = ATB_RENAL_V2_BY_ID[legacyRow.id];
      const legacyDoseLines = legacyRow.lines.filter((line) => line.kind === "dose");
      if (legacyDoseLines.length !== current.regimes.length) {
        expect(LEGACY_ROW_SHAPE_EXCEPTIONS.has(legacyRow.id), legacyRow.id).toBe(true);
        encounteredShapeExceptions.add(legacyRow.id);
        continue;
      }

      current.regimes.forEach((regime, index) => {
        if (regime.regleRenale.type !== "segments") return;
        for (const dfg of dfgs) {
          // The old global selector intentionally has no stage at DFG 30; E2 is tested separately.
          const stage = stageFromDfg(dfg);
          if (stage === null) continue;
          const oldText = legacyDoseLines[index].d[STAGE_ORDER.indexOf(stage)];
          const result = cellulePourDFG(regime, dfg);
          const newText = result.status === "cellule-source" ? result.segment.contenu.fr : result.status;
          compared += 1;
          if (normalize(oldText) === normalize(newText)) continue;

          expect(LEGACY_RESOLUTION_IDS.has(legacyRow.id), `${legacyRow.id}, DFG ${dfg}: ${oldText} → ${newText}`).toBe(true);
          encounteredDifferences.add(legacyRow.id);
        }
      });
    }

    expect(compared).toBeGreaterThan(3000);
    expect([...encounteredShapeExceptions].sort()).toEqual([...LEGACY_ROW_SHAPE_EXCEPTIONS].sort());
    expect([...encounteredDifferences].sort()).toEqual(EXPECTED_DIFFERENCE_IDS);
    expect(encounteredDifferences.size).toBeGreaterThan(0); // documented model/source resolutions, not unexplained dose parity.
  });
});

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ATB_RENAL_ROWS } from "@/data/atb-renal";
import { ATB_RENAL_V2_BY_ID, ATB_RENAL_V2_ROWS } from "@/data/atb-renal-v2";

interface SourceCell {
  x0: number;
  x1: number;
  text: string;
}

interface SourceLine {
  source_cells: SourceCell[];
}

interface SourceRow {
  page: number;
  lines: SourceLine[];
}

const sourceRows = JSON.parse(
  readFileSync("data/issues/OMEDIT-ATB-IR-V2.3.rows.json", "utf8"),
) as SourceRow[];

// These are the only row-level differences between printed cell borders and dose thresholds:
// Ceftobiprole L2 adds the documented <50 no-data guard; Ceftolozane contains two regimens in
// each physical source row; Amikacine and Vancomycine have physical borders for TDM notes, not doses.
const EXPECTED_BOUNDARY_DELTAS: Record<string, number> = {
  "ceftobiprole-iv": 1,
  "ceftolozane-tazobactam-iv": 3,
  "amikacine-iv": -1,
  "vancomycine-iv": -1,
};

describe("correspondance géométrique PDF ↔ seuils V2", () => {
  it("réconcilie les cellules source et les seuils par ligne, pas seulement au total", () => {
    expect(sourceRows).toHaveLength(93);
    expect(ATB_RENAL_ROWS).toHaveLength(93);
    expect(ATB_RENAL_V2_ROWS).toHaveLength(93);

    let sourceBoundaries = 0;
    let doseThresholds = 0;
    const seenExceptions = new Set<string>();

    sourceRows.forEach((sourceRow, index) => {
      const legacyRow = ATB_RENAL_ROWS[index];
      const draftRow = ATB_RENAL_V2_ROWS[index];
      expect(draftRow.id, `ordre source, ligne ${index + 1}`).toBe(legacyRow.id);
      for (const regime of draftRow.regimes) expect(regime.source.page).toBe(sourceRow.page);

      const geometryCount = sourceRow.lines.reduce(
        (total, line) => total + Math.max(0, line.source_cells.length - 1),
        0,
      );
      const thresholdCount = draftRow.regimes.reduce((total, regime) => (
        total + (regime.regleRenale.type === "segments"
          ? regime.regleRenale.segments.filter((segment) => segment.seuil !== null).length
          : 0)
      ), 0);
      sourceBoundaries += geometryCount;
      doseThresholds += thresholdCount;

      const expectedDelta = EXPECTED_BOUNDARY_DELTAS[draftRow.id] ?? 0;
      expect(thresholdCount - geometryCount, draftRow.id).toBe(expectedDelta);
      if (expectedDelta !== 0) seenExceptions.add(draftRow.id);
    });

    expect(sourceBoundaries).toBe(198);
    expect(doseThresholds).toBe(200);
    expect([...seenExceptions].sort()).toEqual(Object.keys(EXPECTED_BOUNDARY_DELTAS).sort());

    const ceftobiprole = ATB_RENAL_V2_BY_ID["ceftobiprole-iv"].regimes;
    expect(ceftobiprole.find((regime) => regime.id.endsWith("-l2"))?.regleRenale.type).toBe("segments");
    const severe = ceftobiprole.find((regime) => regime.id.endsWith("-l2"));
    expect(severe?.regleRenale.type === "segments"
      && severe.regleRenale.segments.find((segment) => segment.seuil === 50)?.contenu.fr)
      .toBe("Aucune donnée pour l'infection sévère sous DFG 50 (cellule source limitée)");

    for (const id of ["amikacine-iv", "vancomycine-iv"]) {
      const row = ATB_RENAL_V2_BY_ID[id];
      expect(row.surveillance, id).toBe(true);
      expect(row.sourceNotes.length, id).toBeGreaterThan(0);
      expect(row.regimes.every((regime) => regime.regleRenale.type !== "segments"
        || regime.regleRenale.segments.every((segment) => segment.seuil === null)), id).toBe(true);
    }
  });
});

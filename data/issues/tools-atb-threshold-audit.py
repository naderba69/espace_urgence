#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""تدقيق هندسي لمحاذاة حدود خلايا جدول OMEDIT مع تدريج DFG المطبوع.
Contrôle géométrique uniquement : associe les bords de cellules aux graduations DFG visibles.
Cela ne valide ni l'inclusion des bornes, ni les doses, ni une règle clinique.
Requires PyMuPDF (`import pymupdf`).
"""
from __future__ import annotations

import json
import statistics
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
ISSUES = Path(__file__).resolve().parent
PDF_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else ISSUES / "OMEDIT-ATB-IR-V2.3-avril2026.pdf"
ROWS_PATH = Path(sys.argv[2]) if len(sys.argv) > 2 else ISSUES / "OMEDIT-ATB-IR-V2.3.rows.json"
EXPECTED_TICKS = set(range(0, 91, 5))


def axis_ticks(page: Any) -> dict[int, float]:
    """Locate the complete printed 90→0 DFG axis on one PDF page."""
    groups: dict[float, dict[int, float]] = defaultdict(dict)
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                text = span["text"].strip()
                if not text.isdigit() or int(text) not in EXPECTED_TICKS:
                    continue
                x0, y0, x1, _ = span["bbox"]
                # The second occurrence of "90" can be a stage heading; the axis is the
                # horizontal row containing all 19 values, so y is only used for grouping.
                groups[round(y0, 1)][int(text)] = x1
    candidates = [ticks for ticks in groups.values() if set(ticks) == EXPECTED_TICKS]
    if len(candidates) != 1:
        raise ValueError(f"Expected one complete DFG axis, found {len(candidates)}")
    return candidates[0]


def cell_boundaries(rows: list[dict[str, Any]]) -> dict[int, set[float]]:
    out: dict[int, set[float]] = defaultdict(set)
    for row in rows:
        page = int(row["page"])
        for line in row.get("lines", []):
            for cell in line.get("source_cells", []):
                out[page].add(round(float(cell["x0"]), 1))
                out[page].add(round(float(cell["x1"]), 1))
    return out


def main() -> int:
    try:
        import pymupdf
    except ImportError as exc:  # pragma: no cover - environment dependent
        print("PyMuPDF is required: python -m pip install pymupdf", file=sys.stderr)
        raise SystemExit(2) from exc

    rows = json.loads(ROWS_PATH.read_text(encoding="utf-8"))
    pdf = pymupdf.open(str(PDF_PATH))
    if len(pdf) != 12:
        raise ValueError(f"Expected 12 PDF pages, found {len(pdf)}")

    ticks_by_page = {i + 1: axis_ticks(page) for i, page in enumerate(pdf)}
    boundaries_by_page = cell_boundaries(rows)

    # Infer the constant text-to-gridline offset from all candidate matches instead of
    # hard-coding a coordinate offset. Axis labels sit immediately to the left of their
    # corresponding vertical cell boundary in this source PDF.
    deltas: list[float] = []
    for page_no, boundaries in boundaries_by_page.items():
        tick_right_edges = ticks_by_page[page_no].values()
        for x in boundaries:
            nearest = min((x - edge for edge in tick_right_edges), key=abs)
            if abs(nearest) <= 3.0:
                deltas.append(nearest)
    if not deltas:
        raise ValueError("No cell boundaries matched a printed DFG tick")
    offset = statistics.median(deltas)

    mapped: dict[int, dict[int, set[float]]] = defaultdict(lambda: defaultdict(set))
    unmatched: list[tuple[int, float, float]] = []
    for page_no, boundaries in boundaries_by_page.items():
        ticks = ticks_by_page[page_no]
        for x in boundaries:
            # The first/last grid edges delimit the graph itself; the rightmost edge is
            # printed as DFG 0, not a clinical cutoff between two dose cells.
            if abs(x - 133.9) <= 0.2 or abs(x - 795.5) <= 0.2:
                continue
            nearest_tick, residual = min(
                ((tick, x - (right_edge + offset)) for tick, right_edge in ticks.items()),
                key=lambda item: abs(item[1]),
            )
            # Outer table edges are not internal interval boundaries and need no tick.
            if abs(residual) > 0.25:
                # Ignore the two table edges; report every other non-matching coordinate.
                if not (abs(x - 133.9) <= 0.2 or abs(x - 795.5) <= 0.2):
                    unmatched.append((page_no, x, residual))
                continue
            mapped[page_no][nearest_tick].add(x)

    total_internal = sum(
        1 for boundaries in boundaries_by_page.values()
        for x in boundaries
        if abs(x - 133.9) > 0.2 and abs(x - 795.5) > 0.2
    )
    total_mapped = sum(len(xs) for page in mapped.values() for xs in page.values())
    if unmatched or total_mapped != total_internal:
        preview = ", ".join(f"p.{p} x={x:.1f} residual={d:+.2f}" for p, x, d in unmatched[:12])
        raise ValueError(
            f"Boundary mapping incomplete: {total_mapped}/{total_internal}; "
            f"unmatched={preview or 'none'}"
        )

    unique_thresholds = sorted({tick for page in mapped.values() for tick in page}, reverse=True)
    print(f"PDF pages: {len(pdf)}; JSON rows: {len(rows)}")
    print(f"Inferred label-to-grid offset: {offset:.2f} pt")
    print(f"Internal cell-boundary coordinates mapped: {total_mapped}/{total_internal}")
    print("Printed DFG ticks used by at least one cell boundary: " + ", ".join(map(str, unique_thresholds)))
    for page_no in sorted(mapped):
        page_count = sum(len(xs) for xs in mapped[page_no].values())
        thresholds = ", ".join(map(str, sorted(mapped[page_no], reverse=True)))
        print(f"  page {page_no:2}: {page_count:2} coordinates → {thresholds}")
    print("Scope: geometry only; no dose, boundary-inclusivity, or clinical validation.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

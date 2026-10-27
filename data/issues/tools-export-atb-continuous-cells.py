#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Exporte la géométrie des cellules OMEDIT vers un candidat non clinique.

Ce fichier relie les coordonnées des cellules aux graduations DFG imprimées. Il n'extrait,
ne classe et ne recommande aucune posologie : chaque texte reste non classé et l'inclusion à
l'égalité de chaque bord interne reste non vérifiée. L'archive produite ne doit pas être importée
par l'application avant revue ligne par ligne.

Requires PyMuPDF (`import pymupdf`).
"""
from __future__ import annotations

import argparse
import json
import statistics
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
ISSUES = Path(__file__).resolve().parent
PDF_DEFAULT = ISSUES / "OMEDIT-ATB-IR-V2.3-avril2026.pdf"
ROWS_DEFAULT = ISSUES / "OMEDIT-ATB-IR-V2.3.rows.json"
OUT_DEFAULT = ISSUES / "OMEDIT-ATB-IR-V2.3.continuous-cells.candidate.json"
EXPECTED_TICKS = set(range(0, 91, 5))
LEFT_GRAPH_EDGE = 133.9
RIGHT_GRAPH_EDGE = 795.5
OUTER_EDGE_TOLERANCE = 0.2
MAPPING_TOLERANCE = 0.25


def axis_ticks(page: Any) -> dict[int, float]:
    """Repère les 19 graduations DFG imprimées sur une page."""
    groups: dict[float, dict[int, float]] = defaultdict(dict)
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                text = span["text"].strip()
                if not text.isdigit() or int(text) not in EXPECTED_TICKS:
                    continue
                _, y0, x1, _ = span["bbox"]
                groups[round(y0, 1)][int(text)] = x1
    candidates = [ticks for ticks in groups.values() if set(ticks) == EXPECTED_TICKS]
    if len(candidates) != 1:
        raise ValueError(f"Axe DFG incomplet ou ambigu : {len(candidates)} axes détectés")
    return candidates[0]


def cell_boundaries(rows: list[dict[str, Any]]) -> dict[int, set[float]]:
    boundaries: dict[int, set[float]] = defaultdict(set)
    for row in rows:
        page = int(row["page"])
        for line in row.get("lines", []):
            for cell in line.get("source_cells", []):
                boundaries[page].add(round(float(cell["x0"]), 1))
                boundaries[page].add(round(float(cell["x1"]), 1))
    return boundaries


def infer_offset(
    boundaries_by_page: dict[int, set[float]],
    ticks_by_page: dict[int, dict[int, float]],
) -> float:
    deltas: list[float] = []
    for page_no, boundaries in boundaries_by_page.items():
        tick_edges = ticks_by_page[page_no].values()
        for x in boundaries:
            nearest = min((x - edge for edge in tick_edges), key=abs)
            if abs(nearest) <= 3.0:
                deltas.append(nearest)
    if not deltas:
        raise ValueError("Aucune frontière ne correspond aux graduations DFG")
    return statistics.median(deltas)


def map_internal_boundaries(
    boundaries_by_page: dict[int, set[float]],
    ticks_by_page: dict[int, dict[int, float]],
    offset: float,
) -> dict[int, dict[float, dict[str, float | int]]]:
    mapped: dict[int, dict[float, dict[str, float | int]]] = defaultdict(dict)
    unmatched: list[tuple[int, float, float]] = []
    for page_no, boundaries in boundaries_by_page.items():
        ticks = ticks_by_page[page_no]
        for x in boundaries:
            if abs(x - LEFT_GRAPH_EDGE) <= OUTER_EDGE_TOLERANCE:
                continue
            if abs(x - RIGHT_GRAPH_EDGE) <= OUTER_EDGE_TOLERANCE:
                continue
            tick, residual = min(
                ((value, x - (edge + offset)) for value, edge in ticks.items()),
                key=lambda item: abs(item[1]),
            )
            if abs(residual) > MAPPING_TOLERANCE:
                unmatched.append((page_no, x, residual))
                continue
            mapped[page_no][x] = {"dfg": tick, "residualPt": round(residual, 3)}
    if unmatched:
        sample = ", ".join(
            f"p.{page} x={x:.1f} résidu={residual:+.3f} pt"
            for page, x, residual in unmatched[:10]
        )
        raise ValueError(f"Frontières internes non mappées : {sample}")
    return mapped


def boundary_info(
    page_no: int,
    x: float,
    mapped: dict[int, dict[float, dict[str, float | int]]],
) -> dict[str, Any]:
    x = round(float(x), 1)
    if abs(x - LEFT_GRAPH_EDGE) <= OUTER_EDGE_TOLERANCE:
        return {
            "xPt": x,
            "type": "bord-exterieur-haute-fonction",
            "graduationDfg": None,
            "egalite": "sans-objet",
        }
    if abs(x - RIGHT_GRAPH_EDGE) <= OUTER_EDGE_TOLERANCE:
        return {
            "xPt": x,
            "type": "bord-exterieur-dfg-zero",
            "graduationDfg": 0,
            "egalite": "sans-objet",
        }
    candidate = mapped.get(page_no, {}).get(x)
    if candidate is None:
        raise ValueError(f"Frontière interne p.{page_no}, x={x:.1f}, absente de l'audit")
    return {
        "xPt": x,
        "type": "frontiere-interne",
        "graduationDfg": candidate["dfg"],
        "residuPt": candidate["residualPt"],
        "egalite": "non-verifiee",
    }


def make_candidate(
    rows: list[dict[str, Any]],
    pdf: Any,
    source_pdf: Path,
    source_rows: Path,
) -> dict[str, Any]:
    if len(pdf) != 12:
        raise ValueError(f"12 pages PDF attendues, {len(pdf)} trouvées")
    ticks_by_page = {index + 1: axis_ticks(page) for index, page in enumerate(pdf)}
    boundaries_by_page = cell_boundaries(rows)
    offset = infer_offset(boundaries_by_page, ticks_by_page)
    mapped = map_internal_boundaries(boundaries_by_page, ticks_by_page, offset)

    internal_count = sum(len(page) for page in mapped.values())
    all_internal_count = sum(
        1
        for page_no, boundaries in boundaries_by_page.items()
        for x in boundaries
        if abs(x - LEFT_GRAPH_EDGE) > OUTER_EDGE_TOLERANCE
        and abs(x - RIGHT_GRAPH_EDGE) > OUTER_EDGE_TOLERANCE
    )
    if internal_count != all_internal_count:
        raise ValueError(f"Cartographie incomplète : {internal_count}/{all_internal_count}")

    output_rows: list[dict[str, Any]] = []
    line_count = 0
    cell_count = 0
    for row in rows:
        output_lines: list[dict[str, Any]] = []
        for line_index, line in enumerate(row.get("lines", []), start=1):
            line_count += 1
            output_cells = []
            for cell in sorted(line.get("source_cells", []), key=lambda item: (item["x0"], item["x1"])):
                x0 = round(float(cell["x0"]), 1)
                x1 = round(float(cell["x1"]), 1)
                if x1 <= x0:
                    raise ValueError(f"Cellule de largeur invalide : {row['label']} ligne {line_index}")
                output_cells.append({
                    "idCelluleSource": cell["id"],
                    "debutVisuel": boundary_info(int(row["page"]), x0, mapped),
                    "finVisuelle": boundary_info(int(row["page"]), x1, mapped),
                    "texteSourceNonClasse": cell["text"],
                })
                cell_count += 1
            output_lines.append({
                "indexLigneSource": line_index,
                "ySourcePt": line.get("y"),
                "cellulePleineLargeur": bool(line.get("full", False)),
                "cellulesRemplies": line.get("filled", []),
                "cellulesManquantes": line.get("missing", []),
                "stadesAmbigusDansLeModeleActuel": line.get("ambiguous_stages", []),
                "cellulesNonChoisies": line.get("unselected_cell_ids", []),
                "cartographieActuelle": line.get("mapped_cell", {}),
                "methodeCartographieActuelle": line.get("mapping_method", {}),
                "cellules": output_cells,
            })
        output_rows.append({
            "libelleSource": row["label"],
            "pagePdf": int(row["page"]),
            "relectureSignaleeDansJson": bool(row.get("review", False)),
            "lignes": output_lines,
        })

    return {
        "meta": {
            "statut": "GEOMETRIE_SEULE_NON_CLINIQUE",
            "avertissement": (
                "Candidat de traçabilité uniquement. Les textes ne sont pas classés comme dose/note/absence de donnée; "
                "les indications ne sont pas séparées; l'égalité aux frontières internes n'est pas vérifiée. "
                "Ne pas utiliser pour choisir ou calculer une posologie."
            ),
            "sourcePdf": source_pdf.name,
            "sourceJson": source_rows.name,
            "versionSource": "OMEDIT Pays de la Loire V2.3 — avril 2026",
            "pagesPdf": len(pdf),
            "lignesMedicaments": len(rows),
            "lignesSource": line_count,
            "cellulesSource": cell_count,
            "frontieresInternesMappees": internal_count,
            "offsetMédianTexteVersGrillePt": round(offset, 3),
            "graduationsUtilisees": sorted(
                {
                    int(candidate["dfg"])
                    for page in mapped.values()
                    for candidate in page.values()
                },
                reverse=True,
            ),
            "inclusionEgalite": "non-verifiee pour toutes les frontieres internes",
        },
        "lignes": output_rows,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pdf", type=Path, default=PDF_DEFAULT)
    parser.add_argument("--rows", type=Path, default=ROWS_DEFAULT)
    parser.add_argument("--out", type=Path, default=OUT_DEFAULT)
    parser.add_argument("--check", action="store_true", help="vérifie la reproduction sans écrire le fichier")
    args = parser.parse_args()

    try:
        import pymupdf
    except ImportError as exc:  # pragma: no cover - dépend de l'environnement local
        print("PyMuPDF requis : python -m pip install pymupdf", file=sys.stderr)
        raise SystemExit(2) from exc

    rows = json.loads(args.rows.read_text(encoding="utf-8"))
    pdf = pymupdf.open(str(args.pdf))
    candidate = make_candidate(rows, pdf, args.pdf, args.rows)
    rendered = json.dumps(candidate, ensure_ascii=False, indent=2) + "\n"

    if args.check:
        if not args.out.exists():
            print(f"Archive candidate manquante : {args.out}", file=sys.stderr)
            return 1
        if args.out.read_text(encoding="utf-8") != rendered:
            print(f"Archive candidate non reproductible : {args.out}", file=sys.stderr)
            return 1
        print(f"Candidate geometry OK: {args.out} ({candidate['meta']['cellulesSource']} cellules)")
    else:
        args.out.write_text(rendered, encoding="utf-8")
        print(f"Archive candidate écrite : {args.out}")
        print(
            f"{candidate['meta']['lignesMedicaments']} médicaments, "
            f"{candidate['meta']['lignesSource']} lignes, "
            f"{candidate['meta']['cellulesSource']} cellules, "
            f"{candidate['meta']['frontieresInternesMappees']}/"
            f"{candidate['meta']['frontieresInternesMappees']} frontières mappées."
        )
        print("Portée géométrique seulement; aucun texte classé ou posologie sélectionnable.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

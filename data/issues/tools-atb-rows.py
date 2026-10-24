# -*- coding: utf-8 -*-
"""تحويل خلايا جدول OMEDIT إلى صفوف مصدرية قابلة للمراجعة.
Conversion des cellules PDF en lignes source (molécule × bande horizontale).

Le mappage vers les 5 grandes tranches reste une projection géométrique, pas une règle de dose :
- chaque cellule est affectée à une tranche si elle en recouvre strictement plus de 50 % ;
- une tranche sans majorité reçoit la cellule la plus proche, avec un drapeau `filled` ;
- chaque cellule, ses coordonnées, son affectation et les cellules traversant chaque tranche sont
  conservées. Si une tranche recouvre plusieurs textes source distincts, elle est marquée
  `ambiguous_stages` : le générateur ne doit pas en choisir silencieusement un seul.

Sortie par défaut : /tmp/eutn-atb-audit/atb_rows.json.
"""
import json, re, sys, tempfile
from pathlib import Path

TMP_DIR = Path(tempfile.gettempdir()) / "eutn-atb-audit"
TMP_DIR.mkdir(parents=True, exist_ok=True)
CELLS_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else TMP_DIR / "atb_cells.json"
OUT_PATH = Path(sys.argv[2]) if len(sys.argv) > 2 else TMP_DIR / "atb_rows.json"
CELLS = json.loads(CELLS_PATH.read_text(encoding="utf-8"))
STAGES = [("normorenal", 133.9, 270.1), ("legere", 270.1, 405.5),
          ("moderee", 405.5, 540.9), ("severe", 540.9, 670.6), ("terminale", 670.6, 795.5)]
TOL = 2.0
MIN_STAGE_OVERLAP = 2.0
KEY = [s[0] for s in STAGES]


def overlap(x0, x1, a, b):
    return max(0.0, min(x1, b) - max(x0, a))


def majority(x0, x1):
    return [i for i, (_, a, b) in enumerate(STAGES) if overlap(x0, x1, a, b) > (b - a) / 2]


def comparable(text):
    # Ignore only typography/spacing when deciding whether two physical cells differ.
    return re.sub(r"\s+", "", text.replace("’", "'").replace("‘", "'")).casefold()


def cell_meta(c, cell_id):
    return {
        "id": cell_id,
        "x0": round(c["x0"], 1), "x1": round(c["x1"], 1),
        "y0": round(c["y0"], 1), "y1": round(c["y1"], 1),
        "text": c["t"],
    }


out = []
for pg in CELLS:
    if pg.get("skipped"):
        continue
    cells = [c for c in pg["cells"] if c["t"]]
    labels = [c for c in cells if c["x0"] < 20 and c["size"] and c["size"] >= 9.5]
    for lab in labels:
        y0, y1 = lab["y0"], lab["y1"]
        row_cells = [c for c in cells if c is not lab and c["y1"] > y0 + TOL and c["y0"] < y1 - TOL]
        bands = {}
        for c in row_cells:
            bands.setdefault(round(c["y0"], 1), []).append(c)
        lines, notes, note_cells = [], [], []
        prev_note = []
        for by in sorted(bands):
            band = [c for c in sorted(bands[by], key=lambda c: c["x0"]) if c["x0"] > 20]
            if not band:
                continue
            keep = []
            for c in band:
                is_note = c["italic"] or c["t"].startswith("Posologies exprimées")
                # Fusion verticale partielle : cette case est contenue dans une case déjà vue.
                over_prev = any(py0 < c["y0"] + TOL and py1 > c["y1"] - TOL
                                and overlap(c["x0"], c["x1"], px0, px1) > (c["x1"] - c["x0"]) / 2
                                for px0, px1, py0, py1 in prev_note)
                if is_note or over_prev:
                    notes.append(c["t"])
                    note_cells.append({**cell_meta(c, len(note_cells) + 1), "reason": "italique" if is_note else "fusion verticale"})
                else:
                    keep.append(c)
                prev_note.append((c["x0"], c["x1"], c["y0"], c["y1"]))
            if not keep:
                continue

            source_cells = [cell_meta(c, i + 1) for i, c in enumerate(keep)]
            stage_cells = {
                key: [cell["id"] for cell in source_cells
                      if overlap(cell["x0"], cell["x1"], a, b) > MIN_STAGE_OVERLAP]
                for key, a, b in STAGES
            }
            ambiguous_stages = []
            for key, ids in stage_cells.items():
                texts = {comparable(source_cells[i - 1]["text"]) for i in ids}
                if len(texts) > 1:
                    ambiguous_stages.append(key)

            # Une cellule pleine largeur porte la même consigne dans les cinq tranches.
            full = [c for c in keep if c["x0"] <= 134.5 and c["x1"] >= 795.0]
            if full and len(full) == len(keep) and len({comparable(c["t"]) for c in full}) == 1:
                vals = {k: full[0]["t"] for k in KEY}
                mapping = {k: 1 for k in KEY}
                methods = {k: "full-width" for k in KEY}
                lines.append({
                    "y": by, "values": vals, "full": True,
                    "filled": [], "missing": [], "source_cells": source_cells,
                    "stage_cells": stage_cells, "mapped_cell": mapping,
                    "mapping_method": methods, "ambiguous_stages": ambiguous_stages,
                    "unselected_cell_ids": [], "review": bool(ambiguous_stages),
                })
                continue

            # Ne pas déduire les tranches du nombre de cellules : les vraies frontières source
            # peuvent traverser une grande tranche, ou plusieurs cellules peuvent y tomber.
            assign, methods, filled = {}, {}, []
            for c in keep:
                for i in majority(c["x0"], c["x1"]):
                    key = KEY[i]
                    if key not in assign or overlap(c["x0"], c["x1"], *STAGES[i][1:]) > overlap(assign[key]["x0"], assign[key]["x1"], *STAGES[i][1:]):
                        assign[key] = c
                        methods[key] = "majority-overlap"
            for i, (key, a, b) in enumerate(STAGES):
                if key in assign:
                    continue
                cx = (a + b) / 2
                best = min(keep, key=lambda c: abs((c["x0"] + c["x1"]) / 2 - cx))
                assign[key] = best
                methods[key] = "nearest-fill"
                filled.append(key)

            safe_assign = {key: cell for key, cell in assign.items() if key not in ambiguous_stages}
            cell_ids_by_object = {id(cell): i + 1 for i, cell in enumerate(keep)}
            mapped_cell = {key: cell_ids_by_object[id(cell)] for key, cell in safe_assign.items()}
            vals = {key: cell["t"] for key, cell in safe_assign.items()}
            mapping_method = {key: methods[key] for key in safe_assign}
            filled = [key for key in filled if key not in ambiguous_stages]
            missing = [key for key in KEY if key not in assign and key not in ambiguous_stages]
            used_ids = set(mapped_cell.values())
            unselected_cell_ids = [cell["id"] for cell in source_cells if cell["id"] not in used_ids]
            review = bool(filled or missing or ambiguous_stages or unselected_cell_ids)
            lines.append({
                "y": by, "values": vals, "full": False,
                "filled": filled, "missing": missing,
                "source_cells": source_cells, "stage_cells": stage_cells,
                "mapped_cell": mapped_cell,
                "mapping_method": mapping_method,
                "ambiguous_stages": ambiguous_stages,
                "unselected_cell_ids": unselected_cell_ids,
                "review": review,
            })
        if not lines and not notes:
            continue
        out.append({
            "page": pg["page"], "label": " ".join(lab["spans"]), "y": lab["y0"],
            "lines": lines, "notes": notes, "note_cells": note_cells,
            "review": any(line["review"] for line in lines) or not lines,
        })

with OUT_PATH.open("w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
nb_lines = sum(len(row["lines"]) for row in out)
review_lines = [line for row in out for line in row["lines"] if line["review"]]
ambiguous = [(row, line, key) for row in out for line in row["lines"] for key in line["ambiguous_stages"]]
unselected = [(row, line) for row in out for line in row["lines"] if line["unselected_cell_ids"]]
print(f"molécules : {len(out)} | lignes source : {nb_lines}")
print(f"lignes marquées « à revoir » : {len(review_lines)}")
print(f"combinaisons ligne × tranche avec plusieurs cellules source : {len(ambiguous)}")
print(f"lignes avec cellules non choisies par la projection simple : {len(unselected)}")
print(f"molécules sans valeur (en-têtes de section) : {sum(1 for row in out if not row['lines'])}")
for row, line, key in ambiguous:
    print(f"  ⚠ p{row['page']:2d} «{row['label'][:34]:34s}» ligne y={line['y']:.0f} tranche={key}: plusieurs textes source")
for row, line in unselected:
    print(f"  ⚠ p{row['page']:2d} «{row['label'][:34]:34s}» ligne y={line['y']:.0f} cellules non choisies={line['unselected_cell_ids']}")

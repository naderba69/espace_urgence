# -*- coding: utf-8 -*-
"""تحويل خلايا الجدول إلى صفوف (دواء × 5 مراحل).
Conversion des cellules du tableau en lignes (molécule × 5 stades).

Règle d'affectation (validée sur les 12 pages rendues en image) :
 1. chaque « bande » horizontale (une ligne de données) est traitée séparément ;
 2. si la bande contient exactement 5 cases de valeurs, elles correspondent aux 5 stades
    dans l'ordre (le tableau source décale parfois la ligne entière : le nombre fait foi) ;
 3. sinon, une case couvre un stade si elle en recouvre la MAJORITÉ (> 50 % de la largeur) ;
 4. les stades non couverts (case étroite, décalage partiel) sont comblés par la case la plus
    proche horizontalement, sans écraser une affectation majoritaire.
Sortie : /home/user/atb_rows.json  (dose par stade, notes, drapeaux de revue).
"""
import json

CELLS = json.load(open("/home/user/atb_cells.json"))
STAGES = [("normorenal", 133.9, 270.1), ("legere", 270.1, 405.5),
          ("moderee", 405.5, 540.9), ("severe", 540.9, 670.6), ("terminale", 670.6, 795.5)]
TOL = 2.0
KEY = [s[0] for s in STAGES]

def overlap(x0, x1, a, b):
    return max(0.0, min(x1, b) - max(x0, a))

def majority(x0, x1):
    return [i for i, (_, a, b) in enumerate(STAGES) if overlap(x0, x1, a, b) > (b - a) / 2]

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
        lines, notes = [], []
        prev_note = []
        for by in sorted(bands):
            band = [c for c in sorted(bands[by], key=lambda c: c["x0"]) if c["x0"] > 20]
            if not band:
                continue
            keep = []
            for c in band:
                is_note = c["italic"] or c["t"].startswith("Posologies exprimées")
                # fusion verticale partielle : la case est CONTENUE verticalement dans une case
                # déjà vue (le tableau fusionne deux bandes sur une colonne seulement)
                over_prev = any(py0 < c["y0"] + TOL and py1 > c["y1"] - TOL
                                and overlap(c["x0"], c["x1"], px0, px1) > (c["x1"] - c["x0"]) / 2
                                for px0, px1, py0, py1 in prev_note)
                if is_note or over_prev:
                    notes.append(c["t"])
                else:
                    keep.append(c)
                prev_note.append((c["x0"], c["x1"], c["y0"], c["y1"]))
            if not keep:
                continue
            # une case pleine largeur = valeur valable pour tous les stades
            full = [c for c in keep if c["x0"] <= 134.5 and c["x1"] >= 795.0]
            if full and len(full) == len(keep):
                vals = {k: full[0]["t"] for k in KEY}
                lines.append({"y": by, "values": vals, "full": True, "review": False})
                continue
            assign, filled = {}, []
            if len(keep) == 5:
                for i, c in enumerate(keep):
                    assign[KEY[i]] = c
            else:
                for c in keep:
                    for i in majority(c["x0"], c["x1"]):
                        k = KEY[i]
                        if k not in assign or overlap(c["x0"], c["x1"], *STAGES[i][1:]) > overlap(assign[k]["x0"], assign[k]["x1"], *STAGES[i][1:]):
                            assign[k] = c
                for i in range(5):
                    k = KEY[i]
                    if k in assign:
                        continue
                    cx = (STAGES[i][1] + STAGES[i][2]) / 2
                    best = min(keep, key=lambda c: abs((c["x0"] + c["x1"]) / 2 - cx))
                    assign[k] = best
                    filled.append(k)
            vals = {k: assign[k]["t"] for k in KEY if k in assign}
            missing = [k for k in KEY if k not in vals]
            lines.append({"y": by, "values": vals, "full": False, "filled": filled,
                          "missing": missing, "review": bool(filled or missing)})
        if not lines and not notes:
            continue
        out.append({"page": pg["page"], "label": " ".join(lab["spans"]), "y": lab["y0"],
                    "lines": lines, "notes": notes,
                    "review": any(l["review"] for l in lines) or not lines})

json.dump(out, open("/home/user/atb_rows.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
nb_lines = sum(len(r["lines"]) for r in out)
print(f"molécules : {len(out)} | lignes de schéma : {nb_lines}")
print(f"lignes marquées « à revoir » : {sum(1 for r in out for l in r['lines'] if l['review'])}")
print(f"molécules sans valeur (en-têtes de section) : {sum(1 for r in out if not r['lines'])}")
for r in out:
    for l in r["lines"]:
        if l["review"]:
            print(f"  ⚠ p{r['page']:2d} «{r['label'][:34]:34s}» ligne y={l['y']:.0f} comblement={l.get('filled')} manquants={l.get('missing')}")

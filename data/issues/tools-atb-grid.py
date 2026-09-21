# -*- coding: utf-8 -*-
"""قارئ جدول PDF بالخلايا: يبني كل خلية من حدودها المرسومة (متجهية) ثم يوزّع النصّ.
Lecteur de table PDF « par cellules » : une cellule existe si ses quatre bords sont de vrais
traits vectoriels. On énumère toutes les paires de niveaux (x0,x1)×(y0,y1), on garde les
cellules **maximales** — c'est ce qui reconstitue correctement les cellules fusionnées
(une même valeur couvre souvent plusieurs stades de DFG).
Sortie : /home/user/atb_cells.json + contrôle d'intégrité (chaque span texte attribué à 1 cellule).
"""
import json, sys
import pymupdf

PDF = sys.argv[1] if len(sys.argv) > 1 else "/home/user/uploads/20260427_ATB-et-IR_version-ETS_V23_260921_083056.pdf"
OUT = sys.argv[2] if len(sys.argv) > 2 else "/home/user/atb_cells.json"
TOL = 1.6
doc = pymupdf.open(PDF)

def page_lines(page):
    H, V = [], []
    for d in page.get_drawings():
        for it in d["items"]:
            if it[0] == "l":
                (x0, y0), (x1, y1) = it[1], it[2]
            elif it[0] == "re":
                r = it[1]; x0, y0, x1, y1 = r.x0, r.y0, r.x1, r.y1
            else:
                continue
            if abs(y0 - y1) <= 0.6 and abs(x1 - x0) > 2:
                H.append((min(y0, y1), min(x0, x1), max(x0, x1)))
            elif abs(x0 - x1) <= 0.6 and abs(y1 - y0) > 2:
                V.append((min(x0, x1), min(y0, y1), max(y0, y1)))
    return H, V

def cluster(vals):
    out = []
    for v in sorted(vals):
        if out and v - out[-1][-1] <= TOL:
            out[-1].append(v)
        else:
            out.append([v])
    return [sum(g) / len(g) for g in out]

def covers_h(H, y, x0, x1):
    return any(abs(yy - y) <= TOL and a <= x0 + TOL and b >= x1 - TOL for yy, a, b in H)

def covers_v(V, x, y0, y1):
    return any(abs(xx - x) <= TOL and a <= y0 + TOL and b >= y1 - TOL for xx, a, b in V)

def spans_of(page):
    res = []
    for blk in page.get_text("dict")["blocks"]:
        for ln in blk.get("lines", []):
            for sp in ln["spans"]:
                if sp["text"].strip():
                    f = sp["font"].lower()
                    res.append({"t": sp["text"].strip(), "x0": sp["bbox"][0], "x1": sp["bbox"][2],
                                "y0": sp["bbox"][1], "y1": sp["bbox"][3], "size": round(sp["size"], 1),
                                "italic": "italic" in f or "oblique" in f})
    return res

pages = []
for page in doc:
    sp = spans_of(page)
    if not any("Normorénal" in s["t"] for s in sp):
        pages.append({"page": page.number + 1, "cells": [], "skipped": True})
        continue
    H, V = page_lines(page)
    y_norm = min(s["y0"] for s in sp if "Normorénal" in s["t"])
    y_top = y_norm - 8
    y_bot = max((y for y, a, b in H if y > y_norm), default=y_norm + 300)
    xs = cluster([x for x, a, b in V if a <= y_bot and b >= y_top])
    ys = cluster([y for y, a, b in H if y_top <= y <= y_bot])
    # Une cellule réelle = rectangle dont les 4 bords sont des traits ET dont l'intérieur
    # n'est traversé par aucun trait (sinon elle est subdivisée : ce n'est pas une cellule).
    H_all = [h for h in H if y_norm - 8 <= h[0] <= y_bot + TOL]
    V_all = [v for v in V if v[1] <= y_bot + TOL and v[2] >= y_norm - 8]
    cells = []
    for i in range(len(xs) - 1):
        for j in range(len(ys) - 1):
            for i2 in range(i + 1, len(xs)):
                for j2 in range(j + 1, len(ys)):
                    x0, x1, y0, y1 = xs[i], xs[i2], ys[j], ys[j2]
                    if not (covers_h(H_all, y0, x0, x1) and covers_h(H_all, y1, x0, x1)
                            and covers_v(V_all, x0, y0, y1) and covers_v(V_all, x1, y0, y1)):
                        continue
                    crossed = any(y0 + TOL < yy < y1 - TOL and a <= x1 - TOL and b >= x0 + TOL
                                  for yy, a, b in H_all)
                    crossed = crossed or any(x0 + TOL < xx < x1 - TOL and a <= y1 - TOL and b >= y0 + TOL
                                             for xx, a, b in V_all)
                    if not crossed:
                        cells.append((x0, x1, y0, y1))
    out = []
    for x0, x1, y0, y1 in sorted(cells, key=lambda c: (c[2], c[0])):
        inside = [s for s in sp
                  if x0 - TOL <= (s["x0"] + s["x1"]) / 2 <= x1 + TOL and y0 - TOL <= (s["y0"] + s["y1"]) / 2 <= y1 + TOL]
        lines_y = sorted({round(s["y0"], 1) for s in inside})
        out.append({
            "x0": round(x0, 1), "x1": round(x1, 1), "y0": round(y0, 1), "y1": round(y1, 1),
            "t": " ".join(s["t"] for s in sorted(inside, key=lambda s: (round(s["y0"], 1), s["x0"]))),
            "size": (max(s["size"] for s in inside) if inside else None),
            "italic": (all(s["italic"] for s in inside) if inside else False),
            "nlines": len(lines_y),
            "spans": [s["t"] for s in sorted(inside, key=lambda s: (round(s["y0"], 1), s["x0"]))],
        })
    pages.append({"page": page.number + 1, "x_levels": [round(x, 1) for x in xs],
                  "y_levels": [round(y, 1) for y in ys], "cells": out})

json.dump(pages, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# ── contrôle : chaque span de la zone tableau doit tomber dans exactement une cellule ──
bad = 0
for page, res in zip(doc, pages):
    if res.get("skipped"):
        continue
    sp = spans_of(page)
    # on ne contrôle que la zone du corps du tableau (l'en-tête et la règle graduée 90…0
    # ne sont pas des cellules : ce sont des repères d'échelle)
    body_top = min(c["y0"] for c in res["cells"])
    body_bot = max(c["y1"] for c in res["cells"])
    for s in sp:
        cy = (s["y0"] + s["y1"]) / 2
        if cy < body_top - TOL or cy > body_bot + TOL:
            continue
        hits = [c for c in res["cells"] if c["x0"] - TOL <= (s["x0"] + s["x1"]) / 2 <= c["x1"] + TOL
                and c["y0"] - TOL <= cy <= c["y1"] + TOL]
        if len(hits) != 1:
            bad += 1
            if bad < 12:
                print(f"  ⚠ p{page.number+1} «{s['t'][:40]}» → {len(hits)} cellule(s)")
print(f"contrôle intégrité : {bad} span(s) hors ou en double")
print("cellules/page:", {r["page"]: len(r["cells"]) for r in pages})
print("lignes/page:", {r["page"]: len(r.get("y_levels", [])) - 1 for r in pages if not r.get("skipped")})

# -*- coding: utf-8 -*-
"""توليد data/atb-renal.ts من بيانات استخراج خلايا PDF وقواعد التصحيح المعلنة.
Génère data/atb-renal.ts à partir de l'extraction des cellules du PDF et de corrections explicites.
Les patchs documentent les ajustements de structure connus ; la reproduction du générateur vérifie
la cohérence technique, pas la justesse clinique ni la relecture visuelle de chaque cellule.
"""
import json, re, sys, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ISSUES_DIR = Path(__file__).resolve().parent
ROWS_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else ISSUES_DIR / "OMEDIT-ATB-IR-V2.3.rows.json"
PDF_PATH = Path(sys.argv[2]) if len(sys.argv) > 2 else ISSUES_DIR / "OMEDIT-ATB-IR-V2.3-avril2026.pdf"
OUT_PATH = Path(sys.argv[3]) if len(sys.argv) > 3 else ROOT / "data" / "atb-renal.ts"
AUDIT_JSON_PATH = Path(sys.argv[4]) if len(sys.argv) > 4 else None
ROWS = json.loads(ROWS_PATH.read_text(encoding="utf-8"))
KEY = ["normorenal", "legere", "moderee", "severe", "terminale"]
STAGE_LABELS = {
    "normorenal": ("normorénale (DFG ≥ 90)", "وظيفة كلوية طبيعية (DFG ≥ 90)"),
    "legere": ("IRC légère (DFG 89 → 60)", "قصور كلوي خفيف (DFG 89 → 60)"),
    "moderee": ("IRC modérée (DFG 59 → 30)", "قصور كلوي متوسط (DFG 59 → 30)"),
    "severe": ("IRC sévère (DFG 30 → 15)", "قصور كلوي شديد (DFG 30 → 15)"),
    "terminale": ("IRC terminale (DFG < 15)", "قصور كلوي نهائي (DFG < 15)"),
}
AMBIGUOUS_SOURCE_CELL = "Cellules source multiples — consulter la note; aucune dose unique retenue"

# ── 1. الأقسام / Sections ────────────────────────────────────────────────────────────────
SECTIONS_AR = {
    "Pénicillines +/- inhibiteurs de bêta-lactamases": "البنسلينات ± مثبّطات البيتا-لاكتاماز",
    "Monobactames": "المونوباكتامات",
    "Céphalosporines": "السيفالوسبورينات",
    "Carbapénèmes": "الكاربابينيمات",
    "Aminosides": "الأمينوغليكوزيدات",
    "Fluoroquinolones": "الكينولونات الفلورية",
    "Glycopeptides": "الغليكوببتيدات",
    "Imidazolés": "الإيميدازولات",
    "Macrolides, lincosamides, streptogramines": "الماكروليدات واللينكوزاميدات والستربتوغرامينات",
    "Sulfamides": "السلفاميدات",
    "Tétracyclines": "التتراسيكلينات",
    "Autres": "أخرى",
    "Antituberculeux": "مضادات السل",
}
SECTION_IDS = {
    "Pénicillines +/- inhibiteurs de bêta-lactamases": "penicillines",
    "Monobactames": "monobactames",
    "Céphalosporines": "cephalosporines",
    "Carbapénèmes": "carbapenemes",
    "Aminosides": "aminosides",
    "Fluoroquinolones": "fluoroquinolones",
    "Glycopeptides": "glycopeptides",
    "Imidazolés": "imidazoles",
    "Macrolides, lincosamides, streptogramines": "macrolides",
    "Sulfamides": "sulfamides",
    "Tétracyclines": "tetracyclines",
    "Autres": "autres",
    "Antituberculeux": "antituberculeux",
}

def section_headers():
    """En-têtes de section : repérés sur les spans de taille 12 (indépendant des bordures,
    car deux bandeaux du PDF n'ont pas de cadre complet)."""
    import pymupdf
    doc = pymupdf.open(str(PDF_PATH))
    out = []
    for page in doc:
        for blk in page.get_text("dict")["blocks"]:
            for ln in blk.get("lines", []):
                for sp in ln["spans"]:
                    t = sp["text"].strip()
                    if round(sp["size"], 1) < 12:
                        continue
                    for k in SECTIONS_AR:  # le bandeau peut préfixer (« Bêta-lactamines : … »)
                        if k in t:
                            out.append({"page": page.number + 1, "y": sp["bbox"][1], "fr": k})
                            break
    return out

HEADERS = sorted(section_headers(), key=lambda h: (h["page"], h["y"]))

# ── 2. patchs manuels / Corrections manuelles ────────────────────────────────────────────
MERGED_CELL_MARKER = "Cellule fusionnée — voir la note commune du tableau"

# Note éditoriale d'attribution, extérieure au PDF OMEDIT ; ne pas l'ajouter aux cellules de dose.
AMIKACINE_EDITORIAL_NOTE = {
    "fr": (
        "Cette entrée reproduit le tableau OMEDIT V2.3, dont les références sont arrêtées au 10/01/2024 ; "
        "elle ne doit pas être confondue avec la recommandation CA-SFM/SPILF/SFPT 2025 de 25–30 mg/kg/j "
        "chez l'adulte non obèse à fonction rénale normale, affichée séparément. Les colonnes sont en DFG "
        "(mL/min/1,73 m²), pas en ClCr Cockcroft–Gault. Vérifier le RCP du produit, l'indication, le TDM "
        "et le protocole local."
    ),
    "ar": (
        "هذا السطر من جدول OMEDIT V2.3 ذي المراجع المتوقفة عند 10/01/2024؛ لا تخلطه مع توصية "
        "CA-SFM/SPILF/SFPT لعام 2025 بجرعة 25–30 ملغ/كغ/يوم للبالغ غير البدين ذي الوظيفة الكلوية "
        "الطبيعية، المعروضة بشكل منفصل. أعمدة الجدول هي DFG (مل/د/1.73 م²) وليست ClCr بمعادلة "
        "Cockcroft–Gault. تحقّق من نشرة المنتج والاستطباب وقياس مستويات الدواء والبروتوكول المحلي."
    ),
}

PATCH = {
    # La colonne normorénale porte la posologie et deux mentions de la condition ≥120 ;
    # conserver la seconde en note propre à cette étape, sans créer une seconde ligne de dose.
    "Céfidérocol IV": {
        "lines": [["2 g/8h si fonction rénale ≥ 120 mL/min : 2 g/6h", "2 g/8h", "1,5 g/8h", "1 g/8h", "0,75 g/12h"]],
        "extra_notes": [{"fr": "Si fonction rénale ≥ 120 mL/min : 2 g/6h", "stages": ["normorenal"]}],
    },
    # Relecture visuelle p.7 : le chiffre n'apparaît que dans la colonne normorénale ;
    # les quatre colonnes d'IRC forment une cellule fusionnée avec la note commune. Cette note
    # ne doit donc pas apparaître dans le stade normorénal. Ne pas propager mg/kg/j ni inventer
    # une fréquence en IRC ; baliser les cellules et borner la note aux quatre stades d'IRC.
    "Amikacine IV": {
        "lines": [["15 à 30 mg/kg/j", *([MERGED_CELL_MARKER] * 4)]],
        "group": "aminosides",
        "editorial_notes": [AMIKACINE_EDITORIAL_NOTE],
    },
    "Gentamicine IM IV": {"lines": [["3 à 8 mg/kg/j", *([MERGED_CELL_MARKER] * 4)]], "group": "aminosides"},
    "Tobramycine IM IV": {"lines": [["3 à 8 mg/kg/j", *([MERGED_CELL_MARKER] * 4)]], "group": "aminosides"},
    # La première cellule est fusionnée sur les cinq stades ; seule la seconde ligne porte
    # ½ dose en sévère et ¼ dose en terminale. Ne pas propager cette réduction à la cystite.
    "Aztréonam IM": {"lines": [
        ["Cystite aiguë ou infection gonococcique non compliquée : 1 g dose unique"] * 5,
        ["Infection urinaire haute et/ou compliquée : 1 g/12h", "Infection urinaire haute et/ou compliquée : 1 g/12h", "Infection urinaire haute et/ou compliquée : 1 g/12h", "½ dose", "¼ dose"],
    ]},
    "Aztréonam IV": {"lines": [
        ["Infection peu sévère : DC de 2 g puis 1 à 2 g/8h", "Infection peu sévère : DC de 2 g puis 1 à 2 g/8h", "Infection peu sévère : DC de 2 g puis 1 à 2 g/8h", "DC de 2 g puis 500 mg à 1 g/8h", "DC de 2 g puis 250 à 500 mg/8h"],
        ["Infection sévère : 2 g/6h ou 8 g/24h en continue", "Infection sévère : 2 g/6h ou 8 g/24h en continue", "Infection sévère : 2 g/6h ou 8 g/24h en continue", "DC de 2 g puis 1 g/6h ou 4 g/24h en continue", "DC de 2 g puis 500 mg/6h ou 2 g/24h en continue"],
    ]},
    "Ceftolozane + tazobactam IV": {"lines": [
        ["1 g/8h en perfusion de 60 min", "1 g/8h en perfusion de 60 min", "500 mg/8h", "250 mg /8h", "DC de 500 mg puis 8h plus tard 100 mg/8h"],
        ["Si pneumonie nosocomiale : 2 g/8h en perfusion de 60 min", "Si pneumonie nosocomiale : 2 g/8h en perfusion de 60 min", "1 g/8h", "500 mg/8h", "DC 1500 mg puis 8h plus tard 300 mg/8h"],
    ]},
    # la cellule couvre tous les stades : c'est une consigne, pas une dose par stade
    "Ceftriaxone IM IV": {"info": [["Infection modérée : 1 à 2 g/24h — Infection sévère : 2 à 4 g/24h — Si infection neuroméningée : 75 à 100 mg/kg/24h ; Aucune donnée chez l'insuffisant rénal"]]},
    # La surveillance des fortes doses est une consigne clinique (pas une posologie) :
    # la déplacer dans notes, sans la supprimer.
    "Méropénem IV": {"move_lines_containing_to_notes": ["monitorage pharmacologique"]},
    # L'extraction des exposants « 2ème/3ème » sur la p.12 désordonne les spans ;
    # recopier ici le texte lu dans la cellule (sans altérer la consigne de prise).
    "Rifampicine IV PO": {"source_text_correction": True, "lines": [
        ["Tuberculose : 8 à 12 mg/kg/24h"] * 5,
        [
            "Infection à germes gram + ou - : 20 à 30 mg/kg/24h",
            "Infection à germes gram + ou - : 20 à 30 mg/kg/24h",
            "espacer les prises si besoin selon rifampicémie du 2ᵉ ou 3ᵉ jour du traitement",
            "espacement des prises indispensable",
            "espacement des prises indispensable",
        ],
    ]},
}

SUPERSCRIPT = {"2me": "2ᵉ", "3me": "3ᵉ"}

def clean(t):
    t = t.replace("’", "'").replace("  ", " ")
    for k, v in SUPERSCRIPT.items():
        t = t.replace(k, v)
    return re.sub(r"\s+", " ", t).strip()

def slug(fr):
    s = unicodedata.normalize("NFD", fr.lower())
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

# noms arabes / noms arabes des molécules
AR_NAMES = {
 "Amoxicilline PO": "أموكسيسيلين فموي", "Amoxicilline IV": "أموكسيسيلين وريدي",
 "Amoxicilline + acide clavulanique PO": "أموكسيسيلين + حمض الكلافولانيك فموي",
 "Amoxicilline + acide clavulanique IV": "أموكسيسيلين + حمض الكلافولانيك وريدي",
 "Ampicilline + Sulbactam IV": "أمبيسيلين + سولباكتام وريدي", "Ampicilline + Sulbactam IM": "أمبيسيلين + سولباكتام عضلي",
 "Benzathine benzylpenicilline IM": "بنزاثين بنزيل بنسلين عضلي", "Benzylpenicilline sodique IM ou IV": "بنزيل بنسلين صودي عضلي أو وريدي",
 "Cloxacilline PO": "كلوكساسيلين فموي", "Cloxacilline IV": "كلوكساسيلين وريدي", "Oxacilline IV": "أوكساسيلين وريدي",
 "Phénoxyméthyl- -pénicilline PO": "فينوكسي ميثيل بنسلين فموي", "Pipéracilline IV": "بيبراسيلين وريدي",
 "Pipéracilline + tazobactam IV": "بيبراسيلين + تازوباكتام وريدي", "Pivmécillinam PO": "بيفميسيلينام فموي",
 "Témocilline IV": "تيموسيلين وريدي", "Aztréonam IM": "أزتريونام عضلي", "Aztréonam IV": "أزتريونام وريدي",
 "Céfaclor PO": "سيفاكلور فموي", "Céfadroxil PO": "سيفادروكسيل فموي", "Céfalexine PO": "سيفالكسين فموي",
 "Céfazoline IM IV": "سيفازولين عضلي/وريدي", "Céfépime IV (*IM possible)": "سيفيبيم وريدي", "Céfidérocol IV": "سيفيديروكول وريدي",
 "Céfixime PO": "سيفيكسيم فموي", "Céfotaxime IM IV": "سيفوتاكسيم عضلي/وريدي", "Céfoxitine IV": "سيفوكسيتين وريدي",
 "Cefpodoxime (proxetil) PO": "سيفبودوكسيم فموي", "Ceftaroline (fosamil) IV": "سيفتارولين وريدي",
 "Ceftazidime IM IV": "سيفتازيديم عضلي/وريدي", "Ceftazidime + avibactam IV": "سيفتازيديم + أفباكتام وريدي",
 "Ceftobiprole IV": "سيفتوبيبرول وريدي", "Ceftolozane + tazobactam IV": "سيفتولوزان + تازوباكتام وريدي",
 "Ceftriaxone IM IV": "سيفترياكسون عضلي/وريدي", "Cefuroxime (axétil) PO": "سيفوروكسيم أكسيتيل فموي",
 "Cefuroxime IV": "سيفوروكسيم وريدي", "Ertapénem IV": "إرتابينيم وريدي",
 "Imipénem + cilastatine IV": "إيميبينيم + سيلاستاتين وريدي",
 "Imipénem + cilastatine + relebactam IV": "إيميبينيم + سيلاستاتين + ريليبكتام وريدي",
 "Méropénem IV": "ميروبينيم وريدي", "Méropénem + vaborbactam IV (ATB de réserve)": "ميروبينيم + فابورباكتام وريدي",
 "Amikacine IV": "أميكاسين وريدي", "Gentamicine IM IV": "جنتاميسين عضلي/وريدي", "Tobramycine IM IV": "توبراميسين عضلي/وريدي",
 "Ciprofloxacine PO": "سيبروفلوكساسين فموي", "Ciprofloxacine IV": "سيبروفلوكساسين وريدي",
 "Délafloxacine PO": "ديلافلوكساسين فموي", "Délafloxacine IV": "ديلافلوكساسين وريدي",
 "Lévofloxacine IV PO": "ليفوفلوكساسين وريدي/فموي", "Moxifloxacine IV PO": "موكسيفلوكساسين وريدي/فموي",
 "Norfloxacine PO": "نورفلوكساسين فموي", "Ofloxacine IV PO": "أوفلوكساسين وريدي/فموي",
 "Dalbavancine IV": "دالبافانسين وريدي", "Oritavancine IV": "أوريتافانسين وريدي",
 "Teicoplanine IM IV": "تيكوبلانين عضلي/وريدي", "Teicoplanine PO": "تيكوبلانين فموي",
 "Vancomycine IV": "فانكومايسين وريدي", "Vancomycine PO": "فانكومايسين فموي",
 "Métronidazole PO": "ميترونيدازول فموي", "Métronidazole IV": "ميترونيدازول وريدي",
 "Ornidazole IV PO": "أورنيدازول وريدي/فموي", "Azithromycine PO": "أزيثرومايسين فموي",
 "Clarithromycine PO": "كلاريثرومايسين فموي", "Clarithromycine IV": "كلاريثرومايسين وريدي",
 "Clindamycine IV PO": "كليندامايسين وريدي/فموي", "Erythromycine IV PO": "إريثرومايسين وريدي/فموي",
 "Pristinamycine PO": "بريستيناميسين فموي", "Roxithromycine PO": "روكسيثروميسين فموي",
 "Spiramycine IV PO": "سبيرامايسين وريدي/فموي",
 "Spiramycine + Métronidazole PO": "سبيرامايسين + ميترونيدازول فموي",
 "Cotrimoxazole IV PO": "كوتريموكسازول وريدي/فموي", "Sulfadiazine PO": "سلفاديازين فموي",
 "Triméthoprime PO": "تريميثوبريم فموي", "Doxycycline IV PO": "دوكسيسيكلين وريدي/فموي",
 "Lymecycline PO": "لايميسيكلين فموي", "Minocycline PO": "مينوسيكلين فموي", "Tigécycline IV": "تيجيسيكلين وريدي",
 "Acide Fusidique IV PO": "حمض الفوسيديك وريدي/فموي",
 "Colistine IV (Colistiméthate sodique)": "كوليستين وريدي (كوليستيميثات الصوديوم)",
 "Daptomycine IV": "دابتوميسين وريدي", "Fidaxomicine PO": "فيداكسوميسين فموي",
 "Fosfomycine trométamol PO": "فوسفوميسين ترويتمول فموي", "Fosfomycine IV": "فوسفوميسين وريدي",
 "Linezolide IV PO": "لينيزوليد وريدي/فموي", "Nitrofurantoïne PO": "نيتروفورانتوين فموي",
 "Tédizolide PO": "تيديزوليد فموي", "Bédaquiline PO": "بيداكويلين فموي", "Delamanide PO": "ديلامانيد فموي",
 "Ethambutol M IV PO": "إيثامبوتول فموي/وريدي/عضلي", "Isoniazide IM IV PO": "إيزونيازيد فموي/وريدي/عضلي",
 "Pyrazinamide PO": "بيرازيناميد فموي", "Rifabutine PO": "ريفابوتين فموي", "Rifampicine IV PO": "ريفامبيسين وريدي/فموي",
}

NOTES_AR = {
 "Si fonction rénale ≥ 120 mL/min : 2 g/6h": "إذا كان الترشيح الكلوي ≥ 120 مل/دقيقة: 2 غ كل 6 ساعات",
 "Posologies exprimées en g d'amoxicilline": "الجرعات معبَّر عنها بغرامات الأموكسيسيلين",
 "Posologies exprimées en g d'amoxicilline ; /!\\ acide clavulanique : dose max 200 mg/injection et 1200 mg/24h": "الجرعات معبَّر عنها بغرامات الأموكسيسيلين؛ تنبيه: حدّ حمض الكلافولانيك 200 مغ/حقنة و1200 مغ/24 سا",
 "Posologies exprimées en g d'ampicilline": "الجرعات معبَّر عنها بغرامات الأمبيسيلين",
 "Posologies exprimées en mg d'Imipénem": "الجرعات معبَّر عنها بمغ الإيميبينيم",
 "Posologies exprimées en g de pipéracilline": "الجرعات معبَّر عنها بغرامات البيبراسيلين",
 "Posologies exprimées en g de ceftazidime": "الجرعات معبَّر عنها بغرامات السيفتازيديم",
 "Posologies exprimées en g de ceftolozane": "الجرعات معبَّر عنها بغرامات السيفتولوزان",
 "Posologies exprimées en g de meropenem": "الجرعات معبَّر عنها بغرامات الميروبينيم",
 "Si posologie élevée (> 6 g/24h) : monitorage pharmacologique": "عند الجرعات العالية (> 6 غ/24 سا): تُجرى مراقبة علاجية لتركيز الدواء.",
}
AMINOSIDES_NOTE = ("En cas de situation clinique justifiant l'administration, la posologie unitaire ne doit pas être diminuée. "
                   "Dans la majorité des cas, une injection unique suffit. Si plusieurs injections sont nécessaires, il est "
                   "indispensable de réaliser des dosages du résiduel et d'espacer les doses.")
AMINOSIDES_NOTE_AR = ("إذا استدعى الوضع السريري الإعطاء فلا تُخفَّض الجرعة الواحدية. في معظم الحالات تكفي حقنة واحدة؛ "
                      "وإذا تكرّرت الحقن فلا بدّ من معايرة المستوى المتبقّي وتباعد الجرعات.")

# ── 3. بناء الصفوف ───────────────────────────────────────────────────────────────────────
def section_of(page, y):
    """Une section se poursuit sur les pages suivantes (le bandeau n'est pas répété) :
    on retient le dernier bandeau rencontré dans l'ordre de lecture, toutes pages confondues."""
    cands = [h for h in HEADERS if (h["page"], h["y"]) < (page, y - 1)]
    return cands[-1]["fr"] if cands else "Autres"

out_rows, seen_ids = [], {}
for r in ROWS:
    label = clean(r["label"])
    sec_fr = section_of(r["page"], r["y"])
    patch = PATCH.get(label, {})
    lines = []
    if "lines" in patch:
        for vals in patch["lines"]:
            lines.append({"kind": "dose", "d": [clean(v) for v in vals]})
    elif "info" in patch:
        for vals in patch["info"]:
            lines.append({"kind": "info", "d": [clean(vals[0])] * 5})
    else:
        for l in r["lines"]:
            vals = [clean(l["values"].get(k, "")) for k in KEY]
            for stage in l.get("ambiguous_stages", []):
                vals[KEY.index(stage)] = AMBIGUOUS_SOURCE_CELL
            if not all(vals):
                continue
            if any("monitorage pharmacologique" in v for v in vals) or (len(set(vals)) == 1 and re.match(r"^(Si |En cas |Dans la majorité|Traitement|Selon indication)", vals[0])):
                lines.append({"kind": "info", "d": [vals[0]] * 5})
            else:
                lines.append({"kind": "dose", "d": vals})
    # Une grande tranche de DFG peut recouvrir plusieurs cellules avec des textes distincts.
    # Garder toutes les chaînes source, mais ne sélectionner aucune dose unique dans cette tranche.
    ambiguity_by_stage = {}
    unselected_source_phrases = []
    for source_line in r.get("lines", []):
        cells_by_id = {cell["id"]: cell["text"] for cell in source_line.get("source_cells", [])}
        for stage in source_line.get("ambiguous_stages", []):
            bucket = ambiguity_by_stage.setdefault(stage, [])
            for cell_id in source_line.get("stage_cells", {}).get(stage, []):
                phrase = clean(cells_by_id.get(cell_id, ""))
                if phrase and phrase not in bucket:
                    bucket.append(phrase)
        for cell_id in source_line.get("unselected_cell_ids", []):
            phrase = clean(cells_by_id.get(cell_id, ""))
            already_in_stage_note = any(phrase in phrases for phrases in ambiguity_by_stage.values())
            if phrase and not already_in_stage_note and phrase not in unselected_source_phrases:
                unselected_source_phrases.append(phrase)
    unselected_source_phrases = [
        phrase for phrase in unselected_source_phrases
        if not any(phrase in phrases for phrases in ambiguity_by_stage.values())
    ]
    notes = []
    for marker in patch.get("move_lines_containing_to_notes", []):
        moved = [line for line in lines if marker in line["d"][0]]
        lines = [line for line in lines if marker not in line["d"][0]]
        for line in moved:
            phrase = line["d"][0]
            notes.append({"fr": phrase, "ar": NOTES_AR.get(phrase, "")})
    if not lines:
        continue
    for n in r["notes"]:
        n = clean(n)
        notes.append({"fr": n, "ar": NOTES_AR.get(n, "")})
    for stage in KEY:
        source_phrases = ambiguity_by_stage.get(stage, [])
        if not source_phrases:
            continue
        stage_index = KEY.index(stage)
        stage_fr, stage_ar = STAGE_LABELS[stage]
        for line in lines:
            if line["kind"] == "dose":
                line["d"][stage_index] = AMBIGUOUS_SOURCE_CELL
        notes.append({
            "fr": f"Plusieurs cellules distinctes du tableau source dans {stage_fr} : {' | '.join(source_phrases)}. Aucune posologie unique n'a été sélectionnée.",
            "ar": f"توجد خلايا مختلفة في الجدول المصدر ضمن {stage_ar}: {' | '.join(source_phrases)}. لم تُختَر جرعة واحدة آليًا.",
            "stages": [stage],
        })
    if unselected_source_phrases:
        phrases = " | ".join(unselected_source_phrases)
        notes.append({
            "fr": f"Texte(s) de cellule(s) source non retenu(s) par la projection géométrique (p.{r['page']}) : {phrases}. Aucun stade DFG n'est attribué automatiquement à ce texte; vérifier le PDF.",
            "ar": f"نص خلية مصدرية لم يختره الإسقاط الهندسي (ص.{r['page']}): {phrases}. لم يُنسب تلقائيًا إلى مرحلة DFG؛ راجع ملف PDF.",
        })
    for extra in patch.get("extra_notes", []):
        if isinstance(extra, str):
            extra = {"fr": extra}
        phrase = clean(extra["fr"])
        item = {"fr": phrase, "ar": NOTES_AR.get(phrase, "")}
        if extra.get("stages"):
            item["stages"] = extra["stages"]
        notes.append(item)
    if patch.get("group") == "aminosides":
        notes.append({
            "fr": AMINOSIDES_NOTE,
            "ar": AMINOSIDES_NOTE_AR,
            "stages": ["legere", "moderee", "severe", "terminale"],
        })
    for editorial in patch.get("editorial_notes", []):
        phrase = clean(editorial["fr"])
        item = {"fr": phrase, "ar": editorial["ar"]}
        if editorial.get("stages"):
            item["stages"] = editorial["stages"]
        notes.append(item)
    ar = AR_NAMES.get(label, "")
    assert ar, f"nom arabe manquant : {label}"
    sid = slug(label)
    seen_ids[sid] = seen_ids.get(sid, 0) + 1
    if seen_ids[sid] > 1:
        sid = f"{sid}-{seen_ids[sid]}"
    out_rows.append({"id": sid, "fr": label, "ar": ar, "section": SECTION_IDS[sec_fr], "page": r["page"],
                     "lines": lines, "notes": [n for n in notes if n.get("fr")],
                     "audit": {
                         "source_review": bool(r.get("review")),
                         "source_line_review": [i for i, line in enumerate(r.get("lines", []), 1) if line.get("review")],
                         "source_y": [line.get("y") for line in r.get("lines", [])],
                         "source_ambiguous_stages": [stage for stage in KEY if any(stage in line.get("ambiguous_stages", []) for line in r.get("lines", []))],
                         "source_unselected_cells": [
                             {"line": i, "cells": line.get("unselected_cell_ids", [])}
                             for i, line in enumerate(r.get("lines", []), 1)
                             if line.get("unselected_cell_ids")
                         ],
                         "patch_keys": sorted(patch.keys()),
                     }})

# ── 4. كتابة الملف / Écriture du fichier TS ──────────────────────────────────────────────
def ts_lines():
    yield '// ⚕️ تكييف المضادات الحيوية مع الوظيفة الكلوية — بيانات مستندة إلى الجدول مع توثيق التعديلات البنيوية.'
    yield '// Antibiotiques et insuffisance rénale — données dérivées de l\'extraction du tableau de référence :'
    yield '//   « Adaptation des antibiotiques à la fonction rénale », OMEDIT Pays de la Loire, V2.3 (avril 2026),'
    yield '//   données sources RCP / GPR (SPILF–SFPT–CA-SFM juin 2023) / ePOPI, arrêtées au 10/01/2024.'
    yield '//'
    yield '// ⚠️ Adultes NON dialysés, selon le DFG (mL/min/1,73 m²). Les chaînes FR proviennent du PDF ; les'
    yield '//    corrections de structure/notes sont listées dans PATCH. Les noms et notes AR sont des traductions éditoriales.'
    yield '//    ⚠️ La génération ne prouve ni fidélité cellule par cellule ni validation clinique indépendante.'
    yield '//'
    yield '// منهج النقل: حُفظت خلايا PDF وإحداثياتها؛ إذا تقاطعت المرحلة مع نصوص خلايا مختلفة فلا تُختار جرعة، وتُعرض النصوص في ملاحظة مقيّدة بالمرحلة.'
    yield '// الصفوف المستكملة هندسياً والخلايا غير المختارة موسومة للمراجعة؛ الاستثناءات النصية/البنيوية موثقة في PATCH.'
    yield '// لا يستنتج الإسقاط حدود DFG سريرية، ولا يثبت التوليد أو الفحص البنيوي صحة الجرعات.'
    yield ''
    yield 'export type AtbStageId = "normorenal" | "legere" | "moderee" | "severe" | "terminale";'
    yield ''
    yield 'export interface AtbRenalStage {'
    yield '  id: AtbStageId;'
    yield '  fr: string;'
    yield '  ar: string;'
    yield '  dgf: string;        // borne de DFG affichée dans l\'en-tête du tableau'
    yield '}'
    yield ''
    yield '/** المراحل الخمس — الترتيب هو نفسه ترتيب القيم في كل سطر (d[0] … d[4]). */'
    yield 'export const ATB_RENAL_STAGES: AtbRenalStage[] = ['
    yield '  { id: "normorenal", fr: "Normorénal", ar: "وظيفة كلوية طبيعية", dgf: "≥ 90" },'
    yield '  { id: "legere", fr: "IRC légère", ar: "قصور كلوي خفيف", dgf: "89 → 60" },'
    yield '  { id: "moderee", fr: "IRC modérée", ar: "قصور كلوي متوسط", dgf: "59 → 30" },'
    yield '  { id: "severe", fr: "IRC sévère", ar: "قصور كلوي شديد", dgf: "30 → 15" },'
    yield '  { id: "terminale", fr: "IRC terminale", ar: "قصور كلوي نهائي", dgf: "< 15" },'
    yield '];'
    yield ''
    yield 'export interface AtbRenalSection { id: string; fr: string; ar: string }'
    yield ''
    yield 'export const ATB_RENAL_SECTIONS: AtbRenalSection[] = ['
    for fr, ar in SECTIONS_AR.items():
        yield f'  {{ id: "{SECTION_IDS[fr]}", fr: "{fr}", ar: "{ar}" }},'
    yield '];'
    yield ''
    yield 'export interface AtbRenalLine {'
    yield '  /** "dose" = schéma posologique ; "info" = consigne/limite valable pour tous les stades. */'
    yield '  kind: "dose" | "info";'
    yield '  /** القيم بترتيب ATB_RENAL_STAGES — d[0] للمرحلة الطبيعية … d[4] للمرحلة النهائية. */'
    yield '  d: [string, string, string, string, string];'
    yield '}'
    yield ''
    yield 'export interface AtbRenalRow {'
    yield '  id: string;'
    yield '  fr: string;'
    yield '  ar: string;'
    yield '  section: string;'
    yield '  /** رقم الصفحة في الملف المصدر (للتحقق اليدوي السريع). */'
    yield '  page: number;'
    yield '  lines: AtbRenalLine[];'
    yield '  notes: { fr: string; ar: string; stages?: AtbStageId[] }[];'
    yield '}'
    yield ''
    yield '/** 93 سطرًا: كل تركيبة (جزيئة × طريق إعطاء) كما في الجدول المصدر. */'
    yield 'export const ATB_RENAL_ROWS: AtbRenalRow[] = ['
    for row in out_rows:
        yield '  {'
        yield f'    id: "{row["id"]}",'
        yield f'    fr: "{row["fr"]}",'
        yield f'    ar: "{row["ar"]}",'
        yield f'    section: "{row["section"]}",'
        yield f'    page: {row["page"]},'
        yield '    lines: ['
        for l in row["lines"]:
            d = ", ".join(json.dumps(v, ensure_ascii=False) for v in l["d"])
            yield f'      {{ kind: "{l["kind"]}", d: [{d}] }},'
        yield '    ],'
        if row["notes"]:
            yield '    notes: ['
            for n in row["notes"]:
                stages = f', stages: {json.dumps(n["stages"], ensure_ascii=False)}' if n.get("stages") else ""
                yield f'      {{ fr: {json.dumps(n["fr"], ensure_ascii=False)}, ar: {json.dumps(n["ar"], ensure_ascii=False)}{stages} }},'
            yield '    ],'
        else:
            yield '    notes: [],'
        yield '  },'
    yield '];'
    yield ''
    yield '/** فهرس سريع بالمعرّف — يخدم البحث والتنقّل دون مسح المصفوفة كاملة في كل مرة. */'
    yield 'export const ATB_RENAL_BY_ID: Record<string, AtbRenalRow> = Object.fromEntries('
    yield '  ATB_RENAL_ROWS.map((r) => [r.id, r]),'
    yield ');'

src = "\n".join(ts_lines()) + "\n"
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
OUT_PATH.write_text(src, encoding="utf-8")
if AUDIT_JSON_PATH:
    AUDIT_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    AUDIT_JSON_PATH.write_text(json.dumps(out_rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"data/atb-renal.ts : {len(out_rows)} molécules, {sum(len(r['lines']) for r in out_rows)} lignes de schéma")
print(f"sections utilisées : {sorted({r['section'] for r in out_rows})}")
print(f"notes : {sum(len(r['notes']) for r in out_rows)}")

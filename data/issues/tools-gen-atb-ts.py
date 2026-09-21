# -*- coding: utf-8 -*-
"""توليد data/atb-renal.ts من الاستخراج المُتحقَّق منه (tools/atb_rows.py + مراجعة بصرية للصفحات 12).
Génère data/atb-renal.ts à partir de l'extraction vérifiée cellule par cellule.
Les corrections manuelles (patchs) sont listées ci-dessous : ce sont les seules lignes où le PDF
source est mal aligné (les boîtes ne suivent pas les colonnes) — elles ont été relues sur l'image.
"""
import json, re, unicodedata

ROWS = json.load(open("/home/user/atb_rows.json"))
CELLS = json.load(open("/home/user/atb_cells.json"))
KEY = ["normorenal", "legere", "moderee", "severe", "terminale"]

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
    doc = pymupdf.open("/home/user/uploads/20260427_ATB-et-IR_version-ETS_V23_260921_083056.pdf")
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
PATCH = {
    # source : la colonne « normorénal » contient deux consignes (dont une répétition) ;
    # valeur retenue = 2 g/8h avec majoration si DFG ≥ 120.
    "Céfidérocol IV": {
        "lines": [["2 g/8h si fonction rénale ≥ 120 mL/min : 2 g/6h", "2 g/8h", "1,5 g/8h", "1 g/8h", "0,75 g/12h"]],
    },
    # le bandeau « aminosides » couvre les trois molécules : la dose unitaire ne change pas,
    # seuls les dosages/intervalle s'adaptent (texte du PDF déplacé en note).
    "Amikacine IV": {"lines": [["15 à 30 mg/kg/j"] * 5], "group": "aminosides"},
    "Gentamicine IM IV": {"lines": [["3 à 8 mg/kg/j"] * 5], "group": "aminosides"},
    "Tobramycine IM IV": {"lines": [["3 à 8 mg/kg/j"] * 5], "group": "aminosides"},
    # deux bandes fusionnées par le PDF (la case « sévère/terminale » couvre les deux lignes)
    "Aztréonam IM": {"lines": [
        ["Cystite aiguë ou infection gonococcique non compliquée : 1 g dose unique", "Cystite aiguë ou infection gonococcique non compliquée : 1 g dose unique", "Cystite aiguë ou infection gonococcique non compliquée : 1 g dose unique", "½ dose", "¼ dose"],
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
    "Ceftriaxone IM IV": {"info": [["Infection modérée : 1 à 2 g/24h — Infection sévère : 2 à 4 g/24h — Si infection neuroméningée : 75 à 100 mg/kg/24h ; « Aucune donnée chez l'insuffisant rénal »"]]},
    "Méropénem IV": {"drop_lines_containing": ["monitorage pharmacologique"]},
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
 "Posologies exprimées en g d'amoxicilline": "الجرعات معبَّر عنها بغرامات الأموكسيسيلين",
 "Posologies exprimées en g d'amoxicilline ; /!\\ acide clavulanique : dose max 200 mg/injection et 1200 mg/24h": "الجرعات معبَّر عنها بغرامات الأموكسيسيلين؛ تنبيه: حدّ حمض الكلافولانيك 200 مغ/حقنة و1200 مغ/24 سا",
 "Posologies exprimées en g d'ampicilline": "الجرعات معبَّر عنها بغرامات الأمبيسيلين",
 "Posologies exprimées en mg d'Imipénem": "الجرعات معبَّر عنها بمغ الإيميبينيم",
 "Posologies exprimées en g de pipéracilline": "الجرعات معبَّر عنها بغرامات البيبراسيلين",
 "Posologies exprimées en g de ceftazidime": "الجرعات معبَّر عنها بغرامات السيفتازيديم",
 "Posologies exprimées en g de ceftolozane": "الجرعات معبَّر عنها بغرامات السيفتولوزان",
 "Posologies exprimées en g de meropenem": "الجرعات معبَّر عنها بغرامات الميروبينيم",
}
AMINOSIDES_NOTE = ("En cas de situation clinique justifiant l'administration, la posologie unitaire ne doit pas être diminuée. "
                   "Dans la majorité des cas, une injection unique suffit. Si plusieurs injections sont nécessaires, il est "
                   "indispensable de réaliser des dosages du résiduel et d'espacer les doses.")
AMINOSIDES_NOTE_AR = ("إذا استدعى الوضع السريري الإعطاء فلا تُخفَّض الجرعة الواحدية. في معظم الحالات تكفي حقنة واحدة يوميًا؛ "
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
            if not all(vals):
                continue
            if any("monitorage pharmacologique" in v for v in vals) or (len(set(vals)) == 1 and re.match(r"^(Si |En cas |Dans la majorité|Traitement|Selon indication)", vals[0])):
                lines.append({"kind": "info", "d": [vals[0]] * 5})
            else:
                lines.append({"kind": "dose", "d": vals})
    for dl in patch.get("drop_lines_containing", []):
        lines = [l for l in lines if dl not in l["d"][0]]
    if not lines:
        continue
    notes = []
    for n in r["notes"]:
        n = clean(n)
        notes.append({"fr": n, "ar": NOTES_AR.get(n, "")})
    if patch.get("group") == "aminosides":
        notes.append({"fr": AMINOSIDES_NOTE, "ar": AMINOSIDES_NOTE_AR})
    ar = AR_NAMES.get(label, "")
    assert ar, f"nom arabe manquant : {label}"
    sid = slug(label)
    seen_ids[sid] = seen_ids.get(sid, 0) + 1
    if seen_ids[sid] > 1:
        sid = f"{sid}-{seen_ids[sid]}"
    out_rows.append({"id": sid, "fr": label, "ar": ar, "section": SECTION_IDS[sec_fr], "page": r["page"],
                     "lines": lines, "notes": [n for n in notes if n.get("fr")]})

# ── 4. كتابة الملف / Écriture du fichier TS ──────────────────────────────────────────────
def ts_lines():
    yield '// ⚕️ تكييف المضادات الحيوية مع الوظيفة الكلوية — بيانات مستخرجة حرفيًا من الجدول المرجعي.'
    yield '// Antibiotiques et insuffisance rénale — données extraites à l\'identique du tableau de référence :'
    yield '//   « Adaptation des antibiotiques à la fonction rénale », OMEDIT Pays de la Loire, V2.3 (avril 2026),'
    yield '//   données sources RCP / GPR (SPILF–SFPT–CA-SFM juin 2023) / ePOPI, arrêtées au 10/01/2024.'
    yield '//'
    yield '// ⚠️ Adultes NON dialysés, selon le DFG (mL/min/1,73 m²). Le contenu français est reproduit mot pour mot'
    yield '//    (jamais paraphrasé : une dose se recopie, elle ne se traduit pas) ; l\'interface est bilingue.'
    yield '//    ⚠️ À faire valider par un médecin/pharmacien tunisien avant usage clinique.'
    yield '//'
    yield '// طريقة الاستخراج: قُرئت حدود الخلايا المتجهية من ملف PDF ثم رُتّبت القيم في أعمدة المراحل الخمس،'
    yield '// ثم راجعنا الصفحات الاثنتي عشرة بصريًا سطرًا سطرًا. البنود التي كان فيها الجدول المصدر غير محاذٍ'
    yield '// هندسيًا صُحّحت يدويًا (انظر tools/gen_atb_ts.py) ولا تحمل أي قيمة مُخمَّنة.'
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
    yield '  notes: { fr: string; ar: string }[];'
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
                yield f'      {{ fr: {json.dumps(n["fr"], ensure_ascii=False)}, ar: {json.dumps(n["ar"], ensure_ascii=False)} }},'
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
open("/home/user/espace_urgence/data/atb-renal.ts", "w", encoding="utf-8").write(src)
print(f"data/atb-renal.ts : {len(out_rows)} molécules, {sum(len(r['lines']) for r in out_rows)} lignes de schéma")
print(f"sections utilisées : {sorted({r['section'] for r in out_rows})}")
print(f"notes : {sum(len(r['notes']) for r in out_rows)}")

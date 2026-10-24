// v18.0 — اختبارات حاسبة «المضادات الحيوية والوظيفة الكلوية»: سلامة المعطيات + محرّك الحساب.
// Tests du calculateur antibiotiques & fonction rénale : intégrité des données (93 lignes × 5
// stades, valeurs recoupées avec le tableau source) et moteur de calcul (poids, Cockcroft-Gault).
import { describe, expect, it } from "vitest";
import {
  calculateWeightDose,
  cockcroftGault,
  isAmbiguousSourceCells,
  isContraindicated,
  isDiscouraged,
  isAmbiguousAtbDfgBoundary,
  isFixedOnly,
  isMergedSourceCell,
  isNoData,
  parseWeightDoses,
  requiresSourceCheck,
  stageFromDfg,
  STAGE_ORDER,
  toMgDl,
  weightDoseText,
} from "@/lib/atb-dose";
import { ATB_RENAL_BY_ID, ATB_RENAL_ROWS, ATB_RENAL_SECTIONS, ATB_RENAL_STAGES } from "@/data/atb-renal";
import { chooseStage } from "@/lib/renal-clearance";

// ── سلامة المعطيات / Intégrité du jeu de données ────────────────────────────────────────────
describe("atb-renal : dataset", () => {
  it("93 molécules, 5 stades et 13 sections", () => {
    expect(ATB_RENAL_ROWS).toHaveLength(93);
    expect(ATB_RENAL_STAGES).toHaveLength(5);
    expect(ATB_RENAL_SECTIONS).toHaveLength(13);
    expect(STAGE_ORDER).toHaveLength(5);
  });

  it("chaque ligne porte une valeur pour les 5 stades (jamais de trou)", () => {
    for (const r of ATB_RENAL_ROWS) {
      expect(r.lines.length, r.id).toBeGreaterThan(0);
      for (const l of r.lines) {
        expect(l.d, `${r.id}`).toHaveLength(5);
        for (const v of l.d) expect(typeof v, r.id).toBe("string");
      }
    }
  });

  it("conserve l'ambiguïté des cellules PDF et ne répartit pas 5 cellules par ordre", async () => {
    const fs = await import("node:fs");
    const sourceRows = JSON.parse(fs.readFileSync("data/issues/OMEDIT-ATB-IR-V2.3.rows.json", "utf8")) as Array<{
      label: string;
      lines: Array<{ values: Record<string, string>; ambiguous_stages?: string[]; stage_cells?: Record<string, number[]>; source_cells?: Array<{ id: number; text: string }> }>;
    }>;
    const benzyl = sourceRows.find((row) => row.label === "Benzylpenicilline sodique IM ou IV")!;
    const benzylLine = benzyl.lines[0];
    expect(benzylLine.values.legere).toContain("12 à 24 MUI/j");
    expect(benzylLine.values).not.toHaveProperty("moderee");
    expect(benzylLine.ambiguous_stages).toContain("moderee");
    const modereeTexts = (benzylLine.stage_cells?.moderee ?? []).map(
      (id) => benzylLine.source_cells?.find((cell) => cell.id === id)?.text,
    );
    expect(modereeTexts).toEqual([
      "12 à 24 MUI/j en 6 injections ou en perfusion continue",
      "3 MUI /4h",
      "2 MUI/4h",
    ]);

    const ambiguous = sourceRows.flatMap((row) => row.lines.flatMap((line) =>
      (line.ambiguous_stages ?? []).map((stage) => `${row.label}\u0000${stage}`),
    ));
    expect(ambiguous).toHaveLength(47);
    expect(new Set(ambiguous).size).toBe(33);
  });

  it("identifiants uniques + nom arabe pour les 93 molécules", () => {
    const ids = ATB_RENAL_ROWS.map((r) => r.id);
    expect(new Set(ids).size).toBe(93);
    expect(Object.keys(ATB_RENAL_BY_ID)).toHaveLength(93);
    for (const r of ATB_RENAL_ROWS) {
      expect(r.ar.trim().length, r.id).toBeGreaterThan(0);
      expect(r.fr.trim().length, r.id).toBeGreaterThan(0);
    }
  });

  it("les 13 classes du tableau sont effectivement utilisées", () => {
    const used = new Set(ATB_RENAL_ROWS.map((r) => r.section));
    expect(used.size).toBe(13);
    for (const s of ATB_RENAL_SECTIONS) expect(used.has(s.id), s.id).toBe(true);
  });

  it("aucune ligne ne reste sans tranche de page", () => {
    for (const r of ATB_RENAL_ROWS) expect(r.page).toBeGreaterThanOrEqual(1);
  });

  it("les plafonds mg/kg des cellules PDF sont traités comme contraintes, pas comme doses", () => {
    const texts = [...new Set(ATB_RENAL_ROWS.flatMap((row) => row.lines
      .filter((line) => line.kind === "dose")
      .flatMap((line) => line.d)
      .filter((text) => /mg\s*\/\s*kg/i.test(text) && /maximum|max(?:imum|imale)?|sans dépasser/i.test(text)),
    ))].sort();
    expect(texts).toEqual([
      "15 à 20 mg/kg/24h (25 mg/kg/j maximum)",
      "3 à 5 mg/kg/24h (200 mg/j maximum)",
      "4 à 5 mg/kg/24h (300 mg/j maximum)",
      "50 mg/kg/24h en 3 prises (sans dépasser 4 g/24h)",
    ].sort());
    for (const text of texts) {
      expect(calculateWeightDose(text, 100, "fr").text, text).not.toBeNull();
    }
  });
});

// ── مراجعة القيم مقابل الجدول المصدري / Recoupement avec la source ─────────────────────────
describe("atb-renal : valeurs recoupées avec le tableau source", () => {
  it("Céfidérocol : 5 valeurs distinctes et conserve la mention répétée du PDF", () => {
    const r = ATB_RENAL_BY_ID["cefiderocol-iv"];
    expect(r).toBeDefined();
    expect(r!.lines[0].d).toEqual([
      "2 g/8h si fonction rénale ≥ 120 mL/min : 2 g/6h",
      "2 g/8h",
      "1,5 g/8h",
      "1 g/8h",
      "0,75 g/12h",
    ]);
    expect(r!.notes).toContainEqual({
      fr: "Si fonction rénale ≥ 120 mL/min : 2 g/6h",
      ar: "إذا كان الترشيح الكلوي ≥ 120 مل/دقيقة: 2 غ كل 6 ساعات",
      stages: ["normorenal"],
    });
  });

  it("Aminosides : ne propage pas la cellule normorénale vers les colonnes fusionnées", () => {
    const rows = [
      [ATB_RENAL_BY_ID["amikacine-iv"], "15 à 30 mg/kg/j"],
      [ATB_RENAL_BY_ID["gentamicine-im-iv"], "3 à 8 mg/kg/j"],
      [ATB_RENAL_BY_ID["tobramycine-im-iv"], "3 à 8 mg/kg/j"],
    ] as const;
    const merged = "Cellule fusionnée — voir la note commune du tableau";
    for (const [r, dose] of rows) {
      expect(r!.lines[0].d).toEqual([dose, merged, merged, merged, merged]);
      expect(r!.lines[0].d.slice(1).every((v) => requiresSourceCheck(v))).toBe(true);
      expect(r!.lines[0].d.slice(1).every((v) => parseWeightDoses(v).length === 0)).toBe(true);
      const commonNote = r!.notes.find((n) => n.fr.includes("la posologie unitaire ne doit pas être diminuée"));
      expect(commonNote).toBeDefined();
      expect(commonNote!.stages).toEqual(["legere", "moderee", "severe", "terminale"]);
      expect(commonNote!.ar).toContain("تكفي حقنة واحدة");
      expect(commonNote!.ar).not.toContain("يوميًا");
    }
  });

  it("Amikacine : sépare la cellule OMEDIT d'une note éditoriale externe à DFG/ClCr explicites", () => {
    const row = ATB_RENAL_BY_ID["amikacine-iv"];
    const editorialNote = row!.notes.find((note) => note.fr.includes("CA-SFM/SPILF/SFPT 2025"));

    expect(row!.lines[0].d[0]).toBe("15 à 30 mg/kg/j");
    expect(editorialNote).toBeDefined();
    expect(editorialNote!.fr).toContain("références sont arrêtées au 10/01/2024");
    expect(editorialNote!.fr).toContain("Les colonnes sont en DFG (mL/min/1,73 m²), pas en ClCr Cockcroft–Gault");
    expect(editorialNote!.fr).toContain("Vérifier le RCP du produit");
    expect(editorialNote!.ar).toContain("لا تخلطه");
    expect(editorialNote!.stages).toBeUndefined();
  });

  it("Aztréonam IM : la cystite reste à dose unique; seule la ligne infection haute est réduite", () => {
    const r = ATB_RENAL_BY_ID["aztreonam-im"];
    expect(r!.lines[0].d).toEqual(Array(5).fill("Cystite aiguë ou infection gonococcique non compliquée : 1 g dose unique"));
    expect(r!.lines[1].d).toEqual([
      "Infection urinaire haute et/ou compliquée : 1 g/12h",
      "Infection urinaire haute et/ou compliquée : 1 g/12h",
      "Infection urinaire haute et/ou compliquée : 1 g/12h",
      "½ dose",
      "¼ dose",
    ]);
  });

  it("les zones qui recouvrent plusieurs textes source n'affichent aucune dose unique", () => {
    const benzyl = ATB_RENAL_BY_ID["benzylpenicilline-sodique-im-ou-iv"];
    expect(benzyl!.lines[0].d[2]).toBe("Cellules source multiples — consulter la note; aucune dose unique retenue");
    const benzylNote = benzyl!.notes.find((n) => n.stages?.includes("moderee"));
    expect(benzylNote?.fr).toContain("12 à 24 MUI/j en 6 injections ou en perfusion continue");
    expect(benzylNote?.fr).toContain("3 MUI /4h");
    expect(benzylNote?.fr).toContain("2 MUI/4h");

    const meropenemVaborbactam = ATB_RENAL_BY_ID["meropenem-vaborbactam-iv-atb-de-reserve"];
    expect(meropenemVaborbactam).toBeDefined();
    expect(meropenemVaborbactam!.lines[0].d.slice(2)).toEqual([
      "Cellules source multiples — consulter la note; aucune dose unique retenue",
      "Cellules source multiples — consulter la note; aucune dose unique retenue",
      "Cellules source multiples — consulter la note; aucune dose unique retenue",
    ]);
    const ambiguityNotes = meropenemVaborbactam!.notes.filter((n) =>
      ["moderee", "severe", "terminale"].some((stage) => n.stages?.includes(stage as "moderee" | "severe" | "terminale")),
    );
    expect(ambiguityNotes).toHaveLength(3);
    expect(ambiguityNotes.every((note) => note.fr.includes("Aucune posologie unique n'a été sélectionnée."))).toBe(true);
    expect(ambiguityNotes.map((note) => note.fr).join(" | ")).toContain("1g/12h");
  });

  it("Cotrimoxazole : contre-indication en IRC terminale", () => {
    const r = ATB_RENAL_BY_ID["cotrimoxazole-iv-po"];
    expect(isContraindicated(r!.lines[0].d[4])).toBe(true);
    expect(r!.section).toBe("sulfamides");
  });

  it("Vancomycine IV : dose de charge pondérale 30 mg/kg, puis adaptation", () => {
    const r = ATB_RENAL_BY_ID["vancomycine-iv"];
    expect(r!.lines[0].d[0]).toContain("DC 30 mg/kg");
    expect(r!.lines[0].d[4]).toContain("DC, puis adapter");
  });

  it("Méropénem : conserve la note de monitorage des doses élevées du PDF", () => {
    const r = ATB_RENAL_BY_ID["meropenem-iv"];
    expect(r).toBeDefined();
    expect(r!.notes).toContainEqual({
      fr: "Si posologie élevée (> 6 g/24h) : monitorage pharmacologique",
      ar: "عند الجرعات العالية (> 6 غ/24 سا): تُجرى مراقبة علاجية لتركيز الدواء.",
    });
  });

  it("Rifampicine : conserve l'espacement lié à la rifampicinémie sans corruption des exposants", () => {
    const r = ATB_RENAL_BY_ID["rifampicine-iv-po"];
    expect(r!.lines[1].d).toEqual([
      "Infection à germes gram + ou - : 20 à 30 mg/kg/24h",
      "Infection à germes gram + ou - : 20 à 30 mg/kg/24h",
      "espacer les prises si besoin selon rifampicémie du 2ᵉ ou 3ᵉ jour du traitement",
      "espacement des prises indispensable",
      "espacement des prises indispensable",
    ]);
  });

  it("Ceftriaxone : conduite identique sur les 5 stades (pas d'adaptation)", () => {
    const r = ATB_RENAL_BY_ID["ceftriaxone-im-iv"];
    const d = r!.lines[0].d;
    expect(new Set(d).size).toBe(1);
    expect(d[0]).toContain("Aucune donnée chez l'insuffisant rénal");
    expect(d[0]).not.toContain("«");
  });

  it("Triméthoprime : « Aucune donnée » en IRC sévère et terminale", () => {
    const r = ATB_RENAL_BY_ID["trimethoprime-po"];
    expect(isNoData(r!.lines[0].d[3])).toBe(true);
    expect(isNoData(r!.lines[0].d[4])).toBe(true);
    expect(isNoData(r!.lines[0].d[0])).toBe(false);
  });

  it("Sulfadiazine : « Réduction de la posologie » en IRC modérée, « Aucune donnée » ensuite", () => {
    const d = ATB_RENAL_BY_ID["sulfadiazine-po"]!.lines[0].d;
    expect(d[2]).toBe("Réduction de la posologie");
    expect(isNoData(d[3])).toBe(true);
    expect(isNoData(d[4])).toBe(true);
    expect(isDiscouraged(d[0])).toBe(false);
  });
});

// ── محرّك الجرعة الوزنية / Moteur de dose pondérale ─────────────────────────────────────────
describe("atb-dose : lecture des posologies pondérales", () => {
  it("lit une fourchette mg/kg/j et la marque comme journalière", () => {
    const [p] = parseWeightDoses("15 à 30 mg/kg/j");
    expect(p.lowMg).toBe(15);
    expect(p.highMg).toBe(30);
    expect(p.per24h).toBe(true);
  });

  it("lit un intervalle explicite (mg/kg/12h)", () => {
    const [p] = parseWeightDoses("6 à 8 mg/kg/12h");
    expect(p.intervalH).toBe(12);
    expect(p.per24h).toBe(false);
  });

  it("lit le nombre de prises (« en 4 injections »)", () => {
    const [p] = parseWeightDoses("100 mg/kg/24h en 4 injections");
    expect(p.dosesPerDay).toBe(4);
  });

  it("applique les plafonds explicites du PDF sans transformer le plafond en dose", () => {
    const cloxacilline = ATB_RENAL_BY_ID["cloxacilline-po"]!.lines[0].d[0];
    const cloxResult = calculateWeightDose(cloxacilline, 100, "fr");
    expect(cloxResult.refusal).toBeNull();
    expect(cloxResult.text).toContain("4 g/24h");
    expect(cloxResult.text).toContain("1,33 g par prise (3 prises)");
    expect(cloxResult.text).toContain("plafond explicite de la source appliqué");
    expect(cloxResult.text).not.toContain("5 g/24h");

    const isoniazideLine = ATB_RENAL_BY_ID["isoniazide-im-iv-po"]!.lines[0].d;
    const isoniazide = isoniazideLine[0];
    expect(parseWeightDoses(isoniazide)).toHaveLength(1);
    expect(calculateWeightDose(isoniazide, 80, "fr").text).toContain("300 mg/24h");
    expect(calculateWeightDose(isoniazideLine[1], 80, "fr").text).toBe("240 mg à 400 mg/24h");
    expect(calculateWeightDose(isoniazideLine[3], 80, "fr").text).toContain("200 mg/24h");

    const ethambutol = ATB_RENAL_BY_ID["ethambutol-m-iv-po"]!.lines[0].d[0];
    expect(parseWeightDoses(ethambutol)).toHaveLength(1);
    expect(weightDoseText(ethambutol, 80, "fr")).toBe("1,2 g à 1,6 g/24h");
    expect(weightDoseText(ethambutol, 80, "fr")).not.toContain("2 g/24h");
  });

  it("lit « 1 fois/24h » comme fréquence explicite et conserve les alternatives du PDF", () => {
    const daptomycine = ATB_RENAL_BY_ID["daptomycine-iv"]!.lines[0].d[0];
    const [daily] = parseWeightDoses(daptomycine);
    expect(daily.per24h).toBe(true);
    expect(daily.intervalH).toBe(24);
    expect(daily.dosesPerDay).toBe(1);
    expect(weightDoseText(daptomycine, 70, "fr")).toBe("420 mg à 560 mg/24h");

    const cloxacillineIv = ATB_RENAL_BY_ID["cloxacilline-iv"]!.lines[0].d[0];
    const text = weightDoseText(cloxacillineIv, 70, "fr")!;
    expect(text).toContain(" ou ");
    expect(text).not.toContain(" puis ");
  });

  it("bloque un plafond non compris ou incompatible au lieu de l'ignorer", () => {
    const unknown = "5 mg/kg/24h (maximum selon le protocole)";
    expect(calculateWeightDose(unknown, 70, "fr")).toEqual({ text: null, refusal: "unsupported-maximum" });
    expect(parseWeightDoses(unknown)).toHaveLength(0);

    const incompatible = "5 mg/kg/24h (300 mg/prise maximum)";
    expect(calculateWeightDose(incompatible, 70, "fr")).toEqual({ text: null, refusal: "unsupported-maximum" });

    const fixed = "250 à 500 mg/8h, posologie max : 1500 mg/24h";
    expect(calculateWeightDose(fixed, 70, "fr")).toEqual({ text: null, refusal: null });
  });

  it("n'attribue pas une fréquence d'une modalité à une autre dose pondérale", () => {
    const text = "100 à 200 mg/kg/24h en 6 perfusions de 30 à 60 min OU DC de 2 g en perfusion de 60 min puis 100 à 200 mg/kg/24h en perfusion continue";
    const parts = parseWeightDoses(text);
    expect(parts).toHaveLength(2);
    expect(parts[0].dosesPerDay).toBe(6);
    expect(parts[1].dosesPerDay).toBeNull();
    expect(weightDoseText(text, 70, "fr")).toContain("1,17 g à 2,33 g par prise (6 prises)");
  });

  it("ne transforme pas une fourchette de prises en nombre fixe", () => {
    const text = "100 mg/kg/24h en 4 à 6 injections";
    expect(parseWeightDoses(text)[0].dosesPerDay).toBeNull();
    expect(weightDoseText(text, 70, "fr")).toBe("7 g/24h");
  });

  it("calcule aussi la part pondérale d'une dose de charge (DC de … mg/kg)", () => {
    const parts = parseWeightDoses("DC de 30 mg/kg en perfusion de 2h puis 15 mg/kg/12h");
    expect(parts).toHaveLength(2);
    expect(parts[0].source).toContain("30 mg/kg");
  });

  it("refuse de calculer une contre-indication ou une réduction fractionnaire", () => {
    expect(parseWeightDoses("Contre-indiqué")).toHaveLength(0);
    expect(parseWeightDoses("Réduction de la posologie")).toHaveLength(0);
    expect(parseWeightDoses("5 mg/kg/24h, puis 1/2 dose")).toHaveLength(0);
    expect(parseWeightDoses("5 mg/kg/24h, puis 1/4 dose")).toHaveLength(0);
    expect(parseWeightDoses("DC de 2 g puis 500 mg/8h").some((p) => p.source.includes("g puis"))).toBe(false);
  });

  it("signale les valeurs non chiffrées par la source (à vérifier dans le PDF)", () => {
    expect(requiresSourceCheck("Aucune donnée")).toBe(true);
    expect(requiresSourceCheck("Cellule fusionnée — voir la note commune du tableau")).toBe(true);
    expect(isMergedSourceCell("Cellule fusionnée — voir la note commune du tableau")).toBe(true);
    expect(isMergedSourceCell("3 à 8 mg/kg/j")).toBe(false);
    const ambiguous = "Cellules source multiples — consulter la note; aucune dose unique retenue";
    expect(isAmbiguousSourceCells(ambiguous)).toBe(true);
    expect(requiresSourceCheck(ambiguous)).toBe(true);
    expect(parseWeightDoses(ambiguous)).toHaveLength(0);
    expect(weightDoseText(ambiguous, 70, "fr")).toBeNull();
    expect(requiresSourceCheck("Réduction de la posologie")).toBe(true);
    expect(requiresSourceCheck("½ dose")).toBe(true);
    expect(requiresSourceCheck("2 g/8h")).toBe(false);
    expect(requiresSourceCheck("15 à 30 mg/kg/j")).toBe(false);
  });

  it("ne calcule rien sur une dose fixe sans mg/kg", () => {
    expect(parseWeightDoses("2 g/8h")).toHaveLength(0);
    expect(isFixedOnly("2 g/8h")).toBe(true);
    expect(isFixedOnly("15 à 30 mg/kg/j")).toBe(false);
  });

  it("conversion au poids : 100 mg/kg/24h en 4 injections à 70 kg", () => {
    const txt = weightDoseText("100 mg/kg/24h en 4 injections", 70, "fr");
    expect(txt).toBe("7 g/24h · 1,75 g par prise (4 prises)");
  });

  it("conversion en arabe avec chiffres arabes orientaux", () => {
    const txt = weightDoseText("100 mg/kg/24h en 4 injections", 70, "ar");
    expect(txt).toContain("٧");
    expect(txt).toContain("/24 سا");
    expect(txt).toContain("٤ جرعات");
  });

  it("fourchette pondérale : 15 à 30 mg/kg/j à 60 kg", () => {
    expect(weightDoseText("15 à 30 mg/kg/j", 60, "fr")).toBe("900 mg à 1,8 g/24h");
  });

  it("dose unitaire sans intervalle : mention « par prise »", () => {
    expect(weightDoseText("5 mg/kg", 80, "fr")).toBe("400 mg par prise");
  });

  it("poids absent ou invalide : aucun calcul", () => {
    expect(weightDoseText("15 à 30 mg/kg/j", 0, "fr")).toBeNull();
    expect(weightDoseText("15 à 30 mg/kg/j", NaN, "fr")).toBeNull();
  });
});

// ── التصفية والمرحلة / DFG & stade ──────────────────────────────────────────────────────────
describe("atb-dose : Cockcroft-Gault et stades", () => {
  it("convertit les µmol/L en mg/dL (88,4)", () => {
    expect(toMgDl(88.4, "umol").mgDl).toBeCloseTo(1, 5);
    expect(toMgDl(1.2, "mg").mgDl).toBe(1.2);
  });

  it("refuse une créatinine > 20 mg/dL au lieu de convertir silencieusement l'unité", () => {
    const r = toMgDl(150, "mg");
    expect(r.suspectUnit).toBe(true);
    expect(r.mgDl).toBeNull();
    expect(toMgDl(150, "umol").mgDl).toBeCloseTo(1.7, 1);
  });

  it("Cockcroft-Gault : homme 70 ans, 70 kg, 1,2 mg/dL", () => {
    expect(cockcroftGault(70, 70, 1.2, "m")!).toBeCloseTo(56.7, 1);
  });

  it("Cockcroft-Gault : la femme est multipliée par 0,85", () => {
    const h = cockcroftGault(70, 70, 1.2, "m")!;
    const f = cockcroftGault(70, 70, 1.2, "f")!;
    expect(f / h).toBeCloseTo(0.85, 3);
  });

  it("refuse de calculer sur des entrées nulles", () => {
    expect(cockcroftGault(0, 70, 1.2, "m")).toBeNull();
    expect(cockcroftGault(70, 0, 1.2, "m")).toBeNull();
    expect(cockcroftGault(70, 70, 0, "m")).toBeNull();
  });

  it("bornes des stades : 30 est refusé car le tableau le place dans deux colonnes", () => {
    expect(stageFromDfg(120)).toBe("normorenal");
    expect(stageFromDfg(90)).toBe("normorenal");
    expect(stageFromDfg(89.9)).toBe("legere");
    expect(stageFromDfg(60)).toBe("legere");
    expect(stageFromDfg(59.9)).toBe("moderee");
    expect(stageFromDfg(30)).toBeNull();
    expect(stageFromDfg(29.9)).toBe("severe");
    expect(stageFromDfg(15)).toBe("severe");
    expect(stageFromDfg(14.9)).toBe("terminale");
    expect(stageFromDfg(0)).toBe("terminale");
    expect(isAmbiguousAtbDfgBoundary(30 + 1e-7)).toBe(true);
    expect(isAmbiguousAtbDfgBoundary(30.1)).toBe(false);
  });

  it("refuse une valeur de clairance absente ou négative au lieu de conclure à un stade normal", () => {
    expect(stageFromDfg(NaN)).toBeNull();
    expect(stageFromDfg(-3)).toBeNull();
    expect(stageFromDfg(Number.POSITIVE_INFINITY)).toBeNull();
  });
});

// ── حدود الاستعمال / Périmètre d'usage ──────────────────────────────────────────────────────
describe("atb-renal : périmètre adulte", () => {
  it("la page existe et son entrée de calculateur est enregistrée", async () => {
    const { calculators } = await import("@/data/calculators");
    const entry = calculators.find((c) => c.id === "antibio-renal");
    expect(entry?.href).toBe("/calculateurs/antibio-renal");
    expect(entry?.meta?.lastReviewed).toBe("2026-09");
    expect(entry?.title.ar.trim().length).toBeGreaterThan(0);
  });

  it("le compteur de contenu suit la réalité (garde-fou)", async () => {
    const { COUNTS } = await import("@/data/counts");
    const { calculators } = await import("@/data/calculators");
    expect(COUNTS.calculators).toBe(calculators.length);
  });

  it("l'âge < 18 ans n'affiche aucune dose du tableau adulte, même si ClCr est calculable", () => {
    const crcl = cockcroftGault(12, 40, 0.8, "m")!; // calcul ClCr seul : ≈ 88,9 mL/min
    const result = chooseStage({ ageYears: 12, sexe: "m", weightKg: 40, heightCm: 145, scrMgDl: 0.8 });
    expect(crcl).toBeCloseTo(88.9, 1);
    expect(result.crclCg).toBeCloseTo(crcl, 6);
    expect(result.refusal).toBe("pediatric");
    expect(result.stage).toBeNull();
  });
});

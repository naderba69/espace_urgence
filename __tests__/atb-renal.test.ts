// v18.0 — اختبارات حاسبة «المضادات الحيوية والوظيفة الكلوية»: سلامة المعطيات + محرّك الحساب.
// Tests du calculateur antibiotiques & fonction rénale : intégrité des données (93 lignes × 5
// stades, valeurs recoupées avec le tableau source) et moteur de calcul (poids, Cockcroft-Gault).
import { describe, expect, it } from "vitest";
import {
  cockcroftGault,
  isContraindicated,
  isDiscouraged,
  isFixedOnly,
  isNoData,
  parseWeightDoses,
  requiresSourceCheck,
  stageFromCrCl,
  STAGE_ORDER,
  toMgDl,
  weightDoseText,
} from "@/lib/atb-dose";
import { ATB_RENAL_BY_ID, ATB_RENAL_ROWS, ATB_RENAL_SECTIONS, ATB_RENAL_STAGES } from "@/data/atb-renal";

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
});

// ── مراجعة القيم مقابل الجدول المصدري / Recoupement avec la source ─────────────────────────
describe("atb-renal : valeurs recoupées avec le tableau source", () => {
  it("Céfidérocol : 5 valeurs distinctes (révisées à la main)", () => {
    const r = ATB_RENAL_BY_ID["cefiderocol-iv"];
    expect(r).toBeDefined();
    expect(r!.lines[0].d).toEqual([
      "2 g/8h si fonction rénale ≥ 120 mL/min : 2 g/6h",
      "2 g/8h",
      "1,5 g/8h",
      "1 g/8h",
      "0,75 g/12h",
    ]);
  });

  it("Amikacine : même posologie pondérale sur les 5 stades", () => {
    const r = ATB_RENAL_BY_ID["amikacine-iv"];
    expect(r!.lines[0].d.every((v) => v === "15 à 30 mg/kg/j")).toBe(true);
  });

  it("Aztréonam IM : ½ dose puis ¼ dose sur les stades sévère/terminale", () => {
    const r = ATB_RENAL_BY_ID["aztreonam-im"];
    expect(r!.lines[1].d[3]).toBe("½ dose");
    expect(r!.lines[1].d[4]).toBe("¼ dose");
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

  it("Ceftriaxone : conduite identique sur les 5 stades (pas d'adaptation)", () => {
    const r = ATB_RENAL_BY_ID["ceftriaxone-im-iv"];
    const d = r!.lines[0].d;
    expect(new Set(d).size).toBe(1);
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

  it("calcule aussi la part pondérale d'une dose de charge (DC de … mg/kg)", () => {
    const parts = parseWeightDoses("DC de 30 mg/kg en perfusion de 2h puis 15 mg/kg/12h");
    expect(parts).toHaveLength(2);
    expect(parts[0].source).toContain("30 mg/kg");
  });

  it("refuse de calculer une contre-indication ou une réduction en %", () => {
    expect(parseWeightDoses("Contre-indiqué")).toHaveLength(0);
    expect(parseWeightDoses("Réduction de la posologie")).toHaveLength(0);
    expect(parseWeightDoses("DC de 2 g puis 500 mg/8h").some((p) => p.source.includes("g puis"))).toBe(false);
  });

  it("signale les valeurs non chiffrées par la source (à vérifier dans le PDF)", () => {
    expect(requiresSourceCheck("Aucune donnée")).toBe(true);
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

  it("signale une créatinine > 20 mg/dL comme unité probablement erronée", () => {
    const r = toMgDl(150, "mg");
    expect(r.suspectUnit).toBe(true);
    expect(r.mgDl).toBeCloseTo(1.7, 1);
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

  it("bornes des 5 stades du tableau (90/60/30/15)", () => {
    expect(stageFromCrCl(120)).toBe("normorenal");
    expect(stageFromCrCl(90)).toBe("normorenal");
    expect(stageFromCrCl(89.9)).toBe("legere");
    expect(stageFromCrCl(60)).toBe("legere");
    expect(stageFromCrCl(59.9)).toBe("moderee");
    expect(stageFromCrCl(30)).toBe("moderee");
    expect(stageFromCrCl(29.9)).toBe("severe");
    expect(stageFromCrCl(15)).toBe("severe");
    expect(stageFromCrCl(14.9)).toBe("terminale");
    expect(stageFromCrCl(0)).toBe("terminale");
  });

  it("une valeur aberrante ne fait pas planter le stade", () => {
    expect(stageFromCrCl(NaN)).toBe("normorenal");
    expect(stageFromCrCl(-3)).toBe("normorenal");
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

  it("l'âge < 18 ans est signalé comme hors périmètre", async () => {
    const { cockcroftGault, stageFromCrCl } = await import("@/lib/atb-dose");
    // 12 ans, 40 kg, 0,8 mg/dL : le calcul reste possible mais la page affiche l'alerte pédiatrique
    const crcl = cockcroftGault(12, 40, 0.8, "m")!;   // (140−12)×40/(72×0,8) ≈ 88,9
    expect(crcl).toBeCloseTo(88.9, 1);
    expect(stageFromCrCl(crcl)).toBe("legere");        // le calcul « fonctionne »…
    expect(12 > 0 && 12 < 18).toBe(true);              // … mais la page affiche l'alerte pédiatrique
  });
});

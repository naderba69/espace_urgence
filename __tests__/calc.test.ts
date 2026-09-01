import { describe, it, expect } from "vitest";
import {
  clampDose, dripRate, parkland, parklandRates, concUgPerMl, amineFlow,
  pediatricWeight, pediatricTubeSize, pediatricDefibJ, ibwKg, tidalVolumeRange,
  curb65Outcome, wellsEpLikely, hasBledHighRisk, nihssBand,
  adrogueMadias, totalBodyWater, maxCorrectionRate, heparin, insulinDka, dkaPotassiumAction,
} from "../lib/calc";

describe("doses", () => {
  it("adrénaline ACR pédiatrique : 0,01 mg/kg", () => {
    expect(clampDose(0.01, 20, 1)).toBeCloseTo(0.2);
  });
  it("plafonné au maximum", () => {
    expect(clampDose(0.01, 200, 1)).toBe(1);          // ACR : jamais >1 mg
    expect(clampDose(5, 80, 300)).toBe(300);          // amiodarone péds
  });
  it("entrées invalides → 0", () => {
    expect(clampDose(0.01, 0, 1)).toBe(0);
    expect(clampDose(0, 50, 1)).toBe(0);
  });
});

describe("perfusions", () => {
  it("500 mL en 8 h, kit 20 gt/mL", () => {
    const r = dripRate(500, 8, 20);
    expect(r.mlh).toBeCloseTo(62.5);
    expect(r.gttMin).toBeCloseTo(20.833, 2);
    expect(r.secPerDrop).toBeCloseTo(2.88, 1);
  });
  it("0 → 0", () => {
    expect(dripRate(0, 8, 20).gttMin).toBe(0);
  });
});

describe("Parkland", () => {
  it("70 kg × 20 % = 5600 mL dont 2800 sur 8 h", () => {
    const p = parkland(70, 20);
    expect(p.total24).toBe(5600);
    expect(p.first8h).toBe(2800);
  });
  it("déjà 2 h écoulées → 2800 mL sur 6 h restantes", () => {
    const r = parklandRates(70, 20, 2);
    expect(r.remainingFirst).toBe(6);
    expect(r.firstRate).toBeCloseTo(466.67, 1);
    expect(r.secondRate).toBeCloseTo(175);
  });
});

describe("amines (PSE)", () => {
  it("noradrénaline 4 mg/50 mL → 80 µg/mL", () => {
    expect(concUgPerMl(4, 50)).toBe(80);
  });
  it("0,1 µg/kg/min à 70 kg = 5,25 mL/h", () => {
    expect(amineFlow(0.1, 70, 4, 50)).toBeCloseTo(5.25);
  });
});

describe("pédiatrie", () => {
  it("poids = 2×âge+8 (4 ans → 16 kg)", () => expect(pediatricWeight(4)).toBe(16));
  it("tube = âge/4+4", () => expect(pediatricTubeSize(8)).toBe(6));
  it("défibrillation 4 J/kg plafonnée 200 J", () => {
    expect(pediatricDefibJ(20)).toBe(80);
    expect(pediatricDefibJ(60)).toBe(200);
  });
});

describe("ventilation", () => {
  it("IBW Devine homme 170 cm ≈ 66 kg", () => expect(Math.round(ibwKg(170, "m"))).toBe(66));
  it("Vt 6–8 mL/kg", () => {
    const [lo, hi] = tidalVolumeRange(66);
    expect(lo).toBe(396);
    expect(hi).toBe(528);
  });
});

describe("scores", () => {
  it("CURB-65", () => {
    expect(curb65Outcome(0)).toBe(0);
    expect(curb65Outcome(1)).toBe(0);
    expect(curb65Outcome(2)).toBe(1);
    expect(curb65Outcome(3)).toBe(2);
  });
  it("Wells EP : seuil >4", () => {
    expect(wellsEpLikely(4)).toBe(false);
    expect(wellsEpLikely(4.5)).toBe(true);
  });
  it("HAS-BLED ≥3 → haut risque", () => {
    expect(hasBledHighRisk(2)).toBe(false);
    expect(hasBledHighRisk(3)).toBe(true);
  });
  it("NIHSS bandes", () => {
    expect(nihssBand(0)).toBe(0);
    expect(nihssBand(4)).toBe(1);
    expect(nihssBand(10)).toBe(2);
    expect(nihssBand(18)).toBe(3);
    expect(nihssBand(30)).toBe(4);
  });
});

describe("natrémie (Adrogué-Madias)", () => {
  it("Na 110, sérum salé hypertonique 3 % (513 mmol/L), H 70 kg → ~9,37 par litre", () => {
    const tbw = totalBodyWater(70, 0.6);
    expect(tbw).toBe(42);
    const d = adrogueMadias(110, 513, 0, tbw);
    expect(d).toBeCloseTo(9.37, 1);
  });
  it("débit sûr ≤0,5 mmol/L/h", () => {
    const rate = maxCorrectionRate(9.372, 0.5);
    expect(rate).toBeCloseTo(53.35, 0);
  });
  it("jamais négatif", () => expect(maxCorrectionRate(-1, 0.5)).toBe(0));
});

describe("héparine", () => {
  it("80 U/kg bolus plafonné 8000 ; 18 U/kg/h à 100 U/mL", () => {
    const h = heparin(80, 80, 8000, 18, 100);
    expect(h.bolusU).toBe(6400);
    expect(h.rateUh).toBe(1440);
    expect(h.rateMlH).toBeCloseTo(14.4);
  });
  it("bolus plafonné", () => {
    expect(heparin(120).bolusU).toBe(8000);
  });
});

describe("insuline ACD", () => {
  it("0,1 U/kg bolus + débit, conversion mL/h", () => {
    const r = insulinDka(70);
    expect(r.bolusU).toBeCloseTo(7);
    expect(r.rateUh).toBeCloseTo(7);
    expect(r.rateMlH).toBeCloseTo(7);
  });
  it("potassium : <3,3 bloque l'insuline ; 3,3–5,2 ajoute K ; sinon standard", () => {
    expect(dkaPotassiumAction(3.0)).toBe("hold-insulin");
    expect(dkaPotassiumAction(4.5)).toBe("add-k");
    expect(dkaPotassiumAction(5.5)).toBe("standard");
  });
});

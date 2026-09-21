import { fmtJournal } from "../lib/journal";
import { describe, it, expect } from "vitest";
import {
  clampDose, dripRate, parkland, parklandRates, concUgPerMl, amineFlow,
  pediatricWeight, pediatricTubeSize, pediatricDefibJ, ibwKg, tidalVolumeRange,
  curb65Outcome, wellsEpLikely, prepVolume, shockIndex, shockIndexBand, meanArterialPressure, pulsePressure, qtc, qtcBand, enoxaparin, tenecteplaseMg, alteplaseStroke, calciumCorrected, potassiumDeficit, hollidaySegar, dehydrationDeficit, nacProtocol, nivStart, abcd2, abcd2Band, alvarado, alvaradoBand, massiveTransfusion, flowForUnit, startTriage, startTriageStep, weaningReady, qsofa, spesi, heartBand, mgso4DrawMl, mgso4RateMlH, dkaBolusMl, dkaInsulinUh, dkaKDecision, dkaNeedsDextrose, broselowZone, broselowDoses, type BroselowZone, monthsSince, fmtMMSS, reviewDueCount, daysSince, doseFromFlow, inferConcUgMl, interpretAbg, peepForFio2, ventSuggest, hasBledHighRisk, nihssBand,
  adrogueMadias, totalBodyWater, maxCorrectionRate, heparin, insulinDka, dkaPotassiumAction, weightResusPanel,
  doseLadder, sbtPassed, extubationOk, mgso4GPerMl, BROSELOW,
} from "../lib/calc";
import { searchItems, loadSearchIndex } from "../lib/search";
import { pumpCfgFromPerfusion } from "../data/med-tools";

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

describe("panneau doses par poids", () => {
  it("70 kg : adrénaline adulte fixe, rocuronium 84 mg, LEV 4200 mg, NaCl3% 210 mL", () => {
    const p = weightResusPanel(70);
    const get = (k: string) => p.find((i) => i.key === k)!;
    expect(get("defib-adult-note").dose).toBe("120–200 J");
    expect(get("roc").dose).toBe("84 mg");
    expect(get("lev").dose).toBe("4200 mg");
  });
  it("20 kg : défib 80 J, adrénaline 0,2 mg, remplissage 400 mL", () => {
    const p = weightResusPanel(20);
    const get = (k: string) => p.find((i) => i.key === k)!;
    expect(get("deferill").dose).toBe("80 J");
    expect(get("adr-acr").dose).toBe("0.2 mg");
    expect(get("fluid").dose).toBe("400 mL");
  });
});

// Vérifications des abaques RE.NAU 2018 (PSE professionnel)
import { PERFUSIONS, perfusionFlow } from "../data/perfusions";

const preset = (drugId: string, unit: string) => PERFUSIONS.find((x) => x.drugId === drugId && x.unit === unit)!;

describe("abaques RE.NAU", () => {
  it("dobutamine 5 µg/kg/min à 70 kg (250 mg/50 mL) → 4,2 mL/h", () => {
    expect(perfusionFlow(preset("dobutamine", "µg/kg/min"), 5, 70)).toBeCloseTo(4.2, 1);
  });
  it("dobutamine 5 µg/kg/min à 100 kg → 6 mL/h (abaque RE.NAU)", () => {
    expect(perfusionFlow(preset("dobutamine", "µg/kg/min"), 5, 100)).toBeCloseTo(6, 1);
  });
  it("noradrénaline RE.NAU 1 mg/h (8 mg/40 mL) → 5 mL/h", () => {
    expect(perfusionFlow(preset("noradrenaline", "mg/h"), 1, 1)).toBeCloseTo(5, 1);
  });
  it("adrénaline anaphylaxie 0,1 mg/h = vitesse 2 (50 µg/mL)", () => {
    expect(perfusionFlow(preset("adrenaline", "mg/h"), 0.1, 1)).toBeCloseTo(2, 1);
  });
  it("héparine SCA 12 UI/kg/h à 70 kg (500 UI/mL) → 1,7 mL/h (abaque)", () => {
    expect(perfusionFlow(preset("heparine", "UI/kg/h"), 12, 70)).toBeCloseTo(1.68, 2);
  });
  it("héparine EP 18 UI/kg/h à 70 kg → 2,5 mL/h (abaque)", () => {
    const p = PERFUSIONS.filter((x) => x.drugId === "heparine")[1];
    expect(perfusionFlow(p, 18, 70)).toBeCloseTo(2.52, 2);
  });
  it("amiodarone charge 5 mg/kg/h à 70 kg → ~31 mL/h", () => {
    expect(perfusionFlow(preset("amiodarone", "mg/kg/h"), 5, 70)).toBeCloseTo(31.1, 0);
  });
  it("nicardipine 1 mg/h (0,2 mg/mL) → 5 mL/h (RE.NAU vit. 5)", () => {
    expect(perfusionFlow(preset("nicardipine", "mg/h"), 1, 1)).toBeCloseTo(5, 2);
  });
  it("kétamine 1 mg/kg/h à 70 kg (5 mg/mL) → 14 mL/h", () => {
    expect(perfusionFlow(preset("ketamine", "mg/kg/h"), 1, 70)).toBeCloseTo(14, 1);
  });
  it("octreotide 25 µg/h (6,25 µg/mL) → 4 mL/h", () => {
    expect(perfusionFlow(preset("octreotide", "µg/h"), 25, 1)).toBeCloseTo(4, 2);
  });
  it("isoprénaline départ 1,7 µg/min (20 µg/mL) → ~5 mL/h", () => {
    expect(perfusionFlow(preset("isoprenaline", "µg/min"), 1.7, 1)).toBeCloseTo(5.1, 1);
  });
  it("sufentanil 0,15 µg/kg/h à 70 kg (5 µg/mL) → 2,1 mL/h", () => {
    expect(perfusionFlow(preset("sufentanil", "µg/kg/h"), 0.15, 70)).toBeCloseTo(2.1, 2);
  });
  it("ocytocine HPP 5 UI/h (0,01 UI/mL) → 500 mL/h", () => {
    expect(perfusionFlow(preset("oxytocine", "UI/h"), 5, 1)).toBeCloseTo(500, 1);
  });
  it("exacyl entretien 125 mg/h (25 mg/mL) → 5 mL/h", () => {
    expect(perfusionFlow(preset("acide-tranexamique", "mg/h"), 125, 1)).toBeCloseTo(5, 2);
  });
  it("labétalol 0,1 mg/kg/h à 70 kg (2 mg/mL) → 3,5 mL/h (abaque)", () => {
    expect(perfusionFlow(preset("labetalol", "mg/kg/h"), 0.1, 70)).toBeCloseTo(3.5, 2);
  });
  it("toutes les préparations ont une concentration > 0 et une fourchette cohérente", () => {
    for (const p of PERFUSIONS) {
      expect(p.concUgPerMl).toBeGreaterThan(0);
      expect(p.doseMax).toBeGreaterThanOrEqual(p.doseMin);
      expect(perfusionFlow(p, p.doseStart ?? p.doseMin, 70)).toBeGreaterThan(0);
    }
  });
});

describe("v1.9 pompe avancée", () => {
  it("conventions de dilution", () => {
    expect(prepVolume(3, 4, 50, "total")).toBe(50);
    expect(prepVolume(3, 4, 50, "added")).toBe(62);
  });
  it("sens inverse dose→débit cohérent", () => {
    expect(doseFromFlow(1.75, 70, 240)).toBeCloseTo(0.1, 5);
    expect(inferConcUgMl(1.75, 0.1, 70)).toBeCloseTo(240, 5);
  });
  it("5 ampoules ≠ 3 ampoules", () => {
    const c3 = concUgPerMl(12, 50), c5 = concUgPerMl(20, 50);
    expect(amineFlow(0.1, 70, 12, 50)).toBeCloseTo(1.75, 2);
    expect(amineFlow(0.1, 70, 20, 50)).toBeCloseTo(1.05, 2);
    expect(c5).toBeGreaterThan(c3);
  });
});

describe("v1.9 gazométrie", () => {
  it("acidose respiratoire aiguë", () => {
    const ids = interpretAbg({ ph: 7.25, paco2: 60, hco3: 26 }).map((x) => x.id);
    expect(ids).toContain("acidemie");
    expect(ids).toContain("resp-acidose");
  });
  it("acidose métabolique à TA élevé + Winter respectée", () => {
    const r = interpretAbg({ ph: 7.2, paco2: 25, hco3: 12, na: 140, cl: 100 });
    const ids = r.map((x) => x.id);
    expect(ids).toContain("met-acidose");
    expect(ids).toContain("ta-eleve");
    expect(ids).not.toContain("winter-haut");
  });
  it("acidose mixte détectée", () => {
    const ids = interpretAbg({ ph: 7.2, paco2: 50, hco3: 18 }).map((x) => x.id);
    expect(ids).toContain("mixte-acidose");
  });
  it("P/F 120 = ARDS modéré", () => {
    const ids = interpretAbg({ ph: 7.4, paco2: 40, hco3: 24, pao2: 60, fio2: 0.5 }).map((x) => x.id);
    expect(ids).toContain("ards-mod");
  });
});

describe("v1.9 ventilation", () => {
  it("table PEEP/FiO2", () => {
    expect(peepForFio2(30)).toBe(5);
    expect(peepForFio2(60)).toBe(10);
    expect(peepForFio2(100)).toBe(20);
  });
  it("hypercapnie acide → RR +2", () => {
    const r = ventSuggest({ vt: 450, rr: 14, peep: 5, fio2: 40 }, { ph: 7.25, paco2: 60, pao2: 80 }, 70);
    expect(r.proposed.rr).toBe(16);
    expect(r.changes.some((c) => c.reason === "hypercapnie-acide")).toBe(true);
  });
  it("Vt > 8 mL/kg → 6 mL/kg IBW", () => {
    const r = ventSuggest({ vt: 600, rr: 14, peep: 5, fio2: 40 }, { ph: 7.4, paco2: 40, pao2: 80 }, 70);
    expect(r.proposed.vt).toBe(420);
  });
  it("hypoxémie → monte FiO2 et PEEP selon table", () => {
    const r = ventSuggest({ vt: 420, rr: 16, peep: 5, fio2: 40 }, { ph: 7.4, paco2: 40, pao2: 50 }, 70);
    expect(r.proposed.fio2).toBe(50);
    expect(r.proposed.peep).toBe(8);
  });
});

describe("v2.0 calculs haut volume", () => {
  it("index de choc + PAM", () => {
    expect(shockIndex(100, 100)).toBeCloseTo(1);
    expect(shockIndexBand(1)).toBe(2);
    expect(shockIndexBand(0.6)).toBe(0);
    expect(shockIndexBand(1.5)).toBe(3);
    expect(meanArterialPressure(120, 60)).toBeCloseTo(80);
    expect(pulsePressure(120, 60)).toBe(60);
  });
  it("QTc", () => {
    const r = qtc(400, 75);
    expect(r.bazett).toBeCloseTo(447, 0);
    expect(qtcBand(470, true)).toBe(1);
    expect(qtcBand(510, false)).toBe(2);
  });
  it("énoxaparine rénale", () => {
    expect(enoxaparin(70, 80, "traitement").daily).toBe(140);
    expect(enoxaparin(70, 20, "traitement").freq).toBe("1/j");
    expect(enoxaparin(70, 20, "prophylaxie").daily).toBe(20);
  });
  it("thrombolyse paliers", () => {
    expect(tenecteplaseMg(55)).toBe(30);
    expect(tenecteplaseMg(75)).toBe(40);
    expect(tenecteplaseMg(95)).toBe(50);
    expect(alteplaseStroke(70).total).toBeCloseTo(63);
  });
  it("électrolytes", () => {
    expect(calciumCorrected(8, 3)).toBeCloseTo(8.8);
    expect(potassiumDeficit(3, 70)).toBe(42);
  });
  it("enfant + NAC", () => {
    expect(hollidaySegar(12)).toBe(1100);
    expect(dehydrationDeficit(5, 12)).toBe(600);
    const nac = nacProtocol(70)!;
    expect(nac[0].mg).toBe(10500);
    expect(nac[2].rate).toBe(62.5);
    expect(nivStart("bpco").ipap).toBe(12);
  });
});

describe("v2.2 scores & transfusion", () => {
  it("ABCD2 haut risque", () => {
    const s = abcd2({ age60: true, bp: true, symptom: "faiblesse", duration: "gt60", diabet: true });
    expect(s).toBe(7);
    expect(abcd2Band(7)).toBe(2);
    expect(abcd2Band(2)).toBe(0);
  });
  it("Alvarado", () => {
    const full = alvarado({ migration: true, anorexie: true, nausees: true, fdr: true, rebound: true, fievre: true, hyperleuco: true, deviation: true });
    expect(full).toBe(10);
    expect(alvaradoBand(5)).toBe(1);
    expect(alvaradoBand(2)).toBe(0);
  });
  it("transfusion massive 70 kg", () => {
    const r = massiveTransfusion(70)!;
    expect(r.gr).toBe(700);
    expect(r.plt).toBe(350);
    expect(r.unitsGr).toBe(2);
  });
});

describe("v2.3 unités RE.NAU + pompe auto", () => {
  it("flowForUnit toutes unités", () => {
    expect(flowForUnit("mg/min", 1, 70, 1000)).toBeCloseTo(60);
    expect(flowForUnit("g/h", 1, 70, 20000)).toBeCloseTo(50);
    expect(flowForUnit("UI/kg/h", 0.1, 70, 1)).toBeCloseTo(7);
    expect(flowForUnit("µg/min", 100, 70, 200)).toBeCloseTo(30);
  });
  it("pompe dérivée de la perfusion RE.NAU", () => {
    const c = pumpCfgFromPerfusion("noradrenaline")!;
    expect(c.unit).toBe("µg/kg/min");
    expect(c.defTarget).toBe(50);
    expect(c.defAmpMg).toBe(8);
    const t = pumpCfgFromPerfusion("trinitrine")!;
    expect(t.defAmpMg).toBeGreaterThan(0);
  });
  it("recherche par nom commercial tunisien", async () => {
    await loadSearchIndex(); // v17.0 — index chargé à la demande
    const keys = searchItems("aguettant", 5).map((i) => i.key);
    expect(keys).toContain("medicament:adrenaline");
  });
});

describe("v2.4 START", () => {
  it("marche → vert", () => {
    expect(startTriage({ ped: false, walks: true, breath: true, rr: 20, pulse: true, obeys: true })).toBe("green");
  });
  it("apnée → noir", () => {
    expect(startTriage({ ped: false, walks: false, breath: false, rr: 0, pulse: false, obeys: false })).toBe("black");
  });
  it("FR 36 → rouge ; pas de pouls radial → rouge ; conscient → jaune", () => {
    expect(startTriage({ ped: false, walks: false, breath: true, rr: 36, pulse: true, obeys: true })).toBe("red");
    expect(startTriage({ ped: false, walks: false, breath: true, rr: 24, pulse: false, obeys: true })).toBe("red");
    expect(startTriage({ ped: false, walks: false, breath: true, rr: 24, pulse: true, obeys: true })).toBe("yellow");
  });
  it("JumpSTART : FR 50 ou 10 → rouge", () => {
    expect(startTriage({ ped: true, walks: false, breath: true, rr: 50, pulse: true, obeys: true })).toBe("red");
    expect(startTriage({ ped: true, walks: false, breath: true, rr: 10, pulse: true, obeys: true })).toBe("red");
  });
});

describe("v2.4 START pas-à-pas", () => {
  it("FR 36 adulte → rouge immédiat", () => {
    expect(startTriageStep(false, { walks: false, breath: true, rr: 36 })).toBe("red");
  });
});

describe("v2.5 sevrage", () => {
  it("prêt seulement si tout est vrai", () => {
    expect(weaningReady([true, true, false])).toBe(false);
    expect(weaningReady([true, true])).toBe(true);
    expect(weaningReady([])).toBe(false);
  });
});

describe("v2.6 scores + MgSO4", () => {
  it("qSOFA ≥ 2", () => {
    expect(qsofa(24, 95, false)).toBe(2);
    expect(qsofa(16, 120, false)).toBe(0);
  });
  it("sPESI compte", () => {
    expect(spesi({ age80: true, cancer: false, hf: false, hr110: true, sbp100: false, spo290: false })).toBe(2);
  });
  it("HEART bandes", () => {
    expect(heartBand(3)).toBe("low");
    expect(heartBand(5)).toBe("mod");
    expect(heartBand(8)).toBe("high");
  });
  it("MgSO4 10 % : 4 g = 40 mL ; 1 g/h = 10 mL/h", () => {
    expect(mgso4DrawMl(10, 4)).toBe(40);
    expect(mgso4RateMlH(10, 1)).toBe(10);
    expect(mgso4RateMlH(50, 1)).toBe(2);
  });
});

describe("v2.7 DKA", () => {
  it("توسيع طفل 30 كغ = 300 مل وكبير = 1000 مل", () => {
    expect(dkaBolusMl(30, true)).toBe(300);
    expect(dkaBolusMl(70, false)).toBe(1000);
  });
  it("إنسولين 0.1/كغ وقرار البوتاسيوم", () => {
    expect(dkaInsulinUh(30)).toBe(3);
    expect(dkaKDecision(3.1)).toBe("hold");
    expect(dkaKDecision(4)).toBe("go");
    expect(dkaNeedsDextrose(2.2)).toBe(true);
  });
});

describe("v2.8 Broselow", () => {
  it("70 cm → rouge ; 150 → adulte ; 40 → neo", () => {
    const z = broselowZone(70);
    expect(typeof z === "object" ? z.color : z).toBe("red");
    expect(broselowZone(150)).toBe("adult");
    expect(broselowZone(40)).toBe("neo");
  });
  it("doses zone rouge (7,5 kg)", () => {
    const d = broselowDoses(broselowZone(70) as BroselowZone);
    expect(d.epiIvMg).toBe(0.08);
    expect(d.bolusMl).toBe(150);
    expect(d.defibJ).toBe(15);
  });
});

describe("v2.8 cohérence perfusions (garde-fou données)", () => {
  it("chaque perfusion RE.NAU produit une config pompe valide", () => {
    for (const p of PERFUSIONS) {
      const c = pumpCfgFromPerfusion(p.drugId);
      expect(c, p.drugId).toBeTruthy();
      expect(c!.defTarget, p.drugId).toBeGreaterThan(0);
    }
  });
});

describe("v3.0 monthsSince", () => {
  it("2026-08 → 1 mois en septembre 2026", () => {
    expect(monthsSince("2026-08", new Date(2026, 8, 14))).toBe(1);
    expect(monthsSince("2025-08", new Date(2026, 8, 14))).toBe(13);
  });
});

describe("v3.1 fmtMMSS", () => {
  it("75 s → 01:15", () => {
    expect(fmtMMSS(75)).toBe("01:15");
    expect(fmtMMSS(0)).toBe("00:00");
  });
});

describe("v3.2 reviewDueCount", () => {
  it("يعتبر ≥ 11 شهراً", () => {
    expect(reviewDueCount(["2025-10", "2026-08"], new Date(2026, 8, 14))).toBe(1);
    expect(reviewDueCount(["2026-08"], new Date(2026, 8, 14))).toBe(0);
  });
});

describe("v3.8 fmtJournal", () => {
  it("يؤرّخ الأسطر", () => {
    const txt = fmtJournal("J", [{ label: "Adrénaline", at: 72 }]);
    expect(txt).toContain("01:12  Adrénaline");
  });
});

describe("v4.0 daysSince", () => {
  it("يحسب الأيام بين تاريخ ISO والآن", () => {
    const now = new Date("2026-09-16T12:00:00Z");
    expect(daysSince("2026-08-07", now)).toBe(40);
    expect(daysSince("2026-09-16", now)).toBe(0);
  });
});

describe("v6.9 — الدوال الخمس المتبقية", () => {
  it("doseLadder : pas propres ≤ 11 lignes", () => {
    expect(doseLadder(6, 5, 1)).toEqual([]);
    expect(doseLadder(1, 20, 1)).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
    const n = doseLadder(0.05, 1, 0.05);
    expect(n[0]).toBeCloseTo(0.1);
    expect(n.length).toBeLessThanOrEqual(11);
  });
  it("sbtPassed / extubationOk : tous les critères sinon faux", () => {
    expect(sbtPassed([true, true])).toBe(true);
    expect(sbtPassed([true, false])).toBe(false);
    expect(sbtPassed([])).toBe(false);
    expect(extubationOk([true])).toBe(true);
    expect(extubationOk([])).toBe(false);
  });
  it("mgso4GPerMl : 50 % → 0,5 g/mL ; 4 g → 8 mL", () => {
    expect(mgso4GPerMl(50)).toBeCloseTo(0.5);
  });
  it("BROSELOW : 9 zones, gris ETT 3.0, vert Mac 2-3", () => {
    expect(BROSELOW.length).toBe(9);
    expect(BROSELOW[0].ettCuffed).toBe("3.0");
    expect(BROSELOW[8].blade).toBe("Mac 2-3");
  });
});

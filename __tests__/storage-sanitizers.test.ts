// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { sanitizeCounterMap, sanitizeStringArray, purgeLegacyPersistentPatientData } from "@/lib/storage";
import { sanitizeSamuFiche, type SamuFicheState } from "@/lib/samu-storage";
import { sanitizeRevalLog } from "@/lib/reval-log";
import { sanitizeProblems } from "@/lib/deterioration";
import { sanitizeChecks } from "@/lib/checklists-storage";
import { bumpLocal, readLocalStats, resetLocalStats } from "@/lib/analytics";
import { sanitizeDoseWeightState, sanitizeDripState, sanitizeGcsState, sanitizePerfusionState, sanitizePumpPreparation } from "@/lib/calculator-storage";

afterEach(() => {
  localStorage.clear();
});

describe("assainissement des données persistées hors préférences", () => {

  it("assainit la fiche SAMU sans conserver de forme inattendue ni de geste inconnu", () => {
    const empty: SamuFicheState = {
      missionType: "", vehicule: "", equipe: "", hAppel: "", hDepart: "", hSurLieux: "", hDepartLieux: "", hHopital: "",
      age: "", sexe: "", atcd: "", motif: "", fc: "", ta: "", fr: "", spo2: "", gcs: "", glycemie: "", temp: "",
      gestes: [], traitements: "", evolution: "", destination: "", transmissions: "",
    };
    expect(sanitizeSamuFiche({ age: { value: 35 }, motif: "x".repeat(5000), gestes: ["O₂", "unknown", "O₂"] }, empty)).toMatchObject({
      age: "", motif: "x".repeat(4000), gestes: ["O₂"],
    });
  });

  it("purge les anciennes fiches et journaux cliniques persistants", () => {
    for (const key of ["eutn:fiche-samu", "eutn:timeline", "eutn:timeline-log", "eutn:vitals-log", "eutn:problems", "reval:log:avc"]) {
      localStorage.setItem(key, "legacy");
    }
    purgeLegacyPersistentPatientData(localStorage);
    expect(localStorage.length).toBe(0);
  });

  it("normalise les compteurs et rejette les objets/tableaux/valeurs malformés", () => {
    expect(sanitizeCounterMap({ a: 3.9, b: -1, c: "4", d: Number.POSITIVE_INFINITY })).toEqual({ a: 3 });
    expect(sanitizeCounterMap([1, 2])).toEqual({});
    expect(sanitizeStringArray({ 0: "x" })).toEqual([]);
  });

  it("filtre verdicts de réévaluation, dates futures et scores hors domaine", () => {
    expect(sanitizeRevalLog([
      { at: 100, verdict: "worsen", mews: 14, qsofa: 3 },
      { at: 101, verdict: "bad", mews: 2 },
      { at: 200, verdict: "improve" },
      { at: 90, verdict: "stall", mews: 15, qsofa: -1 },
      null,
    ], 150)).toEqual([
      { at: 90, verdict: "stall" },
      { at: 100, verdict: "worsen", mews: 14, qsofa: 3 },
    ]);
  });

  it("reconstruit les complications depuis des règles connues uniquement", () => {
    const result = sanitizeProblems([
      { id: "oap-100", ruleId: "oap", at: 100, title: { fr: "faux", ar: "faux" }, vitals: "SpO2 85" },
      { id: "x-100", ruleId: "unknown", at: 100, title: {}, vitals: "x" },
    ], 150);
    expect(result).toHaveLength(1);
    expect(result[0].title.fr).not.toBe("faux");
  });

  it("n'accepte que les cases cochées appartenant aux checklists connues", () => {
    const result = sanitizeChecks({
      "transport-interhosp": { "transport-interhosp:0:0": true, "transport-interhosp:900:900": true },
      unknown: { "unknown:0:0": true },
      sepsis: null,
    });
    expect(result["transport-interhosp"]).toBeDefined();
    expect(Object.keys(result["transport-interhosp"])).toEqual(["transport-interhosp:0:0"]);
    expect(result.unknown).toBeUndefined();
  });

  it("valide les instantanés enregistrés des calculateurs avant restauration", () => {
    expect(sanitizePerfusionState({ idx: 999, weight: {}, dose: -2 }, 4)).toEqual({ idx: 0, weight: "70", dose: 0 });
    expect(sanitizeGcsState({ peds: "yes", sel: { eyes: 9, verbal: 3, motor: 6 } })).toBeNull();
    expect(sanitizeGcsState({ peds: true, sel: { eyes: 4, verbal: 5, motor: 6 } })).toEqual({ peds: true, sel: { eyes: 4, verbal: 5, motor: 6 } });
    expect(sanitizeDoseWeightState({ medId: "unknown", weight: "70" }, ["amoxicilline"])).toBeNull();
    expect(sanitizeDoseWeightState({ medId: "amoxicilline", weight: "Infinity" }, ["amoxicilline"])).toEqual({ medId: "amoxicilline", weight: "10" });
    expect(sanitizeDripState({ volume: "-10", hours: "NaN", dropsPerMl: 100 })).toEqual({ volume: "500", hours: "8", dropsPerMl: 20 });
    expect(sanitizePumpPreparation({ ampMg: -1, ampVol: 2, count: 1.5, target: 50, convention: "hack" }, { ampMg: 8, ampVol: 4, count: 1, target: 50, convention: "total" })).toEqual({ ampMg: 8, ampVol: 2, count: 1, target: 50, convention: "total" });
  });

  it("nettoie les compteurs locaux malformés avant lecture et incrément", () => {
    localStorage.setItem("eutn:stats-v1", JSON.stringify({ "calculator_use:abc": 4, bad: "x" }));
    expect(readLocalStats()).toEqual({ "calculator_use:abc": 4 });
    bumpLocal("calculator_use:def");
    expect(readLocalStats()).toEqual({ "calculator_use:abc": 4, "calculator_use:def": 1 });
    resetLocalStats();
    expect(readLocalStats()).toEqual({});
  });
});

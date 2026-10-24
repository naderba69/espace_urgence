import { describe, expect, it } from "vitest";
import { procedures } from "../data/procedures";
import { protocols } from "../data/protocols";
import { decisionTrees } from "../data/trees";
import { TRIAGE_CASES } from "../data/triage";
import { GCASES } from "../data/guidage";
import { QUIZ } from "../data/quiz";
import { revals } from "../data/reval";

const byId = (id: string) => {
  const procedure = procedures.find((item) => item.id === id);
  if (!procedure) throw new Error(`Procedure manquante : ${id}`);
  return procedure;
};

const textOf = (procedureId: string) => {
  const procedure = byId(procedureId);
  return [procedure.title, ...procedure.equipment, ...procedure.steps, ...procedure.nursing,
    ...(procedure.checklist?.pre ?? []), ...(procedure.checklist?.post ?? [])]
    .flatMap((item) => [item.fr, item.ar]).join(" ");
};

describe("corrections de sécurité des procédures", () => {
  it("sépare la défibrillation sans pouls de la cardioversion synchronisée avec pouls", () => {
    expect(byId("defibrillation").steps[0].fr).toMatch(/arrêt cardiaque sans pouls.*non synchronisé/i);
    expect(byId("defibrillation").steps[0].fr).toContain("cardioversion synchronisée");
    expect(textOf("synchronized-cardioversion")).toMatch(/activer SYNC/i);
    expect(textOf("synchronized-cardioversion")).toContain("Ne pas déclencher automatiquement la RCP");
    expect(new Set(procedures.map((item) => item.id)).size).toBe(procedures.length);
  });

  it("n'affiche plus de délais universels non sourcés pour les gestes", () => {
    expect(procedures.every((item) => !("stepTimes" in item))).toBe(true);
    expect(textOf("iot-rsi")).not.toMatch(/30 s max|30 ث|SpO2 100|1,2 mg\/kg|1\.2 mg\/kg|6 cycles/i);
    expect(textOf("vvp")).not.toMatch(/18-22|18–22|7-10 cm|15-30°|2-5 mL/i);
    expect(textOf("intra-osseuse")).not.toMatch(/90 secondes|90 ث|idéal < 6 h|المثلى أقل من 6/i);
  });

  it("indique les recommandations actualisées d'oxygénation et de ventilation néonatales", () => {
    const neonatal = byId("neonat-ran");
    expect(neonatal.timeTarget?.fr).toMatch(/Si une VPP est indiquée.*60 s/);
    expect(neonatal.steps[2].fr).toContain("30–60/min");
    expect(neonatal.steps[2].fr).toContain("≥35 semaines, 21 %");
    expect(neonatal.steps[2].fr).toContain("32 à 34+6 semaines, 21–30 %");
    expect(neonatal.steps[2].fr).toContain("<32 semaines, 30–100 %");
    expect(neonatal.steps[4].fr).toContain("0,01–0,03 mg/kg");
    expect(neonatal.steps[4].ar).toContain("غسل 3 مل");
    expect(textOf("neonat-ran")).toMatch(/Ne pas aspirer systématiquement/);
  });

  it("ne transforme pas un site ou un calibre de décompression thoracique en règle universelle", () => {
    const protocol = protocols.find((item) => item.id === "pneumothorax-suffocant");
    expect(protocol).toBeDefined();
    const protocolText = JSON.stringify(protocol);
    expect(protocolText).toMatch(/protocole trauma local/i);
    expect(protocolText).not.toMatch(/14[-–]16\s*G|28-32 Ch|24-28 F|4ᵉ[-–]5ᵉ EIC|2ᵉ EIC|المسافة الرابعة|28-32/);

    const penetratingThorax = protocols.find((item) => item.id === "thorax-penetrant");
    const thoraxText = JSON.stringify(penetratingThorax);
    expect(thoraxText).toMatch(/protocole trauma local/i);
    expect(thoraxText).not.toMatch(/28-32 Ch|4ᵉ[-–]5ᵉ EIC|ligne médio-axillaire|28-32/);

    const arrestTree = decisionTrees.find((tree) => tree.id === "acr");
    expect(JSON.stringify(arrestTree)).not.toMatch(/décompression \(4ᵉEIC\)|بزل بالمسافة الرابعة/);
  });

  it("restreint le plan dur à l'extraction et rappelle les limites de la décompression", () => {
    expect(textOf("immobilisation-rachis")).toContain("pas de transport");
    expect(textOf("exsufflation")).toContain("ne pas l'utiliser seule comme guide technique");
    expect(textOf("exsufflation")).toMatch(/ne fixe pas de longueur universelle/i);
  });

  it("harmonise les rappels thoraciques sans technique universelle ni drainage automatique", () => {
    const traumaProtocol = protocols.find((item) => item.id === "polytraumatisme");
    const penetratingProtocol = protocols.find((item) => item.id === "thorax-penetrant");
    const asthmaProtocol = protocols.find((item) => item.id === "asthme-aigu-grave");
    const traumaTriage = TRIAGE_CASES.find((item) => item.id === "polytrauma");
    const traumaTree = decisionTrees.find((item) => item.id === "polytraumatisme");
    const respiratoryGuidance = GCASES.find((item) => item.id === "detresse-resp");
    const pneumothoraxQuiz = QUIZ.find((item) => item.q.fr.includes("Pneumothorax compressif"));
    const traumaRevaluation = revals.polytraumatisme;
    const pneumothoraxRevaluation = revals["pneumothorax-suffocant"];

    expect(traumaProtocol).toBeDefined();
    expect(penetratingProtocol).toBeDefined();
    expect(asthmaProtocol).toBeDefined();
    expect(traumaTriage).toBeDefined();
    expect(traumaTree).toBeDefined();
    expect(respiratoryGuidance).toBeDefined();
    expect(pneumothoraxQuiz).toBeDefined();
    expect(traumaRevaluation).toBeDefined();
    expect(pneumothoraxRevaluation).toBeDefined();

    expect(JSON.stringify(traumaProtocol)).toMatch(/filière locale/i);
    expect(JSON.stringify(traumaProtocol)).not.toMatch(/exsufflation immédiate|pansement 3 côtés/i);
    expect(JSON.stringify(penetratingProtocol)).toMatch(/protocole trauma local/i);
    expect(JSON.stringify(penetratingProtocol)).not.toMatch(/pansement occlusif 3 côtés|4 côtés/i);
    expect(JSON.stringify(asthmaProtocol)).toMatch(/filière locale/i);
    expect(JSON.stringify(asthmaProtocol)).not.toMatch(/Exsufflation\/drainage en urgence/i);
    expect(JSON.stringify(traumaTriage)).toMatch(/suivre la filière locale/i);
    expect(JSON.stringify(traumaTriage)).not.toMatch(/45°|exsufflation/i);
    expect(JSON.stringify(traumaTree)).toMatch(/protocole trauma local/i);
    expect(JSON.stringify(traumaTree)).not.toMatch(/exsufflation|seal thoracique/i);
    expect(JSON.stringify(respiratoryGuidance)).toMatch(/ne prescrit pas un geste thoracique automatique/i);
    expect(JSON.stringify(pneumothoraxQuiz)).toMatch(/protocole local/i);
    expect(JSON.stringify(pneumothoraxQuiz)).not.toMatch(/Exsufflation à l'aiguille|بإبرة ثم درنقة/i);
    expect(JSON.stringify(traumaRevaluation)).toMatch(/filière locale/i);
    expect(JSON.stringify(traumaRevaluation)).not.toMatch(/décompression thoracique si suspicion/i);
    expect(JSON.stringify(pneumothoraxRevaluation)).toMatch(/protocole local/i);
    expect(JSON.stringify(pneumothoraxRevaluation)).not.toMatch(/Décompression bilatérale|Drain thoracique \+ contrôle radiologique/i);
  });
});

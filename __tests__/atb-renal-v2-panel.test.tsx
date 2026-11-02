// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AtbRenalV2Panel from "@/components/atb/AtbRenalV2Panel";

afterEach(cleanup);

describe("intégration du sélecteur rénal V2", () => {
  it("reste fermé par défaut et intègre l’explication du compte 184", () => {
    const { container } = render(<AtbRenalV2Panel dfg={42.7} eligible />);
    expect(screen.getByRole("status").textContent).toContain("les posologies V2 restent masquées");
    expect(screen.queryByTestId("atb-v2-result")).toBeNull();
    expect(container.textContent).toContain("198 observations de frontières internes");
    expect(container.textContent).toContain("n’est pas reproductible");
    expect(container.textContent).not.toMatch(/[\u0600-\u06ff]/);
  });

  it("n’ouvre les posologies de travail qu’après un clic explicite en mode revue", () => {
    render(<AtbRenalV2Panel dfg={40} eligible reviewAvailable />);
    expect(screen.queryByTestId("atb-v2-result")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Ouvrir V2 pour revue — ne pas prescrire" }));
    expect(screen.getByRole("alert").textContent).toContain("MODE DE REVUE UNIQUEMENT");
    fireEvent.change(screen.getByLabelText("Antibiotique — choix du médecin"), {
      target: { value: "cefiderocol-iv" },
    });
    expect(screen.getByTestId("atb-v2-result").textContent).toContain("1,5 g/8h");
    expect(screen.getByTestId("atb-v2-result").textContent).toContain("ligne L1");
  });

  it("exige le choix médical du contexte avant d’afficher une ligne parmi plusieurs", () => {
    render(<AtbRenalV2Panel dfg={20.25} eligible active />);
    fireEvent.change(screen.getByLabelText("Antibiotique — choix du médecin"), {
      target: { value: "amoxicilline-acide-clavulanique-iv" },
    });
    expect(screen.getByRole("status").textContent).toContain("Aucun schéma n’est sélectionné par défaut");
    expect(screen.queryByTestId("atb-v2-result")).toBeNull();

    fireEvent.change(screen.getByLabelText("Indication et schéma — choix du médecin"), {
      target: { value: "amoxicilline-acide-clavulanique-iv-l1" },
    });
    expect(screen.getByTestId("atb-v2-result").textContent).toContain("DC de 1 g puis 500 mg/8h");
    expect(screen.getByTestId("atb-v2-result").textContent).toContain("ligne L1");
  });

  it("refuse la sélection à 30 uniquement pour une ligne qui porte le seuil 30", () => {
    render(<AtbRenalV2Panel dfg={30} eligible active />);
    fireEvent.change(screen.getByLabelText("Antibiotique — choix du médecin"), {
      target: { value: "cefiderocol-iv" },
    });
    expect(screen.getByTestId("atb-v2-result").textContent).toContain("Sélection suspendue à la limite de 30 mL/min");
    expect(screen.getByTestId("atb-v2-result").textContent).not.toContain("2 g/8h");
  });

  it("signale la limite arrondie tout en sélectionnant avec le DFG brut", () => {
    render(<AtbRenalV2Panel dfg={89.6} eligible active />);
    fireEvent.change(screen.getByLabelText("Antibiotique — choix du médecin"), {
      target: { value: "cefiderocol-iv" },
    });
    expect(screen.getByTestId("atb-v2-result").textContent).toContain("DFG brut calculé 89,6");
    expect(screen.getByTestId("atb-v2-result").textContent).toContain("60 ≤ DFG < 90");
    expect(screen.getByTestId("atb-v2-result").textContent).toContain("seuil de cette ligne 90");
    expect(screen.getByTestId("atb-v2-result").textContent).toContain("2 g/8h");
    expect(screen.getByTestId("atb-v2-result").textContent).toContain("Régime inférieur adjacent, à titre indicatif");
  });

  it("filtre par plusieurs mots sans accents et détaille les intervalles avec la ligne patient", () => {
    render(<AtbRenalV2Panel dfg={50} clCrCg={43.2} eligible active />);
    fireEvent.change(screen.getByLabelText("Rechercher un antibiotique (plusieurs mots acceptés)"), {
      target: { value: "cefepime im" },
    });
    expect(screen.getByRole("option", { name: "Céfépime IV (*IM possible)" })).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Antibiotique — choix du médecin"), {
      target: { value: "cefepime-iv-im-possible" },
    });
    fireEvent.change(screen.getByLabelText("Indication et schéma — choix du médecin"), {
      target: { value: "cefepime-iv-im-possible-l2" },
    });
    const clCrToggle = screen.getByRole("button", { name: /Cockcroft–Gault.*ClCr — information RCP seulement/ });
    expect(clCrToggle.textContent).toContain("43,2");
    expect(screen.getByTestId("atb-v2-result").textContent).toContain("2 g/12h");
    fireEvent.click(clCrToggle);
    expect(screen.getByTestId("atb-v2-result").textContent).toContain("2 g/12h");
    expect(screen.getByTestId("atb-v2-result").textContent).toContain("Limite exacte");
    fireEvent.click(screen.getByRole("button", { name: "Détails des seuils" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.textContent).toContain("2 g/12h");
    expect(dialog.textContent).toContain("50");
    expect(dialog.textContent).toContain("patient");
  });

  it("garde l’interface française et marque les traductions arabes comme non validées", () => {
    const { container } = render(<AtbRenalV2Panel dfg={50} eligible active lang="fr" />);
    expect(screen.getByRole("heading", { name: "ATB — fonction rénale" })).toBeTruthy();
    expect(container.querySelector("[dir='ltr']")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Rechercher un antibiotique (plusieurs mots acceptés)"), {
      target: { value: "cefepime" },
    });
    fireEvent.change(screen.getByLabelText("Antibiotique — choix du médecin"), {
      target: { value: "cefepime-iv-im-possible" },
    });
    expect(screen.getByText("Traduction arabe provisoire, en attente de relecture humaine ; seul le texte français de la source est affiché.")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Indication et schéma — choix du médecin"), {
      target: { value: "cefepime-iv-im-possible-l1" },
    });
    const result = screen.getByTestId("atb-v2-result");
    const doseTexts = [...result.querySelectorAll("bdi[dir='ltr']")].map((item) => item.textContent ?? "");
    expect(doseTexts.some((text) => /\d.*(?:g|mg)/i.test(text))).toBe(true);
    expect(result.textContent).not.toMatch(/[\u0600-\u06ff]/);
  });

  it("garde le focus dans le détail, ferme avec Échap et rend le focus au bouton déclencheur", () => {
    render(<AtbRenalV2Panel dfg={50} eligible active />);
    fireEvent.change(screen.getByLabelText("Antibiotique — choix du médecin"), {
      target: { value: "cefepime-iv-im-possible" },
    });
    fireEvent.change(screen.getByLabelText("Indication et schéma — choix du médecin"), {
      target: { value: "cefepime-iv-im-possible-l2" },
    });
    const trigger = screen.getByRole("button", { name: "Détails des seuils" });
    trigger.focus();
    fireEvent.click(trigger);
    const close = screen.getByRole("button", { name: "Fermer le détail" });
    expect(document.activeElement).toBe(close);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("affiche le statut arabe provisoire sans afficher le texte arabe copié et garde le badge TDM", () => {
    render(<AtbRenalV2Panel dfg={70} eligible active />);
    fireEvent.change(screen.getByLabelText("Antibiotique — choix du médecin"), {
      target: { value: "amikacine-iv" },
    });
    const panel = screen.getByRole("region", { name: "ATB — fonction rénale" });
    expect(panel.textContent).toContain("Traduction arabe provisoire");
    expect(panel.textContent).toContain("seul le texte français de la source est affiché");
    expect(panel.textContent).toContain("Surveillance plasmatique / thérapeutique requise");
    expect(panel.textContent).toContain("Surveillance plasmatique");
    expect(panel.textContent).toContain("15 à 30 mg/kg/j");
    expect(panel.textContent).not.toMatch(/[\u0600-\u06ff]/);
  });
});

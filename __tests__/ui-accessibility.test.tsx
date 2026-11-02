// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { ComponentType } from "react";

const appState = vi.hoisted(() => ({ emergencyOpen: false, lang: "fr" as "fr" | "ar", updateReady: false }));

vi.mock("@/components/Providers", () => ({
  useApp: () => ({
    t: (key: string) => key,
    hydrated: true,
    lang: appState.lang,
    emergencyOpen: appState.emergencyOpen,
    isFav: () => false,
    toggleFav: () => undefined,
    updateReady: appState.updateReady,
    dismissUpdate: () => undefined,
  }),
}));
vi.mock("@/lib/modal-focus", () => ({ useModalFocusTrap: () => undefined }));
vi.mock("@/components/SearchBar", () => ({ useRegisterRecent: () => undefined }));
vi.mock("@/lib/hooks", () => ({ useWakeLock: () => undefined }));

import DisclaimerGate from "@/components/DisclaimerGate";
import NumStepper from "@/components/ui/NumStepper";
import ProceduresPage from "@/app/procedures/page";
import ChecklistsPage from "@/app/checklists/page";
import TerrainPage from "@/app/terrain/page";
import TreesHub from "@/app/arbres/page";
import FluidsEnfantPage from "@/app/calculateurs/fluids-enfant/page";
import SodiumPage from "@/app/calculateurs/sodium/page";
import EcgPage from "@/app/ecg/page";
import FicheSamuPage from "@/app/fiche-samu/page";
import StatsPage from "@/app/stats/page";
import TreeRunner from "@/components/trees/TreeRunner";
import UpdateBanner from "@/components/UpdateBanner";
import { Sheet } from "@/components/tools/ui";

afterEach(cleanup);
beforeEach(() => {
  localStorage.clear();
  appState.emergencyOpen = false;
  appState.lang = "fr";
  appState.updateReady = false;
});

describe("accessibilité des commandes prioritaires", () => {
  it("la première visite ne masque pas le mode urgence et réaffiche ensuite l’avertissement", async () => {
    appState.emergencyOpen = true;
    const { rerender } = render(<DisclaimerGate />);

    expect(screen.queryByRole("alertdialog")).toBeNull();

    appState.emergencyOpen = false;
    rerender(<DisclaimerGate />);
    expect(await screen.findByRole("alertdialog")).toBeTruthy();
  });

  it("conserve l’avertissement bloquant lors d’une première visite normale", async () => {
    render(<DisclaimerGate />);
    expect(await screen.findByRole("alertdialog")).toBeTruthy();
  });

  it("donne un titre de niveau 1 à la liste des procédures et localise les badges", () => {
    const { container } = render(<ProceduresPage />);
    expect(screen.getByRole("heading", { level: 1, name: /Procédures d’urgence/ })).toBeTruthy();
    expect(container.textContent).toContain("Liste de contrôle");
    expect(container.textContent).not.toContain("checklist");
  });

  it("n’imbrique pas d’en-tête sémantique dans l’en-tête des check-lists", () => {
    const { container } = render(<ChecklistsPage />);
    expect(screen.getByRole("heading", { level: 1, name: /checklists\.title/ })).toBeTruthy();
    expect(container.querySelector("header header")).toBeNull();
  });

  it("évite les en-têtes sémantiques imbriqués sur les autres pages avec PageHeader", () => {
    const pages = [TreesHub, FluidsEnfantPage, SodiumPage, EcgPage, FicheSamuPage, StatsPage];
    for (const Page of pages) {
      const { container, unmount } = render(<Page />);
      expect(container.querySelector("header header")).toBeNull();
      expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
      unmount();
    }
  });

  it("localise le nom accessible de la section de réévaluation", async () => {
    const [{ revals }, { default: RevalPanel }] = await Promise.all([
      import("@/data/reval"),
      import("@/components/details/RevalPanel"),
    ]);
    const props = { reval: revals.anaphylaxie, protocolId: "a11y-reval" };
    const { rerender } = render(<RevalPanel {...props} />);
    expect(screen.getByRole("region", { name: "Réévaluation" })).toBeTruthy();

    appState.lang = "ar";
    rerender(<RevalPanel {...props} />);
    expect(screen.getByRole("region", { name: "إعادة التقييم" })).toBeTruthy();
  });

  it("localise le groupe de choix du fournisseur IA", async () => {
    const [{ default: AiSection }, aiConfig] = await Promise.all([
      import("@/components/ai/AiSection"),
      import("@/lib/ai-config"),
    ]);
    aiConfig.writeAiConfig({ ...aiConfig.DEFAULT_AI, enabled: true });
    try {
      const { rerender } = render(<AiSection />);
      expect(screen.getByRole("group", { name: "Fournisseur" })).toBeTruthy();
      appState.lang = "ar";
      rerender(<AiSection />);
      expect(screen.getByRole("group", { name: "المزوّد" })).toBeTruthy();
    } finally {
      cleanup();
      aiConfig.writeAiConfig(aiConfig.DEFAULT_AI);
    }
  });

  it("localise les commandes du bandeau de mise à jour et de la feuille mobile", () => {
    appState.updateReady = true;
    const { rerender } = render(<UpdateBanner />);
    expect(screen.getByRole("link", { name: "Notes de version" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Fermer" })).toBeTruthy();

    appState.lang = "ar";
    rerender(<><UpdateBanner /><Sheet open onClose={() => undefined} title="عنوان">محتوى</Sheet></>);
    expect(screen.getByRole("link", { name: "سجل التغييرات" })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "إغلاق" }).length).toBeGreaterThan(0);
  });

  it("localise les noms de groupes des calculateurs dans les deux langues", async () => {
    const pages = await Promise.all([
      import("@/app/calculateurs/sodium/page"),
      import("@/app/calculateurs/insuline/page"),
      import("@/app/calculateurs/debit-perfusion/page"),
      import("@/app/calculateurs/ventilateur/page"),
      import("@/app/calculateurs/gcs/page"),
      import("@/app/calculateurs/amines/page"),
      import("@/app/calculateurs/thrombolyse/page"),
      import("@/app/calculateurs/heparine/page"),
      import("@/app/calculateurs/sepsis-commandement/page"),
    ]);
    const cases: { Page: ComponentType; fr: string[]; ar: string[] }[] = [
      { Page: pages[0].default, fr: ["Facteur d’eau corporelle totale (TBW)", "Soluté choisi"], ar: ["عامل الماء الكلي في الجسم", "المحلول المختار"] },
      { Page: pages[1].default, fr: ["Concentration de l’insuline"], ar: ["تركيز الإنسولين"] },
      { Page: pages[2].default, fr: ["Type de perfuseur"], ar: ["نوع مجموعة التسريب"] },
      { Page: pages[3].default, fr: ["Sexe"], ar: ["الجنس"] },
      { Page: pages[4].default, fr: ["Population cible"], ar: ["الفئة العمرية"] },
      { Page: pages[5].default, fr: ["Médicament vasoactif", "Convention de volume", "Mode de l’outil"], ar: ["الدواء الوعائي", "طريقة تحديد الحجم", "وضع الأداة"] },
      { Page: pages[6].default, fr: ["Indication"], ar: ["الاستطباب"] },
      { Page: pages[7].default, fr: ["Indication de l’héparine", "Concentration de la seringue"], ar: ["استطباب الهيبارين", "تركيز المحقنة"] },
      { Page: pages[8].default, fr: ["Contexte antibiotique"], ar: ["سياق المضاد الحيوي"] },
    ];

    for (const { Page, fr, ar } of cases) {
      appState.lang = "fr";
      const { rerender, unmount } = render(<Page />);
      for (const name of fr) {
        const matches = [...screen.queryAllByRole("group", { name }), ...screen.queryAllByRole("combobox", { name })];
        expect(matches.length).toBeGreaterThan(0);
      }
      appState.lang = "ar";
      rerender(<Page />);
      for (const name of ar) {
        const matches = [...screen.queryAllByRole("group", { name }), ...screen.queryAllByRole("combobox", { name })];
        expect(matches.length).toBeGreaterThan(0);
      }
      unmount();
    }
  });

  it("n’affiche qu’un titre principal dans un arbre et localise sa commande de réinitialisation", async () => {
    const { decisionTrees } = await import("@/data/trees");
    const tree = decisionTrees.find((item) => item.id === "acr");
    if (!tree) throw new Error("Arbre ACR introuvable pour le test");

    const { container, rerender } = render(<TreeRunner tree={tree} />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Recommencer" })).toBeTruthy();

    appState.lang = "ar";
    rerender(<TreeRunner tree={tree} />);
    expect(screen.getByRole("button", { name: "إعادة البدء" })).toBeTruthy();
  });

  it("nomme les commandes de poids du mode terrain en français", () => {
    render(<TerrainPage />);
    expect(screen.getByRole("button", { name: "Diminuer le poids du patient" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Augmenter le poids du patient" })).toBeTruthy();
  });

  it("localise les noms de navigation et de sections des fiches détail", async () => {
    const [{ protocols }, { protocolDetailProps }, { default: ProtocolDetail }] = await Promise.all([
      import("@/data/protocols"),
      import("@/lib/protocol-props"),
      import("@/components/details/ProtocolDetail"),
    ]);
    const protocol = protocols.find((item) => item.id === "avc");
    if (!protocol) throw new Error("Protocole AVC introuvable pour le test");
    render(<ProtocolDetail {...protocolDetailProps(protocol)} />);
    expect(screen.getByRole("navigation", { name: "Sections" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Étapes" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Points-clés" })).toBeTruthy();
    cleanup();

    const [{ getMedication }, { medicationDetailProps }, { default: MedicationDetail }] = await Promise.all([
      import("@/data/medications"),
      import("@/lib/medication-props"),
      import("@/components/details/MedicationDetail"),
    ]);
    const medication = getMedication("adrenaline");
    if (!medication) throw new Error("Adrénaline introuvable pour le test");
    render(<MedicationDetail {...medicationDetailProps(medication)} />);
    expect(screen.getByRole("navigation", { name: "Sections" })).toBeTruthy();
  });

  it("annonce le nom français du champ et des commandes d’incrément", () => {
    render(
      <label>
        Poids (kg)
        <NumStepper value="70" onValue={() => undefined} label="Poids (kg)" />
      </label>,
    );

    expect(screen.getByRole("spinbutton", { name: "Poids (kg)" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Diminuer Poids (kg)" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Augmenter Poids (kg)" })).toBeTruthy();
  });
});

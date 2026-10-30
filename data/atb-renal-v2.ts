// Base posologique continue dérivée de la transcription fournie du tableau OMEDIT V2.3 (avril 2026).
// Les doses restent textuelles; cellulePourDFG ne fait aucun calcul ni extrapolation clinique.
// Les seuils sont lus sur les colonnes du PDF. E1 applique la borne haute exclusive; E2 refuse DFG=30
// seulement si la ligne porte ce seuil. Cette convention d'application reste explicitement signalée par E3.
// Les champs ar reprennent provisoirement le texte source français : ce ne sont PAS des traductions.

/** Drapeau de déploiement : désactivé jusqu’à parité complète et revue humaine documentée. */
export const ATB_RENAL_V2_ENABLED = false;
import type { AtbRenalRow } from "@/data/atb-renal";
import { ATB_RENAL_ROWS } from "@/data/atb-renal";
import type { RegimeAtb } from "@/lib/atb-renal-dose";

export interface AtbRenalDoseRow extends AtbRenalRow {
  alias: readonly string[];
  surveillance: boolean;
  regimes: readonly RegimeAtb[];
  sourceNotes: readonly { fr: string; ar: string }[];
  traductionStatut: "fr-seul" | "ar-provisoire" | "ar-valide";
  lastReviewed: string;
}

const REGIMES: Record<string, RegimeAtb[]> = {
  "amoxicilline-po": [
    {
      id: "amoxicilline-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 1, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g/8h", ar: "1 g/8h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 1 g puis 500 mg/8h", ar: "DC de 1 g puis 500 mg/8h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 1 g puis 750 mg/24h", ar: "DC de 1 g puis 750 mg/24h" } }
      ] },
    },
    {
      id: "amoxicilline-po-l2", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 1, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g/12h", ar: "1 g/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 1 g puis 500 mg/12h", ar: "DC de 1 g puis 500 mg/12h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 1 g puis 500 mg/24h", ar: "DC de 1 g puis 500 mg/24h" } }
      ] },
    }
  ],
  "amoxicilline-iv": [
    {
      id: "amoxicilline-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 1, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "100 mg/kg/24h en 4 injections", ar: "100 mg/kg/24h en 4 injections" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "50 mg/kg/24h", ar: "50 mg/kg/24h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "25 mg/kg/24h", ar: "25 mg/kg/24h" } }
      ] },
    },
    {
      id: "amoxicilline-iv-l2", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 1, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "200 mg/kg/24h en 6 injections", ar: "200 mg/kg/24h en 6 injections" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "100 mg/kg/24h", ar: "100 mg/kg/24h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "50 mg/kg/24h", ar: "50 mg/kg/24h" } }
      ] },
    }
  ],
  "amoxicilline-acide-clavulanique-po": [
    {
      id: "amoxicilline-acide-clavulanique-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 1, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g/8h", ar: "1 g/8h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 1 g puis 500 mg/8h", ar: "DC de 1 g puis 500 mg/8h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 1 g puis 750 mg/24h", ar: "DC de 1 g puis 750 mg/24h" } }
      ] },
    }
  ],
  "amoxicilline-acide-clavulanique-iv": [
    {
      id: "amoxicilline-acide-clavulanique-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 1, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g/8h", ar: "1 g/8h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 1 g puis 500 mg/8h", ar: "DC de 1 g puis 500 mg/8h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 1 g puis 750 mg/24h", ar: "DC de 1 g puis 750 mg/24h" } }
      ] },
    },
    {
      id: "amoxicilline-acide-clavulanique-iv-l2", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 1, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "2 g/8h", ar: "2 g/8h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "3 g/24h", ar: "3 g/24h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1,5 g/24h", ar: "1,5 g/24h" } }
      ] },
    }
  ],
  "ampicilline-sulbactam-iv": [
    {
      id: "ampicilline-sulbactam-iv-l1", indication: "Posologie usuelle", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 2, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 à 2 g /6 à 12h", ar: "1 à 2 g /6 à 12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 1 g puis 500 mg/12h", ar: "DC de 1 g puis 500 mg/12h" } },
      { seuil: 10, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 1 g puis 250 mg/12h", ar: "DC de 1 g puis 250 mg/12h" } }
      ] },
    },
    {
      id: "ampicilline-sulbactam-iv-l2", indication: "Infection à Acinetobacter spp", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 2, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "3 g /6 à 8h", ar: "3 g /6 à 8h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "3 g/12h", ar: "3 g/12h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "3 g/24h", ar: "3 g/24h" } }
      ] },
    }
  ],
  "ampicilline-sulbactam-im": [
    {
      id: "ampicilline-sulbactam-im-l1", indication: "Standard", voie: "IM",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 2, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g/12h", ar: "1 g/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/12h", ar: "500 mg/12h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 mg/12h", ar: "250 mg/12h" } }
      ] },
    }
  ],
  "benzathine-benzylpenicilline-im": [
    {
      id: "benzathine-benzylpenicilline-im-l1", indication: "Standard", voie: "IM",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 2, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "2,4 MUI tous les 8 jours", ar: "2,4 MUI tous les 8 jours" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1,8 MUI tous les 8 jours", ar: "1,8 MUI tous les 8 jours" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    },
    {
      id: "benzathine-benzylpenicilline-im-l2", indication: "Standard", voie: "IM",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 2, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1,2 MUI toutes les 3 à 4 semaines", ar: "1,2 MUI toutes les 3 à 4 semaines" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "0,9 MUI toutes les 3 à 4 semaines", ar: "0,9 MUI toutes les 3 à 4 semaines" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "benzylpenicilline-sodique-im-ou-iv": [
    {
      id: "benzylpenicilline-sodique-im-ou-iv-l1", indication: "Standard", voie: "IM ou IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 2, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "12 à 24 MUI/j en 6 injections ou en perfusion continue", ar: "12 à 24 MUI/j en 6 injections ou en perfusion continue" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "3 MUI/4h", ar: "3 MUI/4h" } },
      { seuil: 45, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "2 MUI/4h", ar: "2 MUI/4h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 MUI/4h", ar: "1 MUI/4h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "0,5 MUI/6h", ar: "0,5 MUI/6h" } }
      ] },
    }
  ],
  "cloxacilline-po": [
    {
      id: "cloxacilline-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 2, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "50 mg/kg/24h en 3 prises (sans dépasser 4 g/24h)", ar: "50 mg/kg/24h en 3 prises (sans dépasser 4 g/24h)" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "cloxacilline-iv": [
    {
      id: "cloxacilline-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 2, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "100 à 200 mg/kg/24h en 6 perfusions de 30 à 60 min OU DC de 2 g en perfusion de 60 min puis 100 à 200 mg/kg/24h en perfusion continue", ar: "100 à 200 mg/kg/24h en 6 perfusions de 30 à 60 min OU DC de 2 g en perfusion de 60 min puis 100 à 200 mg/kg/24h en perfusion continue" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "oxacilline-iv": [
    {
      id: "oxacilline-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 2, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "100 à 200 mg/kg/24h en 6 perfusions de 30 à 60 min toutes les 4h OU DC de 2 g en perfusion de 60 min puis 100 à 200 mg/kg/24h en perfusion continue", ar: "100 à 200 mg/kg/24h en 6 perfusions de 30 à 60 min toutes les 4h OU DC de 2 g en perfusion de 60 min puis 100 à 200 mg/kg/24h en perfusion continue" } }
      ] },
    }
  ],
  "phenoxymethyl-penicilline-po": [
    {
      id: "phenoxymethyl-penicilline-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 2, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 MUI/6 à 8h", ar: "1 MUI/6 à 8h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "piperacilline-iv": [
    {
      id: "piperacilline-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 2, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "4 g/6 à 8h", ar: "4 g/6 à 8h" } },
      { seuil: 40, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "4 g/8h", ar: "4 g/8h" } },
      { seuil: 20, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "4 g/12h", ar: "4 g/12h" } }
      ] },
    }
  ],
  "piperacilline-tazobactam-iv": [
    {
      id: "piperacilline-tazobactam-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 3, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "4 g/6 à 8h", ar: "4 g/6 à 8h" } },
      { seuil: 40, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "4 g/8h", ar: "4 g/8h" } },
      { seuil: 20, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "4 g/12h", ar: "4 g/12h" } }
      ] },
    }
  ],
  "pivmecillinam-po": [
    {
      id: "pivmecillinam-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 3, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "400 mg/8 à 12h", ar: "400 mg/8 à 12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 400 mg puis 200 mg/8 à 12h", ar: "DC de 400 mg puis 200 mg/8 à 12h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 400 mg puis 200 mg/24h", ar: "DC de 400 mg puis 200 mg/24h" } }
      ] },
    }
  ],
  "temocilline-iv": [
    {
      id: "temocilline-iv-l1", indication: "Administration discontinue", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 3, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "2 g/8 à 12h en perfusion de 30 min", ar: "2 g/8 à 12h en perfusion de 30 min" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/12h", ar: "1 g/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/24h", ar: "1 g/24h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/24h", ar: "500 mg/24h" } }
      ] },
    },
    {
      id: "temocilline-iv-l2", indication: "Perfusion continue", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 3, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "DC de 2 g en perfusion de 30 min puis 6 g/24h en perfusion continue", ar: "DC de 2 g en perfusion de 30 min puis 6 g/24h en perfusion continue" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "aztreonam-im": [
    {
      id: "aztreonam-im-l1", indication: "Cystite aiguë ou infection gonococcique non compliquée", voie: "IM",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 3, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g dose unique", ar: "1 g dose unique" } }
      ] },
    },
    {
      id: "aztreonam-im-l2", indication: "Infection urinaire haute et/ou compliquée", voie: "IM",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 3, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g/12h", ar: "1 g/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "½ dose", ar: "½ dose" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "¼ dose", ar: "¼ dose" } }
      ] },
    }
  ],
  "aztreonam-iv": [
    {
      id: "aztreonam-iv-l1", indication: "Infection peu sévère", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 3, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "DC de 2 g puis 1 à 2 g/8h", ar: "DC de 2 g puis 1 à 2 g/8h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 2 g puis 500 mg à 1 g/8h", ar: "DC de 2 g puis 500 mg à 1 g/8h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 2 g puis 250 à 500 mg/8h", ar: "DC de 2 g puis 250 à 500 mg/8h" } }
      ] },
    },
    {
      id: "aztreonam-iv-l2", indication: "Infection sévère", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 3, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "2 g/6h ou 8 g/24h en continue", ar: "2 g/6h ou 8 g/24h en continue" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 2 g puis 1 g/6h ou 4 g/24h en continue", ar: "DC de 2 g puis 1 g/6h ou 4 g/24h en continue" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 2 g puis 500 mg/6h ou 2 g/24h en continue", ar: "DC de 2 g puis 500 mg/6h ou 2 g/24h en continue" } }
      ] },
    }
  ],
  "cefaclor-po": [
    {
      id: "cefaclor-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 3, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "250 à 500 mg/8h (posologie max : 1500 mg/24h)", ar: "250 à 500 mg/8h (posologie max : 1500 mg/24h)" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 à 500 mg/12h", ar: "250 à 500 mg/12h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 à 500 mg/24h", ar: "250 à 500 mg/24h" } }
      ] },
    }
  ],
  "cefadroxil-po": [
    {
      id: "cefadroxil-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 3, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g/12h", ar: "1 g/12h" } },
      { seuil: 40, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/12h", ar: "500 mg/12h" } },
      { seuil: 20, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/24h", ar: "500 mg/24h" } }
      ] },
    }
  ],
  "cefalexine-po": [
    {
      id: "cefalexine-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 3, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g/12h", ar: "1 g/12h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/12h", ar: "500 mg/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/24h", ar: "500 mg/24h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 mg/12 à 24h", ar: "250 mg/12 à 24h" } }
      ] },
    }
  ],
  "cefazoline-im-iv": [
    {
      id: "cefazoline-im-iv-l1", indication: "Infection peu sévère", voie: "IM ou IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 4, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "60 à 80 mg/kg/24h en 4 à 6 injections OU en continue avec DC = 1/4 ou 1/3 de la dose journalière", ar: "60 à 80 mg/kg/24h en 4 à 6 injections OU en continue avec DC = 1/4 ou 1/3 de la dose journalière" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 500 mg puis 125 à 250 mg/12h", ar: "DC de 500 mg puis 125 à 250 mg/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 500 mg puis 125 à 250 mg/24h", ar: "DC de 500 mg puis 125 à 250 mg/24h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 500 mg puis 125 à 250 mg/48h", ar: "DC de 500 mg puis 125 à 250 mg/48h" } }
      ] },
    },
    {
      id: "cefazoline-im-iv-l2", indication: "Infection sévère", voie: "IM ou IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 4, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "80 à 100 mg/kg/24h en 3 perfusions de 60 min toutes les 8h OU en continue avec DC de 2 g en perfusion de 60 min puis 80 à 100 mg/kg/j en 2 perfusions de 12h", ar: "80 à 100 mg/kg/24h en 3 perfusions de 60 min toutes les 8h OU en continue avec DC de 2 g en perfusion de 60 min puis 80 à 100 mg/kg/j en 2 perfusions de 12h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 500 mg puis 250 mg/6h ou 500 mg/12h", ar: "DC de 500 mg puis 250 mg/6h ou 500 mg/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 500 mg puis 250 mg/12h ou 500 mg/24h", ar: "DC de 500 mg puis 250 mg/12h ou 500 mg/24h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 500 mg puis 500 mg/48 à 72h", ar: "DC de 500 mg puis 500 mg/48 à 72h" } }
      ] },
    }
  ],
  "cefepime-iv-im-possible": [
    {
      id: "cefepime-iv-im-possible-l1", indication: "Infection respiratoire communautaire, pyélonéphrite non compliquée", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 4, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g/12h", ar: "1 g/12h" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/24h", ar: "1 g/24h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "0,5 g/24h", ar: "0,5 g/24h" } },
      { seuil: 10, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "0,25 g/24h", ar: "0,25 g/24h" } }
      ] },
    },
    {
      id: "cefepime-iv-im-possible-l2", indication: "Infection sévère", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 4, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "2 g/12h", ar: "2 g/12h" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "2 g/24h", ar: "2 g/24h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/24h", ar: "1 g/24h" } },
      { seuil: 10, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "0,5 g/24h", ar: "0,5 g/24h" } }
      ] },
    },
    {
      id: "cefepime-iv-im-possible-l3", indication: "Infection très sévère", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 4, ligneSource: "L3" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "2 g/8h", ar: "2 g/8h" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/8h", ar: "1 g/8h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/12h", ar: "1 g/12h" } },
      { seuil: 10, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/24h", ar: "1 g/24h" } }
      ] },
    }
  ],
  "cefiderocol-iv": [
    {
      id: "cefiderocol-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 4, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "2 g/8h", ar: "2 g/8h" } },
      { seuil: 90, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "2 g/8h", ar: "2 g/8h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1,5 g/8h", ar: "1,5 g/8h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/8h", ar: "1 g/8h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "0,75 g/12h", ar: "0,75 g/12h" } }
      ] },
    }
  ],
  "cefixime-po": [
    {
      id: "cefixime-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 4, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "200 mg/12h", ar: "200 mg/12h" } },
      { seuil: 20, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "200 mg/24h", ar: "200 mg/24h" } }
      ] },
    }
  ],
  "cefotaxime-im-iv": [
    {
      id: "cefotaxime-im-iv-l1", indication: "Standard", voie: "IM ou IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 4, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 à 2 g/8h", ar: "1 à 2 g/8h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 à 2 g/12h", ar: "1 à 2 g/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "750 à 1500 mg/12h", ar: "750 à 1500 mg/12h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "750 à 1500 mg/24h", ar: "750 à 1500 mg/24h" } }
      ] },
    },
    {
      id: "cefotaxime-im-iv-l2", indication: "Infection ostéo-articulaire", voie: "IM ou IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 4, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "100 à 150 mg/kg/24h en 4 à 6 injections ou en continue", ar: "100 à 150 mg/kg/24h en 4 à 6 injections ou en continue" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "75 à 112,5 mg/kg/24h", ar: "75 à 112,5 mg/kg/24h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "50 à 75 mg/kg/24h", ar: "50 à 75 mg/kg/24h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "25 à 37,5 mg/kg/24h", ar: "25 à 37,5 mg/kg/24h" } }
      ] },
    },
    {
      id: "cefotaxime-im-iv-l3", indication: "Infection méningée", voie: "IM ou IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 4, ligneSource: "L3" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "200 à 300 mg/kg/24h en 4 à 6 injections ou en continue", ar: "200 à 300 mg/kg/24h en 4 à 6 injections ou en continue" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "150 à 225 mg/kg/24h", ar: "150 à 225 mg/kg/24h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "100 à 150 mg/kg/24h", ar: "100 à 150 mg/kg/24h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "50 à 75 mg/kg/24h", ar: "50 à 75 mg/kg/24h" } }
      ] },
    }
  ],
  "cefoxitine-iv": [
    {
      id: "cefoxitine-iv-l1", indication: "Infection peu grave", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 5, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 à 2 g/8h", ar: "1 à 2 g/8h" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 à 2 g/8 à 12h", ar: "1 à 2 g/8 à 12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 à 2 g/12 à 24h", ar: "1 à 2 g/12 à 24h" } },
      { seuil: 10, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "0,5 à 1 g/24 à 48h", ar: "0,5 à 1 g/24 à 48h" } }
      ] },
    },
    {
      id: "cefoxitine-iv-l2", indication: "Infection grave et/ou à CMI > 8 mg/l", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 5, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "8 g/24h en continue", ar: "8 g/24h en continue" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "cefpodoxime-proxetil-po": [
    {
      id: "cefpodoxime-proxetil-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 5, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "100 à 200 mg/12h", ar: "100 à 200 mg/12h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "100 à 200 mg/12 à 24h", ar: "100 à 200 mg/12 à 24h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "100 à 200 mg/24h", ar: "100 à 200 mg/24h" } }
      ] },
    }
  ],
  "ceftaroline-fosamil-iv": [
    {
      id: "ceftaroline-fosamil-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 5, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "600 mg/12h", ar: "600 mg/12h" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "400 mg/12h", ar: "400 mg/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "300 mg/12h", ar: "300 mg/12h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "200 mg/12h", ar: "200 mg/12h" } }
      ] },
    }
  ],
  "ceftazidime-im-iv": [
    {
      id: "ceftazidime-im-iv-l1", indication: "Administration discontinue", voie: "IM ou IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 5, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "2 g/8h", ar: "2 g/8h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "2 g/12h", ar: "2 g/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "2 g/24h", ar: "2 g/24h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/24h", ar: "1 g/24h" } }
      ] },
    },
    {
      id: "ceftazidime-im-iv-l2", indication: "Administration continue", voie: "IM ou IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 5, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "DC de 2 g puis 6 g/24h", ar: "DC de 2 g puis 6 g/24h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 2 g puis 3 g/24h", ar: "DC de 2 g puis 3 g/24h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 2 g puis 1 g/24h", ar: "DC de 2 g puis 1 g/24h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "ceftazidime-avibactam-iv": [
    {
      id: "ceftazidime-avibactam-iv-l1", indication: "Administration discontinue", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 5, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "2 g/8h en perfusion de 2h", ar: "2 g/8h en perfusion de 2h" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/8h", ar: "1 g/8h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "0,75 g/12h", ar: "0,75 g/12h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "0,75 g/24h", ar: "0,75 g/24h" } }
      ] },
    },
    {
      id: "ceftazidime-avibactam-iv-l2", indication: "Administration en continue", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 5, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "DC de 2 g puis 6 g/24h", ar: "DC de 2 g puis 6 g/24h" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "Aucune donnée sur l'administration en continue", ar: "Aucune donnée sur l'administration en continue" } }
      ] },
    }
  ],
  "ceftobiprole-iv": [
    {
      id: "ceftobiprole-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 5, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "500 mg/8h en perfusion de 2h", ar: "500 mg/8h en perfusion de 2h" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/12h", ar: "500 mg/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 mg/12h", ar: "250 mg/12h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 mg/24h", ar: "250 mg/24h" } }
      ] },
    },
    {
      id: "ceftobiprole-iv-l2", indication: "Si infection sévère", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 5, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g/8h en perfusion de 4h", ar: "1 g/8h en perfusion de 4h" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée pour l'infection sévère sous DFG 50 (cellule source limitée)", ar: "Aucune donnée pour l'infection sévère sous DFG 50 (cellule source limitée)" } }
      ] },
    }
  ],
  "ceftolozane-tazobactam-iv": [
    {
      id: "ceftolozane-tazobactam-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 5, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g/8h en perfusion de 60 min", ar: "1 g/8h en perfusion de 60 min" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/8h", ar: "500 mg/8h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 mg/8h", ar: "250 mg/8h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 500 mg puis 8h plus tard 100 mg/8h", ar: "DC de 500 mg puis 8h plus tard 100 mg/8h" } }
      ] },
    },
    {
      id: "ceftolozane-tazobactam-iv-l2", indication: "Si pneumonie nosocomiale", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 5, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "2 g/8h en perfusion de 60 min", ar: "2 g/8h en perfusion de 60 min" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/8h", ar: "1 g/8h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/8h", ar: "500 mg/8h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 1500 mg puis 8h plus tard 300 mg/8h", ar: "DC de 1500 mg puis 8h plus tard 300 mg/8h" } }
      ] },
    }
  ],
  "ceftriaxone-im-iv": [
    {
      id: "ceftriaxone-im-iv-l1", indication: "Infection modérée", voie: "IM ou IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 6, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 à 2 g/24h", ar: "1 à 2 g/24h" } }
      ] },
    },
    {
      id: "ceftriaxone-im-iv-l2", indication: "Infection sévère", voie: "IM ou IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 6, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "2 à 4 g/24h", ar: "2 à 4 g/24h" } }
      ] },
    }
  ],
  "cefuroxime-axetil-po": [
    {
      id: "cefuroxime-axetil-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 6, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "250 à 500 mg/12h", ar: "250 à 500 mg/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 à 500 mg/24h", ar: "250 à 500 mg/24h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 à 500 mg/48h", ar: "250 à 500 mg/48h" } }
      ] },
    }
  ],
  "cefuroxime-iv": [
    {
      id: "cefuroxime-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 6, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "2 à 6 g/24h", ar: "2 à 6 g/24h" } },
      { seuil: 90, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "2 g/24h", ar: "2 g/24h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/24h", ar: "1 g/24h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/24 à 48h", ar: "1 g/24 à 48h" } }
      ] },
    }
  ],
  "ertapenem-iv": [
    {
      id: "ertapenem-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 6, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g/24h", ar: "1 g/24h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/24h", ar: "500 mg/24h" } }
      ] },
    }
  ],
  "imipenem-cilastatine-iv": [
    {
      id: "imipenem-cilastatine-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 6, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "500 mg/6h en perfusion de 30 min", ar: "500 mg/6h en perfusion de 30 min" } },
      { seuil: 70, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/8h", ar: "500 mg/8h" } },
      { seuil: 40, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 mg/6h", ar: "250 mg/6h" } },
      { seuil: 20, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 mg/12h", ar: "250 mg/12h" } }
      ] },
    },
    {
      id: "imipenem-cilastatine-iv-l2", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 6, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1000 mg/8h en perfusion de 30 min", ar: "1000 mg/8h en perfusion de 30 min" } },
      { seuil: 70, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/6h", ar: "500 mg/6h" } },
      { seuil: 40, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/8h", ar: "500 mg/8h" } },
      { seuil: 20, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/12h", ar: "500 mg/12h" } }
      ] },
    },
    {
      id: "imipenem-cilastatine-iv-l3", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 6, ligneSource: "L3" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1000 mg/6h en perfusion de 30 min", ar: "1000 mg/6h en perfusion de 30 min" } },
      { seuil: 70, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "750 mg/8h", ar: "750 mg/8h" } },
      { seuil: 40, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/6h", ar: "500 mg/6h" } },
      { seuil: 20, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/12h", ar: "500 mg/12h" } }
      ] },
    }
  ],
  "imipenem-cilastatine-relebactam-iv": [
    {
      id: "imipenem-cilastatine-relebactam-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 6, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "500 mg/6h en perfusion de 30 min", ar: "500 mg/6h en perfusion de 30 min" } },
      { seuil: 90, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "400 mg/6h", ar: "400 mg/6h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "300 mg/6h", ar: "300 mg/6h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "200 mg/6h", ar: "200 mg/6h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "meropenem-iv": [
    {
      id: "meropenem-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 6, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 à 2 g/8h", ar: "1 à 2 g/8h" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 à 2 g/12h", ar: "1 à 2 g/12h" } },
      { seuil: 25, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "0,5 à 1 g/12h", ar: "0,5 à 1 g/12h" } }
      ] },
    }
  ],
  "meropenem-vaborbactam-iv-atb-de-reserve": [
    {
      id: "meropenem-vaborbactam-iv-atb-de-reserve-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 6, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "2 g/8h en perfusion de 3h", ar: "2 g/8h en perfusion de 3h" } },
      { seuil: 40, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/8h", ar: "1 g/8h" } },
      { seuil: 20, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1 g/12h", ar: "1 g/12h" } },
      { seuil: 10, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "0,5 g/12h", ar: "0,5 g/12h" } }
      ] },
    }
  ],
  "amikacine-iv": [
    {
      id: "amikacine-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 7, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "15 à 30 mg/kg/j", ar: "15 à 30 mg/kg/j" } }
      ] },
    }
  ],
  "gentamicine-im-iv": [
    {
      id: "gentamicine-im-iv-l1", indication: "Standard", voie: "IM ou IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 7, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "3 à 8 mg/kg/j", ar: "3 à 8 mg/kg/j" } }
      ] },
    }
  ],
  "tobramycine-im-iv": [
    {
      id: "tobramycine-im-iv-l1", indication: "Standard", voie: "IM ou IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 7, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "3 à 8 mg/kg/j", ar: "3 à 8 mg/kg/j" } }
      ] },
    }
  ],
  "ciprofloxacine-po": [
    {
      id: "ciprofloxacine-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 7, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "500 à 750 mg/12h", ar: "500 à 750 mg/12h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250-500 mg/12h", ar: "250-500 mg/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250-500 mg/24h", ar: "250-500 mg/24h" } }
      ] },
    }
  ],
  "ciprofloxacine-iv": [
    {
      id: "ciprofloxacine-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 7, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "400 mg/8 à 12h", ar: "400 mg/8 à 12h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "400 mg/12h", ar: "400 mg/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "400 mg/24h", ar: "400 mg/24h" } }
      ] },
    }
  ],
  "delafloxacine-po": [
    {
      id: "delafloxacine-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 7, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "450 mg/12h", ar: "450 mg/12h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "deconseille", fr: "Déconseillé", ar: "Déconseillé" } }
      ] },
    }
  ],
  "delafloxacine-iv": [
    {
      id: "delafloxacine-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 7, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "300 mg/12h en perfusion de 60 min", ar: "300 mg/12h en perfusion de 60 min" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "200 mg/12h", ar: "200 mg/12h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "deconseille", fr: "Déconseillé", ar: "Déconseillé" } }
      ] },
    }
  ],
  "levofloxacine-iv-po": [
    {
      id: "levofloxacine-iv-po-l1", indication: "Standard", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 7, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "500 mg/12 à 24h", ar: "500 mg/12 à 24h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 500 mg puis 250 mg/12 à 24h", ar: "DC de 500 mg puis 250 mg/12 à 24h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 500 mg puis 250 mg/24 à 48h", ar: "DC de 500 mg puis 250 mg/24 à 48h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 500 mg puis 125 à 250 mg/48h", ar: "DC de 500 mg puis 125 à 250 mg/48h" } }
      ] },
    },
    {
      id: "levofloxacine-iv-po-l2", indication: "Cystite non compliquée", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 7, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "250 mg/24h", ar: "250 mg/24h" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 250 mg puis 125 mg/24h", ar: "DC de 250 mg puis 125 mg/24h" } },
      { seuil: 20, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 250 mg puis 125 mg/48h", ar: "DC de 250 mg puis 125 mg/48h" } }
      ] },
    }
  ],
  "moxifloxacine-iv-po": [
    {
      id: "moxifloxacine-iv-po-l1", indication: "Standard", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 7, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "400 mg/24h", ar: "400 mg/24h" } }
      ] },
    }
  ],
  "norfloxacine-po": [
    {
      id: "norfloxacine-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 7, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "400 mg/12 à 24h", ar: "400 mg/12 à 24h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "400 mg/24h", ar: "400 mg/24h" } }
      ] },
    }
  ],
  "ofloxacine-iv-po": [
    {
      id: "ofloxacine-iv-po-l1", indication: "Dose usuelle", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 7, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "200 mg/12h", ar: "200 mg/12h" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "200 mg/24h", ar: "200 mg/24h" } },
      { seuil: 20, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "200 mg/48h", ar: "200 mg/48h" } }
      ] },
    },
    {
      id: "ofloxacine-iv-po-l2", indication: "Infection sévère", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 7, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "400 mg/12h", ar: "400 mg/12h" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "400 mg/24h", ar: "400 mg/24h" } },
      { seuil: 20, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "200 mg/24h OU 400 mg/48h", ar: "200 mg/24h OU 400 mg/48h" } }
      ] },
    }
  ],
  "dalbavancine-iv": [
    {
      id: "dalbavancine-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 8, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1500 mg en une seule perfusion OU 1000 mg en perfusion de 30 min suivi de 500 mg 7 jours après", ar: "1500 mg en une seule perfusion OU 1000 mg en perfusion de 30 min suivi de 500 mg 7 jours après" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1000 mg en une seule perfusion OU 750 mg suivi de 375 mg 7 jours après", ar: "1000 mg en une seule perfusion OU 750 mg suivi de 375 mg 7 jours après" } }
      ] },
    }
  ],
  "oritavancine-iv": [
    {
      id: "oritavancine-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 8, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1200 mg (dose unique) en perfusion de 3h", ar: "1200 mg (dose unique) en perfusion de 3h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "teicoplanine-im-iv": [
    {
      id: "teicoplanine-im-iv-l1", indication: "Infection peu sévère", voie: "IM ou IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 8, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "DC de 6 mg/kg/12h les 3 premières injections puis 6 mg/kg/24h", ar: "DC de 6 mg/kg/12h les 3 premières injections puis 6 mg/kg/24h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 6 mg/kg/12h les 3 premières injections puis 3 mg/kg/24h ou 6 mg/kg/48h", ar: "DC de 6 mg/kg/12h les 3 premières injections puis 3 mg/kg/24h ou 6 mg/kg/48h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 6 mg/kg/12h les 3 premières injections puis 2 mg/kg/24h ou 6 mg/kg/72h", ar: "DC de 6 mg/kg/12h les 3 premières injections puis 2 mg/kg/24h ou 6 mg/kg/72h" } }
      ] },
    },
    {
      id: "teicoplanine-im-iv-l2", indication: "Infection sévère", voie: "IM ou IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 8, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "DC de 12 mg/kg/12h les 3 à 5 premières injections puis 12 mg/kg/24h", ar: "DC de 12 mg/kg/12h les 3 à 5 premières injections puis 12 mg/kg/24h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 12 mg/kg/12h les 3 à 5 premières injections puis 6 mg/kg/24h ou 12 mg/kg/48h", ar: "DC de 12 mg/kg/12h les 3 à 5 premières injections puis 6 mg/kg/24h ou 12 mg/kg/48h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 12 mg/kg/12h les 3 à 5 premières injections puis 4 mg/kg/24h ou 12 mg/kg/72h", ar: "DC de 12 mg/kg/12h les 3 à 5 premières injections puis 4 mg/kg/24h ou 12 mg/kg/72h" } }
      ] },
    }
  ],
  "teicoplanine-po": [],
  "vancomycine-iv": [
    {
      id: "vancomycine-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 8, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "DC 30 mg/kg en perfusion de 2h puis : 20 à 40 mg/kg/j", ar: "DC 30 mg/kg en perfusion de 2h puis : 20 à 40 mg/kg/j" } }
      ] },
    }
  ],
  "vancomycine-po": [],
  "metronidazole-po": [
    {
      id: "metronidazole-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 8, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "250 mg/6h", ar: "250 mg/6h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 mg/12h", ar: "250 mg/12h" } }
      ] },
    },
    {
      id: "metronidazole-po-l2", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 8, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "500 mg/8h", ar: "500 mg/8h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 mg/8h", ar: "250 mg/8h" } }
      ] },
    },
    {
      id: "metronidazole-po-l3", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 8, ligneSource: "L3" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "500 mg/12h", ar: "500 mg/12h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/24h", ar: "500 mg/24h" } }
      ] },
    }
  ],
  "metronidazole-iv": [
    {
      id: "metronidazole-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 8, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "500 mg/8h", ar: "500 mg/8h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 mg/8h", ar: "250 mg/8h" } }
      ] },
    },
    {
      id: "metronidazole-iv-l2", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 8, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "750 mg/8h", ar: "750 mg/8h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "375 mg/8h", ar: "375 mg/8h" } }
      ] },
    }
  ],
  "ornidazole-iv-po": [
    {
      id: "ornidazole-iv-po-l1", indication: "Infection à germes anaérobies", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 8, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 à 1,5 g/24h", ar: "1 à 1,5 g/24h" } }
      ] },
    }
  ],
  "azithromycine-po": [
    {
      id: "azithromycine-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 9, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "Selon indication : 1 g en prise unique OU 500 mg de J1 à J3 OU 500 mg à J1 puis 250 mg de J2 à J5", ar: "Selon indication : 1 g en prise unique OU 500 mg de J1 à J3 OU 500 mg à J1 puis 250 mg de J2 à J5" } }
      ] },
    }
  ],
  "clarithromycine-po": [
    {
      id: "clarithromycine-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 9, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "250 mg/12h", ar: "250 mg/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "250 mg/24h", ar: "250 mg/24h" } }
      ] },
    },
    {
      id: "clarithromycine-po-l2", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 9, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "500 mg/12h", ar: "500 mg/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/24h", ar: "500 mg/24h" } }
      ] },
    }
  ],
  "clarithromycine-iv": [
    {
      id: "clarithromycine-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 9, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "500 mg/12h", ar: "500 mg/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 mg/24h", ar: "500 mg/24h" } }
      ] },
    }
  ],
  "clindamycine-iv-po": [
    {
      id: "clindamycine-iv-po-l1", indication: "Standard", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 9, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "600 mg/6 à 8h", ar: "600 mg/6 à 8h" } }
      ] },
    }
  ],
  "erythromycine-iv-po": [
    {
      id: "erythromycine-iv-po-l1", indication: "Standard", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 9, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g/8 à 12h", ar: "1 g/8 à 12h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "500 à 750 mg/8 à 12h", ar: "500 à 750 mg/8 à 12h" } }
      ] },
    }
  ],
  "pristinamycine-po": [
    {
      id: "pristinamycine-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 9, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1 g/8 à 12h (posologie maximale = 4 g/24h)", ar: "1 g/8 à 12h (posologie maximale = 4 g/24h)" } }
      ] },
    }
  ],
  "roxithromycine-po": [
    {
      id: "roxithromycine-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 9, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "150 mg/12h", ar: "150 mg/12h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "150 mg/24h", ar: "150 mg/24h" } }
      ] },
    }
  ],
  "spiramycine-iv-po": [
    {
      id: "spiramycine-iv-po-l1", indication: "Per os", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 9, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "3 MUI/8 à 12h", ar: "3 MUI/8 à 12h" } }
      ] },
    },
    {
      id: "spiramycine-iv-po-l2", indication: "IV", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 9, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1,5 à 3 MUI/8h", ar: "1,5 à 3 MUI/8h" } }
      ] },
    }
  ],
  "spiramycine-metronidazole-po": [
    {
      id: "spiramycine-metronidazole-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 9, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "1,5 MUI (spiramycine) + 250 mg (métronidazole) /8h", ar: "1,5 MUI (spiramycine) + 250 mg (métronidazole) /8h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "1,5 MUI (spiramycine) + 125 mg (métronidazole) /8h", ar: "1,5 MUI (spiramycine) + 125 mg (métronidazole) /8h" } }
      ] },
    }
  ],
  "cotrimoxazole-iv-po": [
    {
      id: "cotrimoxazole-iv-po-l1", indication: "Standard", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 10, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "800 mg de sulfaméthoxazole + 160 mg de triméthoprime / 12h", ar: "800 mg de sulfaméthoxazole + 160 mg de triméthoprime / 12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "800 mg/160 mg/24h", ar: "800 mg/160 mg/24h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "contre-indique", fr: "Contre-indiqué", ar: "Contre-indiqué" } }
      ] },
    }
  ],
  "sulfadiazine-po": [
    {
      id: "sulfadiazine-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 10, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "Préventif : 2 g/j — Curatif : 4 à 6 g/j en 4 à 6 prises", ar: "Préventif : 2 g/j — Curatif : 4 à 6 g/j en 4 à 6 prises" } },
      { seuil: 90, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "Réduction de la posologie", ar: "Réduction de la posologie" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "trimethoprime-po": [
    {
      id: "trimethoprime-po-l1", indication: "Cystite aiguë non compliquée", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 10, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "300 mg/j en 1 prise, pendant 3 jours", ar: "300 mg/j en 1 prise, pendant 3 jours" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "doxycycline-iv-po": [
    {
      id: "doxycycline-iv-po-l1", indication: "Standard", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 10, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "Patient > 60 kg : 200 mg/24h en 1 prise — Patient < 60 kg : 200 mg le 1er jour puis 100 mg/24h les jours suivants", ar: "Patient > 60 kg : 200 mg/24h en 1 prise — Patient < 60 kg : 200 mg le 1er jour puis 100 mg/24h les jours suivants" } }
      ] },
    }
  ],
  "lymecycline-po": [
    {
      id: "lymecycline-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 10, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "300 mg/12h", ar: "300 mg/12h" } },
      { seuil: 90, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    },
    {
      id: "lymecycline-po-l2", indication: "Acné", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 10, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "300 mg/24h", ar: "300 mg/24h" } },
      { seuil: 90, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "minocycline-po": [
    {
      id: "minocycline-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 10, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "200 mg/j en 2 prises", ar: "200 mg/j en 2 prises" } }
      ] },
    }
  ],
  "tigecycline-iv": [
    {
      id: "tigecycline-iv-l1", indication: "Infection non sévère", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 10, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "DC de 100 mg puis 50 mg/12h", ar: "DC de 100 mg puis 50 mg/12h" } }
      ] },
    },
    {
      id: "tigecycline-iv-l2", indication: "Infection sévère", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 10, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "DC de 200 mg puis 100 mg/12h", ar: "DC de 200 mg puis 100 mg/12h" } }
      ] },
    }
  ],
  "acide-fusidique-iv-po": [
    {
      id: "acide-fusidique-iv-po-l1", indication: "Standard", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 11, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "500 mg/8 à 12h", ar: "500 mg/8 à 12h" } }
      ] },
    }
  ],
  "colistine-iv-colistimethate-sodique": [
    {
      id: "colistine-iv-colistimethate-sodique-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 11, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "DC de 9 MUI en perfusion de 30 min puis 9 MUI/24h en 2 ou 3 administrations", ar: "DC de 9 MUI en perfusion de 30 min puis 9 MUI/24h en 2 ou 3 administrations" } },
      { seuil: 50, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 9 MUI puis 5,5 à 7,5 MUI/24h en 2 perfusions", ar: "DC de 9 MUI puis 5,5 à 7,5 MUI/24h en 2 perfusions" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 9 MUI puis 4,5 à 5,5 MUI/24h en 2 perfusions", ar: "DC de 9 MUI puis 4,5 à 5,5 MUI/24h en 2 perfusions" } },
      { seuil: 10, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "DC de 9 MUI puis 3,5 MUI/24h en 2 perfusions", ar: "DC de 9 MUI puis 3,5 MUI/24h en 2 perfusions" } }
      ] },
    }
  ],
  "daptomycine-iv": [
    {
      id: "daptomycine-iv-l1", indication: "Infection non sévère", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 11, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "6 à 8 mg/kg en perfusion de 30 min, 1 fois/24h", ar: "6 à 8 mg/kg en perfusion de 30 min, 1 fois/24h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "6 à 8 mg/kg/48h", ar: "6 à 8 mg/kg/48h" } }
      ] },
    },
    {
      id: "daptomycine-iv-l2", indication: "Infection sévère", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 11, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "10 à 12 mg/kg en perfusion de 30 min, 1 fois/24h", ar: "10 à 12 mg/kg en perfusion de 30 min, 1 fois/24h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "Aucune donnée au-delà de 10 mg/kg/48h", ar: "Aucune donnée au-delà de 10 mg/kg/48h" } }
      ] },
    }
  ],
  "fidaxomicine-po": [
    {
      id: "fidaxomicine-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 11, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "200 mg/12h", ar: "200 mg/12h" } }
      ] },
    }
  ],
  "fosfomycine-trometamol-po": [
    {
      id: "fosfomycine-trometamol-po-l1", indication: "Cystite aiguë non compliquée de la femme et adolescente de + de 12 ans", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 11, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "3 g en prise unique", ar: "3 g en prise unique" } }
      ] },
    }
  ],
  "fosfomycine-iv": [
    {
      id: "fosfomycine-iv-l1", indication: "Standard", voie: "IV",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 11, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "8 à 16 g/24h, en perfusion de 4 g, sur 30 min à 4h, toutes les 6 à 12h (max 8 g/prise)", ar: "8 à 16 g/24h, en perfusion de 4 g, sur 30 min à 4h, toutes les 6 à 12h (max 8 g/prise)" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "4 g toutes les 12 à 24h", ar: "4 g toutes les 12 à 24h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "4 g toutes les 36 à 48h", ar: "4 g toutes les 36 à 48h" } },
      { seuil: 15, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "2 g toutes les 48h", ar: "2 g toutes les 48h" } }
      ] },
    }
  ],
  "linezolide-iv-po": [
    {
      id: "linezolide-iv-po-l1", indication: "Standard", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 11, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "600 mg/12h", ar: "600 mg/12h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "600 mg/24h", ar: "600 mg/24h" } }
      ] },
    },
    {
      id: "linezolide-iv-po-l2", indication: "Infections graves de réanimation", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 11, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "600 mg/8h", ar: "600 mg/8h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "nitrofurantoine-po": [
    {
      id: "nitrofurantoine-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 11, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "100 mg/8h", ar: "100 mg/8h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "deconseille", fr: "Déconseillé", ar: "Déconseillé" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "contre-indique", fr: "Contre-indiqué", ar: "Contre-indiqué" } }
      ] },
    }
  ],
  "tedizolide-po": [
    {
      id: "tedizolide-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 11, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "200 mg/24h", ar: "200 mg/24h" } }
      ] },
    }
  ],
  "bedaquiline-po": [
    {
      id: "bedaquiline-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 12, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "Semaines 1 et 2 : 400 mg, 1 fois par jour — Semaines 3 à 24 : 200 mg, 3 fois par semaine, avec un intervalle d'au moins 48 heures entre chaque prise", ar: "Semaines 1 et 2 : 400 mg, 1 fois par jour — Semaines 3 à 24 : 200 mg, 3 fois par semaine, avec un intervalle d'au moins 48 heures entre chaque prise" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "delamanide-po": [
    {
      id: "delamanide-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 12, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "100 mg deux fois par jour pendant 24 semaines", ar: "100 mg deux fois par jour pendant 24 semaines" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "aucune-donnee", fr: "Aucune donnée", ar: "Aucune donnée" } }
      ] },
    }
  ],
  "ethambutol-m-iv-po": [
    {
      id: "ethambutol-m-iv-po-l1", indication: "Standard", voie: "IM, IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 12, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "15 à 20 mg/kg/24h (25 mg/kg/j maximum)", ar: "15 à 20 mg/kg/24h (25 mg/kg/j maximum)" } },
      { seuil: 90, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "15 mg/kg/j", ar: "15 mg/kg/j" } },
      { seuil: 70, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "10 mg/kg/j", ar: "10 mg/kg/j" } }
      ] },
    }
  ],
  "isoniazide-im-iv-po": [
    {
      id: "isoniazide-im-iv-po-l1", indication: "Standard", voie: "IM, IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 12, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "4 à 5 mg/kg/24h (300 mg/j maximum)", ar: "4 à 5 mg/kg/24h (300 mg/j maximum)" } },
      { seuil: 90, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "3 à 5 mg/kg/24h", ar: "3 à 5 mg/kg/24h" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "3 à 5 mg/kg/24h (200 mg/j maximum)", ar: "3 à 5 mg/kg/24h (200 mg/j maximum)" } }
      ] },
    }
  ],
  "pyrazinamide-po": [
    {
      id: "pyrazinamide-po-l1", indication: "Standard", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 12, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "30 mg/kg/24h en 1 prise/j", ar: "30 mg/kg/24h en 1 prise/j" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "30 mg/kg/48h", ar: "30 mg/kg/48h" } }
      ] },
    }
  ],
  "rifabutine-po": [
    {
      id: "rifabutine-po-l1", indication: "Traitement curatif des infections à Mycobacterium avium complexe chez les sujets VIH+", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 12, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "Poids > 50 kg : 600 mg/j — Poids < 50 kg : 450 mg/j — Si association avec la Clarithromycine : 300 mg/j", ar: "Poids > 50 kg : 600 mg/j — Poids < 50 kg : 450 mg/j — Si association avec la Clarithromycine : 300 mg/j" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "Poids > 50 kg : 300 mg/24h — Poids < 50 kg : 450 mg/48h — Si association avec la Clarithromycine : 150 mg/j", ar: "Poids > 50 kg : 300 mg/24h — Poids < 50 kg : 450 mg/48h — Si association avec la Clarithromycine : 150 mg/j" } }
      ] },
    },
    {
      id: "rifabutine-po-l2", indication: "Traitement préventif des infections à Mycobacterium avium complexe chez les sujets VIH+", voie: "PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 12, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "300 mg/j en une prise — Si association avec Indinavir ou Nelfinavir : 150 mg/j", ar: "300 mg/j en une prise — Si association avec Indinavir ou Nelfinavir : 150 mg/j" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "150 mg/24h — Si association avec Indinavir ou Nelfinavir : 150 mg/48h", ar: "150 mg/24h — Si association avec Indinavir ou Nelfinavir : 150 mg/48h" } }
      ] },
    }
  ],
  "rifampicine-iv-po": [
    {
      id: "rifampicine-iv-po-l1", indication: "Tuberculose", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 12, ligneSource: "L1" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "8 à 12 mg/kg/24h", ar: "8 à 12 mg/kg/24h" } }
      ] },
    },
    {
      id: "rifampicine-iv-po-l2", indication: "Infection à germes Gram + ou -", voie: "IV ou PO",
      source: { document: "OMEDIT Pays de la Loire — Antibiotiques et insuffisance rénale", version: "V2.3 (avril 2026)", page: 12, ligneSource: "L2" },
      regleRenale: { type: "segments", segments: [
      { seuil: null, egaliteAuSeuil: null, contenu: { type: "dose-source", fr: "20 à 30 mg/kg/24h", ar: "20 à 30 mg/kg/24h" } },
      { seuil: 60, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "Espacer les prises si besoin selon rifampicémie du 2e ou 3e jour du traitement", ar: "Espacer les prises si besoin selon rifampicémie du 2e ou 3e jour du traitement" } },
      { seuil: 30, egaliteAuSeuil: "segment-superieur", contenu: { type: "dose-source", fr: "Espacement des prises indispensable", ar: "Espacement des prises indispensable" } }
      ] },
    }
  ],
};

const ALIASES: Record<string, string[]> = {
  "amoxicilline-po": ["clamoxyl"],
  "amoxicilline-iv": ["clamoxyl iv"],
  "amoxicilline-acide-clavulanique-po": ["augmentin", "amoxiclav", "clavulin"],
  "amoxicilline-acide-clavulanique-iv": ["augmentin iv", "amoxiclav iv"],
  "ampicilline-sulbactam-iv": ["unasyn", "unacim"],
  "ampicilline-sulbactam-im": ["unasyn im", "unacim im"],
  "benzathine-benzylpenicilline-im": ["extencilline", "penicilline benzathine"],
  "benzylpenicilline-sodique-im-ou-iv": ["penicilline g", "benzylpenicilline"],
  "cloxacilline-po": ["orbénine"],
  "cloxacilline-iv": ["orbénine iv"],
  "oxacilline-iv": ["bristopen"],
  "phenoxymethyl-penicilline-po": ["penicilline v"],
  "piperacilline-iv": [],
  "piperacilline-tazobactam-iv": ["tazocilline", "tazocin"],
  "pivmecillinam-po": ["seléid", "seledid"],
  "temocilline-iv": ["temocillin"],
  "aztreonam-im": ["azactam im"],
  "aztreonam-iv": ["azactam"],
  "cefaclor-po": ["alfatil"],
  "cefadroxil-po": ["oracefal"],
  "cefalexine-po": ["keforal", "cefalexin"],
  "cefazoline-im-iv": ["cefazolin", "kefzol", "ancef"],
  "cefepime-iv-im-possible": ["maxipime", "cefepime"],
  "cefiderocol-iv": ["fetroja", "cefiderocol"],
  "cefixime-po": ["oroken"],
  "cefotaxime-im-iv": ["claforan"],
  "cefoxitine-iv": ["méfoxin", "mefoxin"],
  "cefpodoxime-proxetil-po": ["orélox", "orelox"],
  "ceftaroline-fosamil-iv": ["zeftera", "teflaro"],
  "ceftazidime-im-iv": ["fortum", "caz"],
  "ceftazidime-avibactam-iv": ["zavicefta", "avycaz"],
  "ceftobiprole-iv": ["mabelio", "zeclera"],
  "ceftolozane-tazobactam-iv": ["zerbaxa"],
  "ceftriaxone-im-iv": ["rocephine", "rocphin"],
  "cefuroxime-axetil-po": ["zinnat"],
  "cefuroxime-iv": ["zinacef"],
  "ertapenem-iv": ["invanz"],
  "imipenem-cilastatine-iv": ["tienam"],
  "imipenem-cilastatine-relebactam-iv": ["recarbrio"],
  "meropenem-iv": ["meronem", "mepenem"],
  "meropenem-vaborbactam-iv-atb-de-reserve": ["vabomere"],
  "amikacine-iv": ["amiklin"],
  "gentamicine-im-iv": ["gentalline", "gentamicine"],
  "tobramycine-im-iv": ["nébiciné", "nebcin"],
  "ciprofloxacine-po": ["ciflox"],
  "ciprofloxacine-iv": ["ciflox iv"],
  "delafloxacine-po": ["baxdela"],
  "delafloxacine-iv": ["baxdela iv"],
  "levofloxacine-iv-po": ["tavanic"],
  "moxifloxacine-iv-po": ["avalox"],
  "norfloxacine-po": ["noroxine"],
  "ofloxacine-iv-po": ["oflocet"],
  "dalbavancine-iv": ["dalvance", "xydalba"],
  "oritavancine-iv": ["orbactiv"],
  "teicoplanine-im-iv": ["targocid"],
  "teicoplanine-po": ["targocid po"],
  "vancomycine-iv": ["vancomycine iv"],
  "vancomycine-po": ["vancomycine po"],
  "metronidazole-po": ["flagyl"],
  "metronidazole-iv": ["flagyl iv"],
  "ornidazole-iv-po": ["tiberal"],
  "azithromycine-po": ["zithromax", "azadose"],
  "clarithromycine-po": ["zeclar"],
  "clarithromycine-iv": ["zeclar iv"],
  "clindamycine-iv-po": ["dalacine"],
  "erythromycine-iv-po": ["erythrocine"],
  "pristinamycine-po": ["pyostacine"],
  "roxithromycine-po": ["rulid"],
  "spiramycine-iv-po": ["rovamycine"],
  "spiramycine-metronidazole-po": ["rodogyl"],
  "cotrimoxazole-iv-po": ["bactrim"],
  "sulfadiazine-po": [],
  "trimethoprime-po": [],
  "doxycycline-iv-po": ["vibramycine", "doxy", "doxypalu"],
  "lymecycline-po": [],
  "minocycline-po": ["minocin"],
  "tigecycline-iv": ["tigacyl"],
  "acide-fusidique-iv-po": ["fusid"],
  "colistine-iv-colistimethate-sodique": ["colimycine", "colistine"],
  "daptomycine-iv": ["cubicin"],
  "fidaxomicine-po": ["dificlir"],
  "fosfomycine-trometamol-po": ["monuril"],
  "fosfomycine-iv": ["forteciline"],
  "linezolide-iv-po": ["zyvoxid"],
  "nitrofurantoine-po": ["furadantine"],
  "tedizolide-po": ["sivextro"],
  "bedaquiline-po": ["sirturo"],
  "delamanide-po": ["deltyba"],
  "ethambutol-m-iv-po": ["myambutol"],
  "isoniazide-im-iv-po": ["rimifon"],
  "pyrazinamide-po": ["pirilène"],
  "rifabutine-po": [],
  "rifampicine-iv-po": ["rifadine"],
};

const SOURCE_NOTES: Record<string, string[]> = {
  "amoxicilline-acide-clavulanique-po": ["Posologies exprimées en g d'amoxicilline"],
  "amoxicilline-acide-clavulanique-iv": ["Posologies exprimées en g d'amoxicilline", "/!\\ acide clavulanique : dose max 200 mg/injection et 1200 mg/24h"],
  "ampicilline-sulbactam-iv": ["Posologies exprimées en g d'ampicilline"],
  "ampicilline-sulbactam-im": ["Posologies exprimées en g d'ampicilline"],
  "piperacilline-tazobactam-iv": ["Posologies exprimées en g de pipéracilline"],
  "cefiderocol-iv": ["Si fonction rénale ≥ 120 mL/min : 2 g/6h"],
  "ceftazidime-avibactam-iv": ["Posologies exprimées en g de ceftazidime"],
  "ceftolozane-tazobactam-iv": ["Posologies exprimées en g de ceftolozane"],
  "ceftriaxone-im-iv": ["Si infection neuroméningée : 75 à 100 mg/kg/24h ; aucune donnée chez l'insuffisant rénal"],
  "imipenem-cilastatine-iv": ["Posologies exprimées en mg d'imipénem"],
  "imipenem-cilastatine-relebactam-iv": ["Posologies exprimées en mg d'imipénem"],
  "meropenem-iv": ["Si posologie élevée (> 6 g/24h) : monitorage pharmacologique"],
  "meropenem-vaborbactam-iv-atb-de-reserve": ["Posologies exprimées en g de méropénem"],
  "amikacine-iv": ["En cas de situation clinique justifiant l'administration, la posologie unitaire ne doit pas être diminuée.", "Dans la majorité des cas, une injection unique suffit. Si plusieurs injections sont nécessaires, il est indispensable de réaliser des dosages du résiduel et d'espacer les doses."],
  "gentamicine-im-iv": ["En cas de situation clinique justifiant l'administration, la posologie unitaire ne doit pas être diminuée.", "Dans la majorité des cas, une injection unique suffit. Si plusieurs injections sont nécessaires, il est indispensable de réaliser des dosages du résiduel et d'espacer les doses."],
  "tobramycine-im-iv": ["En cas de situation clinique justifiant l'administration, la posologie unitaire ne doit pas être diminuée.", "Dans la majorité des cas, une injection unique suffit. Si plusieurs injections sont nécessaires, il est indispensable de réaliser des dosages du résiduel et d'espacer les doses."],
  "teicoplanine-po": ["Diarrhée et colite associées à une infection à Clostridium difficile : 100-200 mg deux fois par jour pendant 7 à 14 jours"],
  "vancomycine-iv": ["DC, puis adapter en fonction de la concentration plasmatique à l'équilibre (au-delà de DFG < 90)"],
  "vancomycine-po": ["Traitement des infections à Clostridium difficile (ICD) : 125 mg/6h pendant 10 jours pour un 1er épisode d'ICD non sévère. Cette dose peut être augmentée à 500 mg/6h pendant 10 jours en cas d'ICD sévère ou compliquée. La dose maximale journalière ne devrait pas dépasser 2 g."],
  "doxycycline-iv-po": ["Autres posologies dans des cas particuliers : gonococcie aiguë, syphilis, urétrite non compliquée, endocervicite, …"],
};

export const ATB_RENAL_V2_ROWS: AtbRenalDoseRow[] = ATB_RENAL_ROWS.map((row) => ({
  ...row,
  alias: ALIASES[row.id] ?? [],
  surveillance: ["amikacine-iv", "gentamicine-im-iv", "tobramycine-im-iv", "vancomycine-iv", "teicoplanine-im-iv", "colistine-iv-colistimethate-sodique"].includes(row.id),
  regimes: REGIMES[row.id] ?? [],
  sourceNotes: (SOURCE_NOTES[row.id] ?? []).map((fr) => ({ fr, ar: fr })),
  traductionStatut: "ar-provisoire",
  lastReviewed: "2026-10-30",
}));
export const ATB_RENAL_V2_BY_ID = Object.fromEntries(ATB_RENAL_V2_ROWS.map((row) => [row.id, row])) as Record<string, AtbRenalDoseRow>;

/** Écarts éditoriaux documentés au regard du verbatim PDF (aucun changement de dose inféré). */
export const ATB_RENAL_V2_PATCH = [
  {
    regimeId: "fosfomycine-iv-l1",
    casV5: 14,
    action: "Garder « en perfusion de 4 g » au singulier, conforme au PDF visuel.",
  },
  {
    regimeId: "rifampicine-iv-po-l2",
    casV5: 15,
    action: "Normaliser l'artefact OCR des exposants en « 2e ou 3e jour » ; le schéma et les valeurs restent inchangés.",
  },
  {
    regimeId: "sulfadiazine-po-l1",
    casV5: 18,
    action: "Remplacer le retour à la ligne interne par « — » et conserver les trois cellules source, sans chiffrer « Réduction de la posologie ».",
  },
] as const;

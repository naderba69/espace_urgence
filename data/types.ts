// Modèles de données — tout élément de contenu porte ses sources et sa date de revue.
export interface Localized {
  fr: string;
  ar: string;
}

export interface ReviewMeta {
  sources: string[];      // référentiels (ex. "ERC 2021", "AHA ACLS 2025")
  lastReviewed: string;   // AAAA-MM — date de dernière revue éditoriale
}

export interface DrugInteraction {
  drug: string;
  severity: "high" | "moderate";
  description: Localized;
}

export interface Medication {
  id: string;
  name: Localized;
  brands?: string;             // spécialités courantes en Tunisie
  synonyms: string[];          // pour la recherche (adrenaline = épinéphrine…)
  klass: Localized;            // classe thérapeutique
  highRisk: boolean;
  indications: Localized;
  doseAdult: Localized;
  dosePediatric: Localized;
  dilution: Localized;
  contraindications: Localized;
  sideEffects: Localized;
  nursing: Localized;
  storage: Localized;
  alternatives: string[];
  interactions?: DrugInteraction[];
  // Permet au calculateur « dose selon le poids » de chiffrer automatiquement
  weightDose?: { mgPerKg: number; maxMg: number; note: Localized };
  meta: ReviewMeta;
}

export interface ProtocolStep {
  title: Localized;
  detail?: Localized;
}

/** Évolution de la situation / complication → conduite à tenir. */
export interface ProtocolTrajectory {
  when: Localized;      // "Si aggravation…", "Si pas d'amélioration à 15 min…", "Complication : embolie…"
  do: Localized[];      // items d'action pour cette branche
}

export interface Protocol {
  id: string;
  title: Localized;
  category: string;           // id de catégorie (voir data/protocols.ts)
  severity: "critical" | "urgent" | "standard";
  summary?: Localized;        // phrase d'introduction affichée en haut de la fiche
  steps: ProtocolStep[];
  keyPoints: Localized[];
  trajectory?: ProtocolTrajectory[];   // branches d'évolution / complications
  medications: string[];      // ids de data/medications.ts
  calculators: string[];      // ids de data/calculators.ts
  meta: ReviewMeta;
}

export interface CalculatorMeta {
  id: string;
  title: Localized;
  description: Localized;
  href: string;
  icon: string;               // nom d'icône lucide-react
  meta?: ReviewMeta;          // sources + revue éditoriale
}

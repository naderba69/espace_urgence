// v12.4 — بلاطات الأقسام (البند ٦٠) : عضوية أقسام النطاق المعتمد، مطابقة بمقطع href.
// أ = ٢٥ محرّكاً (v10.x) · ب = ١٥ قراءة/مقياساً (v11.x) · ج = ١٥ أمان دواء (v12.x).
export type SectionTileId = "a" | "b" | "c";

export const SECTIONS: { id: SectionTileId; fr: string; ar: string; ids: string[] }[] = [
  {
    id: "a",
    fr: "Moteurs d'urgence",
    ar: "المحرّكات",
    ids: [
      "motif", "coma", "acide-base", "ddx", "sodium",
      "hyperkalemie", "dka", "etat-mal", "asthme", "sepsis-commandement",
      "dose-anaphylaxie", "toxidromes", "antidotes", "anticoag", "brulures",
      "transfusion", "fluids-enfant", "syncope", "aki", "mecanisme",
      "co", "cocaine", "doses-ped", "hypothermie", "coup-chaleur",
    ],
  },
  {
    id: "b",
    fr: "Lectures & scores",
    ar: "القراءات والمقاييس",
    ids: [
      "ecg-grid", "rx-thorax", "pocus", "spirometrie", "convertisseur",
      "hemogramme", "bilan-hepatique", "urines", "lactate", "dic",
      "gaz-advanced", "gaz-units", "croissance", "thyroide", "dose-check",
    ],
  },
  {
    id: "c",
    fr: "Sécurité du médicament",
    ar: "أمان الدواء",
    ids: [
      "safe-dose", "renal-dose", "interactions", "antibiotiques", "dilutions",
      "noac", "antiepileptiques", "corticoids", "epilepsie-grossesse", "fluides-sodium",
      "antipsychotiques", "sedation-palliative", "rsi", "antiviraux", "monitoring",
    ],
  },
];

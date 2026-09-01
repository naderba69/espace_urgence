// Moteur de recherche local : normalisation accents/arabe + synonymes médicaux FR/AR.
import { protocols } from "@/data/protocols";
import { medications } from "@/data/medications";
import { calculators } from "@/data/calculators";
import { procedures } from "@/data/procedures";
import { ecgRhythms } from "@/data/ecg";
import type { Localized } from "@/data/types";

import { decisionTrees } from "@/data/trees";

export type RefType = "protocole" | "medicament" | "calculateur" | "procedure" | "ecg" | "arbre" | "outil";

export interface SearchItem {
  key: string;          // "type:id" — utilisé pour favoris/récents
  type: RefType;
  href: string;
  title: Localized;
  hay: string;          // chaîne normalisée agrégée
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")        // accents latins
    .replace(/[أإآٱ]/g, "ا")      // formes du alif
    .replace(/ة/g, "ه")           // ta marbuta
    .replace(/[ً-ْٰ]/g, "")       // voyelles arabes (tashkeel)
    .replace(/ى/g, "ي")
    .trim();
}

// Synonymes bidirectionnels courants (normalisés)
const SYNONYMS: Record<string, string[]> = {
  adrenaline: ["epinephrine", "epinephrine", "adrenaline"],
  epinephrine: ["adrenaline"],
  rcp: ["cpr", "reanimation", "massage", "cardiaque", "انعاش"],
  cpr: ["rcp", "reanimation", "cardiaque"],
  glasgow: ["gcs", "coma", "غلاسكو"],
  gcs: ["glasgow", "coma"],
  avc: ["stroke", "cerébral", "جلطه"],
  stroke: ["avc"],
  narcan: ["naloxone", "نالوكسون"],
  lasilix: ["furosemide", "فوروسيميد"],
  hypnovel: ["midazolam", "ميدازولام"],
  anaphylaxie: ["allergie", "choc", "انفيلاكسي"],
  perfusion: ["gouttes", "debit", "serum", "تدفق"],
};

function expand(token: string): string[] {
  return [token, ...(SYNONYMS[token] ?? [])];
}

export const searchIndex: SearchItem[] = [
  ...protocols.map((p) => ({
    key: `protocole:${p.id}`,
    type: "protocole" as const,
    href: `/protocoles/${p.id}`,
    title: p.title,
    hay: normalize(`${p.title.fr} ${p.title.ar} ${p.id} ${p.category} ${p.severity}`),
  })),
  ...medications.map((m) => ({
    key: `medicament:${m.id}`,
    type: "medicament" as const,
    href: `/medicaments/${m.id}`,
    title: m.name,
    hay: normalize(`${m.name.fr} ${m.name.ar} ${m.synonyms.join(" ")} ${m.klass.fr} ${m.klass.ar} ${m.brands ?? ""}`),
  })),
  ...calculators.map((c) => ({
    key: `calculateur:${c.id}`,
    type: "calculateur" as const,
    href: c.href,
    title: c.title,
    hay: normalize(`${c.title.fr} ${c.title.ar} ${c.description.fr} ${c.description.ar}`),
  })),
  ...procedures.map((p) => ({
    key: `procedure:${p.id}`,
    type: "procedure" as const,
    href: `/procedures/${p.id}`,
    title: p.title,
    hay: normalize(`${p.title.fr} ${p.title.ar} ${p.id}`),
  })),
  ...ecgRhythms.map((r) => ({
    key: `ecg:${r.id}`,
    type: "ecg" as const,
    href: `/ecg`,
    title: r.title,
    hay: normalize(`${r.title.fr} ${r.title.ar} ${r.kind}`),
  })),
  ...decisionTrees.map((t) => ({
    key: `arbre:${t.id}`,
    type: "arbre" as const,
    href: `/arbres/${t.id}`,
    title: t.title,
    hay: normalize(`${t.title.fr} ${t.title.ar} ${t.description.fr} ${t.description.ar} ${t.id} arbre decisionnel algorithme شجرة`),
  })),
  // Outils transverses (pages hors données agrégées)
  {
    key: "outil:triage",
    type: "outil" as const,
    href: "/triage",
    title: { fr: "Triage — situation par situation", ar: "الفرز — حالة بحالة" },
    hay: normalize("triage tri trisage فرز priorités rouge orange vert p1 p2 p3 investissement vital classement أولوية اصفرار اولويات مستوى"),
  },
  {
    key: "outil:triage-ia",
    type: "outil" as const,
    href: "/triage-ia",
    title: { fr: "Aide au triage IA", ar: "مساعد الفرز الذكي" },
    hay: normalize("triage ia aide assistant فرت ذكي"),
  },
];

export function searchItems(query: string, limit = 8): SearchItem[] {
  const nq = normalize(query);
  if (!nq || nq.length < 2) return [];
  const tokens = nq.split(/\s+/).flatMap(expand);
  const scored = searchIndex
    .map((item) => {
      let score = 0;
      for (const t of tokens) {
        if (item.hay.includes(t)) score += t.length;
      }
      const titleN = normalize(`${item.title.fr} ${item.title.ar}`);
      if (titleN.startsWith(nq)) score += 20;
      return { item, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scored.map((s) => s.item);
}

/** Résout une clé "type:id" vers l'élément (favoris / récents). */
export function resolveRef(key: string): SearchItem | null {
  const found = searchIndex.find((i) => i.key === key);
  return found ?? null;
}

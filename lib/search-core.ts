// v17.0 — Noyau du moteur de recherche : types + algorithmes purs.
// Aucun import de données médicales → peut être embarqué partout sans coût.
//
// نواة محرّك البحث: الأنواع والخوارزميات الصافية فقط، بلا أي بيانات طبية.
import type { Localized } from "@/data/types";
import { expand, normalize } from "./text";

export { normalize };

export type RefType =
  | "protocole"
  | "medicament"
  | "calculateur"
  | "procedure"
  | "ecg"
  | "arbre"
  | "outil"
  | "guidage";

export interface SearchItem {
  /** "type:id" — utilisé pour favoris/récents. */
  key: string;
  type: RefType;
  href: string;
  title: Localized;
  /** Chaîne normalisée agrégée (recherche plein texte). */
  hay: string;
  /** v7.9 — gravité (tri + badge « tueur potentiel »). */
  sev?: "critical" | "urgent" | "standard";
}

/** Poids de gravité pour départager deux scores égaux. */
function sevWeight(x: SearchItem): number {
  return x.sev === "critical" ? 2 : x.sev === "urgent" ? 1 : 0;
}

/**
 * Notation d'un élément face à une requête normalisée.
 * Score = somme des longueurs de jetons trouvés (+ bonus 20 si le titre commence par la requête).
 * النتيجة = مجموع أطوال الكلمات المطابقة (+ 20 إذا بدأ العنوان بالاستعلام).
 */
export function scoreItem(item: SearchItem, nq: string): number {
  let score = 0;
  for (const t of nq.split(/\s+/).flatMap(expand)) {
    if (item.hay.includes(t)) score += t.length;
  }
  if (normalize(`${item.title.fr} ${item.title.ar}`).startsWith(nq)) score += 20;
  return score;
}

/** Filtre + trie + limite. Partagé par toutes les surfaces de recherche. */
export function rank(index: SearchItem[], query: string, limit: number): SearchItem[] {
  const nq = normalize(query);
  if (!nq || nq.length < 2) return [];
  return index
    .map((item) => ({ item, score: scoreItem(item, nq) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return sevWeight(b.item) - sevWeight(a.item);
    })
    .slice(0, limit)
    .map((s) => s.item);
}

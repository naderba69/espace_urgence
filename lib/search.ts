// v17.0 — Moteur de recherche local, désormais **paresseux** (lazy).
//
// Avant : ce module importait statiquement les 12 fichiers de protocoles, les 11
// fichiers de médicaments, guidage, calculateurs… → toute la base médicale (~1,4 Mo
// de JS brut) était téléchargée sur **chaque** page, même celles qui n'ont pas de
// recherche. Résultat mesuré : 483 Ko gzip sur l'accueil.
//
// Maintenant : le noyau (types + algorithmes) est léger et embarquable partout ;
// l'index est construit dans `lib/search-data.ts`, chargé via import() dynamique
// au premier usage réel. Les surfaces de recherche appellent `loadSearchIndex()`
// au montage, puis lisent `searchItems()` de façon synchrone.
//
// محرّك بحث محلي **كسول**: النواة خفيفة، والفهرس الثقيل يُجلب عند أول استعمال فعلي.

import { rank, type RefType, type SearchItem } from "./search-core";
import { normalize } from "./text";

export type { RefType, SearchItem };
export { normalize };
export { SYNONYMS, expand } from "./text";

let INDEX: SearchItem[] | null = null;
let LOADING: Promise<SearchItem[]> | null = null;

/** L'index est-il chargé ? (sinon les recherches renvoient [] — afficher un état d'attente) */
export function isSearchIndexReady(): boolean {
  return INDEX !== null;
}

/**
 * Charge l'index complet une seule fois (idempotent, mémoïsé).
 * Chargement unique : le chunk est ensuite servi par le service worker, donc utilisable hors-ligne.
 */
export function loadSearchIndex(): Promise<SearchItem[]> {
  if (INDEX) return Promise.resolve(INDEX);
  LOADING ??= import("./search-data")
    .then((m) => {
      INDEX = m.buildSearchIndex();
      return INDEX;
    })
    .catch((e) => {
      LOADING = null; // permet de réessayer après un échec réseau
      throw e;
    });
  return LOADING;
}

/** Index chargé (vide tant que `loadSearchIndex()` n'a pas résolu). */
export function getSearchIndex(): SearchItem[] {
  return INDEX ?? [];
}

/**
 * Résultats de recherche. Synchrone : renvoie [] si l'index n'est pas encore prêt.
 * Utiliser `loadSearchIndex()` en amont (ou `searchItemsAsync`).
 */
export function searchItems(query: string, limit = 8): SearchItem[] {
  return rank(INDEX ?? [], query, limit);
}

/** Variante sûre : attend le chargement de l'index puis cherche. */
export async function searchItemsAsync(query: string, limit = 8): Promise<SearchItem[]> {
  const index = await loadSearchIndex();
  return rank(index, query, limit);
}

/** Résout une clé "type:id" vers l'élément (favoris / récents). */
export function resolveRef(key: string): SearchItem | null {
  return (INDEX ?? []).find((i) => i.key === key) ?? null;
}

/** Variante sûre : attend le chargement de l'index puis résout (séquences de clés). */
export async function resolveRefsAsync(keys: string[]): Promise<SearchItem[]> {
  const index = await loadSearchIndex();
  const byKey = new Map(index.map((i) => [i.key, i]));
  return keys.map((k) => byKey.get(k)).filter((x): x is SearchItem => Boolean(x));
}

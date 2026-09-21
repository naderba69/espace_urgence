// v17.1 — قارئ فهرس المراجع الثابت (out/ref-index.json).
//
// يُستعمل حيث نحتاج «عنوان + رابط» فقط (المفضّلات والحديثة في الصفحة الرئيسية):
// 14 كيلوبايت gzip بدل 173 كيلوبايت لفهرس البحث الكامل. الملف مُولَّد وقت البناء
// (app/ref-index.json/route.ts) ومُخزَّن مسبقًا في خدمة العمل ⇒ يعمل دون اتصال.
//
// Lecteur léger du fichier de références statique : de quoi afficher les favoris et les
// récents sans charger l'index de recherche complet.
import { useEffect, useState } from "react";
import { BASEPATH } from "./base";
import type { Localized } from "@/data/types";

export interface RefEntry {
  /** "type:id" — même clé que dans les favoris / récents (localStorage). */
  key: string;
  href: string;
  type: string;
  title: Localized;
  /** Date de dernière revue éditoriale, quand la source en fournit une. */
  reviewed?: string;
  /** Protocoles : catégorie, gravité et nombre d'étapes (liste /protocoles). */
  category?: string;
  severity?: "critical" | "urgent" | "standard";
  steps?: number;
  /** Protocoles : situation de guidage associée (identifiant + libellés). */
  guidage?: { id: string; fr: string; ar: string };
}

/** Forme compacte transmise par le fichier (clés courtes pour limiter le poids). */
interface WireEntry {
  k: string; h: string; t: string; n: [string, string];
  r?: string; c?: string; s?: "critical" | "urgent" | "standard"; e?: number;
  g?: [string, string, string];
}

let MAP: Map<string, RefEntry> | null = null;
let LOADING: Promise<Map<string, RefEntry>> | null = null;

export function isRefIndexReady(): boolean {
  return MAP !== null;
}

/** Charge (une seule fois) le fichier de références. Idempotent et mémoïsé. */
export function loadRefIndex(): Promise<Map<string, RefEntry>> {
  if (MAP) return Promise.resolve(MAP);
  LOADING ??= fetch(`${BASEPATH}/ref-index.json`)
    .then((r) => {
      if (!r.ok) throw new Error(`ref-index HTTP ${r.status}`);
      return r.json() as Promise<WireEntry[]>;
    })
    .then((rows) => {
      MAP = new Map(
        rows.map((r) => [
          r.k,
          {
            key: r.k,
            href: r.h,
            type: r.t,
            title: { fr: r.n[0], ar: r.n[1] },
            reviewed: r.r,
            category: r.c,
            severity: r.s,
            steps: r.e,
            guidage: r.g ? { id: r.g[0], fr: r.g[1], ar: r.g[2] } : undefined,
          },
        ])
      );
      return MAP;
    })
    .catch((e) => {
      LOADING = null; // autorise une nouvelle tentative (retour du réseau)
      throw e;
    });
  return LOADING;
}

/** Résolution synchrone : renvoie null tant que le fichier n'est pas chargé. */
export function getRef(key: string): RefEntry | null {
  return MAP?.get(key) ?? null;
}

/** Résout une séquence de clés en préservant l'ordre et en ignorant les inconnues. */
export function resolveRefs(keys: string[]): RefEntry[] {
  if (!MAP) return [];
  return keys.map((k) => MAP!.get(k)).filter((x): x is RefEntry => Boolean(x));
}

/**
 * Charge le fichier de références au montage et le rend disponible au rendu.
 * Renvoie `null` tant qu'il n'est pas arrivé (les appelants affichent alors ce qu'ils savent).
 *
 * خطّاف للمكوّنات: يُحمِّل الفهرس عند التركيب ويعيد `null` حتى يصل.
 */
export function useRefIndexMap(): Map<string, RefEntry> | null {
  // l'état initial couvre le cas « déjà chargé » ; l'effet ne fait qu'attendre le fetch
  const [map, setMap] = useState<Map<string, RefEntry> | null>(MAP);
  useEffect(() => {
    if (MAP) return;
    let alive = true;
    loadRefIndex()
      .then((m) => {
        if (alive) setMap(m);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);
  return map;
}

/**
 * Résout des clés "type:id" en entrées (id + titre), sans charger autre chose que le
 * fichier de références. Utilisé par les pages qui n'affichent que des liens.
 *
 * حلّ المفاتيح إلى عناوين عبر فهرس المراجع وحده (بدون تحميل القواعد الكاملة).
 */
export function resolveRefLinks(
  map: Map<string, RefEntry> | null,
  type: "protocole" | "medicament" | "calculateur",
  ids: string[]
): { id: string; key: string; href: string; title: Localized }[] {
  if (!map) return [];
  return ids
    .map((id) => map.get(`${type}:${id}`))
    .filter((r): r is RefEntry => Boolean(r))
    .map((r) => ({ id: r.key.split(":")[1] ?? r.key, key: r.key, href: r.href.split("#")[0], title: r.title }));
}

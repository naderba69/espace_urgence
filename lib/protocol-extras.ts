// v17.1 — Chargeur paresseux des données annexes d'une fiche protocole.
// v17.4 — Plus AUCUN import de `data/guidage.ts` (88 Ko) ni de `data/reval.ts` (232 Ko) :
//   • la situation de guidage arrive avec `/ref-index.json` (15 Ko, déjà chargé/précaché) ;
//   • la boucle de réévaluation est un fichier dédié de ~1,7 Ko (`/reval/<id>`, précaché).
// La fiche s'affiche donc sans attendre, et une seule situation coûte ~2 Ko au lieu de 320 Ko.
//
// ملحق اختياري لبطاقة البروتوكول: التوجيه من فهرس المراجع، وإعادة التقييم من ملف مستقل —
// بدل تنزيل قاعدتين كاملتين (320 كيلوبايت) لعرض عنصر واحد.
import type { Reval } from "@/data/reval";
import { loadRefIndex } from "@/lib/ref-index";
import { BASEPATH } from "@/lib/base";

/** Les trois valeurs de la situation de guidage affichées par la fiche. */
export interface GuidageRef {
  id: string;
  fr: string;
  ar: string;
}

export interface ProtocolExtras {
  /** Cas de guidage téléphonique associé (bannière « guider cet appel »). */
  gcase?: GuidageRef;
  /** Boucle de réévaluation associée (panneau chronométré). */
  reval?: Reval;
}

/**
 * Résout le guidage (fichier de références) et la réévaluation (fichier dédié) en parallèle.
 * Ne lève jamais : en cas d'échec réseau, la fiche reste utilisable sans ses annexes.
 */
export async function loadProtocolExtras(protocolId: string): Promise<ProtocolExtras> {
  const [refMap, reval] = await Promise.all([
    loadRefIndex().catch(() => null),
    fetch(`${BASEPATH}/reval/${protocolId}`)
      .then((r) => (r.ok ? (r.json() as Promise<Reval>) : null))
      .catch(() => null),
  ]);

  const guidage = refMap?.get(`protocole:${protocolId}`)?.guidage;

  return {
    gcase: guidage ? { id: guidage.id, fr: guidage.fr, ar: guidage.ar } : undefined,
    reval: reval ?? undefined,
  };
}

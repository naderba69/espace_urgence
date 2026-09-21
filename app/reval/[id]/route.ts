// v17.4 — Boucle de réévaluation d'un protocole, servie en fichier JSON dédié.
//
// Avant : `lib/protocol-extras.ts` importait `data/reval.ts` (232 Ko brut, 98 protocoles)
// pour n'en afficher qu'UN. Désormais la fiche récupère son seul objet (~1,7 Ko gzip).
// Les 98 fichiers sont précachés par le service worker : la réévaluation reste disponible
// hors-ligne, y compris pour une fiche ouverte puis rouverte en mode avion.
//
// ⚠️ Le service worker intercepte `${BASE}/reval/` : si ce chemin change, mettre à jour
// `public/sw.js` **et** `scripts/gen-precache.mjs`, sinon la boucle disparaît hors-ligne.
//
// حلقة إعادة التقييم لكل بروتوكول في ملف مستقل: تُجلب عند الحاجة فقط (1.7 كيلوبايت gzip)،
// وتُخزَّن مسبقاً لتبقى متاحة دون اتصال.
import { protocols } from "@/data/protocols";
import { getReval } from "@/data/reval";

export const dynamic = "force-static";

/** Un fichier par protocole disposant d'une réévaluation (les 98 aujourd'hui). */
export function generateStaticParams() {
  return protocols.filter((p) => getReval(p.id)).map((p) => ({ id: p.id }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reval = getReval(id);
  if (!reval) {
    // Fiche sans réévaluation : réponse vide et explicite (le client n'affiche rien).
    return new Response("null", { status: 404, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify(reval), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

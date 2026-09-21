// v17.1 — فهرس مراجع ثابت: {key, href, type, fr, ar} لكل مادة في التطبيق.
//
// الغرض: الصفحة الرئيسية تحتاج لعرض المفضّلات والأخيرة **عنوانًا ورابطًا فقط**،
// وكانت لتلبية ذلك تُحمّل فهرس البحث الكامل (~173 كيلوبايت gzip، مع كل النصوص
// الطبية). هذا الملف يوفّر نفس المعطيات في ~12 كيلوبايت.
//
// يُولَّد وقت البناء (force-static) وتُصدّره Next إلى out/ref-index.json، فيصبح
// ملفًا ثابتًا يخدمه المستضيف المجاني وتخزّنه خدمة العمل مسبقًا (يعمل دون اتصال).
//
// Fichier de références statique (build-time) : de quoi afficher favorites et récents
// (titre + lien) sans télécharger l'index de recherche complet.
import { protocols } from "@/data/protocols";
import { medications } from "@/data/medications";
import { calculators } from "@/data/calculators";
import { procedures } from "@/data/procedures";
import { ecgRhythms } from "@/data/ecg";
import { decisionTrees } from "@/data/trees";
import { GCASES } from "@/data/guidage";

export const dynamic = "force-static";

/** Entrée compacte : mêmes clés que `SearchItem.key` (favoris / récents en localStorage). */
interface RefEntry {
  /** "type:id" */
  k: string;
  /** href résolu (ancre incluse pour les protocoles / médicaments) */
  h: string;
  /** type brut, pour l'icône et le libellé */
  t: string;
  /** titres, tableau [fr, ar] pour limiter la taille du JSON */
  n: [string, string];
  /** v17.2 — date de dernière revue éditoriale : alimente /revision et /revisions. */
  r?: string;
  /** v17.3 — protocoles uniquement : catégorie, gravité et nombre d'étapes.
   *  Cela permet à /protocoles d'afficher sa liste complète sans embarquer les 98 fiches. */
  c?: string;
  s?: "critical" | "urgent" | "standard";
  e?: number;
  /** v17.4 — situation de guidage associée : [id, fr, ar]. La fiche protocole n'affichait
   *  que ces trois valeurs ; les embarquer ici supprime le chargement de data/guidage.ts
   *  (88 Ko dont les prédicats ne sont pas sérialisables). */
  g?: [string, string, string];
}

const TOOLS: RefEntry[] = [
  { k: "outil:triage", h: "/triage", t: "outil", n: ["Triage — situation par situation", "الفرز — حالة بحالة"] },
  { k: "outil:triage-ia", h: "/triage-ia", t: "outil", n: ["Aide au triage IA", "مساعد الفرز الذكي"] },
  { k: "outil:triage-arbre", h: "/arbres/triage-prehospitalier", t: "outil", n: ["Arbre de triage préhospitalier (P1/P2/P3)", "شجرة الفرز قبل الاستشفائي (P1/P2/P3)"] },
  { k: "outil:checklists", h: "/checklists", t: "outil", n: ["Check-lists (transport, matériel, SAUV)", "قوائم التدقيق (نقل، تجهيز، إنعاش)"] },
  { k: "outil:fiche-samu", h: "/fiche-samu", t: "outil", n: ["Fiche d'intervention SAMU / SMUR", "فيشة تدخّل SAMU / SMUR"] },
  { k: "outil:rea", h: "/rea", t: "outil", n: ["Réanimation — ce qui s'exécute à la minute", "الإنعاش — ما يُنفَّذ هذه الدقيقة"] },
  { k: "outil:memo", h: "/memo", t: "outil", n: ["Mémo — lecture & révision (quiz, ECG, constantes)", "مذكّرة — قراءة ومراجعة (اختبارات، ECG، ثوابت)"] },
  { k: "outil:recherche", h: "/recherche", t: "outil", n: ["Recherche globale", "البحث الشامل"] },
  { k: "outil:reevaluation", h: "/reevaluation", t: "outil", n: ["Réévaluation — dépistage de la détérioration (OAP, choc, sepsis…)", "إعادة التقييم — رصد التدهور (وذمة رئوية، صدمة، إنتان…)"] },
  { k: "outil:resume", h: "/resume", t: "outil", n: ["Résumé de cas — relève / transfert", "ملخص الحالة — تسليم / انتقال"] },
];

/** Situation de guidage d'un protocole — même règle de rapprochement que l'ancien
 *  `protocol-extras` : identifiant identique, ou `href` pointant vers la fiche. */
function guidageOf(protocolId: string): [string, string, string] | undefined {
  const c = GCASES.find((x) => x.id === protocolId || x.href === `/protocoles/${protocolId}`);
  return c ? [c.id, c.fr, c.ar] : undefined;
}

export function GET() {
  const refs: RefEntry[] = [
    ...protocols.map((p) => ({
      k: `protocole:${p.id}`,
      h: `/protocoles/${p.id}#steps`,
      t: "protocole",
      n: [p.title.fr, p.title.ar] as [string, string],
      r: p.meta.lastReviewed,
      c: p.category,
      s: p.severity,
      e: p.steps.length,
      g: guidageOf(p.id),
    })),
    ...medications.map((m) => ({ k: `medicament:${m.id}`, h: `/medicaments/${m.id}#doses`, t: "medicament", n: [m.name.fr, m.name.ar] as [string, string], r: m.meta.lastReviewed })),
    ...GCASES.map((g) => ({ k: `guidage:${g.id}`, h: `/guidage?c=${g.id}`, t: "guidage", n: [`Guidage — ${g.fr}`, `توجيه — ${g.ar}`] as [string, string] })),
    ...calculators.map((c) => ({ k: `calculateur:${c.id}`, h: c.href, t: "calculateur", n: [c.title.fr, c.title.ar] as [string, string], r: c.meta?.lastReviewed })),
    ...procedures.map((p) => ({ k: `procedure:${p.id}`, h: `/procedures/${p.id}`, t: "procedure", n: [p.title.fr, p.title.ar] as [string, string] })),
    ...ecgRhythms.map((r) => ({ k: `ecg:${r.id}`, h: `/ecg`, t: "ecg", n: [r.title.fr, r.title.ar] as [string, string] })),
    ...decisionTrees.map((t) => ({ k: `arbre:${t.id}`, h: `/arbres/${t.id}`, t: "arbre", n: [t.title.fr, t.title.ar] as [string, string] })),
    ...TOOLS,
  ];

  return new Response(JSON.stringify(refs), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Fichier figé au build : réutilisable sans revalidation (le SW en garde une copie).
      "Cache-Control": "public, max-age=3600",
    },
  });
}

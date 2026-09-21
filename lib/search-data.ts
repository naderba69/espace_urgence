// v17.0 — بناء فهرس البحث الكامل من كل قواعد البيانات الطبية.
//
// ⚠️ هذا الملف ثقيل عمدًا (يستورد كل ملفات data/*) ولا يُستورد إلا عبر
// `import()` الديناميكي من lib/search.ts — لذا يُبنى في حزمة (chunk) منفصلة
// تُجلب عند أول استعمال فعلي للبحث، ولا تثقل الصفحات التي لا تبحث.
//
// Module VOLONTAIREMENT lourd : importé uniquement par import() dynamique
// depuis lib/search.ts → chunk séparé, chargé au premier usage réel.
import { protocols } from "@/data/protocols";
import { GCASES } from "@/data/guidage";
import { medications } from "@/data/medications";
import { calculators } from "@/data/calculators";
import { procedures } from "@/data/procedures";
import { ecgRhythms } from "@/data/ecg";
import { decisionTrees } from "@/data/trees";
import { normalize, type RefType, type SearchItem } from "./search-core";

/** Construit l'index de recherche (une seule fois — mis en cache par lib/search.ts). */
export function buildSearchIndex(): SearchItem[] {
  return [
    ...protocols.map((p) => ({
      key: `protocole:${p.id}`,
      type: "protocole" as RefType,
      href: `/protocoles/${p.id}#steps`,
      title: p.title,
      hay: normalize(`${p.title.fr} ${p.title.ar} ${p.id} ${p.category} ${p.severity}`),
      sev: p.severity,
    })),
    ...medications.map((m) => ({
      key: `medicament:${m.id}`,
      type: "medicament" as RefType,
      href: `/medicaments/${m.id}#doses`,
      title: m.name,
      hay: normalize(`${m.name.fr} ${m.name.ar} ${m.synonyms.join(" ")} ${m.klass.fr} ${m.klass.ar} ${m.brands ?? ""}`),
    })),
    ...GCASES.map((g) => ({
      key: `guidage:${g.id}`,
      type: "guidage" as RefType,
      href: `/guidage?c=${g.id}`,
      title: { fr: `Guidage — ${g.fr}`, ar: `توجيه — ${g.ar}` },
      hay: normalize(`guidage ${g.fr} ${g.ar} ${g.id}`),
    })),
    ...calculators.map((c) => ({
      key: `calculateur:${c.id}`,
      type: "calculateur" as RefType,
      href: c.href,
      title: c.title,
      hay: normalize(`${c.title.fr} ${c.title.ar} ${c.description.fr} ${c.description.ar}`),
    })),
    ...procedures.map((p) => ({
      key: `procedure:${p.id}`,
      type: "procedure" as RefType,
      href: `/procedures/${p.id}`,
      title: p.title,
      hay: normalize(`${p.title.fr} ${p.title.ar} ${p.id}`),
    })),
    ...ecgRhythms.map((r) => ({
      key: `ecg:${r.id}`,
      type: "ecg" as RefType,
      href: `/ecg`,
      title: r.title,
      hay: normalize(`${r.title.fr} ${r.title.ar} ${r.kind}`),
    })),
    ...decisionTrees.map((t) => ({
      key: `arbre:${t.id}`,
      type: "arbre" as RefType,
      href: `/arbres/${t.id}`,
      title: t.title,
      hay: normalize(
        `${t.title.fr} ${t.title.ar} ${t.description.fr} ${t.description.ar} ${t.id} arbre decisionnel algorithme شجرة`
      ),
    })),
    // ── Outils transverses (pages hors données agrégées) ──
    {
      key: "outil:triage",
      type: "outil",
      href: "/triage",
      title: { fr: "Triage — situation par situation", ar: "الفرز — حالة بحالة" },
      hay: normalize(
        "triage tri trisage فرز priorités rouge orange vert p1 p2 p3 investissement vital classement أولوية اصفرار اولويات مستوى"
      ),
    },
    {
      key: "outil:triage-ia",
      type: "outil",
      href: "/triage-ia",
      title: { fr: "Aide au triage IA", ar: "مساعد الفرز الذكي" },
      hay: normalize("triage ia aide assistant فرز ذكي"),
    },
    {
      key: "outil:triage-arbre",
      type: "outil",
      href: "/arbres/triage-prehospitalier",
      title: { fr: "Arbre de triage préhospitalier (P1/P2/P3)", ar: "شجرة الفرز قبل الاستشفائي (P1/P2/P3)" },
      hay: normalize(
        "triage arbre decisionnel p1 p2 p3 priorite minute scene conscience respiration فرز شجرة اولوية وعي تنفس"
      ),
    },
    {
      key: "outil:checklists",
      type: "outil",
      href: "/checklists",
      title: { fr: "Check-lists (transport, matériel, SAUV)", ar: "قوائم التدقيق (نقل، تجهيز، إنعاش)" },
      hay: normalize(
        "checklist liste verification malle sac urgence transport interhospitalier sauv materiel equipment قائمة تدقيق تجهيز نقل صندوق حافظة"
      ),
    },
    {
      key: "outil:fiche-samu",
      type: "outil",
      href: "/fiche-samu",
      title: { fr: "Fiche d'intervention SAMU / SMUR", ar: "فيشة تدخّل SAMU / SMUR" },
      hay: normalize(
        "fiche intervention samu smur rapport transmission bilan documentation horaires فيشة فش تدخل توثيق تقرير تبليغ"
      ),
    },
    {
      key: "outil:rea",
      type: "outil",
      href: "/rea",
      title: { fr: "Réanimation — ce qui s'exécute à la minute", ar: "الإنعاش — ما يُنفَّذ هذه الدقيقة" },
      hay: normalize(
        "rea reanimation acr rcp arret cardio circulation ventilation rsi vni amine adrenaline choc انعاش توقف قلب إنعاش تنبيب تهوية أمينات أدرينالين صعق"
      ),
    },
    {
      key: "outil:memo",
      type: "outil",
      href: "/memo",
      title: { fr: "Mémo — lecture & révision (quiz, ECG, constantes)", ar: "مذكّرة — قراءة ومراجعة (اختبارات، ECG، ثوابت)" },
      hay: normalize(
        "memo fiche revision quiz ecg constantes vitales lecture revue apprentissage مذكرة مراجعة قراءة ثوابت اختبار تعلم"
      ),
    },
    {
      key: "outil:recherche",
      type: "outil",
      href: "/recherche",
      title: { fr: "Recherche globale", ar: "البحث الشامل" },
      hay: normalize("recherche chercher search mot cle trouver بحث شامل كلمة ابحث"),
    },
    {
      key: "outil:reevaluation",
      type: "outil",
      href: "/reevaluation",
      title: {
        fr: "Réévaluation — dépistage de la détérioration (OAP, choc, sepsis…)",
        ar: "إعادة التقييم — رصد التدهور (وذمة رئوية، صدمة، إنتان…)",
      },
      hay: normalize(
        "reevaluation reeval deterioration depistage oap oedeme poumon choc sepsis qsofa bradycardie hypoglycemie gcs constantes vitales surveillance إعادة تقييم تدهور رصد وذمة رئوية صدمة انتان سكر ثوابت مراقبة"
      ),
    },
    {
      key: "outil:resume",
      type: "outil",
      href: "/resume",
      title: { fr: "Résumé de cas — relève / transfert", ar: "ملخص الحالة — تسليم / انتقال" },
      hay: normalize(
        "resume cas releve transfert transmission synthese handover bilan ملف ملخص حالة تسليم انتقال نقل إبلاغ جامع"
      ),
    },
  ];
}

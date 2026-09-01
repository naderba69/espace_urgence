import HubPage from "@/components/HubPage";
import T from "@/components/T";
import { AlertTriangle } from "lucide-react";

const SUICIDE_FACTORS = [
  { fr: "Tentative récente, idéations actives avec plan et moyens", ar: "محاولة حديثة، أفكار فاعلة بخطة ووسيلة" },
  { fr: "Isolement social, perte récente (deuil, emploi, séparation)", ar: "عزلة اجتماعية، فقد حديث (حداد، عمل، انفصال)" },
  { fr: "Trouble psychiatrique connu (dépression, schizophrénie), consommation d'alcool/substances", ar: "اضطراب نفسي معروف، تعاطي كحول/مواد" },
  { fr: "Antécédent familial de suicide, douleur chronique", ar: "قصة عائلية انتحار، ألم مزمن" },
  { fr: "Âge avancé ou très jeune, agitation marquée ou apathie après hyperactivité", ar: "سن متقدمة أو مبكرة جداً، هياج أو خمول بعد فرط حركة" },
];

export default function PsychiatriePage() {
  return (
    <HubPage
      title={{ fr: "Urgences psychiatriques", ar: "استعجالات الطب النفسي" }}
      intro={{ fr: "Sécurité, désescalade, tri du risque suicidaire, antidotes toxicologiques.", ar: "سلامة، تهدئة، فرز خطر الانتحار، ترياقات سمية." }}
      protocolIds={["agitation-aigue"]}
      medicationIds={["midazolam", "diazepam", "naloxone", "acetylcysteine", "flumazenil"]}
    >
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 font-bold text-teal-500"><T fr="Évaluation rapide du risque suicidaire" ar="تقييم سريع لخطر الانتحار" /></h2>
        <ul className="space-y-2">
          {SUICIDE_FACTORS.map((f, i) => (
            <li key={i} className="flex gap-2 rounded-xl border border-line p-3 text-sm">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
              <T fr={f.fr} ar={f.ar} />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm opacity-70">
          <T fr="Tout patient à risque : NE PAS laisser seul, retirer les moyens, avis psychiatrique urgent. Demander directement (« Pensez-vous à vous faire du mal ? ») n'augmente pas le risque."
             ar="أي مريض خطير: لا تتركه وحيداً، أنزع الوسائل، رأي نفسي مستعجل. السؤال المباشر لا يزيد الخطر." />
        </p>
      </section>
    </HubPage>
  );
}

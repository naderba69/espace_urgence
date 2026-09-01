import HubPage from "@/components/HubPage";
import T from "@/components/T";
import Link from "next/link";
import { Phone } from "lucide-react";

export default function ObstetriquePage() {
  return (
    <HubPage
      title={{ fr: "Urgences obstétricales", ar: "استعجالات التوليد" }}
      intro={{ fr: "Éclampsie, hémorragie du post-partum, accouchement inopiné — gestes qui sauvent en attendant la maternité.", ar: "الارتعاج، نزف ما بعد الولادة، ولادة غير متوقعة — إجراءات منقذة انتظاراً للمستشفى." }}
      protocolIds={["eclampsie", "hemorragie-post-partum"]}
      medicationIds={["sulfate-magnesium", "oxytocine", "acide-tranexamique", "gluconate-calcium"]}
    >
      <section className="card flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
        <Phone className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" aria-hidden />
        <div>
          <p className="font-bold"><T fr="Toujours appeler la maternité/SAMU au plus tôt" ar="اتصل بالولادة/الإسعاف بأسرع وقت دائماً" /></p>
          <p className="mt-1 text-sm opacity-80">
            <T fr="Transport gauche latéral, monitoring TA/SpO2, calcium sous la main avec MgSO4."
               ar="نقل بالاستلقاء الأيسر، مراقبة الضغط والتشبع، وجاهزية الكالسيوم مع Mg." />
          </p>
        </div>
      </section>

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 font-bold text-teal-500"><T fr="Accouchement inopiné" ar="ولادة غير متوقعة" /></h2>
        <p className="mb-3 text-sm opacity-80"><T fr="Procédure détaillée :" ar="الإجراء بالتفصيل:" /></p>
        <Link href="/procedures/accouchement-inopine" className="rounded-full border border-teal-600 px-4 py-2 text-sm font-bold text-teal-500">
          <T fr="Voir la procédure" ar="شاهد الإجراء" />
        </Link>
      </section>
    </HubPage>
  );
}

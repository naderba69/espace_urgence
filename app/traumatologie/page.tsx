import HubPage from "@/components/HubPage";
import T from "@/components/T";
import Link from "next/link";

export default function TraumatologiePage() {
  return (
    <HubPage
      title={{ fr: "Traumatologie", ar: "طب الإصابات" }}
      intro={{ fr: "Polytraumatisme, traumatisme crânien, brûlures — XABCDE et immobilisation.", ar: "متعدد الرضوض، رض الرأس، الحروق — XABCDE والتثبيت." }}
      protocolIds={["polytraumatisme", "traumatisme-cranien", "brulure-grave"]}
      medicationIds={["acide-tranexamique", "ketamine", "morphine", "midazolam"]}
    >
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 font-bold text-teal-500"><T fr="Immobilisation rachidienne" ar="التثبيت الفقري" /></h2>
        <p className="mb-3 text-sm opacity-80"><T fr="Procédure complète :" ar="الإجراء الكامل:" /></p>
        <Link href="/procedures/immobilisation-rachis" className="rounded-full border border-teal-600 px-4 py-2 text-sm font-bold text-teal-500">
          <T fr="Voir la procédure" ar="شاهد الإجراء" />
        </Link>
        <Link href="/calculateurs/gcs" className="ms-2 rounded-full border border-line px-4 py-2 text-sm font-bold hover:bg-surface2">
          GCS
        </Link>
      </section>
    </HubPage>
  );
}

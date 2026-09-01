import HubPage from "@/components/HubPage";
import T from "@/components/T";
import Link from "next/link";
import { vitalSigns } from "@/data/quickref";

export default function PediatriePage() {
  return (
    <HubPage
      title={{ fr: "Pédiatrie d'urgence", ar: "استعجالي الأطفال" }}
      intro={{ fr: "Repères adressés à l'urgentiste généraliste — doses par poids, différences physiologiques.", ar: "مرجعيات لطبيب الاستعجالي العام — جرعات بالوزن، فروق فيزيولوجية." }}
      protocolIds={["acr-pediatrique", "deshydratation-enfant"]}
      medicationIds={["adrenaline", "amiodarone", "paracetamol", "midazolam"]}
    >
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 font-bold text-teal-500"><T fr="Constantes par âge (rappel)" ar="الثوابت حسب العمر (تذكير)" /></h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-start opacity-70">
                <th className="p-2 text-start"></th>
                <th className="p-2 text-start"><T fr="Enfant" ar="طفل" /></th>
                <th className="p-2 text-start"><T fr="Nourrisson" ar="رضيع" /></th>
                <th className="p-2 text-start"><T fr="Nouveau-né" ar="حديث الولادة" /></th>
              </tr>
            </thead>
            <tbody>
              {vitalSigns.map((v) => (
                <tr key={v.label.fr} className="border-b border-line/50 last:border-0">
                  <td className="p-2 font-medium"><T fr={v.label.fr} ar={v.label.ar} /></td>
                  <td className="p-2 tabular-nums">{v.child}</td>
                  <td className="p-2 tabular-nums">{v.infant}</td>
                  <td className="p-2 tabular-nums">{v.newborn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card rounded-2xl border border-teal-600/40 bg-teal-600/10 p-4">
        <h2 className="mb-2 font-bold text-teal-500"><T fr="Formules rapides" ar="صيغ سريعة" /></h2>
        <ul className="space-y-1 text-sm">
          <li>• <T fr="Poids (kg) ≈ (âge × 2) + 8" ar="الوزن (كغ) ≈ (العمر × 2) + 8" /></li>
          <li>• <T fr="Sonde trachéale (mm) ≈ âge/4 + 4" ar="أنبوب قصبي ≈ عمر/4 + 4" /></li>
          <li>• <T fr="Défibrillation : 4 J/kg biphasique" ar="الصدمة: 4 جول/كغ ثنائية" /></li>
          <li>• <T fr="Adrénaline ACR : 0,01 mg/kg (1/10 000)" ar="أدرنالين الإنعاش: 0.01 ملغ/كغ (1/10000)" /></li>
        </ul>
        <Link href="/calculateurs/poids-pediatrique" className="mt-3 inline-block rounded-xl bg-teal-600 px-5 py-2 font-bold text-white">
          <T fr="Calculateur associé" ar="الحاسبة المصاحبة" />
        </Link>
      </section>
    </HubPage>
  );
}

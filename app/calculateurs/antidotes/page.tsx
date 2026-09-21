"use client";
// v10.0-A3 — ملاح الترياقات : ترياق ↔ استطباب ↔ جرعة.
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import { Syringe } from "lucide-react";

const ANTIDOTES: { name: string; arName: string; indFr: string; indAr: string; doseFr: string; doseAr: string }[] = [
  { name: "Naloxone", arName: "نالوكسون", indFr: "Opioïdes", indAr: "أفيونيات", doseFr: "0,4 mg IV/IM, répéter ttes 2-3 min", doseAr: "٠٫٤ مغ وريدي/عضلي كل ٢-٣ د" },
  { name: "Flumazénil", arName: "فلومازينيل", indFr: "Benzodiazépines", indAr: "بنزوديازيبين", doseFr: "0,2 mg IV lent, prudence épilepsie", doseAr: "٠٫٢ مغ وريدي ببطء، حذر بالصرع" },
  { name: "Atropine", arName: "أتروبين", indFr: "Organophosphorés / bradycardie", indAr: "فوسفور عضوي/بطء قلب", doseFr: "1-2 mg IV, doubler ttes 5 min jusqu'atropinisation", doseAr: "١-٢ مغ وريدي مضاعفة كل ٥ د حتى الأتربنة" },
  { name: "NAC", arName: "أسيتيل سيستئين", indFr: "Paracétamol", indAr: "باراسيتامول", doseFr: "Selon abaque (≤ 8 h idéal)", doseAr: "حسب المخطط (قبل ٨ س مثالياً)" },
  { name: "Vit K + PPSB", arName: "فيتامين K + بلازما", indFr: "AVK", indAr: "مضادات فيتامين K", doseFr: "Vit K 5-10 mg IV lent + PPSB si saignement", doseAr: "فيتامين K ٥-١٠ مغ وريدي + بلازما عند النزف" },
  { name: "Protamine", arName: "بروتامين", indFr: "Héparine", indAr: "هيبارين", doseFr: "1 mg / 100 UI d'héparine restante (max 50 mg)", doseAr: "١ مغ لكل ١٠٠ وحدة هيبارين متبقية (حد ٥٠ مغ)" },
  { name: "Gluconate de Ca", arName: "غلوكونات كالسيوم", indFr: "Hyperkaliémie / inhibiteurs calciques", indAr: "فرط بوتاسيوم/حاصرات كالسيوم", doseFr: "10 mL de 10 % IV en 5-10 min", doseAr: "١٠ مل من ١٠٪ وريدي خلال ٥-١٠ د" },
  { name: "Bicarbonates", arName: "بيكربونات", indFr: "Tricycliques (QRS > 100 ms)", indAr: "ثلاثية الحلقات (QRS > ١٠٠)", doseFr: "1-2 mEq/kg IV, cible pH 7,45-7,55", doseAr: "١-٢ مكافئ/كغ وريدي، هدف pH ٧٫٤٥-٧٫٥٥" },
  { name: "Bleu de méthylène", arName: "أزرق الميتيلين", indFr: "Méthémoglobinémie", indAr: "ميتهيموغلوبينية", doseFr: "1-2 mg/kg IV en 5 min", doseAr: "١-٢ مغ/كغ وريدي خلال ٥ د" },
  { name: "Fomépizole", arName: "فوميبيزول", indFr: "Méthanol / éthylène-glycol", indAr: "ميثانول/إيثيلين غليكول", doseFr: "15 mg/kg IV puis entretien", doseAr: "١٥ مغ/كغ وريدي ثم صيانة" },
  { name: "Hydroxocobalamine", arName: "هيدروكسوكوبالامين", indFr: "Cyanures (fumées)", indAr: "سيانيد (دخان)", doseFr: "70 mg/kg IV (max 5 g)", doseAr: "٧٠ مغ/كغ وريدي (حد ٥ غ)" },
  { name: "Fab digoxine", arName: "أضداد الديجوكسين", indFr: "Digitalique", indAr: "ديجيتال", doseFr: "Selon dosage/ingestion", doseAr: "حسب المستوى/الكمية المبتلعة" },
];

export default function AntidotesPage() {
  useRegisterRecent("calculateur:antidotes");
  const { lang } = useApp();
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Syringe className="h-6 w-6" />}
        title={lang === "ar" ? "ملاح الترياقات" : "Navigateur d'antidotes"}
        sub={lang === "ar" ? "ترياق ↔ استطباب ↔ جرعة أولية." : "Antidote ↔ indication ↔ dose initiale."}
      />
      <ul className="flex flex-col gap-3">
        {ANTIDOTES.map((a) => (
          <li key={a.name} className="card rounded-2xl border border-line bg-surface p-4">
            <p className="font-black">{a.name} · {a.arName}</p>
            <p className="mt-0.5 text-sm font-bold" style={{ color: "var(--accent)" }}>{lang === "ar" ? a.indAr : a.indFr}</p>
            <p className="mt-1 text-sm opacity-70">{lang === "ar" ? a.doseAr : a.doseFr}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

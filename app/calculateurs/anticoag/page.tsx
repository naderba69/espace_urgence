"use client";
// v10.0-A3 — عكس مضادات التخثر : لكل دواء عكسه وجرعته.
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { HeartPulse } from "lucide-react";

const DRUGS: { name: string; arName: string; revFr: string; revAr: string; noteFr: string; noteAr: string; sev: 1 | 2 }[] = [
  { name: "Héparine (HNF)", arName: "هيبارين غير مجزأ", revFr: "Protamine 1 mg / 100 UI (max 50 mg, IV lent)", revAr: "بروتامين ١ مغ/١٠٠ وحدة (حد ٥٠ مغ وريدي بطيء)", noteFr: "Demi-vie courte : parfois surveiller suffit.", noteAr: "نصف عمر قصير: قد تكفي المراقبة.", sev: 2 },
  { name: "HBPM (énoxaparine)", arName: "هيبارين منخفض الوزن", revFr: "Protamine 1 mg / mg d'HBPM si < 8 h (réversion partielle)", revAr: "بروتامين ١ مغ/مغ إن < ٨ س (عكس جزئي)", noteFr: "Anti-Xa pour guider.", noteAr: "مضاد Xa للتوجيه.", sev: 2 },
  { name: "AVK (warfarine)", arName: "وارفارين", revFr: "Vit K 5-10 mg IV lent + PPSB 25-50 UI/kg si hémorragie grave", revAr: "فيتامين K ٥-١٠ مغ وريدي بطيء + بلازما ٢٥-٥٠ وحدة/كغ عند نزف خطير", noteFr: "INR de contrôle à 30 min.", noteAr: "مراقبة INR بعد ٣٠ د.", sev: 1 },
  { name: "Dabigatran", arName: "دابيغاتران", revFr: "Idarucizumab 5 g IV ; à défaut hémodialyse", revAr: "إيداروسيزوماب ٥ غ وريدي؛ وإلا غسل دم", noteFr: "aPTT/thrombine pour confirmer.", noteAr: "تأكيد بفحص الثرومبين.", sev: 1 },
  { name: "Anti-Xa (rivaroxaban/apixaban)", arName: "مثبطات Xa", revFr: "Andexanet alfa si disponible ; sinon PPSB 50 UI/kg", revAr: "أندكسانيت إن توفر؛ وإلا بلازما ٥٠ وحدة/كغ", noteFr: "Charbon activé si ingestion < 2 h.", noteAr: "فحم منشط إن < ساعتين من الابتلاع.", sev: 1 },
];

export default function AnticoagPage() {
  useRegisterRecent("calculateur:anticoag");
  const { lang } = useApp();
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<HeartPulse className="h-6 w-6" />}
        title={lang === "ar" ? "عكس مضادات التخثر" : "Réversion des anticoagulants"}
        sub={lang === "ar" ? "لكل دواء عكسه — النزف الخطر أولاً." : "À chaque drogue son antidote — hémorragie grave d'abord."}
      />
      <ul className="flex flex-col gap-3">
        {DRUGS.map((d) => (
          <li key={d.name} className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${d.sev === 1 ? "sev-critical" : "sev-urgent"}`}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="font-black">{d.name} · {d.arName}</p>
              <Badge tone={d.sev === 1 ? "critical" : "urgent"}>{d.sev === 1 ? (lang === "ar" ? "عكس نوعي" : "Spécifique") : (lang === "ar" ? "جزئي" : "Partiel")}</Badge>
            </div>
            <p className="text-sm font-bold">{lang === "ar" ? d.revAr : d.revFr}</p>
            <p className="mt-1 text-sm opacity-70">{lang === "ar" ? d.noteAr : d.noteFr}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

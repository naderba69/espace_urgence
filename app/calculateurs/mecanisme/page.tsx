"use client";
// v10.0-A5 — محلّل الإصابات : آلية الرضّ → خطورة + إصابات متوقعة + أولويات.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { AlertTriangle } from "lucide-react";

const MEC: {
  id: string; fr: string; ar: string; sev: 1 | 2 | 3;
  lesFr: string; lesAr: string; actFr: string; actAr: string;
  links: { href: string; fr: string; ar: string }[];
}[] = [
  {
    id: "chute", fr: "Chute > 3 m (adulte) ou > 1,5 m (enfant)", ar: "سقوط > ٣ م (كبير) أو > ١٫٥ م (طفل)", sev: 1,
    lesFr: "Décélération : bassin, rachis, calcanéum, TCC.", lesAr: "تباطؤ: حوض، عمود فقري، عقب، رض رأس.",
    actFr: "Immobilisation rachis + bilan lésionnel complet (bassin, calcaneum).", actAr: "تثبيت العمود + تقييم كامل (حوض، عقب).",
    links: [{ href: "/calculateurs/canadian-cspine", fr: "Rachis cervical", ar: "العمود الرقبي" }, { href: "/calculateurs/canadian-ct-head", fr: "TDM cérébrale", ar: "طبقي للدماغ" }],
  },
  {
    id: "avp", fr: "AVP: > 60 km/h, éjection, déformation majeure", ar: "حادث سيارة: > ٦٠ كم/س، قذف، تشوّه كبير", sev: 1,
    lesFr: "Choc haute énergie : thorax, aorte, foie/rate, rachis.", lesAr: "صدمة عالية الطاقة: صدر، أبه، كبد/طحال، عمود.",
    actFr: "Voie veineuse + transfusion précoce si choc hémorragique ; FAST/TDM.", actAr: "مسار وريدي + نقل دم مبكر عند صدمة نزفية؛ إيكو/طبقي.",
    links: [{ href: "/calculateurs/transfusion", fr: "Transfusion", ar: "نقل الدم" }, { href: "/calculateurs/trauma-membres", fr: "Trauma membres", ar: "رض الأطراف" }],
  },
  {
    id: "deuxroues", fr: "Deux-roues / piéton projeté", ar: "دراجة/راجل مقذوف", sev: 2,
    lesFr: "Fémur, tibia, genou, poignet + TCC fréquent.", lesAr: "فخذ، ظنبوب، ركبة، رسغ + رض رأس شائع.",
    actFr: "Dépister le TCC (perte de connaissance, amnésie) + lésions de membres.", actAr: "افحص رض الرأس (فقدان وعي/فقدان ذاكرة) وإصابات الأطراف.",
    links: [{ href: "/calculateurs/trauma-membres", fr: "Trauma membres", ar: "رض الأطراف" }],
  },
  {
    id: "ecrasement", fr: "Écrasement / blast (suspecter rhabdomyolyse)", ar: "سحق / انفجار (اشتبه بحلّ العضل)", sev: 1,
    lesFr: "Rhabdomyolyse → hyperkaliémie + IRA ; poumon de blast.", lesAr: "حلّ عضلي → فرط بوتاسيوم + قصور كلوي؛ رئة انفجار.",
    actFr: "Remplissage précoce AVANT désincarcération ; CPK/K+ ; alcalinisation discutée.", actAr: "تعويض مبكر قبل الإخراج؛ CPK/بوتاسيوم؛ قلوية عند اللزوم.",
    links: [{ href: "/calculateurs/hyperkalemie", fr: "Hyperkaliémie", ar: "فرط البوتاسيوم" }, { href: "/calculateurs/aki", fr: "AKI KDIGO", ar: "قصور الكلى" }],
  },
  {
    id: "penetrant", fr: "Plaie pénétrante thoracique / abdominale", ar: "جرح نافذ صدري/بطني", sev: 1,
    lesFr: "Hémothorax, pneumothorax compressif, lésion vasculaire.", lesAr: "دموي جنبي، استرواح ضاغط، إصابة وعائية.",
    actFr: "Décompression si détresse ; jamais retirer l'objet empalé ; bloc opératoire.", actAr: "تفريغ عند الضيق؛ لا تنزع الجسم المغروز؛ غرفة عمليات.",
    links: [{ href: "/calculateurs/rcp-equipe", fr: "Équipe RCP", ar: "فريق الإنعاش" }],
  },
  {
    id: "minime", fr: "Chute < 3 m sans perte de connaissance", ar: "سقوط < ٣ م دون فقدان وعي", sev: 3,
    lesFr: "Possible entorse/fracture distale isolée.", lesAr: "احتمال التواء/كسر بعيد معزول.",
    actFr: "Examen orienté + antalgie ; pas d'imagerie systématique.", actAr: "فحص موجّه + تسكين؛ لا تصوير روتيني.",
    links: [{ href: "/calculateurs/trauma-membres", fr: "Trauma membres", ar: "رض الأطراف" }],
  },
];

export default function MecanismePage() {
  useRegisterRecent("calculateur:mecanisme");
  const { lang } = useApp();
  const [sel, setSel] = useState<string | null>(null);
  const m = useMemo(() => MEC.find((x) => x.id === sel) ?? null, [sel]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<AlertTriangle className="h-6 w-6" />}
        title={lang === "ar" ? "محلّل الإصابات (الآلية)" : "Analyseur de mécanisme"}
        sub={lang === "ar" ? "اختر آلية الرضّ — الخطورة والإصابات المتوقعة والأولويات." : "Choisissez le mécanisme — gravité, lésions attendues, priorités."}
      />

      <div className="card flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 text-sm font-bold">
        <p className="font-black" style={{ color: "var(--sev-critical)" }}><T fr="D'abord, toujours" ar="أولاً، دائماً" /></p>
        <p><T fr="Hémorragie externe → compression; ABCDE; prévenir l'hypothermie; trigramme létal (hypoxie, hypovolémie, hypothermie)." ar="نزف خارجي → ضغط؛ ABCDE؛ وقاية انخفاض الحرارة؛ الثالوث القاتل." /></p>
      </div>

      <div className="flex flex-wrap gap-2">
        {MEC.map((x) => {
          const on = sel === x.id;
          return (
            <button key={x.id} onClick={() => setSel(on ? null : x.id)} aria-pressed={on}
              className={`touch rounded-full border px-3 py-2 text-start text-xs font-black ${on ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
              style={on ? { background: "var(--accent)" } : undefined}>
              {lang === "ar" ? x.ar : x.fr}
            </button>
          );
        })}
      </div>

      {m ? (
        <div className={`card sev-strip flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 ${m.sev === 1 ? "sev-critical" : m.sev === 2 ? "sev-urgent" : "sev-standard"}`}>
          <div className="flex items-center justify-between gap-2">
            <p className="font-black">{lang === "ar" ? m.ar : m.fr}</p>
            <Badge tone={m.sev === 1 ? "critical" : m.sev === 2 ? "urgent" : "standard"}>
              {m.sev === 1 ? <T fr="Haute énergie" ar="طاقة عالية" /> : m.sev === 2 ? <T fr="Intermédiaire" ar="متوسطة" /> : <T fr="Faible" ar="منخفضة" />}
            </Badge>
          </div>
          <p className="text-sm"><span className="font-black opacity-70"><T fr="Lésions:" ar="الإصابات: " /></span>{lang === "ar" ? m.lesAr : m.lesFr}</p>
          <p className="text-sm"><span className="font-black opacity-70"><T fr="Priorités:" ar="الأولويات: " /></span>{lang === "ar" ? m.actAr : m.actFr}</p>
          {m.links.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {m.links.map((l) => (
                <Link key={l.href} href={l.href} className="rounded-full border px-4 py-2 text-sm font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
                  {lang === "ar" ? l.ar : l.fr}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Sélectionnez un mécanisme pour voir la conduite." ar="اختر آلية لعرض التدبير." />
        </p>
      )}
    </div>
  );
}

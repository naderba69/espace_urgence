"use client";
// v11.2-B — قراءة تحليل البول : شرائط + رسابة → أنماط كلوية.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Droplets } from "lucide-react";

type Item = { id: string; fr: string; ar: string };
const DIP: Item[] = [
  { id: "leuco", fr: "Leucocytes +", ar: "كريات +" },
  { id: "nitrite", fr: "Nitrites +", ar: "نتريت +" },
  { id: "sang", fr: "Sang/Hémoglobine +", ar: "دم/هيموغلوبين +" },
  { id: "prot", fr: "Protéinurie ≥ 1 g/L", ar: "بروتين ≥ ١ غ/ل" },
  { id: "protMass", fr: "Protéinurie massive (> 3 g/j)", ar: "بروتين ضخم (> ٣ غ/يوم)" },
  { id: "glu", fr: "Glucose + (sans hyperglycémie connue)", ar: "غلوكوز + دون سكري معروف" },
  { id: "ceton", fr: "Cétones +", ar: "كيتونات +" },
  { id: "ph", fr: "pH alcalin (> 7,5)", ar: "pH قلوي (> ٧٫٥)" },
];
const SED: Item[] = [
  { id: "cylGR", fr: "Cylindres hématiques", ar: "أسطوانات دموية" },
  { id: "acantho", fr: "Hématies déformées (acanthocytes)", ar: "كريات مشوّهة" },
  { id: "cylLeuco", fr: "Cylindres leucocytaires", ar: "أسطوانات كرية" },
  { id: "eosino", fr: "Éosinophilurie", ar: "يوزينات بولية" },
  { id: "cristaux", fr: "Cristaux (oxalate/urate)", ar: "بلورات (أوكسالات/يورات)" },
  { id: "bact", fr: "Bactéries nombreuses / leucocytes > 10/champ", ar: "جراثيم كثيرة/كريات > ١٠ بالحقل" },
];

export default function UrinesPage() {
  useRegisterRecent("calculateur:urines");
  const { lang } = useApp();
  const [on, setOn] = useState<Set<string>>(new Set());
  const t = (id: string) => setOn((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const v = useMemo(() => {
    const has = (k: string) => on.has(k);
    const it = has("leuco") || has("nitrite") || has("bact") || has("cylLeuco");
    const glom = has("cylGR") || has("acantho") || (has("sang") && (has("prot") || has("protMass")));
    const nephro = has("protMass");
    const inter = has("eosino") && (has("leuco") || has("bact") === false);
    const stone = has("cristaux") && has("sang");
    const dka = has("glu") && has("ceton");
    const count = [it, glom, nephro, inter, stone, dka].filter(Boolean).length;
    return { it, glom, nephro, inter, stone, dka, count };
  }, [on]);

  const CARDS: { on: boolean; sev: number; fr: string; ar: string; actFr: string; actAr: string }[] = [
    { on: v.nephro, sev: 1, fr: "Syndrome néphrotique", ar: "متلازمة كلائية", actFr: "Protéinurie massive + œdèmes : bilan (albuminémie, cholestérol), avis néphrologie, anticoagulation discutée.", actAr: "بروتين ضخم + وذمات: تحليل (ألبومين، كوليسترول)، استشارة كلى." },
    { on: v.glom, sev: 1, fr: "Néphrite glomérulaire", ar: "التهاب كبيبات", actFr: "Hématurie + protéinurie + cylindres : tension, ionogramme, protéinurie des 24 h, avis urgent.", actAr: "بيلة دموية + بروتين + أسطوانات: ضغط، كهارل، بروتين ٢٤ س، استشارة عاجلة." },
    { on: v.it, sev: 2, fr: "Infection urinaire", ar: "التهاب بولي", actFr: "Leucocytes/nitrites/bactéries : ECBU, antibiothérapie selon gravité (fièvre, grossesse, homme).", actAr: "كريات/نتريت/جراثيم: مزرعة، مضاد حيوي حسب الخطورة." },
    { on: v.inter, sev: 2, fr: "Atteinte interstitielle / pyurie stérile", ar: "إصابة خلالية / قيح عقيم", actFr: "Souvent médicament : revoir les traitements, éosinophilurie à confirmer.", actAr: "غالباً دوائي: راجع العلاجات، أكّد اليوزينات." },
    { on: v.stone, sev: 2, fr: "Lithiase", ar: "حصاة", actFr: "Hématurie + cristaux + colique : antalgie, hydratation, imagerie non injectée.", actAr: "بيلة دموية + بلورات + مغص: تسكين، إرواء، تصوير دون صبغة." },
    { on: v.dka, sev: 1, fr: "Cétonurie + glycosurie (DKA ?)", ar: "كيتون + سكر بالبول (حماض؟)", actFr: "Corréler avec glycémie et gaz du sang — protocole DKA si cétose + hyperglycémie.", actAr: "قارن مع السكر والغازات — بروتوكول الحماض إن كيتوز + فرط سكر." },
  ].filter((c) => c.on).sort((a, b) => a.sev - b.sev);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Droplets className="h-6 w-6" />}
        title={lang === "ar" ? "قراءة تحليل البول" : "Lecture de l'analyse urinaire"}
        sub={lang === "ar" ? "شرائط + رسابة → الأنماط الكلوية." : "Bandelette + sédiment → patterns néphrologiques."}
      />

      <section className="flex flex-col gap-2">
        <p className="text-sm font-black opacity-70"><T fr="Bandelette" ar="الشرائط" /></p>
        <div className="card flex flex-wrap gap-2 rounded-2xl border border-line bg-surface p-4">
          {DIP.map((d) => {
            const sel = on.has(d.id);
            return <button key={d.id} onClick={() => t(d.id)} aria-pressed={sel}
              className={`touch rounded-full border px-3 py-2 text-xs font-black ${sel ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
              style={sel ? { background: "var(--accent)" } : undefined}>{lang === "ar" ? d.ar : d.fr}</button>;
          })}
        </div>
        <p className="text-sm font-black opacity-70"><T fr="Sédiment" ar="الرسابة" /></p>
        <div className="card flex flex-wrap gap-2 rounded-2xl border border-line bg-surface p-4">
          {SED.map((d) => {
            const sel = on.has(d.id);
            return <button key={d.id} onClick={() => t(d.id)} aria-pressed={sel}
              className={`touch rounded-full border px-3 py-2 text-xs font-black ${sel ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
              style={sel ? { background: "var(--accent)" } : undefined}>{lang === "ar" ? d.ar : d.fr}</button>;
          })}
        </div>
      </section>

      {v.count > 0 ? (
        <div className="flex flex-col gap-2">
          {CARDS.map((c) => (
            <div key={c.fr} className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${c.sev === 1 ? "sev-critical" : c.sev === 2 ? "sev-urgent" : "sev-standard"}`}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="font-black">{lang === "ar" ? c.ar : c.fr}</p>
                <Badge tone={c.sev === 1 ? "critical" : "urgent"}>{lang === "ar" ? (c.sev === 1 ? "أولوية" : "شائع") : c.sev === 1 ? "Prioritaire" : "Fréquent"}</Badge>
              </div>
              <p className="text-sm font-bold opacity-80">{lang === "ar" ? c.actAr : c.actFr}</p>
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <Link href="/calculateurs/aki" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="AKI / KDIGO" ar="قصور الكلى AKI" /></Link>
            <Link href="/calculateurs/dka" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="DKA" ar="حماض كيتوني" /></Link>
            <Link href="/calculateurs/rau" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Rétention aiguë" ar="احتباس حاد" /></Link>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Cochez les anomalies de la bandelette ou du sédiment." ar="علّم شذوذات الشرائط أو الرسابة." />
        </p>
      )}
    </div>
  );
}

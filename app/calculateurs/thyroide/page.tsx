"use client";
// v11.3-B — أنماط الغدة الدرقية المخبرية : TSH ↔ FT4.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Stethoscope } from "lucide-react";

type Dir = "haut" | "normal" | "bas";

function Seg({ title, v, set }: { title: string; v: Dir; set: (d: Dir) => void }) {
  return (
    <div className="card rounded-2xl border border-line bg-surface p-3">
      <p className="mb-2 text-sm font-black opacity-70">{title}</p>
      <div className="flex gap-2">
        {(["bas", "normal", "haut"] as Dir[]).map((d) => {
          const on = v === d;
          return (
            <button key={d} onClick={() => set(d)} aria-pressed={on}
              className={`touch flex-1 rounded-xl border px-2 py-2 text-xs font-black ${on ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
              style={on ? { background: "var(--sev-urgent)" } : undefined}>
              {d === "bas" ? <T fr="Bas" ar="منخفض" /> : d === "normal" ? <T fr="Normal" ar="طبيعي" /> : <T fr="Élevé" ar="مرتفع" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ThyroidePage() {
  useRegisterRecent("calculateur:thyroide");
  const { lang } = useApp();
  const [tsh, setTsh] = useState<Dir>("normal");
  const [ft4, setFt4] = useState<Dir>("normal");
  const [grossesse, setGrossesse] = useState(false);

  const r = useMemo(() => {
    if (tsh === "haut" && ft4 === "bas") return { id: "hypo", sev: 2, fr: "Hypothyroïdie primaire patente", ar: "قصور درقي أولي صريح",
      actFr: "Lévothyroxine 1,6 µg/kg/j (débuter bas chez le coronarien), contrôle TSH à 6-8 semaines.", actAr: "ليفوثيروكسين ١٫٦ مكغ/كغ/يوم (ابدأ منخفضاً عند مريض القلب)، تحقق TSH بعد ٦-٨ أسابيع." };
    if (tsh === "haut" && ft4 === "normal") return { id: "fruste", sev: 1, fr: "Hypothyroïdie fruste (subclinique)", ar: "قصور درقي خفي",
      actFr: "Traiter si TSH > 10, symptômes, grossesse/désir de grossesse, dyslipidémie ; sinon contrôler à 6-8 semaines.", actAr: "عالج إن كان TSH > ١٠ أو أعراض أو حمل/رغبة حمل أو خلل دهني؛ وإلا أعد التحقق بعد ٦-٨ أسابيع." };
    if ((tsh === "bas" || tsh === "normal") && ft4 === "bas") return { id: "centrale", sev: 3, fr: "Hypothyroïdie centrale (TSH non élevée)", ar: "قصور درقي مركزي",
      actFr: "Chercher une cause hypophysaire (IRM, cortisol AVANT lévothyroxine, autres axes) — avis endocrinologie.", actAr: "ابحث عن سبب نخامي (رنين، كورتيزول قبل الليفوثيروكسين، محاور أخرى) — استشارة غدد." };
    if (tsh === "bas" && ft4 === "haut") return { id: "hyper", sev: 2, fr: "Hyperthyroïdie patente", ar: "فرط درقي صريح",
      actFr: "Bêtabloquant + thyréostatique, ECG (FA), chercher crise aiguë (fièvre, délire, tachycardie > 140) = urgence.", actAr: "حاصر بيتا + مثبّط درقي، تخطيط (رجفان)، ابحث عن الأزمة الحادة (حرارة، هذيان، تسرع > ١٤٠) = طارئ." };
    if (tsh === "bas" && ft4 === "normal") return { id: "subhyper", sev: 1, fr: "Hyperthyroïdie subclinique", ar: "فرط درقي تحت السريري",
      actFr: "Confirmer à 6-8 semaines, chercher FA/ostéoporose ; traiter selon âge et comorbidités.", actAr: "أكّد بعد ٦-٨ أسابيع، ابحث عن رجفان/هشاشة؛ عالج حسب العمر والأمراض المرافقة." };
    return { id: "normal", sev: 0, fr: "Profil euthyroïdien", ar: "نمط سوي الغدة",
      actFr: "TSH et FT4 concordantes : pas d'argument biologique pour un trouble thyroïdien.", actAr: "TSH و FT4 متوافقان: لا دليل مخبري على خلل درقي." };
  }, [tsh, ft4]);

    return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Stethoscope className="h-6 w-6" />}
        title={lang === "ar" ? "أنماط الغدة الدرقية" : "Patterns thyroïdiens"}
        sub={lang === "ar" ? "TSH و FT4 → النمط والتدبير." : "TSH et FT4 → pattern et conduite."}
      />

      <div className="grid gap-2 sm:grid-cols-2">
        <Seg title="TSH" v={tsh} set={setTsh} />
        <Seg title={lang === "ar" ? "FT4 الحر" : "FT4 libre"} v={ft4} set={setFt4} />
      </div>

      <button onClick={() => setGrossesse((g) => !g)} aria-pressed={grossesse}
        className={`touch rounded-xl border p-3 text-sm font-black ${grossesse ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
        style={grossesse ? { background: "var(--accent)" } : undefined}>
        <T fr="Grossesse ou désir de grossesse" ar="حمل أو رغبة في الحمل" />
      </button>

      <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.sev === 3 ? "sev-critical" : r.sev === 2 ? "sev-urgent" : r.sev === 1 ? "sev-standard" : ""}`}>
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-base font-black">{lang === "ar" ? r.ar : r.fr}</p>
          <Badge tone={r.sev === 3 ? "critical" : r.sev === 2 ? "urgent" : r.sev === 1 ? "standard" : "neutral"}>
            {r.sev === 3 ? <T fr="Alerte" ar="تنبيه" /> : r.sev === 2 ? <T fr="Traiter" ar="علاج" /> : r.sev === 1 ? <T fr="Discuter" ar="مناقشة" /> : <T fr="Rassurant" ar="مطمئن" />}
          </Badge>
        </div>
        <p className="text-sm font-bold">{lang === "ar" ? r.actAr : r.actFr}</p>
        {grossesse && (
          <p className="mt-2 rounded-xl p-2 text-sm font-black" style={{ background: "var(--sev-urgent-bg)", color: "var(--sev-urgent)" }}>
            <T fr="Grossesse: normes de TSH abaissées par trimestre, seuil de traitement plus bas, cible de TSH < 2,5 au 1er trimestre — avis spécialisé." ar="الحمل: قيم TSH طبيعية أقل حسب الفصل، وعتبة العلاج أدنى، والهدف < ٢٫٥ في الفصل الأول — استشارة مختص." />
          </p>
        )}
        <p className="mt-2 text-xs opacity-70">
          <T fr="Pièges de lecture: la biotine et certains médicaments faussent les dosages; une TSH isolée ne suffit jamais (sauf dépistage néonatal)." ar="مصائد القراءة: البيوتين وبعض الأدوية تُشوّه النتائج؛ TSH وحدها لا تكفي (إلا في فحص الوليد)." />
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/calculateurs/lactate" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Lactate / sepsis" ar="لاكتات/إنتان" /></Link>
          <Link href="/calculateurs/bilan-hepatique" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Bilan hépatique" ar="وظائف الكبد" /></Link>
        </div>
      </div>
    </div>
  );
}

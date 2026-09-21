"use client";
// v11.2-B — تخثّر منتثر داخل الأوعية : نتيجة ISTH المحسوبة.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { AlertTriangle } from "lucide-react";

type Choice = { pt: number; fr: string; ar: string };

const PLT: Choice[] = [
  { pt: 0, fr: "> 100 ×10⁹/L", ar: "> ١٠٠" },
  { pt: 1, fr: "50-100 ×10⁹/L", ar: "٥٠-١٠٠" },
  { pt: 2, fr: "< 50 ×10⁹/L", ar: "< ٥٠" },
];
const PT: Choice[] = [
  { pt: 0, fr: "Prolongation < 3 s (ou INR < 1,4)", ar: "إطالة < ٣ ث" },
  { pt: 1, fr: "3-6 s (ou INR 1,4-1,7)", ar: "٣-٦ ث" },
  { pt: 2, fr: "> 6 s (ou INR > 1,7)", ar: "> ٦ ث" },
];
const FIB: Choice[] = [
  { pt: 0, fr: "Fibrinogène > 1 g/L", ar: "فيبرينوجين > ١ غ/ل" },
  { pt: 1, fr: "Fibrinogène ≤ 1 g/L", ar: "فيبرينوجين ≤ ١ غ/ل" },
];
const DD: Choice[] = [
  { pt: 0, fr: "Pas d'augmentation", ar: "بلا ارتفاع" },
  { pt: 2, fr: "Augmentation modérée", ar: "ارتفاع معتدل" },
  { pt: 3, fr: "Augmentation forte", ar: "ارتفاع قوي" },
];

function Group({ title, items, val, set }: { title: string; items: Choice[]; val: number; set: (v: number) => void }) {
  const { lang } = useApp();
  return (
    <div className="card rounded-2xl border border-line bg-surface p-3">
      <p className="mb-2 text-sm font-black opacity-70">{title}</p>
      <div className="flex flex-col gap-2">
        {items.map((c) => {
          const on = val === c.pt;
          return (
            <button key={c.pt} onClick={() => set(c.pt)} aria-pressed={on}
              className={`touch flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-start text-xs font-bold ${on ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
              style={on ? { background: "var(--accent)" } : undefined}>
              <span>{lang === "ar" ? c.ar : c.fr}</span>
              <span className="font-black tabular-nums">{c.pt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DicPage() {
  useRegisterRecent("calculateur:dic");
  const { lang } = useApp();
  const [pl, setPl] = useState(0);
  const [pt, setPt] = useState(0);
  const [fb, setFb] = useState(0);
  const [dd, setDd] = useState(0);

  const total = useMemo(() => pl + pt + fb + dd, [pl, pt, fb, dd]);
  const overt = total >= 5;
  const grey = total === 4;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<AlertTriangle className="h-6 w-6" />}
        title={lang === "ar" ? "تخثّر منتثر داخل الأوعية (ISTH)" : "CIVD — score ISTH"}
        sub={lang === "ar" ? "أربعة معايير — النتيجة ≥ ٥ = CIVD صريح." : "Quatre critères — score ≥ 5 = CIVD patente."}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <Group title={lang === "ar" ? "الصفيحات" : "Plaquettes"} items={PLT} val={pl} set={setPl} />
        <Group title={lang === "ar" ? "إطالة زمن البروثرومبين" : "Temps de prothrombine"} items={PT} val={pt} set={setPt} />
        <Group title={lang === "ar" ? "الفيبرينوجين" : "Fibrinogène"} items={FIB} val={fb} set={setFb} />
        <Group title={lang === "ar" ? "D-dimères / PDF" : "D-dimères / PDF"} items={DD} val={dd} set={setDd} />
      </div>

      <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${overt ? "sev-critical" : grey || total >= 3 ? "sev-urgent" : "sev-standard"}`}>
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-lg font-black">{lang === "ar" ? `المجموع ${total}/8` : `Score ${total}/8`}</p>
          <Badge tone={overt ? "critical" : grey || total >= 3 ? "urgent" : "standard"}>
            {overt ? <T fr="CIVD patente" ar="CIVD صريح" /> : grey ? <T fr="Zone limite" ar="حدّي" /> : total >= 3 ? <T fr="CIVD non patente" ar="غير صريح" /> : <T fr="Peu probable" ar="مستبعد" />}
          </Badge>
        </div>
        <ul className="flex flex-col gap-1 text-sm font-bold">
          {overt ? (
            <>
              <li className="font-black" style={{ color: "var(--sev-critical)" }}>
                <T fr="CIVD patente: traiter la cause (sepsis, hémorragie, hémostase obstétricale) — c'est le traitement principal." ar="CIVD صريح: عالج السبب (إنتان، نزف، تخثر ولادي) — هو العلاج الأساسي." />
              </li>
              <li><T fr="Plaquettes < 50 ou fibrinogène < 1,5 ou saignement: substituer (plaquettes, plasma frais, fibrinogène)." ar="صفيحات < ٥٠ أو فيبرينوجين < ١٫٥ أو نزف: عوّض (صفيحات، بلازما طازجة، فيبرينوجين)." /></li>
              <li><T fr="Pas d'héparine systématique; prophylaxie seulement si CIVD thrombotique dominante." ar="لا هيبارين روتيني؛ الوقاية فقط في النمط الخثاري الغالب." /></li>
            </>
          ) : (
            <>
              <li><T fr="Répéter le bilan (plaquettes, TP, fibrinogène, D-dimères) dans 6-12 h si le tableau persiste." ar="أعد التحليل (صفيحات، PT، فيبرينوجين، D-dimères) بعد ٦-١٢ س إن استمر الحال." /></li>
              <li><T fr="Une CIVD biologique sans saignement ni thrombose: traiter la cause d'abord." ar="CIVD مخبري دون نزف أو تخثر: عالج السبب أولاً." /></li>
            </>
          )}
          <li className="opacity-70"><T fr="D-dimères élevés isolés: âge, grossesse, cancer, thrombose, post-opératoire — non spécifiques." ar="ارتفاع D-dimères وحده: عمر، حمل، سرطان، تخثر، بعد الجراحة — غير نوعي." /></li>
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/calculateurs/hemogramme" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Hémogramme" ar="تعداد الدم" /></Link>
          <Link href="/calculateurs/transfusion" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Transfusion" ar="نقل الدم" /></Link>
          <Link href="/calculateurs/heparine" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Héparine / TIH" ar="هيبارين / TIH" /></Link>
        </div>
      </div>
    </div>
  );
}

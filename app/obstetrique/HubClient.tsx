"use client";
import HubPage from "@/components/HubPage";
import T from "@/components/T";
import Link from "next/link";
import { Phone } from "lucide-react";
import { useRef, useState } from "react";
import { mgso4DrawMl, mgso4RateMlH } from "@/lib/calc";
import { reveal } from "@/lib/reveal";

const AMPS = [
  { pct: 10, fr: "10 % (1 g / 10 mL)", ar: "10% (1 غ / 10 مل)" },
  { pct: 15, fr: "15 % (1,5 g / 10 mL)", ar: "15% (1.5 غ / 10 مل)" },
  { pct: 50, fr: "50 % (5 g / 10 mL)", ar: "50% (5 غ / 10 مل)" },
] as const;

function MgTool() {
  const [pct, setPct] = useState<number | null>(null);
  const prepRef = useRef<HTMLDivElement>(null);
  return (
    <section className="card rounded-2xl border border-line bg-surface p-4">
      <h2 className="mb-2 font-bold text-blue-500">MgSO₄ — <T fr="préparation interactive" ar="تحضير تفاعلي" /></h2>
      <p className="mb-2 text-sm font-bold"><T fr="Quelle ampoule avez-vous ?" ar="أي أمبولة متوفرة لديكم؟" /></p>
      <div className="mb-3 flex flex-wrap gap-2">
        {AMPS.map((a) => (
          <button key={a.pct} onClick={() => { const firstPick = pct === null; setPct(a.pct); if (firstPick) reveal(prepRef.current); }} aria-pressed={pct === a.pct}
            className={`touch rounded-xl border px-3 py-2 text-sm font-bold ${pct === a.pct ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            {a.ar} / {a.fr}
          </button>
        ))}
      </div>
      <div ref={prepRef} className="scroll-mt-16" aria-hidden />

      {pct !== null && (
        <div className="space-y-2 text-sm">
          <p className="rounded-xl bg-blue-600/10 p-3 font-black text-blue-500">
            <T fr="Charge 4 g: prélever" ar="الجرعة التحميلية 4 غ: اسحب" /> {mgso4DrawMl(pct, 4)} mL — <T fr="diluer (20-100 mL) et passer sur 15-20 min" ar="خفّف (20-100 مل) ومرر على 15-20 د" />
          </p>
          <p className="rounded-xl bg-blue-600/10 p-3 font-black text-blue-500">
            <T fr="Entretien 1 g/h PSE:" ar="الاستمرار 1 غ/س بمضخة:" /> {mgso4RateMlH(pct, 1)} mL/h
          </p>
          <p className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
            <T fr="Toxicité: FR < 16/min, réflexes abolis, diurèse < 25 mL/h → stop + gluconate de calcium 1 g IV."
               ar="السمية: تنفس أقل من 16/د، غياب المنعكسات، بيلة أقل من 25 مل/س → أوقف + غلوكونات الكالسيوم 1 غ وريدياً." />
          </p>
        </div>
      )}
    </section>
  );
}

export function ObstetriquePageClient({
  linked,
}: {
  linked: ReturnType<typeof import("@/lib/hub-props").hubProps>;
}) {
  return (
    <HubPage
      title={{ fr: "Urgences obstétricales", ar: "استعجالات التوليد" }}
      intro={{ fr: "Éclampsie, hémorragie du post-partum, accouchement inopiné — gestes qui sauvent en attendant la maternité.", ar: "الارتعاج، نزف ما بعد الولادة، ولادة غير متوقعة — إجراءات منقذة انتظاراً للمستشفى." }}
      {...linked}
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

      <MgTool />

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 font-bold text-blue-500"><T fr="Accouchement inopiné" ar="ولادة غير متوقعة" /></h2>
        <p className="mb-3 text-sm opacity-80"><T fr="Procédure détaillée:" ar="الإجراء بالتفصيل:" /></p>
        <Link href="/procedures/accouchement-inopine" className="rounded-full border border-blue-600 px-4 py-2 text-sm font-bold text-blue-500">
          <T fr="Voir la procédure" ar="شاهد الإجراء" />
        </Link>
      </section>
    </HubPage>
  );
}

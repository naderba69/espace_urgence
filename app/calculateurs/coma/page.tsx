"use client";
// v10.0-A1 — الغيبوبة : نهج منظم AVPU/GCS + أسباب قابلة للعكس + أعلام حمراء.
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import T from "@/components/T";
import { Brain, Check } from "lucide-react";

const STEPS: { id: string; fr: string; ar: string; detailFr: string; detailAr: string; href?: string }[] = [
  { id: "a", fr: "A — Voie aérienne + rachis", ar: "أ — مجرى هواء + عمود فقري", detailFr: "Position latérale si vomissements ; collier si trauma ; O2 haut débit.", detailAr: "وضع جانبي عند الإقياء؛ طوق عند الرض؛ أكسجين عالٍ." },
  { id: "glu", fr: "Glycémie capillaire IMMÉDIATEMENT", ar: "سكر شعيري فوراً", detailFr: "Toute hypoglycémie < 0,7 g/L se traite avant tout le reste.", detailAr: "كل نقص < ٠٫٧ غ/ل يُعالج قبل أي شيء.", href: "/protocoles/hypoglycemie" },
  { id: "avpu", fr: "AVPU puis GCS", ar: "AVPU ثم غلاسكو", detailFr: "GCS ≤ 8 = intubation à prévoir ; noter le score avant sédation.", detailAr: "غلاسكو ≤ ٨ = تحضير تنبيب؛ سجّل السكور قبل التهدئة.", href: "/calculateurs/gcs" },
  { id: "opi", fr: "Opioïdes ? Myosis + FR < 12", ar: "أفيونيات؟ بؤبؤ مضيق + تنفس < ١٢", detailFr: "Naloxone 0,4 mg IV/IM répété ; assister la ventilation.", detailAr: "نالوكسون ٠٫٤ مغ وريدي/عضلي مكرر؛ ساند التهوية.", href: "/calculateurs/opioides" },
  { id: "co", fr: "CO / toxiques ?", ar: "أحادي أكسيد الكربون/سموم؟", detailFr: "Contexte chauffage/foyer : O2 100 % ; penser co-oxymétrie.", detailAr: "سياق تدفئة/منزل: أكسجين ١٠٪؛ فكّر بقياس CO." },
  { id: "flags", fr: "Drapeaux rouges", ar: "أعلام حمراء", detailFr: "Raideur de nuque → méningite ; déficit focal → AVC ; trauma → imagerie.", detailAr: "تصلب رقبة → سحايا؛ عجز بؤري → سكتة؛ رض → تصوير.", href: "/protocoles/avc" },
];

export default function ComaPage() {
  useRegisterRecent("calculateur:coma");
  const { lang } = useApp();
  const [done, setDone] = useState<Set<string>>(new Set());
  const pct = Math.round((done.size / STEPS.length) * 100);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Brain className="h-6 w-6" />}
        title={lang === "ar" ? "الغيبوبة — نهج منظم" : "Coma — approche structurée"}
        sub={lang === "ar" ? "رتّب الأولويات قبل السبب: سكر، أفيون، أكسجين." : "Priorités avant la cause : glucose, opioïdes, oxygène."}
      />

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <div className="mb-2 flex items-center justify-between text-sm font-black">
          <span><T fr="Progression" ar="التقدم" /></span>
          <span className="tabular-nums" style={{ color: "var(--accent)" }}>{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface2">
          <div className="h-full transition-all" style={{ width: `${pct}%`, background: "var(--accent)" }} />
        </div>
      </div>

      <section className="flex flex-col gap-3">
        {STEPS.map((s, i) => {
          const ok = done.has(s.id);
          return (
            <div key={s.id} className={`card rounded-2xl border border-line bg-surface p-4 ${ok ? "opacity-60" : ""}`}>
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setDone((p) => { const n = new Set(p); if (ok) n.delete(s.id); else n.add(s.id); return n; })}
                  role="checkbox" aria-checked={ok}
                  className="touch mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2"
                  style={ok ? { background: "var(--accent)", borderColor: "var(--accent)", color: "#fff" } : { borderColor: "var(--line)" }}
                  aria-label={s.fr}
                >
                  {ok && <Check className="h-5 w-5" aria-hidden />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="font-black"><span className="tabular-nums opacity-50">{i + 1}.</span> {lang === "ar" ? s.ar : s.fr}</p>
                  <p className="mt-0.5 text-sm opacity-70">{lang === "ar" ? s.detailAr : s.detailFr}</p>
                  {s.href && (
                    <Link href={s.href} className="mt-2 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
                      <span dir="ltr">⇒</span> {lang === "ar" ? "الأداة/البروتوكول" : "Outil / protocole"}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>
      <SectionTitle>{lang === "ar" ? "قاعدة" : "Règle"}</SectionTitle>
      <p className="rounded-xl border border-dashed border-line p-4 text-sm font-bold opacity-80">
        <T fr="Glycémie + naloxone + O2: les trois gestes qui réveillent — toujours avant le scanner." ar="سكر + نالوكسون + أكسجين: الإجراءات الثلاثة التي تُفيق — دائماً قبل الماسح." />
      </p>
    </div>
  );
}

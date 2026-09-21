"use client";
// v11.1-B — شبكة قراءة صورة الصدر : قراءة منهجية + قوائم أنماط.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Wind } from "lucide-react";

type Zone = { fr: string; ar: string; checks: string[]; arChecks: string[] };

const ZONES: Zone[] = [
  {
    fr: "Qualité (RIPE)", ar: "الجودة (RIPE)",
    checks: ["Rotation : apophyses médianes centrées sur la trachée", "Inspiration : 9-10 arcs postérieurs", "Pénétration : rachis visible derrière le cœur", "Exposition centrée / cadrage complet"],
    arChecks: ["الدوران: الشوكات متوسطة على الرغامى", "الشهيق: ٩-١٠ أضلاع خلفية", "التعرّض: العمود مرئي خلف القلب", "توسيط وتأطير كامل"],
  },
  {
    fr: "Voies aériennes et trachée", ar: "المسالك الهوائية والرغامى",
    checks: ["Trachée médiane ? (déviation = épanchement / atélectasie)", "Carène et bronches souches"],
    arChecks: ["الرغامى متوسطة؟ (انحراف = انصباب/انخماص)", "مفترق الرغامى والشعبتان"],
  },
  {
    fr: "Poumons (comparer zone par zone)", ar: "الرئتان (قارن منطقة بمنطقة)",
    checks: ["Opacités alvéolaires : infection, œdème, hémorragie", "Nodule / masse / cavité", "Interstitiel : lignes B de Kerley, trame", "Hyperclarté + absence de trame = pneumothorax", "Coupoles et culs-de-sac (épanchement, pincement)"],
    arChecks: ["تعتّم حويصلي: التهاب، وذمة، نزف", "عقدة/كتلة/تجويف", "خطوط B لكيرلي وتغيّر الترميم", "شفافية زائدة مع غياب الترميم = استرواح", "القبتان والجيبان (انصباب/انطمار)"],
  },
  {
    fr: "Cœur et médiastin", ar: "القلب والمنصف",
    checks: ["Index cardio-thoracique < 0,5", "Contours : oreillette gauche, aorte, artère pulmonaire", "Élargissement du médiastin = dissection suspectée → angio-TDM"],
    arChecks: ["مؤشر القلب-الصدر < ٠٫٥", "الحدود: أذين أيسر، أبه، شريان رئوي", "توسّع المنصف = شكّ تسلّخ → طبقي وعائي"],
  },
  {
    fr: "Diaphragme et plèvre", ar: "الحجاب والجنب",
    checks: ["Coupole droite plus haute (foie)", "Aspect de dôme = épanchement ; sucre = normal", "Aéro-bronchogramme présent = consolidation"],
    arChecks: ["القبة اليمنى أعلى (الكبد)", "قبة مرتفعة = انصباب؛ مقوّسة = طبيعي", "تخطيط قصبي هوائي = تكثّف"],
  },
  {
    fr: "Os et tissus mous", ar: "العظام والأنسجة الرخوة",
    checks: ["Côtes : fractures, série costale", "Clavicules, omoplates, rachis", "Emphysème sous-cutané, corps étranger"],
    arChecks: ["الأضلاع: كسور، سلسلة الأضلاع", "الترقوة، لوح الكتف، العمود", "التفسّخ تحت الجلد، جسم غريب"],
  },
  {
    fr: "Matériel et lignes", ar: "القساطر والأجهزة",
    checks: ["Sonde trachéale : 3-5 cm au-dessus de la carène", "CVC : bout à la jonction cavo-atriale, pas de boucle", "Drain thoracique en position"],
    arChecks: ["أنبوب الرغامى: ٣-٥ سم فوق المفترق", "القسطر الوريدي المركزي: النهاية عند الوصل الأجوف-الأذيني", "مكان أنبوب الصدر"],
  },
];

const PATTERNS: { fr: string; ar: string; signsFr: string; signsAr: string }[] = [
  { fr: "Œdème pulmonaire", ar: "وذمة رئة", signsFr: "Opacités bilatérales centrales + redistribution + culs-de-sac + cœur élargi", signsAr: "تعتّمات مركزية ثنائية + إعادة توزيع + قلب موسّع" },
  { fr: "Pneumonie", ar: "ذات الرئة", signsFr: "Consolidation systématisée + aéro-bronchogramme, pas de perte de volume", signsAr: "تكثّف بمنطقة كاملة + تخطيط قصبي دون فقدان حجم" },
  { fr: "Pneumothorax", ar: "استرواح صدري", signsFr: "Hyperclarté, pas de trame, ligne pleurale ; chercher tension (déviation)", signsAr: "شفافية مع غياب الترميم وخط جنبي؛ ابحث عن الضاغط" },
  { fr: "Épanchement", ar: "انصباب جنبي", signsFr: "Opacité déclive, ménisque, effacement du cul-de-sac", signsAr: "تعتّم قاعي مع شكل هلالي ومحو الجيب" },
  { fr: "SDRA", ar: "ضيق تنفسي حاد", signsFr: "Opacités bilatérales diffuses, cœur normal, contexte (sepsis/trauma)", signsAr: "تعتّمات ثنائية منتشرة، قلب طبيعي، سياق إنتاني/رضّي" },
];

export default function RxThoraxPage() {
  useRegisterRecent("calculateur:rx-thorax");
  const { lang } = useApp();
  const [open, setOpen] = useState<number | null>(0);
  const [done, setDone] = useState<Set<string>>(new Set());
  const toggle = (k: string) => setDone((p) => { const n = new Set(p); if (n.has(k)) n.delete(k); else n.add(k); return n; });

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Wind className="h-6 w-6" />}
        title={lang === "ar" ? "شبكة قراءة صورة الصدر" : "Grille de lecture radiographie thoracique"}
        sub={lang === "ar" ? "٧ مناطق بالترتيب الثابت — لا تقفز فوق منطقة." : "7 zones dans un ordre fixe — ne jamais sauter une zone."}
      />

      <div className="flex flex-col gap-2">
        {ZONES.map((z, i) => {
          const isOpen = open === i;
          const zDone = z.checks.filter((_, j) => done.has(i + "-" + j)).length;
          return (
            <div key={i} className="card overflow-hidden rounded-2xl border border-line bg-surface">
              <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-2 p-3 text-start">
                <span className="text-sm font-black">{lang === "ar" ? z.ar : z.fr}</span>
                <span className="flex items-center gap-2">
                  <Badge tone={zDone === z.checks.length ? "standard" : "neutral"}>{zDone}/{z.checks.length}</Badge>
                  <span className="text-xs opacity-60">{isOpen ? "▲" : "▼"}</span>
                </span>
              </button>
              {isOpen && (
                <ul className="flex flex-col gap-2 border-t border-line p-3">
                  {(lang === "ar" ? z.arChecks : z.checks).map((c, j) => {
                    const k = i + "-" + j, on = done.has(k);
                    return (
                      <li key={j}>
                        <button onClick={() => toggle(k)} aria-pressed={on} className={`flex w-full items-start gap-2 rounded-xl border px-3 py-2 text-start text-xs font-bold ${on ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
                          style={on ? { background: "var(--accent)" } : undefined}>
                          <span>{on ? "✓" : "○"}</span><span>{c}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <section className="flex flex-col gap-2">
        <p className="text-base font-black"><T fr="Patterns clés" ar="الأنماط المفتاحية" /></p>
        {PATTERNS.map((p) => (
          <div key={p.fr} className="card rounded-2xl border border-line bg-surface p-3">
            <p className="text-sm font-black">{lang === "ar" ? p.ar : p.fr}</p>
            <p className="text-xs opacity-70">{lang === "ar" ? p.signsAr : p.signsFr}</p>
          </div>
        ))}
      </section>

      <p className="rounded-xl border border-dashed border-line p-3 text-xs opacity-70">
        <T fr="Toujours comparer avec une imagerie antérieure et regarder la zone cachée (derrière le cœur, sous le diaphragme)." ar="قارن دائماً مع صورة سابقة وافحص المنطقة المخفية (خلف القلب وتحت الحجاب)." />
      </p>
    </div>
  );
}

"use client";
// v11.1-B — قائمة POCUS/FAST : نوافذ الإيكو السريع في الطوارئ.
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Gauge } from "lucide-react";

type Proto = { id: string; fr: string; ar: string; useFr: string; useAr: string; windows: { fr: string; ar: string; posFr: string; posAr: string; posFr2?: string }[] };

const PROTOS: Proto[] = [
  {
    id: "fast", fr: "FAST / eFAST", ar: "FAST / eFAST",
    useFr: "Trauma fermé instable : chercher du liquide libre.", useAr: "رضّ مغلق غير مستقر: ابحث عن سائل حر.",
    windows: [
      { fr: "Péricardique (sous-xiphoïdien)", ar: "التاموري (تحت الرهابة)", posFr: "Vue 4 cavités — épanchement + signe de compression", posAr: "منظر الأجواف الأربعة — انصباب + علامات الانضغاط" },
      { fr: "RUQ — espace hépatorectal", ar: "الربع العلوي الأيمن", posFr: "Ligne axillaire moyenne, foie et rein", posAr: "الخط الإبطي المتوسط، الكبد والكلية" },
      { fr: "LUQ — espace spléno-rénal", ar: "الربع العلوي الأيسر", posFr: "Plus postérieur et plus haut", posAr: "أكثر خلفية وأعلى" },
      { fr: "Pelvis — Douglas / recto-vésical", ar: "الحوض", posFr: "Sonde sus-pubienne, vessie pleine aide", posAr: "مسبار فوق العانة، المثانة الممتلئة تساعد" },
      { fr: "eFAST: thorax (2 vues)", ar: "الطور: الصدر (منظران)", posFr: "Chercher pneumothorax (glissement pleural absent) + hémothorax", posAr: "ابحث عن استرواح (غياب انزلاق الجنب) ودموي جنبي" },
    ],
  },
  {
    id: "rush", fr: "RUSH — choc indifférencié", ar: "RUSH — صدمة غير مفسّرة",
    useFr: "Choc : pompe, réservoir, tuyaux.", useAr: "صدمة: المضخة، الخزان، الأنابيب.",
    windows: [
      { fr: "Pompe: cœur (contractilité, épanchement, VD dilaté)", ar: "المضخة: القلب (تقاصر، انصباب، بطين أيمن متوسع)", posFr: "Parasternal long axe + 4 cavités", posAr: "محور طولي + أربعة أجواف" },
      { fr: "Réservoir: VCI (collapsée = hypovolémie, dilatée = surcharge)", ar: "الخزان: الوريد الأجوف (منطبق = نقص حجم؛ متوسع = حمولة زائدة)", posFr: "Sous-xiphoïdien, 2 cm sous la jonction", posAr: "تحت الرهابة، ٢ سم أسفل الوصل" },
      { fr: "Tuyaux: aorte (anévrisme/dissection), veines fémorales (TVP)", ar: "الأنابيب: الأبه (أم الدم/التسلخ)، الأوردة الفخذية", posFr: "Coupes longitudinales et transverses", posAr: "مقاطع طولية وعرضية" },
      { fr: "Poumons: lignes B (surcharge) vs poumon sec", ar: "الرئتان: خطوط B (حمولة زائدة) مقابل رئة جافة", posFr: "Espaces intercostaux, 4 zones par côté", posAr: "المسافات الوربية، ٤ مناطق لكل جهة" },
    ],
  },
  {
    id: "lung", fr: "Poumon et plèvre", ar: "الرئة والجنب",
    useFr: "Dyspnée aiguë : pneumothorax, ligne B, consolidation.", useAr: "ضيق تنفس حاد: استرواح، خطوط B، تكثّف.",
    windows: [
      { fr: "Glissement pleural présent/absent", ar: "انزلاق الجنب موجود/غائب", posFr: "Sonde linéaire, espaces intercostaux antérieurs", posAr: "مسبار خطي، المسافات الوربية الأمامية" },
      { fr: "Lignes B (≥ 3 par champ = surcharge)", ar: "خطوط B (≥ ٣ بالحقل = حمولة زائدة)", posFr: "Artéfacts verticaux partant de la plèvre", posAr: "أصداء عمودية تنطلق من الجنب" },
      { fr: "Consolidation (aspect hépatisé)", ar: "تكثّف (مظهر كبدي)", posFr: "Avec bronchogramme aérique dynamique", posAr: "مع تخطيط قصبي متحرك" },
    ],
  },
  {
    id: "aorte", fr: "Abdomen (AAA, rétention)", ar: "البطن (أم الدم، احتباس البول)",
    useFr: "Douleur lombaire/abdominale : AAA, globe vésical, lithiase.", useAr: "ألم قطني/بطني: أم الدم، احتباس بولي، حصاة.",
    windows: [
      { fr: "Aorte: diamètre > 3 cm = anévrisme; > 5 cm = risque", ar: "الأبه: قطر > ٣ سم = أم دم؛ > ٥ سم = خطر", posFr: "Coupes transverses épigastre → ombilic", posAr: "مقاطع عرضية من الشرسوف → السرة" },
      { fr: "Vessie: globe (volume > 400 mL)", ar: "المثانة: احتباس (حجم > ٤٠٠ مل)", posFr: "Sus-pubienne transverse et longitudinale", posAr: "فوق العانة عرضي وطولي" },
      { fr: "Rein: hydronéphrose (néphro / sepsis)", ar: "الكلية: استسقاء (استطباب قسطرة/تنظير)", posFr: "Flancs : dilatation des calices", posAr: "الخاصرتان: توسّع الكؤوس" },
    ],
  },
  {
    id: "oculaire", fr: "Oculaire et autres", ar: "العين وحالات أخرى",
    useFr: "HTA intracrânienne, estomac plein, geste guidé.", useAr: "فرط ضغط داخل القحف، معدة ممتلئة، إجراء موجّه.",
    windows: [
      { fr: "Gaine du nerf optique > 5 mm = HTIC probable", ar: "غلاف العصب البصري > ٥ مم = فرط ضغط محتمل", posFr: "Sonde linéaire sur œil fermé, 3 mesures", posAr: "مسبار خطي على عين مغلقة، ٣ قياسات" },
      { fr: "Estomac plein: risque d'inhalation", ar: "معدة ممتلئة: خطر الشفط", posFr: "Antre gastrique, position assise", posAr: "الغار المعدي، وضعية جالس" },
      { fr: "Guided: voie fémorale, drainage, réduction", ar: "الإجراءات الموجّهة: المسار الفخذي، البزل، الردّ", posFr: "Toujours confirmer en 2 plans", posAr: "أكّد دائماً بمستويين" },
    ],
  },
];

export default function PocusPage() {
  useRegisterRecent("calculateur:pocus");
  const { lang } = useApp();
  const [sel, setSel] = useState(0);
  const [found, setFound] = useState<Set<string>>(new Set());
  const p = PROTOS[sel];
  const toggle = (k: string) => setFound((prev) => { const n = new Set(prev); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const pos = p.windows.filter((_, i) => found.has(sel + "-" + i)).length;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Gauge className="h-6 w-6" />}
        title={lang === "ar" ? "قائمة POCUS / FAST" : "Checklist POCUS / FAST"}
        sub={lang === "ar" ? "البروتوكول، النوافذ، وما تبحث عنه في كل نافذة." : "Protocole, fenêtres et ce qu'on cherche dans chacune."}
      />

      <div className="flex flex-wrap gap-2">
        {PROTOS.map((x, i) => {
          const on = sel === i;
          return (
            <button key={x.id} onClick={() => setSel(i)} aria-pressed={on}
              className={`touch rounded-full border px-3 py-2 text-xs font-black ${on ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
              style={on ? { background: "var(--accent)" } : undefined}>
              {lang === "ar" ? x.ar : x.fr}
            </button>
          );
        })}
      </div>

      <div className="card flex items-center justify-between gap-2 rounded-2xl border border-line bg-surface p-3">
        <p className="text-sm font-bold opacity-80">{lang === "ar" ? p.useAr : p.useFr}</p>
        <Badge tone={pos > 0 ? "critical" : "neutral"}>{pos}/{p.windows.length}</Badge>
      </div>

      <ul className="flex flex-col gap-2">
        {p.windows.map((w, i) => {
          const k = sel + "-" + i, on = found.has(k);
          return (
            <li key={i}>
              <button onClick={() => toggle(k)} aria-pressed={on}
                className={`card w-full rounded-2xl border p-3 text-start ${on ? "sev-strip sev-critical border-line bg-surface" : "border-line bg-surface"}`}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
                    style={on ? { background: "var(--sev-critical)", color: "#fff" } : { border: "2px solid var(--line)" }}>
                    {on ? "!" : i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-black">{lang === "ar" ? w.ar : w.fr}</span>
                    <span className="block text-xs opacity-70">{lang === "ar" ? w.posAr : w.posFr}</span>
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {pos > 0 && (
        <p className="rounded-xl p-3 text-sm font-black" style={{ background: "var(--sev-critical-bg)", color: "var(--sev-critical)" }}>
          <T fr="Trouvaille positive: agir avant de répéter (décompression, remplissage, bloc, antibiothérapie) puis refaire l'examen." ar="نتيجة إيجابية: تصرّف قبل التكرار (تفريغ، تعويض، غرفة عمليات، مضادات حيوية) ثم أعد الفحص." />
        </p>
      )}

      <div className="card flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4 text-xs font-bold opacity-80">
        <p><T fr="Limites: l'obésité, l'emphysème, le pneumopéritoine (gaz) et le rétropéritoine échappent au FAST." ar="الحدود: السمنة، النفاخ، الريح الصفاقي والمنصف الخلفي تفوت FAST." /></p>
        <p><T fr="Un FAST négatif n'élimine pas une lésion: répéter selon l'état hémodynamique." ar="FAST سلبي لا ينفي الإصابة: أعد الفحص حسب الحالة الدورية." /></p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/trauma-membres" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Trauma membres" ar="رض الأطراف" /></Link>
        <Link href="/calculateurs/mecanisme" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Analyseur de mécanisme" ar="محلّل الإصابات" /></Link>
        <Link href="/calculateurs/transfusion" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Transfusion" ar="نقل الدم" /></Link>
      </div>
    </div>
  );
}

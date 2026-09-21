"use client";
// v11.3-B — مراقبة النمو وكشف سوء التغذية : MUAC + وذمات + قراءة المنحنى.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Baby } from "lucide-react";

export default function CroissancePage() {
  useRegisterRecent("calculateur:croissance");
  const { lang } = useApp();
  const [ageM, setAgeM] = useState("");
  const [muac, setMuac] = useState("");
  const [oedeme, setOedeme] = useState(false);
  const [appetit, setAppetit] = useState<"ok" | "faible">("ok");
  const [cassure, setCassure] = useState(false);

  const r = useMemo(() => {
    const A = parseFloat(ageM), M = parseFloat(muac);
    const tooYoung = Number.isFinite(A) && A < 6;
    const severe = oedeme || (Number.isFinite(M) && !tooYoung && M < 115);
    const moderate = !severe && Number.isFinite(M) && !tooYoung && M >= 115 && M < 125;
    const atRisk = !severe && !moderate && (appetit === "faible" || cassure);
    const level = severe ? 3 : moderate ? 2 : atRisk ? 1 : 0;
    return { severe, moderate, atRisk, level, tooYoung, any: Number.isFinite(M) && Number.isFinite(A) };
  }, [ageM, muac, oedeme, appetit, cassure]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Baby className="h-6 w-6" />}
        title={lang === "ar" ? "النمو وكشف سوء التغذية" : "Croissance et dépistage nutritionnel"}
        sub={lang === "ar" ? "محيط العضد + وذمات + قراءة المنحنى قبل أي قرار." : "Périmètre brachial + œdèmes + lecture du couloir avant toute décision."}
      />

      <section className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
          <span className="text-xs font-black opacity-70"><T fr="Âge (mois)" ar="العمر (شهر)" /></span>
          <input type="number" inputMode="decimal" value={ageM} onChange={(e) => setAgeM(e.target.value)}
            className="w-full bg-transparent text-lg font-black tabular-nums outline-none" dir="ltr" />
        </label>
        <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
          <span className="text-xs font-black opacity-70"><T fr="Périmètre brachial (mm)" ar="محيط العضد (مم)" /></span>
          <input type="number" inputMode="decimal" value={muac} onChange={(e) => setMuac(e.target.value)}
            className="w-full bg-transparent text-lg font-black tabular-nums outline-none" dir="ltr" />
        </label>
      </section>

      <section className="card flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        <button onClick={() => setOedeme((v) => !v)} aria-pressed={oedeme}
          className={`touch rounded-xl border p-3 text-sm font-black ${oedeme ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
          style={oedeme ? { background: "var(--sev-critical)" } : undefined}>
          <T fr="Œdèmes des deux pieds (nutritionnels)" ar="وذمة القدمين (تغذوية)" />
        </button>
        <div className="flex gap-2">
          <button onClick={() => setAppetit("ok")} aria-pressed={appetit === "ok"}
            className={`touch flex-1 rounded-xl border p-3 text-sm font-black ${appetit === "ok" ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
            style={appetit === "ok" ? { background: "var(--accent)" } : undefined}><T fr="Appétit conservé" ar="شهية محفوظة" /></button>
          <button onClick={() => setAppetit("faible")} aria-pressed={appetit === "faible"}
            className={`touch flex-1 rounded-xl border p-3 text-sm font-black ${appetit === "faible" ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
            style={appetit === "faible" ? { background: "var(--sev-urgent)" } : undefined}><T fr="Appétit diminué" ar="شهية ضعيفة" /></button>
        </div>
        <button onClick={() => setCassure((v) => !v)} aria-pressed={cassure}
          className={`touch rounded-xl border p-3 text-sm font-black ${cassure ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
          style={cassure ? { background: "var(--sev-urgent)" } : undefined}>
          <T fr="Cassure de la courbe (perte d'un couloir ou plus)" ar="انكسار المنحنى (فقد ممر أو أكثر)" />
        </button>
      </section>

      {r.any || oedeme ? (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.level === 3 ? "sev-critical" : r.level === 2 ? "sev-urgent" : r.level === 1 ? "sev-standard" : ""}`}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-base font-black">
              {r.severe ? <T fr="Malnutrition aiguë sévère" ar="سوء تغذية حاد شديد" />
                : r.moderate ? <T fr="Malnutrition aiguë modérée" ar="سوء تغذية حاد متوسط" />
                  : r.atRisk ? <T fr="À risque: suivi rapproché" ar="معرّض للخطر: متابعة قريبة" />
                    : <T fr="Pas de critère de malnutrition aiguë" ar="لا معيار لسوء التغذية الحاد" />}
            </p>
            <Badge tone={r.level === 3 ? "critical" : r.level === 2 ? "urgent" : r.level === 1 ? "standard" : "neutral"}>
              {r.level === 3 ? <T fr="SAM" ar="شديد" /> : r.level === 2 ? <T fr="MAM" ar="متوسط" /> : r.level === 1 ? <T fr="Vigilance" ar="يقظة" /> : <T fr="OK" ar="سليم" />}
            </Badge>
          </div>
          <ul className="flex flex-col gap-1 text-sm font-bold">
            {r.severe && (
              <>
                <li className="font-black" style={{ color: "var(--sev-critical)" }}>
                  <T fr="Critère: PB < 115 mm ou œdèmes. Tester l'appétit, la glycémie et la température; chercher une infection." ar="المعيار: محيط < ١١٥ مم أو وذمة. افحص الشهية والسكر والحرارة؛ وابحث عن عدوى." />
                </li>
                <li><T fr="Sans complication: lait thérapeutique (F-75 puis RUTF) en ambulatoire; avec complication (anorexie, infection, hypoglycémie): hospitaliser." ar="بلا اختلاط: حليب علاجي (F-75 ثم RUTF) عيادياً؛ مع اختلاط (فقد شهية، عدوى، نقص سكر): إدخال." /></li>
                <li><T fr="Réalimenter prudemment: risque de syndrome de renutrition (phosphore, potassium, magnésium)." ar="أعد التغذية بحذر: خطر متلازمة إعادة التغذية (فوسفور، بوتاسيوم، مغنيزيوم)." /></li>
              </>
            )}
            {r.moderate && (
              <>
                <li><T fr="Critère: PB 115-124 mm. Supplémentation alimentaire + suivi mensuel + éducation familiale." ar="المعيار: محيط ١١٥-١٢٤ مم. دعم غذائي + متابعة شهرية + توعية الأسرة." /></li>
                <li><T fr="Rechercher la cause: infections répétées, tuberculose, VIH, troubles alimentaires." ar="ابحث عن السبب: عدوى متكررة، سل، فيروس نقص المناعة، اضطراب تغذوي." /></li>
              </>
            )}
            {r.atRisk && (
              <li><T fr="PB normal mais appétit diminué ou cassure: pesée mensuelle, conseils alimentaires, revoir les infections." ar="المحيط طبيعي لكن الشهية ضعيفة أو انكسار بالمنحنى: وزن شهري، نصائح غذائية، مراجعة العدوى." /></li>
            )}
            {!r.severe && !r.moderate && !r.atRisk && (
              <li><T fr="PB ≥ 125 mm: dépistage négatif — poursuivre la surveillance habituelle." ar="المحيط ≥ ١٢٥ مم: الكشف سلبي — واصل المراقبة العادية." /></li>
            )}
            {r.tooYoung && (
              <li className="opacity-80"><T fr="Avant 6 mois: le seuil de PB n'est pas validé chez le nourrisson — utiliser le poids pour l'âge et l'aspect clinique." ar="قبل ٦ أشهر: عتبة محيط العضد غير معتمدة — استخدم الوزن للعمر والمظهر السريري." /></li>
            )}
            <li className="opacity-70"><T fr="La cassure de la courbe est souvent le premier signe: elle se lit sur le carnet, pas sur une seule mesure." ar="انكسار المنحنى غالباً أول علامة: يُقرأ من الدفتر لا من قياس واحد." /></li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/calculateurs/poids-pediatrique" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Poids pédiatrique" ar="الوزن الطفلي" /></Link>
            <Link href="/calculateurs/doses-ped" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Doses pédiatriques" ar="الجرعات الطفلية" /></Link>
            <Link href="/calculateurs/neonat-ran" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Nourrisson (RAN)" ar="الوليد (RAN)" /></Link>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Entrez l'âge et le périmètre brachial (6-59 mois)." ar="أدخل العمر ومحيط العضد (٦-٥٩ شهراً)." />
        </p>
      )}
    </div>
  );
}

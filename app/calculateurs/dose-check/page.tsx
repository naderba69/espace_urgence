"use client";
// v11.3-B — لوحة التحقق قبل الإعطاء : حساب + مقارنة + 5B + سقوف.
import { useMemo, useState } from "react";
import Link from "next/link";
import NumStepper from "@/components/ui/NumStepper";
import { useApp, usePrefillPatient } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { ClipboardList } from "lucide-react";

function Field({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit?: string }) {
  return (
    <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
      <span className="text-xs font-black opacity-70">{label}{unit ? ` (${unit})` : ""}</span>
      <NumStepper value={ value } onValue={ onChange } step={ 0.01 } className="w-full bg-transparent text-lg font-black tabular-nums outline-none" label="value" />
    </label>
  );
}

const CHECKS: { id: string; fr: string; ar: string }[] = [
  { id: "patient", fr: "Bon patient (identité + allergie)", ar: "المريض الصحيح (الهوية + الحساسية)" },
  { id: "med", fr: "Bon médicament (nom lisible, non périmé)", ar: "الدواء الصحيح (اسم واضح غير منتهٍ)" },
  { id: "dose", fr: "Bonne dose (calculée + plafond vérifié)", ar: "الجرعة الصحيحة (محسوبة + الحد الأعلى)" },
  { id: "voie", fr: "Bonne voie (IV/IM/SC confirmée)", ar: "المسار الصحيح (وريدي/عضلي/تحت الجلد)" },
  { id: "heure", fr: "Bonne heure (délai, jeûne, interactions)", ar: "الوقت الصحيح (المهلة، الصوم، التفاعلات)" },
  { id: "trace", fr: "Traçabilité (heure + signature + lot)", ar: "التوثيق (الوقت + التوقيع + رقم الدفعة)" },
];

export default function DoseCheckPage() {
  useRegisterRecent("calculateur:dose-check");
  const { lang } = useApp();
  const [w, setW] = useState("");
  usePrefillPatient((p) => {
    if (!w && p.w) setW(p.w);
  });
  const [perKg, setPerKg] = useState("");
  const [cap, setCap] = useState("");
  const [presc, setPresc] = useState("");
  const [conc, setConc] = useState("");
  const [done, setDone] = useState<Set<string>>(new Set());

  const r = useMemo(() => {
    const W = parseFloat(w), D = parseFloat(perKg), C = parseFloat(cap), P = parseFloat(presc), K = parseFloat(conc);
    const has = Number.isFinite(W) && W > 0 && Number.isFinite(D) && D > 0;
    let dose = has ? W * D : null;
    const capped = dose !== null && Number.isFinite(C) && C > 0 && dose > C;
    if (capped && dose !== null) dose = C as number;
    const vol = dose !== null && Number.isFinite(K) && K > 0 ? dose / K : null;
    const ecart = dose !== null && Number.isFinite(P) && P > 0 ? Math.abs((P - dose) / dose) * 100 : null;
    const dixFois = ecart !== null && ecart > 100;
    const petitPoids = Number.isFinite(W) && W > 0 && W < 10;
    const soloConcentr = vol !== null && vol > 20 && (!Number.isFinite(K) ? false : true);
    const niveau = dixFois ? 3 : ecart !== null && ecart > 10 ? 2 : capped || petitPoids ? 1 : 0;
    return { has, dose, capped, vol, ecart, dixFois, petitPoids, soloConcentr, niveau, W };
  }, [w, perKg, cap, presc, conc]);

  const toggle = (id: string) => setDone((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const allDone = CHECKS.every((c) => done.has(c.id));

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<ClipboardList className="h-6 w-6" />}
        title={lang === "ar" ? "التحقق قبل الإعطاء" : "Vérification avant administration"}
        sub={lang === "ar" ? "حساب الجرعة + مقارنة مع الموصوف + قائمة ٦ بنود." : "Dose calculée, écart avec la prescription et check-list en 6 points."}
      />

      <section className="grid grid-cols-2 gap-2">
        <Field label={lang === "ar" ? "الوزن" : "Poids"} unit="kg" value={w} onChange={setW} />
        <Field label={lang === "ar" ? "الجرعة/كغ" : "Dose/kg"} unit="mg/kg" value={perKg} onChange={setPerKg} />
        <Field label={lang === "ar" ? "الحد الأعلى" : "Plafond"} unit="mg" value={cap} onChange={setCap} />
        <Field label={lang === "ar" ? "الجرعة الموصوفة" : "Dose prescrite"} unit="mg" value={presc} onChange={setPresc} />
        <div className="col-span-2"><Field label={lang === "ar" ? "التركيز" : "Concentration"} unit="mg/mL" value={conc} onChange={setConc} /></div>
      </section>

      {r.has ? (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.niveau === 3 ? "sev-critical" : r.niveau === 2 ? "sev-urgent" : r.niveau === 1 ? "sev-standard" : ""}`}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-lg font-black tabular-nums" dir="ltr">
              {r.dose !== null ? `${Math.round(r.dose * 100) / 100} mg` : "—"}
              {r.vol !== null && <span className="ms-2 text-sm opacity-70">= {Math.round(r.vol * 100) / 100} mL</span>}
            </p>
            <Badge tone={r.niveau === 3 ? "critical" : r.niveau === 2 ? "urgent" : r.niveau === 1 ? "standard" : "neutral"}>
              {r.niveau === 3 ? <T fr="STOP" ar="توقّف" /> : r.niveau === 2 ? <T fr="Vérifier" ar="تحقق" /> : r.niveau === 1 ? <T fr="Prudence" ar="حذر" /> : <T fr="Cohérent" ar="متوافق" />}
            </Badge>
          </div>
          <ul className="flex flex-col gap-1 text-sm font-bold">
            {r.capped && <li style={{ color: "var(--sev-urgent)" }}><T fr="Dose plafonnée: le calcul dépassait le maximum autorisé." ar="الجرعة مقيدة: الحساب تجاوز الحد الأعلى المسموح." /></li>}
            {r.ecart !== null && (
              <li style={{ color: r.dixFois ? "var(--sev-critical)" : r.ecart > 10 ? "var(--sev-urgent)" : "var(--accent)" }}>
                <span dir="ltr">Δ {Math.round(r.ecart)}%</span> — {r.dixFois
                  ? <T fr="écart > 100 %: erreur de facteur 10 probable — ne pas administrer avant revérification." ar="فرق > ١٠٠٪: خطأ بمعامل عشرة محتمل — لا تعطِ قبل إعادة التحقق." />
                  : r.ecart > 10 ? <T fr="écart > 10 % avec la prescription: revoir l'unité, la concentration ou la règle de calcul." ar="فرق > ١٠٪ مع الوصفة: راجع الوحدة أو التركيز أو قاعدة الحساب." />
                    : <T fr="conforme à la prescription." ar="موافق للوصفة." />}
              </li>
            )}
            {r.petitPoids && <li><T fr="Poids < 10 kg: double contrôle obligatoire, diluer et utiliser une seringue adaptée." ar="الوزن < ١٠ كغ: تحقق مزدوج إلزامي، خفّف واستخدم محقنة مناسبة." /></li>}
            {r.soloConcentr && <li><T fr="Volume injecté > 20 mL: vérifier la vitesse (IV lent / perfusion) et la dilution." ar="الحجم المحقون > ٢٠ مل: تحقق من السرعة (وريدي بطيء/تسريب) والتخفيف." /></li>}
            <li className="opacity-70"><T fr="Toujours vérifier l'unité du produit (mg vs µg) et l'équivalence des présentations." ar="تحقق دائماً من وحدة المنتج (مغ مقابل مكغ) وتكافؤ العبوات." /></li>
          </ul>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Entrez le poids et la dose/kg pour vérifier." ar="أدخل الوزن والجرعة/كغ للتحقق." />
        </p>
      )}

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-base font-black"><T fr="Check-list avant le geste" ar="قائمة قبل الإجراء" /></p>
          <Badge tone={allDone ? "standard" : "neutral"}>{done.size}/{CHECKS.length}</Badge>
        </div>
        <ul className="flex flex-col gap-2">
          {CHECKS.map((c) => {
            const on = done.has(c.id);
            return (
              <li key={c.id}>
                <button onClick={() => toggle(c.id)} aria-pressed={on}
                  className={`card flex w-full items-start gap-3 rounded-2xl border p-3 text-start ${on ? "border-transparent bg-surface2" : "border-line bg-surface"}`}>
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
                    style={on ? { background: "var(--accent)", color: "#fff" } : { border: "2px solid var(--line)" }}>{on ? "✓" : ""}</span>
                  <span className="text-sm font-black">{lang === "ar" ? c.ar : c.fr}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {allDone && (
          <p className="rounded-xl p-3 text-sm font-black" style={{ background: "var(--sev-standard-bg, #e8f2fd)", color: "var(--accent)" }}>
            <T fr="Les 6 points sont confirmés: administrer en traçant heure, dose et opérateur." ar="البنود الستة مؤكدة: أعطِ مع توثيق الوقت والجرعة والمنفّذ." />
          </p>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/doses-ped" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Doses pédiatriques" ar="الجرعات الطفلية" /></Link>
        <Link href="/calculateurs/debit-perfusion" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Débit / perfusion" ar="سرعة التسريب" /></Link>
        <Link href="/calculateurs/insuline" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Insuline" ar="الأنسولين" /></Link>
      </div>
    </div>
  );
}

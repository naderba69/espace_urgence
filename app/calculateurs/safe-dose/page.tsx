"use client";
// v12.1-C — محرّك الجرعة الآمنة : مكتبة أدوية عالية الخطورة + سقوف الجرعة واليوم.
import { useMemo, useState } from "react";
import Link from "next/link";
import NumStepper from "@/components/ui/NumStepper";
import { useApp, usePrefillPatient } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { clampDose } from "@/lib/calc";
import { Syringe } from "lucide-react";

type Drug = {
  id: string; fr: string; ar: string; perKg: number; maxDose: number;
  perKgDay?: number; maxDay: number; conc: number; freq: 1 | 2 | 3 | 4; noteFr: string; noteAr: string;
};

const DRUGS: Drug[] = [
  { id: "para", fr: "Paracétamol IV", ar: "باراسيتامول وريدي", perKg: 15, maxDose: 1000, perKgDay: 60, maxDay: 4000, conc: 10, freq: 4,
    noteFr: "Surveiller la dose totale toutes sources confondues (per os + IV).", noteAr: "راقب المجموع الكلي من كل المصادر (فموي + وريدي)." },
  { id: "vanc", fr: "Vancomycine", ar: "فانكومايسين", perKg: 15, maxDose: 2000, maxDay: 2000, conc: 5, freq: 1,
    noteFr: "Perfusion ≥ 60 min ; dosage résiduel avant adaptation.", noteAr: "تسريب ≥ ٦٠ د؛ معايرة المستوى قبل التعديل." },
  { id: "genta", fr: "Gentamicine", ar: "جنتاميسين", perKg: 5, maxDose: 400, maxDay: 400, conc: 10, freq: 1,
    noteFr: "Dose unique/jour ; espacer si insuffisance rénale (voir bridge rénal).", noteAr: "جرعة وحيدة يومياً؛ باعد إن كان قصور كلوي." },
  { id: "amik", fr: "Amikacine", ar: "أميكاسين", perKg: 15, maxDose: 1500, maxDay: 1500, conc: 50, freq: 1,
    noteFr: "Dosage des pics/creux obligatoire ; ototoxicité et néphrotoxicité.", noteAr: "معايرة القمم والقيعان إلزامية؛ سمية سمعية وكلوية." },
  { id: "amio", fr: "Amiodarone", ar: "أميودارون", perKg: 5, maxDose: 300, maxDay: 1200, conc: 50, freq: 2,
    noteFr: "En perfusion glucosée ; hypotension si injection rapide.", noteAr: "تسريب بغلوكوز؛ هبوط ضغط إن كان الحقن سريعاً." },
  { id: "keta", fr: "Kétamine (antalgie)", ar: "كيتامين (تسكين)", perKg: 0.5, maxDose: 50, maxDay: 200, conc: 50, freq: 2,
    noteFr: "Titrer ; surveiller la sécrétion et la conscience.", noteAr: "عاير؛ راقب الإفرازات والوعي." },
  { id: "mida", fr: "Midazolam", ar: "ميدازولام", perKg: 0.1, maxDose: 5, maxDay: 20, conc: 5, freq: 2,
    noteFr: "Dépression respiratoire — matériel de ventilation à portée.", noteAr: "تثبيط تنفسي — جهّز أدوات التهوية." },
  { id: "morph", fr: "Morphine titrée", ar: "مورفين معاير", perKg: 0.1, maxDose: 10, maxDay: 40, conc: 10, freq: 3,
    noteFr: "Réévaluer la douleur (EVA) et la fréquence respiratoire.", noteAr: "أعد تقييم الألم ومعدل التنفس." },
  { id: "mgso4", fr: "Sulfate de magnésium", ar: "كبريتات المغنيزيوم", perKg: 40, maxDose: 2000, maxDay: 4000, conc: 100, freq: 2,
    noteFr: "Surveiller les réflexes et la fréquence respiratoire (toxicité).", noteAr: "راقب المنعكسات ومعدل التنفس (السمية)." },
  { id: "ceftri", fr: "Ceftriaxone", ar: "سيفترياكسون", perKg: 50, maxDose: 2000, maxDay: 4000, conc: 50, freq: 2,
    noteFr: "Pas d'ajustement rénal ; jamais en même temps que le calcium IV.", noteAr: "لا تعديل كلوي؛ لا تُعطَ مع الكالسيوم الوريدي." },
  { id: "enox", fr: "Énoxaparine (curatif)", ar: "إينوكسابارين (علاجي)", perKg: 1, maxDose: 100, maxDay: 200, conc: 100, freq: 2,
    noteFr: "Réduire si insuffisance rénale (voir bridge rénal).", noteAr: "خفّض عند القصور الكلوي (انظر الجسر الكلوي)." },
  { id: "insul", fr: "Insuline rapide (correction)", ar: "أنسولين سريع (تصحيح)", perKg: 0.1, maxDose: 10, maxDay: 60, conc: 100, freq: 4,
    noteFr: "Unités internationales : ne pas confondre avec mL.", noteAr: "وحدات دولية: لا تخلطها بالملّيلتر." },
];

export default function SafeDosePage() {
  useRegisterRecent("calculateur:safe-dose");
  const { lang } = useApp();
  const [drugId, setDrugId] = useState("para");
  const [w, setW] = useState("");
  usePrefillPatient((p) => {
    if (!w && p.w) setW(p.w);
  });
  const [presc, setPresc] = useState("");
  const [perDay, setPerDay] = useState("");

  const d = DRUGS.find((x) => x.id === drugId) ?? DRUGS[0];
  const W = parseFloat(w), P = parseFloat(presc), N = parseFloat(perDay);

  const r = useMemo(() => {
    if (!Number.isFinite(W) || W <= 0) return null;
    const raw = d.perKg * W;
    const dose = clampDose(d.perKg, W, d.maxDose);
    const capped = raw > d.maxDose + 0.001;
    const maxDay = d.perKgDay ? Math.min(d.perKgDay * W, d.maxDay) : d.maxDay;
    const times = Number.isFinite(N) && N > 0 ? N : d.freq;
    const dayTotal = dose * times;
    const dayOver = dayTotal > maxDay + 0.001;
    const vol = dose / d.conc;
    const ecart = Number.isFinite(P) && P > 0 ? Math.abs((P - dose) / dose) * 100 : null;
    const dixFois = ecart !== null && ecart > 100;
    const sev = dixFois || dayOver ? 3 : capped || (ecart !== null && ecart > 10) ? 2 : 1;
    return { dose, capped, maxDay, times, dayTotal, dayOver, vol, ecart, dixFois, sev, raw };
  }, [W, d, N, P]);

  const rd = (n: number) => (n >= 100 ? Math.round(n) : Math.round(n * 100) / 100);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Syringe className="h-6 w-6" />}
        title={lang === "ar" ? "محرّك الجرعة الآمنة" : "Moteur de dose sûre"}
        sub={lang === "ar" ? "مكتبة أدوية عالية الخطورة: سقف الجرعة، سقف اليوم، وحجم السحب." : "Bibliothèque à haut risque : plafond par dose, plafond journalier, volume à prélever."}
      />

      <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
        <span className="text-xs font-black opacity-70"><T fr="Médicament" ar="الدواء" /></span>
        <select value={drugId} onChange={(e) => setDrugId(e.target.value)}
          className="w-full bg-transparent text-lg font-black outline-none">
          {DRUGS.map((x) => <option key={x.id} value={x.id} className="bg-surface text-base">{lang === "ar" ? x.ar : x.fr}</option>)}
        </select>
      </label>

      <section className="grid grid-cols-3 gap-2">
        <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
          <span className="text-xs font-black opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></span>
          <NumStepper value={ w } onValue={ setW } className="w-full bg-transparent text-lg font-black tabular-nums outline-none" label="w" />
        </label>
        <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
          <span className="text-xs font-black opacity-70"><T fr="Prescrit (mg)" ar="الموصوف (مغ)" /></span>
          <NumStepper value={ presc } onValue={ setPresc } className="w-full bg-transparent text-lg font-black tabular-nums outline-none" label="presc" />
        </label>
        <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
          <span className="text-xs font-black opacity-70"><T fr="Prises / jour" ar="جرعات/يوم" /></span>
          <NumStepper value={ perDay } onValue={ setPerDay } placeholder={String(d.freq)} className="w-full bg-transparent text-lg font-black tabular-nums outline-none" label="perDay" />
        </label>
      </section>

      {r ? (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.sev === 3 ? "sev-critical" : r.sev === 2 ? "sev-urgent" : "sev-standard"}`}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-lg font-black tabular-nums" dir="ltr">
              {rd(r.dose)} mg <span className="text-sm opacity-70">= {rd(r.vol)} mL</span>
            </p>
            <Badge tone={r.sev === 3 ? "critical" : r.sev === 2 ? "urgent" : "standard"}>
              {r.sev === 3 ? <T fr="STOP" ar="توقّف" /> : r.sev === 2 ? <T fr="Vérifier" ar="تحقق" /> : <T fr="Cohérent" ar="متوافق" />}
            </Badge>
          </div>
          <ul className="flex flex-col gap-1 text-sm font-bold">
            <li className="opacity-80">
              <span dir="ltr" className="font-black">{d.perKg} mg/kg</span> × <span dir="ltr">{W} kg</span> = <span dir="ltr">{rd(r.raw)} mg</span>
              {r.capped && <span style={{ color: "var(--sev-urgent)" }}> → {lang === "ar" ? `مقيّد بسقف ${d.maxDose} مغ` : `plafonné à ${d.maxDose} mg`}</span>}
            </li>
            <li>
              <T fr="Total journalier:" ar="المجموع اليومي:" /> <span dir="ltr" className="font-black">{rd(r.dayTotal)} mg</span> / <span dir="ltr">{rd(r.maxDay)} mg</span>
              {r.dayOver
                ? <span className="ms-2 font-black" style={{ color: "var(--sev-critical)" }}><T fr="dépassement du plafond 24 h" ar="تجاوز سقف ٢٤ س" /></span>
                : <span className="ms-2 opacity-70"><T fr="dans les limites" ar="داخل الحدود" /></span>}
            </li>
            {r.ecart !== null && (
              <li style={{ color: r.dixFois ? "var(--sev-critical)" : r.ecart > 10 ? "var(--sev-urgent)" : "var(--accent)" }}>
                <span dir="ltr">Δ {Math.round(r.ecart)}%</span> — {r.dixFois
                  ? <T fr="écart > 100 %: suspecter une erreur décimalaire — revérifier avant d'administrer." ar="فرق > ١٠٠٪: اشتبه بخطأ الفاصلة — أعد التحقق قبل الإعطاء." />
                  : r.ecart > 10 ? <T fr="écart avec la prescription: revoir l'unité ou le calcul." ar="فرق مع الوصفة: راجع الوحدة أو الحساب." />
                    : <T fr="conforme à la prescription." ar="موافق للوصفة." />}
              </li>
            )}
            <li className="opacity-70">{lang === "ar" ? d.noteAr : d.noteFr}</li>
            <li className="opacity-70"><T fr="Concentration utilisée pour le volume:" ar="التركيز المستخدم للحجم: " /><span dir="ltr" className="font-black">{d.conc} mg/mL</span></li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/calculateurs/dose-check" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Check-list 6B" ar="قائمة ٦ بنود" /></Link>
            <Link href="/calculateurs/renal-dose" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Bridge rénal" ar="الجسر الكلوي" /></Link>
            <Link href="/calculateurs/dilutions" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Dilution" ar="التخفيف" /></Link>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Entrez le poids pour calculer la dose sûre." ar="أدخل الوزن لحساب الجرعة الآمنة." />
        </p>
      )}
    </div>
  );
}

"use client";
// v12.1-C — المضادات الحيوية : جرعة بالوزن + تكييف حسب التصفية الكلوية.
import { useMemo, useState } from "react";
import Link from "next/link";
import NumStepper from "@/components/ui/NumStepper";
import { useApp, usePrefillPatient } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { ClipboardList } from "lucide-react";

type Ab = {
  id: string; fr: string; ar: string; perKg: number; maxDose: number; unit: "mg" | "UI";
  baseFreq: number; bands: [string, string, string, string]; notesFr: string; notesAr: string;
};

const ABS: Ab[] = [
  { id: "ceftri", fr: "Ceftriaxone", ar: "سيفترياكسون", perKg: 50, maxDose: 2000, unit: "mg", baseFreq: 2,
    bands: ["×2/j", "×2/j", "×2/j", "×2/j"], notesFr: "Pas d'ajustement rénal ; jamais avec le calcium IV.", notesAr: "لا تعديل كلوي؛ لا مع الكالسيوم الوريدي." },
  { id: "cefaz", fr: "Céfazoline", ar: "سيفازولين", perKg: 25, maxDose: 2000, unit: "mg", baseFreq: 3,
    bands: ["×3/j", "×2/j", "×2/j", "×1/j"], notesFr: "Prophylaxie chirurgicale 2 g si poids > 80 kg.", notesAr: "جرعة وقائية جراحية ٢ غ إن تجاوز الوزن ٨٠ كغ." },
  { id: "ceftaz", fr: "Ceftazidime", ar: "سيفتازيديم", perKg: 50, maxDose: 2000, unit: "mg", baseFreq: 3,
    bands: ["×3/j", "×2/j", "×1-2/j", "×1/j"], notesFr: "Couverture Pseudomas ; ajouter amikacine en choc.", notesAr: "تغطية الزائفة؛ أضف أميكاسين في الصدمة." },
  { id: "amox", fr: "Amoxicilline", ar: "أموكسيسيلين", perKg: 25, maxDose: 1000, unit: "mg", baseFreq: 3,
    bands: ["×3/j", "×3/j", "×2/j", "×1/j"], notesFr: "Adapter au poids de l'enfant dans la pneumonie.", notesAr: "كيّف للوزن عند الطفل في ذات الرئة." },
  { id: "vanc", fr: "Vancomycine", ar: "فانكومايسين", perKg: 15, maxDose: 2000, unit: "mg", baseFreq: 2,
    bands: ["/12 h", "/24 h", "charge + dosage", "unique + dosage"], notesFr: "Perfusion ≥ 60 min ; cible résiduelle selon foyer.", notesAr: "تسريب ≥ ٦٠ د؛ الهدف المتبقي حسب البؤرة." },
  { id: "genta", fr: "Gentamicine", ar: "جنتاميسين", perKg: 5, maxDose: 400, unit: "mg", baseFreq: 1,
    bands: ["/24 h", "/36 h", "/48 h", "unique"], notesFr: "Dose unique/jour ; néphrotoxicité à surveiller.", notesAr: "جرعة وحيدة يومياً؛ راقب السمية الكلوية." },
  { id: "amik", fr: "Amikacine", ar: "أميكاسين", perKg: 15, maxDose: 1500, unit: "mg", baseFreq: 1,
    bands: ["/24 h", "/36 h", "/48 h", "unique"], notesFr: "Pics et creux obligatoires ; ototoxicité.", notesAr: "قمم وقيعان إلزامية؛ سمية سمعية." },
  { id: "imip", fr: "Imipénème", ar: "إيميبينيم", perKg: 15, maxDose: 1000, unit: "mg", baseFreq: 4,
    bands: ["×4/j", "×3/j", "×2/j", "×2/j"], notesFr: "Éviter en cas d'épilepsie ; penser aux convulsions.", notesAr: "تجنّب في الصرع؛ انتبه للاختلاجات." },
  { id: "cipro", fr: "Ciprofloxacine", ar: "سيبروفلوكساسين", perKg: 0, maxDose: 400, unit: "mg", baseFreq: 2,
    bands: ["×2-3/j", "×2/j", "×1/j", "×1/j"], notesFr: "Dose fixe IV 400 mg ; tendinopathie et QT.", notesAr: "جرعة ثابتة ٤٠٠ مغ؛ أوتار وQT." },
  { id: "metro", fr: "Métronidazole", ar: "ميترونيدازول", perKg: 0, maxDose: 500, unit: "mg", baseFreq: 3,
    bands: ["×3/j", "×3/j", "×3/j", "×3/j"], notesFr: "Pas d'ajustement ; effet antabuse avec l'alcool.", notesAr: "لا تعديل؛ تفاعل نفور مع الكحول." },
  { id: "doxy", fr: "Doxycycline", ar: "دوكسيسيكلين", perKg: 2, maxDose: 200, unit: "mg", baseFreq: 1,
    bands: ["/24 h", "/24 h", "/24 h", "/24 h"], notesFr: "Traitement clé des piqûres de tique et de la leptospirose.", notesAr: "علاج أساسي لقرصة القراد واللبتوسبيرا." },
  { id: "tmpsmx", fr: "Triméthoprime-sulfaméthoxazole", ar: "تريميتوبريم-سلفاميثوكسازول", perKg: 15, maxDose: 1920, unit: "mg", baseFreq: 2,
    bands: ["×2/j", "×2/j", "50 % puis dosage", "50 % + dosage"], notesFr: "Attention hyperkaliémie et allergie aux sulfamides.", notesAr: "انتبه لفرط البوتاسيوم وحساسية السلفا." },
  { id: "colis", fr: "Colistine", ar: "كوليستين", perKg: 0, maxDose: 3000000, unit: "UI", baseFreq: 3,
    bands: ["charge puis ×3/j", "×2-3/j", "×2/j", "×1/j"], notesFr: "Charge initiale indispensable ; néphrotoxicité dose-dépendante.", notesAr: "جرعة تحميل ضرورية؛ سمية كلوية جرعة-تابعة." },
];

export default function AntibiotiquesPage() {
  useRegisterRecent("calculateur:antibiotiques");
  const { lang } = useApp();
  const [sel, setSel] = useState("ceftri");
  const [w, setW] = useState("");
  const [age, setAge] = useState("");
  const [scr, setScr] = useState("");
  const [sexe, setSexe] = useState<"m" | "f">("m");
  usePrefillPatient((p) => {
    if (!w && p.w) setW(p.w);
    if (!age && p.age) setAge(p.age);
    if (!scr && p.scr) setScr(p.scr);
    if (p.sexe === "f") setSexe("f");
  });

  const ab = ABS.find((a) => a.id === sel) ?? ABS[0];
  const W = parseFloat(w), A = parseFloat(age), S = parseFloat(scr);

  const r = useMemo(() => {
    const hasW = Number.isFinite(W) && W > 0;
    const raw = hasW ? ab.perKg * W : null;
    const dose = raw !== null ? Math.min(raw, ab.maxDose) : ab.perKg === 0 ? ab.maxDose : null;
    const capped = raw !== null && raw > ab.maxDose + 0.001;
    let band: number | null = null;
    if (Number.isFinite(A) && Number.isFinite(W) && Number.isFinite(S) && S > 0) {
      const crcl = ((140 - A) * W * (sexe === "f" ? 0.85 : 1)) / (72 * (S / 88.4));
      band = crcl >= 60 ? 0 : crcl >= 30 ? 1 : crcl >= 15 ? 2 : 3;
    }
    const freq = band === null ? ab.bands[0] : ab.bands[band];
    const severe = band === 3 && (ab.id === "genta" || ab.id === "amik" || ab.id === "colis");
    return { dose, capped, band, freq, severe, hasW };
  }, [W, A, S, sexe, ab]);

  const rd = (n: number) => n >= 1000 ? Math.round(n) : Math.round(n * 100) / 100;
  const BAND_LBL = [
    { fr: "≥ 60 mL/min", ar: "≥ ٦٠" }, { fr: "30-59", ar: "٣٠-٥٩" }, { fr: "15-29", ar: "١٥-٢٩" }, { fr: "< 15", ar: "< ١٥" },
  ];

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<ClipboardList className="h-6 w-6" />}
        title={lang === "ar" ? "المضادات الحيوية: الجرعة والكلى" : "Antibiotiques : dose et rein"}
        sub={lang === "ar" ? "الوزن ← الجرعة، والتصفية الكلوية ← التواتر." : "Poids → dose, clairance → fréquence."}
      />

      <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
        <span className="text-xs font-black opacity-70"><T fr="Antibiotique" ar="المضاد الحيوي" /></span>
        <select value={sel} onChange={(e) => setSel(e.target.value)} className="w-full bg-transparent text-base font-black outline-none">
          {ABS.map((a) => <option key={a.id} value={a.id} className="bg-surface">{lang === "ar" ? a.ar : a.fr}</option>)}
        </select>
      </label>

      <section className="grid grid-cols-3 gap-2">
        <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3"><span className="text-xs font-black opacity-70"><T fr="Poids (kg)" ar="الوزن" /></span>
          <NumStepper value={ w } onValue={ setW } className="w-full bg-transparent text-lg font-black tabular-nums outline-none" label="w" /></label>
        <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3"><span className="text-xs font-black opacity-70"><T fr="Âge" ar="العمر" /></span>
          <NumStepper value={ age } onValue={ setAge } className="w-full bg-transparent text-lg font-black tabular-nums outline-none" label="age" /></label>
        <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3"><span className="text-xs font-black opacity-70"><T fr="Créat. µmol/L" ar="كرياتينين" /></span>
          <NumStepper value={ scr } onValue={ setScr } className="w-full bg-transparent text-lg font-black tabular-nums outline-none" label="scr" /></label>
      </section>

      <div className="flex gap-2">
        <button onClick={() => setSexe("m")} aria-pressed={sexe === "m"}
          className={`touch flex-1 rounded-xl border p-3 text-sm font-black ${sexe === "m" ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
          style={sexe === "m" ? { background: "var(--accent)" } : undefined}><T fr="Homme" ar="رجل" /></button>
        <button onClick={() => setSexe("f")} aria-pressed={sexe === "f"}
          className={`touch flex-1 rounded-xl border p-3 text-sm font-black ${sexe === "f" ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
          style={sexe === "f" ? { background: "var(--accent)" } : undefined}><T fr="Femme" ar="امرأة" /></button>
      </div>

      {(r.hasW || r.band !== null) ? (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.severe ? "sev-critical" : r.band !== null && r.band >= 2 ? "sev-urgent" : "sev-standard"}`}>
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-lg font-black tabular-nums" dir="ltr">
              {r.dose !== null ? `${rd(r.dose)} ${ab.unit}` : "—"} <span className="text-sm opacity-70">· {r.freq}</span>
            </p>
            <Badge tone={r.band === 3 ? "critical" : r.band === 2 ? "urgent" : "standard"}>
              {r.band === null ? <T fr="Rénal non calculé" ar="الكلى غير محسوبة" /> : (lang === "ar" ? BAND_LBL[r.band].ar : BAND_LBL[r.band].fr)}
            </Badge>
          </div>
          <ul className="flex flex-col gap-1 text-sm font-bold">
            <li className="opacity-80">
              <span dir="ltr">{ab.perKg > 0 ? `${ab.perKg} mg/kg` : "dose fixe"}</span>
              {r.capped && <span style={{ color: "var(--sev-urgent)" }}> → {lang === "ar" ? `مقيّد بـ ${ab.maxDose} ${ab.unit}` : `plafonné à ${ab.maxDose} ${ab.unit}`}</span>}
            </li>
            <li>{lang === "ar" ? ab.notesAr : ab.notesFr}</li>
            {r.severe && <li className="font-black" style={{ color: "var(--sev-critical)" }}><T fr="Clairance < 15: dose unique et dosage strict, avis infectiologue." ar="تصفية < ١٥: جرعة وحيدة ومعايرة صارمة، استشارة أخصائي." /></li>}
            <li className="opacity-70"><T fr="Toujours vérifier l'antibiogramme local, l'allergie et la durée de traitement." ar="تحقق دائماً من الحساسية المحلية والحساسية الدوائية ومدة العلاج." /></li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/calculateurs/renal-dose" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Bridge rénal complet" ar="الجسر الكلوي الكامل" /></Link>
            <Link href="/calculateurs/sepsis-commandement" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Bundle heure-1" ar="حزمة الساعة ١" /></Link>
            <Link href="/calculateurs/safe-dose" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Moteur de dose sûre" ar="محرّك الجرعة الآمنة" /></Link>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Entrez le poids (et la créatinine pour la fréquence)." ar="أدخل الوزن (والكرياتينين للتواتر)." />
        </p>
      )}
    </div>
  );
}

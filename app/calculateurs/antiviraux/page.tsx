"use client";
// v12.3-A — Antiviraux : aciclovir selon poids + clairance, influenza, ajustements rénaux.
import { useMemo, useState } from "react";
import Link from "next/link";
import NumStepper from "@/components/ui/NumStepper";
import { useApp, usePrefillPatient } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Activity } from "lucide-react";

type Av = { id: string; fr: string; ar: string; perKg: number; fixed: number | null; unit: string;
  bands: [string, string, string, string]; notesFr: string; notesAr: string };

const AVS: Av[] = [
  { id: "acve", fr: "Aciclovir (encéphalite/méningite HSV)", ar: "أسيكلوفير (التهاب الدماغ HSV)", perKg: 10, fixed: null, unit: "mg",
    bands: ["×3/j (14-21 j)", "×3/j", "q12h", "q24h"], notesFr: "Urgence : commencer SANS attendre l'IRM/PCR.", notesAr: "استعجال: ابدأ دون انتظار التصوير/الـPCR." },
  { id: "acvz", fr: "Aciclovir (zona/VZV immunodéprimé)", ar: "أسيكلوفير (حماق/نطاقي)", perKg: 10, fixed: null, unit: "mg",
    bands: ["×3/j (7 j)", "×3/j", "q12h", "q24h"], notesFr: "Zona ophtalmique = avis ophtalmo immédiat.", notesAr: "النطاقي العيني = استشارة عين فورية." },
  { id: "vala", fr: "Valaciclovir (zona immunocompétent)", ar: "فالاسيكلوفير (نطاقي)", perKg: 0, fixed: 1000, unit: "mg",
    bands: ["×3/j (7 j)", "×3/j", "×2/j", "×1/j"], notesFr: "Urgent < 72 h de l'éruption.", notesAr: "مستعجل < ٧٢ س من الطفح." },
  { id: "osel", fr: "Oseltamivir (influenza)", ar: "أوسيلتاميفير (الإنفلونزا)", perKg: 0, fixed: 75, unit: "mg",
    bands: ["×2/j (5 j)", "×2/j", "×1/j", "à éviter"], notesFr: "< 48 h des signes ; 150 mg ×2/j si grave, grossesse ou immunodépression.", notesAr: "< ٤٨ س من الأعراض؛ ١٥٠ مغ ×٢ إذا شديد أو حمل أو نقص مناعة." },
  { id: "ganc", fr: "Ganciclovir (CMV)", ar: "غانسيكلوفير (CMV)", perKg: 5, fixed: null, unit: "mg",
    bands: ["×2/j (induction)", "×2/j", "q24h", "q48h"], notesFr: "Neutropénie fréquente : NFS ×2/semaine.", notesAr: "قلة العدلات شائعة: تعداد مرتين أسبوعياً." },
];

export default function AntivirauxPage() {
  useRegisterRecent("calculateur:antiviraux");
  const { lang } = useApp();
  const [sel, setSel] = useState("acve");
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

  const av = AVS.find((a) => a.id === sel) ?? AVS[0];
  const W = parseFloat(w), A = parseFloat(age), S = parseFloat(scr);

  const r = useMemo(() => {
    const dose = av.perKg > 0 ? (Number.isFinite(W) && W > 0 ? av.perKg * W : null) : av.fixed;
    let band: number | null = null;
    if (Number.isFinite(A) && Number.isFinite(W) && Number.isFinite(S) && S > 0) {
      const crcl = ((140 - A) * W * (sexe === "f" ? 0.85 : 1)) / (72 * (S / 88.4));
      band = crcl >= 60 ? 0 : crcl >= 30 ? 1 : crcl >= 15 ? 2 : 3;
    }
    const freq = band === null ? av.bands[0] : av.bands[band];
    return { dose, band, freq, hasW: Number.isFinite(W) && W > 0 };
  }, [W, A, S, sexe, av]);

  const rd = (n: number) => n >= 100 ? Math.round(n) : Math.round(n * 10) / 10;
  const BAND_LBL = [
    { fr: "≥ 60 mL/min", ar: "≥ ٦٠" }, { fr: "30-59", ar: "٣٠-٥٩" }, { fr: "15-29", ar: "١٥-٢٩" }, { fr: "< 15", ar: "< ١٥" },
  ];

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Activity className="h-6 w-6" />}
        title={lang === "ar" ? "مضادات الفيروسات" : "Antiviraux"}
        sub={lang === "ar" ? "الجرعة بالوزن والفاصل حسب التصفية — الأسيكلوفير في التهاب الدماغ استعجال." : "Dose au poids, intervalle selon la clairance — aciclovir encéphalite sans délai."}
      />

      <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
        <span className="text-xs font-black opacity-70"><T fr="Antiviral" ar="المضاد الفيروسي" /></span>
        <select value={sel} onChange={(e) => setSel(e.target.value)} className="w-full bg-transparent text-base font-black outline-none">
          {AVS.map((a) => <option key={a.id} value={a.id} className="bg-surface">{lang === "ar" ? a.ar : a.fr}</option>)}
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
        <button onClick={() => setSexe("m")} aria-pressed={sexe === "m"} className={`touch flex-1 rounded-xl border p-3 text-sm font-black ${sexe === "m" ? "border-transparent text-white" : "border-line hover:bg-surface2"}`} style={sexe === "m" ? { background: "var(--accent)" } : undefined}><T fr="Homme" ar="رجل" /></button>
        <button onClick={() => setSexe("f")} aria-pressed={sexe === "f"} className={`touch flex-1 rounded-xl border p-3 text-sm font-black ${sexe === "f" ? "border-transparent text-white" : "border-line hover:bg-surface2"}`} style={sexe === "f" ? { background: "var(--accent)" } : undefined}><T fr="Femme" ar="امرأة" /></button>
      </div>

      {(r.hasW || av.perKg === 0) ? (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.band === 3 ? "sev-critical" : r.band === 2 ? "sev-urgent" : "sev-standard"}`}>
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-lg font-black tabular-nums" dir="ltr">
              {r.dose !== null ? `${rd(r.dose)} ${av.unit}` : "—"} <span className="text-sm opacity-70">· {r.freq}</span>
            </p>
            <Badge tone={r.band === 3 ? "critical" : r.band === 2 ? "urgent" : "standard"}>
              {r.band === null ? <T fr="Rénal non calculé" ar="الكلى غير محسوبة" /> : (lang === "ar" ? BAND_LBL[r.band].ar : BAND_LBL[r.band].fr)}
            </Badge>
          </div>
          <ul className="flex flex-col gap-1 text-sm font-bold">
            <li className="opacity-85">{lang === "ar" ? av.notesAr : av.notesFr}</li>
            {av.id === "osel" && <li className="opacity-70" dir="ltr" style={{ textAlign: "start" }}>Enfant : 3 mg/kg/dose ×2/j (&gt; 40 kg : dose adulte)</li>}
            <li className="opacity-70"><T fr="Vérifier les interactions et la fonction rénale pendant tout le traitement." ar="تحقق من التفاعلات ووظيفة الكلى طوال العلاج." /></li>
          </ul>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Entrez le poids (et la créatinine pour le rénal)." ar="أدخل الوزن (والكرياتينين للكلى)." />
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/antibiotiques" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Antibiotiques" ar="المضادات الحيوية" /></Link>
        <Link href="/calculateurs/renal-dose" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Bridge rénal" ar="الجسر الكلوي" /></Link>
        <Link href="/calculateurs/coma" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Approche coma (méningite)" ar="الغيبوبة (السحائي)" /></Link>
      </div>
    </div>
  );
}

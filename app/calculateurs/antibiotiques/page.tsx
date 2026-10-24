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
  id: string; fr: string; ar: string; perKg: number; maxDose?: number; rangePerKg?: [number, number]; unit: "mg" | "UI";
  baseFreq: number; bands: [string, string, string, string]; bandsAr?: [string, string, string, string]; notesFr: string; notesAr: string;
  renalThresholds?: [number, number, number]; renalBandLabels?: [{ fr: string; ar: string }, { fr: string; ar: string }, { fr: string; ar: string }, { fr: string; ar: string }];
  adultOnly?: boolean; normalRenalOnly?: boolean; renalCriticalNoteFr?: string; renalCriticalNoteAr?: string;
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
  { id: "amik", fr: "Amikacine (adulte — CA-SFM 2025)", ar: "أميكاسين (بالغ — CA-SFM 2025)", perKg: 25, rangePerKg: [25, 30], unit: "mg", baseFreq: 1,
    bands: ["/24 h", "/36 h", "/48 h", "résiduel requis ; pas d'intervalle automatique"],
    bandsAr: ["كل 24 ساعة", "كل 36 ساعة", "كل 48 ساعة", "يلزم قياس المتبقي؛ لا فاصل آلي"],
    renalThresholds: [60, 40, 20], adultOnly: true, normalRenalOnly: true,
    renalBandLabels: [
      { fr: "≥ 60 mL/min", ar: "≥ 60 مل/د" }, { fr: "40–59 mL/min", ar: "40–59 مل/د" },
      { fr: "20–39 mL/min", ar: "20–39 مل/د" }, { fr: "< 20 mL/min", ar: "< 20 مل/د" },
    ],
    renalCriticalNoteFr: "ClCr <20 mL/min : pas de réinjection ni d'intervalle automatiques ; dosage résiduel et avis spécialisé indispensables.",
    renalCriticalNoteAr: "ClCr أقل من 20 مل/د: لا تكرار ولا فاصل زمني آلي؛ يلزم قياس المستوى المتبقي واستشارة اختصاصية.",
    notesFr: "25–30 mg/kg/j en dose unique journalière dans le cadre CA-SFM/SPILF/SFPT 2025 : adulte non obèse, sans insuffisance rénale ni hépatique. Repère de réinjection distinct (RCP Viatris/Hartford) : ClCr ≥60 → 24 h ; 40–59 → 36 h ; 20–39 → 48 h ; <20 → dosage résiduel impératif, sans intervalle automatique. Le seuil ClCr ≥60 est un verrou prudent de cette interface pour approcher la fonction rénale normale ; ce n'est pas un seuil explicitement indiqué par CA-SFM. En obésité, suivre le poids corrigé du RCP du produit ; cette interface n'effectue pas ce calcul. Ne pas appliquer chez l'enfant.",
    notesAr: "25–30 ملغ/كغ/يوم بجرعة يومية واحدة ضمن نظام CA-SFM/SPILF/SFPT 2025: للبالغ غير البدين دون قصور كلوي أو كبدي. مرجع تكرار الجرعة منفصل (RCP Viatris/Hartford): ‏ClCr ≥60 كل 24 س؛ 40–59 كل 36 س؛ 20–39 كل 48 س؛ أقل من 20 يلزم قياس المستوى المتبقي دون فاصل آلي. عتبة ClCr ≥60 قيد احترازي في هذه الواجهة لتقريب الوظيفة الكلوية الطبيعية، وليست حداً منصوصاً عليه صراحة في CA-SFM. في البدانة اتبع الوزن المصحح في نشرة المنتج؛ هذه الواجهة لا تحسبه. لا يُطبق على الأطفال." },
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
  const [nonObeseConfirmed, setNonObeseConfirmed] = useState(false);
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
    const ageEntered = Number.isFinite(A) && A > 0;
    const adult = ageEntered && A >= 18;
    const pediatric = ageEntered && A < 18;
    const amikContextUnconfirmed = ab.id === "amik" && !nonObeseConfirmed;
    let band: number | null = null;
    // Cockcroft–Gault is used here only as an adult ClCr estimate; it is not the DFG table below.
    if (adult && hasW && Number.isFinite(S) && S > 0 && !amikContextUnconfirmed) {
      const crcl = ((140 - A) * W * (sexe === "f" ? 0.85 : 1)) / (72 * (S / 88.4));
      if (Number.isFinite(crcl) && crcl >= 0) {
        const [first, second, third] = ab.renalThresholds ?? [60, 30, 15];
        band = crcl >= first ? 0 : crcl >= second ? 1 : crcl >= third ? 2 : 3;
      }
    }

    const ageDoseAllowed = !ab.adultOnly || adult;
    const renalDoseAllowed = !ab.normalRenalOnly || (band === 0 && !amikContextUnconfirmed);
    const dosePopulationAllowed = ageDoseAllowed && renalDoseAllowed;
    const perKgMin = ab.rangePerKg?.[0] ?? ab.perKg;
    const perKgMax = ab.rangePerKg?.[1] ?? ab.perKg;
    let rawDoseMin: number | null = null;
    let rawDoseMax: number | null = null;
    if (dosePopulationAllowed && hasW && ab.perKg > 0) {
      rawDoseMin = perKgMin * W;
      rawDoseMax = perKgMax * W;
    } else if (dosePopulationAllowed && ab.perKg === 0 && ab.maxDose !== undefined) {
      rawDoseMin = ab.maxDose;
      rawDoseMax = ab.maxDose;
    }
    const doseMin = rawDoseMin === null ? null : ab.maxDose === undefined ? rawDoseMin : Math.min(rawDoseMin, ab.maxDose);
    const doseMax = rawDoseMax === null ? null : ab.maxDose === undefined ? rawDoseMax : Math.min(rawDoseMax, ab.maxDose);
    const capped = rawDoseMin !== null && rawDoseMax !== null && doseMin !== null && doseMax !== null
      && (rawDoseMin > doseMin + 0.001 || rawDoseMax > doseMax + 0.001);
    const freqFr = amikContextUnconfirmed ? "Confirmer le contexte adulte/non obèse avant calcul"
      : band !== null ? ab.bands[band]
        : pediatric ? "ClCr Cockcroft–Gault adulte non applicable"
          : ab.adultOnly && !adult ? "Saisir l'âge adulte (≥18 ans)"
            : "ClCr non calculée — intervalle à confirmer";
    const freqAr = amikContextUnconfirmed ? "أكّد سياق البالغ غير البدين قبل الحساب"
      : band !== null ? ab.bandsAr?.[band] ?? freqFr
        : pediatric ? "تقدير Cockcroft–Gault غير صالح للأطفال"
          : ab.adultOnly && !adult ? "أدخل عمراً بالغاً (18 سنة فأكثر)"
            : "لم تُحسب ClCr — تحقّق من الفاصل";
    const severe = band === 3 && (ab.id === "genta" || ab.id === "amik" || ab.id === "colis");
    const doseUnavailableFr = amikContextUnconfirmed
      ? "Calcul suspendu : confirmer que le patient adulte est non obèse et sans atteinte hépatique, dans le champ du tableau CA-SFM. En cas d'obésité, suivre le RCP du produit ; aucun poids corrigé n'est calculé ici."
      : !ageDoseAllowed
        ? pediatric ? "Cette plage est réservée à l'adulte ; utiliser le protocole pédiatrique du produit."
          : "Saisir l'âge et confirmer que le schéma adulte s'applique."
        : !renalDoseAllowed ? band === null
          ? "Dose non calculée : renseigner la créatinine pour vérifier le critère rénal prudent de cette interface."
          : "ClCr <60 mL/min : cette plage CA-SFM pour fonction rénale normale n'est pas calculée ; suivre le RCP du produit et le TDM."
          : "";
    const doseUnavailableAr = amikContextUnconfirmed
      ? "أُوقف الحساب: أكّد أن المريض بالغ غير بدين ولا يعاني قصوراً كبدياً، ضمن نطاق جدول CA-SFM. عند البدانة اتبع نشرة المنتج؛ لا يُحسب الوزن المصحح هنا."
      : !ageDoseAllowed
        ? pediatric ? "هذا المجال للبالغين فقط؛ استخدم بروتوكول الأطفال الخاص بالمستحضر."
          : "أدخل العمر وتأكد من انطباق نظام البالغين."
        : !renalDoseAllowed ? band === null
          ? "لم تُحسب الجرعة: أدخل الكرياتينين للتحقق من المعيار الكلوي الاحترازي لهذه الواجهة."
          : "ClCr أقل من 60 مل/د: لا تُحسب جرعة CA-SFM هذه المخصصة للوظيفة الكلوية الطبيعية؛ اتبع نشرة المنتج وقياس مستويات الدواء."
          : "";
    return {
      doseMin, doseMax, capped, band, freqFr, freqAr, severe, hasW, adult, pediatric,
      doseUnavailableFr, doseUnavailableAr,
      severeNoteFr: ab.renalCriticalNoteFr ?? "ClCr très basse : pas de fréquence automatique ; avis spécialisé et adaptation selon le produit/protocole.",
      severeNoteAr: ab.renalCriticalNoteAr ?? "ClCr منخفضة جداً: لا يُستخدم فاصل آلي؛ تلزم استشارة اختصاصية وتعديل حسب المنتج/البروتوكول.",
    };
  }, [W, A, S, sexe, ab, nonObeseConfirmed]);

  const rd = (n: number) => n >= 1000 ? Math.round(n) : Math.round(n * 100) / 100;
  const BAND_LBL = [
    { fr: "≥ 60 mL/min", ar: "≥ ٦٠" }, { fr: "30–59 mL/min", ar: "٣٠–٥٩" }, { fr: "15–29 mL/min", ar: "١٥–٢٩" }, { fr: "< 15 mL/min", ar: "< ١٥" },
  ];

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<ClipboardList className="h-6 w-6" />}
        title={lang === "ar" ? "المضادات الحيوية: الجرعة والكلى" : "Antibiotiques : dose et rein"}
        sub={lang === "ar" ? "الوزن ← الجرعة؛ تقدير Cockcroft–Gault للبالغين ← الفاصل. لا تخلطه بجدول DFG." : "Poids → dose ; Cockcroft–Gault (adulte) → intervalle indicatif, distinct du tableau DFG."}
      />

      <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
        <span className="text-xs font-black opacity-70"><T fr="Antibiotique" ar="المضاد الحيوي" /></span>
        <select value={sel} onChange={(e) => { setSel(e.target.value); setNonObeseConfirmed(false); }} className="w-full bg-transparent text-base font-black outline-none">
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

      {ab.id === "amik" && (
        <label className="flex items-start gap-2 rounded-xl border border-amber-500/50 bg-amber-500/5 p-3 text-sm font-semibold">
          <input type="checkbox" checked={nonObeseConfirmed} onChange={(e) => setNonObeseConfirmed(e.target.checked)} className="mt-0.5" />
          <T fr="Confirmer : adulte non obèse, sans atteinte hépatique (champ du schéma CA-SFM). Sans confirmation, aucun calcul de dose ni de ClCr." ar="أكّد: بالغ غير بدين ولا قصور كبدي (نطاق نظام CA-SFM). دون التأكيد لا تُحسب الجرعة ولا ClCr." />
        </label>
      )}

      {(r.hasW || r.band !== null) ? (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.severe ? "sev-critical" : r.band !== null && r.band >= 2 ? "sev-urgent" : "sev-standard"}`}>
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-lg font-black tabular-nums" dir="ltr">
              {r.doseMin !== null && r.doseMax !== null
                ? `${rd(r.doseMin)}${r.doseMin !== r.doseMax ? `–${rd(r.doseMax)}` : ""} ${ab.unit}`
                : "—"} <span className="text-sm opacity-70">· {lang === "ar" ? r.freqAr : r.freqFr}</span>
            </p>
            <Badge tone={r.band === 3 ? "critical" : r.band === 2 ? "urgent" : "standard"}>
              {r.band === null ? <T fr="Rénal non calculé" ar="الكلى غير محسوبة" /> : (lang === "ar" ? (ab.renalBandLabels?.[r.band] ?? BAND_LBL[r.band]).ar : (ab.renalBandLabels?.[r.band] ?? BAND_LBL[r.band]).fr)}
            </Badge>
          </div>
          <ul className="flex flex-col gap-1 text-sm font-bold">
            <li className="opacity-80">
              <span dir="ltr">{ab.rangePerKg ? `${ab.rangePerKg[0]}–${ab.rangePerKg[1]} mg/kg` : ab.perKg > 0 ? `${ab.perKg} mg/kg` : "dose fixe"}</span>
              {r.capped && ab.maxDose !== undefined && <span style={{ color: "var(--sev-urgent)" }}> → {lang === "ar" ? `مقيّد بـ ${ab.maxDose} ${ab.unit}` : `plafonné à ${ab.maxDose} ${ab.unit}`}</span>}
            </li>
            {r.doseMin === null && r.hasW && (r.doseUnavailableFr || r.doseUnavailableAr) && <li className="font-black" style={{ color: "var(--sev-urgent)" }}>{lang === "ar" ? r.doseUnavailableAr : r.doseUnavailableFr}</li>}
            <li>{lang === "ar" ? ab.notesAr : ab.notesFr}</li>
            {r.severe && <li className="font-black" style={{ color: "var(--sev-critical)" }}>{lang === "ar" ? r.severeNoteAr : r.severeNoteFr}</li>}
            <li className="opacity-70"><T fr="Toujours vérifier l'antibiogramme local, l'allergie et la durée de traitement." ar="تحقق دائماً من الحساسية المحلية والحساسية الدوائية ومدة العلاج." /></li>
            <li className="opacity-70"><T fr="ClCr estimée par Cockcroft–Gault chez l'adulte : distincte du DFG du bridge rénal. Ne pas utiliser ces bandes chez l'enfant ou si la créatininémie est instable." ar="تصفية ClCr مقدّرة بمعادلة Cockcroft–Gault للبالغين، وهي منفصلة عن DFG في الجدول الكلوي. لا تستخدم هذه الفواصل للأطفال أو عند عدم استقرار الكرياتينين." /></li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/calculateurs/renal-dose" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Bridge rénal complet" ar="الجسر الكلوي الكامل" /></Link>
            <Link href="/calculateurs/sepsis-commandement" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Assistant sepsis" ar="مساعد الإنتان" /></Link>
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

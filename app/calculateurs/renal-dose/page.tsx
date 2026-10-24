"use client";
// v12.1-C — جسر الصيدلة للفشل الكلوي : Cockcroft-Gault + جدول تكييف الجرعات.
import { useMemo, useState } from "react";
import Link from "next/link";
import NumStepper from "@/components/ui/NumStepper";
import { useApp, usePrefillPatient } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { ibwKg } from "@/lib/calc";
import { Gauge } from "lucide-react";

type Band = { fr: string; ar: string; range?: { fr: string; ar: string } };
type Row = {
  fr: string;
  ar: string;
  bands: Band[];
  sev: number[];
  /** Seuils RCP propres au médicament, classés du plus élevé au plus bas. */
  thresholds?: number[];
  note?: { fr: string; ar: string };
  source?: { fr: string; ar: string; url: string };
};

const BAND_NAMES = [
  { fr: "≥ 60 mL/min", ar: "≥ ٦٠ مل/د" },
  { fr: "30-59", ar: "٣٠-٥٩" },
  { fr: "15-29", ar: "١٥-٢٩" },
  { fr: "< 15", ar: "< ١٥" },
];

// Antibiotic shortcuts are routed to the complete, PDF-derived source table instead.
const ANTIBIOTIC_SEARCH: Record<string, { query: string; fr: string; ar: string }[]> = {
  Vancomycine: [{ query: "Vancomycine", fr: "Vancomycine", ar: "فانكومايسين" }],
  "Gentamicine / Amikacine": [
    { query: "Gentamicine", fr: "Gentamicine", ar: "جنتاميسين" },
    { query: "Amikacine", fr: "Amikacine", ar: "أميكاسين" },
  ],
  Ceftriaxone: [{ query: "Ceftriaxone", fr: "Ceftriaxone", ar: "سيفترياكسون" }],
  Ciprofloxacine: [{ query: "Ciprofloxacine", fr: "Ciprofloxacine", ar: "سيبروفلوكساسين" }],
  Lévofloxacine: [{ query: "Lévofloxacine", fr: "Lévofloxacine", ar: "ليفوفلوكساسين" }],
  Amoxicilline: [{ query: "Amoxicilline", fr: "Amoxicilline", ar: "أموكسيسيلين" }],
  Imipénème: [{ query: "Imipénème", fr: "Imipénème", ar: "إيميبينيم" }],
  Nitrofurantoïne: [{ query: "Nitrofurantoïne", fr: "Nitrofurantoïne", ar: "نيتروفورانتوين" }],
};

function parseInput(value: string) {
  return Number.parseFloat(String(value).replace(",", "."));
}

const ROWS: Row[] = [
  { fr: "Metformine", ar: "ميتفورمين", sev: [0, 1, 2, 3], bands: [
    { fr: "Dose habituelle, contrôle de la créatinine.", ar: "جرعة معتادة مع مراقبة الكرياتينين." },
    { fr: "Max 1 g/j, réévaluer souvent.", ar: "حد ١ غ/يوم، أعد التقييم كثيراً." },
    { fr: "Max 500 mg/j, ne pas débuter.", ar: "حد ٥٠٠ مغ/يوم، لا تبدأ العلاج." },
    { fr: "Contre-indiquée (acidose lactique).", ar: "ممنوع (حماض لبني)." }] },
  { fr: "Énoxaparine curative", ar: "إينوكسابارين علاجي", sev: [0, 1, 2, 2], bands: [
    { fr: "1 mg/kg ×2/j.", ar: "١ مغ/كغ ×٢/يوم." },
    { fr: "1 mg/kg ×1/j.", ar: "١ مغ/كغ ×١/يوم." },
    { fr: "1 mg/kg ×1/j + anti-Xa si possible.", ar: "١ مغ/كغ ×١/يوم مع قياس مضاد Xa إن أمكن." },
    { fr: "Éviter: préférer l'héparine non fractionnée.", ar: "تجنّب: فضّل الهيبارين غير المجزأ." }] },
  { fr: "Héparine non fractionnée", ar: "هيبارين غير مجزأ", sev: [0, 0, 0, 1], bands: [
    { fr: "Protocole standard.", ar: "بروتوكول معتاد." },
    { fr: "Protocole standard.", ar: "بروتوكول معتاد." },
    { fr: "Surveillance rapprochée de l'aPTT.", ar: "مراقبة لصيقة لـ aPTT." },
    { fr: "Pas d'accumulation; contrôler l'aPTT.", ar: "لا تراكم؛ راقب aPTT." }] },
  { fr: "Vancomycine", ar: "فانكومايسين", sev: [0, 1, 2, 2], bands: [
    { fr: "15 mg/kg /12 h.", ar: "١٥ مغ/كغ كل ١٢ س." },
    { fr: "15 mg/kg /24 h.", ar: "١٥ مغ/كغ كل ٢٤ س." },
    { fr: "Dose de charge puis selon dosage résiduel.", ar: "جرعة تحميل ثم حسب المستوى المتبقي." },
    { fr: "Dose unique + dosage, redoser après dialyse.", ar: "جرعة وحيدة + معايرة، أعد الجرعة بعد الغسل." }] },
  { fr: "Gentamicine / Amikacine", ar: "جنتاميسين / أميكاسين", sev: [0, 2, 2, 3], bands: [
    { fr: "5 mg/kg (G) ou 15 mg/kg (A) /24 h.", ar: "٥ (ج) أو ١٥ (أ) مغ/كغ كل ٢٤ س." },
    { fr: "Même dose, intervalle 36 h.", ar: "نفس الجرعة، الفاصل ٣٦ س." },
    { fr: "Même dose, intervalle 48 h + dosage.", ar: "نفس الجرعة، الفاصل ٤٨ س + معايرة." },
    { fr: "Dose unique sur avis, dialyse, dosage strict.", ar: "جرعة وحيدة باستشارة، غسل، معايرة صارمة." }] },
  { fr: "Ceftriaxone", ar: "سيفترياكسون", sev: [0, 0, 0, 0], bands: [
    { fr: "Pas d'ajustement.", ar: "لا تعديل." },
    { fr: "Pas d'ajustement.", ar: "لا تعديل." },
    { fr: "Pas d'ajustement.", ar: "لا تعديل." },
    { fr: "Pas d'ajustement (max 2 g/j).", ar: "لا تعديل (حد ٢ غ/يوم)." }] },
  { fr: "Ciprofloxacine", ar: "سيبروفلوكساسين", sev: [0, 0, 1, 1], bands: [
    { fr: "400 mg ×2-3/j IV.", ar: "٤٠٠ مغ ×٢-٣/يوم وريدي." },
    { fr: "400 mg ×2/j.", ar: "٤٠٠ مغ ×٢/يوم." },
    { fr: "400 mg /24 h.", ar: "٤٠٠ مغ كل ٢٤ س." },
    { fr: "400 mg /24 h puis dose après dialyse.", ar: "٤٠٠ مغ كل ٢٤ س مع جرعة بعد الغسل." }] },
  { fr: "Lévofloxacine", ar: "ليفوفلوكساسين", sev: [0, 1, 1, 1], bands: [
    { fr: "500 mg /12-24 h.", ar: "٥٠٠ مغ كل ١٢-٢٤ س." },
    { fr: "500 mg /24 h puis adapter.", ar: "٥٠٠ مغ كل ٢٤ س ثم عدّل." },
    { fr: "250 mg /24 h.", ar: "٢٥٠ مغ كل ٢٤ س." },
    { fr: "250 mg /48 h.", ar: "٢٥٠ مغ كل ٤٨ س." }] },
  { fr: "Amoxicilline", ar: "أموكسيسيلين", sev: [0, 0, 1, 2], bands: [
    { fr: "Dose standard.", ar: "جرعة معتادة." },
    { fr: "Dose standard.", ar: "جرعة معتادة." },
    { fr: "Max 500 mg ×3/j.", ar: "حد ٥٠٠ مغ ×٣/يوم." },
    { fr: "500 mg /24 h.", ar: "٥٠٠ مغ كل ٢٤ س." }] },
  { fr: "Imipénème", ar: "إيميبينيم", sev: [0, 1, 1, 2], bands: [
    { fr: "500 mg ×4/j (1 g ×3/j si grave).", ar: "٥٠٠ مغ ×٤/يوم (١ غ ×٣ إن كان شديداً)." },
    { fr: "500 mg ×3/j.", ar: "٥٠٠ مغ ×٣/يوم." },
    { fr: "500 mg ×2/j.", ar: "٥٠٠ مغ ×٢/يوم." },
    { fr: "250 mg ×2/j.", ar: "٢٥٠ مغ ×٢/يوم." }] },
  { fr: "Acyclovir", ar: "أسيكلوفير", sev: [0, 1, 1, 2], bands: [
    { fr: "5-10 mg/kg /8 h.", ar: "٥-١٠ مغ/كغ كل ٨ س." },
    { fr: "5-10 mg/kg /12 h.", ar: "٥-١٠ مغ/كغ كل ١٢ س." },
    { fr: "5-10 mg/kg /24 h.", ar: "٥-١٠ مغ/كغ كل ٢٤ س." },
    { fr: "5-10 mg/kg /24 h + hydratation, dose après dialyse.", ar: "٥-١٠ مغ/كغ كل ٢٤ س + إرواء، وجرعة بعد الغسل." }] },
  {
    fr: "Gabapentine",
    ar: "غابابنتين",
    thresholds: [80, 50, 30, 15],
    sev: [0, 1, 1, 1, 1],
    bands: [
      { fr: "900–3 600 mg/j, répartis en 3 prises.", ar: "٩٠٠–٣٦٠٠ مغ/ي، مقسمة على ٣ جرعات.", range: { fr: "ClCr ≥ 80 mL/min", ar: "CrCl ≥ ٨٠ مل/د" } },
      { fr: "600–1 800 mg/j, répartis en 3 prises.", ar: "٦٠٠–١٨٠٠ مغ/ي، مقسمة على ٣ جرعات.", range: { fr: "ClCr 50–79 mL/min", ar: "CrCl ٥٠–٧٩ مل/د" } },
      { fr: "300–900 mg/j, répartis en 3 prises.", ar: "٣٠٠–٩٠٠ مغ/ي، مقسمة على ٣ جرعات.", range: { fr: "ClCr 30–49 mL/min", ar: "CrCl ٣٠–٤٩ مل/د" } },
      { fr: "150–600 mg/j, en 3 prises. Pour 150 mg/j : 300 mg un jour sur deux.", ar: "١٥٠–٦٠٠ مغ/ي، على ٣ جرعات. لجرعة ١٥٠ مغ/ي: ٣٠٠ مغ يوماً بعد يوم.", range: { fr: "ClCr 15–29 mL/min", ar: "CrCl ١٥–٢٩ مل/د" } },
      { fr: "150–300 mg/j dans la catégorie < 15 ; réduire proportionnellement selon la ClCr.", ar: "١٥٠–٣٠٠ مغ/ي في فئة أقل من ١٥؛ تُخفّض الجرعة تناسبياً حسب ClCr.", range: { fr: "ClCr < 15 mL/min", ar: "CrCl < ١٥ مل/د" } },
    ],
    note: {
      fr: "La dose quotidienne est normalement répartie en 3 prises. Sous 15 mL/min, l'ajustement proportionnel n'est pas calculé ici. L'hémodialyse demande un schéma distinct et une dose après séance ; vérifier le RCP. Des gélules de 100 mg peuvent être nécessaires.",
      ar: "تُقسّم الجرعة اليومية عادةً على ٣ جرعات. دون ١٥ مل/د، لا تحسب هذه الأداة التخفيض التناسبي. للغسيل الدموي نظام خاص وجرعة بعد الجلسة؛ راجع النشرة. قد تلزم كبسولات ١٠٠ مغ.",
    },
    source: {
      fr: "RCP ANSM — GABAPENTINE ZENTIVA 400 mg, gélule (mis à jour le 17/09/2026)",
      ar: "النشرة الرسمية الفرنسية ANSM — GABAPENTINE ZENTIVA 400 mg (مراجعة 17/09/2026)",
      url: "https://base-donnees-publique.medicaments.gouv.fr/medicament/67350239/extrait",
    },
  },
  {
    fr: "Prégabaline",
    ar: "بريغابالين",
    thresholds: [60, 30, 15],
    sev: [0, 1, 1, 1],
    bands: [
      { fr: "Début : 150 mg/j ; maximum : 600 mg/j, en 2 ou 3 prises.", ar: "البداية: ١٥٠ مغ/ي؛ الحد الأقصى: ٦٠٠ مغ/ي، على جرعتين أو ٣.", range: { fr: "ClCr ≥ 60 mL/min", ar: "CrCl ≥ ٦٠ مل/د" } },
      { fr: "Début : 75 mg/j ; maximum : 300 mg/j, en 2 ou 3 prises.", ar: "البداية: ٧٥ مغ/ي؛ الحد الأقصى: ٣٠٠ مغ/ي، على جرعتين أو ٣.", range: { fr: "ClCr 30–<60 mL/min", ar: "CrCl ٣٠–<٦٠ مل/د" } },
      { fr: "Début : 25–50 mg/j ; maximum : 150 mg/j, 1 prise/j ou 2.", ar: "البداية: ٢٥–٥٠ مغ/ي؛ الحد الأقصى: ١٥٠ مغ/ي، مرة أو مرتين يومياً.", range: { fr: "ClCr 15–<30 mL/min", ar: "CrCl ١٥–<٣٠ مل/د" } },
      { fr: "Début : 25 mg/j ; maximum : 75 mg/j, en 1 prise/j.", ar: "البداية: ٢٥ مغ/ي؛ الحد الأقصى: ٧٥ مغ/ي، مرة يومياً.", range: { fr: "ClCr < 15 mL/min", ar: "CrCl < ١٥ مل/د" } },
    ],
    note: {
      fr: "La dose quotidienne totale doit être divisée selon le nombre de prises indiqué. En hémodialyse, le RCP prévoit une dose supplémentaire unique de 25–100 mg immédiatement après une séance de 4 h ; elle n'est pas calculée par cette grille.",
      ar: "تُقسّم الجرعة اليومية حسب عدد الجرعات المذكور. في الغسيل الدموي، تذكر النشرة جرعة إضافية واحدة ٢٥–١٠٠ مغ مباشرةً بعد جلسة ٤ ساعات؛ لا تحسبها هذه القائمة.",
    },
    source: {
      fr: "RCP ANSM — PREGABALINE HCS 75 mg, gélule (mis à jour le 29/03/2024)",
      ar: "النشرة الرسمية الفرنسية ANSM — PREGABALINE HCS 75 mg (مراجعة 29/03/2024)",
      url: "https://base-donnees-publique.medicaments.gouv.fr/medicament/63754960/extrait",
    },
  },
  { fr: "Morphine et opioïdes", ar: "مورفين وأفيونيات", sev: [0, 1, 2, 2], bands: [
    { fr: "Titration standard.", ar: "معايرة معتادة." },
    { fr: "Espacer, surveiller la sédation.", ar: "باعد وراقب التخدير." },
    { fr: "Réduire la dose de 50 %, sédation rapprochée.", ar: "خفّض ٥٠٪ وراقب التخدير عن قرب." },
    { fr: "Éviter; métabolites actifs qui s'accumulent.", ar: "تجنّب؛ المستقلبات الفعّالة تتراكم." }] },
  { fr: "Nitrofurantoïne", ar: "نيتروفورانتوين", sev: [0, 0, 3, 3], bands: [
    { fr: "Dose standard.", ar: "جرعة معتادة." },
    { fr: "Dose standard.", ar: "جرعة معتادة." },
    { fr: "Contre-indiquée (échec et toxicité).", ar: "ممنوع (فشل وسمية)." },
    { fr: "Contre-indiquée.", ar: "ممنوع." }] },
  { fr: "AINS", ar: "مضادات الالتهاب غير الستيروئيدية", sev: [1, 2, 3, 3], bands: [
    { fr: "Éviter si HTA/diurétique/IEC associés.", ar: "تجنّب مع الضغط/مدرّ/مثبّط الأنجيوتنسين." },
    { fr: "Éviter.", ar: "تجنّب." },
    { fr: "Dangereux: néphrotoxicité.", ar: "خطير: سمية كلوية." },
    { fr: "Interdit.", ar: "محظور." }] },
  { fr: "Colchicine", ar: "كولشيسين", sev: [0, 1, 2, 3], bands: [
    { fr: "Cure courte standard.", ar: "علاج قصير معتاد." },
    { fr: "Réduire, cure courte.", ar: "خفّض، علاج قصير." },
    { fr: "Éviter (toxicité musculaire et médullaire).", ar: "تجنّب (سمية عضلية ونقيّة)." },
    { fr: "Interdit.", ar: "محظور." }] },
];

export default function RenalDosePage() {
  useRegisterRecent("calculateur:renal-dose");
  const { lang } = useApp();
  const [age, setAge] = useState("");
  const [wt, setWt] = useState("");
  const [ht, setHt] = useState("");
  const [sexe, setSexe] = useState<"m" | "f">("m");
  const [unit, setUnit] = useState<"mg" | "umol">("mg");
  const [scr, setScr] = useState("");
  const [confirmedSuspiciousUnit, setConfirmedSuspiciousUnit] = useState<string | null>(null);
  usePrefillPatient((p) => {
    if (!wt && p.w) setWt(p.w);
    if (!age && p.age) setAge(p.age);
    if (!scr && p.scr) setScr(p.scr);
    if (p.sexe === "f") setSexe("f");
  });
  const [useIbw, setUseIbw] = useState(false);

  const scrValue = parseInput(scr);
  const ageValue = parseInput(age);
  const heightValue = parseInput(ht);
  const ibwValue = Number.isFinite(heightValue) && heightValue > 0 ? ibwKg(heightValue, sexe) : null;
  const invalidIbw = useIbw && (ibwValue === null || ibwValue <= 0);
  const suspiciousMgUnit = unit === "mg" && Number.isFinite(scrValue) && scrValue > 20;
  const confirmationKey = `${unit}:${scr}`;
  const unitConfirmed = !suspiciousMgUnit || confirmedSuspiciousUnit === confirmationKey;

  const r = useMemo(() => {
    const A = parseInput(age), W = parseInput(wt), H = parseInput(ht), S = parseInput(scr);
    if (!Number.isFinite(A) || A < 18 || A >= 140 || !Number.isFinite(W) || W <= 0 || !Number.isFinite(S) || S <= 0) return null;
    if (suspiciousMgUnit && confirmedSuspiciousUnit !== confirmationKey) return null;
    const ibw = Number.isFinite(H) && H > 0 ? ibwKg(H, sexe) : null;
    if (useIbw && (ibw === null || ibw <= 0)) return null;
    const mg = unit === "mg" ? S : S / 88.4;
    const weightUsed = useIbw ? Math.min(W, ibw ?? W) : W;
    const crcl = ((140 - A) * weightUsed * (sexe === "f" ? 0.85 : 1)) / (72 * mg);
    if (!Number.isFinite(crcl) || crcl < 0) return null;
    const band = crcl >= 60 ? 0 : crcl >= 30 ? 1 : crcl >= 15 ? 2 : 3;
    return { crcl, band, mg, ibw, weightUsed };
  }, [age, wt, ht, scr, sexe, unit, useIbw, suspiciousMgUnit, confirmedSuspiciousUnit, confirmationKey]);

  const cell = "flex flex-col gap-1 rounded-xl border border-line bg-surface p-3";

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Gauge className="h-6 w-6" />}
        title={lang === "ar" ? "جسر الصيدلة للفشل الكلوي" : "Bridge rénal pharmacologique"}
        sub={lang === "ar" ? "حساب Cockcroft–Gault للبالغين، مع تحويل المضادات إلى جدول PDF الكامل." : "Cockcroft–Gault chez l’adulte ; pour les antibiotiques, accès direct au tableau PDF complet."}
      />

      <section className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4 text-sm leading-relaxed">
        <p className="font-black text-blue-500">
          <T
            fr="Antibiotiques : utilisez le tableau dédié issu du PDF fourni (93 lignes × 5 stades). Son DFG et ses garde-fous sont calculés dans l’outil source ; ne transposez pas directement le résultat Cockcroft–Gault affiché ici."
            ar="المضادات الحيوية: استخدم الجدول المخصّص المستند إلى PDF المقدّم (٩٣ سطراً × ٥ مراحل). يُحسب DFG وضوابطه داخل الأداة المصدرية؛ لا تنقل نتيجة Cockcroft–Gault الظاهرة هنا مباشرةً إلى مراحل ذلك الجدول."
          />
        </p>
        <Link href="/calculateurs/antibio-renal" className="mt-3 inline-flex rounded-full border border-blue-500 px-4 py-2 font-black text-blue-500">
          <T fr="Ouvrir l’adaptation antibiotique OMEDIT" ar="افتح تكييف المضادات OMEDIT" />
        </Link>
      </section>

      <section className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-relaxed">
        <p className="font-bold text-amber-600">
          <T
            fr="Le PDF fourni ne couvre que les antibiotiques. Les lignes Gabapentine et Prégabaline ont leur RCP français officiel lié sous chacune (produit et date indiqués) ; elles ne constituent pas une validation tunisienne. Les autres lignes proviennent de l’ancienne liste et restent à vérifier dans le RCP local avant tout usage clinique."
            ar="ملف PDF المقدّم يخصّ المضادات فقط. أرفقت رابط النشرة الفرنسية الرسمية لكل من غابابنتين وبريغابالين مع اسم المنتج وتاريخه؛ وهذا لا يعني اعتماداً تونسياً. بقية الأسطر من القائمة القديمة وتحتاج إلى مراجعة النشرة المحلية قبل الاستعمال السريري."
          />
        </p>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Âge (ans)" ar="العمر (سنة)" /></span>
          <NumStepper value={ age } onValue={ setAge } className="field" label="age" /></label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></span>
          <NumStepper value={ wt } onValue={ setWt } className="field" label="wt" /></label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Taille (cm, option)" ar="الطول (سم، اختياري)" /></span>
          <NumStepper value={ ht } onValue={ setHt } className="field" label="ht" /></label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Créatinine" ar="الكرياتينين" /></span>
          <div className="flex items-center gap-2">
            <NumStepper value={ scr } onValue={(value) => { setScr(value); setConfirmedSuspiciousUnit(null); }} className="field" label="scr" />
            <button onClick={() => { setUnit((u) => (u === "mg" ? "umol" : "mg")); setConfirmedSuspiciousUnit(null); }}
              className="shrink-0 rounded-lg border border-line px-2 py-1 text-xs font-black" dir="ltr">{unit === "mg" ? "mg/dL" : "µmol/L"}</button>
          </div>
        </label>
      </section>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSexe("m")} aria-pressed={sexe === "m"}
          className={`touch rounded-full border px-4 py-2 text-xs font-black ${sexe === "m" ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
          style={sexe === "m" ? { background: "var(--accent)" } : undefined}><T fr="Homme" ar="رجل" /></button>
        <button onClick={() => setSexe("f")} aria-pressed={sexe === "f"}
          className={`touch rounded-full border px-4 py-2 text-xs font-black ${sexe === "f" ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
          style={sexe === "f" ? { background: "var(--accent)" } : undefined}><T fr="Femme (×0,85)" ar="امرأة (×٠٫٨٥)" /></button>
        <button onClick={() => setUseIbw((v) => !v)} aria-pressed={useIbw}
          className={`touch rounded-full border px-4 py-2 text-xs font-black ${useIbw ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
          style={useIbw ? { background: "var(--sev-urgent)" } : undefined}>
          <T fr="Poids idéal (obésité)" ar="الوزن المثالي (سمنة)" />
        </button>
      </div>

      {suspiciousMgUnit && !unitConfirmed && (
        <div role="alert" className="rounded-2xl border border-amber-500/50 bg-amber-500/10 p-3 text-sm font-bold">
          <p><T fr="Créatinine > 20 mg/dL : unité inhabituelle. Aucun résultat ni conseil de dose n’est affiché avant vérification. Si le laboratoire confirme mg/dL, confirmez la valeur ci-dessous ; sinon, changez l’unité en µmol/L." ar="الكرياتينين > ٢٠ مغ/دل: وحدة غير معتادة. لن تظهر نتيجة أو إرشادات جرعة قبل التحقق. إذا أكّد المختبر mg/dL فأكّد القيمة أدناه؛ وإلا غيّر الوحدة إلى µmol/L." /></p>
          <button onClick={() => setConfirmedSuspiciousUnit(confirmationKey)} className="mt-2 rounded-lg border border-amber-600 px-3 py-2 font-black">
            <T fr="Confirmer que la valeur est bien en mg/dL" ar="أؤكد أن القيمة فعلًا بوحدة mg/dL" />
          </button>
        </div>
      )}

      {Number.isFinite(ageValue) && ageValue > 0 && ageValue < 18 && (
        <p role="alert" className="rounded-2xl border border-red-500/50 bg-red-500/10 p-3 text-sm font-black text-red-500">
          <T fr="Ce calculateur et les lignes médicamenteuses ci-dessous sont réservés à l’adulte ; aucun résultat adulte n’est affiché pour un patient pédiatrique." ar="هذه الحاسبة وأسطر الأدوية أدناه للبالغين؛ لا تُعرض نتيجة البالغين لمريض طفل." />{" "}
          <Link href="/calculateurs/antibiotiques" className="underline"><T fr="Ouvrir l’outil pédiatrique" ar="افتح أداة الأطفال" /></Link>
        </p>
      )}

      {invalidIbw && (
        <p role="alert" className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 text-sm font-bold">
          <T fr="Saisissez une taille valide en centimètres, ou désactivez l’option de poids idéal." ar="أدخل طولاً صحيحاً بالسنتيمتر أو ألغِ خيار الوزن المثالي." />
        </p>
      )}

      {r ? (
        <>
          <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.band === 3 ? "sev-critical" : r.band === 2 ? "sev-urgent" : r.band === 1 ? "sev-standard" : ""}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-2xl font-black tabular-nums" dir="ltr">{Math.round(r.crcl)} <span className="text-sm opacity-60">mL/min</span></p>
              <Badge tone={r.band === 3 ? "critical" : r.band === 2 ? "urgent" : r.band === 1 ? "standard" : "neutral"}>
                {lang === "ar" ? BAND_NAMES[r.band].ar : BAND_NAMES[r.band].fr}
              </Badge>
            </div>
            <p className="mt-1 text-xs opacity-70">
              {lang === "ar"
                ? `Cockcroft-Gault · وزن مستعمل ${Math.round(r.weightUsed)} كغ${r.ibw ? ` (المثالي ${Math.round(r.ibw)})` : ""} · كرياتينين ${r.mg.toFixed(2)} مغ/دل`
                : `Cockcroft-Gault · poids utilisé ${Math.round(r.weightUsed)} kg${r.ibw ? ` (idéal ${Math.round(r.ibw)})` : ""} · créatinine ${r.mg.toFixed(2)} mg/dL`}
            </p>
          </div>

          <ul className="flex flex-col gap-2">
            {ROWS.map((row) => {
              const antibiotics = ANTIBIOTIC_SEARCH[row.fr];
              const thresholdIndex = row.thresholds?.findIndex((threshold) => r.crcl >= threshold);
              const bandIndex = thresholdIndex === undefined ? r.band : thresholdIndex < 0 ? row.thresholds!.length : thresholdIndex;
              const doseBand = row.bands[bandIndex];
              const sev = row.sev[bandIndex] ?? 0;
              const tone = sev === 3 ? "critical" : sev === 2 ? "urgent" : sev === 1 ? "standard" : "neutral";
              const sevClass = sev === 3 ? "sev-critical" : sev === 2 ? "sev-urgent" : sev === 1 ? "sev-standard" : "";
              return (
                <li key={row.fr} className={`card rounded-2xl border border-line bg-surface p-3 ${antibiotics ? "" : `sev-strip ${sevClass}`}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-black">{lang === "ar" ? row.ar : row.fr}</p>
                    {antibiotics ? (
                      <Badge tone="neutral"><T fr="Tableau PDF" ar="جدول PDF" /></Badge>
                    ) : (
                      <div className="flex flex-wrap justify-end gap-1">
                        {doseBand.range && <Badge tone="neutral">{lang === "ar" ? doseBand.range.ar : doseBand.range.fr}</Badge>}
                        <Badge tone={tone}>
                          {sev === 3 ? <T fr="Contre-indiqué" ar="ممنوع" /> : sev === 2 ? <T fr="Risque" ar="خطر" /> : sev === 1 ? <T fr="Ajuster" ar="عدّل" /> : <T fr="Inchangé" ar="بلا تغيير" />}
                        </Badge>
                        <Badge tone="neutral"><T fr={row.source ? "RCP individuel" : "Hors PDF fourni"} ar={row.source ? "RCP فردي" : "خارج PDF المقدّم"} /></Badge>
                      </div>
                    )}
                  </div>
                  {antibiotics ? (
                    <div className="mt-2">
                      <p className="text-sm font-bold opacity-80">
                        <T fr="Les raccourcis de dose de l’ancienne liste ne sont pas affichés ; consultez les lignes détaillées du PDF source." ar="لا نعرض اختصار الجرعة من القائمة السابقة؛ راجع الأسطر التفصيلية في جدول PDF المصدر." />
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {antibiotics.map((antibiotic) => (
                          <Link key={antibiotic.query} href={`/calculateurs/antibio-renal?q=${encodeURIComponent(antibiotic.query)}`} className="inline-flex rounded-full border border-blue-500 px-3 py-1.5 text-xs font-black text-blue-500">
                            {lang === "ar" ? antibiotic.ar : antibiotic.fr}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="mt-1 text-sm font-bold opacity-80">{lang === "ar" ? doseBand.ar : doseBand.fr}</p>
                      {row.note && (
                        <p className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2 text-xs leading-relaxed">
                          {lang === "ar" ? row.note.ar : row.note.fr}
                        </p>
                      )}
                      {row.source && (
                        <a href={row.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-xs font-black text-blue-500 underline underline-offset-2">
                          {lang === "ar" ? row.source.ar : row.source.fr}
                        </a>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap gap-2">
            <Link href="/calculateurs/aki" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="AKI / KDIGO" ar="قصور الكلى الحاد" /></Link>
            <Link href="/calculateurs/safe-dose" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Moteur de dose sûre" ar="محرّك الجرعة الآمنة" /></Link>
            <Link href="/calculateurs/antibiotiques" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Antibiotiques" ar="المضادات الحيوية" /></Link>
          </div>
        </>
      ) : !(suspiciousMgUnit && !unitConfirmed) && !(Number.isFinite(ageValue) && ageValue > 0 && ageValue < 18) && !invalidIbw ? (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Saisissez un âge adulte (18–139 ans), un poids et une créatinine positifs. La taille n’est requise que si vous activez le poids idéal." ar="أدخل عمراً للبالغين (١٨–١٣٩ سنة) ووزناً وكرياتينين موجبين. لا يُطلب الطول إلا عند تفعيل الوزن المثالي." />
        </p>
      ) : null}
    </div>
  );
}

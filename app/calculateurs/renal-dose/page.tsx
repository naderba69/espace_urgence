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

type Band = { fr: string; ar: string };
type Row = { fr: string; ar: string; bands: Band[]; sev: [number, number, number, number] };

const BAND_NAMES = [
  { fr: "≥ 60 mL/min", ar: "≥ ٦٠ مل/د" },
  { fr: "30-59", ar: "٣٠-٥٩" },
  { fr: "15-29", ar: "١٥-٢٩" },
  { fr: "< 15", ar: "< ١٥" },
];

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
  { fr: "Gabapentine", ar: "غابابنتين", sev: [0, 1, 1, 2], bands: [
    { fr: "1200-3600 mg/j.", ar: "١٢٠٠-٣٦٠٠ مغ/يوم." },
    { fr: "400-1400 mg/j.", ar: "٤٠٠-١٤٠٠ مغ/يوم." },
    { fr: "200-700 mg/j.", ar: "٢٠٠-٧٠٠ مغ/يوم." },
    { fr: "100-300 mg/j.", ar: "١٠٠-٣٠٠ مغ/يوم." }] },
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
  usePrefillPatient((p) => {
    if (!wt && p.w) setWt(p.w);
    if (!age && p.age) setAge(p.age);
    if (!scr && p.scr) setScr(p.scr);
    if (p.sexe === "f") setSexe("f");
  });
  const [useIbw, setUseIbw] = useState(false);

  const r = useMemo(() => {
    const A = parseFloat(age), W = parseFloat(wt), H = parseFloat(ht), S = parseFloat(scr);
    if (!Number.isFinite(A) || !Number.isFinite(W) || !Number.isFinite(S) || S <= 0) return null;
    const suspectUnit = unit === "mg" && S > 20; // une créatinine > 20 mg/dL est presque toujours des µmol/L
    const mg = unit === "mg" ? (suspectUnit ? S / 88.4 : S) : S / 88.4;
    const ibw = Number.isFinite(H) ? ibwKg(H, sexe) : null;
    const weightUsed = useIbw && ibw ? Math.min(W, ibw) : W;
    const crcl = ((140 - A) * weightUsed * (sexe === "f" ? 0.85 : 1)) / (72 * mg);
    const band = crcl >= 60 ? 0 : crcl >= 30 ? 1 : crcl >= 15 ? 2 : 3;
    return { crcl, band, mg, ibw, weightUsed, suspectUnit };
  }, [age, wt, ht, scr, sexe, unit, useIbw]);

  const cell = "flex flex-col gap-1 rounded-xl border border-line bg-surface p-3";

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Gauge className="h-6 w-6" />}
        title={lang === "ar" ? "جسر الصيدلة للفشل الكلوي" : "Bridge rénal pharmacologique"}
        sub={lang === "ar" ? "Cockcroft-Gault ← العمر/الوزن/الكرياتينين، ثم تكييف ١٦ دواءً." : "Cockcroft-Gault ← âge/poids/créatinine, puis adaptation de 16 médicaments."}
      />

      <section className="grid grid-cols-2 gap-2">
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Âge (ans)" ar="العمر (سنة)" /></span>
          <NumStepper value={ age } onValue={ setAge } className="field" label="age" /></label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></span>
          <NumStepper value={ wt } onValue={ setWt } className="field" label="wt" /></label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Taille (cm, option)" ar="الطول (سم، اختياري)" /></span>
          <NumStepper value={ ht } onValue={ setHt } className="field" label="ht" /></label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Créatinine" ar="الكرياتينين" /></span>
          <div className="flex items-center gap-2">
            <NumStepper value={ scr } onValue={ setScr } className="field" label="scr" />
            <button onClick={() => setUnit((u) => (u === "mg" ? "umol" : "mg"))}
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

      {r ? (
        <>
          <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.band === 3 ? "sev-critical" : r.band === 2 ? "sev-urgent" : r.band === 1 ? "sev-standard" : ""}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-2xl font-black tabular-nums" dir="ltr">{Math.round(r.crcl)} <span className="text-sm opacity-60">mL/min</span></p>
              <Badge tone={r.band === 3 ? "critical" : r.band === 2 ? "urgent" : r.band === 1 ? "standard" : "neutral"}>
                {lang === "ar" ? BAND_NAMES[r.band].ar : BAND_NAMES[r.band].fr}
              </Badge>
            </div>
            {r.suspectUnit && (
              <p className="mt-2 rounded-xl p-2 text-xs font-black" style={{ background: "var(--sev-urgent-bg)", color: "var(--sev-urgent)" }}>
                <T fr="Valeur > 20 mg/dL: unité probablement en µmol/L. Le calcul a été fait en divisant par 88,4 — confirmez l'unité du laboratoire." ar="القيمة > ٢٠ مغ/دل: الوحدة على الأرجح µmol/L. أُجري الحساب بالقسمة على ٨٨٫٤ — أكّد وحدة المختبر." />
              </p>
            )}
            <p className="mt-1 text-xs opacity-70">
              {lang === "ar"
                ? `Cockcroft-Gault · وزن مستعمل ${Math.round(r.weightUsed)} كغ${r.ibw ? ` (المثالي ${Math.round(r.ibw)})` : ""} · كرياتينين ${r.mg.toFixed(2)} مغ/دل`
                : `Cockcroft-Gault · poids utilisé ${Math.round(r.weightUsed)} kg${r.ibw ? ` (idéal ${Math.round(r.ibw)})` : ""} · créatinine ${r.mg.toFixed(2)} mg/dL`}
            </p>
          </div>

          <ul className="flex flex-col gap-2">
            {ROWS.map((row) => {
              const sev = row.sev[r.band];
              return (
                <li key={row.fr} className={`card sev-strip rounded-2xl border border-line bg-surface p-3 ${sev === 3 ? "sev-critical" : sev === 2 ? "sev-urgent" : sev === 1 ? "sev-standard" : ""}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-black">{lang === "ar" ? row.ar : row.fr}</p>
                    <Badge tone={sev === 3 ? "critical" : sev === 2 ? "urgent" : sev === 1 ? "standard" : "neutral"}>
                      {sev === 3 ? <T fr="Contre-indiqué" ar="ممنوع" /> : sev === 2 ? <T fr="Risque" ar="خطر" /> : sev === 1 ? <T fr="Ajuster" ar="عدّل" /> : <T fr="Inchangé" ar="بلا تغيير" />}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm font-bold opacity-80">{lang === "ar" ? row.bands[r.band].ar : row.bands[r.band].fr}</p>
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
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Âge, poids et créatinine suffisent pour la clairance." ar="العمر والوزن والكرياتينين تكفي لحساب التصفية." />
        </p>
      )}
    </div>
  );
}

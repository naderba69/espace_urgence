"use client";
// v18.0/v18.1 — تكييف المضادات الحيوية مع الوظيفة الكلوية: 93 تركيبة × 5 مراحل.
// Adaptation des antibiotiques à la fonction rénale (tableau OMEDIT V2.3) :
//  - étage 1 : valeurs imprimées mot pour mot + dose absolue au poids (lib/atb-dose.ts) ;
//  - étage 2 : DFG chronique (CKD-EPI 2021), aigu (KDIGO), enfant (CKID U25) et escalade GPR
//    (lib/renal-clearance.ts) ;
//  - étage 3 : plan antibiotique par patient, réévaluation a → b et export (lib/atb-plan.ts).
//
// ⚠️ الكبار غير الخاضعين للغسيل فقط. المحتوى الجرعي منقول حرفيًا من الجدول المرجعي (فرنسي):
//    الجرعة تُنقل ولا تُترجم. الواجهة والتنبيهات بالعربية والفرنسية.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NumStepper from "@/components/ui/NumStepper";
import { useApp, usePrefillPatient } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import AtbPlanPanel from "@/components/atb/AtbPlanPanel";
import { normalize } from "@/lib/text";
import { readJSON, writeJSON } from "@/lib/storage";
import { isContraindicated, isDiscouraged, isNoData, requiresSourceCheck, weightDoseText } from "@/lib/atb-dose";
import { chooseStage, type AkiResult } from "@/lib/renal-clearance";
import { addDecision, emptyPlan, parsePlan, PLAN_KEY, planReasonLabel, removeMolecule, resetPlan, currentDecisions, type PlanReason } from "@/lib/atb-plan";
import { ATB_RENAL_ROWS, ATB_RENAL_SECTIONS, ATB_RENAL_STAGES, ATB_RENAL_BY_ID, type AtbStageId } from "@/data/atb-renal";
import { Pill, Filter, Info, AlertTriangle } from "lucide-react";

const STAGE_IDS = ATB_RENAL_STAGES.map((s) => s.id);

/** مفاتيح معايير KDIGO بالعربية/الفرنسية للعرض. */
const AKI_LABEL: Record<AkiResult["criteria"][number], { fr: string; ar: string }> = {
  "scr-up-48h": { fr: "+0,3 mg/dL en 48 h", ar: "+٠٫٣ مغ/دل في ٤٨ سا" },
  "scr-ratio-48h": { fr: "×1,5 en 48 h", ar: "×١٫٥ في ٤٨ سا" },
  "scr-ratio-7d": { fr: "×1,5 en 7 j", ar: "×١٫٥ في ٧ أيام" },
  "urine-6h": { fr: "< 0,5 mL/kg/h pendant 6 h", ar: "أقلّ من ٠٫٥ مل/كغ/سا لمدّة ٦ سا" },
};

export default function AntibioRenalPage() {
  useRegisterRecent("calculateur:antibio-renal");
  const { lang } = useApp();
  const ar = lang === "ar";

  // ── المريض / Patient ────────────────────────────────────────────────────────────────
  const [age, setAge] = useState("");
  const [wt, setWt] = useState("");
  const [ht, setHt] = useState("");
  const [sexe, setSexe] = useState<"m" | "f">("m");
  const [unit, setUnit] = useState<"mg" | "umol">("mg");
  const [scr, setScr] = useState("");
  const [scr48, setScr48] = useState("");
  const [scr7d, setScr7d] = useState("");
  const [urine, setUrine] = useState("");
  const [urineH, setUrineH] = useState("");
  const [useIbw, setUseIbw] = useState(false);
  const [degraded, setDegraded] = useState(false);
  const [manual, setManual] = useState<AtbStageId | null>(null);

  usePrefillPatient((p) => {
    if (!wt && p.w) setWt(p.w);
    if (!age && p.age) setAge(p.age);
    if (!scr && p.scr) setScr(p.scr);
    if (p.sexe === "f") setSexe("f");
  });

  const num = (s: string) => parseFloat(String(s).replace(",", "."));
  const toMg = (s: string) => {
    const v = num(s);
    if (!Number.isFinite(v) || v <= 0) return null;
    return unit === "mg" && v > 20 ? v / 88.4 : unit === "umol" ? v / 88.4 : v; // µmol/L → mg/dL
  };

  /** المرحلة الكلوية المعتمدة (étage 2) : CKD-EPI / CKID U25 / KDIGO / escalade GPR. */
  const ren = useMemo(() => {
    const scrMgDl = toMg(scr);
    if (scrMgDl === null) return null;
    return chooseStage({
      ageYears: num(age),
      sexe,
      weightKg: num(wt),
      heightCm: num(ht),
      scrMgDl,
      scr48h: toMg(scr48),
      scr7d: toMg(scr7d),
      urineMlKgH: num(urine),
      urineHours: num(urineH),
      degraded,
      useIdealWeight: useIbw,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age, wt, ht, scr, scr48, scr7d, urine, urineH, sexe, unit, useIbw, degraded]);

  const stage: AtbStageId = manual ?? (ren && !ren.refusal ? ren.stage : "normorenal");
  const stageIdx = STAGE_IDS.indexOf(stage);
  const stageMeta = ATB_RENAL_STAGES[stageIdx];
  const stageLabel = `${ar ? stageMeta.ar : stageMeta.fr} · ${stageMeta.dgf}`;
  const weight = num(wt);
  const pediatricAge = num(age) > 0 && num(age) < 18;

  // ── البحث والفلترة / Recherche ──────────────────────────────────────────────────────
  const [q, setQ] = useState("");
  const [section, setSection] = useState<string | null>(null);
  const rows = useMemo(() => {
    const nq = normalize(q.trim());
    return ATB_RENAL_ROWS.filter((r) => {
      if (section && r.section !== section) return false;
      if (!nq) return true;
      return normalize(`${r.fr} ${r.ar} ${ATB_RENAL_SECTIONS.find((s) => s.id === r.section)?.fr ?? ""}`).includes(nq);
    });
  }, [q, section]);

  // ── الخطّة (حلقة a → b) / Plan antibiotique ────────────────────────────────────────
  const [plan, setPlan] = useState(() => emptyPlan());
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydratation unique depuis localStorage
    setPlan(parsePlan(readJSON<unknown>(PLAN_KEY, null)));
  }, []);
  const save = (p: typeof plan) => {
    setPlan(p);
    writeJSON(PLAN_KEY, p);
  };
  const decisions = useMemo(() => currentDecisions(plan), [plan]);
  const [openEditor, setOpenEditor] = useState<string | null>(null);
  const [reason, setReason] = useState<PlanReason>("fonction-renale");
  const [note, setNote] = useState("");
  const nameOf = (id: string) => {
    const r = ATB_RENAL_BY_ID[id];
    return r ? (ar ? r.ar : r.fr) : id;
  };
  const decide = (id: string, decision: "retenue" | "abandonnee", dose?: string) =>
    save(addDecision(plan, { id, decision, reason: decision === "abandonnee" ? reason : undefined, note: note || undefined, snapshot: { weightKg: Number.isFinite(weight) ? weight : undefined, stage, stageLabel, dose } }));

  const cell = "flex flex-col gap-1 rounded-xl border border-line bg-surface p-3";
  const tone = stageIdx === 4 ? "critical" : stageIdx === 3 ? "urgent" : stageIdx === 2 ? "standard" : "neutral";
  const chip = (active: boolean) =>
    `touch rounded-full border px-3 py-1.5 text-xs font-black ${active ? "border-transparent text-white" : "border-line hover:bg-surface2"}`;
  const chipStyle = (active: boolean, accent?: string) => (active ? { background: accent ?? "var(--accent)" } : undefined);

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <PageHeader
        icon={<Pill className="h-6 w-6" />}
        title={<T fr="Antibiotiques & fonction rénale" ar="المضادات الحيوية والوظيفة الكلوية" />}
        sub={
          <T
            fr="93 lignes du tableau de référence × 5 stades — DFG, dose absolue au poids et plan par patient."
            ar="٩٣ سطرًا من الجدول المرجعي × ٥ مراحل — التصفية، الجرعة المطلقة حسب الوزن، وخطّة لكل مريض."
          />
        }
        count={ATB_RENAL_ROWS.length}
      />

      {/* المصدر والتنبيه / Source & garde-fous */}
      <section className="rounded-2xl border border-line bg-surface p-3 text-xs leading-relaxed">
        <p className="flex items-start gap-2 font-bold">
          <Info className="mt-0.5 h-4 w-4 shrink-0 opacity-70" aria-hidden />
          <span>
            <T
              fr="Source : OMEDIT Pays de la Loire — « Adaptation des antibiotiques à la fonction rénale », V2.3 (avril 2026) ; données RCP / GPR (SPILF–SFPT–CA-SFM, juin 2023) / ePOPI arrêtées au 10/01/2024."
              ar="المصدر: OMEDIT Pays de la Loire — «تكييف المضادات الحيوية مع الوظيفة الكلوية»، النسخة 2.3 (أفريل 2026)؛ معطيات RCP/GPR (SPILF–SFPT–CA-SFM جوان 2023) وePOPI إلى تاريخ 10/01/2024."
            />
          </span>
        </p>
        <p className="mt-2 font-bold" style={{ color: "var(--sev-urgent)" }}>
          <T
            fr="Adultes NON dialysés uniquement. Posologies reprises mot pour mot du tableau (jamais paraphrasées). À valider par un médecin/pharmacien tunisien avant usage clinique."
            ar="للبالغين غير الخاضعين للغسيل الكلوي فقط. الجرعات منقولة حرفيًا عن الجدول (دون إعادة صياغة). تُراجَع من طبيب أو صيدلي تونسي قبل الاستعمال السريري."
          />
        </p>
      </section>

      {/* حدود السن / Limite d'âge */}
      {pediatricAge && (
        <p className="rounded-2xl p-3 text-sm font-black" style={{ background: "var(--sev-critical-bg)", color: "var(--sev-critical)" }}>
          <T
            fr="⚠ Patient < 18 ans : le tableau ci-dessous est réservé aux ADULTES. Le DFG est ici estimé par CKID U25 (Schwartz) pour information, mais la posologie doit venir du calculateur pédiatrique — ne pas mélanger les deux sources."
            ar="⚠ المريض أقل من ١٨ سنة: الجدول أدناه مخصّص للبالغين. التصفية هنا تُقدَّر بـ CKID U25 (Schwartz) على سبيل الإعلام، أمّا الجرعة فتؤخذ من حاسبة الأطفال — لا تُخلط المصادر."
          />{" "}
          <Link href="/calculateurs/antibiotiques" className="underline">
            <T fr="Ouvrir le calculateur pédiatrique" ar="افتح حاسبة الأطفال" />
          </Link>
        </p>
      )}

      {/* المريض / Patient */}
      <section className="grid grid-cols-2 gap-2">
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Âge (ans)" ar="العمر (سنة)" /></span>
          <NumStepper value={age} onValue={setAge} className="field" label={ar ? "العمر" : "age"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></span>
          <NumStepper value={wt} onValue={setWt} className="field" label={ar ? "الوزن" : "wt"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Taille (cm)" ar="الطول (سم)" /></span>
          <NumStepper value={ht} onValue={setHt} className="field" label={ar ? "الطول" : "ht"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Créatinine (actuelle)" ar="الكرياتينين (الحالي)" /></span>
          <div className="flex items-center gap-2">
            <NumStepper value={scr} onValue={setScr} className="field" label={ar ? "الكرياتينين" : "scr"} />
            <button
              onClick={() => setUnit((u) => (u === "mg" ? "umol" : "mg"))}
              className="shrink-0 rounded-lg border border-line px-2 py-1 text-xs font-black"
              dir="ltr"
            >
              {unit === "mg" ? "mg/dL" : "µmol/L"}
            </button>
          </div>
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Créatinine à 48 h (option)" ar="الكرياتينين قبل ٤٨ سا (اختياري)" /></span>
          <NumStepper value={scr48} onValue={setScr48} className="field" label={ar ? "كرياتينين ٤٨ سا" : "scr48"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Créatinine à 7 j (option)" ar="الكرياتينين قبل ٧ أيام (اختياري)" /></span>
          <NumStepper value={scr7d} onValue={setScr7d} className="field" label={ar ? "كرياتينين ٧ أيام" : "scr7d"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Diurèse (mL/kg/h)" ar="الدُّرْيَة (مل/كغ/سا)" /></span>
          <NumStepper value={urine} onValue={setUrine} step={0.1} className="field" label={ar ? "الدُّرْيَة" : "urine"} />
        </label>
        <label className={cell}>
          <span className="text-xs font-black opacity-70"><T fr="Durée d'observation (h)" ar="مدّة المراقبة (سا)" /></span>
          <NumStepper value={urineH} onValue={setUrineH} className="field" label={ar ? "مدّة المراقبة" : "urineH"} />
        </label>
      </section>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSexe("m")} aria-pressed={sexe === "m"} className={chip(sexe === "m")} style={chipStyle(sexe === "m")}>
          <T fr="Homme" ar="رجل" />
        </button>
        <button onClick={() => setSexe("f")} aria-pressed={sexe === "f"} className={chip(sexe === "f")} style={chipStyle(sexe === "f")}>
          <T fr="Femme (×0,85)" ar="امرأة (×٠٫٨٥)" />
        </button>
        <button onClick={() => setUseIbw((v) => !v)} aria-pressed={useIbw} className={chip(useIbw)} style={chipStyle(useIbw, "var(--sev-urgent)")}>
          <T fr="Poids idéal (obésité)" ar="الوزن المثالي (سمنة)" />
        </button>
        <button onClick={() => setDegraded((v) => !v)} aria-pressed={degraded} className={chip(degraded)} style={chipStyle(degraded, "var(--sev-urgent)")}>
          <T fr="DFG 30–90 dégradé (escalade GPR)" ar="تصفية ٣٠–٩٠ مع تدهور (تصعيد GPR)" />
        </button>
      </div>

      {/* التصفية والمرحلة / DFG & stade */}
      <section className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${stageIdx === 4 ? "sev-critical" : stageIdx === 3 ? "sev-urgent" : stageIdx === 2 ? "sev-standard" : ""}`}>
        {ren && !ren.refusal ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <p className="text-2xl font-black tabular-nums" dir="ltr">
                {Math.round(ren.primary === "ckid" ? (ren.egfrCkid as number) : (ren.egfrCkd as number))}{" "}
                <span className="text-sm opacity-60">mL/min/1,73 m²</span>
              </p>
              <Badge tone={tone}>{stageLabel}</Badge>
            </div>
            <p className="mt-1 text-xs opacity-70" dir="ltr">
              {ren.primary === "ckid"
                ? `CKID U25 (0,413 × taille/créat)`
                : `CKD-EPI 2021${ren.egfrCkd ? ` : ${ren.egfrCkd.toFixed(0)} mL/min/1,73 m²` : ""}`}{" "}
              · Cockcroft-Gault {ren.crclCg ? `: ${ren.crclCg.toFixed(0)} mL/min` : "—"}
              {ren.cgWeight ? ` (poids ${ren.cgWeight.toFixed(0)} kg${ren.usedAbw ? ", ajusté" : ""})` : ""}
            </p>
            {ren.primary === "cg" && (
              <p className="mt-1 text-xs font-black" style={{ color: "var(--sev-urgent)" }}>
                <T
                  fr="Stade retenu d'après Cockcroft-Gault (estimation la plus prudente en situation aiguë)."
                  ar="المرحلة المعتمدة حسب Cockcroft-Gault (التقدير الأكثر حذرًا في الوضع الحادّ)."
                />
              </p>
            )}
            {ren.escalated && (
              <p className="mt-1 text-xs font-black" style={{ color: "var(--sev-urgent)" }}>
                <T fr={`↑ Escalade GPR : ${2} stades appliqués (${stageLabel})`} ar={`↑ تصعيد GPR: مرحلتان مطبَّقتان (${stageLabel})`} />
              </p>
            )}
            {ren.aki.criteria.length > 0 && (
              <p className="mt-2 rounded-xl p-2 text-xs font-black" style={{ background: "var(--sev-urgent-bg)", color: "var(--sev-urgent)" }}>
                <T fr="KDIGO (agression aiguë) — critères réunis : " ar="KDIGO (قصور حادّ) — المعايير المتحقّقة: " />
                <span dir={ar ? "rtl" : "ltr"}>
                  {ren.aki.criteria.map((c) => (ar ? AKI_LABEL[c].ar : AKI_LABEL[c].fr)).join(" · ")}
                </span>{" "}
                (KDIGO {ren.aki.stage})
              </p>
            )}
            {ren.warnings.map((w, i) => (
              <p key={i} className="mt-1.5 text-xs font-bold opacity-80">⚠ {ar ? w.ar : w.fr}</p>
            ))}
            {manual && (
              <button onClick={() => setManual(null)} className="mt-2 text-xs font-black underline" style={{ color: "var(--accent)" }}>
                <T fr="Revenir au stade calculé" ar="العودة إلى المرحلة المحسوبة" />
              </button>
            )}
          </>
        ) : (
          <p className="text-sm font-bold opacity-80">
            {ren?.refusal === "height" ? (
              <T
                fr="Enfant (< 18 ans) : la taille est indispensable au calcul CKID U25 — saisissez-la (ou le poids) avant toute posologie."
                ar="طفل (< ١٨ سنة): الطول ضروري لحساب CKID U25 — أدخله (أو الوزن) قبل أي جرعة."
              />
            ) : (
              <T
                fr="Âge, poids et créatinine sont nécessaires au DFG — sinon choisissez le stade ci-dessous."
                ar="العمر والوزن والكرياتينين ضرورية لحساب التصفية — وإلا اختر المرحلة أدناه."
              />
            )}
          </p>
        )}
        {/* اختيار يدوي للمرحلة / Choix manuel du stade */}
        <div className="mt-3 flex flex-wrap gap-2">
          {ATB_RENAL_STAGES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setManual(s.id)}
              aria-pressed={stage === s.id}
              className={chip(stage === s.id)}
              style={chipStyle(stage === s.id, i === 4 ? "var(--sev-critical)" : i === 3 ? "var(--sev-urgent)" : i === 2 ? "var(--sev-standard)" : "var(--accent)")}
            >
              {ar ? s.ar : s.fr} <span className="tabular-nums opacity-80" dir="ltr">{s.dgf}</span>
            </button>
          ))}
        </div>
      </section>

      {/* البحث والفلترة / Recherche & sections */}
      <div className="flex flex-col gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={ar ? "ابحث عن مضاد حيوي (بالعربية أو الفرنسية)…" : "Chercher un antibiotique (FR ou AR)…"}
          className="field"
          aria-label={ar ? "بحث" : "Recherche"}
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-black opacity-60"><Filter className="h-3.5 w-3.5" aria-hidden /><T fr="Classe" ar="الفئة" /></span>
          <button onClick={() => setSection(null)} aria-pressed={section === null} className={chip(section === null)} style={chipStyle(section === null)}>
            <T fr="Toutes" ar="الكل" />
          </button>
          {ATB_RENAL_SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setSection(section === s.id ? null : s.id)} aria-pressed={section === s.id} className={chip(section === s.id)} style={chipStyle(section === s.id)}>
              {ar ? s.ar : s.fr}
            </button>
          ))}
        </div>
      </div>

      {/* النتائج / Résultats */}
      <p className="text-xs font-black opacity-60">
        {ar ? `${rows.length} سطرًا · المرحلة المعروضة: ${stageMeta.ar}` : `${rows.length} lignes · stade affiché : ${stageMeta.fr}`}
        {Number.isFinite(weight) && weight > 0 ? (ar ? ` · الوزن ${weight} كغ` : ` · poids ${weight} kg`) : ""}
      </p>

      <ul className="flex flex-col gap-2">
        {rows.map((r) => {
          const secMeta = ATB_RENAL_SECTIONS.find((s) => s.id === r.section);
          const value = r.lines.map((l) => l.d[stageIdx]);
          const infoOnly = r.lines.every((l) => l.kind === "info");
          const bad = value.some((v) => isContraindicated(v));
          const warn = !bad && value.some((v) => isDiscouraged(v));
          const empty = value.every((v) => isNoData(v));
          const decision = decisions.get(r.id);
          // استعلام «المرحلة المجاورة» — بلا استبدال صامت (قاعدة (c) في تصميم v18):
          // لا نأخذ قيمة جارة إلا بتأكيد بشري من الجدول الأصلي.
          const neighbour = [stageIdx - 1, stageIdx + 1]
            .filter((j) => j >= 0 && j < 5)
            .map((j) => r.lines.map((l) => l.d[j]).find((v) => !isNoData(v) && !requiresSourceCheck(v)))
            .find((v) => v !== undefined);
          return (
            <li
              key={r.id}
              className={`card rounded-2xl border border-line bg-surface p-3 ${bad ? "sev-strip sev-critical" : warn ? "sev-strip sev-urgent" : ""}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                <p className="text-sm font-black">{ar ? r.ar : r.fr}</p>
                <span className="text-[11px] font-bold opacity-50" dir="ltr">{r.fr} · p.{r.page}</span>
              </div>
              <p className="mt-0.5 text-[11px] font-bold opacity-60">{ar ? secMeta?.ar : secMeta?.fr}</p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {bad && <Badge tone="critical"><T fr="Contre-indiqué" ar="ممنوع" /></Badge>}
                {warn && <Badge tone="urgent"><T fr="Déconseillé" ar="غير مُستحسن" /></Badge>}
                {empty && <Badge tone="neutral"><T fr="Aucune donnée" ar="لا بيانات" /></Badge>}
                {ren?.escalated && <Badge tone="urgent"><T fr="↑ Escalade GPR (+2 stades)" ar="↑ تصعيد GPR (مرحلتان)" /></Badge>}
                {decision && (
                  <Badge tone={decision.decision === "retenue" ? "standard" : "critical"}>
                    {decision.decision === "retenue" ? <T fr="Retenue" ar="مُعتمدة" /> : <T fr="Abandonnée" ar="متخلّى عنها" />} · #{decision.round}
                  </Badge>
                )}
              </div>

              {/* القيمة للمرحلة المعروضة + الحساب بالوزن */}
              <ul className="mt-2 flex flex-col gap-1.5">
                {r.lines.map((l, i) => {
                  const v = l.d[stageIdx];
                  const calc = l.kind === "dose" && Number.isFinite(weight) && weight > 0 ? weightDoseText(v, weight, ar ? "ar" : "fr") : null;
                  const check = l.kind === "dose" && requiresSourceCheck(v);
                  return (
                    <li key={i} className="rounded-xl border border-line bg-surface2 px-2.5 py-2">
                      <span className="block text-sm font-bold" dir="ltr">{v}</span>
                      {calc && (
                        <span className="mt-1 block text-sm font-black" style={{ color: "var(--accent)" }}>
                          {calc}
                        </span>
                      )}
                      {/* ⚠ لا رقم في المصدر: الجرعة تُنقل كما هي، ويلزم التحقق الورقي */}
                      {check && (
                        <span className="mt-1 block text-xs font-black" style={{ color: "var(--sev-urgent)" }}>
                          {isNoData(v)
                            ? ar
                              ? "⚠ لا بيانات لهذه المرحلة — تحقّق من المصدر (PDF OMEDIT) ومن كون المريض غير خاضع للغسيل."
                              : "⚠ Aucune donnée pour ce stade — vérifier la source (PDF OMEDIT) et le caractère non dialysé du patient."
                            : ar
                              ? "⚠ المصدر لا يُرقّم هذه الجرعة: انقلها كما هي وتحقّق من الجدول الأصلي."
                              : "⚠ La source ne chiffre pas cette conduite : reprise telle quelle, à vérifier dans le tableau original."}
                        </span>
                      )}
                      {isNoData(v) && neighbour && (
                        <span className="mt-1 block text-xs font-bold opacity-70">
                          <T fr="Indice : le stade voisin porte une valeur — à confirmer dans le tableau (cellule peut-être fusionnée)." ar="إشارة: المرحلة المجاورة تحمل قيمة — تُؤكَّد من الجدول (قد تكون الخليّة مدمجة)." />
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* حلقة a → b: قرار أو إعادة تقييم لحظية */}
              {!infoOnly && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => decide(r.id, "retenue", value[0])}
                    className="rounded-full border px-3 py-1.5 text-xs font-black"
                    style={{ borderColor: "var(--sev-standard)", color: "var(--sev-standard)" }}
                  >
                    <T fr="✓ Retenir" ar="✓ اعتماد" />
                  </button>
                  <button
                    onClick={() => { setOpenEditor(openEditor === r.id ? null : r.id); setNote(""); }}
                    className="rounded-full border px-3 py-1.5 text-xs font-black"
                    style={{ borderColor: "var(--sev-critical)", color: "var(--sev-critical)" }}
                  >
                    <T fr="✗ Abandonner" ar="✗ تخلّي" />
                  </button>
                  {decision && (
                    <span className="text-[11px] font-bold opacity-60">
                      <T fr={`tour ${decision.round}`} ar={`الجولة ${decision.round}`} />
                    </span>
                  )}
                </div>
              )}
              {openEditor === r.id && (
                <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface2 p-2">
                  <select value={reason} onChange={(e) => setReason(e.target.value as PlanReason)} className="field max-w-52 text-xs" aria-label={ar ? "سبب التخلّي" : "motif"}>
                    {(Object.keys(planReasonLabel) as PlanReason[]).map((k) => (
                      <option key={k} value={k}>{ar ? planReasonLabel[k].ar : planReasonLabel[k].fr}</option>
                    ))}
                  </select>
                  <input value={note} onChange={(e) => setNote(e.target.value.slice(0, 120))} placeholder={ar ? "ملاحظة (اختياري)" : "note (facultatif)"} className="field max-w-56 text-xs" aria-label={ar ? "ملاحظة" : "note"} />
                  <button
                    onClick={() => { decide(r.id, "abandonnee", value[0]); setOpenEditor(null); }}
                    className="rounded-full px-3 py-1.5 text-xs font-black text-white"
                    style={{ background: "var(--sev-critical)" }}
                  >
                    <T fr="Confirmer l'abandon" ar="تأكيد التخلّي" />
                  </button>
                </div>
              )}

              {!infoOnly && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-black opacity-70">
                    <T fr="Voir les 5 stades" ar="عرض المراحل الخمس" />
                  </summary>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full min-w-[34rem] border-collapse text-xs">
                      <thead>
                        <tr>
                          {ATB_RENAL_STAGES.map((s) => (
                            <th key={s.id} scope="col" className={`border border-line p-1.5 text-start font-black ${s.id === stage ? "bg-surface2" : ""}`}>
                              {ar ? s.ar : s.fr}
                              <span className="ms-1 opacity-60 tabular-nums" dir="ltr">{s.dgf}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {r.lines.map((l, i) => (
                          <tr key={i}>
                            {l.d.map((v, j) => (
                              <td key={j} className={`border border-line p-1.5 align-top ${j === stageIdx ? "bg-surface2 font-bold" : ""} ${isContraindicated(v) ? "sev-critical" : ""}`} dir="ltr">
                                {v}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              )}

              {r.notes.map((n, i) => (
                <p key={i} className="mt-1.5 text-[11px] font-bold italic opacity-70" dir={ar && n.ar ? "rtl" : "ltr"}>
                  {ar && n.ar ? n.ar : n.fr}
                </p>
              ))}
            </li>
          );
        })}
      </ul>

      {!rows.length && (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Aucun antibiotique ne correspond à cette recherche." ar="لا يوجد مضاد حيوي يطابق هذا البحث." />
        </p>
      )}

      {/* الخطّة / Plan (étage 3) */}
      <AtbPlanPanel
        plan={plan}
        name={nameOf}
        stageLabel={stageLabel}
        onReevaluate={(id, decision) => save(addDecision(plan, { id, decision, snapshot: { weightKg: Number.isFinite(weight) ? weight : undefined, stage, stageLabel } }))}
        onRemove={(id) => save(removeMolecule(plan, id))}
        onReset={() => save(resetPlan())}
      />

      {!plan.entries.length && (
        <p className="flex items-start gap-2 rounded-2xl border border-dashed border-line p-3 text-xs font-bold opacity-70">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <T
            fr="Astuce : « Retenir » / « Abandonner » sur chaque molécule construit votre plan (avec réévaluation a → b) puis l'exporte en texte pour le dossier du patient."
            ar="تلميح: «اعتماد» / «تخلّي» على كل تركيبة يبني خطّتك (مع إعادة تقييم a → b) ثم يُصدِّرها نصًّا لملف المريض."
          />
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/renal-dose" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
          <T fr="Bridge rénal (16 classes)" ar="الجسر الكلوي (١٦ صنفًا)" />
        </Link>
        <Link href="/calculateurs/antibiotiques" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
          <T fr="Dose au poids (11 antibiotiques)" ar="الجرعة بالوزن (١١ مضادًا)" />
        </Link>
        <Link href="/calculateurs/aki" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
          <T fr="AKI / KDIGO" ar="القصور الكلوي الحادّ KDIGO" />
        </Link>
      </div>
    </div>
  );
}

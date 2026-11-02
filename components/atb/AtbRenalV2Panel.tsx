"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Activity, AlertTriangle, Ban, Calculator, Eye, HelpCircle, Info, Pill, Search, ShieldAlert, Stethoscope } from "lucide-react";
import { ATB_RENAL_SECTIONS, type AtbStageId } from "@/data/atb-renal";
import { ATB_RENAL_V2_ENABLED, ATB_RENAL_V2_ROWS, type AtbRenalDoseRow } from "@/data/atb-renal-v2";
import {
  cellulePourDFG,
  intervallePourSegmentDFG,
  type IntervalleDfg,
  type LimiteExacteAtb,
  type RegimeAtb,
  type ResultatSelectionAtb,
} from "@/lib/atb-renal-dose";

type Lang = "fr" | "ar";

function localiser(lang: Lang, fr: string, ar: string): string {
  return lang === "ar" ? ar : fr;
}

function normaliser(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr-FR");
}

function borneLabel(intervalle: IntervalleDfg): string {
  const bas = intervalle.borneBasse;
  const haut = intervalle.borneHaute;
  if (bas.valeur === null && haut.valeur === null) return "Tous DFG";
  const morceaux: string[] = [];
  if (bas.valeur !== null) morceaux.push(`${bas.valeur} ${bas.incluse === false ? "<" : "≤"} DFG`);
  if (haut.valeur !== null) morceaux.push(`DFG ${haut.incluse === true ? "≤" : "<"} ${haut.valeur}`);
  return morceaux.join(" ; ");
}

function nomType(type: string, lang: Lang = "fr"): string {
  const labels: Record<string, [string, string]> = {
    "dose-source": ["Texte posologique de la source", "نص الجرعة في المصدر"],
    note: ["Note de la source — pas une dose", "ملاحظة من المصدر — ليست جرعة"],
    "aucune-donnee": ["Aucune donnée posologique dans cette cellule", "لا توجد بيانات جرعة في هذه الخانة"],
    deconseille: ["Déconseillé selon la source", "غير موصى به وفق المصدر"],
    "contre-indique": ["Contre-indiqué selon la source", "مضاد للاستطباب وفق المصدر"],
    "surveillance-requise": ["Surveillance thérapeutique requise", "المراقبة العلاجية مطلوبة"],
  };
  const [fr, ar] = labels[type] ?? ["Contenu source", "محتوى المصدر"];
  return localiser(lang, fr, ar);
}

function formatResultat(resultat: ResultatSelectionAtb, lang: Lang = "fr"): { titre: string; texte: string; alerte: boolean } {
  if (resultat.status === "boundary-30") {
    const titre = localiser(lang, "Sélection suspendue à la limite de 30 mL/min", "توقّف الاختيار عند حدّ 30 مل/دقيقة");
    const texte = lang === "ar"
      ? `DFG = 30 بالضبط — يضع الجدول المصدر 30 في المرحلتين المتوسطة والشديدة. لا تُختار جرعة تلقائياً. القيمة المحسوبة: ${resultat.dfgBrut.toLocaleString("ar-TN", { maximumFractionDigits: 6 })}. راجع المصدر والنشرة مع مختص.`
      : `DFG = 30 : le tableau source place 30 dans les stades modéré et sévère. Aucun stade ni dose n'est choisi automatiquement. Vérifier le PDF original et faire valider le stade par un médecin/pharmacien. Cette ligne comporte un seuil 30 ; refus E2 pour |DFG − 30| ≤ 0,000001 (DFG calculé : ${resultat.dfgBrut.toLocaleString("fr-FR", { maximumFractionDigits: 6 })}).`;
    return { titre, texte, alerte: true };
  }
  if (resultat.status === "bloque") {
    return { titre: nomType(resultat.contenu.type, lang), texte: resultat.contenu.fr, alerte: true };
  }
  if (resultat.status === "invalide") {
    return {
      titre: localiser(lang, "Sélection impossible", "يتعذّر الاختيار"),
      texte: localiser(lang, "Le DFG ou la structure de cette ligne ne permet pas une sélection fiable.", "قيمة DFG أو بنية هذا السطر لا تسمح باختيار موثوق."),
      alerte: true,
    };
  }
  return {
    titre: nomType(resultat.segment.contenu.type, lang),
    texte: resultat.segment.contenu.fr,
    alerte: resultat.segment.contenu.type !== "dose-source",
  };
}

function resultatRegime(regime: RegimeAtb, dfg: number | null): ResultatSelectionAtb | null {
  return dfg === null || !Number.isFinite(dfg) ? null : cellulePourDFG(regime, dfg);
}

function styleDose(regime: RegimeAtb | undefined, dfg: number | null): string {
  if (!regime) return "border-[var(--atb-dose-nd-l)] bg-[var(--atb-dose-nd-bg)] text-[var(--atb-dose-nd-t)]";
  const resultat = resultatRegime(regime, dfg);
  if (!resultat) return "border-[var(--atb-dose-nd-l)] bg-[var(--atb-dose-nd-bg)] text-[var(--atb-dose-nd-t)]";
  if (resultat.status === "boundary-30" || resultat.status === "bloque" || resultat.status === "invalide") return "border-[var(--atb-e3-l)] bg-[var(--atb-e3-bg)] text-[var(--atb-e3-t)]";
  switch (resultat.segment.contenu.type) {
    case "contre-indique": return "border-[var(--atb-dose-ci-l)] bg-[var(--atb-dose-ci-bg)] text-[var(--atb-dose-ci-t)]";
    case "deconseille": return "border-[var(--atb-dose-dc-l)] bg-[var(--atb-dose-dc-bg)] text-[var(--atb-dose-dc-t)]";
    case "aucune-donnee":
    case "note": return "border-[var(--atb-dose-nd-l)] bg-[var(--atb-dose-nd-bg)] text-[var(--atb-dose-nd-t)]";
    case "surveillance-requise": return "border-[var(--atb-e3-l)] bg-[var(--atb-dose-note-bg)] text-[var(--atb-dose-note-t)]";
    default: return resultat.segment.seuil === null
      ? "border-[var(--atb-dose-std-l)] bg-[var(--atb-dose-std-bg)] text-[var(--atb-dose-std-t)]"
      : "border-[var(--atb-dose-ad-l)] bg-[var(--atb-dose-ad-bg)] text-[var(--atb-dose-ad-t)]";
  }
}

function badgeDose(regime: RegimeAtb | undefined, dfg: number | null, lang: Lang): string {
  if (!regime) return localiser(lang, "CHOIX REQUIS", "يلزم اختيار السياق");
  const resultat = resultatRegime(regime, dfg);
  if (!resultat) return localiser(lang, "AUCUNE DONNÉE", "لا توجد بيانات");
  if (resultat.status === "boundary-30") return localiser(lang, "LIMITE 30", "حدّ 30");
  if (resultat.status === "bloque") return nomType(resultat.contenu.type, lang).toLocaleUpperCase(lang === "ar" ? "ar-TN" : "fr-FR");
  if (resultat.status === "invalide") return localiser(lang, "SÉLECTION IMPOSSIBLE", "يتعذّر الاختيار");
  switch (resultat.segment.contenu.type) {
    case "aucune-donnee": return localiser(lang, "AUCUNE DONNÉE", "لا توجد بيانات");
    case "deconseille": return localiser(lang, "DÉCONSEILLÉ", "غير موصى به");
    case "contre-indique": return localiser(lang, "CONTRE-INDIQUÉ", "مضاد للاستطباب");
    case "note": return localiser(lang, "NOTE SOURCE", "ملاحظة مصدرية");
    case "surveillance-requise": return localiser(lang, "SURVEILLANCE REQUISE", "المراقبة مطلوبة");
    default: return resultat.segment.seuil === null ? localiser(lang, "STANDARD", "اعتيادية") : localiser(lang, "ADAPTÉ", "مكيّفة");
  }
}

function DetailRegime({ regime, dfg, lang }: { regime: RegimeAtb; dfg: number; lang: Lang }) {
  const selection = cellulePourDFG(regime, dfg);
  const segments = regime.regleRenale.type === "segments" ? regime.regleRenale.segments : [];
  const segmentActif = selection.status === "cellule-source" ? selection.segment : null;

  return (
    <div className="flex flex-col gap-3">
      {selection.status === "boundary-30" && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-[var(--atb-s5-l)] bg-[var(--atb-s5-bg)] p-3 text-sm font-bold text-[var(--atb-s5-t)]">
          <Ban className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{formatResultat(selection, lang).texte}</span>
        </p>
      )}
      {regime.regleRenale.type === "bloquee" ? (
        <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm font-bold">
          {nomType(regime.regleRenale.contenu.type)} : {regime.regleRenale.contenu.fr}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[520px] border-collapse text-start text-xs">
            <thead className="bg-surface2">
              <tr><th className="p-2">{localiser(lang, "Intervalle DFG (mL/min/1,73 m²)", "مجال DFG (مل/دقيقة/1.73 م²)")}</th><th className="p-2">{localiser(lang, "Texte source français", "نص المصدر بالفرنسية")}</th></tr>
            </thead>
            <tbody>
              {segments.map((segment, index) => {
                const intervalle = intervallePourSegmentDFG(segments, segment);
                const actif = segmentActif === segment;
                return (
                  <tr key={`${regime.id}-${index}`} className={`border-t border-line ${actif ? "bg-amber-500/15 font-black" : ""}`} aria-current={actif ? "true" : undefined}>
                    <td className="p-2 align-top font-bold" dir="ltr">{intervalle ? borneLabel(intervalle) : "Intervalle non disponible"}</td>
                    <td className="p-2 align-top"><bdi dir="ltr">{segment.contenu.fr}</bdi>{actif && <span className="ms-2 rounded-full bg-[var(--atb-primary-strong)] px-2 py-0.5 font-black text-[var(--atb-on-primary)]">{localiser(lang, "patient", "المريض")}</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="rounded-xl border border-line p-3 text-xs">
        <h4 className="font-black">{localiser(lang, "Seuils exacts de la ligne", "العتبات الدقيقة لهذا السطر")}</h4>
        {segments.length ? (
          <p className="mt-1" dir="ltr">{segments.flatMap((segment) => segment.seuil === null ? [] : [segment.seuil]).sort((a, b) => b - a).join(" · ") || localiser(lang, "Aucun seuil rénal", "لا توجد عتبات كلوية")}</p>
        ) : <p className="mt-1">{localiser(lang, "Aucun intervalle posologique n’est défini dans cette ligne source.", "لا يوجد مجال جرعات محدد في هذا السطر من المصدر.")}</p>}
        <p className="mt-2 opacity-75">{localiser(lang, "La borne appliquée est la convention E1 de l’outil ; l’opérateur des seuils intérieurs n’est pas imprimé dans le tableau source.", "الحد المطبّق هو اصطلاح E1 في الأداة؛ ولا يطبع الجدول المصدر علاقة المساواة عند العتبات الداخلية.")}</p>
        <p className="mt-1 opacity-75" dir="ltr">Source : {regime.source.document}, {regime.source.version}, p. {regime.source.page}, ligne {regime.source.ligneSource}.</p>
      </div>
    </div>
  );
}

function DetailDialog({ regime, dfg, lang, onClose }: { regime: RegimeAtb; dfg: number; lang: Lang; onClose: () => void }) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = dialog.querySelector<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    focusable?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
    ) ?? [])].filter((item) => !item.hasAttribute("disabled"));
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-2 sm:items-center" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="atb-v2-dialog-title"
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="atb-dialog max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--atb-line)] bg-[var(--surface)] p-4 shadow-2xl"
        onKeyDown={handleDialogKeyDown}
        tabIndex={-1}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 id="atb-v2-dialog-title" className="text-base font-black">{localiser(lang, "Détail de la ligne", "تفاصيل السطر")} — <bdi dir="ltr">{regime.indication} · {regime.voie}</bdi></h3>
            <p className="mt-1 text-xs opacity-75" dir="ltr">{localiser(lang, "DFG CKD-EPI brut", "DFG CKD-EPI الخام")}: {dfg.toLocaleString(lang === "ar" ? "ar-TN" : "fr-FR", { maximumFractionDigits: 4 })} mL/min/1,73 m²</p>
          </div>
          <button type="button" className="touch rounded-lg border border-[var(--atb-line)] px-3 py-2 text-sm font-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--atb-primary-strong)]" onClick={onClose} aria-label={localiser(lang, "Fermer le détail", "إغلاق التفاصيل")}>{localiser(lang, "Fermer", "إغلاق")}</button>
        </div>
        <DetailRegime regime={regime} dfg={dfg} lang={lang} />
      </section>
    </div>
  );
}

export default function AtbRenalV2Panel({
  dfg,
  clCrCg = null,
  eligible,
  active = ATB_RENAL_V2_ENABLED,
  reviewAvailable = false,
  lang = "fr",
  stageId = null,
  stageName = null,
}: {
  /** DFG CKD-EPI 2021 non arrondi déjà calculé par la page ; aucun recalcul ici. */
  dfg: number | null;
  /** ClCr Cockcroft–Gault informative : ne choisit jamais le segment. */
  clCrCg?: number | null;
  /** Garde-fous évalués par le calculateur existant. */
  eligible: boolean;
  /** Le drapeau central reste fermé ; ce mode ne s'offre qu'en développement. */
  active?: boolean;
  reviewAvailable?: boolean;
  lang?: Lang;
  stageId?: AtbStageId | null;
  stageName?: { fr: string; ar: string } | null;
}) {
  const [reviewMode, setReviewMode] = useState(false);
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<string | null>(null);
  const [medicamentId, setMedicamentId] = useState("");
  const [regimeId, setRegimeId] = useState("");
  const [highlightedMetric, setHighlightedMetric] = useState<"dfg" | "clcr">("dfg");
  const [dialogOpen, setDialogOpen] = useState(false);

  const matchingSearch = useMemo(() => {
    const terms = normaliser(query.trim()).split(/\s+/).filter(Boolean);
    return ATB_RENAL_V2_ROWS.filter((row) => {
      const section = ATB_RENAL_SECTIONS.find((item) => item.id === row.section);
      const haystack = normaliser([row.fr, row.ar, ...row.alias, section?.fr ?? "", section?.ar ?? ""].join(" "));
      return terms.every((term) => haystack.includes(term));
    });
  }, [query]);
  const medicaments = useMemo(
    () => matchingSearch.filter((row) => !section || row.section === section),
    [matchingSearch, section],
  );
  const medicament: AtbRenalDoseRow | undefined = ATB_RENAL_V2_ROWS.find((row) => row.id === medicamentId);
  const regime = medicament?.regimes.length === 1
    ? medicament.regimes[0]
    : medicament?.regimes.find((item) => item.id === regimeId);
  const detailedRegime = dialogOpen && regime && dfg !== null && eligible ? regime : null;
  const canShowV2 = active || reviewMode;

  const sectionCounts = useMemo(() => Object.fromEntries(ATB_RENAL_SECTIONS.map((item) => [
    item.id,
    matchingSearch.filter((row) => row.section === item.id).length,
  ])), [matchingSearch]);

  const selectionClass = (value: "dfg" | "clcr") => highlightedMetric === value
    ? "border-[var(--atb-primary-strong)] bg-[var(--atb-primary-strong)] text-[var(--atb-on-primary)]"
    : "border-[var(--atb-line)] bg-[var(--surface)] hover:border-[var(--atb-primary)]";
  const stageIndex = stageId ? (["normorenal", "legere", "moderee", "severe", "terminale"] as const).indexOf(stageId) + 1 : 0;

  return (
    <section className="atb-renal-review mx-auto flex w-full max-w-5xl flex-col gap-4 rounded-2xl border border-[var(--atb-line)] bg-[var(--surface)] p-4" aria-labelledby="atb-v2-title" dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--atb-primary-strong)] text-[var(--atb-on-primary)] shadow-sm"><Pill className="h-5 w-5" aria-hidden /></span>
          <div>
            <h2 id="atb-v2-title" className="text-lg font-black text-[var(--atb-ink)]">{localiser(lang, "ATB — fonction rénale", "المضادات الحيوية — الوظيفة الكلوية")}</h2>
            <p className="text-xs leading-relaxed opacity-80">{localiser(lang, "Adaptation des antibiotiques — adulte non dialysé · aperçu de revue V2", "تكييف المضادات الحيوية — راشد غير خاضع للغسيل · معاينة مراجعة V2")}</p>
          </div>
        </div>
        <span className="hidden rounded-full border border-[var(--atb-line)] bg-[var(--atb-soft)] px-3 py-1 text-xs font-bold text-[var(--atb-primary-strong)] sm:inline-flex">OMEDIT V2.3 · avril 2026</span>
        {reviewMode && <button type="button" className="touch min-h-11 rounded-full border border-[var(--atb-line)] px-3 py-2 text-xs font-black text-[var(--atb-primary-strong)]" onClick={() => { setReviewMode(false); setMedicamentId(""); setRegimeId(""); setDialogOpen(false); }}>{localiser(lang, "Fermer l’aperçu", "إغلاق المعاينة")}</button>}
      </header>
      <p className="rounded-xl border border-[var(--atb-dose-note-t)]/30 bg-[var(--atb-dose-note-bg)] p-3 text-xs font-bold leading-relaxed text-[var(--atb-dose-note-t)]">
        {localiser(lang, "Aperçu de travail non validé médicalement — ne pas utiliser pour prescrire. Le DFG CKD-EPI brut déjà calculé pilote la sélection ; la ClCr reste informative. Le médecin choisit l’antibiotique et l’indication/schéma. Le tableau historique reste la référence en production.", "معاينة عمل غير معتمدة طبياً — لا تستخدمها للوصف. يحدد DFG CKD-EPI الخام المحسوب مسبقاً الاختيار؛ وتبقى ClCr معلومة فقط. يختار الطبيب المضاد الحيوي والاستطباب/النظام. يظل الجدول الحالي مرجع الإنتاج.")}
      </p>

      {!canShowV2 ? (
        <div className="flex flex-col gap-2">
          <p role="status" className="rounded-xl border border-[var(--atb-e3-l)] bg-[var(--atb-e3-bg)] p-3 text-sm font-bold text-[var(--atb-e3-t)]">
            {localiser(lang, "Module non activé : les posologies V2 restent masquées en utilisation normale. L’ancien tableau demeure la source affichée.", "الوحدة غير مفعّلة: تبقى جرعات V2 مخفية في الاستخدام العادي، ويظل الجدول الحالي هو المعروض.")}
          </p>
          {reviewAvailable && (
            <button type="button" className="touch self-start rounded-full border border-[var(--atb-e3-l)] px-4 py-2 text-sm font-black text-[var(--atb-e3-t)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--atb-primary-strong)]" onClick={() => setReviewMode(true)}>
              {localiser(lang, "Ouvrir V2 pour revue — ne pas prescrire", "فتح V2 للمراجعة — لا تستخدم للوصف")}
            </button>
          )}
        </div>
      ) : !eligible || dfg === null || !Number.isFinite(dfg) ? (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-[var(--atb-s5-l)] bg-[var(--atb-s5-bg)] p-3 text-sm font-bold text-[var(--atb-s5-t)]">
          {dfg === null ? <Calculator className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <Stethoscope className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
          {localiser(lang, "Sélection suspendue : renseigner un patient adulte, une fonction rénale déclarée stable et des données valides ; aucune dose V2 n’est proposée dans les situations aiguës, pédiatriques ou sous dialyse.", "توقّف الاختيار: أدخل بيانات صحيحة لراشد بوظيفة كلوية مستقرة؛ لا تُعرض جرعات V2 في الحالات الحادة أو للأطفال أو عند الغسيل.")}
        </p>
      ) : (
        <>
          {reviewMode && (
            <p role="alert" className="flex items-start gap-2 rounded-xl border-2 border-[var(--atb-s5-l)] bg-[var(--atb-s5-bg)] p-3 text-sm font-black text-[var(--atb-s5-t)]">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              {localiser(lang, "MODE DE REVUE UNIQUEMENT — données non validées médicalement. Ne pas utiliser pour prescrire. Le tableau historique reste la référence jusqu’à la revue et à l’activation explicite.", "وضع المراجعة فقط — البيانات غير معتمدة طبياً. لا تستخدمها للوصف. يبقى الجدول الحالي مرجعاً إلى حين المراجعة والتفعيل الصريح.")}
            </p>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label={localiser(lang, "Valeurs rénales informatives", "قيم وظائف الكلى للمعلومة")}>
            <button type="button" aria-pressed={highlightedMetric === "dfg"} onClick={() => setHighlightedMetric("dfg")} className={`touch min-h-28 rounded-xl border-2 p-4 text-start ${selectionClass("dfg")} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--atb-primary-strong)]`}>
              <span className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wide">DFG CKD-EPI 2021 <span className="rounded-full bg-[var(--atb-primary-strong)] px-2 py-0.5 text-[10px] text-[var(--atb-on-primary)]">{localiser(lang, "sélecteur", "المُحدِّد")}</span></span>
              <bdi className="mt-1 block text-4xl font-bold tabular-nums" dir="ltr">{dfg.toLocaleString(lang === "ar" ? "ar-TN" : "fr-FR", { maximumFractionDigits: 2 })} <span className="text-sm font-bold">mL/min/1,73 m²</span></bdi>
              <span className="mt-1 block text-[11px] font-bold opacity-80">{localiser(lang, "Seule valeur qui pilote la sélection des segments.", "القيمة الوحيدة التي تحدد اختيار الفواصل.")}</span>
            </button>
            <button type="button" aria-pressed={highlightedMetric === "clcr"} onClick={() => setHighlightedMetric("clcr")} className={`touch min-h-28 rounded-xl border-2 p-4 text-start ${selectionClass("clcr")} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--atb-primary-strong)]`}>
              <span className="block text-xs font-black uppercase tracking-wide">Cockcroft–Gault</span>
              <bdi className="mt-1 block text-4xl font-bold tabular-nums" dir="ltr">{clCrCg !== null && clCrCg !== undefined && Number.isFinite(clCrCg) ? clCrCg.toLocaleString(lang === "ar" ? "ar-TN" : "fr-FR", { maximumFractionDigits: 2 }) : "—"} <span className="text-sm font-bold">mL/min</span></bdi>
              <span className="mt-1 block text-[11px] font-bold opacity-80">{localiser(lang, "ClCr — information RCP seulement", "ClCr — معلومة من النشرة فقط")}</span>
            </button>
          </div>
          {highlightedMetric === "clcr" && <p role="note" className="rounded-lg border border-[var(--atb-e3-l)] bg-[var(--atb-e3-bg)] p-2 text-xs font-bold text-[var(--atb-e3-t)]">{localiser(lang, "La ClCr Cockcroft–Gault ne choisit jamais une colonne du tableau DFG.", "لا تختار ClCr Cockcroft–Gault عموداً من جدول DFG أبداً.")}</p>}
          {stageName ? (
            <p role="status" aria-label={localiser(lang, "Stade rénal", "المرحلة الكلوية")} className="flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold" style={{ background: `var(--atb-s${stageIndex}-bg)`, color: `var(--atb-s${stageIndex}-t)`, borderColor: `var(--atb-s${stageIndex}-l)` }}>
              <Activity className="h-4 w-4" aria-hidden />
              <span>{localiser(lang, "Stade", "المرحلة")}: {localiser(lang, stageName.fr, stageName.ar)}</span>
              <bdi dir="ltr" className="tabular-nums">· {dfg >= 90 ? "≥ 90" : dfg >= 60 ? "60–89" : dfg > 30 ? "31–59" : dfg >= 15 ? "15–29" : "< 15"} mL/min/1,73 m²</bdi>
            </p>
          ) : dfg === 30 ? (
            <p role="alert" className="flex items-start gap-2 rounded-lg border border-[var(--atb-s5-l)] bg-[var(--atb-s5-bg)] px-3 py-2 text-sm font-bold text-[var(--atb-s5-t)]"><Ban className="h-4 w-4 shrink-0" aria-hidden />{localiser(lang, "DFG = 30 exact : le tableau source le place dans deux stades adjacents.", "DFG = 30 بالضبط: يضعه الجدول المصدر ضمن مرحلتين متجاورتين.")}</p>
          ) : null}

          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-xs font-black">
              {localiser(lang, "Rechercher un antibiotique", "البحث عن مضاد حيوي")}
              <span className="relative block">
                <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--atb-primary-strong)]" aria-hidden />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="field min-h-12 ps-10 text-base" aria-label={localiser(lang, "Rechercher un antibiotique (plusieurs mots acceptés)", "ابحث عن مضاد حيوي (يمكن إدخال عدة كلمات)")} placeholder={localiser(lang, "DCI ou nom commercial : augmentin, rocéphine…", "الاسم العلمي أو التجاري للمضاد الحيوي…")} />
              </span>
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-label={localiser(lang, "Filtrer par famille", "التصفية حسب العائلة")}>
              <button type="button" aria-pressed={section === null} onClick={() => setSection(null)} className={`touch min-h-11 rounded-full border px-3 py-1.5 text-xs font-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--atb-primary-strong)] ${section === null ? "border-[var(--atb-primary-strong)] bg-[var(--atb-primary-strong)] text-[var(--atb-on-primary)]" : "border-[var(--atb-line)] text-[var(--fg)]"}`}>
                {localiser(lang, `Toutes (${matchingSearch.length})`, `الكل (${matchingSearch.length})`)}
              </button>
              {ATB_RENAL_SECTIONS.map((item) => (
                <button key={item.id} type="button" aria-pressed={section === item.id} onClick={() => setSection(section === item.id ? null : item.id)} className={`touch min-h-11 rounded-full border px-3 py-1.5 text-xs font-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--atb-primary-strong)] ${section === item.id ? "border-[var(--atb-primary-strong)] bg-[var(--atb-primary-strong)] text-[var(--atb-on-primary)]" : "border-[var(--atb-line)] text-[var(--fg)]"}`}>
                  {lang === "ar" ? item.ar : item.fr} ({sectionCounts[item.id] ?? 0})
                </button>
              ))}
            </div>
            <label className="flex flex-col gap-1 text-xs font-black">
              {localiser(lang, "Antibiotique — choix du médecin", "المضاد الحيوي — يختاره الطبيب")}
              <select
                className="field"
                value={medicamentId}
                aria-label={localiser(lang, "Antibiotique — choix du médecin", "المضاد الحيوي — يختاره الطبيب")}
                onChange={(event) => { setMedicamentId(event.target.value); setRegimeId(""); setDialogOpen(false); }}
              >
                <option value="">{localiser(lang, "Choisir un antibiotique…", "اختر مضاداً حيوياً…")}</option>
                {medicaments.map((row) => <option key={row.id} value={row.id}>{lang === "ar" ? row.ar : row.fr}</option>)}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label={localiser(lang, "Antibiotiques trouvés", "المضادات الحيوية الموجودة")}>
            {medicaments.map((row) => {
              const singleRegime = row.regimes.length === 1 ? row.regimes[0] : undefined;
              const cardSelection = singleRegime ? resultatRegime(singleRegime, dfg) : null;
              const cardText = cardSelection
                ? formatResultat(cardSelection, lang).texte
                : row.regimes.length > 1
                  ? localiser(lang, `${row.regimes.length} schémas distincts — choix du médecin requis`, `${row.regimes.length} أنظمة مختلفة — يلزم اختيار الطبيب`)
                  : localiser(lang, "Notes conservées ; aucun régime posologique distinct", "ملاحظات محفوظة؛ لا يوجد نظام جرعات منفصل");
              const selected = medicamentId === row.id;
              const seuils = row.regimes.flatMap((item) => item.regleRenale.type === "segments" ? item.regleRenale.segments.flatMap((segment) => segment.seuil === null ? [] : [segment.seuil]) : []);
              const seuilHaut = seuils.length ? Math.max(...seuils) : null;
              return (
                <article key={row.id} className={`flex flex-col gap-2 rounded-2xl border p-3 shadow-sm ${selected ? "ring-2 ring-[var(--atb-primary-strong)]" : ""} ${styleDose(singleRegime, dfg)}`}>
                  <button type="button" onClick={() => { setMedicamentId(row.id); setRegimeId(""); setDialogOpen(false); }} aria-pressed={selected} className="w-full text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--atb-primary-strong)]">
                    <span className="flex flex-wrap items-start justify-between gap-2">
                      <span className="flex items-center gap-2 font-black"><Pill className="h-4 w-4 shrink-0 text-[var(--atb-primary-strong)]" aria-hidden />{lang === "ar" ? row.ar : row.fr}</span>
                      <span className="flex flex-wrap items-center gap-1.5">
                        {row.surveillance && <span className="inline-flex items-center gap-1 rounded-full border border-[var(--atb-e3-l)] bg-[var(--atb-dose-note-bg)] px-2 py-1 text-[10px] font-black text-[var(--atb-dose-note-t)]"><AlertTriangle className="h-3 w-3" aria-hidden />{localiser(lang, "Surveillance plasmatique", "مراقبة التركيز في البلازما")}</span>}
                        <span className="inline-flex items-center gap-1 rounded-full border border-current/30 px-2 py-1 text-[10px] font-black">
                          {cardSelection?.status === "boundary-30" && <Ban className="h-3 w-3" aria-hidden />}
                          {cardSelection?.status === "bloque" && <ShieldAlert className="h-3 w-3" aria-hidden />}
                          {cardSelection?.status === "cellule-source" && cardSelection.segment.contenu.type === "aucune-donnee" && <HelpCircle className="h-3 w-3" aria-hidden />}
                          {cardSelection?.status === "cellule-source" && cardSelection.segment.contenu.type === "contre-indique" && <Ban className="h-3 w-3" aria-hidden />}
                          {cardSelection?.status === "cellule-source" && cardSelection.segment.contenu.type === "deconseille" && <ShieldAlert className="h-3 w-3" aria-hidden />}
                          {row.regimes.length > 1 ? localiser(lang, "CHOIX REQUIS", "يلزم الاختيار") : row.regimes.length === 0 ? localiser(lang, "NOTE SOURCE", "ملاحظة مصدرية") : badgeDose(singleRegime, dfg, lang)}
                        </span>
                        {row.traductionStatut === "ar-provisoire" && <span className="rounded-full border border-[var(--atb-e3-l)] px-2 py-1 text-[10px] font-bold">{localiser(lang, "Traduction AR en relecture", "ترجمة قيد المراجعة")}</span>}
                        {row.traductionStatut === "fr-seul" && <span className="rounded-full border border-[var(--atb-dose-nd-l)] px-2 py-1 text-[10px] font-bold">{localiser(lang, "Non traduit (AR)", "غير مترجم بعد")}</span>}
                      </span>
                    </span>
                    {seuilHaut !== null && <span className="mt-2 inline-flex rounded-full bg-[var(--atb-soft)] px-2 py-0.5 text-[11px] font-bold text-[var(--atb-primary-strong)]">{localiser(lang, `Adaptation dès DFG < ${seuilHaut}`, `التكييف ابتداءً من DFG < ${seuilHaut}`)}</span>}
                    {cardSelection?.status === "cellule-source" && cardSelection.limiteExacte && <div className="mt-2 text-start"><LimiteExacteChip limite={cardSelection.limiteExacte} intervalle={intervalleE3(cardSelection.intervalle)} lang={lang} /></div>}
                    <span className="mt-2 block whitespace-pre-wrap text-[15px] font-bold leading-snug"><bdi dir="ltr">{cardText}</bdi></span>
                    <span className="mt-1 block text-[11px] font-medium opacity-75">{ATB_RENAL_SECTIONS.find((item) => item.id === row.section)?.[lang] ?? ""}</span>
                  </button>
                  {singleRegime && <button type="button" className="touch inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-[var(--atb-line)] px-3 py-2 text-xs font-black text-[var(--atb-primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--atb-primary-strong)]" onClick={() => { setMedicamentId(row.id); setRegimeId(""); setDialogOpen(true); }}><Eye className="h-4 w-4" aria-hidden />{localiser(lang, "Détail", "التفاصيل")}</button>}
                </article>
              );
            })}
            {medicaments.length === 0 && <p role="status" className="rounded-xl border border-[var(--atb-line)] p-3 text-sm">{localiser(lang, `Aucun antibiotique ne correspond à « ${query} ».`, `لا يوجد مضاد حيوي يطابق « ${query} ».`)}</p>}
          </div>

          {medicament && (
            <section className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-3" aria-label="Antibiotique sélectionné">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-black">{lang === "ar" ? medicament.ar : medicament.fr}</h3>
                {regime && <button type="button" className="touch inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--atb-line)] px-3 py-1.5 text-xs font-black text-[var(--atb-primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--atb-primary-strong)]" onClick={() => setDialogOpen(true)}><Eye className="h-4 w-4" aria-hidden />{localiser(lang, "Détails des seuils", "تفاصيل العتبات")}</button>}
              </div>
              {medicament.traductionStatut === "ar-provisoire" && (
                <p role="note" className="rounded-xl border border-[var(--atb-e3-l)] bg-[var(--atb-dose-note-bg)] p-2 text-xs font-bold text-[var(--atb-dose-note-t)]">
                  {localiser(lang, "Traduction arabe provisoire, en attente de relecture humaine ; seul le texte français de la source est affiché.", "الترجمة العربية مؤقتة وبانتظار المراجعة البشرية؛ يُعرض نص المصدر الفرنسي فقط.")}
                </p>
              )}
              {medicament.traductionStatut === "fr-seul" && (
                <p role="note" className="rounded-xl border border-[var(--atb-dose-nd-l)] bg-[var(--atb-dose-nd-bg)] p-2 text-xs font-bold">
                  {localiser(lang, "Texte français uniquement — traduction arabe non disponible.", "النص الفرنسي فقط — لا تتوفر ترجمة عربية.")}
                </p>
              )}
              {medicament.regimes.length > 1 && (
                <label className="flex flex-col gap-1 text-xs font-black">
                  {localiser(lang, "Indication / schéma — choix du médecin obligatoire", "الاستطباب/النظام — يختاره الطبيب إلزامياً")}
                  <select className="field" value={regimeId} onChange={(event) => setRegimeId(event.target.value)} aria-label={localiser(lang, "Indication et schéma — choix du médecin", "الاستطباب والنظام — يختاره الطبيب")}>
                    <option value="">{localiser(lang, "Choisir l’indication ou le schéma…", "اختر الاستطباب أو النظام…")}</option>
                    {medicament.regimes.map((item) => (
                      <option key={item.id} value={item.id}>{item.indication} · {item.voie} · {item.source.ligneSource}</option>
                    ))}
                  </select>
                </label>
              )}
              {medicament.surveillance && (
                <p role="note" className="flex items-start gap-2 rounded-xl border border-[var(--atb-e3-l)] bg-[var(--atb-dose-note-bg)] p-2 text-xs font-bold text-[var(--atb-dose-note-t)]">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {localiser(lang, "Surveillance plasmatique / thérapeutique requise selon la source. Cette sélection ne calcule ni ne remplace le monitorage.", "المراقبة العلاجية/البلازمية مطلوبة وفق المصدر. لا يحسب هذا الاختيار المراقبة ولا يحل محلها.")}
                </p>
              )}
              {medicament.sourceNotes.map((note, index) => (
                <p key={index} className="rounded-xl border border-[var(--atb-e3-l)] bg-[var(--atb-dose-note-bg)] p-2 text-xs leading-relaxed text-[var(--atb-dose-note-t)]">{localiser(lang, "Note source :", "ملاحظة من المصدر:")} <bdi dir="ltr">{note.fr}</bdi></p>
              ))}
              {medicament.regimes.length === 0 && (
                <p role="note" className="rounded-xl border border-[var(--atb-dose-nd-l)] bg-[var(--atb-dose-nd-bg)] p-2 text-sm font-bold text-[var(--atb-dose-nd-t)]">
                  {localiser(lang, "Aucun régime rénal de dose n’est transcrit pour ce médicament ; les notes source ne sont pas des doses.", "لا يوجد نظام جرعات كلوية منقول لهذا الدواء؛ ملاحظات المصدر ليست جرعات.")}
                </p>
              )}
              {medicament.regimes.length > 1 && !regime && (
                <p role="status" className="text-xs font-bold opacity-75">{localiser(lang, "Choisissez le contexte médical applicable. Aucun schéma n’est sélectionné par défaut.", "اختر السياق الطبي المناسب. لا يُختار أي نظام تلقائياً.")}</p>
              )}
              {regime && <LigneSelection regime={regime} dfg={dfg} lang={lang} />}
            </section>
          )}

          <p className="flex items-start gap-2 rounded-xl border border-[var(--atb-e3-l)] bg-[var(--atb-dose-note-bg)] p-3 text-xs font-bold leading-relaxed text-[var(--atb-dose-note-t)]">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {localiser(lang, "Avertissement : ces textes reprennent une source de synthèse et ne remplacent pas le RCP de la spécialité prescrite. Vérifier les doses, le contexte infectieux et les protocoles locaux avec un médecin/pharmacien ; outil non validé pour prescrire.", "تنبيه: تنقل هذه النصوص عن مصدر تلخيصي ولا تعوّض النشرة الرسمية للمستحضر الموصوف. تحقّق من الجرعات والسياق الإنتاني والبروتوكولات المحلية مع طبيب أو صيدلي؛ الأداة غير معتمدة للوصف.")}
          </p>
        </>
      )}

      <footer className="flex flex-col gap-2 rounded-xl border border-[var(--atb-e3-l)] bg-[var(--atb-dose-note-bg)] p-3 text-xs leading-relaxed text-[var(--atb-dose-note-t)]">
        <p className="flex items-start gap-2 font-bold"><Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{localiser(lang, "Outil d’aide à la décision, non validé pour prescrire. Les textes reprennent le tableau OMEDIT V2.3 et ne remplacent pas le RCP de la spécialité ni une validation locale tunisienne.", "أداة مساعدة على القرار وغير معتمدة للوصف. تنقل النصوص عن جدول OMEDIT V2.3 ولا تعوّض نشرة المستحضر أو المراجعة المحلية التونسية.")}</p>
        <p>{localiser(lang, "Abréviations : DFG, ClCr, IM, IV, PO, DC, TDM.", "الاختصارات: DFG، ClCr، IM، IV، PO، DC، TDM.")}</p>
        <p className="font-medium">{localiser(lang, "Sources : OMEDIT Pays de la Loire V2.3 ; RCP individuel à vérifier ; GPR / ePOPI cités par le tableau. Le statut d’AMM ou une fiche produit ne prouve pas la disponibilité locale.", "المصادر: OMEDIT Pays de la Loire V2.3؛ يجب مراجعة النشرة الرسمية لكل مستحضر؛ ويذكر الجدول GPR وePOPI. لا تثبت رخصة التسويق أو بطاقة المنتج توفره محلياً.")}</p>
      </footer>
      <details className="rounded-xl border border-[var(--atb-line)] bg-[var(--surface)] p-2 text-xs leading-relaxed">
        <summary className="cursor-pointer font-black">{localiser(lang, "Note de traçabilité de l’audit", "ملاحظة تتبع التدقيق")}</summary>
        <p className="mt-2">
          {localiser(lang, "Le document V5.1 annonce 184 frontières interpolées. Le recomptage indépendant retrouve 198 observations de frontières internes sur 129 lignes sources et 327 cellules ; ce chiffre 184 n’est pas reproductible à partir des fichiers disponibles. Le rapport détaille les différences de méthode. Ce constat ne valide aucune dose.", "يذكر مستند V5.1 عدد 184 حداً مستوفى. أعاد التدقيق المستقل عدّ 198 ملاحظة لحدود داخلية ضمن 129 سطراً مصدرياً و327 خلية؛ ولم يمكن إعادة إنتاج رقم 184 من الملفات المتاحة. يشرح التقرير اختلاف طريقة العدّ. ولا يثبت ذلك صحة أي جرعة.")}
        </p>
      </details>
      {detailedRegime && dfg !== null && <DetailDialog regime={detailedRegime} dfg={dfg} lang={lang} onClose={() => setDialogOpen(false)} />}
    </section>
  );
}

function intervalleE3(intervalle: IntervalleDfg): string {
  const min = intervalle.borneBasse.valeur;
  const max = intervalle.borneHaute.valeur;
  if (min === null && max === null) return "DFG ≥ 0";
  if (min === null) return `DFG < ${max}`;
  if (max === null) return `${min} ≤ DFG`;
  return `${min} ≤ DFG < ${max}`;
}

function LimiteExacteChip({ limite, intervalle, lang }: { limite: LimiteExacteAtb; intervalle: string; lang: Lang }) {
  const brut = limite.dfgBrut.toLocaleString(lang === "ar" ? "ar-TN" : "fr-FR", { maximumFractionDigits: 6 });
  const affiche = limite.dfgAffiche.toLocaleString(lang === "ar" ? "ar-TN" : "fr-FR");
  const seuil = limite.seuil.toLocaleString(lang === "ar" ? "ar-TN" : "fr-FR");
  return (
    <div role="note" className="rounded-lg border border-[var(--atb-e3-l)] bg-[var(--atb-e3-bg)] p-2.5 text-[11px] leading-snug text-[var(--atb-e3-t)]">
      <p className="flex items-center gap-1.5 font-black"><Info className="h-3.5 w-3.5" aria-hidden />{localiser(lang, "Limite exacte", "حدّ دقيق")}</p>
      <p className="mt-1">
        {lang === "ar"
          ? `DFG المحسوب الخام ${brut}، المعروض ${affiche} = عتبة هذا السطر ${seuil}. المطبّق: `
          : `DFG brut calculé ${brut}, affiché ${affiche} = seuil de cette ligne ${seuil}. Appliqué : `}
        <bdi dir="ltr" className="font-black">{intervalle}</bdi>
        {localiser(lang, " (convention de borne haute ; le tableau source ne précise pas l’opérateur). La sélection se fait sur le DFG brut.", " (اصطلاح الحدّ الأعلى؛ لا يحدّد الجدول المصدر العلاقة عند المساواة). يعتمد الاختيار على DFG الخام.")}
      </p>
      {limite.segmentInferieur && <p className="mt-1">{localiser(lang, "Régime inférieur adjacent, à titre indicatif :", "النظام الأدنى المجاور، للمعلومة فقط:")} <bdi dir="ltr">« {limite.segmentInferieur.contenu.fr} »</bdi></p>}
      <p className="mt-1 font-bold">{localiser(lang, "Certains RCP écrivent « ≤ seuil » (ex. céfépime ≤ 50 mL/min) — vérifier le RCP de la spécialité prescrite.", "تذكر بعض النشرات «≤ العتبة» — راجع نشرة المستحضر الموصوف.")}</p>
    </div>
  );
}

function LigneSelection({ regime, dfg, lang }: { regime: RegimeAtb; dfg: number; lang: Lang }) {
  const resultat = useMemo(() => cellulePourDFG(regime, dfg), [regime, dfg]);
  const sortie = formatResultat(resultat, lang);
  const source = resultat.status === "invalide" ? regime.source : resultat.source;
  const intervalle = resultat.status === "cellule-source" ? borneLabel(resultat.intervalle) : null;
  const intervalleLimite = resultat.status === "cellule-source" ? intervalleE3(resultat.intervalle) : null;
  const limite = resultat.status === "cellule-source" ? resultat.limiteExacte : null;

  return (
    <section aria-live="polite" className="rounded-2xl border border-[var(--atb-line)] bg-[var(--surface)] p-3" data-testid="atb-v2-result">
      {limite && intervalleLimite && <div className="mb-3"><LimiteExacteChip limite={limite} intervalle={intervalleLimite} lang={lang} /></div>}
      {resultat.status === "boundary-30" && <p role="alert" className="mb-2 flex items-start gap-2 rounded-lg border border-[var(--atb-s5-l)] bg-[var(--atb-s5-bg)] px-3 py-2 text-sm font-bold text-[var(--atb-s5-t)]"><Ban className="h-4 w-4 shrink-0" aria-hidden />{sortie.texte}</p>}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-black">{sortie.titre}</h3>
        {intervalle && <span className="rounded-full border border-[var(--atb-line)] px-2.5 py-1 text-xs font-bold" dir="ltr">{intervalle}</span>}
      </div>
      <p className={`mt-2 whitespace-pre-wrap text-[15px] font-bold leading-snug ${sortie.alerte ? "text-[var(--atb-e3-t)]" : ""}`}>
        <bdi dir="ltr">{resultat.status === "boundary-30" ? "" : sortie.texte}</bdi>
      </p>
      <p className="mt-2 text-xs opacity-70" dir="ltr">
        {localiser(lang, "Source", "المصدر")}: {source.document}, {source.version}, p. {source.page}, ligne {source.ligneSource}.
      </p>
    </section>
  );
}

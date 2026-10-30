"use client";

import { useMemo, useState } from "react";
import { ATB_RENAL_SECTIONS } from "@/data/atb-renal";
import { ATB_RENAL_V2_ENABLED, ATB_RENAL_V2_ROWS, type AtbRenalDoseRow } from "@/data/atb-renal-v2";
import {
  cellulePourDFG,
  intervallePourSegmentDFG,
  type IntervalleDfg,
  type RegimeAtb,
  type ResultatSelectionAtb,
} from "@/lib/atb-renal-dose";

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

function nomType(type: string): string {
  switch (type) {
    case "dose-source": return "Texte posologique de la source";
    case "note": return "Note de la source — pas une dose";
    case "aucune-donnee": return "Aucune donnée posologique dans cette cellule";
    case "deconseille": return "Déconseillé selon la source";
    case "contre-indique": return "Contre-indiqué selon la source";
    case "surveillance-requise": return "Surveillance thérapeutique requise";
    default: return "Contenu source";
  }
}

function formatResultat(resultat: ResultatSelectionAtb): { titre: string; texte: string; alerte: boolean } {
  if (resultat.status === "boundary-30") {
    return {
      titre: "Sélection suspendue à la limite de 30 mL/min",
      texte: `DFG = 30 : le tableau source place 30 dans les stades modéré et sévère. Aucun stade ni dose n'est choisi automatiquement. Vérifier le PDF original et faire valider le stade par un médecin/pharmacien. Cette ligne comporte un seuil 30 ; refus E2 pour |DFG − 30| ≤ 0,000001 (DFG calculé : ${resultat.dfgBrut.toLocaleString("fr-FR", { maximumFractionDigits: 6 })}).`,
      alerte: true,
    };
  }
  if (resultat.status === "bloque") {
    return { titre: nomType(resultat.contenu.type), texte: resultat.contenu.fr, alerte: true };
  }
  if (resultat.status === "invalide") {
    return { titre: "Sélection impossible", texte: "Le DFG ou la structure de cette ligne ne permet pas une sélection fiable.", alerte: true };
  }
  return {
    titre: nomType(resultat.segment.contenu.type),
    texte: resultat.segment.contenu.fr,
    alerte: resultat.segment.contenu.type !== "dose-source",
  };
}

function resultatRegime(regime: RegimeAtb, dfg: number | null): ResultatSelectionAtb | null {
  return dfg === null || !Number.isFinite(dfg) ? null : cellulePourDFG(regime, dfg);
}

function styleDose(regime: RegimeAtb | undefined, dfg: number | null): string {
  if (!regime) return "border-blue-500/30 bg-blue-500/5";
  const resultat = resultatRegime(regime, dfg);
  if (!resultat) return "border-line bg-surface";
  if (resultat.status === "boundary-30" || resultat.status === "bloque" || resultat.status === "invalide") return "border-amber-500/50 bg-amber-500/10";
  switch (resultat.segment.contenu.type) {
    case "contre-indique": return "border-red-500/50 bg-red-500/10";
    case "deconseille": return "border-orange-500/50 bg-orange-500/10";
    case "aucune-donnee":
    case "note": return "border-slate-500/40 bg-slate-500/10";
    case "surveillance-requise": return "border-amber-500/50 bg-amber-500/10";
    default: return resultat.segment.seuil === null ? "border-emerald-500/40 bg-emerald-500/5" : "border-blue-500/40 bg-blue-500/5";
  }
}

function badgeDose(regime: RegimeAtb | undefined, dfg: number | null): string {
  if (!regime) return "CHOIX REQUIS";
  const resultat = resultatRegime(regime, dfg);
  if (!resultat) return "AUCUNE DONNÉE";
  if (resultat.status === "boundary-30") return "LIMITE 30";
  if (resultat.status === "bloque") return nomType(resultat.contenu.type).toLocaleUpperCase("fr-FR");
  if (resultat.status === "invalide") return "SÉLECTION IMPOSSIBLE";
  switch (resultat.segment.contenu.type) {
    case "aucune-donnee": return "AUCUNE DONNÉE";
    case "deconseille": return "DÉCONSEILLÉ";
    case "contre-indique": return "CONTRE-INDIQUÉ";
    case "note": return "NOTE SOURCE";
    case "surveillance-requise": return "SURVEILLANCE REQUISE";
    default: return resultat.segment.seuil === null ? "STANDARD" : "ADAPTÉ";
  }
}

function DetailRegime({ regime, dfg }: { regime: RegimeAtb; dfg: number }) {
  const selection = cellulePourDFG(regime, dfg);
  const segments = regime.regleRenale.type === "segments" ? regime.regleRenale.segments : [];
  const segmentActif = selection.status === "cellule-source" ? selection.segment : null;

  return (
    <div className="flex flex-col gap-3">
      {selection.status === "boundary-30" && (
        <p role="alert" className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 text-sm font-bold">
          {formatResultat(selection).texte}
        </p>
      )}
      {regime.regleRenale.type === "bloquee" ? (
        <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm font-bold">
          {nomType(regime.regleRenale.contenu.type)} : {regime.regleRenale.contenu.fr}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[520px] border-collapse text-left text-xs">
            <thead className="bg-surface2">
              <tr><th className="p-2">Intervalle DFG (mL/min/1,73 m²)</th><th className="p-2">Texte source français</th></tr>
            </thead>
            <tbody>
              {segments.map((segment, index) => {
                const intervalle = intervallePourSegmentDFG(segments, segment);
                const actif = segmentActif === segment;
                return (
                  <tr key={`${regime.id}-${index}`} className={`border-t border-line ${actif ? "bg-amber-500/15 font-black" : ""}`} aria-current={actif ? "true" : undefined}>
                    <td className="p-2 align-top font-bold" dir="ltr">{intervalle ? borneLabel(intervalle) : "Intervalle non disponible"}</td>
                    <td className="p-2 align-top"><bdi dir="ltr">{segment.contenu.fr}</bdi>{actif && <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 font-black">DFG patient</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="rounded-xl border border-line p-3 text-xs">
        <h4 className="font-black">Seuils exacts de la ligne</h4>
        {segments.length ? (
          <p className="mt-1" dir="ltr">{segments.flatMap((segment) => segment.seuil === null ? [] : [segment.seuil]).sort((a, b) => b - a).join(" · ") || "Aucun seuil rénal"}</p>
        ) : <p className="mt-1">Aucun intervalle posologique n’est défini dans cette ligne source.</p>}
        <p className="mt-2 opacity-75">La borne appliquée est la convention E1 de l’outil ; l’opérateur des seuils intérieurs n’est pas imprimé dans le tableau source.</p>
        <p className="mt-1 opacity-75">Source : {regime.source.document}, {regime.source.version}, p. {regime.source.page}, ligne {regime.source.ligneSource}.</p>
      </div>
    </div>
  );
}

function DetailDialog({ regime, dfg, onClose }: { regime: RegimeAtb; dfg: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-2 sm:items-center" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="atb-v2-dialog-title"
        className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-surface p-4 shadow-2xl"
        onKeyDown={(event) => { if (event.key === "Escape") onClose(); }}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 id="atb-v2-dialog-title" className="text-base font-black">Détail de la ligne — {regime.indication} · {regime.voie}</h3>
            <p className="mt-1 text-xs opacity-75" dir="ltr">DFG CKD-EPI brut : {dfg.toLocaleString("fr-FR", { maximumFractionDigits: 4 })} mL/min/1,73 m²</p>
          </div>
          <button type="button" className="rounded-lg border border-line px-3 py-2 text-sm font-black" onClick={onClose} aria-label="Fermer le détail">Fermer</button>
        </div>
        <DetailRegime regime={regime} dfg={dfg} />
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
      const sectionName = ATB_RENAL_SECTIONS.find((item) => item.id === row.section)?.fr ?? "";
      const haystack = normaliser([row.fr, ...row.alias, sectionName].join(" "));
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
    ? "border-blue-600 bg-blue-600 text-white"
    : "border-line bg-surface hover:bg-surface2";

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-3" aria-labelledby="atb-v2-title">
      <div>
        <h2 id="atb-v2-title" className="text-base font-black">Adaptation rénale continue — version de travail V2</h2>
        <p className="mt-1 text-xs leading-relaxed opacity-80">
          Interface en français. La V2 utilise le DFG CKD-EPI non arrondi déjà calculé par cette page ; elle ne modifie pas le calcul rénal.
          Le médecin choisit l’antibiotique et, si plusieurs lignes existent, son indication/schéma. Le stade manuel de l’ancien tableau n’intervient pas ici.
        </p>
      </div>

      {!canShowV2 ? (
        <div className="flex flex-col gap-2">
          <p role="status" className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm font-bold">
            Module non activé : les posologies V2 restent masquées en utilisation normale. L’ancien tableau demeure la source affichée.
          </p>
          {reviewAvailable && (
            <button type="button" className="self-start rounded-full border border-amber-500/50 px-3 py-2 text-xs font-black" onClick={() => setReviewMode(true)}>
              Ouvrir V2 pour revue — ne pas prescrire
            </button>
          )}
        </div>
      ) : !eligible || dfg === null || !Number.isFinite(dfg) ? (
        <p role="alert" className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm font-bold">
          Sélection suspendue : renseigner un patient adulte, une fonction rénale déclarée stable et des données valides ; aucune dose V2 n’est proposée dans les situations aiguës, pédiatriques ou sous dialyse.
        </p>
      ) : (
        <>
          {reviewMode && (
            <p role="alert" className="rounded-xl border-2 border-amber-600 bg-amber-500/15 p-3 text-sm font-black">
              MODE DE REVUE UNIQUEMENT — données non validées médicalement. Ne pas utiliser pour prescrire. Le tableau historique reste la référence jusqu’à la revue et à l’activation explicite.
            </p>
          )}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label="Valeurs rénales informatives">
            <button type="button" aria-pressed={highlightedMetric === "dfg"} onClick={() => setHighlightedMetric("dfg")} className={`rounded-xl border p-3 text-left text-xs ${selectionClass("dfg")}`}>
              <span className="block font-black">DFG CKD-EPI — sélecteur</span>
              <bdi className="mt-1 block text-sm font-black" dir="ltr">{dfg.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} mL/min/1,73 m²</bdi>
            </button>
            <button type="button" aria-pressed={highlightedMetric === "clcr"} onClick={() => setHighlightedMetric("clcr")} className={`rounded-xl border p-3 text-left text-xs ${selectionClass("clcr")}`}>
              <span className="block font-black">ClCr Cockcroft–Gault — information seulement</span>
              <bdi className="mt-1 block text-sm font-black" dir="ltr">{clCrCg !== null && clCrCg !== undefined && Number.isFinite(clCrCg) ? `${clCrCg.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} mL/min` : "Non disponible"}</bdi>
              <span className="mt-1 block">Ne modifie jamais la sélection des segments.</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex flex-col gap-1 text-xs font-black">
              Rechercher un antibiotique (plusieurs mots acceptés)
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="field" aria-label="Rechercher un antibiotique" placeholder="Ex. amoxicilline IV…" />
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Familles d’antibiotiques">
              <button type="button" aria-pressed={section === null} onClick={() => setSection(null)} className={`rounded-full border px-3 py-1.5 text-xs font-black ${section === null ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
                Toutes ({matchingSearch.length})
              </button>
              {ATB_RENAL_SECTIONS.map((item) => (
                <button key={item.id} type="button" aria-pressed={section === item.id} onClick={() => setSection(section === item.id ? null : item.id)} className={`rounded-full border px-3 py-1.5 text-xs font-black ${section === item.id ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
                  {item.fr} ({sectionCounts[item.id] ?? 0})
                </button>
              ))}
            </div>
            <label className="flex flex-col gap-1 text-xs font-black">
              Antibiotique — choix du médecin
              <select
                className="field"
                value={medicamentId}
                aria-label="Antibiotique — choix du médecin"
                onChange={(event) => { setMedicamentId(event.target.value); setRegimeId(""); setDialogOpen(false); }}
              >
                <option value="">Choisir un antibiotique…</option>
                {medicaments.map((row) => <option key={row.id} value={row.id}>{row.fr}</option>)}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label="Antibiotiques trouvés">
            {medicaments.map((row) => {
              const singleRegime = row.regimes.length === 1 ? row.regimes[0] : undefined;
              const cardSelection = singleRegime ? resultatRegime(singleRegime, dfg) : null;
              const cardText = cardSelection ? formatResultat(cardSelection).texte : row.regimes.length > 1 ? `${row.regimes.length} schémas distincts — choix du médecin requis` : "Notes conservées ; aucun régime posologique distinct";
              const selected = medicamentId === row.id;
              return (
                <article key={row.id} className={`rounded-2xl border p-3 ${selected ? "ring-2 ring-blue-500" : ""} ${styleDose(singleRegime, dfg)}`}>
                  <button type="button" onClick={() => { setMedicamentId(row.id); setRegimeId(""); setDialogOpen(false); }} aria-pressed={selected} className="w-full text-left">
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-black">{row.fr}</span>
                      <span className="flex flex-wrap items-center gap-1.5">
                        {row.surveillance && <span className="rounded-full border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 text-[10px] font-black">SURVEILLANCE PLASMATIQUE REQUISE</span>}
                        <span className="rounded-full border border-current/30 px-2 py-0.5 text-[10px] font-black">{row.regimes.length > 1 ? "CHOIX REQUIS" : row.regimes.length === 0 ? "NOTE SOURCE" : badgeDose(singleRegime, dfg)}</span>
                      </span>
                    </span>
                    <span className="mt-2 block whitespace-pre-wrap text-xs leading-relaxed">{cardText}</span>
                  </button>
                </article>
              );
            })}
            {medicaments.length === 0 && <p role="status" className="rounded-xl border border-line p-3 text-sm">Aucun antibiotique ne correspond à cette recherche.</p>}
          </div>

          {medicament && (
            <section className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-3" aria-label="Antibiotique sélectionné">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-black">{medicament.fr}</h3>
                {regime && <button type="button" className="rounded-full border border-line px-3 py-1.5 text-xs font-black" onClick={() => setDialogOpen(true)}>Détails des seuils</button>}
              </div>
              {medicament.traductionStatut === "ar-provisoire" && (
                <p role="note" className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-2 text-xs font-bold">
                  Traduction arabe provisoire, en attente de relecture humaine ; seul le texte français de la source est affiché.
                </p>
              )}
              {medicament.traductionStatut === "fr-seul" && (
                <p role="note" className="rounded-xl border border-line bg-surface p-2 text-xs font-bold">
                  Texte français uniquement — traduction arabe non disponible.
                </p>
              )}
              {medicament.regimes.length > 1 && (
                <label className="flex flex-col gap-1 text-xs font-black">
                  Indication / schéma — choix du médecin obligatoire
                  <select className="field" value={regimeId} onChange={(event) => setRegimeId(event.target.value)} aria-label="Indication et schéma — choix du médecin">
                    <option value="">Choisir l’indication ou le schéma…</option>
                    {medicament.regimes.map((item) => (
                      <option key={item.id} value={item.id}>{item.indication} · {item.voie} · {item.source.ligneSource}</option>
                    ))}
                  </select>
                </label>
              )}
              {medicament.surveillance && (
                <p role="note" className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-2 text-xs font-bold">
                  Surveillance plasmatique / thérapeutique requise selon la source. Cette sélection ne calcule ni ne remplace le monitorage.
                </p>
              )}
              {medicament.sourceNotes.map((note, index) => (
                <p key={index} className="rounded-xl border border-line bg-surface p-2 text-xs leading-relaxed">Note source : {note.fr}</p>
              ))}
              {medicament.regimes.length === 0 && (
                <p role="note" className="rounded-xl border border-line bg-surface p-2 text-sm font-bold">
                  Aucun régime rénal de dose n’est transcrit pour ce médicament ; les notes source ne sont pas des doses.
                </p>
              )}
              {medicament.regimes.length > 1 && !regime && (
                <p role="status" className="text-xs font-bold opacity-75">Choisissez le contexte médical applicable. Aucun schéma n’est sélectionné par défaut.</p>
              )}
              {regime && <LigneSelection regime={regime} dfg={dfg} />}
            </section>
          )}

          <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs font-bold leading-relaxed">
            Avertissement : ces textes reprennent une source de synthèse et ne remplacent pas le RCP de la spécialité prescrite. Vérifier les doses, le contexte infectieux et les protocoles locaux avec un médecin/pharmacien ; outil non validé pour prescrire.
          </p>
        </>
      )}

      <details className="rounded-xl border border-line bg-surface p-2 text-xs leading-relaxed">
        <summary className="cursor-pointer font-black">Note de traçabilité de l’audit</summary>
        <p className="mt-2">
          Le document V5 annonce 184 frontières interpolées. Le recomptage indépendant retrouve 198 observations de frontières internes sur 129 lignes sources et 327 cellules ; cette différence de méthode n’explique pas le chiffre 184, qui n’est pas reproductible à partir des fichiers disponibles.
          Les écarts entre ces observations et les seuils du brouillon sont détaillés dans le rapport. Ce constat d’audit ne valide aucune dose et n’est pas une donnée thérapeutique.
        </p>
      </details>
      <p className="text-[11px] font-bold opacity-70">
        Source de travail : tableau OMEDIT Pays de la Loire V2.3. Cet outil ne remplace pas le RCP individuel ni une validation locale tunisienne.
      </p>
      {detailedRegime && dfg !== null && <DetailDialog regime={detailedRegime} dfg={dfg} onClose={() => setDialogOpen(false)} />}
    </section>
  );
}

function LigneSelection({ regime, dfg }: { regime: RegimeAtb; dfg: number }) {
  const resultat = useMemo(() => cellulePourDFG(regime, dfg), [regime, dfg]);
  const sortie = formatResultat(resultat);
  const source = resultat.status === "invalide" ? regime.source : resultat.source;
  const intervalle = resultat.status === "cellule-source" ? borneLabel(resultat.intervalle) : null;
  const limite = resultat.status === "cellule-source" ? resultat.limiteExacte : null;

  return (
    <section aria-live="polite" className="rounded-2xl border border-line bg-surface p-3" data-testid="atb-v2-result">
      {limite && (
        <div role="note" className="mb-3 rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 text-xs leading-relaxed">
          <p className="font-black">Limite exacte</p>
          <p className="mt-1">
            DFG brut calculé {limite.dfgBrut.toLocaleString("fr-FR", { maximumFractionDigits: 6 })} ; affiché {limite.dfgAffiche} = seuil {limite.seuil} de cette ligne.
            Appliqué : {intervalle}. La sélection utilise le DFG brut ; le tableau source ne précise pas l’opérateur aux limites intérieures.
          </p>
          {limite.segmentInferieur && (
            <p className="mt-1">Régime inférieur adjacent, à titre indicatif : « {limite.segmentInferieur.contenu.fr} ».</p>
          )}
          <p className="mt-1">Certains RCP peuvent écrire « ≤ seuil » (ex. céfépime ≤ 50 mL/min). Vérifier le RCP de la spécialité prescrite.</p>
        </div>
      )}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-black">{sortie.titre}</h3>
        {intervalle && <span className="rounded-full border border-line px-2.5 py-1 text-xs font-bold" dir="ltr">{intervalle}</span>}
      </div>
      <p className={`mt-2 whitespace-pre-wrap text-sm font-bold leading-relaxed ${sortie.alerte ? "text-amber-700 dark:text-amber-300" : ""}`}>
        {sortie.texte}
      </p>
      <p className="mt-2 text-xs opacity-70" dir="ltr">
        Source : {source.document}, {source.version}, p. {source.page}, ligne {source.ligneSource}.
      </p>
    </section>
  );
}

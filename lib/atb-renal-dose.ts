// Sélecteur de cellules source par DFG : il ne calcule pas de dose, de DFG ou de clairance.
// لا يحسب الجرعة ولا DFG؛ يختار النص الموثق فقط، ولا يرفع أي حاجز سريري.

export const TYPES_CELLULE_ATB = [
  "dose-source",
  "note",
  "aucune-donnee",
  "deconseille",
  "contre-indique",
  "surveillance-requise",
] as const;

export type TypeCelluleAtb = (typeof TYPES_CELLULE_ATB)[number];

/** Sens de l'égalité à un seuil, à confirmer pour chaque ligne source. */
export type EgaliteAuSeuil = "ce-segment" | "segment-superieur" | "non-verifiee";

export interface ContenuCelluleAtb {
  /** Une note ou « aucune donnée » n'est jamais une dose. */
  type: TypeCelluleAtb;
  /** Transcription source, sans calcul ni reformulation. */
  fr: string;
  /** Traduction éditoriale ; peut reprendre le texte source si non traduit. */
  ar: string;
}

export interface AtbSegment {
  /** Seuil de changement ; le segment s'applique sous ce seuil, sauf égalité explicite. */
  seuil: number | null;
  /** À DFG exactement égal au seuil, précise quel segment s'applique. Null pour la référence. */
  egaliteAuSeuil: EgaliteAuSeuil | null;
  contenu: ContenuCelluleAtb;
}

export interface SourceAtb {
  document: string;
  version: string;
  page: number;
  ligneSource: string;
}

export type RegleRenaleAtb =
  | { type: "segments"; segments: readonly AtbSegment[] }
  | {
      type: "bloquee";
      raison: "aucune-donnee" | "surveillance-requise" | "contexte-non-verifie";
      contenu: ContenuCelluleAtb;
    };

/** Indication, voie et source sont isolées : les lignes cliniques distinctes ne se fusionnent pas. */
export interface RegimeAtb {
  id: string;
  indication: string;
  voie: string;
  source: SourceAtb;
  regleRenale: RegleRenaleAtb;
}

export interface BorneDfg {
  valeur: number | null;
  /** null signifie que l'inclusion n'est pas définie ou que la borne est ouverte. */
  incluse: boolean | null;
}

export interface IntervalleDfg {
  borneBasse: BorneDfg;
  borneHaute: BorneDfg;
}

export type ErreurSegmentsDfg =
  | "liste-vide"
  | "segment-invalide"
  | "reference-manquante"
  | "references-multiples"
  | "seuil-invalide"
  | "seuil-duplique"
  | "egalite-reference-invalide"
  | "egalite-manquante"
  | "type-cellule-invalide"
  | "texte-vide";

export type ErreurRegimeAtb =
  | ErreurSegmentsDfg
  | "regime-invalide"
  | "identifiant-vide"
  | "indication-vide"
  | "voie-vide"
  | "source-incomplete"
  | "page-source-invalide"
  | "regle-renale-invalide"
  | "raison-bloquage-invalide"
  | "type-bloquage-incoherent";

export interface LimiteExacteAtb {
  seuil: number;
  dfgBrut: number;
  dfgAffiche: number;
  /** Cellule sous le seuil arrondi, montrée à titre informatif par la limite exacte. */
  segmentInferieur: AtbSegment | null;
}

export type ResultatSelectionAtb =
  | {
      status: "cellule-source";
      regimeId: string;
      indication: string;
      voie: string;
      source: SourceAtb;
      segment: AtbSegment;
      intervalle: IntervalleDfg;
      limiteExacte: LimiteExacteAtb | null;
    }
  | {
      status: "boundary-30";
      regimeId: string;
      indication: string;
      voie: string;
      source: SourceAtb;
      seuil: 30;
      dfgBrut: number;
    }
  | {
      status: "bloque";
      regimeId: string;
      indication: string;
      voie: string;
      source: SourceAtb;
      raison: "aucune-donnee" | "surveillance-requise" | "contexte-non-verifie";
      contenu: ContenuCelluleAtb;
    }
  | { status: "invalide"; raison: "dfg" }
  | { status: "invalide"; raison: "regime"; erreurs: ErreurRegimeAtb[] };

const TYPES_CELLULE_VALIDES = new Set<string>(TYPES_CELLULE_ATB);
const EGALITES_VALIDES = new Set<string>(["ce-segment", "segment-superieur", "non-verifiee"]);
const RAISONS_BLOQUAGE_VALIDES = new Set<string>([
  "aucune-donnee",
  "surveillance-requise",
  "contexte-non-verifie",
]);

function texteNonVide(valeur: unknown): valeur is string {
  return typeof valeur === "string" && valeur.trim().length > 0;
}

function contenuCelluleValide(contenu: unknown): contenu is ContenuCelluleAtb {
  if (!contenu || typeof contenu !== "object") return false;
  const candidat = contenu as Record<string, unknown>;
  return (
    typeof candidat.type === "string" &&
    TYPES_CELLULE_VALIDES.has(candidat.type) &&
    texteNonVide(candidat.fr) &&
    texteNonVide(candidat.ar)
  );
}

/** Vérifie la structure des intervalles, sans valider médicalement les contenus. */
export function validerSegmentsDFG(segments: readonly AtbSegment[]): ErreurSegmentsDfg[] {
  if (!Array.isArray(segments) || segments.length === 0) return ["liste-vide"];

  const erreurs: ErreurSegmentsDfg[] = [];
  const references = segments.filter(
    (segment) => Boolean(segment && typeof segment === "object" && segment.seuil === null),
  ).length;
  if (references === 0) erreurs.push("reference-manquante");
  if (references > 1) erreurs.push("references-multiples");

  const seuils = new Set<number>();
  for (const segment of segments) {
    if (!segment || typeof segment !== "object") {
      erreurs.push("segment-invalide");
      continue;
    }

    if (!contenuCelluleValide(segment.contenu)) {
      const candidat = segment.contenu as unknown;
      const type = candidat && typeof candidat === "object"
        ? (candidat as Record<string, unknown>).type
        : undefined;
      if (typeof type !== "string" || !TYPES_CELLULE_VALIDES.has(type)) {
        erreurs.push("type-cellule-invalide");
      }
      const fr = candidat && typeof candidat === "object"
        ? (candidat as Record<string, unknown>).fr
        : undefined;
      const ar = candidat && typeof candidat === "object"
        ? (candidat as Record<string, unknown>).ar
        : undefined;
      if (!texteNonVide(fr) || !texteNonVide(ar)) erreurs.push("texte-vide");
    }

    if (segment.seuil === null) {
      if (segment.egaliteAuSeuil !== null) erreurs.push("egalite-reference-invalide");
      continue;
    }

    if (!Number.isFinite(segment.seuil) || segment.seuil <= 0) {
      erreurs.push("seuil-invalide");
      continue;
    }
    if (seuils.has(segment.seuil)) erreurs.push("seuil-duplique");
    seuils.add(segment.seuil);

    if (!segment.egaliteAuSeuil || !EGALITES_VALIDES.has(segment.egaliteAuSeuil)) {
      erreurs.push("egalite-manquante");
    }
  }

  return [...new Set(erreurs)];
}

/** Vérifie le contexte et la provenance, en plus des segments. */
export function validerRegimeAtb(regime: RegimeAtb): ErreurRegimeAtb[] {
  if (!regime || typeof regime !== "object") return ["regime-invalide"];

  const erreurs: ErreurRegimeAtb[] = [];
  if (!texteNonVide(regime.id)) erreurs.push("identifiant-vide");
  if (!texteNonVide(regime.indication)) erreurs.push("indication-vide");
  if (!texteNonVide(regime.voie)) erreurs.push("voie-vide");

  const source = regime.source as SourceAtb | undefined;
  if (!source || typeof source !== "object") {
    erreurs.push("source-incomplete", "page-source-invalide");
  } else {
    if (!texteNonVide(source.document) || !texteNonVide(source.version) || !texteNonVide(source.ligneSource)) {
      erreurs.push("source-incomplete");
    }
    if (!Number.isInteger(source.page) || source.page < 1) erreurs.push("page-source-invalide");
  }

  const regle = regime.regleRenale as RegleRenaleAtb | undefined;
  if (!regle || typeof regle !== "object") {
    erreurs.push("regle-renale-invalide");
  } else if (regle.type === "segments") {
    erreurs.push(...validerSegmentsDFG(regle.segments));
  } else if (regle.type === "bloquee") {
    if (!RAISONS_BLOQUAGE_VALIDES.has(regle.raison)) {
      erreurs.push("raison-bloquage-invalide");
    }
    if (!contenuCelluleValide(regle.contenu)) {
      const contenu = regle.contenu as unknown;
      const type = contenu && typeof contenu === "object"
        ? (contenu as Record<string, unknown>).type
        : undefined;
      if (typeof type !== "string" || !TYPES_CELLULE_VALIDES.has(type)) {
        erreurs.push("type-cellule-invalide");
      }
      const fr = contenu && typeof contenu === "object"
        ? (contenu as Record<string, unknown>).fr
        : undefined;
      const ar = contenu && typeof contenu === "object"
        ? (contenu as Record<string, unknown>).ar
        : undefined;
      if (!texteNonVide(fr) || !texteNonVide(ar)) erreurs.push("texte-vide");
    }
    if (
      contenuCelluleValide(regle.contenu) &&
      raisonBloquageIncoherente(regle.raison, regle.contenu.type)
    ) {
      erreurs.push("type-bloquage-incoherent");
    }
  } else {
    erreurs.push("regle-renale-invalide");
  }

  return [...new Set(erreurs)];
}

function raisonBloquageIncoherente(raison: string, type: TypeCelluleAtb): boolean {
  if (raison === "aucune-donnee") return type !== "aucune-donnee";
  if (raison === "surveillance-requise") return type !== "surveillance-requise";
  return raison === "contexte-non-verifie" && type === "dose-source";
}

function memeSegment(a: AtbSegment, b: AtbSegment): boolean {
  return (
    a.seuil === b.seuil &&
    a.egaliteAuSeuil === b.egaliteAuSeuil &&
    a.contenu.type === b.contenu.type &&
    a.contenu.fr === b.contenu.fr &&
    a.contenu.ar === b.contenu.ar
  );
}

/** Retourne l'intervalle source sans inventer l'inclusion d'une borne. */
export function intervallePourSegmentDFG(
  segments: readonly AtbSegment[],
  selection: AtbSegment,
): IntervalleDfg | null {
  if (validerSegmentsDFG(segments).length > 0) return null;
  const membre = segments.find((segment) => memeSegment(segment, selection));
  if (!membre) return null;

  const seuils = segments
    .map((segment) => segment.seuil)
    .filter((seuil): seuil is number => seuil !== null)
    .sort((a, b) => b - a);

  if (membre.seuil === null) {
    const seuilSuperieur = seuils[0] ?? null;
    const segmentInferieur = segments.find((segment) => segment.seuil === seuilSuperieur);
    const incluse = segmentInferieur?.egaliteAuSeuil === "segment-superieur"
      ? true
      : segmentInferieur?.egaliteAuSeuil === "ce-segment"
        ? false
        : null;
    return {
      borneBasse: { valeur: seuilSuperieur, incluse },
      borneHaute: { valeur: null, incluse: null },
    };
  }

  const seuilInferieur = seuils.find((seuil) => seuil < membre.seuil!) ?? null;
  const segmentInferieur = segments.find((segment) => segment.seuil === seuilInferieur);
  const incluseBasse = segmentInferieur?.egaliteAuSeuil === "segment-superieur"
    ? true
    : segmentInferieur?.egaliteAuSeuil === "ce-segment"
      ? false
      : null;
  const incluseHaute = membre.egaliteAuSeuil === "ce-segment"
    ? true
    : membre.egaliteAuSeuil === "segment-superieur"
      ? false
      : null;

  return {
    borneBasse: { valeur: seuilInferieur, incluse: seuilInferieur === null ? null : incluseBasse },
    borneHaute: { valeur: membre.seuil, incluse: incluseHaute },
  };
}

/**
 * Sélectionne une cellule source pour une seule indication/voie.
 * E1 : un seuil est une borne haute exclusive; la cellule du seuil s'applique strictement en dessous.
 * E2 : si la ligne possède un seuil 30 et que le DFG vaut 30 ± 1e-6, la sélection est refusée.
 * E3 : signale une limite quand le DFG arrondi à l'entier rejoint un seuil de la ligne.
 * Une cellule note/absence/surveillance reste typée et n'est jamais transformée en dose.
 */
export function cellulePourDFG(regime: RegimeAtb, dfg: number): ResultatSelectionAtb {
  if (!Number.isFinite(dfg) || dfg < 0) return { status: "invalide", raison: "dfg" };
  const erreurs = validerRegimeAtb(regime);
  if (erreurs.length > 0) return { status: "invalide", raison: "regime", erreurs };

  const base = {
    regimeId: regime.id,
    indication: regime.indication,
    voie: regime.voie,
    source: regime.source,
  };

  if (regime.regleRenale.type === "bloquee") {
    return {
      status: "bloque",
      ...base,
      raison: regime.regleRenale.raison,
      contenu: regime.regleRenale.contenu,
    };
  }

  const segments = regime.regleRenale.segments;
  if (segments.some((segment) => segment.seuil === 30) && Math.abs(dfg - 30) <= 1e-6) {
    return {
      status: "boundary-30",
      ...base,
      seuil: 30,
      dfgBrut: dfg,
    };
  }

  // E1 : les seuils sont des bornes hautes exclusives; à S, le segment S ne s'applique pas.
  const applicables = segments.filter((segment) => segment.seuil !== null && segment.seuil > dfg);
  const seuilSelectionne = applicables.length > 0
    ? Math.min(...applicables.map((segment) => segment.seuil!))
    : null;
  const selection = seuilSelectionne === null
    ? segments.find((segment) => segment.seuil === null)
    : segments.find((segment) => segment.seuil === seuilSelectionne);

  if (!selection) {
    return { status: "invalide", raison: "regime", erreurs: ["reference-manquante"] };
  }
  const intervalle = intervallePourSegmentDFG(segments, selection);
  if (!intervalle) {
    return { status: "invalide", raison: "regime", erreurs: ["liste-vide"] };
  }

  const segmentAffiche = segments.find(
    (segment): segment is AtbSegment & { seuil: number } =>
      segment.seuil !== null && Math.round(dfg) === segment.seuil,
  );

  return {
    status: "cellule-source",
    ...base,
    segment: selection,
    intervalle,
    limiteExacte: segmentAffiche
      ? {
          seuil: segmentAffiche.seuil,
          dfgBrut: dfg,
          dfgAffiche: Math.round(dfg),
          segmentInferieur: segmentAffiche,
        }
      : null,
  };
}

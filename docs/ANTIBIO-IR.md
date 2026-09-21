# Antibiotiques & fonction rénale — documentation développeur

**Page :** `/calculateurs/antibio-renal` · **Données :** `data/atb-renal.ts` · **Moteur :** `lib/atb-dose.ts`
**Tests :** `__tests__/atb-renal.test.ts`, `__tests__/renal-clearance.test.ts` · **Version :** v18.1 (2026-09-21)

---

## 1. Source et périmètre

| Élément | Valeur |
|---|---|
| Référentiel | OMEDIT Pays de la Loire — « Adaptation des antibiotiques à la fonction rénale », **V2.3 (avril 2026)** |
| Sources citées par le tableau | RCP (base-donnees-publique.medicaments.gouv.fr), GPR (SPILF–SPT–SFPT–CA-SFM, juin 2023), ePOPI — données arrêtées au **10/01/2024** |
| Formats | 12 pages, 841,7 × 595,2 pt (paysage), **93 lignes de molécules**, 13 bandeaux de classe, 5 colonnes de stade |
| Copie archivée | `data/issues/OMEDIT-ATB-IR-V2.3-avril2026.pdf` (+ `…rows.json`, `tools-*.py`) |

**Populations : adultes ≥ 18 ans NON dialysés.** Toute situation de dialyse (péritonéale ou
hémodialyse) ou de pédiatrie sort du périmètre : la page renvoie vers le tableau original.

## 2. Modèle de données (`data/atb-renal.ts`)

```ts
ATB_RENAL_STAGES   : 5 × { id, fr, ar, dgf }        // normorenal ≥90 … terminale <15
ATB_RENAL_SECTIONS : 13 × { id, fr, ar }            // classes du tableau
ATB_RENAL_ROWS     : 93 × { id, fr, ar, section, page, lines, notes }
ATB_RENAL_BY_ID    : index id → ligne
```

Une `lines[i]` décrit **une ligne de tableau** : `{ kind: "dose" | "info", d: [fr ×5] }`.
- `d[0..4]` = **valeur française imprimée, mot pour mot** pour les 5 stades (jamais traduite,
  jamais reformulée). Une seule ligne de tableau = plusieurs conduites → plusieurs `lines`.
- `kind: "info"` = la cellule ne prescrit rien (consigne transverse, ex. ceftriaxone) : elle
  n'est jamais présentée comme une dose calculable.

**Règle d'or :** le texte affiché est celui de la source. Le calcul ne fait que **traduire le
pondéral** (`mg/kg`) en quantité absolue ; il ne déduit jamais une valeur non écrite.

## 3. Moteur de calcul (`lib/atb-dose.ts`)

| Fonction | Rôle |
|---|---|
| `parseWeightDoses(txt)` | extrait les segments `mg/kg`, `mg/kg/j`, `mg/kg/24h`, `mg/kg/12h`… + `en N injections` |
| `weightDoseText(txt, kg, lang)` | rend la dose absolue (`≈ de 900 mg à 1,8 g/24h`, chiffres arabes orientaux en AR) |
| `stageFromCrCl(crcl)` | bornes du tableau : ≥90 / 89–60 / 59–30 / 30–15 / <15 |
| `cockcroftGault(a, kg, mgDl, sexe)` | `(140 − âge) × poids × 0,85 (F) / (72 × créatinine)` |
| `toMgDl(v, unit)` | µmol/L → mg/dL (÷88,4) + alerte si > 20 mg/dL |
| `requiresSourceCheck(txt)` | « Aucune donnée », « Réduction de la posologie », ½ / ¼ dose → ⚠ vérification source |

**Aucune déduction silencieuse.** Conduites non chiffrées par la source = reprises telles
quelles avec un ⚠ explicite. Aucun calcul n'est appliqué aux segments `DC … puis …` (posologie
d'entretien seulement) ni aux cellules `kind: "info"`.

## 4. Pipeline d'extraction (hors application, `tools/`)

1. `atb_grid.py` — PDF → cellules (`/home/user/atb_cells.json`, 791 cellules, contrôle
   « 0 span hors ou en double ») via `get_drawings()` + spans, règle de non-croisement.
2. `atb_rows.py` — cellules → molécules/lignes (`/home/user/atb_rows.json`) : bandes verticales
   par molécule, **bande à exactement 5 cases = décalage en bloc ⇒ affectation séquentielle**,
   sinon couverture de colonne > 50 %, plus grand recouvrement, puis complément par la case la
   plus proche (marquée). Notes = italique / préfixe « Posologies exprimées » / cellule
   **contenue verticalement** dans une cellule plus haute déjà vue.
3. `gen_atb_ts.py` — `atb_rows.json` → `data/atb-renal.ts` (sections AR, noms AR des 93
   molécules, notes AR, corrections `PATCH`, nettoyage typographique).

**Rejouer la chaîne :**

```bash
python3 tools/atb_grid.py      # → /home/user/atb_cells.json
python3 tools/atb_rows.py      # → /home/user/atb_rows.json
python3 tools/gen_atb_ts.py    # → data/atb-renal.ts
```

Corrections manuelles documentées dans `PATCH` (`gen_atb_ts.py`) : Céfidérocol, aminosides
(dose unique quotidienne, note partagée), Aztréonam IM/IV, Ceftolozane + tazobactam,
ceftriaxone (info), méropénem (ligne de monitorage retirée).

## 5. Limites connues et garde-fous

- **Relecture humaine obligatoire** : la valeur médicale n'est pas validée par un test ; chaque
  posologie doit être relue par un médecin/pharmacien tunisien (bannière permanente sur la page).
- **« Aucune donnée »** n'a pas de sens unique : résolu cellule par cellule, jamais par règle globale.
- Molécules à forte liaison protéique (doxycycline, tigécycline, dalbavancine, fidaxomicine) :
  pas d'adaptation rénale — le texte de la source est conservé tel quel.
- Dialyse : hors périmètre (le bandeau le rappelle, y compris quand une valeur manque).
- Le tableau ne remplace pas le RCP pour les situations particulières (obésité, ECMO, sepsis
  avec clairance augmentée…).

## 6. Étage 2 — fonction rénale chronique / aiguë / enfant (`lib/renal-clearance.ts`)

| Règle | Mise en œuvre |
|---|---|
| Adulte ≥ 18 ans | **CKD-EPI 2021** (créatinine, sans ethnie) affiché en `mL/min/1,73 m²` ; si `poids < 0,8 × IBW` → mention « indexée : surestime la posologie » |
| Poids de calcul | Cockcroft-Gault : poids réel si **BMI < 30**, sinon **poids ajusté** `IBW + 0,4 × (réel − IBW)` (Devine) ; option « poids idéal » |
| Enfant < 18 ans | **CKID U25** : `0,413 × taille (cm) / créatinine (mg/dL)`, lu comme équivalent clairance ; **taille obligatoire**, sinon refus explicite ; la page rappelle que le tableau est adulte et renvoie au calculateur pédiatrique |
| Agression aiguë | Critères **KDIGO** cochés automatiquement : `+0,3 mg/dL/48 h`, `×1,5/48 h`, `×1,5/7 j`, `diurèse < 0,5 mL/kg/h ≥ 6 h` ⇒ **stade le plus prudent** entre CKD-EPI et Cockcroft-Gault, avec explication |
| Escalade prudente (GPR) | Case « DFG 30–90 dégradé » : **+2 stades**, sauf **molécules vitales avec DFG < 30** (ceftriaxone, céfotaxime, amikacine, gentamicine, vancomycine, pipéracilline/tazobactam, métronidazole) ⇒ badge « ↑ Escalade GPR » sur chaque carte |
| Stade vide | Jamais de substitution silencieuse : ⚠ « Aucune donnée » + indice de voisinage (« le stade voisin porte une valeur — à confirmer dans le tableau ») |

## 7. Étage 3 — plan antibiotique et boucle a → b (`lib/atb-plan.ts`)

- Chaque molécule peut être **retenue** ou **abandonnée** (motif : fonction rénale, résistance,
  allergie, interaction, autre + note ≤ 120 caractères) ; l'action **Réévaluer** crée un nouveau
  tour (`#1 → #2 → …`) : l'historique n'est jamais écrasé.
- Le panneau « Plan antibiotique » affiche les décisions courantes, permet **Copier**, **Imprimer**
  et **Vider**, et expose le texte exportable (`planToText`, FR/AR).
- Persistance locale `eutn:atb-plan-v1` (aucune donnée ne quitte l'appareil) ; JSON corrompu ⇒ plan
  vide, jamais d'erreur. Snapshot contextuel conservé par décision (poids, stade, dose affichée).

## 8. Évolutions possibles

- Export PDF mis en page (le texte du plan est déjà prêt à imprimer).
- Enregistrement du plan dans le « résumé de cas » (`lib/casesummary.ts`).

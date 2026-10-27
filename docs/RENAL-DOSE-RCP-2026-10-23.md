# RCP vérifiés pour le pont de clairance — 2026-10-23

## Périmètre et limites

Le PDF d'OMEDIT fourni ne concerne que les antibiotiques. Pour compléter prudemment le pont `/calculateurs/renal-dose`, deux médicaments non antibiotiques ont été renseignés à partir de leur RCP individuel publié dans la Base de Données Publique des Médicaments (ANSM) : gabapentine et prégabaline.

Ces références sont françaises, pas des RCP tunisiens. Elles ne constituent pas une validation clinique locale. Vérifier la spécialité, la forme et le RCP tunisien effectivement disponibles avant une décision thérapeutique. Le calculateur affiche un Cockcroft–Gault adulte non indexé ; les seuils ci-dessous sont ceux de clairance de la créatinine (ClCr) des tableaux RCP. Les situations de dialyse ne sont pas calculées par les quatre bandes ordinaires. La page exige une déclaration de fonction stable/chronique connue ; le défaut est « inconnu ». Un seul résultat ne prouve pas la stabilité, et une situation aiguë déclarée ou détectée par les critères KDIGO suspend les doses. La dialyse est également bloquée. L'option manuelle de poids idéal donne une estimation, mais ne sélectionne pas de dose car la règle de poids spécifique à chaque produit n'a pas été revue ici.

Les lignes non antibiotiques déjà présentes dans l'ancienne liste (hors gabapentine et prégabaline) n'ont pas reçu de validation actuelle. Leurs anciennes posologies ont été retirées du calculateur ; les noms restent visibles sans dose tant qu'un RCP individuel et une règle de population ne sont pas revus.

## Gabapentine

**Source officielle :** [GABAPENTINE ZENTIVA 400 mg, gélule — RCP ANSM](https://base-donnees-publique.medicaments.gouv.fr/medicament/67350239/extrait) · RCP mis à jour le 17/09/2026 · page consultée le 23/10/2026.

Tableau 2 du RCP (adulte), dose quotidienne totale :

| ClCr (mL/min) | Dose quotidienne totale (mg/j) |
|---:|---:|
| ≥ 80 | 900–3600 |
| 50–79 | 600–1800 |
| 30–49 | 300–900 |
| 15–29 | 150–600 |
| < 15 | 150–300 dans la catégorie <15, avec réduction proportionnelle à la ClCr |

Le RCP indique que la dose quotidienne est répartie en trois prises ; la dose de 150 mg/j peut être administrée sous forme de 300 mg un jour sur deux. Il demande une réduction proportionnelle sous 15 mL/min. Cette réduction n'est pas calculée automatiquement par l'interface. Le RCP décrit un schéma séparé en hémodialyse, avec des doses après séance ; l'interface renvoie au RCP au lieu d'extrapoler ces doses dans les bandes usuelles. Une forme à plus faible dosage peut être nécessaire.

## Prégabaline

**Source officielle :** [PREGABALINE HCS 75 mg, gélule — RCP ANSM](https://base-donnees-publique.medicaments.gouv.fr/medicament/63754960/extrait) · RCP mis à jour le 29/03/2024 · page consultée le 23/10/2026.

Tableau 1 du RCP, doses quotidiennes totales :

| ClCr (mL/min) | Dose initiale (mg/j) | Dose maximale (mg/j) | Répartition indiquée |
|---:|---:|---:|---|
| ≥ 60 | 150 | 600 | 2 ou 3 prises |
| ≥ 30 et < 60 | 75 | 300 | 2 ou 3 prises |
| ≥ 15 et < 30 | 25–50 | 150 | 1 prise/j ou 2 |
| < 15 | 25 | 75 | 1 prise/j |

Le RCP précise que la dose quotidienne totale doit être divisée selon le nombre de prises indiqué. En hémodialyse, il indique une dose supplémentaire unique de 25–100 mg immédiatement après une séance de quatre heures ; cette dose n'est pas calculée par l'interface.

## Mise en œuvre et contrôles

- Les seuils RCP propres à chaque médicament sont appliqués séparément : ceux de la gabapentine ne sont pas remplacés par les bandes génériques 60/30/15 mL/min.
- La ligne active n'affiche sa plage exacte de ClCr et le texte des doses qu'après déclaration d'un parcours stable, adulte non dialysé, en l'absence de critère KDIGO et sans remplacement manuel non validé du poids ; le lien du RCP utilisé reste visible.
- Les valeurs présentées sont des plages RCP, pas une sélection automatique de dose individuelle. L'indication, la dose initiale déjà prescrite, la tolérance, la forme disponible et les situations particulières restent à vérifier avec le RCP et un professionnel.
- Les valeurs historiques à 48 h/7 j et la diurèse sont utilisées uniquement pour le repérage KDIGO ; ce repérage n'est pas un diagnostic.
- Le tableau ne transforme pas les anciennes lignes non sourcées en recommandations validées ; leurs anciens textes de dose ont été supprimés de l'interface et de ses données.

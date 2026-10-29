# Revue des seuils ATB–DFG — 29/10/2026

## Décision actualisée selon le cahier V5

Le PDF OMEDIT V2.3 montre une échelle DFG graduée et des frontières de cellules alignées sur ses graduations. La lecture visuelle confirme les positions des seuils personnalisés, notamment :

- Céfépime, p. 4 : 50 / 30 / 10.
- Pipéracilline–tazobactam, p. 3 : 40 / 20.
- Imipénem–cilastatine, p. 6 : 70 / 40 / 20.
- Céfidérocol, p. 4 : 90 / 60 / 30 / 15.

Le contrôle géométrique reproductible trouve 129 lignes source et 327 cellules ; cela donne 198 observations de frontières internes par ligne, dont 60 coordonnées x uniques par page. Les 198 observations s’alignent sur les graduations imprimées avec une erreur interpolée maximale de 0,00665 mL/min. Le chiffre 184 donné par V5 n’est pas reproductible à partir de cette extraction ; il reste à expliquer. La géométrie confirme où se trouvent les limites, mais pas l’opérateur d’égalité ni la justesse clinique.

Le PDF ne précise pas de façon générale l’opérateur d’égalité à chaque frontière intérieure. Le cahier V5 tranche le comportement logiciel, sans prétendre que cette règle est une recommandation clinique universelle :

1. **E1 — borne haute exclusive** : un segment de seuil S s’applique strictement sous S ; à S, le segment supérieur s’applique.
2. **E2 — exception DFG 30** : refus uniquement si le régime choisi possède un seuil 30 et que le DFG brut est à 30 ± 0,000001.
3. **E3 — transparence** : un avertissement est fourni lorsque le DFG arrondi rejoint un seuil, avec le DFG brut, l’intervalle appliqué et le segment adjacent.
4. **E4 — calcul** : la sélection utilise le DFG brut, jamais sa valeur arrondie.

Cette convention est explicite dans les données et tests ; le texte de l’interface devra préciser qu’il s’agit de la convention du module et inviter à vérifier le RCP du médicament prescrit aux limites exactes.

## État d’intégration

- Les règles E1–E3 sont mises en œuvre dans le sélecteur de travail. Les équations de clairance et de fonction rénale n’ont pas été modifiées.
- La base continue reste séparée et le drapeau d’activation est **désactivé**. La page continue d’utiliser l’ancien modèle tant que les tests de parité, l’interface et la revue humaine ne sont pas terminés.
- Le rapport de vérification des 126 lignes est dans `docs/VERIF-126-REGIMES-2026-10-30.md`.
- Les textes arabes copient encore temporairement le français ; chaque ligne est marquée `ar-provisoire`. Aucun texte copié ne doit être affiché sans badge.

## Limites

La vérification géométrique confirme où les cellules changent, pas l’autorité clinique de chaque prescription. Les RCP individuels peuvent différer du tableau de synthèse ; la revue humaine exigée par le cahier V5 reste nécessaire avant toute activation.

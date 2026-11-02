# ATB-DFG V6 — compte rendu des changements d’interface

**Date : 30/10/2026**
**Portée : ergonomie, accessibilité de l’interface, impression et vérifications logicielles.** Aucun tableau de doses, seuil, calcul rénal ni garde-fou clinique n’a été modifié dans cette étape.

## Changements réalisés

- La passe de suivi V5.1 améliore le panneau V2 de revue : recherche multi-mots, filtres de famille, badges d’état, choix explicite du schéma et détails des intervalles.
- À une égalité détectée par E3, le panneau affiche maintenant la forme continue `min ≤ DFG < S`, le DFG brut, sa valeur affichée et la note de prudence sur les opérateurs du tableau source. Le même encadré est présenté dans la carte et dans le détail.
- À la demande confirmée de l’utilisateur, l’interface du calculateur reste **exclusivement en français**, même si la langue globale de l’application est arabe. La zone de la page est balisée LTR/français et les sous-composants (sélecteur rénal, plan et explication) reçoivent le même forçage. Les traductions arabes stockées ne sont pas affichées et restent en attente de relecture humaine.
- La mention de surveillance de la colistine a été retirée : aucune note de source présente dans la ligne ne permettait de justifier ce badge. Aucun nouveau critère clinique de surveillance n’a été inventé.
- Les sections « Source » et « Méthodologie » sont repliables et placées après les données patient et les résultats.
- Un résumé DFG, ClCr et stade reste visible au défilement ; en impression, il redevient statique et n’est pas masqué.
- Ajout d’une impression A4 limitée au calculateur. Les contrôles de saisie, boutons et panneau V2 de revue sont retirés du document imprimé.
- Les petits libellés du calculateur ont une taille minimale de 15 px. Les couleurs du texte actif sont adaptées aux thèmes clair et sombre ; le test vérifie un contraste d’au moins 4,5:1.
- Le dialogue de détail des seuils garde le focus au clavier, se ferme avec Échap et rend le focus au bouton qui l’a ouvert.
- Version de l’application et cache hors ligne synchronisés sur **18.8**.

## Contrôles exécutés

| Contrôle | Résultat |
|---|---|
| Tests Vitest complets | **871 réussis**, 36 fichiers |
| Tests ciblés de l’interface ATB-DFG et des régimes V2 | **37 réussis**, 3 fichiers |
| Tests ciblés des barrières ATB de l’interface | **21 réussis**, 307 autres tests du fichier ignorés par le filtre |
| TypeScript (`npx tsc --noEmit`) | Réussi |
| ESLint (`npm run lint`) | Réussi |
| Construction de production et génération du précache | Réussies ; 449 pages statiques, 1 098 fichiers précachés (~16,6 Mo) |
| Audit des clés de traduction | 101 utilisées, 0 manquante |
| Inventaire local des références | 751 entrées dans 20 groupes, inventaire cohérent |
| Contrôle responsive Playwright | **Non exécuté** : Chromium n’est pas installé dans l’environnement |
| Inspection manuelle de l’impression sur appareil | Non exécutée |

Les avertissements jsdom concernant `window.scrollTo()` n’ont pas fait échouer les tests. Le contrôle de l’inventaire confirme la cohérence des entrées locales, pas la validité indépendante de chaque source.

## Limites et état de sécurité

- Le rapport [`VERIF-126-REGIMES-2026-10-30.md`](./VERIF-126-REGIMES-2026-10-30.md) décrit une comparaison documentaire et structurelle automatisée des 126 régimes. Il précise que la revue clinique humaine et la vérification des RCP propres aux médicaments restent à faire.
- Cette étape n’a pas réexaminé une à une les sources des posologies, puisque les données thérapeutiques n’ont pas été changées. **Aucun résultat logiciel ne vaut vérification clinique ou autorisation de prescrire.**
- `ATB_RENAL_V2_ENABLED` reste fermé en production. Les données V2 restent un brouillon de revue et ne sont pas approuvées pour un usage clinique.
- La vérification documentaire indépendante, la revue humaine, les autres volets V6 (notamment les travaux sur l’IA et les marques tunisiennes), ainsi que l’inspection réelle sur petit écran et sur papier, restent en attente. Aucun chemin ou dosage local non documenté n’a été ajouté.

# Vérification des 126 régimes ATB–DFG — 30/10/2026

## Résultat et portée

**Contrôle documentaire et structurel terminé ; revue clinique humaine non réalisée. Cette base reste isolée et ne doit pas être utilisée pour prescrire.**

- Les 126 lignes et leurs seuils ont été comparés à la grille §4 du cahier V5 : **126/126 lignes présentes, aucun écart majeur [Mj]**. Les textes, nombres de segments et seuils concordent, hors les cas explicitement résolus ci-dessous.
- Les identifiants et pages concordent avec les 93 lignes de `data/atb-renal.ts` et les 93 entrées de l’extraction locale.
- Une comparaison des doses avec les cellules source de `OMEDIT-ATB-IR-V2.3.rows.json` retrouve les textes. Les exceptions documentées sont : (1) ligne Ceftobiprole sévère : ajout d’une cellule explicite « Aucune donnée » sous DFG 50, car la cellule source ne couvre pas cette zone ; (2) deux contextes Ceftolozane sont fusionnés dans la même cellule du PDF ; (3) Rifampicine contient un artefact OCR sur les exposants, normalisé en « 2e/3e jour » conformément au PDF visuel. La correction du cas Fosfomycine reprend le singulier du PDF (« en perfusion »).
- Contrôle géométrique réexécuté avec `data/issues/tools-atb-threshold-audit.py` : les 93 lignes molécules contiennent 129 lignes source et 327 cellules. Le nombre d’observations de frontières internes par ligne vaut exactement Σ(cellules − 1) = **198** ; ce ne sont pas 198 coordonnées distinctes. Après regroupement par page, il reste 60 coordonnées x distinctes. Les 198 observations sont toutes associées à une graduation DFG imprimée ; l’écart interpolé maximal est **0,00665 mL/min**. Cela confirme uniquement la géométrie, pas la dose clinique ni le côté d’égalité.
- La comparaison par molécule réconcilie les 198 frontières source avec les 200 seuils V2 : Ceftobiprole ajoute 1 seuil de protection sous 50 ; Ceftolozane sépare deux contextes portés par les mêmes frontières (+3 seuils) ; Amikacine et Vancomycine ont chacune un bord de cellule TDM qui n’est pas un seuil de dose (−1 chacune). Le test source géométrique verrouille ces quatre écarts, et échoue si une autre ligne change sans explication.
- Le nombre **184** avancé dans V5 n’est toujours pas reproductible selon cette définition comptable ; aucune différence de seuil supplémentaire n’apparaît dans la réconciliation détaillée ci-dessus. Il s’agit donc d’un compte V5 non réconcilié, pas d’un seuil manquant identifié. L’ancienne valeur de 1,49 mL/min, issue d’une approximation moins précise, est retirée.
- Le cahier V5 compte 199 seuils dans la transcription de départ. La résolution Ceftobiprole L2 ajoute un garde-fou source sous 50 : la base corrigée contient donc **200 seuils** (199 de la grille + 1 garde-fou documenté).
- Les statuts [M] indiquent un traitement explicite d’un cas documenté, pas une anomalie encore non résolue. [C] signifie concordance documentaire. Aucun [Mj] n’est laissé en attente.

La comparaison automatisée n’établit pas l’efficacité, la pertinence clinique, ni la validité tunisienne des posologies. Elle ne remplace pas la validation humaine ni le RCP propre au médicament.

## Comparaison avec l’ancien modèle à 5 stades

Un test différentiel dédié parcourt les DFG de 5 à 130 par pas de 5 et les seuils de la base à ±0,001. Il vérifie plus de 3 000 points comparables et empêche l’apparition silencieuse d’un écart pour un médicament hors de la liste des résolutions connues. Il passe, mais **ne signifie pas que les deux modèles affichent la même chose** : l’ancien tableau refuse certaines cellules fusionnées et regroupe des contextes que V2 sépare.

Exceptions de structure explicitement contrôlées : ceftriaxone (un texte multi-contexte devenu deux lignes), teicoplanine PO (texte conservé en note, sans ligne d’adaptation rénale), et azithromycine PO (texte jusque-là informatif devenu ligne source). Le test verrouille également l’ensemble exact des **50 identifiants** présentant déjà une différence de représentation entre modèles ; tout nouvel identifiant en écart fait échouer le test. Cette liste et les résolutions V5 empêchent une dérive silencieuse, mais ne constituent ni une preuve d’équivalence clinique ni une expertise des textes dose par dose. Les bornes E1 diffèrent délibérément de l’ancien sélecteur aux seuils intérieurs et la règle E2 s’applique seulement aux lignes qui contiennent un seuil 30.

La revue des écarts de parité par un professionnel reste à faire. En usage normal, le panneau annonce que V2 est désactivée et ne montre aucune posologie ; en développement, la prévisualisation de revue s’ouvre par un clic explicite et reste marquée « ne pas prescrire ».

## Validation logicielle

Après ajout de la matrice des 200 seuils, des tests différentiels, de la réconciliation géométrique et du panneau V2 français (cartes, recherche, familles, dialog de détail et états de traduction) : **866 tests Vitest réussis dans 35 fichiers**, `tsc --noEmit`, ESLint ciblé et `git diff --check` réussis. `npm run build` réussit également : 449 pages statiques produites et 1 098 fichiers précachés (~16,6 Mo). Les messages jsdom sur `window.scrollTo()` restent des avertissements de l’environnement de test ; la suite termine avec succès. La compilation statique ne remplace pas un contrôle visuel sur navigateur/appareil à 390 px.

## Résolutions appliquées aux cas V5

1. Céfidérocol : un seul régime posologique ; note ≥120 mL/min conservée séparément.
2. Ceftobiprole sévère : 1 g/8h en perfusion de 4h seulement dans la zone documentée ; sous 50, texte explicite « Aucune donnée pour l’infection sévère sous DFG 50 (cellule source limitée) ».
3. Ceftolozane/tazobactam : schéma standard et pneumonie nosocomiale restent deux choix distincts.
4. Ceftriaxone : deux indications distinctes ; note méningée séparée ; aucune adaptation rénale inventée.
5. Méropénem : note de monitorage séparée du régime posologique.
6–8. Amikacine, gentamicine, tobramycine : dose unitaire non diminuée selon la note source, avertissements TDM conservés et badge de surveillance prévu.
9 et 11. Teicoplanine PO et vancomycine PO : notes seules, aucun régime ajouté.
10. Vancomycine IV : adaptation selon concentrations reste une note, pas un seuil inventé.
12. Aztréonam IM : ½ et ¼ restent des textes source, non convertis en quantités calculées.
13. Doxycycline : note additionnelle conservée.
14. Fosfomycine IV : verbatim PDF au singulier « en perfusion ».
15. Rifampicine : artefact OCR des exposants normalisé et documenté.
16. Lévofloxacine : les bornes de L1 et L2 restent différentes.
17. Céfoxitine grave : « Aucune donnée » sous DFG 60 conservé comme cellule non posologique.
18. Sulfadiazine : « Réduction de la posologie » reste non chiffrée ; « Aucune donnée » reste un statut distinct.

## Vérification ligne par ligne

| N° | Identifiant conservé | Ligne | PDF | Statut | Résultat | Vérification / réviseur |
|---:|---|---|---:|:---:|---|
| 1 | `amoxicilline-po` | L1 | p.1 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 1 | `amoxicilline-po` | L2 | p.1 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 2 | `amoxicilline-iv` | L1 | p.1 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 2 | `amoxicilline-iv` | L2 | p.1 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 3 | `amoxicilline-acide-clavulanique-po` | L1 | p.1 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 4 | `amoxicilline-acide-clavulanique-iv` | L1 | p.1 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 4 | `amoxicilline-acide-clavulanique-iv` | L2 | p.1 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 5 | `ampicilline-sulbactam-iv` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 5 | `ampicilline-sulbactam-iv` | L2 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 6 | `ampicilline-sulbactam-im` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 7 | `benzathine-benzylpenicilline-im` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 7 | `benzathine-benzylpenicilline-im` | L2 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 8 | `benzylpenicilline-sodique-im-ou-iv` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 9 | `cloxacilline-po` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 10 | `cloxacilline-iv` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 11 | `oxacilline-iv` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 12 | `phenoxymethyl-penicilline-po` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 13 | `piperacilline-iv` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 14 | `piperacilline-tazobactam-iv` | L1 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 15 | `pivmecillinam-po` | L1 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 16 | `temocilline-iv` | L1 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 16 | `temocilline-iv` | L2 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 17 | `aztreonam-im` | L1 | p.3 | [C] | Concorde ; les fractions non chiffrées sont dans L2.  Contrôle automatisé ; aucune relecture clinique humaine |
| 17 | `aztreonam-im` | L2 | p.3 | [M] | cas 12 : contextes d’indication distincts ; ½ et ¼ conservés en texte.  Contrôle automatisé ; aucune relecture clinique humaine |
| 18 | `aztreonam-iv` | L1 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 18 | `aztreonam-iv` | L2 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 19 | `cefaclor-po` | L1 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 20 | `cefadroxil-po` | L1 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 21 | `cefalexine-po` | L1 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 22 | `cefazoline-im-iv` | L1 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 22 | `cefazoline-im-iv` | L2 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 23 | `cefepime-iv-im-possible` | L1 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 23 | `cefepime-iv-im-possible` | L2 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 23 | `cefepime-iv-im-possible` | L3 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 24 | `cefiderocol-iv` | L1 | p.4 | [M] | cas 1 : note ≥120 mL/min séparée de la ligne posologique.  Contrôle automatisé ; aucune relecture clinique humaine |
| 25 | `cefixime-po` | L1 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 26 | `cefotaxime-im-iv` | L1 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 26 | `cefotaxime-im-iv` | L2 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 26 | `cefotaxime-im-iv` | L3 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 27 | `cefoxitine-iv` | L1 | p.5 | [C] | Concorde ; la cellule « Aucune donnée » concerne L2.  Contrôle automatisé ; aucune relecture clinique humaine |
| 27 | `cefoxitine-iv` | L2 | p.5 | [M] | cas 17 : L2 : référence ≥60, « Aucune donnée » sous 60.  Contrôle automatisé ; aucune relecture clinique humaine |
| 28 | `cefpodoxime-proxetil-po` | L1 | p.5 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 29 | `ceftaroline-fosamil-iv` | L1 | p.5 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 30 | `ceftazidime-im-iv` | L1 | p.5 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 30 | `ceftazidime-im-iv` | L2 | p.5 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 31 | `ceftazidime-avibactam-iv` | L1 | p.5 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 31 | `ceftazidime-avibactam-iv` | L2 | p.5 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 32 | `ceftobiprole-iv` | L1 | p.5 | [C] | Concorde ; la résolution du cas 2 concerne uniquement L2.  Contrôle automatisé ; aucune relecture clinique humaine |
| 32 | `ceftobiprole-iv` | L2 | p.5 | [M] | cas 2 : L2 limité à DFG ≥50 ; ajout « Aucune donnée » sous 50.  Contrôle automatisé ; aucune relecture clinique humaine |
| 33 | `ceftolozane-tazobactam-iv` | L1 | p.5 | [C] | Concorde ; les deux régimes sont conservés séparément.  Contrôle automatisé ; aucune relecture clinique humaine |
| 33 | `ceftolozane-tazobactam-iv` | L2 | p.5 | [M] | cas 3 : deux contextes présents dans des cellules fusionnées.  Contrôle automatisé ; aucune relecture clinique humaine |
| 34 | `ceftriaxone-im-iv` | L1 | p.6 | [C] | Concorde ; le fractionnement des contextes et la note concernent l’ensemble de la ligne.  Contrôle automatisé ; aucune relecture clinique humaine |
| 34 | `ceftriaxone-im-iv` | L2 | p.6 | [M] | cas 4 : deux indications et note méningée d’une cellule pleine largeur.  Contrôle automatisé ; aucune relecture clinique humaine |
| 35 | `cefuroxime-axetil-po` | L1 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 36 | `cefuroxime-iv` | L1 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 37 | `ertapenem-iv` | L1 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 38 | `imipenem-cilastatine-iv` | L1 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 38 | `imipenem-cilastatine-iv` | L2 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 38 | `imipenem-cilastatine-iv` | L3 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 39 | `imipenem-cilastatine-relebactam-iv` | L1 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 40 | `meropenem-iv` | L1 | p.6 | [M] | cas 5 : note de monitorage séparée de la dose.  Contrôle automatisé ; aucune relecture clinique humaine |
| 41 | `meropenem-vaborbactam-iv-atb-de-reserve` | L1 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 42 | `amikacine-iv` | L1 | p.7 | [M] | cas 6 : avertissement TDM permanent.  Contrôle automatisé ; aucune relecture clinique humaine |
| 43 | `gentamicine-im-iv` | L1 | p.7 | [M] | cas 7 : avertissement TDM permanent.  Contrôle automatisé ; aucune relecture clinique humaine |
| 44 | `tobramycine-im-iv` | L1 | p.7 | [M] | cas 8 : avertissement TDM permanent.  Contrôle automatisé ; aucune relecture clinique humaine |
| 45 | `ciprofloxacine-po` | L1 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 46 | `ciprofloxacine-iv` | L1 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 47 | `delafloxacine-po` | L1 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 48 | `delafloxacine-iv` | L1 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 49 | `levofloxacine-iv-po` | L1 | p.7 | [C] | Concorde ; le seuil de L1 reste distinct de celui de L2.  Contrôle automatisé ; aucune relecture clinique humaine |
| 49 | `levofloxacine-iv-po` | L2 | p.7 | [M] | cas 16 : seuils vérifiés séparément par ligne.  Contrôle automatisé ; aucune relecture clinique humaine |
| 50 | `moxifloxacine-iv-po` | L1 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 51 | `norfloxacine-po` | L1 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 52 | `ofloxacine-iv-po` | L1 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 52 | `ofloxacine-iv-po` | L2 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 53 | `dalbavancine-iv` | L1 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 54 | `oritavancine-iv` | L1 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 55 | `teicoplanine-im-iv` | L1 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 55 | `teicoplanine-im-iv` | L2 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 57 | `vancomycine-iv` | L1 | p.8 | [M] | cas 10 : note TDM distincte de la dose.  Contrôle automatisé ; aucune relecture clinique humaine |
| 59 | `metronidazole-po` | L1 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 59 | `metronidazole-po` | L2 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 59 | `metronidazole-po` | L3 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 60 | `metronidazole-iv` | L1 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 60 | `metronidazole-iv` | L2 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 61 | `ornidazole-iv-po` | L1 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 62 | `azithromycine-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 63 | `clarithromycine-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 63 | `clarithromycine-po` | L2 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 64 | `clarithromycine-iv` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 65 | `clindamycine-iv-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 66 | `erythromycine-iv-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 67 | `pristinamycine-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 68 | `roxithromycine-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 69 | `spiramycine-iv-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 69 | `spiramycine-iv-po` | L2 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 70 | `spiramycine-metronidazole-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 71 | `cotrimoxazole-iv-po` | L1 | p.10 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 72 | `sulfadiazine-po` | L1 | p.10 | [M] | cas 18 : séparateurs de retours à la ligne harmonisés ; texte non chiffré préservé.  Contrôle automatisé ; aucune relecture clinique humaine |
| 73 | `trimethoprime-po` | L1 | p.10 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 74 | `doxycycline-iv-po` | L1 | p.10 | [M] | cas 13 : note source complémentaire conservée.  Contrôle automatisé ; aucune relecture clinique humaine |
| 75 | `lymecycline-po` | L1 | p.10 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 75 | `lymecycline-po` | L2 | p.10 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 76 | `minocycline-po` | L1 | p.10 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 77 | `tigecycline-iv` | L1 | p.10 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 77 | `tigecycline-iv` | L2 | p.10 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 78 | `acide-fusidique-iv-po` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 79 | `colistine-iv-colistimethate-sodique` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 80 | `daptomycine-iv` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 80 | `daptomycine-iv` | L2 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 81 | `fidaxomicine-po` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 82 | `fosfomycine-trometamol-po` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 83 | `fosfomycine-iv` | L1 | p.11 | [M] | cas 14 : verbatim PDF corrigé au singulier « en perfusion ».  Contrôle automatisé ; aucune relecture clinique humaine |
| 84 | `linezolide-iv-po` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 84 | `linezolide-iv-po` | L2 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 85 | `nitrofurantoine-po` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 86 | `tedizolide-po` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 87 | `bedaquiline-po` | L1 | p.12 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 88 | `delamanide-po` | L1 | p.12 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 89 | `ethambutol-m-iv-po` | L1 | p.12 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 90 | `isoniazide-im-iv-po` | L1 | p.12 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 91 | `pyrazinamide-po` | L1 | p.12 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 92 | `rifabutine-po` | L1 | p.12 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 92 | `rifabutine-po` | L2 | p.12 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source.  Contrôle automatisé ; aucune relecture clinique humaine |
| 93 | `rifampicine-iv-po` | L1 | p.12 | [M] | cas 15 : artefact OCR d’exposant normalisé en 2e/3e jour.  Contrôle automatisé ; aucune relecture clinique humaine |
| 93 | `rifampicine-iv-po` | L2 | p.12 | [M] | cas 15 : artefact OCR d’exposant normalisé en 2e/3e jour.  Contrôle automatisé ; aucune relecture clinique humaine |

## Lignes conservées uniquement pour leurs notes

`teicoplanine-po`, `vancomycine-po`

## État de mise en service

- Le sélecteur V2 est raccordé à la page `antibio-renal` dans un panneau en français uniquement. Il reçoit le DFG CKD-EPI brut déjà calculé par la page ; aucune équation ni méthode de calcul rénal n’a été changée. Le médecin choisit le médicament et, lorsqu’il existe plusieurs lignes, l’indication/le schéma ; le code ne choisit pas entre ces contextes.
- Le drapeau `ATB_RENAL_V2_ENABLED` reste `false` en production : l’ancien tableau reste la seule source affichée. En développement uniquement, un bouton explicite ouvre les posologies V2 en mode revue, avec un avertissement « ne pas prescrire » ; cette prévisualisation ne vaut ni revue clinique ni autorisation d’activation.
- La note de traçabilité explique la réconciliation 198→200 par les quatre cas documentés plus haut. Le nombre V5 de 184 n’est pas réconcilié et son mode de comptage reste inconnu ; aucune explication n’est inventée.
- Les champs `ar` de la base sont provisoires et non traduits ; le panneau intégré n’en affiche aucun. La revue humaine des posologies, des écarts de parité et la vérification locale tunisienne restent nécessaires avant toute activation clinique.

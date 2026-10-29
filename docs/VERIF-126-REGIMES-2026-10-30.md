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

La revue des écarts de parité par un professionnel reste à faire. Le drapeau reste fermé et aucune donnée V2 n’est affichée dans la page.

## Validation logicielle

Après ajout de la matrice des 200 seuils, des tests différentiels et de la réconciliation géométrique par ligne : **859 tests Vitest réussis**, `tsc --noEmit` réussi et ESLint réussi sur les fichiers V2, le moteur et les quatre suites de tests concernées. Les messages jsdom sur `window.scrollTo()` restent des avertissements de l’environnement de test ; la suite termine avec succès.

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

| N° | Identifiant conservé | Ligne | PDF | Statut | Résultat |
|---:|---|---|---:|:---:|---|
| 1 | `amoxicilline-po` | L1 | p.1 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 1 | `amoxicilline-po` | L2 | p.1 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 2 | `amoxicilline-iv` | L1 | p.1 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 2 | `amoxicilline-iv` | L2 | p.1 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 3 | `amoxicilline-acide-clavulanique-po` | L1 | p.1 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 4 | `amoxicilline-acide-clavulanique-iv` | L1 | p.1 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 4 | `amoxicilline-acide-clavulanique-iv` | L2 | p.1 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 5 | `ampicilline-sulbactam-iv` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 5 | `ampicilline-sulbactam-iv` | L2 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 6 | `ampicilline-sulbactam-im` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 7 | `benzathine-benzylpenicilline-im` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 7 | `benzathine-benzylpenicilline-im` | L2 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 8 | `benzylpenicilline-sodique-im-ou-iv` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 9 | `cloxacilline-po` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 10 | `cloxacilline-iv` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 11 | `oxacilline-iv` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 12 | `phenoxymethyl-penicilline-po` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 13 | `piperacilline-iv` | L1 | p.2 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 14 | `piperacilline-tazobactam-iv` | L1 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 15 | `pivmecillinam-po` | L1 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 16 | `temocilline-iv` | L1 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 16 | `temocilline-iv` | L2 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 17 | `aztreonam-im` | L1 | p.3 | [C] | Concorde ; les fractions non chiffrées sont dans L2. |
| 17 | `aztreonam-im` | L2 | p.3 | [M] | cas 12 : contextes d’indication distincts ; ½ et ¼ conservés en texte. |
| 18 | `aztreonam-iv` | L1 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 18 | `aztreonam-iv` | L2 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 19 | `cefaclor-po` | L1 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 20 | `cefadroxil-po` | L1 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 21 | `cefalexine-po` | L1 | p.3 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 22 | `cefazoline-im-iv` | L1 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 22 | `cefazoline-im-iv` | L2 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 23 | `cefepime-iv-im-possible` | L1 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 23 | `cefepime-iv-im-possible` | L2 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 23 | `cefepime-iv-im-possible` | L3 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 24 | `cefiderocol-iv` | L1 | p.4 | [M] | cas 1 : note ≥120 mL/min séparée de la ligne posologique. |
| 25 | `cefixime-po` | L1 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 26 | `cefotaxime-im-iv` | L1 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 26 | `cefotaxime-im-iv` | L2 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 26 | `cefotaxime-im-iv` | L3 | p.4 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 27 | `cefoxitine-iv` | L1 | p.5 | [C] | Concorde ; la cellule « Aucune donnée » concerne L2. |
| 27 | `cefoxitine-iv` | L2 | p.5 | [M] | cas 17 : L2 : référence ≥60, « Aucune donnée » sous 60. |
| 28 | `cefpodoxime-proxetil-po` | L1 | p.5 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 29 | `ceftaroline-fosamil-iv` | L1 | p.5 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 30 | `ceftazidime-im-iv` | L1 | p.5 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 30 | `ceftazidime-im-iv` | L2 | p.5 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 31 | `ceftazidime-avibactam-iv` | L1 | p.5 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 31 | `ceftazidime-avibactam-iv` | L2 | p.5 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 32 | `ceftobiprole-iv` | L1 | p.5 | [C] | Concorde ; la résolution du cas 2 concerne uniquement L2. |
| 32 | `ceftobiprole-iv` | L2 | p.5 | [M] | cas 2 : L2 limité à DFG ≥50 ; ajout « Aucune donnée » sous 50. |
| 33 | `ceftolozane-tazobactam-iv` | L1 | p.5 | [C] | Concorde ; les deux régimes sont conservés séparément. |
| 33 | `ceftolozane-tazobactam-iv` | L2 | p.5 | [M] | cas 3 : deux contextes présents dans des cellules fusionnées. |
| 34 | `ceftriaxone-im-iv` | L1 | p.6 | [C] | Concorde ; le fractionnement des contextes et la note concernent l’ensemble de la ligne. |
| 34 | `ceftriaxone-im-iv` | L2 | p.6 | [M] | cas 4 : deux indications et note méningée d’une cellule pleine largeur. |
| 35 | `cefuroxime-axetil-po` | L1 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 36 | `cefuroxime-iv` | L1 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 37 | `ertapenem-iv` | L1 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 38 | `imipenem-cilastatine-iv` | L1 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 38 | `imipenem-cilastatine-iv` | L2 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 38 | `imipenem-cilastatine-iv` | L3 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 39 | `imipenem-cilastatine-relebactam-iv` | L1 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 40 | `meropenem-iv` | L1 | p.6 | [M] | cas 5 : note de monitorage séparée de la dose. |
| 41 | `meropenem-vaborbactam-iv-atb-de-reserve` | L1 | p.6 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 42 | `amikacine-iv` | L1 | p.7 | [M] | cas 6 : avertissement TDM permanent. |
| 43 | `gentamicine-im-iv` | L1 | p.7 | [M] | cas 7 : avertissement TDM permanent. |
| 44 | `tobramycine-im-iv` | L1 | p.7 | [M] | cas 8 : avertissement TDM permanent. |
| 45 | `ciprofloxacine-po` | L1 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 46 | `ciprofloxacine-iv` | L1 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 47 | `delafloxacine-po` | L1 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 48 | `delafloxacine-iv` | L1 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 49 | `levofloxacine-iv-po` | L1 | p.7 | [C] | Concorde ; le seuil de L1 reste distinct de celui de L2. |
| 49 | `levofloxacine-iv-po` | L2 | p.7 | [M] | cas 16 : seuils vérifiés séparément par ligne. |
| 50 | `moxifloxacine-iv-po` | L1 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 51 | `norfloxacine-po` | L1 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 52 | `ofloxacine-iv-po` | L1 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 52 | `ofloxacine-iv-po` | L2 | p.7 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 53 | `dalbavancine-iv` | L1 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 54 | `oritavancine-iv` | L1 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 55 | `teicoplanine-im-iv` | L1 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 55 | `teicoplanine-im-iv` | L2 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 57 | `vancomycine-iv` | L1 | p.8 | [M] | cas 10 : note TDM distincte de la dose. |
| 59 | `metronidazole-po` | L1 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 59 | `metronidazole-po` | L2 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 59 | `metronidazole-po` | L3 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 60 | `metronidazole-iv` | L1 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 60 | `metronidazole-iv` | L2 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 61 | `ornidazole-iv-po` | L1 | p.8 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 62 | `azithromycine-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 63 | `clarithromycine-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 63 | `clarithromycine-po` | L2 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 64 | `clarithromycine-iv` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 65 | `clindamycine-iv-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 66 | `erythromycine-iv-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 67 | `pristinamycine-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 68 | `roxithromycine-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 69 | `spiramycine-iv-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 69 | `spiramycine-iv-po` | L2 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 70 | `spiramycine-metronidazole-po` | L1 | p.9 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 71 | `cotrimoxazole-iv-po` | L1 | p.10 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 72 | `sulfadiazine-po` | L1 | p.10 | [M] | cas 18 : séparateurs de retours à la ligne harmonisés ; texte non chiffré préservé. |
| 73 | `trimethoprime-po` | L1 | p.10 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 74 | `doxycycline-iv-po` | L1 | p.10 | [M] | cas 13 : note source complémentaire conservée. |
| 75 | `lymecycline-po` | L1 | p.10 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 75 | `lymecycline-po` | L2 | p.10 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 76 | `minocycline-po` | L1 | p.10 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 77 | `tigecycline-iv` | L1 | p.10 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 77 | `tigecycline-iv` | L2 | p.10 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 78 | `acide-fusidique-iv-po` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 79 | `colistine-iv-colistimethate-sodique` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 80 | `daptomycine-iv` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 80 | `daptomycine-iv` | L2 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 81 | `fidaxomicine-po` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 82 | `fosfomycine-trometamol-po` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 83 | `fosfomycine-iv` | L1 | p.11 | [M] | cas 14 : verbatim PDF corrigé au singulier « en perfusion ». |
| 84 | `linezolide-iv-po` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 84 | `linezolide-iv-po` | L2 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 85 | `nitrofurantoine-po` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 86 | `tedizolide-po` | L1 | p.11 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 87 | `bedaquiline-po` | L1 | p.12 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 88 | `delamanide-po` | L1 | p.12 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 89 | `ethambutol-m-iv-po` | L1 | p.12 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 90 | `isoniazide-im-iv-po` | L1 | p.12 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 91 | `pyrazinamide-po` | L1 | p.12 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 92 | `rifabutine-po` | L1 | p.12 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 92 | `rifabutine-po` | L2 | p.12 | [C] | Concorde avec la grille (texte, nombre de cellules et seuils) et page source. |
| 93 | `rifampicine-iv-po` | L1 | p.12 | [M] | cas 15 : artefact OCR d’exposant normalisé en 2e/3e jour. |
| 93 | `rifampicine-iv-po` | L2 | p.12 | [M] | cas 15 : artefact OCR d’exposant normalisé en 2e/3e jour. |

## Lignes conservées uniquement pour leurs notes

`teicoplanine-po`, `vancomycine-po`

## État de mise en service

- Le module de travail demeure dans `data/atb-renal-v2.ts` ; il n’est pas importé par la page clinique.
- Toutes les lignes portent `traductionStatut: "ar-provisoire"` : les textes arabes copient encore le français et doivent toujours être accompagnés de leur badge.
- La convention E1–E4 est documentée séparément ; le moteur devra être relié à l’interface seulement après les tests de parité et la revue humaine exigés par le cahier V5.

# Revue des écarts textuels — Annexe 1 OMEDIT (2026-10-25)

## Périmètre

Comparaison de l'Annexe 1 du brief de continuation avec l'archive `data/issues/OMEDIT-ATB-IR-V2.3.rows.json` et le PDF `data/issues/OMEDIT-ATB-IR-V2.3-avril2026.pdf` (version 2.3, avril 2026). Le contrôle couvre 93 médicaments : 126 lignes dans l'annexe, 129 dans le JSON, et 123 comparaisons non vides. Après normalisation typographique, 106/123 valeurs concordent ; 17 différences textuelles ont été examinées. La comparaison n'est ni une validation médicale ni une validation de l'exhaustivité du tableau.

## Différences sans nouvelle règle de dose

| Entrée | Constat | Traitement retenu |
|---|---|---|
| Céfoxitine, ligne « infection peu grave » | `1 g` / `1g` : espace autour de l'unité. | Typographie seulement ; aucun changement de valeur. |
| Méropénem + vaborbactam | Espaces variables autour des unités (`1 g`, `0,5 g`). | Typographie seulement. |
| Délafloxacine IV | Espaces variables dans `12 h`. | Typographie seulement. |
| Norfloxacine | Espace variable dans `12 à 24 h`. | Typographie seulement. |
| Ornidazole | `1 à 1,5 g/24h` / `1 à 1,5g /24h`. | Typographie seulement. |
| Fosfomycine IV | `en perfusions` dans l'annexe contre `en perfusion` dans le texte extrait ; le PDF porte la formulation au singulier. | Conserver le texte source ; ne pas changer de dose ni de fréquence. |
| Rifampicine | L'annexe écrit `2e`/`3e`; l'extraction JSON donne `2 ou me 3`. L'image de la page 12 montre `2ᵐᵉ`/`3ᵐᵉ` en exposant. | Écart de rendu/extraction de l'ordinal, pas de règle posologique. Le JSON brut n'est pas modifié. |
| Céfoxitine, infection grave | Le JSON inclut l'intitulé de contexte dans la cellule de référence ; l'annexe le place dans le libellé de la ligne. Les cellules basses indiquent « Aucune donnée ». | Même contexte et même mention d'absence de donnée ; garder ces cellules non calculables. |
| Céfidérocol | La valeur de référence du JSON contient aussi la note de clairance élevée `≥120 mL/min : 2 g/6h`; l'annexe la sépare en NOTE. | Note présente des deux côtés. Ne pas la transformer en seuil de réduction rénale. |
| Doxycycline | Le JSON concatène à la référence la note sur les autres indications ; l'annexe conserve la même note séparément. | Différence de regroupement seulement ; conserver la séparation référence/note. |

## Différences de structure qui bloquent une migration automatique

- **Ceftobiprole :** la relecture visuelle de la p.5 confirme une seule ligne physique : la cellule de référence juxtapose `500 mg/8h` et « si infection sévère : `1 g/8h` », tandis que les cellules rénales portent `500 mg/12h`, `250 mg/12h` et `250 mg/24h` sans libellé sévère. L'annexe les sépare en deux contextes. Dans le modèle 5-stades, les valeurs rénales sont conservées sur la ligne de base structurée ; elles ne sont pas réutilisées pour la variante sévère, pour laquelle aucune dose rénale unique n'est explicitement attribuée. Le contexte reste à confirmer ; l'action « Retenir » est bloquée. Cette séparation est un choix de représentation prudent, pas une validation clinique.
- **Ceftolozane + tazobactam :** la page 5 du PDF a été rendue et relue visuellement cellule par cellule. Elle distingue bien le schéma standard et la pneumonie nosocomiale dans deux lignes, avec leurs propres cellules rénales ; dans IRC modérée, plusieurs textes source se chevauchent et aucune valeur unique n'est sélectionnée. Les deux contextes sont maintenant étiquetés dans les données, `contextReviewRequired` bloque l'action « Retenir » car l'interface ne demande pas l'indication, et les valeurs ambiguës restent bloquées. Cette correction structurelle n'ajoute ni dose ni règle clinique.
- **Ceftriaxone :** le PDF a une cellule pleine largeur avec les textes « infection modérée », « infection sévère », la posologie neuroméningée et « aucune donnée chez l'insuffisant rénal ». L'annexe répartit les contextes en lignes, sans créer de paliers rénaux. Ce contenu ne constitue pas une règle de dose rénale ; « aucune donnée » ne signifie pas « dose inchangée ».
- **Amikacine, gentamicine et tobramycine :** les doses de référence et les recommandations de surveillance sont séparées par la mise en page du PDF ; la note de surveillance couvre les colonnes rénales. Elle indique notamment de ne pas diminuer la dose unitaire et d'espacer/monitorer si des injections multiples sont nécessaires. Ce n'est pas une dose calculable ni une autorisation de recopier la dose de référence dans les colonnes rénales. Garder une sortie bloquée ou informative avec renvoi explicite à la note, sans automatiser un intervalle.
- **Vancomycine IV :** les cellules rénales renvoient à l'adaptation par concentration plasmatique à l'équilibre. Cette note ne fournit pas de schéma numérique sélectionnable par DFG ; pas de calcul automatique.

## Vérification visuelle complète de la page 5 — 2026-10-27

La page 5 du PDF versionné a été rendue à 2× puis comparée aux rectangles et textes de `data/issues/OMEDIT-ATB-IR-V2.3.rows.json`. Les sept lignes médicament de la page ont été relues :

| Ligne | Constat source | Traitement dans les données |
|---|---|---|
| Céfoxitine IV | Deux contextes (infection peu grave / infection grave et CMI élevée). La première ligne traverse plusieurs cellules en IRC modérée et terminale ; la seconde a une cellule fusionnée « Aucune donnée » pour tout DFG < 60. | Contextes séparés et « Retenir » bloqué faute de choix d'indication. L'ambiguïté reste limitée à la première ligne ; les trois valeurs « Aucune donnée » sont conservées sur la seconde. |
| Cefpodoxime PO | Une ligne sans contexte distinct, cellules correspondant aux cinq stades. | Transcription conservée. |
| Ceftaroline IV | La cellule de transition modérée recoupe deux textes source. | Aucun choix unique en IRC modérée ; les deux textes restent dans la note de vérification. |
| Ceftazidime IM/IV | Les schémas d'administration discontinue et continue ont des cellules rénales différentes. | Deux contextes séparés ; « Retenir » bloqué tant que le mode d'administration n'est pas recueilli. |
| Ceftazidime + avibactam IV | Les schémas discontinu et continu sont distincts ; la cellule modérée recoupe plusieurs textes et des données continues manquent dans les stades indiqués. | Contextes séparés ; cellule modérée bloquée et libellés source « Aucune donnée » conservés. |
| Ceftobiprole IV | La référence juxtapose le schéma de base et une variante d'infection sévère sans attribuer cette dernière aux cellules rénales. | Contextes séparés ; aucune adaptation rénale n'est attribuée à la variante sévère ; « Retenir » bloqué. |
| Ceftolozane + tazobactam IV | Deux schémas (standard / pneumonie nosocomiale) ; la cellule modérée recoupe plusieurs textes pour chacun. | Contextes séparés ; ambiguïtés conservées et « Retenir » bloqué faute de choix d'indication. |

Pour ces lignes, le blocage est une protection de représentation : l'interface actuelle ne demande pas le contexte requis. Cette relecture n'ajoute ni dose ni seuil et ne constitue pas une validation clinique indépendante.

## Vérification visuelle complète de la page 6 — 2026-10-27

La page 6 a également été rendue et comparée cellule par cellule aux coordonnées et textes archivés. Les huit lignes médicament ont été vérifiées :

| Ligne | Constat source | Traitement dans les données |
|---|---|---|
| Ceftriaxone IM/IV | Une cellule pleine largeur contient des consignes d'indication, puis « Aucune donnée chez l'insuffisant rénal ». | Conservée comme `info` non calculable ; aucune dose rénale n'est dérivée. |
| Cefuroxime axétil PO | Une ligne avec cellule de référence fusionnée, puis les stades rénaux distincts. | Textes recopiés dans les cinq colonnes. |
| Cefuroxime IV | Quatre cellules distinctes correspondent aux stades affichés. | Textes recopiés dans les cinq colonnes. |
| Ertapénem IV | Une cellule couvre normorénal à modéré ; la seconde couvre sévère et terminal. | Valeurs alignées sur les stades affichés. |
| Imipénem + cilastatine IV | Trois lignes source non nommées ont des cellules rénales différentes ; dans les stades léger, modéré et sévère, chaque ligne recoupe plusieurs cellules. Le PDF ne précise pas l'indication/contexte de ces trois lignes. | Les trois lignes sont identifiées comme lignes source, sans leur inventer de contexte ; cellules ambiguës bloquées et action « Retenir » désactivée faute de contexte. |
| Imipénem + cilastatine + relebactam IV | Une ligne source, note d'unité « posologies exprimées en mg d'imipénem », et « Aucune donnée » en terminal. | Texte et note d'unité conservés ; pas de calcul sur « Aucune donnée ». |
| Méropénem IV | Une ligne de dose avec cellules multiples en modéré/sévère ; note transversale de monitorage des posologies élevées. | Les cellules ambiguës restent bloquées ; la consigne de monitorage est conservée séparément des doses. |
| Méropénem + vaborbactam IV | La cellule de référence est distincte ; les cellules modérée, sévère et terminale recoupent plusieurs textes. | Aucun choix de dose unique dans ces trois stades ; les autres textes source restent affichés dans les notes de revue. |

La note générale de contexte dans l'interface a été rendue neutre : elle ne présente plus toutes les situations comme une variante d'infection sévère. Le blocage est appliqué seulement aux lignes marquées, sans transformer les valeurs sources ni leur attribuer une indication absente du PDF.

## Vérification visuelle complète de la page 7 — 2026-10-27

La page 7 a été rendue en image et ses onze lignes médicament rapprochées du texte et des coordonnées archivés :

| Ligne | Constat source | Traitement dans les données |
|---|---|---|
| Amikacine, gentamicine, tobramycine | Le chiffre posologique apparaît dans la cellule normorénale ; une note commune est fusionnée sur les quatre colonnes d'IRC. | Les doses ne sont pas propagées aux stades d'IRC. La note est conservée pour les quatre stades concernés ; aucune fréquence de dose n'est déduite. |
| Ciprofloxacine PO | Trois cellules : schéma initial, cellule modérée, cellule fusionnée sévère/terminale. | Valeurs recopiées selon les cellules source. |
| Ciprofloxacine IV | Trois plages : 8 à 12 h, 12 h, puis 24 h. | Alignement vérifié avec les cellules. |
| Délafloxacine PO | La valeur affichée jusqu'au stade sévère est distincte de « Déconseillé » en terminal. | La valeur terminale n'est pas extrapolée. |
| Délafloxacine IV | Valeur de référence en perfusion, cellule distincte au stade sévère, puis « Déconseillé » en terminal. | Texte, durée de perfusion et changements de stade conservés. |
| Lévofloxacine IV/PO | Deux lignes : schéma général et cystite non compliquée. Certaines cellules modérées/sévères recouvrent plusieurs textes. | Les deux lignes sont nommées selon le texte source ; sélection bloquée faute de choix d'indication. Les cellules ambiguës ne produisent pas de dose unique. |
| Moxifloxacine IV/PO | Une cellule fusionnée porte la même valeur sur toute la largeur rénale. | Valeur conservée sans introduire de seuil. |
| Norfloxacine PO | Une valeur commune jusqu'au stade modéré puis une cellule sévère/terminale distincte. | Alignement vérifié avec les plages du PDF. |
| Ofloxacine IV/PO | Deux lignes explicites : « Dose usuelle » et « Infection sévère » ; plusieurs cellules modérées/sévères se chevauchent. | Lignes et contextes conservés séparément ; « Retenir » bloqué sans sélection de contexte ; les cellules ambiguës restent sans dose unique. |

Les contextes de lévofloxacine et d'ofloxacine sont affichés, mais aucun contrôle d'indication n'existe encore dans l'interface : la mesure de sécurité pour ces deux lignes est donc le blocage, non une sélection présumée. La note commune des aminosides reste limitée aux stades d'IRC, distincte des doses normorénales.

## Vérification visuelle complète de la page 8 — 2026-10-27

La page 8 et ses neuf lignes médicament ont été comparées visuellement au texte et aux géométries archivés :

| Ligne | Constat source | Traitement dans les données et l'interface |
|---|---|---|
| Dalbavancine IV | Chaque plage rénale affiche deux schémas alternatifs séparés par « OU ». | Les deux propositions restent intégralement visibles ; « Retenir » reste bloqué, car l'interface ne recueille pas le choix du schéma. |
| Oritavancine IV | Une dose unique apparaît jusqu'au stade modéré ; « Aucune donnée » couvre sévère et terminal. | Valeurs et absence de données conservées séparément. |
| Teicoplanine IM/IV | Deux lignes distinctes, explicitement « Infection peu sévère » et « Infection sévère ». | Deux contextes nommés, aucune ligne choisie automatiquement ; action bloquée sans sélection de contexte. |
| Teicoplanine PO | La cellule indique le contexte diarrhée/colite à *Clostridium difficile*. | Contexte explicite visible ; action bloquée tant que l'interface ne recueille pas l'indication. |
| Vancomycine IV | La cellule normorénale comprend dose de charge puis fourchette pondérale ; les cellules d'IRC demandent d'adapter à la concentration plasmatique à l'équilibre. | Textes conservés par stade ; l'adaptation pharmacocinétique reste une consigne source, aucun chiffre rénal n'est inventé. |
| Vancomycine PO | Le contenu entier est un texte conditionnel sur le traitement des infections à *C. difficile*. | Conservé comme consigne informative ; aucun bouton de décision de dose n'est généré pour ce texte. |
| Métronidazole PO | Trois lignes de dose sans contexte propre indiqué par le tableau. | Lignes sources repérées séparément sans nommer d'indication inventée ; action bloquée. |
| Métronidazole IV | Deux lignes de dose sans contexte propre indiqué par le tableau. | Lignes sources conservées et action bloquée sans choix documenté. |
| Ornidazole IV/PO | La dose est explicitement limitée aux infections à germes anaérobies. | Condition source affichée ; action bloquée faute de collecte de l'indication. |

Les ambiguïtés de choix ne sont pas comblées par des recommandations externes ou une déduction d'indication. Les textes de source sont préservés et les contrôles bloquent seulement les lignes pour lesquelles l'interface n'enregistre pas encore le contexte ou le schéma requis.

## Synthèse visuelle des pages 1–4 et 9–12 — revue complète du PDF au 2026-10-27

Les huit pages restantes ont été rendues en images et comparées à leurs coordonnées, séparations de lignes, textes source et valeurs par cellule. La vérification des douze pages couvre les 93 lignes médicament du PDF. Résumé des points nécessitant une garde d'interface sur les pages ajoutées à cette revue :

| Page | Lignes vérifiées | Contextes/choix conservés séparément et non sélectionnés implicitement |
|---:|---:|---|
| 1 | 4 | Amoxicilline PO/IV : deux lignes sans indication précisée ; amoxicilline-clavulanate IV : deux lignes sans indication précisée. Les trois lignes concernées affichent leur numéro source, sans contexte clinique inventé. |
| 2 | 9 | Ampicilline-sulbactam IV : posologie usuelle vs Acinetobacter spp ; benzathine benzylpénicilline : deux schémas sans contexte nommé ; cloxacilline IV et oxacilline IV : deux modalités « OU » dans la même cellule. |
| 3 | 8 | Témocilline : administration intermittente vs continue ; aztréonam IM : cystite/gonococcie non compliquée vs infection urinaire haute et/ou compliquée ; aztréonam IV : infection peu sévère vs sévère. |
| 4 | 5 | Céfazoline : infection peu sévère vs sévère ; céfépime : trois contextes sources ; céfotaxime : schéma standard, infection ostéo-articulaire et infection méningée. |
| 9 | 9 | Azithromycine : schémas selon l'indication ; clarithromycine PO : deux lignes sans contexte précisé ; spiramycine : voie orale vs IV. |
| 10 | 7 | Sulfadiazine : préventif vs curatif ; triméthoprime : cystite aiguë non compliquée ; doxycycline : seuil de poids/indications ; lymécycline : ligne non précisée vs acné ; tigécycline : infection non sévère vs sévère. |
| 11 | 9 | Daptomycine : infection non sévère vs sévère ; fosfomycine trométamol : cystite chez la femme/l'adolescente > 12 ans ; linézolide : schéma standard vs infection grave de réanimation. |
| 12 | 7 | Rifabutine : traitement curatif vs préventif ; rifampicine : tuberculose vs infection à germes Gram + ou -. |

Les valeurs, cellules fusionnées, « Aucune donnée », « Déconseillé » et contre-indications des autres lignes ont été confrontés au rendu source ; aucun seuil DFG ou schéma thérapeutique n'a été déduit de la géométrie. Pour chaque variante signalée, le texte source reste affiché et « Retenir » est bloqué car l'interface ne recueille pas ce choix.

## Écarts de nombre de lignes sans différence de contenu utile au sélecteur

Les différences de regroupement observées comprennent aussi : une note distincte de surveillance pour le méropénem ; des notes distinctes pour les aminosides ; et les lignes PO de teicoplanine et de vancomycine, qui décrivent des traitements d'infections à *Clostridium difficile* sans paliers rénaux. Elles sont conservées comme contexte dans l'annexe, mais ne doivent pas devenir des segments rénaux. Les nombres de lignes ne sont donc pas comparables directement entre les deux formats.

## Décision d'implémentation

La revue du modèle continu ne migre aucune posologie ni borne clinique. Elle a toutefois déclenché une correction de structure prudente et distincte dans le modèle 5-stades pour Ceftobiprole : les deux contextes sont séparés, les valeurs rénales ne sont pas attribuées à la variante sévère, et « Retenir » est bloqué sans confirmation d'indication. Comme les anciens snapshots du plan local ne conservent pas ce contexte, le stockage actif passe à `eutn:atb-plan-v3` : les plans v1/v2 non vides sont détectés mais non importés, et restent conservés sur l'appareil pour éviter leur réutilisation silencieuse. Ils doivent être reconstruits et revérifiés depuis la source. `data/issues/tools-export-atb-continuous-cells.py` a produit une archive candidate de géométrie seule (93 médicaments, 129 lignes, 327 cellules, 60/60 frontières internes mappées) ; les textes ne sont pas classés comme doses et les égalités restent non vérifiées. Cette archive n'est pas importée par l'application.

Le sélecteur pur `lib/atb-renal-dose.ts` reste non raccordé à `data/atb-renal.ts` et à l'interface ; il impose maintenant une indication, une voie, une provenance, un type explicite pour chaque cellule et une décision vérifiée sur l'égalité de chaque seuil. À l'égalité non vérifiée, il bloque au lieu de choisir un côté. Avant une migration, il faut représenter séparément les contextes/indications et les cellules « note seulement », « aucune donnée » ou « surveillance requise », puis vérifier chaque association dose-cellule à la source. La géométrie des limites (audit séparé : 60/60) ne détermine ni l'inclusion à l'égalité ni la portée clinique d'une note.

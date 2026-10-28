# Journal des modifications — Espace Urgence TN

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) · Versionnage [SemVer](https://semver.org/lang/fr/).
Toutes les dates sont au format `AAAA-MM-JJ`.

> **Rappel sécurité médicale** : aucun contenu clinique n'est modifié sans mention explicite
> dans la section « Contenu médical ». La traçabilité `sources` + `lastReviewed` n'est pas présente
> sur chaque jeu/entrée et ne constitue pas une validation indépendante ; toute donnée clinique doit
> être revue par un médecin/pharmacien tunisien avant usage.

---

## [Unreleased] — 2026-10-28

### Données
- Audit DPM Phase C (partiel, tranches 113–140) : aucun nouveau `brands` validé ; exclusions documentées et filtres/tests de recherche renforcés pour les associations amoxicilline-clavulanate, formes combinées inhalées, patchs de fentanyl et solutions salines/bicarbonate hors concentration correspondante.
- Audit DPM Phase C (partiel, tranches ciblées 45–64, 91–96 et 104–112) : aucun nouveau `brands` validé ; deux présentations injectables de clindamycine sans voie précisée reclassées en exclusions, avec tests de recherche négatifs ; total révisé : 344 correspondances confirmées et 537 exclusions documentées.

### Corrigé
- Les entrées manquantes et références croisées invalides sont bloquées par des tests :
  catégorie `avc`, liens calculateur/protocole, alternatives médicamenteuses, liens et branches des arbres.
- Calcul rénal : une clairance invalide ne devient plus « normale » ; une créatinine > 20 mg/dL n'est
  plus convertie silencieusement et suspend l'affichage des posologies jusqu'à vérification.
- Le parcours rénal est maintenant explicite (stable/chronique connu, aigu/variable, inconnu) et démarre sur « inconnu » : une créatinine isolée peut donner un DFG estimatif, mais n'active aucune grille de fonction stable. Un AKI déclaré ou détecté KDIGO bloque les grilles stables même si les autres résultats sont absents.
- Le pont général Cockcroft–Gault accepte les valeurs historiques à 48 h/7 j et la diurèse pour le repérage KDIGO ; dialyse, AKI, parcours aigu/inconnu et choix de poids idéal bloquent l'affichage des doses.
- Pont général rénal : retrait des anciennes posologies non sourcées (metformine, anticoagulants, opioïdes, AINS, colchicine, etc.). Les médicaments non couverts restent nommés comme lacunes, sans dose ; seules les lignes dotées d'un RCP individuel lié peuvent être actives.
- Séparation rénale corrigée : CKD-EPI 2021 (DFG indexé) seul sélectionne une colonne du tableau adulte ; Cockcroft–Gault (ClCr) reste affiché séparément et n'influence jamais ce choix.
- Retrait de la règle automatique non sourcée « DFG 30–90 dégradé → +2 stades » et de son exception « molécules vitales » : aucune référence primaire/édition/phrase vérifiable ne justifiait cette règle précise.
- Stadification KDIGO corrigée : diurèse des stades 1/2/3, anurie ≥12 h, et stade 3 à créatinine ≥4 mg/dL seulement avec hausse aiguë ≥0,5 mg/dL. Tout critère d'AKI bloque les doses et toute sélection automatique ou manuelle dans le tableau de fonction rénale stable.
- Dialyse/épuration extrarénale : le statut de dialyse en cours bloque les stades, doses et choix manuels sans être assimilé à lui seul à une AKI. Seule l'initiation déclarée pendant l'épisode aigu compte comme critère KDIGO de stade 3.
- DFG exactement égal à 30 : l'ambiguïté des deux colonnes source bloque le stade et la dose
  automatiques ; le choix manuel exige une confirmation de relecture professionnelle.
- Tableau OMEDIT : les colonnes rénales fusionnées des aminosides ne reçoivent plus par copie la
  posologie quotidienne de la colonne normorénale ; un marqueur bloque calcul, inférence voisine
  et action « Retenir ».
  La seconde mention répétée du Céfidérocol est conservée comme note source ; la traduction arabe
  des aminosides ne surinterprète plus « une injection unique » en « une injection par jour ».
- Page 5 OMEDIT : relecture visuelle des sept médicaments et rapprochement des cellules avec les géométries archivées. Les contextes distincts de Céfoxitine (sévérité/CMI), Ceftazidime (continu/discontinu), Ceftazidime-avibactam et Ceftolozane-tazobactam sont étiquetés et bloqués sans choix de contexte ; les cellules ambiguës restent bloquées. Correction de Céfoxitine : la cellule fusionnée « Aucune donnée » est conservée pour les trois stades rénaux inférieurs à 60.
- Page 6 OMEDIT : relecture visuelle des huit médicaments. Les trois lignes d'imipénem-cilastatine dont le PDF ne précise pas le contexte sont étiquetées sans interprétation et non sélectionnables ; les ambiguïtés de stades restent bloquées. La consigne de monitorage du méropénem demeure séparée des cellules de dose, et Ceftriaxone reste une consigne non calculable.
- Page 7 OMEDIT : relecture visuelle des onze médicaments. Les notes communes des aminosides restent bornées aux quatre colonnes d'IRC ; les contextes « cystite non compliquée » (lévofloxacine) et « infection sévère » (ofloxacine) restent distincts et non sélectionnables faute de choix de contexte ; ambiguïtés des cellules modérées/sévères conservées.
- Page 8 OMEDIT : relecture visuelle des neuf médicaments. Les schémas alternatifs de dalbavancine, les lignes/contextes de teicoplanine et de métronidazole ainsi que l'indication explicite de l'ornidazole ne sont pas choisis implicitement ; les actions de sélection sont bloquées tant que le contexte ou le schéma ne sont pas recueillis.
- Pages 1–4 et 9–12 OMEDIT : relecture visuelle complétée, avec vérification des 93 lignes des douze pages au total. Le générateur préserve 26 contextes/lignes conditionnels ou alternatifs et l'interface bloque « Retenir » sans choix explicite ; tests de données et de parcours UI ajoutés. Détails et limites consignés dans `docs/AUDIT-ATB-ANNEX1-DIFFS-2026-10-25.md`.
- Ceftobiprole IV : la cellule source p.5 mêle le schéma de base et la variante « si infection sévère ».
  Le générateur les sépare avec contexte explicite ; les valeurs rénales ne sont pas attribuées à la
  variante sévère, un marqueur bloque cette branche en IRC, et « Retenir » est désactivé sans
  confirmation du contexte. Aucune adaptation sévère n'est extrapolée.
- Moteur pondéral du PDF : les plafonds explicites (`4 g/24h`, `300 mg/j`, etc.) s'appliquent
  avant l'affichage du calcul, et ne sont plus interprétés comme des doses supplémentaires ; une
  limite illisible/incompatible bloque le résultat. « 1 fois/24h », « ou » et « puis » gardent
  leur sens source dans la formule affichée.
- Plan antibiotique : format local passé à v3 après les corrections de cellules/contextes ; les plans v1/v2 ne sont pas réimportés, restent conservés sur l'appareil et déclenchent un avertissement pour reconstruire et revérifier les snapshots de dose.
- Preset amikacine Panpharma dans `safe-dose` : aucun calcul avant confirmation de l'âge adulte, de ClCr ≥50 mL/min et d'un IMC calculable <30 ; en obésité, le RCP demande un poids corrigé que l'outil n'estime pas, donc il bloque au lieu d'utiliser le poids réel.
- Les fiches dont la configuration de calcul pondéral vaut zéro ne montrent plus « 0 mg ».
- Une pompe n'est plus dérivée silencieusement de la première préparation RE.NAU lorsqu'un même
  médicament a plusieurs indications (notamment héparine SCA/EP) ; il faut un choix contextuel explicite.
- Corrections typographiques FR/AR certaines dans les fiches atropine, amoxicilline, phényléphrine,
  noradrénaline et procédure d'intubation/pneumothorax.
- Les polices Inter et IBM Plex Sans Arabic sont auto-hébergées : le build statique ne dépend plus
  d'un accès à Google Fonts.
- README et architecture : avertissement de traçabilité et nombres actuels rectifiés.
- Reproductibilité du tableau OMEDIT : la note éditoriale d'attribution de l'amikacine est maintenant déclarée dans `PATCH.editorial_notes` et régénérée avec `data/atb-renal.ts`, au lieu d'être ajoutée manuellement après coup. Le rapport de comparaison vérifie de nouveau l'égalité octet par octet entre le générateur et les données servies ; correction de séparateur de ligne dans le rapport.

### Technique
- Service worker : correction du repli hors-ligne sous un sous-chemin (GitHub Pages), où la route pouvait être préfixée deux fois et la fiche déjà en cache ignorée. Ajout de tests d’exécution couvrant le cache à la racine, sous `basePath` et la page hors-ligne intégrée.
- IA contextuelle : ajout d’un bouton d’explication dans les sorties rénales sourcées ; le modèle reçoit le contexte minimal utile (DFG/ClCr calculé, poids seulement s’il sert au calcul mg/kg, texte source, résultat et limites). Chaque requête affiche les données transmises, le fournisseur et le modèle exacts, puis exige un consentement explicite ; si la destination change pendant la confirmation, l’envoi est bloqué jusqu’à nouvelle vérification. Aucune explication n’est persistée et l’IA ne recalcule ni ne recommande de dose.
- Configuration et documentation IA : clé API conservée en mémoire vive seulement (pas de persistance localStorage; anciennes valeurs purgées), documentation de déploiement réécrite en français avec commandes et limites actuelles, étapes de validation et exigences locales de confidentialité/clinique. L’audit global sépare désormais explicitement l’état historique de l’état actualisé après correctifs.
- Quiz IA : validation de schéma stricte des cinq questions, quatre choix et index de réponse borné ; refus des chiffres, unités et sorties malformées pour éviter de générer des doses/seuils numériques. Le thème et les références sources restent visibles ; avertissement renforcé et lien vers le quiz fixe. La validation du format ne garantit pas la vérité clinique des réponses.
- Transmission IA : avertissement avant saisie pour retirer les noms/identifiants et vérifier les règles de l’établissement ; chaque résultat est explicitement présenté comme brouillon non vérifié, à relire et corriger avant transmission.
- Recherche assistée par IA : les deux points d’entrée n’acceptent maintenant que 1–3 mots-clés médicaux nus, sans chiffres, prose ni chaîne surdimensionnée ; une sortie non conforme ne remplace pas la recherche initiale.
- Préparation au modèle rénal continu : `data/issues/tools-atb-threshold-audit.py` vérifie que les 60 coordonnées de frontières internes du PDF OMEDIT s'alignent sur ses graduations DFG imprimées ; `tools-export-atb-continuous-cells.py` génère une archive géométrique candidate (93 médicaments, 129 lignes, 327 cellules), non importable et sans classement clinique. Le sélecteur pur `lib/atb-renal-dose.ts` garde indication, voie, provenance et type de cellule séparés ; il requiert une politique d'égalité sourcée et bloque si elle est inconnue. Il n'est pas relié au calculateur.
- Revue des 17 écarts textuels de l'Annexe 1 avec le JSON et le PDF source ; les différences de contexte/indication à risque sont documentées dans `docs/AUDIT-ATB-ANNEX1-DIFFS-2026-10-25.md`. Aucune dose n'a été migrée.
- Sorties IA textuelles : confirmation avant transmission au fournisseur, avec modèle utilisé, aperçu du texte, avertissement sur les données de santé et coûts possibles. L'analyse ECG a un consentement distinct pour l'image; sa sortie est limitée à des observations descriptives filtrées, sans diagnostic, gravité, recommandations ou protocoles IA.
- Historique ECG : assainissement des résultats anciens au chargement; nouvelles analyses n'archivent pas la réponse brute IA; la réinitialisation générale efface aussi IndexedDB.
- Archive de patient : entrées locales assainies, supprimables individuellement ou globalement; avertissement visible sur l'absence d'expiration automatique. Une politique locale de conservation reste à établir.
- Dialogues modaux : confinement du focus, restauration du focus initial et arrière-plan `inert` étendus à l’avertissement médical, à la palette de commandes, au tiroir des abréviations et à l’aide d’installation PWA ; Échap ferme les aides non bloquantes.

### Contenu médical
- Réévaluation : correction des unités de glycémie (saisie en g/L) pour l'alerte d'hypoglycémie (<0,7 g/L, équivalent de 70 mg/dL selon ADA 2026). Le seuil associé à l'alerte surrénalienne est converti de 80 mg/dL à 0,8 g/L, mais demeure une heuristique non diagnostique à valider localement ; aucune validation clinique tunisienne n'est revendiquée.
- Hypoglycémie adulte : retrait de l'équivalence erronée « 1 ampoule G30 = 10 g ». Dose IV adulte retenue : 10–15 g selon la synthèse HAS 2025 des recommandations ADA 2024 ; à 30 %, cela correspond à environ 33–50 mL. Le RCP français GLUCOSE 30 % PROAMP précise 3 g/ampoule de 10 mL et une voie d'administration propre à cette présentation ; 4–5 ampoules apportent 12–15 g. La proposition du prompt « 40–80 mL, 2–3 ampoules » n'a pas été appliquée : elle combine 12–24 g et, pour les ampoules de 10 mL, 4–8 ampoules. Les notices tunisiennes SIPHAT/INFOMED et la conduite locale restent à valider par un clinicien/pharmacien tunisien. Sources : HAS <https://www.has-sante.fr/upload/docs/application/pdf/2025-07/synthese_des_recommandations_selectionnees_2025-07-07_17-27-10_870.pdf> ; RCP PROAMP <https://base-donnees-publique.medicaments.gouv.fr/medicament/68700190/extrait> (source française, non substitutive au RCP tunisien).
- Sufentanil pédiatrique : retrait de la valeur ambiguë « 0,005–0,01 µg/kg » sans unité de temps. Seule l'induction anesthésique IV chez l'enfant de plus d'un mois est reprise (0,2–0,5 µg/kg en bolus lent ≥30 s, avec un autre agent), conformément au RCP SUFENTA français ; aucune dose IV n'est recommandée par ce RCP chez le nouveau-né et aucune perfusion continue pédiatrique de sédation n'est extrapolée. RCP <https://agence-prd.ansm.sante.fr/php/ecodex/rcp/R0358566.htm> ; une revue locale reste requise avant usage.
- NaCl hypertonique : correction d'une formule dite « 3,7 % » qui donne réellement 4,08 % ; ajout d'un calcul théorique de composition à 3 % explicitement réservé à une préparation par la pharmacie selon procédure validée. Les poches prêtes à l'emploi restent préférées ; le calcul ne vaut pas validation de fabrication tunisienne. La surveillance de la natrémie et les plafonds existants sont conservés. Sources : European Clinical Practice Guideline on hyponatraemia (2014), <https://doi.org/10.1530/EJE-13-1020> ; RCP NaCl PROAMP 20 %, <https://base-donnees-publique.medicaments.gouv.fr/medicament/61078992/extrait> (source française, non substitutive à une procédure locale).
- Propofol : correction des limites pédiatriques et d'utilisation après ouverture selon le RCP Diprivan 10 mg/mL (France, mise à jour 2025). L'induction anesthésique est possible après 1 mois pour cette présentation ; la sédation en soins intensifs est contre-indiquée avant 16 ans. Pour Diprivan, l'administration non diluée peut durer jusqu'à 12 h, tandis que le produit dilué doit être préparé immédiatement et utilisé sous 6 h ; les reliquats ne sont pas conservés. Ces règles ne sont pas généralisées aux marques tunisiennes sans leurs RCP. Source : <https://base-donnees-publique.medicaments.gouv.fr/medicament/60616445/extrait>.
- Éclampsie : suppression du principe erroné donnant priorité à la vitalité fœtale pendant la crise. Le protocole indique désormais de stabiliser la mère avant la naissance ; après stabilisation, timing et voie d'accouchement sont décidés par l'équipe obstétricale selon les états maternel et fœtal et les facteurs obstétricaux. Il précise que l'éclampsie seule n'impose pas une césarienne. Source : ACOG Practice Bulletin No. 222 (2020), <https://www.preeclampsia.org/frontend/assets/img/advocacy_resource/Gestational_Hypertension_and_Preeclampsia_ACOG_Practice_Bulletin,_Number_222_1605448006.pdf> ; validation locale toujours nécessaire.
- Hémorragie digestive haute : retrait du furosémide hors indication. L'octréotide reste lié uniquement à la branche cirrhose/suspicion de varices ; l'acide tranexamique n'est pas ajouté, car l'ESGE ne le recommande pas dans l'hémorragie digestive haute non variqueuse et la proposition générique du prompt n'est pas sûre. Source : ESGE Guideline Update 2021, recommandation 9, <https://www.esge.com/assets/downloads/pdfs/guidelines/2021_a_1369_5274.pdf>. Revue locale requise.
- Centre antipoison : les numéros affichés dans les protocoles sont harmonisés provisoirement sur le 71 335 500, cité par l'ambassade des États-Unis en Tunisie (2025), et marqués « à confirmer localement ». Aucune confirmation récente du ministère tunisien n'a été trouvée ; le numéro n'est donc pas présenté comme officiellement validé. Source secondaire : <https://tn.usembassy.gov/services/emergency-assistance/>. Confirmation directe locale indispensable avant usage.
- Noradrénaline : concentration de calcul harmonisée à 8 mg de noradrénaline-base/50 mL (160 µg/mL) pour la fiche, les deux abaques et le réglage de pompe ; le preset mg/h est recalculé à 6,25 mL/h par mg/h. Le nombre d'ampoules n'est pas généralisé : il dépend de l'équivalence base/tartrate établie dans le RCP du produit local. La source française Aguettant illustre que 8 mg de tartrate correspondent à 4 mg base, ce qui interdit de déduire la base du seul chiffre « 8 mg ». Source de dose/préparation : Livret RE.NAU 2018 ; exemple d'équivalence RCP ANSM (France) <https://agence-prd.ansm.sante.fr/php/ecodex/notice/N0321446.htm>. Validation pharmaceutique tunisienne requise.
- Labétalol : retrait du bolus adulte non sourcé de 1 mg/kg et de la perfusion exprimée en mg/kg/h. La fiche présente des doses fixes IV (10–20 mg sur 2 min, puis 20–80 mg à intervalles adaptés, maximum cumulatif 300 mg) et une perfusion initiale de 1–2 mg/min ; l'abaque est désormais en mg/min (0,5–2) et le calcul de débit est testé. Le protocole obstétrical reste soumis à la validation locale. Sources : ACOG Practice Bulletin No. 222 (2020) <https://www.preeclampsia.org/frontend/assets/img/advocacy_resource/Gestational_Hypertension_and_Preeclampsia_ACOG_Practice_Bulletin,_Number_222_1605448006.pdf> ; FDA Prescribing Information labetalol injection (08/2024) <https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/213330s006lbl.pdf>.
- Naloxone : dose adulte générique corrigée à 0,2–2 mg IV/IO/IM avec titration ; dose pédiatrique d'intoxication aiguë distinguée à 0,1 mg/kg (max 2 mg/dose). La voie intranasale est conditionnée à un dispositif IN dédié et à sa notice ; elle n'est pas assimilée à la solution injectable de 0,4 mg/mL, et aucun dispositif tunisien IN n'est documenté dans la base. Chez les personnes dépendantes avec respiration conservée, la titration doit limiter le sevrage sans retarder ventilation/assistance respiratoire. Sources : AHA Focused Update 2023 sur les intoxications <https://www.ahajournals.org/doi/10.1161/CIR.0000000000001161> ; AHA Guidelines 2025 <https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation> ; étiquette FDA NARCAN nasal (référence spécifique au dispositif, non transposable automatiquement) <https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/208411s007lbl.pdf>.
- Générateur de pompe : suppression de l'extraction naïve du premier nombre dans `prep.fr`. La pompe automatique exige maintenant une préparation structurée et vérifie la concentration recalculée contre `concUgPerMl` (écart ≤1 % ; plage médicamenteuse 0,01–100 mg/mL) ; sinon elle reste désactivée et l'interface affiche un avertissement. Dobutamine (250 mg/250 mL = 1 mg/mL) et propofol (produit pur 10 mg/mL ; défaut de pompe 500 mg/50 mL) sont testés. Le défaut propofol suppose un flacon 50 mL correspondant ; vérifier la présentation réelle. Les autres préparations sans structure explicite n'obtiennent plus une pompe automatique.

- Complément DPM ciblé : 3 présentations d'atropine et 12 présentations injectables de gentamicine sont reliées aux fiches correspondantes après vérification des fiches DPM ; les formes atropine ophtalmiques restent exclues et la voie précise des formes injectables demeure « selon RCP ». L'AMM ne prouve pas la disponibilité en pharmacie.
- Cotrimoxazole : ajout d'un avertissement de sécurité en français, fondé sur la notice tunisienne TERIAK de BACTRIM FORTE (AMM 9253082) et complété par le RCP ANSM français clairement identifié comme source étrangère. Il rappelle l'adaptation en insuffisance rénale, la surveillance de la kaliémie chez certains patients à risque et l'interdiction de transposer directement les seuils de ClCr au DFG indexé ; aucune dose nouvelle n'est ajoutée.
- Phase C des marques tunisiennes : mise en correspondance de marques sélectionnées avec le registre AMM officiel DPM actuel, puis enrichissement de `brands` et de `docs/TUNISIA-DPM-BRANDS-AUDIT-2026-10-25.md` avec DCI, force, forme, conditionnement, laboratoire et AMM lorsque le rang est explicite. À la fin de cette étape initiale, le tableau comptait 346 lignes de correspondance et 535 exclusions documentées (comptées à partir des lignes du rapport) ; le registre prouve l'AMM, pas la disponibilité en pharmacie. La revue ciblée couvre maintenant les extraits des segments 64–352 ainsi que la reprise ciblée 113–140, sans examen exhaustif du fichier ; la revue des 73 médicaments reste incomplète. Aucun schéma de dose n'a été modifié ; les formes orales/topiques, les aérosols et les associations avec adrénaline ne sont pas présentés comme équivalents à d'autres formes, voies ou spécialités simples.
- Suite de la revue ciblée DPM (segments 196–210) : trois présentations explicitement « solution injectable pour perfusion » de métronidazole (METROGYL, METROJECT, METRONIDAZOLE INFOMED) sont ajoutées avec leurs AMM. MEDAXON reste hors de la fiche dexaméthasone IV/IM faute de voie explicite ; MAXIDROL et MEDICLAV sont exclus pour la forme/association. Les injections MIDAZOLAM AGUETTANT/STERIPHARM et morphine RENAUDIN/AGUETTANT/MEDIS ne précisent pas le chemin d'administration ; tous les rapprochements DPM des morphines injectables sont retirés. MIXTARD 30/30 PENFILL sont des suspensions, non l'insuline rapide simple.
- Suite de la revue ciblée DPM (segments 211–215) : NAKION G/G5 (quatre lignes) reste séparé des solutions monocomposant de glucose 30 %, NaCl et KCl ; les cinq comprimés oraux MOSCONTIN sont séparés de morphine IV et NATECAL D3 de calcium gluconate IV. NATISPRAY (0,3 mg/dose) est retiré du rapprochement sublingual : le registre mentionne un spray buccal sans préciser la voie sous-linguale. Des tests de recherche négatifs sont ajoutés. Aucun schéma de dose modifié ; revue toujours partielle.
- Revue DPM des segments 216–220 : les lignes NICARDIPINE MÉDIS IV et NEURODOL oral étaient déjà documentées ; NEXUS/pregabaline/gabapentine/NEFOMED ne correspondent à aucune carte actuelle. Aucun ajout ni changement de compte ; revue partielle maintenue.
- Revue DPM des segments 221–227 : ajout de NORENOL 8 (noradrénaline IV, AMM 9313151H), NORMOCARDIL oral (propranolol, deux AMM) et des six présentations orales NOVAMOX (amoxicilline). Exclusion documentée de huit NOVACLAV combinés, onze formes orales/combinées NOVADOL/NOVEX (paracétamol IV), et deux NOVOMIX analogues en suspension ; filtres de recherche testés. Totaux : 340 correspondances et 379 exclusions ; revue des 73 médicaments toujours incomplète.
- Revue DPM des segments 228–247 : correspondances IV de paracétamol PARAC INFO/PARAMED documentées ; 12 présentations orales/combinées PARACETYL/PARALVIT sont exclues. NOVORAPID FLEXPEN (analogue d’insuline), OGYL (association spiramycine/métronidazole) et OCTREOTIDE NEAPOLIS injectable (voie IV non précisée) ne sont pas reliés aux fiches incompatibles. Onze présentations injectables d’ondansétron sans voie IV explicite sont retirées des rapprochements ; deux comprimés ONDANSETRON MEDIS sont ajoutés. Filtres négatifs, notamment OREX SPRAY/OTIPAX. Totaux cumulés : 340 correspondances et 405 exclusions ; revue toujours partielle.
- Revue DPM des segments 248–257 : ajout de cinq présentations orales PENAMOX (amoxicilline) et de PMS-ONDANSETRON 8 mg comprimé oral (six lignes concordantes au total). Totaux : 346 correspondances et 405 exclusions ; la revue des 73 médicaments reste incomplète.
- Revue DPM des segments 258–267 : aucun ajout de marque concordante ; quatre exclusions supplémentaires documentées : deux présentations PRIMACAINE ADRÉNALINE pour anesthésie dentaire, PROTOGYL (ovule de métronidazole) et PYLERA (association avec bismuth/tétracycline). Tests de recherche négatifs ajoutés. Totaux : 346 correspondances et 409 exclusions ; revue partielle.
- Revue DPM des segments 268–272 : aucun ajout de marque concordante ; huit présentations RAPIFEN (alfentanil) et REMIFENTANIL (MEDIS/VIATRIS) sont écartées de la fiche fentanyl en raison d’une DCI différente. Filtres et tests de recherche négatifs ajoutés. Totaux : 346 correspondances et 417 exclusions ; revue partielle.
- Revue DPM des segments 273–277 : aucune nouvelle correspondance ni exclusion ; les occurrences RHUVEX/RHUTAGEL/RHUTASUPPO/RICARDYL déjà documentées n’ont pas été comptées une seconde fois. Les substances sans fiche correspondante restent non reliées. Totaux inchangés : 346 correspondances et 417 exclusions ; revue partielle.
- Revue DPM des segments 278–282 : ajout d’un filtre négatif pour RYZODEG FLEX TOUCH, mélange d’insulines analogues non concordant avec l’insuline humaine rapide. Les présentations orales RUGDAL (esoméprazole) n’ont pas de fiche correspondante ; RUCORON était déjà documenté. Totaux : 346 correspondances et 418 exclusions ; revue partielle.
- Revue DPM des segments 283–287 : aucune correspondance nouvelle ; exclusions de SALAMEST nasal, SANDOSTATINE LAR (formes longues), SEMGLEE (DCI `INSULINE GLARGINE`, classée biosimilaire au DPM), SEPTANEST ADRÉNALINÉE (anesthésie dentaire), SEEBRI BREEZHALER et quatre présentations SERETIDE (formes inhalées différentes de salbutamol). Filtres/tests négatifs ajoutés. SAIFOXYL, SANDOSTATINE courte et SEDACORON étaient déjà documentés. Totaux : 346 correspondances et 429 exclusions ; revue partielle.
- Revue DPM des segments 288–292 : SIFLOKS/SIPRODIS et le NaCl 0,9 % avec set étaient déjà documentés. Quatre SKENAN LP oraux et trois poches SMOFKABIVEN E multicomposants sont exclus respectivement de morphine IV et de l’émulsion lipidique 20 % ; filtres et tests négatifs ajoutés. Totaux : 346 correspondances et 436 exclusions ; revue partielle.
- Revue DPM des segments 293–297 : le NaCl 0,9 % et SPASMAG IV étaient déjà documentés. Exclusion d’un glucose 5 %, de 11 solutions de dialyse péritonéale multicomposantes, de SOMATULINE LP, SPIOLTO RESPIMAT et SPIRIVA des fiches IV/nébulisées incompatibles ; filtres et tests négatifs ajoutés. Totaux : 346 correspondances et 454 exclusions ; revue partielle.
- Revue DPM des segments 298–302 : exclusion de STER-DEX (pommade ophtalmique associée) de la fiche de dexaméthasone systémique, et de quatre présentations d’associations orales au paracétamol (STOPALGIC CODEINE, STOPALGIC EXTRA, SUPRADOL) de la fiche IV ; filtres et tests négatifs ajoutés. Les lignes STOPALGIC à principe unique déjà documentées n’ont pas été recomptées. Total : 346 correspondances et 459 exclusions ; revue partielle.
- Revue DPM des segments 303–311 : exclusion de SYNALVIC (paracétamol+tramadol), de SURANIL oral de la fiche hydrocortisone injectable, des trois présentations SYMBICORT (budesonide+formoterol) de la fiche salbutamol, et de sept présentations de teicoplanine de la fiche vancomycine ; filtres et tests négatifs ajoutés. Les lignes déjà documentées de suxaméthonium, terbutaline, metronidazole oral et piperacilline/tazobactam n’ont pas été recomptées. Total : 346 correspondances et 471 exclusions ; revue partielle.
- Revue DPM des segments 312–318 : exclusion de TEMGESIC (buprénorphine injectable) de la fiche morphine, de TITANOREINE LIDOCAINE (crème rectale) de la lidocaïne antiarythmique, et de quatre collyres/onguents TOBRACORT/TOBRADEX de la dexaméthasone systémique ; filtre manquant et test TERGYNAN ajoutés sans recomptage de cette ligne déjà documentée. Total : 346 correspondances et 477 exclusions ; revue partielle.
- Revue DPM des segments 319–321 : trois présentations d’insulines analogues (TRESIBA FLEXTOUCH et TOUJEO SOLOSTAR) restent distinctes de l’insuline humaine rapide ; sept présentations de tramadol (TRAMADIS/TRAMAL) ne sont pas rattachées à la fiche morphine. Filtres et tests négatifs ajoutés. Total : 346 correspondances et 487 exclusions ; revue partielle.
- Revue DPM des segments 322–327 : huit exclusions supplémentaires — deux présentations dentaires UBISTESIN (articaine+adrénaline) ne correspondent pas à l’adrénaline IV ; six présentations UNICAINE (lidocaïne de voie/indication anesthésique locale ou régionale) ne sont pas rattachées à la lidocaïne antiarythmique, y compris le libellé DPM au classement cardiovasculaire qui ne démontre pas cette indication. Filtres et tests de recherche négatifs ajoutés. Total : 346 correspondances et 495 exclusions ; revue partielle.
- Revue DPM des segments 328–331 : dix lignes VANCO/VANCOLON/VANCOMED/VANCOMYCINE HIKMA/KABI/MYLAN sont décrites en poudre injectable sans voie IV/perfusion explicitée ; elles restent hors de `brands` et sont filtrées/retestées pour éviter de présumer la voie. Les VAAMOX et VAGILEN déjà documentés ne sont pas recomptés. Total : 346 correspondances et 505 exclusions ; revue partielle.
- Revue DPM des segments 332–341 : deux formes orales de paracétamol WINDOL (AMM 9253532/9253533) sont exclues de la fiche IV ; VOLUVEN, colloïde composé d’hydroxyéthylamidon et de chlorure de sodium (AMM 3153041H), est exclu de la fiche NaCl 3 %. Filtres et tests négatifs ajoutés. Total : 346 correspondances et 508 exclusions, dont 122 formes orales/combinées de paracétamol ; revue partielle.
- Vérification des segments 342–352 : aucune nouvelle correspondance ; XABAN/XARELTO (rivaroxaban), XOLAIR, ZIFUR/ZINFORO et ZYVOXID ne correspondent pas à une fiche parmi les 73 ; ZOLAM, ZEMITRON, ZITROCIN/ZOMAX et les formes locales XYLOCAINE sont déjà documentés. Pas de ligne recomptée ; le total reste 346 correspondances et 508 exclusions, revue partielle.
- Suite de l'audit DPM : ajout des marques concordantes IPNODIS (midazolam), NICARDIPINE MÉDIS, INTRALIPIDE 20 % 500 mL, NEURODOL oral, NIDAZOL oral, six présentations de noradrénaline, ONDANSETRON UNIMED/ONDOFREN, RICARDYL 200 mg et SEDACORON injectable (amiodarone), RUCORON injectable (rocuronium), SANDOSTATINE 50/100 µg injectable, SIFLOKS/SIPRODIS oraux et UFEXIL IV (ciprofloxacine), 16 présentations orales SAIFOXYL (amoxicilline), TROMBYL 75 mg et CARDIOCINE 100 mg (aspirine), VENTOL en unidoses pour inhalation et VENTAXX et BUTO-ASMA aérosols (salbutamol), VETIRA oral (lévétiracétam), SULFATE DE MAGNESIUM PROAMP, sept présentations de sufentanil (SUFENTA, SUFENTAMED, SUFENTANIL MEDIS/VIATRIS), trois présentations de suxaméthonium (succinylcholine), quatre UNIDEX injectables (dexaméthasone), cinq UNIGENTA injectables (gentamicine), VITAMINE B1 injectable et BRICANYL et TALIN injectables (terbutaline SC ; la fiche avertit que le DPM mentionne aussi l'IV, non couverte par la posologie actuelle) ; les présentations ont leur AMM DPM dans le rapport. ATROVENT et ATROALDO aérosols et SEEBRI BREEZHALER ne sont pas rattachés à l'ipratropium nébulisé ; les quatre présentations SERETIDE (salmétérol+fluticasone) restent distinctes du salbutamol simple ; les deux collyres ATROPINE UNIMED, AURICULARUM otique et AXEN (route injectable non précisée, plus suppositoire/gel) restent exclus de ces fiches de voie différente. Retrait de LIDOCA/LIDOJECT/DOCAINE du champ `brands` de la lidocaïne antiarythmique, car les lignes DPM étudiées concernent le traitement anesthésique local/régional et ne valident pas cet usage ; ces alias sont aussi filtrés pour cette fiche dans la recherche, sans supprimer la recherche par DCI exacte `lidocaine`. OREX SPRAY, OTIPAX, PRILIA, PRILOCALM et PROCTOHEAL restent des produits locaux/combinaisons, sans rattachement à la fiche antiarythmique. Les quatre présentations OSMOMED et POLYONIQUE G (glucose + NaCl + KCl) restent distinctes de l'ampoule KCl seule. Trois présentations d'oxytocine injectable (GRINDEKS, GEDEON RICHTER, PANPHARMA), dix présentations IV de paracétamol (PARAMED, PARAC INFO, PARALGYL), deux présentations orales PHENOBARBITAL 50 de SIPHAT, cinq présentations de piperacilline/tazobactam IV (KABI, VIATRIS, SANDOZ), sept présentations PROFENID (quatre orales, trois injectables intitulées IM), sept présentations de propofol (FRESENIUS, KABI, LIPURO), deux PROSTAM LP (tamsulosine) et deux QUINOLOX oraux (ciprofloxacine) et BACTALL 500 mg oral (deux conditionnements) sont documentés avec AMM. Les PANADOL, RHINOFEBRAL, RHINOSTOP, RHUMAGRIP, RHUVEX et ROMPALGINE oraux/combinés, VAAMOX (amoxicilline+clavulanate) non équivalent à l'amoxicilline seule, PHENASPIRINE, six exemples de NaCl 0,9 % (distincts du NaCl 3 %), dix présentations de piperacilline/tazobactam dont la route IV/perfusion n'est pas explicitement établie (STRAGEN, PRIZMA, TAZOREX, TAZOBACT, TAZOCILLINE) ; Tazocilline a été retirée du rapprochement à la fiche IV et des alias de recherche, RHUTAGEL/RHUTASUPPO hors voies du schéma, SALBUMOL injectable et SALBUTAMOL SIMED sirop hors voie inhalée, et RODOGYL (spiramycine+metronidazole) sont consignés comme non concordants et non liés aux fiches IV/simples. Les associations RODOGYL, SPIROGYL, SPIRAMIZOLE, SPIRAZOL, BI-SPIRAZOL, BI-SPIROGYL, BIOGYL et BIRODOGYL ne sont pas reliées au metronidazole seul ; les produits salins 0,9 % restent distincts du NaCl 3 %, et SPASMAG IV reste en attente car le registre indique « magnesium » sans préciser le sel. ACTILYSE (10/20/50 mg), ACTALGINE et les deux présentations injectables LABESFAL sont également documentées ; ADRENALINE SOPHARMA et ADRENOL sont ajoutés au rapprochement ; les formes orales ALBUTOL et BUTALIN sont exclues de la fiche salbutamol inhalée ; ANALGAN IV (AMM 9003017/9003018) est documenté ; ses présentations orales, suppositoires et associations sont filtrées. ANSEMID (furosémide, quatre présentations orales) et ANTIOMAL (lévétiracétam, sept présentations orales) sont documentés ; les stylos ANAPEN (150/300 µg) restent séparés de l'adrénaline IV, et APIDRA SOLOSTAR reste séparé de la fiche d'insuline humaine rapide. ACTRAPID 100 UI/mL solution injectable (AMM 5993016) est documenté, tandis qu'ACTRAPID PENFILL est exclu du rapprochement avec l'insuline rapide car le DPM le libelle « suspension injectable ». Cordarone injectable et oral (amiodarone, AMM 6260032 et ST9263071) est ajouté au rapport ; DALACINE injectable (AMM 6533061H) avait d’abord été confirmé, puis reclassé en exclusion le 2026-10-27 car le DPM ne précise pas la voie ; DALACINE T TOPIC reste exclu. DOBUTAMINE HIKMA et VIATRIS (formes pour perfusion) sont ajoutés; DOBUJECT reste exclu car sa voie n’est pas explicitée. EMLA (lidocaïne + prilocaïne, crème locale) est également écarté de la lidocaïne IV et testé en recherche. EFFADOL/EFFERALGAN (formes orales et suppositoires) sont exclus du paracétamol IV et bloqués dans la recherche. Sept spécialités de fentanyl injectables sans voie explicite restent hors de la fiche IV et leurs noms sont filtrés. Trente-trois présentations orales/combinées FERVEX/FIBREX/FORTADOL/FORTALGIC/FRESIDOL/GOLDIX/GRIPEX (paracétamol) sont exclues et testées contre la fiche IV. FRUBIOSE CALCIQUE orale est séparée du gluconate de calcium injectable. Deux présentations GLUCAGEN (AMM 5993031/5993033) sont confirmées pour le glucagon. Vingt-quatre présentations de glucose 5/10 %, quatre GLUCOSALINE et GLUKANION sont exclues de glucose 30 %/NaCl 3 %/KCl seul ; GLUCALCIUM injectable sans voie IV explicite et le gluconate oral SIPHAT sont aussi séparés de la fiche calcium IV. Six présentations GALAMOX orales sont confirmées pour l’amoxicilline, dont la fiche couvre les voies orale et IV. IPROVENT ADULTE/ENFANT (solution d’inhalation en unidoses, AMM 9093782/9093781) et KETAMINE PANPHARMA (deux présentations, AMM 7233011H/7233012H) sont confirmés. Les cinq offres phenobarbital (GARDENAL injectable sans voie explicite, comprimés GARDENAL et PHENOBARBITAL 50) sont écartées de la fiche IV et filtrées en recherche. GENSULIN R, INSUGEN R et JUSLINE R sont écartés de la fiche IV faute de voie explicitée ; JUSLINE N/30-70 sont des suspensions non concordantes. KETOPROGEL et KETUM restent des gels topiques ; KLIPAL CODEINE, LAMALINE et LATIFEX PLUS sont exclus du paracétamol IV ; LANTUS et LEVEMIR (dont les stylos) sont exclus de l’insuline humaine rapide. Les présentations injectables hydrocortisone BIOCODEX/MEDIS/UPJHON/LEURQUIN/MEDO et HEPARINE MEDIS/UNIMED sont également exclues faute de voie IV explicitée. FLEXEN injectable reste non associé au kétoprofène en l’absence de voie explicitée. ESMERON est confirmé pour le rocuronium injectable (AMM 70131511H). CORTEF 10 mg oral est exclu de la fiche hydrocortisone injectable. Les nouvelles lignes ciprofloxacine comprennent CIPRO 500/750, CIPROCINE, CIPROFLEX, CIPROFLO INFO et AGUETTANT, CIPROLON oral, CIPROMAX, CIPROSAIPH et CIFLOXIN ; CIPROLON injectable reste non lié faute de voie précisée. CIDOMYCINE 20 (gentamicine) et CHLORURE DE SODIUM PROAMP 20 % sont ajoutés comme concordants ; CIBLOR (3 lignes), CLAVUMOX (5 lignes), les deux collyres ciprofloxacine, NaCl SIPHAT 10 %, CO-ALGESIC et CO-ALGIDOL sont exclus des fiches simples/concordantes, de même que CORTEF oral de la fiche hydrocortisone injectable. Les présentations d'azithromycine AZACINE, ZOMAX, ZITROCIN, ZITHROMAX/UNO, ZITROMAX (orthographe DPM), ZITHROCARE, ZITRO, AZITHROCINE, AZITRAL, AZITROMIN, AZIX, AZOMYCINE et AZRO sont aussi documentées avec leurs AMM ; les noms ZITHROMAX et ZITROMAX restent séparés comme dans le registre. À la clôture de cette phase antérieure, le rapport comptait 346 lignes concordantes et 508 lignes d'exclusion documentées (40 lidocaïne (dont AFTAGEL, AURIPAX et les deux solvants IM UNIMED), 122 paracétamol oral/combiné (dont APYREX PEDIATRIQUE, CETAMOL, CETRADOL, CO-ALGESIC, CO-ALGIDOL, STOPALGIC CODEINE, STOPALGIC EXTRA, SUPRADOL et SYNALVIC), plus un CORTEF oral non concordant, 3 calcium chloride non équivalents au gluconate, deux FRUBIOSE oraux, GLUCALCIUM sans voie IV et un gluconate oral, 7 hydrocortisone injectable sans voie IV explicite, deux héparines injectables sans voie IV explicite, 10 présentations de vancomycine injectable sans voie IV explicite, 18 présentations d’insuline non concordantes avec l’insuline humaine rapide (DCI distinctes ou suspensions, dont SEMGLEE, MIXTARD 30, TRESIBA et TOUJEO), 5 présentations de phénobarbital hors voie (dont GARDENAL injectable sans voie indiquée), 45 combinaisons amoxicilline/acide clavulanique (7 VAAMOX, 9 AMOCLAN, 1 AMOXI PLUS, 8 AUGMENTIN, 3 CIBLOR, 5 CLAVUMOX, 4 MEDICLAV), 1 VIGASPIR, 1 CAFENOL, 4 PHENASPIRINE, 6 NaCl 0,9 %, 10 solutions électrolytiques multicomposants contenant K (dont quatre NAKION G), quatre GLUCOSALINE glucose/NaCl, trois écarts KCl de sel/concentration/voie, trois NaCl 10% distincts du NaCl 3%, un spray nasal SALAMEST sans concentration précisée, deux formes SANDOSTATINE LAR, 10 piperacilline/tazobactam à route/formulation non résolue, 8 formes ketoprofene non correspondantes (dont trois AXEN, FLEXEN sans voie précisée, et KETOPROGEL/KETUM topiques), 7 formes salbutamol non inhalées, SEEBRI BREEZHALER non équivalent à ipratropium et quatre présentations SERETIDE multicomposantes non équivalentes au salbutamol, SPIOLTO RESPIMAT et deux présentations SPIRIVA non équivalents à ipratropium/salbutamol, 15 associations spiramycine+metronidazole, trois poches SMOFKABIVEN E multicomposants non équivalentes à l’émulsion lipidique 20 %, 11 solutions de dialyse péritonéale multicomposantes, trois SOMATULINE LP (lanréotide) non équivalentes à l’octréotide, 6 formes vaginales/combinaisons de metronidazole, 7 offres MEDAXON sans voie exacte, deux MAXIDROL oculaires, quatre formes injectables metronidazole sans voie de perfusion explicitée et trois formes orales metronidazole, 4 offres MIDAZOLAM sans route, 5 morphines injectables sans IV explicite, cinq MOSCONTIN et quatre SKENAN LP oraux, NATECAL D3 oral, NATISPRAY sans voie sublinguale explicite, TALIN LP, terbutaline sirop SIMED et deux BETANYL plus BRICANYL TURBUHALER hors voie de la fiche, SPASMAG IV non résolu, gentamicine collyre non équivalente à l'injection, ATROVENT, ATROALDO, BRONCHODUAL, deux collyres atropine, AURICULARUM auriculaire, NEOPHRINE, deux stylos ANAPEN non équivalents à l'adrénaline IV, APIDRA SOLOSTAR (analogue insulinique) non équivalent à l'insuline humaine rapide, ARTICAINE MEDIS ADRÉNALINÉE, deux SEPTANEST ADRÉNALINÉE et deux UBISTESIN ADRÉNALINÉE dentaires non équivalents à l'adrénaline IV, AZYTER collyre non équivalent à l'azithromycine systémique, et ACTRAPID PENFILL dont la forme ne correspond pas à l'insuline rapide, 3 SYMBICORT multicomposants non équivalents au salbutamol, SURANIL oral, SYNALVIC oral combiné et 7 présentations de teicoplanine distinctes de la vancomycine, TEMGESIC (buprénorphine) distinct de la morphine, 7 présentations de TRAMAL/TRAMADIS (tramadol) distinctes de la morphine) ; la revue complète reste ouverte.
- Aucun nouveau médicament, seuil ou schéma numérique n'a été importé, et l'archive continue reste non branchée en production. Une correction structurelle spécifique sépare dans Ceftobiprole la dose de base de la variante « infection sévère » ; les cellules rénales ne sont pas appliquées à cette variante et l'action « Retenir » est bloquée sans contexte confirmé. Cela ne constitue ni une adaptation clinique validée ni une adoption en Tunisie. Les protections AKI/dialyse/pédiatrie restent en place.
- Aucun schéma de dose nouveau n'a été ajouté. Le calculateur de fonction rénale demande maintenant
  une déclaration clinique de stabilité avant d'utiliser une grille chronique ; la valeur DFG isolée
  est étiquetée comme estimation, pas comme preuve de CKD ni de stabilité. Les règles AKI restent
  des critères de repérage KDIGO, pas un diagnostic.
- Les posologies des anciennes lignes non sourcées du pont général (metformine, anticoagulants,
  opioïdes, AINS, colchicine, etc.) ont été retirées de l'interface et des données embarquées ; les
  noms restent visibles comme couverture à compléter, sans calcul. Les plages de gabapentine et
  prégabaline proviennent de deux RCP individuels ANSM liés dans l'outil ; elles ne sont activées
  que pour un adulte déclaré stable, non dialysé, sans critère KDIGO, avec poids réel, et ne sont pas
  validées par un professionnel tunisien. Le
  RCP de gabapentine demande une réduction proportionnelle sous ClCr 15 et un schéma distinct en
  hémodialyse : ces deux ajustements ne sont pas calculés automatiquement et doivent être vérifiés
  dans le RCP. Détails et dates :
  `docs/RENAL-DOSE-RCP-2026-10-23.md`.
- Amikacine : maintien séparé de trois sources/schémas qui ne sont pas interchangeables — ligne OMEDIT V2.3 (références arrêtées au 10/01/2024), CA-SFM/SPILF/SFPT 2025 (`25–30 mg/kg/j` pour adulte non obèse à fonction rénale normale) et RCP Panpharma (`15 mg/kg/j`, ClCr ≥50, max 1,5 g/j ; poids corrigé du RCP en obésité). Le preset de dose sûre est bloqué hors de son périmètre, mais ni ces références françaises ni les changements ne prouvent une adoption tunisienne. Références et limites : `docs/ANTIBIO-IR.md`.
- Aucun schéma antibiotique nouveau n'a été proposé. Le calcul pondéral du tableau OMEDIT reste une multiplication arithmétique de ses seules cellules explicites ; les plafonds chiffrés connus sont appliqués et les cas non interprétables sont bloqués. La relecture clinique indépendante et l'adoption tunisienne restent non établies. Détails : `docs/ATB-WEIGHT-CALCULATION-AUDIT-2026-10-24.md`.
- La comparaison visuelle OMEDIT p.7 a confirmé que les chiffres des trois aminosides apparaissent
  en colonne normorénale, tandis que les colonnes d'IRC sont fusionnées avec une consigne commune :
  les valeurs quotidiennes ne sont plus dupliquées dans ces cellules et aucun intervalle rénal n'a
  été déduit. Une alerte de vérification accompagne ces cellules ; la conduite thérapeutique reste
  à valider par un spécialiste.
- La note du tableau OMEDIT signalant le monitorage pharmacologique du méropénem à dose élevée
  (> 6 g/24 h) est conservée dans `notes` après avoir été supprimée par le patch de génération
  précédent ; elle n'a pas reçu de validation clinique indépendante. Le lien alternatif
  `metoclopramide` (entrée médicamenteuse absente) a été retiré sans proposer de remplacement.
- Les procédures (`data/procedures.ts`) et les rappels correspondants dans `data/protocols.ts`, `data/protocols-p2.ts`, `data/protocols-p4.ts`, `data/protocols-p7.ts`, `data/trees.ts`, `data/triage.ts`, `data/guidage.ts`, `data/quiz.ts`, `data/reval.ts` et `app/terrain/page.tsx` ont été corrigés après comparaison avec les références précisées dans le rapport (dont plusieurs éditions 2024–2025) : séparation défibrillation/cardioversion, retrait des minutages/doses/calibres non étayés, correction des consignes de naissance/réanimation néonatale, précautions IO/rachis et suppression des rappels thoraciques universels non vérifiés (dont angle 45°, pansement trois côtés et drainage automatique), avec renvoi vers le protocole local adapté et la notice du dispositif. Le détail, les références et les limites (pas d'approbation tunisienne établie) figurent dans `docs/PROCEDURES-REFERENCE-AUDIT-2026-10-23.md`.
- Les parcours généraux d'infection/sepsis adultes ont été revus selon SSC 2026 : choix du délai antibiotique selon choc/probabilité, repère d'au moins 30 mL/kg de cristalloïdes dans les 3 premières heures réservé à l'adulte avec hypoperfusion liée au sepsis/choc et poids renseigné, objectifs de PAM révisés, qSOFA non utilisé comme dépistage/exclusion autonome, cultures sans délai arbitraire et départ périphérique des vasopresseurs sans attente d'un abord central. Dans l'outil de réévaluation, le signal qSOFA et l'alerte de choc fondés sur des seuils adultes exigent maintenant un âge ≥18 ans ; le message précise qu'un score bas n'exclut pas le sepsis et que l'outil ne s'applique pas aux enfants. Le remplissage non spécifique du choc ne suggère plus de volume fixe. Le texte distingue la dose d'hydrocortisone issue de SSC 2021 de la recommandation SSC 2026, qui ne fixe pas ici de dose. Aucun de ces changements n'est une validation tunisienne ; l'enfant reste séparé, et ses recommandations nécessitent une revue pédiatrique indépendante. Détails et limites : `docs/CLINICAL-REFERENCE-REVIEW-2026-10-23.md`.

### Vérifications après les corrections
- `npm test -- --run` : **755/755 tests** (18 fichiers), dont **6** tests du contrat IA (consentement, contexte envoyé, périmètre sans recalcul, invalidation d'une réponse devenue obsolète) ; **8** tests du sélecteur de cellules DFG/contextes, les tests des contextes distincts et du blocage des 5 lignes conditionnelles de la page 5, les blocages d'imipénem-cilastatine (p.6), lévofloxacine et ofloxacine (p.7), des schémas/contexte conditionnels de la page 8, le contrôle des 26 contextes des pages 1–4 et 9–12 et des parcours UI bloquant « Retenir ». Test ciblé `atb-renal` + `ui` : **379/379** ; `renal-clearance` + `atb-renal` : **91/91**.
- `npm run lint` et `npm run build` réussis (contrôle TypeScript inclus) ; build statique : 448 pages, precache de 1 098 fichiers (~16,3 MB).
- Contrôles : inventaire des références **750 entrées/20 groupes**, `npm run audit:reference-inventory:check` et `git diff --check` réussis ; audit PDF intégral relancé : **465 cellules**, dont **387 correspondances littérales** et **33 cellules source multiples sans dose unique**, JSON archivé identique à la ré-extraction, les **34/34** cellules non choisies restent représentées, TypeScript identique octet par octet au générateur, et audit géométrique des seuils **60/60** frontières. Relecture visuelle documentée des 12 pages.

- Ces validations vérifient le comportement logiciel et l’intégrité des données, **pas** la sécurité clinique ni un agrément tunisien.

---

## [18.1] — 2026-09-21

**Étages 2 et 3 du calculateur « Antibiotiques & fonction rénale »** : estimation rénale
chronique / aiguë / pédiatrique, escalade prudente, puis plan antibiotique par patient avec
boucle de réévaluation **a → b** et export texte. Aucune valeur du tableau OMEDIT n'est modifiée.

### Ajouté
- `lib/renal-clearance.ts` — **CKD-EPI 2021** (créatinine, sans ethnie, `mL/min/1,73 m²`),
  **CKID U25** (0,413 × taille/créatinine) pour l'enfant, poids de calcul Cockcroft-Gault
  (poids réel si BMI < 30, sinon **poids ajusté** IBW + 0,4 × (réel − IBW)), critères **KDIGO**
  d'agression aiguë (+0,3 mg/dL/48 h, ×1,5/48 h, ×1,5/7 j, diurèse < 0,5 mL/kg/h ≥ 6 h),
  escalade prudente **GPR** (+2 stades si DFG 30–90 dégradé) avec **exception « molécules
  vitales »** quand le DFG < 30, et avertissement « CKD-EPI indexé » si poids < 0,8 × IBW.
- `lib/atb-plan.ts` + `components/atb/AtbPlanPanel.tsx` — **plan antibiotique (boucle a → b)** :
  décision *retenue / abandonnée* par molécule (motif + note), **réévaluation en tours successifs**
  (`#1 → #2 → …`, historique conservé), export texte FR/AR (copier / imprimer / vider),
  persistance locale `eutn:atb-plan-v1` (le plan corrompu retombe sur un plan vide, jamais d'erreur).
- Page `/calculateurs/antibio-renal` : champs créatinine à 48 h et à 7 j, diurèse et durée
  d'observation, case « DFG 30–90 dégradé » ; affichage **CKD-EPI + Cockcroft-Gault** côte à côte,
  stade retenu expliqué (le plus prudent en situation aiguë), bandeau KDIGO des critères réunis,
  badges « ↑ Escalade GPR (+2 stades) », indication de voisinage (jamais de substitution
  silencieuse) et bloc d'action *Retenir / Abandonner* sur chaque molécule.
- `__tests__/renal-clearance.test.ts` — **27 tests** (CKD-EPI 2021, CKID U25, poids ajusté, KDIGO,
  escalade GPR et son exception, refus d'entrée, plan a → b, export, JSON corrompu).

### Modifié
- Version applicative **18.1** (`lib/version.ts` + `public/sw.js`), README, `data/changelog.ts`,
  `docs/ANTIBIO-IR.md` (§6 étage 2, §7 étage 3).

### Contenu médical
- Toujours **aucune valeur inventée** : les règles ci-dessus ne font que **choisir la colonne du
  tableau** (et le signaler) ; le texte des posologies reste celui du tableau OMEDIT V2.3.

---

## [18.0] — 2026-09-21

**Nouveau calculateur complet : « Antibiotiques & fonction rénale ».** Les 12 pages du tableau
OMEDIT Pays de la Loire (V2.3, avril 2026) deviennent consultables **et calculables** dans
l'application : 93 lignes de molécules × 5 stades de DFG, posologies reprises **mot pour mot**
et dose absolue calculée au poids du patient.

### Ajouté
- `app/calculateurs/antibio-renal/page.tsx` — page dédiée (FR/AR, RTL, impression) :
  - **93 molécules / 13 classes** issues du tableau, valeur du stade sélectionné + **calcul de la
    dose absolue** pour toute posologie pondérale (`3 à 8 mg/kg/j` → `210 mg à 560 mg/24h`) ;
  - **DFG de Cockcroft-Gault** (âge, poids, taille optionnelle, sexe ×0,85, créatinine mg/dL ou
    µmol/L) avec sélection automatique du stade, **choix manuel du stade** en alternative ;
  - alertes explicites : **contre-indiqué**, **déconseillé**, **« aucune donnée »** (avec rappel
    « vérifier la source » et « patient non dialysé »), conduites non chiffrées (½ dose,
    « réduction de la posologie ») ;
  - dépliant par molécule : **tableau des 5 stades** + notes de la source (traduites AR).
- `data/atb-renal.ts` — jeu de données versionné (93 lignes, 13 classes, 13 notes ; FR imprimé
  verbatim, AR pour noms/classes/notes). Source archivée : `data/issues/`.
- `lib/atb-dose.ts` — moteur pur et testé (lecture `mg/kg`, dose absolue, Cockcroft-Gault,
  conversion µmol/L, bornes de stades, marqueurs « à vérifier dans la source »).
- `__tests__/atb-renal.test.ts` — **35 tests** : intégrité du jeu de données, recoupement de
  valeurs avec le PDF (Céfidérocol, amikacine, aztréonam, cotrimoxazole, vancomycine,
  ceftriaxone, triméthoprime, sulfadiazine), moteur de calcul et stades.
- `docs/ANTIBIO-IR.md` — documentation développeur : source, pipeline d'extraction
  (`tools/atb_grid.py` → `atb_rows.py` → `gen_atb_ts.py`), règles de calcul, limites.
- Chaîne de vérification archivée dans `data/issues/` : PDF d'origine + JSON de lignes + outils.

### Modifié
- `data/calculators.ts` : entrée `antibio-renal` (icône `Pill` ajoutée au registre des cartes) ;
- `data/counts.ts` : **calculateurs 130 → 131** ;
- version applicative **18.0** (`lib/version.ts` + `public/sw.js`, garde-fou de synchronisation).

### Contenu médical
- Aucun contenu existant n'est modifié. Les posologies affichées sont **reprises mot pour mot**
  du tableau OMEDIT ; **aucune valeur n'est déduite** par l'application. Périmètre affiché :
  **adultes non dialysés**. Relecture par un médecin/pharmacien tunisien requise avant usage.

---

## [17.4] — 2026-09-21

Dernier étage de la roadmap performance (item **d**) et **durcissement hors-ligne** : les
situations de guidage et la boucle de réévaluation quittent le bundle JS pour un fichier par
protocole, et deux trous du service worker sont bouchés (navigation interne, chemins variantes).
Aucun changement de contenu médical.

### Ajouté
- `GET /reval/<id>` — **98 fichiers statiques** de réévaluation (~1,7 Ko gzip chacun), générés au
  build depuis `data/reval.ts` (`app/reval/[id]/route.ts`). 404 renvoie `null`.
- `lib/protocol-extras.ts` — `loadProtocolExtras(id)` : `ref-index.json` + `/reval/<id>` en
  `Promise.all`, ne lève jamais, mémoïsé. Importe les deux bases **en type seulement**.
- Champ `g` (`[id, fr, ar]`) dans `ref-index.json` : la bannière de guidage de la fiche vient
  désormais du fichier de références (19 protocoles sur 98), sans embarquer `data/guidage.ts`.
- Précache des **584 payloads RSC** (`index.txt` + `_tree.txt`) des pages de détail
  (98 protocoles, 74 médicaments, 122 calculateurs).

### Corrigé
- **Hors-ligne** : depuis une liste en cache, toucher une carte ouvrait la page « hors-ligne »
  (le `Router` demandait un payload RSC non intercepté, puis retombait sur une navigation
  complète dont le chemin différait d'une barre oblique). Les deux causes sont traitées :
  branch RSC *cache-first* dans `sw.js`, et repli de navigation qui essaie désormais
  `/x`, `/x/`, `/x.html`, `/x/index.html`.
- `data.test.ts` : garde-fou `g` (guidage) champ par champ, + test de la route `/reval/[id]`
  (98 identifiants, contenu identique à `getReval`, 404 sur identifiant inconnu).

### Performance
- Fiche protocole : données de page **17,1 Ko gzip** après premier écran (références +
  réévaluation) au lieu d'un morceau JS de 320 Ko pour les deux bases complètes.
- Budget JS critique (21 routes, mesuré avant `DOMContentLoaded`) : **moyenne 172 Ko gzip**,
  pire route 223 Ko (`/medicaments`) — inchangé, plafond 500 Ko très loin.
- Précache : 526 → **1110 entrées** (~17,1 Mo brut, ≈5,8 Mo gzip sur un hébergeur compressant).
  Le HTML des 294 pages de détail reste hors précache (+22,6 Mo non justifiés sur mobile) ;
  seuls leurs payloads de navigation sont ajoutés.

### Modifié
- `public/sw.js` (VERSION `eutn-v17.4`), `scripts/gen-precache.mjs`,
  `components/details/ProtocolDetail.tsx` (types via `protocol-extras`), `lib/ref-index.ts`.

---
## [17.3] — 2026-09-21

Dernier étage du chantier performance : les **deux pages les plus lourdes** rejoignent le
peloton, et le cache HTTP de production est enfin déclaré. Aucun changement de contenu médical.

### `/protocoles` : 335 → 163 Ko gzip · `/quiz-ia` : 333 → 161 Ko gzip

- **Modifié** — `app/ref-index.json/route.ts` : chaque protocole expose désormais sa catégorie
  (`c`), sa gravité (`s`) et son nombre d'étapes (`e`) — soit exactement ce que la liste affiche.
  Coût : 67 Ko brut / **15,5 Ko gzip** pour les 381 entrées.
- **Modifié** — `components/cards/ProtocolCard.tsx` : la carte consomme un **résumé**
  (`ProtocolCardData`) au lieu d'une fiche entière (`toCardData()` convertit si besoin).
- **Modifié** — `app/protocoles/page.tsx` : liste, filtres par catégorie et recherche par titre
  travaillent sur le fichier de références. Le filtre de recherche ne portait déjà que sur les
  titres : **comportement identique**, y compris hors-ligne.
- **Modifié** — `app/quiz-ia/page.tsx` : le menu des 98 thèmes vient du fichier de références ;
  le texte du protocole n'est chargé (`import()` dynamique) qu'au clic sur « Générer ».

### Cache HTTP de production

- **Ajouté** — `vercel.json` : `/_next/static/**` immuable un an, `sw.js` et HTML sans cache
  (revalidation), `ref-index.json` 1 h, icônes 1 semaine.
- **Ajouté** — `public/_headers` : mêmes règles pour Netlify et Cloudflare Pages (copié dans `out/`).
  `scripts/static-out.mjs` **lit ce fichier** : les audits locaux appliquent la politique de
  production au lieu d'une copie codée en dur qui pouvait diverger.
- GitHub Pages ignore les en-têtes personnalisés : à savoir, les fichiers hachés y sont servis
  avec le cache par défaut de Pages. Le service worker reste la garantie hors-ligne.

### Gouvernance du contenu

- **Ajouté** — `__tests__/data.test.ts` : garde-fou de fraîcheur documenté
  (`FRESHNESS_LIMIT_MONTHS = 12`, avec la marche à suivre en cas d'échec) et vérification du
  format `AAAA-MM` des dates de revue.
- **Ajouté** — test de **cohérence de la projection** : la route `/ref-index.json` est appelée
  et comparée champ par champ aux données sources (titres, dates, catégories, gravités, étapes,
  liens). Une dérive entre le fichier de références et le contenu réel ne peut plus passer
  inaperçue — les pages ne lisant plus les données directement.

### Contenu médical

**Aucun changement.** Aucune dose, aucun protocole, aucune source.

## [17.2] — 2026-09-21

Suite directe du chantier performance : les **fiches** et les **pages de liens** ne téléchargent
plus les bases qu'elles n'affichent pas. Aucun changement de contenu médical.

### Fiche protocole : 426 → 178 Ko gzip

Une fiche téléchargeait la base des 73 médicaments (~200 Ko brut) et celle des calculateurs
(59 Ko) **au premier rendu**, pour n'afficher que deux ou trois puces.

- **Ajouté** — `lib/protocol-props.ts` : médicaments cités, calculateurs liés et libellé de
  catégorie résolus au build ; `app/protocoles/[id]/page.tsx` les passe en props.
- **Ajouté** — `data/protocol-categories.ts` : les catégories sortent du baril des 98 protocoles
  (`data/protocols.ts` les ré-exporte, aucun import cassé).
- **Modifié** — `components/details/ProtocolDetail.tsx` : plus aucun import de base lourde.

### Fiche médicament : 426 → 192 Ko gzip

- **Ajouté** — `lib/medication-props.ts` : alternatives, préparations PSE et protocoles liés
  résolus au build.
- **Modifié** — `components/details/MedicationDetail.tsx`, `components/MedTools.tsx` : reçoivent
  les données au lieu d'importer les bases (médicaments, perfusions, protocoles).

### Pages de liens : le fichier de références remplace les bases

Mesures avant → après (JS critique, gzip) :

| Page | Avant | Après |
|---|---|---|
| `/revision` (revue éditoriale) | 420 Ko | **170 Ko** |
| `/triage` | 351 Ko | **179 Ko** |
| `/pediatrie` | 394 Ko | **160 Ko** |
| `/obstetrique` | 400 Ko | **166 Ko** |
| `/ecg-analyzer` | 344 Ko | **171 Ko** |

- **Modifié** — `app/revision/page.tsx` et `app/revisions/page.tsx` : lignes construites depuis
  `/ref-index.json` (14 Ko) au lieu des trois bases (~780 Ko brut).
- **Modifié** — `components/HubPage.tsx` + les 4 pages de spécialité : `hubProps()` résout les
  titres côté serveur (`obstetrique` a été scindée en page serveur + composant client).
- **Modifié** — `app/triage/page.tsx`, `app/triage-ia/page.tsx`,
  `components/ecg/ECGResultCard.tsx`, `app/flash-ia/page.tsx` : liens et libellés résolus par
  `useRefIndexMap()` / `resolveRefLinks()`.
- **Modifié** — `app/ref-index.json/route.ts` : le champ `r` (date de dernière revue) couvre
  désormais protocoles, médicaments et calculateurs.

### Contenu médical

**Aucun changement.** Aucune dose, aucun protocole, aucune source.

## [17.1] — 2026-09-21

Deux optimisations ciblées, **sans aucun changement de contenu médical**. Les deux suivent le
même principe : ce qui n'est pas indispensable au premier écran ne doit pas bloquer l'affichage.

### Performance — fiche protocole : 509 → 428 Ko gzip

`components/details/ProtocolDetail.tsx` importait statiquement `data/reval.ts` (232 Ko brut) et
`data/guidage.ts` (88 Ko brut) **avant le premier rendu**, juste pour savoir si le panneau de
réévaluation devait s'afficher.

- **Ajouté** — `lib/protocol-extras.ts` : `loadProtocolExtras(id)` résout le guidage et la
  réévaluation par `import()` dynamique (mémoïsable, ne lève jamais).
- **Modifié** — `ProtocolDetail.tsx` : guidage et réévaluation arrivent **après** le premier
  rendu ; l'entrée « Réévaluation » de la barre de sections n'apparaît qu'une fois les données
  chargées (aucune entrée morte au clic). Les imports restants sont des `import type`
  (effacés à la compilation).
- **Résultat mesuré** : `/protocoles/acr-adulte` **509 → 428 Ko gzip critiques** (budget
  < 500 Ko tenu) ; `#reval` s'affiche ~350 ms après le chargement initial.
- **Hors-ligne vérifié** : `acr-adulte` déjà visitée → page réelle et contenu de réévaluation
  **identique** en ligne et en mode avion (les morceaux paresseux sont dans le précache).

### Performance — accueil : favoris et récents sans l'index complet

- **Ajouté** — `app/ref-index.json/route.ts` : Route Handler `dynamic = "force-static"` exporté
  au build en `out/ref-index.json` — 381 entrées `{k, h, t, n:[fr, ar]}` (58,5 Ko brut,
  **14,4 Ko gzip**), contre 173 Ko gzip pour l'index de recherche complet.
- **Ajouté** — `lib/ref-index.ts` : `loadRefIndex()` (mémoïsé, réessai après échec),
  `resolveRefs()`, `getRef()`.
- **Modifié** — `app/page.tsx` : les favoris et les récents se traduisent par la fiche de
  références ; le `requestIdleCallback` et l'import de `@/lib/search` disparaissent.
- **Modifié** — `scripts/gen-precache.mjs` + `public/sw.js` : `/ref-index.json` est précaché et
  servi par la branche cache-first ⇒ favoris et récents fonctionnent en mode avion.

### Outillage

- **Modifié** — `scripts/static-out.mjs` : `Cache-Control: public, max-age=31536000, immutable`
  sur `/_next/static/**` (aligné sur Vercel/GitHub Pages), `no-cache` sur `sw.js`. Sans cela,
  chaque navigation des audits locaux retéléchargeait les mêmes morceaux hachés.
- **Tests** — `__tests__/v17-perf.test.tsx` : +7 garde-fous (route `force-static` couvrant les
  7 jeux de données, conventions de clés, précache + branche SW, robustesse du lecteur,
  refus d'un `import` statique de `guidage`/`reval` hors allowlist, `ProtocolDetail` sans
  données lourdes au premier rendu). **579 tests** au total (9 fichiers).

### Contenu médical

**Aucun changement.** Aucune dose, aucun protocole, aucune source n'a été touché en v17.1.

## [17.0] — 2026-09-20

Version **performance, qualité et documentation**. Aucun changement de contenu médical :
les doses, protocoles et sources sont inchangés (98 protocoles, 73 médicaments, 130 calculateurs).

### Performance — premier chargement divisé par deux

Le bundle partagé par **toutes** les pages embarquait la base médicale complète
(12 fichiers de protocoles + 11 de médicaments + guidage + calculateurs, ≈ 1,4 Mo de JS brut).
Mesuré sur le build statique, à 390 px de large, connexion locale :

| Page | JS critique (gzip) avant | après | gain |
|---|---|---|---|
| `/` (accueil) | 483 Ko | **177 Ko** | **−63 %** |
| `/medicaments` | 463 Ko | 223 Ko | −52 % |
| `/calculateurs` | 474 Ko | 188 Ko | −60 % |
| `/rea` | 464 Ko | 163 Ko | −65 % |
| `/memo` | 464 Ko | 163 Ko | −65 % |
| `/checklists` | 472 Ko | 171 Ko | −64 % |
| `/protocoles` | 464 Ko | 335 Ko | −28 % |
| **Moyenne des 8 pages mesurées** | **478 Ko** | **241 Ko** | **−50 %** |

- **Ajouté** — `lib/text.ts` : unité de normalisation texte sans dépendance aux données
  (les pages listes l'utilisent au lieu de tirer tout l'index de recherche).
- **Ajouté** — `lib/search-core.ts` (types + algorithme de scoring, pur) et
  `lib/search-data.ts` (construction de l'index, **chargé uniquement par `import()` dynamique**).
- **Modifié** — `lib/search.ts` devient un chargeur paresseux : `loadSearchIndex()`,
  `searchItemsAsync()`, `resolveRefsAsync()`, `isSearchIndexReady()`, `getSearchIndex()`.
  `searchItems()` et `resolveRef()` restent synchrones (compatibilité) et renvoient `[]`
  tant que l'index n'est pas prêt.
- **Modifié** — `components/CommandPalette.tsx` scindé : l'enveloppe (montée sur les
  343 pages) n'écoute plus que les raccourcis ; le corps lourd vit dans
  `components/CommandPaletteBody.tsx`, chargé à la première ouverture (Ctrl/Cmd+K, FAB).
- **Modifié** — `components/SearchBar.tsx` : l'index n'est plus chargé au montage mais à la
  **première intention de recherche** (focus, saisie ou dictée).
- **Modifié** — `components/ReviewAlert.tsx` : les dates de revue passent par
  `lib/review-data.ts` (import dynamique en `requestIdleCallback`).
- **Ajouté** — `data/counts.ts` : les compteurs affichés sur l'accueil ne nécessitent plus
  l'import des bases complètes. Un test garde-fou les compare aux longueurs réelles.

### Modifié (hors-ligne renforcé)

- **Précache élargi** — `scripts/gen-precache.mjs` précachait une liste codée en dur de 5 onglets ;
  il énumère désormais **toutes les pages de premier niveau** (34 routes : accueil, protocoles,
  médicaments, calculateurs, recherche, arbres, triage, ECG, guidage, pédiatrie, obstétrique,
  psychiatrie, traumatologie, terrain, fiche SAMU, résumé, réévaluation, paramètres…).
  Mesure : **20/20 routes** s'ouvrent hors-ligne après une seule visite de l'accueil, sans page
  de repli. Coût : +2 Mo (432 fichiers, 12,4 Mo) — les 310 pages de détail auraient coûté +22,6 Mo
  et restent donc mises en cache à la première consultation.
  *Vérifié par un test Playwright avec coupure réseau réelle (`context.setOffline`).*

### Corrigé

- **Recherche arabe** — le normaliseur laissait survivre la hamza : `normalize("أدرينالين")`
  renvoyait `أدرينالين` au lieu de `ادرينالين`, car `NFD` décompose `أ/إ/آ/ٱ` en
  `(ا + diacritique suscrit)` et le retrait du tashkeel ne couvrait pas `U+0653–U+0655`.
  Toute recherche arabe sur un mot commençant par ces lettres échouait. Corrigé dans
  `lib/text.ts` (plage `U+064B–U+065F` + filet de sécurité sur les formes précomposées).
- **Ligatures françaises** — `œ`/`æ` ne sont pas décomposés par `NFD` : « Œdème » restait
  `œdeme` et ne correspondait pas à `oedeme`. Corrigé (`œ → oe`, `æ → ae`).
- **Barre d'onglets mobile** — à 320 px, 4 des 6 libellés débordaient leur colonne
  (`Médicaments` +17 px, `Réanimation` +12 px, `Check-lists` +6 px, `Protocoles` +4 px) ;
  à 390 px, `Médicaments` débordait encore de 5 px, en silence (chevauchement des colonnes).
  Libellés d'onglets raccourcis (`Médocs`, `Réa`, `Listes` — le tiroir et les titres de page
  conservent les formes longues), police réduite sous 380 px, `min-w-0` + `truncate` comme
  filet de sécurité. Vérifié : 0 débordement à 320, 360, 390, 768 px en FR et en AR.
- **Complications non supprimables** — `components/ActivePatient.tsx` importait
  `removeProblem` sans jamais l'appeler : une complication confirmée par erreur restait
  affichée sur l'accueil sans moyen de la retirer. Bouton de retrait ajouté (avec `aria-label`).
- **`app/resume/page.tsx`** — trois `setState` synchrones en cascade dans un effet
  (erreur `react-hooks/set-state-in-effect`, `npm run lint` sortait en code 1) réunis en une
  seule transition d'état.
- **Synonymes incohérents** — entrées dupliquées (`epinephrine` listé deux fois), valeurs non
  normalisées (donc jamais trouvées : `أطفال`, `أفيونيات`, `تباطؤ`, `جلطة`, `صدمة`),
  et synonyme `debut → perfusion` sémantiquement faux (remplacé par `debut → debit`).
- **Code mort / commentaires** — variable `d` inutilisée dans `lib/casesummary.ts` ;
  commentaire tronqué (`.")`) dans `components/Providers.tsx` ; import `addProblem` inutilisé
  dans `__tests__/casesummary.test.tsx`.
- **Configuration Vitest** — l'avertissement « ESM syntax in a file loaded as CommonJS »
  est supprimé (`vitest.config.ts` → `vitest.config.mts`).

### Ajouté

- **`CHANGELOG.md`** — ce fichier (absent du dépôt jusqu'ici).
- **`docs/ARCHITECTURE.md`** — carte du dépôt, flux de données, règles de performance et
  guides de contribution (où ajouter un protocole, un médicament, un calculateur).
- **Tests** — `__tests__/v17-perf.test.tsx` : 22 tests (normalisation FR/AR, index paresseux,
  garde-fous de bundle, synchronisation des compteurs, lisibilité des onglets).
  Total du projet : **572 tests** (contre 550).
- **Journal in-app** — le `/changelog` interne était figé à la v2.1 alors que l'application
  était en v16.2 ; il documente désormais les versions 3.0 → 17.0.

### Modifié (qualité)

- `npm run lint` sort désormais en **code 0** (0 erreur, 0 avertissement) — c'était 1 erreur
  et 4 avertissements.
- TypeScript strict : 0 erreur (`npx tsc --noEmit`).
- Les garde-fous d'architecture sont désormais automatisés : un test échoue si un composant
  monté sur toutes les pages réimporte la base médicale.

### Contenu médical

- **Aucun changement.** Les 98 protocoles, 73 médicaments, 130 calculateurs, 9 procédures,
  11 rythmes ECG, 9 arbres décisionnels et 3 check-lists sont inchangés.

---

## [16.2] — 2026-09-20

- **Ajouté** — `lib/casesummary.ts` : résumé de cas unifié (patient + constantes avec tendance
  + complications confirmées + chronologie des administrations) prêt à transmettre.
- **Ajouté** — `/resume` : page de relève/transfert (copie, partage natif, impression).
- **Ajouté** — `lib/deterioration.ts` : moteur de dépistage de la détérioration, 9 règles
  fondées sur ESC 2021 / SSC 2021 / ERC 2021 (OAP, choc, sepsis, bradycardie, hypoglycémie…),
  avec critères de confirmation clinique et conduite à tenir.
- **Ajouté** — `/reevaluation` : boucle de réévaluation horodatée (`lib/reval-log.ts`),
  tendance ↑→↓ et alarme après deux aggravations consécutives.
- **Ajouté** — 6 protocoles (HDH/Blakemore, exacerbation BPCO, convulsion fébrile, électrocution,
  pré-éclampsie sévère/éclampsie) → **98 protocoles**.
- **Ajouté** — 5 molécules (héparine HNF, altéplase, glucagon, céfotaxime, amikacine,
  lévétiracétam) → **73 médicaments**.
- **Modifié** — arborescence A : 6 onglets directs (Accueil · Réa · Médicaments · Protocoles ·
  Mémo · Check-lists), outils accessibles par la grille d'accueil, le tiroir et le contexte.

## [15.x] — 2026-09

- **Ajouté** — `scripts/gen-precache.mjs` : injection du manifeste de précache dans `out/sw.js`
  après build → **fonctionnement hors-ligne complet** (258 fichiers, ≈ 8,4 Mo).
- **Ajouté** — préchargement des documents de navigation et de leurs charges RSC.
- **Ajouté** — repli hors-ligne synthétique en dernier recours dans le service worker.

## [13.x – 14.x] — 2026-09

- **Ajouté** — « Patient actif » (`components/ActivePatient.tsx`) : poids / âge / créatinine /
  sexe saisis une fois, réinjectés dans tous les moteurs de calcul.
- **Ajouté** — archive locale des cas clos (5 entrées) avec restauration.
- **Ajouté** — `usePrefillPatient` pour préremplir les calculateurs sans écrasement.

## [10.x – 12.x] — 2026-09

- **Modifié** — charte Material 3 : rail de navigation permanent sur bureau, barre d'onglets
  basse sur mobile, en-tête minimal, FAB de recherche.
- **Ajouté** — palette de commandes (Ctrl/Cmd+K) : navigation, références, actions.
- **Modifié** — la recherche quitte l'en-tête (elle descend en bas sur mobile).

## [9.x] — 2026-09

- **Modifié** — typographie unifiée FR + AR avec IBM Plex Sans Arabic.
- **Ajouté** — thème « auto » suivant le système en direct.

## [7.x – 8.x] — 2026-09

- **Ajouté** — arbres décisionnels interactifs (`components/trees/TreeRunner.tsx`) : décisions
  OUI/NON tactiles, minuteries avec alarme Web Audio, journal horodaté imprimable.
- **Ajouté** — abréviations interactives (TA, PAM, GCS, MgSO₄…) avec fiche explicative FR/AR.
- **Ajouté** — mode urgence, mode terrain, fiche d'intervention SAMU, triage.

## [4.x – 6.x] — 2026-09

- **Ajouté** — `lib/calc.ts` : fonctions dosimétriques pures + couverture de tests Vitest.
- **Ajouté** — 130 calculateurs, dont NIHSS, HAS-BLED, CURB-65, Wells EP/TVP, Adrogué-Madias,
  insuline ACD avec garde-fou potassium.
- **Ajouté** — couverture « maladie + évolution + complications » : champ `trajectory` sur chaque
  fiche protocole (si aggravation / pas de réponse / complication).

## [3.x] — 2026-09

- **Ajouté** — couche IA optionnelle (clé utilisateur Gemini / OpenRouter) : Flash IA
  (une phrase → carte d'intervention chronométrée), analyseur ECG photo/caméra (IndexedDB),
  aide au triage, générateur de compte rendu, quiz.
- **Ajouté** — cache IndexedDB des images ECG (miniatures JPEG ≤ 300 px, 30 entrées, FIFO).

## [2.x] — 2026-09

- **Ajouté** — service worker maison (précache du shell, réseau d'abord, page `/offline`).
- **Ajouté** — bandeau « nouvelle version disponible » + journal des nouveautés in-app.
- **Ajouté** — `data/changelog.ts` (source du `/changelog` interne).

## [1.x] — 2026-09

- **Ajouté** — socle : i18n FR/AR avec RTL complet, thème sombre par défaut (lecture avant
  premier rendu, anti-FOUC), recherche avec synonymes, favoris réordonnables par glisser-déposer,
  récents, avertissement médical bloquant, impression, PWA installable.
- **Ajouté** — audio Web Audio API : bips, métronome RCP 110/min, alarme de fin de cycle.
- **Ajouté** — analytics GA4 avec ID placeholder, désactivation possible dans les paramètres.

---

[17.0]: #170--2026-09-20
[16.2]: #162--2026-09-20

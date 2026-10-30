# État lisible de l’audit des AMM DPM

**Mise à jour : 29 octobre 2026**

## En bref

L’audit compare les noms commerciaux et présentations du registre tunisien DPM aux fiches médicament de l’application. Les comptes portent sur des lignes AMM, pas sur des médicaments distincts.

| Statut rapporté | Nombre | Sens |
|---|---:|---|
| Confirmées | 355 | Présentations liées à une fiche après vérification de la concordance retenue. Cela ne valide pas la dose de la fiche ni le stock. |
| Exclues | 530 | Présentations non liées à la fiche visée : forme, substance, association, dosage ou voie non concordants. « Exclue » ne signifie pas automatiquement « information introuvable ». |
| En attente | 6 | Présentations pour lesquelles une preuve adaptée de voie IV/IM n’est pas encore établie. |
| Total du périmètre suivi | 891 | Somme des lignes comptées dans le périmètre de cet audit, qui ne couvre pas encore exhaustivement tous les médicaments ni tout le registre DPM. |

> **Limite de présentation :** le total de 530 est documenté dans le rapport d’audit, mais il n’existe pas encore de registre courant unique, réconcilié ligne par ligne, qui permette de le présenter comme une liste complète actuelle. Les tableaux du rapport détaillé contiennent aussi des décisions historiques. Ne pas utiliser ces tableaux historiques comme un export actuel sans reconciliation préalable.

## Les six lignes encore en attente

| Spécialité DPM | Présentation | AMM | Information manquante |
|---|---|---|---|
| ATROPINE SAIPH | 0,25 mg/mL, B/10/1 mL | `9163801H` | L’utilisateur a transmis une transcription d’étiquetage mentionnant SC, IV lente ou IM; non vérifiée indépendamment. Les doses génériques ne sont pas validées pour la marque; ligne maintenue en attente. |
| GENTAINJECT 40 | 40 mg/2 mL, B/5 | `9443052` | Le catalogue Steripharm appuie la voie IV pour la gamme; voie IM et RCP individuel non établis. Alias avec avertissement. |
| GENTAINJECT 80 | B/100 | `9443054H` | Le catalogue Steripharm appuie la voie IV pour la gamme; voie IM et RCP individuel non établis. Alias avec avertissement. |
| GENTAINJECT 80 | B/5 | `9443053` | Le catalogue Steripharm appuie la voie IV pour la gamme; voie IM et RCP individuel non établis. Alias avec avertissement. |
| GENTAINJECT 160 | 160 mg/2 mL, B/1 | `9443051` | med.tn confirme identité/conditionnement sans préciser la voie. L’utilisateur a transcrit IM/IV sur l’étiquetage; non vérifié indépendamment. Ligne maintenue en attente. |
| CIDOMYCINE 20 | 20 mg/2 mL, B/5 | `9163491` | L’image officielle SAIPH de la boîte 20 mg/2 mL B/5 indique IM ou IV en perfusion. Mais la fiche fabricant associe l’image à l’AMM `9163496H` et affiche aussi 20 mg/mL; le lien avec la ligne DPM `9163491` reste à résoudre. Ligne maintenue en attente. |

## Pourquoi ces six ne sont-elles pas encore reliées aux fiches ?

Elles ne sont **pas comptées parmi les 530 exclues** : elles forment une catégorie séparée « en attente ». À la demande de l’utilisateur, les six noms ont été ajoutés à la recherche comme **alias provisoires**. L’utilisateur a transmis des transcriptions d’étiquetage pour ATROPINE SAIPH (SC, IV lente ou IM), GENTAINJECT160 (IM/IV) et CIDOMYCINE 20 (IM ou IV en perfusion); elles ne valident pas les doses génériques des fiches. L’indication IM/IV de GENTAINJECT160 n’a pas été vérifiée indépendamment; pour CIDOMYCINE, l’image SAIPH concorde mais la divergence d’AMM reste ouverte. Une alerte bilingue est affichée au-dessus des doses : l’indexation ne confirme pas l’équivalence complète ni les doses de marque et n’augmente donc pas le compte des 355 présentations confirmées.

Pour GENTAINJECT, le [catalogue officiel Steripharm](https://saiph-labo.com/wp-content/uploads/pdf/catalogue-sterile.pdf) liste les dosages et conditionnements 20/40/80/160 mg; les fiches produits donnent seulement « solution injectable », tandis que l’introduction décrit l’activité générale comme des solutions IV de petit volume. La fiche [med.tn GENTAINJECT 80 B/5](https://www.med.tn/medicament/gentainject-80-80-mg---2-ml-sol.-inj.-b-5-2-ml-33530.html) recoupe le nom, le dosage, la forme, la présentation et le fabricant, mais les informations visibles ne précisent pas IV/IM. La fiche [med.tn GENTAINJECT160](https://www.med.tn/pharmaceutical/gentainject160-160-mg-sol.-inj.-b-1fl-2-ml-33531.html) confirme aussi 160 mg, solution injectable, B/1 ampoule de 2 mL, STERIPHARM; elle ne précise pas la voie. Ces informations appuient l’identification et le contexte IV de gamme, sans fournir un RCP individuel ni la voie de chaque présentation. Les [recommandations tunisiennes STPI 2018](https://www.infectiologie.org.tn/pdf_ppt_docs/recommandations/1527103212.pdf) indiquent IV ou IM pour la gentamicine au niveau de la molécule (PNA adulte); elles n’établissent pas l’étiquetage de chaque GENTAINJECT. Le post Steripharm du 29/09/2022 annonce GENTAINJECT 160 et mentionne un lien « Fiche Produit » raccourci; sa redirection (`https://lnkd.in/dgP-gXKW`) n’a pas pu être résolue, donc aucune voie propre au produit n’en a été vérifiée. Pour ATROPINE SAIPH, le répertoire DPM des médicaments génériques (janvier 2024) et le fabricant confirment le produit et sa forme injectable, sans préciser la voie propre à cette marque. La transcription d’étiquetage reçue de l’utilisateur indique SC, IV lente ou IM, mais reste à vérifier sur une source consultable. Pour CIDOMYCINE 20, le [Formulaire thérapeutique tunisien DPM/MSP (2012), § 9.1.2](https://cdn.who.int/media/docs/default-source/essential-medicines/national-essential-medicines-lists-(neml)/emro_neml/tunisia-2012.pdf?sfvrsn=b4e5473c_5&download=true) liste la spécialité SAIPH 20 mg/2 mL B/5 comme solution injectable parentérale, sans distinguer IV/IM. L’[image de boîte publiée sur la fiche officielle SAIPH](https://saiph-labo.com/medicaments/antibiotiques/cidomycine/) indique IM ou IV en perfusion et 5 ampoules de 2 mL, en accord avec la transcription de l’utilisateur. Toutefois, la même fiche associe cette image à l’AMM 9163496H et affiche 20 mg/mL, tandis que la ligne DPM ciblée est 9163491, 20 mg/2 mL. Le lien réglementaire exact entre l’image et l’AMM ciblée n’est donc pas résolu; le [RCP officiel HPRA](https://assets.hpra.ie/products/Human/17940/Licence_PA0540-036-004_10062021133034.pdf) d’un produit étranger de même nom, teneur et boîte mentionne aussi IM/IV, sans lever cette discordance.

**Écart CIDOMYCINE à ne pas fusionner sans preuve :** la ligne DPM à rapprocher indique `9163491`, `20 mg/2 mL`, B/5; la page actuelle de SAIPH affiche `9163496H` et `20 mg/mL`, B/5. Le Formulaire DPM 2012 définit la mention H, lorsqu’elle remplace le prix dans ce formulaire, comme « usage hospitalier »; cette définition n’établit pas que l’écart AMM correspond à un transfert de licence et ne permet pas de fusionner les deux enregistrements.

Aucun document n’est requis de l’utilisateur. Les alias sont ajoutés à la recherche avec avertissement visible; la classification de l’audit reste « en attente » jusqu’à preuve suffisamment liée aux présentations tunisiennes.

## Limites de validation

- L’audit logiciel vérifie la recherche, les alias et les exclusions; il ne constitue pas une validation clinique des doses.
- Une notice, une AMM ou un catalogue ne prouve pas la disponibilité en stock.
- Les tests automatisés et le build ont réussi; aucun test sur appareil réel ni revue clinique indépendante n’a été réalisé.

## Documents détaillés et historiques

- `docs/DPM-ROUTE-VERIFICATION-2026-10-27.md` — preuves de voie et limites pour les vérifications ciblées.
- `docs/TUNISIA-DPM-BRANDS-AUDIT-2026-10-25.md` — audit détaillé par lots; contient des tableaux datés et des décisions historiques.
- `docs/AUDIT-GLOBAL-2026-10-27.md` — résumé plus large du projet.

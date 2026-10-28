# Vérification des voies — spécialités atropine et gentamicine

**État de la revue : 2026-10-27.** Cette note met à jour l’indexation des spécialités locales sans modifier les posologies des cartes cliniques.

## Décision de sûreté

Les fiches DPM fournies établissent, selon leur transcription, la DCI, les présentations et la forme « solution injectable » de plusieurs spécialités. Elles ne précisent pas si chaque produit est utilisable par voie IV, IM, ou par une autre voie. Une indication systémique ne suffit pas à établir une voie. Comme les cartes atropine et gentamicine contiennent des posologies propres à une voie, **les présentations concernées ne sont plus des alias de recherche confirmés** tant qu’un RCP propre au produit n’établit pas la voie. Le texte documentaire des marques reste affiché sur les cartes avec cette réserve; les requêtes portant sur ces noms ne renvoient plus vers une posologie IV.

Présentations ainsi mises en attente :

- **Atropine (3 AMM)** : ATROPINE SAIPH (`9163801H`), ATROPINE SULFATE AGUETTANT (`7093062H`), ATROPINUM SULFURICUM (`10793011H`). Les deux premières sont également décrites dans le relevé de fiches fourni; la troisième figure dans l’annexe documentaire.
- **Gentamicine (12 AMM)** : GENTA 80 (3 présentations), GENTAINJECT 80 (2), CIDOMYCINE 20 (1), UNIGENTA injectable (6, dont le conditionnement B/1 supplémentaire `9093536`). UNIGENTA 0,3 % collyre (`9093141`) reste exclu de la carte systémique.

Le terme « en attente » signifie ici que le lien **produit–voie** n’est pas démontré par les pièces examinées; il ne signifie ni absence d’AMM ni absence de disponibilité. Les concentrations et conditionnements indiqués sur les cartes restent ceux des documents recensés et ne doivent pas être extrapolés à une présentation différente.

## Date et limites des pièces

Le fichier fourni `atropine_gentamicine_fiches_completes.txt` porte la date d’extraction **2026-10-28**, soit le lendemain de la date de cette revue. Son contenu a été lu comme transcription fournie par l’utilisateur, mais cette date future n’est pas traitée comme une vérification web effectuée le 2026-10-27 ni comme une preuve indépendante de l’état courant du registre. Le fichier indique 20 présentations; ses champs « Forme » emploient « Solution injectable » pour les produits concernés, sans libellé de voie IV/IM. La page DPM de la liste des médicaments annonce une mise à jour au 07/10/2026; une AMM établit un enregistrement, pas la disponibilité en pharmacie.

Le fichier fourni `liste_amm_texte_complet.txt`, présenté comme snapshot du registre DPM de janvier 2024, est historique et ne prouve pas l’état courant. Il distingue BACTRIM/BACTRIM FORTE TERIAK en comprimés adultes (sulfaméthopyrazine + triméthoprime) de la suspension nourrissons/enfants indexée comme cotrimoxazole. Aucun alias BACTRIM n’est ajouté à la carte cotrimoxazole; les tests empêchent cette association silencieuse. Ces lignes de 2024 ne sont pas présentées comme des AMM actuelles.

## Comptage synchronisé

Le précédent état comptait 331 présentations AMM comme correspondances confirmées et 551 comme exclusions. Les 15 présentations ci-dessus passent de « confirmées » à « en attente de voie » : **316 confirmées, 551 exclues et 15 en attente** (882 lignes comptabilisées). Il s’agit de lignes de présentation/AMM, non de marques uniques. Ce changement ne clôt pas la revue des 73 médicaments ni l’audit complet des spécialités.

## Sources

- [DPM — liste des médicaments à usage humain](https://dpm.tn/medicament/humain/liste-des-medicaments) — la page annonce une mise à jour au 07/10/2026.
- [Fiche DPM ATROPINE SAIPH, cod_medic 10396](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=10396).
- [Fiche DPM ATROPINE SULFATE AGUETTANT, cod_medic 5947](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=5947).
- [Fiche DPM ATROPINUM SULFURICUM, cod_medic 9212](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=9212).
- [Fiches DPM gentamicine](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=7174) — voir aussi les identifiants documentés dans `docs/TUNISIA-DPM-BRANDS-AUDIT-2026-10-25.md`.
- [Comité DPM du 19/04/2024](https://dpm.tn/medicament/activites/28-banner/410-comite-technique-des-specialites-pharmaceutiques-du-19-avril-2024) — source contextuelle pour les formes BACTRIM, sans remplacer le snapshot ni établir le registre actuel.

## Tests

`__tests__/calc.test.ts` vérifie désormais que les noms atropine/gentamicine dont la voie n’est pas établie ne sont pas indexés comme alias des cartes à posologie IV, que la recherche par DCI continue de fonctionner, et qu’aucun terme BACTRIM ne se rabat sur une carte cotrimoxazole.

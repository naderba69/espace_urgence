# Revue documentaire — asthme aigu grave (2026-10-28)

## Portée et statut

Révision du protocole `asthme-aigu-grave`, de ses fiches médicaments liées et de l’assistant `/calculateurs/asthme`. Elle compare les changements ciblés aux sources ci-dessous; elle ne constitue pas une revue exhaustive de tous les contenus respiratoires du dépôt, une validation clinique indépendante, ni une approbation tunisienne. Les recommandations internationales ont été utilisées sans attendre un protocole local absent du dépôt.

## Sources consultées

1. **GINA**, *Summary Guide for Asthma Management and Prevention*, 2026, publié en juillet 2026. [PDF officiel — Figure 9, gestion d’une exacerbation chez l’adulte, l’adolescent et l’enfant de 6–11 ans](https://ginasthma.org/wp-content/uploads/2026/07/GINA-Summary-Guide-2026-WEB-WMS.pdf). La Figure 9 se trouve p. 36; les paragraphes connexes sont aux pp. 33–37. Le guide précise que les informations d’oxymétrie peuvent surestimer la saturation chez les personnes à peau foncée et que les cibles doivent être adaptées à l’altitude.
2. **GINA**, *Difficult-to-Treat & Severe Asthma in Adolescent and Adult Patients*, V7.0, mai 2026. [Guide officiel](https://ginasthma.org/wp-content/uploads/2026/06/GINA-Severe-Asthma-Guide-2026-WEB-WMS.pdf). Il décrit l’ipratropium comme ajout de courte durée au SABA lors des exacerbations sévères, surtout durant les 1–2 premières heures; il ne fournit pas ici de conversion de dose nébulisée.
3. **NHS Greater Glasgow and Clyde (GGC)**, *Management of Acute Severe Asthma in Adults in Hospital*. [Page clinique](https://handbook.ggcmedicines.org.uk/guidelines/respiratory-system/management-of-acute-severe-asthma-in-adults-in-hospital/), page indiquée comme mise à jour en septembre 2022 et fondée sur SIGN 158 (2019). Elle donne 0,5 mg d’ipratropium nébulisé pour la prise en charge initiale adulte. C’est une référence NHS locale relativement ancienne, utilisée uniquement pour tracer cette dose nébulisée adulte non donnée dans la Figure 9 de GINA; elle ne justifie pas de convertir les 4 bouffées de GINA en dose nébulisée ni d’actualiser ses autres cibles plus anciennes.
4. **Sydney Children’s Hospitals Network (SCHN)**, *Asthma — Acute Management*, v10.2, publication du 6 février 2026. [PDF officiel](https://resources.schn.health.nsw.gov.au/policies/policies/pdf/2007-8358.pdf), tableaux médicaments pp. 8–9. Cette ligne directrice pédiatrique (champ de la page de garde : enfants de plus d’un an) donne, pour l’ipratropium nébulisé, 250 µg de 6 mois à 6 ans et 500 µg au-delà de 6 ans, généralement jusqu’à trois doses espacées de 20 min en exacerbation sévère/menaçant le pronostic vital. Le protocole conserve sa propre indication d’application (>1 an); aucune dose n’est fournie ici pour un nourrisson de moins d’un an.

## Points repris de GINA 2026

- **Champ d’âge :** adultes, adolescents et enfants de 6 ans et plus dans ce schéma. Pour une personne de moins de 6 ans, utiliser un parcours petite enfance distinct. Chez les moins de 18 ans, GINA demande un score clinique validé, par exemple PRAM.
- **Évaluation et gravité :** évaluer parole, capacité à boire/s’allonger, fréquence respiratoire, SpO₂ en air ambiant, auscultation et PEF si disponible. Les critères sévères comprennent notamment impossibilité de parler/boire/s’allonger, SpO₂ <92 % en air ambiant, FR >30/min, thorax silencieux/peu ventilé ou PEF <50 %. Somnolence, confusion ou cyanose signalent un danger vital et imposent une escalade/transfert urgent.
- **Anaphylaxie associée :** adrénaline IM en premier, selon le protocole d’anaphylaxie.
- **Oxygène :** ne pas l’administrer systématiquement; si la SpO₂ est <92 % et qu’il est indiqué, le titrer à 92–95 %, en tenant compte de l’altitude et des limites de l’oxymétrie.
- **Salbutamol, forme sévère :** 6–10 bouffées de 100 µg par pMDI avec chambre, une bouffée à la fois, ou 5 mg nébulisés; répéter seulement si nécessaire toutes les 20–30 min, jusqu’à trois doses durant la première heure, avec réévaluation. Le pMDI avec chambre reste une voie appropriée lorsque la situation clinique le permet.
- **Ipratropium :** en forme sévère, 4 bouffées par pMDI avec chaque dose de salbutamol, jusqu’à trois fois dans le schéma GINA. GINA décrit un usage aigu de courte durée (première phase, environ 1–2 h) et ne donne pas de conversion pMDI→nébulisation dans la Figure 9. Les doses nébulisées sont donc tracées séparément aux sources NHS GGC/SCHN ci-dessus.
- **Corticostéroïdes systémiques :** sauf exacerbation légère, prednisolone PO 40–50 mg chaque matin pendant 5–7 jours chez l’adulte; enfant 1–2 mg/kg/j, maximum 40 mg/j, pendant 3–5 jours.
- **Sortie :** seulement lorsque les critères légers sont rétablis et stables pendant 1–2 h après la dernière dose de salbutamol, SpO₂ en air ambiant ≥92 %, PEF >70 % du meilleur/prédit et ressources à domicile suffisantes; optimiser le traitement contenant un CSI, remettre un plan d’action et organiser un suivi dans la semaine.
- **Escalade :** en cas de réponse insuffisante à la prise en charge initiale d’une forme sévère, transfert/avis urgent, réévaluation et MgSO₄ IV sélectif. La dose adulte de 2 g sur 20 min utilisée ici est dans la fourchette 1,2–2 g/20 min du NHS GGC 2022; elle ne doit pas être transposée à l’enfant. L’assistant ne calcule pas le MgSO₄ pédiatrique.

## Changements logiciels réalisés

- Le protocole est borné à ≥6 ans, inclut l’évaluation PRAM, l’anaphylaxie, les seuils/cibles GINA, la posologie SABA, la prednisolone, l’escalade et les critères de sortie/suivi. Les métadonnées citent désormais les références réellement utilisées.
- La fiche salbutamol reprend les doses aiguës GINA et l’évaluation après chaque dose; elle avertit de ne pas transposer automatiquement le schéma d’asthme à la BPCO.
- L’ipratropium distingue dose pMDI GINA et doses nébulisées NHS/SCHN, sans conversion. L’assistant suit exactement la frontière pédiatrique SCHN : 250 µg jusqu’à 6 ans inclus, 500 µg strictement au-delà de 6 ans; le journal conserve la dose utilisée si l’âge est ensuite modifié. Un test UI couvre 6,0 ans puis 6,1 ans.
- La fiche hydrocortisone distingue l’alternative IV adulte si la voie orale est impossible et l’alternative pédiatrique SCHN de 2e intention; la prednisolone PO reste le schéma de référence GINA dans ce parcours.
- Une fiche prednisolone est ajoutée pour que le médicament cité dans le protocole soit disponible par identifiant; aucune marque, présentation ni disponibilité locale n’est affirmée.
- `/calculateurs/asthme` demande l’âge, refuse les doses pour <6 ans, expose la fourchette pédiatrique de prednisolone sans choisir une dose, limite le salbutamol à trois doses enregistrées avec un intervalle minimal de 20 minutes et ne propose le MgSO₄ calculé qu’à l’adulte. Il ne classe pas la gravité et ne remplace pas le transfert/avis urgent.

## Informations non vérifiées / limites

- Pas de protocole tunisien de service, de formulaire thérapeutique ou de RCP tunisien de prednisolone/ipratropium archivé ou vérifié dans cette passe. Les dosages NHS/SCHN sont des références externes et ne prouvent ni stock ni présentation en Tunisie.
- Pas de revue indépendante par urgentiste et pharmacien, pas de validation institutionnelle, et pas de tests réels sur Chromium/appareil. Les tests automatiques confirment des chaînes, identifiants et garde-fous de code, pas la justesse clinique de chaque décision.
- L’assistant reste un outil de suivi/tracé : il n’établit pas le diagnostic, ne détermine pas la gravité, ne choisit pas la dose dans la fourchette pédiatrique et ne décide pas de la sortie.

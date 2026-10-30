# Revue des schémas d’héparine non fractionnée — 2026-10-28

## Conclusion opérationnelle

Les schémas HNF initiaux ne sont pas interchangeables. Le calculateur n’affiche désormais aucune dose avant un choix explicite entre un parcours SCA et un parcours TVP/EP avec HNF déjà retenue par l’équipe. Ce choix logiciel ne décide pas de l’anticoagulant pour le patient.

| Contexte | Schéma vérifié dans la source retenue | Limite affichée dans l’application |
|---|---|---|
| SCA, anticoagulation initiale hors bolus de PCI | HNF 60 UI/kg IV (max. 4 000), puis 12 UI/kg/h (max. 1 000 UI/h); TCA 60–80 s | La fibrinolyse modifie la cible à 50–70 s; l’ajustement ultérieur suit le protocole cardiologique/local. Le calculateur ne traite pas la dose de PCI. |
| TVP/EP, uniquement si HNF choisie | UW Medicine : 80 UI/kg IV (max. 10 000), puis 18 UI/kg/h; anti-Xa initial à 6 h, cible régulière 0,3–0,7 UI/mL | Exemple institutionnel, non promu comme standard universel. Le TCA dépend du laboratoire et de son nomogramme. Pour l’EP, AHA/ACC 2026 préfère l’HBPM à l’HNF dans la plupart des anticoagulations parentérales initiales. |
| PCI en SCA | Bolus distinct, typiquement 70–100 UI/kg selon l’anticoagulation préalable, ajusté sur ACT (cible 250–300 s) | Pas de calcul de dose PCI dans cette page; réglage en salle de cathétérisme. |
| Ischémie aiguë de membre | ESVS 2020 : bolus initial 5 000 UI ou 70–100 UI/kg, puis perfusion ajustée à la réponse; monitorage ACT ou TCA | Ne pas importer automatiquement le débit 18 UI/kg/h ou un ratio TCA d’un protocole TVP/EP. Coordination vasculaire urgente. |
| Ischémie mésentérique aiguë | WSES 2022 recommande l’anticoagulation thérapeutique préopératoire et décrit l’HNF comme facile à piloter, sans établir ici de bolus 80 UI/kg ni de nomogramme universel. | Le choix et la séquence périopératoire sont coordonnés en urgence avec l’équipe chirurgicale/vasculaire. |

## Modifications effectuées

- `app/calculateurs/heparine/page.tsx` : suppression du schéma initial implicite `80/8 000 + 18` et du TCA générique `1,5–2,2×`; choix obligatoire d’indication, plafonds SCA explicites, cible TCA adaptée à la fibrinolyse, avertissement PCI et avertissement sur la préférence actuelle HBPM dans l’EP.
- `lib/calc.ts` : le calcul HNF exige maintenant les paramètres du schéma au lieu de porter une posologie adulte implicite. Les plafonds de bolus et de débit sont testés séparément.
- `data/perfusions.ts` : le preset SCA passe de 70/12 à 60/12; bolus plafonné à 4 000 et débit initial limité à 1 000 UI/h. La ligne TVP/EP est explicitement un exemple UW, non une option générique préférentielle; le conseil générique « poursuivre pendant alteplase » est retiré.
- `data/medications-p4.ts`, `data/calculators.ts` et métadonnées du protocole EP : doses, sources et portée alignées; les variantes de concentrations sont présentées comme exemples de calcul dépendant de la préparation réellement prescrite, non comme préparation tunisienne validée.
- `data/protocols-p7.ts` : distinction entre anticoagulation du SCA et bolus de PCI.
- `data/protocols-p9.ts` : le parcours d’ischémie aiguë de membre cite la dose initiale ESVS mais retire le débit VTE et le ratio TCA universels; le parcours mésentérique ne conserve pas le bolus non spécifié par la source.

## Sources examinées

1. **AHA/ACC/ACEP/NAEMSP/SCAI, 2025 ACS Guideline**, Table 10, article corrigé en ligne : <https://www.ahajournals.org/doi/10.1161/CIR.0000000000001309>. La correction officielle du 23 juin 2025 précise, pour l’HNF avec fibrinolyse, le schéma 60 UI/kg (max. 4 000) puis 12 UI/kg/h (max. 1 000) et la cible TCA 50–70 s : <https://www.ahajournals.org/doi/10.1161/CIR.0000000000001346>.
2. **AHA/ACC/ACCP/ACEP/CHEST/SCAI/SHM/SIR/SVM/SVN, 2026 Acute PE Guideline**, recommandation sur le choix de l’anticoagulation parentérale initiale : <https://www.ahajournals.org/doi/10.1161/CIR.0000000000001415>. La page indique qu’une correction de l’article existe; la mise à jour des seuils échographiques est sans rapport avec la préférence anticoagulante documentée dans la recommandation. Le texte de cette recommandation doit être relu à nouveau si la guideline est amendée.
3. **UW Medicine Anticoagulation Services, Heparin**, protocole institutionnel consulté le 28 octobre 2026 : <https://sites.uw.edu/anticoag/drugs/heparin/>. Le tableau donne, pour thrombose aiguë dont TVP/EP, bolus 80 UI/kg avec maximum 10 000, perfusion 18 UI/kg/h, contrôle anti-Xa initial à 6 h et cible régulière 0,3–0,7 UI/mL. Cette source décrit le protocole UW, pas un standard tunisien ni une recommandation nationale.
4. **Björck et al., ESVS 2020 Clinical Practice Guidelines on Acute Limb Ischaemia**, section 3.1 : bolus HNF initial 5 000 UI ou 70–100 UI/kg, ensuite perfusion ajustée à la réponse, monitorée ACT ou TCA; Recommendation 9 : héparine en attente de revascularisation. DOI <https://doi.org/10.1016/j.ejvs.2019.09.006> (copie PDF consultée : <https://www.angiolife.com.ua/media/pages/files/Acute%20Limb%20Ischaemia-2020.pdf>).
5. **Bala et al., WSES 2022 Acute Mesenteric Ischaemia Guidelines**, section « re-establishment of blood supply » et recommandations de traitement : anticoagulation thérapeutique avant intervention; HNF facile à piloter, notamment en insuffisance rénale; anticoagulation continue HNF possible pour thrombose veineuse mésentérique. La source ne fournit pas de bolus universel 80 UI/kg dans ces passages : <https://doi.org/10.1186/s13017-022-00443-x>.

## Points vérifiés / non vérifiés

- **Vérifié dans les sources citées :** doses et plafonds ACS (avec différence de cible fibrinolyse), dose de PCI comme cadre distinct, exemple institutionnel UW de TVP/EP, recommandation AHA/ACC 2026 favorisant HBPM en général pour EP, dose initiale ESVS en ischémie aiguë de membre, absence de dose universelle 80/18 dans les passages WSES consultés pour l’ischémie mésentérique.
- **Non vérifié :** adoption de ces références par les services tunisiens; choix d’une préparation/concentration standard locale; protocole TCA du laboratoire tunisien; exceptions patient-spécifiques, obésité, chirurgie imminente, saignement, fibrinolyse/reperfusion et transitions anticoagulantes.
- **N’est pas une validation clinique :** changements de code, formules et tests automatisés ne valident pas le contenu au lit du patient. Revue indépendante clinico-pharmaceutique tunisienne et essais sur appareils réels restent requis.

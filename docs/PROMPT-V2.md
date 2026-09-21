# PROMPT V2 (revu & corrigé) — "Espace Urgence TN"

> Version consolidée de la demande initiale, après analyse critique.
> Changements clés vs V1 : **sécurité médicale renforcée** (sources + revue + avertissement bloquant),
> **RTL arabe explicite**, **modèles IA à jour et champ libre**, **IndexedDB pour les images ECG**,
> **service worker maison** (next-pwa abandonné), **tests unitaires des calculateurs**,
> numéros d'urgence tunisiens complets, phasage du chantier.

Créer une application web complète "Espace Urgence TN" pour professionnels des urgences (médecins et infirmiers). Plateforme bilingue (**français par défaut, arabe commutable avec RTL complet**) de référence et d'outils : protocoles, médicaments, calculateurs interactifs, ECG, procédures, pédiatrie, obstétrique, psychiatrie, traumatologie, et fonctions IA optionnelles. React/Next.js (App Router, export statique), Tailwind CSS, localStorage, PWA installable hors-ligne, impression, alertes sonores, Google Analytics. L'IA (clé API fournie par l'utilisateur — Gemini ou OpenRouter) inclut une fonction phare : **analyse d'ECG par photo**.

## RÈGLE D'OR — SÉCURITÉ MÉDICALE

- Chaque protocole, médicament ou procédure porte OBLIGATOIREMENT : `sources: string[]` (ex. "ERC 2021", "AHA ACLS 2025", "ATLS 10e") et `lastReviewed: string` (AAAA-MM).
- Rédiger le contenu **d'après les référentiels réels** (ERC, AHA, RCUK, ATLS, ESC, ILCOR, SFAR/HAS), pas "de mémoire". Marquer en pied de chaque fiche : *contenu à valider par un médecin — vérifier les doses*.
- **Écran d'avertissement bloquant au premier lancement** (acceptation stockée dans localStorage) : outil d'aide-mémoire pour professionnels, ne remplace pas le jugement clinique.
- Adapter aux spécialités disponibles en Tunisie quand connu (concentrations d'ampoules locales, ex. Adrénaline 1 mg/1 mL) et le mentionner.
- Les résultats d'analyse IA d'ECG sont des **"suspicions"**, jamais des valeurs définitives ; avertissement de confirmation cardiologique sur chaque résultat.

## EXIGENCES TECHNIQUES

- Next.js 16 App Router, TypeScript strict, `output: 'export'`, `images: { unoptimized: true }`.
- Tailwind CSS v4. **Dark par défaut** via classe `.dark` (script anti-FOUC dans `<head>` lisant localStorage).
- **RTL complet** : `dir="rtl"` + `lang="ar"` sur `<html>` quand l'arabe est actif ; utilitaires logiques (`ms/me/ps/pe/start/end`) ; mise en page (sidebar, chevrons) en miroir.
- Polices Google : **Inter** (latin) + **Cairo** (arabe) via `next/font` (auto-hébergées).
- Icônes : lucide-react uniquement.
- Pas de backend : contenu dans `data/*.ts` bilingue `{ fr, ar }` ; données utilisateur (langue, thème, favoris, récents, réglages, config IA, historique) en localStorage **sauf images ECG → IndexedDB** (miniatures ≤300 px JPEG, max 30 entrées, éviction FIFO).
- i18n : provider React maison ; tous les libellés UI + contenus dans les deux langues ; toggle dans l'en-tête.
- Recherche globale : suggestions, historique local, filtres, **synonymes** (adrénaline/epinephrine…), normalisation des accents ET de l'arabe (alif/ta marbuta/tashkeel), recherche vocale (Web Speech API, repli gracieux hors Chrome ; noter le support arabe variable).
- Favoris : toutes les entités, ordre modifiable par glisser-déposer (HTML5 natif), affichés en accueil.
- Récents : dernières pages vues en accueil.
- PWA : manifest multi-icônes (purpose any/maskable) + **service worker manuel** dans `public/sw.js` (précache du shell, network-first pour les pages, page `/offline` en repli). PAS de next-pwa (projet abandonné). Rappel : caméra/micro/PWA exigent HTTPS (ou localhost).
- Audio : Web Audio API (bips synthétisés, métronome RCP 110/min, alarme fin de cycle distincte), bascule muet globale.
- Impression : styles `@media print` (masquer nav/boutons, sauts de page), bouton Imprimer sur chaque fiche.
- Analytics : GA4 via script injecté côté client, **ID `G-XXXXXXXXXX` placeholder** ; ne rien charger si placeholder ou désinscription (opt-out dans Paramètres). Événements : recherche, vues de fiches, usage calculateurs, impression, requêtes IA.
- Accessibilité : contrastes WCAG AA, skip-to-content, focus visibles, ARIA, cibles tactiles **≥44 px**, navigation clavier.
- Performance : lazy-load des composants lourds (simulateur ECG, analyseur) ; dépendances minimales.
- **Tests** : tests unitaires (vitest) OBLIGATOIRES pour toute fonction de calcul de dose/score/débit.

## IA (optionnelle — clé utilisateur) — PHASE 3

- **Paramètres → section IA** : fournisseur (Gemini / OpenRouter) ; **nom du modèle = champ texte libre** avec valeur par défaut modifiable (défaut actuel : `gemini-2.5-flash` — NE JAMAIS figer une liste fermée, Google retire les modèles tous les ~6 mois) ; clé API masquée (localStorage) ; bouton "Tester la connexion" ; interrupteur général ON/OFF ; mention des coûts et de l'envoi de données au fournisseur ; boutons d'effacement de l'historique chat + analyses ECG.
- **Service IA** (`lib/ai.ts`) : `generateText(prompt, systemPrompt?)`, `analyzeImage(imageBase64, prompt)`, `textToSpeech(text)` (Web Speech API d'abord) ; erreurs en messages clairs (clé invalide, quota, réseau, hors-ligne).
- **Assistant chat** : FAB sur toutes les pages, historique par session (localStorage), system prompt "médecine d'urgence, réponses concises et actionnables", actions rapides.
- **Analyseur ECG** (`/ecg-analyzer`) : capture caméra (getUserMedia + repères d'alignement) OU upload ; prompt exigeant une analyse structurée (rythme, FC, PR/QRS/QT, ST, ondes T, signes d'hyperK/BAV, diagnostic suspecté, niveau de confiance, recommandations immédiates) ; carte résultat colorée (vert/jaune/rouge) ; boutons Que faire ? / Copier / Imprimer / Partager (Web Share + repli presse-papiers) / Lire à voix haute ; historique IndexedDB avec comparaison côte à côte ; avertissement "analyse d'aide uniquement — confirmation par un cardiologue qualifié".
- **Aide au triage IA** : plainte + constantes → catégorie suggérée (rouge/orange/vert) + actions initiales + liens vers protocoles.
- **Générateur de compte rendu** : données patient → note de transmission copiable/imprimable.
- **Générateur de quiz** : QCM depuis le contenu du site, correction expliquée.
- Dégradation gracieuse partout : sans clé ou hors-ligne → message clair, le reste de l'app reste 100 % fonctionnel.

## STRUCTURE DU SITE

1. **Accueil** : recherche + voix, favoris réordonnables, récents, actions rapides (chrono RCP, dose/poids, GCS, anaphylaxie, analyseur ECG), constantes normales par âge, **numéros Tunisie : SAMU 190 · Protection Civile 198 · Police Secours 197 · Garde Nationale 193 · Centre antipoison Tunis 71 335 500 (à vérifier)**, bouton Mode Urgence.
2. **Protocoles** : catégories (ACLS, PALS, ATLS/XABCDE, RCP, AVC, anaphylaxie, toxico, obstétrique, psychiatrique, trauma, pédiatrie…) ; fiche = étapes numérotées, points-clés, médicaments liés, sources, impression ; arbres décisionnels simples (React state).
3. **Médicaments** : recherche/filtres/synonymes ; fiche : nom FR/AR, classe, indications, doses adulte/**pédiatrique**, dilution, CI, EI, surveillance infirmière, conservation, alternatives, interactions ; **drapeau haut risque** ; mini-calculateur poids intégré quand dose mg/kg.
4. **Calculateurs** : dose/poids, débit perfusion (gt/min + mL/h), brûlures (règle des 9 + Lund-Browder pédiatrique, SVG cliquable), GCS **adulte + pédiatrique pré-verbal**, NIHSS, convertisseur d'unités, chrono RCP, mcg/kg/min (amines), dose anaphylaxie IM par âge, estimation poids pédiatrique **par longueur/âge** (formule (âge×2)+8 — éviter la marque Broselow®), réglages ventilatoires, remplissage (Parkland…), insuline DKA, correction Na+, héparine, HAS-BLED, CURB-65, Wells EPO/EP. Chaque calculateur : impression + mémorisation de la dernière saisie.
5. **ECG de référence** : 10 rythmes (ondes SVG animées : sinusal, FA, TV, FV, STEMI…) + simulateur + lien analyseur IA.
6. **Analyseur ECG (IA)** : voir ci-dessus.
7. **Procédures** : gestes (VVP, IOT+péri, défibrillation, drainage thoracique, KTVC…) avec matériel, étapes, checklists interactives (pré/post-intubation, code blue).
8. **Pédiatrie** : doses par poids/âge, PALS, déshydratation (OMS), constantes par âge, poids estimé.
9. **Obstétrique** : accouchement inopiné, pré-éclampsie/éclampsie (sulfate de magnésium), HPP.
10. **Psychiatrie** : risque suicidaire, agitation aiguë (sécurisation d'abord), antidotes courants.
11. **Traumatologie** : immobilisation, GCS, précautions rachidiennes.
12. **Paramètres** : langue, thème, taille du texte (16/18/20), son, installation PWA, opt-out analytics, raccourcis, réinitialisation, **section IA**.
13. **Offline** : page statique bilingue.

## CONTENU ATTENDU (à produire par phases, revue médicale avant livraison de chaque phase)

- ≥8 catégories, ≥20 protocoles ; ≥25 médicaments d'urgence ; 10 rythmes ECG ; 8 procédures ; constantes par âge ; numéros ; antidotes.
- Modèles TypeScript : voir `data/types.ts` (Localized, ReviewMeta, Medication, Protocol, CalculatorMeta, DrugInteraction, weightDose structuré pour le calculateur).
- Tout le contenu en FR et AR, médical professionnel, doses en unités métriques claires (µg/mg, mL), jamais d'abréviation ambiguë.

## DESIGN

- UI médicale propre, contraste élevé ; navy `#0f172a` (fond sombre), teal `#0d9488` (primaire), rouge `#dc2626` (urgent) ; clair `#f8fafc`.
- Mobile-first, typographie 16 px (réglable 16/18/20).
- **Mode Urgence** : plein écran, boutons géants (≥96 px) : chrono RCP, dose/poids, GCS, anaphylaxie, débit, analyseur ECG, protocoles critiques ; sortie visible.
- Chat IA : bulles modernes, actions rapides, indicateur de frappe, bouton d'effacement.

## LIVRABLES

App complète + données + configs + README (installation dev/build ; déploiement Vercel avec `out/` ; remplacement ID GA et icônes PWA ; **recette de configuration de la clé IA** ; rappel "contenu à faire valider par un médecin"). Code commenté, prêt pour remplacement/validation du contenu.

## PHASAGE RECOMMANDÉ

- **Phase 1** : socle (i18n/RTL, thème, recherche, favoris/récents, PWA, impression, audio, avertissement, mode urgence) + 5 protocoles, 8 médicaments, 4 calculateurs étalons.
- **Phase 2** : masse de contenu (tous protocoles/médicaments/calculateurs restants, ECG de référence, procédures, pédiatrie/obstétrique/psy/trauma) + tests calculateurs.
- **Phase 3** : couche IA complète (clé, chat, analyseur ECG caméra, triage, compte rendu, quiz).

# Audit global du projet — 2026-10-27

## Résumé exécutif

Cet audit couvre le dépôt, les tests, les routes statiquement exportées, les points d’entrée de l’interface, la persistance locale, les intégrations IA et plusieurs zones cliniques à haut risque. Il a été conduit par analyse du code et vérifications automatisées; **ce n’est ni une validation clinique, ni une revue exhaustive ligne par ligne de chacun des 184 fichiers de pages, de chacun des 73 médicaments et de chacun des 98 protocoles**.

**Conclusion de mise en service : ne pas présenter l’application comme un dispositif clinique validé.** Deux fonctions IA génèrent actuellement des décisions de triage ou des posologies libres, sans moteur déterministe ni contrôle de source. Un défaut confirmé dans le service worker casse le repli hors-ligne lorsqu’une page n’est pas dans le cache. Une couleur de triage contredit son libellé. Ces problèmes doivent être traités avant toute utilisation comme aide décisionnelle.

## Portée et preuves recueillies

- Arborescence : 184 fichiers de page dans `app/`, 54 composants, 35 modules `lib/`, 18 fichiers de tests.
- CI locale : `npm test` **755/755**; `npm run lint` réussi; `npx tsc --noEmit` réussi; `npm run build` réussi et Next.js a généré **448 pages**.
- Export local : **348 fichiers `index.html`** testés par HTTP, tous en **200**; contrôle ciblé également réussi pour le calculateur rénal ATB, une fiche médicament, un protocole, le service worker, le manifeste et l’icône PWA.
- Références techniques : 231 liens internes repérés, aucun lien mort selon le script; 106 clés de dictionnaire utilisées, aucune manquante; inventaire de sources synchronisé : **750 entrées dans 20 groupes**.
- Dépendances de production : `npm audit --omit=dev --audit-level=moderate` indique **0 vulnérabilité**.
- Contrôle d’interface réelle non terminé : Playwright ne peut pas démarrer, car le binaire Chromium n’est pas installé (`Executable doesn't exist ... chromium_headless_shell`). Les audits responsive/crawl/clipping n’ont donc pas produit de constat visuel valable. Les tests React et HTTP statique ne remplacent pas le test tactile/visuel sur navigateur.

## Défauts confirmés et risques bloquants

### A-01 — Service worker : variable inexistante dans le repli hors-ligne

**Sévérité : P1 — défaut fonctionnel confirmé.** `public/sw.js:60-61` termine le parcours hors-ligne par `return norm || dir || off || new Response(...)`, mais `norm` et `dir` ne sont déclarées nulle part dans le fichier.

**Conséquence :** si le réseau échoue et qu’aucune variante de l’URL n’est dans le cache, l’évaluation de `norm` lève une `ReferenceError` avant d’atteindre la page de secours. Le navigateur risque alors d’afficher un échec de navigation au lieu du message hors-ligne prévu. Les pages précachées peuvent encore fonctionner; ce défaut vise précisément une page non disponible dans le cache.

**Correction attendue :** retourner d’abord `off` si présent, puis la réponse HTML intégrée; supprimer les identifiants inconnus; ajouter un test unitaire du handler fetch avec réseau rejeté et caches vides, plus un test avec route déjà mise en cache.

### A-02 — Flash IA : génération et affichage de posologies libres

**Sévérité : BLOQUANT sécurité clinique.** `app/flash-ia/page.tsx:111-138` demande explicitement au modèle de calculer/générer des doses à partir du poids et de l’âge (« dérivées du poids/âge »). La réponse est convertie par simple `JSON.parse` et assertion TypeScript; seule la présence d’une séquence est contrôlée. Les liens sont filtrés contre le fichier de références, **mais les médicaments, posologies, unités, voies, doses maximales et calculs ne sont pas validés par le code**. Le résultat est affiché sous « Doses suggérées » (`:255-266`).

**Conséquence :** une dose plausible mais erronée, une mauvaise voie, une unité incorrecte ou une dose pédiatrique dangereuse peuvent être présentées comme actionnables. Le message « aide indicative » ne constitue pas une validation.

**Correction attendue :** supprimer les posologies générées par le modèle de ce mode. Soit n’afficher que des liens vers le contenu vérifié, soit faire choisir un médicament/contexte et calculer uniquement dans un moteur déterministe sourcé et testé. Toute explication IA doit être séparée du résultat et explicitement non prescriptive.

### A-03 — Triage IA : attribution de couleur clinique par LLM

**Sévérité : BLOQUANT sécurité clinique.** `app/triage-ia/page.tsx:42-52` demande au modèle de décider ROUGE/ORANGE/VERT à partir du motif et de constantes qui peuvent être vides. La sortie est acceptée si `category` correspond à une clé; aucun contrôle déterministe des constantes, âge, contexte, critères d’exclusion ou seuils de priorité n’est appliqué. Les champs `actions` et `protocolIds` ne sont pas validés par schéma complet.

**Conséquence :** une sous-priorisation (par exemple vert/orange au lieu de rouge) peut retarder une prise en charge. Un prompt « en cas de doute, catégorie la plus grave » ne garantit pas le résultat d’un LLM.

**Correction attendue :** ne pas utiliser la réponse IA comme décision de triage. Réserver l’IA à une aide rédactionnelle/éducative non décisionnelle; la priorité doit venir de règles explicites, sourcées, testées, avec protocole de re-triage et validation humaine.

### A-04 — Couleur incohérente : « VERT » rendu en bleu

**Sévérité : P1 — risque de facteur humain.** Dans `app/triage-ia/page.tsx:21-24`, `vert` utilise `bg-blue-600`, tandis que le texte français indique « VERT » et l’arabe « أخضر » (vert). Le bleu peut contredire le code couleur attendu au moment où le personnel lit rapidement le résultat.

**Correction attendue :** utiliser un vert accessible et cohérent avec les autres écrans de triage, et tester simultanément le libellé, la couleur, le contraste en mode clair/sombre et la différenciation sans couleur seule.

### A-05 — Analyse ECG IA : estimation structurée sans validation clinique des valeurs

**Sévérité : P1 — risque clinique.** `components/ecg/ECGAnalyzer.tsx` envoie une photo à un LLM; `lib/ecg-parse.ts:13-27,37-43` accepte les valeurs numériques finies, mais ne borne pas la fréquence cardiaque ni la confiance (une confiance hors 0–1 est affichable en pourcentage), ne valide pas les intervalles et accepte des recommandations textuelles libres. Les identifiants de protocoles sont des chaînes libres côté parseur; le résolveur de liens les filtre plus tard, mais les autres résultats restent affichés.

**Conséquence :** estimation incertaine ou valeur aberrante pouvant paraître mesurée ou interprétée comme un diagnostic. Une photo non calibrée ne permet pas d’établir avec fiabilité les intervalles ou la fréquence.

**Correction attendue :** rendre toujours visible que l’analyse est non diagnostique, imposer la validation médicale et l’ECG original; contrôler les plages numériques et la taille des chaînes, afficher la qualité/limites de l’image et ne jamais laisser la sévérité IA remplacer une lecture humaine. Ajouter tests de réponses adversariales et malformées.

## Sécurité, vie privée et qualité des données

### A-06 — Données de patient conservées localement sans expiration automatique

`components/ActivePatient.tsx:11-13,45-65` conserve poids, âge et créatinine du patient actif dans `localStorage`, et archive jusqu’à cinq cas fermés sous `eutn:patient-log`. D’autres fonctions conservent constantes, problèmes et journaux. Cette conservation est persistante jusqu’à suppression; la fermeture d’un cas déplace les valeurs dans l’archive au lieu de les effacer.

**Risque :** sur une tablette d’ambulance ou un poste partagé, des données de santé restent accessibles au prochain utilisateur. Il existe un effacement global dans Paramètres, mais pas d’expiration, verrouillage de session ou suppression simple de chaque entrée d’archive.

**À faire :** décider explicitement si les journaux patients sont nécessaires; sinon les désactiver par défaut. Sinon, ajouter effacement individuel, durée de rétention courte configurable, effacement automatique à la fin de session et avertissement visible avant archivage. Vérifier la politique locale de protection des données. Ne pas présenter le stockage local comme synonyme de sécurité.

### A-07 — Préférences localStorage typées à tort, sans validation d’exécution

`lib/storage.ts:12-19` fait un `JSON.parse` puis un cast TypeScript, sans valider la structure. `components/Providers.tsx:101-107` fusionne ensuite directement ces valeurs dans l’état. Exemple vérifiable dans le code : si `eutn:prefs.lang` contient une valeur non prise en charge, `Providers.tsx:202` indexe `dictionaries[prefs.lang][k]` et peut faire échouer le rendu. Des valeurs incorrectes pour `recent`, `favorites`, le patient ou `ai-config` peuvent également provoquer des erreurs de type au montage ou dans les paramètres.

**Correction attendue :** valider chaque entrée persistée avec un schéma runtime, normaliser vers les valeurs par défaut, versionner les structures et tester JSON corrompu, données anciennes, valeurs hors enum et tableaux malformés.

### A-08 — Clé IA stockée en clair et envoyée dans l’URL Gemini

`lib/ai-config.ts:53-55` persiste la clé API en clair dans le stockage local. `lib/ai.ts:47-55` place aussi la clé Gemini dans le paramètre `?key=` de l’URL de requête. Le panneau Paramètres avertit de ne pas entrer la clé sur un appareil partagé, ce qui est utile, mais n’empêche ni l’accès par scripts exécutés dans la même origine ni l’exposition de l’URL dans les outils de diagnostic/proxy.

**Correction attendue :** documenter le modèle de menace et les coûts; préférer un en-tête d’authentification si le fournisseur le supporte; avertir avant stockage et fournir une suppression explicite de la clé. Ne jamais intégrer de clé partagée dans le build.

### A-09 — Appels IA externes et données de santé

Les appels à Gemini/OpenRouter sont envoyés directement depuis le navigateur (`lib/ai.ts`). Certaines pages expédient au fournisseur un motif, des constantes, une histoire, des traitements ou une image ECG. L’interface Paramètres le signale, et l’explication des calculateurs demande une confirmation; cependant, ce niveau de consentement n’est pas uniformément visible sur tous les parcours IA.

**À faire :** rendre le destinataire, la donnée transmise et le caractère externe visibles juste avant chaque envoi; empêcher l’envoi de noms/identifiants; offrir une alternative hors-ligne; faire examiner le traitement des données et les conditions des fournisseurs avant usage réel avec des données patient.

### A-10 — Prompt vision Gemini transmis comme contenu utilisateur

Dans `lib/ai.ts:54,58-60`, le chemin image ajoute le prompt fourni comme un bloc `user` ordinaire et omet `system_instruction` lorsque `image` est présent. Le prompt de sortie structuré et les consignes de prudence d’ECG n’ont donc pas le même statut que pour les requêtes textuelles.

**Correction attendue :** transmettre les consignes par le mécanisme système prévu par le fournisseur, et garder l’image/demande dans le message utilisateur; tester la structure réelle de la requête pour chaque fournisseur.

## Interface, accessibilité et usage sous stress

### A-11 — Zoom utilisateur désactivé

`app/layout.tsx:43-49` définit `maximumScale: 1` et `userScalable: false`. Cela bloque le zoom navigateur, notamment utile aux personnes malvoyantes et sur un écran médical difficile à lire. Une classe de police réglable ne remplace pas le zoom de page.

**Correction attendue :** enlever ces restrictions et tester agrandissement à 200–400 %, orientation, mise en page et interactions sans perte de contenu.

### A-12 — Dialogues annoncés modaux sans confinement de focus

`components/DisclaimerGate.tsx:29`, `components/CommandPaletteBody.tsx:142` et `components/EmergencyMode.tsx:22-25` déclarent `aria-modal="true"`. Le code donne un focus initial dans certains cas, mais ne met pas le fond hors interaction et ne confine pas le focus au dialogue. Les lecteurs d’écran/claviers peuvent donc atteindre des contrôles situés derrière une fenêtre déclarée modale.

**Correction attendue :** gestion complète du cycle de focus (mémoriser/restaurer le focus, confinement, Échap selon le cas, arrière-plan inerte, nom/description accessibles) et tests clavier/lecteur d’écran.

### A-13 — Bouton de lecture Flash IA se réinitialise immédiatement

`app/flash-ia/page.tsx:148-159` met `speaking` à `true`, démarre la synthèse vocale, puis le remet immédiatement à `false`. Le bouton ne peut donc pas refléter l’état de lecture ni activer de manière fiable l’action « arrêter » prévue par le branchement suivant.

**Correction attendue :** exposer l’événement de fin/erreur de la Web Speech API dans `lib/ai.ts`, arrêter le statut à la fin et gérer les appareils sans synthèse vocale.

### A-14 — Dépendance à une interface arabe malgré l’objectif de francisation final

L’application reste bilingue FR/AR (langue par défaut FR selon les préférences, mais sélecteur AR actif). La francisation complète demandée pour la fin du projet n’a pas été réalisée; les étiquettes codées directement dans plusieurs composants ne passent pas toujours par le dictionnaire. Ne pas annoncer l’interface française exclusive comme terminée.

## État clinique et traçabilité — limites importantes

Les résultats automatiques réussis ne certifient ni une dose, ni un seuil, ni une traduction. Le dernier inventaire de sources du dépôt (750 entrées) distingue **335** entrées avec source et date déclarées, **50** avec référence partielle, **93** lignes ATB rattachées à un PDF commun sans source primaire liée à chaque dose, et **272** sans référence primaire au niveau de la fiche. Un champ `lastReviewed` ne prouve pas que toutes les affirmations ont été comparées au document.

Les audits historiques du dépôt signalent toujours les travaux suivants comme non clos :

- A : les données ATB ont 93 molécules et le sélecteur logiciel garde cinq stades, mais la comparaison entre les 126 lignes posologiques de l’annexe v4 et les 129 fragments du JSON OMEDIT historique doit être terminée ligne par ligne. Les ambiguïtés de cellules, notes, égalités et frontières restent à résoudre à la source; ne pas transformer des seuils CrCl en seuils DFG.
- B : l’assistant ATB attendu doit garder calcul et sélection posologique déterministes. L’actuelle Flash IA ne satisfait pas cette règle de sécurité pour ses doses libres.
- C : la revue exhaustive des 73 médicaments et des spécialités n’est pas achevée. Le snapshot DPM de janvier 2024 n’est pas un registre courant; les noms abrégés de l’annexe v4 ne représentent pas les 320 noms complets. Au dernier contrôle, 15 présentations atropine/gentamicine restent en attente d’une preuve explicite de voie IV/IM; voir `docs/DPM-ROUTE-VERIFICATION-2026-10-27.md`.
- Les références de réanimation/triage identifiées dans les rapports existants nécessitent une comparaison complète aux éditions actuelles et aux règles locales; les libellés ERC 2021, PALS 2020 ou les dates de revue ne démontrent pas à eux seuls une erreur précise, mais constituent des priorités de revalidation.
- Le numéro du centre antipoison tunisien `71 335 500` est encore signalé dans l’audit antérieur comme non confirmé par une source officielle tunisienne directe.
- Aucune revue indépendante, signée par un urgentiste et un pharmacien tunisien, de tous les contenus n’est attestée. L’app ne doit pas être présentée comme localement approuvée sur cette base.

## Plan de correction proposé — ordre de priorité

1. **Avant toute démonstration clinique :** maintenir les tests du repli A-01 (y compris GitHub Pages/base path); retirer toute dose IA générée dans Flash IA; désactiver le classement de triage par LLM ou le transformer en résumé non décisionnel; corriger la couleur verte.
2. **Avant des données patient :** mettre en place une validation stricte des sorties IA, le consentement d’envoi par fonctionnalité et une politique de conservation/effacement des données locales.
3. **Accessibilité :** réautoriser le zoom, compléter les dialogues modaux, tester FR/AR et grands caractères avec clavier et lecteur d’écran.
4. **Qualité de l’interface :** réparer l’état TTS; ajouter une validation centralisée des préférences et des données persistées; mettre des tests E2E navigateur réels.
5. **Validation clinique :** terminer A→B→C avec sources traçables, revue indépendante par urgentiste/pharmacien tunisiens, seuils testés aux égalités et corpus de cas de vérification. Documenter séparément les éléments confirmés faux, les éléments non sourcés et les éléments encore en attente.

## Limites de cette passe

Je n’ai pas prétendu lire chaque ligne de chaque page ni valider chaque dose cliniquement. Les scripts de crawl visuel, responsive et clipping n’ont pas pu s’exécuter faute de Chromium; la vérification initiale de 348 réponses HTTP confirme la disponibilité des exports statiques, pas l’accessibilité, les interactions tactiles, les états offline réels ni l’absence d’erreurs navigateur. Les constats A-01 à A-14 sont ceux vérifiables dans le code examiné; d’autres défauts peuvent subsister.

## Addendum — corrections techniques de la passe du 27 octobre 2026

Cette section distingue les corrections techniques effectivement apportées de la validation clinique qui reste à faire.

### Corrigé et couvert par test

- **A-01 (repli hors ligne)** : retrait initial des références aux variables inexistantes `norm` et `dir`; le service worker utilise la page mise en cache ou le repli HTML. Une revue ultérieure par exécution du gestionnaire a révélé un second défaut propre aux sous-chemins : la route déjà préfixée par le base path était préfixée une seconde fois, empêchant parfois de retrouver une fiche en cache hors ligne. Ce défaut est corrigé et couvert par des tests d’exécution en 2026-10-28; la génération et le déploiement finaux restent à revalider dans le build courant.
- **Flash IA et triage IA** : remplacement des deux parcours décisionnels par des pages d’avertissement bilingues et des raccourcis protocolaires éditorialisés. Aucun diagnostic, dose, voie, geste ou couleur de triage n’est généré par ces deux pages. Ce choix désactive la fonction plutôt que de prétendre qu’un calcul déterministe validé existe.
- **A-07 (localStorage)** : assainissement à l’hydratation des préférences, favoris, récents et champs du patient actif; valeurs invalides normalisées vers des valeurs sûres. L’assainissement n’est pas encore appliqué à tous les autres espaces de stockage du projet, notamment les archives cliniques.
- **A-08 (clé IA)** : les nouvelles clés ne sont plus persistées; les anciennes clés en clair sont purgées lors de la lecture de configuration. Gemini reçoit désormais la clé dans l’en-tête `x-goog-api-key`, pas dans l’URL. La clé saisie reste en mémoire vive jusqu’au rechargement.
- **A-10 (prompt image Gemini)** : le prompt d’analyse est transmis dans `system_instruction`, séparément de l’image, avec un test de structure de requête et de non-exposition de la clé dans l’URL.
- **A-11 (zoom)** : retrait de `maximumScale: 1` et `userScalable: false` pour laisser le zoom navigateur disponible.
- **A-12 (focus modal)** : piège et restauration du focus ajoutés au tiroir de navigation et au mode urgence; fermeture du mode urgence par Échap et blocage du défilement du document pendant son ouverture. Cela ne rend pas encore inertes les arrière-plans des autres dialogues et ne remplace pas les essais avec lecteur d’écran.
- **A-04 et A-13** : le triage LLM n’affiche plus de couleur ni de résultat généré; la lecture à voix haute de Flash IA n’est plus proposée puisque le plan correspondant a été désactivé.

### Vérifications techniques de cette passe

- `npm test -- --reporter=dot` : **762 tests réussis**, 19 fichiers; seuls des avertissements connus de `jsdom` sur `window.scrollTo` apparaissent.
- `npm run lint` : réussi.
- `npx tsc --noEmit` : réussi.
- `node --check public/sw.js` : réussi.
- `npm run audit:reference-inventory:check` : réussi, **750 entrées / 20 groupes**.
- `npm audit --omit=dev` : **0 vulnérabilité** dans les dépendances de production.
- `npm run build` : réussi; génération statique de **448 pages** et précache de 1 098 fichiers (environ 16,3 Mo).
- Après le build, **350 fichiers HTML** ont répondu HTTP 200 via le serveur statique déjà lancé; les pages `/flash-ia/` et `/triage-ia/` contenaient bien leur avertissement de suspension.
- Le navigateur interactif n’a pas pu être installé de façon fonctionnelle : téléchargement Playwright interrompu (`ECONNRESET`); le binaire Chromium alternatif extrait depuis npm ne démarre pas faute de `libnspr4.so`. Ces vérifications HTTP ne sont donc **pas** des tests de navigateur, responsive ou interaction.

### État actualisé des constats (compléments du 2026-10-28)

Le paragraphe ci-dessus décrit l’état **à la date de rédaction initiale de l’audit**. Après les corrections consignées dans les addenda datés ci-dessous, l’état actuel est le suivant :

- **A-05 ECG — atténué, non clos :** sortie IA limitée à des observations descriptives filtrées, sans diagnostic ni conduite, avec relecture de l’ECG original exigée. Les estimations peuvent rester fausses; aucune validation clinique indépendante.
- **A-06 stockage patient — atténué, non clos :** l’archive est assainie et les entrées peuvent être supprimées individuellement ou globalement; elle n’expire toujours pas automatiquement. La durée doit être définie par la politique locale, non inventée dans le logiciel.
- **A-09 transferts IA — garde-fous techniques présents, conformité non établie :** appels textuels avec confirmation affichant fournisseur/modèle/extrait; confirmation distincte avant l’image ECG; consentement dédié et revalidation du fournisseur/modèle pour l’explication de calcul. Cela ne constitue ni validation juridique/DPO, ni autorisation institutionnelle.
- **A-12 accessibilité des dialogues — garde-fous clavier présents :** piège/restauration du focus et arrière-plan `inert` couverts par tests pour les dialogues recensés. Lecteur d’écran et tests utilisateurs réels non réalisés.
- **Flash IA et triage IA génératifs** restent suspendus : aucune alternative clinique validée n’a été inventée.
- **A-14, validation clinique et locale :** l’interface reste bilingue; sa conversion complète en français est réservée à la phase finale. Les revues tunisiennes indépendantes, les protocoles locaux non présents et les arbitrages A→B→C restent requis avant toute mise en service clinique.

Les éléments antérieurs sont conservés comme historique de l’audit initial. Ne pas présenter les seuls contrôles logiciels comme certification médicale, pharmaceutique, réglementaire ou de sécurité des données.

## Addendum — réduction de risques ECG, transfert IA et effacement local (2026-10-28)

Mise à jour après la poursuite des corrections :

- **ECG (A-05, mitigation partielle)** : le prompt ne demande plus de diagnostic, niveau de gravité, recommandations ou protocoles; le parseur ne conserve que des champs descriptifs à longueur bornée et une fréquence bornée par plage syntaxique. Les réponses non conformes sont refusées; le texte brut IA n’est ni affiché ni archivé par les nouvelles analyses. La carte ne montre plus de couleur de gravité ou de diagnostic, et indique que l’ECG original doit être relu par un clinicien. Le consentement préalable nomme le fournisseur et le modèle, et précise le transfert de l’image ainsi que l’historique local (miniature et observations, max. 30).
- **Transferts IA (A-09, mitigation partielle)** : les appels textuels exigent une confirmation avant réseau, affichant fournisseur, modèle, avertissement sur les données de santé/coûts et un extrait du texte envoyé. Le flux ECG a un consentement explicite propre à l’image. L’explicateur de calculateurs affiche aussi le fournisseur/modèle exacts et bloque l’envoi si la destination change après l’ouverture de la confirmation. Cette confirmation ne constitue pas un avis juridique ou l’autorisation de l’établissement; l’utilisateur doit éviter noms et identifiants.
- **Effacement local (A-06, mitigation partielle)** : les entrées d’archive patient sont assainies à la lecture, supprimables individuellement ou en totalité, avec avertissement visible qu’elles ne périment pas automatiquement. Le bouton général de réinitialisation efface également l’historique IndexedDB des ECG.
- **Dialogues modaux (A-12)** : confinement/restauration du focus et arrière-plan `inert` étendus à l’avertissement médical, à la palette, à l’aide PWA et aux définitions d’abréviations ; les aides non bloquantes se ferment avec Échap. Tests clavier/focus automatisés présents, mais aucune validation avec lecteur d’écran réel.
- **Vérifications après extension** : `npm test` réussi, **781/781 sur 20 fichiers** (seuls avertissements jsdom `window.scrollTo`); `npx tsc --noEmit`, `npm run lint`, `npm run build`, `git diff --check` réussis; 448 pages générées et précache d’environ 16,6 Mo; audit d’inventaire 750/20 réussi; audit des dépendances de production : 0 vulnérabilité.

**État après les corrections ultérieures du 2026-10-28 :** A-05 reste une fonction expérimentale non validée cliniquement; A-06 garde les données actives et archives sans expiration automatique; A-09 dispose maintenant de confirmations d’interface par parcours, mais une revue de confidentialité/DPO et les règles de l’établissement sont encore requises; A-12 dispose de tests clavier/focus mais pas d’essais avec lecteur d’écran réel. La francisation complète reste à réaliser à la phase finale. Les phases B–F du master prompt ne sont pas déclarées closes dans le journal; ne pas assimiler un audit technique partiel à la clôture du projet. Les sorties IA filtrées peuvent encore contenir des erreurs.

## Inventaire provisoire des sources tunisiennes à confirmer (2026-10-28)

Le contrôle des 98 métadonnées de protocoles et des fichiers cliniques conservés dans le dépôt a identifié des références tunisiennes pour plusieurs parcours, sans que les protocoles sources correspondants soient archivés. Le seul PDF clinique localisé dans le dépôt est le tableau OMEDIT français. Voir [`docs/LOCAL-PROTOCOLS-REQUIRED-2026-10-28.md`](./LOCAL-PROTOCOLS-REQUIRED-2026-10-28.md) pour la liste de travail. Elle décrit des documents **non présents dans ce dépôt** et ne conclut pas à leur inexistence en Tunisie. Elle est provisoire, sans changement de dose ni de conduite clinique.

## Addendum — quiz IA pédagogique (2026-10-28)

Le générateur de quiz `/quiz-ia` valide maintenant un schéma strict (cinq QCM, quatre choix, index borné, texte borné), refuse les chiffres/unités et capture les erreurs de chargement de source. Le thème et ses références sont affichés, avec un avertissement « non vérifié » et un lien vers le quiz fixe. Cela réduit les sorties malformées et les doses numériques générées, mais **ne prouve pas la justesse clinique** des autres réponses; le parcours demeure pédagogique et ne doit pas guider une décision.

La page `/rapport-ia` affiche également un avertissement avant saisie (retirer noms/identifiants, vérifier les règles de l’établissement) et marque le compte rendu obtenu comme brouillon IA non vérifié à relire/corriger avant transmission. Cela ne valide pas le contenu généré et ne remplace ni une revue humaine ni une politique locale de transfert des données de santé. Deux tests UI vérifient ces avertissements avant saisie et après génération.

Les deux extracteurs IA de mots-clés de recherche (`app/recherche` et barre globale) valident maintenant les réponses avant de les injecter dans le champ de recherche : 1 à 3 mots alphabétiques, ≤40 caractères chacun, aucune sortie numérique/prose ou supérieure à 500 caractères. Une sortie refusée laisse la requête initiale inchangée. Ce filtrage sert uniquement à borner le contrôle de recherche, pas à interpréter un contenu médical.

Vérification après durcissement de recherche IA (2026-10-28) : suite complète **789 tests réussis / 23 fichiers**; `npx tsc --noEmit`, `npm run lint`, audit d’inventaire (750 entrées/20 groupes), audit npm production (0 vulnérabilité), `git diff --check` et build réussis. Le build a été relancé après la revue documentaire/configuration et la mise à jour du changelog : **448 pages**, précache **1 100 fichiers/~16,8 Mo**. Les seuls avertissements de tests sont les appels `window.scrollTo()` non implémentés par jsdom. Pas de test navigateur réel (Chromium toujours indisponible), pas de validation médicale des sorties du rapport ou du quiz, aucune dose modifiée.

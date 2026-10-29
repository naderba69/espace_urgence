# Audit global du projet — 2026-10-27

## Résumé exécutif

Cet audit couvre le dépôt, les tests, les routes statiquement exportées, les points d’entrée de l’interface, la persistance locale, les intégrations IA et plusieurs zones cliniques à haut risque. Il a été conduit par analyse du code et vérifications automatisées; **ce n’est ni une validation clinique, ni une revue exhaustive ligne par ligne de chacun des 184 fichiers de pages, de chacun des 73 médicaments et de chacun des 98 protocoles**.

**Conclusion de mise en service : ne pas présenter l’application comme un dispositif clinique validé.** Deux fonctions IA génèrent actuellement des décisions de triage ou des posologies libres, sans moteur déterministe ni contrôle de source. Un défaut confirmé dans le service worker casse le repli hors-ligne lorsqu’une page n’est pas dans le cache. Une couleur de triage contredit son libellé. Ces problèmes doivent être traités avant toute utilisation comme aide décisionnelle.

### Mise à jour d’état — 2026-10-28

Les constats et recommandations qui suivent ont été rédigés initialement le 27 octobre. Plusieurs corrections ont depuis été réalisées; les passages datés ultérieurement les détaillent. **Ils ne doivent pas être lus comme une liste de défauts encore actifs.** Au dernier contrôle logiciel consigné : suite complète **828/828 tests sur 31 fichiers**, TypeScript, ESLint, build (**449 pages statiques**), inventaire des références (**751 entrées / 20 groupes**), audit des dépendances de production (**0 vulnérabilité**), syntaxe du service worker et `git diff --check` réussis.

- **Corrigé logiciellement :** repli hors ligne et clés RSC; pages Flash IA et triage IA non décisionnelles; couleur verte harmonisée; clés IA non persistées et transmises par en-tête (Gemini); consignes image séparées via le champ système; zoom navigateur réautorisé; données cliniques de session assainies; confirmations de transfert IA; contrôles clavier/focus recensés; interface française/LTR; révision du parcours d’asthme aigu grave selon les sources consignées; révision des indications HNF. L’ancien calculateur antibiotique à dose/intervalle général a été suspendu faute de références vérifiées pour chaque combinaison indication-population-médicament; le tableau OMEDIT distinct reste disponible avec ses propres avertissements.
- **Encore non validé en conditions réelles :** aucun essai Chromium/navigateur réel, appareil réel, lecteur d’écran ou revue clinique/pharmaceutique indépendante tunisienne. Les tests automatisés et la vérification documentaire ne valident ni l’utilisation au lit du patient ni la conformité réglementaire/confidentialité.
- **Travail documentaire/local encore ouvert :** revue exhaustive des 73 fiches médicament et de tous les produits DPM; après les vérifications produit MEDIS GENTA, atropines ANSM/ALIMS et hydrocortisone du 2026-10-28, 6 offres atropine/gentamicine restent sans preuve produit propre de voie (ATROPINE SAIPH, GENTAINJECT 40/80/160 et CIDOMYCINE 20); deux hydrocortisones restent exclues à ce stade (MEDIS 500 mg et LEURQUIN 100 mg) faute d’une notice IV/IM appariée au produit/conditionnement local. L’audit DPM courant passe à **355 présentations confirmées, 530 exclues, 6 en attente (891 lignes)** après preuve de voie pour cinq hydrocortisones, dix dexaméthasone et six ondansétron injectables; trois offres DEXONE 8 mg, cinq offres ondansétron (SAIPH, STERIPHARM, ONDOFREN), HYDROCORTISONE MEDIS 500 mg et LEURQUIN 100 mg demeurent exclues faute de source produit/conditionnement suffisante. Protocoles tunisiens institutionnels et antibiogrammes récents absents du dépôt; vérification officielle directe du numéro du Centre antipoison; politiques locales de traitement des données IA. Une AMM ou un catalogue n’établit jamais le stock.

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

### A-12 — Dialogues annoncés modaux sans confinement de focus (constat initial, corrigé logiciellement)

Au premier audit, certains dialogues annonçaient `aria-modal="true"` sans rendre le fond inerte ni confiner le focus. Les corrections ultérieures étendent le hook partagé aux dialogues recensés; le présent constat décrit l’état initial et ne doit pas être lu comme un défaut encore ouvert. La couverture réelle par lecteur d’écran et navigateur reste à réaliser; voir les addenda A-12.

### A-13 — Bouton de lecture Flash IA se réinitialise immédiatement

`app/flash-ia/page.tsx:148-159` met `speaking` à `true`, démarre la synthèse vocale, puis le remet immédiatement à `false`. Le bouton ne peut donc pas refléter l’état de lecture ni activer de manière fiable l’action « arrêter » prévue par le branchement suivant.

**Correction attendue :** exposer l’événement de fin/erreur de la Web Speech API dans `lib/ai.ts`, arrêter le statut à la fin et gérer les appareils sans synthèse vocale.

### A-14 — Dépendance à une interface arabe malgré l’objectif de francisation final

**Constat historique au début de l’audit :** l’application restait bilingue FR/AR et le sélecteur AR était actif. La correction et sa vérification sont consignées dans l’addendum A-14 du 2026-10-28 ci-dessous : le sélecteur a été retiré et l’interface est maintenant forcée en français/LTR.

## État clinique et traçabilité — limites importantes

Les résultats automatiques réussis ne certifient ni une dose, ni un seuil, ni une traduction. L’inventaire de références validé le 2026-10-28 compte **751 entrées / 20 groupes**. Les statistiques par niveau de preuve de l’ancien snapshot à 750 entrées sont historiques et ne doivent pas être présentées comme le bilan actuel. Un champ `lastReviewed` ne prouve pas que chaque affirmation a été comparée à son document.

### État actuel des revues cliniques/documentaires — 2026-10-28

- **ATB — audit du tableau OMEDIT :** la comparaison de l’annexe et de l’archive a été documentée dans `docs/AUDIT-ATB-ANNEX1-DIFFS-2026-10-25.md` : 93 molécules, 126 lignes de l’annexe, 129 lignes brutes, 123 comparaisons non vides; 106 valeurs concordent après normalisation et 17 écarts textuels ont été examinés. Les 12 pages du tableau ont fait l’objet d’un rapprochement visuel; les cellules ambiguës, les notes et les limites de sélection restent explicitement traitées comme telles. Le contrôle géométrique des frontières ne décide pas de l’interprétation clinique des égalités. Le moteur ne convertit pas une ClCr Cockcroft–Gault en DFG et ne sélectionne pas une colonne DFG à partir de cette ClCr; les avertissements de valeur frontière et les tests sont décrits dans l’audit ATB. Ce travail est documentaire/logiciel, pas une validation indépendante des 93 posologies.
- **Assistant ATB :** les outils concernés utilisent des calculs et règles de sélection déterministes, pas un LLM pour calculer ou inventer une dose. Cela ne certifie pas toutes les doses ni toutes les adaptations rénales; chaque source, population et indication doit rester vérifiable.
- **Médicaments/produits tunisiens — mise à jour 2026-10-28 :** la revue exhaustive des 73 médicaments et de leurs présentations n’est pas achevée. Après rapprochement de trois notices fabricant/régulateur par nom, détenteur/fabricant, dosage et présentation, 4 voies restent non établies pour les marques exactes (ATROPINE SAIPH, deux GENTAINJECT 80 et CIDOMYCINE 20); détails et prudence d’appariement dans `docs/DPM-ROUTE-VERIFICATION-2026-10-27.md`. Le snapshot DPM de janvier 2024 n’est pas un registre courant; une AMM ou un catalogue ne prouve pas le stock.
- **Protocoles tunisiens :** des protocoles institutionnels, antibiogrammes récents et notices de produits réellement disponibles restent absents du dépôt ou non confirmés dans les sources consultées. La liste de travail et les limites sont dans `docs/LOCAL-PROTOCOLS-REQUIRED-2026-10-28.md`; « absent du dépôt » ne signifie pas « inexistant en Tunisie ».
- Le numéro du Centre antipoison `71 335 500` demeure corroboré par des sources secondaires, mais non confirmé par une source tunisienne officielle directe dans la recherche consignée.
- Aucune revue indépendante signée par un urgentiste et un pharmacien tunisiens de l’ensemble des contenus n’est attestée. L’application ne doit pas être présentée comme localement approuvée.

## Plan de correction proposé — ordre de priorité

Le plan ci-dessous est le plan **initial du 2026-10-27**; plusieurs actions ont été réalisées depuis. Les priorités restantes au 2026-10-28 sont :

1. **Compléter les preuves locales** : retrouver/archiver les versions en vigueur des protocoles tunisiens prioritaires, les antibiogrammes et les notices des produits concernés; confirmer directement le numéro antipoison et séparer ces preuves d’un stock réel.
2. **Achever la revue des produits** : poursuivre l’examen des 73 fiches médicament et des présentations DPM. Les 4 voies de marques atropine/gentamicine encore en attente et l’ancien snapshot DPM sont décrits dans le rapport de vérification; aucun statut d’AMM ne vaut preuve de disponibilité.
3. **Préserver la sûreté ATB** : garder le calcul et la sélection déterministes, maintenir le refus sur cellules/contextes non résolus, ne jamais convertir une ClCr en DFG, et poursuivre la vérification spécifique des doses/RCP. Les tests de limites ne remplacent pas une revue indépendante.
4. **Revue professionnelle indépendante** : revue signée d’un urgentiste et d’un pharmacien tunisiens des doses, seuils, indications, traductions et versions, avant toute revendication d’approbation clinique.
5. **Validation d’interface réelle** : exécuter les parcours sur Chromium et appareils cibles, tester réseau hors ligne, responsive/clipping, zoom, clavier et lecteur d’écran. Les tests jsdom/Vitest et exports statiques ne suffisent pas.
6. **Gouvernance des données IA** : faire examiner par le DPO/l’établissement les fournisseurs, transferts, conservation, coûts et modalités de consentement avant l’envoi de toute donnée patient réelle.

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

- **A-01 hors ligne — correction logicielle et tests simulés réussis, navigateur non vérifié :** les navigations non précachées ont un repli HTML et les clés RSC conservent les en-têtes nécessaires à `Vary` en supprimant seulement le paramètre `_rsc`; cache renouvelé en v18.3. Tests Vitest couvrent fallback, chemins racine/sous-chemin et `Vary`. Aucun test dans Chromium ou sur un appareil réel.
- **A-05 ECG — atténué, non clos cliniquement :** sortie IA limitée à des observations descriptives filtrées, sans diagnostic ni conduite, avec relecture de l’ECG original exigée. Les estimations peuvent rester fausses; aucune validation clinique indépendante ni évaluation d’image en navigateur/appareil réel.
- **A-06/A-07 stockage — mesures logicielles étendues et testées :** les données cliniques actives et journaux recensés utilisent `sessionStorage`; les anciennes clés persistantes correspondantes sont purgées. Les instantanés, archives et fiches concernés sont validés à l’exécution. Des navigateurs peuvent restaurer une session; l’effacement n’est pas sécurisé, et la politique institutionnelle de conservation reste à vérifier.
- **A-08 clé IA — risque d’exposition réduite :** les nouvelles clés ne sont pas persistées, les anciennes clés locales sont purgées, et Gemini reçoit la clé dans `x-goog-api-key`, pas dans l’URL. Une clé saisie reste en mémoire jusqu’au rechargement et peut être accessible à un script exécuté dans la même origine; cela ne remplace pas une architecture serveur ni une revue de sécurité complète.
- **A-09 transferts IA — garde-fous présents, conformité non établie :** appels textuels avec confirmation fournisseur/modèle et extraits de la demande et du contexte; confirmations dédiées pour ECG et explication de calcul, avec revalidation de destination. Les noms/identifiants saisis en texte libre ne sont pas détectés automatiquement; l’extrait ne permet pas de relire tout le contexte. Revue DPO/institutionnelle toujours requise.
- **A-10 image Gemini — consignes système séparées de l’image**, couverture de structure de requête présente; cela n’assure pas que la sortie du modèle soit correcte.
- **A-11 zoom — restriction supprimée** dans la configuration viewport; absence de test réel aux grossissements 200–400 %.
- **A-12 accessibilité — garde-fous DOM/clavier** (gestion du focus et arrière-plan inerte pour les dialogues recensés) couverts par tests. Lecteur d’écran et tests utilisateurs réels non réalisés.
- **Flash IA et triage IA décisionnels** restent suspendus. Le constat TTS Flash IA est devenu sans objet lorsque la fonction a été désactivée; aucun mécanisme vocal ne doit être présenté comme fonction clinique active.
- **A-14 interface — français/LTR imposé**, sélecteur arabe retiré et préférences antérieures migrées vers le français. Les traductions arabes peuvent subsister dans les archives de données, mais elles ne sont plus exposées par le sélecteur d’interface.
- **A-15 asthme aigu grave — révision documentaire/logicielle GINA 2026 consignée**, avec hydrocortisone IV 200 mg non réintroduite et critères de sortie explicites. Aucun de ces changements n’a été validé par une revue clinique tunisienne indépendante.

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

## Addendum — stockage des données patient limité à la session (2026-10-28)

Le patient actif et son archive ont été déplacés de `localStorage` vers `sessionStorage`, avec purge des anciennes clés persistantes (`eutn:patient`, `eutn:patient-log`) à l’hydratation. Des tests couvrent le stockage de session, les valeurs JSON malformées et les anciennes clés. L’avertissement d’interface précise que certains navigateurs peuvent restaurer une session et recommande, sur un appareil partagé, de fermer l’onglet puis d’effacer les données de navigation. Cette mesure réduit la persistance ordinaire mais ne constitue pas une suppression sécurisée, une expiration garantie par l’application, ni un audit exhaustif de toutes les autres données patient présentes dans le stockage local. Elle ne remplace pas la politique de conservation/effacement validée par l’établissement.

## Addendum — validation des données persistées et brouillons de calcul (2026-10-28)

- Les JSON relus dans les instantanés GCS, dose/poids, perfusion, débit de perfusion et préparation de pompe sont maintenant validés avant restauration; les formes incohérentes sont ignorées ou ramenées aux valeurs de référence du calculateur, sans accepter un identifiant de médicament inconnu.
- Les archives de réévaluation, complications, constantes, chronologie, résumé de cas, checklists et compteurs analytiques appliquent des filtres d’exécution : types/champs attendus, règles/identifiants connus, timestamps finis et non futurs, tailles et nombres d’entrées bornés. Les valeurs cliniques ne sont pas inférées depuis ces filtres.
- Les états des calculateurs sous `eutn:calc:*` et `eutn:pump:*` sont désormais temporaires par onglet; les anciennes clés locales persistantes sont purgées au démarrage. Une restauration de session du navigateur reste possible.
- Un défaut de persistance des checklists a également été corrigé : l’état vide initial n’écrase plus le contenu existant avant la fin de la lecture et validation du stockage.
- Tests unitaires et ciblés ajoutés. **A-07 n’est pas clos** : d’autres entrées de stockage restent à inventorier ou renforcer (notamment la fiche SAMU, certains journaux et la politique de stockage/durée). A-06 n’est pas un effacement sécurisé; les données ECG IndexedDB et les éventuelles restaurations par le navigateur restent hors de cette correction.

### Addendum A-07 — extension du périmètre stockage (2026-10-28)

L'inventaire complémentaire a étendu les corrections au-delà des instantanés de calculateurs :

- La fiche SAMU (`eutn:fiche-samu`), la chronologie et son archive (`eutn:timeline*`), le journal des constantes (`eutn:vitals-log`), les complications confirmées (`eutn:problems`) et les réévaluations (`reval:log:*`) utilisent maintenant `sessionStorage`. Les lecteurs du résumé et de la fiche SAMU ont été raccordés à la chronologie de session. Les champs restaurés de la fiche SAMU et sa liste de gestes sont filtrés/bornés.
- À l'hydratation, les anciennes clés persistantes de ces données cliniques sont supprimées; le contenu historique n'est pas migré. Les clés préfixées `eutn:calc:*` et `eutn:pump:*` restent également purgées après leur migration en session.
- IndexedDB (`eutn-db/ecg-analyses`) est vidée au premier accès d'une nouvelle session d'onglet; les nouveaux enregistrements ne stockent plus le texte brut de réponse IA. Les miniatures et résultats filtrés restent dans IndexedDB au cours de la session active, jusqu'à l'effacement demandé ou au démarrage d'une nouvelle session.
- **Risque résiduel vérifiable :** IndexedDB est partagée par origine. Ouvrir une session neuve dans un autre onglet peut donc supprimer l'historique de l'onglet précédent. Si le navigateur restaure `sessionStorage`, il peut aussi restaurer le marqueur et les données de session. Ni `sessionStorage` ni la purge IndexedDB ne constituent un effacement sécurisé; la politique institutionnelle et le comportement des navigateurs cibles restent à confirmer.
- Les préférences, favoris, récents, compteurs analytiques, checklists génériques et paramètres restent persistants selon leur fonction; ils ne sont pas tous des données patient, mais doivent rester dans l'inventaire. Cette passe ne prouve pas l'absence d'autres stockages ou données d'identification dans tous les parcours.

### Validation finale du lot A-07 — 2026-10-28

- `npm test -- --reporter=dot` : **805/805 sur 25 fichiers** (avertissements jsdom `window.scrollTo()` uniquement).
- TypeScript, lint, inventaire des références (**750/20**), audit npm de production (**0 vulnérabilité**), `node --check public/sw.js`, `git diff --check` et build réussis; build de **448 pages**, précache **1 100 fichiers (~16,8 Mo)**.
- L’inventaire des lectures/écritures restantes est classé : données cliniques migrées vers les sessions; préférences, favoris/récents, compteurs, checklists génériques et stockage ECG ont chacun un traitement/documentation. Aucune autre écriture de journal patient dans `app/`, `components/`, `lib/` n’a été repérée.
- **A-07 est clôturé comme lot de correction logicielle, avec réserves explicites.** Pas de Chromium, appareil réel, test d'intégration IndexedDB en navigateur ni revue indépendante de confidentialité. `sessionStorage` peut être restauré; IndexedDB est partagée entre onglets et une nouvelle session peut vider l'historique précédent; aucun mécanisme ne vaut effacement sécurisé ou politique de conservation institutionnelle. Ces réserves ne sont pas présentées comme validées.

### Addendum A-01 — clés Cache API pour les réponses RSC (2026-10-28)

Une revue de la simulation du service worker a montré que le mock de cache ne respectait pas l’en-tête HTTP `Vary`. Dans le parcours RSC, le code retirait `_rsc` de l’URL en construisant une nouvelle requête sans en-têtes; une réponse variant selon `RSC` ou `Next-Router-State-Tree` pouvait donc ne pas correspondre à sa clé mémorisée lors d’une navigation hors ligne. La clé conserve maintenant les en-têtes de la requête originale et ne retire que la querystring dynamique. Un test simule `Vary`, le changement de `_rsc` et un état de routeur différent. Le cache SW / numéro affiché est passé à 18.3 pour écarter les anciennes clés incompatibles. Cette simulation n’est pas un essai dans Chromium; comportement de déploiement navigateur réel à confirmer dès qu’un environnement browser est disponible.

### Addendum A-05 — échec de décodage d’image ECG (2026-10-28)

Le contrôle du parcours d’image a montré que les callbacks d’erreur retournaient auparavant les octets originaux comme si le redimensionnement JPEG avait réussi, et la miniature pouvait conserver l’image originale en cas d’échec. Désormais, l’échec de décodage/canvas/sérialisation bloque l’envoi et ne crée pas de miniature; le message précise qu’aucun envoi n’a été effectué. Les dimensions de sortie sont limitées à 1280 px (transfert) et 300 px (aperçu local), sur les deux axes. Une analyse réussie reste affichée si l’écriture de l’historique local échoue. Un test simulé couvre l’échec du décodeur. **A-05 reste expérimental et non validé cliniquement** : les champs descriptifs issus du modèle peuvent encore contenir des erreurs, et aucun appareil/navigateur réel ni qualité d’image ne sont évalués.

### Vérification logicielle après les addenda A-01/A-05/A-09 — 2026-10-28

Suite complète **807 tests / 26 fichiers**; TypeScript, lint, inventaire (**750 entrées / 20 groupes**), audit npm production (**0 vulnérabilité**), syntaxe du service worker et `git diff --check` réussis. Build statique réussi : **448 pages**, précache **1 100 fichiers (~16,8 Mo)**, version SW/application **18.3**. Les avertissements de tests restants sont les appels `window.scrollTo()` non implémentés par jsdom. Les simulations ne remplacent pas Chromium, un appareil réel, des essais réseau hors ligne réels ou une revue clinique.

### Complément A-05 — contrôles de direction Unicode dans le texte du modèle (2026-10-28)

Les champs texte issus du modèle pouvaient contenir des contrôles Unicode bidi invisibles (p. ex. override/isolate), potentiellement capables de modifier l’ordre visuel des mots dans l’interface ou une copie. Le parseur les neutralise désormais et les valeurs sont affichées en direction automatique. Un test couvre les marqueurs U+202E/U+2069. C’est une mitigation d’affichage seulement : le texte libre peut toujours être faux ou porter un sens clinique erroné; elle ne clôt pas la validation ECG.

Validation après neutralisation des contrôles bidi ECG (2026-10-28) : la suite complète reste **807/807 sur 26 fichiers**; build **448 pages / 1 100 fichiers (~16,8 Mo)**, TypeScript, lint, inventaire 750/20, audit npm production 0 vulnérabilité, syntaxe SW et `git diff --check` réussis. Les limites cliniques et navigateur réel mentionnées ci-dessus restent inchangées.

### Addendum A-12 — recherche au clavier et lien du tiroir (2026-10-28)

- La revue ciblée de `SearchBar` a révélé que le champ se déclarait `combobox` mais associait un `listbox` contenant des boutons, et que l’historique visible n’avait pas de sélection gérée par les flèches. Le champ annonçait aussi `aria-expanded=true` alors qu’aucun popup n’était rendu dans certains états.
- Correction : suggestions et historique sont maintenant des options du même motif `combobox/listbox`; flèches haut/bas gèrent l’option active, Entrée sélectionne l’option, Échap ferme. `aria-expanded`, `aria-controls` et `aria-activedescendant` correspondent uniquement à l’état réellement affiché; chaque option expose `aria-selected`.
- Le bouton d’ouverture du tiroir annonce `aria-haspopup="dialog"`, relie le dialogue par `aria-controls` lorsqu’il est ouvert, et le bouton de fermeture a un libellé localisé. Les filtres de médicaments déclarés à tort `listbox`, ainsi que les sélecteurs recherche/ECG/calculateurs avec `tablist` ou `radiogroup` incomplets, sont maintenant des groupes nommés de boutons natifs à état (`aria-pressed`). Le `TabBar` partagé utilise le même modèle plutôt qu’un rôle d’onglet sans gestion des flèches/panneaux.
- Version application/service worker synchronisée en **18.4** pour renouveler le cache PWA.
- Tests ciblés ajoutés pour options de recherche et historique au clavier; suite complète après la passe clavier/ARIA : **810/810 tests, 27 fichiers**. Build **448 pages, 1 100 ressources précachées (~16,9 Mo)**, TypeScript, ESLint, inventaire **750/20**, audit npm production **0 vulnérabilité**, syntaxe SW et `git diff --check` réussis.
- Limites : aucune session Chromium, NVDA, VoiceOver ou TalkBack; jsdom vérifie l’état DOM/clavier simulé, pas la restitution d’un lecteur d’écran. Cette passe ne constitue pas un audit WCAG exhaustif ni une validation utilisateur.

### Addendum — contraste des badges de gravité en thème clair (2026-10-28)

- Le calcul WCAG du texte de badge sur son fond dédié a trouvé deux échecs AA pour du texte normal : critique **4,35:1** (`#d32f2f` / `#fdecea`) et urgent **3,46:1** (`#e65100` / `#fff3e0`). Le standard était au-dessus du seuil (4,73:1), mais avec une marge limitée.
- Les teintes claires ont été assombries sans modifier les catégories : critique `#b71c1c` (**5,74:1**), urgent `#b93800` (**5,28:1**), standard `#0b6b63` (**5,50:1**). Les couleurs du thème sombre restent inchangées.
- Test automatique ajouté : calcule le ratio relatif à partir des variables réelles de `globals.css` et exige au moins **4,5:1** pour les trois états clairs. Le test échouait avant correction (première valeur observée 4,35:1), puis passe après.
- Version application/service worker synchronisée en **18.5**. Aucun contenu médical ni attribution de gravité modifiés; couleurs seulement.
- Validation globale après cette correction : **811/811 tests, 28 fichiers**, build **448 pages / 1 100 ressources (~16,9 Mo)**; TypeScript, ESLint, inventaire 750/20, audit npm production 0 vulnérabilité, syntaxe SW et `git diff --check` réussis. Les warnings jsdom `window.scrollTo()` connus subsistent; aucun Chromium/lecteur d’écran n’a été utilisé.

## Addendum A-14 et contraste des textes informatifs — 2026-10-28

- **A-14, interface française exclusive :** retrait du basculement de langue de l’en-tête, des paramètres et de la palette de commandes; migration à FR des anciennes préférences AR au chargement et à chaque modification de réglage; langue/lecture de page fixée à `fr`/LTR dès le script anti-FOUC. La page hors ligne et le lien d’accès rapide ont été francisés. La police arabe inutilisée a été retirée. Les champs arabes conservés dans les données historiques bilingues ne sont plus sélectionnés par l’interface.
- **Contraste élargi :** mesures WCAG des premiers plans sémantiques des textes informatifs bleus, rouges, ambre, verts, orange, violets et cyan sur les fonds principaux (clair, sombre, AMOLED). Les ratios calculés sont ≥4,5:1 pour chaque jeton sur fond et surfaces de base; tests ajoutés sur les valeurs CSS réelles. Les états sélectionnés avec texte blanc sur orange, ambre ou cyan ont été remplacés par un texte foncé; tests de régression dédiés.
- **Portée honnête :** l’analyse des jetons et des fonds principaux n’est pas une vérification calculée dans Chromium de chaque combinaison dynamiquement superposée ou opacifiée; les états de survol, opacités héritées et contrastes d’éléments bordés doivent encore être vérifiés sur navigateur réel. Les icônes décoratives ne définissent pas le seuil de texte. Aucune validation Chromium ou lecteur d’écran n’a été effectuée dans cette passe.
- Version application/service worker synchronisée en **18.6**. La migration française ne supprime pas les traductions arabes des données source, mais aucun chemin de l’interface utilisateur ne permet de revenir à RTL/AR.

## Addendum A-15 — asthme aigu grave, GINA 2026 et réévaluation — 2026-10-28

- Le protocole et l’assistant ont été rapprochés du *GINA Summary Guide 2026* (juillet 2026), pour les adultes, adolescents et enfants **à partir de 6 ans** : critères de gravité, salbutamol (6–10 bouffées pMDI avec chambre ou 5 mg nébulisés; répétition q20–30 min selon réponse), oxygène titré (cible SpO₂ 92–95 %), ipratropium en ajout, corticothérapie orale, escalade et critères de sortie.
- GINA conditionne la sortie à des critères légers demeurés stables **1–2 h après la dernière dose**, SpO₂ en air ambiant **≥92 %**, PEF **>70 %** et soutien à domicile adéquat; le suivi dans la semaine et un plan d’action sont rappelés. La simple durée d’une heure n’est pas un critère de sortie. Aggravation grave : transfert/réévaluation urgente; MgSO₄ IV uniquement de manière sélective, sans intubation automatique.
- **Hydrocortisone IV 200 mg non réintroduite.** Le traitement privilégié reste la prednisolone orale quand possible; aucune dose IV n’est ajoutée au protocole GINA en l’absence d’une source adaptée. Le MgSO₄ pédiatrique pour l’asthme n’est pas calculé par l’assistant. L’outil ne donne pas de dose d’asthme pour les moins de 6 ans.
- Portée de sources explicitée : GINA 2026 pour le parcours et les doses qu’il donne; dose adulte d’ipratropium nébulisé rattachée au NHS GGC (revue 2022); repères pédiatriques nébulisés SCHN (février 2026) séparés de GINA. La frontière SCHN est appliquée strictement par l’assistant : 250 µg jusqu’à 6 ans inclus, 500 µg au-delà; le journal conserve la dose réellement tracée même si l’âge est modifié ensuite, et un test UI couvre 6,0 puis 6,1 ans. Le choix adulte de MgSO₄ 2 g/20 min est dans la fourchette GGC 1,2–2 g/20 min. Ces références étrangères ne démontrent ni AMM/stock tunisien ni protocole local; aucune source française exploitable sur la dose nébulisée d’ipratropium n’a été identifiée dans les recherches effectuées.
- L’assistant impose l’âge minimal, distingue les schémas adulte/enfant, applique l’intervalle entre doses et bloque les rappels automatiques après trois doses; libellés d’historique stabilisés. Une fiche prednisolone sourcée porte le registre à **74 médicaments**. README, architecture et compteurs ont été synchronisés. Le test de contraste a aussi corrigé une couleur de coche sélectionnée, et les classes CSS d’état survolé ont été échappées correctement après détection d’avertissements de build.
- **Vérification technique au 2026-10-28 :** tests **822/822 sur 30 fichiers**; TypeScript et ESLint réussis; inventaire **751 entrées/20 groupes**; audit npm de production **0 vulnérabilité**; build propre **449 pages / 1 098 fichiers précachés (~16,4 Mo)**; `git diff --check` réussi. Les avertissements jsdom `window.scrollTo()` sont des limitations de l’environnement de test.
- **Limites persistantes :** aucune session Chromium, aucun appareil réel ni lecteur d’écran; aucune validation clinique/pharmaceutique indépendante tunisienne. La comparaison avec les références est documentaire et logicielle seulement; la disponibilité des médicaments n’a pas été vérifiée. L’interface française n’a pas été revue visuellement en navigateur.

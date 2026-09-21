# Journal des modifications — Espace Urgence TN

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) · Versionnage [SemVer](https://semver.org/lang/fr/).
Toutes les dates sont au format `AAAA-MM-JJ`.

> **Rappel sécurité médicale** : aucun contenu clinique n'est modifié sans mention explicite
> dans la section « Contenu médical ». Toute fiche porte `sources` + `lastReviewed` et doit être
> relue par un médecin tunisien avant usage clinique.

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

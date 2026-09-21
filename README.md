# Espace Urgence TN — فضاء الاستعجالي

Références & outils pour les urgences et le SAMU en Tunisie. Bilingue **français / العربية** (RTL), sombre par défaut, **hors-ligne (PWA)**, sans backend.

> ⚠️ **Avertissement** : le contenu médical est rédigé à partir de référentiels internationaux (ERC 2021, AHA ACLS/PALS 2025, RCUK, ATLS 10e, ESC…) et comporte pour chaque fiche `sources` + `lastReviewed`. **Il doit être relu et validé par un médecin tunisien** avant tout usage clinique. Toujours vérifier les doses.

---

## Chiffres clés (v18.1)

| Contenu | Nombre | Source |
|---|---|---|
| Protocoles | **98** | `data/protocols*.ts` |
| Médicaments | **73** | `data/medications*.ts` |
| Calculateurs | **131** | `data/calculators.ts` |
| Arbres décisionnels | **9** | `data/trees.ts` |
| Procédures (checklists) | **9** | `data/procedures.ts` |
| Rythmes ECG | **11** | `data/ecg.ts` |
| Guidage téléphonique | **41** | `data/guidage.ts` |
| Situations de triage | **22** | `data/triage.ts` |
| Quiz de révision | **42** | `data/quiz.ts` |
| Tests | **651** | `npm test` |

> Les compteurs affichés sur l'accueil proviennent de `data/counts.ts`. Un test garde-fou
> (`__tests__/v17-perf.test.tsx`) échoue si ces valeurs divergent des bases réelles —
> **pensez à mettre à jour ce fichier après tout ajout de contenu**.

## Pile technique

- Next.js 16 (App Router, **export statique** `output: 'export'`), React 19, TypeScript strict
- Tailwind CSS v4 (variante sombre par classe, propriétés logiques RTL)
- Aucune base de données : contenu = `data/*.ts` bilingue `{ fr, ar }` ; données utilisateur = `localStorage`
- PWA : `public/manifest.webmanifest` + service worker maison `public/sw.js` (pas de next-pwa)
- Audio : Web Audio API (`lib/audio.ts`) — métronome RCP, alarmes
- Analytics : GA4 via `lib/analytics.ts` — **ID placeholder `G-XXXXXXXXXX` à remplacer** ; désactivation possible dans Paramètres

## Démarrage

```bash
npm install
npm run dev      # développement (le service worker est inactif en dev)
npm run build    # export statique + précache -> dossier out/
npx serve out    # tester la version exportée (ou déployer telle quelle)
npm test         # 651 tests (vitest)
npm run lint     # eslint (0 erreur, 0 avertissement)
```

## Déploiement

- **Vercel** : import du repo → framework Next.js détecté → build `npm run build` → sortie automatique (`out/`).
- **GitHub Pages** : workflow `.github/workflows/deploy.yml` (définit `NEXT_PUBLIC_BASE_PATH=/espace_urgence`).
- Autre hébergeur statique (Netlify, Cloudflare Pages…) : publier le dossier `out/`.
- Remplacer `G-XXXXXXXXXX` dans `lib/analytics.ts` par votre ID de mesure GA4.

Guide pas à pas : **[docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md)**.

## Structure

```
app/                     pages (accueil, protocoles, médicaments, calculateurs, réa, mémo, checklists…)
components/              Providers (langue/thème/favoris/récents/patient actif), Header, Nav, SearchBar…
  └ CommandPalette.tsx   enveloppe légère (montée partout) + CommandPaletteBody.tsx (chargé à la demande)
data/                    contenu médical bilingue + sources + date de revue par fiche
  └ counts.ts            compteurs d'affichage (sans importer les bases complètes)
lib/                     i18n, text (normalisation), search (+ noyau/données), calc, audio, analytics…
  └ search-data.ts       index de recherche complet — CHARGÉ UNIQUEMENT PAR import() DYNAMIQUE
public/                  manifest PWA, sw.js, icônes
scripts/                 audits (liens, dictionnaire, débordements, responsive) + précache
docs/                    ARCHITECTURE.md (contributeurs) · DEPLOIEMENT.md · PROMPT-V2.md (cahier des charges)
```

## Performance — règle à respecter

Le bundle partagé par toutes les pages **ne doit jamais** embarquer la base médicale.
La v17.0 a corrigé ce point : le premier chargement est passé de **478 Ko à 241 Ko gzip en moyenne**
(**483 → 177 Ko** sur l'accueil, −63 %). La v17.1 a fini le travail sur les deux pages les plus
lourdes : **`/protocoles/acr-adulte` 509 → 428 Ko** (guidage + réévaluation en `import()`
dynamique) et **favoris/récents sans l'index de recherche** (14 Ko au lieu de 173 Ko).

Trois règles, vérifiées automatiquement par `__tests__/v17-perf.test.tsx` :

1. `lib/search-data.ts` et `lib/review-data.ts` ne sont atteignables que par `import()` dynamique.
2. Un composant monté dans `app/layout.tsx` n'importe pas `@/lib/search`.
3. Pour normaliser une chaîne, importer `@/lib/text` (jamais `@/lib/search`).

## Fonctionnalités

- **Recherche globale** — suggestions clavier, historique local, filtres, synonymes FR/AR
  (adrénaline/epinephrine, noms commerciaux tunisiens), normalisation des accents **et des
  variantes arabes** (alif/hamza, ta marbuta, tashkeel, tatweal), recherche vocale.
- **Mode urgence** — plein écran, boutons ≥ 96 px, sortie visible.
- **Arbres décisionnels** (`/arbres`) — décisions OUI/NON tactiles, minuteries avec alarme
  Web Audio, journal horodaté imprimable (ACR, anaphylaxie, état de mal, sepsis, SCA, HPP,
  hyperkaliémie, polytraumatisme, triage préhospitalier).
- **Réseau de détection de la détérioration** (`/reevaluation`) — 9 règles ESC 2021 / SSC 2021 /
  ERC 2021, tendance ↑→↓, alarme après deux aggravations consécutives.
- **Résumé de cas** (`/resume`) — patient + constantes + complications + chronologie, en un
  texte prêt à transmettre (copie, partage natif, impression).
- **Patient actif** — poids / âge / créatinine / sexe saisis une fois, réinjectés dans tous
  les moteurs ; archive locale des cas clos.
- **Abréviations interactives** — toute abréviation connue (TA, PAM, GCS, MgSO₄…) est soulignée
  en pointillés → tap → fiche explicative FR/AR (`data/abbr.ts`, `components/AbbrTooltip.tsx`).
- **IA optionnelle** (clé utilisateur) — Flash IA (une phrase → carte d'intervention
  chronométrée), analyseur ECG photo/caméra, aide au triage, compte rendu, quiz, recherche assistée.
  Dégradation gracieuse : sans clé ou hors-ligne, le reste de l'app reste 100 % fonctionnel.

## Hors-ligne

Après la **première visite de l'accueil**, `scripts/gen-precache.mjs` met en cache
**430 fichiers (≈ 12,0 Mo)** : shell, **les 34 pages de premier niveau** (accueil, protocoles,
médicaments, calculateurs, recherche, arbres, triage, ECG, guidage, paramètres…), leurs charges
RSC, les chunks JS/CSS, les polices et les icônes.

Résultat mesuré : **20/20 routes testées s'ouvrent hors-ligne** après une seule visite, sans
jamais afficher la page de repli. Les pages de détail (98 protocoles, 130 calculateurs) ne sont
pas précachées (+22,6 Mo) : elles se mettent en cache dès leur première consultation.

Stratégie : réseau d'abord pour la navigation, cache d'abord pour les assets, page `/offline`
puis repli synthétique en dernier recours.

## Audits disponibles

```bash
node scripts/static-out.mjs        # sert out/ sur :3000
node scripts/audit-links.mjs       # tous les href internes pointent vers une page existante
node scripts/audit-dict.mjs        # chaque t("…") existe en fr ET en ar
node scripts/audit-clips.mjs       # aucun texte tronqué (390 px, arabe)
node scripts/audit-responsive.mjs  # aucun débordement horizontal (320/360/768, FR et AR)
node scripts/crawl-audit.mjs       # 343 pages : erreurs console, hydratation, HTTP ≥ 400
```

## Feuille de route

- **Phase 1 ✅** — socle : i18n/RTL, thème, recherche avec synonymes, favoris réordonnables, récents, mode urgence, avertissement obligatoire, impression, PWA.
- **Phase 2 ✅** — masse de contenu, rythmes ECG (tracés animés), procédures, hubs pédiatrie/obstétrique/psychiatrie/traumatologie.
- **Phase 3 ✅** — IA optionnelle (Gemini/OpenRouter, clé locale, modèles libres) orientée terrain « une saisie → un résultat » : **⚡ Flash IA**, analyseur ECG photo/caméra (IndexedDB), triage, SBAR, quiz, recherche assistée. Plus de chat flottant.
- **Phase 4 ✅** — `lib/calc.ts` (fonctions dosimétriques pures) + tests vitest ; **131 calculateurs** (NIHSS, HAS-BLED, héparine IV, Adrogué-Madias, insuline ACD avec garde-fou potassium…).
- **Phase 5 ✅** — arbres décisionnels interactifs (`components/trees/TreeRunner.tsx`) + 9 arbres.
- **Phase 6 ✅** — couverture « maladie + évolution + complications » : champ `trajectory` sur chaque fiche ; **98 protocoles**, **73 médicaments** ; envenimation scorpionique (grades I–III tunisiens), intoxications, noyade, hypothermie, HDH, BPCO, pré-éclampsie…
- **Phase 7 ✅ (v16.x)** — moteur de détection de la détérioration + boucle de réévaluation + résumé de cas unifié.
- **Phase 8 ✅ (v17.0)** — **performance** (premier chargement −50 %), **hors-ligne renforcé** (34 pages précachées au lieu de 6), **qualité** (lint 0/0, 572 tests), **documentation** (CHANGELOG.md, docs/ARCHITECTURE.md), correction de la recherche arabe (hamza) et de la barre d'onglets mobile.
- **Phase 14 ✅ (v18.1)** — **fonction rénale affinée + plan a → b** : CKD-EPI 2021, CKID U25 (enfant), poids ajusté, critères KDIGO, escalade prudente GPR avec exception « molécules vitales » ; chaque molécule peut être **retenue ou abandonnée** (motif + note) puis **réévaluée en tours successifs** avec export texte imprimable (27 tests).
- **Phase 13 ✅ (v18.0)** — **antibiotiques & fonction rénale** : les 12 pages du tableau OMEDIT V2.3 deviennent calculables (`/calculateurs/antibio-renal`) — 93 molécules × 5 stades, posologies mot pour mot, **dose absolue au poids** et **DFG de Cockcroft-Gault** avec sélection du stade ; alertes contre-indication / « aucune donnée » ; 32 tests et jeu de données archivé (`data/issues/`, `docs/ANTIBIO-IR.md`).
- **Phase 12 ✅ (v17.4)** — **guidage + réévaluation par fichier** : `GET /reval/<id>` (98 fichiers, ~1,7 Ko gzip) et champ `g` dans `ref-index.json` ⇒ la fiche n'embarque plus `data/guidage.ts` ni `data/reval.ts` (données de page 17,1 Ko gzip après premier écran) ; **hors-ligne réparé** : les payloads RSC des pages de détail sont précachés (1110 entrées) et `sw.js` cache les navigations internes + essaie les variantes de chemin (`/x`, `/x/`, `/x.html`, `/x/index.html`) ⇒ n'importe quelle fiche s'ouvre hors-ligne depuis une liste déjà visitée.
- **Phase 11 ✅ (v17.3)** — **fichier de références généralisé** : `/protocoles` 335 → 163 Ko et `/quiz-ia` 333 → 161 Ko ; **cache HTTP déclaré** (`vercel.json`, `public/_headers`) ; **gouvernance du contenu** (garde-fou de fraîcheur documenté + test de cohérence projection ↔ données).
- **Phase 10 ✅ (v17.2)** — **résolution des données croisées au build** : fiches protocole 426 → 178 Ko, fiches médicament 426 → 192 Ko, pages de liens (revue, triage, spécialités, ECG) 344–420 → 160–179 Ko. Principe : un composant client n'importe une base que s'il en affiche l'intégralité.
- **Phase 9 ✅ (v17.1)** — **index de références statique** (`/ref-index.json`, 381 entrées, 14,4 Ko gzip, précaché) pour les favoris et récents ; **chargement paresseux des annexes de fiche** (guidage + réévaluation) ⇒ budget < 500 Ko tenu sur toutes les pages mesurées ; en-têtes `immutable` dans le serveur d'audit local.
- **Reste possible** — arbitrage documenté sur `/medicaments` (223 Ko : la page affiche l'intégralité des 73 molécules, donc chargement légitime ; une projection par carte ramènerait ~190 Ko, cf. `docs/ARCHITECTURE.md`), relecture médicale humaine du contenu (le seul point qu'aucun test ne peut couvrir), et molécules/arbres supplémentaires selon les disponibilités locales.

## Sécurité & limites

- Clé API IA stockée uniquement dans le localStorage du navigateur — n'entrez votre clé que sur votre appareil personnel.
- Images ECG en IndexedDB (miniatures JPEG ≤ 300 px, max 30 entrées, éviction FIFO — localStorage conservé pour les préférences).
- Les sorties IA sont **indicatives** (photo non calibrée, LLM) : toute interprétation ECG doit être confirmée par un médecin qualifié.
- Toute donnée patient saisie (poids, âge, créatinine, constantes, chronologie) reste **sur l'appareil** : aucun envoi réseau, aucune synchronisation cloud.

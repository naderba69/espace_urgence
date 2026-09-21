# Architecture & guide du contributeur — Espace Urgence TN

> Public : développeurs et agents qui reprennent le projet.
> Compléments : `docs/PROMPT-V2.md` (cahier des charges fonctionnel),
> `docs/DEPLOIEMENT.md`, `CHANGELOG.md` (historique des versions).

---

## 1. Vue d'ensemble

Application **100 % statique** : `next build` produit un dossier `out/` de fichiers HTML/JS/CSS,
publiable sur n'importe quel hébergeur, **sans backend**.

```
Navigateur
  ├── pages HTML prérendues (out/**.html)
  ├── service worker (public/sw.js)  ──▶ cache VERSION « eutn-v17.4 »
  ├── localStorage  : préférences, favoris, récents, patient actif, journal
  └── IndexedDB     : miniatures des images ECG (30 max, FIFO)
```

- **Aucune donnée patient ne quitte l'appareil** (hors appels IA explicites, avec clé utilisateur).
- **i18n** : contenu = `{ fr, ar }`, `dir`/`lang` posés sur `<html>` avant le premier rendu
  (script anti-FOUC dans `app/layout.tsx`), utilitaires **logiques** uniquement
  (`ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`) — jamais `ml-`/`mr-`/`left-`/`right-`.

## 2. Carte du dépôt

| Chemin | Rôle |
|---|---|
| `app/` | Routes App Router. `layout.tsx` monte Header, NavRail, BottomTabs, SearchFab, CommandPalette, UpdateBanner, EmergencyMode, DisclaimerGate |
| `app/globals.css` | Jetons de design (variables CSS), thèmes `.dark`/`.amoled`, impression, utilitaires maison |
| `components/` | UI. `Providers.tsx` = source de vérité unique (langue, thème, favoris, récents, patient actif, service worker) |
| `components/ui/`, `components/cards/`, `components/details/` | Briques réutilisables, cartes de listes, fiches de détail |
| `data/*.ts` | **Contenu médical bilingue** — jamais de logique métier ici |
| `lib/*.ts` | Logique pure : i18n, texte, recherche, calculs, audio, analytics, stockage |
| `public/sw.js` | Service worker (précache + repli hors-ligne) |
| `scripts/*.mjs` | Audits (liens, dictionnaire, débordements, responsive, console) + génération du précache |
| `__tests__/` | Vitest (572 tests) — unitaires + garde-fous de source |

## 3. Flux de données du contenu

```
data/protocols-p2..p12.ts ─┐
data/medications-p2..p11.ts├─▶ data/protocols.ts / data/medications.ts (agrégateurs)
data/calculators.ts       ─┤
data/guidage.ts           ─┼─▶ lib/search-data.ts  (import() dynamique UNIQUEMENT)
data/trees.ts, ecg.ts…    ─┘         │
                                     ▼
                        lib/search.ts (chargeur paresseux + API publique)
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        ▼                            ▼                            ▼
  components/SearchBar.tsx   app/recherche/page.tsx   components/CommandPaletteBody.tsx
  (charge à la 1ʳᵉ frappe)   (charge au montage)      (charge à la 1ʳᵉ ouverture)
```

### Pourquoi cette indirection ?

Mesuré en v16.2 : **483 Ko gzip de JavaScript sur la page d'accueil**, parce que
`CommandPalette` (monté dans `layout.tsx`, donc sur les 343 pages) importait `lib/search.ts`,
qui importait statiquement toute la base médicale. Après refactor v17.0 : **177 Ko (−63 %)**.

## 4. Règles de performance (non négociables)

Vérifiées automatiquement par `__tests__/v17-perf.test.tsx` :

1. **`lib/search-data.ts` et `lib/review-data.ts` ne sont importés que dynamiquement.**
   Un import statique dans `app/`, `components/` ou `lib/` fait échouer les tests.
2. **Aucun composant de `app/layout.tsx` n'importe `@/lib/search`.** Si vous devez ajouter
   une recherche dans l'en-tête ou une barre d'onglets, passez par un `import()` dynamique
   déclenché par l'interaction (voir `CommandPalette.tsx`).
3. **Pour normaliser une chaîne, importer `@/lib/text`**, jamais `@/lib/search`.
4. **Les compteurs d'affichage passent par `data/counts.ts`** — ne réimportez pas
   `protocols`/`medications` juste pour un `.length`.
5. `next/dynamic` avec `ssr: false` pour tout composant lourd non critique au premier rendu.

### Mesurer avant/après

```bash
npm run build && node scripts/static-out.mjs   # sert out/ sur :3000
# Puis, dans un script Playwright : filtrer les ressources dont
# startTime <= navigation.domContentLoadedEventEnd et initiatorType ∈ {script, link}.
```

Cette définition (« JS critique ») évite de compter le **préchargement de liens** de Next.js,
qui fausse toute mesure naïve basée sur `load`.

## 5. Ajouter du contenu

### Un protocole

1. Ouvrir le fichier `data/protocols-pN.ts` le plus récent (ou en créer un, puis l'ajouter à
   l'agrégateur `data/protocols.ts`).
2. Respecter le type `Protocol` (`data/types.ts`) — champs **obligatoires** :
   `sources: string[]` (ex. `"ERC 2021"`) et `meta.lastReviewed: "AAAA-MM"`.
3. Renseigner `trajectory` (si aggravation / pas de réponse / complication → conduite) et
   `severity` (`critical` | `urgent` | `standard`) — la gravité pilote le tri de la recherche.
4. Mettre à jour `data/counts.ts` (`protocols`).
5. Lancer `npm test` : les schémas zod (`lib/validate.ts`) et la fraîcheur éditoriale
   (< 12 mois) sont vérifiés, ainsi que la synchronisation de `counts.ts`.

### Un médicament

Même logique dans `data/medications-pN.ts` (`Medication` : `name`, `klass`, `indications`,
`doses` adulte **et** pédiatrique, `contreIndications`, `effetsIndésirables`, `surveillance`,
`conservation`, `synonyms`, `brands`, `meta`). Puis `data/counts.ts`.

### Un calculateur

`data/calculators.ts` pour la métadonnée + une page dans `app/calculateurs/<id>/page.tsx`.
**Toute fonction de dose/score/débit doit vivre dans `lib/calc.ts` (pure) et être testée** —
c'est une exigence du cahier des charges, et `__tests__/calc.test.ts` en couvre 90.

## 6. Conventions de code

- **TypeScript strict**, aucun `any` implicite, `npx tsc --noEmit` doit sortir à 0.
- **ESLint** : `npm run lint` doit sortir en code 0 (0 erreur, 0 avertissement).
- **Commentaires bilingues** sur les décisions non évidentes : une ligne en français
  (souvent), une ligne en arabe. Les fichiers récents suivent ce modèle.
- **Noms de variables/fonctions en français** (cohérence historique du projet).
- **Cibles tactiles ≥ 44 px** : utiliser la classe `.touch` (définie dans `globals.css`).
- **Pas de bibliothèque lourde** : `lucide-react` et `zod` sont les seules dépendances UI/validation.
- **Tout texte visible** doit passer par `t("clé")` ou `<T fr=… ar=… />` — jamais de chaîne en dur.
  Vérifié par `node scripts/audit-dict.mjs`.
- **Classes directionnelles** : interdites (`ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`,
  `text-left`, `text-right`, `border-l-*`…). Utiliser les équivalents logiques.

## 7. Checklist avant commit

```bash
npx tsc --noEmit                       # 0 erreur
npm run lint                           # 0 erreur, 0 avertissement
npm test                               # 572 tests verts
npm run build                          # export statique + précache OK
node scripts/audit-links.mjs           # 0 lien mort
node scripts/audit-dict.mjs            # 0 clé de traduction manquante
node scripts/static-out.mjs &          # puis :
node scripts/crawl-audit.mjs           # 0 erreur console (343 pages)
node scripts/audit-clips.mjs           # 0 texte tronqué
node scripts/audit-responsive.mjs      # 0 débordement (320/360/768, FR + AR)
```

Versionnage : mettre à jour **`lib/version.ts`** et **`public/sw.js`** ensemble
(un test garde-fou échoue si les deux divergent). Documenter dans `CHANGELOG.md`
**et** dans `data/changelog.ts` (le `/changelog` in-app).

## 8. Points d'attention

### Service worker

**Périmètre du précache (v17.0)** : `scripts/gen-precache.mjs` énumère désormais *toutes* les
pages de premier niveau (`out/<route>/index.html`) au lieu d'une liste codée en dur de 6 onglets.
Mesure avant de trancher : +2 Mo pour les 34 pages de premier niveau, contre +22,6 Mo si l'on
incluait les 310 pages de détail — d'où le choix de laisser **le HTML** des fiches détaillées en
« visitée → mise en cache » (le service worker les stocke à la première navigation).

**Navigation hors-ligne (v17.4)** — ce périmètre laissait deux trous, identifiés en testant le
mode avion : une liste précachée s'ouvrait, mais **toucher une carte aboutissait à la page
« hors-ligne »**. Deux causes, deux correctifs dans `public/sw.js` :

1. **Payloads RSC non interceptés.** Une navigation interne ne demande pas du HTML mais
   `<route>/index.txt?_rsc=…`. Sans branche dédiée, la réponse traversait le SW sans être
   stockée, le `Router` échouait puis relançait une navigation complète.
   ⇒ nouvelle branche *cache-first avec rafraîchissement en arrière-plan* (même famille que
   `_next/`), avec clé normalisée sans le paramètre `_rsc` (unique à chaque requête) et
   `Response.error()` quand le réseau échoue et que rien n'est en cache.
   En complément, `scripts/gen-precache.mjs` précache les payloads des **294 pages de détail** :
   ~577 Ko gzip au total (98 protocoles 425 Ko, 74 médicaments 133 Ko, 131 calculateurs 20 Ko)
   — sans eux, seule une fiche déjà visitée s'ouvrirait.
2. **Chemins variantes.** Un repli de navigation voit souvent `/x/` là où la visite directe a
   stocké `/x` (avec `trailingSlash: true`, le `Router` normalise). Le repli essaie désormais
   `/x`, `/x/`, `/x.html`, `/x/index.html` avant la page « hors-ligne ».
Le script **n'est pas idempotent** : il cherche le marqueur littéral `/*__PRECACHE__*/[]`, donc
il doit tourner sur un `out/sw.js` fraîchement copié (c'est ce que fait `npm run build`).


`public/sw.js` contient le marqueur `/*__PRECACHE__*/[]`. `scripts/gen-precache.mjs`
le remplace après le build par la liste réelle des **1114 entrées** (~17,2 Mo brut, ≈5,8 Mo gzip) : assets `_next` + icônes + `ref-index.json` + les 98 fichiers `/reval/*` + les 34 pages de premier niveau **+ les payloads RSC de navigation (`index.txt`) des 294 pages de détail** (protocoles, médicaments, calculateurs). **Ne jamais supprimer ce
marqueur** : le script sort en erreur si le motif `/*__PRECACHE__*/[]` est absent.
La constante `VERSION` est la clé du cache : l'incrémenter purge l'ancien cache à l'activation.

### Recherche — normalisation (v17.0)

`lib/text.ts` est le cœur de la recherche bilingue. Deux pièges coûteux :

- **`NFD` décompose les alif-hamza** (`أ` → `ا` + `U+0654`). Retirer les diacritiques latins
  sans couvrir `U+064B–U+065F` laisse la hamza survivre et **toute recherche arabe sur ces mots
  échoue silencieusement**. C'était le cas jusqu'en v16.2.
- **`NFD` ne décompose pas `œ`/`æ`** : sans `.replace(/œ/g, "oe")`, « Œdème » ne correspond pas
  à `oedeme`.

Les clés **et** les valeurs de `SYNONYMS` doivent être **déjà normalisées** — un test le vérifie.

### Fiche de références statique — `/ref-index.json` (v17.1)

Les favoris et les récents de l'accueil doivent afficher « Arrêt cardiaque de l'adulte »,
pas `protocole:acr-adulte`. Avant v17.1 il fallait charger **tout** l'index de recherche
(173 Ko gzip) uniquement pour traduire une poignée de clés.

`app/ref-index.json/route.ts` (Route Handler `dynamic = "force-static"`, exporté en fichier
au build sous `output: "export"`) produit 381 entrées `{k, h, t, n:[fr, ar]}` — 58,5 Ko brut,
**14,4 Ko gzip**. `lib/ref-index.ts` le charge une fois (mémoïsé, réessai si échec) et
`resolveRefs()` traduit les clés. Le fichier est **précaché** et servi hors-ligne par la
branche cache-first du SW, sinon les favoris seraient vides en mode avion.

Coût du déploiement : un fichier de plus à la racine du site (le Route Handler disparaît côté
client — il s'exécute au build, jamais dans le navigateur).

### Guidage & réévaluation par fichier (v17.4, ex-v17.1)

`components/details/ProtocolDetail.tsx` importait `data/guidage.ts` (88 Ko brut) et
`data/reval.ts` (232 Ko brut) : ≈ 69 Ko gzip **avant le premier rendu**, pour deux blocs
secondaires. v17.1 les avait déplacés vers un `import()` dynamique — mais la fiche téléchargeait
toujours les deux bases complètes au premier scroll.

v17.4 découpe le problème en deux fichiers de données, servis **hors du bundle JS** :

| Fichier | Contenu | Poids | Consommateur |
|---|---|---|---|
| champ `g` de `/ref-index.json` | `[id, fr, ar]` de la situation de guidage | ~10 octets/ligne | bannière « Commencer ici » de la fiche |
| `GET /reval/<id>` | la boucle de réévaluation du protocole | ~3,4 Ko brut / **1,7 Ko gzip** | panneau `RevalPanel` |

`app/reval/[id]/route.ts` est un Route Handler `dynamic = "force-static"` : au build il produit
98 fichiers JSON (un par protocole ayant un `getReval`), servi en `public, max-age=3600`.
Identifiant inconnu ⇒ `404` avec le corps `"null"` (le client n'affiche alors aucun panneau).
`lib/protocol-extras.ts` expose `loadProtocolExtras(id)` : `ref-index.json` **et** `/reval/<id>`
en `Promise.all`, mémoïsé, ne lève jamais. Il n'importe `Reval` et `GCase` **qu'en type**
(`import type`) : rien des deux bases n'entre dans le bundle.

Fiche protocole : **données de page 17,1 Ko gzip après premier écran** (15,4 Ko de références +
1,7 Ko de réévaluation) au lieu d'un morceau JS de ~320 Ko. La barre de sections n'affiche
« Réévaluation » qu'une fois les données arrivées — aucune entrée morte au clic.

**Pourquoi le cas de guidage complet n'est pas un fichier ?** `data/guidage.ts` porte des
**fonctions** (`predicate` sur les champs, les définitions et les étapes) : le graphe n'est pas
JSON-sérialisable. Seuls `id / fr / ar` sont consommés par la bannière ⇒ ils passent par le
fichier de références ; le moteur reste compilé dans `data/guidage.ts` pour `/guidage`.

### Résolution des données croisées au build (v17.2)

Trois familles de pages téléchargeaient des bases qu'elles n'affichent pas :

| Cas | Avant | Solution |
|---|---|---|
| Fiche protocole | base des 73 médicaments + calculateurs (~260 Ko brut) | `lib/protocol-props.ts` — props calculées au build |
| Fiche médicament | base des 98 protocoles + perfusions (~530 Ko brut) | `lib/medication-props.ts` |
| Pages de liens (spécialités, triage, ECG, revue) | une ou deux bases complètes | `lib/hub-props.ts` + `/ref-index.json` |

**Règle** : un composant client ne doit importer une base que s'il en affiche **l'intégralité**
(cas légitimes : `/protocoles` pour la recherche plein texte, `/quiz-ia` pour générer un quiz).
Sinon, la page serveur (rendue au build grâce à `output: "export"`) résout les objets cités et
les passe en props — ou s'appuie sur le fichier de références, précaché.

Résultat mesuré (JS critique, gzip) : fiche protocole **426 → 178 Ko**, fiche médicament
**426 → 192 Ko**, `/revision` 420 → 170 Ko, `/triage` 351 → 179 Ko, `/pediatrie` 394 → 160 Ko.

### Fichier de références — périmètre v17.3

`/ref-index.json` est devenu la **source d'affichage** de six familles de pages. Ses champs sont
donc volontairement élargis au strict nécessaire de l'écran, jamais au-delà :

| Champ | Contenu | Consommé par |
|---|---|---|
| `k` / `h` / `t` / `n` | clé, lien, type, titres [fr, ar] | favoris, récents, recherche de liens, `/revisions` |
| `r` | date de revue `AAAA-MM` | `/revision`, `/revisions` |
| `c` / `s` / `e` | catégorie, gravité, nombre d'étapes (protocoles) | `/protocoles` |
| `g` (v17.4) | `[id, fr, ar]` de la situation de guidage, si elle existe | bannière de la fiche protocole |

Poids : 381 entrées, **≈68 Ko brut / 15,4 Ko gzip** — contre 173 Ko gzip pour l'index de recherche
complet et ~780 Ko brut pour les trois bases réunies.

**Garde-fou** : `__tests__/data.test.ts` appelle la route et compare chaque champ aux données
sources. Toute évolution d'un champ de données doit être répercutée dans la projection **et**
dans ce test, sinon la CI échoue.

**Règle de conception** : si une page a besoin de plus que ces champs, deux options seulement —
résoudre côté serveur au build (`lib/*-props.ts`) ou `import()` dynamique à l'action de
l'utilisateur. Ne jamais revenir à un import statique d'une base dans un composant client
sauf s'il en affiche l'intégralité.

### Cache HTTP de production (v17.3)

Les morceaux `/_next/static/**` portent un nom haché : ils sont immuables par construction.
`vercel.json` et `public/_headers` déclarent donc `max-age=31536000, immutable` pour eux, et
`must-revalidate` pour `sw.js` et le HTML — un service worker périmé bloquerait les mises à jour,
alors qu'un HTML mis en cache ferait afficher des liens vers des morceaux disparus.

GitHub Pages n'applique aucun en-tête personnalisé ; l'application reste correcte grâce aux noms
hachés et au service worker, mais le gain de cache y est partiel (voir `docs/DEPLOIEMENT.md`).

### Serveur local — en-têtes de cache (v17.1)

`scripts/static-out.mjs` servait `no-store` sur tout : chaque audit local (crawl de 343 pages)
retéléchargeait les mêmes morceaux hachés à chaque navigation, au point de saturer la machine.
Il applique désormais `immutable` sur `/_next/static/**` comme le font Vercel et GitHub Pages.
**Ce n'est pas un correctif d'application** : cela aligne l'outillage local sur la production —
l'item « Cache-Control long côté hébergeur » reste à faire (voir §9).

### Tests « garde-fous de source »

Plusieurs tests lisent le code source plutôt que de l'exécuter (ex.
`expect(header).not.toContain("SearchBar")`). C'est volontaire : ils protègent une
**architecture**, pas un comportement. Si vous déplacez du code, vérifiez ces tests.

### Contenu médical

Chaque fiche porte `sources` + `lastReviewed`, et l'avertissement est vérifié par les tests.
Une modification de dose n'est jamais cosmétique : elle doit être justifiée par un référentiel
cité et signalée dans `CHANGELOG.md` sous « Contenu médical ».

## 9. Optimisations futures identifiées

1. **Fraîcheur du contenu médical** : un garde-fou de 12 mois existe (`__tests__/data.test.ts`)
   et le format des dates est vérifié. La **relecture médicale humaine** reste la seule barrière
   réelle : un test ne peut que signaler, jamais valider une dose.
2. **`/medicaments` (223 Ko gzip)** : la page affiche l'intégralité des 73 molécules et sa
   recherche est plein texte — le chargement est donc légitime, mais une projection par carte
   (comme `ProtocolCard` en v17.3) ramènerait la page autour de 190 Ko. Arbitrage documenté,
   non fait : la recherche plein texte des médicaments perdrait des champs.
3. **`data/guidage.ts`** ✅ *traité en v17.4* — le cas de guidage n'est pas JSON-sérialisable
   (prédicats), mais la fiche ne consommait que `id / fr / ar` : ils passent maintenant par le
   champ `g` de `/ref-index.json`.
